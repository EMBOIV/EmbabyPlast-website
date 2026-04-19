<#
.SYNOPSIS
Convert images to square format with white background and high resolution.

.DESCRIPTION
- Reads PNG/JPG/JPEG/BMP/TIFF images.
- Places each image centered on a white square canvas.
- Uses high-quality resize settings.
- Saves output as high-quality JPEG (or PNG).
- Sets output DPI (default 300).

.EXAMPLE
powershell -ExecutionPolicy Bypass -File .\make-square-images.ps1 -InputPath .\images -OutputPath .\images\square

.EXAMPLE
powershell -ExecutionPolicy Bypass -File .\make-square-images.ps1 -InputPath .\images\product1.png -SquareSize 4000 -JpegQuality 98
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$InputPath,

    [Parameter(Mandatory = $true)]
    [string]$OutputPath,

    [ValidateRange(256, 12000)]
    [int]$SquareSize = 3000,

    [ValidateRange(72, 1200)]
    [int]$Dpi = 300,

    [ValidateRange(1, 100)]
    [int]$JpegQuality = 98,

    [switch]$TrimBackground,

    [ValidateRange(1, 254)]
    [int]$WhiteThreshold = 245,

    [ValidateRange(0, 255)]
    [int]$AlphaThreshold = 10,

    [ValidateRange(1, 32)]
    [int]$TrimSampleStep = 4,

    [ValidateSet("jpg", "png")]
    [string]$OutputFormat = "jpg",

    [switch]$Recurse,

    [switch]$Overwrite,

    [switch]$Upscale
)

Add-Type -AssemblyName System.Drawing

function Get-JpegEncoder {
    [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq "image/jpeg" }
}

function Save-Image {
    param(
        [Parameter(Mandatory = $true)]
        [System.Drawing.Bitmap]$Bitmap,

        [Parameter(Mandatory = $true)]
        [string]$Path,

        [Parameter(Mandatory = $true)]
        [string]$Format,

        [Parameter(Mandatory = $true)]
        [int]$Quality
    )

    if ($Format -eq "jpg") {
        $encoder = Get-JpegEncoder
        $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
            [System.Drawing.Imaging.Encoder]::Quality,
            [long]$Quality
        )

        try {
            $Bitmap.Save($Path, $encoder, $encParams)
        }
        finally {
            $encParams.Dispose()
        }
    }
    else {
        $Bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    }
}

function Test-IsBackgroundPixel {
    param(
        [System.Drawing.Color]$Color,
        [int]$WhiteThreshold,
        [int]$AlphaThreshold
    )

    if ($Color.A -lt $AlphaThreshold) {
        return $true
    }

    return (
        $Color.R -ge $WhiteThreshold -and
        $Color.G -ge $WhiteThreshold -and
        $Color.B -ge $WhiteThreshold
    )
}

function Get-ContentBounds {
    param(
        [Parameter(Mandatory = $true)]
        [System.Drawing.Image]$Image,

        [int]$WhiteThreshold,
        [int]$AlphaThreshold,
        [int]$SampleStep
    )

    $bmp = New-Object System.Drawing.Bitmap($Image)
    try {
        $w = $bmp.Width
        $h = $bmp.Height

        if ($w -lt 1 -or $h -lt 1) {
            return New-Object System.Drawing.Rectangle(0, 0, 0, 0)
        }

        $top = 0
        while ($top -lt $h) {
            $found = $false
            for ($x = 0; $x -lt $w; $x += $SampleStep) {
                $px = $bmp.GetPixel($x, $top)
                if (-not (Test-IsBackgroundPixel -Color $px -WhiteThreshold $WhiteThreshold -AlphaThreshold $AlphaThreshold)) {
                    $found = $true
                    break
                }
            }
            if ($found) { break }
            $top++
        }

        if ($top -ge $h) {
            return New-Object System.Drawing.Rectangle(0, 0, 0, 0)
        }

        $bottom = $h - 1
        while ($bottom -ge $top) {
            $found = $false
            for ($x = 0; $x -lt $w; $x += $SampleStep) {
                $px = $bmp.GetPixel($x, $bottom)
                if (-not (Test-IsBackgroundPixel -Color $px -WhiteThreshold $WhiteThreshold -AlphaThreshold $AlphaThreshold)) {
                    $found = $true
                    break
                }
            }
            if ($found) { break }
            $bottom--
        }

        $left = 0
        while ($left -lt $w) {
            $found = $false
            for ($y = $top; $y -le $bottom; $y += $SampleStep) {
                $px = $bmp.GetPixel($left, $y)
                if (-not (Test-IsBackgroundPixel -Color $px -WhiteThreshold $WhiteThreshold -AlphaThreshold $AlphaThreshold)) {
                    $found = $true
                    break
                }
            }
            if ($found) { break }
            $left++
        }

        $right = $w - 1
        while ($right -ge $left) {
            $found = $false
            for ($y = $top; $y -le $bottom; $y += $SampleStep) {
                $px = $bmp.GetPixel($right, $y)
                if (-not (Test-IsBackgroundPixel -Color $px -WhiteThreshold $WhiteThreshold -AlphaThreshold $AlphaThreshold)) {
                    $found = $true
                    break
                }
            }
            if ($found) { break }
            $right--
        }

        return New-Object System.Drawing.Rectangle($left, $top, ($right - $left + 1), ($bottom - $top + 1))
    }
    finally {
        $bmp.Dispose()
    }
}

