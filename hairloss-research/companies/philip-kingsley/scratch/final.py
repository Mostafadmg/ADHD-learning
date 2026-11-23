import json, sys
sys.path.insert(0,'scratch')
from build_products import P
F=json.load(open('scratch/flows.json'))
HL='https://hairloss.philipkingsley.co.uk/'; WWW='https://www.philipkingsley.co.uk/'
def opt(fid,qid,label):
    for q in F[fid]:
        if q['id']==qid:
            for o in q['options']:
                if o['label']==label: return o
    raise KeyError((qid,label))
def q(fid,qid):
    for x in F[fid]:
        if x['id']==qid: return x
# overrides
o=opt('women','women-q4',"It's happened very suddenly")
o['effect']='For the baseline picture (wider parting) nothing changes, because the sudden-onset blocker lists every picture EXCEPT "Seeing more of my scalp or wider parting". For overall thinning, temple thinning or shedding, sudden onset leaves no plan and routes to the consultation screen (code).'
o['effectType']='hard-stop'; o['affects']=['p-consult-virtual','p-consult-clinic']
for lab in ['50 to 64','Over 65']:
    o=opt('men','men-q6',lab); o['effect']='No change for the baseline (Temples and Crown). For the Early signs and Temples pictures this age band removes Oral Finasteride and the 5% Combination Plan (only minoxidil 5%, the Topical Combination Plan and the two unmapped SKUs stay) (code: extracted/men-pattern-density-age-code.txt).'
    o['effectType']='product-removed'; o['affects']=['p-fin','p-5combo']
for lab in ['18 to 29','30 to 39','40 to 49']:
    o=opt('men','men-q6',lab); o['effect']='Baseline band. Under 50, Early signs (with noticeable thinning) and Temples also get Oral Finasteride and the 5% Combination Plan (code).'
q('men','men-q6')['branches']=True
q('men','men-q6')['purpose']='Age band; matters only for the Early signs and Temples pictures (50+ loses the oral-finasteride plans). There is no under-18 or exact age option; under-18s are excluded only by the start-screen declaration.'
for lab in ['Yes','No']:
    o=opt('women','women-q10a',lab); o['effect']='No rule uses menopause status (code): post-menopausal women are NOT offered the topical finasteride drops even though the drops leaflet says they suit post-menopausal women.'
    o['effectType']='marketing-only' if False else 'none'
q('men','men-q2a')['purpose']+=' Density changes the plan only for Early signs (needs the "thinned/receded noticeably" answer) and Temples and Crown with reduced density (needs a "scalp visible" answer); see extracted/men-pattern-density-age-code.txt.'
q('men','men-q2a')['branches']=True
q('men','men-q1')['purpose']+=' Patchy, Extensive and "Temples and Crown with reduced density" (without a visible-scalp answer) remove every named plan; only the unmapped SKUs PHI1220/PHI1221 remain (code). The 3% Combination Plan rule expects the label "Temples & Crown with Reduced Density", which no option carries, so it never fires.'
o=opt('men','men-q9','I have uncontrolled low or high blood pressure')
o['effect']+=' Only PHI1221 is removed because the main safety blocker lists this answer with a leading space (" I have uncontrolled...") so it never matches: a man with uncontrolled blood pressure is still offered minoxidil products (code; configuration error).'
o['effectType']='product-removed'
for lab in ["I'm happy to be recommended Finasteride","I would not like to be recommended Finasteride"]:
    o=opt('men','men-q9e',lab); o['effect']='Either answer ends the same way: the depression/anxiety answer in Q9 already trips the main safety blocker for every SKU, so no plan survives and the consultation screen is shown (code). The finasteride opt-out has no separate effect.'
o=opt('men','men-q4','It started to fall out quite suddenly'); o['effect']='Sudden loss: '+o['effect']
o=opt('men','men-q10a','Yes'); o['effect']='Opens two free-text boxes (medicine names and doses; what they are for). No rule reads them; no change to products (code). Presumably for human review.'; o['effectType']='extra-questions'
products=[{k:v for k,v in p.items() if k!='sku'} for p in P]
for p,src in zip(products,P):
    if src['sku']: p['name']=p['name']+(' [SKU %s]' % src['sku'] if 'SKU' not in p['name'] else '')
