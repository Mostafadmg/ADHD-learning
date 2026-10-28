/* Score panel shared by the standalone form library (js/m3-tryforms.js) and the fill-in form page (forms/print.html).
   Result banner, answered bar, safety alerts first, sub-scores as tiles with bars, then the scoring steps. */
(function(){
  'use strict';
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  /* Score panel: result banner, answered bar, safety alerts first, sub-scores as tiles with bars, then the scoring steps. */
  window.M3SCORE = function(tool, r, ans){
    var scored = tool.items.filter(function(it){ return !it.unscored; }), done = scored.filter(function(it){ return ans && ans[it.n] != null; }).length, all = scored.length;
    var noTotal = {asrs18:1, wfirs:1, mdq:1, snap:1}[tool.scoring.method];
    var state = r.positive === true ? 'pos' : r.positive === false ? 'neg' : (done < all ? 'prog' : 'band');
    var title = state === 'pos' ? 'Screen positive' : state === 'neg' ? 'Screen negative' : state === 'prog' ? 'In progress' : (r.band || 'Result');
    var big = !noTotal && r.total != null && r.max ? '<span class="sc-big">'+r.total+'<small>/'+r.max+'</small></span>' : '';
    var sub = r.band && r.band !== title ? esc(r.band) : (state === 'prog' ? 'Answer every question for a final result' : '');
    var h = '<div class="sc"><div class="sc-ban st-'+state+'"><div><span class="sc-k">Result</span><b class="sc-t">'+esc(title)+'</b>'+(sub ? '<span class="sc-s">'+sub+'</span>' : '')+'</div>'+big+'</div>';
    h += '<div class="sc-prog"><span>'+done+' of '+all+' answered</span><i><b style="width:'+(all ? Math.round(done/all*100) : 0)+'%"></b></i></div>';
    if(r.flags && r.flags.length) h += r.flags.map(function(f){ return '<div class="sc-flag sc-'+esc(f.level)+'"><b>'+(f.level === 'urgent' ? 'Act today' : 'Note')+'</b><span>'+esc(f.text)+'</span></div>'; }).join('');
    if(r.subscales && r.subscales.length){
      h += '<div class="sc-tiles">'+r.subscales.map(function(sb){
        var isMean = sb.mean != null, val, pct = 0;
        if(isMean){ val = sb.answered ? sb.mean.toFixed(2) : '–'; pct = sb.answered ? Math.min(100, sb.mean / (tool.scoring.method === 'snap' ? 3 : 3) * 100) : 0; }
        else { val = sb.total != null ? sb.total + (sb.max ? '<small>/'+sb.max+'</small>' : '') : '–'; pct = sb.total != null && sb.max ? Math.min(100, sb.total / sb.max * 100) : 0; }
        var hit = sb.impaired === true || sb.positive === true;
        var tag = sb.impaired === true ? (tool.scoring.method === 'snap' ? 'At or above cut-off' : 'Impaired') : (sb.positive === true ? 'Positive' : '');
        return '<div class="sc-tile'+(hit ? ' hit' : '')+'"><span class="sc-l">'+esc(sb.label)+'</span><span class="sc-v">'+val+'</span><i class="sc-bar"><b style="width:'+Math.round(pct)+'%"></b></i>'
          + (tag || sb.band ? '<span class="sc-tag">'+esc(tag)+(tag && sb.band ? ' · ' : '')+esc(sb.band || '')+'</span>' : '')+'</div>';
      }).join('')+'</div>';
    }
    if(r.lines && r.lines.length) h += '<div class="sc-how"><span class="sc-k">How it was scored</span><ul>'+r.lines.map(function(l){ return '<li>'+esc(l)+'</li>'; }).join('')+'</ul></div>';
    return h + '</div>';
  };
})();
