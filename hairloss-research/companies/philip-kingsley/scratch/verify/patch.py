# Stage 3 (verify) patch for company.json. Run once: python3 -I scratch/verify/patch.py
import json, os
D = '/home/user/ADHD-learning/hairloss-research/companies/philip-kingsley'
P = os.path.join(D, 'company.json')
c = json.load(open(P))
if c.get('verification'):
    raise SystemExit('already patched')

def ev(r):
    return json.load(open(os.path.join(D, 'runs', 'verify-' + r, 'eval.json')))

def skus(r):
    s = ev(r)['skus']
    return ', '.join(s) if s else 'NO SKU passes (consultation screen after the wall)'

prod = {p['id']: p for p in c['products']}
rule = {r['id']: r for r in c['rules']}
qs = {q['id']: q for f in c['flows'] for q in f['questions']}

def opt(qid, label_start):
    for o in qs[qid]['options']:
        if o['label'].startswith(label_start):
            return o
    raise KeyError(qid + ' ' + label_start)

# ---------- 1. experiments ----------
EXP = [
 ('b-men', 'men', 'none (stage 3 fresh baseline replay)', 'Same account wall; site rule check gave the recorded six SKUs. Served men rules byte-identical to quiz-definition-men.json (57,128 characters).'),
 ('b-women', 'women', 'none (stage 3 fresh baseline replay)', 'Same account wall; PHI1749 + PHI1670 as recorded. Served women rules byte-identical to the saved definition (196,018 characters).'),
 ('b-scalp', 'scalp', 'none (stage 3 fresh baseline replay)', 'Same account wall; PHI1619 + PHI1635 as recorded. Served scalp rules byte-identical to the saved definition (49,126 characters).'),
 ('m-patchy', 'men', 'men-q1: Temples and Crown -> Patchy (re-test of R5)', None),
 ('m-bp', 'men', 'men-q9: None of the above -> uncontrolled low or high blood pressure (re-test of R9)', None),
 ('m-dandruff-severe', 'men', 'men-q7a: No conditions -> Dandruff, follow-up men-q7b = Severe (new option; tests R2)', None),
 ('m-acne', 'men', 'men-q7a: No conditions -> Acne (new option; tests R4)', None),
 ('m-bleeding', 'men', 'men-q8: None of the above -> Bleeding (new option; tests R1)', None),
 ('m-notstarted', 'men', "men-q4: Gradually -> It's not started yet (new option; tests R1)", None),
 ('m-early-over65', 'men', 'Two changes on purpose: men-q1 = Early signs AND men-q6 = Over 65 (tests R6, which needs both)', None),
 ('m-itch-moderate', 'men', 'men-q7a: No conditions -> Itching, follow-up men-q7f = Moderate (new option; tests R3)', None),
 ('m-q2a-extensive', 'men', 'men-q2a: noticeable thinning -> "My hair has thinned extensively, or been lost entirely, throughout the top region" (new option)', None),
 ('m-tcr-slight', 'men', 'Two changes on purpose: men-q1 = Temples and Crown with reduced density AND men-q2a = scalp slightly visible (the only density answers that let this picture through; tests R5/R10/R27)', None),
 ('w-sudden', 'women', "women-q4: gradually over a year -> It's happened very suddenly (re-test of R12)", None),
 ('w-shedding', 'women', 'women-q3a: wider parting -> More shedding than usual, follow-up women-q3e = People close to me (re-test of R13)', None),
 ('w-bandlike', 'women', 'women-q3a: wider parting -> Bandlike recession (new option; tests R11). No follow-up appeared; the quiz moved straight to Q4.', None),
 ('w-temples', 'women', 'women-q3a: wider parting -> Thinning at temples, follow-up women-q3d = People close to me (new option)', None),
 ('w-temples-sudden', 'women', "Two changes on purpose: women-q3a = Thinning at temples AND women-q4 = It's happened very suddenly (tests the R12 gap from the other side)", None),
 ('w-redness-mild', 'women', 'women-q5a: none -> Redness, follow-up women-q5c = Mild (new option; tests R11)', None),
 ('w-dandruff-mild', 'women', 'women-q5a: none -> Dandruff, follow-up women-q5b = Mild (new option; tests R25)', None),
 ('w-other-allergy', 'women', 'women-q11a: no allergies -> Other, please state (text box filled with a neutral "Hay fever") (new option; tests R11)', None),
 ('w-medcond', 'women', 'women-q12a: No -> Yes, I have a medical condition (text box filled with a neutral "Asthma, uses an inhaler when needed") (new option)', None),
]
for rid, flow, changed, res in EXP:
    e = ev(rid)
    assert e['step'].endswith('_step_user'), rid
    result = res or ('Reached the same account wall ("Almost done! Your details"); no warning or stop screen before it. Site rule check in the live page: ' + skus(rid) + '.')
    c['experiments'].append({'id': 'v-' + rid, 'flow': flow, 'changed': changed, 'result': result + ' (stage 3 verify run)', 'run': 'runs/verify-' + rid})

