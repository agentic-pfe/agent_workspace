document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const successMessage = document.createElement('div');
  successMessage.id = 'formSuccessMessage';
  successMessage.className = 'form-success-message';
  successMessage.setAttribute('role', 'alert');
  successMessage.setAttribute('aria-live', 'polite');

  // Input sanitization function
  const sanitizeInput = (input) => {
    // Remove script tags and potential XSS vectors
    const sanitizedInput = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/onerror=/gi, '')
      .trim();
    
    return sanitizedInput;
  };

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get form elements
    const fullNameInput = contactForm.querySelector('#fullName');
    const emailInput = contactForm.querySelector('#email');
    const messageInput = contactForm.querySelector('#message');

    // Validate inputs
    const fullName = sanitizeInput(fullNameInput.value);
    const email = sanitizeInput(emailInput.value);
    const message = sanitizeInput(messageInput.value);

    // Validation checks
    const errors = [];
    if (!fullName) errors.push('Full Name is required');
    if (!email) errors.push('Email is required');
    if (!validateEmail(email)) errors.push('Invalid email format');
    if (!message) errors.push('Message is required');

    // If there are errors, display them and stop submission
    if (errors.length > 0) {
      const errorContainer = document.createElement('div');
      errorContainer.className = 'form-errors';
      errorContainer.setAttribute('role', 'alert');
      errorContainer.setAttribute('aria-live', 'assertive');
      
      errors.forEach(error => {
        const errorElement = document.createElement('p');
        errorElement.textContent = error;
        errorContainer.appendChild(errorElement);
      });

      // Remove previous error messages
      const existingErrors = contactForm.querySelector('.form-errors');
      if (existingErrors) existingErrors.remove();

      contactForm.insertAdjacentElement('afterbegin', errorContainer);
      return;
    }

    // Prepare submission data
    const submissionData = {
      fullName,
      email,
      message,
      timestamp: new Date().toISOString()
    };

    // Retrieve existing submissions or initialize empty array
    const contactSubmissions = 
      JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    
    // Add new submission
    contactSubmissions.push(submissionData);
    
    // Store updated submissions
    localStorage.setItem('contactSubmissions', JSON.stringify(contactSubmissions));

    // Show success message
    successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
    
    // Remove previous success messages
    const existingSuccessMessage = document.getElementById('formSuccessMessage');
    if (existingSuccessMessage) existingSuccessMessage.remove();

    // Insert success message after form
    contactForm.insertAdjacentElement('afterend', successMessage);

    // Reset form
    contactForm.reset();
  });
});