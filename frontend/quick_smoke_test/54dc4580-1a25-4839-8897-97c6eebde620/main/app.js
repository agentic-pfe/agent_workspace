'use strict';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Hello, World!');

  const heading = document.querySelector('h1');
  if (heading) {
    console.log('Heading text:', heading.textContent);
  }
});
