document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Mobile Menu Toggle
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isExpanded = navLinks.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Form Submission Handler
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Input Sanitization
        const sanitizedName = sanitizeInput(nameInput.value);
        const sanitizedEmail = sanitizeEmail(emailInput.value);
        const sanitizedMessage = sanitizeInput(messageInput.value);

        // Form Validation
        if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) {
            alert('Please fill out all fields correctly.');
            return;
        }

        // Prepare Submission Object
        const submission = {
            name: sanitizedName,
            email: sanitizedEmail,
            message: sanitizedMessage,
            timestamp: new Date().toISOString()
        };

        // Store in localStorage
        const submissions = JSON.parse(localStorage.getItem('vaultly_contact_submissions') || '[]');
        submissions.push(submission);
        localStorage.setItem('vaultly_contact_submissions', JSON.stringify(submissions));

        // Reset Form
        contactForm.reset();
        alert('Thank you for your message! We will get back to you soon.');
    });

    // Input Sanitization Functions
    function sanitizeInput(input) {
        if (!input || typeof input !== 'string') return '';
        return input.trim().replace(/<[^>]*>/g, '');
    }

    function sanitizeEmail(email) {
        if (!email || typeof email !== 'string') return '';
        const sanitized = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(sanitized) ? sanitized : '';
    }
});