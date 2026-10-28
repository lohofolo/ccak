# Rapport d'Audit de Sécurité Approfondi (White-Box) — Portail CCA

> **Cible** : Portail Officiel du Conseil du Coton et de l'Anacarde (CCA)  
> **Type d'audit** : Revue de code de sécurité offensive en boîte blanche (White-Box Code Review)  
> **Référentiel visé** : OWASP ASVS v4.0.3 (Niveau 2) & OWASP Top 10 (2021/2023)  
> **Date de réalisation** : 28 octobre 2026  
> **Auditeur** : Consultant Senior Sécurité Offensive & Architecture de Sécurité  

---

## 1. Résumé Exécutif

La posture globale de sécurité de l'application est évaluée à : **🟠 À AMÉLIORER**.  
L'application présente une base front-end saine, sans vulnérabilités d'injection client (DOM XSS vérifié et réfuté) et sans aucune fuite de clés d'API tierces. Cependant, le serveur HTTP Node.js sur mesure souffre de deux vulnérabilités sévères immédiatement exploitables à distance sans authentification :
1. Un **Déni de Service Distant (R-DoS)** par crash non intercepté du processus lors du traitement de requêtes partielles vidéo (`Range` header malformé).
2. Une **Fuite Intégrale du Code Source Serveur et des Fichiers Internes** (`server.js`, `package.json`, `.gitignore`), exposant directement la logique backend et ouvrant la porte à la compromission immédiate d'éventuels fichiers `.env` ou sauvegardes.
3. Une **Absence Totale d'En-têtes de Défense Moderne (CSP, HSTS)** et l'acceptation indifférenciée de méthodes mutantes (`POST`, `PUT`, `DELETE`).

| Sévérité | Décompte |
|---|---|
| 🔴 **CRITIQUE** | **1** |
| 🟠 **HAUTE** | **1** |
| 🟡 **MOYENNE** | **1** |
| 🔵 **BASSE** | **2** |
| ⚪ **INFO** | **1** |
| **TOTAL** | **6** |

**Action la plus urgente** : Corriger immédiatement dans `server.js` la gestion des requêtes vidéo Range avec un contrôle strict des bornes numériques pour immuniser le serveur contre le crash distant, et restreindre la racine servie en isolant les fichiers statiques publics.

---

## 2. Portée & Méthode

- **Périmètre audité** : Intégralité du référentiel local (`server.js`, `package.json`, `index.html`, `a-propos.html`, `filieres.html`, `investir.html`, `actualites.html`, `article.html`, `evenements.html`, `medias.html`, `contact.html`, `connexion.html`, `404.html`, `js/*.js`, `css/*.css`).
- **Méthodologie** : Analyse statique manuelle et dirigée par les menaces (STRIDE), inspection des flux de contrôle et des flux de données, validation par requêtes HTTP locales contrôlées non destructives (PoC reproductibles).
- **Limites** : L'environnement n'est pas rattaché à un dépôt Git actif (absence d'historique de commits à inspecter pour d'anciens secrets révoqués). Le portail externe des opérateurs (`portal.conseilcotonanacarde.ci`) est hors périmètre direct.

---

## 3. Architecture & Frontières de Confiance

### 3.1 Composants de l'Architecture
- **Front-end** : Pages HTML5 statiques sémantiques, feuilles de style CSS modulaires, moteur multilingue bilingue client (`js/translations.js`), lecteur d'articles dynamique (`js/articles-data.js`), composants interactifs (`js/main.js`), cartographie régionale Leaflet (`js/map.js`).
- **Back-end** : Serveur HTTP autonome Node.js sans framework (`server.js`), utilisant les modules natifs `http`, `fs`, `path`, `zlib`. Gestionnaire de cache ETag, compression gzip/deflate et prise en charge des flux Range vidéo.
- **Stockage de données** : Fichiers statiques et dictionnaires de données JavaScript en mémoire. Aucune base de données SQL/NoSQL locale.

