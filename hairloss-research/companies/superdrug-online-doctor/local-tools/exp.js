#!/usr/bin/env node
/* exp.js — fast one-change replay for Superdrug Online Doctor (stage 2). Same idea as capture.js (one clean browser,
 * answers replayed from an actions file, API replies kept), but it does not wait and screenshot after every click,
 * so one run takes well under a minute instead of two to three.
 *
 * Usage: node exp.js <actions.json> <outDir> [--nosubmit]
 * Steps: goto, wait, click (selector), fill (selector + value). The step that clicks
 *        button[data-qa='cdc-questionnaire-submit'] is the "submit" step: just before it the tool saves
 *        pre.txt / pre.jpg (whole questionnaire as the patient sees it, every form control, is Next enabled?),
 *        and after it post.txt / post.jpg (the next screen) and summary.json.
 * --nosubmit stops before the submit step (used to read control names after opening branches).
 * Writes: api.jsonl (same format as capture.js), pre.txt, pre.jpg, post.txt, post.jpg, summary.json.
 * Never types contact details and never goes past the sign-in wall (see tools/PROTOCOL.md).
 */
const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const argv = process.argv.slice(2); const noSubmit = argv.includes('--nosubmit');
const [actionsFile, outDir] = argv.filter(a => !a.startsWith('--'));
if (!actionsFile || !outDir) { console.error('usage: node exp.js <actions.json> <outDir> [--nosubmit]'); process.exit(1); }
const spec = JSON.parse(fs.readFileSync(actionsFile, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });
const cut = s => s.replace(/data:image\/[a-z]+;base64,[A-Za-z0-9+\/=]+/g, 'data:…');
const SUBMIT = "cdc-questionnaire-submit";
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', viewport: { width: 1280, height: 900 }, locale: 'en-GB', timezoneId: 'Europe/London' });
  const page = await ctx.newPage();
  const log = fs.createWriteStream(path.join(outDir, 'api.jsonl'));
  const api = [];
  page.on('response', async resp => {
    try {
      const req = resp.request(); const rt = req.resourceType(); const url = resp.url();
      if (!(rt === 'xhr' || rt === 'fetch')) return;
      if (!/^https:\/\/onlinedoctor\.superdrug\.com\//.test(url) || /__ssobj/.test(url)) return;
      let body = ''; try { body = (await resp.text()); } catch (e) {}
      const rec = { url, method: req.method(), status: resp.status(), post: req.postData() ? cut(req.postData()).slice(0, 20000) : undefined, body: cut(body).slice(0, 200000) };
      api.push(rec); log.write(JSON.stringify(rec) + '\n');
    } catch (e) {}
  });
  const grab = async () => page.evaluate(() => {
    const root = document.querySelector('main') || document.body;
    const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const controls = [...document.querySelectorAll('input, textarea, select, button')].filter(el => el.type !== 'hidden').map(el => {
      const lab = (el.labels && el.labels[0] ? el.labels[0].innerText : (el.innerText || '')).replace(/\s+/g, ' ').trim().slice(0, 90);
      return `${el.tagName.toLowerCase()}${el.type ? ':' + el.type : ''} name=${el.name || ''} id=${el.id || ''} value=${(el.value || '').slice(0, 40)} qa=${el.getAttribute('data-qa') || ''}${el.checked ? ' [checked]' : ''}${el.disabled ? ' [disabled]' : ''}${el.required ? ' [required]' : ''} | ${lab}`;
    });
    return { url: location.href, text: (root.innerText || '').replace(/\n{3,}/g, '\n\n').trim(), controls };
  });
  const save = async (name, label) => {
    const g = await grab();
    fs.writeFileSync(path.join(outDir, name + '.txt'), `${label}\nURL: ${g.url}\n\n${g.text}\n\n--- CONTROLS ---\n${g.controls.join('\n')}\n`);
    try { await page.screenshot({ path: path.join(outDir, name + '.jpg'), type: 'jpeg', quality: 50, fullPage: true }); } catch (e) {}
    return g;
  };
  const idle = async t => { try { await page.waitForLoadState('networkidle', { timeout: t }); } catch (e) {} };
  const summary = { actions: path.basename(actionsFile), about: spec._about || '', changed: spec._changed || '', failedStep: null };
  let code = 0, i = 0;
  try {
    await page.goto(spec.start, { waitUntil: 'domcontentloaded', timeout: 45000 }); await page.waitForTimeout(800);
    for (const st of spec.steps || []) {
      i++; const label = st.do + ' ' + (st.selector || st.url || st.ms || '');
      try {
        if (st.do === 'goto') { await page.goto(st.url, { waitUntil: 'domcontentloaded', timeout: 45000 }); await idle(5000); await page.waitForSelector(`button[data-qa='${SUBMIT}']`, { timeout: 20000 }).catch(() => {}); }
        else if (st.do === 'wait') await page.waitForTimeout(st.ms || 1000);
        else if (st.do === 'click') {
          const isSubmit = st.selector && st.selector.includes(SUBMIT);
          if (isSubmit) {
            const pre = await save('pre', 'BEFORE SUBMIT (questionnaire as answered)');
            summary.submitDisabled = await page.locator(st.selector).first().isDisabled().catch(() => null);
            summary.preTextLength = pre.text.length;
            if (noSubmit) { summary.stoppedBeforeSubmit = true; break; }
          }
          const el = page.locator(st.selector).nth(st.nth || 0);
          if (st.optional) { if (!(await el.count())) continue; }
          // the questionnaire inputs are visually hidden: a normal click always times out, so force it straight away
          if (/^input\[/.test(st.selector)) {
            await el.click({ timeout: 5000, force: true });
            // a forced click can land on an overlay (cookie banner still fading): check it took, retry once
            if (!st.uncheck && !(await el.isChecked().catch(() => true))) { await page.waitForTimeout(900); await el.click({ timeout: 5000, force: true }); summary.retries = (summary.retries || 0) + 1; }
            if (!st.uncheck && !(await el.isChecked().catch(() => true))) throw new Error('input did not become checked: ' + st.selector);
          }
          else { try { await el.click({ timeout: 2500 }); } catch (e) { await el.click({ timeout: 4000, force: true }); } }
          if (isSubmit) {
            await page.waitForFunction(() => /step=product/.test(location.href), null, { timeout: 15000 }).catch(() => {});
            await idle(6000); await page.waitForTimeout(2500);
          } else await page.waitForTimeout(st.settle || (/onetrust/.test(st.selector) ? 1500 : 250));
        }
        else if (st.do === 'fill') { await page.locator(st.selector).nth(st.nth || 0).fill(String(st.value), { timeout: 6000 }); await page.waitForTimeout(250); }
        else throw new Error('unknown step ' + st.do);
      } catch (e) { summary.failedStep = `${i}: ${label} :: ${String(e.message).split('\n')[0]}`; code = 2; await save('failed', 'FAILED ' + label); break; }
    }
    if (!noSubmit && code === 0) {
      const post = await save('post', 'AFTER SUBMIT');
      summary.urlAfter = post.url;
      summary.reachedProductScreen = /step=product/.test(post.url);
      const m = post.text.split('Your request')[2] || post.text.split('Your request')[1] || '';
      summary.offerLines = m.split('\n').map(s => s.replace(/\s+/g, ' ').trim()).filter(s => /£/.test(s));
      // the hovered row splits its text line, so the reliable list is the product radios (id=product_<id>)
      summary.products = post.controls.filter(c => /id=product_\d+/.test(c)).map(c => c.match(/id=product_(\d+)/)[1] + ' ' + c.split(' | ')[1]);
      summary.postText = post.text.slice(0, 2500);
    }
    const find = re => api.filter(r => re.test(r.url));
    summary.saveReply = find(/saveQuestionnaireResponse/).map(r => r.status + ' ' + r.body.slice(0, 600));
    summary.productRulesReply = find(/product-rules/).map(r => r.status + ' ' + r.body.slice(0, 3000));
    summary.productRulesCalled = find(/product-rules/).length;
    summary.apiCallsAfterLoad = api.filter(r => r.method === 'POST').map(r => r.url.replace('https://onlinedoctor.superdrug.com', '') + ' ' + r.status);
  } finally {
    fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 1));
    const { postText, about, ...short } = summary; console.log(JSON.stringify(short, null, 1));
    await browser.close(); process.exit(code);
  }
})();
