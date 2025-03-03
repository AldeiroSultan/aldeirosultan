document.addEventListener('DOMContentLoaded', function() {
  // Simple menu functionality without GSAP dependency
  
  // Get menu elements
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navMenu = document.querySelector('.nav-menu');
  const menuItems = document.querySelectorAll('.nav-menu a');
  
  // Toggle menu on hamburger click
  hamburgerMenu.addEventListener('click', function() {
    hamburgerMenu.classList.toggle('open');
    navMenu.classList.toggle('open');
    
    if (hamburgerMenu.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
      navMenu.style.visibility = 'visible';
      navMenu.style.opacity = '1';
      navMenu.style.pointerEvents = 'auto';
      
      // Show menu items with staggered delay
      menuItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
      });
    } else {
      document.body.style.overflow = '';
      
      // Hide menu items first
      menuItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
      });
      
      // Then hide the menu after a delay
      setTimeout(() => {
        navMenu.style.visibility = 'hidden';
        navMenu.style.opacity = '0';
        navMenu.style.pointerEvents = 'none';
      }, 300);
    }
  });
  
  // Close menu on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && hamburgerMenu.classList.contains('open')) {
      hamburgerMenu.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
      
      menuItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
      });
      
      setTimeout(() => {
        navMenu.style.visibility = 'hidden';
        navMenu.style.opacity = '0';
        navMenu.style.pointerEvents = 'none';
      }, 300);
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
      
      // Close menu
      hamburgerMenu.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
      
      menuItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
      });
      
      setTimeout(() => {
        navMenu.style.visibility = 'hidden';
        navMenu.style.opacity = '0';
        navMenu.style.pointerEvents = 'none';
        
        // Navigate to the page after menu is closed
        if (typeof window.loadPage === 'function') {
          window.loadPage(pageIndex);
        }
      }, 300);
    });
  });
});