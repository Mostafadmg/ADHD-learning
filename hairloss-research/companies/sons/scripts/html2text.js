// usage: node html2text.js <file.html>  -> prints visible-ish text of <main> (scripts/styles removed)
const fs = require('fs');
let s = fs.readFileSync(process.argv[2], 'utf8');
const m = s.match(/<main[\s\S]*<\/main>/i); if (m) s = m[0];
s = s.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<svg[\s\S]*?<\/svg>/gi, ' ').replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
s = s.replace(/<\/(p|div|li|h\d|section|tr|br|summary|details|button|a|span|label|option)>/gi, '\n').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ');
s = s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;|&#8217;/g, "'").replace(/&quot;/g, '"').replace(/&pound;/g, '£').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&ndash;/g, '–').replace(/&euro;/g, '€');
const lines = s.split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
const out = []; for (const l of lines) if (out[out.length - 1] !== l) out.push(l);
console.log(out.join('\n'));
