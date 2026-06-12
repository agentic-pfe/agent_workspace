document.addEventListener('DOMContentLoaded', () => {
  // Select all navigation links that point to internal sections
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Prevent default anchor behavior
      e.preventDefault();

      // Get the target section ID from the href attribute
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Smooth scroll to the target section
        // Use offsetTop to get precise vertical position
        // Subtract a small offset (e.g., navbar height) if needed
        const offset = 80; // Adjust this value based on your navbar height
        window.scrollTo({
          top: targetSection.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    });
  });
});