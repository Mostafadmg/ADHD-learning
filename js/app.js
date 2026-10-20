/* ADHD for Pharmacists – app logic (no dependencies) */
(function(){
  'use strict';
  var LS = 'adhdPharmLearn.v1';
  var state = load();
  function load(){ try{ return JSON.parse(localStorage.getItem(LS)) || {done:{},checks:{},quiz:{}}; }catch(e){ return {done:{},checks:{},quiz:{}}; } }
  function save(){ try{ localStorage.setItem(LS, JSON.stringify(state)); }catch(e){} }
  var $ = function(s,r){return (r||document).querySelector(s);};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

  /* ---------- routing ---------- */
  var modules = $$('.module');
  var trackable = modules.filter(function(m){return m.dataset.track==='1';});
  function show(id){
    var target = document.getElementById(id) || document.getElementById('home');
    modules.forEach(function(m){ m.classList.toggle('active', m===target); });
    $$('nav.sidebar a').forEach(function(a){
      if(a.getAttribute('href')==='#'+target.id) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    document.title = (target.dataset.title ? target.dataset.title+' · ' : '') + 'ADHD for Pharmacists';
    $('nav.sidebar').classList.remove('open');
    window.scrollTo(0,0);
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
  if(reset) reset.addEventListener('click', function(){ if(confirm('Reset all progress, checklist ticks and quiz scores stored in this browser?')){ state={done:{},checks:{},quiz:{}}; save(); location.reload(); } });

  /* ---------- mobile menu ---------- */
  var mb = $('.menu-btn');
  if(mb) mb.addEventListener('click', function(){ var s=$('nav.sidebar'); s.classList.toggle('open'); mb.setAttribute('aria-expanded', s.classList.contains('open')); });

  /* ---------- flip cards ---------- */
  $$('.flip').forEach(function(f){
    f.setAttribute('aria-pressed','false');
    f.addEventListener('click', function(){ f.classList.toggle('flipped'); f.setAttribute('aria-pressed', f.classList.contains('flipped')); });
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
      b.id = b.id || (key+'-'+i);
      var l = b.nextElementSibling; if(l && l.tagName==='LABEL') l.setAttribute('for', b.id);
      b.checked = !!(state.checks[key] && state.checks[key][i]);
      b.addEventListener('change', function(){ state.checks[key]=state.checks[key]||{}; state.checks[key][i]=b.checked; save(); upd(); });
    });
    upd();
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
    el.innerHTML = '<div class="case-head">'+(c.img?'<img src="'+c.img+'" alt="'+esc(c.alt||'Case illustration')+'" loading="lazy">':'')+
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
      meta.innerHTML = '<p><strong>Population:</strong> '+d.pop+' &nbsp; <strong>Licensed maximum:</strong> '+d.max+'</p><p class="cl-progress">'+d.note+' <br><em>Source: '+d.src+'</em></p>';
      track.innerHTML = d.steps.map(function(s,i){
        return '<button type="button" class="st '+(i<idx?'past':'')+(i===idx?' cur':'')+(s.isMax?' max':'')+'" data-i="'+i+'" aria-label="Step '+(i+1)+': '+esc(s.dose)+'"><span>'+s.when+'</span><b>'+s.dose+'</b></button>';
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
      'Concerta XL (and bioequivalent tablets: Affenid XL, Delmosart, Matoride XL, Xaggitin XL, Xenidate XL, Atenza XL)':{ir:22,mr:78,dur:'about 12 h',food:'With or without food; swallow whole',strengths:'18, 27, 36, 54 mg',note:'OROS osmotic tablet; IR overcoat then osmotic push. Delmosart/Xaggitin quoted as 25:75 by SPS but treated as bioequivalent to Concerta XL.'},
      'Medikinet XL capsules':{ir:50,mr:50,dur:'about 8 h',food:'Take with or after breakfast (adults: morning and lunchtime with food per SPC); capsule may be opened and sprinkled on apple sauce or yoghurt',strengths:'5–60 mg',note:'SPS: not completely bioequivalent with Meflynate/Metyrol/Ritalin XL/Focusim — switch with particular care.'},
      'Equasym XL capsules':{ir:30,mr:70,dur:'about 8 h',food:'Before breakfast; may be sprinkled on apple sauce',strengths:'10, 20, 30 mg',note:'SPS: no other MR product is bioequivalent — do not switch or prescribe generically.'},
      'Meflynate XL / Metyrol XL / Ritalin XL / Focusim XL capsules':{ir:50,mr:50,dur:'about 8 h',food:'No food requirement; capsule may be opened and pellets sprinkled on soft food',strengths:'Meflynate XL 10–60 mg',note:'SPS lists these four as bioequivalent to one another.'},
      'Immediate-release methylphenidate (e.g. Medikinet, Ritalin tablets)':{ir:100,mr:0,dur:'about 4 h',food:'Medikinet IR: preferably with or immediately after meals',strengths:'5, 10, 20 mg',note:'Flexible; higher misuse/diversion potential (NICE 1.7.20, 1.7.24).'}
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
  show(location.hash.slice(1) || 'home');
})();
