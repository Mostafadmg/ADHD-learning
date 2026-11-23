# Builds company.json for Happy Head (stage 1 MAP). Run: python3 -I tools/build-company.py
import json, os
base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FORM = "https://www.form.happyhead.com/get-started/?l=false&ph=true"
HC = "https://happyhead.zendesk.com/hc/en-us/articles/"
RX = "US prescription, compounded by a pharmacy (Chemistry Rx named in the site's own data); compounded products are not FDA-approved as finished medicines"
RXDOC = "US prescription, compounded (not FDA-approved as a finished medicine)"
T10 = "Top10.com review dated 6 Aug 2025 ('starting at' price, likely a first-order or multi-month price)"
NCOA = "NCOA review published 23 Sep 2026"

def P(id, name, cat, actives, form, aud, legal, price, detail, url, when, ev):
    return dict(id=id, name=name, category=cat, actives=[dict(name=a, strength=s) for a, s in actives], form=form, audience=aud,
                legalStatus=legal, price=price, priceDetail=detail, url=url, recommendedWhen=when, evidence=ev)

products = [
 P("p1", "Topical Dutasteride & Minoxidil (Max Strength) — 'TopicalRx Solution' (formula code TD9)", "rx-topical-compounded",
   [("dutasteride", "0.3%"), ("minoxidil", "8%"), ("retinoic acid (tretinoin)", "0.001%"), ("hydrocortisone", "1%")],
   "solution with dropper, 50 ml per 25-day supply, 1 ml twice daily", "both", RX,
   "$89 per 25-day supply (subscription or one-time)",
   "3 bottles $267 every 75 days; 5 bottles $445 every 125 days (no multi-bottle discount in the API data). Site advertises 'up to 60% off' the first order and a free dermaroller. Refills on the prescription record: 16 (1-bottle), 5 (3-bottle), 3 (5-bottle).",
   "https://www.happyhead.com/products/topical-solution-dutasteride-minoxidil",
   "Offered to men (observed) and, by the code, to women who pick 'Female 50 or older', when the method answer is 'Topical' or 'not sure'. Shown as the 'CHOOSE TOPICAL' card.", "observed"),
 P("p2", "SuperCapsule: Dutasteride, Minoxidil & Vitamin D3 (formula code SC2)", "rx-oral-compounded",
   [("dutasteride", "0.5 mg"), ("minoxidil", "1.25 mg"), ("vitamin D3", "2,000 IU")],
   "capsule, one a day, 25 per supply", "both", RX,
   "$89 per 25-day supply (subscription or one-time)",
   "3 bottles $267 every 75 days; 5 bottles $445 every 125 days. NCOA (Sep 2026) quotes $71 a month on subscription or $89 one-time.",
   "https://www.happyhead.com/products/supercapsule-dutasteride-minoxidil-vitamin-d3",
   "Returned by the recommendation API for men (observed in the response; shown as its own card only when the method answer is 'Oral', by the code). Always part of the men's Dual Treatment bundle.", "observed"),
 P("p3", "Dual Treatment Plan (men / women 50+): TopicalRx Solution + SuperCapsule, dutasteride & minoxidil", "bundle",
   [("dutasteride", "0.3% topical + 0.5 mg oral"), ("minoxidil", "8% topical + 1.25 mg oral"), ("retinoic acid", "0.001%"), ("hydrocortisone", "1%"), ("vitamin D3", "2,000 IU")],
   "topical solution + daily capsule", "both", RX,
   "$178 per 25-day supply at list price (two $89 items)",
   "The flow's hidden plan page (URL key s_p) lists $178/mo with 10% off 1-month ($160), 15–20% off 3-month ($151 or $142), 25–30% off 5-month ($134 or $125). NCOA (Sep 2026): $142 a month on subscription or $178 one-time.",
   FORM,
   "Default and first card ('FASTEST RESULTS', pre-selected) for every man whatever else he answers; the code puts the bundle first for all users.", "observed"),
 P("p4", "Custom Topical: Minoxidil & Retinoic Acid (formula code TM3)", "rx-topical-compounded",
   [("minoxidil", "6%"), ("retinoic acid (tretinoin)", "0.01%"), ("hydrocortisone", "1%")],
   "solution with dropper, 50 ml per 25-day supply, 1 ml twice daily", "women", RX,
   "$59 per 25-day supply (subscription or one-time)",
   "3 bottles $177 every 75 days; 5 bottles $295 every 125 days. Top10 (Aug 2025) lists 'Topical Solution: Minoxidil & Retinoic Acid' from $24.",
   FORM,
   "Offered to women who pick 'Female under 50' (no finasteride, dutasteride or spironolactone in the topical). Shown as the 'CHOOSE TOPICAL' card.", "observed"),
 P("p5", "SuperCapsule: Spironolactone, Minoxidil & Vitamin D3 (formula code SC3)", "rx-oral-compounded",
   [("spironolactone", "25 mg"), ("minoxidil", "1.25 mg"), ("vitamin D3", "2,000 IU")],
   "capsule, one a day, 25 per supply", "women", RX,
   "$89 per 25-day supply (subscription or one-time)",
   "3 bottles $267 every 75 days; 5 bottles $445 every 125 days. Top10 (Aug 2025): from $36.",
   FORM,
   "Returned by the recommendation API for women under 50 (observed); its own card only when the method answer is 'Oral' (code). Part of the women-under-50 Dual Treatment bundle.", "observed"),
 P("p6", "Dual Treatment Plan (women under 50): Custom Topical minoxidil + SuperCapsule spironolactone & minoxidil", "bundle",
   [("minoxidil", "6% topical + 1.25 mg oral"), ("spironolactone", "25 mg oral"), ("retinoic acid", "0.01%"), ("hydrocortisone", "1%"), ("vitamin D3", "2,000 IU")],
   "topical solution + daily capsule", "women", RX,
   "$148 per 25-day supply at list price ($59 + $89)",
   "Hidden plan page: $148/mo list; 1-month $133, 3-month $126 or $118, 5-month $111 or $104. NCOA (Sep 2026): $118 a month on subscription or $148 one-time.",
   FORM,
   "Default and first card for every woman who picks 'Female under 50'.", "observed"),
 P("p7", "SuperCapsule: Finasteride, Minoxidil & Vitamin D3", "rx-oral-compounded",
   [("finasteride", "1 mg"), ("minoxidil", "1.25 mg"), ("vitamin D3", "2,000 IU")], "capsule, one a day", "both", RXDOC,
   "$29 first month then $59 a month (finvsfin.com, updated 2 Oct 2025)", "Top10 (Aug 2025): from $32. Strengths are from finvsfin.com, not from Happy Head's own pages.",
   "https://www.happyhead.com/products/supercapsule-finasteride-minoxidil-vitamin-d3",
   "Not offered by the standard assessment (which always leads with dutasteride for men). Reached from its product page (product-specific consult). Exact trigger unknown.", "docs"),
 P("p8", "SuperCapsule + ED Performance", "rx-oral-compounded",
   [("dutasteride", "0.5 mg"), ("tadalafil", "5 mg"), ("vitamin D3", "2,000 IU")], "capsule, one a day", "men", RXDOC,
   "unknown", "Top10 (Aug 2025) lists a 'SuperCapsule: Finasteride & Tadalafil (ED Performance)' from $36; the help centre (updated about Aug 2026) describes dutasteride + tadalafil. The two sources disagree on the 5-alpha-reductase drug.",
   HC + "21018342179863-How-do-I-know-if-the-SuperCapsule-ED-Performance-is-right-for-me",
   "Not offered by the standard assessment. Product-page entry only (unknown trigger).", "docs"),
 P("p9", "Topical Solution: Finasteride & Minoxidil (custom)", "rx-topical-compounded",
   [("finasteride", "0.3% (third-party figure)"), ("minoxidil", "6% (third-party figure)"), ("hydrocortisone", "1% (third-party figure)")], "solution with dropper", "both", RXDOC,
   "from $35 a month (" + T10 + ")", "Strengths come from Top10 and Perfect Hair Health, not from Happy Head's own pages; the formula is customisable.",
   "https://www.happyhead.com/products/topical-solution-finasteride-minoxidil",
   "Not offered by the standard assessment. Men of any age and women over 50 (company FAQ wording seen in search results). Product-page entry.", "docs"),
 P("p10", "Topical Solution: Finasteride, Dutasteride & Minoxidil (Advanced Formula)", "rx-topical-compounded",
   [("finasteride", "unknown"), ("dutasteride", "unknown"), ("minoxidil", "unknown")], "solution", "both", RXDOC,
   "from $48 a month (" + T10 + ")", "", "https://www.happyhead.com/products", "unknown", "docs"),
 P("p11", "Topical Finasteride & Minoxidil (Aqueous Formula)", "rx-topical-compounded",
   [("finasteride", "unknown"), ("minoxidil", "unknown")], "water-based solution (contains some alcohol)", "both", RXDOC,
   "from $48 a month (" + T10 + ")", "Not customisable (help centre).", HC + "17624946350743-Which-of-your-hair-growth-solutions-are-customizable", "unknown", "docs"),
 P("p12", "Topical Latanoprost, Finasteride & Minoxidil", "rx-topical-compounded",
   [("latanoprost", "unknown"), ("finasteride", "unknown"), ("minoxidil", "unknown")], "solution", "both", RXDOC,
   "from $60 a month (" + T10 + ")", "Not customisable (help centre).", HC + "17624946350743-Which-of-your-hair-growth-solutions-are-customizable", "unknown", "docs"),
 P("p13", "Topical SuperSolution: Finasteride, Minoxidil (Liposomal Formula)", "rx-topical-compounded",
   [("finasteride", "unknown"), ("minoxidil", "unknown")], "liposomal base, slow release", "both", RXDOC,
   "from $39 a month (" + T10 + ")", "Not customisable (help centre).", "https://www.happyhead.com/products/topical-supersolution-finasteride-minoxidil-and-liposomal", "unknown", "docs"),
 P("p14", "TopicalRx Solution: Spironolactone & Minoxidil (women under 50)", "rx-topical-compounded",
   [("spironolactone", "0.5%"), ("minoxidil", "6%"), ("retinoic acid", "figure unclear (NCOA prints 1%)"), ("hydrocortisone", "1%")], "solution", "women", RXDOC,
   "$63 a month on subscription or $79 one-time (" + NCOA + ")", "Top10 (Aug 2025): from $32. Strengths are NCOA's; its retinoic acid figure looks like a misprint.",
   "https://www.happyhead.com/products", "Not offered by the standard assessment, which gives women under 50 a minoxidil-only topical (p4). Company FAQ: 'We offer Topical Spironolactone for women of childbearing age.'", "docs"),
 P("p15", "Topical Solution: Dutasteride & Minoxidil (Bryan's Formula)", "rx-topical-compounded",
   [("dutasteride", "unknown"), ("minoxidil", "unknown")], "solution", "both", RXDOC, "from $58 a month (" + T10 + ")", "", "https://www.happyhead.com/products", "unknown", "docs"),
 P("p16", "TopicalRx Advanced ProBlend (10-in-1)", "rx-topical-compounded",
   [("minoxidil", "8%"), ("cetirizine HCl", "1%"), ("dutasteride", "0.25%"), ("finasteride", "0.25%"), ("biotin", "0.2%"), ("caffeine", "0.2%"), ("latanoprost", "0.005%"), ("tretinoin", "0.001%"), ("vitamin D3", "1,000 IU/mL"), ("melatonin", "strength not stated")],
   "serum, once daily", "both", RXDOC, "$79 a month on subscription or $99 one-time (" + NCOA + ")",
   "For men 18+ and women 50+. Not customisable. Melatonin is named for the ProBlend family; the help article lists nine strengths.",
   HC + "32006248028439-What-is-Topical-Rx-Advanced-ProBlend", "Offered through the ProBlends version of the assessment (URL key rec=problends) or its product page; not in the standard assessment.", "docs"),
 P("p17", "TopicalRx SuperSolution ProBlend (10-in-1, lipodermal)", "rx-topical-compounded",
   [("minoxidil", "8%"), ("dutasteride", "0.25%"), ("finasteride", "0.25%"), ("cetirizine HCl", "unknown"), ("latanoprost", "unknown"), ("melatonin", "unknown"), ("caffeine", "unknown"), ("tretinoin", "unknown"), ("vitamin D3", "unknown"), ("biotin", "unknown")],
   "cream in a pump, 30 ml, five pumps once daily", "both", RXDOC, "$79 a month on subscription or $99 one-time (" + NCOA + ")",
   "Optional 2.5% ketoconazole add-in (help centre). SKU TOP-DUT-FIN-LIPOD-1 in the quiz code. Not customisable.",
   HC + "32104727861783-What-is-TopicalRx-SuperSolution-ProBlend", "In the ProBlends version of the assessment (rec=problends) this is the topical card for men and women 50+ (code); women under 50 still get p4.", "code"),
 P("p18", "Oral Medication: Finasteride", "rx-oral", [("finasteride", "unknown")], "tablet or capsule", "both", "US prescription (whether a licensed generic or compounded is unknown)", "from $24 a month (" + T10 + ")", "", "https://www.happyhead.com/collections/finasteride", "unknown", "docs"),
 P("p19", "Oral Medication: Minoxidil", "rx-oral", [("minoxidil", "unknown")], "tablet or capsule", "both", "US prescription, off-label for hair loss (licensed generic or compounded: unknown)", "from $22 a month (" + T10 + ")", "", "https://www.happyhead.com/collections/minoxidil", "unknown", "docs"),
 P("p20", "Oral Medication: Dutasteride", "rx-oral", [("dutasteride", "unknown")], "capsule", "both", "US prescription, off-label for hair loss (licensed generic or compounded: unknown)", "from $59 a month (" + T10 + ")", "", "https://www.happyhead.com/collections/dutasteride", "unknown", "docs"),
 P("p21", "Oral Medication: Spironolactone", "rx-oral", [("spironolactone", "unknown")], "tablet or capsule", "women", "US prescription, off-label for hair loss (licensed generic or compounded: unknown)", "from $49 a month (" + T10 + ")", "", "https://www.happyhead.com/products", "unknown", "docs"),
 P("p22", "TopicalRx Copper Peptide Formula (GHK-Cu)", "rx-topical-compounded", [("GHK-Cu (copper tripeptide-1)", "0.5%"), ("rosemary leaf oil", "not stated")], "scalp solution", "both", RXDOC,
   "unknown", "Add-on product id 6127095 in the quiz code.", HC + "42614001770903-TopicalRx-Copper-Peptide-Formula-GHK-Cu",
   "Upsell inside the topical card when the assessment URL has upgrade=cp ('Complete Your Scalp Routine').", "code"),
 P("p23", "TopicalRx Dandruff Solution", "rx-topical-compounded", [("clobetasol", "0.05%"), ("ketoconazole", "2.5%")], "topical solution", "both", RXDOC, "unknown",
   "Scalp product, not a hair-loss product; listed because the same quiz has a dandruff wording set.", HC + "35813909022103-TopicalRx-Dandruff-Solution-Clobetasol-Ketoconazole-by-Happy-Head",
   "Product-specific consult only: the quiz switches to dandruff wording when the URL has consult=true and one of four dandruff product ids.", "code"),
 P("p24", "TopicalRx Beard Formula", "rx-topical-compounded", [("minoxidil", "8%"), ("cetirizine HCl", "1%"), ("other actives", "not captured")], "once-daily topical", "men", RXDOC, "unknown",
   "Beard product. Not customisable.", HC + "35817027675287-Topical-Rx-Beard-Formula-An-In-Depth-Guide", "Product-page entry only.", "docs"),
 P("p25", "Scalp Dermaroller", "device", [], "micro-needle roller", "both", "non-prescription device", "unknown ('$30 off' when added to the topical card)",
   "Add-on product id 499008. 'FREE Dermaroller with any Rx subscription' in the Black Friday banner seen on 23 Nov 2026.", HC + "31044488677655-What-non-prescription-products-does-Happy-Head-offer",
   "Upsell inside the topical card when the assessment URL has upgrade=derm.", "code"),
 P("p26", "5% Minoxidil Topical Solution, USP (Men's Formula)", "otc-medicine", [("minoxidil", "5%")], "solution", "men", "US OTC", "unknown", "No returns on non-prescription items.", HC + "31044488677655-What-non-prescription-products-does-Happy-Head-offer", "Not part of the assessment; for people who do not want a prescription.", "docs"),
 P("p27", "2% Minoxidil Topical Solution, USP (Women's Formula)", "otc-medicine", [("minoxidil", "2%")], "solution, three 2 oz bottles in the 3-month bundle", "women", "US OTC", "unknown", "", HC + "31044488677655-What-non-prescription-products-does-Happy-Head-offer", "Not part of the assessment.", "docs"),
 P("p28", "Thickening Shampoo & Conditioner", "cosmetic", [("argan oil, biotin, collagen, keratin, saw palmetto", "")], "shampoo and conditioner", "both", "cosmetic", "unknown", "", HC + "31044488677655-What-non-prescription-products-does-Happy-Head-offer", "Not part of the assessment.", "docs"),
 P("p29", "Hair Serum (drug-free)", "cosmetic", [], "topical serum", "both", "cosmetic", "unknown", "", HC + "32542827356695-Happy-Head-Hair-Serum", "Not part of the assessment.", "docs"),
 P("p30", "Anti-Gray Serum", "cosmetic", [], "scalp serum", "both", "cosmetic", "unknown", "", HC + "39893272487447-Happy-Head-Anti-Gray-Serum-Benefits-and-How-to-Use-It", "Not part of the assessment.", "docs"),
 P("p31", "Hair Growth Supplements", "supplement", [("biotin, collagen, keratin, saw palmetto, ashwagandha, probiotics, vitamins A and D", "")], "capsules", "both", "US dietary supplement", "$88 each (text in the quiz's hidden plan page)",
   "Given free on 3- and 5-month plans in one plan-page variant.", HC + "32651800976151-Unlock-Thicker-Healthier-Hair-with-Happy-Head-s-All-in-One-Hair-Growth-Supplement", "Free add-on on longer plans in one plan-page variant (URL key s_p=a1).", "code"),
 P("p32", "Advanced Laser Helmet Hair Growth System", "device", [], "helmet with 204 laser diodes", "both", "device, described by the company as FDA-cleared", "unknown", "", HC + "32625347016087-Everything-You-Need-to-Know-About-the-Advanced-Laser-Helmet-Hair-Growth-System", "Not part of the assessment.", "docs"),
 P("p33", "StrandIQ System DNA Starter Kit", "service", [], "at-home DNA test with reports, a dermatologist consultation and a first month of treatment", "both", "consumer genetic test plus prescription service", "$349 one-time including the first month (" + NCOA + ")",
   "Perfect Hair Health (Oct 2026) quotes $298.", HC + "34706991232151-StrandIQ-System-DNA-Starter-Kit-Unlock-Your-Hair-s-Genetic-Code-for-Personalized-Growth", "A separate way in: buy the kit instead of taking the assessment.", "docs"),
 P("p34", "Ultimate Growth Bundle: Topical Solution + SuperCapsule, finasteride & minoxidil", "bundle", [("finasteride", "unknown"), ("minoxidil", "unknown")], "topical solution + daily capsule", "both", RXDOC, "unknown",
   "Name and link are in the help-centre footer; the page itself was not opened.", "https://www.happyhead.com/products/topical-solution-supercapsule-finasteride-minoxidil", "unknown", "docs"),
]

