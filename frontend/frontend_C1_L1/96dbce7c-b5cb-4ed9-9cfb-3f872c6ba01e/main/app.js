/**
 * DataPulse Landing Page — Interactive Behaviors
 * Vanilla ES6+ JavaScript. No external libraries.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================================
  // 1. Mobile Navigation Toggle
  // ============================================================
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = navLinks.classList.toggle('active');
      mobileMenuToggle.setAttribute('aria-expanded', String(isExpanded));
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape key and return focus to toggle button
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.focus();
      }
    });
  }

  // ============================================================
  // 2. Smooth Scroll for Internal Anchor Links
  // ============================================================
  const siteHeader = document.querySelector('.site-header');
  const headerOffset = siteHeader ? siteHeader.offsetHeight + 16 : 80;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // 3. Testimonials Carousel
  // ============================================================
  const carousel = document.querySelector('.testimonials-carousel');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  if (slides.length > 0) {
    let currentSlide = 0;
    let autoRotateInterval = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const showSlide = (index) => {
      // Wrap index
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentSlide = index;

      // Update slides visibility
      slides.forEach((slide, i) => {
        if (i === currentSlide) {
          slide.removeAttribute('hidden');
          slide.classList.add('active');
        } else {
          slide.setAttribute('hidden', '');
          slide.classList.remove('active');
        }
      });

      // Update dots
      dots.forEach((dot, i) => {
        if (i === currentSlide) {
          dot.classList.add('active');
          dot.setAttribute('aria-selected', 'true');
        } else {
          dot.classList.remove('active');
          dot.setAttribute('aria-selected', 'false');
        }
      });
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    const startAutoRotate = () => {
      stopAutoRotate();
      if (!prefersReducedMotion) {
        autoRotateInterval = setInterval(nextSlide, 5000);
      }
    };

    const stopAutoRotate = () => {
      if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
        autoRotateInterval = null;
      }
    };

    // Initialize
    showSlide(0);
    startAutoRotate();

    // Prev / Next buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
      });
    }

    // Dot navigation
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => showSlide(i));
    });

    // Pause on hover / resume on mouse leave
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoRotate);
      carousel.addEventListener('mouseleave', startAutoRotate);

      // Pause when any element inside receives focus; resume when focus leaves
      carousel.addEventListener('focusin', stopAutoRotate);
      carousel.addEventListener('focusout', (e) => {
        if (!carousel.contains(e.relatedTarget)) {
          startAutoRotate();
        }
      });

      // Keyboard arrow navigation
      carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          showSlide(currentSlide - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          showSlide(currentSlide + 1);
        }
      });
    }
  }

  // ============================================================
  // 4. FAQ Accordion
  // ============================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const summary = item.querySelector('.faq-question');
    if (!summary) return;

    summary.addEventListener('click', () => {
      // Allow native <details> toggle to complete, then manage siblings & ARIA
      requestAnimationFrame(() => {
        const isOpen = item.open;

        if (isOpen) {
          // Accordion behavior: close all other items
          faqItems.forEach((other) => {
            if (other !== item && other.open) {
              other.open = false;
              const otherSummary = other.querySelector('.faq-question');
              if (otherSummary) {
                otherSummary.setAttribute('aria-expanded', 'false');
              }
              other.classList.remove('expanded');
            }
          });

          summary.setAttribute('aria-expanded', 'true');
          item.classList.add('expanded');
        } else {
          summary.setAttribute('aria-expanded', 'false');
          item.classList.remove('expanded');
        }
      });
    });
  });
});
