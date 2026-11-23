#!/usr/bin/env node
/* make-walk.js — write a walk.js actions file for one Boots Online Doctor hair-loss route.
 *
 *   node scripts/make-walk.js <route> <out.json> [overrides.json] [--dob DDMMYYYY]
 *
 *   route: first-tablets | first-bundle | returning-tablets | returning-bundle
 *   overrides.json (optional): { "<regex on question text>": "<option label>" | ["label", …] | {"label": "…", "details": "free text"} }
 *     e.g. { "partner pregnant": "My partner is trying to get pregnant" }
 *     Follow-up questions that the changed answer opens are answered from the same table (BASE below, then overrides).
 *     If a follow-up has no entry the script stops and names it: add it to the overrides.
 *
 * It follows the app's own display logic: one screen per section; the first question without a display condition is
 * shown; after Next, each follow-up whose condition matches the answer to that first question is shown in order.
 * The walk ends after the last Next (the ID photo screen). NEVER add steps after that: no photos, no account.
 */
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..');
const args = process.argv.slice(2);
const dobI = args.indexOf('--dob'); const dob = dobI > -1 ? args[dobI + 1] : '15061994';
const pos = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--dob');
const [route, outFile, ovFile] = pos;
const ROUTES = {
  'first-tablets': { def: 'quiz-definition.json', used: 'First time using this service', price: '£28', more: false },
  'first-bundle': { def: 'quiz-definition-combo-regaine.json', used: 'First time using this service', price: '£50.36', more: true },
  'returning-tablets': { def: 'quiz-definition-returning.json', used: 'Returning for this service', price: '£80', more: false },
  'returning-bundle': { def: 'quiz-definition-returning-combo-regaine.json', used: 'Returning for this service', price: '£50.36', more: true }
};
if (!ROUTES[route] || !outFile) { console.error('usage: node make-walk.js <first-tablets|first-bundle|returning-tablets|returning-bundle> <out.json> [overrides.json] [--dob DDMMYYYY]'); process.exit(1); }
const R = ROUTES[route];
const def = JSON.parse(fs.readFileSync(path.join(dir, R.def), 'utf8'));
const overrides = ovFile ? JSON.parse(fs.readFileSync(ovFile, 'utf8')) : {};

/* baseline man: 32, temples and crown, gradual, more than a month, nothing else */
const BASE = [
  ['check your age', 'Between 18 and 50 years old'],
  ['best describes your hair loss', 'Temples and Crown'],
  ['Do you have any of the following\\? Please select', 'None of the above'],
  ['broken, infected, shaved or inflamed', 'No'],
  ['lost any hair elsewhere', 'No'],
  ['When did you start losing', 'More than a month ago'],
  ['How did your hair loss start', 'Gradually'],
  ['currently using Finasteride or Propecia', 'No'],
  ['Is your partner pregnant', 'None of these apply'],
  ['medication for a prostate condition', 'No'],
  ['medication for high blood pressure \\(hypertension\\)\\?', 'No'],
  ['prescription-only medicines, over-the-counter', 'No'],
  ["don't take any medication at all", "Correct - I'm not on any medication"],
  ['any of the following conditions', 'None of these apply'],
  ['other significant medical conditions', 'No'],
  ['known allergies', 'No'],
  ['check your understanding', 'True'],
  ['can affect prostate blood test', null],          // single acknowledge option: taken automatically
  ['important side effects that have occurred', null],
  ['If you experience these side effects', 'I understand and wish to proceed'],
  ['tell your GP', "No (This won't affect our review of your order, but we would encourage you to tell your GP)"],
  ['anything else you want to tell me', 'No'],
  ['Please confirm', null]
];
function answerFor(q) {
  for (const k of Object.keys(overrides)) if (new RegExp(k, 'i').test(q.text)) return overrides[k];
  if (q.options.length === 1) return q.options[0].text;                    // acknowledge / confirm screens
  for (const [k, v] of BASE) if (new RegExp(k, 'i').test(q.text)) { if (v) return v; }
  throw new Error('No answer set for question: "' + q.text.slice(0, 100) + '" — add it to the overrides file. Options: ' + q.options.map(o => JSON.stringify(o.text)).join(', '));
}
const esc = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const optSel = label => `.radio-answer:has(label:text-is("${esc(label)}")), .checkbox-answer:has(label:text-is("${esc(label)}"))`;
const NEXT = { do: 'click', selector: 'button.questionnaire__btn-next', settle: 1500 };

const steps = [
  { do: 'wait', ms: 2000 },
  { do: 'click', selector: 'input[name=zip]' }, { do: 'type', value: 'N1 0QH' }, { do: 'wait', ms: 3000 },
  { do: 'click', selector: '#next-step' }, { do: 'wait', ms: 1500 },
  { do: 'click', text: 'Male' }, { do: 'click', text: 'NEXT' }, { do: 'wait', ms: 2000 },
  { do: 'click', selector: '#dob-preflight' }, { do: 'type', value: dob }, { do: 'wait', ms: 3000 },
  { do: 'click', text: 'NEXT' }, { do: 'wait', ms: 5000 },
  { do: 'click', text: R.used }, { do: 'wait', ms: 5000 }
];
if (R.more) steps.push({ do: 'click', text: 'See more treatment options' }, { do: 'wait', ms: 2000 });
steps.push({ do: 'click', selector: `[role=button]:has-text("${R.price}")` }, { do: 'wait', ms: 4000 },
  { do: 'click', text: 'CONTINUE' }, { do: 'wait', ms: 5000 },
  { do: 'click', selector: 'label[for=agreeRadio]' }, { do: 'click', selector: '#important-info button.btn' }, { do: 'wait', ms: 5000 });
const quizStart = steps.length + 1;

const log = [];
def.sections.forEach((sec, si) => {
  const root = sec.questions.find(q => !q.display_condition);
  const picked = {};                                  // option ids chosen on the root question
  const ask = q => {
    let a = answerFor(q); const list = Array.isArray(a) ? a : [a];
    list.forEach(item => {
      const label = typeof item === 'string' ? item : item.label;
      const op = q.options.find(o => o.text === label);
      if (!op) throw new Error(`Option "${label}" not found in "${q.text.slice(0, 80)}". Options: ${q.options.map(o => JSON.stringify(o.text)).join(', ')}`);
      steps.push({ do: 'click', selector: optSel(label) });
      if (op.details && op.type !== 'address') {
        const txt = (typeof item === 'object' && item.details) || 'test';
        steps.push({ do: 'fill', selector: 'textarea.all-textarea-radio:visible, textarea.all-textarea-checkbox:visible', value: txt });
      }
      if (op.details && op.type === 'address') throw new Error('The GP "Yes" option opens a GP practice search (third-party details): not allowed in this research.');
      if (q === root) picked[op.id] = true;
      log.push(`screen ${si + 1}: ${q.text.slice(0, 70)} → ${label}`);
    });
    steps.push(NEXT);
  };
  ask(root);
  sec.questions.filter(q => q.display_condition && q.display_condition.options.some(oid => picked[oid])).forEach(ask);
});
steps.push({ do: 'wait', ms: 7000 });

const out = {
  start: 'https://onlinedoctor-clinic.boots.com/Hair-Loss',
  note: `Route ${route}, questionnaire ${def.id}. Health questions start at step ${quizStart}. Last screen should be /camera/id (ID photos): STOP there. Postcode N1 0QH is the placeholder found in the site's own code; no contact details are entered.`,
  answers: log, steps
};
fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
console.log(`wrote ${outFile}: ${steps.length} steps, questions start at step ${quizStart}\n` + log.join('\n'));
