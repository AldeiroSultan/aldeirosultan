document.addEventListener("DOMContentLoaded", function() {
  // ===== Make all sections visible initially to ensure smooth animations =====
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('section-visible');
  });

  // ===== Cover Section Animation =====
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

  // ===== Experience Section Animations =====
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
  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.error('GSAP is not loaded. Please make sure to include the GSAP library.');
  } else {
    // Initialize CustomEase if available
    if (typeof CustomEase !== 'undefined') {
      CustomEase.create("easeOutFast", "M0,0 C0.25,0.1 0.25,1 1,1"); // Opening ease
      CustomEase.create("easeInFast", "M0,0 C0.5,0 0.75,0.2 1,1"); // Closing ease
    }
    
    // Get elements
    const menuBtn = document.getElementById("menu-btn");
    const dropdown = document.getElementById("dropdown");
    const content = document.getElementById("content");
    const navigation = document.getElementById("navigation");
    
    if (menuBtn && dropdown && content && navigation) {
      // Track menu state
      let isOpen = false;
      
      // Add click event listener to menu button
      menuBtn.addEventListener("click", function() {
        // Toggle menu state
        if (!isOpen) {
          // Opening the menu
          // Reset elements first
          gsap.set(".dropdown__section--one h1, .dropdown__section--one p, .dropdown__button", {
            opacity: 0,
            y: 20
          });
          
          // Animation sequence
          const openTimeline = gsap.timeline();
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
          // Animation sequence
          const closeTimeline = gsap.timeline();
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
            menuBtn.click();
          }
        });
      });
    }
  }

  // ===== Projects Section Animations =====
  // Check if scroll-driven animations are supported
  if (!CSS.supports('animation-timeline: scroll()')) {
    if (typeof gsap !== 'undefined' && typeof gsap.registerPlugin === 'function' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      // Projects section animations
      const swappers = document.querySelectorAll('#projects .swapper');
      
      // Handle swapper animations
      swappers.forEach((swapper) => {
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
        }
      });
    }
  }

  // ===== Cover Section Text Animation Fallback =====
  // Fallback for browsers that don't support scroll-driven animations
  if (!CSS.supports('animation-timeline: scroll()')) {
    if (typeof gsap !== 'undefined' && typeof gsap.registerPlugin === 'function' && typeof ScrollTrigger !== 'undefined') {
      const contentSpans = document.querySelectorAll('[data-split] span');
      if (contentSpans.length > 0) {
        gsap.set(contentSpans, {
          opacity: 0.3,
          filter: "blur(5px)"
        });
        
        ScrollTrigger.create({
          trigger: ".reader",
          start: "top 80%",
          end: "center 30%",
          scrub: true,
          onUpdate: (self) => {
            contentSpans.forEach((span, index) => {
              const delay = index * 0.05;
              const progress = Math.max(0, Math.min(1, (self.progress - delay) * 3));
              if (progress > 0) {
                gsap.to(span, {
                  opacity: 0.3 + (progress * 0.7),
                  filter: `blur(${5 * (1 - progress)}px)`,
                  duration: 0.1,
                  overwrite: true
                });
              }
            });
          }
        });
        
        gsap.to("#cover header", {
          scale: 0.8,
          scrollTrigger: {
            trigger: "#cover",
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }
    }
  }

  // ===== Contact Section Animations =====
  // Simple initialization for contact section if needed
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    // Add click handlers to social icons
    const socialIcons = contactSection.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
      icon.addEventListener('click', (e) => {
        // Placeholder for social icon click handler
        if (!icon.href || icon.href === '#') {
          e.preventDefault();
        }
      });
    });
  }
});