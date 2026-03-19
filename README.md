# Freedom PDF Viewer Extension (v3.1.6)

![Version](https://img.shields.io/badge/version-3.1.6-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-orange.svg)

A lightning-fast, ultra-lightweight PDF reader and annotator built as a Chrome Extension. Designed for privacy, speed, and memory efficiency, it allows you to intercept local PDFs, draw freehand, and insert custom text without ever sending your data to a server.

## ✨ Features

- **🔒 100% Offline & Private:** Built natively with the official Mozilla `pdf.js` distribution. Your documents never leave your browser.
- **🛡️ Secure Processing:** Includes a strict Content Security Policy (CSP) to isolate processes and intercept validation logic to mitigate malicious injections.
- **🔀 Dedicated Workspace:** Open the extension and drag any `.pdf` directly into the dedicated workspace.
- **🖊️ Rich Annotation Tools:** Use built-in PDF.js tools for freehand ink drawing, erasing, adding signatures, and injecting text natively.
- **⚡ Blazing Fast:** Designed to be memory-efficient and open PDFs instantly.
- **💾 Easy Saving:** Save your annotated PDFs (with annotations flattened) back to your computer with a single click via the **Save** button, or download the raw file via the **Download** button.
- **📄 Default PDF Viewer:** Automatically intercepts PDF links (http/https), local file opens, and PDFs dragged and dropped into Chrome — opening them all in the Freedom viewer instead of Chrome's built-in renderer.

## 🚀 Getting Started

1. Download the [Freedom_PDF_Viewer_v3.1.6.zip](https://github.com/UnDadFeated/Freedom_PDF_Viewer/releases) from the Releases page.
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

It will compress the necessary files into `Freedom_PDF_Viewer_v3.1.6.zip`, deliberately excluding development files like `.git`.

## 🔐 Permissions

This extension requests only the minimum permissions necessary:

| Permission | Purpose |
| --- | --- |
| `file:///` (host permission) | Access local `.pdf` files opened or dragged into the browser |
| `http://*/*`, `https://*/*` (host permissions) | Intercept PDF links on any website |
| `webNavigation` | Detect navigations to PDF URLs before Chrome's built-in viewer takes over |
| `tabs` | Redirect the current tab to the Freedom PDF viewer |

> **Note:** All permissions are the minimum required. No browsing history, page content, or personal data is collected or transmitted.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/UnDadFeated/Freedom_PDF_Viewer/issues) if you want to contribute.

## 📝 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

This project utilizes [PDF.js](https://mozilla.github.io/pdf.js/) by Mozilla, which is licensed under the Apache License 2.0.
