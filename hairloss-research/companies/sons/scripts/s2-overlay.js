// Stage 2 (EXPERIMENT) overlay for companies/sons/company.json.
// build-company.js writes the stage 1 map and then calls this file, which adds what the one-change experiments found:
// experiments[], rules[], recommendations[], per-option effects, per-product "recommendedWhen", and the summary lists.
// Live facts are read from the run folders (runs/exp-NN, written by walk.js) so the text cannot drift from the evidence.
// Product effects come from running the site's own code offline (runs/offline/results.json, written by s2-offline.js).
// usage: node scripts/build-company.js        (or: node scripts/s2-overlay.js to re-apply to the current company.json)
const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const { diff, sequence } = require('./s2-screens.js');
const d = J('company.json');
const OFF = J('runs/offline/results.json');
const TT = J('runs/offline/truthtable.json');
const XP = J('scripts/s2-experiments.json');
const X2 = fs.existsSync(path.join(ROOT, 'scripts/s2-experiments-extra.json')) ? J('scripts/s2-experiments-extra.json') : [];
const men = d.flows.find(f => f.id === 'men');
const flow = id => d.flows.find(f => f.id === id);
const q = id => d.flows.flatMap(f => f.questions).find(x => x.id === id);
const opt = (qid, start) => { const o = q(qid).options.find(o => o.label.startsWith(start)); if (!o) throw new Error('no option ' + qid + ' ' + start); return o; };
const set = (qid, start, patch) => Object.assign(opt(qid, start), patch);
const BASE = 's2-baseline-men';
const hasRun = id => fs.existsSync(path.join(ROOT, 'runs', id, '00.txt'));
const rd = id => path.join(ROOT, 'runs', id);

// ---------------------------------------------------------------- names
const H = {
  'topical-finasteride-minoxidil-spray': ['p-combospray', 'Combination Spray'], 'the-duo-plan': ['p-core', 'Core Plan (tablet + minoxidil spray)'],
  'oral-duo-plan': ['p-core-cap', 'Core Plan - Capsule (tablet + minoxidil capsule)'], 'hair-loss-spray-hair-loss-capsule': ['p-topfin-oralmin', 'Topical Finasteride & Oral Minoxidil'],
  'ultimate-hair-loss-plan': ['p-ultimate', 'Ultimate Plan'], 'ultimate-hair-loss-plan-capsule': ['p-ultimate-cap', 'Ultimate Plan - Capsule'],
  minoxidil: ['p-min', 'Minoxidil Spray'], 'oral-minoxidil': ['p-oralmin', 'Oral Minoxidil'], 'topical-hair-loss-spray': ['p-topfin', 'Topical Finasteride'],
  finasteride: ['p-fin', 'Finasteride tablets'], 'the-non-prescription-plan': ['p-nonrx', 'Non-Prescription plan'], 'hair-growth-complex': ['p-hgc', 'Hair Growth Complex'],
  'dutasteride-combination-spray': ['p-dutaspray', 'Dutasteride Combination Spray'], 'combination-capsule': ['p-combocap', 'Combination Capsule'],
};
const nm = h => (H[h] || [null, h])[1]; const pid = h => (H[h] || [null])[0];
const card = c => c.split(' (toggle: ').map(s => nm(s.replace(')', ''))).join(' / ');
const list = hs => hs.map(nm).join(', ');
const sameSet = (a, b) => a.length === b.length && a.every(x => b.includes(x));

// ---------------------------------------------------------------- what the site code does with one change
function codeText(offId) {
  const r = OFF[offId], b = OFF[r.compare];
  const remO = b.older.offered.filter(h => !r.older.offered.includes(h)), remN = b.newer.offered.filter(h => !r.newer.offered.includes(h));
  const addO = r.older.offered.filter(h => !b.older.offered.includes(h)), addN = r.newer.offered.filter(h => !b.newer.offered.includes(h));
  const first = 'First card: ' + r.older.primary.map(card).join(' and ') + ' (older copy); ' + r.newer.primary.map(card).join(' and ') + ' (newer copy).';
  const unchanged = !remO.length && !remN.length && !addO.length && !addN.length;
  if (unchanged && JSON.stringify(r.older.primary) === JSON.stringify(b.older.primary) && JSON.stringify(r.newer.primary) === JSON.stringify(b.newer.primary))
    return 'Site code run offline (' + offId + '): no change in either copy. Same plans, same first card' + (r.compare !== 'off-00' ? ' as ' + r.compare : ' as the baseline man') + '.';
  if (unchanged) return 'Site code run offline (' + offId + '): same set of plans, different order. ' + first;
  let t = 'Site code run offline (' + offId + '): ';
  if (sameSet(remO, remN) && remO.length) t += 'both copies take out ' + list(remO) + '. ';
  else { if (remO.length) t += 'older copy takes out ' + list(remO) + '. '; if (remN.length) t += 'Newer copy takes out ' + list(remN) + '. '; }
  if (addN.length || addO.length) t += (addO.length ? 'Older copy adds ' + list(addO) + '. ' : 'Older copy adds nothing. ') + (addN.length ? 'Newer copy adds ' + list(addN) + '. ' : '');
  t += 'Left on offer (older copy): ' + list(r.older.offered) + '. ' + first;
  return t;
}
function liveText(id, cmp) {
  const r = diff(rd(id), rd(cmp)); const where = cmp === BASE ? 'the baseline replay' : cmp;
  let t = 'Live (runs/' + id + ' against ' + (cmp === BASE ? 'runs/' + BASE : 'runs/' + cmp) + '): ';
  if (!r.added.length && !r.removed.length) t += 'the same ' + r.screens + ' screens as ' + where + ', none added, removed or reworded. ';
  else t += r.screens + ' screens against ' + r.compareScreens + '. ' + (r.added.length ? 'Added: ' + r.added.map(s => '"' + s + '"').join('; ') + '. ' : '') + (r.removed.length ? 'Missing: ' + r.removed.map(s => '"' + s + '"').join('; ') + '. ' : '');
  t += /preparing your personalised health plan/.test(r.last.title) ? 'Ended on the account form. No stop screen, no warning, no plan and no price were shown.' : 'Last screen: "' + r.last.title.slice(0, 140) + '".';
  return t;
}

// ---------------------------------------------------------------- experiments
const LIVE = {
  'exp-01': { manual: 'Live (runs/exp-01): choosing Yes cleared the questionnaire and sent the browser to the sign-in page sons.co.uk/account/login?return_url=/pages/consultation-hair (email and password boxes). That is an account wall at question 1; nothing was typed.' },
  'exp-02': { manual: 'Live (runs/exp-02; the same walk as baseline-women.json, replayed as runs/s2-baseline-women): stop screen at question 2. Text: "Sons products are formulated for those born male and we do not currently provide treatment for those who were born female. Whilst some of these treatments may be suitable for those born female, we would recommend a face to face consultation with a hair loss specialist or GP…". One button, "Finish Consultation". No further question, product or price.' },
  'exp-03': { manual: null },
  'exp-04': { off: 'off-01' }, 'exp-05': { off: 'off-02' }, 'exp-06': { off: 'off-03' },
  'exp-07': { off: 'off-04' }, 'exp-08': { off: 'off-05', cmp: 'exp-07' }, 'exp-09': { off: 'off-06', cmp: 'exp-07' }, 'exp-10': { off: 'off-07', cmp: 'exp-07' },
  'exp-11': { off: 'off-08' }, 'exp-12': { off: 'off-11', cmp: 'exp-11' }, 'exp-13': { off: 'off-14', cmp: 'exp-11' },
  'exp-14': { off: 'off-15' }, 'exp-15': { off: 'off-16', cmp: 'exp-14' }, 'exp-16': { off: 'off-17' }, 'exp-17': { off: 'off-18', cmp: 'exp-16' },
  'exp-18': { off: 'off-19' }, 'exp-19': { off: 'off-20', cmp: 'exp-18' }, 'exp-20': { off: 'off-21' }, 'exp-21': { off: 'off-22' },
  'exp-22': { off: 'off-23' }, 'exp-23': { off: 'off-24' }, 'exp-24': { off: 'off-25' }, 'exp-25': { off: 'off-26' }, 'exp-26': { off: 'off-27' },
  'exp-27': { off: 'off-28' }, 'exp-28': { off: 'off-29' }, 'exp-29': { off: 'off-30' }, 'exp-30': { off: 'off-31' },
  'exp-31': { off: 'off-32', cmp: 'exp-27' }, 'exp-32': { off: 'off-33', cmp: 'exp-27' }, 'exp-33': { off: 'off-55', cmp: 'exp-27' }, 'exp-34': { off: 'off-56', cmp: 'exp-27' },
  'exp-35': { manual: null }, 'exp-36': { off: 'off-57', manual: null }, 'exp-37': { off: 'off-58', manual: null },
};
const MANUAL = fs.existsSync(path.join(ROOT, 'scripts/s2-manual-results.json')) ? J('scripts/s2-manual-results.json') : {};
const experiments = [];
const missing = [];
XP.concat(X2).forEach(x => {
  if (!hasRun(x.id)) { missing.push(x.id); return; }
  const L = LIVE[x.id] || {}; const man = MANUAL[x.id] || L.manual;
  let result = man || liveText(x.id, L.cmp || BASE);
  if (L.off) result += ' ' + codeText(L.off);
  if (x.neutral) result += ' Neutral answers used: ' + x.neutral;
  experiments.push({ id: x.id, flow: x.flow || 'men', changed: x.changed, result, run: 'runs/' + x.id, kind: 'live replay' + (L.off ? ' + site code run offline (' + L.off + ')' : '') });
});
// offline-only experiments (no live twin possible: the answer has no visible effect before the wall, or it is not a consultation answer)
const liveTwins = new Set(Object.values(LIVE).map(l => l.off).filter(Boolean));
Object.values(OFF).forEach(r => {
  if (r.id === 'off-00' || liveTwins.has(r.id)) return;
  experiments.push({ id: r.id, flow: 'men', changed: (r.compare !== 'off-00' ? '(on top of ' + r.compare + ') ' : '') + r.changed, result: 'NOT a live replay. ' + codeText(r.id) + ' Evidence type: code.', run: 'runs/offline/results.json', kind: 'site code run offline' });
});
d.experiments = experiments;

