// Gentle help-centre crawler: one browser, sequential, 2 s between pages. Saves visible text of each article.
const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const [start, outDir, maxPagesArg] = process.argv.slice(2);
const maxPages = parseInt(maxPagesArg || '120', 10);
fs.mkdirSync(outDir, { recursive: true });
const origin = new URL(start).origin;
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ locale: 'en-GB', timezoneId: 'Europe/London', viewport: { width: 1280, height: 900 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' });
  const page = await ctx.newPage();
  const queue = [start]; const seen = new Set([start]); const index = [];
  let n = 0;
  while (queue.length && n < maxPages) {
    const url = queue.shift(); n++;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(2000);
      const data = await page.evaluate(() => {
        const main = document.querySelector('main') || document.body;
        const links = Array.from(document.querySelectorAll('a[href]')).map(a => a.href);
        return { title: document.title, text: main.innerText, links };
      });
      if (/Just a moment|Verify you are human/i.test(data.title)) { console.log('CHECKPOINT at', url); index.push({ url, title: data.title, blocked: true }); continue; }
      const slug = url.replace(origin, '').replace(/[^a-z0-9]+/gi, '_').slice(0, 110) || 'home';
      fs.writeFileSync(path.join(outDir, slug + '.txt'), `URL: ${url}\nTITLE: ${data.title}\n\n${data.text}\n`);
      index.push({ url, title: data.title, chars: data.text.length });
      for (const l of data.links) {
        const u = l.split('#')[0].split('?')[0];
        if (!u.startsWith(origin + '/hc/en-gb')) continue;
        if (!/\/(categories|sections|articles)\//.test(u)) continue;
        if (/\/(subscription|comments|requests|signin)/.test(u)) continue;
        if (!seen.has(u)) { seen.add(u); queue.push(u); }
      }
    } catch (e) { index.push({ url, error: String(e.message).split('\n')[0] }); }
  }
  fs.writeFileSync(path.join(outDir, '_index.json'), JSON.stringify({ visited: index, notVisited: queue }, null, 1));
  console.log(`visited ${index.length}, queue left ${queue.length}`);
  await browser.close();
})();
