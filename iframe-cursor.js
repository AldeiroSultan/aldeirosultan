document.addEventListener('DOMContentLoaded', function() {
    // Only apply custom cursor on devices with hover capability
    if (window.matchMedia("(hover: hover)").matches) {
      // Check if we're in an iframe
      const isIframe = window.self !== window.top;
      
      // Create cursor elements
      createCursorElements();
      
      // Add CSS if it doesn't exist already
      if (!document.querySelector('link[href$="custom-cursor.css"]')) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = isIframe ? '../../custom-cursor.css' : 'custom-cursor.css';
        document.head.appendChild(cssLink);
      }
      
      const cursor = document.querySelector('.custom-cursor');
      const cursorDot = document.querySelector('.cursor-dot');
      
      // Interactive elements that should trigger hover state
      const interactiveElements = 'a, button, .nav-button, .hamburger-menu, .page-dot, [role="button"], input[type="submit"], input[type="button"], input[type="reset"], .nav-menu a, [data-clickable="true"], .interactive';
      
      // Variables for cursor movement
      let mouseX = 0;
      let mouseY = 0;
      let cursorX = 0;
      let cursorY = 0;
      let dotX = 0;
      let dotY = 0;
      
      // Update mouse position on move
      document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });
      
      // Handle hover states
      document.addEventListener('mouseover', function(e) {
        if (e.target.matches(interactiveElements)) {
          cursor.classList.add('hover');
        }
      });
      
      document.addEventListener('mouseout', function(e) {
        if (e.target.matches(interactiveElements)) {
          cursor.classList.remove('hover');
        }
      });
      
      // Handle active state (click)
      document.addEventListener('mousedown', function() {
        cursor.classList.add('active');
      });
      
      document.addEventListener('mouseup', function() {
        cursor.classList.remove('active');
      });
      
      // Main cursor follows mouse with delay (smoother movement)
      function updateCursor() {
        // Smooth transition for main cursor
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        // Faster movement for dot
        dotX += (mouseX - dotX) * 0.4;
        dotY += (mouseY - dotY) * 0.4;
        
        if (cursor && cursorDot) {
          cursor.style.left = cursorX + 'px';
          cursor.style.top = cursorY + 'px';
          
          cursorDot.style.left = dotX + 'px';
          cursorDot.style.top = dotY + 'px';
        }
        
        requestAnimationFrame(updateCursor);
      }
      
      // Start cursor animation
      updateCursor();
      
      // Handle cursor visibility when leaving/entering window
      document.addEventListener('mouseleave', function() {
        cursor.style.opacity = 0;
        cursorDot.style.opacity = 0;
      });
      
      document.addEventListener('mouseenter', function() {
        cursor.style.opacity = 1;
        cursorDot.style.opacity = 1;
      });
      
      // Special handling for iframe context
      if (isIframe) {
        // Message parent window for mouse position when cursor leaves iframe
        document.addEventListener('mouseleave', function() {
          window.parent.postMessage({
            action: 'iframeCursorLeave'
          }, '*');
        });
  
        // Update cursor position when window scrolls
        window.addEventListener('scroll', function() {
          mouseX = cursorX;
          mouseY = cursorY;
        });
      }
    }
    
    function createCursorElements() {
      // Only create if they don't already exist
      if (!document.querySelector('.custom-cursor')) {
        const cursorElement = document.createElement('div');
        cursorElement.className = 'custom-cursor';
        document.body.appendChild(cursorElement);
      }
      
      if (!document.querySelector('.cursor-dot')) {
        const cursorDotElement = document.createElement('div');
        cursorDotElement.className = 'cursor-dot';
        document.body.appendChild(cursorDotElement);
      }
    }
  });