// ---------------------------------------------------------------- option effects (men)
const LEFT = id => list(OFF[id].older.offered);
const FIRST = id => 'First card after the wall: ' + OFF[id].older.primary.map(card).join(' and ') + ' in the older copy, ' + OFF[id].newer.primary.map(card).join(' and ') + ' in the newer copy.';
const out = id => { const b = OFF[OFF[id].compare]; return list(b.older.offered.filter(h => !OFF[id].older.offered.includes(h))); };
const prodEffect = (id, exp, extra) => 'Before the wall: ' + extra + ' (seen live, runs/' + exp + '). After the wall the served code takes out ' + out(id) + '. Left on offer: ' + LEFT(id) + '. ' + FIRST(id) + ' (Site code run offline, ' + id + '; both copies agree. Not seen live.)';

set('men-q01', 'Yes', { effect: 'The questionnaire is cleared and the browser goes to sons.co.uk/account/login?return_url=/pages/consultation-hair. Account wall straight away (seen live, runs/exp-01).' });
set('men-q02', 'Female', { effect: 'Hard stop (seen live, runs/exp-02). Shows the notice "Sons products are formulated for those born male…" with one button, "Finish Consultation". The app code then shows "Unfortunately you are ineligible for prescription based products. Redirecting to the home page." and sends nothing to the server.' });
set('men-q03', 'I accept', { effect: 'Required tick. Left unticked, Continue stays on the same screen (seen live, runs/exp-03). No effect on what is offered.' });
[['Temples only', 'off-01', 'exp-04', 'Typical male pattern.'], ['Temples/Crown', 'off-00', BASE, 'Typical male pattern (the baseline answer).'],
  ['Random patches', 'off-02', 'exp-05', 'Patchy loss normally points away from male-pattern loss (for example alopecia areata), yet nothing changes.'],
  ['Completely bald', 'off-03', 'exp-06', 'Medicines do little for a fully bald scalp, yet the same plans are offered. The app code still names an old stop screen, "extensive-loss-notice-viewed", that the current questionnaire no longer contains.']]
  .forEach(([s, off, exp, why]) => set('men-q04', s, { effect: 'No effect found. Live: the same screens follow whichever picture is chosen, with no warning or stop (runs/' + exp + '). Site code run offline (' + off + '): same plans and same first card as the baseline man in both copies; no served code reads this answer. It is stored for the prescriber, whose use of it is unknown. ' + why, effectType: 'none', evidence: 'code' }));
set('men-q05', 'Suddenly', { effect: prodEffect('off-04', 'exp-07', 'adds three yes/no screens (body hair, new medicines, other symptoms); no stop and no advice to see a doctor'), effectType: 'product-removed', evidence: 'code' });
[['men-q06', 'exp-08', 'off-05'], ['men-q07', 'exp-09', 'off-06'], ['men-q08', 'exp-10', 'off-07']].forEach(([id, exp, off]) => {
  set(id, 'Yes', { effect: 'No effect found. Live: no screen added or reworded compared with answering No (runs/' + exp + ' against runs/exp-07). Site code run offline (' + off + '): same result as Suddenly with No. No served code reads this answer; it is stored for the prescriber, whose use of it is unknown.', effectType: 'none', evidence: 'code' });
  set(id, 'No', { effect: 'No effect found (same as Yes: runs/exp-07 and ' + off + '). Stored for the prescriber.', effectType: 'none', evidence: 'code' });
});
set('men-q09', 'Yes', { effect: 'Adds three screens: a required free-text box and two "over the past two weeks" questions (seen live, runs/exp-11). On its own it removes nothing: with both follow-ups at "Not at all" the offline run (off-08) gives the same plans as the baseline man. The line that would block finasteride for a plain Yes is commented out in the served code.', effectType: 'extra-questions', evidence: 'observed' });
['men-q11', 'men-q12'].forEach((id, i) => {
  const offs = i === 0 ? ['off-08', 'off-09', 'off-10', 'off-11'] : ['off-08', 'off-12', 'off-13', 'off-14'];
  set(id, 'Not at all', { effect: 'No product change (' + offs[0] + ').', effectType: 'none', evidence: 'code' });
  set(id, 'Several days', { effect: 'No product change: same plans as "Not at all" (' + offs[1] + ').', effectType: 'none', evidence: 'code' });
  set(id, 'More than half the days', { effect: 'Served code takes out every finasteride product: ' + out(offs[2]) + '. Left on offer: ' + LEFT(offs[2]) + '. ' + FIRST(offs[2]) + ' (Site code run offline, ' + offs[2] + '; a score of 2 or 3 on EITHER question is enough. Not seen live.)', effectType: 'product-removed', evidence: 'code' });
  set(id, 'Nearly every day', { effect: 'Before the wall nothing happens: no extra screen, no message, no signposting to help (seen live, runs/' + (i === 0 ? 'exp-12' : 'exp-13') + ' against runs/exp-11). After the wall the served code takes out every finasteride product, exactly as for "More than half the days". Left on offer: ' + LEFT(offs[3]) + '. (' + offs[3] + ')', effectType: 'product-removed', evidence: 'code' });
});
[['Finasteride or Propecia', 'exp-14', 'off-15'], ['Minoxidil or Regaine', 'exp-16', 'off-17'], ['Topical Finasteride Minoxidil Combination', 'exp-18', 'off-19']].forEach(([s, exp, off]) =>
  set('men-q13', s, { effect: 'Adds one screen, "Have you experienced any adverse effects?", shown after the format question (seen live, runs/' + exp + '). Ticking it changes no product by itself (' + off + ').', effectType: 'extra-questions', evidence: 'observed' }));
set('men-q14', 'Topical sprays', { effect: 'Order only; nothing is added or removed, and no screen changes (seen live, runs/exp-20). Older copy: the Core Plan card opens on its spray version, next to the Combination Spray. Newer copy: no visible change at the top, the Combination Spray is first either way. (off-21)', effectType: 'product-switched', evidence: 'code' });
set('men-q14', 'Oral capsule', { effect: 'Order only; no screen changes (seen live, runs/exp-21). Older copy: the Core Plan card opens on its capsule version (finasteride tablet + oral minoxidil capsule), next to the Combination Spray. Identical to "I don’t mind" (off-22 gives the same result as off-00).', effectType: 'product-switched', evidence: 'code' });
set('men-q14', 'I don’t mind', { effect: 'Treated exactly like "Oral capsule": the code only tests for the Topical answer. So a man with no preference is shown the capsule version of the Core Plan first in the older copy (off-00).', effectType: 'product-switched', evidence: 'code' });
set('men-q15', 'Yes', { effect: prodEffect('off-16', 'exp-15', 'adds one optional free-text box'), effectType: 'product-removed', evidence: 'code' });
set('men-q17', 'Yes', { effect: prodEffect('off-18', 'exp-17', 'adds one optional free-text box'), effectType: 'product-removed', evidence: 'code' });
set('men-q19', 'Yes', { effect: prodEffect('off-20', 'exp-19', 'adds one optional free-text box'), effectType: 'product-removed', evidence: 'code' });
['men-q15', 'men-q17', 'men-q19'].forEach((id, i) => set(id, 'No', { effect: 'No product change and no extra screen (seen live, runs/' + ['exp-14', 'exp-16', 'exp-18'][i] + '; site code ' + ['off-15', 'off-17', 'off-19'][i] + ').', effectType: 'none', evidence: 'code' }));
const CONDX = [['High Blood Pressure', 'an optional free-text box'], ['Cardiovascular Disease', 'a required free-text box'], ['Severe Kidney or Liver Disease', 'a required free-text box'],
  ['Prostate Disease', 'a required free-text box'], ['Rheumatoid Arthritis', 'a required free-text box'], ['Scalp Disorders', 'four screens: a required free-text box and three optional tick-box screens (scalp symptoms, treatments tried, red flags)'],
  ['Phaeochromocytoma', 'a required free-text box'], ['Diagnosed Lactose Allergy', 'a required free-text box whose wording says the oral treatments hold only minute amounts of lactose'], ['Sexual Dysfunction', 'a required free-text box']];
