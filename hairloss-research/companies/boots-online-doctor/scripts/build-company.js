#!/usr/bin/env node
/* build-company.js — builds ../company.json from the four saved quiz definitions and the product JSON.
 * Run: node scripts/build-company.js   (from the company folder, or anywhere)
 * Hand-written facts live in this file; question wording, options, flags and branch conditions are read
 * straight from the definitions so nothing is retyped.
 */
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..');
const load = f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));

const SITE = 'https://onlinedoctor.boots.com';
const ENTRY = 'https://onlinedoctor-clinic.boots.com/Hair-Loss';

/* ---------- products ---------- */
const prodF = load('raw/api-categories-HAI-F-products.json');
const prodR = load('raw/api-categories-HAI-R-products.json');
const famOf = p => /Regaine/i.test(p.title) ? (/Propecia/i.test(p.title) ? 'p4' : 'p3') : (/Propecia/i.test(p.title) ? 'p2' : 'p1');
const packs = (list, fam) => list.filter(p => famOf(p) === fam).sort((a, b) => a.price - b.price);
const packLine = (list, fam) => packs(list, fam).map(p => `${p.subtitle || p.title.replace(/^.*?\((\d+ tablets)\).*?\((.*)\)\s*$/, '$1 + $2')} £${p.price} (sku ${p.sku}${p.out_of_stock ? ', shown "Out of stock"' : ''})`).join('; ');
const stockNote = 'On 2026-11-23 the first-time list (HAI-F) showed only the one-month packs as available and every larger pack as "Out of stock"; the returning list (HAI-R) showed every pack as available.';

const products = [
  {
    id: 'p1', name: 'Finasteride 1mg tablets (generic)', category: 'rx-oral',
    actives: [{ name: 'finasteride', strength: '1 mg' }], form: 'tablet, one a day', audience: 'men',
    legalStatus: 'POM, licensed medicine (generic finasteride 1 mg)',
    price: '£28 for 28 tablets; £245 for 364 tablets (about 67p a tablet)',
    priceDetail: `One-off packs, no subscription. First-time (HAI-F): ${packLine(prodF, 'p1')}. Returning (HAI-R): ${packLine(prodR, 'p1')}. ${stockNote} Free standard delivery or free pick-up in a Boots store. Payment is taken only if a clinician approves.`,
    url: SITE + '/treatments/finasteride',
    recommendedWhen: 'Not recommended by an engine: the patient picks it on the "Which medicine do you prefer?" screen before any medical question. A clinician then approves or refuses. Bundle questionnaires let the patient ask to be switched to tablets only (aged 50 or over, or on blood-pressure medicine).',
    evidence: 'observed'
  },
  {
    id: 'p2', name: 'Propecia 1mg tablets (brand)', category: 'rx-oral',
    actives: [{ name: 'finasteride', strength: '1 mg' }], form: 'tablet, one a day', audience: 'men',
    legalStatus: 'POM, licensed medicine (branded finasteride 1 mg)',
    price: '£55 for 28 tablets; £400 for 364 tablets',
    priceDetail: `One-off packs, no subscription. First-time (HAI-F): ${packLine(prodF, 'p2')}. Returning (HAI-R): ${packLine(prodR, 'p2')}. ${stockNote}`,
    url: SITE + '/propecia-online',
    recommendedWhen: 'Patient choice on the "Which medicine do you prefer?" screen. Same service as generic finasteride; which questionnaire it loads was not walked (expected to be the tablets-only one).',
    evidence: 'observed'
  },
  {
    id: 'p3', name: 'Finasteride 1mg tablets + Regaine foam extra strength (bundle)', category: 'bundle',
    actives: [{ name: 'finasteride', strength: '1 mg' }, { name: 'minoxidil', strength: 'not stated on the site ("Regaine foam extra strength", 73 ml can). The licensed UK product of that name is 5% w/w: inferred' }],
    form: 'tablet once a day + scalp foam twice a day (1 g, half a capful)', audience: 'men',
    legalStatus: 'Finasteride: POM, licensed. Regaine foam: licensed medicine sold without prescription in UK shops (inferred GSL); here it is supplied as part of the prescription order. Off-label for men aged 50 or over (the site says the licence covers up to age 49).',
    price: '£50.36 for one month (28 tablets + 1 x 73 ml); £334.39 for 12 months',
    priceDetail: `One-off packs, no subscription. First-time (HAI-F): ${packLine(prodF, 'p3')}. Returning (HAI-R): ${packLine(prodR, 'p3')}. ${stockNote}`,
    url: SITE + '/propecia-online',
    recommendedWhen: 'Patient choice, found under "See more treatment options". Choosing a bundle loads a longer questionnaire with age band, scalp skin and blood-pressure questions. The patient can ask to drop Regaine if aged 50 or over or on blood-pressure medicine.',
    evidence: 'observed'
  },
  {
    id: 'p4', name: 'Propecia 1mg tablets + Regaine foam extra strength (bundle)', category: 'bundle',
    actives: [{ name: 'finasteride', strength: '1 mg' }, { name: 'minoxidil', strength: 'not stated on the site ("Regaine foam extra strength", 73 ml can). The licensed UK product of that name is 5% w/w: inferred' }],
    form: 'tablet once a day + scalp foam twice a day', audience: 'men',
    legalStatus: 'Propecia: POM, licensed. Regaine foam: licensed medicine sold without prescription in UK shops (inferred GSL). Off-label for men aged 50 or over.',
    price: '£72 for one month (28 tablets + 1 x 73 ml); £458 for 12 months',
    priceDetail: `One-off packs, no subscription. First-time (HAI-F): ${packLine(prodF, 'p4')}. Returning (HAI-R): ${packLine(prodR, 'p4')}. ${stockNote}`,
    url: SITE + '/propecia-online',
    recommendedWhen: 'Patient choice, found under "See more treatment options". Expected to load the bundle questionnaire (only the finasteride bundle was walked).',
    evidence: 'observed'
  },
  {
    id: 'p5', name: 'Regaine (minoxidil) on its own: signposted to boots.com, not sold by the Online Doctor', category: 'otc-medicine',
    actives: [{ name: 'minoxidil', strength: 'not stated (the finasteride page mentions "minoxidil 5% solution")' }], form: 'scalp foam or solution', audience: 'men',
    legalStatus: 'Sold without prescription on boots.com and in Boots stores (not part of this service)',
    price: 'Not listed on Boots Online Doctor (sold on boots.com; price not checked)',
    priceDetail: 'The information page says: "Regaine can be used on its own and is available from boots.com or in Boots stores."',
    url: SITE + '/propecia-online-important-info',
    recommendedWhen: 'Mentioned as an alternative on information pages only. Never offered inside the consultation on its own.',
    evidence: 'docs'
  }
];

