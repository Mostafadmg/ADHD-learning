# Builds companies/ro/company.json from the saved quiz definitions plus hand-written annotations.
# Run:  python3 -I scripts/build_company.py     (from companies/ro/)
# Question wording and option wording are copied by the script from the schema files, never retyped.
import json, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/'
men = json.load(open(BASE + 'quiz-definition.men-onboarding.raw.json'))
women = json.load(open(BASE + 'quiz-definition.women-onboarding.raw.json'))
MQ = {q['qid']: q for g in men['groups'] for q in g['questions']}
WQ = {q['qid']: q for g in women['groups'] for q in g['questions']}

MEN_SCHEMA = 'quiz-definition.men-onboarding.raw.json'
WOMEN_SCHEMA = 'quiz-definition.women-onboarding.raw.json'
RECO_CODE = 'raw/js/48419.chunk.js (function Ye: getFinalRecommendation)'

# ----------------------------------------------------------------------------- products
products = [
 {"id": "p1", "name": "Ro Mane Spray (3-in-1 topical spray; older name on site: Roman Hair Solution Rx / topical finasteride)",
  "category": "rx-topical-compounded",
  "actives": [{"name": "minoxidil", "strength": "6%"}, {"name": "finasteride", "strength": "0.3%"}, {"name": "tretinoin", "strength": "0.025%"}],
  "form": "topical spray, 4 oz bottle, once daily (no more than 4 sprays a day)", "audience": "men",
  "legalStatus": "US compounded prescription medicine (not FDA-approved); catalogue rx_type 'rx_compound', pharmacy name 'Compounded Topical Liquid'",
  "price": "$50 a month on the quarterly plan (one 4 oz bottle per 3 months)",
  "priceDetail": "$43 a month on the 6-month plan. No 12-month plan (catalogue delivery choices: quarterly, semiannually). Recommender card says 'Starting at $43/mo'. Landing-page coupons: 35% or 50% off the first order if prescribed.",
  "url": "https://ro.co/medications/ro-mane-spray/",
  "recommendedWhen": "Default recommended treatment in the men's visit: it is first in the fixed order spray, oral finasteride, oral minoxidil. It loses the 'recommended' place when any answer sets noRecTopicalCombined, or when compounded products are not supported in the patient's state (then it is hidden).",
  "evidence": "code",
  "evidenceDetail": "raw/grouped-products-condition6-men.json (group hl-topical-spray-group, product hl-topical-spray-product); prices also on https://ro.co/pricing/"},
 {"id": "p2", "name": "Oral finasteride 1 mg (generic Propecia)", "category": "rx-oral",
  "actives": [{"name": "finasteride", "strength": "1 mg"}], "form": "tablet, one a day", "audience": "men",
  "legalStatus": "US Rx (FDA-approved generic for male pattern hair loss)",
  "price": "$20 a month on the quarterly plan",
  "priceDetail": "$18 a month on the 6-month plan, $16 a month on the 12-month plan. Catalogue: $0.66 a tablet, 30 a month. Recommender card says 'Starting at $16/mo'.",
  "url": "https://ro.co/medications/finasteride/",
  "recommendedWhen": "Recommended when Ro Mane Spray is flagged (noRecTopicalCombined) or not available in the state, and noRecOralFin is not set. Example from the schema: a history of prostate cancer flags the spray only, so finasteride tablets become the recommendation.",
  "evidence": "code", "evidenceDetail": "raw/grouped-products-condition6-men.json (group hs-finasteride, product Finasteride1mg); https://ro.co/pricing/"},
 {"id": "p3", "name": "Oral minoxidil 2.5 mg (generic Loniten, low dose, off-label for hair loss)", "category": "rx-oral",
  "actives": [{"name": "minoxidil", "strength": "2.5 mg"}], "form": "tablet, one a day", "audience": "men",
  "legalStatus": "US Rx, FDA-approved for high blood pressure only; used off-label for hair loss; boxed warning",
  "price": "$30 a month on the quarterly plan",
  "priceDetail": "$27 a month on the 6-month plan, $24 a month on the 12-month plan. Catalogue: $1.00 a tablet. Recommender card says 'Starting at $24/mo'.",
  "url": "https://ro.co/medications/oral-minoxidil/",
  "recommendedWhen": "Last in the recommendation order. Recommended only when both the spray and oral finasteride are flagged (for example depression, anxiety, erectile dysfunction, trying for a baby, or bad experience with finasteride) and noRecOralMin is not set.",
  "evidence": "code", "evidenceDetail": "raw/grouped-products-condition6-men.json (group hl-oral-minoxidil, product oral-minoxidil-2-5-mg); https://ro.co/pricing/"},
 {"id": "p4", "name": "Oral minoxidil 5 mg a day (two 2.5 mg tablets)", "category": "rx-oral",
  "actives": [{"name": "minoxidil", "strength": "5 mg a day (2 x 2.5 mg)"}], "form": "tablets, two a day", "audience": "men",
  "legalStatus": "US Rx, off-label for hair loss",
  "price": "$30 a month (catalogue: $0.50 a tablet, 60 tablets a month)",
  "priceDetail": "Same monthly price as the 2.5 mg plan in the catalogue. Not selectable in the onboarding visit; no public page.",
  "url": "https://ro.co/medications/oral-minoxidil/",
  "recommendedWhen": "unknown. It exists in the catalogue (group hl-oral-minoxidil-5mg) but no onboarding answer adds it; probably a clinician dose step (inferred).",
  "evidence": "code", "evidenceDetail": "raw/grouped-products-condition6-men.json (group hl-oral-minoxidil-5mg, product oral-minoxidil-5-mg)"},
 {"id": "p5", "name": "Minoxidil Topical Solution 5%, 60 mL (generic Rogaine)", "category": "otc-medicine",
  "actives": [{"name": "minoxidil", "strength": "5%"}], "form": "topical solution, 1 mL twice a day, one 60 mL bottle a month", "audience": "men",
  "legalStatus": "US OTC (FDA-approved non-prescription medicine); no clinician review (catalogue: requires_prescription false, requires_review false)",
  "price": "$16 a month on the 3-month plan ($48 per shipment)",
  "priceDetail": "$14 a month on the 6-month plan; $13 a month on the 12-month plan ($156 a year: $192 less a $36 refill-frequency discount).",
  "url": "https://ro.co/medications/minoxidil/",
  "recommendedWhen": "Never recommended by the visit. Bought directly through its own 'Buy now' link (no medical questions); also exists as an add-on product in the catalogue (hl-minoxidil-addon-group).",
  "evidence": "observed", "evidenceDetail": "runs/probe-vwayzg (cart summary and pricer response); raw/grouped-products-condition6-men.json"},
 {"id": "p6", "name": "Finasteride tablets + topical minoxidil together", "category": "bundle",
  "actives": [{"name": "finasteride", "strength": "1 mg"}, {"name": "minoxidil", "strength": "5% topical"}], "form": "tablet plus topical solution", "audience": "men",
  "legalStatus": "US Rx (finasteride) plus US OTC (minoxidil solution)",
  "price": "$1.17 a day on a quarterly plan (hair-loss FAQ); catalogue sum is $20 + $16 = $36 a month",
  "priceDetail": "The FAQ figures ($0.67 a day finasteride, $0.53 a day minoxidil, $1.17 a day together) look older than the pricing page; treat as approximate.",
  "url": "https://ro.co/faq/hair-loss/",
  "recommendedWhen": "Docs only: 'In some cases, your doctor or nurse practitioner may recommend using finasteride and minoxidil together.' The older two-product preference screen (qid 3200) describes finasteride as suited to people who 'would like to also use topical minoxidil'. Not a separate choice in the current visit.",
  "evidence": "docs"},
 {"id": "p7", "name": "Ro Revive Shampoo (8 oz)", "category": "cosmetic",
  "actives": [{"name": "saw palmetto, pumpkin seed oil, salicylic acid, caffeine", "strength": "not stated"}], "form": "shampoo, 8 oz bottle", "audience": "men",
  "legalStatus": "US cosmetic (sold as 'OTC' type in the catalogue, no prescription, no review)",
  "price": "$24 per 3 months (one bottle every 3 months)", "priceDetail": "Only a 3-month plan. Offered as an add-on in the men's visit catalogue.",
  "url": "https://ro.co/products/revive-shampoo/",
  "recommendedWhen": "Never recommended by the medical questions. Own 'Buy now' flow; loaded as an add-on in the men's visit (schema meta include_product_codes).",
  "evidence": "observed", "evidenceDetail": "runs/probe-kwrssq"},
 {"id": "p8", "name": "Ro Restore Conditioner (8 oz)", "category": "cosmetic",
  "actives": [{"name": "plant proteins, coconut oil, shea butter", "strength": "not stated"}], "form": "conditioner, 8 oz bottle", "audience": "men",
  "legalStatus": "US cosmetic (catalogue type 'OTC', no prescription, no review)",
  "price": "$24 per 3 months (one bottle every 3 months)", "priceDetail": "Only a 3-month plan. Shown as a 'Popular add-on' on the shampoo checkout.",
  "url": "https://ro.co/products/restore-conditioner/",
  "recommendedWhen": "Never recommended by the medical questions. Own 'Buy now' flow; add-on to the shampoo order and to the men's visit.",
  "evidence": "observed", "evidenceDetail": "runs/probe-qcalmd; quiz-definition.shampoo.raw.json (Checkout/Addons)"},
 {"id": "p9", "name": "Hair Support Supplement", "category": "supplement",
  "actives": [{"name": "unknown", "strength": "unknown"}], "form": "box of 90 (catalogue: quantity 90, 30-day supply)", "audience": "men",
  "legalStatus": "US dietary supplement (inferred from the name; no product page found)",
  "price": "unknown", "priceDetail": "The catalogue lists the group roman-hair-support-supplement with monthly and quarterly delivery choices but no purchasable product inside it, and the sitemap has no page for it. It may be withdrawn or paused.",
  "url": "",
  "recommendedWhen": "unknown. Requested as an add-on code by every men's hair schema (include_product_codes) but the group comes back empty.",
  "evidence": "code", "evidenceDetail": "raw/grouped-products-condition6-men.json"},
 {"id": "p10", "name": "Women's oral minoxidil (low dose)", "category": "rx-oral",
  "actives": [{"name": "minoxidil", "strength": "exact strength not published; site says 0.25 to 2.5 mg is the typical range for women"}], "form": "tablet, once a day", "audience": "women",
  "legalStatus": "US Rx, off-label for hair loss; boxed warning",
  "price": "$30 a month, quarterly plan",
  "priceDetail": "The pricing page and the consultation both say quarterly; the women's landing page says 'billed and shipped every 2 months'. Only one plan length is published.",
  "url": "https://ro.co/medications/womens-oral-minoxidil/",
  "recommendedWhen": "Offered when the patient is eligible for oral minoxidil (not breastfeeding, none of: heart condition, stroke, lupus or other autoimmune disorder, phaeochromocytoma, pulmonary hypertension, high blood pressure) and aged 65 or under. It is the default in the cart when she picks 'No preference'.",
  "evidence": "code", "evidenceDetail": WOMEN_SCHEMA + " qid 4020, 4025, 4040; https://ro.co/pricing/"},
 {"id": "p11", "name": "Hair Solution Rx (women's compounded topical)", "category": "rx-topical-compounded",
  "actives": [{"name": "minoxidil", "strength": "5%"}, {"name": "tretinoin", "strength": "0.025%"}, {"name": "melatonin", "strength": "0.1%"}], "form": "topical solution, once a day", "audience": "women",
  "legalStatus": "US compounded prescription medicine (not FDA-approved)",
  "price": "$40 a month, quarterly plan", "priceDetail": "Only one plan length is published. Site: do not use if pregnant or trying to get pregnant.",
  "url": "https://ro.co/medications/hair-solution-rx/",
  "recommendedWhen": "Offered as a choice to every eligible woman; it becomes the only treatment offered (no choice screen) when oral minoxidil is ruled out or the patient is over 65.",
  "evidence": "code", "evidenceDetail": WOMEN_SCHEMA + " qid 4020, 4025, 4030; https://ro.co/pricing/"},
]

FLAG = {'noRecTopicalCombined': 'p1', 'noRecOralFin': 'p2', 'noRecOralMin': 'p3'}
PNAME = {'p1': 'Ro Mane Spray', 'p2': 'oral finasteride', 'p3': 'oral minoxidil'}
HL_NOTE = " The schema also marks this answer highlight='%s' (no patient-facing effect found in the code; probably shown highlighted to the reviewing clinician)."

