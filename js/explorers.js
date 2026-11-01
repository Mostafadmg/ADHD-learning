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
   Optional: cfg.visualFirst (draw cfg visual above the controls), cfg.visualLabel (title of the closed dropdown that holds a
   visual drawn below the result), cfg.after(root, st, render).

   Light, phone-first card (styles: css/xp-light.css, root class "xpl"):
     presets  -> one scrolling chip row;   controls -> one tidy block (segmented, toggle grid, stack, select or slider);
     verdict  -> badge + title + text, coloured left bar by tone, directly under the controls;
     bars/tiles in a two-column grid;   patient / pharmacist notes in two closed dropdowns (one open at a time);   sources in a closed dropdown.
     A tick list of more than 8 options starts closed, with a count; a single-choice list of more than 6 long labels becomes a select.
   A slim sticky strip repeats badge + title while the verdict is still below the screen, so the result is always in view
   after any control is changed.  The old dark card (XP.make, "xp card-dark") is untouched. */
(function(){
  'use strict';
  var XP=window.XP, esc=XP.esc, uid=0;
  XP.registry = XP.registry || {};
  var TONES={ok:1,mid:1,warn:1,high:1,danger:1,low:1,info:1};
  var I={
    ok:'<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
    mid:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.4"/>',
    warn:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.4v.4"/>',
    high:'<path d="M12 3.2l9.6 16.8H2.4z"/><path d="M12 9.5v4.6M12 17v.4"/>',
    danger:'<path d="M8.2 3h7.6L21 8.2v7.6L15.8 21H8.2L3 15.8V8.2z"/><path d="M12 7.6v5.4M12 16v.4"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.4"/>'
  };
  function icon(t){ return '<svg class="xl-ico" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+(I[t]||I.info)+'</svg>'; }
  var CHEV='<svg class="xl-chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6"/></svg>';

  /* how a single-choice list is drawn, by how many options and how long their labels are */
  function kindOf(c){
    if(c.type==='range') return 'range';
    if(c.type==='select') return 'select';
    var n=c.options.length, max=0, sum=0; c.options.forEach(function(o){ var l=String(o.label).length; max=Math.max(max,l); sum+=l; });
    if(c.type==='multi') return max<=28?'multi':'multi1';
    if(n<=3) return max<=26?'seg':'stack';
    if(n<=6) return max<=28?'grid':'stack';
    return (sum/n<=26&&max<=42)?'grid':'select';
  }
  function barsHTML(bars){
    return bars.map(function(b,i){
      return '<div class="xl-bar xl-b-'+esc(b.tone)+'" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="'+esc(b.label)+(b.sub?', '+esc(b.sub):'')+'">'
        +'<span class="xl-bl">'+esc(b.label)+(b.sub?'<small>'+esc(b.sub)+'</small>':'')+'</span><span class="xl-bt"><span class="xl-bf" data-i="'+i+'"></span></span></div>';
    }).join('');
  }
  function setBars(root, bars){
    var rows=root.querySelectorAll('.xl-bar');
    bars.forEach(function(b,i){
      var r=rows[i]; if(!r) return; var p=Math.round(XP.clamp(b.v,0,1)*100);
      r.querySelector('.xl-bf').style.transform='scaleX('+(p/100)+')';
      r.setAttribute('aria-valuenow',p);
      if(b.text) r.setAttribute('aria-valuetext',b.text);
    });
  }
  var still=window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  XP.form = function(mount, cfg){
    var id='xf'+(++uid), st={}, kinds={}, openPane='';
    cfg.controls.forEach(function(c){ st[c.id]= c.type==='multi' ? (c.value||[]).slice() : c.value; kinds[c.id]=kindOf(c); });
    function optHTML(c,o,k){
      var multi=k==='multi'||k==='multi1';
      return '<button type="button" class="'+(multi?'xl-tg':'xl-opt')+'" data-v="'+esc(o.v)+'" aria-pressed="false"><span class="xl-ot">'+esc(o.label)+'</span></button>';
    }
    function ctlHTML(c){
      var k=kinds[c.id], cid=id+'-'+c.id, lab=esc(c.label)+(c.hint?' <span class="xl-hint">'+esc(c.hint)+'</span>':'');
      var h='<div class="xl-ctl" data-c="'+c.id+'" data-k="'+k+'">';
      if(c.type==='range'){
        h+='<div class="xl-lab"><label for="'+cid+'">'+esc(c.label)+'</label><output class="xl-out" for="'+cid+'"></output></div>'
          +'<input class="xl-range" id="'+cid+'" type="range" min="'+c.min+'" max="'+c.max+'" step="'+(c.step||1)+'" value="'+c.value+'">';
      } else if(k==='select'){
        h+='<label class="xl-lab" for="'+cid+'">'+lab+'</label><div class="xl-sel"><select id="'+cid+'">'
          +c.options.map(function(o){ return '<option value="'+esc(o.v)+'"'+(String(o.v)===String(c.value)?' selected':'')+'>'+esc(o.label)+'</option>'; }).join('')
          +'</select>'+CHEV+'</div>';
      } else if(c.type==='multi' && c.options.length>8){
        /* a long tick list starts closed, with a count, so the page does not become a wall of boxes */
        h+='<details class="xl-d xl-grp"><summary><span class="xl-glab" id="'+cid+'-l">'+lab+'</span><span class="xl-cnt"></span></summary>'
          +'<div class="xl-opts xl-'+k+'" role="group" aria-labelledby="'+cid+'-l">'+c.options.map(function(o){ return optHTML(c,o,k); }).join('')+'</div></details>';
      } else {
        h+='<p class="xl-lab" id="'+cid+'-l">'+lab+'</p><div class="xl-opts xl-'+k+'" role="group" aria-labelledby="'+cid+'-l">'
          +c.options.map(function(o){ return optHTML(c,o,k); }).join('')+'</div>';
      }
      return h+'</div>';
    }
    var h='<div class="xpl" id="'+id+'" data-tone="info" data-xp-form>'
      +'<header class="xl-head"><p class="xl-kicker">'+esc(cfg.kicker)+'</p><h3 class="xl-title">'+esc(cfg.title)+'</h3></header>'
      +'<details class="xl-d xl-about"><summary>How to use this tool</summary><div class="xl-intro"><p>'+cfg.intro+'</p></div></details>'
      +(cfg.visualFirst?'<div class="xl-vis xl-vis-first"></div>':'')
      +'<div class="xl-body"><section class="xl-a" aria-label="Choose">'
      +(cfg.presets?'<div class="xl-ctl xl-pre"><p class="xl-lab" id="'+id+'-pl">'+esc(cfg.presetLabel||'Presets')+'</p><div class="xl-pwrap"><div class="xl-presets" role="group" aria-labelledby="'+id+'-pl">'
        +cfg.presets.map(function(p,i){ return '<button type="button" class="xl-chip" data-i="'+i+'" aria-pressed="false">'+esc(p.label)+'</button>'; }).join('')+'</div></div></div>':'')
      +cfg.controls.map(ctlHTML).join('')
      +'</section><section class="xl-b" aria-label="Result">'
      +'<div class="xl-res"><div class="xl-state" aria-live="polite" aria-atomic="true"><span class="xl-pill"><span class="xl-pi"></span><span class="xl-pt"></span></span><h4 class="xl-vt"></h4></div><div class="xl-text"></div></div>'
      +'<div class="xl-glance" hidden><div class="xl-bars"></div><div class="xl-tiles"></div></div>'
      +(cfg.visualFirst?'':'<details class="xl-d xl-vd" hidden><summary>'+esc(cfg.visualLabel||'See the full picture')+'</summary><div class="xl-vis"></div></details>')
      +'<div class="xl-two">'
      +'<div class="xl-acc"><button type="button" class="xl-tab xl-tab-pt" data-p="pt" aria-expanded="false" aria-controls="'+id+'-pt"><span>What this means for the patient</span>'+CHEV+'</button>'
      +'<div class="xl-pane xl-pane-pt" id="'+id+'-pt" role="region" aria-label="What this means for the patient" hidden><div class="xl-ptx"></div></div></div>'
      +'<div class="xl-acc"><button type="button" class="xl-tab xl-tab-ph" data-p="ph" aria-expanded="false" aria-controls="'+id+'-ph"><span>Pharmacist action</span>'+CHEV+'</button>'
      +'<div class="xl-pane xl-pane-ph" id="'+id+'-ph" role="region" aria-label="Pharmacist action" hidden><div class="xl-phx"></div></div></div></div>'
      +'</section></div>'
      +'<p class="xl-note">'+cfg.note+'</p>'
      +'<details class="xl-d xl-src"><summary>Sources</summary><ul>'+cfg.sources.map(function(s){return '<li>'+s+'</li>';}).join('')+'</ul></details>'
      +'<div class="xl-strip" aria-hidden="true" hidden><span class="xl-pill"><span class="xl-pi"></span><span class="xl-pt"></span></span><span class="xl-st"></span>'+CHEV+'</div>'
      +'</div>';
    mount.innerHTML=h;
    var R=mount.firstChild, $=function(s){return R.querySelector(s);}, last={}, lastTone='', lastBars='', presetRow=$('.xl-presets'), pwrap=$('.xl-pwrap');

    function fade(){
      if(!presetRow) return;
      pwrap.classList.toggle('more-r', presetRow.scrollLeft+presetRow.clientWidth < presetRow.scrollWidth-4);
      pwrap.classList.toggle('more-l', presetRow.scrollLeft>4);
    }
    function sync(){
      cfg.controls.forEach(function(c){
        var el=R.querySelector('.xl-ctl[data-c="'+c.id+'"]'), k=kinds[c.id];
        if(c.type==='range'){ var r=el.querySelector('input'); r.value=st[c.id]; XP.rangeFill(r); var f=c.fmt?c.fmt(+st[c.id],st):st[c.id]; el.querySelector('output').textContent=f; r.setAttribute('aria-valuetext',f); }
        else if(k==='select'){ el.querySelector('select').value=st[c.id]; }
        else { el.querySelectorAll('button').forEach(function(b){ var v=b.dataset.v, on=c.type==='multi'?st[c.id].indexOf(v)>=0:String(st[c.id])===v; b.setAttribute('aria-pressed',on?'true':'false'); });
          var cnt=el.querySelector('.xl-cnt'); if(cnt) cnt.textContent=st[c.id].length+' of '+c.options.length+' ticked'; }
        if(c.show){ el.hidden=!c.show(st); }
      });
    }
    function setHTML(sel,html){ if(last[sel]!==html){ last[sel]=html; $(sel).innerHTML=html; } }
    /* a standing note inside a result (class db-w, for example "Also check: ...") goes into a closed dropdown, so the verdict stays short */
    var foldOpen=false;
    function foldNotes(){
      $('.xl-text').querySelectorAll('.db-w').forEach(function(n){
        var lead=n.querySelector('strong'), name='More to check';
        if(lead&&lead===n.firstElementChild&&/:\s*$/.test(lead.textContent)){ name=lead.textContent.replace(/:\s*$/,''); lead.remove(); }
        var d=document.createElement('details'); d.className='xl-d xl-fold'; d.open=foldOpen;
        var sm=document.createElement('summary'); sm.textContent=name; d.appendChild(sm);
        n.parentNode.insertBefore(d,n); d.appendChild(n);
        d.addEventListener('toggle',function(){ foldOpen=d.open; });
      });
    }
    function render(){
      sync();
      var o=cfg.evaluate(st), tone=TONES[o.tone]?o.tone:'info';
      R.dataset.tone=tone;
      if(tone!==lastTone){ lastTone=tone; R.querySelectorAll('.xl-pi').forEach(function(e){ e.innerHTML=icon(tone); }); }
      R.querySelectorAll('.xl-pt').forEach(function(e){ if(e.textContent!==o.badge) e.textContent=o.badge; });
      if($('.xl-vt').textContent!==o.title){ $('.xl-vt').textContent=o.title; $('.xl-st').textContent=o.title; }
      if(last['.xl-text']!==(o.text||'')){ setHTML('.xl-text',o.text||''); foldNotes(); }
      setHTML('.xl-ptx',o.patient||''); setHTML('.xl-phx',o.pharm||'');
      setHTML('.xl-vis',o.visual||'');
      var vd=$('.xl-vd'); if(vd) vd.hidden=!o.visual;
      var bars=o.bars||[], tiles=o.tiles||[];
      $('.xl-glance').hidden=!(bars.length||tiles.length);
      var bk=bars.map(function(x){return x.label+(x.sub||'')+x.tone;}).join('|'), bw=$('.xl-bars');
      bw.hidden=!bars.length;
      if(bk!==lastBars){ lastBars=bk; bw.innerHTML=barsHTML(bars); bw.offsetWidth; }
      setBars(R,bars);
      var tl=$('.xl-tiles'); tl.hidden=!tiles.length;
      setHTML('.xl-tiles',tiles.map(function(t){ var tt=TONES[t.tone]?t.tone:'info'; return '<div class="xl-tile xl-t-'+tt+(String(t.value).length>22?' xl-wide':'')+'"><span>'+esc(t.label)+'</span><b>'+esc(t.value)+'</b></div>'; }).join(''));
      if(cfg.presets) R.querySelectorAll('.xl-chip').forEach(function(c,i){ var p=cfg.presets[i].set, on=Object.keys(p).every(function(k2){ return JSON.stringify(p[k2])===JSON.stringify(st[k2]); }); c.setAttribute('aria-pressed',on?'true':'false'); });
      fade();
      if(R._place) R._place();
      if(cfg.after) cfg.after(R,st,render);
    }
    function pick(c,v){
      if(c.type==='multi'){ var i=st[c.id].indexOf(v); if(i>=0) st[c.id].splice(i,1); else st[c.id].push(v); }
      else st[c.id]=isNaN(+v)||v===''?v:(typeof c.value==='number'?+v:v);
      if(c.onChange) c.onChange(st); render();
    }
    cfg.controls.forEach(function(c){
      var el=R.querySelector('.xl-ctl[data-c="'+c.id+'"]'), k=kinds[c.id];
      if(c.type==='range') el.querySelector('input').addEventListener('input',function(e){ st[c.id]=+e.target.value; render(); });
      else if(c.type==='select') el.querySelector('select').addEventListener('change',function(e){ st[c.id]=e.target.value; render(); });
      else if(k==='select') el.querySelector('select').addEventListener('change',function(e){ pick(c,e.target.value); });
      else el.addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b||!el.contains(b)) return; pick(c,b.dataset.v); });
    });
    if(cfg.presets){
      R.querySelectorAll('.xl-chip').forEach(function(b,i){ b.addEventListener('click',function(){
        var p=cfg.presets[i].set; Object.keys(p).forEach(function(k2){ st[k2]=Array.isArray(p[k2])?p[k2].slice():p[k2]; }); render();
        presetRow.scrollTo({left:Math.max(0,b.offsetLeft-(presetRow.clientWidth-b.offsetWidth)/2),behavior:still?'auto':'smooth'});
      }); });
      presetRow.addEventListener('scroll',fade,{passive:true});
      if(window.ResizeObserver) new ResizeObserver(fade).observe(presetRow);
    }
    /* patient / pharmacist: two closed dropdowns, one open at a time, tap the open one to close it */
    function panes(scroll){
      R.querySelectorAll('.xl-tab').forEach(function(t){ var on=t.dataset.p===openPane; t.setAttribute('aria-expanded',on?'true':'false'); });
      R.querySelectorAll('.xl-pane').forEach(function(p){ p.hidden=!p.classList.contains('xl-pane-'+openPane); });
      if(scroll&&openPane){ var pn=$('.xl-pane-'+openPane), r=pn.getBoundingClientRect(); if(r.top>window.innerHeight*0.7) window.scrollBy({top:r.top-window.innerHeight*0.35,behavior:still?'auto':'smooth'}); }
    }
    R.querySelectorAll('.xl-tab').forEach(function(t){ t.addEventListener('click',function(){ openPane=openPane===t.dataset.p?'':t.dataset.p; panes(true); }); });
    /* slim result strip: shown only while the card is on screen and its verdict is still below the screen, so a change is
       never out of sight.  (An IntersectionObserver on the card tells us when it is on screen; the check itself runs on scroll.) */
    var strip=$('.xl-strip'), verdict=$('.xl-res'), inView=false, ticking=false;
    function place(){
      ticking=false;
      if(!inView){ strip.hidden=true; return; }
      var vr=verdict.getBoundingClientRect(), below=vr.top>window.innerHeight-64, above=vr.bottom<90;
      /* side by side (wide card): the verdict can also scroll off the top while the controls are still on screen */
      var side=above && $('.xl-b').getBoundingClientRect().left>$('.xl-a').getBoundingClientRect().left+80;
      strip.hidden=!(vr.height>0 && (below||side));
    }
    function onMove(){ if(!ticking){ ticking=true; requestAnimationFrame(place); } }
    strip.addEventListener('click',function(){ verdict.scrollIntoView({block:'center',behavior:still?'auto':'smooth'}); });
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){ inView=es[es.length-1].isIntersecting; place(); }).observe(R);
      window.addEventListener('scroll',onMove,{passive:true});
      window.addEventListener('resize',onMove);
    }
    R._place=place;
    R._st=st; R._render=render;
    render(); return R;
  };
})();
