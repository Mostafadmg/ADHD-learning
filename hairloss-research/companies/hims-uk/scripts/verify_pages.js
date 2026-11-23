#!/usr/bin/env node
/* Stage 3 (verify): open public pages one after another in ONE browser, with a pause between loads,
 * and save the full visible text, every link and a screenshot. Nothing is clicked except a cookie banner; nothing is typed.
 * Usage: node scripts/verify_pages.js <outDir> <name>=<url> [<name>=<url> ...] */
const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const out = process.argv[2]; const items = process.argv.slice(3).map(a => { const i = a.indexOf('='); return [a.slice(0, i), a.slice(i + 1)]; });
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', viewport: { width: 1280, height: 900 }, locale: 'en-GB' });
  const page = await ctx.newPage();
  for (const [name, url] of items) {
    let status = null, err = null;
    try { const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }); status = r && r.status(); } catch (e) { err = String(e).slice(0, 200); }
    try { await page.waitForLoadState('networkidle', { timeout: 8000 }); } catch (e) {}
    await page.waitForTimeout(1500);
    for (const t of ['Reject all', 'Customise']) { /* leave the banner alone: text is read through it */ }
    try { await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); }); } catch (e) {}
    await page.waitForTimeout(800);
    let text = '', links = [], title = '';
    try {
      title = await page.title();
      text = await page.evaluate(() => document.body.innerText);
      links = await page.evaluate(() => Array.from(document.querySelectorAll('a[href]')).map(a => (a.innerText || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 80) + ' -> ' + a.getAttribute('href')));
    } catch (e) { err = (err || '') + ' read:' + String(e).slice(0, 120); }
    fs.writeFileSync(path.join(out, name + '.txt'), `REQUESTED: ${url}\nFINAL URL: ${page.url()}\nHTTP: ${status}\nTITLE: ${title}\nERROR: ${err || ''}\n\n--- TEXT ---\n${text}\n\n--- LINKS ---\n${Array.from(new Set(links)).join('\n')}\n`);
    try { await page.screenshot({ path: path.join(out, name + '.jpg'), type: 'jpeg', quality: 55 }); } catch (e) {}
    console.log(`[pages] ${name} HTTP ${status} final ${page.url()} text ${text.length} chars ${err || ''}`);
    await page.waitForTimeout(3000);
  }
  await browser.close();
})();
