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
NOBRANCH = 'No effect inside the form (read from the served definition): every option of this question goes to the same next screen, with no warning and no change to the product, strength or price. The answer is stored for the reviewing provider; what the provider does with it is not visible.'
def opt(label, effect=NOBRANCH, et='none', affects=None, ev='code'):
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

# docs-only entries for the hidden old-checkout questionnaires (wording NOT public; these record what Strut's own pages say the provider needs)
def docs_q(n, text, purpose, role='safety-screen'):
    return {'id': 'old-checkout-q%02d' % n, 'order': n, 'stage': 'after-account', 'text': text, 'type': 'info', 'options': [], 'purpose': purpose, 'engineRole': role,
            'branches': False, 'branchDetail': 'Not visible. The questions load only for a signed-in visit, so whether any answer branches or stops is unknown.', 'shownWhen': 'unknown (behind the account wall)', 'evidence': 'docs'}
flows[-1]['questions'] += [
 docs_q(2, '[Question wording not public] Women\'s Hair Growth Formula: the product page tells patients to "Share any history of scalp conditions, sensitivities to topical medications, current prescriptions, pregnancy or breastfeeding status, and any history of low blood pressure or fainting." It also says: "Do not use if you are pregnant, planning to become pregnant, or breastfeeding." (' + SITE + '/hair-loss/strut-hair-formula)',
        'Shows what the hidden women\'s questionnaire has to cover for the provider: scalp disease, topical sensitivities, current medicines, pregnancy or breastfeeding, low blood pressure or fainting. Whether each is a question, and whether "pregnant" stops the form, is not visible.'),
 docs_q(3, '[Question wording not public] HairfectRx capsules (finasteride or dutasteride + oral minoxidil 5 mg): the product page tells patients to "Share any history of liver disease, prostate conditions, low blood pressure, heart conditions, current prescriptions, and any plans for blood donation while on finasteride." (' + SITE + '/hair-loss/hairfectrx-finasteride)',
        'Shows the topics the provider needs for the combination capsule: liver, prostate, blood pressure, heart, medicines, blood donation. The questionnaire itself was not seen.'),
 docs_q(4, '[Question wording not public] Strut Hair Booster (latanoprost): "Strut Hair Booster should not be used if you are pregnant or breastfeeding unless your healthcare provider decides the benefit outweighs the risk." and "Your provider will decide which strength is appropriate for you." (' + SITE + '/hair-loss/hair-booster)',
        'Pregnancy and breastfeeding matter for this product, and the strength (0.03% or 0.1%) is the provider\'s choice, not the patient\'s. The questionnaire itself was not seen.', 'product-selector'),
 docs_q(5, '[Question wording not public] All old-checkout products: "If after checking out, the healthcare provider identifies that you are not a good candidate for treatment, you will not be charged." (product page FAQs)',
        'Confirms the model: the decision is made by a provider after checkout, not by the form.', 'expectation-setting'),
]
flows[-1]['stagesSummary'] += ' Entries q02 to q05 are not questions seen on screen: they quote what Strut\'s public pages say the provider needs to know (evidence "docs").'

# ================================================================= STAGE 2 (EXPERIMENT), 23 Nov 2026 =================================================================
# Live one-change replays were possible only on the oral minoxidil form. Results are written onto its options here.
B = 'runs/baseline-us'
MIN = next(f for f in flows if f['id'] == 'oral-minoxidil')
def Q(prefix): return next(q for q in MIN['questions'] if q['text'].startswith(prefix))
def O(q, label): return next(o for o in q['options'] if o['label'].startswith(label))
SAME = 'No change when replayed: the same later screens with the same wording, the same cart line (2.5 mg, 90 days, $65.00), no warning, and the walk ends at "Create account" as in the baseline'
def one(q, label, run, extra=''):
    O(q, label).update(effect='%s (runs/%s against %s). %sThe answer is only stored for the reviewing provider.' % (SAME, run, B, extra), effectType='none', evidence='observed')
def base(q, label, extra=''):
    O(q, label).update(effect=('Baseline answer: the form simply moves to the next screen (%s). %s' % (B, extra)).strip(), evidence='observed')
def combo(q, label):
    O(q, label).update(effect='No change seen, but it was only ticked together with other high-risk answers in runs/exp-26-worst-case (not a one-change test). That run had the same screens, wording and cart as the baseline, and the served definition has no branch on this option.', effectType='none', evidence='observed')
def rest(q, note='Not replayed on its own.'):
    for o in q['options']:
        if o['evidence'] == 'code' and o['effectType'] in ('none', 'next-question'):
            o['effect'] = note + ' ' + o['effect']; o['effectType'] = 'none'

