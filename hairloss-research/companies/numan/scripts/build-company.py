#!/usr/bin/env python3
"""Build company.json for Numan (stage 1, MAP).

Question and option wording is copied by this script from quiz-definition.json (which build-quiz-definition.py
makes from the API responses the site served), so nothing is retyped by hand. What is hand-written here:
the product list, the plain-language effect of each option, rules, and the commentary.
Run from anywhere:  python3 -I scripts/build-company.py   then   node ../../tools/validate.js numan --stage map
"""
import json, os, re, html
base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QD = json.load(open(os.path.join(base, 'quiz-definition.json'), encoding='utf8'))
QS = {q['id']: q for q in QD['questions']}
DEF = 'quiz-definition.json (from api.numan.com /v1/subscriptions/<id>, questionnaire_with_responses)'

def plain(s):
    s = re.sub(r'(?i)</li>\s*', '; ', s or '')
    s = re.sub(r'(?i)<br\s*/?>|</br>|<ul>|</ul>', ' ', s)
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s)
    s = re.sub(r'\s+', ' ', s).strip()
    s = re.sub(r'\s*;\s*$', '', s)
    s = s.replace(' ;', ';').replace('; This information is needed', '. This information is needed')
    return s

FIN = ['p-kit-pro', 'p-kit', 'p-combo-kit', 'p-triple-spray', 'p-finasteride']                      # hidden when finasteride is ruled out
MIN = ['p-kit-pro', 'p-kit', 'p-combo-kit', 'p-triple-spray', 'p-minoxidil-spray', 'p-regaine']    # hidden when minoxidil is ruled out
ALLP = ['p-kit-pro', 'p-kit', 'p-combo-kit', 'p-finasteride', 'p-triple-spray', 'p-minoxidil-spray', 'p-regaine', 'p-rosemary-oil']
PROMO = ("First-order code HL-ORGANIC-50OFF (in the site's own 'Get started' links): the banner says 'Save 50% off your first order (max. £40)'; "
         "the pricing call (www.numan.com/bff/pricing) returned discount 40 (percentage), maxDiscountAmount 4000 pence, and the amounts shown match 40% off capped at £40.")

products = [
 {"id": "p-kit-pro", "name": "Hair Kit - Medicated Spray, Finasteride & Supplement (code: complete-hair-kit-pro)", "category": "bundle",
  "actives": [{"name": "minoxidil (Extra Strength / 'Medicated' Spray)", "strength": "6% scalp solution, 1 ml (6 sprays) twice a day"},
              {"name": "finasteride", "strength": "1 mg tablet once a day"},
              {"name": "Hair Growth Support supplement", "strength": "vitamin A 1000 µg, vitamin C 80 mg, vitamin E 10.2 mg, biotin 200 µg, selenium 55 µg, grape seed extract 50 mg; 1 tablet a day"}],
  "form": "kit: spray bottle + tablets + supplement tablets", "audience": "men",
  "legalStatus": "Prescription kit. Finasteride 1 mg tablets: licensed POM. Minoxidil 6% spray: POM, unlicensed medicine (Numan's help centre says so; who makes it is not stated). Supplement: food supplement.",
  "price": "£40 a month, billed and delivered quarterly (£120 for 3 kits)",
  "priceDetail": "Billed six-monthly £36 a month (£216 per 6 months), billed annually £32 a month; all still delivered every 3 months (observed on the billing screen). A monthly-delivery variant exists in the API at £48 a kit. " + PROMO + " With it the selection screen showed £26.67 a month, 'Save 33%'.",
  "url": "https://www.numan.com/subscribe/hair-loss",
  "recommendedWhen": "Featured as 'Most effective' whenever neither finasteride nor minoxidil has been ruled out and the patient did not arrive through a product-specific link (observed for the baseline man; rule read in the product-selection JS). Hidden if either drug is ruled out.",
  "evidence": "observed"},
 {"id": "p-kit", "name": "Hair Kit - Medicated Spray & Finasteride (code: complete-hair-kit)", "category": "bundle",
  "actives": [{"name": "minoxidil (Extra Strength / 'Medicated' Spray)", "strength": "6% scalp solution, 1 ml twice a day"}, {"name": "finasteride", "strength": "1 mg tablet once a day"}],
  "form": "kit: spray bottle + tablets", "audience": "men",
  "legalStatus": "Prescription kit. Finasteride 1 mg: licensed POM. Minoxidil 6% spray: POM, unlicensed medicine.",
  "price": "£36 a month, billed and delivered quarterly (£108 for 3 kits)",
  "priceDetail": "From the variant data in the API (not seen on a billing screen): six-monthly billing £32 a month, annual £28 a month; monthly-delivery variant £44 a kit. " + PROMO + " With it the selection screen showed £22.67 (was £36.00), 'Save 37%'. The API marks this product as the category's default product.",
  "url": "https://www.numan.com/subscribe/hair-loss",
  "recommendedWhen": "Listed under 'See all treatments' for the baseline man. The JS features it only if the three-part kit is not on offer but this one is; hidden if either drug is ruled out.",
  "evidence": "observed"},
 {"id": "p-combo-kit", "name": "Hair Kit - Combination Spray & Supplement (code: hassle-free-hair-kit)", "category": "bundle",
  "actives": [{"name": "minoxidil", "strength": "10%"}, {"name": "azelaic acid", "strength": "5%"}, {"name": "finasteride (topical)", "strength": "0.1%"},
              {"name": "Hair Growth Support supplement", "strength": "1 tablet a day"}],
  "form": "kit: one combined scalp spray (1 ml once a day) + supplement tablets", "audience": "men",
  "legalStatus": "Prescription kit. Combination (Triple-Action) Spray: POM, unlicensed medicine (help centre). Supplement: food supplement.",
  "price": "£40 a month, billed and delivered quarterly (£120 for 3 kits)",
  "priceDetail": "From the API variant data: six-monthly £36 a month, annual £32 a month; monthly-delivery variant £48. " + PROMO + " Selection screen showed £26.67 (was £40.00), 'Save 33%'.",
  "url": "https://www.numan.com/subscribe/hair-loss",
  "recommendedWhen": "Listed under 'See all treatments' for the baseline man; hidden if either finasteride or minoxidil is ruled out (JS).",
  "evidence": "observed"},
 {"id": "p-finasteride", "name": "Finasteride 1 mg tablets (code: finasteride)", "category": "rx-oral",
  "actives": [{"name": "finasteride", "strength": "1 mg"}], "form": "tablet, one a day (packs of 28; 84 for a quarter)", "audience": "men",
  "legalStatus": "POM, licensed generic (Numan describes it as the generic of Propecia). Tablets contain lactose.",
  "price": "£28 a month, billed and delivered quarterly (84 tablets for £84 = £1.00 a tablet)",
  "priceDetail": "From the API variant data: six-monthly £24 a month, annual £20 a month; monthly variant 28 tablets £34 (£1.21 a tablet). " + PROMO + " Selection screen showed £16.80 (was £28.00), 'Save 40%'. Marketing pages say 'From £1.00 / tablet'.",
  "url": "https://www.numan.com/hair-loss/finasteride",
  "recommendedWhen": "Listed under 'See all treatments' for the baseline man. By the JS it becomes the featured product when minoxidil is ruled out but finasteride is not (first remaining product by position); hidden when finasteride is ruled out. Not yet observed alone.",
  "evidence": "observed"},
 {"id": "p-triple-spray", "name": "Triple-Action Spray, also called Combination Spray (code: triple-action-spray)", "category": "rx-topical-compounded",
  "actives": [{"name": "minoxidil", "strength": "10%"}, {"name": "azelaic acid", "strength": "5%"}, {"name": "finasteride", "strength": "0.1%"}],
  "form": "scalp solution spray, 6 sprays (1 ml) once a day", "audience": "men",
  "legalStatus": "POM, unlicensed medicine (help centre: 'Combination Spray is an unlicensed medication').",
  "price": "£36 a month, billed and delivered quarterly (£108 for 3 bottles)",
  "priceDetail": "From the API variant data: six-monthly £32 a month, annual £28 a month; monthly variant £44 a bottle. " + PROMO + " Selection screen showed £22.67 (was £36.00), 'Save 37%'.",
  "url": "https://help.numan.com/en/articles/9929731-combination-spray",
  "recommendedWhen": "Listed under 'See all treatments' for the baseline man; hidden if either finasteride or minoxidil is ruled out (JS).",
  "evidence": "observed"},
 {"id": "p-minoxidil-spray", "name": "Extra Strength Spray, called 'Medicated Spray' inside kits (code: minoxidil)", "category": "rx-topical-compounded",
  "actives": [{"name": "minoxidil", "strength": "6%"}], "form": "scalp solution spray, 6 sprays (1 ml) twice a day", "audience": "men",
  "legalStatus": "POM, unlicensed medicine (help centre: 'Minoxidil (6%) is an unlicensed medication'). The marketing page /hair-loss/minoxidil says licensed minoxidil is 2% and 5% and that 6% needs a clinician.",
  "price": "£30 a month, billed and delivered quarterly (£90 for 3 bottles)",
  "priceDetail": "From the API variant data: six-monthly £26 a month, annual £22 a month; monthly variant £38 a bottle. " + PROMO + " Selection screen showed £18.00 (was £30.00), 'Save 40%'. Marketing: 'Hair loss plan with minoxidil, from £30.00 / bottle'.",
  "url": "https://www.numan.com/hair-loss/minoxidil",
  "recommendedWhen": "Listed under 'See all treatments' for the baseline man. By the JS it becomes the featured product when finasteride is ruled out but minoxidil is not; hidden when minoxidil is ruled out. Not yet observed alone.",
  "evidence": "observed"},
 {"id": "p-regaine", "name": "Regaine for Men Extra Strength 5% (code: regaine)", "category": "otc-medicine",
  "actives": [{"name": "minoxidil", "strength": "5% (50 mg/ml)"}],
  "form": "scalp solution with three applicators, 1 ml twice a day (API variant name '5% (60ml)'; the help article says 50 ml a bottle; the hair-loss landing page calls it 'branded minoxidil foam')",
  "audience": "men",
  "legalStatus": "Licensed branded medicine that does not need a prescription (Numan's minoxidil page calls the licensed strengths 'pharmacy medicines'). Numan still sells it only through the consultation (API: prescription_required true, questionnaire_required true).",
  "price": "£65 a month, billed and delivered quarterly (£195 for 3 bottles)",
  "priceDetail": "Six-monthly £57 a month (£342 per 6 months), annual £48 a month (observed on the billing screen in the Regaine run); monthly variant £80 a bottle. " + PROMO + " Selection screen showed £51.67 (was £65.00), 'Save 21%'.",
  "url": "https://www.numan.com/hair-loss/regaine",
  "recommendedWhen": "Featured as 'Recommended for you' when the patient arrives through /subscribe/hair-loss/regaine (observed); otherwise under 'See all treatments'. Hidden when minoxidil is ruled out, unless it was the entry product (JS).",
  "evidence": "observed"},
 {"id": "p-rosemary-oil", "name": "Rosemary Oil (code: rosemary-oil)", "category": "cosmetic",
  "actives": [{"name": "rosemary leaf oil with argan, sweet almond, flaxseed, castor seed and avocado oils", "strength": "100 ml bottle, 10-12 drops a day"}],
  "form": "scalp oil with pipette", "audience": "both",
  "legalStatus": "Cosmetic (API: medicine false, prescription_required false, questionnaire_required false; age 18-70, any sex).",
  "price": "£28 a bottle a month; or 3 bottles every 3 months for £70 (£23.33 a month)",
  "priceDetail": "Direct 'Buy now' link uses code HL-ROSEMARY-50OFF: first bottle £14 (observed order summary). Inside the consultation it showed £14.00 (was £23.33), 'Save 40%'. Also offered as an add-on at £21.00 (was £28.00).",
  "url": "https://www.numan.com/hair-loss/rosemary-oil",
  "recommendedWhen": "Always offered. It is in neither hide-list in the JS, so it is the only product left (and is then badged 'Most effective') when both finasteride and minoxidil are ruled out (observed in runs/s2-men-explore). Can be bought directly with no questions.",
  "evidence": "observed"},
 {"id": "p-hair-support", "name": "Hair Growth Support / Hair Support supplement (code: hair-growth-support, supplements category)", "category": "supplement",
  "actives": [{"name": "vitamin A", "strength": "1000 µg"}, {"name": "vitamin C", "strength": "80 mg"}, {"name": "vitamin E", "strength": "10.2 mg"}, {"name": "biotin", "strength": "200 µg"},
              {"name": "selenium", "strength": "55 µg"}, {"name": "grape seed extract", "strength": "50 mg"}],
  "form": "tablet, one a day", "audience": "both",
  "legalStatus": "Food supplement (no questionnaire, no prescription). Contains vitamin A: not for anyone pregnant, likely to become pregnant or breastfeeding. Not suitable for vegetarians or vegans.",
  "price": "£28 a bottle a month",
  "priceDetail": "Every 3 months £59 (£19.67 a month), every 6 months £100 (£16.67 a month), every 12 months £152 (£12.67 a month) (observed shipping-frequency screen; matches API). Code SUPP-ORGANIC-50OFF halves the first order (£14). As an add-on in the hair-loss flow: £18.76 first order (was £28.00). The hair-loss landing page shows 'From £12.66 £9.34 / bottle' on its card.",
  "url": "https://www.numan.com/supplements/hair-support",
  "recommendedWhen": "Not chosen by the consultation. Sold on its own (straight to checkout), inside two of the kits, and as the first 'Most popular' add-on after billing.",
  "evidence": "observed"},
]

