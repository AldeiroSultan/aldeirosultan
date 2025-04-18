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
  }

  // ===== Name overlay animation fallback for browsers without scroll-driven animations =====
  if (!CSS.supports('animation-timeline: scroll()')) {
    const nameContainer = document.querySelector('.name-overlay-container');
    const overlayName = document.querySelector('.overlay-name');
    const overlayImage = document.querySelector('.overlay-image');
    
    if (nameContainer) {
      window.addEventListener('scroll', function() {
        const containerTop = nameContainer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // Calculate the scroll progress within the container
        const scrollProgress = 1 - (containerTop / windowHeight);
        
        if (scrollProgress >= 0 && scrollProgress <= 1) {
          // Apply scaling and opacity changes based on scroll position
          const scale = 1 + (scrollProgress * 0.2);
          const opacity = 1 - (scrollProgress * 0.8);
          
          overlayName.style.transform = `scale(${scale})`;
          overlayName.style.opacity = opacity;
          
          overlayImage.style.transform = `translateY(${20 - scrollProgress * 20}px)`;
          overlayImage.style.opacity = 0.7 + (scrollProgress * 0.3);
        }
      });
    }
  }
  
  // Add class to body when scrolled for name overlay animation
  window.addEventListener('scroll', function() {
    const cover = document.getElementById('cover');
    const nameContainer = document.querySelector('.name-overlay-container');
    
    if (cover && nameContainer) {
      const containerRect = nameContainer.getBoundingClientRect();
      
      if (containerRect.top < window.innerHeight * 0.5) {
        cover.classList.add('has-scrolled');
      } else {
        cover.classList.remove('has-scrolled');
      }
    }
  });

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

  // ===== Marquee Animations =====
  // Fallback for browsers that don't support CSS animations
  if (!CSS.supports('animation-timeline: scroll()') || !CSS.supports('animation-name: marquee-forward')) {
    if (typeof gsap !== 'undefined') {
      // Animate the forward track
      const forwardTrack = document.querySelector('.marquee-track--forward');
      if (forwardTrack) {
        gsap.to(forwardTrack, {
          x: '-50%',
          repeat: -1,
          duration: 40,
          ease: 'none',
          onRepeat: () => {
            gsap.set(forwardTrack, { x: '0%' });
          }
        });
        
        // Pause on hover
        forwardTrack.addEventListener('mouseenter', () => {
          gsap.to(forwardTrack.animation, { timeScale: 0, duration: 0.5 });
        });
        
        forwardTrack.addEventListener('mouseleave', () => {
          gsap.to(forwardTrack.animation, { timeScale: 1, duration: 0.5 });
        });
      }
      
      // Animate the reverse track
      const reverseTrack = document.querySelector('.marquee-track--reverse');
      if (reverseTrack) {
        gsap.fromTo(reverseTrack, 
          { x: '-50%' },
          {
            x: '0%',
            repeat: -1,
            duration: 35,
            ease: 'none',
            onRepeat: () => {
              gsap.set(reverseTrack, { x: '-50%' });
            }
          }
        );
        
        // Pause on hover
        reverseTrack.addEventListener('mouseenter', () => {
          gsap.to(reverseTrack.animation, { timeScale: 0, duration: 0.5 });
        });
        
        reverseTrack.addEventListener('mouseleave', () => {
          gsap.to(reverseTrack.animation, { timeScale: 1, duration: 0.5 });
        });
      }
    }
  }

 // ===== Cover Section Text Animation Fallback =====
  // Fallback for browsers that don't support scroll-driven animations
  if (!CSS.supports('animation-timeline: scroll()')) {
    if (typeof gsap !== 'undefined' && typeof gsap.registerPlugin === 'function' && typeof ScrollTrigger !== 'undefined') {
      const contentSpans = document.querySelectorAll('.image-text span:not(.image-inline)');
      if (contentSpans.length > 0) {
        gsap.set(contentSpans, {
          opacity: 0.3,
          filter: "blur(5px)"
        });
        
        ScrollTrigger.create({
          trigger: ".image-text-container",
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
        
        // Scale the header on scroll
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

  // Add hover animations to inline images
  const inlineImages = document.querySelectorAll('.image-inline');
  inlineImages.forEach(image => {
    image.addEventListener('mouseenter', () => {
      image.style.transform = 'scale(1.2)';
      image.style.zIndex = '10';
    });
    
    image.addEventListener('mouseleave', () => {
      image.style.transform = 'scale(1)';
      image.style.zIndex = '1';
    });
  });

  // ===== Story Slider Animation =====
  // Initialize Swiper if available
  if (typeof Swiper !== 'undefined') {
    var mySwiper = new Swiper(".swiper-container", {
      direction: "vertical",
      loop: true,
      pagination: ".swiper-pagination",
      grabCursor: true,
      speed: 1000,
      paginationClickable: true,
      parallax: true,
      autoplay: false,
      effect: "slide",
      mousewheelControl: 1
    });
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