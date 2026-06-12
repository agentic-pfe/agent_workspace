document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Testimonial carousel
    const testimonials = [
        {
            quote: "FlowSync has been a game-changer for our distributed engineering team. We've increased productivity by 40% and reduced communication overhead significantly.",
            name: "Sarah Chen",
            title: "CTO, TechInnovate Solutions"
        },
        {
            quote: "The AI-powered task prioritization is incredible. It's like having a virtual project manager that understands our team's dynamics.",
            name: "Michael Rodriguez",
            title: "Head of Product, InnovateNow"
        },
        {
            quote: "Communication has never been smoother. FlowSync helps our global team stay connected and aligned effortlessly.",
            name: "Emma Thompson",
            title: "Operations Director, GlobalWork"
        }
    ];

    const testimonialBlock = document.querySelector('.testimonial');
    let currentTestimonialIndex = 0;

    function updateTestimonial() {
        const currentTestimonial = testimonials[currentTestimonialIndex];
        testimonialBlock.querySelector('p').textContent = currentTestimonial.quote;
        testimonialBlock.querySelector('cite').textContent = currentTestimonial.name;
        testimonialBlock.querySelector('.title').textContent = currentTestimonial.title;
    }

    // Optional: Add navigation buttons if you want to manually cycle testimonials
    const nextTestimonialBtn = document.createElement('button');
    nextTestimonialBtn.textContent = 'Next Testimonial';
    nextTestimonialBtn.addEventListener('click', () => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
        updateTestimonial();
    });

    testimonialBlock.appendChild(nextTestimonialBtn);
});