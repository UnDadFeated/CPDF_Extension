# Privacy Policy — Freedom PDF Viewer

**Last updated: February 26, 2026**

## Overview

Freedom PDF Viewer ("the Extension") is a Chrome extension that allows you to open, view, annotate, and save PDF files directly within your browser. Your privacy is a core design principle of this extension.

## Data Collection

**Freedom PDF Viewer does not collect, transmit, store, or share any personal data.**

- No user accounts are required.
- No analytics or telemetry are embedded.
- No data is sent to any external server at any time.

## How Your Data Is Used

| Data Type | Collected? | Purpose |
|---|---|---|
| PDF file contents | ❌ No | Files are processed entirely within your local browser using Mozilla PDF.js |
| Browsing history | ❌ No | The extension only intercepts navigations to `.pdf` URLs on your machine |
| Personal information | ❌ No | None required or requested |
| Cookies | ❌ No | None set or read |

## Local Storage

The extension uses Chrome's `storage` API solely to persist your viewer preferences (e.g., zoom level, scroll mode) across sessions. This data never leaves your device.

## Permissions Justification

| Permission | Reason |
|---|---|
| `storage` / `unlimitedStorage` | Save viewer preferences locally |
| `webNavigation` | Detect when a `.pdf` URL is navigated to, so it can be opened in the viewer |
| `tabs` / `activeTab` | Redirect the current tab to the built-in PDF viewer |
| `host_permissions: file:///*` | Access local PDF files dragged and dropped into Chrome |

## Third-Party Code

This extension uses [Mozilla PDF.js](https://mozilla.github.io/pdf.js/) (Apache 2.0 License) to render PDF files. PDF.js operates 100% locally and makes no external network requests.

## Changes to This Policy

If this policy is ever updated, the "Last updated" date above will reflect the change. As no data is collected, significant changes to this policy are unlikely.

## Contact

For questions or concerns, please open an issue on the [GitHub repository](https://github.com/UnDadFeated/Freedom_PDF_Viewer).
