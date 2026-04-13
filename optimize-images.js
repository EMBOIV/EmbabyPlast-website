/**
 * Image Optimization Script for Embaby Plast Website
 * 
 * Converts all PNG/JPG images to optimized WebP format (no visible quality loss).
 * Also creates smaller thumbnail versions for catalog cards.
 * 
 * SETUP (one-time):
 *   1. Install Node.js from https://nodejs.org (LTS version)
 *   2. Open a terminal in this folder
 *   3. Run:  npm install sharp
 *   4. Run:  node optimize-images.js
 * 
 * OR, use the PowerShell alternative below (no Node needed):
 *   Run:  powershell -ExecutionPolicy Bypass -File optimize-images.ps1
 * 
 * This will create:
 *   images/webp/       — full-size WebP versions (~70-90% smaller)
 *   images/thumbs/     — 400px-wide thumbnails for product cards
 * 
 * Watermark:
 *   If images/logo-watermark.png exists, it will be composited at bottom-right
 *   on both full-size and thumbnail outputs.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
const WEBP_DIR = path.join(IMAGES_DIR, 'webp');
const THUMBS_DIR = path.join(IMAGES_DIR, 'thumbs');
const WATERMARK_FILE = path.join(IMAGES_DIR, 'logo-watermark.png');

// WebP quality: 82 is visually lossless for product photos
const WEBP_QUALITY = 82;
const THUMB_WIDTH = 400;
const THUMB_QUALITY = 78;
const OVERWRITE_EXISTING = true;

const WATERMARK_SCALE_FULL = 0.16;
const WATERMARK_SCALE_THUMB = 0.22;
const WATERMARK_OPACITY = 0.24;
const WATERMARK_MARGIN_FULL = 20;
const WATERMARK_MARGIN_THUMB = 10;

// Also resize the welcome background to max 1920px wide
const BG_MAX_WIDTH = 1920;

async function createWatermarkLayer(targetWidth, scale, marginPx) {
    if (!fs.existsSync(WATERMARK_FILE)) return null;

    const desiredWidth = Math.max(80, Math.round(targetWidth * scale));
    return sharp(WATERMARK_FILE)
        .resize({ width: desiredWidth, withoutEnlargement: true })
        .png()
        .extend({
            top: 0,
            left: 0,
            right: marginPx,
            bottom: marginPx,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toBuffer();
}

async function buildOptimizedPipeline(filePath, fileName, outputKind) {
    const lowerName = fileName.toLowerCase();
    const isThumb = outputKind === 'thumb';
    const quality = isThumb ? THUMB_QUALITY : WEBP_QUALITY;
    const scale = isThumb ? WATERMARK_SCALE_THUMB : WATERMARK_SCALE_FULL;
    const margin = isThumb ? WATERMARK_MARGIN_THUMB : WATERMARK_MARGIN_FULL;

    const pipeline = sharp(filePath);

    if (isThumb) {
        pipeline.resize({ width: THUMB_WIDTH, withoutEnlargement: true });
    } else if (lowerName.includes('welcome')) {
        pipeline.resize({ width: BG_MAX_WIDTH, withoutEnlargement: true });
    }

    const metadata = await pipeline.metadata();
    const targetWidth = metadata.width || THUMB_WIDTH;
    const watermarkLayer = await createWatermarkLayer(targetWidth, scale, margin);

    if (watermarkLayer) {
        pipeline.composite([
            { input: watermarkLayer, gravity: 'southeast', blend: 'over', opacity: WATERMARK_OPACITY }
        ]);
    }

    pipeline.webp({ quality: quality, effort: 6 });
    return pipeline;
}

async function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

async function optimizeImage(filePath, fileName) {
    const ext = path.extname(fileName).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;
    if (fileName.toLowerCase() === 'logo-watermark.png') return;

    const baseName = path.basename(fileName, ext);
    const webpName = baseName + '.webp';

    // Full-size WebP
    const webpPath = path.join(WEBP_DIR, webpName);
    if (OVERWRITE_EXISTING || !fs.existsSync(webpPath)) {
        const fullPipeline = await buildOptimizedPipeline(filePath, fileName, 'full');
        await fullPipeline.toFile(webpPath);

        const origSize = fs.statSync(filePath).size;
        const newSize = fs.statSync(webpPath).size;
        const saved = ((1 - newSize / origSize) * 100).toFixed(1);
        console.log(`  WebP: ${fileName} → ${webpName} (${(origSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB, -${saved}%)`);
    }

    // Thumbnail WebP (skip background images)
    if (!fileName.toLowerCase().includes('welcome') && !fileName.toLowerCase().includes('logo')) {
        const thumbPath = path.join(THUMBS_DIR, webpName);
        if (OVERWRITE_EXISTING || !fs.existsSync(thumbPath)) {
            const thumbPipeline = await buildOptimizedPipeline(filePath, fileName, 'thumb');
            await thumbPipeline.toFile(thumbPath);

            const thumbSize = fs.statSync(thumbPath).size;
            console.log(`  Thumb: ${webpName} (${(thumbSize/1024).toFixed(0)}KB)`);
        }
    }
}

async function main() {
    console.log('Embaby Plast Image Optimizer\n');
    if (fs.existsSync(WATERMARK_FILE)) {
        console.log('Watermark: enabled (images/logo-watermark.png)\n');
    } else {
        console.log('Watermark: not found (expected images/logo-watermark.png)\n');
    }
    await ensureDir(WEBP_DIR);
    await ensureDir(THUMBS_DIR);

    const files = fs.readdirSync(IMAGES_DIR).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return ['.png', '.jpg', '.jpeg'].includes(ext) && !fs.statSync(path.join(IMAGES_DIR, f)).isDirectory();
    });

    console.log(`Found ${files.length} images to optimize...\n`);

    for (const file of files) {
        await optimizeImage(path.join(IMAGES_DIR, file), file);
    }

    // Calculate totals
    const origTotal = files.reduce((sum, f) => sum + fs.statSync(path.join(IMAGES_DIR, f)).size, 0);
    const webpFiles = fs.readdirSync(WEBP_DIR);
    const webpTotal = webpFiles.reduce((sum, f) => sum + fs.statSync(path.join(WEBP_DIR, f)).size, 0);
    const thumbFiles = fs.readdirSync(THUMBS_DIR);
    const thumbTotal = thumbFiles.reduce((sum, f) => sum + fs.statSync(path.join(THUMBS_DIR, f)).size, 0);

    console.log(`\n========== RESULTS ==========`);
    console.log(`Original PNGs:  ${(origTotal/1024/1024).toFixed(1)} MB`);
    console.log(`WebP full-size: ${(webpTotal/1024/1024).toFixed(1)} MB`);
    console.log(`WebP thumbs:    ${(thumbTotal/1024/1024).toFixed(1)} MB`);
    console.log(`Total savings:  ${((1 - webpTotal/origTotal)*100).toFixed(1)}% (full-size)`);
    console.log(`\nDone! Update your HTML/JS to use WebP with PNG fallback.`);
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
