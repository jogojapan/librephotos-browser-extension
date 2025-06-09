console.log('Content script loaded successfully');

function requestFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } // Add other prefixes as needed
}

function initScript() {
  // Your existing logic to find the image element
  let imageElement;
  const observer = new MutationObserver(() => {
    console.log('Mutation observed')
    imageElement = document.querySelector('img[alt="Main Content"]');
    if (imageElement) {
      console.log('Image element found and ready.');
    }
  });

  const targetNode = document.querySelector('.mantine-Carousel-viewport');
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "requestFullScreen") {
      const fullUrl = message.imageUrl;  // Full URL from context menu
      const baseUrl = new URL(fullUrl).pathname;  // Extract pathname for matching
      let targetImage = document.querySelector(`img[src="${fullUrl}"]`);
      if (!targetImage) {
        targetImage = document.querySelector(`img[src*="${baseUrl}"]`);
        if (!targetImage) {
          targetImage = document.querySelector('.mantine-Carousel-viewport img');
        }
      }

      if (targetImage) {
        console.log('Target image found and requesting full-screen.');
        requestFullScreen(targetImage);
      } else {
        console.error('Target image still not found. URL used:', fullUrl);
      }
    }
  });
}

// Run the script as before
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScript);
} else {
    initScript();
}
