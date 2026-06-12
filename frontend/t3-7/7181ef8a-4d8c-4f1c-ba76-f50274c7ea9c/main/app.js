document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuToggle = () => {
        const nav = document.querySelector('.nav');
        const header = document.querySelector('.header');
        const menuButton = document.createElement('button');
        
        menuButton.innerHTML = '☰';
        menuButton.classList.add('mobile-menu-toggle');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Toggle Navigation Menu');
        
        header.insertBefore(menuButton, nav);
        
        menuButton.addEventListener('click', () => {
            const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isOpen);
            nav.classList.toggle('nav-open');
            menuButton.innerHTML = isOpen ? '☰' : '✕';
        });
    };

    // Smooth Scrolling
    const smoothScroll = () => {
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
    };

    // Testimonial Carousel
    const testimonialCarousel = () => {
        const testimonials = document.querySelectorAll('.testimonial-card');
        let currentTestimonial = 0;

        const createCarouselControls = () => {
            const carouselContainer = document.querySelector('.testimonial-grid');
            const prevButton = document.createElement('button');
            const nextButton = document.createElement('button');

            prevButton.textContent = '←';
            nextButton.textContent = '→';
            prevButton.classList.add('carousel-btn', 'prev-btn');
            nextButton.classList.add('carousel-btn', 'next-btn');
            prevButton.setAttribute('aria-label', 'Previous Testimonial');
            nextButton.setAttribute('aria-label', 'Next Testimonial');

            carouselContainer.appendChild(prevButton);
            carouselContainer.appendChild(nextButton);

            prevButton.addEventListener('click', () => changeTestimonial(-1));
            nextButton.addEventListener('click', () => changeTestimonial(1));
        };

        const changeTestimonial = (direction) => {
            testimonials[currentTestimonial].classList.remove('active');
            currentTestimonial = (currentTestimonial + direction + testimonials.length) % testimonials.length;
            testimonials[currentTestimonial].classList.add('active');
        };

        createCarouselControls();
        testimonials[0].classList.add('active');
    };

    // Free Trial Form Validation
    const formValidation = () => {
        const signupForms = document.querySelectorAll('a[href="#signup"]');
        
        signupForms.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const modal = document.createElement('div');
                modal.classList.add('signup-modal');
                modal.innerHTML = `
                    <div class="modal-content">
                        <button class="modal-close" aria-label="Close">✕</button>
                        <h2>Start Your Free Trial</h2>
                        <form id="signup-form">
                            <label for="email">Work Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="you@company.com" 
                                required 
                                aria-required="true"
                            >
                            <button type="submit" class="btn btn-primary">Begin Free Trial</button>
                        </form>
                    </div>
                `;

                document.body.appendChild(modal);

                const form = modal.querySelector('#signup-form');
                const emailInput = modal.querySelector('#email');
                const closeButton = modal.querySelector('.modal-close');

                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    
                    if (emailRegex.test(emailInput.value)) {
                        alert('Thank you! We will contact you shortly.');
                        modal.remove();
                    } else {
                        emailInput.setCustomValidity('Please enter a valid email address');
                        emailInput.reportValidity();
                    }
                });

                closeButton.addEventListener('click', () => modal.remove());

                // Trap focus within modal
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                modal.addEventListener('keydown', (e) => {
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

                firstElement.focus();
            });
        });
    };

    // Initialize all functions
    mobileMenuToggle();
    smoothScroll();
    testimonialCarousel();
    formValidation();
});