// usage: node textsnap.js <port> <moduleId> <out.json>
// Saves the visible AND collapsed text of every lesson of a module (parts switched off), normalised.
const { chromium } = (function(){ try { return require('playwright'); } catch (e) { return require('/opt/node22/lib/node_modules/playwright'); } })();
const [port, id, out] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true })).newPage();
  await p.goto(`http://localhost:${port}/index.html?noparts#${id}`, { waitUntil: 'networkidle' });
  const res = await p.evaluate(id => {
    const mod = document.getElementById(id); const o = {};
    const grab = el => { const c = el.cloneNode(true); c.querySelectorAll('script,style,svg title,.ls-bar,.ls-nav,.pt-more,.pt-all').forEach(n => n.remove()); const w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT); const out = []; let n; while ((n = w.nextNode())) { const t = n.textContent.replace(/\s+/g, ' ').trim(); if (t) out.push(t); } return out.join(' '); };
    const head = mod.querySelector('.mod-head'); if (head) o['_overview'] = grab(head);
    mod.querySelectorAll('.lessons > .lesson').forEach((l, i) => { o[(i + 1) + ' ' + l.dataset.title] = grab(l); });
    return o;
  }, id);
  require('fs').writeFileSync(out, JSON.stringify(res, null, 1));
  console.log(Object.keys(res).length, 'parts saved;', Object.values(res).reduce((a, t) => a + t.length, 0), 'characters');
  await b.close();
})();
