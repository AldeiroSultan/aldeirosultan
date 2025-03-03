/**
 * Full Page Scroll Helper
 * This script enhances the single-page scrolling behavior
 */

(function() {
    // Run when DOM content is loaded
    document.addEventListener('DOMContentLoaded', function() {
      // Add necessary styling for smooth scrolling
      applyScrollStyles();
      
      // Initialize after a short delay to ensure all content is processed
      setTimeout(initFullPageScroll, 500);
    });
    
    function applyScrollStyles() {
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        html, body {
          scroll-behavior: smooth;
        }
        
        .page-container {
          scroll-snap-type: y mandatory;
          overflow-y: scroll;
          height: 100vh;
        }
        
        .page {
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }
        
        @media (max-width: 768px) {
          .page-container {
            scroll-snap-type: y proximity;
          }
        }
      `;
      document.head.appendChild(styleElement);
    }
    
    function initFullPageScroll() {
      // Set up intersection observer to detect which page is visible
      setupPageObserver();
      
      // Add wheel event optimization
      optimizeWheelEvents();
      
      // Make sure scrolling works inside iframes
      handleIframeScrolling();
      
      // Set up hash-based navigation
      setupHashNavigation();
    }
    
    function setupPageObserver() {
      // Create intersection observer to track visible pages
      const options = {
        root: null, // Use viewport as root
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the page is visible
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Get the page index from data attribute
            const pageIndex = parseInt(entry.target.dataset.pageIndex, 10);
            
            // Update URL hash without triggering scroll
            const pageId = entry.target.id;
            if (pageId && window.location.hash !== `#${pageId}`) {
              history.replaceState(null, null, `#${pageId}`);
            }
            
            // If we have the global loadPage function, update UI indicators
            if (typeof window.loadPage === 'function' && !window.isTransitioning && !window.isScrolling) {
              // Update navigation indicators without scrolling
              const event = new CustomEvent('pageVisible', { 
                detail: { pageIndex, pageId } 
              });
              window.dispatchEvent(event);
            }
          }
        });
      }, options);
      
      // Observe all pages
      document.querySelectorAll('.page').forEach(page => {
        observer.observe(page);
      });
      
      // Listen for the custom page visible event
      window.addEventListener('pageVisible', function(e) {
        // Update UI without scrolling
        const pageIndex = e.detail.pageIndex;
        updatePageIndicators(pageIndex);
      });
    }
    
    function updatePageIndicators(pageIndex) {
      // Update page dots
      document.querySelectorAll('.page-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === pageIndex);
      });
      
      // Update page indicator text
      const currentPageIndicator = document.querySelector('.current-page');
      if (currentPageIndicator) {
        currentPageIndicator.textContent = pageIndex + 1;
      }
      
      // Update navigation buttons
      const prevButton = document.querySelector('.nav-button.prev');
      const nextButton = document.querySelector('.nav-button.next');
      const totalPages = document.querySelectorAll('.page').length;
      
      if (prevButton) {
        prevButton.disabled = pageIndex === 0;
        prevButton.classList.toggle('disabled', pageIndex === 0);
      }
      
      if (nextButton) {
        nextButton.disabled = pageIndex === totalPages - 1;
        nextButton.classList.toggle('disabled', pageIndex === totalPages - 1);
      }
    }
    
    function optimizeWheelEvents() {
      // Prevent rapid wheel events from causing janky scrolling
      let isWheeling = false;
      let wheelTimeout = null;
      
      window.addEventListener('wheel', function(e) {
        if (isWheeling) return;
        
        // Check if we're already at a snap point
        const container = document.querySelector('.page-container');
        const scrollY = container.scrollTop;
        const viewportHeight = window.innerHeight;
        
        // Only prevent default if we're at a snap point
        if (scrollY % viewportHeight < 10 || scrollY % viewportHeight > viewportHeight - 10) {
          isWheeling = true;
          
          // Let the native scrolling handle it, but prevent rapid repeated scrolls
          if (wheelTimeout) clearTimeout(wheelTimeout);
          
          wheelTimeout = setTimeout(() => {
            isWheeling = false;
          }, 200);
        }
      }, { passive: true });
    }
    
    function handleIframeScrolling() {
      // Make sure iframe content doesn't interfere with main page scrolling
      document.querySelectorAll('.page iframe').forEach(iframe => {
        iframe.addEventListener('load', function() {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            // Prevent wheel events in iframe from propagating to main window
            iframeDoc.addEventListener('wheel', function(e) {
              // Check if the iframe content is scrollable
              const scrollableElement = iframeDoc.documentElement;
              const isScrollable = scrollableElement.scrollHeight > scrollableElement.clientHeight;
              
              // If the iframe is not scrollable or at top/bottom boundary, allow parent to scroll
              const isAtTop = scrollableElement.scrollTop === 0;
              const isAtBottom = scrollableElement.scrollHeight - scrollableElement.scrollTop <= scrollableElement.clientHeight + 1;
              
              if (!isScrollable || (isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                // Allow the event to bubble up to parent
                return;
              }
              
              // Otherwise, prevent the event from bubbling and scrolling the parent
              e.stopPropagation();
            }, { passive: true });
          } catch (e) {
            console.warn('Could not add scroll handling to iframe', e);
          }
        });
      });
    }
    
    function setupHashNavigation() {
      // Check for hash in URL on page load
      if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetPage = document.getElementById(targetId);
        
        if (targetPage) {
          // Scroll to the target page after a short delay
          setTimeout(() => {
            targetPage.scrollIntoView({ behavior: 'smooth' });
          }, 500);
        }
      }
      
      // Handle hash changes
      window.addEventListener('hashchange', function() {
        if (window.location.hash) {
          const targetId = window.location.hash.substring(1);
          const targetPage = document.getElementById(targetId);
          
          if (targetPage) {
            targetPage.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
  })();