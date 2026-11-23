// giwalk.js <answers.json> <outDir> — walk the newer Hims intake app (https://www.hims.com/g/i/hl) from a clean browser.
//
// The app is server-driven: after each answer the browser posts to flow-server.hims.com and the server names the next
// screen. So answers are given PER SCREEN (by the screen's slug, the last part of the address), not by position. That
// keeps a one-change replay honest even when a change adds or removes screens.
//
// answers.json: { "start": "https://www.hims.com/g/i/hl", "maxSteps": 60,
//                 "answers": { "<slug>": ["Option label", ...]            // click these (radio / checkbox / button)
//                              "<slug>": {"fill": [{"selector"|"label": "...", "value": "..."}], "select": [...]} } }
// A screen with no entry: if it has choices, a neutral one is picked (None / No / Not sure, else the first) and the step
// is marked UNMAPPED in the output; if it only has a Continue / Next button, that is clicked.
//
// HARD STOP (research rules): the walk ends as soon as a screen shows an email, phone, password, name or address field.
// Nothing is ever typed into such a field. Only "fill" entries written in answers.json are typed (date of birth, state).
//
// Output in <outDir>: NN-<slug>.txt / .jpg per screen, net/NN-*.json (every flow-server reply), result.json (the path).
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
(async () => {
  const [specFile, outDir] = process.argv.slice(2);
  const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
  const answers = spec.answers || {};
  fs.mkdirSync(path.join(outDir, 'net'), { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', viewport: { width: 1280, height: 900 }, locale: 'en-US', timezoneId: 'America/New_York' });
  const page = await ctx.newPage();
  let netN = 0; let lastNode = null; const posts = [];
  page.on('response', async r => {
    try {
      const u = r.url();
      if (!/flow-server\.hims\.com/.test(u)) return;
      const body = await r.text(); netN++;
      const req = r.request(); let sent = ''; try { sent = req.postData() || ''; } catch (e) {}
      const red = s => s.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, '<session>');
      fs.writeFileSync(path.join(outDir, 'net', String(netN).padStart(2, '0') + '-' + req.method() + '-' + u.split('/').pop().split('?')[0] + '.json'), JSON.stringify({ url: red(u), status: r.status(), sent: sent.slice(0, 6000), body: (() => { try { return JSON.parse(body); } catch (e) { return body.slice(0, 20000); } })() }, null, 1));
      if (sent) posts.push(sent.slice(0, 1500));
      try { const j = JSON.parse(body); if (j && j.context && j.context.node) lastNode = j; } catch (e) {}
    } catch (e) {}
  });
  const snap = () => page.evaluate(() => {
    const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const t = el => (el.innerText || el.value || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
    const lab = el => { if (el.labels && el.labels.length) return t(el.labels[0]); const p = el.closest('label'); if (p) return t(p); return el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.getAttribute('name') || el.id || ''; };
    const choices = []; const buttons = []; const fields = [];
    document.querySelectorAll('[role=radio],[role=checkbox],input[type=radio],input[type=checkbox]').forEach(el => {
      const visible = vis(el) || (el.labels && el.labels[0] && vis(el.labels[0])) || (el.closest('label') && vis(el.closest('label')));
      if (!visible) return;
      const kind = (el.getAttribute('role') || el.type || '').toLowerCase();
      const l = el.tagName === 'INPUT' ? lab(el) : t(el);
      if (l && !choices.find(c => c.label === l)) choices.push({ kind, label: l.slice(0, 200) });
    });
    document.querySelectorAll('button,[role=button],a[role=button]').forEach(el => { if (vis(el) && t(el)) buttons.push({ label: t(el).slice(0, 120), disabled: !!(el.disabled || el.getAttribute('aria-disabled') === 'true') }); });
    document.querySelectorAll('input:not([type=radio]):not([type=checkbox]):not([type=hidden]),select,textarea').forEach(el => { if (vis(el)) fields.push({ tag: el.tagName.toLowerCase(), type: el.type || '', name: el.getAttribute('name') || '', id: el.id || '', label: lab(el).slice(0, 120), placeholder: el.getAttribute('placeholder') || '', autocomplete: el.getAttribute('autocomplete') || '', options: el.tagName === 'SELECT' ? Array.from(el.options).map(o => o.text.trim()).slice(0, 70) : undefined }); });
    const links = Array.from(document.querySelectorAll('a[href]')).filter(vis).map(a => t(a).slice(0, 60) + ' -> ' + a.getAttribute('href')).slice(0, 30);
    return { url: location.href, slug: location.pathname.replace(/\/$/, '').split('/').pop(), text: (document.querySelector('main') || document.body).innerText.replace(/\n{3,}/g, '\n\n').trim(), choices, buttons, fields, links };
  });
  const CONTACT = /e-?mail|phone|mobile|password|first.?name|last.?name|full.?name|\bname\b|address|street|\bcity\b|ssn|social/i;
  const isContact = f => ['email', 'tel', 'password'].includes(f.type) || CONTACT.test([f.name, f.id, f.label, f.placeholder, f.autocomplete].join(' '));
  const NEUTRAL = [/^none of (the above|these)/i, /^none\b/i, /^no\b/i, /^not sure/i, /^i.?m not sure/i];
  const out = { start: spec.start, steps: [], end: null };
  const waitChange = async prev => { for (let i = 0; i < 40; i++) { await page.waitForTimeout(300); const now = await page.evaluate(() => location.pathname + '|' + (document.querySelector('main') || document.body).innerText.length + '|' + (document.querySelector('main') || document.body).innerText.slice(0, 80)).catch(() => prev); if (now !== prev) { await page.waitForTimeout(700); return true; } } return false; };
  const sig = () => page.evaluate(() => location.pathname + '|' + (document.querySelector('main') || document.body).innerText.length + '|' + (document.querySelector('main') || document.body).innerText.slice(0, 80));
  try {
    await page.goto(spec.start, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForLoadState('networkidle', { timeout: 9000 }).catch(() => {});
    await page.waitForTimeout(2500);
    let stuck = 0;
    for (let n = 0; n < (spec.maxSteps || 60); n++) {
      // let auto-advancing or loading screens settle
      let s = await snap();
      for (let i = 0; i < 12 && !s.choices.length && !s.fields.length && !s.buttons.filter(b => !/sign in|log in|back|close|menu/i.test(b.label)).length; i++) { await page.waitForTimeout(700); s = await snap(); }
      const nn = String(n).padStart(2, '0');
      const node = lastNode && lastNode.context && lastNode.context.node;
      const step = { n, slug: s.slug, url: s.url, text: s.text.slice(0, 2500), choices: s.choices, buttons: s.buttons, fields: s.fields, serverSlug: node && node.slug, serverType: node && node.type, serverStep: lastNode && lastNode.value, outputSchema: node && node.output, storedResponses: lastNode && lastNode.context && lastNode.context.responses };
      fs.writeFileSync(path.join(outDir, nn + '-' + s.slug + '.txt'), `STEP ${nn}\nURL: ${s.url}\nSERVER NODE: ${step.serverSlug} (${step.serverType}), step value ${step.serverStep}\n\n--- VISIBLE TEXT ---\n${s.text}\n\n--- CHOICES ---\n${s.choices.map(c => `[${c.kind}] ${c.label}`).join('\n')}\n\n--- BUTTONS ---\n${s.buttons.map(b => b.label + (b.disabled ? ' [disabled]' : '')).join(' | ')}\n\n--- FIELDS ---\n${s.fields.map(f => JSON.stringify(f)).join('\n')}\n\n--- LINKS ---\n${s.links.join('\n')}\n\n--- OUTPUT SCHEMA (server) ---\n${JSON.stringify(step.outputSchema)}\n`);
      await page.screenshot({ path: path.join(outDir, nn + '-' + s.slug + '.jpg'), type: 'jpeg', quality: 55 }).catch(() => {});
      out.steps.push(step);
      if (s.fields.some(isContact)) { step.action = 'STOP: contact field on screen (account wall). Nothing typed.'; out.end = { reason: 'account-wall', slug: s.slug, url: s.url, fields: s.fields.filter(isContact) }; break; }
      const prevSame = out.steps.filter(x => x.slug === s.slug).length;
      if (prevSame >= 3) { step.action = 'STOP: same screen three times'; out.end = { reason: 'stuck', slug: s.slug, url: s.url }; break; }
      const before = await sig();
      const a = answers[s.slug];
      // CONSENT WALL: a tick-box that agrees to legal terms or consent is never ticked by this tool. Values listed in
      // answers.json (for example the state) are still entered, to record whether the screen lets you go on without the tick.
      const consent = s.choices.filter(c => /agree|consent|terms/i.test(c.label));
      if (consent.length) {
        const did = [];
        if (a && !Array.isArray(a)) {
          for (const f of (a.select || [])) { const el = f.selector ? page.locator(f.selector).first() : page.locator('select').first(); await el.selectOption(f.value != null ? f.value : { label: f.label }, { timeout: 6000 }); did.push('select ' + (f.label || f.value)); }
        }
        await page.waitForTimeout(1200);
        const s3 = await snap();
        const cont = s3.buttons.find(b => /^(continue|next)\b/i.test(b.label));
        step.chosen = did; step.consentBox = consent.map(c => c.label); step.continueDisabledWithoutTick = cont ? cont.disabled : null;
        await page.screenshot({ path: path.join(outDir, nn + '-' + s.slug + '-after-select.jpg'), type: 'jpeg', quality: 55 }).catch(() => {});
        step.action = 'STOP: consent tick-box (not ticked). Continue button ' + (cont ? (cont.disabled ? 'stays disabled' : 'is enabled') : 'not found') + ' without the tick.';
        out.end = { reason: 'consent-wall', slug: s.slug, url: s.url, consentBox: step.consentBox, continueDisabledWithoutTick: step.continueDisabledWithoutTick, entered: did };
        break;
      }
      let chosen = [];
      if (a && !Array.isArray(a)) {
        for (const f of (a.fill || [])) { const el = f.selector ? page.locator(f.selector).first() : page.getByLabel(f.label).first(); await el.fill(String(f.value), { timeout: 6000 }); chosen.push('fill ' + (f.selector || f.label) + '=' + f.value); }
        for (const f of (a.select || [])) { const el = f.selector ? page.locator(f.selector).first() : page.locator('select').first(); await el.selectOption(f.value != null ? f.value : { label: f.label }, { timeout: 6000 }); chosen.push('select ' + (f.label || f.value)); }
        for (const l of (a.click || [])) { await clickLabel(l); chosen.push(l); }
      } else if (Array.isArray(a)) {
        for (const l of a) { await clickLabel(l); chosen.push(l); await page.waitForTimeout(350); }
      } else if (s.choices.length) {
        let pick = null; for (const re of NEUTRAL) { pick = s.choices.find(c => re.test(c.label)); if (pick) break; }
        if (!pick) pick = s.choices[0];
        await clickLabel(pick.label); chosen.push(pick.label); step.unmapped = true;
      } else if (s.fields.length) { step.action = 'STOP: a field needs a value that answers.json does not give'; out.end = { reason: 'needs-input', slug: s.slug, url: s.url, fields: s.fields }; break; }
      step.chosen = chosen;
      // single-choice screens move on by themselves about a second after the click: poll for up to 2.6 s
      let moved = false;
      for (let i = 0; i < 13 && !moved; i++) { await page.waitForTimeout(200); moved = (await page.evaluate(() => location.pathname).catch(() => '')) !== new URL(s.url).pathname; }
      if (!moved) {
        const s2 = await snap();
        const go = s2.buttons.find(b => /^(continue|next|get started|start|let.?s go|got it|sounds good|i understand|agree|see my|view my|show me|find my|okay|ok)\b/i.test(b.label) && !b.disabled) || (!s.choices.length && !a ? s2.buttons.find(b => !b.disabled && !/sign in|log in|back|close|menu|privacy|why we ask|learn more/i.test(b.label)) : null);
        if (go) {
          const b = page.getByRole('button', { name: go.label, exact: true }).first();
          try { await b.click({ timeout: 5000 }); } catch (e1) { try { await b.click({ timeout: 3000, force: true }); } catch (e2) { try { await b.evaluate(el => el.click()); } catch (e3) { step.clickError = String(e3).slice(0, 120); } } }
          step.clicked = go.label;
        }
        moved = await waitChange(before);
      } else { await page.waitForTimeout(700); }
      step.moved = moved;
      if (!moved) { stuck++; if (stuck >= 2) { out.end = { reason: 'stuck', slug: s.slug, url: s.url }; break; } } else stuck = 0;
    }
    if (!out.end) out.end = { reason: 'max-steps' };
  } catch (e) { out.end = { reason: 'error', error: String(e).slice(0, 500) }; }
  async function clickLabel(l) {
    const cands = [page.getByRole('radio', { name: l, exact: true }), page.getByRole('checkbox', { name: l, exact: true }), page.getByRole('button', { name: l, exact: true }), page.getByLabel(l, { exact: true }), page.getByText(l, { exact: true }), page.getByText(l)];
    for (const c of cands) { try { const n = await c.count(); for (let i = 0; i < n; i++) { const el = c.nth(i); if (await el.isVisible()) { try { await el.click({ timeout: 4000 }); } catch (e) { await el.click({ timeout: 3000, force: true }); } return; } } } catch (e) {} }
    throw new Error('no visible choice matches ' + JSON.stringify(l));
  }
  out.postsSent = posts.length;
  out.storage = await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) })).catch(() => ({}));
  fs.writeFileSync(path.join(outDir, 'result.json'), JSON.stringify(out, null, 1));
  for (const st of out.steps) console.log(`${String(st.n).padStart(2, '0')} [${st.slug}] ${st.text.replace(/\n+/g, ' / ').slice(0, 230)}\n     choices: ${st.choices.map(c => c.label).join(' | ').slice(0, 420)}${st.fields.length ? '\n     fields: ' + st.fields.map(f => f.type + ':' + (f.label || f.name || f.placeholder)).join(' | ') : ''}\n     -> ${st.unmapped ? 'UNMAPPED ' : ''}${JSON.stringify(st.chosen || [])}${st.clicked ? ' then [' + st.clicked + ']' : ''}${st.action ? ' ' + st.action : ''}`);
  console.log('END', JSON.stringify(out.end));
  await browser.close();
})();
