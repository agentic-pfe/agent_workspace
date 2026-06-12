document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Mobile Menu Toggle
    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });

    // Keyboard Navigation for Mobile Menu
    mobileMenuToggle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            mobileMenuToggle.click();
        }
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Focus Management for Skip Link
    const skipLink = document.querySelector('.skip-link');
    skipLink.addEventListener('focus', () => {
        skipLink.classList.add('focused');
    });

    skipLink.addEventListener('blur', () => {
        skipLink.classList.remove('focused');
    });

    // Keyboard Trap for Mobile Menu (when active)
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        });
    }

    // Apply focus trap when mobile menu is active
    if (window.innerWidth <= 768) {
        trapFocus(navMenu);
    }
});