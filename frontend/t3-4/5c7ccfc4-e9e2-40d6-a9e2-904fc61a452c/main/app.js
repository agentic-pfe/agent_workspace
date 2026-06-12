document.addEventListener('DOMContentLoaded', () => {
  // Testimonial Carousel
  const testimonialCarousel = () => {
    const testimonials = document.querySelectorAll('[data-testimonial]');
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    
    if (!testimonials.length || !prevBtn || !nextBtn) return;

    let currentIndex = 0;

    const showTestimonial = (index) => {
      // Hide all testimonials
      testimonials.forEach(testimonial => {
        testimonial.setAttribute('aria-hidden', 'true');
        testimonial.classList.remove('active');
      });

      // Show current testimonial
      const activeTestimonial = testimonials[index];
      activeTestimonial.setAttribute('aria-hidden', 'false');
      activeTestimonial.classList.add('active');
    };

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      showTestimonial(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(currentIndex);
    });

    // Initialize first testimonial
    showTestimonial(currentIndex);
  };

  // Mobile Menu Toggle
  const mobileMenuToggle = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-visible');
    });
  };

  // Smooth Scroll
  const smoothScroll = () => {
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
  };

  // Form Validation
  const formValidation = () => {
    const trialForm = document.getElementById('trial-form');
    
    if (!trialForm) return;

    trialForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const emailInput = trialForm.querySelector('input[type="email"]');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailInput || !emailRegex.test(emailInput.value)) {
        emailInput.setAttribute('aria-invalid', 'true');
        emailInput.focus();
        return;
      }
      
      // Clear any previous invalid state
      emailInput.removeAttribute('aria-invalid');
      
      // Simulate trial start
      alert('Trial started! Check your email for next steps.');
      trialForm.reset();
    });
  };

  // Initialize all interactions
  testimonialCarousel();
  mobileMenuToggle();
  smoothScroll();
  formValidation();
});