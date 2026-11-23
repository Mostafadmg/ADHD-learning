#!/usr/bin/env python3
"""build_company.py — write company.json for Hair + Me from quiz-definition.json (exact wording the site served)
plus the hand-written annotations below (purpose, engine role, effects, products, sources).

Stage 1 (MAP). Re-run after new runs:  python3 tools/build_quizdef.py && python3 tools/build_company.py
Stage 2 should edit the ANNOTATION tables here (or edit company.json by hand and stop using this script: say which in notes.md).
"""
import json, os, re, glob, collections
base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
QD = json.load(open(os.path.join(base, 'quiz-definition.json')))
SUP = 'https://www.hairandme.com/support/en/articles/'
PIL_ORAL = SUP + '254164-hair-me-patient-information-leaflet-oral-treatments'
PIL_TOP = SUP + '254578-hair-me-patient-information-leaflet-topical-treatments'
PIL_PREG = SUP + '258568-hair-me-patient-information-leaflet-topical-treatments-healthy-hair-pregnancy-safe-formulations'
FAQ_PREG = SUP + '254008-can-i-use-hair-me-if-i-am-pregnant-breastfeeding-or-trying-to-conceive'

# ---------------------------------------------------------------- products
PRICE = '£34.99 every four weeks (one price whatever the formula; subscription, free standard delivery)'
PRICE_DETAIL = ("No plan lengths are shown before sign-up. Offers seen: product-page code HGSHOPCAPS gives the first three months at £14.99 each, then £34.99 "
                "(bag in runs/entry-promo-caps-men; the drops page uses code HGSHOPDROPS and shows the same £14.99). Refer-a-friend: first three months £12.99 each and £30 credit "
                "for the referrer (site code). Members are offered pre-paid bundles, 'Save up to 30%' (site code; exact bundle prices are only shown inside an account).")
LEGAL_RX = 'POM supplied as an unlicensed compounded medicine (a "special") made and dispensed by Feel Good Pharma Ltd, GPhC pharmacy 9011329; prescribed by Hair + Me pharmacist independent prescribers'
WHO_DECIDES = 'A pharmacist prescriber picks the formula after sign-up and payment; the public consultation never names a formula. '
def cap(pid, name, actives, when, aud='both'):
    return {'id': pid, 'name': 'The Capsules: ' + name, 'category': 'rx-oral-compounded', 'actives': actives, 'form': 'capsule, one a day (after the evening meal); four-week supply',
            'audience': aud, 'legalStatus': LEGAL_RX, 'price': PRICE, 'priceDetail': PRICE_DETAIL, 'url': PIL_ORAL,
            'productPage': 'https://www.hairandme.com/products/the-capsules', 'recommendedWhen': WHO_DECIDES + when, 'evidence': 'docs'}
def drp(pid, name, actives, when, aud='both', url=PIL_TOP, size='28 ml or 56 ml bottle with pipette'):
    return {'id': pid, 'name': 'The Drops: ' + name, 'category': 'rx-topical-compounded', 'actives': actives, 'form': 'scalp drops (water-based, alcohol-free suspension), 1 ml per use; ' + size,
            'audience': aud, 'legalStatus': LEGAL_RX, 'price': PRICE, 'priceDetail': PRICE_DETAIL, 'url': url,
            'productPage': 'https://www.hairandme.com/products/the-drops', 'recommendedWhen': WHO_DECIDES + when, 'evidence': 'docs'}
MINOX_ORAL_LIMITS = 'Leaflet limits for oral minoxidil: not with phaeochromocytoma, heart disease (heart attack, heart failure, uncontrolled high blood pressure), or for anyone assigned female at birth who is pregnant, breastfeeding or trying to conceive. '
FIN_LIMITS = ('Leaflet limits for finasteride / dutasteride: not for women; not under 18; not with a personal or family history of breast cancer, BPH, PSA monitoring or prostate / testicular cancer history, '
              'sexual dysfunction, trying to conceive, or current or past depression, anxiety or mental health concerns; not with another 5-alpha-reductase inhibitor. Men must also accept the acknowledgement screen in the consultation. ')
PRODUCTS = [
    {'id': 'svc', 'name': 'Personalised treatment (the subscription as it appears in the shopping bag)', 'category': 'service', 'actives': [], 'form': 'online consultation + prescriber review + a four-week supply of one personalised product (The Drops or The Capsules)',
     'audience': 'both', 'legalStatus': 'Private online prescribing service run by Skin + Me Ltd; medicines dispensed by Feel Good Pharma Ltd (GPhC 9011329)', 'price': PRICE, 'priceDetail': PRICE_DETAIL + " The bag line reads 'Personalised treatment · 4 week supply · 12ml · Prescription' for every patient tested, including those who chose The Capsules.",
     'url': 'https://www.hairandme.com/c/suh/new', 'recommendedWhen': 'Always: every route that reached the bag (men, women, any answers tested) showed this one line at £34.99. It is the only "recommendation" shown before the account wall.', 'evidence': 'observed'},
    cap('cap-min05', 'minoxidil 0.5 mg', [{'name': 'minoxidil', 'strength': '0.5 mg'}], MINOX_ORAL_LIMITS + 'Which patients get the lowest dose is unknown (a starting dose for women is a reasonable guess, not confirmed).'),
    cap('cap-min125', 'minoxidil 1.25 mg', [{'name': 'minoxidil', 'strength': '1.25 mg'}], MINOX_ORAL_LIMITS + 'Dose rule unknown.'),
    cap('cap-min25-b6', 'minoxidil 2.5 mg + vitamin B6 1.4 mg', [{'name': 'minoxidil', 'strength': '2.5 mg'}, {'name': 'vitamin B6 (pyridoxine)', 'strength': '1.4 mg'}], MINOX_ORAL_LIMITS + 'Looks like the minoxidil-only option for people who cannot or will not take finasteride / dutasteride (inferred); not if allergic to vitamin B6.'),
    cap('cap-fin1-min25', 'finasteride 1 mg + minoxidil 2.5 mg', [{'name': 'finasteride', 'strength': '1 mg'}, {'name': 'minoxidil', 'strength': '2.5 mg'}], FIN_LIMITS + MINOX_ORAL_LIMITS, 'men'),
    cap('cap-fin1-min5', 'finasteride 1 mg + minoxidil 5 mg', [{'name': 'finasteride', 'strength': '1 mg'}, {'name': 'minoxidil', 'strength': '5 mg'}], FIN_LIMITS + MINOX_ORAL_LIMITS + 'The 5 mg minoxidil strength is named in the leaflet title list but not in its dose list (0.5, 1.25, 2.5 mg): treat as the top step, rule unknown.', 'men'),
    cap('cap-dut05-min125', 'dutasteride 0.5 mg + minoxidil 1.25 mg', [{'name': 'dutasteride', 'strength': '0.5 mg'}, {'name': 'minoxidil', 'strength': '1.25 mg'}], FIN_LIMITS + MINOX_ORAL_LIMITS + 'Dutasteride also not with liver disease. The site calls dutasteride more effective than finasteride and says it "may be considered in all cases of pattern hair loss, but also for resistant or more advanced cases".', 'men'),
    drp('drp-min5-od', 'minoxidil 5% "PGF", once a day', [{'name': 'minoxidil', 'strength': '5%'}], 'The leaflet calls it "Minoxidil 5% PGF" (PGF usually means propylene-glycol-free: my reading, not spelled out by the site, which markets the drops as alcohol-free). Leaflet limits for the drops: not on an inflamed, infected, irritated or painful scalp, or with scalp psoriasis / eczema / sunburn; minoxidil drops not for women who are pregnant, breastfeeding or trying to conceive.'),
    drp('drp-min5-bd', 'minoxidil 5% "PGF", twice a day', [{'name': 'minoxidil', 'strength': '5%'}], 'Same limits as the once-a-day minoxidil drops; rule for once versus twice a day unknown (56 ml bottle implied).'),
    drp('drp-min5-fin01', 'minoxidil 5% + finasteride 0.1%, twice a day', [{'name': 'minoxidil', 'strength': '5%'}, {'name': 'finasteride', 'strength': '0.1%'}], 'Men who accept finasteride. Leaflet: no finasteride drops for anyone female who is pregnant, breastfeeding or trying to conceive; not with prostate disease, testicular cancer, male breast cancer history or another 5-alpha-reductase inhibitor; stop 12 weeks before trying for a baby. The FAQ adds that finasteride is never prescribed to women of childbearing potential.', 'men'),
    drp('drp-min5-tret', 'minoxidil 5% + tretinoin 0.01%, once a day', [{'name': 'minoxidil', 'strength': '5%'}, {'name': 'tretinoin', 'strength': '0.01%'}], 'Tretinoin is added to help minoxidil absorb. Never in pregnancy, breastfeeding or when trying to conceive (leaflet: effective contraception during use and for one month after).'),
    drp('drp-min5-tret-fin01', 'minoxidil 5% + tretinoin 0.01% + finasteride 0.1%, once a day', [{'name': 'minoxidil', 'strength': '5%'}, {'name': 'tretinoin', 'strength': '0.01%'}, {'name': 'finasteride', 'strength': '0.1%'}], 'Men who accept finasteride; same finasteride and tretinoin limits as above.', 'men'),
    drp('drp-fin02', 'finasteride 0.2%, once a day', [{'name': 'finasteride', 'strength': '0.2%'}], 'Men who accept finasteride but cannot have minoxidil (inferred: for example minoxidil allergy, or pets at home); same finasteride limits as above.', 'men'),
    drp('drp-nia5-urea2', 'niacinamide 5% + urea 2%, once a day ("Healthy Hair & Pregnancy-safe")', [{'name': 'niacinamide', 'strength': '5%'}, {'name': 'urea', 'strength': '2%'}], 'Docs: the route for anyone pregnant, breastfeeding or trying to conceive (no oral treatment, never minoxidil, melatonin, tretinoin, finasteride or dutasteride). Probably also the fallback when nothing stronger is suitable; the FAQ says people who do not send requested photos within 7 days are shipped "a non-prescription treatment", which may be this (inferred).', 'both', PIL_PREG, '28 ml bottle with pipette'),
    drp('drp-nia5-urea2-mel01', 'niacinamide 5% + urea 2% + melatonin 0.1%, once a day ("Healthy Hair")', [{'name': 'niacinamide', 'strength': '5%'}, {'name': 'urea', 'strength': '2%'}, {'name': 'melatonin', 'strength': '0.1%'}], 'A non-minoxidil, non-hormonal option. Leaflet: melatonin formulas must NOT be used when pregnant, breastfeeding or trying to conceive.', 'both', PIL_PREG, '28 ml bottle with pipette'),
    drp('drp-nia5', 'niacinamide 5%, once a day ("Healthy Hair & Pregnancy-safe")', [{'name': 'niacinamide', 'strength': '5%'}], 'As niacinamide + urea, for people who cannot have urea (inferred from the urea allergy option).', 'both', PIL_PREG, '28 ml bottle with pipette'),
    drp('drp-nia5-mel01', 'niacinamide 5% + melatonin 0.1%, once a day ("Healthy Hair")', [{'name': 'niacinamide', 'strength': '5%'}, {'name': 'melatonin', 'strength': '0.1%'}], 'As the melatonin formula above without urea. Not in pregnancy, breastfeeding or when trying to conceive.', 'both', PIL_PREG, '28 ml bottle with pipette'),
    {'id': 'vit', 'name': 'The Vitamins (Hair + Me Multivitamins)', 'category': 'supplement',
     'actives': [{'name': 'vitamin C', 'strength': '80 mg'}, {'name': 'vitamin B3', 'strength': '16 mg'}, {'name': 'vitamin E', 'strength': '12 mg'}, {'name': 'vitamin B5', 'strength': '6 mg'}, {'name': 'vitamin B6', 'strength': '1.4 mg'}, {'name': 'vitamin B2', 'strength': '1.4 mg'}, {'name': 'vitamin B1', 'strength': '1.1 mg'}, {'name': 'vitamin A', 'strength': '800 µg'}, {'name': 'folic acid', 'strength': '200 µg'}, {'name': 'vitamin K2 (MK7)', 'strength': '81.25 µg'}, {'name': 'biotin', 'strength': '50 µg'}, {'name': 'vitamin D3', 'strength': '5 µg'}],
     'form': 'tablet or capsule (form not stated); each nutrient at 100% of the nutrient reference value', 'audience': 'both', 'legalStatus': 'food supplement (not a medicine)', 'price': 'unknown (only shown inside a member account)', 'priceDetail': "Add-on subscription managed at /account/manage-subscription/the-vitamins with a 'First box offer' and its own promo-code box (site code).",
     'url': SUP + '619143-what-ingredients-are-in-the-hair-me-multivitamins', 'recommendedWhen': "Not part of the public consultation. Offered to members as an optional add-on ('Support your treatment'); no answer was seen to trigger it.", 'evidence': 'code'},
]
for _p in PRODUCTS:
    if _p['id'].startswith('drp-nia5'):
        _p['legalStatus'] = ("Supplied on prescription as an unlicensed compounded preparation from Feel Good Pharma Ltd (GPhC 9011329); the site tags niacinamide, urea and melatonin 'Prescription'. "
                             + ("Melatonin is a prescription-only medicine in the UK." if 'mel' in _p['id'] else "Niacinamide and urea are not prescription-only ingredients in themselves, so the true legal class of this formula is unknown (the FAQ mentions a 'non-prescription treatment' fallback)."))
