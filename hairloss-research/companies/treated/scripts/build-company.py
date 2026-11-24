#!/usr/bin/env python3
"""build-company.py : (re)build company.json from the saved quiz definition, secondary questions and observed screens.
Run from the company folder: python3 -I scripts/build-company.py"""
import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
QD = json.load(open('quiz-definition-male.json'))
SEC_F = json.load(open('runs/b3-men-save/net/' + [f for f in os.listdir('runs/b3-men-save/net') if 'secondary' in f][0]))
SEC_D = json.load(open('runs/p2-dutasteride-save/net/' + [f for f in os.listdir('runs/p2-dutasteride-save/net') if 'secondary' in f][0]))
SEC_A = json.load(open('runs/p2-avodart-save/net/' + [f for f in os.listdir('runs/p2-avodart-save/net') if 'secondary' in f][0]))
ALL = ['fin', 'prop', 'dut', 'avo', 'reg']
CF = 'code (quiz-definition-male.json, from start.treated.com/gbr/catalog/getquestionsbycountry)'

products = [
 {"id": "fin", "name": "Finasteride 1mg tablets (generic)", "category": "rx-oral", "actives": [{"name": "finasteride", "strength": "1mg"}],
  "form": "tablet, one daily", "audience": "men", "legalStatus": "POM, licensed for male pattern hair loss",
  "price": "£34.95 for 28 tablets delivered every month",
  "priceDetail": "56 tablets every 2 months £55.95; 84 every 3 months £73.95; 168 every 6 months £130.95. Free delivery. Cancellable auto-renewing subscription.",
  "url": "https://uk.treated.com/hair-loss/finasteride",
  "recommendedWhen": "Pre-selected default (rank 1, 'Most Popular') on the treatment options screen for the baseline man arriving from the general hair-loss entry. Auto-offer limits in served data: age 18-49, BMI up to 35, no conditions, surgery, medicines, allergies, disability, family history or recreational drugs.",
  "evidence": "observed"},
 {"id": "prop", "name": "Propecia 1mg tablets (branded finasteride)", "category": "rx-oral", "actives": [{"name": "finasteride", "strength": "1mg"}],
  "form": "tablet, one daily", "audience": "men", "legalStatus": "POM, licensed for male pattern hair loss",
  "price": "£66.95 for 28 tablets delivered every month",
  "priceDetail": "56 every 2 months £114.95; 84 every 3 months £149.95; 168 every 6 months £287.95.",
  "url": "https://uk.treated.com/hair-loss/propecia",
  "recommendedWhen": "Listed as a choice (rank 2) for the baseline man; pre-selected only when the patient enters from the Propecia product button (product=024-313, inferred from the Dutasteride entry test). Same auto-offer limits as finasteride.",
  "evidence": "observed"},
 {"id": "dut", "name": "Dutasteride 0.5mg capsules (generic)", "category": "rx-oral", "actives": [{"name": "dutasteride", "strength": "0.5mg"}],
  "form": "capsule, one daily", "audience": "men", "legalStatus": "POM, licensed for enlarged prostate; prescribed off-label for hair loss (the site says so)",
  "price": "£34.95 for 30 capsules delivered every month",
  "priceDetail": "60 every 2 months £63.95; 90 every 3 months £89.95.",
  "url": "https://uk.treated.com/hair-loss/dutasteride",
  "recommendedWhen": "Listed as a choice for the baseline man; pre-selected when entering from its product button (observed runs/p1-dutasteride). Saving it adds 3 product questions: previous finasteride/minoxidil use, off-label acknowledgement, side-effect warning.",
  "evidence": "observed"},
 {"id": "avo", "name": "Avodart 0.5mg capsules (branded dutasteride)", "category": "rx-oral", "actives": [{"name": "dutasteride", "strength": "0.5mg"}],
  "form": "capsule, one daily", "audience": "men", "legalStatus": "POM, licensed for enlarged prostate; off-label for hair loss",
  "price": "£47.95 for 30 capsules delivered every month",
  "priceDetail": "60 every 2 months £81.95; 90 every 3 months £113.95 (the 90 pack is marked most popular).",
  "url": "https://uk.treated.com/hair-loss/avodart",
  "recommendedWhen": "Listed as a choice for the baseline man; same 3 product questions as dutasteride (observed runs/p2-avodart-save).",
  "evidence": "observed"},
 {"id": "reg", "name": "Regaine for Men Extra Strength 5% (scalp solution 3x60ml or foam 3x73ml)", "category": "otc-medicine", "actives": [{"name": "minoxidil", "strength": "5%"}],
  "form": "topical solution or foam, twice daily", "audience": "men", "legalStatus": "Licensed non-prescription medicine (site: 'available over the counter'; P or GSL class not checked)",
  "price": "£99.95 for 3x60ml solution delivered every 3 months",
  "priceDetail": "3x73ml (foam, half a capful twice daily) £104.95 every 3 months. Only one plan length each. The options data carries an old 'Starting from £55.95' tag; the live price shown is £99.95.",
  "url": "https://uk.treated.com/hair-loss/regaine",
  "recommendedWhen": "Listed as a choice (rank 2) for the baseline man. Still sold through the same consultation even though it needs no prescription. Pre-selected from its product button (product=024-322); Save goes straight to checkout with no product questions (observed runs/p2-regaine-save).",
  "evidence": "observed"},
 {"id": "finmin", "name": "Finasteride + Minoxidil Drops (custom made)", "category": "rx-topical-compounded", "actives": [{"name": "finasteride", "strength": "unknown"}, {"name": "minoxidil", "strength": "unknown"}],
  "form": "scalp drops with pipette, daily", "audience": "men", "legalStatus": "Unlicensed combined formulation made to order (the page says 'currently unlicensed')",
  "price": "Not available (no price shown)",
  "priceDetail": "Product page and category page both show 'Not available' on 2026-11-23; it is not in the consultation's options list.",
  "url": "https://uk.treated.com/hair-loss/finasteride-minoxidil-drops",
  "recommendedWhen": "Never offered at present: missing from the treatment options returned for the baseline man and from product entry links.",
  "evidence": "docs"},
]

