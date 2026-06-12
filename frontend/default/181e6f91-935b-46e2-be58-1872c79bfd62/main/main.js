document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });
    }

    // Testimonial Carousel Navigation
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    
    if (testimonialCarousel) {
        const testimonials = testimonialCarousel.querySelectorAll('blockquote');
        let currentTestimonialIndex = 0;

        // Create navigation buttons
        const prevButton = document.createElement('button');
        prevButton.textContent = '←';
        prevButton.classList.add('carousel-nav', 'carousel-prev');
        prevButton.setAttribute('aria-label', 'Previous Testimonial');

        const nextButton = document.createElement('button');
        nextButton.textContent = '→';
        nextButton.classList.add('carousel-nav', 'carousel-next');
        nextButton.setAttribute('aria-label', 'Next Testimonial');

        testimonialCarousel.appendChild(prevButton);
        testimonialCarousel.appendChild(nextButton);

        // Hide all testimonials except the first
        testimonials.forEach((testimonial, index) => {
            testimonial.style.display = index === 0 ? 'block' : 'none';
        });

        // Navigation logic
        prevButton.addEventListener('click', () => {
            testimonials[currentTestimonialIndex].style.display = 'none';
            currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
            testimonials[currentTestimonialIndex].style.display = 'block';
        });

        nextButton.addEventListener('click', () => {
            testimonials[currentTestimonialIndex].style.display = 'none';
            currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
            testimonials[currentTestimonialIndex].style.display = 'block';
        });
    }

    // Smooth Scrolling for Anchor Links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
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
});