// Loads a consultation URL in a clean browser and saves every response from api.sons.co.uk / shop.sons.co.uk
// (any content type) that the anonymous page itself requests. No clicks, no input.
// usage: node capture-survey.js <url> <outDir>
const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const [url, outDir] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', viewport: { width: 1280, height: 900 }, locale: 'en-GB', timezoneId: 'Europe/London' });
  const page = await ctx.newPage();
  let n = 0; const log = [];
  page.on('response', async resp => {
    try {
      const u = resp.url(); const rt = resp.request().resourceType();
      if (!/^https:\/\/[a-z.]*sons\.co\.uk\//.test(u)) return;
      if (!(rt === 'xhr' || rt === 'fetch')) return;
      const buf = await resp.body();
      const f = `${String(++n).padStart(2, '0')}-${u.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '_').slice(0, 90)}.txt`;
      fs.writeFileSync(path.join(outDir, f), buf);
      log.push({ url: u, method: resp.request().method(), status: resp.status(), ct: resp.headers()['content-type'], size: buf.length, file: f, reqHeaders: Object.fromEntries(Object.entries(resp.request().headers()).filter(([k]) => /barbershop|token|content-type|accept$/i.test(k))) });
    } catch (e) { log.push({ err: String(e) }); }
  });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch (e) {}
  await page.waitForTimeout(4000);
  fs.writeFileSync(path.join(outDir, 'log.json'), JSON.stringify(log, null, 1));
  fs.writeFileSync(path.join(outDir, 'page.txt'), await page.evaluate(() => document.body.innerText));
  console.log(log.map(l => `${l.status} ${l.method} ${l.ct} ${l.size} ${l.url}`).join('\n'));
  await browser.close();
})();
