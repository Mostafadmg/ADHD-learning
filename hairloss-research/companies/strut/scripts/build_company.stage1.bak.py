#!/usr/bin/env python3
# Build company.json for Strut Health from the saved quiz definitions plus hand-written product facts.
# Usage (from the strut folder): python3 -I scripts/build_company.py
# Question text and options come straight from quiz-definition-<name>.json (never typed by hand).
import json, re, os

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def load(name): return json.load(open(os.path.join(HERE, 'quiz-definition-%s.json' % name)))['flow']

SITE = 'https://www.struthealth.com'
START = 'https://start.struthealth.com/f/'
OLD = 'https://checkout.struthealth.com/'

# ---------------------------------------------------------------- products
COMPOUND = 'US compounded prescription medicine (not FDA-approved; made by a compounding pharmacy on a prescription)'
RX = 'US Rx, FDA-approved generic ("retail"); use for hair loss is on-label for finasteride 1 mg in men'
PICK = ('Not chosen by an engine. The patient picks this product on its product page and the form for that product only sells that '
        'product. A provider reviews the answers afterwards and can approve, change or decline.')
products = [
 dict(id='p1', name='Oral Finasteride 1mg (Retail)', category='rx-oral',
      actives=[{'name': 'finasteride', 'strength': '1 mg tablet, once daily'}], form='tablet', audience='men',
      legalStatus='US Rx, FDA-approved generic tablet (on-label for male pattern hair loss)',
      price='$25 for a 30-day supply (30 tablets), auto-refill',
      priceDetail='$49 for a 90-day supply (code: price IDs 48 and 49, slug finasteride-oral-tablets). Visit and shipping included.',
      url=SITE + '/hair-loss/finasteride/oral',
      recommendedWhen=PICK + ' The form ends the visit for anyone who answers "Female" (code).', evidence='code'),
 dict(id='p2', name='Hairfect Rx Topical Finasteride Formula (Compound), men', category='rx-topical-compounded',
      actives=[{'name': 'finasteride', 'strength': '0.25%'}, {'name': 'minoxidil', 'strength': '7.5% (optional; can be left out)'},
               {'name': 'tretinoin', 'strength': '0.0125% in the form\'s preference list; the price label in code says 0.025% (optional)'},
               {'name': 'fluocinolone', 'strength': 'strength not stated by Strut for this formula (0.01% is stated for the dutasteride and women\'s formulas)'},
               {'name': 'biotin', 'strength': 'not stated'}],
      form='topical gel or solution (patient states a preference), 30 ml once daily or 60 ml twice daily', audience='men',
      legalStatus=COMPOUND,
      price='$59 for a 30-day supply (30 ml, once daily)',
      priceDetail='$79 for a 30-day supply of 60 ml (twice daily). Code: price IDs 311 and 384, slug finasteride-hair-loss-formula. '
                  'Formula preference options in the form: finasteride 0.25% + tretinoin 0.0125% + minoxidil 7.5%; finasteride 0.25% + minoxidil 7.5%; '
                  'finasteride 0.25% + tretinoin 0.0125%; finasteride 0.25% alone; or no preference.',
      url=SITE + '/hair-loss/finasteride/topical',
      recommendedWhen=PICK + ' In the topical finasteride form, "Male" leads to this card; the patient then states a gel/solution and formula preference for the provider.',
      evidence='code'),
 dict(id='p3', name='Topical Finasteride Formula for women (women\'s finasteride hair loss formula)', category='rx-topical-compounded',
      actives=[{'name': 'finasteride', 'strength': '0.25% (same preference list as the men\'s form)'}, {'name': 'minoxidil', 'strength': '7.5% (optional)'},
               {'name': 'tretinoin', 'strength': '0.0125% (optional)'}],
      form='topical gel or solution, 30 ml once daily or 60 ml twice daily', audience='women', legalStatus=COMPOUND,
      price='$59 for a 30-day supply (30 ml, once daily)',
      priceDetail='$79 for 60 ml (twice daily). Code: price IDs 612 and 598, slug womens-finasteride-hair-loss-formula. No product page of its own was found: '
                  'it appears only as the "Female" branch of the topical finasteride form.',
      url=START + '6adb546a5d885b6c0877d8e4',
      recommendedWhen='Shown when "Female" is chosen at "What sex were you assigned at birth?" in the topical finasteride form (code). '
                      'Not seen live: the form starts with the account card.', evidence='code'),
 dict(id='p4', name='Oral Dutasteride capsules (Compound or Retail)', category='rx-oral-compounded',
      actives=[{'name': 'dutasteride', 'strength': '0.1 mg compounded capsule (with biotin up to 5000 mcg) or 0.5 mg retail capsule; the collection page says 0.1 mg to 0.6 mg'},
               {'name': 'biotin', 'strength': 'up to 5000 mcg, only in the compounded 0.1 mg capsule'}],
      form='capsule, once daily', audience='men',
      legalStatus='0.1 mg capsule: ' + COMPOUND + '. 0.5 mg capsule: US Rx FDA-approved generic, used off-label for hair loss.',
      price='$39 for a 30-day supply (30 capsules)',
      priceDetail='Same price for the compounded 0.1 mg and the retail 0.5 mg (docs). The form\'s card lists one option only: "Dutasteride Oral - 0.1mg Capsules" $39 '
                  '(code: price ID 382, slug dutasteride-custom-formulas). How a patient asks for 0.5 mg is not visible in the form.',
      url=SITE + '/hair-loss/dutasteride/oral',
      recommendedWhen=PICK + ' In the dutasteride form it is shown when the patient answers "Oral Custom Capsule".', evidence='code'),
 dict(id='p5', name='Hairfect Rx Topical Dutasteride Formula (Compound)', category='rx-topical-compounded',
      actives=[{'name': 'dutasteride', 'strength': '0.1%'}, {'name': 'minoxidil', 'strength': '7.5% (optional)'}, {'name': 'tretinoin', 'strength': '0.0125% (optional)'},
               {'name': 'fluocinolone', 'strength': '0.01% (optional)'}, {'name': 'biotin', 'strength': 'not stated'}],
      form='topical gel or solution, 30 ml once daily or 60 ml twice daily', audience='men', legalStatus=COMPOUND,
      price='$69 for a 30-day supply (30 ml, once daily)',
      priceDetail='$99 for 60 ml (twice daily). Code: price IDs 380 and 383, slug dutasteride-custom-formulas. Formula preference options in the form: '
                  'dutasteride 0.1% + tretinoin 0.0125% + minoxidil 7.5% + fluocinolone 0.01%; the same without fluocinolone; dutasteride 0.1% + minoxidil 7.5%; dutasteride 0.1% alone; or no preference.',
      url=SITE + '/hair-loss/dutasteride/topical',
      recommendedWhen=PICK + ' In the dutasteride form it is the default path ("Custom Topical Formula").', evidence='code'),
 dict(id='p6', name='HairfectRx Capsules with Finasteride (Compound)', category='rx-oral-compounded',
      actives=[{'name': 'finasteride', 'strength': '1 mg'}, {'name': 'minoxidil', 'strength': '5 mg (oral)'},
               {'name': 'D-biotin, vitamin C, methyltetrahydrofolate, vitamin D3, zinc picolinate, vitamin A', 'strength': 'not stated'}],
      form='liposomal capsule, once daily', audience='men', legalStatus=COMPOUND,
      price='$69 a month (30 capsules), monthly subscription', priceDetail='Old checkout: hair-compound-oral?priceId=2060.',
      url=SITE + '/hair-loss/hairfectrx-finasteride',
      recommendedWhen=PICK + ' Its questionnaire sits behind the account wall of the old checkout and was not seen.', evidence='docs'),
 dict(id='p7', name='HairfectRx Capsules with Dutasteride (Compound)', category='rx-oral-compounded',
      actives=[{'name': 'dutasteride', 'strength': '0.4 mg'}, {'name': 'minoxidil', 'strength': '5 mg (oral)'},
               {'name': 'D-biotin, vitamin C, methyltetrahydrofolate, vitamin D3, zinc picolinate, vitamin A', 'strength': 'not stated'}],
      form='liposomal capsule, once daily', audience='men', legalStatus=COMPOUND,
      price='$69 a month (30 capsules), monthly subscription', priceDetail='Old checkout: hair-compound-oral?priceId=2140.',
      url=SITE + '/hair-loss/hairfectrx-dutasteride',
      recommendedWhen=PICK + ' Its questionnaire sits behind the account wall of the old checkout and was not seen.', evidence='docs'),
 dict(id='p8', name='Oral Minoxidil tablets (Retail)', category='rx-oral',
      actives=[{'name': 'minoxidil', 'strength': '1.25 mg or 2.5 mg daily'}], form='tablet, once daily', audience='both',
      legalStatus='US Rx, FDA-approved generic tablet (approved for high blood pressure; hair loss is off-label)',
      price='$55 for a 90-day supply (1.25 mg)',
      priceDetail='$65 for a 90-day supply (2.5 mg), which is the pre-selected dose in the form (observed). Code: price IDs 798 and 797, slug oral_minoxidil_men. '
                  'The form does not ask sex before the account card; the slug says "men" and the product page does not name an audience.',
      url=SITE + '/hair-loss/oral-minoxidil',
      recommendedWhen=PICK + ' Both doses are shown to every adult straight after the age question, before any medical question (observed).', evidence='observed'),
 dict(id='p9', name='Strut Women\'s Hair Growth Formula (Compound)', category='rx-topical-compounded',
      actives=[{'name': 'spironolactone', 'strength': '1%'}, {'name': 'finasteride', 'strength': '0.25%'}, {'name': 'minoxidil', 'strength': '0 to 7.5%'},
               {'name': 'tretinoin', 'strength': '0 to 0.025%'}, {'name': 'fluocinolone', 'strength': '0.01% (optional)'}, {'name': 'biotin', 'strength': 'not stated'}],
      form='topical solution with dropper, 30 ml a month, applied nightly', audience='women', legalStatus=COMPOUND,
      price='$59 a month (one 30 ml bottle), auto-refill',
      priceDetail='Ingredient combinations are set by the provider ("Spironolactone or Finasteride + Minoxidil + Fluocinolone + Tretinoin + Biotin"). Old checkout: womens-hair-growth-rx-formula?priceId=226.',
      url=SITE + '/hair-loss/strut-hair-formula',
      recommendedWhen=PICK + ' Product page: do not use if pregnant, planning pregnancy or breastfeeding. Its questionnaire sits behind the account wall and was not seen.', evidence='docs'),
 dict(id='p10', name='Strut Hair Booster (Compound)', category='rx-topical-compounded',
      actives=[{'name': 'latanoprost', 'strength': '0.03% (regular) or 0.1% (max strength)'}, {'name': 'melatonin', 'strength': 'not stated'},
               {'name': 'caffeine', 'strength': 'not stated'}, {'name': 'biotin', 'strength': 'not stated'}],
      form='topical, 30 ml, applied once nightly', audience='both', legalStatus=COMPOUND,
      price='$49 for a 30-day supply (regular strength, 30 ml)',
      priceDetail='$99 for max strength 0.1% latanoprost (30 ml). "Your provider will decide which strength is appropriate." Old checkout: latanoprost-hair-booster-formula?priceId=676.',
      url=SITE + '/hair-loss/hair-booster',
      recommendedWhen=PICK + ' Sold as unisex and as an add-on to finasteride, dutasteride or minoxidil. Not for use in pregnancy or breastfeeding unless a provider agrees (docs).', evidence='docs'),
 dict(id='p11', name='Ketoconazole 2% Shampoo (Retail)', category='rx-topical-licensed',
      actives=[{'name': 'ketoconazole', 'strength': '2%'}], form='shampoo, 120 ml (4 oz)', audience='both',
      legalStatus='US Rx, FDA-approved product (for dandruff and seborrhoeic dermatitis; hair-loss use is off-label)',
      price='From $25 for a 120 ml bottle, auto-refill', priceDetail='Old checkout: ketoconazole_shampoo_men?priceId=799 (the slug says "men"; the page does not name an audience).',
      url=SITE + '/hair-loss/ketoconazole-shampoo',
      recommendedWhen=PICK + ' Its questionnaire sits behind the account wall of the old checkout and was not seen.', evidence='docs'),
 dict(id='p12', name='Hairfect Combo (Retail): Finasteride Tablets + StrutVite', category='bundle',
      actives=[{'name': 'finasteride', 'strength': '1 mg tablet'}, {'name': 'StrutVite hair, skin and nail vitamins', 'strength': '2 capsules daily'}],
      form='tablets plus supplement capsules', audience='men', legalStatus='US Rx generic tablet plus a non-prescription food supplement',
      price='$33 a month on a 3-month supply (90 tablets + 180 StrutVite capsules)', priceDetail='Old checkout: hairfect-combo?priceId=243.',
      url=SITE + '/hair-loss/hairfect-combo', recommendedWhen=PICK, evidence='docs'),
 dict(id='p13', name='Hairfect Combo (Compound): Finasteride Gel + StrutVite', category='bundle',
      actives=[{'name': 'topical finasteride formula (finasteride, minoxidil, tretinoin, fluocinolone, biotin)', 'strength': 'customisable; see p2'},
               {'name': 'StrutVite hair, skin and nail vitamins', 'strength': '2 capsules daily'}],
      form='topical gel or solution plus supplement capsules', audience='men', legalStatus=COMPOUND + ' plus a non-prescription food supplement',
      price='$55 a month on a 3-month supply (90 ml topical + 180 StrutVite capsules)', priceDetail='Old checkout: hairfect-gel-combo?priceId=313.',
      url=SITE + '/hair-loss/hairfect-gel-combo', recommendedWhen=PICK, evidence='docs'),
 dict(id='p14', name='Hairfect Combo (Compound or Retail): Dutasteride (topical or oral) + StrutVite', category='bundle',
      actives=[{'name': 'dutasteride topical formula or dutasteride capsules', 'strength': 'see p4 and p5'},
               {'name': 'StrutVite hair, skin and nail vitamins', 'strength': '2 capsules daily'}],
      form='topical or capsules, plus supplement capsules', audience='men', legalStatus=COMPOUND + ' or US Rx generic capsule, plus a non-prescription food supplement',
      price='$60 a month on a 90-day supply (90 ml topical + 180 StrutVite capsules)',
      priceDetail='$40 a month on a 90-day supply (90 dutasteride capsules + 180 StrutVite capsules). Old checkout: dutasteride-hair-combo?priceId=485.',
      url=SITE + '/hair-loss/dutasteride-hair-combo', recommendedWhen=PICK, evidence='docs'),
 dict(id='p15', name='StrutVite hair, skin and nail supplement', category='supplement',
      actives=[{'name': 'vitamins A, C, D, E, B1, B5, B6, B9, B12, biotin; calcium, iron, magnesium, zinc, manganese, potassium; botanicals including horsetail, fo-ti, bamboo, nettle, saw palmetto', 'strength': 'not stated on the page text captured'}],
      form='capsule, 2 once daily', audience='both', legalStatus='US non-prescription food supplement',
      price='$24.99 for 60 capsules (30 doses), auto-refill', priceDetail='Old checkout: otc-strutvite?priceId=710. Listed under Skin, and bundled into the three Hairfect Combos.',
      url=SITE + '/skin/strutvite', recommendedWhen='Sold on its own without a prescription, or as part of a Hairfect Combo.', evidence='docs'),
]

