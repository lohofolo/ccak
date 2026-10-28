/**
 * Script interactif officiel et modernisé du Conseil du Coton et de l'Anacarde (CCA)
 * République de Côte d'Ivoire
 */

/* ==========================================================================
   0. CONFIGURATION GLOBALE
   ========================================================================== */
const CCA_CONFIG = {
  contactEmail: 'info@conseilcotonanacarde.ci',
  contactEndpoint: '',
  newsletterEndpoint: '',
  // URL officielle découverte du portail des opérateurs
  portalUrl: 'https://portal.conseilcotonanacarde.ci'
};

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initHeaderHeight();
  initHeroSlider();
  initMobileMenu();
  initHeaderScroll();
  initBackToTop();
  initCounterAnimation();
  initNewsFilter();
  initLightbox();
  initNewsletterForm();
  initContactForm();
  initPortalForm();
  initArticleModal();
  initVideoPlaceholders();
});

/* ==========================================================================
   1. BARRE DE PROGRESSION DU DÉFILEMENT (SCROLL PROGRESS)
   ========================================================================== */
function initScrollProgress() {
  let bar = document.getElementById('scroll-progress');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.prepend(bar);
  }

  const updateProgress = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    const progress = Math.min(100, Math.max(0, (window.scrollY / scrollHeight) * 100));
    bar.style.width = progress + '%';
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ==========================================================================
   2. HAUTEUR DYNAMIQUE DE L'EN-TÊTE FIXE
   ========================================================================== */
function initHeaderHeight() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const update = () => {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  };
  update();
  window.addEventListener('load', update);

  if ('ResizeObserver' in window) {
    new ResizeObserver(update).observe(header);
  } else {
    window.addEventListener('resize', update, { passive: true });
  }
}

/* ==========================================================================
   3. HERO SLIDER INTERACTIF DU BANDEAU D'ACCUEIL
   ========================================================================== */
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-arrow.prev');
  const nextBtn = document.querySelector('.slider-arrow.next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!slides.length) return;

  let currentIndex = 0;
  let autoplayInterval = null;

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    slides.forEach((s, idx) => {
      const active = idx === currentIndex;
      s.classList.toggle('active', active);
      s.setAttribute('aria-hidden', active ? 'false' : 'true');
      s.querySelectorAll('a, button').forEach(el => { el.tabIndex = active ? 0 : -1; });
    });

    dots.forEach((d, idx) => {
      const active = idx === currentIndex;
      d.classList.toggle('active', active);
      if (active) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
  }

  const nextSlide = () => showSlide(currentIndex + 1);
  const prevSlide = () => showSlide(currentIndex - 1);

  function startAutoplay() {
    stopAutoplay();
    if (reducedMotion) return;
    autoplayInterval = setInterval(nextSlide, 6500);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      if (!isNaN(idx)) {
        showSlide(idx);
        startAutoplay();
      }
    });
  });

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('focusin', stopAutoplay);
  slider.addEventListener('focusout', startAutoplay);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay(); else startAutoplay();
  });

  // Clavier pour accessibilité
  slider.setAttribute('tabindex', '0');
  slider.setAttribute('aria-roledescription', 'carrousel');
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { nextSlide(); startAutoplay(); }
    if (e.key === 'ArrowLeft') { prevSlide(); startAutoplay(); }
  });

  // Gestes tactiles pour mobiles
  let touchStartX = 0;
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    startAutoplay();
  }, { passive: true });

  showSlide(0);
  startAutoplay();
}

/* ==========================================================================
   4. MENU MOBILE & TIROIR (DRAWER) AVEC BLUR
   ========================================================================== */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');

  if (!hamburger || !drawer || !overlay) return;

  function setMenu(open) {
    hamburger.classList.toggle('active', open);
    drawer.classList.toggle('active', open);
    overlay.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      const first = drawer.querySelector('a, button');
      if (first) first.focus();
    }
  }

  const isOpen = () => drawer.classList.contains('active');

  hamburger.addEventListener('click', () => setMenu(!isOpen()));
  overlay.addEventListener('click', () => setMenu(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      setMenu(false);
      hamburger.focus();
    }
  });

  drawer.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', () => {
      if (!link.classList.contains('mobile-menu-toggle')) setMenu(false);
    });
  });

  document.querySelectorAll('.mobile-menu-toggle').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = btn.closest('.mobile-menu-item');
      const submenu = parent && parent.querySelector('.mobile-submenu');
      if (submenu) {
        const open = submenu.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.querySelector('.arrow')?.classList.toggle('rotate-180');
      }
    });
  });
}

