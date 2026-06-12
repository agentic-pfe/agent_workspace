/**
 * Dashflow SaaS Landing Page – app.js
 * Dark/Light Theme + Scroll Animations + Carousel + Counter + Newsletter
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==============================================
     THEME TOGGLE
     ============================================== */
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  /* ==============================================
     SCROLL ANIMATIONS (IntersectionObserver)
     ============================================== */
  const allSections = document.querySelectorAll('section.section-hidden');

  // Hero section visible immediately
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.classList.add('visible');
  }

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  allSections.forEach((section) => {
    // Skip hero — already handled
    if (section.id !== 'hero') {
      sectionObserver.observe(section);
    }
  });

  /* ==============================================
     STATS COUNTER ANIMATION
     ============================================== */
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stats__number');
  let statsAnimated = false;

  function animateCounter(el) {
    const targetAttr = el.getAttribute('data-target');
    if (!targetAttr) return;

    const isDecimal = el.hasAttribute('data-decimal');
    const target = parseFloat(targetAttr);
    const duration = 2000; // ms
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (isDecimal) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.floor(current).toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Final value
        if (isDecimal) {
          el.textContent = target.toFixed(1);
        } else {
          el.textContent = Math.floor(target).toLocaleString();
        }
        // Pop animation
        el.classList.add('pop');
        setTimeout(() => el.classList.remove('pop'), 300);
      }
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach((num) => animateCounter(num));
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  /* ==============================================
     TESTIMONIALS CAROUSEL
     ============================================== */
  const track = document.getElementById('testimonials-track');
  const slides = document.querySelectorAll('.testimonials__slide');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dots = document.querySelectorAll('.testimonials__dot');
  const carousel = document.getElementById('testimonials-carousel');

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoAdvanceTimer = null;
  let isPaused = false;

  function showSlide(index) {
    // Wrap around
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentIndex = index;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('testimonials__slide--active');
      } else {
        slide.classList.remove('testimonials__slide--active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('testimonials__dot--active');
      } else {
        dot.classList.remove('testimonials__dot--active');
      }
    });
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoAdvance() {
    stopAutoAdvance();
    if (!isPaused) {
      autoAdvanceTimer = setInterval(nextSlide, 5000);
    }
  }

  function stopAutoAdvance() {
    if (autoAdvanceTimer) {
      clearInterval(autoAdvanceTimer);
      autoAdvanceTimer = null;
    }
  }

  // Event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoAdvance();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoAdvance();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-slide'), 10);
      if (!isNaN(slideIndex)) {
        showSlide(slideIndex);
        startAutoAdvance();
      }
    });
  });

  // Pause on hover
  if (carousel) {
    carousel.addEventListener('mouseenter', () => {
      isPaused = true;
      stopAutoAdvance();
    });

    carousel.addEventListener('mouseleave', () => {
      isPaused = false;
      startAutoAdvance();
    });
  }

  // Initial auto-advance
  startAutoAdvance();

  /* ==============================================
     NEWSLETTER FORM VALIDATION
     ============================================== */
  const newsletterForm = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('email-input');
  const toast = document.getElementById('toast');

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    // Auto-hide after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  if (newsletterForm && emailInput) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();

      if (!isValidEmail(email)) {
        // Invalid: red border + shake
        emailInput.classList.add('invalid');
        setTimeout(() => {
          emailInput.classList.remove('invalid');
        }, 600);
        return;
      }

      // Valid: clear input, show toast
      emailInput.value = '';
      emailInput.classList.remove('invalid');
      showToast('Subscribed!');
    });
  }

  /* ==============================================
     HAMBURGER MENU TOGGLE (Mobile)
     ============================================== */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      if (isOpen) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
      } else {
        navLinks.classList.add('open');
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'Close menu');
      }
    });

    // Close menu when a nav link is clicked (mobile)
    const navLinkItems = navLinks.querySelectorAll('.nav__link');
    navLinkItems.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ==============================================
     SMOOTH SCROLL (for any anchor links)
     ============================================== */
  // CSS scroll-behavior: smooth handles most cases,
  // but ensure all internal anchor links work
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
