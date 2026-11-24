#!/usr/bin/env python3
# Stage 2 patch: writes experiment findings into company.json (options, new questions, rules, experiments, recommendations).
import json, os
D = os.path.join(os.path.dirname(__file__), '..')
P = os.path.join(D, 'company.json')
c = json.load(open(P))
fl = c['flows'][0]
Q = {q['id']: q for q in fl['questions']}

FIN = ['p-fin', 'p-propecia', 'p-dual-tab-spray', 'p-dual-tabs']
OMX = ['p-minox-tab', 'p-dual-tabs']
TMX = ['p-minox-spray', 'p-dual-tab-spray']
ALLMX = ['p-minox-tab', 'p-minox-spray', 'p-dual-tabs', 'p-dual-tab-spray']

def opt(qid, prefix, effect, et, affects=None, ev='observed'):
    q = Q['men-' + qid]
    hits = [o for o in q['options'] if o['label'].startswith(prefix)]
    assert len(hits) == 1, (qid, prefix, [o['label'] for o in q['options']])
    o = hits[0]
    o.update(effect=effect, effectType=et, affects=affects or [], evidence=ev)

def qset(qid, **kw):
    Q['men-' + qid].update(kw)

# ---- options tested in stage 2 ----
if not Q['men-100014']['options']:
    Q['men-100014']['options'] = []
Q['men-100014']['options'] = [
    {'label': 'Age under 18 (e.g. born 2009)', 'effect': 'Questions end at once; redirected to the page "We do not treat under 18s. Please see a doctor in person" (runs/e17-age-17).', 'effectType': 'hard-stop', 'affects': [], 'evidence': 'observed'},
    {'label': 'Age 18 to 64 (tested 19, 32 and 64)', 'effect': 'No change: full offer (runs/e20-age-19, runs/e21-age-64, runs/exp-base).', 'effectType': 'next-question', 'affects': [], 'evidence': 'observed'},
    {'label': 'Age 65 or over (tested 65 and 70)', 'effect': 'No extra screen, but Minoxidil tablets and Dual Action Tablets are removed at the end; the "start with a licensed treatment" line is dropped (runs/e19-age-65, runs/e18-age-70).', 'effectType': 'product-removed', 'affects': OMX, 'evidence': 'observed'},
]
qset('100014', branches=True, branchDetail='Under 18: hard stop (under-18s page). 65 or over: oral minoxidil (and the Dual Action Tablets pack) silently removed from the offer.', engineRole='eligibility-gate', purpose='Age check: adults only, and the age cut-off for oral minoxidil (65 and over).')

opt('107977', 'Skip', 'Skips the three education screens (what causes hair loss, how finasteride works, how minoxidil works); offer unchanged (runs/e24-skip-learn).', 'skip-questions')
opt('103257', 'Temples only', 'Adds an expectation screen ("results can be less predictable in these areas", must tick); offer and wording unchanged (runs/e22-pattern-temples).', 'soft-warning')
opt('103257', 'Extensive', 'Adds an expectation screen ("significant regrowth may be less likely", must tick); offer and wording unchanged (runs/e23-pattern-extensive).', 'soft-warning')
opt('103257', 'Moderate', 'Not replayed to the end in stage 2. The stage 1 peek showed no extra screen; no change to the offer is expected.', 'next-question', [], 'inferred')
opt('105935', 'Yes', 'Adds "Your scalp symptoms need checking" (see your GP; no topical treatments while symptoms are present). Sons Minoxidil spray and Dual Action Tablet + Spray are removed; the pets question is skipped (runs/e06-scalp-yes).', 'product-removed', TMX)
opt('108014', 'Yes', 'Adds "Which hair loss treatments have you used before?" and, for each product ticked, "Has <product> helped?" and a side-effects question. The result says "You\'ve previously used hair loss treatment" and drops the "start with a licensed treatment" line; products unchanged unless side effects are reported (runs/e07-prev-topminox, runs/e08-prev-fin).', 'extra-questions')
opt('108014', 'No', 'Baseline: the result says "You\'re new to hair loss treatment" and adds "we\'d recommend starting with a licensed treatment, such as Finasteride tablets and Minoxidil spray" (runs/exp-base).', 'next-question')
opt('108015', 'Topical minoxidil', 'Adds 108016 "Has Minoxidil spray helped?" then 107959 side effects. If helped and no side effects: same 6 products (runs/e07-prev-topminox).', 'extra-questions')
opt('108015', 'Finasteride tablets', 'Adds 108022 "Has Finasteride tablets helped?" then 107959 side effects. If helped and no side effects: same 6 products (runs/e08-prev-fin).', 'extra-questions')
opt('108015', 'Oral Minoxidil', 'Not tested. Expected (by the pattern of the two tested options) to add its own "has it helped?" and side-effects questions.', 'extra-questions', [], 'inferred')
opt('108015', 'Other hair loss medication', 'Not tested.', 'unknown', [], 'unknown')
opt('103270', 'Breast cancer', 'No extra screen. All finasteride products (Finasteride, Propecia, both Dual Action packs) are removed; the partner-pregnancy question is skipped (runs/e25-breast-cancer).', 'product-removed', FIN)
opt('103270', 'Breast tissue enlargement', 'No extra screen. All finasteride products removed; partner-pregnancy question skipped (runs/e31-gynaecomastia).', 'product-removed', FIN)
opt('103270', 'Prostate cancer', 'No extra screen. All finasteride products removed; partner-pregnancy question skipped (runs/e26-prostate-cancer).', 'product-removed', FIN)
opt('103270', 'Problems with my sex life', 'No extra screen. All finasteride products removed; partner-pregnancy question skipped (runs/e32-sex-problems).', 'product-removed', FIN)
opt('103270', 'Depression', 'Adds a finasteride mood warning (103268) with an opt-out. Continue: 4 mental-health questions, then the same 6 products but without the "licensed first" line (runs/e05-dep-continue). Opt out: finasteride removed (runs/e04-dep-nofin).', 'extra-questions')
for lab in ['Phaeochromocytoma', 'Porphyria', 'Systemic Lupus']:
    opt('103270', lab, 'Not tested (an explanation pop-up blocked the stage 1 walker; no replay left in the stage 2 budget). Inferred: likely removes minoxidil (phaeochromocytoma and porphyria are minoxidil warnings in its SmPC).', 'unknown', [], 'unknown')
