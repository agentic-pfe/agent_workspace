document.addEventListener('DOMContentLoaded', () => {
  // Keyboard Accessibility Initialization
  initKeyboardNavigation();
  initMobileMenu();
  initDonationForm();
  initFocusManagement();
});

// Mobile Navigation Keyboard Accessibility
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-links');

  if (mobileMenuToggle && navMenu) {
    // Ensure mobile menu toggle has proper ARIA attributes
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-controls', 'main-navigation');
    navMenu.id = 'main-navigation';

    // Keyboard and Click Event Handling
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    mobileMenuToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMobileMenu();
      }
    });
  }

  function toggleMobileMenu() {
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');

    // Manage focus when menu opens/closes
    if (!isExpanded) {
      const firstNavLink = navMenu.querySelector('a');
      firstNavLink?.focus();
    } else {
      mobileMenuToggle.focus();
    }
  }
}

// Donation Form Keyboard and ARIA Enhancements
function initDonationForm() {
  const donationForm = document.querySelector('#donation-form');
  
  if (donationForm) {
    // Add ARIA live region for form feedback
    const formFeedback = document.createElement('div');
    formFeedback.id = 'form-feedback';
    formFeedback.setAttribute('aria-live', 'polite');
    donationForm.appendChild(formFeedback);

    // Ensure all inputs have proper labels
    const inputs = donationForm.querySelectorAll('input');
    inputs.forEach(input => {
      if (!input.id) {
        input.id = `input-${Math.random().toString(36).substr(2, 9)}`;
      }
      
      // Create label if not exists
      if (!document.querySelector(`label[for="${input.id}"]`)) {
        const label = document.createElement('label');
        label.setAttribute('for', input.id);
        label.textContent = input.name.replace(/^\w/, c => c.toUpperCase());
        input.parentNode.insertBefore(label, input);
      }

      // Add ARIA attributes
      input.setAttribute('aria-describedby', 'form-feedback');
    });

    // Form Submission with Validation
    donationForm.addEventListener('submit', handleDonationSubmit);
  }
}

function handleDonationSubmit(e) {
  e.preventDefault();
  const formFeedback = document.getElementById('form-feedback');
  const inputs = e.target.querySelectorAll('input');
  let isValid = true;

  // Simple client-side validation
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.setAttribute('aria-invalid', 'true');
      isValid = false;
    } else {
      input.setAttribute('aria-invalid', 'false');
    }
  });

  if (isValid) {
    formFeedback.textContent = 'Thank you for your donation!';
    formFeedback.setAttribute('role', 'alert');
    e.target.reset();
  } else {
    formFeedback.textContent = 'Please fill out all fields.';
    formFeedback.setAttribute('role', 'alert');
  }
}

// Global Keyboard Navigation Enhancements
function initKeyboardNavigation() {
  // Ensure all links and buttons are keyboard accessible
  const interactiveElements = document.querySelectorAll('a, button, [tabindex="0"]');
  
  interactiveElements.forEach(el => {
    // Ensure all interactive elements can be focused
    if (!el.getAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }

    // Add keyboard support for spacebar and enter
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });
}

// Focus Management for Modal-like Interactions
function initFocusManagement() {
  // Trap focus within modal or dialog if implemented
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        // Shift + Tab
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } 
        // Tab
        else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  // Example: If you have a modal, you would call:
  // const modal = document.querySelector('.modal');
  // if (modal) trapFocus(modal);
}

// Error Handling and Logging
window.addEventListener('error', (event) => {
  console.error('Unhandled error:', event.error);
  // Optionally send error to monitoring service
});