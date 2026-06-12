document.addEventListener('DOMContentLoaded', async () => {
  // Fetch and render pricing data
  try {
    const response = await fetch('/api/pricing');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const pricingData = await response.json();
    
    const container = document.getElementById('pricing-cards-container');
    if (!container) {
      console.error('Pricing cards container not found');
      return;
    }
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Create and append pricing cards
    pricingData.forEach(plan => {
      const card = document.createElement('div');
      card.className = 'pricing-card';
      card.innerHTML = `
        <h3>${plan.name}</h3>
        <p class="price">$${plan.price}/month</p>
        <ul class="features-list">
          ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    // Render error message in features section
    const featuresSection = document.querySelector('.features-section') || document.querySelector('main');
    if (featuresSection) {
      featuresSection.innerHTML = '<p class="error-message">Failed to load pricing information. Please try again later.</p>';
    }
  }
  
  // Attach click event to CTA button
  const ctaButton = document.querySelector('button[type="submit"]');
  if (ctaButton) {
    ctaButton.addEventListener('click', handleCTAClick);
  }
  
  // Preload gallery images
  preloadGalleryImages();
});

// Handle CTA button click
async function handleCTAClick(e) {
  e.preventDefault();
  
  const emailInput = document.querySelector('input[type="email"]');
  const email = emailInput ? emailInput.value.trim() : '';
  
  if (!email) {
    alert('Please enter your email address.');
    return;
  }
  
  if (!validateEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  
  // Get the CTA button for UI updates
  const ctaButton = e.target;
  const originalText = ctaButton.textContent;
  ctaButton.textContent = 'Submitting...';
  ctaButton.disabled = true;
  
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    // Show thank-you message
    alert('Thank you! We will contact you soon.');
    
    // Clear the email input
    if (emailInput) emailInput.value = '';
    
    // Reset button
    ctaButton.textContent = originalText;
    ctaButton.disabled = false;
  } catch (error) {
    console.error('Error submitting lead:', error);
    alert('There was an error submitting your information. Please try again.');
    
    // Reset button
    ctaButton.textContent = originalText;
    ctaButton.disabled = false;
  }
}

// Email validation function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Preload gallery images
function preloadGalleryImages() {
  const galleryImages = [
    '/images/gallery1.jpg',
    '/images/gallery2.jpg',
    '/images/gallery3.jpg'
  ];
  
  galleryImages.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = () => console.log(`Loaded: ${src}`);
    img.onerror = () => console.error(`Failed to load: ${src}`);
  });
}