opt('103268', "I don't want", 'All finasteride products removed; only Minoxidil tablets and Sons spray offered; the partner-pregnancy question is skipped (runs/e04-dep-nofin).', 'product-removed', FIN)
opt('103268', 'I understand', 'Adds 4 mental-health questions (3 free text + crisis history). With neutral answers the offer keeps all 6 products, but the "start with a licensed treatment" line is dropped (runs/e05-dep-continue).', 'extra-questions')
opt('108419', 'No', 'Neutral answer used in runs/e05-dep-continue: full offer kept.', 'next-question')
opt('108419', 'Yes', 'Not tested.', 'unknown', [], 'unknown')
opt('101564', 'More than 30', 'Minoxidil tablets and Dual Action Tablets removed; spray, finasteride, Propecia and Dual Tablet + Spray kept (runs/e15-ckd-egfr-over30).', 'product-removed', OMX)
opt('101564', 'I don\'t know', 'Same as "More than 30": oral minoxidil removed (runs/e16-ckd-egfr-unknown).', 'product-removed', OMX)
opt('101564', 'I haven', 'Not replayed. Inferred to match "I don\'t know" (oral minoxidil removed), since any kidney disease answer short of eGFR under 30 removed it in both tests.', 'product-removed', OMX, 'inferred')
opt('101561', 'Yes', 'Adds the eGFR question. Under 30 ends the questions; any other answer removes oral minoxidil (runs/e15, runs/e16).', 'product-removed', OMX)
opt('107973', 'Yes', 'No extra screen. ALL minoxidil removed (tablets, Sons spray and both Dual Action packs): only Finasteride and Propecia are offered. The pets question and "Clinically proven results" screen are skipped (runs/e01-heart-yes).', 'product-removed', ALLMX)
opt('107800', 'Yes', 'Adds a free-text "more details" question; with a minor condition the offer is unchanged (runs/e33-other-condition). Read by the clinician later.', 'flag-for-clinician')
opt('103769', 'Medicines for high blood pressure', 'ALL minoxidil removed (tablets, spray, both Dual packs): only Finasteride and Propecia (runs/e27-bp-meds).', 'product-removed', ALLMX)
opt('103769', 'Finasteride or Dutasteride', 'All finasteride products removed; only Minoxidil tablets and spray (runs/e29-5ari-prostate).', 'product-removed', FIN)
opt('103769', 'Antidepressants', 'Adds "Please can you list all your medications" (free text); offer unchanged (runs/e28-antidepressants).', 'flag-for-clinician')
opt('103769', 'Erectile dysfunction', 'Finasteride products AND Minoxidil tablets removed: only Sons Minoxidil spray is offered (runs/e30-ed-tablets).', 'product-removed', FIN + ['p-minox-tab'])
opt('103769', 'Medicated creams', 'Not tested. Inferred: may remove topical minoxidil (scalp treatment), not confirmed.', 'unknown', [], 'unknown')
opt('103769', 'Guanethidine', 'Not replayed to the end in stage 2 (stage 1 saw a follow-up). Inferred: likely removes minoxidil (guanethidine interaction in the minoxidil SmPC); not confirmed.', 'extra-questions', [], 'inferred')
for lab in ['Inhalers', 'Antihistamines', 'Painkillers', 'Acid reflux']:
    opt('108158', lab, 'Not tested. Inferred: no effect on the offer (no known interaction with finasteride or minoxidil).', 'none', [], 'inferred')
