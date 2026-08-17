# Changelog

## [3.6.6] — 2026-08-17

### Fixed
- **Ctrl+F Search:** Removed the capture-phase keyboard hijack that sent Ctrl+F to fullscreen; Ctrl+F now opens the native PDF.js find bar. Fullscreen moved to Ctrl+Shift+F (toolbar button hints updated to match).
- **Fullscreen Event Wiring:** The `toggleFullscreen` event handler now targets the real `leftFsToggleBtn` control (the referenced `fsToggleBtn` element does not exist), so keyboard-triggered fullscreen actually works.
- **Context Menu Recreate:** `onInstalled` now clears existing context menus before creating, fixing a "menu item already exists" failure on extension updates.
- **Watermark Apply Flow:** `save()` returns no bytes, so the post-watermark reopen was receiving `data: undefined` and failing (error overlay after the file downloaded). Now the document is serialized directly via `saveDocument()`, downloaded as `<name>_watermarked.pdf`, and reopened with real bytes; the modified flag is cleared first so `open() → close()` no longer triggers a duplicate save/download.
- **Watermark Opacity:** The opacity slider was read but never applied (FreeText annotations have no opacity parameter). It is now baked into the text color using the same blend as pdf.js's `applyOpacity`. Empty/invalid font size, opacity, and angle inputs now fall back to defaults instead of producing NaN rects.
- **Search Localization:** Restored the `en-US` find bar strings so a no-match search shows "Phrase not found" instead of a raw localization key.

### Changed
- **Deduplicated Keyboard Shortcuts:** Removed Ctrl+B / Ctrl+D from the custom capture-phase handler — the native viewer already binds both (bookmark / delete annotation), eliminating double-fire risk.
- **Single-Page View:** Replaced per-page inline styles with a `singlePageMode` CSS class so lazily rendered pages style correctly; previous scroll/spread mode is now saved and restored on exit.
- **Auto-Hide Toolbar:** Global `mousemove`/`keydown` listeners are now only attached while auto-hide is enabled, removing constant event overhead.

### Cleanup
- **Dead Code:** Removed the never-read `_pageReorderEnabled` flag and the unused `window._ttsUtterance` global.
- **Auto-Save Hook:** `setupAutoSaveHook` is now guarded against double-wrapping — it was invoked from both the patched `_initializeAnnotationStorageCallbacks` and the `documentloaded` event, doubling the modification counter.
- **Bookmarks Tooltip:** The bookmarks panel toggle no longer advertises Ctrl+B (that shortcut adds a bookmark for the current page).

## [3.6.5] — 2026-08-16

### Fixed
- **Modal Dismissal Controls:** Added backdrop click listener and `Escape` key shortcut support to effortlessly close the Electronic Signature and Watermark modals.
- **Robust Local Open Trigger:** Switched `openLocal` handler to public `eventBus.on` and added an immediate initialization fallback to prevent potential race condition hangs when launching via `openLocal=true` or `open=true`.
- **Integration Test Version Sync:** Synchronized `test_runner.html` headers with the release version.

## [3.6.4] — 2026-06-28

### Fixed
- **File Scheme Permission Check Fallback:** Restored `chrome.extension.isAllowedFileSchemeAccess` with an optimistic fallback to fix the warning card permanently hidden regression.
- **Proxy HTTP Status Guard:** Checked `response.ok` before evaluating size limits in the background `fetchPdf` handler to avoid throwing a size limit error on large error pages.
- **Reliable File Picker Launch:** Replaced the fragile `setTimeout` race window with a robust event listener for the custom `pdfviewerinitialised` event.

## [3.6.3] — 2026-06-28

### Added
- **Trigger file picker on load:** Appended `openLocal=true` check to programmatically trigger the viewer's file picker.