def O(label, effect, et="none", affects=None, ev="code"):
    return dict(label=label, effect=effect, effectType=et, affects=affects or [], evidence=ev)
qs = []
def Q(id, text, typ, options, purpose, role, branches=False, detail="", shown="always", ev="observed", stage="anonymous"):
    qs.append(dict(id=id, order=len(qs) + 1, stage=stage, text=text, type=typ, options=options, purpose=purpose, engineRole=role,
                   branches=branches, branchDetail=detail, shownWhen=shown, evidence=ev))

NOTSENT = "Saved and sent to analytics only. The code does not send it to the recommendation service."
TOCLIN = "Saved and passed to the dermatologist with the order. Not flagged. No effect on the recommendation."
IMP = "Passed to the dermatologist marked 'important' (isImportant: true in the order payload). The quiz carries on; no stop screen."
CRIT = "Passed to the dermatologist marked 'critical' (isCritical: true in the order payload). The quiz carries on; no stop screen."

Q("m-welcome", "A Custom Hair Growth Plan in 2-3 Minutes — You're a few questions away from a solution with real results, made just for you.", "info",
  [O("GET MY CUSTOM PLAN", "Starts the questions.", "next-question", ev="observed"),
   O("Need help? Talk to a Hair Specialist", "Opens 'How can we contact you?' asking for a phone number for a callback ('Average Callback Time: 1-2 min'). Not used.", "marketing-only", ev="observed")],
  "Welcome screen with a phone-sales alternative.", "marketing", True, "Phone callback path needs a phone number.", "URL has ph=true (the START NOW link does)")
