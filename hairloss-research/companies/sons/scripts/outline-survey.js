// usage: node outline-survey.js <raw survey json> > outline.txt
const d = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8'));
const s = d.data.data;
console.log('SURVEY id=' + d.data.id + ' name=' + d.data.name);
console.log(JSON.stringify(Object.fromEntries(Object.entries(s).filter(([k]) => k !== 'pages'))));
const strip = h => String(h || '').replace(/\s+/g, ' ').trim();
let i = 0;
for (const p of s.pages) {
  i++; const extra = Object.fromEntries(Object.entries(p).filter(([k]) => !['elements', 'name'].includes(k)));
  console.log('\n=== [' + i + '] PAGE ' + p.name + ' ' + (Object.keys(extra).length ? JSON.stringify(extra) : ''));
  const els = Array.isArray(p.elements) ? p.elements : [];
  for (const e of els) {
    const { name, type, title, description, choices, visibleIf, isRequired, html, ...rest } = e;
    console.log('  Q ' + name + ' | ' + type + ' | req=' + isRequired + (visibleIf ? ' | visibleIf: ' + visibleIf : ''));
    if (title) console.log('    title: ' + strip(title));
    if (description) console.log('    desc: ' + strip(description));
    if (html) console.log('    html: ' + strip(html));
    for (const c of choices || []) {
      if (typeof c !== 'object') { console.log('     - ' + c); continue; }
      const other = Object.fromEntries(Object.entries(c).filter(([k]) => !['text', 'value', 'imageLink'].includes(k)));
      console.log('     - [' + c.value + '] ' + strip(c.text) + (c.imageLink ? ' <img ' + c.imageLink + '>' : '') + (Object.keys(other).length ? ' ' + JSON.stringify(other) : ''));
    }
    if (Object.keys(rest).length) console.log('    rest: ' + JSON.stringify(rest));
  }
}