q = Q('What is your age?')
O(q, 'Under 18').update(effect='Stop screen "Age Verification": "These medications are only available for patients 18 and older. If you selected the wrong answer, you can go back and update it." The dose picker is never shown and nothing is put in the cart. The only choices are "Go back and update my answer" or "End questionnaire" (runs/exp-01-age-under18).', effectType='hard-stop', affects=['p8'], evidence='observed')
one(q, '18-30', 'exp-02-age-18-30'); base(q, '31-45'); one(q, '61+', 'exp-03-age-61plus')
O(q, '46-60').update(effect='Not replayed. The served definition sends every answer other than "Under 18" down the same path, and the bands either side of it (31-45 and 61+) were replayed with no change.', effectType='none')
q.update(branchDetail='"Under 18" goes to the Age Verification stop screen (observed, runs/exp-01-age-under18). 18-30, 31-45 and 61+ all continue with identical screens and cart (observed). There is no upper age limit and no extra question for older patients.', purpose='Screens out under-18s. Nothing else is done with the age band inside the form; the exact date of birth is only asked later on the account card.')
q = Q('Age Verification')
q.update(evidence='observed', branchDetail='Seen live in runs/exp-01-age-under18 and runs/exp-25-age-under18-end.')
O(q, 'Go back').update(effect='Returns to the age question so the answer can be changed (read from the definition; the identical control on the Safety Alert screen was seen working in runs/exp-05-selfharm-yes).')
O(q, 'End questionnaire').update(effect='Ends the visit. The redirect is broken: the browser lands on https://start.struthealth.com/flow/www.struthealth.co, a form-builder error page that says "Oops, you seem lost. The flow you\'re looking for doesn\'t exist or is not published." (runs/exp-25-age-under18-end). The definition\'s redirect address is "www.struthealth.co" with no "https://" and no "m".', evidence='observed')
q = Q('Minoxidil Tablets.')
base(q, '2.5 mg', 'Pre-selected. Cart line: "90 Day Supply - 2.5 mg", total $65.00 (price ID 797 in code).')
O(q, '1.25 mg').update(effect='Cart line becomes "90 Day Supply - 2.5 mg (1.25mg)" and the total drops from $65.00 to $55.00 (price ID 798 in code). Every later screen is identical and the walk ends at "Create account" (runs/exp-04-dose-1-25 against %s). The patient, not the form, picks the dose.' % B, effectType='strength-changed', affects=['p8'], evidence='observed')
q.update(branches=False, branchDetail='The choice only sets the cart line and price (observed). It does not change any question. The dose is chosen before a single medical question has been asked.')
q = Q('How long ago'); base(q, 'Over 1 year'); combo(q, '1 month or less'); rest(q)
q = Q('What symptoms of hair loss'); base(q, 'Receding hairline'); base(q, 'Thinning on the top of the head')
one(q, 'Patchy bald spots', 'exp-14-symptom-patchy', 'Ticked on its own in place of the two baseline answers. Patchy loss usually points away from pattern hair loss, yet the form shows no warning. '); rest(q)
q = Q('Have you noticed any scalp symptoms'); base(q, 'None of the above'); one(q, 'Sudden hair loss', 'exp-13-scalp-sudden', 'Sudden loss is a classic reason to look for another cause, yet the form shows no warning. '); combo(q, 'Bleeding'); rest(q)
q = Q('What treatments have you tried'); base(q, 'None of the above'); rest(q)
q = Q('Do you have any issues with sexual dysfunction'); base(q, 'No'); combo(q, 'Yes')
q.update(purpose='Baseline sexual function before a 5-alpha-reductase inhibitor. The question is shared by all four forms; it is not relevant to oral minoxidil but is asked anyway.')
q = Q('Are you allergic'); base(q, 'None of the above'); one(q, 'Minoxidil', 'exp-12-allergy-minoxidil', 'An allergy to the very medicine in the cart does not stop the form or show a warning. '); rest(q)
q = Q('Do you have any of the following medical conditions'); base(q, 'None of the above')
one(q, 'Heart failure or heart disease', 'exp-09-cond-heart-failure', 'Strut\'s own product page carries the boxed warning about heart risks, but the form does not react. ')
one(q, 'Low blood pressure', 'exp-10-cond-low-bp'); one(q, 'Pheochromocytoma', 'exp-11-cond-pheo', 'This is a labelled contraindication for minoxidil tablets, but the form does not react. ')
one(q, 'Other', 'exp-24-cond-other', 'The "Other" tile turns into a one-line text box; it was left empty and "Continue" still worked. ')
for l in ('Heart attack or coronary artery disease', 'Stroke', 'Kidney disease'): combo(q, l)
rest(q)
q.update(branchDetail='None. Heart failure, low blood pressure and pheochromocytoma were each replayed on their own, and six heart, blood pressure and kidney conditions together: no stop, no warning, no extra question, same cart (observed).')
q = Q('Have you had any surgeries?'); base(q, 'No', 'Skips the surgical history screen.')
O(q, 'Yes').update(effect='Adds one free-text screen, "Please describe your surgical history:". Nothing else changes: same later screens, same cart, ends at "Create account" (runs/exp-06-surgery-yes).', evidence='observed')
q = Q('Are you currently taking any medications'); base(q, 'No', 'Skips the medicines list screen.')
O(q, 'Yes').update(effect='Adds one free-text screen, "Please list all current medications, vitamins, and supplements with dosages:". Nothing else changes (runs/exp-07-meds-yes). There is no tick list of interacting medicines (for example blood pressure tablets).', evidence='observed')
q = Q('Do you have concerns about your mood'); base(q, 'No'); one(q, 'Yes', 'exp-16-mood-yes', 'The mental health warning screen that follows is shown to everyone, whatever the answer. ')
q = Q('In the last 2 weeks, have you lost interest'); base(q, 'No'); combo(q, 'Yes')
q = Q('In the last 2 weeks, have you had any thoughts of hurting yourself?'); base(q, 'No', 'Goes on to the mental health warning screen.')
O(q, 'Yes').update(effect='"Safety Alert" screen: "Your safety is our top priority. If you are having thoughts of hurting yourself, please contact the 988 Suicide and Crisis Lifeline by calling or texting 988, or call 911. A physician will still review your questionnaire. You may go back and update your answer, or end the questionnaire." The only ways on are to change the answer or end, so the visit cannot reach the account card with "Yes" (runs/exp-05-selfharm-yes).', evidence='observed')
q = Q('Safety Alert'); q.update(evidence='observed', branchDetail='Seen live in runs/exp-05-selfharm-yes.')
O(q, 'Go back').update(effect='Returns to the self-harm question with "Yes" still ticked, so the patient can change it to "No" and carry on (runs/exp-05-selfharm-yes).', evidence='observed')
O(q, 'End questionnaire').update(effect='Not replayed here. It leads to the same ending as "End questionnaire" on the Age Verification screen, which was seen to land on a broken "Oops, you seem lost" page (runs/exp-25-age-under18-end).')
q = Q('Important Mental Health Warning'); q.update(purpose='Warns that finasteride and dutasteride may worsen depression or anxiety. Shown to every patient whatever they answered, and shown unchanged in the oral minoxidil form although that form sells neither medicine (observed in the baseline and in runs/exp-16-mood-yes).')
q = Q('Is there anything else'); base(q, 'No', 'Goes straight to the account card.')
O(q, 'Yes').update(effect='Adds one free-text screen, "Please share any additional information for your doctor." Nothing else changes (runs/exp-08-else-yes).', evidence='observed')
for prefix, run in (('Please describe your surgical history', 'exp-06-surgery-yes'), ('Please list all current medications', 'exp-07-meds-yes'), ('Please share any additional information', 'exp-08-else-yes')):
    Q(prefix).update(evidence='observed', branchDetail='Seen live in runs/%s (a short fictional medical note was typed; no contact details).' % run)