/* ---------- question annotations (purpose + role), matched on wording ---------- */
const NOTES = [
  [/check your age/, 'eligibility-gate', 'Regaine foam is licensed only up to age 49, so the bundle asks for an age band (although the date of birth was already given).'],
  [/over 49/, 'product-selector', 'Tells men aged 50 or over that Regaine would be off-label and lets them drop it for tablets only.'],
  [/best describes your hair loss/, 'diagnosis', 'Checks the pattern fits male pattern baldness (temples, crown). Patches or complete loss suggest another cause.'],
  [/circular patches/, 'diagnosis', 'Screens for alopecia areata (smooth round patches), which this service does not treat.'],
  [/complete baldness/, 'eligibility-gate', 'Finasteride is unlikely to help once most hair is lost.'],
  [/Do you have any of the following\? Please select/, 'diagnosis', 'Looks for scalp disease that could be the real cause or needs treating first.'],
  [/damaged hair follicles/, 'expectation-setting', 'Warns that a scalp condition makes treatment work less well; the patient chooses to go on or stop.'],
  [/broken, infected, shaved or inflamed/, 'safety-screen', 'Regaine must not go on damaged, infected, inflamed or shaved scalp skin.'],
  [/lost any hair elsewhere/, 'diagnosis', 'Body hair loss points away from male pattern baldness.'],
  [/When did you start losing/, 'diagnosis', 'Very recent hair loss is not typical of male pattern baldness.'],
  [/How did your hair loss start/, 'diagnosis', 'Male pattern baldness is gradual; sudden loss suggests another cause.'],
  [/Sudden hair loss is unusual/, 'expectation-setting', 'Warns that sudden loss is not what the treatment is for; the patient chooses to go on or stop.'],
  [/currently using Finasteride or Propecia/, 'personalisation', 'Separates new starters from men already on treatment and opens the follow-up questions.'],
  [/^Is it effective/, 'eligibility-gate', 'No point continuing a treatment that has not worked.'],
  [/Do you experience any side effects|any of the following side effects/, 'safety-screen', 'Picks up side effects from current finasteride use.'],
  [/remind you that depression/, 'safety-screen', 'Asks directly about the MHRA-highlighted side effects (depression, suicidal thoughts, sexual dysfunction) in men already on treatment.'],
  [/Is your partner pregnant/, 'safety-screen', 'Finasteride can harm a male foetus; trying to conceive is a reason not to treat.'],
  [/you must use condoms/, 'consent', 'Makes the patient confirm the condom advice when a partner is pregnant.'],
  [/partner is trying to get pregnant, you should not/, 'eligibility-gate', 'Tells the patient the medicine is not suitable while trying to conceive.'],
  [/medication for a prostate condition/, 'safety-screen', 'Looks for finasteride 5 mg or similar medicines, and for men whose PSA tests matter.'],
  [/can affect prostate blood test/, 'consent', 'Makes the patient acknowledge that finasteride changes PSA test results.'],
  [/medication for high blood pressure \(hypertension\)\?/, 'safety-screen', 'Regaine (minoxidil) is not suitable for men on blood-pressure medicine.'],
  [/As you are taking medication for high blood pressure/, 'product-selector', 'Offers to drop Regaine and keep tablets only.'],
  [/prescription-only medicines, over-the-counter/, 'safety-screen', 'Full medicines history for the clinician.'],
  [/don't take any medication at all/, 'safety-screen', 'Double-checks a "no medicines" answer.'],
  [/any of the following conditions/, 'safety-screen', 'Conditions that matter for finasteride (and, in bundles, for Regaine).'],
  [/uncommon side effect of Finasteride\/Propecia/, 'consent', 'Makes a patient with this condition acknowledge the matching side-effect warning.'],
  [/thoughts of self harm or suicide/, 'eligibility-gate', 'Signposts crisis help and tells the patient the medicine is not suitable.'],
  [/other significant medical conditions/, 'safety-screen', 'Catch-all medical history.'],
  [/known allergies/, 'safety-screen', 'Allergy check.'],
  [/allergic to any of the following/, 'safety-screen', 'Allergy detail; medicine allergies are flagged.'],
  [/check your understanding/, 'expectation-setting', 'Checks the patient knows it takes 3 to 6 months and stops working when stopped.'],
  [/takes several months to work/, 'expectation-setting', 'Corrects a wrong answer to the understanding check.'],
  [/important side effects that have occurred/, 'consent', 'Side-effect warning the patient must acknowledge.'],
  [/If you experience these side effects/, 'consent', 'Tells the patient to stop and message the service; offers the leaflet.'],
  [/Patient Information Leaflet for Finasteride/, 'consent', 'Gives the leaflet link; lets the patient ask a question.'],
  [/tell your GP/, 'data-capture', 'Asks permission to inform the GP and, if yes, collects the GP practice.'],
  [/anything else you want to tell me/, 'data-capture', 'Free-text catch-all for the clinician.'],
  [/Please confirm/, 'consent', 'Final declaration of honesty and own use.']
];
const noteFor = t => { for (const [re, role, purpose] of NOTES) if (re.test(t)) return { role, purpose }; return { role: 'safety-screen', purpose: 'Not classified.' }; };

/* baseline answers actually clicked in runs/baseline-men (first-time, tablets only) */
const BASELINE = ['Temples and Crown', 'None of the above', 'No', 'More than a month ago', 'Gradually', 'None of these apply', "Correct - I'm not on any medication", 'True',
  'I understand that if I need a prostate blood test, the doctor will need to know I am on this medicine.', 'I understand', 'I understand and wish to proceed',
  "No (This won't affect our review of your order, but we would encourage you to tell your GP)", 'Please tick to confirm that you understand and agree'];

const short = (t, n = 80) => { t = t.replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };

function preSteps(fid, child, prodList, qid, bundle, walked) {
  const ev = walked ? 'observed' : 'code';
  let o = 0; const Q = [];
  Q.push({
    id: `${fid}-pre1`, order: ++o, stage: 'anonymous', text: "What's your postcode?", type: 'text', options: [],
    purpose: 'Service-area check before anything else.', engineRole: 'eligibility-gate', branches: true,
    branchDetail: 'The app checks the postcode with the server (users/me/eligibility?zip=… and a postcode look-up). Jersey (JE) and Guernsey (GY) postcodes are refused in the browser: "We do not currently provide our service to this postcode." Unknown postcodes: "Sorry, Boots isn\'t in your postcode yet." (messages read in the app code; not tested live). Next stays disabled until the postcode passes.',
    shownWhen: 'always (first screen of every hair-loss entry)', evidence: 'observed'
  });
  Q.push({
    id: `${fid}-pre2`, order: ++o, stage: 'anonymous', text: 'What’s your birth gender?', type: 'single',
    options: [
      { label: 'Female', effect: 'Stops here. The service is set to male only (genders ["male"] in the service list). Message in the app code: "We\'re sorry, this service isn\'t available for the sex you were assigned at birth. Visit Boots Health Hub for advice." Not tested live.', effectType: 'hard-stop', affects: ['p1', 'p2', 'p3', 'p4'], evidence: 'code' },
      { label: 'Male', effect: 'Next is enabled; goes to date of birth.', effectType: 'next-question', affects: [], evidence: 'observed' }
    ],
    purpose: 'Hair-loss treatment here is for men only.', engineRole: 'eligibility-gate', branches: true, branchDetail: 'Female cannot continue.', shownWhen: 'always', evidence: 'observed'
  });
  Q.push({
    id: `${fid}-pre3`, order: ++o, stage: 'anonymous', text: 'What’s your date of birth? (Please make sure this is accurate to avoid delays to your treatment)', type: 'date', options: [],
    purpose: 'Age check. Also used later to match the photo ID.', engineRole: 'eligibility-gate', branches: true,
    branchDetail: 'Under 16 is refused in the browser ("Sorry, you need to be at least 16 to use Boots Online Doctor Service."). The server then checks the age for this service (users/me/eligibility?dob=…&category_code=HAI); the service list gives min age 18 and max age 120 for hair loss. Under-18 and over-65 behaviour not tested. After this screen the site itself creates a placeholder "temporary user" (POST users/temp) so the visit can go on without an email.',
    shownWhen: 'always', evidence: 'observed'
  });
  Q.push({
    id: `${fid}-pre4`, order: ++o, stage: 'anonymous', text: 'Have you used this service before?', type: 'single',
    options: [
      { label: 'First time using this service', effect: 'Opens the first-time product list (child service HAI-F). On the day tested only one-month packs could be chosen there; larger packs showed "Out of stock".', effectType: 'next-question', affects: [], evidence: 'observed' },
      { label: 'Returning for this service', effect: 'Opens the returning product list (child service HAI-R): same medicines and prices, every pack size available, larger packs shown first. Uses the returning questionnaires, which add one side-effect question.', effectType: 'extra-questions', affects: [], evidence: 'observed' }
    ],
    purpose: 'Splits new patients from returning ones.', engineRole: 'personalisation', branches: true,
    branchDetail: 'Chooses the child service (HAI-F or HAI-R), and with it the product list and the questionnaire. It is self-declared: a brand-new anonymous visitor can pick "Returning" (observed).', shownWhen: 'always', evidence: 'observed'
  });
  const walkedSku = { 'men-first-tablets': '25-9', 'men-first-bundle': '817-9', 'men-returning-tablets': '24-9', 'men-returning-bundle': '829-9' };
  Q.push({
    id: `${fid}-pre5`, order: ++o, stage: 'anonymous',
    text: 'Which medicine do you prefer? (Ultimately it will be a joint decision between you and one of our clinicians on whether a particular medicine is appropriate.)', type: 'single',
    options: prodList.slice().sort((a, b) => famOf(a).localeCompare(famOf(b)) || a.price - b.price).map(p => {
      const fam = famOf(p), isBundle = fam === 'p3' || fam === 'p4';
      const label = `${p.title.replace(/\s+/g, ' ')}${p.subtitle ? ', ' + p.subtitle : ''}, £${p.price}${p.out_of_stock ? ' [shown as "Out of stock"]' : ''}`;
      const wasWalked = Object.values(walkedSku).includes(p.sku);
      if (p.out_of_stock) return { label, effect: 'Shown with an "Out of stock" label on the day tested. Whether it can still be selected was not tested.', effectType: 'unknown', affects: [fam], evidence: 'unknown' };
      return {
        label,
        effect: (isBundle
          ? 'Creates a draft order for this bundle and loads the longer bundle questionnaire (extra age-band, scalp-skin and blood-pressure questions).'
          : 'Creates a draft order for this pack and loads the tablets-only questionnaire.') + (wasWalked ? ` Walked with sku ${p.sku}.` : ' Not walked for this exact pack: assumed to behave like the walked pack of the same kind.'),
        effectType: isBundle ? 'extra-questions' : 'next-question', affects: [fam], evidence: wasWalked ? 'observed' : 'inferred'
      };
    }),
    purpose: 'The patient, not an engine, chooses the medicine, brand and pack size before any medical question.', engineRole: 'product-selector', branches: true,
    branchDetail: 'Tablets-only packs load one questionnaire and Regaine bundles load another (ids 2049 / 2050 first-time, 2051 / 2052 returning). Featured packs are shown first; the rest (including every bundle that is available) sit behind "See more treatment options", which also has a search box. The site content also holds a "No-Choice" product entry (code HAI-F-No-Choice) that was not shown on screen.',
    shownWhen: 'always', evidence: 'observed'
  });
  Q.push({
    id: `${fid}-pre6`, order: ++o, stage: 'anonymous', text: 'Product page for the chosen pack: name, price, short description, and four fold-out sections: "Is it suitable for me?", "How to take it", "How it works", "What else should I know?"', type: 'info',
    options: [{ label: 'Continue', effect: 'Creates the draft order on the server (status "Not submitted") with this task list: Health Questions, ID Photos, Account-Setup, Delivery, Payment.', effectType: 'next-question', affects: [], evidence: 'observed' }],
    purpose: 'Shows who should not take the medicine before the questions start.', engineRole: 'expectation-setting', branches: false,
    branchDetail: '', shownWhen: 'always', evidence: 'observed'
  });
  Q.push({
    id: `${fid}-pre7`, order: ++o, stage: 'anonymous',
    text: "Important info: Just like a traditional consultation we're going to ask you about your medical history and symptoms. Your answers will help us assess your suitability for treatment. Please answer all questions honestly and in full. If you have any problems understanding or answering a question please call or message us.", type: 'consent',
    options: [{ label: 'I understand the important information above.', effect: 'Tick box. Continue stays disabled until it is ticked, then the health questions open.', effectType: 'next-question', affects: [], evidence: 'observed' }],
    purpose: 'Honesty statement before the medical questions.', engineRole: 'consent', branches: false, branchDetail: '', shownWhen: 'always', evidence: 'observed'
  });
  return { Q, o };
}

function quizQuestions(fid, def, startOrder, walkedBaseline) {
  const optInfo = {}; const childrenOf = {};
  def.sections.forEach(s => s.questions.forEach(q => (q.options || []).forEach(op => { optInfo[op.id] = { op, q }; })));
  def.sections.forEach(s => s.questions.forEach(q => { if (q.display_condition) q.display_condition.options.forEach(oid => { (childrenOf[oid] = childrenOf[oid] || []).push(q); }); }));
  const out = []; let o = startOrder; let n = 0;
  def.sections.forEach((s, si) => s.questions.forEach(q => {
    n++;
    const { role, purpose } = noteFor(q.text);
    const radio = q.type === 'gp_address' || q.max === 1;
    const allExcl = (q.options || []).every(op => op.exclusive);
    const type = q.options.length === 1 ? 'consent' : (radio || allExcl ? 'single' : 'multi');
    const kids = (q.options || []).flatMap(op => childrenOf[op.id] || []);
    const shownBaseline = walkedBaseline && (!q.display_condition || q.display_condition.options.some(oid => BASELINE.includes(optInfo[oid].op.text)));
    const options = q.options.map(op => {
      const ch = childrenOf[op.id] || [];
      const picked = shownBaseline && BASELINE.includes(op.text);
      let flag = '';
      if (op.status === 2) flag = 'Amber flag (status 2 in the quiz definition): marked for the clinician.';
      if (op.status === 3) flag = 'Red flag (status 3 in the quiz definition). The website does not stop the patient: the app ignores this field and shows the next screen. It is expected to mean "not suitable" on the clinician side: inferred, not tested.';
      const details = op.details ? (op.type === 'address' ? ' Opens a GP practice search box (a GP surgery name or postcode); not used in this research.' : ` Opens a free-text box ("${op.hint || 'details'}") that must be filled in before Next works.`) : '';
      const excl = !radio && !allExcl && op.exclusive ? ' Ticking it clears the other boxes.' : '';
      let effect, effectType, affects = [], evidence = picked ? 'observed' : 'code';
      if (/change my prescription to (Finasteride )?tablets/i.test(op.text)) {
        effect = 'Asks for Regaine to be dropped and tablets only to be prescribed. The website keeps the bundle on the order; the change is left to the clinician: inferred. ' + flag; effectType = 'product-switched'; affects = ['p3', 'p4', 'p1', 'p2']; evidence = 'inferred';
      } else if (ch.length) {
        effect = `Shows a follow-up question straight after this one (same step of the progress bar): "${ch.map(c => short(c.text, 90)).join('" and "')}".${flag ? ' ' + flag : ''}${details}${excl}`; effectType = 'extra-questions';
      } else if (op.status === 3) { effect = flag + details + excl; effectType = 'flag-for-clinician'; affects = ['p1', 'p2', 'p3', 'p4'].filter(p => fid.includes('bundle') ? true : (p === 'p1' || p === 'p2')); }
      else if (op.status === 2) { effect = flag + ' The website carries on to the next question.' + details + excl; effectType = 'flag-for-clinician'; }
      else { effect = 'No flag (status 0 in the quiz definition). Carries on to the next question.' + details + excl; effectType = 'next-question'; }
      return { label: op.text, effect: effect.trim(), effectType, affects, evidence };
    });
    let shownWhen = 'always';
    if (q.display_condition) {
      const ps = q.display_condition.options.map(oid => optInfo[oid]);
      shownWhen = `Only when "${short(ps[0].q.text, 70)}" is answered ${ps.map(p => '"' + p.op.text + '"').join(' or ')}`;
    }
    const extras = [];
    if (q.description) extras.push(`Helper text under the question: "${q.description}"`);
    if (!radio && allExcl && q.options.length > 1) extras.push('Drawn as tick boxes, but each choice clears the others, so it works as single choice.');
    if (q.max && q.max > 1) extras.push(`Up to ${q.max} options may be ticked.`);
    if (/Tick all that apply/.test(q.text) && q.max === 1) extras.push('The wording says "Tick all that apply" but only one option can be chosen (max 1).');
    out.push({
      id: `${fid}-q${n}`, order: ++o, stage: 'anonymous', text: q.text.replace(/\s*\n\s*/g, ' '), type, options, purpose, engineRole: role,
      branches: kids.length > 0,
      branchDetail: [kids.length ? `Follow-ups: ${[...new Set(kids.map(k => '"' + short(k.text, 70) + '"'))].join('; ')}.` : '', ...extras].filter(Boolean).join(' '),
      shownWhen, evidence: shownBaseline ? 'observed' : 'code',
      sourceRef: `questionnaire ${def.id}, screen ${si + 1} of ${def.sections.length}, question id ${q.id}`
    });
  }));
  return { out, o };
}

function postSteps(fid, startOrder, walked) {
  let o = startOrder; const Q = [];
  Q.push({
    id: `${fid}-post1`, order: ++o, stage: 'anonymous', text: "Let's confirm it's you. We need to verify your identity before we can prescribe. You'll be asked for: a selfie; a photo of your ID", type: 'photo',
    options: [{ label: 'Open camera', effect: 'Starts the selfie and photo-ID capture. NOT done in this research (photos are not allowed). This is where every walk stops.', effectType: 'unknown', affects: [], evidence: 'unknown' }],
    purpose: 'Identity check before prescribing ("Regulations require us to see who we\'re treating." in the order data). ID wording in the app parameters: driver\'s licence or passport, with full name, date of birth and face visible.',
    engineRole: 'identity', branches: false, branchDetail: '', shownWhen: 'always, straight after the last health question (task 2 of the order)', evidence: walked ? 'observed' : 'code'
  });
  Q.push({
    id: `${fid}-post2`, order: ++o, stage: 'after-account', text: 'Account-Setup (task name in the order; screen not reached). App parameter text: "CREATE ACCOUNT" with terms, privacy and marketing tick boxes.', type: 'contact', options: [],
    purpose: 'Real account: email, name, mobile number, address, password. Replaces the placeholder temporary user.', engineRole: 'identity', branches: false, branchDetail: '',
    shownWhen: 'after the ID photos (task 4 of the order)', evidence: 'code'
  });
  Q.push({
    id: `${fid}-post3`, order: ++o, stage: 'checkout', text: 'Delivery (task name in the order; screen not reached). App parameter title: "WOULD YOU LIKE TO PICK UP IN STORE (FASTEST)?"', type: 'single',
    options: [
      { label: 'Mail order one-time ("Ship to me just once")', effect: 'Free Royal Mail Tracked 48 delivery. Marked as the default option in the order data.', effectType: 'none', affects: [], evidence: 'code' },
      { label: 'Pharmacy pick-up ("I\'ll pick up at a local pharmacy")', effect: 'Collect from a Boots pharmacy (not Jersey or Guernsey), usually within 2 business hours of the prescription being written.', effectType: 'none', affects: [], evidence: 'code' }
    ],
    purpose: 'How the medicine is supplied. No subscription or automatic refill option is in the order data.', engineRole: 'data-capture', branches: false, branchDetail: '',
    shownWhen: 'after account set-up (task 5 of the order)', evidence: 'code'
  });
  Q.push({
    id: `${fid}-post4`, order: ++o, stage: 'checkout', text: 'Payment (task name in the order; screen not reached). App content: "Your Order", "If we don’t prescribe, we’ll refund you.", button "Place Order".', type: 'info', options: [],
    purpose: 'Card details. Placing the order sends the visit to a clinician ("Your order is being reviewed by a clinician … within 24 hours").', engineRole: 'data-capture', branches: false, branchDetail: '',
    shownWhen: 'last task of the order (task 6)', evidence: 'code'
  });
  return Q;
}

const DEFS = [
  { fid: 'men-first-tablets', name: 'Men, first time, tablets only (Finasteride or Propecia)', child: 'HAI-F', file: 'quiz-definition.json', prods: prodF, bundle: false, walked: true, run: 'runs/baseline-men (full walk to the ID photo screen)' },
  { fid: 'men-first-bundle', name: 'Men, first time, tablets + Regaine foam bundle', child: 'HAI-F', file: 'quiz-definition-combo-regaine.json', prods: prodF, bundle: true, walked: false, run: 'runs/c01-combo-regaine (walked to the first health question; questions read from the definition)' },
  { fid: 'men-returning-tablets', name: 'Men, returning, tablets only', child: 'HAI-R', file: 'quiz-definition-returning.json', prods: prodR, bundle: false, walked: false, run: 'runs/r01-returning (walked to the first health question; questions read from the definition)' },
  { fid: 'men-returning-bundle', name: 'Men, returning, tablets + Regaine foam bundle', child: 'HAI-R', file: 'quiz-definition-returning-combo-regaine.json', prods: prodR, bundle: true, walked: false, run: 'runs/c02-returning-combo (walked to the first health question; questions read from the definition)' }
];

const flows = DEFS.map(d => {
  const def = load(d.file);
  const pre = preSteps(d.fid, d.child, d.prods, def.id, d.bundle, d.walked);
  const quiz = quizQuestions(d.fid, def, pre.o, d.walked);
  const post = postSteps(d.fid, quiz.o, d.walked);
  const nQ = def.sections.reduce((a, s) => a + s.questions.length, 0);
  return {
    id: d.fid, name: d.name, audience: 'men', entryUrl: ENTRY,
    stagesSummary: `Postcode → birth gender → date of birth (site creates a placeholder temporary user) → first time or returning → patient picks medicine and pack → product page → honesty tick box → ${def.sections.length} health-question screens (${nQ} questions with follow-ups; questionnaire ${def.id}) → ID photos (selfie + photo ID: research stops here) → account set-up → delivery or pick-up → payment → clinician review within 24 hours.`,
    childService: d.child, questionnaireId: def.id, questionnaireName: def.name, definitionFile: d.file, proofRun: d.run,
    questions: [...pre.Q, ...quiz.out, ...post]
  };
});

/* ---------- rules found so far (from code and the map walks; stage 2 should test them) ---------- */
const rules = [
  { id: 'R1', flow: 'men-first-tablets', when: 'Birth gender = "Female"', then: 'The preflight refuses: the hair-loss service is configured for male only. There is no women\'s hair-loss service.', effectType: 'hard-stop', affects: ['p1', 'p2', 'p3', 'p4'], evidence: 'code', proof: 'raw/api-products-categories.json (HAI genders ["male"]); message text in raw/js main bundle (invalidGender)', confidence: 'medium' },
  { id: 'R2', flow: 'men-first-tablets', when: 'Date of birth gives an age under 18 (service min age 18, max 120)', then: 'The server eligibility check should refuse the date of birth; under 16 is refused in the browser.', effectType: 'hard-stop', affects: ['p1', 'p2', 'p3', 'p4'], evidence: 'code', proof: 'raw/api-products-categories.json (min_age 18, max_age 120); raw/preflight-ctrl-snippet.js', confidence: 'medium' },
  { id: 'R3', flow: 'men-first-tablets', when: 'Product chosen is tablets only vs a Regaine bundle', then: 'Tablets only loads questionnaire 2049 (35 questions); a Regaine bundle loads questionnaire 2050 (38 questions) with age-band, scalp-skin and blood-pressure questions.', effectType: 'extra-questions', affects: ['p3', 'p4'], evidence: 'observed', proof: 'runs/baseline-men (sku 25-9 → questionnaires/2049) vs runs/c01-combo-regaine (sku 817-9 → questionnaires/2050)', confidence: 'high' },
  { id: 'R4', flow: 'men-returning-tablets', when: '"Have you used this service before?" = "Returning for this service"', then: 'Child service HAI-R: every pack size is available and questionnaires 2051 (tablets) / 2052 (bundle) are used; they add "…depression, suicidal thoughts and sexual dysfunction can occur. Do you think any of these have happened to you?" for men already on finasteride.', effectType: 'extra-questions', affects: ['p1', 'p2', 'p3', 'p4'], evidence: 'observed', proof: 'runs/r01-returning (questionnaires/2051) and runs/c02-returning-combo (questionnaires/2052) vs runs/baseline-men', confidence: 'high' },
  { id: 'R5', flow: 'men-first-tablets', when: '"Have you used this service before?" = "First time using this service"', then: 'Only one-month packs (28 tablets, or 28 tablets + 1 Regaine) could be chosen on the day tested; all larger packs showed "Out of stock". Returning patients saw every pack available. This looks like a first-supply limit done through stock flags: inferred.', effectType: 'product-removed', affects: ['p1', 'p2', 'p3', 'p4'], evidence: 'observed', proof: 'runs/w04 (categories/HAI-F/products) vs runs/r01-returning (categories/HAI-R/products)', confidence: 'low' },
  { id: 'R6', flow: 'men-first-tablets', when: 'Any option carrying status 3 in the definition (for example smooth circular patches, complete baldness, painful or pus-filled scalp, treatment not effective, partner trying to conceive, suicidal thoughts, galactose intolerance, or any "I will stop my consultation" choice)', then: 'The website does not block: the app code never reads the status field, so Next still works. The red flag travels with the answers to the clinician side. Refusal is the expected outcome but is not visible without an account.', effectType: 'flag-for-clinician', affects: ['p1', 'p2'], evidence: 'code', proof: 'quiz-definition.json (option status values) and raw/questionnaire-ctrl-snippet.js (next-question logic has no status check)', confidence: 'medium' },
  { id: 'R7', flow: 'men-first-bundle', when: 'Bundle: taking blood-pressure medicine = "Yes", or age band = "50 years or older"', then: 'A follow-up offers to drop Regaine and keep tablets only (amber flag). Answering "No" to dropping Regaine when on blood-pressure medicine is a red flag. "High blood pressure (hypertension)" as a condition is also a red flag in bundles.', effectType: 'product-switched', affects: ['p3', 'p4'], evidence: 'code', proof: 'quiz-definition-combo-regaine.json (questions on age band and blood-pressure medicine)', confidence: 'medium' },
  { id: 'R8', flow: 'men-first-tablets', when: 'All health questions answered (any answers)', then: 'Answers are posted once, at the end. The Health Questions task becomes status 3 and the order admin_status becomes 4.1; the next task is ID Photos, then Account-Setup, Delivery, Payment. No recommendation or result screen is shown.', effectType: 'next-question', affects: [], evidence: 'observed', proof: 'runs/baseline-men (net/26-…orders… before, net/89-…orders… after; screen 64)', confidence: 'high' }
];

const company = {
  slug: 'boots-online-doctor', company: 'Boots Online Doctor', market: 'UK', website: SITE + '/',
  parent: 'Boots UK (provider: Boots Digital Health Ltd, CQC registered; runs on the Lemonaid Health UK platform)',
  audiences: ['men'],
  model: 'High-street pharmacy\'s online doctor: a men-only questionnaire for licensed finasteride or Propecia tablets (optionally bundled with Regaine foam), reviewed by a clinician, sold as one-off packs with store pick-up or free delivery.',
  checkedOn: '2026-11-23',
  access: {
    howTested: ['live-walk', 'site-code', 'public-docs'],
    accountWall: 'After the health questions. Nothing asks for an email before that: after postcode, birth gender and date of birth the site itself creates a placeholder "temporary user" (POST users/temp). The first screen we could not pass is the ID photo step at /camera/id ("Let\'s confirm it\'s you": a selfie and a photo of your ID), which comes straight after the last health question. Account set-up (email, name, phone, address, password) is the next task after the photos, then delivery and payment. No recommendation is shown before the wall: the patient has already picked the medicine.',
    blockers: [
      'ID photos (selfie + photo ID) are required before account set-up; photos are outside the research rules, so nothing after the health questions was seen.',
      'curl to the marketing site was blocked by the Imperva/Incapsula bot protection after about five quick requests; the normal browser (walk.js) was not blocked. Nothing was done to get round it.'
    ],
    coverageNote: 'Walked live with the baseline man from the entry page to the ID photo screen for the first-time, tablets-only route (all 19 question screens). The three other routes (first-time bundle, returning tablets, returning bundle) were walked to their first health question, which made the site serve their full question sets; those questions are recorded from the served definitions, not clicked through. All four definitions are saved. No account, email, name, phone, address, password, photo or payment was entered. A postcode had to be typed to start: the placeholder postcode found in the site\'s own code (N1 0QH) was used; it is a location check, not a contact detail. There is no women\'s hair-loss consultation to walk.'
  },
  entryPoints: [
    { from: SITE + '/propecia-online', label: 'GET STARTED / get started (three buttons)', to: ENTRY, note: 'Main hair-loss service page ("Hair loss" in the Men\'s health menu; the same link also sits in the Women\'s health menu markup).' },
    { from: SITE + '/services/hair-loss', label: 'GET STARTED / get started', to: ENTRY, note: 'Duplicate service page.' },
    { from: SITE + '/propecia-online-important-info and /propecia-online-helpful-info', label: 'GET STARTED', to: ENTRY, note: 'Information pages.' },
    { from: SITE + '/treatments/finasteride', label: 'View Our Full Range Of Hair Loss Treatment', to: SITE + '/propecia-online', note: 'Treatment-library page; links to the service page, not straight to the consultation.' },
    { from: ENTRY, label: 'Inside the consultation: "First time using this service" or "Returning for this service", then the pack chosen', to: ENTRY, note: 'One URL, four routes: HAI-F or HAI-R, each with a tablets-only or a Regaine-bundle questionnaire. There are no product-specific start links on the public pages.' }
  ],
  products, flows, rules,
  experiments: [],
  recommendations: [
    { profile: 'Man, 32, temples and crown, gradual, no medical issues, first time (baseline)', offered: ['p1', 'p2', 'p3', 'p4'], default: null, note: 'There is no recommendation screen. The patient is shown all four product lines and picks one (and a pack size) before any medical question. The baseline picked Finasteride 1mg, 28 tablets, £28 and reached the ID photo step with no warning. Final say is the clinician\'s, after payment details are given.', evidence: 'observed' }
  ],
  engineSummary: 'There is no product-recommending engine. Three eligibility gates come first (postcode, birth sex male, age 18+). The patient then says first-time or returning and picks the medicine, brand and pack size himself. That choice selects one of four fixed questionnaires (tablets only or Regaine bundle, first-time or returning). Each questionnaire is a linear list of screens with simple one-level follow-ups (a follow-up appears when a given option is chosen). Every option carries a status of 0, 2 or 3 in the served definition. The website does not act on these: it never blocks, even on "I will stop my consultation" answers. Answers are sent once at the end and a clinician decides after ID photos, account and payment details. In bundles, the questions can steer the order back to tablets only (age 50+, blood-pressure medicine).',
  strengths: [
    'Trusted pharmacy brand, CQC-registered provider, named clinical lead, pick-up in any Boots store within about 2 business hours of approval.',
    'Licensed medicines only; clear safety wording (pregnancy, PSA tests, depression and sexual side effects) repeated as must-acknowledge screens.',
    'No email needed until after the questions; pay only if approved; no subscription lock-in.',
    'Bundle questionnaire handles Regaine limits (age 49 licence limit, blood pressure, scalp skin).'
  ],
  weaknesses: [
    'Men only; nothing for women\'s hair loss.',
    'Very narrow range: finasteride 1 mg tablets with or without Regaine foam. No topical finasteride, oral minoxidil, dutasteride, compounded sprays, shampoos or supplements.',
    'The patient must choose medicine and pack before answering anything; no guidance or recommendation.',
    'No photos of the scalp are asked for; pattern is one four-option question with wording errors ("Tick all that apply" on a single-choice question).',
    'Red-flag answers do not stop the flow on screen; the patient can go on to ID photos and payment details and only then be refused.',
    'First-time list showed most packs as "Out of stock"; ID photo step adds friction; dated copy (pages last reviewed 2021 and 2023, placeholder text left in the content data).'
  ],
  opportunities: [
    'A guided recommendation (pattern, goals, preferences) instead of a price list.',
    'Options for men who cannot or will not take oral finasteride, and a women\'s pathway.',
    'Immediate, kind on-screen outcomes for red-flag answers with signposting, instead of late refusal.',
    'Scalp photo review and progress tracking; subscription convenience with easy pause.'
  ],
  sources: [
    { title: 'Hair loss service page (prices in structured data)', url: SITE + '/propecia-online' },
    { title: 'Hair loss treatment facts (important info)', url: SITE + '/propecia-online-important-info' },
    { title: 'Hair loss: what you need to know (helpful info)', url: SITE + '/propecia-online-helpful-info' },
    { title: 'Finasteride treatment-library page', url: SITE + '/treatments/finasteride' },
    { title: 'Duplicate service page', url: SITE + '/services/hair-loss' },
    { title: 'Consultation entry', url: ENTRY },
    { title: 'FAQ', url: SITE + '/faq' },
    { title: 'Pick up and delivery', url: SITE + '/pick-up-and-delivery' },
    { title: 'Patient guide', url: SITE + '/patient-guide' },
    { title: 'Off-label medicines', url: SITE + '/off-label-medicines' },
    { title: 'Terms and conditions (not read in this stage)', url: SITE + '/terms-and-conditions' },
    { title: 'Finasteride patient leaflet linked from the questionnaire', url: 'https://www.medicines.org.uk/emc/files/pil.7068.pdf' },
    { title: 'Served API: service list with ages, sexes and questionnaire ids (saved copy raw/api-products-categories.json)', url: 'https://prod-api.lemonaidpims.co.uk/v2.0/products/categories' },
    { title: 'Served API: hair-loss content (saved copy raw/api-content-web-categories-HAI.json)', url: 'https://prod-api.lemonaidpims.co.uk/v2.0/content/web/categories/HAI' },
    { title: 'Served API: first-time products (saved copy raw/api-categories-HAI-F-products.json)', url: 'https://prod-api.lemonaidpims.co.uk/v2.0/categories/HAI-F/products' }
  ],
  limitations: [
    'The meaning of option status 2 (amber) and 3 (red) is inferred from which answers carry them; the site never shows it. What the clinician or server does with them cannot be seen without an account.',
    'Nothing after the health questions was seen live (ID photos, account, delivery, payment, clinician messages, refusals). Those steps are described from the order task list and app parameters only.',
    'Only one full click-through was done (first-time, tablets only). The other three question sets come from the served definitions; their screens were not clicked through.',
    'Propecia packs and the Propecia bundle were not walked; they are assumed to use the same questionnaires as the finasteride packs.',
    'Under-18, over-65, female and unsupported-postcode behaviour was read in the code, not tested.',
    'Stock flags and prices are as served on 2026-11-23 and may change. The Regaine strength is not stated on the site.',
    'A postcode had to be entered to begin (the site\'s own placeholder N1 0QH was used). If the project owner counts a postcode as an address, treat every live walk here as outside the rules and rely on the served definitions only.'
  ]
};

fs.writeFileSync(path.join(dir, 'company.json'), JSON.stringify(company, null, 1));
const nq = flows.reduce((a, f) => a + f.questions.length, 0), no = flows.reduce((a, f) => a + f.questions.reduce((b, q) => b + q.options.length, 0), 0);
console.log(`wrote company.json: ${products.length} products, ${flows.length} flows, ${nq} questions, ${no} options, ${rules.length} rules`);
flows.forEach(f => { const un = f.questions.filter(q => q.purpose === 'Not classified.'); if (un.length) console.log('UNCLASSIFIED in', f.id, un.map(q => q.text.slice(0, 60))); });
