#!/usr/bin/env python3
"""s3_text.py — stage 3 (VERIFY) layer for s2_apply.py.

s2_apply.py merges the small tables below into the stage 2 tables, then calls apply(D, ctx) last.
apply() makes the stage 3 corrections (evidence labels, effect types, proofs), adds the stage 3 proofs to the rules
it re-tested, and writes the 'verification' block. Every claim here points at a runs/verify-* folder or a saved source.
"""

VISTEXT = {
 'verify-m-age-17': "hard stop after the eligibility screen: 'We're unable to treat you at this time... we're unable to treat your age group.' No bag is shown",
 'verify-w-age-17': "hard stop after the eligibility screen: 'We're unable to treat you at this time... we're unable to treat your age group.' No bag is shown",
 'verify-w-pg-yes': "one extra screen, 'Pregnancy safety information' (must-tick to carry on). Nothing else changed: same later questions and the same £34.99 bag",
 'verify-m-bp-elevated-reading': "one extra screen, the blood-pressure follow-up. 'Often elevated' with a typed reading of 180/110 gave no warning and no stop; the next screen was the allergy question and the bag was the same £34.99",
 'verify-w-mcf-bp': "one extra screen, the blood-pressure follow-up ('Well-controlled' chosen). Same later questions and the same £34.99 bag",
 'verify-w-pt-yes': "on the treatment-type screen The Capsules carries a second badge, 'Better for pet owners'. Same later questions and the same £34.99 bag",
 'verify-m-gender-nonbinary': "the men's 'You're not alone' screen is skipped. Same questions otherwise and the same £34.99 bag",
 'verify-m-gender-woman': "the men's 'You're not alone' screen is skipped. Same questions otherwise and the same £34.99 bag",
 'verify-w-entry-promo-drops': "same questions; the bag shows £14.99 instead of £34.99 with promo code HGSHOPDROPS and the text 'Your first three months of treatment for £14.99 each' / 'First three months £14.99 each, then £34.99 ongoing. Cancel anytime. Treatment subject to dermatological assessment.'",
}
RESULT = {}
NOTE = {}
DOC = {}
OPT_FIXED = {
 ('men-pds-gender', 'Woman/Girl'): ("One-change replay (runs/verify-m-gender-woman, stage 3): the men's 'You're not alone' screen is skipped. Same questions otherwise and the same £34.99 bag.", 'skip-questions', [], 'observed'),
 ('men-pds-gender', 'Non-Binary/Genderqueer/Agender/Gender Fluid'): ("One-change replay (runs/verify-m-gender-nonbinary, stage 3; first seen in the stage 1 scout runs/scout-neither): the men's 'You're not alone' screen is skipped. Same questions otherwise and the same £34.99 bag.", 'skip-questions', [], 'observed'),
 ('women-pds-gender', 'Man/Boy'): ("One-change replay (runs/verify-w-gender-man, stage 3): nothing a visitor can see changed. The women's route, the pregnancy question and the £34.99 bag are the same; the women's route has no 'You're not alone' screen to skip.", 'none', [], 'observed'),
}
Q = {}
S1_NOTE = {}

RETESTED = {  # rule id -> stage 3 runs that re-tested it
 'R4': ['verify-m-age-17', 'verify-w-age-17'],
 'R8': ['verify-m-bp-elevated-reading', 'verify-w-mcf-bp'],
 'R9': ['verify-m-bp-elevated-reading'],
 'R10': ['verify-w-pg-yes'],
 'R12': ['verify-w-pt-yes'],
 'R13': ['verify-w-htp-spiro', 'verify-m-group-medical'],
 'R15': ['verify-w-htaf-receding', 'verify-w-htaf-dontknow'],
 'R16': ['verify-m-group-medical', 'verify-w-group-medical'],
 'R17': ['verify-m-mcm-heart', 'verify-m-group-medical'],
 'R18': ['verify-w-group-medical'],
 'R19': ['verify-m-al-minoxidil', 'verify-m-mdm-bph', 'verify-m-group-medical'],
 'R21': ['verify-m-pp-decline'],
 'R23': ['verify-m-gender-nonbinary', 'verify-m-gender-woman'],
 'R24': ['verify-w-gender-man'],
 'R25': ['verify-base-men', 'verify-base-women'],
 'R26': ['verify-w-entry-promo-drops'],
}