def opt(label, effect, etype, affects=None, ev='code'):
    return {"label": label, "effect": effect, "effectType": etype, "affects": affects or [], "evidence": ev}

# Hand-written effect of each option, keyed by question id then option id.  (effect, type, affects, evidence)
E = {
 'what_is_your_age': {
   'sixtyfive_and_over': ("Adds one extra question asking whether he still wants to be considered (see next question). No stop on its own.", 'extra-questions', [], 'observed'),
   'eighteen_to_sixtyfive': ("Goes on to the hair-loss pattern question.", 'next-question', [], 'observed'),
   'under_eighteen': ("Stops the consultation. Screen 'No suitable treatment': \"The safety of our patients is our top priority. Unfortunately, as hair loss under the age of 18 could be a sign of an underlying condition, we’re unable to recommend a hair loss treatment for you. Please contact your doctor for advice.\" plus an invitation to email clinic@numan.com, a 'Review your answers' button and 'Back to homepage'.", 'hard-stop', ALLP, 'observed')},
 'sixty_five_and_over_confirmation': {
   'yes': ("Carries on with the normal questions. No clinician flag in the definition and no change in the engine flags.", 'next-question', [], 'observed'),
   'no': ("Stops: \"Unfortunately, we’re unable to recommend a hair loss treatment for you. Please contact your doctor for advice.\" (reject result in the served definition; not clicked).", 'hard-stop', ALLP, 'code')},
 'which_image_best_matches_your_hair_loss': {
   'temples': ("Proceeds. No clinician flag. The served product-selection code does not read this answer, so it should not change which products are shown (not yet tested).", 'next-question', [], 'code'),
   'temples_and_crown': ("Proceeds to the onset question. Baseline answer.", 'next-question', [], 'observed'),
   'moderate': ("Proceeds. No clinician flag in the definition (not yet tested).", 'next-question', [], 'code'),
   'extensive': ("Proceeds. No clinician flag in the definition (not yet tested).", 'next-question', [], 'code'),
   'patchy': ("Stops: \"Defined circular areas of hair loss on the head may suggest a form of alopecia, therefore it is best to consult your GP so they can investigate.\" (reject result in the definition).", 'hard-stop', ALLP, 'code'),
   'complete': ("Stops: \"Our treatments are not effective in individuals who have experienced complete hair loss.\" (reject result in the definition).", 'hard-stop', ALLP, 'code'),
   'other_hair_loss_pattern': ("Adds a free-text question about the hair loss and flags the case for a clinician. Internal note served with the option: finasteride is unlikely to work outside male pattern loss, minoxidil may; prescribing is case by case; the team may send a 'further information needed' message.", 'flag-for-clinician', [], 'observed')},
 'when_did_you_notice': {
   'sudden': ("Stops: \"…our treatments are not suitable for you because they are not designed for sudden hair loss. Sudden hair loss can have a number of causes and we recommend you seek advice from your usual GP…\" (reject result in the definition).", 'hard-stop', ALLP, 'code'),
   'gradual': ("Proceeds to the allergy question.", 'next-question', [], 'observed')},
 'do_you_have_an_allergy_or_intolerance_to_any': {
   'minoxidil_allergy': ("Sets the engine flag hasAllergyToMinoxidil (seen in the flags call). The product-selection JS then hides every minoxidil-containing product. Also adds a free-text 'how do you react' question and marks the case for clinician query. Seen only together with other answers so far.", 'product-removed', MIN, 'code'),
   'finasteride_allergy': ("Sets hasAllergyToFinasteride. The product-selection JS then hides every finasteride-containing product (tablets, both kits with tablets, and the sprays that contain finasteride). Also adds the free-text reaction question and a clinician query. Seen only together with other answers so far.", 'product-removed', FIN, 'code'),
   'lactose_intolerance_or_allergy': ("Adds the lactose tolerance question (finasteride tablets contain lactose). No flag by itself.", 'extra-questions', ['p-finasteride', 'p-kit-pro', 'p-kit'], 'observed'),
   'not_allergic_to_any_above': ("Exclusive option. Proceeds to the scalp question.", 'next-question', [], 'observed')},
 'lactose_tolerance': {
   'cant_tolerate_any': ("Flags the case for a clinician. Internal note: confirm the request is for a treatment without lactose; if tablets were requested, contact the patient and offer alternatives. The engine flags did not change, so tablets are not hidden automatically.", 'flag-for-clinician', ['p-finasteride', 'p-kit-pro', 'p-kit'], 'observed'),
   'can_tolerate_very_small_amounts': ("Proceeds, no flag in the definition (not clicked).", 'next-question', [], 'code')},
 'have_any_scalp_issues': {
   'pain_itching': ("Adds a free-text follow-up and flags the case. Internal note: may be psoriasis, dermatitis or another scalp condition; minoxidil is not suitable unless the patient confirms there is no active condition. When all four scalp options were ticked together the engine set isMinoxidilEligible to false; which option does that is not yet separated.", 'flag-for-clinician', MIN, 'code'),
   'red_rinds_or_rashes': ("Adds a free-text follow-up and flags the case, with the same internal note about minoxidil and active scalp conditions. Part of the combined answer that set isMinoxidilEligible to false.", 'flag-for-clinician', MIN, 'code'),
   'dandruff': ("Adds a follow-up asking whether he still wants topical treatments. No flag by itself in the definition.", 'extra-questions', [], 'observed'),
   'diagnosis_of_pso_ecz': ("Adds a free-text follow-up and flags the case. Internal note: minoxidil is not suitable with an active scalp condition such as eczema or psoriasis. Part of the combined answer that set isMinoxidilEligible to false.", 'flag-for-clinician', MIN, 'code'),
   'no_none': ("Exclusive option. Proceeds to 'Are any of the following true?'.", 'next-question', [], 'observed')},
 'clarify_dandruff': {
   'yes': ("Proceeds, no flag.", 'next-question', [], 'observed'),
   'no': ("Flags the case. Internal note: confirm the request is not for a topical treatment; if it is, contact the patient. Whether topical products are also hidden is not yet tested.", 'flag-for-clinician', [], 'code')},
 'are_any_of_the_following_true': {
   'noticed_hair_loss_on_my_body': ("Adds a free-text follow-up and flags the case. Internal note: finasteride is unlikely to work in conditions other than male pattern baldness; minoxidil may; decide case by case.", 'flag-for-clinician', [], 'observed'),
   'undergoing_psa': ("Adds the PSA follow-up (must tell his GP he takes finasteride; may opt out of finasteride).", 'extra-questions', FIN, 'observed'),
   'uncontrolled_bp': ("Adds the blood-pressure follow-up (minoxidil may lower blood pressure further; may opt out of minoxidil).", 'extra-questions', MIN, 'observed'),
   'asthma': ("Adds the asthma follow-up (alcohol-based sprays may worsen asthma; may opt out of topical products).", 'extra-questions', [], 'observed'),
   'plan_on_trying_for_baby': ("Adds the fertility follow-up (stop finasteride 12 weeks before trying; may opt out of finasteride).", 'extra-questions', FIN, 'observed'),
   'experienced_disorders': ("Starts the mental-health branch: mood-risk question, then who manages the condition, medicines, recent dose changes and suicidal thoughts.", 'extra-questions', FIN, 'observed'),
   'no_none': ("Exclusive option. Skips all eleven follow-ups and goes to the 'most important' question.", 'skip-questions', [], 'observed')},
 'clarify_psa': {
   'considered_for_finasteride': ("Proceeds; engine flags unchanged.", 'next-question', [], 'observed'),
   'not_considered_for_finasteride': ("Not yet tested. The definition only says 'proceed' with no clinician flag; by its wording it should rule finasteride products out.", 'unknown', [], 'unknown')},
 'clarify_uncontrolled_bp': {
   'considered_for_minoxidil': ("Proceeds; engine flags unchanged.", 'next-question', [], 'observed'),
   'not_considered_for_minoxidil': ("Not yet tested. The definition only says 'proceed'; by its wording it should rule minoxidil products out.", 'unknown', [], 'unknown')},
 'clarify_asthma': {
   'considered_for_spray': ("Proceeds; engine flags unchanged.", 'next-question', [], 'observed'),
   'not_considered_for_spray': ("Not yet tested. The definition only says 'proceed'; by its wording it should rule the sprays out.", 'unknown', [], 'unknown')},
 'clarify_plan_on_trying_for_baby': {
   'considered_for_finasteride_baby': ("Proceeds; engine flags unchanged.", 'next-question', [], 'observed'),
   'not_considered_for_finasteride_baby': ("Not yet tested. The definition only says 'proceed'; by its wording it should rule finasteride products out.", 'unknown', [], 'unknown')},
 'mood_alterations': {
   'considered_for_finasteride': ("Continues the mental-health branch (who manages the condition).", 'extra-questions', [], 'observed'),
   'considered_for_minoxidil': ("Not yet tested. The definition only says 'proceed'; by its wording it should rule finasteride products out and may skip the rest of the mental-health branch.", 'unknown', [], 'unknown')},
 'who_manages_your_mental_health': {
   'specialist': ("The engine flag isFinasterideEligible turned false straight after this answer and turned true again when the answer was changed to GP (runs/s2-men-explore). By the product-selection JS that hides all finasteride-containing products. It also skips the remaining mental-health questions and flags the case. Internal note: the specialist should be informed and confirmation given to Numan before finasteride is started.", 'product-removed', FIN, 'code'),
   'gp': ("Continues: asks which mental-health medicines he takes. Finasteride stays eligible.", 'extra-questions', [], 'observed')},
 'mental_health_medications_changed_yes_no': {
   'yes': ("Adds a free-text list of the changes, flags the case and skips the suicidal-thoughts question. Internal note: a recent dose change suggests the condition may not be stable; the patient should provide a GP letter approving finasteride. Engine flags unchanged.", 'flag-for-clinician', FIN, 'observed'),
   'no': ("Goes to the suicidal-thoughts question.", 'next-question', [], 'observed')},
 'mental_health_suicidal': {
   'yes': ("Proceeds but flags the case. Internal note: 'Finasteride should not be prescribed for patients with suicidal ideation within the past year… consider them for non-finasteride containing preparations only.' Whether the selection screen also hides finasteride is not yet tested.", 'flag-for-clinician', FIN, 'code'),
   'no': ("Proceeds. Internal note: if finasteride is prescribed to anyone with a mental-health history, send the post-approval safety-net message. Engine flags unchanged (runs/s4-men-mentalhealth).", 'flag-for-clinician', [], 'observed')},
 'what_is_most_important_when_choosing_product': {
   'effective_formulation': ("No change seen in the engine flags; the featured product was the three-part kit. The product-selection JS sets a 'checkMostImportantAnswers' switch but never reads it, so this looks like data capture. Baseline answer.", 'none', [], 'observed'),
   'minimal_side_effects': ("Not yet tested. Nothing in the definition or the served JS uses it.", 'unknown', [], 'unknown'),
   'scalp_friendly_options': ("Not yet tested. Nothing in the definition or the served JS uses it.", 'unknown', [], 'unknown'),
   'all_of_the_above': ("Exclusive option. No change seen in the engine flags (chosen in runs/s2-men-explore, alongside many other answers).", 'none', [], 'observed')},
 'medical_history': {
   'have_medical_history': ("Adds two free-text questions (conditions, then all medicines) and marks the case for clinician query.", 'flag-for-clinician', [], 'observed'),
   'have_no_medical_history': ("Completes the questionnaire.", 'next-question', [], 'observed')},
}
META = {  # purpose, role, branches, branchDetail, shownWhen, evidence
 'what_is_your_age': ("Age gate. Under-18s are refused; 65 and over get an extra confirmation.", 'eligibility-gate', True, "Under 18 stops; 65 or over adds one question.", "always (first question)", 'observed'),
 'sixty_five_and_over_confirmation': ("Sets expectations for older men and lets them opt out.", 'expectation-setting', True, "No stops the consultation.", "age = 65 or over", 'observed'),
 'which_image_best_matches_your_hair_loss': ("Picture-based pattern check (seven drawings) to confirm male pattern hair loss and screen out patchy or complete loss.", 'diagnosis', True, "Patchy and Complete stop; Other adds a free-text question and a clinician flag.", "always", 'observed'),
 'clarify_other_hair_loss_pattern': ("Free-text description for the clinician when the pattern does not match the drawings.", 'diagnosis', False, "", "pattern = Other hair loss pattern", 'observed'),
 'when_did_you_notice': ("Screens out sudden hair loss, which needs a GP.", 'eligibility-gate', True, "Sudden onset stops the consultation.", "always", 'observed'),
 'do_you_have_an_allergy_or_intolerance_to_any': ("Drug allergy and lactose screen. This is the main automatic product filter.", 'safety-screen', True, "Minoxidil or finasteride allergy adds a reaction question and removes that drug's products; lactose adds a tolerance question.", "always", 'observed'),
 'tell_us_which_reactions_from_this_medicine': ("Free-text description of the allergic reaction for the clinician.", 'safety-screen', False, "", "minoxidil and/or finasteride allergy ticked (seen with both ticked; not yet separated)", 'observed'),
 'lactose_tolerance': ("Checks whether trace lactose in finasteride tablets is acceptable.", 'safety-screen', False, "", "lactose intolerance or allergy ticked", 'observed'),
 'have_any_scalp_issues': ("Scalp-condition screen; active scalp disease is a reason not to use minoxidil.", 'safety-screen', True, "Each ticked symptom adds its own follow-up; the combined answer switched minoxidil off.", "always", 'observed'),
 'clarify_pain_itching': ("Free-text detail about scalp pain, itching, burning or bumps for the clinician.", 'safety-screen', False, "", "scalp: 'Pain, itching, burning or bumps' ticked", 'observed'),
 'clarify_red_rinds_or_rashes': ("Free-text detail about red rinds or rashes for the clinician.", 'safety-screen', False, "", "scalp: 'Red rinds or rashes' ticked", 'observed'),
 'clarify_dandruff': ("Warns that sprays may worsen dandruff and asks whether topical treatment is still wanted.", 'product-selector', False, "", "scalp: 'Dandruff' ticked", 'observed'),
 'clarify_diagnosis_of_pso_ecz': ("Free-text detail about scalp psoriasis or eczema for the clinician.", 'safety-screen', False, "", "scalp: 'Psoriasis or eczema' ticked", 'observed'),
 'are_any_of_the_following_true': ("One screen for six cautions: body hair loss, prostate monitoring or cancer, blood pressure, asthma, trying for a baby, mental health.", 'safety-screen', True, "Each ticked item opens its own follow-up; 'No - none' skips eleven questions.", "always", 'observed'),
 'clarify_noticed_hair_loss_on_my_body': ("Free-text detail about hair loss elsewhere on the body.", 'diagnosis', False, "", "'hair loss on other areas of my body' ticked", 'observed'),
 'clarify_psa': ("Tells men under prostate monitoring that finasteride changes PSA results; lets them opt out of finasteride.", 'product-selector', False, "", "'PSA (prostate) monitoring or … prostate cancer' ticked", 'observed'),
 'clarify_uncontrolled_bp': ("Warns that minoxidil can lower blood pressure further; lets him opt out of minoxidil.", 'product-selector', False, "", "'diagnosed with high or low blood pressure' ticked", 'observed'),
 'clarify_asthma': ("Warns that alcohol-based sprays can worsen asthma; lets him opt out of topical products.", 'product-selector', False, "", "'diagnosed with asthma' ticked", 'observed'),
 'clarify_plan_on_trying_for_baby': ("Fertility warning for finasteride; lets him opt out of finasteride.", 'product-selector', False, "", "'plan on trying for a baby in the next 12 weeks' ticked", 'observed'),
 'mood_alterations': ("Finasteride mood-risk warning; he accepts the risk or asks for minoxidil only.", 'product-selector', True, "Accepting the risk opens the rest of the mental-health branch.", "'depression, anxiety or panic disorders' ticked", 'observed'),
 'who_manages_your_mental_health': ("Finds out whether a specialist or the GP manages the condition.", 'safety-screen', True, "Specialist switches finasteride off and skips the rest of the branch; GP continues.", "mood question = accept the finasteride risk", 'observed'),
 'mental_health_medications': ("Free-text list of mental-health medicines for the clinician.", 'safety-screen', False, "", "who manages = GP", 'observed'),
 'mental_health_medications_changed_yes_no': ("Checks whether the condition is stable.", 'safety-screen', True, "Yes adds a free-text list and skips the suicidal-thoughts question; No goes to it.", "who manages = GP (after the medicines question)", 'observed'),
 'mental_health_medications_changed_list': ("Free-text detail of the dose changes.", 'safety-screen', False, "", "dose changed in the last 3 months = Yes", 'observed'),
 'mental_health_suicidal': ("Suicidal-thoughts screen before finasteride.", 'safety-screen', False, "", "dose changed in the last 3 months = No", 'observed'),
 'what_is_most_important_when_choosing_product': ("Preference question. Nothing served to the browser uses the answer, so it appears to be for data capture or marketing.", 'data-capture', False, "", "always", 'observed'),
 'medical_history': ("Catch-all gate for other illnesses, operations, allergies and medicines.", 'safety-screen', True, "'I have…' adds two free-text questions and a clinician query; 'I do not…' ends the questionnaire.", "always (last fixed question)", 'observed'),
 'tell_us_about_medical_history': ("Free-text medical history for the clinician.", 'safety-screen', False, "", "medical history = I have…", 'observed'),
 'tell_us_about_medication_history': ("Free-text list of all current medicines for the clinician.", 'safety-screen', False, "", "medical history = I have… (after the conditions question)", 'observed'),
}
TYPE = {'single_choice': 'single', 'multi_choice': 'multi', 'text': 'text'}

