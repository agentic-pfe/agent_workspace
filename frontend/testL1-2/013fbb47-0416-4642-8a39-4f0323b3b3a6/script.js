/**
 * AI Foundations Pro — Interactive Frontend JavaScript
 * Provides: FAQ accordion, smooth scrolling, mobile nav toggle,
 * form validation, and testimonial carousel.
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ===============================================================
   * 1. FAQ ACCORDION (Expand / Collapse)
   * ===============================================================
   * Targets: [data-faq-toggle] buttons inside .faq-item
   * Controls: aria-expanded, aria-hidden, icon toggle
   * Behaviour: only one item open at a time (accordion pattern)
   */
  const faqToggles = document.querySelectorAll('[data-faq-toggle]');

  faqToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const answerId = btn.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);
      const icon = btn.querySelector('.faq-item__icon');

      // --- Close all other FAQ items ---
      faqToggles.forEach((otherBtn) => {
        if (otherBtn !== btn && otherBtn.getAttribute('aria-expanded') === 'true') {
          const otherAnswerId = otherBtn.getAttribute('aria-controls');
          const otherAnswer = document.getElementById(otherAnswerId);
          const otherIcon = otherBtn.querySelector('.faq-item__icon');
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.setAttribute('aria-hidden', 'true');
          if (otherIcon) otherIcon.textContent = '+';
        }
      });

      // --- Toggle the clicked item ---
      btn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      if (answer) answer.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
      if (icon) icon.textContent = isExpanded ? '+' : '−';
    });
  });

  /* ===============================================================
   * 2. SMOOTH SCROLLING FOR NAVIGATION LINKS
   * ===============================================================
   * Targets: all <a> elements whose href starts with '#'
   */
  const allAnchorLinks = document.querySelectorAll('a[href^="#"]');

  allAnchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return; // ignore empty / placeholder links

      const targetId = href.substring(1); // strip the '#'
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Close mobile nav after navigation (if open)
        const navList = document.getElementById('nav-menu');
        const navToggle = document.querySelector('[data-toggle-nav]');
        if (navList && navList.classList.contains('nav__list--open')) {
          navList.classList.remove('nav__list--open');
          if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  /* ===============================================================
   * 3. MOBILE MENU TOGGLE
   * ===============================================================
   * Targets: [data-toggle-nav] button, #nav-menu
   */
  const navToggle = document.querySelector('[data-toggle-nav]');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      navMenu.classList.toggle('nav__list--open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      const isInsideNav = navToggle.contains(e.target) || navMenu.contains(e.target);
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (!isInsideNav && isOpen) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('nav__list--open');
      }
    });
  }

  /* ===============================================================
   * 4. FORM VALIDATION (Contact / Enrollment Form)
   * ===============================================================
   * Targets: .enroll-form
   * Validates: name (non-empty), email (valid format),
   *            experience (selected), at least one checkbox
   */
  const form = document.querySelector('.enroll-form');
  if (form) {
    // --- Remove any existing error wrappers on page load ---
    const existingErrors = form.querySelectorAll('.enroll-form__error');
    existingErrors.forEach((el) => el.remove());

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // --- Clear previous errors ---
      const oldErrors = form.querySelectorAll('.enroll-form__error');
      oldErrors.forEach((el) => el.remove());

      // --- Remove error class from all inputs ---
      const allInputs = form.querySelectorAll(
        '.enroll-form__input, .enroll-form__checkbox'
      );
      allInputs.forEach((input) => input.classList.remove('enroll-form__input--error'));

      const errors = [];

      // 4a. Full Name (required)
      const nameInput = document.getElementById('form-name');
      if (nameInput) {
        const nameVal = nameInput.value.trim();
        if (!nameVal) {
          errors.push({ field: nameInput, message: 'Please enter your full name.' });
        }
      }

      // 4b. Email Address (required + valid format)
      const emailInput = document.getElementById('form-email');
      if (emailInput) {
        const emailVal = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal) {
          errors.push({ field: emailInput, message: 'Please enter your email address.' });
        } else if (!emailPattern.test(emailVal)) {
          errors.push({ field: emailInput, message: 'Please enter a valid email address (e.g., name@example.com).' });
        }
      }

      // 4c. Experience Level (must select a value)
      const experienceSelect = document.getElementById('form-experience');
      if (experienceSelect) {
        const expVal = experienceSelect.value;
        if (!expVal) {
          errors.push({ field: experienceSelect, message: 'Please select your AI experience level.' });
        }
      }

      // 4d. Interested Modules (at least one checkbox checked)
      const checkboxes = form.querySelectorAll(
        '.enroll-form__checkbox[name="modules"]'
      );
      const anyChecked = Array.from(checkboxes).some((cb) => cb.checked);
      if (!anyChecked) {
        // Attach error to the fieldset legend area
        const checkboxGroup = form.querySelector('.enroll-form__group--checkbox');
        errors.push({
          field: checkboxGroup,
          message: 'Please select at least one module you are interested in.',
        });
      }

      // --- Display errors (if any) ---
      if (errors.length > 0) {
        errors.forEach(({ field, message }) => {
          // Add error class to the input
          if (field && field.classList) {
            field.classList.add('enroll-form__input--error');
          }

          // Create error message element
          const errorEl = document.createElement('span');
          errorEl.className = 'enroll-form__error';
          errorEl.setAttribute('role', 'alert');
          errorEl.textContent = message;

          // Insert after the field or after the field's parent group
          const parentGroup = field.closest('.enroll-form__group');
          if (parentGroup) {
            parentGroup.appendChild(errorEl);
          } else {
            field.parentNode.appendChild(errorEl);
          }
        });

        // Focus the first errored input for accessibility
        const firstErrored = form.querySelector('.enroll-form__input--error');
        if (firstErrored) firstErrored.focus();
      } else {
        // --- SUCCESS: Form is valid ---
        // Show a success message, then optionally reset
        const existingSuccess = form.querySelector('.enroll-form__success');
        if (existingSuccess) existingSuccess.remove();

        const successMsg = document.createElement('div');
        successMsg.className = 'enroll-form__success';
        successMsg.setAttribute('role', 'status');
        successMsg.textContent =
          'Thank you! We will send course details and a free preview module to your email shortly.';

        // Insert before the submit button
        const submitBtn = form.querySelector('.enroll-form__submit');
        if (submitBtn) {
          submitBtn.parentNode.insertBefore(successMsg, submitBtn);
        } else {
          form.appendChild(successMsg);
        }

        // Optionally reset form after a short delay
        setTimeout(() => {
          form.reset();
          // Remove success message after reset
          setTimeout(() => {
            if (successMsg.parentNode) successMsg.remove();
          }, 3000);
        }, 2000);
      }
    });
  }

  /* ===============================================================
   * 5. TESTIMONIAL CAROUSEL
   * ===============================================================
   * Targets: [data-carousel], [data-carousel-track],
   *          [data-carousel-slide], [data-carousel-prev],
   *          [data-carousel-next], [data-carousel-dots]
   */
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const track = carousel.querySelector('[data-carousel-track]');
    const slides = carousel.querySelectorAll('[data-carousel-slide]');
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    const dotsContainer = carousel.querySelector('[data-carousel-dots]');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    // --- Helper: show slide at given index ---
    const showSlide = (index) => {
      // Clamp index within bounds (wrap around)
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;

      // Position the track via translateX
      const slideWidth = slides[0].getBoundingClientRect().width || track.clientWidth;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

      // Update dots
      const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel__dot') : [];
      dots.forEach((dot, i) => {
        dot.classList.toggle('carousel__dot--active', i === currentIndex);
        dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
      });
    };

    // --- Build dots ---
    if (dotsContainer) {
      // Clear any placeholder dots
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel__dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => showSlide(i));
        dotsContainer.appendChild(dot);
      });
    }

    // --- Event listeners for prev / next ---
    if (prevBtn) {
      prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
    }

    // --- Keyboard navigation ---
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showSlide(currentIndex - 1);
        if (prevBtn) prevBtn.focus();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showSlide(currentIndex + 1);
        if (nextBtn) nextBtn.focus();
      }
    });

    // --- Initial render ---
    // Set track width to accommodate all slides
    track.style.display = 'flex';
    track.style.transition = 'transform 0.4s ease-in-out';
    // Make each slide at least full width
    slides.forEach((slide) => {
      slide.style.flex = '0 0 100%';
    });
    showSlide(0);

    // --- Recalculate on window resize ---
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => showSlide(currentIndex), 150);
    });
  }

  /* ===============================================================
   * 6. ACCESSIBLE ANCHOR HANDLING FOR HERO & CTA BUTTONS
   * ===============================================================
   * Some buttons have data-action attributes — we handle those that
   * point to sections (e.g., data-action="enroll" → #enroll).
   */
  document.querySelectorAll('[data-action]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const action = el.getAttribute('data-action');
      if (action === 'enroll') {
        e.preventDefault();
        const enrollSection = document.getElementById('enroll');
        if (enrollSection) {
          enrollSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  console.log('AI Foundations Pro — interactivity initialised');
});