### Fixed
- **Unified URL Parsing:** Converted context menu and page navigation handlers to use a shared `buildViewerUrl` helper that preserves complex URL fragments.
- **Safe Service Worker Fetch:** Capped the background proxy fetch payload to 50 MB to prevent service worker OOM crashes.
- **MV3 Permission Check:** Replaced deprecated `chrome.extension.isAllowedFileSchemeAccess` with recommended `chrome.permissions.contains` API.
- **Local PDF Button UX:** Wired "Open Local PDF" button to open the viewer with `openLocal=true`, immediately prompting with the file picker.
- **SW-Termination Error Boundary:** Added a 15-second response timeout to the viewer's `fetchPdf` relay query to prevent page hangs on worker termination.

## [3.6.2] — 2026-06-28

### Added
- **Advanced Offline PDF Features:** Implemented true page reordering, page deletion via thumbnail controls, electronic signing pad canvas, PDF document merging, watermarking, and single-page image export.

## [3.6.1] — 2026-06-10

### Added
- **Button hover tool-tips:** Added descriptive hover tool-tips (HTML `title` attributes) to all remaining primary and secondary buttons, sidebar switches, and extension popup controls.

## [3.6.0] — 2026-06-05

### Changed
- **Removed integration test runner button:** Cleaned up the Chrome Extension popup UI by removing the "Run Tests" button, related CSS classes, and event listener, keeping the test runner code local-only.

### Improved
- **Cleaned up duplicate code:** Refactored duplicate click handlers in `popup.js` to share a common `openViewer` helper function.

## [3.5.9] — 2026-05-29

### Fixed
- **Secure sandboxed localStorage (safeStorage helper):** Wrapped all custom extension `localStorage` reads and writes in a robust catch-all safety wrapper. This prevents `SecurityError` DOMExceptions and runtime crashes when running under sandboxed local schemes (like iframe testing environments).

### Added
- **Automated Custom Button Verification Tests:** Added a comprehensive automated integration test suite ("Test 6") in the test runner that asserts and verifies the click and toggle states of all custom buttons one-by-one (Theme cycling, sidebar Pages/Bookmarks, Single-page layout, Scroll mode, Fullscreen view, Top toolbar hide/show, Auto-hide timer, and SpeechSynthesis).

## [3.5.8] — 2026-05-29

### Fixed
- **Quiet L10n Warning Spam:** Commented out noisy `[fluent]` translation console warnings in `viewer.mjs` to keep Chrome's Developer Tools console clean and free of hundreds of missing translation warnings.

## [3.5.7] — 2026-05-29

### Fixed
- **Theme Cycling DOMException:** Checked that class names are not empty before passing them to `classList.remove` during theme initialization and cycling, preventing a standard `DOMException` when loading the Light theme.

## [3.5.6] — 2026-05-29

### Added
- **Restored File Scheme Access Warning:** Added back the helpful warning card container and associated checking logic to the extension popup to guide users on enabling local file scheme access for drag-and-drop.

## [3.5.5] — 2026-05-29

### Fixed
- **Uncaught SyntaxError (Illegal break statement):** Removed an accidental extra closing brace in the onKeyDown escape key handler inside `viewer.mjs` that had broken JavaScript compilation when opening files.

## [3.5.4] — 2026-05-29

### Added
- **Bundled Sample PDF Testing:** Switched the integration test suite to fetch and load the local bundled `test/pdf-sample_0.pdf` resource via `chrome.runtime.getURL()` instead of requesting it from AWS S3 over the network. This makes the entire test runner fully offline-capable, highly secure, and exceptionally performant.

## [3.5.3] — 2026-05-29

### Improved
- **Static Integration Test Versioning:** Statically hardcoded the current version number (`v3.5.3`) directly into the HTML `<title>` and `<h1>` headings of the test runner so that the version is clearly visible even when running under the fallback `file://` protocol where dynamic manifest-retrieval is blocked.

## [3.5.2] — 2026-05-29

### Added
- **Convenient Integration Testing Quick-Launch:** Added a gorgeous purple "Run Tests" button directly in the extension popup. This button opens the integration tests page inside the correct Chrome extension context automatically, avoiding the manual and error-prone process of copying the Extension ID and navigating to it manually.
- **Enhanced Test Environment Diagnostics:** Updated the environment error warning on the testing page to clearly guide developers on how to use the new popup button or load the unpacked extension.

