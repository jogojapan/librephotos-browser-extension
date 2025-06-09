// background.js
chrome.contextMenus.create({
    id: "fullscreen-image",
    title: "View Image Full-Screen",
    contexts: ["image"]  // Show the menu only on images
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "fullscreen-image" && info.srcUrl) {
        // Send a message to the content script with the image URL
        chrome.tabs.sendMessage(tab.id, {
            action: "requestFullScreen",
            imageUrl: info.srcUrl
        });
    }
});
