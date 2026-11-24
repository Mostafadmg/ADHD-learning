# Stage 3 (verify) patch. Run ONCE on the stage 2 company.json (backup: raw/company-stage2-backup.json).
import json, os
c = json.load(open('company.json'))
P = {p['id']: p for p in c['products']}
Q = {q['id']: q for f in c['flows'] for q in f['questions']}
R = {r['id']: r for r in c['rules']}
WALL_SMS = "https://www.form.happyhead.com/get-started-now/?l=false&email_capture=sms_capture&ph=true&_stsgnoredir=1"

# ---- access / account wall
c['access']['accountWall'] = ("An email page ('BLACK FRIDAY SALE, Up to 60% Off, Plus FREE Dermaroller' on 23 Nov 2026) with a consent tick. "
  "Its fields and place depend on a split test chosen when the quiz loads: (a) sms_capture: email + US mobile number, after every medical question "
  "(about 26 screens in; runs/baseline-men, runs/verify-base-women-pinned); (b) no redirect: email only, same place at the end (runs/s2/baseline-men, runs/verify-base-men); "
  "(c) early_capture: email only, straight after 'Take Me to My Plan', BEFORE the recommendation screen and before any medical question "
  "(runs/verify-base-women, runs/s2/var-early-capture-women). Submitting it posts the questionnaire to api.happyhead.com/middleware/embeddables and leads to checkout "
  "at my.happyhead.com. Nothing was entered.")
c['access']['coverageNote'] = c['access']['coverageNote'].replace(
  "Not tested: product pages and prices on www.happyhead.com (closed to this agent), the 'Female 50 or older' and 'Oral' recommendations live, anything after",
  "Not tested: product pages and prices on www.happyhead.com (closed to this agent; a few facts were checked through web-search summaries only), anything after") + (
  " Stage 3 (independent check, 23 Nov 2026): both baselines and 12 high-impact rules replayed live in runs/verify-*, plus 4 new one-change tests "
  "(woman 50+ choosing Oral, woman with no birth control, woman with household pregnancy, man with low blood pressure). All runs: 0 consultation posts.")

q = Q['m-email']
q['text'] = ("BLACK FRIDAY SALE, Up to 60% Off, Plus, FREE Dermaroller (23 Nov 2026). Split test: 'Email' + 'Mobile Number' (sms_capture) or 'Email Address*' only. "
             "'By checking this box you agree to our Terms, Privacy Policy, Drug Safety, Telehealth Consent, and MDI Telehealth Consent.'")
q['purpose'] = ("THE ACCOUNT WALL. Needs an email (and in one test arm a US mobile number) and the consent tick. In the early_capture arm it appears before the "
                "recommendation screen. Submitting posts every answer to Happy Head's backend and leads to checkout. Not filled in.")
q['shownWhen'] = "always; at the end, or straight after 'Take Me to My Plan' in the early_capture split-test arm (runs/verify-base-women)"
Q['m-medintro']['evidence'] = 'observed'

# ---- option updates from new runs
for o in Q['m-birth-control']['options']:
    if o['label'] == 'None of the above':
        o['effect'] = ("Seen live (runs/verify-w-bc-none): no warning, no stop; the spironolactone capsule and minoxidil topical stay in the plan "
                       "(product_ids 287244,68633). Passed to the dermatologist marked 'important' (code).")
        o['evidence'] = 'observed'
for o in Q['m-bp']['options']:
    if o['label'].startswith('Low'):
        o['effect'] = ("Seen live (runs/verify-m-bp-low): no warning and no stop; the oral minoxidil capsule stays in the plan. Passed to the dermatologist "
                       "marked 'critical' (code: raw/backend-payload-code.txt).")
        o['evidence'] = 'observed'
for o in Q['m-household-preg']['options']:
    if o['label'] == 'Yes':
        o['effect'] += (" Also shown to a woman under 50 whose plan has no finasteride or dutasteride (runs/verify-w-household-yes): the screen is not tied to the plan.")
for o in Q['m-sexage']['options']:
    if o['label'] == 'Female 50 or older':
        o['effect'] += " Re-checked live in stage 3 (runs/verify-w-50plus-full); with method Oral she gets the dutasteride SuperCapsule card (runs/verify-w-50plus-oral)."