def men_auto(a, follow=None):
    vm = dict(a.get('variable_modifications') or [])
    flags = [k for k in ('noRecTopicalCombined', 'noRecOralFin', 'noRecOralMin') if vm.get(k) == '1']
    hl = (a.get('meta') or {}).get('highlight')
    affects, ev = [FLAG[f] for f in flags], 'code'
    if len(flags) == 3:
        et = 'product-removed'
        eff = ("Sets all three no-recommend flags (noRecTopicalCombined, noRecOralFin, noRecOralMin). The recommender then returns 'no-recommendation': the recap loader is skipped and the result "
               "screen is headed 'Your treatment options' with no recommended treatment. All three treatments are still listed and can still be picked; there is no stop screen. The clinician decides.")
    elif 'noRecTopicalCombined' in flags:
        nxt = [p for p in ('p1', 'p2', 'p3') if p not in affects][0]
        et = 'product-switched'
        eff = ("Sets " + ' and '.join(flags) + ". Ro Mane Spray can no longer be the recommended treatment" + (", nor can " + PNAME[affects[1]] if len(affects) > 1 else "") +
               "; with no other flags the recommendation becomes " + PNAME[nxt] + ". Flagged treatments stay listed under 'Other treatment options' and can still be picked.")
    elif flags == ['noRecOralMin']:
        et = 'product-removed'
        eff = ("Sets noRecOralMin: oral minoxidil can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended, oral minoxidil is "
               "still listed as an option); it matters when the spray and finasteride are also flagged or the spray is not available in the patient's state.")
    elif flags == ['noRecOralFin']:
        et = 'product-removed'
        eff = ("Sets noRecOralFin: oral finasteride can never be shown as the recommended treatment. With no other flags nothing visible changes (Ro Mane Spray is still recommended); "
               "it matters when the spray is also flagged or not available in the state, when the recommendation then skips to oral minoxidil.")
    elif hl:
        et, ev = 'flag-for-clinician', 'inferred'
        eff = "No engine variable changes and no stop. The flow carries on."
    else:
        et = 'none'
        eff = "No flag and no stop in the schema; the answer is saved for the clinician."
    if hl:
        eff += HL_NOTE % hl
    if follow:
        eff = follow + ' ' + eff
        if et in ('none', 'flag-for-clinician'):
            et, ev = 'extra-questions', 'code'
    return eff, et, affects, ev

def opt(label, effect, etype, affects=None, evidence='code'):
    return {"label": label, "effect": effect, "effectType": etype, "affects": affects or [], "evidence": evidence}

def build(flow, QS, spec, auto):
    out = []
    for order, s in enumerate(spec, 1):
        qid = s['qid']; q = QS[qid]
        opts = []
        if s.get('options') is not None:
            opts = s['options']
        else:
            for a in sorted(q['answers'], key=lambda a: a['position']):
                ov = (s.get('ov') or {}).get(a['slug'])
                if ov:
                    eff, et, aff, ev = ov
                else:
                    eff, et, aff, ev = auto(a, (s.get('follow') or {}).get(a['slug']))
                label = a['text']
                expl = (a.get('meta') or {}).get('explanation')
                o = opt(label, eff, et, aff, ev)
                if expl: o['helpText'] = expl
                if a.get('exclusive'): o['exclusive'] = True
                o['slug'] = a['slug']
                opts.append(o)
        item = {
            "id": "%s-q%d" % (flow, qid), "order": order, "stage": s.get('stage', 'after-account'),
            "text": s.get('text') or q['text'], "type": s['type'], "options": opts,
            "purpose": s['purpose'], "engineRole": s['role'],
            "branches": bool(s.get('branchDetail')), "branchDetail": s.get('branchDetail', ''),
            "shownWhen": s.get('shownWhen', 'always'), "evidence": s.get('evidence', 'code'),
            "schemaQid": qid,
        }
        desc = (q.get('meta') or {}).get('description') or (q.get('meta') or {}).get('extraText')
        if desc and not s.get('noDesc'):
            item['helpText'] = desc if len(desc) < 900 else desc[:900] + ' […full text in the quiz-definition file]'
        if s.get('note'): item['note'] = s['note']
        out.append(item)
    return out

# ----------------------------------------------------------------------------- men's flow
NOEFF_MKT = lambda v, bullet: ("Sets %s=1. Only used to build the 'Here's a quick recap' bullet list shown on the loader before the recommendation (bullet: '%s'). It does not change which treatment is recommended." % (v, bullet), 'marketing-only', [], 'code')
EXTRA_TRIED = ("Sets %s=1. Branch: the next question becomes 'What's the main reason you're looking for hair loss solutions now?' (instead of 'why haven't you tried'), and after the account wall the visit adds "
               "'What hair loss treatments have you used?' with follow-ups about each one. Does not change the recommendation by itself.")
