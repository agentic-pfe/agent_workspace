document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', 
                navLinks.classList.contains('active').toString()
            );
        });
    }

    // Smooth Scrolling for Anchor Links
    document.addEventListener('click', (event) => {
        const target = event.target.closest('a[href^="#"]');
        if (target) {
            event.preventDefault();
            const targetId = target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });

    // Contact Form Validation
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            let isValid = true;

            // Clear previous error messages
            document.querySelectorAll('.error-message').forEach(el => el.remove());

            // Name validation
            const nameInput = document.getElementById('name');
            if (!nameInput.value.trim()) {
                displayError(nameInput, 'Please enter your full name');
                isValid = false;
            }

            // Email validation
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                displayError(emailInput, 'Please enter your email address');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value)) {
                displayError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }

            // Message validation
            const messageInput = document.getElementById('message');
            if (!messageInput.value.trim()) {
                displayError(messageInput, 'Please describe your project');
                isValid = false;
            }

            // Project Type validation
            const projectTypeInput = document.getElementById('project-type');
            if (projectTypeInput.value === '') {
                displayError(projectTypeInput, 'Please select a project type');
                isValid = false;
            }

            if (isValid) {
                // Here you would typically send the form data via fetch/ajax
                alert('Form submitted successfully! We will contact you soon.');
                contactForm.reset();
            }
        });
    }

    // Helper function to display inline error messages
    function displayError(inputElement, message) {
        const errorSpan = document.createElement('span');
        errorSpan.classList.add('error-message');
        errorSpan.textContent = message;
        errorSpan.style.color = 'red';
        errorSpan.style.fontSize = '0.8rem';
        inputElement.parentNode.insertBefore(errorSpan, inputElement.nextSibling);
    }
});