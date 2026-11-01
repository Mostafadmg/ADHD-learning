// usage: node shoot.js <port> <width> <module> <lessonIdx(1-based, 0=overview)> <out.png> [clickSelector]
const { chromium } = (function(){ try { return require('playwright'); } catch (e) { return require('/opt/node22/lib/node_modules/playwright'); } })();
const [port, width, id, idx, out, click] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const W = +width;
  const ctx = await b.newContext({ viewport: { width: W, height: W < 600 ? 812 : 900 }, isMobile: W < 600, hasTouch: W < 600, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(`http://localhost:${port}/index.html${process.env.Q ? "?" + process.env.Q : ""}#${id}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  if (+idx > 0) await p.evaluate(([id, i]) => { const l = document.querySelectorAll(`[data-lessons="${id}"] > .lesson`)[i-1]; window.__lessonReveal(l); window.scrollTo(0,0); }, [id, +idx]);
  await p.waitForTimeout(500);
  if (click) { for (const c of click.split('|')) { await p.click(c).catch(e => console.log('click fail', c)); await p.waitForTimeout(300); } }
  await p.screenshot({ path: out, fullPage: true });
  await b.close();
})();
