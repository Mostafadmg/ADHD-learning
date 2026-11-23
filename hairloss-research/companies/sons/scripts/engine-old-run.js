// Runs Sons' OLDER recommendation rules offline (the inline script of sons.co.uk/pages/recommendation, which is where the
// consultation sends a new sign-up). No browser, no network, no account.
// It executes lines 273-1140 of recommendation-engine.excerpt.js UNCHANGED (the part that reads the answers, sets the five
// switches, filters the plan list and groups it into cards). Only the page furniture is replaced by stand-ins:
//   - sessionStorage / customer data are filled from the command line,
//   - product look-ups return the handle only, and the card drawing functions return {card, toggle} instead of HTML.
// usage: node scripts/engine-old-run.js '<json answers>' [tags,comma,separated] [chosenProduct]
//   answers use the survey's own keys, e.g. {"5143":0,"3216":0,"5148":[],"What treatment type do you prefer?":2,"5155":[]}
//   "date_of_birth" inside the answers is moved to the customer record, which is where this script reads age from.
const fs = require('fs'); const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'recommendation-engine.excerpt.js'), 'utf8').split('\n');
const body = src.slice(272, 1140).join('\n') +
  '\n__capture({ primary, additional, showTwoProducts, recommendations, logicExplanations, switches: { allowedOralFinasteride, allowedTopicalFinasteride, allowedOralMinoxidil, allowedTopicalMinoxidil, allowedTopicalCombo } });\n});\n}\n';

function run(answers, tags, chosen, customerExtra) {
  const a = Object.assign({}, answers); const dob = a.date_of_birth; delete a.date_of_birth;
  const store = { consultationResults: JSON.stringify({ consult_results: a }) }; if (chosen) store.chosenProduct = chosen;
  const customerData = Object.assign({ tags: tags || [] }, dob ? { date_of_birth: dob } : {}, customerExtra || {});
  const quiet = { log() {}, warn() {}, error() {} };
  return new Promise(resolve => {
    const f = new Function('customerData', 'sessionStorage', 'document', 'console', 'fetchProductDetails', 'renderProductWithTabs', 'renderProduct', '__capture', body);
    f(customerData, { getItem: k => (k in store ? store[k] : null), setItem() {} }, { getElementById: () => ({}) }, quiet,
      h => Promise.resolve({ id: h, handle: h }), (rec, paired) => ({ card: rec.handle, toggle: paired.handle }), rec => ({ card: rec.handle }), resolve);
  });
}
module.exports = { run };
if (require.main === module) {
  const answers = JSON.parse(process.argv[2] || '{}');
  const tags = (process.argv[3] || '').split(',').filter(Boolean);
  run(answers, tags, process.argv[4] || '').then(r => {
    const name = c => c.card + (c.toggle ? ' (toggle: ' + c.toggle + ')' : '');
    console.log(JSON.stringify({ primary: r.primary.map(name), secondary: r.additional.map(name), reasons: r.logicExplanations, switches: r.switches }, null, 1));
  });
}
