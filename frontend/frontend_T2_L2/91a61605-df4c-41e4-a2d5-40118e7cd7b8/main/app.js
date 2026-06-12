document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuToggle.setAttribute('aria-expanded', 
        navLinks.classList.contains('active').toString()
      );
    });

    // Close mobile menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

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

  // Testimonial Carousel
  const testimonialCarousel = document.querySelector('.testimonials-carousel');
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');

  if (testimonialCarousel && testimonialSlides.length > 0) {
    let currentSlide = 0;
    const totalSlides = testimonialSlides.length;

    function showSlide(index) {
      // Hide all slides
      testimonialSlides.forEach(slide => {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      });

      // Show current slide
      testimonialSlides[index].classList.add('active');
      testimonialSlides[index].setAttribute('aria-hidden', 'false');
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
    }

    // Initial slide
    showSlide(0);

    // Optional: Auto-rotate slides every 5 seconds
    const carouselInterval = setInterval(nextSlide, 5000);

    // Optional: Pause auto-rotate on hover
    testimonialCarousel.addEventListener('mouseenter', () => {
      clearInterval(carouselInterval);
    });

    testimonialCarousel.addEventListener('mouseleave', () => {
      carouselInterval = setInterval(nextSlide, 5000);
    });
  }

  // Basic Form Validation (if contact form exists)
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      let isValid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('error');
          isValid = false;
        } else {
          field.classList.remove('error');
        }
      });

      // Email validation
      const emailField = contactForm.querySelector('input[type="email"]');
      if (emailField) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          emailField.classList.add('error');
          isValid = false;
        }
      }

      if (!isValid) {
        e.preventDefault();
        const errorMessage = document.querySelector('.form-error-message');
        if (errorMessage) {
          errorMessage.textContent = 'Please fill out all required fields correctly.';
        }
      }
    });
  }
});