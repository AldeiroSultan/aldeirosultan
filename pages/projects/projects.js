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

    ScrollTrigger.matchMedia({
      '(max-width: 767px)': function () {
        swappers.forEach((swapper) => {
          handleCrossFade(swapper, true);
          handleProgress(swapper, true);
        });
      },
      '(min-width: 768px)': function () {
        swappers.forEach((swapper) => {
          handleTranslation(swapper);
          handleCrossFade(swapper);
          handleProgress(swapper);
        });
      },
    });
  }
});