const CONDNOTE = {
  0: ' Topical minoxidil goes too, not only the capsule. There is no question about whether the blood pressure is controlled.',
  1: ' Same effect as High Blood Pressure.',
  5: ' The engine steers a man with a scalp disorder to tablets and capsules: the first card is finasteride tablet plus oral minoxidil capsule.',
  6: ' Only the capsule form of minoxidil is lost.',
  7: ' Only the two oral products are lost (their fillers contain lactose); every spray stays.',
};
CONDX.forEach(([s, adds], i) => set('men-q21', s, { effect: prodEffect('off-' + (23 + i), 'exp-' + (22 + i), 'adds ' + adds + '; no stop') + (CONDNOTE[i] || ''), effectType: 'product-removed', evidence: 'code' }));
const scalpNote = { 'men-q28': ['exp-33', 'off-55', 'Previously diagnosed with seborrheic dermatitis'], 'men-q29': ['exp-34', 'off-56', 'Prescription scalp treatments'] };
Object.entries(scalpNote).forEach(([id, [exp, off, tested]]) => q(id).options.forEach(o => {
  o.effect = 'No effect found. Optional tick box; no served code reads it, so the plans shown are those for Scalp Disorders whatever is ticked. ' + (o.label === tested ? 'Tested live on its own: no screen added or reworded (runs/' + exp + ' against runs/exp-27); site code ' + off + ' gives the same result as off-28.' : 'Not replayed live on its own (the option "' + tested + '" was: runs/' + exp + '); offline, ticking every option on this screen changed nothing (' + (id === 'men-q28' ? 'off-34' : 'off-35') + ').') + ' Stored for the prescriber; likely there to support the ketoconazole shampoo add-on (inferred).';
  o.effectType = 'none'; o.evidence = 'code';
}));
set('men-q30', 'Open sores', { effect: 'No effect found, although this is a red flag. Live: no warning, no stop and no extra screen; the flow goes on to the finasteride statement and the account form (runs/exp-31 against runs/exp-27). Site code run offline (off-32): same plans as Scalp Disorders alone, so finasteride tablets and oral minoxidil capsules are still recommended. Stored for the prescriber, whose use of it is unknown.', effectType: 'none', evidence: 'code' });
set('men-q30', 'Severe scalp pain', { effect: 'No effect found, although this is a red flag. Live: no warning, no stop and no extra screen (runs/exp-32 against runs/exp-27). Site code run offline (off-33): same plans as Scalp Disorders alone. Stored for the prescriber, whose use of it is unknown.', effectType: 'none', evidence: 'code' });
set('men-q30', 'None of the above', { effect: 'No effect (the neutral answer used in runs/exp-27).', effectType: 'none', evidence: 'code' });
set('men-q37', 'I confirm', { effect: 'Required tick. Left unticked, Continue stays on the statement screen and the account form does not open (seen live, runs/exp-35). No effect on what is offered.' });
set('men-q38', 'NHS Summary Of Care', { effect: 'Optional. Clicking it opens a second tick box, "Do you consent to us accessing your NHS Summary Care Record … or requesting further information on your medical history from your GP?" with "I agree" (seen live, runs/exp-36). The account form is unchanged. No effect on the plans in the served code (off-57); it lets the prescriber look at the GP record.', effectType: 'flag-for-clinician', evidence: 'observed' });
set('men-q39', 'GP Consent', { effect: 'Optional. Clicking it opens "Do you consent to us sharing consultation information with your GP?" with "I agree"; agreeing adds five GP surgery boxes (name, address, town, county, postcode) to the account form (seen live, runs/exp-37). No effect on the plans in the served code (off-58).', effectType: 'extra-questions', evidence: 'observed' });
q('men-q38').evidence = 'observed'; q('men-q39').evidence = 'observed';
q('men-q04').branchDetail = 'No branch and no stop for any of the four pictures, including "Random patches" and "Completely bald": the same screens follow (runs/exp-04, exp-05, exp-06) and the served code gives the same plans (off-01 to off-03).';
q('men-q05').branchDetail = 'Suddenly adds three yes/no questions (body hair, new medicines, other symptoms) (runs/exp-07). Their answers add nothing further (runs/exp-08 to exp-10). After the wall, Suddenly removes every prescription product in the served code.';
q('men-q09').branchDetail = 'Yes adds a free-text box and two PHQ-2 style questions (runs/exp-11). Even "Nearly every day" on either adds no screen or message (runs/exp-12, exp-13); the effect (finasteride removed at a score of 2 or more) only shows after the wall.';
q('men-q13').branchDetail = 'Each ticked medicine adds its own "Have you experienced any adverse effects?" screen after the format question (runs/exp-14, exp-16, exp-18). Yes on that adds an optional text box (runs/exp-15, exp-17, exp-19).';
q('men-q14').branches = false; q('men-q14').branchDetail = 'No screen changes (runs/exp-20, exp-21). After the wall it only changes the order of the plan list.';
q('men-q21').branchDetail = 'Every ticked condition adds one free-text screen; Scalp Disorders adds four screens (runs/exp-22 to exp-30). No tick causes a stop or a warning: with all nine ticked the flow still reaches the account form (runs/all-branches-men). After the wall each tick switches off whole drug families.';
q('men-q30').purpose = 'Scalp red flags: open sores, broken skin, infection, severe pain, oozing. Ticking either red flag brings no warning, stop or extra screen (seen live, runs/exp-31 and exp-32), and no served code reads the answer.';
q('men-q03').purpose += ' The tick is enforced (runs/exp-03).';
q('men-q37').purpose = 'Required tick before the account form; enforced (runs/exp-35).';

// questions behind the wall: not tested; purpose from served code and public pages only
const wall = (id, patch) => Object.assign(q(id), patch);
wall('men-q42', { purpose: 'Recommendation screen ("<first name>\'s Hair Growth Recommendations": "Based on your responses in the consultation, our medical team recommend the following plan for you"). NOT TESTED (needs an account). From served code: one or two main plan cards, then "See more plans"; the list is built in the browser from the answers. From public pages: "Your prescriber will confirm which treatments are suitable for you as part of your consultation" (sons.co.uk/pages/hair-loss-medical).', evidence: 'code' });
q('men-q43').options.forEach(o => { o.effect = 'NOT TESTED (behind the account wall). From the product feed and served code: sets how many months are sent and billed up front; longer plans cost less per month (finasteride tablets: £29 for 1 month, £83 for 3, £136 for 6, £272 for 12). No clinical effect.'; o.effectType = 'marketing-only'; o.evidence = 'docs'; });
q('men-q43').purpose = 'Plan length = billing period, paid up front and renewed at the same interval. NOT TESTED; described from the public product feed and the shop app code.';
set('men-q45', 'I have read', { effect: 'NOT TESTED (behind the account wall). From the wording in the shop app\'s public text file: the customer must tick to accept that oral minoxidil is prescribed off-label for hair loss; the checkout shows "Please accept terms & conditions for this oral minoxidil product" if it is not ticked. Purpose inferred: informed consent for an unlicensed use.', effectType: 'next-question', evidence: 'code' });
set('men-q49', 'No changes', { effect: 'NOT TESTED (existing subscribers only). From the wording served in the shop app: confirms nothing has changed so the next order can be dispatched. Inferred: the renewal goes ahead without a new questionnaire.', effectType: 'next-question', evidence: 'inferred' });
set('men-q49', 'My health status has changed', { effect: 'NOT TESTED (existing subscribers only). From served code: reopens the questionnaire in health-check mode ("Submitting your health check to our prescriber"); if the server replies that eligibility changed, the customer is sent to a health-check page for that subscription. What changes there is unknown.', effectType: 'flag-for-clinician', evidence: 'code' });

