#!/usr/bin/env python3
"""build_company.py - writes ../company.json for Hims US (stage 1, MAP).
Run:  python3 scripts/build_company.py   (from the hims-us folder)
After stage 1, edit company.json directly OR edit this script and re-run it, not both.
Every fact below carries its evidence label; nothing is guessed. Where wording was not seen, the text says so.
"""
import json, os

H = 'https://www.hims.com'
ISI = H + '/important-safety/'
SUP = 'https://support.hims.com/hc/en-us/articles/'

COMPOUND = 'US prescription only, compounded (not FDA-approved; "FDA does not approve nor verify the safety, effectiveness, or quality of compounded drugs")'

def P(id, name, category, actives, form, legal, price, detail, url, when, audience='men', evidence='docs', **extra):
    d = dict(id=id, name=name, category=category, actives=actives, form=form, audience=audience, legalStatus=legal,
             price=price, priceDetail=detail, url=url, recommendedWhen=when, evidence=evidence)
    d.update(extra)
    return d

A = lambda n, s=None: {'name': n, 'strength': s} if s else {'name': n}
UNKNOWN_WHEN = 'unknown (the consultation that makes the recommendation could not be opened: see access.blockers)'

products = [
    P('p1', 'Finasteride & Minoxidil + Supplement Blend Pill', 'rx-oral-compounded',
      [A('finasteride', '1.2 mg'), A('minoxidil', '3 mg'), A('biotin', '2.5 mg'), A('vitamin B12', '1 mg'), A('vitamin C', '100 mg'), A('resveratrol', '20 mg'), A('zinc sulfate', '30 mg (about 6.8 mg elemental zinc)')],
      'tablet, once a day', COMPOUND,
      'Starting at $35 per month (hair-loss landing page, 23 Nov 2026)',
      'Product pages and the /lp landing page show "Starting at $29 per month*" with the footnote "*With a 10-month plan, paid upfront in full. Pricing varies by subscription plan". Prices for other plan lengths are only shown inside the consultation (not seen). Tagged "New".',
      H + '/hair-loss/finasteride-minoxidil-supplement-pill', UNKNOWN_WHEN,
      safetyUrl=ISI + 'finasteride-minoxidil-supplement-blend-pill'),
    P('p2', 'Finasteride & Minoxidil + Supplement Blend Chew', 'rx-oral-compounded',
      [A('finasteride', '1.2 mg'), A('minoxidil', '3 mg'), A('biotin'), A('vitamin B5'), A('vitamin B6'), A('vitamin C')],
      'chewable, once a day (citrus flavour)', COMPOUND,
      'Starting at $35 per month (hair-loss landing page, 23 Nov 2026)',
      '"Starting at $29 per month*" on product pages and the /lp page (*10-month plan paid upfront). Supplement amounts are not published ("proprietary blend"). Tagged "Most popular".',
      H + '/hair-loss-finasteride-minox-chew', UNKNOWN_WHEN, safetyUrl=ISI + 'hair-hybrids-chewables'),
    P('p3', 'Rx Hair Loss Spray (Topical Finasteride & Minoxidil Spray)', 'rx-topical-compounded',
      [A('finasteride', '0.3%'), A('minoxidil', '6%')],
      'scalp spray, once a day', COMPOUND,
      'Starting at $35 per month (hair-loss landing page, 23 Nov 2026)',
      '"Starting at $29 per month*" on product pages (*10-month plan paid upfront). Hims blog (hims-vs-keeps, 2025): "start at $35 a month (when you opt for a five-month plan) or $50 for a three-month plan" (the blog says this of two Hims products without naming them clearly). A Fortune reviewer paid $150 for a three-month supply. Inactive: alcohol, propylene glycol, citric acid. Tagged "Quick-drying"; the page calls it "our best-selling treatment".',
      H + '/hair-loss/topical-finasteride', UNKNOWN_WHEN, safetyUrl=ISI + 'rx-hair-loss-spray'),
    P('p4', 'Rx Hair Loss Spray + Ketoconazole + Biotin (4-in-1 spray)', 'rx-topical-compounded',
      [A('finasteride', '0.3%'), A('minoxidil', '7%'), A('ketoconazole', '2.2%'), A('biotin', '0.2%')],
      'scalp spray, once a day (eucalyptus scent)', COMPOUND,
      'Starting at $39 per month (hair-loss landing page, 23 Nov 2026)',
      '"Starting at $33 per month" on product-page carousels. Hims blog (2025): "our 4-in-1 spray ... retails for $39 a month". Fortune (2026) calls it a "select-market" product, so it may not be offered in every state (not confirmed on the site).',
      H + '/hair-loss/hair-loss-spray', UNKNOWN_WHEN, safetyUrl=ISI + 'rxspray-ketoconazole-biotin'),
    P('p5', 'Rx Hair Loss Serum (Topical Finasteride & Minoxidil Serum)', 'rx-topical-compounded',
      [A('finasteride', '0.3%'), A('minoxidil', '6%'), A('essential oil blend (rosemary, juniper, cedar, tea tree, sandalwood, lavender, eucalyptus)')],
      'scalp serum with dropper, once a day', COMPOUND,
      'Starting at $35 per month (hair-loss landing page, 23 Nov 2026)',
      '"Starting at $29 per month*" on product pages (*10-month plan paid upfront). Tagged "Direct application".',
      H + '/hair-loss/serum', UNKNOWN_WHEN, safetyUrl=ISI + 'rx-hair-loss-serum'),
    P('p6', 'Minoxidil + Supplement Blend Chew', 'rx-oral-compounded',
      [A('minoxidil', '3 mg'), A('biotin'), A('vitamin B5'), A('vitamin B6'), A('vitamin C')],
      'chewable, once a day (orange flavour)', COMPOUND,
      '$29 per month on a 10-month plan, paid upfront in full',
      'Shown as "Starting at $29 per month" everywhere. The Google Shopping page states "$29/mo, 10-mo plan*". No finasteride: the oral option without a DHT blocker. Tagged "Convenient routine".',
      H + '/hair-loss/minox-chew', UNKNOWN_WHEN, safetyUrl=ISI + 'hair-hybrids-chewables',
      otherUrls=[H + '/shop/hair-loss/minox-chew-10mo']),
    P('p7', 'Finasteride (generic Propecia) 1 mg tablets', 'rx-oral',
      [A('finasteride', '1 mg')], 'tablet, once a day', 'US prescription only, FDA-approved generic',
      'Starting at $22 per month',
      'Shopping page: "One time purchase price is for a 12-month supply of Finasteride. Subscription price is for a 3-month supply" (the amounts are drawn by script and were not in the page text). Refund offer on that page: "Full refund of price paid available for first 90 days\' supply. Refund request must be made between 90 and 180 days after product shipment delivered."',
      H + '/hair-loss/finasteride', UNKNOWN_WHEN, safetyUrl=ISI + 'finasteride',
      otherUrls=[H + '/hair-loss/finasteride-gs-holiday']),
    P('p8', 'Hair Power Pack', 'bundle',
      [A('finasteride', 'tablets, once a day (1 mg per the finasteride page)'), A('minoxidil', 'solution, 1 mL twice a day (5% per the minoxidil page)'), A('saw palmetto (Thick Fix shampoo)'), A('biotin (gummies)')],
      'kit: tablets + scalp solution + shampoo + gummies', 'US prescription only (contains FDA-approved finasteride) plus OTC items',
      'Starting at $60 per month',
      'The product page showed "Out of stock" on 23 Nov 2026. A separate shopping page sells a "custom kit": "Subscribe at $26/mo Best Value. Get Finasteride pills and your choice of: Biotin Gummy Vitamins, Minoxidil Solution, Thick Fix Shampoo".',
      H + '/hair-loss/hair-power-pack', UNKNOWN_WHEN, safetyUrl=ISI + 'finasteride',
      otherUrls=[H + '/hair-loss/hair-power-pack-shopping']),
    P('p9', 'Finasteride & Minoxidil (two-product kit; probably the "Hair Loss Duo" named in Hims blog posts)', 'bundle',
      [A('finasteride', 'not stated on the card (1 mg tablets inferred)'), A('minoxidil', 'not stated on the card (topical inferred)')],
      'kit of two products (formats not stated on the card)', 'US prescription only (finasteride) plus minoxidil',
      'Starting at $32 per month* (*10-month plan paid upfront, per the /lp page footnote)',
      'Seen only as a card on the landing page /lp/hair-start-top-fin-fa, with the finasteride safety link (so the finasteride part is the oral tablet: inferred). Card text: ("When used together, men saw better results in clinical trials than using either alone"); it has no product page of its own. Hims blog posts quote $32 and $39 a month for 3-month and 12-month commitments but two posts give them the opposite way round, so the plan-to-price match is not reliable.',
      H + '/lp/hair-start-top-fin-fa', UNKNOWN_WHEN, safetyUrl=ISI + 'finasteride'),
    P('p10', 'Minoxidil Foam 5%', 'otc-medicine', [A('minoxidil', '5%')], 'foam, twice a day',
      'US OTC drug (FDA-approved, no prescription)',
      '$20 one-time purchase; "Starting at $19 per month" on subscription',
      '"Subscribe and save: Save up to 5%". The plan picker text also reads "1-month supply $20 $30/ea", which could not be interpreted without the page script. One-time purchase or subscription. Add to cart, no consultation. Not for use if pregnant or breastfeeding. Not shipped to APO/FPO/DPO addresses.',
      H + '/hair-loss/minoxidil-foam', 'Sold without a consultation (add to cart). Whether the consultation offers it as an add-on was not seen.'),
    P('p11', 'Minoxidil Solution 5% ("Minoxidil Serum" / drops)', 'otc-medicine', [A('minoxidil', '5%')], 'scalp solution with dropper, twice a day',
      'US OTC drug (FDA-approved, no prescription)',
      '$15 each; "Starting at $15 per month"',
      'Subscription "Shipped every 3 months" or one-time purchase at $15/ea. The page says it "works best to regrow hair in the vertex or crown area. If you\'re experiencing a receding hairline, finasteride might work for you."',
      H + '/hair-loss/minoxidil', 'Sold without a consultation (add to cart).', otherUrls=[H + '/treatment/hair-loss-minoxidil']),
    P('p12', 'Non-Prescription Hair Loss Kit', 'bundle',
      [A('minoxidil', '5% solution, 2 oz'), A('saw palmetto (Thick Fix shampoo, 6.4 oz)'), A('biotin (30 gummies)')],
      'kit: scalp solution + shampoo + gummies', 'US OTC drug plus cosmetic plus dietary supplement (no prescription)',
      '$37 a month on subscription', '"Shipped every 1 month (most popular)". No consultation needed.',
      H + '/hair-loss/non-prescription-hair-kit', 'Sold without a consultation.'),
    P('p13', 'Thick Fix Thickening Shampoo', 'cosmetic', [A('saw palmetto')], 'shampoo', 'Cosmetic',
      '$19', 'Add to cart. Also part of the Hair Power Pack and the non-prescription kit.', H + '/hair-care/hair-thickening-shampoo', 'Sold without a consultation.'),
    P('p14', 'Thick Fix Thickening Conditioner', 'cosmetic', [A('niacinamide'), A('panthenol')], 'conditioner', 'Cosmetic',
      '$22', 'Add to cart.', H + '/hair-care/conditioner', 'Sold without a consultation.'),
    P('p15', 'Biotin Gummies', 'supplement', [A('biotin (vitamin B7)'), A('vitamin B12'), A('vitamin B6', '2 mg'), A('vitamin D'), A('folic acid'), A('niacin', '5 mg')], 'gummy, one a day', 'US dietary supplement',
      '$16', 'Subscription "Shipped every 3 months" or one-time at $16/ea. The page says: "Biotin gummies are not a hair loss treatment".', H + '/hair-care/vitamins', 'Sold without a consultation.'),
    P('p16', 'Dandruff Detox Shampoo', 'otc-medicine', [A('pyrithione zinc', '1%'), A('salicylic acid (listed as inactive)')], 'medicated shampoo', 'US OTC drug (classification inferred from the anti-dandruff active; the page calls it a "medicated shampoo")',
      '$18 one-time; about $17 on subscription', '"Subscribe and save: Save up to 17%". The plan line reads "1 bottle every month $18 $17/ea" (taken as $17 on subscription).', H + '/hair-loss/zinc-pyrithione-shampoo', 'Sold without a consultation.'),
    P('p17', 'Max Volume Shampoo', 'cosmetic', [A('linden bud extract (Biovolume 128)'), A('caffeine'), A('biotin'), A('chia seed oil'), A('hydrolysed rice protein')], 'shampoo, 6.4 fl oz', 'Cosmetic',
      '$18 one-time; about $17 on subscription', 'Plan line reads "1 bottle every month $18 $17/ea".', H + '/hair-care/volumizing-shampoo-men', 'Sold without a consultation.'),
    P('p18', 'Max Volume Conditioner', 'cosmetic', [A('argan oil'), A('rice bran oil'), A('linden bud extract (Biovolume 128)'), A('biotin')], 'conditioner, 6.4 fl oz', 'Cosmetic',
      '$18 one-time; about $17 on subscription', 'Plan line reads "1 bottle every month $18 $17/ea".', H + '/hair-care/volumizing-conditioner', 'Sold without a consultation.'),
    P('p19', 'Max Volume Shampoo & Conditioner', 'bundle', [A('linden bud extract (Biovolume 128)'), A('biotin'), A('caffeine'), A('argan oil')], 'shampoo + conditioner set', 'Cosmetic',
      '$32 one-time; about $30 on subscription', '"Save up to 6%". Plan line reads "1 kit every month $32 $30/ea".', H + '/hair-care/volumizing-shampoo-conditioner', 'Sold without a consultation.'),
    P('p20', 'Compounded Oral Combination Tablet (ED and Hair Loss)', 'rx-oral-compounded',
      [A('tadalafil'), A('finasteride'), A('minoxidil'), A('biotin'), A('vitamin B12'), A('vitamin D3')],
      'tablet', COMPOUND, 'unknown (no public product page found in the hair section)',
      'Known only from a help-centre patient drug-information sheet, which says "Your compounded medication may not include all of the ingredients below". Strengths not published. Probably sold through the sexual-health consultation; listed here because it treats hair loss too.',
      SUP + '38844902419995-Compounded-Oral-Combination-Tablet-ED-and-Hair-Loss', 'unknown'),
    P('p21', 'Minoxidil tablets (oral minoxidil on its own)', 'rx-oral', [A('minoxidil', 'dose not published')], 'tablet, once a day',
      'US prescription only (FDA-approved drug used off-label for hair loss)', 'unknown (no public product page on hims.com)',
      'Known only from a help-centre drug-information sheet shared by Hims and Hers: "Minoxidil tablets may be used to help stimulate hair growth in certain patients experiencing hair loss". Likely a Hers product or a provider-only option; not confirmed.',
      SUP + '38944589097883-Minoxidil', 'unknown', audience='both'),
    # ---- Hers US (forhers.com): the site is behind a security check, so these come from search-result titles and snippets only ----
    P('w1', 'Hers Oral Minoxidil', 'rx-oral', [A('minoxidil', 'starting dose 1.25 mg, option to increase to 2.5 mg (as quoted from the Hers page by a search engine)')], 'pill, once a day',
      'US prescription only (off-label use)', 'unknown directly; a third-party roundup (NCOA) quotes "$29 per month on Hers"',
      'The Hers site could not be opened (security check). Details are from search-engine snippets of the page, not from the page itself.',
      'https://www.forhers.com/hair-loss/oral-minoxidil', 'unknown (Hers consultation not reachable)', audience='women'),
    P('w2', 'Hers Minoxidil + hair vitamin ("Hair Blends", compounded)', 'rx-oral-compounded', [A('minoxidil', 'not seen'), A('vitamin blend', 'not seen')], 'unknown (pill or chew)',
      COMPOUND, 'unknown', 'Search result title "Most popular Rx". Page not opened (security check). Ingredients and strengths not verified.',
      'https://www.forhers.com/hair-loss/minoxidil-hair-vitamin', 'unknown (Hers consultation not reachable)', audience='women'),
    P('w3', 'Hers Minoxidil + Biotin Chew', 'rx-oral-compounded', [A('minoxidil', 'not seen'), A('biotin', 'not seen')], 'chewable',
      COMPOUND, 'unknown', 'Search result title "2-in-1 treatment Rx". Page not opened (security check).',
      'https://www.forhers.com/hair-loss/minoxidil-biotin-chew', 'unknown (Hers consultation not reachable)', audience='women'),
    P('w4', 'Hers Spironolactone (for hair loss)', 'rx-oral', [A('spironolactone', 'not seen')], 'tablet',
      'US prescription only (off-label use)', 'unknown', 'Search snippet: "blocking androgen hormones which can lead to hair loss in women". A Hims/Hers help-centre drug sheet for spironolactone exists. Page not opened (security check).',
      'https://www.forhers.com/hair-loss/spironolactone', 'unknown (Hers consultation not reachable)', audience='women'),
]

