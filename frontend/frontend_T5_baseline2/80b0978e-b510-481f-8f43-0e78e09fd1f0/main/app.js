document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const contactForm = document.getElementById('contact-form');

    // Mobile Menu Toggle
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });

    // Form Submission with Sanitization and LocalStorage
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Input Sanitization
        const sanitizeInput = (input) => {
            const div = document.createElement('div');
            div.textContent = input;
            return div.innerHTML.trim();
        };

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        const sanitizedName = sanitizeInput(nameInput.value);
        const sanitizedEmail = sanitizeInput(emailInput.value);
        const sanitizedMessage = sanitizeInput(messageInput.value);

        // Basic Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitizedEmail)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Store in LocalStorage
        const submission = {
            name: sanitizedName,
            email: sanitizedEmail,
            message: sanitizedMessage,
            timestamp: new Date().toISOString()
        };

        // Retrieve existing submissions or initialize empty array
        const submissions = JSON.parse(localStorage.getItem('vaultlyContactSubmissions') || '[]');
        submissions.push(submission);
        localStorage.setItem('vaultlyContactSubmissions', JSON.stringify(submissions));

        // Reset form and show confirmation
        contactForm.reset();
        alert('Thank you for your message! We will get back to you soon.');
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});