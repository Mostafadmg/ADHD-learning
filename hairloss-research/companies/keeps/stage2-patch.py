# Stage 2 (EXPERIMENT) patch for company.json. Run: python3 -I stage2-patch.py
# Reads company.json (built by build-company.py), adds experiment results, upgrades evidence to 'observed'
# where a live replay proved it, rewrites rules and recommendations, and writes the file back.
import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
c = json.load(open('company.json', encoding='utf8'))
idx = {e['id']: e for e in json.load(open('experiments/index.json', encoding='utf8'))}

BASE = "baseline (runs/baseline-men-r2: Chew+ id 19277, plan page then checkout $100.00 first 3 months, then $204.99 every 3 months)"
RESULTS = {
 'exp-01': "Product switched: plan page and checkout for Drop+ (id 18636). Checkout $149.93 for the first 3 months, then $214.99 every 3 months. No new questions, no warning.",
 'exp-02': "Product switched: Chew (id 18640, finasteride 1 mg + minoxidil 2.5 mg + D3). Checkout $94.96 first 3 months, then $159.99. No new questions.",
 'exp-03': "Product switched: Drop (id 18635, finasteride + minoxidil topical). Checkout $140.02 first 3 months, then $194.99. Confirms the two-answer lookup (form x priority).",
 'exp-04': "No change: Chew+ 19277; plan-page text identical to baseline (0 lines differ). 'Daily Chew' and 'not sure' are treated the same.",
 'exp-05': "No change: Chew+ 19277; plan-page text identical.",
 'exp-06': "No change: Chew+ 19277; plan-page text identical. Skipping the priority is treated like 'balanced'.",
 'exp-07': "HARD STOP at ?step=4: 'This treatment may not be a good fit right now. Based on your answers, prescription hair loss treatments are unlikely to be effective at this stage. Many people at this stage explore options like hair restoration or cosmetic solutions.' Only button: Back to homepage.",
 'exp-08': "No stop and no warning: Chew+ 19277. Only the echoed label changes ('Moderate' becomes 'Patchy Loss').",
 'exp-09': "HARD STOP at the state step: 'We currently don't serve in your state. Please check back soon.' The page does not move on after 'Show my plan'.",
 'exp-09a-arkansas-gate': "Typing 'Kansas' in the search box picked Arkansas first; Arkansas was accepted at the gate (no refusal message). Run stopped before the plan page, so not used as proof of the Kansas refusal.",
 'exp-10': "No change: Chew+ 19277; plan-page text identical. State does not change product or price.",
 'exp-11': "Extra question 'How did it go?' appeared (answered 'Had side effects'). No warning, no stop, no follow-up about which side effect. Chew+ 19277; plan-page text identical.",
 'exp-12': "No change: Chew+ 19277. Only the echoed label changes ('1-3 years' becomes 'Less than 6 months'). Recent onset is not flagged.",
 'exp-13': "No change: Chew+ 19277. Only the echoed label changes ('Patterned' becomes 'Advanced').",
 'exp-14': "No change: Chew+ 19277. Only the echoed label changes ('Regrow' becomes 'Preserve').",
 'exp-15': "No change: Chew+ 19277. Only the echoed label changes ('Moderate' becomes 'Advanced'). 'Advanced' on the first picture screen does not stop the quiz.",
 'exp-16': "No change: Chew+ 19277; plan-page text identical.",
 'exp-17': "Plan page: the link reveals Drop and Drop+ cards with their own prices (Drop 3-month $63.33 shown, $46.67/mo, $49 off; Drop+ $70.00 shown, $49.98/mo, $60 off; monthly $109.99/$119.99 list). The banner still says 'Recommended for you: Chew+'.",
 'exp-18': "Extra question 'How did it go?' appeared (answered 'Didn't see results'). No change: Chew+ 19277; plan-page text identical.",
 'exp-19': "No stop: Chew+ 19277. Only the echoed label changes ('Moderate' becomes 'Diffuse Thinning').",
 'exp-g1': "No change: still Gel+ (id 19267) on /hair-treatment-plan-gel. The gel funnel ignores the priority answer.",
 'exp-g2': "Gel plan page: the link reveals Chew and Chew+ cards; the default product in the address stays 19267.",
 'exp-g3': "HARD STOP at ?step=4 with the same 'This treatment may not be a good fit right now' screen as the main quiz.",
 'exp-L01': "Basket changed to finasteride 211 + oral minoxidil 989 (topical foam 239 removed). Address /quiz/lead?products=211,989.",
 'exp-L02': "No change: 211 + 239 (same as 'A bit of both').",
 'exp-L03': "No basket: the browser jumps straight to /request/lead (a 'start your consultation' form asking name and email). Clinician route; stopped at the wall.",
 'exp-L04': "Question set changed: 'Has anyone in your family experienced hair loss?' replaces the expectations and pill-preference questions (answered 'I'm not sure'). Basket 239 + 499 + 500 (minoxidil foam, thickening shampoo and conditioner); finasteride left out.",
 'exp-L05': "Basket 211 + 989: foam removed, oral minoxidil added.",
 'exp-L06': "No change: 211 + 239.",
 'exp-L07': "Basket 211 only (finasteride alone): hairline with a topical preference gets no minoxidil at all.",
 'exp-L08': "No change: 211 + 239.",
 'exp-L09': "No change: 211 + 239.",
 'exp-L10': "Basket 211 + 11840: minoxidil foam swapped for the compounded Minoxidil+ Spray (minoxidil with tretinoin).",
 'exp-L11': "Basket 211 + 239 + 2874: Daily Hair Defense Supplement added.",
 'exp-L12': "Basket 211 + 239 + 240: ketoconazole 2% shampoo added.",
 'exp-L13': "Basket 211 + 2874 + 11840: supplement added AND foam swapped for Minoxidil+ Spray.",
 'exp-L14': "Basket 211 + 239 + 499 + 500: thickening shampoo and conditioner added.",
 'exp-L15': "Basket 211 + 239 + 682: thickening pomade added.",
 'exp-L16': "Basket 211 + 239 + 240: ketoconazole shampoo added. No warning for redness or burning.",
 'exp-L17': "No change: 211 + 239 (the campaign-only shampoo rule did not fire for an ordinary visitor).",
 'exp-L18': "No change: 211 + 239.",
 'exp-L19': "Basket 211 + 989 (same as hairline with no preference).",
}
ORDER = ['exp-%02d' % i for i in range(1, 20)]
ORDER.insert(9, 'exp-09a-arkansas-gate')
ORDER += ['exp-g1', 'exp-g2', 'exp-g3'] + ['exp-L%02d' % i for i in range(1, 20)]
c['experiments'] = [
 {'id': 'baseline-men-r2', 'flow': 'men', 'changed': 'none (baseline replay)', 'result': 'Still works: plan page names Chew+ (19277) as recommended, Chew as second card; checkout form reached at /express/checkout?products=19277 (nothing typed): $100.00 today, then $204.99 every 3 months.', 'run': 'runs/baseline-men-r2'},
 {'id': 'baseline-men-gel-r2', 'flow': 'men-gel', 'changed': 'none (baseline replay)', 'result': 'Still works: ends on /hair-treatment-plan-gel?productId=19267 (Gel+).', 'run': 'runs/baseline-men-gel-r2'},
 {'id': 'baseline-men-legacy-quiz-r2', 'flow': 'men-legacy', 'changed': 'none (baseline replay)', 'result': 'Still works: ends on the account wall /quiz/lead?products=211,239 (finasteride 1 mg + minoxidil 5% foam).', 'run': 'runs/baseline-men-legacy-quiz-r2'},
]
for i in ORDER:
    run = 'runs/' + ('exp-09' if i == 'exp-09a-arkansas-gate' and not os.path.isdir('runs/' + i) else i)
    c['experiments'].append({'id': i, 'flow': idx[i]['flow'], 'changed': idx[i]['changed'], 'result': RESULTS[i], 'run': run})

