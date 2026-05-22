import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const html = readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
// Top viewport (hero + nav)
await page.screenshot({ path: path.join(__dirname, 'homepage_top.png') });
// Middle section (bento + how-it-works)
await page.evaluate(() => window.scrollTo(0, 1100));
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(__dirname, 'homepage_features.png') });
// Pricing section
await page.evaluate(() => {
  const el = document.getElementById('pricing');
  if (el) el.scrollIntoView({block: 'start'});
});
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(__dirname, 'homepage_pricing.png') });
console.log('Three section screenshots saved');
await browser.close();