q = Q('End of questionnaire'); q.update(evidence='observed', text='End of questionnaire: the definition redirects to "www.struthealth.co"; live, the browser lands on https://start.struthealth.com/flow/www.struthealth.co, which shows "Oops, you seem lost. The flow you\'re looking for doesn\'t exist or is not published."',
    purpose='Exit after a stop screen. The redirect address is mistyped, so the patient ends on an error page with no help or link (runs/exp-25-age-under18-end).')
for f in flows:
    if f['id'] == 'oral-minoxidil': continue
    for qq in f['questions']:
        for o in qq['options']:
            if o['effect'].startswith('No effect inside the form'):
                o['effect'] += ' Behind the account wall, so not replayed; the same shared question was replayed in the oral minoxidil form, where no option changed anything.'
MIN['stagesSummary'] += ' Stage 2: 18 one-change replays confirmed three kinds of branch only (under-18 stop, self-harm stop, three free-text follow-ups) plus the dose picker changing the price; no medical answer changed anything.'

# ---------------------------------------------------------------- experiments
def X(i, changed, result, flow='oral-minoxidil'): return {'id': i, 'flow': flow, 'changed': changed, 'result': result, 'run': 'runs/' + i}
NOCH = 'No change: same 18 screens and wording, cart "90 Day Supply - 2.5 mg, $65.00", ends at "Create account" (75%).'
experiments = [
 X('baseline-us', 'none (baseline man replayed with locale en-US, time zone America/Chicago)', 'Identical to the stage 1 baseline: welcome, age, dose picker, 13 questions, warning screen, then "Create account" at 75%. Cart: 2.5 mg, 90 days, $65.00.'),
 X('exp-01-age-under18', 'age: 31-45 -> Under 18', 'Stop screen "Age Verification" straight after the age question. No dose picker, no cart. Choices: go back or end.'),
 X('exp-25-age-under18-end', 'age: Under 18, then "End questionnaire" on the stop screen', 'Browser sent to https://start.struthealth.com/flow/www.struthealth.co: an error page "Oops, you seem lost. The flow you\'re looking for doesn\'t exist or is not published." The exit redirect is broken.'),
 X('exp-02-age-18-30', 'age: 31-45 -> 18-30', NOCH),
 X('exp-03-age-61plus', 'age: 31-45 -> 61+', NOCH),
 X('exp-04-dose-1-25', 'dose: 2.5 mg (pre-selected) -> 1.25 mg', 'Cart line changes to "90 Day Supply - 2.5 mg (1.25mg)", total $55.00 instead of $65.00. Questions, wording and end screen identical.'),
 X('exp-05-selfharm-yes', 'thoughts of hurting yourself: No -> Yes', '"Safety Alert" screen (988 and 911) replaces the rest of the form. "Go back and update my answer" returns to the question with "Yes" still ticked. The warning screen, the catch-all question and the account card are not reached.'),
 X('exp-06-surgery-yes', 'surgeries: No -> Yes (new free-text screen answered with a short fictional note)', 'One extra screen, "Please describe your surgical history:". Everything else the same; progress bar shows 76% instead of 75% at the account card.'),
 X('exp-07-meds-yes', 'medicines, vitamins or supplements: No -> Yes (new free-text screen answered with "Vitamin D")', 'One extra screen, "Please list all current medications, vitamins, and supplements with dosages:". Everything else the same.'),
 X('exp-08-else-yes', 'anything else for the doctor: No -> Yes (new free-text screen answered neutrally)', 'One extra screen, "Please share any additional information for your doctor." Then the account card as usual.'),
 X('exp-09-cond-heart-failure', 'medical conditions: None of the above -> Heart failure or heart disease', NOCH + ' No warning about oral minoxidil and the heart.'),
 X('exp-10-cond-low-bp', 'medical conditions: None of the above -> Low blood pressure', NOCH),
 X('exp-11-cond-pheo', 'medical conditions: None of the above -> Pheochromocytoma', NOCH),
 X('exp-24-cond-other', 'medical conditions: None of the above -> Other (text box left empty)', 'The "Other" tile becomes a one-line text box. Left empty, "Continue" still works. ' + NOCH),
 X('exp-12-allergy-minoxidil', 'allergies: None of the above -> Minoxidil', NOCH + ' The form keeps selling minoxidil tablets to a patient who says they are allergic to minoxidil.'),
 X('exp-13-scalp-sudden', 'scalp symptoms: None of the above -> Sudden hair loss', NOCH),
 X('exp-14-symptom-patchy', 'hair-loss symptoms: Receding hairline + Thinning on the top of the head -> Patchy bald spots only', NOCH),
 X('exp-16-mood-yes', 'concerns about mood, depression, anxiety: No -> Yes', NOCH + ' The mental health warning screen is the same one everybody sees.'),
 X('exp-26-worst-case', 'NOT a one-change run. All at once: age 61+, noticed 1 month or less, patchy bald spots, scalp sudden hair loss + bleeding, sexual dysfunction Yes, allergy Minoxidil, conditions heart failure + heart attack + stroke + low blood pressure + pheochromocytoma + kidney disease, mood Yes, lost interest Yes', NOCH + ' So there is no hidden score or cumulative rule: the highest-risk patient the form can describe reaches the account card with oral minoxidil 2.5 mg in the cart.'),
]