# ---------------------------------------------------------------- flows from the served definitions
NOBRANCH = 'No branch in the form: every option goes to the same next screen. The answer is stored for the reviewing provider; what the provider does with it is not visible.'
def opt(label, effect=NOBRANCH, et='next-question', affects=None, ev='code'):
    return {'label': label, 'effect': effect, 'effectType': et, 'affects': affects or [], 'evidence': ev}

# label text -> (purpose, engineRole)
ANN = {
 'What is your age?': ('Screens out under-18s.', 'eligibility-gate'),
 'What sex were you assigned at birth?': ('Decides whether the product can be offered and which product card is shown.', 'eligibility-gate'),
 'Which form of dutasteride are you looking to use?': ('Chooses between the topical formula and the oral capsule.', 'product-selector'),
 'How long ago did you first notice signs of hair loss?': ('History for the provider: how long the hair loss has been going on.', 'diagnosis'),
 'What symptoms of hair loss have you noticed? Select all that apply.': ('Pattern of hair loss for the provider (pattern loss, patchy, diffuse, shedding).', 'diagnosis'),
 'Have you noticed any scalp symptoms? Select all that apply.': ('Looks for signs of scalp disease or sudden loss that would point away from pattern hair loss.', 'diagnosis'),
 'What treatments have you tried before? Select all that apply.': ('Treatment history for the provider.', 'personalisation'),
 'Do you have any issues with sexual dysfunction currently?': ('Baseline sexual function before a 5-alpha-reductase inhibitor.', 'safety-screen'),
 'Are you allergic to any of the following? Select all that apply.': ('Allergy check against the ingredients Strut uses.', 'safety-screen'),
 'Do you have any of the following medical conditions? Select all that apply.': ('Medical history check (heart, blood pressure, liver, kidney, cancer and so on).', 'safety-screen'),
 'Have you had any surgeries?': ('Surgical history for the provider.', 'safety-screen'),
 'Are you currently taking any medications, vitamins, or supplements?': ('Medicines history for interaction checks.', 'safety-screen'),
 'Do you have concerns about your mood, depression, anxiety, or excessive worrying?': ('Mental health screen before finasteride or dutasteride.', 'safety-screen'),
 'In the last 2 weeks, have you lost interest in doing your daily routine?': ('Depression screen.', 'safety-screen'),
 'In the last 2 weeks, have you had any thoughts of hurting yourself?': ('Self-harm screen.', 'safety-screen'),
 'Important Mental Health Warning': ('Warns that finasteride and dutasteride may worsen depression or anxiety.', 'expectation-setting'),
 'Is there anything else you want your doctor to know about your condition or health?': ('Free-text catch-all.', 'data-capture'),
 'Would you like the solution or gel?': ('Vehicle preference for the compounded topical.', 'personalisation'),
 'Please select a preference if you have one, so your physician can review the selection with your medical history.': ('Lets the patient ask for a formula (which actives to include). The provider decides.', 'product-selector'),
}
BRANCH_OPTS = {
 ('What is your age?', 'Under 18'): ('Goes to the "Age Verification" stop screen: "These medications are only available for patients 18 and older." The only choices are to go back or end.', 'hard-stop'),
 ('Have you had any surgeries?', 'Yes'): ('Adds one free-text screen: "Please describe your surgical history".', 'extra-questions'),
 ('Have you had any surgeries?', 'No'): ('Skips the surgical history screen.', 'next-question'),
 ('Are you currently taking any medications, vitamins, or supplements?', 'Yes'): ('Adds one free-text screen: "Please list all current medications, vitamins, and supplements with dosages".', 'extra-questions'),
 ('Are you currently taking any medications, vitamins, or supplements?', 'No'): ('Skips the medicines list screen.', 'next-question'),
 ('In the last 2 weeks, have you had any thoughts of hurting yourself?', 'Yes'): ('Goes to the "Safety Alert" screen (988 Suicide and Crisis Lifeline, 911). The only choices are to go back and change the answer or end the questionnaire, so the visit cannot continue with "Yes".', 'hard-stop'),
 ('In the last 2 weeks, have you had any thoughts of hurting yourself?', 'No'): ('Goes on to the mental health warning screen.', 'next-question'),
 ('Is there anything else you want your doctor to know about your condition or health?', 'Yes'): ('Adds one free-text screen (up to 1,000 characters).', 'extra-questions'),
 ('Is there anything else you want your doctor to know about your condition or health?', 'No'): ('Goes straight on.', 'next-question'),
}