### 3.2 Frontières de Confiance
```
[ Utilisateur / Attaquant Web ]
              │  (Requêtes HTTP non authentifiées)
              ▼
   ┌──────────────────────────────────────────┐
   │ Frontière 1 : Serveur Node.js (server.js)│
   │  - Résolution de chemin (Path traversal) │
   │  - En-têtes HTTP (Range, Accept, ETag)   │
   │  - Méthodes HTTP (GET, POST, DELETE...)  │
   └──────────────────────────────────────────┘
              │  (Flux de fichiers statiques)
              ▼
   ┌──────────────────────────────────────────┐
   │ Frontière 2 : Navigateur Client (DOM)    │
   │  - Traitement d'URIs (?id=, hashes)      │
   │  - Redirection externe vers le portail   │
   └──────────────────────────────────────────┘
```

### 3.3 Joyaux de la Couronne
1. **Disponibilité du service** : Continuité de fonctionnement du serveur hébergeant le portail gouvernemental.
2. **Confidentialité du code source & secrets** : Code d'infrastructure, configuration serveur, fichiers de configuration cachés (`.env`, `.git`).
3. **Intégrité de l'information et réputation institutionnelle** : Protection des utilisateurs contre les attaques de phishing, défaçage ou détournement de trafic.

---

## 4. Conclusions CRITIQUES & HAUTES

- 🔴 **CONCLUSION #1** : Déni de Service Distant (R-DoS) par Crash du Processus Node.js sur En-tête Range Invalide (CRITIQUE) — *Réf. [server.js:82-88]*
- 🟠 **CONCLUSION #2** : Fuite Directe du Code Source Backend et des Fichiers Internes via HTTP (HAUTE) — *Réf. [server.js:46-52]*

---

## 5. Chaînes d'Attaque (Attack Chains)

