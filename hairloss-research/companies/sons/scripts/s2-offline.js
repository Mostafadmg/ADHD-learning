// Stage 2: one-change experiments run OFFLINE through both copies of Sons' own recommendation code.
// The live site shows no plan before the account form, so product effects cannot be seen live. Instead the code the site
// serves to every visitor is run here on the baseline man's answers with one answer changed at a time.
//   older copy = scripts/engine-old-run.js (inline script of sons.co.uk/pages/recommendation, where new sign-ups are sent)
//   newer copy = engine-newer.extract.js    (shop.sons.co.uk/recommendation app code)
// Results are evidence type "code" (the site's code, run by us), never "observed".
// usage: node scripts/s2-offline.js      -> writes runs/offline/results.json and runs/offline/results.txt
const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..');
const old = require('./engine-old-run.js');
const mods = require('../engine-newer.extract.js');
const cache = {};
function req(id) { if (cache[id]) return cache[id].exports; const m = (cache[id] = { exports: {} }); mods[id](m, m.exports, req); return m.exports; }
req.d = (exp, defs) => { for (const k in defs) Object.defineProperty(exp, k, { enumerable: true, get: defs[k] }); }; req.r = () => {};
const newer = (answers, tags, special, chosen) => req(30216).S({ consultationResults: { consult_results: answers }, customerTags: tags || [], marketCode: 'uk', specialType: special || '', chosenProduct: chosen || null });

const PREF = 'What treatment type do you prefer?';
const dobForAge = age => { const d = new Date(); d.setFullYear(d.getFullYear() - age); d.setMonth(d.getMonth() - 6); return d.toISOString().slice(0, 10); };
const BASE = { 5140: 0, 5141: 0, 5142: [0], 5147: 1, 5143: 0, 3216: 0, 5148: ['none'], [PREF]: 2, 5155: ['none'], date_of_birth: dobForAge(32) };
const COND = ['High Blood Pressure', 'Cardiovascular Disease', 'Severe Kidney or Liver Disease', 'Prostate Disease, Male Breast Cancer or Testicular Cancer', 'Rheumatoid Arthritis, Systemic Lupus or on Methotrexate', 'Scalp Disorders', 'Phaeochromocytoma', 'Diagnosed Lactose Allergy', 'Sexual Dysfunction'];

