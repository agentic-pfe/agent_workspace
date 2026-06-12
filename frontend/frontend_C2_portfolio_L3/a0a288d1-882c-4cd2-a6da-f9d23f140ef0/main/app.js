/**
 * Aymen Portfolio — Interactive JavaScript
 * =========================================
 * 1. Section reveal animations (IntersectionObserver + staggered children)
 * 2. Animated skill progress bars (requestAnimationFrame + ease-out)
 * 3. Theme toggle (dark / light) with localStorage persistence
 * 4. Contact form validation, shake animation, toast, localStorage backup
 * 5. Hero CTA smooth-scroll, image placeholder hydration
 * 6. Graceful degradation for browsers without IntersectionObserver
 */

(function () {
  'use strict';

  /* ── Image path map (data-img → actual file) ── */
  const IMAGE_MAP = {
    avatar: 'images/tech_avatar.png',
    project1: 'images/orcheeos_api.png',
    project2: 'images/dataflow_engine.png',
    project3: 'images/auth_microservice.png'
  };

  /* ── Utility: ease-out cubic ── */
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  /* ── Utility: debounce ── */
  const debounce = (fn, ms) => {
    let id;
    return (...args) => {
      clearTimeout(id);
      id = setTimeout(() => fn.apply(null, args), ms);
    };
  };

  /* ============================================================
     1. IMAGE HYDRATION
     ============================================================ */
  function hydrateImages() {
    document.querySelectorAll('img[data-img]').forEach((img) => {
      const key = img.getAttribute('data-img');
      if (!key) return;
      // If src already populated by integration, skip
      if (img.getAttribute('src')) return;
      const path = IMAGE_MAP[key];
      if (path) img.src = path;
    });
  }

  /* ============================================================
     2. SECTION REVEAL ANIMATIONS (IntersectionObserver)
     ============================================================ */
  const ANIMATED_SECTIONS = new Set();
  let progressBarsAnimated = false;

  const CHILD_CARD_SELECTORS = ['.skill-item', '.project-card', '.experience-item'];

  function revealSection(section) {
    if (ANIMATED_SECTIONS.has(section)) return;
    ANIMATED_SECTIONS.add(section);

    // Make the section itself visible
    section.classList.add('visible');

    // Stagger child cards
    const children = section.querySelectorAll(CHILD_CARD_SELECTORS.join(', '));
    children.forEach((child, index) => {
      setTimeout(() => {
        child.classList.add('visible');
      }, index * 150);
    });

    // Trigger progress bars when skills section becomes visible
    if (section.classList.contains('skills')) {
      animateProgressBars();
    }
  }

  function initSectionAnimations() {
    const hero = document.querySelector('.hero');

    // Hero animates immediately after a short delay
    if (hero) {
      setTimeout(() => hero.classList.add('visible'), 100);
    }

    const sections = document.querySelectorAll(
      '.skills, .projects, .experience, .contact, .footer'
    );

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealSection(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      sections.forEach((sec) => observer.observe(sec));
    } else {
      // Fallback: reveal everything at once for older browsers
      sections.forEach((sec) => revealSection(sec));
    }
  }

  /* ============================================================
     3. PROGRESS BAR ANIMATION
     ============================================================ */
  function animateProgressBars() {
    if (progressBarsAnimated) return;
    progressBarsAnimated = true;

    const fills = document.querySelectorAll('.progress-bar-fill');
    const DURATION = 1500; // 1.5 seconds

    fills.forEach((fill) => {
      const target = parseInt(fill.getAttribute('data-percent'), 10);
      if (Number.isNaN(target)) return;

      const skillItem = fill.closest('.skill-item');
      const percentageSpan = skillItem
        ? skillItem.querySelector('.percentage')
        : null;

      const startTime = performance.now();

      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / DURATION, 1);
        const eased = easeOutCubic(progress);
        const currentValue = Math.round(eased * target);

        fill.style.width = currentValue + '%';
        if (percentageSpan) {
          percentageSpan.textContent = currentValue + '%';
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // Ensure final exact value
          fill.style.width = target + '%';
          if (percentageSpan) {
            percentageSpan.textContent = target + '%';
          }
        }
      }

      requestAnimationFrame(step);
    });
  }

  /* ============================================================
     4. THEME TOGGLE
     ============================================================ */
  function initThemeToggle() {
    const toggleBtn = document.querySelector('.theme-toggle');
    const body = document.body;
    if (!toggleBtn) return;

    // Load saved preference
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
    } else {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
    }

    toggleBtn.addEventListener('click', () => {
      const isLight = body.classList.toggle('light-mode');
      body.classList.toggle('dark-mode', !isLight);

      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }

  /* ============================================================
     5. CONTACT FORM VALIDATION & SUBMISSION
     ============================================================ */
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showFieldError(input, message) {
    const group = input.closest('.form-group');
    if (!group) return;
    const errorSpan = group.querySelector('.error-message');
    if (errorSpan) errorSpan.textContent = message;
  }

  function clearFieldError(input) {
    const group = input.closest('.form-group');
    if (!group) return;
    const errorSpan = group.querySelector('.error-message');
    if (errorSpan) errorSpan.textContent = '';
  }

  function validateField(input) {
    const value = input.value.trim();
    const name = input.name;

    if (name === 'name') {
      if (!value) {
        showFieldError(input, 'Please enter your name.');
        return false;
      }
    } else if (name === 'email') {
      if (!value) {
        showFieldError(input, 'Please enter your email.');
        return false;
      }
      if (!EMAIL_REGEX.test(value)) {
        showFieldError(input, 'Please enter a valid email address.');
        return false;
      }
    } else if (name === 'message') {
      if (!value) {
        showFieldError(input, 'Please enter a message.');
        return false;
      }
    }

    clearFieldError(input);
    return true;
  }

  function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input[name], textarea[name]');

    // Real-time validation: clear errors on input, validate on blur
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        if (input.value.trim()) validateField(input);
      });
      input.addEventListener('blur', () => validateField(input));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let allValid = true;
      inputs.forEach((input) => {
        if (!validateField(input)) allValid = false;
      });

      if (!allValid) {
        // Shake the form
        form.classList.add('shake');
        form.addEventListener(
          'animationend',
          () => form.classList.remove('shake'),
          { once: true }
        );
        return;
      }

      // ── Success ──
      const name = form.querySelector('[name="name"]')?.value.trim() || '';
      const email = form.querySelector('[name="email"]')?.value.trim() || '';
      const message = form.querySelector('[name="message"]')?.value.trim() || '';

      // Persist to localStorage
      const payload = {
        name,
        email,
        message,
        timestamp: new Date().toISOString()
      };
      try {
        localStorage.setItem('lastMessage', JSON.stringify(payload));
      } catch (_) {
        // Ignore storage errors (e.g. private mode)
      }

      // Show toast
      showToast('Message sent!');

      // Clear form
      form.reset();
    });
  }

  /* ============================================================
     6. TOAST NOTIFICATION
     ============================================================ */
  let toastTimeoutId = null;

  function showToast(text) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    // Cancel any pending hide
    if (toastTimeoutId) clearTimeout(toastTimeoutId);

    toast.textContent = text;
    toast.style.display = 'block';

    // Force reflow so the browser registers the display change before adding .show
    void toast.offsetWidth;

    toast.classList.add('show');

    toastTimeoutId = setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener(
        'transitionend',
        () => {
          if (!toast.classList.contains('show')) {
            toast.style.display = 'none';
          }
        },
        { once: true }
      );
    }, 3000);
  }

  /* ============================================================
     7. HERO CTA SMOOTH SCROLL
     ============================================================ */
  function initHeroButtons() {
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    if (heroButtons.length >= 1) {
      // "View Projects" → scroll to projects
      heroButtons[0].addEventListener('click', () => {
        document.querySelector('.projects')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
    if (heroButtons.length >= 2) {
      // "Contact Me" → scroll to contact
      heroButtons[1].addEventListener('click', () => {
        document.querySelector('.contact')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  /* ============================================================
     8. FOOTER LINK SMOOTH SCROLL (if internal anchors exist)
     ============================================================ */
  function initFooterLinks() {
    document.querySelectorAll('.footer-link').forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        link.addEventListener('click', (e) => {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    });
  }

  /* ============================================================
     BOOTSTRAP
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    hydrateImages();
    initThemeToggle();
    initSectionAnimations();
    initContactForm();
    initHeroButtons();
    initFooterLinks();
  });
})();
