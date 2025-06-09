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

/* For mobile: */
let pressTimer;
const longPressDuration = 500;  // milliseconds

document.addEventListener('touchstart', (e) => {
  if (e.target.tagName === 'IMG') {  // Target images only
    pressTimer = setTimeout(() => {
      handleFullScreen(e.target.src);  // Pass the image source or element
    }, longPressDuration);
  }
});

document.addEventListener('touchend', () => {
  clearTimeout(pressTimer);  // Cancel if not a long press
});

document.addEventListener('touchmove', () => {
  clearTimeout(pressTimer);  // Cancel on swipe or move
});

function handleFullScreen(imageSrc) {
  const fullUrl = imageSrc
  const baseUrl = new URL(fullUrl).pathname;
  let targetImage = document.querySelector(`img[src="${fullUrl}"]`);
  if (!targetImage) {
    targetImage = document.querySelector(`img[src*="${baseUrl}"]`);
    if (!targetImage) {
      targetImage = document.querySelector('.mantine-Carousel-viewport img');
    }
  }

  if (targetImage) {
    console.debug('Target image found and requesting full-screen.');
    targetImage.requestFullScreen();
  } else {
    console.debug('Target image still not found. URL used:', fullUrl);
  }
}

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "requestFullScreen" && message.imageUrl) {
    handleFullScreen(message.imageUrl);
  }
});
