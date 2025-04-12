// The JavaScript is minimal as most functionality is handled by CSS :has() selector
// This is included as a placeholder for future functionality

document.addEventListener('DOMContentLoaded', () => {
  // Could add an explode checkbox dynamically if needed
  /*
  const createExplodeControl = () => {
    const controls = document.createElement('div');
    controls.className = 'controls';
    
    const label = document.createElement('label');
    label.htmlFor = 'explode';
    label.textContent = 'Explode?';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'explode';
    
    controls.appendChild(label);
    controls.appendChild(checkbox);
    document.body.prepend(controls);
  }
  
  // Uncomment to add the explode control back
  // createExplodeControl();
  */
  
  // Add click handlers to social icons
  const socialIcons = document.querySelectorAll('.social-icon');
  socialIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      // Placeholder for social icon click handler
      if (!icon.href || icon.href === '#') {
        e.preventDefault();
        console.log(`Clicked on ${icon.getAttribute('aria-label')}`);
      }
    });
  });
});