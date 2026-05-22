# Freedom PDF Viewer Extension (v3.4.0)

![Version](https://img.shields.io/badge/version-3.4.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-orange.svg)

A lightning-fast, ultra-lightweight PDF reader and annotator built as a Chrome Extension. Designed for privacy, speed, and memory efficiency, it allows you to intercept local PDFs, draw freehand, and insert custom text without ever sending your data to a server.

## ✨ Features

- **🔒 100% Offline & Private:** Built natively with the official Mozilla `pdf.js` distribution. Your documents never leave your browser.
- **🛡️ Secure Processing:** Includes a strict Content Security Policy (CSP) to isolate processes and intercept validation logic to mitigate malicious injections.
- **🆕 Left Vertical Toolbar:** Declutters the top toolbar and groups key viewing tools (Pages/Thumbnails, Bookmarks panel, Read Aloud, Theme cycling, Single-page view, Scroll mode toggling, Fullscreen, and Hide Toolbar/Auto-hide actions) into a beautiful, grouped left sidebar with icon-on-top, label-on-bottom layouts.
- **🔖 Sidebar Bookmarks Panel:** Save current pages with a click or Ctrl+B, and easily manage them in the new custom "Bookmarks" view.
- **📂 Open from Popup:** Click "Open Local PDF" in the extension popup to browse and open a PDF — no drag-and-drop needed.
- **🖱️ Right-Click to Open:** Right-click any PDF link on a web page and select "Open with Freedom PDF Viewer" to view it directly.
- **🗑️ Delete Annotations:** Select an annotation and click the trash icon (or press Ctrl+D / Backspace) to remove it.
- **🖊️ Rich Annotation Tools:** Use built-in PDF.js tools for freehand ink drawing, erasing, adding signatures, and injecting text natively.
- **⚡ Blazing Fast:** Designed to be memory-efficient and open PDFs instantly.
- **💾 Easy Saving:** Save your annotated PDFs (with annotations flattened) back to your computer with a single click via the **Save** button, or download the raw file via the **Download** button.
- **📄 Default PDF Viewer:** Automatically intercepts PDF links (http/https), local file opens, and PDFs dragged and dropped into Chrome — opening them all in the Freedom viewer instead of Chrome's built-in renderer.

## 🚀 Getting Started

1. Download the [Freedom_PDF_Viewer_v3.4.0.zip](https://github.com/UnDadFeated/Freedom_PDF_Viewer/releases) from the Releases page.
2. Unzip the file into a folder on your computer.
3. Open Google Chrome and navigate to `chrome://extensions/`.
4. Enable **Developer mode** in the top right corner.
5. Click **Load unpacked** and select the folder where you unzipped the extension.
6. The extension is now installed! You can now drag and drop PDFs into the browser to view them.

## 📦 Building for Release

To package the extension for upload to the Chrome Web Store, run the included `build.sh` script on Linux:

```bash
chmod +x build.sh && ./build.sh
```

It will compress the necessary files into `Freedom_PDF_Viewer_v3.4.0.zip`, deliberately excluding development files like `.git`.

## 🔐 Permissions

This extension requests only the minimum permissions necessary:

| Permission | Purpose |
| --- | --- |
| `file:///` (host permission) | Access local `.pdf` files opened or dragged into the browser |
| `http://*/*`, `https://*/*` (host permissions) | Intercept PDF links on any website |
| `webNavigation` | Detect **full-tab** navigations to PDF URLs (address bar, link opens). Embedded PDFs in iframes are left to the page. |
| `tabs` | Redirect the current tab to the Freedom PDF viewer |
| `contextMenus` | Show "Open with Freedom PDF Viewer" when you right-click a PDF link on a web page |

> **Note:** All permissions are the minimum required. No browsing history, page content, or personal data is collected or transmitted.

**Local files:** Chrome disables `file://` access for extensions until you turn on **Allow access to file URLs** under the extension’s details on `chrome://extensions`. Without it, opening or dragging a local `.pdf` into the viewer will fail.

**Chrome Web Store:** Broad `http(s)://*/*` access is required so the extension can act as a default PDF handler for links on any site. Be ready to describe that use case if the review team asks.

**Theme CSS:** The bundled PDF.js viewer stylesheet uses `light-dark()` and related modern CSS. For correct light/dark theming, use a recent Chromium-based browser (e.g. Chrome **123+**). Older versions may fall back to less accurate colors.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/UnDadFeated/Freedom_PDF_Viewer/issues) if you want to contribute.

## 📝 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

This project utilizes [PDF.js](https://mozilla.github.io/pdf.js/) by Mozilla, which is licensed under the Apache License 2.0.
