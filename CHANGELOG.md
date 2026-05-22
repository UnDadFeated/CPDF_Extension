# Changelog

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
