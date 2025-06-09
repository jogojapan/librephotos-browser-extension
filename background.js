// background.js
browser.contextMenus.create({
    id: "fullscreen-image",
    title: "View Image Full-Screen",
    contexts: ["image"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "fullscreen-image" && info.srcUrl) {
        browser.tabs.sendMessage(tab.id, {
            action: "requestFullScreen",
            imageUrl: info.srcUrl
        });
    }
});
