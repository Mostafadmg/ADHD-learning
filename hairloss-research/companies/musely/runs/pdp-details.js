// One browser, eight product pages, slowly: open the Formula / How & Why / How To Use accordions and record their text.
// No data is entered anywhere. Usage: node runs/pdp-details.js runs/pdp-details
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const out = process.argv[2];
const pages = ['hair/pill/men', 'hair/pill/women', 'hair/topicalclassic/men', 'hair/topicalclassic/women', 'hair/topicalmodern/men', 'hair/topicalmodern/women', 'hair/topicalbundle/men', 'hair/topicalbundle/women'];
(async () => {
  const browser = await chromium.launch();
  const res = {};
  try {
    const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', viewport: { width: 1280, height: 900 }, locale: 'en-US', timezoneId: 'America/Chicago' });
    const page = await ctx.newPage();
    for (const p of pages) {
      const r = res[p] = { sections: {}, formulaTabs: {}, faqChips: [], errors: [] };
      try {
        await page.goto('https://www.musely.com/' + p, { waitUntil: 'domcontentloaded', timeout: 45000 });
        try { await page.waitForLoadState('networkidle', { timeout: 8000 }); } catch (e) {}
        await page.waitForTimeout(3500);
        await page.keyboard.press('Escape'); await page.waitForTimeout(500);
        try { await page.getByRole('button', { name: 'GOT IT' }).click({ timeout: 1500 }); } catch (e) {}
        const sec = page.locator('#ingredients');
        await sec.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
        r.ingredientsBefore = (await sec.innerText().catch(() => '')).slice(0, 3000);
        for (const name of ['The Formula', 'How & Why It Works', 'How To Use']) {
          try {
            const b = page.getByRole('button', { name, exact: true }).first();
            await b.scrollIntoViewIfNeeded({ timeout: 4000 });
            const exp = await b.getAttribute('aria-expanded');
            if (exp !== 'true') { await b.click({ timeout: 5000 }); await page.waitForTimeout(700); }
            // the panel is the button's aria-controls target, else the parent block
            const ctl = await b.getAttribute('aria-controls');
            let txt = '';
            if (ctl) txt = await page.locator('[id="' + ctl + '"]').innerText().catch(() => '');
            if (!txt) txt = await b.locator('xpath=ancestor::*[self::div or self::section][2]').innerText().catch(() => '');
            r.sections[name] = txt.slice(0, 6000);
            if (name === 'The Formula') {
              const scope = ctl ? page.locator('[id="' + ctl + '"]') : sec;
              const tabs = scope.locator('[role=tab], button');
              const n = await tabs.count();
              const labels = [];
              for (let i = 0; i < n; i++) { const t = (await tabs.nth(i).innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); if (t) labels.push(t); }
              r.formulaButtons = labels;
              for (let i = 0; i < n; i++) {
                const t = (await tabs.nth(i).innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
                if (!t || t.length > 60) continue;
                try { await tabs.nth(i).click({ timeout: 3000 }); await page.waitForTimeout(500); r.formulaTabs[t] = (await scope.innerText()).slice(0, 2500); } catch (e) { r.errors.push('tab ' + t + ': ' + String(e).slice(0, 120)); }
              }
            }
          } catch (e) { r.errors.push(name + ': ' + String(e).slice(0, 200)); }
        }
        r.faqChips = await page.locator('button').evaluateAll(els => els.map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(t => /\?$/.test(t) && t.length < 160));
        r.pricingText = await page.evaluate(() => { const h = Array.from(document.querySelectorAll('h2,h3,p,div')).find(e => /^Pricing$/i.test((e.innerText || '').trim())); let s = h; for (let i = 0; i < 4 && s; i++) s = s.parentElement; return s ? s.innerText.slice(0, 1500) : ''; });
        await page.screenshot({ path: path.join(out, p.replace(/\//g, '_') + '.jpg'), type: 'jpeg', quality: 50 });
      } catch (e) { r.errors.push('page: ' + String(e).slice(0, 300)); }
      fs.writeFileSync(path.join(out, 'pdp-details.json'), JSON.stringify(res, null, 1));
      await page.waitForTimeout(2500);
    }
  } finally { await browser.close(); }
  for (const p of Object.keys(res)) { console.log('\n=== ' + p + ' errors=' + JSON.stringify(res[p].errors)); console.log('buttons:', JSON.stringify(res[p].formulaButtons)); console.log('faq:', JSON.stringify(res[p].faqChips)); }
})();