PID = [p['id'] for p in PRODUCTS]
CAPS = [p for p in PID if p.startswith('cap-')]
DROPS = [p for p in PID if p.startswith('drp-')]
FIN_DUT = ['cap-fin1-min25', 'cap-fin1-min5', 'cap-dut05-min125', 'drp-min5-fin01', 'drp-min5-tret-fin01', 'drp-fin02']
FIN_DUT_CAPS = ['cap-fin1-min25', 'cap-fin1-min5', 'cap-dut05-min125']
MINOX = CAPS + ['drp-min5-od', 'drp-min5-bd', 'drp-min5-fin01', 'drp-min5-tret', 'drp-min5-tret-fin01']
MED_DROPS = ['drp-min5-od', 'drp-min5-bd', 'drp-min5-fin01', 'drp-min5-tret', 'drp-min5-tret-fin01', 'drp-fin02']
TRET = ['drp-min5-tret', 'drp-min5-tret-fin01']
MEL = ['drp-nia5-urea2-mel01', 'drp-nia5-mel01']
UREA = ['drp-nia5-urea2', 'drp-nia5-urea2-mel01']
NIA = ['drp-nia5-urea2', 'drp-nia5-urea2-mel01', 'drp-nia5', 'drp-nia5-mel01']
NOT_PREG = [p for p in PID if p not in ('svc', 'vit', 'drp-nia5-urea2', 'drp-nia5')]

# ---------------------------------------------------------------- which options were actually chosen in a run
chosen = collections.defaultdict(set)   # (questionId, str(value)) -> runs
reached_bag = set()
for run in sorted(glob.glob(os.path.join(base, 'runs', '*', 'api.jsonl'))):
    rid = run.split('/')[-2]
    for line in open(run):
        try: e = json.loads(line)
        except Exception: continue
        if e['method'] == 'GET' and e['url'].endswith('/consultation/suh/ct') and e['status'] == 200: reached_bag.add(rid)
        if e['method'] != 'POST' or '/consultation/suh/' not in e['url']: continue
        try: p = json.loads(e.get('post') or '{}')
        except Exception: continue
        for q in p.get('questions', []):
            v = q.get('value')
            if v is None: continue
            for x in (v if isinstance(v, list) else [v]): chosen[(q['id'], str(x))].add(rid)

def default_effect(qid, opt):
    runs = sorted(chosen.get((qid, str(opt.get('value'))), []))
    if not runs:
        return ('Not yet chosen in any run. Effect unknown.', 'unknown', [], 'unknown')
    bag = [r for r in runs if r in reached_bag]
    if bag:
        cite = ', '.join('runs/' + r for r in bag[:3])
        return (f"No visible change before the account wall: same later questions and the same £34.99 'Personalised treatment' bag ({cite}). The answer is stored for the prescriber; what it does to the final formula cannot be seen without an account.", 'none', [], 'observed')
    cite = ', '.join('runs/' + r for r in runs[:3])
    return (f"No stop and no change to later questions up to the eligibility screen ({cite}; that run ended at the under-18 stop, so the bag was not reached). Effect on the final formula unknown.", 'none', [], 'observed')