# ---------- 2. rules: add stage 3 proof / corrections ----------
def addproof(rid, runs, note=''):
    r = rule[rid]
    r['proof'] += '; stage 3 re-test (confirmed): ' + ', '.join('runs/verify-' + x for x in runs)
    if note:
        r['then'] += ' ' + note

addproof('R1', ['m-bleeding', 'm-notstarted'], 'Stage 3 also confirmed two options stage 2 had not replayed: Bleeding (men-q8) and "It\'s not started yet" (men-q4). The consultation screen itself does not show prices; the £200 / £345 figures come from the clinic price list (docs).')
rule['R1']['then'] = rule['R1']['then'].replace('("Choose your consultation type": virtual from £200, clinic from £345)', '("Choose your consultation type": in-clinic or virtual initial consultation; prices are not on that screen, the clinic price list says virtual from £200, clinic from £345)')
addproof('R2', ['m-dandruff-severe'], 'Stage 3 confirmed the dandruff branch live (Dandruff + Severe: no SKU passes).')
addproof('R3', ['m-itch-moderate'], 'Stage 3: moderate itching gives the same PHI1306 + PHI1309 as mild.')
addproof('R4', ['m-acne'], 'Stage 3 confirmed Acne live (only PHI1220 and PHI1221 pass).')
addproof('R5', ['m-patchy', 'm-tcr-slight'], 'Stage 3: Patchy again gave only PHI1220 + PHI1221. With "Temples and Crown with reduced density" plus a visible-scalp density answer, the 5% Combination Plan does pass (see R27).')
addproof('R6', ['m-early-over65'], 'Stage 3 (two changes on purpose, Early signs + Over 65): PHI1220, PHI1221, PHI1301, PHI1302. For Early signs the age rule also drops PHI1306, which only men under 50 get (R23).')
rule['R6']['affects'] = ['p-fin', 'p-5combo', 'p-scalp-addons-men']
addproof('R9', ['m-bp'], 'Stage 3 code re-read: the shared safety blocker of all 16 men\'s SKUs has the value " I have uncontrolled low or high blood pressure" (leading space); only PHI1221 (and the never-firing PHI1771/PHI1772) have a second, correct blood-pressure blocker.')
rule['R10']['proof'] += '; stage 3 code re-read (confirmed): PHI1304 conditions ask for "Temples & Crown with Reduced Density" while the option is "Temples and Crown with reduced density"; PHI1230 puts a density answer under the picture question label; PHI1770 has Itching/Dandruff both as conditions and as blockers. Live: runs/verify-m-tcr-slight (the exact case the 3% plan was meant for) returned PHI1305, not PHI1304.'
addproof('R11', ['w-bandlike', 'w-redness-mild', 'w-other-allergy'], 'Stage 3 confirmed three options stage 2 had not replayed: Bandlike recession, mild Redness and an "Other" allergy each leave no SKU.')
addproof('R12', ['w-sudden', 'w-temples-sudden'], 'Stage 3: wider parting + sudden still gets PHI1749; thinning at temples + sudden gets nothing (two changes on purpose), so the gap is specific to the wider-parting picture.')
addproof('R13', ['w-shedding'])
addproof('R24', ['m-q2a-extensive'], 'Stage 3: the "thinned extensively ... throughout the top region" density answer also changes nothing for the baseline picture.')
addproof('R25', ['w-dandruff-mild'], 'Stage 3: mild dandruff does the same (PHI1749 kept, add-on PHI1670 -> PHI1688).')
rule['R25']['when'] = 'women-q5a = Itching or Dandruff with severity Mild'
rule['R1']['affects'] = rule['R1']['affects']