men_spec = [
 dict(qid=20, stage='anonymous', type='multi', role='marketing', evidence='observed',
      purpose="Opening question about goals. In the code the three goal variables only feed the personalised recap bullets; the recommendation logic ignores them.",
      ov={'regrow-my-hair': NOEFF_MKT('goalRegrowth', 'You want to regrow your hair'),
          'get-thicker-fuller-hair': NOEFF_MKT('goalThickerAndFuller', 'You want fuller, thicker hair'),
          'proactively-prevent-hair-loss': NOEFF_MKT('goalPrevention', 'You want to prevent future hair loss')}),
 dict(qid=22, stage='anonymous', type='multi', role='personalisation', evidence='observed',
      purpose="Splits people who have tried something from first-timers. Decides the next marketing question and whether the past-treatment questions are asked later.",
      branchDetail="Any 'tried' answer -> qid 28 now and qid 240 onwards later (fork 25 and fork 229). 'None of the above' -> qid 26 and the past-treatment block is skipped.",
      ov={'hair-loss-solutions-non-prescription': (EXTRA_TRIED % 'hasTriedNonPrescription', 'extra-questions', [], 'code'),
          'hair-loss-solutions-prescription-medications': (EXTRA_TRIED % 'hasTriedPrescription', 'extra-questions', [], 'code'),
          'hair-loss-solutions-none-of-the-above': ("Sets hasNotTriedAnyPrescription=1. Next question is 'What's the main reason you haven't tried hair loss treatment before?' (seen in runs/baseline-men). The past-treatment questions are skipped.", 'skip-questions', [], 'observed')}),
 dict(qid=26, stage='anonymous', type='single', role='marketing', evidence='observed', shownWhen="qid 22 = 'None of the above' (fork 25)",
      purpose="Objection capture for first-timers. Two answers feed recap bullets; none changes the treatment.",
      ov={'not-sure-itll-work': NOEFF_MKT('notSureAboutHairLossTreatment', 'Want to see real results'),
          'seems-too-expensive': ("No variable is set. Marketing data only.", 'marketing-only', [], 'code'),
          'nervous-about-side-effects': ("No variable is set (it does not steer away from finasteride). Marketing data only.", 'marketing-only', [], 'code'),
          'didnt-want-or-need-to-until-now': NOEFF_MKT('didntWantOrNeedHairLossTreatment', 'Looking to get started')}),
 dict(qid=28, stage='anonymous', type='single', role='marketing', shownWhen="qid 22 includes a 'tried' answer (fork 25)",
      purpose="Motivation capture for people who have tried something. Two answers feed recap bullets; none changes the treatment.",
      ov={'over-the-counter-solutions-didnt-work-for-me': NOEFF_MKT('lookingBecauseOtcNotWork', 'Looking for prescription-strength'),
          'i-want-to-maximize-results-with-a-new-or-additional-product': ("No variable is set. Marketing data only.", 'marketing-only', [], 'code'),
          'i-want-an-easier-or-more-convenient-solution-like-a-pill-or-a-spray': NOEFF_MKT('lookingForEasierSolution', 'Looking for an easier solution'),
          'ive-experienced-side-effects-with-past-solutions': ("No variable is set here (side effects are asked about again, per medicine, after the account wall). Marketing data only.", 'marketing-only', [], 'code')}),
 dict(qid=55, stage='anonymous', type='contact', role='identity', evidence='observed', options=[],
      text="Ro members start seeing results in as little as three months [testimonial carousel, then 'Your treatment options: We offer clinically proven ingredients like finasteride, minoxidil, or both in a convenient topical spray.'] covered by a pop-up: 'See how much fuller your hair could be in just 3 months' with an Email address field, 'I agree to privacy policy', 'I agree to terms and consent to telehealth', Continue, 'Continue with Google'",
      purpose="ACCOUNT WALL. Email capture and consent before any medical question. No product, price or recommendation is shown before it, only a general line about ingredients.",
      note="The pop-up cannot be closed: 'Dismiss' leaves it in place (runs/men-wall-dismiss). Nothing was typed into it."),
 dict(qid=80, type='contact', role='identity', options=[], shownWhen="the email already belongs to a member (memberExists == 1)",
      purpose="Log-in screen for existing members."),
 dict(qid=112, type='contact', role='eligibility-gate',
      text="Answer a few questions to see if you’re eligible for treatment. [form 'The Basics': Birthdate, Sex Assigned at Birth, Zipcode, Mobile phone number]",
      purpose="Identity and three hard gates: age (minAge 18), sex (allowedGenders: male) and whether Ro serves the zip code.",
      branchDetail="Under 18 -> exit 7010. Female -> fork 7060 (redirect offer to the women's visit, or an exit form). Unsupported zip -> exit 7030. Otherwise -> qid 132.",
      options=[opt("(engine outcome) Under 18 years old", "Hard stop: 'Unfortunately our hair loss treatment is not available to people under 18.' with a comment form.", 'hard-stop', ['p1', 'p2', 'p3']),
               opt("(engine outcome) Female", "Leaves the men's visit: either a screen 'We have a better experience for you!' with a button to the women's visit (/tefcyb), or, if the redirect flag is off, 'Unfortunately our hair loss treatment is currently only available to men.'", 'hard-stop', ['p1', 'p2', 'p3']),
               opt("(engine outcome) Not supported zip code", "Hard stop: 'Be notified when we’re in your area!'", 'hard-stop', ['p1', 'p2', 'p3']),
               opt("(engine outcome) Next", "Continues to the medical questions. No upper age limit exists in the men's schema.", 'next-question')]),
 dict(qid=132, type='multi', role='diagnosis',
      purpose="Pattern of loss. Typical male-pattern areas carry on; patchy loss is treated as a red flag for another diagnosis; 'nowhere yet' is the prevention route.",
      branchDetail="Hairline, crown or overall -> onset, severity and scalp-symptom questions (150, 160, 170). Patches or 'Nowhere yet' -> jump to fork 229, skipping those three. How mixed selections route is not known.",
      note="After this question the schema shows an interstitial: 'Let’s talk about your health. Great, now a few questions about your overall health.'",
      follow={'patches': "Routes straight to the past-treatment fork (229), skipping the onset, severity and scalp-symptom questions."},
      ov={'hairline': ("Sets thinningHairline=1 (recap bullet 'Thinning hairline'; two or more areas become 'Thinning in multiple areas'). Goes on to the onset question. No effect on the recommendation.", 'next-question', [], 'code'),
          'crown': ("Sets thinningCrown=1 (recap bullet 'Thinning crown'). Goes on to the onset question. No effect on the recommendation.", 'next-question', [], 'code'),
          'overall-thinning': ("Sets thinningOverall=1 (recap bullet 'Thinning in several areas'). Goes on to the onset question. No effect on the recommendation.", 'next-question', [], 'code'),
          'prevent-hair-loss': ("Exclusive answer. Skips the onset, severity and scalp-symptom questions. Sets no flag, so the recommendation is unchanged (Ro Mane Spray) even with no visible hair loss.", 'skip-questions', [], 'code')}),
 dict(qid=150, type='single', role='diagnosis', shownWhen="qid 132 includes hairline, crown or overall thinning",
      purpose="Speed of onset. Sudden loss points away from male-pattern hair loss."),
 dict(qid=160, type='single', role='data-capture', shownWhen="qid 132 includes hairline, crown or overall thinning",
      purpose="Self-rated severity, kept as a baseline to track over time. No option changes anything in the engine."),
 dict(qid=170, type='multi', role='safety-screen', shownWhen="qid 132 includes hairline, crown or overall thinning",
      purpose="Scalp red flags (inflammation, scarring, infection, eyebrow or eyelash loss). Only redness or rash removes the recommendation; the others are flags."),
 dict(qid=240, type='multi', role='personalisation', shownWhen="qid 22 includes a 'tried' answer (fork 229)",
      purpose="Which treatments were used before. Opens a follow-up block per medicine; steroid injections are treated as a sign of another diagnosis.",
      branchDetail="Each ticked medicine opens its own follow-ups (forks 250, 280, 300, 330, 350).",
      follow={'oral-minoxidil': "Opens 'What dose of oral minoxidil did you use?' and 'Did oral minoxidil work well for you?'. Also sets isEligibleFor6And12MonthShipments=1 (not used in the downloaded front-end code; by its name it unlocks the 6- and 12-month plans for people already established on the medicine: inferred).",
              'topical-minoxidil': "Opens 'Did topical minoxidil work well for you?'.",
              'oral-finasteride': "Opens 'What dose of oral finasteride did you use?' and 'Did oral finasteride work well for you?'. Also sets isEligibleFor6And12MonthShipments=1 (see oral minoxidil).",
              'topical-finasteride': "Opens 'Did topical finasteride work well for you?'.",
              'other-treatment': "Opens a free-text box 'What other hair loss treatments have you tried?'."}),
 dict(qid=255, type='single', role='personalisation', shownWhen="qid 240 includes 'Oral minoxidil'",
      purpose="Previous oral minoxidil dose, for the prescriber. No option sets a variable.", branchDetail="'Other' opens a free-text dose box (qid 260).",
      follow={'oral-min-dosage-other': "Opens the free-text box 'What daily dosage of oral minoxidil were you taking most recently?'."}),
 dict(qid=260, type='text', role='data-capture', shownWhen="qid 255 = 'Other'", purpose="Free-text previous oral minoxidil dose."),
 dict(qid=265, type='single', role='product-selector', shownWhen="qid 240 includes 'Oral minoxidil'",
      purpose="Past response to oral minoxidil. Side effects, no effect or allergy stop it being recommended; allergy also blocks the spray (which contains minoxidil).",
      branchDetail="'Other' opens a free-text box (qid 270).", follow={'oral-min-effectiveness-other': "Opens a free-text box about how the treatment went."}),
 dict(qid=270, type='text', role='data-capture', shownWhen="qid 265 = 'Other'", purpose="Free text about past oral minoxidil treatment."),
 dict(qid=285, type='single', role='product-selector', shownWhen="qid 240 includes 'Topical minoxidil'",
      purpose="Past response to topical minoxidil. Only an allergy changes the engine (spray no longer recommended).",
      branchDetail="'Other' opens a free-text box (qid 290).", follow={'topical-min-effectiveness-other': "Opens a free-text box about how the treatment went."}),
 dict(qid=290, type='text', role='data-capture', shownWhen="qid 285 = 'Other'", purpose="Free text about past topical minoxidil treatment."),
 dict(qid=305, type='single', role='personalisation', shownWhen="qid 240 includes 'Oral Finasteride'",
      purpose="Previous finasteride dose, for the prescriber.", branchDetail="'Other' opens a free-text dose box (qid 310).",
      follow={'oral-fin-dosage-other': "Opens the free-text box 'What daily dosage of oral finasteride were you taking most recently?'."}),
 dict(qid=310, type='text', role='data-capture', shownWhen="qid 305 = 'Other'", purpose="Free-text previous finasteride dose."),
 dict(qid=315, type='single', role='product-selector', shownWhen="qid 240 includes 'Oral Finasteride'",
      purpose="Past response to oral finasteride. Side effects or allergy flag both finasteride products (tablet and spray); 'not effective' flags the tablet only.",
      branchDetail="'Other' opens a free-text box (qid 320).", follow={'oral-fin-effectiveness-other': "Opens a free-text box about how the treatment went."}),
 dict(qid=320, type='text', role='data-capture', shownWhen="qid 315 = 'Other'", purpose="Free text about past oral finasteride treatment."),
 dict(qid=335, type='single', role='product-selector', shownWhen="qid 240 includes 'Topical finasteride'",
      purpose="Past response to topical finasteride. Only an allergy changes the engine.",
      branchDetail="'Other' opens a free-text box (qid 340).", follow={'topical-fin-effectiveness-other': "Opens a free-text box about how the treatment went."}),
 dict(qid=340, type='text', role='data-capture', shownWhen="qid 335 = 'Other'", purpose="Free text about past topical finasteride treatment."),
 dict(qid=355, type='text', role='data-capture', shownWhen="qid 240 includes 'Other'", purpose="Free text: other hair-loss treatments tried."),
 dict(qid=370, type='single', role='safety-screen',
      purpose="Blood pressure history, mainly for oral minoxidil (a blood-pressure medicine) and the minoxidil spray.",
      branchDetail="High -> qid 381. Low -> qid 391. Either, or 'I'm not sure' -> information screen 395. 'No' -> straight to qid 1000. The schema lets high and low both be recorded (two follow-up forks).",
      follow={'yes-have-been-diagnosed-or-treated-for-high-bp': "Sets followupHighBloodPressure=1 and opens 'have your blood pressure readings still been “very high”?' then the blood-pressure information screen.",
              'yes-have-been-diagnosed-or-treated-for-low-bp': "Sets followupLowBloodPressure=1 and opens 'have your blood pressure readings still been “low”?' then the blood-pressure information screen.",
              'not-sure-if-diagnosed-or-treated-for-high-or-low-bp': "Shows the blood-pressure information screen (qid 395) before carrying on."}),
 dict(qid=381, type='single', role='safety-screen', shownWhen="qid 370 = 'Yes, for high blood pressure'",
      purpose="Uncontrolled high blood pressure check. The on-screen chart defines very high as 161+ systolic or 101+ diastolic (ranges coded in raw/js/main bundle).",
      noDesc=True),
 dict(qid=391, type='single', role='safety-screen', shownWhen="qid 370 = 'Yes, for low blood pressure'",
      purpose="Persistent low blood pressure check. The chart defines low as under 95 systolic or under 55 diastolic. A 'yes' removes every recommendation.", noDesc=True),
 dict(qid=395, type='info', role='expectation-setting', shownWhen="qid 370 is high, low or 'I'm not sure'",
      purpose="Information screen: out-of-range blood pressure may add risk; treatment 'may still be suitable'; see your own doctor."),
 dict(qid=1000, type='multi', role='safety-screen',
      purpose="General medical history. Mental-health and sexual-function conditions steer away from finasteride; phaeochromocytoma steers away from oral minoxidil; kidney, liver and stroke open follow-ups.",
      branchDetail="Stroke -> 1255 and 1260. Kidney disease -> 1275. Liver failure or cirrhosis -> 1285. 'None of the above' -> heart question.",
      follow={'stroke': "Sets stroke=1 and opens 'What type of stroke did you have?' and 'When did your stroke occur?'.",
              'kidney-disease': "Sets kidneyDisease=1 and opens 'What kind of kidney disease do you have?'.",
              'liver-diseases': "Sets liverDisease=1 and opens 'Which of these liver conditions do you have?'."},
      note="Prostate cancer flags only the spray (not finasteride tablets), so the recommendation moves to oral finasteride. This looks like a schema quirk and is worth stage 2's attention as a talking point; it cannot be tested live (behind the account wall)."),
 dict(qid=1255, type='single', role='safety-screen', shownWhen="qid 1000 includes 'Stroke'", purpose="Type of stroke, for the clinician. No engine effect."),
 dict(qid=1260, type='single', role='safety-screen', shownWhen="qid 1000 includes 'Stroke'", purpose="Timing of stroke. A stroke in the last 6 months rules out recommending oral minoxidil."),
 dict(qid=1275, type='single', role='safety-screen', shownWhen="qid 1000 includes 'Kidney disease'", purpose="Stage of kidney disease, for the clinician. No option sets a flag; stage 5 is highlighted."),
 dict(qid=1285, type='single', role='safety-screen', shownWhen="qid 1000 includes 'Liver failure or liver cirrhosis'", purpose="Type of liver disease, for the clinician. All answers are highlighted negative but none sets a flag or stops the visit."),
 dict(qid=1300, type='multi', role='safety-screen',
      purpose="Heart history. This block exists for oral minoxidil (boxed warning for the heart): several answers stop it being recommended; none touches the spray or finasteride.",
      branchDetail="Heart attack -> 1315, 1320. Bypass surgery -> 1355, 1360. Arrhythmia -> 1420 and its follow-ups. 'None of the above' -> medicines question.",
      follow={'heart-attack': "Sets heartAttack=1 and opens 'When did your heart attack occur?' and 'Are you seeing a cardiologist regularly…?'.",
              'coronary-bypass-surgery': "Sets coronaryBypassSurgery=1 and opens 'When was your coronary bypass surgery?' and the cardiologist follow-up.",
              'arrhythmia': "Sets arrhythmia=1 and opens 'What type of arrhythmia have you been diagnosed with?'."}),
 dict(qid=1315, type='single', role='safety-screen', shownWhen="qid 1300 includes 'Heart attack'", purpose="Timing of heart attack; under 6 months rules out recommending oral minoxidil."),
 dict(qid=1320, type='single', role='safety-screen', shownWhen="qid 1300 includes 'Heart attack'", purpose="Cardiology follow-up; none rules out recommending oral minoxidil."),
 dict(qid=1355, type='single', role='safety-screen', shownWhen="qid 1300 includes 'Coronary bypass surgery'", purpose="Timing of bypass surgery; under 6 months rules out recommending oral minoxidil."),
 dict(qid=1360, type='single', role='safety-screen', shownWhen="qid 1300 includes 'Coronary bypass surgery'", purpose="Cardiology follow-up after bypass; none rules out recommending oral minoxidil."),
 dict(qid=1420, type='multi', role='safety-screen', shownWhen="qid 1300 includes 'Arrhythmia'",
      purpose="Type of rhythm problem. Fast or dangerous rhythms rule out recommending oral minoxidil; atrial fibrillation and bradycardia open follow-ups.",
      branchDetail="Atrial fibrillation -> 1430 (and 1435), 1440. Bradycardia -> 1455, 1460. Other -> free text 1475.",
      follow={'atrial-fibrillation': "Sets atrialFibrillation=1 and opens the ablation and afib-medicine questions.",
              'bradycardia': "Sets bradycardia=1 and opens 'What is your resting heart rate?' and 'Have you ever fainted due to a low heart rate?'.",
              'arrhythmia-type-other': "Opens the free-text box 'Please explain your arrhythmia diagnosis'."}),
 dict(qid=1430, type='single', role='safety-screen', shownWhen="qid 1420 includes 'Atrial fibrillation (afib)'", purpose="Ablation history, for the clinician. No flag.",
      branchDetail="'Yes' adds 'Have you had afib since your ablation?'.", follow={'ablation-procedure-yes': "Opens 'Have you had afib since your ablation?'."}),
 dict(qid=1435, type='single', role='safety-screen', shownWhen="qid 1430 = 'Yes'", purpose="Afib recurrence after ablation, for the clinician. No flag."),
 dict(qid=1440, type='single', role='safety-screen', shownWhen="qid 1420 includes 'Atrial fibrillation (afib)'", purpose="Current afib medicines, for the clinician. No flag."),
 dict(qid=1455, type='single', role='safety-screen', shownWhen="qid 1420 includes 'Bradycardia'", purpose="Resting heart rate; under 50 rules out recommending oral minoxidil."),
 dict(qid=1460, type='single', role='safety-screen', shownWhen="qid 1420 includes 'Bradycardia'", purpose="Fainting from a slow heart rate; 'Yes' rules out recommending oral minoxidil."),
 dict(qid=1475, type='text', role='data-capture', shownWhen="qid 1420 includes 'Other'", purpose="Free text about the arrhythmia."),
 dict(qid=2200, type='single', role='safety-screen',
      purpose="Current medicines, picked from a searchable drug list (StructuredMedications). The catalogue marks the prescription products 'ddi_enabled', so interactions are checked after submission; no schema rule depends on the answer.",
      ov={'im-taking-medications': ("Patient searches and selects each medicine. No schema variable or branch depends on it; the list goes to the clinician (and, by the catalogue flag ddi_enabled, to a drug-interaction check: inferred).", 'flag-for-clinician', [], 'inferred'),
          'i-dont-take-any-medications': ("No effect on the flow.", 'none', [], 'code')}),
 dict(qid=2300, type='single', role='safety-screen',
      purpose="Allergies, picked from a searchable list (StructuredAllergies). No schema rule depends on the answer.",
      ov={'i-have-allergies': ("Patient searches and selects allergies. No schema variable or branch depends on it; highlighted 'caution' for the clinician.", 'flag-for-clinician', [], 'inferred'),
          'i-dont-have-allergies': ("No effect on the flow.", 'none', [], 'code')}),
 dict(qid=2350, type='single', role='product-selector', shownWhen="experiment mhlConsultativeOv = 1 (set to 100% of visitors on this entry link in raw/ro-experiments-config.json)",
      purpose="Family planning. Trying to conceive steers away from both finasteride products.",
      branchDetail="'Yes, we are' adds the caution screen (qid 2355).",
      follow={'trying-to-get-pregnant-yes-we-are': "Sets isTryingToGetPregnantInNext3Months=1 and shows the screen 'A word of caution if you’re planning to get pregnant.'"}),
 dict(qid=2355, type='info', role='expectation-setting', shownWhen="qid 2350 = 'Yes, we are'",
      purpose="Warning screen about finasteride, sexual side effects and sperm count; the patient acknowledges and continues."),
 dict(qid=2400, type='multi', role='marketing', purpose="Cross-sell: other Ro services the patient might want. No engine effect.",
      ov={s: ("No engine effect in this visit; cross-sell data.", 'marketing-only', [], 'code') for s in ['weight-loss', 'stronger-erections', 'climax-control', 'herpes-cold-sores-outbreaks', 'longevity', 'nutrition', 'skincare', 'none-of-the-above']}),
 dict(qid=2510, type='single', role='data-capture', purpose="Last open door for anything the patient wants to tell the clinician.",
      branchDetail="'Yes' opens a free-text message box (qid 2520).", follow={'yes': "Opens the box 'Please leave your message to your doctor here.'"}),
 dict(qid=2520, type='text', role='data-capture', shownWhen="qid 2510 = 'Yes'", purpose="Free-text message to the clinician."),
 dict(qid=3177, type='info', role='marketing', shownWhen="experiment mhlConsultativeOv = 1",
      purpose="Sales screen before the result, followed by a loader 'Reviewing your responses / Here’s a quick recap' that lists bullets built from the patient's own answers (goals, areas, what was tried). The loader is skipped when all three no-recommend flags are set."),
 dict(qid=3178, type='single', role='product-selector', shownWhen="experiment mhlConsultativeOv = 1",
      text="MHL Treatment Recommendation [screen title is the recommended product's line, e.g. 'The Ro Mane Spray is our most comprehensive treatment, designed for easy, once-daily use'; if nothing is recommended: 'Your treatment options'. Sub-line: 'Your provider will review your preference and determine the best option for you.' Then 'Other treatment options'.]",
      purpose="THE RECOMMENDATION SCREEN. The code picks the first treatment, in the fixed order Ro Mane Spray, oral finasteride, oral minoxidil, whose no-recommend flag is not 1 and which is available in the patient's state. That one is shown first as recommended; the rest sit under 'Other treatment options'. The patient taps one; it goes into the cart and the clinician has the final say.",
      branchDetail="The pick decides which side-effect screen follows (3230 spray, 3240 finasteride, 3250 oral minoxidil) and whether the shipping screen offers an outside pharmacy (not for the compounded spray).",
      noDesc=True,
      options=[opt("Ro Mane Spray (card: 'finasteride + minoxidil + tretinoin', 'Starting at $43/mo'; schema answer 'Select topical compounded spray')", "Clears the cart and adds Ro Mane Spray (hl-topical-spray-product); sets hasTopicalCompounded=1; next is the combined finasteride + minoxidil side-effect screen; shipping screen has no outside-pharmacy button.", 'product-added', ['p1']),
               opt("Oral finasteride (card: 'Generic Propecia', 'Starting at $16/mo'; schema answer 'Select oral finasteride')", "Clears the cart and adds Finasteride 1 mg; sets hasFinasteride=1; next is the finasteride side-effect screen.", 'product-added', ['p2']),
               opt("Oral minoxidil (card: 'Same active ingredient as Rogaine', 'Starting at $24/mo'; schema answer 'Select oral minoxidil')", "Clears the cart and adds oral minoxidil 2.5 mg; sets hasMinoxidil=1; next is the oral minoxidil side-effect screen.", 'product-added', ['p3'])]),
 dict(qid=3180, type='info', role='expectation-setting', shownWhen="experiment mhlConsultativeOv is off (older path; not live on the main link today)",
      purpose="Older path: 'Treatment Details' divider screen before the preference question."),
 dict(qid=3200, type='single', role='product-selector', shownWhen="experiment mhlConsultativeOv is off (older path; not live on the main link today)",
      purpose="Older two-product preference screen: finasteride tablets, oral minoxidil tablets, or no preference. The spray is not on it. Includes a 'Need help picking a treatment?' comparison pop-up.",
      ov={'please-tell-the-physician-i-dont-have-a-preference': ("No product is chosen by the patient ('I want my provider to determine the best treatment and plan for me.'). What then sits in the cart is not visible in the schema.", 'none', [], 'code'),
          'select-finasteride': ("Clears the cart and adds Finasteride 1 mg. Card note: 'Recommended for those interested in a multi-faceted approach to treating hair loss and would like to also use topical minoxidil (generic Rogaine).'", 'product-added', ['p2'], 'code'),
          'select-minoxidil': ("Clears the cart and adds oral minoxidil 2.5 mg. Card note: 'May be preferred by men who do not want to risk the known (slight) chance of sexual side effects from taking finasteride.'", 'product-added', ['p3'], 'code')}),
 dict(qid=3230, type='consent', role='consent', shownWhen="Ro Mane Spray was picked (hasTopicalCompounded == 1), or nothing matched",
      purpose="Side-effect acknowledgement covering finasteride (psychological, sexual, persistence) and minoxidil (common and serious). Button: 'Got it, continue'."),
 dict(qid=3240, type='consent', role='consent', shownWhen="oral finasteride was picked (hasFinasteride == 1)",
      purpose="Side-effect acknowledgement for finasteride: may cause or worsen depression and anxiety; sexual side effects in about 4% vs 2% on placebo; possible persistence after stopping."),
 dict(qid=3250, type='consent', role='consent', shownWhen="oral minoxidil was picked (hasMinoxidil == 1)",
      purpose="Side-effect acknowledgement for oral minoxidil: low blood pressure, swelling, extra body hair; fluid retention, fast heart rate, fluid around the heart."),
 dict(qid=4010, type='photo', role='identity', shownWhen="no selfie on file and ID check not skipped (fork 4000)",
      purpose="Identity photo 1 of 2: a selfie. Can be skipped and done later in the account. Note: this is an identity photo, not a scalp photo; the men's schema has no scalp-photo step, although the FAQ says hair photos are requested.",
      options=[opt("Upload completed", "Goes on to the ID photo.", 'next-question'), opt("skip", "Allowed: the visit continues; the clinician cannot prescribe until identity is verified.", 'none')], noDesc=True),
 dict(qid=4030, type='photo', role='identity', shownWhen="no ID photo on file and ID check not skipped (fork 4020)",
      purpose="Identity photo 2 of 2: government ID. 'Skip for now' is offered.",
      options=[opt("submit id", "Goes on to shipping.", 'next-question'), opt("skip", "Allowed ('Skip for now'); must be completed before a prescription.", 'none')], noDesc=True),
 dict(qid=5030, stage='checkout', type='contact', role='identity', options=[], shownWhen="Ro Mane Spray was picked",
      purpose="Name and shipping address. Ro's own pharmacy only (no outside-pharmacy button for the compounded spray)."),
 dict(qid=5060, stage='checkout', type='contact', role='identity', options=[], shownWhen="a tablet was picked",
      purpose="Name and shipping address, with an option to send the prescription to another pharmacy (price and free delivery then not guaranteed)."),
 dict(qid=5140, stage='checkout', type='contact', role='data-capture', text="Finalize your order [cart summary and payment]",
      purpose="Payment details. Delivery schedule is set to quarterly. Text: the card is not charged for prescription medicine until a clinician has reviewed and approved, typically within 24 hours.",
      options=[opt("Finish", "Submits the visit for clinician review (not done in this research).", 'next-question')]),
 dict(qid=6500, stage='checkout', type='info', role='expectation-setting', options=[],
      purpose="Thank-you screen: answers go to a Ro-affiliated doctor; a phone or video call may be needed depending on state; treatment arrives in 3 to 5 days once prescribed."),
 dict(qid=7010, type='info', role='eligibility-gate', options=[], shownWhen="age under 18", purpose="Exit screen for under-18s, with a comment form asking for an email."),
 dict(qid=7030, type='info', role='eligibility-gate', options=[], shownWhen="zip code not served", purpose="Exit screen for unsupported areas, with a 'Be notified!' form."),
 dict(qid=7061, type='info', role='eligibility-gate', shownWhen="sex = female and redirect flag on", purpose="Hand-off to the women's visit.",
      ov={'continue-to-women-s-hair-loss-visit': ("Button link to the women's visit (/tefcyb).", 'none', [], 'code')}),
 dict(qid=7062, type='info', role='eligibility-gate', options=[], shownWhen="sex = female and redirect flag off", purpose="Exit screen: treatment 'currently only available to men', with a comment form."),
 dict(qid=7, type='contact', role='identity', options=[], shownWhen="only on the Google Shopping entry (start.ro.co/escptw redirects to /fxdxbh/online-visit/7; isGSSchema == true)",
      text="Getting started with your hair loss visit. [Sign up with Email / Continue with Google / Log in and continue]",
      purpose="Alternative first screen: on this entry the account wall comes before any question; the goals questions are asked after sign-up.", evidence='observed'),
]