ACTION = {
 'Proceed': ("Moves to the next question; no flag in the served definition.", "next-question"),
 'OfflineTreatment': ("Tagged 'OfflineTreatment' in the served definition (server marks it 'AdvisePrompt'). The patient can still pick a product, but it is not auto-offered: the treatment screen says the clinician still needs to review before recommending.", "flag-for-clinician"),
 'Block': (None, "hard-stop"),
 'FollowupQuestion': ("Opens a free-text follow-up question (shown below).", "extra-questions"),
}
ROLE = {
 0: ('diagnosis', 'Checks the pattern fits male pattern hair loss; other patterns (patchy, one-sided, sudden, breakage, drug-induced) are flagged for clinician review.'),
 1: ('diagnosis', 'Recent onset (under 3 months) may be shedding from another cause, so it is flagged.'),
 2: ('safety-screen', 'Asks whether a doctor has already looked at it; "No" is flagged for review.'),
 3: ('product-selector', 'Previous treatment history; "never used any" is flagged for review.'),
 4: ('safety-screen', 'Scarring hair loss needs a specialist, so it is flagged.'),
 5: ('safety-screen', 'Blood pressure matters for minoxidil; high or unknown is flagged.'),
 6: ('safety-screen', 'Checks the blood pressure reading is recent; over 6 months is flagged.'),
 7: ('safety-screen', 'Medical history screen. Mental illness is a hard stop (finasteride mood risk); all other conditions are flagged.'),
 8: ('safety-screen', 'Symptoms that may point to thyroid, hormonal, prostate or skin causes; all are flagged.'),
 9: ('data-capture', 'Free text for the prescriber.'),
 10: ('data-capture', 'GP sharing consent; "No" shows an info pop-up.'),
}
def opt(o, qi):
    act = o['frontendAction']
    eff, et = ACTION.get(act, ("Unknown action " + act, 'unknown'))
    if act == 'Block':
        eff = f"Hard stop: pop-up '{o['blockerTitle']}' — '{o['blockerText']}'"
    if o.get('uncheckRestOptions'):
        eff += " Exclusive: unticks the other options."
    aff = []
    if act == 'Block': aff = ['fin', 'prop', 'dut', 'avo']
    return {"label": o['text'] or '(free text)', "effect": eff, "effectType": et, "affects": aff, "evidence": "code"}

