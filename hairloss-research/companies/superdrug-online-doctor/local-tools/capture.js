#!/usr/bin/env node
/* capture.js — like tools/walk.js but also keeps SMALL API bodies and POST data, which walk.js drops.
 * Usage: node capture.js <actions.json> <outDir>
 * Steps supported: goto, wait, click (selector or text), fill (selector + value). One clean browser per run.
 * Writes: api.jsonl (every onlinedoctor.superdrug.com XHR/fetch: url, method, status, post, body up to 200 kB,
 *         base64 images cut out), NN.txt (visible text + checked controls), NN.jpg, final.txt.
 * Do not use it to type contact details or to pass the sign-in step (see tools/PROTOCOL.md).
 */
const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const [actionsFile, outDir] = process.argv.slice(2);
if (!actionsFile || !outDir) { console.error('usage: node capture.js <actions.json> <outDir>'); process.exit(1); }
const spec = JSON.parse(fs.readFileSync(actionsFile, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });
const pad = n => String(n).padStart(2, '0');
const cut = s => s.replace(/data:image\/[a-z]+;base64,[A-Za-z0-9+\/=]+/g, 'data:…');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', viewport: { width: 1280, height: 900 }, locale: 'en-GB', timezoneId: 'Europe/London' });
  const page = await ctx.newPage();
  const log = fs.createWriteStream(path.join(outDir, 'api.jsonl'));
  page.on('response', async resp => {
    try {
      const req = resp.request(); const rt = req.resourceType(); const url = resp.url();
      if (process.env.SAVE_JS && /\/widgets\/.*\.js|assessment\/scripts\/(assessment-legacy|vendors~assessment-legacy)\./.test(url)) { try { fs.mkdirSync(path.join(outDir, 'js'), { recursive: true }); fs.writeFileSync(path.join(outDir, 'js', url.replace(/^https?:\/\//, '').replace(/[^a-z0-9.]+/gi, '_').slice(0, 120)), await resp.body()); } catch (e) {} }
      if (!(rt === 'xhr' || rt === 'fetch')) return;
      if (!/^https:\/\/onlinedoctor\.superdrug\.com\//.test(url) || /__ssobj/.test(url)) return;
      let body = ''; try { body = (await resp.text()); } catch (e) {}
      log.write(JSON.stringify({ url, method: req.method(), status: resp.status(), post: req.postData() ? cut(req.postData()).slice(0, 20000) : undefined, body: cut(body).slice(0, 200000) }) + '\n');
    } catch (e) {}
  });
  const snap = async (i, label) => {
    const text = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.replace(/\n{3,}/g, '\n\n'));
    const checked = await page.evaluate(() => [...document.querySelectorAll('input:checked')].map(e => e.name + '=' + e.value));
    fs.writeFileSync(path.join(outDir, pad(i) + '.txt'), `STEP ${pad(i)} ${label}\nURL: ${page.url()}\n\n${text}\n\n--- CHECKED ---\n${checked.join('\n')}\n`);
    try { await page.screenshot({ path: path.join(outDir, pad(i) + '.jpg'), type: 'jpeg', quality: 55, fullPage: !!spec.fullPage }); } catch (e) {}
    return text;
  };
  const settle = async ms => { try { await page.waitForLoadState('networkidle', { timeout: 5000 }); } catch (e) {} await page.waitForTimeout(ms || 400); };
  let i = 0, code = 0, text = '';
  try {
    await page.goto(spec.start, { waitUntil: 'domcontentloaded', timeout: 45000 }); await settle(1500); text = await snap(0, 'start');
    for (const st of spec.steps || []) {
      i++; const label = st.do + ' ' + (st.selector || st.text || st.url || st.ms || '');
      try {
        if (st.do === 'goto') await page.goto(st.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        else if (st.do === 'wait') await page.waitForTimeout(st.ms || 1000);
        else if (st.do === 'click') { const el = st.selector ? page.locator(st.selector).nth(st.nth || 0) : page.getByText(st.text, { exact: true }).nth(st.nth || 0); try { await el.click({ timeout: 4000 }); } catch (e) { await el.click({ timeout: 4000, force: true }); } }
        else if (st.do === 'fill') await page.locator(st.selector).nth(st.nth || 0).fill(String(st.value), { timeout: 8000 });
        else throw new Error('unknown step ' + st.do);
        await settle(st.settle);
      } catch (e) { console.log(`!!!!! STEP ${pad(i)} FAILED: ${label}\n${String(e.message).split('\n')[0]}`); await snap(i, 'FAILED ' + label); code = 2; break; }
      text = await snap(i, label);
    }
  } finally {
    fs.writeFileSync(path.join(outDir, 'final.txt'), `URL: ${page.url()}\n\n${text}`);
    console.log(`URL: ${page.url()}\n\n${text.slice(0, 6000)}`);
    await browser.close(); process.exit(code);
  }
})();
