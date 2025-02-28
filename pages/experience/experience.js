document.addEventListener('DOMContentLoaded', function() {
    // Update global CSS variables for cursor position
    const update = ({ x, y }) => {
        document.documentElement.style.setProperty('--x', x);
        document.documentElement.style.setProperty('--y', y);
    }
    
    // Add event listeners to the ordered list
    const list = document.querySelector('ol');
    list.addEventListener('pointermove', update);
    
    // Make list items trigger the image display
    const listItems = document.querySelectorAll('li');
    listItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.setProperty('--active', '1');
        });
        item.addEventListener('mouseleave', () => {
            item.style.setProperty('--active', '0');
        });
        
        // Add touch support for mobile devices
        item.addEventListener('touchstart', (e) => {
            // Get touch coordinates
            const touch = e.touches[0];
            update({
                x: touch.clientX,
                y: touch.clientY
            });
            item.style.setProperty('--active', '1');
            
            // Show other items as inactive
            listItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.style.opacity = '0.25';
                }
            });
        }, { passive: true });
        
        item.addEventListener('touchend', () => {
            item.style.setProperty('--active', '0');
            
            // Reset opacity for all items
            listItems.forEach(otherItem => {
                otherItem.style.opacity = '';
            });
        }, { passive: true });
    });
    
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
            // Special handling for iframe environment
            const listArea = document.querySelector('ol');
            
            // When the mouse leaves the list area, reset all active states
            listArea.addEventListener('mouseleave', () => {
                listItems.forEach(item => {
                    item.style.setProperty('--active', '0');
                    item.style.opacity = '';
                });
            });
        }
    }
    
    handleIframeEnvironment();
});