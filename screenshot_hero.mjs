import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const html = readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });

// Load via data URI to avoid file:// CORS issues with external scripts/fonts
await page.setContent(html, { waitUntil: 'networkidle' });

// Wait for fonts
await page.waitForTimeout(2000);

// Screenshot just the hero section
const hero = await page.$('.hero-section');
if (hero) {
  await hero.screenshot({ path: path.join(__dirname, 'hero_preview.png') });
  console.log('Hero screenshot saved to hero_preview.png');
} else {
  // Fallback: full page, crop top
  await page.screenshot({ path: path.join(__dirname, 'hero_preview.png'), clip: { x: 0, y: 0, width: 1280, height: 820 } });
  console.log('Full-page screenshot (hero section not found)');
}

await browser.close();
