// Stage 3: compare two walk.js run folders screen by screen (visible text only, footer removed).
// usage: node verify-compare.js runs/a runs/b
const fs = require('fs'); const path = require('path');
const D = path.join(__dirname, '..');
function screens(run) {
  const dir = path.join(D, run); const out = [];
  for (const f of fs.readdirSync(dir).filter(f => /^\d\d\.txt$/.test(f)).sort()) {
    const t = fs.readFileSync(path.join(dir, f), 'utf8');
    const vis = (t.split('--- VISIBLE TEXT ---')[1] || '').split('--- CONTROLS ---')[0];
    const body = vis.split(/\nSons\nAbout Us/)[0].replace(/^\s*Menu\s*/, '').trim();
    if (!out.length || out[out.length - 1] !== body) out.push(body);
  }
  return out;
}
const [a, b] = process.argv.slice(2); const A = screens(a), B = screens(b);
console.log(a, A.length, 'distinct screens |', b, B.length);
const n = Math.max(A.length, B.length); let same = 0;
for (let i = 0; i < n; i++) { if (A[i] === B[i]) same++; else console.log('DIFF #' + i + '\n  A: ' + String(A[i]).slice(0, 160).replace(/\n/g, ' / ') + '\n  B: ' + String(B[i]).slice(0, 160).replace(/\n/g, ' / ')); }
console.log('identical screens:', same, 'of', n);