questions = [{
 "id": "men-consent", "order": 0, "stage": "anonymous",
 "text": "The really important bit. By clicking “Next”, you are confirming that you: Are completing this consultation for yourself and to the best of your knowledge. Were assigned male at birth. Will disclose any serious illnesses or operations you have had or any prescription medication you currently take. Will only use one method of hair loss treatment at a time and will not combine more than one different medication for the condition. Are aware that finasteride is associated with depression, suicidal thoughts, and sexual dysfunction including decreased sex drive, erectile dysfunction, and ejaculation problems. These side effects can occur independently of each other and may persist after stopping treatment. A clinician will review your suitability before any prescription is issued. Will answer the questions in the next section about your physical and mental health history honestly, and are aware that your responses are reviewed by a prescribing clinician and kept confidential. Are aware that you should not take finasteride if you’re trying for a baby. Are aware that you may be prescribed an unlicensed treatment. Are accepting our Terms & Conditions and Terms of Sale.",
 "type": "consent",
 "options": [opt("Next", "Creates an anonymous draft on Numan's server (POST api.numan.com/v1/subscriptions, status 'draft', questionnaire hair_loss version 14, revision 'smart') and opens the first question. Sex is never asked as a question: being assigned male at birth is asserted here.", "next-question", [], "observed")],
 "purpose": "Consent, declaration of male sex at birth, finasteride risk warnings and notice that an unlicensed medicine may be prescribed.",
 "engineRole": "consent", "branches": False, "branchDetail": "", "shownWhen": "always (entry screen of every hair-loss consultation link)", "evidence": "observed"}]

