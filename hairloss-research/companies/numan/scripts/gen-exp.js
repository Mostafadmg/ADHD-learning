#!/usr/bin/env node
// Stage 2: build one-change walk files from the baseline man.
// usage: node gen-exp.js <expId>   -> writes stage2/<expId>.json and prints its path
// Each experiment is the baseline answer list with ONE answer changed; follow-up questions opened by the change
// are answered neutrally (short fictional medical notes, never contact details). Walk stops at the product screen.
const fs = require('fs'), path = require('path');
const L = t => ({ do: 'click', selector: `label:text-is(${JSON.stringify(t)})`, settle: 2800 });
const T = t => ({ do: 'click', selector: `label:text-is(${JSON.stringify(t)})`, settle: 600 });
const NEXT = { do: 'click', text: 'Next', settle: 2800 };
const TXT = v => [{ do: 'fill', selector: 'textarea, input[type=text]', value: v }, NEXT];
const single = t => [L(t)];
const multi = (...ts) => [...ts.map(T), NEXT];
const O = {
  age: '18 - 65', over65: '65 or over', u18: 'Under 18',
  tc: 'Temples and Crown', grad: 'My hair loss started gradually over the last few months or years', sudden: 'Over the last few days or weeks',
  noAll: 'I am not allergic to any of the above', alMin: 'I am allergic to minoxidil', alFin: 'I am allergic to finasteride', alLac: 'I have a lactose intolerance or allergy',
  lacNone: 'I can’t tolerate any amount of lactose and I would like to be considered for non-lactose containing preparations only', lacSmall: 'I can tolerate very small amounts of lactose',
  scNo: 'No', scPain: 'Pain, itching, burning or bumps', scRed: 'Red rinds or rashes', scDan: 'Dandruff', scPso: 'Psoriasis or eczema',
  cNo: 'No - none', cBody: 'I have noticed hair loss on other areas of my body other than my head.',
  cPsa: 'I am undergoing PSA (prostate) monitoring or I have previously been diagnosed with prostate cancer.',
  cBp: 'I have been diagnosed with high or low blood pressure.', cAst: 'I have been diagnosed with asthma.',
  cBaby: 'I plan on trying for a baby in the next 12 weeks.', cDep: 'I have previously experienced, or am currently experiencing, depression, anxiety or panic disorders',
  psaYes: 'I understand and would like to be considered for finasteride containing preparations.', psaNo: 'I do not wish to be considered for finasteride containing preparations.',
  bpYes: 'I understand that minoxidil may lower my blood pressure and would like to be considered for minoxidil.', bpNo: 'I do not wish to be considered for minoxidil.',
  astYes: 'I understand that topical formulations (such as spray) may worsen my asthma and would like to be considered topical formulations.', astNo: 'I do not wish to be considered for topical formulations (such as spray).',
  babyYes: 'I would like to be considered for finasteride and will stop taking finasteride 12 weeks prior to trying for a baby.', babyNo: 'I do not wish to be considered for preparations containing finasteride.',
  moodFin: 'I accept the risk that finasteride can lead to detrimental effects on my mood and would like to be considered for finasteride and/or minoxidil.', moodMin: 'I would like to proceed with a minoxidil only treatment plan.',
  imp: 'Effectiveness of the product', impSE: 'Minimal side effects', impScalp: 'Scalp-friendly options', impAll: 'All of the above',
  mhNo: 'I do not have a major illness, ongoing medical condition, operation, allergy to medication or take prescribed or over the counter medication to tell you about.',
  mhYes: 'I have a major illness, ongoing medical condition, operation, allergy to medication or take prescribed or over the counter medication to tell you about.',
};
// baseline sections; each experiment overrides one
const base = () => ({
  age: single(O.age), pattern: single(O.tc), onset: single(O.grad), allergy: multi(O.noAll), scalp: multi(O.scNo),
  cond: multi(O.cNo), imp: multi(O.imp), hist: [{ ...L(O.mhNo), settle: 3500 }],
});
const depBranch = (mood, who, dose, suic) => {
  const s = [...multi(O.cDep), ...single(mood)]; if (!who) return s; s.push(...single(who));
  if (who === 'GP') { s.push(...TXT('Sertraline 50 mg once a day'), ...single(dose));
    if (dose === 'Yes') s.push(...TXT('Sertraline, was 25 mg, now 50 mg')); else s.push(...single(suic)); }
  return s;
};
const E = {
  baseline: b => b,
  'al-fin': b => { b.allergy = [...multi(O.alFin), ...TXT('Itchy skin rash')]; },
  'al-min': b => { b.allergy = [...multi(O.alMin), ...TXT('Itchy skin rash')]; },
  'al-lac-small': b => { b.allergy = [...multi(O.alLac), ...single(O.lacSmall)]; },
  'al-lac-none': b => { b.allergy = [...multi(O.alLac), ...single(O.lacNone)]; },
  'sc-pain': b => { b.scalp = [...multi(O.scPain), ...TXT('Mild itching for 6 months. Not seen by a doctor. No treatment.')]; },
  'sc-red': b => { b.scalp = [...multi(O.scRed), ...TXT('Small red patch for 6 months. Not seen by a doctor. No treatment.')]; },
  'sc-dan-yes': b => { b.scalp = [...multi(O.scDan), ...single('Yes')]; },
  'sc-dan-no': b => { b.scalp = [...multi(O.scDan), ...single('No')]; },
  'sc-pso': b => { b.scalp = [...multi(O.scPso), ...TXT('Mild scalp eczema, seen by GP years ago, uses emollient only.')]; },
  'c-body': b => { b.cond = [...multi(O.cBody), ...TXT('Slightly thinner hair on forearms over the last 2 years.')]; },
  'c-psa-yes': b => { b.cond = [...multi(O.cPsa), ...single(O.psaYes)]; },
  'c-psa-no': b => { b.cond = [...multi(O.cPsa), ...single(O.psaNo)]; },
  'c-bp-yes': b => { b.cond = [...multi(O.cBp), ...single(O.bpYes)]; },
  'c-bp-no': b => { b.cond = [...multi(O.cBp), ...single(O.bpNo)]; },
  'c-ast-yes': b => { b.cond = [...multi(O.cAst), ...single(O.astYes)]; },
  'c-ast-no': b => { b.cond = [...multi(O.cAst), ...single(O.astNo)]; },
  'c-baby-yes': b => { b.cond = [...multi(O.cBaby), ...single(O.babyYes)]; },
  'c-baby-no': b => { b.cond = [...multi(O.cBaby), ...single(O.babyNo)]; },
  'dep-gp': b => { b.cond = depBranch(O.moodFin, 'GP', 'No', 'No'); },
  'dep-minonly': b => { b.cond = depBranch(O.moodMin); },
  'dep-spec': b => { b.cond = depBranch(O.moodFin, 'Psychiatrist/Specialist/Consultant'); },
  'dep-dose': b => { b.cond = depBranch(O.moodFin, 'GP', 'Yes'); },
  'dep-suic': b => { b.cond = depBranch(O.moodFin, 'GP', 'No', 'Yes'); },
  'imp-se': b => { b.imp = multi(O.impSE); },
  'imp-scalp': b => { b.imp = multi(O.impScalp); },
  'imp-all': b => { b.imp = multi(O.impAll); },
  'hist-yes': b => { b.hist = [L(O.mhYes), ...TXT('Mild hay fever in summer. No operations.'), { do: 'wait', ms: 2000 }, ...TXT('Cetirizine 10 mg when needed in summer.'), { do: 'wait', ms: 2000 }]; },
  'age-65': b => { b.age = [...single(O.over65), ...single('Yes')]; },
  'age-65-no': b => { b.age = [...single(O.over65), ...single('No')]; },
  'pat-temples': b => { b.pattern = single('Temples'); },
  'pat-moderate': b => { b.pattern = single('Moderate'); },
  'pat-extensive': b => { b.pattern = single('Extensive'); },
  'pat-other': b => { b.pattern = [...single('Other hair loss pattern'), ...TXT('Diffuse thinning on top for about 2 years. No diagnosis.')]; },
  'pat-patchy': b => { b.pattern = single('Patchy'); },
  'pat-complete': b => { b.pattern = single('Complete'); },
  'onset-sudden': b => { b.onset = single(O.sudden); },
  'patchy-review': b => { b.pattern = [...single('Patchy'), { do: 'click', text: 'Review your answers', settle: 3500 }, ...single(O.tc)]; },
  'regaine-almin': b => { b.start = 'https://www.numan.com/subscribe/hair-loss/regaine'; b.allergy = [...multi(O.alMin), ...TXT('Itchy skin rash')]; },
  'fin-entry-alfin': b => { b.start = 'https://www.numan.com/subscribe/hair-loss/finasteride'; b.allergy = [...multi(O.alFin), ...TXT('Itchy skin rash')]; },
  'fin-entry': b => { b.start = 'https://www.numan.com/subscribe/hair-loss/finasteride'; },
  'pair-alfin-scpain': b => { b.allergy = [...multi(O.alFin), ...TXT('Itchy skin rash')]; b.scalp = [...multi(O.scPain), ...TXT('Mild itching for 6 months. Not seen by a doctor. No treatment.')]; },
  'pair-alfin-scpain-regaine': b => { b.start = 'https://www.numan.com/subscribe/hair-loss/regaine'; b.allergy = [...multi(O.alFin), ...TXT('Itchy skin rash')]; b.scalp = [...multi(O.scPain), ...TXT('Mild itching for 6 months. Not seen by a doctor. No treatment.')]; },
  'min-entry': b => { b.start = 'https://www.numan.com/subscribe/hair-loss/minoxidil'; },
};
const id = process.argv[2]; if (!E[id]) { console.error('unknown: ' + id + '\n' + Object.keys(E).join(' ')); process.exit(1); }
const b = base(); E[id](b);
const steps = [{ do: 'wait', ms: 4000 }, { do: 'click', text: 'Next', settle: 3500 },
  ...b.age, ...b.pattern, ...b.onset, ...b.allergy, ...b.scalp, ...b.cond, ...b.imp, ...b.hist,
  { do: 'click', selector: 'label:text-is("No")', settle: 3500 }, { do: 'click', text: 'Skip', settle: 4500 },
  { do: 'scroll' }, { do: 'click', text: 'See all treatments', settle: 2500 }, { do: 'scroll' }];
const out = { _about: `Stage 2 experiment ${id}: baseline man with one answer changed (see scripts/gen-exp.js). Stops at the product screen.`,
  start: b.start || 'https://www.numan.com/subscribe/hair-loss?pc=hl-organic-50off', steps };
const p = path.join(__dirname, '..', 'stage2', id + '.json'); fs.writeFileSync(p, JSON.stringify(out, null, 1)); console.log(p);
