document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu after navigation
                if (navMenu && navMenu.classList.contains('active')) {
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Optional: Hover Effects for Pricing and Feature Cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    const featureCards = document.querySelectorAll('.feature-card');

    const addCardHoverEffects = (cards) => {
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('card-hover');
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('card-hover');
            });
        });
    };

    addCardHoverEffects(pricingCards);
    addCardHoverEffects(featureCards);
});