# ---------------------------------------------------------------- rules
def R(i, flow, when, then, et, affects, ev, proof, conf): return dict(id=i, flow=flow, when=when, then=then, effectType=et, affects=affects, evidence=ev, proof=proof, confidence=conf)
DEF = 'quiz-definition-%s.json'
rules = [
 R('R1', 'oral-minoxidil', 'age = "Under 18"', 'Stop screen "Age Verification" (18 and older only). No product is shown. The same node sits in all four forms.', 'hard-stop', ['p8', 'p1', 'p2', 'p3', 'p4', 'p5'], 'observed', 'runs/exp-01-age-under18 against runs/baseline-us; ' + DEF % 'oral_min' + ' node-1 path "Under 18" -> node-20', 'high'),
 R('R2', 'oral-minoxidil', 'age = 18-30, 31-45, 46-60 or 61+', 'Continues with identical screens and cart. No upper age limit, no extra question for older patients.', 'none', ['p8'], 'observed', 'runs/exp-02-age-18-30 and runs/exp-03-age-61plus against runs/baseline-us (46-60 from code only)', 'high'),
 R('R3', 'oral-minoxidil', 'dose picker = "1.25 mg" instead of the pre-selected "2.5 mg"', 'Price changes from $65 to $55 for 90 days and the cart line reads "2.5 mg (1.25mg)". No question changes. The patient picks the dose before any medical question.', 'strength-changed', ['p8'], 'observed', 'runs/exp-04-dose-1-25 against runs/baseline-us', 'high'),
 R('R4', 'oral-minoxidil', '"In the last 2 weeks, have you had any thoughts of hurting yourself?" = "Yes"', '"Safety Alert" screen with the 988 lifeline and 911. The only ways on are to change the answer or end, so the form cannot be completed with "Yes". The same node sits in all four forms.', 'hard-stop', ['p8', 'p1', 'p2', 'p3', 'p4', 'p5'], 'observed', 'runs/exp-05-selfharm-yes against runs/baseline-us; ' + DEF % 'oral_min' + ' node-16 -> node-21', 'high'),
 R('R5', 'oral-minoxidil', 'surgeries = "Yes"', 'One extra free-text screen ("Please describe your surgical history:"). Nothing else changes.', 'extra-questions', [], 'observed', 'runs/exp-06-surgery-yes against runs/baseline-us', 'high'),
 R('R6', 'oral-minoxidil', 'medications, vitamins or supplements = "Yes"', 'One extra free-text screen (list them with dosages). Nothing else changes.', 'extra-questions', [], 'observed', 'runs/exp-07-meds-yes against runs/baseline-us', 'high'),
 R('R7', 'oral-minoxidil', '"Is there anything else you want your doctor to know" = "Yes"', 'One extra free-text screen. Nothing else changes.', 'extra-questions', [], 'observed', 'runs/exp-08-else-yes against runs/baseline-us', 'high'),
 R('R8', 'oral-minoxidil', 'medical conditions = heart failure or heart disease, low blood pressure, pheochromocytoma or "Other" (each on its own)', 'Nothing: no stop, no warning, no extra question, oral minoxidil 2.5 mg stays in the cart. The answer is left for the provider.', 'none', ['p8'], 'observed', 'runs/exp-09-cond-heart-failure, runs/exp-10-cond-low-bp, runs/exp-11-cond-pheo, runs/exp-24-cond-other against runs/baseline-us', 'high'),
 R('R9', 'oral-minoxidil', 'allergy = "Minoxidil"', 'Nothing: the form keeps oral minoxidil in the cart and shows no warning.', 'none', ['p8'], 'observed', 'runs/exp-12-allergy-minoxidil against runs/baseline-us', 'high'),
 R('R10', 'oral-minoxidil', 'hair-loss symptoms = "Patchy bald spots" only, or scalp symptoms = "Sudden hair loss"', 'Nothing: no warning that this may not be pattern hair loss, no referral, no extra question, no photo request.', 'none', ['p8'], 'observed', 'runs/exp-14-symptom-patchy and runs/exp-13-scalp-sudden against runs/baseline-us', 'high'),
 R('R11', 'oral-minoxidil', 'mood concerns = "Yes"', 'Nothing. The "Important Mental Health Warning" (about finasteride and dutasteride) is shown to every patient whatever they answer.', 'none', [], 'observed', 'runs/exp-16-mood-yes against runs/baseline-us', 'high'),
 R('R12', 'oral-minoxidil', 'every high-risk answer at once (age 61+, 1 month, patchy, sudden loss, bleeding scalp, minoxidil allergy, six heart, blood pressure and kidney conditions, sexual dysfunction, mood Yes twice)', 'Still nothing: same screens, same cart, account card reached. There is no scoring and no cumulative rule (the definition\'s "scoring" field is empty).', 'none', ['p8'], 'observed', 'runs/exp-26-worst-case against runs/baseline-us; ' + DEF % 'oral_min' + ' scoring = null', 'high'),
 R('R13', 'oral-minoxidil', '"End questionnaire" on a stop screen', 'The exit redirect is broken: the patient lands on an error page ("Oops, you seem lost").', 'hard-stop', [], 'observed', 'runs/exp-25-age-under18-end; ' + DEF % 'oral_min' + ' node-23 redirect url "www.struthealth.co"', 'high'),
 R('R14', 'oral-minoxidil', 'any option not replayed on its own (duration, other hair-loss symptoms, other scalp symptoms, treatments tried, other allergies, other conditions, sexual dysfunction, lost interest)', 'No effect inside the form: each of these screens has one way out and no condition on it.', 'none', ['p8'], 'code', DEF % 'oral_min' + ': nodes 3 to 9, 14 and 15 have a single outgoing edge and no path conditions; consistent with every live replay', 'high'),
 R('R15', 'men-finasteride-oral', 'sex at birth = "Female"', 'Stop screen "Available for Male Patients Only". Go back or end. Oral finasteride is never offered to women.', 'hard-stop', ['p1'], 'code', DEF % 'fin_oral' + ' node-2 path "Female" -> node-1789033271452 (behind the account wall, cannot be replayed)', 'high'),
 R('R16', 'finasteride-topical', 'sex at birth = "Female"', 'The women\'s topical finasteride card replaces the men\'s card (price IDs 612/598 instead of 311/384, same $59 / $79). All later questions are the same as for men: there is no pregnancy, breastfeeding or contraception question anywhere in the form.', 'product-switched', ['p2', 'p3'], 'code', DEF % 'fin_topical' + ' node-2 path "Female" -> "finasteride women : Dose selection" -> node-3 (behind the account wall)', 'high'),
 R('R17', 'dutasteride', '"Which form of dutasteride are you looking to use?" = "Oral Custom Capsule"', 'Oral capsule card (0.1 mg, $39) instead of the topical card ($69 / $99); the solution-or-gel and formula preference questions are skipped.', 'product-switched', ['p4', 'p5'], 'code', DEF % 'dut' + ' node-1790242142312 paths (behind the account wall)', 'high'),
 R('R18', 'finasteride-topical', 'formula preference chosen (finasteride 0.25% with or without tretinoin 0.0125% and minoxidil 7.5%, or "no preference"); solution or gel chosen', 'Recorded as a preference only. No branch and no price change; "so your physician can review the selection with your medical history". The dutasteride form does the same with its own list.', 'flag-for-clinician', ['p2', 'p3', 'p5'], 'code', DEF % 'fin_topical' + ' and ' + DEF % 'dut' + ': the preference nodes have one outgoing edge (behind the account wall)', 'medium'),
 R('R19', 'finasteride-topical', 'fewer than two hairline photos added', 'The continue button stays disabled: front and back hairline photos are required in the topical finasteride and dutasteride forms. The oral finasteride and oral minoxidil forms ask for no photos.', 'hard-stop', ['p2', 'p3', 'p4', 'p5'], 'code', 'components/ "Hairloss photo input" (disabled={!allComplete}); present in ' + DEF % 'fin_topical' + ' and ' + DEF % 'dut' + ' only', 'medium'),
 R('R20', 'men-finasteride-oral', 'any medical answer in the oral finasteride, topical finasteride or dutasteride forms (conditions, allergies, scalp symptoms, sexual dysfunction, mood)', 'No branch in the definition: nothing is removed, switched or warned about inside the form. The shared questions behaved exactly this way when replayed in the oral minoxidil form.', 'none', ['p1', 'p2', 'p3', 'p4', 'p5'], 'code', DEF % 'fin_oral' + ', ' + DEF % 'fin_topical' + ', ' + DEF % 'dut' + ' (single outgoing edges); live behaviour of the same questions in runs/exp-09 to runs/exp-16', 'medium'),
 R('R21', 'oral-minoxidil', 'identity check (Persona) fails; card is declined', 'Failed ID check -> photo ID and selfie upload instead; declined card -> back to the payment screen. Neither changes the product.', 'extra-questions', [], 'code', DEF % 'oral_min' + ' and sister definitions: "Strut ID Verification" route = "selfie"; node "Strut Finalize" path "Card declined" (after the account wall, not tested)', 'medium'),
 R('R22', 'old-checkout', 'after checkout, the provider judges the patient "not a good candidate"', 'The order is declined and the card is not charged. The provider can also change strengths and ingredients of compounded formulas, and picks the Hair Booster strength.', 'flag-for-clinician', ['p2', 'p5', 'p9', 'p10'], 'docs', SITE + '/hair-loss/hair-booster and ' + SITE + '/hair-loss/strut-hair-formula (FAQ text saved in text/)', 'medium'),
 R('R23', 'old-checkout', 'woman who is pregnant, planning pregnancy or breastfeeding (women\'s formula, Hair Booster)', 'Strut\'s pages say do not use. How the hidden questionnaire handles it (stop screen or provider decision) could not be seen.', 'unknown', ['p9', 'p10'], 'docs', SITE + '/hair-loss/strut-hair-formula ("Do not use if you are pregnant, planning to become pregnant, or breastfeeding")', 'low'),
]

