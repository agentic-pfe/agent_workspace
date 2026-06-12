document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const navbar = document.querySelector('.navbar');
    const navLinks = navbar.querySelector('.nav-links');
    const mobileMenuToggle = document.createElement('button');
    
    // Create mobile menu toggle button
    mobileMenuToggle.innerHTML = '☰';
    mobileMenuToggle.classList.add('mobile-menu-toggle');
    mobileMenuToggle.setAttribute('aria-label', 'Toggle mobile menu');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    
    // Insert mobile menu toggle before nav links
    navbar.querySelector('nav').insertBefore(mobileMenuToggle, navLinks);
    
    // Mobile menu toggle event listener
    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        navLinks.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        mobileMenuToggle.innerHTML = isExpanded ? '☰' : '✕';
    });

    // Testimonial Carousel
    const testimonialGrid = document.querySelector('.testimonial-grid');
    const testimonials = testimonialGrid.querySelectorAll('.testimonial');
    let currentTestimonialIndex = 0;

    // Create navigation buttons
    const prevButton = document.createElement('button');
    const nextButton = document.createElement('button');
    
    prevButton.innerHTML = '←';
    nextButton.innerHTML = '→';
    
    prevButton.classList.add('testimonial-nav', 'prev');
    nextButton.classList.add('testimonial-nav', 'next');
    
    prevButton.setAttribute('aria-label', 'Previous testimonial');
    nextButton.setAttribute('aria-label', 'Next testimonial');
    
    testimonialGrid.appendChild(prevButton);
    testimonialGrid.appendChild(nextButton);

    // Testimonial navigation logic
    function showTestimonial(index) {
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        testimonials[index].classList.add('active');
    }

    prevButton.addEventListener('click', () => {
        currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonialIndex);
    });

    nextButton.addEventListener('click', () => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
        showTestimonial(currentTestimonialIndex);
    });

    // Initial state
    showTestimonial(currentTestimonialIndex);

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
});