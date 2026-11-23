#!/usr/bin/env node
/*
 * walk-eval.js — copy of tools/walk.js with one extra step {"do":"eval","js":"<expression>"} (writes eval.json).
 * walk.js — replay a consultation from the start with a given list of answers,
 * and record every screen. Used for "change one answer, see what changes" tests.
 *
 * Usage:
 *   node walk.js <actions.json> <outDir> [--last] [--from N] [--headed] [--mobile]
 *
 * actions.json:
 *   {
 *     "start": "https://example.com/quiz",
 *     "steps": [
 *       {"do": "click", "text": "Get started"},            // button / radio / checkbox / link / label / text
 *       {"do": "click", "text": "Yes", "nth": 1},           // nth visible match (0-based)
 *       {"do": "click", "selector": "button[type=submit]"}, // any CSS / Playwright selector
 *       {"do": "fill",  "label": "Age", "value": "34"},     // by label, placeholder or selector
 *       {"do": "fill",  "selector": "input[name=dob]", "value": "01/01/1990"},
 *       {"do": "select","selector": "select", "value": "male"},
 *       {"do": "press", "key": "Enter"},
 *       {"do": "wait",  "ms": 2000},
 *       {"do": "goto",  "url": "https://example.com/other"},
 *       {"do": "scroll"}                                    // scroll to bottom (lazy content)
 *     ]
 *   }
 *
 * After the start page and after every step it writes into <outDir>:
 *   NN.txt  (url, title, visible text, list of controls)   NN.jpg (screenshot)
 *   network.jsonl (every JSON/XHR response: url, status, size, saved file)
 *   net/*.json     (bodies of JSON responses, capped)       storage.json (local/session storage at the end)
 * and prints a short summary of each screen (or only the last one with --last).
 *
 * Exit code 2 = a step could not be done (the summary lists the controls that were on screen).
 */
const fs = require('fs');
const path = require('path');
const { chromium, devices } = require('playwright');

const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('--')));
const pos = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1] === '--from'));
const fromIdx = args.includes('--from') ? parseInt(args[args.indexOf('--from') + 1], 10) : 0;
if (pos.length < 2) { console.error('usage: node walk.js <actions.json> <outDir> [--last] [--from N] [--headed] [--mobile]'); process.exit(1); }
const spec = JSON.parse(fs.readFileSync(pos[0], 'utf8'));
const outDir = pos[1];
fs.mkdirSync(path.join(outDir, 'net'), { recursive: true });

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const COOKIE_BTNS = ['Reject all', 'Reject All', 'Reject all cookies', 'Decline', 'Only necessary', 'Necessary only', 'Accept all cookies', 'Accept All Cookies', 'Accept all', 'Accept All', 'Allow all', 'I agree', 'Got it', 'Accept'];
const pad = n => String(n).padStart(2, '0');
let netCount = 0, netBytes = 0;

async function settle(page, ms) {
  try { await page.waitForLoadState('domcontentloaded', { timeout: 15000 }); } catch (e) {}
  try { await page.waitForLoadState('networkidle', { timeout: 6000 }); } catch (e) {}
  await page.waitForTimeout(ms || 900);
}

async function dismissCookies(page) {
  for (const t of COOKIE_BTNS) {
    try {
      const b = page.getByRole('button', { name: t, exact: true }).first();
      if (await b.isVisible({ timeout: 300 })) { await b.click({ timeout: 2000 }); await page.waitForTimeout(600); return t; }
    } catch (e) {}
  }
  return null;
}

async function snapshot(page) {
  return page.evaluate(() => {
    const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const txt = el => (el.innerText || el.value || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 140);
    const labelOf = el => {
      if (el.labels && el.labels.length) return el.labels[0].innerText.replace(/\s+/g, ' ').trim().slice(0, 140);
      const a = el.getAttribute('aria-label'); if (a) return a;
      const p = el.closest('label'); if (p) return p.innerText.replace(/\s+/g, ' ').trim().slice(0, 140);
      return el.getAttribute('placeholder') || el.getAttribute('name') || el.id || '';
    };
    const controls = [];
    document.querySelectorAll('button, [role=button], [role=radio], [role=checkbox], [role=option], [role=tab], a[href], input, select, textarea').forEach(el => {
      if (!vis(el)) return;
      const tag = el.tagName.toLowerCase();
      const role = el.getAttribute('role');
      if (tag === 'a') { const t = txt(el); if (t && t.length < 60) controls.push({ k: 'link', t, href: (el.getAttribute('href') || '').slice(0, 120) }); return; }
      if (tag === 'input') {
        const type = el.type || 'text';
        if (type === 'hidden') return;
        if (type === 'radio' || type === 'checkbox') controls.push({ k: type, t: labelOf(el), checked: el.checked, name: el.name || undefined });
        else controls.push({ k: 'input:' + type, t: labelOf(el), value: el.value || undefined, name: el.name || undefined });
        return;
      }
      if (tag === 'select') { controls.push({ k: 'select', t: labelOf(el), options: Array.from(el.options).map(o => o.text.trim()).slice(0, 60) }); return; }
      if (tag === 'textarea') { controls.push({ k: 'textarea', t: labelOf(el) }); return; }
      const t = txt(el); if (!t) return;
      const o = { k: role || 'button', t };
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') o.disabled = true;
      const c = el.getAttribute('aria-checked') || el.getAttribute('aria-selected') || el.getAttribute('aria-pressed'); if (c) o.state = c;
      controls.push(o);
    });
    // de-duplicate identical entries
    const seen = new Set(); const uniq = [];
    for (const c of controls) { const key = JSON.stringify(c); if (!seen.has(key)) { seen.add(key); uniq.push(c); } }
    const main = document.querySelector('main') || document.body;
    return { url: location.href, title: document.title, text: (main.innerText || '').replace(/\n{3,}/g, '\n\n').trim(), controls: uniq };
  });
}

