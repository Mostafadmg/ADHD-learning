#!/usr/bin/env python3
"""Stage 3 (VERIFY) patch for company.json. Run AFTER build-company.py and stage2-patch.py:
    python3 -I scripts/build-company.py && python3 -I scripts/stage2-patch.py && python3 -I scripts/verify-patch.py
Safe to run twice (it checks before adding)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, '..', 'company.json')
c = json.load(open(P, encoding='utf-8'))
men = next(f for f in c['flows'] if f['id'] == 'men')
Q = {q['id']: q for q in men['questions']}

def opt(qid, label_start):
    return next(o for o in Q[qid]['options'] if o['label'].startswith(label_start))

# ---- 1. options that were inferred/code and are now observed ----
o = opt('men-which_image_best_matches_your_hair_loss', 'Temples'); assert o['label'] == 'Temples'
o.update(effectType='none', evidence='observed', effect="Continues; no extra question and no change to the offer (three-part kit featured, all eight products). Run verify-19-pat-temples.")
o = opt('men-which_image_best_matches_your_hair_loss', 'Moderate')
o.update(effectType='none', evidence='observed', effect="Continues; no extra question and no change to the offer (three-part kit featured, all eight products). Run verify-20-pat-moderate.")
o = opt('men-which_image_best_matches_your_hair_loss', 'Complete')
o.update(evidence='observed', effect="Stops at once: 'No suitable treatment. Our treatments are not effective in individuals who have experienced complete hair loss.' with the clinic email and a 'Review your answers' button. Run verify-11-pat-complete.")
o = opt('men-sixty_five_and_over_confirmation', 'No')
o.update(evidence='observed', effect="Stops: 'No suitable treatment. Unfortunately, we’re unable to recommend a hair loss treatment for you. Please contact your doctor for advice.' with the clinic email and 'Review your answers'. Run verify-12-age-65-no.")
o = opt('men-lactose_tolerance', 'I can tolerate very small')
o.update(effectType='none', evidence='observed', effect="Continues. Flags unchanged apart from the allergy list (lactose_intolerance_or_allergy); offer identical to baseline. Run verify-17-al-lac-small.")
o = opt('men-clarify_asthma', 'I understand')
o.update(effectType='none', evidence='observed', effect="Continues. Offer identical to baseline (topical sprays and kits still shown). Run verify-15-c-ast-yes.")
o = opt('men-clarify_plan_on_trying_for_baby', 'I would like')
o.update(effectType='none', evidence='observed', effect="Continues. Offer identical to baseline (finasteride kits still featured). Run verify-16-c-baby-yes.")
o = opt('men-what_is_most_important_when_choosing_product', 'All of the above')
o.update(effectType='marketing-only', evidence='observed', effect="Continues; offer identical to baseline. The switch it sets in the browser is never read. Run verify-18-imp-all.")

# ---- 2. rules ----
R = {r['id']: r for r in c['rules']}
R['R3'].update(evidence='observed', confidence='high',
    then="Stop screen 'No suitable treatment' with its own message, the clinic email and 'Review your answers'.",
    proof='runs/verify-11-pat-complete, runs/verify-12-age-65-no (served results in quiz-definition.json agree)')
R['R21'].update(confidence='high',
    proof='runs/verify-14-pair-alfin-scpain (finasteride allergy + scalp pain, one change each from baseline); runs/s2-men-explore',
    then="Only Rosemary Oil (a cosmetic) is offered, badged 'Most effective', with the 'See results in 180 days or your money back' strip and 'Save 40%' (£14.00). No stop and no 'unable to treat' message.")
R['R22']['proof'] = ('runs/x2-22-age-65, runs/x2-24-pat-other, runs/x2-29-pat-extensive, runs/x2-19-c-body, runs/x2-27-imp-se, '
                     'runs/x2-28-imp-scalp, runs/x2-23-hist-yes, runs/verify-19-pat-temples, runs/verify-20-pat-moderate, runs/verify-18-imp-all')
R['R22']['when'] = ("age 65 or over (confirmed Yes), any pattern other than Patchy or Complete (Temples, Moderate, Extensive, Other), "
                    "body hair loss, any 'most important' answer, or 'I have' a medical history")
R['R11']['when'] = "either answer (opt-in or 'I do not wish to be considered') on the PSA, asthma or trying-for-a-baby follow-up"
R['R11']['proof'] = ('runs/x2-09-c-psa-no, runs/x2-31-c-psa-yes, runs/x2-11-c-ast-no, runs/verify-15-c-ast-yes, runs/x2-12-c-baby-no, '
                     'runs/verify-16-c-baby-yes; re-tested runs/verify-10-c-psa-no')
R['R17']['when'] = "lactose intolerance, with either follow-up ('can't tolerate any amount' or 'very small amounts')"
R['R17']['proof'] = 'runs/x2-18-al-lac-none, runs/verify-17-al-lac-small'
# re-test proofs appended
for rid, run in [('R5', 'runs/verify-03-al-fin'), ('R6', 'runs/verify-04-al-min'), ('R7', 'runs/verify-05-sc-red'),
                 ('R10', 'runs/verify-06-c-bp-yes'), ('R14', 'runs/verify-07-dep-suic'), ('R18', 'runs/verify-08-regaine-almin'),
                 ('R2', 'runs/verify-09-onset-sudden'), ('R20', 'runs/verify-01-baseline, runs/verify-02-baseline-full')]:
    if run not in R[rid]['proof']:
        R[rid]['proof'] += '; re-tested in stage 3: ' + run
new_rules = [
    {"id": "R24", "flow": "men",
     "when": "entry link names a product AND the man is ruled out of its drug by an eligibility flag, not only an allergy (here Regaine link + scalp pain, plus a finasteride allergy)",
     "then": "The entry product is still featured (Regaine, 'Most effective', £65.00 full price) next to Rosemary Oil. So the entry-link bypass beats the eligibility flags too, not just the allergy flags; with both drugs ruled out the man is still offered minoxidil.",
     "effectType": "product-added", "affects": ["p-regaine"], "evidence": "observed",
     "proof": "runs/verify-21-pair-alfin-scpain-regaine vs runs/verify-14-pair-alfin-scpain", "confidence": "high"},
    {"id": "R25", "flow": "men",
     "when": "entry link /subscribe/hair-loss/minoxidil, baseline answers",
     "then": "Extra Strength Spray is featured 'Recommended for you' at full price (£30.00 a month, no first-order code); the other seven products sit under 'See all treatments' at full price (three-part kit £40.00, Finasteride £28.00, Regaine £65.00).",
     "effectType": "product-switched", "affects": ["p-minoxidil-spray"], "evidence": "observed",
     "proof": "runs/verify-13-min-entry vs runs/verify-01-baseline", "confidence": "high"},
]
for r in new_rules:
    if r['id'] not in R:
        c['rules'].append(r)

# ---- 3. experiments ----
V = [
 ('verify-01-baseline', 'none (baseline replayed fresh)', 'Same as recorded: 8 questions, both flags true, three-part kit featured Most effective £26.67, seven others at the recorded prices.'),
 ('verify-02-baseline-full', 'none (baseline-men.json replayed to the account wall)', 'Same as recorded: order summary three-part kit, 3 kits every 3 months £216.00, promo −£40.00, total £176.00; account form at …/profile.'),
 ('verify-03-al-fin', 'allergy: none → finasteride (re-test of R5)', 'Confirmed: hasAllergyToFinasteride true; Extra Strength Spray featured Recommended for you £18.00; only Regaine and Rosemary Oil besides.'),
 ('verify-04-al-min', 'allergy: none → minoxidil (re-test of R6)', 'Confirmed: Finasteride featured Recommended for you £16.80; only Rosemary Oil besides.'),
 ('verify-05-sc-red', "scalp: No → 'Red rinds or rashes' (re-test of R7)", 'Confirmed: isMinoxidilEligible false; Finasteride featured £16.80 + Rosemary Oil.'),
 ('verify-06-c-bp-yes', 'cautions: blood pressure, follow-up asks to be considered for minoxidil (re-test of R10)', 'Confirmed: minoxidil still removed; Finasteride featured £16.80 + Rosemary Oil.'),
 ('verify-07-dep-suic', 'mental-health branch, GP, stable dose, suicidal thoughts Yes (re-test of R14)', 'Confirmed: no stop, no signposting screen; isFinasterideEligible false; Extra Strength Spray featured £18.00, Regaine, Rosemary Oil.'),
 ('verify-08-regaine-almin', 'Regaine entry link + minoxidil allergy (re-test of R18)', 'Confirmed: Regaine still featured (Most effective, £65.00) with Finasteride £28.00 and Rosemary Oil £23.33.'),
 ('verify-09-onset-sudden', "onset: gradual → 'Over the last few days or weeks' (re-test of R2)", "Confirmed: reject URL …/when_did_you_notice/reject/sudden, 'No suitable treatment… not designed for sudden hair loss… seek advice from your usual GP'."),
 ('verify-10-c-psa-no', "cautions: PSA, follow-up 'I do not wish to be considered for finasteride…' (re-test of R11)", 'Confirmed: offer identical to baseline; finasteride kits still featured.'),
 ('verify-11-pat-complete', "pattern: 'Complete' (new; R3 was code only)", "Stop: …/reject/complete, 'Our treatments are not effective in individuals who have experienced complete hair loss.'"),
 ('verify-12-age-65-no', "age: 65 or over, confirmation 'No' (new; R3 was code only)", "Stop: …/sixty_five_and_over_confirmation/reject/no, 'unable to recommend a hair loss treatment… contact your doctor'."),
 ('verify-13-min-entry', 'entry link /subscribe/hair-loss/minoxidil (new)', 'Extra Strength Spray featured Recommended for you £30.00 (full price); all eight products listed at full price.'),
 ('verify-14-pair-alfin-scpain', 'pair: finasteride allergy + scalp pain/itching (new; R21 was from a mixed mapping walk)', "Both drugs ruled out: only Rosemary Oil, 'Most effective', £14.00, with the money-back strip; no stop or 'unable to treat' message."),
 ('verify-15-c-ast-yes', 'cautions: asthma, follow-up opts in to topical (new)', 'No change from baseline.'),
 ('verify-16-c-baby-yes', 'cautions: trying for a baby, follow-up opts in to finasteride (new)', 'No change from baseline.'),
 ('verify-17-al-lac-small', "allergy: lactose, follow-up 'very small amounts' (new)", 'Allergy list gains lactose_intolerance_or_allergy; no change in the offer.'),
 ('verify-18-imp-all', "most important: 'All of the above' (new)", 'No change from baseline.'),
 ('verify-19-pat-temples', "pattern: 'Temples' (new)", 'No change from baseline.'),
 ('verify-20-pat-moderate', "pattern: 'Moderate' (new)", 'No change from baseline.'),
 ('verify-21-pair-alfin-scpain-regaine', 'Regaine entry link + finasteride allergy + scalp pain (new)', 'Regaine still featured (Most effective, £65.00) with Rosemary Oil £23.33, although isMinoxidilEligible is false: the entry bypass also beats the eligibility flag.'),
 ('verify-22-fin-billing', 'baseline, then choose Finasteride and go to the billing screen (new)', 'Billing screen: quarterly £28.00 a month; six-monthly £24.00 (pre-selected, struck-through £34.00, "Save £120.00 per year"); annually £20.00. Matches the API-derived prices.'),
]
have = {e['id'] for e in c['experiments']}
for i, ch, res in V:
    if i not in have:
        c['experiments'].append({"id": i, "flow": "men", "changed": ch, "result": res, "run": "runs/" + i})

# ---- 4. recommendations ----
for r in c['recommendations']:
    if r['profile'].startswith('Man with both drugs ruled out'):
        r['note'] = ("Rosemary Oil only, badged 'Most effective', £14.00, with the money-back strip. No stop screen. "
                     "Replayed as a clean pair in runs/verify-14-pair-alfin-scpain (finasteride allergy + scalp pain); first seen in runs/s2-men-explore.")
    if r['profile'].startswith('Man under 18'):
        r['note'] = ("Stop screen 'No suitable treatment' with its own message and the clinic email; 'Review your answers' lets him change the answer and carry on (x2-32). "
                     "Runs stop-under18, x2-25, x2-26, verify-11-pat-complete, verify-12-age-65-no.")
if not any(r['profile'].startswith('Man entering through /subscribe/hair-loss/minoxidil') for r in c['recommendations']):
    c['recommendations'].append({"profile": "Man entering through /subscribe/hair-loss/minoxidil, baseline answers",
        "offered": ["p-minoxidil-spray", "p-kit-pro", "p-kit", "p-combo-kit", "p-finasteride", "p-triple-spray", "p-regaine", "p-rosemary-oil"],
        "default": "p-minoxidil-spray",
        "note": "Extra Strength Spray featured 'Recommended for you' at £30.00 (no first-order code on product links). Run verify-13-min-entry.",
        "evidence": "observed"})
    c['recommendations'].append({"profile": "Man entering through /subscribe/hair-loss/regaine with both drugs ruled out (finasteride allergy + scalp pain)",
        "offered": ["p-regaine", "p-rosemary-oil"], "default": "p-regaine",
        "note": "Regaine (minoxidil) still featured, £65.00, although minoxidil is ruled out by the scalp answer. Run verify-21-pair-alfin-scpain-regaine.",
        "evidence": "observed"})

# ---- 5. products ----
P_ = {p['id']: p for p in c['products']}
fin = P_['p-finasteride']
fin['priceDetail'] = fin['priceDetail'].replace('From the API variant data: six-monthly £24 a month, annual £20 a month;',
    'Six-monthly £24 a month and annual £20 a month (from the API discounts and seen on the billing screen in runs/verify-22-fin-billing, struck-through £34.00);')
ms = P_['p-minoxidil-spray']
if '60% off your first month' not in ms['priceDetail']:
    ms['priceDetail'] += " The /hair-loss/minoxidil page banner (read 24 Nov 2026) says '60% off your first month', which matches no offer seen in the flow."

# ---- 6. text corrections ----
c['opportunities'] = [s.replace("Offer strength and form choices (oral minoxidil, topical finasteride, different minoxidil strengths); Numan's quiz has none.",
    "Offer strength and form choices (oral minoxidil, several minoxidil strengths, topical finasteride on its own). Numan has topical finasteride only inside its combination spray, and its quiz never asks about strength or form.")
    for s in c['opportunities']]
c['weaknesses'] = [s.replace("blunt for well-controlled hypertension on topical minoxidil.",
    "blunt for well-controlled hypertension on topical minoxidil (our clinical view, inferred).")
    .replace("Product links bypass the safety filter: the entry product stays featured even with an allergy to its drug (x2-20 Regaine with minoxidil allergy, x2-21 Finasteride with finasteride allergy).",
    "Product links bypass the safety filter: the entry product stays featured even with an allergy to its drug (x2-20, x2-21, verify-08) or when its drug is ruled out by a scalp answer (verify-21: Regaine offered with scalp pain and a finasteride allergy).")
    for s in c['weaknesses']]
c['engineSummary'] = c['engineSummary'].replace(
    "the product in the entry link if there was one,",
    "the product in the entry link if there was one (even when its drug is ruled out),")

c['access']['coverageNote'] = (c['access']['coverageNote'].split(' Stage 3')[0] +
    " Stage 3 (24 Nov 2026) replayed the baseline twice (to the product screen and to the account wall), re-tested ten stage-2 rules "
    "and ran the main untested options (Complete, 65+ No, Temples, Moderate, asthma and baby opt-ins, lactose small, All of the above, "
    "the minoxidil entry link, a two-rule pair with and without an entry link, and the Finasteride billing screen): 22 replays in runs/verify-*.")

c['limitations'] = [l for l in c['limitations'] if not l.startswith('Not replayed one at a time')]
c['limitations'] = [l.replace('Six-monthly and annual prices for products other than the three-part kit and Regaine are worked out from the API variant data, not seen on a billing screen.',
    'Six-monthly and annual prices for products other than the three-part kit, Regaine and Finasteride are worked out from the API discount data, not seen on a billing screen.') for l in c['limitations']]
extra = ["Still not replayed: GP 'Yes' (it opens a GP email screen; no contact details may be entered), most pairs of rules (one pair was tested), "
         "and every 'Select' on the product screen except Regaine, the three-part kit and Finasteride.",
         "About 22 more anonymous drafts were created on Numan's side in stage 3; none was submitted."]
for e in extra:
    if e not in c['limitations']:
        c['limitations'].append(e)

c['verification'] = {
 "checked": [
  "Baseline replayed fresh twice: product screen identical (verify-01) and account wall total £176.00 identical (verify-02).",
  "R5 finasteride allergy: confirmed (verify-03).",
  "R6 minoxidil allergy: confirmed (verify-04).",
  "R7 scalp 'red rinds or rashes' removes minoxidil: confirmed (verify-05).",
  "R10 blood pressure removes minoxidil even with the opt-in answer: confirmed (verify-06).",
  "R14 suicidal thoughts Yes: no stop or signposting; finasteride removed: confirmed (verify-07).",
  "R18 Regaine entry link survives a minoxidil allergy: confirmed (verify-08).",
  "R2 sudden onset stop: confirmed (verify-09).",
  "R11 PSA opt-out ignored on screen: confirmed (verify-10).",
  "R3 'Complete' and 65+ 'No' stops: were code only, now observed (verify-11, verify-12).",
  "R21 both drugs ruled out leaves only Rosemary Oil: was from a mixed walk, now a clean pair (verify-14).",
  "Product facts against the live API (api.numan.com product_categories/hair-loss, read 24 Nov 2026): all 16 active variants, strengths and prices identical to the saved stage-1 copy (three-part kit £120/quarter with 6% spray + finasteride 1 mg; two-part kit £108; combination kit £120; Finasteride 84 tablets £84; Triple-Action 10% minoxidil / 5% azelaic acid / 0.1% finasteride £108; Extra Strength Spray 6% £90; Regaine 5% £195; Rosemary Oil £28 or £70).",
  "Product pages read live: Finasteride 'From £1.00 / tablet'; Minoxidil plan 'From £30.00 / bottle' and licensed strengths 2% and 5%; Regaine £65.00 → £51.67 and 1 ml dose; Rosemary Oil £28.00 → £14.00, 10-12 drops a day; Hair Support £28.00 a bottle with vitamin A 1000 µg, vitamin C 80 mg, vitamin E 10.2 mg, biotin 200 µg, selenium 55 µg, grape seed extract 50 mg. All match company.json.",
  "Finasteride six-monthly £24 and annual £20 a month: seen on the billing screen (verify-22).",
  "Catalogue completeness: the hair-loss landing page and the live API list no product missing from company.json (no oral minoxidil, dutasteride, shampoo or device).",
  "Women: still no women's consultation; nothing new found on the live pages.",
  "Every run folder cited as proof exists (one shorthand proof in R22 was expanded to full folder names)."
 ],
 "corrected": [
  "R3 evidence code → observed (stops replayed).",
  "R21 confidence medium → high, with a clean one-change pair as proof; the Rosemary-only screen also carries the money-back strip.",
  "New rule R24: the entry-link bypass also beats the eligibility flags (Regaine offered when minoxidil is ruled out by scalp pain). Weakness and engine summary updated.",
  "New rule R25 and recommendation: the minoxidil entry link features Extra Strength Spray at full price.",
  "Eight options moved from inferred/code to observed (Temples, Moderate, Complete, 65+ No, lactose small, asthma opt-in, baby opt-in, All of the above); R11, R17 and R22 widened to cover them.",
  "Opportunity text corrected: it said Numan has no topical finasteride, but the Triple-Action Spray contains 0.1% finasteride.",
  "A clinical opinion in the weaknesses (blood pressure and topical minoxidil) is now labelled as our inferred view.",
  "Finasteride price detail: six-monthly and annual prices now cite the observed billing screen; Minoxidil page's '60% off your first month' banner noted.",
  "Limitations and coverage note updated; the old 'not replayed' list replaced by what is still untested."
 ],
 "stillUnverified": [
  "Everything after the account wall: what the clinician finally prescribes, and whether the clinician notes (psoriasis, PSA, asthma, baby, lactose opt-outs) are acted on.",
  "The server rules that set the flags were never seen as code; they are known only from replays, so untested combinations could behave differently.",
  "GP 'Yes' path and the GP email screen.",
  "Who compounds the unlicensed sprays.",
  "Whether the pricing experiments named in the app bundle show other visitors different prices or offers."
 ],
 "verdict": ("Trustworthy as labelled. Every high-consequence rule I re-tested (ten of them, plus both baselines) gave exactly the recorded result, "
             "and the live catalogue and product pages match the recorded names, strengths and prices. I found no contradicted rule. The errors I found were small: "
             "two stops and one pair rule rested on code or a mixed walk (now observed), one opportunity wrongly said Numan has no topical finasteride, and one "
             "clinical opinion was not labelled. The new finding is that product entry links beat the eligibility flags as well as the allergy flags. "
             "The main limit is structural: the engine's flags are computed on Numan's server and everything after the account wall, including the clinician's final "
             "decision, is unseen, so the report describes what the anonymous quiz offers, not what is finally prescribed.")
}
json.dump(c, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok', len(c['rules']), 'rules', len(c['experiments']), 'experiments', len(c['recommendations']), 'recs')
