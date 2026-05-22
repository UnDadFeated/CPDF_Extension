# Freedom PDF Viewer — Agent Notes

## Repo at a glance

- **Chrome Extension (MV3)** — wraps Mozilla PDF.js in a background service worker that intercepts PDF navigations and redirects to the viewer.
- No build system, no package manager, no tests. Plain JS/HTML/CSS.

## Architecture

| File(s) | Role |
|---|---|
| `background.js` | Service worker. Intercepts top-level PDF navigations via `chrome.webNavigation.onBeforeNavigate` (filters by `frameType` to skip iframes/embedded PDFs). Creates context menu. Redirects to viewer with `?file=` param. |
| `popup/popup.{html,js,css}` | Extension popup. "Open PDF Workspace" opens viewer; "Open Local PDF" opens a tab for drag-and-drop or file browser. |
| `pdfjs/` | Bundled Mozilla PDF.js. Core: `pdfjs/build/pdf.mjs`. UI: `pdfjs/web/viewer.{html,mjs,css}`. WASM assets (JBIG2, OpenJPEG, QCMS) in `pdfjs/`. Custom extensions at the bottom of `viewer.mjs`. |

**PDF interception:** `background.js` matches `(?i)\.pdf($|\?|#)` per-scheme (`http`, `https`, `file`). The `isTopLevelUserTabNavigation` guard checks `frameType !== 'sub_frame'` (or legacy `frameId`/`parentFrameId` for Chrome < 106) to avoid hijacking embedded PDFs. Fragments (e.g. `#page=2`) are preserved outside the `file` param.

**`isPdfNavigation`:** Uses `pathname.endsWith('.pdf')` — URLs like `/download?id=1` serving `application/pdf` are NOT intercepted unless they end in `.pdf`.

## Development

- Load unpacked: `chrome://extensions/` → Developer mode → "Load unpacked" → root folder.
- Must enable **"Allow access to file URLs"** for the extension — otherwise `file://` PDFs fail.
- Requires **Chromium 123+** for `light-dark()` CSS theming in the viewer.
- CSP: `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';` (`wasm-unsafe-eval` required for PDF.js WASM).
- VSCode recommends `pesosz.antigravity-auto-accept` (`.vscode/extensions.json`).

## Building for release

```bash
chmod +x build.sh && ./build.sh
```

Uses **python3** (not `zip` CLI). Produces `Freedom_PDF_Viewer_v{VERSION}.zip`.

**Excluded:** `.git`, `.DS_Store`, `.mjs.map`, `.css.map`, `.pyc`, `debugger.css`, `debugger.mjs`, hidden dirs.

**Included:** `manifest.json`, `background.js`, `README.md`, `PRIVACY.md`, `CHANGELOG.md`, `popup/`, `pdfjs/`, `icons/`.

**Version is hardcoded in two places:** `manifest.json` (`"version"`) and `build.sh` (`VERSION=`). Update both. The zip filename is derived from `VERSION` in build.sh.

## Gotchas

- **No `node_modules` / `npm` / `yarn`** — `pdfjs/` is a pre-bundled PDF.js copy. Never run `npm install`.
- **No linter, formatter, typechecker, or tests.** Zero tooling beyond `build.sh`.
- `viewer.mjs` is ~19k lines — editing it requires patience. `viewer.html` is a thin shell.
- `build.sh` uses explicit `include_roots` and `include_files` arrays — new top-level files go in `include_files`.
- New zip artifacts in `.gitignore` (`.zip`).

## Custom Features (Freedom PDF Viewer extensions)

All custom extensions are at the bottom of `viewer.mjs` (~line 19459+), after `PDFViewerApplication.run(config)`.

### Keyboard shortcuts

| Shortcut | Action |
|---|---|
| Ctrl+S | Save (embeds annotations) |
| Ctrl+D | Delete selected annotations |
| Ctrl+F | Toggle fullscreen |
| Ctrl+B | Bookmark current page |
| Ctrl+O | Open file |
| Ctrl+P | Presentation mode |
| Ctrl+/− | Zoom in/out |
| Ctrl+H | Hide/show toolbar |
| Ctrl+1 | Single-page view |
| Ctrl+2 | Continuous scroll mode |
| Ctrl+3 | Horizontal scroll mode |
| Escape | Close dialogs / exit fullscreen |

### Features

1. **Auto-save annotations** — Saves every 30s after annotation changes
2. **Save confirmation toast** — Shows "Saved: filename" on save
3. **Print permission toast** — Alerts when printing is blocked
4. **Fullscreen toggle** — Button in toolbar + Ctrl+F. Fullscreen overlay with sticky toolbar
5. **Bookmarks** — localStorage-persisted, rendered in sidebar (new "Bookmarks" panel). Add via toolbar button or Ctrl+B. Delete via × button on each bookmark.
6. **Page extraction** — "Extract" button in secondary toolbar. Prompts for page range, downloads extracted PDF
7. **Page reordering** — Drag-and-drop in thumbnail view (uses visual reordering only, not PDF modification)
8. **Theme cycling** — Cycle Light/Dark/Sepia/Night with toolbar button. Saved in localStorage.
9. **Single-page view** — Center single page, hide margins. Toggle button or Ctrl+1.
10. **Auto-hide toolbar** — Toolbar fades after 3s of inactivity. Toggle button or Ctrl+H.
11. **Scroll mode toggle** — Continuous vs page-by-page scroll. Toggle button or Ctrl+2/3.
12. **Zoom to page-fit on load** — Auto-adjusts to window size (unless last zoom remembered).
13. **Double-click to zoom** — Click on page to zoom in/out, double-click resets.
14. **Hide toolbar** — Toggle button or Ctrl+H for full reading mode.
15. **Text-to-speech** — Read aloud button uses browser SpeechSynthesis API, auto-advances pages.
16. **Page info tooltip** — Hover over page number to see page count + file info.
17. **Remember last zoom level** — Persisted in localStorage, restored on next load.

### Editing custom extensions

- New custom code goes in the "Freedom PDF Viewer — Custom Extensions" block
- Toast notifications via: `showToast(text, duration)` where `duration` defaults to 3000ms
- Bookmark storage key: `"freedom.pdf.bookmarks"` in localStorage
- Fullscreen overlay: `#fsOverlay` (use `visuallyHidden` class to toggle)
- The `PDFViewerApplication.eventBus` is accessed via `PDFViewerApplication.eventBus` (not `_eventBus`)