Q("m-goals", "What would you like to improve about your hair? — Understanding your concerns helps us personalize the most effective formula for you. Select all that apply.", "multi",
  [O("I want to regrow a receding hairline", NOTSENT, "marketing-only"), O("I want fuller, healthier-looking hair", NOTSENT, "marketing-only"),
   O("I want to prevent future hair loss", NOTSENT, "marketing-only"), O("I'm just exploring my options", NOTSENT, "marketing-only")],
  "Goal question. It feeds the summary screen and analytics; the old 'how committed' field is sent to the doctor as '-'.", "marketing")
Q("m-duration", "How long have you noticed changes in your hair?", "single",
  [O(x, "Mapped onto the older three-band answer and passed to the dermatologist. No effect on the recommendation.") for x in ["Less than 6 months", "6-12 months", "1-3 years", "More than 3 years", "I’m not sure"]],
  "History for the clinician.", "data-capture")
Q("m-family", "Does hair loss run in your family? — Hair loss is often genetic—and this helps us personalize your treatment.", "single",
  [O("Yes", NOTSENT, "marketing-only"), O("No", NOTSENT, "marketing-only"), O("Not sure", NOTSENT, "marketing-only")],
  "Stated reason: 'understanding family history helps our dermatologists personalize your treatment plan'. In the code it appears only on the summary screen and in analytics, not in the order payload.", "marketing")
Q("m-sexage", "Let’s tailor your treatment to your biology. Which option best describes you?", "single",
  [O("Male", "Recommendation service is called with gender Male and a made-up birth date 51 years ago. Result: dutasteride + minoxidil topical (p1), dutasteride SuperCapsule (p2) and the two together (p3). Heading 'We Recommend Dutasteride + Minoxidil Rx'. No pregnancy-ability questions.", "product-switched", ["p1", "p2", "p3"], "observed"),
   O("Female under 50", "Service called with gender Female and a made-up birth date 19 years ago. Result: minoxidil-only topical (p4), spironolactone SuperCapsule (p5) and the two together (p6). Heading 'We Recommend Minoxidil & Retinoic Acid Rx'. Adds the pregnancy-ability questions. Later date of birth must give an age of 18 to 50 or the user is sent back.", "product-switched", ["p4", "p5", "p6"], "observed"),
   O("Female 50 or older", "Service called with gender Female and a made-up birth date 51 years ago. The page uses the same card set as for men ('male_and_female_over_50'); the heading text is 'Dutasteride + Minoxidil'. The products the service returns were not seen live. Adds the pregnancy-ability questions. Date of birth must give age 50 or more.", "product-switched", ["p1", "p2", "p3"], "code")],
  "The main product selector: sex and the under-50 / 50-plus split for women decide which drug family is offered.", "product-selector", True,
  "Decides the product family; women also get pregnancy questions later.")
