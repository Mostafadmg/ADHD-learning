import json, sys, copy
sys.path.insert(0,'scratch')
from engine import offered
from qparse import questions
from build_products import P, SKU2P
HL='https://hairloss.philipkingsley.co.uk/'
FALLBACK=['p-w-routine']
PNAME={p['id']:p['name'].split(' (')[0] for p in P}
def pids(skus): 
    out=[]
    for s in skus:
        pid=SKU2P.get(s)
        if pid is None:
            pid = FALLBACK[0] if (s.startswith('PHI16') or s=='PHI1827') else None
        if pid and pid not in out: out.append(pid)
    return out
CONSULT='No plan survives the rules, so the quiz (after the account wall) shows "Choose your consultation type": book a Virtual Initial Consultation (from £200) or an in-clinic Initial Consultation (from £345).'
def effect_from(B, G, sub=None):
    if not G: return CONSULT, 'hard-stop', ['p-consult-virtual','p-consult-clinic']
    rem=[s for s in B if s not in G]; add=[s for s in G if s not in B]
    if not rem and not add: return 'No change to the products offered (code).', 'none', []
    pr=pids(rem); pa=pids(add); both=[p for p in pr if p in pa]
    pr=[p for p in pr if p not in both]; pa=[p for p in pa if p not in both]
    parts=[]
    if pr: parts.append('Removes: '+'; '.join(sorted(set(PNAME[p] for p in pr))))
    if pa: parts.append('Adds: '+'; '.join(sorted(set(PNAME[p] for p in pa))))
    if both: parts.append('Swaps the SKU within: '+'; '.join(sorted(set(PNAME[p] for p in both)))+' (%s -> %s)' % (','.join(r for r in rem if pids([r])[0] in both), ','.join(a for a in add if pids([a])[0] in both)))
    et='product-switched' if ((pr and pa) or both) else ('product-removed' if pr else 'product-added')
    return '. '.join(parts)+' (code; one change from the baseline).', et, pr+pa+both