flows=[
 {'id':'men','name':"Men's hair loss assessment (men_quiz)",'audience':'men','entryUrl':HL,
  'stagesSummary':'Select quiz -> Select gender at birth (Male) -> start declaration (incl. "I am aware that Philip Kingsley\'s Finasteride and Minoxidil are unlicensed products") -> 12 questions (+ follow-ups) -> ACCOUNT WALL ("Almost done! Your details": name, DOB, email, password, GP and consent ticks) -> server-rendered results: plan choice ("Recommended" / "Other" groups, subscription) or "Choose your consultation type" (virtual or clinic booking).','questions':F['men']},
 {'id':'women','name':"Women's hair loss assessment (women_quiz)",'audience':'women','entryUrl':HL,
  'stagesSummary':'Select quiz -> Select gender at birth (Female) -> "How it works" start screen -> 12 questions (+ follow-ups) -> ACCOUNT WALL -> results: main product (SKU PHI1749, minoxidil-type) or Hair Shedding Drops plus a "Complete Your Routine" haircare add-on, or "Choose your consultation type".','questions':F['women']},
 {'id':'scalp','name':'Scalp assessment (scalp_quiz)','audience':'both','entryUrl':HL+'quiz/step/start/stepId/scalp_quiz_step0/',
  'stagesSummary':'Select quiz ("I am experiencing scalp irritation") -> start declaration -> 10 questions (Q2 only if already diagnosed) -> account wall -> scalp-care products (cosmetic, SKUs not mapped) or consultation. Walked live to the account wall with a synthetic baseline (run r08; Q1 = No skipped Q2 as the code says); product effects from code.','questions':F['scalp']},
]
for f in flows:
    for x in f['questions']:
        if f['id']=='scalp': x['evidence']='code' if x['id'] in ('scalp-q2','scalp-result','scalp-q10b') else 'observed'
