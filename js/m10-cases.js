/* Module 10: branching cases shown one at a time.
   Markup (index.html, section#m10):
     <div class="m10-pick" data-m10-pick>
       <div class="m10-cards" role="tablist"> <button class="m10-card" role="tab" data-case-for="ethan" aria-controls="case-ethan">…</button> … </div>
       <div class="m10-stage"> <div class="case" id="case-ethan" data-case="ethan" role="tabpanel"></div> … </div>
     </div>
   The cases themselves are drawn by the shared case engine in js/app.js (window.CASES from js/data-cases.js); this script
   only picks which case shows, letters the choices, marks the options already tried, counts best choices made first
   time, ticks finished cases (remembered in this browser) and adds "Next case". It also wires the lesson 1 group cards
   ([data-m10-go]) to open a lesson. Load after app.js.

   Phone flow (screens up to 700px; CSS in css/m10-phone.css): each case is shown one step at a time. The engine's own
   markup is kept and only given a stage on the .case element (data-st = story | decide | why | end, data-k = which
   decision), so the vignette, each question, the explanation and the learning point each get their own screen. This
   script adds the progress strip, the "Decision 1 of 2" and "Re-read the case" buttons, a "Learning point" label and
   the end-of-case "Next case" / "Next lesson" buttons. All of these are hidden on wider screens. */