# ---------- option evidence upgrades ----------
def flow(fid): return next(f for f in c['flows'] if f['id'] == fid)
def q(fid, qid): return next(x for x in flow(fid)['questions'] if x['id'] == qid)
def opt(fid, qid, prefix):
    for o in q(fid, qid)['options']:
        if o['label'].startswith(prefix): return o
    raise KeyError((fid, qid, prefix))
def mark(fid, qid, prefix, run, effect=None, etype=None):
    o = opt(fid, qid, prefix)
    if effect: o['effect'] = effect
    if etype: o['effectType'] = etype
    o['effect'] = o['effect'].replace(' (code, not yet replayed)', '').rstrip() + ' Confirmed live: runs/%s.' % run
    o['evidence'] = 'observed'

M = 'men'
mark(M, 'men-form', 'Topical Drop', 'exp-01')
mark(M, 'men-form', 'Daily Chew', 'exp-04')
mark(M, 'men-priority', 'Keeping treatment', 'exp-02')
mark(M, 'men-priority', 'Seeing results', 'exp-05')
mark(M, 'men-priority', "I'm not sure", 'exp-06')
mark(M, 'men-picture2', 'Mostly Scalp', 'exp-07')
mark(M, 'men-picture2', 'Patchy Loss', 'exp-08', effect="No stop, no warning and no change of product; the label is only repeated back on the plan page.")
mark(M, 'men-picture2', 'Diffuse Thinning', 'exp-19', effect="No change of product; the label is only repeated back on the plan page.")
mark(M, 'men-picture', 'Not seeing a match?', 'exp-07')
mark(M, 'men-picture', 'Advanced', 'exp-15')
mark(M, 'men-state', 'Idaho', 'exp-09')
mark(M, 'men-state', 'California', 'exp-10')
mark(M, 'men-treated', 'Yes', 'exp-11')
mark(M, 'men-results', 'Had side effects', 'exp-11', effect="No warning, no follow-up question about the side effect, no change of product (Chew+ still recommended).")
mark(M, 'men-results', "Didn't see results", 'exp-18', effect="No change of product or wording.")
mark(M, 'men-duration', 'Less than 6 months', 'exp-12')
mark(M, 'men-stage', 'Advanced hair loss', 'exp-13')
mark(M, 'men-goal', 'Keep my hair', 'exp-14')
mark(M, 'men-comments', 'Yes', 'exp-16')
mark(M, 'men-plan', 'Want to switch', 'exp-17', effect="Shows the Drop and Drop+ cards with their prices instead; the banner still says 'Recommended for you: Chew+'.")
for qid in ('men-picture2', 'men-kickout', 'men-results'):
    q(M, qid)['evidence'] = 'observed'
