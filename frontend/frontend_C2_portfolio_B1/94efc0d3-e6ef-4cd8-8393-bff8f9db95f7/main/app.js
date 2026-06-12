/**
 * app.js — Aymen Portfolio
 * Handles: animations, theme toggle, form validation, mobile nav
 * Vanilla JS — no frameworks
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================================
  // 1. HERO ANIMATION ON LOAD
  // ============================================================
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    // Hero uses .section-hero-load class — CSS keyframes handle fade-in
    // Force repaint to ensure animation triggers
    heroSection.classList.add('section-hero-load');
  }

  // ============================================================
  // 2. INTERSECTION OBSERVER — Sections animate on scroll
  // ============================================================
  const sections = document.querySelectorAll('.section-hidden');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target;

          // Reveal the section
          section.classList.add('section-visible');

          // --- Special: Skills — animate progress bars ---
          if (section.id === 'skills') {
            animateProgressBars();
          }

          // --- Special: Projects — stagger cards ---
          if (section.id === 'projects') {
            const cards = section.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
              // Cards start hidden inside .section-hidden section,
              // so we stagger revealing them
              card.style.opacity = '0';
              card.style.transform = 'translateY(30px)';
              card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, 150 * index);
            });
          }

          // --- Special: Experience timeline — animate dots ---
          if (section.id === 'experience') {
            const timelineItems = section.querySelectorAll('.timeline-item');
            timelineItems.forEach((item) => {
              const delay = parseInt(item.getAttribute('data-delay'), 10) || 0;
              const dot = item.querySelector('.timeline-dot');
              if (dot) {
                setTimeout(() => {
                  dot.classList.add('animate-dot');
                }, delay);
              }
            });
          }

          // Unobserve once animated
          sectionObserver.unobserve(section);
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // ============================================================
  // 3. ANIMATE PROGRESS BARS (Skills)
  // ============================================================
  function animateProgressBars() {
    const skillItems = document.querySelectorAll('.skill-item');

    skillItems.forEach((item) => {
      const bar = item.querySelector('.skill-bar');
      const percentSpan = item.querySelector('.skill-percent');
      const targetPercent = parseInt(item.getAttribute('data-percentage'), 10);

      if (!bar || !percentSpan || isNaN(targetPercent)) return;

      const targetValue = targetPercent;

      // Use requestAnimationFrame with ease-out over 1.5s
      const duration = 1500; // ms
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1.0);

        // Ease-out cubic: 1 - (1-t)^3
        const eased = 1 - Math.pow(1 - progress, 3);

        const currentWidth = eased * targetValue;

        bar.style.width = currentWidth + '%';
        bar.setAttribute('aria-valuenow', Math.round(currentWidth));
        percentSpan.textContent = Math.round(currentWidth) + '%';

        if (progress < 1.0) {
          requestAnimationFrame(update);
        } else {
          // Ensure final value is exact
          bar.style.width = targetValue + '%';
          bar.setAttribute('aria-valuenow', targetValue);
          percentSpan.textContent = targetValue + '%';
        }
      }

      requestAnimationFrame(update);
    });
  }

  // ============================================================
  // 4. THEME TOGGLE
  // ============================================================
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Apply stored theme on load
  const storedTheme = localStorage.getItem('aymen-portfolio-theme');
  if (storedTheme === 'light') {
    body.classList.add('light-theme');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('light-theme');

      // Persist preference
      if (body.classList.contains('light-theme')) {
        localStorage.setItem('aymen-portfolio-theme', 'light');
      } else {
        localStorage.setItem('aymen-portfolio-theme', 'dark');
      }
    });
  }

  // ============================================================
  // 5. MOBILE NAV TOGGLE
  // ============================================================
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================================
  // 6. CONTACT FORM VALIDATION
  // ============================================================
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    // Load saved form data from localStorage
    loadFormData();

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear all previous errors
      clearErrors();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      let isValid = true;

      // Validate Name (non-empty)
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Name is required.');
        isValid = false;
      }

      // Validate Email (regex)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required.');
        isValid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      }

      // Validate Message (non-empty)
      if (!messageInput.value.trim()) {
        showError(messageInput, 'Message is required.');
        isValid = false;
      }

      if (isValid) {
        // Show success toast
        showToast('✅ Message sent!');

        // Save to localStorage
        saveFormData({
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          message: messageInput.value.trim(),
        });

        // Clear form
        contactForm.reset();
        localStorage.removeItem('aymen-contact-form');
      }
    });

    // Save on input (auto-save draft)
    const formInputs = contactForm.querySelectorAll('.form-input');
    formInputs.forEach((input) => {
      input.addEventListener('input', () => {
        const data = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          message: document.getElementById('message').value,
        };
        localStorage.setItem('aymen-contact-form', JSON.stringify(data));
      });
    });
  }

  /**
   * Show error on a specific input
   */
  function showError(input, message) {
    input.classList.add('error');

    // Find the sibling error span
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      const errorSpan = formGroup.querySelector('.form-error');
      if (errorSpan) {
        errorSpan.textContent = message;
      }
    }

    // Remove error class after animation completes
    setTimeout(() => {
      input.classList.remove('error');
    }, 600);
  }

  /**
   * Clear all form errors
   */
  function clearErrors() {
    const errorInputs = contactForm.querySelectorAll('.form-input.error');
    errorInputs.forEach((input) => {
      input.classList.remove('error');
    });

    const errorSpans = contactForm.querySelectorAll('.form-error');
    errorSpans.forEach((span) => {
      span.textContent = '';
    });
  }

  /**
   * Show toast notification
   */
  function showToast(message) {
    // Remove any existing toast
    const existing = document.querySelector('.toast');
    if (existing) {
      existing.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');

    document.body.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 3000);
  }

  /**
   * Save form data to localStorage
   */
  function saveFormData(data) {
    localStorage.setItem('aymen-contact-form', JSON.stringify(data));
  }

  /**
   * Load saved form data from localStorage
   */
  function loadFormData() {
    const saved = localStorage.getItem('aymen-contact-form');
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      if (data.name) document.getElementById('name').value = data.name;
      if (data.email) document.getElementById('email').value = data.email;
      if (data.message) document.getElementById('message').value = data.message;
    } catch (e) {
      // Ignore corrupt data
    }
  }
});
