// prequiz.js <outDir> <q1> <q2> <q3> [url]
// Replays the three-question landing-page pre-quiz with the given answers from a clean browser and records what walk.js
// cannot: EVERY request (with POST bodies, so analytics events that carry an answer are visible), the hrefs of the
// call-to-action links before and after, cookies, storage, and where the page scrolled to.
// Answers: q1 = "Stop hair loss" | "Regrow hair" | "Both";  q2 = "Yes" | "No";  q3 = "Yes" | "Not sure yet".
// No contact details are entered and nothing is submitted: it only clicks the on-page marketing buttons.
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
(async () => {
  const [outDir, q1, q2, q3, urlArg] = process.argv.slice(2);
  const url = urlArg || 'https://www.hims.com/lp/hair-start-top-fin-fa';
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', viewport: { width: 1280, height: 900 }, locale: 'en-US', timezoneId: 'America/New_York' });
  const page = await ctx.newPage();
  let phase = 'load';
  const reqs = [];
  page.on('request', r => {
    let body = ''; try { body = r.postData() || ''; } catch (e) {}
    reqs.push({ phase, method: r.method(), type: r.resourceType(), url: r.url().slice(0, 600), body: body.slice(0, 4000) });
  });
  const statuses = [];
  page.on('response', r => { if (r.status() >= 400) statuses.push(`${r.status()} ${r.url().slice(0, 160)}`); });
  const out = { url, answers: { q1, q2, q3 }, steps: [] };
  const snap = async label => {
    const s = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href]')).filter(a => /\/c\/|\/g\/|quiz|start/i.test(a.getAttribute('href'))).map(a => ({ t: (a.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60), href: a.getAttribute('href') }));
      const heads = Array.from(document.querySelectorAll('h1,h2,h3,p')).filter(h => { const r = h.getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight && r.width > 0 && r.height > 0; }).map(h => (h.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 90)).filter(Boolean).slice(0, 12);
      const pressed = Array.from(document.querySelectorAll('button')).map(b => ({ t: (b.innerText || '').trim().slice(0, 40), cls: (b.className || '').toString().slice(0, 160), aria: b.getAttribute('aria-pressed') || b.getAttribute('aria-checked') || b.getAttribute('data-selected') || '' })).filter(b => /^(Stop hair loss|Regrow hair|Both|Yes|No|Not sure yet)$/.test(b.t));
      return { href: location.href, scrollY: Math.round(scrollY), inView: heads, ctaLinks: links, optionButtons: pressed, text: (document.querySelector('main') || document.body).innerText };
    });
    fs.writeFileSync(path.join(outDir, label + '.txt'), s.text);
    await page.screenshot({ path: path.join(outDir, label + '.jpg'), type: 'jpeg', quality: 55 }).catch(() => {});
    out.steps.push({ label, href: s.href, scrollY: s.scrollY, inView: s.inView, ctaLinks: s.ctaLinks, optionButtons: s.optionButtons, textLength: s.text.length });
  };
  const clickBtn = async (name, nth) => { const b = page.getByRole('button', { name, exact: true }).nth(nth || 0); await b.scrollIntoViewIfNeeded().catch(() => {}); await b.click({ timeout: 8000 }); await page.waitForTimeout(3000); };
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await snap('00-start');
    phase = 'q1'; await clickBtn(q1, 0); await snap('01-after-q1');
    // "Yes" appears in both question 2 and question 3: nth 0 = question 2, nth 1 = question 3.
    phase = 'q2'; await clickBtn(q2, 0); await snap('02-after-q2');
    phase = 'q3'; await clickBtn(q3, q3 === 'Yes' ? 1 : 0); await page.waitForTimeout(4000); await snap('03-after-q3');
    out.ok = true;
  } catch (e) { out.ok = false; out.error = String(e).slice(0, 400); await snap('99-error').catch(() => {}); }
  out.cookies = (await ctx.cookies()).map(c => `${c.domain} ${c.name}`).sort();
  out.storage = await page.evaluate(() => ({ local: Object.keys(localStorage).sort(), session: Object.keys(sessionStorage).sort(), localValues: Object.fromEntries(Object.entries(localStorage).map(([k, v]) => [k, String(v).slice(0, 400)])) })).catch(() => ({}));
  out.httpErrors = statuses.slice(0, 40);
  // Requests after page load that are not static assets, and any request whose URL or body names an answer.
  const answerRe = /hair[-_ ]?goals|stop[-_ %20]*hair|regrow|prescription-strength|simple-solution|not[-_ %20]*sure|quiz|asked|answer/i;
  out.requestsAfterLoad = reqs.filter(r => r.phase !== 'load' && !['image', 'font', 'stylesheet', 'media'].includes(r.type)).map(r => ({ phase: r.phase, method: r.method, type: r.type, url: r.url.slice(0, 220), bodyHasAnswerWords: answerRe.test(r.body), bodySample: answerRe.test(r.body) ? r.body.slice(0, 700) : '' }));
  out.requestCount = reqs.length;
  out.hostsCalledAfterLoad = Array.from(new Set(reqs.filter(r => r.phase !== 'load').map(r => { try { return new URL(r.url).host; } catch (e) { return '?'; } }))).sort();
  out.consultationCalls = reqs.filter(r => /api\.forhims|graphql|flow-server|intake\.hims|\/c\/hl/.test(r.url)).map(r => `${r.phase} ${r.method} ${r.url.slice(0, 200)}`);
  fs.writeFileSync(path.join(outDir, 'result.json'), JSON.stringify(out, null, 1));
  fs.writeFileSync(path.join(outDir, 'requests.jsonl'), reqs.map(r => JSON.stringify(r)).join('\n'));
  const last = out.steps[out.steps.length - 1] || {};
  console.log(JSON.stringify({ ok: out.ok, error: out.error, answers: out.answers, finalHref: last.href, finalScrollY: last.scrollY, inView: last.inView, ctaLinks: last.ctaLinks, consultationCalls: out.consultationCalls, hostsAfterLoad: out.hostsCalledAfterLoad, answerBodies: out.requestsAfterLoad.filter(r => r.bodyHasAnswerWords).map(r => r.phase + ' ' + r.url.slice(0, 90) + ' :: ' + r.bodySample.slice(0, 300)) }, null, 1));
  await browser.close();
})();