function Get-InputFiles {
    param(
        [string]$Path,
        [bool]$Recursive,
        [string]$ExcludePath
    )

    if (Test-Path -LiteralPath $Path -PathType Leaf) {
        return Get-Item -LiteralPath $Path
    }

    if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
        throw "InputPath not found: $Path"
    }

    $args = @{
        LiteralPath = $Path
        File        = $true
    }

    if ($Recursive) {
        $args.Recurse = $true
    }

    $excludeFull = $null
    if ($ExcludePath) {
        try {
            $excludeFull = [System.IO.Path]::GetFullPath($ExcludePath).TrimEnd('\\')
        }
        catch {
            $excludeFull = $null
        }
    }

    Get-ChildItem @args |
        Where-Object {
            $isImage = $_.Name -match "(?i)\.(png|jpe?g|bmp|tiff?)$"
            if (-not $isImage) { return $false }

            if (-not $excludeFull) { return $true }

            $fileDir = [System.IO.Path]::GetFullPath($_.DirectoryName).TrimEnd('\\')
            return -not ($fileDir -like "$excludeFull*")
        }
}

if (-not (Test-Path -LiteralPath $OutputPath -PathType Container)) {
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
}

$files = Get-InputFiles -Path $InputPath -Recursive:$Recurse.IsPresent -ExcludePath $OutputPath

if (-not $files -or $files.Count -eq 0) {
    Write-Host "No image files found at: $InputPath" -ForegroundColor Yellow
    exit 0
}

Write-Host "Converting $($files.Count) image(s) to square format..." -ForegroundColor Cyan
Write-Host "SquareSize: $SquareSize px | DPI: $Dpi | Format: $OutputFormat | Quality: $JpegQuality" -ForegroundColor Cyan
if ($TrimBackground) {
    Write-Host "TrimBackground: ON (white >= $WhiteThreshold, alpha < $AlphaThreshold, step = $TrimSampleStep)" -ForegroundColor Cyan
}

$processed = 0
$skipped = 0
$failed = 0

foreach ($file in $files) {
    try {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        $outFile = Join-Path $OutputPath ("{0}.{1}" -f $baseName, $OutputFormat)

        if ((Test-Path -LiteralPath $outFile) -and -not $Overwrite) {
            Write-Host "Skipped (exists): $($file.Name)" -ForegroundColor DarkYellow
            $skipped++
            continue
        }

        $src = [System.Drawing.Image]::FromFile($file.FullName)
        try {
            $workImage = $src
            $cropped = $null

            if ($TrimBackground) {
                $bounds = Get-ContentBounds -Image $src -WhiteThreshold $WhiteThreshold -AlphaThreshold $AlphaThreshold -SampleStep $TrimSampleStep
                if ($bounds.Width -gt 0 -and $bounds.Height -gt 0 -and (
                    $bounds.Width -ne $src.Width -or $bounds.Height -ne $src.Height
                )) {
                    $cropped = New-Object System.Drawing.Bitmap($bounds.Width, $bounds.Height)
                    $cropGraphics = [System.Drawing.Graphics]::FromImage($cropped)
                    try {
                        $cropGraphics.DrawImage(
                            $src,
                            (New-Object System.Drawing.Rectangle(0, 0, $bounds.Width, $bounds.Height)),
                            $bounds,
                            [System.Drawing.GraphicsUnit]::Pixel
                        )
                    }
                    finally {
                        $cropGraphics.Dispose()
                    }
                    $workImage = $cropped
                }
            }

            $maxDim = [Math]::Max($workImage.Width, $workImage.Height)
            $fitRatio = [Math]::Min($SquareSize / [double]$workImage.Width, $SquareSize / [double]$workImage.Height)

            if (-not $Upscale -and $maxDim -lt $SquareSize) {
                $fitRatio = 1.0
            }

            $newWidth = [int][Math]::Round($workImage.Width * $fitRatio)
            $newHeight = [int][Math]::Round($workImage.Height * $fitRatio)

            if ($newWidth -lt 1) { $newWidth = 1 }
            if ($newHeight -lt 1) { $newHeight = 1 }

            $x = [int][Math]::Floor(($SquareSize - $newWidth) / 2)
            $y = [int][Math]::Floor(($SquareSize - $newHeight) / 2)

            $canvas = New-Object System.Drawing.Bitmap($SquareSize, $SquareSize)
            try {
                $canvas.SetResolution($Dpi, $Dpi)

                $g = [System.Drawing.Graphics]::FromImage($canvas)
                try {
                    $g.Clear([System.Drawing.Color]::White)
                    $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                    $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                    $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
                    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                    $g.DrawImage($workImage, $x, $y, $newWidth, $newHeight)
                }
                finally {
                    $g.Dispose()
                }

                Save-Image -Bitmap $canvas -Path $outFile -Format $OutputFormat -Quality $JpegQuality
            }
            finally {
                $canvas.Dispose()
            }

            if ($cropped) {
                $cropped.Dispose()
            }
        }
        finally {
            $src.Dispose()
        }

        Write-Host "Done: $($file.Name) -> $([System.IO.Path]::GetFileName($outFile))" -ForegroundColor Green
        $processed++
    }
    catch {
        Write-Host "Failed: $($file.Name) | $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "Finished." -ForegroundColor Cyan
Write-Host "Processed: $processed"
Write-Host "Skipped:   $skipped"
Write-Host "Failed:    $failed"
Write-Host "Output:    $OutputPath"
