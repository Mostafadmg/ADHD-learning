# Stage 3 (verify) patch. Idempotent: run on company.json after stage 2.
import json
P='company.json'
d=json.load(open(P))
def rule(i): return next(r for r in d['rules'] if r['id']==i)
def flow(i): return next(f for f in d['flows'] if f['id']==i)
def q(f,i): return next(x for x in flow(f)['questions'] if x['id']==i)
def opt(f,qi,lab):
    return next(o for o in q(f,qi)['options'] if o['label'].startswith(lab))
def prod(i): return next(p for p in d['products'] if p['id']==i)
def add_proof(r,txt):
    if txt not in r['proof']: r['proof']=r['proof']+'; '+txt

# --- experiments
exps=[
 ('verify-baseline-men','men','none (stage 3 fresh baseline replay)','Matches the record: plan page recommends Chew+ (19277); checkout $100.00 today, then $204.99 every 3 months.'),
 ('verify-baseline-men-gel','men-gel','none (stage 3 fresh baseline replay)','Matches the record: /hair-treatment-plan-gel?productId=19267, Gel+ recommended.'),
 ('verify-baseline-men-legacy','men-legacy','none (stage 3 fresh baseline replay)','Matches the record: account wall /quiz/lead?products=211,239.'),
 ('verify-R1-drop','men',"men-form: 'not sure' -> 'Topical Drop (Rx Serum)' (re-test of R1)",'Confirmed: Drop+ (18636) recommended; plan-page data shows $149.93 first 3 months, list $209.99.'),
 ('verify-R2-afford','men',"men-priority: 'Balanced' -> 'Keeping treatment simple & affordable' (re-test of R2)",'Confirmed: Chew (18640) recommended.'),
 ('verify-R3-scalp','men',"men-picture: 'Not seeing a match?' -> 'Mostly Scalp' (re-test of R3)","Confirmed: stop screen 'This treatment may not be a good fit right now.' at ?step=4."),
 ('verify-R4-wv','men','men-state: Texas -> West Virginia (re-test of R4 with a state not tried before)',"Confirmed: 'We currently don't serve in your state. Please check back soon.'"),
 ('verify-R4-de','men','men-state: Texas -> Delaware (re-test of R4 with a state not tried before)',"Confirmed: same refusal message; the plan page is not reached."),
 ('verify-R5-notick','men',"men-confirm: '18+ and assigned male at birth' box left unticked (re-test of R5)","Confirmed: the box starts unticked for this visitor and 'Show my plan' is disabled."),
 ('verify-R8-patchy','men-legacy',"leg-where: 'Patchy (coin-sized bald spots)' (re-test of R8)",'Confirmed: jumps straight to /request/lead.'),
 ('verify-R9-nowhere','men-legacy',"leg-where: 'Nowhere yet' (re-test of R9)",'Confirmed: family-history question shown; /quiz/lead?products=239,499,500 (no finasteride).'),
 ('verify-R10-pills','men-legacy',"leg-form: 'Pills (taken orally)' (re-test of R10)",'Confirmed: /quiz/lead?products=211,989 (foam swapped for oral minoxidil).'),
 ('verify-R15-tret','men-legacy',"leg-ingredients: 'Products with tretinoin' (re-test of R15)",'Confirmed: /quiz/lead?products=211,11840 (foam swapped for Minoxidil+ Spray).'),
 ('verify-gap-juststarting','men',"men-picture: 'Moderate' -> 'Just Starting' (not replayed before)","No change: Chew+ 19277; plan page differs from baseline only in the echoed label."),
 ('verify-gap-goalboth','men',"men-goal: 'Regrow' -> 'Both - Regrow & Preserve' (not replayed before)","No change: Chew+ 19277; only the echoed label differs."),
 ('verify-gap-early','men',"men-stage: 'Receding hairline or crown thinning' -> 'Early signs of hair loss' (not replayed before)","No change: Chew+ 19277; only the echoed label differs ('Patterned' becomes 'Early')."),
 ('verify-gap-gel-sidefx','men-gel',"gel-treated: 'No' -> 'Yes', then 'How did it go?' = 'Had side effects' (not replayed before)","Extra question 'How did it go?' shown; no warning; Gel+ 19267 still recommended."),
 ('verify-gap-leg-pills-tret','men-legacy',"leg-form 'Pills' AND leg-ingredients 'Products with tretinoin' (first combination test)","/quiz/lead?products=211,989: the pill preference wins; no Minoxidil+ Spray is added. Matches the served rule (spray only when no pill preference)."),
 ('verify-products','catalogue','none: 10 product pages and the products price data re-read live','Names, actives, strengths and 3-month prices of p1-p9, p11-p17 match the record (runs/verify-products/net/05-*graphql.json). Drop+ checked in runs/verify-R1-drop plan-page data.'),
]
have={e['id'] for e in d['experiments']}
for i,f,c,r in exps:
    if i not in have: d['experiments'].append({'id':i,'flow':f,'changed':c,'result':r,'run':'runs/'+i})

