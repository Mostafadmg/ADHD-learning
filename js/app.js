/* ADHD for Pharmacists – app logic (no dependencies) */
(function(){
  'use strict';
  /* v2 storage: checklist ticks are keyed by each item's stable data-id, not its position. */
  var LS = 'adhdPharmLearn.v2', LS1 = 'adhdPharmLearn.v1';
  var V1_IDS = { /* item order in v1 for lists that did not change; 'mon' changed, so its v1 ticks are reset */
    dx:['dx-symptoms-meet-dsm','dx-onset-of-several','dx-symptoms-present-6','dx-pervasive-in-2','dx-at-least-moderate','dx-collateral-history-obtained','dx-rating-scales-completed','dx-differential-diagnoses-and','dx-assessment-by-a','dx-diagnosis-and-next'],
    baseline:['baseline-diagnosis-confirmed-and','baseline-mental-health-social','baseline-risk-of-substance','baseline-medical-history-and','baseline-height-and-weight','baseline-baseline-pulse-and','baseline-cardiovascular-history-examination','baseline-ecg-only-if','baseline-seizure-history-tics','baseline-pregnancy-contraception-discussed','baseline-driving-status-noted','baseline-shared-decision-making'] };
  function blank(){ return {done:{},checks:{},quiz:{}}; }
  function migrate(old){
    var st = {done:old.done||{}, checks:{}, quiz:old.quiz||{}, resetNotice:{}};
    var oc = old.checks||{};
    Object.keys(oc).forEach(function(k){
      var ids = V1_IDS[k], any=false;
      Object.keys(oc[k]||{}).forEach(function(i){ if(oc[k][i]) any=true; if(ids && oc[k][i] && ids[+i]){ st.checks[k]=st.checks[k]||{}; st.checks[k][ids[+i]]=true; } });
      if(!ids && any) st.resetNotice[k]=true;
    });
    return st;
  }
  var state = load();
  function load(){
    try{
      var v2 = JSON.parse(localStorage.getItem(LS));
      if(v2) return v2;
      var v1 = JSON.parse(localStorage.getItem(LS1));
      if(v1){ var m = migrate(v1); localStorage.setItem(LS, JSON.stringify(m)); localStorage.removeItem(LS1); return m; }
    }catch(e){}
    return blank();
  }
  function save(){ try{ localStorage.setItem(LS, JSON.stringify(state)); }catch(e){} }
  var $ = function(s,r){return (r||document).querySelector(s);};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

  /* ---------- routing ---------- */
  var modules = $$('.module');
  var trackable = modules.filter(function(m){return m.dataset.track==='1';});
  var current = null;
  function show(id){
    var el = id ? document.getElementById(id) : null;
    var target;
    if(el && el.classList.contains('module')) target = el;
    else if(el && el.closest && el.closest('.module')) target = el.closest('.module');
    else if(el) target = current || document.getElementById('home');   /* e.g. #main (skip link) */
    else target = document.getElementById('home');
    var changed = target !== current;
    modules.forEach(function(m){ m.classList.toggle('active', m===target); });
    $$('nav.sidebar a').forEach(function(a){
      if(a.getAttribute('href')==='#'+target.id) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    document.title = (target.dataset.title ? target.dataset.title+' · ' : '') + 'ADHD for Pharmacists';
    $('nav.sidebar').classList.remove('open');
    current = target;
    if(el && el !== target){
      /* deep link to an element inside a module, or the skip link to <main> */
      if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','-1');
      setTimeout(function(){ el.scrollIntoView({block:'start'}); el.focus({preventScroll:true}); }, 30);
      return;
    }
    if(changed || !el){ window.scrollTo(0,0); }
    var h = target.querySelector('h1'); if(h){ h.setAttribute('tabindex','-1'); h.focus({preventScroll:true}); }
  }
  window.addEventListener('hashchange', function(){ show(location.hash.slice(1)); });

  /* ---------- progress ---------- */
  function renderProgress(){
    var n = trackable.length, d = trackable.filter(function(m){return state.done[m.id];}).length;
    var pct = n? Math.round(d/n*100):0;
    $$('.js-progress-bar').forEach(function(b){ b.style.width = pct+'%'; });
    $$('.js-progress-text').forEach(function(t){ t.textContent = d+'/'+n+' modules ('+pct+'%)'; });
    $$('nav.sidebar li').forEach(function(li){
      var a = li.querySelector('a'); if(!a) return; var id=a.getAttribute('href').slice(1);
      li.classList.toggle('done', !!state.done[id]);
    });
    $$('.mcard').forEach(function(c){
      var id = c.getAttribute('href').slice(1); var st = c.querySelector('.st');
      c.classList.toggle('done', !!state.done[id]);
      if(st){ var qs = state.quiz[id]; st.textContent = (state.done[id]?'✓ Completed':'Not completed') + (qs? ' · quiz best '+qs.best+'/'+qs.total : ''); }
    });
    $$('.js-complete').forEach(function(b){
      var id=b.dataset.module; b.textContent = state.done[id] ? '✓ Marked complete (undo)' : 'Mark module as complete';
      b.setAttribute('aria-pressed', state.done[id]?'true':'false');
    });
  }
  $$('.js-complete').forEach(function(b){
    b.addEventListener('click', function(){ var id=b.dataset.module; state.done[id]=!state.done[id]; save(); renderProgress(); });
  });
  var reset = $('#resetProgress');
  if(reset) reset.addEventListener('click', function(){ if(confirm('Reset all progress, checklist ticks and quiz scores stored in this browser?')){ state=blank(); save(); location.reload(); } });

  /* ---------- mobile menu ---------- */
  var mb = $('.menu-btn');
  if(mb) mb.addEventListener('click', function(){ var s=$('nav.sidebar'); s.classList.toggle('open'); mb.setAttribute('aria-expanded', s.classList.contains('open')); });

  /* ---------- desktop sidebar collapse ---------- */
  (function(){
    var tg=$('.sb-toggle'), root=document.documentElement, KEY='adhd.sidebarCollapsed';
    if(!tg) return;
    var desk=window.matchMedia('(min-width:901px)');
    $$('nav.sidebar a').forEach(function(a){ var n=a.querySelector('.num'); if(!a.title) a.title=a.textContent.slice(n?n.textContent.length:0).trim(); });
    function sync(){ var col=root.classList.contains('sb-collapsed'); var lbl=col?'Expand menu':'Collapse menu';
      tg.setAttribute('aria-expanded', col?'false':'true'); tg.setAttribute('aria-label', lbl); tg.title=lbl+' (shortcut: [ )';
      tg.querySelector('.sb-ico').textContent=col?'»':'«'; tg.querySelector('.sb-lbl').textContent=lbl; }
    function set(col){ root.classList.toggle('sb-collapsed', col); try{ localStorage.setItem(KEY, col?'1':'0'); }catch(e){} sync();
      setTimeout(function(){ window.dispatchEvent(new Event('resize')); }, 300); }
    tg.addEventListener('click', function(){ set(!root.classList.contains('sb-collapsed')); });
    document.addEventListener('keydown', function(e){
      if(e.key!=='[' || e.ctrlKey || e.metaKey || e.altKey || !desk.matches) return;
      var t=e.target, tag=t && t.tagName;
      if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT'||(t&&t.isContentEditable)) return;
      e.preventDefault(); set(!root.classList.contains('sb-collapsed'));
    });
    sync();
  })();

  /* ---------- flip cards ---------- */
  $$('.flip').forEach(function(f){
    f.setAttribute('aria-pressed','false');
    var back = f.querySelector('.back'), front = f.querySelector('.front');
    function sync(){ var on=f.classList.contains('flipped'); f.setAttribute('aria-pressed', on?'true':'false'); if(back) back.setAttribute('aria-hidden', on?'false':'true'); if(front) front.setAttribute('aria-hidden', on?'true':'false'); }
    function toggle(){ f.classList.toggle('flipped'); sync(); }
    f.addEventListener('click', toggle);
    f.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){ e.preventDefault(); toggle(); } });
    sync();
  });

  /* ---------- checklists ---------- */
  $$('.checklist[data-key]').forEach(function(ul){
    var key = ul.dataset.key;
    var boxes = $$('input[type=checkbox]', ul);
    var out = ul.parentNode.querySelector('.cl-progress[data-for="'+key+'"]');
    function upd(){
      var c = boxes.filter(function(b){return b.checked;}).length;
      if(out) out.textContent = c+' of '+boxes.length+' items ticked';
      boxes.forEach(function(b){ var l=b.nextElementSibling; if(l) l.classList.toggle('done-label', b.checked); });
    }
    boxes.forEach(function(b,i){
      var sid = b.getAttribute('data-id') || (key+'-'+i);
      b.id = b.id || ('cl-'+sid);
      var l = b.nextElementSibling; if(l && l.tagName==='LABEL') l.setAttribute('for', b.id);
      b.checked = !!(state.checks[key] && state.checks[key][sid]);
      b.addEventListener('change', function(){ state.checks[key]=state.checks[key]||{}; if(b.checked) state.checks[key][sid]=true; else delete state.checks[key][sid]; save(); upd(); });
    });
    upd();
    if(state.resetNotice && state.resetNotice[key] && out){
      var n=document.createElement('p'); n.className='cl-note'; n.setAttribute('role','status');
      n.textContent='This checklist was updated, so your earlier ticks on it were cleared.';
      out.parentNode.insertBefore(n, out.nextSibling);
      delete state.resetNotice[key]; save();
    }
    var clr = ul.parentNode.querySelector('.js-clear[data-for="'+key+'"]');
    if(clr) clr.addEventListener('click', function(){ boxes.forEach(function(b){b.checked=false;}); state.checks[key]={}; save(); upd(); });
  });

  /* ---------- quizzes ---------- */
  function renderQuiz(el){
    var id = el.dataset.quiz, data = (window.QUIZ||{})[id]; if(!data) return;
    var score=0, answered=0;
    var html = '<h2 id="'+id+'-quiz-h">'+(el.dataset.title||'Check your understanding')+'</h2><p class="cl-progress">'+data.length+' questions. Pick an answer to see the explanation and source.</p>';
    data.forEach(function(q,qi){
      html += '<div class="q" data-qi="'+qi+'"><div class="stem">'+(qi+1)+'. '+q.q+'</div><div class="opts" role="group" aria-label="Options for question '+(qi+1)+'">';
      q.o.forEach(function(o,oi){ html += '<button type="button" class="opt" data-oi="'+oi+'">'+String.fromCharCode(65+oi)+'. '+o+'</button>'; });
      html += '</div><div class="expl" aria-live="polite"><span class="res"></span> '+q.e+(q.s?'<div class="src">Source: '+q.s+'</div>':'')+'</div></div>';
    });
    html += '<div class="score" aria-live="polite"></div><button type="button" class="btn secondary js-qreset">Reset quiz</button>';
    el.innerHTML = html;
    var scoreEl = el.querySelector('.score');
    function upd(){
      scoreEl.textContent = 'Score: '+score+' / '+answered+' answered (of '+data.length+')';
      if(answered===data.length){
        var prev = state.quiz[el.dataset.module||id]; var best = Math.max(score, prev?prev.best:0);
        state.quiz[el.dataset.module||id] = {best:best,total:data.length}; save(); renderProgress();
        scoreEl.textContent += ' — finished! ' + (score/data.length>=0.8 ? 'Excellent (≥80%).' : 'Review the explanations and try again.');
      }
    }
    $$('.q', el).forEach(function(qd){
      var q = data[+qd.dataset.qi];
      $$('.opt', qd).forEach(function(b){
        b.addEventListener('click', function(){
          if(qd.classList.contains('answered')) return;
          qd.classList.add('answered'); answered++;
          var oi=+b.dataset.oi, ok = oi===q.a;
          if(ok) score++;
          $$('.opt', qd).forEach(function(x){ x.disabled=true; if(+x.dataset.oi===q.a) x.classList.add('correct'); });
          if(!ok) b.classList.add('wrong');
          qd.querySelector('.res').innerHTML = ok ? '<strong>✓ Correct.</strong>' : '<strong>✗ Not quite.</strong> Correct answer: '+String.fromCharCode(65+q.a)+'.';
          upd();
        });
      });
    });
    el.querySelector('.js-qreset').addEventListener('click', function(){ renderQuiz(el); });
    upd();
  }
  $$('.quiz[data-quiz]').forEach(renderQuiz);

  /* ---------- branching cases ---------- */
  function renderCase(el){
    var c = (window.CASES||{})[el.dataset.case]; if(!c) return;
    var trail=[];
    el.innerHTML = '<div class="case-head">'+(c.img?'<img src="'+c.img+'" alt="'+esc(c.alt||'Case illustration')+'" width="1152" height="864" decoding="async">':'')+
      '<div><h3 style="margin:0">'+c.title+'</h3><p style="margin:.3rem 0">'+c.summary+'</p>'+(c.source?'<span class="source-tag">'+c.source+'</span>':'')+'</div></div><div class="case-body" aria-live="polite"></div>';
    var body = el.querySelector('.case-body');
    function go(nid){
      var n = c.nodes[nid]; trail.push(nid);
      var h = '<div class="node-text">'+n.text+'</div>';
      if(n.end){
        h += '<div class="fb good"><strong>Case complete.</strong> '+(n.summary||'')+'</div><button type="button" class="btn secondary js-restart">Restart case</button>';
        body.innerHTML = h; body.querySelector('.js-restart').addEventListener('click', function(){ trail=[]; go(c.start); }); return;
      }
      h += '<p><strong>'+(n.ask||'What would you do?')+'</strong></p><div class="choices">';
      n.choices.forEach(function(ch,i){ h += '<button type="button" class="choice" data-i="'+i+'">'+String.fromCharCode(65+i)+'. '+ch.t+'</button>'; });
      h += '</div><div class="fbwrap"></div><p class="trail">Step '+trail.length+'</p>';
      body.innerHTML = h;
      $$('.choice', body).forEach(function(b){
        b.addEventListener('click', function(){
          var ch = n.choices[+b.dataset.i];
          var fw = body.querySelector('.fbwrap');
          var label = ch.grade==='good'?'Best choice':(ch.grade==='ok'?'Reasonable, but not best':'Not recommended');
          fw.innerHTML = '<div class="fb '+ch.grade+'"><strong>'+label+'.</strong> '+ch.fb+'</div>' + '<button type="button" class="btn js-next">'+(ch.grade==='good'?'Continue →':'Try another option')+'</button>';
          var nx = fw.querySelector('.js-next');
          if(nx) nx.addEventListener('click', function(){ if(ch.grade==='good'){ go(ch.next); } else { fw.innerHTML=''; } });
          if(nx) nx.focus();
        });
      });
    }
    go(c.start);
  }
  $$('.case[data-case]').forEach(renderCase);

  /* ---------- titration stepper ---------- */
  var st = $('#stepper');
  if(st && window.TITRATION){
    var sel = $('#stepDrug', st), track = $('.track', st), det = $('.step-detail', st), bar = $('.dose-bar span', st), meta=$('.step-meta', st);
    var idx = 0;
    Object.keys(TITRATION).forEach(function(k){ var o=document.createElement('option'); o.value=k; o.textContent=TITRATION[k].name; sel.appendChild(o); });
    function draw(){
      var d = TITRATION[sel.value]; var n=d.steps.length;
      meta.innerHTML = '<p><strong>Population:</strong> '+d.pop+' &nbsp; <strong>'+(d.maxLabel||'Licensed maximum')+':</strong> '+d.max+'</p><p class="cl-progress">'+d.note+' <br><em>Source: '+d.src+'</em></p>';
      track.innerHTML = d.steps.map(function(s,i){
        return '<button type="button" class="st '+(i<idx?'past':'')+(i===idx?' cur':'')+(s.isMax?' max':'')+(s.isTarget?' target':'')+'" data-i="'+i+'" aria-label="Step '+(i+1)+': '+esc(s.dose)+(s.isMax?' (licensed maximum)':'')+(s.isTarget?' (usual maintenance target)':'')+'"><span>'+s.when+'</span><b>'+s.dose+'</b>'+(s.isMax?'<small class="tg tg-max">licensed max</small>':'')+(s.isTarget?'<small class="tg tg-target">usual maintenance</small>':'')+'</button>';
      }).join('');
      var s = d.steps[idx];
      det.innerHTML = '<strong>'+s.when+': '+s.dose+'</strong><p>'+s.detail+'</p><p class="cl-progress"><strong>Monitor at this step:</strong> '+(s.monitor||d.monitor)+'</p>';
      bar.style.width = Math.round((idx+1)/n*100)+'%';
      $$('.st', track).forEach(function(b){ b.addEventListener('click', function(){ idx=+b.dataset.i; draw(); }); });
      $('#stepPrev', st).disabled = idx===0; $('#stepNext', st).disabled = idx===n-1;
    }
    sel.addEventListener('change', function(){ idx=0; draw(); });
    $('#stepPrev', st).addEventListener('click', function(){ if(idx>0){idx--; draw();} });
    $('#stepNext', st).addEventListener('click', function(){ if(idx<TITRATION[sel.value].steps.length-1){idx++; draw();} });
    draw();
  }

  /* ---------- MR methylphenidate profile explorer ---------- */
  var mr = $('#mrExplorer');
  if(mr){
    var prof = {
      'Concerta XL and bioequivalent tablets (Affenid XL, Atenza XL, Delmosart, Matoride XL, Xaggitin XL, Xenidate XL)':{ir:22,mr:78,dur:'about 12 h (second peak 6–8 h)',food:'With or without food; swallow whole with liquid; do not chew, divide or crush',strengths:'18, 27, 36, 54 mg (Atenza XL also 45 mg; Matoride XL 18, 36, 54 mg)',note:'Concerta XL, Affenid XL, Atenza XL and Matoride XL are osmotic tablets (the empty shell may appear in stool). SPS gives Delmosart and Xaggitin XL as 25:75 (Xaggitin XL is a matrix tablet) and Xenidate XL as a multiple-unit tablet; all are bioequivalent to Concerta XL (SPS). Matoride XL is licensed for children only.'},
      'Ritalin XL-type capsules (Ritalin XL, Meflynate XL, Metyrol XL, Focusim XL)':{ir:50,mr:50,dur:'about 8 h (two peaks about 4 h apart)',food:'With or without food; capsule may be opened and the beads sprinkled on cool soft food and taken at once',strengths:'Ritalin XL 10–40 mg; Meflynate XL and Metyrol XL 10–60 mg; Focusim XL 10–40 mg',note:'SPS lists these four as bioequivalent to one another. Second peak at 5–7 h (Ritalin XL SmPC) or about 4 h (SPS table).'},
      'Medikinet XL capsules':{ir:50,mr:50,dur:'about 8 h (second rise ~3 h after the first)',food:'Must be taken with or after food (risk of dose dumping on an empty stomach): children in the morning with breakfast; adults morning and lunchtime with meals; may be opened and sprinkled on apple sauce or yoghurt',strengths:'5, 10, 20, 30, 40, 50, 60 mg',note:'SPS: not completely bioequivalent with the Ritalin XL-type capsules, so switch with particular care.'},
      'Equasym XL capsules':{ir:30,mr:70,dur:'about 8 h (peaks ~1.5 h and ~4.5 h)',food:'In the morning before breakfast; may be opened and sprinkled on a tablespoon of apple sauce',strengths:'10, 20, 30 mg',note:'SPS: no other MR product is bioequivalent, so do not switch or prescribe generically. Not licensed for adults.'},
      'Immediate-release methylphenidate (Medikinet, Ritalin tablets)':{ir:100,mr:0,dur:'about 4 h',food:'Ritalin: with or without food. Medikinet: with or after meals, at the same times each day',strengths:'Medikinet 5, 10, 20 mg; Ritalin 10 mg',note:'Flexible; higher misuse and diversion potential (NICE 1.7.20, 1.7.24).'}
    };
    var ms = $('#mrSelect', mr), out = $('#mrOut', mr);
    Object.keys(prof).forEach(function(k){ var o=document.createElement('option'); o.value=k; o.textContent=k.split(' (')[0]; ms.appendChild(o); });
    function drawMR(){
      var p = prof[ms.value];
      out.innerHTML = '<div style="display:flex;height:34px;border-radius:9px;overflow:hidden;margin:.6rem 0" role="img" aria-label="'+p.ir+'% immediate release, '+p.mr+'% modified release">'+
        '<div style="width:'+p.ir+'%;background:var(--coral);color:#fff;display:grid;place-items:center;font-size:.85rem">'+(p.ir?'IR '+p.ir+'%':'')+'</div>'+
        '<div style="width:'+p.mr+'%;background:var(--teal);color:#fff;display:grid;place-items:center;font-size:.85rem">'+(p.mr?'MR '+p.mr+'%':'')+'</div></div>'+
        '<table><tr><th>Duration</th><th>Administration</th><th>Strengths</th></tr><tr><td>'+p.dur+'</td><td>'+p.food+'</td><td>'+p.strengths+'</td></tr></table><p class="cl-progress">'+p.note+'</p>';
    }
    ms.addEventListener('change', drawMR); drawMR();
  }

  /* ---------- BP/HR action helper ---------- */
  var bp = $('#bpTool');
  if(bp){
    $('#bpCheck', bp).addEventListener('click', function(){
      var hr = +$('#bpHr', bp).value, age = $('#bpAge', bp).value, sbpHigh = $('#bpSbp', bp).checked, two = $('#bpTwo', bp).checked, arr=$('#bpArr', bp).checked;
      var out = $('#bpOut', bp), msg='', cls='good';
      var trigger = (hr>120) || sbpHigh || arr;
      if(trigger && (two || arr)){
        cls='bad'; msg='<strong>Act (NICE NG87 1.8.11):</strong> sustained resting tachycardia &gt;120 bpm, arrhythmia, or systolic BP &gt;95th centile (or a clinically significant rise) on 2 occasions → reduce the dose and refer to '+(age==='child'?'a paediatric hypertension specialist':'an adult physician')+'. Inform the initiating specialist under the shared care protocol.';
      } else if(trigger){
        cls='ok'; msg='<strong>Recheck:</strong> a single raised reading does not meet the NG87 threshold. Repeat with an appropriately sized cuff, at rest, and compare with the normal range for age; act if sustained on 2 occasions.';
      } else {
        msg='<strong>No NG87 action threshold met.</strong> Continue routine monitoring: HR and BP before and after each dose change and every 6 months (NG87 1.8.9). Use clinical judgement for symptoms such as chest pain, syncope or palpitations.';
      }
      out.className='fb '+cls; out.innerHTML=msg;
    });
  }

  renderProgress();

  /* ---------- stepwise mechanism diagrams ---------- */
  $$('.mech').forEach(function(m){
    var n = parseInt(m.dataset.steps,10)||1;
    var lis = $$('ol.walk li', m), dots = $$('.mdot', m);
    var prev = $('.mprev', m), next = $('.mnext', m), live = $('.mech-live', m);
    function go(k, user){
      k = Math.max(1, Math.min(n, k)); m.dataset.step = String(k);
      lis.forEach(function(li){ var on = li.dataset.s===String(k); li.classList.toggle('cur', on); if(on) li.setAttribute('aria-current','step'); else li.removeAttribute('aria-current'); });
      dots.forEach(function(d){ if(d.dataset.go===String(k)) d.setAttribute('aria-current','step'); else d.removeAttribute('aria-current'); });
      prev.disabled = k===1; next.disabled = k===n;
      if(live){ var li = lis[k-1]; live.textContent = 'Step '+k+' of '+n+': '+(li?li.textContent:''); }
    }
    prev.addEventListener('click', function(){ go(parseInt(m.dataset.step,10)-1, true); });
    next.addEventListener('click', function(){ go(parseInt(m.dataset.step,10)+1, true); });
    dots.forEach(function(d){ d.addEventListener('click', function(){ go(parseInt(d.dataset.go,10), true); }); });
    lis.forEach(function(li){ li.setAttribute('tabindex','0'); li.addEventListener('click', function(){ go(parseInt(li.dataset.s,10), true); });
      li.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(parseInt(li.dataset.s,10), true); } }); });
    m.addEventListener('keydown', function(e){ if(e.target.tagName==='LI') return; if(e.key==='ArrowRight'){ go(parseInt(m.dataset.step,10)+1,true); } if(e.key==='ArrowLeft'){ go(parseInt(m.dataset.step,10)-1,true); } });
    go(1,false);
  });

  /* ---------- figure walkthroughs: link numbered markers and steps ---------- */
  $$('figure.wt').forEach(function(f){
    var marks = $$('.wk-mark', f), lis = $$('ol.walk li', f);
    function sel(k){
      marks.forEach(function(b){ b.classList.toggle('cur', b.dataset.s===k); });
      lis.forEach(function(li){ li.classList.toggle('cur', li.dataset.s===k); });
    }
    marks.forEach(function(b){ b.addEventListener('click', function(){ sel(b.dataset.s); var li = lis[parseInt(b.dataset.s,10)-1]; if(li && li.scrollIntoView && window.innerWidth<900) li.scrollIntoView({block:'nearest'}); }); });
    lis.forEach(function(li){ li.setAttribute('tabindex','0'); li.addEventListener('click', function(){ sel(li.dataset.s); });
      li.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); sel(li.dataset.s); } }); });
  });
  show(location.hash.slice(1) || 'home');
})();
