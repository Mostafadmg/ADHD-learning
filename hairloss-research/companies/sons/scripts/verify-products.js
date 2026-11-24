// Stage 3: pull name, variant prices and strength mentions out of the saved live product pages.
const fs = require('fs'); const path = require('path');
const O = path.join(__dirname, '..', 'runs', 'verify-products');
const out = {};
for (const f of fs.readdirSync(O).filter(f => f.endsWith('.html'))) {
  const h = f.replace('.html', ''); const html = fs.readFileSync(path.join(O, f), 'utf8');
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const og = (html.match(/property="og:price:amount" content="([^"]+)"/) || [])[1];
  // Shopify product JSON: variants with title and price in pence
  const vars = []; const re = /"title":"([^"]{1,60})","option1":"[^"]*"[^{}]*?"price":(\d+)/g; let m;
  while ((m = re.exec(html))) vars.push(m[1] + '=£' + (m[2] / 100).toFixed(2));
  const text = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#\d+;/g, ' ').replace(/\s+/g, ' ');
  const strengths = [...new Set((text.match(/[A-Za-z]{3,}[^.]{0,40}?\b\d+(?:\.\d+)?\s?(?:mg|%|mcg|µg|micrograms)\b/g) || []).map(s => s.trim()))].slice(0, 8);
  out[h] = { title: title && title.trim(), ogPrice: og, variants: [...new Set(vars)].slice(0, 8), strengths };
  console.log('##', h, '|', out[h].title, '| og', og, '\n  variants:', out[h].variants.join('; '), '\n  strengths:', strengths.join(' || ').slice(0, 600));
}
fs.writeFileSync(path.join(O, 'extract.json'), JSON.stringify(out, null, 1));
