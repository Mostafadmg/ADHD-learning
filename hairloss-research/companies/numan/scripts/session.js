#!/usr/bin/env node
/*
 * session.js — one long-lived browser that takes commands from files, so a consultation can be
 * explored step by step WITHOUT starting a new draft on the site for every step (gentler than replaying).
 *
 * Start (in the background):   node session.js <sessionDir> <startUrl>
 * Send a command:              node do.js <sessionDir> '{"do":"click","text":"Next"}'
 * Stop (closes its own browser): node do.js <sessionDir> '{"do":"quit"}'
 *
 * It records, in <sessionDir>:
 *   out/NNN.txt + NNN.jpg  screen after each command (URL, visible text, controls, links)
 *   network.jsonl          every numan.com XHR/fetch/JSON response (method, status, size, post body)
 *   net/NNN-*.json         the response bodies, ANY size (walk.js skips bodies under 300 bytes,
 *                          and Numan's yes/no question JSON is smaller than that)
 * It never types anything by itself. It exits (closing the browser) after 25 idle minutes.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const dir = process.argv[2];
const startUrl = process.argv[3];
if (!dir || !startUrl) { console.error('usage: node session.js <sessionDir> <startUrl>'); process.exit(1); }
for (const d of ['cmd', 'out', 'net']) fs.mkdirSync(path.join(dir, d), { recursive: true });
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const pad = n => String(n).padStart(3, '0');
let netCount = 0;

async function settle(page, ms) {
  try { await page.waitForLoadState('domcontentloaded', { timeout: 15000 }); } catch (e) {}
  try { await page.waitForLoadState('networkidle', { timeout: 6000 }); } catch (e) {}
  await page.waitForTimeout(ms || 1200);
}

async function snapshot(page) {
  return page.evaluate(() => {
    const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const txt = el => (el.innerText || el.value || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 300);
    const labelOf = el => {
      if (el.labels && el.labels.length) return el.labels[0].innerText.replace(/\s+/g, ' ').trim().slice(0, 300);
      const a = el.getAttribute('aria-label'); if (a) return a;
      const p = el.closest('label'); if (p) return p.innerText.replace(/\s+/g, ' ').trim().slice(0, 300);
      return el.getAttribute('placeholder') || el.getAttribute('name') || el.id || '';
    };
    const controls = [];
    document.querySelectorAll('button, [role=button], [role=radio], [role=checkbox], [role=option], [role=tab], a[href], input, select, textarea').forEach(el => {
      if (!vis(el)) return;
      const tag = el.tagName.toLowerCase();
      const role = el.getAttribute('role');
      if (tag === 'a') { const t = txt(el); if (t && t.length < 80) controls.push({ k: 'link', t, href: (el.getAttribute('href') || '').slice(0, 160) }); return; }
      if (tag === 'input') {
        const type = el.type || 'text';
        if (type === 'hidden') return;
        if (type === 'radio' || type === 'checkbox') controls.push({ k: type, t: labelOf(el), checked: el.checked, name: el.name || undefined });
        else controls.push({ k: 'input:' + type, t: labelOf(el), value: el.value || undefined, name: el.name || undefined, placeholder: el.getAttribute('placeholder') || undefined });
        return;
      }
      if (tag === 'select') { controls.push({ k: 'select', t: labelOf(el), options: Array.from(el.options).map(o => o.text.trim()).slice(0, 80) }); return; }
      if (tag === 'textarea') { controls.push({ k: 'textarea', t: labelOf(el), placeholder: el.getAttribute('placeholder') || undefined }); return; }
      const t = txt(el); if (!t) return;
      const o = { k: role || 'button', t };
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') o.disabled = true;
      const c = el.getAttribute('aria-checked') || el.getAttribute('aria-selected') || el.getAttribute('aria-pressed'); if (c) o.state = c;
      controls.push(o);
    });
    const seen = new Set(); const uniq = [];
    for (const c of controls) { const key = JSON.stringify(c); if (!seen.has(key)) { seen.add(key); uniq.push(c); } }
    return { url: location.href, title: document.title, text: (document.body.innerText || '').replace(/\n{3,}/g, '\n\n').trim(), controls: uniq };
  });
}

function fmt(cs) {
  const groups = {};
  for (const c of cs) (groups[c.k] = groups[c.k] || []).push(c);
  const lines = [];
  for (const k of Object.keys(groups)) {
    lines.push(`  ${k} (${groups[k].length}):`);
    for (const c of groups[k]) {
      let s = c.t || '(no label)';
      if (c.checked) s += ' [checked]'; if (c.state) s += ` [${c.state}]`; if (c.disabled) s += ' [disabled]';
      if (c.value) s += ` = "${c.value}"`; if (c.placeholder) s += ` (placeholder: ${c.placeholder})`; if (c.name) s += ` (name: ${c.name})`;
      if (c.options) s += ' {' + c.options.join(' | ') + '}';
      if (k === 'link') s += ' -> ' + c.href;
      lines.push('    - ' + s);
    }
  }
  return lines.join('\n');
}

async function locate(page, st) {
  if (st.selector) return page.locator(st.selector).nth(st.nth || 0);
  const name = st.text; const exact = st.exact !== false;
  const cands = [
    page.getByRole('button', { name, exact }), page.getByRole('radio', { name, exact }), page.getByRole('checkbox', { name, exact }),
    page.getByRole('option', { name, exact }), page.getByRole('link', { name, exact }), page.getByLabel(name, { exact }), page.getByText(name, { exact }),
  ];
  if (exact) cands.push(page.getByRole('button', { name }), page.getByText(name));
  for (const c of cands) {
    try {
      const n = await c.count();
      for (let i = 0, seen = 0; i < n; i++) { const el = c.nth(i); if (await el.isVisible()) { if (seen === (st.nth || 0)) return el; seen++; } }
    } catch (e) {}
  }
  return null;
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1280, height: 900 }, locale: 'en-GB', timezoneId: 'Europe/London' });
  const page = await ctx.newPage();
  const netLog = fs.createWriteStream(path.join(dir, 'network.jsonl'), { flags: 'a' });
  page.on('response', async resp => {
    try {
      const req = resp.request(); const rt = req.resourceType(); const url = resp.url();
      if (!/numan\.com/.test(url)) return;
      const ct = (resp.headers()['content-type'] || '');
      if (!(rt === 'xhr' || rt === 'fetch') && !ct.includes('json')) return;
      if (/\/gtag\/|\/_next\/static\//.test(url)) return;
      let buf = Buffer.alloc(0); try { buf = await resp.body(); } catch (e) {}
      const entry = { t: new Date().toISOString(), url: url.slice(0, 400), method: req.method(), status: resp.status(), size: buf.length, ct: ct.slice(0, 40) };
      const post = req.postData(); if (post && post.length < 20000) entry.post = post;
      if (buf.length && buf.length < 5e6) {
        const f = `net/${pad(++netCount)}-${req.method()}-${url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '_').slice(0, 110)}.json`;
        fs.writeFileSync(path.join(dir, f), buf); entry.file = f;
      }
      netLog.write(JSON.stringify(entry) + '\n');
    } catch (e) {}
  });

  async function record(name, label) {
    let snap;
    try { snap = await snapshot(page); } catch (e) { snap = { url: page.url(), title: '', text: '(could not read page: ' + String(e).slice(0, 120) + ')', controls: [] }; }
    const body = `COMMAND ${name} ${label}\nURL: ${snap.url}\nTITLE: ${snap.title}\n\n--- VISIBLE TEXT ---\n${snap.text.slice(0, 20000)}\n\n--- CONTROLS ---\n${fmt(snap.controls.filter(c => c.k !== 'link'))}\n\n--- LINKS ---\n${fmt(snap.controls.filter(c => c.k === 'link'))}\n`;
    fs.writeFileSync(path.join(dir, 'out', name + '.txt'), body);
    try { await page.screenshot({ path: path.join(dir, 'out', name + '.jpg'), type: 'jpeg', quality: 55, fullPage: false }); } catch (e) {}
  }

  await page.goto(startUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await settle(page, 3500);
  await record('000', 'start ' + startUrl);

  const done = new Set(); let idle = Date.now();
  for (;;) {
    const files = fs.readdirSync(path.join(dir, 'cmd')).filter(f => f.endsWith('.json') && !done.has(f)).sort();
    if (!files.length) { if (Date.now() - idle > 25 * 60 * 1000) break; await new Promise(r => setTimeout(r, 250)); continue; }
    idle = Date.now();
    const f = files[0]; done.add(f); const name = f.replace('.json', '');
    let st; try { st = JSON.parse(fs.readFileSync(path.join(dir, 'cmd', f), 'utf8')); } catch (e) { fs.writeFileSync(path.join(dir, 'out', name + '.txt'), 'BAD COMMAND ' + e.message); continue; }
    if (st.do === 'quit') { fs.writeFileSync(path.join(dir, 'out', name + '.txt'), 'quit'); break; }
    let label = JSON.stringify(st), err = null;
    try {
      const list = Array.isArray(st.steps) ? st.steps : [st];
      for (const s of list) {
        if (s.do === 'click') { const el = await locate(page, s); if (!el) throw new Error('nothing visible matches ' + JSON.stringify(s.text || s.selector)); try { await el.click({ timeout: 6000 }); } catch (e) { await el.click({ timeout: 4000, force: true }); } }
        else if (s.do === 'fill') { const el = s.selector ? page.locator(s.selector).nth(s.nth || 0) : page.locator('input:visible, textarea:visible').nth(s.nth || 0); await el.fill(String(s.value), { timeout: 6000 }); }
        else if (s.do === 'press') await page.keyboard.press(s.key);
        else if (s.do === 'wait') await page.waitForTimeout(s.ms || 1000);
        else if (s.do === 'goto') await page.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        else if (s.do === 'back') await page.goBack({ timeout: 15000 });
        else if (s.do === 'scroll') await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } });
        else if (s.do === 'snap') { /* just record */ }
        else if (s.do === 'storage') { const sto = await page.evaluate(() => ({ local: Object.fromEntries(Object.entries(localStorage)), session: Object.fromEntries(Object.entries(sessionStorage)) })); fs.writeFileSync(path.join(dir, 'storage-' + name + '.json'), JSON.stringify(sto, null, 1)); }
        else if (s.do === 'html') { fs.writeFileSync(path.join(dir, 'out', name + '.html'), await page.content()); }
        else throw new Error('unknown action ' + s.do);
        await settle(page, s.settle || 900);
      }
    } catch (e) { err = String(e.message || e).split('\n')[0]; }
    await record(name, label + (err ? '\nFAILED: ' + err : ''));
  }
  netLog.end();
  await browser.close();
  process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(3); });