// ---------------------------------------------------------------- other flows: effects read from the served definitions
const NOTSEEN = 'Read from the survey definition the page downloads; ';
const om = flow('oral-minoxidil-5mg');
if (om) {
  om.questions[0].options.forEach(o => { o.effect = 'No branch: the definition has no condition on this answer and no stop screen. The answer goes to the prescriber, who decides on the step-up; how each answer is weighed is unknown. Inferred purpose: the 5 mg page is aimed at men whose results on 2.5 mg have levelled off.'; o.effectType = 'flag-for-clinician'; o.evidence = 'code'; });
  om.questions[1].options.forEach(o => Object.assign(o, o.label === 'Yes' ? { effect: 'Opens a required free-text box about the side effects' + (hasRun('exp-43') ? ' (seen live, runs/exp-43)' : ' (' + NOTSEEN + 'visibleIf {5713} = Yes)') + '. No stop screen. Effect on approval unknown.', effectType: 'extra-questions', evidence: hasRun('exp-43') ? 'observed' : 'code' } : { effect: 'No extra box.', effectType: 'next-question', evidence: 'code' }));
  om.questions[3].options.forEach(o => Object.assign(o, o.label === 'Yes' ? { effect: 'Opens a required free-text box about what has changed (' + NOTSEEN + 'visibleIf {5715} = Yes). No stop screen. Effect on approval unknown.', effectType: 'extra-questions', evidence: 'code' } : { effect: 'No extra box.', effectType: 'next-question', evidence: 'code' }));
  om.questions[5].options.forEach(o => { o.effect = 'Required tick: the customer confirms he wants to go from 2.5 mg to 5 mg and will stop and seek advice if side effects appear. Sending the form needs a signed-in customer (not tested).'; o.effectType = 'next-question'; o.evidence = 'code'; });
}
const bd = flow('beard');
if (bd) {
  const B = (n, start, patch) => { const o = bd.questions[n - 1].options.find(o => o.label.startsWith(start)); if (o) Object.assign(o, patch); };
  const bl = hasRun('exp-38');
  B(1, 'Yes', { effect: 'Same handler as the hair flow: the questionnaire is cleared and the browser goes to the sign-in page, returning to the Beard Booster product page (served app code). Not replayed in the beard flow.', effectType: 'skip-questions', evidence: 'code' });
  B(1, 'No', { effect: 'Moves to the next question' + (bl ? ' (seen live, runs/exp-38).' : '.'), effectType: 'next-question', evidence: bl ? 'observed' : 'code' });
  B(2, 'Female', { effect: MANUAL['beard-female'] || 'Every later page is hidden (each has the condition gender = Male) and this definition has no notice page for women. Not replayed.', effectType: 'hard-stop', evidence: hasRun('exp-42') ? 'observed' : 'code' });
  B(2, 'Male', { effect: 'Moves to the declaration' + (bl ? ' (seen live, runs/exp-38).' : '.'), effectType: 'next-question', evidence: bl ? 'observed' : 'code' });
  B(3, 'I accept', { effect: 'Required tick.', effectType: 'next-question', evidence: bl ? 'observed' : 'code' });
  bd.questions[3].options.forEach(o => { o.effect = 'No branch and no stop for any of the four answers in the definition, including "New/sudden well-defined areas of beard loss" and "Inflamed/irritated skin with beard loss"' + (hasRun('exp-39') && o.label.startsWith('New/sudden') ? ' (seen live for this answer, runs/exp-39: the same screens follow)' : '') + '. Stored for the prescriber; effect on approval unknown. The app code still names an old notice, "Beard Booster Not Recommended", that this definition no longer contains.'; o.effectType = 'flag-for-clinician'; o.evidence = 'code'; });
  B(5, 'Yes', { effect: 'Opens a required free-text box about hair loss on the rest of the body (definition: visibleIf {5173} = 1). No stop.', effectType: 'extra-questions', evidence: 'code' });
  B(5, 'No', { effect: 'Moves on.', effectType: 'next-question', evidence: bl ? 'observed' : 'code' });
  B(7, 'Yes', { effect: 'Opens "Did you experience any side effects?" (definition: visibleIf {5175} = 1).', effectType: 'extra-questions', evidence: 'code' });
  B(7, 'No', { effect: 'Moves on.', effectType: 'next-question', evidence: bl ? 'observed' : 'code' });
  B(8, 'Yes', { effect: 'Opens a required free-text box about the side effects (definition: visibleIf {5176} = 1). No stop.', effectType: 'extra-questions', evidence: 'code' });
  B(8, 'No', { effect: 'Moves on.', effectType: 'next-question', evidence: 'code' });
  B(10, 'Yes', { effect: (hasRun('exp-40') ? 'Seen live (runs/exp-40): no stop, no warning and no extra screen; the flow carries on to the face-conditions question and the account form. ' : 'The definition has no stop or extra screen for Yes. ') + 'An allergy to an active ingredient of the only product on offer does not end the questionnaire; the decision is left to the prescriber (unknown).', effectType: 'flag-for-clinician', evidence: hasRun('exp-40') ? 'observed' : 'code' });
  B(10, 'No', { effect: 'Moves on.', effectType: 'next-question', evidence: bl ? 'observed' : 'code' });
  B(11, 'Psoriasis', { effect: 'Opens "Psoriasis, eczema and related skin conditions can be exacerbated with the use of topical minoxidil and tretinoin. Are you willing to proceed?"' + (hasRun('exp-41') ? ' (seen live, runs/exp-41)' : ' (definition: visibleIf {5179} = 0)') + '. The only place in any Sons flow where a risk is put to the patient as a question.', effectType: 'soft-warning', evidence: hasRun('exp-41') ? 'observed' : 'code' });
  B(11, 'Eczema', { effect: 'No extra screen in the definition: the "willing to proceed" question is tied to Psoriasis only, although its wording also names eczema. Stored for the prescriber.', effectType: 'flag-for-clinician', evidence: 'code' });
  B(11, 'Scalp/skin infections', { effect: 'No extra screen and no stop in the definition. Stored for the prescriber.', effectType: 'flag-for-clinician', evidence: 'code' });
  B(11, 'Any other', { effect: 'Opens a required free-text box about the face (definition: visibleIf {5179} = 3).', effectType: 'extra-questions', evidence: 'code' });
  B(11, 'None of these', { effect: 'Moves to the account form' + (bl ? ' (seen live, runs/exp-38).' : '.'), effectType: 'next-question', evidence: bl ? 'observed' : 'code' });
  B(12, 'Yes', { effect: 'Carries on to the account form' + (hasRun('exp-41') ? ' (seen live, runs/exp-41)' : '') + '. Stored for the prescriber.', effectType: 'next-question', evidence: hasRun('exp-41') ? 'observed' : 'code' });
  B(12, 'No', { effect: 'No stop screen in the definition: the flow still goes to the account form. What the prescriber does with a No is unknown. Not replayed.', effectType: 'flag-for-clinician', evidence: 'code' });
}
const cl = flow('clinic');
if (cl) cl.questions[0].options.forEach(o => { o.effect = 'Not opened. From the clinic record the page downloads: the record carries separate pre-procedure and post-procedure plan lists, so the answer and the procedure date pick which list the man sees after the standard questionnaire. Exact effect unknown.'; o.effectType = 'product-switched'; o.evidence = 'code'; });

