/* Module 11 practice handbook interactives: brand explorer, switch planner, missed-dose advisor,
   comorbidity navigator, counselling scripts and scenario drill. Facts cite SmPC (emc), SPS, BNF/BNFC or NICE NG87. */
(function(){
  'use strict';
  var XP=window.XP; if(!XP) return;
  var esc=XP.esc, T=XP.t, BR=window.BRANDS||[], BY={};
  BR.forEach(function(b){ BY[b.id]=b; });
  XP.registry=XP.registry||{};
  function opt(v,l,sel){ return '<option value="'+esc(v)+'"'+(sel?' selected':'')+'>'+esc(l)+'</option>'; }
  function card(kicker,title,intro,body,note,sources){
    return '<div class="xp xf card-dark hb"><p class="xp-kicker">'+esc(kicker)+'</p><h3 class="xp-title">'+esc(title)+'</h3><p class="xp-intro">'+intro+'</p>'+body
      +(note?'<p class="xp-note">'+note+'</p>':'')+(sources?'<details class="xp-src"><summary>Sources</summary><ul>'+sources.map(function(s){return '<li>'+s+'</li>';}).join('')+'</ul></details>':'')+'</div>';
  }
  var GRPNAME={tab:'Concerta XL-equivalent tablets',cap:'Ritalin XL-type capsules (50:50)',mk:'Medikinet XL (50:50)',eq:'Equasym XL (30:70)',ir:'Immediate-release methylphenidate',lis:'Lisdexamfetamine',dex:'Dexamfetamine',atx:'Atomoxetine',gua:'Guanfacine'};
  function brandOptions(sel,withNone){
    var h=withNone?opt('','None (single product)',!sel):'', g=null;
    BR.forEach(function(b){ if(b.grp!==g){ if(g) h+='</optgroup>'; g=b.grp; h+='<optgroup label="'+esc(GRPNAME[g])+'">'; } h+=opt(b.id,b.name,b.id===sel); });
    return h+'</optgroup>';
  }

  /* ---------------- 1. Brand explorer with release-profile overlay ---------------- */
  var CX0=44, CX1=344, CY0=176, CY1=24, HMAX=16;
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
    var s='<line x1="'+CX0+'" y1="'+CY0+'" x2="'+CX1+'" y2="'+CY0+'" stroke="#5d7894"/><line x1="'+CX0+'" y1="'+CY1+'" x2="'+CX0+'" y2="'+CY0+'" stroke="#5d7894"/>';
    for(var h=0;h<=HMAX;h+=2){ s+='<line x1="'+X(h)+'" y1="'+CY0+'" x2="'+X(h)+'" y2="'+(CY0+5)+'" stroke="#5d7894"/>'+T(X(h),CY0+20,String(h),{anchor:'middle',size:15}); if(h) s+='<line x1="'+X(h)+'" y1="'+CY1+'" x2="'+X(h)+'" y2="'+CY0+'" stroke="#23415f" stroke-dasharray="2 4"/>'; }
    s+=T((CX0+CX1)/2,CY0+42,'Hours after the morning dose',{anchor:'middle',size:15});
    s+=T(20,(CY0+CY1)/2,'Relative level',{anchor:'middle',rot:-90,size:15});
    function line(id,col,dash,lab){
      var c=curve(id); if(!c) return '';
      var d=c.pts.map(function(q,i){return (i?'L':'M')+X(q[0]).toFixed(1)+','+Y(q[1]).toFixed(1);}).join('');
      var o='<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="3.2"'+(dash?' stroke-dasharray="7 5"':'')+' stroke-linecap="round"/>';
      c.peaks.forEach(function(pk){ o+='<line x1="'+X(pk[0]).toFixed(1)+'" y1="'+Y(pk[1]).toFixed(1)+'" x2="'+X(pk[0]).toFixed(1)+'" y2="'+CY0+'" stroke="'+col+'" stroke-width="1.5" stroke-dasharray="2 3" opacity=".8"/><circle cx="'+X(pk[0]).toFixed(1)+'" cy="'+Y(pk[1]).toFixed(1)+'" r="5" fill="#0f2236" stroke="'+col+'" stroke-width="2.5"/>'; });
      return o;
    }
    var A=BY[a], du=DUR[A.grp];
    if(du) s+='<rect x="'+X(0)+'" y="'+(CY0-8)+'" width="'+(X(du)-X(0))+'" height="6" rx="3" fill="#5fd3a6" opacity=".55"/>'+T(X(du)-4,CY0-13,'≈'+du+' h cover ('+(A.grp==='lis'?'SmPC':'SPS')+')',{size:14,fill:'#9fe5c9',anchor:'end'});
    s+=line(a,'#6fb3f2',false)+(bid?line(bid,'#f2c14e',true):'');
    return '<svg class="xp-svg" viewBox="0 0 360 236" role="img" aria-label="Schematic release profile of '+esc(A.name)+(bid?' compared with '+esc(BY[bid].name):'')+', hours after dose against relative level">'+s+'</svg>';
  }
  function CAVEAT(id){
    if(id==='equasym') return ' Equasym XL: the SmPC reports two peaks of similar height (about 7.7 and 8.2 ng/ml at about 1.5 h and 4.5 h; SmPC 5.2). With a 30% immediate-release fraction this simple model cannot match both heights, so it draws the first peak lower: read the timings, not the heights.';
    if(id==='medikinetxl') return ' Medikinet XL: the SmPC gives a mean Tmax of 2.75 h and a 3–4 h plateau at or above 75% of peak (SmPC 5.2). The model keeps the plateau, so its single highest point falls later (about 3.7 h): read the plateau, not the exact peak.';
    return ''; }
  function facts(b){
    var rows=[['Release mechanism',b.mech],['IR : MR',b.ratio],['Onset, peaks and duration',b.time],['Strengths',b.strengths],['Licence',b.lic],['Licensed dosing and titration',b.dose],['BNF/BNFC (accessed 21 Oct 2026)',b.bnf],['Food, swallowing and sprinkling',b.admin],['Excipients to check',b.exc],['Interchangeability',b.inter],['Legal status',b.cd]];
    return '<dl class="hb-dl">'+rows.map(function(r){return '<div><dt>'+esc(r[0])+'</dt><dd>'+r[1]+'</dd></div>';}).join('')+'</dl><p class="xp-note">Source: '+b.src+'</p>';
  }
  XP.registry.brand=function(m){
    var S={a:'concerta',b:'ritalinxl'};
    m.innerHTML=card('Interactive formulary · Module 11','Every UK ADHD product: release, dosing and practical details',
      'Choose a product to see how it releases, how it is dosed and titrated, how it can be taken, what is in it and what it can be switched with. Add a second product to overlay its release profile.',
      '<div class="hb-row"><label class="xf-sel">Product<select class="hb-a">'+brandOptions(S.a)+'</select></label><label class="xf-sel">Compare with<select class="hb-b">'+brandOptions(S.b,true)+'</select></label></div>'
      +'<div class="xp-chart hb-chart"></div><div class="hb-legend" aria-hidden="true"></div><div class="hb-facts" aria-live="polite"></div>',
      'The curves are a schematic teaching model fitted to the timings stated in each SmPC section 5.2 (and SPS durations). Each curve is scaled to its own peak, so compare <em>timing and shape</em>, not height or dose. Not pharmacokinetic data; individual responses vary (NG87 1.7.21). Costs are not shown: prices could not be verified live, so check the current Drug Tariff or dm+d.',
      ['SmPCs on emc (checked 20–21 Oct 2026): Concerta XL 314; Xaggitin XL 2704; Affenid XL 14600; Atenza XL 101204; Matoride XL 3304 (superseded: current MHRA SmPC PL 04416/1346, 1348, 1349, rev. 07/06/2026); Xenidate XL 4397; Ritalin XL 15966; Meflynate XL 15094; Metyrol XL 13797; Focusim XL 100558; Medikinet XL 313; Equasym XL 3887; Ritalin 15987; Medikinet 328; Elvanse 14089; Elvanse Adult 6828; Amfexa 102097; atomoxetine 10332; Intuniv 5099.','SPS: Prescribing and switching between modified-release methylphenidate (updated 28 Aug 2025).','BNF and BNFC drug monographs (accessed 21 Oct 2026).','London Medicines Evaluation Network: Methylphenidate review (March 2018), for Delmosart.']);
    var R=m.firstChild, sa=R.querySelector('.hb-a'), sb=R.querySelector('.hb-b');
    function render(){
      S.a=sa.value; S.b=sb.value&&sb.value!==S.a?sb.value:'';
      var A=BY[S.a], Bp=S.b?BY[S.b]:null, ch=R.querySelector('.hb-chart');
      if(!A.model) ch.innerHTML='<p class="hb-flat"><strong>'+esc(A.name)+':</strong> no daily release curve to draw. Its efficacy was shown in trials lasting several weeks ('+(A.id==='gua'?'Intuniv SmPC 5.1':'atomoxetine SmPC 5.1')+'); that benefit is not tied to a daily peak is a general principle, not an SmPC statement. Compare it with a stimulant to see why timing questions differ.</p>'+(Bp&&Bp.model?chart(S.b,''):'');
      else ch.innerHTML=chart(S.a,Bp&&Bp.model?S.b:'');
      function pkTxt(id){ var c=curve(id); return c?c.peaks.map(function(q){return q[0].toFixed(1)+' h';}).join(' and '):''; }
      R.querySelector('.hb-legend').innerHTML=(A.model?'<span><i style="background:#6fb3f2"></i>'+esc(A.name)+': peaks at '+pkTxt(S.a)+'</span>':'')+(Bp&&Bp.model?'<span><i class="dash" style="border-color:#f2c14e"></i>'+esc(Bp.name)+': peaks at '+pkTxt(S.b)+'</span>':'')+((A.model||(Bp&&Bp.model))?'<span class="hb-lnote">Peak times are from the teaching model; the SmPC timings are in the facts below.'+CAVEAT(S.a)+(Bp?CAVEAT(S.b):'')+'</span>':'');
      R.querySelector('.hb-facts').innerHTML='<h4 class="hb-h">'+esc(A.name)+'</h4>'+facts(A)+(Bp?'<details class="hb-cmp"><summary>Show '+esc(Bp.name)+' details</summary>'+facts(Bp)+'</details>':'');
    }
    sa.addEventListener('change',render); sb.addEventListener('change',render); render();
  };

  /* ---------------- 2. Switch planner ---------------- */
  var IRTAB={18:15,27:22.5,36:30,45:37.5,54:45,72:60};
  function nearest(list,v){ var best=list[0]; list.forEach(function(x){ if(Math.abs(x-v)<Math.abs(best-v)) best=x; }); return best; }
  function plan(from,dose,freq,to){
    var F=BY[from], Tt=BY[to], out=[], tone='ok', badge='Plan', head='';
    var stim=function(b){return ['tab','cap','mk','eq','ir'].indexOf(b.grp)>=0;};
    var legal='<li><strong>Legal:</strong> '+(Tt.cd.indexOf('Schedule 2')>=0?'if the prescription names a brand, supplying a different brand or product needs a new prescription from the prescriber. During supply disruption SPS advises generic prescribing within a bioequivalent group so that any product in that group can be supplied (SPS 2025). Schedule 2 prescription requirements still apply (Misuse of Drugs Regulations 2001).':'atomoxetine and guanfacine are POMs, but a change of medicine is still a prescriber decision.')+'</li>';
    var couns='<li><strong>Counsel on what changes:</strong> '+Tt.admin+'</li><li><strong>Follow up:</strong> ask the person to report any change in symptom control or side effects; review HR, BP and sleep after the change (NG87 1.8.9, 1.8.17).</li>';
    if(from===to){ return {tone:'info',badge:'Same product',head:'No switch needed',html:'<p>Choose a different target product.</p>'}; }
    if(!stim(F)||!stim(Tt)){
      tone='high'; badge='Molecule switch'; head='Different medicine: there is no dose conversion';
      out.push('<li><strong>No conversion factor exists.</strong> None of the SmPCs gives a dose conversion between methylphenidate, lisdexamfetamine, dexamfetamine, atomoxetine and guanfacine. The new medicine is started at its own licensed starting dose and titrated: '+Tt.dose+'</li>');
      out.push('<li><strong>Who decides:</strong> switching between medicines follows the NG87 sequence (e.g. methylphenidate → lisdexamfetamine after a 6-week trial at an adequate dose without enough benefit, 1.7.8 and 1.7.12; atomoxetine or guanfacine in children (1.7.10), or atomoxetine in adults (1.7.15), if the person cannot tolerate methylphenidate or lisdexamfetamine, or their symptoms have not responded to separate 6-week trials of both) and is a specialist decision under shared care (1.7.29).</li>');
      if(F.id==='gua') out.push('<li><strong>Stopping guanfacine:</strong> taper by no more than 1 mg every 3–7 days and monitor BP and pulse (rebound hypertension) (Intuniv SmPC 4.2, 4.4).</li>');
      if(F.id==='dex') out.push('<li><strong>Stopping dexamfetamine:</strong> the SmPC advises careful supervision on withdrawal (risk of depression and fatigue).</li>');
      if(Tt.id==='atx'||Tt.id==='gua') out.push('<li><strong>Expect a lag:</strong> benefit from '+(Tt.id==='atx'?'atomoxetine':'guanfacine')+' builds over weeks, so any overlap or cross-taper is planned by the specialist; the SmPCs give no cross-taper schedule.</li>');
      out.push(legal); out.push(couns);
      return {tone:tone,badge:badge,head:head,html:'<ul>'+out.join('')+'</ul>'};
    }
    // methylphenidate to methylphenidate
    var total=F.grp==='ir'?dose*freq:dose;
    if(F.grp==='ir'&&Tt.grp==='ir'){
      badge='IR to IR'; head='Same dose (both immediate-release methylphenidate)';
      out.push('<li>Both are immediate-release methylphenidate hydrochloride tablets taken 2–3 times a day. SPS does not list IR brands in its MR bioequivalence groups; switching mg for mg is the usual approach (not a stated SmPC rule). Ritalin comes only as 10 mg scored tablets; Medikinet as 5, 10 and 20 mg.</li>');
      if(Tt.id==='medikinetir') out.push('<li><strong>Licence:</strong> Medikinet IR is licensed for children only (SmPC 4.1); Ritalin is licensed in adults too.</li>');
    } else if(F.grp===Tt.grp && (F.grp==='tab'||F.grp==='cap')){
      badge='Bioequivalent'; head='Same dose and quantity ('+total+' mg)';
      out.push('<li><strong>'+esc(F.name)+' → '+esc(Tt.name)+':</strong> both are in the same SPS bioequivalence group, so switch at the same dose and quantity if a switch is necessary (SPS).</li>');
      if(F.grp==='tab'&&(F.id==='concerta'||F.id==='affenid'||F.id==='atenza'||F.id==='matoride')!==(Tt.id==='concerta'||Tt.id==='affenid'||Tt.id==='atenza'||Tt.id==='matoride')) out.push('<li><strong>Tablet design changes:</strong> osmotic tablets leave an empty shell in stools; Xaggitin XL and Xenidate XL do not. Warn the person so a change is not mistaken for a problem.</li>');
      if(Tt.id==='matoride'&&total%18!==0) out.push('<li><strong>Strength check:</strong> Matoride XL comes as 18, 36 and 54 mg tablets only; '+total+' mg cannot be made up from them (SmPC 4.2 notes that a 27 mg strength is available from other companies). Stay on a brand that has the strength, or ask the prescriber.</li>');
      if(F.grp==='tab'&&(Tt.id==='xenidate'||F.id==='xenidate')) out.push('<li><strong>Excipient changes:</strong> Xenidate XL contains sucrose instead of lactose (SmPC 2).</li>');
    } else if(Tt.grp==='eq'||F.grp==='eq'){
      tone='danger'; badge='Avoid'; head='Equasym XL has no bioequivalent product';
      out.push('<li><strong>SPS:</strong> no other MR product is bioequivalent to Equasym XL, so it should not be switched to or prescribed generically. If supply forces a change, the specialist individualises the plan.</li>');
      out.push('<li><strong>Anchor via IR:</strong> Equasym XL 10 mg ≈ 10 mg/day IR methylphenidate (SPS); 20 mg replaces 10 mg IR at breakfast plus 10 mg at lunch (SmPC 4.2). '+' The specialist chooses the starting dose of any new product.'+'</li>');
      out.push('<li><strong>Profile differs:</strong> 30:70 with peaks at about 1.5 h and 4.5 h, taken before breakfast; children only (SmPC 4.1, 4.2, 5.2).</li>');
    } else if(F.grp==='ir'&&Tt.grp==='tab'){
      if(freq===3&&[5,10,15,20].indexOf(dose)>=0){ var m={5:18,10:36,15:54,20:72}[dose]; head=dose+' mg TDS → '+m+' mg once daily'; badge='SmPC table';
        out.push('<li><strong>SmPC Table 1</strong> (Concerta XL and bioequivalent tablets): '+dose+' mg methylphenidate three times daily → '+m+' mg once daily.</li>');
        if(m>54) out.push('<li><strong>Licence:</strong> '+m+' mg is above the children\'s maximum of 54 mg/day; adults only (max 72 mg) (SmPC 4.2).</li>');
      } else { tone='warn'; badge='Judgement'; head='No SmPC conversion for this regimen';
        out.push('<li>The SmPC table covers 5, 10, 15 or 20 mg three times daily only. For '+dose+' mg '+(freq===2?'twice':'three times')+' daily ('+total+' mg/day) the specialist chooses the starting dose. For reference only, SPS gives Concerta XL 18 mg ≈ 15 mg/day IR.</li>'); }
      out.push('<li><strong>Profile changes:</strong> one dose now covers about 12 h, with a slower start (22–25% released immediately, depending on brand) (SmPC 5.2; SPS).</li>');
    } else if(F.grp==='ir'&&(Tt.grp==='cap'||Tt.grp==='mk')){
      if(freq===2||Tt.grp==='mk'){ badge='SmPC'; head=total+' mg/day IR → '+total+' mg once daily';
        out.push('<li>'+(Tt.grp==='mk'?'Medikinet XL SmPC: switch to the milligram-equivalent daily dose.':'Ritalin XL and Meflynate XL SmPCs: the once-daily dose equals the total daily IR dose given twice daily (e.g. 10 mg BD → 20 mg).')+' Children max 60 mg/day; adults 80 mg/day.</li>');
        if(freq===3&&Tt.grp==='mk') out.push('<li><strong>Note:</strong> a three-times-daily IR regimen covers a longer day than an 8-hour capsule. Whether a small late-day IR dose is added is a prescriber decision (Medikinet XL SmPC 4.2; NG87 1.7.22).</li>');
      } else { tone='warn'; badge='Judgement'; head='TDS regimen: no direct SmPC conversion'; out.push('<li>The capsule SmPC tables convert twice-daily IR regimens. A three-times-daily total of '+total+' mg/day may not be fully covered by an 8-hour capsule: specialist judgement.</li>'); }
      if(total>60) out.push('<li><strong>Licence:</strong> above the children\'s maximum of 60 mg/day (adults max 80 mg).</li>');
    } else if(Tt.grp==='ir'){
      tone='warn'; badge='Specialist'; head='MR → IR: individualised; the specialist sets the dose';
      out.push('<li><strong>SPS equivalences (reference points, not a conversion table):</strong> Concerta XL 18 mg once daily ≈ 15 mg/day IR; Medikinet XL 10 mg, Metyrol XL 10 mg and Equasym XL 10 mg ≈ 10 mg/day IR.'+(F.grp==='cap'?' Metyrol XL is in the same SPS capsule group as '+esc(F.name)+'.':'')+' The specialist chooses the IR dose and how to split it.</li>');
      out.push('<li><strong>SPS:</strong> an individualised approach is needed; consider seeking advice or referring back to the initiating specialist. IR products carry a higher risk of misuse and diversion (NG87 1.7.24).</li>');
    } else {
      tone='warn'; badge=(Tt.grp==='mk'||F.grp==='mk')?'Particular care':'Not bioequivalent'; head='Different release profile: specialist decision';
      var mkcap=(F.grp==='mk'&&Tt.grp==='cap')||(F.grp==='cap'&&Tt.grp==='mk');
      out.push('<li><strong>'+GRPNAME[F.grp]+' → '+GRPNAME[Tt.grp]+':</strong> '+(mkcap?'switches between Medikinet XL and the Ritalin XL-type capsules are possible but need particular care, because Medikinet XL is not completely bioequivalent with them (SPS).':(F.grp==='mk'||Tt.grp==='mk')?'Medikinet XL is not in an SPS bioequivalence group; any switch needs particular care (SPS).':'these groups are not bioequivalent (SPS).')+'</li>');
      out.push('<li><strong>No SmPC or SPS dose conversion</strong> exists between these groups. For reference only, SPS relates each to IR methylphenidate (Concerta XL 18 mg ≈ 15 mg/day; Medikinet XL, Metyrol XL, Equasym XL 10 mg ≈ 10 mg/day). The specialist chooses the starting dose of the new product and titrates.</li>');
      var PK2={tab:'6–8 h',cap:'5–7 h',mk:'3–4 h',eq:'4.5 h'};
      out.push(DUR[F.grp]===DUR[Tt.grp]?'<li><strong>Timing changes:</strong> cover is similar (about '+DUR[F.grp]+' h), but the second peak moves from '+PK2[F.grp]+' to '+PK2[Tt.grp]+' after the dose (SmPC 5.2; SPS)'+(Tt.grp==='mk'?', and Medikinet XL must be taken with food':'')+'.</li>':'<li><strong>Cover changes:</strong> about '+DUR[F.grp]+' h → about '+DUR[Tt.grp]+' h (SPS), so the late-afternoon picture will change.</li>');
    }
    out.push(legal); out.push(couns);
    return {tone:tone,badge:badge,head:head,html:'<ul>'+out.join('')+'</ul>'};
  }
  XP.registry.switcher=function(m){
    m.innerHTML=card('Interactive planner · Module 11','Switch planner: brands, formulations and molecules',
      'Choose the current product and dose, then the product you are considering. The planner applies the SmPC conversion tables and SPS equivalence groups, and says when there is <em>no</em> conversion.',
      '<div class="hb-row"><label class="xf-sel">Current product<select class="sw-f">'+brandOptions('ritalin')+'</select></label><label class="xf-sel">Dose (mg)<select class="sw-d"></select></label><label class="xf-sel sw-fq-l">Times a day<select class="sw-fq">'+opt('2','Twice daily',false)+opt('3','Three times daily',true)+'</select></label><label class="xf-sel">Switch to<select class="sw-t">'+brandOptions('concerta')+'</select></label></div>'
      +'<div class="xp-state" aria-live="polite"><span class="xp-badge"></span><h4 class="xp-head"></h4></div><div class="xp-text sw-out"></div>',
      'A teaching aid, not a prescribing tool. Every switch of a Schedule 2 product needs a new prescription, a counselling conversation and follow-up.',
      ['Concerta XL SmPC 4.2 Table 1; Ritalin XL SmPC 4.2 Table 1; Meflynate XL SmPC 4.2; Medikinet XL SmPC 4.2; Equasym XL SmPC 4.2.','SPS: Prescribing and switching between modified-release methylphenidate (updated 28 Aug 2025): bioequivalence groups and MR→IR equivalences.','NICE NG87 1.7.8, 1.7.10, 1.7.22, 1.7.24, 1.7.29.','Intuniv SmPC 4.2 (taper; no mg-for-mg substitution with IR guanfacine).']);
    var R=m.firstChild, f=R.querySelector('.sw-f'), d=R.querySelector('.sw-d'), fq=R.querySelector('.sw-fq'), t=R.querySelector('.sw-t');
    function doses(){
      var b=BY[f.value], list;
      if(b.grp==='ir') list=[5,10,15,20,30]; else { list=(b.strengths.replace(/\([^)]*\)/g,'').match(/\d+(?:\.\d+)?/g)||[]).map(Number).filter(function(x){return x>=1;}); if(b.grp==='tab') list=list.concat([72]); if(b.grp==='cap'||b.grp==='mk'||b.grp==='eq') list=list.concat([60]); }
      list=list.filter(function(x,i,a){return a.indexOf(x)===i;}).sort(function(a,b){return a-b;});
      var cur=+d.value; d.innerHTML=list.map(function(x){return opt(x,x+' mg'+(b.grp==='ir'?' per dose':' daily'),x===cur);}).join('');
      if(list.indexOf(cur)<0) d.value=String(list[Math.min(1,list.length-1)]);
      R.querySelector('.sw-fq-l').hidden=b.grp!=='ir';
    }
    function render(){ var o=plan(f.value,+d.value,+fq.value,t.value), b=R.querySelector('.xp-badge'); b.textContent=o.badge; b.className='xp-badge xp-t-'+o.tone; R.querySelector('.xp-head').innerHTML=o.head; R.querySelector('.sw-out').innerHTML=o.html; }
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
    {id:'tab',l:'Concerta XL and bioequivalent 22:78-type tablets'},
    {id:'ir',l:'Methylphenidate IR (Ritalin, Medikinet tablets)'},
    {id:'lis',l:'Lisdexamfetamine (Elvanse)'},{id:'dex',l:'Dexamfetamine IR'},{id:'atx',l:'Atomoxetine'},{id:'gua',l:'Guanfacine (Intuniv)'}];
  var WHEN=[{v:'early',l:'Within an hour or two of the usual time'},{v:'late',l:'Late morning / around lunch'},{v:'aft',l:'Afternoon or evening'},{v:'two',l:'Two or more days missed in a row'}];
  var PJ=' <span class="hb-tag">Practical judgement</span>', GP=' <span class="hb-tag">General principle</span>';
  var NODOUBLE='<li><strong>Do not take two doses</strong> to make up for a missed one.'+GP+'</li>';
  var MPH_RESTART='<li><strong>After several missed days:</strong> SPS says that after short breaks (up to 2 weeks) methylphenidate can be restarted at the same dose if appropriate; seek specialist advice after longer breaks.</li>';
  function rebound(src){ return '<li><strong>If symptoms rebound as the dose wears off:</strong> check timing and food first. '+src+' Any extra IR methylphenidate dose is a prescriber decision, not a counter fix; weigh it against sleep (NG87 1.7.22, 1.8.17).</li>'; }
  function missed(p,w){
    var a=[], tone='ok', head='', badge='SmPC';
    if(p==='rxl'){
      a.push('<li><strong>Ritalin XL and Metyrol XL SmPC 4.2:</strong> <em>"The patient should not take a double dose to make up for a forgotten dose. If a dose is forgotten, the patient should wait until it is time for the next dose."</em> The Meflynate XL and Focusim XL SmPCs give no forgotten-dose statement; they say intake should not be too late in the morning (sleep). Ritalin XL and Metyrol XL: not too late in the day.</li>');
      if(w==='two'){ head='Restart at the usual dose'; tone='info'; badge='SPS'; a.length=0; a.push(MPH_RESTART); }
      else if(w==='early'){ head='SmPC: wait for the next dose'; tone='warn';
        a.push('<li>Taking a slightly late morning dose (within an hour or two) instead is a practical judgement, not the SmPC rule; agree this with the prescriber in advance.'+PJ+'</li>'); }
      else { head='Skip it; take the next dose as usual tomorrow'; tone='warn'; a.push('<li>Cover lasts about 8 h (SPS); a dose taken at lunchtime or later would act into the evening and may disturb sleep.</li>'); }
      if(w!=='two') a.push(rebound('Meflynate XL and Focusim XL SmPC 4.2: a small dose of IR methylphenidate late in the day may help if behaviour or sleep problems recur as the effect wears off.'));
    }
    else if(p==='mk'||p==='eq'||p==='tab'){
      var nm={mk:'Medikinet XL',eq:'Equasym XL',tab:'Concerta XL'}[p], dur=p==='tab'?12:8;
      var smpc={mk:'Medikinet XL SmPC 4.2 gives no forgotten-dose statement. It says children should not take it too late in the morning (sleep), and it must be taken with or after food.',
                eq:'Equasym XL SmPC 4.2 gives no forgotten-dose statement. It says Equasym XL should not be taken too late in the morning (sleep); it is taken in the morning before breakfast.',
                tab:'Concerta XL SmPC 4.2 gives no forgotten-dose statement. It is taken once daily in the morning.'}[p];
      a.push('<li>'+smpc+'</li>');
      if(w==='two'){ head='Restart at the usual dose'; tone='info'; badge='SPS'; a.length=0; a.push(MPH_RESTART); }
      else if(w==='early'){ head='Usually take it now'; badge='Practical judgement'; a.push('<li>A short delay shifts cover (about '+dur+' h; SPS) later by the same amount.'+PJ+(p==='mk'?' Take it with food.':'')+'</li>'); a.push(NODOUBLE); }
      else if(w==='late'){ tone='warn'; head='Ask about sleep before deciding; often skip'; badge='Practical judgement'; a.push('<li>Cover lasts about '+dur+' h (SPS), so a dose at 12:00 would act until about '+(12+dur)+':00. '+(p==='tab'?'For a 12-hour tablet this usually means skipping today.':'Taking it now pushes cover into the evening.')+' Agree a cut-off time with the prescriber in advance.'+PJ+'</li>'); a.push(NODOUBLE); }
      else { tone='warn'; head='Skip today; usual dose tomorrow morning'; badge='Practical judgement'; a.push('<li>An afternoon MR dose would act into the night (about '+dur+' h; SPS) and disturb sleep.'+PJ+'</li>'); a.push(NODOUBLE); }
      if(w!=='two') a.push(rebound(p==='mk'?'Medikinet XL SmPC 4.2: a small dose (5 mg) of IR methylphenidate late in the day may help.':p==='eq'?'Equasym XL SmPC 4.2: a small dose of IR methylphenidate late in the day may help.':'The Concerta XL SmPC does not mention IR top-ups; NG87 1.7.22 allows MR in the morning with IR later in the day.'));
    }
    else if(p==='ir'){
      a.push('<li><strong>Ritalin SmPC 4.2:</strong> <em>"The patient should not take a double dose to make up for a forgotten dose. If a dose is forgotten, the patient should wait until it is time for the next dose."</em> Ritalin and Medikinet SmPC 4.2: the last dose should, in general, not be given within 4 hours before bedtime.</li>');
      if(w==='two'){ head='Restart at the usual dose'; tone='info'; badge='SPS'; a.length=0; a.push(MPH_RESTART); }
      else if(w==='early'){ head='Ritalin SmPC: wait for the next dose'; tone='warn'; a.push('<li>If the next dose is hours away and it is well over 4 h before bedtime, taking the missed dose late is a practical judgement for the prescriber to agree; never combine it with the next dose.'+PJ+'</li>'); }
      else if(w==='late'){ head='Skip it; take the next dose at its usual time'; tone='warn'; a.push('<li>An IR dose lasts about 4 h (SPS); taking a late-morning dose close to the lunchtime dose would stack the two.</li>'); }
      else { head='Skip it'; tone='warn'; a.push('<li>An afternoon or evening dose risks falling within 4 hours of bedtime and disturbing sleep (Ritalin, Medikinet SmPC 4.2).</li>'); }
    }
    else if(p==='lis'){
      a.push('<li><strong>Elvanse SmPC 4.2:</strong> <em>"In the event of a missed dose, Elvanse dosing can resume the next day."</em> Afternoon doses should be avoided because of the potential for insomnia.</li>');
      if(w==='two'){ head='Resume the usual dose'; badge='SmPC'; a.push('<li>The SmPC gives no separate rule for several missed days. For long gaps, ask the prescriber how to restart.'+GP+'</li>'); }
      else if(w==='early'){ head='Take it now if it is still morning'; badge='Practical judgement'; a.push('<li>Taking it within the morning keeps it a once-daily morning dose; this is a practical judgement, not an SmPC rule.'+PJ+'</li>'); }
      else { head='Skip today; resume tomorrow morning'; tone='warn'; }
      if(w!=='two') a.push(NODOUBLE);
    }
    else if(p==='dex'){
      a.push('<li><strong>Dexamfetamine SmPC 4.2:</strong> doses should not be taken too late after lunchtime, to avoid disturbing sleep. The SmPC gives no missed-dose rule.</li>');
      if(w==='two'){ head='Ask the prescriber how to restart'; tone='info'; badge='General principle'; a.push('<li>No SmPC rule for restarting after missed days.'+GP+'</li>'); }
      else if(w==='aft'){ head='Skip it'; tone='warn'; }
      else { head='Take it if it will not be too late after lunch'; badge='Practical judgement'; a.push('<li>Whether a missed morning or lunchtime dose can still be taken depends on how close it is to the next dose and to the afternoon.'+PJ+'</li>'); }
      a.push(NODOUBLE);
    }
    else if(p==='atx'){
      head='No SmPC instruction: carry on as usual'; tone='info'; badge='General principle';
      a.push('<li>The atomoxetine SmPC gives no missed-dose advice. Continue the usual schedule and check the patient leaflet supplied with the brand dispensed. Benefit does not depend on a daily peak.'+GP+'</li>');
      a.push(NODOUBLE);
      if(w==='two') a.push('<li>For longer gaps, ask the prescriber how to restart.'+GP+'</li>');
    }
    else if(p==='gua'){
      if(w==='two'){ tone='high'; badge='Act'; head='Two or more doses missed: re-titrate'; a.push('<li><strong>Intuniv SmPC 4.2:</strong> if two or more consecutive doses are missed, <strong>re-titration is recommended</strong> based on the patient\'s tolerability. Contact the prescriber.</li><li>Blood pressure and pulse may increase after guanfacine is stopped (SmPC 4.4): check BP and pulse.</li>'); }
      else { head='Resume the usual dose the next day'; a.push('<li><strong>Intuniv SmPC 4.2:</strong> if a dose is missed, the prescribed dose can resume the next day.</li>'); a.push(NODOUBLE); }
    }
    return {tone:tone,head:head,badge:badge,html:'<ul>'+a.join('')+'</ul>'};
  }
  XP._missed=missed; XP._MD=MD; XP._WHEN=WHEN;
  XP.registry.missed=function(m){
    m.innerHTML=card('Interactive advisor · Module 11','Missed dose? What to say at the counter',
      'Pick the medicine and when the dose was remembered. The advice quotes the SmPC where it gives a rule, and says plainly where it does not.',
      '<div class="hb-row"><label class="xf-sel">Medicine<select class="md-p">'+MD.map(function(x,i){return opt(x.id,x.l,i===0);}).join('')+'</select></label><label class="xf-sel">Remembered<select class="md-w">'+WHEN.map(function(x,i){return opt(x.v,x.l,i===1);}).join('')+'</select></label></div>'
      +'<div class="xp-state" aria-live="polite"><span class="xp-badge"></span><h4 class="xp-head"></h4></div><div class="xp-text md-out"></div>',
      'Each line cites the SmPC of that product only. Where the SmPC is silent, advice is labelled <em>General principle</em> or <em>Practical judgement</em>. Agree individual cut-off times with the prescriber.',
      ['SmPC 4.2 on emc: Ritalin XL (15966), Metyrol XL (13797), Meflynate XL (15094), Focusim XL (100558), Medikinet XL (313), Equasym XL (3887), Concerta XL (314), Ritalin (15987), Medikinet (328), Elvanse (14089), dexamfetamine (102097), Intuniv (5099, also 4.4); atomoxetine (10332: no missed-dose statement).','SPS (28 Aug 2025): duration of action; restarting after breaks of up to 2 weeks.','NICE NG87 1.7.22, 1.8.17.']);
    var R=m.firstChild, p=R.querySelector('.md-p'), w=R.querySelector('.md-w');
    function render(){ var o=missed(p.value,w.value), b=R.querySelector('.xp-badge'); b.textContent=o.badge; b.className='xp-badge xp-t-'+o.tone; R.querySelector('.xp-head').innerHTML=o.head; R.querySelector('.md-out').innerHTML=o.html; }
    p.addEventListener('change',render); w.addEventListener('change',render); render();
  };

  /* ---------------- 4. Comorbidity navigator ---------------- */
  var CO={
    tics:{l:'Tics / Tourette\'s',ng:'Same medication choices as for anyone with ADHD (1.7.18), but titrate more slowly and monitor more often (1.7.28). If tics emerge on a stimulant, decide whether they are related (tics wax and wane) and whether their impairment outweighs the benefit (1.8.13); if related, reduce the stimulant, or consider guanfacine (children 5+), atomoxetine, clonidine (under-18s only after tertiary advice) or stopping (1.8.14).',
      smpc:'Methylphenidate SmPC 4.4: associated with the onset or exacerbation of motor and verbal tics and worsening of Tourette\'s; assess family history and examine for tics before starting, and monitor at every dose change and at least every 6 months. Atomoxetine SmPC 4.4: in a controlled study of children with chronic tics or Tourette\'s, atomoxetine did not worsen tics compared with placebo; still monitor for new or worse tics.',
      ph:'Ask about tics at every supply review; a new or worse tic is a reason to contact the prescriber, not to stop suddenly.'},
    epi:{l:'Epilepsy',ng:'If new seizures occur or existing seizures worsen, review the ADHD medication and stop any that might be contributing; after investigation, cautiously reintroduce it if it is unlikely to be the cause (1.8.16). Epilepsy is a group with increased ADHD prevalence (1.2.1).',
      smpc:'Methylphenidate SmPC 4.4: use with caution in epilepsy; it may lower the convulsive threshold; stop if seizure frequency increases or new seizures occur. Atomoxetine SmPC 4.4: seizures are a potential risk; introduce with caution if there is a history of seizures; consider stopping if a seizure develops or frequency increases. Dexamfetamine SmPC 4.4: use with caution in epilepsy. Methylphenidate may inhibit the metabolism of phenobarbital, phenytoin and primidone (Concerta XL SmPC 4.5).',
      ph:'Check anticonvulsant levels or clinical response when methylphenidate is started or stopped, and ask about seizure frequency at each review.'},
    anx:{l:'Anxiety',ng:'Offer the same medication choices (1.7.18); slower titration and closer monitoring (1.7.28).',
      smpc:'Methylphenidate SmPC 4.4: anxiety, agitation and tension have been reported, and it may worsen pre-existing anxiety. Atomoxetine SmPC 4.4: in controlled studies it did not worsen comorbid anxiety compared with placebo, but monitor for new or worse anxiety.',
      ph:'Distinguish peak-time "wired" feelings (dose or timing) from a background anxiety disorder; review caffeine; escalate severe agitation the same day.'},
    asd:{l:'Autism',ng:'Same medication choices (1.7.18) with slower titration and more frequent monitoring (1.7.28). Autism and ADHD often co-exist; see Module 8 for overlap.',
      smpc:'No autism-specific SmPC dosing; apply the usual precautions (tics, anxiety, appetite, sleep).',
      ph:'Agree changes in small steps, use visual or written plans, and consider sensory issues with swallowing (sprinkle or dispersible options: see the formulary explorer).'},
    sub:{l:'Substance misuse / diversion risk',ng:'Be cautious prescribing stimulants if there is a risk of diversion for cognitive enhancement or appetite suppression (1.7.23). Do not offer IR stimulants or MR stimulants that can be easily injected or insufflated if there is a risk of misuse or diversion (1.7.24). Monitor changes in risk, which may come with changes in circumstances and age (1.8.19).',
      smpc:'All stimulant SmPCs (4.4) warn of potential for abuse, misuse, dependence and diversion. Atomoxetine and guanfacine are not controlled drugs.',
      ph:'Watch collection patterns, early requests and "lost" prescriptions; supply weekly or in instalments only as prescribed; never supply early without the prescriber. Escalate concerns to the prescriber and the CD accountable officer as per local policy.'},
    eat:{l:'Eating disorders',ng:'Diversion for appetite suppression is a NICE caution (1.7.23). Monitor weight as in 1.8.5 and use the 1.8.6 strategies if weight loss is a concern.',
      smpc:'Methylphenidate SmPCs and the dexamfetamine SmPC list a diagnosis or history of <strong>anorexia nervosa/anorexic disorders</strong> as a contraindication (4.3). The Elvanse SmPC 4.3 does not list it, but appetite loss is very common (4.8).',
      ph:'Any new eating-disorder diagnosis on a stimulant is a reason to contact the prescriber before the next supply.'},
    mood:{l:'Depression, suicidality, bipolar or psychosis',ng:'In an acute psychotic or manic episode, stop ADHD medication and consider restarting after it resolves (1.7.19). If behaviour worsens, adjust medication and review the diagnosis (1.8.18).',
      smpc:'Methylphenidate and dexamfetamine SmPC 4.3: a diagnosis or history of severe depression, suicidal tendencies or ideation, psychotic symptoms or severe mood disorders is a contraindication. Elvanse SmPC 4.3: agitated states. Atomoxetine SmPC 4.4: suicide-related behaviour reported — monitor and counsel the family.',
      ph:'Same-day contact with the prescriber for suicidal thoughts, mania or psychotic symptoms.'},
    cv:{l:'Cardiovascular disease or high BP',ng:'Monitor HR and BP before and after each dose change and every 6 months (1.8.9); act on sustained HR >120, arrhythmia or SBP >95th centile (or a clinically significant rise) on 2 occasions (1.8.11). No routine ECG unless indicated (1.8.10). See Module 3 for the pre-treatment cardiac assessment.',
      smpc:'Stimulant SmPCs 4.3 list cardiovascular contraindications (e.g. Elvanse: symptomatic cardiovascular disease, advanced arteriosclerosis, moderate to severe hypertension). Atomoxetine: severe cardiovascular or cerebrovascular disorders are contraindicated (4.3). Guanfacine lowers BP and HR; taper to stop (4.2, 4.4).',
      ph:'Check BP/HR in the pharmacy if asked and refer sustained abnormal readings; avoid OTC decongestants with stimulants (Module 7).'}
  };
  XP.registry.comorb=function(m){
    var keys=Object.keys(CO);
    m.innerHTML=card('Interactive navigator · Module 11','Co-existing conditions: what NICE and the SmPCs say',
      'Tap a condition. Each panel separates the NICE recommendation from the SmPC warning and the pharmacist action, so you can see where each piece of advice comes from.',
      '<div class="xp-chips co-chips" role="group" aria-label="Condition">'+keys.map(function(k,i){return '<button type="button" class="xp-chip" data-k="'+k+'" aria-pressed="'+(i===0)+'">'+esc(CO[k].l)+'</button>';}).join('')+'</div><div class="co-out" aria-live="polite"></div>',
      'NICE references are to NG87 (live text checked Oct 2026). SmPC statements are from the products listed in the formulary explorer.',null);
    var R=m.firstChild;
    function show(k){ var c=CO[k]; R.querySelectorAll('.co-chips .xp-chip').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.k===k));});
      R.querySelector('.co-out').innerHTML='<div class="xp-boxes co-boxes"><div class="xp-box"><h5>NICE NG87</h5><div>'+c.ng+'</div></div><div class="xp-box"><h5>SmPC</h5><div>'+c.smpc+'</div></div><div class="xp-box xp-ph"><h5>Pharmacist action</h5><div>'+c.ph+'</div></div></div>'; }
    R.querySelector('.co-chips').addEventListener('click',function(e){ var b=e.target.closest('.xp-chip'); if(b) show(b.dataset.k); });
    show(keys[0]);
  };

  /* ---------------- 5. Counselling scripts ---------------- */
  var SC={
    first:{l:'First supply of an MR stimulant',steps:[
      ['Open','"I\'m the pharmacist. Can I take five minutes to go through your new medicine? Has the specialist explained what it is for?"'],
      ['What and why','"This is [brand], a long-acting form of methylphenidate. It should help with concentration and impulsivity during the day. You may notice an effect on the first day; the dose is then adjusted week by week."'],
      ['How to take it','Brand-specific: Concerta XL-type — "Swallow it whole with water, every morning, with or without food. Don\'t chew or crush it. You may see the empty tablet shell in your stool; that\'s normal" (osmotic tablets). Medikinet XL — "Take it with or after breakfast; on an empty stomach it can release too fast." Equasym XL — "Take it before breakfast." Bead capsules — "If swallowing is hard, open it, sprinkle the beads on a spoonful of soft food such as apple sauce (not warm), and swallow straight away without chewing" (Ritalin XL SmPC 4.2; check each brand).'],
      ['Side effects','"Common ones are a smaller appetite at lunch, trouble getting to sleep, headache and tummy ache. Eat a good breakfast and a bigger evening meal. Tell us or the clinic about chest pain, fainting, a racing heart, new tics, mood changes or strange thoughts — those need checking the same day."'],
      ['Safety and law','"It\'s a controlled drug: keep it locked away, never share it — giving it to someone else is an offence. Avoid alcohol and cold remedies with decongestants such as pseudoephedrine."'],
      ['Practical','"Order your next prescription about a week before you run out: a prescription for this controlled drug is valid for only 28 days, and we cannot make an emergency supply without a prescription. You must tell the DVLA if your ADHD or your medicine affects your ability to drive safely; if it doesn\'t, you don\'t need to tell them" (GOV.UK).'],
      ['Check understanding','"Can you tell me how and when you\'ll take it, and what you\'d do if you felt your heart racing?"']]},
    switch:{l:'Brand switch during a shortage',steps:[
      ['Explain','"Your usual [brand] is out of stock nationally. The prescriber has issued [new brand], which is bioequivalent — it releases the same medicine in the same way, at the same dose." (Only within an SPS group.)'],
      ['What looks different','"The tablet looks different [colour, shape]. Osmotic tablets leave a shell in the stool; this one may not." / "This one is a capsule you can open."'],
      ['What to watch','"Most people notice no change. If your focus, sleep or appetite changes, tell us or the clinic."'],
      ['Going back','"When your usual brand is available again, the prescriber can switch you back."']]},
    sideeffects:{l:'Appetite, sleep and growth worries',steps:[
      ['Listen','"Tell me what a typical day of meals and bedtime looks like now."'],
      ['Appetite','"Give the dose with or after breakfast, offer high-calorie snacks, and plan a bigger meal in the evening when the effect has worn off" (NG87 1.8.6).'],
      ['Sleep','"When is the last dose? A sleep diary for two weeks helps the clinic adjust timing" (NG87 1.8.17).'],
      ['Growth','"Height is checked every 6 months on a growth chart. If growth slows, the specialist may suggest a break over school holidays" (NG87 1.8.5, 1.8.7).']]},
    travel:{l:'Travelling abroad',steps:[
      ['Plan','"Check the rules of the country you\'re going to with its embassy before you travel: other countries have their own laws, and travelling with a medicine that is illegal there can mean a fine or prison" (GOV.UK).'],
      ['Carry','"Carry it in your hand luggage, in its labelled pack, with the prescription or a letter from your prescriber to prove it\'s yours" (GOV.UK).'],
      ['Quantity','"Controlled drugs are not usually prescribed for more than a month at a time. For a long stay, plan supplies with your prescriber in advance; the Home Office Drug and Firearms Licensing Unit (DFLU) advises on leaving the UK with controlled drugs" (GOV.UK).'],
      ['Time zones','"Keep the dose in your new morning; avoid taking a long-acting dose late in your new day" (SmPC timing advice).']]},
    atx:{l:'Starting atomoxetine',steps:[
      ['Expectations','"This isn\'t a stimulant. It builds up over several weeks, so don\'t stop it early because you see no change in the first week."'],
      ['How','"Once a day in the morning, or split morning and late afternoon if it upsets your stomach. With or without food. Don\'t open the capsules — the powder irritates the eyes" (SmPC 4.2, 6.6).'],
      ['Warnings','"Tell us or your doctor straight away about yellowing of the skin or eyes or other signs of liver problems, or any thoughts of self-harm" (SmPC 4.4).'],
      ['Interactions','"Tell every prescriber you take it: some antidepressants such as fluoxetine and paroxetine raise its level a lot" (SmPC 4.5).']]}
  };
  XP.registry.scripts=function(m){
    var keys=Object.keys(SC);
    m.innerHTML=card('Counselling scripts · Module 11','Step-by-step counselling scripts',
      'Choose a situation and step through a script. Words in quotation marks are suggested phrasing; adapt them to the person and check understanding at the end.',
      '<div class="xp-chips sc-chips" role="group" aria-label="Situation">'+keys.map(function(k,i){return '<button type="button" class="xp-chip" data-k="'+k+'" aria-pressed="'+(i===0)+'">'+esc(SC[k].l)+'</button>';}).join('')+'</div><ol class="sc-steps"></ol><div class="hb-nav"><button type="button" class="btn sc-prev">← Previous</button><span class="sc-pos" aria-live="polite"></span><button type="button" class="btn sc-next">Next →</button></div>',
      'Clinical content is from NICE NG87, the product SmPCs, GOV.UK travel, ADHD-and-driving and drug-driving guidance, and the Misuse of Drugs Regulations 2001 (Modules 5, 7 and 9).',null);
    var R=m.firstChild, K=keys[0], i=0;
    function render(){ var st=SC[K].steps; R.querySelectorAll('.sc-chips .xp-chip').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.k===K));});
      R.querySelector('.sc-steps').innerHTML=st.map(function(s,j){return '<li class="'+(j===i?'on':(j<i?'done':''))+'"><strong>'+esc(s[0])+'</strong><span>'+s[1]+'</span></li>';}).join('');
      R.querySelector('.sc-pos').textContent='Step '+(i+1)+' of '+st.length; R.querySelector('.sc-prev').disabled=i===0; R.querySelector('.sc-next').disabled=i===st.length-1; }
    R.querySelector('.sc-chips').addEventListener('click',function(e){ var b=e.target.closest('.xp-chip'); if(b){K=b.dataset.k;i=0;render();} });
    R.querySelector('.sc-prev').addEventListener('click',function(){ if(i>0){i--;render();} });
    R.querySelector('.sc-next').addEventListener('click',function(){ if(i<SC[K].steps.length-1){i++;render();} });
    R.querySelector('.sc-steps').addEventListener('click',function(e){ var li=e.target.closest('li'); if(li){ i=[].indexOf.call(li.parentNode.children,li); render(); } });
    render();
  };

  /* ---------------- 6. Scenario drill ---------------- */
  var DR=[
    {q:'A father brings a prescription for Concerta XL 36 mg. You only have Xaggitin XL 36 mg. Can you supply it?',a:'Not against that prescription. They are bioequivalent (SPS tablet group), but the prescription names a brand, so contact the prescriber for a new prescription (SPS advises generic prescribing within the bioequivalent group during supply problems). Then counsel that the tablet looks different and, unlike Concerta XL, leaves no shell in the stool.',s:'SPS; Misuse of Drugs Regulations 2001'},
    {q:'An 18-year-old has been on Equasym XL 30 mg since age 12 and transfers to adult services. What licensing issue arises?',a:'Equasym XL is not licensed for adults (SmPC 4.1). Continuing it is off-label (BNF adult max 100 mg is also off-label). The adult team may continue it or move to an adult-licensed product; SPS warns no product is bioequivalent to Equasym XL, so any change is a planned switch.',s:'Equasym XL SmPC 4.1; SPS; NG87 1.1.4–1.1.6'},
    {q:'A 10-year-old on Medikinet XL 20 mg skips breakfast most days and has a "big crash" mid-morning. What do you check?',a:'Medikinet XL must be taken with or after food: on an empty stomach absorption is much faster and release may not be sustained. Counsel to take it with breakfast (a small breakfast counts), then review symptom pattern.',s:'Medikinet XL SmPC 4.2, 5.2'},
    {q:'A parent asks whether they can open Concerta XL and sprinkle it.',a:'No. Concerta-type tablets must be swallowed whole and not chewed, divided or crushed. If swallowing is the problem, discuss a capsule that can be opened (e.g. Medikinet XL, Equasym XL, Ritalin XL-type) or Elvanse dispersed in water or yoghurt — a prescriber decision.',s:'Concerta XL SmPC 4.2; capsule SmPCs 4.2; Elvanse SmPC 4.2'},
    {q:'A patient with coeliac disease is prescribed Ritalin tablets. Is the wheat starch a problem?',a:'The Ritalin SmPC states it contains only very low levels of gluten (from wheat starch) and is very unlikely to cause problems in coeliac disease. Reassure and document.',s:'Ritalin SmPC 4.4'},
    {q:'A teenager on Xenidate XL has hereditary fructose intolerance. Any concern?',a:'Yes: Xenidate XL contains sucrose and should not be taken by people with fructose intolerance, glucose–galactose malabsorption or sucrase–isomaltase insufficiency. The osmotic Concerta-type brands contain lactose instead. Contact the prescriber.',s:'Xenidate XL SmPC 4.4; Concerta XL SmPC 6.1'},
    {q:'A 14-year-old on Intuniv 3 mg was away for 3 days without tablets. What do you advise?',a:'Two or more consecutive missed doses: re-titration is recommended rather than restarting at 3 mg. Missed doses can also cause rebound BP and HR rises. Contact the prescriber the same day.',s:'Intuniv SmPC 4.2, 4.4'},
    {q:'An adult on Elvanse 50 mg forgot this morning and remembers at 15:00.',a:'Skip today and take the usual dose tomorrow morning: the SmPC says dosing can resume the next day, and afternoon doses should be avoided because of insomnia.',s:'Elvanse SmPC 4.2'},
    {q:'A prescription for methylphenidate IR 10 mg TDS is changed to an MR product at the same total dose. What does the Concerta XL SmPC table give?',a:'10 mg three times daily → Concerta XL 36 mg once daily (SmPC Table 1). For a twice-daily IR regimen, the Ritalin XL/Meflynate XL tables give the same total daily dose (e.g. 10 mg BD → 20 mg).',s:'Concerta XL and Ritalin XL SmPC 4.2'},
    {q:'A student on Concerta XL is going abroad for a 6-month placement and asks what to do.',a:'Check the destination country\'s rules with its embassy before travelling; carry the medicine in hand luggage with the prescription or a prescriber letter. Controlled drugs are not usually prescribed for more than a month at a time, so supply arrangements for a long stay need planning with the prescriber; the Home Office DFLU gives advice on leaving the UK with controlled drugs.',s:'GOV.UK: Take medicine in or out of the UK; Travelling with medicine containing controlled drugs (Home Office, updated Apr 2023)'},
    {q:'A 16-year-old on Concerta XL 54 mg asks whether the 72 mg dose is possible "because it\'s in the BNF".',a:'72 mg is above the children\'s licensed maximum of 54 mg (SmPC). BNFC lists up to 108 mg/day only under specialist direction, which is off-label. This is a specialist decision, not a primary-care titration.',s:'Concerta XL SmPC 4.2; BNFC (accessed 21 Oct 2026)'},
    {q:'A man taking atomoxetine starts paroxetine. What happens and what do you do?',a:'Paroxetine is a strong CYP2D6 inhibitor: atomoxetine exposure can rise several-fold (6–8× AUC in the SmPC). Tell the prescriber: slower titration or a lower dose may be needed; watch HR, BP and adverse effects.',s:'Atomoxetine SmPC 4.5'},
    {q:'A known patient on dexamfetamine asks for an emergency supply because the surgery is closed.',a:'Not permitted: emergency supply at a patient\'s request is not allowed for Schedule 2 CDs. Help them reach an out-of-hours prescriber.',s:'Human Medicines Regulations 2012 (reg 225); Module 5'},
    {q:'A mother on lisdexamfetamine plans to breastfeed.',a:'The Elvanse SmPC says it should not be used during breastfeeding (amfetamines are excreted in milk). Refer to the specialist for a decision; check UKDILAS for current advice.',s:'Elvanse SmPC 4.6'},
    {q:'A child on methylphenidate has an increasing number of seizures.',a:'NICE: review ADHD medication and stop any that might be contributing; after investigation, cautiously reintroduce it if unlikely to be the cause. The methylphenidate SmPC advises stopping if seizure frequency increases. Same-day prescriber contact.',s:'NG87 1.8.16; Concerta XL SmPC 4.4'},
    {q:'A child swallowed several of a sibling\'s Concerta XL tablets an hour ago.',a:'Emergency: call 999 / A&E and get advice from the National Poisons Information Service via the clinicians (TOXBASE). The SmPC warns to allow for delayed release from extended-duration products when treating overdose; there is no specific antidote.',s:'Concerta XL SmPC 4.9'}
  ];
  XP.registry.drill=function(m){
    m.innerHTML=card('Scenario drill · Module 11','Rapid-fire practice scenarios ('+DR.length+')',
      'Think of your answer, then reveal the model answer and its source. Use Next to move on.',
      '<div class="dr-card"><p class="dr-n" aria-live="polite"></p><p class="dr-q"></p><div class="dr-a" hidden></div><div class="hb-nav"><button type="button" class="btn dr-prev">← Previous</button><button type="button" class="btn dr-show" aria-expanded="false">Reveal answer</button><button type="button" class="btn dr-next">Next →</button></div></div>',
      'Answers are summaries of the cited sources; local policy and the prescriber\'s plan take precedence.',null);
    var R=m.firstChild, i=0;
    function render(){ var d=DR[i]; R.querySelector('.dr-n').textContent='Scenario '+(i+1)+' of '+DR.length; R.querySelector('.dr-q').textContent=d.q; var a=R.querySelector('.dr-a'); a.hidden=true; a.innerHTML='<p>'+esc(d.a)+'</p><p class="xp-note">Source: '+esc(d.s)+'</p>'; var b=R.querySelector('.dr-show'); b.setAttribute('aria-expanded','false'); b.textContent='Reveal answer'; R.querySelector('.dr-prev').disabled=i===0; R.querySelector('.dr-next').disabled=i===DR.length-1; }
    R.querySelector('.dr-show').addEventListener('click',function(){ var a=R.querySelector('.dr-a'); a.hidden=!a.hidden; this.setAttribute('aria-expanded',String(!a.hidden)); this.textContent=a.hidden?'Reveal answer':'Hide answer'; });
    R.querySelector('.dr-prev').addEventListener('click',function(){ if(i>0){i--;render();} });
    R.querySelector('.dr-next').addEventListener('click',function(){ if(i<DR.length-1){i++;render();} });
    render();
  };
})();
