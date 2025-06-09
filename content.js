console.log('Content script loaded successfully');

function requestFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } // Add other prefixes as needed
}

function initScript() {
    const gallerySelector = '.mantine-Carousel-viewport';  // Adjust based on your gallery container

    // Option 1: Use event delegation on the gallery for clicks
    document.addEventListener('click', (event) => {
        if (event.target.closest(gallerySelector)) {  // Assuming clicks on gallery items
            setTimeout(() => {  // Short delay for DOM updates
                const imageElement = document.querySelector('.mantine-Carousel-viewport img');  // Or your simplified selector
                if (imageElement) {
                    console.log('Image element found after click:', imageElement);
                    imageElement.addEventListener('dblclick', () => requestFullScreen(imageElement));
                    // Add other logic, like the full-screen button
                } else {
                    console.error('Image element still not found after click.');
                }
            }, 500);  // Wait 500ms for the DOM to update
        }
    });

    // Option 2: Use MutationObserver for DOM changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                const imageElement = document.querySelector('.mantine-Carousel-viewport img');  // Target the dynamic image
                if (imageElement) {
                    console.log('New image element detected:', imageElement);
                    imageElement.addEventListener('dblclick', () => requestFullScreen(imageElement));
                    // You can stop observing after finding it if needed
                    observer.disconnect();  // Optional: Disconnect after first detection
                }
            }
        });
    });

    // Start observing the relevant container
    const targetNode = document.querySelector(gallerySelector);  // E.g., the carousel or gallery area
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
    }
}

// Run the script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScript);
} else {
    initScript();
}
