document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling Navigation
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });

                // Manage focus for accessibility
                targetSection.setAttribute('tabindex', '-1');
                targetSection.focus();
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-links');

    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        
        // Accessibility attributes
        mobileMenuToggle.setAttribute('aria-expanded', isOpen);
        navMenu.setAttribute('aria-hidden', !isOpen);

        // Toggle hamburger icon
        mobileMenuToggle.setAttribute('aria-label', 
            isOpen ? 'Close mobile menu' : 'Open mobile menu'
        );
    });

    // Contact Form Validation
    const contactForm = document.querySelector('#contact form');
    const emailInput = document.querySelector('#email');

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.querySelector('#name');
        const projectType = document.querySelector('#project-type');
        const message = document.querySelector('#message');

        // Reset previous error states
        [name, emailInput, projectType, message].forEach(field => {
            field.setAttribute('aria-invalid', 'false');
            const errorSpan = field.nextElementSibling;
            if (errorSpan && errorSpan.classList.contains('error-message')) {
                errorSpan.remove();
            }
        });

        let isValid = true;

        // Name validation
        if (!name.value.trim()) {
            showError(name, 'Please enter your full name');
            isValid = false;
        }

        // Email validation
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        // Project Type validation
        if (projectType.value === '') {
            showError(projectType, 'Please select a project type');
            isValid = false;
        }

        // Message validation
        if (!message.value.trim()) {
            showError(message, 'Please describe your project');
            isValid = false;
        }

        if (isValid) {
            // Here you would typically send form data to a server
            alert('Form submitted successfully! We will contact you soon.');
            contactForm.reset();
        }
    });

    function showError(field, message) {
        field.setAttribute('aria-invalid', 'true');
        const errorSpan = document.createElement('span');
        errorSpan.classList.add('error-message');
        errorSpan.textContent = message;
        errorSpan.setAttribute('role', 'alert');
        field.parentNode.insertBefore(errorSpan, field.nextSibling);
    }
});