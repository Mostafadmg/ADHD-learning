// getdoc.js <outDir> <url> [<url> ...] — load each page's HTML document only (JavaScript off, images/fonts skipped),
// one at a time with a pause, and save: <name>.html, <name>.txt (visible text + links), <name>.props.json (window.PROPS if present).
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
const nameOf = u => u.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '').slice(0, 110);
(async () => {
  const [outDir, ...urls] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', viewport: { width: 1280, height: 900 }, locale: 'en-US', timezoneId: 'America/New_York', javaScriptEnabled: false });
  await ctx.route('**/*', r => { const t = r.request().resourceType(); return (t === 'image' || t === 'font' || t === 'media' || t === 'stylesheet') ? r.abort() : r.continue(); });
  const page = await ctx.newPage();
  for (const url of urls) {
    const n = nameOf(url);
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      const html = await page.content();
      fs.writeFileSync(path.join(outDir, n + '.html'), html);
      const data = await page.evaluate(() => ({ title: document.title, text: (document.querySelector('main') || document.body).innerText, links: Array.from(document.querySelectorAll('a[href]')).map(a => (a.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80) + ' -> ' + a.getAttribute('href')) }));
      fs.writeFileSync(path.join(outDir, n + '.txt'), `URL: ${page.url()}\nHTTP: ${resp && resp.status()}\nTITLE: ${data.title}\n\n${data.text}\n\n--- LINKS ---\n${[...new Set(data.links)].join('\n')}\n`);
      const i = html.indexOf('window.PROPS=');
      console.log(`${resp && resp.status()} ${html.length} ${page.url()} title="${data.title.slice(0, 70)}" textLen=${data.text.length} props=${i >= 0}`);
    } catch (e) { console.log('ERR ' + url + ' ' + String(e.message).split('\n')[0]); }
    await page.waitForTimeout(2500);
  }
  await browser.close();
})();
