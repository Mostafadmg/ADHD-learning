// Stage 2 (EXPERIMENT): writes one walk.js action file per one-change experiment into runs/<exp-id>/actions.json.
// Every file is built from the same answer sheet (the baseline man) with ONE answer changed.
// Where a change opens new screens, they are answered neutrally ("No", "None of the above", the word "test") and the
// file says so in its _about line. No file ever fills in the account form.
// usage: node scripts/s2-make.js            (run from anywhere)
const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..');
const START = 'https://shop.sons.co.uk/consultation/?logged_in=false';
const SUDDEN = 'Suddenly (it fell out over a matter of days or a few weeks)';
const NOPREF = 'I don’t mind - I want what’s most effective for me';
const SCALP = 'Scalp Disorders (including Scalp Psoriasis, Eczema, Dermatitis or Infection)';
const COND = [
  'High Blood Pressure', 'Cardiovascular Disease (incl. Heart Attack, Rhythm, Valve Disorder or Stroke)', 'Severe Kidney or Liver Disease',
  'Prostate Disease, Male Breast Cancer or Testicular Cancer', 'Rheumatoid Arthritis, Systemic Lupus or on Methotrexate', SCALP,
  'Phaeochromocytoma', 'Diagnosed Lactose Allergy', 'Sexual Dysfunction'];
const MED = ['Finasteride or Propecia', 'Minoxidil or Regaine', 'Topical Finasteride Minoxidil Combination'];

// The baseline man (PROTOCOL.md section 5), in the survey's own wording.
const BASE = {
  existing: 'No', gender: 'Male', accept: true, picture: 'Temples/Crown',
  onset: 'Gradually over months and years', body: 'No', newmeds: 'No', symptoms: 'No',
  mood: 'No', phq1: 'Not at all', phq2: 'Not at all',
  meds: [], pref: NOPREF, finSE: 'No', minSE: 'No', comboSE: 'No',
  conditions: [], scalp1: [], scalp2: [], scalp3: [],
  finAgree: true, nhs: false, gp: false,
};

function steps(a) {
  const s = []; const click = (text, q, extra) => s.push(Object.assign({ do: 'click', text, _q: q }, extra || {}));
  const cont = q => click('Continue', q + ' continue'); const text = q => { s.push({ do: 'fill', selector: 'textarea', value: 'test', _q: q + ' free text (neutral filler)' }); cont(q); };
  s.push({ do: 'wait', ms: 2500, _q: 'wait for survey to load' });
  click(a.existing, '5140 existing customer'); if (a.existing === 'Yes') { s.push({ do: 'wait', ms: 2500 }); return s; }
  click(a.gender, '5141 gender at birth'); if (a.gender === 'Female') { s.push({ do: 'wait', ms: 1500 }); return s; }
  if (a.accept) click('I accept', '5142 declaration'); cont('5142'); if (!a.accept) { s.push({ do: 'wait', ms: 1000 }); return s; }
  click(a.picture, '5147 hair picture'); s.push({ do: 'wait', ms: 800 });
  click(a.onset, '5143 onset');
  if (a.onset === SUDDEN) { click(a.body, '5144 body hair'); click(a.newmeds, '5145 new medicines'); click(a.symptoms, '5146 other symptoms'); }
  click(a.mood, '3216 mood');
  if (a.mood === 'Yes') { text('3217'); click(a.phq1, '3275 PHQ interest'); click(a.phq2, '3276 PHQ low mood'); }
  if (a.meds.length) a.meds.forEach(m => click(m, '5148 past medicines')); else click('None of these', '5148 past medicines'); cont('5148');
  click(a.pref, 'treatment type preference');
  if (a.meds.includes(MED[0])) { click(a.finSE, '5149 finasteride side effects'); if (a.finSE === 'Yes') text('5150'); }
  if (a.meds.includes(MED[1])) { click(a.minSE, '5151 minoxidil side effects'); if (a.minSE === 'Yes') text('5152'); }
  if (a.meds.includes(MED[2])) { click(a.comboSE, '5153 combination side effects'); if (a.comboSE === 'Yes') text('5154'); }
  if (a.conditions.length) a.conditions.forEach(c => click(c, '5155 conditions')); else click('None of these', '5155 conditions'); cont('5155');
  COND.forEach((c, i) => {
    if (!a.conditions.includes(c)) return;
    text(['5158', '5159', '5160', '5161', '5162', '5163', '5164', '5165', '5166'][i]);
    if (c === SCALP) {
      (a.scalp1.length ? a.scalp1 : ['None of the above']).forEach(o => click(o, '5613 scalp symptoms')); cont('5613');
      (a.scalp2.length ? a.scalp2 : ['I haven’t tried anything yet']).forEach(o => click(o, '5614 scalp treatments tried')); cont('5614');
      (a.scalp3.length ? a.scalp3 : ['None of the above']).forEach(o => click(o, '5615 scalp red flags')); cont('5615');
    }
  });
  click('Read more', 'expand the finasteride statement (information only)');
  if (a.finAgree) click('I confirm that I have read and understood the above statement', 'finasteride-agreement (required tick)');
  if (a.nhs) { click('NHS Summary Of Care', 'optional NHS record consent: open'); click('I agree', 'optional NHS record consent: agree'); }
  if (a.gp) { click('GP Consent', 'optional GP sharing consent: open'); click('I agree', 'optional GP sharing consent: agree', a.nhs ? { nth: 1 } : {}); }
  cont('finasteride page -> account form (ACCOUNT WALL: nothing is entered there)');
  s.push({ do: 'wait', ms: 1500 });
  return s;
}

