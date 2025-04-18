// Split View Animation Script
document.addEventListener('DOMContentLoaded', function() {
  console.log('Split view script loaded');
  
  // Get the split view section
  const splitViewSection = document.getElementById('split-view-animation');
  
  if (!splitViewSection) {
    console.warn('Split view animation section not found');
    return;
  }
  
  // Function to check if an element is in the viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
      rect.bottom >= 0
    );
  }
  
  // Function to handle scroll and reveal animation
  function handleScroll() {
    if (isInViewport(splitViewSection) && !splitViewSection.classList.contains('visible')) {
      console.log('Revealing split view section');
      splitViewSection.classList.add('visible');
    }
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  
  // Initial check in case the element is already in view when the page loads
  setTimeout(() => {
    handleScroll();
  }, 500);
  
  // Add event listeners for boxes
  const boxes = document.querySelectorAll('.split-view-container .box');
  boxes.forEach(box => {
    box.addEventListener('mouseenter', () => {
      boxes.forEach(otherBox => {
        if (otherBox !== box) {
          otherBox.classList.add('not-hovered');
        }
      });
    });
    
    box.addEventListener('mouseleave', () => {
      boxes.forEach(otherBox => {
        otherBox.classList.remove('not-hovered');
      });
    });
  });
  
  // Add touch event handlers for mobile devices
  boxes.forEach(box => {
    box.addEventListener('touchstart', function(e) {
      // Prevent default only if we need to
      if (!box.classList.contains('touch-active')) {
        e.preventDefault();
      }
      
      // Reset all boxes first
      boxes.forEach(otherBox => {
        otherBox.classList.remove('touch-active');
        otherBox.classList.add('not-hovered');
      });
      
      // Activate the touched box
      this.classList.add('touch-active');
      this.classList.remove('not-hovered');
    });
  });
  
  // Update image src for production environment
  const leftBox = document.querySelector('.box-left');
  const rightBox = document.querySelector('.box-right');
  
  if (leftBox && rightBox) {
    // Check if window.matchMedia is supported
    if (window.matchMedia) {
      // Apply different background images based on screen size
      const mediaQuery = window.matchMedia('(max-width: 768px)');
      
      function updateBackgroundImages(mq) {
        if (mq.matches) {
          // Mobile images (smaller)
          leftBox.style.backgroundImage = 'url("https://picsum.photos/600/800?random=15")';
          rightBox.style.backgroundImage = 'url("https://picsum.photos/600/800?random=16")';
        } else {
          // Desktop images (larger)
          leftBox.style.backgroundImage = 'url("https://picsum.photos/800/1200?random=17")';
          rightBox.style.backgroundImage = 'url("https://picsum.photos/800/1200?random=18")';
        }
      }
      
      // Initial check
      updateBackgroundImages(mediaQuery);
      
      // Add listener for changes
      try {
        // Modern browsers
        mediaQuery.addEventListener('change', updateBackgroundImages);
      } catch (e) {
        // Fallback for older browsers
        mediaQuery.addListener(updateBackgroundImages);
      }
    } else {
      // Fallback for browsers that don't support matchMedia
      leftBox.style.backgroundImage = 'url("https://picsum.photos/800/1200?random=17")';
      rightBox.style.backgroundImage = 'url("https://picsum.photos/800/1200?random=18")';
    }
  }
  
  // Force visibility after a short delay in case scroll events don't trigger
  setTimeout(() => {
    if (!splitViewSection.classList.contains('visible')) {
      splitViewSection.classList.add('visible');
      console.log('Forced visibility on split view section');
    }
  }, 1500);
});