Q("m-pattern-male", "Where are you experiencing hair loss? — Select all that apply.", "multi",
  [O("Thinning at the hairline", TOCLIN), O("Bald patches", IMP, "flag-for-clinician"),
   O("Thinning all over", "Stored under the key 'crown' and shown to the dermatologist as 'Thinning at the top of the head'. Not flagged.", "none"),
   O("Another pattern of hair loss", "Adds a free-text question and is passed to the dermatologist marked 'important'.", "extra-questions"),
   O("None, I'm trying to prevent hair loss", "Exclusive option. " + TOCLIN)],
  "Pattern for the clinician; patchy and unusual patterns are flagged as possible non-pattern hair loss.", "diagnosis", True, "'Another pattern' adds a text box.", "sex = male")
Q("m-pattern-female", "Where on your head are you experiencing hair loss? — Select the options that apply to you best.", "multi",
  [O("Thinning at the hairline", TOCLIN), O("Thinning all over", TOCLIN), O("Thinning along my part", TOCLIN), O("Bald patches", IMP, "flag-for-clinician"),
   O("Another pattern of hair loss", "Adds a free-text question and is passed to the dermatologist marked 'important'.", "extra-questions"),
   O("None, I'm trying to prevent hair loss", "Exclusive option. " + TOCLIN)],
  "Pattern for the clinician.", "diagnosis", True, "'Another pattern' adds a text box.", "sex = female")
Q("m-pattern-other", "Please provide more details about your hair loss", "text", [], "Free text for the clinician (placeholder: 'Please describe where you are experiencing hair loss.').", "diagnosis", False, "", "'Another pattern of hair loss' ticked", "code")
Q("m-method", "What’s your preferred method of taking medication?", "single",
  [O("Topical (applied directly to the scalp)", "Service is sent ['Topical']. Cards kept: Dual Treatment and Topical. The capsule-only card is hidden.", "product-removed", ["p2", "p5"]),
   O("Oral (ingested by mouth)", "Service is sent ['Oral']. Cards kept: Dual Treatment and SuperCapsule. The topical-only card is hidden.", "product-removed", ["p1", "p4"]),
   O("I’m not sure / I don’t have a preference", "Service is sent ['Oral','Topical']. Cards shown: Dual Treatment (first, pre-selected) and Topical. The capsule-only card is not shown.", "product-removed", ["p2", "p5"], "observed")],
  "Chooses which single-product card sits next to the bundle. The bundle is always shown first and pre-selected, even for people who say 'Topical' or 'Oral'.", "product-selector", True, "Changes the cards on the recommendation screen.", "not a product-specific consult")
Q("m-summary", "Here’s what we know about you so far (YOUR HAIR: goal, duration, pattern, method · LIFESTYLE: sex/age, family history)", "info",
  [O("TAKE ME TO MY PLAN", "Goes to four 3-second 'Building Your Personalized Treatment Plan' loading screens, then the recommendation.", "next-question", ev="observed")],
  "Plays the answers back before the recommendation.", "expectation-setting")
Q("m-loading", "Building Your Personalized Treatment Plan — Our dermatologists use clinically backed ingredients to help target hair loss from multiple angles (then 'Reviewing Your Responses...', 'Matching Ingredients to Your Goals...')", "info", [],
  "Timed loading screens naming finasteride, minoxidil and dutasteride while the recommendation call runs.", "marketing")
Q("m-reco", "We Recommend {Dutasteride + Minoxidil Rx | Minoxidil & Retinoic Acid Rx} — Dual Treatment delivers the best chance of regrowth.", "single",
  [O("CHOOSE DUAL TREATMENT", "Selects topical + SuperCapsule (two product ids). Adds three questions later: last doctor check-up, blood pressure, weight.", "extra-questions", ["p3", "p6"], "observed"),
   O("CHOOSE TOPICAL", "Selects the topical only. The three blood-pressure-related questions are skipped.", "skip-questions", ["p1", "p4"]),
   O("CHOOSE SUPERCAPSULE", "Card shown only after the 'Oral' method answer. Selects the capsule only and adds the three blood-pressure-related questions.", "extra-questions", ["p2", "p5"])],
  "The product choice. Made before any medical question is asked. No price is shown on this screen.", "product-selector", True,
  "Any plan with a capsule adds: When did you last see a doctor, blood pressure, weight.")
Q("m-medintro", "Medical Review — Next, we'll ask a few questions about your health history to ensure your treatment is safe and appropriate. Takes 2 min", "info", [], "Three-second intro to the medical questions.", "expectation-setting", ev="code")
Q("m-prior", "Have you previously tried any of the following hair loss treatments?", "multi",
  [O("Topical Minoxidil (Rogaine™)", "Adds the 'reactions' question. " + TOCLIN, "extra-questions"), O("Topical Finasteride", "Adds the 'reactions' question. " + TOCLIN, "extra-questions"),
   O("Oral Minoxidil", "Adds the 'reactions' question. " + TOCLIN, "extra-questions"), O("Oral Finasteride (Propecia/Proscar™)", "Adds the 'reactions' question. " + TOCLIN, "extra-questions"),
   O("Other", "Adds a free-text question and the 'reactions' question; marked 'important' for the dermatologist.", "extra-questions"),
   O("None of the above", "Exclusive option; goes straight on and skips the 'reactions' question.", "skip-questions", ev="observed")],
  "Treatment history. Stated reason: 'Previous treatments can provide important insight into your hair loss journey'.", "personalisation", True, "Anything except 'None' adds the reactions question; 'Other' adds a text box.")
Q("m-prior-other", "Please specify what other hair loss treatments you’ve used", "text", [], "Free text for the clinician.", "personalisation", False, "", "'Other' ticked in previous treatments", "code")
Q("m-reactions", "Did you have any reactions to these treatments?", "single",
  [O("Yes", "Opens a required text box ('Please provide details of any reactions/concerns with prior treatments and let your doctor know if you would like any ingredients decreased or removed from your formula.'). " + CRIT, "flag-for-clinician"),
   O("No", "Goes on.", "next-question")],
  "Side-effect history; the main route by which a formula gets weakened or an ingredient removed.", "safety-screen", True, "'Yes' needs a written explanation.", "any previous treatment ticked", "code")
Q("m-symptoms", "Do you have any of these unusual symptoms that may disqualify you for treatment? — Your honest responses help our dermatologists safely determine the most suitable hair growth formulation for you.", "multi",
  [O("Severe itching, burning, or rash on my scalp", "Adds a required free-text question. " + IMP, "extra-questions"),
   O("Severe pain, pimples, pus, bumps, or sores on my scalp", "Adds a required free-text question. " + IMP, "extra-questions"),
   O("Loss of brows, lashes, facial, or body hair", "Adds a required free-text question. " + IMP, "extra-questions"),
   O("None of the above", "Exclusive option; goes on.", "next-question", ev="observed")],
  "Red-flag screen for scarring, inflammatory or autoimmune hair loss. Despite the word 'disqualify', the quiz itself never stops anyone here.", "safety-screen", True, "Any symptom adds a text box.")
