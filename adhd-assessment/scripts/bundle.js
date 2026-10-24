#!/usr/bin/env node
/* Builds a single self-contained HTML file (all CSS and JS inlined) for offline use or hosting.
   Usage: node scripts/bundle.js <out.html> [--fragment]
   --fragment drops <!doctype>, <html>, <head> and <body> wrappers (for hosts that add their own).
   Tool PDFs in tools/ are not inlined; copy that folder next to the output file. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const out = process.argv[2];
const fragment = process.argv.includes('--fragment');
if (!out) { console.error('Usage: node scripts/bundle.js <out.html> [--fragment]'); process.exit(1); }

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
html = html.replace(/<link rel="stylesheet" href="(css\/[^"]+)">/g, (m, f) => {
  const p = path.join(ROOT, f);
  return fs.existsSync(p) ? '<style>\n' + fs.readFileSync(p, 'utf8') + '\n</style>' : '';
});
html = html.replace(/<script src="(js\/[^"]+)"><\/script>/g, (m, f) => {
  f = f.split('?')[0];   /* ignore cache-busting queries such as ?v=20261025 */
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) return '';
  const code = fs.readFileSync(p, 'utf8').replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
  return '<script>/* ' + f + ' */\n' + code + '\n</script>';
});
if (fragment) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
    .replace(/<meta charset[^>]*>\s*/i, '')
    .replace(/<meta name="viewport"[^>]*>\s*/i, '')
    .replace('<title>', '<meta name="claude:viewport-fit-sides" content="cover">\n<title>');
  const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
  // Title first so hosts that scan the start of the file find it.
  const title = head.match(/<title>[^<]*<\/title>/)[0];
  html = title + '\n' + head.replace(title, '') + '\n' + body;
}
fs.writeFileSync(out, html);
console.log('Wrote ' + out + ' (' + Math.round(fs.statSync(out).size / 1024) + ' KB)');
