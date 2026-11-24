#!/usr/bin/env node
/*
 * exp.js — stage 2 one-change experiment runner for LloydsPharmacy hair loss (uses explore.js in this folder).
 * Usage: node tools/exp.js <exp-id> '<overrides JSON>' [--full]
 *   overrides: { "<questionId>": answer | null }  (null removes the baseline answer)
 * Builds runs/<exp-id>/policy.json from baseline-men.json, stops at the recommendation screen
 * (unless --full: then it also picks the Finasteride card, pack size and safety screen, and stops before the final consent),
 * runs explore.js, and prints a comparison with the baseline reference run (runs/exp-base).
 * Neutral answers are given for every follow-up screen (consents "I understand", free text "None", Yes/No -> No).
 */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const DIR = path.join(__dirname, '..');
const [id, ovr, flag] = process.argv.slice(2);
const base = JSON.parse(fs.readFileSync(path.join(DIR, 'baseline-men.json'), 'utf8'));
const answers = Object.assign({}, base.answers);
if (flag !== '--full') { delete answers['107988']; delete answers['108082']; delete answers['107986']; }
const neutral = {
  '108138': 'I understand that results can be less predictable in these areas',
  '108376': 'I understand that significant regrowth may be less likely',
  '108139': 'I understand', '103277': 'I understand', '108405': 'I understand', '108004': 'I understand', '108002': 'I confirm',
  '108131': 'I understand that if I am currently experiencing thoughts of self-harm or suicide I should seek medical advice immediately',
  '103268': 'I understand and would like to continue',
  '108416': { text: 'Low mood in 2019, fully resolved, stable since then' }, '108417': { text: 'My GP, not seen for it since 2019' }, '108418': { text: 'No medication was taken for it at any time' }, '108419': 'No',
  '103275': { text: 'Not applicable, no further details to add' }, '107160': { text: 'Mild hay fever, no treatment needed' }, '101599': { text: 'No other medicines taken regularly' },
  '101564': 'More than 30', '108016': "Yes, it's helped", '107959': 'No', '107981': { text: 'Mild scalp itching that settled on its own' },
};
for (const k in neutral) if (!(k in answers)) answers[k] = neutral[k];
const o = ovr ? JSON.parse(ovr) : {};
for (const k in o) { if (o[k] === null) delete answers[k]; else answers[k] = o[k]; }
const out = path.join(DIR, 'runs', id);
fs.mkdirSync(out, { recursive: true });
const pol = { note: 'exp ' + id + ' overrides ' + JSON.stringify(o), answers, default: 'auto', prefer: ["Yes, it's helped", '12 months or longer'], explain: false, maxSteps: 60, maxSeconds: 420 };
fs.writeFileSync(path.join(out, 'policy.json'), JSON.stringify(pol, null, 1));
let stdout = '';
try { stdout = cp.execFileSync('node', [path.join(__dirname, 'explore.js'), path.join(out, 'policy.json'), out], { encoding: 'utf8', timeout: 480000, maxBuffer: 50e6 }); }
catch (e) { stdout = (e.stdout || '') + '\nERR ' + e.message.split('\n')[0]; }
fs.writeFileSync(path.join(out, 'stdout.txt'), stdout);
require('./cmp.js')(out, path.join(DIR, 'runs', 'exp-base'));
