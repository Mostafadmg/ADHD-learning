#!/usr/bin/env node
/* pages.js — open a list of public pages one after another (2 s apart) in ONE browser and save each page's full
 * visible text and its links. Usage: node pages.js <outDir> <url> [<url> ...]   (XML such as sitemap.xml is saved raw) */
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
const [outDir, ...urls] = process.argv.slice(2); fs.mkdirSync(outDir, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', viewport: { width: 1280, height: 900 }, locale: 'en-GB', timezoneId: 'Europe/London' });
  const page = await ctx.newPage();
  for (const url of urls) {
    const name = url.replace(/^https?:\/\/[^/]+\//, '').replace(/[^a-z0-9.]+/gi, '_').slice(0, 80) || 'home';
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(2000);
      if (/\.xml/.test(url)) { fs.writeFileSync(path.join(outDir, name), await resp.text()); console.log(resp.status(), url, 'xml saved'); continue; }
      const text = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.replace(/\n{3,}/g, '\n\n'));
      const links = await page.evaluate(() => [...document.querySelectorAll('main a[href], body a[href]')].map(a => (a.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 80) + ' -> ' + a.getAttribute('href')));
      fs.writeFileSync(path.join(outDir, name + '.txt'), `URL: ${page.url()}\nHTTP: ${resp.status()}\nTITLE: ${await page.title()}\n\n${text}\n\n--- LINKS ---\n${[...new Set(links)].join('\n')}\n`);
      console.log(resp.status(), url, text.length + ' chars');
    } catch (e) { console.log('FAILED', url, String(e.message).split('\n')[0]); }
  }
  await browser.close();
})();