qs = []
order = 1
# Q0 sex
qs.append({"id": "men-q0", "order": order, "stage": "anonymous", "text": "What sex were you assigned at birth?", "type": "single",
  "options": [
    {"label": "Male", "effect": "Starts the 11-question hair-loss questionnaire.", "effectType": "next-question", "affects": [], "evidence": "observed"},
    {"label": "Female", "effect": "Hard stop: pop-up 'This treatment category isn't suitable for the gender you have selected.' with 'Cancel' or 'Choose other treatment'. The hair-loss condition is set to male only (preferredGender check in served code 2644.js).", "effectType": "hard-stop", "affects": ALL, "evidence": "observed"}],
  "purpose": "Sex gate. Sub-text: 'We ask this because some things we offer, like birth control or erectile dysfunction tablets, aren't safe for everyone to take.' Footer: 'By clicking 'Continue', you're confirming that you're aged 18 or over and agreeing to our terms of use.' This click is also the only age check before the account wall.",
  "engineRole": "eligibility-gate", "branches": True, "branchDetail": "Female ends the hair-loss route (runs/w1-women).", "shownWhen": "always (first screen)", "evidence": "observed"})
order += 1
for i, q in enumerate(QD['questions']):
    role, purpose = ROLE[i]
    typ = 'multi' if q['type'] == 'MultiCheckBox' else 'single'
    acts = {o['frontendAction'] for o in q['options']}
    bd = []
    if 'OfflineTreatment' in acts: bd.append('Some answers flag the consultation for clinician review (no auto-offer).')
    if 'Block' in acts: bd.append('One answer is a hard stop.')
    if 'FollowupQuestion' in acts: bd.append('"Other"/"Yes" opens a free-text follow-up.')
    qq = {"id": f"men-q{i+1}", "order": order, "stage": "anonymous", "text": q['text'].strip() + ((' ' + q['subText'].strip()) if q.get('subText') else ''),
          "type": typ, "options": [opt(o, i) for o in q['options']], "purpose": purpose, "engineRole": role,
          "branches": bool(acts - {'Proceed'}), "branchDetail": ' '.join(bd), "shownWhen": "always", "evidence": "observed"}
    qs.append(qq); order += 1
    for o in q['options']:
        f = o.get('followupQuestion')
        if f:
            qs.append({"id": f"men-q{i+1}-f", "order": order, "stage": "anonymous", "text": f['text'], "type": "text", "options": [],
                       "purpose": "Free-text detail for the clinician.", "engineRole": "data-capture", "branches": False, "branchDetail": "",
                       "shownWhen": f"men-q{i+1} = '{o['text']}'", "evidence": "code"}); order += 1
# GP info pop-up
qs.append({"id": "men-gp-info", "order": order, "stage": "anonymous", "type": "info",
  "text": "Just so you know: Telling your GP about the treatment you get from us will help them stay informed and give you better care. If you don’t want us to notify them, we recommend letting them know yourself.",
  "options": [{"label": "Okay", "effect": "Closes the pop-up and moves to height and weight.", "effectType": "next-question", "affects": [], "evidence": "observed"}],
  "purpose": "Nudges the patient to inform their GP.", "engineRole": "expectation-setting", "branches": False, "branchDetail": "",
  "shownWhen": "men-q11 = 'No' (observed). Behaviour after 'Yes' not tested (the locale file has a GP search: 'Type postcode or surgery name').", "evidence": "observed"}); order += 1
qs.append({"id": "men-hw", "order": order, "stage": "anonymous", "type": "number", "text": "What's your height and weight? (Height: ft/in or cm — Feet, Inches. Weight: lbs or kg — Stone, Pounds.)",
  "options": [], "purpose": "BMI. Served auto-offer rules allow BMI 0-35 for every hair-loss product.", "engineRole": "safety-screen",
  "branches": False, "branchDetail": "BMI over 35 probably blocks auto-offer (code: offerBmi, maximumBmi 35 in gettreatmentoptions); not tested.", "shownWhen": "always", "evidence": "observed"}); order += 1