G = 'men-gel'
mark(G, 'gel-priority', 'Keeping treatment', 'exp-g1')
mark(G, 'gel-plan', 'Want to switch', 'exp-g2')
mark(G, 'gel-picture2', 'Mostly Scalp', 'exp-g3')
mark(G, 'gel-picture', 'Not seeing a match?', 'exp-g3')
for qid in ('gel-picture2', 'gel-kickout'):
    q(G, qid)['evidence'] = 'observed'
L = 'men-legacy'
mark(L, 'leg-where', 'Hairline', 'exp-L01')
mark(L, 'leg-where', 'Crown', 'exp-L02')
mark(L, 'leg-where', 'Patchy', 'exp-L03')
mark(L, 'leg-where', 'Nowhere yet', 'exp-L04', effect="Finasteride is left out and the finasteride tick is hidden; the family-history question replaces the expectations and pill-preference questions; basket = minoxidil foam + thickening shampoo + conditioner.", etype='product-removed')
mark(L, 'leg-family', 'I’m not sure', 'exp-L04')
mark(L, 'leg-form', 'Pills', 'exp-L05')
mark(L, 'leg-form', 'Topicals', 'exp-L06', effect="No oral minoxidil. With crown or both, the basket is unchanged (finasteride + foam); with hairline only, the basket becomes finasteride alone (exp-L07).")
mark(L, 'leg-ingredients', 'Products with finasteride', 'exp-L08')
mark(L, 'leg-ingredients', 'Products with minoxidil', 'exp-L09')
mark(L, 'leg-ingredients', 'Products with tretinoin', 'exp-L10')
mark(L, 'leg-ingredients', 'Products with saw palmetto', 'exp-L11')
mark(L, 'leg-ingredients', 'Products with ketoconazole', 'exp-L12')
mark(L, 'leg-otc', 'Vitamins', 'exp-L13')
mark(L, 'leg-otc', 'Hair care', 'exp-L14')
mark(L, 'leg-otc', 'Hair styling', 'exp-L15')
mark(L, 'leg-dandruff', 'Yes', 'exp-L16')
mark(L, 'leg-expect', 'I want thicker hair', 'exp-L17', effect="No change for an ordinary visitor (the code adds shampoo and conditioner only in one advertising-campaign variant, not seen).", etype='none')
mark(L, 'leg-expect', 'I want to prevent', 'exp-L18')
q(L, 'leg-family')['evidence'] = 'observed'

