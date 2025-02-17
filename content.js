// manifest.json stays the same
// popup.html stays the same
// popup.js stays the same
// background.js stays the same

// content.js
function getRandomColor() {
    const colors = [
      '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
      '#FF00FF', '#00FFFF', '#FFA500', '#800080',
      '#FFC0CB', '#90EE90', '#87CEEB', '#DDA0DD'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  function getRandomDirection() {
    const directions = ['left', 'right', 'up', 'down'];
    return directions[Math.floor(Math.random() * directions.length)];
  }
  
  function getRandomSpeed() {
    return Math.floor(Math.random() * 13) + 2;
  }
  
  function createAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes flashColors {
        0% { color: red; }
        25% { color: yellow; }
        50% { color: blue; }
        75% { color: green; }
        100% { color: red; }
      }
      .flash-element {
        animation: flashColors 0.5s linear infinite;
        font-weight: bold !important;
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .spinning-image {
        animation: spin 2s linear infinite;
      }
      .marquee-wrapper {
        display: inline-block;
        max-width: 100%;
      }
      .marquee-wrapper img {
        max-width: 100%;
        height: auto;
      }
    `;
    document.head.appendChild(style);
  }
  
  function wrapInMarquee(element) {
    const marquee = document.createElement('marquee');
    marquee.style.display = 'inline-block';
    marquee.style.color = getRandomColor();
    marquee.setAttribute('direction', getRandomDirection());
    marquee.setAttribute('scrollamount', getRandomSpeed());
    
    // Clone the element to avoid any reference issues
    const clone = element.cloneNode(true);
    marquee.appendChild(clone);
    
    // Add the marquee wrapper class for proper sizing
    marquee.classList.add('marquee-wrapper');
    
    element.parentNode.replaceChild(marquee, element);
    return clone;
  }
  
  function wrapTextInMarquee(node, isFirstCall = true) {
    if (isFirstCall) {
      createAnimations();
    }
  
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
      const marquee = document.createElement('marquee');
      marquee.textContent = node.textContent;
      marquee.style.display = 'inline-block';
      marquee.style.color = getRandomColor();
      marquee.setAttribute('direction', getRandomDirection());
      marquee.setAttribute('scrollamount', getRandomSpeed());
      
      if (Math.random() < 0.05) {
        marquee.classList.add('flash-element');
      }
      
      node.parentNode.replaceChild(marquee, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Handle images specially
      if (node.tagName.toLowerCase() === 'img') {
        const wrappedImage = wrapInMarquee(node);
        // 10% chance to add spin
        if (Math.random() < 0.10) {
          wrappedImage.classList.add('spinning-image');
        }
      } 
      // Process other elements
      else if (node.tagName.toLowerCase() !== 'marquee' && 
               node.tagName.toLowerCase() !== 'script' && 
               node.tagName.toLowerCase() !== 'style') {
        Array.from(node.childNodes).forEach(child => wrapTextInMarquee(child, false));
      }
    }
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "marquee") {
      wrapTextInMarquee(document.body);
    }
  });