MP = [("I have one or more medical conditions", "Add a medical condition — free text 'Type here', button 'Add condition'. Info: 'Telling us about these helps us give you treatment and advice that's safe. It's important to list all of your medical conditions if you have more than one.'", "offerIfHasConditions false"),
      ("I've had surgery before", "Add your surgery history — free text, then 'When did you have this surgery?': 'Less than three years ago' / 'More than three years ago'. Button 'Add surgery'.", "offerIfHasSurgeries false"),
      ("I'm taking medication(s)", "Add a medication — Medication name, Dosage, Frequency. Button 'Add medication'.", "offerIfHasMedications false"),
      ("I have one or more allergies", "Add an allergy — free text, button 'Add allergy'.", "offerIfHasAllergies false"),
      ("I smoke or used to smoke", "How often do you smoke? 'I used to smoke but I quit' / 'I smoke occasionally' / 'I smoke every day' / 'I smoke and I want to quit'; then 'How much do you (or did you) smoke?'.", "offerIfSmoke true (smoking allowed)"),
      ("I drink alcohol", "How much do you drink? 'Less than 14 units per week' / 'More than 14 units per week' / 'I'd like to talk to someone about cutting down'.", "offerIfDrink true (drinking allowed)"),
      ("I have one or more disabilities", "Tell us about your disability — free text, 'Add more info'.", "offerIfHasDisability false"),
      ("I have one or more close relatives with a medical condition", "Add a medical condition from my family history — Condition name; Who has it? (e.g. Mum, Dad, Sister).", "offerIfHasFamilyMember false"),
      ("I use recreational drugs", "Add recreational drugs — Name of drug; How often do you use it?", "offerIfHasRecreationalDrugs false")]
qs.append({"id": "men-profile", "order": order, "stage": "anonymous", "type": "multi",
  "text": "Here's your medical profile. Let us know if any of the below apply to you.",
  "options": [{"label": l, "effect": f"Opens pop-up: {p} Served auto-offer rule for every hair-loss product: {r}, so ticking it (except smoking/alcohol) probably sends the case to clinician review instead of auto-offer (code: gettreatmentoptions restriction.autoOffer; not tested).",
               "effectType": "unknown", "affects": [], "evidence": "code"} for l, p, r in MP],
  "purpose": "General medical profile shared across Treated conditions; feeds the auto-offer rules.", "engineRole": "safety-screen", "branches": True,
  "branchDetail": "Each tick opens a pop-up with its own fields (wording from start-localeResources-en.json; first pop-up observed in runs/m1-profile).",
  "shownWhen": "always", "evidence": "observed"}); order += 1
qs.append({"id": "men-profile-confirm", "order": order, "stage": "anonymous", "type": "consent",
  "text": "Does this look right? It's really important to tell us as much about your health as you can, so we can suggest the best option for you. (Then a summary: You don't have any additional medical conditions. / You aren't taking any medication. / You have no allergies to any food, drugs or anything else. / You don't have a disability. / You don’t have a family history of any medical conditions. / You aren't using any recreational drugs or narcotics.)",
  "options": [{"label": "No, go back", "effect": "Back to the medical profile.", "effectType": "none", "affects": [], "evidence": "inferred"},
              {"label": "Yes, correct", "effect": "Shows 'We're checking what's safe for you...' then the treatment options screen.", "effectType": "next-question", "affects": [], "evidence": "observed"}],
  "purpose": "Confirms the profile.", "engineRole": "consent", "branches": False, "branchDetail": "", "shownWhen": "always", "evidence": "observed"}); order += 1
qs.append({"id": "men-options", "order": order, "stage": "anonymous", "type": "single",
  "text": "1. Choose treatment 2. Checkout 3. Complete — Here's what we've got for you. You can edit it to something else if you prefer. (Pre-selected product card with Dosage, Quantity, 'Deliver to me', price; 'Most first-time users select: 1mg x 28 tablets'; Express shipping Free; Consultation + Access to our clinicians Free.) OR Not sure? We'll pick a treatment for you based on your medical profile, and you can choose whether to accept it.",
  "options": [{"label": "Save", "effect": "Keeps the selected product and opens its product-specific questions, then checkout (account wall).", "effectType": "next-question", "affects": [], "evidence": "observed"},
              {"label": "Edit", "effect": "Opens pickers: 'Choose a treatment:', 'Choose a strength:', 'Choose a quantity:', 'Choose a frequency:' (runs/b2-men-edit). The treatment list is the five products returned by gettreatmentoptions: Finasteride, Regaine, Propecia, Avodart, Dutasteride.", "effectType": "none", "affects": ALL, "evidence": "observed"},
              {"label": "Choose for me", "effect": "Opens 'Add a note for your clinician. If there's anything else you want your clinician to know, you can add it here.' with a text box and Continue; the clinician picks the product after checkout.", "effectType": "flag-for-clinician", "affects": [], "evidence": "observed"}],
  "purpose": "Product choice before the account wall. For the baseline the server returned mode 'Offline' with the message 'We still need to review your consultation to give you the best recommendation, but it would be helpful to know if there's a treatment option you prefer.' (code, gettreatmentoptions).",
  "engineRole": "product-selector", "branches": True, "branchDetail": "Which product is pre-selected depends on the entry link (product=... pre-selects that product; general entry pre-selects Finasteride).",
  "shownWhen": "always", "evidence": "observed"}); order += 1
