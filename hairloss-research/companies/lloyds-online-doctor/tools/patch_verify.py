# Stage 3 (VERIFY) patch for company.json. Run from the company folder: python3 tools/patch_verify.py
import json, re
d = json.load(open('company.json'))
Q = {q['id']: q for q in d['flows'][0]['questions']}
def opt(qid, label):
    for o in Q[qid]['options']:
        if o['label'].startswith(label): return o
    raise KeyError((qid, label))
R = {r['id']: r for r in d['rules']}
P = {p['id']: p for p in d['products']}

# --- options filled by stage 3 replays
o = opt('men-103270', 'Phaeochromocytoma')
o.update(effect='No extra screen. Minoxidil tablets and Dual Action Tablets are removed; finasteride, Propecia, Sons spray and Dual Tablet + Spray stay (runs/verify-gap-phaeo).', effectType='product-removed', affects=['p-minox-tab', 'p-dual-tabs'], evidence='observed')
o = opt('men-103270', 'Porphyria')
o.update(effect='No extra screen. Minoxidil tablets and Dual Action Tablets are removed; the rest stay (runs/verify-gap-porphyria).', effectType='product-removed', affects=['p-minox-tab', 'p-dual-tabs'], evidence='observed')
o = opt('men-103270', 'Systemic Lupus')
o.update(effect='No extra screen. Minoxidil tablets and Dual Action Tablets are removed; the rest stay (runs/verify-gap-sle).', effectType='product-removed', affects=['p-minox-tab', 'p-dual-tabs'], evidence='observed')
o = opt('men-103769', 'Medicated creams')
o.update(effect='Then 108158 "And what about these?". Sons Minoxidil spray and Dual Action Tablet + Spray are removed (same as scalp changes); the pets question is skipped; finasteride, Propecia, Minoxidil tablets and Dual Action Tablets stay (runs/verify-gap-scalp-creams).', effectType='product-removed', affects=['p-minox-spray', 'p-dual-tab-spray'], evidence='observed')
o = opt('men-101564', "I haven't had")
o.update(effect='Minoxidil tablets and Dual Action Tablets are removed; topical and finasteride kept, same as "I don\'t know" (runs/verify-gap-egfr-notest).', evidence='observed')
o = opt('men-108158', 'Testosterone')
o['effect'] = 'Adds a screen: finasteride is unlikely to help while taking steroids; tick "I understand". Offer and wording unchanged: all 6 cards (runs/verify-gap-testosterone, with antidepressants also ticked, which e28 showed has no effect).'
o['evidence'] = 'observed'
o = opt('men-100013', 'Female')
o['effect'] = 'Date of birth is still asked, then the questions end: answers summary and final consent screen, no product (runs/verify-female).'

