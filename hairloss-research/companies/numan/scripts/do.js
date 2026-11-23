#!/usr/bin/env node
/* do.js — send one command to a running session.js and print the screen that results.
 * usage: node do.js <sessionDir> '<command json>' [maxChars]
 * A command is one step {"do":"click","text":"Next"} or {"steps":[...]}.
 * It also prints the numan.com API calls made since the previous command (method, url, post body, response).
 * The engine flags from /bff/assessment/subscribe/calculate-web-directives are printed only where they differ
 * from the values seen on an empty questionnaire.
 */
const fs = require('fs');
const path = require('path');
const dir = process.argv[2]; const cmd = process.argv[3]; const max = parseInt(process.argv[4] || '2500', 10);
if (!dir || !cmd) { console.error("usage: node do.js <sessionDir> '<json>'"); process.exit(1); }
JSON.parse(cmd);
const DEFAULTS = { allergies: [], hasAllergies: false, hasAllergyToFinasteride: false, hasAllergyToMinoxidil: false, hasHeartProblems: false, hasMedicationHistory: false, hasUsedWegovyWithNoSideEffects: false, hasUsedWeightLossMedication: null, healthConcerns: [], isFemaleAssignedAtBirth: false, isFinasterideEligible: true, isMaleAssignedAtBirth: false, isMinoxidilEligible: true, isNotTakingEdTreatments: false, isTakingCialisTadalafil: false, isTakingViagraSildenafil: false, isWeightLossNewbie: null, isWeightLossSwitcher: null, weightLossAcquisitionCohort: null, weightLossSwitcherType: null, medicationHistory: [], previousGlp1Medication: '', previousGlp1MedicationDosage: '', previousMedication: '', previousMedicationDosage: '', unsuccessfulEdMedications: [] };
const n = fs.readdirSync(path.join(dir, 'cmd')).filter(f => f.endsWith('.json')).length + 1;
const name = String(n).padStart(3, '0');
const netFile = path.join(dir, 'network.jsonl');
const before = fs.existsSync(netFile) ? fs.readFileSync(netFile, 'utf8').split('\n').filter(Boolean).length : 0;
fs.writeFileSync(path.join(dir, 'cmd', name + '.json'), cmd);
const out = path.join(dir, 'out', name + '.txt');
const t0 = Date.now();
(function poll() {
  if (fs.existsSync(out)) {
    setTimeout(() => {
      let txt = fs.readFileSync(out, 'utf8');
      txt = txt.replace(/\n--- LINKS ---\n\s+link \(1\):\n\s+- Visit the main page -> \/\n/, '\n');
      console.log(txt.length > max ? txt.slice(0, max) + '\n…[cut, full text in ' + out + ']' : txt);
      const lines = fs.existsSync(netFile) ? fs.readFileSync(netFile, 'utf8').split('\n').filter(Boolean).slice(before) : [];
      console.log('--- API CALLS SINCE LAST COMMAND ---');
      for (const l of lines) {
        let e; try { e = JSON.parse(l); } catch (x) { continue; }
        if (!/api\.numan\.com|\/bff\//.test(e.url)) continue;
        let body = '';
        if (e.file) { try { body = fs.readFileSync(path.join(dir, e.file), 'utf8'); } catch (x) {} }
        if (/calculate-web-directives/.test(e.url)) {
          try {
            const r = JSON.parse(body).result; const diff = {};
            for (const k of Object.keys(r)) if (JSON.stringify(r[k]) !== JSON.stringify(DEFAULTS[k])) diff[k] = r[k];
            console.log('DIRECTIVES (non-default only): ' + JSON.stringify(diff));
          } catch (x) { console.log('DIRECTIVES unreadable: ' + body.slice(0, 300)); }
          continue;
        }
        if (/\/v1\/subscriptions\/[0-9a-f-]+$/.test(e.url) && e.method === 'GET') { console.log(`GET ${e.status} subscription (${e.size} bytes ${e.file || ''})`); continue; }
        console.log(`${e.method} ${e.status} ${e.url.replace(/subscriptions\/[0-9a-f-]+/, 'subscriptions/<id>')}${e.post ? '\n   POST: ' + e.post.slice(0, 1500) : ''}${body && e.size < 4000 ? '\n   RESP: ' + body.slice(0, 2500) : ' (' + e.size + ' bytes ' + (e.file || '') + ')'}`);
      }
    }, 300);
    return;
  }
  if (Date.now() - t0 > 120000) { console.log('timeout waiting for ' + out); process.exit(2); }
  setTimeout(poll, 200);
})();
