// Dynamic content for pricing plans
const pricingPlans = [
  {
    id: 1,
    name: "Starter",
    price: "$19",
    period: "per month",
    features: [
      "Up to 5 projects",
      "3GB storage",
      "Basic support",
      "Community access"
    ]
  },
  {
    id: 2,
    name: "Professional",
    price: "$49",
    period: "per month",
    features: [
      "Unlimited projects",
      "10GB storage",
      "Priority support",
      "Advanced analytics",
      "Team collaboration"
    ]
  },
  {
    id: 3,
    name: "Enterprise",
    price: "$99",
    period: "per month",
    features: [
      "Unlimited projects",
      "50GB storage",
      "24/7 dedicated support",
      "Advanced analytics",
      "Team collaboration",
      "Custom integrations"
    ]
  }
];

// Dynamic content for contact form
const contactFormHTML = `
  <form id="contact-form" data-contact-form>
    <div class="form-group">
      <label for="name">Name</label>
      <input type="text" id="name" name="name" required>
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required>
    </div>
    <div class="form-group">
      <label for="message">Message</label>
      <textarea id="message" name="message" rows="5" required></textarea>
    </div>
    <button type="submit" class="submit-button">Send Message</button>
  </form>
`;

// Function to render pricing plans
function renderPricingPlans() {
  const pricingContainer = document.querySelector('[data-pricing-container]');
  
  if (!pricingContainer) return;
  
  pricingContainer.innerHTML = '';
  
  pricingPlans.forEach(plan => {
    const planElement = document.createElement('div');
    planElement.className = 'pricing-card';
    planElement.dataset.planId = plan.id;
    
    planElement.innerHTML = `
      <h3>${plan.name}</h3>
      <div class="price">${plan.price}<span>${plan.period}</span></div>
      <ul>
        ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
      </ul>
      <button class="plan-button" data-action="select-plan" data-plan-id="${plan.id}">Choose Plan</button>
    `;
    
    pricingContainer.appendChild(planElement);
  });
}

// Function to render contact form
function renderContactForm() {
  const contactContainer = document.querySelector('[data-contact-container]');
  
  if (!contactContainer) return;
  
  contactContainer.innerHTML = contactFormHTML;
  
  // Add event listener to the form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
}

// Form submission handler
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  // In a real application, you would send this data to a server
  console.log('Form submitted with data:', Object.fromEntries(formData));
  
  // Show success message
  alert('Thank you for your message! We will get back to you soon.');
  
  // Reset form
  form.reset();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  renderPricingPlans();
  renderContactForm();
  
  // Add event listeners for CTA buttons
  const ctaButtons = document.querySelectorAll('[data-action="get-started"]');
  ctaButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Scroll to pricing section
      document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  // Add event listeners for plan selection buttons
  const planButtons = document.querySelectorAll('[data-action="select-plan"]');
  planButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const planId = event.target.dataset.planId;
      console.log(`Selected plan: ${planId}`);
      alert(`You selected the ${pricingPlans.find(p => p.id == planId).name} plan!`);
    });
  });
});