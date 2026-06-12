// Contact Form Submission Handler with Input Sanitization
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    // Input Sanitization Function
    const sanitizeInput = (input) => {
        // Create a temporary div to escape HTML entities
        const temp = document.createElement('div');
        temp.textContent = input;
        
        // Replace potentially dangerous characters
        return temp.innerHTML
            .replace(/</g, '&lt;')   // Prevent XSS
            .replace(/>/g, '&gt;')   // Prevent XSS
            .replace(/"/g, '&quot;') // Prevent attribute injection
            .replace(/'/g, '&#39;')  // Prevent attribute injection
            .trim();
    };

    // Form Validation Function
    const validateForm = (name, email, message) => {
        const nameRegex = /^[A-Za-z\s'-]{2,50}$/;
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

        return {
            name: nameRegex.test(name),
            email: emailRegex.test(email),
            message: message.length >= 10 && message.length <= 500
        };
    };

    // Handle Form Submission
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Get form values
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        const name = sanitizeInput(nameInput.value);
        const email = sanitizeInput(emailInput.value);
        const message = sanitizeInput(messageInput.value);

        // Validate inputs
        const validationResults = validateForm(name, email, message);

        // Check if all validations pass
        if (Object.values(validationResults).every(result => result === true)) {
            // Create submission object
            const submission = {
                name,
                email,
                message,
                timestamp: new Date().toISOString()
            };

            // Store in localStorage
            const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
            submissions.push(submission);
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

            // Optional: Provide user feedback
            alert('Message sent successfully!');

            // Reset form
            contactForm.reset();
        } else {
            // Highlight invalid fields
            Object.entries(validationResults).forEach(([field, isValid]) => {
                const input = document.getElementById(field);
                if (!isValid) {
                    input.classList.add('invalid');
                    input.setAttribute('aria-invalid', 'true');
                } else {
                    input.classList.remove('invalid');
                    input.removeAttribute('aria-invalid');
                }
            });

            alert('Please correct the highlighted fields.');
        }
    });

    // Optional: Log stored submissions on page load (for demonstration)
    const storedSubmissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    console.log('Stored Contact Submissions:', storedSubmissions);
});