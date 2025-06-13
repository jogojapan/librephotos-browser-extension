const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
let librephotosUrl = null;

async function initializeExtension() {
  console.debug('Initializing the extension.')
  try {
    const result = await browserAPI.storage.sync.get('librephotosUrl');
    librephotosUrl = result.librephotosUrl;
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
      }
    }

    createContextMenus();
  } catch (error) {
    console.error('Storage access error:', error);
  }
}

function createContextMenus() {
  browserAPI.contextMenus.removeAll(() => {
    browserAPI.contextMenus.create({
      id: "librephotos-parent",
      title: "LibrePhotos Tools",
      contexts: ["image"]
    });

    browserAPI.contextMenus.create({
      id: "fullscreen-image",
      parentId: "librephotos-parent",
      title: "View image in fullscreen",
      contexts: ["image"],
      enabled: !!librephotosUrl
    });

    browserAPI.contextMenus.create({
      id: "set-url",
      parentId: "librephotos-parent",
      title: "Set LibrePhotos URL",
      contexts: ["image"]
    });
  });
}

browserAPI.runtime.onInstalled.addListener(initializeExtension);
browserAPI.runtime.onStartup.addListener(initializeExtension);

browserAPI.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "fullscreen-image" && info.srcUrl && librephotosUrl) {
    try {
      await browserAPI.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });

      setTimeout(() => {
        browserAPI.tabs.sendMessage(tab.id, {
          action: "requestFullScreen",
          imageUrl: info.srcUrl
        });
      }, 100);
    } catch (error) {
      console.error('Error injecting content script:', error);
    }
  } else if (info.menuItemId === "set-url") {
    browserAPI.runtime.openOptionsPage();
  }
});

browserAPI.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.librephotosUrl) {
    librephotosUrl = changes.librephotosUrl.newValue;
    createContextMenus();
  }
});
