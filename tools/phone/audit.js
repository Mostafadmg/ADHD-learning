// usage: node audit.js <port> <width> <outfile.json> [moduleIds comma list] [shotDir]
const { chromium } = (function(){ try { return require('playwright'); } catch (e) { return require('/opt/node22/lib/node_modules/playwright'); } })();
const [port, width, out, mods, shotDir] = process.argv.slice(2);
const W = +width || 375, H = W < 350 ? 640 : 812;
const ids = (mods ? mods.split(',') : ['m1','m2','m3','ag','dx','sim','sp','m4','m5','m6','m7','m8','m9','m10','m11','exam','final','gloss','refs']);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W, height: H }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0,200)); });
  p.on('pageerror', e => errs.push('pageerror: ' + String(e).slice(0,200)));
  p.on('requestfailed', r => errs.push('reqfail: ' + r.url().slice(0,150)));
  p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url().slice(0,150)); });
  await p.goto(`http://localhost:${port}/index.html${process.env.Q ? "?" + process.env.Q : ""}`, { waitUntil: 'networkidle' });
  const results = [];
  const measure = () => p.evaluate((W) => {
    const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const sel = e => { let s = e.tagName.toLowerCase(); if (e.id) s += '#' + e.id; const c = (e.className && e.className.baseVal === undefined ? String(e.className) : '').trim().split(/\s+/).filter(Boolean).slice(0,2); if (c.length) s += '.' + c.join('.'); return s; };
    // ancestors that scroll horizontally on purpose
    const scrollAnc = e => { for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if ((o === 'auto' || o === 'scroll' || o === 'hidden') && a.scrollWidth > a.clientWidth + 1 || o==='auto'||o==='scroll') return true; } return false; };
    const doc = document.documentElement;
    const over = [];
    document.querySelectorAll('body *').forEach(e => { if (!vis(e)) return; const r = e.getBoundingClientRect(); if ((r.right > W + 1 || r.left < -1) && !scrollAnc(e) && !e.closest('nav.sidebar')) over.push({ s: sel(e), l: Math.round(r.left), r: Math.round(r.right), w: Math.round(r.width) }); });
    // reduce overflow list to outermost offenders
    const top = over.filter(o => o.s !== 'a.skip').slice(0, 8);
    const small = [];
    document.querySelectorAll('button,a[href],input:not([type=hidden]),select,textarea,summary,[role=tab],[role=button],label.chk,[tabindex="0"]').forEach(e => { if (!vis(e) || e.closest('nav.sidebar')) return; const r = e.getBoundingClientRect(); const act = r.top < 0 && false; if (r.height < 40 || (r.width < 40 && !(e.tagName==='A'&&e.textContent.trim().length>8))) small.push({ s: sel(e), t: (e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,28), w: Math.round(r.width), h: Math.round(r.height) }); });
    const tiny = [];
    const seen = new Set();
    document.querySelectorAll('.module:not([hidden]) *').forEach(e => { if (!vis(e) || !e.childNodes) return; let own = ''; e.childNodes.forEach(n => { if (n.nodeType === 3) own += n.textContent; }); if (own.trim().length < 3) return; const fs = parseFloat(getComputedStyle(e).fontSize); if (fs < 11.5) { const k = sel(e) + fs; if (!seen.has(k)) { seen.add(k); tiny.push({ s: sel(e), fs, t: own.trim().slice(0,24) }); } } });
    return { sw: doc.scrollWidth, cw: doc.clientWidth, bodySW: document.body.scrollWidth, over: top, nOver: over.filter(o => o.s !== 'a.skip').length, small, tiny: tiny.slice(0,12) };
  }, W);
  for (const id of ids) {
    await p.evaluate(h => { location.hash = h; }, '#' + id);
    await p.waitForTimeout(350);
    const lessons = await p.evaluate(id => { const box = document.querySelector(`[data-lessons="${id}"]`); return box ? [...box.querySelectorAll(':scope > .lesson')].map(l => l.dataset.title) : []; }, id);
    const doOne = async (label, idx) => {
      if (idx >= 0) await p.evaluate(([id, i]) => { const l = document.querySelectorAll(`[data-lessons="${id}"] > .lesson`)[i]; window.__lessonReveal && window.__lessonReveal(l); window.scrollTo(0, 0); }, [id, idx]);
      await p.waitForTimeout(250);
      const m = await measure();
      const full = await p.evaluate(() => document.documentElement.scrollHeight);
      results.push({ mod: id, lesson: label, idx, height: full, ...m });
      if (shotDir) { await p.screenshot({ path: `${shotDir}/${W}-${id}-${String(idx+1).padStart(2,'0')}.png`, fullPage: true }); }
    };
    await doOne('Overview', -1);
    for (let i = 0; i < lessons.length; i++) await doOne(lessons[i], i);
  }
  require('fs').writeFileSync(out, JSON.stringify({ width: W, errors: [...new Set(errs)], results }, null, 1));
  const bad = results.filter(r => r.sw > r.cw + 1 || r.nOver);
  console.log(`${results.length} screens at ${W}px; ${bad.length} with overflow; ${[...new Set(errs)].length} distinct console/net errors`);
  await b.close();
})();