# evidence-label corrections
rule['R18']['then'] = ('A finasteride mood warning (men-q9e: "occasional reports of depression and even suicidal thoughts") appears with accept / decline choices (observed). '
                       'Whatever is chosen, the site\'s rule check finds no SKU (code, client function run live), so the consultation screen would follow the wall; the warning answer never changes the outcome.')
rule['R19']['then'] = ('Free-text boxes appear (medicine names and doses, and what they are for; allergy description) (observed). No product rule reads them, and the live rule check gave the baseline SKUs (code). '
                       'That a prescriber reads them is an assumption (inferred), not shown anywhere public.')
rule['R21']['then'] = '"Are you on HRT?" appears (observed). Neither answer changes the SKUs in the live rule check (code).'
rule['R26']['then'] = ('There is no under-18 answer, so the quiz itself cannot screen out minors (code; seen in runs/b-men). The women\'s and scalp quizzes ask no age question at all. '
                       'The wall asks for a date of birth; whether that is used to refuse under-18s was not tested (needs an account), so any age check after the wall is unknown.')

# new rules
c['rules'].append({
 'id': 'R27', 'flow': 'men',
 'when': 'men-q1 = "Temples and Crown with reduced density" AND men-q2a = scalp slightly visible or very visible',
 'then': 'Of the named plans only the 5% Combination Plan (PHI1305) passes, beside PHI1220 and PHI1221. This is the case the 3% Combination Plan (PHI1304) was built for, but its typo means the 5% plan is offered instead. With any other density answer this picture keeps only PHI1220 and PHI1221 (R5).',
 'effectType': 'product-removed', 'affects': ['p-5combo', 'p-3combo', 'p-min5', 'p-topcombo', 'p-fin'],
 'evidence': 'code', 'proof': 'quiz-definition-men.json rules PHI1305 and PHI1304; independent port scratch/verify/engine.js; live (two changes on purpose): runs/verify-m-tcr-slight (PHI1220, PHI1221, PHI1305)',
 'confidence': 'high'})
c['rules'].append({
 'id': 'R28', 'flow': 'women',
 'when': 'women-q12a = "Yes, I have a medical condition, please state" (text box filled)',
 'then': 'A text box appears (observed). No rule reads it: PHI1749 and the add-on PHI1670 still pass (code, live rule check). Only "I am taking oral minoxidil" in this question blocks (R11).',
 'effectType': 'extra-questions', 'affects': [],
 'evidence': 'observed', 'proof': 'runs/verify-w-medcond vs runs/verify-b-women', 'confidence': 'high'})
c['rules'].append({
 'id': 'R29', 'flow': 'women',
 'when': 'women-q3a = "Thinning at temples" (any "how noticeable" answer), onset gradual',
 'then': 'Same as the baseline: main product PHI1749 + add-on PHI1670. Thinning at temples, overall thinning and wider parting all lead to the same product; only shedding (R13) changes it.',
 'effectType': 'none', 'affects': ['p-sku1749'],
 'evidence': 'code', 'proof': 'quiz-definition-women.json PHI1749 conditions; live: runs/verify-w-temples', 'confidence': 'high'})

