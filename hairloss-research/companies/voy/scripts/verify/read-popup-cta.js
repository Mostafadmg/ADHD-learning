// Stage 3 (verify) helper. READ-ONLY: opens a public Voy landing page and reads, from the page's own DOM,
// the address behind the pop-up's hidden 'Take the next step to treatment' button and the hidden coupon field.
// It types nothing, ticks nothing and submits nothing.
// Usage: node read-popup-cta.js <url> <outDir>
const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const [url, outDir] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 900 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' });
  const resp = await p.goto(url, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(4000);
  const out = await p.evaluate(() => {
    const pop = document.getElementById('popup-multi-b') || document.querySelector('.popup-multi');
    const q = s => pop ? pop.querySelector(s) : null;
    const el = q('.default-elegible a[href]') || document.getElementById('next-step-button');
    const inel = q('.default-inelegible');
    return {
      pageUrl: location.href,
      popupFound: !!pop,
      eligibleButtonText: el ? el.innerText.replace(/\s+/g, ' ').trim() : null,
      eligibleButtonHref: el ? el.getAttribute('href') : null,
      eligibleBlockShown: q('.default-elegible') ? getComputedStyle(q('.default-elegible')).display !== 'none' : null,
      notEligibleText: inel ? inel.textContent.replace(/\s+/g, ' ').trim() : null,
      notEligibleBlockShown: inel ? getComputedStyle(inel).display !== 'none' : null,
      hiddenCouponField: q('input[name="coupon"]') ? q('input[name="coupon"]').value : null,
      options: pop ? Array.from(pop.querySelectorAll('input[name="Image-choice"]')).map(r => r.value) : [],
      pageQuizLinks: Array.from(new Set(Array.from(document.querySelectorAll('a[href*="/quiz"]')).map(a => a.getAttribute('href').replace(/manualSid=[^&]+&?/, '').replace(/[?&]$/, ''))))
    };
  });
  out.httpStatus = resp ? resp.status() : null;
  fs.writeFileSync(path.join(outDir, 'result.json'), JSON.stringify(out, null, 1));
  await p.screenshot({ path: path.join(outDir, '00.jpg'), type: 'jpeg', quality: 55 });
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})().catch(e => { console.error(String(e)); process.exit(2); });
