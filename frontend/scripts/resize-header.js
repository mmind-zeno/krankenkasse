/**
 * Resizes KKcheck-headerpic-original.png to 1200×630 and saves as headerbild.png.
 * Run from frontend: node scripts/resize-header.js
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const src = path.join(publicDir, 'KKcheck-headerpic-original.png');
const dest = path.join(publicDir, 'headerbild.png');

async function main() {
  await sharp(src)
    .resize(1200, 630, { fit: 'cover' })
    .png()
    .toFile(dest);
  console.log('Header-Bild erstellt:', dest);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
