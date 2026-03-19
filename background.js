/**
 * Freedom PDF Viewer — Background Service Worker
 *
 * Intercepts navigations to PDF files and redirects them to the
 * built-in PDF.js viewer. This covers:
 *   • Clicking a PDF link (http / https)
 *   • Typing / pasting a PDF URL into the address bar
 *   • Opening a local PDF via File → Open (file://)
 *   • Dragging and dropping a PDF file onto a Chrome tab (file://)
 */

const VIEWER = chrome.runtime.getURL('pdfjs/web/viewer.html');

/**
 * Returns true if the URL looks like a PDF and is not already
 * being handled by our viewer.
 */
function isPdfNavigation(url) {
  if (!url || url.startsWith(VIEWER)) return false;
  try {
    const { pathname, href } = new URL(url);
    // Match paths ending in .pdf (before any query/fragment)
    return /\.pdf$/i.test(pathname.split('?')[0]);
  } catch {
    return /\.pdf($|\?|#)/i.test(url);
  }
}

/**
 * Redirect the tab to our PDF viewer with the original URL
 * encoded as the `file` query parameter that PDF.js expects.
 */
function openInViewer(tabId, url) {
  const redirectUrl = `${VIEWER}?file=${encodeURIComponent(url)}`;
  chrome.tabs.update(tabId, { url: redirectUrl });
}

// ── Intercept navigations ────────────────────────────────────────────────────

// onBeforeNavigate fires early — before Chrome's built-in PDF renderer
// has a chance to claim the navigation — making it ideal for interception.
chrome.webNavigation.onBeforeNavigate.addListener(
  ({ tabId, url, frameId }) => {
    // Only intercept top-level frames (frameId === 0)
    if (frameId !== 0) return;
    if (isPdfNavigation(url)) {
      openInViewer(tabId, url);
    }
  },
  {
    url: [
      // HTTP / HTTPS PDFs (web links and web drag-and-drop)
      { schemes: ['http'], urlMatches: '\\.pdf($|\\?|#)' },
      { schemes: ['https'], urlMatches: '\\.pdf($|\\?|#)' },
      // Local file PDFs (file → open OR drag-and-drop from file manager)
      { schemes: ['file'], urlMatches: '\\.pdf($|\\?|#)' },
    ],
  }
);
