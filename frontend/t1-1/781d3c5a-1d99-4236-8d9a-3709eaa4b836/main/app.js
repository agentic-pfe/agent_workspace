document.addEventListener('DOMContentLoaded', () => {
    // Testimonial Carousel
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    const testimonials = testimonialCarousel.querySelectorAll('blockquote');
    let currentTestimonialIndex = 0;

    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        testimonials[index].classList.add('active');
    }

    // Add carousel navigation buttons
    const prevButton = document.createElement('button');
    prevButton.textContent = '←';
    prevButton.classList.add('carousel-prev');
    prevButton.setAttribute('aria-label', 'Previous Testimonial');

    const nextButton = document.createElement('button');
    nextButton.textContent = '→';
    nextButton.classList.add('carousel-next');
    nextButton.setAttribute('aria-label', 'Next Testimonial');

    testimonialCarousel.appendChild(prevButton);
    testimonialCarousel.appendChild(nextButton);

    prevButton.addEventListener('click', () => {
        currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonialIndex);
    });

    nextButton.addEventListener('click', () => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
        showTestimonial(currentTestimonialIndex);
    });

    // Initial display
    showTestimonial(0);

    // Cart Management
    const cartCounter = document.createElement('div');
    cartCounter.id = 'cart-counter';
    cartCounter.textContent = '0';
    cartCounter.classList.add('cart-badge');
    document.querySelector('.site-header .container').appendChild(cartCounter);

    let cartItems = 0;

    document.querySelectorAll('.add-to-cart').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const quantityInput = form.querySelector('input[type="number"]');
            const quantity = parseInt(quantityInput.value, 10);
            
            cartItems += quantity;
            cartCounter.textContent = cartItems;
            cartCounter.classList.add('active');

            // Optional: Temporary visual feedback
            form.querySelector('button').textContent = 'Added!';
            setTimeout(() => {
                form.querySelector('button').textContent = 'Add to Cart';
            }, 1500);
        });
    });

    // Form Validation
    document.querySelectorAll('.subscription-form, .add-to-cart').forEach(form => {
        form.addEventListener('submit', (e) => {
            const inputs = form.querySelectorAll('input, select');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.classList.add('invalid');
                    isValid = false;
                } else {
                    input.classList.remove('invalid');
                }
            });

            if (!isValid) {
                e.preventDefault();
                const errorMessage = document.createElement('div');
                errorMessage.textContent = 'Please check your input and try again.';
                errorMessage.classList.add('form-error');
                form.appendChild(errorMessage);
                setTimeout(() => errorMessage.remove(), 3000);
            }
        });
    });

    // Smooth Scrolling for Navigation Links
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

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });
});