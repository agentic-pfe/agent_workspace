document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const skipLink = document.querySelector('.skip-link');

    // Skip link functionality
    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        mainContent.focus();
    });

    // Form submission handling
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        // Basic form validation
        if (name.value && email.value && message.value) {
            alert('Thank you for your submission!');
            form.reset();
        } else {
            alert('Please fill out all fields.');
        }
    });

    // Keyboard support for buttons
    const buttons = document.querySelectorAll('button, a.cta-button');
    buttons.forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
});