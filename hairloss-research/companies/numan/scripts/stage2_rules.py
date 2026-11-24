# Stage 2: option effects, rules, recommendations and summaries from the one-change tests (runs/x2-*).
FIN = ['p-kit-pro', 'p-kit', 'p-combo-kit', 'p-triple-spray', 'p-finasteride']
MIN = ['p-kit-pro', 'p-kit', 'p-combo-kit', 'p-triple-spray', 'p-minoxidil-spray', 'p-regaine']
ALLM = ['p-kit-pro', 'p-kit', 'p-combo-kit', 'p-finasteride', 'p-triple-spray', 'p-minoxidil-spray', 'p-regaine', 'p-rosemary-oil']
FIN_TXT = "finasteride group hidden (all kits, Triple-Action Spray, Finasteride); Extra Strength Spray featured 'Recommended for you' £18.00, Regaine and Rosemary Oil also listed"
MIN_TXT = "minoxidil group hidden (all kits, both sprays, Regaine); Finasteride featured 'Recommended for you' £16.80, Rosemary Oil also listed"
NOCH = "No change to the offer (all eight products, three-part kit featured)"
# (question id, option label prefix) -> (effect, effectType, affects, evidence)
OPT = {
 ('men-what_is_your_age', '65 or over'): ("Adds one confirmation question. If he says Yes, the offer is the same as the baseline (nothing hidden although the API variants say up to 65). Run x2-22.", 'extra-questions', [], 'observed'),
 ('men-what_is_your_age', 'Under 18'): ("Hard stop: 'No suitable treatment', see your doctor or email the clinic. Soft in practice: 'Review your answers' lets him change it.", 'hard-stop', [], 'observed'),
 ('men-sixty_five_and_over_confirmation', 'Yes'): ("Continues. " + NOCH + ". Run x2-22.", 'none', [], 'observed'),
 ('men-which_image_best_matches_your_hair_loss', 'Temples'): ("Continues; no extra question. Pattern is not used to pick a product (Extensive tested in x2-29; Temples assumed the same).", 'none', [], 'inferred'),
 ('men-which_image_best_matches_your_hair_loss', 'Moderate'): ("Continues; no extra question. Pattern is not used to pick a product (Extensive tested in x2-29; Moderate assumed the same).", 'none', [], 'inferred'),
 ('men-which_image_best_matches_your_hair_loss', 'Extensive'): ("Continues; no extra question. " + NOCH + ". Run x2-29.", 'none', [], 'observed'),
 ('men-which_image_best_matches_your_hair_loss', 'Patchy'): ("Stop screen: circular patches may be alopecia areata, see your GP (x2-26). 'Review your answers' goes back and a different answer continues in the same draft (x2-32).", 'hard-stop', [], 'observed'),
 ('men-which_image_best_matches_your_hair_loss', 'Other hair'): ("Adds a free-text description and a clinician note. " + NOCH + ". Run x2-24.", 'flag-for-clinician', [], 'observed'),
 ('men-when_did_you_notice', 'Over the last few'): ("Stop screen: not designed for sudden hair loss, see your GP (x2-25).", 'hard-stop', [], 'observed'),
 ('men-do_you_have_an_allergy_or_intolerance_to_any', 'I am allergic to minoxidil'): ("Adds a reaction text box; sets hasAllergyToMinoxidil. Removes the " + MIN_TXT + ". Run x2-03. Exception: the product named in the entry link stays (x2-20).", 'product-removed', MIN, 'observed'),
 ('men-do_you_have_an_allergy_or_intolerance_to_any', 'I am allergic to finasteride'): ("Adds a reaction text box; sets hasAllergyToFinasteride. Removes the " + FIN_TXT + ". Run x2-02. Exception: the entry product stays (x2-21).", 'product-removed', FIN, 'observed'),
 ('men-do_you_have_an_allergy_or_intolerance_to_any', 'I have a lactose'): ("Adds the lactose tolerance question. Nothing is hidden, even with 'can't tolerate any'. Run x2-18.", 'extra-questions', [], 'observed'),
 ('men-lactose_tolerance', 'I can’t tolerate'): ("Clinician note only ('confirm the request is for a lactose-free treatment'); finasteride tablets stay on offer. Run x2-18.", 'flag-for-clinician', [], 'observed'),
 ('men-lactose_tolerance', 'I can tolerate'): ("Continues; no note. Not replayed alone (the stronger answer changes nothing).", 'none', [], 'inferred'),
 ('men-have_any_scalp_issues', 'Pain, itching'): ("Adds a text box and sets isMinoxidilEligible=false: " + MIN_TXT + ". Run x2-04.", 'product-removed', MIN, 'observed'),
 ('men-have_any_scalp_issues', 'Red rinds'): ("Adds a text box and sets isMinoxidilEligible=false: " + MIN_TXT + ". Run x2-05.", 'product-removed', MIN, 'observed'),
 ('men-have_any_scalp_issues', 'Dandruff'): ("Adds the 'still consider topical?' question. Nothing hidden whatever the answer (x2-06, x2-07).", 'extra-questions', [], 'observed'),
 ('men-have_any_scalp_issues', 'Psoriasis'): ("Adds a text box and a clinician note saying minoxidil is not suitable. Minoxidil is NOT hidden: " + NOCH + ". Run x2-08.", 'flag-for-clinician', [], 'observed'),
 ('men-clarify_dandruff', 'Yes'): (NOCH + ". Run x2-06.", 'none', [], 'observed'),
 ('men-clarify_dandruff', 'No'): ("Clinician note only ('confirm request is not topical'). Sprays stay on offer. Run x2-07.", 'flag-for-clinician', [], 'observed'),
 ('men-are_any_of_the_following_true', 'I have noticed hair loss'): ("Adds a text box and a clinician note. " + NOCH + ". Run x2-19.", 'flag-for-clinician', [], 'observed'),
 ('men-are_any_of_the_following_true', 'I am undergoing PSA'): ("Adds the PSA follow-up. Neither follow-up answer hides anything (x2-09, x2-31).", 'extra-questions', [], 'observed'),
 ('men-are_any_of_the_following_true', 'I have been diagnosed with high'): ("Adds the blood-pressure follow-up and sets isMinoxidilEligible=false whatever the follow-up answer: " + MIN_TXT + ". Runs x2-10, x2-30.", 'product-removed', MIN, 'observed'),
 ('men-are_any_of_the_following_true', 'I have been diagnosed with asthma'): ("Adds the asthma follow-up. Neither answer hides the sprays (x2-11).", 'extra-questions', [], 'observed'),
 ('men-are_any_of_the_following_true', 'I plan on trying'): ("Adds the fertility follow-up. Neither answer hides finasteride (x2-12).", 'extra-questions', [], 'observed'),
 ('men-are_any_of_the_following_true', 'I have previously experienced'): ("Starts the mental-health branch (mood risk, then who manages it, medicines, dose change, suicidal thoughts). With all neutral answers the offer is unchanged (x2-14).", 'extra-questions', [], 'observed'),
 ('men-clarify_psa', 'I understand'): (NOCH + ". Run x2-31.", 'none', [], 'observed'),
 ('men-clarify_psa', 'I do not wish'): ("Recorded only. Finasteride products are NOT hidden: " + NOCH + ". Run x2-09.", 'none', [], 'observed'),
 ('men-clarify_uncontrolled_bp', 'I understand'): ("Minoxidil is still removed (the removal comes from ticking blood pressure): " + MIN_TXT + ". Run x2-30.", 'product-removed', MIN, 'observed'),
 ('men-clarify_uncontrolled_bp', 'I do not wish'): ("Minoxidil removed: " + MIN_TXT + ". Run x2-10. Same as the other answer.", 'product-removed', MIN, 'observed'),
 ('men-clarify_asthma', 'I understand'): ("Not replayed. The opt-out answer changes nothing (x2-11), so this one almost certainly changes nothing either.", 'none', [], 'inferred'),
 ('men-clarify_asthma', 'I do not wish'): ("Recorded only. Sprays and Regaine stay on offer: " + NOCH + ". Run x2-11.", 'none', [], 'observed'),
 ('men-clarify_plan_on_trying_for_baby', 'I would like'): ("Not replayed. The opt-out answer changes nothing (x2-12), so this one almost certainly changes nothing either.", 'none', [], 'inferred'),
 ('men-clarify_plan_on_trying_for_baby', 'I do not wish'): ("Recorded only. Finasteride products stay on offer: " + NOCH + ". Run x2-12.", 'none', [], 'observed'),
 ('men-mood_alterations', 'I accept the risk'): ("Continues to 'who manages your mental health'. Offer unchanged if the rest is neutral (x2-14).", 'next-question', [], 'observed'),
 ('men-mood_alterations', 'I would like to proceed'): ("Skips the rest of the branch and sets isFinasterideEligible=false: " + FIN_TXT + ". Run x2-13.", 'product-removed', FIN, 'observed'),
 ('men-who_manages_your_mental_health', 'Psychiatrist'): ("Skips medicines, dose change and suicidal-thoughts questions; sets isFinasterideEligible=false: " + FIN_TXT + "; clinician note asks for specialist approval. Run x2-15.", 'product-removed', FIN, 'observed'),
 ('men-who_manages_your_mental_health', 'GP'): ("Continues to medicines, dose change and suicidal thoughts. Offer unchanged if neutral (x2-14).", 'extra-questions', [], 'observed'),
 ('men-mental_health_medications_changed_yes_no', 'Yes'): ("Adds a dose-change text box and then SKIPS the suicidal-thoughts question. Clinician note only: " + NOCH + ". Run x2-17.", 'flag-for-clinician', [], 'observed'),
 ('men-mental_health_medications_changed_yes_no', 'No'): ("Continues to the suicidal-thoughts question (x2-14).", 'next-question', [], 'observed'),
 ('men-mental_health_suicidal', 'Yes'): ("No stop and no signposting screen. Sets isFinasterideEligible=false: " + FIN_TXT + ". Run x2-16.", 'product-removed', FIN, 'observed'),
 ('men-mental_health_suicidal', 'No'): ("Continues; clinician note to send the mental-health safety-net message if finasteride is approved. Offer unchanged (x2-14).", 'flag-for-clinician', [], 'observed'),
 ('men-what_is_most_important_when_choosing_product', 'Effectiveness'): ("Baseline answer. No effect on the offer.", 'none', [], 'observed'),
 ('men-what_is_most_important_when_choosing_product', 'Minimal side'): (NOCH + ". Run x2-27.", 'marketing-only', [], 'observed'),
 ('men-what_is_most_important_when_choosing_product', 'Scalp-friendly'): (NOCH + ". Run x2-28.", 'marketing-only', [], 'observed'),
 ('men-what_is_most_important_when_choosing_product', 'All of the above'): ("Not replayed alone; the other three options change nothing and the JS switch it sets is never read.", 'marketing-only', [], 'inferred'),
 ('men-medical_history', 'I have a major'): ("Adds two free-text boxes (conditions, medicines) and a clinician query. " + NOCH + ". Run x2-23.", 'flag-for-clinician', [], 'observed'),
}
SHOWN = {
 'men-mental_health_medications_changed_yes_no': 'who manages = GP (after the medicines text)',
 'men-mental_health_suicidal': 'who manages = GP and dose changed = No (skipped if the dose changed: observed in x2-17)',
 'men-who_manages_your_mental_health': "mood question = accept the finasteride risk (skipped by 'minoxidil only': x2-13)",
}
QUP = {  # question id -> (engineRole, branches, branchDetail)
 'men-have_any_scalp_issues': ('product-selector', True, "Pain/itching and red rinds/rashes each remove all minoxidil products (x2-04, x2-05). Dandruff and psoriasis/eczema add a follow-up but remove nothing (x2-06..08). Each symptom adds its own follow-up."),
 'men-are_any_of_the_following_true': ('product-selector', True, "Blood pressure removes all minoxidil products whatever the follow-up (x2-10, x2-30). Depression opens the mental-health branch, which can remove finasteride. PSA, asthma, baby and body hair add a follow-up but remove nothing (x2-09, x2-11, x2-12, x2-19)."),
 'men-do_you_have_an_allergy_or_intolerance_to_any': ('product-selector', True, "Each drug allergy removes that drug's whole product group (x2-02, x2-03) except an entry-link product (x2-20, x2-21). Lactose adds a question but removes nothing (x2-18)."),
 'men-clarify_psa': ('data-capture', False, "Neither answer changes the offer (x2-09, x2-31); the opt-out is not enforced on screen."),
 'men-clarify_uncontrolled_bp': ('data-capture', False, "Both answers lead to the same result: minoxidil already removed by the blood-pressure tick (x2-10, x2-30)."),
 'men-clarify_asthma': ('data-capture', False, "The opt-out does not hide sprays (x2-11)."),
 'men-clarify_plan_on_trying_for_baby': ('data-capture', False, "The opt-out does not hide finasteride (x2-12)."),
 'men-clarify_dandruff': ('data-capture', False, "Neither answer changes the offer (x2-06, x2-07); 'No' adds a clinician note."),
 'men-mood_alterations': ('product-selector', True, "'Minoxidil only' removes finasteride and skips the rest of the branch (x2-13)."),
 'men-who_manages_your_mental_health': ('product-selector', True, "Specialist removes finasteride and skips three questions (x2-15); GP continues (x2-14)."),
 'men-mental_health_medications_changed_yes_no': ('safety-screen', True, "Yes adds a text box and skips the suicidal-thoughts question (x2-17)."),
 'men-mental_health_suicidal': ('product-selector', False, "Yes removes finasteride, no stop (x2-16)."),
 'men-what_is_most_important_when_choosing_product': ('marketing', False, "No effect on the offer (x2-27, x2-28)."),
 'men-which_image_best_matches_your_hair_loss': ('eligibility-gate', True, "Patchy and Complete stop; Other adds a text box; the other four change nothing (x2-24, x2-26, x2-29)."),
}
RULES = [
 ('R1', 'men', "men-what_is_your_age = 'Under 18'", "Stop screen 'No suitable treatment' (see your doctor; clinic email). 'Review your answers' lets him go back and change it.", 'hard-stop', [], 'observed', 'runs/stop-under18', 'high'),
 ('R2', 'men', "pattern = 'Patchy', or onset = 'Over the last few days or weeks'", "Stop screen 'No suitable treatment' with its own GP message.", 'hard-stop', [], 'observed', 'runs/x2-26-pat-patchy, runs/x2-25-onset-sudden vs runs/x2-01-baseline', 'high'),
 ('R3', 'men', "pattern = 'Complete', or 65+ confirmation = 'No'", "Stop screen (served result 'reject' with its message). Not replayed.", 'hard-stop', [], 'code', 'quiz-definition.json (results of those options)', 'high'),
 ('R4', 'men', "any stop screen, then 'Review your answers' and a different answer", "The consultation carries on in the same draft and reaches the full offer. Stops are not locked.", 'none', [], 'observed', 'runs/x2-32-patchy-review', 'high'),
 ('R5', 'men', "allergy = 'I am allergic to finasteride'", "All finasteride products are hidden (three kits, Triple-Action Spray, Finasteride). Extra Strength Spray is featured as 'Recommended for you' (£18.00); Regaine and Rosemary Oil remain.", 'product-removed', FIN, 'observed', 'runs/x2-02-al-fin vs runs/x2-01-baseline', 'high'),
 ('R6', 'men', "allergy = 'I am allergic to minoxidil'", "All minoxidil products are hidden (three kits, both sprays, Regaine). Finasteride is featured as 'Recommended for you' (£16.80); Rosemary Oil remains.", 'product-removed', MIN, 'observed', 'runs/x2-03-al-min vs runs/x2-01-baseline', 'high'),
 ('R7', 'men', "scalp = 'Pain, itching, burning or bumps' or 'Red rinds or rashes' (either alone)", "isMinoxidilEligible becomes false: all minoxidil products hidden, Finasteride featured, Rosemary Oil remains.", 'product-removed', MIN, 'observed', 'runs/x2-04-sc-pain, runs/x2-05-sc-red', 'high'),
 ('R8', 'men', "scalp = 'Psoriasis or eczema' (alone)", "Nothing is hidden. Only a clinician note says minoxidil is unsuitable. The full offer, including minoxidil kits, is shown.", 'flag-for-clinician', [], 'observed', 'runs/x2-08-sc-pso', 'high'),
 ('R9', 'men', "scalp = 'Dandruff' (either follow-up answer)", "Nothing is hidden, even when he says he does not want a topical treatment; 'No' adds a clinician note.", 'flag-for-clinician', [], 'observed', 'runs/x2-06-sc-dan-yes, runs/x2-07-sc-dan-no', 'high'),
 ('R10', 'men', "cautions = high or low blood pressure (either follow-up answer)", "isMinoxidilEligible becomes false: all minoxidil products hidden, Finasteride featured. Saying he wants to be considered for minoxidil does not bring it back.", 'product-removed', MIN, 'observed', 'runs/x2-10-c-bp-no, runs/x2-30-c-bp-yes', 'high'),
 ('R11', 'men', "the 'I do not wish to be considered' answer on PSA, asthma or trying for a baby", "Nothing is hidden. The opted-out drug or form stays on the screen and the kits stay featured. Only the blood-pressure opt-out is enforced (and that one by the tick itself).", 'none', [], 'observed', 'runs/x2-09-c-psa-no, runs/x2-11-c-ast-no, runs/x2-12-c-baby-no', 'high'),
 ('R12', 'men', "depression/anxiety, then mood answer = 'minoxidil only'", "The rest of the mental-health branch is skipped and all finasteride products are hidden; Extra Strength Spray featured.", 'product-removed', FIN, 'observed', 'runs/x2-13-dep-minonly', 'high'),
 ('R13', 'men', "who manages mental health = 'Psychiatrist/Specialist/Consultant'", "All finasteride products hidden; medicines, dose change and suicidal-thoughts questions skipped; clinician note asks for specialist approval.", 'product-removed', FIN, 'observed', 'runs/x2-15-dep-spec', 'high'),
 ('R14', 'men', "suicidal thoughts or self-harm in the past year = 'Yes'", "No stop and no crisis signposting screen. All finasteride products hidden; minoxidil products still offered.", 'product-removed', FIN, 'observed', 'runs/x2-16-dep-suic', 'high'),
 ('R15', 'men', "mental-health medicine dose changed in the last 3 months = 'Yes'", "A text box is added and the suicidal-thoughts question is skipped. Nothing is hidden (clinician note only).", 'skip-questions', [], 'observed', 'runs/x2-17-dep-dose vs runs/x2-14-dep-gp', 'high'),
 ('R16', 'men', "depression/anxiety with GP management, stable doses and no suicidal thoughts", "Five extra questions, offer unchanged; clinician note to send a mental-health safety-net message if finasteride is approved.", 'extra-questions', [], 'observed', 'runs/x2-14-dep-gp', 'high'),
 ('R17', 'men', "lactose = 'can't tolerate any amount'", "Nothing is hidden; finasteride tablets (which contain lactose) stay on offer. Clinician note only.", 'flag-for-clinician', [], 'observed', 'runs/x2-18-al-lac-none', 'high'),
 ('R18', 'men-product-entry', "entry link names a product (/subscribe/hair-loss/<product>) and the patient is allergic to its drug", "That product is still featured (badge drops to 'Most effective'); the rest of the drug's group is hidden. The entry product escapes the safety filter.", 'none', ['p-regaine', 'p-finasteride'], 'observed', 'runs/x2-20-regaine-almin, runs/x2-21-fin-entry-alfin', 'high'),
 ('R19', 'men-product-entry', "entry link names a product, nothing ruled out", "That product is featured 'Recommended for you'; the kits move under 'See all treatments'. Product links carry no first-order code, so prices are full price (Regaine £65.00, Finasteride £28.00).", 'product-switched', ['p-regaine'], 'observed', 'runs/entry-regaine-baseline, runs/x2-20-regaine-almin', 'high'),
 ('R20', 'men', "nothing ruled out (baseline)", "Three-part kit featured 'Most effective' £26.67/month (quarterly variant, first-order code); seven others under 'See all treatments'; six-monthly plan pre-selected; £176.00 at the wall.", 'none', ALLM, 'observed', 'runs/x2-00-baseline-full, runs/x2-01-baseline', 'high'),
 ('R21', 'men', "both drugs ruled out (any finasteride rule plus any minoxidil rule)", "Only Rosemary Oil is offered, badged 'Most effective'; no stop or 'unable to treat' message.", 'product-removed', FIN + ['p-minoxidil-spray', 'p-regaine'], 'observed', 'runs/s2-men-explore', 'medium'),
 ('R22', 'men', "age 65 or over (confirmed Yes), pattern Extensive or Other, body hair loss, 'most important' answers, or 'I have' a medical history", "No product change. Extra text boxes where relevant, read by a clinician after checkout.", 'none', [], 'observed', 'runs/x2-22, x2-24, x2-29, x2-19, x2-27, x2-28, x2-23', 'high'),
 ('R23', 'men', "a free-text answer or any option with a 'query_clinically' result", "The order is flagged for the reviewing clinician (written instruction in the served data). The final decision is made after checkout, not by the quiz.", 'flag-for-clinician', [], 'code', 'quiz-definition.json; runs/s2-men-explore net replies', 'medium'),
]

def apply(c):
    f = c['flows'][0]
    for q in f['questions']:
        for o in q['options']:
            for (qid, pre), v in OPT.items():
                if q['id'] == qid and (o['label'] == pre or (len(pre) >= 9 and o['label'].startswith(pre))):
                    o['effect'], o['effectType'], o['affects'], o['evidence'] = v
        if q['id'] in QUP:
            q['engineRole'], q['branches'], q['branchDetail'] = QUP[q['id']]
        if q['id'] in SHOWN: q['shownWhen'] = SHOWN[q['id']]
        if q['id'] in ('men-tell_us_which_reactions_from_this_medicine',):
            q['shownWhen'] = 'minoxidil and/or finasteride allergy ticked (seen with each alone: x2-02, x2-03)'
    c['rules'] = [dict(id=i, flow=fl, when=w, then=t, effectType=e, affects=a, evidence=ev, proof=p, confidence=cf) for i, fl, w, t, e, a, ev, p, cf in RULES]
    import stage2_text as T; T.apply(c)
