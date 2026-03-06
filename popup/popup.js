document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('open-viewer').addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('pdfjs/web/viewer.html') });
    });

    const manifestData = chrome.runtime.getManifest();
    const versionDisplay = document.getElementById('version-display');
    if (versionDisplay && manifestData) {
        versionDisplay.textContent = `v${manifestData.version}`;
    }
});
