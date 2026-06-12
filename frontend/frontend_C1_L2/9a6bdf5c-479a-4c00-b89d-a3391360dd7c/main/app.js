/**
 * Orbit Studio — Main JavaScript
 * Features:
 * 1. Typewriter animation for hero heading
 * 2. Team card 3D tilt effect on mousemove
 * 3. Contact form validation with error messages
 * 4. Sticky shrinking navbar on scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // 1. TYPEWRITER ANIMATION
  // ============================================
  (function initTypewriter() {
    const heading = document.getElementById('typewriter-heading');
    if (!heading) return;

    const fullText = heading.getAttribute('data-typewriter-text') || heading.textContent;
    const typingSpeed = 90; // ms per character

    // Clear heading and prepare for animation
    heading.textContent = '';

    // Create cursor element
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    heading.appendChild(cursor);

    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        // Insert character before cursor
        const charNode = document.createTextNode(fullText.charAt(charIndex));
        heading.insertBefore(charNode, cursor);
        charIndex++;
      } else {
        clearInterval(typeInterval);
        // Keep cursor blinking after typing completes
      }
    }, typingSpeed);
  })();

  // ============================================
  // 2. TEAM CARD 3D TILT EFFECT
  // ============================================
  (function initTeamTilt() {
    const teamCards = document.querySelectorAll('.team-card');
    if (!teamCards.length) return;

    teamCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation based on mouse position relative to center
        // Max rotation: ±5 degrees
        const rotateY = ((x - centerX) / centerX) * 5;
        const rotateX = ((centerY - y) / centerY) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        card.style.boxShadow = '';
      });
    });
  })();

  // ============================================
  // 3. CONTACT FORM VALIDATION
  // ============================================
  (function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const typeSelect = document.getElementById('contact-type');
    const messageInput = document.getElementById('contact-message');

    // Email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(input, message) {
      // Remove existing error if any
      removeError(input);

      const errorSpan = document.createElement('span');
      errorSpan.className = 'error-message';
      errorSpan.textContent = message;
      errorSpan.setAttribute('role', 'alert');

      const formGroup = input.closest('.form-group');
      if (formGroup) {
        formGroup.appendChild(errorSpan);
      }
    }

    function removeError(input) {
      const formGroup = input.closest('.form-group');
      if (formGroup) {
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
          existingError.remove();
        }
      }
    }

    function validateForm() {
      let isValid = true;

      // Validate name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        showError(nameInput, 'Name is required and must be at least 2 characters.');
        isValid = false;
      } else {
        removeError(nameInput);
      }

      // Validate email
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required.');
        isValid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        removeError(emailInput);
      }

      // Validate project type
      if (!typeSelect.value) {
        showError(typeSelect, 'Please select a project type.');
        isValid = false;
      } else {
        removeError(typeSelect);
      }

      // Validate message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        showError(messageInput, 'Message is required and must be at least 10 characters.');
        isValid = false;
      } else {
        removeError(messageInput);
      }

      return isValid;
    }

    // Remove errors on input
    [nameInput, emailInput, typeSelect, messageInput].forEach(input => {
      input.addEventListener('input', () => removeError(input));
      input.addEventListener('change', () => removeError(input));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (validateForm()) {
        // Hide form and show success message
        form.style.display = 'none';

        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
          <h3>Thank You!</h3>
          <p>We'll be in touch soon.</p>
        `;

        const container = form.closest('.container');
        container.appendChild(successDiv);

        // Trigger fade-in animation
        requestAnimationFrame(() => {
          successDiv.classList.add('visible');
        });

        // Reset and show form after 3 seconds
        setTimeout(() => {
          successDiv.remove();
          form.reset();
          form.style.display = '';
        }, 3000);
      }
    });
  })();

  // ============================================
  // 4. STICKY SHRINKING NAVBAR
  // ============================================
  (function initStickyNavbar() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const scrollThreshold = 80;
    let ticking = false;

    function updateNavbar() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('navbar-scrolled');
      } else {
        header.classList.remove('navbar-scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    });
  })();

  // ============================================
  // 5. MOBILE MENU TOGGLE
  // ============================================
  (function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
      });
    });
  })();
});
