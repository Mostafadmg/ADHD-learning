#!/usr/bin/env node
/* stage3.js: stage 3 (VERIFY) corrections to company.json. Run once after stage2.js. Idempotent (re-running gives the same file). */
const fs = require('fs'), path = require('path');
const file = path.join(__dirname, '..', 'company.json');
const d = JSON.parse(fs.readFileSync(file, 'utf8'));

const DANGER = ' Server side (observed): after the answers are posted, the order line field answer_status becomes "Danger" when a red (status 3) answer is given (runs/x01-partner-ttc, x07-patches, x08-all-red-flags, verify-r-galactose; baselines show "Normal"). The patient sees none of this.';
const AMBER = ' Server side (observed): an amber (status 2) answer raises the order line field answer_status above "Normal": "Query" in runs/verify-r-elsewhere (tablets form), "Warning" in runs/x10-bundle-bp-drop-regaine and verify-r-x11-age50 (bundle form). Which word this exact option gives was not tested one by one. The patient sees none of this.';

// 1. Option effects: fix "identical" claims and add the server-side triage finding.
const defs = { 'men-first-tablets': 'quiz-definition.json', 'men-first-bundle': 'quiz-definition-combo-regaine.json', 'men-returning-tablets': 'quiz-definition-returning.json', 'men-returning-bundle': 'quiz-definition-returning-combo-regaine.json' };
const norm = s => (s || '').replace(/\s+/g, ' ').trim();
for (const f of d.flows) {
  const def = require(path.join(__dirname, '..', defs[f.id])); const qs = [];
  (def.body || def).sections.forEach(s => s.questions.forEach(x => qs.push(x)));
  for (const q of f.questions) {
    const dq = qs.find(x => norm(x.text) === norm(q.text)); if (!dq) continue;
    for (const o of q.options) {
      const dopt = dq.options.find(z => norm(z.text) === norm(o.label)); if (!dopt) continue;
      o.effect = o.effect.replace(/ Server side \(observed\):.*$/, '');
      o.effect = o.effect.replace(/(the )?(draft )?order (is |stays )?identical to (the )?baseline/gi, 'the same product and price in the draft order');
      o.effect = o.effect.replace(/end state identical( to baseline)?/gi, 'same product, price and next step as baseline');
      if (dopt.status === 3) o.effect += DANGER;
      if (dopt.status === 2) o.effect += AMBER;
    }
  }
}
// The bundle age-50 drop-Regaine option is now fully observed.
for (const f of d.flows) for (const q of f.questions) for (const o of q.options) {
  if (f.id === 'men-first-bundle' && /rather NOT have Regaine/.test(o.label)) {
    o.effect = 'The patient asks for tablets only (amber flag). Observed to the end (runs/verify-r-x11-age50): the draft order stays the bundle at £50.36 (sku 817-9) and the flow reaches ID photos; the server sets answer_status "Warning". Any switch is left to the clinician.';
    o.evidence = 'observed';
  }
  // Out-of-stock tiles: the flag is in the served product list, so these are code, not inferred.
  if (/^pre5$/.test(q.id.split('-').pop()) && o.evidence === 'inferred' && /Out of stock/.test(o.effect)) {
    o.evidence = 'code';
    if (!/out_of_stock/.test(o.effect)) o.effect += ' The served product list marks this pack out_of_stock: true for first-time patients (runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json); clicking an out-of-stock tile was re-tested live in runs/verify-r-x13.';
  }
}

// 2. Products.
const P = id => d.products.find(p => p.id === id);
P('p4').recommendedWhen = 'Patient choice under "See more treatment options" (£72 a month for first-timers). Uses the same bundle questionnaire 2050 as the generic bundle (observed, runs/verify-r-propecia-bundle, sku 825-9).';
P('p4').evidence = 'observed';
for (const id of ['p1', 'p2']) if (!/coded/.test(P(id).priceDetail)) P(id).priceDetail += ' The largest tablet pack is titled "364 Tablets" on screen but its internal code says "336-Tablets" (served product list); the screen and the public page say 364.';
for (const id of ['p1', 'p2', 'p3', 'p4']) if (!/Re-checked/.test(P(id).priceDetail)) P(id).priceDetail += ' Re-checked in stage 3 against the served product lists for HAI-F and HAI-R (runs/verify-b01-baseline, runs/verify-b04-returning-bundle): every price and stock flag matches.' + (id === 'p1' || id === 'p2' ? ' The public page /treatments/finasteride lists the same ten tablet prices.' : '');