// ---------------------------------------------------------------- rules
const CODEPROOF = 'runs/offline/results.txt (the site\'s own code run offline: recommendation-engine.excerpt.js lines 273-1140 and engine-newer.extract.js module 30216)';
const ALL_FIN = ['p-fin', 'p-topfin', 'p-combospray', 'p-core', 'p-core-cap', 'p-ultimate', 'p-ultimate-cap', 'p-topfin-oralmin', 'p-combocap', 'p-dutaspray'];
const ALL_MIN = ['p-min', 'p-oralmin', 'p-combospray', 'p-core', 'p-core-cap', 'p-ultimate', 'p-ultimate-cap', 'p-topfin-oralmin', 'p-nonrx', 'p-combocap', 'p-dutaspray'];
const pids = id => { const b = OFF[OFF[id].compare]; return [...new Set(b.older.offered.concat(b.newer.offered).filter(h => !OFF[id].older.offered.includes(h) || !OFF[id].newer.offered.includes(h)).map(pid))]; };
const rules = []; let rn = 0;
const R = (flowId, when, then, effectType, affects, evidence, proof, confidence) => rules.push({ id: 'R' + (++rn), flow: flowId, when, then, effectType, affects, evidence, proof, confidence });
// seen live
R('men', 'men-q02 gender at birth = "Female"', 'Hard stop at question 2: a notice says Sons does not treat people born female and suggests a hair-loss specialist or GP. No other question, product or price.', 'hard-stop', [], 'observed', 'runs/exp-02 and runs/s2-baseline-women vs runs/s2-baseline-men', 'high');
R('men', 'men-q01 existing customer = "Yes"', 'The questionnaire is dropped and the sign-in page opens (account wall at question 1).', 'skip-questions', [], 'observed', 'runs/exp-01', 'high');
R('men', 'Any man, any answers', 'There is no stop screen and no warning before the account form. Every one of the 33 male one-change replays, including sudden onset, "Random patches", "Completely bald", "Nearly every day" low mood, open scalp sores and each of the nine conditions, ended on the same account form.', 'none', [], 'observed', 'runs/exp-04 to runs/exp-34, runs/all-branches-men', 'high');
R('men', 'Last consent screen passed (finasteride statement ticked)', 'ACCOUNT WALL: the next screen asks for name, email, phone, date of birth and password. No plan, product or price is shown before it.', 'none', [], 'observed', 'runs/s2-baseline-men (last screen)', 'high');
R('men', 'men-q03 declaration or men-q37 finasteride statement left unticked', 'Continue does not move on. These two ticks are the only required consents before the wall.', 'none', [], 'observed', 'runs/exp-03, runs/exp-35', 'high');
R('men', 'men-q05 onset = "Suddenly"', 'Three extra yes/no screens appear (body hair loss, new medicines, other symptoms). Answering Yes to any of them adds nothing more.', 'extra-questions', [], 'observed', 'runs/exp-07 vs runs/s2-baseline-men; runs/exp-08, exp-09, exp-10 vs runs/exp-07', 'high');
R('men', 'men-q09 mood or antidepressants = "Yes"', 'Three extra screens appear: a required free-text box and two PHQ-2 style questions. Answering "Nearly every day" to either adds no screen, message or signposting.', 'extra-questions', [], 'observed', 'runs/exp-11 vs runs/s2-baseline-men; runs/exp-12, exp-13 vs runs/exp-11', 'high');
R('men', 'men-q13: a past medicine is ticked', 'One "Have you experienced any adverse effects?" screen is added per medicine, after the format question. Yes on it adds one optional free-text box.', 'extra-questions', [], 'observed', 'runs/exp-14, exp-16, exp-18 vs runs/s2-baseline-men; runs/exp-15, exp-17, exp-19', 'high');
R('men', 'men-q21: a condition is ticked', 'One free-text screen is added per condition. Scalp Disorders adds four screens (free text, scalp symptoms, treatments tried, red flags). Ticking a scalp red flag adds nothing.', 'extra-questions', [], 'observed', 'runs/exp-22 to runs/exp-30 vs runs/s2-baseline-men; runs/exp-31 to exp-34 vs runs/exp-27', 'high');
R('men', 'men-q04 hair picture (any of four) or men-q14 format preference (any of three)', 'No later screen is added, removed or reworded.', 'none', [], 'observed', 'runs/exp-04, exp-05, exp-06, exp-20, exp-21 vs runs/s2-baseline-men', 'high');
R('men', 'men-q38 NHS Summary Care Record or men-q39 GP sharing consent opened and agreed', 'NHS: a second "I agree" tick appears, nothing else changes. GP: agreeing adds five GP surgery boxes to the account form. Both are optional.', 'extra-questions', [], 'observed', 'runs/exp-36, runs/exp-37 vs runs/s2-baseline-men', 'high');
// read from code and run offline
R('men', 'Nothing blocked (the baseline man)', 'All twelve plans are offered. Older copy (the page new sign-ups are sent to): two main cards, Core Plan (opening on the capsule version) and the Combination Spray. Newer copy: one main card, the Combination Spray. The rest sit under "See more plans".', 'none', ['p-core-cap', 'p-core', 'p-combospray'], 'code', CODEPROOF + ' off-00', 'medium');
R('men', 'men-q05 onset = "Suddenly"', 'Finasteride tablets, topical finasteride, oral minoxidil and the Combination Spray are switched off. Only Minoxidil Spray, the Non-Prescription plan and Hair Growth Complex are left; Minoxidil Spray is the main card. No referral message.', 'product-removed', pids('off-04'), 'code', CODEPROOF + ' off-04; screens in runs/exp-07', 'medium');
R('men', 'men-q06, men-q07 or men-q08 = "Yes" (body hair loss, new medicines, other symptoms after sudden onset)', 'No served code reads these answers: the plans are the same as for sudden onset alone. Their use by the prescriber is unknown.', 'none', [], 'code', CODEPROOF + ' off-05, off-06, off-07', 'medium');
R('men', 'men-q11 or men-q12 = "More than half the days" or "Nearly every day" (either one)', 'Every finasteride product is switched off (tablet, spray, Combination Spray and the plans containing them). Oral Minoxidil / Minoxidil Spray becomes the main card; the Non-Prescription plan and Hair Growth Complex stay.', 'product-removed', pids('off-10'), 'code', CODEPROOF + ' off-10, off-11, off-13, off-14', 'medium');
R('men', 'men-q09 mood = "Yes" with both follow-ups at "Not at all" or "Several days"', 'Nothing is removed. A man on antidepressants who scores low is offered finasteride like anyone else (the line blocking on a plain Yes is commented out).', 'none', [], 'code', CODEPROOF + ' off-08, off-09, off-12', 'medium');
R('men', 'men-q15 past finasteride side effects = "Yes"', 'Every finasteride product is switched off; minoxidil products stay.', 'product-removed', pids('off-16'), 'code', CODEPROOF + ' off-16; screens in runs/exp-15', 'medium');
R('men', 'men-q17 past minoxidil side effects = "Yes"', 'Every minoxidil product is switched off, spray and capsule alike, with the Non-Prescription plan. Finasteride tablets / Topical Finasteride become the main card; Hair Growth Complex stays.', 'product-removed', pids('off-18'), 'code', CODEPROOF + ' off-18; screens in runs/exp-17', 'medium');
R('men', 'men-q19 past combination-spray side effects = "Yes"', 'Only the Combination Spray is switched off. Separate finasteride and minoxidil products all stay.', 'product-removed', pids('off-20'), 'code', CODEPROOF + ' off-20; screens in runs/exp-19', 'medium');
R('men', 'men-q21 = "High Blood Pressure" or "Cardiovascular Disease"', 'Every minoxidil product is switched off, the 5% spray included. Left: finasteride tablets, Topical Finasteride, Hair Growth Complex. No question asks whether blood pressure is controlled.', 'product-removed', pids('off-23'), 'code', CODEPROOF + ' off-23, off-24; screens in runs/exp-22, exp-23', 'medium');
R('men', 'men-q21 = "Severe Kidney or Liver Disease", "Prostate Disease, Male Breast Cancer or Testicular Cancer", "Rheumatoid Arthritis, Systemic Lupus or on Methotrexate" or "Sexual Dysfunction"', 'Every finasteride product is switched off. Oral Minoxidil, Minoxidil Spray, the Non-Prescription plan and Hair Growth Complex stay; Oral Minoxidil / Minoxidil Spray is the main card.', 'product-removed', pids('off-25'), 'code', CODEPROOF + ' off-25, off-26, off-27, off-31; screens in runs/exp-24, exp-25, exp-26, exp-30', 'medium');
R('men', 'men-q21 = "Scalp Disorders"', 'Topical minoxidil and the Combination Spray are switched off (Minoxidil Spray, Core Plan, Ultimate Plan, Non-Prescription plan go). The main card becomes Core Plan - Capsule: finasteride tablet plus oral minoxidil capsule. Topical Finasteride is still offered.', 'product-switched', pids('off-28'), 'code', CODEPROOF + ' off-28; screens in runs/exp-27', 'medium');
R('men', 'men-q28, men-q29 or men-q30 scalp tick boxes (any option, red flags included)', 'No served code reads them: plans stay as for Scalp Disorders alone.', 'none', [], 'code', CODEPROOF + ' off-32 to off-35, off-55, off-56; screens in runs/exp-31 to exp-34', 'medium');
R('men', 'men-q21 = "Phaeochromocytoma"', 'Only oral minoxidil is switched off (Oral Minoxidil, both capsule plans, Topical Finasteride & Oral Minoxidil). Spray plans and all finasteride stay.', 'product-removed', pids('off-29'), 'code', CODEPROOF + ' off-29; screens in runs/exp-28', 'medium');
R('men', 'men-q21 = "Diagnosed Lactose Allergy"', 'The two oral products are switched off: finasteride tablets and oral minoxidil, with every plan containing either. The Combination Spray becomes the main card; Minoxidil Spray, Topical Finasteride, the Non-Prescription plan and Hair Growth Complex stay.', 'product-switched', pids('off-30'), 'code', CODEPROOF + ' off-30; screens in runs/exp-29', 'medium');
R('men', 'men-q14 format = "Topical sprays" (against "Oral capsule" or "I don’t mind")', 'Order only. Older copy: the Core Plan card opens on the spray version instead of the capsule version. Newer copy: no change at the top. "I don’t mind" is treated as "Oral capsule". Nothing is added or removed.', 'product-switched', ['p-core', 'p-core-cap'], 'code', CODEPROOF + ' off-21, off-22', 'medium');
R('men', 'men-q04 hair picture = any of the four, including "Random patches" and "Completely bald"', 'No served code reads the picture: same plans, same first card. The pattern has no effect on the recommendation.', 'none', [], 'code', CODEPROOF + ' off-01, off-02, off-03', 'medium');
R('men', 'Two or more blocks together (for example High Blood Pressure + Sexual Dysfunction, or sudden onset + High Blood Pressure)', 'Blocks add up. When all five switches are off, only Hair Growth Complex (a food supplement) is shown; it is never removed. Scalp Disorders + Sexual Dysfunction leaves Oral Minoxidil and Hair Growth Complex only. Across all 32,768 combinations of the answers the code reads there are 13 distinct sets of switches.', 'product-removed', ['p-hgc', 'p-oralmin'], 'code', 'runs/offline/truthtable.json; ' + CODEPROOF + ' off-49 to off-54, off-59 to off-61', 'medium');
R('men', 'Age over 65 (66 or more), worked out from the date of birth given on the account form', 'The two copies disagree. Older copy: all finasteride, oral minoxidil and the Combination Spray off; Minoxidil Spray, Non-Prescription plan and Hair Growth Complex left. Newer copy: everything off except Hair Growth Complex. A man aged exactly 65 is not affected. Product pages meanwhile give 18 to 75 for finasteride. Each copy needs the date of birth handed to it under a particular name; whether the server does that is unknown.', 'product-removed', pids('off-40'), 'code', CODEPROOF + ' off-39, off-40, off-41', 'low');
R('men', 'Date of birth under 18 on the account form', 'The form refuses to submit and shows "We are unfortunately unable to prescribe to individuals under the age of 18." Not tested: it would mean typing into the account form. The recommendation code itself has no under-18 rule (off-36).', 'hard-stop', [], 'code', 'src/chunks/4346-bc4e0cf681126f20.pretty.js lines 1253-1267; src/translation.en.json (age_restriction)', 'medium');
R('men', 'Account tag finasteride_disallowed or minoxidil_disallowed (set on the customer record; who sets it and when is unknown)', 'That whole drug family is switched off, as for the matching medical answers. The basket also hides its Minoxidil Spray add-on unless the account is tagged consultation_complete and is not tagged minoxidil_disallowed.', 'product-removed', [...new Set(ALL_FIN.concat(ALL_MIN))], 'code', CODEPROOF + ' off-42, off-43; src/chunks/app__basket__page-2fe8ac5b115972cc.pretty.js lines 218-248', 'medium');
R('men', 'Account tag dutasteride_eligible', 'Newer copy: the Dutasteride Combination Spray is put first. Older copy: only on the special "combo" address of the page, not on the standard one. How an account earns the tag is unknown (the product page asks existing customers to log in).', 'product-added', ['p-dutaspray'], 'code', CODEPROOF + ' off-44', 'low');
R('men', 'Account tag combo_pill_eligible AND arrival by a combination-capsule route (combo_pill=true or a partner-clinic link)', 'The Combination Capsule is put first. Without the special route the tag does nothing.', 'product-added', ['p-combocap'], 'code', CODEPROOF + ' off-45, off-46', 'low');
R('men', 'A product was stored as "chosenProduct" in the browser before the questionnaire', 'That product is moved to the top of the list if the blocks allow it. Where the site sets this value was not found, so it may be unused.', 'product-switched', ['p-fin', 'p-ultimate'], 'code', CODEPROOF + ' off-47, off-48', 'low');
R('men', 'Questionnaire and account form are sent (one request, customer/survey)', 'The server\'s reply can carry a plan name ("plan" or "plan_recommended") and the newer page asks the server for its own ordered list (account/recommendations), which goes ahead of the built-in list. So the server can reorder or override what the browser rules show. Its logic is not public.', 'unknown', [], 'code', 'src/chunks/4346-bc4e0cf681126f20.pretty.js lines 1306-1340; src/chunks/app__recommendation__page-9574552c5f8ec4c0.pretty.js lines 82-101 and 1184-1218', 'low');
R('men', 'After the order is placed', 'A prescriber at the partner pharmacy reviews the questionnaire (and the NHS Summary Care Record if consent was given) and can refuse: "Treatment plans will only be dispensed if the prescriber approves you for this treatment". How often, and on which answers, is not public.', 'flag-for-clinician', [], 'docs', 'https://sons.co.uk/pages/medical-faqs ("Do I need a prescription?"); https://sons.co.uk/pages/terms-conditions; src/translation.en.json (treatment_plans_dispensed)', 'medium');
R('men', 'The app code lists stop screens named "extensive-loss-notice-viewed" and "Sudden Hair Loss Notice Viewed"', 'Neither exists in the questionnaire served today, so men with extensive or sudden loss now pass straight through. Inferred: earlier versions stopped them. A January 2024 Sons blog post also describes questions the current form no longer has (when the loss was first noticed, a professional diagnosis, allergies).', 'none', [], 'code', 'src/chunks/4346-bc4e0cf681126f20.pretty.js lines 889-895 vs quiz-definition.json; https://sons.co.uk/blogs/journal/answered-six-common-questions-people-have-about-sons-treatments', 'medium');
// other flows
R('oral-minoxidil-5mg', 'om5-q2 side effects on 2.5 mg = "Yes" or om5-q4 health or medicines changed = "Yes"', 'A required free-text box opens. No stop screen exists in this four-question form; the prescriber decides on the 5 mg step-up.', 'extra-questions', ['p-oralmin5'], hasRun('exp-43') ? 'observed' : 'code', (hasRun('exp-43') ? 'runs/exp-43 vs runs/exp-44; ' : '') + 'src/survey-oral_minoxidil_5mg_consultation.raw.json', 'medium');
R('beard', 'beard-q11 = "Psoriasis"', 'One extra question asks whether the man is willing to proceed although psoriasis and eczema can be made worse by minoxidil and tretinoin. Eczema and skin infection tick boxes do not trigger it.', 'soft-warning', ['p-beard'], hasRun('exp-41') ? 'observed' : 'code', (hasRun('exp-41') ? 'runs/exp-41 vs runs/exp-38; ' : '') + 'src/survey-beard.raw.json', 'medium');
R('beard', 'Any answer by a man (sudden well-defined patches, inflamed skin, allergy to minoxidil or tretinoin)', 'No stop screen in the definition: every route ends at the same account form, then the Beard Booster product page.', 'none', ['p-beard'], hasRun('exp-40') ? 'observed' : 'code', (hasRun('exp-40') ? 'runs/exp-38, runs/exp-39, runs/exp-40; ' : '') + 'src/survey-beard.raw.json', 'medium');
R('beard', 'beard-q2 gender at birth = "Female"', 'Silent dead end: the screen stays on the gender question with no notice, no message and no way forward (the hair flow at least shows a notice).', 'hard-stop', ['p-beard'], 'observed', 'runs/exp-42 vs runs/exp-38', 'high');
R('men', 'Female stop notice, "Finish Consultation" pressed', 'The browser goes to the sons.co.uk home page. No signposting page, no women\'s product, no referral.', 'hard-stop', [], 'observed', 'runs/exp-45', 'high');
R('oral-minoxidil-5mg', 'om5-q2 side effects on 2.5 mg = "Yes" (seen live)', 'A free-text box "Please can you tell us more about the side effects you have experienced?" opens; no warning and no stop.', 'extra-questions', [], 'observed', 'runs/exp-43 screen 03 vs runs/exp-44', 'high');
d.rules = rules;