## [3.5.1] — 2026-05-29

### Fixed
- **Clean UI (Removed File Access Warning Card):** Completely removed the local file access warning card container and associated checking logic from the popup. The interface is now clean and non-blocking under all user conditions.

## [3.5.0] — 2026-05-29

### Fixed
- **Instant PDF Loading (Optimized Form Detection):** Replaced the slow sequential page-by-page annotation scanning loop with a fast, non-blocking check utilizing the pre-parsed catalog metadata (`pdfDoc.getMetadata()`). This completely resolves PDF opening hangs and loading screen suppression on all files.

## [3.4.9] — 2026-05-28

### Fixed
- **Robust Local PDF Loading (`file://` URLs):** Added a main-thread XMLHttpRequest bypass to load local PDF documents on Windows/OS correctly. This avoids Chrome's Web Worker CORS restrictions and ensures double-clicked local files load successfully.
- **Clean Empty Workspace:** Removed loading failure overlays when launching a blank viewer by only loading documents when a valid file query parameter is present.

## [3.4.8] — 2026-05-28

### Fixed
- **Direct Fetch for Remote PDFs:** Replaced all message-passing relay mechanisms (Uint8Array, Cache Storage, Base64) with a simple direct `await fetch()` from the extension page's main thread. Extension pages inherit `host_permissions` from `manifest.json`, so they can fetch cross-origin natively — the real problem was that PDF.js's internal **Web Worker** does not inherit those permissions. Fetching on the main thread and handing the raw bytes via `data:` bypasses the Worker entirely.
- **Two-Layer Fallback:** If the direct fetch fails for any reason, the viewer automatically falls back to a service-worker relay (base64) and then to the original URL passthrough, ensuring PDFs always attempt to load.

### Added
- **Comprehensive Diagnostic Test Suite:** Rewrote `test/test_runner.html` with 4 independent tests that isolate each layer: direct fetch, chrome.runtime availability, service-worker relay, and PDFViewerApplication.open() acceptance.

## [3.4.7] — 2026-05-28

### Fixed
- **100% Compatible Base64 Message Transport:** Shifted from shared `Cache Storage` to a highly robust, chunked Base64 message passing channel. This avoids all profile/storage partitioning issues in Chrome service workers, ensuring remote PDF documents open instantly and reliably.
- **Responsive UI Initialization:** Ensured that a failed or slow remote document load cannot lock up top and side toolbars, maintaining fully functional UI buttons under all conditions.

### Added
- **Integration Test Upgrades:** Updated `test/test_runner.html` to fully assert and verify Base64 byte-chunked messaging integrity and signature magic bytes.

## [3.4.6] — 2026-05-28

### Fixed
- **Zero-Copy Cache Storage Transport:** Replaced extension messaging binary serialization with a highly efficient browser native `Cache Storage` channel for remote PDF loads. This completely solves JSON serialization limitations and stack limits when sending `Uint8Array` data, allowing PDFs of any size to load instantly and reliably.

### Added
- **Extension Integration Tests:** Added a fully automated integration test suite located at `test/test_runner.html` to systematically verify service worker message passing, Cache Storage transactions, and PDF signature headers.

## [3.4.5] — 2026-05-27

### Fixed
- **Remote PDF Loading (CORS Bypass):** Routed remote HTTP/HTTPS PDF fetches through the background service worker using message passing. This successfully bypasses browser CORS restrictions, allowing remote PDFs like standard USDA samples to load seamlessly rather than displaying a blank grey space.

## [3.4.4] — 2026-05-27

