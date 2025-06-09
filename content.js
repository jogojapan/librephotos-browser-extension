console.debug('Content script loaded successfully');

function requestFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}

function initScript() {
  let imageElement;
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
        console.debug('Target image found and requesting full-screen.');
        requestFullScreen(targetImage);
      } else {
        console.debug('Target image still not found. URL used:', fullUrl);
      }
    }
  });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScript);
} else {
    initScript();
}
