/**
 * Erzeugt frontend/public/og-image.png (1200×630) für og:image / Social Sharing.
 * Aufruf: node scripts/generate-og-image.js (oder npm run generate:og)
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public');
const outFile = path.join(outDir, 'og-image.png');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a5f"/>
      <stop offset="100%" style="stop-color:#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="260" text-anchor="middle" font-family="Arial, sans-serif" font-size="96" font-weight="bold" fill="#fff">KK-Check</text>
  <text x="600" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" fill="#e2e8f0">Krankenkasse Liechtenstein</text>
  <text x="600" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#94a3b8">Optimale Franchise · Kassenvergleich · Prämien 2026</text>
  <text x="600" y="560" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#64748b">krankenkasse.mmind.space</text>
</svg>
`.trim();

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const buf = Buffer.from(svg);
  await sharp(buf)
    .resize(1200, 630)
    .png()
    .toFile(outFile);
  console.log('OG-Image geschrieben:', outFile);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
