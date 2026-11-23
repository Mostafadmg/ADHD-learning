// Fetch a short list of help-centre pages in one browser, one at a time, 2.5 s apart. Saves visible text.
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
const [outDir, ...urls] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ locale: 'en-GB', timezoneId: 'Europe/London', viewport: { width: 1280, height: 900 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' });
  const page = await ctx.newPage();
  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(2500);
      const data = await page.evaluate(() => ({ title: document.title, text: (document.querySelector('main') || document.body).innerText }));
      if (/Just a moment|Verify you are human/i.test(data.title)) { console.log('CHECKPOINT', url); continue; }
      const slug = new URL(url).pathname.replace(/[^a-z0-9]+/gi, '_').slice(0, 110);
      fs.writeFileSync(path.join(outDir, slug + '.txt'), `URL: ${url}\nTITLE: ${data.title}\n\n${data.text}\n`);
      console.log('ok', data.text.length, url.slice(-70));
    } catch (e) { console.log('ERR', url, String(e.message).split('\n')[0]); }
  }
  await browser.close();
})();