Q("m-symptoms-detail", "Please provide more details about your symptoms.", "text", [], "Placeholder: 'Your doctor will evaluate you symptoms and may disqualify you from treatment. Please describe your symptoms in more detail.'", "safety-screen", False, "", "any unusual symptom ticked", "code")
Q("m-preg-ability", "Do you currently have the ability to become pregnant? — To keep you safe, we avoid ingredients that aren't pregnancy-safe. This helps us tailor your treatment responsibly.", "single",
  [O("Yes", "Adds the birth-control question. " + IMP, "extra-questions", ev="observed"), O("No", "Adds 'Please specify why you cannot become pregnant'.", "extra-questions")],
  "Pregnancy-risk screen for women (asked of women of any age band).", "safety-screen", True, "Yes → birth control; No → reason.", "sex = female")
Q("m-birth-control", "Are you currently using any form of birth control?", "multi",
  [O("Oral contraceptives", TOCLIN, ev="observed"), O("IUD", TOCLIN), O("Condoms", TOCLIN), O("Other birth control method", "Opens a required text box. " + TOCLIN, "extra-questions"),
   O("None of the above", "Exclusive option. " + IMP, "flag-for-clinician")],
  "Contraception check for women who can become pregnant.", "safety-screen", True, "'Other' adds a text box.", "female and able to become pregnant")
Q("m-not-pregnant-why", "Please specify why you cannot become pregnant: — This helps our doctors safely determine if certain medications (e.g., Finasteride, Dutasteride, or Retinoic Acid) are appropriate and medically safe for your specific circumstances.", "single",
  [O("I am post menopausal", TOCLIN), O("I have had a surgical procedure", TOCLIN), O("My partner has had a vasectomy", TOCLIN), O("Other reason", "Opens a required text box. " + TOCLIN, "extra-questions")],
  "Lets the doctor decide whether finasteride, dutasteride or retinoic acid can be used in a woman.", "safety-screen", True, "'Other reason' adds a text box.", "female and not able to become pregnant", "code")
Q("m-household-preg", "Is anyone in your household currently pregnant, breastfeeding, or actively trying to get pregnant? — Some ingredients aren’t recommended during pregnancy to protect both you and your family’s health.", "single",
  [O("Yes", "Adds the 'Finasteride & Dutasteride: Partner Pregnancy Risk' safety screen. " + CRIT, "extra-questions"), O("No", "Goes on.", "next-question", ev="observed")],
  "Pregnancy exposure screen, asked of everyone (for a woman it also covers herself).", "safety-screen", True, "'Yes' adds a risk-acceptance screen.")
Q("m-preg-disclosure", "IMPORTANT SAFETY INFORMATION — Finasteride & Dutasteride: Partner Pregnancy Risk", "consent",
  [O("Yes, I accept these risks and would like to be prescribed Finasteride and/or Dutasteride if considered appropriate by my physician.", IMP, "flag-for-clinician"),
   O("No, I do not accept these risks and do not want to be prescribed Finasteride and/or Dutasteride.", "Passed to the dermatologist marked 'important'. The product already chosen is not changed by the quiz; any switch would be made by the dermatologist (not observed).", "flag-for-clinician")],
  "Risk acceptance. This matches the 'warning, do you want to continue?' screen described by NCOA's tester.", "consent", False, "", "household pregnancy = Yes", "code")
Q("m-meds", "Are you taking any medications?", "single",
  [O("Yes", "Opens a required text box ('It is important that you list the names/doses of all medications, so your doctor can evaluate if there are any concerning interactions with your requested hair loss treatment.'). Not flagged in the payload.", "extra-questions"),
   O("No", "Goes on.", "next-question", ev="observed")],
  "Interaction check, free text only (no drug list).", "safety-screen", True, "'Yes' adds a text box.")
Q("m-allergies", "Do you have any allergies? — Your allergy information ensures we create a formula that's safe and customized for you.", "single",
  [O("Yes", "Opens a required text box ('Please list your medication allergies here.'). Not flagged in the payload.", "extra-questions"), O("No", "Goes on.", "next-question", ev="observed")],
  "Allergy check, free text only.", "safety-screen", True, "'Yes' adds a text box.")
Q("m-last-doctor", "When did you last see a doctor for a check-up?", "single",
  [O(x, TOCLIN, ev=("observed" if x == "Within the last year" else "code")) for x in ["Within the last year", "Within the last 2 years", "Within the last 3-5 years", "Over 5 years ago"]],
  "Asked only when the plan includes a capsule (oral minoxidil).", "safety-screen", False, "", "chosen plan includes a SuperCapsule (or a product-specific consult for a listed oral product id)")
Q("m-bp", "What is your most recent blood pressure reading?", "single",
  [O("Low (Below 100 / 65)", CRIT, "flag-for-clinician"), O("Normal (Around 120 / 80)", TOCLIN, ev="observed"),
   O("Mildly Elevated (Around 140 / 90)", TOCLIN + " (Note: not flagged in the code.)"), O("High (Around 150 / 100)", TOCLIN + " (Note: not flagged in the code.)")],
  "Oral minoxidil lowers blood pressure, so only low blood pressure is marked critical.", "safety-screen", False, "", "chosen plan includes a SuperCapsule")
Q("m-weight", "What is your current weight?", "single",
  [O("<100 pounds (<45kg)", TOCLIN), O("100-200 pounds (45kg - 90kg)", TOCLIN, ev="observed"), O(">200 pounds (>90kg)", TOCLIN)],
  "Dose context for oral treatment.", "safety-screen", False, "", "chosen plan includes a SuperCapsule")
Q("m-conditions", "Have you ever been diagnosed with any of the following health conditions?", "multi",
  [O("None", "Exclusive option; goes on.", "next-question", ev="observed")] +
  [O(x, "Adds a required free-text question about diagnoses and treatments. " + IMP, "extra-questions") for x in [
     "Heart condition (e.g., high/low blood pressure, heart failure, abnormal heart rate/EKG, pericarditis)", "Vascular disease (e.g., stroke, blood clots, uncontrolled lower leg swelling)",
     "Cancer (e.g. prostrate, breast cancer)", "Sexual Dysfunction (e.g. erectile dysfunction, low libido)", "Kidney disease", "Liver disease (e.g. cirrhosis)", "Eye disease (e.g. glaucoma, uveitis)",
     "Endocrine disease (e.g. thyroid disease, pheochromocytoma)", "Mental health conditions (e.g. depression, mood disorders)", "Other medical conditions"]],
  "Medical history. Every condition is treated the same way by the quiz: flagged for the dermatologist, never a stop.", "safety-screen", True, "Any condition adds a text box.")
Q("m-conditions-detail", "Please provide additional details on your diagnoses and treatments — Include whether your condition is well controlled, date of last check-up, and if your PCP or other specialist has given you any restrictions based on your conditions.", "text", [],
  "Free text for the clinician.", "safety-screen", False, "", "any health condition ticked", "code")
Q("m-dob", "What is your date of birth? — We customize your hair growth formula based on your age to ensure the most effective and safe treatment. For example, certain ingredients are specifically tailored for customers over 50.", "date",
  [O("Age 18 or over, matching the age band chosen earlier", "NEXT appears; goes on.", "next-question", ev="observed"),
   O("Under 18", "'You must be over 18' is shown and the NEXT button is hidden. The only hard stop in the quiz.", "hard-stop"),
   O("Woman whose age does not match the band she picked (under 50 vs 50 or older)", "Sent back to the age question with 'There is a discrepancy between your date of birth and the selected age range. Please review it and try again.' Choosing the right band changes the product family.", "product-switched", ["p1", "p2", "p3", "p4", "p5", "p6"])],
  "Real age check (year, month, day pickers). Men of any adult age pass: there is no upper age limit and no check for men aged 18 to 21 or over 65 in the code.", "eligibility-gate", True, "Under 18 is blocked; a woman's age must match her band.")
Q("m-custom", "Do you have any customization requests?", "single",
  [O("Yes, I have a customization request", "Opens a required text box ('Please let us know if you have any adjustments to your formula, such as decreasing or removing certain ingredients from your formula.') and adds the 'anything else' question. " + CRIT, "extra-questions"),
   O("No, let the doctor customize it for me (Recommended)", "Goes to the email page.", "next-question", ev="observed")],
  "Lets the patient ask for a different strength or for an ingredient to be removed or added. This free-text box is how the 'custom' formula is actually set.", "personalisation", True, "'Yes' adds a text box and one more question.")