# ---------- rules ----------
R = {r['id']: r for r in c['rules']}
def upd(rid, proof, conf='high', **kw):
    r = R[rid]; r['evidence'] = 'observed'; r['proof'] = proof + '; code: ' + r['proof'].split(' - not yet')[0]; r['confidence'] = conf; r.update(kw)
upd('R1', 'runs/exp-01 (Drop+ 18636) and runs/exp-04 (Daily Chew = no change) vs runs/baseline-men-r2')
upd('R2', 'runs/exp-02 (Chew 18640), runs/exp-03 (Drop 18635), runs/exp-05 and exp-06 (no change) vs runs/baseline-men-r2')
upd('R3', 'runs/exp-07 (main) and runs/exp-g3 (gel): stop screen at ?step=4; runs/exp-08 and exp-19 show Patchy Loss and Diffuse Thinning pass', then="The quiz stops with 'This treatment may not be a good fit right now ... prescription hair loss treatments are unlikely to be effective at this stage.' Only 'Back to homepage' is offered. Patchy Loss, Diffuse Thinning and 'Advanced' do not stop.")
upd('R4', 'runs/exp-09 (Idaho refused) and runs/exp-10 (California accepted, no change)', conf='high')
upd('R6', 'runs/exp-04, 05, 06, 08, 10, 11, 12, 13, 14, 15, 16, 18, 19: all end on Chew+ 19277 with plan-page text identical to baseline except the echoed label')
upd('R8', 'runs/exp-L03 (jumps to /request/lead)')
upd('R9', 'runs/exp-L04 (/quiz/lead?products=239,499,500)', then="Finasteride is left out; the family-history question replaces the expectation and pill-preference questions; minoxidil foam plus thickening shampoo and conditioner are recommended.")
upd('R10', 'runs/exp-L01 (hairline -> 211,989), exp-L05 (pills -> 211,989), exp-L19 (hairline+pills -> 211,989), exp-L06 (topicals, both -> 211,239)')
upd('R11', 'runs/exp-L16 (dandruff Yes -> +240) and exp-L12 (ketoconazole tick -> +240)')
R['R12']['proof'] += '; replayed runs/baseline-men-legacy-quiz-r2 and runs/exp-L02 (Crown, same basket)'
new = [
 dict(id='R13', flow='men-gel', when="gel-priority = 'Keeping treatment simple & affordable' (or any other answer)", then='No change: Gel+ (19267) is still the only product shown.', effectType='none', affects=['p5'], evidence='observed', proof='runs/exp-g1 vs runs/baseline-men-gel-r2', confidence='high'),
 dict(id='R14', flow='men-legacy', when="leg-where = 'Hairline' and leg-form = 'Topicals'", then='Finasteride 1 mg alone; no minoxidil of any kind (oral is excluded by the preference, foam is never offered for hairline-only).', effectType='product-removed', affects=['p8', 'p9', 'p11'], evidence='observed', proof='runs/exp-L07 (/quiz/lead?products=211)', confidence='high'),
 dict(id='R15', flow='men-legacy', when="'Products with tretinoin' ticked (leg-ingredients)", then='Minoxidil 5% foam is swapped for the compounded Minoxidil+ Spray (11840).', effectType='product-switched', affects=['p9', 'p12'], evidence='observed', proof='runs/exp-L10 (211,11840)', confidence='high'),
 dict(id='R16', flow='men-legacy', when="'Vitamins and supplements' ticked (leg-otc)", then='Daily Hair Defense Supplement (2874) is added AND minoxidil foam is swapped for Minoxidil+ Spray (11840).', effectType='product-switched', affects=['p9', 'p12', 'p17'], evidence='observed', proof='runs/exp-L13 (211,2874,11840)', confidence='high'),
 dict(id='R17', flow='men-legacy', when="'Products with saw palmetto' ticked (leg-ingredients)", then='Daily Hair Defense Supplement (2874) is added; nothing else changes.', effectType='product-added', affects=['p17'], evidence='observed', proof='runs/exp-L11 (211,239,2874)', confidence='high'),
 dict(id='R18', flow='men-legacy', when="'Hair care products (shampoo and conditioner)' ticked (leg-otc)", then='Thickening shampoo (499) and conditioner (500) are added.', effectType='product-added', affects=['p14', 'p15'], evidence='observed', proof='runs/exp-L14', confidence='high'),
 dict(id='R19', flow='men-legacy', when="'Hair styling products (pomade)' ticked (leg-otc)", then='Thickening pomade (682) is added.', effectType='product-added', affects=['p16'], evidence='observed', proof='runs/exp-L15', confidence='high'),
 dict(id='R20', flow='men-legacy', when="leg-expect = any option, or 'Products with finasteride' / 'Products with minoxidil' ticked", then='No change to the basket (finasteride + foam for the baseline).', effectType='none', affects=[], evidence='observed', proof='runs/exp-L08, L09, L17, L18 vs runs/baseline-men-legacy-quiz-r2', confidence='high'),
 dict(id='R21', flow='men', when="men-treated = 'Yes'", then="Adds 'How did it go?'. No answer to it (including 'Had side effects') changes the product, adds a warning or asks what the side effect was.", effectType='extra-questions', affects=[], evidence='observed', proof='runs/exp-11 and runs/exp-18 vs runs/baseline-men-r2', confidence='high'),
 dict(id='R22', flow='men', when="plan page: 'Want to switch to topical solutions?' clicked", then="Drop and Drop+ cards replace Chew and Chew+, each with its own price; the 'Recommended for you: Chew+' banner stays.", effectType='product-switched', affects=['p3', 'p4'], evidence='observed', proof='runs/exp-17', confidence='high'),
 dict(id='R23', flow='men-gel', when="gel plan page: 'Want to switch to oral solutions?' clicked", then='Chew and Chew+ cards are shown instead of Gel+.', effectType='product-switched', affects=['p1', 'p2'], evidence='observed', proof='runs/exp-g2', confidence='high'),
 dict(id='R24', flow='men', when='sex = female (no question asks it; the only check is the tick box)', then="Women are not served: the not-eligible page says 'We're sorry Keeps can't help you, but Nurx can'.", effectType='hard-stop', affects=[], evidence='observed', proof='runs/entry-points/16.txt (/not-eligible-user/sex)', confidence='high'),
]
c['rules'] = [r for r in c['rules'] if r['id'] not in {n['id'] for n in new}] + new

