document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers to social icons
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
      icon.addEventListener('click', (e) => {
        // Prevent default behavior for anchor tags (since this is just a demo)
        if (!icon.href || icon.href === '#') {
          e.preventDefault();
          console.log(`Clicked on ${icon.getAttribute('aria-label')}`);
        }
      });
    });
    
    // Handle scroll behavior within the container
    const container = document.querySelector('.container');
    if (container) {
      container.addEventListener('scroll', () => {
        // Calculate scroll position
        const scrollPosition = container.scrollTop;
        const header = document.querySelector('.container > header');
        const main = document.querySelector('main');
        
        // Adjust opacity based on scroll
        if (header && scrollPosition > 50) {
          const opacity = 1 - Math.min(1, (scrollPosition - 50) / 200);
          header.style.opacity = opacity;
        }
        
        // Add smooth parallax effect to image
        const image = document.querySelector('section img');
        if (image) {
          const translateY = scrollPosition * 0.3;
          image.style.transform = `translateY(${translateY}px)`;
        }
      });
    }
    
    // Handle iframe environment specifics
    function handleIframeEnvironment() {
      // Check if we're in an iframe
      if (window.self !== window.top) {
        // Set initial clip
        setTimeout(() => {
          const main = document.querySelector('main');
          if (main) {
            // Ensure clip-path is applied correctly within iframe
            main.style.clipPath = 'inset(calc(var(--nav) + var(--font-size) + var(--padding)) 0 0 0)';
          }
        }, 100);
        
        // Add some interaction with the parent iframe if needed
        window.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'interact') {
            // Handle interaction messages from parent
            const slides = document.querySelector('.slides');
            if (slides && event.data.explode !== undefined) {
              document.documentElement.style.setProperty('--explode', event.data.explode);
            }
          }
        });
      }
    }
    
    handleIframeEnvironment();
    
    // Add touch and hover effects for social icons
    socialIcons.forEach(icon => {
      // Add touch ripple effect
      icon.addEventListener('touchstart', () => {
        icon.style.transform = 'scale(0.95) translateY(-2px)';
        setTimeout(() => {
          icon.style.transform = 'translateY(-3px)';
        }, 150);
      }, { passive: true });
      
      // Reset styles on touch end
      icon.addEventListener('touchend', () => {
        setTimeout(() => {
          icon.style.transform = '';
        }, 50);
      }, { passive: true });
    });
  });