function fmtControls(cs, max) {
  const groups = {};
  for (const c of cs) { (groups[c.k] = groups[c.k] || []).push(c); }
  const lines = [];
  for (const k of Object.keys(groups)) {
    const list = groups[k].slice(0, max || 60).map(c => {
      let s = c.t || '(no label)';
      if (c.checked) s += ' [checked]'; if (c.state) s += ` [${c.state}]`; if (c.disabled) s += ' [disabled]';
      if (c.value) s += ` = "${c.value}"`; if (c.options) s += ' {' + c.options.join(' | ') + '}';
      if (k === 'link') s += ' -> ' + c.href;
      return s;
    });
    lines.push(`  ${k} (${groups[k].length}): ` + list.join('  ·  '));
  }
  return lines.join('\n');
}

async function record(page, idx, label, printIt) {
  let snap;
  try { snap = await snapshot(page); } catch (e) { snap = { url: page.url(), title: '', text: '(could not read page: ' + String(e).slice(0, 100) + ')', controls: [] }; }
  const linkless = snap.controls.filter(c => c.k !== 'link');
  const links = snap.controls.filter(c => c.k === 'link');
  const body = `STEP ${pad(idx)} ${label}\nURL: ${snap.url}\nTITLE: ${snap.title}\n\n--- VISIBLE TEXT ---\n${snap.text.slice(0, 12000)}\n\n--- CONTROLS ---\n${fmtControls(linkless)}\n\n--- LINKS ---\n${fmtControls(links, 80)}\n`;
  fs.writeFileSync(path.join(outDir, pad(idx) + '.txt'), body);
  try { await page.screenshot({ path: path.join(outDir, pad(idx) + '.jpg'), type: 'jpeg', quality: 55, fullPage: false }); } catch (e) {}
  if (printIt) {
    console.log(`\n===== STEP ${pad(idx)} ${label} =====\nURL: ${snap.url}\nTEXT: ${snap.text.replace(/\n+/g, ' ⏎ ').slice(0, 1500)}\nCONTROLS:\n${fmtControls(linkless, 40)}\n  links (${links.length}, full list in ${pad(idx)}.txt): ${links.slice(0, 30).map(l => l.t).join('  ·  ')}`);
  }
  return snap;
}

async function locate(page, st) {
  if (st.selector) return page.locator(st.selector);
  const name = st.text; const exact = st.exact !== false;
  const cands = [
    page.getByRole('button', { name, exact }), page.getByRole('radio', { name, exact }), page.getByRole('checkbox', { name, exact }),
    page.getByRole('option', { name, exact }), page.getByRole('link', { name, exact }), page.getByLabel(name, { exact }), page.getByText(name, { exact }),
  ];
  if (exact) cands.push(page.getByRole('button', { name }), page.getByText(name));
  for (const c of cands) {
    try {
      const n = await c.count();
      for (let i = 0, seen = 0; i < n; i++) {
        const el = c.nth(i);
        if (await el.isVisible()) { if (seen === (st.nth || 0)) return el; seen++; }
      }
    } catch (e) {}
  }
  return null;
}

