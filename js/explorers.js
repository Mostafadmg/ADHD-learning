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

/* Form-style explorer: chips / multi-toggles / ranges / selects -> evaluated state card.
   cfg.controls: [{type:'chips'|'multi'|'range'|'select', id, label, options:[{v,label}], value, min,max,step, fmt, hint}]
   cfg.presets: [{label, set:{id:value}}]   cfg.evaluate(st) -> {tone,badge,title,text,bars,tiles,patient,pharm,svg,visual}
*/
(function(){
  'use strict';
  var XP=window.XP, esc=XP.esc, uid=0;
  XP.registry = XP.registry || {};
  XP.form = function(mount, cfg){
    var id='xf'+(++uid), st={};
    cfg.controls.forEach(function(c){ st[c.id]= c.type==='multi' ? (c.value||[]).slice() : c.value; });
    function ctlHTML(c){
      var h='<div class="xf-ctl" data-c="'+c.id+'">';
      if(c.type==='range'){
        h+='<label class="xp-sl-label" for="'+id+'-'+c.id+'">'+esc(c.label)+' <output class="xp-out"></output></label><input class="xp-range" id="'+id+'-'+c.id+'" type="range" min="'+c.min+'" max="'+c.max+'" step="'+(c.step||1)+'" value="'+c.value+'">';
      } else if(c.type==='select'){
        h+='<label class="xf-sel">'+esc(c.label)+'<select>'+c.options.map(function(o){return '<option value="'+esc(o.v)+'"'+(o.v===c.value?' selected':'')+'>'+esc(o.label)+'</option>';}).join('')+'</select></label>';
      } else {
        h+='<p class="db-step" id="'+id+'-'+c.id+'-l">'+esc(c.label)+(c.hint?' <span class="xf-hint">'+esc(c.hint)+'</span>':'')+'</p><div class="xp-chips'+(c.type==='multi'?' xf-multi':'')+'" role="group" aria-labelledby="'+id+'-'+c.id+'-l">'
          +c.options.map(function(o){return '<button type="button" class="xp-chip'+(c.type==='multi'?' xp-tog':'')+'" data-v="'+esc(o.v)+'" aria-pressed="false">'+esc(o.label)+'</button>';}).join('')+'</div>';
      }
      return h+'</div>';
    }
    var h='<div class="xp card-dark xf" id="'+id+'">'
      +'<p class="xp-kicker">'+esc(cfg.kicker)+'</p><h3 class="xp-title">'+esc(cfg.title)+'</h3><p class="xp-intro">'+cfg.intro+'</p>'
      +(cfg.presets?'<p class="db-step">'+esc(cfg.presetLabel||'Presets')+'</p><div class="xp-chips xf-presets" role="group" aria-label="Presets">'+XP.chipsHTML(cfg.presets)+'</div>':'')
      +(cfg.visualFirst?'<div class="xf-visual"></div>':'')
      +'<div class="xf-ctls">'+cfg.controls.map(ctlHTML).join('')+'</div>'
      +(cfg.visualFirst?'':'<div class="xf-visual"></div>')
      +'<div class="xp-state" aria-live="polite"><span class="xp-badge"></span><h4 class="xp-head"></h4></div>'
      +'<div class="xp-text"></div><div class="xp-bars"></div><div class="xp-tiles"></div>'
      +'<div class="xp-boxes"><div class="xp-box xp-pt"><h5>What this means for the patient</h5><div class="xp-ptx"></div></div><div class="xp-box xp-ph"><h5>Pharmacist action</h5><div class="xp-phx"></div></div></div>'
      +'<p class="xp-note">'+cfg.note+'</p><details class="xp-src"><summary>Sources</summary><ul>'+cfg.sources.map(function(s){return '<li>'+s+'</li>';}).join('')+'</ul></details></div>';
    mount.innerHTML=h;
    var R=mount.firstChild, $=function(s){return R.querySelector(s);}, barKey='', last={};
    function sync(){
      cfg.controls.forEach(function(c){
        var el=R.querySelector('.xf-ctl[data-c="'+c.id+'"]');
        if(c.type==='range'){ var r=el.querySelector('input'); r.value=st[c.id]; XP.rangeFill(r); var f=c.fmt?c.fmt(+st[c.id],st):st[c.id]; el.querySelector('output').textContent=f; r.setAttribute('aria-valuetext',f); }
        else if(c.type==='select'){ el.querySelector('select').value=st[c.id]; }
        else el.querySelectorAll('.xp-chip').forEach(function(b){ var v=b.dataset.v, on=c.type==='multi'?st[c.id].indexOf(v)>=0:String(st[c.id])===v; b.setAttribute('aria-pressed',on?'true':'false'); });
        if(c.show){ el.hidden=!c.show(st); }
      });
    }
    function setHTML(sel,html){ if(last[sel]!==html){ last[sel]=html; $(sel).innerHTML=html; } }
    function render(){
      sync();
      var o=cfg.evaluate(st), b=$('.xp-badge');
      b.textContent=o.badge; b.className='xp-badge xp-t-'+o.tone; R.dataset.tone=o.tone;
      if($('.xp-head').textContent!==o.title) $('.xp-head').textContent=o.title;
      setHTML('.xp-text',o.text||''); setHTML('.xp-ptx',o.patient||''); setHTML('.xp-phx',o.pharm||'');
      setHTML('.xf-visual',o.visual||'');
      var bars=o.bars||[], k=bars.map(function(x){return x.label+(x.sub||'')+x.tone;}).join('|');
      var bw=$('.xp-bars'); bw.hidden=!bars.length;
      if(k!==barKey){ barKey=k; bw.innerHTML=XP.barsHTML(bars); bw.offsetWidth; }
      XP.setBars(R,bars.map(function(x){return x.v;}));
      R.querySelectorAll('.xp-bar').forEach(function(r,i){ if(bars[i]&&bars[i].text) r.setAttribute('aria-valuetext',bars[i].text); });
      var tl=$('.xp-tiles'); tl.hidden=!(o.tiles&&o.tiles.length);
      setHTML('.xp-tiles',(o.tiles||[]).map(function(t){return '<div class="xp-tile xp-t-'+t.tone+'"><span>'+esc(t.label)+'</span><b>'+esc(t.value)+'</b></div>';}).join(''));
      if(cfg.presets) R.querySelectorAll('.xf-presets .xp-chip').forEach(function(c,i){ var p=cfg.presets[i].set, on=Object.keys(p).every(function(k2){ return JSON.stringify(p[k2])===JSON.stringify(st[k2]); }); c.setAttribute('aria-pressed',on?'true':'false'); });
      if(cfg.after) cfg.after(R,st,render);
    }
    cfg.controls.forEach(function(c){
      var el=R.querySelector('.xf-ctl[data-c="'+c.id+'"]');
      if(c.type==='range') el.querySelector('input').addEventListener('input',function(e){ st[c.id]=+e.target.value; render(); });
      else if(c.type==='select') el.querySelector('select').addEventListener('change',function(e){ st[c.id]=e.target.value; render(); });
      else el.addEventListener('click',function(e){ var b=e.target.closest('.xp-chip'); if(!b) return; var v=b.dataset.v;
        if(c.type==='multi'){ var i=st[c.id].indexOf(v); if(i>=0) st[c.id].splice(i,1); else st[c.id].push(v); }
        else st[c.id]=isNaN(+v)||v===''?v:(typeof c.value==='number'?+v:v);
        if(c.onChange) c.onChange(st); render(); });
    });
    if(cfg.presets) R.querySelectorAll('.xf-presets .xp-chip').forEach(function(b,i){ b.addEventListener('click',function(){ var p=cfg.presets[i].set; Object.keys(p).forEach(function(k2){ st[k2]=Array.isArray(p[k2])?p[k2].slice():p[k2]; }); render(); }); });
    R._st=st; R._render=render;
    render(); return R;
  };
})();