// 3. Rules.
const R = id => d.rules.find(r => r.id === id);
R('R6').then = 'The website does not stop the patient: the follow-up warning is shown, Next still works and the flow ends at the ID photo step with the same product and price in the draft order. But the server does act: after the answers are posted the order line field answer_status changes from "Normal" to "Danger" (x08 also set answer_score_1 and answer_score_2 to 2; their meaning is unknown). So red flags are triaged for the clinician, not shown to the patient. Refusal, if any, happens after ID photos, account and payment details.';
R('R6').proof = 'runs/x01-partner-ttc, runs/x07-patches, runs/x08-all-red-flags, runs/verify-r-galactose (single change) vs runs/x00-baseline-replay and runs/verify-b01-baseline: compare orderlines[0].answer_status in the last net/*orders_<id>.json; raw/questionnaire-ctrl-snippet.js (no status check on screen)';
R('R6').when = 'Any red-flag answer (status 3 in the definition), e.g. circular patches, complete baldness, painful or pus-filled scalp, "I will stop" answers, treatment not effective, partner trying to conceive, suicidal thoughts, galactose intolerance (tested alone in verify-r-galactose)';
R('R7').then = 'The website keeps the bundle in the order (sku 817-9, £50.36). The request to drop Regaine is only an answer for the clinician; no price or product change is shown. Server side the order line answer_status becomes "Warning".';
R('R12').then = 'An off-label warning for Regaine (licensed up to 49) appears with the choice to continue or switch to tablets only. Choosing tablets only does not change the draft order (still sku 817-9, £50.36); the flow reaches ID photos and the server sets answer_status "Warning".';
R('R12').evidence = 'observed'; R('R12').proof = 'runs/verify-r-x11-age50 (full run) vs runs/x09-bundle-baseline; runs/x11-bundle-age50-drop-regaine was partial'; R('R12').confidence = 'high';
R('R5').proof = 'runs/x13-out-of-stock-tile and runs/verify-r-x13 vs runs/x12-returning-baseline; out_of_stock flags in runs/verify-b01-baseline/net/22-…categories_HAI_F_products.json (larger packs true) and runs/verify-b04-returning-bundle/net/22-…categories_HAI_R_products.json (all false)';
R('R5').then = 'Only one-month packs can be chosen (Finasteride 28 £28, Propecia 28 £55, and the one-month Regaine bundles £50.36 and £72). The served product list marks every larger first-time pack out_of_stock: true, the tile says "Out of stock" and clicking it does nothing. Saying "Returning" (no proof asked) unlocks every pack, e.g. 84 tablets for £80. Whether this is real stock or a deliberate first-supply limit is inferred, not known.';
R('R2').then = 'Hard stop: "Based on your age, you\'re not suitable for our online service. Please speak with a local GP or clinic". A man who turned 18 the day before is accepted (runs/verify-r-age18).';
R('R2').proof = 'runs/x03-age17 and runs/verify-r-x03 vs runs/x00-baseline-replay; boundary runs/verify-r-age18';
R('R10').when = 'Postcode in Jersey (JE…) or Guernsey (GY…)';
R('R10').proof = 'runs/x05-jersey, runs/verify-r-x05 (JE2 4WD), runs/verify-r-guernsey (GY1 1AA)';
R('R1').proof = 'runs/x02-female, runs/verify-r-x02; raw/api-products-categories.json (HAI genders ["male"])';
const addRule = r => { const i = d.rules.findIndex(x => x.id === r.id); if (i > -1) d.rules[i] = r; else d.rules.push(r); };
addRule({ id: 'R15', flow: 'men-first-tablets', when: 'Health answers posted at the end of any route', then: 'The server scores the answers and stores a triage label on the order line (answer_status): "Normal" for the baselines, "Query" or "Warning" when an amber (status 2) answer is given, "Danger" when a red (status 3) answer is given. This is the only place the answers act before a clinician sees them; the screen, product and price do not change.', effectType: 'flag-for-clinician', affects: ['p1', 'p2', 'p3', 'p4'], evidence: 'observed', proof: 'Normal: runs/verify-b01-baseline, runs/x09-bundle-baseline, runs/x12-returning-baseline, runs/verify-b04-returning-bundle. Query: runs/verify-r-elsewhere. Warning: runs/x10-bundle-bp-drop-regaine, runs/verify-r-x11-age50. Danger: runs/x01-partner-ttc, runs/x07-patches, runs/x08-all-red-flags, runs/verify-r-galactose.', confidence: 'high' });
addRule({ id: 'R16', flow: 'men-first-bundle', when: 'Medicine chosen = Propecia + Regaine bundle instead of the generic finasteride bundle', then: 'Same bundle questionnaire 2050; only the order product and price change (sku 825-9, £72 vs sku 817-9, £50.36).', effectType: 'none', affects: ['p3', 'p4'], evidence: 'observed', proof: 'runs/verify-r-propecia-bundle vs runs/x09-bundle-baseline', confidence: 'high' });

