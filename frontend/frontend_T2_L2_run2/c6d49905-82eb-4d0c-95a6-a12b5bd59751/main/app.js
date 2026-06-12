// Modern Tech Landing Page - Interactive Behaviors
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
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

  // Smooth Scrolling for Internal Links
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

  // Header Background on Scroll
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Basic Form Validation
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const emailInput = contactForm.querySelector('input[type="email"]');
      const nameInput = contactForm.querySelector('input[type="text"]');
      
      let isValid = true;

      // Email validation
      if (emailInput && !emailInput.value.includes('@')) {
        emailInput.setCustomValidity('Please enter a valid email address');
        isValid = false;
      } else if (emailInput) {
        emailInput.setCustomValidity('');
      }

      // Name validation
      if (nameInput && nameInput.value.trim().length < 2) {
        nameInput.setCustomValidity('Name must be at least 2 characters long');
        isValid = false;
      } else if (nameInput) {
        nameInput.setCustomValidity('');
      }

      if (!isValid) {
        e.preventDefault();
        contactForm.reportValidity();
      }
    });
  }

  // Keyboard Accessibility Enhancements
  document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      mobileMenuToggle?.setAttribute('aria-expanded', 'false');
      mobileMenuToggle?.focus();
    }
  });

  // Prefers Reduced Motion Check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.classList.toggle('reduced-motion', prefersReducedMotion.matches);
});