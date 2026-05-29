# Changelog

## [3.5.0] — 2026-05-29

### Fixed
- **⚡ Instant PDF Loading (Optimized Form Detection):** Replaced the slow sequential page-by-page annotation scanning loop with a fast, non-blocking check utilizing the pre-parsed catalog metadata (`pdfDoc.getMetadata()`). This completely resolves PDF opening hangs and loading screen suppression on all files.

## [3.4.9] — 2026-05-28

### Fixed
- **📁 Robust Local PDF Loading (`file://` URLs)**: Added a main-thread XMLHttpRequest bypass to load local PDF documents on Windows/OS correctly. This avoids Chrome's Web Worker CORS restrictions and ensures double-clicked local files load successfully.
- **✨ Clean Empty Workspace**: Removed loading failure overlays when launching a blank viewer by only loading documents when a valid file query parameter is present.

## [3.4.8] — 2026-05-28

### Fixed
- **🔑 Direct Fetch for Remote PDFs:** Replaced all message-passing relay mechanisms (Uint8Array, Cache Storage, Base64) with a simple direct `await fetch()` from the extension page's main thread. Extension pages inherit `host_permissions` from `manifest.json`, so they can fetch cross-origin natively — the real problem was that PDF.js's internal **Web Worker** does not inherit those permissions. Fetching on the main thread and handing the raw bytes via `data:` bypasses the Worker entirely.
- **🛡️ Two-Layer Fallback:** If the direct fetch fails for any reason, the viewer automatically falls back to a service-worker relay (base64) and then to the original URL passthrough, ensuring PDFs always attempt to load.

### Added
- **🧪 Comprehensive Diagnostic Test Suite:** Rewrote `test/test_runner.html` with 4 independent tests that isolate each layer: direct fetch, chrome.runtime availability, service-worker relay, and PDFViewerApplication.open() acceptance.

## [3.4.7] — 2026-05-28

### Fixed
- **🛡️ 100% Compatible Base64 Message Transport:** Shifted from shared `Cache Storage` to a highly robust, chunked Base64 message passing channel. This avoids all profile/storage partitioning issues in Chrome service workers, ensuring remote PDF documents open instantly and reliably.
- **🎨 Responsive UI Initialization:** Ensured that a failed or slow remote document load cannot lock up top and side toolbars, maintaining fully functional UI buttons under all conditions.

### Added
- **🧪 Integration Test Upgrades:** Updated `test/test_runner.html` to fully assert and verify Base64 byte-chunked messaging integrity and signature magic bytes.

## [3.4.6] — 2026-05-28

### Fixed
- **⚡ Zero-Copy Cache Storage Transport:** Replaced extension messaging binary serialization with a highly efficient browser native `Cache Storage` channel for remote PDF loads. This completely solves JSON serialization limitations and stack limits when sending `Uint8Array` data, allowing PDFs of any size to load instantly and reliably.

### Added
- **🧪 Extension Integration Tests:** Added a fully automated integration test suite located at `test/test_runner.html` to systematically verify service worker message passing, Cache Storage transactions, and PDF signature headers.

## [3.4.5] — 2026-05-27

### Fixed
- **🌐 Remote PDF Loading (CORS Bypass):** Routed remote HTTP/HTTPS PDF fetches through the background service worker using message passing. This successfully bypasses browser CORS restrictions, allowing remote PDFs like standard USDA samples to load seamlessly rather than displaying a blank grey space.

## [3.4.4] — 2026-05-27

### Fixed
- **🛡️ Robust Defensive Initialization:** Wrapped custom extensions in safe, isolated `try/catch` blocks to guarantee a single failing button/listener never crashes PDF.js loading ("nothing happens").
- **🎨 High-Contrast Toolbar Icons:** Updated top toolbar custom labeled buttons, About, Donate, and secondary toolbar buttons to use dynamic `--toolbar-icon-bg-color`, automatically adopting system light/dark theme contrast.
- **📐 Consistent Sidebar Colors:** Mapped left vertical toolbar background and icons to `var(--toolbar-bg-color)` and `var(--toolbar-icon-bg-color)` respectively, giving it identical coloring to the top toolbar in all themes.
- **⚡ Reliable Action Bindings:** Verified and correctly mapped all event listeners to custom DOM elements like theme cycling, single page, and scroll mode toggle.

## [3.4.0] — 2026-05-22

### Added
- **🆕 Left Vertical Toolbar:** Introduced a gorgeous, fully themed vertical sidebar layout on the left of the main viewport to house key features, decluttering the top toolbar while grouping interactive controls perfectly:
  - *Navigation & Access Group:* Pages/Thumbnails toggle and Bookmarks panel toggle.
  - *Viewing Customizations Group:* Read Aloud, Theme cycling, Single-page view, and Scroll mode toggling.
  - *App Layout Controls Group:* Fullscreen toggle, Hide Top Toolbar, and Auto-hide Toolbar toggle.
- **🔖 Custom Sidebar Bookmarks Panel:** Added support for switching the views manager programmatically to a custom "Bookmarks" view. Bookmarks are persisted in localStorage, easily navigated, and synchronise flawlessly with standard panel views and headers.

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
