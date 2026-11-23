#!/usr/bin/env python3
"""stage2-patch.py: writes the stage-2 (experiment) results into company.json.
Edits company.json in place (it does NOT use build-company.py; from stage 2 on, company.json is the source)."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'company.json')
c = json.load(open(P))
Q = {q['id']: q for f in c['flows'] for q in f['questions']}

MEN_SAME = ("Questionnaire accepted; 'Your request' shows the same 9 options as baseline (4 generic finasteride packs, "
            "4 Propecia packs, phone consultation) at the same prices. No stop, no product-rules call ({run}). "
            "The answer goes to the doctor after payment.")

def opt(qid, label, effect, etype, affects, ev):
    for o in Q[qid]['options']:
        if o['label'] == label or o['label'].startswith(label):
            o.update(effect=effect, effectType=etype, affects=affects, evidence=ev); return
    raise SystemExit(f'no option {qid} {label}')

def q(qid, **kw): Q[qid].update(kw)

# ---------- MEN ----------
opt('men-q1', 'Yes, by my GP', MEN_SAME.format(run='runs/exp-m12'), 'flag-for-clinician', [], 'observed')
opt('men-q1', 'Yes, by a specialist', 'Not replayed. No branch in the definition and the men\'s product filter is off, so the list should be the same as for "Yes, by my GP" (runs/exp-m12). Information for the doctor.', 'flag-for-clinician', [], 'inferred')
opt('men-q2', 'A', "Opens a photo-upload item. Without photos, Next does nothing and a red 'Please upload photos' error shows, so the route cannot go on without uploading photos (runs/exp-m02). We never upload photos, so what follows is unknown.", 'extra-questions', [], 'observed')
opt('men-q2', 'B', 'Not replayed. The definition has no follow-up for B; patterns C and D give the full baseline list (runs/baseline-men, runs/exp-m15), so B is expected to do the same.', 'none', [], 'inferred')
opt('men-q2', 'D', MEN_SAME.format(run='runs/exp-m15') + ' No photo item and no warning.', 'none', [], 'observed')
opt('men-q2', 'E', "Opens a photo-upload item and a required tick box warning that finasteride is unlikely to help extensive loss. Ticking the box is allowed, but without photos Next is blocked by a 'Please upload photos' error (runs/exp-m01).", 'extra-questions', ['p1', 'p2'], 'observed')
opt('men-q2', 'No pattern fits well', "Opens the photo-upload item; without photos Next is blocked by the 'Please upload photos' error (runs/exp-m16).", 'extra-questions', [], 'observed')
opt('men-q3', 'Yes', "Opens the free-text box 'Are you finding it effective? Have you had any side effects?' and hides men-q3b. " + MEN_SAME.format(run='runs/exp-m11'), 'extra-questions', [], 'observed')
opt('men-q3b', 'Yes', "Opens the free-text box 'Was it effective? Did you have any side effects?'. Even a reply describing low mood and reduced sex drive gives the full baseline list with no warning (runs/exp-m14). Left to the doctor.", 'extra-questions', [], 'observed')
opt('men-q4', 'In the last month', MEN_SAME.format(run='runs/exp-m10') + ' No warning, even though very recent loss is a reason to check other causes.', 'flag-for-clinician', [], 'observed')
opt('men-q5', 'Suddenly', "Opens two free-text boxes (other causes; how it started). " + MEN_SAME.format(run='runs/exp-m09') + ' No warning about sudden loss.', 'extra-questions', [], 'observed')
opt('men-q6', 'Yes', "Shows the message 'These symptoms suggest there could be other causes … We'd suggest you see your GP first' and a details box, but the form still goes through: " + MEN_SAME.format(run='runs/exp-m08'), 'soft-warning', ['p1', 'p2'], 'observed')
opt('men-q7', 'No', "Shows a warning that finasteride can cause sexual problems in about 2% of men and erectile dysfunction may worsen. No stop: " + MEN_SAME.format(run='runs/exp-m07'), 'soft-warning', ['p1', 'p2'], 'observed')
opt('men-q8', 'Prostate cancer', MEN_SAME.format(run='runs/exp-m03') + ' No warning or follow-up.', 'flag-for-clinician', [], 'observed')
opt('men-q8', 'Breast cancer', MEN_SAME.format(run='runs/exp-m04') + ' No warning or follow-up.', 'flag-for-clinician', [], 'observed')
opt('men-q8', 'Liver condition', "Opens the required 'Please provide more details.' box. " + MEN_SAME.format(run='runs/exp-m05'), 'extra-questions', [], 'observed')
opt('men-q8', 'Any type of skin conditions', "Opens the same required details box (definition). Not replayed; the liver option, which opens the same box, left the list unchanged (runs/exp-m05).", 'extra-questions', [], 'code')
opt('men-q9', 'Yes', "Opens a details box. " + MEN_SAME.format(run='runs/exp-m18'), 'extra-questions', [], 'observed')
opt('men-q10', 'Yes', "Opens two required text boxes (names and doses; what for). " + MEN_SAME.format(run='runs/exp-m13'), 'extra-questions', [], 'observed')
opt('men-q11', 'Yes', 'Opens the allergy tick list (men-q11a). Each option tested left the product list unchanged (runs/exp-m06, runs/exp-m17).', 'extra-questions', [], 'observed')
opt('men-q11a', 'Finasteride', 'No follow-up and no warning, and finasteride and Propecia are still offered: ' + MEN_SAME.format(run='runs/exp-m06') + ' A clear contraindication that the page does not act on.', 'flag-for-clinician', ['p1', 'p2'], 'observed')
opt('men-q11a', 'Lactose', "Opens 'Can you take medication that contains lactose?'. Even with 'No' (finasteride tablets contain lactose) the list is unchanged: " + MEN_SAME.format(run='runs/exp-m17'), 'extra-questions', [], 'observed')
opt('men-q11a', 'Peanuts or Soya', "Opens a required tick box saying some makers' tablets are unsuitable for peanut or soya allergy and asking the patient to check the leaflet (definition). Not replayed; the men's filter is off, so the list should stay the same.", 'soft-warning', ['p1', 'p2'], 'code')
opt('men-q11a', 'Other medications', "Opens a required free-text box (definition). Not replayed in the men's flow; the same option in the women's flow ('Ibuprofen') changed nothing (runs/exp-w19).", 'extra-questions', [], 'code')
opt('men-q11a', 'Other substances', "Opens the same required free-text box (definition). Not replayed in the men's flow.", 'extra-questions', [], 'code')
opt('men-q11c', 'Yes', 'No further change (definition). Information for the doctor.', 'flag-for-clinician', [], 'code')
opt('men-q11c', 'No', "No stop and no product change: finasteride and Propecia are still offered (runs/exp-m17).", 'flag-for-clinician', ['p1', 'p2'], 'observed')
for lab in ('Superdrug Pharmacy Collect', 'Express Delivery'):
    opt('men-del', lab, 'Delivery choice only; any choice leads to the account wall. Not replayed with this option.', 'none', [], 'inferred')

q('men-q1', purpose='Records whether a doctor has already diagnosed male pattern hair loss; self-diagnosis is accepted.', engineRole='diagnosis', branches=False, branchDetail='No branch; every answer gives the same product list.', shownWhen='always')
q('men-q2', purpose='Classifies the hair-loss pattern with pictures A to E; asks for photos when the pattern is unusual (A, E, none fits).', engineRole='diagnosis', branches=True, branchDetail="A, E and 'No pattern fits well' open a photo upload that blocks Next until photos are added; E also adds a required 'unlikely to help' tick box. B, C and D have no follow-up.", shownWhen='always')
q('men-q2a', purpose='Lets the doctor see unusual patterns (no visible loss, very advanced loss, or one that does not fit).', engineRole='diagnosis', branches=False, branchDetail="Required in practice: without photos a 'Please upload photos' error stops the form (runs/exp-m01, exp-m02, exp-m16), although the definition does not flag it as required.", shownWhen='men-q2 = A, E or No pattern fits well', evidence='observed')
q('men-q2b', purpose='Sets expectations for extensive loss and records that the patient chose to continue.', engineRole='expectation-setting', branches=False, branchDetail='', shownWhen='men-q2 = E', evidence='observed')
q('men-q3', purpose='Finds out if this is a new start or continuing treatment.', engineRole='personalisation', branches=True, branchDetail='Yes opens a box on effect and side effects and hides men-q3b; No shows men-q3b. No product change (runs/exp-m11).', shownWhen='always')
q('men-q3b', purpose='Finds past use and past side effects.', engineRole='safety-screen', branches=True, branchDetail='Yes opens a free-text box; past side effects such as low mood do not change the list (runs/exp-m14).', shownWhen='men-q3 = No')
q('men-q4', purpose='Separates new, possibly reversible shedding from long-standing pattern loss.', engineRole='diagnosis', branches=False, branchDetail='No branch and no product change (runs/exp-m10).', shownWhen='always')
q('men-q5', purpose='Screens for sudden loss that may have another cause (stress, illness, alopecia areata).', engineRole='diagnosis', branches=True, branchDetail='Suddenly opens two free-text boxes; no warning, no product change (runs/exp-m09).', shownWhen='always')
q('men-q6', purpose='Screens for scalp disease (redness, itch, flaking, soreness) that points away from pattern loss.', engineRole='safety-screen', branches=True, branchDetail="Yes shows a 'see your GP first' message and a details box; the form still goes through with the full list (runs/exp-m08).", shownWhen='always')
q('men-q7', purpose='Records erectile function before starting finasteride, a known side effect.', engineRole='safety-screen', branches=True, branchDetail='No shows a side-effect warning; no stop, no product change (runs/exp-m07).', shownWhen='always')
q('men-q8', purpose='Screens for conditions relevant to finasteride: prostate and breast cancer, liver disease, skin disease.', engineRole='safety-screen', branches=True, branchDetail='Liver or skin condition opens a required details box. No option stops the patient or changes the list (runs/exp-m03, exp-m04, exp-m05).', shownWhen='always')
q('men-q9', purpose='Catches any other condition for the doctor.', engineRole='safety-screen', branches=True, branchDetail='Yes opens a details box; no product change (runs/exp-m18).', shownWhen='always')
q('men-q10', purpose='Medicine list for interaction checks by the doctor.', engineRole='safety-screen', branches=True, branchDetail='Yes opens two required text boxes; no product change (runs/exp-m13).', shownWhen='always')
q('men-q11', purpose='Allergy screen.', engineRole='safety-screen', branches=True, branchDetail='Yes opens the allergy tick list; no product change (runs/exp-m06, exp-m17).', shownWhen='always')
q('men-q11a', purpose='Which allergy: finasteride itself, peanut or soya and lactose (tablet ingredients in some brands), others.', engineRole='safety-screen', branches=True, branchDetail="Peanuts or Soya opens a leaflet-check tick box; Lactose opens 'Can you take medication that contains lactose?'; Other opens a text box. Finasteride allergy opens nothing and does not remove finasteride (runs/exp-m06).", shownWhen='men-q11 = Yes', evidence='observed')
q('men-q11c', purpose='Checks if a lactose-allergic patient can still take lactose-containing tablets.', engineRole='safety-screen', branches=False, branchDetail="'No' changes nothing on screen (runs/exp-m17).", shownWhen="men-q11a includes 'Lactose'", evidence='observed')

# ---------- WOMEN ----------
W_ALL = "Product-rules reply empty; all five baseline options still shown ({run})."
REG = "Product-rules reply suggestions:[9895328]: Regaine for Women is silently removed; Nourkrin, both Alpecin shampoos and the phone consultation remain. No message is shown ({run})."
opt('women-q1', 'a shaved scalp', REG.format(run='runs/exp-w05'), 'product-removed', ['p7'], 'observed')
opt('women-q1', 'sudden or patchy hair loss', REG.format(run='runs/exp-w06'), 'product-removed', ['p7'], 'observed')
opt('women-q1', 'skin problems on the scalp', REG.format(run='runs/exp-w07'), 'product-removed', ['p7'], 'observed')
opt('women-q1', 'hair loss associated with childbirth', REG.format(run='runs/exp-w08'), 'product-removed', ['p7'], 'observed')
opt('women-q2', 'Yes', REG.format(run='runs/exp-w03'), 'product-removed', ['p7'], 'observed')
opt('women-q3', 'Yes', "Opens a required details box. " + REG.format(run='runs/exp-w04'), 'product-removed', ['p7'], 'observed')
opt('women-q4', "I'm pregnant", W_ALL.format(run='runs/exp-w01, runs/exp-w21') + ' Regaine for Women stays on offer although its leaflet says not to use it in pregnancy; no follow-up question or warning.', 'flag-for-clinician', ['p7'], 'observed')
opt('women-q4', "I'm breastfeeding", W_ALL.format(run='runs/exp-w02') + ' No warning.', 'flag-for-clinician', ['p7'], 'observed')
opt('women-q5', 'Yes', "Opens a details box. " + W_ALL.format(run="runs/exp-w09, details 'Hay fever'"), 'extra-questions', [], 'observed')
opt('women-q6', 'Yes', "Opens two required text boxes. " + W_ALL.format(run="runs/exp-w10, 'Cetirizine'"), 'extra-questions', [], 'observed')
opt('women-q7', 'Yes', 'Opens the ten-item allergy tick list (women-q7a), which is the main product selector.', 'extra-questions', [], 'observed')
opt('women-q7a', 'Minoxidil', REG.format(run='runs/exp-w11'), 'product-removed', ['p7'], 'observed')
opt('women-q7a', 'Ethanol', REG.format(run='runs/exp-w14'), 'product-removed', ['p7'], 'observed')
opt('women-q7a', 'Propylene glycol', REG.format(run='runs/exp-w15'), 'product-removed', ['p7'], 'observed')
opt('women-q7a', 'Fish', "Product-rules reply suggestions:[9895329]: Nourkrin is silently removed (inferred reason: it contains a fish-derived ingredient); the other four remain (runs/exp-w12; same from the Nourkrin entry, runs/exp-w22).", 'product-removed', ['p8'], 'observed')
opt('women-q7a', 'Caffeine', "Product-rules reply suggestions:[9895330,9895331]: both Alpecin caffeine shampoos are removed; Regaine for Women, Nourkrin and the phone consultation remain (runs/exp-w13).", 'product-removed', ['p5', 'p6'], 'observed')
opt('women-q7a', 'Penicillin', W_ALL.format(run='runs/exp-w18'), 'none', [], 'observed')
opt('women-q7a', 'Peanuts or Soya', W_ALL.format(run='runs/exp-w16') + ' No follow-up (unlike the men\'s form).', 'none', [], 'observed')
opt('women-q7a', 'Lactose', W_ALL.format(run='runs/exp-w17') + ' No follow-up.', 'none', [], 'observed')
opt('women-q7a', 'Other medication', "Opens a required details box. " + W_ALL.format(run="runs/exp-w19, 'Ibuprofen'"), 'extra-questions', [], 'observed')
opt('women-q7a', 'Other substance', "Opens a required details box. " + W_ALL.format(run="runs/exp-w20, 'Latex'"), 'extra-questions', [], 'observed')
for lab in ('Free Standard Delivery', 'Superdrug Pharmacy Collect', 'Express Delivery'):
    opt('women-del', lab, 'Delivery choice only (served delivery data); leads to the account wall. Not replayed in the women\'s flow.', 'none', [], 'inferred')

q('women-q1', purpose='Screens out hair loss that is not female pattern loss (shaved scalp, sudden or patchy loss, scalp skin disease, post-partum shedding), where minoxidil is not suitable.', engineRole='product-selector', branches=True, branchDetail='Any of the four situations removes Regaine for Women from the list (runs/exp-w05 to exp-w08); the other products stay.', shownWhen='always', evidence='observed')
q('women-q2', purpose='Blood-pressure screen for minoxidil.', engineRole='product-selector', branches=True, branchDetail='Yes removes Regaine for Women (runs/exp-w03).', shownWhen='always', evidence='observed')
q('women-q3', purpose='Heart screen for minoxidil.', engineRole='product-selector', branches=True, branchDetail='Yes opens a required details box and removes Regaine for Women (runs/exp-w04).', shownWhen='always', evidence='observed')
q('women-q4', purpose='Pregnancy and breastfeeding screen.', engineRole='safety-screen', branches=False, branchDetail='Neither answer changes the list or shows a warning (runs/exp-w01, exp-w02, exp-w21); left to the doctor.', shownWhen='always', evidence='observed')
q('women-q5', purpose='Catches other conditions for the doctor.', engineRole='safety-screen', branches=True, branchDetail='Yes opens a details box; no product change (runs/exp-w09).', shownWhen='always', evidence='observed')
q('women-q6', purpose='Medicine list for the doctor.', engineRole='safety-screen', branches=True, branchDetail='Yes opens two required text boxes; no product change (runs/exp-w10).', shownWhen='always', evidence='observed')
q('women-q7', purpose='Allergy screen; gate to the allergy list.', engineRole='safety-screen', branches=True, branchDetail='Yes opens women-q7a.', shownWhen='always', evidence='observed')
q('women-q7a', purpose='Matches allergies to product ingredients: minoxidil, ethanol and propylene glycol (Regaine solution), fish (Nourkrin), caffeine (Alpecin).', engineRole='product-selector', branches=True, branchDetail='Minoxidil, ethanol or propylene glycol remove Regaine for Women; fish removes Nourkrin; caffeine removes both Alpecin shampoos; penicillin, peanuts or soya and lactose do nothing; the two Other options open a details box (runs/exp-w11 to exp-w20).', shownWhen='women-q7 = Yes', evidence='observed')

# ---------- RULES ----------
R = [
 dict(flow='men', when="men-q2 = A, E or 'No pattern fits well'", then="A photo-upload item appears and Next is blocked by a 'Please upload photos' error until photos are added. (Our route stops here; we never upload.)", effectType='extra-questions', affects=[], evidence='observed', proof='runs/exp-m02, runs/exp-m01, runs/exp-m16 vs runs/s2-baseline-men; definition linkId 713128006', confidence='high'),
 dict(flow='men', when='men-q2 = E', then="A required tick box warns that finasteride is unlikely to help extensive loss and risks may outweigh benefits; the patient may tick and continue.", effectType='soft-warning', affects=['p1', 'p2'], evidence='observed', proof='runs/exp-m01; definition linkId 2980000045', confidence='high'),
 dict(flow='men', when='men-q2 = B, C or D', then='No photo and no warning; the full list is shown.', effectType='none', affects=[], evidence='observed', proof='runs/s2-baseline-men (C), runs/exp-m15 (D); B by definition only', confidence='high'),
 dict(flow='men', when="men-q6 = Yes (redness, itching, flaking or soreness)", then="A 'see your GP first' message is shown, but the form still goes through and finasteride and Propecia are still offered.", effectType='soft-warning', affects=['p1', 'p2'], evidence='observed', proof='runs/exp-m08 vs runs/s2-baseline-men', confidence='high'),
 dict(flow='men', when='men-q7 = No (erection problems)', then='A warning about sexual side effects is shown; no stop and no change to the list.', effectType='soft-warning', affects=['p1', 'p2'], evidence='observed', proof='runs/exp-m07', confidence='high'),
 dict(flow='men', when='men-q3 = Yes (already on finasteride)', then="A box on effect and side effects opens and men-q3b ('taken before?') is hidden; list unchanged.", effectType='skip-questions', affects=[], evidence='observed', proof='runs/exp-m11', confidence='high'),
 dict(flow='men', when='men-q5 = Suddenly', then='Two free-text boxes open (other causes; how it started); no warning, list unchanged.', effectType='extra-questions', affects=[], evidence='observed', proof='runs/exp-m09', confidence='high'),
 dict(flow='men', when="men-q8 includes Liver condition (or skin condition, by definition)", then='A required details box opens; list unchanged.', effectType='extra-questions', affects=[], evidence='observed', proof='runs/exp-m05', confidence='high'),
 dict(flow='men', when='Any single answer change on the men\'s questionnaire, including prostate cancer, breast cancer, finasteride allergy, lactose intolerance and past side effects such as low mood', then="The product list never changes: 4 generic finasteride packs, 4 Propecia packs and the phone consultation, at the same prices. No product-rules call is made (fhir_product_filter_enabled = 0). The doctor screens after account creation and payment.", effectType='flag-for-clinician', affects=['p1', 'p2', 'p9'], evidence='observed', proof='runs/exp-m03 to exp-m18 (16 replays) plus applyClinicalProductFilters in runs/baseline-men-delivery/js', confidence='high'),
 dict(flow='men', when='men-q11a = Finasteride (allergy to finasteride)', then='Nothing happens: no warning, no follow-up, finasteride and Propecia still offered.', effectType='none', affects=['p1', 'p2'], evidence='observed', proof='runs/exp-m06', confidence='high'),
 dict(flow='women', when="women-q1 includes shaved scalp, sudden or patchy loss, scalp skin problems, or hair loss after childbirth", then='Regaine for Women is silently removed; Nourkrin, both Alpecin shampoos and the phone consultation remain.', effectType='product-removed', affects=['p7'], evidence='observed', proof='runs/exp-w05, exp-w06, exp-w07, exp-w08 (product-rules reply suggestions:[9895328]) vs runs/s2b-women-regaine', confidence='high'),
 dict(flow='women', when='women-q2 = Yes (high blood pressure or treated for it)', then='Regaine for Women is removed.', effectType='product-removed', affects=['p7'], evidence='observed', proof='runs/exp-w03', confidence='high'),
 dict(flow='women', when='women-q3 = Yes (heart condition)', then='A required details box opens and Regaine for Women is removed.', effectType='product-removed', affects=['p7'], evidence='observed', proof='runs/exp-w04', confidence='high'),
 dict(flow='women', when='women-q7a includes Minoxidil, Ethanol or Propylene glycol', then='Regaine for Women is removed (these are its active and base ingredients).', effectType='product-removed', affects=['p7'], evidence='observed', proof='runs/exp-w11, exp-w14, exp-w15', confidence='high'),
 dict(flow='women', when='women-q7a includes Fish', then='Nourkrin is removed (inferred reason: fish-derived ingredient).', effectType='product-removed', affects=['p8'], evidence='observed', proof='runs/exp-w12, runs/exp-w22 (Nourkrin entry)', confidence='high'),
 dict(flow='women', when='women-q7a includes Caffeine', then='Both Alpecin caffeine shampoos are removed.', effectType='product-removed', affects=['p5', 'p6'], evidence='observed', proof='runs/exp-w13', confidence='high'),
 dict(flow='women', when="women-q4 = I'm pregnant or I'm breastfeeding", then='Nothing changes: Regaine for Women and all other products stay on the list, with no warning. Left to the doctor.', effectType='none', affects=['p7'], evidence='observed', proof='runs/exp-w01, exp-w02, exp-w21', confidence='high'),
 dict(flow='women', when='women-q5 = Yes, women-q6 = Yes, or women-q7a = Penicillin, Peanuts or Soya, Lactose, Other medication or Other substance', then='Details boxes open where the definition says so; the list is unchanged.', effectType='none', affects=[], evidence='observed', proof='runs/exp-w09, w10, w16, w17, w18, w19, w20', confidence='high'),
 dict(flow='women', when='Entry point is Request Nourkrin instead of Request Regaine for Women', then='The same rules apply; only the order of the first two products changes (entry product first).', effectType='none', affects=['p7', 'p8'], evidence='observed', proof='runs/s2b-women-nourkrin, exp-w21, exp-w22', confidence='high'),
 dict(flow='both', when='Any answer, any flow', then='No answer ends the consultation with a stop screen before the account wall; the phone consultation is always offered. The engine only shows warnings (men) or silently removes products (women).', effectType='none', affects=['p9'], evidence='observed', proof='runs/exp-w01 to exp-w22 and runs/exp-m03 to exp-m18 (stops only at the photo upload: runs/exp-m01, exp-m02, exp-m16)', confidence='medium'),
]
c['rules'] = [dict(id=f'R{i+1}', **r) for i, r in enumerate(R)]

# ---------- EXPERIMENTS ----------
idx = json.load(open(os.path.join(ROOT, 'actions', 'experiments-index.json')))
ex = []
for e in idx:
    s = json.load(open(os.path.join(ROOT, 'runs', e['id'], 'summary.json')))
    flow = 'men' if e['id'].startswith('exp-m') else 'women'
    if not s.get('reachedProductScreen'):
        res = "Next blocked by 'Please upload photos' error; no save call, product screen not reached."
    else:
        import re
        ids = list(dict.fromkeys(re.findall(r'id=product_(\d+)', open(os.path.join(ROOT, 'runs', e['id'], 'post.txt')).read())))
        rr = ' '.join(s.get('productRulesReply') or [])
        sug = rr[rr.find('"data"'):rr.find(',"meta"')] if rr else 'no product-rules call (men\'s filter off)'
        res = f"Reached 'Your request' with {len(ids)} options ({', '.join(ids)}). Product-rules: {sug}."
    ex.append(dict(id=e['id'], flow=flow, changed=e['changed'], result=res, run=f"runs/{e['id']}"))
ex.insert(0, dict(id='s2-baseline-men', flow='men', changed='none (baseline replay, walk.js)', result="9 options: generic finasteride 1mg £27/£54/£79/£137 (1/2/3/6 months), Propecia £60/£110/£140/£265, phone consultation £25. No stop.", run='runs/s2-baseline-men'))
ex.insert(1, dict(id='s2b-women-regaine', flow='women', changed='none (baseline replay, Regaine entry)', result='5 options: Regaine for Women £25, Nourkrin £51, Alpecin Caffeine £7.50, Alpecin Double Effect £9.99, phone consultation £25. Product-rules reply empty.', run='runs/s2b-women-regaine'))
ex.insert(2, dict(id='s2b-women-nourkrin', flow='women', changed='none (baseline replay, Nourkrin entry)', result='Same 5 options, Nourkrin listed first. Product-rules reply empty.', run='runs/s2b-women-nourkrin'))
c['experiments'] = ex

# ---------- RECOMMENDATIONS ----------
c['recommendations'] = [
 dict(profile='Baseline man (pattern C, no issues)', offered=['p1', 'p2', 'p9'], default=None, note='Generic finasteride 1mg £27 (1 month), £54, £79, £137 (6 months); Propecia £60, £110, £140, £265; phone consultation £25. Nothing preselected. One-off orders, no subscription. (runs/s2-baseline-men)', evidence='observed'),
 dict(profile='Any man with any single change tested (prostate or breast cancer, liver disease, finasteride allergy, lactose, ED, scalp symptoms, sudden or recent loss, past side effects, pattern D)', offered=['p1', 'p2', 'p9'], default=None, note='Identical to baseline; warnings shown for ED and scalp symptoms only. (runs/exp-m03 to exp-m18)', evidence='observed'),
 dict(profile="Man choosing pattern A, E or 'No pattern fits well'", offered=[], default=None, note='Cannot reach the product list without uploading photos (not done). (runs/exp-m01, exp-m02, exp-m16)', evidence='observed'),
 dict(profile='Baseline woman (either entry)', offered=['p7', 'p8', 'p5', 'p6', 'p9'], default=None, note='Regaine for Women £25, Nourkrin £51, Alpecin Caffeine £7.50, Alpecin Double Effect £9.99, phone £25; the entry product is first. (runs/s2b-women-regaine, s2b-women-nourkrin)', evidence='observed'),
 dict(profile='Woman with high blood pressure, heart condition, minoxidil/ethanol/propylene glycol allergy, or a non-pattern presentation (shaved scalp, sudden or patchy, scalp skin problem, after childbirth)', offered=['p8', 'p5', 'p6', 'p9'], default=None, note='Regaine for Women removed. (runs/exp-w03 to w08, w11, w14, w15)', evidence='observed'),
 dict(profile='Woman with a fish allergy', offered=['p7', 'p5', 'p6', 'p9'], default=None, note='Nourkrin removed. (runs/exp-w12, w22)', evidence='observed'),
 dict(profile='Woman with a caffeine allergy', offered=['p7', 'p8', 'p9'], default=None, note='Both Alpecin shampoos removed. (runs/exp-w13)', evidence='observed'),
 dict(profile='Pregnant or breastfeeding woman', offered=['p7', 'p8', 'p5', 'p6', 'p9'], default=None, note='Same as baseline, Regaine included, no warning. (runs/exp-w01, w02, w21)', evidence='observed'),
]

# ---------- PRODUCTS ----------
rw = {
 'p1': "Every man who completes the questionnaire with pattern B, C or D (or A/E/none-fits with photos), whatever his other answers; no answer removes it on screen. The doctor decides after payment.",
 'p2': "Same as generic finasteride: always listed for men, next to it, at about twice the price.",
 'p3': "Never offered in the consultation: it appears on the men's price table and product page, but the men's 'Your request' list does not include it (runs/s2-baseline-men).",
 'p4': "Never offered in the consultation (same as the foam).",
 'p5': "Offered to every woman unless she reports a caffeine allergy (runs/exp-w13). Not offered to men in the consultation.",
 'p6': "Offered to every woman unless she reports a caffeine allergy (runs/exp-w13). Not offered to men in the consultation.",
 'p7': "Offered to women unless they report high blood pressure, a heart condition, an allergy to minoxidil, ethanol or propylene glycol, or a shaved scalp, sudden or patchy loss, scalp skin problems or loss after childbirth. Pregnancy and breastfeeding do not remove it.",
 'p8': "Offered to women unless they report a fish allergy (runs/exp-w12).",
 'p9': "Always the last option in all three entry points; never removed by any answer tested.",
}
for p in c['products']:
    if p['id'] in rw: p['recommendedWhen'] = rw[p['id']]
    if p['id'] in ('p1', 'p2', 'p5', 'p6', 'p7', 'p8', 'p9'): p['evidence'] = 'observed'

# ---------- SUMMARY / ANALYSIS ----------
c['engineSummary'] = ("Superdrug Online Doctor (Zava platform) runs no recommendation engine. Each service is a one-page medical "
 "questionnaire with show/hide follow-ups, followed by a product list the patient picks from; the doctor decides after "
 "account creation and payment. Men: the list is fixed (generic finasteride or Propecia in four pack sizes, or a £25 phone "
 "consultation). Sixteen one-change replays, including prostate cancer, breast cancer and finasteride allergy, never changed "
 "it; the only on-screen effects are warning texts (scalp symptoms, erection problems, advanced pattern E) and a photo upload "
 "that blocks the form for patterns A, E and 'none fits'. Women: a server-side product-rules call silently removes products "
 "by ingredient and suitability: Regaine for Women goes for high blood pressure, heart disease, non-pattern presentations and "
 "minoxidil/ethanol/propylene glycol allergy; Nourkrin for fish allergy; Alpecin for caffeine allergy. Pregnancy changes nothing. "
 "No answer ever stops the patient before the account wall.")
c['strengths'] = [
 "Trusted high-street brand; CQC-registered doctor service and GPhC-registered Superdrug pharmacies.",
 "Very short: one page, no account until after product and delivery choice, prices shown up front.",
 "Low generic finasteride price (£27 a month, £137 for six months) with free delivery or free store collection.",
 "Women's list is filtered by ingredient allergies and minoxidil safety (blood pressure, heart, non-pattern loss) before the patient chooses, so unsuitable items never show.",
 "Asks for photos when the chosen pattern does not look like typical male pattern loss, and sets realistic expectations for advanced loss.",
 "Clear consent text on fertility, depression, PSA and sexual side effects.",
]
c['weaknesses'] = [
 "Men's screen is not acted on: finasteride allergy, prostate or breast cancer, past low mood on finasteride and sudden loss all still show finasteride and Propecia with no warning; everything waits for the doctor after payment.",
 "Pregnancy and breastfeeding do not remove Regaine for Women or show any warning, although the product should not be used then.",
 "Removals for women are silent: no explanation of why a product disappeared or what to do instead.",
 "Men are offered tablets only: no topical finasteride, no minoxidil (Regaine for Men is advertised but not in the flow), no oral minoxidil, no combinations.",
 "No guidance on which product or pack to choose; no personalisation, no 'recommended' result.",
 "No questions on mood or mental health, family history, age, or fertility plans for men; none on periods, menopause, contraception, PCOS, thyroid or iron for women.",
 "No subscription or follow-up programme; every supply is a new order. Inconsistent site copy (discount codes, phone-consultation days).",
]
c['opportunities'] = [
 "Act on safety answers before payment (stop or switch on finasteride allergy, breast cancer, depression history) and explain why.",
 "Offer a guided result with a reason ('this suits you because…') and an alternative when a product is removed.",
 "Sell topical and combination options for men (topical finasteride, minoxidil, oral minoxidil under a prescriber).",
 "A real women's pathway: differential questions (menopause, PCOS, iron, thyroid, post-partum) and prescription options such as oral minoxidil or spironolactone.",
 "Subscription with check-ins and progress photos to support adherence over the 3 to 6 months finasteride needs.",
]
c['limitations'] = [
 "Only the anonymous part was tested; what the doctor does after account creation and payment is not visible.",
 "Age and sex are asked only at account creation, so under-18, over-65 and wrong-sex handling could not be tested.",
 "Patterns A, E and 'No pattern fits well' block without photos; we never upload, so what follows for them is unknown.",
 "Not replayed (covered by definition or by a matching tested option): men-q1 'by a specialist', men-q2 B, men-q8 skin conditions, men-q11a peanuts or soya, other medications, other substances; delivery options other than free standard (men) and all delivery options in the women's flow.",
 "Only one change at a time was tested: combinations (for example caffeine plus fish allergy) that might leave only the phone consultation were not tried.",
 "The women's product rules sit on the server (/consultation-triage/product-rules); they were read only from replies, so rules for answers not tried are unknown.",
 "The men's repeat-order questionnaire (201038) and everything after sign-in (address, ID check, payment) were not seen.",
 "Regaine legal class is not stated by the site; our browser was seen as outside the UK (clientIPCountryCode 'US') but was not blocked.",
]
a = c['access']
a['coverageNote'] = ("Stage 1 mapped all three entry points and both full questionnaire definitions. Stage 2 replayed the three baselines "
 "and ran 40 one-change experiments (22 women, 18 men): every women's option, and every men's option except a few covered by the "
 "definition (see limitations). Age, sex and the doctor's decision sit behind the account wall and were not tested.")
json.dump(c, open(P, 'w'), indent=2, ensure_ascii=False)
print('patched', len(c['rules']), 'rules', len(c['experiments']), 'experiments')
