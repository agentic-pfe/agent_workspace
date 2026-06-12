document.addEventListener('DOMContentLoaded', () => {
  // CTA Button Feedback
  const ctaButton = document.querySelector('.cta-button') || document.querySelector('button[type="submit"]');
  if (ctaButton) {
    ctaButton.addEventListener('click', function(e) {
      const originalText = this.textContent;
      this.classList.add('loading');
      this.textContent = 'Processing...';
      this.setAttribute('aria-disabled', 'true');
      
      // Simulate processing delay
      setTimeout(() => {
        this.classList.remove('loading');
        this.textContent = originalText;
        this.removeAttribute('aria-disabled');
      }, 1500);
    });
  }

  // Newsletter Form Validation (if exists)
  const newsletterForm = document.querySelector('#newsletter-form') || document.querySelector('form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      const emailInput = this.querySelector('input[type="email"]');
      if (emailInput) {
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(emailValue)) {
          e.preventDefault();
          
          // Create error message if not exists
          let errorMsg = emailInput.parentNode.querySelector('.error-message');
          if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.setAttribute('role', 'alert');
            errorMsg.style.color = '#ef4444';
            errorMsg.style.fontSize = '0.875rem';
            errorMsg.style.marginTop = '0.25rem';
            emailInput.parentNode.appendChild(errorMsg);
          }
          
          errorMsg.textContent = 'Please enter a valid email address.';
          emailInput.setAttribute('aria-invalid', 'true');
          emailInput.focus();
        } else {
          // Valid email - simulate submission
          e.preventDefault();
          
          // Remove any existing error
          const existingError = emailInput.parentNode.querySelector('.error-message');
          if (existingError) {
            existingError.remove();
          }
          emailInput.setAttribute('aria-invalid', 'false');
          
          // Show success feedback
          const successMsg = document.createElement('div');
          successMsg.className = 'success-message';
          successMsg.setAttribute('role', 'status');
          successMsg.setAttribute('aria-live', 'polite');
          successMsg.textContent = 'Thank you for subscribing!';
          successMsg.style.color = '#10b981';
          successMsg.style.marginTop = '0.5rem';
          
          // Insert after form or at the end of form
          if (this.parentNode) {
            this.parentNode.insertBefore(successMsg, this.nextSibling);
          } else {
            this.appendChild(successMsg);
          }
          
          // Reset form
          this.reset();
        }
      }
    });
    
    // Real-time validation reset
    const emailInputs = newsletterForm.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
      input.addEventListener('input', function() {
        if (this.getAttribute('aria-invalid') === 'true') {
          this.setAttribute('aria-invalid', 'false');
          const errorMsg = this.parentNode.querySelector('.error-message');
          if (errorMsg) {
            errorMsg.remove();
          }
        }
      });
    });
  }
});