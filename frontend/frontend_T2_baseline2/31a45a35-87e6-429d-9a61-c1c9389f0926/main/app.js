document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form Validation (Placeholder for future implementation)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add form validation logic here
            console.log('Form submission prevented');
        });
    });

    // Testimonial Carousel (Basic Implementation)
    const testimonialGrid = document.querySelector('.testimonial-grid');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;

    function rotateTestimonials() {
        testimonialCards.forEach(card => card.style.display = 'none');
        testimonialCards[currentTestimonial].style.display = 'block';
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    }

    // Only rotate if more than one testimonial
    if (testimonialCards.length > 1) {
        rotateTestimonials(); // Initial display
        setInterval(rotateTestimonials, 5000); // Rotate every 5 seconds
    }
});