# --- rules
add_proof(rule('R1'),'re-tested stage 3: runs/verify-R1-drop (Drop+ 18636); served chunk 4186-023f24e4c45a5ed8.js unchanged on 2026-11-23')
add_proof(rule('R2'),'re-tested stage 3: runs/verify-R2-afford (Chew 18640)')
add_proof(rule('R3'),'re-tested stage 3: runs/verify-R3-scalp')
add_proof(rule('R4'),'re-tested stage 3: runs/verify-R4-wv (West Virginia) and runs/verify-R4-de (Delaware) both refused; live chunk 7039 still lists AA, AE, AP, DC, DE, ID, KS, MS, NM, PR, RI, WV')
add_proof(rule('R5'),'re-tested stage 3: runs/verify-R5-notick (box unticked by default for this visitor; button disabled). Note: the component default in code is ticked; a PostHog flag (hl_funnel_gender_checkbox_default = unchecked) turns it off, so another visitor may see it pre-ticked')
add_proof(rule('R8'),'re-tested stage 3: runs/verify-R8-patchy')
add_proof(rule('R9'),'re-tested stage 3: runs/verify-R9-nowhere')
add_proof(rule('R10'),'re-tested stage 3: runs/verify-R10-pills')
add_proof(rule('R15'),'re-tested stage 3: runs/verify-R15-tret; runs/verify-gap-leg-pills-tret shows the swap does not happen when pills are preferred')
r6=rule('R6')
r6['proof']=r6['proof'].replace(' - stage 2 should confirm with replays','')
add_proof(r6,'stage 3 added runs/verify-gap-juststarting, verify-gap-goalboth, verify-gap-early (all Chew+ 19277, only echoed labels differ)')
r24=rule('R24')
r24['when']="Patient is a woman (no question asks sex; the only check is the '18+ and assigned male at birth' tick box)"
r24['then']=("Women cannot continue: without the tick 'Show my plan' stays disabled. The FAQ says only people assigned male at birth can use Keeps. "
 "A separate page /not-eligible-user/sex says 'We're sorry Keeps can't help you, but Nurx can', but the hair quizzes do not send anyone there "
 "(in the served code it is only named in the route list of the app bundle).")
r24['evidence']='observed'
r24['proof']=("runs/verify-R5-notick (button disabled without the tick); docs: https://www.keeps.com/faq/can-women-use-keeps; "
 "runs/entry-points/16.txt (Nurx page opened directly); code: route NOT_ELIGIBLE_USER_SEX appears only in pages/_app chunk, not in the quiz page chunks (checked 2026-11-23)")