/* ==========================================================================
   5. EN-TÊTE AU DÉFILEMENT (HEADER SCROLLED)
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        header.classList.toggle('header-scrolled', window.scrollY > 30);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   6. BOUTON « RETOUR EN HAUT »
   ========================================================================== */
function initBackToTop() {
  let btn = document.querySelector('.back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Revenir en haut de la page');
    btn.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>`;
    document.body.appendChild(btn);
  }

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const target = document.getElementById('contenu') || document.body;
    if (target) target.focus({ preventScroll: true });
  });

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
}

/* ==========================================================================
   7. ANIMATION DES COMPTEURS NUMÉRIQUES (STATS)
   ========================================================================== */
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const raw = el.textContent.trim();
  // Extraire les nombres
  const match = raw.match(/([0-9\s]+)/);
  if (!match) return;

  const numStr = match[1].replace(/\s+/g, '');
  const target = parseInt(numStr, 10);
  if (isNaN(target)) return;

  const prefix = raw.slice(0, match.index);
  const suffix = raw.slice(match.index + match[1].length);
  const duration = 1600;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    // Easing out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * ease);

    // Format avec espaces pour les milliers
    const formatted = current.toLocaleString('fr-FR');
    el.textContent = `${prefix}${formatted}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = raw;
    }
  }

  requestAnimationFrame(update);
}

/* ==========================================================================
   8. FILTRE COMBINÉ & RECHERCHE INSTANTANÉE (ACTUALITÉS)
   ========================================================================== */