# ---------- 3. option effects ----------
def live(o, run, text=None):
    o['effect'] += ' Stage 3 live check (runs/verify-' + run + '): ' + (text or skus(run)) + '.'

live(opt('men-q1', 'Patchy'), 'm-patchy')
live(opt('men-q1', 'Temples and Crown with reduced density'), 'm-tcr-slight', 'with a visible-scalp density answer (two changes on purpose) the 5% Combination Plan passes: ' + skus('m-tcr-slight'))
live(opt('men-q2a', 'My hair has thinned extensively'), 'm-q2a-extensive')
live(opt('men-q4', "It's not started yet"), 'm-notstarted')
live(opt('men-q7a', 'Acne'), 'm-acne')
for lab in ['Itching', 'Dandruff', 'Eczema']:
    o = opt('men-q7a', lab)
    o['effectType'] = 'extra-questions'
    o['effect'] = 'Opens a severity follow-up on the same screen. The outcome depends on that answer: ' + {
        'Itching': 'Mild or Moderate swaps the hair-loss plans for the unnamed scalp SKUs PHI1306 + PHI1309; Severe leaves no SKU (consultation).',
        'Dandruff': 'Mild or Moderate swaps the hair-loss plans for Healthy Scalp plans (PHI1306-PHI1311); Severe leaves no SKU (consultation).',
        'Eczema': 'Mild or Moderate gives PHI1220, PHI1221, PHI1306, PHI1309; Severe leaves only PHI1220 + PHI1221.'}[lab] + ' (code; stage 2 and 3 live checks)'
live(opt('men-q7b', 'Severe'), 'm-dandruff-severe')
live(opt('men-q7f', 'Moderate'), 'm-itch-moderate')
live(opt('men-q8', 'Bleeding'), 'm-bleeding')
live(opt('men-q9', 'I have uncontrolled'), 'm-bp')
o = opt('men-q6', 'Over 65'); live(o, 'm-early-over65', 'with Early signs (two changes on purpose): ' + skus('m-early-over65'))
live(opt('women-q3a', 'Thinning at temples'), 'w-temples', 'no follow-up change; ' + skus('w-temples'))
o = opt('women-q3a', 'Thinning at temples'); o['effectType'] = 'extra-questions'
live(opt('women-q3a', 'Bandlike recession'), 'w-bandlike', 'no follow-up question appeared; ' + skus('w-bandlike'))
live(opt('women-q3a', 'More shedding'), 'w-shedding')
live(opt('women-q4', "It's happened very suddenly"), 'w-sudden', 'with the baseline wider parting: ' + skus('w-sudden') + '; with thinning at temples (two changes on purpose, runs/verify-w-temples-sudden): ' + skus('w-temples-sudden'))
for lab in ['Itching', 'Dandruff', 'Eczema']:
    o = opt('women-q5a', lab)
    o['effectType'] = 'extra-questions'
    o['effect'] = 'Opens a severity follow-up. Mild keeps the main product PHI1749 (itching and dandruff switch the haircare add-on to PHI1688; mild eczema removes the add-on); Moderate or Severe leaves no SKU (consultation) (code; live: runs/w11, runs/verify-w-dandruff-mild).'
live(opt('women-q5b', 'Mild'), 'w-dandruff-mild')
live(opt('women-q5c', 'Mild'), 'w-redness-mild')
live(opt('women-q11a', 'Other'), 'w-other-allergy')
o = opt('women-q12a', 'Yes, I have'); live(o, 'w-medcond'); o['effectType'] = 'extra-questions'
o = opt('women-q3d', 'People close'); live(o, 'w-temples')