r24['confidence']='high'
ids={r['id'] for r in d['rules']}
if 'R25' not in ids:
    d['rules'].append({'id':'R25','flow':'men-legacy','when':"leg-form = 'Pills (taken orally)' together with 'Products with tretinoin' (or 'Vitamins and supplements')",
     'then':'The pill preference wins: finasteride + oral minoxidil (211, 989). The Minoxidil+ Spray swap (R15/R16) does not happen, because the spray is only offered when no pill preference is given.',
     'effectType':'product-removed','affects':['p12','p11'],'evidence':'observed',
     'proof':'runs/verify-gap-leg-pills-tret (/quiz/lead?products=211,989); code: quiz-definition.legacy-mini-quiz.js part 2 (MINOXIDIL_SPRAY include = no pills AND (tretinoin OR vitamins)). The vitamins + pills case is from code only.',
     'confidence':'high'})
if 'R26' not in ids:
    d['rules'].append({'id':'R26','flow':'men-gel','when':"gel-treated = 'Yes'",
     'then':"Adds 'How did it go?'. 'Had side effects' gives no warning or follow-up and Gel+ is still recommended.",
     'effectType':'extra-questions','affects':[],'evidence':'observed','proof':'runs/verify-gap-gel-sidefx vs runs/verify-baseline-men-gel','confidence':'high'})

# --- options / questions evidence upgrades
for f,qi,lab,run in [('men','men-goal','Both','verify-gap-goalboth'),('men','men-stage','Early signs','verify-gap-early'),
                     ('men','men-picture','Just Starting','verify-gap-juststarting'),('men-gel','gel-results','Had side effects','verify-gap-gel-sidefx')]:
    o=opt(f,qi,lab); o['evidence']='observed'
    if 'runs/'+run not in o['effect']: o['effect']=o['effect'].rstrip('.')+'. Confirmed live: runs/'+run+'.'
o=opt('men-gel','gel-treated','Yes'); o['evidence']='observed'
if 'verify-gap-gel-sidefx' not in o['effect']: o['effect']+=' Confirmed live: runs/verify-gap-gel-sidefx.'
q('men-gel','gel-results')['evidence']='observed'
for lab,run in [('West Virginia','verify-R4-wv'),('Delaware','verify-R4-de')]:
    o=opt('men','men-state',lab); o['evidence']='observed'
    if run not in o['effect']: o['effect']=o['effect'].rstrip('.')+'. Confirmed live: runs/'+run+'.'
o=opt('men','men-confirm','Not ticked'); 
if 'verify-R5' not in o['effect']: o['effect']+=" Confirmed live: runs/verify-R5-notick. Unticked by default only because of a feature flag; the code's own default is ticked."
o=opt('men-legacy','leg-ingredients','Products with tretinoin') if any(x['id']=='leg-ingredients' for x in flow('men-legacy')['questions']) else None
if o and 'verify-gap-leg-pills-tret' not in o['effect']:
    o['effect']=o['effect'].rstrip('.')+". Only when no pill preference is given: with 'Pills' the basket stays finasteride + oral minoxidil (runs/verify-gap-leg-pills-tret)."

# --- products
p7=prod('p7')
p7['priceDetail']=p7['priceDetail'].replace("Found only in the price data the products page loads (runs/catalogue/net); it has no product page or card of its own.",
  "It has no card of its own: it is the 'Foam' choice on the Topical Finasteride and Minoxidil page (runs/verify-products/32.txt, radio 'Gel · Foam'). Price re-checked live in runs/verify-products/net/05-*graphql.json (ids 1000, 19063).")
p7['url']='https://www.keeps.com/our-products/topical-finasteride-and-minoxidil'
p7['evidence']='observed'
p2=prod('p2')
if 'general regulatory knowledge' not in p2['legalStatus']:
    p2['legalStatus']=p2['legalStatus'].replace('Dutasteride is not FDA-approved for hair loss in any form.','(Dutasteride is not FDA-approved for hair loss in any form: general regulatory knowledge, inferred, not stated by Keeps.)')

