const fs=require('fs');const c=JSON.parse(fs.readFileSync('company.json','utf8'));
const Q=id=>c.flows[0].questions.find(q=>q.id===id);
const OFF='Switches the end screen from automatic offer to clinician review: mode Offline, message "We still need to review your consultation...", approval required. The product list, prices and pre-selected product do not change and the patient can still choose and pay; a clinician decides later. No warning or extra question on screen.';
const OFFcode=OFF+' (Read from the served definition: frontendAction OfflineTreatment; not replayed for this option, but the same tag was confirmed live for 8 other options.)';
const ALL=['fin','prop','dut','avo','reg'];
const obs={ // question -> {label: run}
 'men-q1':{"It's just very suddenly starting to fall out":'e13-sudden'},
 'men-q3':{'No':'e03-used-fin-only'},
 'men-q4':{"I've never used any":'e02-doctor-yes-only'},
 'men-q5':{'Yes':'e10-scars'},'men-q6':{'High (Above 140/90)':'e07-bp-high'},
 'men-q8':{'Heart problems or angina':'e11-heart'},'men-q9':{'Itchy scalp':'e14-itchy'}};
for(const q of c.flows[0].questions){for(const o of q.options){
 if(o.effectType==='flag-for-clinician' && q.id.startsWith('men-q')){
  const run=(obs[q.id]||{})[o.label];
  o.effect=run?OFF+' Seen live in runs/'+run+' against runs/e01-clean.':OFFcode; o.evidence=run?'observed':'code'; o.affects=[];
 }}}
const set=(qid,label,patch)=>{const o=Q(qid).options.find(x=>x.label===label);if(!o)throw qid+label;Object.assign(o,patch);};
set('men-q3','Yes',{effect:'No flag. Needed (together with having used a treatment before) for the automatic offer: alone it is not enough (runs/e02-doctor-yes-only stays Offline); with men-q4 = a named treatment the screen switches to Auto (runs/e01-clean).',effectType:'none',evidence:'observed'});
for(const l of ['Propecia or Finasteride','Regaine or Rogaine or Minoxidil','Avodart or Dutasteride'])
 set('men-q4',l,{effect:'No flag. Which treatment was used does not change the list or the default: Finasteride stays pre-selected whether the man used finasteride, minoxidil or dutasteride before (runs/e01-clean, e08-used-regaine, e09-used-avodart). Combined with men-q3 = Yes it allows the automatic offer.',effectType:'none',evidence:'observed'});
set('men-q6','Low (Below 90/60)',{effect:'No effect at all: still Auto with Regaine (minoxidil) listed; response identical to the normal blood pressure run (runs/e06-bp-low vs runs/e01-clean). Low blood pressure is not screened against minoxidil.',effectType:'none',evidence:'observed'});
set('men-q6','Normal (Between 90/60 - 140/90)',{effect:'No flag; allows the automatic offer.',effectType:'none',evidence:'observed'});
set('men-q8','Mental illness (including depression, anxiety, suicidal thoughts)',{effect:'Hard stop for the whole hair-loss consultation: an inline box "Finasteride and mental illness – Finasteride may not be suitable for men with a history of depression or mood changes. We recommend that you speak to your usual doctor or dermatologist about the safest treatment for you." appears and Continue stays disabled. Even minoxidil (Regaine), which has no mood warning, cannot be reached.',effectType:'hard-stop',affects:ALL,evidence:'observed'});
for(const [qid,l] of [['men-q1',"It's falling out at the roots"],['men-q1',"It's falling out at the scalp"],['men-q1',"It's receding from the front"],['men-q1',"It's thinning all over the top"],['men-q2','More than 3 months ago'],['men-q5','No'],['men-q7','In the last six months'],['men-q8','None of the above'],['men-q9','No, none of the above']])
 { const o=Q(qid).options.find(x=>x.label===l); o.effect='No flag; allows the automatic offer (baseline answer, runs/e01-clean).'+(o.effect.includes('Exclusive')?' Exclusive: unticks the other options.':''); o.effectType='none'; o.evidence=(qid==='men-q1'&&/roots|scalp/.test(l))?'code':'observed'; if(o.evidence==='code')o.effect='No flag in the served definition (Proceed); not replayed.';}
