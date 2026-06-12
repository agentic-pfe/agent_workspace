document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Smooth Scrolling for Anchor Links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Testimonial Slider Controls
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonialIndex = 0;

    // If we have multiple testimonials, add navigation
    if (testimonials.length > 1) {
        const testimonialContainer = document.querySelector('.testimonials-grid');
        
        // Create navigation buttons
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.classList.add('testimonial-nav', 'testimonial-prev');
        
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.classList.add('testimonial-nav', 'testimonial-next');
        
        testimonialContainer.appendChild(prevButton);
        testimonialContainer.appendChild(nextButton);

        // Hide all but the first testimonial
        testimonials.forEach((testimonial, index) => {
            testimonial.style.display = index === 0 ? 'block' : 'none';
        });

        // Previous button handler
        prevButton.addEventListener('click', () => {
            testimonials[currentTestimonialIndex].style.display = 'none';
            currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
            testimonials[currentTestimonialIndex].style.display = 'block';
        });

        // Next button handler
        nextButton.addEventListener('click', () => {
            testimonials[currentTestimonialIndex].style.display = 'none';
            currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
            testimonials[currentTestimonialIndex].style.display = 'block';
        });
    }

    // Pricing Tier Highlight and CTA Signup
    const pricingTiers = document.querySelectorAll('.pricing-tier');
    const proTier = document.querySelector('.pricing-tier--featured');

    // Highlight Pro tier on load
    if (proTier) {
        proTier.classList.add('highlighted');
    }

    // CTA Button Signup Simulation
    const ctaButtons = document.querySelectorAll('.pricing-tier .cta-primary, .pricing-tier .cta-secondary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const tierName = button.closest('.pricing-tier').querySelector('h3').textContent;
            alert(`Thank you for your interest in the ${tierName} plan! Our sales team will contact you shortly.`);
        });
    });
});