# --- rules
R['R1']['then'] = 'Date of birth is still asked, then the questions end: answers summary and final consent, no recommendation (men-only service).'
R['R1']['proof'] = 'runs/female-01 (stage 1), runs/verify-female (stage 3)'
R['R3']['proof'] += '; re-tested runs/verify-age-65'
R['R7']['proof'] += '; re-tested runs/verify-heart'
R['R10']['proof'] += '; re-tested runs/verify-egfr-under30'
R['R4']['proof'] += '; Sudden re-tested runs/verify-sudden'
R['R12']['proof'] += '; re-tested runs/verify-ed-tablets'
R['R13']['proof'] += '; re-tested runs/verify-trying-baby-2'
R['R15']['proof'] += '; prostate cancer re-tested runs/verify-prostate-cancer-2'
R['R11']['when'] = "men-101561 = Yes and men-101564 = More than 30, I don't know, or I haven't had an eGFR test in the past year"
R['R11']['proof'] += ', runs/verify-gap-egfr-notest'
R['R23']['proof'] = 'runs/e04-dep-nofin, e10-prev-fin-sidefx, e12-allergy-fin, e25-breast-cancer, e26-prostate-cancer, e29-5ari-prostate, e30-ed-tablets, e31-gynaecomastia, e32-sex-problems, verify-prostate-cancer-2 (all skip 108003)'
R['R24']['proof'] = 'runs/e01-heart-yes, e06-scalp-yes, e11-allergy-minox, e27-bp-meds, verify-heart, verify-gap-scalp-creams (all skip 108001)'
R['R26']['proof'] = 'runs/exp-base vs runs/e05-dep-continue, e07-prev-topminox, e15-ckd-egfr-over30, e18-age-70, e06-scalp-yes, verify-age-65'
R['R27']['when'] += ', men-108158 includes Testosterone or Anabolic steroids'
R['R27']['proof'] += ', runs/verify-gap-testosterone'
new_rules = [
 {"id": "R28", "flow": "men", "when": "men-103270 includes Phaeochromocytoma, Porphyria or Systemic Lupus Erythematosus (SLE)", "then": "Minoxidil tablets and Dual Action Tablets removed silently (no screen); finasteride, Propecia and the spray stay.", "effectType": "product-removed", "affects": ["p-minox-tab", "p-dual-tabs"], "evidence": "observed", "proof": "runs/verify-gap-phaeo, runs/verify-gap-porphyria, runs/verify-gap-sle vs runs/exp-base", "confidence": "high"},
 {"id": "R29", "flow": "men", "when": "men-103769 includes medicated creams applied to the scalp", "then": "Sons Minoxidil spray and Dual Action Tablet + Spray removed (same as scalp changes); pets question skipped.", "effectType": "product-removed", "affects": ["p-minox-spray", "p-dual-tab-spray"], "evidence": "observed", "proof": "runs/verify-gap-scalp-creams vs runs/exp-base", "confidence": "high"},
 {"id": "R30", "flow": "men", "when": "An answer set that removes both drug families, e.g. men-107973 = Yes (heart/BP) and men-103270 includes Prostate cancer", "then": "No product is left, so the questions end early (straight after the next question) and go to the answers summary and final consent, with no recommendation screen.", "effectType": "hard-stop", "affects": [], "evidence": "observed", "proof": "runs/verify-combo-heart-prostate vs runs/exp-base", "confidence": "high"},
]
ids = {r['id'] for r in d['rules']}
d['rules'] += [r for r in new_rules if r['id'] not in ids]

# --- experiments
V = [
 ("verify-base", "none (stage 3 baseline replay)", "Same path, same 6 cards, prices and wording as runs/exp-base."),
 ("verify-heart", "men-107973: No -> Yes", "Only Finasteride tablets and Propecia; all minoxidil removed, spray included; 108001 and 108360 skipped. Confirms R7."),
 ("verify-age-65", "date of birth 15/6/1994 -> 15/6/1961 (age 65)", "Minoxidil tablets and Dual Action Tablets removed; licensed-first line dropped. Confirms R3."),
 ("verify-ed-tablets", "men-102632 Yes + men-103769 ED tablets", "Only Sons Minoxidil spray. Confirms R12."),
 ("verify-trying-baby-2", "men-108003 -> trying for a baby", "Warning 108004, then only Minoxidil tablets and spray. Confirms R13. (First try runs/verify-trying-baby stalled at the pets screen.)"),
 ("verify-prostate-cancer-2", "men-103270 -> Prostate cancer", "All finasteride removed, no screen, 108003 skipped. Confirms R15. (First try runs/verify-prostate-cancer stalled.)"),
 ("verify-egfr-under30", "men-101561 Yes + men-101564 Less than 30", "Questions end after the eGFR question; summary and final consent, no product. Confirms R10."),
 ("verify-female", "men-100013: Male -> Female", "Date of birth asked, then summary and final consent, no product. Confirms R1 (wording corrected)."),
 ("verify-sudden", "men-107954 -> Suddenly, over days or weeks", "Questions end; summary and final consent, no product. Confirms R4 for sudden onset."),
 ("verify-gap-phaeo", "men-103270 -> Phaeochromocytoma", "Minoxidil tablets and Dual Action Tablets removed, nothing else. New R28."),
 ("verify-gap-porphyria", "men-103270 -> Porphyria", "Same as phaeochromocytoma. New R28."),
 ("verify-gap-sle", "men-103270 -> SLE", "Same as phaeochromocytoma. New R28."),
 ("verify-gap-scalp-creams", "men-102632 Yes + men-103769 medicated scalp creams", "Spray and Dual Tablet + Spray removed, pets question skipped. New R29."),
 ("verify-gap-egfr-notest", "men-101561 Yes + men-101564 I haven't had an eGFR test", "Minoxidil tablets and Dual Action Tablets removed (as inferred). Extends R11."),
 ("verify-combo-heart-prostate", "men-107973 Yes AND men-103270 Prostate cancer (two changes)", "No product left: questions end after 107800, summary and final consent, no recommendation. New R30."),
 ("verify-gap-testosterone", "men-102632 Yes + 103769 antidepressants + 108158 Testosterone or Anabolic steroids", "Steroid warning screen (103277) and medicines list (101599); all 6 cards and the same wording."),
]
eids = {e['id'] for e in d['experiments']}
for i, c, r in V:
    if i not in eids:
        d['experiments'].append({"id": i, "flow": "men", "changed": c, "result": r, "run": "runs/" + i})

