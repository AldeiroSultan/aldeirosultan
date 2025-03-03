document.addEventListener('DOMContentLoaded', function() {
  // Configuration
  const pages = [
    { id: 'cover', title: 'Cover' },
    { id: 'about', title: 'About' },
    { id: 'intro', title: 'Intro' },
    { id: 'experience', title: 'Experience' },
    { id: 'projects', title: 'Projects' },
    { id: 'contact', title: 'Contact' }
  ];
  
  let currentPageIndex = 0;
  const totalPages = pages.length;
  let isTransitioning = false; // Flag to prevent multiple transitions at once
  
  // Make these values available to other scripts
  window.currentPageIndex = currentPageIndex;
  window.totalPages = totalPages;
  
  // Page transition functions
  function updatePageIndicator() {
    // Update document title based on current page
    document.title = `${pages[currentPageIndex].title} | Portfolio`;
  }
  
  // Preload all pages in the background
  function preloadPages() {
    pages.forEach((page, index) => {
      if (index !== currentPageIndex) { // Skip current page as it's already loaded
        setTimeout(() => {
          const pageElement = document.getElementById(page.id);
          if (!pageElement.dataset.loaded) {
            loadPageContent(index, false);
          }
        }, index * 300); // Stagger loading to not block the main thread
      }
    });
  }
  
  function loadPageContent(pageIndex, activate = true) {
    const page = pages[pageIndex];
    const pageElement = document.getElementById(page.id);
    
    return new Promise((resolve, reject) => {
      // Create an iframe to isolate CSS and JS
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden'; // Hide scrollbars
      
      // Set iframe source to the HTML page
      iframe.src = `pages/${page.id}/${page.id}.html`;
      pageElement.appendChild(iframe);
      
      // Mark as loaded
      pageElement.dataset.loaded = 'true';
      
      // Handle iframe load event
      iframe.onload = () => {
        if (activate) {
          activatePage(pageIndex);
        }
        resolve();
      };
      
      iframe.onerror = (error) => {
        console.error(`Error loading page ${page.id}:`, error);
        reject(error);
      };
    });
  }
  
  function loadPage(pageIndex) {
    // Don't do anything if we're already transitioning or trying to go to current page
    if (isTransitioning || pageIndex === currentPageIndex) {
      return;
    }
    
    isTransitioning = true;
    
    const page = pages[pageIndex];
    const pageElement = document.getElementById(page.id);
    
    // If page content hasn't been loaded yet
    if (!pageElement.dataset.loaded) {
      // Show loading indicator if needed
      loadPageContent(pageIndex, true)
        .then(() => {
          isTransitioning = false;
        })
        .catch(() => {
          isTransitioning = false;
        });
    } else {
      // If already loaded, just activate it
      activatePage(pageIndex);
      // Wait for transition to complete before allowing another
      setTimeout(() => {
        isTransitioning = false;
      }, 800); // Match this to your CSS transition time
    }
    
    // Update window property for other scripts
    window.currentPageIndex = pageIndex;
  }
  
  // Store the original activatePage function to be able to override it
  function originalActivatePageFn(pageIndex) {
    // Get direction of transition (up or down)
    const isMovingForward = pageIndex > currentPageIndex;
    
    // Get all page elements
    const pageElements = document.querySelectorAll('.page');
    
    // Set up transition classes based on direction
    pageElements.forEach(element => {
      const elementIndex = Array.from(pageElements).indexOf(element);
                          
      // Clear all transition classes first
      element.classList.remove('active', 'prev-active', 'next-waiting');
      
      if (elementIndex === pageIndex) {
        // This is the target page we're moving to
        element.classList.add('active');
      } 
      else if (elementIndex === currentPageIndex) {
        // This is the page we're moving from
        element.classList.add(isMovingForward ? 'prev-active' : 'next-waiting');
      }
    });
    
    // Update the page indicator
    updatePageIndicator();
    
    // Update current page index
    currentPageIndex = pageIndex;
    window.currentPageIndex = pageIndex; // Update window property
    
    // Update navigation button states
    updateNavigationButtons();
  }
  
  // Define activatePage and store the original function
  let activatePage = function(pageIndex) {
    // Call the original function
    originalActivatePageFn(pageIndex);
    
    // Dispatch event that page has changed
    const event = new CustomEvent('pageChanged', { 
      detail: { 
        pageIndex: pageIndex,
        pageId: pages[pageIndex].id 
      } 
    });
    window.dispatchEvent(event);
  };
  
  function updateNavigationButtons() {
    // Disable prev button if on first page
    const prevButton = document.querySelector('.nav-button.prev');
    if (prevButton) {
      prevButton.disabled = currentPageIndex === 0;
      prevButton.classList.toggle('disabled', currentPageIndex === 0);
    }
    
    // Disable next button if on last page
    const nextButton = document.querySelector('.nav-button.next');
    if (nextButton) {
      nextButton.disabled = currentPageIndex === totalPages - 1;
      nextButton.classList.toggle('disabled', currentPageIndex === totalPages - 1);
    }
  }
  
  // Modified createPageDots to not create dots
  function createPageDots() {
    // We're intentionally not creating dots
    console.log('Page dots creation disabled');
    
    // Instead, make sure up/down arrows work properly
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');
    
    if (prevButton) {
      prevButton.addEventListener('click', function() {
        if (currentPageIndex > 0 && !isTransitioning) {
          loadPage(currentPageIndex - 1);
        }
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', function() {
        if (currentPageIndex < totalPages - 1 && !isTransitioning) {
          loadPage(currentPageIndex + 1);
        }
      });
    }
  }
  
  // Modified updateActiveDot to do nothing
  function updateActiveDot() {
    // No dots to update
  }
  
  // Navigation event listeners
  function setupEventListeners() {
    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
      if (isTransitioning) return;
      
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        if (currentPageIndex > 0) {
          loadPage(currentPageIndex - 1);
        }
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        if (currentPageIndex < totalPages - 1) {
          loadPage(currentPageIndex + 1);
        }
      }
    });
    
    // Mouse wheel navigation with debounce
    let wheelTimer = null;
    document.addEventListener('wheel', function(event) {
      if (isTransitioning) return;
      
      if (wheelTimer !== null) {
        clearTimeout(wheelTimer);
      }
      
      wheelTimer = setTimeout(() => {
        if (event.deltaY > 0 && currentPageIndex < totalPages - 1) {
          // Scrolling down
          loadPage(currentPageIndex + 1);
        } else if (event.deltaY < 0 && currentPageIndex > 0) {
          // Scrolling up
          loadPage(currentPageIndex - 1);
        }
      }, 200); // Adjust debounce time as needed
    }, { passive: true });
    
    // Touch navigation for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
      if (isTransitioning) return;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
      if (isTransitioning) return;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
    
    // Listen for messages from iframes (for menu navigation from iframe pages)
    window.addEventListener('message', function(event) {
      if (event.data && event.data.action === 'changePage') {
        const pageIndex = event.data.pageIndex;
        if (pageIndex >= 0 && pageIndex < totalPages && !isTransitioning) {
          loadPage(pageIndex);
        }
      }
      
      // Handle messages from iframes for cursor coordination
      if (event.data && event.data.action === 'iframeCursorLeave') {
        // Show cursor in main window when it leaves an iframe
        const cursor = document.querySelector('.custom-cursor');
        const cursorDot = document.querySelector('.cursor-dot');
        
        if (cursor && cursorDot) {
          cursor.style.opacity = 1;
          cursorDot.style.opacity = 1;
        }
      }
    });
  }
  
  function handleSwipe() {
    const threshold = 50; // Minimum distance required for swipe
    if (touchStartY - touchEndY > threshold && currentPageIndex < totalPages - 1) {
      // Swipe up - go to next page
      loadPage(currentPageIndex + 1);
    } else if (touchEndY - touchStartY > threshold && currentPageIndex > 0) {
      // Swipe down - go to previous page
      loadPage(currentPageIndex - 1);
    }
  }
  
  // Initialize
  function init() {
    // First, make the cover page visible with "active" class before loading its content
    // This ensures it's visible immediately
    const coverPage = document.getElementById('cover');
    coverPage.classList.add('active');
    
    // Set up navigation
    createPageDots();
    setupEventListeners();
    updatePageIndicator();
    updateNavigationButtons();
    
    // Load the first page immediately with a higher priority
    if (!coverPage.dataset.loaded) {
      // If not loaded yet, load it with high priority
      loadPageContent(0, true).then(() => {
        // Make sure the first page stays active after loading
        coverPage.classList.add('active');
        // Only after first page is loaded, preload the others
        setTimeout(preloadPages, 500);
      });
    } else {
      // If already loaded somehow, just ensure it's active
      activatePage(0);
      // Preload the other pages
      setTimeout(preloadPages, 500);
    }
    
    // Double check cover page is visible after a short delay
    setTimeout(function() {
      if (!coverPage.classList.contains('active')) {
        coverPage.classList.add('active');
      }
    }, 1000);
    
    // Remove any page dots that might have been created
    setTimeout(function() {
      const pageDots = document.querySelector('.page-dots');
      if (pageDots) {
        pageDots.remove();
      }
    }, 500);
  }
  
  // Make loadPage function globally accessible for menu and other components
  window.loadPage = loadPage;
  
  // Start the app
  init();

  // Apply arrow animations
  function setupArrowAnimations() {
    const arrows = document.querySelectorAll('.nav-button');
    
    arrows.forEach(arrow => {
      const tail = arrow.querySelector('.arrow-tail');
      if (tail) {
        // Initial values for animation
        tail.style.strokeDasharray = '10';
        tail.style.strokeDashoffset = '10';
        tail.style.opacity = '0';
        
        // Hover animations
        arrow.addEventListener('mouseenter', function() {
          tail.style.transition = 'all 0.3s ease';
          tail.style.strokeDashoffset = '0';
          tail.style.opacity = '1';
        });
        
        arrow.addEventListener('mouseleave', function() {
          tail.style.transition = 'all 0.3s ease';
          tail.style.strokeDashoffset = '10';
          tail.style.opacity = '0';
        });
        
        // Click effect
        arrow.addEventListener('mousedown', function() {
          tail.style.strokeWidth = '2.5';
          
          setTimeout(() => {
            tail.style.strokeWidth = '2';
          }, 300);
        });
      }
    });
  }
  
  // Setup arrow animations after a small delay
  setTimeout(setupArrowAnimations, 1000);

  // Force font application
  function applyFonts() {
    // Create style element
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Migha-BoldExpandedCNTR';
        src: url('/fonts/Migha-BoldExpandedCNTR.otf') format('opentype');
      }
      h1, h2, h3, h4, h5, h6, strong, b, .nav-menu a {
        font-family: 'Migha-BoldExpandedCNTR', Arial, sans-serif !important;
      }
      body, p, span, div {
        font-family: 'Azeret Mono', monospace !important;
      }
    `;
    document.head.appendChild(style);
    
    // Apply to iframes
    document.querySelectorAll('iframe').forEach(iframe => {
      iframe.onload = function() {
        try {
          const iframeStyle = document.createElement('style');
          iframeStyle.textContent = style.textContent;
          iframe.contentDocument.head.appendChild(iframeStyle);
        } catch(e) {
          console.error('Could not apply fonts to iframe:', e);
        }
      };
    });
  }

  // Call the function after page load
  applyFonts();
});