# --- recommendations
for r in d['recommendations']:
    if r['profile'].startswith('Baseline woman'):
        r['note']=("Not served. There is no sex question; the '18+ and assigned male at birth' tick box keeps 'Show my plan' disabled (runs/verify-R5-notick). "
                   "FAQ: 'only those assigned male at birth can use Keeps'. A /not-eligible-user/sex page refers women to Nurx, but the quiz does not route there.")
        r['evidence']='observed'
    if r['profile'].startswith('Man in a refused state'):
        r['note']="'We currently don't serve in your state. Please check back soon.' Proved live for Idaho (runs/exp-09), West Virginia (runs/verify-R4-wv) and Delaware (runs/verify-R4-de); the other nine codes come from the served code list."

# --- summary text
d['engineSummary']=d['engineSummary'].replace("women are referred to Nurx.","women cannot pass the tick box (the FAQ says the service is only for people assigned male at birth).")
w=d['weaknesses']
d['weaknesses']=[x.replace("the loaders ('Confirming clinical eligibility') are timed animations.","the loaders ('Confirming clinical eligibility') are timed animations (about 5 seconds, set in served chunk 6717).") for x in w]
L=[]
for x in d['limitations']:
    if x.startswith('Not every'):
        x=("Not every 'no effect' option was replayed one by one. Still not replayed: stages 'Visible' and 'Not sure', picture 'Mild', second picture 'Receding Hairline', "
           "durations '6-12 months', '3+ years' and 'I'm not sure', comments 'I'm not sure', 'How did it go?' answers 'Saw some results' and 'Stopped too early', and most gel options. "
           "The served code gives them no branch condition and 17 sampled replays (13 in stage 2, 4 in stage 3) agreed.")
    if x.startswith('Only Idaho'):
        x=("At the state gate Idaho, West Virginia and Delaware (refused) and California, Texas and Arkansas (accepted) were replayed; the other refused codes come from the served code list. "
           "Kansas itself was not replayed (typing 'Kansas' selects Arkansas first).")
    if x.startswith('Legacy quiz: only'):
        x=("Legacy quiz: only the family option 'I'm not sure' was replayed, and multi-selects were tested one option at a time except one combination (pills + tretinoin, runs/verify-gap-leg-pills-tret). "
           "Other combinations rest on the served rule table.")
    L.append(x)
d['limitations']=L
cn=d['access']['coverageNote']
if 'Stage 3' not in cn:
    d['access']['coverageNote']=cn+(" Stage 3 (independent verify) replayed all three baselines fresh, re-tested 9 high-impact rules live (all confirmed), "
       "ran 5 new gap replays and re-read 10 product pages plus the live price data.")
d['access']['coverageNote']=d['access']['coverageNote'].replace("Keeps does not treat women (refers to Nurx).","Keeps does not treat women (FAQ; tick-box gate).")