for q in QD['questions']:
    m = META[q['id']]
    opts = []
    for o in (q.get('options') or []):
        e = E[q['id']][o['id']]
        opts.append(opt(o['content'], e[0], e[1], e[2], e[3]))
    questions.append({
        "id": "men-" + q['id'], "order": q['question_index'] + 1, "stage": "anonymous",
        "text": plain(q['content']), "type": TYPE[q['type']], "options": opts,
        "purpose": m[0], "engineRole": m[1], "branches": m[2], "branchDetail": m[3], "shownWhen": m[4], "evidence": m[5],
        "siteQuestionId": q['id'], "siteOptionIds": [o['id'] for o in (q.get('options') or [])],
    })

def price_opts():
    names = {'p-kit-pro': 'Hair Kit - Medicated Spray, Finasteride & Supplement', 'p-kit': 'Hair Kit - Medicated Spray & Finasteride', 'p-combo-kit': 'Hair Kit - Combination Spray & Supplement',
             'p-finasteride': 'Finasteride', 'p-triple-spray': 'Triple-Action Spray', 'p-minoxidil-spray': 'Extra Strength Spray', 'p-regaine': 'Regaine', 'p-rosemary-oil': 'Rosemary Oil'}
    out = []
    for pid in ALLP:
        out.append(opt(names[pid], "Stores this product's quarterly variant on the draft (PATCH product_variant_id) and moves to the 'what to expect' screen. For the baseline man the kit with three parts was the featured card ('Most effective'); the other seven appear after pressing 'See all treatments'." if pid == 'p-kit-pro' else "Listed under 'OTHER TREATMENTS' for the baseline man with its own 'Select' button (seen). Selecting it was tried only for Regaine (as the featured card in the Regaine-link run); the others are assumed to behave the same way.", "next-question", [pid], "observed" if pid in ('p-kit-pro', 'p-regaine') else "inferred"))
    return out

