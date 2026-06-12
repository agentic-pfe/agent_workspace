/**
 * FlowSync — Interactive Enhancements
 * =====================================
 * Mobile menu toggle | Testimonial carousel | Smooth scrolling | Form validation
 * Vanilla ES6+ — No external dependencies
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initMobileMenu();
    initTestimonialCarousel();
    initSmoothScroll();
    initTrialForm();
  }

  // ============================================================
  //  1. MOBILE MENU TOGGLE
  // ============================================================
  function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (!toggleBtn || !mainNav) return;

    // Close menu when a nav link is clicked
    mainNav.addEventListener('click', (e) => {
      const link = e.target.closest('.nav-link');
      if (link) {
        closeMobileMenu(toggleBtn, mainNav);
      }
    });

    // Toggle menu on button click
    toggleBtn.addEventListener('click', () => {
      const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMobileMenu(toggleBtn, mainNav);
      } else {
        openMobileMenu(toggleBtn, mainNav);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
        closeMobileMenu(toggleBtn, mainNav);
        toggleBtn.focus();
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header-container') && toggleBtn.getAttribute('aria-expanded') === 'true') {
        closeMobileMenu(toggleBtn, mainNav);
      }
    });
  }

  function openMobileMenu(btn, nav) {
    btn.setAttribute('aria-expanded', 'true');
    nav.classList.add('main-nav--open');
    // Prevent body scroll while menu is open
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu(btn, nav) {
    btn.setAttribute('aria-expanded', 'false');
    nav.classList.remove('main-nav--open');
    document.body.style.overflow = '';
  }

  // ============================================================
  //  2. TESTIMONIAL CAROUSEL
  // ============================================================
  function initTestimonialCarousel() {
    const testimonialsSection = document.querySelector('.testimonials');
    const grid = testimonialsSection?.querySelector('.testimonials-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.testimonial-card'));
    if (cards.length < 2) return;

    let currentIndex = 0;
    let autoAdvance = null;

    // --- Build carousel shell ---
    const carouselWrapper = document.createElement('div');
    carouselWrapper.className = 'testimonial-carousel';

    const track = document.createElement('div');
    track.className = 'testimonial-track';
    track.setAttribute('aria-live', 'polite');

    // Move cards into track
    cards.forEach((card) => {
      // Wrap in slide div for isolation
      const slide = document.createElement('div');
      slide.className = 'testimonial-slide';
      card.parentNode.removeChild(card);
      slide.appendChild(card);
      track.appendChild(slide);
    });

    carouselWrapper.appendChild(track);

    // --- Controls ---
    const controls = document.createElement('div');
    controls.className = 'testimonial-controls';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'testimonial-btn testimonial-btn--prev';
    prevBtn.setAttribute('aria-label', 'Previous testimonial');
    prevBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'testimonial-btn testimonial-btn--next';
    nextBtn.setAttribute('aria-label', 'Next testimonial');
    nextBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    // --- Dots ---
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'testimonial-dots';
    dotsContainer.setAttribute('role', 'tablist');
    dotsContainer.setAttribute('aria-label', 'Select testimonial');

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonial-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Testimonial ${i + 1} of ${cards.length}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.tabIndex = i === 0 ? 0 : -1;
      dotsContainer.appendChild(dot);
    });

    controls.appendChild(prevBtn);
    controls.appendChild(dotsContainer);
    controls.appendChild(nextBtn);

    // Replace original grid with carousel
    grid.parentNode.replaceChild(carouselWrapper, grid);
    carouselWrapper.appendChild(controls);

    // Re-select slides from the new structure
    const slides = carouselWrapper.querySelectorAll('.testimonial-slide');

    // --- Go to slide ---
    function goToSlide(index) {
      const total = slides.length;
      // Wrap around
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      currentIndex = index;

      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update dots
      const dots = dotsContainer.querySelectorAll('.testimonial-dot');
      dots.forEach((dot, i) => {
        const isActive = i === currentIndex;
        dot.classList.toggle('testimonial-dot--active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        dot.tabIndex = isActive ? 0 : -1;
      });

      // Update button disabled states
      prevBtn.disabled = false;
      nextBtn.disabled = false;
    }

    function goPrev() {
      goToSlide(currentIndex - 1);
      resetAutoAdvance();
    }

    function goNext() {
      goToSlide(currentIndex + 1);
      resetAutoAdvance();
    }

    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);

    // Dot clicks
    dotsContainer.addEventListener('click', (e) => {
      const dot = e.target.closest('.testimonial-dot');
      if (!dot) return;
      const idx = Array.from(dotsContainer.children).indexOf(dot);
      if (idx !== -1) goToSlide(idx);
      resetAutoAdvance();
    });

    // --- Auto-advance ---
    function startAutoAdvance() {
      stopAutoAdvance();
      autoAdvance = setInterval(goNext, 6000);
    }

    function stopAutoAdvance() {
      if (autoAdvance) {
        clearInterval(autoAdvance);
        autoAdvance = null;
      }
    }

    function resetAutoAdvance() {
      startAutoAdvance();
    }

    // Pause on hover / focus within
    carouselWrapper.addEventListener('mouseenter', stopAutoAdvance);
    carouselWrapper.addEventListener('mouseleave', startAutoAdvance);
    carouselWrapper.addEventListener('focusin', stopAutoAdvance);
    carouselWrapper.addEventListener('focusout', (e) => {
      // Only restart if focus left the entire carousel
      if (!carouselWrapper.contains(e.relatedTarget)) {
        startAutoAdvance();
      }
    });

    // Keyboard: arrow keys
    carouselWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevBtn.click();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextBtn.click();
      }
    });

    // --- Init ---
    goToSlide(0);
    startAutoAdvance();
  }

  // ============================================================
  //  3. SMOOTH SCROLLING
  // ============================================================
  function initSmoothScroll() {
    // Use event delegation: listen for clicks on the document
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href');
      // Skip if just "#" or empty
      if (!targetId || targetId === '#') return;

      // Only handle same-page anchor links
      if (link.pathname !== window.location.pathname && link.hostname === window.location.hostname) {
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = getHeaderHeight();
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      // Update focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });

      // Clean up after focus
      const removeFocus = () => {
        target.removeAttribute('tabindex');
      };
      target.addEventListener('blur', removeFocus, { once: true });
    });
  }

  function getHeaderHeight() {
    const header = document.querySelector('.site-header');
    if (header) {
      return header.offsetHeight;
    }
    return 0;
  }

  // ============================================================
  //  4. FREE TRIAL SIGNUP FORM (Modal + Validation)
  // ============================================================
  function initTrialForm() {
    // Create modal markup once
    const modal = createModal();
    document.body.appendChild(modal);

    // Attach click handlers to all trial / signup buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest(
        '.btn-primary, .pricing-cta, .nav-cta, .cta-section .btn-primary'
      );
      if (!btn) return;

      const text = btn.textContent.trim().toLowerCase();

      // Only trigger for trial / get-started / free-trial buttons
      const isTrial =
        text.includes('free trial') ||
        text.includes('get started') ||
        text.includes('start') ||
        text.includes('sign up');

      // Exclude "Contact Sales" from the pricing cards
      const isSales = text.includes('contact sales') || text.includes('talk to sales');
      const isDemo = text.includes('watch demo');

      if (isTrial && !isSales && !isDemo) {
        e.preventDefault();
        openModal(modal);
      }
    });

    // Modal close handlers
    const closeBtn = modal.querySelector('.trial-modal__close');
    const overlay = modal.querySelector('.trial-modal__overlay');
    const cancelBtn = modal.querySelector('.trial-modal__cancel');

    function closeModalHandler() {
      closeModal(modal);
    }

    closeBtn?.addEventListener('click', closeModalHandler);
    overlay?.addEventListener('click', closeModalHandler);
    cancelBtn?.addEventListener('click', closeModalHandler);

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('trial-modal--open')) {
        closeModal(modal);
      }
    });

    // Form submission
    const form = modal.querySelector('.trial-form');
    const emailInput = form?.querySelector('#trial-email');
    const errorEl = form?.querySelector('.trial-form__error');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous error
      clearError(emailInput, errorEl);

      const email = emailInput?.value.trim();

      // Validation
      if (!email) {
        showError(emailInput, errorEl, 'Please enter your email address.');
        return;
      }

      // Email pattern check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showError(emailInput, errorEl, 'Please enter a valid email address (e.g., name@company.com).');
        return;
      }

      // Success
      const successMsg = modal.querySelector('.trial-form__success');
      if (successMsg) {
        successMsg.textContent = '✓ Thanks! We\'ll be in touch shortly.';
        successMsg.style.display = 'block';
      }

      // Disable form
      form.querySelectorAll('input, button').forEach((el) => {
        el.disabled = true;
      });

      // Close modal after delay
      setTimeout(() => {
        closeModal(modal);
        // Reset form
        form.reset();
        form.querySelectorAll('input, button').forEach((el) => {
          el.disabled = false;
        });
        if (successMsg) successMsg.style.display = 'none';
      }, 2500);
    });

    // Real-time validation on blur
    emailInput?.addEventListener('blur', () => {
      const email = emailInput.value.trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError(emailInput, errorEl, 'Please enter a valid email address.');
      } else {
        clearError(emailInput, errorEl);
      }
    });

    // Clear error on input
    emailInput?.addEventListener('input', () => {
      if (errorEl?.style.display === 'block') {
        clearError(emailInput, errorEl);
      }
    });
  }

  function createModal() {
    const template = document.createElement('div');
    template.className = 'trial-modal';
    template.setAttribute('role', 'dialog');
    template.setAttribute('aria-modal', 'true');
    template.setAttribute('aria-labelledby', 'trial-modal-title');
    template.style.display = 'none';

    template.innerHTML = `
      <div class="trial-modal__overlay"></div>
      <div class="trial-modal__content">
        <button class="trial-modal__close" aria-label="Close signup form">&times;</button>
        <div class="trial-modal__body">
          <h2 id="trial-modal-title" class="trial-modal__title">Start Your Free Trial</h2>
          <p class="trial-modal__subtitle">No credit card required. Set up in under 3 minutes.</p>
          <form class="trial-form" novalidate>
            <div class="trial-form__group">
              <label for="trial-email" class="trial-form__label">Work email</label>
              <input
                type="email"
                id="trial-email"
                class="trial-form__input"
                placeholder="you@company.com"
                required
                autocomplete="email"
                aria-describedby="trial-email-error"
              />
              <p id="trial-email-error" class="trial-form__error" role="alert" aria-live="polite"></p>
            </div>
            <button type="submit" class="btn btn-primary trial-form__submit">Start Free Trial</button>
            <p class="trial-form__success" style="display: none;"></p>
          </form>
          <p class="trial-modal__footnote">By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
          <button class="trial-modal__cancel">Maybe later</button>
        </div>
      </div>
    `;

    return template;
  }

  function openModal(modal) {
    modal.style.display = '';
    // Force reflow for transition
    modal.offsetHeight;
    modal.classList.add('trial-modal--open');
    document.body.style.overflow = 'hidden';

    // Focus the email input
    const input = modal.querySelector('#trial-email');
    setTimeout(() => input?.focus(), 100);
  }

  function closeModal(modal) {
    modal.classList.remove('trial-modal--open');
    document.body.style.overflow = '';

    // Wait for transition then hide
    setTimeout(() => {
      if (!modal.classList.contains('trial-modal--open')) {
        modal.style.display = 'none';
      }
    }, 300);

    // Return focus to the trigger button
    const trigger = document.querySelector('[data-trial-trigger]');
    trigger?.focus();
  }

  function showError(input, errorEl, message) {
    input?.classList.add('trial-form__input--error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  function clearError(input, errorEl) {
    input?.classList.remove('trial-form__input--error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  // ============================================================
  //  CAROUSEL / MODAL STYLES (injected at runtime)
  // ============================================================
  function injectStyles() {
    const styleId = 'flowsync-js-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* ----- Mobile Menu (overrides) ----- */
      .main-nav--open {
        display: flex !important;
        position: fixed;
        inset: var(--header-height, 64px) 0 0 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 2rem 1.5rem;
        z-index: 99;
        overflow-y: auto;
      }
      .main-nav--open .nav-list {
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        max-width: 320px;
      }
      .main-nav--open .nav-link {
        display: block;
        width: 100%;
        text-align: center;
        font-size: 1.125rem;
        padding: 0.75rem 1rem;
      }
      .main-nav--open .nav-cta {
        margin-top: 0.5rem;
      }

      /* ----- Testimonial Carousel ----- */
      .testimonial-carousel {
        position: relative;
        max-width: 720px;
        margin: 0 auto;
        overflow: hidden;
      }
      .testimonial-track {
        display: flex;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
      }
      .testimonial-slide {
        flex: 0 0 100%;
        min-width: 0;
        padding: 0 0.25rem;
      }
      .testimonial-slide .testimonial-card {
        margin: 0;
        height: 100%;
      }
      .testimonial-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        margin-top: 1.5rem;
      }
      .testimonial-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid var(--color-border, #E5E7EB);
        background: var(--color-bg-card, #fff);
        color: var(--color-text-secondary, #4B5563);
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }
      .testimonial-btn:hover {
        border-color: var(--color-primary-light, #8B5CF6);
        color: var(--color-primary, #6D28D9);
        background: var(--color-primary-bg, rgba(109, 40, 217, 0.08));
      }
      .testimonial-btn:disabled {
        opacity: 0.3;
        cursor: default;
        pointer-events: none;
      }
      .testimonial-btn:focus-visible {
        outline: 2px solid var(--color-primary, #6D28D9);
        outline-offset: 2px;
      }
      .testimonial-dots {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .testimonial-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid var(--color-border, #E5E7EB);
        background: transparent;
        cursor: pointer;
        padding: 0;
        transition: all 0.2s ease;
      }
      .testimonial-dot--active {
        background: var(--color-primary, #6D28D9);
        border-color: var(--color-primary, #6D28D9);
        transform: scale(1.25);
      }
      .testimonial-dot:focus-visible {
        outline: 2px solid var(--color-primary, #6D28D9);
        outline-offset: 2px;
      }
      @media (min-width: 768px) {
        .testimonial-carousel {
          max-width: 600px;
        }
      }

      /* ----- Trial Modal ----- */
      .trial-modal {
        position: fixed;
        inset: 0;
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }
      .trial-modal--open {
        opacity: 1;
        pointer-events: all;
      }
      .trial-modal__overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }
      .trial-modal__content {
        position: relative;
        width: 90%;
        max-width: 440px;
        background: var(--color-bg-card, #fff);
        border-radius: var(--radius-lg, 16px);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        transform: translateY(20px) scale(0.96);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-height: 90vh;
        overflow-y: auto;
      }
      .trial-modal--open .trial-modal__content {
        transform: translateY(0) scale(1);
      }
      .trial-modal__close {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        width: 36px;
        height: 36px;
        border: none;
        background: var(--color-bg-alt, #F3F4F6);
        border-radius: 50%;
        font-size: 1.25rem;
        line-height: 1;
        cursor: pointer;
        color: var(--color-text-secondary, #4B5563);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
        z-index: 1;
      }
      .trial-modal__close:hover {
        background: var(--color-border, #E5E7EB);
      }
      .trial-modal__close:focus-visible {
        outline: 2px solid var(--color-primary, #6D28D9);
        outline-offset: 2px;
      }
      .trial-modal__body {
        padding: 2.5rem 2rem 2rem;
        text-align: center;
      }
      .trial-modal__title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text, #111827);
        margin-bottom: 0.375rem;
        letter-spacing: -0.02em;
      }
      .trial-modal__subtitle {
        font-size: 0.9375rem;
        color: var(--color-text-secondary, #4B5563);
        margin-bottom: 1.5rem;
      }
      .trial-form {
        text-align: left;
      }
      .trial-form__group {
        margin-bottom: 1.25rem;
      }
      .trial-form__label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text, #111827);
        margin-bottom: 0.375rem;
      }
      .trial-form__input {
        display: block;
        width: 100%;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        font-family: inherit;
        border: 1.5px solid var(--color-border, #E5E7EB);
        border-radius: var(--radius-sm, 6px);
        background: var(--color-bg, #fff);
        color: var(--color-text, #111827);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
        outline: none;
      }
      .trial-form__input:focus {
        border-color: var(--color-primary, #6D28D9);
        box-shadow: 0 0 0 3px var(--color-primary-bg, rgba(109, 40, 217, 0.12));
      }
      .trial-form__input--error {
        border-color: #EF4444 !important;
      }
      .trial-form__input--error:focus {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
      }
      .trial-form__error {
        display: none;
        font-size: 0.8125rem;
        color: #EF4444;
        margin-top: 0.375rem;
      }
      .trial-form__submit {
        width: 100%;
        padding: 0.8125rem;
        font-size: 1rem;
      }
      .trial-form__success {
        font-size: 0.9375rem;
        color: var(--color-success, #10B981);
        font-weight: 600;
        margin-top: 1rem;
        text-align: center;
      }
      .trial-modal__footnote {
        font-size: 0.75rem;
        color: var(--color-text-muted, #9CA3AF);
        margin-top: 1rem;
      }
      .trial-modal__footnote a {
        color: var(--color-primary, #6D28D9);
        text-decoration: underline;
      }
      .trial-modal__cancel {
        background: none;
        border: none;
        font-size: 0.875rem;
        color: var(--color-text-muted, #9CA3AF);
        cursor: pointer;
        margin-top: 1rem;
        padding: 0.25rem 0.5rem;
        transition: color 0.2s ease;
        font-family: inherit;
      }
      .trial-modal__cancel:hover {
        color: var(--color-text-secondary, #4B5563);
      }
      .trial-modal__cancel:focus-visible {
        outline: 2px solid var(--color-primary, #6D28D9);
        outline-offset: 2px;
      }
      @media (max-width: 480px) {
        .trial-modal__body {
          padding: 2rem 1.25rem 1.5rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Inject styles early
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  } else {
    injectStyles();
  }
})();