# ---- rule fixes
R['R8']['effectType'] = 'soft-warning'
R['R8']['proof'] += '; re-checked runs/verify-w-dob-mismatch'
R['R4']['effectType'] = 'product-switched'
R['R4']['proof'] += '; re-checked runs/verify-m-method-oral, runs/verify-w-50plus-oral'
for rid, run in [('R1','runs/verify-base-men'),('R2','runs/verify-base-women-pinned'),('R3','runs/verify-w-50plus-full'),('R7','runs/verify-m-dob-under18'),
                 ('R11','runs/verify-m-household-yes-decline'),('R12','runs/verify-m-choose-topical'),('R15','runs/verify-m-cond-heart'),('R6','runs/verify-m-choose-topical')]:
    R[rid]['proof'] += '; re-checked live in stage 3: ' + run
R['R10']['then'] += " Stage 3 added low blood pressure (runs/verify-m-bp-low) and no birth control in a woman able to become pregnant (runs/verify-w-bc-none): same result."
R['R10']['proof'] += '; runs/verify-m-bp-low, runs/verify-w-bc-none, runs/verify-m-cond-heart'
R['R9']['proof'] += '; re-read in stage 3: critical = reactions yes, household pregnancy yes, BP low, customisation yes; 23 options marked important'
R['R20']['evidence'] = 'observed'

new_rules = [
 {"id":"R22","flow":"main","when":"m-sexage = 'Female 50 or older' and m-method = 'Oral'","then":"Cards: Dual (dutasteride topical + dutasteride capsule) first, then the dutasteride + minoxidil SuperCapsule alone. Same as a man who chooses Oral.",
  "effectType":"product-switched","affects":["p2","p3"],"evidence":"observed","proof":"runs/verify-w-50plus-oral vs runs/verify-w-50plus-full","confidence":"high"},
 {"id":"R23","flow":"main","when":"Woman under 50 able to become pregnant, m-birth-control = 'None of the above'","then":"No warning and no stop. The spironolactone + minoxidil capsule stays in the plan; the answer is only flagged 'important' for the dermatologist.",
  "effectType":"flag-for-clinician","affects":["p5","p6"],"evidence":"observed","proof":"runs/verify-w-bc-none vs runs/verify-base-women-pinned","confidence":"high"},
 {"id":"R24","flow":"main","when":"Woman under 50, m-household-preg = 'Yes'","then":"She is shown the 'Finasteride & Dutasteride: Partner Pregnancy Risk' screen even though her plan holds neither drug. The screen is the same for everyone and is not tied to the plan.",
  "effectType":"extra-questions","affects":[],"evidence":"observed","proof":"runs/verify-w-household-yes (22.txt)","confidence":"high"},
 {"id":"R25","flow":"main","when":"m-bp = 'Low (Below 100 / 65)'","then":"No warning, no stop; oral minoxidil stays in the plan. Flagged 'critical' for the dermatologist (code).",
  "effectType":"flag-for-clinician","affects":["p2","p3"],"evidence":"observed","proof":"runs/verify-m-bp-low vs runs/verify-base-men","confidence":"high"},
 {"id":"R26","flow":"main","when":"Split test chosen on load (email_capture = early_capture)","then":"The email wall comes straight after 'Take Me to My Plan', before the recommendation screen and before all medical questions. The recommendation call has already been made.",
  "effectType":"none","affects":[],"evidence":"observed","proof":"runs/verify-base-women, runs/s2/var-early-capture-women","confidence":"high"},
]
c['rules'].extend(new_rules)

new_exps = [
 ("verify-base-men","none: baseline man replayed fresh (plain start URL)","Same recommendation (Dual dutasteride set, $89 + $89). Ended on an email-only wall (no mobile field): split test."),
 ("verify-base-women","none: baseline woman replayed fresh (plain start URL)","Redirected to the early_capture arm: the email wall came before the recommendation screen. Recommendation call (spironolactone + minoxidil 6% topical) was still made."),
 ("verify-base-women-pinned","none: baseline woman on the sms_capture URL","Same as recorded: Dual minoxidil 6% topical TM3 ($59) + spironolactone SuperCapsule SC3 ($89); email + mobile wall at the end."),
 ("verify-w-50plus-full","re-test of R3 (Female 50 or older, birth year 1970)","Confirmed: dutasteride set."),
 ("verify-m-dob-under18","re-test of R7 (birth year 2010)","Confirmed: 'You must be over 18', no NEXT button."),
 ("verify-w-dob-mismatch","re-test of R8 (woman under 50, birth year 1970)","Confirmed: sent back to the sex/age page with the discrepancy message."),
 ("verify-m-household-yes-decline","re-test of R11","Confirmed: risk screen shown; after 'No, I do not accept' the plan still holds dutasteride (product_ids 116443,274216)."),
 ("verify-m-cond-heart","re-test of R15","Confirmed: one free-text page; plan unchanged."),
 ("verify-m-choose-topical","re-test of R12","Confirmed: check-up, blood-pressure and weight pages skipped; product_ids 116443."),
 ("verify-m-method-oral","re-test of R4 (man, Oral)","Confirmed: second card SuperCapsule; service sent ['Oral']."),
 ("verify-w-50plus-oral","NEW: Female 50 or older + method Oral","Dual dutasteride set first, then the dutasteride SuperCapsule card."),
 ("verify-w-bc-none","NEW: woman birth control Oral contraceptives -> None of the above","No warning; spironolactone capsule stays."),
 ("verify-w-household-yes","NEW: woman household pregnancy No -> Yes","Finasteride/dutasteride partner-risk screen shown to a woman on a spironolactone plan (run stopped on that screen)."),
 ("verify-m-bp-low","NEW: man blood pressure Normal -> Low","No change; oral minoxidil stays."),
]
for i, ch, res in new_exps:
    c['experiments'].append({"id": i, "flow": "main", "changed": ch, "result": res, "run": "runs/" + i})