Q("m-anything-else", "Is there anything else you would like to share with your doctor about hair loss? — Feel free to ask about any medical problems not already discussed or include anything else you would like the doctor to know.", "text", [],
  "Free text (default value 'None'; placeholder: 'If nothing else, please write “none” to confirm.'). Always marked 'important' in the payload.", "data-capture", False, "", "customisation request = Yes", "code")
Q("m-email", "Save Your Answers and Lock in Your Offer (on 23 Nov 2026: 'BLACK FRIDAY SALE — Up to 60% Off — Plus, FREE Dermaroller') — Email · Mobile Number · 'By checking this box you agree to our Terms, Privacy Policy, Drug Safety, Telehealth Consent, and MDI Telehealth Consent.'", "contact", [],
  "THE ACCOUNT WALL. Needs an email, a US mobile number and the consent tick. Submitting posts every answer to Happy Head's backend and redirects to checkout. Not filled in.", "identity")
Q("m-purchase-plan", "Subscribe & save 20% or one time purchase?", "single",
  [O("Subscription & Save 20%", "Uses the subscription product ids ('20% Off every order', 'Free Shipping', 'Plus additional discount on your first order', 'Automatic Refills. Cancel Anytime.').", "none"),
   O("One-Time Purchase", "Switches to the one-time product ids ('Standard pricing. No automatic refills.').", "none")],
  "Subscription or single purchase. Only shown in a test variant.", "product-selector", False, "", "URL has ot=var1", "code", "checkout")
Q("m-plan-length", "BLACK FRIDAY DEALS — Lock in lifetime discounts this Black Friday, including FREE gifts on select plans.", "single",
  [O("1-Month Plan (10% off: $80/mo single product, $160/mo bundle; women under 50 $53 or $133)", "Sets the billing period.", "none"),
   O("3-Month Plan (15% off + free supplements, or 20% off: $76 or $71 single, $151 or $142 bundle; women under 50 $47, $126 or $118)", "Sets the billing period.", "none"),
   O("5-Month Plan (25% off + free supplements, or 30% off: $67 or $62 single, $134 or $125 bundle; women under 50 $41, $111 or $104)", "Sets the billing period.", "none")],
  "Plan-length page that exists in the code for two price tests. Not shown in the standard walk.", "product-selector", False, "", "URL has s_p=a1 or s_p=b1", "code", "checkout")
Q("m-thanks", "you're all done — Proceeding to Secure Checkout — Our dermatologists will review your profile to ensure your treatment is right for you.", "info", [],
  "Redirects to my.happyhead.com/hh-checkout with the chosen product ids. Not reached.", "expectation-setting", False, "", "after the email page", "code", "checkout")
Q("m-photos", "After checkout: upload photos of your hair; in some cases a photo ID and/or a 5-second video", "photo", [],
  "Identity and clinical evidence for the dermatologist (help centre). Sent through the account page, a web form or by text.", "identity", False, "", "after payment", "docs", "after-account")

main_flow = dict(id="main", name="Standard assessment ('Get my custom plan'), men and women, current short version", audience="both", entryUrl=FORM,
  stagesSummary="Welcome → 6 profile questions (goal, duration, family history, sex/age band, pattern, method) → summary → recommendation screen with product choice (no price shown) → 10 to 16 medical questions → email + mobile page (account wall, not passed) → checkout on my.happyhead.com → photos and ID after payment → dermatologist review.",
  questions=qs)

qs = []
Q("l-landing", "Landing page before the questions (three versions in the code: category page, 'bot' page, 'emotional survey' page). The survey version asks: 'How confident do you feel about the way your hair looks?' (Very confident / Kinda confident / I dislike it), 'How long have you been feeling this way?' (Over 6 months / The past few months / Recently), 'Have you tried a customized prescription hair growth treatment?' (Yes, I have / I’ve researched but haven’t tried / No, I'd like to learn more)", "info", [],
  "Marketing landing pages; the three survey answers only fire analytics events.", "marketing", False, "", "URL without l=false (survey version: lpvar=top3)", "code")
Q("l-sex", "To start, what was your sex assigned at birth?", "single",
  [O("Male", "Men's products (dutasteride family). Skips the age-band question.", "product-switched", ["p1", "p2", "p3"]), O("Female", "Adds the age-range question.", "extra-questions")],
  "Sex, asked first in the older question set.", "product-selector", True, "Female adds the age range.", "URL without l=false", "code")
Q("l-age", "What’s your age range? — We customize your hair growth formula based on your age to ensure the most effective and safe treatment. (MORE INFO: 'Women under age 50 are not eligible for Finasteride or Dutasteride. We offer Spironolactone and Minoxidil instead.')", "single",
  [O("18 - 29", "Female under 50: minoxidil topical and spironolactone capsule.", "product-switched", ["p4", "p5", "p6"]), O("30 - 39", "Female under 50: minoxidil topical and spironolactone capsule.", "product-switched", ["p4", "p5", "p6"]),
   O("40 - 49", "Female under 50: minoxidil topical and spironolactone capsule.", "product-switched", ["p4", "p5", "p6"]), O("50+", "Treated like a man for product choice (dutasteride family cards).", "product-switched", ["p1", "p2", "p3"])],
  "Women's age band; the same under-50 / 50-plus rule as the current version, with four bands.", "product-selector", True, "Under 50 vs 50+ switches the drug family.", "female, older question set", "code")
Q("l-duration", "How long have you been experiencing hair loss?", "single", [O(x, TOCLIN) for x in ["Less than 6 months", "6 months to 2 years", "Over 2 years"]], "History for the clinician.", "data-capture", False, "", "older question set", "code")
Q("l-pattern-male", "Where on your head are you experiencing hair loss? — Select the options that apply to you best.", "multi",
  [O("Thinning at the hairline", TOCLIN), O("Bald patches", IMP, "flag-for-clinician"), O("Thinning at the top of the head", TOCLIN), O("Another pattern of hair loss", "Adds a text box; marked 'important'.", "extra-questions"), O("None, I'm trying to prevent hair loss", TOCLIN)],
  "Same as the current version; only the third label differs.", "diagnosis", True, "'Another pattern' adds a text box.", "male, older question set", "code")
Q("l-commit", "How committed are you to hair growth?", "single", [O(x, TOCLIN) for x in ["Just exploring my options", "Committed but not in a rush", "I want results as quickly as possible"]],
  "Sales-intent question; sent to the doctor but not used by the recommendation call.", "marketing", False, "", "older question set", "code")
legacy_flow = dict(id="legacy", name="Older landing-page assessment (same flow file, URL without l=false)", audience="both", entryUrl="https://www.form.happyhead.com/get-started/",
  stagesSummary="Landing page → sex → (women) age range → duration → pattern → commitment → method → recommendation → the same medical questions, date of birth, customisation and email page as the standard assessment. Read from code only; not walked.",
  questions=qs)

qs = []
Q("c-intro", "We'll be asking a few questions for your dermatologist consultation.", "info", [O("NEXT", "Starts the questions.", "next-question")], "Intro for a product-specific consult.", "expectation-setting", False, "", "URL has consult=true", "code")
Q("c-product", "Product already chosen on a product page (passed as pid in the URL)", "info",
  [O("Man arriving with a women-under-50 product id (e.g. the spironolactone SuperCapsule, id 287244)", "The code swaps it for a men's product id (287244 → 230910; 260068 → 110425; 16268 → 14275) and the thank-you page says 'Based on your age and gender, we've tailored your selection to best suit your needs.'", "product-switched", ["p5"]),
   O("Woman under 50 arriving with a men's product id", "The code swaps it for a women-under-50 id (110425 → 68633, the minoxidil topical; 230910 → 287244, the spironolactone SuperCapsule; 15313 and 3131341 → 68633; 287362 → 383783; 14275, 138137, 107497, 14296, 96732 or 94152 → 1330569).", "product-switched", ["p4", "p5"]),
   O("Woman 50 or older arriving with product id 110425", "Swapped to id 68611 (product name not identified).", "product-switched"),
   O("Any other case", "The chosen product id is kept.", "none")],
  "In a product-specific consult the method question and the recommendation screen are skipped; the product is fixed by the page the person came from, then corrected for sex and age.", "product-selector", True,
  "Sex and age can swap the product.", "URL has consult=true", "code")
