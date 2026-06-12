/* ============================================================
   FORMA STUDIO — Shared JavaScript
   Navbar active state | Mobile menu | Form validation
   ============================================================ */

(function () {
  'use strict';

  /* ---------- MOBILE MENU TOGGLE ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('active');
    });

    // Close menu when a nav link is clicked (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- ACTIVE NAV LINK BASED ON CURRENT PAGE ---------- */
  (function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-links a');

    allNavLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      // Remove any existing active class
      link.classList.remove('active');

      // Match: exact href match, or current page is empty/root and link is index
      if (href === currentPath) {
        link.classList.add('active');
      } else if ((currentPath === '' || currentPath === '/') && href === 'index.html') {
        link.classList.add('active');
      }
    });
  })();

  /* ---------- CONTACT FORM VALIDATION ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const formSuccess = document.getElementById('formSuccess');

    // Validation helpers
    function showError(inputId, message) {
      const input = document.getElementById(inputId);
      const errorEl = document.getElementById(inputId + 'Error');
      if (input) input.classList.add('error');
      if (errorEl) errorEl.textContent = message;
    }

    function clearError(inputId) {
      const input = document.getElementById(inputId);
      const errorEl = document.getElementById(inputId + 'Error');
      if (input) input.classList.remove('error');
      if (errorEl) errorEl.textContent = '';
    }

    function clearAllErrors() {
      ['fullName', 'email', 'subject', 'message'].forEach(clearError);
    }

    function validateEmail(email) {
      // RFC 5322 compliant-ish regex for common use cases
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    function validateForm() {
      let isValid = true;

      // Full Name
      const fullName = document.getElementById('fullName').value.trim();
      if (!fullName) {
        showError('fullName', 'Please enter your full name.');
        isValid = false;
      } else if (fullName.length < 2) {
        showError('fullName', 'Name must be at least 2 characters.');
        isValid = false;
      } else {
        clearError('fullName');
      }

      // Email
      const email = document.getElementById('email').value.trim();
      if (!email) {
        showError('email', 'Please enter your email address.');
        isValid = false;
      } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError('email');
      }

      // Message
      const message = document.getElementById('message').value.trim();
      if (!message) {
        showError('message', 'Please enter your message.');
        isValid = false;
      } else if (message.length < 10) {
        showError('message', 'Message must be at least 10 characters.');
        isValid = false;
      } else {
        clearError('message');
      }

      return isValid;
    }

    // Real-time validation on blur
    ['fullName', 'email', 'message'].forEach(function (fieldId) {
      var field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('blur', function () {
          // Only validate if field has a value (don't show errors on empty untouched fields)
          var value = field.value.trim();
          if (value.length === 0) {
            clearError(fieldId);
            return;
          }

          if (fieldId === 'fullName' && value.length < 2) {
            showError('fullName', 'Name must be at least 2 characters.');
          } else if (fieldId === 'email' && !validateEmail(value)) {
            showError('email', 'Please enter a valid email address.');
          } else if (fieldId === 'message' && value.length < 10) {
            showError('message', 'Message must be at least 10 characters.');
          } else {
            clearError(fieldId);
          }
        });

        // Clear error on input
        field.addEventListener('input', function () {
          clearError(fieldId);
        });
      }
    });

    // Form submission
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAllErrors();

      if (validateForm()) {
        // Show success message
        if (formSuccess) {
          formSuccess.classList.add('visible');
        }
        contactForm.reset();

        // Auto-hide success after 6 seconds
        setTimeout(function () {
          if (formSuccess) {
            formSuccess.classList.remove('visible');
          }
        }, 6000);

        // Focus the success message for screen readers
        if (formSuccess) {
          formSuccess.setAttribute('tabindex', '-1');
          formSuccess.focus();
        }
      } else {
        // Focus the first field with an error
        var firstError = document.querySelector('.form-group input.error, .form-group textarea.error');
        if (firstError) {
          firstError.focus();
        }
      }
    });
  }
})();
