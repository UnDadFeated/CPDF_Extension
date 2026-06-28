# Plan: Advanced Offline PDF Features for Freedom PDF Viewer

This document provides a plan to add key advanced offline PDF utility features to Freedom PDF Viewer without breaking the app.

---

## 1. Feature Analysis and Offline Feasibility

Below is an analysis of standard advanced PDF features and their feasibility for our client-side Chrome Extension:

| Advanced Feature | Status in Freedom PDF Viewer | Feasibility & Notes for Client-Side Chrome Extension | Action Plan |
|---|---|---|---|
| **Content editing** (edit text/images in-place) | ❌ No | **Not Feasible**: PDF.js is a rendering engine, not a stream layout editor. In-place content editing requires rendering reflow and PDF stream rewriting, which is too complex for basic client-side JS without heavy native binaries. | Skip |
| **True redaction + auto-redact** | ❌ No | **Not Feasible**: True redaction requires deleting elements from the underlying PDF page streams. Unfeasible without heavy PDF parser libraries. | Skip |
| **Annotations** (Highlight, underline, comments, shapes) |  Yes | Supported natively by PDF.js annotation editor. | Already Present |
| **Draw & markup** (Freehand, shapes) |  Yes | Supported natively by PDF.js annotation editor. | Already Present |
| **Form builder** (Create forms) | ❌ No | **Not Feasible**: Creating form field structures and interactive widgets in PDF trees is highly complex. | Skip |
| **Form filling** |  Yes | Supported natively by PDF.js and auto-saved in Freedom. | Already Present |
| **Electronic signing** (Saved signatures) | ❌ No | **Highly Feasible**: Although PDF.js has a built-in `SignatureManager`, it is incomplete/disabled. We can create a custom drawing canvas modal, save drawn signatures in `localStorage` as base64 PNGs, and insert them as Stamp (Image) annotations. | **Implement** |
| **Compression** | ❌ No | **Not Feasible**: Requires stream compression algorithms and rebuilding cross-reference tables. | Skip |
| **Split & Merge** | ⚠️ Partial (Split/Extraction only) | **Highly Feasible**: Page extraction (split) is implemented. We can implement **Merge PDF** by prompting the user to select another file, reading its bytes, and appending its pages using `pdfDoc.extractPages()`. | **Implement** |
| **Watermarks** | ❌ No | **Highly Feasible**: We can programmatically create a text annotation or stamp at the center of every page. When the user saves/downloads the PDF, the watermark is permanently embedded. | **Implement** |
| **Conversion** (PDF ↔ Images, PDF → Word) | ❌ No | **Partially Feasible (PDF → Images)**: PDF to Images is easy. We can render pages to canvas, convert to Data URLs, and download them. PDF to Word is not feasible. | **Implement (PDF → Images)** |
| **Page organization** (Reorder, Rotate, Delete) | ⚠️ Partial (Visual reordering and visual rotate only) | **Highly Feasible**: Right now, page reordering is "visual only". We can convert this into **True page reordering** and **Page deletion** by calling the worker's `pdfDoc.extractPages()` method with the modified page layout and reloading the document in-memory. | **Implement** |
| **OCR** (Optical Character Recognition) | ❌ No | **Not Feasible**: Heavy offline libraries like Tesseract.js violate Extension CSP policies regarding Web Workers/external code. | Skip |
| **Find & Replace** | ❌ No | **Not Feasible**: Requires parsing and rewriting text commands in the PDF page streams. | Skip |
| **Tabbed Viewer** | ❌ No | **Not Needed**: Since it is a Chrome Extension, browser tabs already serve as the tabbed viewer. | Skip |
| **Metadata editor** | ❌ No | **Not Feasible**: Modifying document properties dictionary in the PDF bytes is not supported by standard PDF.js output. | Skip |
| **Links & bookmarks** |  Yes | Supported natively (links) and via custom storage (bookmarks). | Already Present |
| **Document scanning** | ❌ No | **Not Feasible**: Accessing scanners and doing perspective correction is too heavy for extension scope. | Skip |

---

## 2. Selected Features to Implement