# ---------------- flows ----------------
def O(label, effect, etype='unknown', evidence='unknown', affects=None):
    return dict(label=label, effect=effect, effectType=etype, affects=affects or [], evidence=evidence)

def Q(id, order, stage, text, type_, options, purpose, role, branches, branchDetail, shownWhen, evidence, **extra):
    d = dict(id=id, order=order, stage=stage, text=text, type=type_, options=options, purpose=purpose, engineRole=role,
             branches=branches, branchDetail=branchDetail, shownWhen=shownWhen, evidence=evidence)
    d.update(extra)
    return d

NOT_TESTED = 'Not clicked in a live run. The served page data gives this option no target of its own (plain text), so it should only move to the next question; stage 2 can confirm in one replay.'
lp_questions = [
    Q('lp-q1', 1, 'anonymous', 'What are your hair goals?', 'single', [
        O('Stop hair loss', NOT_TESTED, 'unknown', 'unknown'),
        O('Regrow hair', NOT_TESTED, 'unknown', 'unknown'),
        O('Both', 'Moves to question 2. No page change, no network call, no product change.', 'marketing-only', 'observed'),
      ], 'Engagement: gets the visitor clicking before the sales pitch. The page states the answers are not a medical assessment.', 'marketing', False,
      'No branch in the served definition (options are plain text with no target).', 'always (first of 3, shown in the hero of the landing page)', 'observed',
      proof='runs/baseline-lp-prequiz/02.txt; quiz-definition.lp-prequiz.json'),
    Q('lp-q2', 2, 'anonymous', 'Are you looking for a simple solution to regrow your hair?', 'single', [
        O('Yes', 'Moves to question 3. Nothing else changes.', 'marketing-only', 'observed'),
        O('No', NOT_TESTED, 'unknown', 'unknown'),
      ], 'Engagement and framing ("simple solution" leads into the once-a-day spray pitch).', 'marketing', False,
      'No branch in the served definition.', 'after lp-q1 is answered', 'observed', proof='runs/baseline-lp-prequiz/03.txt'),
    Q('lp-q3', 3, 'anonymous', 'Are you interested in prescription-strength Rx treatments?', 'single', [
        O('Yes', 'Scrolls the same page to the block "Prescription-strength ingredients for real results" with the buttons "Get the spray" and "See if treatment is right for me" (both go to /c/hl).', 'marketing-only', 'observed', ['p3', 'p4']),
        O('Not sure yet', 'Served data links this option to the same on-page block as "Yes" (same target entry id 7iFPgDm1VFwqfOML5ug6Pv). Not clicked live.', 'marketing-only', 'code', ['p3', 'p4']),
      ], 'Leads into the spray pitch whatever the answer.', 'marketing', False,
      'Both options have the same target in the served page data.', 'after lp-q2 is answered', 'observed',
      proof='runs/baseline-lp-prequiz/05.txt and shots/05-lp-prequiz-end-product-pitch.jpg; quiz-definition.lp-prequiz.json'),
]