def build_flow(name, fid, fname, audience, entry, summary, first_is_wall, sex_effects, card_products, observed_run=None):
    f = load(name)
    nodes = {n['id']: n for n in f['nodes']}; edges = {e['id']: e for e in f['edges']}
    cn = {c['_id']: c['name'] for c in f['reactComponents']}
    bysrc = {}
    for e in f['edges']: bysrc.setdefault(e['source'], []).append(e)
    def targets(nid):
        n = nodes[nid]; d = None; side = []
        for p in n.get('paths') or []:
            e = edges.get(p.get('edgeId') or p.get('id'))
            if not e: continue
            if p.get('isDefault') and d is None: d = e['target']
            else: side.append((p, e['target']))
        if not (n.get('paths') or []):
            es = bysrc.get(nid, [])
            if es: d = es[0]['target']
        return d, side
    def ans_label(n, p):
        # human label of the answer that triggers a non-default path
        for g in p.get('conditionGroups') or []:
            for c in g.get('conditions') or []:
                v = c.get('value')
                for b in (n.get('config') or {}).get('blocks') or []:
                    for o in (b.get('propValues') or {}).get('options') or []:
                        if v in (o.get('id'), o.get('value')): return o.get('label')
                if v in ('yes', 'no'): return v.capitalize()
                if v == 'selfie': return 'identity check failed'
        return p.get('label')
    def qlabel(n):
        return next((b['propValues'].get('label') for b in (n.get('config') or {}).get('blocks') or [] if b.get('blockType') in ('label', 'label-ds')), n['id'])
    main = []; x = next(n for n in nodes if n.startswith('node-start'))
    while x and x not in main and x in nodes:
        main.append(x); x = targets(x)[0]
    order = []; cond = {}; parent = {}; endings = []
    def add_side(src):
        for p, t in targets(src)[1]:
            if t in main or t in order or t not in nodes: continue
            if (nodes[t].get('type') or '').startswith('ending'):
                if t not in endings: endings.append(t)
                continue
            cond[t] = 'only after "%s" at "%s"' % (ans_label(nodes[src], p), qlabel(nodes[src])); parent[t] = src
            order.append(t); add_side(t)
            d2 = targets(t)[0]
            if d2 and d2 in nodes and (nodes[d2].get('type') or '').startswith('ending') and d2 not in endings: endings.append(d2)
    for m in main:
        order.append(m); add_side(m)
    for t in endings:
        if t not in order: order.append(t)
    seen = set(order)
    main_set = set(main)
    qs = []; stage = 'anonymous'; after_wall = False; n_order = 0; stage_at = {}
    def add(nid, text, typ, options, purpose, role, branches=False, detail='', shown='always', stg=None, ev=None):
        nonlocal n_order
        n_order += 1
        s = stg or (stage_at.get(parent.get(nid), stage) if nid in parent else stage)
        if nid in main_set: stage_at[nid] = s
        e = ev or ('observed' if (observed_run and s == 'anonymous' and nid in main_set) else 'code')
        qs.append({'id': '%s-q%02d' % (fid, n_order), 'order': n_order, 'stage': s, 'text': text, 'type': typ, 'options': options,
                   'purpose': purpose, 'engineRole': role, 'branches': branches, 'branchDetail': detail, 'shownWhen': shown,
                   'evidence': e, 'node': nid})
    for nid in order:
        n = nodes[nid]; cfg = n.get('config') or {}
        if n.get('type') == 'start': continue
        if (n.get('type') or '').startswith('ending'):
            add(nid, 'End of questionnaire: the browser is sent to www.struthealth.co', 'info', [], 'Exit after a stop screen.', 'eligibility-gate', shown='after choosing "End questionnaire" on a stop screen', stg='anonymous' if not first_is_wall else 'after-account', ev='code')
            continue
        blocks = cfg.get('blocks') or []
        label = next((b['propValues'].get('label') for b in blocks if b.get('blockType') in ('label', 'label-ds')), None)
        sub = next((b['propValues'].get('sublabel') for b in blocks if b.get('blockType') in ('label', 'label-ds') and b['propValues'].get('sublabel')), None)
        comps = [(cn.get(b.get('componentId')), b.get('propValues') or {}) for b in blocks if b.get('componentId')]
        comps = [c for c in comps if c[0] not in ('Custom Strut Header', 'Cart', 'None of the above advance', 'Condition badge', 'Card declined notice', 'Go to struthealth')]
        inputs = [b for b in blocks if b.get('blockType') in ('multi-choice', 'multi-choice-ds', 'yes-no', 'text-area', 'statement', 'address', 'payment')]
        shown = cond.get(nid, 'always')
        names = [c[0] for c in comps]
        # ---- custom cards
        if 'Starting card' in names:
            add(nid, 'See your treatment options. Join for a tailored experience crafted by experts. [Enter your e-mail] [Enter your phone number] [tick box: I agree to the Consent, Privacy, Terms, and receiving recurring automated marketing texts from Strut Health.] Continue / Already have an account? Sign In. / or (Google)', 'contact', [],
                'Account wall: creates the account (e-mail and phone, or Google) before any question is shown.', 'identity', stg='anonymous', ev='observed')
            stage = 'after-account'; continue
        if 'Welcome Screen Badge' in names:
            add(nid, 'Ready to start your Strut Hair Loss journey. Medical questionnaire. This secure form collects important health information to help our licensed medical providers evaluate your eligibility and make informed decisions about your care. HOW IT WORKS 1 Answer the questionnaire honestly and as completely as possible. 2 A licensed medical provider will review your responses within 1 business day. 3 If any additional information is needed, our team will reach out via email or SMS. [Continue]', 'info', [],
                'Welcome screen: sets expectations (provider review within 1 business day).', 'expectation-setting'); continue
        if 'DOB Card' in names:
            add(nid, 'To verify your eligibility, please enter your date of birth', 'date', [], 'Date of birth for identity and age (year, month, day pickers). The card saves it to the Strut account; an invalid date shows "Date of Birth is not valid. Please enter a valid Date of Birth."', 'identity'); continue
        card = next((c for c in names if c in card_products), None)
        if card:
            title, opts, purpose = card_products[card]
            add(nid, title, 'single', opts, purpose, 'product-selector', branches=False, detail='The choice sets the price ID put in the cart ("Add to cart"). It does not change the questions.', shown=shown); continue
        if 'Hairloss photo input' in names:
            add(nid, 'Hair photos for your doctor. [Front of your hairline: "Tilt your head slightly down so your front hairline is visible."] [Back of your hairline: "Use a mirror or helper to show the back of your hairline."] Good lighting, no filters.', 'photo', [],
                'Two scalp photos for the provider. The continue button stays disabled until both photos are added (code: disabled={!allComplete}).', 'diagnosis'); continue
        if 'Multiple Choice (Design System) (custom)' in names:
            pv = dict(comps[names.index('Multiple Choice (Design System) (custom)')][1])
            o = [opt(pv.get('optionALabel') + ': ' + pv.get('optionAText')), opt(pv.get('optionBLabel') + ': ' + pv.get('optionBText'))]
            add(nid, label + ' (Note under the options: "' + pv.get('followUpText', '') + '")', 'single', o, *ANN[label], shown=shown); continue
        if 'ProfileCard' in names:
            add(nid, 'Complete your free account. All fields are required. [First name*] [Last name*] [Gender*] [Email*] [Phone*] [Password*] [Confirm password*] plus agreement to Telemedicine Consent, Privacy Policy, Refund Policy and Terms & Conditions', 'contact', [],
                'Completes the account profile (name, gender, password) after the questions.', 'identity', stg='after-account'); continue
        if 'Strut Auth' in names:
            add(nid, 'Create account. A few details and you are ready to continue. [Sign up | Sign in] [FIRST NAME] [LAST NAME] [DATE OF BIRTH] [PHONE NUMBER] [EMAIL] [PASSWORD] Create account / Already have an account? Sign in', 'contact', [],
                'Account wall: the anonymous walk stops here (75% on the progress bar).', 'identity', stg='anonymous', ev='observed')
            stage = 'after-account'; continue
        if 'Strut ID Verification' in names:
            add(nid, (label or 'Verify your identity') + ((' ' + sub) if sub else '') + ' [Start Identity Verification] (Persona identity check, pre-filled from the account profile)', 'photo', [],
                'Identity check by Persona (government ID). If it fails, the form falls back to a photo ID and selfie upload.', 'identity', branches=True, detail='If the card reports route = "selfie" the next screen is the Selfie Input fallback; otherwise the shopping cart.', stg='after-account'); continue
        if 'Selfie Input' in names:
            pv = comps[names.index('Selfie Input')][1]
            add(nid, '%s: %s %s [%s: %s] [%s: %s]' % (pv.get('eyebrow'), pv.get('heading'), pv.get('failureMessage'), pv.get('documentLabel'), pv.get('documentHint'), pv.get('selfieLabel'), pv.get('selfieHint')), 'photo', [],
                'Fallback when the Persona check fails: photo ID and selfie for the provider to verify by hand.', 'identity', shown='only when the Persona identity check fails', stg='after-account'); continue
        if 'Shopping Cart' in names:
            stage = 'checkout'
            add(nid, 'Shopping cart with order summary and promo code field. [Proceed to Checkout]', 'info', [], 'Order summary before payment (a "coupon" URL variable can pre-fill a promo code).', 'data-capture', stg='checkout'); continue
        if 'Strut Finalize' in names:
            add(nid, 'Order is submitted (FinishOrderV2). No question shown unless the card is declined.', 'info', [], 'Places the order for provider review.', 'data-capture', branches=True, detail='status = "declined" sends the patient back to the payment screen; otherwise the order-completed screen.', stg='checkout'); continue
        if 'OrderSuccess' in names:
            pv = comps[names.index('OrderSuccess')][1]
            add(nid, '%s. %s %s %s' % (pv.get('thankYouTitle'), pv.get('thankYouMessage'), pv.get('reviewMessage'), pv.get('expectationMessage')), 'info', [], 'Confirmation: a doctor reviews the order and e-mails within 48 hours.', 'expectation-setting', stg='checkout'); continue
        # ---- standard inputs
        if not inputs: continue
        b = inputs[0]; bt = b['blockType']; pv = b.get('propValues') or {}
        text = label or pv.get('label') or ''
        if sub and bt not in ('multi-choice', 'multi-choice-ds') or (sub and 'Verification' in text) or (sub and text == 'Safety Alert') or (sub and 'Male Patients' in text):
            pass
        full = text + ((' ' + sub) if sub and sub not in text else '')
        purpose, role = ANN.get(text, ('', ''))
        if bt in ('multi-choice', 'multi-choice-ds'):
            typ = 'multi' if pv.get('allowMulti') else 'single'
            opts = []; br = False; det = []
            paths = n.get('paths') or []
            for o in pv.get('options') or []:
                lab = o.get('label')
                key = (text, lab)
                if text == 'What sex were you assigned at birth?':
                    eff, et, aff = sex_effects[lab]; opts.append(opt(lab, eff, et, aff)); br = True
                elif key in BRANCH_OPTS:
                    eff, et = BRANCH_OPTS[key]; opts.append(opt(lab, eff, et)); br = True
                elif text == 'What is your age?':
                    opts.append(opt(lab, 'Continues. No other age band changes the route in the form.', 'next-question'))
                elif text == 'Which form of dutasteride are you looking to use?':
                    if lab.startswith('Custom Topical'): opts.append(opt(lab, 'Shows the topical dutasteride card (30 ml $69 or 60 ml $99), then "Would you like the solution or gel?" and the formula preference question.', 'product-switched', ['p5']))
                    else: opts.append(opt(lab, 'Shows the oral dutasteride card (0.1 mg capsules, $39) and skips the solution/gel and formula preference questions.', 'product-switched', ['p4']))
                    br = True
                elif text in ('Age Verification', 'Safety Alert', 'Available for Male Patients Only'):
                    if lab.startswith('Go back'): opts.append(opt(lab, 'Returns to the question so the answer can be changed.', 'next-question'))
                    else: opts.append(opt(lab, 'Ends the questionnaire and redirects to www.struthealth.co.', 'hard-stop'))
                    br = True
                elif text.startswith('Please select a preference'):
                    opts.append(opt(lab, 'Recorded as the patient\'s preferred formula. No branch in the form; the provider makes the final choice.', 'flag-for-clinician'))
                elif o.get('selectBehavior') == 'deselect-others':
                    opts.append(opt(lab, 'Clears the other ticks. ' + NOBRANCH))
                elif o.get('selectBehavior') == 'allow-other':
                    opts.append(opt(lab, 'Opens a free-text box. ' + NOBRANCH))
                else:
                    opts.append(opt(lab))
            if text in ('Age Verification', 'Safety Alert', 'Available for Male Patients Only'):
                purpose, role = ('Stop screen. ' + (sub or ''), 'eligibility-gate' if text != 'Safety Alert' else 'safety-screen')
            if text == 'What is your age?': det.append('"Under 18" goes to the Age Verification stop screen; every other band continues.')
            if text == 'What sex were you assigned at birth?':
                det.append('See option effects.')
                if pv.get('label') and pv.get('label') != text: det.append('The block is internally labelled "%s" with the sub-label "%s" (the separate heading block of the node says "What sex were you assigned at birth?"; which wording shows on screen was not seen because this screen is behind the account wall).' % (pv.get('label'), pv.get('sublabel')))
            add(nid, full, typ, opts, purpose or 'Stop screen.', role or 'eligibility-gate', branches=br, detail=' '.join(det), shown=shown)
        elif bt == 'yes-no':
            opts = []; br = False
            for lab in ('Yes', 'No'):
                if (text, lab) in BRANCH_OPTS:
                    eff, et = BRANCH_OPTS[(text, lab)]; opts.append(opt(lab, eff, et)); br = True
                else: opts.append(opt(lab))
            add(nid, full, 'single', opts, purpose, role, branches=br, detail='"Yes" adds or diverts as described in the option effects.' if br else '', shown=shown)
        elif bt == 'text-area':
            add(nid, text + ((' (placeholder: "%s")' % pv.get('placeholder')) if pv.get('placeholder') else ''), 'text', [], 'Free text for the provider.', 'data-capture', shown=shown)
        elif bt == 'statement':
            content = re.sub(r'<[^>]+>', ' ', pv.get('content') or ''); content = re.sub(r'\s+', ' ', content).strip()
            add(nid, text + ': ' + content, 'info', [], *ANN.get(text, ('Information screen.', 'expectation-setting')), shown=shown)
        elif bt == 'address':
            add(nid, full, 'contact', [], 'Shipping address (address search).', 'identity', stg='after-account')
        elif bt == 'payment':
            stage = 'checkout'
            add(nid, full + ' [Save Card] (Authorize.net, card is saved, not charged at this step)', 'contact', [], 'Card details. The card is stored ("setup" mode); Strut says you are only charged if the provider approves.', 'data-capture', stg='checkout')
    for q in qs:
        t = q['text']
        if q['shownWhen'] == 'always':
            if fid == 'men-finasteride-oral' and t.startswith('Finasteride Tablets.'): q['shownWhen'] = 'after "Male" at the sex question (default path)'
            if fid == 'finasteride-topical' and t.startswith('Topical Finasteride.'): q['shownWhen'] = 'after "Male" at the sex question (default path)'
            if fid == 'dutasteride' and (t.startswith('Dutasteride Topical.') or t.startswith('Would you like the solution or gel?') or t.startswith('Please select a preference')):
                q['shownWhen'] = 'only when "Custom Topical Formula" is chosen at "Which form of dutasteride are you looking to use?" (default path); skipped for "Oral Custom Capsule"'
        q.pop('node', None)
    return {'id': fid, 'name': fname, 'audience': audience, 'entryUrl': entry, 'stagesSummary': summary, 'questions': qs,
            'definitionFile': 'quiz-definition-%s.json' % name, 'flowTitleInCode': f['title'], 'pathwaiFlowId': f['_id']}