PRE = "Before the account wall nothing changes ({}). "
# overrides: (stepId, questionId, option label) -> (effect, effectType, affects, evidence)
OV = {
 ('tp', 8008, 'Treatment for men'): ("Starts the consultation. It does not pick the route: the questions that follow are set by sex assigned at birth (with 'Treatment for men' + Female the women's questions were served, runs/scout-women-1).", 'none', [], 'observed'),
 ('tp', 8008, 'Treatment for women'): ("Starts the consultation. The women's questions followed, but that matches the Female answer to the next-but-one screen; whether this tile matters by itself was not tested with sex Male.", 'none', [], 'inferred'),
 ('tp', 8008, 'Neither of these are right for me'): ("No stop screen: goes on to the hair goals as normal, and with sex Male the men's route followed to the same £34.99 bag (runs/scout-neither).", 'none', [], 'observed'),
 ('pds', 3039, 'Male'): ("Sets the men's route. Adds: the 'Ingredients that see results' screen (minoxidil + finasteride capsules, finasteride, minoxidil, dutasteride), the lifestyle statements, the men's hair-loss picture list, the dutasteride / finasteride acknowledgement, and the men's medicines and conditions lists (runs/baseline-men, runs/scout-neither).", 'extra-questions', FIN_DUT, 'observed'),
 ('pds', 3039, 'Female'): ("Sets the women's route. Adds: wash frequency, hiding hair loss, hard water, the women's hair-loss picture list, 'Our Dermatology Team have a few more questions', pregnancy / breastfeeding, postpartum / facial hair, and shorter women's medicines and conditions lists. The dutasteride / finasteride acknowledgement is never shown (runs/baseline-women, runs/scout-women-1). Docs: finasteride and dutasteride are never prescribed to women of childbearing potential.", 'extra-questions', FIN_DUT, 'observed'),
 ('htp', 250, None): ("Ticking any product shows a must-tick box on the same screen: \"It's useful to know what ingredients you already have a tolerance for. However, you need to stop using them when you start your Hair + Me treatment.\" / 'Yes, I understand this.' (step JSON renderConditions; all six ticked in runs/scout-men-3). No other change before the wall.", 'soft-warning', [], 'observed'),
 ('htp', 250, 'None of the above'): None,
 ('htam', 9318, 'None'): ("Skips 'When did you notice changes to your hair?' and goes straight to the answers-review screen; the rest of the route and the £34.99 bag are unchanged (runs/scout-men-none).", 'skip-questions', [], 'observed'),
 ('htam', 9318, 'One or more patches of complete hair loss'): ("No stop screen and no extra question: same route and £34.99 bag (runs/scout-men-1). Patchy loss is not one of the leaflet's indications (pattern hair loss, generalised thinning), so a prescriber would be expected to query it after sign-up, perhaps asking for photos (inferred).", 'flag-for-clinician', [], 'inferred'),
 ('htam', 9318, 'Complete hair loss'): ("No stop screen and no extra question: same route and £34.99 bag (runs/scout-men-3). The oral leaflet says finasteride helps men with 'mild to moderate, but not complete hair loss', so a prescriber would be expected to query it (inferred).", 'flag-for-clinician', [], 'inferred'),
 ('htaf', 9322, 'I have no hair loss or thinning'): ("Skips 'When did you notice changes to your hair?'; the rest of the route and the £34.99 bag are unchanged (runs/scout-women-2). Not turned away.", 'skip-questions', [], 'observed'),
 ('htaf', 9322, "I've lost hair from my eyebrows, sideburns and hairline"): ("No stop and no extra question up to the eligibility screen (runs/scout-women-1, which ended at the under-18 stop). This picture fits a scarring pattern rather than pattern hair loss, so a prescriber would be expected to query it (inferred).", 'flag-for-clinician', [], 'inferred'),
 ('pt', 8007, 'Yes'): ("Shows a warning on the same screen (\"Some of our treatments contain minoxidil, which is toxic to cats and dogs... Capsules are less likely to have a risk...\") and adds a second badge, 'Better for pet owners', to The Capsules on the next screen (runs/scout-men-2, runs/scout-women-2; both were multi-change scouts). Bag unchanged.", 'soft-warning', CAPS, 'observed'),
 ('tt', 180028, 'The Drops'): ("Records a preference for the topical drops. The screen itself says: \"We'll do our best to accommodate your preference, but ultimately, this will be determined by our Dermatology Team.\" Before the wall nothing changes: the bag still reads 'Personalised treatment · 4 week supply · 12ml' (runs/scout-men-2, runs/scout-women-2).", 'product-switched', DROPS, 'docs'),
 ('tt', 180028, 'The Capsules'): ("Records a preference for the once-a-day capsules (badged 'Most popular'). Same caveat: the Dermatology Team decides. The bag still reads 'Personalised treatment · 4 week supply · 12ml' (runs/baseline-men, runs/baseline-women).", 'product-switched', CAPS, 'docs'),
 ('pp', 4433, 'I agree to the information above and wish to be considered for dutasteride or finasteride. I agree to read the Patient Information Leaflet'): ("Keeps the finasteride and dutasteride formulas in play and records informed consent to their risks (fertility, semen exposure, mood, sexual function, breast changes, persistent effects). Route and bag unchanged (runs/baseline-men).", 'none', FIN_DUT, 'observed'),
 ('pp', 4433, 'I do not wish to be considered for dutasteride or finasteride'): ("By its own wording, takes finasteride and dutasteride formulas out of consideration, leaving minoxidil-only or niacinamide-type formulas. Before the wall nothing else changes: same later questions (the prostate and mental-health options are still listed) and the same £34.99 bag (runs/scout-men-2).", 'product-removed', FIN_DUT, 'docs'),
 ('mdm', 4454, 'Antidepressants, anti-anxiety or medication for mental health reasons'): (PRE.format('runs/scout-men-2, runs/scout-men-3') + "The leaflet says not to take finasteride or dutasteride with current or past depression, anxiety or mental health concerns, so this should steer the prescriber away from those capsules (inferred from the oral leaflet).", 'flag-for-clinician', FIN_DUT_CAPS, 'inferred'),
 ('mdm', 4454, 'Medication to treat benign prostate hyperplasia (BPH)'): (PRE.format('runs/scout-men-2, runs/scout-men-3') + "Leaflet: finasteride and dutasteride must not be taken with finasteride 5 mg or any other 5-alpha-reductase inhibitor, or by men diagnosed with BPH; alpha-blockers also interact with dutasteride.", 'flag-for-clinician', FIN_DUT, 'docs'),
 ('mdm', 4454, 'Steroids or other medications for psoriasis or eczema on your scalp'): (PRE.format('runs/scout-men-3') + "Leaflet: the medicated drops should not be applied with an inflammatory scalp condition such as psoriasis or eczema, so this points towards capsules or a delay (inferred).", 'flag-for-clinician', MED_DROPS, 'inferred'),
 ('mdm', 4454, 'Other'): ("Opens a required free-text box on the same screen, 'Tell us about your other medications' (placeholder 'Type medications not listed above here', 1,000 characters). No other change before the wall (runs/scout-men-3).", 'extra-questions', [], 'observed'),
 ('mdf', 4455, 'Steroids or other medications for psoriasis or eczema on your scalp'): (PRE.format('runs/scout-women-2') + "Leaflet: the medicated drops should not be applied with an inflammatory scalp condition such as psoriasis or eczema (inferred effect on the prescriber's choice).", 'flag-for-clinician', MED_DROPS, 'inferred'),
 ('mdf', 4455, 'Other'): ("Opens a required free-text box on the same screen, 'Tell us about your other medications'. No other change before the wall (runs/scout-women-2).", 'extra-questions', [], 'observed'),
 ('al', 4447, 'Other'): ("Opens a required free-text box on the same screen, 'Tell us about your other allergies' (1,000 characters). No other change before the wall (runs/scout-men-3).", 'extra-questions', [], 'observed'),
 ('pg', 3046, 'Yes'): ("Adds the screen 'Pregnancy safety information' with a link to the pregnancy FAQ and a must-tick box (runs/scout-women-1). Not turned away. Docs: no oral treatment, and never minoxidil, melatonin, tretinoin, finasteride or dutasteride; only the niacinamide-based 'pregnancy-safe' drops remain.", 'product-removed', NOT_PREG, 'docs'),
 ('pg', 3046, 'No'): ("Shows a must-tick box on the same screen: \"You can't use some of our prescription treatments if you're pregnant or breastfeeding. Get in touch with our Dermatology Support Team if you become pregnant while using Hair + Me.\" / \"Yes, I've read and understood the information and would like to carry on.\" Then continues (runs/baseline-women).", 'soft-warning', [], 'observed'),
 ('mp', 4503, 'I have unwanted hair on my face (e.g. upper lip, chin, jawline)'): ("No stop and no extra question up to the eligibility screen (runs/scout-women-1). The oral leaflet lists unwanted facial hair as a very common effect of oral minoxidil, so this may steer the prescriber towards drops or a lower dose (inferred).", 'flag-for-clinician', CAPS, 'inferred'),
 ('bp', 4420, 'Often elevated'): ("No stop; continues to allergies (runs/scout-women-1). The oral leaflet rules out minoxidil capsules with uncontrolled high blood pressure, so this should steer the prescriber away from capsules (inferred).", 'flag-for-clinician', CAPS, 'inferred'),
 ('bp', 4420, 'Often low'): ("No stop; same route and £34.99 bag (runs/scout-men-3). Oral minoxidil can lower blood pressure and cause dizziness (leaflet), so this should steer the prescriber away from capsules (inferred).", 'flag-for-clinician', CAPS, 'inferred'),
}
COND_DOCS = {  # conditions: label start -> (leaflet text, affects, evidence)
 'Pheochromocytoma': ("Oral leaflet: minoxidil capsules are contraindicated with phaeochromocytoma (the topical leaflet does not mention it).", CAPS, 'docs'),
 'High blood pressure': ("Adds the follow-up screen 'How would you describe your blood pressure over the past 12 months?' (Well-controlled / Often elevated / Often low + optional last reading). Leaflet: no oral minoxidil with uncontrolled high blood pressure.", CAPS, 'observed'),
 'Any heart or cardiovascular condition': ("Leaflet: avoid oral minoxidil with angina, a recent heart attack, heart failure or significant heart disease.", CAPS, 'docs'),
 'Undergoing prostate-specific antigen': ("Oral leaflet: do not take finasteride or dutasteride. Topical leaflet: no finasteride drops with a personal history of prostate disease or testicular cancer.", FIN_DUT, 'docs'),
 'Benign prostatic hyperplasia': ("Oral leaflet: do not take finasteride or dutasteride. Topical leaflet: no finasteride drops with a personal history of prostate disease.", FIN_DUT, 'docs'),
 'Sexual dysfunction': ("Oral leaflet: do not take finasteride or dutasteride capsules. The topical leaflet only warns about it, and the side-effects FAQ says topical finasteride may be considered for lower absorption.", FIN_DUT_CAPS, 'docs'),
 'Current or history of depression': ("Oral leaflet: do not take finasteride or dutasteride capsules. The topical leaflet only warns about mood changes.", FIN_DUT_CAPS, 'docs'),
 'Personal or family history of male breast cancer': ("Oral leaflet: do not take finasteride or dutasteride. Topical leaflet: no finasteride drops either.", FIN_DUT, 'docs'),
 'Hypertrichosis': ("Leaflet: extra body and facial hair is a very common effect of oral minoxidil, so capsules are a poor fit (inferred).", CAPS, 'inferred'),
 'PoTS syndrome': ("Oral minoxidil very commonly raises heart rate (leaflet), so capsules are a poor fit (inferred).", CAPS, 'inferred'),
 'Liver disease': ("Leaflet: no dutasteride with liver disease, and no minoxidil with severe liver disease.", ['cap-dut05-min125'] + [c for c in CAPS if c != 'cap-dut05-min125'], 'docs'),
}
ALLERGY = {'Minoxidil': MINOX, 'Finasteride': [p for p in FIN_DUT if 'fin' in p], 'Dutasteride': ['cap-dut05-min125'], 'Melatonin': MEL, 'Urea': UREA, 'Niacinamide': NIA, 'Tretinoin': TRET, 'Vitamin B6 (Pyridoxine)': ['cap-min25-b6']}
SCALP_FLAG = ['Redness and crusting around the base of your hair', 'Highly sensitive and irritable areas', 'Diagnosed eczema, psoriasis or seborrheic dermatitis', 'Pustules/lumps/cysts', 'A diagnosed active infection (e.g. folliculitis, candida, ringworm)', 'Pain and/or burning sensation']

def runs_for(qid, opt): return sorted(chosen.get((qid, str(opt.get('value'))), []))
def effect_for(sid, q, opt):
    lab = opt['label']; qid = q['id']
    if sid == 'yhg' and qid == 9307:
        return ("Recorded as a goal. One goal ticked alone ('Prevent, stop or reverse hair loss' in the baseline runs): no change to the route or the £34.99 bag. Any two or more goals together add the screen 'Which hair goal do you want to tackle most?' (runs/scout-men-1 with all five goals, runs/scout-women-2 with two). What a goal does to the final formula cannot be seen without an account.", 'none', [], 'observed')
    if (sid, qid, lab) in OV and OV[(sid, qid, lab)] is not None: return OV[(sid, qid, lab)]
    if sid == 'htp' and qid == 250 and lab != 'None of the above': return OV[('htp', 250, None)]
    d = default_effect(qid, opt); rs = runs_for(qid, opt)
    seen = ('Before the account wall nothing else changes: no stop, same bag (' + ', '.join('runs/' + r for r in rs[:3]) + '). ') if rs else 'Not yet chosen in any run, so the on-screen effect is untested. '
    if sid in ('mcm', 'mcf'):
        for k, (txt, aff, ev) in COND_DOCS.items():
            if lab.startswith(k):
                if k == 'High blood pressure': return (txt + ' ' + ('Seen in ' + ', '.join('runs/' + r for r in rs[:3]) + ' (multi-change scouts; blood pressure was the only condition ticked in both runs that got the screen).' if rs else ''), 'extra-questions', aff, 'observed' if rs else 'inferred')
                return (seen + txt + ' So the prescriber is expected to rule those formulas out after sign-up.', 'flag-for-clinician', aff, ev)
        if lab.startswith('Polyendocrine'): return (('No stop and no extra screen up to the eligibility step (' + ', '.join('runs/' + r for r in rs[:3]) + '). ' if rs else seen) + 'What the prescriber does with it is unknown: the formulary has no anti-androgen for women.', 'none' if rs else 'unknown', [], 'observed' if rs else 'unknown')
    if sid == 'al' and lab in ALLERGY:
        return (seen + f"Leaflets: do not use a treatment if you are allergic to any ingredient, so formulas containing {lab.lower()} should be ruled out by the prescriber.", 'flag-for-clinician', ALLERGY[lab], 'docs')
    if sid == 'scc' and lab in SCALP_FLAG:
        return (seen + "Topical leaflet: do not use the drops on inflamed, infected, irritated or painful scalp skin (minoxidil, finasteride and tretinoin drops are also ruled out with scalp psoriasis or eczema), so this should push the prescriber towards capsules or a delay.", 'flag-for-clinician', MED_DROPS, 'docs')
    return d

