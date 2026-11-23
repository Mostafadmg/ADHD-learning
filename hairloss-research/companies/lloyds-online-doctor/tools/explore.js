#!/usr/bin/env node
/*
 * explore.js — LloydsPharmacy Online Doctor hair-loss consultation walker (guest route, no sign-in).
 *
 * The consultation is server-driven: after each answer the page POSTs the answer to
 *   /api/questionnaire/traversals/<id>/steps/current   and GETs the same URL for the next step.
 * This script answers from a policy file, saves every step JSON, and STOPS at the account wall
 * (registrationRequiredBeforeStep = true, a /register or /login URL, or a screen asking for contact details).
 * It never types an email, name, phone, address or password. Date of birth is the site's age question.
 *
 * Usage: node explore.js <policy.json> <outDir>
 * policy.json:
 *   { "answers": { "<questionId>": "Option text" | ["Option A","Option B"] | {"text":"free text"} | {"dob":[d,m,y]} | {"card":"Product title"} },
 *     "default": "stop" | "auto",   // auto (discovery only): Yes/No -> "No", "None of the above" where offered
 *     "explain": true,              // click each (i) explanation icon and save what it says
 *     "peek": false,                // at each choice question on the path: try every other option, record the NEXT screen, press Back
 *     "peekDepth": 2,               // how far to follow a follow-up question that is not on the baseline path
 *     "peekFrom": "<questionId>",   // start peeking at this question (earlier ones are just answered)
 *     "peekSkip": ["<questionId>:<Option>"], "baselineSigs": ["<questionId>", ...],
 *     "stopBeforeSummary": false, "maxSeconds": 540, "maxSteps": 60 }
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
const CONTACT = /e-?mail|password|phone|mobile number|first name|last name|surname|postcode|address/i;
const strip = h => String(h || '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const T0 = Date.now();
const timeUp = () => (Date.now() - T0) / 1000 > (pol.maxSeconds || 540);

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
      const f = `api-${String(++apiSeq).padStart(3, '0')}.json`;
      fs.writeFileSync(path.join(outDir, 'steps', f), body);
      net.write(JSON.stringify({ url, method: req.method(), status: resp.status(), size: body.length, post: req.postData() || undefined, file: 'steps/' + f }) + '\n');
      if (req.method() === 'GET' && /\/(steps\/(current|previous)|summary)(\?|$)/.test(url)) {
        try { const j = JSON.parse(body); if (j.step) { lastStep = { seq: ++stepSeq, j, url }; } } catch (e) {}
      }
    } catch (e) {}
  });
  const shot = async (name) => {
    try { await page.screenshot({ path: path.join(outDir, name + '.jpg'), type: 'jpeg', quality: 55 }); } catch (e) {}
    try {
      const t = await page.evaluate(() => (document.body.innerText || '').replace(/\n{3,}/g, '\n\n'));
      const h = await page.evaluate(() => { const r = document.querySelector('my-app') || document.querySelector('#root') || document.body; const c = r.cloneNode(true); c.querySelectorAll('script,style,svg,noscript,link').forEach(e => e.remove()); return c.innerHTML; });
      fs.writeFileSync(path.join(outDir, name + '.txt'), 'URL: ' + page.url() + '\n\n' + t);
      fs.writeFileSync(path.join(outDir, name + '.html'), h);
      return t;
    } catch (e) { return ''; }
  };
  const clickIf = async (name) => { try { const b = page.getByRole('button', { name, exact: true }).first(); if (await b.isVisible({ timeout: 800 })) { await b.click({ timeout: 3000 }); await page.waitForTimeout(500); return true; } } catch (e) {} return false; };
  const waitStep = async (prevSeq, ms) => { const t = Date.now(); while ((!lastStep || lastStep.seq <= prevSeq) && Date.now() - t < (ms || 12000)) await page.waitForTimeout(250); await page.waitForTimeout(700); return lastStep && lastStep.seq > prevSeq ? lastStep : null; };
  const sigOf = st => (st.questions || []).map(q => q.questionId).join('+') || (st.stepState || 'EMPTY');
  const describe = st => ({
    sig: sigOf(st), title: st.title, stepState: st.stepState,
    flags: { summaryRequiredBeforeStep: st.summaryRequiredBeforeStep, registrationRequiredBeforeStep: st.registrationRequiredBeforeStep, fastSummaryRequiredBeforeStep: st.fastSummaryRequiredBeforeStep },
    questions: (st.questions || []).map(q => ({ id: q.questionId, type: q.type, title: q.titleOverride || '', text: strip(q.displayText), required: q.answerRequired, explanationAvailable: q.explanationAvailable, options: (q.answerChoices || []).map(a => strip(a.displayText)), optionIds: (q.answerChoices || []).map(a => a.answerId), cards: (q.answerChoices || []).filter(a => a.metadata).map(a => ({ id: a.answerId, title: a.metadata.title, label: a.metadata.label, sku: a.metadata.sku, price: (a.metadata.pricingInformation || {}).price, perWeek: (a.metadata.pricingInformation || {}).pricePerWeek, inStock: a.metadata.inStock, recommended: a.metadata.recommended, preference: a.metadata.preference, mainOption: a.metadata.mainOption })) })),
  });
  const printStep = (d, indent) => {
    const I = indent || '';
    for (const q of d.questions) {
      console.log(`${I}  Q ${q.id} [${q.type}] required=${q.required} title=${JSON.stringify(q.title)}${q.explanationAvailable ? ' (i)' : ''}\n${I}    TEXT: ${q.text.slice(0, 900)}${q.options.length && !q.cards.length ? '\n' + I + '    OPTIONS: ' + q.options.map(o => JSON.stringify(o.slice(0, 160))).join(' | ') : ''}`);
      for (const c of q.cards) console.log(`${I}    CARD ${JSON.stringify(c)}`);
    }
    if (!d.questions.length) console.log(`${I}  (no questions; stepState=${d.stepState})`);
  };
  const selectOption = async (q, one) => {
    if (one && typeof one === 'object' && 'dob' in one) {
      await page.locator('#day').fill(String(one.dob[0]), { timeout: 6000 });
      await page.locator('#month').fill(String(one.dob[1]), { timeout: 6000 });
      await page.locator('#year').fill(String(one.dob[2]), { timeout: 6000 });
      await page.locator('#year').blur(); await page.waitForTimeout(500);
      try { await page.locator('label.ageConfirmCheckbox').click({ timeout: 5000 }); } catch (e) { console.log('    (no age-confirm tick box: ' + e.message.split('\n')[0] + ')'); }
      return true;
    }
    if (one && typeof one === 'object' && 'text' in one) {
      await page.locator('textarea:visible, input[type=text]:visible, input[type=number]:visible, input:not([type]):visible').first().fill(String(one.text), { timeout: 6000 });
      return true;
    }
    if (one && typeof one === 'object' && 'card' in one) {
      const a = (q.answerChoices || []).find(x => x.metadata && x.metadata.title === one.card);
      if (!a) { console.log('    (no card titled ' + JSON.stringify(one.card) + ')'); return false; }
      try { const banner = page.locator('.other-treatments-banner'); if (await banner.count()) { const vis = await page.locator(`[id="${a.answerId}"]`).isVisible(); if (!vis) { await banner.first().click({ timeout: 3000 }); await page.waitForTimeout(700); } } } catch (e) {}
      await page.locator(`[id="${a.answerId}"]`).click({ timeout: 6000 });
      return true;
    }
    let err = '';
    for (const c of [page.locator(`label:has-text(${JSON.stringify(one)})`), page.getByText(one, { exact: true })]) {
      const cnt = await c.count();
      for (let i = 0; i < cnt; i++) {
        const el = c.nth(i);
        try { const it = ((await el.innerText()) || '').replace(/\s+/g, ' ').trim(); if (it !== one) continue; await el.click({ timeout: 4000 }); return true; } catch (e) { err = e.message.split('\n')[0]; }
      }
    }
    console.log(`    (could not click option ${JSON.stringify(one)}: ${err})`);
    return false;
  };
  const clickNext = async () => { try { await page.locator('#nav-next').click({ timeout: 5000 }); return true; } catch (e) { try { await page.getByRole('button', { name: /^(Next|Continue|Confirm)/ }).first().click({ timeout: 3000 }); return true; } catch (e2) { return false; } } };
  const clickBack = async () => { try { const b = page.locator('#nav-previous'); if (await b.isVisible({ timeout: 800 })) { await b.click({ timeout: 4000 }); return true; } } catch (e) {} return false; };
  const explain = async (st, name) => {
    if (pol.explain === false) return;
    if (!(st.questions || []).some(q => q.explanationAvailable || (q.answerChoices || []).some(a => a.explanationAvailable))) return;
    try {
      const icons = page.locator('[id="explanationIcon"]');
      const ic = await icons.count();
      console.log(`  (explanations available: ${ic} icon(s) on screen)`);
      for (let i = 0; i < ic; i++) {
        const before = apiSeq;
        try { await icons.nth(i).click({ timeout: 2000 }); } catch (e) {}
        let t1 = Date.now(); while (apiSeq === before && Date.now() - t1 < 2000) await page.waitForTimeout(200);
        if (apiSeq === before) { try { await icons.nth(i).dispatchEvent('click'); } catch (e) {} t1 = Date.now(); while (apiSeq === before && Date.now() - t1 < 2000) await page.waitForTimeout(200); }
        if (apiSeq === before) { try { await icons.nth(i).locator('xpath=..').click({ timeout: 1500, force: true }); } catch (e) {} t1 = Date.now(); while (apiSeq === before && Date.now() - t1 < 2000) await page.waitForTimeout(200); }
        await page.waitForTimeout(500);
        if (i === 0) await shot(name + '-explanation');
        try { const c = page.getByText('Close', { exact: true }).first(); if (await c.isVisible({ timeout: 500 })) await c.click({ timeout: 2000 }); } catch (e) {}
        await page.waitForTimeout(400);
      }
    } catch (e) { console.log('  (explanation click failed: ' + e.message.split('\n')[0] + ')'); }
  };

  let code = 0;
  const log = [], peeks = [];
  const baseSigs = new Set(pol.baselineSigs || []);
  const seenSub = new Set();
  let peeking = !pol.peekFrom, stuck = false, shotN = 0;

  // try every non-baseline option of the question on screen; record the next screen; press Back
  const peekQuestion = async (st, q, baseAnswer, depth, trail) => {
    const d = describe(st); const mySig = d.sig;
    const opts = (q.answerChoices || []).map(a => strip(a.displayText));
    const baseList = (Array.isArray(baseAnswer) ? baseAnswer : [baseAnswer]).filter(x => typeof x === 'string');
    for (const opt of opts) {
      if (stuck || timeUp()) return;
      if (baseList.includes(opt)) continue;
      if ((pol.peekSkip || []).includes(`${q.questionId}:${opt}`)) continue;
      const I = '    '.repeat(depth);
      const seq0 = lastStep.seq;
      if (!await selectOption(q, opt)) { peeks.push({ from: q.questionId, option: opt, trail, error: 'could not click' }); continue; }
      await page.waitForTimeout(900);
      if (lastStep.seq === seq0) { if (!await clickNext()) console.log(`${I}  (no Next after choosing ${JSON.stringify(opt)})`); }
      const res = await waitStep(seq0, 9000);
      const name = `peek-${pad(++shotN)}-${q.questionId}`;
      const txt = await shot(name);
      if (!res) {
        console.log(`${I}  PEEK ${q.questionId} = ${JSON.stringify(opt)} -> no new step. Screen says: ${txt.replace(/\s+/g, ' ').slice(-400)}`);
        peeks.push({ from: q.questionId, option: opt, trail, noStep: true, text: txt.slice(0, 3000), shot: name });
        if (/MULTIPLE/.test(q.type)) { await selectOption(q, opt); await page.waitForTimeout(400); }
        continue;
      }
      const rd = describe(res.j.step);
      const onBase = baseSigs.has(rd.sig);
      console.log(`${I}  PEEK ${q.questionId} = ${JSON.stringify(opt)} -> ${onBase ? 'continues to baseline step ' + rd.sig : 'NEW step ' + rd.sig + ' "' + (rd.title || '') + '"'} ${JSON.stringify(rd.flags)}`);
      fs.writeFileSync(path.join(outDir, 'steps', name + '.json'), JSON.stringify(res.j, null, 1));
      const rec = { from: q.questionId, option: opt, trail, result: rd, onBaseline: onBase, shot: name, text: onBase ? undefined : txt.slice(0, 4000) };
      peeks.push(rec);
      if (!onBase) {
        printStep(rd, I + '  ');
        const first = !seenSub.has(rd.sig); seenSub.add(rd.sig);
        const rq = (res.j.step.questions || []);
        if (first && depth < (pol.peekDepth || 2) && !rd.flags.registrationRequiredBeforeStep && rq.length === 1 && /CHOICE/.test(rq[0].type) && !/CARD/.test(rq[0].type)) {
          await peekQuestion(res.j.step, rq[0], [], depth + 1, trail.concat([`${q.questionId}=${opt}`]));
          if (stuck) return;
        }
      }
      // back to the question we came from
      const seq1 = lastStep.seq;
      const hadBack = await clickBack();
      const back = hadBack ? await waitStep(seq1, 9000) : null;
      if (!back || sigOf(back.j.step) !== mySig) {
        console.log(`${I}  !!!!! STUCK after ${q.questionId} = ${JSON.stringify(opt)}: ${hadBack ? 'Back went to ' + (back ? sigOf(back.j.step) : 'nothing') : 'no Back button on that screen'}. Ending the run here.`);
        rec.stuck = true; stuck = true; return;
      }
      if (/MULTIPLE/.test(q.type)) {
        const stillSel = ((back.j.step.questions || [])[0].answerChoices || []).some(a => strip(a.displayText) === opt && a.selected);
        if (stillSel) { await selectOption(q, opt); await page.waitForTimeout(400); }
      }
    }
  };

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
    let n = 2, handled = 0;
    const max = pol.maxSteps || 60;
    while (n - 2 < max) {
      n++;
      const cur = await waitStep(handled, 14000);
      const txt = await shot(pad(n) + '-step');
      const url = page.url();
      if (!cur) {
        console.log(`\n##### NO NEW STEP JSON. URL: ${url}\nSCREEN TEXT:\n${txt.slice(0, 5000)}`);
        log.push({ n, url, noStep: true, text: txt.slice(0, 8000) });
        break;
      }
      handled = cur.seq;
      const st = cur.j.step;
      fs.writeFileSync(path.join(outDir, 'steps', `step-${pad(n)}.json`), JSON.stringify(cur.j, null, 1));
      const d = describe(st);
      console.log(`\n===== SCREEN ${pad(n)} | step "${st.title || st.stepState}" | ${JSON.stringify(d.flags)} | ${url}`);
      printStep(d);
      const entry = Object.assign({ n, url, text: txt.slice(0, 6000) }, d);
      log.push(entry);
      if (st.registrationRequiredBeforeStep || /\/(register|login)/.test(url) || (CONTACT.test(txt) && /register|sign in|create (an |your )?account/i.test(txt))) {
        console.log('\n##### ACCOUNT WALL reached. Stopping. Screen text:\n' + txt.slice(0, 4000));
        entry.accountWall = true; break;
      }
      if (st.stepState === 'SUMMARY') {
        if (pol.stopBeforeSummary) { console.log('\n(stopBeforeSummary set: ending here)'); break; }
        console.log('  (answers summary page: confirming it to reach the recommendations)');
        if (!await clickNext()) { console.log('##### could not confirm the summary'); code = 2; break; }
        continue;
      }
      await explain(st, pad(n));
      let stop = false;
      for (const q of st.questions || []) {
        const qt = strip(q.displayText);
        let a = (pol.answers || {})[q.questionId];
        if (q.type === 'MESSAGE' || q.type === 'INFO') continue;
        if (a === undefined && pol.default === 'auto') {
          const o = (q.answerChoices || []).map(x => strip(x.displayText));
          if (q.type === 'SINGLE_CHOICE' && o.length === 2 && o.includes('Yes') && o.includes('No')) a = 'No';
          else { const none = o.find(x => /^none( of (the above|these))?$/i.test(x)); if (none) a = none; else if (q.type === 'MULTIPLE_CHOICE') a = 'None of the above'; }
          if (a !== undefined) console.log(`    (auto-answer: ${JSON.stringify(a)})`);
        }
        if (a === undefined) { console.log(`\n##### NO ANSWER in policy for question ${q.questionId}. Stopping here.`); stop = true; break; }
        if (CONTACT.test(qt)) { console.log(`\n##### Question ${q.questionId} looks like a contact-detail field. Stopping (account wall).`); entry.accountWall = true; stop = true; break; }
        entry.answered = entry.answered || {}; entry.answered[q.questionId] = a;
        if (pol.peek && pol.peekFrom === q.questionId) peeking = true;
        if (pol.peek && peeking && (st.questions || []).length === 1 && /CHOICE/.test(q.type) && !/CARD/.test(q.type) && !timeUp()) {
          await peekQuestion(st, q, a, 0, []);
          if (stuck) { stop = true; break; }
        }
        for (const one of (Array.isArray(a) ? a : [a])) { if (!await selectOption(q, one)) { stop = true; code = 2; break; } await page.waitForTimeout(350); }
        if (stop) break;
      }
      if (stop) break;
      await page.waitForTimeout(1500);
      if (lastStep.seq > handled) { console.log('    (auto-advanced on click, no Next needed)'); continue; }
      await shot(pad(n) + '-answered');
      if (!await clickNext()) { console.log('\n##### no Next button'); code = 2; break; }
    }
  } catch (e) { console.log('FATAL: ' + String(e.message || e).split('\n')[0]); code = 3; }
  await shot('zz-final');
  try { fs.writeFileSync(path.join(outDir, 'storage.json'), JSON.stringify(await page.evaluate(() => ({ local: Object.fromEntries(Object.entries(localStorage)), session: Object.fromEntries(Object.entries(sessionStorage)) })), null, 1)); } catch (e) {}
  fs.writeFileSync(path.join(outDir, 'walk-log.json'), JSON.stringify(log, null, 1));
  if (pol.peek) fs.writeFileSync(path.join(outDir, 'peeks.json'), JSON.stringify(peeks, null, 1));
  fs.writeFileSync(path.join(outDir, 'scripts.txt'), Array.from(scripts).join('\n'));
  console.log(`\nFINAL URL: ${page.url()}  (${Math.round((Date.now() - T0) / 1000)} s${timeUp() ? ', time budget used up' : ''})`);
  net.end();
  await browser.close();
  console.log(`[explore] exit ${code} -> ${outDir}`);
  process.exit(code);
})();
