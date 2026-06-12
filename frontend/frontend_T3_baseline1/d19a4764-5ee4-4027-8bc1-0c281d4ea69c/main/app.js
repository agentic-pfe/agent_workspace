document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });
  }

  // Smooth Scrolling for Anchor Links
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

  // Contact Form Validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      // Basic validation
      const isNameValid = nameInput.value.trim().length > 0;
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
      const isMessageValid = messageInput.value.trim().length > 10;
      
      if (isNameValid && isEmailValid && isMessageValid) {
        // In a real app, you'd send this to a backend
        alert('Message sent successfully! We will get back to you soon.');
        contactForm.reset();
      } else {
        let errorMessage = 'Please correct the following:\n';
        if (!isNameValid) errorMessage += '- Name is required\n';
        if (!isEmailValid) errorMessage += '- Enter a valid email\n';
        if (!isMessageValid) errorMessage += '- Message must be at least 10 characters\n';
        
        alert(errorMessage);
      }
    });
  }

  // Project Filter (Work Page)
  const projectFilterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (projectFilterBtns.length && projectCards.length) {
    projectFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        
        // Update active filter button
        projectFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          
          if (filter === 'all' || cardCategory === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});