// Stage 3: compare the survey definition saved in stage 1 with a fresh capture. Usage: node verify-defdiff.js <fresh.txt>
const fs = require('fs'); const path = require('path');
const dir = path.join(__dirname, '..');
function load(p) { let j = JSON.parse(fs.readFileSync(p, 'utf8')); if (j.data && j.data.data) j = j.data.data; else if (j.data && j.data.pages) j = j.data; return j; }
const a = load(path.join(dir, 'quiz-definition.json'));
const b = load(process.argv[2]);
function flat(def) { const out = {}; (def.pages || []).forEach((p, i) => [].concat(Array.isArray(p.elements) ? p.elements : Object.values(p.elements || {})).forEach(e => { out[e.name] = { page: p.name, type: e.type, title: JSON.stringify(e.title), vis: e.visibleIf || p.visibleIf || '', choices: JSON.stringify((e.choices || []).map(c => typeof c === 'object' ? [c.value, c.text] : c)), req: !!e.isRequired }; })); return out; }
const fa = flat(a), fb = flat(b);
console.log('pages', (a.pages||[]).length, (b.pages||[]).length, 'elements', Object.keys(fa).length, Object.keys(fb).length);
let diffs = 0;
for (const k of new Set([...Object.keys(fa), ...Object.keys(fb)])) {
  if (!fa[k]) { console.log('ADDED', k, JSON.stringify(fb[k]).slice(0, 300)); diffs++; continue; }
  if (!fb[k]) { console.log('REMOVED', k); diffs++; continue; }
  for (const f of Object.keys(fa[k])) if (fa[k][f] !== fb[k][f]) { console.log('CHANGED', k, f, '\n  old:', String(fa[k][f]).slice(0, 300), '\n  new:', String(fb[k][f]).slice(0, 300)); diffs++; }
}
console.log('differences:', diffs);