card = lambda purpose, title, rows: (title, [opt(l, e, 'none' if 'default' not in e.lower() else 'none', a) for l, e, a in rows], purpose)
CARDS_FIN_ORAL = {'finasteride tablet': card('Supply length and price. Shown right after the sex question, before the medical questions.',
    'Finasteride Tablets. For Men. Oral finasteride 1mg for hair loss · dispensed by a US licensed pharmacy. SUPPLY [options] Total today. [Add to cart]',
    [('30 Day Supply - 1mg ($25 for 30 days)', 'Default. Puts price ID 48 in the cart.', ['p1']), ('90 Day Supply - 1mg ($49 for 90 days)', 'Puts price ID 49 in the cart.', ['p1'])])}
CARDS_FIN_TOP = {
 'finasteride men : Dose selection': card('Quantity and price for men. Shown right after the sex question.',
    'Topical Finasteride. Custom hair loss formula · compounded by a US licensed pharmacy. FORMULA [options] Total today. [Add to cart]',
    [('30 Day Supply - 30 ml (Once Daily) ($59 for 30 days)', 'Default. Puts price ID 311 in the cart.', ['p2']), ('30 Day Supply - 60 ml (Twice Daily) ($79 for 30 days)', 'Puts price ID 384 in the cart (double quantity).', ['p2'])]),
 'finasteride women : Dose selection': card('Quantity and price for women. Shown only after "Female".',
    'Topical Finasteride. Custom hair loss formula · compounded by a US licensed pharmacy. FORMULA [options] Total today. [Add to cart] (women\'s card)',
    [('30 Day Supply - 30 ml (Once Daily) ($59 for 30 days)', 'Default. Puts price ID 612 in the cart (women\'s product).', ['p3']), ('30 Day Supply - 60 ml (Twice Daily) ($79 for 30 days)', 'Puts price ID 598 in the cart.', ['p3'])])}
