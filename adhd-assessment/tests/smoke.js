#!/usr/bin/env node
/* Browser smoke test: serves the app, signs in, visits every route and every assessment step,
   and fails on console errors or page errors. Usage: node tests/smoke.js [--dev] [--shots <dir>]
   --dev uses tests/dev.html (fixture data) instead of index.html.
   Needs Playwright (global install) and Chromium. */
'use strict';
const path = require('path');
const http = require('http');
const fs = require('fs');
let pw;
try { pw = require('playwright'); } catch (e) { pw = require(path.join(process.execPath, '../../lib/node_modules/playwright')); }

const ROOT = path.join(__dirname, '..');
const shotsIdx = process.argv.indexOf('--shots');
const SHOTS = shotsIdx > -1 ? process.argv[shotsIdx + 1] : null;
const PAGE = process.argv.includes('--dev') ? 'tests/dev.html' : '';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.pdf': 'application/pdf', '.json': 'application/json', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  const f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

(async () => {
  await new Promise((r) => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port + '/';
  const browser = await pw.chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? undefined : undefined });
  const problems = [];
  async function run(viewport, theme) {
    const ctx = await browser.newContext({ viewport, colorScheme: theme });
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)/.test(m.text())) problems.push('[console] ' + m.text()); });
    page.on('pageerror', (e) => problems.push('[pageerror] ' + e.message));
    page.on('requestfailed', (r) => { if (!/fonts\./.test(r.url())) problems.push('[requestfailed] ' + r.url()); });
    page.on('response', (r) => { if (r.status() >= 400 && !/fonts\./.test(r.url())) problems.push('[http ' + r.status() + '] ' + r.url()); });
    await page.goto(base + PAGE);
    await page.waitForSelector('.signin');
    // Demo sign-in loads the demo assessment
    await page.click('text=Explore with a demo patient');
    await page.waitForTimeout(400);
    const routes = await page.evaluate(() => {
      const AA = window.AA, out = ['home', 'new', 'about', 'tools', 'pathway', 'learn', 'cases', 'glossary', 'ddx', 'criteria', 'bank', 'exam', 'forms', 'ddxguide'];
      ((AA.data.formsGuide && AA.data.formsGuide.forms) || []).forEach((f) => out.push('form-' + f.id));
      (AA.data.tools || []).forEach((t) => out.push('tool-' + t.id));
      (AA.data.learn || []).forEach((m) => { out.push('module-' + m.id); out.push('quiz-' + m.id); });
      (AA.data.cases || []).forEach((c) => out.push('case-' + c.id));
      (AA.data.ddx || []).forEach((c) => out.push('cond-' + c.id));
      (AA.data.symptoms || []).forEach((s) => out.push('sym-' + s.id));
      const a = AA.assess.list()[0];
      if (a) (AA.STEP_LIST || []).forEach((s) => out.push('assess-' + a.id + '-' + s.id));
      if (a) (AA.data.symptoms || []).forEach((s) => out.push('assess-' + a.id + '-' + s.dim.toLowerCase() + '-' + s.id));
      return out;
    });
    for (const r of routes) {
      await page.evaluate((t) => window.AA.router.go(t), r);
      await page.waitForTimeout(60);
      const bad = await page.evaluate(() => {
        const v = document.getElementById('view');
        const failed = v.querySelector('.callout-err');
        const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
        return { failed: failed ? failed.textContent.slice(0, 160) : null, overflow, empty: v.textContent.trim().length < 20, h1: !!v.querySelector('h1') };
      });
      if (bad.failed && /failed to load/.test(bad.failed)) problems.push('[render] ' + r + ': ' + bad.failed);
      if (bad.overflow) problems.push('[overflow ' + viewport.width + '] ' + r);
      if (bad.empty) problems.push('[empty] ' + r);
      if (!bad.h1 && !/^new$/.test(r)) problems.push('[no h1] ' + r);
      if (SHOTS && /^(home|tools|learn|ddx|bank|criteria|assess-\w+-(setup|screen|ia|onset|ddx|summary|report))$/.test(r)) {
        await page.screenshot({ path: path.join(SHOTS, viewport.width + '-' + theme + '-' + r.replace(/assess-\w+-/, 'assess-') + '.png'), fullPage: false });
      }
    }
    await ctx.close();
    return routes.length;
  }
  const n1 = await run({ width: 1366, height: 900 }, 'light');
  const n2 = await run({ width: 390, height: 844 }, 'dark');
  await browser.close();
  server.close();
  const uniq = [...new Set(problems)];
  console.log('Visited ' + n1 + ' routes on desktop and ' + n2 + ' on phone.');
  if (uniq.length) { console.log(uniq.length + ' problem(s):\n' + uniq.slice(0, 120).join('\n')); process.exit(1); }
  console.log('No console errors, render failures or horizontal overflow.');
})().catch((e) => { console.error(e); server.close(); process.exit(1); });
