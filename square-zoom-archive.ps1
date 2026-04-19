[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$InputPath,

    [Parameter(Mandatory = $true)]
    [string]$OutputPath,

    [ValidateRange(512, 12000)]
    [int]$SquareSize = 5000,

    [ValidateRange(72, 1200)]
    [int]$Dpi = 300,

    [ValidateRange(1, 100)]
    [int]$JpegQuality = 100,

    [ValidateRange(1, 254)]
    [int]$WhiteThreshold = 245,

    [ValidateRange(0, 255)]
    [int]$AlphaThreshold = 10,

    [ValidateRange(1, 32)]
    [int]$TrimSampleStep = 4,

    [ValidateRange(0, 500)]
    [int]$ProductPadding = 24,

    [switch]$Recurse,
    [switch]$Overwrite,
    [switch]$Upscale
)

Add-Type -AssemblyName System.Drawing

function Get-JpegEncoder {
    [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq "image/jpeg" }
}

function Save-AsJpeg {
    param(
        [System.Drawing.Bitmap]$Bitmap,
        [string]$Path,
        [int]$Quality
    )

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

function Is-BackgroundPixel {
    param(
        [System.Drawing.Color]$Color,
        [int]$WhiteThreshold,
        [int]$AlphaThreshold
    )

    if ($Color.A -lt $AlphaThreshold) { return $true }
    return ($Color.R -ge $WhiteThreshold -and $Color.G -ge $WhiteThreshold -and $Color.B -ge $WhiteThreshold)
}

function Get-TightBounds {
    param(
        [System.Drawing.Image]$Image,
        [int]$WhiteThreshold,
        [int]$AlphaThreshold,
        [int]$Step
    )

    $bmp = New-Object System.Drawing.Bitmap($Image)
    try {
        $w = $bmp.Width
        $h = $bmp.Height

        $top = 0
        while ($top -lt $h) {
            $hasContent = $false
            for ($x = 0; $x -lt $w; $x += $Step) {
                if (-not (Is-BackgroundPixel -Color $bmp.GetPixel($x, $top) -WhiteThreshold $WhiteThreshold -AlphaThreshold $AlphaThreshold)) {
                    $hasContent = $true
                    break
                }
            }
            if ($hasContent) { break }
            $top++
        }

        if ($top -ge $h) {
            return New-Object System.Drawing.Rectangle(0, 0, $w, $h)
        }

        $bottom = $h - 1
        while ($bottom -ge $top) {
            $hasContent = $false
            for ($x = 0; $x -lt $w; $x += $Step) {
                if (-not (Is-BackgroundPixel -Color $bmp.GetPixel($x, $bottom) -WhiteThreshold $WhiteThreshold -AlphaThreshold $AlphaThreshold)) {
                    $hasContent = $true
                    break
                }
            }
            if ($hasContent) { break }
            $bottom--
        }

        $left = 0
        while ($left -lt $w) {
            $hasContent = $false
            for ($y = $top; $y -le $bottom; $y += $Step) {
                if (-not (Is-BackgroundPixel -Color $bmp.GetPixel($left, $y) -WhiteThreshold $WhiteThreshold -AlphaThreshold $AlphaThreshold)) {
                    $hasContent = $true
                    break
                }
            }
            if ($hasContent) { break }
            $left++
        }

        $right = $w - 1
        while ($right -ge $left) {
            $hasContent = $false
            for ($y = $top; $y -le $bottom; $y += $Step) {
                if (-not (Is-BackgroundPixel -Color $bmp.GetPixel($right, $y) -WhiteThreshold $WhiteThreshold -AlphaThreshold $AlphaThreshold)) {
                    $hasContent = $true
                    break
                }
            }
            if ($hasContent) { break }
            $right--
        }

        return New-Object System.Drawing.Rectangle($left, $top, ($right - $left + 1), ($bottom - $top + 1))
    }
    finally {
        $bmp.Dispose()
    }
}

function Get-InputImages {
    param([string]$Path, [bool]$Recursive, [string]$ExcludePath)

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "InputPath not found: $Path"
    }

    if (Test-Path -LiteralPath $Path -PathType Leaf) {
        return @(Get-Item -LiteralPath $Path)
    }

    $args = @{ LiteralPath = $Path; File = $true }
    if ($Recursive) { $args.Recurse = $true }

    $excludeRoot = [System.IO.Path]::GetFullPath($ExcludePath).TrimEnd('\\')

    return @(Get-ChildItem @args | Where-Object {
        $_.Name -match '(?i)\.(png|jpe?g|bmp|tiff?)$' -and
        -not ([System.IO.Path]::GetFullPath($_.DirectoryName).TrimEnd('\\') -like "$excludeRoot*")
    })
}

if (-not (Test-Path -LiteralPath $OutputPath -PathType Container)) {
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
}

$files = Get-InputImages -Path $InputPath -Recursive:$Recurse.IsPresent -ExcludePath $OutputPath
Write-Host "Converting $($files.Count) image(s)..." -ForegroundColor Cyan
Write-Host "Square: $SquareSize px | DPI: $Dpi | Quality: $JpegQuality | Step: $TrimSampleStep | Padding: $ProductPadding" -ForegroundColor Cyan

$processed = 0
$skipped = 0
$failed = 0

foreach ($file in $files) {
    try {
        $outFile = Join-Path $OutputPath (([IO.Path]::GetFileNameWithoutExtension($file.Name)) + '.jpg')
        if ((Test-Path -LiteralPath $outFile) -and -not $Overwrite) {
            $skipped++
            continue
        }

        $src = [System.Drawing.Image]::FromFile($file.FullName)
        try {
            $bounds = Get-TightBounds -Image $src -WhiteThreshold $WhiteThreshold -AlphaThreshold $AlphaThreshold -Step $TrimSampleStep

            $cropped = New-Object System.Drawing.Bitmap($bounds.Width, $bounds.Height)
            try {
                $cg = [System.Drawing.Graphics]::FromImage($cropped)
                try {
                    $cg.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, $bounds.Width, $bounds.Height)), $bounds, [System.Drawing.GraphicsUnit]::Pixel)
                }
                finally { $cg.Dispose() }

                $targetSide = $SquareSize - (2 * $ProductPadding)
                if ($targetSide -lt 1) { $targetSide = $SquareSize }

                $fitRatio = [Math]::Min($targetSide / [double]$cropped.Width, $targetSide / [double]$cropped.Height)
                if (-not $Upscale) {
                    $fitRatio = [Math]::Min(1.0, $fitRatio)
                }

                $newW = [int][Math]::Round($cropped.Width * $fitRatio)
                $newH = [int][Math]::Round($cropped.Height * $fitRatio)
                if ($newW -lt 1) { $newW = 1 }
                if ($newH -lt 1) { $newH = 1 }

                $x = [int][Math]::Floor(($SquareSize - $newW) / 2)
                $y = [int][Math]::Floor(($SquareSize - $newH) / 2)

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
                        $g.DrawImage($cropped, $x, $y, $newW, $newH)
                    }
                    finally { $g.Dispose() }

                    Save-AsJpeg -Bitmap $canvas -Path $outFile -Quality $JpegQuality
                }
                finally { $canvas.Dispose() }
            }
            finally { $cropped.Dispose() }
        }
        finally { $src.Dispose() }

        Write-Host "Done: $($file.Name)" -ForegroundColor Green
        $processed++
    }
    catch {
        Write-Host "Failed: $($file.Name) | $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

Write-Host "Finished. Processed: $processed | Skipped: $skipped | Failed: $failed" -ForegroundColor Cyan
Write-Host "Output: $OutputPath" -ForegroundColor Cyan
