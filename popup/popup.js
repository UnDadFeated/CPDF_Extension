document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('open-viewer').addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('pdfjs/web/viewer.html') });
    });
    document.getElementById('open-file-btn').addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('pdfjs/web/viewer.html?openLocal=true') });
    });

    function checkFileAccess(callback) {
        // chrome.permissions.contains does NOT detect the file:// toggle —
        // only isAllowedFileSchemeAccess does. Use it while it still works;
        // fall back to optimistic true if it's ever removed.
        if (chrome.extension?.isAllowedFileSchemeAccess) {
            chrome.extension.isAllowedFileSchemeAccess(callback);
        } else {
            callback(true); // assume allowed; better to miss the warning than spam it
        }
    }

    checkFileAccess((isAllowed) => {
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

    const manifestData = chrome.runtime.getManifest();
    const versionDisplay = document.getElementById('version-display');
    if (versionDisplay && manifestData) {
        versionDisplay.textContent = `v${manifestData.version}`;
    }
});
