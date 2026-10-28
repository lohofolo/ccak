const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..');

// Fichiers internes et configurations strictement interdits en accès public
const FORBIDDEN_BASENAMES = new Set([
  'server.js',
  'package.json',
  'package-lock.json',
  'README.md',
  'SECURITY_AUDIT.md',
  'vercel.json',
  '.vercelignore'
]);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4'
};

const COMPRESSIBLE_EXTS = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg']);

/**
 * Générateur d'en-têtes HTTP de sécurité renforcés (OWASP ASVS & ANSSI)
 */
function getSecurityHeaders(contentType, extra = {}) {
  return {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*.tile.openstreetmap.org https://i.ytimg.com; frame-src https://www.youtube-nocookie.com; connect-src 'self' https://*.tile.openstreetmap.org; base-uri 'self'; form-action 'self' https://portal.conseilcotonanacarde.ci; frame-ancestors 'self';",
    ...extra
  };
}

const server = http.createServer((req, res) => {
  // 1. Restriction des méthodes HTTP autorisées (GET et HEAD uniquement)
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, getSecurityHeaders('text/plain; charset=utf-8', {
      'Allow': 'GET, HEAD'
    }));
    res.end('Méthode non autorisée');
    return;
  }

  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/' || reqUrl === '') {
    reqUrl = '/index.html';
  }

  let decoded;
  try {
    decoded = decodeURIComponent(reqUrl);
  } catch (e) {
    res.writeHead(400, getSecurityHeaders('text/plain; charset=utf-8'));
    res.end('Requête invalide');
    return;
  }

  // 2. Sécurité anti Path Traversal
  let filePath = path.resolve(ROOT, '.' + path.posix.normalize('/' + decoded));
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
    res.writeHead(403, getSecurityHeaders('text/plain; charset=utf-8'));
    res.end('Accès refusé');
    return;
  }

  // 3. Blocage strict des fichiers internes, dotfiles et scripts serveur
  const relativeFromRoot = path.relative(ROOT, filePath);
  const segments = relativeFromRoot.split(path.sep);
  const baseName = path.basename(filePath);

  const isDotFile = segments.some(seg => seg.startsWith('.'));
  const isForbiddenInternal = FORBIDDEN_BASENAMES.has(baseName);
  const isServerDir = segments.includes('server');

  if (isDotFile || isForbiddenInternal || isServerDir) {
    res.writeHead(403, getSecurityHeaders('text/plain; charset=utf-8'));
    res.end('Accès interdit aux fichiers internes du serveur');
    return;
  }

  // Support des URL sans extension .html
  if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, getSecurityHeaders('text/html; charset=utf-8'));
      const errorPage = path.join(ROOT, '404.html');
      if (fs.existsSync(errorPage)) {
        if (req.method === 'HEAD') {
          res.end();
        } else {
          fs.createReadStream(errorPage).pipe(res);
        }
      } else {
        res.end('<h1>404 - Page non trouvée</h1>');
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // 4. Gestion sécurisée et robuste des flux vidéo MP4 (Protection Anti-DoS sur Range)
    if (ext === '.mp4') {
      const range = req.headers.range;
      const fileSize = stats.size;

      if (range) {
        const match = range.match(/^bytes=(\d*)-(\d*)$/);
        if (!match) {
          res.writeHead(416, getSecurityHeaders('text/plain; charset=utf-8', {
            'Content-Range': `bytes */${fileSize}`
          }));
          res.end('Plage demandée non satisfaisante');
          return;
        }

        let start = match[1] !== '' ? parseInt(match[1], 10) : NaN;
        let end = match[2] !== '' ? parseInt(match[2], 10) : NaN;

        if (isNaN(start) && isNaN(end)) {
          res.writeHead(416, getSecurityHeaders('text/plain; charset=utf-8', {
            'Content-Range': `bytes */${fileSize}`
          }));
          res.end('Plage demandée non satisfaisante');
          return;
        }

        if (isNaN(start)) {
          start = Math.max(0, fileSize - end);
          end = fileSize - 1;
        } else if (isNaN(end)) {
          end = fileSize - 1;
        }

        // Vérification stricte des bornes numériques
        if (start > end || start >= fileSize || end >= fileSize || start < 0) {
          res.writeHead(416, getSecurityHeaders('text/plain; charset=utf-8', {
            'Content-Range': `bytes */${fileSize}`
          }));
          res.end('Plage demandée non satisfaisante');
          return;
        }

        try {
          const chunksize = end - start + 1;
          res.writeHead(206, getSecurityHeaders('video/mp4', {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Cache-Control': 'no-cache, must-revalidate'
          }));

          if (req.method === 'HEAD') {
            res.end();
            return;
          }

          const file = fs.createReadStream(filePath, { start, end });
          file.on('error', () => {
            if (!res.headersSent) {
              res.writeHead(500, getSecurityHeaders('text/plain; charset=utf-8'));
            }
            res.end();
          });
          file.pipe(res);
        } catch (streamErr) {
          if (!res.headersSent) {
            res.writeHead(500, getSecurityHeaders('text/plain; charset=utf-8'));
          }
          res.end('Erreur lors du streaming');
        }
        return;
      }
    }

    // 5. Gestion du cache avec revalidation systématique ETag
    const etag = `W/"${stats.size.toString(16)}-${stats.mtime.getTime().toString(16)}"`;
    const headers = getSecurityHeaders(contentType, {
      'Cache-Control': 'no-cache, must-revalidate',
      'ETag': etag
    });

    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, headers);
      res.end();
      return;
    }

    // Réponse aux requêtes HEAD
    if (req.method === 'HEAD') {
      headers['Content-Length'] = stats.size;
      res.writeHead(200, headers);
      res.end();
      return;
    }

    // 6. Compression Gzip / Deflate pour les fichiers textes et scripts
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const shouldCompress = COMPRESSIBLE_EXTS.has(ext);

    if (shouldCompress && /\bgzip\b/.test(acceptEncoding)) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res);
    } else if (shouldCompress && /\bdeflate\b/.test(acceptEncoding)) {
      headers['Content-Encoding'] = 'deflate';
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(zlib.createDeflate()).pipe(res);
    } else {
      headers['Content-Length'] = stats.size;
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

// 7. Durcissement des timeouts réseau contre les attaques lentes (Slowloris)
server.headersTimeout = 10000;  // 10 secondes max pour les en-têtes
server.requestTimeout = 30000;  // 30 secondes max pour la requête complète
server.keepAliveTimeout = 5000; // 5 secondes pour les sockets maintenues

process.on('uncaughtException', (err) => {
  console.error('Erreur non interceptée interceptée par le superviseur :', err);
});

let currentPort = parseInt(process.env.PORT, 10) || 3000;

function startServer(port) {
  server.listen(port);
}

server.on('listening', () => {
  const address = server.address();
  console.log(`=======================================================`);
  console.log(` Conseil du Coton et de l'Anacarde (CCA) - Serveur Web `);
  console.log(` Sécurité renforcée : CSP, HSTS, Anti-DoS, Anti-Leak  `);
  console.log(` Accès local : http://localhost:${address.port}`);
  console.log(`=======================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${currentPort} déjà utilisé. Basculement sur le port ${currentPort + 1}...`);
    currentPort++;
    startServer(currentPort);
  } else {
    console.error('Erreur du serveur :', err);
  }
});

startServer(currentPort);