const X = [];
const exp = (id, changed, patch, neutral) => X.push({ id, changed, patch, neutral: neutral || '' });
exp('exp-01', 'men-q01 existing customer: No → Yes', { existing: 'Yes' });
exp('exp-02', 'men-q02 gender at birth: Male → Female', { gender: 'Female' });
exp('exp-03', 'men-q03 declaration: ticked → left unticked', { accept: false });
exp('exp-04', 'men-q04 picture: Temples/Crown → Temples only (receding at the front)', { picture: 'Temples only (receding at the front)' });
exp('exp-05', 'men-q04 picture: Temples/Crown → Random patches', { picture: 'Random patches' });
exp('exp-06', 'men-q04 picture: Temples/Crown → Completely bald', { picture: 'Completely bald' });
exp('exp-07', 'men-q05 onset: Gradually → Suddenly', { onset: SUDDEN }, 'The three follow-ups that opened were all answered No.');
exp('exp-08', 'men-q06 body hair loss: No → Yes (on top of Suddenly)', { onset: SUDDEN, body: 'Yes' }, 'Compared with exp-07, not with the baseline. Other follow-ups No.');
exp('exp-09', 'men-q07 new medicines recently: No → Yes (on top of Suddenly)', { onset: SUDDEN, newmeds: 'Yes' }, 'Compared with exp-07. Other follow-ups No.');
exp('exp-10', 'men-q08 other physical symptoms: No → Yes (on top of Suddenly)', { onset: SUDDEN, symptoms: 'Yes' }, 'Compared with exp-07. Other follow-ups No.');
exp('exp-11', 'men-q09 mood or antidepressants: No → Yes', { mood: 'Yes' }, 'Text box given the word "test"; both two-week questions answered "Not at all".');
exp('exp-12', 'men-q11 little interest or pleasure: Not at all → Nearly every day (on top of mood Yes)', { mood: 'Yes', phq1: 'Nearly every day' }, 'Compared with exp-11.');
exp('exp-13', 'men-q12 down, depressed or hopeless: Not at all → Nearly every day (on top of mood Yes)', { mood: 'Yes', phq2: 'Nearly every day' }, 'Compared with exp-11.');
exp('exp-14', 'men-q13 past medicines: None → Finasteride or Propecia', { meds: [MED[0]] }, 'Side-effect question that opened answered No.');
exp('exp-15', 'men-q15 finasteride side effects: No → Yes (on top of exp-14)', { meds: [MED[0]], finSE: 'Yes' }, 'Compared with exp-14. Optional text box given the word "test".');
exp('exp-16', 'men-q13 past medicines: None → Minoxidil or Regaine', { meds: [MED[1]] }, 'Side-effect question that opened answered No.');
exp('exp-17', 'men-q17 minoxidil side effects: No → Yes (on top of exp-16)', { meds: [MED[1]], minSE: 'Yes' }, 'Compared with exp-16. Optional text box given the word "test".');
exp('exp-18', 'men-q13 past medicines: None → Topical Finasteride Minoxidil Combination', { meds: [MED[2]] }, 'Side-effect question that opened answered No.');
exp('exp-19', 'men-q19 combination side effects: No → Yes (on top of exp-18)', { meds: [MED[2]], comboSE: 'Yes' }, 'Compared with exp-18. Optional text box given the word "test".');
exp('exp-20', 'men-q14 format preference: I don’t mind → Topical sprays', { pref: 'Topical sprays - (apply to scalp)' });
exp('exp-21', 'men-q14 format preference: I don’t mind → Oral capsule', { pref: 'Oral capsule - (take once a day)' });
COND.forEach((c, i) => exp('exp-' + (22 + i), 'men-q21 conditions: None → ' + c, { conditions: [c] },
  c === SCALP ? 'Text box "test"; the three scalp tick-box screens answered None of the above / I haven’t tried anything yet / None of the above.' : 'Text box that opened given the word "test".'));
