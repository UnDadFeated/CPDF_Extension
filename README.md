# Freedom PDF Viewer v1.7

![Version](https://img.shields.io/badge/version-1.7-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-orange.svg)

A lightning-fast, ultra-lightweight PDF reader and annotator built as a Chrome Extension. Designed for privacy, speed, and memory efficiency, it allows you to intercept local PDFs, draw freehand, and insert custom text without ever sending your data to a server.

## ✨ Features

* **🔒 100% Offline & Private:** Built with bundled dependencies (`pdf.js` and `pdf-lib`). Your documents never leave your browser.
* **🚀 Memory Efficient:** Utilizes `IntersectionObserver` to only render PDF pages currently visible on screen. Off-screen canvases are dynamically destroyed to free up GPU and RAM.
* **🔀 Local File Interception:** Drag and drop any `.pdf` directly into Chrome, and it will automatically be routed to the custom high-performance workspace.
* **🖊️ Freehand Drawing:** Native Canvas path recording translates directly into true bezier SVG vectors in the exported PDF Document.
* **📝 Text Injection:** Native HTML5 `contenteditable` overlays allow you to type directly onto the page.
* **🎨 Customization:** Full HTML5 color pickers and size controls for both the text and drawing tools.
* **🌙 Dark Mode:** A stunning, pure-black OLED-friendly dark mode interface.
* **💾 "Save As" Export:** All annotations are burned directly into the raw PDF binary for universal compatibility with all major PDF viewers.

## 🛠️ Installation (Developer Mode)

1. Clone or download this repository.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the top right corner.
4. Click **Load unpacked** and select the directory containing this extension.
5. **Crucial:** Click "Details" on the installed extension and toggle on **Allow access to file URLs** (This enables drag-and-drop support).

## 🚀 Usage

* **Open a file:** Click the `Open PDF` button in the toolbar, or drag and drop a PDF file from your computer directly into a new browser tab.
* **Add Text:** Select the `Type Text` tool, pick a color and text size, and click anywhere on the document to start typing.
* **Draw freehand:** Select the `Draw` tool, pick a brush thickness and color, and draw natively on the page.
* **Save your work:** Click the `Save PDF` button to permanently burn your annotations into the file and download it.
* **Print:** Use the `Print` button for a clean, UI-free hard copy of your document.

## 📦 Building for Release

To package the extension for upload to the Chrome Web Store, simply run the included `build.bat` script on Windows. It will securely compress the necessary files into `Freedom_PDF_Viewer_v1.7.zip`, deliberately excluding development files like `.git`.

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
