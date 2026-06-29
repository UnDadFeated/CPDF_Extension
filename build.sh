#!/usr/bin/env bash
set -euo pipefail

VERSION="3.6.4"
OUTPUT_ZIP="Freedom_PDF_Viewer_v${VERSION}.zip"

echo "Building Freedom PDF Viewer v${VERSION} for release..."

# Remove old zip if it exists
rm -f "$OUTPUT_ZIP"

export VERSION
# Use python3 (always available) to create the zip
python3 - <<'PYEOF'
import os
import zipfile

version = os.environ["VERSION"]
output = f"Freedom_PDF_Viewer_v{version}.zip"
include_roots = ["popup", "pdfjs", "icons"]
include_files = ["manifest.json", "README.md", "PRIVACY.md", "CHANGELOG.md", "background.js"]
exclude_exts  = {".pyc", ".map"}
exclude_names = {".DS_Store", ".gitignore", "debugger.css", "debugger.mjs"}

with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as zf:
    for root_dir in include_roots:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            # Skip hidden dirs in-place
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
PYEOF

echo ""
echo "Build complete! Successfully created ${OUTPUT_ZIP}"
echo "You can now upload this archive to the Chrome Web Store."
