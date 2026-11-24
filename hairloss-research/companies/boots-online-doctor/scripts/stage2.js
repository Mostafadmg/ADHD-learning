#!/usr/bin/env node
/* stage2.js: apply the stage 2 (experiment) findings to company.json. Idempotent: run after build-company.js.
 *   node scripts/stage2.js
 */
const fs = require('fs'); const path = require('path');
const file = path.join(__dirname, '..', 'company.json');
const c = JSON.parse(fs.readFileSync(file, 'utf8'));
const flow = id => c.flows.find(f => f.id === id);
const q = (fid, qid) => flow(fid).questions.find(x => x.id === qid);
const NOCHANGE = 'Observed: the website shows no warning beyond the follow-up, Next still works, the flow ends at the ID photo step and the order (product, price, admin_status 4.1, task statuses) is identical to baseline';

/* ---------- experiments ---------- */
c.experiments = [
  { id: 'x00', flow: 'men-first-tablets', changed: 'none (baseline replay: man 32, first time, Finasteride 1mg 28 tablets £28)', result: 'Still works. Ends at /camera/id (ID photos). Order: sku 25-9, £28, admin_status 4.1, Health Questions task status 3, next tasks ID Photos, Account-Setup, Delivery, Payment. No recommendation screen.', run: 'runs/x00-baseline-replay' },
  { id: 'x01', flow: 'men-first-tablets', changed: 'men-first-tablets-q13: None of these apply → My partner is trying to get pregnant', result: 'Adds the follow-up "As your partner is trying to get pregnant, you should not use this medication…" whose only option is "I understand and will stop my consultation." After ticking it, Next goes on to the prostate question. End state identical to baseline.', run: 'runs/x01-partner-ttc' },
  { id: 'x02', flow: 'men-first-tablets', changed: 'pre2 birth gender: Male → Female', result: 'Hard stop on the birth-gender screen: "We\'re sorry, this service isn\'t available for the sex you were assigned at birth. Visit Boots Health Hub for advice." No questions, no products.', run: 'runs/x02-female' },
  { id: 'x03', flow: 'men-first-tablets', changed: 'pre3 date of birth: 15/06/1994 (32) → 15/06/2009 (17)', result: 'Hard stop on the date-of-birth screen: "Based on your age, you\'re not suitable for our online service. Please speak with a local GP or clinic".', run: 'runs/x03-age17' },
  { id: 'x04', flow: 'men-first-tablets', changed: 'pre3 date of birth: 15/06/1994 (32) → 15/06/1951 (75)', result: 'Accepted. Same product list, same prices and same stock flags as baseline (Regaine bundles still offered). No age-based change before the questions.', run: 'runs/x04-age75' },
  { id: 'x05', flow: 'men-first-tablets', changed: 'pre1 postcode: N1 0QH → JE2 4WD (Jersey)', result: 'Hard stop on the postcode screen: "We do not currently provide our service to this postcode."', run: 'runs/x05-jersey' },
  { id: 'x06', flow: 'men-first-tablets', changed: 'pre5 medicine: Finasteride 1mg 28 tablets £28 → Propecia 1mg 28 tablets £55', result: 'Draft order sku 29-9 £55; the site loads the same questionnaire 2049 as generic finasteride. Walked to the first health question only.', run: 'runs/x06-propecia' },
  { id: 'x07', flow: 'men-first-tablets', changed: 'men-first-tablets-q1: Temples and Crown → Random patches (and the follow-up "circular patches…" = Yes)', result: 'Adds the circular-patches follow-up (Yes is a red flag, status 3). No warning, flow continues, end state identical to baseline. (First attempt failed on a slow click at screen 16; retried once and passed.)', run: 'runs/x07-patches' },
  { id: 'x08', flow: 'men-first-tablets', changed: 'Stacked red-flag check (deliberately more than one change, to test whether ANY red flag acts on screen): Complete + complete baldness Yes; pus-filled scalp; hair lost elsewhere Yes; started within the last month; Suddenly + "I will stop my consultation now"; already on finasteride, not effective, side effects Yes; partner trying to conceive + "will stop"; suicidal thoughts + "not suitable, will stop".', result: 'All follow-ups appear as the definition says, but nothing blocks. The flow ends at /camera/id and the order is identical to baseline (sku 25-9, £28, admin_status 4.1, same task statuses and flags). Red flags are not acted on by the website.', run: 'runs/x08-all-red-flags' },
  { id: 'x09', flow: 'men-first-bundle', changed: 'none (bundle baseline: Finasteride 28 + Regaine foam 1 can, £50.36; age band 18–50)', result: 'Still works. Questionnaire 2050, ends at /camera/id. Order sku 817-9, £50.36, admin_status 4.1.', run: 'runs/x09-bundle-baseline' },
  { id: 'x10', flow: 'men-first-bundle', changed: 'men-first-bundle-q19 blood-pressure medicine: No → Yes, then "Yes - please change my prescription to tablets alone."', result: 'Follow-up "As you are taking medication for high blood pressure, Regaine is not suitable for you…" appears. Choosing tablets alone does NOT change the order on the website: it stays the bundle, sku 817-9, £50.36, and ends at /camera/id. Any switch would be made later by the clinician.', run: 'runs/x10-bundle-bp-drop-regaine' },
  { id: 'x11', flow: 'men-first-bundle', changed: 'men-first-bundle-q1 age band: Between 18 and 50 → 50 years or older, then "I\'d rather NOT have Regaine…"', result: 'Off-label follow-up appears; the flow carries on. Partial run: it stopped on a slow click at screen 15 of 21 after one retry; by then the draft order was still the bundle (sku 817-9, £50.36). No on-screen switch.', run: 'runs/x11-bundle-age50-drop-regaine' },
  { id: 'x12', flow: 'men-returning-tablets', changed: 'pre4: First time → Returning for this service (and pack: Finasteride 84 tablets £80)', result: 'No proof of a previous order is asked. The 84-tablet pack (out of stock for first-timers) can be chosen. Questionnaire 2051, ends at /camera/id, order sku 24-9 (HAI-R), £80, admin_status 4.1. (First attempt failed while the page was loading; retried after 30 s and passed.)', run: 'runs/x12-returning-baseline' },
  { id: 'x13', flow: 'men-first-tablets', changed: 'pre5 pack: £28 (28 tablets) → £80 (84 tablets, labelled "Out of stock")', result: 'Clicking the out-of-stock tile does nothing: the page stays on /products/HAI-F and no draft order is made (an in-stock tile opens /product/<id>/HAI-F). First-time patients can only choose 28-tablet packs or the one-month bundles.', run: 'runs/x13-out-of-stock-tile' }
];