(function(){
  var mod = document.getElementById('m10'); if(!mod || !window.CASES) return;
  function $$(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
  var mq = window.matchMedia ? window.matchMedia('(max-width:700px)') : {matches:false};
  function mk(tag, cls, html){ var e = document.createElement(tag); e.className = cls; if(html != null) e.innerHTML = html; return e; }
  var KEY = 'adhd.m10.cases', saved = {};
  try{ saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }catch(e){ saved = {}; }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(saved)); }catch(e){} }

  /* decisions on the best path through a case */
  function decisions(c){ var n = 0, id = c.start, seen = {}; while(id && c.nodes[id] && !c.nodes[id].end && !seen[id]){ seen[id] = 1; n++; var g = c.nodes[id].choices.filter(function(x){ return x.grade==='good'; })[0]; id = g && g.next; } return n; }

  var picks = [];
  $$('[data-m10-pick]', mod).forEach(function(box){
    var cards = $$('.m10-card', box), cases = cards.map(function(b){ return document.getElementById('case-'+b.dataset.caseFor); });
    var foot = document.createElement('div'); foot.className = 'm10-foot';
    foot.innerHTML = '<span class="m10-pos" aria-live="polite"></span><button type="button" class="btn secondary m10-next"></button>';
    box.appendChild(foot);
    var pos = foot.querySelector('.m10-pos'), nextB = foot.querySelector('.m10-next'), cur = 0;
    var runs = cards.map(function(){ return {seen: (window.WeakSet ? new WeakSet() : null), n:0, first:0}; });

    function status(i){
      var b = cards[i], k = b.dataset.caseFor, c = window.CASES[k], st = b.querySelector('.m10-st'), d = saved[k];
      b.classList.toggle('done', !!d);
      /* two spans: the full words (desktop) and a short form that fits the narrow phone chips */
      if(st) st.innerHTML = '<span class="m10-sl">'+(d ? 'Done · best choice first time '+d.first+' of '+d.n : decisions(c)+' decisions')+'</span><span class="m10-ss">'+(d ? 'Done '+d.first+'/'+d.n : decisions(c)+' decisions')+'</span>';
    }
    function select(i, opts){
      opts = opts || {};
      cur = Math.max(0, Math.min(cards.length-1, i));
      cards.forEach(function(b, bi){ var on = bi===cur; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; b.classList.toggle('cur', on); if(cases[bi]) cases[bi].hidden = !on; });
      pos.textContent = 'Case '+(cur+1)+' of '+cards.length;
      var nx = cards[cur+1];
      nextB.hidden = !nx;
      nextB.classList.toggle('secondary', !(cases[cur] && cases[cur].querySelector('.m10-score')));
      if(nx) nextB.textContent = 'Next case: '+(nx.querySelector('b') || nx).textContent.trim()+' →';
      if(opts.focus) cards[cur].focus({preventScroll:true});
      if(opts.scroll) box.scrollIntoView({block:'start', behavior:'smooth'});
    }
    cards.forEach(function(b, i){
      b.addEventListener('click', function(){ select(i); });
      b.addEventListener('keydown', function(e){
        var k = e.key, n = cards.length;
        if(k==='ArrowRight'||k==='ArrowDown'){ e.preventDefault(); select((i+1)%n, {focus:true}); }
        else if(k==='ArrowLeft'||k==='ArrowUp'){ e.preventDefault(); select((i-1+n)%n, {focus:true}); }
        else if(k==='Home'){ e.preventDefault(); select(0, {focus:true}); }
        else if(k==='End'){ e.preventDefault(); select(n-1, {focus:true}); }
      });
    });
    nextB.addEventListener('click', function(){ select(cur+1, {scroll:true}); });

    /* tidy each rendered step: lettered tiles, "Decision 1 of 2", and finished cases */
    cases.forEach(function(el, i){
      if(!el) return;
      var body = el.querySelector('.case-body'); if(!body) return;
      var c = window.CASES[cards[i].dataset.caseFor], total = decisions(c);
      var nm = ((cards[i].querySelector('b') || {}).textContent || '').trim();
      var stg = {nt:null, stage:'story', k:1, init:false};
      function tidy(){ tidy0(); phase(); }
      function tidy0(){
        $$('.choice', body).forEach(function(ch){
          if(ch.dataset.m10) return; ch.dataset.m10 = '1';
          var t = ch.firstChild;
          if(t && t.nodeType===3){ var m = /^([A-Z])\.\s+/.exec(t.nodeValue); if(m){ t.nodeValue = t.nodeValue.slice(m[0].length); var l = document.createElement('span'); l.className = 'm10-l'; l.setAttribute('aria-hidden','true'); l.textContent = m[1]; ch.insertBefore(l, t); } }
        });
        var tr = body.querySelector('.trail'); if(tr && !tr.dataset.m10){ tr.dataset.m10 = '1'; var s = /(\d+)/.exec(tr.textContent); if(s) tr.textContent = 'Decision '+s[1]+' of '+total; }
        var rs = body.querySelector('.js-restart');
        if(rs && !rs.dataset.m10){
          rs.dataset.m10 = '1';
          var r = runs[i];
          if(r.n){ saved[cards[i].dataset.caseFor] = {n:r.n, first:r.first}; save(); status(i); }
          var p = document.createElement('p'); p.className = 'm10-score';
          p.textContent = r.n ? 'Best choice first time: '+r.first+' of '+r.n+' decisions.' : 'Case complete.';
          rs.parentNode.insertBefore(p, rs);
          rs.addEventListener('click', function(){ runs[i] = {seen: (window.WeakSet ? new WeakSet() : null), n:0, first:0}; if(i===cur) nextB.classList.add('secondary'); });
          if(i===cur) nextB.classList.remove('secondary');   /* finished: "Next case" becomes the main button */
        }
      }

      /* ---- phone flow: which screen of the case is showing ---- */
      var CHEV = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
      function setText(e, t){ if(e.textContent !== t) e.textContent = t; }
      function toTop(){
        if(!mq.matches || cases[cur] !== el) return;
        var s = el.querySelector('.m10-strip'); if(!s) return;
        var y = s.getBoundingClientRect().top;
        /* each step starts at the top of the screen; 'instant' because the page has smooth scrolling switched on */
        if(Math.abs(y - 66) > 24){
          var top = Math.max(0, (window.pageYOffset || 0) + y - 66);
          try{ window.scrollTo({top: top, behavior: 'instant'}); }catch(e){ window.scrollTo(0, top); }
        }
      }
      function phase(){
        var nt = body.querySelector('.node-text'); if(!nt) return;
        var end = !!body.querySelector('.js-restart'), tr = body.querySelector('.trail');
        var k = end ? total + 1 : (tr ? +((/(\d+)/.exec(tr.textContent) || [0, 1])[1]) : 1);
        var fresh = nt !== stg.nt;
        if(fresh){ stg.nt = nt; stg.stage = end ? 'end' : (k === 1 ? 'story' : 'decide'); el.classList.remove('m10-reread'); }
        var nx = end ? 'end' : (body.querySelector('.fbwrap .fb') ? 'why' : (stg.stage === 'why' ? 'decide' : stg.stage));
        var changed = fresh || nx !== stg.stage || k !== stg.k;
        stg.stage = nx; stg.k = k;
        el.dataset.st = nx; el.dataset.k = k;

        /* progress strip: The case · Decision 1 · Decision 2 · Learning point */
        var strip = el.querySelector(':scope > .m10-strip');
        if(!strip){ strip = mk('div', 'm10-strip'); el.insertBefore(strip, el.firstChild); }
        var segs = total + 2, at = end ? segs - 1 : (nx === 'story' ? 0 : k);
        var label = end ? 'Learning point' : (nx === 'story' ? 'The case' : 'Decision '+k+' of '+total+(nx === 'why' ? ' · Why' : ''));
        var h = '<ol class="m10-track" aria-hidden="true">';
        for(var j = 0; j < segs; j++) h += '<li class="'+(j < at ? 'd' : (j === at ? 'c' : ''))+'"></li>';
        h += '</ol><p class="m10-where"><b>'+nm+'</b> · '+label+'</p>';
        if(strip.dataset.h !== h){ strip.dataset.h = h; strip.innerHTML = h; }

        /* "Re-read the case" (decision screens) */
        var re = el.querySelector(':scope > .m10-re');
        if(!re){
          re = mk('button', 'm10-re', '<span></span>'+CHEV); re.type = 'button'; re.setAttribute('aria-expanded', 'false');
          el.insertBefore(re, strip.nextSibling);
          re.addEventListener('click', function(){ var o = el.classList.toggle('m10-reread'); re.setAttribute('aria-expanded', o ? 'true' : 'false'); setText(re.firstChild, o ? 'Hide the case' : 'Re-read the case'); });
        }
        var open = el.classList.contains('m10-reread');
        re.setAttribute('aria-expanded', open ? 'true' : 'false'); setText(re.firstChild, open ? 'Hide the case' : 'Re-read the case');

        /* "Decision 1 of 2 →" under the vignette */
        var go = body.querySelector(':scope > .m10-go');
        if(!go){
          go = mk('button', 'btn m10-go'); go.type = 'button'; nt.parentNode.insertBefore(go, nt.nextSibling);
          go.addEventListener('click', function(){
            stg.stage = 'decide'; phase();
            var a = body.querySelector('.m10-ask'); if(a){ a.setAttribute('tabindex', '-1'); a.focus({preventScroll:true}); }
          });
        }
        setText(go, 'Decision '+Math.min(k, total)+' of '+total+' →');

        /* tag the question so it can be styled on its own */
        var q = body.querySelector(':scope > p > strong'); if(q && !q.parentNode.classList.contains('m10-ask') && !q.parentNode.classList.contains('m10-score')) q.parentNode.classList.add('m10-ask');

        /* the end of the case: learning point, then Next case (or Next lesson after the last case) */
        if(end){
          var fbEnd = body.querySelector(':scope > .fb');
          if(fbEnd && !body.querySelector(':scope > .m10-lp')) fbEnd.parentNode.insertBefore(mk('p', 'm10-lp', 'Learning point'), fbEnd);
          var rs = body.querySelector('.js-restart');
          if(rs && !body.querySelector('.m10-endnext')){
            var nxc = cards[i+1], btn = mk('button', 'btn m10-endnext'); btn.type = 'button';
            if(nxc){
              btn.textContent = 'Next case: '+((nxc.querySelector('b') || nxc).textContent.trim())+' →';
              btn.addEventListener('click', function(){ select(i+1, {scroll:true, focus:true}); });
            } else {
              var lsn = box.closest('.lesson'), nl = lsn && lsn.nextElementSibling;
              btn.textContent = 'Next lesson'+(nl && nl.dataset && nl.dataset.title ? ': '+nl.dataset.title : '')+' →';
              btn.addEventListener('click', function(){ var b = mod.querySelector('.ls-nav .ls-next'); if(b) b.click(); });
            }
            rs.parentNode.insertBefore(btn, rs);
          }
        }
        /* The engine focuses its Continue button and the browser scrolls to it a frame later (the page smooth-scrolls, which
           would drag the screen down past the explanation). So: switch smooth scrolling off for a moment, then put the
           top of the new step at the top of the screen once that scroll has happened. */
        if(changed && stg.init && mq.matches){
          var root = document.documentElement; root.style.scrollBehavior = 'auto';
          window.addEventListener('scroll', toTop, {passive:true});
          requestAnimationFrame(function(){ requestAnimationFrame(toTop); });
          setTimeout(function(){ toTop(); window.removeEventListener('scroll', toTop); root.style.scrollBehavior = ''; }, 280);
        }
        stg.init = true;
      }

      tidy();
      if(window.MutationObserver) new MutationObserver(tidy).observe(body, {childList:true, subtree:true});
      /* after the engine's own click handler has drawn the feedback: mark the option and count first tries */
      body.addEventListener('click', function(e){
        var ch = e.target.closest && e.target.closest('.choice'); if(!ch || !body.contains(ch)) return;
        var fb = body.querySelector('.fbwrap .fb'); if(!fb) return;
        var g = fb.classList.contains('good') ? 'good' : (fb.classList.contains('ok') ? 'ok' : 'bad');
        $$('.choice', body).forEach(function(x){ x.classList.remove('m10-now'); });
        ch.classList.add('m10-tried', 'm10-'+g, 'm10-now');
        var node = body.querySelector('.node-text'), r = runs[i];
        if(node && r.seen && !r.seen.has(node)){ r.seen.add(node); r.n++; if(g==='good') r.first++; }
      });
    });

    cards.forEach(function(b, i){ status(i); });
    picks.push({box:box, cards:cards, select:select});
    select(0);
  });

  /* deep links such as #case-shortage open the right case (app.js has already opened the lesson) */
  function fromHash(){
    var id = location.hash.slice(1); if(id.indexOf('case-')!==0) return;
    picks.forEach(function(p){ p.cards.forEach(function(b, i){ if('case-'+b.dataset.caseFor===id) p.select(i); }); });
  }
  fromHash();
  window.addEventListener('hashchange', fromHash);

  /* lesson 1: the grade key and the case groups are closed dropdowns on a phone and open on wider screens */
  function folds(){ if(!mq.matches) $$('details.m10-fold', mod).forEach(function(d){ d.open = true; }); }
  folds();
  if(mq.addEventListener) mq.addEventListener('change', folds); else if(mq.addListener) mq.addListener(folds);

  /* lesson 1: group cards open a lesson */
  $$('[data-m10-go]', mod).forEach(function(b){
    b.addEventListener('click', function(){
      var ls = $$('.lessons[data-lessons="m10"] > .lesson', mod)[+b.dataset.m10Go]; if(!ls || !window.__lessonReveal) return;
      window.__lessonReveal(ls); window.scrollTo({top:0});
      var h = ls.querySelector('h2'); if(h){ h.setAttribute('tabindex','-1'); h.focus({preventScroll:true}); }
    });
  });
})();
