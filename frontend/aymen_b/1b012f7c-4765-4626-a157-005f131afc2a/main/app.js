document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });

  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav ul');
  
  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
      navList.style.display = isExpanded ? 'none' : 'flex';
    });
  }

  // Contact button focus effect
  const contactSection = document.querySelector('#contact');
  if (contactSection) {
    const contactButton = contactSection.querySelector('a[href^="mailto"]');
    if (contactButton) {
      contactButton.addEventListener('focus', () => {
        contactButton.style.transform = 'translateY(-2px)';
        contactButton.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      });
      
      contactButton.addEventListener('blur', () => {
        contactButton.style.transform = '';
        contactButton.style.boxShadow = '';
      });
    }
  }

  // Handle window resize for mobile menu
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      if (navList) navList.style.display = 'flex';
      if (hamburger) hamburger.style.display = 'none';
    } else {
      if (navList) navList.style.display = 'none';
      if (hamburger) hamburger.style.display = 'block';
    }
  });
});