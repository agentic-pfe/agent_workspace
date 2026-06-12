document.addEventListener('DOMContentLoaded', () => {
    // Skip to Main Content Link
    const skipLink = document.querySelector('.skip-link');
    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
    });

    // Newsletter Form Validation
    const newsletterForm = document.querySelector('.newsletter form');
    const emailInput = document.getElementById('email');
    const statusRegion = document.createElement('div');
    statusRegion.setAttribute('role', 'status');
    statusRegion.setAttribute('aria-live', 'polite');
    statusRegion.classList.add('sr-only');
    newsletterForm.appendChild(statusRegion);

    // Email Validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    newsletterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = emailInput.value.trim();

        // Clear previous validation states
        emailInput.setAttribute('aria-invalid', 'false');
        statusRegion.textContent = '';

        if (!emailRegex.test(email)) {
            // Invalid email
            emailInput.setAttribute('aria-invalid', 'true');
            statusRegion.textContent = 'Please enter a valid email address.';
            emailInput.focus();
            return;
        }

        // Successful submission
        statusRegion.textContent = 'Thank you for subscribing to our newsletter!';
        emailInput.value = ''; // Clear input
        
        // Optional: Here you would typically send the email to a backend service
    });

    // Smooth Scroll for Internal Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            
            // Ensure the target can receive focus for screen readers
            if (targetElement) {
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Keyboard Accessibility for Interactive Elements
    document.querySelectorAll('button, a, input, select, textarea')
        .forEach(element => {
            // Ensure Enter and Space work like a click
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                        e.target.click();
                    }
                }
            });
        });
});