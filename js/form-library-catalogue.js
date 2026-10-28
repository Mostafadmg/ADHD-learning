/* Full standalone catalogue: the lesson's pre-assessment pack plus every tool
   already registered by the Assessment workspace. No copied scoring algorithms. */
(function(){
  'use strict';
  var root=document.querySelector('#form-library [data-formlib-target]');
  if(!root || !window.M3renderLibrary || !window.AA)return;
  function esc(value){return String(value==null?'':value).replace(/[&<>\"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function paragraphs(value){return (Array.isArray(value)?value:[value]).filter(Boolean).map(esc).join('<br><br>');}
  var groups=window.M3FORMS.map(function(g){return {g:g.g,forms:g.forms.slice()};});
  groups[0].description='Screening, interviews, rating scales and impairment';
  var seen={};groups.forEach(function(g){g.forms.forEach(function(f){seen[f.id]=true;});});
  (AA.data.tools||[]).forEach(function(t){
    if(seen[t.id])return;
    seen[t.id]=true;
    var group=/^adhd-|^child$|^objective$/.test(t.group)?0:2;
    var audience=t.ageMax<18?'child':t.ageMin>=18?'adult':'both';
    var tier=t.group==='adhd-interview'||t.group==='objective'?'clin':'ind';
    groups[group].forms.push({
      id:t.id,ab:esc(t.abbr||t.id),full:esc(t.name),what:esc(t.purpose),use:esc(t.when),ageLabel:esc(t.ages),
      basis:esc(t.source),who:esc(t.who),score:esc(t.how||'Use the official manual and the guidance below.'),
      res:(t.interpretation||[]).map(function(line){return ['Interpretation',esc(line),'info'];}),
      watch:paragraphs(t.pitfalls||t.adhdNotes||'Use alongside a full clinical assessment.'),
      feeds:esc(t.group.replace(/-/g,' ')),link:'adhd-assessment/index.html#tool-'+t.id,
      profile:[audience,esc(t.who),esc(t.time||'See official guidance'),esc(t.interactive?'Interactive version available':'Official form / licence guidance'),esc(t.purpose),esc(t.adhdNotes||t.purpose)],
      whenInfo:[tier,esc(t.when),esc(t.source||'See the official source and licence in the Form access tab.')]
    });
  });
  root.setAttribute('data-formlib','standalone');
  window.formLibraryExplorer=window.M3renderLibrary(root,groups,'library-');
  window.M3FORMS=groups; // The site search indexes the complete catalogue too.
  var total=groups.reduce(function(n,g){return n+g.forms.length;},0);
  document.querySelectorAll('[data-fl-total]').forEach(function(el){el.textContent=total;});
})();
