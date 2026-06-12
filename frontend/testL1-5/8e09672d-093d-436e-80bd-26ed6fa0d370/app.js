/* ============================================================
   Summit Roast — Premium High-Altitude Specialty Coffee
   app.js  –  Vanilla ES6+ Interactive Behaviours
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ====================================================================
     1. Smooth Scrolling for Navigation Links (Sticky‑Header Offset)
     ==================================================================== */
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav__list a[href^="#"]');

  if (header && navLinks.length) {
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href'); // e.g. "#home"
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          const headerHeight = header.offsetHeight;
          const targetPosition =
            targetSection.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  /* ====================================================================
     2. Testimonial Carousel  –  Cycle on Button Click
     ==================================================================== */
  const carousel = document.querySelector('.testimonials-carousel');
  const testimonialElements = carousel
    ? carousel.querySelectorAll('.testimonial')
    : [];

  if (carousel && testimonialElements.length > 0) {
    let currentIndex = 0;
    const total = testimonialElements.length;

    // ---- Inject carousel styles (keeps everything self‑contained) ----
    const carouselStyles = document.createElement('style');
    carouselStyles.textContent = `
      .testimonials-carousel {
        position: relative;
        overflow: hidden;
      }
      .testimonial {
        transition: opacity 0.4s ease, transform 0.4s ease;
      }
      .testimonial:not(.testimonial--active) {
        display: none;
      }
      .carousel-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        margin-top: 2rem;
      }
      .carousel-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        font-size: 1.25rem;
        background: #6b3f2b;
        color: #faf6f0;
        border: 2px solid #6b3f2b;
        border-radius: 50%;
        cursor: pointer;
        transition: background 0.25s ease, transform 0.25s ease;
        line-height: 1;
      }
      .carousel-btn:hover,
      .carousel-btn:focus-visible {
        background: #4a2a1a;
        border-color: #4a2a1a;
        transform: scale(1.08);
      }
      .carousel-btn:focus-visible {
        outline: 3px solid #c76b3a;
        outline-offset: 2px;
      }
      .carousel-dots {
        display: flex;
        gap: 0.5rem;
      }
      .carousel-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #d4c5b5;
        background: transparent;
        cursor: pointer;
        padding: 0;
        transition: background 0.25s ease, border-color 0.25s ease;
      }
      .carousel-dot:hover {
        border-color: #6b3f2b;
      }
      .carousel-dot--active {
        background: #6b3f2b;
        border-color: #6b3f2b;
      }
      .carousel-dot:focus-visible {
        outline: 3px solid #c76b3a;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(carouselStyles);

    // ---- Build controls ----
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn carousel-btn--prev';
    prevBtn.setAttribute('aria-label', 'Previous testimonial');
    prevBtn.innerHTML = '&#8592;';

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    dotsContainer.setAttribute('role', 'tablist');
    dotsContainer.setAttribute('aria-label', 'Testimonial navigation');

    const dotButtons = [];
    testimonialElements.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      if (i === 0) dot.classList.add('carousel-dot--active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
      dotButtons.push(dot);
    });

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn carousel-btn--next';
    nextBtn.setAttribute('aria-label', 'Next testimonial');
    nextBtn.innerHTML = '&#8594;';

    controls.appendChild(prevBtn);
    controls.appendChild(dotsContainer);
    controls.appendChild(nextBtn);
    carousel.appendChild(controls);

    // ---- Core navigation ----
    const goTo = (index) => {
      // Wrap around
      const target = (index + total) % total;

      testimonialElements.forEach((el, i) => {
        el.classList.toggle('testimonial--active', i === target);
      });
      dotButtons.forEach((dot, i) => {
        dot.classList.toggle('carousel-dot--active', i === target);
        dot.setAttribute('aria-selected', i === target ? 'true' : 'false');
      });

      currentIndex = target;
    };

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    // Keyboard navigation on carousel
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(currentIndex - 1);
        prevBtn.focus();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(currentIndex + 1);
        nextBtn.focus();
      }
    });
    carousel.setAttribute('tabindex', '0');

    // ---- Show the first testimonial ----
    goTo(0);
  }

  /* ====================================================================
     3. Subscription Form Validation
        – Validate name, email format, required plan selection
     ==================================================================== */
  const form = document.querySelector('.subscription-form');
  if (form) {
    const nameInput = document.getElementById('subscriber-name');
    const emailInput = document.getElementById('subscriber-email');
    const planRadios = form.querySelectorAll('input[name="plan"]');
    const planFieldset = form.querySelector(
      '.subscription-form__fieldset:last-of-type'
    );

    // ---- Inject form‑error / form‑success styles ----
    const formStyles = document.createElement('style');
    formStyles.textContent = `
      .form-error {
        font-size: 0.8rem;
        color: #b0302a;
        margin-top: 0.35rem;
        font-weight: 600;
      }
      .form-success {
        text-align: center;
        padding: 1rem 1.25rem;
        margin-top: 1.25rem;
        background: #eaf6e6;
        color: #3a6b2e;
        border: 2px solid #5a7a4a;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.95rem;
      }
      input[aria-invalid="true"] {
        border-color: #b0302a !important;
      }
    `;
    document.head.appendChild(formStyles);

    // ---- Helpers ----
    const getErrorEl = (input) => {
      const group = input.closest('.subscription-form__group');
      return group ? group.querySelector('.form-error') : null;
    };

    const showError = (input, message) => {
      const group = input.closest('.subscription-form__group');
      if (!group) return;

      let error = group.querySelector('.form-error');
      if (!error) {
        error = document.createElement('p');
        error.className = 'form-error';
        error.setAttribute('role', 'alert');
        group.appendChild(error);
      }
      error.textContent = message;
      input.setAttribute('aria-invalid', 'true');
    };

    const clearError = (input) => {
      const group = input.closest('.subscription-form__group');
      if (!group) return;

      const error = group.querySelector('.form-error');
      if (error) error.remove();
      input.removeAttribute('aria-invalid');
    };

    const showFieldsetError = (message) => {
      if (!planFieldset) return;

      let error = planFieldset.querySelector('.form-error');
      if (!error) {
        error = document.createElement('p');
        error.className = 'form-error';
        error.setAttribute('role', 'alert');
        planFieldset.appendChild(error);
      }
      error.textContent = message;
    };

    const clearFieldsetError = () => {
      if (!planFieldset) return;

      const error = planFieldset.querySelector('.form-error');
      if (error) error.remove();
    };

    // ---- Validation functions ----
    const validateName = () => {
      if (!nameInput) return false;
      const val = nameInput.value.trim();

      if (!val) {
        showError(nameInput, 'Please enter your full name.');
        return false;
      }
      if (val.length < 2) {
        showError(
          nameInput,
          'Name must be at least 2 characters long.'
        );
        return false;
      }
      clearError(nameInput);
      return true;
    };

    const validateEmail = () => {
      if (!emailInput) return false;
      const val = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!val) {
        showError(emailInput, 'Please enter your email address.');
        return false;
      }
      if (!emailRegex.test(val)) {
        showError(
          emailInput,
          'Please enter a valid email address (e.g., name@example.com).'
        );
        return false;
      }
      clearError(emailInput);
      return true;
    };

    const validatePlan = () => {
      const selected = form.querySelector('input[name="plan"]:checked');
      if (!selected) {
        showFieldsetError('Please select a subscription plan.');
        return false;
      }
      clearFieldsetError();
      return true;
    };

    const validateAll = () => {
      const nameOk = validateName();
      const emailOk = validateEmail();
      const planOk = validatePlan();
      return nameOk && emailOk && planOk;
    };

    // ---- Real‑time validation events ----
    if (nameInput) {
      nameInput.addEventListener('blur', validateName);
      nameInput.addEventListener('input', () => {
        if (nameInput.hasAttribute('aria-invalid')) validateName();
      });
    }

    if (emailInput) {
      emailInput.addEventListener('blur', validateEmail);
      emailInput.addEventListener('input', () => {
        if (emailInput.hasAttribute('aria-invalid')) validateEmail();
      });
    }

    planRadios.forEach((radio) => {
      radio.addEventListener('change', validatePlan);
    });

    // ---- Submit handler ----
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (validateAll()) {
        // Success – show confirmation message
        const existing = form.querySelector('.form-success');
        if (existing) existing.remove();

        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.setAttribute('role', 'alert');
        successMsg.textContent =
          'Thank you! Your subscription has been started. Welcome to Summit Roast.';

        form.appendChild(successMsg);

        // Scroll to the success message
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

        form.reset();

        // Remove success after a few seconds
        setTimeout(() => {
          if (successMsg.parentNode) successMsg.remove();
        }, 6000);
      } else {
        // Focus the first invalid field
        if (
          nameInput &&
          nameInput.getAttribute('aria-invalid') === 'true'
        ) {
          nameInput.focus();
        } else if (
          emailInput &&
          emailInput.getAttribute('aria-invalid') === 'true'
        ) {
          emailInput.focus();
        }
      }
    });
  }

  /* ====================================================================
     4. Scroll‑to‑top on Logo Click (optional but nice UX)
     ==================================================================== */
  const logo = document.querySelector('.nav__logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ====================================================================
     5. Active Navigation Link Highlighting on Scroll
     ==================================================================== */
  const sections = document.querySelectorAll(
    'section[id]'
  );

  if (navLinks.length && sections.length) {
    const observerOptions = {
      rootMargin: `-${header ? header.offsetHeight : 0}px 0px -60% 0px`,
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        // Remove active class from all links
        navLinks.forEach((l) => l.removeAttribute('data-active'));

        // Add active class to the matching link
        const activeLink = document.querySelector(
          `.nav__list a[href="#${entry.target.id}"]`
        );
        if (activeLink) {
          activeLink.setAttribute('data-active', 'true');
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    // Inject a style for the active link indicator
    const activeStyles = document.createElement('style');
    activeStyles.textContent = `
      .nav__list a[data-active] {
        color: #4a2a1a !important;
      }
      .nav__list a[data-active]::after {
        width: 100% !important;
      }
    `;
    document.head.appendChild(activeStyles);
  }
});