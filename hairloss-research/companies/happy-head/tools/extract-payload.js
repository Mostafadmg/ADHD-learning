// Runs the flow's own "POST to backend" action code locally in a sandbox with a FAKE fetch (nothing is sent),
// to read the list of questions/options and their isImportant / isCritical flags. Output: raw/backend-payload-shape.json
const fs = require('fs'), path = require('path'), vm = require('vm');
const base = path.join(__dirname, '..');
const d = JSON.parse(fs.readFileSync(path.join(base, 'quiz-definition.json'), 'utf8'));
const f = d.embeddables_data[0].flow;
const act = f.dataOutputs.find(x => x.id === '_a7004594546312322');
let captured = null;
const userData = new Proxy({ sex_at_birth: 'male', sex_capitalized: 'Male', email_capture_variant: 'sms_capture', current_page_key: 'email' }, {
  get: (t, k) => (k in t ? t[k] : (typeof k === 'string' ? undefined : undefined)) });
const sandbox = {
  console: { log() {}, error() {}, warn() {} },
  URLSearchParams, URL, encodeURIComponent, decodeURIComponent, JSON, Date, Math, String, Number, Array, Object, Promise, setTimeout: () => 0, setInterval: () => 0, clearInterval() {},
  window: { location: { origin: 'https://www.form.happyhead.com', search: '', href: 'https://www.form.happyhead.com/', hostname: 'www.form.happyhead.com' }, dataLayer: [], localStorage: { getItem: () => null, setItem() {} } },
  document: { cookie: '', querySelector: () => null, querySelectorAll: () => [], referrer: '' },
  localStorage: { getItem: () => null, setItem() {} }, navigator: { userAgent: 'sandbox' },
  fetch: (url, opts) => { captured = { url: String(url), method: opts && opts.method, headers: opts && Object.keys(opts.headers || {}), body: opts && opts.body }; return new Promise(() => {}); },
};
sandbox.window.fetch = sandbox.fetch; sandbox.globalThis = sandbox;
vm.createContext(sandbox);
try { vm.runInContext(act.code + '\n;output(__ud, __ctx);', Object.assign(sandbox, { __ud: userData, __ctx: { setUserData() {}, triggerAction() {}, goToPage() {} } }), { timeout: 5000 }); }
catch (e) { console.log('run error:', e.message); }
if (!captured) { console.log('no fetch captured'); process.exit(1); }
let body; try { body = JSON.parse(captured.body); } catch (e) { body = captured.body; }
fs.writeFileSync(path.join(base, 'raw', 'backend-payload-shape.json'), JSON.stringify({ note: 'Shape only. Produced offline with a fake fetch; nothing was sent.', url: captured.url, method: captured.method, headerNames: captured.headers, body }, null, 1));
console.log('captured url', captured.url, 'top keys', Object.keys(body));
for (const q of body.questions || []) {
  console.log('\nQ ' + q.key + ' :: ' + q.questionLabel);
  for (const o of q.options || []) console.log('    ' + (o.isCritical ? 'CRITICAL ' : o.isImportant ? 'IMPORTANT' : '         ') + ' ' + o.key + ' = ' + o.label);
}
