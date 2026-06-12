document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');

  // Sanitization utility functions
  const sanitizeInput = (input) => {
    // Remove script tags and potential script injection attempts
    const scriptTagRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    const noScriptInput = input.replace(scriptTagRegex, '');

    // Encode HTML entities to prevent XSS
    const tempDiv = document.createElement('div');
    tempDiv.textContent = noScriptInput;
    return tempDiv.innerHTML;
  };

  contactForm.addEventListener('submit', (event) => {
    // Prevent default form submission
    event.preventDefault();

    // Get form input values
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Sanitize inputs
    const name = sanitizeInput(nameInput.value.trim());
    const email = sanitizeInput(emailInput.value.trim());
    const message = sanitizeInput(messageInput.value.trim());

    // Basic validation
    if (!name || !email || !message) {
      alert('Please fill out all fields');
      return;
    }

    // Construct contact submission object
    const contactSubmission = {
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    };

    // Retrieve existing contacts or initialize empty array
    const existingContacts = JSON.parse(localStorage.getItem('vaultly_contacts') || '[]');
    
    // Add new submission
    existingContacts.push(contactSubmission);

    // Store updated contacts in localStorage
    localStorage.setItem('vaultly_contacts', JSON.stringify(existingContacts));

    // Clear form inputs
    nameInput.value = '';
    emailInput.value = '';
    messageInput.value = '';

    // Optional: Show success message
    alert('Thank you for your message! We will get back to you soon.');
  });
});