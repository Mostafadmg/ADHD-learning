/* Module 1, lesson 2: the 18 symptoms explorer. Mount: <div class="sx18" data-sx18></div>.
   Two domain tabs; a numbered list of 9 symptoms on the left and one detail card on the right: plain meaning,
   child and adult examples, when it counts and when it does not, and what to ask. Data: window.AGSX
   (js/assess-data-sx.js, paraphrased from DSM-5-TR) plus the short everyday examples below. */
(function(){
  'use strict';
  /* one-line everyday examples (child, adult), shown first in each list */
  var QUICK = {
    A1a:['Adds when the sum says subtract','Sends an email with the wrong attachment; errors in forms'],
    A1b:['Drifts off halfway through reading','Loses the thread in long meetings, films or books'],
    A1c:['"Did you hear what I said?"','Partner says they "talk to a wall"; mind is elsewhere'],
    A1d:['Starts homework but never hands it in','Half-finished DIY, courses and projects'],
    A1e:['Messy bag, misses deadlines','Always late; poor planning; chaotic paperwork'],
    A1f:['Fights over homework','Puts off tax returns, reports and long forms'],
    A1g:['PE kit, pencils, coats','Keys, wallet, phone, glasses, documents'],
    A1h:['Looks at every noise in the corridor','Drawn to phone notifications or unrelated thoughts'],
    A1i:['Forgets chores and what to bring','Forgets appointments, bills and calls back'],
    A2a:['Wriggles on the carpet','Leg jiggling, clicking pens'],
    A2b:['Gets up during lessons and meals','Walks around in meetings; cannot sit through a film'],
    A2c:['Climbs furniture in shops','Constant inner restlessness'],
    A2d:['Noisy in quiet play','Cannot unwind; holidays feel uncomfortable'],
    A2e:['Never stops','Others find them tiring; cannot sit still for long'],
    A2f:['Talks through lessons','Dominates conversations'],
    A2g:['Shouts out in class','Finishes other people’s sentences'],
    A2h:['Pushes in at the queue','Impatient in traffic and queues'],
    A2i:['Barges into games','Takes over tasks; interrupts at work']
  };
  var DOM = { IA:['Inattention','A1','ia'], HI:['Hyperactivity-impulsivity','A2','hi'] };
  var IC = {
    child:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="6" r="3"/><path d="M8 21v-6l-2-3 3-2h6l3 2-2 3v6"/></svg>',
    adult:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="3"/><path d="M7 22V12a5 5 0 0 1 10 0v10M10 22v-6h4v6"/></svg>'
  };
  function esc(x){ return String(x==null?'':x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }

  function mount(m){
    var SX = window.AGSX; if(!SX){ return; }
    var st = { d:'IA', i:0 };
    function list(){ return SX.filter(function(s){ return s.d === st.d; }); }
    function draw(){
      var L = list(), s = L[st.i], q = QUICK[s.k] || ['',''], D = DOM[st.d];
      var h = '<div class="sx18-tabs" role="tablist" aria-label="Symptom domain">' + Object.keys(DOM).map(function(k){
        return '<button type="button" role="tab" class="sx18-tab sx18-'+DOM[k][2]+'" data-d="'+k+'" aria-selected="'+(k===st.d)+'"><b>'+DOM[k][1]+'</b>'+DOM[k][0]+'<span>9</span></button>'; }).join('') + '</div>';
      h += '<div class="sx18-body sx18-'+D[2]+'"><ol class="sx18-list" aria-label="'+D[0]+' symptoms">' + L.map(function(x,i){
        return '<li><button type="button" class="sx18-it" data-i="'+i+'" aria-current="'+(i===st.i)+'"><span class="sx18-k">'+x.k+'</span><span class="sx18-t">'+esc(x.t)+'</span></button></li>'; }).join('') + '</ol>';
      h += '<article class="sx18-card" aria-live="polite"><header><span class="sx18-k big">'+s.k+'</span><div><span class="sx18-eb">'+D[0]+' · '+(st.i+1)+' of 9</span><h3>'+esc(s.t)+'</h3></div></header>';
      h += '<p class="sx18-plain"><span>In plain words</span>'+esc(s.p)+'</p>';
      h += '<div class="sx18-ex">' + [['child','In a child',q[0],s.ec],['adult','In an adult',q[1],s.ea]].map(function(c){
        return '<div class="sx18-col sx18-'+c[0]+'"><h4><span class="sx18-ic">'+IC[c[0]]+'</span>'+c[1]+'</h4><ul>'+(c[2]?'<li class="q">'+esc(c[2])+'</li>':'')+(c[3]||[]).map(function(e){ return '<li>'+esc(e)+'</li>'; }).join('')+'</ul></div>'; }).join('') + '</div>';
      h += '<div class="sx18-yn"><p class="y"><b>Counts when</b>'+esc(s.yes)+'</p><p class="n"><b>Does not count when</b>'+esc(s.no)+'</p></div>';
      h += '<details class="sx18-ask"><summary>What to ask in clinic</summary><div><p><b>Adult</b>“'+esc(s.qa)+'”</p><p><b>Parent</b>“'+esc(s.qc)+'”</p></div></details>';
      h += '<footer><button type="button" class="btn secondary sx18-go" data-k="-1"'+(st.i===0?' disabled':'')+'>← Previous</button><span class="sx18-dots" aria-hidden="true">'+L.map(function(x,i){ return '<i class="'+(i===st.i?'on':'')+'"></i>'; }).join('')+'</span><button type="button" class="btn sx18-go" data-k="1"'+(st.i===L.length-1?' disabled':'')+'>Next →</button></footer></article></div>';
      m.innerHTML = h;
    }
    m.addEventListener('click', function(e){
      var t = e.target.closest('.sx18-tab'); if(t){ st.d = t.dataset.d; st.i = 0; draw(); return; }
      var it = e.target.closest('.sx18-it'); if(it){ st.i = +it.dataset.i; draw(); var c = m.querySelector('.sx18-card'); if(c && window.innerWidth < 860) c.scrollIntoView({block:'start', behavior:'smooth'}); return; }
      var g = e.target.closest('.sx18-go'); if(g && !g.disabled){ st.i = Math.max(0, Math.min(8, st.i + (+g.dataset.k))); draw(); }
    });
    draw();
  }
  function init(){ Array.prototype.forEach.call(document.querySelectorAll('[data-sx18]'), mount); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