Q("c-bp-set", "When did you last see a doctor for a check-up? · What is your most recent blood pressure reading? · What is your current weight?", "info", [],
  "The three capsule questions are asked only if the product id is on a list of about 38 ids in the code (oral and dutasteride products).", "safety-screen", False, "", "consult=true and pid on the list", "code")
Q("c-dandruff", "Dandruff wording set: 'How long have you been experiencing dandruff and/or scalp irritation?', 'Where on your head are you experiencing dandruff and/or scalp irritation?' (Scalp (top of head) / Hairline and temples / Back of head / All over / None of the above, I’m looking to maintain a healthier scalp), 'How committed are you to treating your dandruff and/or scalp irritation?'", "info", [],
  "Same quiz reused for the dandruff prescription.", "diagnosis", False, "", "consult=true and pid is one of 5016601, 5016643, 5016669, 5016675", "code")
consult_flow = dict(id="consult", name="Product-specific consult (from a product page's own button)", audience="both", entryUrl="https://www.form.happyhead.com/get-started/?consult=true&pid=<product id>",
  stagesSummary="Intro → sex → (women) age range → duration → pattern → commitment → no method question and no recommendation screen → the same medical questions → date of birth → customisation → email page. Read from code only; the product pages on www.happyhead.com that link here were not opened, so the exact links are not confirmed.",
  questions=qs)

