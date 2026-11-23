// Stage 2: turn a walk.js run folder into the ordered list of screens it showed, and compare it with another run.
// A "screen" is the visible text between the "Menu" line and the footer, so two runs can be compared screen by screen.
// usage: node scripts/s2-screens.js <runDir> [<compareRunDir>]      (add --full to print whole screen bodies)
const fs = require('fs'); const path = require('path');
function screens(dir) {
  const out = [];
  fs.readdirSync(dir).filter(f => /^\d+\.txt$/.test(f)).sort().forEach(f => {
    const t = fs.readFileSync(path.join(dir, f), 'utf8');
    const step = (t.match(/^STEP \d+ (.*)$/m) || [])[1] || '';
    const url = (t.match(/^URL: (.*)$/m) || [])[1] || '';
    let body = (t.split('--- VISIBLE TEXT ---')[1] || '').split('--- CONTROLS ---')[0];
    body = body.replace(/^\s*Menu\s*\n/, '').split(/\nSons\nAbout Us\n/)[0].trim();
    const controls = ((t.split('--- CONTROLS ---')[1] || '').split('--- LINKS ---')[0] || '').trim();
    const lines = body.split('\n').map(s => s.trim()).filter(Boolean);
    out.push({ file: f, step, url, title: lines[0] || '(blank)', body: lines.join(' | '), controls });
  });
  return out;
}
// collapse steps that did not change the screen (ticking a box keeps the same question on screen).
// Two different questions can share a title ("Do any of the following apply to you?" is used twice), so the key also
// takes the start of the second visible line (the first option or the first sentence).
function sequence(dir) {
  const seq = []; let last = null;
  screens(dir).forEach(s => {
    const second = (s.body.split(' | ')[1] || '').slice(0, 40);
    s.key = s.title + ' || ' + second; s.label = s.title + (second && /apply to you|adverse effects\?$/.test(s.title) ? ' [first option: ' + second + ']' : '');
    const key = s.url.replace(/[?#].*/, '') + ' :: ' + s.key; if (key !== last) { seq.push(s); last = key; }
  });
  return seq;
}
// multiset difference of screens between two runs
function diff(dir, cmpDir) {
  const a = sequence(dir), b = sequence(cmpDir); const left = b.map(s => s.key); const added = [];
  a.forEach(s => { const i = left.indexOf(s.key); if (i >= 0) left.splice(i, 1); else added.push(s.label); });
  const leftA = a.map(s => s.key); const removed = [];
  b.forEach(s => { const i = leftA.indexOf(s.key); if (i >= 0) leftA.splice(i, 1); else removed.push(s.label); });
  const reworded = []; a.forEach(s => { const o = b.find(x => x.key === s.key); if (o && o.body !== s.body) reworded.push({ title: s.title, thisRun: s.body, compare: o.body }); });
  return { screens: a.length, compareScreens: b.length, added, removed, reworded, last: a[a.length - 1] };
}
module.exports = { screens, sequence, diff };
if (require.main === module) {
  const args = process.argv.slice(2).filter(a => !a.startsWith('--')); const full = process.argv.includes('--full');
  const a = sequence(args[0]);
  if (!args[1]) { a.forEach((s, i) => console.log(String(i + 1).padStart(2) + '. [' + s.file + '] ' + (full ? s.body : s.title).slice(0, full ? 2000 : 150))); process.exit(0); }
  const r = diff(args[0], args[1]);
  console.log('screens: ' + r.screens + ' vs ' + r.compareScreens + ' (compare run)');
  console.log('ADDED   (in this run, not in compare): ' + JSON.stringify(r.added.map(t => t.slice(0, 130))));
  console.log('REMOVED (in compare, not in this run): ' + JSON.stringify(r.removed.map(t => t.slice(0, 130))));
  r.reworded.forEach(w => console.log('BODY DIFFERS on "' + w.title.slice(0, 80) + '"\n   this:    ' + w.thisRun.slice(0, 700) + '\n   compare: ' + w.compare.slice(0, 700)));
  console.log('LAST SCREEN: ' + r.last.title.slice(0, 160) + '  @ ' + r.last.url);
}