# ---------------------------------------------------------------- question annotations
# step -> list of (questionId or None for whole-step info, id suffix, text override or None, type, purpose, engineRole, branches, branchDetail, shownWhen)
ALWAYS = 'always'
_runs = QD['runs']
_men = [r for r, v in _runs.items() if v['sexAtBirth'] == 'Male']; _women = [r for r, v in _runs.items() if v['sexAtBirth'] == 'Female']
def cnt(sid):
    m = sum(1 for r in _men if sid in _runs[r]['stepOrder']); w = sum(1 for r in _women if sid in _runs[r]['stepOrder'])
    return f"{m} of {len(_men)} men's runs and {w} of {len(_women)} women's runs"
RANDOM = lambda sid: f'not always: appeared in {cnt(sid)}; the server seems to add or drop it at random (identical answers gave routes with and without it)'
A = {
 'tp':  [(8008, '', None, 'single', "Entry tile that lets people self-select the men's or women's service. It works as a welcome screen more than a filter.", 'marketing', False, "No branch seen: the route is set later by sex assigned at birth.", ALWAYS)],
 'yhg': [(9307, '', None, 'multi', "Captures what the person wants (stop loss, reverse thinning, hairline / parting / crown, thicker hair, general hair health). Used to frame the journey and, presumably, the prescriber's plan.", 'personalisation', True, "Two or more goals add the screen 'Which hair goal do you want to tackle most?' listing only the goals ticked (runs/scout-men-1, runs/scout-women-2). One goal: no extra screen.", ALWAYS),
         (3042, '-consent', 'Tick-box on the hair goals screen (no separate heading)', 'consent', "Consent to hold health data (needed under UK data-protection law before any medical question). The button stays disabled until it is ticked.", 'consent', False, '', ALWAYS)],
 'hgp': [(9308, '', None, 'single', "Forces one priority goal when several were ticked. The chosen goal is echoed later on the 'Here's what we know...' screen (for example 'I want healthier hair').", 'personalisation', False, '', "only when two or more hair goals were ticked on the previous screen")],
 'js':  [(8038, '', None, 'single', "Buying-intent question (browsing or ready to buy). Optional: Next works with no answer.", 'marketing', False, "No change seen for either answer.", RANDOM('js'))],
 'pds': [(3039, '-sex', 'Tell us the sex you were assigned at birth', 'single', "The main fork of the consultation. The site's reason: \"Hormones play a significant role in hair loss and regrowth, and our Dermatology Team needs to know if there's any possibility you could become pregnant.\"", 'eligibility-gate', True, "Male gives the men's route (finasteride / dutasteride acknowledgement, prostate, sexual and mental-health checks). Female gives the women's route (pregnancy, postpartum, facial hair, PCOS). The first-screen tile does not override it.", ALWAYS),
         (3054, '-gender', 'Tell us your gender identity', 'single', "Optional gender identity, kept apart from sex at birth so the service can address people correctly.", 'data-capture', False, "No change seen (one option tested: Non-Binary, runs/scout-neither).", 'always (optional drop-down on the same screen as sex assigned at birth)')],
 'pdsc':[(3050, '', None, 'consent', "Makes the person confirm the sex they chose (shown back in large type) because the medical route depends on it.", 'consent', False, '', ALWAYS)],
 'mi':  [(None, '', "Ingredients that see results: 94% saw an improvement in hair growth with minoxidil + finasteride capsules*; 87% saw an increase in hair growth with finasteride*; 71% saw an improvement in hair density with minoxidil*; Dutasteride is more effective than finasteride in treating hair loss over 24 weeks*. (* Read about our citations here)", 'info', "Selling screen for the prescription actives, shown to men straight after the sex question (auto-advances after 6.5 seconds, or Skip).", 'marketing', False, '', "men's route only (sex assigned at birth = Male); not seen in any women's run")],
 'ht':  [(4446, '', None, 'single', "Hair type (straight to coily). Echoed on the answers-review screen. Likely used for usage advice rather than drug choice.", 'personalisation', False, "No change seen (Straight, Coily tested).", ALWAYS)],
 'hs':  [(253, '', None, 'multi', "Styling and chemical-treatment habits that can damage hair (heat, bleach, relaxers, tight protective styles).", 'diagnosis', False, "No change seen.", RANDOM('hs'))],
 'ls':  [(8014, '', None, 'multi', "Screens for triggers of temporary shedding (poor sleep, stress, recent weight loss, a major life event). Optional.", 'diagnosis', False, "No change seen with stress + weight loss ticked (runs/scout-men-1).", "men's route: seen in " + cnt('ls'))],
 'hw':  [(8010, '', None, 'single', "Wash frequency: scalp-care context and practical advice for using drops.", 'personalisation', False, "No change seen.", "women's route only (sex assigned at birth = Female)")],
 'hht': [(8009, '', None, 'multi', "How the person hides hair loss (hats, styling, shaving, wigs or extensions, fibres): a severity and emotional-impact signal, and relevant to applying drops.", 'personalisation', False, "No change seen.", "women's route only (sex assigned at birth = Female)")],
 'htp': [(250, '', None, 'multi', "Previous or current hair-loss medicines (minoxidil tablets or spray, finasteride tablets or spray, spironolactone tablets, dutasteride capsules). Shows tolerance and prevents doubling up.", 'safety-screen', True, "Any product ticked reveals a must-tick box about stopping it. Nothing else changes before the wall, even with all six ticked (runs/scout-men-3).", ALWAYS),
         (4443, '-stop', "It's useful to know what ingredients you already have a tolerance for. However, you need to stop using them when you start your Hair + Me treatment.", 'consent', "Makes the person agree to stop their current hair-loss medicine when Hair + Me starts (avoids duplicate dosing).", 'consent', False, '', "only when at least one product (not 'None of the above') is ticked on the same screen")],
 'hdw': [(8003, '', None, 'single', "Hard-water question with a short how-to-tell guide ('Hard water can dry your scalp'). Optional. Reads as engagement and scalp-care advice, not drug choice.", 'personalisation', False, "No change seen (Yes, No tested).", "women's route only (sex assigned at birth = Female)")],
 'htam':[(9318, '', None, 'single', "Where the hair is being lost, with drawings (a simple Norwood-style picker). Single choice only, so hairline + crown cannot both be recorded. Feeds the diagnosis: pattern loss versus patchy or total loss.", 'diagnosis', True, "'None' skips the timing question. Patchy and complete hair loss do NOT stop the flow before the wall.", "men's route (sex assigned at birth = Male)")],
 'htaf':[(9322, '', None, 'single', "Where the hair is being lost, with drawings (a simple Ludwig-style picker for women, plus temples, crown, hairline, eyebrows). Single choice.", 'diagnosis', True, "'I have no hair loss or thinning' skips the timing question. No option stops the flow before the wall.", "women's route (sex assigned at birth = Female)")],
 'htc': [(9310, '', None, 'single', "How long ago the change started: sudden recent shedding points away from pattern hair loss.", 'diagnosis', False, "No change seen ('Recently, in the past few weeks' and 'Over a year ago' tested).", "when a hair-loss area was chosen (skipped after 'None' / 'I have no hair loss or thinning')")],
 'ar':  [(None, '', "Here's what we know... Your hair goal / Your hair type / Your hair thinning (echo of three answers; women also see 'Thanks for sharing this with us.')", 'info', "Plays three answers back to build trust and commitment (auto-advances after 7 seconds).", 'marketing', False, '', ALWAYS)],
 'st':  [(9346, '', None, 'single', "Fitzpatrick skin type. The site's reason: \"To help our Dermatology Clinicians prescribe your treatment accurately and safely.\" The same step is sometimes served as a drag slider ('How would you describe your skin tone?' / 'Which best matches your skin?') and with short or long labels.", 'data-capture', False, "No change seen (only 'Fair' tested).", ALWAYS)],
 'sc':  [(9320, '', None, 'single', "Scalp condition (normal, oily, dry). Plausibly feeds the supporting actives (urea, niacinamide) and usage advice.", 'personalisation', False, "No change seen (Normal, Oily, Dry tested).", ALWAYS)],
 'scc': [(9328, '', None, 'multi', "Scalp symptoms that make topical treatment unsafe or suggest another diagnosis (inflammation, infection, pain, pustules, diagnosed eczema / psoriasis).", 'safety-screen', False, "No stop and no extra screen before the wall, even with an active infection and pain ticked (runs/scout-men-2).", ALWAYS)],
 'smt': [(8021, '', None, 'multi', "Six-month outcome the person wants: sets expectations and gives the brand a goal to report back against.", 'expectation-setting', False, "No change seen.", ALWAYS)],
 'pt':  [(8007, '', None, 'single', "Pets at home: minoxidil is toxic to cats and dogs, mostly from licking it off fingers or hair.", 'safety-screen', True, "Yes shows a warning on the same screen and adds a 'Better for pet owners' badge to The Capsules on the next screen.", ALWAYS)],
 'tt':  [(180028, '', None, 'single', "Format preference: drops (pipette, once or twice a day) or capsules (once a day before bed, badged 'Most popular'). The site says the Dermatology Team makes the final call.", 'product-selector', False, "Nothing changes before the wall; the bag reads '12ml' either way.", ALWAYS)],
 'dt':  [(None, '', "Our Dermatology Team have a few more questions (picture of the prescribers)", 'info', "Reassurance screen before the medical section (auto-advances after 3 seconds).", 'marketing', False, '', "women's route only (sex assigned at birth = Female)")],
 'pp':  [(4433, '', "Understanding Dutasteride and Finasteride. I acknowledge that: these medications are not suitable if planning to start a family soon (I confirm that I am not planning to start a family in the next six months and agree to inform Hair + Me if my plans change); they may be present in semen, so if my partner is pregnant or breastfeeding I'll use protection (like a condom); they may cause mood changes, uncommonly including depression or suicidal thoughts (stop, contact my GP immediately, and inform Hair + Me); a temporary decrease in libido or changes in erectile function may occur (pause and contact Hair + Me); mild breast tenderness or enlargement are possible (stop, contact my GP, inform Hair + Me); in rare cases some side effects may continue after stopping.", 'single', "Informed-consent gate for the 5-alpha-reductase inhibitors, asked BEFORE the medical history. It doubles as the opt-out for men who do not want finasteride or dutasteride.", 'product-selector', False, "No change to later screens for either answer.", "men's route only (sex assigned at birth = Male)")],
 'pg':  [(3046, '', None, 'single', "Pregnancy, breastfeeding or likely to conceive: the main safety fork for women. One combined yes / no; there is no separate contraception, periods or menopause question.", 'safety-screen', True, "Yes adds 'Pregnancy safety information'. No shows a must-tick warning on the same screen.", "women's route only (sex assigned at birth = Female)"),
         (3047, '-ack', "You can't use some of our prescription treatments if you're pregnant or breastfeeding. Get in touch with our Dermatology Support Team if you become pregnant while using Hair + Me.", 'consent', "Acknowledgement that some treatments cannot be used in pregnancy or breastfeeding, and a promise to tell the team.", 'consent', False, '', "only when the answer on the same screen is No")],
 'pgc': [(3049, '', "Pregnancy safety information. We can prescribe you a treatment that's considered safe during this time but before we do this, we need you to read the information in the link below about the treatment and make an informed decision on whether you want to continue. [Information on treatment during pregnancy]", 'consent', "Informed consent for the pregnancy-safe route: the person must open and accept the pregnancy FAQ before carrying on.", 'consent', False, '', "only after 'Yes' to pregnant, breastfeeding or likely to conceive")],
 'mp':  [(4503, '', None, 'multi', "Two women-specific flags: postpartum in the last 6 months (temporary shedding) and unwanted facial hair (a sign of androgen excess, and a known side effect of oral minoxidil).", 'diagnosis', False, "No extra screen seen with both ticked (runs/scout-women-1).", "women's route only")],
 'mdm': [(4454, '', None, 'multi', "Medicines that clash with the formulas: mental-health medicines, BPH medicines (alpha-blockers, finasteride 5 mg), scalp steroids, plus free text for anything else.", 'safety-screen', True, "'Other' opens a free-text box. No stop screen for any option.", "men's route only"),
         (4456, '-other', 'Tell us about your other medications', 'text', "Free-text list of other medicines for the prescriber to check for interactions.", 'safety-screen', False, '', "only when 'Other' is ticked on the same screen")],
 'mdf': [(4455, '', None, 'multi', "Women's medicines list: only scalp steroids and free text. No question on the pill, HRT, spironolactone or blood-pressure tablets by name.", 'safety-screen', True, "'Other' opens a free-text box.", "women's route only"),
         (4457, '-other', 'Tell us about your other medications', 'text', "Free-text list of other medicines for the prescriber to check.", 'safety-screen', False, '', "only when 'Other' is ticked on the same screen")],
 'mcm': [(4453, '', None, 'multi', "The medical gate for men. Each option maps to a leaflet contraindication: minoxidil (phaeochromocytoma, blood pressure, heart, PoTS, hypertrichosis, liver) or finasteride / dutasteride (PSA or prostate / testicular cancer history, BPH, sexual dysfunction, mental health, male breast cancer, liver).", 'safety-screen', True, "Only the blood-pressure option adds a screen. Nothing stops the flow before the wall, even with eight conditions ticked (runs/scout-men-3).", "men's route only")],
 'mcf': [(4504, '', None, 'multi', "The medical gate for women: minoxidil contraindications (phaeochromocytoma, blood pressure, heart, PoTS, hypertrichosis) plus PCOS (labelled 'PMOS, formerly PCOS').", 'safety-screen', True, "Only the blood-pressure option adds a screen. Nothing stops the flow before the wall (runs/scout-women-2).", "women's route only")],
 'bp':  [(4420, '', None, 'single', "Follow-up for blood-pressure problems: is it controlled, high or low over the past year. Oral minoxidil lowers blood pressure.", 'safety-screen', False, "No stop for 'Often elevated' or 'Often low'.", "only when 'High blood pressure (hypertension) or low blood pressure (hypotension)' is ticked in the conditions list"),
         (4421, '-reading', 'Please enter your last blood pressure reading if available (mmHg)', 'text', "Optional last reading (placeholder 'e.g. 120/80') for the prescriber.", 'safety-screen', False, '', "same screen as the blood-pressure follow-up (optional)")],
 'al':  [(4447, '', None, 'multi', "Allergy check against the actives the pharmacy can put in a formula. The list doubles as a map of the formulary: minoxidil, finasteride, dutasteride, melatonin, urea, niacinamide, tretinoin, vitamin B6.", 'safety-screen', True, "'Other' opens a free-text box. No stop even with every active ticked (runs/scout-men-3).", ALWAYS),
         (4448, '-other', 'Tell us about your other allergies', 'text', "Free-text allergies for the prescriber and pharmacy.", 'safety-screen', False, '', "only when 'Other' is ticked on the same screen")],
 'rhf': [(254, '', None, 'number', "Baseline wellbeing score (how you feel about your hair, 0 to 10; optional slider, or in some visits a required 1 to 10 button row). A before-measure for later check-ins and marketing claims.", 'data-capture', False, '', ALWAYS)],
 'yna': [(None, '', "You're not alone (some visits: 'Lots of people feel this way'). We spoke to men in our community about their experiences of hair loss, and found that: 100% felt a negative emotional or psychological impact; 90% mentioned a loss of confidence or self-esteem; 58% described feeling embarrassed or insecure. *Based on responses from 89 participants", 'info', "Empathy and social-proof screen between the two wellbeing scores (auto-advances after 2.5 seconds).", 'marketing', False, '', "men's route only so far, and not in every visit: seen in " + cnt('yna'))],
 'rha': [(255, '', None, 'number', "Baseline self-rating of hair appearance (0 to 10; same two formats as the feelings score).", 'data-capture', False, '', ALWAYS)],
 'di':  [(8015, '', None, 'single', "Asks whether the person came for the discounted trial or for long-term treatment. Optional; the two options swap order between visits. A marketing-attribution and retention-risk signal.", 'marketing', False, "No change seen for either answer.", ALWAYS)],
 'rj':  [(None, '', "Your hair journey starts here: Consistency is key for continuous hair improvement (results-journey graphic)", 'info', "Expectation-setting screen before eligibility (auto-advances after 7 seconds).", 'expectation-setting', False, '', ALWAYS)],
 'el':  [(3053, '-dob', 'Your date of birth (DD/MM/YYYY). Our treatments are powerful, and at the moment, not suitable for anyone under the age of 18. (Info: You need to be over 18 to use our service.)', 'date', "Age gate, asked at the very end of the questions. Served either as one masked field or as separate Day / Month / Year boxes.", 'eligibility-gate', True, "Under 18 leads to the stop screen 'We're unable to treat you at this time.'", ALWAYS),
         (2007, '-uk', 'Where you live. Please confirm that you live in the UK (excluding Channel Islands).', 'consent', "Location gate: UK only, Channel Islands excluded. A required tick, not a postcode check.", 'eligibility-gate', False, '', ALWAYS)],
 'utt': [(None, '', "We're unable to treat you at this time. Thanks for your interest. At the moment, we're unable to treat your age group. We're working really hard to find ways to treat as many people as possible, and we hope to see you again in the future. [Goodbye for now] [Back to consultation]", 'info', "The only stop screen found before the account wall. It ends the consultation ('Goodbye for now' links to the home page).", 'eligibility-gate', False, '', "after the eligibility screen when the date of birth gives an age under 18 (tested with age 16)")],
 'ct':  [(None, '', "Your shopping bag (some visits: 'Your order'). Your order qualifies for complimentary standard shipping. Prescription · Personalised treatment · 4 week supply · 12ml. Subtotal £34.99, Shipping FREE, Total to pay £34.99. Redeem offer [Promo code] [Apply]. [Continue to checkout]", 'info', "The 'recommendation' screen. It never names a drug or even a format: one generic line at one price for every patient, plus a promo-code box.", 'product-selector', False, '', "always, after passing the eligibility screen")],
 'yd':  [(None, '', "Personalise your account: Your legal first name / Your legal last name / Your preferred name (optional: 'This will appear on your personalised products, and in your account.') / Engraved just for you: 'Our service is fully personalised – right down to the name on the treatment: FOR YOU'", 'contact', "THE ACCOUNT WALL. First screen that needs personal details. The walk stops here.", 'identity', False, '', "always, after 'Continue to checkout'")],
}
EL_OPTIONS = [
 {'label': '(date field) an age under 18: tested with 15/06/2010, age 16', 'effect': "Hard stop: 'We're unable to treat you at this time... we're unable to treat your age group.' The bag is never shown (runs/scout-women-1).", 'effectType': 'hard-stop', 'affects': [], 'evidence': 'observed'},
 {'label': '(date field) an age of 18 or over: tested with ages 32, 38 and 70', 'effect': "Continues to the shopping bag (runs/baseline-men, runs/baseline-women, runs/scout-women-2). No upper age limit was met at 70; older ages were not tested.", 'effectType': 'next-question', 'affects': [], 'evidence': 'observed'},
]
ORDER_M = ['tp', 'yhg', 'hgp', 'js', 'pds', 'pdsc', 'mi', 'ht', 'hs', 'ls', 'htp', 'htam', 'htc', 'ar', 'st', 'sc', 'scc', 'smt', 'pt', 'tt', 'pp', 'mdm', 'mcm', 'bp', 'al', 'rhf', 'yna', 'rha', 'di', 'rj', 'el', 'utt', 'ct', 'yd']
ORDER_F = ['tp', 'yhg', 'hgp', 'js', 'pds', 'pdsc', 'ht', 'hs', 'hw', 'hht', 'htp', 'hdw', 'htaf', 'htc', 'ar', 'st', 'sc', 'scc', 'smt', 'pt', 'tt', 'dt', 'pg', 'pgc', 'mp', 'mdf', 'mcf', 'bp', 'al', 'rhf', 'rha', 'di', 'rj', 'el', 'utt', 'ct', 'yd']