post = [
 {"id": "men-gp-choice", "order": 30, "stage": "anonymous", "text": "Would you like your GP to be informed of this consultation? To ensure we provide the best and safest service for you, we strongly encourage you to share your GP details so we can inform them about your treatment.", "type": "single",
  "options": [opt("Yes", "Sets notify_gp true on the draft and opens a screen asking for the GP's email address, which can be skipped.", "extra-questions", [], "observed"),
              opt("No", "Sets notify_gp false and goes to the optional email screen. No effect on products.", "next-question", [], "observed")],
  "purpose": "Consent to tell the patient's GP (good-practice step for online prescribers).", "engineRole": "consent", "branches": True, "branchDetail": "Yes adds the GP email screen.", "shownWhen": "always, after the questionnaire completes", "evidence": "observed"},
 {"id": "men-gp-email", "order": 31, "stage": "anonymous", "text": "Please enter your GP's email address", "type": "contact",
  "options": [opt("Skip", "Moves on without GP details (pressed; nothing typed).", "next-question", [], "observed"), opt("Next", "Would save the GP's email address. Not used: no contact details were entered.", "unknown", [], "unknown")],
  "purpose": "Collects the GP's email so Numan can send a treatment letter.", "engineRole": "data-capture", "branches": False, "branchDetail": "", "shownWhen": "GP question = Yes", "evidence": "observed"},
 {"id": "men-email-capture", "order": 32, "stage": "anonymous", "text": "Get access to special offers. Take the first step towards improving your overall health. You'll receive personalised health insights and exclusive monthly offers to Numan products. Email address (optional)", "type": "contact",
  "options": [opt("Skip", "Goes straight to the product selection screen with no email (pressed in every run).", "next-question", [], "observed"), opt("Next", "Would save a marketing email address before the recommendation. Not used.", "marketing-only", [], "code")],
  "purpose": "Optional marketing email capture just before the recommendation. It is not an account wall: 'Skip' works.", "engineRole": "marketing", "branches": False, "branchDetail": "", "shownWhen": "always, before product selection", "evidence": "observed"},
 {"id": "men-product-selection", "order": 33, "stage": "anonymous", "text": "Please select your treatment. Our clinicians will ensure you’re prescribed the most appropriate treatment.", "type": "single",
  "options": price_opts(),
  "purpose": "The recommendation screen: one featured product with a badge, then 'Prefer a different treatment? See all treatments'. The patient, not the engine, makes the final choice; a clinician reviews it after checkout.",
  "engineRole": "product-selector", "branches": True, "branchDetail": "Which products appear depends on the engine flags (finasteride eligible, minoxidil eligible, allergies) and on the entry link. The billing prices on the next screens depend on the product chosen.", "shownWhen": "always, after the email screen", "evidence": "observed"},
 {"id": "men-hair-expectations", "order": 34, "stage": "anonymous", "text": "Hair regrowth timeline: what to expect. 1-2 Months: Save it. There will likely be no visible change in the first two months. Though some people may shed more fine hairs than before. This is temporary and normal. 3-6 Months: Regrow it. At this point, it may become noticeable that hair loss has slowed, stopped, or in some cases maybe even reversed. Take a photo to track your progress. 6 Months and Beyond. By now, hair loss may have considerably slowed or stopped, and some people may see signs of regrowth (usually at the crown of the head). Consistent daily treatment is required to maintain results and increase the chance of regrowth.", "type": "info",
  "options": [opt("Continue", "Goes to the billing screen.", "next-question", [], "observed")],
  "purpose": "Sets expectations (results take months) right before asking for a long upfront payment.", "engineRole": "expectation-setting", "branches": False, "branchDetail": "", "shownWhen": "after a hair-loss treatment is selected", "evidence": "observed"},
 {"id": "men-billing-frequency", "order": 35, "stage": "anonymous", "text": "Pay upfront and save big on your treatment. See results in 180 days or your money back¹", "type": "single",
  "options": [opt("Billed quarterly", "Three-kit delivery billed every 3 months. For the three-part kit £40.00 per month; for Regaine £65.00 per month. (billing_frequency 1 in the variant data; viewed, not submitted.)", "none", [], "observed"),
              opt("Billed six-monthly", "Pre-selected and badged 'Most effective'. Three-part kit £36.00 per month (£48.00 struck through, 'Save £144.00 per year'); Regaine £57.00 (£80.00 struck through). Pressing Continue stored billing_frequency 2 on the draft. Still 'Delivered every 3 months'.", "none", [], "observed"),
              opt("Billed annually", "Three-part kit £32.00 per month ('Save £192.00 per year'); Regaine £48.00. (billing_frequency 4 in the variant data; viewed, not submitted.)", "none", [], "observed")],
  "purpose": "Upsell to longer prepaid plans. All three options list 'Delivered every 3 months', 'Pause anytime', 'Continuous care and support included'.", "engineRole": "marketing", "branches": False, "branchDetail": "", "shownWhen": "after the expectations screen", "evidence": "observed"},
 {"id": "men-addons", "order": 36, "stage": "anonymous", "text": "Popular add-ons. Power your Hair Loss treatment with our additional services and supplements.", "type": "multi",
  "options": [opt("Hair Growth Support", "Badged 'Most popular'. £18.76 (was £28.00). Its 'Add' button should put the supplement on the order; it was seen but not pressed.", "product-added", ['p-hair-support'], "inferred"),
              opt("Beard Growth Accessories Kit", "£18.76 (was £28.00). Not a hair-loss treatment (roller, gel, comb). Not added.", "marketing-only", [], "observed"),
              opt("Testosterone Blood Test", "£46.40 (was £58.00). Not added.", "marketing-only", [], "observed"),
              opt("Men's Multivitamin", "£18.76 (was £28.00). Not added.", "marketing-only", [], "observed"),
              opt("Core Blood Test", "£70.40 (was £88.00). Not added.", "marketing-only", [], "observed"),
              opt("Rosemary Oil", "£21.00 (was £28.00). 'Add' button seen, not pressed.", "product-added", ['p-rosemary-oil'], "inferred"),
              opt("Continue", "Goes to the order summary and account form without any add-on.", "next-question", [], "observed")],
  "purpose": "Cross-sell before the account form.", "engineRole": "marketing", "branches": False, "branchDetail": "", "shownWhen": "after billing frequency", "evidence": "observed"},
 {"id": "men-account-wall", "order": 37, "stage": "checkout", "text": "Order summary. Create an account: Email address, Password, Legal first name, Legal surname, Date of birth, Phone number, Sex ('What sex were you assigned at birth, as shown on your original birth certificate'), then Delivery address (Address, City, Postcode), 'Yes, I agree to Numan's Terms & Conditions and Privacy Policy.' and 'I do not wish to receive marketing communications…'", "type": "contact",
  "options": [opt("Continue", "ACCOUNT WALL. Needs an email, password, legal name, date of birth, phone, sex and address. Nothing was typed and the walk stopped here.", "unknown", [], "unknown")],
  "purpose": "Account creation, identity details and delivery address on one screen, under the order summary (baseline: 'Hair Kit - Medicated Spray, Finasteride & Supplement (Delivered as 3 kits every 3 months) £216.00, Promo -£40.00, Total £176.00').",
  "engineRole": "identity", "branches": False, "branchDetail": "", "shownWhen": "always, after add-ons (URL …/profile)", "evidence": "observed"},
 {"id": "men-after-wall", "order": 38, "stage": "after-account", "text": "After the account form (not walked): 'Review & Order' with a payment method ('You won’t be charged until our clinical team have reviewed and confirmed your order.', button 'Place order - Payment pending approval'), an automatic identity check, clinician review, then dispatch.", "type": "info",
  "options": [],
  "purpose": "What public sources say happens after the wall. Step names and payment wording come from the served app bundle; the identity check and review come from the help centre and the prescribing-process page. A page for 'assigned-gender-restricted-notice' also exists in the bundle ('{product} is intended only for individuals assigned {gender} at birth').",
  "engineRole": "identity", "branches": False, "branchDetail": "", "shownWhen": "after account creation (not tested)", "evidence": "code"},
]
questions += post