WNS = '[Exact wording not seen: the consultation would not load] '
POS = 'Position in the flow and its place before or after the account wall are NOT known; the "stage" value here is a best guess and must be checked.'
men_questions = [
    Q('men-t1', 1, 'anonymous', WNS + 'Hair goals step (the "Get started" buttons open /c/hl/goals).', 'single', [],
      'First step when entering by the main "Get started" button. Hims says its form asks about "your hair goals".', 'personalisation', False, '',
      'Entry at /c/hl/goals. ' + POS, 'docs', source=H + '/blog/hims-vs-happy-head'),
    Q('men-t2', 2, 'anonymous', WNS + 'Hair-loss status or pattern (a third-party review mentions "receding hairline, thinning hair").', 'single', [],
      'Likely feeds diagnosis and the product suggestion.', 'diagnosis', False, '', POS, 'docs', source='https://www.healthline.com/health/hims-hair-review (seen through a search summary only)'),
    Q('men-t3', 3, 'anonymous', WNS + 'Other hair-loss products already tried.', 'multi', [],
      'Treatment history.', 'product-selector', False, '', POS, 'docs', source='https://www.healthline.com/health/hims-hair-review (seen through a search summary only)'),
    Q('men-t4', 4, 'anonymous', WNS + 'Family history of hair loss.', 'single', [],
      'Hims: "Hims asks questions about your hair, of course, but also about family history, lifestyle, mental health (like stress levels), and your styling routine."', 'diagnosis', False, '', POS, 'docs', source=H + '/blog/hims-vs-keeps'),
    Q('men-t5', 5, 'anonymous', WNS + 'Lifestyle.', 'single', [], 'Named by Hims as a topic of its form. Each question can carry a "Why We Ask" note.', 'personalisation', False, '', POS, 'docs', source=H + '/blog/hims-vs-keeps'),
    Q('men-t6', 6, 'anonymous', WNS + 'Mental health, for example stress levels.', 'single', [], 'Named by Hims as a topic of its form. Finasteride safety pages warn about depression, so this may also be a safety screen.', 'safety-screen', False, '', POS, 'docs', source=H + '/blog/hims-vs-keeps'),
    Q('men-t7', 7, 'anonymous', WNS + 'Styling routine, styling habits and "how you prefer to wear your hair".', 'single', [], 'Named by Hims as a topic of its form; probably steers format (spray, serum, pill, chew).', 'personalisation', False, '', POS, 'docs', source=H + '/blog/hims-vs-happy-head'),
    Q('men-t8', 8, 'after-account', WNS + 'Prescription preference (the site stores a value called "prescriptionPreference" for the consultation).', 'single', [],
      'Unknown. The stored field name suggests the visitor is asked whether they want prescription treatment; the feature flag "hairLossPrescriptionPreference" is switched on for everyone.', 'product-selector', False, '', POS, 'code',
      source='raw/props-c-hl.json: consultation.prescriptionPreference; experiments.rules.hairLossPrescriptionPreference (treatment-1 = 100%)'),
    Q('men-t9', 9, 'after-account', WNS + 'Account registration (email and password, or Google sign-in).', 'contact', [],
      'The account wall. The /c/hl page loads Google sign-in and Auth0 settings, and the consultation state has a "registration" field. Where it sits in the flow was not seen.', 'identity', False, '', POS, 'code',
      source='raw/props-c-hl.json: consultation.registration; runs/diag-hl/requests.log (accounts.google.com/gsi/client); page config $AUTH0_DOMAIN'),
    Q('men-t10', 10, 'after-account', WNS + 'State you live in (shipping state and ZIP code).', 'text', [],
      'Decides whether the visit can be by messages only or needs a video visit, and which products can ship. The state has an "invalidInitialShippingState" flag, so some states can be refused or re-asked.', 'eligibility-gate', True,
      'Help centre: "Depending on the state where you live, your consultation may be conducted asynchronously... In some states, a video visit with a healthcare provider is required." Not available in Puerto Rico (help centre).', POS, 'docs',
      source=SUP + '360032844051-How-does-this-work; raw/props-c-hl.json: consultation.shippingState, shippingZipCode, invalidInitialShippingState'),
    Q('men-t11', 11, 'after-account', WNS + 'Date of birth.', 'date', [],
      'Age gate: the safety pages say the treatments are not for anyone under 18.', 'eligibility-gate', True, 'Under 18: not eligible (published safety information). The exact screen was not seen.', POS, 'docs',
      source=ISI + 'rx-hair-loss-spray; raw/props-c-hl.json: consultation.dob; experiment name hairLossDateOfBirthCopy'),
    Q('men-t12', 12, 'after-account', WNS + 'Medical intake form: medical conditions, medicines and supplements, allergies (a third-party review also mentions questions on erectile dysfunction).', 'multi', [],
      'The clinical screen read by the provider. The published "who should not take" lists (see rules) show which answers matter: heart, liver, kidney and prostate problems, breast or prostate cancer, blood thinners, antifungals, current finasteride, dutasteride or minoxidil use, allergies.', 'safety-screen', True,
      'The page state has "questions", "rootQuestions" and "triggers", which shows the form has follow-up questions triggered by answers. None of it is sent to the page before the consultation starts.', POS, 'code',
      source='raw/props-c-hl.json: visit.questions, visit.rootQuestions, visit.triggers, visit.isIntakeFormCompleted; ' + SUP + '360032844051-How-does-this-work'),
    Q('men-t13', 13, 'after-account', WNS + 'Photos of your hair or hairline.', 'photo', [],
      'For the provider. Hims: "In most cases, Hims will also have you submit photos of your hair." Experiments named himsHairSkipPhotos, hairLossDiagnosticPhotosReorder and hairLossSelfiePhotoReorder exist.', 'diagnosis', False, '', POS, 'docs', source=H + '/blog/hims-vs-keeps; raw/props-c-hl.json: visit.requiredPhotos'),
    Q('men-t14', 14, 'after-account', WNS + 'Photo ID, if more verification is needed.', 'photo', [],
      'Hims: "If further verification is required, they may ask for additional documentation, like your photo ID."', 'identity', False, '', 'Only when further verification is needed. ' + POS, 'docs', source=H + '/blog/hims-vs-happy-head'),
    Q('men-t15', 15, 'checkout', WNS + 'Treatment choice: product, strength, quantity, days of supply (plan length) and packaging, with a recommended product pre-selected.', 'single', [],
      'The product and plan picker. The stored fields show the site marks a "recommendedBrand" and a recommended dosage that the visitor may override.', 'product-selector', True,
      'Fields in the page state: brandId, strength, quantity, daysSupply, packagingSelection, recommendedBrand, overrideRecommendedDosage, originalRecommendedTreatment, showRecommendationModal. Two flags, maCompoundDeprecation and waCompoundDeprecation, point to different handling of compounded products in Massachusetts and Washington.', POS, 'code',
      source='raw/props-c-hl.json: consultation.treatmentPreferences'),
    Q('men-t16', 16, 'checkout', WNS + 'Optional non-prescription add-ons (for example shampoo or gummies).', 'multi', [],
      'Cross-sell before payment. Experiment names himsHairOTCAddOnV1, himsHairHideOtcStep, hairLossOtcCrossSellBlock and himsHairFreeShampoo exist; the state has "additionalItems" and "otcChargedAmount".', 'marketing', False, '', POS, 'code', source='raw/props-c-hl.json: experiments.rules, consultation.additionalItems'),
]

