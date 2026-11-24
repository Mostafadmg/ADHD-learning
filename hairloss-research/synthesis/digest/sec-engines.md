# Boots Online Doctor (UK) — digest
Slug: boots-online-doctor · Verified: yes · Audiences: men

Model: High-street pharmacy's online doctor: a men-only questionnaire for licensed finasteride or Propecia tablets (optionally bundled with Regaine foam), reviewed by a clinician, sold as one-off packs with store pick-up or free delivery.
Account wall: After the health questions. Nothing asks for an email before that: after postcode, birth gender and date of birth the site itself creates a placeholder "temporary user" (POST users/temp). The first screen we could not pass is the ID photo step at /camera/id ("Let's confirm it's you": a selfie and a photo of your ID), which comes straight after the last health question. Account set-up (email, name, phone, address, password) is the next task after the photos, then delivery and payment. No recommendation is shown before the wall: the patient has already picked the medicine.
Tested by: live-walk, site-code, public-docs
Coverage: Walked live with the baseline man from the entry page to the ID photo screen for the first-time, tablets-only route (all 19 question screens). The three other routes (first-time bundle, returning tablets, returning bundle) were walked to their first health question, which made the site serve their full question sets; those questions are recorded from the served definitions, not clicked through. All four definitions are saved. No account, email, name, phone, address, password, photo or payment was entered. A postcode had to be typed to start: the placeholder postcode found in the site's own code (N1 0QH) was used; it is a location check, not a contact detail. There is no women's hair-loss consultation to walk. Stage 2: 14 live one-change runs (x00 to x13, runs/x*) confirmed the gates, the product list limits and that no answer changes the product, price or flow on screen. Stage 3 (independent check): 14 more live runs (runs/verify-*) replayed all four baselines, the gates (plus age 18 and Guernsey), the out-of-stock tile, completed the bundle age-50 run, walked the returning bundle route end to end for the first time, tested one amber and one red answer on their own and the Propecia bundle. It found that the order JSON does record a triage label (answer_status), which stage 2 had missed.

Questions: 192 (180 before sign-in; 66 branch). Flows: men-first-tablets (46q), men-first-bundle (49q), men-returning-tablets (47q), men-returning-bundle (50q)

## Engine summary
There is no recommending engine on screen; the website is a gate, a price list and a fixed form. Three hard stops come first and were all seen live: postcode (Jersey and Guernsey refused), birth sex (female refused) and age (under 18 refused; 18 and 75 accepted with no change). The man then says first-time or returning (no proof) and picks medicine, brand and pack himself. First-timers can only pick one-month packs (bigger packs are marked out of stock in the served product list and cannot be clicked); "returning" unlocks all packs. Tablets or bundle, first-time or returning, picks one of four fixed questionnaires; Propecia uses the same one as generic. Follow-ups appear one level deep. Every option carries a plain/amber/red status. The screen ignores it: even nine stacked red flags and three "I will stop my consultation" answers reach the same ID photo screen with the same product and price. But the server does use it: once the answers are posted, the order is labelled "Normal", "Query", "Warning" or "Danger" for the clinician. Asking to drop Regaine does not change the order. All decisions are left to a clinician after ID photos, account and payment.


## Strengths
- Trusted pharmacy brand, CQC-registered provider, named clinical lead, pick-up in any Boots store within about 2 business hours of approval.
- Licensed medicines only; clear safety wording (pregnancy, PSA tests, depression and sexual side effects) repeated as must-acknowledge screens.
- No email needed until after the questions; pay only if approved; no subscription lock-in.
- Bundle questionnaire handles Regaine limits (age 49 licence limit, blood pressure, scalp skin).
- Every gate it does have is immediate and plainly worded (sex, age, postcode), with signposting to a GP or Boots Health Hub.
- Safety follow-ups appear exactly when relevant (pregnancy, suicidal thoughts, blood pressure with Regaine, off-label Regaine over 49), so the clinician gets context in the patient's own answers.


## Weaknesses
- Men only; nothing for women's hair loss.
- Very narrow range: finasteride 1 mg tablets with or without Regaine foam. No topical finasteride, oral minoxidil, dutasteride, compounded sprays, shampoos or supplements.
- The patient must choose medicine and pack before answering anything; no guidance or recommendation.
- No photos of the scalp are asked for; pattern is one four-option question with wording errors ("Tick all that apply" on a single-choice question).
- Red-flag answers do not stop the flow on screen; the patient can go on to ID photos and payment details and only then be refused.
- First-time list showed most packs as "Out of stock"; ID photo step adds friction; dated copy (pages last reviewed 2021 and 2023, placeholder text left in the content data).
- Live tests show the screen never acts on its own red flags: patients who say they will stop, who have patchy or complete hair loss, or suicidal thoughts still reach ID photos, account and payment steps. The server only labels the order ("Danger") for later review.
- Choosing "tablets alone" in the bundle form does not change the basket; the patient still sees the bundle price.
- "Returning" is self-declared with no check, and it unlocks bigger packs that first-timers cannot buy.
- No questions about goals, how much hair loss bothers the patient, preferences (tablet vs topical) or previous non-finasteride treatments; nothing about women, so half of hair-loss patients are turned away.


## Opportunities
- A guided recommendation (pattern, goals, preferences) instead of a price list.
- Options for men who cannot or will not take oral finasteride, and a women's pathway.
- Immediate, kind on-screen outcomes for red-flag answers with signposting, instead of late refusal.
- Scalp photo review and progress tracking; subscription convenience with easy pause.
- Act on red flags at once with a clear "this is not right for you, here is what to do" screen, saving the patient ID photos and sign-up.
- Let the questionnaire change the basket live (e.g. drop Regaine for blood-pressure patients, suggest topical options for men who do not want oral finasteride).
- Offer longer first supplies or a subscription after a proper first review, instead of stock flags.
- Serve women and the "no finasteride" group (topical finasteride, oral or topical minoxidil, combination sprays), which Boots does not sell online.


## Verification verdict
The core picture holds up: Boots Online Doctor has no on-screen recommending engine, men only, three entry gates (sex, age 18+, mainland UK postcode), the patient picks the product, and that pick chooses one of four fixed questionnaires that are saved word for word. Prices and products were all re-checked live and match. One important claim was wrong: answers are not ignored. The server labels each order Normal, Query, Warning or Danger from the option statuses, which is how red flags reach the clinician. With that corrected, the report can be trusted as labelled for everything before the ID photo wall; nothing after the wall (clinician decisions, refusals, switches) is known.


---

# Dr Fox (Doctor Fox) (UK) — digest
Slug: dr-fox · Verified: yes · Audiences: men

Model: Low-cost UK online doctor and pharmacy: a one-page yes/no medical form, the patient picks the product, pay per order with no subscription, a doctor approves before despatch.
Account wall: After the medical form, the 'Choose treatment' page and the 'Confirm order' basket page: pressing 'Confirm order' ('Next: Register/login and pay') opens https://www.doctorfox.co.uk/order/login ('Please login to continue. Create account or login'). The patient sees the full product list and the total price (for example £14.90 for 28 finasteride tablets) before the wall.
Tested by: live-walk, site-code, public-docs
Coverage: The whole medical form (17 questions on one page) is public HTML and was saved and parsed. Stage 2 replayed every question that can change the offer, on both product routes: all 11 stop answers one at a time, the three product-removing answers (Q742, Q743, Q746) on both routes, Q747, Q753 with and without text, one combination, and four baskets to the confirm page to read prices and fees. All three baselines still work (23 Nov 2026). Nothing behind the login page was tested. There is no women’s flow. Stage 3 (independent check, 23 Nov 2026) replayed the three baselines and nine rule tests (all confirmed), re-read the form, order and site code, re-checked all 20 pack prices and the emc licences, and added three new tests: Q743 + Q746, and two runs showing that a second consultation can add finasteride to a basket that already holds the spray.

Questions: 23 (19 before sign-in; 7 branch). Flows: men (23q)

## Engine summary
Dr Fox has no recommendation engine: it is a one-page safety filter in front of a shop shelf. All 17 yes/no questions sit on one public page. Eleven answers are hard stops checked in the browser: the form will not submit, and most messages say the patient can change the answer and continue. One question (Q745, "Do you wish to order the spray?") picks the shelf: the compounded spray alone, or finasteride tablets plus minoxidil products. After submission the server removes products: a finasteride exclusion (Q742 or Q743) takes off generic finasteride, Propecia and the spray; low blood pressure symptoms (Q746) take off Sons, Regaine and the spray. If nothing is left the page says "please cancel this consultation" rather than offering the other family. Heart or blood pressure disease (Q747) only shows a GP message. The patient then ticks up to four packs; nothing is suggested and duplicates (finasteride with Propecia) are allowed. The full price shows before the login wall; a doctor reviews every order after payment. Every rule works per consultation: filling in the form twice can put the spray and finasteride tablets in one basket, even with conflicting answers, and nothing warns before the wall (seen to the confirm page only).


## Strengths
- Prices at or near the floor of the UK market: finasteride £14.90 delivered for 28 tablets (live walk) and the triple-active compounded spray £28.90 delivered for two months, the cheapest spray per month in the UK market sweep (market/uk-sweep.md); no subscription. The same sweep lists five sellers with a lower headline price for finasteride tablets (£6.95 to £9.99 before their own fees and delivery), so "cheapest" is true for the spray but not proven for tablets.
- The full total, including fee and delivery, is shown before any sign-in.
- Clear, specific safety screens that really act: Q742/Q743 remove every finasteride product and Q746 removes every minoxidil product, server-side (observed).
- Very open about unlicensed and off-label supply, with explicit consent and plain warnings (PSA, mood, sexual effects, breast changes, pregnancy handling, 12-month stop rule).
- Fast and simple: one page, about 2 minutes by our estimate, no photos, no account until the basket.


## Weaknesses
- The hard stops are self-correcting: most messages say "You can change your answer and continue", so the form teaches a patient which answer passes.
- No diagnosis step: no age, pattern, Norwood stage, duration or photos. The patient simply declares male pattern hair loss.
- When products are removed on the tablets route, the choose page gives no reason; on the spray route the patient is told to cancel instead of being offered the products that are still safe for them.
- No duplicate-treatment check before the account wall: generic finasteride and Propecia, or Sons and Regaine, can sit in one basket (runs/exp-23).
- Heart disease, high blood pressure and arrhythmia (Q747) do not change the offer of minoxidil; only a GP message shows.
- Q743 lumps five different cautions into one yes/no, and any Yes means "no finasteride from us" rather than a doctor review.
- Men only: no treatment for women at all, not even topical minoxidil.
- Small errors: spray 2 x 60 ml is £48.00 on the product page but £48.50 at checkout; the fee table says "up to £10 = £1" but £10 is charged £2; the message "You should can not take"; a placeholder "spray only message" shows to patients.
- Some published exclusions have no question: difficulty passing urine (finasteride) and fast loss within the last 12 months.
- No oral minoxidil, dutasteride or stronger options, so no step-up for men who do not respond.
- The "no spray with tablets or minoxidil" rule and every exclusion apply only within one consultation: a second consultation can put the spray and finasteride in one basket, even with conflicting answers (low blood pressure symptoms in the second form), with no warning before the account wall (runs/verify-gap-two-consults, verify-gap-two-consults-conflict).
- No question on allergy to minoxidil or tretinoin, although the spray page lists both as reasons not to use it.


## Opportunities
- Women's hair loss: Dr Fox, one of the biggest UK online pharmacies, refuses it outright and sends women to the high street.
- A real step-up path (oral minoxidil, topical finasteride for men who stop tablets because of side effects, dutasteride referral) for men Dr Fox tells to stop at 12 months or turns away after Q743.
- A consultation that explains itself: say why a product is not offered and offer the safe alternative in the same step, instead of "please cancel".
- Diagnosis and progress: photos and a pattern check at the start and at 6 and 12 months, which Dr Fox does not do.
- Price matching is hard (finasteride £14.90 delivered); compete on care, follow-up and women, not on price.


## Verification verdict
This report can be trusted as labelled for everything before the login page. All three baselines and every rule that changes the offer were re-run or re-read and none was contradicted; all 20 pack prices and the licence facts match the live pages and emc. The one real error was the claim that the spray can never be sold with finasteride: within one consultation that is true, but a second consultation puts both in one basket without any warning, even with conflicting answers. That is now recorded as R23 and R24. Two evidence labels were too strong and one strength overstated the price position; both are fixed. What happens after the account wall (identity, age, the doctor's review, whether duplicates or conflicts are caught) remains unknown and is labelled so.


---

# Hair + Me (UK) — digest
Slug: hair-and-me · Verified: yes · Audiences: men, women

Model: Subscription telehealth: one online questionnaire, review by pharmacist independent prescribers, then a personalised compounded hair-loss medicine (scalp drops or a once-a-day capsule) posted every four weeks at one flat price.
Account wall: Step 'yd', 'Personalise your account' (legal first name, legal last name, preferred name), reached by pressing 'Continue to checkout' on the shopping bag. Everything before it works without an account: all medical questions, date of birth, the UK tick and the bag. The site silently creates an anonymous visitor id on arrival (POST /new-user) and saves each answer to it as you go.
Tested by: live-walk, site-code, public-docs
Coverage: Stage 1 mapped both routes to the account wall. Stage 2 ran 47 replays: 2 baseline replays, 39 one-change experiments and 6 group tests of non-medical answers, each compared with a pool of baseline visits because the server varies screens at random. Covered one change at a time: first tile, age (17 years 11 months, 18, 85), pregnancy, three men's and three women's hair-loss pictures, recent onset, scalp infection and eczema, blood pressure (and its follow-up), eight further men's conditions, PCOS and heart disease for women, postpartum, facial hair, two medicine options (antidepressants; Other + free text), minoxidil allergy, finasteride allergy, previous finasteride, drops versus capsules on both routes, declining finasteride / dutasteride, pets, and a second goal. Covered in group tests: gender identity (six options), hair type, styling, lifestyle statements, the other hair-loss pictures and timings, skin tone, scalp condition, six-month wishes, washing, hiding hair loss, hard water, buying stage and 'what influenced you'. Everything after the legal-name screen (account, photos, payment, the prescriber's choice of formula, check-ins) was not tested and is described from public documents only. Stage 3 (verify): 21 more replays (2 baselines, 17 one-change, 2 medical group tests), all one at a time; the stop, blood-pressure, pregnancy, gender-identity, pets, previous-product and promo rules were re-tested live (two goals, no hair loss and the 'Other' free-text boxes were not), and the 16 formulas and the price were re-checked against the live leaflets.

Questions: 98 (86 before sign-in; 24 branch). Flows: men (47q), women (51q)

## Engine summary
Hair + Me's public consultation collects answers; it does not decide anything a visitor can see. Stage 2 replayed it 47 times (2 baseline replays, 39 experiments that changed one answer, and 6 group tests of non-medical answers) and compared every screen and the bag with a pool of baseline visits. Only a handful of answers do anything visible: sex at birth swaps the men's and women's question blocks; an age under 18 is the single hard stop; two or more goals, a blood-pressure diagnosis and 'pregnant, breastfeeding or likely to conceive' each add one screen; 'no hair loss' skips one; pets add a warning and a 'Better for pet owners' badge on The Capsules; previous treatments and 'Other' reveal a tick-box or a text box; and a gender identity other than man removes one marketing screen from the men's route. Everything else, including patchy or sudden loss, an active scalp infection, heart disease, phaeochromocytoma, depression, prostate or breast cancer history, a minoxidil allergy, choosing drops over capsules and declining finasteride, leads to exactly the same screens and the same bag: 'Prescription · Personalised treatment · 4 week supply · 12ml', £34.99. The real engine is a pharmacist prescriber who, after account creation and payment, picks one of 16 compounded formulas (6 capsules, 10 drops). Its published limits are the leaflet contraindications: no finasteride or dutasteride for women; no oral minoxidil with heart disease, phaeochromocytoma or uncontrolled blood pressure; no finasteride or dutasteride with prostate, breast, sexual-function or mental-health history; no drops on an inflamed or infected scalp; only niacinamide drops in pregnancy or breastfeeding. The company says the choice 'isn't automated or AI': a clinician reads the medical history, hair-loss pattern, lifestyle and goals and selects 'the right active ingredients and concentrations'. Its articles call finasteride first-line and dutasteride second-line (more advanced loss, marked crown thinning, or a limited response to finasteride), and point women with PCOS towards once-a-day minoxidil drops. Which strength a patient starts on is not published, and no prescription was seen.