// 4. Experiments.
const fixExp = (id, result) => { const e = d.experiments.find(x => x.id === id); if (e) e.result = result; };
fixExp('x01', 'Adds the follow-up "As your partner is trying to get pregnant, you should not use this medication…" whose only option is "I understand and will stop my consultation." After ticking it, Next goes on to the prostate question. Same screen, product and price at the end as baseline, but the order line answer_status is "Danger" (baseline "Normal"); stage 2 missed this field.');
fixExp('x07', 'Adds the circular-patches follow-up (Yes is a red flag, status 3). No warning on screen, flow continues to ID photos with the same product and price; the order line answer_status is "Danger" (baseline "Normal"). (First attempt failed on a slow click at screen 16; retried once and passed.)');
fixExp('x08', 'All follow-ups appear as the definition says, but nothing blocks. The flow ends at /camera/id with the same product, price, admin_status 4.1 and task statuses as baseline. The order line differs: answer_status "Danger", answer_score_1 = 2, answer_score_2 = 2 (baseline "Normal", 0, 0). Stage 2 reported it as identical; that was wrong.');
fixExp('x10', 'Follow-up "As you are taking medication for high blood pressure, Regaine is not suitable for you…" appears. Choosing tablets alone does NOT change the order (still sku 817-9, £50.36); the order line answer_status is "Warning" (bundle baseline "Normal").');
fixExp('x11', 'Off-label follow-up appears; the flow carries on. Partial run (stopped at screen 15 of 21). Completed in stage 3 as verify-r-x11-age50: order still the bundle at £50.36, ID photo step reached, answer_status "Warning".');
const addExp = e => { const i = d.experiments.findIndex(x => x.id === e.id); if (i > -1) d.experiments[i] = e; else d.experiments.push(e); };
[
  { id: 'v01', flow: 'men-first-tablets', changed: 'none (stage 3 fresh baseline replay)', result: 'Same as x00: /camera/id, sku 25-9, £28, admin_status 4.1, Health Questions task status 3, answer_status "Normal". Served questionnaire 2049 is byte-identical (sections) to the saved quiz-definition.json.', run: 'runs/verify-b01-baseline' },
  { id: 'v02', flow: 'men-returning-bundle', changed: 'none (first full replay of the returning bundle baseline: Returning, Finasteride 28 + Regaine 73 ml, £50.36)', result: 'No proof of a previous order asked. Questionnaire 2052 (identical to the saved definition), all 21 screens, ends at /camera/id. Order sku 829-9, £50.36, HAI-R, admin_status 4.1, answer_status "Normal". Every HAI-R pack is out_of_stock: false.', run: 'runs/verify-b04-returning-bundle' },
  { id: 'v03', flow: 'men-first-tablets', changed: 'pre2 birth gender: Male → Female (re-test)', result: 'Same hard stop as x02.', run: 'runs/verify-r-x02' },
  { id: 'v04', flow: 'men-first-tablets', changed: 'pre3 date of birth → 15/06/2009, age 17 (re-test)', result: 'Same hard stop as x03.', run: 'runs/verify-r-x03' },
  { id: 'v05', flow: 'men-first-tablets', changed: 'pre3 date of birth → 22/11/2008 (turned 18 the day before)', result: 'Accepted: goes on to "Have you used this service before?". The age gate is 18 exactly.', run: 'runs/verify-r-age18' },
  { id: 'v06', flow: 'men-first-tablets', changed: 'pre1 postcode → JE2 4WD (Jersey, re-test)', result: 'Same hard stop as x05.', run: 'runs/verify-r-x05' },
  { id: 'v07', flow: 'men-first-tablets', changed: 'pre1 postcode → GY1 1AA (Guernsey)', result: 'Hard stop: "We do not currently provide our service to this postcode." (same as Jersey).', run: 'runs/verify-r-guernsey' },
  { id: 'v08', flow: 'men-first-tablets', changed: 'pre5 pack: £28 → £80 (84 tablets, "Out of stock") (re-test)', result: 'Same as x13: clicking does nothing, stays on /products/HAI-F, no draft order.', run: 'runs/verify-r-x13' },
  { id: 'v09', flow: 'men-first-bundle', changed: 'men-first-bundle-q1 age band → 50 years or older, then "I\'d rather NOT have Regaine…" (completes x11)', result: 'Full run to /camera/id. Order still sku 817-9, £50.36; answer_status "Warning".', run: 'runs/verify-r-x11-age50' },
  { id: 'v10', flow: 'men-first-tablets', changed: 'men-first-tablets "Have you lost any hair elsewhere on your body?": No → Yes (amber, single change)', result: 'A free-text box ("Please tell me more about this") opens and was filled with the word "test"; flow continues to /camera/id with the same product and price; answer_status "Query" (baseline "Normal").', run: 'runs/verify-r-elsewhere' },
  { id: 'v11', flow: 'men-first-tablets', changed: 'men-first-tablets conditions: None of these apply → Hereditary problems of galactose intolerance… (red, single change)', result: 'No follow-up, no warning; flow continues to /camera/id with the same product and price; answer_status "Danger".', run: 'runs/verify-r-galactose' },
  { id: 'v12', flow: 'men-first-bundle', changed: 'pre5 medicine: Finasteride + Regaine £50.36 → Propecia + Regaine £72 (walked to the first health question)', result: 'Draft order sku 825-9, £72; the site loads the same bundle questionnaire 2050.', run: 'runs/verify-r-propecia-bundle' }
].forEach(addExp);