# ----------------------------------------------------------------------------- women's flow
def women_auto(a, follow=None):
    vm = dict(a.get('variable_modifications') or [])
    hl = (a.get('meta') or {}).get('highlight')
    no_oral, no_top = vm.get('ifNotEligibleForOralMinoxidil') == '1', vm.get('ifNotEligibleForTopicalMinoxidil') == '1'
    ev, affects = 'code', []
    if a['next_qid'] in (6040, 6020) or (no_oral and no_top):
        et, affects = 'hard-stop', ['p10', 'p11']
        eff = ("Hard stop. The visit ends on the screen 'Based on some of your responses, we will unfortunately be unable to evaluate and treat your hair loss condition on the Ro platform. "
               "We recommend that you visit an in-person dermatologist…'" if a['next_qid'] != 6020 else
               "Hard stop. The visit ends on the screen 'Unfortunately, our treatments are not available for use during pregnancy.'")
        if no_oral and no_top:
            eff = "Sets both ifNotEligibleForOralMinoxidil and ifNotEligibleForTopicalMinoxidil; the next fork (1159) sends the patient to the stop screen. " + eff
    elif no_oral:
        et, affects = 'product-removed', ['p10']
        eff = ("Sets ifNotEligibleForOralMinoxidil=1. Oral minoxidil is no longer offered: at the end the patient skips the choice screen and is shown Hair Solution Rx as the only treatment (qid 4030). No stop.")
    elif hl in ('negative', 'caution'):
        et, ev = 'flag-for-clinician', 'inferred'
        eff = "No engine variable changes and no stop. The flow carries on."
    elif hl:
        et, ev = 'flag-for-clinician', 'inferred'
        eff = "No engine effect. The flow carries on."
    else:
        et = 'none'
        eff = "No rule in the schema depends on this answer; it is saved for the clinician."
    if hl:
        eff += HL_NOTE % hl
    if follow:
        eff = follow + ' ' + eff
        if et in ('none', 'flag-for-clinician'):
            et, ev = 'extra-questions', 'code'
    return eff, et, affects, ev

