document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuToggle.setAttribute('aria-expanded', 
        navLinks.classList.contains('active')
      );
    });
  }

  // Smooth Scroll for Anchor Links
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach(link => {
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

  // Form Validation (if contact form exists)
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const requiredFields = contactForm.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          field.setAttribute('aria-invalid', 'true');
        } else {
          field.classList.remove('error');
          field.setAttribute('aria-invalid', 'false');
        }
      });

      if (!isValid) {
        e.preventDefault();
        const errorMessage = document.querySelector('.form-error');
        if (errorMessage) {
          errorMessage.textContent = 'Please fill out all required fields.';
          errorMessage.style.display = 'block';
        }
      }
    });
  }

  // Portfolio/Work Page Filtering (if exists)
  const portfolioFilter = document.querySelector('.portfolio-filter');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (portfolioFilter && portfolioItems.length) {
    portfolioFilter.addEventListener('change', (e) => {
      const selectedCategory = e.target.value;

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (selectedCategory === 'all' || itemCategory === selectedCategory) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
});