// 5. Recommendations.
const rec = re => d.recommendations.find(r => re.test(r.profile));
rec(/aged 50 or over/).note = 'Warned that Regaine is off-label over 49 and offered tablets only; choosing tablets only leaves the bundle in the order on screen, but the server labels the answers "Warning" (runs/verify-r-x11-age50).';
rec(/red-flag answers/).note = 'Nothing changes on screen: the chosen product stays in the order and he goes on to ID photos. The server labels the order "Danger" for the clinician (observed). Refusal can only come from the clinician later (inferred).';
if (!d.recommendations.find(r => /Propecia \+ Regaine/.test(r.profile))) d.recommendations.push({ profile: 'Same man choosing the Propecia + Regaine bundle', offered: ['p4'], default: 'p4', note: 'Same bundle questionnaire (2050) as the generic bundle; £72 for one month (runs/verify-r-propecia-bundle).', evidence: 'observed' });

// 6. Summaries.
d.engineSummary = 'There is no recommending engine on screen; the website is a gate, a price list and a fixed form. Three hard stops come first and were all seen live: postcode (Jersey and Guernsey refused), birth sex (female refused) and age (under 18 refused; 18 and 75 accepted with no change). The man then says first-time or returning (no proof) and picks medicine, brand and pack himself. First-timers can only pick one-month packs (bigger packs are marked out of stock in the served product list and cannot be clicked); "returning" unlocks all packs. Tablets or bundle, first-time or returning, picks one of four fixed questionnaires; Propecia uses the same one as generic. Follow-ups appear one level deep. Every option carries a plain/amber/red status. The screen ignores it: even nine stacked red flags and three "I will stop my consultation" answers reach the same ID photo screen with the same product and price. But the server does use it: once the answers are posted, the order is labelled "Normal", "Query", "Warning" or "Danger" for the clinician. Asking to drop Regaine does not change the order. All decisions are left to a clinician after ID photos, account and payment.';
d.weaknesses = d.weaknesses.map(w => /never acts on its own red flags/.test(w) ? 'Live tests show the screen never acts on its own red flags: patients who say they will stop, who have patchy or complete hair loss, or suicidal thoughts still reach ID photos, account and payment steps. The server only labels the order ("Danger") for later review.' : w);
d.access.coverageNote = d.access.coverageNote.replace(/ Stage 3:.*$/, '') + ' Stage 3 (independent check): 14 more live runs (runs/verify-*) replayed all four baselines, the gates (plus age 18 and Guernsey), the out-of-stock tile, completed the bundle age-50 run, walked the returning bundle route end to end for the first time, tested one amber and one red answer on their own and the Propecia bundle. It found that the order JSON does record a triage label (answer_status), which stage 2 had missed.';
d.access.coverageNote = d.access.coverageNote.replace('confirmed the gates, the product list limits and that no answer changes the order or stops the flow on screen', 'confirmed the gates, the product list limits and that no answer changes the product, price or flow on screen');
d.limitations = d.limitations.map(l => {
  if (/^The meaning of option status 2/.test(l)) return 'The site never shows option status. Stage 3 saw that the server turns it into an order label (answer_status Normal / Query / Warning / Danger), but how the clinician uses that label, and what answer_score_1 and answer_score_2 mean, cannot be seen without an account.';
  if (/^Not tested live \(budget\)/.test(l)) return 'Not tested live: other conditions one by one (cancer, liver, depression, sexual dysfunction, skin, kidney); prostate medicine; other medicines and allergies (they need free text); scalp-condition ticks; the understanding check "False"; "I\'d like to ask more about side effects"; GP "Yes" (opens a GP practice search: third-party details, avoided). By the served code these add a follow-up and an amber or red status, which by R15 should only change the server label, not the order.';
  if (/^Stage 2 live runs/.test(l)) return l.replace(' x11 (bundle, 50 or over) stopped at screen 15 of 21 after one retry.', ' x11 (bundle, 50 or over) was partial; stage 3 completed it (runs/verify-r-x11-age50).');
  return l;
});

