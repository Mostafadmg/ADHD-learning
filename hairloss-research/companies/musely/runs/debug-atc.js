// Debug: what does "Add To Cart" do for an anonymous visitor? (no data entered)
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const out = process.argv[2]; const url = process.argv[3] || 'https://www.musely.com/hair/pill/men';
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', viewport: { width: 1280, height: 900 }, locale: 'en-US', timezoneId: 'America/Chicago' });
  const page = await ctx.newPage();
  const log = [];
  page.on('console', m => { if (m.type() === 'error') log.push('console.error: ' + m.text().slice(0, 300)); });
  page.on('pageerror', e => log.push('pageerror: ' + String(e).slice(0, 300)));
  page.on('framenavigated', f => { if (f === page.mainFrame()) log.push('nav: ' + f.url()); });
  page.on('request', r => { const u = r.url(); if (/musely\.com/.test(u) && !/\.(js|css|png|jpg|webp|svg|woff2?)(\?|$)/.test(u) && !/_next\/static/.test(u)) log.push('req: ' + r.method() + ' ' + u.slice(0, 200)); });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch (e) {}
  await page.waitForTimeout(3000);
  try { await page.getByRole('button', { name: 'GOT IT' }).click({ timeout: 3000 }); } catch (e) { log.push('no GOT IT'); }
  const btns = page.getByRole('button', { name: 'Add To Cart' });
  log.push('ATC buttons: ' + await btns.count());
  const b = btns.first();
  log.push('first ATC html: ' + (await b.evaluate(el => el.outerHTML)).slice(0, 600));
  log.push('--- clicking');
  await b.click({ timeout: 8000 });
  await page.waitForTimeout(6000);
  log.push('url after: ' + page.url());
  const dialogs = await page.evaluate(() => Array.from(document.querySelectorAll('[role=dialog], [aria-modal=true], dialog[open]')).map(d => d.innerText.slice(0, 1500)));
  log.push('dialogs: ' + JSON.stringify(dialogs));
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 3000));
  log.push('body text head: ' + bodyText.replace(/\n+/g, ' | ').slice(0, 2500));
  await page.screenshot({ path: path.join(out, 'after.jpg'), type: 'jpeg', quality: 55 });
  fs.writeFileSync(path.join(out, 'log.txt'), log.join('\n'));
  console.log(log.join('\n'));
  await browser.close();
})();