# ---------- 4. products ----------
p = prod['p-min5']
p['audience'] = 'men'
p['recommendedWhen'] += ' The store page says it is "used to treat male pattern hair loss" (the 3% page says male and female); the leaflet covers men and women aged 18+. No women\'s rule offers PHI1301.'
p['priceDetail'] = ('Hairloss store (checked 24 Nov 2026): £40, subscription only, page structured data "Subscribe & Save: 50% off the first order, 0% off thereafter, free delivery" (£20 first order). '
                    'www store the same day: £40 with Subscribe & Save £28 (30% off the first order, 15% off after; Black Friday banner on the site). Actives from the PK Labs leaflet: minoxidil 5%, ethanol, water, propylene glycol, caffeine, zinc, melatonin.')
p['evidence'] = 'code'
prod['p-min3']['priceDetail'] = 'Hairloss store page (checked 24 Nov 2026): £36, subscription only, Subscribe & Save 50% off the first order (£18), 0% after. Page says "used to treat male and female pattern hair loss". Leaflet: minoxidil 3%, ethanol, water, caffeine, zinc, melatonin; 100 ml, about 40 doses of 2.5 ml.'
prod['p-min3']['audience'] = 'both'
pf = prod['p-fin']
pf['priceDetail'] = 'Re-checked 24 Nov 2026: £40 on the hairloss store (Subscribe & Save 50% off the first order, £20), £42 on the www store (www Subscribe & Save £29.40). Leaflet: finasteride 1 mg capsule once daily with biotin 500 micrograms and vitamin D 1000 IU; "unlicensed and is made and dispensed under pharmacist supervision".'
p3 = prod['p-3combo']
p3['actives'] = [{'name': 'finasteride (oral)', 'strength': '1 mg (page text: "Finasteride 1mg Tablet, take 1 tablet per day")'}, {'name': 'minoxidil (topical)', 'strength': '3% (from the product name)'}]
p3['form'] = 'finasteride 1 mg tablets + minoxidil 3% scalp drops (2.5 ml a day) per the product page; the finasteride leaflet calls the same product a capsule'
p3['priceDetail'] = 'Hairloss store (checked 24 Nov 2026): £76; Subscribe & Save 50% off the first order (£38).'
p5 = prod['p-5combo']; p5['priceDetail'] = 'Hairloss store (checked 24 Nov 2026): £80, subscription only; Subscribe & Save 50% off the first order (£40), 0% after. Page text: "Finasteride 1mg Tablet, take one tablet per day" + minoxidil drops 2.5 ml a day.'
ph = prod['p-hs-topcombo']
ph['actives'] = [{'name': 'minoxidil', 'strength': '5%'}, {'name': 'finasteride', 'strength': '0.1%'}]
ph['form'] = 'scalp drops ("Density+ Minoxidil 5% + Finasteride 0.1% Scalp Drops") + Healthy Scalp Shampoo'
ph['priceDetail'] = 'Hairloss store (checked 24 Nov 2026): £100; Subscribe & Save 50% off the first order (£50). Strengths from the page description (docs), no longer inferred.'
for pid, price, half in [('p-3hs', '£118', '£59'), ('p-5hs', '£122', '£61')]:
    x = prod[pid]
    x['actives'] = [{'name': 'minoxidil (topical)', 'strength': x['actives'][0]['strength']}, {'name': 'finasteride (oral)', 'strength': '1 mg tablet (page text: "Finasteride 1mg Tablet")'}]
    x['priceDetail'] = 'Hairloss store (checked 24 Nov 2026): ' + price + '; Subscribe & Save 50% off the first order (' + half + '). Page: "triple-action approach targets hair loss and mild-moderate scalp flaking"; shampoo content inferred from the name.'
