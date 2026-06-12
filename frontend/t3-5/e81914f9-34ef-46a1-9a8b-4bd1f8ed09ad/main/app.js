document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navList = document.querySelector('.nav-list');

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      navList.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', navList.classList.contains('active'));
    });
  }

  // Testimonial Carousel
  const testimonials = document.querySelectorAll('.testimonial');
  const prevButton = document.querySelector('.testimonial-prev');
  const nextButton = document.querySelector('.testimonial-next');
  let currentTestimonial = 0;

  if (testimonials.length > 0 && prevButton && nextButton) {
    const showTestimonial = (index) => {
      testimonials.forEach(testimonial => testimonial.classList.remove('active'));
      testimonials[index].classList.add('active');
    };

    prevButton.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
      showTestimonial(currentTestimonial);
    });

    nextButton.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      showTestimonial(currentTestimonial);
    });
  }

  // Sticky Header with Scroll Opacity
  const header = document.querySelector('.header');

  if (header) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      const opacity = Math.min(scrollPosition / 100, 0.95);
      header.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
    });
  }

  // Smooth Scroll for Anchor Links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
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
});