/* ---------- option evidence and effects ---------- */
const ft = 'men-first-tablets';
const setOpt = (fid, qid, labelRe, patch) => { const qq = q(fid, qid); if (!qq) return; qq.options.filter(o => labelRe.test(o.label)).forEach(o => Object.assign(o, patch)); };
setOpt(ft, ft + '-pre2', /^Female/, { effect: 'Hard stop: "We\'re sorry, this service isn\'t available for the sex you were assigned at birth. Visit Boots Health Hub for advice." (runs/x02-female)', effectType: 'hard-stop', evidence: 'observed' });
const redObs = [
  ['q2', /^Yes/, 'x07'], ['q3', /^Yes/, 'x08'], ['q4', /pain, burning/, 'x08'], ['q6', /^Yes/, 'x08'], ['q7', /Within the last month/, 'x08'],
  ['q9', /do not wish to continue/, 'x08'], ['q11', /^No$/, 'x08'], ['q12', /^Yes/, 'x08'], ['q13', /trying to get pregnant/, 'x01'],
  ['q15', /will stop/, 'x01'], ['q20', /Suicidal/, 'x08'], ['q23', /not suitable/, 'x08']
];
const runOf = { x01: 'runs/x01-partner-ttc', x07: 'runs/x07-patches', x08: 'runs/x08-all-red-flags' };
for (const [qn, re, x] of redObs) {
  const qq = q(ft, `${ft}-${qn}`); if (!qq) continue;
  qq.options.filter(o => re.test(o.label)).forEach(o => {
    o.effect = o.effect.replace(/ Observed:.*$/, '') + ` ${NOCHANGE} (${runOf[x]}).`;
    o.evidence = 'observed';
    if (o.effectType === 'unknown') o.effectType = 'flag-for-clinician';
  });
}
for (const qn of ['q1', 'q8', 'q10']) { const qq = q(ft, `${ft}-${qn}`); if (qq) qq.options.forEach(o => { if (/Random patches|Complete|Suddenly|^Yes$/.test(o.label) && o.evidence === 'code') { o.evidence = 'observed'; o.effect = o.effect.replace(/ Observed:.*$/, '') + ' Observed in runs/x07-patches or runs/x08-all-red-flags: the follow-up appears, nothing else changes.'; } }); }
// out-of-stock packs on the product list (pre5 of both first-time flows)
for (const fid of ['men-first-tablets', 'men-first-bundle']) {
  const qq = q(fid, `${fid}-pre5`); if (!qq) continue;
  qq.options.forEach(o => {
    if (/Out of/.test(o.label) || (o.effectType === 'unknown' && /Out of stock/.test(o.effect))) {
      const tested = /84 Tablets, £80/.test(o.label);
      o.effect = 'Shown as "Out of stock" for first-time patients; the tile cannot be chosen (clicking it does nothing, no draft order). ' + (tested ? 'Tested live: runs/x13-out-of-stock-tile.' : 'Tested live on the 84-tablet £80 pack (runs/x13-out-of-stock-tile); assumed the same for this tile.') + ' Returning patients can choose larger packs (runs/x12-returning-baseline).';
      o.effectType = 'product-removed'; o.evidence = tested ? 'observed' : 'inferred';
    }
  });
}
for (const f of c.flows) { const pq = f.questions.find(x => /-pre5$/.test(x.id)); if (pq) pq.options.forEach(o => { if (/Propecia 1mg, 28 Tablets/.test(o.label)) { o.effect = o.effect.replace(/ Observed:.*$/, '') + ' Observed: Propecia uses the same questionnaire as generic finasteride (2049 for first-time tablets, runs/x06-propecia).'; o.evidence = 'observed'; } }); }
for (const f of c.flows) { const pc = f.questions.find(x => /-post1$/.test(x.id)); if (pc) pc.options.forEach(o => { o.effect = 'Starts the selfie and photo-ID capture: the research stops here (photos not allowed). What follows (account, delivery, payment, clinician review) was not seen.'; o.effectType = 'unknown'; o.evidence = 'unknown'; }); }
// bundle switches
const fb = 'men-first-bundle';
setOpt(fb, fb + '-q20', /tablets alone/, { effect: 'The patient asks to drop Regaine (amber flag). Observed: the order on the website does NOT change; it stays the bundle at £50.36 and goes on to ID photos (runs/x10-bundle-bp-drop-regaine). Any switch to tablets only is left to the clinician.', effectType: 'flag-for-clinician', evidence: 'observed' });
setOpt(fb, fb + '-q19', /^Yes/, { effect: 'Shows the follow-up "As you are taking medication for high blood pressure, Regaine is not suitable for you. Would you prefer to have tablets without Regaine?" (runs/x10-bundle-bp-drop-regaine).', effectType: 'extra-questions', evidence: 'observed' });
setOpt(fb, fb + '-q1', /50 years or older/, { effect: 'Shows the off-label Regaine follow-up (licence covers up to 49). Observed: no other change; the draft order stays the bundle (runs/x11-bundle-age50-drop-regaine, partial run).', effectType: 'extra-questions', evidence: 'observed' });
setOpt(fb, fb + '-q2', /rather NOT have Regaine/, { effect: 'The patient asks for tablets only (amber flag). Observed up to screen 15: the draft order stays the bundle at £50.36 (runs/x11-bundle-age50-drop-regaine, partial). Any switch is left to the clinician.', effectType: 'flag-for-clinician', evidence: 'observed' });
// mirror the bundle switch evidence onto the returning bundle flow as inferred
const rb = 'men-returning-bundle';
for (const qq of flow(rb).questions) qq.options.forEach(o => { if (/tablets alone|rather NOT have Regaine/.test(o.label) && o.effectType === 'product-switched') { o.effect = 'The patient asks to drop Regaine. Inferred from the first-time bundle (runs/x10-bundle-bp-drop-regaine): the website does not change the order; the clinician decides.'; o.effectType = 'flag-for-clinician'; o.evidence = 'inferred'; } });