c['recommendations'].append({"profile":"Woman 50 or older, method = Oral","offered":["p3","p2"],"default":"p3","note":"Dutasteride set; capsule card second. runs/verify-w-50plus-oral","evidence":"observed"})
for r in c['recommendations']:
    if r['profile'].startswith('Man with red flags'):
        r['profile'] = r['profile'].replace('age 70)', 'age 70, low blood pressure)')

# ---- products
P['p1']['priceDetail'] = (P['p1'].get('priceDetail','') + " Stage 3 re-check (runs/verify-base-men, API data): $89 one 25-day bottle, $267 for 3, $445 for 5; formula TD9 dutasteride 0.3%, minoxidil 8%, retinoic acid 0.001%, hydrocortisone 1%.").strip()
P['p2']['priceDetail'] = (P['p2'].get('priceDetail','') + " Stage 3 re-check (runs/verify-base-men): $89 / $267 (3) / $445 (5); SC2 0.5 mg dutasteride, 1.25 mg minoxidil, 2,000 IU D3.").strip()
P['p4']['priceDetail'] = (P['p4'].get('priceDetail','') + " Stage 3 re-check (runs/verify-base-women-pinned): $59 / $177 (3) / $295 (5); TM3 minoxidil 6%, retinoic acid 0.01%, hydrocortisone 1%.").strip()
P['p5']['priceDetail'] = (P['p5'].get('priceDetail','') + " Stage 3 re-check (runs/verify-base-women-pinned): $89 / $267 (3) / $445 (5); SC3 25 mg spironolactone, 1.25 mg minoxidil, 2,000 IU D3.").strip()
P['p7']['price'] = "$79 list, $63.20 a month on subscription (web-search summary of happyhead.com product page, 23 Nov 2026; page not opened)"
P['p7']['priceDetail'] = ("Earlier figure ($29 first month then $59, finvsfin.com Oct 2025) is out of date. A landing page advertises 60% off the first Rx order ($32). "
                          "Strengths finasteride 1.0 mg, minoxidil 1.25 mg, D3 2,000 IU are stated on a Happy Head landing page (happyhead.com/lp/supercapsule/dy82zh, via web search).")
P['p8']['priceDetail'] = (P['p8']['priceDetail'] + " Stage 3 web search (23 Nov 2026): two Happy Head pages exist, one dutasteride + tadalafil 5 mg + D3 at $89 list / $71.20 subscription, "
                          "one finasteride 1.0 mg + tadalafil 5 mg + D3. Dutasteride strength on the search summary is unclear. Treat as two products, details unverified.")
P['p8']['actives'] = [{"name":"dutasteride (or finasteride 1 mg in a second version)","strength":"unverified"},{"name":"tadalafil","strength":"5 mg"},{"name":"vitamin D3","strength":"2,000 IU"}]
P['p14']['priceDetail'] += " Stage 3: no current Happy Head price found by web search; finvsfin lists $39 first month then $79. Price unverified."
for a in P['p16']['actives']:
    if a['name'] == 'melatonin': a['strength'] = '0.1% (web-search summary of the product page, 23 Nov 2026)'
P['p16']['priceDetail'] += " Stage 3 web search: a landing page advertises $59 for the first month; standard price not confirmed."

c['engineSummary'] = c['engineSummary'].replace("21 live one-change tests", "25 live one-change tests (21 in stage 2, 4 more in the stage 3 check)") + (
  " The email wall is a split test: in one arm it comes before the recommendation screen.")

