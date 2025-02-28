document.addEventListener("DOMContentLoaded", function() {
    // Initialize typewriter animations with staggered starts
    const typewriterElements = document.querySelectorAll('.typewriter');
    typewriterElements.forEach((element, index) => {
      // Calculate the character count for each element to set custom width
      const charCount = element.textContent.length;
      element.style.setProperty('--typewriter-characters', charCount);
      
      // Create a staggered delay effect for each element
      // This will make them appear as the user scrolls to them
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Reset the animation by removing and re-adding the class
            element.classList.remove('typewriter');
            void element.offsetWidth; // Force reflow
            element.classList.add('typewriter');
            observer.unobserve(element);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(element);
    });
  
    // Check if scroll-driven animations are supported
    if (!CSS.supports('animation-timeline: scroll()')) {
      // Dynamically load GSAP for browsers that don't support scroll-driven animations
      loadGSAP().then(initGsapFallback);
    }
    
    function loadGSAP() {
      return new Promise((resolve) => {
        const gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdn.skypack.dev/gsap@3.12.0';
        document.head.appendChild(gsapScript);
        
        gsapScript.onload = function() {
          const scrollTriggerScript = document.createElement('script');
          scrollTriggerScript.src = 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger';
          document.head.appendChild(scrollTriggerScript);
          
          scrollTriggerScript.onload = function() {
            resolve();
          };
        };
      });
    }
    
    function initGsapFallback() {
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        console.info('gsap: ScrollTrigger registered');
        
        const swappers = document.querySelectorAll('.swapper');
      
        const handleTranslation = (swapper) => {
          const controller = swapper.parentNode.querySelector('.controller');
          gsap.to(swapper, {
            y: controller.offsetHeight - swapper.offsetHeight,
            scrollTrigger: {
              trigger: swapper.parentNode,
              scrub: true,
              start: 'top center',
              end: 'bottom center',
            },
          });
        };
        
        const handleCrossFade = (swapper, mobile = false) => {
          const img = swapper.querySelectorAll('img');
          const trigger = mobile ? swapper : swapper.parentNode;
          gsap.to(img, {
            opacity: (index) => (index === 0 ? 1 : 0),
            scrollTrigger: {
              trigger,
              scrub: true,
              start: `top center${mobile ? '' : '-=25%'}`,
              end: `bottom center${mobile ? '' : '+=25%'}`,
            },
          });
        };
        
        const handleProgress = (swapper, mobile = false) => {
          const progress = swapper.querySelectorAll('.progress');
          const trigger = mobile ? swapper : swapper.parentNode;
          gsap.to(progress, {
            '--flip': 1,
            scrollTrigger: {
              trigger,
              scrub: true,
              start: 'center center',
              end: 'center center',
            },
          });
          
          const markers = swapper.querySelectorAll('.progress > div div');
          markers.forEach((marker, index) => {
            gsap.to(marker, {
              height: '100%',
              scrollTrigger: {
                trigger,
                scrub: true,
                start: index === 0 ? 'center center+=50%' : 'center center',
                end: index === 0 ? 'center center' : 'center center-=50%',
              },
            });
          });
        };
      
        if (window.matchMedia) {
          if (window.matchMedia('(max-width: 767px)').matches) {
            swappers.forEach((swapper) => {
              handleCrossFade(swapper, true);
              handleProgress(swapper, true);
            });
          } else {
            swappers.forEach((swapper) => {
              handleTranslation(swapper);
              handleCrossFade(swapper);
              handleProgress(swapper);
            });
          }
        } else {
          // Fallback for browsers without matchMedia
          swappers.forEach((swapper) => {
            handleTranslation(swapper);
            handleCrossFade(swapper);
            handleProgress(swapper);
          });
        }
      }
    }
  });