# ---------- recommendations ----------
c['recommendations'] = c['recommendations'][:3]
c['recommendations'][0]['note'] = c['recommendations'][0]['note'].replace('runs/baseline-men/17.txt', 'runs/baseline-men/17.txt; replayed runs/baseline-men-r2') + ' Checkout: $100.00 today, then $204.99 every 3 months (3-month plan).'
c['recommendations'] += [
 dict(profile="Baseline woman (38, diffuse thinning)", offered=[], default=None, note="Not served. Keeps is for men only; the quiz has no sex question, only an '18+ and assigned male at birth' tick box, and the not-eligible page refers women to Nurx.", evidence='observed'),
 dict(profile="Baseline man, priority 'Keeping treatment simple & affordable'", offered=['p1', 'p2', 'p3', 'p4'], default='p1', note='Chew (finasteride 1 mg + minoxidil 2.5 mg + D3). Checkout $94.96, then $159.99 per 3 months. runs/exp-02.', evidence='observed'),
 dict(profile="Baseline man, form 'Topical Drop (Rx Serum)'", offered=['p4', 'p3', 'p1', 'p2'], default='p4', note='Drop+ (topical dutasteride + minoxidil). Checkout $149.93, then $214.99 per 3 months. runs/exp-01.', evidence='observed'),
 dict(profile="Baseline man, form 'Topical Drop' + priority 'affordable'", offered=['p3', 'p4', 'p1', 'p2'], default='p3', note='Drop (topical finasteride + minoxidil). Checkout $140.02, then $194.99 per 3 months. runs/exp-03.', evidence='observed'),
 dict(profile="Any man choosing picture 'Not seeing a match?' then 'Mostly Scalp' (main or gel quiz)", offered=[], default=None, note="Stop screen: 'This treatment may not be a good fit right now'; suggests hair restoration or cosmetic options. runs/exp-07, runs/exp-g3.", evidence='observed'),
 dict(profile='Man in a refused state (AA, AE, AP, DC, DE, ID, KS, MS, NM, PR, RI, WV)', offered=[], default=None, note="'We currently don't serve in your state. Please check back soon.' Proved for Idaho (runs/exp-09); the rest are from the code list.", evidence='observed'),
 dict(profile='Man with side effects from earlier treatment, patchy loss, loss under 6 months or advanced loss (main quiz)', offered=['p2', 'p1', 'p3', 'p4'], default='p2', note='Exactly the baseline offer (Chew+): these answers are only echoed back. runs/exp-08, 11, 12, 13, 15, 18, 19.', evidence='observed'),
 dict(profile='Legacy quiz: hairline only, no preference or pills', offered=['p8', 'p11'], default='p8', note='Finasteride 1 mg + oral minoxidil 2.5 mg. runs/exp-L01, exp-L19.', evidence='observed'),
 dict(profile='Legacy quiz: crown or both, prefers pills', offered=['p8', 'p11'], default='p8', note='Finasteride + oral minoxidil; foam dropped. runs/exp-L05.', evidence='observed'),
 dict(profile='Legacy quiz: hairline only, prefers topicals', offered=['p8'], default='p8', note='Finasteride alone. runs/exp-L07.', evidence='observed'),
 dict(profile="Legacy quiz: 'Nowhere yet' (prevention)", offered=['p9', 'p14', 'p15'], default='p9', note='Minoxidil foam + thickening shampoo + conditioner; no finasteride. runs/exp-L04.', evidence='observed'),
 dict(profile='Legacy quiz: patchy (coin-sized) bald spots', offered=[], default=None, note='No basket: sent to the clinician request form /request/lead (name and email wall). runs/exp-L03.', evidence='observed'),
 dict(profile='Legacy quiz: baseline plus tretinoin interest', offered=['p8', 'p12'], default='p8', note='Finasteride + Minoxidil+ Spray. runs/exp-L10.', evidence='observed'),
 dict(profile='Legacy quiz: baseline plus vitamins/supplements interest', offered=['p8', 'p12', 'p17'], default='p8', note='Finasteride + Minoxidil+ Spray + supplement. runs/exp-L13.', evidence='observed'),
 dict(profile='Legacy quiz: baseline plus dandruff, ketoconazole, saw palmetto, hair care or pomade', offered=['p8', 'p9', 'p13', 'p17', 'p14', 'p15', 'p16'], default='p8', note='Baseline pair plus the one add-on each answer triggers: dandruff or ketoconazole -> p13; saw palmetto -> p17; hair care -> p14 + p15; pomade -> p16. runs/exp-L11, L12, L14, L15, L16.', evidence='observed'),
]