prod['p-topcombo']['priceDetail'] = 'Hairloss store (checked 24 Nov 2026): £58; Subscribe & Save 50% off the first order (£29), 0% after. ' + prod['p-topcombo']['priceDetail']
prod['p-combination-plan']['priceDetail'] = 'www store (checked 24 Nov 2026): £216, Subscribe & Save £151.20 (30% off the first order, 15% after). Not referenced by any quiz rule.'
sh = prod['p-shedding']
sh['actives'] = [{'name': 'melatonin liposome', 'strength': 'not stated'}, {'name': 'Sandalore', 'strength': 'not stated'}, {'name': 'zinc', 'strength': 'not stated'}, {'name': 'botanical blend (the women\'s page names Edelweiss extract and Baicapil)', 'strength': 'not stated'}]
sh['priceDetail'] = 'www product page (checked 24 Nov 2026): £65, Subscribe & Save £52 (20% off the first order, 15% after). The product page lists melatonin liposome, Sandalore, a botanical blend and zinc; the women\'s treatment page names Edelweiss extract and Baicapil. Women\'s page: "1 bottle per month".'
prod['p-consult-clinic']['legalStatus'] = 'service (trichologist consultation and treatment; regulatory status not stated on the pages)'
prod['p-consult-virtual']['priceDetail'] = 'Re-checked 24 Nov 2026: clinic price list "Virtual Initial Consultation From £200, 60 minutes"; the /clinics/virtual-consultation page still says "Pricing begins at £150". The quiz\'s consultation screen says 45-60 minutes and shows no price.'
# products missing from the catalogue
c['products'].append({'id': 'p-dps', 'name': 'Density Preserving Scalp Drops (www store)', 'category': 'cosmetic',
  'actives': [{'name': 'piroctone olamine', 'strength': 'not stated'}, {'name': 'azelaic acid', 'strength': 'not stated'}, {'name': 'pyridoxine HCl', 'strength': 'not stated'}, {'name': 'zinc PCA', 'strength': 'not stated'}, {'name': 'glycerin', 'strength': 'not stated'}],
  'form': 'scalp drops, 85 ml (image file name)', 'audience': 'both', 'legalStatus': 'cosmetic (inferred: sold in the general haircare store, no prescription)',
  'price': '£55', 'priceDetail': 'Stage 1 saved page (23 Nov 2026, extracted/www-density-preserving-scalp-drops.html.txt): £55 with a £38.50 sale price during the Black Friday banner. Not re-fetched in stage 3.',
  'url': 'https://www.philipkingsley.co.uk/density-preserving-scalp-drops.html', 'recommendedWhen': 'Not referenced by any quiz rule (code). Found only in the www store; added in stage 3 because the catalogue missed it.', 'evidence': 'docs'})
c['products'].append({'id': 'p-dps-trio', 'name': 'Density Drops Trio (3-month pack of Density Preserving Scalp Drops, www store)', 'category': 'bundle',
  'actives': [{'name': 'as Density Preserving Scalp Drops', 'strength': 'not stated'}],
  'form': 'three bottles of scalp drops (image file name "density_drops_3_months")', 'audience': 'both', 'legalStatus': 'cosmetic (inferred)',
  'price': '£165', 'priceDetail': 'Stage 1 saved page (23 Nov 2026): £165 with a £115.50 sale price. Not re-fetched in stage 3.',
  'url': 'https://www.philipkingsley.co.uk/density-drops-trio.html', 'recommendedWhen': 'Not referenced by any quiz rule (code). Added in stage 3.', 'evidence': 'docs'})

# ---------- 5. recommendations ----------
for r in c['recommendations']:
    if r['profile'].startswith('Man 50+'):
        r['note'] = 'Oral finasteride and the 5% Combination Plan drop out (and, for Early signs, PHI1306). Live: runs/m33 (Temples + 50-64), runs/verify-m-early-over65 (Early signs + Over 65): PHI1220, PHI1221, PHI1301, PHI1302.'
