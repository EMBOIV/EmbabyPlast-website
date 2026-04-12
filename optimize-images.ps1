<#
.SYNOPSIS
    Image Optimization for Embaby Plast Website (no external tools needed)
    
.DESCRIPTION
    Resizes oversized PNG images and converts them to high-quality JPEG.
    Creates thumbnail versions for product catalog cards.
    Uses only built-in .NET — no Node.js, Python, or external tools required.
    
    For best results (WebP), install Node.js and run optimize-images.js instead.

.USAGE
    powershell -ExecutionPolicy Bypass -File optimize-images.ps1
#>

Add-Type -AssemblyName System.Drawing

$ImagesDir = Join-Path $PSScriptRoot "images"
$WebpDir   = Join-Path $ImagesDir "webp"
$ThumbsDir = Join-Path $ImagesDir "thumbs"

# Settings
$MaxFullWidth  = 1200     # Max width for full-size product images
$BgMaxWidth    = 1920     # Max width for background images
$ThumbWidth    = 400      # Thumbnail width for catalog cards
$JpegQuality   = 85       # JPEG quality (85 = high quality, much smaller than PNG)
$ThumbQuality  = 78

# Create output directories
if (-not (Test-Path $WebpDir))   { New-Item -ItemType Directory -Path $WebpDir   -Force | Out-Null }
if (-not (Test-Path $ThumbsDir)) { New-Item -ItemType Directory -Path $ThumbsDir -Force | Out-Null }

function Get-JpegEncoder {
    [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq 'image/jpeg' }
}

function Save-AsJpeg($image, $outputPath, $quality) {
    $encoder = Get-JpegEncoder
    $params  = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality, [long]$quality
    )
    $image.Save($outputPath, $encoder, $params)
    $params.Dispose()
}

function Resize-Image($srcPath, $destPath, $maxWidth, $quality) {
    try {
        $src = [System.Drawing.Image]::FromFile($srcPath)
        
        $newWidth  = $src.Width
        $newHeight = $src.Height
        
        if ($src.Width -gt $maxWidth) {
            $ratio     = $maxWidth / $src.Width
            $newWidth  = $maxWidth
            $newHeight = [int]($src.Height * $ratio)
        }
        
        $dest = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $g = [System.Drawing.Graphics]::FromImage($dest)
        $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.DrawImage($src, 0, 0, $newWidth, $newHeight)
        $g.Dispose()
        
        Save-AsJpeg $dest $destPath $quality
        
        $origSize = (Get-Item $srcPath).Length
        $newSize  = (Get-Item $destPath).Length
        $saved    = [math]::Round((1 - $newSize / $origSize) * 100, 1)
        
        $src.Dispose()
        $dest.Dispose()
        
        return @{ OrigKB = [math]::Round($origSize/1KB,1); NewKB = [math]::Round($newSize/1KB,1); Saved = $saved }
    }
    catch {
        Write-Warning "  Failed: $($_.Exception.Message)"
        return $null
    }
}

Write-Host "`nEmbaby Plast Image Optimizer (PowerShell)`n" -ForegroundColor Cyan
Write-Host "Note: This creates JPEG versions. For best WebP results, install Node.js and run:" -ForegroundColor Yellow
Write-Host "  npm install sharp; node optimize-images.js`n" -ForegroundColor Yellow

$files = Get-ChildItem $ImagesDir -File | Where-Object { $_.Extension -match '\.(png|jpg|jpeg)$' }
Write-Host "Found $($files.Count) images to optimize...`n"

$totalOrig = 0
$totalNew  = 0
$totalThumb = 0

foreach ($file in $files) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    $isBackground = $file.Name -match 'welcome|background'
    $maxW = if ($isBackground) { $BgMaxWidth } else { $MaxFullWidth }
    
    # Full-size optimized version
    $fullDest = Join-Path $WebpDir "$baseName.jpg"
    if (-not (Test-Path $fullDest)) {
        $result = Resize-Image $file.FullName $fullDest $maxW $JpegQuality
        if ($result) {
            Write-Host "  Full: $($file.Name) -> $baseName.jpg ($($result.OrigKB)KB -> $($result.NewKB)KB, -$($result.Saved)%)"
            $totalOrig += $result.OrigKB
            $totalNew  += $result.NewKB
        }
    }
    
    # Thumbnail (skip backgrounds and logos)
    if ($file.Name -notmatch 'welcome|background|logo') {
        $thumbDest = Join-Path $ThumbsDir "$baseName.jpg"
        if (-not (Test-Path $thumbDest)) {
            $result = Resize-Image $file.FullName $thumbDest $ThumbWidth $ThumbQuality
            if ($result) {
                Write-Host "  Thumb: $baseName.jpg ($($result.NewKB)KB)"
                $totalThumb += $result.NewKB
            }
        }
    }
}

Write-Host "`n========== RESULTS ==========" -ForegroundColor Green
Write-Host "Original total:   $([math]::Round($totalOrig/1024,1)) MB"
Write-Host "Optimized total:  $([math]::Round($totalNew/1024,1)) MB"
Write-Host "Thumbnails total: $([math]::Round($totalThumb/1024,1)) MB"
if ($totalOrig -gt 0) {
    Write-Host "Savings:          $([math]::Round((1 - $totalNew/$totalOrig)*100,1))%"
}
Write-Host "`nDone! Images saved to:" -ForegroundColor Green
Write-Host "  $WebpDir"
Write-Host "  $ThumbsDir"