// ---------------------------------------------------------------- recommendations (every distinct outcome)
const offered = id => [...new Set(OFF[id].older.offered.concat(OFF[id].newer.offered).map(pid))];
const NOTLIVE = 'READ FROM THE SITE\'S CODE, RUN OFFLINE; NOT SEEN LIVE (the page needs an account). ';
const rec = (profile, id, note) => ({ profile, offered: offered(id), default: pid(OFF[id].older.primary[0].split(' (toggle: ')[0]), note: NOTLIVE + 'Older copy main card(s): ' + OFF[id].older.primary.map(card).join(' and ') + '. Newer copy main card: ' + OFF[id].newer.primary.map(card).join(' and ') + '. ' + (note || '') + ' (' + id + ')', evidence: 'code' });
d.recommendations = [
  rec('Baseline man: 32, temples and crown, gradual onset, no mood concerns, no past treatment, no conditions, "I don’t mind" on format', 'off-00', 'Live, this man ends on the account form with nothing shown (runs/s2-baseline-men). The "default" here is the first card of the older copy, the page the questionnaire sends new sign-ups to. List prices: Core Plan - Capsule £189 for 6 months, Combination Spray £189 for 6 months. Strengths are fixed: finasteride 1 mg, oral minoxidil 2.5 mg, spray 0.15% finasteride / 5% minoxidil / 0.015% tretinoin.'),
  { profile: 'Baseline woman: 38, any answers', offered: [], default: null, note: 'Stopped at question 2 with a notice to see a hair-loss specialist or GP (runs/exp-02, runs/s2-baseline-women). The medical FAQ adds that 5% minoxidil "cannot be sold to females as Sons are not permitted to do so under UK licensing".', evidence: 'observed' },
  rec('Man who prefers "Topical sprays", otherwise baseline', 'off-21', 'Same twelve plans; only the opening version of the Core Plan card changes.'),
  rec('Man whose hair loss started suddenly', 'off-04', 'Every prescription product is gone; he is offered the pharmacy minoxidil spray, the Non-Prescription plan (spray, biotin, shampoo) and the supplement, with no advice on screen to see a doctor.'),
  rec('Man with finasteride blocked: PHQ answer of "More than half the days" or worse, past finasteride side effects, severe kidney or liver disease, prostate disease or male breast or testicular cancer, rheumatoid arthritis, lupus or methotrexate, or sexual dysfunction', 'off-25', 'Oral minoxidil 2.5 mg (an unlicensed special) becomes the lead recommendation.'),
  rec('Man with minoxidil blocked: high blood pressure, cardiovascular disease, or past minoxidil side effects', 'off-23', 'Finasteride only, as tablet or spray, plus the supplement.'),
  rec('Man who had side effects from a combination spray', 'off-20', 'Everything except the Combination Spray.'),
  rec('Man with a scalp disorder (psoriasis, eczema, dermatitis, infection)', 'off-28', 'Topical minoxidil is out, so the engine leads with tablets and capsules. Topical Finasteride is still listed.'),
  rec('Man with phaeochromocytoma', 'off-29', 'Spray-based plans only for minoxidil.'),
  rec('Man with a diagnosed lactose allergy', 'off-30', 'Sprays only.'),
  rec('Man aged 66 or over (date of birth from the account form)', 'off-40', 'The copies disagree: the older copy leaves Minoxidil Spray, the Non-Prescription plan and Hair Growth Complex; the newer copy leaves Hair Growth Complex alone.'),
  rec('Man with a lactose allergy and a scalp disorder (or a lactose allergy and high blood pressure)', 'off-50', 'Topical Finasteride is the only medicine left.'),
  rec('Man with a scalp disorder and sexual dysfunction', 'off-59', 'Oral Minoxidil is the only medicine left.'),
  rec('Man with every drug family blocked (for example high blood pressure + sexual dysfunction, or sudden onset + high blood pressure)', 'off-49', 'Only the food supplement is offered; no screen says that medicines were ruled out.'),
  rec('Existing customer whose account carries the tag dutasteride_eligible', 'off-44', 'Newer copy only. How the tag is earned is unknown.'),
  rec('Customer tagged combo_pill_eligible who arrives by a combination-capsule route', 'off-45', 'Newer copy; the older copy does the same only on its "/combo" address.'),
];

