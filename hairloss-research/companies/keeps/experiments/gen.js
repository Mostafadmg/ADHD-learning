// Stage 2 (EXPERIMENT): writes one answer file per one-change experiment. Run: node experiments/gen.js
// Each file is the baseline with ONE answer changed (the "_changed" field says which). Replay with walk.js.
const fs = require('fs'), path = require('path');
const OUT = __dirname;
const BASE = { goal: 'Regrow lost hair - Regrow', stage: 'Receding hairline or crown thinning', picture: 'Moderate', picture2: null,
  duration: '1-3 years', comments: 'No', treated: 'No', results: null, form: "I'm not sure - help me choose",
  priority: 'Balanced results & long-term care', state: 'Texas', tick: true, tail: 'plan' };
const loose = t => ({ do: 'click', text: t, exact: false });
const exact = t => ({ do: 'click', text: t });
function main(a, gel) {
  a = Object.assign({}, BASE, a);
  const s = [];
  s.push(exact(a.goal));
  s.push(a.stage.startsWith("I'm not sure") ? exact(a.stage) : loose(a.stage));
  if (a.picture2) { s.push(loose('Not seeing a match?')); s.push(exact(a.picture2)); } else s.push(exact(a.picture));
  if (a.picture2 === 'Mostly Scalp') { s.push({ do: 'wait', ms: 2000 }); return s; }
  s.push(exact(a.duration));
  s.push(exact(a.comments));
  s.push(exact(a.treated));
  if (a.treated === 'Yes') s.push(exact(a.results));
  s.push(exact('Continue'));
  if (!gel) s.push(a.form.startsWith("I'm not sure") ? exact(a.form) : loose(a.form));
  s.push(a.priority.startsWith("I'm not sure") ? exact(a.priority) : loose(a.priority));
  s.push(exact('Continue')); s.push(exact('Continue'));
  s.push({ do: 'wait', ms: 6500 });
  s.push({ do: 'fill', selector: 'input[id^=react-select]', value: a.state });
  s.push({ do: 'press', key: 'Enter' });
  if (a.tick) s.push(exact('I confirm I am 18+ and assigned male at birth'));
  if (a.tail === 'gate') { s.push({ do: 'wait', ms: 1500 }); return s; }
  if (a.tail === 'gate-click') { s.push(exact('Show my plan')); s.push({ do: 'wait', ms: 2500 }); return s; }
  s.push(exact('Show my plan'));
  s.push({ do: 'wait', ms: 7000 });
  s.push({ do: 'scroll' });
  if (a.tail === 'checkout') { s.push({ do: 'click', selector: 'button:has-text("Continue to checkout"):not([disabled])' }); s.push({ do: 'wait', ms: 4000 }); s.push({ do: 'scroll' }); }
  if (a.tail === 'switch') { s.push(loose(gel ? 'Want to switch to oral solutions?' : 'Want to switch to topical solutions?')); s.push({ do: 'wait', ms: 2500 }); s.push({ do: 'scroll' }); }
  return s;
}
const LBASE = { where: 'A bit of both', family: null, expect: 'I want to regrow my hair', form: "I'm not sure / I don't have a preference",
  ingredients: "I'm not sure / I'm interested in any effective ingredients!", otc: "I'm not interested in any specific over-the-counter products", dandruff: 'No' };