# ---------- products ----------
P = {p['id']: p for p in c['products']}
P['p1']['recommendedWhen'] = "Main quiz: priority 'Keeping treatment simple & affordable' with form 'Daily Chew' or 'not sure' (observed, runs/exp-02). Always shown as the second card beside Chew+ and behind 'switch to oral' on the gel plan page."
P['p1']['evidence'] = 'observed'
P['p2']['recommendedWhen'] = "Main quiz default: form 'Daily Chew' or 'not sure' and any priority except 'simple & affordable' (observed: runs/baseline-men-r2, exp-04, exp-05, exp-06). No safety answer before checkout moves a patient off it."
P['p3']['recommendedWhen'] = "Main quiz: form 'Topical Drop (Rx Serum)' + priority 'simple & affordable' (observed, runs/exp-03). Also behind 'Want to switch to topical solutions?' on the oral plan page (runs/exp-17)."
P['p3']['evidence'] = 'observed'
P['p4']['recommendedWhen'] = "Main quiz: form 'Topical Drop (Rx Serum)' + any priority except 'simple & affordable' (observed, runs/exp-01). Also behind the topical switch link (runs/exp-17)."
P['p4']['evidence'] = 'observed'
P['p5']['recommendedWhen'] = "Always, in the Gel funnel, whatever the answers (observed: runs/baseline-men-gel-r2, exp-g1). Not reachable from the main quiz."
P['p8']['recommendedWhen'] = "Legacy quiz: every location except 'Nowhere yet' and 'Patchy' (observed: baseline, exp-L01, L02, L05, L07). /plan-selection labels it 'Best for Receding Hairline'."
P['p9']['recommendedWhen'] = "Legacy quiz: crown, 'a bit of both' or 'nowhere yet', no pill preference, and no tretinoin or vitamins interest (observed: baseline, exp-L02, L04, L06); removed by pills (exp-L05) and by hairline-only (exp-L01)."
P['p11']['recommendedWhen'] = "Legacy quiz: hairline with no preference or pills, or any location with pills (observed: runs/exp-L01, L05, L19). Not offered by the main or gel quiz."
P['p11']['evidence'] = 'observed'
P['p12']['recommendedWhen'] = "Legacy quiz: replaces minoxidil foam when 'Products with tretinoin' (exp-L10) or 'Vitamins and supplements' (exp-L13) is ticked (observed)."
P['p12']['evidence'] = 'observed'
P['p13']['recommendedWhen'] = "Legacy quiz: dandruff 'Yes' (exp-L16) or 'Products with ketoconazole' ticked (exp-L12) (observed)."
P['p13']['evidence'] = 'observed'
P['p14']['recommendedWhen'] = "Legacy quiz: 'Nowhere yet' (exp-L04) or 'Hair care products' ticked (exp-L14) (observed). 'I want thicker hair' does not add it for an ordinary visitor (exp-L17)."
P['p14']['evidence'] = 'observed'
P['p15']['recommendedWhen'] = P['p14']['recommendedWhen'].replace('it', 'it', 1)
P['p15']['evidence'] = 'observed'
P['p16']['recommendedWhen'] = "Legacy quiz: 'Hair styling products (pomade)' ticked (observed, runs/exp-L15)."
P['p16']['evidence'] = 'observed'
P['p17']['recommendedWhen'] = "Legacy quiz: 'Products with saw palmetto' (exp-L11) or 'Vitamins and supplements' (exp-L13) ticked (observed)."
P['p17']['evidence'] = 'observed'
P['p18']['recommendedWhen'] = "Self-selected on /plan-selection ('Best for Overall Thinning Hair'). The legacy quiz reaches the same pair (finasteride + foam) for crown or 'a bit of both' with no pill preference (observed: runs/baseline-men-legacy-quiz-r2)."

