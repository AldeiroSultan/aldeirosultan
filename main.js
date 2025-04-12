document.addEventListener("DOMContentLoaded", function() {
  // ===== Original Portfolio Code =====
  // Make all sections visible initially to ensure smooth animations
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('section-visible');
  });

  // ===== Cover Section Scripts =====
  // Initialize text splitting for the cover animation
  const toSplit = document.querySelector('[data-split]');
  if (toSplit) {
    // Set CSS variables for sizing
    const content = toSplit.innerText;
    const contentLength = content.length;
    const PPC = 10; // Pixels per character
    const BUFFER = 40;

    document.documentElement.style.setProperty('--buffer', BUFFER);
    document.documentElement.style.setProperty('--ppc', PPC);
    document.documentElement.style.setProperty('--pad', 8);
    document.documentElement.style.setProperty('--content-length', contentLength + 2);
    document.documentElement.style.setProperty('--base', '0.3');
    
    // Split the text into individual spans
    const words = toSplit.innerText.split(' ');
    toSplit.innerHTML = '';

    let cumulation = 10;
    words.forEach((word, index) => {
      const text = document.createElement('span');
      text.innerHTML = `<span>${word} </span>`;
      text.style = `
        --index: ${index};
        --start: ${cumulation};
        --end: ${cumulation + word.length};
      `;
      text.dataset.index = index;
      text.dataset.start = cumulation;
      text.dataset.end = cumulation + word.length;
      cumulation += word.length + 1;
      toSplit.appendChild(text);
    });
  }

  // ===== Experience Section Scripts =====
  // Cursor effect for experience section's post list
  const update = ({ x, y }) => {
    document.documentElement.style.setProperty('--x', x);
    document.documentElement.style.setProperty('--y', y);
  };

  const list = document.querySelector('.posts-list');
  if (list) {
    list.addEventListener('pointermove', update);

    // Make the entire list area trigger the image display
    const listItems = list.querySelectorAll('li');
    listItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.setProperty('--active', '1');
      });
      item.addEventListener('mouseleave', () => {
        item.style.setProperty('--active', '0');
      });
    });
  }

  // ===== Popup Menu Functionality =====
  // Initialize GSAP explicitly
  if (typeof gsap === 'undefined') {
    console.error('GSAP is not loaded. Please make sure to include the GSAP library.');
  } else {
    console.log('GSAP is loaded successfully.');
    
    // Check if CustomEase is available and create custom easing functions
    if (typeof CustomEase !== 'undefined') {
      CustomEase.create("easeOutFast", "M0,0 C0.25,0.1 0.25,1 1,1"); // Opening ease
      CustomEase.create("easeInFast", "M0,0 C0.5,0 0.75,0.2 1,1"); // Closing ease
      console.log('CustomEase initialized successfully');
    } else {
      console.warn('CustomEase not available. Using standard easing functions instead.');
    }
    
    // Use direct DOM element references to avoid potential issues with selectors
    const menuBtn = document.getElementById("menu-btn");
    const dropdown = document.getElementById("dropdown");
    const content = document.getElementById("content");
    const navigation = document.getElementById("navigation");
    
    // Log DOM elements to verify they exist
    console.log('Menu Button:', menuBtn);
    console.log('Dropdown:', dropdown);
    console.log('Content:', content);
    console.log('Navigation:', navigation);
    
    if (menuBtn && dropdown && content && navigation) {
      console.log('All required elements for menu are found');
      
      // Track menu state
      let isOpen = false;
      
      // Add click event listener to menu button
      menuBtn.addEventListener("click", function() {
        console.log('Menu button clicked. Current state:', isOpen ? 'open' : 'closed');
        
        // Toggle menu state
        if (!isOpen) {
          // Opening the menu
          console.log('Opening menu...');
          
          // Create a timeline for synchronized animations
          const openTimeline = gsap.timeline();
          
          // Reset elements first
          gsap.set(".dropdown__section--one h1, .dropdown__section--one p, .dropdown__button", {
            opacity: 0,
            y: 20
          });
          
          // Animation sequence
          openTimeline
            .to([dropdown, navigation, content], {
              y: "50vh",
              duration: 0.4,
              ease: typeof CustomEase !== 'undefined' ? "easeOutFast" : "power2.out"
            })
            .to(".dropdown__section--one h1", {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: typeof CustomEase !== 'undefined' ? "easeOutFast" : "power2.out"
            }, "-=0.2")
            .to(".dropdown__section--one p", {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: typeof CustomEase !== 'undefined' ? "easeOutFast" : "power2.out"
            }, "-=0.2")
            .to(".dropdown__button", {
              opacity: 1,
              y: 0,
              duration: 0.3,
              stagger: 0.1,
              ease: typeof CustomEase !== 'undefined' ? "easeOutFast" : "power2.out"
            }, "-=0.2")
            .to(".divider", {
              width: "100%",
              duration: 0.2,
              ease: typeof CustomEase !== 'undefined' ? "easeOutFast" : "power2.out"
            }, "-=0.3");
          
          // Update UI
          dropdown.classList.add("open");
          menuBtn.textContent = "CLOSE";
          
        } else {
          // Closing the menu
          console.log('Closing menu...');
          
          // Create a timeline for synchronized animations
          const closeTimeline = gsap.timeline();
          
          // Animation sequence
          closeTimeline
            .to(".dropdown__button", {
              opacity: 0,
              y: 20,
              duration: 0.3,
              stagger: 0.05,
              ease: typeof CustomEase !== 'undefined' ? "easeInFast" : "power2.in"
            })
            .to(".dropdown__section--one p", {
              opacity: 0,
              y: 20,
              duration: 0.3,
              ease: typeof CustomEase !== 'undefined' ? "easeInFast" : "power2.in"
            }, "-=0.1")
            .to(".dropdown__section--one h1", {
              opacity: 0,
              y: 20,
              duration: 0.3,
              ease: typeof CustomEase !== 'undefined' ? "easeInFast" : "power2.in"
            }, "-=0.1")
            .to(".divider", {
              width: "0%",
              duration: 0.4,
              ease: typeof CustomEase !== 'undefined' ? "easeInFast" : "power2.in"
            })
            .to([dropdown, navigation, content], {
              y: "0",
              duration: 0.4,
              ease: typeof CustomEase !== 'undefined' ? "easeInFast" : "power2.in"
            }, "-=0.2")
            .call(() => {
              // Update UI after animations complete
              dropdown.classList.remove("open");
              menuBtn.textContent = "MENU";
            });
        }
        
        // Toggle state
        isOpen = !isOpen;
      });
      
      // Close menu when a dropdown button is clicked
      document.querySelectorAll('.dropdown__button').forEach(button => {
        button.addEventListener('click', () => {
          if (isOpen) {
            console.log('Menu link clicked, closing menu...');
            menuBtn.click();
          }
        });
      });
      
    } else {
      console.error('One or more required elements for the menu are missing:',
        menuBtn ? '' : 'Menu Button,',
        dropdown ? '' : 'Dropdown,',
        content ? '' : 'Content,',
        navigation ? '' : 'Navigation'
      );
    }
  }

  // ===== Projects Section Scripts =====
  // Check if scroll-driven animations are supported
  if (!CSS.supports('animation-timeline: scroll()')) {
    if (typeof gsap !== 'undefined' && typeof gsap.registerPlugin === 'function') {
      gsap.registerPlugin(ScrollTrigger);
      console.log('ScrollTrigger registered for project animations');
      
      // Projects section animations
      const swappers = document.querySelectorAll('#projects .swapper');
      console.log('Found swappers:', swappers.length);
      
      // Handle swapper animations
      swappers.forEach((swapper, index) => {
        console.log(`Setting up animations for swapper ${index+1}`);
        
        const controller = swapper.closest('.image-box')?.querySelector('.controller');
        const images = swapper.querySelectorAll('img');
        const progressBars = swapper.querySelectorAll('.progress > div > div');
        
        if (controller && images.length >= 2) {
          // Translation animation
          ScrollTrigger.matchMedia({
            '(min-width: 768px)': function() {
              gsap.to(swapper, {
                y: controller.offsetHeight - swapper.offsetHeight,
                scrollTrigger: {
                  trigger: swapper.closest('.image-box'),
                  scrub: true,
                  start: 'top center',
                  end: 'bottom center',
                }
              });
              
              // Image crossfade
              gsap.to(images[0], {
                opacity: 0,
                scrollTrigger: {
                  trigger: swapper.closest('.image-box'),
                  scrub: true,
                  start: 'center center-=25%',
                  end: 'bottom center+=25%',
                }
              });
              
              gsap.to(images[1], {
                opacity: 1,
                scrollTrigger: {
                  trigger: swapper.closest('.image-box'),
                  scrub: true,
                  start: 'center center-=25%',
                  end: 'bottom center+=25%',
                }
              });
              
              // Progress bar animations
              if (progressBars.length >= 1) {
                gsap.to(progressBars[0], {
                  height: '100%',
                  scrollTrigger: {
                    trigger: swapper.closest('.image-box'),
                    scrub: true,
                    start: 'top center+=25%',
                    end: 'center center',
                  }
                });
              }
              
              if (progressBars.length >= 2) {
                gsap.to(progressBars[1], {
                  height: '100%',
                  scrollTrigger: {
                    trigger: swapper.closest('.image-box'),
                    scrub: true,
                    start: 'center center',
                    end: 'bottom center-=25%',
                  }
                });
              }
            },
            
            '(max-width: 767px)': function() {
              // Mobile animations
              gsap.to(images[0], {
                opacity: 0,
                scrollTrigger: {
                  trigger: swapper,
                  scrub: true,
                  start: 'top center',
                  end: 'bottom center',
                }
              });
              
              gsap.to(images[1], {
                opacity: 1,
                scrollTrigger: {
                  trigger: swapper,
                  scrub: true,
                  start: 'top center',
                  end: 'bottom center',
                }
              });
              
              // Progress bar animations for mobile
              if (progressBars.length >= 2) {
                gsap.to([progressBars[0], progressBars[1]], {
                  height: '100%',
                  scrollTrigger: {
                    trigger: swapper,
                    scrub: true,
                    start: 'top center',
                    end: 'bottom center',
                  }
                });
              }
            }
          });
        } else {
          console.warn(`Missing controller or images for swapper ${index+1}`);
        }
      });
    }
  }
});