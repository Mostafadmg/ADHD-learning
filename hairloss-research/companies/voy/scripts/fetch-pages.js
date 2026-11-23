#!/usr/bin/env node
/* fetch-pages.js — open a list of public URLs one at a time in one plain browser (no stealth),
 * wait, and save visible text + links. Usage: node fetch-pages.js <list.json> <outDir>
 * list.json = [{ "name": "file-stem", "url": "https://…" }, …]
 * Stops trying a host after it shows a security checkpoint twice. 2.5 s between pages.
 */
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
const list = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); const out = process.argv[3];
fs.mkdirSync(out, { recursive: true });
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ userAgent: UA, viewport: { width: 1280, height: 900 }, locale: 'en-GB', timezoneId: 'Europe/London' });
  const page = await ctx.newPage(); const blocked = {};
  for (const it of list) {
    const host = new URL(it.url).host; if ((blocked[host] || 0) >= 2) { console.log('SKIP (host blocked) ' + it.url); continue; }
    let status = '?';
    try { const r = await page.goto(it.url, { waitUntil: 'domcontentloaded', timeout: 45000 }); status = r ? r.status() : '?'; } catch (e) { status = 'ERR ' + String(e.message).split('\n')[0]; }
    try { await page.waitForLoadState('networkidle', { timeout: 8000 }); } catch (e) {}
    await page.waitForTimeout(1200);
    let snap = { url: page.url(), title: '', text: '', links: [] };
    try {
      snap = await page.evaluate(() => {
        const main = document.querySelector('main') || document.body;
        const links = Array.from(document.querySelectorAll('a[href]')).map(a => ({ t: (a.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160), h: a.getAttribute('href') })).filter(l => l.t);
        return { url: location.href, title: document.title, text: (main.innerText || '').replace(/\n{3,}/g, '\n\n').trim(), links };
      });
    } catch (e) {}
    if (/Failed to verify your browser|Just a moment|Verify you are human|Checking your browser/i.test(snap.text.slice(0, 400) + snap.title)) blocked[host] = (blocked[host] || 0) + 1;
    const seen = new Set(); const links = snap.links.filter(l => { const k = l.t + '|' + l.h; if (seen.has(k)) return false; seen.add(k); return true; });
    fs.writeFileSync(path.join(out, it.name + '.txt'), `SOURCE: ${it.url}\nFINAL URL: ${snap.url}\nHTTP: ${status}\nTITLE: ${snap.title}\nFETCHED: ${new Date().toISOString()}\n\n--- TEXT ---\n${snap.text}\n\n--- LINKS ---\n${links.map(l => l.t + ' -> ' + l.h).join('\n')}\n`);
    if (it.shot) { try { await page.screenshot({ path: path.join(out, it.name + '.jpg'), type: 'jpeg', quality: 60 }); } catch (e) {} }
    console.log(`${status} ${snap.text.length}ch ${it.name}  ${snap.title.slice(0, 70)}`);
    await page.waitForTimeout(2500);
  }
  await b.close();
})();