def secq(src, prod, pid, cond):
    global order
    out = []
    for k, q in enumerate(src['questions']):
        out.append({"id": f"men-sec-{pid}-{k+1}", "order": order, "stage": "anonymous", "type": "single" if len(q['options']) > 1 else "consent",
          "text": q['text'] + ((' ' + q['subText']) if q.get('subText') else ''),
          "options": [{"label": o['text'], "effect": "Moves on (no flag in served data)." if o['frontendAction'] == 'Proceed' else o['frontendAction'], "effectType": "next-question" if o['frontendAction'] == 'Proceed' else 'unknown', "affects": [], "evidence": "code"} for o in q['options']],
          "purpose": f"Product-specific question for {prod}.", "engineRole": "consent" if len(q['options']) == 1 else "safety-screen",
          "branches": False, "branchDetail": "", "shownWhen": cond, "evidence": "observed"}); order += 1
    return out
qs += secq(SEC_F, 'Finasteride', 'fin', "after Save with Finasteride selected (runs/b3-men-save); Propecia probably the same (not captured)")
qs += secq(SEC_D, 'Dutasteride and Avodart', 'dut', "after Save with Dutasteride or Avodart selected (runs/p2-dutasteride-save, runs/p2-avodart-save: identical)")
qs.append({"id": "men-checkout", "order": order, "stage": "checkout", "type": "contact",
  "text": "Payment and delivery — Patient details: First name (as it appears on your ID), Last name, Date of birth (DD-MM-YYYY), Email, Phone (+44). Then Your address, Payment. Order summary with 'Edit my choice' and '*This is a cancellable subscription that auto-renews. Cancel online, anytime, right up to the day before your next order is created.'",
  "options": [], "purpose": "ACCOUNT WALL: identity and contact details. Not filled in (protocol). Date of birth is first asked here, so the auto-offer age limit (18-49) can only be applied after the wall.",
  "engineRole": "identity", "branches": False, "branchDetail": "", "shownWhen": "after product questions", "evidence": "observed"})

