const fs = require('fs');
const path = require('path');

// Define source files
const sourceFiles = {
  menu: {
    css: path.join(__dirname, 'menu.css'),
    js: path.join(__dirname, 'iframe-menu.js')
  }
};

// Define pages directory
const pagesDir = path.join(__dirname, 'pages');

// Function to copy a file
function copyFile(source, destination) {
  fs.copyFile(source, destination, (err) => {
    if (err) {
      console.error(`Error copying ${source} to ${destination}:`, err);
    } else {
      console.log(`Copied ${source} to ${destination}`);
    }
  });
}

// Get all page directories
fs.readdir(pagesDir, (err, pageDirs) => {
  if (err) {
    console.error('Error reading pages directory:', err);
    return;
  }

  // Process each page directory
  pageDirs.forEach(pageDir => {
    const fullPageDir = path.join(pagesDir, pageDir);
    
    // Check if it's a directory
    fs.stat(fullPageDir, (err, stats) => {
      if (err) {
        console.error(`Error checking ${fullPageDir}:`, err);
        return;
      }
      
      if (stats.isDirectory()) {
        // Copy menu.css to the page directory
        const cssDestination = path.join(fullPageDir, 'menu.css');
        copyFile(sourceFiles.menu.css, cssDestination);
        
        // Copy iframe-menu.js to the page directory as menu.js
        const jsDestination = path.join(fullPageDir, 'menu.js');
        copyFile(sourceFiles.menu.js, jsDestination);
      }
    });
  });
});