document.addEventListener('DOMContentLoaded', function() {
    // Check if we're in an iframe
    const isIframe = window.self !== window.top;
    const fontPath = isIframe ? '../../fonts/Migha-BoldExpandedCNTR.otf' : './fonts/Migha-BoldExpandedCNTR.otf';
    
    // Create font-face declaration inline
    const fontStyle = document.createElement('style');
    fontStyle.textContent = `
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
    document.head.appendChild(fontStyle);
    
    // For contact page only, respect the Geist Sans font
    if (window.location.pathname.includes('contact')) {
      const contactStyle = document.createElement('style');
      contactStyle.textContent = `
        body, 
        html body p, 
        html body div, 
        html body span, 
        html body li:not(.nav-menu li) {
          font-family: "Geist Sans", "SF Pro Text", "SF Pro Icons", "AOS Icons", "Helvetica Neue", Helvetica, Arial, sans-serif, system-ui !important;
        }
      `;
      document.head.appendChild(contactStyle);
    }
  });