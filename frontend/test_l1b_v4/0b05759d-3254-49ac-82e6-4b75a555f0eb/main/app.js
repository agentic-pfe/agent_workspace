document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });

    // Smooth Scroll for Navigation Links
    const navLinkElements = document.querySelectorAll('.nav-link');
    navLinkElements.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu after navigation
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Accessibility: Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.focus();
        }
    });

    // Responsive Menu Management
    function handleResponsiveMenu() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    window.addEventListener('resize', handleResponsiveMenu);
});