// ---------------------------------------------------------------- products: when the consultation offers each one
const P = id => d.products.find(p => p.id === id);
const W = {
  'p-fin': 'Offered to any man unless oral finasteride is switched off. Switched off by: sudden onset; a PHQ answer of "More than half the days" or "Nearly every day"; past finasteride side effects; severe kidney or liver disease; prostate disease or male breast or testicular cancer; rheumatoid arthritis, lupus or methotrexate; diagnosed lactose allergy; sexual dysfunction; age over 65; account tag finasteride_disallowed. Shares one card with Topical Finasteride (Tablet/Spray toggle). It becomes the main card when minoxidil is blocked (high blood pressure, cardiovascular disease, minoxidil side effects). Single strength, 1 mg. (Site code run offline; not seen live.)',
  'p-min': 'Offered unless topical minoxidil is switched off: high blood pressure, cardiovascular disease, scalp disorder, past minoxidil side effects, account tag minoxidil_disallowed (and, in the newer copy only, age over 65). It is the one medicine left, and the main card, after sudden onset. Shares a card with Oral Minoxidil. Single strength, 5%. (Site code run offline; not seen live.)',
  'p-oralmin': 'Offered unless oral minoxidil is switched off: sudden onset, high blood pressure, cardiovascular disease, phaeochromocytoma, lactose allergy, past minoxidil side effects, age over 65, account tag minoxidil_disallowed. It becomes the main card whenever finasteride is blocked (low-mood score, finasteride side effects, kidney or liver disease, the prostate and cancer group, the rheumatoid group, sexual dysfunction). Single strength, 2.5 mg. (Site code run offline; not seen live.)',
  'p-oralmin5': 'Never recommended by the hair questionnaire. Existing customers on 2.5 mg ask for it through a separate four-question step-up form (response so far, side effects, changes in health, consent); the prescriber decides. The form has no stop screen.',
  'p-topfin': 'Offered unless topical finasteride is switched off: the same list as finasteride tablets except lactose allergy (the spray survives that). Shares a card with the tablets. With a lactose allergy plus a scalp disorder or high blood pressure it is the only medicine left. Single strength, 0.15%. (Site code run offline; not seen live.)',
  'p-combospray': 'Offered only when nothing touches finasteride or minoxidil: any single medical tick except phaeochromocytoma or lactose allergy removes it, as do sudden onset, a high low-mood score, any reported side effect and age over 65. Newer copy: the single main card for a healthy man whatever format he prefers. Older copy: the second main card, beside the Core Plan. It is the main card for a man with a lactose allergy. Single strength: finasteride 0.15%, minoxidil 5%, tretinoin 0.015%. (Site code run offline; not seen live.)',
  'p-combocap': 'Not in the standard list. Put first only when the account is tagged combo_pill_eligible AND the visit came by a combination-capsule route (combo_pill=true or a partner-clinic link). Needs oral finasteride and oral minoxidil both allowed. How the tag is earned is unknown. (Site code run offline, off-45; not seen live.)',
  'p-dutaspray': 'Not in the standard list. Newer copy puts it first when the account is tagged dutasteride_eligible; the older copy only on its "combo" address. Needs the combination switch on. The product page asks existing customers to log in, so it reads as a step-up for men already treated (inferred). (off-44; not seen live.)',
  'p-keto': 'Not recommended by the engine. Sold as an add-on and in retail packs. The scalp tick boxes shown after "Scalp Disorders" look built to support it, but no served code reads them (inferred purpose).',
  'p-hgc': 'Always offered: it is last in both lists and no switch removes it. When every medicine is blocked (for example high blood pressure + sexual dysfunction, or sudden onset + high blood pressure) it is the only thing shown. Also inside the Ultimate plans. (Site code run offline, off-49 to off-54; not seen live.)',
  'p-core': 'Needs finasteride tablets and topical minoxidil both allowed. Older copy: a main card for a healthy man, opening on this spray version if he chose "Topical sprays" and as the toggle of Core Plan - Capsule otherwise; it is the first card for a man with phaeochromocytoma. Newer copy: second, after the Combination Spray. (Site code run offline, off-21, off-29; not seen live.)',
  'p-core-cap': 'Needs finasteride tablets and oral minoxidil both allowed. Older copy: the first main card for a healthy man who chose "Oral capsule" or "I don’t mind". Both copies: the single main card for a man with a scalp disorder. (Site code run offline, off-00, off-28; not seen live.)',
  'p-ultimate': 'In both lists (fifth or sixth), tagged "most popular". Needs finasteride tablets and topical minoxidil allowed. Never a main card in any single-change run; it sits under "See more plans" as the step up from the Core Plan. (Site code run offline; not seen live.)',
  'p-ultimate-cap': 'In both lists. Needs finasteride tablets and oral minoxidil allowed. Shown as the capsule side of the Ultimate card, or alone when topical minoxidil is blocked (scalp disorder). (Site code run offline; not seen live.)',
  'p-topfin-oralmin': 'Third or fourth in both lists. Needs topical finasteride and oral minoxidil allowed, so it disappears with any finasteride block, any minoxidil block, phaeochromocytoma or lactose allergy. It is the second main card (older copy) for a man who reported side effects from a combination spray. (Site code run offline, off-20; not seen live.)',
  'p-nonrx': 'Offered unless topical minoxidil is switched off. It is what is left, with Minoxidil Spray and the supplement, after sudden onset and (older copy) for men over 65. The medical FAQ also suggests it for men who stop finasteride while trying for a baby. (Site code run offline; FAQ: sons.co.uk/pages/medical-faqs.)',
};
Object.entries(W).forEach(([id, t]) => { P(id).recommendedWhen = t; });

