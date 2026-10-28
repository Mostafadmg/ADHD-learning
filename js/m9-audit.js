/* Module 9, lesson 9: audit planner for an ADHD service lead.
   Mount: <div class="m9-audit" data-m9audit>. Pick a standard (grouped by purpose), enter how many records met it,
   see the result against a locally agreed target, and download a one-page plan (.txt). No dependencies.
   Standards quote NICE NG87, NICE NG46, the Misuse of Drugs Regulations 2001 and MHRA; sample sizes, targets and
   re-audit timing are labelled clinical practice. Remembers the last choice in this browser (localStorage, optional). */
(function(){
  var KEY = 'adhd.m9audit';
  var SVG = function(p){ return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true">'+p+'</svg>'; };
  var GROUPS = [
    {id:'mon', t:'Monitoring', p:'Are the NICE checks being done?', ic:'<path d="M3 12h4l2-5 4 10 2-5h6"/>', items:[
      {id:'bp', t:'Pulse and blood pressure', std:'Heart rate and blood pressure are recorded and compared with the normal range for age before and after each dose change and every 6 months.', src:'NICE NG87 1.8.9', num:'People with pulse and blood pressure recorded in the last 6 months', den:'Everyone taking ADHD medicine for 6 months or more', exc:'People who started in the last 6 months: check the readings around each dose change instead.', data:'Clinic system or shared care records'},
      {id:'wt', t:'Weight and growth', std:'Weight is measured at the NICE interval for age (adults every 6 months); children’s height is measured every 6 months and plotted on a growth chart.', src:'NICE NG87 1.8.5', num:'People with weight (and, for children, height on a growth chart) recorded on time', den:'Everyone taking ADHD medicine', exc:'People who started too recently for the first check to be due.', data:'Clinic system and growth charts'},
      {id:'ar', t:'Annual review', std:'A professional with training and expertise in ADHD reviews medication at least once a year, covering the areas in 1.10.1; if medication continues, the reasons are documented.', src:'NICE NG87 1.10.1, 1.10.3', num:'People with a documented review in the last 12 months that records why medication continues', den:'Everyone taking ADHD medicine for 12 months or more', exc:'Reviews offered but declined or not attended: count separately and follow up.', data:'Specialist clinic letters'}]},
    {id:'rx', t:'Safe prescribing', p:'Are prescriptions safe and clear?', ic:'<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>', items:[
      {id:'d30', t:'30-day supplies', std:'Controlled drug prescriptions cover no more than 30 days, unless a reason for more is documented in the care record.', src:'NICE NG46 1.5.5', num:'Stimulant prescriptions for 30 days or less, or with a documented reason', den:'All stimulant prescriptions issued in the audit period', exc:'None.', data:'Prescribing system or national prescribing data'},
      {id:'brand', t:'Brand prescribing', std:'Modified-release methylphenidate is prescribed by brand, or by generic name with the manufacturer, so the same product is supplied each time.', src:'MHRA Drug Safety Update, September 2022', num:'Modified-release methylphenidate prescriptions that name the brand or manufacturer', den:'All modified-release methylphenidate prescriptions in the audit period', exc:'None.', data:'Prescribing system'},
      {id:'doc', t:'Indication and review plan', std:'The indication, the regimen and the arrangements for review and monitoring are clearly documented in the care record.', src:'NICE NG46 1.5.2', num:'Records showing the indication, the regimen and the next review', den:'A sample of people taking stimulants', exc:'None.', data:'Care records'}]},
    {id:'path', t:'Titration and shared care', p:'Does the pathway work as written?', ic:'<circle cx="9" cy="8" r="3.2"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><circle cx="17.2" cy="9" r="2.5"/><path d="M15.6 14.2a4.8 4.8 0 0 1 5.8 4.8"/>', items:[
      {id:'base', t:'Baseline before starting', std:'Before medication starts, height, weight, pulse, blood pressure, a cardiovascular history and a risk assessment for substance misuse and diversion are recorded.', src:'NICE NG87 1.7.4', num:'New starters with every baseline item recorded before the first dose', den:'Everyone started on ADHD medicine in the audit period', exc:'None.', data:'Clinic system'},
      {id:'titr', t:'Titration records', std:'During titration, symptoms, impairment and adverse effects are recorded at baseline and at each dose change on standard scales, with progress reviewed regularly.', src:'NICE NG87 1.7.26', num:'Dose changes with standard scale scores and adverse effects recorded', den:'All dose changes during titration in the audit period', exc:'None.', data:'Titration clinic records'},
      {id:'sc', t:'Shared care letters', std:'Each transfer letter contains every item the protocol lists: diagnosis, product and dose, latest results, monitoring dates, what to do about abnormal results, and contacts.', src:'Local shared care protocol (Module 6)', num:'Transfer letters that contain every required item', den:'All transfers to primary care in the audit period', exc:'None.', data:'Letters sent to primary care'}]},
    {id:'cd', t:'Controlled drugs', p:'Is CD handling safe and recorded?', ic:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', items:[
      {id:'stock', t:'CD stock checks', std:'The CD register balance is checked against stock at the agreed frequency (at least weekly for most organisations), dated and signed, ideally with 2 people present.', src:'NICE NG46 1.1.12', num:'Weeks with a recorded, signed stock check', den:'Weeks in the audit period', exc:'None.', data:'CD register'},
      {id:'inc', t:'CD incident reporting', std:'Controlled drug incidents and concerns are reported to the CD accountable officer in a timely way, ideally within 48 hours.', src:'NICE NG46 1.4.2', num:'CD incidents reported within 48 hours', den:'All CD incidents in the audit period', exc:'None.', data:'Incident reporting system'},
      {id:'dest', t:'Destruction records', std:'Expired Schedule 2 stock is destroyed with an authorised witness, recorded with the drug name, strength, form, quantity, date and the witness’s signature.', src:'Misuse of Drugs Regulations 2001 reg 27; NICE NG46 1.8.3–1.8.4', num:'Destructions with every required detail and an authorised witness’s signature', den:'All stock destructions in the audit period', exc:'None.', data:'CD register'}]}
  ];
  var BY = {}; GROUPS.forEach(function(g){ g.items.forEach(function(it){ it.g = g; BY[it.id] = it; }); });
  var SAMPLE = 'All eligible people, or a random sample of 30–50 records if there are many (clinical practice).';

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function load(){ try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e){ return {}; } }
  function save(st){ try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e){} }
  function int(v){ var n = parseInt(v, 10); return isNaN(n) ? null : n; }

  function result(st){
    var n = int(st.n), d = int(st.d), t = int(st.t);
    if(t === null || t < 0 || t > 100) t = 100;
    if(n === null || d === null) return {ok:null, msg:'Enter how many records met the standard and how many you checked.'};
    if(d <= 0 || n < 0 || n > d) return {ok:null, msg:'Check the numbers: “checked” must be 1 or more, and “met” cannot be more than “checked”.'};
    var pc = Math.round(1000 * n / d) / 10, met = pc >= t;
    return {ok:met, pc:pc, t:t, n:n, d:d, msg: n+' of '+d+' = '+pc+'%. '+(met ? 'This meets your target of '+t+'%.' : 'This is '+(Math.round((t-pc)*10)/10)+' points below your target of '+t+'%.')};
  }
  function steps(ok){
    return ok ? ['Share the result and what made it work.','Keep the process; re-audit in about 12 months, or sooner after any change (clinical practice).']
      : ['Share the result with the whole team, without blame.','Find the main causes: ask the people who do the work.','Change one thing, such as a reminder, a template field or a clinic slot.','Re-audit in about 3–6 months to see whether it worked (clinical practice).'];
  }
  function plan(it, st){
    var r = result(st), L = [];
    L.push('ADHD service audit plan: '+it.t);
    L.push('Date: '+new Date().toLocaleDateString('en-GB'));
    L.push('');
    L.push('Standard: '+it.std);
    L.push('Source: '+it.src);
    L.push('Criterion: count '+it.num.charAt(0).toLowerCase()+it.num.slice(1)+', out of '+it.den.charAt(0).toLowerCase()+it.den.slice(1)+'.');
    L.push('Exceptions: '+it.exc);
    L.push('Data source: '+it.data);
    L.push('Sample: '+SAMPLE);
    L.push('Target: '+(int(st.t) === null ? 100 : int(st.t))+'% (agreed locally; NICE and the regulations set the standard, not a percentage).');
    if(r.ok !== null){ L.push(''); L.push('Result: '+r.msg); L.push('Next steps:'); steps(r.ok).forEach(function(s){ L.push('- '+s); }); }
    L.push(''); L.push('Prepared with the ADHD for Clinicians course, Module 9. Check the current guidance and your local policy before use.');
    return L.join('\n');
  }

  function build(m){
    var st = load(); if(!BY[st.id]) st.id = 'bp';
    var html = '<p class="m9a-intro">Choose a standard. The planner writes the audit criterion for you; add your numbers to see the result, then download the plan.</p><div class="m9a-groups">';
    GROUPS.forEach(function(g){
      html += '<div class="m9a-g"><div class="m9a-gh"><span class="m9-ic">'+SVG(g.ic)+'</span><div><b>'+esc(g.t)+'</b><small>'+esc(g.p)+' · '+g.items.length+' standards</small></div></div><div class="m9a-chips" role="group" aria-label="'+esc(g.t)+'">'
        + g.items.map(function(it){ return '<button type="button" class="m9a-chip" data-id="'+it.id+'" aria-pressed="false">'+esc(it.t)+'</button>'; }).join('') + '</div></div>';
    });
    html += '</div><div class="m9a-out" aria-live="polite"></div>';
    m.innerHTML = html;
    var out = m.querySelector('.m9a-out');

    function render(){
      var it = BY[st.id];
      m.querySelectorAll('.m9a-chip').forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.id === st.id ? 'true' : 'false'); });
      out.innerHTML = '<p class="m9a-k">'+esc(it.g.t)+'</p><h4>'+esc(it.t)+'</h4>'
        + '<dl class="m9a-dl"><div><dt>Standard</dt><dd>'+esc(it.std)+' <span class="m9a-src">'+esc(it.src)+'</span></dd></div>'
        + '<div><dt>Criterion</dt><dd><b>Count:</b> '+esc(it.num)+'.<br><b>Out of:</b> '+esc(it.den)+'.</dd></div>'
        + '<div><dt>Exceptions</dt><dd>'+esc(it.exc)+'</dd></div>'
        + '<div><dt>Data and sample</dt><dd>'+esc(it.data)+'. '+esc(SAMPLE)+'</dd></div></dl>'
        + '<div class="m9a-in"><label>Met the standard<input type="number" inputmode="numeric" min="0" class="m9a-n" value="'+esc(st.n == null ? '' : st.n)+'"></label>'
        + '<label>Records checked<input type="number" inputmode="numeric" min="1" class="m9a-d" value="'+esc(st.d == null ? '' : st.d)+'"></label>'
        + '<label>Local target (%)<input type="number" inputmode="numeric" min="0" max="100" class="m9a-t" value="'+esc(st.t == null ? 100 : st.t)+'"></label></div>'
        + '<div class="m9a-res"></div>'
        + '<p class="m9a-note">NICE and the regulations set the standard, not a percentage: agree the target locally, usually everyone eligible with exceptions documented (clinical practice).</p>'
        + '<div class="m9a-act"><button type="button" class="btn secondary m9a-dl-btn">Download plan (.txt)</button><button type="button" class="btn secondary m9a-clear">Clear numbers</button></div>';
      result_();
    }
    function result_(){
      var r = result(st), box = out.querySelector('.m9a-res');
      if(r.ok === null){ box.className = 'm9a-res'; box.innerHTML = '<p>'+esc(r.msg)+'</p>'; return; }
      box.className = 'm9a-res ' + (r.ok ? 'is-ok' : 'is-low');
      box.innerHTML = '<div class="m9a-bar" role="img" aria-label="'+r.pc+'% against a target of '+r.t+'%"><span style="width:'+Math.min(100, r.pc)+'%"></span><i style="left:'+r.t+'%"></i></div>'
        + '<p><b>'+esc(r.msg)+'</b></p><ul>'+steps(r.ok).map(function(s){ return '<li>'+esc(s)+'</li>'; }).join('')+'</ul>';
    }
    m.addEventListener('click', function(e){
      var c = e.target.closest('.m9a-chip');
      if(c){ if(c.dataset.id !== st.id){ st = {id:c.dataset.id, t:st.t}; save(st); render(); } return; }
      if(e.target.closest('.m9a-clear')){ st.n = null; st.d = null; save(st); render(); return; }
      if(e.target.closest('.m9a-dl-btn')){
        var bl = new Blob([plan(BY[st.id], st)], {type:'text/plain'}), u = URL.createObjectURL(bl), a = document.createElement('a');
        a.href = u; a.download = 'adhd-audit-plan-'+st.id+'.txt'; document.body.appendChild(a); a.click();
        setTimeout(function(){ URL.revokeObjectURL(u); a.remove(); }, 500);
      }
    });
    m.addEventListener('input', function(e){
      var t = e.target;
      if(t.matches('.m9a-n')) st.n = t.value; else if(t.matches('.m9a-d')) st.d = t.value; else if(t.matches('.m9a-t')) st.t = t.value; else return;
      save(st); result_();
    });
    render();
  }

  function init(){ document.querySelectorAll('[data-m9audit]').forEach(function(m){ if(m.dataset.done) return; m.dataset.done = '1'; try { build(m); } catch(e){ m.innerHTML = '<p>This planner could not load.</p>'; if(window.console) console.error(e); } }); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
