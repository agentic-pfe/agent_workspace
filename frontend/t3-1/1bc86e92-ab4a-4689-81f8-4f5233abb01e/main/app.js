document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.setAttribute('aria-expanded', 
      mobileMenuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
    );
  });

  // Smooth Scroll for Navigation Links
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

  // Image Carousel for Shop Section
  const shopCarousel = document.querySelector('.shop-carousel');
  const shopImages = shopCarousel ? shopCarousel.querySelectorAll('img') : [];
  let currentImageIndex = 0;

  function rotateCarousel() {
    if (shopImages.length > 0) {
      shopImages.forEach(img => img.classList.remove('active'));
      shopImages[currentImageIndex].classList.add('active');
      currentImageIndex = (currentImageIndex + 1) % shopImages.length;
    }
  }

  if (shopCarousel) {
    // Auto-rotate every 5 seconds
    setInterval(rotateCarousel, 5000);

    // Manual navigation controls
    const prevButton = shopCarousel.querySelector('.carousel-prev');
    const nextButton = shopCarousel.querySelector('.carousel-next');

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + shopImages.length) % shopImages.length;
        rotateCarousel();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % shopImages.length;
        rotateCarousel();
      });
    }
  }

  // Subscription Plan Selection
  const subscriptionPlans = document.querySelectorAll('.subscription-plan');
  const subscribeButton = document.querySelector('.subscribe-button');
  let selectedPlan = null;

  subscriptionPlans.forEach(plan => {
    plan.addEventListener('click', () => {
      // Remove previous selection
      subscriptionPlans.forEach(p => p.classList.remove('selected'));
      
      // Mark current plan as selected
      plan.classList.add('selected');
      selectedPlan = plan.getAttribute('data-plan');
    });
  });

  // Subscribe Button Handler
  if (subscribeButton) {
    subscribeButton.addEventListener('click', () => {
      if (selectedPlan) {
        console.log(`Subscribed to ${selectedPlan} coffee plan`);
        // Future: Add actual subscription logic
        alert(`Thank you for subscribing to our ${selectedPlan} coffee plan!`);
      } else {
        alert('Please select a subscription plan first.');
      }
    });
  }

  // Keyboard Accessibility Enhancements
  document.addEventListener('keydown', (event) => {
    // Escape key to close mobile menu
    if (event.key === 'Escape' && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenuToggle.focus();
    }
  });
});