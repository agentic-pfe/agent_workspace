document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });

  // Image gallery slider functionality
  const galleryImages = document.querySelectorAll('.gallery-img');
  let currentImageIndex = 0;

  // Hide all images except the first one
  galleryImages.forEach((img, index) => {
    img.style.display = index === 0 ? 'block' : 'none';
  });

  // Next button functionality
  const nextButton = document.querySelector('.next-btn');
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      galleryImages[currentImageIndex].style.display = 'none';
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      galleryImages[currentImageIndex].style.display = 'block';
    });
  }

  // Previous button functionality
  const prevButton = document.querySelector('.prev-btn');
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      galleryImages[currentImageIndex].style.display = 'none';
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      galleryImages[currentImageIndex].style.display = 'block';
    });
  }

  // Form placeholder interaction
  const formInputs = document.querySelectorAll('input, textarea');
  formInputs.forEach(input => {
    // Store original placeholder
    input.dataset.placeholder = input.placeholder;
    
    // Clear placeholder on focus
    input.addEventListener('focus', () => {
      input.placeholder = '';
    });
    
    // Restore placeholder on blur if empty
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.placeholder = input.dataset.placeholder || '';
      }
    });
  });
});