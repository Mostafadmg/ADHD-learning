/* Module 8, phone layer: small tab sets inside a lesson.
   Markup (written in index.html, so with no JavaScript every panel simply shows one after the other):
     <div class="m8t" data-m8tabs data-label="Parts of this lesson">
       <div class="m8t-p" data-tab="Three answers"> ... </div>
       <div class="m8t-p" data-tab="Comorbidity"> ... </div>
     </div>
   This script adds the tab bar and a "Next: ..." button at the end of every panel but the last. On phones (CSS,
   700px) one panel shows at a time; on wider screens the bar and buttons are hidden and every panel shows, so the
   page looks as it always did. Anything that scrolls to an element inside a hidden panel (site search, links in
   the course) opens that panel first. */
(function(){
  'use strict';
  var N = 0;

  function keepInView(el){
    if(!el || !el.getBoundingClientRect) return;
    var r = el.getBoundingClientRect();
    if(r.top < 64) window.scrollBy(0, r.top - 76);
  }

  function build(box){
    var panels = Array.prototype.filter.call(box.children, function(c){ return c.classList.contains('m8t-p'); });
    if(panels.length < 2 || box.querySelector(':scope > .m8t-bar')) return;
    var uid = 'm8t' + (++N), tabs = [], cur = 0;
    var bar = document.createElement('div');
    bar.className = 'm8t-bar'; bar.setAttribute('role', 'tablist');
    bar.setAttribute('aria-label', box.getAttribute('data-label') || 'Parts of this lesson');
    bar.style.setProperty('--n', panels.length);
    panels.forEach(function(p, i){
      var label = p.getAttribute('data-tab') || ('Part ' + (i + 1));
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'tab'); b.className = 'm8t-b'; b.id = uid + '-t' + i;
      b.setAttribute('aria-controls', uid + '-p' + i);
      b.innerHTML = '<b></b><span></span>';
      b.firstChild.textContent = String(i + 1); b.lastChild.textContent = label;
      b.addEventListener('click', function(){ show(i, false, true); });
      b.addEventListener('keydown', function(e){
        if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){ e.preventDefault(); show((cur + (e.key === 'ArrowRight' ? 1 : -1) + panels.length) % panels.length, true, false); }
      });
      bar.appendChild(b); tabs.push(b);
      p.id = uid + '-p' + i; p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', b.id);
      p._m8show = function(){ if(cur !== i) show(i, false, false); };
      if(i < panels.length - 1){
        var nx = document.createElement('button');
        nx.type = 'button'; nx.className = 'btn m8t-more';
        nx.textContent = 'Next: ' + (panels[i + 1].getAttribute('data-tab') || ('part ' + (i + 2))) + ' →';
        nx.addEventListener('click', function(){ show(i + 1, false, true); });
        p.appendChild(nx);
      }
    });
    box.insertBefore(bar, panels[0]);
    function show(i, focus, scroll){
      cur = Math.max(0, Math.min(panels.length - 1, i));
      tabs.forEach(function(t, j){ t.setAttribute('aria-selected', j === cur ? 'true' : 'false'); t.tabIndex = j === cur ? 0 : -1; });
      panels.forEach(function(p, j){ p.classList.toggle('on', j === cur); });
      if(focus) tabs[cur].focus({preventScroll: true});
      if(scroll) keepInView(bar);
    }
    show(0, false, false);
  }

  /* anything that scrolls to an element inside a hidden panel opens that panel first */
  var orig = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function(){
    try{ var p = this.closest && this.closest('.m8t-p'); if(p && p._m8show) p._m8show(); }catch(e){}
    return orig.apply(this, arguments);
  };

  function init(){ Array.prototype.forEach.call(document.querySelectorAll('[data-m8tabs]'), build); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
