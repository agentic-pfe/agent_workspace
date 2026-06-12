document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('#contact-form');
  const formSubmissionStatus = document.querySelector('#form-submission-status');

  // Sanitization utility function
  const sanitizeInput = (input) => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML.trim();
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Get form elements
    const fullNameInput = document.querySelector('#full-name');
    const emailInput = document.querySelector('#email');
    const phoneInput = document.querySelector('#phone');
    const messageInput = document.querySelector('#message');

    // Sanitize and validate inputs
    const fullName = sanitizeInput(fullNameInput.value);
    const email = sanitizeInput(emailInput.value);
    const phone = sanitizeInput(phoneInput.value);
    const message = sanitizeInput(messageInput.value);

    // Validation checks
    if (!fullName || fullName.length < 2) {
      showError('Please enter a valid full name');
      return;
    }

    if (!isValidEmail(email)) {
      showError('Please enter a valid email address');
      return;
    }

    // Optional phone validation (adjust regex as needed)
    if (phone && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone)) {
      showError('Please enter a valid phone number');
      return;
    }

    if (!message || message.length < 10) {
      showError('Please enter a message with at least 10 characters');
      return;
    }

    // Prepare submission data
    const submissionData = {
      fullName,
      email,
      phone,
      message,
      timestamp: new Date().toISOString()
    };

    // Retrieve existing submissions or initialize empty array
    const existingSubmissions = JSON.parse(localStorage.getItem('vaultlyContactSubmissions') || '[]');
    existingSubmissions.push(submissionData);

    // Store updated submissions
    localStorage.setItem('vaultlyContactSubmissions', JSON.stringify(existingSubmissions));

    // Clear form and show success message
    contactForm.reset();
    showSuccess('Thank you for your message! We will get back to you soon.');
  };

  // Display error message safely
  const showError = (message) => {
    formSubmissionStatus.textContent = message;
    formSubmissionStatus.className = 'form-error';
    formSubmissionStatus.setAttribute('role', 'alert');
  };

  // Display success message safely
  const showSuccess = (message) => {
    formSubmissionStatus.textContent = message;
    formSubmissionStatus.className = 'form-success';
    formSubmissionStatus.setAttribute('role', 'status');
  };

  // Attach form submission event listener
  if (contactForm) {
    contactForm.addEventListener('submit', handleSubmit);
  }
});