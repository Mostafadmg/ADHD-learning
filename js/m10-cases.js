/* Module 10: branching cases shown one at a time.
   Markup (index.html, section#m10):
     <div class="m10-pick" data-m10-pick>
       <div class="m10-cards" role="tablist"> <button class="m10-card" role="tab" data-case-for="ethan" aria-controls="case-ethan">…</button> … </div>
       <div class="m10-stage"> <div class="case" id="case-ethan" data-case="ethan" role="tabpanel"></div> … </div>
     </div>
   The cases themselves are drawn by the shared case engine in js/app.js (window.CASES from js/data-cases.js); this script
   only picks which case shows, letters the choices, marks the options already tried, counts best choices made first
   time, ticks finished cases (remembered in this browser) and adds "Next case". It also wires the lesson 1 group cards
   ([data-m10-go]) to open a lesson. Load after app.js. */
(function(){
  var mod = document.getElementById('m10'); if(!mod || !window.CASES) return;
  function $$(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
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
      if(st) st.textContent = d ? 'Done · best choice first time '+d.first+' of '+d.n : decisions(c)+' decisions';
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
      if(opts.focus) cards[cur].focus();
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
      function tidy(){
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

  /* lesson 1: group cards open a lesson */
  $$('[data-m10-go]', mod).forEach(function(b){
    b.addEventListener('click', function(){
      var ls = $$('.lessons[data-lessons="m10"] > .lesson', mod)[+b.dataset.m10Go]; if(!ls || !window.__lessonReveal) return;
      window.__lessonReveal(ls); window.scrollTo({top:0});
      var h = ls.querySelector('h2'); if(h){ h.setAttribute('tabindex','-1'); h.focus({preventScroll:true}); }
    });
  });
})();