def find_q(sid, qid):
    # the variant with the richest labels wins (long skin-tone labels); for 'tt' the base variant (the pets badge is conditional)
    best = None
    vs = QD['steps'][sid]['variants']
    if sid == 'tt': vs = [v for v in vs if 'Better for pet owners' not in json.dumps(v)] or vs
    for v in vs:
        for q in v['definition']['questions']:
            if q['id'] == qid:
                score = len(json.dumps(q))
                if best is None or score > best[0]: best = (score, q, v['definition'])
    if best is None: raise SystemExit(f'question {qid} not found in step {sid}')
    return best[1], best[2]

def build_flow(prefix, order):
    out = []; n = 0
    for sid in order:
        for (qid, suffix, text, typ, purpose, role, branches, bdetail, shown) in A[sid]:
            n += 1
            first = QD['steps'][sid]['variants'][0]['definition']
            opts = []
            if qid is not None:
                q, df = find_q(sid, qid)
                ic = q.get('inputConfig') or {}
                t = text or df.get('title') or q.get('label')
                if sid == 'pp':  # exact acknowledgement text as served
                    md = [x for x in df['questions'] if x['inputType'] == 'markdown'][0]['inputConfig']['content']
                    t = df['title'] + '. ' + re.sub(r'\[class="[^"]*"\]', '', md).replace('**', '').strip().replace('\n- ', ' • ').replace('\n', ' ')
                if not text and df.get('description'): t = t + ' — ' + df['description'] if sid in ('yhg', 'hgp') else t
                if isinstance(ic.get('options'), list) and typ in ('single', 'multi'):
                    for o in ic['options']:
                        lab = o['label']
                        eff, et, aff, ev = effect_for(sid, q, o)
                        if o.get('description') and sid in ('tt', 'sc', 'mdm'): lab_full = lab
                        opt = {'label': lab, 'effect': eff, 'effectType': et, 'affects': aff, 'evidence': ev}
                        if o.get('description'): opt['subLabel'] = o['description']
                        if o.get('badges'): opt['badges'] = o['badges']
                        if o.get('exclusive'): opt['exclusive'] = True
                        opts.append(opt)
                elif ic.get('option') and typ == 'consent':
                    opts.append({'label': ic['option']['label'], 'effect': 'Required tick: the Next button stays disabled until it is ticked.' if not ic.get('isOptional') else 'Optional tick.', 'effectType': 'next-question', 'affects': [], 'evidence': 'observed'})
            else:
                t = text
            if sid == 'el' and suffix == '-dob': opts = EL_OPTIONS
            ent = {'id': f'{prefix}-{sid}{suffix}', 'stepId': sid, 'order': n, 'stage': 'anonymous', 'text': t, 'type': typ, 'options': opts,
                   'purpose': purpose, 'engineRole': role, 'branches': branches, 'branchDetail': bdetail, 'shownWhen': shown, 'evidence': 'observed'}
            if qid is not None: ent['siteQuestionId'] = qid
            out.append(ent)
    # after the wall: only what public documents or served code say
    extra = [
     ('account', 'Account details after the legal-name screen (exact screens not seen: the walk stops at the account wall). The served code includes input types for email / password sign-up, telephone number, delivery address and card billing.', 'contact', 'after-account', 'Creates the account and collects delivery and payment details.', 'identity', 'code', 'always, after the legal-name screen (inferred from the client code; not walked)'),
     ('photos', "Photo upload: 'At the end of the consultation, you will be asked if you would like to upload photos to accompany your answers, however, this step is entirely optional.' A prescriber may later request photos; if they are not sent within 7 days 'you will be shipped a non-prescription treatment'.", 'photo', 'after-account', 'Lets the prescriber confirm the diagnosis remotely. Optional by default, compulsory only on request.', 'diagnosis', 'docs', 'after account creation (support article 273174); not walked'),
     ('payment', "Payment: 'You have to enter your chosen payment method and details when you open your Hair + Me account.' The prescription is only passed to the pharmacy once the card has been charged.", 'info', 'checkout', 'Takes payment before the prescriber review; refunds are promised if no treatment can be recommended.', 'data-capture', 'docs', 'at account opening (terms: Payments); not walked'),
    ]
    for (sfx, t, typ, stage, purpose, role, ev, shown) in extra:
        n += 1
        out.append({'id': f'{prefix}-after-{sfx}', 'order': n, 'stage': stage, 'text': t, 'type': typ, 'options': [], 'purpose': purpose, 'engineRole': role, 'branches': False, 'branchDetail': '', 'shownWhen': shown, 'evidence': ev})
    return out

