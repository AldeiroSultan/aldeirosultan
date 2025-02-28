document.addEventListener('DOMContentLoaded', function() {
    // Core interaction code for the course list
    const list = document.querySelector('ul');
    const items = list.querySelectorAll('li');
  
    const setIndex = (event) => {
      const closest = event.target.closest('li');
      if (closest) {
        const index = [...items].indexOf(closest);
        const cols = new Array(list.children.length)
          .fill()
          .map((_, i) => {
            items[i].dataset.active = (index === i).toString();
            return index === i ? '10fr' : '1fr';
          })
          .join(' ');
        list.style.setProperty('grid-template-columns', cols);
      }
    }
  
    // Add reset function to return to original state when not hovering
    const resetAll = () => {
      if (!list.matches(':hover')) {
        // Reset to original state when mouse leaves the list
        items.forEach((item, i) => {
          if (i === 0) {
            item.dataset.active = 'true';
          } else {
            item.dataset.active = 'false';
          }
        });
        
        const defaultCols = new Array(list.children.length)
          .fill()
          .map((_, i) => i === 0 ? '10fr' : '1fr')
          .join(' ');
        
        list.style.setProperty('grid-template-columns', defaultCols);
      }
    }
  
    // Check if device supports hover
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    
    if (supportsHover) {
      // Mouse events for hover effects
      list.addEventListener('mouseover', setIndex);
      list.addEventListener('mouseleave', resetAll);
  
      // Focus events for keyboard navigation
      list.addEventListener('focus', setIndex, true);
  
      // Listen for mouse movement only while hovering on the list
      list.addEventListener('mousemove', setIndex);
    } else {
      // For touch devices, use click instead of hover
      items.forEach((item, index) => {
        item.addEventListener('click', () => {
          // Toggle active state
          const isActive = item.dataset.active === 'true';
          
          // First, set all items to inactive
          items.forEach(i => i.dataset.active = 'false');
          
          // Then toggle the clicked item
          if (!isActive) {
            item.dataset.active = 'true';
            
            // For mobile layout, don't adjust grid columns
            if (window.innerWidth > 768) {
              const cols = new Array(list.children.length)
                .fill()
                .map((_, i) => i === index ? '10fr' : '1fr')
                .join(' ');
              list.style.setProperty('grid-template-columns', cols);
            }
          } else {
            // If clicking an already active item, go back to default
            items[0].dataset.active = 'true';
            
            if (window.innerWidth > 768) {
              const defaultCols = new Array(list.children.length)
                .fill()
                .map((_, i) => i === 0 ? '10fr' : '1fr')
                .join(' ');
              list.style.setProperty('grid-template-columns', defaultCols);
            }
          }
        });
      });
    }
  
    const resync = () => {
      const w = Math.max(
        ...[...items].map((i) => {
          return i.offsetWidth;
        })
      );
      list.style.setProperty('--article-width', w);
      
      // Check if we need to switch between mobile and desktop layout
      if (window.innerWidth <= 768) {
        list.style.removeProperty('grid-template-columns');
      } else {
        resetAll();
      }
    }
  
    // Ensure the articles have the correct width
    window.addEventListener('resize', resync);
    resync();
    
    // Prevent default behavior for anchor tags (since this is just a demo)
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
      });
    });
    
    // Handle iframe environment specifics
    function handleIframeEnvironment() {
      // Check if we're in an iframe
      if (window.self !== window.top) {
        // Add a small delay to ensure initial layout is correct
        setTimeout(resync, 500);
        
        // Make sure we respect the parent iframe size
        window.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'resize') {
            resync();
          }
        });
      }
    }
    
    handleIframeEnvironment();
  });