rules=[
 dict(id='R1',flow='men',when='Any of: men-q3 = "I haven\'t noticed any yet"; men-q4 = "It started to fall out quite suddenly" or "It\'s not started yet"; men-q8 = Pain, Burning, Crusting or Bleeding; men-q9 = cancer/PSA, depression-anxiety-panic, or trying for a baby; allergy to BOTH minoxidil and finasteride',
      then='Every SKU is blocked, so no plan is offered and the consultation booking screen ("Choose your consultation type": virtual from £200, clinic from £345) is shown after the account wall.',effectType='hard-stop',affects=['p-consult-virtual','p-consult-clinic'],evidence='code',proof='quiz-definition-men.json rules[*].blockers (first OR group, shared by all SKUs); evaluated with scratch/engine.py, table extracted/men-one-change-code.json',confidence='high'),
 dict(id='R2',flow='men',when='men-q7a includes Itching or Dandruff and severity (men-q7f / men-q7b) = Severe',then='No plan; consultation screen.',effectType='hard-stop',affects=['p-consult-virtual','p-consult-clinic'],evidence='code',proof='extracted/men-one-change-code.json (q7f/q7b = Severe)',confidence='high'),
 dict(id='R3',flow='men',when='men-q7a includes Itching (mild/moderate) or Dandruff (mild/moderate) or Eczema (mild/moderate)',then='Hair-loss plans are replaced by scalp plans: unmapped SKUs PHI1306/PHI1309 (+PHI1307, Healthy Scalp Topical Combination Plan PHI1308 and 5% Healthy Scalp Combination Plan PHI1311 for mild dandruff; PHI1311 also for moderate dandruff).',effectType='product-switched',affects=['p-scalp-addons-men','p-hs-topcombo','p-5hs','p-min5','p-topcombo','p-fin','p-5combo'],evidence='code',proof='extracted/men-one-change-code.json (q7f, q7b, q7d)',confidence='high'),
 dict(id='R4',flow='men',when='men-q7a includes Psoriasis, Redness, Acne or Other (or severe eczema)',then='All named plans are removed; only unmapped SKUs PHI1220/PHI1221 remain. If those SKUs are retired on the server, the person reaches the consultation screen.',effectType='product-removed',affects=['p-min5','p-topcombo','p-fin','p-5combo'],evidence='code',proof='extracted/men-one-change-code.json',confidence='medium'),
 dict(id='R5',flow='men',when='men-q1 = Patchy or Extensive, or "Temples and Crown with reduced density" without a visible-scalp density answer, or Early signs with any density other than "thinned/receded noticeably"',then='All named plans are removed; only unmapped PHI1220/PHI1221 remain (the no_results_rules list shows Patchy and Extensive were meant to go to a consultation).',effectType='product-removed',affects=['p-min5','p-topcombo','p-fin','p-5combo'],evidence='code',proof='extracted/men-pattern-density-age-code.txt; quiz-definition-men.json no_results_rules',confidence='medium'),
 dict(id='R6',flow='men',when='men-q1 = Early signs (with noticeable thinning) or Temples, and men-q6 = 50 to 64 or Over 65',then='Oral Finasteride and the 5% Combination Plan are removed; minoxidil 5% and the Topical Combination Plan stay.',effectType='product-removed',affects=['p-fin','p-5combo'],evidence='code',proof='extracted/men-pattern-density-age-code.txt',confidence='high'),
 dict(id='R7',flow='men',when='men-q11a = Minoxidil',then='Removes Minoxidil 5%, the Topical Combination Plan and the 5% Combination Plan; Oral Finasteride (and PHI1221) stay.',effectType='product-removed',affects=['p-min5','p-topcombo','p-5combo'],evidence='code',proof='extracted/men-one-change-code.json q11a',confidence='high'),
 dict(id='R8',flow='men',when='men-q11a = Finasteride',then='Removes Oral Finasteride, the Topical Combination Plan and the 5% Combination Plan; Minoxidil 5% (and PHI1220) stay.',effectType='product-removed',affects=['p-fin','p-topcombo','p-5combo'],evidence='code',proof='extracted/men-one-change-code.json q11a',confidence='high'),
 dict(id='R9',flow='men',when='men-q9 = "I have uncontrolled low or high blood pressure"',then='Only PHI1221 is removed; minoxidil products stay because the main blocker value has a leading space and never matches (configuration error).',effectType='product-removed',affects=['p-sku1221'],evidence='code',proof='quiz-definition-men.json rules PHI1220 blockers value " I have uncontrolled low or high blood pressure"',confidence='high'),
 dict(id='R10',flow='men',when='Rule for SKU PHI1304 (3% Combination Plan)',then='Never fires: it requires the Q1 answer "Temples & Crown with Reduced Density", but the option is "Temples and Crown with reduced density". PHI1230 (wrong question label) and PHI1770-1772 (require itching/dandruff but are blocked by them) also never fire.',effectType='none',affects=['p-3combo'],evidence='code',proof='quiz-definition-men.json rules PHI1304, PHI1230, PHI1770-PHI1772',confidence='high'),
 dict(id='R16',flow='men',when='Answers that block every product (e.g. men-q8 = Pain)',then='The person still meets the same account wall after Q12; nothing on screen says they will be sent to a paid consultation.',effectType='none',affects=[],evidence='observed',proof='runs/exp-01-men-q8-pain vs runs/r05-baseline-men',confidence='high'),
 dict(id='R11',flow='women',when='Any of: women-q1 pregnant/breastfeeding = Yes; women-q2 chemo/radiotherapy = Yes; women-q3a = Circular bald patches, Bandlike recession or Something else; women-q5a = Redness, Psoriasis, Pimples/acne, Other or Not Sure, or Moderate/Severe itching, dandruff or eczema; women-q11a = Minoxidil or Other allergy; women-q12a = "I am taking oral minoxidil"',then='No plan; consultation screen.',effectType='hard-stop',affects=['p-consult-virtual','p-consult-clinic'],evidence='code',proof='extracted/women-one-change-code.json',confidence='high'),
 dict(id='R12',flow='women',when='women-q4 = "It\'s happened very suddenly"',then='Consultation for overall thinning, temple thinning or shedding, but NOT for "Seeing more of my scalp or wider parting", which still gets the main product (gap in the blocker list).',effectType='hard-stop',affects=['p-consult-virtual','p-consult-clinic','p-sku1749'],evidence='code',proof='quiz-definition-women.json PHI1749 blockers (AND group lists every picture except the wider parting)',confidence='high'),
 dict(id='R13',flow='women',when='women-q3a = "More shedding than usual (in the shower/on my brush)"',then='Main product PHI1749 is replaced by Hair Shedding Drops (cosmetic, PKC145).',effectType='product-switched',affects=['p-sku1749','p-shedding'],evidence='code',proof='extracted/women-one-change-code.json q3a',confidence='high'),
 dict(id='R14',flow='women',when='women-q6 scalp type, women-q7 texture, women-q8 length, women-q9 styling',then='Only change which "Complete Your Routine" haircare add-on SKU is shown (e.g. Fine -> PHI1684, Coarse/Coiled -> PHI1652 + PHI1678, any styling -> PHI1664, oily scalp -> PHI1686).',effectType='product-switched',affects=['p-w-routine'],evidence='code',proof='extracted/women-one-change-code.json q6-q9',confidence='high'),
 dict(id='R15',flow='women',when='women-q10a menopause = Yes (with or without HRT)',then='No effect: no women\'s rule offers a finasteride product, so post-menopausal women never get the topical finasteride drops online.',effectType='none',affects=[],evidence='code',proof='quiz-definition-women.json rules (no SKU references menopause)',confidence='high'),
]
recs=[
 dict(profile='Man, 32, Temples and Crown (Norwood 3 with crown), gradual, family history, no conditions (baseline)',offered=['p-topcombo','p-5combo','p-min5','p-fin','p-sku1220','p-sku1221'],default='p-5combo',note='Recommended group: Topical Combination Plan, 5% Combination Plan, PHI1220, PHI1221. Other group: Minoxidil 5%, Oral Finasteride. The default/first item on the real page is unknown (after the wall). Code result; the live walk confirmed the questions and the wall only.',evidence='code'),
 dict(profile='Man 50+, Temples or Early signs',offered=['p-topcombo','p-min5','p-sku1220','p-sku1221'],default=None,note='Oral finasteride plans drop out.',evidence='code'),
 dict(profile='Man with Patchy or Extensive loss',offered=['p-sku1220','p-sku1221'],default=None,note='Only unmapped SKUs; if retired, consultation screen.',evidence='code'),
 dict(profile='Man with sudden loss, scalp pain/burning/crusting/bleeding, cancer/PSA, depression history or trying for a baby',offered=['p-consult-virtual','p-consult-clinic'],default=None,note='Consultation route only.',evidence='code'),
 dict(profile='Woman, 38, wider parting, gradual, no scalp symptoms, medium hair (baseline)',offered=['p-sku1749','p-w-routine'],default='p-sku1749',note='Main product PHI1749 (minoxidil-type, name not found) + haircare add-on PHI1670.',evidence='code'),
 dict(profile='Woman with mainly shedding',offered=['p-shedding','p-w-routine'],default='p-shedding',note='Hair Shedding Drops (cosmetic) + add-on PHI1668.',evidence='code'),
 dict(profile='Woman pregnant/breastfeeding, on chemo, with patches, band-like loss, moderate+ scalp symptoms, minoxidil allergy or on oral minoxidil',offered=['p-consult-virtual','p-consult-clinic'],default=None,note='Consultation route only.',evidence='code'),
]
for r in recs:
    if r['default'] is None: r['default']=''
