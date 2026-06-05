document.addEventListener('DOMContentLoaded', () => {
    const openViewer = () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('pdfjs/web/viewer.html') });
    };
    document.getElementById('open-viewer').addEventListener('click', openViewer);
    document.getElementById('open-file-btn').addEventListener('click', openViewer);

    // Check if the extension has permission to access file:// URLs
    if (typeof chrome !== 'undefined' && chrome.extension && chrome.extension.isAllowedFileSchemeAccess) {
        chrome.extension.isAllowedFileSchemeAccess((isAllowed) => {
            if (!isAllowed) {
                const warningContainer = document.getElementById('file-access-warning');
                if (warningContainer) {
                    warningContainer.classList.remove('hidden');
                    const configureBtn = document.getElementById('configure-btn');
                    if (configureBtn) {
                        configureBtn.addEventListener('click', () => {
                            chrome.tabs.create({ url: `chrome://extensions/?id=${chrome.runtime.id}` });
                        });
                    }
                }
            }
        });
    }

    const manifestData = chrome.runtime.getManifest();
    const versionDisplay = document.getElementById('version-display');
    if (versionDisplay && manifestData) {
        versionDisplay.textContent = `v${manifestData.version}`;
    }
});