ENTRY = 'https://www.hairandme.com/c/suh/new'
flows = [
 {'id': 'men', 'name': "Hair consultation, men's route (sex assigned at birth = Male)", 'audience': 'men', 'entryUrl': ENTRY,
  'stagesSummary': "One shared consultation ('sign-up-hair', /c/suh). About 28 to 31 anonymous screens (tile, goals + data consent, sex at birth, hair and scalp, pets, format preference, finasteride / dutasteride acknowledgement, medicines, conditions, allergies, two wellbeing scores, date of birth + UK tick) → shopping bag (£34.99, no drug named) → account wall at 'Personalise your account' (legal name) → account, optional photos, payment and prescriber review (not tested).",
  'otherEntryPoints': ['https://www.hairandme.com/ (every GET STARTED / START 3 MINUTE CONSULTATION link goes to /c/suh/new)', 'https://www.hairandme.com/consultations/sign-up-hair/new (redirects to /c/suh/tp)', 'https://www.hairandme.com/products/the-drops → /c/suh/new?promocode=HGSHOPDROPS', 'https://www.hairandme.com/products/the-capsules → /c/suh/new?promocode=HGSHOPCAPS (same questions; bag £14.99, runs/entry-promo-caps-men)', 'https://www.hairandme.com/products/the-drops-mx → /c/suh/new'],
  'questions': build_flow('men', ORDER_M)},
 {'id': 'women', 'name': "Hair consultation, women's route (sex assigned at birth = Female)", 'audience': 'women', 'entryUrl': ENTRY,
  'stagesSummary': "Same consultation and entry URL as men. About 30 to 33 anonymous screens (tile, goals + data consent, sex at birth, hair and scalp incl. washing, hiding hair loss and hard water, pets, format preference, pregnancy / breastfeeding, postpartum / facial hair, medicines, conditions, allergies, two wellbeing scores, date of birth + UK tick) → shopping bag (£34.99, no drug named) → account wall at 'Personalise your account' (legal name) → account, optional photos, payment and prescriber review (not tested).",
  'otherEntryPoints': ['same as the men\'s route: there is no separate women\'s URL; the home-page "For women" card links to /c/suh/new'],
  'questions': build_flow('women', ORDER_F)},
]