# ---------- summary fields ----------
a = c['access']
a['coverageNote'] = ("Stage 1 read all three quizzes in served JavaScript. Stage 2 replayed all three baselines and ran 41 one-change experiments "
 "(19 main quiz, 3 gel, 19 legacy) to the plan page or account wall. Every product-changing rule read in the code was confirmed live. "
 "Not tested: the remaining 'no effect' options of the main quiz one by one (code shows no branch condition, 13 replays agreed), "
 "most of the 51 accepted states, the medical intake after payment and sign-in, and the clinician's decision. Keeps does not treat women (refers to Nurx).")
c['engineSummary'] = ("Before payment the main Keeps quiz is a two-answer lookup, now proved live. 'How would you like to treat your hair loss?' picks "
 "the family (Topical Drop gives Drop/Drop+, anything else gives Chew/Chew+) and 'What's your top priority?' picks the strength "
 "('simple & affordable' gives the finasteride product, anything else the dutasteride 'plus' product). Thirteen other one-change replays "
 "(onset under 6 months, advanced loss, patchy loss, earlier side effects, goal, state) changed nothing but the echoed label. The only stops are "
 "a 'Mostly Scalp' picture, twelve refused states and an unticked '18+ and assigned male at birth' box; women are referred to Nurx. "
 "The Gel funnel always names Gel+. The older /quiz is a real rule table, also proved live: location and pill preference choose finasteride, "
 "foam or oral minoxidil; tretinoin or vitamins swap foam for a compounded spray; dandruff, ketoconazole, saw palmetto, hair care and pomade "
 "each add one product; patchy loss goes to a clinician request. In every flow the medical screening happens after the account wall and payment.")
