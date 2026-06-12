document.addEventListener('DOMContentLoaded', () => {
    // Accessibility Enhancements
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.getElementById('main-content');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const donationForm = document.querySelector('.donation-form');
    const formStatusRegion = document.createElement('div');

    // Skip Link: Smooth Scrolling and Focus Management
    if (skipLink && mainContent) {
        skipLink.addEventListener('click', (event) => {
            event.preventDefault();
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
        });
    }

    // Mobile Navigation Toggle
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Keyboard Navigation for Mobile Menu
        mobileMenuToggle.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                mobileMenuToggle.click();
            }
        });
    }

    // Form Validation and Submission
    if (donationForm) {
        // Create ARIA Live Region for Form Status
        formStatusRegion.setAttribute('aria-live', 'polite');
        formStatusRegion.classList.add('form-status');
        donationForm.appendChild(formStatusRegion);

        donationForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const nameInput = document.getElementById('donor-name');
            const emailInput = document.getElementById('donor-email');
            const amountInput = document.getElementById('donation-amount');
            
            let isValid = true;
            formStatusRegion.innerHTML = '';

            // Name Validation
            if (!nameInput.value.trim()) {
                isValid = false;
                nameInput.setAttribute('aria-invalid', 'true');
                formStatusRegion.innerHTML += 'Please enter your full name. ';
            } else {
                nameInput.removeAttribute('aria-invalid');
            }

            // Email Validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
                isValid = false;
                emailInput.setAttribute('aria-invalid', 'true');
                formStatusRegion.innerHTML += 'Please enter a valid email address. ';
            } else {
                emailInput.removeAttribute('aria-invalid');
            }

            // Amount Validation
            const amount = parseFloat(amountInput.value);
            if (isNaN(amount) || amount < 5) {
                isValid = false;
                amountInput.setAttribute('aria-invalid', 'true');
                formStatusRegion.innerHTML += 'Please enter a donation amount of at least $5. ';
            } else {
                amountInput.removeAttribute('aria-invalid');
            }

            // Form Submission or Error Handling
            if (isValid) {
                formStatusRegion.innerHTML = 'Thank you for your donation! We are processing your contribution.';
                // Here you would typically send the form data to a server
                donationForm.reset();
            }
        });

        // Keyboard Accessibility for Form Inputs
        const formInputs = donationForm.querySelectorAll('input');
        formInputs.forEach(input => {
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    const nextInput = input.closest('.form-group').nextElementSibling?.querySelector('input');
                    if (nextInput) {
                        nextInput.focus();
                    } else {
                        donationForm.querySelector('button[type="submit"]').focus();
                    }
                }
            });
        });
    }

    // Smooth Scrolling for Anchor Links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
            }
        });
    });
});