### Chaîne 1 : De la Reconnaissance Passive au Déni de Service Total
1. **Phase d'information** : L'attaquant envoie une requête `GET /server.js`. Le serveur répond `HTTP 200 OK` avec le code source complet de `server.js` (Conclusion #2).
2. **Analyse de vulnérabilité** : En examinant le code obtenu, l'attaquant analyse le bloc de traitement vidéo aux lignes 78-98 et identifie que `parseInt(parts[0], 10)` n'est ni encadré par `isNaN()`, ni encapsulé dans un bloc `try/catch`.
3. **Exploitation DoS** : L'attaquant émet une requête ciblée `GET /assets/video/VID-20200523-WA0002.mp4` avec l'en-tête `Range: bytes=-500` (Conclusion #1).
4. **Impact** : L'exception non interceptée `RangeError [ERR_OUT_OF_RANGE]` arrête net le processus Node.js. Le site web tombe instantanément en panne pour l'ensemble des internautes sans redémarrage manuel ou orchestration superviseur.
- **Sévérité consolidée de la chaîne** : **CRITIQUE**.

---

## 6. Résultats Détaillés par Domaine

---

### CONCLUSION #1 — Déni de Service Distant par Crash du Serveur (Range Header Parsing)
| Champ | Valeur |
|---|---|
| Sévérité | **CRITIQUE** |
| Confiance | **Confirmée** (Crash reproduit et prouvé en local) |
| CVSS v3.1 | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H` → **7.5 (Haute/Critique de disponibilité)** |
| Catégorie | Déni de Service (DoS) / Gestion des Exceptions |
| OWASP | A04:2021 – Insecure Design / A06:2021 – Vulnerable and Outdated Components |
| CWE | CWE-400 (Uncontrolled Resource Consumption) / CWE-754 (Improper Check for Unusual or Exceptional Condition) |
| Emplacement | [server.js:78-99](file:///Users/mr.impertubable/Desktop/Projets/cca-website/server.js#L78-L99) |
| Effort de correction | ~15 minutes |

**Ce qui ne va pas :**  
Dans le gestionnaire de fichiers `.mp4`, le serveur extrait les bornes de streaming vidéo via `req.headers.range`. La valeur reçue est découpée naïvement avec `range.replace(/bytes=/, '').split('-')` sans s'assurer que `start` et `end` sont des entiers valides et cohérents (`start <= end`, `start >= 0`, `end < fileSize`).  
Lorsqu'un client fournit un en-tête tel que `Range: bytes=-500` ou `Range: bytes=test-100`, `start` prend la valeur `NaN`. L'appel natif `fs.createReadStream(filePath, { start, end })` lève alors une exception synchrone `RangeError [ERR_OUT_OF_RANGE]: The value of "start" is out of range`. Comme cette instruction n'est pas dans un bloc `try/catch` et qu'aucun gestionnaire global `process.on('uncaughtException')` n'est configuré, **le processus Node.js s'interrompt immédiatement**.

**Preuve de Vulnérabilité (Trace d'exécution) :**
```bash
# Requête test envoyée :
curl -H "Range: bytes=-500" http://localhost:3001/assets/video/VID-20200523-WA0002.mp4

# Résultat dans le journal du serveur :
node:internal/errors:540
      throw error;
      ^
RangeError [ERR_OUT_OF_RANGE]: The value of "start" is out of range. It must be an integer. Received NaN
    at new ReadStream (node:internal/fs/streams:206:5)
    at Object.createReadStream (node:fs:3160:10)
    at /Users/mr.impertubable/Desktop/Projets/cca-website/server.js:87:25
Process exited with code 1
```

**Impact métier :**  
Indisponibilité totale du portail institutionnel du Conseil du Coton et de l'Anacarde. N'importe quel internaute non authentifié peut neutraliser le site web avec un script d'une seule ligne.

**Code vulnérable :**
```javascript
// server.js:82-87
if (range) {
  const parts = range.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunksize = end - start + 1;
  const file = fs.createReadStream(filePath, { start, end });
```

**Correction recommandée :**
```javascript
if (range) {
  const match = range.match(/^bytes=(\d*)-(\d*)$/);
  if (!match) {
    res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` });
    res.end();
    return;
  }

  let start = match[1] ? parseInt(match[1], 10) : NaN;
  let end = match[2] ? parseInt(match[2], 10) : NaN;

  if (isNaN(start) && isNaN(end)) {
    res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` });
    res.end();
    return;
  }

  if (isNaN(start)) {
    start = Math.max(0, fileSize - end);
    end = fileSize - 1;
  } else if (isNaN(end)) {
    end = fileSize - 1;
  }

  if (start > end || start >= fileSize || end >= fileSize) {
    res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` });
    res.end();
    return;
  }

  try {
    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
      'X-Content-Type-Options': 'nosniff'
    });
    file.pipe(res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Erreur interne de streaming');
  }
  return;
}
```

**Vérification du correctif :**  
Exécuter `curl -i -H "Range: bytes=-500" http://localhost:3001/assets/video/VID-20200523-WA0002.mp4`. Le serveur doit répondre `HTTP 206 Partial Content` (ou `HTTP 416 Range Not Satisfiable`) et rester parfaitement opérationnel sans lever d'exception non interceptée.

---

### CONCLUSION #2 — Exposition Directe du Code Source Backend et des Fichiers Internes
| Champ | Valeur |
|---|---|
| Sévérité | **HAUTE** |
| Confiance | **Confirmée** (Téléchargement vérifié par HTTP) |
| CVSS v3.1 | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N` → **7.5 (Haute)** |
| Catégorie | Exposition de Données Sensibles / Fuite de Code |
| OWASP | A01:2021 – Broken Access Control / A05:2021 – Security Misconfiguration |
| CWE | CWE-552 (Files or Directories Accessible to External Parties) / CWE-200 (Exposure of Sensitive Information) |
| Emplacement | [server.js:46-52](file:///Users/mr.impertubable/Desktop/Projets/cca-website/server.js#L46-L52) |
| Effort de correction | ~20 minutes |

**Ce qui ne va pas :**  
Le serveur Node.js est configuré avec `const ROOT = path.resolve(__dirname);`. La racine publique web correspond exactement au répertoire de travail du projet. Aucune liste noire ni séparation de répertoire (comme `public/` ou `dist/`) n'est appliquée.  
Par conséquent, tout client peut requérir et télécharger des fichiers sensibles :
- `GET /server.js` : Code source Node.js intégral (architecture, logique de streaming, gestion des ports).
- `GET /package.json` : Métadonnées, scripts de démarrage, versions logicielles.
- `GET /.gitignore` : Structure des fichiers internes et répertoires ignorés.
- Si un fichier `.env`, `.git/config` ou des sauvegardes `.sql`/`.bak` venaient à être ajoutés à la racine, ils seraient instantanément téléchargeables par n'importe quel internaute.

**Preuve de Vulnérabilité (Trace d'exécution) :**
```bash
$ curl -s http://localhost:3001/server.js | head -n 5
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const ROOT = path.resolve(__dirname);
```

**Impact métier :**  
Divulgation de la propriété intellectuelle, de la logique interne du serveur, facilitation de la découverte d'autres failles de sécurité, et risque critique de fuite de variables d'environnement (`.env`) en cas de déploiement en production.

**Code vulnérable :**
```javascript
// server.js:46-52
let filePath = path.resolve(ROOT, '.' + path.posix.normalize('/' + decoded));
if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
  res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Accès refusé');
  return;
}
```

**Correction recommandée :**  
Ajouter une liste d'exclusion stricte bloquant les fichiers de configuration, les scripts serveurs, les fichiers cachés (commençant par un point) et les extensions sensibles :
```javascript
const FORBIDDEN_FILES = new Set(['server.js', 'package.json', 'package-lock.json', 'README.md']);

// Vérification dans la requête :
const baseName = path.basename(filePath);
if (baseName.startsWith('.') || FORBIDDEN_FILES.has(baseName)) {
  res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Accès interdit');
  return;
}
```
*Recommandation architecturale* : Séparer physiquement les assets publics dans un dossier `public/` et faire pointer `ROOT` vers `path.join(__dirname, 'public')`.

**Vérification du correctif :**  
Exécuter `curl -i http://localhost:3001/server.js` et `curl -i http://localhost:3001/.gitignore`. Le serveur doit renvoyer systématiquement `HTTP 403 Forbidden` ou `HTTP 404 Not Found`.

---

### CONCLUSION #3 — Absence de Content-Security-Policy (CSP) et HSTS
| Champ | Valeur |
|---|---|
| Sévérité | **MOYENNE** |
| Confiance | **Confirmée** |
| CVSS v3.1 | `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N` → **4.8 (Moyenne)** |
| Catégorie | Mauvaise Configuration de Sécurité (Security Misconfiguration) |
| OWASP | A05:2021 – Security Misconfiguration |
| CWE | CWE-1021 (Improper Restriction of Rendered UI Layers or Frames) / CWE-319 (Cleartext Transmission of Sensitive Information) |
| Emplacement | [server.js:104-111](file:///Users/mr.impertubable/Desktop/Projets/cca-website/server.js#L104-L111) |
| Effort de correction | ~15 minutes |

**Ce qui ne va pas :**  
Le serveur transmet certains en-têtes utiles (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`), mais omet deux piliers indispensables de la défense moderne en profondeur :
1. **Content-Security-Policy (CSP)** : Aucun en-tête CSP n'est défini. Si une faille XSS devait apparaître dans une évolution ultérieure ou via une injection d'attribut, aucun mécanisme ne restreindrait l'exécution de scripts malveillants ni l'exfiltration de données vers des domaines tiers non autorisés.
2. **Strict-Transport-Security (HSTS)** : Absent. Les communications ne sont pas garanties d'être maintenues en HTTPS strict, laissant la porte ouverte aux attaques de déclassement SSL (SSL stripping) sur les réseaux non sécurisés.
3. **Permissions-Policy** : Absent (pas de restriction explicite sur la géolocalisation, le microphone ou la caméra).

**Impact métier :**  
Manque de défense en profondeur contre l'exploitation de failles XSS tierces et risque d'interception de trafic sur les connexions publiques.

**Correction recommandée :**  
Ajouter dans `server.js` les en-têtes durcis :
```javascript
const headers = {
  'Content-Type': contentType,
  'Cache-Control': cacheControl,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*.tile.openstreetmap.org https://i.ytimg.com; frame-src https://www.youtube-nocookie.com; connect-src 'self' https://*.tile.openstreetmap.org;"
};
```

---

### CONCLUSION #4 — Traitement Indifférencié des Méthodes HTTP (POST, PUT, DELETE, TRACE)
| Champ | Valeur |
|---|---|
| Sévérité | **BASSE** |
| Confiance | **Confirmée** |
| CVSS v3.1 | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N` → **5.3 (Basse/Moyenne)** |
| Catégorie | Mauvaise Configuration de Méthode HTTP |
| OWASP | A05:2021 – Security Misconfiguration |
| CWE | CWE-657 (Violation of Secure Design Principles) |
| Emplacement | [server.js:31-60](file:///Users/mr.impertubable/Desktop/Projets/cca-website/server.js#L31-L60) |
| Effort de correction | ~5 minutes |

**Ce qui ne va pas :**  
Le serveur ne valide jamais `req.method`. Toute requête envoyée avec `POST`, `PUT`, `DELETE`, `PATCH` ou `TRACE` est traitée comme un simple `GET` et renvoie le fichier avec un code `HTTP 200 OK`.  
Bien que les fichiers sur le disque ne soient pas écrasés (car `fs.createReadStream` est utilisé en lecture seule), ce comportement viole les spécifications RFC 9110 et la directive OWASP ASVS V5.1 (Restricting HTTP Methods). Cela peut induire en erreur des proxys ou des caches intermédiaires et fausser les diagnostics d'audit automatisés.

**Correction recommandée :**  
Dès l'entrée du routeur dans `server.js` :
```javascript
if (req.method !== 'GET' && req.method !== 'HEAD') {
  res.writeHead(405, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Allow': 'GET, HEAD'
  });
  res.end('Méthode non autorisée');
  return;
}
```

---

### CONCLUSION #5 — Absence de Timeouts HTTP et de Limitation de Débit (Rate Limiting)
| Champ | Valeur |
|---|---|
| Sévérité | **BASSE** |
| Confiance | **Probable** (Dépend de la présence éventuelle d'un reverse proxy en amont) |
| CVSS v3.1 | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:L` → **5.3 (Basse)** |
| Catégorie | Disponibilité / Slowloris DoS |
| OWASP | A04:2021 – Insecure Design |
| CWE | CWE-770 (Allocation of Resources Without Limits or Throttling) |
| Emplacement | [server.js:141-147](file:///Users/mr.impertubable/Desktop/Projets/cca-website/server.js#L141-L147) |
| Effort de correction | ~10 minutes |

**Ce qui ne va pas :**  
L'instance `http.createServer` est initialisée sans configuration explicite de timeouts sur les sockets (`headersTimeout`, `requestTimeout`, `keepAliveTimeout`). Si le serveur est exposé directement sans reverse proxy (Nginx, Caddy ou Cloudflare), un attaquant peut maintenir des milliers de sockets ouvertes en transmettant des données au compte-gouttes (attaque de type Slowloris).

**Correction recommandée :**
```javascript
server.headersTimeout = 10000;  // 10 secondes max pour recevoir les en-têtes
server.requestTimeout = 30000;  // 30 secondes max pour la requête complète
server.keepAliveTimeout = 5000; // 5 secondes pour les sockets réutilisées
```

---

### CONCLUSION #6 — Formulaire de Connexion Mimant une Authentification Locale
| Champ | Valeur |
|---|---|
| Sévérité | **INFO** |
| Confiance | **Confirmée** |
| CVSS v3.1 | `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:N/A:N` → **0.0 (Info)** |
| Catégorie | Clarté de la Logique Métier / Expérience Opérateur |
| OWASP | A07:2021 – Identification and Authentication Failures |
| CWE | CWE-1007 (Insufficient Visual Distinction of System State) |
| Emplacement | [connexion.html:134-179](file:///Users/mr.impertubable/Desktop/Projets/cca-website/connexion.html#L134-L179), [js/main.js:592-628](file:///Users/mr.impertubable/Desktop/Projets/cca-website/js/main.js#L592-L628) |
| Effort de correction | ~10 minutes |

**Ce qui ne va pas :**  
La page `connexion.html` présente un formulaire demandant un code opérateur et un mot de passe. Cependant, la validation client valide simplement la présence des données et effectue une redirection `window.location.href` vers le portail officiel externe (`portal.conseilcotonanacarde.ci`). Les identifiants saisis ne sont pas transmis au portail.  
Bien que cela protège les identifiants d'une interception locale (aucun mot de passe n'est loggué), un opérateur légitime pourrait s'étonner de devoir saisir deux fois son mot de passe, ou un auditeur externe pourrait suspecter une page de phishing si le site était hébergé sur un domaine non officiel.

**Correction recommandée :**  
Indiquer explicitement sur la page que l'authentification s'effectue sur le Guichet Unique National sécurisé, ou transformer le formulaire en un bouton d'accès direct SSO / Extranet vers `https://portal.conseilcotonanacarde.ci`.

---

## 7. Victoires Rapides (< 10 min)

1. **Rejet des méthodes HTTP invalides** ([server.js:32](file:///Users/mr.impertubable/Desktop/Projets/cca-website/server.js#L32)) : 3 lignes de code pour bloquer `POST`, `PUT`, `DELETE` avec `405 Method Not Allowed`.
2. **Masquage des fichiers internes et dotfiles** ([server.js:48](file:///Users/mr.impertubable/Desktop/Projets/cca-website/server.js#L48)) : Bloquer toute requête vers `.*` ou `*.js` non situé dans `/js/`.
3. **Configuration des timeouts de sockets** ([server.js:145](file:///Users/mr.impertubable/Desktop/Projets/cca-website/server.js#L145)) : Définir `server.requestTimeout` et `server.headersTimeout`.

---

## 8. Plan de Remédiation Priorisé

| Priorité | Conclusion | Action Requise | Effort Estimé |
|---|---|---|---|
| **P0 (Urgent)** | **Conclusion #1** (Crash DoS Range) | Valider rigoureusement les bornes de `Range`, gérer les exceptions dans `fs.createReadStream`, renvoyer 416 si invalide. | **15 min** |
| **P1** | **Conclusion #2** (Fuite de code source) | Restreindre l'accès à `server.js`, `package.json`, `.gitignore` et interdire les fichiers débutant par `.`. | **20 min** |
| **P2** | **Conclusion #3** (En-têtes CSP & HSTS) | Injecter les en-têtes `Content-Security-Policy` et `Strict-Transport-Security` dans les réponses serveur. | **15 min** |
| **P3** | **Conclusion #4** (Méthodes HTTP) | Restreindre strictement aux méthodes `GET` et `HEAD` avec statut `405 Method Not Allowed`. | **5 min** |
| **P4** | **Conclusion #5** (Timeouts DoS) | Fixer les timeouts de sockets pour neutraliser les attaques lentes de type Slowloris. | **10 min** |
| **P5** | **Conclusion #6** (Clarté Extranet) | Clarifier la redirection vers le portail officiel pour éviter toute ambiguïté opérateur. | **10 min** |

---

## 9. Ce qui est Déjà Bien Fait (Bonnes Pratiques Confirmées)

1. **Protection Anti-Path Traversal robuste** : L'utilisation combinée de `path.posix.normalize` et de la vérification stricte `filePath.startsWith(ROOT + path.sep)` neutralise efficacement les attaques de type `../`, `%2e%2e` et double encodage.
2. **Absence de dépendances vulnérables** : Zéro dépendance npm (`node_modules` inexistant), ce qui élimine 100% des risques de supply-chain attacks, typosquatting ou failles de packages tiers.
3. **Protection contre le DOM XSS** : Dans `article.html` et `actualites.html`, les paramètres d'URL sont typés en entier (`parseInt`) et les données dynamiques sont injectées via `textContent`.
4. **Protection contre le Reverse Tabnabbing** : Tous les liens sortants avec `target="_blank"` sont protégés par `rel="noopener"` ou `rel="noopener noreferrer"`.
5. **Gestion saine du cache et de la compression** : ETag calculés via taille/mtime et support fluide de gzip/deflate.

---

## 10. Limites & Vérifications Manuelles Restantes

1. **Certificat SSL/TLS et Terminaison HTTPS** : L'audit s'est déroulé en local sur `http://localhost:3001`. En production, s'assurer qu'un reverse proxy (Nginx, Traefik, AWS ALB ou Cloudflare) termine le protocole TLS 1.3 avec redirection automatique HTTP → HTTPS.
2. **Surveillance et Pare-feu applicatif (WAF)** : Vérifier que le WAF en production bloque les scans agressifs et inspecte les requêtes volumineuses.
3. **Gestion des variables d'environnement en production** : Veiller à ce qu'aucun fichier `.env` ne soit déposé dans le répertoire servi publiquement.

---

## 11. Matrice de Couverture

| Réf. | Domaine / Contrôle | Statut | Commentaire |
|---|---|:---:|---|
| **A.1** | Secrets codés en dur | ✅ PASSE | Recherche exhaustive négative sur clés privées, JWT et API keys. |
| **A.2** | `.gitignore` exhaustif | ⚠️ PARTIEL | Ne liste pas `.env` ni `*.bak`. |
| **A.3** | Historique Git | ⬚ N/A | Aucun dépôt `.git` dans le workspace. |
| **A.4** | Fichiers internes et code exposés | ❌ ÉCHOUE | `server.js`, `package.json`, `.gitignore` servis en HTTP 200 (Conclusion #2). |
| **B.1** | Gestion des sessions | ⬚ N/A | Site vitrine d'information, pas de gestion de session locale. |
| **B.2** | Stockage client sensible | ✅ PASSE | Aucun token d'authentification dans `localStorage`. |
| **C.1** | BOLA / IDOR | ⬚ N/A | Pas d'API d'accès à des ressources privées. |
| **C.2** | BFLA (Contrôle niveau fonction) | ⬚ N/A | Pas de console d'administration back-office locale. |
| **D.1** | Injections SQL / NoSQL | ⬚ N/A | Aucune base de données locale. |
| **D.2** | XSS / DOM-XSS | ✅ PASSE | Données dynamiques traitées via `parseInt` et `textContent`. |
| **D.3** | Path Traversal | ✅ PASSE | Vérification `startsWith(ROOT + path.sep)` validée. |
| **D.4** | Injection de commande | ⬚ N/A | Aucun sous-processus système invoqué. |
| **D.5** | Méthodes HTTP autorisées | ❌ ÉCHOUE | `POST`, `PUT`, `DELETE` renvoient HTTP 200 (Conclusion #4). |
| **E.1** | Logique métier & Paiements | ⬚ N/A | Aucun paiement en ligne ni gestion de panier. |
| **F.1** | Base de données / BaaS | ⬚ N/A | Aucun service Supabase/Firebase configuré. |
| **G.1** | Dépendances & vulnérabilités npm | ✅ PASSE | 0 dépendance npm externe. Leaflet local. |
| **G.2** | Scripts postinstall malveillants | ✅ PASSE | Aucun script suspect dans `package.json`. |
| **H.1** | Disponibilité & Parsing Range (DoS) | ❌ ÉCHOUE | Crash fatal immédiat du serveur sur Range invalide (Conclusion #1). |
| **H.2** | Rate Limiting & Timeouts | ⚠️ PARTIEL | Aucun timeout de socket explicite (Conclusion #5). |
| **I.1** | Content-Security-Policy (CSP) | ❌ ÉCHOUE | Absent des en-têtes HTTP (Conclusion #3). |
| **I.2** | Transport HTTPS & HSTS | ❌ ÉCHOUE | Absent des en-têtes HTTP (Conclusion #3). |
| **I.3** | X-Content-Type-Options | ✅ PASSE | Présent (`nosniff`). |
| **I.4** | X-Frame-Options | ⚠️ PARTIEL | Présent sur 200, absent sur 404. |
| **I.5** | Referrer-Policy | ✅ PASSE | Présent (`strict-origin-when-cross-origin`). |
| **J.1** | Téléversement de fichiers | ⬚ N/A | Aucune fonction d'upload. |
| **K.1** | Fonctionnalités IA / LLM | ⬚ N/A | Aucun LLM intégré. |
| **L.1** | Journalisation et observabilité | ⚠️ PARTIEL | Absence de logs d'accès serveur. |

### Décompte Global :
- ✅ **PASSE** : 8
- ❌ **ÉCHOUE** : 5
- ⚠️ **PARTIEL** : 4
- ⬚ **N/A** : 10
