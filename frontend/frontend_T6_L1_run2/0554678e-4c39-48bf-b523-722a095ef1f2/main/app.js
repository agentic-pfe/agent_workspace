document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling for Skip Link and Anchor Links
    const smoothScrollToTarget = (event) => {
        event.preventDefault();
        const targetId = event.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus();
            targetElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    };

    // Apply smooth scrolling to skip link and navigation links
    const smoothScrollLinks = document.querySelectorAll('.skip-link, .nav-links a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', smoothScrollToTarget);
    });

    // Mobile Menu Toggle with Keyboard Accessibility
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksArray = Array.from(navLinks.querySelectorAll('a'));

    let currentNavIndex = -1;

    const toggleMobileMenu = () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    };

    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Keyboard Navigation for Mobile Menu
    const handleNavKeydown = (event) => {
        if (!navLinks.classList.contains('active')) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                currentNavIndex = (currentNavIndex + 1) % navLinksArray.length;
                navLinksArray[currentNavIndex].focus();
                break;
            case 'ArrowUp':
                event.preventDefault();
                currentNavIndex = (currentNavIndex - 1 + navLinksArray.length) % navLinksArray.length;
                navLinksArray[currentNavIndex].focus();
                break;
            case 'Escape':
                toggleMobileMenu();
                mobileMenuToggle.focus();
                break;
        }
    };

    document.addEventListener('keydown', handleNavKeydown);

    // Donation Form Validation
    const donationForm = document.querySelector('.donation-form');
    const formGroups = donationForm.querySelectorAll('.form-group');
    const submitButton = donationForm.querySelector('.submit-button');

    // Live Region for Form Validation Announcements
    const validationAnnouncer = document.createElement('div');
    validationAnnouncer.setAttribute('aria-live', 'polite');
    validationAnnouncer.classList.add('visually-hidden');
    donationForm.appendChild(validationAnnouncer);

    const validateForm = (event) => {
        event.preventDefault();
        let isValid = true;
        validationAnnouncer.textContent = '';

        formGroups.forEach(group => {
            const input = group.querySelector('input, select');
            const errorMessage = group.querySelector('.error-message');
            
            // Remove previous error messages
            if (errorMessage) {
                errorMessage.remove();
            }

            if (!input.value.trim()) {
                isValid = false;
                const error = document.createElement('span');
                error.classList.add('error-message');
                error.textContent = `Please enter a ${input.name.replace('-', ' ')}.`;
                error.setAttribute('role', 'alert');
                group.appendChild(error);
                input.setAttribute('aria-invalid', 'true');
            } else {
                input.removeAttribute('aria-invalid');
            }
        });

        if (isValid) {
            validationAnnouncer.textContent = 'Form submitted successfully. Thank you for your support!';
            donationForm.reset();
        } else {
            validationAnnouncer.textContent = 'Please correct the errors in the form.';
        }
    };

    donationForm.addEventListener('submit', validateForm);

    // Enhance form inputs with real-time validation
    const formInputs = donationForm.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            const group = input.closest('.form-group');
            const errorMessage = group.querySelector('.error-message');
            
            if (errorMessage) {
                errorMessage.remove();
            }

            if (!input.value.trim()) {
                const error = document.createElement('span');
                error.classList.add('error-message');
                error.textContent = `Please enter a ${input.name.replace('-', ' ')}.`;
                error.setAttribute('role', 'alert');
                group.appendChild(error);
                input.setAttribute('aria-invalid', 'true');
            } else {
                input.removeAttribute('aria-invalid');
            }
        });
    });
});