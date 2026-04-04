# Changelog

## [3.1.9] — 2026-03-28

### Fixed

- **Background:** Only redirect **top-level tab** navigations to the Freedom viewer (`frameType: outermost_frame`, or legacy `frameId` / `parentFrameId` heuristics). Lazy-loaded PDF **iframes** and other **subframe** loads no longer hijack the tab when you scroll an embedded document into view.
- **Viewer:** Overflow menu “Save” control (`secondarySave`) now dispatches **save** (with the save icon) instead of being wired as **download**.

### Notes (audit)

- `validateFileURL` in `viewer.mjs` is intentionally bypassed for the extension so local `file://` PDFs work; keep the viewer entry point limited to the extension’s `viewer.html` and trusted `?file=` URLs.
- Host permissions are broad (`http(s)://*/*`) by design for intercepting PDF links on any site.

## [3.1.8] — 2026-03-28

### Fixed

- Extension toolbar icons: removed the outer white ring, tightened cropping so the logo reads larger at 16px, added a 32px icon, and improved transparency for Chrome’s dark toolbar.
- PDF viewer: toolbar Save control now uses a proper mask icon (floppy disk glyph) instead of a blank light block; wired the Save button to the save action in the viewer.
- Release packaging: `build.sh` now derives the output zip name from `VERSION` so the archive always matches the manifest.