## Strengths
- Very low friction: about 3 minutes, around 30 short screens, no sign-in until after the bag, one flat price (£34.99 per four weeks) whatever the formula, free delivery.
- Never says no before the wall: apart from under-18s, nobody meets a stop screen, so almost every visitor reaches checkout (commercially strong, clinically thin).
- Broad compounded formulary at one price: oral minoxidil in four strengths, finasteride or dutasteride combined with minoxidil in one capsule, topical finasteride, minoxidil + tretinoin, and non-hormonal niacinamide / urea / melatonin drops.
- A route for women who are pregnant, breastfeeding or trying to conceive (niacinamide-based drops) instead of a refusal, with an informed-consent screen and a dedicated leaflet.
- Alcohol-free, water-based minoxidil drops with essential oils (the leaflet labels them 'PGF', usually meaning propylene-glycol-free): an answer to the commonest complaint about high-street minoxidil.
- Clear, well-written informed-consent screen for finasteride / dutasteride (fertility, mood, sexual effects, persistent symptoms) with an explicit opt-out, shown before the medical history.
- Credible clinical front: two consultant dermatologists, named GPhC-registered pharmacist prescribers, published patient leaflets, own pharmacy, one patient record across the +Me brands.
- Pet-safety question, warning and 'Better for pet owners' badge (minoxidil is toxic to cats and dogs): rare in this market and a neat nudge towards the capsule.
- Built-in outcome tracking: two 0 to 10 wellbeing scores at sign-up and monthly progress photos in the account.
- Constant experimentation: the server varies screens, wording and control types between visits, so the funnel is being optimised all the time.


