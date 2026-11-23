#!/usr/bin/env node
/*
 * autowalk.js — Hair + Me consultation walker (stage 1, MAP).
 *
 * The Hair + Me consultation is server-driven: the page GETs one step at a time from
 *   https://api.hairandme.com/consultation/<flow>/<stepId>
 * and POSTs the answer back; the reply names the next step. This script clicks through
 * the on-page flow exactly as a visitor would (it never calls the API itself), and saves
 * the JSON the page fetched for every step, so each screen is recorded word for word.
 *
 * Usage:
 *   node autowalk.js <answers.json> <outDir> [--max N] [--auto] [--html]
 *     --auto  also answer obvious neutral screens that have no entry (info screens, a lone confirm tick-box,
 *             the exclusive "None of the above" of a multi-select). For mapping only: experiments should list every answer.
 *     --html  on a failed button press, save fail.html and fail.jpg in <outDir>
 *
 * answers.json:
 *   {
 *     "start": "https://www.hairandme.com/c/suh/new",
 *     "answers": {
 *        "<stepId>": ["Option label", "Another label"],        // labels to click, in order (stepId = last part of /c/suh/<stepId>)
 *        "<stepId>": [],                                         // info screen: just press the action button / Skip
 *        "<stepId>": [{"select": "select[name='3039']", "value": {"label": "Male"}}],      // native drop-down
 *        "<stepId>": [{"fill": "Day", "value": "15"}],            // text field by CSS selector or by its label
 *        "<stepId>": [{"type": "input[name=\"3053\"]", "value": "15061994"}],            // masked field: click then type keys
 *        "<stepId>": [{"range": "input[type=range]", "value": 25}],                        // slider
 *        "<stepId>": [{"ifVisible": "Yes, I understand this."}],  // click only if that label is on screen
 *        // the server serves some steps in different forms; pick the answer list by what arrived:
 *        "<stepId>": {"byQuestion": {"9346": ["Fair. It often burns, but tans a little"], "9348": [{"range": "input[type=range]", "value": 25}]}},
 *        "<stepId>": {"byType": {"number_slider": [], "single_select_button": ["5"]}}
 *     },
 *     "button": { "<stepId>": "Custom button label" }            // optional: override the action button label
 *   }
 *
 * It stops (exit 0) at the first step that has no entry in "answers" and prints that step's JSON,
 * so the map is built one screen at a time. It NEVER types contact details: there is no default
 * for any field, so an email / name / password screen always stops the walk (the account wall).
 *
 * Output in <outDir>: steps/NN-<stepId>.json (the step definition the page fetched),
 *   NN.txt (visible text + controls), NN.jpg, api.jsonl (every api.hairandme.com call the page made,
 *   with POST bodies and replies), walk-actions.json (the same route as a tools/walk.js actions file).
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const pos = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--max');
const max = args.includes('--max') ? parseInt(args[args.indexOf('--max') + 1], 10) : 80;
if (pos.length < 2) { console.error('usage: node autowalk.js <answers.json> <outDir> [--max N]'); process.exit(1); }
const spec = JSON.parse(fs.readFileSync(pos[0], 'utf8'));
const outDir = pos[1];
// start from an empty run folder so files from an older run with a different step order cannot mix in
if (fs.existsSync(outDir)) { for (const f of fs.readdirSync(outDir)) { if (/^\d\d\.(txt|jpg)$/.test(f) || /^(fail\.html|fail\.jpg)$/.test(f)) fs.unlinkSync(path.join(outDir, f)); } if (fs.existsSync(path.join(outDir, 'steps'))) for (const f of fs.readdirSync(path.join(outDir, 'steps'))) fs.unlinkSync(path.join(outDir, 'steps', f)); }
fs.mkdirSync(path.join(outDir, 'steps'), { recursive: true });
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const pad = n => String(n).padStart(2, '0');
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1280, height: 900 }, locale: 'en-GB', timezoneId: 'Europe/London' });
  const page = await ctx.newPage();
  const apiLog = fs.createWriteStream(path.join(outDir, 'api.jsonl'));
  const stepDefs = {}; // stepId -> latest GET body
  let lastPost = null;
  page.on('response', async resp => {
    try {
      const url = resp.url();
      if (!/^https:\/\/(api|rest)\.hairandme\.com\//.test(url)) return;
      const req = resp.request();
      let body = ''; try { body = (await resp.text()).slice(0, 200000); } catch (e) {}
      const clean = url.replace(/\?.*$/, '');
      const entry = { t: Date.now(), method: req.method(), url: clean, status: resp.status(), post: req.postData() || undefined, body };
      apiLog.write(JSON.stringify(entry) + '\n');
      const m = clean.match(/\/consultation\/([a-z0-9-]+)\/([a-z0-9-]+)$/i);
      if (m && req.method() === 'GET' && resp.status() === 200) { try { stepDefs[m[2]] = JSON.parse(body); } catch (e) {} }
      if (/feature-tests/.test(clean)) console.log('   [feature-test] ' + body.slice(0, 200));
      if (m && req.method() === 'POST') lastPost = { step: m[2], status: resp.status(), body };
    } catch (e) {}
  });

  const walkActions = { start: spec.start, steps: [] };
  let code = 0;
  const snapshot = async () => page.evaluate(() => {
    const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const controls = [];
    document.querySelectorAll('button, [role=button], [role=radio], [role=checkbox], a[href], input, select, textarea').forEach(el => {
      if (!vis(el)) return; const tag = el.tagName.toLowerCase();
      const lab = (el.labels && el.labels.length ? el.labels[0].innerText : (el.innerText || el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.name || '')).replace(/\s+/g, ' ').trim().slice(0, 160);
      controls.push(`${tag}${el.type ? ':' + el.type : ''}${el.name ? '[name=' + el.name + ']' : ''}${tag === 'a' ? ' -> ' + el.getAttribute('href') : ''} | ${lab}${el.disabled ? ' [disabled]' : ''}${el.checked ? ' [checked]' : ''}`);
    });
    return { url: location.href, text: (document.querySelector('main') || document.body).innerText.replace(/\n{3,}/g, '\n\n').trim(), controls };
  });
  const clickLabel = async (name) => {
    const cands = [page.locator(`label[for="${name.replace(/(["\\])/g, '\\$1')}"]`), page.getByRole('radio', { name, exact: true }), page.getByRole('checkbox', { name, exact: true }), page.getByLabel(name, { exact: true }), page.getByRole('button', { name, exact: true }), page.getByText(name, { exact: true })];
    for (const c of cands) {
      try { const n = await c.count(); for (let i = 0; i < n; i++) { const el = c.nth(i); if (await el.isVisible()) { try { await el.evaluate(e => e.scrollIntoView({ block: 'center' })); await sleep(150); } catch (e) {} try { await el.click({ timeout: 4000 }); } catch (e) { await el.click({ timeout: 3000, force: true }); } return true; } } } catch (e) {}
    }
    return false;
  };

  try {
    await page.goto(spec.start, { waitUntil: 'domcontentloaded', timeout: 45000 });
    let prevId = null;
    // same cookie handling as tools/walk.js (it presses "Accept all cookies" when no reject button exists)
    let cookiesDone = false;
    const cookies = async (tries) => {
      if (cookiesDone) return;
      for (let w = 0; w < tries; w++) {
        try { const c = page.getByRole('button', { name: /^accept all cookies$/i }).first(); if (await c.isVisible()) { await c.click({ timeout: 2000 }); cookiesDone = true; await sleep(700); return; } } catch (e) {}
        await sleep(300);
      }
    };
    try { await page.waitForLoadState('networkidle', { timeout: 8000 }); } catch (e) {}
    await cookies(40);
    for (let n = 0; n < max; n++) {
      // wait for a step whose id is in the URL and whose definition has arrived
      let id = null;
      for (let w = 0; w < 60; w++) {
        const m = page.url().match(/\/c\/[^/]+\/([^/?#]+)/) || page.url().match(/\/consultations\/[^/]+\/([^/?#]+)/);
        if (m && m[1] !== 'new' && m[1] !== prevId && stepDefs[m[1]]) { id = m[1]; break; }
        await sleep(250);
      }
      await sleep(900);
      await cookies(1);
      const snap = await snapshot();
      if (!id) {
        fs.writeFileSync(path.join(outDir, pad(n) + '.txt'), `URL: ${snap.url}\n\n${snap.text}\n\n--- CONTROLS ---\n${snap.controls.join('\n')}\n`);
        try { await page.screenshot({ path: path.join(outDir, pad(n) + '.jpg'), type: 'jpeg', quality: 55 }); } catch (e) {}
        console.log(`\n===== ${pad(n)} NO NEW STEP (url ${snap.url}; previous step "${prevId}"; last POST ${JSON.stringify(lastPost)}) =====\n${snap.text.slice(0, 3000)}\nCONTROLS:\n${snap.controls.join('\n')}`);
        code = 2; break;
      }
      const def = stepDefs[id];
      fs.writeFileSync(path.join(outDir, 'steps', `${pad(n)}-${id}.json`), JSON.stringify(def, null, 1));
      fs.writeFileSync(path.join(outDir, pad(n) + '.txt'), `STEP ${pad(n)} ${id}\nURL: ${snap.url}\n\n--- VISIBLE TEXT ---\n${snap.text}\n\n--- CONTROLS ---\n${snap.controls.join('\n')}\n`);
      try { await page.screenshot({ path: path.join(outDir, pad(n) + '.jpg'), type: 'jpeg', quality: 55, fullPage: true }); } catch (e) {}
      const s = def.step || def;
      let ans = (spec.answers || {})[id];
      // server-side variants: the same step id can arrive with different question ids (e.g. skin tone as buttons or as a slider).
      // {"byQuestion": {"9346": [...], "9348": [...]}} picks the list for whichever question id is on screen.
      if (ans && !Array.isArray(ans) && ans.byType) {
        // {"byType": {"number_slider": [], "single_select_button": ["5"]}} picks by the input type of the first real question on screen.
        const types = (s.questions || []).map(q => q.inputType); const k = Object.keys(ans.byType).find(x => types.includes(x));
        ans = k ? ans.byType[k] : undefined;
        if (k) console.log(`   (variant: input type ${k})`);
      } else if (ans && !Array.isArray(ans) && ans.byQuestion) {
        const ids = (s.questions || []).map(q => String(q.id)); const k = Object.keys(ans.byQuestion).find(x => ids.includes(x));
        ans = k ? ans.byQuestion[k] : undefined;
        if (k) console.log(`   (variant: question ${k})`);
      }
      // --auto: only for screens with an obvious neutral answer (info screens, a lone confirm tick-box, "No", "None of the above").
      // Anything else (and every free-text / contact field) still stops the walk.
      if (ans === undefined && args.includes('--auto')) {
        const qs = (s.questions || []).filter(q => !['display_text', 'markdown', 'image', 'display_image', 'interstitial'].includes(q.inputType));
        const pick = [];
        let ok = true;
        for (const q of qs) {
          const opts = (q.inputConfig && q.inputConfig.options || []).map(o => o.label);
          const cond = q.inputConfig && q.inputConfig.renderConditions && q.inputConfig.renderConditions.length;
          if (cond) { if (q.inputType === 'boolean_checkbox' && q.inputConfig.option) pick.push({ ifVisible: q.inputConfig.option.label }); else pick.push({ stopIfVisible: q.label || q.text || String(q.id), qid: q.id }); }
          else if (q.inputType === 'boolean_checkbox' && q.inputConfig && q.inputConfig.option) pick.push(q.inputConfig.option.label);
          else if (/^multi_select/.test(q.inputType) && opts.length) {
            const ex = (q.inputConfig.options || []).find(o => o.exclusive);
            if (ex) pick.push(ex.label); else ok = false;
          } else if (q.inputConfig && q.inputConfig.isOptional) { /* skip optional */ }
          else ok = false;
        }
        if (ok) { ans = pick; console.log('   (auto)'); }
      }
      const brief = `${pad(n)} [${id}] (${s.type}) ${s.title || ''}`;
      if (ans === undefined) {
        console.log(`\n===== STOP: no answer for step ${brief} =====\nURL: ${snap.url}\nJSON: ${JSON.stringify(def)}\nTEXT: ${snap.text.slice(0, 2500)}\nCONTROLS:\n${snap.controls.join('\n')}`);
        break;
      }
      console.log(`${brief}  ->  ${JSON.stringify(ans)}`);
      for (const a of ans) {
        if (typeof a === 'string') {
          if (!(await clickLabel(a))) { console.log(`!!!!! could not click "${a}" on step ${id}\nCONTROLS:\n${snap.controls.join('\n')}`); code = 2; break; }
          walkActions.steps.push({ do: 'click', text: a });
        } else if (a && a.ifVisible) {
          await sleep(400);
          let vis = false; try { vis = await page.getByText(a.ifVisible, { exact: true }).first().isVisible(); } catch (e) {}
          if (vis) { await clickLabel(a.ifVisible); walkActions.steps.push({ do: 'click', text: a.ifVisible }); }
        } else if (a && a.stopIfVisible) {
          await sleep(400);
          let vis = false; try { vis = await page.locator(`[name="${a.qid}"]`).first().isVisible(); } catch (e) {}
          if (vis) { console.log(`!!!!! conditional question ${a.qid} "${a.stopIfVisible}" became visible on step ${id}; add an explicit answer`); code = 2; break; }
        } else if (a && a.type) {
          const el = page.locator(a.type).first(); await el.click({ timeout: 5000 }); await page.keyboard.type(String(a.value), { delay: 60 });
          walkActions.steps.push({ do: 'click', selector: a.type }, { do: 'type', value: String(a.value) });
        } else if (a && a.range) {
          await page.locator(a.range).first().fill(String(a.value), { timeout: 5000 });
          walkActions.steps.push({ do: 'fill', selector: a.range, value: String(a.value) });
        } else if (a && a.fill) {
          let el = page.locator(a.fill).first();
          try { if (!(await el.isVisible({ timeout: 800 }))) throw 0; } catch (e) { el = page.getByLabel(a.fill).first(); }
          await el.fill(String(a.value), { timeout: 5000 });
          walkActions.steps.push({ do: 'fill', selector: a.fill, value: String(a.value) });
        } else if (a && a.select) {
          await page.locator(a.select).first().selectOption(a.value, { timeout: 5000 });
          walkActions.steps.push({ do: 'select', selector: a.select, value: a.value });
        } else if (a && a.press) { await page.keyboard.press(a.press); walkActions.steps.push({ do: 'press', key: a.press }); }
        await sleep(250);
      }
      if (code) break;
      // stage 2 addition: record the screen AFTER the answers are in and BEFORE pressing the button, so same-screen reveals
      // (must-tick boxes, warnings, free-text boxes driven by renderConditions) are captured as seen, not just read from the step JSON.
      try {
        if (ans.length) {
          const aft = await snapshot();
          fs.writeFileSync(path.join(outDir, pad(n) + '-after.txt'), `STEP ${pad(n)} ${id} AFTER ANSWERS ${JSON.stringify(ans)}\nURL: ${aft.url}\n\n--- VISIBLE TEXT ---\n${aft.text}\n\n--- CONTROLS ---\n${aft.controls.join('\n')}\n`);
          if (/"renderConditions":\s*\[\s*\{/.test(JSON.stringify(def))) await page.screenshot({ path: path.join(outDir, pad(n) + '-after.jpg'), type: 'jpeg', quality: 55, fullPage: true });
        }
      } catch (e) {}
      const actions = (s.actionsList || []).map(x => x.next && x.next.label).filter(Boolean);
      const skip = (s.actionsList || []).map(x => x.skipAsNext && x.skipAsNext.label).filter(Boolean)[0];
      const auto = (s.actionsList || []).map(x => x.autoNext).filter(Boolean)[0];
      const btn = (spec.button || {})[id] || actions[0] || skip || (auto ? null : 'Next question');
      if (btn === null) { await sleep((auto.duration || 5000) + 1500); walkActions.steps.push({ do: 'wait', ms: (auto.duration || 5000) + 1500, _step: id }); }
      else {
        const rx = new RegExp('^\\s*' + btn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$', 'i');
        let b = page.getByRole('button', { name: rx }).first();
        try { if (!(await b.isVisible())) b = page.getByRole('link', { name: rx }).first(); } catch (e) {}
        try { await b.click({ timeout: 6000 }); } catch (e) {
          const after = await snapshot();
          if (args.includes('--html')) { try { fs.writeFileSync(path.join(outDir, 'fail.html'), await page.content()); await page.screenshot({ path: path.join(outDir, 'fail.jpg'), type: 'jpeg', quality: 60, fullPage: true }); } catch (e2) {} }
          console.log(`!!!!! could not press "${btn}" on step ${id}: ${String(e.message).split('\n')[0]}\nTEXT: ${after.text.slice(0, 1500)}\nCONTROLS:\n${after.controls.join('\n')}`); code = 2; break;
        }
        walkActions.steps.push({ do: 'click', text: btn, exact: false, _step: id });
      }
      prevId = id;
      await sleep(1200);
    }
    try {
      const storage = await page.evaluate(() => ({ local: Object.fromEntries(Object.entries(localStorage)), session: Object.fromEntries(Object.entries(sessionStorage)) }));
      fs.writeFileSync(path.join(outDir, 'storage.json'), JSON.stringify(storage, null, 1).slice(0, 2e6));
    } catch (e) {}
  } catch (e) { console.log('FATAL: ' + String(e.message || e).split('\n')[0]); code = 3; }
  fs.writeFileSync(path.join(outDir, 'walk-actions.json'), JSON.stringify(walkActions, null, 1));
  apiLog.end();
  await browser.close();
  console.log(`\n[autowalk] exit ${code} -> ${outDir}`);
  process.exit(code);
})();
