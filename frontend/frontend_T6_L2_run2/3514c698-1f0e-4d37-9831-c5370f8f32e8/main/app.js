// Orcheeos Accessibility-Enhanced JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Keyboard Navigation Enhancements
  initKeyboardNavigation();
  
  // Form Validation
  initFormValidation();
  
  // Mobile Menu Accessibility
  initMobileMenuAccessibility();
});

// Keyboard Navigation Management
function initKeyboardNavigation() {
  // Skip Link Functionality
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          e.preventDefault();
        }
      }
    });
  }

  // Smooth Scrolling with Keyboard Support
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('keydown', (e) => {
      // Allow Enter and Space to trigger smooth scroll
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Improve focus management
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
        }
      }
    });
  });

  // Trap Focus in Modal/Dropdown Patterns (if applicable)
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        // Shift + Tab on first element
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
        // Tab on last element
        else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  }
}

// Form Validation with Keyboard and Screen Reader Support
function initFormValidation() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // Add aria-invalid and error messaging
      input.addEventListener('invalid', (e) => {
        e.preventDefault();
        input.setAttribute('aria-invalid', 'true');
        
        // Create or update error message
        let errorId = `${input.id}-error`;
        let errorElement = document.getElementById(errorId);
        
        if (!errorElement) {
          errorElement = document.createElement('div');
          errorElement.id = errorId;
          errorElement.className = 'error-message';
          errorElement.setAttribute('role', 'alert');
          input.parentNode.insertBefore(errorElement, input.nextSibling);
        }
        
        errorElement.textContent = input.validationMessage;
        input.setAttribute('aria-describedby', errorId);
      });

      // Clear error states on input
      input.addEventListener('input', () => {
        input.removeAttribute('aria-invalid');
        const errorId = `${input.id}-error`;
        const errorElement = document.getElementById(errorId);
        
        if (errorElement) {
          errorElement.textContent = '';
          input.removeAttribute('aria-describedby');
        }
      });
    });

    // Enhanced Form Submission with Validation
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        
        // Focus on first invalid input
        const firstInvalidInput = form.querySelector(':invalid');
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
      }
    });
  });
}

// Mobile Menu Accessibility
function initMobileMenuAccessibility() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.nav-links');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-controls', 'mobile-menu');
    mobileMenu.id = 'mobile-menu';

    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('active');
    });

    // Keyboard support for mobile menu toggle
    mobileMenuToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        mobileMenuToggle.click();
        e.preventDefault();
      }
    });
  }
}

// Utility: Safe Focus Management
function safelyFocusElement(element) {
  if (element && typeof element.focus === 'function') {
    element.setAttribute('tabindex', '-1');
    element.focus();
  }
}