CARDS_DUT = {
 'Dutasteride topical : Dose selection': card('Quantity and price for the topical formula.',
    'Dutasteride Topical. Custom topical hair loss formula · compounded by a US licensed pharmacy. SUPPLY [options] Total today. [Add to cart]',
    [('30 ml once daily ($69 for 30 days)', 'Default. Puts price ID 380 in the cart.', ['p5']), ('60 ml twice daily ($99 for 30 days)', 'Puts price ID 383 in the cart.', ['p5'])]),
 'Dutasteride Oral : Dose selection': card('Price for the oral capsule (one option only).',
    'Dutasteride Oral. custom hair loss formula compounded by a US licensed pharmacy. FORMULA [option] Total today. [Add to cart]',
    [('Dutasteride Oral - 0.1mg Capsules ($39 for 30 days)', 'Only option. Puts price ID 382 in the cart.', ['p4'])])}
CARDS_MIN = {'Minoxidil : Dose selection': (
    'Minoxidil Tablets. Oral minoxidil for hair loss · compounded by a US licensed pharmacy. DOSE [options] TOTAL TODAY. [Add to cart]',
    [opt('2.5 mg, 90 Day Supply, $65 for 90 days', 'Pre-selected. Puts price ID 797 in the cart. The questions that follow do not change.', 'none', ['p8'], 'observed'),
     opt('1.25 mg, 90 Day Supply, $55 for 90 days', 'Puts price ID 798 in the cart. Whether the questions change was not replayed, but the definition has no branch on this card.', 'none', ['p8'], 'code')],
    'Dose and price. Shown straight after the age question, before any medical question.')}