function legacy(a) {
  a = Object.assign({}, LBASE, a);
  const s = [];
  s.push(loose(a.where));
  if (a.where.startsWith('Patchy')) { s.push({ do: 'wait', ms: 4000 }); s.push({ do: 'scroll' }); return s; }
  if (a.where.startsWith('Nowhere')) { s.push(loose(a.family)); s.push(loose('CONTINUE')); }
  else { s.push(exact(a.expect)); s.push(loose('CONTINUE')); s.push(loose(a.form)); }
  s.push(loose(a.ingredients)); s.push(loose('CONTINUE'));
  s.push(loose(a.otc)); s.push(loose('CONTINUE'));
  s.push(exact(a.dandruff));
  s.push({ do: 'wait', ms: 5000 }); s.push({ do: 'scroll' });
  return s;
}
const H = { locale: 'en-US', timezone: 'America/Chicago' };
const E = [];
const m = (id, changed, a) => E.push({ id, flow: 'men', changed, file: Object.assign({ _changed: changed, start: 'https://www.keeps.com/hair-assessment-quiz' }, H, { steps: main(a, false) }) });
const g = (id, changed, a) => E.push({ id, flow: 'men-gel', changed, file: Object.assign({ _changed: changed, start: 'https://www.keeps.com/hair-assessment-quiz-gel' }, H, { steps: main(a, true) }) });
const l = (id, changed, a) => E.push({ id, flow: 'men-legacy', changed, file: Object.assign({ _changed: changed, start: 'https://www.keeps.com/quiz?step=1' }, H, { steps: legacy(a) }) });