d['verification']={
 'checked':[
  'All three baselines replayed fresh (runs/verify-baseline-men, -men-gel, -men-legacy): end states match the record exactly (Chew+ 19277 with $100.00 then $204.99 per 3 months; Gel+ 19267; legacy 211,239).',
  "R1 form 'Topical Drop' -> Drop+ 18636: confirmed live (runs/verify-R1-drop) and in the served code (chunk 4186-023f24e4c45a5ed8.js, still the version served on 2026-11-23).",
  "R2 priority 'simple & affordable' -> Chew 18640: confirmed live (runs/verify-R2-afford) and in code.",
  "R3 'Mostly Scalp' stop: confirmed live (runs/verify-R3-scalp) and in code (isKickout with hideIf).",
  'R4 refused states: confirmed live for two new states, West Virginia and Delaware (runs/verify-R4-wv, verify-R4-de); the excluded list in live chunk 7039 is unchanged.',
  "R5 tick box: confirmed live (runs/verify-R5-notick); default unticked comes from a feature flag.",
  "R8 legacy patchy -> /request/lead, R9 'Nowhere yet' -> 239,499,500, R10 pills -> 211,989, R15 tretinoin -> 211,11840: all confirmed live (runs/verify-R8..R15).",
  "R24 women: re-checked; the gate is the tick box plus the FAQ, not a redirect to Nurx (see corrected).",
  'Product facts re-checked against the live price data and product pages (runs/verify-products): names, actives, strengths and 3-month prices of Chew, Chew+, Drop, Drop+, Gel+, topical finasteride/minoxidil gel and foam, finasteride 1 mg, minoxidil foam, oral minoxidil, Minoxidil+ Spray, ketoconazole, thickening shampoo, conditioner, pomade and Daily Hair Defense all match.',
  "Catalogue completeness: every hair product linked from /our-products is in the catalogue; the other links (combo, powerhouse, quicky, weekend, sildenafil, tadalafil) are sexual-health products.",
  "Gaps filled: picture 'Just Starting', goal 'Both', stage 'Early signs', gel 'Had side effects', legacy pills + tretinoin (runs/verify-gap-*). None changed the product except as the served rules predict.",
  "Loader claim: the 'Finalizing your approval' loader is a fixed 5.1-second timer in served chunk 6717 (code)."],
 'corrected':[
  "R24 rewritten: the quiz does not send women to the Nurx page; they are stopped by the tick box, and the FAQ says only people assigned male at birth can use Keeps. The Nurx page exists but is only named in the app's route list.",
  "p7 (topical finasteride/minoxidil foam): was 'code, no product page'; it is the 'Foam' choice on the topical finasteride and minoxidil page. Evidence raised to observed and URL fixed.",
  "p2 legal status: the remark that dutasteride is not FDA-approved for hair loss is general regulatory knowledge, now labelled inferred rather than stated as a site fact.",
  "R6 proof: removed the stale 'stage 2 should confirm' note and added the stage 3 replays.",
  "Added R25 (legacy: a pill preference blocks the Minoxidil+ Spray swap) and R26 (gel: 'Had side effects' changes nothing), both observed.",
  "Option evidence raised from code to observed where a stage 3 run now proves it (goal 'Both', stage 'Early signs', picture 'Just Starting', West Virginia, Delaware, gel 'Yes' and 'Had side effects').",
  "Limitations, coverage note, engine summary and the woman and refused-state recommendation notes updated to match."],
 'stillUnverified':[
  'Everything after the account wall: the medical intake questions, photos, blood-pressure step and whether the clinician ever changes the quiz product.',
  "Nine of the twelve refused state codes (AA, AE, AP, DC, KS, MS, NM, PR, RI) rest on the served code list only; Idaho, West Virginia and Delaware were replayed. Kansas was never replayed.",
  'Several no-effect options of the main and gel quizzes (listed in limitations) and most legacy multi-select combinations rest on the served code, not on replays.',
  'Minoxidil Solution (p10), the Finasteride & Minoxidil bundle (p18), the older Chew formula (p19) and the visit fee (p20) were not re-checked in stage 3.',
  "The legacy campaign-only shampoo rule ('I want thicker hair' adds shampoo and conditioner for some campaigns) was read in code but its trigger was not seen.",
  'Prices are promotional (Black Friday offer) and feature flags vary by visitor.'],
 'verdict':("Good trust for what happens before the account wall. Every high-impact rule I re-tested (9 rules, 13 live runs plus code re-reads of the "
  "current served chunks) came out as recorded, the three baselines replayed to the same product and price, and 16 product price and strength facts "
  "matched the live price data. The main fault found was the women's route: the report said women are referred to Nurx, but the quiz never routes "
  "there; women are simply blocked by the tick box and told by the FAQ that Keeps is for people assigned male at birth. A few labels were "
  "tightened. The report cannot say anything reliable about the medical intake or the clinician's decisions, which sit behind payment and sign-in, "
  "and prices are time-limited promotions.")}
json.dump(d,open(P,'w'),indent=2,ensure_ascii=False)
print('ok', len(d['experiments']), len(d['rules']))