const X = [];
const add = (id, changed, patch, opt) => X.push(Object.assign({ id, changed, answers: Object.assign({}, BASE, patch) }, opt || {}));
add('off-00', 'baseline man (no change)', {});
add('off-01', 'picture → Temples only', { 5147: 0 });
add('off-02', 'picture → Random patches', { 5147: 2 });
add('off-03', 'picture → Completely bald', { 5147: 3 });
add('off-04', 'onset → Suddenly (follow-ups No)', { 5143: 1, 5144: 0, 5145: 0, 5146: 0 });
add('off-05', 'Suddenly + body hair loss Yes', { 5143: 1, 5144: 1, 5145: 0, 5146: 0 }, { compare: 'off-04' });
add('off-06', 'Suddenly + new medicines Yes', { 5143: 1, 5144: 0, 5145: 1, 5146: 0 }, { compare: 'off-04' });
add('off-07', 'Suddenly + other symptoms Yes', { 5143: 1, 5144: 0, 5145: 0, 5146: 1 }, { compare: 'off-04' });
add('off-08', 'mood → Yes (both two-week answers Not at all)', { 3216: 1, 3217: 'test', 3275: 0, 3276: 0 });
[1, 2, 3].forEach(v => add('off-' + String(8 + v).padStart(2, '0'), 'mood Yes + little interest = ' + ['', 'Several days', 'More than half the days', 'Nearly every day'][v], { 3216: 1, 3217: 'test', 3275: v, 3276: 0 }, { compare: 'off-08' }));
[1, 2, 3].forEach(v => add('off-' + (11 + v), 'mood Yes + down/hopeless = ' + ['', 'Several days', 'More than half the days', 'Nearly every day'][v], { 3216: 1, 3217: 'test', 3275: 0, 3276: v }, { compare: 'off-08' }));
add('off-15', 'past medicines → Finasteride or Propecia (no side effects)', { 5148: [0], 5149: 0 });
add('off-16', 'finasteride side effects → Yes', { 5148: [0], 5149: 1, 5150: 'test' }, { compare: 'off-15' });
add('off-17', 'past medicines → Minoxidil or Regaine (no side effects)', { 5148: [1], 5151: 0 });
add('off-18', 'minoxidil side effects → Yes', { 5148: [1], 5151: 1, 5152: 'test' }, { compare: 'off-17' });
add('off-19', 'past medicines → Topical Finasteride Minoxidil Combination (no side effects)', { 5148: [2], 5153: 0 });
add('off-20', 'combination side effects → Yes', { 5148: [2], 5153: 1, 5154: 'test' }, { compare: 'off-19' });
add('off-21', 'preference → Topical sprays', { [PREF]: 0 });
add('off-22', 'preference → Oral capsule', { [PREF]: 1 });
COND.forEach((c, i) => add('off-' + (23 + i), 'conditions → ' + c, Object.assign({ 5155: [i] }, i === 5 ? { 5163: 'test', 5613: [5], 5614: [3], 5615: [2] } : { [5158 + i]: 'test' })));
add('off-32', 'Scalp Disorders + red flag: open sores, broken skin or infection', { 5155: [5], 5163: 'test', 5613: [5], 5614: [3], 5615: [0] }, { compare: 'off-28' });
add('off-33', 'Scalp Disorders + red flag: severe pain, oozing or signs of infection', { 5155: [5], 5163: 'test', 5613: [5], 5614: [3], 5615: [1] }, { compare: 'off-28' });
add('off-34', 'Scalp Disorders + all five scalp symptoms ticked', { 5155: [5], 5163: 'test', 5613: [0, 1, 2, 3, 4], 5614: [3], 5615: [2] }, { compare: 'off-28' });
add('off-35', 'Scalp Disorders + all three past scalp treatments ticked', { 5155: [5], 5163: 'test', 5613: [5], 5614: [0, 1, 2], 5615: [2] }, { compare: 'off-28' });
[17, 18, 21, 65, 66, 76].forEach((age, i) => add('off-' + (36 + i), 'age → ' + age + ' (date of birth changed; asked only on the account form)', { date_of_birth: dobForAge(age) }));
add('off-42', 'account tag finasteride_disallowed', {}, { tags: ['finasteride_disallowed'] });
add('off-43', 'account tag minoxidil_disallowed', {}, { tags: ['minoxidil_disallowed'] });
add('off-44', 'account tag dutasteride_eligible', {}, { tags: ['dutasteride_eligible'] });
add('off-45', 'account tag combo_pill_eligible + combo route', {}, { tags: ['combo_pill_eligible'], special: 'combo' });
add('off-46', 'account tag combo_pill_eligible, normal route', {}, { tags: ['combo_pill_eligible'] });
add('off-47', 'chosen product stored = finasteride tablets ("oral-tablet")', {}, { chosen: 'oral-tablet' });
add('off-48', 'chosen product stored = Ultimate Plan', {}, { chosen: 'ultimate-hair-loss-plan' });
// pairs (not one-change): how little can be left
add('off-49', 'PAIR High Blood Pressure + Sexual Dysfunction', { 5155: [0, 8] });
add('off-50', 'PAIR Diagnosed Lactose Allergy + Scalp Disorders', { 5155: [5, 7] });
add('off-51', 'PAIR Suddenly + High Blood Pressure', { 5143: 1, 5144: 0, 5145: 0, 5146: 0, 5155: [0] });
add('off-52', 'PAIR Suddenly + Scalp Disorders', { 5143: 1, 5144: 0, 5145: 0, 5146: 0, 5155: [5] });
add('off-53', 'PAIR Topical preference + Diagnosed Lactose Allergy', { [PREF]: 0, 5155: [7] });
add('off-54', 'ALL nine conditions + Suddenly + all side effects', { 5143: 1, 5148: [0, 1, 2], 5149: 1, 5151: 1, 5153: 1, 5155: [0, 1, 2, 3, 4, 5, 6, 7, 8] });
add('off-55', 'Scalp Disorders + scalp symptom: previously diagnosed with seborrheic dermatitis', { 5155: [5], 5163: 'test', 5613: [4], 5614: [3], 5615: [2] }, { compare: 'off-28' });
add('off-56', 'Scalp Disorders + tried before: prescription scalp treatments', { 5155: [5], 5163: 'test', 5613: [5], 5614: [1], 5615: [2] }, { compare: 'off-28' });
add('off-57', 'NHS Summary Care Record consent given', { 'nhs-summary-of-care': ['NHS Summary Of Care'], 'summary-of-care-agreement-dropdown': ['I agree'] });
add('off-58', 'GP sharing consent given', { 'gp-share': ['GP Consent'], 'gp-share-consultation-agreement-dropdown': ['I agree'] });
add('off-59', 'PAIR Scalp Disorders + Sexual Dysfunction', { 5155: [5, 8] });
add('off-60', 'PAIR Phaeochromocytoma + Scalp Disorders', { 5155: [5, 6] });
add('off-61', 'PAIR Diagnosed Lactose Allergy + High Blood Pressure', { 5155: [0, 7] });

