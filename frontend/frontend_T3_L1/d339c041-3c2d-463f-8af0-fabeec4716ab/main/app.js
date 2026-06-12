// Forma Studio - Interactive JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // Smooth Scrolling for Internal Links
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"], a[href^="./#"]');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    });
  });

  // Active Navigation Item Highlighting
  const currentPage = window.location.pathname.split('/').pop();
  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage) {
      item.setAttribute('aria-current', 'page');
    }
  });

  // Contact Form Validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let isValid = true;

      // Reset previous error states
      [name, email, message].forEach(field => {
        field.classList.remove('error');
      });

      // Name validation
      if (!name.value.trim()) {
        name.classList.add('error');
        isValid = false;
      }

      // Email validation
      if (!emailRegex.test(email.value)) {
        email.classList.add('error');
        isValid = false;
      }

      // Message validation
      if (!message.value.trim()) {
        message.classList.add('error');
        isValid = false;
      }

      if (isValid) {
        // Simulated form submission
        const successMessage = document.createElement('div');
        successMessage.classList.add('form-success');
        successMessage.textContent = 'Thank you! We will review your project and get back to you soon.';
        contactForm.appendChild(successMessage);
        contactForm.reset();

        // Remove success message after 5 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }
    });
  }

  // Close mobile menu when clicking outside or on nav links
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active')) {
      const isClickInsideNav = navLinks.contains(e.target);
      const isMenuToggle = mobileMenuToggle.contains(e.target);
      
      if (!isClickInsideNav && !isMenuToggle) {
        navLinks.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});