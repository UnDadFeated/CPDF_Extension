$manifest = Get-Content -Raw -Path "manifest.json" | ConvertFrom-Json
$VERSION = $manifest.version
$OUTPUT_ZIP = "Freedom_PDF_Viewer_v${VERSION}.zip"

Write-Host "Building Freedom PDF Viewer v${VERSION} for release..."

if (Test-Path $OUTPUT_ZIP) {
    Remove-Item $OUTPUT_ZIP
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$excludeExts = @('.pyc', '.map')
$excludeNames = @('.DS_Store', '.gitignore', 'debugger.css', 'debugger.mjs')
$includeRoots = @('popup', 'pdfjs', 'icons')
$includeFiles = @('manifest.json', 'README.md', 'PRIVACY.md', 'CHANGELOG.md', 'background.js')

$zip = [System.IO.Compression.ZipFile]::Open($OUTPUT_ZIP, [System.IO.Compression.ZipArchiveMode]::Create)

try {
    # Add directories
    foreach ($root in $includeRoots) {
        if (Test-Path $root) {
            $parentLength = (Get-Item $root).Parent.FullName.Length
            $files = Get-ChildItem -Path $root -Recurse -File
            foreach ($file in $files) {
                if ($excludeExts -contains $file.Extension) { continue }
                if ($excludeNames -contains $file.Name) { continue }
                
                # Compute relative path for the zip entry
                $relative = $file.FullName.Substring($parentLength + 1)
                # Convert backslashes to forward slashes for zip compatibility
                $relative = $relative.Replace('\', '/')
                
                $null = [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $relative)
            }
        }
    }
    # Add top-level files
    foreach ($f in $includeFiles) {
        if (Test-Path $f) {
            $file = Get-Item $f
            $relative = $file.Name
            $null = [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $relative)
        }
    }
    Write-Host "  -> Wrote $OUTPUT_ZIP"
}
finally {
    $zip.Dispose()
}

Write-Host ""
Write-Host "Build complete! Successfully created ${OUTPUT_ZIP}"
Write-Host "You can now upload this archive to the Chrome Web Store."
