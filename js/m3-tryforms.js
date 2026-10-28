/* Standalone form library: "Try the form".
   Shows each questionnaire with example answers pre-selected (from js/m3-tryforms-data.js) and scores it live with the
   ADHD Assessment workspace's own tool data and tested scoring engine, loaded on demand when the library is on screen.
   Forms that are licensed or are not questionnaires show the workspace forms guide's worked example instead. */
(function(){
  'use strict';
  var libs = Array.prototype.slice.call(document.querySelectorAll('[data-formlib]')); if(!libs.length || !window.M3TRY) return;
  var BASE = 'adhd-assessment/js/';
  var FILES = ['core/ns.js', 'data/tools-adhd.js', 'data/tools-comorbid.js', 'data/tools-info.js', 'data/forms-guide.js', 'engine/scoring.js'];
  var loaded = !!(window.AA && AA.scoring && AA.byId('tools','aceq')), loading = false, callbacks=[];

  function load(cb){
    if(loaded) return cb();
    callbacks.push(cb);
    if(loading) return; loading = true;
    var i = 0;
    (function next(){
      if(i >= FILES.length){ loaded = true; loading=false; callbacks.splice(0).forEach(function(fn){fn();}); return; }
      var s = document.createElement('script'); s.src = BASE + FILES[i++] + '?v=20261026s';
      s.onload = next; s.onerror = function(){ libs.forEach(function(lib){lib.querySelectorAll('.fl-try').forEach(function(m){ m.innerHTML = '<p class="cl-progress">The example form could not load. Open it in the Assessment workspace instead.</p>'; });}); };
      document.head.appendChild(s);
    })();
  }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function guideFor(id){ var g = window.AA && AA.data.formsGuide; if(!g) return null; for(var i=0;i<g.forms.length;i++) if(g.forms[i].id===id) return g.forms[i]; return null; }

  /* WFIRS examples are written per domain; expand them to item numbers. */
  function answersFor(tool, ex){
    if(!ex.a.dom) return JSON.parse(JSON.stringify(ex.a));
    var out = {};
    tool.scoring.domains.forEach(function(d){ var v = ex.a.dom[d.label] || []; d.items.forEach(function(n,i){ if(v[i] != null) out[n] = v[i]; }); });
    return out;
  }

  var scoreHtml = window.M3SCORE;   /* shared with forms/print.html: js/score-panel.js */

  function itemsHtml(tool, ans){
    var shaded = tool.items.some(function(it){ return it.threshold != null; });
    var h = '<div class="tf-items">'+(shaded ? '<p class="tf-key"><i></i>Grey boxes are the shaded range that counts towards the screen.</p>' : '');
    tool.items.forEach(function(it){
      if(it.section) h += '<p class="tf-sec">'+esc(it.section)+(it.sectionNote ? '<small>'+esc(it.sectionNote)+'</small>' : '')+'</p>';
      var opts = it.opts || tool.options || [];
      var thr = it.threshold;
      h += '<div class="tf-item'+(it.unscored ? ' tf-uns' : '')+'"><p><span class="tf-n">'+it.n+'</span>'+esc(it.t)+(it.unscored ? ' <em>(not scored)</em>' : '')+'</p><div class="tf-opts" role="group" aria-label="Item '+it.n+'">';
      opts.forEach(function(o){
        var on = ans[it.n] === o.v, sh = thr != null && typeof o.v === 'number' && o.v >= thr;
        h += '<button type="button" class="tf-o'+(sh ? ' sh' : '')+(on ? ' on' : '')+'" data-n="'+it.n+'" data-v="'+esc(o.v)+'" aria-pressed="'+on+'">'+esc(o.l)+'</button>';
      });
      h += '</div></div>';
    });
    return h + '</div>';
  }

  /* Links to the real form: the publisher's official copy (new tab) and our printable, fill-in practice version. */
  /* Original PDFs saved in forms/official/ (they open in a browser tab; the publishers' links often force a download). */
  var ORIG = {asrs18:'asrs-v1-1.pdf', wfirs:'wfirs-s.pdf', wsr2:'wsr-ii.pdf', snap4:'snap-iv-26.pdf', phq9:'phq-9.pdf', gad7:'gad-7.pdf', audit:'audit.pdf', aq10:'aq-10.pdf', pcl5:'pcl-5.pdf', cssrs:'c-ssrs-screener.pdf'};
  var FILLABLE = {pcl5:1};
  function getRow(fid, tool){
    var url = tool && tool.url, paper = url && /pubmed|pmc\.ncbi/.test(url), own = ORIG[fid];
    var h = '<div class="tf-get">';
    if(own) h += '<a class="tf-gl" href="forms/view.html?f='+own+'" target="_blank" rel="noopener"><b>Original form (PDF)</b><small>'+(FILLABLE[fid] ? 'Fillable: type into it, then download your filled copy' : 'The publisher’s form, opens in a new tab to read or print')+'</small></a>';
    else if(url) h += '<a class="tf-gl" href="'+esc(url)+'" target="_blank" rel="noopener"><b>'+(paper ? 'Original paper' : 'Official page')+'</b><small>'+(paper ? 'No free official form is published' : 'The publisher’s page for this form')+'</small></a>';
    if(tool && tool.items && tool.items.length) h += '<a class="tf-gl tf-gp" href="forms/print.html?f='+encodeURIComponent(fid)+'" target="_blank" rel="noopener"><b>Fill in our version</b><small>Same questions, live score, save as PDF or print</small></a>';
    return h + '</div>';
  }
  function mount(m){
    if(m.dataset.tryMounted)return;
    m.dataset.tryMounted='true';
    var fid = m.dataset.form, cfg = window.M3TRY[fid];
    /* the whole box is a dropdown, closed by default */
    var tab = m.closest('.fl-panel') && m.closest('.fl-panel').querySelector('.fsub-t[data-p="try"]');
    var registered=window.AA&&AA.byId('tools',fid);
    if(!cfg && m.closest('#form-library') && registered){
      if(registered.interactive && registered.items && registered.items.length){
        cfg={tool:fid,ex:[]};
      }else if(!(guideFor(fid)||{}).example){
        if(tab)tab.lastChild.textContent='Form access';
        m.innerHTML='<div class="tf-box"><p class="tf-lic">'+esc(registered.licence||'Use the official form and its administration guidance. Items are not reproduced here.')+'</p>'+getRow(fid,registered)+'<p>'+esc(registered.how||'See the official source for administration and scoring.')+'</p></div>';
        return;
      }
    }
    if(!cfg && !(guideFor(fid) || {}).example){ m.innerHTML = ''; if(tab) tab.hidden = true; return; }
    if(!cfg && tab) tab.lastChild.textContent = 'Worked example';
    m.innerHTML = '<details class="tf-d"><summary><span class="tf-dt">'+(cfg ? 'Try the form' : 'Worked example')+'</span><span class="tf-ds">'+(cfg ? 'Answer the questions and watch the score build, or load an example patient. Original form and printable version inside.' : 'A worked example of reading this form, and a link to the original.')+'</span></summary><div class="tf-in"></div></details>';
    if(m.closest('.fl-pane')) m.querySelector('.tf-d').open = true;
    m = m.querySelector('.tf-in');
    if(!cfg){   /* licensed tools and non-questionnaires: worked example from the forms guide */
      var g = guideFor(fid), t = window.AA && AA.byId('tools', fid);
      if(!g || !g.example) { m.innerHTML = ''; return; }
      m.innerHTML = '<div class="tf-box"><div class="tf-top">'
        + (t && t.interactive === false ? '<span class="tf-lic">Items not reproduced: '+esc(String(t.licence||'licensed').split('.')[0])+'.</span>' : '')
        + '</div>'+(t && t.url ? getRow(fid, {url:t.url}) : '')+'<div class="tf-ex">'+g.example.html+'</div>'+(g.example.takeaway ? '<p class="tf-teach"><b>Takeaway:</b> '+esc(g.example.takeaway)+'</p>' : '')+'</div>';
      return;
    }
    var tool = cfg.local || AA.byId('tools', cfg.tool); if(!tool) return;
    var scoreIt = cfg.score || function(a){ return AA.scoring.score(tool, a); };
    var k = -1, ans = {};   /* starts blank (fill it in yourself); k >= 0 loads an example patient */
    function draw(){
      var ex = k < 0 ? null : cfg.ex[k], r = scoreIt(ans), blank = !Object.keys(ans).length;
      /* one toolbar: blank form or an example patient (left), the two form links (right) */
      m.innerHTML = '<div class="tf-box"><div class="tf-top"><div class="tf-who">'
        + '<div class="tf-pre"><button type="button" class="tf-p tf-own'+(k<0?' on':'')+'" data-k="-1">Fill it in yourself</button>'+cfg.ex.map(function(e,i){ return '<button type="button" class="tf-p'+(i===k?' on':'')+'" data-k="'+i+'">'+esc(e.name)+'</button>'; }).join('')+'</div></div>' + getRow(fid, tool) + '</div>'
        + (ex ? '<p class="tf-story"><b>'+esc(ex.name)+' (example answers pre-selected):</b> '+esc(ex.story)+'</p>' : '<p class="tf-story tf-story-own"><b>Your turn:</b> answer each question yourself, or for a patient you have in mind, and watch the score build. Tap an answer again to clear it.</p>')
        + '<div class="tf-grid">'+itemsHtml(tool, ans)+'<aside class="tf-side">'+(blank ? '<div class="tf-score tf-empty"><b>No answers yet</b><span>Choose an answer for each question. The score, the result and any safety alerts appear here as you go.</span></div>' : scoreHtml(tool, r, ans))+(ex ? '<p class="tf-teach"><b>What this example teaches:</b> '+esc(ex.teach)+'</p>' : '')
        + '<p class="tf-note">Change any answer to see the score update. '+esc(cfg.note || 'Scored with the Assessment workspace engine; item wording as held there.')+'</p></aside></div></div>';
      Array.prototype.forEach.call(m.querySelectorAll('.tf-gl'), function(a){ var sm = a.querySelector('small'); if(sm) a.title = sm.textContent; });
    }
    m.addEventListener('click', function(e){
      var p = e.target.closest('.tf-p'), o = e.target.closest('.tf-o');
      if(p){ k = +p.dataset.k; ans = k < 0 ? {} : answersFor(tool, cfg.ex[k]); draw(); }
      else if(o){ var v = o.dataset.v, n = +o.dataset.n; v = v === 'na' ? 'na' : +v; if(ans[n] === v) delete ans[n]; else ans[n] = v; var y = window.scrollY; draw(); window.scrollTo(0, y); }
    });
    draw();
  }
  function start(lib){ load(function(){ lib.querySelectorAll('.fl-try').forEach(mount); }); }
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);start(e.target);}});}, {rootMargin:'300px'});
    libs.forEach(function(lib){io.observe(lib);});
  } else libs.forEach(start);
})();