# ---------------------------------------------------------------- recommendations
recommendations = [
 dict(profile='Baseline man: 31-45, hair loss over 1 year, receding hairline and thinning on top, no scalp symptoms, no treatments, no conditions, no medicines (oral minoxidil form)',
      offered=['p8'], default='p8', note='There is no recommendation screen. The dose picker comes straight after the age question: 2.5 mg ($65 for 90 days) is pre-selected, 1.25 mg ($55) is the other choice. The walk ends at "Create account" (75%) with 2.5 mg in the cart. Proof: runs/baseline-us.', evidence='observed'),
 dict(profile='Same man who taps "1.25 mg" on the dose picker', offered=['p8'], default='p8', note='Cart: "90 Day Supply - 2.5 mg (1.25mg)", $55.00. Questions identical. Proof: runs/exp-04-dose-1-25.', evidence='observed'),
 dict(profile='Anyone answering "Under 18"', offered=[], default=None, note='Stop screen "Age Verification"; no product is shown. Proof: runs/exp-01-age-under18.', evidence='observed'),
 dict(profile='Baseline man who answers "Yes" to thoughts of hurting himself', offered=[], default=None, note='"Safety Alert" screen (988, 911). He can only change the answer or end; the item stays in the cart but the account card cannot be reached with "Yes". Proof: runs/exp-05-selfharm-yes.', evidence='observed'),
 dict(profile='High-risk man: heart failure, heart attack, stroke, low blood pressure, pheochromocytoma, kidney disease, minoxidil allergy, sudden patchy loss, 61+', offered=['p8'], default='p8',
      note='Exactly the same offer as the baseline man: oral minoxidil 2.5 mg, $65, up to the account card. Any refusal can only come from the provider after sign-up, ID check and card. Proof: runs/exp-26-worst-case, plus one-change runs exp-09 to exp-14.', evidence='observed'),
 dict(profile='Man who starts from the oral finasteride page', offered=['p1'], default='p1', note='Finasteride 1 mg: 30 days $25 (default) or 90 days $49. Behind the account wall; read from the served definition.', evidence='code'),
 dict(profile='Man who starts from the topical finasteride page', offered=['p2'], default='p2', note='Hairfect Rx topical finasteride: 30 ml once daily $59 (default) or 60 ml twice daily $79; he states gel or solution and a formula preference (with or without minoxidil 7.5% and tretinoin). Behind the account wall; from the definition.', evidence='code'),
 dict(profile='Man who starts from the dutasteride page', offered=['p5', 'p4'], default='p5', note='He chooses topical (default path: 30 ml $69 or 60 ml $99, then gel or solution and formula preference) or oral 0.1 mg capsules ($39). Behind the account wall; from the definition.', evidence='code'),
 dict(profile='Woman who answers "Female" in the topical finasteride form', offered=['p3'], default='p3', note='Women\'s topical finasteride card, $59 or $79. No pregnancy question follows. Behind the account wall; from the definition. The baseline woman could not be walked on any route.', evidence='code'),
 dict(profile='Woman who answers "Female" in the oral finasteride form', offered=[], default=None, note='Stop screen "Available for Male Patients Only". From the definition.', evidence='code'),
 dict(profile='Baseline woman, 38, who starts from the women\'s product page', offered=['p9'], default='p9', note='The page sells one product, the Strut Women\'s Hair Growth Formula ($59 a month); the provider sets the actives. The questionnaire is behind the old checkout\'s first-screen account wall and was not seen.', evidence='docs'),
]

