// links.js <url> — print every consultation-style link on a page with the nearest heading above it (which card it sits in)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ locale: 'en-GB', userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' })).newPage();
  await p.goto(process.argv[2], { waitUntil: 'domcontentloaded' }); try { await p.waitForLoadState('networkidle', { timeout: 8000 }); } catch (e) {}
  await p.waitForTimeout(2000);
  const out = await p.evaluate(() => Array.from(document.querySelectorAll('a[href]')).filter(a => /c\/suh|consultations|SIGNUP|promocode/i.test(a.getAttribute('href'))).map(a => {
    let el = a, h = ''; for (let i = 0; i < 8 && el && !h; i++) { el = el.parentElement; const x = el && el.querySelector('h1,h2,h3'); if (x) h = x.innerText.replace(/\s+/g, ' ').trim(); }
    return `${a.innerText.replace(/\s+/g, ' ').trim()} -> ${a.getAttribute('href')}   [section: ${h}]  visible=${a.getBoundingClientRect().width > 0}`;
  }));
  console.log(out.join('\n')); await b.close();
})();