/* ---------- pre-question evidence ---------- */
for (const f of c.flows) {
  const p1 = f.questions.find(x => /-pre1$/.test(x.id)); if (p1) { p1.branchDetail = 'Jersey postcode (JE2 4WD) refused: "We do not currently provide our service to this postcode." (runs/x05-jersey). Unknown postcodes: "Sorry, Boots isn\'t in your postcode yet." (app code, not tested). Next stays disabled until the postcode passes.'; p1.evidence = 'observed'; }
  const p3 = f.questions.find(x => /-pre3$/.test(x.id)); if (p3) { p3.branchDetail = 'Age 17 refused: "Based on your age, you\'re not suitable for our online service. Please speak with a local GP or clinic" (runs/x03-age17). Age 75 accepted with the same products and prices (runs/x04-age75). Server limits 18 to 120.'; p3.evidence = 'observed'; }
}

/* ---------- rules ---------- */
const keep = c.rules.filter(r => ['R3', 'R4', 'R8'].includes(r.id));
c.rules = [
  { id: 'R1', flow: ft, when: 'Birth gender = "Female"', then: 'Hard stop on the second screen: "We\'re sorry, this service isn\'t available for the sex you were assigned at birth. Visit Boots Health Hub for advice." There is no women\'s hair-loss service.', effectType: 'hard-stop', affects: ['p1', 'p2', 'p3', 'p4'], evidence: 'observed', proof: 'runs/x02-female; raw/api-products-categories.json (HAI genders ["male"])', confidence: 'high' },
  { id: 'R2', flow: ft, when: 'Date of birth gives an age under 18', then: 'Hard stop: "Based on your age, you\'re not suitable for our online service. Please speak with a local GP or clinic".', effectType: 'hard-stop', affects: ['p1', 'p2', 'p3', 'p4'], evidence: 'observed', proof: 'runs/x03-age17 vs runs/x00-baseline-replay', confidence: 'high' },
  { id: 'R9', flow: ft, when: 'Date of birth gives an older age (75 tested)', then: 'No change: same products, prices and stock flags; Regaine bundles are still offered. Only the bundle questionnaire later asks an age band and warns about off-label Regaine use at 50 or over.', effectType: 'none', affects: [], evidence: 'observed', proof: 'runs/x04-age75 vs runs/x00-baseline-replay', confidence: 'high' },
  { id: 'R10', flow: ft, when: 'Postcode in Jersey (JE…)', then: 'Hard stop on the postcode screen: "We do not currently provide our service to this postcode."', effectType: 'hard-stop', affects: ['p1', 'p2', 'p3', 'p4'], evidence: 'observed', proof: 'runs/x05-jersey', confidence: 'high' },
  ...keep,
  { id: 'R5', flow: ft, when: '"Have you used this service before?" = "First time using this service"', then: 'Only one-month packs can be chosen (Finasteride 28 £28, Propecia 28 £55, and the one-month Regaine bundles). Larger packs are shown as "Out of stock" and clicking them does nothing. Saying "Returning" (no proof asked) unlocks every pack, e.g. 84 tablets for £80.', effectType: 'product-removed', affects: ['p1', 'p2', 'p3', 'p4'], evidence: 'observed', proof: 'runs/x13-out-of-stock-tile vs runs/x12-returning-baseline', confidence: 'medium' },
  { id: 'R11', flow: ft, when: 'Medicine chosen = Propecia instead of generic finasteride', then: 'Same questionnaire (2049 for first-time tablets); only the order product and price change (sku 29-9, £55 vs sku 25-9, £28).', effectType: 'none', affects: ['p2'], evidence: 'observed', proof: 'runs/x06-propecia vs runs/x00-baseline-replay', confidence: 'high' },
  { id: 'R6', flow: ft, when: 'Any red-flag answer (status 3 in the definition): circular patches, complete baldness, painful or pus-filled scalp, sudden loss + "I will stop", treatment not effective, partner trying to conceive + "I will stop my consultation", suicidal thoughts + "not suitable, will stop", galactose intolerance', then: 'The website does not act on it. The follow-up warning is shown, Next still works, the flow ends at the ID photo step and the draft order is identical to baseline (same product, price, admin_status 4.1, task statuses). The answers reach the clinician; refusal is expected but happens after ID photos, account and payment details.', effectType: 'flag-for-clinician', affects: ['p1', 'p2', 'p3', 'p4'], evidence: 'observed', proof: 'runs/x01-partner-ttc, runs/x07-patches, runs/x08-all-red-flags vs runs/x00-baseline-replay; raw/questionnaire-ctrl-snippet.js (no status check)', confidence: 'high' },
  { id: 'R7', flow: fb, when: 'Bundle: taking blood-pressure medicine = "Yes" → "Yes - please change my prescription to tablets alone."', then: 'The website keeps the bundle in the order (sku 817-9, £50.36). The request to drop Regaine is only an answer for the clinician; no price or product change is shown.', effectType: 'flag-for-clinician', affects: ['p3', 'p4'], evidence: 'observed', proof: 'runs/x10-bundle-bp-drop-regaine vs runs/x09-bundle-baseline', confidence: 'high' },
  { id: 'R12', flow: fb, when: 'Bundle: age band = "50 years or older"', then: 'An off-label warning for Regaine (licensed up to 49) appears with the choice to continue or switch to tablets only. Choosing tablets only does not change the draft order on screen.', effectType: 'flag-for-clinician', affects: ['p3', 'p4'], evidence: 'observed', proof: 'runs/x11-bundle-age50-drop-regaine (partial, to screen 15 of 21) vs runs/x09-bundle-baseline', confidence: 'medium' },
  { id: 'R13', flow: fb, when: 'Bundle: blood-pressure medicine = "Yes" → "No" (keeps Regaine), or "High blood pressure" ticked as a condition, or broken/inflamed scalp skin = "Yes"', then: 'Red flag (status 3) in the definition; by R6 the website would carry on. Not replayed one by one.', effectType: 'flag-for-clinician', affects: ['p3', 'p4'], evidence: 'code', proof: 'quiz-definition-combo-regaine.json (questions 88464, 88478, conditions list); behaviour by analogy with runs/x08-all-red-flags', confidence: 'medium' },
  { id: 'R14', flow: ft, when: 'Every follow-up question in all four definitions', then: 'Shown only when its display_condition lists an option ticked on the first question of the same screen (one level deep). No answer skips a later screen; the number of screens is fixed (19 for tablets, 21 for bundles).', effectType: 'extra-questions', affects: [], evidence: 'code', proof: 'quiz-definition*.json display_condition; raw/questionnaire-ctrl-snippet.js; confirmed live in runs/x01-partner-ttc, runs/x07-patches, runs/x08-all-red-flags, runs/x10-bundle-bp-drop-regaine, runs/x11-bundle-age50-drop-regaine', confidence: 'high' }
];

