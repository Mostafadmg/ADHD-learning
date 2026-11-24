# Stage 2: recommendations, product rules and the written summaries.
REC = [
 ("Baseline man: 18-65, temples and crown, gradual, no allergies, no scalp symptoms, no cautions, no medical history, main link", ['p-kit-pro','p-kit','p-combo-kit','p-finasteride','p-triple-spray','p-minoxidil-spray','p-regaine','p-rosemary-oil'], 'p-kit-pro', "Featured 'Most effective': Hair Kit - Medicated Spray, Finasteride & Supplement £26.67 a month (quarterly variant, first-order code). Others: two-part kit £22.67, combination kit £26.67, Finasteride £16.80, Triple-Action £22.67, Extra Strength Spray £18.00, Regaine £51.67, Rosemary Oil £14.00. Billing: six-monthly pre-selected (£36.00 a month), quarterly £40.00, annual £32.00. Wall: £216.00 − £40.00 = £176.00. Runs x2-00, x2-01.", 'observed'),
 ("Man with minoxidil ruled out: minoxidil allergy, scalp pain/itching, red rinds/rashes, or any blood-pressure diagnosis", ['p-finasteride','p-rosemary-oil'], 'p-finasteride', "Finasteride featured 'Recommended for you' £16.80; Rosemary Oil £14.00. No kit, spray or Regaine. Runs x2-03, x2-04, x2-05, x2-10, x2-30.", 'observed'),
 ("Man with finasteride ruled out: finasteride allergy, 'minoxidil only' mood answer, specialist-managed mental health, or suicidal thoughts in the past year", ['p-minoxidil-spray','p-regaine','p-rosemary-oil'], 'p-minoxidil-spray', "Extra Strength Spray featured 'Recommended for you' £18.00; Regaine £51.67; Rosemary Oil £14.00. Runs x2-02, x2-13, x2-15, x2-16.", 'observed'),
 ("Man with both drugs ruled out (for example a finasteride allergy plus a blood-pressure diagnosis)", ['p-rosemary-oil'], 'p-rosemary-oil', "Rosemary Oil only, badged 'Most effective'. No stop screen. Seen in the mapping walk runs/s2-men-explore; the specific pairs were not replayed.", 'observed'),
 ("Man with flag-only answers: psoriasis/eczema, dandruff (either answer), PSA, asthma or baby opt-outs, lactose 'none', body hair loss, depression managed by the GP, dose change, other pattern, 65+, any 'most important' answer, 'I have' a medical history", ['p-kit-pro','p-kit','p-combo-kit','p-finasteride','p-triple-spray','p-minoxidil-spray','p-regaine','p-rosemary-oil'], 'p-kit-pro', "Exactly the baseline offer; the answers only reach the clinician after checkout.", 'observed'),
 ("Man entering through /subscribe/hair-loss/regaine", ['p-kit-pro','p-kit','p-combo-kit','p-finasteride','p-triple-spray','p-minoxidil-spray','p-regaine','p-rosemary-oil'], 'p-regaine', "Regaine featured 'Recommended for you'. With a minoxidil allergy it is STILL featured (badge 'Most effective', £65.00 with no code), with Finasteride £28.00 and Rosemary Oil £23.33. Runs entry-regaine-baseline, x2-20.", 'observed'),
 ("Man entering through /subscribe/hair-loss/finasteride with a finasteride allergy", ['p-finasteride','p-minoxidil-spray','p-regaine','p-rosemary-oil'], 'p-finasteride', "Finasteride STILL featured ('Most effective', £28.00); Extra Strength Spray £30.00, Regaine £65.00, Rosemary Oil £23.33. Run x2-21.", 'observed'),
 ("Man under 18, patchy or complete loss, sudden onset, or 65+ who answers No", [], None, "Stop screen 'No suitable treatment' with a GP message and the clinic email; 'Review your answers' lets him change the answer and carry on (x2-32). Runs stop-under18, x2-25, x2-26.", 'observed'),
 ("Woman", ['p-rosemary-oil','p-hair-support'], 'p-rosemary-oil', "No women's consultation. The only hair-loss consultation requires 'assigned male at birth'. A woman can only buy the cosmetic oil or the supplement directly (stage 1).", 'docs'),
]
PW = {
 'p-kit-pro': "Featured 'Most effective' whenever neither drug is ruled out and the patient came in through the main link (x2-01 and every flag-only run). Hidden if either drug is ruled out (x2-02, x2-03).",
 'p-kit': "Listed under 'See all treatments' when neither drug is ruled out; hidden if either is (x2-02, x2-03). Never seen featured.",
 'p-combo-kit': "Listed under 'See all treatments' when neither drug is ruled out; hidden if either is (x2-02, x2-03).",
 'p-finasteride': "Listed when finasteride is not ruled out. Featured 'Recommended for you' (£16.80) when minoxidil is ruled out: minoxidil allergy, scalp pain/itching, red rinds/rashes or a blood-pressure diagnosis (x2-03, x2-04, x2-05, x2-10). Stays featured on the finasteride entry link even with a finasteride allergy (x2-21).",
 'p-triple-spray': "Listed when neither drug is ruled out; hidden if either is (x2-02, x2-03).",
 'p-minoxidil-spray': "Listed when minoxidil is not ruled out. Featured 'Recommended for you' (£18.00) when finasteride is ruled out: finasteride allergy, 'minoxidil only', specialist mental-health care, or suicidal thoughts (x2-02, x2-13, x2-15, x2-16).",
 'p-regaine': "Listed when minoxidil is not ruled out; featured when the patient enters through the Regaine link, and still featured there even with a minoxidil allergy (x2-20).",
 'p-rosemary-oil': "Always listed, whatever the answers; the only product left when both drugs are ruled out (runs/s2-men-explore). Also sold directly with no questions.",
 'p-hair-support': "Never chosen by the consultation: inside two kits, offered as an add-on after billing, or bought directly with no questions.",
}
ENGINE = ("Numan's engine is simple. The server serves one question at a time and a few answers stop the consultation (under 18, patchy or complete loss, sudden onset, 65+ saying No), but every stop has a 'Review your answers' button that lets the patient change the answer and carry on. "
 "After each answer the server works out two yes/no flags, finasteride allowed and minoxidil allowed, plus an allergy list. The product screen hides every product containing a drug that is not allowed and features one product: the three-part kit by default, the product in the entry link if there was one, or the first product left (Finasteride or Extra Strength Spray). "
 "Live tests show only seven answers move a flag: either drug allergy, scalp pain/itching, red rinds/rashes, any blood-pressure diagnosis (minoxidil off), and 'minoxidil only', specialist-managed mental health or recent suicidal thoughts (finasteride off). "
 "Everything else, including psoriasis/eczema and the patient's own 'I do not wish to be considered' answers for prostate monitoring, asthma and trying for a baby, changes nothing on screen: it only becomes a note for the clinician who reviews the order after payment details are taken. Pattern, age over 65 and preferences never change the offer. There is no dose or strength choice in the quiz: each product has one strength.")
