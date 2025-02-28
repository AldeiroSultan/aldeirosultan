document.addEventListener('DOMContentLoaded', function() {
  // Check if we're in an iframe
  const isIframe = window.self !== window.top;
  
  // Load GSAP library if not already loaded
  if (typeof gsap === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = initMenu;
    document.head.appendChild(script);
  } else {
    initMenu();
  }
  
  function initMenu() {
    // Create menu elements if they don't exist
    createMenuElements();
    
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const menuItems = document.querySelectorAll('.nav-menu a');
    
    // Toggle menu on hamburger click
    hamburgerMenu.addEventListener('click', function() {
      const isOpen = hamburgerMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && hamburgerMenu.classList.contains('open')) {
        closeMenu();
      }
    });
    
    // Handle menu item clicks
    menuItems.forEach(function(item) {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the page index
        const pageIndex = parseInt(this.getAttribute('data-index'));
        
        // Set active class
        menuItems.forEach(el => el.classList.remove('active'));
        this.classList.add('active');
        
        // Close menu with delay
        setTimeout(function() {
          closeMenu();
          
          // If in iframe, message parent window to change page
          if (isIframe) {
            window.parent.postMessage({
              action: 'changePage',
              pageIndex: pageIndex
            }, '*');
          }
        }, 400);
      });
    });
    
    // Functions for opening and closing menu
    function openMenu() {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
      hamburgerMenu.classList.add('open');
      navMenu.classList.add('open');
      
      // GSAP animations for enhanced effect (if GSAP is available)
      if (gsap) {
        // Create a timeline for more control
        const tl = gsap.timeline();
        
        // Fade in the menu
        tl.to(navMenu, {
          opacity: 1,
          visibility: 'visible',
          duration: 0.4,
          ease: "power3.out"
        });
        
        // Scale effect for menu items
        tl.fromTo(menuItems, 
          { x: -20, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            stagger: 0.05, 
            duration: 0.5,
            ease: "power2.out"
          },
          "-=0.2" // Overlap with previous animation
        );
      }
    }
    
    function closeMenu() {
      hamburgerMenu.classList.remove('open');
      
      // GSAP animations for smooth exit
      if (gsap) {
        const tl = gsap.timeline({
          onComplete: function() {
            navMenu.classList.remove('open');
            // Make sure to restore scrolling and interactivity
            document.body.style.overflow = '';
          }
        });
        
        tl.to(menuItems, {
          opacity: 0,
          y: -30,
          stagger: 0.05,
          duration: 0.3,
          ease: "power2.in"
        });
        
        tl.to(navMenu, {
          opacity: 0,
          duration: 0.5,
          ease: "power3.in",
          onComplete: function() {
            // Ensure visibility is set to hidden to restore interactivity
            navMenu.style.visibility = 'hidden';
          }
        }, "-=0.2");
      } else {
        navMenu.classList.remove('open');
        navMenu.style.visibility = 'hidden';
        document.body.style.overflow = '';
      }
    }
    
    // Add an explicit clean-up function to handle potential issues
    function resetMenuState() {
      // Force reset the menu state completely
      hamburgerMenu.classList.remove('open');
      navMenu.classList.remove('open');
      navMenu.style.visibility = 'hidden';
      navMenu.style.opacity = '0';
      navMenu.style.pointerEvents = 'none';
      document.body.style.overflow = '';
      
      // Reset any GSAP animations that might be in progress
      if (gsap && gsap.killTweensOf) {
        gsap.killTweensOf(navMenu);
        gsap.killTweensOf(menuItems);
      }
    }
    
    // Add a double-click handler to hamburger as emergency reset
    hamburgerMenu.addEventListener('dblclick', resetMenuState);
    
    // Also listen for the visibilitychange event to reset menu when tab changes
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden') {
        resetMenuState();
      }
    });
    
    // Highlight current page in menu
    highlightActivePage();
    
    function highlightActivePage() {
      // If in iframe, get current page from pathname
      if (isIframe) {
        // Extract the page name from URL path
        const pathname = window.location.pathname;
        const pageName = pathname.split('/').filter(Boolean).pop();
        
        if (pageName) {
          menuItems.forEach(function(item) {
            const itemPage = item.getAttribute('data-page');
            if (pageName.includes(itemPage)) {
              item.classList.add('active');
            }
          });
        }
      }
    }
  }
  
  function createMenuElements() {
    // Only create elements if they don't already exist
    if (!document.querySelector('.hamburger-menu')) {
      // Create hamburger button
      const hamburger = document.createElement('div');
      hamburger.className = 'hamburger-menu';
      hamburger.innerHTML = `
        <div class="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;
      document.body.appendChild(hamburger);
    }
    
    if (!document.querySelector('.nav-menu')) {
      // Create navigation menu
      const nav = document.createElement('div');
      nav.className = 'nav-menu';
      nav.innerHTML = `
        <ul>
          <li><a href="#" data-page="cover" data-index="0">Cover</a></li>
          <li><a href="#" data-page="about" data-index="1">About</a></li>
          <li><a href="#" data-page="intro" data-index="2">Intro</a></li>
          <li><a href="#" data-page="experience" data-index="3">Experience</a></li>
          <li><a href="#" data-page="projects" data-index="4">Projects</a></li>
          <li><a href="#" data-page="contact" data-index="5">Contact</a></li>
        </ul>
      `;
      document.body.appendChild(nav);
    }
    
    // Add menu CSS if in iframe
    if (isIframe && !document.querySelector('link[href$="menu.css"]')) {
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = '../../menu.css';
      document.head.appendChild(cssLink);
    }
  }
});