// ---------------------------------------------------------------- access, summary, strengths, weaknesses, opportunities, limitations
const liveCount = experiments.filter(e => e.kind.startsWith('live')).length, offCount = experiments.length - liveCount;
d.access.coverageNote = 'Stage 1 walked the baseline man to the account form and saw every conditional screen. Stage 2 replayed both baselines and then ' + liveCount + ' one-change experiments live, each ending on the account form, the female stop notice or the sign-in page. Because no plan is shown before the account form, product effects could not be seen live: instead both copies of the recommendation code that the site serves to every visitor were run offline on the same one-change answers (' + offCount + ' further offline-only cases, plus all 32,768 combinations of the answers the code reads). Nothing behind the account form was tested: no account, email, phone number, date of birth, photo, payment or order was entered or created.';
d.access.blockers = d.access.blockers.filter(b => !/Recommendation, plan choice/.test(b)).concat(['The recommendation, plan length, basket, checkout, identity check and prescriber review all sit behind the account form. Their rules were read from served code and run offline, never seen live.']);
d.engineSummary = 'Sons runs one short questionnaire for men only. Sex at birth is the only gate: a woman is stopped at question 2, and a man is never stopped or warned, whatever he answers (33 live one-change replays all ended on the same account form). Nothing is recommended until he has given his name, email, phone number, date of birth and a password. After that a script in his own browser turns the answers into five on/off switches: finasteride tablet, finasteride spray, minoxidil capsule, minoxidil spray, combination spray. Each medical tick or reported side effect switches off a whole drug family: finasteride goes with a low-mood score of 2 or more, past finasteride side effects, kidney or liver disease, prostate disease or male cancers, rheumatoid arthritis, lupus or methotrexate, and sexual dysfunction; minoxidil (spray and capsule) goes with high blood pressure, heart disease and past minoxidil side effects; a scalp disorder removes the sprays that contain minoxidil; phaeochromocytoma removes the capsule; a lactose allergy removes both oral products; sudden onset removes everything on prescription. A fixed list of twelve plans is then filtered by the switches and the top one or two survivors are shown as "the plan our medical team recommend". The format preference only changes the order. The hair picture, the three sudden-onset follow-ups, the scalp tick boxes and all free text change nothing in this code. Strength never varies: each medicine comes in one strength. Hair Growth Complex, a supplement, is never removed, so there is always something to buy. Two copies of the code are served and they agree on everything except what goes first and what a man over 65 is shown. A prescriber at the partner pharmacy reviews the order afterwards and can refuse it; the server can also override the list. Those two steps are not public.';
d.strengths = [
  'Very little friction: a healthy man taps through ten screens, and no answer ever ends the journey before his contact details are captured.',
  'A simple, consistent rule set. Whole drug families are switched on or off, and both served copies agree on every medical rule (13 distinct outcomes in total).',
  'Every route has a fallback, so a sale is nearly always possible: sprays for men who cannot take tablets (lactose allergy), capsules for men who cannot use minoxidil on the scalp, finasteride alone for men with blood-pressure or heart problems, and a supplement that is never removed.',
  'Each plan card has a Spray/Capsule toggle, so the man can change format without retaking the questionnaire.',
  'Two PHQ-2 style mood questions sit in the flow, and a score of 2 or more on either removes finasteride. A finasteride safety statement (mood, sexual function, stopping before trying for a baby) is shown to every man and must be ticked.',
  'Cautious on minoxidil: any report of high blood pressure or heart disease removes it in every form, including the pharmacy spray.',
  'Optional consents to read the NHS Summary Care Record and to tell the GP, a repeat health check before renewals, and prescriber review after the order.',
  'Holds its own UK licences for finasteride 1 mg and minoxidil 5% and says plainly that sprays and capsules are unlicensed specials.',
  'A clear ladder of plans (single medicine, Core, Ultimate) with a money-back promise after six months and a partner-clinic route for transplant patients.',
];
d.weaknesses = [
  'No plan, product or price is shown until the visitor gives his name, email, phone number, date of birth and a password.',
  'The hair picture does nothing. "Random patches" and "Completely bald" lead to the same screens and the same plans as ordinary male-pattern loss (seen live and in code).',
  'Sudden hair loss is not stopped or referred. The man reaches the account form and the code then offers minoxidil spray, the Non-Prescription plan and a supplement. The three follow-up questions (body hair, new medicines, other symptoms) are not read by any served code.',
  'Red flags get no response on screen: "Nearly every day" on the hopelessness question and "open sores or infection on the scalp" both pass with no message (seen live). Low mood only removes finasteride later, silently.',
  'A man who ticks a scalp disorder is steered to systemic treatment: the main card becomes finasteride tablet plus oral minoxidil capsule, an unlicensed special.',
  'Exclusions are silent. The page holds the reasons in a hidden "Debug (Dev Only)" block but does not tell the customer why a medicine is missing.',
  '"I don’t mind" is treated as "Oral capsule", so a man with no preference is led to the plan containing unlicensed oral minoxidil in the older copy.',
  'Thin history: no question on current medicines (except one yes/no after sudden onset), allergies other than lactose, low blood pressure, family history, how long the hair has been thinning, earlier diagnosis, goals, or plans for a baby (covered only by a statement). Age is not asked before the wall. An older version of the form asked about allergies and diagnosis; they have been dropped.',
  'High blood pressure is all-or-nothing: no question on whether it is controlled, and even the 5% spray is removed.',
  'One strength per medicine and no way to choose a lower dose; the only dose change is the separate 5 mg oral minoxidil step-up for existing customers.',
  'The rule set runs in the browser and can be read by anyone, and the two served copies disagree on the over-65 rule and on which plan is shown first.',
  'Women are turned away at question 2 with no product and no signposting beyond "see a specialist or GP".',
  'Rough edges: "Is their hair loss over other parts of your body?", a lactose question that argues with the patient, and product pages that disagree with the leaflet on the combination spray strength.',
];
d.opportunities = [
  'Show a provisional plan and price before asking for contact details. Sons shows nothing until an account exists.',
  'Make the pattern and onset questions count: stop and refer patchy, sudden, scarring or infected-scalp cases with a clear explanation. Sons lets all of them through.',
  'Tell the patient why a treatment is not offered and what the alternative is, instead of silently hiding plans.',
  'Respond on screen to a high low-mood score with support information, not just a quiet change to the plan list.',
  'Ask what Sons does not: current medicines, blood-pressure control, low blood pressure or dizziness before oral minoxidil, plans for a baby as a question, duration, family history and goals. Ask age at the start.',
  'Serve women, whom Sons refuses outright, and offer a clear route for men over 65.',
  'Offer dose choice (for example a lower-strength start) and a foam or alcohol-free minoxidil; the Sons product feed lists one strength per medicine and no foam.',
  'Use photos or a clinician look at the scalp before prescribing. Sons asks for photos only to track progress and for its refund promise.',
  'Do not default the undecided to an unlicensed oral medicine: lead with licensed options and explain the difference.',
];
d.limitations = [
  'No product effect was seen live. The recommendation screen needs an account, so every product rule comes from running the site\'s own served code offline. It shows what the browser would display, not what a customer actually receives.',
  'Two copies of the recommendation code are served. The questionnaire sends new sign-ups to the page holding the older copy; whether some customers see the newer one, and when, was not confirmed.',
  'The server can override the browser rules (it returns a plan name when the questionnaire is sent, can send its own ordered list, and sets account tags such as finasteride_disallowed). Its logic is not public.',
  'What the prescriber does with the answers is unknown: how often orders are refused, and whether the hair picture, the sudden-onset answers, scalp red flags or free text lead to refusal. One web search found no public accounts of refusals.',
  'Age rules were not tested live (date of birth is asked only on the account form). The over-65 rule depends on the date of birth reaching the script under a particular name, which could not be checked.',
  'Not replayed live: the middle PHQ answers ("Several days", "More than half the days"), eight of the twelve scalp tick-box options on their own and any combination of two or more changes. All were covered offline or from code.',
  'The oral minoxidil 5 mg step-up, beard and partner-clinic flows were only lightly tested; their forms cannot be sent without an account, and the clinic flow was opened at its first screen only.',
  'Renewal health checks, the plan customiser, basket, checkout consents and identity check were read from code and public text only.',
  'Prices are list prices from the product feed on one day during a Black Friday sale; first-order discounts change often.',
  'Legal class of the minoxidil spray and ketoconazole shampoo (P or GSL) was not checked against the MHRA register.',
];
const addSource = (title, url) => { if (!d.sources.some(s => s.url === url)) d.sources.push({ title, url }); };
addSource('Sons blog, 3 January 2024: describes an earlier, seven-stage version of the consultation', 'https://sons.co.uk/blogs/journal/answered-six-common-questions-people-have-about-sons-treatments');
addSource('Sons medical treatment landing page ("Your prescriber will confirm which treatments are suitable for you")', 'https://sons.co.uk/pages/hair-loss-medical');
addSource('Shop app recommendation page (newer copy of the rules, saved as engine-newer.extract.js)', 'https://shop.sons.co.uk/recommendation');
addSource('Third-party review of Sons (affiliate site; no detail on refusals)', 'https://finvsfin.com/sons-hair-loss-reviews/');
men.stagesSummary = '2 gate questions (existing customer, sex at birth) → declaration tick → 6 core screens for a healthy man (picture, onset, mood, past medicines, format preference, conditions) with up to 24 conditional screens → finasteride statement and optional NHS/GP consents → ACCOUNT WALL (account form; the questionnaire is sent with it) → recommendation page, plan length, basket, checkout, identity check, prescriber review. Everything up to the wall was replayed live one change at a time in stage 2; everything after it was read from served code (and run offline) or public pages.';
d.stage2 = { experimentsLive: liveCount, experimentsOffline: offCount, distinctOutcomes: Object.keys(TT.older).length, answerCombinationsRun: TT.patients, missingRuns: missing };
fs.writeFileSync(path.join(ROOT, 'company.json'), JSON.stringify(d, null, 1));
console.log('stage 2 overlay: ' + liveCount + ' live + ' + offCount + ' offline experiments, ' + rules.length + ' rules, ' + d.recommendations.length + ' recommendation profiles' + (missing.length ? ' | runs not found: ' + missing.join(', ') : ''));