flows = [
    dict(id='lp-prequiz', name="Landing-page pre-quiz (3 marketing questions)", audience='men', entryUrl=H + '/lp/hair-start-top-fin-fa',
         stagesSummary='3 anonymous marketing questions on the landing page itself, then a product pitch with buttons to the real consultation at /c/hl. No account, no medical question, no recommendation.',
         questions=lp_questions,
         definitionFile='quiz-definition.lp-prequiz.json', baselineFile='baseline-lp-prequiz.json',
         note='The page says: "The above on-page quiz questions are not a medical assessment, and your responses will not be shared with a medical provider. Hims uses your responses to personalize your experience and for other uses as described in our Privacy Policy."'),
    dict(id='men', name="Men's hair-loss consultation (hims.com/c/hl)", audience='men', entryUrl=H + '/c/hl',
         stagesSummary='NOT WALKED: the page stays on a loading spinner because Cloudflare refuses the site\'s own script files. The question list below is a skeleton of topics from Hims\' own articles and from field names in the page, not the real screens. Order and account-wall position unknown.',
         questions=men_questions,
         entryPoints=[
             {'url': H + '/c/hl/goals', 'from': '"Get started" buttons on the hair landing page, product pages and product cards'},
             {'url': H + '/c/hl', 'from': '"See if treatment is right for me", "Get started today", "Find my treatment", "Take the free hair quiz", "Get the spray", "Start my free visit", "Explore Rx options", "Start your free consult"'},
             {'url': H + '/c/hl/?src=pmax_shopping', 'from': '"Find my treatment" on the two spray product pages (adds an ad-source tag only)'},
         ],
         baselineFile='baseline-men.json',
         note='Every prescription product page and landing page sends visitors to the same two URLs. No product-specific entry link (for example one that pre-selects a product) was found in public pages.'),
    dict(id='women', name="Hers US hair-loss consultation (forhers.com)", audience='women', entryUrl='https://www.forhers.com/hair-loss',
         stagesSummary='NOT WALKED: forhers.com shows Cloudflare\'s "Performing security verification" page to this browser, on every page. Nothing could be read.',
         questions=[], baselineFile='baseline-women.json',
         note='Hims US treats men only; its pages send women to forhers.com.'),
]

