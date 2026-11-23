import json, re
BASE='/home/user/ADHD-learning/hairloss-research/companies/hims-uk/'
d=json.load(open(BASE+'raw/flow-anon-hair.a9a88e4a.graphql.json'))['data']['flowVersion']
steps={s['id']:s for s in d['steps']}
nxt={b['sourceStepId']:b['targetStepId'] for b in d['branches']}
def txt(n):
    if n is None: return ''
    if isinstance(n,str): return n
    if isinstance(n,list): return ' '.join(txt(x) for x in n)
    if isinstance(n,dict):
        if n.get('nodeType')=='text': return n.get('value','')
        if 'content' in n and 'nodeType' in n:
            sep='\n' if n['nodeType'] in ('document','unordered-list','ordered-list') else ''
            return sep.join(txt(c) for c in n['content'])
    return ''
def clean(t): return re.sub(r'\n\s*\n+','\n',(t or '').replace('\xa0',' ')).strip()
ordered=[]; cur=d['firstStep']['id']; i=0
while cur:
    s=steps[cur]; i+=1
    c=(s.get('content') or {}).get('document') or {}
    pres={p['optionValue']:p for p in c.get('optionPresentation',[])}
    blocks=c.get('blocks') or {}
    callouts=[{'title':b['fields'].get('title'),'body':clean(txt(b['fields'].get('body')))} for b in blocks.values() if b.get('type')=='flowStepCallout']
    panels=[{k:(clean(txt(v)) if isinstance(v,dict) else v) for k,v in b['fields'].items() if k in ('heading','body','attributionName','startLabel','endLabel','badge')} for b in blocks.values() if b.get('type')=='flowStepPanel']
    discl=[{'title':b['fields'].get('title'),'body':clean(txt(b['fields'].get('body')))} for b in blocks.values() if b.get('type')=='flowStepDisclaimer']
    auto=[b['fields'].get('delayMs') for b in blocks.values() if b.get('type')=='flowStepAutoAdvance']
    summ=[{'type':b['type'],**{k:v for k,v in b['fields'].items() if k in ('title','heading','label','suffix','internalName')}} for b in blocks.values() if b.get('type','').startswith('flowStepAnswerSummary')]
    o={'order':i,'stepId':s['id'],'stepType':s['stepType'],'questionText':clean(s.get('questionText')),
       'description':clean(s.get('description')) or None,'cta':(s.get('ctaText') or c.get('ctaText') or None),
       'required':s.get('required'),
       'datapointKey':(s.get('datapoint') or {}).get('key'),'datapointType':(s.get('datapoint') or {}).get('type'),
       'options':[{'value':op['value'],'label':op['label'],**({'sublabel':pres[op['value']]['description']} if pres.get(op['value'],{}).get('description') else {}),**({'hasImage':True} if pres.get(op['value'],{}).get('assetId') else {})} for op in (s.get('options') or [])],
       'bodyText':clean(txt(c.get('body'))) or None,
       'callouts':callouts or None,'panels':panels or None,'disclaimers':discl or None,
       'autoAdvanceMs':auto[0] if auto else None,'answerSummaryBlocks':summ or None,
       'nextStepId':nxt.get(cur)}
    ordered.append({k:v for k,v in o.items() if v not in (None,[])})
    cur=nxt.get(cur)
