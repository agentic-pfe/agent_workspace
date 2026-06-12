/**
 * Alex Morgan Portfolio — app.js
 * Vanilla JavaScript for interactive elements.
 *
 * Features:
 * - Mobile menu toggle with aria-expanded management
 * - Smooth scroll with active nav link tracking (IntersectionObserver)
 * - Header scroll shadow effect
 * - Skills bar animation on scroll (fills from 0% to target)
 * - Testimonial carousel with dot navigation & auto-play
 * - Contact form validation with inline error messages
 *
 * FIXES applied during review:
 * - [FIX 1] Nav: close mobile menu after clicking a nav link
 * - [FIX 2] Skills: use IntersectionObserver instead of scroll event for performance
 * - [FIX 3] Carousel: pause auto-play when user hovers over testimonials
 * - [FIX 4] Form: trim whitespace before validation, validate on blur
 * - [FIX 5] Scroll-spy: use IntersectionObserver threshold to detect active section
 */

(function () {
  'use strict';

  /* ==============================================================
   * 1. DOM REFERENCE CACHE
   * ============================================================== */
  const header = document.getElementById('header');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navList = document.querySelector('.nav-list');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillPercentages = document.querySelectorAll('.skill-percentage');
  const testimonialTrack = document.querySelector('.testimonials-track');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  /* ==============================================================
   * 2. MOBILE MENU TOGGLE
   * ============================================================== */
  function toggleMobileMenu() {
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    navList.classList.toggle('nav-open');

    // Prevent body scroll when menu is open
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  }

  function closeMobileMenu() {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    navList.classList.remove('nav-open');
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle && navList) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }

  // [FIX 1] Close mobile menu when a nav link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navList.classList.contains('nav-open')) {
        closeMobileMenu();
      }
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navList.classList.contains('nav-open')) {
      closeMobileMenu();
      mobileMenuToggle.focus();
    }
  });

  /* ==============================================================
   * 3. HEADER SCROLL SHADOW
   * ============================================================== */
  function updateHeaderShadow() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeaderShadow, { passive: true });
  // Initial check
  updateHeaderShadow();

  /* ==============================================================
   * 4. SMOOTH SCROLL + ACTIVE NAV LINK (SCROLL SPY)
   *    Uses IntersectionObserver for performance
   * ============================================================== */
  function setActiveNavLink(id) {
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + id) {
        link.classList.add('active');
      }
    });
  }

  // [FIX 5] Use IntersectionObserver with reasonable threshold
  if ('IntersectionObserver' in window) {
    const sectionObserverOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveNavLink(entry.target.id);
        }
      });
    }, sectionObserverOptions);

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  } else {
    // Fallback: update on scroll (throttled)
    let scrollTicking = false;
    window.addEventListener('scroll', function () {
      if (!scrollTicking) {
        window.requestAnimationFrame(function () {
          let currentId = '';
          sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
              currentId = section.getAttribute('id');
            }
          });
          if (currentId) {
            setActiveNavLink(currentId);
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });
  }

  /* ==============================================================
   * 5. SKILLS BAR ANIMATION ON SCROLL
   *    [FIX 2] Uses IntersectionObserver for performance
   * ============================================================== */
  function animateSkillBars() {
    skillBars.forEach(function (bar, index) {
      const targetWidth = bar.getAttribute('data-width');
      const percentageEl = skillPercentages[index];
      const targetPercentage = percentageEl ? percentageEl.getAttribute('data-target') : targetWidth;

      // Set width via inline style for the transition to take effect
      bar.style.width = targetWidth + '%';
      bar.classList.add('animated');

      // Animate percentage counter
      if (percentageEl && targetPercentage) {
        animateCounter(percentageEl, 0, parseInt(targetPercentage, 10), 1200);
      }
    });
  }

  function animateCounter(element, start, end, duration) {
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(start + (end - start) * eased);
      element.textContent = currentValue + '%';

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if ('IntersectionObserver' in window && skillBars.length > 0) {
    let skillsAnimated = false;
    const skillsSection = document.getElementById('skills');

    const skillsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !skillsAnimated) {
          skillsAnimated = true;
          // Small delay so the user sees the bars fill
          setTimeout(animateSkillBars, 200);
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    if (skillsSection) {
      skillsObserver.observe(skillsSection);
    }
  } else {
    // Fallback: animate immediately
    animateSkillBars();
  }

  /* ==============================================================
   * 6. TESTIMONIAL CAROUSEL
   *    [FIX 3] Auto-play with pause on hover
   * ============================================================== */
  if (testimonialTrack && testimonialCards.length > 0) {
    let currentIndex = 0;
    const totalSlides = testimonialCards.length;
    let autoPlayInterval = null;
    const autoPlayDelay = 5000;

    function goToSlide(index) {
      // Wrap around
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;

      // Translate the track
      testimonialTrack.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

      // Update active dot
      testimonialDots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIndex);
        dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
      });
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }

    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }

    // Dot navigation
    testimonialDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const index = parseInt(this.getAttribute('data-index'), 10);
        goToSlide(index);
        // Reset auto-play timer on manual interaction
        startAutoPlay();
      });
    });

    // [FIX 3] Pause auto-play on hover
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoPlay);
      carousel.addEventListener('mouseleave', startAutoPlay);
      carousel.addEventListener('focusin', stopAutoPlay);
      carousel.addEventListener('focusout', function () {
        // Restart only if focus left the carousel entirely
        if (!carousel.contains(document.activeElement)) {
          startAutoPlay();
        }
      });
    }

    // Keyboard navigation
    if (carousel) {
      carousel.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevSlide();
          startAutoPlay();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextSlide();
          startAutoPlay();
        }
      });
    }

    // Touch / swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    if (carousel) {
      carousel.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carousel.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          startAutoPlay();
        }
      }, { passive: true });
    }

    // Start auto-play
    startAutoPlay();
  }

  /* ==============================================================
   * 7. CONTACT FORM VALIDATION
   *    [FIX 4] Trim whitespace, validate on blur, inline errors
   * ============================================================== */
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    // Validation rules
    function validateName(value) {
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        return 'Please enter your name.';
      }
      if (trimmed.length < 2) {
        return 'Name must be at least 2 characters.';
      }
      if (trimmed.length > 100) {
        return 'Name must be under 100 characters.';
      }
      return '';
    }

    function validateEmail(value) {
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        return 'Please enter your email address.';
      }
      // RFC 5322 compliant-ish regex
      var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(trimmed)) {
        return 'Please enter a valid email address.';
      }
      return '';
    }

    function validateMessage(value) {
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        return 'Please enter your message.';
      }
      if (trimmed.length < 10) {
        return 'Message must be at least 10 characters.';
      }
      if (trimmed.length > 2000) {
        return 'Message must be under 2000 characters.';
      }
      return '';
    }

    // Show / clear error
    function setFieldError(inputEl, errorEl, errorMessage) {
      if (errorMessage) {
        inputEl.classList.add('error');
        inputEl.classList.remove('valid');
        errorEl.textContent = errorMessage;
      } else {
        inputEl.classList.remove('error');
        inputEl.classList.add('valid');
        errorEl.textContent = '';
      }
    }

    // Validate single field
    function validateField(field) {
      var value = field.value;
      var error = '';

      if (field === nameInput) {
        error = validateName(value);
        setFieldError(nameInput, nameError, error);
      } else if (field === emailInput) {
        error = validateEmail(value);
        setFieldError(emailInput, emailError, error);
      } else if (field === messageInput) {
        error = validateMessage(value);
        setFieldError(messageInput, messageError, error);
      }

      return error === '';
    }

    // [FIX 4] Validate on blur (when user leaves the field)
    if (nameInput) {
      nameInput.addEventListener('blur', function () {
        if (nameInput.value.trim().length > 0) {
          validateField(nameInput);
        }
      });
      nameInput.addEventListener('input', function () {
        // Clear error on typing if previously had error
        if (nameInput.classList.contains('error')) {
          validateField(nameInput);
        }
      });
    }

    if (emailInput) {
      emailInput.addEventListener('blur', function () {
        if (emailInput.value.trim().length > 0) {
          validateField(emailInput);
        }
      });
      emailInput.addEventListener('input', function () {
        if (emailInput.classList.contains('error')) {
          validateField(emailInput);
        }
      });
    }

    if (messageInput) {
      messageInput.addEventListener('blur', function () {
        if (messageInput.value.trim().length > 0) {
          validateField(messageInput);
        }
      });
      messageInput.addEventListener('input', function () {
        if (messageInput.classList.contains('error')) {
          validateField(messageInput);
        }
      });
    }

    // Form submission
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validate all fields
      var nameValid = validateField(nameInput);
      var emailValid = validateField(emailInput);
      var messageValid = validateField(messageInput);

      if (nameValid && emailValid && messageValid) {
        // Simulate form submission
        var submitBtn = contactForm.querySelector('.btn-submit');
        if (submitBtn) {
          submitBtn.textContent = 'Sending...';
          submitBtn.disabled = true;
        }

        // Simulate network delay
        setTimeout(function () {
          contactForm.reset();
          // Remove valid classes
          [nameInput, emailInput, messageInput].forEach(function (input) {
            if (input) {
              input.classList.remove('valid', 'error');
            }
          });
          // Show success message
          if (formSuccess) {
            formSuccess.removeAttribute('hidden');
          }
          // Reset button
          if (submitBtn) {
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
          }
          // Hide success after 6 seconds
          setTimeout(function () {
            if (formSuccess) {
              formSuccess.setAttribute('hidden', '');
            }
          }, 6000);
        }, 1500);
      } else {
        // Focus the first invalid field
        if (!nameValid) {
          nameInput.focus();
        } else if (!emailValid) {
          emailInput.focus();
        } else {
          messageInput.focus();
        }
      }
    });
  }

  /* ==============================================================
   * 8. INITIALIZATION LOG
   * ============================================================== */
  console.log('Alex Morgan Portfolio — ready.');
  console.log('Features: mobile menu, scroll-spy, skill bars, testimonial carousel, form validation.');

})();
