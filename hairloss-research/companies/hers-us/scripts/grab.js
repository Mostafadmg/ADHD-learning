#!/usr/bin/env node
/* grab.js — open ONE public page in a clean browser, save its HTML, visible text, every JS/JSON response body
 * and the list of requests. Read-only: no clicks, no form input.
 * Usage: node scripts/grab.js <url> <outDir> [waitMs]
 */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
(async () => {
  const [url, outDir, waitMs] = process.argv.slice(2);
  fs.mkdirSync(path.join(outDir, 'js'), { recursive: true });
  fs.mkdirSync(path.join(outDir, 'json'), { recursive: true });
  const browser = await chromium.launch();
  // Same browser identity as tools/walk.js (the shared, sanctioned tool) so results match its runs.
  const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
  const ctx = await browser.newContext({ userAgent: UA, locale: 'en-US', timezoneId: 'America/New_York', viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const log = fs.createWriteStream(path.join(outDir, 'requests.jsonl'));
  let n = 0;
  page.on('response', async r => {
    try {
      const u = r.url(); const ct = (r.headers()['content-type'] || '');
      if (/google|facebook|doubleclick|segment|sentry|hotjar|clarity|tiktok|datadog|amplitude|mixpanel|klaviyo|optimizely|onetrust|cookielaw|bing|snapchat|pinterest|newrelic|fullstory/i.test(u)) return;
      const isJs = /javascript/.test(ct) || /\.js(\?|$)/.test(u); const isJson = /json/.test(ct);
      if (!isJs && !isJson) { log.write(JSON.stringify({ url: u, status: r.status(), ct }) + '\n'); return; }
      const b = await r.body(); n++;
      const name = String(n).padStart(3, '0') + '-' + u.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9]+/g, '_').slice(0, 110) + (isJs ? '.js' : '.json');
      fs.writeFileSync(path.join(outDir, isJs ? 'js' : 'json', name), b);
      log.write(JSON.stringify({ url: u, status: r.status(), ct, size: b.length, file: name }) + '\n');
    } catch (e) {}
  });
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch (e) {}
  await page.waitForTimeout(parseInt(waitMs || '3000', 10));
  fs.writeFileSync(path.join(outDir, 'page.html'), await page.content());
  fs.writeFileSync(path.join(outDir, 'page.txt'), 'URL: ' + page.url() + '\nHTTP: ' + (resp && resp.status()) + '\nTITLE: ' + (await page.title()) + '\n\n' + (await page.evaluate(() => document.body.innerText)));
  const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => (a.innerText || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 100) + ' -> ' + a.href));
  fs.writeFileSync(path.join(outDir, 'links.txt'), links.join('\n'));
  await page.screenshot({ path: path.join(outDir, 'page.jpg'), type: 'jpeg', quality: 60, fullPage: false });
  console.log('HTTP', resp && resp.status(), page.url(), '| js+json saved:', n);
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
