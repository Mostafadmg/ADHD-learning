/* Interactive "explorer" cards: slider + preset chips + live chart + state badge + live bars.
   Vanilla JS + inline SVG. Conceptual teaching models only — see each card's sources. */
(function(){
  'use strict';
  var XP = window.XP = window.XP || {};
  function clamp(x,a,b){ return Math.max(a, Math.min(b, x)); }
  function gauss(x,m,s){ return Math.exp(-Math.pow((x-m)/s,2)); }
  function sig(x){ return 1/(1+Math.exp(-x)); }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  XP.clamp=clamp; XP.gauss=gauss; XP.sig=sig; XP.esc=esc;
  var uid=0;

  /* Shared pieces --------------------------------------------------------- */
  XP.barsHTML = function(bars){
    return bars.map(function(b,i){
      return '<div class="xp-bar xp-'+b.tone+'" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="'+esc(b.label)+'">'
        +'<span class="xp-bl">'+esc(b.label)+(b.sub?'<small>'+esc(b.sub)+'</small>':'')+'</span><span class="xp-bt"><span class="xp-bf" data-i="'+i+'"></span></span></div>';
    }).join('');
  };
  XP.setBars = function(root, vals){
    var rows = root.querySelectorAll('.xp-bar');
    vals.forEach(function(v,i){
      var r = rows[i]; if(!r) return; var p = Math.round(clamp(v,0,1)*100);
      r.querySelector('.xp-bf').style.transform = 'scaleX('+(p/100)+')';
      r.setAttribute('aria-valuenow', p);
    });
  };
  XP.chipsHTML = function(chips, cls){
    return chips.map(function(c,i){ return '<button type="button" class="xp-chip '+(cls||'')+'" data-i="'+i+'" aria-pressed="false">'+esc(c.label)+'</button>'; }).join('');
  };
  /* drag on the chart to set the slider (touch + mouse + pen) */
  XP.dragChart = function(svg, input, x0, x1, vbw){
    var dragging=false;
    function setFrom(ev){
      var r = svg.getBoundingClientRect(); var x = (ev.clientX - r.left) / r.width * vbw;
      var f = clamp((x - x0)/(x1 - x0), 0, 1);
      var min=+input.min, max=+input.max, step=+input.step||1;
      var v = Math.round((min + f*(max-min))/step)*step;
      if(String(v)!==input.value){ input.value = v; input.dispatchEvent(new Event('input',{bubbles:true})); }
    }
    svg.addEventListener('pointerdown', function(ev){ dragging=true; try{svg.setPointerCapture(ev.pointerId);}catch(e){} setFrom(ev); });
    svg.addEventListener('pointermove', function(ev){ if(dragging) setFrom(ev); });
    ['pointerup','pointercancel','lostpointercapture'].forEach(function(t){ svg.addEventListener(t, function(){ dragging=false; }); });
  };
  XP.rangeFill = function(input){
    var p = (input.value - input.min) / (input.max - input.min) * 100;
    input.style.setProperty('--p', p+'%');
  };

  /* Generic explorer ------------------------------------------------------ */
  XP.make = function(mount, cfg){
    var id = 'xp'+(++uid), st = {v:cfg.slider.value, toggles:{}};
    (cfg.toggles||[]).forEach(function(t){ st.toggles[t.id]=!!t.on; });
    var h = '<div class="xp card-dark" id="'+id+'">'
      + '<p class="xp-kicker">'+esc(cfg.kicker)+'</p><h3 class="xp-title">'+esc(cfg.title)+'</h3>'
      + '<p class="xp-intro">'+cfg.intro+'</p>'
      + '<div class="xp-chart"><svg class="xp-svg" viewBox="0 0 '+cfg.vbw+' '+cfg.vbh+'" role="img" aria-label="'+esc(cfg.chartLabel)+'"></svg></div>'
      + (cfg.legend ? '<div class="db-legend xp-legend">'+cfg.legend+'</div>' : '')
      + '<label class="xp-sl-label" for="'+id+'-r">'+esc(cfg.slider.label)+' <output class="xp-out" for="'+id+'-r"></output></label>'
      + '<input class="xp-range" id="'+id+'-r" type="range" min="'+cfg.slider.min+'" max="'+cfg.slider.max+'" step="'+cfg.slider.step+'" value="'+cfg.slider.value+'">'
      + '<div class="xp-chips" role="group" aria-label="Presets">'+XP.chipsHTML(cfg.chips)+'</div>'
      + ((cfg.toggles||[]).length ? '<div class="xp-chips xp-toggles" role="group" aria-label="Options">'+cfg.toggles.map(function(t){return '<button type="button" class="xp-chip xp-tog" data-t="'+t.id+'" aria-pressed="'+(t.on?'true':'false')+'">'+esc(t.label)+'</button>';}).join('')+'</div>' : '')
      + '<div class="xp-state" aria-live="polite"><span class="xp-badge"></span><h4 class="xp-head"></h4></div>'
      + '<div class="xp-text"></div>'
      + '<div class="xp-bars">'+XP.barsHTML(cfg.bars)+'</div>'
      + (cfg.tiles ? '<div class="xp-tiles"></div>' : '')
      + '<div class="xp-boxes"><div class="xp-box xp-pt"><h5>What this means for the patient</h5><div class="xp-ptx"></div></div>'
      + '<div class="xp-box xp-ph"><h5>Pharmacist action</h5><div class="xp-phx"></div></div></div>'
      + '<p class="xp-note">'+cfg.note+'</p>'
      + '<details class="xp-src"><summary>Sources</summary><ul>'+cfg.sources.map(function(s){return '<li>'+s+'</li>';}).join('')+'</ul></details>'
      + '</div>';
    mount.innerHTML = h;
    var root = mount.firstChild, svg = root.querySelector('.xp-svg'), input = root.querySelector('.xp-range'), out = root.querySelector('.xp-out');
    var chips = root.querySelectorAll('.xp-chips:not(.xp-toggles) .xp-chip');
    var lastZone = -1, raf = 0;
    function zoneOf(v){ for(var i=0;i<cfg.zones.length;i++){ if(v<=cfg.zones[i].to) return i; } return cfg.zones.length-1; }
    function render(){
      raf=0; var v = st.v;
      svg.innerHTML = cfg.svg(v, st);
      out.textContent = cfg.slider.fmt(v, st);
      input.setAttribute('aria-valuetext', cfg.slider.fmt(v, st));
      XP.rangeFill(input);
      var zi = zoneOf(cfg.zoneValue ? cfg.zoneValue(v, st) : v), z = cfg.zones[zi];
      var key = zi + JSON.stringify(st.toggles);
      if(key !== lastZone){
        lastZone = key;
        root.dataset.tone = z.tone;
        root.querySelector('.xp-badge').textContent = z.badge;
        root.querySelector('.xp-badge').className = 'xp-badge xp-t-'+z.tone;
        root.querySelector('.xp-head').textContent = z.title;
        root.querySelector('.xp-text').innerHTML = typeof z.text==='function' ? z.text(v,st) : z.text;
        root.querySelector('.xp-ptx').innerHTML = typeof z.patient==='function' ? z.patient(v,st) : z.patient;
        root.querySelector('.xp-phx').innerHTML = typeof z.pharm==='function' ? z.pharm(v,st) : z.pharm;
      }
      XP.setBars(root, cfg.bars.map(function(b){ return b.f(v, st); }));
      if(cfg.tiles){ root.querySelector('.xp-tiles').innerHTML = cfg.tiles(v, st).map(function(t){ return '<div class="xp-tile xp-t-'+t.tone+'"><span>'+esc(t.label)+'</span><b>'+esc(t.value)+'</b></div>'; }).join(''); }
      chips.forEach(function(c,i){ c.setAttribute('aria-pressed', cfg.chips[i].v==v ? 'true':'false'); });
    }
    function req(){ if(!raf) raf = requestAnimationFrame(render); }
    input.addEventListener('input', function(){ st.v = +input.value; req(); });
    chips.forEach(function(c,i){ c.addEventListener('click', function(){ animateTo(cfg.chips[i].v); }); });
    root.querySelectorAll('.xp-tog').forEach(function(b){ b.addEventListener('click', function(){ var k=b.dataset.t; st.toggles[k]=!st.toggles[k]; b.setAttribute('aria-pressed', st.toggles[k]?'true':'false'); req(); }); });
    var anim=0;
    function animateTo(target){
      cancelAnimationFrame(anim);
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var from = st.v, t0 = performance.now(), dur = reduce ? 0 : 450;
      (function step(now){
        var k = dur ? clamp((now - t0)/dur, 0, 1) : 1; k = 1 - Math.pow(1-k, 3);
        st.v = from + (target-from)*k; if(k>=1) st.v = target;
        input.value = st.v; render();
        if(k<1) anim = requestAnimationFrame(step);
      })(t0);
    }
    XP.dragChart(svg, input, cfg.x0, cfg.x1, cfg.vbw);
    render();
    return root;
  };

  /* Chart helpers ----------------------------------------------------------- */
  XP.pathFrom = function(fn, x0, x1, n){
    var d=''; for(var i=0;i<=n;i++){ var u=i/n, p=fn(u); d += (i?'L':'M')+p[0].toFixed(1)+','+p[1].toFixed(1); } return d;
  };
  XP.t = function(x,y,s,o){ o=o||{}; return '<text x="'+x+'" y="'+y+'" font-size="'+(o.size||14.5)+'" fill="'+(o.fill||'#b9c8d8')+'" text-anchor="'+(o.anchor||'start')+'"'+(o.weight?' font-weight="'+o.weight+'"':'')+(o.ls?' letter-spacing="'+o.ls+'"':'')+(o.rot?' transform="rotate('+o.rot+' '+x+' '+y+')"':'')+'>'+s+'</text>'; };
})();
