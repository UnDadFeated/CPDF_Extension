/**
 * Freedom PDF Viewer — Background Service Worker
 *
 * Intercepts navigations to PDF files and redirects them to the
 * built-in PDF.js viewer. This covers:
 *   • Clicking a PDF link (http / https)
 *   • Typing / pasting a PDF URL into the address bar
 *   • Opening a local PDF via File → Open (file://)
 *   • Dragging and dropping a PDF file onto a Chrome tab (file://)
 *
 * Embedded PDFs (lazy-loaded iframes, <object>, etc.) must NOT be
 * redirected — only full-tab navigations to a .pdf URL.
 */

const VIEWER = chrome.runtime.getURL('pdfjs/web/viewer.html');

/**
 * Returns true if the URL looks like a PDF and is not already
 * being handled by our viewer.
 * Uses path/extension only (not Content-Type). URLs like `/download?id=1`
 * that serve `application/pdf` are not intercepted unless they end in `.pdf`.
 */
function isPdfNavigation(url) {
  if (!url || typeof url !== 'string' || url.startsWith(VIEWER)) return false;
  try {
    const { pathname } = new URL(url);
    return pathname.toLowerCase().endsWith('.pdf');
  } catch {
    // Fallback for malformed URLs
    return /\.pdf($|\?|#)/i.test(url);
  }
}

/**
 * True only for a user-visible tab navigation to a PDF — not an iframe,
 * fenced frame, or prerendered document.
 * Chrome 106+ exposes `frameType`; older builds fall back to frameId/parentFrameId.
 */
function isTopLevelUserTabNavigation(details) {
  if (details.documentLifecycle === 'prerender') {
    return false;
  }

  const { frameType, frameId, parentFrameId } = details;

  if (frameType === 'sub_frame' || frameType === 'fenced_frame') {
    return false;
  }
  if (frameType === 'outermost_frame') {
    return true;
  }

  // Chrome < 106: frameType may be undefined — use frame hierarchy only
  if (frameType === undefined) {
    if (frameId !== 0) {
      return false;
    }
    if (parentFrameId === undefined || parentFrameId === null) {
      return true;
    }
    return parentFrameId === -1;
  }

  return false;
}

/**
 * Redirect the tab to our PDF viewer with the original URL
 * encoded as the `file` query parameter that PDF.js expects.
 */
function openInViewer(tabId, url) {
  // If the URL has a fragment (e.g. #page=2), keep it outside the 'file' param
  // so that PDF.js can parse it correctly for its own navigation.
  const [baseUrl, fragment] = url.split('#');
  const redirectUrl = `${VIEWER}?file=${encodeURIComponent(baseUrl)}${fragment ? '#' + fragment : ''}`;
  chrome.tabs.update(tabId, { url: redirectUrl });
}

// ── Intercept navigations ────────────────────────────────────────────────────

// onBeforeNavigate fires early — before Chrome's built-in PDF renderer
// has a chance to claim the navigation — making it ideal for interception.
chrome.webNavigation.onBeforeNavigate.addListener(
  (details) => {
    if (!isPdfNavigation(details.url)) {
      return;
    }
    if (!isTopLevelUserTabNavigation(details)) {
      return;
    }
    openInViewer(details.tabId, details.url);
  },
  {
    url: [
      { schemes: ['http', 'https', 'file'], urlMatches: '\\.[pP][dD][fF]($|\\?|#)' }
    ],
  }
);

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'open-with-freedom-pdf',
    title: 'Open with Freedom PDF Viewer',
    contexts: ['link'],
    targetUrlPatterns: [
      '*://*/**.pdf',
      '*://*/**.pdf?*',
      '*://*/**.pdf#*',
      'file:///*.pdf',
      'file:///*.pdf?*',
      'file:///*.pdf#*'
    ]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'open-with-freedom-pdf') {
    const [baseUrl, fragment] = info.linkUrl.split('#');
    const viewerUrl = `${VIEWER}?file=${encodeURIComponent(baseUrl)}${fragment ? '#' + fragment : ''}`;
    if (tab && tab.id) {
      chrome.tabs.update(tab.id, { url: viewerUrl });
    } else {
      chrome.tabs.create({ url: viewerUrl });
    }
  }
});

// Optimized chunk-based base64 encoder that avoids stack size limits
function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

// Bypass CORS restrictions for remote PDF files by fetching them via the background service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchPdf') {
    fetch(message.url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then(buffer => {
        const base64 = bufferToBase64(buffer);
        sendResponse({ success: true, data: base64 });
      })
      .catch(error => {
        console.error('Freedom PDF Viewer: Error fetching remote PDF:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep the message channel open for async response
  }
});