opt('100038', 'Minoxidil', 'Adds an ingredients warning (108405). ALL minoxidil removed; only Finasteride and Propecia; pets question skipped (runs/e11-allergy-minox).', 'product-removed', ALLMX)
opt('100038', 'Finasteride', 'Adds an ingredients warning (108405). All finasteride removed; only Minoxidil tablets and spray; partner-pregnancy question skipped (runs/e12-allergy-fin).', 'product-removed', FIN)
opt('108003', 'My partner is pregnant', 'No extra screen and no change to the offer or wording (runs/e03-partner-pregnant). Finasteride cards still say tablets must not be handled by pregnant women.', 'none')
opt('108003', 'We are currently planning', 'Adds "Finasteride and trying for a baby" (we don\'t prescribe finasteride to men trying for a baby). All finasteride removed; only Minoxidil tablets and spray (runs/e02-trying-baby).', 'product-removed', FIN)
opt('108001', 'Yes', 'Adds a pets warning (topical minoxidil is toxic to pets; tick "I confirm"); offer unchanged (runs/e14-pets-yes).', 'soft-warning')

# question-level updates
qset('107977', branches=True, branchDetail='Skip removes 3 education screens; no effect on the offer.')
qset('103257', branchDetail='Complete or Random patches: hard stop. Temples only / Extensive: expectation screen, offer unchanged. Temples and Crown / Moderate: straight on.')
qset('105935', engineRole='product-selector', branchDetail='Yes: warning screen, topical minoxidil products removed, pets question skipped.')
qset('108014', branchDetail='Yes: previous-treatment list, then per product "has it helped?" (No benefit adds duration + adherence questions) and side effects (Yes adds describe + "choose finasteride again?"). Changes the result wording; finasteride removed if side effects and the patient declines it.')
qset('108015', purpose='Which treatments were used before, to ask about benefit and side effects of each.', engineRole='product-selector', branches=True, branchDetail='Each ticked product adds its own "has it helped?" question, then the shared side-effects question 107959.', shownWhen='108014 = Yes')
qset('103270', engineRole='safety-screen', branches=True, branchDetail='Alopecia: hard stop. Depression: mood warning + opt-out. Suicidal thoughts: crisis advice. Obstructive uropathy: details text. Liver: sub-questions. Breast cancer, breast tissue enlargement, prostate cancer, problems with sex life: silently remove all finasteride.')
qset('103268', engineRole='product-selector', branches=True, branchDetail='Opt-out removes finasteride; continue adds 4 mental-health questions.')
qset('101564', engineRole='safety-screen', branches=True, branchDetail='Less than 30: hard stop. Any other answer: oral minoxidil removed.')
qset('107973', engineRole='safety-screen', branches=True, branchDetail='Yes silently removes every minoxidil product (oral and topical) and skips the pets question.')
qset('103769', engineRole='safety-screen', branches=True, branchDetail='BP medicines: all minoxidil removed. 5-ARI for prostate: finasteride removed. ED tablets: finasteride and oral minoxidil removed. Antidepressants: medication list text.')
qset('100038', engineRole='safety-screen', branches=True, branchDetail='Each ticked allergy removes every product containing that drug, after an ingredients warning.')
qset('108003', engineRole='product-selector', branches=True, branchDetail='Trying for a baby: warning, finasteride removed. Partner pregnant: no change. Shown only when finasteride is still possible (skipped after any finasteride removal).', shownWhen='only while a finasteride product is still on offer (skipped after depression opt-out, breast/prostate cancer, breast tissue enlargement, sex-life problems, 5-ARI use, ED tablets, finasteride allergy or finasteride side effects declined)')
qset('108001', shownWhen='only while a topical minoxidil product is still on offer (skipped after scalp changes Yes, heart/BP Yes, BP medicines or minoxidil allergy)', branchDetail='Yes: pets warning only; offer unchanged.', engineRole='safety-screen')
qset('108360', shownWhen='only when both finasteride and minoxidil are still on offer (skipped in every run where either drug was removed)', branches=False)
qset('100014', evidence='observed')

# ---- new questions found in stage 2 ----
def newq(qid, order, text, typ, options, purpose, role, branches, detail, shown):
    q = {'id': 'men-' + qid, 'order': order, 'stage': 'anonymous', 'text': text, 'type': typ, 'options': options, 'purpose': purpose,
         'engineRole': role, 'branches': branches, 'branchDetail': detail, 'shownWhen': shown, 'evidence': 'observed', 'siteQuestionId': qid}
    if 'men-' + qid in Q:
        Q['men-' + qid].update(q)
    else:
        fl['questions'].append(q); Q[q['id']] = q

