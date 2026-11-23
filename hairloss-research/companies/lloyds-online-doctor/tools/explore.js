#!/usr/bin/env node
/*
 * explore.js — LloydsPharmacy Online Doctor hair-loss consultation walker (guest route, no sign-in).
 *
 * The consultation is server-driven: after each answer the page asks
 *   GET /api/questionnaire/traversals/<id>/steps/current
 * for the next step. This script answers from a policy file, saves every step JSON, and STOPS at the
 * account wall (registrationRequiredBeforeStep = true, or any screen asking for contact details).
 * It never types an email, name, phone, address or password.
 *
 * Usage: node explore.js <policy.json> <outDir>
 * policy.json: { "answers": { "<questionId>": "Option text" | ["Option A","Option B"] | {"text":"free text"} },
 *                "byText": { "<regex on question text>": <same as above> },
 *                "default": "stop",            // what to do with a question that has no answer: only "stop"
 *                "maxSteps": 60 }
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const [polFile, outDir] = process.argv.slice(2);
if (!polFile || !outDir) { console.error('usage: node explore.js <policy.json> <outDir>'); process.exit(1); }
const pol = JSON.parse(fs.readFileSync(polFile, 'utf8'));
fs.mkdirSync(path.join(outDir, 'steps'), { recursive: true });
const pad = n => String(n).padStart(2, '0');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const CONTACT = /e-?mail|password|phone|mobile number|first name|last name|surname|postcode|address|date of birth/i;
const strip = h => String(h || '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1280, height: 900 }, locale: 'en-GB', timezoneId: 'Europe/London' });
  const page = await ctx.newPage();
  const net = fs.createWriteStream(path.join(outDir, 'network.jsonl'));
  const scripts = new Set();
  let lastStep = null, stepSeq = 0, apiSeq = 0;
  page.on('response', async resp => {
    try {
      const url = resp.url(); const req = resp.request();
      if (req.resourceType() === 'script') scripts.add(url);
      if (!/core\.onlinedoctor\.lloydspharmacy\.com\/api\//.test(url)) return;
      let body = ''; try { body = (await resp.body()).toString('utf8'); } catch (e) {}
      const f = `api-${pad(++apiSeq)}.json`;
      fs.writeFileSync(path.join(outDir, 'steps', f), body);
      net.write(JSON.stringify({ url, method: req.method(), status: resp.status(), size: body.length, post: req.postData() || undefined, file: 'steps/' + f }) + '\n');
      if (/\/steps\/current/.test(url) && req.method() === 'GET' || /\/steps/.test(url) && body.includes('"step"')) {
        try { const j = JSON.parse(body); if (j.step) { lastStep = { seq: ++stepSeq, j }; } } catch (e) {}
      }
    } catch (e) {}
  });
  const shot = async (name) => {
    try { await page.screenshot({ path: path.join(outDir, name + '.jpg'), type: 'jpeg', quality: 55 }); } catch (e) {}
    try {
      const t = await page.evaluate(() => (document.body.innerText || '').replace(/\n{3,}/g, '\n\n'));
      const h = await page.evaluate(() => { const r = document.querySelector('#root') || document.body; const c = r.cloneNode(true); c.querySelectorAll('script,style,svg,noscript,link').forEach(e => e.remove()); return c.innerHTML; });
      fs.writeFileSync(path.join(outDir, name + '.txt'), 'URL: ' + page.url() + '\n\n' + t);
      fs.writeFileSync(path.join(outDir, name + '.html'), h);
      return t;
    } catch (e) { return ''; }
  };
  const clickIf = async (name) => { try { const b = page.getByRole('button', { name, exact: true }).first(); if (await b.isVisible({ timeout: 800 })) { await b.click({ timeout: 3000 }); await page.waitForTimeout(500); return true; } } catch (e) {} return false; };
  let code = 0;
  const log = [];
  try {
    await page.goto('https://core.onlinedoctor.lloydspharmacy.com/api/questionnaire/clinic/hair-loss', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);
    await clickIf('Reject unrequired cookies');
    try { await page.getByText('Continue with UK service', { exact: true }).click({ timeout: 3000 }); } catch (e) {}
    await shot('00-loginprompt');
    await page.goto(pol.entry || 'https://core.onlinedoctor.lloydspharmacy.com/api/questionnaire/clinic/hair-loss?guest', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3500);
    await clickIf('Reject unrequired cookies');
    await shot('01-before-we-begin');
    await page.getByRole('button', { name: 'Next', exact: true }).click({ timeout: 8000 });
    await page.waitForTimeout(1200);
    await shot('02-confirm');
    await page.locator('label:has-text("I confirm the above")').first().click({ timeout: 8000 });
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Next', exact: true }).click({ timeout: 8000 });
    // possible treatment-preference screen before the questionnaire
    await page.waitForTimeout(5000);
    let n = 2, handled = 0;
    const max = pol.maxSteps || 60;
    while (n - 2 < max) {
      n++;
      // wait for a new step JSON (or a navigation away)
      const t0 = Date.now();
      while ((!lastStep || lastStep.seq <= handled) && Date.now() - t0 < 12000) { await page.waitForTimeout(300); if (!/\/consultation\//.test(page.url()) && Date.now() - t0 > 4000) break; }
      await page.waitForTimeout(900);
      const txt = await shot(pad(n) + '-step');
      const url = page.url();
      if (!lastStep || lastStep.seq <= handled) {
        console.log(`\n##### NO NEW STEP JSON. URL: ${url}\nSCREEN TEXT:\n${txt.slice(0, 4000)}`);
        log.push({ n, url, noStep: true, text: txt.slice(0, 6000) });
        break;
      }
      handled = lastStep.seq;
      const st = lastStep.j.step;
      fs.writeFileSync(path.join(outDir, 'steps', `step-${pad(n)}.json`), JSON.stringify(lastStep.j, null, 1));
      const flags = { summaryRequiredBeforeStep: st.summaryRequiredBeforeStep, registrationRequiredBeforeStep: st.registrationRequiredBeforeStep, fastSummaryRequiredBeforeStep: st.fastSummaryRequiredBeforeStep };
      console.log(`\n===== SCREEN ${pad(n)} | step title "${st.title}" | ${JSON.stringify(flags)} | ${url}`);
      const entry = { n, url, title: st.title, flags, questions: [] };
      for (const q of st.questions || []) {
        const opts = (q.answerChoices || []).map(a => strip(a.displayText));
        console.log(`  Q ${q.questionId} [${q.type}] required=${q.answerRequired} titleOverride=${JSON.stringify(q.titleOverride || '')}\n    TEXT: ${strip(q.displayText)}${opts.length ? '\n    OPTIONS: ' + opts.map(o => JSON.stringify(o)).join(' | ') : ''}`);
        const extra = Object.keys(q).filter(k => !['questionId', 'displayText', 'type', 'answerRequired', 'answerChoices', 'titleOverride', 'explanationAvailable', 'smoothTransition'].includes(k));
        if (extra.length) console.log('    EXTRA: ' + JSON.stringify(Object.fromEntries(extra.map(k => [k, q[k]]))).slice(0, 600));
        entry.questions.push({ id: q.questionId, type: q.type, text: strip(q.displayText), options: opts, required: q.answerRequired });
      }
      if (Object.keys(st.questionAnswerErrors || {}).length) console.log('  ERRORS: ' + JSON.stringify(st.questionAnswerErrors));
      log.push(entry);
      if (st.registrationRequiredBeforeStep || /\/(register|login)/.test(url) || (CONTACT.test(txt) && /register|sign in|create (an )?account/i.test(txt))) {
        console.log('\n##### ACCOUNT WALL reached (registration required). Stopping. Screen text:\n' + txt.slice(0, 3000));
        entry.accountWall = true; break;
      }
      // answer every question in this step
      let stop = false;
      for (const q of st.questions || []) {
        const qt = strip(q.displayText);
        let a = (pol.answers || {})[q.questionId];
        if (a === undefined) for (const [re, v] of Object.entries(pol.byText || {})) { if (new RegExp(re, 'i').test(qt)) { a = v; break; } }
        if (q.type === 'MESSAGE' || q.type === 'INFO' || (!(q.answerChoices || []).length && !q.answerRequired && a === undefined)) { continue; }
        if (a === undefined) { console.log(`\n##### NO ANSWER in policy for question ${q.questionId}. Stopping here.`); stop = true; break; }
        if (CONTACT.test(qt) && !(pol.allowText || []).includes(q.questionId)) { console.log(`\n##### Question ${q.questionId} looks like a contact-detail field. Stopping (account wall).`); entry.accountWall = true; stop = true; break; }
        const list = Array.isArray(a) ? a : [a];
        for (const one of list) {
          if (one && typeof one === 'object' && 'text' in one) {
            const box = page.locator('textarea:visible, input[type=text]:visible, input[type=number]:visible, input:not([type]):visible').first();
            await box.fill(String(one.text), { timeout: 6000 });
          } else {
            let done = false; let err = '';
            const cands = [page.locator(`label:has-text(${JSON.stringify(one)})`), page.getByText(one, { exact: true })];
            for (const c of cands) {
              const cnt = await c.count();
              for (let i = 0; i < cnt && !done; i++) {
                const el = c.nth(i);
                try { const it = ((await el.innerText()) || '').replace(/\s+/g, ' ').trim(); if (it !== one) continue; await el.click({ timeout: 4000 }); done = true; } catch (e) { err = e.message.split('\n')[0]; }
              }
              if (done) break;
            }
            if (!done) { console.log(`\n##### could not click option ${JSON.stringify(one)} for ${q.questionId}: ${err}`); stop = true; code = 2; break; }
          }
          await page.waitForTimeout(350);
        }
        if (stop) break;
      }
      if (stop) break;
      await shot(pad(n) + '-answered');
      try { await page.getByRole('button', { name: /^(Next|Continue)$/ }).first().click({ timeout: 6000 }); }
      catch (e) { console.log('\n##### no Next button: ' + e.message.split('\n')[0]); code = 2; break; }
      await page.waitForTimeout(1500);
    }
  } catch (e) { console.log('FATAL: ' + String(e.message || e).split('\n')[0]); code = 3; }
  await shot('zz-final');
  try { fs.writeFileSync(path.join(outDir, 'storage.json'), JSON.stringify(await page.evaluate(() => ({ local: Object.fromEntries(Object.entries(localStorage)), session: Object.fromEntries(Object.entries(sessionStorage)) })), null, 1)); } catch (e) {}
  fs.writeFileSync(path.join(outDir, 'walk-log.json'), JSON.stringify(log, null, 1));
  fs.writeFileSync(path.join(outDir, 'scripts.txt'), Array.from(scripts).join('\n'));
  console.log(`\nFINAL URL: ${page.url()}`);
  net.end();
  await browser.close();
  console.log(`[explore] exit ${code} -> ${outDir}`);
  process.exit(code);
})();