# ---------------------------------------------------------------- product recommendedWhen (stage 2 wording)
P = {p['id']: p for p in products}
P['p8']['recommendedWhen'] = ('Offered to every adult who opens the oral minoxidil form: the dose picker (2.5 mg pre-selected, or 1.25 mg) is the second screen, before any medical question. '
    'In 18 replays nothing removed it or changed its dose: not heart failure, low blood pressure, pheochromocytoma, a minoxidil allergy, patchy or sudden hair loss, or age 61+ (observed). Only "Under 18" and self-harm "Yes" stop the form. The provider decides after checkout.')
P['p1']['recommendedWhen'] = 'Offered to every adult who opens the oral finasteride form and answers "Male" (30-day supply pre-selected). "Female" and "Under 18" are stopped. No medical answer changes it inside the form (code; behind the account wall). The provider decides after checkout.'
P['p2']['recommendedWhen'] = 'Offered to every adult who opens the topical finasteride form and answers "Male" (30 ml pre-selected). The patient states gel or solution and which actives they would like; the provider makes the final formula (code; behind the account wall).'
P['p4']['recommendedWhen'] = 'Shown in the dutasteride form when the patient picks "Oral Custom Capsule" (one option, 0.1 mg, $39). No sex question and no medical branch in that form (code; behind the account wall).'
P['p5']['recommendedWhen'] = 'Default path of the dutasteride form ("Custom Topical Formula"): 30 ml pre-selected; the patient states gel or solution and a formula preference; the provider makes the final formula (code; behind the account wall).'
for i in ('p6', 'p7', 'p11', 'p12', 'p13', 'p14'):
    P[i]['recommendedWhen'] = 'Never recommended by a form: the patient picks it on its own product page. Its questionnaire is behind the old checkout\'s account wall and was not seen; Strut says a provider reviews the answers and declines without charge if the patient is "not a good candidate" (docs).'
