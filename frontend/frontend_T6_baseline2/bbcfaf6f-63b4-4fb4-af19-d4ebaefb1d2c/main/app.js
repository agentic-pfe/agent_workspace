document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Manage focus for keyboard users
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
            }
        });
    });

    // Form Validation
    const volunteerForm = document.getElementById('volunteer-form');
    
    volunteerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const interestSelect = document.getElementById('interest');
        
        let isValid = true;
        
        // Name validation
        if (nameInput.value.trim() === '') {
            isValid = false;
            nameInput.setAttribute('aria-invalid', 'true');
            nameInput.setAttribute('aria-describedby', 'name-error');
        } else {
            nameInput.removeAttribute('aria-invalid');
            nameInput.removeAttribute('aria-describedby');
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            isValid = false;
            emailInput.setAttribute('aria-invalid', 'true');
            emailInput.setAttribute('aria-describedby', 'email-error');
        } else {
            emailInput.removeAttribute('aria-invalid');
            emailInput.removeAttribute('aria-describedby');
        }
        
        // Interest validation
        if (interestSelect.value === '') {
            isValid = false;
            interestSelect.setAttribute('aria-invalid', 'true');
            interestSelect.setAttribute('aria-describedby', 'interest-error');
        } else {
            interestSelect.removeAttribute('aria-invalid');
            interestSelect.removeAttribute('aria-describedby');
        }
        
        if (isValid) {
            // Here you would typically send form data to a server
            alert('Thank you for your application!');
            volunteerForm.reset();
        }
    });
});