document.addEventListener('DOMContentLoaded', function() {
    // Detect the environment to adjust font paths
    const isIframe = window.self !== window.top;
    const fontPath = isIframe ? '../../fonts/Migha-BoldExpandedCNTR.otf' : 'fonts/Migha-BoldExpandedCNTR.otf';
    // Force preload the font
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.href = fontPath;
    fontPreload.as = 'font';
    fontPreload.type = 'font/otf';
    fontPreload.crossOrigin = 'anonymous';
    document.head.appendChild(fontPreload);
  
    // Create style element with high specificity rules
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Migha-BoldExpandedCNTR';
        src: url('${fontPath}') format('opentype');
        font-weight: bold;
        font-style: normal;
        font-display: swap;
      }
      
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
      html body .nav-menu a {
        font-family: 'Migha-BoldExpandedCNTR', Arial, sans-serif !important;
      }
      
      html body, 
      html body p, 
      html body div, 
      html body span, 
      html body li:not(.nav-menu li),
      html body .subtitle, 
      html body .caption, 
      html body .info, 
      html body .subheading, 
      html body .paragraph {
        font-family: 'Azeret Mono', monospace !important;
      }
    `;
    document.head.appendChild(style);
    
    // Apply to iframes
    document.querySelectorAll('iframe').forEach(iframe => {
      // Wait for iframe to load
      if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
        applyFontToIframe(iframe);
      } else {
        iframe.onload = function() {
          applyFontToIframe(iframe);
        };
      }
    });
    
    function applyFontToIframe(iframe) {
      try {
        // Create font-face for iframe
        const iframeFontFace = document.createElement('style');
        iframeFontFace.textContent = `
          @font-face {
            font-family: 'Migha-BoldExpandedCNTR';
            src: url('${fontPath}') format('opentype');
            font-weight: bold;
            font-style: normal;
            font-display: swap;
          }
          
          html body h1, 
          html body h2, 
          html body h3, 
          html body h4, 
          html body h5, 
          html body h6,
          html body strong, 
          html body b,
          html body .nav-menu a {
            font-family: 'Migha-BoldExpandedCNTR', Arial, sans-serif !important;
          }
          
          html body, 
          html body p, 
          html body div, 
          html body span, 
          html body li:not(.nav-menu li) {
            font-family: 'Azeret Mono', monospace !important;
          }
        `;
        
        // Access iframe content and append style
        if (iframe.contentDocument) {
          iframe.contentDocument.head.appendChild(iframeFontFace);
        }
      } catch(e) {
        console.error('Could not apply fonts to iframe:', e);
      }
    }
  });