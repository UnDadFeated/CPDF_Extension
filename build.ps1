$VERSION = "3.4.4"
$OUTPUT_ZIP = "Freedom_PDF_Viewer_v${VERSION}.zip"

Write-Host "Building Freedom PDF Viewer v${VERSION} for release..."

if (Test-Path $OUTPUT_ZIP) {
    Remove-Item $OUTPUT_ZIP
}

python3 -c @"
import os, zipfile

version = "$VERSION"
output = f"Freedom_PDF_Viewer_v{version}.zip"
include_roots = ["popup", "pdfjs", "icons"]
include_files = ["manifest.json", "README.md", "PRIVACY.md", "CHANGELOG.md", "background.js"]
exclude_exts  = {".pyc", ".map"}
exclude_names = {".DS_Store", ".gitignore", "debugger.css", "debugger.mjs"}

with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as zf:
    for root_dir in include_roots:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            dirnames[:] = [d for d in dirnames if not d.startswith(".")]
            for fname in filenames:
                if fname in exclude_names:
                    continue
                ext = os.path.splitext(fname)[1]
                if ext in exclude_exts:
                    continue
                fpath = os.path.join(dirpath, fname)
                zf.write(fpath)
    for fpath in include_files:
        if os.path.isfile(fpath):
            zf.write(fpath)

print(f"  -> Wrote {output}")
"@

Write-Host ""
Write-Host "Build complete! Successfully created ${OUTPUT_ZIP}"
Write-Host "You can now upload this archive to the Chrome Web Store."