company={
 'slug':'philip-kingsley','company':'Philip Kingsley (PK Lab)','market':'UK','website':'https://www.philipkingsley.co.uk/hair-loss/pklab/treatments','parent':'Philip Kingsley Products Limited (company 02834292, 54 Green Street, London W1K 6RU); Philip Kingsley Trichological Clinic',
 'audiences':['men','women'],
 'model':'Heritage trichology clinic and haircare brand selling compounded (unlicensed) minoxidil/finasteride subscriptions through an online quiz, with paid trichologist consultations as the fallback route.',
 'checkedOn':'2026-11-23',
 'access':{'howTested':['live-walk','site-code','public-docs'],
   'accountWall':'Straight after the last question of every quiz (step *_step_user, "Almost done! Your details": first name, last name, date of birth, email, password, GP and consent ticks). It comes BEFORE any result: the plan choice and the consultation screen are only shown after /quiz/step/register.',
   'blockers':['Account wall before results: the recommendation screen and the consultation screen could not be seen live.','Some SKUs in the rules (PHI1220, PHI1221, PHI1306, PHI1307, PHI1309, PHI1749, women\'s add-ons, scalp products) have no public product page that could be found, so their names are unknown.'],
   'coverageNote':'Both hair-loss quizzes were walked live to the account wall with the protocol baselines (runs r05, r07); every screen matched the served quiz definition. The full quiz definition (all questions, show-if conditions, product rules with conditions and blockers, and the no-results template) is served in every quiz page and was saved; product effects for every option were computed by running the site\'s own rule logic (ported to scratch/engine.py) one change at a time from each baseline. These are "code" findings: the results page itself is after the wall. The scalp quiz was walked live to the wall with a synthetic baseline (r08). One wall check (exp-01) confirmed that a man whose answers block every product meets the same wall with no warning.'},
 'products':products,'flows':flows,'rules':rules,'experiments':[{'id':'exp-01','flow':'men','changed':'men-q8: None of the above -> Pain (a code-predicted consultation case)','result':'Same account wall straight after Q12, with no hint that no plan will be offered; the consultation screen is only reachable after creating an account.','run':'runs/exp-01-men-q8-pain'}],'recommendations':recs,
 'engineSummary':'All logic is client-side and visible. Each product SKU has a rule: "conditions" (pattern, density, age, scalp state) that must be true and "blockers" (safety answers) that must all be false; questions are matched by their label text. Every SKU that passes is listed, split into "Recommended" and "Other" groups. If nothing passes, the person is sent to a paid trichologist consultation (virtual from £200, clinic from £345). Results of either kind are shown only after an account is created. The three routes are therefore: subscribe (some SKU passes), consultation (all blocked), and the clinic booking link that skips the quiz.',
 'strengths':['Whole quiz in plain sight and logically simple: a clear triage to subscription or consultation.','Distinct consultation fallback with a calendar (trichologist or senior trichologist, male or female consultant) instead of a flat refusal.','Women have their own quiz with scalp-symptom triage and a shedding route (cosmetic drops).','Scalp-first philosophy: scalp symptoms swap hair-loss plans for scalp plans or a consultation; a separate scalp quiz exists.','Leaflets state plainly that the products are unlicensed and compounded under pharmacist supervision; the men\'s start screen makes the person confirm it.'],
 'weaknesses':['Account wall before any result: the person gives name, DOB, email and password before learning whether they get a plan or a £200+ consultation.','Configuration errors in served rules: blood-pressure blocker has a leading space (minoxidil still offered with uncontrolled BP); the 3% Combination Plan rule can never fire; PHI1230 and PHI1770-1772 can never fire; label typos ("curerrently", "redness??").','Women: sudden onset with a widening parting is not routed to a consultation; post-menopausal women are never offered the finasteride drops despite the leaflet saying they suit them; menopause and HRT answers are unused.','Mixed messages: the men\'s treatments page says "FULLY LICENSED - Tested and certified for the UK" while the leaflets and start screen say unlicensed.','Different prices for the same product on two store views (oral finasteride £40 vs £42); virtual consultation "from £150" on one page and "from £200" on the price list; dosing 2 ml vs 2.5 ml on different pages.','No exact age question (bands only, no under-18 option); no blood pressure or heart questions beyond one tick-box; medicines are free text no rule reads.','Who prescribes is not stated anywhere seen (trichologists are not prescribers; the leaflet only says "pharmacist supervision").'],
 'opportunities':['Show the outcome (plan or consultation) before asking for an account, or at least say which route the person is on.','A prescriber-led women\'s offer: PK\'s women\'s online route is minoxidil-type drops or cosmetic shedding drops only; no spironolactone, no finasteride for post-menopausal women online.','Clear, consistent licensing and prescriber information as a trust advantage.','A cheaper, faster path for people PK routes to a £200-£345 consultation (sudden shedding, mild scalp symptoms) with a photo review by a prescriber.'],
 'sources':[
  {'title':'PK Lab men\'s treatments page','url':WWW+'hair-loss/pklab/treatments'},
  {'title':'Women\'s treatments page','url':WWW+'female-hair-loss/treatments'},
  {'title':'Assessment (select quiz)','url':HL},
  {'title':'Men\'s quiz start (serves the quiz definition)','url':HL+'quiz/step/start/?stepId=men_quiz_step0'},
  {'title':'Women\'s quiz start (serves the quiz definition)','url':HL+'quiz/step/start/?stepId=women_quiz_step0'},
  {'title':'Scalp quiz start','url':HL+'quiz/step/start/stepId/scalp_quiz_step0/'},
  {'title':'Quiz engine JS','url':HL+'static/version1795163952/frontend/philipkingsley/hairloss/en_GB/PhilipKingsley_Quiz/js/quiz.min.js'},
  {'title':'Leaflet: Minoxidil 5% & Finasteride 0.1% Scalp Drops','url':WWW+'pklabs-patient-information'},
  {'title':'Leaflet: Finasteride 1mg Complex','url':WWW+'pklabs-patient-information-finasteride-1mg-complex'},
  {'title':'Leaflet: Topical Minoxidil 5% and 3%','url':WWW+'pklabs-patient-information-topical-minoxidil'},
  {'title':'Hair-loss terms of sale (subscriptions)','url':WWW+'hair-loss-terms-of-sale'},
  {'title':'Hair-loss terms and conditions (50% first-subscription offer for men)','url':HL+'hair-loss-terms-conditions'},
  {'title':'Clinic services and price list','url':WWW+'treatments'},
  {'title':'Virtual consultation page','url':WWW+'clinics/virtual-consultation'},
  {'title':'The 5% Combination Plan','url':HL+'the-5-combination-plan.html'},
  {'title':'The Topical Combination Plan','url':HL+'the-topical-combination-plan.html'},
  {'title':'The 3% Combination Plan','url':HL+'the-3-combination-plan.html'},
  {'title':'The Healthy Scalp Topical Combination Plan','url':HL+'healthy-scalp-topical-combination-plan.html'},
  {'title':'The 3% Healthy Scalp Combination Plan','url':HL+'minoxidil-3-healthy-scalp-combination-plan.html'},
  {'title':'The 5% Healthy Scalp Combination Plan','url':HL+'minoxidil-5-healthy-scalp-combination-plan.html'},
  {'title':'Minoxidil 5% Scalp Drops','url':HL+'minoxidil-5-scalp-drops.html'},
  {'title':'Minoxidil 3% Scalp Drops','url':HL+'minoxidil-3-scalp-drops.html'},
  {'title':'Oral Finasteride','url':HL+'density-oral-finasteride.html'},
  {'title':'The Combination Plan (www)','url':WWW+'the-combination-plan.html'},
  {'title':'Hair Shedding Drops','url':WWW+'hair-shedding-drops.html'}],
 'limitations':['The results page is behind the account wall, so the real plan list, its order, the default choice and plan-length prices (1/2/3-month) were not seen; product effects come from running the served rules, not from a live results screen.','The server may hide retired SKUs (for example PHI1220/PHI1221) on the results page; if so, Patchy/Extensive men and men with psoriasis/redness/acne would reach the consultation screen instead. This cannot be tested without an account.','Product prices are the single prices shown on product pages; whether they are per month or per 3-month delivery is not stated clearly (the pages say the plan "rolls on a three monthly basis"; the treatments page says every 1, 2 or 3 months).','Several SKUs could not be named. Contents of the 3%/5% and Healthy Scalp combination plans are partly inferred from their names.','Who prescribes and which pharmacy compounds and dispenses was not found in public pages.']
}
json.dump(company,open('company.json','w'),indent=1,ensure_ascii=False)
print('written')
