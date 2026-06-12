document.addEventListener('DOMContentLoaded', () => {
    // Skip to Main Content Functionality
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.getElementById('main-content');

    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
    });

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
    });

    // Newsletter Form Validation
    const newsletterForm = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const submitButton = document.querySelector('.submit-button');

    // Create error message container
    const errorContainer = document.createElement('div');
    errorContainer.setAttribute('role', 'alert');
    errorContainer.setAttribute('aria-live', 'polite');
    errorContainer.classList.add('visually-hidden');
    newsletterForm.insertBefore(errorContainer, submitButton);

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('visually-hidden');
        errorContainer.focus();
    }

    function clearError() {
        errorContainer.textContent = '';
        errorContainer.classList.add('visually-hidden');
    }

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearError();

        if (nameInput.value.trim() === '') {
            showError('Please enter your full name.');
            nameInput.focus();
            return;
        }

        if (!validateEmail(emailInput.value)) {
            showError('Please enter a valid email address.');
            emailInput.focus();
            return;
        }

        // Simulated form submission
        errorContainer.textContent = 'Thank you for subscribing!';
        errorContainer.classList.remove('visually-hidden');
        errorContainer.setAttribute('role', 'status');
        newsletterForm.reset();
    });

    // Keyboard Navigation Enhancements
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableContent = mainContent.querySelectorAll(focusableElements);
    const firstElement = focusableContent[0];
    const lastElement = focusableContent[focusableContent.length - 1];

    // Trap focus within main content
    mainContent.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    });
});