## Weaknesses
- No recommendation before paying: the bag never says which drug, strength or even format the patient will get. Every adult sees the same 'Personalised treatment' line, so 'personalised' is invisible at the moment of purchase.
- No safety feedback in the questionnaire: heart disease, phaeochromocytoma, 'often elevated' blood pressure, an active scalp infection, a minoxidil allergy and depression were each ticked alone and none produced a warning, a stop or a changed offer. The person is walked to checkout and the problem is left to the prescriber after payment.
- No triage: patches of complete hair loss, eyebrow and hairline loss (a scarring pattern), sudden recent shedding and 'Other/unsure' get no advice, no photo request and no GP signposting, although the company's own blog tells people with patchy or sudden loss to 'speak with a medical professional'. Even 'no hair loss' reaches a 'Prescription' bag.
- Question order works against safety: the drops-or-capsules preference is asked before pregnancy, heart, blood-pressure and scalp answers that decide which format is allowed, and is never revisited. A pregnant woman can pick capsules and is not told they are ruled out.
- Thin medical history: no question on thyroid disease, anaemia or iron, kidney disease, family history of hair loss, smoking, alcohol or weight; the men's list has no question on fertility plans beyond the consent text; medicines are three tick-boxes plus free text.
- Thin women's pathway: one combined pregnancy / breastfeeding / 'likely to conceive' question, nothing on contraception (needed for tretinoin), periods, menopause or HRT, and PCOS gets no follow-up. There is no anti-androgen (spironolactone is listed only as a past treatment).
- Single-choice hair-loss picture: a man cannot record hairline and crown together, and there is no severity scale beyond 'moderate / extensive' for diffuse loss.
- Previous treatment is only a tick-list: no question on how long it was used, whether it worked or what side effects it caused, so past finasteride side effects are not captured unless typed elsewhere.
- Photos are optional and asked for after payment, so most diagnoses are made from tick-boxes ('diagnoses at a distance', in the company's words).
- Format preference is not binding and reviewers report being sent pills after asking for a liquid; with no drug named in the bag, the first time a patient learns the formula is on the label.
- No licensed products, shampoo, device or blood test, and capsules and drops cannot be combined (FAQ), so the only step-up is a different compounded formula.
- Pricing surprises: £34.99 headline, £14.99 or £12.99 introductory offers depending on how you arrive, bundles that cannot be cancelled mid-term; reviewers complain about the jump to full price and about losing an older price after a new consultation.
- Loose ends on the site: the bag says '4 week supply · 12ml' even for capsule choosers while the leaflet says 28 ml or 56 ml; one home-page button links to an unfilled placeholder (/HAIR_SIGNUP_URL).
- The marketing describes a fuller assessment than the questionnaire delivers: the female-pattern article says patients are asked for 'clear photographs of your scalp from specific angles' and 'menstrual history and any recent hormonal changes', but no period or menopause question is asked before the account wall and the photo FAQ calls photos 'entirely optional'.
- All the clinical work is done by people after payment ('This isn't automated or AI'), so the service cannot show a plan instantly, and consistency depends on each prescriber reading tick-boxes with no on-screen rules.


## Opportunities
- Show the plan before the account wall: the likely medicine, strength and format, why it was chosen from the answers, and what was ruled out. Hair + Me shows one generic line to everyone, so a visible, explained recommendation is an immediate point of difference.
- React to answers on screen. When someone ticks heart disease, uncontrolled blood pressure, a scalp infection or a minoxidil allergy, say at once what that means ('tablets are not suitable for you; here is what is') instead of staying silent until after payment.
- Do real triage and be proud of it: route patchy, scarring-type or sudden loss to photos, a clinician call or a GP letter before any payment, and tell people with no hair loss that they do not need a prescription.
- Ask the format question last, after the safety answers, and only offer formats the person can actually have.
- Build a proper women's pathway: separate pregnancy, breastfeeding and trying-to-conceive questions, contraception, cycle, menopause and HRT, PCOS detail, iron and thyroid history, with treatments Hair + Me lacks for women (for example spironolactone where appropriate, or blood-test-guided plans).
- Take a real history of past treatment (what, how long, response, side effects) and use it: past finasteride side effects should change the plan automatically.
- Let people record more than one area of loss, severity and family history, and make photos part of the standard assessment with visible progress tracking.
- Offer combination and step-up care (oral plus topical, medicated shampoo, supplements matched to blood results, licensed options alongside compounded ones) where Hair + Me allows one product only.
- Transparent pricing for every plan length before sign-up, the same price however you arrive, and no trial-to-full-price shock.
- Publish the dose ladder (for example starting and maximum oral minoxidil doses for men and women, and when dutasteride is used): Hair + Me lists its formulas but never says who starts on what.
- Ask the questions Hair + Me's own articles say matter but its questionnaire skips: family history, thyroid and iron (with an optional blood test), periods and menopause, and whether earlier finasteride or minoxidil worked. Each can drive a visible rule.
- Encode the safety rules in software so the plan appears at once and a clinician confirms it. Hair + Me relies on a person reading every questionnaire after payment, which is slower and invisible to the buyer.


## Verification verdict
For the part anyone can see, this report is trustworthy. Two fresh baselines and 19 more replays in stage 3 reproduced every visible rule that was re-tested: the only stop is age under 18, a few answers add or skip one screen or add a badge, the promo links lower the first price, and the bag is always the same unnamed £34.99 'Personalised treatment'. No claim was contradicted. The corrections were about labels: a few rules and one option said 'observed' for something no replay can see (a prescriber's decision, a product removal or switch), and these now say 'none', 'docs' or 'inferred'. The product catalogue matches the live leaflets. The weak part is the real decision, which a pharmacist prescriber makes after sign-up and payment: what is said about who gets which formula comes from the company's leaflets and articles and from reasoning, so treat it as likely, not proven.


---

# Happy Head (US) — digest
Slug: happy-head · Verified: yes · Audiences: men, women

Model: US dermatologist-founded telehealth company selling custom-compounded prescription hair-loss medicines (topical, oral and combined) on subscription, plus non-prescription hair products.
Account wall: An email page ('BLACK FRIDAY SALE, Up to 60% Off, Plus FREE Dermaroller' on 23 Nov 2026) with a consent tick. Its fields and place depend on a split test chosen when the quiz loads: (a) sms_capture: email + US mobile number, after every medical question (about 26 screens in; runs/baseline-men, runs/verify-base-women-pinned); (b) no redirect: email only, same place at the end (runs/s2/baseline-men, runs/verify-base-men); (c) early_capture: email only, straight after 'Take Me to My Plan', BEFORE the recommendation screen and before any medical question (runs/verify-base-women, runs/s2/var-early-capture-women). Submitting it posts the questionnaire to api.happyhead.com/middleware/embeddables and leads to checkout at my.happyhead.com. Nothing was entered.
Tested by: live-walk, site-code, public-docs
Coverage: Tested live: the standard assessment on www.form.happyhead.com (its own robots.txt allows all agents) for the baseline man and the baseline woman, both to the email page. Read from code: the full quiz definition (62 pages, all conditions, the recommendation call, the order payload with its clinician flags), served to the anonymous page by engine.embeddables.com. Read from documents: 24 help-centre articles and four independent reviews. Not tested: product pages and prices on www.happyhead.com (closed to this agent; a few facts were checked through web-search summaries only), anything after the email page, and what the dermatologist actually does with a flagged answer. Stage 2: 21 one-change experiments and both baselines replayed live on 23 Nov 2026, all stopping at the email page with no consultation posted. Stage 3 (independent check, 23 Nov 2026): both baselines and 12 high-impact rules replayed live in runs/verify-*, plus 4 new one-change tests (woman 50+ choosing Oral, woman with no birth control, woman with household pregnancy, man with low blood pressure). All runs: 0 consultation posts.

Questions: 48 (44 before sign-in; 22 branch). Flows: main (38q), legacy (6q), consult (4q)

## Engine summary
A three-input engine. Only sex, the woman's age band (under 50 or 50+) and the topical/oral preference reach the recommendation call, which runs before any medical question. Men and women 50+ get dutasteride + minoxidil; women under 50 get minoxidil topical + a spironolactone/minoxidil capsule. The topical + capsule "Dual" bundle is always first and pre-selected; the second card is Topical (or SuperCapsule if the person said Oral). After the choice, about 12 to 16 medical questions follow. They add follow-up pages (free text, reactions, partner-pregnancy consent, three blood-pressure questions for capsule plans) but never remove, switch or block a product: 25 live one-change tests (21 in stage 2, 4 more in the stage 3 check) changed the offer only through sex/age band and method. Answers are tagged important or critical for a dermatologist who reviews after checkout. The only hard stop is age under 18, and a woman whose birth date does not fit her band is sent back to choose again. The email wall is a split test: in one arm it comes before the recommendation screen.


## Strengths
- Very short path to a named plan: six profile questions, then a clear two-card choice with a "best for" line on each.
- Leads with dutasteride and 8% minoxidil, stronger than most rivals' first offer, and explains each ingredient.
- A clear age rule for women: no finasteride or dutasteride for women who say they are under 50, and a date-of-birth check that sends a mismatched woman back.
- Branching follow-ups capture detail where it matters (free text for symptoms, conditions, other patterns, reactions; a written partner-pregnancy consent).
- Asks blood pressure, weight and last check-up only when an oral capsule is chosen, keeping the topical path short.
- A customisation box lets the patient ask the doctor to change the formula.


## Weaknesses
- The product is chosen before any safety question, and the most intensive plan (dutasteride + oral minoxidil) is pre-selected for every man, even "just exploring" or "prevention only".
- Red flags do nothing on screen: bald patches, severe scalp symptoms ("may disqualify you"), heart disease with oral minoxidil, a reaction to finasteride, all leave the plan unchanged.
- A pregnant partner who declines finasteride/dutasteride still has dutasteride in the plan; a woman 50+ who can become pregnant is offered dutasteride with no warning.
- Goal, duration, family history and hair-loss pattern are asked "to personalise" but change nothing.
- Age comes from a self-chosen band; the real birth date is asked only at the end and does not change the product. No upper age limit.
- No price on the recommendation screen; price appears only after email and mobile number.
- Finasteride, the usual first-line drug, is never offered by the assessment.


## Opportunities
- Ask safety questions first and let them shape the offer: remove oral minoxidil for heart disease or low blood pressure, drop 5-alpha-reductase inhibitors when the patient declines them, refer patchy loss or scarring signs.
- Use goal, pattern and duration to offer a gentler start (topical only, finasteride) to "prevention" or "exploring" patients.
- Offer finasteride as first line with a plain comparison against dutasteride.
- Show the price on the recommendation screen before asking for contact details.
- Use the actual date of birth (not a band) and handle older adults and post-menopausal women under 50 explicitly.
- Ask about women's specific causes (iron, thyroid, PCOS, recent childbirth or illness), which this quiz does not ask.


## Verification verdict
The core finding holds up well. Every high-impact rule re-tested live (stops, product family by sex and age band, card swap by method, topical-only skipping the blood-pressure questions, medical answers never changing the plan) reproduced exactly, and the served code agrees. The one real error was the account wall: it is a split test, and in one arm it comes before the recommendation is shown. Facts about the six products the quiz returns are reliable (live API data). Facts about the rest of the catalogue are weaker: they rest on help-centre text, third-party reviews and search summaries because the marketing site's robots.txt bars this agent, and one stage 2 price was out of date. Treat the engine logic as high confidence and the wider catalogue prices as rough.


---

# Hers (US) (US) — digest
Slug: hers-us · Verified: yes · Audiences: women

Model: US telehealth brand for women: a free online hair quiz and intake, review by a licensed provider (no visit), then compounded and off-label prescription hair treatments on subscription, plus over-the-counter minoxidil, supplements and hair care sold directly.
Account wall: Not observed (site blocked). Reported by one reviewer in Dec 2023 (Innerbody, re-read at stage 3): 'You'll have to make a Hers account to see your results', that is, after the quiz and before any recommendation. Later descriptions (a Hims & Hers partner article, May 2025; AOL / New York Post, Jun 2026) say the quiz 'leads to an intake form' and do not say where the account step sits. A Nov 2026 review adds that a government-issued ID and a payment card are needed to complete a consultation (Healthline, about the platform in general). No step behind this wall was tested.
Tested by: public-docs
Coverage: No live walk of the Hers consultation was possible at any of the three stages: the site stays behind a security checkpoint, which was not defeated. No answer was changed and replayed, so nothing in this file is 'observed'. What the file holds is (1) Hers's stated safety and eligibility policy, from patient leaflets in the shared Hims & Hers help centre (opened directly and re-read word for word at stage 3) and from Hers pages read only through a search index; (2) descriptions of the quiz by reviewers and one partner article (2023 to Nov 2026), now labelled 'inferred' because they are not Hers's own statements; (3) one code hint: names of old Hers hair experiments in the page state served by the sister site. These say who Hers says can have each product. Whether the quiz enforces a rule itself (stop screen, product hidden) or leaves it to the provider is not known. Question wording is not verbatim. Hers is women only; men are served by the sister brand Hims.

Questions: 17 (8 before sign-in; 9 branch). Flows: women (17q)

## Engine summary
Untested: the site was blocked at all three stages, so this is how the engine should work according to Hers's own public statements and reviewers, not how it was seen to work. Hers treats one diagnosis, female pattern hair loss, with one main drug, minoxidil, sold in several formats. (1) A short visual quiz collects goals, symptoms, hair density and routine; nothing public shows these changing the product. (2) Health questions, either inside the quiz (2023 report) or in an intake form after it (2025 and 2026 reports), feed three documented gates. Menopause: finasteride (the Postmeno Serum) is only for women past menopause. Pregnancy, planning a pregnancy or breastfeeding: oral minoxidil in any form and finasteride are ruled out. Health: pheochromocytoma rules out oral minoxidil and a heart history must go to the provider (confirmed word for word in the help centre); kidney, liver and blood pressure problems, age under 18 and already using minoxidil are further exclusions read only through a search index. (3) A preference question reported in 2023 (vitamins with your treatment?) probably picks between plain oral minoxidil at $29 a month and the vitamin blends at $35 to $39. (4) One or two prescription products are shown, reportedly after an account is made, and can be swapped; a licensed provider then approves, changes or declines and sets the dose, by message in most states and by video in some. Over-the-counter minoxidil, supplements and hair care sit outside the quiz. Spironolactone may no longer be part of the hair range.


## Strengths
- Many formats of one proven drug: plain oral minoxidil, three minoxidil plus vitamin formats (pill, chew, gummy) and a topical serum, so almost any preference can be met without changing the active ingredient.
- A clear, defensible finasteride rule (after menopause only), with a dedicated postmenopausal product.
- Low entry price: $29 a month for oral minoxidil and over-the-counter minoxidil from $12.67 a month on a long plan.
- The patient can swap the suggested treatment before the provider sees it (reported), and pays nothing until a treatment is selected.
- Written patient information for every prescription product is public in the help centre, and compounded products are clearly labelled as not FDA-approved.
- Narrow scope: Hers is reported to say it does not offer oral minoxidil for telogen effluvium or alopecia areata (sentence found only on a non-public copy of the page; not confirmed).


## Weaknesses
- The quiz result sits behind an account (reported), so a visitor cannot see a recommendation or a final price without giving contact details.
- The consultation is reported as thin on cause-finding: no reviewer mentions questions on thyroid disease, iron or anaemia, PCOS or signs of high androgens, recent illness or weight loss, scalp symptoms, family history, contraception or period regularity. No blood tests and no blood pressure reading are described, although the main drug is a blood pressure medicine.
- Most prescription products are compounded and not FDA-approved, and the strengths of the oral blends are not published on the pages found.
- Eligibility rules are scattered: exclusion lists sit on separate treatment terms pages (/treatment/hair-loss/...), apart from the product pages (pages not opened; from search-index reads).
- No source shows dutasteride, oral finasteride for women, tretinoin add-ons or iron or vitamin D testing in the range. Spironolactone, the usual anti-androgen tablet for women before menopause, appears in no 2023 to 2026 description of the hair range, and one 2026 reviewer says Hers does not offer it.
- Prices are hard to pin down: sources give $35 and $39 for the blends, $39 and $50 a month for the postmenopausal spray, and plan-length prices are only shown inside the flow.
- Reviewers are said to report complaints about subscription charges, refunds and reaching a clinician (stage 1 reading; not re-checked at stage 3).


## Opportunities
- Show the recommendation, strength and full price before asking for an email or an account.
- Ask the cause-finding questions Hers is not reported to ask (thyroid, iron, PCOS signs, recent illness, scalp symptoms, medicines that cause shedding) and explain how each answer changed the plan.
- Offer a route for the women Hers's stated policy leaves out: sudden shedding, patchy loss, pregnancy and breastfeeding (advice, safe topicals, blood tests, referral).
- Ask for a home blood pressure and pulse reading before oral minoxidil, and say so up front. If offering spironolactone (Hers appears not to today), include a potassium check plan.
- Publish who cannot have each treatment on the product page itself, and state exact strengths for combination products.
- Give perimenopausal women a clear answer: Hers's finasteride rule is 'after menopause only', with nothing specific in between.
- Sell fewer, simpler options with fixed, visible plan prices; Hers's many near-identical minoxidil formats are hard to compare.


## Verification verdict
Trust this report as a map of Hers's published policy and product range, not as a description of its quiz. The site was blocked at all three stages, so no answer was ever changed and replayed and nothing is observed. The safety rules that rest on the help-centre leaflets (finasteride not before menopause; no oral minoxidil in pregnancy, when planning one or when breastfeeding; pheochromocytoma; heart history to the provider; provider decides; video visit in some states) were re-read word for word and are solid as policy. The product list is broadly right for the five core prescription products and the over-the-counter items, with prices good to within a few dollars and several strengths unknown. The quiz outline is second-hand, partly three years old, and three of its questions have no traceable source. Spironolactone and the spray may no longer be sold. After the stage 3 corrections the labels are honest: 'docs' means Hers, its help centre or a partner article says so (sometimes read only through a search index, which is flagged each time); 'inferred' covers reviewer reports and reasoning. A reader should not use this file to say what any single answer does in the Hers quiz.


---

# Hims UK (with Hers UK for women) (UK) — digest
Slug: hims-uk · Verified: yes · Audiences: men, women

Model: Subscription telehealth: a long marketing quiz, a medical questionnaire reviewed by a UK clinician without a call, then compounded finasteride and minoxidil products (sprays, serum, chews) or generics posted every 1 to 12 months, paid up front.
Account wall: Men (Hims): after 21 anonymous screens, at https://app.forhims.co.uk/start/signup?t=hair&anon_flow_key=hair — 'Ready to see if you’re eligible? Next we'll cover your health and medical history as well as treatment options.' asks for an email address. Nothing medical, no product and no price has been shown by then; the last thing before the wall is a fixed 'Great news—we have options that may work for you', an answer summary and marketing screens. Women (Hers): at the first screen (first and last name).
Tested by: live-walk, site-code, public-docs
Coverage: Stage 1 (map) walked the whole anonymous men's quiz and read the served quiz definition, product and price tables, app code and public documents. Stage 2 (experiment) replayed the baseline twice and then changed one answer at a time: 31 runs covering every non-baseline option of all 11 anonymous questions, so all 42 options have now been clicked live. Seven further runs checked two multi-select combinations, the phone layout, a returning visitor, skipping the quiz, two other landing pages and the Hers entry: 40 replays in all. Every run kept the full server traffic, which showed the server choosing the next step after each answer and returning no result at the end. Stage 2 also read ten more of the app's code files (how the server's eligibility result is used, the consent screen, brand settings) and the older Hims UK help centre (vitamin strengths in the chews). Not obtained, and not obtainable without an account: the wording of the medical questions, the rules that map answers to products, any live recommendation, and the checkout prices. Nothing at all could be tested on Hers UK, which asks for a name first. Stage 3 (verify) added 25 reviewer replays in runs/verify-* (two baselines, a full-trace baseline, six repeated one-change runs, and 16 runs on behaviour stage 2 had not tested or had tested once), re-read 16 public pages, re-read the served code behind every code-based rule, and re-read the leaflet and help-centre lines behind every document-based rule. The wall is where stage 1 and stage 2 said it is, and nothing behind it could be tested.

Questions: 53 (25 before sign-in; 11 branch). Flows: men (37q), men-product-link (0q), generic-entry (1q), men-reactivation (1q), women (14q)

## Engine summary
Hims UK's engine has two parts, and only the first can be watched from outside. Part one is a marketing quiz anyone can take: 11 questions (intent, where, how much, when, goals, hair type, hair length, family history, stress, styling, time) with 10 selling screens between them. Stage 2 changed every answer one at a time (31 replays covering all 42 options) and the engine did not move: same screens, same order, same 'Great news—we have options that may work for you', same email wall. Six answers are repeated on one summary screen; the other five are never shown again. No answer stops anyone, warns anyone, or shows a product, strength or price. The server traffic agrees: after each answer the server names the next step, and at the end it returns a record id and nothing else. If the visitor signs up, his stored answers are attached to the new account. Part two sits behind the account: date of birth, a medical questionnaire, then a server-side rules step that marks each of ten products eligible or not and names one as the recommendation. A patient the server calls 'not eligible' sees a rejection screen. Everyone else sees one recommended product, with the other nine a tap away and the ruled-out ones greyed out as 'Not available based on your medical history'. The 'Selected based on your goals' chips on each product page are fixed text, not built from his answers. He then picks a plan length, ticks a consent box, gives GP details and pays up front; a clinician reviews the answers without a call and approves or refunds. The wording of the medical questions and the answer-to-product rules are not public. The best guides to them are Hims's own leaflets (who must not use each product) and the old platform's tag system, in which an answer could exclude every product tagged 'finasteride', 'minoxidil-oral', 'topical' and so on. Hers UK runs on the same platform with five minoxidil-based treatments for women, but asks for a name on the first screen, so nothing there can be tested without an account. Stage 3 (independent check): the reviewer replayed the baseline from fresh browsers and got the recorded end state, repeated six one-change runs with the same result, and tried what stage 2 had not: contradictory answers, every warning-sign answer together, going back, leaving and returning, deleting answers, a product code followed to the wall. None of it moves the engine before the wall. Everything said about the engine after the wall is still read from code, leaflets and help pages, or reasoned, and none of it was seen happening.


## Strengths
- A wide compounded range: two finasteride + minoxidil sprays (one with ketoconazole and biotin), a serum, and once-daily chews that combine oral finasteride 1.1 mg, oral minoxidil 3 mg and vitamins
- A fallback for almost every exclusion: without finasteride (minoxidil chew, minoxidil serum, Regaine), without minoxidil (finasteride tablets), without any medicine (supplement chew), so few paying customers leave with nothing
- A quiz with no friction and no dead ends: one tap per question, pictures, 'Why we ask' notes, and every one of the 42 answers leads to the sign-up screen, so no lead is lost before the email is captured
- It feels personal at low cost: one summary screen repeats six answers back, and the saved answers are attached to his account if he signs up
- Low headline price on long plans (£16.50 a month for spray, serum or chew on a 6-month plan), free delivery, full refund if the clinician does not approve
- No clinician call needed for hair: the whole thing is a form, reviewed afterwards
- The regulated set-up is clearly stated: CQC-registered provider, named GPhC pharmacies, a specialist compounding pharmacy, and a consent step that says in plain words the medicine may be compounded and off-label
- Good public reviews overall: Trustpilot 4.1 from 123 reviews on the day of the check (all Hims UK services), with recent reviewers calling the questions 'easy to follow' and the company 'thorough with questions'; 4.4 from 1,913 reviews on Hims's own hair pages
- Sensible data handling in the quiz: answers are kept for 7 days so a visitor can resume where he left off, he can go back and change an answer, and 'Delete my answers' removes them from the server at once (all seen in stage 3)
- Hers UK shows real personalisation that Hims lacks: its 'Matched for you based on your goals' chips are built from the goals the woman ticked (read in code, not seen live)


## Weaknesses
- The 'free hair quiz' is not a consultation. All 42 answers were tested and none changes anything: a man with no hair loss yet, no hair at all, or loss 'all over' that began 'in the past few months' gets the same 'Great news—we have options that may work for you' as a textbook case. Hims itself says 'The quiz is not a medical assessment'
- It gives nothing back: 21 screens, then an email wall, with no result, no product, no strength and no price shown first
- What it never asks before the wall: age, sex, medical conditions, medicines, allergies, blood pressure, mood, sexual function, plans for children, earlier treatments and their side effects, scalp symptoms (itch, pain, scale, redness), patchy loss, how fast the loss came on. There is no photo step in the quiz
- The personal touch is thin: five of the eleven answers are never shown again, and the 'Selected based on your goals' line on each product page is fixed text, not the visitor's own goals
- No early warning: answers that Hims's own leaflets treat as reasons not to use a product (sudden loss, total baldness, shaved scalp) pass without comment, so those men can only find out after giving their details
- Prices are hidden until late and the cheap figure needs 6 or 12 months paid up front (for example £99 or £276); the monthly chew plan is £60. Only four of the ten products have a 'from' price on a public page (serum, minoxidil chew, finasteride tablets, combo kit). One Trustpilot reviewer ('Si', dated 19 November; the year is unclear) reports being 'Auto renewed at 43% more with no advance notice'
- Its flagship products are unlicensed compounded medicines in one fixed strength each (topical finasteride 0.3% with minoxidil 6% or 7%; a chew with finasteride 1.1 mg and minoxidil 3 mg), so one ingredient cannot be lowered or stopped without changing the whole product
- Gaps in the range: no dutasteride, no lower-strength topical finasteride, no oral minoxidil in adjustable doses, no shampoo or scalp care (its own shampoo is withdrawn), no devices, and no blood tests for causes of hair loss in the men's hair range
- The public pages do not say a photo is needed for hair (the terms only say 'You may be asked to upload photographs for assessment'), so the diagnosis seems to rest mainly on tick-boxes
- Cancelling is by message to support with a cut-off before the next order (the help centre says 48 hours, the terms say three days). Self-service cancelling is switched off in the app's settings for this brand, and changing a hair treatment plan also goes through support
- Men only on Hims; women are sent to a separate brand with a separate account and no anonymous quiz at all. Men over 65 are outside the labelled age range of seven of the ten products, and new customers over 75 are not treated
- The platform move (to Fill Function / Eucalyptus) leaves loose ends: product links whose code appears to do nothing, a dead hair subdomain, and card badges such as 'Generic Treatment' on Regaine
- Product quality complaints: three of the five newest reviews on Hims's own combo-kit page (10 to 20 November 2026) report spray pumps that stopped working
- The quiz has no check that the answers fit together: 'No hair loss yet' with 'A lot' of hair lost, or 'I don’t have hair' with hair length 'Long', pass without comment (stage 3)
- A visitor who has finished the quiz cannot retake it or delete his answers from where he lands: reopening the quiz sends him to the sign-up screen, which has no 'Delete my answers' control, and its back arrow goes to the home page (stage 3)
- Small inconsistencies on public pages: the minoxidil serum page says 'Twice-daily topical serum' and, lower down, 'Once a day drop 1 ml'; three safety-information addresses for compounded products redirect to the landing page


## Opportunities
- Give a real answer before asking for contact details: likely pattern, which treatments fit, which are ruled out and why, and the price. Hims asks 11 questions and returns nothing
- Make the quiz respond. Not one of Hims's 42 options changes anything on screen. React at once: sudden or patchy loss → 'see a GP first'; shaved head or a hat every day → suggest tablets; heavy stress with no family history → explain shedding and offer a blood test
- Ask the safety questions early (blood pressure, heart, mood, fertility plans, current medicines) and say in plain words when and why a product is ruled out, instead of a greyed-out card after sign-up
- Use photos and a clinician's eye to tell pattern loss from shedding, patchy or scarring loss, which a tick-box quiz cannot do
- Offer adjustable strengths and separate ingredients (for example a lower-strength topical finasteride, oral minoxidil in steps), so a side effect means changing one thing rather than the whole product
- Fill the gaps in Hims's range: dutasteride for men who do not respond to finasteride, medicated shampoo and scalp care, blood tests for common causes (iron, thyroid, vitamin D), and a clear option for men over 65
- Show real personalisation: let the patient see his own answers driving the plan, where Hims shows fixed 'Selected based on your goals' chips
- Price honestly: the monthly price up front, a true monthly plan, a reminder before any renewal price change, and self-service pause and cancel
- Treat men and women in one service with one account, and give women the same try-before-you-sign-up quiz that Hers UK lacks
- Build the plan around measured progress (standard photos at 0, 3 and 6 months) with a money-back promise for men too; Hers has a 180-day guarantee, Hims has none for hair


## Verification verdict
The part of this report that can be watched from outside is solid. The anonymous Hims quiz was mapped completely, every option was tested by stage 2, and an independent reviewer got the same result from fresh browsers: 11 questions, one fixed path, no stop, no warning, no product, no price, then an email wall; Hers has no anonymous step at all. Those findings carry the label 'observed' and each one names its run folder. The product catalogue is also reliable for names, forms and strengths (checked on live pages and in the app's served files), and reasonably reliable for prices, with the caveat that most Hims prices come from one embedded price table of the old shop. The part a competitor most wants, how medical answers decide which product is offered, could not be observed within the research rules. What the report says about it is honestly labelled: the mechanics (the server marks each product eligible or not, names one as the recommendation, greys out the rest, or rejects outright) are read from served code and are trustworthy as a description of the code; the content of the rules (which answer removes which product) rests on leaflets, help pages and reasoning, and should be treated as informed expectation, not fact. Read with those labels in mind, the report can be trusted. It is rated 'partial' only because the engine behind the wall remains unseen.


---

# Hims (US), with sister brand Hers (US) (US) — digest
Slug: hims-us · Verified: yes · Audiences: men, women

Model: Subscription telehealth: online intake reviewed by a licensed provider (by message, or by video where a state requires it), then compounded or generic hair-loss medicines shipped on multi-month plans, plus over-the-counter products sold without a consultation.
Account wall: Reached at the state screen of the newer intake (https://www.hims.com/g/i/hl/select-state), after 14 anonymous screens: Continue stays disabled until the visitor ticks "I agree to the Terms and Conditions and Telehealth Consent". This research did not tick it, so the next screen was not seen. Signs that the account comes next: every screen has "Already have an account? Sign In", which goes to the old app (/c/hl?skipToSignIn=true&goFlow=true&flowId=hl), and the flow settings say legacyPath "/c/hl" and hold the date-of-birth rule (18 to 120) that the anonymous part never asks. The old app at /c/hl itself is blocked here (Cloudflare refuses its scripts).
Tested by: live-walk, site-code, public-docs
Coverage: Stage 1 mapped the catalogue and walked a landing-page pre-quiz. Stage 2 (experiment) found the newer anonymous intake at /g/i/hl, replayed its baseline, and ran 12 one-change replays plus 2 multi-change sweeps over the 11 hair questions (34 of 40 options seen live; stage 3 replayed the other 6, so all 40 are now seen) and 5 state replays (Texas, California, Massachusetts, Washington, AA, AP). Result: no hair answer changes anything; military mail states are refused; everything stops at the Terms and Telehealth Consent tick-box, which was not ticked. The pre-quiz was also tested (every option, no effect). NOT seen: the account step, date of birth, the medical form, photos, the recommendation, strengths, plan prices and any medical stop screen; the old /c/hl app stays blocked; Hers (women) stays blocked. The served flow data holds one screen at a time, not a full quiz definition, so no branch conditions could be read from code. Stage 3 (verify) replayed every baseline (all matched), re-tested the state rules (AA stop, Massachusetts valid), tested AE (stopped) and the 6 untested hair options (no change), and re-read 14 product pages and 2 safety pages.

Questions: 30 (18 before sign-in; 7 branch). Flows: lp-prequiz (3q), men-gi (15q), men (12q), women (0q)

## Engine summary
Hims US runs its hair consultation on a server-driven flow engine (flow-server.hims.com): the browser sends each answer and the server returns the next screen, one at a time. The anonymous part (hims.com/g/i/hl) is 11 questions about goals, where and how much hair is lost, when it started, hoped-for results, hair type and length, family history, stress and styling, with three education screens. It has no logic that a visitor can see: in 12 one-change replays and 2 sweeps, no answer added, removed or reworded a screen, raised a warning or named a product. Hims says so itself on screen one: the quiz "is not a medical assessment" and is not shared with a provider; the answers are kept with an anonymous session for personalisation. The first real gate is the state screen: armed-forces mail addresses (AA, AP) are refused, territories are not listed, and nobody can go on without agreeing to the Terms and the Telehealth Consent. After that (not seen, and the old /c/hl app that carries it is blocked here) Hims' public pages describe an account, date of birth (the served settings enforce 18 or over), a medical form built as a tree of follow-up questions, photos in most cases, and a pre-selected recommended product and dose that the customer may change, with plan length setting the price. The medical exclusions are published only as "who should not use" lists, and a licensed provider, not the software, makes the prescribing decision within about 48 hours.


## Strengths
- Very wide format range for the same two actives (pill, two chews, two sprays, serum, plain finasteride tablets, kits, foam, solution), so there is nearly always a format to offer.
- Low headline price ("less than $1 a day", from $29 a month) tied to a 10-month plan paid upfront, which also locks the customer in.
- A recommended product and dose are pre-selected, but the customer can change product, strength and plan (page state); choice without a blank page.
- Free consultation, free shipping on prescriptions and unlimited provider messaging; providers in all 50 states with video visits where the law requires them.
- Over-the-counter products can be bought with no consultation, and prescriptions can be sent to a local pharmacy on request.
- Published safety information for each prescription product, with clear exclusion lists, and "Why We Ask" notes on intake questions.
- Heavy measurement: about 1,000 named experiments in the page, around 200 of them for hair, and every landing-page click is logged.
- A short, friendly anonymous quiz (14 screens, about 2 minutes) with plain words, pictures and "Choose as many as you'd like"; it builds commitment before asking for anything.
- Honest label on screen one: the quiz "is not a medical assessment" and is not shared with a provider.
- State check is live and immediate: an unsupported address gets a clear message before any account is made.


## Weaknesses
- The landing-page quiz is theatre: no answer changes the outcome, and a visitor who is "Not sure yet" about prescriptions is still pushed to the prescription spray. Yet the answers are logged against a device id.
- Headline prices differ between pages on the same day ($35 on /hair-loss, $29 on product and landing pages), and the low price needs a 10-month upfront payment. Plan prices are shown only inside the consultation.
- Most prescription products are compounded and not FDA-approved; the vitamin amounts in the chews are not published.
- Nothing public says which answers lead to which product: the customer cannot see why a product is recommended.
- Sudden or patchy hair loss is handled by a line in an FAQ ("seek medical attention"), not by anything visible before sign-up.
- After starting, hair customers cannot request a dose or product change through the self-service tool (weight-loss and sexual-health only); they must message the provider.
- Provider review can take 48 hours or more, and an order can sit on an unseen "action item".
- Women are sent to a separate site; the Hair Power Pack was out of stock.
- The site is hard to open from some networks: the consultation's own script files were refused by the security layer on every try.
- The 11-question anonymous intake has no clinical logic: diffuse loss, onset "in the past few months", "no" family history, constant stress, braids or locs, and "I don't have hair" all get the same screens and the same "prescription treatments can help" message.
- The education screen says "family history" and "stress" cause the loss even to a man who answered "No" family history or "Rarely" stressed: the copy is fixed, not personal.
- Answers are stored server-side with a session id before any consent or account, while the visitor is told they are not a medical assessment.
- No age, sex, pregnancy or medical question comes before the Terms and Telehealth Consent; a person who would be refused (under 18, a woman, a man with a contraindication) only finds out after signing up.


## Opportunities
- Make the quiz real and show it: tell the visitor which answer led to which product and strength, and what would change it.
- Publish one plain price table for every plan length before the quiz, with no upfront-payment footnote.
- Offer a true fork for people unsure about prescriptions: a non-prescription path (minoxidil 5%, ketoconazole shampoo) with a clear step-up later.
- Screen warning signs in the open before sign-up (sudden, patchy, scarring, scalp symptoms) and route them to in-person care; Hims does this only in an FAQ.
- Ask and act on things Hims does not appear to publish: finasteride side-effect worries and a low-dose or topical-only route, partner pregnancy plans, blood pressure for oral minoxidil.
- Offer licensed products and strength choice (for example dutasteride, or lower and higher topical strengths) that Hims does not sell; Hims has one topical strength pair plus the 4-in-1.
- Give short commitments (monthly, cancel any time) against Hims' 3 to 12 month plans.
- Let existing customers change dose or product themselves with a quick safety check, which Hims does not allow for hair.
- Take data only when needed: Hims logs marketing-quiz answers against a device id although it tells visitors the answers are not a medical assessment.
- Put the deal-breakers first: ask age, sex, current finasteride use and the main contraindications before asking for consent or an account, so nobody signs up to be refused.
- Make the anonymous answers matter: route sudden, diffuse or patchy loss, recent onset and traction styles (braids, locs) to a different path or an in-person check, which Hims does not do.
- Show a provisional recommendation and price before the account, with the reason ("because you said hairline, over a year, family history"); Hims shows neither.
- Serve armed-forces (APO/FPO) and territory customers, whom Hims turns away.


## Verification verdict
What is labelled observed holds up: every baseline replayed the same, every rule I re-tested live was confirmed, the six gaps in the anonymous quiz are now filled, and the product names, actives and strengths match the live pages. The main error found was prices: the public "starting at" price for the main prescription products dropped during the day, so the recorded $35 / $39 were out of date and have been corrected to $29 / $33. The report is trustworthy for the anonymous part of the Hims men's intake (which is marketing and data capture, with only a state-based stop) and for the public catalogue. It cannot tell you how Hims chooses a product or strength, because that happens after a consent box and an account, which this research does not cross; those parts are clearly labelled as docs, code-name hints or inference. The women's side (Hers) is essentially uncovered.


---

# Keeps (US) — digest
Slug: keeps · Verified: yes · Audiences: men

Model: US men's telehealth subscription for male pattern hair loss: a short marketing quiz names a compounded prescription product, the patient pays, and a licensed provider reviews a medical intake afterwards.
Account wall: Main and Gel funnels: /express/checkout, reached from the plan page button 'Continue to checkout' (one page asking name, address, phone, date of birth, email and card). Legacy quiz: /quiz/lead (name, email, phone) straight after the last question. Request flow: /request/lead (name, email) on the first screen. The medical intake (/consultation/intake) redirects to sign-in.
Tested by: live-walk, site-code, public-docs
Coverage: Stage 1 read all three quizzes in served JavaScript. Stage 2 replayed all three baselines and ran 41 one-change experiments (19 main quiz, 3 gel, 19 legacy) to the plan page or account wall. Every product-changing rule read in the code was confirmed live. Not tested: the remaining 'no effect' options of the main quiz one by one (code shows no branch condition, 13 replays agreed), most of the 51 accepted states, the medical intake after payment and sign-in, and the clinician's decision. Keeps does not treat women (FAQ; tick-box gate). Stage 3 (independent verify) replayed all three baselines fresh, re-tested 9 high-impact rules live (all confirmed), ran 5 new gap replays and re-read 10 product pages plus the live price data.

Questions: 63 (51 before sign-in; 20 branch). Flows: men (26q), men-gel (25q), men-legacy (9q), men-plan-selection (1q), men-request (2q)

## Engine summary
Before payment the main Keeps quiz is a two-answer lookup, now proved live. 'How would you like to treat your hair loss?' picks the family (Topical Drop gives Drop/Drop+, anything else gives Chew/Chew+) and 'What's your top priority?' picks the strength ('simple & affordable' gives the finasteride product, anything else the dutasteride 'plus' product). Thirteen other one-change replays (onset under 6 months, advanced loss, patchy loss, earlier side effects, goal, state) changed nothing but the echoed label. The only stops are a 'Mostly Scalp' picture, twelve refused states and an unticked '18+ and assigned male at birth' box; women cannot pass the tick box (the FAQ says the service is only for people assigned male at birth). The Gel funnel always names Gel+. The older /quiz is a real rule table, also proved live: location and pill preference choose finasteride, foam or oral minoxidil; tretinoin or vitamins swap foam for a compounded spray; dandruff, ketoconazole, saw palmetto, hair care and pomade each add one product; patchy loss goes to a clinician request. In every flow the medical screening happens after the account wall and payment.


## Strengths
- Very short path: about ten taps and no typing to reach a named product and a price.
- Patients steer the offer with two plain choices (oral or topical; strongest or cheapest), and switch links on the plan page show the other family at once.
- An honest early stop for advanced baldness ('Mostly Scalp'): it tells the patient prescription treatment is unlikely to work and points to restoration or cosmetic options.
- Clear price ladder with a large first-order discount and a 180-day money-back guarantee on the new compounded range.
- Wide range: licensed generics (finasteride, minoxidil, ketoconazole), compounded combinations (oral and topical, finasteride or dutasteride) and cosmetic add-ons.
- Honest legal labelling on product pages: compounded products are marked 'not FDA-approved'.


## Weaknesses
- 'You're approved' and 'clinically recommended' are shown before any medical question; the loaders ('Confirming clinical eligibility') are timed animations (about 5 seconds, set in served chunk 6717).
- Proved live: 'Had side effects' from earlier treatment, onset under 6 months and patchy loss change nothing, give no warning and ask no follow-up (runs/exp-08, 11, 12).
- The default for every man who does not ask for cheap is a compounded dutasteride product (off-label for hair loss in the US), never licensed finasteride first.
- Payment is taken before the medical intake; a product page says 'You won't be charged until your prescription is approved' while the checkout says the card is charged and refunded if not approved.
- Age and sex are checked with one tick box; no women's service at all (referred to Nurx).
- Renewal price ($204.99 per 3 months for Chew+) is about double the first order ($100) and appears only in the checkout small print.
- Two older funnels (legacy /quiz and /plan-selection) still run with different logic and products, so the same man can be sent to different treatments depending on the entry page.


## Opportunities
- Ask the real safety questions before payment (heart, blood pressure, fertility plans, mood, earlier side effects) and let them visibly steer the offer, then say 'likely suitable, a clinician will confirm' instead of 'approved'.
- Start with licensed finasteride and step up to dutasteride only on a reason (no response, intolerance) and say why.
- Triage patchy, sudden or recent loss and scalp symptoms (redness, burning, scaling) to a clinician instead of passing them silently.
- Serve women: Keeps sends them away; a combined men-and-women service with a proper female pathway (pregnancy, contraception, PCOS) is an open gap.
- Show the renewal price next to the first-order price.


## Verification verdict
Good trust for what happens before the account wall. Every high-impact rule I re-tested (9 rules, 13 live runs plus code re-reads of the current served chunks) came out as recorded, the three baselines replayed to the same product and price, and 16 product price and strength facts matched the live price data. The main fault found was the women's route: the report said women are referred to Nurx, but the quiz never routes there; women are simply blocked by the tick box and told by the FAQ that Keeps is for people assigned male at birth. A few labels were tightened. The report cannot say anything reliable about the medical intake or the clinician's decisions, which sit behind payment and sign-in, and prices are time-limited promotions.


---

# LloydsPharmacy Online Doctor (UK) — digest
Slug: lloyds-online-doctor · Verified: yes · Audiences: men

Model: UK online pharmacy and doctor service (Shopify shop front plus a server-driven questionnaire engine) selling licensed and off-label prescription hair-loss medicines to men.
Account wall: No sign-in is needed for the questions or the recommendation. "Continue as a new patient" (…/clinic/hair-loss?guest) starts as a guest. After the recommendation, choosing a product, the pack size (Add to basket) and a finasteride safety screen, the last screen is "Please confirm the following to complete your consultation" (question 100467, "I confirm the above"). The walk stopped there and did not press it, so the exact sign-in point (expected straight after it) was not seen.
Tested by: live-walk, site-code, public-docs
Coverage: Stage 1 walked every question on the baseline path and every option one level deep. Stage 2 (24 Nov 2026) replayed the baseline and ran 33 one-change experiments to the recommendation screen, comparing cards and wording (runs/e01 to runs/e33). Options not replayed are marked unknown or inferred. Stage 3 (24 Nov 2026) replayed the baseline and 8 key rules (all confirmed) and filled 7 gaps (phaeochromocytoma, porphyria, SLE, scalp creams, eGFR not tested, testosterone, and one two-change combination); see verification.

Questions: 53 (53 before sign-in; 28 branch). Flows: men (53q)

## Engine summary
A server-side rules engine (one screen per answer) works as a subtraction filter. It starts from six cards for every eligible man (two combination packs, generic finasteride, oral minoxidil, Sons minoxidil spray, Propecia) and removes whole drug families: any finasteride exclusion (baby plans, breast or prostate cancer, breast tissue enlargement, sex-life problems, 5-ARI or ED medicines, allergy, mood opt-out, past side effects declined) drops every finasteride product; heart/BP disease, BP medicines or minoxidil allergy drop every minoxidil product, even the spray; age 65+, kidney disease, phaeochromocytoma, porphyria, SLE or ED tablets drop oral minoxidil; scalp changes or medicated scalp creams drop topicals. When both families are gone, the questions end early with no product. Hard stops end the questions for women, under-18s, non-pattern loss and severe kidney or liver disease. Answers never change strength, dose, plan or price, and never add a product: history and efficacy answers only change the result wording. Follow-up questions are skipped once the drug they protect is gone.


## Strengths
- Free, anonymous route to a named-clinician recommendation with prices before any account.
- Clear, consistent safety logic: removes whole drug families for real contraindications (heart/BP, ED tablets with oral minoxidil, age 65+, kidney disease, 5-ARI use).
- Smart skipping: pets and pregnancy questions disappear once the drug they relate to is off the table, so the patient is not asked irrelevant questions.
- Takes a proper treatment history: benefit, duration, adherence and side effects for each previous product, and lets the patient choose to retry finasteride after side effects.
- Mental-health screen with a finasteride opt-out and crisis signposting; expectation-setting for temple-only and extensive loss.


## Weaknesses
- Men only: women are stopped after one question.
- Several removals are silent: breast or prostate cancer, sex-life problems, heart/BP, age 65+ and kidney disease change the offer with no screen explaining why.
- Blunt rules: a heart or BP condition (even treated, mild hypertension) removes the minoxidil spray as well as tablets; "problems with my sex life" removes finasteride outright instead of discussing it.
- No personalisation of strength, dose or plan: one 1 mg finasteride, one minoxidil tablet strength, one 5% spray. A failed product is still offered with only a wording change; no stronger or alternative option (e.g. compounded or dutasteride) exists.
- Combination packs lead the result screen while flagged out of stock.
- No questions on goals, how far the loss has progressed over time, family history, diet, stress, thyroid or iron, or photos before the recommendation.


## Opportunities
- A women's hair-loss service (none here).
- Products for men excluded from both drugs (e.g. heart/BP plus finasteride exclusion) currently get nothing: offer non-drug or cosmetic routes and GP signposting.
- Strength and format choice: low-dose oral minoxidil titration, foam for sensitive scalps, topical finasteride, or a step-up for non-responders.
- Explain every removal on the result screen and give a next step, which Lloyds does not do for its silent exclusions.
- In-stock combination packs: Lloyds leads with combinations it cannot supply.


## Verification verdict
High trust for what it covers. All 8 high-impact rules re-tested live in stage 3 gave exactly the recorded result: heart/BP removes every minoxidil product, age 65 removes oral minoxidil, ED tablets leave only the spray, trying for a baby and prostate cancer remove every finasteride product, and female, sudden onset and eGFR under 30 end the questions. The baseline replay matched card for card, and all 7 product prices and strengths match the live pages. No rule was contradicted; one wording error was fixed (a woman is still asked her date of birth), and seven gaps were filled, all fitting the same subtraction engine. The weak points are what was never seen: the account wall after the final consent, a few rare options, and answer combinations other than the one tested.


---

# Numan (UK) — digest
Slug: numan · Verified: yes · Audiences: men

Model: UK online men's health clinic and pharmacy: an anonymous questionnaire, then the patient picks a subscription product, pays upfront for 3, 6 or 12 months, and a clinician reviews the request after checkout.
Account wall: At …/subscribe/hair-loss/<draft id>/profile, after the questionnaire, GP choice, optional email (skippable), product selection, 'what to expect', billing frequency and add-ons. The screen shows the order summary and asks for email, password, legal name, date of birth, phone, sex and delivery address. The full recommendation and all plan prices are visible before it. Direct purchase of Rosemary Oil hits the same form on its first screen.
Tested by: live-walk, site-code, public-docs
Coverage: Stage 1 mapped all 29 questions and every option's served result. Stage 2 (23 Nov 2026) replayed the baseline to the account wall and ran 32 one-change replays to the product screen (runs/x2-*), covering every option that the served data or stage 1 suggested could change the offer: both allergies, lactose, each scalp symptom alone, every caution and its opt-out, the whole mental-health branch, three stops, a stop-bypass, age 65+, three patterns, two preference answers, medical history and two entry links with an allergy. Nothing after the account wall was tried. No contact details were entered anywhere. Stage 3 (24 Nov 2026) replayed the baseline twice (to the product screen and to the account wall), re-tested ten stage-2 rules and ran the main untested options (Complete, 65+ No, Temples, Moderate, asthma and baby opt-ins, lactose small, All of the above, the minoxidil entry link, a two-rule pair with and without an entry link, and the Finasteride billing screen): 22 replays in runs/verify-*.

Questions: 41 (38 before sign-in; 13 branch). Flows: men (39q), men-product-entry (0q), rosemary-direct (1q), supplement-direct (1q)

## Engine summary
Numan's engine is simple. The server serves one question at a time and a few answers stop the consultation (under 18, patchy or complete loss, sudden onset, 65+ saying No), but every stop has a 'Review your answers' button that lets the patient change the answer and carry on. After each answer the server works out two yes/no flags, finasteride allowed and minoxidil allowed, plus an allergy list. The product screen hides every product containing a drug that is not allowed and features one product: the three-part kit by default, the product in the entry link if there was one (even when its drug is ruled out), or the first product left (Finasteride or Extra Strength Spray). Live tests show only seven answers move a flag: either drug allergy, scalp pain/itching, red rinds/rashes, any blood-pressure diagnosis (minoxidil off), and 'minoxidil only', specialist-managed mental health or recent suicidal thoughts (finasteride off). Everything else, including psoriasis/eczema and the patient's own 'I do not wish to be considered' answers for prostate monitoring, asthma and trying for a baby, changes nothing on screen: it only becomes a note for the clinician who reviews the order after payment details are taken. Pattern, age over 65 and preferences never change the offer. There is no dose or strength choice in the quiz: each product has one strength.


## Strengths
- Fast and low friction: 8 questions for a straightforward man, the full offer and every price before any sign-in.
- A clear, tested safety filter for the two drugs: allergies, scalp inflammation and blood pressure remove minoxidil, and mood risk removes finasteride, on screen and before checkout (x2 runs).
- Targeted follow-ups: each caution opens its own short explanation and choice instead of a long form; specialist-managed patients skip irrelevant questions.
- Detailed written clinician instructions sit behind every risky answer (in the served data), so the human review has a playbook.
- Always leaves something to buy (Rosemary Oil), and the money-back guarantee and kit discounts are visible throughout.


## Weaknesses
- Patient opt-outs are ignored on screen: 'I do not wish to be considered for finasteride' (prostate monitoring, trying for a baby) and 'not topical' (asthma, dandruff) leave those products on offer and the finasteride kit featured (x2-09, x2-11, x2-12, x2-07).
- Psoriasis/eczema on the scalp does not remove minoxidil, although Numan's own clinician note says minoxidil is not suitable with an active scalp condition (x2-08); pain/itching and red rinds do remove it.
- Product links bypass the safety filter: the entry product stays featured even with an allergy to its drug (x2-20, x2-21, verify-08) or when its drug is ruled out by a scalp answer (verify-21: Regaine offered with scalp pain and a finasteride allergy).
- Stops are soft: 'Review your answers' lets anyone change a stopping answer and continue in the same draft (x2-32).
- Suicidal thoughts in the past year give no stop or signposting screen; the man is simply moved to minoxidil products (x2-16). A recent mental-health dose change skips the suicidal-thoughts question altogether (x2-17).
- Ticking blood pressure removes minoxidil even when the man says he understands and wants it (x2-30): blunt for well-controlled hypertension on topical minoxidil (our clinical view, inferred).
- Thin history: no exact age, duration, family history, previous treatments or side effects, sexual side-effect history, or treatment preference (tablet vs topical); lactose 'none' does not remove the tablets (x2-18).
- Men only: no women's consultation at all; the only consultation requires 'assigned male at birth'.


## Opportunities
- Serve women: a female pattern hair-loss consultation (topical and oral minoxidil, spironolactone pathways) is entirely missing at Numan.
- Honour patient choices at once: if someone opts out of a drug or a form, show only what they asked for, and explain why.
- Offer strength and form choices (oral minoxidil, several minoxidil strengths, topical finasteride on its own). Numan has topical finasteride only inside its combination spray, and its quiz never asks about strength or form.
- Collect a fuller history (duration, family history, previous treatment and side effects, sexual function, photos) and use it to personalise and to set expectations.
- Stronger mental-health safety: a crisis signposting screen for recent suicidal thoughts and asking it regardless of dose changes.
- Close the entry-link gap and lock stop screens for the session, then advertise the stricter safety as a trust point.


## Verification verdict
Trustworthy as labelled. Every high-consequence rule I re-tested (ten of them, plus both baselines) gave exactly the recorded result, and the live catalogue and product pages match the recorded names, strengths and prices. I found no contradicted rule. The errors I found were small: two stops and one pair rule rested on code or a mixed walk (now observed), one opportunity wrongly said Numan has no topical finasteride, and one clinical opinion was not labelled. The new finding is that product entry links beat the eligibility flags as well as the allergy flags. The main limit is structural: the engine's flags are computed on Numan's server and everything after the account wall, including the clinician's final decision, is unseen, so the report describes what the anonymous quiz offers, not what is finally prescribed.


---

# Oxford Online Pharmacy (UK) — digest
Slug: oxford-online-pharmacy · Verified: yes · Audiences: men, women

Model: Family-owned UK online pharmacy with its own prescribers: the customer picks a product, answers a medical questionnaire, pays, and a doctor or pharmacist prescriber approves or declines. One-off orders, no subscription. (Built from third-party public sources only; the company's own site could not be opened.)
Account wall: docs only, not observed: the women's page lists the steps as start consultation → complete the consultation (medical history, photos of hair) → add the programme to the basket → log in or create an account → pay. So the questions come before the account wall, and payment comes before prescriber review. Not seen live: the site blocks this machine.
Tested by: public-docs
Coverage: No page of the company's site could be opened, so no live replay and no one-change experiments were possible. Stage 2 added the product catalogue (16 items with pack prices) and the consultation's topics from web-search snippets of the company's own pages, including the hair-loss consultation page (/consultation/23). Search snippets are summaries of indexed copies, some years old; no exact question wording or option list is known. Stage 3 re-checked prices and rules against fresh domain-filtered search summaries; several prices were corrected and three products added. Still no live replay.

Questions: 0 (0 before sign-in; 0 branch). Flows: hair (0q)

## Engine summary
Oxford Online Pharmacy is a catalogue pharmacy, not a recommender. The customer picks a product and pack size, then completes a short (about 3-minute) questionnaire. The form screens sex, age, partner pregnancy, heart and blood-pressure problems, mood, liver and kidney disease, allergies and previous treatment, and asks consent to tell the GP. Hard limits sit mainly with the prescriber after payment: men only for finasteride, dutasteride and oral minoxidil; over 18; dutasteride only after 6+ months of finasteride; oral minoxidil 2.5 mg only, at the usual dose, with blood-pressure checks. Women go to a separate programme that needs a blood test. None of this was seen live; it comes from the company's pages and reviews.


## Strengths
- Very wide range for men: generic and branded finasteride, dutasteride, oral minoxidil (generic and Loniten), a compounded finasteride + minoxidil + tretinoin spray, topical minoxidil and bundles.
- Low, transparent pack prices with no subscription; long packs (168 tablets, 180 capsules) cut the monthly cost.
- Clear safety stance: finasteride-first, off-label documents, GP informed, blood-pressure checks for oral minoxidil.
- Large trust signal (35,000+ Trustpilot reviews, 4.7).


## Weaknesses
- Payment is taken before the prescriber decides; refusals (dutasteride, early reorders, women) come after checkout.
- Customer chooses the drug; the questionnaire does not appear to recommend or personalise a plan.
- Weak women's offer: oral treatments refused, programme needs a blood test and the drug is not named; pages conflict.
- Only 2.5 mg minoxidil tablets, so patients must split tablets for the usual starting dose.
- New consultation for every reorder.


## Opportunities
- A guided consultation that recommends a plan (and screens before payment) would beat their pick-then-pay flow.
- Women's hair loss: offer clear licensed and off-label options (topical minoxidil, oral minoxidil low dose, spironolactone) with transparent eligibility.
- Lower-strength oral minoxidil (1.25 mg or less) to avoid tablet splitting.
- Publish the compounded spray strengths and price clearly; Oxford does not.
- Follow-up and progress tracking (photos, check-ins) are not part of their model.


## Verification verdict
Treat this as a desk-research profile, not a tested map of the engine. The Cloudflare check blocked every live and fetch attempt at all three stages, so no answer was ever changed and no screen was seen; every fact comes from search summaries of the company's own pages or from Trustpilot. Within that limit the labels are now honest: nothing claims to be observed or read from code, prices were re-checked and one clear error (generic dutasteride priced as Avodart) fixed, and the main eligibility rule (prescription hair-loss tablets for men only) is well supported. The product list is fairly complete for licensed and OTC items, but prices may be out of date, the compounded spray is barely documented, and the consultation's wording, options and in-form logic remain unknown.


---

# Philip Kingsley (PK Lab) (UK) — digest
Slug: philip-kingsley · Verified: yes · Audiences: men, women

Model: Heritage trichology clinic and haircare brand selling compounded (unlicensed) minoxidil/finasteride subscriptions through an online quiz, with paid trichologist consultations as the fallback route.
Account wall: Straight after the last question of every quiz (step *_step_user, "Almost done! Your details": first name, last name, date of birth, email, password, a GP-information tick, a consent tick with four statements, and an optional newsletter tick). It comes BEFORE any result: the plan choice and the consultation screen are only shown after /quiz/step/register.
Tested by: live-walk, site-code, public-docs
Coverage: Stage 1 walked all three quizzes to the account wall and saved the full served quiz definition. Stage 2 replayed the three baselines and 44 variants (42 one-change, 2 deliberate two-change contrasts) (47 replays, runs/b-* , m*, w*, s01), each to the wall. At the wall the site's own client function window.quiz.checkProductAvailability() was run read-only in the live page (scratch/walk-eval.js), which returns the SKUs the results page would list; it matched the Python port of the rules in all 47 runs, so the served rules have not changed. Follow-up questions (show-ifs) were seen live; no answer produced a warning screen, stop screen or different wall before registration. Results screens themselves were not seen (account wall). Stage 3 (independent verify, 24 Nov 2026): 3 fresh baselines and 19 variants (runs/verify-*), 12 of them on options never replayed before, 3 deliberate two-change contrasts; all 22 matched an independent port of the rule check (scratch/verify/engine.js) and the served rules were byte-identical to the saved definitions. 12 product pages, both leaflets and the clinic price list were re-read live.

Questions: 70 (67 before sign-in; 48 branch). Flows: men (26q), women (29q), scalp (15q)

## Engine summary
A rules engine that runs in the browser and is fully visible. Each product SKU has "conditions" (hair-loss picture, density, age, scalp state) that must be true and "blockers" (safety answers) that must all be false; questions are matched by their on-screen label text. The served rules put each passing SKU in a "Recommended" or "Other" group (the rendered results page itself was not seen); if none passes, the person gets the "Choose your consultation type" screen (in-clinic or virtual initial consultation with a booking calendar; the screen shows no price, the clinic price list says virtual from £200, clinic from £345). That is the three-route triage: subscribe (something passes), consultation (everything blocked), or the clinic booking link that skips the quiz. What decides the route: (1) safety answers block everything (men: sudden or not-yet-noticed loss, pain/burning/crusting/bleeding, cancer or PSA monitoring, depression or anxiety, trying for a baby, severe itching or dandruff, allergy to both actives; women: pregnant or breastfeeding, chemotherapy, patches, band-like or other patterns, psoriasis, redness, acne, other or moderate-to-severe scalp symptoms, minoxidil allergy, oral minoxidil); (2) the hair-loss picture picks the product family (men: Temples / Temples and Crown / Early signs get minoxidil, oral finasteride and combination plans; Patchy, Extensive and reduced-density pictures keep only two unnamed SKUs; women: shedding gets cosmetic Hair Shedding Drops, other common pictures get the main SKU PHI1749); (3) mild scalp symptoms swap hair-loss plans for "Healthy Scalp" plans; (4) single allergies remove the matching active; men 50+ with Early signs or Temples lose oral finasteride. Family history, density for the common pictures, onset timing within gradual loss, medicines, other allergies, menopause and HRT change nothing. Women's hair type and styling answers only pick a haircare add-on. All of this was checked in 47 stage 2 and 22 stage 3 live replays by running the site's own rule function at the wall (every one matched the served rules, which were byte-identical to the saved copy on 24 Nov 2026); the results screen itself needs an account, and it comes before any result, so nobody learns their route (even a £200+ consultation) until they have registered.


## Strengths
- One transparent, simple triage: every product has explicit safety blockers, and anyone who trips one is routed to a paid trichologist consultation rather than refused.
- Consultation fallback is a real service with a calendar (virtual or clinic; trichologist or senior trichologist; male or female consultant).
- Scalp-first approach: mild scalp symptoms swap hair-loss plans for "Healthy Scalp" plans; severe symptoms go to a consultation; a separate scalp quiz exists.
- Women have their own quiz with a shedding route (cosmetic Hair Shedding Drops) and a haircare add-on chosen from hair type, length and styling: a natural upsell.
- Strong safety coverage for a short quiz: cancer/PSA, depression with a specific finasteride mood warning, trying for a baby, pregnancy, chemotherapy and oral minoxidil are all screened before any product.
- Men must confirm on the start screen that the finasteride and minoxidil products are unlicensed; leaflets say they are made under pharmacist supervision.


## Weaknesses
- Account wall before any result: name, date of birth, email and password are taken before the person learns whether they get a plan or must pay £200-£345 for a consultation. The wall screen is identical for both routes (44 live variants checked).
- Configuration errors in the served rules: the blood-pressure blocker has a leading space, so men who tick uncontrolled low or high blood pressure are still offered minoxidil 5% and the combination plans (live runs/m25); the 3% Combination Plan can never be offered; PHI1230 and PHI1770-1772 can never fire; label typos ("curerrently", "redness??").
- Women: sudden loss with a widening parting is not escalated (live runs/w09), while the same change with overall thinning is (runs/w10); menopause and HRT answers are unused; no finasteride product is ever offered to women online.
- Thin clinical screen: no under-18 answer (age bands start at 18; the women's quiz asks no age at all), one tick-box for blood pressure, no heart, kidney, liver or sexual side-effect questions; medicines and allergies are free text that no rule reads.
- Men with Patchy, Extensive or reduced-density loss, or psoriasis/redness, are not routed to a consultation in the rules; they keep two unnamed SKUs (PHI1220, PHI1221). Whether these are still sold decides what they see.
- Family history and hair density do not change the offer for the common male pictures, and the women's "how noticeable" follow-ups are never used: questions that look diagnostic are decoration.
- Mixed messages: the men's page says "FULLY LICENSED" while leaflets say unlicensed; prices differ between pages (oral finasteride £40 vs £42; virtual consultation from £150 vs from £200).
- Who prescribes is not stated anywhere public (trichologists are not prescribers; leaflets only say "pharmacist supervision").


## Opportunities
- Show the route (plan or consultation, and its price) before asking for an account. PK makes people register before they find out they owe £200+.
- Offer a cheaper middle route for the people PK sends to a £200-£345 consultation (sudden shedding, mild-to-moderate scalp symptoms, patchy loss): a prescriber review with photos at a fixed lower price.
- A prescriber-led women's offer: PK sells women only a minoxidil-type drop or cosmetic shedding drops online; no oral minoxidil, spironolactone or topical finasteride for post-menopausal women, and menopause answers are ignored.
- Use the answers PK collects but ignores (family history, density, menopause, medicines) to personalise strength and expectations: an easy way to look more clinical.
- Clear licensing and prescriber information, and a blood-pressure and heart screen that actually works, as trust signals against a premium brand whose rules contain visible mistakes.


## Verification verdict
Trustworthy as labelled for what the quiz asks and how its rules decide. The served rule set was byte-identical to the saved copy, the three baselines reproduced exactly, and 19 more live replays (12 on options nobody had tested) each matched an independent port of the site's own rule check, so every "code" rule in this file can be relied on as a description of the client-side engine on 24 Nov 2026. No rule was contradicted. The main errors found were labelling, not substance: option effect types that called a severity follow-up a hard stop, prices attributed to a screen that does not show them, a few assumptions written as fact, one wrong audience and two missing cosmetic products; all are fixed. The real limit is the account wall: nobody has seen the rendered results page, and six SKUs (including the women's main product PHI1749) remain unnamed, so "what product a person finally sees" is a strong code-based prediction, not an observation.


---

# Ro (Roman) (US) — digest
Slug: ro · Verified: NO (not independently checked) · Audiences: men, women

Model: US direct-to-patient telehealth company: an online questionnaire ('online visit') reviewed by a US-licensed clinician, with its own pharmacy shipping generic, off-label and compounded hair-loss medicines on quarterly or longer subscriptions.
Account wall: Men (start.ro.co/fxdxbh): after 3 marketing questions, on screen qid 55, an email pop-up ('See how much fuller your hair could be in just 3 months', email + two consent boxes, or Continue with Google) that cannot be dismissed. Women (start.ro.co/tefcyb): after 3 or 4 hair questions, on screen qid 16 'Thanks for sharing. Ready to go deeper?' (Sign up with Email / Continue with Google). Topical minoxidil, shampoo and conditioner: sign-up is the first or second screen. In every flow the wall comes before any medical question and before any recommendation.
Tested by: live-walk, site-code, public-docs
Coverage: Stages 1 and 2. LIVE: every question that can be reached without an account was replayed with one answer changed at a time (21 replays in stage 2: men 3 questions, women 4), and three direct-purchase entries were opened in stage 1. Every replay ended at the account wall with no product or price shown. CODE: the consultation app itself downloads the complete question schema for each flow (every question, option, fork rule and variable change behind the wall) and the men's recommendation function is in a public JS chunk. Stage 2 ran those definitions through an offline simulator, one change at a time (291 simulated runs: 161 men, 130 women, saved in runs/sim/), which is where every post-wall rule and recommendation comes from. These are labelled 'code', not 'observed'. No email, phone, name or other contact detail was entered, nothing was submitted, no photo or payment was given. Honest note: on the first answer the page itself creates an anonymous draft visitor record and posts each answer to it; that is the site's normal anonymous behaviour, and each live replay leaves one such draft.

Questions: 137 (13 before sign-in; 30 branch). Flows: men (71q), women (63q), otc-direct (3q)

## Engine summary
Ro runs two different engines, and both can be read in full from code the site serves to any visitor. MEN: a 'soft steer' engine. Three marketing questions, then an email wall, then the medical questionnaire (the baseline man passes 19 screens up to the recommendation; reporting past treatments or conditions adds follow-ups). Nothing medical stops a man (only age under 18, female sex or an unserved zip code). Answers switch on up to three 'do not recommend' flags, one per treatment. A fixed priority list (Ro Mane Spray, then finasteride 1 mg tablets, then oral minoxidil 2.5 mg tablets) makes the first unflagged treatment the 'recommended' one, but all three stay on the screen and can be picked, on a default quarterly plan, and a clinician decides afterwards. In the offline one-change sweep the compounded spray, the dearest product, was recommended for every profile except: finasteride-type worries (depression, anxiety, erectile dysfunction, trying for a baby, past finasteride problems) which move the pick to oral minoxidil; prostate cancer or a topical allergy, which move it to finasteride tablets; and five 'another diagnosis?' answers (patches, very sudden onset, scalp redness, past steroid injections, persistently low blood pressure) which remove the recommendation but not the products. Heart and blood-pressure red flags only flag the minoxidil tablet, so the minoxidil spray stays recommended. Goals, severity and pattern only personalise a recap screen. WOMEN: a 'gate' engine. Three or four hair questions, then the sign-up wall, then the medical questionnaire (the baseline woman passes 31 screens up to the product choice). Pregnancy, any diagnosed scalp condition, signs of virilisation, lupus or autoimmune disease, past scalp steroid injections and minoxidil allergy end the visit with a referral. Breastfeeding, cardiovascular conditions, high blood pressure and age 66+ remove the tablet and leave only the compounded topical. Everyone else chooses between oral minoxidil ($30 a month) and Hair Solution Rx ($40 a month), with 'No preference' defaulting to the tablet; pattern, severity and symptoms never change the options. Before either wall the answers change only the wording or number of the next question (observed live); no product or price appears. Non-prescription products (5% minoxidil solution, shampoo, conditioner) are sold through separate links with no questions.


## Strengths
- Very short path to sign-up (3 to 4 easy questions) with the long medical questionnaire kept until after the email is captured; 21 live replays never showed a dead end before the wall.
- One clear recommended product with the alternatives still visible and pickable, and the clinician as the final check: simple for the patient and it protects conversion.
- Men's safety questions for oral minoxidil are detailed: blood-pressure follow-ups with a picture of the ranges, timed heart attack, stroke and bypass questions, arrhythmia types, resting heart rate, fainting.
- Finasteride-specific steering is thoughtful: depression, anxiety, erectile dysfunction and trying for a baby all move the recommendation away from both finasteride products, with a plain caution screen about fertility.
- Women's visit has firm, explained stop screens (pregnancy, scarring and autoimmune alopecias, virilisation signs) with a find-a-dermatologist link, plus scalp photos and tracked outcome scores (severity, confidence, stress).
- Clear public price for every plan length; coupons (35% or 50% off the first order) attach silently from ad links; no charge until a clinician approves.
- A broad men's range for a telehealth brand: licensed tablet, off-label oral minoxidil, a compounded 3-in-1 spray, OTC minoxidil, shampoo and conditioner.


## Weaknesses
- The men's recommendation barely uses the consultation: the same product (the highest-priced compounded spray) is recommended to every unflagged man whatever his goals, pattern or severity, including a man who reports no hair loss yet.
- No product, price or eligibility signal before the email wall; the wall pop-up cannot be closed. 'Seems too expensive' and 'Nervous about side effects' get no answer.
- Men are never stopped: patches, very sudden loss, scalp inflammation, liver failure and stage 5 kidney disease all reach checkout, relying entirely on the clinician; pain, pus bumps and eyebrow loss do not even remove the recommendation.
- Inconsistent logic visible in the schema: heart failure or angina flags the minoxidil tablet but leaves the 6% minoxidil spray recommended; prostate cancer steers towards finasteride tablets; 'finasteride tablets were not effective' still recommends the finasteride spray.
- The men's visit has no scalp-photo step (only identity photos) and no family-history question, although the FAQ says photos are requested.
- Women's product choice ignores pattern and severity, and 'No preference' defaults to the oral, off-label tablet with a boxed warning. Self-reported bald patches, scalp rash or sudden onset do not stop or redirect a woman; only a named diagnosis does.
- No finasteride, spironolactone or other anti-androgen route for women (for example after the menopause), and no pathway at all for pregnant or breastfeeding-ineligible patients beyond 'see someone else'.
- Public pages disagree with each other (the hair-loss FAQ still says finasteride is the only prescription option; the women's page says billed every 2 months while pricing says quarterly).
- The whole engine, including every clinical branch and flag, is downloadable by anyone, which makes it easy to copy and easy to game.


## Opportunities
- Show an indicative recommendation and price before asking for an email: Ro asks 3 questions and then walls everything.
- A recommendation that visibly uses what was asked (pattern, severity, goals, tablet-or-topical preference, budget) instead of one fixed product order; explain why this product was chosen for this person.
- Ask the patient's own preference (tablet, topical, 'no finasteride', 'no prescription') up front: Ro's men's flow never asks it and infers it only from medical flags.
- Explained 'see a doctor first' screens for red-flag hair loss in men (patches, sudden loss, inflamed scalp), as Ro already does for women, and a useful hand-off rather than a dead end.
- A licensed-product-first pathway (finasteride 1 mg, minoxidil 5%) with compounded products as a clearly explained second step; Ro leads with the compounded spray.
- Flexible plans: Ro's hair products start at quarterly billing; a monthly or pause-any-time plan and a visible price before sign-up would stand out.
- Better women's offer: a pathway by life stage (post-partum shedding, perimenopause, PCOS) with blood-test prompts, rather than one choice between two minoxidil products.
- Use scalp photos and family history for men, and tell patients how the photo changed the plan.
- Budget and side-effect worries are captured by Ro and then ignored: answer them directly (cheapest effective option, side-effect rates, topical-only route).


## Verification verdict
not verified


---

# Sons (UK) — digest
Slug: sons · Verified: NO (not independently checked) · Audiences: men

Model: Men-only UK hair-loss subscription brand. Its own Shopify store and consultation app sell licensed finasteride 1 mg and minoxidil 5% (Sons holds the licences), unlicensed compounded sprays and capsules, supplements and shampoos; prescribing and dispensing are done by a partner, The Independent Pharmacy (ABSM Healthcare Ltd, GPhC 9012559).
Account wall: After the last consent screen (finasteride statement). The next screen is an account form (first name, last name, email, phone, date of birth, password) titled "Based on your questionnaire results, we are now preparing your personalised health plan. Please complete your account set up to continue." No recommendation, product or price is shown before it. Pressing "Get my personalised plan" creates the account and sends the consultation together. Answering "Yes" to "Are you an existing Sons customer?" hits the sign-in page at question 1.
Tested by: live-walk, site-code, public-docs
Coverage: Stage 1 walked the baseline man to the account form and saw every conditional screen. Stage 2 replayed both baselines and then 45 one-change experiments live, each ending on the account form, the female stop notice or the sign-in page. Because no plan is shown before the account form, product effects could not be seen live: instead both copies of the recommendation code that the site serves to every visitor were run offline on the same one-change answers (28 further offline-only cases, plus all 32,768 combinations of the answers the code reads). Nothing behind the account form was tested: no account, email, phone number, date of birth, photo, payment or order was entered or created.

Questions: 71 (63 before sign-in; 17 branch). Flows: men (49q), oral-minoxidil-5mg (6q), beard (14q), clinic (2q)

## Engine summary
Sons runs one short questionnaire for men only. Sex at birth is the only gate: a woman is stopped at question 2, and a man is never stopped or warned, whatever he answers (33 live one-change replays all ended on the same account form). Nothing is recommended until he has given his name, email, phone number, date of birth and a password. After that a script in his own browser turns the answers into five on/off switches: finasteride tablet, finasteride spray, minoxidil capsule, minoxidil spray, combination spray. Each medical tick or reported side effect switches off a whole drug family: finasteride goes with a low-mood score of 2 or more, past finasteride side effects, kidney or liver disease, prostate disease or male cancers, rheumatoid arthritis, lupus or methotrexate, and sexual dysfunction; minoxidil (spray and capsule) goes with high blood pressure, heart disease and past minoxidil side effects; a scalp disorder removes the sprays that contain minoxidil; phaeochromocytoma removes the capsule; a lactose allergy removes both oral products; sudden onset removes everything on prescription. A fixed list of twelve plans is then filtered by the switches and the top one or two survivors are shown as "the plan our medical team recommend". The format preference only changes the order. The hair picture, the three sudden-onset follow-ups, the scalp tick boxes and all free text change nothing in this code. Strength never varies: each medicine comes in one strength. Hair Growth Complex, a supplement, is never removed, so there is always something to buy. Two copies of the code are served and they agree on everything except what goes first and what a man over 65 is shown. A prescriber at the partner pharmacy reviews the order afterwards and can refuse it; the server can also override the list. Those two steps are not public.


## Strengths
- Very little friction: a healthy man taps through ten screens, and no answer ever ends the journey before his contact details are captured.
- A simple, consistent rule set. Whole drug families are switched on or off, and both served copies agree on every medical rule (13 distinct outcomes in total).
- Every route has a fallback, so a sale is nearly always possible: sprays for men who cannot take tablets (lactose allergy), capsules for men who cannot use minoxidil on the scalp, finasteride alone for men with blood-pressure or heart problems, and a supplement that is never removed.
- Each plan card has a Spray/Capsule toggle, so the man can change format without retaking the questionnaire.
- Two PHQ-2 style mood questions sit in the flow, and a score of 2 or more on either removes finasteride. A finasteride safety statement (mood, sexual function, stopping before trying for a baby) is shown to every man and must be ticked.
- Cautious on minoxidil: any report of high blood pressure or heart disease removes it in every form, including the pharmacy spray.
- Optional consents to read the NHS Summary Care Record and to tell the GP, a repeat health check before renewals, and prescriber review after the order.
- Holds its own UK licences for finasteride 1 mg and minoxidil 5% and says plainly that sprays and capsules are unlicensed specials.
- A clear ladder of plans (single medicine, Core, Ultimate) with a money-back promise after six months and a partner-clinic route for transplant patients.


## Weaknesses
- No plan, product or price is shown until the visitor gives his name, email, phone number, date of birth and a password.
- The hair picture does nothing. "Random patches" and "Completely bald" lead to the same screens and the same plans as ordinary male-pattern loss (seen live and in code).
- Sudden hair loss is not stopped or referred. The man reaches the account form and the code then offers minoxidil spray, the Non-Prescription plan and a supplement. The three follow-up questions (body hair, new medicines, other symptoms) are not read by any served code.
- Red flags get no response on screen: "Nearly every day" on the hopelessness question and "open sores or infection on the scalp" both pass with no message (seen live). Low mood only removes finasteride later, silently.
- A man who ticks a scalp disorder is steered to systemic treatment: the main card becomes finasteride tablet plus oral minoxidil capsule, an unlicensed special.
- Exclusions are silent. The page holds the reasons in a hidden "Debug (Dev Only)" block but does not tell the customer why a medicine is missing.
- "I don’t mind" is treated as "Oral capsule", so a man with no preference is led to the plan containing unlicensed oral minoxidil in the older copy.
- Thin history: no question on current medicines (except one yes/no after sudden onset), allergies other than lactose, low blood pressure, family history, how long the hair has been thinning, earlier diagnosis, goals, or plans for a baby (covered only by a statement). Age is not asked before the wall. An older version of the form asked about allergies and diagnosis; they have been dropped.
- High blood pressure is all-or-nothing: no question on whether it is controlled, and even the 5% spray is removed.
- One strength per medicine and no way to choose a lower dose; the only dose change is the separate 5 mg oral minoxidil step-up for existing customers.
- The rule set runs in the browser and can be read by anyone, and the two served copies disagree on the over-65 rule and on which plan is shown first.
- Women are turned away at question 2 with no product and no signposting beyond "see a specialist or GP".
- Rough edges: "Is their hair loss over other parts of your body?", a lactose question that argues with the patient, and product pages that disagree with the leaflet on the combination spray strength.


## Opportunities
- Show a provisional plan and price before asking for contact details. Sons shows nothing until an account exists.
- Make the pattern and onset questions count: stop and refer patchy, sudden, scarring or infected-scalp cases with a clear explanation. Sons lets all of them through.
- Tell the patient why a treatment is not offered and what the alternative is, instead of silently hiding plans.
- Respond on screen to a high low-mood score with support information, not just a quiet change to the plan list.
- Ask what Sons does not: current medicines, blood-pressure control, low blood pressure or dizziness before oral minoxidil, plans for a baby as a question, duration, family history and goals. Ask age at the start.
- Serve women, whom Sons refuses outright, and offer a clear route for men over 65.
- Offer dose choice (for example a lower-strength start) and a foam or alcohol-free minoxidil; the Sons product feed lists one strength per medicine and no foam.
- Use photos or a clinician look at the scalp before prescribing. Sons asks for photos only to track progress and for its refund promise.
- Do not default the undecided to an unlicensed oral medicine: lead with licensed options and explain the difference.


## Verification verdict
not verified


---

# Strut Health (US) — digest
Slug: strut · Verified: yes · Audiences: men, women

Model: US cash-pay telehealth company (Dallas, Texas) selling compounded and generic prescription hair-loss medicines by subscription, with an online questionnaire reviewed afterwards by a licensed provider.
Account wall: Oral finasteride, topical finasteride and dutasteride forms: the first screen (e-mail + phone). Old checkout (women's formula, Hair Booster, ketoconazole, HairfectRx capsules, combos): the first screen. Oral minoxidil form: after 17 anonymous screens, at "Create account" (75% progress), before address, ID check and payment.
Tested by: live-walk, site-code, public-docs
Coverage: Stage 1 read the full definition of the four new intake forms (every screen, option and branch condition, including everything behind the account wall, and the product cards with prices) from the HTML served to an anonymous browser: those items are labelled "code". Stage 2 replayed the one walkable form, oral minoxidil, 27 times (1 baseline, 25 one-change runs, 1 combined worst-case run), and re-loaded the four walled baselines to confirm the walls: those items are labelled "observed" and name their run folder. Six rules read from code were confirmed live exactly as coded (under-18 stop, self-harm stop, three free-text follow-ups, dose picker price), and so was the code reading that the other screens have no branch (16 single options replayed). About 30 options of that form were not replayed on their own because the definition shows no branch on them; they keep the label "code". The oral finasteride, topical finasteride and dutasteride forms cannot be tested without an account. The questionnaires for the women's Strut Hair Formula, Hair Booster, ketoconazole shampoo, HairfectRx capsules and the combos are served only to signed-in users and were not seen; a few entries quote what Strut's public pages say the provider needs ("docs"). Stage 3 (independent verification, 23 Nov 2026) replayed the baseline fresh (identical), re-loaded the four walls (unchanged), re-tested 8 rules live (all confirmed), ran 6 gap tests (no effect, including a baseline woman on the oral minoxidil form), re-fetched the four live form definitions (same version IDs as the saved files) and re-read 15 product pages.

Questions: 143 (28 before sign-in; 40 branch). Flows: men-finasteride-oral (34q), finasteride-topical (37q), dutasteride (37q), oral-minoxidil (30q), old-checkout (5q)

## Engine summary
Strut has no recommendation engine. The patient chooses a product on the marketing site, and each product has its own form that sells only that product. The form is an order form with a medical questionnaire attached: in the one form that can be walked without an account (oral minoxidil) the dose and price are chosen on the second screen, before any medical question. Live testing found only three kinds of reaction: "Under 18" stops the form, "Yes" to thoughts of self-harm shows a crisis screen that cannot be passed, and "Yes" to surgeries, medicines or "anything else" adds one free-text box each. Nothing else does anything. Heart failure, heart attack, low blood pressure, pheochromocytoma, kidney disease, an allergy to minoxidil, earlier oral minoxidil, patchy, diffuse or sudden hair loss, a sore scalp, low mood, sexual dysfunction and age 61+ were each tried on their own, then together: same screens, same wording, same $65 cart, no warning. The served code shows the same design in the three forms behind the account wall, with two extra switches: "Female" is stopped in the oral finasteride form and swapped to a women's product in the topical finasteride form, and the dutasteride form lets the patient pick topical or oral. There is no scoring. Every clinical decision (approve, decline, strength, which actives go into a compounded formula) is made by a provider after the patient has created an account, passed an ID check and saved a card; Strut says patients who are "not a good candidate" are not charged.


## Strengths
- Very wide compounded range: topical finasteride or dutasteride with minoxidil 7.5%, tretinoin and fluocinolone; oral combination capsules (finasteride or dutasteride with oral minoxidil 5 mg); a latanoprost booster; a women's spironolactone and finasteride topical.
- The patient can ask for a formula (which actives to include) and for gel or solution, so the product feels made to order.
- Low entry prices with the visit and shipping included: oral finasteride $25 a month or $49 for 90 days; oral minoxidil $55 or $65 for 90 days. The card is saved, not charged, until a provider approves.
- Short, fast form: about 17 taps from welcome to the account card for oral minoxidil, one question a screen, cart always visible, single answers move on by themselves.
- A real self-harm safety net: "Yes" shows the 988 lifeline and 911 and cannot be clicked past.
- Identity check (Persona) on every order and two hairline photos on the topical forms give the provider something to review.


## Weaknesses
- No guidance at all: the visitor must already know which of 13 hair products they want. Nothing explains why one fits, and nothing is recommended.
- The account wall is the first screen for most products, so a visitor sees no question and no price confirmation before giving an e-mail and phone number.
- The form does no automatic safety screening. Heart failure, low blood pressure, pheochromocytoma and a minoxidil allergy were all accepted without a warning while oral minoxidil stayed in the cart (observed). The patient learns of a refusal only after sign-up, ID check and card.
- The oral minoxidil form asks nothing about blood pressure readings, heart rate, swelling, pregnancy or sex, and takes no photos. It shows a warning about finasteride and dutasteride, which it does not sell, and none about minoxidil.
- Red flags for other diagnoses (patchy bald spots, sudden loss, bleeding or painful scalp) get no warning, no extra question and no referral advice.
- The women's branch of the topical finasteride form has no pregnancy, breastfeeding or contraception question in the served definition.
- The dose is picked by the patient before any medical question, with the higher dose pre-selected.
- Rough edges: "End questionnaire" lands on a broken "Oops, you seem lost" page; the 1.25 mg dose shows in the cart as "2.5 mg (1.25mg)"; product facts differ between pages (tretinoin 0.0125% or 0.025%; oral minoxidil headline dose and price; dutasteride "0.1 mg to 0.6 mg" against one 0.1 mg option).
- The same generic question list is reused across products, so patients are asked things that do not apply (sexual dysfunction and a finasteride warning in the minoxidil form) and not asked things that do.


## Opportunities
- Recommend before asking for contact details: a short guided consultation that ends in "this is the treatment for you, and why" is something Strut does not offer at all.
- Make safety visible in the form: clear stop or warning screens for heart disease, low blood pressure and pregnancy, and "this may not be pattern hair loss, see a clinician" for patchy or sudden loss. Strut leaves all of this to an unseen review.
- Tell unsuitable patients early. Strut lets them create an account, verify ID and save a card before anyone says no.
- One joined-up route for women, with pregnancy, contraception, menopause and cycle questions. Strut splits women across an old checkout product and a hidden branch of a men's form.
- Ask what Strut never asks: family history, goals, how fast the loss is progressing, treatment preference (tablet or topical), blood pressure, lifestyle. These make a recommendation feel personal.
- Let the consultation choose the dose and step it up, rather than asking the patient to pick 1.25 mg or 2.5 mg.
- Range gaps in Strut's hair-loss collection as listed on 23 Nov 2026: no stand-alone topical minoxidil, no oral spironolactone for women, no devices (laser caps), no cosmetic shampoo or conditioner line beyond prescription ketoconazole, and only one supplement.


## Verification verdict
For the one form that can be walked anonymously (oral minoxidil), this report is solid: the baseline replayed identically, every consequential rule re-tested live behaved exactly as recorded (two stops, the dose price, the free-text follow-up, and the "no effect" of heart failure and minoxidil allergy), the safety stop cannot be bypassed, and six new gap tests (including a woman) found nothing new. Product names, strengths and prices match the live pages, and the page-versus-form inconsistencies the report flags are real. The conclusion that the forms themselves make no clinical decision is well supported. The weaker parts are labelled honestly: the three walled forms and all old-checkout products (including the women's formula) are known from served code or marketing text only, and nothing about how the provider decides after checkout can be seen. Trust the "observed" and "code" items; treat the "docs" items about provider decisions as Strut's claims, not tested behaviour.


---

# Superdrug Online Doctor (UK) — digest
Slug: superdrug-online-doctor · Verified: yes · Audiences: men, women

Model: High-street pharmacy brand running a doctor-led online clinic on the Zava platform: one-page questionnaire, patient picks a preferred product, pays, then a GMC doctor approves, swaps or refuses; one-off orders with reorder, no subscription.
Account wall: After the questionnaire, the product choice ('Your request') and the delivery choice. Pressing Next on Delivery redirects to /auth/register/ ('Create your patient account': first name, last name, email, password, date of birth, gender, optional mobile). Seen in runs/baseline-men-wall. Just before the wall the patient has already seen the full product list with prices and the delivery options.
Tested by: live-walk, site-code, public-docs
Coverage: Stage 1 mapped all three entry points and both full questionnaire definitions. Stage 2 replayed the three baselines and ran 40 one-change experiments (22 women, 18 men). Stage 3 (independent check) replayed the baselines again, re-tested 11 key rules live, added the last untested men's options (specialist diagnosis, pattern B, skin condition, peanut and other-substance allergy) and two women's combinations. Every question option except delivery choices and the men's 'Other medications' allergy has now been replayed. Age, sex and the doctor's decision sit behind the account wall and were not tested.

Questions: 57 (54 before sign-in; 20 branch). Flows: men (37q), women (20q)

## Engine summary
Superdrug Online Doctor (Zava platform) runs no recommendation engine. Each service is a one-page medical questionnaire with show/hide follow-ups, followed by a product list the patient picks from; the doctor decides after account creation and payment. Men: the list is fixed (generic finasteride or Propecia in four pack sizes, or a £25 phone consultation). Sixteen one-change replays, including prostate cancer, breast cancer and finasteride allergy, never changed it; the only on-screen effects are warning texts (scalp symptoms, erection problems, advanced pattern E) and a photo upload that blocks the form for patterns A, E and 'none fits'. Women: a server-side product-rules call silently removes products by ingredient and suitability: Regaine for Women goes for high blood pressure, heart disease, non-pattern presentations and minoxidil/ethanol/propylene glycol allergy; Nourkrin for fish allergy; Alpecin for caffeine allergy. Removals add up: a woman allergic to minoxidil, fish and caffeine is left with only the phone consultation, with no message. Pregnancy changes nothing. No answer ever stops the patient before the account wall.


## Strengths
- Trusted high-street brand; CQC-registered doctor service and GPhC-registered Superdrug pharmacies.
- Very short: one page, no account until after product and delivery choice, prices shown up front.
- Low generic finasteride price (£27 a month, £137 for six months) with free delivery or free store collection.
- Women's list is filtered by ingredient allergies and minoxidil safety (blood pressure, heart, non-pattern loss) before the patient chooses, so unsuitable items never show.
- Asks for photos when the chosen pattern does not look like typical male pattern loss, and sets realistic expectations for advanced loss.
- Clear consent text on fertility, depression, PSA and sexual side effects.


## Weaknesses
- Men's screen is not acted on: finasteride allergy, prostate or breast cancer, past low mood on finasteride and sudden loss all still show finasteride and Propecia with no answer-specific warning (only the general consent text); everything waits for the doctor after payment.
- Pregnancy and breastfeeding do not remove Regaine for Women or show any warning, although the product should not be used then.
- Removals for women are silent: no explanation of why a product disappeared or what to do instead.
- Men are offered tablets only: no topical finasteride, no minoxidil (Regaine for Men is advertised but not in the flow), no oral minoxidil, no combinations.
- No guidance on which product or pack to choose; no personalisation, no 'recommended' result.
- No questions on mood or mental health, family history, age, or fertility plans for men; none on periods, menopause, contraception, PCOS, thyroid or iron for women.
- No subscription or follow-up programme; every supply is a new order. Inconsistent site copy (discount codes, phone-consultation days).
- A woman with several allergies can be left with only the £25 phone consultation and no explanation (runs/verify-w-combo3).


## Opportunities
- Act on safety answers before payment (stop or switch on finasteride allergy, breast cancer, depression history) and explain why.
- Offer a guided result with a reason ('this suits you because…') and an alternative when a product is removed.
- Sell topical and combination options for men (topical finasteride, minoxidil, oral minoxidil under a prescriber).
- A real women's pathway: differential questions (menopause, PCOS, iron, thyroid, post-partum) and prescription options such as oral minoxidil or spironolactone.
- Subscription with check-ins and progress photos to support adherence over the 3 to 6 months finasteride needs.


## Verification verdict
This report can be trusted for what it says about the anonymous part of the journey. Every baseline and all 11 high-consequence rules I re-tested came out the same as recorded, the product names, strengths and prices match the live pages, and every run folder cited exists. The main faults were labelling, not facts: 'flag-for-clinician' was claimed as observed when only 'no change' was seen, and a few options were filled in from the definition; these are now corrected or replayed. The report says nothing reliable about what the doctor does after payment, about age or sex handling, or about men who need to upload photos, and it is honest about that.


---

# Treated (UK) — digest
Slug: treated · Verified: yes · Audiences: men

Model: Multi-condition UK online doctor and pharmacy; hair loss is a men-only condition sold through one generic questionnaire with licensed and off-label tablets and branded minoxidil on monthly-to-6-monthly subscriptions.
Account wall: Checkout 'Patient details' page (start.treated.com/GBR/en/#/checkout): first name, last name, date of birth, email, phone. Reached after the questionnaire, height/weight, medical profile, the treatment options screen and the product questions. The full recommendation screen and prices are shown before the wall.
Tested by: live-walk, site-code, public-docs
Coverage: Men's flow walked to the treatment options screen in 21 one-change replays (runs/e00–e20) plus stage 1 walks to the account wall from the general entry and the Dutasteride, Avodart, Regaine and Propecia entries. Question set and per-option actions from the served definition (quiz-definition-male.json); product list, prices and automatic-offer limits from gettreatmentoptions, compared run by run (scripts/summ.js, scripts/odiff.js). Women: hard stop. Nothing after the account wall. Stage 3 (verify) replayed both baselines and 11 more cases fresh (runs/verify-*), re-read the live product pages and found the review/auto messages are only in the server response, not on screen.

Questions: 25 (24 before sign-in; 14 branch). Flows: men (25q)

## Engine summary
Treated runs one short men-only questionnaire (11 questions, height and weight, a general medical profile) and then always shows the same five products with prices, with Finasteride 1mg pre-selected (or the product of the page the man came from). The answers do not choose the medicine. They decide two things: whether the man is stopped (female, or any history of mental illness), and whether the case is an automatic offer or goes to clinician review. That decision sits in the server response (mode Auto or Offline); the patient sees the same screen either way. Almost any non-standard answer, and simply never having used treatment or not having seen a doctor, sends the case to review, so most first-time buyers are reviewed after paying. Only in the automatic offer are per-product limits applied: smoking or any alcohol removes the two dutasteride products. Date of birth is asked only after the account wall. BMI over 35 sends the whole case to review, even from the Dutasteride link.


## Strengths
- Full price list, all strengths and plans, and a pre-selected product shown before any contact details: very low friction.
- Fast, clear questionnaire (11 short questions plus height, weight and a profile) with tick-box answers.
- Server-side automatic-offer engine with per-product limits (age, BMI, smoking, drinking, medical profile), so products can be filtered without changing the questions.
- Clear safety stop for a history of mental illness with finasteride, and explicit off-label and side-effect acknowledgements for dutasteride before checkout.
- Product landing pages pre-select their product, so ad traffic lands straight on what it clicked.


## Weaknesses
- No women's hair-loss service (hard stop on sex). The only women's products (Regaine for Women) sit in a telogen effluvium category marked "Not available".
- The answers barely personalise the offer: the same five products and the same default for almost everyone; previous treatment, failure or side effects do not move a man to a different product.
- The mental-illness stop is blunt: it blocks minoxidil too, and anxiety alone ends the consultation.
- Low blood pressure is not screened against minoxidil; heart disease only flags review and Regaine stays listed.
- Age is not asked until checkout, so the 18–49 limit cannot act before the wall.
- Blanket review flags (never used treatment, not seen a doctor) mean most first-time buyers go to clinician review; the screen does not tell them so (the review message is only in the server response).
- Smoking (even ex-smokers) or any alcohol removes dutasteride from the automatic offer; we could not see a clinical reason for this (our judgement, not the company's statement).
- No scalp photos, no Norwood stage, no goals or preferences (tablet vs topical) asked before the wall.
- Compounded finasteride + minoxidil drops listed but not available; no topical finasteride, no oral minoxidil, no combination spray.


## Opportunities
- Women's hair loss (topical and oral minoxidil, spironolactone, combination topicals) is untouched by Treated.
- Compounded combinations (topical finasteride + minoxidil sprays, oral minoxidil) are not sold: their only combo shows "Not available".
- A consultation that uses previous treatment response and side effects to switch product (e.g. finasteride side effects → topical, minoxidil failure → oral) would be visibly smarter.
- Ask preference (tablet vs topical, no finasteride) and Norwood stage with pictures to personalise the plan.
- Screen low blood pressure and cardiac history properly for minoxidil, and offer a minoxidil-only route for men with mood history instead of a full stop.
- Check age before showing prices, and give an honest "your clinician will review" timeline up front.


## Verification verdict
Trustworthy as labelled for what an anonymous man sees. Both baselines and the eight highest-impact rules (female stop, mental-illness stop, smoking and alcohol removing dutasteride, product-link fallback, BMI, low blood pressure, review flags) were re-tested live and held. The one real error was presentational: earlier stages said the review or recommendation message appears on screen, but it only exists in the server response, so a patient cannot tell an automatic offer from a review case. Prices and strengths match the live pages. Remaining gaps are code-based rules marked as code, the age limit and everything behind the account wall.


---

# Voy (formerly Manual) (UK) — digest
Slug: voy · Verified: yes · Audiences: men, women

Model: UK subscription telehealth: online quiz, remote prescriber review, own distance-selling pharmacy; sells licensed finasteride plus own-brand unlicensed specials (10% minoxidil spray, combined finasteride or dutasteride + minoxidil capsules, topical combination spray) and add-on shampoo and vitamins.
Account wall: The real consultation was never reached (security checkpoint before the first question), so the exact place of the sign-in step is not seen. Older app code puts it after the anonymous quiz, the recommendation, the format and plan-length choice and the add-ons, at /checkout/email ('Create an account': first name, last name, email, phone number, date of birth, password), followed by a medical-history questionnaire, hair photos and the order review. On both landing-page pop-ups (men and women) the wall is an email box straight after one picture question: the 'eligible / not eligible' verdict is only shown after an email is given. Voy's help-centre articles also need sign-in.
Tested by: live-walk, site-code, public-docs
Coverage: No real quiz screen was seen, in stage 1 or stage 2. Live replays (20 in stage 2, 3 of them blocked access checks) cover only what Voy serves without the checkpoint: the men's landing-page pop-up (6 options), the women's landing-page pop-up (4 options and Skip) and the men's pattern picker (6 options), each option on its own. Site code covers (a) the scripts of those landing pages, which hold the pop-ups' eligibility rule, and (b) a copy of the older Manual web app's shared script (29 Dec 2025, from a public web archive), which holds the quiz ENGINE (how answers remove products or reject the patient, how follow-up questions are shown, the order of the funnel pages) but not the questions. Public documents cover Voy's own landing pages for men and women (read live on Voy's public hosts hairloss1.joinvoy.com and femalehairloss1.joinvoy.com), older Manual treatment-plan pages with full 'who should not take it' lists (archive copies), terms of sale, GPhC reports and Manual's published service evaluation. Help-centre and www.joinvoy.com product pages were read only through search-engine summaries. Every quiz-related entry says which of these it rests on. Stage 3 (verification) replayed every baseline and six stage 2 experiments again with the same results, re-read the page scripts and the archived app code, and added 13 gap replays: the older Manual plan picker that is still online (format and plan length, the only product chooser that works without the blocked app), the page aimed at both sexes, the women's /meta pop-up, the product-first landing page and the coupon hand-over. None of these is the consultation itself.

Questions: 43 (35 before sign-in; 30 branch). Flows: landing-popup (4q), landing-popup-women (4q), landing-pattern-widget (1q), men (20q), gateway (1q), women (7q), atc (1q), landing-mixed-page (2q), legacy-plan-picker (3q)

## Engine summary
Voy's real quiz could not be opened in any of the three stages, so this is the engine only as far as public evidence shows it. What was seen: (1) A pattern gate before the quiz. The men's and women's landing pages open a one-question pop-up. Its own script refuses 'Patchy' and 'Complete' (men) and 'Patchy hair loss' (women) with 'You aren't eligible', and sends everyone else to the quiz with a discount code attached. The verdict only appears after an email is given; ticking a refused option looks exactly like ticking an accepted one. The page aimed at both sexes shows the men's picture question to everyone. A separate pattern picker is pure marketing: every pattern leads to the same quiz link. (2) On an older Manual page that is still online, choosing 'Spray' instead of 'Tablets' switches the product (minoxidil capsules to 10% spray) at the same price, and choosing 3 months instead of 6 changes only the price and pack size. What was read in code, not seen running: an 11-month-old copy of the same web app (Manual, December 2025). There the quiz starts with a list of products, and each question can carry a reject list (one matching answer leaves no product and shows 'You aren't eligible', with a 'Review your answers' button), an exclude list (the answer removes named products and the quiz carries on) and parent or JSON Logic conditions (the answer opens, hides or rewords later questions). In that function an answer can only remove products, never add one. Which answers sit on which list is in a definition the app downloads at run time; it could not be read, and that code has no women's hair flow in it. What Voy publishes: lists of who should not have which medicine. DHT blockers (finasteride, dutasteride) are 'not suitable' for men trying for a baby or with a pregnant partner, men treated for an enlarged prostate, men who have had breast or prostate cancer, and men with severe depression; minoxidil 'should not be used' with low or uncontrolled blood pressure or a sore scalp, or over 65; under-18s, women (in the men's service) and men who are completely bald or do not have pattern hair loss are not treated. Whether the quiz applies each of these by removing a product, by warning, or by leaving it to the clinician was not seen. After the quiz, older code and Voy's pages point to: a recommendation (Voy leads with finasteride plus minoxidil together for men; women are offered minoxidil only, as serum or tablets, at a strength the clinician sets), a format and plan-length choice, add-ons (shampoo, vitamins), then the account, a medical-history questionnaire, photos and payment details, and a prescriber's review that sees flagged and changed answers. Older terms say payment is taken only on approval.


## Strengths
- A wide men's range: licensed finasteride, 10% (and probably 5%) minoxidil spray, 2.5 mg oral minoxidil, one-a-day combined capsules (finasteride with minoxidil; a dutasteride version is described in the help centre) and, on older pages, a topical finasteride + minoxidil spray. Voy advertises '30+ treatment combinations'. No comparison with other companies was made in this file.
- An engine that can keep the customer: in the older code an answer can remove one medicine and leave the rest on offer, and a swap flag exists on the product-first route (what it does is inferred). How often Voy uses removal rather than refusal is not known; the only refusals seen are the pattern gate in the pop-ups.
- Low entry prices in adverts (from £13 to £19 a month for men, £14.99 to £15 for women on first order), payment only after clinician approval (older terms of sale), a 180-day Money Back Promise, 'unlimited clinician support' and a photo progress tracker.
- One-pill-a-day and once-a-day-spray formats that are easy to stick to; its own published 502-patient evaluation of the combined capsule; full written treatment plans with clear 'who should not take it' and fertility sections.
- A women's service under the same roof with its own dermatologist lead, a strength set per patient and an offer to remove an active a woman is allergic to.
- Own pharmacy and in-house prescribers, delivery advertised in under 48 hours, pause / switch / cancel in the account, and heavy conversion testing (70 experiment and feature flags downloaded by the landing page on the day).


## Weaknesses
- The eligibility pop-up takes the email first and gives the verdict second: someone with patchy or complete loss hands over contact details only to be told 'You aren't eligible', with no explanation, advice or referral.
- Marketing contradicts the gate: the pattern picker promises results for the most advanced stage (50% to 63% 'saw regrowth') while the pop-up refuses complete loss.
- Diagnosis looks thin, as far as public material shows (the quiz itself was not seen): a picture choice and a medical history taking 'under 2 minutes'. Nothing public mentions questions on shedding speed, diet, iron, thyroid, hormones or medicines that cause hair loss; photos are described as for tracking, not for diagnosis before the first prescription.
- Thin women's range: minoxidil only (serum or tablets) plus vitamins, for every cause Voy itself lists (hormonal, menopause, postpartum, stress). No blood test is mentioned on the hair-loss pages, although the company sells them for other services. The page aimed at both sexes shows women the men's picture question.
- Regulatory record of the pharmacy: GPhC found standards not all met in March and August 2026 (answers not independently verified; clinical checks on only a sample; unlawful advertising of prescription-only medicines), with enforcement, before a clean re-inspection in October 2026. The 'review your answers' button on the refusal screen is the kind of answer-changing the regulator worries about, even though changes are logged.
- Opaque: medicine names are hidden on ad pages ('Hair Oral Treatment', 'DHT blockers'), several products are unlicensed specials without that being said up front, strengths for women are not published, and the help centre is locked behind sign-in.
- Headline prices are first-order promotions on a 6-month plan: the complete plan is advertised 'from £19' but bills at £33.17 a month on 6-month billing and £44 on monthly billing (search summary of the plan page). Pages contradict each other (women's serum: £14.99, £24 and £39; spray 'once a day' on one page and 'twice daily' on another), and the page code holds a hidden test that would show '£33' struck through beside every men's price.


## Opportunities
- Give the verdict before asking for contact details, and never dead-end: for patchy, sudden or complete loss explain the likely causes and route to a clinician review, a GP letter or a dermatology referral.
- Diagnose properly where Voy appears only to screen (its quiz could not be seen): ask about speed of loss, shedding, scalp symptoms, periods and menopause, recent illness, diet and medicines; use baseline photos reviewed by a clinician before the first prescription; offer ferritin, thyroid and hormone tests when the answers point that way.
- Build a real women's pathway (cause work-up, topical and oral minoxidil at stated strengths, spironolactone and other anti-androgens where appropriate, menopause link, postpartum advice) instead of one medicine for every cause.
- Be transparent where Voy is not: every active and strength, licensed or unlicensed status, the standing price for each plan length and the full eligibility rules, all visible before any email is asked for.
- Make safety a feature: verify key answers (GP summary or NHS App record, blood-pressure reading before oral minoxidil), run structured mood and sexual side-effect check-ins on DHT blockers (Voy's own study admits it had none), and explain refusals instead of offering a 'review your answers' button.
- Offer what Voy does not: lower-dose and stepwise oral minoxidil, topical-only DHT-blocker routes with clear strengths for men who fear tablets, options for men trying to conceive, and care for over-65s rather than a blanket exclusion.


## Verification verdict
Trust this report for three things: (1) what Voy shows in public before the quiz (the pop-up gates and their rules, the pattern picker, landing prices and product names, the women's offer), which was replayed again in stage 3 with the same results; (2) how the older Manual app's engine worked in December 2025, which was read in the code twice; and (3) which exclusions Voy publishes. Do not read it as a map of Voy's consultation. No quiz screen was reached in any stage because of a security checkpoint that was deliberately not worked around, so there is no question list, no option-by-option rule and no observed recommendation for the real quiz. The rules that tie a medical answer to a product are published cautions or reasoning from them, now labelled as such, and several strengths and prices rest on search-engine summaries of pages that would not open. After the corrections above the labels are honest: 'observed' always has a run folder behind it, 'code' has been re-read in the file, 'docs' means 'Voy publishes this', and everything else is 'inferred' or 'unknown'.


---

# XYON Health (US and Canada) — digest
Slug: xyon · Verified: NO (not independently checked) · Audiences: men, women

Model: Doctor-founded telehealth brand that sells compounded topical finasteride, dutasteride and finasteride-plus-minoxidil in its patented SiloxysSystem gel (plus oral options and hair-care cosmetics), prescribed after an online questionnaire and photo review, with a second channel through partner hair clinics.
Account wall: After the eligibility gate. Men answer 4 questions (country, state or province, date of birth, biological sex), women 5 (plus pregnancy / conception / breastfeeding / fertility), then see "Congrats! You are eligible." and must create an account (legal first and last name, email, password, consent tick-box). The whole medical history, treatment preference, plan choice, photos and ID sit behind that account. Nothing is recommended before the wall.
Tested by: live-walk, site-code, public-docs
Coverage: Stage 1 (map). Walked live: the full anonymous eligibility flow for the baseline man and woman up to the account form, one stop screen (pregnancy = Yes), and the 3-question marketing quiz. Read from publicly served code: the whole eligibility schema with every branch and stop reason, the country and region lists, the product and variant enums, the field keys and step groups of the signed-in medical history (keys only, not wording), feature flags. Read from public pages: the Shopify product feed (all 64 products with prices and sex-eligibility tags), seven prescription product pages with safety information, the how-it-works page, help-centre articles and policies. Not tested: anything after the account wall, Canadian (en-CA) prices and wording, one-change experiments.

Questions: 50 (18 before sign-in; 14 branch). Flows: rx (44q), landing-quiz (4q), clinic-connect (2q)

## Engine summary
XYON's public engine is only a gate, not a recommender. Four or five anonymous questions check where you live, that you are 18 or over, your biological sex and, for women, pregnancy, conception, breastfeeding or fertility treatment. Pass and you must create an account; fail and you are asked for an email for updates (or, in 28 European countries, sent to a partner). The real decision happens after sign-in: a medical history (hair-loss history, earlier treatments and why they were stopped, mental health, cancer, sexual and urinary history, general conditions, blood pressure, kidney, medicines, allergies, pregnancy in the household), then the patient states a treatment preference and an application method (Topical, Topical low dose, Oral, or no preference), picks a plan, uploads scalp photos and photo ID, and a doctor chooses the medicine. Sex limits the product set through tags on the checkout products: finasteride-only gel and finasteride tablets are for men, spironolactone is for women, the rest are for both. The "personalised" quiz on the marketing site always recommends the same gel.


## Strengths
- A clear technical story: one patented gel base (SiloxysSystem, US patent 11,786,466) with published absorption claims ("92% less absorbed into the blood than pills") and doctor founders.
- Honest, prominent compounded-medicine and safety notices on every prescription page.
- Very short eligibility gate (4 to 5 taps) before the account wall.
- Serves women with the same flow, with a hard pregnancy and fertility stop before any data is collected.
- A second route to market through 100+ partner hair-restoration clinics (ClinicConnect).
- Simple plan logic: subscription includes the consultation; one-time orders pay $20.


## Weaknesses
- No recommendation or price is shown before sign-up: the visitor must give a legal name, email and password to learn anything personal.
- The marketing quiz is not real: every answer leads to the same product.
- Premium prices ($109 to $139 a month for the gels) against cheaper compounded sprays elsewhere.
- The finasteride and minoxidil solution's strengths are not published on its page.
- Help centre has dead links for the articles on who is ineligible and which treatment suits whom.
- Review time is stated inconsistently (24–48 hours on product pages, 3–5 business days on the how-it-works page).
- Photo ID step adds friction (they are testing its removal on half of US visitors).


## Opportunities
- Show a genuine, answer-driven recommendation with price before asking for an account.
- Publish plain eligibility rules (conditions and medicines that rule each treatment out) instead of leaving them to the doctor review.
- Offer a lower-priced controlled-release topical, or publish strengths and absorption data for every formula.
- Give women a tailored path (menopause, contraception, PCOS questions) rather than one shared flow with a single pregnancy gate.


## Verification verdict
not verified