STR = [
 "Fast and low friction: 8 questions for a straightforward man, the full offer and every price before any sign-in.",
 "A clear, tested safety filter for the two drugs: allergies, scalp inflammation and blood pressure remove minoxidil, and mood risk removes finasteride, on screen and before checkout (x2 runs).",
 "Targeted follow-ups: each caution opens its own short explanation and choice instead of a long form; specialist-managed patients skip irrelevant questions.",
 "Detailed written clinician instructions sit behind every risky answer (in the served data), so the human review has a playbook.",
 "Always leaves something to buy (Rosemary Oil), and the money-back guarantee and kit discounts are visible throughout.",
]
WEAK = [
 "Patient opt-outs are ignored on screen: 'I do not wish to be considered for finasteride' (prostate monitoring, trying for a baby) and 'not topical' (asthma, dandruff) leave those products on offer and the finasteride kit featured (x2-09, x2-11, x2-12, x2-07).",
 "Psoriasis/eczema on the scalp does not remove minoxidil, although Numan's own clinician note says minoxidil is not suitable with an active scalp condition (x2-08); pain/itching and red rinds do remove it.",
 "Product links bypass the safety filter: the entry product stays featured even with an allergy to its drug (x2-20 Regaine with minoxidil allergy, x2-21 Finasteride with finasteride allergy).",
 "Stops are soft: 'Review your answers' lets anyone change a stopping answer and continue in the same draft (x2-32).",
 "Suicidal thoughts in the past year give no stop or signposting screen; the man is simply moved to minoxidil products (x2-16). A recent mental-health dose change skips the suicidal-thoughts question altogether (x2-17).",
 "Ticking blood pressure removes minoxidil even when the man says he understands and wants it (x2-30): blunt for well-controlled hypertension on topical minoxidil.",
 "Thin history: no exact age, duration, family history, previous treatments or side effects, sexual side-effect history, or treatment preference (tablet vs topical); lactose 'none' does not remove the tablets (x2-18).",
 "Men only: no women's consultation at all; the only consultation requires 'assigned male at birth'.",
]
OPP = [
 "Serve women: a female pattern hair-loss consultation (topical and oral minoxidil, spironolactone pathways) is entirely missing at Numan.",
 "Honour patient choices at once: if someone opts out of a drug or a form, show only what they asked for, and explain why.",
 "Offer strength and form choices (oral minoxidil, topical finasteride, different minoxidil strengths); Numan's quiz has none.",
 "Collect a fuller history (duration, family history, previous treatment and side effects, sexual function, photos) and use it to personalise and to set expectations.",
 "Stronger mental-health safety: a crisis signposting screen for recent suicidal thoughts and asking it regardless of dose changes.",
 "Close the entry-link gap and lock stop screens for the session, then advertise the stricter safety as a trust point.",
]
LIM = [
 "Nothing after the account wall was tested: payment, identity check, clinician follow-up and what is finally prescribed are known only from public pages and the served clinician notes.",
 "The flags are computed on Numan's server. Rules were found by one-change replays (33 in stage 2), not read from code; untested options are marked 'inferred'.",
 "Not replayed one at a time: pattern Temples and Moderate, 'Complete' and 65+ 'No' stops (served results say stop), asthma and baby 'would like to be considered' answers, lactose 'small amounts', 'All of the above', GP 'Yes' (GP email screen), the minoxidil entry link, and pairs of rules (for example finasteride allergy plus blood pressure). Their effects come from the served definition or from the tested opposite answer.",
 "Experiments stopped at the product screen; plan and price after it were checked only for the baseline (x2-00). Prices on product links are without the first-order code.",
 "Prices were read on 23 Nov 2026 with the code the site's own links carry; pricing experiments named in the app (hl_6_months_promo, hl_price_per_day, HL_ps_science) may change what others see.",
 "Six-monthly and annual prices for products other than the three-part kit and Regaine are worked out from the API variant data, not seen on a billing screen.",
 "Each replay created one anonymous draft on Numan's side (about 33 in stage 2); none was submitted.",
 "Who compounds the unlicensed sprays is not stated in any public source found.",
]
def apply(c):
    c['recommendations'] = [dict(profile=a, offered=b, default=d, note=n, evidence=e) for a, b, d, n, e in REC]
    for p in c['products']:
        if p['id'] in PW: p['recommendedWhen'] = PW[p['id']]
    c['engineSummary'] = ENGINE; c['strengths'] = STR; c['weaknesses'] = WEAK; c['opportunities'] = OPP; c['limitations'] = LIM
    a = c['access']
    a['coverageNote'] = ("Stage 1 mapped all 29 questions and every option's served result. Stage 2 (23 Nov 2026) replayed the baseline to the account wall and ran 32 one-change replays to the product screen (runs/x2-*), "
      "covering every option that the served data or stage 1 suggested could change the offer: both allergies, lactose, each scalp symptom alone, every caution and its opt-out, the whole mental-health branch, three stops, a stop-bypass, age 65+, three patterns, two preference answers, medical history and two entry links with an allergy. Nothing after the account wall was tried. No contact details were entered anywhere.")
    for r in c['rules']:
        if r['id'] == 'R3' and r['evidence'] == 'code': pass
