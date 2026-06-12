document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
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

    // Testimonial Carousel
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    const testimonials = testimonialCarousel.querySelectorAll('blockquote');
    let currentTestimonialIndex = 0;

    // Hide all testimonials except the first
    testimonials.forEach((testimonial, index) => {
        testimonial.style.display = index === 0 ? 'block' : 'none';
    });

    // Create navigation buttons
    const carouselNav = document.createElement('div');
    carouselNav.classList.add('testimonial-nav');
    carouselNav.innerHTML = `
        <button class="prev-testimonial" aria-label="Previous Testimonial">❮</button>
        <button class="next-testimonial" aria-label="Next Testimonial">❯</button>
    `;
    testimonialCarousel.appendChild(carouselNav);

    const prevButton = carouselNav.querySelector('.prev-testimonial');
    const nextButton = carouselNav.querySelector('.next-testimonial');

    function showTestimonial(index) {
        // Hide current testimonial
        testimonials[currentTestimonialIndex].style.display = 'none';
        
        // Update index with wraparound
        currentTestimonialIndex = (index + testimonials.length) % testimonials.length;
        
        // Show new testimonial with fade effect
        testimonials[currentTestimonialIndex].style.display = 'block';
        testimonials[currentTestimonialIndex].style.animation = 'fadeIn 0.5s';
    }

    prevButton.addEventListener('click', () => showTestimonial(currentTestimonialIndex - 1));
    nextButton.addEventListener('click', () => showTestimonial(currentTestimonialIndex + 1));

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-links');

    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.setAttribute('aria-expanded', !isExpanded);
    });

    // Hover Effects for Feature Cards and CTAs
    const featureCards = document.querySelectorAll('.feature-card');
    const ctaButtons = document.querySelectorAll('.btn');

    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = 'var(--shadow-md)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow-sm)';
        });
    });

    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
            button.style.boxShadow = 'var(--shadow-lg)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'var(--shadow-md)';
        });
    });

    // Add custom fade-in animation
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(styleSheet);
});