NOT_OBSERVABLE = ('flag-for-clinician', 'product-removed', 'product-switched', 'product-added', 'strength-changed')


def apply(D, ctx):
    runs = ctx['runs']
    have = lambda r: r in runs
    rules = {r['id']: r for r in D['rules']}
    corrected = []

    # 1. add stage 3 proof to the re-tested rules
    for rid, rs in RETESTED.items():
        r = rules.get(rid)
        rs = [x for x in rs if have(x)]
        if r and rs:
            r['proof'] = r['proof'] + ' ; stage 3 re-test: ' + ', '.join('runs/' + x for x in rs)

    # 2. evidence / effect-type corrections on rules
    def fix(rid, **kw):
        r = rules[rid]
        r.update({k: v for k, v in kw.items() if k != 'add'})
        if kw.get('add'): r['then'] = r['then'] + ' ' + kw['add']
    for rid in ('R9', 'R16', 'R17', 'R19'):
        fix(rid, effectType='none',
            add="(Stage 3: effect type changed from 'flag-for-clinician' to 'none'. What a replay can show is that nothing changes; that the prescriber acts on the answer is the company's own leaflet rule, kept as a separate docs rule, not something observed.)")
    corrected.append("R9, R16, R17, R19: effect type 'flag-for-clinician' with evidence 'observed' changed to 'none' (observed). A replay can only show that nothing visible happens; the prescriber's use of the answer is docs (R30 to R33), not observed.")
    fix('R20', effectType='none',
        add="(Stage 3: effect type changed from 'product-switched' to 'none'. No switch was seen; the company says the Dermatology Team makes the final choice, rule R37.)")
    corrected.append("R20 (Drops instead of Capsules): 'product-switched' with evidence 'observed' changed to 'none'. The replays show no switch; that the preference steers the formula is docs (R37), not observed.")
    fix('R21', evidence='inferred', confidence='medium',
        add="(Stage 3: evidence changed from 'observed' to 'inferred'. Only 'nothing visible' was observed, again in runs/verify-m-pp-decline; the removal comes from the option's own wording.)")
    corrected.append("R21 (declines finasteride / dutasteride): evidence 'observed' changed to 'inferred'. The replays (s2 and runs/verify-m-pp-decline) show nothing visible; the removal of finasteride and dutasteride formulas is read from the option wording, never seen in a prescription.")
    fix('R39', evidence='inferred')
    fix('R40', evidence='inferred')
    corrected.append("R39 and R40: evidence 'docs' changed to 'inferred'. The company's articles say finasteride is first-line and topical minoxidil suits PCOS, but linking those statements to particular questionnaire answers and formulas is the investigator's reasoning (both rules already said 'inferred' in their text).")
    if have('verify-w-entry-promo-drops'):
        fix('R26', flow='both', when="entry through a product page (promo code HGSHOPCAPS from The Capsules page or HGSHOPDROPS from The Drops page)",
            then="Same questions; the bag shows £14.99 instead of £34.99: 'Your first three months of treatment for £14.99 each', then £34.99 ongoing. Same offer for both codes, on the men's (capsules code) and women's (drops code) routes. Price depends on how you arrive, not on what you answer.")
        rules['R26']['proof'] = "runs/entry-promo-caps-men against runs/baseline-men ; runs/verify-w-entry-promo-drops against the women's baseline pool (stage 3)"
        corrected.append("R26 (promo entry): the drops code was only read on the product page in stage 2; runs/verify-w-entry-promo-drops replayed it (women's answers) and it gives the same £14.99 offer. Flow widened from 'men' to 'both'.")
    if 'R4' in rules and have('verify-w-age-17'):
        rules['R4']['then'] = rules['R4']['then'] + " Stage 3 confirmed it on the women's route as a single change (runs/verify-w-age-17)."
    if 'R23' in rules:
        rules['R23']['when'] = rules['R23']['when'].replace('Transwoman/Transgirl, Non-Binary or Prefer not to say', 'Transwoman/Transgirl, Woman/Girl, Non-Binary or Prefer not to say')
        corrected.append("R23 ('You're not alone' skipped): Woman/Girl added to the gender identity values that skip the screen (runs/verify-m-gender-woman); Non-Binary re-confirmed as a single change (runs/verify-m-gender-nonbinary).")

    # 3. options: an effect that cannot be seen in a replay must not carry 'observed'
    n_fix = 0
    for f in D['flows']:
        for q in f['questions']:
            for o in q['options']:
                if o.get('evidence') == 'observed' and o.get('effectType') in NOT_OBSERVABLE:
                    if q['id'].endswith('pds-sex'):
                        o['effectType'] = 'extra-questions'
                        o['effect'] += " (Stage 3: the route swap is observed; the removal of finasteride and dutasteride for women is docs, from the oral leaflet.)"
                    else:
                        o['evidence'] = 'inferred'
                    n_fix += 1
    if n_fix:
        corrected.append(f"{n_fix} option(s) on the sex-at-birth question ('Female') were typed 'product-removed' with evidence 'observed'. The route swap is observed but the product removal is only in the leaflet, so the type is now 'extra-questions' (as for 'Male') and the removal is noted as docs.")

    # 4. vitamins: where the amounts come from
    for p in D['products']:
        if p['id'] == 'vit':
            p['evidence'] = 'code'
            p['note'] = ("Stage 3: the support article 619143 (re-read 23 Nov 2026, src/verify/) lists only the raw ingredients, with no amounts, and also names vitamin B12. "
                         "The amounts per dose come only from the site code (src/nxt/the-vitamins-*.js, 'Full ingredients'), which does not list B12. The two company sources disagree on B12.")
    corrected.append("The Vitamins: the per-dose amounts are from site code only (src/nxt/the-vitamins-*.js); the live ingredients article gives no amounts and also lists vitamin B12, which the code list lacks. Noted on the product; label stays 'code'.")

    D['stage'] = 'final (stage 3 of 3: verified)'
    D['access']['coverageNote'] = D['access'].get('coverageNote', '') + (
        f" Stage 3 (verify): {ctx['N_S3']} more replays ({ctx['N_S3_BASE']} baselines, {ctx['N_S3_OC']} one-change, 2 medical group tests), all one at a time; "
        "the stop, blood-pressure, pregnancy, gender-identity, pets, previous-product and promo rules were re-tested live (two goals, no hair loss and the 'Other' free-text boxes were not), and the 16 formulas and the price were re-checked against the live leaflets.")

    D['verification'] = {
        'checked': [
            "Baselines replayed fresh (runs/verify-base-men, runs/verify-base-women): both end at the account wall 'Personalise your account' with the same one-line bag: 'Prescription · Personalised treatment · 4 week supply · 12ml', £34.99, free shipping. No new or missing screens against the baseline pool. Matches the record.",
            "Under-18 hard stop (R4): confirmed on the men's route (runs/verify-m-age-17) and, for the first time as a single change, on the women's route (runs/verify-w-age-17). 17 years 11 months gives 'We're unable to treat you at this time'.",
            "Pregnancy Yes (R10): confirmed (runs/verify-w-pg-yes): only the extra 'Pregnancy safety information' screen; not turned away; same bag.",
            "Heart condition does not stop or change anything (R17): confirmed (runs/verify-m-mcm-heart).",
            "Declining finasteride / dutasteride changes nothing visible (R21): confirmed (runs/verify-m-pp-decline).",
            "Minoxidil allergy with The Capsules chosen changes nothing visible (R19): confirmed (runs/verify-m-al-minoxidil). BPH medicine alone: also nothing (runs/verify-m-mdm-bph, new).",
            "Blood-pressure follow-up (R8, R9): confirmed on both routes. 'Often elevated' with a typed 180/110 gives no warning or stop (runs/verify-m-bp-elevated-reading); 'Well-controlled' tested for the first time on the women's route (runs/verify-w-mcf-bp).",
            "Gender identity skips the men's 'You're not alone' screen (R23): confirmed with two more values, Non-Binary and Woman/Girl (runs/verify-m-gender-nonbinary, runs/verify-m-gender-woman). On the women's route Man/Boy changes nothing (runs/verify-w-gender-man, new; R24).",
            "Pets Yes adds the 'Better for pet owners' badge (R12): confirmed on the women's route (runs/verify-w-pt-yes).",
            "Promo entry (R26): the drops code HGSHOPDROPS replayed for the first time (runs/verify-w-entry-promo-drops): £14.99 for the first three months, then £34.99; same questions.",
            "Women's options never tested before: 'receding hairline' and 'I don't know what kind of hair loss I have' change nothing (runs/verify-w-htaf-receding, runs/verify-w-htaf-dontknow). Spironolactone as a previous product only adds the must-tick box (runs/verify-w-htp-spiro).",
            "Medical tick-boxes only seen in stage 1 scouts, now in two group tests (runs/verify-m-group-medical, runs/verify-w-group-medical): five previous products, every scalp symptom, scalp steroids, phaeochromocytoma, hypertrichosis, PoTS and allergy to all eight actives. No new or missing screen, no stop, same bag.",
            "Products: the price (£34.99 every four weeks, article 254006) and all 16 formulas with their strengths and dosing (6 capsules in 254164; 6 medicated drops in 254578; 4 niacinamide drops in 258568) match the live support articles re-read on 23 Nov 2026 (saved in src/verify/).",
            "Live product pages (runs/verify-pages): The Capsules, The Drops and The Drops alcohol-free minoxidil page all show '£14.99' against '£34.99'. /products/the-vitamins loads with no title or price (no public product page), so the vitamins price stays unknown.",
            "Second consultation named in the code ('sign-up-hair-supplements', short name suhs): opening /c/suhs/new as a visitor redirects to the login page (runs/verify-suhs-explore-0; the API answered 401 'Missing cookie'). So the supplements consultation sits behind the account wall. Nothing was typed.",
            "Every run folder cited in this file exists.",
        ],
        'corrected': corrected,
        'stillUnverified': [
            "Everything after the account wall: which of the 16 formulas, which strength and which plan any patient gets. All 'recommendedWhen' text and rules R28 to R42 are docs or inferred, never seen.",
            "Whether the prescriber really applies the leaflet contraindications to questionnaire answers (heart disease, prostate disease, scalp disease, allergies, pregnancy). The questionnaire itself never acts on them.",
            "The stage 2 rules not re-run in stage 3 (for example R6 two goals, R7 no hair loss, R14 'Other' free-text box, R22 the non-medical group tests, R27 server randomness) rest on stage 2 runs only. Their run folders exist and their diffs were not re-read line by line.",
            "The Vitamins price and the exact vitamin list (B12 in the article, not in the code).",
            "Third-party statements (Trustpilot, press) were read through web search summaries and were not re-checked.",
        ],
        'verdict': ("For the part anyone can see, this report is trustworthy. Two fresh baselines and 19 more replays in stage 3 reproduced every "
                    "visible rule that was re-tested: the only stop is age under 18, a few answers add or skip one screen or add a badge, the promo links lower the "
                    "first price, and the bag is always the same unnamed £34.99 'Personalised treatment'. No claim was contradicted. The corrections were about labels: "
                    "a few rules and one option said 'observed' for something no replay can see (a prescriber's decision, a product removal or switch), and these "
                    "now say 'none', 'docs' or 'inferred'. The product catalogue matches the live leaflets. The weak part is the real decision, "
                    "which a pharmacist prescriber makes after sign-up and payment: what is said about who gets which formula comes from the company's leaflets and "
                    "articles and from reasoning, so treat it as likely, not proven."),
    }