/* ---------- recommendations ---------- */
c.recommendations = [
  { profile: 'Baseline man, 32, temples and crown, gradual, no medical issues, first time', offered: ['p1', 'p2', 'p3', 'p4'], default: null, note: 'No recommendation screen. He sees a price list and picks; only the 28-tablet packs (£28 generic, £55 Propecia) and the one-month bundles (£50.36, £72) can be chosen. The £28 pick reaches the ID photo step with no message.', evidence: 'observed' },
  { profile: 'Same man choosing Propecia', offered: ['p2'], default: 'p2', note: 'Same questionnaire as generic; £55 for 28 tablets.', evidence: 'observed' },
  { profile: 'Same man choosing the finasteride + Regaine bundle', offered: ['p3'], default: 'p3', note: 'Longer questionnaire (2050) with age band, scalp skin and blood-pressure questions; £50.36 for one month.', evidence: 'observed' },
  { profile: 'Bundle patient on blood-pressure medicine who asks for tablets alone', offered: ['p3'], default: 'p3', note: 'The order stays the bundle at £50.36 on screen; the clinician is expected to change it to tablets only (inferred).', evidence: 'observed' },
  { profile: 'Bundle patient aged 50 or over', offered: ['p3'], default: 'p3', note: 'Warned that Regaine is off-label over 49 and offered tablets only; the order on screen is unchanged.', evidence: 'observed' },
  { profile: 'Man saying he is returning (no proof asked)', offered: ['p1', 'p2', 'p3', 'p4'], default: null, note: 'All pack sizes open, e.g. Finasteride 84 tablets £80; returning questionnaire 2051 adds a side-effect question for current users.', evidence: 'observed' },
  { profile: 'Man with red-flag answers (patchy or complete loss, painful scalp, sudden onset, partner trying to conceive, suicidal thoughts)', offered: ['p1'], default: 'p1', note: 'Nothing changes on screen: the chosen product stays in the order and he goes on to ID photos. Refusal can only come from the clinician later (inferred).', evidence: 'observed' },
  { profile: 'Man aged 75', offered: ['p1', 'p2', 'p3', 'p4'], default: null, note: 'Accepted; same list and prices as the baseline man.', evidence: 'observed' },
  { profile: 'Baseline woman, 38', offered: [], default: null, note: 'Refused at the birth-gender screen; signposted to Boots Health Hub. No women\'s hair-loss service.', evidence: 'observed' },
  { profile: 'Under 18', offered: [], default: null, note: 'Refused at the date-of-birth screen; told to see a GP or clinic.', evidence: 'observed' },
  { profile: 'Jersey postcode', offered: [], default: null, note: 'Refused at the postcode screen.', evidence: 'observed' }
];