for(const [qid,l] of [['men-q10','No'],['men-q11','Yes'],['men-q11','No']]){const o=Q(qid).options.find(x=>x.label===l);o.effectType='none';o.effect=(qid==='men-q11'&&l==='No')?'No effect on the offer; shows the "Just so you know" GP info pop-up (observed in every replay).':'No effect on the offer (served definition: Proceed, no flag).';o.evidence=(qid==='men-q11'&&l==='No')?'observed':'code';}
// medical profile
const P='men-profile';
set(P,'I have one or more medical conditions',{effect:'Any typed condition (even "Asthma") switches the end screen to clinician review (Offline); products and default unchanged. Served rule offerIfHasConditions = false for every product.',effectType:'flag-for-clinician',affects:[],evidence:'observed'});
set(P,'I smoke or used to smoke',{effect:'In automatic-offer mode, Dutasteride and Avodart are removed from the list (any answer, even "I used to smoke but I quit"); Finasteride, Propecia and Regaine stay. If Dutasteride was pre-selected by its product link, the default switches to Finasteride. In clinician-review mode nothing changes (all five listed). Served rule: offerIfSmoke false for the two dutasteride products, true for the rest.',effectType:'product-removed',affects:['dut','avo'],evidence:'observed'});
set(P,'I drink alcohol',{effect:'In automatic-offer mode, Dutasteride and Avodart are removed even for "Less than 14 units per week"; Finasteride, Propecia and Regaine stay. Served rule offerIfDrink false for the dutasteride products only.',effectType:'product-removed',affects:['dut','avo'],evidence:'observed'});
for(const [l,k] of [["I've had surgery before",'offerIfHasSurgeries'],["I'm taking medication(s)",'offerIfHasMedications'],['I have one or more allergies','offerIfHasAllergies'],['I have one or more disabilities','offerIfHasDisability'],['I have one or more close relatives with a medical condition','offerIfHasFamilyMember'],['I use recreational drugs','offerIfHasRecreationalDrugs']]){
 const o=Q(P).options.find(x=>x.label===l);o.effect=o.effect.split(' Served auto-offer')[0]+' Served rule '+k+' = false for every hair-loss product, so any entry should switch the end screen to clinician review (Offline) with the same products, as observed for a medical condition (runs/e12-profile-cond). Not replayed.';o.effectType='flag-for-clinician';o.affects=[];o.evidence='code';}
Object.assign(Q(P),{branches:true,branchDetail:'Each tick opens its own pop-up. Conditions, surgery, medicines, allergies, disability, family history and recreational drugs send the case to clinician review; smoking or drinking (any amount) removes Dutasteride and Avodart from the automatic offer.',purpose:'General medical profile shared across all Treated conditions. It is the main input to the per-product automatic-offer limits.',engineRole:'safety-screen'});
Object.assign(Q('men-hw'),{branches:true,branchDetail:'BMI above 35 switches the end screen to clinician review (runs/e05-bmi40: 20 st at 5 ft 10, BMI 40.2). Products and default unchanged.',purpose:'Works out BMI; the served automatic-offer limit for finasteride, Propecia and Regaine is BMI 35 or under.'});
// question-level
const qmeta={
 'men-q1':['diagnosis','The four male-pattern answers pass; breakage, back and sides, one side, sudden and medicine-induced send the case to clinician review (observed for "sudden"); Other opens free text.'],
 'men-q2':['diagnosis','Under 3 months sends the case to clinician review (served definition).'],
 'men-q3':['safety-screen','"No" sends the case to clinician review (observed, runs/e03-used-fin-only). In practice almost every first-time buyer is reviewed by a clinician.'],
 'men-q4':['safety-screen','"I\'ve never used any" sends the case to clinician review (observed, runs/e02-doctor-yes-only); which treatment was used does not change the default; Other opens free text.'],
 'men-q5':['safety-screen','"Yes" sends the case to clinician review (observed, runs/e10-scars).'],
 'men-q6':['safety-screen','High or unknown sends the case to clinician review (High observed, runs/e07-bp-high); Low has no effect (runs/e06-bp-low).'],
 'men-q7':['safety-screen','Over six months sends the case to clinician review (served definition). Asked even when blood pressure is "I don\'t know" (no condition in the definition; inferred).'],
 'men-q8':['safety-screen','Mental illness is a hard stop for the whole consultation (observed, runs/e04-mental); every other condition sends the case to clinician review (heart observed, runs/e11-heart).'],
 'men-q9':['safety-screen','Every symptom sends the case to clinician review (itchy scalp observed, runs/e14-itchy).'],
 'men-q10':['data-capture','"Yes" opens a free-text box for the prescriber; no effect on the offer.'],
 'men-q11':['data-capture','No effect on the offer; "No" shows the GP info pop-up.']};
for(const [id,[role,bd]] of Object.entries(qmeta)){const q=Q(id);q.engineRole=role;q.branchDetail=bd;q.branches=!['men-q10','men-q11'].includes(id)||id==='men-q10';}
Q('men-q4').purpose='Treatment history. Its only effect is the flag on "never used any": a man new to treatment is always reviewed by a clinician. It does not steer the product choice.';
Q('men-q6').purpose='Blood pressure screen (relevant to minoxidil). High or unknown is flagged; low blood pressure is not, even though minoxidil lowers blood pressure.';
Q('men-sec-fin-1').shownWhen='after Save with Finasteride or Propecia selected (runs/b3-men-save, runs/e15-propecia-save)';
Q('men-sec-fin-1').purpose='Side-effect acknowledgement for finasteride and Propecia (depression, suicidal thoughts, sexual dysfunction, possible persistence). Records informed consent; no branching.';
Q('men-sec-fin-1').evidence='observed';
Q('men-options').branchDetail='The server decides between Auto ("Based on what you have told us, our clinician has recommended the treatments below") and Offline ("We still need to review your consultation...") from every earlier answer. In Auto mode products that fail their own limits are hidden (smoking or alcohol hides both dutasteride products) and the default falls back to Finasteride; in Offline mode all five are listed. The product link pre-selects that product when it is allowed.';
Q('men-options').purpose='Product choice before the account wall. Every patient who passes the hard stops sees prices and a pre-selected product; the only difference is whether it is labelled as already recommended (Auto) or pending review (Offline).';
fs.writeFileSync('company.json',JSON.stringify(c,null,1));console.log('ok');
