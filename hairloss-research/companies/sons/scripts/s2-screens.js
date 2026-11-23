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
// collapse steps that did not change the screen (ticking a box keeps the same question on screen)
function sequence(dir) {
  const seq = []; let last = null;
  screens(dir).forEach(s => { const key = s.url.replace(/[?#].*/, '') + ' :: ' + s.title; if (key !== last) { seq.push(s); last = key; } });
  return seq;
}
module.exports = { screens, sequence };
if (require.main === module) {
  const args = process.argv.slice(2).filter(a => !a.startsWith('--')); const full = process.argv.includes('--full');
  const a = sequence(args[0]);
  if (!args[1]) { a.forEach((s, i) => console.log(String(i + 1).padStart(2) + '. [' + s.file + '] ' + (full ? s.body : s.title).slice(0, full ? 2000 : 150))); process.exit(0); }
  const b = sequence(args[1]);
  const ta = a.map(s => s.title), tb = b.map(s => s.title);
  console.log('screens: ' + ta.length + ' vs ' + tb.length + ' (compare run)');
  console.log('ADDED   (in this run, not in compare): ' + JSON.stringify(ta.filter(t => !tb.includes(t)).map(t => t.slice(0, 110))));
  console.log('REMOVED (in compare, not in this run): ' + JSON.stringify(tb.filter(t => !ta.includes(t)).map(t => t.slice(0, 110))));
  // reworded screens: same title, different body
  a.forEach(s => { const o = b.find(x => x.title === s.title); if (o && o.body !== s.body) console.log('BODY DIFFERS on "' + s.title.slice(0, 80) + '"\n   this:    ' + s.body.slice(0, 600) + '\n   compare: ' + o.body.slice(0, 600)); });
  console.log('LAST SCREEN: ' + a[a.length - 1].title.slice(0, 160) + '  @ ' + a[a.length - 1].url);
}
