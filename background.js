// background.js
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

async function initializeExtension() {
  console.log('Initializing the extension')
  try {
    const result = await browserAPI.storage.sync.get('librephotosUrl');
    const { librephotosUrl } = result;
    console.log(librephotosUrl)
    if (librephotosUrl) {
      if (browserAPI.scripting && browserAPI.scripting.registerContentScripts) {
        try {
          await browserAPI.scripting.registerContentScripts([{
            id: "librephotos-content",
            matches: [`${librephotosUrl}/*`],
            js: ["content.js"],
            runAt: "document_start"
          }]);
          console.log('Content script registered for:', librephotosUrl);
        } catch (error) {
          console.error('Error registering content script:', error);
        }
      } else {
        console.error('Scripting API is not available; check permissions and browser support.');
      }
    } else {
      console.log('No URL configured; open options to set it.');
    }
  } catch (error) {
    console.error('Storage access error:', error);
  }
}

// Run on installation or startup
browserAPI.runtime.onInstalled.addListener(initializeExtension);
browserAPI.runtime.onStartup.addListener(initializeExtension);

browserAPI.contextMenus.create({
    id: "fullscreen-image",
    title: "View Image Full-Screen",
    contexts: ["image"]
});

browserAPI.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "fullscreen-image" && info.srcUrl) {
        try {
            // Inject content script if not already present
            await browserAPI.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content.js"]
            });

            // Small delay to ensure script is loaded
            setTimeout(() => {
                browserAPI.tabs.sendMessage(tab.id, {
                    action: "requestFullScreen",
                    imageUrl: info.srcUrl
                });
            }, 100);
        } catch (error) {
            console.error('Error injecting content script:', error);
        }
    }
});
