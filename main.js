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
    
    // Page transition functions
    function updatePageIndicator() {
      document.querySelector('.current-page').textContent = currentPageIndex + 1;
      document.querySelector('.total-pages').textContent = totalPages;
      
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
    }
    
    function activatePage(pageIndex) {
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
      
      // Update navigation button states
      updateNavigationButtons();
      
      // Update active dot
      updateActiveDot();
    }
    
    function updateNavigationButtons() {
      // Disable prev button if on first page
      const prevButton = document.querySelector('.nav-button.prev');
      prevButton.disabled = currentPageIndex === 0;
      prevButton.classList.toggle('disabled', currentPageIndex === 0);
      
      // Disable next button if on last page
      const nextButton = document.querySelector('.nav-button.next');
      nextButton.disabled = currentPageIndex === totalPages - 1;
      nextButton.classList.toggle('disabled', currentPageIndex === totalPages - 1);
    }
    
    // Create page dots for direct navigation
    function createPageDots() {
      const pageDotsContainer = document.createElement('div');
      pageDotsContainer.className = 'page-dots';
      
      pages.forEach((page, index) => {
        const dot = document.createElement('button');
        dot.className = 'page-dot';
        dot.setAttribute('aria-label', `Go to ${page.title} page`);
        dot.dataset.pageIndex = index;
        
        dot.addEventListener('click', () => {
          if (!isTransitioning && currentPageIndex !== index) {
            loadPage(index);
          }
        });
        
        pageDotsContainer.appendChild(dot);
      });
      
      document.querySelector('.navigation').appendChild(pageDotsContainer);
    }
    
    function updateActiveDot() {
      const dots = document.querySelectorAll('.page-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentPageIndex);
      });
    }
    
    // Navigation event listeners
    function setupEventListeners() {
      // Button navigation
      document.querySelector('.nav-button.prev').addEventListener('click', function() {
        if (currentPageIndex > 0 && !isTransitioning) {
          loadPage(currentPageIndex - 1);
        }
      });
      
      document.querySelector('.nav-button.next').addEventListener('click', function() {
        if (currentPageIndex < totalPages - 1 && !isTransitioning) {
          loadPage(currentPageIndex + 1);
        }
      });
      
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
      document.getElementById('cover').classList.add('active');
      
      createPageDots();
      setupEventListeners();
      updatePageIndicator();
      updateNavigationButtons();
      updateActiveDot();
      
      // Load the first page immediately with a higher priority
      const coverPage = document.getElementById('cover');
      if (!coverPage.dataset.loaded) {
        // If not loaded yet, load it with high priority
        loadPageContent(0, false).then(() => {
          // Make sure the first page stays active after loading
          document.getElementById('cover').classList.add('active');
          // Only after first page is loaded, preload the others
          setTimeout(preloadPages, 500);
        });
      } else {
        // If already loaded somehow, just ensure it's active
        activatePage(0);
        // Preload the other pages
        setTimeout(preloadPages, 500);
      }
    }
    
    // Start the app
    init();
  });