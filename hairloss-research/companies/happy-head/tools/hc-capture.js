// Capture public help-centre articles (happyhead.zendesk.com/hc — open to all agents in its robots.txt).
// One browser, one page at a time, a pause between pages. Saves raw/hc/<id>.txt (title, updated, body text, links).
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
(async () => {
  const dir = path.join(__dirname, '..', 'raw', 'hc');
  const urls = fs.readFileSync(path.join(dir, 'urls.txt'), 'utf8').split('\n').filter(Boolean);
  const b = await chromium.launch(); const p = await b.newPage();
  let ok = 0, bad = 0;
  for (const u of urls) {
    const id = u.match(/articles\/(\d+)/)[1]; const out = path.join(dir, id + '.txt');
    if (fs.existsSync(out) && fs.statSync(out).size > 300) { ok++; continue; }
    try {
      await p.goto(u, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await p.waitForSelector('article, .article', { timeout: 15000 }).catch(() => {});
      const d = await p.evaluate(() => {
        const a = document.querySelector('article') || document.querySelector('.article') || document.body;
        const links = [...a.querySelectorAll('a[href]')].map(x => (x.innerText || '').trim() + ' -> ' + x.href);
        return { title: document.title, text: a.innerText, links };
      });
      fs.writeFileSync(out, 'URL: ' + u + '\nTITLE: ' + d.title + '\n\n' + d.text + '\n\nLINKS:\n' + d.links.join('\n') + '\n');
      if (/Just a moment/.test(d.title)) { bad++; console.log('checkpoint ' + id); } else ok++;
    } catch (e) { bad++; console.log('fail ' + id + ' ' + e.message.split('\n')[0]); }
    await p.waitForTimeout(1500);
  }
  await b.close(); console.log('done ok=' + ok + ' bad=' + bad);
})();