We will implement the following 5 features. Because Freedom PDF Viewer is a Chrome Extension running completely client-side in browser tabs, these features will be built purely in vanilla JS, HTML, and CSS:

1. **True Page Reordering & Page Deletion**
   - Enhance the thumbnail sidebar with a "Delete Page" (trash icon) button on hover for each thumbnail.
   - Upgrade visual reordering (drag-and-drop) to actually modify the document.
   - When the layout changes, we compute the new page map, call `pdfDoc.extractPages(...)` with the new indices/layout, and call `PDFViewerApplication.open({ data: newPdfBytes, originalUrl: PDFViewerApplication.url })` to reload the document in-memory. When the user saves (Ctrl+S), the reordered/deleted pages are truly saved!

2. **Electronic Signing (Saved Signatures)**
   - Add a custom "Signature" button in the annotation toolbar or sidebar.
   - Build a modal overlay with a canvas signature pad.
   - Let the user draw a signature, type a signature (using cursive fonts), or upload an image.
   - Save up to 5 signatures in `localStorage` as base64 PNGs.
   - When a signature is selected, inject it as an image stamp annotation onto the active page, allowing the user to resize and position it anywhere.

3. **Merge PDF**
   - Add a "Merge PDF" button to the secondary toolbar.
   - Prompt the user to select another local PDF file.
   - Read the selected file as an ArrayBuffer, load it as a secondary document, and use `extractPages` to merge the pages of both documents.
   - Reload the viewer with the merged PDF bytes.

4. **Watermarking**
   - Add a "Watermark" button to the secondary toolbar.
   - Open a simple form prompt for watermark text (e.g. "CONFIDENTIAL" or "DRAFT"), font size, text color, angle, and opacity.
   - Programmatically add a text annotation to the center of every page in `pdfDocument.annotationStorage` so it is permanently embedded when saving or printing.

5. **Convert PDF to Images (Export to Images)**
   - Add an "Export as Images" button to the secondary toolbar.
   - Loop through all pages of the document, render them to offline canvases at high resolution, and trigger downloads of the page images (or bundle them as a ZIP).

---

## 3. Implementation Workflow & UI Details

### Component A: HTML Toolbar Updates
- Modify [viewer.html](file:///c:/Users/jc/Documents/Projects/FreedomPDFViewer/pdfjs/web/viewer.html) to:
  - Add "Merge", "Watermark", "Export Images", and "Sign" buttons to the secondary toolbar.
  - Insert CSS/HTML dialog markups for the Signature Drawer canvas modal and the Watermark properties prompt.
  - Add a trash-can delete button to the thumbnail view template structure (or create it dynamically in JS).

### Component B: CSS Styling Updates
- Modify [viewer.css](file:///c:/Users/jc/Documents/Projects/FreedomPDFViewer/pdfjs/web/viewer.css) to add:
  - Styles for the signature canvas pad (drawing line thickness, clear button, grid).
  - Hover states for thumbnails with the Delete Page trash-can overlay.
  - Form field inputs for the watermark modal.

### Component C: Custom JS Extension Block
- Modify the Custom Extensions block at the bottom of [viewer.mjs](file:///c:/Users/jc/Documents/Projects/FreedomPDFViewer/pdfjs/web/viewer.mjs) to implement the runtime logics:
  - Canvas drawing engine for signatures.
  - Page mapping logic using `pdfDoc.extractPages()`.
  - Merging handler loading external file arrays.
  - Watermark batch annotation injector.
  - Page canvas exporter.

---

## 4. Verification Plan

### Manual Verification Steps
1. **True Page Reordering & Deletion**: Drag thumbnails in the sidebar, click a page's delete button, verify the viewer reloads, and click Ctrl+S. Re-open the downloaded file to verify the layout is permanently changed.
2. **Electronic Signing**: Click "Sign", draw a signature, click "Add", and drag/resize the signature on the page. Save the document and verify the signature is embedded.
3. **Merge PDF**: Click "Merge PDF", upload a second PDF, and verify that the page count increases and pages are appended.
4. **Watermark**: Click "Watermark", type text, and verify a faded diagonal watermark is stamped across all pages.
5. **Convert to Images**: Click "Export as Images", and verify PNG files are downloaded for each page.
