/* Module 3 interactive: "Before medication: ECG or cardiology?"
   The learner ticks findings from the baseline (or loads a patient) and sees the NICE NG87 action:
   1.7.5 cardiology opinion · 1.7.6 paediatric hypertension specialist · 1.7.4 ECG · or proceed. Teaching tool only. */
(function(){
  'use strict';
  var mount = document.querySelector('[data-cardio]'); if(!mount) return;

  var F = [
    {id:'chd', g:'card', t:'Congenital heart disease or previous heart surgery'},
    {id:'sd', g:'card', t:'Sudden death in a first-degree relative under 40 suggesting heart disease'},
    {id:'sob', g:'card', t:'Breathless on exertion compared with peers'},
    {id:'faint', g:'card', t:'Fainting on exertion, or in response to fright or noise'},
    {id:'palp', g:'card', t:'Palpitations that are rapid, regular, and start and stop suddenly'},
    {id:'cp', g:'card', t:'Chest pain that suggests a cardiac cause'},
    {id:'hf', g:'card', t:'Signs of heart failure'},
    {id:'mur', g:'card', t:'A murmur heard on examination'},
    {id:'aht', g:'card', t:'Adult: blood pressure in the hypertensive range'},
    {id:'cbp', g:'bp', t:'Child or young person: blood pressure consistently above the 95th centile for age and height'},
    {id:'med', g:'ecg', t:'A coexisting condition treated with a medicine that may increase cardiac risk'},
    {id:'ect', g:'none', t:'Only occasional "skipped beat" or fleeting bumps'}
  ];
  var CASES = [
    {n:'Priya, 25', d:'Healthy, no symptoms, no family history.', on:[]},
    {n:'Ellie, 13', d:'Fainted when the fire alarm went off at school.', on:['faint']},
    {n:'Sam, 32', d:'His father died suddenly of a heart problem at 34.', on:['sd']},
    {n:'Jo, 40', d:'Takes a medicine for another condition that may increase cardiac risk.', on:['med']},
    {n:'Leo, 9', d:'Blood pressure repeatedly above the 95th centile.', on:['cbp']},
    {n:'Ade, 19', d:'Notices an occasional skipped beat, nothing else.', on:['ect']}
  ];
  var st = {}, story = '';

  var h = '<div class="imc cardio"><div class="imc-head"><p class="imc-kicker">Interactive · Module 3</p><h3>Before medication: ECG or cardiology?</h3>'
    + '<p>Tick what the baseline history and examination found, or choose a patient. The panel shows what NICE says to do before starting a stimulant, atomoxetine or guanfacine.</p></div>'
    + '<div class="imc-cases" role="group" aria-label="Example patients"><span>Try:</span>';
  CASES.forEach(function(c,i){ h += '<button type="button" class="imc-case" data-i="'+i+'">'+c.n+'</button>'; });
  h += '<button type="button" class="imc-case imc-clear">Clear</button></div><p class="imc-story" hidden></p><div class="imc-body"><div class="cd-list" role="group" aria-label="Baseline findings">';
  F.forEach(function(f){ h += '<label class="cd-item cd-'+f.g+'"><input type="checkbox" value="'+f.id+'"><span>'+f.t+'</span></label>'; });
  h += '</div><div class="imc-out" aria-live="polite"></div></div>'
    + '<p class="imc-note">Teaching tool based on NICE NG87 1.7.4–1.7.6. It does not replace clinical judgement or local protocols.</p></div>';
  mount.innerHTML = h;
  var root = mount.firstChild, out = root.querySelector('.imc-out'), storyEl = root.querySelector('.imc-story');
  var boxes = root.querySelectorAll('.cd-list input');

  function render(){
    boxes.forEach(function(b){ b.checked = !!st[b.value]; b.closest('.cd-item').classList.toggle('on', b.checked); });
    storyEl.hidden = !story; storyEl.textContent = story;
    var card = F.filter(function(f){ return f.g==='card' && st[f.id]; }), bp = st.cbp, ecg = st.med, ect = st.ect;
    var acts = [];
    if(card.length) acts.push({tone:'high', h:'Cardiology opinion before starting', p:'NICE lists '+card.length+' feature'+(card.length>1?'s':'')+' here that need a cardiology opinion <strong>before</strong> any ADHD medicine is started (NG87 1.7.5).', l:card.map(function(f){ return f.t; })});
    if(bp) acts.push({tone:'warn', h:'Paediatric hypertension specialist before starting', p:'Blood pressure consistently above the 95th centile for age and height in a child or young person needs referral to a paediatric hypertension specialist before starting (NG87 1.7.6).'});
    if(ecg) acts.push({tone:'warn', h:'ECG before starting', p:'An ECG is needed when a coexisting condition is treated with a medicine that may increase cardiac risk (NG87 1.7.4).'});
    var o = '';
    if(!acts.length){
      o = '<div class="imc-verdict t-ok"><p class="imc-vh">No ECG or cardiology referral needed</p><p>'
        + (ect ? 'Occasional fleeting "bumps" are usually ectopic beats and do not need investigation.' : 'None of the NICE features is present.')
        + ' An ECG is not routinely needed before a stimulant, atomoxetine or guanfacine (NG87 1.7.4).</p></div>'
        + '<div class="imc-next"><strong>What you would do next</strong><p>Complete the baseline: height and weight (centile charts for children), pulse and blood pressure (with the right cuff, compared with the normal range for age), and the rest of the checklist below.</p></div>';
    } else {
      acts.forEach(function(a){
        o += '<div class="imc-verdict t-'+a.tone+'"><p class="imc-vh">'+a.h+'</p><p>'+a.p+'</p>'+(a.l ? '<ul class="cd-why">'+a.l.map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ul>' : '')+'</div>';
      });
      o += '<div class="imc-next"><strong>What you would do next</strong><p>Do not start medication yet. Record the finding, explain the reason to the person, and make the referral or arrange the test. Restart the plan once the result is back.</p></div>';
    }
    out.innerHTML = o;
  }
  root.addEventListener('change', function(e){ if(e.target.matches('.cd-list input')){ st[e.target.value] = e.target.checked; story=''; root.querySelectorAll('.imc-case').forEach(function(c){ c.classList.remove('on'); }); render(); } });
  root.addEventListener('click', function(e){
    var b = e.target.closest('.imc-case'); if(!b) return;
    root.querySelectorAll('.imc-case').forEach(function(c){ c.classList.toggle('on', c===b && !b.classList.contains('imc-clear')); });
    st = {}; story = '';
    if(!b.classList.contains('imc-clear')){ var c = CASES[+b.dataset.i]; c.on.forEach(function(id){ st[id] = true; }); story = c.n+': '+c.d; }
    render();
  });
  render();
})();