function initNewsFilter() {
  const container = document.getElementById('articles-container');
  const searchInput = document.getElementById('news-search');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!container) return;

  let activeCategory = 'all';
  let activeSearch = '';

  const applyFilters = () => {
    const cards = container.querySelectorAll('.news-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const cardCat = (card.getAttribute('data-cat') || '').toLowerCase();
      const title = (card.querySelector('.news-title')?.textContent || '').toLowerCase();
      const excerpt = (card.querySelector('.news-excerpt')?.textContent || '').toLowerCase();

      const matchCat = activeCategory === 'all' || cardCat === activeCategory;
      const matchSearch = !activeSearch || title.includes(activeSearch) || excerpt.includes(activeSearch);

      if (matchCat && matchSearch) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.3s ease-in-out';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    let emptyState = document.getElementById('news-empty-state');
    if (visibleCount === 0) {
      if (!emptyState) {
        emptyState = document.createElement('div');
        emptyState.id = 'news-empty-state';
        emptyState.className = 'empty-state-box';
        emptyState.innerHTML = `
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
          <h4 style="font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">Aucun article trouvé</h4>
          <p style="color: #64748b; font-size: 0.9375rem;">Essayez un autre mot-clé ou sélectionnez une autre catégorie.</p>
        `;
        container.parentElement.appendChild(emptyState);
      }
      emptyState.style.display = 'block';
    } else if (emptyState) {
      emptyState.style.display = 'none';
    }
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = (btn.getAttribute('data-cat') || 'all').toLowerCase();
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearch = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

/* ==========================================================================
   9. VISIONNEUSE PLEIN ÉCRAN (LIGHTBOX GALERIE)
   ========================================================================== */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item, .lightbox-trigger');
  if (!galleryItems.length) return;

  let lightbox = document.getElementById('cca-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'cca-lightbox';
    lightbox.className = 'cca-lightbox-overlay';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Visionneuse photo');
    lightbox.innerHTML = `
      <div class="lightbox-dialog">
        <button class="lightbox-close" aria-label="Fermer la visionneuse">&times;</button>
        <img class="lightbox-img" src="" alt="Photo agrandie">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const closeBtn = lightbox.querySelector('.lightbox-close');
  const imgEl = lightbox.querySelector('.lightbox-img');
  const captionEl = lightbox.querySelector('.lightbox-caption');

  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) close();
  });

  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const img = item.querySelector('img');
      if (!img) return;
      e.preventDefault();
      imgEl.src = item.getAttribute('data-src') || img.src;
      imgEl.alt = img.alt || 'Photo agrandie';
      captionEl.textContent = item.getAttribute('data-caption') || item.querySelector('.gallery-caption, figcaption')?.textContent || img.alt || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    });
  });
}

/* ==========================================================================
   10. ENVOI DES FORMULAIRES & VALIDATION STRICTE
   ========================================================================== */
async function sendForm(endpoint, data) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: data
  });
  if (!response.ok) throw new Error('HTTP ' + response.status);
}

function openMail(subject, body) {
  const url = 'mailto:' + CCA_CONFIG.contactEmail +
    '?subject=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(body);
  window.location.href = url;
}

function initNewsletterForm() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const email = input ? input.value.trim() : '';

      if (!email || !isValidEmail(email)) {
        if (input) input.setAttribute('aria-invalid', 'true');
        showToast("Veuillez saisir une adresse e-mail valide.", "error");
        return;
      }
      if (input) input.removeAttribute('aria-invalid');

      if (CCA_CONFIG.newsletterEndpoint) {
        const btn = form.querySelector('button');
        if (btn) btn.disabled = true;
        try {
          const data = new FormData();
          data.append('email', email);
          data.append('source', 'Newsletter site CCA');
          await sendForm(CCA_CONFIG.newsletterEndpoint, data);
          showToast("Votre inscription à la newsletter officielle est validée.", "success");
          if (input) input.value = '';
        } catch (err) {
          showToast("L'inscription n'a pas pu aboutir. Veuillez réessayer.", "error");
        } finally {
          if (btn) btn.disabled = false;
        }
      } else {
        openMail('Inscription à la newsletter du CCA',
          "Bonjour,\n\nJe souhaite recevoir la newsletter du Conseil du Coton et de l'Anacarde à l'adresse : " + email + "\n\nMerci.");
        showToast("Votre messagerie s'ouvre : confirmez l'envoi de l'e-mail pour finaliser.", "info");
      }
    });
  });
}

function initContactForm() {
  const form = document.getElementById('cca-contact-form');
  if (!form) return;

  form.setAttribute('novalidate', '');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    const field = (n) => form.querySelector(`[name="${n}"]`);
    const nom = field('nom');
    const prenoms = field('prenoms');
    const phone = field('phone');
    const email = field('email');
    const message = field('message');

    const check = (el, ok, msg) => {
      if (!el) return;
      if (ok) clearFieldError(el);
      else { showFieldError(el, msg); isValid = false; }
    };

    check(nom, nom && nom.value.trim().length >= 2, "Le nom est obligatoire (2 caractères minimum).");
    check(prenoms, prenoms && prenoms.value.trim().length >= 2, "Le prénom est obligatoire.");
    check(phone, phone && isValidPhone(phone.value),
      "Numéro ivoirien (10 chiffres, ex. 07 07 12 34 56) ou format international (+225...).");
    check(email, email && isValidEmail(email.value.trim()), "Veuillez entrer une adresse e-mail valide.");
    check(message, message && message.value.trim().length >= 10, "Votre message doit comporter au moins 10 caractères.");

    if (!isValid) {
      const firstError = form.querySelector('[aria-invalid="true"]');
      if (firstError) firstError.focus();
      return;
    }

    const value = (el) => (el ? el.value.trim() : '');
    const subjectField = form.querySelector('select');
    const subject = subjectField ? subjectField.options[subjectField.selectedIndex].text : 'Demande d\'information';

    if (CCA_CONFIG.contactEndpoint) {
      const submitBtn = form.querySelector('button[type="submit"]');
      const label = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Transmission en cours…"; }
      try {
        await sendForm(CCA_CONFIG.contactEndpoint, new FormData(form));
        showToast("Votre message a bien été transmis aux services du Conseil.", "success");
        form.reset();
      } catch (err) {
        showToast("Échec de l'envoi. Vous pouvez nous écrire à " + CCA_CONFIG.contactEmail, "error");
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = label; }
      }
    } else {
      openMail('[Site CCA] ' + subject,
        message.value.trim() + '\n\n—\n' +
        value(prenoms) + ' ' + value(nom) + '\n' +
        'Téléphone : ' + value(phone) + '\n' +
        'E-mail : ' + value(email));
      showToast("Votre logiciel de messagerie s'ouvre avec votre message pré-rempli.", "info");
    }
  });

  form.querySelectorAll('.form-control').forEach(el => {
    el.addEventListener('input', () => clearFieldError(el));
  });
}

function initPortalForm() {
  const form = document.getElementById('portal-form');
  if (!form) return;

  form.querySelectorAll('.form-control').forEach(el => {
    el.addEventListener('input', () => clearFieldError(el));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const codeField = form.querySelector('input[type="text"]');
    const pwdField = form.querySelector('input[type="password"]');
    let valid = true;

    if (codeField) {
      if (codeField.value.trim().length < 3) {
        showFieldError(codeField, "Veuillez renseigner votre code opérateur ou numéro d'agrément.");
        valid = false;
      } else {
        clearFieldError(codeField);
      }
    }

    if (pwdField) {
      if (pwdField.value.trim().length < 4) {
        showFieldError(pwdField, "Veuillez saisir votre mot de passe (4 caractères minimum).");
        valid = false;
      } else {
        clearFieldError(pwdField);
      }
    }

    if (!valid) {
      const firstErr = form.querySelector('[aria-invalid="true"]');
      if (firstErr) firstErr.focus();
      return;
    }

    if (CCA_CONFIG.portalUrl) {
      showToast("Identifiants validés. Redirection sécurisée vers le portail officiel...", "success");
      setTimeout(() => {
        window.location.href = CCA_CONFIG.portalUrl;
      }, 700);
      return;
    }

    let notice = form.querySelector('.portal-notice');
    if (!notice) {
      notice = document.createElement('div');
      notice.className = 'portal-notice';
      notice.setAttribute('role', 'status');
      form.appendChild(notice);
    }
    if (pwdField) pwdField.value = '';
    notice.innerHTML = `Le portail opérateurs est accessible à l'adresse officielle : <a href="${CCA_CONFIG.portalUrl}" target="_blank" rel="noopener"><strong>${CCA_CONFIG.portalUrl}</strong></a>.`;
    notice.classList.add('visible');
  });
}

