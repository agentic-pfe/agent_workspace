document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const testimonials = document.querySelectorAll('.testimonial');

    // Mobile Menu Toggle
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });

    // Testimonial Carousel (Simple Auto-Rotate)
    let currentTestimonial = 0;
    function rotateTestimonials() {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }

    if (testimonials.length > 1) {
        testimonials[0].classList.add('active');
        setInterval(rotateTestimonials, 5000);
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Pricing Tier Hover Effects
    const pricingTiers = document.querySelectorAll('.pricing-tier');
    pricingTiers.forEach(tier => {
        tier.addEventListener('mouseenter', () => {
            pricingTiers.forEach(t => t.classList.remove('hover'));
            tier.classList.add('hover');
        });

        tier.addEventListener('mouseleave', () => {
            tier.classList.remove('hover');
        });
    });
});