flows = [
 {"id": "men", "name": "Men's hair-loss consultation (questionnaire 'hair_loss', version 14, revision 'smart')", "audience": "men",
  "entryUrl": "https://www.numan.com/subscribe/hair-loss",
  "stagesSummary": "Consent screen → 8 to 28 anonymous questions out of a bank of 29 (the baseline man sees 8) → GP-notification choice → optional email (skippable) → product selection (the recommendation) → 'what to expect' → billing frequency → add-ons → ACCOUNT WALL at …/profile (order summary + create account + address) → payment, identity check and clinician review (not tested).",
  "questions": questions},
 {"id": "men-product-entry", "name": "Product-specific entry to the same consultation (Regaine link; same pattern works for finasteride and minoxidil)", "audience": "men",
  "entryUrl": "https://www.numan.com/subscribe/hair-loss/regaine",
  "stagesSummary": "Identical consent screen and identical questionnaire (replayed with the baseline answers in runs/entry-regaine-baseline). Only the recommendation changes: the entry product is featured with the badge 'Recommended for you' and, by the JS, is never hidden by the eligibility filter. Same account wall. See flow 'men' for every question.",
  "questions": []},
 {"id": "rosemary-direct", "name": "Rosemary Oil direct purchase (no consultation)", "audience": "both",
  "entryUrl": "https://www.numan.com/subscribe/hair-loss/rosemary-oil?purchase=true&pc=HL-ROSEMARY-50OFF",
  "stagesSummary": "No questions at all: the link opens the account wall (…/profile) at once with the order summary 'Rosemary Oil 100ml £28.00, Promo -£14.00, Total £14.00'.",
  "questions": [
   {"id": "rosemary-account-wall", "order": 1, "stage": "checkout", "text": "Order summary (Rosemary Oil 100ml £28.00; Promo -£14.00 'Save 50% on your first order'; Delivery Free; Total £14.00). Create an account: Email address, Password, Legal first name, Legal surname, Date of birth, Phone number, Sex, Delivery address.", "type": "contact",
    "options": [opt("Continue", "ACCOUNT WALL. Nothing typed; stopped here.", "unknown", [], "unknown")],
    "purpose": "Straight to account creation for a cosmetic product.", "engineRole": "identity", "branches": False, "branchDetail": "", "shownWhen": "always (first screen)", "evidence": "observed"}]},
 {"id": "supplement-direct", "name": "Hair Growth Support supplement direct purchase (no consultation)", "audience": "both",
  "entryUrl": "https://www.numan.com/subscribe/supplements/hair-growth-support",
  "stagesSummary": "No medical questions: shipping-frequency choice → (next screens not walked; by the app routes: add-ons, then the same account form).",
  "questions": [
   {"id": "supplement-shipping-frequency", "order": 1, "stage": "anonymous", "text": "Select your preferred shipping frequency", "type": "single",
    "options": [opt("Every month", "1 bottle, £28.00 / mo. With code SUPP-ORGANIC-50OFF: 'First order coupon - £14.00, Total due today £14.00'.", "none", ['p-hair-support'], "observed"),
                opt("Every 3 months", "3 bottles, £19.67 / mo (£28 struck through, 'Save £8.33').", "none", ['p-hair-support'], "observed"),
                opt("Every 6 months", "6 bottles, £16.67 / mo ('Save £11.33').", "none", ['p-hair-support'], "observed"),
                opt("Every 12 months", "12 bottles, £12.67 / mo ('Save £15.33').", "none", ['p-hair-support'], "observed")],
    "purpose": "Plan length for the supplement. Footer: 'Billed monthly. Pause or cancel anytime.'", "engineRole": "marketing", "branches": False, "branchDetail": "", "shownWhen": "always (first screen)", "evidence": "observed"}]},
]

rules = [
 {"id": "R1", "flow": "men", "when": "men-what_is_your_age = 'Under 18'", "then": "Consultation stops on a 'No suitable treatment' screen that tells him to contact his doctor and offers clinic@numan.com.", "effectType": "hard-stop", "affects": ALLP, "evidence": "observed", "proof": "runs/stop-under18 (04.txt, 04.jpg)", "confidence": "high"},
 {"id": "R2", "flow": "men", "when": "men-which_image_best_matches_your_hair_loss = 'Patchy' or 'Complete'; or men-when_did_you_notice = 'Over the last few days or weeks'; or men-sixty_five_and_over_confirmation = 'No'", "then": "Each of these four options carries a 'reject' result with its own patient message in the served definition, so each stops the consultation.", "effectType": "hard-stop", "affects": ALLP, "evidence": "code", "proof": DEF + "; not clicked yet", "confidence": "high"},
 {"id": "R3", "flow": "men", "when": "engine flag isFinasterideEligible is false, or hasAllergyToFinasteride is true", "then": "The selection screen hides every product on the JS finasteride list: both kits with tablets, the combination kit, Triple-Action Spray and Finasteride (the list also names retired codes). Exception: the product named in the entry link is never hidden.", "effectType": "product-removed", "affects": FIN, "evidence": "code", "proof": "raw/nuxt/29-…product-selection…8c8a04d9.45240ec.modern.js, function hairLossProductsToHide (arrays I and B); flags come from POST www.numan.com/bff/assessment/subscribe/calculate-web-directives", "confidence": "high"},
 {"id": "R4", "flow": "men", "when": "engine flag isMinoxidilEligible is false, or hasAllergyToMinoxidil is true", "then": "The selection screen hides every product on the JS minoxidil list: all three kits, Triple-Action Spray, Extra Strength Spray and Regaine. Same exception for the entry product.", "effectType": "product-removed", "affects": MIN, "evidence": "code", "proof": "same JS function as R3", "confidence": "high"},
 {"id": "R5", "flow": "men", "when": "both finasteride and minoxidil are ruled out (in the run: both allergies ticked, all four scalp symptoms, all six cautions)", "then": "Only Rosemary Oil is offered, as the featured card with the badge 'Most effective' at £14.00. The built-in 'unable to offer treatment' message did not appear because the oil is on neither hide-list.", "effectType": "product-removed", "affects": ['p-kit-pro', 'p-kit', 'p-combo-kit', 'p-finasteride', 'p-triple-spray', 'p-minoxidil-spray', 'p-regaine'], "evidence": "observed", "proof": "runs/s2-men-explore (out/040.txt, out/040.jpg); many answers changed at once, so this is not a one-change test", "confidence": "medium"},
 {"id": "R6", "flow": "men", "when": "men-who_manages_your_mental_health = 'Psychiatrist/Specialist/Consultant'", "then": "isFinasterideEligible becomes false (and returns to true if the answer is changed to GP); the rest of the mental-health branch is skipped and the case carries a clinician note asking for specialist pre-approval.", "effectType": "product-removed", "affects": FIN, "evidence": "observed", "proof": "runs/s2-men-explore: flags after net/087 (false) and net/094 (true again); product list with only this change not yet seen", "confidence": "medium"},
 {"id": "R7", "flow": "men", "when": "men-have_any_scalp_issues has all four symptoms ticked", "then": "isMinoxidilEligible becomes false. Which single symptom is enough is not yet known (three of the four carry a clinician note saying minoxidil is unsuitable with an active scalp condition).", "effectType": "product-removed", "affects": MIN, "evidence": "observed", "proof": "runs/s2-men-explore: flags after the scalp answer (net/039 onwards)", "confidence": "medium"},
 {"id": "R8", "flow": "men", "when": "nothing is hidden and the entry link names no product", "then": "The featured card is the three-part kit (Medicated Spray, Finasteride & Supplement) with the badge 'Most effective'; the other seven products sit behind 'See all treatments' in position order.", "effectType": "none", "affects": ['p-kit-pro'], "evidence": "observed", "proof": "runs/s1-men-baseline (out/014.txt, out/015.txt); logic in the JS function featuredProductCode", "confidence": "high"},
 {"id": "R9", "flow": "men-product-entry", "when": "the consultation is entered through /subscribe/hair-loss/<product> (seen with regaine)", "then": "That product is the featured card with the badge 'Recommended for you'; everything else, including the kits, moves under 'See all treatments'. The choice is remembered in the browser (localStorage vuex_production → subscribe.selectedProductSlug), so tests must start from a clean browser.", "effectType": "product-switched", "affects": ['p-regaine'], "evidence": "observed", "proof": "runs/entry-regaine-baseline (16.txt) against runs/s1-men-baseline; stored value seen in runs/s3-entries/storage-008.json", "confidence": "high"},
 {"id": "R10", "flow": "men", "when": "a group is hidden and the three-part kit is therefore gone", "then": "By the JS the featured card becomes the first remaining product by position: Finasteride when only minoxidil is ruled out, Extra Strength Spray when only finasteride is ruled out. The badge reads 'Recommended for you' for Finasteride, Extra Strength Spray or Regaine when that drug is eligible and not an allergy; otherwise 'Most effective'.", "effectType": "product-switched", "affects": ['p-finasteride', 'p-minoxidil-spray'], "evidence": "code", "proof": "JS functions featuredProductCode and promoLabel in the same chunk as R3; not yet observed", "confidence": "medium"},
 {"id": "R11", "flow": "men", "when": "any option whose served result has query_clinically (other pattern; either drug allergy; no lactose at all; scalp pain/itching, red rinds, psoriasis/eczema; 'No' to topical with dandruff; body hair loss; specialist-managed mental health; dose change; either answer on suicidal thoughts; 'I have' a medical history)", "then": "The patient still proceeds and can still pick a product, but the questionnaire is marked for clinician query, often with a written instruction for the reviewing clinician. The decision is therefore made by a person after checkout, not by the quiz.", "effectType": "flag-for-clinician", "affects": [], "evidence": "code", "proof": DEF, "confidence": "high"},
]