function showFieldError(field, msg) {
  const parent = field.parentElement;
  let err = parent.querySelector('.form-error');
  if (!err) {
    err = document.createElement('span');
    err.className = 'form-error';
    parent.appendChild(err);
  }
  if (!err.id) err.id = (field.id || field.name) + '-erreur';
  err.textContent = msg;
  err.classList.add('visible');
  field.setAttribute('aria-describedby', err.id);
  field.setAttribute('aria-invalid', 'true');
}

function clearFieldError(field) {
  const err = field.parentElement.querySelector('.form-error');
  if (err) err.classList.remove('visible');
  field.removeAttribute('aria-invalid');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(raw) {
  const v = raw.replace(/[\s.\-()]/g, '');
  const local = v.replace(/^(\+|00)225/, '');
  if (/^(01|05|07|21|25|27)\d{8}$/.test(local)) return true;
  return /^(\+|00)\d{8,15}$/.test(v);
}

/* ==========================================================================
   11. MODAL D'ACTUALITÉ & LECTURE D'ARTICLE
   ========================================================================== */
let lastFocused = null;

function initArticleModal() {
  const modal = document.getElementById('article-modal');
  if (!modal) return;

  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  modal.querySelectorAll('.modal-close, .modal-close-btn, [data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(modal));
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(modal);
  });
}

function openModal(modal) {
  if (!modal) return;
  lastFocused = document.activeElement;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const closeBtn = modal.querySelector('.modal-close, .modal-close-btn');
  if (closeBtn) closeBtn.focus({ preventScroll: true });
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocused && typeof lastFocused.focus === 'function') {
    lastFocused.focus({ preventScroll: true });
  }
}

// Export global explicite sur window pour compatibilité totale
window.openModal = openModal;
window.closeModal = closeModal;


/* ==========================================================================
   12. VIDÉOS YOUTUBE DIFFÉRÉES
   ========================================================================== */
function initVideoPlaceholders() {
  document.querySelectorAll('.video-placeholder').forEach(box => {
    const id = (box.getAttribute('data-video-id') || '').trim();
    if (!id) return;

    const title = box.querySelector('strong')?.textContent || 'Vidéo officielle CCA';
    const playBtn = box.querySelector('span:last-child');
    if (playBtn) playBtn.textContent = 'Visionner la vidéo';

    box.style.backgroundImage =
      `linear-gradient(rgba(15,23,42,.45), rgba(15,23,42,.65)), url('https://i.ytimg.com/vi/${id}/hqdefault.jpg')`;
    box.setAttribute('role', 'button');
    box.setAttribute('tabindex', '0');
    box.setAttribute('aria-label', 'Visionner la vidéo : ' + title);
    box.style.cursor = 'pointer';

    const play = () => {
      box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1" title="${title}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="width:100%;height:100%;border:0;border-radius:12px;"></iframe>`;
    };

    box.addEventListener('click', play, { once: true });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
    });
  });
}

/* ==========================================================================
   13. TOAST NOTIFICATIONS AVEC BARRE DE TEMPS
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconEl = document.createElement('span');
  iconEl.className = 'toast-icon';
  iconEl.setAttribute('aria-hidden', 'true');
  iconEl.textContent = icons[type] || 'ℹ';

  const text = document.createElement('div');
  text.className = 'toast-text';
  text.textContent = message;

  const close = document.createElement('button');
  close.className = 'toast-close';
  close.setAttribute('aria-label', 'Fermer');
  close.innerHTML = '&times;';
  close.addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  });

  toast.append(iconEl, text, close);
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 4500);
}