SCOUT_NOTE = ' PRELIMINARY: from scout runs that changed several answers at once; stage 2 should confirm with one-change replays.'
rules = [
 {'id': 'R1', 'flow': 'men', 'when': "men-pds-sex = 'Male' (whatever tile was chosen on the first screen)", 'then': "Men's route is served: ingredient-results screen, lifestyle statements, men's hair-loss list, dutasteride / finasteride acknowledgement, men's medicines and conditions lists.", 'effectType': 'extra-questions', 'affects': [], 'evidence': 'observed', 'proof': "runs/baseline-men, runs/scout-neither (tile 'Neither' + Male)", 'confidence': 'high'},
 {'id': 'R2', 'flow': 'women', 'when': "women-pds-sex = 'Female' (whatever tile was chosen on the first screen)", 'then': "Women's route is served: washing, hiding hair loss, hard water, women's hair-loss list, pregnancy question, postpartum / facial hair, women's medicines and conditions lists; no dutasteride / finasteride acknowledgement.", 'effectType': 'extra-questions', 'affects': FIN_DUT, 'evidence': 'observed', 'proof': "runs/baseline-women, runs/scout-women-1 (tile 'Treatment for men' + Female)", 'confidence': 'high'},
 {'id': 'R3', 'flow': 'men', 'when': "two or more goals ticked on 'What are your hair goals?' (men and women)", 'then': "Extra screen 'Which hair goal do you want to tackle most?' listing only the ticked goals." + SCOUT_NOTE, 'effectType': 'extra-questions', 'affects': [], 'evidence': 'observed', 'proof': 'runs/scout-men-1 (5 goals), runs/scout-women-2 (2 goals) vs runs/baseline-men, runs/baseline-women (1 goal)', 'confidence': 'medium'},
 {'id': 'R4', 'flow': 'men', 'when': "men-htam = 'None' (women: women-htaf = 'I have no hair loss or thinning')", 'then': "'When did you notice changes to your hair?' is skipped; the patient is not turned away and reaches the same bag.", 'effectType': 'skip-questions', 'affects': [], 'evidence': 'observed', 'proof': 'runs/scout-men-none vs runs/baseline-men (one change); runs/scout-women-2 (multi-change)', 'confidence': 'high'},
 {'id': 'R5', 'flow': 'men', 'when': "'High blood pressure (hypertension) or low blood pressure (hypotension)' ticked in the conditions list (men and women)", 'then': "Extra screen 'How would you describe your blood pressure over the past 12 months?' with an optional last reading. No other condition adds a screen." + SCOUT_NOTE, 'effectType': 'extra-questions', 'affects': CAPS, 'evidence': 'observed', 'proof': 'runs/scout-men-3 and runs/scout-women-1 (got the screen) vs runs/scout-men-2 and runs/scout-women-2 (other conditions, no screen)', 'confidence': 'medium'},
 {'id': 'R6', 'flow': 'women', 'when': "women-pg = 'Yes' (pregnant, breastfeeding or likely to conceive)", 'then': "Extra screen 'Pregnancy safety information' (must tick to carry on). Not turned away. Per the FAQ only the niacinamide-based pregnancy-safe drops can then be prescribed." + SCOUT_NOTE, 'effectType': 'product-removed', 'affects': NOT_PREG, 'evidence': 'observed', 'proof': 'runs/scout-women-1 vs runs/baseline-women; product limits from ' + FAQ_PREG, 'confidence': 'medium'},
 {'id': 'R7', 'flow': 'men', 'when': 'date of birth gives an age under 18 (men and women; tested once, age 16, on the women\'s route)', 'then': "Hard stop: 'We're unable to treat you at this time... unable to treat your age group.' No bag, no account." + SCOUT_NOTE, 'effectType': 'hard-stop', 'affects': [], 'evidence': 'observed', 'proof': 'runs/scout-women-1 vs runs/scout-women-2 (age 70 passed) and runs/baseline-women', 'confidence': 'medium'},
 {'id': 'R8', 'flow': 'men', 'when': "pets = 'Yes' (men and women)", 'then': "Minoxidil pet-toxicity warning on the same screen, and The Capsules gains the badge 'Better for pet owners' on the format screen." + SCOUT_NOTE, 'effectType': 'soft-warning', 'affects': CAPS, 'evidence': 'observed', 'proof': 'runs/scout-men-2, runs/scout-women-2 (badge present) vs every pets = No run (badge absent)', 'confidence': 'medium'},
 {'id': 'R9', 'flow': 'men', 'when': 'any medical answer tested so far: patchy or complete hair loss, active scalp infection, phaeochromocytoma, heart disease, liver disease, prostate / mental-health / sexual-function history, BPH medicine, allergy to every active, declined finasteride', 'then': "No stop screen and no change to the bag before the account wall: the same 'Personalised treatment · £34.99' line is shown and the visitor is invited to check out. Medical triage is left to the prescriber after sign-up and payment.", 'effectType': 'none', 'affects': [], 'evidence': 'observed', 'proof': 'runs/scout-men-1, runs/scout-men-2, runs/scout-men-3, runs/scout-women-2 vs runs/baseline-men, runs/baseline-women', 'confidence': 'high'},
 {'id': 'R10', 'flow': 'men', 'when': 'entry through a product page (promo code HGSHOPCAPS in the URL)', 'then': "Same questions; the bag shows £14.99 (was £34.99) with 'First three months £14.99 each, then £34.99 ongoing.'", 'effectType': 'marketing-only', 'affects': ['svc'], 'evidence': 'observed', 'proof': 'runs/entry-promo-caps-men vs runs/baseline-men', 'confidence': 'high'},
]
experiments = [
 {'id': 'scout-men-1', 'flow': 'men', 'changed': 'MULTI-CHANGE SCOUT: all five goals (+ top goal Boost overall hair health); Still exploring; Coily; stress + weight loss; previous minoxidil and finasteride tablets; patches of complete hair loss; noticed in the past few weeks', 'result': "New screen 'Which hair goal do you want to tackle most?'. Otherwise the same route and the same £34.99 bag; no stop.", 'run': 'runs/scout-men-1'},
 {'id': 'scout-men-2', 'flow': 'men', 'changed': 'MULTI-CHANGE SCOUT: dry scalp; eczema/psoriasis + active infection + pain; pets Yes; The Drops; declined dutasteride/finasteride; BPH medicine + mental-health medicine; heart condition + phaeochromocytoma + liver disease; minoxidil allergy; discounted trial', 'result': "Pet warning and 'Better for pet owners' badge on The Capsules. No stop, no extra medical screen, same £34.99 bag ('12ml' line unchanged despite choosing drops).", 'run': 'runs/scout-men-2'},
 {'id': 'scout-men-3', 'flow': 'men', 'changed': "MULTI-CHANGE SCOUT: all six previous products; complete hair loss; every medicine option + free text; eight conditions incl. blood pressure; every allergy + free text", 'result': "New screen 'How would you describe your blood pressure over the past 12 months?' (answered Often low, 95/60). No stop, same £34.99 bag.", 'run': 'runs/scout-men-3'},
 {'id': 'scout-men-none', 'flow': 'men', 'changed': "men-htam: Across the hairline → None (one change)", 'result': "'When did you notice changes to your hair?' skipped; same bag.", 'run': 'runs/scout-men-none'},
 {'id': 'scout-neither', 'flow': 'men', 'changed': "MULTI-CHANGE SCOUT: first tile 'Neither of these are right for me'; gender identity Non-Binary (sex at birth Male)", 'result': "No stop; the men's route and the same £34.99 bag.", 'run': 'runs/scout-neither'},
 {'id': 'scout-women-1', 'flow': 'women', 'changed': "MULTI-CHANGE SCOUT: first tile 'Treatment for men' with sex Female; washes daily; hat + fibres; hard water Yes; eyebrow / sideburn loss; pregnant/breastfeeding/likely to conceive Yes; postpartum + facial hair; PCOS + blood pressure (Often elevated); date of birth 15/06/2010", 'result': "Women's route despite the men's tile. New screens: 'Pregnancy safety information', blood-pressure follow-up, and the stop screen 'We're unable to treat you at this time' (age group) after the eligibility screen.", 'run': 'runs/scout-women-1'},
 {'id': 'scout-women-2', 'flow': 'women', 'changed': "MULTI-CHANGE SCOUT: two goals; no hair loss or thinning; oily scalp + four scalp symptoms; pets Yes; The Drops; previous spironolactone + minoxidil spray; scalp steroids + other medicine; phaeochromocytoma + heart + hypertrichosis + PoTS; age 70", 'result': "Top-goal screen (two options only); timing question skipped; 'Better for pet owners' badge; no stop at age 70 or for any condition; same £34.99 bag.", 'run': 'runs/scout-women-2'},
 {'id': 'entry-promo-caps-men', 'flow': 'men', 'changed': 'entry URL: /c/suh/new → /c/suh/new?promocode=HGSHOPCAPS (the button on The Capsules product page)', 'result': "Same questions (format preference still asked). Bag £14.99 instead of £34.99: 'Your first three months of treatment for £14.99 each.'", 'run': 'runs/entry-promo-caps-men'},
]
recommendations = [
 {'profile': 'Man, 32, hairline loss for over a year, no medical issues, prefers capsules, accepts finasteride / dutasteride', 'offered': ['svc'], 'default': 'svc', 'note': "Bag: 'Prescription · Personalised treatment · 4 week supply · 12ml · £34.99'. No drug or format named. From the public leaflets the likely formulas for this patient are the finasteride + minoxidil or dutasteride + minoxidil capsules, but that is decided after sign-up and was not seen.", 'evidence': 'observed'},
 {'profile': 'Woman, 38, widening middle parting for over a year, not pregnant, no medical issues, prefers capsules', 'offered': ['svc'], 'default': 'svc', 'note': "Identical bag line and price. From the leaflets the likely formulas are minoxidil-only capsules or minoxidil drops; decided after sign-up, not seen.", 'evidence': 'observed'},
 {'profile': 'Any visitor arriving from a product page (promo code in the URL)', 'offered': ['svc'], 'default': 'svc', 'note': 'Same bag at £14.99 for each of the first three months, then £34.99.', 'evidence': 'observed'},
]

