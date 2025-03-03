/**
 * Arrow Navigation Animation
 * Enhances the arrow navigation with animations
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get navigation buttons
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');
    
    // Enhanced hover animations
    const addButtonAnimations = (button) => {
      if (!button) return;
      
      // Get the tail element
      const arrowTail = button.querySelector('.arrow-tail');
      if (!arrowTail) return;
      
      // Initial values for animation
      arrowTail.style.strokeDasharray = '10';
      arrowTail.style.strokeDashoffset = '10';
      arrowTail.style.opacity = '0';
      
      // Hover animations
      button.addEventListener('mouseenter', function() {
        // Animate the tail
        arrowTail.style.transition = 'all 0.3s ease';
        arrowTail.style.strokeDashoffset = '0';
        arrowTail.style.opacity = '1';
        
        // Add a subtle pulse effect
        button.style.animation = 'pulse 1.5s infinite';
      });
      
      button.addEventListener('mouseleave', function() {
        // Revert the tail
        arrowTail.style.transition = 'all 0.3s ease';
        arrowTail.style.strokeDashoffset = '10';
        arrowTail.style.opacity = '0';
        
        // Remove the pulse effect
        button.style.animation = '';
      });
      
      // Add click animation
      button.addEventListener('mousedown', function() {
        // Create a ripple effect
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        button.appendChild(ripple);
        
        // Position the ripple
        const rect = button.getBoundingClientRect();
        ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
        ripple.style.left = '0';
        ripple.style.top = '0';
        
        // Animated exaggerated arrow tail on click
        arrowTail.style.strokeDasharray = '20';
        arrowTail.style.strokeWidth = '2.5';
        
        // Remove ripple after animation
        setTimeout(() => {
          ripple.remove();
          arrowTail.style.strokeDasharray = '10';
          arrowTail.style.strokeWidth = '2';
        }, 500);
      });
    };
    
    // Add the animations to both buttons
    addButtonAnimations(prevButton);
    addButtonAnimations(nextButton);
    
    // Add styles for the ripple effect
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .ripple {
        position: absolute;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.5s ease-out;
        pointer-events: none;
      }
      
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Update disabled state based on current page
    function updateDisabledState() {
      const currentPageIndex = window.currentPageIndex || 0;
      const totalPages = window.totalPages || document.querySelectorAll('.page').length;
      
      if (prevButton) {
        prevButton.disabled = currentPageIndex === 0;
        prevButton.classList.toggle('disabled', currentPageIndex === 0);
      }
      
      if (nextButton) {
        nextButton.disabled = currentPageIndex === totalPages - 1;
        nextButton.classList.toggle('disabled', currentPageIndex === totalPages - 1);
      }
    }
    
    // Initial update
    updateDisabledState();
    
    // Listen for page changes
    window.addEventListener('pageChanged', function(event) {
      updateDisabledState();
    });
  });