rules = [
    dict(id='R1', flow='men', when='Age under 18',
         then='Not eligible for any prescription hair product. Published in the safety information ("are younger than 18 years of age"; "Anyone younger than 18 years of age"). How the questionnaire applies it was not seen.',
         effectType='hard-stop', affects=['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'], evidence='docs', proof=ISI + 'rx-hair-loss-spray ; ' + ISI + 'finasteride-minoxidil-supplement-blend-pill', confidence='medium'),
    dict(id='R2', flow='men', when='Woman, or anyone pregnant, breastfeeding or able to become pregnant',
         then='Finasteride products are not for them: "intended for use by adult MEN ONLY" (spray); "intended for use by individuals assigned male at birth ... who are not pregnant, breastfeeding, or able to become pregnant" (finasteride, pill). Hims sends women to Hers.',
         effectType='hard-stop', affects=['p1', 'p2', 'p3', 'p4', 'p5', 'p7', 'p8', 'p9'], evidence='docs', proof=ISI + 'rx-hair-loss-spray ; ' + ISI + 'finasteride', confidence='medium'),
    dict(id='R3', flow='men', when='Currently taking oral finasteride (Propecia, Proscar) or another 5-alpha reductase inhibitor (dutasteride, Avodart, Jalyn)',
         then='Should not use the topical finasteride + minoxidil spray: "Oral finasteride and topical finasteride + minoxidil spray cannot be used at the same time". The pill has the same rule. Whether the engine removes these products or asks the patient to stop the other medicine was not seen.',
         effectType='product-removed', affects=['p1', 'p3', 'p4', 'p5'], evidence='docs', proof=ISI + 'rx-hair-loss-spray', confidence='low'),
    dict(id='R4', flow='men', when='Chronic liver disease (not fatty liver), history of breast cancer, or history of prostate cancer',
         then='Listed under "Do not use topical finasteride + minoxidil if you". Application by the engine not seen.',
         effectType='product-removed', affects=['p3', 'p4', 'p5'], evidence='docs', proof=ISI + 'rx-hair-loss-spray', confidence='low'),
    dict(id='R5', flow='men', when='Any of: pheochromocytoma; blood thinners, antiplatelet drugs or antifungals; bleeding disorder; liver disease; prostate cancer or male breast cancer in the last 5 years; recent chemotherapy; prostate problems; high-dose zinc supplements; allergy to grapes or wine; certain heart disease; chronic kidney disease stage 3 to 5; already using a finasteride or minoxidil product',
         then='Listed under "Who should not take Finasteride & Minoxidil + Supplement Blend" (the combination pill, which contains oral minoxidil). Application by the engine not seen.',
         effectType='product-removed', affects=['p1'], evidence='docs', proof=ISI + 'finasteride-minoxidil-supplement-blend-pill', confidence='low'),
    dict(id='R6', flow='men', when='State of residence is one that requires a live visit',
         then='"In some states, a video visit with a healthcare provider is required. If you reside in one of these states, you will be prompted to schedule a video visit after submitting your online intake form." Elsewhere the provider replies by secure message.',
         effectType='extra-questions', affects=[], evidence='docs', proof=SUP + '360032844051-How-does-this-work', confidence='medium'),
    dict(id='R7', flow='lp-prequiz', when='Any answer to the three landing-page questions',
         then='No effect on eligibility or products. The served definition has no branch, and the page says the answers are not a medical assessment and are not shared with a provider.',
         effectType='marketing-only', affects=[], evidence='code', proof='quiz-definition.lp-prequiz.json ; runs/baseline-lp-prequiz', confidence='high'),
]