exp('exp-31', 'men-q30 scalp red flags: None of the above → Open sores, broken skin or infection on the scalp (on top of Scalp Disorders)', { conditions: [SCALP], scalp3: ['Open sores, broken skin or infection on the scalp'] }, 'Compared with exp-27.');
exp('exp-32', 'men-q30 scalp red flags: None of the above → Severe scalp pain, oozing or signs of infection (on top of Scalp Disorders)', { conditions: [SCALP], scalp3: ['Severe scalp pain, oozing or signs of infection'] }, 'Compared with exp-27.');
exp('exp-33', 'men-q28 scalp symptoms: None of the above → Previously diagnosed with seborrheic dermatitis (on top of Scalp Disorders)', { conditions: [SCALP], scalp1: ['Previously diagnosed with seborrheic dermatitis'] }, 'Compared with exp-27.');
exp('exp-34', 'men-q29 scalp treatments tried: I haven’t tried anything yet → Prescription scalp treatments (on top of Scalp Disorders)', { conditions: [SCALP], scalp2: ['Prescription scalp treatments'] }, 'Compared with exp-27.');
exp('exp-35', 'men-q37 finasteride statement tick: ticked → left unticked', { finAgree: false });
exp('exp-36', 'men-q38 NHS Summary Care Record consent: not given → I agree', { nhs: true });
exp('exp-37', 'men-q39 GP sharing consent: not given → I agree', { gp: true });

const only = process.argv.slice(2);
X.forEach(x => {
  if (only.length && !only.includes(x.id)) return;
  const dir = path.join(ROOT, 'runs', x.id); fs.mkdirSync(dir, { recursive: true });
  const a = Object.assign({}, BASE, x.patch);
  fs.writeFileSync(path.join(dir, 'actions.json'), JSON.stringify({
    _about: 'Sons UK hair consultation, stage 2 one-change experiment ' + x.id + '. Changed: ' + x.changed + '. ' + (x.neutral ? x.neutral + ' ' : '') + 'Everything else is the baseline man. The walk never types into the account form.',
    start: START, steps: steps(a) }, null, 1));
});
fs.writeFileSync(path.join(ROOT, 'scripts', 's2-experiments.json'), JSON.stringify(X, null, 1));
console.log(X.length + ' experiment files written');
module.exports = { steps, BASE };
