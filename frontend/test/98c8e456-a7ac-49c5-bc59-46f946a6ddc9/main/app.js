/* ==========================================================================
   PulsePro — app.js
   Vanilla ES6+ JavaScript — mobile menu, smooth scroll, progress animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. Cache DOM references
     ------------------------------------------------------------------------ */
  const header    = document.querySelector('.header');
  const nav       = document.querySelector('.nav');
  const navList   = document.querySelector('.nav__list');
  const navLinks  = document.querySelectorAll('.nav__link');
  const logo      = document.querySelector('.nav__logo');
  const features  = document.querySelector('.features');
  const cards     = document.querySelectorAll('.card');
  const heroCta   = document.querySelector('.hero__actions');
  const sectionCta = document.querySelector('.section--cta');

  if (!nav || !navList) return; // guard: essential elements missing

  /* ------------------------------------------------------------------------
     2. Mobile Menu Toggle — create hamburger button
     ------------------------------------------------------------------------ */
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'nav__toggle';
  toggleBtn.setAttribute('type', 'button');
  toggleBtn.setAttribute('aria-label', 'Toggle navigation menu');
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.innerHTML = `
    <span class="nav__toggle-bar"></span>
    <span class="nav__toggle-bar"></span>
    <span class="nav__toggle-bar"></span>
  `;

  // Insert toggle button before the nav list
  nav.insertBefore(toggleBtn, navList);

  /**
   * Open / close the mobile menu.
   * @param {boolean} forceOpen — optional explicit state
   */
  function toggleMenu(forceOpen) {
    const isOpen = forceOpen !== undefined
      ? forceOpen
      : !navList.classList.contains('nav__list--open');

    navList.classList.toggle('nav__list--open', isOpen);
    toggleBtn.classList.toggle('nav__toggle--active', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));

    // Prevent body scroll while menu is open
    document.body.classList.toggle('body--menu-open', isOpen);
  }

  // Click toggle button
  toggleBtn.addEventListener('click', () => toggleMenu());

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navList.classList.contains('nav__list--open')) {
      toggleMenu(false);
      toggleBtn.focus();
    }
  });

  // Close menu when clicking outside the nav
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navList.classList.contains('nav__list--open')) {
      toggleMenu(false);
    }
  });

  // Close menu on window resize (if viewport grows past mobile breakpoint)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 768 && navList.classList.contains('nav__list--open')) {
        toggleMenu(false);
      }
    }, 150);
  });

  // Close menu when a nav link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navList.classList.contains('nav__list--open')) {
        toggleMenu(false);
      }
    });
  });

  /* ------------------------------------------------------------------------
     3. Smooth scrolling for anchor links (same-page only)
     ------------------------------------------------------------------------ */
  function handleSmoothScroll(e) {
    const href = this.getAttribute('href');
    if (!href || !href.startsWith('#') || href === '#') return;

    const targetId = href.slice(1); // remove '#'
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    e.preventDefault();

    targetEl.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    // Update URL hash without causing a jump
    history.pushState(null, '', href);
  }

  // Apply to all nav links and any other anchor with an on-page hash
  const allAnchors = document.querySelectorAll('a[href^="#"]');
  allAnchors.forEach((anchor) => {
    anchor.addEventListener('click', handleSmoothScroll);
  });

  /* ------------------------------------------------------------------------
     4. Progress Bar Animation — create & animate on scroll
     ------------------------------------------------------------------------ */
  if (cards.length) {
    // Progress metrics for each feature card
    const progressData = [
      { label: 'Workouts Logged',    current: 87,  max: 100, color: '#0d9488' },
      { label: 'Data Accuracy',      current: 94,  max: 100, color: '#7c3aed' },
      { label: 'Goals Achieved',     current: 78,  max: 100, color: '#ea580c' },
    ];

    cards.forEach((card, index) => {
      const data = progressData[index] || progressData[0];

      // Create progress bar container
      const barWrapper = document.createElement('div');
      barWrapper.className = 'card__progress';
      barWrapper.setAttribute('role', 'progressbar');
      barWrapper.setAttribute('aria-valuenow', '0');
      barWrapper.setAttribute('aria-valuemin', '0');
      barWrapper.setAttribute('aria-valuemax', String(data.max));
      barWrapper.setAttribute('aria-label', `${data.label}: 0%`);

      // Label row
      const labelRow = document.createElement('div');
      labelRow.className = 'card__progress-label';

      const labelSpan = document.createElement('span');
      labelSpan.className = 'card__progress-text';
      labelSpan.textContent = data.label;

      const valueSpan = document.createElement('span');
      valueSpan.className = 'card__progress-value';
      valueSpan.textContent = '0%';

      labelRow.appendChild(labelSpan);
      labelRow.appendChild(valueSpan);

      // Track (background)
      const track = document.createElement('div');
      track.className = 'card__progress-track';

      // Fill (the animated bar)
      const fill = document.createElement('div');
      fill.className = 'card__progress-fill';
      fill.style.width = '0%';
      fill.style.backgroundColor = data.color;
      fill.setAttribute('aria-hidden', 'true');

      track.appendChild(fill);
      barWrapper.appendChild(labelRow);
      barWrapper.appendChild(track);

      // Append to card — after the description
      const desc = card.querySelector('.card__description');
      if (desc) {
        desc.insertAdjacentElement('afterend', barWrapper);
      } else {
        card.appendChild(barWrapper);
      }

      // Store data on the element for the observer
      barWrapper.dataset.targetPercent = data.current;
    });
  }

  /* ------------------------------------------------------------------------
     5. IntersectionObserver — animate progress bars when visible
     ------------------------------------------------------------------------ */
  const progressFills = document.querySelectorAll('.card__progress-fill');
  const progressValues = document.querySelectorAll('.card__progress-value');
  const progressWrappers = document.querySelectorAll('.card__progress');

  if ('IntersectionObserver' in window && progressWrappers.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const wrapper = entry.target;
          const fill = wrapper.querySelector('.card__progress-fill');
          const valueEl = wrapper.querySelector('.card__progress-value');
          const target = parseInt(wrapper.dataset.targetPercent, 10) || 0;

          if (!fill) return;

          // Update ARIA
          wrapper.setAttribute('aria-valuenow', String(target));
          wrapper.setAttribute('aria-label', `${wrapper.querySelector('.card__progress-text')?.textContent || 'Progress'}: ${target}%`);

          // Animate fill width and value text
          let current = 0;
          const step = Math.max(1, Math.floor(target / 60)); // ~60fps for ~1s

          function animateFrame() {
            current += step;
            if (current >= target) {
              current = target;
              fill.style.width = `${current}%`;
              if (valueEl) valueEl.textContent = `${current}%`;
              return;
            }
            fill.style.width = `${current}%`;
            if (valueEl) valueEl.textContent = `${current}%`;
            requestAnimationFrame(animateFrame);
          }

          requestAnimationFrame(animateFrame);

          // Stop observing after animation triggers
          observer.unobserve(wrapper);
        });
      },
      {
        threshold: 0.25,   // trigger when 25% of element is visible
        rootMargin: '0px 0px -40px 0px',  // small offset so it triggers a bit early
      }
    );

    progressWrappers.forEach((wrapper) => observer.observe(wrapper));
  } else {
    // Fallback: just set the width immediately
    progressWrappers.forEach((wrapper) => {
      const fill = wrapper.querySelector('.card__progress-fill');
      const valueEl = wrapper.querySelector('.card__progress-value');
      const target = parseInt(wrapper.dataset.targetPercent, 10) || 0;
      if (fill) fill.style.width = `${target}%`;
      if (valueEl) valueEl.textContent = `${target}%`;
    });
  }

  /* ------------------------------------------------------------------------
     6. Active nav link highlight — update on scroll for same-page anchors
     ------------------------------------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');
  if (sections.length) {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            const isHashMatch = href === `#${id}`;
            const isHomeMatch = href === '/' && id === 'hero-heading';

            link.classList.toggle('nav__link--active', isHashMatch || isHomeMatch);
            if (isHashMatch || isHomeMatch) {
              link.setAttribute('aria-current', 'page');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((section) => scrollObserver.observe(section));
  }

  /* ------------------------------------------------------------------------
     7. Keyboard support — allow Space/Enter on CTA buttons used as <a>
     ------------------------------------------------------------------------ */
  document.querySelectorAll('.btn[role="button"]').forEach((btn) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        btn.click();
      }
    });
  });

}); // end DOMContentLoaded