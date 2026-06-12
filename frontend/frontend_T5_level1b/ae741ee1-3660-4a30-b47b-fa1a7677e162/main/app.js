document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Mobile Menu Toggle
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', 
            navLinks.classList.contains('active'));
    });

    // Form Submission Handler
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Input Sanitization
        const sanitizeInput = (input) => {
            const div = document.createElement('div');
            div.textContent = input;
            return div.innerHTML.trim();
        };

        const formData = {
            name: sanitizeInput(document.getElementById('name').value),
            email: sanitizeInput(document.getElementById('email').value),
            message: sanitizeInput(document.getElementById('message').value),
            timestamp: new Date().toISOString()
        };

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Store in localStorage
        const submissions = JSON.parse(localStorage.getItem('vaultlySubmissions') || '[]');
        submissions.push(formData);
        localStorage.setItem('vaultlySubmissions', JSON.stringify(submissions));

        // Reset Form
        contactForm.reset();

        // User Feedback
        const successMessage = document.createElement('div');
        successMessage.textContent = 'Thank you for your submission! We will contact you soon.';
        successMessage.classList.add('form-success');
        contactForm.appendChild(successMessage);

        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    });

    // Smooth Scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});