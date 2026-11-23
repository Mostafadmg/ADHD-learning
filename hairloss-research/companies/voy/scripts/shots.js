#!/usr/bin/env node
/* shots.js — take a few evidence screenshots of PUBLIC landing pages (no forms filled, nothing submitted).
 * Usage: node shots.js <outDir> */
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ userAgent: UA, viewport: { width: 1280, height: 900 }, locale: 'en-GB', timezoneId: 'Europe/London' });
  const page = await ctx.newPage();
  const shot = async (name) => page.screenshot({ path: path.join(out, name), type: 'jpeg', quality: 60 });
  // 1. treatment-type cards with prices on the main men's landing page
  await page.goto('https://hairloss1.joinvoy.com/', { waitUntil: 'domcontentloaded', timeout: 45000 }); await page.waitForTimeout(2500);
  try { const h = page.getByText('Our available treatment types').first(); await h.scrollIntoViewIfNeeded(); await page.mouse.wheel(0, 250); await page.waitForTimeout(1500); await shot('landing-treatment-types-prices.jpg'); console.log('ok cards'); } catch (e) { console.log('cards failed', String(e).slice(0, 120)); }
  await page.waitForTimeout(2500);
  // 2. pattern widget on a social landing page: click one pattern, read the result
  await page.goto('https://hairloss1.joinvoy.com/a/hair-loss-tt-v3', { waitUntil: 'domcontentloaded', timeout: 45000 }); await page.waitForTimeout(2500);
  try {
    const t = page.locator('[data-pattern-tab="Hairline & crown"]').first(); await t.scrollIntoViewIfNeeded(); await page.waitForTimeout(800); await shot('pattern-widget-before.jpg');
    await t.click(); await page.waitForTimeout(1200); await shot('pattern-widget-hairline-crown.jpg');
    const txt = await page.locator('.section_paterns').innerText(); fs.writeFileSync(path.join(out, 'pattern-widget-hairline-crown.txt'), txt); console.log('ok widget', txt.replace(/\s+/g, ' ').slice(0, 400));
  } catch (e) { console.log('widget failed', String(e).slice(0, 160)); }
  await b.close();
})();