experiments = [
 {"id": "entry-regaine", "flow": "men-product-entry", "changed": "Entry link only: /subscribe/hair-loss → /subscribe/hair-loss/regaine (all baseline answers the same)", "result": "Same consent and the same 8 questions. Featured card changed from the three-part kit ('Most effective', £26.67) to Regaine ('Recommended for you', £51.67, 'Save 21%'); all other products under 'See all treatments'. Billing screen: quarterly £65.00, six-monthly £57.00, annually £48.00 per month. Order summary at the wall: Regaine 5% minoxidil, 3 bottles every 3 months, £342.00, promo -£40.00, total £302.00.", "run": "runs/entry-regaine-baseline"},
 {"id": "stop-under18", "flow": "men", "changed": "men-what_is_your_age: '18 - 65' → 'Under 18'", "result": "Stop screen 'No suitable treatment' at …/sq/what_is_your_age/reject/under_eighteen with 'Review your answers' and 'Back to homepage'.", "run": "runs/stop-under18"},
 {"id": "branch-mental-health", "flow": "men", "changed": "men-are_any_of_the_following_true: 'No - none' → depression/anxiety ticked, then: accept finasteride risk, GP, a fictional medicine, no dose change, no suicidal thoughts", "result": "Five extra questions. Engine flags stayed at their defaults (finasteride and minoxidil both eligible) up to the 'most important' question. The run was stopped there, so the product screen was not seen.", "run": "runs/s4-men-mentalhealth"},
 {"id": "explore-all-branches", "flow": "men", "changed": "NOT a one-change test. Mapping walk: 65 or over, Other pattern, all three allergy options, all four scalp symptoms, all six cautions, every 'still consider me' follow-up, specialist then GP, dose change No then Yes, 'I have' a medical history; free text was short fictional medical text", "result": "Reached 28 of the 29 questions in one draft. Flags: hasAllergyToFinasteride and hasAllergyToMinoxidil true after the allergy answer; isMinoxidilEligible false after the scalp answer; isFinasterideEligible false only while 'specialist' was selected. Product screen: Rosemary Oil only.", "run": "runs/s2-men-explore"},
]

recommendations = [
 {"profile": "Baseline man: 18-65, temples and crown, gradual, no allergies, no scalp symptoms, none of the cautions, 'Effectiveness of the product', no medical history, GP not informed, entered through /subscribe/hair-loss", "offered": ALLP, "default": "p-kit-pro", "note": "Featured card 'Most effective': Hair Kit - Medicated Spray, Finasteride & Supplement at £26.67 a month after the first-order code ('Save 33%'). The other seven appear after 'See all treatments'. Six-monthly billing is pre-selected on the next screen.", "evidence": "observed"},
 {"profile": "Same man, entered through /subscribe/hair-loss/regaine", "offered": ALLP, "default": "p-regaine", "note": "Regaine featured as 'Recommended for you' at £51.67.", "evidence": "observed"},
 {"profile": "Man with both drug allergies, every scalp symptom and every caution ticked (mapping walk)", "offered": ["p-rosemary-oil"], "default": "p-rosemary-oil", "note": "Rosemary Oil only, badged 'Most effective'. No medicine offered and no stop screen.", "evidence": "observed"},
 {"profile": "Woman", "offered": ["p-rosemary-oil", "p-hair-support"], "default": "p-rosemary-oil", "note": "There is no women's hair-loss consultation. The only consultation asks the patient to confirm male sex at birth, every medicine variant is marked male-only in the API, and the public pages say finasteride, Regaine for Men and the sprays are not for women. A woman can buy the cosmetic oil and the supplement (not if pregnant, likely to become pregnant or breastfeeding) directly. Not walked past the account form.", "evidence": "code"},
]

