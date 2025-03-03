/**
 * Mobile Enhancements for Portfolio Website
 * This script specifically handles mobile-specific adjustments and interactions
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a mobile device
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isSmallMobile = window.matchMedia('(max-width: 480px)').matches;
    
    // Apply mobile-specific enhancements
    if (isMobile) {
      initMobileEnhancements();
    }
    
    // Update on resize (e.g. orientation change)
    window.addEventListener('resize', function() {
      const newIsMobile = window.matchMedia('(max-width: 768px)').matches;
      const newIsSmallMobile = window.matchMedia('(max-width: 480px)').matches;
      
      // Only run if mobile state changed
      if (newIsMobile !== isMobile || newIsSmallMobile !== isSmallMobile) {
        initMobileEnhancements();
      }
    });
    
    function initMobileEnhancements() {
      // Adjust side navigation position and styling
      adjustSideNavigation();
      
      // Ensure page content has padding for side navigation
      adjustPageContentPadding();
      
      // Enhance touch interactions
      enhanceTouchInteractions();
      
      // Optimize page transitions for mobile
      optimizePageTransitions();
      
      // Fix iframe content handling for mobile
      fixIframeHandlingForMobile();
    }
    
    function adjustSideNavigation() {
      const navigation = document.querySelector('.navigation');
      if (!navigation) return;
      
      // Adjust positioning based on screen size
      if (isSmallMobile) {
        navigation.style.padding = '6px';
        navigation.style.borderRadius = '14px';
        
        // Make nav buttons smaller on small mobile
        const buttons = navigation.querySelectorAll('.nav-button');
        buttons.forEach(button => {
          button.style.width = '32px';
          button.style.height = '32px';
        });
      } else if (isMobile) {
        navigation.style.padding = '8px';
        navigation.style.borderRadius = '16px';
        
        // Make nav buttons slightly smaller on mobile
        const buttons = navigation.querySelectorAll('.nav-button');
        buttons.forEach(button => {
          button.style.width = '36px';
          button.style.height = '36px';
        });
      }
    }
    
    function adjustPageContentPadding() {
      // Add right padding to all iframes to account for side navigation
      const iframes = document.querySelectorAll('iframe');
      
      iframes.forEach(iframe => {
        iframe.addEventListener('load', function() {
          try {
            const iframeBody = iframe.contentDocument.body;
            if (iframeBody) {
              if (isSmallMobile) {
                iframeBody.style.paddingRight = '35px';
              } else if (isMobile) {
                iframeBody.style.paddingRight = '40px';
              } else {
                iframeBody.style.paddingRight = '50px';
              }
            }
          } catch(e) {
            console.error('Could not adjust iframe padding:', e);
          }
        });
      });
    }
    
    function enhanceTouchInteractions() {
      // Ensure all clickable elements have appropriate touch targets
      const clickableElements = document.querySelectorAll('a, button, .nav-button, .hamburger-menu, .page-dot');
      
      clickableElements.forEach(el => {
        // Add touch feedback
        el.addEventListener('touchstart', function() {
          this.style.transform = 'scale(0.96)';
        }, { passive: true });
        
        el.addEventListener('touchend', function() {
          this.style.transform = '';
        }, { passive: true });
      });
      
      // Improve swipe navigation sensitivity
      let touchStartY, touchEndY;
      const swipeThreshold = isSmallMobile ? 40 : 50; // Lower threshold for small screens
      
      document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });
      
      document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        const touchDiff = touchStartY - touchEndY;
        
        // If currently on a page with its own scrolling, don't navigate unless at top/bottom
        const activePage = document.querySelector('.page.active');
        if (activePage) {
          const iframe = activePage.querySelector('iframe');
          if (iframe && iframe.contentDocument) {
            const iframeBody = iframe.contentDocument.body;
            if (iframeBody) {
              const scrollTop = iframeBody.scrollTop;
              const scrollHeight = iframeBody.scrollHeight;
              const clientHeight = iframeBody.clientHeight;
              
              // If not at top/bottom of iframe content, don't navigate
              if (touchDiff > 0 && scrollTop + clientHeight < scrollHeight) return;
              if (touchDiff < 0 && scrollTop > 0) return;
            }
          }
        }
        
        // Handle page navigation
        if (Math.abs(touchDiff) > swipeThreshold) {
          if (touchDiff > 0 && window.currentPageIndex < window.totalPages - 1) {
            // Swipe up - go to next page
            window.loadPage(window.currentPageIndex + 1);
          } else if (touchDiff < 0 && window.currentPageIndex > 0) {
            // Swipe down - go to previous page
            window.loadPage(window.currentPageIndex - 1);
          }
        }
      }, { passive: true });
    }
    
    function optimizePageTransitions() {
      // Reduce transition times for mobile for snappier feel
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        @media (max-width: 768px) {
          .page {
            transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
          }
        }
      `;
      document.head.appendChild(styleElement);
    }
    
    function fixIframeHandlingForMobile() {
      // Fix potential issues with iframe content on mobile
      const iframes = document.querySelectorAll('iframe');
      
      iframes.forEach(iframe => {
        iframe.addEventListener('load', function() {
          try {
            // Ensure links in iframes don't break out of iframe
            const iframeLinks = iframe.contentDocument.querySelectorAll('a');
            iframeLinks.forEach(link => {
              if (link.getAttribute('target') === '_blank') return;
              
              link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // If it's a navigation link from menu.js, let it handle it
                if (link.hasAttribute('data-index')) return;
                
                // Otherwise, prevent navigation or handle it appropriately
                console.log('Link clicked in iframe:', link.href);
              });
            });
            
            // Ensure touch events in iframes work properly
            const iframeBody = iframe.contentDocument.body;
            if (iframeBody) {
              // Fix for some mobile browser issues with iframe touch events
              iframeBody.style.touchAction = 'auto';
            }
          } catch(e) {
            console.error('Could not adjust iframe for mobile:', e);
          }
        });
      });
    }
  });