/**
 * Enforce Fonts Script
 * 
 * This script forces the correct font application across the entire site
 * It addresses all edge cases and ensures consistency
 */
(function() {
    // Run on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function() {
      enforceFonts();
    });
    
    function enforceFonts() {
      // Detect environment
      const isIframe = window.self !== window.top;
      const rootPath = isIframe ? '../..' : '.';
      const fontPath = `${rootPath}/fonts/Migha-BoldExpandedCNTR.otf`;
      
      // 1. Force preload the font
      preloadFont(fontPath);
      
      // 2. Add font-face definition with highest priority
      addFontFaceDefinition(fontPath);
      
      // 3. Apply font styles with high specificity selectors
      applyFontStyles();
      
      // 4. Handle iframe content
      setupIframeHandler(fontPath);
      
      // 5. Watch for dynamically added content
      observeDynamicContent(fontPath);
      
      // 6. Check and fix any problematic elements
      fixProblemElements();
    }
    
    function preloadFont(fontPath) {
      if (!document.querySelector(`link[href="${fontPath}"][rel="preload"]`)) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.href = fontPath;
        preloadLink.as = 'font';
        preloadLink.type = 'font/otf';
        preloadLink.crossOrigin = 'anonymous';
        document.head.appendChild(preloadLink);
      }
    }
    
    function addFontFaceDefinition(fontPath) {
      const fontFaceStyle = document.createElement('style');
      fontFaceStyle.id = 'migha-font-face';
      fontFaceStyle.innerHTML = `
        @font-face {
          font-family: 'Migha-BoldExpandedCNTR';
          src: url('${fontPath}') format('opentype');
          font-weight: bold;
          font-style: normal;
          font-display: swap;
        }
      `;
      document.head.appendChild(fontFaceStyle);
    }
    
    function applyFontStyles() {
      const fontStyle = document.createElement('style');
      fontStyle.id = 'migha-font-styles';
      fontStyle.innerHTML = `
        /* Universal, high-specificity selectors to override all other styles */
        html body h1, 
        html body h2, 
        html body h3, 
        html body h4, 
        html body h5, 
        html body h6,
        html body .title,
        html body .page-title,
        html body .section-title,
        html body strong, 
        html body b,
        html body .nav-menu a,
        html body .typewriter,
        html body [data-split],
        html body li::marker,
        html body .fluid,
        html body article h3 {
          font-family: 'Migha-BoldExpandedCNTR', Arial, sans-serif !important;
        }
        
        html body, 
        html body p, 
        html body div:not(.nav-menu), 
        html body span, 
        html body li:not(.nav-menu li),
        html body .subtitle, 
        html body .caption, 
        html body .info:not(.info h3), 
        html body .subheading, 
        html body .paragraph {
          font-family: 'Azeret Mono', monospace !important;
        }
      `;
      document.head.appendChild(fontStyle);
    }
    
    function setupIframeHandler(fontPath) {
      // Process existing iframes
      document.querySelectorAll('iframe').forEach(iframe => {
        handleIframe(iframe, fontPath);
      });
    }
    
    function handleIframe(iframe, fontPath) {
      // Wait for iframe to load
      if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
        injectFontIntoIframe(iframe, fontPath);
      } else {
        iframe.onload = function() {
          injectFontIntoIframe(iframe, fontPath);
        };
      }
    }
    
    function injectFontIntoIframe(iframe, fontPath) {
      try {
        if (!iframe.contentDocument) return;
        
        // Add font-face style to iframe
        const iframeFontFace = document.createElement('style');
        iframeFontFace.id = 'migha-font-face-iframe';
        iframeFontFace.innerHTML = `
          @font-face {
            font-family: 'Migha-BoldExpandedCNTR';
            src: url('${fontPath}') format('opentype');
            font-weight: bold;
            font-style: normal;
            font-display: swap;
          }
        `;
        iframe.contentDocument.head.appendChild(iframeFontFace);
        
        // Add font styles to iframe
        const iframeFontStyles = document.createElement('style');
        iframeFontStyles.id = 'migha-font-styles-iframe';
        iframeFontStyles.innerHTML = `
          /* Universal, high-specificity selectors to override all other styles */
          html body h1, 
          html body h2, 
          html body h3, 
          html body h4, 
          html body h5, 
          html body h6,
          html body .title,
          html body .page-title,
          html body .section-title,
          html body strong, 
          html body b,
          html body .nav-menu a,
          html body .typewriter,
          html body [data-split],
          html body li::marker,
          html body .fluid,
          html body article h3 {
            font-family: 'Migha-BoldExpandedCNTR', Arial, sans-serif !important;
          }
          
          html body, 
          html body p, 
          html body div:not(.nav-menu), 
          html body span, 
          html body li:not(.nav-menu li),
          html body .subtitle, 
          html body .caption, 
          html body .info:not(.info h3), 
          html body .subheading, 
          html body .paragraph {
            font-family: 'Azeret Mono', monospace !important;
          }
        `;
        iframe.contentDocument.head.appendChild(iframeFontStyles);
        
        // Handle nested iframes
        iframe.contentDocument.querySelectorAll('iframe').forEach(nestedIframe => {
          handleIframe(nestedIframe, fontPath);
        });
      } catch(e) {
        console.error('Could not inject font into iframe:', e);
      }
    }
    
    function observeDynamicContent(fontPath) {
      // Create observer for dynamically added content
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            // If a new iframe is added
            if (node.tagName === 'IFRAME') {
              handleIframe(node, fontPath);
            }
          });
        });
      });
      
      // Start observing
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
    
    function fixProblemElements() {
      // Fix any elements that might be problematic
      // Example: Direct element style overrides
      
      // Force Migha on all h* elements via direct style
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
        el.style.fontFamily = "'Migha-BoldExpandedCNTR', Arial, sans-serif";
      });
      
      // Force specific element fixes based on classes
      document.querySelectorAll('.typewriter, [data-split], .nav-menu a, .fluid').forEach(el => {
        el.style.fontFamily = "'Migha-BoldExpandedCNTR', Arial, sans-serif";
      });
    }
  })();