flows = [
 build_flow('fin_oral', 'men-finasteride-oral', 'Oral finasteride intake form (new PathwAI form)', 'men', START + '6adb53275c3d5e719ab02595',
    'Account card first (e-mail + phone): nothing is anonymous. Then, from the served definition: date of birth, age, sex, supply picker, 13 questions and one warning screen (up to 3 extra free-text screens), profile, address, Persona ID check, cart, card, order submitted for provider review.',
    True, {'Male': ('Default path: shows the finasteride tablet supply card.', 'next-question', ['p1']),
           'Female': ('Goes to the stop screen "Available for Male Patients Only": "These medications are only available for male." Choices: go back or end.', 'hard-stop', ['p1'])}, CARDS_FIN_ORAL),
 build_flow('fin_topical', 'finasteride-topical', 'Topical finasteride (Hairfect Rx) intake form (new PathwAI form)', 'both', START + '6adb546a5d885b6c0877d8e4',
    'Account card first (e-mail + phone): nothing is anonymous. Then, from the served definition: date of birth, age, sex (men\'s or women\'s product card), 13 questions and one warning screen, two hairline photos (required), solution or gel, formula preference, profile, address, Persona ID check, cart, card, order submitted.',
    True, {'Male': ('Default path: shows the men\'s topical finasteride card ($59 / $79).', 'next-question', ['p2']),
           'Female': ('Shows the women\'s topical finasteride card instead (same prices, different product and price IDs). The questions after it are the same as for men: the form has no pregnancy, breastfeeding or contraception question.', 'product-switched', ['p3'])}, CARDS_FIN_TOP),
 build_flow('dut', 'dutasteride', 'Dutasteride intake form, topical or oral (new PathwAI form)', 'men', START + '6ad9e1d39fba7abfd231a5b3',
    'Account card first (e-mail + phone): nothing is anonymous. Then, from the served definition: date of birth, age, topical-or-oral choice, product card (topical also asks solution or gel and formula preference), 13 questions and one warning screen, two hairline photos (required), profile, address, Persona ID check, cart, card, order submitted. There is no sex question in this form.',
    True, {}, CARDS_DUT),
 build_flow('oral_min', 'oral-minoxidil', 'Oral minoxidil intake form (new PathwAI form)', 'both', START + '6aa3d578f415d1603a6e0c85',
    'Welcome screen, age, dose picker ("Add to cart"), then 13 questions and one warning screen (up to 3 extra free-text screens), all anonymous; then the account wall ("Create account") at 75%; then address, Persona ID check, cart, card, order submitted. No sex question, no blood pressure or heart rate question, no photos.',
    False, {}, CARDS_MIN, observed_run='runs/baseline-men-oral-minoxidil'),
]
# old checkout: wall at the first screen, questions not visible
flows.append({'id': 'old-checkout', 'name': 'Old checkout app (women\'s Strut Hair Formula, Hair Booster, ketoconazole shampoo, HairfectRx capsules, the three Hairfect Combos, StrutVite)',
  'audience': 'both', 'entryUrl': OLD + 'womens-hair-growth-rx-formula?priceId=226',
  'stagesSummary': 'Every old-checkout link redirects at once to /auth/sign-up (e-mail + phone). The medical questions are loaded from the Strut API only for a signed-in visit, so none are visible. Other entry links: hair-compound-oral?priceId=2060 and 2140, latanoprost-hair-booster-formula?priceId=676, ketoconazole_shampoo_men?priceId=799, hairfect-combo?priceId=243, hairfect-gel-combo?priceId=313, dutasteride-hair-combo?priceId=485, otc-strutvite?priceId=710.',
  'questions': [{'id': 'old-checkout-q01', 'order': 1, 'stage': 'anonymous',
     'text': 'See your treatment options. Join for a tailored experience crafted by experts. [Enter your e-mail] [Enter your phone number] [tick box: By creating an account using e-mail, Google, I agree to the Telemedicine Consent, Privacy Policy, Refund Policy and Terms & Conditions] Continue / Already have an account? Sign In. / or (Google)',
     'type': 'contact', 'options': [], 'purpose': 'Account wall on the first screen. Nothing else is shown to an anonymous visitor.', 'engineRole': 'identity',
     'branches': False, 'branchDetail': '', 'shownWhen': 'always', 'evidence': 'observed'}]})