P['p9']['recommendedWhen'] = 'Never recommended by a form: a woman picks it on its product page. Strut says a provider sets the actives and strengths and that it must not be used in pregnancy, when planning pregnancy or when breastfeeding (docs). Its questionnaire is behind the account wall and was not seen.'
P['p10']['recommendedWhen'] = 'Never recommended by a form: picked on its product page, sold as an add-on for men and women. "Your provider will decide which strength is appropriate" (0.03% or 0.1%). Not in pregnancy or breastfeeding unless the provider agrees (docs). Questionnaire not seen.'

company = {
 'slug': 'strut', 'company': 'Strut Health', 'market': 'US', 'website': SITE + '/', 'parent': 'Partex.AI (the site logo reads "Strut, a Partex.AI Consumer Health Company")',
 'audiences': ['men', 'women'],
 'model': 'US cash-pay telehealth company (Dallas, Texas) selling compounded and generic prescription hair-loss medicines by subscription, with an online questionnaire reviewed afterwards by a licensed provider.',
 'checkedOn': '2026-11-23',
 'access': {
   'howTested': ['live-walk', 'site-code', 'public-docs'],
   'accountWall': 'Oral finasteride, topical finasteride and dutasteride forms: the first screen (e-mail + phone). Old checkout (women\'s formula, Hair Booster, ketoconazole, HairfectRx capsules, combos): the first screen. Oral minoxidil form: after 17 anonymous screens, at "Create account" (75% progress), before address, ID check and payment.',
   'blockers': ['The help centre (support.struthealth.com) returned HTTP 403 with a "Just a moment..." security checkpoint to curl and to the fetch tool; it was not read.',
                'Three of the four new forms and every old-checkout product ask for an e-mail and phone number on the first screen, so they could not be walked or tested.',
                'Web search was not available in stage 2 (the shared search allowance was used up), so no third-party accounts of the hidden questionnaires or of provider decisions could be looked for.'],
   'coverageNote': 'Stage 1 read the full definition of the four new intake forms (every screen, option and branch condition, including everything behind the account wall, and the product cards with prices) from the HTML served to an anonymous browser: those items are labelled "code". Stage 2 replayed the one walkable form, oral minoxidil, 19 times (1 baseline, 17 one-change runs, 1 combined worst-case run): those items are labelled "observed" and name their run folder. Six rules read from code were confirmed live exactly as coded (under-18 stop, self-harm stop, three free-text follow-ups, dose picker price). 37 options of that form were not replayed on their own because the definition shows no branch on them; they keep the label "code". The oral finasteride, topical finasteride and dutasteride forms cannot be tested without an account. The questionnaires for the women\'s Strut Hair Formula, Hair Booster, ketoconazole shampoo, HairfectRx capsules and the combos are served only to signed-in users and were not seen; a few entries quote what Strut\'s public pages say the provider needs ("docs").'},
 'products': products, 'flows': flows, 'rules': rules, 'experiments': experiments, 'recommendations': recommendations,
 'engineSummary': 'Strut has no recommendation engine. The patient chooses a product on the marketing site, and each product has its own form that sells only that product. The form is an order form with a medical questionnaire attached: in the one form that can be walked without an account (oral minoxidil) the dose and price are chosen on the second screen, before any medical question. Live testing found only three kinds of reaction: "Under 18" stops the form, "Yes" to thoughts of self-harm shows a crisis screen that cannot be passed, and "Yes" to surgeries, medicines or "anything else" adds one free-text box each. Nothing else does anything. Heart failure, low blood pressure, pheochromocytoma, an allergy to minoxidil, patchy or sudden hair loss and age 61+ were each tried, then all together: same screens, same wording, same $65 cart, no warning. The served code shows the same design in the three forms behind the account wall, with two extra switches: "Female" is stopped in the oral finasteride form and swapped to a women\'s product in the topical finasteride form, and the dutasteride form lets the patient pick topical or oral. There is no scoring. Every clinical decision (approve, decline, strength, which actives go into a compounded formula) is made by a provider after the patient has created an account, passed an ID check and saved a card; Strut says patients who are "not a good candidate" are not charged.',
 'strengths': ['Very wide compounded range: topical finasteride or dutasteride with minoxidil 7.5%, tretinoin and fluocinolone; oral combination capsules (finasteride or dutasteride with oral minoxidil 5 mg); a latanoprost booster; a women\'s spironolactone and finasteride topical.',
               'The patient can ask for a formula (which actives to include) and for gel or solution, so the product feels made to order.',
               'Low entry prices with the visit and shipping included: oral finasteride $25 a month or $49 for 90 days; oral minoxidil $55 or $65 for 90 days. The card is saved, not charged, until a provider approves.',
               'Short, fast form: about 17 taps from welcome to the account card for oral minoxidil, one question a screen, cart always visible, single answers move on by themselves.',
               'A real self-harm safety net: "Yes" shows the 988 lifeline and 911 and cannot be clicked past.',
               'Identity check (Persona) on every order and two hairline photos on the topical forms give the provider something to review.'],
 'weaknesses': ['No guidance at all: the visitor must already know which of 13 hair products they want. Nothing explains why one fits, and nothing is recommended.',
                'The account wall is the first screen for most products, so a visitor sees no question and no price confirmation before giving an e-mail and phone number.',
                'The form does no automatic safety screening. Heart failure, low blood pressure, pheochromocytoma and a minoxidil allergy were all accepted without a warning while oral minoxidil stayed in the cart (observed). The patient learns of a refusal only after sign-up, ID check and card.',
                'The oral minoxidil form asks nothing about blood pressure readings, heart rate, swelling, pregnancy or sex, and takes no photos. It shows a warning about finasteride and dutasteride, which it does not sell, and none about minoxidil.',
                'Red flags for other diagnoses (patchy bald spots, sudden loss, bleeding or painful scalp) get no warning, no extra question and no referral advice.',
                'The women\'s branch of the topical finasteride form has no pregnancy, breastfeeding or contraception question in the served definition.',
                'The dose is picked by the patient before any medical question, with the higher dose pre-selected.',
                'Rough edges: "End questionnaire" lands on a broken "Oops, you seem lost" page; the 1.25 mg dose shows in the cart as "2.5 mg (1.25mg)"; product facts differ between pages (tretinoin 0.0125% or 0.025%; oral minoxidil headline dose and price; dutasteride "0.1 mg to 0.6 mg" against one 0.1 mg option).',
                'The same generic question list is reused across products, so patients are asked things that do not apply (sexual dysfunction and a finasteride warning in the minoxidil form) and not asked things that do.'],
 'opportunities': ['Recommend before asking for contact details: a short guided consultation that ends in "this is the treatment for you, and why" is something Strut does not offer at all.',
                   'Make safety visible in the form: clear stop or warning screens for heart disease, low blood pressure and pregnancy, and "this may not be pattern hair loss, see a clinician" for patchy or sudden loss. Strut leaves all of this to an unseen review.',
                   'Tell unsuitable patients early. Strut lets them create an account, verify ID and save a card before anyone says no.',
                   'One joined-up route for women, with pregnancy, contraception, menopause and cycle questions. Strut splits women across an old checkout product and a hidden branch of a men\'s form.',
                   'Ask what Strut never asks: family history, goals, how fast the loss is progressing, treatment preference (tablet or topical), blood pressure, lifestyle. These make a recommendation feel personal.',
                   'Let the consultation choose the dose and step it up, rather than asking the patient to pick 1.25 mg or 2.5 mg.',
                   'Range gaps in Strut\'s hair-loss collection as listed on 23 Nov 2026: no stand-alone topical minoxidil, no oral spironolactone for women, no devices (laser caps), no cosmetic shampoo or conditioner line beyond prescription ketoconazole, and only one supplement.'],
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
   {'title': 'Intake form: dutasteride', 'url': START + '6ad9e1d39fba7abfd231a5b3'}, {'title': 'Intake form: oral minoxidil (replayed 19 times in stage 2)', 'url': START + '6aa3d578f415d1603a6e0c85'},
   {'title': 'Old checkout (redirects to sign-up)', 'url': OLD + 'womens-hair-growth-rx-formula?priceId=226'},
   {'title': 'Help centre (blocked by a security checkpoint, not read)', 'url': 'https://support.struthealth.com/hc/en-us'},
   {'title': 'Third-party review used only as a cross-check of topical strengths (not relied on)', 'url': 'https://perfecthairhealth.com/strut-health-review/'}],
 'limitations': ['Only the oral minoxidil form could be tested live. The oral finasteride, topical finasteride and dutasteride forms start with an account card, so their rules come from the served definition ("code"), not from replays.',
                 'What the reviewing provider does with any answer (declines, lowers the dose, removes an active) is not visible anywhere public. "No effect" in this report always means no effect inside the form, not no effect on the final prescription.',
                 'The questionnaires of the old-checkout products, including the main women\'s product, were not seen at all. No baseline woman could be walked on any route.',
                 'Not replayed on their own in the oral minoxidil form (the definition shows no branch on any of them): age 46-60; durations "Less than 6 months", "6-12 months", "Over 2 years"; symptoms "Thinning at the front hairline", "Thinning at the temples", "Diffuse thinning (all over)", "Increased shedding"; scalp "Itching, pain, burning, or lesions", "Dry skin or dandruff", "Rash"; every "treatments tried" option; every allergy except "Minoxidil"; conditions liver, thyroid, breast or prostate cancer, BPH, HIV, autoimmune, glaucoma; "Other" on treatments and allergies. Tested only in the combined worst-case run: "1 month or less", "Bleeding", sexual dysfunction "Yes", lost interest "Yes", heart attack, stroke, kidney disease.',
                 'Free-text answers (surgeries, medicines, anything else) were given one short neutral note each; whether particular words trigger anything is unknown, though the definition has no rule on text.',
                 'Nothing after the account card was tested: address (state availability), identity check, cart, promo codes, payment and the order confirmation are from code only.',
                 'No third-party sources (reviews, forums, videos) were searched in stage 2 because web search was unavailable; the help centre could not be read.',
                 'State availability by product is not published beyond "all states except Arkansas" and "certain medications may not be available in all states".',
                 'Replays used a copy of the shared walk tool with a shorter wait (scripts/walk_fast.js); the baseline was also run with the standard tool and matched. Each replay created an anonymous, unsubmitted form record and a cart session on Strut\'s side; no account, contact detail, photo, payment or order was ever entered.'],
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
no = sum(1 for f in flows for q in f['questions'] for o in q['options'])
print('written', sum(len(f['questions']) for f in flows), 'questions,', no, 'options in', len(flows), 'flows;', len(products), 'products;', len(rules), 'rules;', len(experiments), 'experiments;', len(recommendations), 'recommendation profiles')