/* ---------- products ---------- */
const P = id => c.products.find(p => p.id === id);
P('p1').recommendedWhen = 'Never recommended by the engine: the man picks it from the price list before any medical question. First-time patients can only pick 28 tablets (£28); returning patients any pack. Red-flag answers do not remove it on screen; the clinician decides later.';
P('p2').recommendedWhen = 'Patient choice only (brand version at about twice the price). Uses exactly the same questionnaire as generic finasteride (observed, runs/x06-propecia). First-time: 28 tablets £55 only.';
P('p3').recommendedWhen = 'Patient choice under "See more treatment options". The bundle questionnaire lets him ask to drop Regaine (age 50+, blood-pressure medicine) but the order on screen stays the bundle; the clinician would switch it.';
P('p4').recommendedWhen = 'Patient choice under "See more treatment options" (£72 a month). Assumed to use the bundle questionnaire (not walked).';
P('p5').recommendedWhen = 'Never offered inside the consultation; information pages point to boots.com for Regaine on its own.';

/* ---------- summaries ---------- */
c.engineSummary = 'There is no recommending engine; the website is a gate, a price list and a fixed form. Three hard stops come first and were all seen live: postcode (Jersey refused), birth sex (female refused) and age (under 18 refused; 75 accepted with no change). The man then says first-time or returning (no proof) and picks medicine, brand and pack himself. First-timers can only pick one-month packs (bigger packs are "Out of stock" and cannot be clicked); "returning" unlocks all packs. Tablets or bundle, first-time or returning, picks one of four fixed questionnaires; Propecia uses the same one as generic. Follow-ups appear one level deep. Every option carries a red/amber/plain status, but the website ignores it: even nine stacked red flags and three "I will stop my consultation" answers lead to the same ID photo screen and an identical draft order. Asking to drop Regaine does not change the order either. All judgement is left to a clinician after ID photos, account and payment.';
const add = (k, items) => { for (const s of items) if (!c[k].includes(s)) c[k].push(s); };
add('strengths', ['Every gate it does have is immediate and plainly worded (sex, age, postcode), with signposting to a GP or Boots Health Hub.', 'Safety follow-ups appear exactly when relevant (pregnancy, suicidal thoughts, blood pressure with Regaine, off-label Regaine over 49), so the clinician gets context in the patient\'s own answers.']);
add('weaknesses', ['Live tests show the form never acts on its own red flags: patients who say they will stop, who have patchy or complete hair loss, or suicidal thoughts still reach ID photos, account and payment steps.', 'Choosing "tablets alone" in the bundle form does not change the basket; the patient still sees the bundle price.', '"Returning" is self-declared with no check, and it unlocks bigger packs that first-timers cannot buy.', 'No questions about goals, how much hair loss bothers the patient, preferences (tablet vs topical) or previous non-finasteride treatments; nothing about women, so half of hair-loss patients are turned away.']);
add('opportunities', ['Act on red flags at once with a clear "this is not right for you, here is what to do" screen, saving the patient ID photos and sign-up.', 'Let the questionnaire change the basket live (e.g. drop Regaine for blood-pressure patients, suggest topical options for men who do not want oral finasteride).', 'Offer longer first supplies or a subscription after a proper first review, instead of stock flags.', 'Serve women and the "no finasteride" group (topical finasteride, oral or topical minoxidil, combination sprays), which Boots does not sell online.']);
c.limitations = c.limitations.filter(l => !/^Only one full click-through|^Propecia packs and the Propecia bundle were not walked|^Under-18, over-65, female/.test(l));
add('limitations', [
  'Stage 2 live runs: 14 (x00 to x13). Fully replayed: first-time tablets and bundle baselines, returning tablets baseline, partner trying to conceive, patchy loss, a stacked red-flag run, bundle + blood-pressure medicine, out-of-stock tile, sex, age 17 and 75, Jersey postcode, Propecia questionnaire id. x11 (bundle, 50 or over) stopped at screen 15 of 21 after one retry.',
  'x08 changed many answers at once on purpose (to test whether any red flag acts on screen). Because nothing changed, each flag in it is shown not to act; but a single-answer effect that cancels another cannot be ruled out completely.',
  'Not tested live (budget): returning bundle route; the Propecia bundle; other conditions one by one (cancer, liver, depression, sexual dysfunction, skin, kidney, galactose); prostate medicine; other medicines and allergies (they need free text); scalp-condition ticks; the understanding check "False"; "I\'d like more information" on side effects; GP "Yes" (opens a GP practice search: third-party details, avoided). By the served code these only add a follow-up and do not change the order; R6 and R14 make that very likely.',
  'Whether "Out of stock" is a deliberate first-supply limit or real stock is inferred; the flags may change from day to day.',
  'What the clinician does with flagged answers, and whether the bundle is switched to tablets only, happens after the account wall and was not seen.'
]);
c.access.coverageNote = c.access.coverageNote.replace(/ Stage 2:.*$/, '') + ' Stage 2: 14 live one-change runs (x00 to x13, runs/x*) confirmed the gates, the product list limits and that no answer changes the order or stops the flow on screen.';
fs.writeFileSync(file, JSON.stringify(c, null, 2) + '\n');
console.log('stage2 applied:', c.experiments.length, 'experiments,', c.rules.length, 'rules,', c.recommendations.length, 'recommendations');
