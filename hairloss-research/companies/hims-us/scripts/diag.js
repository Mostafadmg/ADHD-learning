// diag.js <url> <outDir> [waitMs] — load one page, log every request/response/failure and console errors, save HTML.
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
(async () => {
  const [url, outDir, waitMs] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', viewport: { width: 1280, height: 900 }, locale: 'en-US', timezoneId: 'America/New_York' });
  const page = await ctx.newPage();
  const log = fs.createWriteStream(path.join(outDir, 'requests.log'));
  page.on('response', r => log.write(`${r.status()} ${r.request().method()} ${r.request().resourceType()} ${r.url().slice(0, 250)}\n`));
  page.on('requestfailed', r => log.write(`FAILED ${r.method()} ${r.resourceType()} ${r.url().slice(0, 250)} :: ${r.failure() && r.failure().errorText}\n`));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') log.write(`CONSOLE ${m.type()} ${m.text().slice(0, 300)}\n`); });
  page.on('pageerror', e => log.write(`PAGEERROR ${String(e).slice(0, 300)}\n`));
  page.on('framenavigated', f => { if (f === page.mainFrame()) log.write(`NAV ${f.url()}\n`); });
  try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }); } catch (e) { log.write('GOTO ERR ' + e.message + '\n'); }
  await page.waitForTimeout(parseInt(waitMs || '15000', 10));
  fs.writeFileSync(path.join(outDir, 'page.html'), await page.content());
  const text = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync(path.join(outDir, 'text.txt'), page.url() + '\n' + text);
  await page.screenshot({ path: path.join(outDir, 'shot.jpg'), type: 'jpeg', quality: 55 });
  console.log('URL', page.url()); console.log(text.slice(0, 1500));
  log.end(); await browser.close();
})();
