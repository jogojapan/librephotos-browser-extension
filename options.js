document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('librephotos-url');
    const status = document.getElementById('status');
    const saveButton = document.getElementById('save-button');
    const storageAPI = typeof browser !== 'undefined' ? browser.storage : chrome.storage;

    // Load saved URL
    storageAPI.sync.get('librephotosUrl').then((result) => {
        if (result.librephotosUrl) {
            inputField.value = result.librephotosUrl;
        }
    });

    saveButton.addEventListener('click', () => {
        const url = inputField.value;
        if (url) {
            storageAPI.sync.set({ librephotosUrl: url }).then(() => {
                status.textContent = 'URL saved successfully!';
                setTimeout(() => { status.textContent = ''; }, 2000);
            });
        } else {
            status.textContent = 'Please enter a valid URL.';
        }
    });
});