d = {
 "slug": "treated", "company": "Treated", "market": "UK", "website": "https://uk.treated.com/",
 "parent": "HR Healthcare Ltd t/a Treated (company 06790962, Bolton); footer also names Webcare Group Limited; pharmacy GPhC 9010946",
 "audiences": ["men"],
 "model": "Multi-condition UK online doctor and pharmacy; hair loss is a men-only condition sold through one generic questionnaire with licensed and off-label tablets and branded minoxidil on monthly-to-6-monthly subscriptions.",
 "checkedOn": "2026-11-23",
 "access": {"howTested": ["live-walk", "site-code", "public-docs"],
  "accountWall": "Checkout 'Patient details' page (start.treated.com/GBR/en/#/checkout): first name, last name, date of birth, email, phone. Reached after the questionnaire, height/weight, medical profile, the treatment options screen and the product questions. The full recommendation screen and prices are shown before the wall.",
  "blockers": ["Women cannot start the hair-loss consultation (sex gate hard stop).", "Occasional late cookie banner and timing flakes in replays (one Regaine walk failed twice)."],
  "coverageNote": "Men's flow walked end to end up to the account wall from the general entry and from Dutasteride, Avodart and Regaine product entries. Full question set, options and per-option frontend actions come from the JSON the app serves (quiz-definition-male.json). Product list, prices and auto-offer rules come from gettreatmentoptions. Medical-profile pop-up wording is from the served locale file; only the first pop-up was seen live. No one-change experiments yet (stage 2). Propecia product questions not captured; Regaine has none."},
 "products": products,
 "flows": [{"id": "men", "name": "Hair loss consultation (men only)", "audience": "men",
   "entryUrl": "https://uk.treated.com/consultation-startup?condition=024&uf=cond",
   "stagesSummary": "Start page → sex (+18+/terms) → 11 hair-loss questions → GP info → height/weight → medical profile (9 ticks) → confirm → 'checking what's safe' → treatment options (pre-selected product, Edit, Choose for me) → product questions (1 for finasteride, 3 for dutasteride/Avodart, none for Regaine) → checkout patient details = account wall. Product buttons (…&product=024-143 Finasteride, 024-313 Propecia, 024-1973 Dutasteride, 024-1915 Avodart, 024-322 Regaine, &uf=prod) use the same questions and only change the pre-selected product.",
   "questions": qs}],
 "rules": [], "experiments": [], "recommendations": [{"profile": "Baseline man (general entry): pattern = receding front + thinning on top, over 3 months, not seen a doctor, no previous treatment, no scars, normal BP checked in last 6 months, no conditions, no symptoms, 5ft10 12st, empty medical profile", "offered": ["fin", "reg", "prop", "avo", "dut"], "default": "fin", "note": "Server mode 'Offline' (clinician review, not auto-offer), message 'We still need to review your consultation...'. Finasteride 1mg x28 £34.95/month pre-selected. Product-button entries pre-select that product instead (runs/p1-dutasteride, runs/p2-regaine-save).", "evidence": "observed"}],
 "engineSummary": "",
 "strengths": ["Full price list and a pre-selected product are shown before any contact details.", "Short, quick questionnaire (site says about 2 minutes 21 seconds).", "Clear hard stop for a history of mental illness with finasteride; explicit off-label acknowledgement for dutasteride."],
 "weaknesses": ["No women's hair-loss service at all.", "Age is not asked until checkout, so the 18-49 auto-offer limit cannot act before the wall.", "Same blunt questions for every product; minoxidil blood-pressure questions are asked even when only tablets are wanted.", "Compounded finasteride + minoxidil drops listed but unavailable."],
 "opportunities": ["Women's hair loss (minoxidil, spironolactone, oral minoxidil) is not served by Treated.", "Topical finasteride / combination sprays: their only topical combo is out of stock."],
 "sources": [
  {"title": "Hair loss category", "url": "https://uk.treated.com/hair-loss"},
  {"title": "Finasteride", "url": "https://uk.treated.com/hair-loss/finasteride"},
  {"title": "Propecia", "url": "https://uk.treated.com/hair-loss/propecia"},
  {"title": "Dutasteride", "url": "https://uk.treated.com/hair-loss/dutasteride"},
  {"title": "Avodart", "url": "https://uk.treated.com/hair-loss/avodart"},
  {"title": "Regaine", "url": "https://uk.treated.com/hair-loss/regaine"},
  {"title": "Finasteride + Minoxidil Drops", "url": "https://uk.treated.com/hair-loss/finasteride-minoxidil-drops"},
  {"title": "Compare hair loss treatments", "url": "https://uk.treated.com/hair-loss/compare"},
  {"title": "Off-label and unlicensed medicines policy", "url": "https://uk.treated.com/off-label-prescribing"},
  {"title": "FAQ (age 18+, subscriptions, clinician review)", "url": "https://uk.treated.com/faq"},
  {"title": "How it works", "url": "https://uk.treated.com/how-it-works"},
  {"title": "Terms and conditions", "url": "https://uk.treated.com/terms-and-conditions"},
  {"title": "Consultation start (hair loss)", "url": "https://uk.treated.com/consultation-startup?condition=024&uf=cond"}],
 "limitations": ["Nothing after the account wall was seen (photo upload texts for scalp exist in the locale file, so photos may be requested later for some cases; unconfirmed).", "Server decides auto-offer vs clinician review; the rules in served JSON are read, not yet tested one by one.", "Propecia product questions not captured (probably the same single finasteride warning)."],
}
json.dump(d, open('company.json', 'w'), indent=1, ensure_ascii=False)
print('questions', len(qs))