TELL = lambda what: "Opens a free-text box: '%s'" % what
women_spec = [
 dict(qid=4, stage='anonymous', type='single', role='diagnosis', evidence='observed',
      purpose="Duration of hair loss. Stored in a variable (hairLossExperience) that no fork rule reads, so it informs the clinician only.",
      ov={s: ("Sets hairLossExperience='%s'. No fork rule reads it; no effect on what is offered." % v, 'none', [], 'code') for s, v in [('months', 'months'), ('within-the-last-year', 'withinTheLastYear'), ('more-than-a-year', 'moreThanAYear')]}),
 dict(qid=6, stage='anonymous', type='single', role='diagnosis', evidence='observed',
      purpose="Speed of onset. Unlike the men's visit, 'Suddenly' has no flag or highlight here."),
 dict(qid=8, stage='anonymous', type='multi', role='diagnosis', evidence='observed',
      purpose="Where the loss is. Top-of-head or all-over loss adds the part-line picture question.",
      branchDetail="'Top of head/crown' or 'All over' -> part-line picture question (qid 10). Temples or frontal scalp only -> straight to sign-up.",
      ov={'top-of-head-crown': ("Sets ifTopOfHead=1: adds the question 'Which picture most closely resembles your part line?' (seen in runs/baseline-women). No effect on what is offered.", 'extra-questions', [], 'observed'),
          'all-over': ("Exclusive answer. Sets ifAllOver=1: adds the part-line picture question. No effect on what is offered.", 'extra-questions', [], 'code'),
          'temples': ("No variable; the part-line question is skipped unless top of head is also ticked. Highlighted 'ack-clinical' for the clinician.", 'none', [], 'code'),
          'frontal-scalp': ("No variable; the part-line question is skipped unless top of head is also ticked. Highlighted 'ack-clinical' for the clinician.", 'none', [], 'code')}),
 dict(qid=10, stage='anonymous', type='single', role='diagnosis', evidence='observed', shownWhen="qid 8 includes 'Top of head/crown' or 'All over'",
      purpose="Five pictures of a widening parting (image alt texts: Normal, Slightly Wide, Wider, Very Wide, Extremely Wide Hair Part), in effect a Ludwig-style severity scale. No option changes the engine.",
      ov={str(i): ("Picture %d of 5 (%s). No variable, no branch; saved for the clinician." % (i, t), 'none', [], 'code') for i, t in enumerate(['Normal Hair Part', 'Slightly Wide Hair Part', 'Wider Hair Part', 'Very Wide Hair Part', 'Extremely Wide Hair Part'], 1)}),
 dict(qid=16, stage='anonymous', type='contact', role='identity', evidence='observed', options=[],
      text="Thanks for sharing. Ready to go deeper? Next, you’ll tell your provider about your health, medical history, and lifestyle. Your provider will use this information to evaluate your symptoms and, if appropriate, prescribe medication for treatment. [Sign up with Email / Continue with Google / Already a member? Log in and continue]",
      purpose="ACCOUNT WALL. Shown after 3 or 4 hair questions and before any medical question. No product, price or recommendation is shown before it.", noDesc=True),
 dict(qid=19, type='contact', role='identity', options=[], shownWhen="the email already belongs to a member", purpose="Log-in screen for existing members."),
 dict(qid=30, type='contact', role='eligibility-gate', text="The Basics [form: Birthdate, Sex Assigned at Birth, Zip code, Phone number]",
      purpose="Identity and three hard gates: age (minAge 18), sex (allowedGenders: female) and whether Ro serves the zip code. The age is also kept as userAge and used at the end (over 65 = no oral minoxidil).",
      branchDetail="Under 18 -> exit 6010. Male -> redirect offer to the men's visit (6030). Unsupported zip -> exit 6000.",
      options=[opt("(engine outcome) Under 18 yo", "Hard stop: 'Unfortunately we are not currently able to treat anyone under the age of 18 on our platform.'", 'hard-stop', ['p10', 'p11']),
               opt("(engine outcome) Male", "Leaves the women's visit: 'Want to be redirected to the men's hair loss visit?' with a button to start.ro.co/fxdxbh.", 'hard-stop', ['p10', 'p11']),
               opt("(engine outcome) Not supported zip code", "Hard stop: 'Be notified when we’re in your state!'", 'hard-stop', ['p10', 'p11']),
               opt("(engine outcome) Next", "Continues. userAge over 65 later removes oral minoxidil (fork 4020) and, combined with topical ineligibility, stops the visit (fork 1159).", 'next-question')]),
 dict(qid=1050, type='info', role='expectation-setting', purpose="Divider screen introducing the medical history section.",
      ov={'continue': ("Continues.", 'next-question', [], 'code')}),
 dict(qid=1055, type='single', role='eligibility-gate', purpose="Pregnancy gate. 'Yes' and 'Not sure' both end the visit.",
      ov={'no': ("Continues to the breastfeeding question.", 'next-question', [], 'code')}),
 dict(qid=1057, type='single', role='product-selector', purpose="Breastfeeding rules out oral minoxidil but not the topical.",
      ov={'no': ("No effect.", 'none', [], 'code')}),
 dict(qid=1059, type='single', role='diagnosis', purpose="Recent childbirth (postpartum shedding). Flag only."),
 dict(qid=12, type='single', role='data-capture', purpose="Self-rated severity, tracked over time. No engine effect."),
 dict(qid=1062, type='single', role='diagnosis', purpose="Shedding versus gradual thinning (telogen effluvium versus female-pattern loss). No engine effect; for the clinician."),
 dict(qid=1070, type='single', role='diagnosis',
      purpose="Five pictures of daily shed hair (image alt texts: Few strands, Some strands, Many strands, Clump of hair, Extreme amount of hair). No engine effect.",
      ov={str(i): ("Picture %d of 5 (%s). No variable, no branch; saved for the clinician." % (i, t), 'none', [], 'code') for i, t in enumerate(['Few strands of hair', 'Some strands of hair', 'Many strands of hair', 'Clump of hair', 'Extreme amount of hair'], 1)}),
 dict(qid=1074, type='multi', role='safety-screen', purpose="Scalp red flags (patches, pain, redness, sores, eyebrow or eyelash loss). In the women's schema these are highlights only: none stops the visit or removes a product."),
 dict(qid=1076, type='single', role='diagnosis', purpose="Family history. Flag only."),
 dict(qid=1078, type='single', role='data-capture', purpose="Outcome measure: effect on self-confidence (1 to 5), tracked over time."),
 dict(qid=1080, type='single', role='data-capture', purpose="Outcome measure: effect on stress (1 to 5), tracked over time."),
 dict(qid=1083, type='single', role='diagnosis', purpose="Previous medical evaluation of the hair loss.",
      branchDetail="'Yes' opens a free-text box (qid 1084).", follow={'yes': TELL("Please share more details: How long ago and were any lab tests done? Did the doctor remove a small piece of your scalp skin for testing (scalp biopsy)? Did you receive a diagnosis?")}),
 dict(qid=1084, type='text', role='data-capture', shownWhen="qid 1083 = 'Yes'", purpose="Free text about earlier evaluation, tests, biopsy and diagnosis."),
 dict(qid=1086, type='multi', role='eligibility-gate',
      purpose="Diagnosed scalp conditions. ANY listed diagnosis ends the visit (fork 1087 only lets 'None of the above' through).",
      branchDetail="Anything except 'None of the above' -> stop screen 6040.",
      ov={**{s: ("Hard stop (fork 1087: only 'None of the above' continues). The visit ends on 'Based on some of your responses, we will unfortunately be unable to evaluate and treat your hair loss condition on the Ro platform. We recommend that you visit an in-person dermatologist…'", 'hard-stop', ['p10', 'p11'], 'code')
             for s in ['alopecia-areata', 'lichen-planopilaris', 'frontal-fibrosing-alopecia-ffa', 'central-centrifugal-cicatricial-alopecia-ccca', 'traction-alopecia', 'lupus']},
          'none-of-the-above': ("Sets ifNotDiagnosedWithAnyScalpConditions=1 and continues.", 'next-question', [], 'code')}),
 dict(qid=1090, type='multi', role='eligibility-gate',
      purpose="Signs of a hormonal cause. Three signs of virilisation or raised prolactin end the visit; hirsutism, acne and irregular periods do not.",
      branchDetail="Clitoral enlargement, nipple discharge or voice deepening -> stop screen 6040 (fork 1091).",
      ov={s: ("Sets ifHairLossHormonalRelated=1 -> hard stop on the 'unable to evaluate and treat… visit an in-person dermatologist' screen (fork 1091).", 'hard-stop', ['p10', 'p11'], 'code')
          for s in ['enlargement-of-the-clitoris', 'discharge-from-the-nipples', 'deepening-of-your-voice']}),
 dict(qid=1094, type='multi', role='diagnosis', purpose="Triggers for shedding in the last year (menopause, weight loss, illness, stress, hormonal contraception changes, chemotherapy, surgery). No engine effect; for the clinician."),
 dict(qid=1096, type='multi', role='safety-screen',
      purpose="Medical history. Cardiovascular conditions and high blood pressure rule out oral minoxidil; lupus or another autoimmune disorder rules out both products and ends the visit; the rest open free-text follow-ups.",
      branchDetail="Each ticked condition opens its own free-text follow-up (forks 1159 to 1181). Fork 1159 stops the visit if topical is ruled out and (oral is ruled out or age is over 65).",
      follow={'heart-condition-coronary-artery-disease-angina-chest-pain-heart-failure-heart-attack-pericarditis': TELL("Please describe your heart related condition(s)."),
              'stroke': TELL("Please tell us more about your stroke."), 'kidney-disease': TELL("Please tell us more about your kidney disease."),
              'liver-disease': TELL("Please tell us more about your liver disease."),
              'thyroid-disorder': TELL("Please describe your thyroid condition and let us know if you’re currently receiving treatment."),
              'anemia-low-red-blood-cell-count': TELL("Please describe your condition and let us know if you’re currently anemic."),
              'iron-deficiency': TELL("Please let us know when you were diagnosed with iron deficiency and if you’re currently taking iron supplements"),
              'polycystic-ovary-disease': TELL("Please let us know when you were diagnosed with PCOS and if you’re currently receiving treatment."),
              'pheochromocytoma-adrenal-gland-tumor': TELL("Please tell us more about your pheochromocytoma."),
              'pulmonary-hypertension': TELL("Please tell us more about your pulmonary hypertension."),
              'high-blood-pressure': TELL("Please let us know when you were diagnosed, and whether you have taken or are currently taking any medication(s) to control your blood pressure. Please include medication names and dosages.")}),
 dict(qid=1160, type='text', role='data-capture', shownWhen="qid 1096 includes the heart condition answer", purpose="Free text about the heart condition."),
 dict(qid=1162, type='text', role='data-capture', shownWhen="qid 1096 includes 'Stroke'", purpose="Free text about the stroke."),
 dict(qid=1164, type='text', role='data-capture', shownWhen="qid 1096 includes 'Kidney disease'", purpose="Free text about kidney disease."),
 dict(qid=1166, type='text', role='data-capture', shownWhen="qid 1096 includes 'Liver disease'", purpose="Free text about liver disease."),
 dict(qid=1168, type='text', role='data-capture', shownWhen="qid 1096 includes 'Anemia'", purpose="Free text about anaemia."),
 dict(qid=1170, type='text', role='data-capture', shownWhen="qid 1096 includes 'Iron deficiency'", purpose="Free text about iron deficiency and supplements."),
 dict(qid=1172, type='text', role='data-capture', shownWhen="qid 1096 includes 'Thyroid disorder'", purpose="Free text about the thyroid condition."),
 dict(qid=1174, type='text', role='data-capture', shownWhen="qid 1096 includes 'Polycystic ovary disease'", purpose="Free text about PCOS."),
 dict(qid=1176, type='text', role='data-capture', shownWhen="qid 1096 includes 'Lupus or other autoimmune disorder' (in practice not reached: that answer already stops the visit at fork 1159)", purpose="Free text about lupus or autoimmune disease."),
 dict(qid=1178, type='text', role='data-capture', shownWhen="qid 1096 includes 'Pheochromocytoma'", purpose="Free text about phaeochromocytoma."),
 dict(qid=1180, type='text', role='data-capture', shownWhen="qid 1096 includes 'Pulmonary hypertension'", purpose="Free text about pulmonary hypertension."),
 dict(qid=1182, type='text', role='data-capture', shownWhen="qid 1096 includes 'High blood pressure'", purpose="Free text about blood pressure diagnosis and medicines."),
 dict(qid=1185, type='single', role='safety-screen', purpose="Low blood pressure history. Unlike high blood pressure it does not remove oral minoxidil in the schema; flag and free text only.",
      branchDetail="'Yes' opens a free-text box (qid 1186).", follow={'yes': TELL("Please tell us more, including whether you’ve ever had any symptoms of low blood pressure, such as fainting or feeling lightheaded or dizzy (particularly when getting up from a sitting position).")}),
 dict(qid=1186, type='text', role='data-capture', shownWhen="qid 1185 = 'Yes'", purpose="Free text about low blood pressure symptoms."),
 dict(qid=1250, type='multi', role='eligibility-gate',
      purpose="Past hair-loss treatments. Steroid injections end the visit (a sign of another diagnosis); past minoxidil opens allergy questions.",
      branchDetail="Steroid injections -> stop screen (fork 1251). Oral minoxidil -> allergy question 1254. Topical minoxidil -> allergy question 1256.",
      ov={'steroid-injections-into-the-scalp': ("Sets ifPastTreatmentsIncludeSteroidInjections=1 -> hard stop on the 'unable to evaluate and treat… visit an in-person dermatologist' screen (fork 1251).", 'hard-stop', ['p10', 'p11'], 'code')},
      follow={'oral-minoxidil': "Opens 'As far as you know, do you have an allergy to oral minoxidil?'.", 'topical-minoxidil': "Opens 'As far as you know, do you have an allergy to topical minoxidil?'."}),
 dict(qid=1254, type='single', role='eligibility-gate', shownWhen="qid 1250 includes 'Oral minoxidil'",
      purpose="Minoxidil allergy. 'Yes' ends the whole visit (not just the tablet), because both products contain minoxidil."),
 dict(qid=1256, type='single', role='eligibility-gate', shownWhen="qid 1250 includes 'Topical minoxidil'", purpose="Topical minoxidil allergy; 'Yes' asks which form.",
      branchDetail="'Yes' opens the foam / liquid question (qid 1258).", follow={'yes': "Opens 'What form of topical minoxidil did you have an allergic reaction to?'."}),
 dict(qid=1258, type='single', role='eligibility-gate', shownWhen="qid 1256 = 'Yes'",
      purpose="Separates a reaction to the liquid (often the propylene glycol vehicle: inferred) from a reaction to foam or both, which is read as true minoxidil allergy and ends the visit."),
 dict(qid=1620, type='single', role='safety-screen', purpose="Any other current medical conditions, picked from a searchable list (StructuredConditions). No schema rule depends on it.",
      ov={'i-have-conditions': ("Patient searches and selects conditions. No schema variable or branch depends on it; goes to the clinician.", 'flag-for-clinician', [], 'inferred'),
          'i-dont-have-conditions': ("No effect on the flow.", 'none', [], 'code')}),
 dict(qid=1626, type='single', role='safety-screen', purpose="Past surgeries or procedures.", branchDetail="'Yes' opens a free-text list (qid 1627).",
      follow={'yes': TELL("Please list your past surgeries and procedures.")}),
 dict(qid=1627, type='text', role='data-capture', shownWhen="qid 1626 = 'Yes'", purpose="Free-text list of surgeries and procedures."),
 dict(qid=1630, type='single', role='safety-screen', purpose="Current medicines, vitamins, supplements and creams from a searchable list. No schema rule depends on it.",
      ov={'im-taking-medications': ("Patient searches and selects each medicine. No schema variable or branch depends on it; goes to the clinician.", 'flag-for-clinician', [], 'inferred'),
          'i-dont-take-any-medications': ("No effect on the flow.", 'none', [], 'code')}),
 dict(qid=1640, type='single', role='safety-screen', purpose="Allergies from a searchable list. No schema rule depends on it.",
      ov={'i-have-allergies': ("Patient searches and selects allergies. No schema variable or branch depends on it; highlighted 'caution' for the clinician.", 'flag-for-clinician', [], 'inferred'),
          'i-dont-have-allergies': ("No effect on the flow.", 'none', [], 'code')}),
 dict(qid=2200, type='multi', role='data-capture', purpose="Optional race and ethnicity question for equity monitoring; the text says it does not affect treatment.",
      branchDetail="'Other' opens a free-text box (qid 2202).",
      ov={**{s: ("No engine effect.", 'none', [], 'code') for s in ['white', 'hispanic-or-latino', 'black-or-african-american', 'native-american-or-american-indian', 'asian-pacific-islander', 'no-answer']},
          'other': ("Sets followupOther=1 and opens 'Please list your ethnicity.' No effect on treatment.", 'extra-questions', [], 'code')}),
 dict(qid=2202, type='text', role='data-capture', shownWhen="qid 2200 includes 'Other'", purpose="Free-text ethnicity."),
 dict(qid=2010, type='photo', role='diagnosis', options=[],
      purpose="Scalp photos: 'take photos of different areas and angles of your head' for the clinician. (The men's schema has no scalp-photo step.)"),
 dict(qid=4025, type='single', role='product-selector',
      shownWhen="fork 4020 falls through: eligible for oral minoxidil, eligible for topical, and age not over 65",
      purpose="THE PRODUCT CHOICE. Eligible patients choose between the tablet and the topical, or leave it to the provider. The engine does not rank them by hair pattern or severity.",
      branchDetail="Oral minoxidil -> recommendation card 4040 and side-effect screen 4042. Hair Solution Rx -> card 4030. No preference -> straight to shipping with oral minoxidil in the cart.", noDesc=True,
      ov={'oral-minoxidil': ("Clears the cart, adds women's oral minoxidil, quarterly delivery. Card: 'An oral tablet. Recommended for patients who prefer to take a once-daily medication instead of applying a topical treatment.' $30 a month. Then a side-effect acknowledgement screen.", 'product-added', ['p10'], 'code'),
          'hair-solution-rx': ("Clears the cart, adds Hair Solution Rx, quarterly delivery. Card: 'A topical made with minoxidil, tretinoin, and melatonin. Recommended for patients who prefer to apply a treatment to their scalp instead of taking oral medication.' $40 a month. Shipping screen has no outside-pharmacy option.", 'product-added', ['p11'], 'code'),
          'no-preference': ("Adds oral minoxidil to the cart by default: 'If you select this option, you'll see oral minoxidil on the checkout screen. Your provider will determine the best treatment for you and will reach out if another treatment is more suitable.'", 'product-added', ['p10'], 'code')}),
 dict(qid=4030, type='info', role='product-selector', options=[],
      shownWhen="Hair Solution Rx chosen at 4025, OR forced by fork 4020 when oral minoxidil is ruled out or age is over 65 (and topical is allowed)",
      text="Thanks for providing all the information {firstName} [product card: Hair Solution Rx. 'Your doctor will review your information to see if you are a good candidate for Hair Solution Rx.']",
      purpose="Single-product recommendation card for the topical. Adds Hair Solution Rx to the cart.", noDesc=True),
 dict(qid=4040, type='info', role='product-selector', options=[],
      shownWhen="oral minoxidil chosen at 4025, OR forced by fork 4020 when topical is ruled out but oral is allowed and age is under 65 (not reachable in practice: the only answer that rules out topical also rules out oral)",
      text="Thanks for providing all the information {firstName} [product card: Oral Minoxidil. 'Your doctor will review your information to see if you are a good candidate for Oral Minoxidil']",
      purpose="Single-product recommendation card for the tablet. Adds oral minoxidil to the cart.", noDesc=True),
 dict(qid=4042, type='consent', role='consent', shownWhen="after the oral minoxidil card (qid 4040)",
      purpose="Side-effect acknowledgement for oral minoxidil ('Got it').", ov={'got-it': ("Continues to shipping.", 'next-question', [], 'code')}),
 dict(qid=5041, stage='checkout', type='contact', role='identity', options=[], shownWhen="oral minoxidil in the cart", purpose="Shipping address, with the option of an outside pharmacy.", noDesc=True),
 dict(qid=5042, stage='checkout', type='contact', role='identity', options=[], shownWhen="Hair Solution Rx in the cart", purpose="Shipping address; Ro's pharmacy only.", noDesc=True),
 dict(qid=5050, stage='checkout', type='contact', role='data-capture', text="Review treatment and pay [shipping frequency, cart summary, payment]",
      purpose="Payment details. 'You won’t be charged for any prescription medication until this review is completed and you have been approved for treatment. This review typically occurs within 24 hours.'",
      options=[opt("Finish", "Submits the visit for clinician review (not done in this research).", 'next-question')]),
 dict(qid=5500, stage='checkout', type='info', role='expectation-setting', options=[], purpose="Thank-you screen and next steps (ID verification, possible phone or video call, shipment)."),
 dict(qid=6000, type='info', role='eligibility-gate', options=[], shownWhen="zip code not served", purpose="Exit: 'Be notified when we’re in your state!'"),
 dict(qid=6010, type='info', role='eligibility-gate', shownWhen="age under 18", purpose="Exit for under-18s: 'Please discuss your hair loss concerns with your healthcare provider.'",
      ov={'got-it': ("Button link to ro.co/derm.", 'none', [], 'code')}),
 dict(qid=6020, type='info', role='eligibility-gate', shownWhen="pregnant or not sure", purpose="Exit for pregnancy.", ov={'got-it': ("Button link to ro.co/derm.", 'none', [], 'code')}),
 dict(qid=6030, type='info', role='eligibility-gate', shownWhen="sex = male", purpose="Hand-off to the men's visit.",
      ov={'continue-to-men-s-hair-loss-visit': ("Button link to start.ro.co/fxdxbh.", 'none', [], 'code')}),
 dict(qid=6040, type='info', role='eligibility-gate',
      shownWhen="any diagnosed scalp condition; virilisation signs; lupus or autoimmune disorder; topical ruled out and (oral ruled out or age over 65); past steroid injections; oral minoxidil allergy; topical minoxidil allergy to foam or both",
      purpose="The medical stop screen: refer to an in-person dermatologist (links to find-a-derm.aad.org).", ov={'got-it': ("Button link to ro.co/derm.", 'none', [], 'code')}),
]