# ---------------------------------------------------------------- rules (read from the definition; stage 2 should confirm what it can)
rules = [
 dict(id='R1', flow='oral-minoxidil', when='oral-minoxidil age = "Under 18"', then='Stop screen "Age Verification": only for patients 18 and older. Go back or end. Same node in all four forms.', effectType='hard-stop', affects=['p8'], evidence='code', proof='quiz-definition-oral_min.json node-1 path "Under 18" -> node-20 (not yet replayed; first thing for stage 2 in runs/)', confidence='high'),
 dict(id='R2', flow='men-finasteride-oral', when='sex at birth = "Female"', then='Stop screen "Available for Male Patients Only". Go back or end.', effectType='hard-stop', affects=['p1'], evidence='code', proof='quiz-definition-fin_oral.json node-2 path "Female" -> node-1789033271452 (behind the account wall, cannot be replayed)', confidence='high'),
 dict(id='R3', flow='finasteride-topical', when='sex at birth = "Female"', then='The women\'s topical finasteride card replaces the men\'s card (price IDs 612/598 instead of 311/384); all later questions are the same and none asks about pregnancy.', effectType='product-switched', affects=['p2', 'p3'], evidence='code', proof='quiz-definition-fin_topical.json node-2 path "Female" -> node-1789033271452 (finasteride women : Dose selection) -> node-3 (behind the account wall)', confidence='high'),
 dict(id='R4', flow='dutasteride', when='"Which form of dutasteride are you looking to use?" = "Oral Custom Capsule"', then='Oral capsule card ($39) instead of the topical card; solution/gel and formula preference questions are skipped.', effectType='product-switched', affects=['p4', 'p5'], evidence='code', proof='quiz-definition-dut.json node-1790242142312 paths (behind the account wall)', confidence='high'),
 dict(id='R5', flow='oral-minoxidil', when='"In the last 2 weeks, have you had any thoughts of hurting yourself?" = "Yes"', then='"Safety Alert" screen with 988 and 911; the only ways on are to change the answer or end. Same node in all four forms.', effectType='hard-stop', affects=[], evidence='code', proof='quiz-definition-oral_min.json node-16 path "Yes - Self-harm risk" -> node-21 (not yet replayed)', confidence='high'),
 dict(id='R6', flow='oral-minoxidil', when='surgeries = "Yes"; medications = "Yes"; anything else = "Yes"', then='Each adds one free-text screen. Nothing else changes.', effectType='extra-questions', affects=[], evidence='code', proof='quiz-definition-oral_min.json node-10, node-12, node-18 paths', confidence='high'),
 dict(id='R7', flow='oral-minoxidil', when='any other answer (hair-loss pattern, scalp symptoms, sexual dysfunction, allergies including "Minoxidil", medical conditions including heart failure, low blood pressure or pheochromocytoma, mood questions)', then='No branch, no warning and no change to the cart inside the form. The decision is left to the provider who reviews the answers after checkout.', effectType='flag-for-clinician', affects=['p8'], evidence='code', proof='quiz-definition-oral_min.json: nodes 3 to 9, 14 and 15 have a single outgoing edge and no path conditions (worth confirming live in runs/)', confidence='medium'),
]

recommendations = [
 dict(profile='Man, 31-45, hair loss over 1 year, receding hairline and thinning on top, no scalp symptoms, no treatments, no conditions, no medicines (oral minoxidil form)',
      offered=['p8'], default='p8', note='Dose picker shows 2.5 mg ($65 for 90 days, pre-selected) and 1.25 mg ($55 for 90 days) before any medical question. The form never shows a recommendation screen; it reaches "Create account" at 75%.', evidence='observed'),
]

