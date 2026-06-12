
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuButton = document.querySelector('[aria-controls="primary-navigation"]');
    const primaryNavigation = document.getElementById('primary-navigation');

    if (menuButton && primaryNavigation) {
        menuButton.addEventListener('click', () => {
            const expanded = menuButton.getAttribute('aria-expanded') === 'true' || false;
            menuButton.setAttribute('aria-expanded', !expanded);
            primaryNavigation.classList.toggle('hidden'); // Assuming a 'hidden' class for toggling visibility
        });
    }

    // CTA form submission
    const ctaForm = document.querySelector('.cta-form'); // Assuming a class 'cta-form' on your form

    if (ctaForm) {
        ctaForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            // Simple success message
            const successMessage = document.createElement('p');
            successMessage.textContent = 'Thank you for your submission! We'll be in touch.';
            successMessage.setAttribute('aria-live', 'polite');
            successMessage.style.color = 'green';
            successMessage.style.marginTop = '1rem';

            ctaForm.parentNode.insertBefore(successMessage, ctaForm.nextSibling);

            // Reset the form
            ctaForm.reset();

            // Optional: Remove success message after a few seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        });
    }
});
