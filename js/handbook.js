/* Module 11 practice handbook tools: brand look-up, switch planner, missed-dose advisor, co-existing conditions
   navigator, counselling scripts and scenario drill. Light card style (css: #m11 .hb-*), global select style.
   Facts cite the product SmPC on emc, SPS, NICE NG87 or GOV.UK; checked 28 Oct 2026. Where an SmPC is silent the
   advice is labelled "General principle" or "Practical judgement". Mounted by daybuilder.js (XP.registry). */
(function(){
  'use strict';
  var XP=window.XP; if(!XP) return;
  var esc=XP.esc, T=XP.t, BR=window.BRANDS||[], BY={};
  BR.forEach(function(b){ BY[b.id]=b; });
  XP.registry=XP.registry||{};
  function opt(v,l,sel){ return '<option value="'+esc(v)+'"'+(sel?' selected':'')+'>'+esc(l)+'</option>'; }
  /* One flat tool body: the lesson's closed dropdown (details.mx-tool) gives the title, so no inner card or kicker. */
  function card(intro,body,note){
    return '<div class="hb-tool">'+(intro?'<p class="hb-intro">'+intro+'</p>':'')+body+(note?'<p class="hb-note">'+note+'</p>':'')+'</div>';
  }
  function sel(label,cls,options){ return '<label class="hb-sel"><span>'+esc(label)+'</span><select class="'+cls+'">'+options+'</select></label>'; }
  var GRPNAME={tab:'Concerta XL-type tablets (SPS tablet group)',cap:'Ritalin XL-type capsules (SPS capsule group)',mk:'Medikinet XL (50:50)',eq:'Equasym XL (30:70)',ir:'Immediate-release methylphenidate',lis:'Lisdexamfetamine',dex:'Dexamfetamine',atx:'Atomoxetine',gua:'Guanfacine'};
  function brandOptions(selId,withNone){
    var h=withNone?opt('','None (one product only)',!selId):'', g=null;
    BR.forEach(function(b){ if(b.grp!==g){ if(g) h+='</optgroup>'; g=b.grp; h+='<optgroup label="'+esc(GRPNAME[g])+'">'; } h+=opt(b.id,b.name,b.id===selId); });
    return h+'</optgroup>';
  }
  function badge(o){ return '<span class="hb-badge hb-t-'+o.tone+'">'+esc(o.badge)+'</span>'; }

  /* ---------------- 1. Brand look-up with release-profile overlay ---------------- */
  var CX0=44, CX1=344, CY0=176, CY1=24, HMAX=16;
  var C_A='#0b6664', C_B='#c27c00', C_AX='#9aa9b8', C_GRID='#e3e9ef', C_TXT='#55626f';
  function curve(id){
    var b=BY[id]; if(!b||!b.model||!XP._unit) return null;
    var u=XP._unit(b.model); if(!u) return null;
    var dt=XP._pkDT, n=Math.round(HMAX/dt), p=0, i; for(i=0;i<=n;i++) if(u[i]>p) p=u[i];
    var pts=[], peaks=[]; for(i=0;i<=n;i++){ pts.push([i*dt,u[i]/p]); if(i>0&&i<n&&u[i]>u[i-1]&&u[i]>=u[i+1]) peaks.push([i*dt,u[i]/p]); }
    return {pts:pts,peaks:peaks};
  }
  var DUR={tab:12,cap:8,mk:8,eq:8,ir:4,lis:13};
  function chart(a,bid){
    var X=function(h){return CX0+(CX1-CX0)*h/HMAX;}, Y=function(v){return CY0-(CY0-CY1)*v/1.08;};
    var s='<rect x="0" y="0" width="360" height="236" fill="#fff"/>';
    for(var h=0;h<=HMAX;h+=2){ if(h) s+='<line x1="'+X(h)+'" y1="'+CY1+'" x2="'+X(h)+'" y2="'+CY0+'" stroke="'+C_GRID+'" stroke-dasharray="2 4"/>'; s+='<line x1="'+X(h)+'" y1="'+CY0+'" x2="'+X(h)+'" y2="'+(CY0+5)+'" stroke="'+C_AX+'"/>'+T(X(h),CY0+20,String(h),{anchor:'middle',size:14,fill:C_TXT}); }
    s+='<line x1="'+CX0+'" y1="'+CY0+'" x2="'+CX1+'" y2="'+CY0+'" stroke="'+C_AX+'"/><line x1="'+CX0+'" y1="'+CY1+'" x2="'+CX0+'" y2="'+CY0+'" stroke="'+C_AX+'"/>';
    s+=T((CX0+CX1)/2,CY0+42,'Hours after the morning dose',{anchor:'middle',size:14,fill:C_TXT});
    s+=T(20,(CY0+CY1)/2,'Relative level',{anchor:'middle',rot:-90,size:14,fill:C_TXT});
    function line(id,col,dash){
      var c=curve(id); if(!c) return '';
      var d=c.pts.map(function(q,i){return (i?'L':'M')+X(q[0]).toFixed(1)+','+Y(q[1]).toFixed(1);}).join('');
      var o='<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="3.2"'+(dash?' stroke-dasharray="7 5"':'')+' stroke-linecap="round"/>';
      c.peaks.forEach(function(pk){ o+='<line x1="'+X(pk[0]).toFixed(1)+'" y1="'+Y(pk[1]).toFixed(1)+'" x2="'+X(pk[0]).toFixed(1)+'" y2="'+CY0+'" stroke="'+col+'" stroke-width="1.5" stroke-dasharray="2 3" opacity=".7"/><circle cx="'+X(pk[0]).toFixed(1)+'" cy="'+Y(pk[1]).toFixed(1)+'" r="5" fill="#fff" stroke="'+col+'" stroke-width="2.5"/>'; });
      return o;
    }
    var A=BY[a], du=DUR[A.grp];
    if(du) s+='<rect x="'+X(0)+'" y="'+(CY0-8)+'" width="'+(X(du)-X(0))+'" height="6" rx="3" fill="#1d7a3e" opacity=".3"/>'+T(X(du)-4,CY0-13,'≈'+du+' h cover ('+(A.grp==='lis'?'SmPC':'SPS')+')',{size:13,fill:'#1d7a3e',anchor:'end'});
    s+=line(a,C_A,false)+(bid?line(bid,C_B,true):'');
    return '<svg class="hb-svg" viewBox="0 0 360 236" role="img" aria-label="Schematic release profile of '+esc(A.name)+(bid?' compared with '+esc(BY[bid].name):'')+', hours after dose against relative level">'+s+'</svg>';
  }
  function CAVEAT(id){
    if(id==='equasym') return ' Equasym XL: the SmPC reports two peaks of similar height (about 7.7 and 8.2 ng/ml at about 1.5 h and 4.5 h; SmPC 5.2). With a 30% immediate-release part this simple model draws the first peak lower: read the timings, not the heights.';
    if(id==='medikinetxl') return ' Medikinet XL: the SmPC gives a mean Tmax of 2.75 h and a 3–4 h plateau at or above 75% of peak (SmPC 5.2). The model keeps the plateau, so its highest point falls later (about 3.7 h): read the plateau, not the exact peak.';
    return ''; }
  function legal(b){ return ' <span class="hb-cd'+(b.cd.indexOf('Schedule 2')>=0?' hb-cd2':'')+'">'+esc(b.cd)+'</span>'; }
  function facts(b){
    var rows=[['How it releases',b.mech],['IR : MR',b.ratio],['Onset, peaks and duration',b.time],['Strengths',b.strengths],['Licence (SmPC 4.1, 4.2)',b.lic],['Food, swallowing and opening',b.admin],['Excipients to check',b.exc],['Can it be swapped?',b.inter]];
    return '<dl class="hb-dl">'+rows.map(function(r){return '<div><dt>'+esc(r[0])+'</dt><dd>'+r[1]+'</dd></div>';}).join('')+'</dl><p class="hb-note">Source: '+b.src.replace(/\.\s*$/,'')+'. Starting doses, steps and BNF limits: <a href="#m5">Module 5</a>.</p>';
  }
  XP.registry.brand=function(m){
    var S={a:'concerta',b:'ritalinxl'};
    m.innerHTML=card('Choose a product to see how it releases, how it is taken, what is in it, its licence and what it can be swapped with. Add a second product to overlay its release curve.',
      '<div class="hb-row">'+sel('Product','hb-a',brandOptions(S.a))+sel('Compare with','hb-b',brandOptions(S.b,true))+'</div>'
      +'<div class="hb-chart"></div><div class="hb-legend" aria-hidden="true"></div><div class="hb-facts" aria-live="polite"></div>',
      'The curves are a schematic teaching model fitted to the timings in each SmPC section 5.2 and the SPS durations. Each curve is scaled to its own peak, so compare <em>timing and shape</em>, not height or dose. Not pharmacokinetic data; responses vary from person to person (NG87 1.7.21).');
    var R=m.firstChild, sa=R.querySelector('.hb-a'), sb=R.querySelector('.hb-b');
    function render(){
      S.a=sa.value; S.b=sb.value&&sb.value!==S.a?sb.value:'';
      var A=BY[S.a], Bp=S.b?BY[S.b]:null, ch=R.querySelector('.hb-chart');
      if(!A.model) ch.innerHTML='<p class="hb-flat"><strong>'+esc(A.name)+':</strong> no daily release curve to draw. Its benefit was shown in trials lasting several weeks ('+(A.id==='gua'?'Intuniv SmPC 5.1':'atomoxetine SmPC 5.1')+'), so timing questions are about routine and side effects, not cover. That benefit is not tied to a daily peak is a general principle, not an SmPC statement.</p>'+(Bp&&Bp.model?chart(S.b,''):'');
      else ch.innerHTML=chart(S.a,Bp&&Bp.model?S.b:'');
      function pkTxt(id){ var c=curve(id); return c?c.peaks.map(function(q){return q[0].toFixed(1)+' h';}).join(' and '):''; }
      R.querySelector('.hb-legend').innerHTML=(A.model?'<span><i style="background:'+C_A+'"></i>'+esc(A.name)+': peaks at '+pkTxt(S.a)+'</span>':'')+(Bp&&Bp.model?'<span><i class="dash" style="border-color:'+C_B+'"></i>'+esc(Bp.name)+': peaks at '+pkTxt(S.b)+'</span>':'')+((A.model||(Bp&&Bp.model))?'<span class="hb-lnote">Peak times come from the teaching model; the SmPC timings are in the facts below.'+CAVEAT(S.a)+(Bp?CAVEAT(S.b):'')+'</span>':'');
      R.querySelector('.hb-facts').innerHTML='<h4 class="hb-h">'+esc(A.name)+legal(A)+'</h4>'+facts(A)+(Bp?'<details class="hb-cmp"><summary>Show '+esc(Bp.name)+' details</summary><h4 class="hb-h">'+esc(Bp.name)+legal(Bp)+'</h4>'+facts(Bp)+'</details>':'');
    }
    sa.addEventListener('change',render); sb.addEventListener('change',render); render();
  };

  /* ---------------- 2. Switch planner ---------------- */
  function plan(from,dose,freq,to){
    var F=BY[from], Tt=BY[to], out=[], tone='ok', badgeTxt='Plan', head='';
    var stim=function(b){return ['tab','cap','mk','eq','ir'].indexOf(b.grp)>=0;};
    var legal='<li><strong>Prescription:</strong> '+(Tt.cd.indexOf('Schedule 2')>=0?'if the prescription names a brand, a different brand or product cannot be supplied against it: the prescriber issues a new prescription. During supply problems SPS says prescribers can prescribe generically so that any product in the same bioequivalent group can be supplied (SPS, Aug 2025). Schedule 2 prescription rules still apply (Misuse of Drugs Regulations 2001).':'atomoxetine and guanfacine are prescription-only medicines (not controlled drugs), but changing medicine is still a prescriber decision.')+'</li>';
    var couns='<li><strong>Counsel on what changes:</strong> '+Tt.admin+'</li><li><strong>Follow up:</strong> ask the person to report any change in symptom control or side effects; check pulse, BP and sleep after the change, as after a dose change (NG87 1.8.9, 1.8.17).</li>';
    var matLic=(Tt.id==='matoride')?'<li><strong>Licence:</strong> Matoride XL is licensed for children 6 and over only, maximum 54 mg/day. Its SmPC says starting methylphenidate in adults is not appropriate, though treatment may continue into adulthood if it clearly helps (SmPC 4.1, 4.2).</li>':'';
    if(from===to){ return {tone:'info',badge:'Same product',head:'No switch needed',html:'<p>Choose a different target product.</p>'}; }
    if(!stim(F)||!stim(Tt)){
      tone='high'; badgeTxt='New medicine'; head='Different medicine: there is no dose conversion';
      out.push('<li><strong>No conversion factor exists.</strong> None of the SmPCs gives a dose conversion between methylphenidate, lisdexamfetamine, dexamfetamine, atomoxetine and guanfacine. Start the new medicine at its own licensed starting dose and titrate: '+Tt.dose+'</li>');
      out.push('<li><strong>Who decides:</strong> switching medicine follows the NICE order and is a specialist decision. Examples: methylphenidate to lisdexamfetamine after a 6-week trial at an adequate dose without enough benefit (NG87 1.7.8, 1.7.12), or the reverse in adults (1.7.13); atomoxetine or guanfacine in children (1.7.10), or atomoxetine in adults (1.7.15), if stimulants are not tolerated or separate 6-week trials of both have not helped.</li>');
      if(F.id==='gua') out.push('<li><strong>Stopping guanfacine:</strong> taper by no more than 1 mg every 3–7 days, checking BP and pulse: rebound high blood pressure (Intuniv SmPC 4.2, 4.4).</li>');
      if(F.id==='dex') out.push('<li><strong>Stopping dexamfetamine:</strong> reduce gradually with careful monitoring (SmPC 4.2), and supervise withdrawal (SmPC 4.4).</li>');
      if(Tt.id==='atx'||Tt.id==='gua') out.push('<li><strong>Expect a lag:</strong> '+(Tt.id==='atx'?'atomoxetine':'guanfacine')+' takes weeks to work, so the specialist plans any overlap or cross-taper. The SmPCs give no cross-taper schedule.'+PJ+'</li>');
      out.push(matLic); out.push(legal); out.push(couns);
      return {tone:tone,badge:badgeTxt,head:head,html:'<ul>'+out.join('')+'</ul>'};
    }
    var total=F.grp==='ir'?dose*freq:dose;
    var adultMax=(Tt.id==='matoride')?54:72;
    if(F.grp==='ir'&&Tt.grp==='ir'){
      badgeTxt='IR to IR'; head='Same dose: both are immediate-release methylphenidate';
      out.push('<li>Both are immediate-release methylphenidate tablets taken 2–3 times a day. SPS bioequivalence groups cover modified-release products only; switching mg for mg is the usual approach, not a stated SmPC rule.'+GP+' Ritalin comes as 10 mg scored tablets; Medikinet tablets as 5, 10 and 20 mg.</li>');
      if(Tt.id==='medikinetir') out.push('<li><strong>Licence:</strong> Medikinet tablets are licensed for children only; "not licensed for use in adults with ADHD" (SmPC 4.1). Ritalin tablets are licensed in adults too.</li>');
    } else if(F.grp===Tt.grp && (F.grp==='tab'||F.grp==='cap')){
      badgeTxt='Bioequivalent'; head='Same dose and quantity ('+total+' mg)';
      out.push('<li><strong>'+esc(F.name)+' → '+esc(Tt.name)+':</strong> both are in the same SPS bioequivalence group, so switch at the same dose and quantity if a switch is necessary. Do not mix brands to make up one daily dose (SPS).</li>');
      var osm=function(b){ return ['concerta','affenid','atenza','matoride'].indexOf(b.id)>=0; };
      if(F.grp==='tab'&&osm(F)!==osm(Tt)) out.push('<li><strong>The tablet changes:</strong> osmotic tablets (Concerta XL, Affenid XL, Atenza XL, Matoride XL) can leave an empty shell in the stool; the Xaggitin XL, Delmosart and Xenidate XL SmPCs describe no shell. Warn the person so the change is not mistaken for a problem.</li>');
      if(Tt.id==='matoride'&&(total%18!==0||total>54)) out.push('<li><strong>Strength check:</strong> Matoride XL comes as 18, 36 and 54 mg tablets only, with a maximum of 54 mg/day; '+total+' mg cannot be given with it (SmPC 4.2). Stay on a brand that has the strength, or ask the prescriber.</li>');
      else out.push(matLic);
      if(F.grp==='tab'&&(Tt.id==='xenidate'||F.id==='xenidate')) out.push('<li><strong>Excipients change:</strong> Xenidate XL contains sucrose instead of lactose (SmPC 2, 4.4).</li>');
    } else if(Tt.grp==='eq'||F.grp==='eq'){
      tone='danger'; badgeTxt='Avoid'; head='Equasym XL has no bioequivalent product';
      out.push('<li><strong>SPS:</strong> no other modified-release product is bioequivalent to Equasym XL, so it should not be switched or prescribed generically. If supply forces a change, the specialist plans it for that person.</li>');
      out.push('<li><strong>Anchor through IR:</strong> Equasym XL 10 mg ≈ 10 mg/day IR methylphenidate (SPS); Equasym XL 20 mg replaces 10 mg IR at breakfast plus 10 mg at lunch (SmPC 4.2). The specialist chooses the starting dose of any new product.</li>');
      out.push('<li><strong>Different profile:</strong> 30:70, peaks at about 1.5 h and 4.5 h, taken before breakfast; licensed for children only (SmPC 4.1, 4.2, 5.2).</li>');
    } else if(F.grp==='ir'&&Tt.grp==='tab'){
      if(freq===3&&[5,10,15,20].indexOf(dose)>=0){ var mm={5:18,10:36,15:54,20:72}[dose]; head=dose+' mg three times daily → '+mm+' mg once daily'; badgeTxt='SmPC table';
        out.push('<li><strong>SmPC Table 1</strong> (Concerta XL and the bioequivalent tablets): '+dose+' mg methylphenidate three times daily → '+mm+' mg once daily.</li>');
        if(mm>54) out.push('<li><strong>Licence:</strong> '+mm+' mg is above the children\'s maximum of 54 mg/day; '+(adultMax===72?'adults only (maximum 72 mg/day) (SmPC 4.2).':'Matoride XL is licensed to 54 mg/day only (SmPC 4.2).')+'</li>');
      } else { tone='warn'; badgeTxt='Judgement'; head='No SmPC conversion for this regimen';
        out.push('<li>The SmPC table covers 5, 10, 15 or 20 mg three times daily only. For '+dose+' mg '+(freq===2?'twice':'three times')+' daily ('+total+' mg/day) the specialist chooses the starting dose. For reference only, SPS gives Concerta XL 18 mg ≈ 15 mg/day IR.</li>'); }
      out.push('<li><strong>The profile changes:</strong> one dose now covers about 12 h, with a slower start (22–25% released straight away, depending on brand) (SmPC 5.2; SPS).</li>');
      out.push(matLic);
    } else if(F.grp==='ir'&&(Tt.grp==='cap'||Tt.grp==='mk')){
      if(freq===2||Tt.grp==='mk'){ badgeTxt='SmPC'; head=total+' mg/day IR → '+total+' mg once daily';
        out.push('<li>'+(Tt.grp==='mk'?'Medikinet XL SmPC 4.2: switch to the milligram-equivalent daily dose.':'Ritalin XL SmPC 4.2 Table 1: the once-daily dose equals the total daily IR dose given twice daily (for example 10 mg twice daily → 20 mg once daily).')+' Children maximum 60 mg/day; adults 80 mg/day.</li>');
        if(freq===3&&Tt.grp==='mk') out.push('<li><strong>Note:</strong> a three-times-daily IR regimen covers a longer day than an 8-hour capsule. Whether a small late IR dose is added is a prescriber decision (Medikinet XL SmPC 4.2; NG87 1.7.22).</li>');
      } else { tone='warn'; badgeTxt='Judgement'; head='Three times daily: no direct SmPC conversion'; out.push('<li>The capsule SmPC tables convert twice-daily IR regimens. A three-times-daily total of '+total+' mg/day may not be covered by an 8-hour capsule: specialist judgement.</li>'); }
      if(total>60) out.push('<li><strong>Licence:</strong> above the children\'s maximum of 60 mg/day (adults maximum 80 mg/day).</li>');
    } else if(Tt.grp==='ir'){
      tone='warn'; badgeTxt='Specialist'; head='MR → IR: the specialist sets the dose';
      out.push('<li><strong>SPS reference points (not a conversion table):</strong> Concerta XL 18 mg once daily ≈ 15 mg/day IR; Medikinet XL 10 mg, Metyrol XL 10 mg and Equasym XL 10 mg ≈ 10 mg/day IR.'+(F.grp==='cap'?' Metyrol XL is in the same SPS capsule group as '+esc(F.name)+'.':'')+' The specialist chooses the IR dose and how to split it.</li>');
      out.push('<li><strong>SPS:</strong> seek advice or refer back to the initiating specialist first; extra clinical assessment is needed. IR products carry a higher risk of misuse and diversion (NG87 1.7.24).</li>');
    } else {
      tone='warn'; badgeTxt=(Tt.grp==='mk'||F.grp==='mk')?'Particular care':'Not bioequivalent'; head='Different release profile: specialist decision';
      var mkcap=(F.grp==='mk'&&Tt.grp==='cap')||(F.grp==='cap'&&Tt.grp==='mk');
      out.push('<li><strong>'+GRPNAME[F.grp]+' → '+GRPNAME[Tt.grp]+':</strong> '+(mkcap?'switches between Medikinet XL and the Ritalin XL-type capsules are possible but need particular care, because Medikinet XL is not fully bioequivalent with them (SPS).':(F.grp==='mk'||Tt.grp==='mk')?'Medikinet XL is not in an SPS bioequivalence group; any switch needs particular care (SPS).':'these groups are not bioequivalent (SPS).')+'</li>');
      out.push('<li><strong>No SmPC or SPS dose conversion</strong> exists between these groups. For reference only, SPS relates each to IR methylphenidate (Concerta XL 18 mg ≈ 15 mg/day; Medikinet XL, Metyrol XL and Equasym XL 10 mg ≈ 10 mg/day). The specialist chooses the starting dose of the new product and titrates.</li>');
      var PK2={tab:'6–8 h',cap:'5–7 h',mk:'3–4 h',eq:'4.5 h'};
      out.push(DUR[F.grp]===DUR[Tt.grp]?'<li><strong>Timing changes:</strong> cover is similar (about '+DUR[F.grp]+' h), but the second peak moves from '+PK2[F.grp]+' to '+PK2[Tt.grp]+' after the dose (SmPC 5.2; SPS)'+(Tt.grp==='mk'?', and Medikinet XL must be taken with or after food':'')+'.</li>':'<li><strong>Cover changes:</strong> about '+DUR[F.grp]+' h → about '+DUR[Tt.grp]+' h (SPS), so the late-afternoon picture will change.</li>');
      out.push(matLic);
    }
    out.push(legal); out.push(couns);
    return {tone:tone,badge:badgeTxt,head:head,html:'<ul>'+out.join('')+'</ul>'};
  }
  XP.registry.switcher=function(m){
    m.innerHTML=card('Choose the current product and dose, then the product you are considering. The planner applies the SmPC conversion tables and the SPS bioequivalence groups, and says plainly when there is <em>no</em> conversion.',
      '<div class="hb-row">'+sel('Current product','sw-f',brandOptions('ritalin'))+sel('Dose','sw-d','')+'<label class="hb-sel sw-fq-l"><span>Times a day</span><select class="sw-fq">'+opt('2','Twice daily',false)+opt('3','Three times daily',true)+'</select></label>'+sel('Switch to','sw-t',brandOptions('concerta'))+'</div>'
      +'<div class="hb-state" aria-live="polite"><span class="hb-bslot"></span><h4 class="hb-head"></h4></div><div class="hb-text sw-out"></div>',
      'A teaching aid, not a prescribing tool. Every change of a Schedule 2 product needs a new prescription, a counselling conversation and follow-up.');
    var R=m.firstChild, f=R.querySelector('.sw-f'), d=R.querySelector('.sw-d'), fq=R.querySelector('.sw-fq'), t=R.querySelector('.sw-t');
    function doses(){
      var b=BY[f.value], list;
      if(b.grp==='ir') list=[5,10,15,20,30];
      else { list=(b.strengths.replace(/\([^)]*\)/g,'').match(/\d+(?:\.\d+)?/g)||[]).map(Number).filter(function(x){return x>=1;});
        if(b.grp==='tab'&&b.id!=='matoride') list=list.concat([72]); if(b.grp==='cap'||b.grp==='mk'||b.grp==='eq') list=list.concat([60]); }
      list=list.filter(function(x,i,a){return a.indexOf(x)===i;}).sort(function(a,b){return a-b;});
      var cur=+d.value; d.innerHTML=list.map(function(x){return opt(x,x+' mg'+(b.grp==='ir'?' per dose':' a day'),x===cur);}).join('');
      if(list.indexOf(cur)<0) d.value=String(list[Math.min(1,list.length-1)]);
      R.querySelector('.sw-fq-l').hidden=b.grp!=='ir';
    }
    function render(){ var o=plan(f.value,+d.value,+fq.value,t.value); R.querySelector('.hb-bslot').innerHTML=badge(o); R.querySelector('.hb-head').innerHTML=o.head; R.querySelector('.sw-out').innerHTML=o.html; }
    f.addEventListener('change',function(){ doses(); render(); }); [d,fq,t].forEach(function(e){ e.addEventListener('change',render); });
    doses(); d.value='10'; render();
  };
  XP._plan=plan;

  /* ---------------- 3. Missed-dose and timing advisor ---------------- */
  /* Each product cites only its own SmPC. Where the SmPC is silent, advice is labelled "General principle" or "Practical judgement". */
  var MD=[
    {id:'rxl',l:'Ritalin XL, Metyrol XL, Meflynate XL, Focusim XL (50:50 capsules)'},
    {id:'mk',l:'Medikinet XL'},
    {id:'eq',l:'Equasym XL'},
    {id:'tab',l:'Concerta XL and the bioequivalent tablets'},
    {id:'ir',l:'Methylphenidate IR (Ritalin, Medikinet tablets)'},
    {id:'lis',l:'Lisdexamfetamine (Elvanse)'},{id:'dex',l:'Dexamfetamine'},{id:'atx',l:'Atomoxetine'},{id:'gua',l:'Guanfacine (Intuniv)'}];
  var WHEN=[{v:'early',l:'Within an hour or two of the usual time'},{v:'late',l:'Late morning or around lunch'},{v:'aft',l:'Afternoon or evening'},{v:'two',l:'Two or more days missed in a row'}];
  var PJ=' <span class="hb-tag">Practical judgement</span>', GP=' <span class="hb-tag">General principle</span>';
  var NODOUBLE='<li><strong>Do not take two doses</strong> to make up for a missed one.'+GP+'</li>';
  var MPH_RESTART='<li><strong>After several missed days:</strong> SPS says that after short breaks (up to 2 weeks) methylphenidate can be restarted at the same dose if appropriate; ask the specialist after longer breaks.</li>';
  var NOCONT=' The Medikinet XL, Meflynate XL and Metyrol XL SmPCs add that the long-acting product should not be continued if an extra late IR dose is needed, unless the same extra dose was also needed on the IR regimen.';
  function rebound(src){ return '<li><strong>If symptoms come back as the dose wears off:</strong> check dose time and food first. '+src+' Any extra IR dose is a prescriber decision, weighed against sleep (NG87 1.7.22, 1.8.17).</li>'; }
  function missed(p,w){
    var a=[], tone='ok', head='', badgeTxt='SmPC';
    if(p==='rxl'){
      a.push('<li><strong>Ritalin XL, Metyrol XL and Focusim XL SmPC 4.2:</strong> <em>"The patient should not take a double dose to make up for a forgotten dose. If a dose is forgotten, the patient should wait until it is time for the next dose."</em> The Meflynate XL SmPC has no forgotten-dose sentence; it says not too late in the morning (sleep). Ritalin XL and Metyrol XL: not too late in the day.</li>');
      if(w==='two'){ head='Restart at the usual dose'; tone='info'; badgeTxt='SPS'; a.length=0; a.push(MPH_RESTART); }
      else if(w==='early'){ head='SmPC: wait for the next dose'; tone='warn';
        a.push('<li>Taking a slightly late morning dose (within an hour or two) instead is a practical judgement, not the SmPC rule; agree it with the prescriber in advance.'+PJ+'</li>'); }
      else { head='Skip it; take the next dose as usual tomorrow'; tone='warn'; a.push('<li>Cover lasts about 8 h (SPS); a dose taken at lunchtime or later would act into the evening and may disturb sleep.</li>'); }
      if(w!=='two') a.push(rebound('All four SmPCs say a small IR methylphenidate dose late in the day may help if behaviour or sleep problems come back as the effect wears off (Ritalin XL, Metyrol XL and Focusim XL suggest 5 mg).'+NOCONT));
    }
    else if(p==='mk'||p==='eq'||p==='tab'){
      var dur=p==='tab'?12:8;
      var smpc={mk:'Medikinet XL SmPC 4.2 has no forgotten-dose sentence. Children should not take it too late in the morning (sleep), and it must be taken with or after food (adults: morning and lunchtime, with or after meals).',
                eq:'Equasym XL SmPC 4.2 has no forgotten-dose sentence. It is taken in the morning before breakfast, and not too late in the morning (sleep).',
                tab:'The Concerta XL SmPC has no forgotten-dose sentence. It is taken once daily in the morning.'}[p];
      a.push('<li>'+smpc+'</li>');
      if(w==='two'){ head='Restart at the usual dose'; tone='info'; badgeTxt='SPS'; a.length=0; a.push(MPH_RESTART); }
      else if(w==='early'){ head='Usually take it now'; badgeTxt='Judgement'; a.push('<li>A short delay moves the cover (about '+dur+' h; SPS) later by the same amount.'+PJ+(p==='mk'?' Take it with food.':'')+'</li>'); a.push(NODOUBLE); }
      else if(w==='late'){ tone='warn'; head='Ask about sleep before deciding; often skip'; badgeTxt='Judgement'; a.push('<li>Cover lasts about '+dur+' h (SPS), so a dose at 12:00 would act until about '+(12+dur)+':00. '+(p==='tab'?'For a 12-hour tablet this usually means skipping today.':'Taking it now pushes cover into the evening.')+' Agree a cut-off time with the prescriber in advance.'+PJ+'</li>'); a.push(NODOUBLE); }
      else { tone='warn'; head='Skip today; usual dose tomorrow morning'; badgeTxt='Judgement'; a.push('<li>An afternoon dose of a long-acting product would act into the night (about '+dur+' h; SPS) and disturb sleep.'+PJ+'</li>'); a.push(NODOUBLE); }
      if(w!=='two') a.push(rebound(p==='mk'?'Medikinet XL SmPC 4.2: a small dose (5 mg) of IR methylphenidate late in the day may help.'+NOCONT:p==='eq'?'Equasym XL SmPC 4.2: a small dose of IR methylphenidate late in the day may help.':'The Concerta XL SmPC does not mention IR top-ups; NICE allows MR in the morning with IR later in the day (NG87 1.7.22).'));
    }
    else if(p==='ir'){
      a.push('<li><strong>Ritalin SmPC 4.2:</strong> <em>"The patient should not take a double dose to make up for a forgotten dose. If a dose is forgotten, the patient should wait until it is time for the next dose."</em> Ritalin and Medikinet tablet SmPCs 4.2: the last dose should, in general, not be given within 4 hours before bedtime.</li>');
      if(w==='two'){ head='Restart at the usual dose'; tone='info'; badgeTxt='SPS'; a.length=0; a.push(MPH_RESTART); }
      else if(w==='early'){ head='Ritalin SmPC: wait for the next dose'; tone='warn'; a.push('<li>If the next dose is hours away and bedtime is well over 4 h off, taking the missed dose late is a practical judgement for the prescriber to agree; never combine it with the next dose.'+PJ+'</li>'); }
      else if(w==='late'){ head='Skip it; take the next dose at its usual time'; tone='warn'; a.push('<li>An IR dose lasts about 4 h (SPS); a late-morning dose close to the lunchtime dose would stack the two.</li>'); }
      else { head='Skip it'; tone='warn'; a.push('<li>An afternoon or evening dose risks falling within 4 hours of bedtime and disturbing sleep (Ritalin, Medikinet SmPC 4.2).</li>'); }
    }
    else if(p==='lis'){
      a.push('<li><strong>Elvanse SmPC 4.2:</strong> <em>"In the event of a missed dose, Elvanse dosing can resume the next day."</em> Afternoon doses should be avoided because of the potential for insomnia.</li>');
      if(w==='two'){ head='Resume the usual dose'; badgeTxt='SmPC'; a.push('<li>The SmPC gives no separate rule for several missed days. For long gaps, ask the prescriber how to restart.'+GP+'</li>'); }
      else if(w==='early'){ head='Take it now if it is still morning'; badgeTxt='Judgement'; a.push('<li>Taking it within the morning keeps it a once-daily morning dose; a practical judgement, not an SmPC rule.'+PJ+'</li>'); }
      else { head='Skip today; resume tomorrow morning'; tone='warn'; }
      if(w!=='two') a.push(NODOUBLE);
    }
    else if(p==='dex'){
      a.push('<li><strong>Dexamfetamine SmPC 4.2:</strong> doses should not be taken too late after lunchtime, to avoid disturbing sleep. The SmPC gives no missed-dose rule.</li>');
      if(w==='two'){ head='Ask the prescriber how to restart'; tone='info'; badgeTxt='General principle'; a.push('<li>No SmPC rule for restarting after missed days.'+GP+'</li>'); }
      else if(w==='aft'){ head='Skip it'; tone='warn'; }
      else { head='Take it if it will not be too late after lunch'; badgeTxt='Judgement'; a.push('<li>Whether a missed morning or lunchtime dose can still be taken depends on how close it is to the next dose and to the afternoon.'+PJ+'</li>'); }
      a.push(NODOUBLE);
    }
    else if(p==='atx'){
      head='No SmPC rule: take it when remembered, never double'; tone='info'; badgeTxt='Leaflet';
      a.push('<li>The atomoxetine SmPC gives no missed-dose advice. The patient leaflet says to take a missed dose as soon as possible and not to take a double dose. Benefit does not depend on a daily peak.</li>');
      if(w==='aft') a.push('<li>A once-daily morning dose remembered in the evening may cause sleepiness or upset stomach that night; if in doubt, skip and carry on tomorrow.'+PJ+'</li>');
      if(w==='two') a.push('<li>For longer gaps, ask the prescriber how to restart.'+GP+'</li>');
    }
    else if(p==='gua'){
      if(w==='two'){ tone='high'; badgeTxt='Act'; head='Two or more doses missed: re-titrate'; a.push('<li><strong>Intuniv SmPC 4.2:</strong> if two or more consecutive doses are missed, <strong>re-titration is recommended</strong> based on the patient\'s tolerability. Contact the prescriber.</li><li>Blood pressure and pulse may rise after guanfacine is stopped (SmPC 4.4): check them.</li>'); }
      else { head='Resume the usual dose the next day'; a.push('<li><strong>Intuniv SmPC 4.2:</strong> if a dose is missed, the prescribed dose can resume the next day.</li>'); a.push(NODOUBLE); }
    }
    return {tone:tone,head:head,badge:badgeTxt,html:'<ul>'+a.join('')+'</ul>'};
  }
  XP._missed=missed; XP._MD=MD; XP._WHEN=WHEN;
  XP.registry.missed=function(m){
    m.innerHTML=card('Pick the medicine and when the dose was remembered. The advice quotes the SmPC where it gives a rule, and says plainly where it does not.',
      '<div class="hb-row">'+sel('Medicine','md-p',MD.map(function(x,i){return opt(x.id,x.l,i===0);}).join(''))+sel('Remembered','md-w',WHEN.map(function(x,i){return opt(x.v,x.l,i===1);}).join(''))+'</div>'
      +'<div class="hb-state" aria-live="polite"><span class="hb-bslot"></span><h4 class="hb-head"></h4></div><div class="hb-text md-out"></div>',
      'Each line cites the SmPC of that product only. Where the SmPC is silent, advice is labelled <em>General principle</em> or <em>Practical judgement</em>. Agree individual cut-off times with the prescriber in advance.');
    var R=m.firstChild, p=R.querySelector('.md-p'), w=R.querySelector('.md-w');
    function render(){ var o=missed(p.value,w.value); R.querySelector('.hb-bslot').innerHTML=badge(o); R.querySelector('.hb-head').innerHTML=o.head; R.querySelector('.md-out').innerHTML=o.html; }
    p.addEventListener('change',render); w.addEventListener('change',render); render();
  };

  /* ---------------- 4. Co-existing conditions navigator ---------------- */
  var CO={
    tics:{l:'Tics or Tourette syndrome',ng:'Same medicine choices as anyone with ADHD (1.7.18), with slower titration and more monitoring (1.7.28). If tics appear on a stimulant, decide whether they are related (tics naturally wax and wane) and whether their impairment outweighs the benefit (1.8.13). If related: reduce the stimulant dose, or consider guanfacine (children 5+ and young people), atomoxetine, clonidine (under 18s only after tertiary advice) or stopping (1.8.14).',
      smpc:'Methylphenidate (Concerta XL SmPC 4.4): can start or worsen motor and vocal tics and Tourette syndrome; check family history and look for tics before starting, then at every dose change and at least every 6 months. Atomoxetine SmPC 4.4: in a controlled study in children with chronic tics or Tourette syndrome it did not worsen tics compared with placebo. Dexamfetamine (Amfexa SmPC 4.3): Tourette syndrome is a contraindication.',
      ph:'Ask about tics at every review. A new or worse tic is a reason to contact the prescriber and keep a simple tic diary, not to stop suddenly.'},
    epi:{l:'Epilepsy',ng:'Epilepsy is a group with higher ADHD prevalence (1.2.1). Same medicine choices, slower titration (1.7.28). New or worse seizures: review the ADHD medicine and stop any that might be contributing; after investigation, cautiously reintroduce it if it is unlikely to be the cause (1.8.16).',
      smpc:'Methylphenidate SmPC 4.4: use with caution; stop if seizures become more frequent or start for the first time. Atomoxetine SmPC 4.4: introduce with caution if there is a history of seizures; consider stopping if a seizure develops. Interactions: methylphenidate may raise phenytoin, phenobarbital and primidone levels (Concerta XL SmPC 4.5); guanfacine may raise valproate levels (Intuniv SmPC 4.5).',
      ph:'Ask about seizure frequency at every review, and check anticonvulsant levels or clinical response when methylphenidate or guanfacine is started or stopped.'},
    anx:{l:'Anxiety',ng:'Offer the same medicine choices (1.7.18), with slower titration and closer monitoring (1.7.28).',
      smpc:'Methylphenidate SmPC 4.4: anxiety, agitation and tension have been reported and pre-existing anxiety may get worse. Atomoxetine SmPC 4.4: in two controlled studies it did not worsen anxiety compared with placebo, but watch for new or worse anxiety.',
      ph:'Tell apart a "wired" feeling at peak time (dose or timing) from a background anxiety disorder; review caffeine and energy drinks; severe agitation needs same-day review.'},
    asd:{l:'Autism',ng:'Same medicine choices (1.7.18), with slower titration and more frequent monitoring (1.7.28). Autism is not a reason to exclude an ADHD diagnosis (1.3.3).',
      smpc:'No autism-specific SmPC dosing; apply the usual precautions (tics, anxiety, appetite, sleep).',
      ph:'Make changes in small steps with a written or visual plan. If swallowing or textures are a problem, consider bead capsules that can be opened onto soft food, or Elvanse mixed into yoghurt, water or orange juice (lesson 1).'},
    sub:{l:'Substance misuse or diversion risk',ng:'Be cautious about stimulants if they may be diverted for study or appetite suppression (1.7.23). Do not offer IR stimulants, or MR stimulants that can easily be injected or snorted, if there is a risk of misuse or diversion (1.7.24). Watch for changes in risk with age and circumstances (1.8.19).',
      smpc:'All stimulant SmPCs (4.4) warn of misuse, dependence and diversion. Dexamfetamine (Amfexa SmPC 4.3): a history of drug or alcohol abuse is a contraindication. Atomoxetine and guanfacine are not controlled drugs.',
      ph:'Watch collection patterns, early requests and "lost" prescriptions; supply in instalments only as prescribed; never supply early without the prescriber. Escalate concerns to the prescriber and, under local policy, the CD accountable officer.'},
    eat:{l:'Eating disorders',ng:'Diversion for appetite suppression is a NICE caution (1.7.23). Monitor weight (1.8.5) and use the 1.8.6 strategies if weight loss is a concern. Eating disorder is on the slower-titration list (1.7.28).',
      smpc:'Methylphenidate and dexamfetamine SmPCs list a diagnosis or history of anorexia nervosa as a contraindication (4.3). The Elvanse SmPC 4.3 does not list it, but loss of appetite is very common (4.8).',
      ph:'A new eating-disorder diagnosis on a stimulant is a reason to contact the prescriber before the next supply.'},
    mood:{l:'Depression, suicidality, bipolar disorder or psychosis',ng:'In an acute psychotic or manic episode, stop ADHD medication and consider restarting after it has resolved (1.7.19). If behaviour worsens, adjust medication and review the diagnosis (1.8.18).',
      smpc:'Methylphenidate and dexamfetamine SmPC 4.3: a diagnosis or history of severe depression, suicidal ideation, psychotic symptoms or severe mood disorders is a contraindication. Elvanse SmPC 4.3: agitated states. Atomoxetine SmPC 4.4: suicide-related behaviour has been reported; monitor and warn the family.',
      ph:'Same-day contact with the prescriber for suicidal thoughts, mania or psychotic symptoms.'},
    cv:{l:'Heart disease or high blood pressure',ng:'Check pulse and BP before and after each dose change and every 6 months (1.8.9). Sustained resting pulse over 120, arrhythmia or systolic BP above the 95th centile (or a clinically significant rise) on 2 occasions: reduce the dose and refer (1.8.11). No routine ECG unless clinically indicated (1.8.10). Cardiac disease is on the slower-titration list (1.7.28).',
      smpc:'Stimulant SmPCs 4.3 list cardiovascular contraindications (for example Elvanse: symptomatic cardiovascular disease, advanced arteriosclerosis, moderate to severe hypertension). Atomoxetine: severe cardiovascular or cerebrovascular disorders are contraindicated (4.3). Guanfacine lowers BP and pulse; taper to stop (4.2, 4.4).',
      ph:'Check BP and pulse when asked and refer sustained abnormal readings; advise against decongestant cold remedies with stimulants or atomoxetine (Module 7).'}
  };
  XP.registry.comorb=function(m){
    var keys=Object.keys(CO);
    m.innerHTML=card('Tap a condition. Each panel separates what NICE recommends, what the SmPC warns and what you do in practice, so you can see where each piece of advice comes from.',
      '<div class="hb-chips co-chips" role="group" aria-label="Condition">'+keys.map(function(k,i){return '<button type="button" class="hb-chip" data-k="'+k+'" aria-pressed="'+(i===0)+'">'+esc(CO[k].l)+'</button>';}).join('')+'</div><div class="co-out" aria-live="polite"></div>',
      'NICE references are to NG87 (live text checked Oct 2026). SmPC statements come from the products in lesson 1.');
    var R=m.firstChild;
    function show(k){ var c=CO[k]; R.querySelectorAll('.co-chips .hb-chip').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.k===k));});
      R.querySelector('.co-out').innerHTML='<div class="hb-boxes"><div class="hb-box hb-b-nice"><h5>NICE NG87</h5><div>'+c.ng+'</div></div><div class="hb-box hb-b-smpc"><h5>SmPC</h5><div>'+c.smpc+'</div></div><div class="hb-box hb-b-act"><h5>In practice</h5><div>'+c.ph+'</div></div></div>'; }
    R.querySelector('.co-chips').addEventListener('click',function(e){ var b=e.target.closest('.hb-chip'); if(b) show(b.dataset.k); });
    show(keys[0]);
  };

  /* ---------------- 5. Counselling scripts ---------------- */
  var SC={
    first:{l:'First supply of a long-acting stimulant',steps:[
      ['Open','"I\'m the pharmacist. Can I take five minutes to go through your new medicine? What has the specialist told you it is for?"'],
      ['What and why','"This is [brand], a long-acting form of methylphenidate. It should help with concentration and impulsivity during the day. Many people notice an effect on the first day; the dose is then adjusted step by step, usually each week."'],
      ['How to take it','Brand-specific. Concerta XL-type tablets: "Swallow it whole with water every morning, with or without food. Don\'t chew or crush it. You may see the empty tablet shell in your stool; that\'s normal." Medikinet XL: "Take it with or after breakfast; on an empty stomach it can release too fast." Equasym XL: "Take it before breakfast." Bead capsules: "If swallowing is hard, open it, sprinkle the beads on a spoonful of soft food such as apple sauce, and swallow straight away without chewing." (Each SmPC 4.2.)'],
      ['Side effects','"Common ones are a smaller appetite at lunch, trouble getting to sleep, headache and tummy ache. Eat a good breakfast and a bigger evening meal. Contact us or the clinic the same day about chest pain, fainting, a racing heart, new tics, mood changes or strange thoughts."'],
      ['Safety and law','"It\'s a controlled drug: keep it locked away and out of children\'s reach, and never share it: giving it to someone else is an offence. Avoid alcohol and cold remedies with decongestants such as pseudoephedrine."'],
      ['Practical','"Order your next prescription about a week before you run out: a prescription for this controlled drug is valid for only 28 days, and we can\'t give an emergency supply without one. You must tell the DVLA if your ADHD or your medicine affects your ability to drive safely; if it doesn\'t, you don\'t need to tell them." (GOV.UK)'],
      ['Check understanding','"Can you tell me how and when you\'ll take it, and what you\'d do if you felt your heart racing?"']]},
    switch:{l:'Brand switch during a shortage',steps:[
      ['Explain','"Your usual [brand] is out of stock nationally. The prescriber has issued [new brand], which is bioequivalent: it gives the same blood levels of the same medicine at the same dose." (Only within an SPS group.)'],
      ['What looks different','"The tablet looks different [colour, shape]. Some tablets leave an empty shell in the stool; this one may not." Or: "This one is a capsule you can open."'],
      ['What to watch','"Most people notice no change. If your focus, sleep or appetite changes, or it wears off at a different time, tell us or the clinic."'],
      ['Going back','"When your usual brand is available again, the prescriber can switch you back. Please don\'t mix the two brands in one day."']]},
    sideeffects:{l:'Appetite, sleep and growth worries',steps:[
      ['Listen','"Tell me what a typical day of meals and bedtime looks like now."'],
      ['Appetite','"Take the dose with or after breakfast where your product allows (Equasym XL is the exception: it is taken before breakfast), offer high-calorie snacks, and plan a bigger meal in the evening when the effect has worn off." (NG87 1.8.6)'],
      ['Sleep','"When is the last dose? A sleep diary for two weeks helps the clinic adjust the timing." (NG87 1.8.17)'],
      ['Growth','"Height is checked every 6 months and plotted on a growth chart. If growth slows, the specialist may suggest a break over the school holidays." (NG87 1.8.5, 1.8.7)']]},
    travel:{l:'Travelling abroad',steps:[
      ['Plan','"Check the rules of the country you\'re going to with its embassy before you travel. Other countries have their own laws, and travelling with a medicine that is illegal there can mean a fine or prison." (GOV.UK)'],
      ['Carry','"Carry it with you in your hand luggage, in its labelled pack, with a letter from your prescriber: your name, the medicine, the dose, and that you have no more than 3 months\' supply." (GOV.UK)'],
      ['Quantity','"Prescriptions for this medicine usually cover up to 30 days. Taking more than 3 months\' supply out of the UK needs a Home Office personal licence; apply at least a month before you travel, so plan long stays with your prescriber early." (GOV.UK; NICE NG46)'],
      ['Time zones','"Keep the dose in your new morning, and avoid taking a long-acting dose late in your new day."']]},
    atx:{l:'Starting atomoxetine',steps:[
      ['Expectations','"This isn\'t a stimulant. It builds up over several weeks, so don\'t stop it early because you see no change in the first week."'],
      ['How','"Once a day in the morning, or split into a morning and a late-afternoon dose if it upsets your stomach or makes you sleepy. With or without food. Don\'t open the capsules: the powder irritates the eyes." (SmPC 4.2, 6.6)'],
      ['Warnings','"Tell us or your doctor straight away about yellowing of the skin or eyes, dark urine or other signs of liver problems, or any thoughts of harming yourself." (SmPC 4.4)'],
      ['Interactions','"Tell every prescriber you take it: some antidepressants, such as fluoxetine and paroxetine, raise its level a lot." (SmPC 4.5)']]},
    adult:{l:'Moving to adult services at 18',steps:[
      ['Explain','"Your care is moving from the children\'s team to the adult team. Before you move, we will check together whether you still need treatment." (NG87 1.1.4)'],
      ['The medicine','"Your medicine [is / is not] licensed for adults. If it is not, the adult team may keep it, explaining why, or plan a change to a licensed one." (SmPC 4.1)'],
      ['Who prescribes','"Until the adult team takes over, [named team] keeps prescribing, so there is no gap. Order as usual."'],
      ['What to bring','"Bring your medicine, your last letters, and anything that shows how school, work, sleep and mood are going. The adult team will do a full review, including other conditions." (NG87 1.1.6)']]}
  };
  XP.registry.scripts=function(m){
    var keys=Object.keys(SC);
    m.innerHTML=card('Choose a situation and step through the script. Words in quotation marks are suggested phrasing; adapt them to the person and finish by checking understanding.',
      '<div class="hb-chips sc-chips" role="group" aria-label="Situation">'+keys.map(function(k,i){return '<button type="button" class="hb-chip" data-k="'+k+'" aria-pressed="'+(i===0)+'">'+esc(SC[k].l)+'</button>';}).join('')+'</div><ol class="sc-steps"></ol><div class="hb-nav"><button type="button" class="btn secondary sc-prev">← Previous</button><span class="sc-pos" aria-live="polite"></span><button type="button" class="btn sc-next">Next →</button></div>',
      null);
    var R=m.firstChild, K=keys[0], i=0;
    function render(){ var st=SC[K].steps; R.querySelectorAll('.sc-chips .hb-chip').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.k===K));});
      R.querySelector('.sc-steps').innerHTML=st.map(function(s,j){return '<li class="'+(j===i?'on':(j<i?'done':''))+'"><strong>'+esc(s[0])+'</strong><span>'+s[1]+'</span></li>';}).join('');
      R.querySelector('.sc-pos').textContent='Step '+(i+1)+' of '+st.length; R.querySelector('.sc-prev').disabled=i===0; R.querySelector('.sc-next').disabled=i===st.length-1; }
    R.querySelector('.sc-chips').addEventListener('click',function(e){ var b=e.target.closest('.hb-chip'); if(b){K=b.dataset.k;i=0;render();} });
    R.querySelector('.sc-prev').addEventListener('click',function(){ if(i>0){i--;render();} });
    R.querySelector('.sc-next').addEventListener('click',function(){ if(i<SC[K].steps.length-1){i++;render();} });
    R.querySelector('.sc-steps').addEventListener('click',function(e){ var li=e.target.closest('li'); if(li){ i=[].indexOf.call(li.parentNode.children,li); render(); } });
    render();
  };

  /* ---------------- 6. Scenario drill ---------------- */
  var DR=[
    {q:'A father brings a prescription for Concerta XL 36 mg. You only have Xaggitin XL 36 mg. Can you supply it?',a:'Not against that prescription. The two are bioequivalent (SPS tablet group), but the prescription names a brand, so the prescriber must issue a new one. During supply problems SPS says prescribers can prescribe generically so that any product in the group can be supplied. Then counsel: the tablet looks different, and the Xaggitin XL SmPC describes no empty shell in the stool.',s:'SPS (Aug 2025); Concerta XL and Xaggitin XL SmPCs 4.4'},
    {q:'An 18-year-old has taken Equasym XL 30 mg since age 12 and moves to adult services. What licensing issue arises?',a:'Equasym XL is not licensed for adults (SmPC 4.1), so continuing it is off-label: the adult team records the reason and consent. No product is bioequivalent to Equasym XL (SPS), so any change is a planned switch with a new titration, not a like-for-like swap.',s:'Equasym XL SmPC 4.1; SPS; NG87 1.1.4–1.1.6'},
    {q:'A 10-year-old on Medikinet XL 20 mg skips breakfast most days and has a "big crash" mid-morning. What do you check?',a:'Medikinet XL must be taken with or after food: on an empty stomach it is absorbed faster and release may not be sustained. Advise taking it with breakfast (a small breakfast counts), then review the pattern.',s:'Medikinet XL SmPC 4.2, 5.2'},
    {q:'A parent asks whether they can open Concerta XL and sprinkle it.',a:'No. Concerta XL-type tablets must be swallowed whole and not chewed, divided or crushed. If swallowing is the problem, discuss with the prescriber a bead capsule that can be opened (Ritalin XL-type, Medikinet XL, Equasym XL) or Elvanse mixed into yoghurt, water or orange juice.',s:'Concerta XL SmPC 4.2; capsule SmPCs 4.2; Elvanse SmPC 4.2'},
    {q:'A patient with coeliac disease is prescribed Ritalin tablets. Is the wheat starch a problem?',a:'The Ritalin SmPC says it contains only very low levels of gluten (from wheat starch) and is very unlikely to cause problems in coeliac disease. Reassure and record it.',s:'Ritalin SmPC 4.4'},
    {q:'A teenager on Xenidate XL has hereditary fructose intolerance. Any concern?',a:'Yes. Xenidate XL contains sucrose and should not be taken with fructose intolerance, glucose–galactose malabsorption or sucrase–isomaltase insufficiency. The osmotic Concerta-type tablets contain lactose instead. Contact the prescriber.',s:'Xenidate XL SmPC 4.4; Concerta XL SmPC 6.1'},
    {q:'A 14-year-old on Intuniv 3 mg was away for 3 days without tablets. What do you advise?',a:'Two or more missed doses in a row: re-titration is recommended rather than restarting at 3 mg. Blood pressure and pulse can rise after guanfacine stops. Contact the prescriber the same day.',s:'Intuniv SmPC 4.2, 4.4'},
    {q:'An adult on Elvanse 50 mg forgot this morning\'s dose and remembers at 15:00.',a:'Skip today and take the usual dose tomorrow morning: the SmPC says dosing can resume the next day, and afternoon doses should be avoided because of insomnia.',s:'Elvanse SmPC 4.2'},
    {q:'Methylphenidate IR 10 mg three times daily is changed to a 22:78 tablet. What does the Concerta XL SmPC table give?',a:'10 mg three times daily → Concerta XL 36 mg once daily (SmPC Table 1). For a twice-daily IR regimen, the Ritalin XL table gives the same total daily dose once a day (for example 10 mg twice daily → 20 mg).',s:'Concerta XL and Ritalin XL SmPC 4.2'},
    {q:'A student on Concerta XL is going abroad for a 6-month placement and asks what to do.',a:'Check the destination country\'s rules with its embassy first. Carry the medicine in hand luggage in its labelled pack with a prescriber\'s letter. Taking more than 3 months\' supply out of the UK needs a Home Office personal licence (apply at least a month ahead), so plan supplies for a long stay with the prescriber early.',s:'GOV.UK: Controlled drugs: personal licences (updated Apr 2023)'},
    {q:'A 16-year-old on Concerta XL 54 mg asks for 72 mg "because it\'s in the BNF".',a:'54 mg is the licensed maximum for children (SmPC 4.2). The BNFC lists higher doses only under specialist direction, which is off-label. This is a specialist decision with a documented reason, not a routine dose step.',s:'Concerta XL SmPC 4.2; BNFC (see Module 5)'},
    {q:'A man taking atomoxetine starts paroxetine. What happens and what do you do?',a:'Paroxetine is a strong CYP2D6 inhibitor: atomoxetine exposure can rise 6- to 8-fold. Tell the prescriber: slower titration or a lower dose may be needed; watch pulse, BP and side effects.',s:'Atomoxetine SmPC 4.5'},
    {q:'A known patient on dexamfetamine asks for an emergency supply because the surgery is closed.',a:'Not allowed: emergency supply at a patient\'s request is not permitted for Schedule 2 controlled drugs. Help them reach an out-of-hours prescriber.',s:'Human Medicines Regulations 2012 (reg 225); Module 9'},
    {q:'A mother on lisdexamfetamine plans to breastfeed.',a:'The Elvanse SmPC says it should not be used during breastfeeding. Refer to the specialist for a decision, and use the UK Drugs in Lactation Advisory Service (UKDILAS) for individual advice.',s:'Elvanse SmPC 4.6; Module 7'},
    {q:'A child on methylphenidate is having more seizures than before.',a:'NICE: review the ADHD medicine and stop any that might be contributing; after investigation, cautiously reintroduce it if it is unlikely to be the cause. The methylphenidate SmPC says stop if seizure frequency increases. Same-day prescriber contact.',s:'NG87 1.8.16; Concerta XL SmPC 4.4'},
    {q:'A 4-year-old swallowed several of a sibling\'s Concerta XL tablets an hour ago and seems fine.',a:'Emergency now, even without symptoms: 999 if collapsed, fitting or not breathing properly, otherwise straight to A&E. The SmPC warns to allow for delayed release from long-acting products; there is no specific antidote. Clinicians manage it with TOXBASE and the NPIS. Take the pack.',s:'Concerta XL SmPC 4.9; NPIS / TOXBASE'},
    {q:'Kai, 17, takes lisdexamfetamine and started sertraline 3 days ago. Today he is agitated, sweating and shaky, with jerking of his legs and ankles.',a:'Think serotonin toxicity: a serotonergic drug plus agitation, sweating and inducible or spontaneous clonus. Same-day emergency assessment. Serotonin syndrome has been reported with amfetamines given with SSRIs and SNRIs.',s:'Elvanse SmPC 4.5; Hunter criteria (Dunkley 2003)'},
    {q:'Jess, 18, takes Matoride XL 36 mg and is moving to adult services. Is it licensed for adults?',a:'No. Matoride XL is licensed for children 6 and over (maximum 54 mg/day); its SmPC says starting it in adults is not appropriate, though treatment may continue into adulthood if it clearly helps. Several bioequivalent tablets (for example Concerta XL, Xaggitin XL) are licensed for adults, so the adult team can switch within the SPS group at the same dose if they prefer a licensed product.',s:'Matoride XL SmPC 4.1, 4.2; SPS'}
  ];
  XP.registry.drill=function(m){
    m.innerHTML=card('Think of your answer, then reveal the model answer and its source. Use Next to move on.',
      '<div class="dr-card"><p class="dr-n" aria-live="polite"></p><p class="dr-q"></p><div class="dr-a" hidden></div><div class="hb-nav"><button type="button" class="btn secondary dr-prev">← Previous</button><button type="button" class="btn dr-show" aria-expanded="false">Reveal answer</button><button type="button" class="btn secondary dr-next">Next →</button></div></div>',
      'Answers summarise the cited sources; local policy and the prescriber\'s plan come first.');
    var R=m.firstChild, i=0;
    function render(){ var d=DR[i]; R.querySelector('.dr-n').textContent='Scenario '+(i+1)+' of '+DR.length; R.querySelector('.dr-q').textContent=d.q; var a=R.querySelector('.dr-a'); a.hidden=true; a.innerHTML='<p>'+esc(d.a)+'</p><p class="hb-note">Source: '+esc(d.s)+'</p>'; var b=R.querySelector('.dr-show'); b.setAttribute('aria-expanded','false'); b.textContent='Reveal answer'; R.querySelector('.dr-prev').disabled=i===0; R.querySelector('.dr-next').disabled=i===DR.length-1; }
    R.querySelector('.dr-show').addEventListener('click',function(){ var a=R.querySelector('.dr-a'); a.hidden=!a.hidden; this.setAttribute('aria-expanded',String(!a.hidden)); this.textContent=a.hidden?'Reveal answer':'Hide answer'; });
    R.querySelector('.dr-prev').addEventListener('click',function(){ if(i>0){i--;render();} });
    R.querySelector('.dr-next').addEventListener('click',function(){ if(i<DR.length-1){i++;render();} });
    render();
  };
  XP._DRN=DR.length;
})();
