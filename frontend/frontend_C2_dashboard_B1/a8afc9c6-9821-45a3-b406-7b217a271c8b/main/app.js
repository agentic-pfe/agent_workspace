/**
 * DashFlow – Analytics Dashboard
 * app.js — Vanilla JavaScript for all interactive behavior
 * No external libraries. ES6+.
 */
(function () {
  'use strict';

  /* ============================================================
     1. KPI NUMBER ANIMATION
     Animate each KPI card's value from 0 to its target
     Uses requestAnimationFrame for smooth 60fps animation
     ============================================================ */
  function animateKpiNumbers() {
    const kpiCards = document.querySelectorAll('.kpi-card');
    const duration = 2000; // 2 seconds

    kpiCards.forEach((card) => {
      const target = parseFloat(card.getAttribute('data-target'));
      const prefix = card.getAttribute('data-prefix') || '';
      const suffix = card.getAttribute('data-suffix') || '';
      const valueEl = card.querySelector('.kpi-card-value');

      if (!valueEl || isNaN(target)) return;

      const startTime = performance.now();

      function formatValue(val, isFloat) {
        if (isFloat) {
          // For bounce rate: one decimal place
          return val.toFixed(1);
        }
        // For integers: add commas
        return Math.floor(val).toLocaleString('en-US');
      }

      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic for natural deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;

        const isFloat = suffix === '%' || target % 1 !== 0;
        valueEl.textContent = prefix + formatValue(current, isFloat) + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // Ensure final value is exact
          const isFloatFinal = suffix === '%';
          valueEl.textContent = prefix + formatValue(target, isFloatFinal) + suffix;
        }
      }

      requestAnimationFrame(step);
    });
  }

  /* ============================================================
     2. BAR CHART ANIMATION + HOVER TOOLTIP
     Bars grow from height 0 to target proportional to max (9.1k)
     Tooltip on hover shows exact value
     ============================================================ */
  function animateBarChart() {
    const bars = document.querySelectorAll('.bar-chart-bar');
    const maxValue = 9100; // June value is max
    const chartMaxHeight = 230; // from y=250 (bottom) to y=20 (top)
    const bottomY = 250;
    const tooltip = document.getElementById('bar-tooltip');
    const container = document.getElementById('bar-chart-container');

    if (!bars.length || !tooltip || !container) return;

    // Animate bars
    bars.forEach((bar, index) => {
      const value = parseFloat(bar.getAttribute('data-value'));
      const targetHeight = (value / maxValue) * chartMaxHeight;
      const targetY = bottomY - targetHeight;
      const duration = 1000;
      const delay = index * 120; // stagger
      const startTime = performance.now() + delay;

      function step(currentTime) {
        if (currentTime < startTime) {
          requestAnimationFrame(step);
          return;
        }
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentHeight = targetHeight * eased;
        const currentY = bottomY - currentHeight;

        bar.setAttribute('height', currentHeight);
        bar.setAttribute('y', currentY);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          bar.setAttribute('height', targetHeight);
          bar.setAttribute('y', targetY);
        }
      }

      requestAnimationFrame(step);
    });

    // Tooltip on hover
    bars.forEach((bar) => {
      bar.addEventListener('mouseenter', function (e) {
        const label = bar.getAttribute('data-label');
        tooltip.textContent = label;
        tooltip.removeAttribute('hidden');
        positionTooltip(e);
      });

      bar.addEventListener('mousemove', function (e) {
        positionTooltip(e);
      });

      bar.addEventListener('mouseleave', function () {
        tooltip.setAttribute('hidden', '');
      });
    });

    function positionTooltip(e) {
      const containerRect = container.getBoundingClientRect();
      const x = e.clientX - containerRect.left + 12;
      const y = e.clientY - containerRect.top - 30;
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    }
  }

  /* ============================================================
     3. DONUT CHART ANIMATION
     Animate stroke-dasharray of each segment from 0 to target %
     Segments are drawn on top of each other; offsets managed
     ============================================================ */
  function animateDonutChart() {
    const segments = document.querySelectorAll('.donut-segment');
    if (!segments.length) return;

    // Circumference for r=70: C = 2 * π * 70 ≈ 439.82
    const circumference = 2 * Math.PI * 70;
    const duration = 1200;

    // Percentages in order: Organic(42), Direct(28), Referral(18), Social(12)
    const percentages = [42, 28, 18, 12];

    // Calculate cumulative offsets so segments don't overlap
    // The first segment starts at 0 offset
    let cumulativePct = 0;
    const offsets = percentages.map((pct) => {
      const offset = cumulativePct;
      cumulativePct += pct;
      return (offset / 100) * circumference;
    });

    segments.forEach((segment, index) => {
      const pct = percentages[index];
      const targetDash = (pct / 100) * circumference;
      const targetOffset = -offsets[index];
      const startTime = performance.now() + index * 150;

      function step(currentTime) {
        if (currentTime < startTime) {
          requestAnimationFrame(step);
          return;
        }
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentDash = targetDash * eased;

        segment.setAttribute('stroke-dasharray', currentDash + ' ' + circumference);
        segment.setAttribute('stroke-dashoffset', targetOffset);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          segment.setAttribute('stroke-dasharray', targetDash + ' ' + circumference);
          segment.setAttribute('stroke-dashoffset', targetOffset);
        }
      }

      requestAnimationFrame(step);
    });
  }

  /* ============================================================
     4. TABLE SEARCH FILTER
     Filter table rows in real-time based on search input
     Matches against name, email, and role fields
     ============================================================ */
  function initTableSearch() {
    const searchInput = document.getElementById('users-search');
    const tableBody = document.getElementById('users-table-body');

    if (!searchInput || !tableBody) return;

    searchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      const rows = tableBody.querySelectorAll('.users-table-row');

      rows.forEach((row) => {
        // Gather text from name, email, role cells
        const name = (row.querySelector('.users-table-name')?.textContent || '').toLowerCase();
        const email = (row.querySelector('.users-table-email')?.textContent || '').toLowerCase();
        const role = (row.querySelector('.users-table-role')?.textContent || '').toLowerCase();

        const searchText = name + ' ' + email + ' ' + role;

        if (query === '' || searchText.includes(query)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  /* ============================================================
     5. NOTIFICATION BELL TOGGLE
     Click bell → show/hide dropdown
     Click outside → close dropdown
     ============================================================ */
  function initNotificationBell() {
    const bell = document.getElementById('notification-bell');
    const dropdown = document.getElementById('notification-dropdown');

    if (!bell || !dropdown) return;

    bell.addEventListener('click', function (e) {
      e.stopPropagation();
      const isHidden = dropdown.hasAttribute('hidden');
      if (isHidden) {
        dropdown.removeAttribute('hidden');
        bell.setAttribute('aria-expanded', 'true');
      } else {
        dropdown.setAttribute('hidden', '');
        bell.setAttribute('aria-expanded', 'false');
      }
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!dropdown.hasAttribute('hidden')) {
        const wrapper = document.getElementById('notification-wrapper');
        if (wrapper && !wrapper.contains(e.target)) {
          dropdown.setAttribute('hidden', '');
          bell.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !dropdown.hasAttribute('hidden')) {
        dropdown.setAttribute('hidden', '');
        bell.setAttribute('aria-expanded', 'false');
        bell.focus();
      }
    });
  }

  /* ============================================================
     6. SIDEBAR NAVIGATION ACTIVE HIGHLIGHT
     Click a nav link → add 'active' class, remove from siblings
     Default: Dashboard is active on load
     ============================================================ */
  function initSidebarNav() {
    const navLinks = document.querySelectorAll('.sidebar-nav-link');

    navLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        // Remove active from all links
        navLinks.forEach((l) => {
          l.classList.remove('active');
          l.removeAttribute('aria-current');
        });

        // Add active to clicked link
        this.classList.add('active');
        this.setAttribute('aria-current', 'page');
      });
    });
  }

  /* ============================================================
     7. (BONUS) MOBILE SIDEBAR TOGGLE
     Adds a hamburger button that appears on mobile
     toggles the sidebar open/closed
     ============================================================ */
  function initMobileSidebar() {
    // Only add hamburger on mobile – create button dynamically
    const topBar = document.querySelector('.top-bar');
    const sidebar = document.getElementById('sidebar');
    if (!topBar || !sidebar) return;

    const hamburger = document.createElement('button');
    hamburger.className = 'mobile-menu-toggle';
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<span class="hamburger-icon">☰</span>';
    hamburger.style.cssText = `
      display: none;
      background: none;
      border: none;
      color: var(--text-primary);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
    `;

    // Insert as first child of top-bar
    topBar.insertBefore(hamburger, topBar.firstChild);

    // Show hamburger on mobile via a style element
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 767px) {
        .mobile-menu-toggle { display: flex !important; align-items: center; justify-content: center; }
        .mobile-menu-toggle:hover { background-color: #1e293b; }
      }
    `;
    document.head.appendChild(style);

    hamburger.addEventListener('click', function () {
      const isOpen = sidebar.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburger.querySelector('.hamburger-icon').textContent = isOpen ? '✕' : '☰';
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function (e) {
      if (sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && e.target !== hamburger && !hamburger.contains(e.target)) {
          sidebar.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.querySelector('.hamburger-icon').textContent = '☰';
        }
      }
    });
  }

  /* ============================================================
     INITIALIZATION
     Run everything on DOMContentLoaded
     ============================================================ */
  function init() {
    animateKpiNumbers();
    animateBarChart();
    animateDonutChart();
    initTableSearch();
    initNotificationBell();
    initSidebarNav();
    initMobileSidebar();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