# --- products and recommendations
P['p-minox-tab']['recommendedWhen'] = 'Offered unless age 65 or over, kidney disease (eGFR over 30, unknown or not tested), phaeochromocytoma, porphyria, SLE, heart/BP condition, BP medicines, ED tablets or minoxidil allergy (observed).'
P['p-minox-spray']['recommendedWhen'] = 'Offered unless scalp changes, medicated scalp creams, heart/BP condition, BP medicines or minoxidil allergy. The only product left for men on ED tablets. Named in the "licensed first" advice (observed).'
for rc in d['recommendations']:
    if rc['profile'].startswith('Baseline woman'):
        rc['note'] = 'Not served: men only. Female at the first question: date of birth is asked, then the questions end with no product (runs/verify-female).'
    if rc['profile'].startswith('Man 65 or over'):
        rc['profile'] = 'Man 65 or over, with kidney disease (eGFR over 30, unknown or not tested), phaeochromocytoma, porphyria or SLE'
names = [r['profile'] for r in d['recommendations']]
if not any(n.startswith('Man with both') for n in names):
    d['recommendations'].append({"profile": "Man with both a minoxidil exclusion (e.g. heart/BP) and a finasteride exclusion (e.g. prostate cancer)", "offered": [], "default": None, "note": "Questions end early; summary and final consent with no product.", "evidence": "observed"})
if not any(n.startswith('Man using medicated scalp creams') for n in names):
    d['recommendations'].append({"profile": "Man using medicated scalp creams", "offered": ["p-dual-tabs", "p-fin", "p-minox-tab", "p-propecia"], "default": "p-dual-tabs", "note": "Topicals removed, as for scalp changes (runs/verify-gap-scalp-creams).", "evidence": "observed"})

d['engineSummary'] = d['engineSummary'].replace('age 65+, kidney disease or ED tablets drop oral minoxidil; scalp changes drop topicals.', 'age 65+, kidney disease, phaeochromocytoma, porphyria, SLE or ED tablets drop oral minoxidil; scalp changes or medicated scalp creams drop topicals. When both families are gone, the questions end early with no product.')
d['limitations'] = [
 'Only the anonymous part of the flow was tested; the final consent (100467) was not pressed, so the exact sign-in point and the clinician review step are unseen.',
 'Untested options are marked unknown or inferred: two liver sub-options, previous oral minoxidil / other medication, "too early to tell", "less than 12 months", irregular use, 108419 Yes, the minor medicines in 108158, Guanethidine and obstructive uropathy to the end.',
 'Only one combination of answers was replayed (heart/BP plus prostate cancer). Other combinations are assumed to follow the same subtraction logic (inferred).',
 'Pack size and safety screens were only walked for finasteride; plan prices for other products come from the product data, not a walk.',
 'Free-text answers were neutral; a clinician may act on them after submission, which cannot be seen.',
 'FAQ, help-centre and subscription-terms pages were not read. Legal status of the minoxidil sprays is inferred.',
 'Stock flags (both Dual Action packs out of stock) and prices were checked on 24 Nov 2026 and can change.',
]
d['access']['coverageNote'] = d['access']['coverageNote'] + ' Stage 3 (24 Nov 2026) replayed the baseline and 8 key rules (all confirmed) and filled 7 gaps (phaeochromocytoma, porphyria, SLE, scalp creams, eGFR not tested, testosterone, and one two-change combination); see verification.'
d['access']['blockers'] = [b for b in d['access']['blockers']]
d['checkedOn'] = '2026-11-24'

