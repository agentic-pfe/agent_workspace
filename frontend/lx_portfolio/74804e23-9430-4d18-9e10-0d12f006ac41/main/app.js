/**
 * ============================================
 *  APP.JS — Aymen Portfolio
 *  Theme toggle, scroll animations, form validation
 * ============================================
 */

(function () {
  'use strict';

  // =============================================
  //  DOM REFERENCES
  // =============================================
  const html = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.site-header');
  const themeToggle = document.getElementById('theme-toggle');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastClose = document.querySelector('.toast-close');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  // =============================================
  //  1. THEME TOGGLE (localStorage persisted)
  // =============================================
  const THEME_KEY = 'aymen-portfolio-theme';

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // localStorage not available
    }
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setStoredTheme(next);
  }

  // Initialize theme
  const storedTheme = getStoredTheme();
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    // Default to dark
    applyTheme('dark');
  }

  themeToggle.addEventListener('click', toggleTheme);

  // =============================================
  //  2. MOBILE MENU TOGGLE
  // =============================================
  function openMenu() {
    navLinks.classList.add('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    // Trap focus (basic)
    const firstLink = navLinks.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    navLinks.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    const expanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  mobileMenuToggle.addEventListener('click', toggleMenu);

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (navLinks.classList.contains('active')) {
        closeMenu();
      }
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      closeMenu();
      mobileMenuToggle.focus();
    }
  });

  // =============================================
  //  3. HEADER SCROLL EFFECT
  // =============================================
  function updateHeaderScroll() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  // Initial check
  updateHeaderScroll();

  // =============================================
  //  4. HIDE SCROLL INDICATOR ON SCROLL
  // =============================================
  function updateScrollIndicator() {
    if (!scrollIndicator) return;
    if (window.scrollY > 150) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.pointerEvents = 'none';
    } else {
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.pointerEvents = 'auto';
    }
  }

  window.addEventListener('scroll', updateScrollIndicator, { passive: true });

  // =============================================
  //  5. INTERSECTION OBSERVER — Section Reveals
  // =============================================
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.12,
  };

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  // Observe section-reveal elements
  document.querySelectorAll('.section-reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // =============================================
  //  6. INTERSECTION OBSERVER — Skill Bar Fills
  // =============================================
  const skillObserverOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.2,
  };

  const skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const fillBar = entry.target.querySelector('.skill-fill');
        if (fillBar) {
          fillBar.classList.add('animate');
        }
        skillObserver.unobserve(entry.target);
      }
    });
  }, skillObserverOptions);

  document.querySelectorAll('.skill-item').forEach(function (el) {
    skillObserver.observe(el);
  });

  // =============================================
  //  7. INTERSECTION OBSERVER — Staggered Cards
  // =============================================
  const staggerObserverOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  const staggerObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, staggerObserverOptions);

  document.querySelectorAll('.stagger-card').forEach(function (el) {
    staggerObserver.observe(el);
  });

  // =============================================
  //  8. INTERSECTION OBSERVER — Timeline Items
  // =============================================
  const timelineObserverOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15,
  };

  const timelineObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        timelineObserver.unobserve(entry.target);
      }
    });
  }, timelineObserverOptions);

  document.querySelectorAll('.timeline-item').forEach(function (el) {
    timelineObserver.observe(el);
  });

  // =============================================
  //  9. SMOOTH ANCHOR SCROLL (fallback)
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // =============================================
  //  10. CONTACT FORM VALIDATION
  // =============================================
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  function showFieldError(input, errorEl) {
    input.classList.add('input-error');
    input.classList.remove('input-success');
    if (errorEl) {
      errorEl.classList.add('visible');
    }
  }

  function clearFieldError(input, errorEl) {
    input.classList.remove('input-error');
    if (errorEl) {
      errorEl.classList.remove('visible');
    }
  }

  function markFieldSuccess(input) {
    input.classList.remove('input-error');
    input.classList.add('input-success');
  }

  function validateName(value) {
    return value.trim().length >= 2;
  }

  function validateEmail(value) {
    // RFC 5322–like basic email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function validateMessage(value) {
    return value.trim().length >= 10;
  }

  // Real-time validation on blur
  nameInput.addEventListener('blur', function () {
    if (this.value.length > 0 && !validateName(this.value)) {
      showFieldError(this, nameError);
    } else if (this.value.length > 0) {
      markFieldSuccess(this);
      clearFieldError(this, nameError);
    }
  });

  emailInput.addEventListener('blur', function () {
    if (this.value.length > 0 && !validateEmail(this.value)) {
      showFieldError(this, emailError);
    } else if (this.value.length > 0) {
      markFieldSuccess(this);
      clearFieldError(this, emailError);
    }
  });

  messageInput.addEventListener('blur', function () {
    if (this.value.length > 0 && !validateMessage(this.value)) {
      showFieldError(this, messageError);
    } else if (this.value.length > 0) {
      markFieldSuccess(this);
      clearFieldError(this, messageError);
    }
  });

  // Clear errors on input
  [nameInput, emailInput, messageInput].forEach(function (input) {
    input.addEventListener('input', function () {
      if (this.classList.contains('input-error')) {
        this.classList.remove('input-error');
      }
      if (this.classList.contains('input-success')) {
        this.classList.remove('input-success');
      }
      // Hide associated error
      const errorId = this.id + '-error';
      const errorEl = document.getElementById(errorId);
      if (errorEl && errorEl.classList.contains('visible')) {
        errorEl.classList.remove('visible');
      }
    });
  });

  // ---- Toast Notification ----
  let toastTimeout;

  function showToast(message, duration) {
    duration = duration || 4000;
    const toastMsg = toast.querySelector('.toast-message');
    if (toastMsg) {
      toastMsg.textContent = message;
    }
    toast.classList.add('visible');
    toast.setAttribute('aria-hidden', 'false');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(hideToast, duration);
  }

  function hideToast() {
    toast.classList.remove('visible');
    toast.setAttribute('aria-hidden', 'true');
    clearTimeout(toastTimeout);
  }

  if (toastClose) {
    toastClose.addEventListener('click', hideToast);
  }

  // ---- Form Submit ----
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    let hasError = false;

    // Validate name
    if (!validateName(nameInput.value)) {
      showFieldError(nameInput, nameError);
      hasError = true;
    } else {
      markFieldSuccess(nameInput);
      clearFieldError(nameInput, nameError);
    }

    // Validate email
    if (!validateEmail(emailInput.value)) {
      showFieldError(emailInput, emailError);
      hasError = true;
    } else {
      markFieldSuccess(emailInput);
      clearFieldError(emailInput, emailError);
    }

    // Validate message
    if (!validateMessage(messageInput.value)) {
      showFieldError(messageInput, messageError);
      hasError = true;
    } else {
      markFieldSuccess(messageInput);
      clearFieldError(messageInput, messageError);
    }

    if (hasError) {
      // Scroll to first error
      const firstError = contactForm.querySelector('.input-error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Re-trigger shake animation on errored fields
      contactForm.querySelectorAll('.input-error').forEach(function (input) {
        input.style.animation = 'none';
        // Force reflow
        void input.offsetWidth;
        input.style.animation = 'shake 0.5s ease-in-out';
      });

      return;
    }

    // Simulate successful submission
    contactForm.reset();
    contactForm.querySelectorAll('.input-success').forEach(function (input) {
      input.classList.remove('input-success');
    });

    showToast('Message sent successfully! I\'ll get back to you soon.', 4500);
  });

  // =============================================
  //  11. INITIALIZE — reveal elements already in view
  // =============================================
  // Small delay to let CSS transitions initialize
  function checkInitialVisibility() {
    // Reveal hero section immediately
    var heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.classList.add('revealed');
    }
  }

  // Run after a short delay so the initial paint is done
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkInitialVisibility);
  } else {
    checkInitialVisibility();
  }

})();