company = dict(
    slug='hims-us', company='Hims (US), with sister brand Hers (US)', market='US', website=H + '/hair-loss', parent='Hims & Hers Health, Inc.',
    audiences=['men', 'women'],
    model='Subscription telehealth: online intake reviewed by a licensed provider (by message, or by video where a state requires it), then compounded or generic hair-loss medicines shipped on multi-month plans, plus over-the-counter products sold without a consultation.',
    checkedOn='2026-11-23',
    access=dict(
        howTested=['live-walk', 'site-code', 'public-docs'],
        accountWall='Not located. The consultation at hims.com/c/hl could not be opened, so where sign-in is forced in the US flow is unknown. (The landing-page pre-quiz has no wall and ends by linking to /c/hl.)',
        blockers=[
            'hims.com/c/hl and /c/hl/goals: the page itself returns HTTP 200, but Cloudflare answers the site\'s own script files (/hims.us.modern.*.js) with HTTP 403 "Just a moment..." (header cf-mitigated: challenge). The quiz is drawn by those scripts, so it never leaves the loading spinner. Tried twice, 30+ seconds apart. Not bypassed.',
            'forhers.com (Hers US): every page shows Cloudflare\'s "Performing security verification" check. Not bypassed.',
            'The fetch tool gets HTTP 403 from hims.com and forhers.com as well.',
        ],
        coverageNote='What was done: every hair product page on hims.com was read (they are server-rendered and load normally), with ingredients, strengths and public prices; all entry links were mapped; one landing-page pre-quiz (3 questions) was walked live and its definition extracted from the page data; safety information pages and help-centre drug sheets were read for who can and cannot have each treatment. What was NOT done: the real consultation (questions, branching, recommendation screen, plan prices, account wall) for men, and anything at all on Hers for women. The men\'s question list is a skeleton of topics, not real screens.'),
    products=products, flows=flows, rules=rules, experiments=[], recommendations=[],
    engineSummary='Not observed. From public documents only: every prescription route goes through one consultation (/c/hl). The visitor fills in an intake form (hair goals, hair-loss pattern, products tried, family history, lifestyle, stress, styling habits, medical history, medicines), usually adds photos, and a licensed provider "reviews your info and recommends the right treatment". The site code keeps a recommended product and recommended dose that the customer may override, and lets the customer choose product, strength, quantity and plan length. Published "who should not use" lists show the medical reasons that would rule products out. The three questions on advertising landing pages are marketing only.',
    strengths=[
        'Very wide format range for the same two actives: pill, two chews, two sprays, serum, plain finasteride tablets, kits, foam and solution.',
        'Low headline price ("less than $1 a day", from $29 a month) tied to a 10-month plan paid upfront.',
        'Over-the-counter products can be bought without any consultation.',
        'Published safety information for each prescription product, with clear exclusion lists.',
    ],
    weaknesses=[
        'Headline prices differ between pages on the same day ($35 on the main landing page, $29 on product pages for the same products).',
        'Plan-length prices are not published; the low price needs a 10-month upfront payment.',
        'Most prescription products are compounded and not FDA-approved; strengths of the vitamin blends in the chews are not published.',
        'The Hair Power Pack showed "Out of stock".',
    ],
    opportunities=[
        'Publish a clear price table for every plan length before the quiz.',
        'Show the questions and the reasons behind a recommendation openly; Hims shows neither before sign-up as far as public pages reveal.',
    ],
    sources=[
        {'title': 'Hims hair-loss landing page', 'url': H + '/hair-loss'},
        {'title': 'Landing page with on-page pre-quiz', 'url': H + '/lp/hair-start-top-fin-fa'},
        {'title': 'Comparison landing page', 'url': H + '/lp/hair-start-comparison-dlp'},
        {'title': 'Sitemap', 'url': H + '/sitemap.xml'},
        {'title': 'Important safety information: Rx Hair Loss Spray', 'url': ISI + 'rx-hair-loss-spray'},
        {'title': 'Important safety information: Finasteride & Minoxidil + Supplement Blend Pill', 'url': ISI + 'finasteride-minoxidil-supplement-blend-pill'},
        {'title': 'Important safety information: Finasteride', 'url': ISI + 'finasteride'},
        {'title': 'Important safety information: Hair Hybrids chewables', 'url': ISI + 'hair-hybrids-chewables'},
        {'title': 'Important safety information: spray + ketoconazole + biotin', 'url': ISI + 'rxspray-ketoconazole-biotin'},
        {'title': 'Important safety information: serum', 'url': ISI + 'rx-hair-loss-serum'},
        {'title': 'Help centre: How does this work?', 'url': SUP + '360032844051-How-does-this-work'},
        {'title': 'Help centre: Where is Hims & Hers available?', 'url': SUP + '9586237484571-Where-is-Hims-Hers-available'},
        {'title': 'Help centre: Do I need a prescription?', 'url': SUP + '115002248531-Do-I-need-a-prescription'},
        {'title': 'Help centre: Compounded Oral Combination Tablet (Hair Loss)', 'url': SUP + '38844636581659-Compounded-Oral-Combination-Tablet-Hair-Loss'},
        {'title': 'Help centre: Compounded Topical Combination', 'url': SUP + '38844763548059-Compounded-Topical-Combination'},
        {'title': 'Help centre: Minoxidil + Supplements', 'url': SUP + '38838928667419-Minoxidil-Supplements'},
        {'title': 'Help centre: Finasteride', 'url': SUP + '38942474198171-Finasteride'},
        {'title': 'Help centre: Minoxidil (tablets)', 'url': SUP + '38944589097883-Minoxidil'},
        {'title': 'Help centre: Compounded Oral Combination Tablet (ED and Hair Loss)', 'url': SUP + '38844902419995-Compounded-Oral-Combination-Tablet-ED-and-Hair-Loss'},
        {'title': 'Hims blog: Hims vs. Keeps (describes the intake form and prices)', 'url': H + '/blog/hims-vs-keeps'},
        {'title': 'Hims blog: Hims vs. Happy Head (describes the intake form and prices)', 'url': H + '/blog/hims-vs-happy-head'},
        {'title': 'Hair check-in page (month-3 follow-up questions)', 'url': H + '/hair-loss/check-in'},
        {'title': 'Fortune: Hims hair loss review (published 22 Dec 2025, updated 15 Jul 2026)', 'url': 'https://fortune.com/article/hims-hair-loss-review/'},
        {'title': 'Healthline: Hims hair review (seen through a search summary only)', 'url': 'https://www.healthline.com/health/hims-hair-review'},
        {'title': 'Hers oral minoxidil page (not opened: security check; search snippet only)', 'url': 'https://www.forhers.com/hair-loss/oral-minoxidil'},
    ],
    limitations=[
        'The men\'s consultation was not seen at all. No real question wording, option, branch, stop screen, recommendation or plan price from it is in this file.',
        'The Hers (women) site was not seen at all. The four Hers products come from search-result snippets and are incomplete.',
        'Plan-length prices are known only for the 10-month plan (from footnotes) and from two Hims blog posts and one press review.',
        'The "who should not use" rules are from patient information pages. They show what the provider must rule out, not what the software does with an answer.',
        'Prices shown differ between pages; Hims runs many price tests (hundreds of experiment names are embedded in its pages).',
    ],
)

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'company.json')
json.dump(company, open(out, 'w', encoding='utf8'), indent=1, ensure_ascii=False)
print('wrote', os.path.normpath(out), len(products), 'products')
