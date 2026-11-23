// Stage 2: action files for the side flows (beard, oral minoxidil 5 mg step-up) and the end of the female stop screen.
// Same rules as s2-make.js: one change per file, neutral answers for anything that opens, nothing typed into an account
// form, and no form is ever sent. usage: node scripts/s2-make-extra.js
const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..');
const BEARD = 'https://shop.sons.co.uk/beard-consultation/';
const OM5 = 'https://shop.sons.co.uk/consultation/?logged_in=false&oral_minoxidil_5mg=true';
const HAIR = 'https://shop.sons.co.uk/consultation/?logged_in=false';
const c = (text, q, extra) => Object.assign({ do: 'click', text, _q: q }, extra || {});
const w = ms => ({ do: 'wait', ms });

function beard(a) {
  const s = [w(2500), c('No', '5140 existing customer'), c(a.gender, '5141 gender at birth')];
  if (a.gender === 'Female') return s.concat([w(2000)]);
  s.push(c('I accept', '5142 declaration'), c('Continue', '5142 continue'), c(a.pattern, '5172 beard pattern'), c('No', '5173 hair loss elsewhere on the body'), c('No', '5175 minoxidil before'),
    c(a.allergy, '5178 allergic to minoxidil or tretinoin'), c(a.face, '5179 face conditions'), c('Continue', '5179 continue'));
  if (a.face === 'Psoriasis') s.push(c('Yes', '5180 willing to proceed (neutral: Yes)'));
  s.push(w(1500));
  return s;
}
const BB = { gender: 'Male', pattern: 'Slow, patchy or thin growth areas', allergy: 'No', face: 'None of these' };
const om5 = a => [w(3500), c('I\'ve had some improvement but it now seems to have plateaued', '5712 response so far'), c(a.se, '5713 side effects on 2.5 mg', { nth: 0 }),
  c('No', '5715 changes to health or medicines', { nth: a.se === 'Yes' ? 0 : 1 }), w(1000)];

const X = [
  { id: 'exp-38', flow: 'beard', changed: 'none: baseline for the beard flow (male, slow patchy growth, no hair loss elsewhere, no minoxidil before, no allergy, no face conditions)', start: BEARD, steps: beard(BB), neutral: '' },
  { id: 'exp-39', flow: 'beard', changed: 'beard-q4 pattern: Slow, patchy or thin growth areas → New/sudden well-defined areas of beard loss', start: BEARD, steps: beard(Object.assign({}, BB, { pattern: 'New/sudden well-defined areas of beard loss' })), neutral: 'Compared with exp-38.' },
  { id: 'exp-40', flow: 'beard', changed: 'beard-q10 allergic to minoxidil or tretinoin: No → Yes', start: BEARD, steps: beard(Object.assign({}, BB, { allergy: 'Yes' })), neutral: 'Compared with exp-38.' },
  { id: 'exp-41', flow: 'beard', changed: 'beard-q11 face conditions: None of these → Psoriasis', start: BEARD, steps: beard(Object.assign({}, BB, { face: 'Psoriasis' })), neutral: 'Compared with exp-38. The "willing to proceed?" question that opened was answered Yes.' },
  { id: 'exp-42', flow: 'beard', changed: 'beard-q2 gender at birth: Male → Female', start: BEARD, steps: beard(Object.assign({}, BB, { gender: 'Female' })), neutral: 'Compared with exp-38. The button on the screen was not pressed.' },
  { id: 'exp-44', flow: 'oral-minoxidil-5mg', changed: 'none: baseline for the 5 mg step-up form (some improvement but plateaued, no side effects, no changes); the consent box was left unticked and the form was not sent', start: OM5, steps: om5({ se: 'No' }), neutral: '' },
  { id: 'exp-43', flow: 'oral-minoxidil-5mg', changed: 'om5-q2 side effects on 2.5 mg: No → Yes', start: OM5, steps: om5({ se: 'Yes' }), neutral: 'Compared with exp-44. The text box that opened was left empty; the form was not sent.' },
  { id: 'exp-45', flow: 'men', changed: 'men-q02 Female, then the "Finish Consultation" button on the stop notice is pressed', start: HAIR, steps: [w(2500), c('No', '5140'), c('Female', '5141'), w(1200), c('Finish Consultation', 'only button on the female notice'), w(5000)], neutral: 'Follow-on to exp-02: shows where the stop screen leads. Per the served code this button sends nothing to the server.' },
];
X.forEach(x => {
  const dir = path.join(ROOT, 'runs', x.id); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'actions.json'), JSON.stringify({ _about: 'Sons UK, stage 2 experiment ' + x.id + ' (' + x.flow + ' flow). Changed: ' + x.changed + '. ' + x.neutral + ' No contact details are typed and no form is sent.', start: x.start, steps: x.steps }, null, 1));
});
fs.writeFileSync(path.join(ROOT, 'scripts', 's2-experiments-extra.json'), JSON.stringify(X.map(({ id, flow, changed, neutral }) => ({ id, flow, changed, neutral })), null, 1));
console.log(X.length + ' extra experiment files written');
