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
  function show(id, initial){
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
    document.title = (target.dataset.title ? target.dataset.title+' · ' : '') + 'ADHD for Clinicians';
    $('nav.sidebar').classList.remove('open');
    current = target;
    if(el && el !== target){
      /* deep link to an element inside a module, or the skip link to <main> */
      var ls = el.closest && el.closest('.lesson'); if(ls && window.__lessonReveal) window.__lessonReveal(ls);
      if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','-1');
      setTimeout(function(){ el.scrollIntoView({block:'start'}); if(!initial) el.focus({preventScroll:true}); }, 30);
      return;
    }
    if(changed || !el){ window.scrollTo(0,0); }
    /* On first load leave focus at the top of the document so the first Tab reaches the skip link. */
    var h = target.querySelector('h1'); if(h){ h.setAttribute('tabindex','-1'); if(!initial) h.focus({preventScroll:true}); }
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

  /* ---------- lessons: a module split into short screens, one at a time ----------
     Markup: <div class="lessons" data-lessons="<moduleId>"> <section class="lesson" data-title data-min>…</section> … </div>
     Remembers the last lesson and which lessons were finished (state.lessons). */
  state.lessons = state.lessons || {};
  var lessonSets = [];
  $$('[data-lessons]').forEach(function(box){
    var key = box.dataset.lessons, ls = $$('.lesson', box), n = ls.length; if(!n) return;
    var rec = state.lessons[key] = state.lessons[key] || {at:-1, done:{}};   /* at -1 = the module overview screen */
    var total = ls.reduce(function(t,l){ return t + (+l.dataset.min||0); }, 0);
    var bar = document.createElement('div'); bar.className = 'ls-bar';
    var menu = '<li><button type="button" data-i="-1"><span class="ls-n">i</span><span class="ls-t">Overview</span><span class="ls-m"></span></button></li>';
    ls.forEach(function(l,i){ menu += '<li><button type="button" data-i="'+i+'"><span class="ls-n">'+(i+1)+'</span><span class="ls-t">'+esc(l.dataset.title)+'</span><span class="ls-m">'+(l.dataset.min||'')+' min</span></button></li>'; });
    bar.innerHTML = '<div class="ls-top"><span class="ls-pos" aria-live="polite"></span><button type="button" class="ls-menu-btn" aria-expanded="false">All lessons <span aria-hidden="true">▾</span></button></div>'
      + '<div class="ls-steps" role="group" aria-label="Jump to a lesson">'+ls.map(function(l,i){ var t = 'Lesson '+(i+1)+': '+esc(l.dataset.title); return '<button type="button" class="ls-seg" data-i="'+i+'" title="'+t+'" aria-label="'+t+'"><span></span></button>'; }).join('')+'</div>'
      + '<ol class="ls-menu" hidden>'+menu+'</ol>';
    box.insertBefore(bar, ls[0]);
    var nav = document.createElement('div'); nav.className = 'ls-nav';
    nav.innerHTML = '<button type="button" class="btn secondary ls-prev">← Previous</button><button type="button" class="btn ls-next"></button>';
    box.appendChild(nav);
    var pos = $('.ls-pos', bar), steps = $$('.ls-seg', bar), mbtn = $('.ls-menu-btn', bar), mlist = $('.ls-menu', bar), items = $$('.ls-menu button', bar);
    var prev = $('.ls-prev', nav), next = $('.ls-next', nav), cur = 0;
    var intro = box.closest('.module') && $('.mod-head', box.closest('.module'));   /* the overview is its own first screen */
    function go(i, scroll){
      cur = Math.max(intro ? -1 : 0, Math.min(n-1, i)); rec.at = cur; save();
      ls.forEach(function(l,li){ l.hidden = li!==cur; });
      var ov = cur===-1; if(intro) intro.hidden = !ov; bar.hidden = ov;
      prev.hidden = ov || (cur===0 && !intro);
      prev.textContent = cur===0 ? '← Overview' : '← Previous';
      next.hidden = cur===n-1;
      next.textContent = ov ? 'Start lesson 1: '+ls[0].dataset.title+' →' : (cur<n-1 ? 'Next: '+ls[cur+1].dataset.title+' →' : '');
      items.forEach(function(b){ var bi = +b.dataset.i; b.classList.toggle('cur', bi===cur); b.classList.toggle('done', bi>=0 && !!rec.done[bi]); b.setAttribute('aria-current', bi===cur?'step':'false'); });
      if(scroll) window.scrollTo({top:0});
      if(ov){ if(scroll){ var h1 = $('h1', intro); if(h1) h1.focus({preventScroll:true}); } return; }
      pos.innerHTML = '<strong>Lesson '+(cur+1)+' of '+n+'</strong> · '+esc(ls[cur].dataset.title)+' · '+(ls[cur].dataset.min||'?')+' min <span class="ls-total">('+total+' min in total)</span>';
      steps.forEach(function(s,si){ s.className = 'ls-seg' + (si===cur ? ' cur' : (rec.done[si] ? ' done' : '')); s.setAttribute('aria-current', si===cur ? 'step' : 'false'); });
      if(scroll){ var h = $('h2', ls[cur]); if(h){ h.setAttribute('tabindex','-1'); h.focus({preventScroll:true}); } }
    }
    function menuOpen(o){ mlist.hidden = !o; mbtn.setAttribute('aria-expanded', o?'true':'false'); }
    mbtn.addEventListener('click', function(){ menuOpen(mlist.hidden); });
    items.forEach(function(b){ b.addEventListener('click', function(){ menuOpen(false); go(+b.dataset.i, true); }); });
    steps.forEach(function(b){ b.addEventListener('click', function(){ menuOpen(false); go(+b.dataset.i, true); }); });
    prev.addEventListener('click', function(){ go(cur-1, true); });
    next.addEventListener('click', function(){ if(cur>=0) rec.done[cur] = true; go(cur+1, true); });
    lessonSets.push({box:box, ls:ls, go:go});
    go(typeof rec.at==='number' ? rec.at : -1, false);
  });
  window.__lessonReveal = function(l){ lessonSets.forEach(function(set){ var i = set.ls.indexOf(l); if(i>=0) set.go(i, false); }); };
  /* A deep link on first load (#some-id inside a lesson) opens that lesson. */
  (function(){ var t = location.hash && document.getElementById(location.hash.slice(1)); var l = t && t.closest && t.closest('.lesson'); if(l) window.__lessonReveal(l); })();

  /* ---------- table[data-cards]: a grid of tappable cards (first two columns) with a detail panel
     for the other columns. The table stays in the page, hidden, as the no-JS fallback. ---------- */
  $$('table[data-cards]').forEach(function(t){
    var rows = $$('tr', t).filter(function(r){ return r.querySelector('td'); }), heads = $$('th', t).map(function(th){ return th.textContent.trim(); });
    var cap = t.querySelector('caption'), wrap = document.createElement('div'); wrap.className = 'sxc sxc-'+(t.dataset.cards||'a');
    var h = (cap ? '<p class="sxc-cap">'+cap.innerHTML+'</p>' : '') + '<div class="sxc-grid" role="list">';
    rows.forEach(function(r,i){ var c = $$('td', r); h += '<button type="button" class="sxc-card" role="listitem" data-i="'+i+'" aria-expanded="false"><span class="sxc-code">'+c[0].innerHTML+'</span><span class="sxc-name">'+c[1].innerHTML+'</span></button>'; });
    h += '</div><div class="sxc-detail" aria-live="polite" hidden></div>';
    wrap.innerHTML = h;
    var host = t.closest('.table-wrap, .tbl-sc') || t; host.parentNode.insertBefore(wrap, host); host.hidden = true; host.style.display = 'none';
    var cards = $$('.sxc-card', wrap), det = $('.sxc-detail', wrap);
    function open(i){
      var c = $$('td', rows[i]), d = '<p class="sxc-dh"><span class="sxc-code">'+c[0].innerHTML+'</span> '+c[1].innerHTML+'</p><div class="sxc-cols">';
      for(var k=2;k<c.length;k++) d += '<div><span class="sxc-lbl">'+esc(heads[k]||'')+'</span><p>'+c[k].innerHTML+'</p></div>';
      det.innerHTML = d+'</div>'; det.hidden = false;
      /* Phones (2 columns): open the detail straight under the tapped card's row; wider screens: under the grid. */
      var grid = $('.sxc-grid', wrap);
      if(window.matchMedia('(max-width:600px)').matches){ var after = cards[Math.min(cards.length-1, i|1)]; grid.insertBefore(det, after.nextSibling); }
      else if(det.parentNode !== wrap) wrap.appendChild(det);
      cards.forEach(function(b,bi){ b.classList.toggle('cur', bi===i); b.setAttribute('aria-expanded', bi===i?'true':'false'); });
    }
    cards.forEach(function(b){ b.addEventListener('click', function(){ open(+b.dataset.i); }); });
    open(0);
  });

  /* ---------- tables in [data-stack-tables] sections become labelled cards on phones (CSS) ---------- */
  $$('[data-stack-tables] table').forEach(function(t){
    var heads = $$('th', t).map(function(th){ return th.textContent.trim(); }); if(heads.length < 3 || t.hasAttribute('data-nostack')) return;
    t.classList.add('stack-sm');
    $$('tr', t).forEach(function(tr){ $$('td', tr).forEach(function(td,i){ if(heads[i]) td.setAttribute('data-label', heads[i]); }); });
  });

  /* ---------- teaching pictures: neat placeholder if the image file is missing ---------- */
  function picMissing(im){
    var f = im.closest('.m1-pic'); if(!f || f.classList.contains('pic-missing')) return;
    f.classList.add('pic-missing'); f.setAttribute('data-file', (im.getAttribute('src')||'').split('?')[0]);
  }
  $$('.m1-pic img').forEach(function(im){
    im.addEventListener('error', function(){ if(im.dataset.retried) picMissing(im); });
    window.addEventListener('load', function(){ setTimeout(function(){ if(im.complete && im.naturalWidth===0) picMissing(im); }, 2500); });
  });

  /* ---------- "Myth or fact?" cards: tap to reveal the verdict ---------- */
  $$('.mf').forEach(function(b){
    b.addEventListener('click', function(){ var on = b.classList.toggle('open'); b.setAttribute('aria-expanded', on?'true':'false'); });
  });

  /* ---------- toolkit lanes: age filter fades tools that do not apply ---------- */
  $$('.tk-filter').forEach(function(f){
    var kit = f.nextElementSibling;
    $$('.tk-f', f).forEach(function(b){
      b.setAttribute('aria-pressed', b.classList.contains('on') ? 'true' : 'false');
      b.addEventListener('click', function(){
        var age = b.dataset.age;
        $$('.tk-f', f).forEach(function(x){ x.classList.toggle('on', x===b); x.setAttribute('aria-pressed', x===b ? 'true' : 'false'); });
        $$('.tk-tool', kit).forEach(function(t){ t.classList.toggle('dim', age!=='all' && t.dataset.age!=='both' && t.dataset.age!==age); });
      });
    });
  });

  /* ---------- flashcard decks: one card at a time ---------- */
  $$('.flip-grid[data-deck]').forEach(function(g){
    var cards = $$('.flip', g), i = 0; if(!cards.length) return;
    var nav = document.createElement('div'); nav.className = 'deck-nav';
    nav.innerHTML = '<button type="button" class="btn secondary js-dprev">← Previous</button><span class="deck-pos" aria-live="polite"></span><button type="button" class="btn js-dnext">Next →</button>';
    g.parentNode.insertBefore(nav, g.nextSibling);
    var pos = nav.querySelector('.deck-pos'), prev = nav.querySelector('.js-dprev'), next = nav.querySelector('.js-dnext');
    function go(n){
      cards[i].classList.remove('flipped'); cards[i].setAttribute('aria-pressed','false');
      i = (n + cards.length) % cards.length;
      cards.forEach(function(c,ci){ c.hidden = ci!==i; });
      pos.textContent = 'Card '+(i+1)+' of '+cards.length+' · tap the card to flip';
    }
    prev.addEventListener('click', function(){ go(i-1); });
    next.addEventListener('click', function(){ go(i+1); });
    go(0);
  });

  /* ---------- practice boxes: tabs between flashcards and quizzes ---------- */
  var prN = 0;
  $$('[data-practice]').forEach(function(box){
    var boxN = ++prN;
    var tabs = $$('.pr-tab', box), panels = $$('.pr-panel', box);
    function sel(n, focus){
      tabs.forEach(function(t,ti){ t.setAttribute('aria-selected', ti===n?'true':'false'); t.tabIndex = ti===n?0:-1; });
      panels.forEach(function(p,pi){ p.hidden = pi!==n; });
      if(focus) tabs[n].focus();
    }
    tabs.forEach(function(t,ti){
      var pid = 'pr'+boxN+'-'+ti;
      t.id = pid+'-t'; panels[ti].id = pid; t.setAttribute('aria-controls', pid); panels[ti].setAttribute('aria-labelledby', t.id);
      t.addEventListener('click', function(){ sel(ti); });
      t.addEventListener('keydown', function(e){
        if(e.key==='ArrowRight'||e.key==='ArrowLeft'){ e.preventDefault(); sel((ti+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length, true); }
      });
    });
    sel(0);
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
    /* Collapsed by default to save space; stays open across a reset. */
    var wasOpen = 'open' in el.dataset || !!el.querySelector('details.quiz-d[open]'), best = state.quiz[el.dataset.module||id];
    var html = '<details class="quiz-d"'+(wasOpen?' open':'')+'><summary><span class="quiz-sum"><h2 id="'+id+'-quiz-h">'+(el.dataset.title||'Check your understanding')+'</h2><span class="cl-progress">'+data.length+' questions'+(best?' · best score '+best.best+'/'+best.total:'')+' · tap to '+'<span class="quiz-act"></span></span></span></summary><div class="quiz-body">';
    /* One question at a time: progress bar, numbered dots to jump, results screen at the end. */
    html += '<div class="qz-top"><span class="qz-pos"></span><span class="qz-score" aria-live="polite"></span></div><div class="qz-bar" aria-hidden="true"><span></span></div>';
    html += '<div class="qz-dots" role="group" aria-label="Jump to question">';
    data.forEach(function(q,qi){ html += '<button type="button" class="qz-dot" data-qi="'+qi+'" aria-label="Question '+(qi+1)+'">'+(qi+1)+'</button>'; });
    html += '</div>';
    data.forEach(function(q,qi){
      html += '<div class="q" data-qi="'+qi+'" hidden><div class="stem">'+(qi+1)+'. '+q.q+'</div><div class="opts" role="group" aria-label="Options for question '+(qi+1)+'">';
      q.o.forEach(function(o,oi){ html += '<button type="button" class="opt" data-oi="'+oi+'">'+String.fromCharCode(65+oi)+'. '+o+'</button>'; });
      html += '</div><div class="expl" aria-live="polite"><span class="res"></span> '+q.e+(q.s?'<div class="src">Source: '+q.s+'</div>':'')+'</div></div>';
    });
    html += '<div class="qz-result" hidden><p class="score" aria-live="polite"></p><p class="qz-msg"></p><p class="qz-acts"><button type="button" class="btn js-qwrong">Review wrong answers</button> <button type="button" class="btn secondary js-qreset">Try again</button></p></div>';
    html += '<div class="qz-nav"><button type="button" class="btn secondary js-qprev">← Previous</button><button type="button" class="btn js-qnext">Next →</button></div></div></details>';
    el.innerHTML = html;
    var qs = $$('.q', el), dots = $$('.qz-dot', el), cur = 0, results = false, wrong = {};
    var posEl = el.querySelector('.qz-pos'), liveEl = el.querySelector('.qz-score'), barEl = el.querySelector('.qz-bar span');
    var resEl = el.querySelector('.qz-result'), prevB = el.querySelector('.js-qprev'), nextB = el.querySelector('.js-qnext');
    function show(i, focus){
      results = i === null; if(!results) cur = i;
      qs.forEach(function(qd,qi){ qd.hidden = results || qi!==cur; });
      dots.forEach(function(d,qi){ d.classList.toggle('cur', !results && qi===cur); d.setAttribute('aria-current', !results && qi===cur ? 'step' : 'false'); });
      resEl.hidden = !results;
      posEl.textContent = results ? 'Results' : 'Question '+(cur+1)+' of '+data.length;
      prevB.disabled = !results && cur===0;
      nextB.hidden = results;
      nextB.textContent = cur===data.length-1 ? (answered===data.length ? 'See results →' : 'Finish →') : 'Next →';
      if(focus){ var t = results ? resEl : qs[cur].querySelector('.stem'); t.setAttribute('tabindex','-1'); t.focus({preventScroll:true}); }
    }
    function upd(){
      liveEl.textContent = score+' / '+answered+' correct';
      barEl.style.width = Math.round(answered/data.length*100)+'%';
      if(answered===data.length){
        var prev = state.quiz[el.dataset.module||id]; var best = Math.max(score, prev?prev.best:0);
        state.quiz[el.dataset.module||id] = {best:best,total:data.length}; save(); renderProgress();
        var pct = Math.round(score/data.length*100);
        el.querySelector('.score').textContent = 'You scored '+score+' / '+data.length+' ('+pct+'%). Best: '+best+' / '+data.length+'.';
        el.querySelector('.qz-msg').textContent = pct>=80 ? 'Excellent (80% or more). You are ready for the next module.' : 'Below 80%. Review the wrong answers, re-read the teaching, then try again.';
        el.querySelector('.js-qwrong').hidden = score===data.length;
      }
    }
    qs.forEach(function(qd){
      var q = data[+qd.dataset.qi];
      $$('.opt', qd).forEach(function(b){
        b.addEventListener('click', function(){
          if(qd.classList.contains('answered')) return;
          qd.classList.add('answered'); answered++;
          var qi=+qd.dataset.qi, oi=+b.dataset.oi, ok = oi===q.a;
          if(ok) score++; else wrong[qi]=true;
          $$('.opt', qd).forEach(function(x){ x.disabled=true; if(+x.dataset.oi===q.a) x.classList.add('correct'); });
          if(!ok) b.classList.add('wrong');
          dots[qi].classList.add(ok?'ok':'bad');
          qd.querySelector('.res').innerHTML = ok ? '<strong>✓ Correct.</strong>' : '<strong>✗ Not quite.</strong> Correct answer: '+String.fromCharCode(65+q.a)+'.';
          upd(); show(cur);
        });
      });
    });
    dots.forEach(function(d){ d.addEventListener('click', function(){ show(+d.dataset.qi, true); }); });
    prevB.addEventListener('click', function(){ show(results ? data.length-1 : Math.max(0,cur-1), true); });
    nextB.addEventListener('click', function(){
      if(cur<data.length-1) return show(cur+1, true);
      if(answered===data.length) return show(null, true);
      var gap = qs.findIndex(function(qd){ return !qd.classList.contains('answered'); });   /* jump to the first unanswered */
      show(gap, true);
    });
    el.querySelector('.js-qwrong').addEventListener('click', function(){ var w = Object.keys(wrong); if(w.length) show(+w[0], true); });
    el.querySelector('.js-qreset').addEventListener('click', function(){ renderQuiz(el); });
    upd(); show(0);
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
      'Concerta XL and bioequivalent tablets (Affenid XL, Atenza XL, Delmosart, Matoride XL, Xaggitin XL, Xenidate XL)':{ir:22,mr:78,dur:'about 12 h (second peak 6–8 h)',food:'With or without food; swallow whole with liquid; do not chew, divide or crush',strengths:'18, 27, 36, 54 mg (Atenza XL also 45 mg; Matoride XL 18, 36, 54 mg)',note:'Concerta XL, Affenid XL, Atenza XL and Matoride XL are osmotic tablets (the empty shell may appear in stool). SPS gives Delmosart and Xaggitin XL as 25:75 (Xaggitin XL is a matrix tablet) and Xenidate XL as a multiple-unit tablet; all are bioequivalent to Concerta XL (SPS).'},
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
  /* Stepper: the picture on one side, one step at a time on the other, with Previous/Next and step dots. */
  $$('figure.wt').forEach(function(f){
    var marks = $$('.wk-mark', f), lis = $$('ol.walk li', f), det = f.querySelector('.walk-d'), n = lis.length; if(!n) return;
    var stepImage = f.querySelector('img[src="images/m1-adult-work.jpg"], img[src="images/m1-classroom.jpg"], img[src="images/m2-brain-pathways.jpg"], img[src="images/m2-synapse-normal.jpg"], img[src="images/m3-assessment.jpg"], img[src="images/m3-rating-scales.jpg"], img[src="images/m3-baseline.jpg"]');
    var stepImages = [];
    if(stepImage && stepImage.getAttribute('src')==='images/m1-adult-work.jpg') stepImages = [
      'images/m1-adult-step-1-emotional-overwhelm.png',
      'images/m1-adult-step-2-disorganisation.png',
      'images/m1-adult-step-3-distractibility.png',
      'images/m1-adult-step-4-inner-restlessness.png',
      'images/m1-adult-step-5-childhood-onset.png'
    ];
    if(stepImage && stepImage.getAttribute('src')==='images/m1-classroom.jpg') stepImages = [
      'images/m1-child-step-1-pattern-over-time.png',
      'images/m1-child-step-2-peer-comparison.png',
      'images/m1-child-step-3-teacher-informant.png',
      'images/m1-child-step-4-impairment.png',
      'images/m1-child-step-5-pharmacist-support.png'
    ];
    if(stepImage && stepImage.getAttribute('src')==='images/m2-brain-pathways.jpg') stepImages = [
      'images/m2-brain-step-1-prefrontal-cortex.png',
      'images/m2-brain-step-2-striatum-reward.png',
      'images/m2-brain-step-3-pathway-origins.png',
      'images/m2-brain-step-4-wider-networks.png',
      'images/m2-brain-step-5-clinical-monitoring.png'
    ];
    var synapseAlts = null;
    if(stepImage && stepImage.getAttribute('src')==='images/m3-rating-scales.jpg'){
      stepImages = [
        'images/m3-rating-step-1-parent.png',
        'images/m3-rating-step-2-teacher.png',
        'images/m3-rating-step-3-adult.png',
        'images/m3-rating-step-4-judgement.png'
      ];
      synapseAlts = [
        'A parent observes homework and records behaviour at home. Labels: Parent’s perspective, Track over time. A score is one person’s account.',
        'School and home observations feed into a clinician’s comparison. Labels: School observations, Compare with home, Explore differences. Different reports can be informative.',
        'An adult completes the ASRS v1.1 self-report screener, then a specialist uses the DIVA-5 structured interview to explore childhood and current experiences. A positive screen is not a diagnosis.',
        'Rating scales, history and daily-life impact feed into an integrated clinical assessment. Repeat the same scale over time. Scales support, never replace, assessment.'
      ];
    }
    if(stepImage && stepImage.getAttribute('src')==='images/m3-baseline.jpg'){
      stepImages = [
        'images/m3-baseline-step-1-height.png',
        'images/m3-baseline-step-2-weight.png',
        'images/m3-baseline-step-3-pulse-bp.png',
        'images/m3-baseline-step-4-ecg.png',
        'images/m3-baseline-step-5-cardiac-history.png'
      ];
      synapseAlts = [
        'A clinician measures a barefoot child’s height with a stadiometer and plots it for age and sex on an illustrative growth chart. Children: check height every 6 months.',
        'A clinician records a child’s baseline weight, watches appetite and growth, and compares measurements over time. Age 10 and under: weigh every 3 months.',
        'A seated child has blood pressure measured with the correct cuff and arm supported. An inset shows radial pulse measurement. Compare with age norms; child BP consistently above the 95th centile for age and height needs referral before treatment.',
        'Cardiac history and examination guide the decision: no routine ECG without a clinical indication; cardiac features or risk from another medicine require further assessment.',
        'A clinician asks a family about heart disease or surgery, exertional symptoms, family history of sudden death, chest pain and palpitations. Concerning cardiac features require cardiology before treatment.'
      ];
    }
    if(stepImage && stepImage.getAttribute('src')==='images/m3-assessment.jpg'){
      stepImages = [
        'images/m3-assessment-step-1-specialist.png',
        'images/m3-assessment-step-2-parent-history.png',
        'images/m3-assessment-step-3-child-account.png',
        'images/m3-assessment-step-4-settings.png',
        'images/m3-assessment-step-5-pharmacist.png'
      ];
      synapseAlts = [
        'A trained ADHD specialist interviews a family and combines clinical history and reports. Labels: ADHD expertise, Clinical interview, History and reports.',
        'A parent discusses early development, school years and life at home, using childhood photographs and records to build a picture across the child\'s life.',
        'A specialist listens to the child\'s own account. Labels highlight their experience, feelings and worries, and support needs.',
        'Home and school observations feed into reports and rating scales reviewed by a specialist. A rating scale alone cannot diagnose ADHD.',
        'A pharmacist explains GP referral and school support to a family. Support can begin before diagnosis.'
      ];
    }
    if(stepImage && stepImage.getAttribute('src')==='images/m2-synapse-normal.jpg'){
      stepImages = [
        'images/m2-synapse-step-1-storage.png',
        'images/m2-synapse-step-2-release.png',
        'images/m2-synapse-step-3-receptors.png',
        'images/m2-synapse-step-4-reuptake.png'
      ];
      synapseAlts = [
        'Labelled dopamine synapse: VMAT2 in the vesicle membrane transports dopamine from the cytosol into a storage vesicle.',
        'Labelled dopamine synapse: an action potential triggers calcium entry; a vesicle fuses with the presynaptic membrane and releases dopamine into the synaptic cleft.',
        'Labelled dopamine synapse: dopamine binds a postsynaptic D1 receptor, activating signalling inside the next cell. Noradrenaline acts on adrenergic receptors.',
        'Labelled dopamine synapse: arrows show DAT transporting dopamine from the cleft back into the presynaptic terminal. NET recaptures noradrenaline in its neurons.'
      ];
    }
    if(stepImage){
      f.classList.add('wt-step-images');
      var stepSource = stepImage.parentElement.querySelector('source');
      if(stepSource) stepSource.remove();
    }
    if(det){ det.open = true; det.addEventListener('toggle', function(){ if(!det.open) det.open = true; }); }
    f.classList.add('wt-step');
    var nav = document.createElement('div'); nav.className = 'wt-nav';
    var dh = ''; lis.forEach(function(li,i){ dh += '<button type="button" class="wt-dot" data-s="'+li.dataset.s+'" aria-label="Step '+(i+1)+'"></button>'; });
    nav.innerHTML = '<button type="button" class="btn secondary wt-prev" aria-label="Previous step">←</button><span class="wt-mid"><span class="wt-pos" aria-live="polite"></span><span class="wt-dots">'+dh+'</span></span><button type="button" class="btn wt-next" aria-label="Next step">→</button>';
    (det || f).appendChild(nav);
    var dots = $$('.wt-dot', nav), pos = nav.querySelector('.wt-pos'), prev = nav.querySelector('.wt-prev'), next = nav.querySelector('.wt-next'), cur = 0, first = true;
    /* Step images: preload only the neighbouring steps (the images are large), then cross-fade. */
    var preloaded = {};
    function preload(i){ var src = stepImages[i]; if(!src || preloaded[src]) return; preloaded[src] = true; var im = new Image(); im.src = src; }
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, fadeTok = 0;
    function swapImage(src, alt){
      var tok = ++fadeTok, host = stepImage.parentElement;   /* cancel any fade still running */
      $$('.wt-fade', host).forEach(function(o){ o.remove(); });
      if(stepImage.getAttribute('src') === src){ stepImage.alt = alt; return; }
      if(first || reduceMotion){ stepImage.src = src; stepImage.alt = alt; return; }
      var over = new Image(); over.className = 'wt-fade'; over.alt = ''; over.setAttribute('aria-hidden', 'true'); over.src = src;
      host.appendChild(over);
      var done = false;
      var finish = function(){ if(done || tok !== fadeTok) return; done = true; stepImage.src = src; stepImage.alt = alt; over.remove(); };
      var go = function(){
        if(tok !== fadeTok) return;
        if(over.animate){ over.style.opacity = '1'; over.animate([{opacity:0},{opacity:1}], {duration:400, easing:'ease'}).finished.then(finish, finish); }
        else over.style.opacity = '1';
        setTimeout(finish, 600);   /* safety net if the animation never reports back */
      };
      (over.decode ? over.decode().then(go, go) : (over.onload = go));
    }
    function sel(k){
      cur = Math.max(0, lis.findIndex(function(li){ return li.dataset.s===k; }));
      if(stepImage && stepImages[cur]){
        swapImage(stepImages[cur], synapseAlts ? synapseAlts[cur] : 'Illustration for step '+(cur+1)+': '+lis[cur].textContent);
        if(!first){ preload(cur+1); preload(cur-1); }
      }
      marks.forEach(function(b){ b.classList.toggle('cur', b.dataset.s===k); });
      lis.forEach(function(li,i){ li.classList.toggle('cur', i===cur); });
      dots.forEach(function(d,i){ d.classList.toggle('cur', i===cur); d.setAttribute('aria-current', i===cur?'step':'false'); });
      pos.textContent = 'Step '+(cur+1)+' of '+n;
      prev.disabled = cur===0; next.disabled = cur===n-1;
    }
    marks.forEach(function(b){ b.addEventListener('click', function(){ sel(b.dataset.s); }); });
    dots.forEach(function(d){ d.addEventListener('click', function(){ sel(d.dataset.s); }); });
    prev.addEventListener('click', function(){ sel(lis[Math.max(0,cur-1)].dataset.s); });
    next.addEventListener('click', function(){ sel(lis[Math.min(n-1,cur+1)].dataset.s); });
    sel(lis[0].dataset.s); first = false;
    if(stepImages.length && 'IntersectionObserver' in window){   /* get step 2 ready once the figure is on screen */
      var io = new IntersectionObserver(function(es){ if(es.some(function(e){ return e.isIntersecting; })){ preload(cur+1); io.disconnect(); } });
      io.observe(f);
    }
  });
  show(location.hash.slice(1) || 'home', true);
  /* A deep link moves the browser's sequential-focus starting point to the target; reset it to the top
     so the first Tab still reaches the skip link (focus is not moved into the module on first load). */
  if(location.hash){
    var resetStart=function(){ var ae=document.activeElement; if(ae && ae!==document.body && ae!==document.documentElement) return;
      var b=document.body; b.setAttribute('tabindex','-1'); b.focus({preventScroll:true}); b.removeAttribute('tabindex'); };
    if(document.readyState==='complete') setTimeout(resetStart,60); else window.addEventListener('load',function(){ setTimeout(resetStart,60); });
  }
})();
