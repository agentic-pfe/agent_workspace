document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuToggle = () => {
        const nav = document.querySelector('.nav');
        const menuButton = document.createElement('button');
        menuButton.classList.add('mobile-menu-toggle');
        menuButton.setAttribute('aria-label', 'Toggle Mobile Menu');
        menuButton.innerHTML = '☰';

        // Only add mobile menu toggle on smaller screens
        if (window.innerWidth < 768) {
            if (!document.querySelector('.mobile-menu-toggle')) {
                document.querySelector('.header-container').insertBefore(menuButton, nav);
                
                menuButton.addEventListener('click', () => {
                    nav.classList.toggle('nav-open');
                    menuButton.classList.toggle('menu-active');
                    menuButton.setAttribute('aria-expanded', nav.classList.contains('nav-open'));
                });
            }
        } else {
            const existingToggle = document.querySelector('.mobile-menu-toggle');
            if (existingToggle) {
                existingToggle.remove();
                nav.classList.remove('nav-open');
            }
        }
    };

    // Initial mobile menu setup
    mobileMenuToggle();
    window.addEventListener('resize', mobileMenuToggle);

    // Smooth Scrolling
    const smoothScroll = (target) => {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    };

    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScroll(this.getAttribute('href'));
        });
    });

    // Active Section Highlighting
    const highlightNavLinks = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav a');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.scrollY;

            if (
                scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight
            ) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${section.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNavLinks);

    // Pricing Plan Interaction
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        const priceElement = card.querySelector('.price');
        const ctaButton = card.querySelector('.cta-button');

        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active state from all cards
            pricingCards.forEach(c => c.classList.remove('selected'));
            
            // Add active state to clicked card
            card.classList.add('selected');

            // Optional: Trigger download/signup modal or redirect
            console.log(`Selected plan: ${card.querySelector('h3').textContent}`);
        });
    });

    // Accessibility: Keyboard Navigation for Pricing Cards
    pricingCards.forEach(card => {
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const ctaButton = card.querySelector('.cta-button');
                ctaButton.click();
            }
        });
        card.setAttribute('tabindex', '0');
    });
});