const cardName = c => (c.slug || c.card) + ((c.paired_slug || c.toggle) ? ' (toggle: ' + (c.paired_slug || c.toggle) + ')' : '');
const flat = cards => cards.flatMap(c => [c.slug || c.card, c.paired_slug || c.toggle].filter(Boolean));
const sw = s => ['allowedOralFinasteride', 'allowedTopicalFinasteride', 'allowedOralMinoxidil', 'allowedTopicalMinoxidil', 'allowedTopicalCombo'].map(k => (s[k] ? '1' : '0')).join('');

(async () => {
  const res = {};
  for (const x of X) {
    const o = await old.run(x.answers, x.tags, x.chosen);
    const n = newer(x.answers, x.tags, x.special, x.chosen);
    res[x.id] = {
      id: x.id, changed: x.changed, compare: x.compare || 'off-00', answers: x.answers, tags: x.tags || [], special: x.special || '', chosen: x.chosen || '',
      older: { switches: sw(o.switches), primary: o.primary.map(cardName), secondary: o.additional.map(cardName), offered: flat(o.primary.concat(o.additional)), reasons: o.logicExplanations },
      newer: { switches: sw(n.eligibilityFlags), primary: n.primary.map(cardName), secondary: n.secondary.map(cardName), offered: flat(n.primary.concat(n.secondary)), blocked: n.blocked },
    };
  }
  const lines = ['Switch string = oral finasteride, topical finasteride, oral minoxidil, topical minoxidil, combination spray (1 = allowed, 0 = blocked).', ''];
  for (const x of X) {
    const r = res[x.id], b = res[r.compare];
    const diff = (a, c) => { const rem = c.filter(s => !a.includes(s)), addd = a.filter(s => !c.includes(s)); return (rem.length ? ' removed: ' + rem.join(', ') : '') + (addd.length ? ' added: ' + addd.join(', ') : '') || ' same set'; };
    lines.push(r.id + '  ' + r.changed + (r.compare !== 'off-00' ? '   [compared with ' + r.compare + ']' : ''));
    lines.push('   older ' + r.older.switches + '  primary: ' + r.older.primary.join(' + ') + '  |' + diff(r.older.offered, b.older.offered) + (Object.keys(r.older.reasons).length ? '  | hidden reasons: ' + Object.keys(r.older.reasons).join('; ') : ''));
    lines.push('   newer ' + r.newer.switches + '  primary: ' + r.newer.primary.join(' + ') + '  |' + diff(r.newer.offered, b.newer.offered));
    lines.push('   older rest: ' + r.older.secondary.join(' · '));
    lines.push('   newer rest: ' + r.newer.secondary.join(' · '));
    lines.push('');
  }
  fs.mkdirSync(path.join(ROOT, 'runs', 'offline'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'runs', 'offline', 'results.json'), JSON.stringify(res, null, 1));
  fs.writeFileSync(path.join(ROOT, 'runs', 'offline', 'results.txt'), lines.join('\n'));
  console.log(lines.join('\n'));
})();
