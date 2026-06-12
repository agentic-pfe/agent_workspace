'use strict';

document.addEventListener('DOMContentLoaded', function () {
  /* ============================================================
     1. THEME TOGGLE
     ============================================================ */
  const themeToggleBtn = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  const htmlEl = document.documentElement;

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '\uD83C\uDF19' : '\u2600\uFE0F'; // moon / sun
    }
  }

  let currentTheme = localStorage.getItem('theme');
  if (!currentTheme) {
    currentTheme = 'dark';
    localStorage.setItem('theme', currentTheme);
  }
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', currentTheme);
      applyTheme(currentTheme);
    });
  }

  /* ============================================================
     2. SMOOTH SCROLLING
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* ============================================================
     3. SCROLL ANIMATIONS (IntersectionObserver)
     ============================================================ */
  const animatedSections = document.querySelectorAll(
    '.features, .stats, .testimonials, .pricing, .newsletter, .footer'
  );

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animatedSections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // Hero visible immediately
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.classList.add('visible');
  }

  /* ============================================================
     4. STATS COUNTER ANIMATION
     ============================================================ */
  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const counters = statsSection.querySelectorAll('.counter');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            counters.forEach(function (counter) {
              const rawTarget = counter.getAttribute('data-target');
              if (rawTarget === null) return;

              const target = parseFloat(rawTarget);
              const isFloat = rawTarget.includes('.');
              const duration = 2000; // ms
              const startTime = performance.now();

              function easeOutQuad(t) {
                return t * (2 - t);
              }

              function updateCounter(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = easeOutQuad(progress);
                const current = eased * target;

                if (isFloat) {
                  counter.textContent = current.toFixed(1);
                } else {
                  counter.textContent = Math.floor(current).toLocaleString();
                }

                if (progress < 1) {
                  requestAnimationFrame(updateCounter);
                } else {
                  // Final exact value
                  if (isFloat) {
                    counter.textContent = target.toFixed(1);
                  } else {
                    counter.textContent = Math.floor(target).toLocaleString();
                  }
                  // Pop animation
                  counter.classList.add('pop');
                  setTimeout(function () {
                    counter.classList.remove('pop');
                  }, 400);
                }
              }

              requestAnimationFrame(updateCounter);
            });
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    statsObserver.observe(statsSection);
  }

  /* ============================================================
     5. TESTIMONIALS CAROUSEL
     ============================================================ */
  const carouselContainer = document.querySelector('.testimonials-carousel');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dots = document.querySelectorAll('.dot');

  let currentIndex = 0;
  let autoInterval = null;

  function showTestimonial(index) {
    testimonialCards.forEach(function (card, i) {
      if (i === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    dots.forEach(function (dot, i) {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    currentIndex = index;
  }

  function nextTestimonial() {
    const next = (currentIndex + 1) % testimonialCards.length;
    showTestimonial(next);
  }

  function prevTestimonial() {
    const prev =
      (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(prev);
  }

  function startAutoAdvance() {
    if (autoInterval) clearInterval(autoInterval);
    autoInterval = setInterval(nextTestimonial, 5000);
  }

  function stopAutoAdvance() {
    if (autoInterval) {
      clearInterval(autoInterval);
      autoInterval = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      prevTestimonial();
      stopAutoAdvance();
      startAutoAdvance();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      nextTestimonial();
      stopAutoAdvance();
      startAutoAdvance();
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const idx = parseInt(this.getAttribute('data-index'), 10);
      if (!isNaN(idx)) {
        showTestimonial(idx);
        stopAutoAdvance();
        startAutoAdvance();
      }
    });
  });

  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoAdvance);
    carouselContainer.addEventListener('mouseleave', startAutoAdvance);
  }

  // Initialize auto-advance
  if (testimonialCards.length > 0) {
    startAutoAdvance();
  }

  /* ============================================================
     6. NEWSLETTER FORM VALIDATION
     ============================================================ */
  const newsletterForm = document.querySelector('.newsletter-form');
  const emailInput = document.querySelector('.email-input');
  const toast = document.querySelector('.toast');

  if (newsletterForm && emailInput) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = emailInput.value.trim();
      // Simple regex: must contain @ and .
      const isValid = /.+@.+\..+/.test(email);

      if (!isValid) {
        emailInput.classList.add('invalid');
        // Remove invalid class after animation ends so it can be re-triggered
        emailInput.addEventListener(
          'animationend',
          function handler() {
            emailInput.classList.remove('invalid');
            emailInput.removeEventListener('animationend', handler);
          },
          { once: true }
        );
        return;
      }

      // Valid
      emailInput.value = '';
      if (toast) {
        toast.textContent = 'Subscribed!';
        toast.classList.add('show');
        setTimeout(function () {
          toast.classList.remove('show');
        }, 3000);
      }
    });
  }

  /* ============================================================
     7. MOBILE HAMBURGER MENU
     ============================================================ */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu() {
    if (!mobileNav) return;
    const isOpen = mobileNav.classList.toggle('open');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', String(isOpen));
    }
    if (mobileNav) {
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
    }
  }

  function closeMobileMenu() {
    if (mobileNav) {
      mobileNav.classList.remove('open');
    }
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
    }
    if (mobileNav) {
      mobileNav.setAttribute('aria-hidden', 'true');
    }
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (
        mobileNav.classList.contains('open') &&
        !mobileNav.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });
  }

  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileMenu();
    });
  });
});