flows = [
 {"id": "men", "name": "Men's hair-loss online visit (schema 'Hair loss onboarding', code hl-onb-consult-2rx, version 77)", "audience": "men",
  "entryUrl": "https://start.ro.co/fxdxbh/",
  "stagesSummary": "3 anonymous marketing questions (goals, what you have tried, why now) -> ACCOUNT WALL (email + consents, cannot be dismissed) -> basics (birth date, sex, zip, phone) -> hair pattern, onset, severity, scalp symptoms -> past treatments (only if any were tried) -> blood pressure -> conditions -> heart -> medicines -> allergies -> trying for a baby -> cross-sell -> anything else -> recap loader -> recommendation screen (3 treatments, 1 recommended) -> side-effect acknowledgement -> selfie + ID -> shipping -> payment -> clinician review. Everything after the wall is from the publicly served schema, not walked.",
  "schemaFile": MEN_SCHEMA,
  "questions": build('men', MQ, men_spec, men_auto)},
 {"id": "women", "name": "Women's hair-loss online visit (schema 'Derm Woman's Hair Loss Standard Onboarding', code derm-whl-onb, version 32)", "audience": "women",
  "entryUrl": "https://start.ro.co/tefcyb/",
  "stagesSummary": "3 or 4 anonymous hair questions (how long, how it started, where, part-line picture) -> ACCOUNT WALL (sign up with email or Google) -> basics (birth date, sex, zip, phone) -> pregnancy (stop), breastfeeding, recent birth -> severity, shedding vs thinning, shedding picture, scalp symptoms, family history, confidence and stress scores -> past evaluation -> diagnosed scalp conditions (stop) -> hormonal signs (stop) -> last-year triggers -> conditions (stop / tablet removed) -> low blood pressure -> past treatments and minoxidil allergy (stops) -> other conditions, surgeries, medicines, allergies -> ethnicity (optional) -> scalp photos -> product fork (choice of tablet or topical, topical only, or stop) -> side effects -> shipping -> payment -> clinician review. Everything after the wall is from the publicly served schema, not walked.",
  "schemaFile": WOMEN_SCHEMA,
  "questions": build('women', WQ, women_spec, women_auto)},
 {"id": "otc-direct", "name": "Direct purchase flows with no medical questions (topical minoxidil 5%, Revive Shampoo, Restore Conditioner)", "audience": "men",
  "entryUrl": "https://start.ro.co/vwayzg/",
  "stagesSummary": "Topical minoxidil (start.ro.co/vwayzg, schema hl-onb-intent): the first screen is already the ACCOUNT WALL ('Your Account': sign up with email or Google) beside a cart summary; then payment. Shampoo (start.ro.co/kwrssq, schema restr-sha-onb-intent) and conditioner (start.ro.co/qcalmd, schema restr-con-onb-intent): one plan screen with Continue -> account wall -> payment. No age, sex or health question in any of the three schemas.",
  "schemaFile": "quiz-definition.topical-minoxidil-otc.raw.json, quiz-definition.shampoo.raw.json, quiz-definition.conditioner.raw.json",
  "questions": [
   {"id": "otc-q1", "order": 1, "stage": "anonymous", "type": "contact", "options": [],
    "text": "Your Account. Ro takes your security very seriously and encrypts all of your information, meaning that your confidential data is handled securely. [Log in and continue / Sign up with Email / Continue with Google] [cart: Minoxidil Topical Solution, 60mL · 5%, 1 x per month · 3 month plan ($16/mo) · $48 · Shipping Included · Total $48]",
    "purpose": "Topical minoxidil 'Buy now': account wall on the very first screen, with the price already shown. No questions at all.", "engineRole": "identity",
    "branches": False, "branchDetail": "", "shownWhen": "entry start.ro.co/vwayzg", "evidence": "observed", "note": "runs/probe-vwayzg"},
   {"id": "otc-q2", "order": 2, "stage": "anonymous", "type": "info",
    "text": "Revive Shampoo. Cleanse & Thicken. Enriched with saw palmetto, pumpkin seed oil, salicylic acid, and caffeine to cleanse the scalp for thicker-looking hair-8 oz, peppermint scented. 3-Month Plan $24 /3 mo. Your plan will be billed and shipped every 3 months. You’ll receive a 3-month (90–day) supply in each shipment. Modify or cancel your plan at any time.",
    "options": [opt("Continue", "Goes to the 'Your Account' sign-up screen (account wall), then payment with Restore Conditioner offered as a 'Popular add-on'.", 'next-question', ['p7'])],
    "purpose": "Shampoo plan screen: one plan, one price, then the account wall.", "engineRole": "marketing",
    "branches": False, "branchDetail": "", "shownWhen": "entry start.ro.co/kwrssq", "evidence": "observed", "note": "runs/probe-kwrssq"},
   {"id": "otc-q3", "order": 3, "stage": "anonymous", "type": "info",
    "text": "Restore Conditioner. Fortify & Thicken. Formulated with targeted plant proteins, coconut oil, and shea butter to fortify and moisturize for thicker-looking hair. 8 oz, peppermint scented. 3-Month Plan $24 /3 mo. Your plan will be billed and shipped every 3 months. You’ll receive a 3-month (90–day) supply in each shipment. Modify or cancel your plan at any time.",
    "options": [opt("Continue", "Goes to the 'Your Account' sign-up screen (account wall), then payment.", 'next-question', ['p8'])],
    "purpose": "Conditioner plan screen: one plan, one price, then the account wall.", "engineRole": "marketing",
    "branches": False, "branchDetail": "", "shownWhen": "entry start.ro.co/qcalmd", "evidence": "observed", "note": "runs/probe-qcalmd"},
  ]},
]