company = {
 'slug': 'hair-and-me', 'company': 'Hair + Me', 'market': 'UK', 'website': 'https://www.hairandme.com/', 'parent': 'Skin + Me Ltd (sister services: Skin + Me, Renew + Me, Menopause + Me); medicines made and dispensed by Feel Good Pharma Ltd (The Feel Good Pharmacy), GPhC 9011329',
 'audiences': ['men', 'women'],
 'model': 'Subscription telehealth: one online questionnaire, review by pharmacist independent prescribers, then a personalised compounded hair-loss medicine (scalp drops or a once-a-day capsule) posted every four weeks at one flat price.',
 'checkedOn': '2026-11-23',
 'access': {
  'howTested': ['live-walk', 'site-code', 'public-docs'],
  'accountWall': "Step 'yd', 'Personalise your account' (legal first name, legal last name, preferred name), reached by pressing 'Continue to checkout' on the shopping bag. Everything before it works without an account: all medical questions, date of birth, the UK tick and the bag. The site silently creates an anonymous visitor id on arrival (POST /new-user) and saves each answer to it as you go.",
  'blockers': ["The consultation is server-driven: there is no single quiz file. The server sends one step at a time and decides the next step itself, so branches that no run reached cannot be read from code.",
               "The server varies the flow at random between visits with identical answers (steps js, hs and yna come and go; wording, control type or option order changes on pds, st, rhf, rha, el, ct, di, hdw). A fixed click list for tools/walk.js therefore breaks; replays use tools/autowalk.js, which answers by step id.",
               "The formula a patient actually gets is chosen by a prescriber after account creation and payment. That is behind the account wall and was not tested.",
               "shop.hairandme.com (a Shopify shop the product pages point to in a test variant: 'Buy now - £14.99') is password-locked ('Opening soon'); its product feed returns 401."],
  'coverageNote': "Both routes (men, women) were walked to the account wall with the baseline patients, and six scout walks (several answers changed at once) were used to find extra screens: top-goal picker, blood-pressure follow-up, pregnancy information, the under-18 stop. Two one-change checks were also run (no hair loss; entry through a product-page promo link). Every option's exact wording comes from the step JSON the site served. The full formulary (16 formulas with strengths) comes from the three public patient information leaflets. Not tested: anything after the legal-name screen (account, photos, payment, the prescriber's decision), upper age limits beyond 70, and most options one at a time (stage 2).",
 },
 'products': PRODUCTS,
 'flows': flows,
 'rules': rules,
 'experiments': experiments,
 'recommendations': recommendations,
 'engineSummary': ("Hair + Me's public consultation is a data-collection form, not a decision engine. One questionnaire serves everyone; the only real fork is sex assigned at birth, which swaps in men's questions (dutasteride / finasteride acknowledgement, prostate, sexual and mental-health checks) or women's questions (pregnancy, postpartum, facial hair, PCOS). A handful of answers add one screen each (several goals, blood pressure, pregnancy) or skip one (no hair loss). The only hard stop found is age under 18. Every other answer tested, including patchy or total hair loss, an active scalp infection, phaeochromocytoma, heart disease and allergy to every active, leads to the same bag: 'Personalised treatment, 4 week supply, £34.99', with no drug or format named. The real decision is made afterwards by a pharmacist prescriber, who picks one of 16 compounded formulas (6 capsules, 10 drops) listed in the public leaflets; the format question (drops or capsules) is only a preference."),
 'strengths': [
  'Very low friction: about 3 minutes, no sign-in until the bag, one flat price (£34.99 per four weeks) for any formula, free delivery.',
  'Broad compounded formulary for one price: oral minoxidil in four strengths, finasteride or dutasteride combined with minoxidil in one capsule, topical finasteride, minoxidil + tretinoin, and non-hormonal niacinamide / urea / melatonin drops.',
  'A route for women who are pregnant, breastfeeding or trying to conceive (niacinamide-based drops) instead of a refusal.',
  "Alcohol-free, water-based minoxidil drops with essential oils (the leaflet labels them 'PGF', usually meaning propylene-glycol-free): an answer to the commonest complaint about high-street minoxidil.",
  'Clear, well-written informed-consent screen for finasteride / dutasteride (fertility, mood, sexual effects, persistent symptoms) before the medical history.',
  'Credible clinical front: two consultant dermatologists, named GPhC-registered pharmacist prescribers, published leaflets, own pharmacy, one patient record across the +Me brands.',
  'Pet-safety question and warning (minoxidil is toxic to cats and dogs): rare in this market.',
 ],
 'weaknesses': [
  'No recommendation before paying: the bag never says which drug, strength or even format the patient will get, and people with obvious contraindications are still walked to checkout.',
  'No triage in the questionnaire: patchy loss, total loss, scarring-type patterns and active scalp infection are not stopped or redirected to a GP; the service relies entirely on the prescriber catching them later.',
  'Thin medical history: no question on thyroid disease, anaemia or iron, kidney disease, family history of hair loss, smoking or alcohol; women are not asked about contraception, periods, menopause or HRT; medicines are mostly free text.',
  'Single-choice hair-loss picture: a man cannot record hairline and crown together.',
  "Photos are optional, so most diagnoses are made from tick-boxes alone ('diagnoses at a distance').",
  'No licensed products, no shampoo or device, and capsules and drops cannot be combined (FAQ), so there is no step-up path beyond changing the formula.',
  "Inconsistent details: the bag says '4 week supply · 12ml' even for capsule choosers while the leaflet says 28 ml or 56 ml; one home-page button links to the unfilled placeholder /HAIR_SIGNUP_URL (error page).",
  'Opaque pricing beyond the headline: bundle and vitamin prices are only visible inside an account; reviews mention surprise at the jump from a trial price to £34.99.',
 ],
 'opportunities': [
  'Show a provisional plan before the account wall (likely drug, strength, format and why), and tell people with red flags up front what will happen. Hair + Me shows nothing.',
  'Do real triage in the questionnaire: route sudden, patchy or scarring-type loss and scalp infection to the right care with a clear explanation rather than taking payment first.',
  'Ask the questions Hair + Me skips for women (iron, thyroid, cycle, contraception, menopause, HRT, PCOS detail) and offer treatments it lacks for them (for example spironolactone where appropriate, or blood-test-guided plans).',
  'Offer combination care (oral + topical, medicated shampoo, supplements matched to blood results) where Hair + Me forbids using capsules and drops together.',
  'Offer licensed options alongside compounded ones, and make photo review standard with visible progress tracking.',
  'Transparent pricing for every plan length before sign-up, with no trial-to-full-price shock.',
  "Let people record more than one area of loss and a family history, and use them to explain the plan: 'personalised' that the patient can actually see.",
 ],
 'sources': [
  {'title': 'Hair + Me home page', 'url': 'https://www.hairandme.com/'},
  {'title': 'Consultation entry (anonymous)', 'url': 'https://www.hairandme.com/c/suh/new'},
  {'title': 'The Drops product page', 'url': 'https://www.hairandme.com/products/the-drops'},
  {'title': 'The Capsules product page', 'url': 'https://www.hairandme.com/products/the-capsules'},
  {'title': 'The Drops (alcohol-free minoxidil) landing page', 'url': 'https://www.hairandme.com/products/the-drops-mx'},
  {'title': 'Ingredients page', 'url': 'https://www.hairandme.com/ingredients'},
  {'title': 'Meet the team', 'url': 'https://www.hairandme.com/meet-the-team'},
  {'title': 'Patient information leaflet: oral treatments (six capsule formulas)', 'url': PIL_ORAL},
  {'title': 'Patient information leaflet: topical treatments (six medicated drops formulas)', 'url': PIL_TOP},
  {'title': 'Patient information leaflet: Healthy Hair & pregnancy-safe drops (four formulas)', 'url': PIL_PREG},
  {'title': 'FAQ: pregnant, breastfeeding or trying to conceive', 'url': FAQ_PREG},
  {'title': 'FAQ: base ingredients of The Capsules', 'url': SUP + '254162-what-ingredients-are-in-the-hair-me-capsules'},
  {'title': 'FAQ: base ingredients of The Drops', 'url': SUP + '254163-what-ingredients-are-in-the-hair-me-drops'},
  {'title': 'FAQ: Multivitamins ingredients', 'url': SUP + '619143-what-ingredients-are-in-the-hair-me-multivitamins'},
  {'title': 'FAQ: price (£34.99 every four weeks)', 'url': SUP + '254006-how-much-is-the-hair-me-subscription'},
  {'title': 'FAQ: who can use Hair + Me (UK, over 18)', 'url': SUP + '254020-who-can-use-this-hair-me-treatment'},
  {'title': 'FAQ: photos at sign-up (optional; non-prescription treatment if requested photos are not sent)', 'url': SUP + '273174-do-i-need-to-submit-photos-when-signing-up-to-hair-me'},
  {'title': 'FAQ: capsules and drops cannot be used together', 'url': SUP + '681735-can-i-use-capsules-and-drops-together'},
  {'title': 'FAQ: finasteride and dutasteride side effects', 'url': SUP + '669809-finasteride-and-dutasteride-what-are-the-side-effects'},
  {'title': 'FAQ: is minoxidil pet friendly', 'url': SUP + '312537-is-minoxidil-pet-friendly'},
  {'title': 'Pharmacist prescribers (names and GPhC numbers)', 'url': SUP + '279693-get-to-know-your-pharmacist-prescribers'},
  {'title': 'Medical citations used in the consultation', 'url': SUP + '284617-medical-citations'},
  {'title': 'Terms: the Hair + Me services (unlicensed medicines, one record across +Me brands)', 'url': SUP + '254530-the-hair-me-services'},
  {'title': 'Terms: supply of medical products (Feel Good Pharma Ltd, GPhC 9011329)', 'url': SUP + '254504-supply-of-medical-products'},
  {'title': 'Terms: payments (subscription, pre-payment discounts)', 'url': SUP + '254543-payments'},
  {'title': 'Terms: stopping the services', 'url': SUP + '254538-stopping-the-hair-me-services'},
  {'title': 'Money-back promise (sign-ups 11 March to 11 April 2026 only)', 'url': SUP + '602280-money-back-promise'},
  {'title': 'Article: oral versus topical minoxidil', 'url': SUP + '742686-oral-versus-topical-minoxidil-what-you-need-to-know'},
  {'title': 'Article: what actually treats hair loss', 'url': SUP + '711950-what-actually-treats-hair-loss-the-evidence-based-ingredients-explained'},
  {'title': 'Support centre home', 'url': 'https://www.hairandme.com/support/en/'},
  {'title': 'Trustpilot: Hair + Me (4.3, about 4,540 reviews on 23 Nov 2026)', 'url': 'https://uk.trustpilot.com/review/hairandme.com'},
  {'title': 'Retail Focus: A Year of Real Results (brand-supplied figures: 250,000 customers; 93% join for hair loss or thinning)', 'url': 'https://retail-focus.co.uk/?p=25553'},
  {'title': "Cosmetics Business: Why Skin + Me's next big break is hair care with Hair + Me (launch, 31 March 2025)", 'url': 'https://cosmeticsbusiness.com/exclusive-why-skin-me-s-next-big-break'},
 ],
 'limitations': [
  "The prescriber's decision rules (which answers lead to which of the 16 formulas, which strengths, when someone is refused) are not public and sit behind the account wall. Product 'recommendedWhen' text comes from the leaflets and FAQ, not from seeing a prescription.",
  "Option effects marked 'observed' mean 'nothing visible changed before the account wall'. Effects marked 'docs' or 'inferred' describe what the leaflets imply the prescriber should do.",
  'Most non-baseline options were exercised in scout runs that changed several answers at once. They prove that those answers do not stop the flow, but one-change replays (stage 2) are needed to pin each visible effect to one answer.',
  'The server changes steps at random between visits, so "not shown" can mean "not shown in that visit". Counts of runs are given where this matters; they are small (7 men\'s runs, 4 women\'s runs).',
  'Prices: only the £34.99 headline, the £14.99 product-page offer and the £12.99 referral offer were seen. Bundle prices, the vitamin add-on price and any trial price are not public.',
  'Upper age limit unknown (70 passed). Non-UK residence could not be tested beyond the required tick.',
  'Customer numbers, awards and review figures are the company\'s or third parties\' claims and were not verified.',
 ],
}
json.dump(company, open(os.path.join(base, 'company.json'), 'w'), indent=1, ensure_ascii=False)
nq = sum(len(f['questions']) for f in flows); no = sum(len(q['options']) for f in flows for q in f['questions'])
unk = sum(1 for f in flows for q in f['questions'] for o in q['options'] if o['effectType'] == 'unknown')
print(f'company.json written: {len(PRODUCTS)} products, {len(flows)} flows, {nq} questions, {no} options ({unk} unknown), {len(rules)} rules, {len(experiments)} experiments')