// 7. Every "observed" claim names a run folder.
const RUN = { 'men-first-tablets': 'runs/verify-b01-baseline', 'men-first-bundle': 'runs/x09-bundle-baseline', 'men-returning-tablets': 'runs/x12-returning-baseline', 'men-returning-bundle': 'runs/verify-b04-returning-bundle' };
for (const f of d.flows) for (const q of f.questions) {
  if (q.evidence === 'observed' && !/runs\//.test(JSON.stringify(q))) q.purpose = (q.purpose || '') + ' (Seen live in ' + RUN[f.id] + '.)';
  for (const o of q.options) if (o.evidence === 'observed' && !/runs\//.test(o.effect)) o.effect += ' (Seen live in ' + RUN[f.id] + '.)';
}
const RECRUN = [[/^Baseline man/, 'runs/verify-b01-baseline'], [/^Same man choosing Propecia$/, 'runs/x06-propecia'], [/finasteride \+ Regaine bundle/, 'runs/x09-bundle-baseline'], [/blood-pressure/, 'runs/x10-bundle-bp-drop-regaine'], [/returning/, 'runs/x12-returning-baseline, runs/verify-b04-returning-bundle'], [/red-flag/, 'runs/x08-all-red-flags, runs/verify-r-galactose'], [/aged 75/, 'runs/x04-age75'], [/woman/, 'runs/x02-female, runs/verify-r-x02'], [/Under 18/, 'runs/x03-age17, runs/verify-r-x03'], [/Jersey/, 'runs/x05-jersey, runs/verify-r-x05, runs/verify-r-guernsey']];
for (const r of d.recommendations) if (r.evidence === 'observed' && !/runs\//.test(r.note)) { const m = RECRUN.find(([re]) => re.test(r.profile)); if (m) r.note += ' (' + m[1] + ')'; }
const jr = d.recommendations.find(r => /^Jersey postcode/.test(r.profile)); if (jr) jr.profile = 'Jersey or Guernsey postcode';

// 8. Fresh baseline replays of the other two routes, and the verification block.
[
  { id: 'v13', flow: 'men-first-bundle', changed: 'none (stage 3 fresh replay of the first-time bundle baseline)', result: 'Same as x09: questionnaire 2050, /camera/id, sku 817-9, £50.36, admin_status 4.1, answer_status "Normal".', run: 'runs/verify-b02-first-bundle' },
  { id: 'v14', flow: 'men-returning-tablets', changed: 'none (stage 3 fresh replay of the returning tablets baseline)', result: 'Same as x12: questionnaire 2051, /camera/id, sku 24-9, £80, HAI-R, admin_status 4.1, answer_status "Normal".', run: 'runs/verify-b03-returning-tablets' }
].forEach(addExp);
d.verification = {
  checked: [
    'All four baselines replayed fresh to /camera/id (runs/verify-b01-baseline, verify-b02-first-bundle, verify-b03-returning-tablets, verify-b04-returning-bundle; the returning bundle had never been walked end to end). Questionnaire ids, skus, prices, admin_status and task lists match stage 1 and 2: confirmed.',
    'The four served questionnaires (2049 to 2052) re-fetched live are identical (all sections) to the saved quiz-definition files: confirmed. Every question and option in company.json matches the definitions word for word (192 questions, 0 missing).',
    'R1 female refused (verify-r-x02), R2 under 18 refused (verify-r-x03) and 18 accepted (verify-r-age18), R10 Jersey refused (verify-r-x05) and Guernsey refused (verify-r-guernsey): confirmed.',
    'R5 first-time out-of-stock tile cannot be clicked (verify-r-x13), and the served product lists show out_of_stock true for every larger first-time pack and false for every returning pack: confirmed.',
    'R12 bundle age 50 or over + tablets only: completed in full (verify-r-x11-age50); order stays the bundle: confirmed.',
    'R7 bundle + blood-pressure medicine + tablets alone: re-read x10 order JSON; product unchanged: confirmed, but the server label (Warning) was missing.',
    'R6 red flags do not stop the flow on screen: confirmed with a single red answer (galactose intolerance, verify-r-galactose). The claim that the order is identical: contradicted (answer_status changes).',
    'Propecia bundle uses questionnaire 2050 like the generic bundle (verify-r-propecia-bundle): new, confirmed.',
    'Product facts: all 36 pack prices (18 first-time, 18 returning), product names, skus and stock flags checked against the live served product lists; the ten tablet prices and "from 67p per tablet" also checked on the public pages /treatments/finasteride and /propecia-online (23 Nov 2026): all match.',
    'Women: the served service list has hair loss for genders ["male"] only (women get Facial Hair Removal only); a web search found no Boots Online Doctor women\'s hair-loss service: confirmed there is no women\'s route.'
  ],
  corrected: [
    'Stage 2 said red-flag runs ended with an "identical draft order". Wrong: each order line has answer_status, which is "Normal" on every baseline, "Danger" after a red answer (x01, x07, x08, verify-r-galactose), "Warning" after amber bundle answers (x10, verify-r-x11-age50) and "Query" after an amber tablets answer (verify-r-elsewhere). x08 also set answer_score_1 and answer_score_2 to 2. Added rule R15; rewrote R6, R7, R12, experiments x01, x07, x08, x10, x11, the engine summary, a weakness, limitations and every amber/red option effect.',
    'R12 upgraded from medium (partial run) to high (full run verify-r-x11-age50).',
    'p4 (Propecia + Regaine) was "assumed to use the bundle questionnaire (not walked)"; now observed (questionnaire 2050). Added rule R16 and a recommendation profile.',
    'Out-of-stock pack options were labelled "inferred"; the flag is in the served product list, so they are now "code" with the file named.',
    'R2 and R10 widened with the new boundary (age 18 accepted) and Guernsey results.',
    'Every "observed" question, option and recommendation now names its run folder.',
    'Noted that the largest tablet packs are titled "364 Tablets" but coded "336-Tablets" internally.'
  ],
  stillUnverified: [
    'What answer_score_1 and answer_score_2 mean, and exactly which answers give "Query" versus "Warning".',
    'What the clinician does with a "Danger" or "Warning" order, and whether a bundle is switched to tablets only: after the ID photo wall.',
    'Whether "Out of stock" for first-time packs is real stock or a deliberate first-supply limit (inferred).',
    'The strength of "Regaine foam extra strength" is not stated on the site; 5% is inferred from the UK product of that name.',
    'Single answers not replayed: most conditions one by one, prostate medicine, other medicines and allergies, scalp ticks, the understanding check "False", GP "Yes".',
    'Returning bundle with Propecia was not walked (by analogy it uses questionnaire 2052).'
  ],
  verdict: 'The core picture holds up: Boots Online Doctor has no on-screen recommending engine, men only, three entry gates (sex, age 18+, mainland UK postcode), the patient picks the product, and that pick chooses one of four fixed questionnaires that are saved word for word. Prices and products were all re-checked live and match. One important claim was wrong: answers are not ignored. The server labels each order Normal, Query, Warning or Danger from the option statuses, which is how red flags reach the clinician. With that corrected, the report can be trusted as labelled for everything before the ID photo wall; nothing after the wall (clinician decisions, refusals, switches) is known.'
};

fs.writeFileSync(file, JSON.stringify(d, null, 2) + '\n');
console.log('stage3 patch written');