// ---- main quiz
m('exp-01', "men-form: 'I'm not sure - help me choose' → 'Topical Drop (Rx Serum)'", { form: 'Topical Drop (Rx Serum)', tail: 'checkout' });
m('exp-02', "men-priority: 'Balanced results & long-term care' → 'Keeping treatment simple & affordable'", { priority: 'Keeping treatment simple & affordable', tail: 'checkout' });
m('exp-03', "men-priority: 'Balanced…' → 'Keeping treatment simple & affordable', on top of exp-01 (form = Topical Drop)", { form: 'Topical Drop (Rx Serum)', priority: 'Keeping treatment simple & affordable', tail: 'checkout' });
m('exp-04', "men-form: 'I'm not sure - help me choose' → 'Daily Chew (Oral Rx)'", { form: 'Daily Chew (Oral Rx)' });
m('exp-05', "men-priority: 'Balanced…' → 'Seeing results as soon as possible'", { priority: 'Seeing results as soon as possible' });
m('exp-06', "men-priority: 'Balanced…' → skip link 'I'm not sure - help me choose'", { priority: "I'm not sure - help me choose" });
m('exp-07', "men-picture: 'Moderate' → 'Not seeing a match?' → 'Mostly Scalp'", { picture2: 'Mostly Scalp' });
m('exp-08', "men-picture: 'Moderate' → 'Not seeing a match?' → 'Patchy Loss'", { picture2: 'Patchy Loss' });
m('exp-09', "men-state: Texas → Idaho (one of the 12 states the code refuses)", { state: 'Idaho', tail: 'gate-click' });
m('exp-09a-arkansas-gate', "men-state: Texas → Arkansas (typed 'Kansas'; the search box matched Arkansas first). Stopped before 'Show my plan'.", { state: 'Kansas', tail: 'gate' });
m('exp-10', "men-state: Texas → California", { state: 'California' });
m('exp-11', "men-treated: 'No' → 'Yes', then new question 'How did it go?' = 'Had side effects'", { treated: 'Yes', results: 'Had side effects' });
m('exp-12', "men-duration: '1-3 years' → 'Less than 6 months'", { duration: 'Less than 6 months' });
m('exp-13', "men-stage: 'Receding hairline or crown thinning' → 'Advanced hair loss'", { stage: 'Advanced hair loss' });
m('exp-14', "men-goal: 'Regrow lost hair - Regrow' → 'Keep my hair - Preserve'", { goal: 'Keep my hair - Preserve' });
m('exp-15', "men-picture: 'Moderate' → 'Advanced'", { picture: 'Advanced' });
m('exp-16', "men-comments: 'No' → 'Yes'", { comments: 'Yes' });
m('exp-17', "men-plan: baseline answers, then click 'Want to switch to topical solutions?' on the plan page", { tail: 'switch' });
m('exp-18', "men-treated: 'No' → 'Yes', then 'How did it go?' = 'Didn't see results'", { treated: 'Yes', results: "Didn't see results" });
m('exp-19', "men-picture: 'Moderate' → 'Not seeing a match?' → 'Diffuse Thinning'", { picture2: 'Diffuse Thinning' });
// ---- gel quiz
g('exp-g1', "gel-priority: 'Balanced…' → 'Keeping treatment simple & affordable'", { priority: 'Keeping treatment simple & affordable' });
g('exp-g2', "gel-plan: baseline answers, then click 'Want to switch to oral solutions?' on the plan page", { tail: 'switch' });
g('exp-g3', "gel-picture: 'Moderate' → 'Not seeing a match?' → 'Mostly Scalp'", { picture2: 'Mostly Scalp' });
// ---- legacy quiz
l('exp-L01', "leg-where: 'A bit of both' → 'Hairline'", { where: 'Hairline' });
l('exp-L02', "leg-where: 'A bit of both' → 'Crown'", { where: 'Crown' });
l('exp-L03', "leg-where: 'A bit of both' → 'Patchy (coin-sized bald spots)'", { where: 'Patchy' });
l('exp-L04', "leg-where: 'A bit of both' → 'Nowhere yet, but I'd like to prevent future hair loss' (new family question answered 'I'm not sure')", { where: 'Nowhere yet', family: 'not sure' });
l('exp-L05', "leg-form: 'no preference' → 'Pills (taken orally)'", { form: 'Pills (taken orally)' });
l('exp-L06', "leg-form: 'no preference' → 'Topicals (applied directly to head)'", { form: 'Topicals (applied directly to head)' });
l('exp-L07', "leg-form: 'no preference' → 'Topicals', on top of exp-L01 (where = Hairline)", { where: 'Hairline', form: 'Topicals (applied directly to head)' });
l('exp-L08', "leg-ingredients: 'I'm not sure' → 'Products with finasteride' only", { ingredients: 'Products with finasteride' });
l('exp-L09', "leg-ingredients: 'I'm not sure' → 'Products with minoxidil' only", { ingredients: 'Products with minoxidil' });
l('exp-L10', "leg-ingredients: 'I'm not sure' → 'Products with tretinoin' only", { ingredients: 'Products with tretinoin' });
l('exp-L11', "leg-ingredients: 'I'm not sure' → 'Products with saw palmetto' only", { ingredients: 'Products with saw palmetto' });
l('exp-L12', "leg-ingredients: 'I'm not sure' → 'Products with ketoconazole' only", { ingredients: 'Products with ketoconazole' });
l('exp-L13', "leg-otc: 'not interested' → 'Vitamins and supplements' only", { otc: 'Vitamins and supplements' });
l('exp-L14', "leg-otc: 'not interested' → 'Hair care products (shampoo and conditioner)' only", { otc: 'Hair care products' });
l('exp-L15', "leg-otc: 'not interested' → 'Hair styling products (pomade)' only", { otc: 'Hair styling products' });
l('exp-L16', "leg-dandruff: 'No' → 'Yes'", { dandruff: 'Yes' });
l('exp-L17', "leg-expect: 'I want to regrow my hair' → 'I want thicker hair' only", { expect: 'I want thicker hair' });
l('exp-L18', "leg-expect: 'I want to regrow my hair' → 'I want to prevent hair loss' only", { expect: 'I want to prevent hair loss' });
l('exp-L19', "leg-form: 'no preference' → 'Pills', on top of exp-L01 (where = Hairline)", { where: 'Hairline', form: 'Pills (taken orally)' });

for (const e of E) fs.writeFileSync(path.join(OUT, e.id + '.json'), JSON.stringify(e.file, null, 1));
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(E.map(e => ({ id: e.id, flow: e.flow, changed: e.changed })), null, 1));
console.log(E.length + ' experiment files written to ' + OUT);