d['verification'] = {
 "checked": [
  "Baseline man replayed fresh (runs/verify-base): same path, same 6 cards, prices and wording as runs/exp-base. Confirmed.",
  "R7 heart/BP Yes (runs/verify-heart): only Finasteride and Propecia; every minoxidil product removed, spray included. Confirmed.",
  "R3 age 65 (runs/verify-age-65): Minoxidil tablets and Dual Action Tablets removed. Confirmed.",
  "R12 ED tablets (runs/verify-ed-tablets): only Sons Minoxidil spray offered. Confirmed.",
  "R13 trying for a baby (runs/verify-trying-baby-2): warning, then all finasteride removed. Confirmed.",
  "R15 prostate cancer (runs/verify-prostate-cancer-2): all finasteride removed with no screen. Confirmed.",
  "R10 eGFR less than 30 (runs/verify-egfr-under30): questions end, no product. Confirmed.",
  "R4 sudden onset (runs/verify-sudden): questions end, no product. Confirmed.",
  "R1 female (runs/verify-female): no product. Confirmed, but date of birth is still asked first (wording corrected).",
  "Product facts against live product pages (curl, 24 Nov 2026): names, strengths and one-off prices of all 7 catalogue products match: finasteride 1 mg £34/£95/£163; Propecia 1 mg £60.50/£148.50/£210; Sons minoxidil 5% £33/£54/£99; hair loss tablets (minoxidil 2.5 mg) £29/£77/£142; both Dual Action packs £106/£189; Minoxidil 5% solution £51 (3 months).",
  "Hair-loss collection page still says \"These treatments can only be prescribed to men\"; no women's hair-loss product found.",
  "Evidence labels: every rule marked observed now names existing run folders (shorthand folder names in R23, R24, R26 written out in full)."
 ],
 "corrected": [
  "R1 and the Female option: the questions do not end 'at once'; date of birth is asked first, then summary and consent (runs/verify-female).",
  "Phaeochromocytoma, Porphyria and SLE changed from unknown to observed: each removes oral minoxidil only (new R28). The earlier guess 'likely removes minoxidil' was partly right; the spray stays.",
  "Medicated scalp creams changed from unknown to observed: removes topical minoxidil (new R29).",
  "eGFR 'I haven't had a test' changed from inferred to observed (R11 widened).",
  "Testosterone or anabolic steroids: confirmed warning only, offer unchanged (added to R27).",
  "Combination gap closed: heart/BP plus prostate cancer leaves no product and the questions end early (new R30; the limitation saying combinations were not replayed is narrowed).",
  "Recommendation profiles, recommendedWhen for minoxidil tablets and spray, engineSummary and limitations updated to match."
 ],
 "stillUnverified": [
  "The exact sign-in point after the final consent (100467), which was never pressed.",
  "Two liver sub-options, previous oral minoxidil / other medication, 'too early to tell', 'less than 12 months', irregular use, 108419 Yes, Guanethidine and obstructive uropathy to the end.",
  "Pack-size and safety screens for products other than finasteride; subscription prices for products other than finasteride.",
  "Other two-answer combinations (assumed to follow the same subtraction logic).",
  "Rules not re-tested in stage 3 (R2, R5, R6, R8, R9, R14, R16-R22, R25-R27 except where noted) rest on stage 1 and 2 runs only.",
  "A dead link on the Propecia page to a 'finasteride and Regaine bundle' (404): presumably a withdrawn product; not in the catalogue."
 ],
 "verdict": "High trust for what it covers. Every one of the 9 high-impact rules re-tested live in stage 3 (two drug-family removals, oral-minoxidil removal at 65, the ED-tablet rule, the baby and prostate-cancer finasteride removals, and three early stops) gave exactly the recorded result, and the baseline replay matched card for card. All 7 product prices and strengths match the live pages. Stage 3 found no contradicted rule, only one wording error (female answer still asks date of birth) and filled seven gaps, which all fit the same simple subtraction engine. The weak points are what was never seen: the account wall after the final consent, a handful of rare options, and combinations other than the one tested."
}
json.dump(d, open('company.json', 'w'), indent=1, ensure_ascii=False)
print('patched', len(d['rules']), 'rules', len(d['experiments']), 'experiments')