company = {
 "slug": "numan", "company": "Numan", "market": "UK", "website": "https://www.numan.com/hair-loss",
 "parent": "Vir Health Limited (Numan is its trading name; company number 11449267). Registered pharmacy: Numan Operations Limited (GPhC 9011408).",
 "audiences": ["men"],
 "model": "UK online men's health clinic and pharmacy: an anonymous questionnaire, then the patient picks a subscription product, pays upfront for 3, 6 or 12 months, and a clinician reviews the request after checkout.",
 "checkedOn": "2026-11-23",
 "access": {
  "howTested": ["live-walk", "site-code", "public-docs"],
  "accountWall": "At …/subscribe/hair-loss/<draft id>/profile, after the questionnaire, GP choice, optional email (skippable), product selection, 'what to expect', billing frequency and add-ons. The screen shows the order summary and asks for email, password, legal name, date of birth, phone, sex and delivery address. The full recommendation and all plan prices are visible before it. Direct purchase of Rosemary Oil hits the same form on its first screen.",
  "blockers": [],
  "coverageNote": "Stage 1 (map). The browser was not blocked. All 29 questions of the live men's questionnaire were reached and saved with every option; the served data also gives the engine result of every option (proceed, reject with message, clinician query with internal note). The baseline man was walked to the account wall twice (main link and Regaine link). One stop screen (under 18) was opened. The product filter was read in the served JavaScript and seen once in an all-flags walk. Not done: one-change tests of most options (stage 2), anything after the account wall, and any women's flow (none exists). robots.txt disallows /subscribe for crawlers; the walks were single, slow, human-style sessions and each consultation start created one anonymous draft on Numan's side (eight confirmed in the network logs, possibly nine).",
 },
 "products": products, "flows": flows, "rules": rules, "experiments": experiments, "recommendations": recommendations,
 "engineSummary": "Numan's engine has three layers. (1) A server-driven question tree: the browser asks api.numan.com for one question at a time and each answer returns the next question id. Five answers end the consultation at once (under 18; patchy loss; complete loss; sudden onset; and 'No' from a man of 65 or over). (2) A small set of engine flags computed on the server after every answer (finasteride eligible, minoxidil eligible, allergy to each). The selection screen hides every product containing a drug that is ruled out and then features one product: the three-part kit by default, the product named in the entry link if there was one, otherwise the first product left. The patient can always open the full list and choose something else, and a cosmetic oil is always left even when both drugs are ruled out. (3) Many answers do not change the screen at all: they attach a 'query clinically' note, with written instructions, for the clinician who reviews the order after checkout. Pattern severity, the preference question and age over 65 do not appear to change the offer.",
 "strengths": [
  "Short for a healthy man: 8 questions and no account needed to see the recommendation and every plan price.",
  "Safety logic is concentrated in a few clear gates plus clinician notes, including a detailed mental-health branch before finasteride.",
  "Wide range in one flow: licensed tablets, a licensed brand, two unlicensed sprays, three kits, plus a cosmetic and a supplement as fallbacks and add-ons.",
  "180-day money-back guarantee shown on the recommendation and billing screens.",
 ],
 "weaknesses": [
  "No service for women's hair loss: sex is asserted on a consent screen rather than asked, and every medicine is male-only.",
  "No question about previous hair-loss treatment, sexual side-effect history, heart disease by name, or family history in the current questionnaire (older versions in the app bundle did ask about previous treatment).",
  "The patient, not the engine, chooses the product; the default is always the most expensive kit, and six-monthly prepayment is pre-selected.",
  "Public pages disagree with each other: the prescribing-process page says 'We do not supply unlicensed or unproven treatments' while the consent screen and help centre say the 6% and combination sprays are unlicensed. The first-order banner says 50% off but the pricing call applied 40% (capped at £40) to hair-loss medicines.",
  "When both drugs are ruled out the screen still sells Rosemary Oil with the badge 'Most effective' instead of explaining that no medicine is suitable.",
 ],
 "opportunities": [
  "A proper women's pathway (the site has women's health but no female hair-loss consultation).",
  "A recommendation that actually uses pattern, severity and stated preferences instead of one default kit.",
  "Clear, consistent wording on licensed versus unlicensed products and on what the first-order discount really is.",
  "Monthly or low-commitment plans made visible: the flow only shows quarterly, six-monthly and annual billing.",
 ],
 "engineFlagsSeen": {
  "where": "POST https://www.numan.com/bff/assessment/subscribe/calculate-web-directives {subscriptionId}, called by the page after every answer; saved in runs/*/net/",
  "hairLossFlags": ["isFinasterideEligible (default true)", "isMinoxidilEligible (default true)", "hasAllergyToFinasteride", "hasAllergyToMinoxidil", "hasAllergies", "allergies[]", "numberOfQuestions"],
  "otherFlagsInTheSameReply": "hasHeartProblems, healthConcerns, medicationHistory and several erectile-dysfunction and weight-loss flags; none changed in any hair-loss run"
 },
 "sources": [
  {"title": "Numan hair-loss landing page", "url": "https://www.numan.com/hair-loss"},
  {"title": "Hair-loss consultation entry (consent screen)", "url": "https://www.numan.com/subscribe/hair-loss"},
  {"title": "Finasteride product page", "url": "https://www.numan.com/hair-loss/finasteride"},
  {"title": "Minoxidil product page", "url": "https://www.numan.com/hair-loss/minoxidil"},
  {"title": "Regaine product page", "url": "https://www.numan.com/hair-loss/regaine"},
  {"title": "Rosemary Oil product page", "url": "https://www.numan.com/hair-loss/rosemary-oil"},
  {"title": "Hair Support supplement page", "url": "https://www.numan.com/supplements/hair-support"},
  {"title": "Hair-loss money-back guarantee", "url": "https://www.numan.com/hair-loss/money-back-guarantee"},
  {"title": "Product catalogue API called by the consultation page (products, variants, prices, age and sex limits)", "url": "https://api.numan.com/v1/product_categories/hair-loss?all_variants=true"},
  {"title": "Help centre: hair loss support collection", "url": "https://help.numan.com/en/collections/7373202-hair-loss-support"},
  {"title": "Help centre: Extra Strength Spray (minoxidil 6%, unlicensed) safety information", "url": "https://help.numan.com/en/articles/9917345-extra-strength-spray"},
  {"title": "Help centre: Combination Spray (minoxidil 10%, azelaic acid 5%, finasteride 0.1%, unlicensed) safety information", "url": "https://help.numan.com/en/articles/9929731-combination-spray"},
  {"title": "Help centre: Finasteride dos and don'ts", "url": "https://help.numan.com/en/articles/9917349-finasteride"},
  {"title": "Help centre: Regaine for Men", "url": "https://help.numan.com/en/articles/9917351-regaine-for-men"},
  {"title": "Help centre: Hair Kit - Medicated Hair Spray & Finasteride & Hair Support supplement", "url": "https://help.numan.com/en/articles/9917356-hair-kit-medicated-hair-spray-finasteride-hair-support-supplement"},
  {"title": "Help centre: Hair Kit - Combination Spray & Hair Support supplement", "url": "https://help.numan.com/en/articles/9917362-hair-kit-combination-spray-hair-support-supplement"},
  {"title": "Help centre: Hair Growth Support", "url": "https://help.numan.com/en/articles/9917011-hair-growth-support"},
  {"title": "Help centre: What is an unlicensed or off-label medication?", "url": "https://help.numan.com/en/articles/9922010-what-is-an-unlicensed-or-off-label-medication"},
  {"title": "Help centre: Hair Loss Disclaimer (older wording of the consent list)", "url": "https://help.numan.com/en/articles/9929389-hair-loss-disclaimer"},
  {"title": "Help centre: Is this a subscription service? (commitment plans, auto-renew)", "url": "https://help.numan.com/en/articles/9925099-is-this-a-subscription-service"},
  {"title": "Help centre: How do I cancel or pause my subscription?", "url": "https://help.numan.com/en/articles/9924646-how-do-i-cancel-or-pause-my-subscription"},
  {"title": "Help centre: When is payment taken?", "url": "https://help.numan.com/en/articles/9925051-when-is-payment-taken"},
  {"title": "Help centre: Why do I need to verify my identity?", "url": "https://help.numan.com/en/articles/9925019-why-do-i-need-to-verify-my-identity"},
  {"title": "Help centre: Why do I need to share my GP details?", "url": "https://help.numan.com/en/articles/12675517-why-do-i-need-to-share-my-gp-details"},
  {"title": "The Numan prescribing process", "url": "https://www.numan.com/prescribing-process"},
  {"title": "How Numan is regulated", "url": "https://www.numan.com/how-we-are-regulated"},
  {"title": "Terms of Sale", "url": "https://www.numan.com/legal/terms-of-sale"},
  {"title": "GPhC register: Numan Operations Limited (9011408)", "url": "https://inspections.pharmacyregulation.org/pharmacy/detail/numan-operations-limited-9011408"},
  {"title": "Article: benefits of rosemary oil for women (the only women's hair content found)", "url": "https://www.numan.com/womens-health/hair-loss/benefits-of-rosemary-oil-women"},
 ],
 "limitations": [
  "Nothing after the account wall was tested: payment, identity check, any follow-up questions from clinicians, and what is finally prescribed are known only from public pages and app text.",
  "Most option effects come from the definition the site served (code), not from separate replays; options marked 'unknown' have not been tested at all.",
  "The engine flags are calculated on Numan's server. Only their values were seen, not the rules that set them.",
  "Prices were read on 23 Nov 2026 with the first-order code that the site's own links carry; several pricing experiments are named in the app bundle (hl_6_months_promo, hl_price_per_day, HL_ps_science), so another visitor may see different presentation.",
  "Six-monthly and annual prices for products other than the three-part kit and Regaine are worked out from the variant data in the API, not seen on a billing screen.",
  "Who compounds the unlicensed sprays is not stated in any public source found.",
 ],
}
json.dump(company, open(os.path.join(base, 'company.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
nq = sum(len(f['questions']) for f in flows); no = sum(len(q['options']) for f in flows for q in f['questions'])
print('company.json written:', len(products), 'products,', len(flows), 'flows,', nq, 'questions,', no, 'options,', len(rules), 'rules')
