/* ============================================
   DevSummit 2026 — The Future of AI
   JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ---- Countdown Timer ---- */
  const countdownTarget = new Date('2026-12-15T09:00:00').getTime();
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  function updateCountdown() {
    const now = Date.now();
    const diff = countdownTarget - now;

    if (diff <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---- Mobile Menu Toggle ---- */
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('active');
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
      });
    });
  }

  /* ---- Smooth Scroll & Active Section Highlighting ---- */
  const navLinkEls = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        const headerOffset = document.querySelector('.site-header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // Active section highlighting on scroll
  function updateActiveNav() {
    const scrollPos = window.scrollY + 150;
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinkEls.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  /* ---- Schedule Timeline IntersectionObserver ---- */
  const scheduleItems = document.querySelectorAll('.schedule-item[data-animate]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    scheduleItems.forEach(item => observer.observe(item));
  } else {
    // Fallback for browsers without IntersectionObserver
    scheduleItems.forEach(item => item.classList.add('visible'));
  }

  /* ---- Registration Form Validation ---- */
  const form = document.getElementById('registration-form');
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const ticketInput = document.getElementById('reg-ticket');
  const submitBtn = document.getElementById('form-submit');

  const validators = {
    name: (value) => {
      if (!value.trim()) return 'Name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return '';
    },
    email: (value) => {
      if (!value.trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email address';
      return '';
    },
    ticket: (value) => {
      if (!value) return 'Please select a ticket type';
      return '';
    }
  };

  function validateField(input, validatorName) {
    const value = input.value;
    const error = validators[validatorName](value);
    const group = input.closest('.form-group');
    const errorEl = group.querySelector('.form-error');

    if (error) {
      input.classList.remove('valid');
      input.classList.add('invalid');
      if (errorEl) errorEl.textContent = error;
      return false;
    } else {
      input.classList.remove('invalid');
      input.classList.add('valid');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  function checkFormValidity() {
    const nameValid = validators.name(nameInput.value) === '';
    const emailValid = validators.email(emailInput.value) === '';
    const ticketValid = validators.ticket(ticketInput.value) === '';

    // Update visual states
    if (nameInput.value) validateField(nameInput, 'name');
    if (emailInput.value) validateField(emailInput, 'email');
    if (ticketInput.value) validateField(ticketInput, 'ticket');

    submitBtn.disabled = !(nameValid && emailValid && ticketValid);
  }

  // Real-time validation on input
  nameInput.addEventListener('input', () => {
    validateField(nameInput, 'name');
    checkFormValidity();
  });

  nameInput.addEventListener('blur', () => {
    validateField(nameInput, 'name');
    checkFormValidity();
  });

  emailInput.addEventListener('input', () => {
    validateField(emailInput, 'email');
    checkFormValidity();
  });

  emailInput.addEventListener('blur', () => {
    validateField(emailInput, 'email');
    checkFormValidity();
  });

  ticketInput.addEventListener('change', () => {
    validateField(ticketInput, 'ticket');
    checkFormValidity();
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const allValid =
      validateField(nameInput, 'name') &&
      validateField(emailInput, 'email') &&
      validateField(ticketInput, 'ticket');

    if (allValid) {
      submitBtn.textContent = 'Registered!';
      submitBtn.style.background = 'var(--success)';
      setTimeout(() => {
        submitBtn.textContent = 'Complete Registration';
        submitBtn.style.background = '';
        form.reset();
        [nameInput, emailInput, ticketInput].forEach(input => {
          input.classList.remove('valid', 'invalid');
        });
        submitBtn.disabled = true;
      }, 3000);
    }
  });

  /* ---- Header background on scroll ---- */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(17, 24, 39, 0.95)';
    } else {
      header.style.background = 'rgba(17, 24, 39, 0.85)';
    }
  });
})();
