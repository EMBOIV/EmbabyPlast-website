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
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
const WEBP_DIR = path.join(IMAGES_DIR, 'webp');
const THUMBS_DIR = path.join(IMAGES_DIR, 'thumbs');

// WebP quality: 82 is visually lossless for product photos
const WEBP_QUALITY = 82;
const THUMB_WIDTH = 400;
const THUMB_QUALITY = 78;

// Also resize the welcome background to max 1920px wide
const BG_MAX_WIDTH = 1920;

async function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

async function optimizeImage(filePath, fileName) {
    const ext = path.extname(fileName).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;

    const baseName = path.basename(fileName, ext);
    const webpName = baseName + '.webp';

    // Full-size WebP
    const webpPath = path.join(WEBP_DIR, webpName);
    if (!fs.existsSync(webpPath)) {
        const pipeline = sharp(filePath);

        // Resize welcome background to max width
        if (fileName.toLowerCase().includes('welcome')) {
            pipeline.resize({ width: BG_MAX_WIDTH, withoutEnlargement: true });
        }

        await pipeline
            .webp({ quality: WEBP_QUALITY, effort: 6 })
            .toFile(webpPath);

        const origSize = fs.statSync(filePath).size;
        const newSize = fs.statSync(webpPath).size;
        const saved = ((1 - newSize / origSize) * 100).toFixed(1);
        console.log(`  WebP: ${fileName} → ${webpName} (${(origSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB, -${saved}%)`);
    }

    // Thumbnail WebP (skip background images)
    if (!fileName.toLowerCase().includes('welcome') && !fileName.toLowerCase().includes('logo')) {
        const thumbPath = path.join(THUMBS_DIR, webpName);
        if (!fs.existsSync(thumbPath)) {
            await sharp(filePath)
                .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
                .webp({ quality: THUMB_QUALITY, effort: 6 })
                .toFile(thumbPath);

            const thumbSize = fs.statSync(thumbPath).size;
            console.log(`  Thumb: ${webpName} (${(thumbSize/1024).toFixed(0)}KB)`);
        }
    }
}

async function main() {
    console.log('Embaby Plast Image Optimizer\n');
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