rules = [
 dict(id="R1", flow="main", when="Sex/age answer = 'Male'", then="The recommendation is dutasteride 0.3% + minoxidil 8% topical, the dutasteride 0.5 mg + minoxidil 1.25 mg SuperCapsule, and the two as a bundle (bundle first, pre-selected). Finasteride is never offered by the standard assessment.", effectType="product-switched", affects=["p1", "p2", "p3"], evidence="observed", proof="runs/baseline-men (13.txt and net/18-*produ.json)", confidence="high"),
 dict(id="R2", flow="main", when="Sex/age answer = 'Female under 50'", then="No finasteride or dutasteride. The recommendation is minoxidil 6% topical, the spironolactone 25 mg + minoxidil 1.25 mg SuperCapsule, and the two as a bundle.", effectType="product-switched", affects=["p4", "p5", "p6"], evidence="observed", proof="runs/baseline-women (13.txt and net/17-*produ.json)", confidence="high"),
 dict(id="R3", flow="main", when="Sex/age answer = 'Female 50 or older'", then="Treated like a man by the page code (same card set, heading 'Dutasteride + Minoxidil'). What the recommendation service returns was not seen live.", effectType="product-switched", affects=["p1", "p2", "p3"], evidence="code", proof="quiz-definition.json: action _a18938682205317825 (getCardsForUser) and computed field recommended_formula_according_sex_and_age; raw/logic-actions.txt", confidence="medium"),
 dict(id="R4", flow="main", when="Method answer = Topical / Oral / Not sure", then="Bundle card always first. Second card is Topical for 'Topical' and 'Not sure', SuperCapsule for 'Oral'.", effectType="product-removed", affects=["p1", "p2", "p4", "p5"], evidence="code", proof="quiz-definition.json: preferenceMethodKeys in action _a18938682205317825; 'Not sure' seen in runs/baseline-men", confidence="high"),
 dict(id="R5", flow="main", when="Only sex, the female age band, the method answer and any product id in the URL are sent to the recommendation service", then="Goal, duration, family history and hair-loss pattern do not change the anonymous recommendation.", effectType="none", affects=[], evidence="observed", proof="runs/baseline-men/network.jsonl and runs/baseline-women/network.jsonl (request body of middleware/product-recommendation) + code", confidence="high"),
 dict(id="R6", flow="main", when="Chosen plan includes a SuperCapsule (bundle or capsule)", then="Three extra questions are asked: last doctor check-up, blood pressure, weight. Topical-only skips them.", effectType="extra-questions", affects=["p2", "p3", "p5", "p6"], evidence="code", proof="quiz-definition.json: computed field consult_and_valid_pid; asked in runs/baseline-men and runs/baseline-women after choosing Dual Treatment", confidence="high"),
 dict(id="R7", flow="main", when="Date of birth gives an age under 18", then="'You must be over 18' and no NEXT button. The only hard stop in the quiz.", effectType="hard-stop", affects=[], evidence="code", proof="quiz-definition.json: page date_of_birth, computed field less_than_18", confidence="high"),
 dict(id="R8", flow="main", when="Woman's date of birth does not match her age band", then="She is sent back to choose the band again, which switches the product family.", effectType="product-switched", affects=["p1", "p2", "p3", "p4", "p5", "p6"], evidence="code", proof="quiz-definition.json: computed field valid_age_range, action a_2178968544", confidence="medium"),
 dict(id="R9", flow="main", when="Answers flagged in the order payload", then="'Critical': reaction to a previous treatment, anyone pregnant/breastfeeding/trying in the household, low blood pressure, a customisation request. 'Important': bald patches, another pattern, other previous treatment, any unusual scalp or body-hair symptom, able to become pregnant, no birth control, either answer on the pregnancy-risk screen, every listed health condition, anything-else text. Nothing else is flagged (medicines, allergies, mildly raised or high blood pressure, weight are not).", effectType="flag-for-clinician", affects=[], evidence="code", proof="quiz-definition.json: action _a7004594546312322 (isImportant / isCritical on each option); copy in raw/backend-payload-code.txt", confidence="high"),
 dict(id="R10", flow="main", when="Any medical answer", then="The quiz never removes or changes the chosen product and never shows a stop screen for a medical answer. All medical decisions are left to the dermatologist after payment.", effectType="flag-for-clinician", affects=[], evidence="code", proof="quiz-definition.json: no page condition or product logic reads a medical answer (see raw/flow-dump.txt page conditions and computed field product_ids)", confidence="medium"),
]
recommendations = [
 dict(profile="Man, 32, hairline + top, 1-3 years, family history yes, no method preference, no medical issues", offered=["p3", "p1"], default="p3", note="Heading 'We Recommend Dutasteride + Minoxidil Rx'. Bundle card badged FASTEST RESULTS and '7/10 Customers Choose This Plan'. The service also returned the SuperCapsule alone (p2) but the page hides that card unless the method answer is Oral. No price on the screen.", evidence="observed"),
 dict(profile="Woman, 38, parting + all over, 1-3 years, able to become pregnant, on the pill, no medical issues", offered=["p6", "p4"], default="p6", note="Heading 'We Recommend Minoxidil & Retinoic Acid Rx'. Active-ingredient panel lists spironolactone first. The service also returned the spironolactone SuperCapsule alone (p5), hidden unless the method answer is Oral.", evidence="observed"),
]
company = dict(
 slug="happy-head", company="Happy Head", market="US", website="https://www.happyhead.com/", parent=None, audiences=["men", "women"],
 model="US dermatologist-founded telehealth company selling custom-compounded prescription hair-loss medicines (topical, oral and combined) on subscription, plus non-prescription hair products.",
 checkedOn="2026-11-23",
 access=dict(
   howTested=["live-walk", "site-code", "public-docs"],
   accountWall="The email + US mobile number + consent tick page, reached after the product choice and after every medical question (about 26 screens in). Shown just before it: 'Do you have any customization requests?'. Submitting it posts the whole questionnaire to api.happyhead.com/middleware/embeddables and redirects to checkout at my.happyhead.com/hh-checkout. Nothing was entered.",
   blockers=[
     "www.happyhead.com/robots.txt (last updated April 2026) says 'Disallow: /' for ClaudeBot, Claude-Web, Claude-User and anthropic-ai. This research was done by Claude, so the marketing site, its product pages, collection pages, FAQ, legal pages and sitemap were NOT fetched. One home-page request went out before robots.txt was read; that copy was deleted unread.",
     "The help centre (happyhead.zendesk.com) is open to all agents in its robots.txt but shows a Cloudflare 'Just a moment' check to curl, to WebFetch and to a bare headless browser. It loads normally in the standard walk.js browser; 24 articles were read that way. No check was solved or worked around."],
   coverageNote="Tested live: the standard assessment on www.form.happyhead.com (its own robots.txt allows all agents) for the baseline man and the baseline woman, both to the email page. Read from code: the full quiz definition (62 pages, all conditions, the recommendation call, the order payload with its clinician flags), served to the anonymous page by engine.embeddables.com. Read from documents: 24 help-centre articles and four independent reviews. Not tested: product pages and prices on www.happyhead.com (closed to this agent), the 'Female 50 or older' and 'Oral' recommendations live, anything after the email page, and what the dermatologist actually does with a flagged answer."),
 products=products, flows=[main_flow, legacy_flow, consult_flow], rules=rules, experiments=[], recommendations=recommendations,
 engineSummary="The quiz itself decides very little. Three things choose the offer: sex, whether a woman is under 50, and topical-or-oral preference. Men (and, by the code, women 50+) are steered to dutasteride + minoxidil; women under 50 to minoxidil topical plus a spironolactone capsule. The topical + capsule bundle is always first and pre-selected. The product is chosen before any medical question. Medical answers never block or change the product on screen: they are tagged 'important' or 'critical' and handed, with a free-text customisation box, to a dermatologist who reviews after payment. The only hard stop is age under 18.",
 strengths=["Very wide compounded range with stated strengths, including dutasteride-first topicals and capsules that most rivals do not lead with.", "Short, friendly front end: six profile questions before a recommendation, with 'why we ask' notes.",
            "Clear sex and age rule for women (no finasteride or dutasteride under 50) built into the first screens.", "A free-text customisation request is built into the consultation, so patients can ask for ingredients to be reduced or removed.",
            "Phone callback offer on the first screen for people who do not want to do the quiz."],
 weaknesses=["The product is chosen before any safety question, and the most intensive option (oral + topical dutasteride and minoxidil) is pre-selected for every man, including someone only 'exploring options'.",
             "No price is shown on the recommendation screen; price appears only after contact details are given.",
             "Hair-loss pattern, duration, goals and family history do not affect the recommendation, although the screens say they 'personalize' it.",
             "The quiz has no automatic stops for red flags (pregnancy in the household, scalp symptoms, heart disease); everything depends on review after payment.",
             "High blood pressure and current medicines are not flagged in the order payload; only low blood pressure is.",
             "The marketing site blocks AI agents in robots.txt, so AI assistants cannot read its product pages for shoppers."],
 opportunities=["Show a real price on the recommendation screen, before asking for an email or phone number.",
                "Use pattern, duration and goals to choose strength and product, so a 'prevention only' or 'exploring' patient is offered a gentler start than the full bundle.",
                "Ask the safety questions before recommending, and screen out or redirect red-flag answers at once rather than after payment.",
                "Offer finasteride as a first-line choice alongside dutasteride, with a plain explanation of the trade-off."],
 sources=[
   dict(title="Quiz definition (Embeddables flow 'Happy Head - Primary Flow - Test', version 141), fetched by the assessment page", url="https://engine.embeddables.com/init (flow_d02099468c5fg664dh31b7cg); saved as quiz-definition.json"),
   dict(title="Standard assessment (walked live)", url=FORM),
   dict(title="robots.txt of the marketing site (blocks Claude agents)", url="https://www.happyhead.com/robots.txt"),
   dict(title="robots.txt of the assessment host (open to all)", url="https://www.form.happyhead.com/robots.txt"),
   dict(title="Help centre: What medications does Happy Head offer?", url=HC + "16254069704983-What-medications-does-Happy-Head-offer"),
   dict(title="Help centre: Which of your hair growth solutions are customizable?", url=HC + "17624946350743-Which-of-your-hair-growth-solutions-are-customizable"),
   dict(title="Help centre: About Happy Head's pricing ($59–$119 a month typical; $24–$119 range)", url=HC + "31042509646871-About-Happy-Head-s-pricing"),
   dict(title="Help centre: What is the ordering process for Happy Head?", url=HC + "4402321888535-What-is-the-ordering-process-for-Happy-Head"),
   dict(title="Help centre: Why do you need my photos? / photo ID", url=HC + "16253781819415-Why-do-you-need-my-photos"),
   dict(title="Help centre: Why Happy Head Asks for Your Age and Gender", url=HC + "31569172936599-Why-Happy-Head-Asks-for-Your-Age-and-Gender"),
   dict(title="Help centre: What non-prescription products does Happy Head offer?", url=HC + "31044488677655-What-non-prescription-products-does-Happy-Head-offer"),
   dict(title="Help centre: What is your return policy?", url=HC + "4402314831383-What-is-your-return-policy"),
   dict(title="Help centre: How can I cancel my subscription?", url=HC + "4402322014359-How-can-I-cancel-my-subscription"),
   dict(title="Help centre: Subscription vs One-Time Orders", url=HC + "17571301347607-Subscription-vs-One-Time-Orders"),
   dict(title="Help centre: Annual Health Check", url=HC + "19957315243159-How-can-I-update-my-health-information-for-my-Annual-Health-Check"),
   dict(title="Help centre: Do you ship internationally? (US only)", url=HC + "17624465131415-Do-you-ship-internationally"),
   dict(title="Help centre: insurance, FSA, HSA", url=HC + "42296905667479-Does-Happy-Head-accept-outside-insurance-FSA-or-HSA"),
   dict(title="NCOA: Happy Head review (23 Sep 2026)", url="https://www.ncoa.org/product-resources/hair-loss/happy-head-review/"),
   dict(title="Top10.com: Happy Head review (6 Aug 2025)", url="https://www.top10.com/hair-loss/reviews/happy-head"),
   dict(title="finvsfin.com: Happy Head SuperCapsule review (updated 2 Oct 2025)", url="https://finvsfin.com/happy-head-super-capsule-reviews/"),
   dict(title="Perfect Hair Health: Happy Head review, 5 concerns (Oct 2026; written by a competitor's affiliate)", url="https://perfecthairhealth.com/happy-head-review/"),
   dict(title="Company FAQ wording on women and topical finasteride, seen only as a search-engine snippet (page not opened)", url="https://happyhead.com/faq"),
 ],
 limitations=[
   "Product pages on www.happyhead.com were not read (robots.txt closes them to this agent). Prices and strengths for products outside the two baseline recommendations come from the help centre and from third-party reviews of different dates, and may be out of date.",
   "Only two patient profiles were walked live. The effect of every other answer is read from code, not seen.",
   "The recommendation service's own rules are on the server. Only its inputs (sex, a made-up birth date from the age band, method, product ids) and two outputs were seen.",
   "Nothing after the email page was seen: checkout prices, discounts, photo upload, identity check, and what the dermatologist changes or refuses.",
   "The flow title contains the word 'Test' and the code holds several price and layout experiments, so screens can differ between visitors and over time.",
   "State-by-state availability in the US was not found."],
)
json.dump(company, open(os.path.join(base, 'company.json'), 'w'), indent=1, ensure_ascii=False)
print('products', len(products), 'questions', sum(len(f['questions']) for f in company['flows']), 'options', sum(len(q['options']) for f in company['flows'] for q in f['questions']), 'rules', len(rules))