META_M={
 'q1':('Which image best represents your hair loss?','Picks the hair-loss pattern (Norwood-style pictures).','product-selector'),
 'q2a':(None,'Grades density; used with the pattern to pick plans.','product-selector'),
 'q3':(None,'Screens out people with no hair loss yet.','eligibility-gate'),
 'q4':(None,'Sudden loss suggests a non-pattern cause (e.g. shedding or alopecia areata).','safety-screen'),
 'q5':(None,'Family history supports male pattern hair loss.','diagnosis'),
 'q6':(None,'Age band; changes plans only for the Early signs and Temples pictures.','product-selector'),
 'q7a':(None,'Scalp conditions must be treated first; they swap hair-loss plans for scalp plans or end the online route.','safety-screen'),
 'q7f':(None,'Severity of itching.','product-selector'),'q7b':(None,'Severity of dandruff.','product-selector'),
 'q7c':(None,'Severity of redness.','data-capture'),'q7d':(None,'Severity of eczema.','product-selector'),
 'q7e':(None,'Free text about the other scalp condition (for the reviewer).','data-capture'),
 'q8':(None,'Pain, burning, crusting or bleeding suggests scarring or inflammatory scalp disease.','safety-screen'),
 'q9':(None,'Finasteride and minoxidil contraindications and cautions (cancer/PSA, blood pressure, mood, conception).','safety-screen'),
 'q9e':(None,'Finasteride mood warning with a choice to accept or decline finasteride.','consent'),
 'q10a':(None,'Medicines for the reviewer to check.','data-capture'),'q10b':(None,'Names and doses of medicines.','data-capture'),'q10c':(None,'What the medicines are for.','data-capture'),
 'q11a':(None,'Allergy to either active removes products that contain it.','safety-screen'),
 'q12a':(None,'Other allergies for the reviewer.','data-capture'),'q12b':(None,'Description of the allergy.','data-capture'),
}
META_W={
 'q1':(None,'Pregnancy or breastfeeding ends the online route.','safety-screen'),
 'q2':(None,'Chemotherapy or radiotherapy ends the online route.','safety-screen'),
 'q3a':(None,'Main picture: pattern thinning gets the main plan, shedding gets Hair Shedding Drops, patches or band-like loss go to a consultation.','product-selector'),
 'q3b':(None,'How noticeable overall thinning is.','data-capture'),'q3d':(None,'How noticeable temple thinning is.','data-capture'),
 'q3c':(None,'How visible the wider parting is.','data-capture'),'q3e':(None,'How noticeable the shedding is.','data-capture'),
 'q3f':(None,'How noticeable the bald patches are.','data-capture'),
 'q4':(None,'Sudden onset is meant to send people to a consultation (but see the gap for a wider parting).','safety-screen'),
 'q5a':(None,'Scalp symptoms: mild itching/dandruff/eczema keep the plan, anything more goes to a consultation.','safety-screen'),
 'q5f':(None,'Severity of itching.','safety-screen'),'q5b':(None,'Severity of dandruff.','safety-screen'),'q5c':(None,'Severity of redness.','safety-screen'),'q5d':(None,'Severity of eczema.','safety-screen'),
 'q6':(None,'Scalp type; picks the haircare add-on.','personalisation'),
 'q7':(None,'Hair texture; picks the haircare add-on.','personalisation'),
 'q8':(None,'Hair length; picks the haircare add-on for some textures.','personalisation'),
 'q9':(None,'Styling habits; picks the haircare add-on.','personalisation'),
 'q10a':(None,'Menopause status (asked but not used by any rule).','data-capture'),'q10b':(None,'HRT use (not used by any rule).','data-capture'),
 'q11a':(None,'Minoxidil allergy or other allergy ends the online route.','safety-screen'),'q11b':(None,'Description of the allergy.','data-capture'),
 'q12a':(None,'Oral minoxidil use ends the online route; other conditions are free text for the reviewer.','safety-screen'),'q12b':(None,'Description of the medical condition.','data-capture'),
}
META_S={
 'q1':(None,'Already diagnosed? "No" skips the diagnosis question.','diagnosis'),
 'q2':(None,'Existing diagnosis from a trichologist or dermatologist.','diagnosis'),
 'q3':(None,'Current scalp symptoms with severity; chooses scalp products or a consultation.','product-selector'),
 'q4':(None,'Scalp type before symptoms; personalises products.','personalisation'),
 'q5':(None,'Chemotherapy or radiotherapy screen.','safety-screen'),
 'q6':(None,'Pain, burning, crusting, bleeding or patchy hair loss (possible scarring or inflammatory disease).','safety-screen'),
 'q7':(None,'Hair type; personalises products.','personalisation'),
 'q8':(None,'Hair length; personalises products.','personalisation'),
 'q9':(None,'Hair condition; personalises products.','personalisation'),
 'q10a':(None,'Allergies (minoxidil named).','safety-screen'),
 'q10b':(None,'Description of the allergy.','data-capture'),
}
def build_flow(fid, quiz, defn, base_ans, nsteps, meta, prefix, consent_texts, wall_texts, audience, runs):
    st=json.load(open(defn))
    B=[x[0] for x in offered(st,quiz,base_ans)] if base_ans else None
    steps=[quiz+'_step%d'%i for i in range(1,nsteps+1)]
    Q=[]; order=0
    def add(q): 
        nonlocal order; order+=1; q['order']=order; Q.append(q)
    gate_opts=[{'label':'I am experiencing hair loss','effect':'Goes to "Select gender at birth" (hair-loss assessment).','effectType':'next-question','affects':[],'evidence':'observed'},
               {'label':'I am experiencing scalp irritation','effect':'Goes to the separate Scalp Assessment (scalp products, not hair-loss medicines).','effectType':'extra-questions','affects':[],'evidence':'observed'}]
    add({'id':prefix+'-select','stage':'anonymous','text':'Select quiz. "If you are suffering from hair loss symptoms please select the Hair Loss Assessment below. If you are experiencing scalp irritation or have a scalp condition, please complete our Scalp Assessment below." (plus: treat scalp symptoms before hair loss)',
         'type':'single','options':gate_opts,'purpose':'Splits hair-loss and scalp-irritation customers before any medical questions.','engineRole':'eligibility-gate','branches':True,'branchDetail':'Scalp irritation -> scalp_quiz.','shownWhen':'always (first screen of '+HL+')','evidence':'observed'})
    if quiz!='scalp_quiz':
        add({'id':prefix+'-gender','stage':'anonymous','text':'Select gender at birth','type':'single','options':[
            {'label':'Male','effect':'Starts the men\'s quiz (men_quiz).','effectType':'extra-questions','affects':[],'evidence':'observed'},
            {'label':'Female','effect':'Starts the women\'s quiz (women_quiz).','effectType':'extra-questions','affects':[],'evidence':'observed'}],
            'purpose':'Chooses the men\'s or women\'s quiz. A pop-up "Why do we need this information?" says people not assigned male or female at birth should call the clinical team to book a trichologist consultation.','engineRole':'eligibility-gate','branches':True,'branchDetail':'Male -> men_quiz; Female -> women_quiz. No other option.','shownWhen':'after "I am experiencing hair loss"','evidence':'observed'})
    add({'id':prefix+'-start','stage':'anonymous','text':' / '.join(consent_texts),'type':'consent','options':[{'label':'GET STARTED','effect':'Confirms the statements and starts question 1.','effectType':'next-question','affects':[],'evidence':'observed'}],
         'purpose':'Self-declaration before the questions (age, UK, honesty, medicines'+(', unlicensed status' if quiz=='men_quiz' else '')+').','engineRole':'consent','branches':False,'branchDetail':'','shownWhen':'always','evidence':'observed' if runs else 'code'})
    for stp in questions(st, steps):
        for q in stp['questions']:
            code=q['code']; m=meta.get(code,(None,'','data-capture'))
            label=q['label'] or ''
            shown_text=q.get('shown_text') or label
            text=shown_text if q.get('textarea') else label
            if code=='q2a' and quiz=='men_quiz':
                text='Now tell us about your hair density. In the areas of your scalp where you are currently experiencing hair loss, how would you describe the change in the appearance of your hair?'
            if q.get('textarea'):
                typ='text'
            else:
                typ='multi' if q['multiple'] else 'single'
            opts=[]
            for o in q['options']:
                if base_ans is None:
                    eff,et,aff=('Not evaluated (scalp products not mapped).','unknown',[])
                    ev='unknown'
                else:
                    a=copy.deepcopy(base_ans)
                    a[code]={'label':label,'value':o['value']}
                    par=None
                    if q['if'] and isinstance(q['if'],dict) and q['if'].get('field'):
                        par=q['if']['field']; v=q['if']['value'] if isinstance(q['if']['value'],str) else q['if']['value'][0]
                        a[par]={'label':base_ans[par]['label'],'value':v}
                    if quiz=='men_quiz' and code=='q9e':
                        a['q9']={'label':base_ans['q9']['label'],'value':'I am experiencing, or have previously experienced, depression, anxiety or panic disorders'}
                    G=[x[0] for x in offered(st,quiz,a)]
                    eff,et,aff=effect_from(B,G)
                    ev='code'
                    sub=[x for x in stp['questions'] if x['if'] and isinstance(x['if'],dict) and x['if'].get('field')==code and (x['if'].get('value')==o['value'] or (isinstance(x['if'].get('value'),list) and o['value'] in x['if']['value']))]
                    if sub and not q['if']:
                        eff='Opens follow-up: '+'; '.join((s['label'] or s.get('shown_text') or s['code']) for s in sub)+'. Outcome depends on that answer (see the follow-up). Without it: '+eff
                        et='extra-questions' if et=='none' else et
                    if o.get('unique'): eff='Exclusive choice (clears the others). '+eff
                opts.append({'label':o['value'],'effect':eff,'effectType':et,'affects':aff,'evidence':ev})
            cond=q['if']
            shown='always' if not cond else ('when %s includes %s' % (cond.get('field'), json.dumps(cond.get('value')) if cond.get('value') else 'any answer'))
            labs=sorted(q['labels'])
            note=''
            if len(labs)>1: note=' Note: the options carry different internal labels %s, so rules keyed on one label miss the others.' % labs
            if code=='q2a' and quiz=='men_quiz': note=' Internal label differs from the screen text ("where are you currently"); rules use the internal label.'
            branches= any(o['effectType'] not in ('none',) for o in opts) or bool([x for x in stp['questions'] if x['if'] and isinstance(x['if'],dict) and x['if'].get('field')==code])
            add({'id':'%s-%s'%(prefix,code),'stage':'anonymous','text':text,'type':typ,'options':opts,'purpose':m[1]+note,'engineRole':m[2],
                 'branches':bool(branches),'branchDetail':'Product rules are evaluated only after the account wall; effects shown are from running the site\'s own rules (code).' if branches else '',
                 'shownWhen':shown,'evidence':'observed' if runs else 'code'})
    add({'id':prefix+'-wall','stage':'anonymous','text':' / '.join(wall_texts),'type':'contact','options':[],
         'purpose':'ACCOUNT WALL: creates a customer account (/quiz/step/register) before any result is shown. Not filled (protocol).','engineRole':'identity','branches':False,'branchDetail':'','shownWhen':'after the last question, always','evidence':'observed' if runs else 'code'})
    add({'id':prefix+'-result','stage':'after-account','text':'Results page (server-rendered after registration). If no product rule survives, the template "CHOOSE YOUR CONSULTATION TYPE / ASSESSMENT COMPLETE. / Book your first Consultation with your Trichologist. Due to the nature of your hair loss, one of our world-renowned Trichologists will need to see you in a Consultation to confirm your diagnosis and prescribe a more suitable treatment plan for you." is shown, with a booking calendar (Trichologist or Senior Trichologist, male or female consultant).',
         'type':'info','options':[],'purpose':'Shows the plan choice (Recommended / Other groups) or routes to a paid consultation.','engineRole':'product-selector','branches':True,'branchDetail':'Plan list = SKUs whose rule passes (conditions true, blockers false); empty list = consultation screen.','shownWhen':'after the account wall (not seen live)','evidence':'code'})
    return Q, B