def o(label, effect, et, affects=None, ev='observed'):
    return {'label': label, 'effect': effect, 'effectType': et, 'affects': affects or [], 'evidence': ev}

helped = lambda prod, run: [
    o("Yes, it's helped", 'Goes to the side-effects question; no change to the offer (%s).' % run, 'next-question'),
    o("It's helped a little", 'Goes to the side-effects question (stage 2 peek, runs/e07b-prev-topminox-peek); effect on the offer not replayed.', 'next-question'),
    o("No, I haven't noticed any benefit", 'Adds "How long have you used it?" and "Have you used it regularly?". After 12 months+ of regular use, the result adds "Previously, treatment with %s didn\'t achieve the results you were hoping for" but still offers it (runs/e09-prev-topminox-nobenefit).' % prod if prod == 'Minoxidil spray' else 'Inferred from the spray version: adds duration and adherence questions and a "didn\'t achieve the results" line.', 'extra-questions', [], 'observed' if prod == 'Minoxidil spray' else 'inferred'),
    o("It's too early to tell", 'Not replayed.', 'unknown', [], 'unknown'),
]
newq('108016', 15.1, 'Hair loss medication: Has Minoxidil spray helped with your hair loss? This could mean slowing or stopping further hair loss, or helping hair grow back.', 'single', helped('Minoxidil spray', 'runs/e07-prev-topminox'),
     'Benefit from previous topical minoxidil.', 'personalisation', True, 'No benefit adds duration and adherence questions and changes the result wording.', '108015 includes Topical minoxidil')
newq('108022', 15.2, 'Hair loss medication: Has Finasteride tablets helped with your hair loss? This could mean slowing or stopping further hair loss, or helping hair grow back.', 'single', helped('Finasteride tablets', 'runs/e08-prev-fin'),
     'Benefit from previous finasteride.', 'personalisation', True, 'Expected to mirror 108016.', '108015 includes Finasteride tablets')
newq('108017', 15.3, 'Hair loss medication: How long have you used Minoxidil spray?', 'single', [
    o('Less than 12 months', 'Not replayed. Inferred: may change the "didn\'t achieve results" wording (too early to judge).', 'unknown', [], 'unknown'),
    o('12 months or longer', 'Used in runs/e09-prev-topminox-nobenefit: result says the spray didn\'t achieve the results hoped for; still offered.', 'next-question')],
    'Whether a fair trial of the product was done.', 'personalisation', False, '', '108016 = No, I haven\'t noticed any benefit (shown on the same screen as 108018)')
newq('108018', 15.4, 'Hair loss medication: Have you used Minoxidil spray regularly? This means using it as recommended, with only occasional missed applications and no long breaks.', 'single', [
    o('Yes', 'Used in runs/e09-prev-topminox-nobenefit (see 108017).', 'next-question'),
    o('No', 'Not replayed.', 'unknown', [], 'unknown')],
    'Adherence check before calling the product a failure.', 'personalisation', False, '', '108016 = No, I haven\'t noticed any benefit')
newq('107959', 15.5, 'Side effects: Have you ever experienced side effects from <product> that: were persistent, were severe, required medical attention, made you stop using it', 'single', [
    o('Yes', 'Adds "Please describe the side effects" (107981); for finasteride it then asks 108051 whether to offer finasteride again (runs/e10-prev-fin-sidefx).', 'extra-questions'),
    o('No', 'No change to the offer (runs/e07-prev-topminox, runs/e08-prev-fin).', 'next-question')],
    'Serious side effects with a product used before.', 'safety-screen', True, 'Yes adds a description and, for finasteride, a "choose it again?" question.', 'after each "has it helped?" question (same question id for each product)')
newq('107981', 15.6, 'Side effects: Please describe the side effects you experienced.', 'text', [], 'Free-text side-effect history for the clinician.', 'data-capture', False, '', '107959 = Yes')
newq('108051', 15.7, 'Side effects: Would you like the option to choose a treatment containing Finasteride 1mg tablets again, despite your previous side effects?', 'single', [
    o('Yes', 'All 6 products kept; result says "You reported side effects ... but would like to be recommended options containing Finasteride tablets" (runs/e13-prev-fin-sidefx-again).', 'next-question'),
    o('No', 'All finasteride products removed; result says "You reported side effects to hair loss treatments"; partner-pregnancy question skipped (runs/e10-prev-fin-sidefx).', 'product-removed', FIN)],
    'Lets the patient decide whether finasteride stays on the menu after past side effects.', 'product-selector', True, 'No removes finasteride.', '107959 = Yes for finasteride')
fl['questions'].sort(key=lambda q: q['order'])

json.dump(c, open(P, 'w'), indent=1, ensure_ascii=False)
print('patched options/questions;', len(fl['questions']), 'questions')
