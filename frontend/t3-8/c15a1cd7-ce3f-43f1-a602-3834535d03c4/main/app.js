document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const navToggle = document.querySelector('.header-container');
    const navMenu = document.querySelector('.nav');
    let isMobileMenuOpen = false;

    const toggleMobileMenu = () => {
        isMobileMenuOpen = !isMobileMenuOpen;
        navMenu.classList.toggle('mobile-menu-open', isMobileMenuOpen);
        navToggle.setAttribute('aria-expanded', isMobileMenuOpen);
    };

    // Only add mobile menu toggle on smaller screens
    if (window.innerWidth <= 768) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Testimonial Carousel
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    const testimonials = testimonialCarousel.querySelectorAll('blockquote');
    let currentTestimonialIndex = 0;

    const showTestimonial = (index) => {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    };

    const createCarouselControls = () => {
        const controlsContainer = document.createElement('div');
        controlsContainer.classList.add('carousel-controls');
        
        const prevButton = document.createElement('button');
        prevButton.textContent = '←';
        prevButton.setAttribute('aria-label', 'Previous Testimonial');
        
        const nextButton = document.createElement('button');
        nextButton.textContent = '→';
        nextButton.setAttribute('aria-label', 'Next Testimonial');
        
        prevButton.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentTestimonialIndex);
        });
        
        nextButton.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
            showTestimonial(currentTestimonialIndex);
        });
        
        controlsContainer.appendChild(prevButton);
        controlsContainer.appendChild(nextButton);
        testimonialCarousel.appendChild(controlsContainer);
        
        // Initially hide all but first testimonial
        showTestimonial(0);
    };

    // Only add carousel controls if multiple testimonials exist
    if (testimonials.length > 1) {
        createCarouselControls();
    }

    // Smooth Scrolling for Navigation Links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
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

    // Free Trial CTA Form Validation
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const emailModal = createEmailModal();
            document.body.appendChild(emailModal);
        });
    });

    const createEmailModal = () => {
        const modal = document.createElement('div');
        modal.classList.add('email-modal');
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Start Your Free 14-Day Trial</h2>
                <form id="trial-form">
                    <label for="email">Work Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="you@company.com" 
                        required 
                        aria-required="true"
                    >
                    <button type="submit">Begin Trial</button>
                    <button type="button" class="modal-close" aria-label="Close">×</button>
                </form>
            </div>
        `;

        const form = modal.querySelector('#trial-form');
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

        return modal;
    };
});