# ----------------------------------------------------------------------------- rules (all read from served code; none could be observed live because they sit behind the account wall)
def R(i, flow, when, then, et, affects, proof, conf='high', ev='code'):
    return {"id": "R%d" % i, "flow": flow, "when": when, "then": then, "effectType": et, "affects": affects, "evidence": ev, "proof": proof, "confidence": conf}
MS, WS = MEN_SCHEMA, WOMEN_SCHEMA
rules = [
 R(1, 'men', "End of the medical questions (qid 3178)", "Recommended treatment = the first of [Ro Mane Spray, oral finasteride, oral minoxidil] whose no-recommend flag (noRecTopicalCombined, noRecOralFin, noRecOralMin) is not 1 and whose product group is not disabled for the patient's state. The others are listed under 'Other treatment options' and stay selectable. If none qualifies the result is 'no-recommendation' and the screen is headed 'Your treatment options'.", 'product-switched', ['p1', 'p2', 'p3'], RECO_CODE + "; flag values are parsed to numbers in raw/js/main.260d4b871de7cb1cb657.js (parseInt on variableModifications)"),
 R(2, 'men', "Patient's US state does not support the compounded product (products-support lookup by state)", "The compounded group is treated as ineligible ('Not available in your area') and left off the screen; the recommendation moves to oral finasteride.", 'product-removed', ['p1'], "raw/js/48419.chunk.js (getIneligibleProductGroupsWithReason, REASON_INELIGIBLE_COMPOUNDING_PRODUCTS_BASED_ON_STATE)", 'medium'),
 R(3, 'men', "Any of: patchy loss ('Random golf-ball size bald patches…', qid 132); onset 'Very suddenly' (150); 'Redness or rashes on scalp' (170); past 'Steroid injections in the scalp' (240); still-low blood pressure readings (391)", "All three no-recommend flags are set: nothing is recommended, the recap loader is skipped, but all three treatments can still be picked and the visit still goes to checkout and clinician review. There is no stop screen for men.", 'product-removed', ['p1', 'p2', 'p3'], MS + " qids 132, 150, 170, 240, 391 + " + RECO_CODE),
 R(4, 'men', "Any of: erectile dysfunction, anxiety or depression (qid 1000); trying for a pregnancy in the next 3 months (2350); past oral finasteride with problematic side effects or allergy (315)", "Flags both finasteride products (spray and tablet): the recommendation becomes oral minoxidil.", 'product-switched', ['p1', 'p2'], MS + " qids 1000, 2350, 315"),
 R(5, 'men', "Prostate cancer (qid 1000); allergy to topical minoxidil (285) or to topical finasteride (335)", "Flags the spray only: the recommendation becomes oral finasteride. (Prostate cancer does not flag finasteride tablets in the schema.)", 'product-switched', ['p1'], MS + " qids 1000, 285, 335"),
 R(6, 'men', "Past oral minoxidil with allergy (qid 265)", "Flags the spray and oral minoxidil: the recommendation becomes oral finasteride.", 'product-switched', ['p1', 'p3'], MS + " qid 265"),
 R(7, 'men', "Any of: still 'very high' blood pressure readings (381); phaeochromocytoma (1000); stroke under 6 months ago (1260); angina, heart failure, pericarditis or pulmonary hypertension (1300); heart attack or bypass under 6 months ago, or no regular cardiologist (1315, 1320, 1355, 1360); atrial flutter, PSVT, Wolff-Parkinson-White or ventricular fibrillation (1420); resting heart rate under 50 or fainting from a low heart rate (1455, 1460); past oral minoxidil with side effects or no effect (265)", "Flags oral minoxidil only. The spray (which also contains minoxidil) stays the recommendation, so for a patient with no other flags nothing visible changes.", 'product-removed', ['p3'], MS + " qids 381, 1000, 1260, 1300, 1315, 1320, 1355, 1360, 1420, 1455, 1460, 265"),
 R(8, 'men', "Past oral finasteride 'this dose wasn't effective' (qid 315)", "Flags oral finasteride only; the spray stays recommended.", 'product-removed', ['p2'], MS + " qid 315"),
 R(9, 'men', "Basics screen: age under 18, sex female, or zip not served", "Hard stop (under 18, zip) or hand-off to the women's visit (female). These are the only stops in the men's schema.", 'hard-stop', ['p1', 'p2', 'p3'], MS + " qid 112, 7010, 7030, 7060"),
 R(10, 'men', "qid 22 includes 'Non-prescription solutions' or 'Prescription medications'", "Adds the marketing question 'main reason you're looking now' instead of 'why haven't you tried', and adds the past-treatment block (qid 240 and follow-ups) after the wall.", 'extra-questions', [], MS + " forks 25 and 229; first part seen in runs/baseline-men (None of the above -> qid 26)"),
 R(11, 'men', "Goals (qid 20), reasons (26, 28), areas of thinning (132: hairline, crown, overall)", "No effect on the recommendation. They only build the personalised 'Here's a quick recap' bullets on the loader.", 'marketing-only', [], "raw/js/main.260d4b871de7cb1cb657.js (maps td, ys, nd, od, ad near 'noRecTopicalCombined')"),
 R(12, 'men', "Liver failure or cirrhosis, kidney disease including stage 5, coronary artery disease, medicines, allergies", "No flag in the schema: the recommendation is unchanged; answers are highlighted for the clinician.", 'flag-for-clinician', [], MS + " qids 1000, 1275, 1285, 1300, 2200, 2300", 'medium', 'inferred'),
 R(13, 'women', "Pregnant = 'Yes' or 'Not sure' (qid 1055)", "Hard stop: 'Unfortunately, our treatments are not available for use during pregnancy.'", 'hard-stop', ['p10', 'p11'], WS + " qid 1055 -> 6020"),
 R(14, 'women', "Any diagnosed scalp condition ticked at qid 1086 (alopecia areata, lichen planopilaris, FFA, CCCA, traction alopecia, lupus)", "Hard stop: refer to an in-person dermatologist (screen 6040).", 'hard-stop', ['p10', 'p11'], WS + " fork 1087"),
 R(15, 'women', "Enlargement of the clitoris, discharge from the nipple(s) or deepening of the voice (qid 1090)", "Hard stop (screen 6040). Excess body or facial hair, severe acne and irregular periods do not stop the visit.", 'hard-stop', ['p10', 'p11'], WS + " fork 1091"),
 R(16, 'women', "Lupus or other autoimmune disorder (qid 1096)", "Rules out both products -> hard stop (screen 6040).", 'hard-stop', ['p10', 'p11'], WS + " qid 1096 + fork 1159"),
 R(17, 'women', "Breastfeeding (1057), or any of heart condition, stroke, phaeochromocytoma, pulmonary hypertension, high blood pressure (1096), or age over 65", "Oral minoxidil is not offered: no choice screen, Hair Solution Rx is the only treatment shown (screen 4030).", 'product-removed', ['p10'], WS + " fork 4020"),
 R(18, 'women', "Past steroid injections into the scalp (1250); allergy to oral minoxidil = Yes (1254); allergy to topical minoxidil in foam form or both forms (1258)", "Hard stop (screen 6040). An allergy to the liquid form only continues.", 'hard-stop', ['p10', 'p11'], WS + " forks 1251, qids 1254, 1258"),
 R(19, 'women', "No exclusion and age 65 or under", "Choice screen: Oral Minoxidil ($30/mo), Hair Solution Rx ($40/mo) or No preference (puts oral minoxidil in the cart). Hair pattern, severity and duration do not change the options.", 'product-added', ['p10', 'p11'], WS + " fork 4020 -> qid 4025"),
 R(20, 'women', "Basics screen: age under 18, sex male, or zip not served", "Hard stop (under 18, zip) or hand-off to the men's visit (male).", 'hard-stop', ['p10', 'p11'], WS + " qid 30"),
 R(21, 'women', "qid 8 includes 'Top of head/crown' or 'All over'", "Adds the part-line picture question (qid 10) before the account wall.", 'extra-questions', [], "runs/baseline-women (Top of head/crown -> qid 10) and " + WS + " fork 9", 'high', 'observed'),
]

recommendations = [
 {"profile": "Man, 32, hairline + crown, gradual, nothing tried, no conditions, not trying for a baby (baseline)", "offered": ["p1", "p2", "p3"], "default": "p1", "note": "From the served code, not seen live (the result screen is behind the account wall). Ro Mane Spray is shown as recommended; oral finasteride and oral minoxidil under 'Other treatment options'.", "evidence": "code"},
 {"profile": "Man with depression, anxiety or erectile dysfunction, or trying for a baby in the next 3 months", "offered": ["p1", "p2", "p3"], "default": "p3", "note": "Both finasteride products are flagged, so oral minoxidil is recommended; the others can still be picked.", "evidence": "code"},
 {"profile": "Man with a history of prostate cancer, or allergy to a topical minoxidil / topical finasteride product", "offered": ["p1", "p2", "p3"], "default": "p2", "note": "Only the spray is flagged.", "evidence": "code"},
 {"profile": "Man with patchy loss, sudden onset, scalp redness or rash, past steroid injections, or persistently low blood pressure", "offered": ["p1", "p2", "p3"], "default": "", "note": "No recommendation ('Your treatment options'); all three still selectable; clinician decides.", "evidence": "code"},
 {"profile": "Man with heart failure, angina, recent heart attack or stroke, or very high blood pressure", "offered": ["p1", "p2", "p3"], "default": "p1", "note": "Only oral minoxidil is flagged; the minoxidil-containing spray stays recommended.", "evidence": "code"},
 {"profile": "Woman, 38, thinning on top, gradual, not pregnant or breastfeeding, no conditions (baseline)", "offered": ["p10", "p11"], "default": "p10", "note": "Choice screen with 'No preference' defaulting to oral minoxidil. From the served schema, not seen live.", "evidence": "code"},
 {"profile": "Woman who is breastfeeding, has high blood pressure, a heart condition, stroke, phaeochromocytoma or pulmonary hypertension, or is over 65", "offered": ["p11"], "default": "p11", "note": "Hair Solution Rx only.", "evidence": "code"},
 {"profile": "Woman who is or may be pregnant; has a diagnosed scalp condition; virilisation signs; lupus or autoimmune disorder; past scalp steroid injections; minoxidil allergy", "offered": [], "default": "", "note": "Stopped and referred to in-person care.", "evidence": "code"},
]

