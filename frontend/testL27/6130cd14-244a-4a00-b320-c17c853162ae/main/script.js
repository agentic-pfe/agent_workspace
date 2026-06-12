/* ===========================
   LANDING PAGE — script.js
   Mobile nav, form validation,
   back-to-top, smooth scroll
   =========================== */

(function () {
  'use strict';

  /* ---------- DOM refs ---------- */
  const toggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  const backToTop = document.getElementById('backToTop');
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  /* =============================================
     1.  MOBILE NAV TOGGLE
     ============================================= */
  if (toggle && navList) {
    function openNav(open) {
      navList.classList.toggle('nav__list--open', open);
      toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', function () {
      const isOpen = navList.classList.contains('nav__list--open');
      openNav(!isOpen);
    });

    // Close nav when a link is clicked
    navList.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        openNav(false);
      });
    });

    // Close nav when clicking outside
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !navList.contains(e.target)) {
        openNav(false);
      }
    });

    // Close nav on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navList.classList.contains('nav__list--open')) {
        openNav(false);
        toggle.focus();
      }
    });
  }

  /* =============================================
     2.  BACK TO TOP
     ============================================= */
  if (backToTop) {
    let lastScrollY = window.scrollY;

    function updateBackToTop() {
      const scrollY = window.scrollY;
      const hero = document.getElementById('hero');
      const heroBottom = hero ? hero.offsetHeight : window.innerHeight;

      if (scrollY > heroBottom) {
        backToTop.classList.add('back-to-top--visible');
        backToTop.setAttribute('tabindex', '0');
      } else {
        backToTop.classList.remove('back-to-top--visible');
        backToTop.setAttribute('tabindex', '-1');
      }
      lastScrollY = scrollY;
    }

    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateBackToTop();
          ticking = false;
        });
        ticking = true;
      }
    });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =============================================
     3.  CONTACT FORM VALIDATION
     ============================================= */
  if (form) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('formSubmit');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');

    const fields = [
      { el: nameInput, error: nameError, validate: validateName },
      { el: emailInput, error: emailError, validate: validateEmail },
      { el: subjectInput, error: subjectError, validate: validateSubject },
      { el: messageInput, error: messageError, validate: validateMessage },
    ];

    function validateName(val) {
      return val.trim().length >= 2 ? '' : 'Name must be at least 2 characters.';
    }

    function validateEmail(val) {
      if (!val.trim()) return 'Email is required.';
      // Simple email regex for front-end validation
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(val.trim()) ? '' : 'Please enter a valid email address.';
    }

    function validateSubject(val) {
      return val.trim().length >= 3 || val.trim().length === 0
        ? ''
        : 'Subject must be at least 3 characters.';
    }

    function validateMessage(val) {
      return val.trim().length >= 10
        ? ''
        : 'Message must be at least 10 characters.';
    }

    function showFieldError(field, msg) {
      if (msg) {
        field.el.setAttribute('aria-invalid', 'true');
        field.error.textContent = msg;
        field.error.classList.add('form-error--visible');
      } else {
        field.el.removeAttribute('aria-invalid');
        field.error.textContent = '';
        field.error.classList.remove('form-error--visible');
      }
    }

    function validateField(field) {
      var msg = field.validate(field.el.value);
      showFieldError(field, msg);
      return !msg;
    }

    // Real-time validation on blur and input
    fields.forEach(function (f) {
      if (!f.el) return;

      f.el.addEventListener('blur', function () {
        validateField(f);
      });

      f.el.addEventListener('input', function () {
        // Only re-validate if field was previously invalid
        if (f.el.hasAttribute('aria-invalid')) {
          validateField(f);
        }
      });
    });

    // Form submit
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validate all fields
      var allValid = fields.reduce(function (acc, f) {
        return validateField(f) && acc;
      }, true);

      if (!allValid) {
        // Focus first invalid field
        var firstInvalid = fields.find(function (f) {
          return f.el && f.el.hasAttribute('aria-invalid');
        });
        if (firstInvalid) {
          firstInvalid.el.focus();
        }
        return;
      }

      // Simulate submission
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      setTimeout(function () {
        // Show success
        if (formSuccess) {
          formSuccess.classList.add('form-success--visible');
        }

        // Reset form
        form.reset();

        // Clear all errors
        fields.forEach(function (f) {
          if (f.el) f.el.removeAttribute('aria-invalid');
          if (f.error) {
            f.error.textContent = '';
            f.error.classList.remove('form-error--visible');
          }
        });

        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <span aria-hidden="true">&rarr;</span>';

        // Hide success after 5 seconds
        setTimeout(function () {
          if (formSuccess) {
            formSuccess.classList.remove('form-success--visible');
          }
        }, 5000);
      }, 1200);
    });
  }

  /* =============================================
     4.  SMOOTH SCROLL ENHANCEMENT
     ============================================= */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Focus the target for accessibility
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
        }
        target.focus({ preventScroll: true });
      }
    });
  });

})();