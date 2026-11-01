/* Release model for stimulant products: a schematic teaching model built from SmPC descriptions of release
   (IR:MR ratio, peak times, duration). Relative levels only, not pharmacokinetic data.
   Shared by the day-profile builder (js/daybuilder.js, M5 lesson 4) and the release profile explorer
   (js/m5-release.js, M5 lesson 3), so both lessons draw the same shapes. Change it here only. */
(function(){
  'use strict';
  var DT = 0.02;   /* hours per step */
  var MODEL = {
    ir:   {comps:[{frac:1,lag:0,ka:1.8}], ke:0.36},
    /* v5 (21 Oct 2026) re-fitted to SmPC 5.2 timings: Equasym XL peaks ~1.5 h and ~4.5 h; Medikinet XL second rise
       ~3 h after the first with a 3-4 h plateau >=75% of peak; Ritalin XL-type peaks 1-2 h and 5-7 h (~4 h apart);
       Concerta XL initial maximum 1-2 h, peak 6-8 h (Tmax 6.8 h), ~12 h. Peak times re-checked 1 Nov 2026.
       v6 (1 Nov 2026): Equasym XL re-fitted to its SmPC 5.2 levels too (mean 7.7 ng/ml at 1.5 h, 8.2 ng/ml at 4.5 h):
       first peak 1.5 h at 94% of the second, a dip, second rise ~2.8 h, second peak 4.5 h, cover ~8 h.
       Medikinet XL re-fitted the same day to last ~8 h (SmPC and SPS): first peak 1.4 h, second peak 3.3 h (SPS 3-4 h),
       levels >= 75% of the peak for 3.6 h after the first peak (SmPC 3-4 h plateau), cover 8.0 h (was 6.5 h). */
    eq:   {comps:[{frac:.3,lag:0,ka:2.2},{frac:.7,lag:0,zero:[7,[[0,.8],[.35,.4],[.5,1],[1,0]]]}], ke:0.36},
    mk:   {comps:[{frac:.5,lag:0,ka:1.8},{frac:.5,lag:0.5,zero:[9,[[0,0],[.3,1],[.35,.3],[.6,.3],[1,0]]]}], ke:0.36},
    rxl:  {comps:[{frac:.5,lag:0,ka:1.4},{frac:.5,lag:4.2,ka:1.0}], ke:0.36},
    oros: {comps:[{frac:.22,lag:0,ka:2.2},{frac:.78,lag:0.6,zero:[10,[[0,.3],[.5,1.3],[1,.2]]]}], ke:0.40},
    dex:  {comps:[{frac:1,lag:0,ka:1.0}], ke:0.28},
    lis:  {comps:[{frac:1,lag:0,ka:1.5}], ke:0.12, kc:0.6}
  };
  function interp(pts,u){ for(var i=0;i<pts.length-1;i++){ var a=pts[i],b=pts[i+1]; if(u>=a[0]&&u<=b[0]) return a[1]+(b[1]-a[1])*(u-a[0])/(b[0]-a[0]); } return 0; }
  var cache = {};
  /* Level after one dose taken at t = 0, every DT hours for `hours` hours. With `only` set to a component index,
     just that part of the release (the model is linear, so the parts add up to the whole). Do not change the
     returned array: it is cached. */
  function curve(key, only, hours){
    var id = key + '|' + (only == null ? '' : only) + '|' + hours;
    if(cache[id]) return cache[id];
    var m = MODEL[key]; if(!m) return null;
    var N = Math.round(hours / DT) + 1, out = new Float64Array(N), gut = m.comps.map(function(){ return 0; }), pro = 0, cen = 0;
    var areas = m.comps.map(function(c){ if(!c.zero) return 0; var p=c.zero[1],a=0; for(var i=0;i<p.length-1;i++) a+=(p[i+1][0]-p[i][0])*(p[i][1]+p[i+1][1])/2; return a; });
    for(var i=0;i<N;i++){
      var t = i*DT, inp = 0;
      m.comps.forEach(function(c,j){
        if(only != null && j !== only) return;
        if(c.zero){ var D=c.zero[0]; if(t>=c.lag && t<c.lag+D) inp+=c.frac*interp(c.zero[1],(t-c.lag)/D)/areas[j]/D*DT; }
        else { if(Math.abs(t-c.lag)<DT/2) gut[j]+=c.frac; var a=gut[j]*c.ka*DT; gut[j]-=a; inp+=a; }
      });
      if(m.kc){ pro+=inp; var cv=pro*m.kc*DT; pro-=cv; inp=cv; }
      cen += inp - cen*m.ke*DT; out[i] = cen;
    }
    return (cache[id] = out);
  }
  window.RELMODEL = {DT: DT, MODEL: MODEL, curve: curve};
})();