c['strengths'] = [
 'Very short path: about ten taps and no typing to reach a named product and a price.',
 'Patients steer the offer with two plain choices (oral or topical; strongest or cheapest), and switch links on the plan page show the other family at once.',
 "An honest early stop for advanced baldness ('Mostly Scalp'): it tells the patient prescription treatment is unlikely to work and points to restoration or cosmetic options.",
 'Clear price ladder with a large first-order discount and a 180-day money-back guarantee on the new compounded range.',
 'Wide range: licensed generics (finasteride, minoxidil, ketoconazole), compounded combinations (oral and topical, finasteride or dutasteride) and cosmetic add-ons.',
 "Honest legal labelling on product pages: compounded products are marked 'not FDA-approved'.",
]
c['weaknesses'] = [
 "'You're approved' and 'clinically recommended' are shown before any medical question; the loaders ('Confirming clinical eligibility') are timed animations.",
 "Proved live: 'Had side effects' from earlier treatment, onset under 6 months and patchy loss change nothing, give no warning and ask no follow-up (runs/exp-08, 11, 12).",
 'The default for every man who does not ask for cheap is a compounded dutasteride product (off-label for hair loss in the US), never licensed finasteride first.',
 "Payment is taken before the medical intake; a product page says 'You won't be charged until your prescription is approved' while the checkout says the card is charged and refunded if not approved.",
 "Age and sex are checked with one tick box; no women's service at all (referred to Nurx).",
 'Renewal price ($204.99 per 3 months for Chew+) is about double the first order ($100) and appears only in the checkout small print.',
 'Two older funnels (legacy /quiz and /plan-selection) still run with different logic and products, so the same man can be sent to different treatments depending on the entry page.',
]
c['opportunities'] = [
 "Ask the real safety questions before payment (heart, blood pressure, fertility plans, mood, earlier side effects) and let them visibly steer the offer, then say 'likely suitable, a clinician will confirm' instead of 'approved'.",
 'Start with licensed finasteride and step up to dutasteride only on a reason (no response, intolerance) and say why.',
 'Triage patchy, sudden or recent loss and scalp symptoms (redness, burning, scaling) to a clinician instead of passing them silently.',
 'Serve women: Keeps sends them away; a combined men-and-women service with a proper female pathway (pregnancy, contraception, PCOS) is an open gap.',
 'Show the renewal price next to the first-order price.',
]
c['limitations'] = [
 'The medical questionnaire, photo step and provider decision sit behind payment and sign-in; none of it was seen. Its question wording is unknown and its purpose is described from code labels and FAQ text only.',
 "Not every 'no effect' option was replayed one by one: the main quiz's goal 'Both', stages 'Early', 'Visible' and 'Not sure', pictures 'Just Starting' and 'Mild', second picture 'Receding Hairline', durations other than '<6 months', comments 'I'm not sure', 'How did it go?' answers 'Saw some results' and 'Stopped too early', and the gel quiz options other than priority. The served code gives them no branch condition and 13 sampled replays agreed.",
 'Only Idaho (refused) and California and Texas (accepted) were replayed at the state gate; the other refused states come from the code list. A typed "Kansas" was matched to Arkansas by the search box, so Kansas itself was not replayed.',
 "Legacy quiz: only the family option 'I'm not sure' was replayed, and multi-selects were tested one option at a time, not in combinations (for example tretinoin + pills).",
 "Prices are first-order promotional prices seen on 2026-11-23 during a 'Black Friday / up to 50% off' offer (offer id 1040); they will change.",
 'Feature flags change what a visitor sees (for example the phone-number screen was off and the free-gift offer variant was not served). Another visitor may get a different variant.',
 'Whether the provider ever changes the quiz product (for example to a lower dutasteride dose or to finasteride) cannot be seen without an account.',
 'The /product-info and /drug-facts pages were linked from product pages but not read in full.',
]
json.dump(c, open('company.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('ok', len(c['experiments']), 'experiments', len(c['rules']), 'rules', len(c['recommendations']), 'recommendations')
