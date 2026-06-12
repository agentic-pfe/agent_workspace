document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Testimonial carousel
    const testimonialsContainer = document.querySelector('.testimonials-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    if (testimonialsContainer && prevBtn && nextBtn) {
        const testimonials = testimonialsContainer.querySelectorAll('.testimonial-card');
        const totalTestimonials = testimonials.length;

        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.remove('active');
                if (i === index) {
                    testimonial.classList.add('active');
                }
            });
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials;
            showTestimonial(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalTestimonials;
            showTestimonial(currentIndex);
        });

        showTestimonial(currentIndex); // Show the first testimonial initially
    }

    // Pricing toggle
    const pricingToggle = document.querySelector('.pricing-toggle');
    const monthlyPrices = document.querySelectorAll('.price-monthly');
    const yearlyPrices = document.querySelectorAll('.price-yearly');

    if (pricingToggle && monthlyPrices.length > 0 && yearlyPrices.length > 0) {
        pricingToggle.addEventListener('change', () => {
            if (pricingToggle.checked) { // Yearly
                monthlyPrices.forEach(price => price.style.display = 'none');
                yearlyPrices.forEach(price => price.style.display = 'block');
            } else { // Monthly
                monthlyPrices.forEach(price => price.style.display = 'block');
                yearlyPrices.forEach(price => price.style.display = 'none');
            }
        });
        // Initialize pricing display
        monthlyPrices.forEach(price => price.style.display = 'block');
        yearlyPrices.forEach(price => price.style.display = 'none');
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form validation for free trial CTA
    const freeTrialForm = document.querySelector('.free-trial-form');
    const emailInput = document.querySelector('.free-trial-form input[type="email"]');
    const errorMessage = document.querySelector('.email-error-message');

    if (freeTrialForm && emailInput && errorMessage) {
        freeTrialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!emailInput.checkValidity()) {
                errorMessage.textContent = 'Please enter a valid email address.';
                errorMessage.style.display = 'block';
            } else {
                errorMessage.textContent = '';
                errorMessage.style.display = 'none';
                // In a real application, you would send the form data to a server here.
                alert('Thank you for signing up for the free trial!');
                emailInput.value = ''; // Clear the input
            }
        });

        emailInput.addEventListener('input', () => {
            if (emailInput.checkValidity()) {
                errorMessage.style.display = 'none';
            }
        });
    }
});