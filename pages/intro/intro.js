document.addEventListener('DOMContentLoaded', function() {
    const articles = document.querySelectorAll('article');
  
    const entry = video => () => {
      video.currentTime = 0;
      video.play();
    };
  
    const exit = video => () => {
      video.pause();
    };
  
    for (const article of articles) {
      const video = article.querySelector('video');
      
      // Set up event for when video data is loaded
      video.addEventListener('loadeddata', () => {
        article.dataset.loaded = true;
      });
      
      // Handle pointer events
      article.addEventListener('pointerenter', entry(video));
      article.addEventListener('pointerleave', exit(video));
      
      // For touch devices, manually trigger load by setting preload attribute
      video.preload = "metadata";
    }
    
    // Add reset/replay for typewriter animations when they come into view
    const typewriterElements = document.querySelectorAll('.typewriter');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'none';
          void entry.target.offsetWidth; // Force reflow
          if (entry.target.classList.contains('typewriter')) {
            if (entry.target.classList.contains('page-title')) {
              entry.target.style.animation = 'typing 2.5s steps(30, end) forwards, blink 0.75s step-end infinite';
            } else if (entry.target.tagName === 'H3') {
              entry.target.style.animation = 'typing 2s steps(30, end) forwards, blink 0.75s step-end infinite';
            } else {
              entry.target.style.animation = 'typing 2s steps(30, end) 2s forwards, blink 0.75s step-end infinite';
            }
          }
        }
      });
    }, { threshold: 0.5 });
    
    typewriterElements.forEach(element => {
      observer.observe(element);
    });
  
    // Handle touch events for mobile devices
    if ('ontouchstart' in window) {
      articles.forEach(article => {
        const video = article.querySelector('video');
        
        article.addEventListener('touchstart', () => {
          // If the video is not playing, play it
          if (video.paused) {
            // Reset the video to the beginning
            video.currentTime = 0;
            video.play();
            
            // Show video, hide image
            article.dataset.active = true;
            const img = article.querySelector('img');
            if (img) {
              img.style.opacity = '0';
              img.style.mixBlendMode = 'lighten';
            }
            video.style.display = 'block';
          } else {
            // If the video is playing, pause it
            video.pause();
            
            // Show image, hide video
            article.dataset.active = false;
            const img = article.querySelector('img');
            if (img) {
              img.style.opacity = '1';
              img.style.mixBlendMode = 'normal';
            }
            video.style.display = 'none';
          }
        }, { passive: true });
      });
    }
  });