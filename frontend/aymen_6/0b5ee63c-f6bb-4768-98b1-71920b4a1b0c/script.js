/* ===================================================
   script.js — AquaPure | Interactive Enhancements
   Vanilla ES6+ — No dependencies
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  'use strict';

  // =====================================================
  // 1. SMOOTH SCROLLING FOR INTERNAL ANCHOR LINKS
  // =====================================================

  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 64;

  /**
   * Smoothly scroll to a target element, accounting for fixed header offset.
   * @param {string} targetId - The id of the target element (without '#')
   */
  const scrollToSection = (targetId) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });

    // Update URL hash without causing a jump
    history.pushState(null, null, `#${targetId}`);
  };

  /**
   * Handle click on any internal anchor link.
   * @param {MouseEvent} e
   */
  const handleAnchorClick = (e) => {
    const link = e.currentTarget;
    const href = link.getAttribute('href');

    // Only handle internal hash links (e.g., "#home", "#benefits")
    if (!href || !href.startsWith('#') || href === '#') return;

    const targetId = href.slice(1);
    const target = document.getElementById(targetId);

    if (target) {
      e.preventDefault();
      scrollToSection(targetId);
    }
  };

  // Attach smooth scrolling to every internal anchor link in the nav
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener('click', handleAnchorClick);
  });

  // Also attach to hero action buttons that link to sections
  const heroActions = document.querySelectorAll('.hero__actions a[href^="#"]');
  heroActions.forEach((link) => {
    link.addEventListener('click', handleAnchorClick);
  });

  // =====================================================
  // 2. DYNAMIC TESTIMONIAL CAROUSEL
  // =====================================================

  const testimonialsGrid = document.querySelector('.testimonials-grid');
  const testimonialCards = testimonialsGrid
    ? Array.from(testimonialsGrid.querySelectorAll(':scope > .card--testimonial'))
    : [];

  if (testimonialsGrid && testimonialCards.length > 0) {
    let currentIndex = 0;
    let autoRotateInterval = null;
    const AUTO_ROTATE_DELAY = 5000; // 5 seconds

    // Wrap testimonials in a carousel container
    const carouselContainer = document.createElement('div');
    carouselContainer.classList.add('testimonials-carousel');
    carouselContainer.setAttribute('role', 'region');
    carouselContainer.setAttribute('aria-label', 'Testimonials carousel');
    carouselContainer.setAttribute('aria-roledescription', 'carousel');

    // Create slides wrapper
    const slidesWrapper = document.createElement('div');
    slidesWrapper.classList.add('carousel__slides');
    slidesWrapper.setAttribute('aria-live', 'polite');

    // Move testimonial cards into slides wrapper, giving each a slide role
    testimonialCards.forEach((card, index) => {
      const slide = document.createElement('div');
      slide.classList.add('carousel__slide');
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `Testimonial ${index + 1} of ${testimonialCards.length}`);

      // Move the card into the slide
      card.parentNode.removeChild(card);
      slide.appendChild(card);
      slidesWrapper.appendChild(slide);
    });

    carouselContainer.appendChild(slidesWrapper);

    // Create controls container
    const controls = document.createElement('div');
    controls.classList.add('carousel__controls');

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.classList.add('carousel__btn', 'carousel__btn--prev');
    prevBtn.setAttribute('aria-label', 'Previous testimonial');
    prevBtn.innerHTML = '&#8592;'; // Left arrow
    prevBtn.type = 'button';

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.classList.add('carousel__btn', 'carousel__btn--next');
    nextBtn.setAttribute('aria-label', 'Next testimonial');
    nextBtn.innerHTML = '&#8594;'; // Right arrow
    nextBtn.type = 'button';

    // Dots indicator
    const dotsContainer = document.createElement('div');
    dotsContainer.classList.add('carousel__dots');
    dotsContainer.setAttribute('role', 'tablist');
    dotsContainer.setAttribute('aria-label', 'Testimonial navigation');

    testimonialCards.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel__dot');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
      dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      dot.type = 'button';
      dotsContainer.appendChild(dot);
    });

    controls.appendChild(prevBtn);
    controls.appendChild(dotsContainer);
    controls.appendChild(nextBtn);
    carouselContainer.appendChild(controls);

    // Replace the testimonials-grid content with the carousel
    testimonialsGrid.innerHTML = '';
    testimonialsGrid.appendChild(carouselContainer);

    // Get references to slides and dots
    const slides = slidesWrapper.querySelectorAll('.carousel__slide');
    const dots = dotsContainer.querySelectorAll('.carousel__dot');

    /**
     * Show the slide at the given index.
     * @param {number} index
     */
    const showSlide = (index) => {
      // Wrap around
      if (index < 0) index = testimonialCards.length - 1;
      if (index >= testimonialCards.length) index = 0;

      currentIndex = index;

      // Update slides visibility
      slides.forEach((slide, i) => {
        const isActive = i === currentIndex;
        slide.classList.toggle('carousel__slide--active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      // Update dots
      dots.forEach((dot, i) => {
        const isActive = i === currentIndex;
        dot.classList.toggle('carousel__dot--active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    };

    /**
     * Go to the next slide.
     */
    const nextSlide = () => {
      showSlide(currentIndex + 1);
      resetAutoRotate();
    };

    /**
     * Go to the previous slide.
     */
    const prevSlide = () => {
      showSlide(currentIndex - 1);
      resetAutoRotate();
    };

    /**
     * Start the auto-rotation timer.
     */
    const startAutoRotate = () => {
      if (autoRotateInterval) clearInterval(autoRotateInterval);
      autoRotateInterval = setInterval(nextSlide, AUTO_ROTATE_DELAY);
    };

    /**
     * Reset the auto-rotation timer (restart the delay).
     */
    const resetAutoRotate = () => {
      if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
        startAutoRotate();
      }
    };

    /**
     * Stop the auto-rotation timer.
     */
    const stopAutoRotate = () => {
      if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
        autoRotateInterval = null;
      }
    };

    // Event listeners for manual controls
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        resetAutoRotate();
      });
    });

    // Pause auto-rotation when hovering the carousel
    carouselContainer.addEventListener('mouseenter', stopAutoRotate);
    carouselContainer.addEventListener('mouseleave', startAutoRotate);

    // Pause auto-rotation when focusing controls (keyboard users)
    controls.addEventListener('focusin', stopAutoRotate);
    controls.addEventListener('focusout', (e) => {
      // Only restart if focus leaves the controls entirely
      if (!controls.contains(e.relatedTarget)) {
        startAutoRotate();
      }
    });

    // Keyboard navigation: Left/Right arrows on the carousel
    carouselContainer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    });

    // Initialize: show first slide and start auto-rotation
    showSlide(0);
    startAutoRotate();

    // Make the carousel focusable for keyboard events
    carouselContainer.setAttribute('tabindex', '0');

    // Add carousel styles dynamically (to avoid modifying styles.css)
    const carouselStyles = document.createElement('style');
    carouselStyles.textContent = `
      .testimonials-carousel {
        position: relative;
        width: 100%;
        outline: none;
      }
      .testimonials-carousel:focus-visible {
        outline: 3px solid var(--color-primary, #0077be);
        outline-offset: 4px;
        border-radius: var(--radius-md, 8px);
      }
      .carousel__slides {
        position: relative;
        overflow: hidden;
        min-height: 280px;
      }
      .carousel__slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.4s ease, visibility 0.4s ease;
        pointer-events: none;
      }
      .carousel__slide--active {
        position: relative;
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }
      .carousel__controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        margin-top: 1.5rem;
      }
      .carousel__btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border: 2px solid var(--color-primary, #0077be);
        border-radius: 50%;
        background: var(--color-white, #ffffff);
        color: var(--color-primary, #0077be);
        font-size: 1.25rem;
        cursor: pointer;
        transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
        user-select: none;
      }
      .carousel__btn:hover {
        background: var(--color-primary, #0077be);
        color: var(--color-white, #ffffff);
        transform: scale(1.1);
      }
      .carousel__btn:focus-visible {
        outline: 3px solid var(--color-primary, #0077be);
        outline-offset: 3px;
      }
      .carousel__dots {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .carousel__dot {
        width: 12px;
        height: 12px;
        border: 2px solid var(--color-primary, #0077be);
        border-radius: 50%;
        background: transparent;
        cursor: pointer;
        padding: 0;
        transition: background-color 0.3s ease, transform 0.2s ease;
      }
      .carousel__dot--active {
        background: var(--color-primary, #0077be);
        transform: scale(1.2);
      }
      .carousel__dot:hover {
        background: var(--color-primary, #0077be);
      }
      .carousel__dot:focus-visible {
        outline: 3px solid var(--color-primary, #0077be);
        outline-offset: 3px;
      }
      @media (prefers-reduced-motion: reduce) {
        .carousel__slide {
          transition: none;
        }
        .carousel__btn,
        .carousel__dot {
          transition: none;
        }
      }
    `;
    document.head.appendChild(carouselStyles);
  }

  // =====================================================
  // 3. HOVER EFFECT ON 'SHOP NOW' BUTTONS
  // =====================================================

  /**
   * Find all 'Shop Now' buttons and apply a hover color-shift effect.
   * We target buttons that contain the text "Shop Now" or have the
   * aria-label containing "Shop Now".
   */
  const shopNowButtons = document.querySelectorAll(
    '.btn[aria-label*="Shop Now"], .btn:not([aria-label])'
  );

  shopNowButtons.forEach((btn) => {
    // Only target buttons that actually say "Shop Now" if no aria-label match
    if (!btn.getAttribute('aria-label') && !btn.textContent.includes('Shop Now')) {
      return;
    }

    // Skip if aria-label exists but doesn't contain "Shop Now"
    const ariaLabel = btn.getAttribute('aria-label');
    if (ariaLabel && !ariaLabel.includes('Shop Now')) {
      return;
    }

    // Store original computed background color on first interaction
    let originalBg = '';
    let hoverBg = '';

    btn.addEventListener('mouseenter', () => {
      // Capture the original background on first hover
      if (!originalBg) {
        const computedStyle = window.getComputedStyle(btn);
        originalBg = computedStyle.backgroundColor;
      }

      // Determine hover color based on which section the button is in
      if (btn.closest('.hero')) {
        hoverBg = getComputedStyle(btn).getPropertyValue('--color-secondary').trim() || '#e6f7ff';
      } else if (btn.closest('.section--cta')) {
        hoverBg = getComputedStyle(btn).getPropertyValue('--color-secondary').trim() || '#e6f7ff';
      } else {
        // Generic: darken the original color
        hoverBg = getComputedStyle(btn).getPropertyValue('--color-accent').trim() || '#003f7f';
      }

      // Apply transition via inline style for JS-driven effect
      btn.style.transition = 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease';
    });

    btn.addEventListener('mouseleave', () => {
      // The CSS hover will handle the return, but we ensure the transition is smooth
      btn.style.transition = 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease';
    });
  });

  // =====================================================
  // 4. DYNAMIC YEAR INSERTION IN THE FOOTER
  // =====================================================

  const footerCopyright = document.querySelector('.footer__copyright');
  if (footerCopyright) {
    const currentYear = new Date().getFullYear();
    // Replace "2025" (or any 4-digit year) in the copyright text with the current year
    const updatedText = footerCopyright.textContent.replace(/\d{4}/, currentYear);
    if (updatedText !== footerCopyright.textContent) {
      footerCopyright.textContent = updatedText;
    }
  }

  // =====================================================
  // BONUS: Active nav link highlighting on scroll
  // =====================================================

  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0 && navLinks.length > 0) {
    /**
     * Update active nav link based on which section is in view.
     */
    const updateActiveNav = () => {
      const scrollPosition = window.pageYOffset + headerHeight + 100;

      let currentSectionId = '';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const linkId = href.slice(1);
          const isActive = linkId === currentSectionId;
          link.classList.toggle('nav__link--active', isActive);
          link.setAttribute('aria-current', isActive ? 'true' : 'false');
        }
      });
    };

    // Throttled scroll listener for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveNav();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Also run on page load
    updateActiveNav();
  }

  // Add a small style for active nav link (if not already in CSS)
  const activeNavStyles = document.createElement('style');
  activeNavStyles.textContent = `
    .nav__link--active {
      color: var(--color-primary, #0077be);
      font-weight: var(--font-weight-bold, 700);
      border-bottom: 2px solid var(--color-primary, #0077be);
    }
  `;
  document.head.appendChild(activeNavStyles);

  console.log('AquaPure: All interactive enhancements loaded successfully.');
});