entry_points = [
 {"url": "https://start.ro.co/fxdxbh/", "from": "Every 'Get started' on ro.co/hair-loss and on the Ro Mane Spray, finasteride and oral minoxidil pages", "flow": "men", "schema": "hl-onb-consult-2rx v77", "firstScreen": "What are your top hair goals?", "evidence": "observed (runs/probe-fxdxbh)"},
 {"url": "https://start.ro.co/fxdxbh/?c=<coupon code>", "from": "Paid-search landing pages ro.co/lp/medications/hair-loss/quiz/ and ro.co/lp/medications/mhl/om/quiz/ (three marketing questions; every answer leads to the same link) with 'Get 35% off' or 'Get 50% off your first order' coupons", "flow": "men", "schema": "same", "firstScreen": "same", "evidence": "docs (raw/lp_*.html); the coupon links were not opened"},
 {"url": "https://start.ro.co/afbkau/", "from": "Named in the experiment config; no public page links to it (probably search ads)", "flow": "men", "schema": "hl-onb-se1 v80: identical content to the main schema apart from name and ids", "firstScreen": "What are your top hair goals?", "evidence": "observed (runs/probe-afbkau); copy in quiz-definition.men-onboarding-se1.raw.json"},
 {"url": "https://start.ro.co/escptw/", "from": "Named in the experiment config; Google Shopping route", "flow": "men", "schema": "hl-onb-consult-2rx, started at qid 7", "firstScreen": "Sign-up screen 'Getting started with your hair loss visit.' (account wall first; the goals questions come after sign-up)", "evidence": "observed (runs/probe-escptw)"},
 {"url": "https://start.ro.co/tefcyb/", "from": "ro.co/womens-hair-loss, women's oral minoxidil and Hair Solution Rx pages, pricing page (some links add ?c=<coupon>)", "flow": "women", "schema": "derm-whl-onb v32", "firstScreen": "Firstly, how long have you been experiencing hair loss?", "evidence": "observed (runs/probe-women-tefcyb)"},
 {"url": "https://start.ro.co/vwayzg/", "from": "Topical minoxidil 'Buy now' / 'Get started'", "flow": "otc-direct", "schema": "hl-onb-intent v27", "firstScreen": "Your Account (sign-up) with cart summary", "evidence": "observed (runs/probe-vwayzg)"},
 {"url": "https://start.ro.co/kwrssq/", "from": "Revive Shampoo 'Shop now' / 'Buy Now'", "flow": "otc-direct", "schema": "restr-sha-onb-intent v19", "firstScreen": "Revive Shampoo plan screen", "evidence": "observed (runs/probe-kwrssq)"},
 {"url": "https://start.ro.co/qcalmd/", "from": "Restore Conditioner 'Shop now' / 'Buy Now'", "flow": "otc-direct", "schema": "restr-con-onb-intent v19", "firstScreen": "Restore Conditioner plan screen", "evidence": "observed (runs/probe-qcalmd)"},
]

company = {
 "slug": "ro", "company": "Ro (Roman)", "market": "US", "website": "https://ro.co/hair-loss/", "parent": "Roman Health Ventures Inc. (trading as Ro): company name from general knowledge, not checked on the site in this stage",
 "audiences": ["men", "women"],
 "model": "US direct-to-patient telehealth company: an online questionnaire ('online visit') reviewed by a US-licensed clinician, with its own pharmacy shipping generic, off-label and compounded hair-loss medicines on quarterly or longer subscriptions.",
 "checkedOn": "2026-11-23",
 "access": {
  "howTested": ["live-walk", "site-code", "public-docs"],
  "accountWall": "Men (start.ro.co/fxdxbh): after 3 marketing questions, on screen qid 55, an email pop-up ('See how much fuller your hair could be in just 3 months', email + two consent boxes, or Continue with Google) that cannot be dismissed. Women (start.ro.co/tefcyb): after 3 or 4 hair questions, on screen qid 16 'Thanks for sharing. Ready to go deeper?' (Sign up with Email / Continue with Google). Topical minoxidil, shampoo and conditioner: sign-up is the first or second screen. In every flow the wall comes before any medical question and before any recommendation.",
  "blockers": ["Account wall before every medical question, so no branch after the wall could be replayed live.",
               "No bot protection problem: the site and the consultation app load normally in the walker."],
  "coverageNote": "Stage 1 (map). The browser walk covers only the pre-wall screens (men: 3 questions; women: 4; three direct-purchase entries). The value is in the code: on load, the consultation app fetches the complete question schema for each flow from a public endpoint, including every question, option, fork rule and variable change behind the wall, and the men's recommendation function sits in a public JS chunk. All post-wall questions, rules and recommendation profiles here are read from that served code (evidence 'code'), not seen happening. No email, phone, name or other contact detail was entered, nothing was submitted, no photo or payment was given. Honest note: the page itself creates an anonymous draft visitor record on the first answer and posts each answer to it; that is the site's normal anonymous behaviour."
 },
 "products": products,
 "flows": flows,
 "entryPoints": entry_points,
 "rules": rules,
 "experiments": [],
 "recommendations": recommendations,
 "engineSummary": "Two different engines. MEN: a 'soft steer' engine. Nothing medical stops a man (only age under 18, female sex or an unserved zip). Answers set three flags, one per treatment. A fixed priority list (Ro Mane Spray, then finasteride tablets, then oral minoxidil tablets) picks the first unflagged treatment as 'recommended', but every treatment stays on the screen and can be picked, and a clinician decides afterwards. Goals, severity and pattern (other than patchy loss) do not change the recommendation; they only personalise a recap screen. WOMEN: a 'gate' engine. Pregnancy, any diagnosed scalp condition, signs of a hormonal disorder, lupus or autoimmune disease, past steroid injections and minoxidil allergy end the visit with a referral. Breastfeeding, cardiovascular conditions, high blood pressure and age over 65 remove the tablet and leave only the topical. Everyone else chooses between oral minoxidil and the compounded topical, with 'no preference' defaulting to the tablet. Non-prescription products (5% minoxidil solution, shampoo, conditioner) are sold through separate links with no questions.",
 "strengths": ["Very short path to sign-up (3 to 4 easy questions), with the heavy medical questions kept until after the email is captured.",
               "Men's safety questions are detailed for oral minoxidil (blood pressure follow-ups with a visual chart, timed heart attack, stroke and bypass questions, arrhythmia types, resting heart rate).",
               "Women's visit screens hard for other diagnoses (scarring alopecias, virilisation, pregnancy) and collects scalp photos and outcome scores.",
               "Clear public pricing page with a price for every plan length; no charge until a clinician approves.",
               "Recommendation screen still lets the patient choose, with the clinician as the final check."],
 "weaknesses": ["Men's engine recommends the same product (the highest-priced compounded spray) to every unflagged man, whatever his goals, pattern or severity.",
                "Men are never stopped: patchy loss, sudden loss, scalp inflammation and liver failure all still reach checkout, relying entirely on the clinician.",
                "Schema quirks: prostate cancer steers a man towards finasteride tablets; heart conditions flag oral minoxidil but leave the 6% minoxidil spray recommended; the men's visit has no scalp-photo step although the FAQ says photos are requested.",
                "Women's product choice ignores pattern and severity; 'no preference' defaults to the oral, off-label, boxed-warning tablet.",
                "Public pages disagree with each other (hair-loss FAQ still says finasteride is the only prescription option; women's page says billed every 2 months while pricing says quarterly)."],
 "opportunities": ["A recommendation that visibly uses the answers already collected (pattern, severity, goals, preference for tablet or topical) rather than a fixed product order.",
                   "Show an indicative treatment and price before asking for an email.",
                   "Explicit, explained stop or 'see a doctor first' screens for red-flag hair loss in men, as Ro already does for women.",
                   "Monthly or flexible plans: Ro's hair products are quarterly or longer only.",
                   "A licensed-product-first pathway with compounded products as a clearly explained second step."],
 "sources": [
  {"title": "Ro hair loss (men) landing page", "url": "https://ro.co/hair-loss/"},
  {"title": "Ro women's hair loss landing page", "url": "https://ro.co/womens-hair-loss/"},
  {"title": "Ro pricing (all hair-loss plan prices)", "url": "https://ro.co/pricing/"},
  {"title": "Ro Mane Spray product page", "url": "https://ro.co/medications/ro-mane-spray/"},
  {"title": "Finasteride product page", "url": "https://ro.co/medications/finasteride/"},
  {"title": "Oral minoxidil product page (men)", "url": "https://ro.co/medications/oral-minoxidil/"},
  {"title": "Topical minoxidil product page", "url": "https://ro.co/medications/minoxidil/"},
  {"title": "Women's oral minoxidil product page", "url": "https://ro.co/medications/womens-oral-minoxidil/"},
  {"title": "Hair Solution Rx (women) product page", "url": "https://ro.co/medications/hair-solution-rx/"},
  {"title": "Revive Shampoo", "url": "https://ro.co/products/revive-shampoo/"},
  {"title": "Restore Conditioner", "url": "https://ro.co/products/restore-conditioner/"},
  {"title": "Hair loss FAQ (how the visit works, photos, cost, when charged)", "url": "https://ro.co/faq/hair-loss/"},
  {"title": "Safety information: finasteride", "url": "https://ro.co/safety-info/finasteride/"},
  {"title": "Safety information: oral minoxidil", "url": "https://ro.co/safety-info/oral-minoxidil/"},
  {"title": "Safety information: Ro Mane Spray", "url": "https://ro.co/safety-info/ro-mane-spray/"},
  {"title": "Hair loss treatment plan (what patients are told after prescribing)", "url": "https://ro.co/treatment-plans/hair-loss/"},
  {"title": "FAQ: cost, pricing, pausing and cancelling", "url": "https://ro.co/faq/cost-pricing-services/"},
  {"title": "FAQ: telehealth (states served, ID photos, video calls)", "url": "https://ro.co/faq/telehealth/"},
  {"title": "Returns and refunds", "url": "https://ro.co/returns-and-refunds/"},
  {"title": "Men's quiz definition (public endpoint the page calls on load)", "url": "https://start.ro.co/svc/online-visit/public/roman/hair-loss/schemas/onboarding"},
  {"title": "Women's quiz definition (public endpoint the page calls on load)", "url": "https://start.ro.co/svc/online-visit/public/derm/womens-hair-loss/schemas/onboarding"},
  {"title": "Men's product catalogue JSON (public endpoint the page calls)", "url": "https://start.ro.co/api/public/6/grouped-products?include_product_codes=roman-revive-conditioner-24&include_product_codes=roman-revive-shampoo-24&include_product_codes=roman-hair-support-supplement&visible_in_onboarding=true"},
  {"title": "Recommendation logic chunk (public JS)", "url": "https://start.ro.co/assets/48419.d54c80ce6a7f9ba5ad88.chunk.js"},
  {"title": "Experiment configuration (public JS)", "url": "https://start.ro.co/svc/ro-experiments/public/roexp.min.js"},
  {"title": "Paid-search quiz landing page (finasteride)", "url": "https://ro.co/lp/medications/hair-loss/quiz/"},
  {"title": "Paid-search quiz landing page (oral minoxidil)", "url": "https://ro.co/lp/medications/mhl/om/quiz/"},
 ],
 "limitations": [
  "Nothing after the account wall was seen live. Post-wall questions, rules and recommendations are read from the served schema and JS; the real screens may differ in small ways (for example how a multi-select with options pointing to different next questions is routed).",
  "What the clinician actually prescribes, and how often the patient's pick is overridden, cannot be known from public information.",
  "Server-side checks (drug-interaction checks, state rules for compounded products, identity checks) are only visible as flags and function names.",
  "The meaning of the 'highlight' labels on answers (negative, caution, ack-clinical) is inferred: no patient-facing use was found in the code.",
  "The women's product catalogue JSON (strengths, plan lengths) is not fetched before the wall, so women's strengths and prices come from the schema text and the pricing page only.",
  "The site runs A/B experiments; the consultative men's flow is set to 100% today (config saved), but schemas and versions change (men v77, women v32 on the check date).",
  "Prices are US dollars and US plan structures; legal categories are US ones (Rx, OTC, compounded), not UK ones."],
}

json.dump(company, open(BASE + 'company.json', 'w'), indent=1, ensure_ascii=False)
nq = sum(len(f['questions']) for f in flows); no = sum(len(q['options']) for f in flows for q in f['questions'])
print('wrote company.json:', len(products), 'products,', len(flows), 'flows,', nq, 'questions,', no, 'options,', len(rules), 'rules')
# coverage check: schema nodes that are real screens but not in the spec
for name, QS, spec in (('men', MQ, men_spec), ('women', WQ, women_spec)):
    used = {s['qid'] for s in spec}
    left = [(q['qid'], q['type'], q['text'][:60]) for q in QS.values() if q['qid'] not in used and q['type'] != 'fork']
    print(name, 'nodes not listed as questions:', left)