c['recommendations'].append({'profile': 'Man, Temples and Crown with reduced density, scalp slightly or very visible', 'offered': ['p-5combo', 'p-sku1220', 'p-sku1221'], 'default': 'p-5combo',
  'note': 'Only named plan is the 5% Combination Plan; the 3% plan meant for this case never appears (runs/verify-m-tcr-slight).', 'evidence': 'code'})
c['recommendations'].append({'profile': 'Woman with thinning at temples, gradual (otherwise baseline)', 'offered': ['p-sku1749', 'p-w-routine'], 'default': 'p-sku1749',
  'note': 'Same as the baseline woman (runs/verify-w-temples). If the loss was sudden, no SKU passes (runs/verify-w-temples-sudden).', 'evidence': 'code'})

# ---------- 6. summary text ----------
c['engineSummary'] = c['engineSummary'].replace('if none passes, the person gets the "Choose your consultation type" screen (virtual from £200 or clinic from £345)',
  'if none passes, the person gets the "Choose your consultation type" screen (in-clinic or virtual initial consultation with a booking calendar; the screen shows no price, the clinic price list says virtual from £200, clinic from £345)')
c['engineSummary'] = c['engineSummary'].replace('Every SKU that passes is listed in "Recommended" and "Other" groups', 'The served rules put each passing SKU in a "Recommended" or "Other" group (the rendered results page itself was not seen)')
c['engineSummary'] = c['engineSummary'].replace('All of this was confirmed in 47 live replays by running the site\'s own rule function at the wall;',
  'All of this was checked in 47 stage 2 and 22 stage 3 live replays by running the site\'s own rule function at the wall (every one matched the served rules, which were byte-identical to the saved copy on 24 Nov 2026);')
c['access']['coverageNote'] += (' Stage 3 (independent verify, 24 Nov 2026): 3 fresh baselines and 19 variants (runs/verify-*), 10 of them on options never replayed before; all 22 matched an independent port of the rule check '
                               '(scratch/verify/engine.js) and the served rules were byte-identical to the saved definitions. 12 product pages, both leaflets and the clinic price list were re-read live.')
c['access']['accountWall'] = c['access']['accountWall'].replace('GP and consent ticks', 'a GP-information tick, a consent tick with four statements, and an optional newsletter tick')
c['limitations'][2] = c['limitations'][2].replace('men-q2a "slightly visible" and "extensive", men-q4 "It\'s not started yet", ', 'men-q2a "slightly visible" alone, ').replace('men-q7a Acne, moderate itching/dandruff/redness, severe eczema, men-q8 Crusting and Bleeding,', 'moderate dandruff/redness, severe eczema, men-q8 Crusting,').replace('women thinning at temples, band-like recession, something else,', 'women "something else",').replace('dandruff, redness, eczema and other symptoms,', 'eczema and other symptoms, moderate/severe dandruff and redness,').replace('women-q11a other allergy, women-q12a medical condition;', '').strip()
c['limitations'][2] += ' Stage 3 replayed 10 of the previously untested options (men: extensive density, not started yet, acne, severe dandruff, moderate itching, bleeding; women: thinning at temples, band-like recession, mild redness, mild dandruff, other allergy, medical condition) and all matched the code.'
c['sources'].append({'title': 'PK Labs patient leaflet: Topical Minoxidil Scalp Drops 3% and 5% (re-read 24 Nov 2026)', 'url': 'https://www.philipkingsley.co.uk/pklabs-patient-information-topical-minoxidil'})
c['sources'].append({'title': 'Density Preserving Scalp Drops (www store)', 'url': 'https://www.philipkingsley.co.uk/density-preserving-scalp-drops.html'})
c['sources'].append({'title': 'Density Drops Trio (www store)', 'url': 'https://www.philipkingsley.co.uk/density-drops-trio.html'})
c['checkedOn'] = '2026-11-24'

json.dump(c, open(P, 'w'), indent=1, ensure_ascii=False)
print('patched', len(c['experiments']), 'experiments', len(c['rules']), 'rules', len(c['products']), 'products')