### Fixed
- **Robust Defensive Initialization:** Wrapped custom extensions in safe, isolated `try/catch` blocks to guarantee a single failing button/listener never crashes PDF.js loading ("nothing happens").
- **High-Contrast Toolbar Icons:** Updated top toolbar custom labeled buttons, About, Donate, and secondary toolbar buttons to use dynamic `--toolbar-icon-bg-color`, automatically adopting system light/dark theme contrast.
- **Consistent Sidebar Colors:** Mapped left vertical toolbar background and icons to `var(--toolbar-bg-color)` and `var(--toolbar-icon-bg-color)` respectively, giving it identical coloring to the top toolbar in all themes.
- **Reliable Action Bindings:** Verified and correctly mapped all event listeners to custom DOM elements like theme cycling, single page, and scroll mode toggle.

## [3.4.0] — 2026-05-22

### Added
- **Left Vertical Toolbar:** Introduced a gorgeous, fully themed vertical sidebar layout on the left of the main viewport to house key features, decluttering the top toolbar while grouping interactive controls perfectly:
  - *Navigation & Access Group:* Pages/Thumbnails toggle and Bookmarks panel toggle.
  - *Viewing Customizations Group:* Read Aloud, Theme cycling, Single-page view, and Scroll mode toggling.
  - *App Layout Controls Group:* Fullscreen toggle, Hide Top Toolbar, and Auto-hide Toolbar toggle.
- **Custom Sidebar Bookmarks Panel:** Added support for switching the views manager programmatically to a custom "Bookmarks" view. Bookmarks are persisted in localStorage, easily navigated, and synchronise flawlessly with standard panel views and headers.

### Improved
- **Seamless Layout Shifts:** Handled vertical coordinates dynamically using custom CSS layout overrides, ensuring that `viewsManager` and `viewerContainer` shift smoothly when open/closed, without overlapping or leaving blank/frozen regions.
- **Hide Toolbar Refinements:** Collapse of top toolbar is fully animated via a class toggle on `#outerContainer`, sliding the left vertical toolbar and viewer all the way up.
- **Responsive Fullscreen Overrides:** Fullscreen mode hides the vertical toolbar automatically to maximize screen space for a truly premium reading experience.
- **Popup UI Enhancement:** Clarified popup description to say "Open Local PDF" on the secondary workspace button.

## [3.1.10] — 2026-04-04

### Security / correctness

- **`validateFileURL`:** Restored an extension-specific check: only `http:`, `https:`, `file:`, `blob:`, and `chrome-extension:` URLs may be passed as `?file=` (blocks `javascript:`, `data:`, and other schemes). Web PDFs and local files remain supported.
- **Printing:** Print permission race now **fails closed** if `printingallowed` does not resolve within 2 seconds (no silent override of print restrictions).
- **Editable-PDF toast:** Removed incorrect use of `pdfDoc.hasJSActions` as a property; pure-XFA detection uses `isPureXfa` only (AcroForm widgets are still detected per page).

### Fixed

- **Print fallback:** Iframe fallback print removes the iframe on `afterprint` (with a long fallback timeout), avoiding premature removal while the dialog is open.

### Docs / UX

- Popup: added `<title>`, normalized `popup.js` line endings to LF.
- README: notes on **file URL** access and Chrome Web Store host-permission expectations.

## [3.1.9] — 2026-03-28

### Fixed

- **Background:** Only redirect **top-level tab** navigations to the Freedom viewer (`frameType: outermost_frame`, or legacy `frameId` / `parentFrameId` heuristics). Lazy-loaded PDF **iframes** and other **subframe** loads no longer hijack the tab when you scroll an embedded document into view.
- **Viewer:** Overflow menu “Save” control (`secondarySave`) now dispatches **save** (with the save icon) instead of being wired as **download**.

## [3.1.8] — 2026-03-28

### Fixed

- Extension toolbar icons: removed the outer white ring, tightened cropping so the logo reads larger at 16px, added a 32px icon, and improved transparency for Chrome’s dark toolbar.
- PDF viewer: toolbar Save control now uses a proper mask icon (floppy disk glyph) instead of a blank light block; wired the Save button to the save action in the viewer.
- Release packaging: `build.sh` now derives the output zip name from `VERSION` so the archive always matches the manifest.
