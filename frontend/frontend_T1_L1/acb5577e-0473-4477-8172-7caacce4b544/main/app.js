document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for all anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Enhanced hover effects for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        const icon = card.querySelector('.feature-icon');
        const title = card.querySelector('.feature-title');

        card.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2)';
            icon.style.transition = 'transform 0.3s ease';
            title.style.color = 'var(--primary)';
        });

        card.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1)';
            title.style.color = 'inherit';
        });
    });

    // CTA Button Pulse Effect
    const ctaButtons = document.querySelectorAll('.hero-cta, .header-cta');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.animation = 'pulse 1s infinite';
        });

        button.addEventListener('mouseleave', () => {
            button.style.animation = 'none';
        });
    });

    // Optional: Add a global style for pulse animation
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(styleSheet);
});