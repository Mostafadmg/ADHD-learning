/* Module 2 interactive: "Finding the dose: the inverted U".
   The learner moves a slider (or picks a situation) along a simplified inverted-U curve of prefrontal
   performance against catecholamine level, and sees what the person experiences and what to do.
   Conceptual teaching model (Arnsten; Yerkes-Dodson type), not a measurement. */
(function(){
  'use strict';
  var mount = document.querySelector('[data-curve]'); if(!mount) return;

  var X0 = 40, X1 = 340, Y0 = 170, Y1 = 22;                    /* chart area in the SVG viewBox */
  function perf(v){ return 0.08 + 0.9*Math.exp(-Math.pow((v-52)/21, 2)); }   /* 0..1 */
  function px(v){ return X0 + (X1-X0)*v/100; }
  function py(p){ return Y0 - (Y0-Y1)*p; }

  var PRESETS = [
    {l:'Untreated ADHD', v:24}, {l:'Dose too low', v:40}, {l:'Right dose', v:52},
    {l:'A bit too high', v:66}, {l:'Too high or acute stress', v:86}
  ];
  var ZONES = [
    {to:33, tone:'low', badge:'Too little', title:'Under-stimulated prefrontal cortex',
     sci:'Too little noradrenaline reaches α2A receptors and too little dopamine reaches D1 receptors. Prefrontal networks fire weakly, so signals fade and background "noise" wins.',
     feel:'Drifts off, forgets instructions within seconds, struggles to start boring tasks, seeks stimulation (fidgeting, risk-taking). This is where untreated ADHD is thought to sit.',
     act:'Record baseline symptoms, impairment, sleep, appetite, heart rate and blood pressure before starting, so you can judge benefit and side effects later.'},
    {to:46, tone:'mid', badge:'Rising', title:'Getting closer: partial response',
     sci:'Catecholamines are rising into the effective range. Performance improves steeply here, which is why a small dose change can make a big difference.',
     feel:'Better on short tasks, but not sustained. "Good mornings, bad afternoons" often means the dose is wearing off rather than being too low.',
     act:'Keep titrating as planned and use rating scales at each step. Judge response only after an adequate trial at an adequate dose (NICE NG87: 6 weeks).'},
    {to:59, tone:'ok', badge:'Just right', title:'The target: optimal signal-to-noise',
     sci:'Moderate noradrenaline and dopamine strengthen the right network connections and filter out noise. Attention, working memory and impulse control are best here.',
     feel:'Calmer focus, finishes tasks, thinks before acting. Still feels like themselves: personality, humour and appetite largely intact.',
     act:'This is dose optimisation. Keep the same brand where possible, support adherence, and keep monitoring heart rate, blood pressure and weight.'},
    {to:73, tone:'warn', badge:'A bit too high', title:'Past the peak: early overshoot',
     sci:'Higher levels start to engage lower-affinity receptors (α1, β and excess D1 stimulation), which reduce prefrontal firing. More drug now gives worse performance.',
     feel:'Over-focused or rigid, irritable, anxious, quieter or "flat", poor appetite, trouble falling asleep.',
     act:'Think "dose too high", not "needs more". Discuss a dose reduction with the prescriber and check heart rate and blood pressure.'},
    {to:101, tone:'high', badge:'Too much', title:'Over-stimulated: prefrontal cortex goes "off-line"',
     sci:'Very high catecholamines (an excessive dose, or acute stress) switch prefrontal networks off. Control shifts to faster, more reflexive brain circuits.',
     feel:'Agitation, racing thoughts, tearfulness or anger, insomnia, weight loss, the "zombie" feeling.',
     act:'Ask about recent dose increases, extra doses, a brand switch or a new interacting medicine. Check heart rate and blood pressure, and contact the prescriber to reduce the dose.'}
  ];
  function zone(v){ for(var i=0;i<ZONES.length;i++) if(v<ZONES[i].to) return ZONES[i]; return ZONES[ZONES.length-1]; }

  var path = '';
  for(var i=0;i<=100;i+=2) path += (i? 'L':'M') + px(i).toFixed(1) + ',' + py(perf(i)).toFixed(1);
  var area = path + 'L' + X1 + ',' + Y0 + 'L' + X0 + ',' + Y0 + 'Z';
  /* coloured background bands, one per zone */
  var bands = '', from = 0;
  ZONES.forEach(function(z){ var to = Math.min(100, z.to); bands += '<rect x="'+px(from)+'" y="'+Y1+'" width="'+(px(to)-px(from))+'" height="'+(Y0-Y1)+'" class="cu-z cu-z-'+z.tone+'"/>'; from = to; });
  var svg = '<svg class="cu-svg" viewBox="0 0 360 200" role="img" aria-label="Inverted-U curve: performance is best at a moderate catecholamine level and worse when it is too low or too high">'
    + '<defs><linearGradient id="cuFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16324f" stop-opacity=".16"/><stop offset="1" stop-color="#16324f" stop-opacity="0"/></linearGradient></defs>'
    + bands
    + '<line x1="'+px(46)+'" y1="'+Y1+'" x2="'+px(46)+'" y2="'+Y0+'" class="cu-edge"/><line x1="'+px(59)+'" y1="'+Y1+'" x2="'+px(59)+'" y2="'+Y0+'" class="cu-edge"/>'
    + '<text x="'+((px(46)+px(59))/2)+'" y="'+(Y0-7)+'" class="cu-bandt" text-anchor="middle">best range</text>'
    + '<line x1="'+X0+'" y1="'+Y0+'" x2="'+X1+'" y2="'+Y0+'" class="cu-axis"/><line x1="'+X0+'" y1="'+Y1+'" x2="'+X0+'" y2="'+Y0+'" class="cu-axis"/>'
    + '<path d="'+area+'" fill="url(#cuFill)"/>'
    + '<path d="'+path+'" class="cu-line"/>'
    + '<line class="cu-drop" x1="0" y1="'+Y0+'" x2="0" y2="0"/><circle class="cu-halo" r="14" cx="0" cy="0"/><circle class="cu-dot" r="8" cx="0" cy="0"/>'
    + '<text x="'+X0+'" y="'+(Y0+18)+'" class="cu-t">Too little</text><text x="'+X1+'" y="'+(Y0+18)+'" class="cu-t" text-anchor="end">Too much</text>'
    + '<text x="'+((X0+X1)/2)+'" y="'+(Y0+18)+'" class="cu-t" text-anchor="middle">Dopamine and noradrenaline in the PFC</text>'
    + '<text x="14" y="'+((Y0+Y1)/2)+'" class="cu-t" text-anchor="middle" transform="rotate(-90 14 '+((Y0+Y1)/2)+')">Performance</text></svg>';
  /* zone scale under the slider (short labels so narrow segments do not wrap) */
  var SHORT = {low:'Too little', mid:'Rising', ok:'Best', warn:'High', high:'Too much'};
  var scale = '<div class="cu-scale" aria-hidden="true">', f2 = 0;
  ZONES.forEach(function(z){ var to = Math.min(100, z.to); scale += '<span class="cu-sz cu-z-'+z.tone+'" data-tone="'+z.tone+'" style="flex:'+(to-f2)+'">'+SHORT[z.tone]+'</span>'; f2 = to; });
  scale += '</div>';

  var h = '<div class="cu"><div class="imc-head"><p class="imc-kicker">Interactive · Module 2</p><h3>Finding the dose: the inverted U</h3>'
    + '<p>The prefrontal cortex works best with a <strong>moderate</strong> amount of dopamine and noradrenaline. Too little and too much both make it worse. Move the slider or pick a situation.</p></div>'
    + '<div class="imc-cases" role="group" aria-label="Situations"><span>Try:</span>';
  PRESETS.forEach(function(p,i){ h += '<button type="button" class="imc-case" data-v="'+p.v+'">'+p.l+'</button>'; });
  h += '</div><div class="cu-body"><div class="cu-chart">'+svg
    + '<label class="cu-sl"><span class="cu-sl-h">Catecholamine level <b class="cu-lv"></b></span><input type="range" min="0" max="100" step="1" value="24" aria-label="Catecholamine level in the prefrontal cortex"></label>'+scale+'</div>'
    + '<div class="cu-out" aria-live="polite"></div></div>'
    + '<p class="imc-note">Simplified teaching model based on prefrontal pharmacology research (Arnsten). The optimal dose differs between people and cannot be predicted from weight or age: it is found by careful titration (NICE NG87).</p></div>';
  mount.innerHTML = h;

  var root = mount.firstChild, input = root.querySelector('input'), dot = root.querySelector('.cu-dot'), halo = root.querySelector('.cu-halo'), lv = root.querySelector('.cu-lv'), szs = root.querySelectorAll('.cu-sz'), drop = root.querySelector('.cu-drop'), out = root.querySelector('.cu-out');
  function render(v){
    var x = px(v), y = py(perf(v)), z = zone(v);
    dot.setAttribute('cx', x); dot.setAttribute('cy', y); halo.setAttribute('cx', x); halo.setAttribute('cy', y); lv.textContent = Math.round(v)+' / 100';
    szs.forEach(function(sz){ sz.classList.toggle('on', sz.dataset.tone===z.tone); }); drop.setAttribute('x1', x); drop.setAttribute('x2', x); drop.setAttribute('y2', y);
    root.setAttribute('data-tone', z.tone);
    out.innerHTML = '<div class="imc-verdict t-'+z.tone+'"><span class="cu-badge">'+z.badge+'</span><p class="imc-vh">'+z.title+'</p></div>'
      + '<div class="cu-row"><span class="fx-lbl">In the brain</span><p>'+z.sci+'</p></div>'
      + '<div class="cu-row cu-feel"><span class="fx-lbl">What the person notices</span><p>'+z.feel+'</p></div>'
      + '<div class="imc-next"><strong>What you would do</strong><p>'+z.act+'</p></div>';
    root.querySelectorAll('.imc-case').forEach(function(b){ b.classList.toggle('on', +b.dataset.v===v); });
  }
  input.addEventListener('input', function(){ render(+input.value); });
  root.addEventListener('click', function(e){ var b = e.target.closest('.imc-case'); if(!b) return; input.value = b.dataset.v; render(+b.dataset.v); });
  render(+input.value);
})();