c['verification'] = {
 "checked": [
  "Baseline man replayed fresh (runs/verify-base-men): same Dual dutasteride recommendation, same prices; wall was email-only, not email + mobile.",
  "Baseline woman replayed fresh twice: plain URL went to the early_capture arm with the wall before the recommendation (runs/verify-base-women); pinned sms_capture URL matched the record exactly (runs/verify-base-women-pinned).",
  "R3 woman 50+ gets the dutasteride set: confirmed (runs/verify-w-50plus-full).",
  "R4 method Oral swaps the second card to SuperCapsule: confirmed (runs/verify-m-method-oral).",
  "R7 under-18 hard stop: confirmed (runs/verify-m-dob-under18).",
  "R8 woman birth date out of band sends her back: confirmed (runs/verify-w-dob-mismatch).",
  "R11 declining the partner-pregnancy risk keeps dutasteride: confirmed (runs/verify-m-household-yes-decline).",
  "R12/R6 choosing Topical skips check-up, blood pressure and weight: confirmed (runs/verify-m-choose-topical).",
  "R15 heart condition adds a text page only: confirmed (runs/verify-m-cond-heart).",
  "R9 clinician flags: re-read raw/backend-payload-code.txt; the four critical options and 23 important options match the rule.",
  "Products checked against live recommendation data: p1, p2, p4, p5 (names, formulas, strengths, $89/$59 and 3- and 5-bottle prices) and p3, p6 (sums); all confirmed.",
  "Products checked by web search of happyhead.com pages (pages not opened, robots.txt): p7 (strengths confirmed, price corrected), p8 (conflict found), p14 (price not confirmed), p16 (melatonin strength added).",
  "Every run folder named as proof in rules and experiments exists."
 ],
 "corrected": [
  "Account wall: was 'email + US mobile after all questions'. It is a split test; one arm is email-only and one puts the wall before the recommendation screen (new rule R26).",
  "R8 effectType product-switched -> soft-warning (the woman is sent back; no product changes).",
  "R4 effectType product-removed -> product-switched (a card is swapped).",
  "coverageNote said Female 50+ and Oral were not tested live; they were (stage 2 and stage 3).",
  "p7 price: finvsfin's 2025 figure replaced by the product page's $79 / $63.20 (search summary).",
  "p8 actives: two versions (dutasteride or finasteride with tadalafil) noted as unverified.",
  "m-medintro evidence code -> observed (it shows in every run).",
  "Added rules R22 to R26 and 14 stage 3 experiments; low blood pressure and no-birth-control options upgraded to observed."
 ],
 "stillUnverified": [
  "All product facts outside the six products the quiz returns (p7 to p34): prices and strengths come from help-centre articles, third-party reviews or search summaries, not from opened product pages.",
  "What happens after the email wall: dermatologist decisions, final checkout prices and discounts.",
  "URL variants (problends, ot, s_p, upgrade, consult) were read in code only.",
  "Options never replayed (read in code only): most health conditions other than heart, medicines yes, allergies yes, other symptom types, duration answers, the accept answer on the risk screen. Code says none changes the product.",
  "How the split test is assigned (share of visitors in each arm)."
 ],
 "verdict": ("The core finding holds up well. Every high-impact rule re-tested live (stops, product family by sex and age band, card swap by method, "
   "topical-only skipping the blood-pressure questions, medical answers never changing the plan) reproduced exactly, and the served code agrees. "
   "The one real error was the account wall: it is a split test, and in one arm it comes before the recommendation is shown. Facts about the six "
   "products the quiz returns are reliable (live API data). Facts about the rest of the catalogue are weaker: they rest on help-centre text, "
   "third-party reviews and search summaries because the marketing site's robots.txt bars this agent, and one stage 2 price was out of date. "
   "Treat the engine logic as high confidence and the wider catalogue prices as rough.")
}
c['limitations'].append("Stage 3 checked non-quiz products only through web-search summaries; prices there may be promotional and change often.")
c['sources'].append({"title":"Happy Head SuperCapsule finasteride landing page (via web search)","url":"https://happyhead.com/lp/supercapsule/dy82zh"})
c['sources'].append({"title":"Happy Head SuperCapsule finasteride product page (via web search, not opened)","url":"https://www.happyhead.com/products/supercapsule-finasteride-minoxidil-vitamin-d3"})

# proof check
import re
for r in c['rules']:
    for m in re.findall(r'runs/[\w./-]+', r['proof']):
        p = m.rstrip('.,;)').split(' ')[0]
        if not os.path.exists(p.split('(')[0].rstrip('/')) and not os.path.exists(os.path.dirname(p)): print('MISSING', r['id'], p)
for x in c['experiments']:
    if x.get('run') and not os.path.exists(x['run']): print('MISSING exp', x['id'], x['run'])
json.dump(c, open('company.json','w'), indent=1, ensure_ascii=False)
print('ok', len(c['rules']), len(c['experiments']))
