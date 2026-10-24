/* Module 1 interactive: "Does it meet the threshold?"
   The learner rates impairment in three settings (or loads a patient) and sees, in plain words,
   which DSM-5-TR and NICE NG87 1.3.3 requirements are met and what to do next. Teaching model only. */
(function(){
  'use strict';
  var mount = document.querySelector('[data-imc]'); if(!mount) return;

  var LEVELS = ['None','Mild','Moderate','Severe'];
  var SETTINGS = [
    {id:'home', icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M3 11l9-7 9 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/></svg>', label:'Home and family', d:[
      'No real effect at home.',
      'Some missed chores and lost items; the family copes with reminders.',
      'Regular conflict over tasks, bills or routines; others often have to step in.',
      'Home life in crisis: unpaid bills, constant conflict, risk of losing the home.']},
    {id:'work', icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" focusable="false"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg>', label:'School, study or work', d:[
      'No real effect on school or work.',
      'Needs extra effort, but performance is acceptable.',
      'Warnings, missed deadlines, results or appraisals well below ability.',
      'Exclusion, dropping out, dismissal or repeated job loss.']},
    {id:'social', icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" focusable="false"><circle cx="9" cy="8" r="3.2"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><circle cx="17.2" cy="9" r="2.5"/><path d="M15.6 14.2a4.8 4.8 0 0 1 5.8 4.8"/></svg>', label:'Friends and relationships', d:[
      'No real effect on relationships.',
      'Friends notice interrupting or lateness, but relationships are fine.',
      'Frequent arguments, friendships lost, strain with a partner.',
      'Relationship breakdown, isolation or aggression.']}
  ];
  var CASES = [
    {name:'Maya, 9', story:'Struggles to finish work and is often off-task in class. At home and with friends she is fine.', v:{home:0, work:2, social:0}},
    {name:'Priya, 28', story:'Uses lists and phone alarms. A little late and forgetful at work and at home, but coping well.', v:{home:1, work:1, social:1}},
    {name:'Tom, 34', story:'Two written warnings for missed deadlines. His partner is frustrated by unpaid bills. Friends say he interrupts.', v:{home:2, work:2, social:1}},
    {name:'Dan, 41', story:'Lost three jobs, recently separated, and has two speeding convictions.', v:{home:3, work:3, social:3}}
  ];
  var st = {home:0, work:0, social:0}, story = '';

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  var h = '<div class="imc-head"><p class="imc-kicker">Interactive · Module 1</p><h3>Does it meet the threshold?</h3>'
    + '<p>A diagnosis needs symptoms <strong>and</strong> impairment. Choose a patient, or rate how much the symptoms affect each area of life yourself. The checks on the right update as you go.</p></div>'
    + '<div class="imc-cases" role="group" aria-label="Example patients"><span>Try a patient:</span>';
  CASES.forEach(function(c,i){ h += '<button type="button" class="imc-case" data-i="'+i+'">'+esc(c.name)+'</button>'; });
  h += '<button type="button" class="imc-case imc-clear">Clear</button></div><p class="imc-story" aria-live="polite" hidden></p>'
    + '<div class="imc-body"><div class="imc-rate">';
  SETTINGS.forEach(function(s){
    h += '<div class="imc-row" data-s="'+s.id+'"><div class="imc-rh"><span class="imc-ic" aria-hidden="true">'+s.icon+'</span><strong id="imc-'+s.id+'">'+s.label+'</strong></div>'
      + '<div class="imc-seg" role="radiogroup" aria-labelledby="imc-'+s.id+'">';
    LEVELS.forEach(function(l,i){ h += '<button type="button" role="radio" class="imc-lv imc-l'+i+'" data-v="'+i+'">'+l+'</button>'; });
    h += '</div><p class="imc-desc"></p></div>';
  });
  h += '</div><div class="imc-out" aria-live="polite"></div></div>'
    + '<p class="imc-note">Teaching model. In practice you judge impairment from the interview, collateral history and records, and you weigh it as a whole, not by adding up boxes. Source: NICE NG87 1.3.3; DSM-5-TR criteria C and D.</p>';
  mount.innerHTML = '<div class="imc">'+h+'</div>';

  var root = mount.firstChild, out = root.querySelector('.imc-out'), storyEl = root.querySelector('.imc-story');

  function chk(ok, title, src, why){
    return '<li class="'+(ok?'ok':'no')+'"><span class="imc-mark" aria-hidden="true">'+(ok?'✓':'✗')+'</span><span><strong>'+title+'</strong> <em>'+src+'</em><br>'+why+'</span></li>';
  }
  function render(){
    SETTINGS.forEach(function(s){
      var row = root.querySelector('.imc-row[data-s="'+s.id+'"]'), v = st[s.id];
      row.querySelectorAll('.imc-lv').forEach(function(b){ var on = +b.dataset.v===v; b.classList.toggle('on', on); b.setAttribute('aria-checked', on?'true':'false'); });
      row.querySelector('.imc-desc').textContent = s.d[v];
      row.className = 'imc-row lv'+v;
    });
    storyEl.hidden = !story; storyEl.textContent = story;
    var vals = SETTINGS.map(function(s){ return st[s.id]; });
    var affected = vals.filter(function(v){ return v>=1; }).length, max = Math.max.apply(null, vals);
    var tone, head, body, next;
    if(max===0){ tone='ok'; head='No impairment: ordinary traits';
      body='Everyone is sometimes distracted or restless. Without any effect on daily life there is nothing to diagnose.';
      next='Reassure. Do not assess on symptoms alone.'; }
    else if(affected<2){ tone='mid'; head='Not met: only one setting is affected';
      body='ADHD shows up across life. Problems in one place only usually point to something about that place.';
      next='Look for setting-specific causes: a specific learning difficulty, hearing or vision problems, bullying, anxiety, or a poor fit with the job or class. Get information from a second setting.'; }
    else if(max===1){ tone='low'; head='DSM-5-TR may be met, but not the NICE threshold';
      body='Symptoms reach two or more settings, but the impact is only mild. In the UK, NICE requires at least moderate impairment before diagnosing ADHD.';
      next='Offer practical strategies (routines, lists, reminders) and review if things get worse. For a child, NICE suggests watchful waiting and parent support (NG87 1.2.7).'; }
    else { tone = max===3 ? 'high' : 'warn'; head = max===3 ? 'Threshold met: severe impairment' : 'Threshold met: at least moderate impairment';
      body='Symptoms affect two or more settings and the impairment is at least moderate, so the impairment part of the diagnosis is met under both DSM-5-TR and NICE.';
      next = max===3 ? 'Treat as a priority. Check risk now: driving, self-harm, substance use and safeguarding. Then complete the full assessment.' : 'Proceed with the full assessment and check the remaining criteria below.'; }
    var o = '<div class="imc-verdict t-'+tone+'"><p class="imc-vh">'+head+'</p><p>'+body+'</p></div><ul class="imc-checks">'
      + chk(affected>=2, 'Symptoms in 2 or more settings', 'DSM-5-TR C · NICE "pervasive"', affected+' of 3 settings affected.')
      + chk(max>=1, 'Clear interference with functioning', 'DSM-5-TR D', max>=1 ? 'Daily life is affected.' : 'No effect on daily life yet.')
      + chk(max>=2 && affected>=2, 'At least moderate impairment', 'NICE NG87 1.3.3', max>=2 ? 'Highest level: '+LEVELS[max].toLowerCase()+'.' : 'Highest level: '+LEVELS[max].toLowerCase()+'. NICE needs moderate or worse.')
      + '</ul><div class="imc-next"><strong>What you would do next</strong><p>'+next+'</p></div>'
      + '<p class="imc-still"><strong>Impairment is only one part.</strong> The diagnosis also needs 6 symptoms in a domain (5 from age 17), several before age 12, lasting 6 months, and not better explained by another condition.</p>';
    out.innerHTML = o;
  }
  root.addEventListener('click', function(e){
    var b = e.target.closest('button'); if(!b) return;
    if(b.classList.contains('imc-lv')){ st[b.closest('.imc-row').dataset.s] = +b.dataset.v; story=''; root.querySelectorAll('.imc-case').forEach(function(c){ c.classList.remove('on'); }); render(); }
    else if(b.classList.contains('imc-clear')){ st = {home:0, work:0, social:0}; story=''; root.querySelectorAll('.imc-case').forEach(function(c){ c.classList.remove('on'); }); render(); }
    else if(b.classList.contains('imc-case')){ var c = CASES[+b.dataset.i]; st = {home:c.v.home, work:c.v.work, social:c.v.social}; story = c.name+': '+c.story;
      root.querySelectorAll('.imc-case').forEach(function(x){ x.classList.toggle('on', x===b); }); render(); }
  });
  /* Arrow keys move within a rating row (radio-group behaviour). */
  root.addEventListener('keydown', function(e){
    var b = e.target.closest('.imc-lv'); if(!b || (e.key!=='ArrowRight' && e.key!=='ArrowLeft')) return;
    e.preventDefault(); var row = b.closest('.imc-row'), v = Math.min(3, Math.max(0, st[row.dataset.s] + (e.key==='ArrowRight'?1:-1)));
    st[row.dataset.s] = v; story=''; render(); row.querySelector('.imc-lv[data-v="'+v+'"]').focus();
  });
  render();
})();