out={
 '_about':'Hims UK hair-loss quiz definition, rebuilt from what the site serves to an anonymous browser. Part 1 is the complete anonymous flow (exact wording, every option, the one-path branch table). Part 2 lists what public code and documents show about the steps behind the account wall. Checked 2026-11-23.',
 'anonymousFlow':{
   'source':'GraphQL query "Flow" (flowVersion) that app.forhims.co.uk itself sends to https://api.external.eu.eucalyptus.vc/graphql when the quiz opens. Raw copy: raw/flow-anon-hair.a9a88e4a.graphql.json (also runs/baseline-men/net/04-*.json).',
   'entry':'https://www.forhims.co.uk/c/hl -> 302 https://app.forhims.co.uk/anon-flow/hair?t=hair -> /flow/a9a88e4a-89b9-47ae-8138-3a1acaa41594?t=hair&anon_flow_key=hair',
   'flowId':'09f03478-388f-4bf7-882f-ca4ea79f6258 (from feature flag cfg_anon_flow_version_map.hair)',
   'flowVersionId':d['id'],'firstStepId':d['firstStep']['id'],
   'branchModel':'The served definition has 21 steps and 20 branches. Every step has exactly one outgoing branch and the branch objects carry no condition (the client only asks for id, sourceStepId, targetStepId). So the anonymous quiz is one straight path: no answer can skip, add or stop a step. After each answer the browser posts it (mutation SubmitStepResponseAnonymously, under a guest token, kept 7 days) and the server replies with nextStep; in the baseline run the reply always matched this table.',
   'steps':ordered,
   'branches':[{'from':b['sourceStepId'],'to':b['targetStepId']} for b in d['branches']],
   'endsAt':'https://app.forhims.co.uk/start/signup?t=hair&anon_flow_key=hair (email field: the account wall)'
 }
}
out['behindTheAccountWall']={
 'note':'Nothing in this block was seen on a live page. It is what publicly served code and feature flags show about the steps after sign-up. The medical questions themselves are NOT here: they are fetched only for signed-in users (route /triage/:triageSessionId/flows/:flowVersionId).',
 'signUpSteps_code':[
   {'screen':'email','heading':'Ready to see if you’re eligible?','sub':'Next, we’ll cover your health and medical history, as well as treatment options.','field':'Email address','seenLive':True},
   {'screen':'name','heading':"What's your name?",'fields':['First name','Last name'],'hint':'To avoid delays to your order, please ensure this matches the name on your ID'},
   {'screen':'password','label':'Create password','checkbox':'I agree to the terms and conditions and privacy policy'}],
 'sourceSignUp':'raw/app/chunks/start-signup-ub7udp1x.js (message ids startSignupHims.*)',
 'platformSettingsForHair_flags':{'requiresScreeningQuiz':True,'isUpfrontPayment':True,'requiresGpAddress':True,'requiresPrescriberCall':False,'requiresPrescriberBooking':False,'decoupleInitialQuiz':True,'isMultipleMedication':False,'escalateSeniorConsults':True,'fulfillOnPrescribe':False,'source':'feature flag consultation_flow_config.HAIR evaluated for brand hims-uk (raw/app/launchdarkly-flags-hims-uk-anon.json)'},
 'flowStepTypesThePlatformSupports':['SINGLE_SELECT','MULTI_SELECT','BOOLEAN','DATE','NUMBER','TEXT','LONG_TEXT','PHOTO_UPLOAD','LIVE_PHOTO','FILE_UPLOAD','VIDEO','INFO','STORYTELLING','REDIRECT'],
 'eligibilityEngine_code':{
   'query':'HimsUkHairPurchaseOptions(consultationId) -> consultation.purchasePrompt.options { recommendedPreset, defaultPreset, entries[ PurchasePreset { contentKey, eligible, denials, paymentPlan, offeringSelection.sequenceSelections.sequence { deliveryIntervalCode, tags } } ] }',
   'meaning':'The server returns every product/plan combination ("preset") with eligible true/false and a list of denials (types seen in code: PurchasePresetRuleMatchedDenial, PurchasePresetMissingDenial). The hero product is the one holding recommendedPreset, else defaultPreset, else the first. A product whose default preset has eligible === false is listed as unavailable and greyed out. Strength comes from sequence tags that look like "1.1mg"; plan length from the delivery interval code.',
   'contentKeyToProductId':{'fin-min-chew':'6BFr0YdOjT','min-chew':'hc8KoyPfdg','supplement-blend':'UjPlhXiL','finasteride':'6wTK2oBx','topical-fin-min-spray-keto-biotin':'ZggiM0GFpM','topical-fin-min-spray':'P61DhG9W','topical-fin-min-serum':'KgktFDR2','minoxidil-serum':'cP3drAvl','regaine':'PGeVqBFR','combo-kit':'s2hF6Mdn'},
   'cardOrderOnTreatmentOptionsScreen':{'oral':['6BFr0YdOjT','hc8KoyPfdg','UjPlhXiL','6wTK2oBx'],'topical':['ZggiM0GFpM','P61DhG9W','KgktFDR2','cP3drAvl','PGeVqBFR'],'combo':['s2hF6Mdn']},
   'ineligibleCardText':'Not available based on your medical history',
   'otherOptionsIntro':'Based on the medical information you provided, you may not be suitable for some treatments. If you believe this assessment is inaccurate, kindly review your responses to the medical questionnaire.',
   'rejectionScreen':'This treatment may not be suitable / {firstName}, thank you for your answers / … we’re unable to offer a {brand} treatment that’s clinically appropriate under our prescribing guidelines.',
   'sources':['raw/app/chunks/use-hims-uk-hair-purchase-options-RTx4GHla.js','raw/app/chunks/hims-uk-treatment-options-CgqlFS7X.js','raw/app/chunks/hims-uk-treatment-card-content-C0UjamKD.js','raw/app/chunks/router-BhZtaX-r.js','raw/app/chunks/rejected-screen-COWSDWyl.js','raw/app/hims-uk-hair-recommendation-code.js','raw/app/chunks/fixture-*.js']},
 'returningCustomerHealthCheck_code':{'title':"Let's get you back on track",'intro':'Please confirm you understand and agree with the following. Since your last {brandName} consultation:','statements':['I have not experienced low blood pressure, frequent dizzy spells, palpitations, or been diagnosed with heart failure','My partner is not pregnant, and I am not currently trying for a baby','I have not started any other new medications or been diagnosed with any new medical conditions'],'options':['Yes, I agree with the above','No, something has changed'],'source':'raw/app/chunks/health-details-BKmT7dFL.js'},
 'oldPlatform_code':{
   'status':'Old Hims UK consultation code is still served from www.forhims.co.uk but /c/hl now redirects to the new app, so it is no longer the live flow. Its question sets (Contentful "intakes" for Intent and Medical) are not served any more.',
   'stages':['ASSESSMENT_INTENT_STAGE (the same intent quiz, recap and marketing screens as today)','LOGIN (enrolment: "You’re eligible for treatment!" + START_VISIT with date of birth)','TREATMENT_PREFERENCES (TREATMENT_APPLICATION_SELECT oral/topical/no preference; HAIR_PREMIUM_TOPFIN_SPRAY_HIGHLIGHT; HAIR_HYBRID_CHEW_HIGHLIGHT; TREATMENT_DRUG_SELECT_RECOMMENDATION; TREATMENT_DRUG_SELECT)','ASSESSMENT_MEDICAL_STAGE (dynamic medical questions; INTAKE_DISQUALIFICATION)','POST_INTAKE_TREATMENT_PREFERENCES (TREATMENT_DRUG_RESELECT when the chosen drug is contraindicated; TREATMENT_DRUG_DISCLAIMER_HAIR)','SHIPPING_ADDRESS (with INTERSTITIAL_REGROWTH_TIMELINE)','PAYMENT (PAYMENT_WITH_SCHEDULE; POST_PAYMENT)'],
   'intentQuestionIds':['HL-INT-HAIR-CHANGES','HL-INT-NOTICE-SPOTS','HL-INT-RUN-IN-FAMILY','HL-INT-EXPERIENCE-STRESS','HL-INT-HAIR-TIME','HL-INT-STYLE-HAIR'],
   'preferenceQuestion':{'eyebrow':'Customising your treatment','title':'Which type of daily treatment do you prefer?','options':[{'key':'oral','label':'Pills or chews','deck':'Take one a day','tag':'Most popular'},{'key':'topical','label':'Sprays or serums','deck':'Apply right on scalp'},{'key':'noPreference','label':'No Preference','deck':"Choose what's most effective for me"}]},
   'recommendationCopy':{'title':'Your treatment options','description':"Based on your hair loss type and goals, you'd be a great candidate for:",'reselection':"Based on your hair loss type and health history, you're a better candidate for the following treatment.",'ineligible':'Based on your hair loss type and health history, you are not eligible for treatments that contain {ingredient}.','badges':['No-pill option','For receding hairlines','For overall thinning hair','For thinning at the crown'],'heroCallout':'Purchased by 1000+ men in the last week'},
   'tagEngine':'Server returns "assessment.contraindications" (a list of tags). Every active product whose Contentful tags include one of them is removed; the tag "all" removes everything. Each answer option in the Contentful intake could carry "excludesTags"; questions could be shown only for certain products ("includedBy") or only after a trigger answer ("trigger").',
   'productTags':{'P61DhG9W':['minoxidil','finasteride','topical','minoxidil-topical'],'ZggiM0GFpM':['minoxidil','finasteride','topical','minoxidil-topical'],'KgktFDR2':['finasteride','minoxidil','topical','minoxidil-topical'],'6BFr0YdOjT':['finasteride','minoxidil','minoxidil-oral','finasteride-oral'],'hc8KoyPfdg':['minoxidil','minoxidil-oral'],'6wTK2oBx':['finasteride','lactose-tablet','finasteride-oral'],'cP3drAvl':['minoxidil','topical','minoxidil-topical'],'PGeVqBFR':['minoxidil','topical','minoxidil-topical'],'s2hF6Mdn':['finasteride','minoxidil','topical','lactose-tablet','finasteride-oral'],'UjPlhXiL':[]},
   'sources':['raw/www-js/legacy-json-blobs.json (copy block "151")','raw/www-js/hims.modern.client-domains-consultation-acquisition-hair-loss.*.js','raw/www-js/hims.modern.818.*.js','raw/www-js/hims.modern.1742.*.js','raw/www-js/hims.modern.2392.*.js','raw/contentful-products.slim.json']},
 'experimentsRunningOnTheSite_flags':{'exp-2026-previous-hl-treatment':'5% of visitors (this browser was in the control bucket). Name suggests a test of a "previous hair-loss treatment" question.','source':'raw/hair-loss.HIMS_EXPERIMENT_CONTEXT.json, raw/contentful-experiments.json'},
 'hersUK_code':{
   'entry':'https://app.forhers.co.uk/start/signup?t=hair (name first; no anonymous flow: cfg_anon_flow_version_map for brand hers-uk has no "hair" key)',
   'storedAnswersReadBySummaryPage':{'hairLossLocation (also _hairLossLocation)':{'PART_WIDENING':'A wider hair part','CROWN_VISIBLE':'More visible scalp at the crown','THIN_TEMPLES':'Thinning around the temples','DIFFUSE_THIN':'Thinning & shedding across the scalp','PATCHY_HAIR_LOSS':'Bald spots or round patches','RECEDING_HAIRLINE':'A receding hairline'},'hairGoals':{'STOP_HAIR_SHED':'Reduce hair shedding','REGROW_LOST_HAIR':'Regrow lost hair','IMPROVE_THIN_AREAS':'Improve coverage in thinning areas','INCREASE_THICKNESS':'Increase overall thickness and volume','STRONGER_HEALTHIER_HAIR':'Have stronger, healthier looking hair'},'hairLossOnset':{'GRADUALLY':'Gradually, more than 6 months ago'},'hairLossFamilyHistory':{'YES':'Family history: Yes','NO':'Family history: No'},'stressFrequency':{'OFTEN':'Stress: Often','OCCASIONAL':'Stress: Occasionally','RARE':'Stress: Rarely'},'dateOfBirth':'Age: {age}'},
   'treatments':{'hair-vitamins-minoxidil-pill':'Hair Vitamins + Minoxidil Pill: minoxidil 1.5mg, biotin 2.5mg, vitamin C 100mg, vitamin B5 11mg, vitamin B6 2.5mg, zinc sulfate 50mg (badge Most popular)','biotin-minoxidil-chew':'Biotin + Minoxidil Chew: minoxidil 1.5mg, biotin 2.5mg','hair-vitamins-minoxidil-spironolactone-capsule':'minoxidil 1.5mg, spironolactone 44mg, biotin 2.5mg, vitamin B5 11mg, vitamin B6 2.44mg, vitamin C 100mg, zinc sulfate 50mg','hair-blends-serum':'Minoxidil Serum: minoxidil 7%, ketoconazole 2.2%, biotin, dexpanthenol 5% (pet caution)','hair-vitamins':'Hair Vitamins: biotin 2.5mg, vitamin C 100mg, vitamin B5 11mg, vitamin B6 2.5mg, zinc sulfate 50mg'},
   'ineligibleCardText':'Treatment is not suitable based on your answers',
   'sources':['raw/app/chunks/router-Ch9efIO3.js','raw/app/chunks/router-CSFr2DF0.js','raw/app/chunks/hair-treatments-from-options-Bb9ASKmz.js','raw/app/hair-recommendation-messages.txt','raw/app/launchdarkly-flags-hers-uk-anon.json']}
}
json.dump(out, open(BASE+'quiz-definition.json','w'), indent=1, ensure_ascii=False)
print(len(ordered))
for o in ordered: print(o['order'], o['stepType'], '|', o['questionText'][:70].replace('\n',' / '), '|', o.get('datapointKey'), '|', [x['label']+(' — '+x['sublabel'] if x.get('sublabel') else '') for x in o.get('options',[])])
