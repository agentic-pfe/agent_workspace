document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuToggle.setAttribute('aria-expanded', 
        navLinks.classList.contains('active'));
    });
  }

  // Active Navigation State
  const currentPage = window.location.pathname.split('/').pop();
  const navItems = document.querySelectorAll('.nav-link');
  
  navItems.forEach(item => {
    if (item.getAttribute('href') === currentPage) {
      item.classList.add('active');
    }
  });

  // Form Submission Handling
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const formObject = Object.fromEntries(formData.entries());

      // Basic form validation
      const requiredFields = ['name', 'email', 'message'];
      const isValid = requiredFields.every(field => formObject[field] && formObject[field].trim() !== '');

      if (isValid) {
        // Simulated form submission
        console.log('Form submitted:', formObject);
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
      } else {
        alert('Please fill out all required fields.');
      }
    });
  }

  // Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});