async function doStep(page, st) {
  switch (st.do) {
    case 'click': case 'check': {
      const el = await locate(page, st);
      if (!el) throw new Error('nothing visible matches ' + JSON.stringify(st.text || st.selector));
      const target = st.selector ? el.nth(st.nth || 0) : el;
      try { await target.click({ timeout: 6000 }); } catch (e) { await target.click({ timeout: 4000, force: true }); }
      break;
    }
    case 'fill': {
      let el = null;
      if (st.selector) el = page.locator(st.selector).nth(st.nth || 0);
      else if (st.label) { for (const c of [page.getByLabel(st.label), page.getByPlaceholder(st.label), page.locator(`[name="${st.label}"]`)]) { try { if (await c.first().isVisible({ timeout: 500 })) { el = c.first(); break; } } catch (e) {} } }
      else el = page.locator('input:visible, textarea:visible').nth(st.nth || 0);
      if (!el) throw new Error('no field matches ' + JSON.stringify(st.label));
      await el.fill(String(st.value), { timeout: 6000 });
      break;
    }
    case 'type': await page.keyboard.type(String(st.value), { delay: 30 }); break;
    case 'select': await page.locator(st.selector || 'select').nth(st.nth || 0).selectOption(st.value != null ? st.value : { label: st.label }, { timeout: 6000 }); break;
    case 'press': await page.keyboard.press(st.key); break;
    case 'wait': await page.waitForTimeout(st.ms || 1000); break;
    case 'goto': await page.goto(st.url, { waitUntil: 'domcontentloaded', timeout: 45000 }); break;
    case 'scroll': await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } }); break;
    case 'back': await page.goBack({ timeout: 15000 }); break;
    case 'eval': { // added for philip-kingsley stage 2: run the site's own client-side function in the live page, read-only
      const r = await page.evaluate(st.js);
      fs.writeFileSync(path.join(outDir, 'eval.json'), JSON.stringify(r, null, 1));
      console.log('EVAL: ' + JSON.stringify(r).slice(0, 4000));
      break;
    }
    default: throw new Error('unknown action ' + st.do);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: !flags.has('--headed') });
  const ctxOpts = flags.has('--mobile') ? { ...devices['iPhone 13'] } : { userAgent: UA, viewport: { width: 1280, height: 900 } };
  const ctx = await browser.newContext({ ...ctxOpts, locale: spec.locale || 'en-GB', timezoneId: spec.timezone || 'Europe/London' });
  const page = await ctx.newPage();
  const netLog = fs.createWriteStream(path.join(outDir, 'network.jsonl'));
  page.on('response', async resp => {
    try {
      const req = resp.request(); const rt = req.resourceType();
      const ct = (resp.headers()['content-type'] || '');
      if (!(rt === 'xhr' || rt === 'fetch') && !ct.includes('json')) return;
      if (!ct.includes('json') && !ct.includes('graphql')) return;
      const url = resp.url();
      if (/google|facebook|doubleclick|segment|sentry|hotjar|clarity|tiktok|datadog|amplitude|mixpanel|klaviyo|optimizely|onetrust|cookielaw|bing|snapchat|pinterest|newrelic|fullstory|launchdarkly\.com\/events/i.test(url)) return;
      const buf = await resp.body();
      const entry = { url: url.slice(0, 300), method: req.method(), status: resp.status(), size: buf.length };
      if (buf.length > 300 && buf.length < 3e6 && netBytes < 60e6) {
        const f = `net/${pad(++netCount)}-${url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '_').slice(0, 80)}.json`;
        fs.writeFileSync(path.join(outDir, f), buf); netBytes += buf.length; entry.file = f;
        const post = req.postData(); if (post && post.length < 4000) entry.post = post;
      }
      netLog.write(JSON.stringify(entry) + '\n');
    } catch (e) {}
  });

  const printAll = !flags.has('--last');
  let code = 0, idx = 0, snap;
  try {
    const resp = await page.goto(spec.start, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await settle(page, 1500);
    if (spec.dismissCookies !== false) { const c = await dismissCookies(page); if (c) await settle(page, 500); }
    snap = await record(page, 0, `start (HTTP ${resp ? resp.status() : '?'})`, printAll && fromIdx <= 0);
    for (const st of spec.steps || []) {
      idx++;
      const label = `${st.do} ${JSON.stringify(st.text || st.label || st.selector || st.url || st.key || st.ms || '')}${st.value != null ? ' = ' + JSON.stringify(st.value) : ''}`;
      try { await doStep(page, st); await settle(page, st.settle); }
      catch (e) {
        console.log(`\n!!!!! STEP ${pad(idx)} FAILED: ${label}\n${String(e.message || e).split('\n')[0]}`);
        await record(page, idx, 'FAILED ' + label, true); code = 2; break;
      }
      snap = await record(page, idx, label, printAll && idx >= fromIdx);
    }
    if (!printAll && code === 0) { console.log(`\n===== FINAL (after ${idx} steps) =====\nURL: ${snap.url}\nTEXT: ${snap.text.replace(/\n+/g, ' ⏎ ').slice(0, 5000)}\nCONTROLS:\n${fmtControls(snap.controls.filter(c => c.k !== 'link'), 60)}\n  links: ${snap.controls.filter(c => c.k === 'link').slice(0, 30).map(l => l.t).join('  ·  ')}`); }
    try {
      const storage = await page.evaluate(() => ({ local: Object.fromEntries(Object.entries(localStorage)), session: Object.fromEntries(Object.entries(sessionStorage)) }));
      fs.writeFileSync(path.join(outDir, 'storage.json'), JSON.stringify(storage, null, 1).slice(0, 2e6));
    } catch (e) {}
  } catch (e) { console.log('FATAL: ' + String(e.message || e).split('\n')[0]); code = 3; }
  netLog.end();
  await browser.close();
  console.log(`\n[walk] ${idx} step(s), exit ${code}, ${netCount} JSON bodies saved -> ${outDir}`);
  process.exit(code);
})();
