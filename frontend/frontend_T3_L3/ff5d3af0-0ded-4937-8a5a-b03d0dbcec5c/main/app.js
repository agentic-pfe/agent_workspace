document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuToggle.setAttribute('aria-expanded', 
        navLinks.classList.contains('active'));
    });
  }

  // Form Validation (if contact form exists)
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const nameInput = document.querySelector('#name');
      const emailInput = document.querySelector('#email');
      const messageInput = document.querySelector('#message');
      let isValid = true;

      // Basic validation
      if (!nameInput.value.trim()) {
        isValid = false;
        nameInput.classList.add('error');
      } else {
        nameInput.classList.remove('error');
      }

      if (!emailInput.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        isValid = false;
        emailInput.classList.add('error');
      } else {
        emailInput.classList.remove('error');
      }

      if (!messageInput.value.trim()) {
        isValid = false;
        messageInput.classList.add('error');
      } else {
        messageInput.classList.remove('error');
      }

      if (!isValid) {
        e.preventDefault();
        alert('Please fill out all fields correctly.');
      }
    });
  }

  // Smooth Scrolling for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});