company = {
 'slug': 'strut', 'company': 'Strut Health', 'market': 'US', 'website': SITE + '/', 'parent': 'Partex.AI (the site logo reads "Strut, a Partex.AI Consumer Health Company")',
 'audiences': ['men', 'women'],
 'model': 'US cash-pay telehealth company (Dallas, Texas) selling compounded and generic prescription hair-loss medicines by subscription, with an online questionnaire reviewed afterwards by a licensed provider.',
 'checkedOn': '2026-11-23',
 'access': {
   'howTested': ['live-walk', 'site-code', 'public-docs'],
   'accountWall': 'Oral finasteride, topical finasteride and dutasteride forms: the first screen (e-mail + phone). Old checkout (women\'s formula, Hair Booster, ketoconazole, HairfectRx capsules, combos): the first screen. Oral minoxidil form: after 17 anonymous screens, at "Create account" (75% progress), before address, ID check and payment.',
   'blockers': ['The help centre (support.struthealth.com) returned HTTP 403 with a "Just a moment..." security checkpoint to curl and to the fetch tool; it was not read.',
                'Three of the four new forms and every old-checkout product ask for an e-mail and phone number on the first screen, so they could not be walked.'],
   'coverageNote': 'The full definition of the four new intake forms (every screen, option and branch condition, including everything behind the account wall, plus the product cards with prices) was read from the HTML the site serves to an anonymous browser; those items are labelled "code". Only the oral minoxidil form could be walked live (baseline man, 25 steps, to the account card); those items are labelled "observed". The questionnaires for the women\'s Strut Hair Formula, Hair Booster, ketoconazole shampoo, HairfectRx capsules and the combos are served only to signed-in users and were not seen. No one-change experiments were run in this stage.'},
 'products': products, 'flows': flows, 'rules': rules, 'experiments': [], 'recommendations': recommendations,
 'engineSummary': 'Strut does not run a recommendation engine. The patient chooses a product on the marketing site; each product has its own form that sells only that product (the dutasteride form lets you pick topical or oral, the topical finasteride form swaps to a women\'s product if you answer "Female"). The form is a fixed list of questions with three kinds of branch only: stop screens (under 18; female in the oral finasteride form; thoughts of self-harm), three optional free-text follow-ups, and product-card swaps. No medical answer changes the product, strength or price inside the form. All clinical decisions, including strength and which actives go into a compounded formula, are left to a provider who reviews the answers and photos after the patient has created an account, passed an ID check and saved a card.',
 'strengths': ['Very wide compounded range: topical finasteride or dutasteride with minoxidil 7.5%, tretinoin and fluocinolone; oral combination capsules; a latanoprost booster; a women\'s spironolactone and finasteride topical.',
               'The patient can state a formula preference (which actives to include) and gel or solution.',
               'Low entry price ($25 a month oral finasteride; $49 for 90 days) with visit and shipping included; card is saved, not charged, until a provider approves.',
               'Identity check (Persona) and hairline photos are built into the topical flows.'],
 'weaknesses': ['The account wall is the first screen for most products, so a visitor sees no questions and no personalised offer before giving an e-mail and phone number.',
                'The forms do almost no automatic screening: heart disease, low blood pressure or a minoxidil allergy do not change or stop the oral minoxidil form.',
                'The oral minoxidil form reuses the finasteride/dutasteride mental health warning and asks nothing about blood pressure, heart rate, pregnancy or sex.',
                'The women\'s branch of the topical finasteride form has no pregnancy, breastfeeding or contraception question in the served definition.',
                'Product facts are inconsistent across pages (tretinoin 0.0125% or 0.025%; oral minoxidil headline dose and price; dutasteride "0.1 mg to 0.6 mg" against a single 0.1 mg option in the form).'],
 'opportunities': ['Show a real recommendation before asking for contact details: Strut makes the patient choose the product first and never explains why one fits.',
                   'Automated safety screening with clear stop or warning screens (heart and blood pressure for oral minoxidil; pregnancy for women) would be a visible safety advantage.',
                   'A single guided consultation for women: Strut splits women across an old checkout product and a hidden branch of the men\'s topical form.'],
 'sources': [
   {'title': 'Hair loss collection (13 product cards)', 'url': SITE + '/hair-loss'},
   {'title': 'Oral finasteride', 'url': SITE + '/hair-loss/finasteride/oral'}, {'title': 'Topical finasteride (Hairfect Rx)', 'url': SITE + '/hair-loss/finasteride/topical'},
   {'title': 'Finasteride overview', 'url': SITE + '/hair-loss/finasteride'}, {'title': 'Dutasteride overview', 'url': SITE + '/hair-loss/dutasteride'},
   {'title': 'Oral dutasteride', 'url': SITE + '/hair-loss/dutasteride/oral'}, {'title': 'Topical dutasteride', 'url': SITE + '/hair-loss/dutasteride/topical'},
   {'title': 'HairfectRx capsules with finasteride', 'url': SITE + '/hair-loss/hairfectrx-finasteride'}, {'title': 'HairfectRx capsules with dutasteride', 'url': SITE + '/hair-loss/hairfectrx-dutasteride'},
   {'title': 'Oral minoxidil', 'url': SITE + '/hair-loss/oral-minoxidil'}, {'title': 'Strut Women\'s Hair Growth Formula', 'url': SITE + '/hair-loss/strut-hair-formula'},
   {'title': 'Strut Hair Booster', 'url': SITE + '/hair-loss/hair-booster'}, {'title': 'Ketoconazole 2% shampoo', 'url': SITE + '/hair-loss/ketoconazole-shampoo'},
   {'title': 'Hairfect Combo (finasteride tablets + StrutVite)', 'url': SITE + '/hair-loss/hairfect-combo'}, {'title': 'Hairfect Combo (finasteride gel + StrutVite)', 'url': SITE + '/hair-loss/hairfect-gel-combo'},
   {'title': 'Hairfect Combo (dutasteride + StrutVite)', 'url': SITE + '/hair-loss/dutasteride-hair-combo'}, {'title': 'StrutVite', 'url': SITE + '/skin/strutvite'},
   {'title': 'FAQ (shipping, visits, subscriptions)', 'url': SITE + '/faq'}, {'title': 'How it works', 'url': SITE + '/how-it-works'},
   {'title': 'Refund policy', 'url': SITE + '/refund-policy'}, {'title': 'Terms and conditions', 'url': SITE + '/terms-and-conditions'}, {'title': 'Telemedicine consent', 'url': SITE + '/telemedicine-consent'},
   {'title': 'Intake form: oral finasteride (definition in page HTML)', 'url': START + '6adb53275c3d5e719ab02595'}, {'title': 'Intake form: topical finasteride', 'url': START + '6adb546a5d885b6c0877d8e4'},
   {'title': 'Intake form: dutasteride', 'url': START + '6ad9e1d39fba7abfd231a5b3'}, {'title': 'Intake form: oral minoxidil', 'url': START + '6aa3d578f415d1603a6e0c85'},
   {'title': 'Old checkout (redirects to sign-up)', 'url': OLD + 'womens-hair-growth-rx-formula?priceId=226'},
   {'title': 'Help centre (blocked by a security checkpoint, not read)', 'url': 'https://support.struthealth.com/hc/en-us'},
   {'title': 'Third-party review used only as a cross-check of topical strengths (not relied on)', 'url': 'https://perfecthairhealth.com/strut-health-review/'}],
 'limitations': ['Only one of the forms (oral minoxidil) could be walked. Everything behind an account wall is from the served definition, which shows what the form does but not how it looks live or whether the server adds checks.',
                 'What the reviewing provider does with any answer (declines, changes strength, removes an active) is not visible anywhere public.',
                 'The questionnaires of the old-checkout products, including the main women\'s product, were not seen at all.',
                 'No one-change experiments were run in this stage; branch effects in the oral minoxidil form are from code and still need a live replay.',
                 'State availability by product is not published beyond "all states except Arkansas" and "certain medications may not be available in all states".',
                 'The help centre could not be read.'],
 'publicDocs': {
   'whoCanHaveIt': ['Finasteride and dutasteride pages: "Do not use if: You are a woman or a child. ... a medication for men only. Women who are or may become pregnant should never handle" it. (product pages, Safety Info tab)',
                    'Women\'s formula: "Do not use if you are pregnant, planning to become pregnant, or breastfeeding." (' + SITE + '/hair-loss/strut-hair-formula)',
                    'Hairfect gel combo page: "women can only use Finasteride in certain situations when approved by a healthcare provider" (' + SITE + '/hair-loss/hairfect-gel-combo)',
                    'Hair Booster: unisex; not in pregnancy or breastfeeding unless the provider agrees; tell the provider about glaucoma, eye conditions, asthma, heart conditions. (' + SITE + '/hair-loss/hair-booster)',
                    'Oral minoxidil: off-label; page carries the FDA boxed warning on heart risks; tell the provider about blood pressure, heart failure, angina, recent heart attack or stroke, kidney disease. (' + SITE + '/hair-loss/oral-minoxidil)'],
   'howReviewWorks': ['"A licensed medical provider will review your responses within 1 business day." (oral minoxidil form welcome screen, observed)',
                      '"A doctor from our team will review your order and we will email you once your prescription has been written. You should hear from us within 48 hours." (order-completed screen, code)',
                      'Evaluation "may take place through a combination of survey, secure messaging, phone, or video" depending on state. (' + SITE + '/faq)',
                      '"If after checking out, the healthcare provider identifies that you are not a good candidate for treatment, you will not be charged." A $40 provider fee applies if the prescription is transferred to another pharmacy. (product page FAQs)'],
   'subscription': ['Auto-refill subscriptions; cancel, pause or reschedule in the account at least 48 hours before processing; prescriptions cannot be returned. (' + SITE + '/faq)',
                    'Ships to all states except Arkansas (as of September 2024); no international shipping; HSA/FSA cards may be rejected; no insurance billing. (' + SITE + '/faq)']},
}
json.dump(company, open(os.path.join(HERE, 'company.json'), 'w'), indent=1, ensure_ascii=False)
print('written', sum(len(f['questions']) for f in flows), 'questions in', len(flows), 'flows;', len(products), 'products')
