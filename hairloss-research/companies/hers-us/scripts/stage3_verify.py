#!/usr/bin/env python3
"""Stage 3 (VERIFY) for Hers (US). Applies the independent reviewer's corrections to company.json in place.

Run order: scripts/build_company.py  ->  scripts/stage2_rules.py  ->  scripts/stage3_verify.py
Safe to re-run: every change sets a value or appends a sentence only if it is not already there.
Nothing here was observed live on forhers.com (the site is behind a security checkpoint).
"""
import json
import pathlib

P = pathlib.Path(__file__).resolve().parent.parent / "company.json"
d = json.loads(P.read_text(encoding="utf8"))

prod = {p["id"]: p for p in d["products"]}
flow = d["flows"][0]
Q = {q["id"]: q for q in flow["questions"]}
R = {r["id"]: r for r in d["rules"]}


def add(text, extra):
    """Append a sentence once."""
    text = text or ""
    return text if extra in text else (text + " " + extra).strip()


def add_item(lst, item):
    if item not in lst:
        lst.append(item)


THIRD = "third-party review (not a Hers statement)"

# --------------------------------------------------------------------------- access
a = d["access"]
a["accountWall"] = (
    "Not observed (site blocked). Reported by one reviewer in Dec 2023 (Innerbody, re-read at stage 3): 'You'll have to "
    "make a Hers account to see your results', that is, after the quiz and before any recommendation. Later descriptions "
    "(a Hims & Hers partner article, May 2025; AOL / New York Post, Jun 2026) say the quiz 'leads to an intake form' and "
    "do not say where the account step sits. A Nov 2026 review adds that a government-issued ID and a payment card are "
    "needed to complete a consultation (Healthline, about the platform in general). No step behind this wall was tested."
)
for b in [
    "Stage 3 re-test (2026-11-23): www.forhers.com still shows the Cloudflare checkpoint (HTTP 403) after a 10 second "
    "wait. Not defeated. Proof: runs/verify-baseline.",
    "The sister site does not serve Hers hair pages: /hair-loss/spironolactone, /treatment/hair-loss/spironolactone and "
    "/hair-loss/oral-minoxidil on www.hims.com all return 'page doesn't exist' (404). Proof: runs/verify-hims-hers-pages.",
    "Stage 3 could run only three web searches before the shared search budget for the session was used up, so the Hers "
    "page statements that earlier stages read through a search index could not all be re-read.",
]:
    add_item(a["blockers"], b)
a["coverageNote"] = (
    "No live walk of the Hers consultation was possible at any of the three stages: the site stays behind a security "
    "checkpoint, which was not defeated. No answer was changed and replayed, so nothing in this file is 'observed'. What "
    "the file holds is (1) Hers's stated safety and eligibility policy, from patient leaflets in the shared Hims & Hers "
    "help centre (opened directly and re-read word for word at stage 3) and from Hers pages read only through a search "
    "index; (2) descriptions of the quiz by reviewers and one partner article (2023 to Nov 2026), now labelled "
    "'inferred' because they are not Hers's own statements; (3) one code hint: names of old Hers hair experiments in the "
    "page state served by the sister site. These say who Hers says can have each product. Whether the quiz enforces a "
    "rule itself (stop screen, product hidden) or leaves it to the provider is not known. Question wording is not "
    "verbatim. Hers is women only; men are served by the sister brand Hims."
)

# --------------------------------------------------------------------------- products
p = prod["p1"]
p["priceDetail"] = add(p["priceDetail"],
    "Stage 3 check: Innerbody (Dec 2023) says oral minoxidil 'starts at $29/month' in 1.25 mg and 2.5 mg; finvsfin "
    "(Aug 2026) and NCOA (Oct 2026) give 1.25 mg rising to 2.5 mg. No Hers page could be opened.")
p["recommendedWhen"] = (
    "Not observed. From Hers's documents: for an adult woman with female pattern hair loss who is not pregnant, not "
    "breastfeeding and not planning a pregnancy, and has no pheochromocytoma (help centre leaflet, re-read word for word "
    "at stage 3); a history of heart problems must be told to the provider (same leaflet). Hers product pages, read only "
    "through a search index, add that it may not suit people with kidney or liver disease or blood pressure problems. A "
    "search summary of Hers's treatment terms page (/treatment/hair-loss/oral-minoxidil) says people under 18, people "
    "with pheochromocytoma and people already using minoxidil products are not eligible through the platform and are "
    "pointed to in-person care. A sentence saying oral minoxidil is not offered for telogen effluvium or alopecia areata "
    "was found by the search engine only on a copy of the page on another Hers host (internal.forhers.com), so it is not "
    "confirmed for the public page. Whether the quiz steers a patient to plain tablets or to a vitamin blend is unknown. "
    "The provider sets the dose: 1.25 mg to start, 2.5 mg possible (reviews)."
)
p["stage3Check"] = "Dose and $29 starting price confirmed in third-party reviews; pregnancy, breastfeeding and pheochromocytoma rules confirmed word for word in the help centre. Hers product page not readable."

p = prod["p2"]
p["actives"][0]["strength"] = "1.25 mg or 2.5 mg according to one review (Innerbody, Dec 2023); not published on the Hers pages found"
p["price"] = "From $35 a month (top10.com, Aug 2025); from $39 a month in two other reviews (Dec 2023, Aug 2026)"
p["priceDetail"] = (
    "Sources disagree and the current figure is not settled: top10.com (6 Aug 2025) says 'Starting at $35/month'; "
    "Innerbody (Dec 2023) and finvsfin (8 Aug 2026) say the blends start at $39 a month. Hers's own pages, read through a "
    "search index at stage 1, said $35. Plan lengths not found."
)
p["stage3Check"] = "Name, form and actives confirmed in reviews (NCOA Oct 2026, a partner article May 2025). Price conflict ($35 against $39) remains."

p = prod["p3"]
p["priceDetail"] = add(p["priceDetail"],
    "Stage 3: no review that was re-read gives a price for the gummy; the $35 figure rests on the search-index read "
    "alone. NCOA (5 Oct 2026) confirms the gummy exists (green apple) beside the chew (lemon).")
p["stage3Check"] = "Existence and flavour confirmed (NCOA Oct 2026). Price and strength unconfirmed."

p = prod["p4"]
p["actives"][0]["strength"] = "low dose; 1.25 mg or 2.5 mg according to one review (Innerbody, Dec 2023); not published on the Hers pages found"
p["price"] = "From $35 a month (top10.com, Aug 2025); from $39 a month in two other reviews (Dec 2023, Aug 2026)"
p["priceDetail"] = (
    "top10.com (6 Aug 2025): 'Starting at $35/month'. Innerbody (Dec 2023) and finvsfin (8 Aug 2026): from $39 a month. "
    "Not settled. Ingredients confirmed at stage 3: NCOA (Oct 2026) lists low-dose minoxidil, 2.5 mg biotin, vitamin C, "
    "zinc, vitamin B6 and pantothenic acid; the help-centre leaflet says the tablet 'may contain' minoxidil, biotin, "
    "vitamins B5, B6, C or zinc sulfate."
)
p["stage3Check"] = "Ingredients confirmed (NCOA Oct 2026; help-centre leaflet). Price conflict ($35 against $39) remains."

p = prod["p5"]
p["priceDetail"] = (
    "top10.com (6 Aug 2025): 'Starting at $35/month'; finvsfin (8 Aug 2026): blends start at $39 a month. Hers's own "
    "pages, read through a search index at stage 1, said $35. Plan lengths not found."
)
p["stage3Check"] = "Actives confirmed in NCOA (Oct 2026): 7% minoxidil with biotin, vitamin B5 and ketoconazole. Price conflict ($35 against $39) remains."

p = prod["p6"]
for act in p["actives"]:
    if act["name"] == "minoxidil":
        act["strength"] = "reported as 6% on one Hers page read through a search index; not confirmed at stage 3 (NCOA, Oct 2026, gives no strength for the serum)"
    if act["name"] == "finasteride":
        act["strength"] = "reported as 0.3% (same single source; not confirmed at stage 3). 0.3% and 6% are confirmed only for the older spray (p7)"
p["priceDetail"] = "top10.com (6 Aug 2025): 'Starting at $35/month' (re-read at stage 3). Hers product page via search index: 'listed at $35/mo'."
p["stage3Check"] = "Existence, audience (postmenopausal women) and ingredients (minoxidil, finasteride, essential oils) confirmed in NCOA (Oct 2026) and a Hims & Hers partner article (May 2025). Strengths not confirmed."

p = prod["p7"]
p["price"] = "$39 a month in a 2023 review (Innerbody); 'starting at $50/month' on a 3-month billing cycle (NCOA, 3 Nov 2026)"
p["priceDetail"] = (
    "Stage 3 correction: finvsfin (Aug 2026) lists the spray and its strengths (0.3% finasteride, 6% minoxidil) but gives "
    "no price for it, so the $39 figure rests on Innerbody (Dec 2023) alone. NCOA says the product cannot be customised "
    "by strength or ingredient."
)
p["evidence"] = "inferred"
p["note"] = (
    "Known from third-party reviews only (Innerbody Dec 2023, finvsfin Aug 2026, NCOA Nov 2026). Sources that list the "
    "whole range (a Hims & Hers partner article of May 2025, top10.com Aug 2025, NCOA's Hers review of Oct 2026) name the "
    "Postmeno Serum (p6) and not the spray, so the serum may have replaced the spray. Not settled. Evidence label lowered "
    "from docs to inferred at stage 3: no Hers page that sells the spray was read."
)
p["stage3Check"] = "Strengths confirmed in two reviews; current availability doubtful."

p = prod["p8"]
p["evidence"] = "inferred"
p["status"] = "uncertain: may no longer be offered for hair loss"
p["price"] = "Unknown"
p["priceDetail"] = (
    "A Hers product address and a Hers treatment terms page for spironolactone are in the search index, but neither "
    "could be read. Stage 1 noted 'about $30 a month' from two review sites it did not name; stage 3 found that figure "
    "in none of the reviews it re-read, so it has been dropped."
)
p["recommendedWhen"] = (
    "Unknown, and it may no longer be offered for hair loss. None of the range descriptions re-read at stage 3 lists "
    "spironolactone (Innerbody Dec 2023, a Hims & Hers partner article May 2025, top10.com Aug 2025, NCOA Oct 2026), and "
    "finvsfin (Aug 2026) says a rival offers spironolactone 'that Hers does not'. Against that: the product address and "
    "a treatment terms page are in the search index, and the shared help centre still carries a spironolactone leaflet "
    "(updated Jul 2025) that says it is used off-label for hair loss and acne. If it is offered: for women before "
    "menopause with hormonal hair loss; not in pregnancy or when trying to conceive (Hers blog, via search index, not "
    "re-read); not with high potassium, Addison's disease or a spironolactone allergy (help centre, confirmed word for "
    "word at stage 3)."
)
p["stage3Check"] = "Contradicted in part: one 2026 review says Hers does not offer spironolactone and no review lists it. Label lowered from docs to inferred."

p = prod["p9"]
p["stage3Check"] = "Confirmed in Innerbody (Dec 2023): $54 single purchase (4-month supply); subscriptions $30 every 2 months, $54 every 4 months, $76 every 6 months ($12.67 a bottle). 2026 prices not confirmed directly."

p = prod["p10"]
p["price"] = "$45 one-time (Innerbody Dec 2023, a 3-month supply; finvsfin and Fortune, Aug 2026); subscription from $12.67 a month on a 6-month plan"
p["priceDetail"] = (
    "Stage 3 correction: three reviews give $45; the $30 one-time figure from a search-index read of a Hers page at "
    "stage 1 was not confirmed. Subscription tiers (Innerbody 2023): $30 every 2 months, $54 every 4 months, $76 every "
    "6 months."
)
p["stage3Check"] = "Strength and $45 one-time price confirmed in three reviews."

p = prod["p11"]
p["stage3Check"] = "Confirmed: 300 mcg biotin with vitamin B12 and folic acid (NCOA Oct 2026; Innerbody 2023); $13.50 a bottle on a 6-month plan in 2023; $16 a bottle on subscription (finvsfin Aug 2026)."

p = prod["p12"]
p["price"] = "$38 for a 2-pack of shampoo and $47 for a 2-pack of conditioner (Healthline, 19 Nov 2026; same in Innerbody, Dec 2023)"
p["priceDetail"] = (
    "Stage 3 correction: the earlier entry ('$38 every two months for the pair') came from finvsfin (Aug 2026) and "
    "conflicts with two sources in which $38 buys the shampoo 2-pack alone. 2023 bundle subscription (Innerbody): $30 a "
    "month, $84 every 3 months, $150 every 6 months."
)
p["stage3Check"] = "Corrected: price entry was misleading."

prod["p13"]["stage3Check"] = "Confirmed: $32 one-time or $30 a month for the set (NCOA Oct 2026; Innerbody 2023)."
prod["p14"]["stage3Check"] = "Price confirmed only in the 2023 review ($44 for a 2-pack). Current price unknown."

p = prod["p15"]
p["evidence"] = "inferred"
p["note"] = "Third-party 2023 review only (Innerbody: $44 for a 2-pack); not named in any 2025 or 2026 source re-read at stage 3. Label lowered from docs to inferred."
p["stage3Check"] = "Could not confirm it is still sold."

# --------------------------------------------------------------------------- questions
def q_third(qid, extra=None):
    q = Q[qid]
    q["evidence"] = "inferred"
    q["sourceType"] = THIRD
    if extra:
        q["verifyNote"] = extra


q = Q["women-q1"]
q["text"] = (
    "Wording NOT captured (site blocked). Topic: your goals. A Hims & Hers partner article (Hello! Magazine, 30 May 2025) "
    "describes it as: 'what goals I have in pursuing treatment: for example reducing shedding, regrowing lost hair, "
    "improving thickness and fullness or supporting overall hair health'."
)
q["sourceType"] = "partner article written with Hims & Hers (advertorial), plus third-party reviews"
q["verifyNote"] = "Re-read at stage 3. The four goals are the article's examples, not a confirmed option list."
for o in q["options"]:
    o["label"] = o["label"].replace("(reviewer's paraphrase, not the site's wording)", "(partner article's wording, May 2025; not confirmed as the site's)").replace("(reviewer's paraphrase)", "(partner article's wording, May 2025; not confirmed as the site's)")

q = Q["women-q2"]
q["sourceType"] = "partner article written with Hims & Hers (says the quiz asks 'what symptoms you're experiencing'), plus AOL / New York Post"
q["verifyNote"] = "Re-read at stage 3: AOL says the quiz is 'designed to categorize your needs from thinning, shedding, a widening part' and menopause-related hormonal thinning. These are the article's words, not an option list."

q_third("women-q3", "Re-read at stage 3 (AOL / New York Post, 7 Jun 2026): 'The quiz is highly visual, often asking you to identify your hair density from a series of photos.' One source only.")
for qid in ("women-q4", "women-q5", "women-q6"):
    q_third(qid, "UNVERIFIED. Stage 1 could not name the review this came from and stage 3 found it in none of the nine reviews it re-read. The nearest support is a partner article (May 2025) saying the quiz asks about 'your hair care routines' and 'hair loss symptoms'. Treat this question as a possibility, not a finding.")
q_third("women-q7", "Re-read at stage 3 (Innerbody, Dec 2023): the quiz asks 'whether you want vitamins with your treatment'. One source, three years old.")
q_third("women-q8", "Re-read at stage 3 (Innerbody, Dec 2023): 'You'll have to make a Hers account to see your results'. One source, three years old; later articles do not say where the account step sits.")
Q["women-q8"]["text"] = "Account wall (reported, not seen): 'You'll have to make a Hers account to see your results' is a reviewer's sentence from Dec 2023, not the site's wording."
for qid in ("women-q9", "women-q10", "women-q11"):
    q_third(qid, "Re-read at stage 3 (Innerbody, Dec 2023): after the hair questions the quiz asks about pregnancy and breastfeeding status, hysterectomy, pre- or post-menopausal status, medical conditions, vitamins and current medicines. One source, three years old. The safety policy behind the question is documented separately (see rules).")
for qid in ("women-q12", "women-q13"):
    Q[qid]["sourceType"] = "help centre (the intake form gives the provider 'information about your symptoms and medical history'), plus third-party reviews for the detail"
    Q[qid]["verifyNote"] = "That medical history is collected is Hers's own statement (help centre 'How does this work?', re-read at stage 3). The split into a conditions question and a medicines question is from Innerbody (Dec 2023). No option list is known."
q_third("women-q14", "Re-read at stage 3: NCOA (3 Nov 2026) 'At the end of the assessment, one or two products will be recommended for your treatment'; Innerbody (Dec 2023) keep the suggestion or swap it.")
q_third("women-q15", "Re-read at stage 3: AOL / New York Post (Jun 2026) and Healthline (19 Nov 2026). The help centre's only identity article is about testosterone treatment, so Hers itself does not document this for hair.")
Q["women-q16"]["verifyNote"] = "Confirmed at stage 3 in the help centre: 'a healthcare provider will assess your case and determine the most suitable treatment option for you'; by secure message, or by video visit where the state requires one."
q_third("women-q17", "Re-read at stage 3 (Innerbody, Dec 2023): no payment details until you select a treatment and a provider approves it. The $5 processing fee is also from that 2023 review.")

LINK = " Stage 3 label change (docs to inferred): the policy is documented, but that this quiz answer is what triggers it is our inference; the option wording itself is not known."
for qid, starts in (("women-q9", ("Pregnant", "Breastfeeding")), ("women-q11", ("Pre-menopausal", "Post-menopausal"))):
    for o in Q[qid]["options"]:
        if o["label"].startswith(starts):
            o["evidence"] = "inferred"
            o["effect"] = add(o["effect"], LINK.strip())

flow["stagesSummary"] = (
    "Reported, never observed: free hair quiz, mostly visual (goals, symptoms and type of thinning, hair density from "
    "photos, hair-care routine; 'takes just minutes' to 10 to 15 minutes) -> health questions (pregnancy and "
    "breastfeeding, hysterectomy, pre- or post-menopausal, conditions, medicines, 'vitamins with your treatment'); a 2023 "
    "review puts these inside the quiz before the account step, 2025 and 2026 articles put medical history in an 'intake "
    "form' after the quiz -> create an account to see results (2023 report) -> one or two recommended prescription "
    "products, which can be swapped -> ID, payment card and, for some treatments, hair photos -> provider review by "
    "message (video visit in some states) -> subscription. No step could be tested at any stage: the site is behind a "
    "security checkpoint."
)

# --------------------------------------------------------------------------- rules
r = R["R1"]
r["stage3"] = "Policy confirmed. The help-centre sentence was re-read word for word (runs/verify-help/05.txt); note that this leaflet covers all compounded hair topicals on the shared platform, men's and women's. The Hers page statement was not re-read (site blocked; search budget used up). Quiz enforcement not tested."

r = R["R2"]
r["stage3"] = "Policy supported: a Hims & Hers partner article (Hello! Magazine, May 2025) and NCOA (Oct 2026) both describe the Postmeno Serum as for post-menopausal women, with finasteride and minoxidil. Quiz enforcement not tested."

r = R["R3"]
r["stage3"] = "Policy confirmed for oral minoxidil and finasteride: all three sentences re-read word for word (runs/verify-help/01.txt, 03.txt, 05.txt). Not confirmed for spironolactone: the Hers blog line was not re-read, the help-centre spironolactone leaflet does not mention pregnancy, and spironolactone may no longer be offered (see p8). Quiz enforcement not tested."

r = R["R4"]
r["stage3"] = "Partly confirmed: 'Do not breastfeed while taking minoxidil tablets' re-read word for word (runs/verify-help/01.txt). The FAQ line about topicals while breastfeeding was not re-read. Quiz enforcement not tested."

r = R["R5"]
r["effectType"] = "product-removed"
r["then"] = "Not eligible for oral minoxidil products through Hers; a search summary of Hers's treatment terms page says such patients are pointed to in-person care. Where the quiz asks age, and whether it stops the whole consultation, is not known."
r["proof"] = add(r["proof"], "Stage 3: a separate search summary of https://www.forhers.com/treatment/hair-loss/oral-minoxidil ('Provided by You Health for patients') lists people under 18, people with pheochromocytoma and people already using minoxidil products as not eligible through the platform. Both reads are search summaries, not word for word.")
r["stage3"] = "Supported by two search-index reads of two different Hers pages; neither page could be opened. Effect type changed from hard-stop to product-removed: no stop screen is documented."

r = R["R6"]
r["stage3"] = "Policy confirmed: both sentences re-read word for word in the oral minoxidil leaflet (runs/verify-help/01.txt), and pheochromocytoma is also in the Minoxidil + Supplements leaflet (03.txt). Whether the quiz lists pheochromocytoma is unknown."

r = R["R7"]
r["proof"] = (
    "Help centre 'Minoxidil' (oral tablets): 'Tell your provider if you have had a recent heart attack or history of heart "
    "conditions before starting minoxidil therapy' and a warning of life-threatening heart-related side effects "
    "(https://support.hims.com/hc/en-us/articles/38944589097883-Minoxidil; re-read word for word, runs/verify-help/01.txt). "
    "That leaflet does not name kidney, liver or blood pressure problems: those come from Hers's oral minoxidil and Hair "
    "Vitamins + Minoxidil pages, read only through a search index (stage 2, and again in a separate stage 3 search "
    "summary: 'heart, kidney, or liver disease, pheochromocytoma, problems with your blood pressure'). Correction: the "
    "Fortune review (Aug 2026) that stage 2 cited here is about the over-the-counter 2% solution and gives the reviewer's "
    "own advice, not a Hers rule about tablets; it is no longer used as proof. Not tested."
)
r["stage3"] = "Heart part confirmed word for word; kidney, liver and blood pressure part rests on search-index reads of Hers pages. One wrong citation removed."

r = R["R8"]
r["confidence"] = "low"
r["then"] = "If spironolactone is still offered for hair (uncertain, see p8): not a candidate for it through Hers; told to see a healthcare provider in person. Other products are not affected by this rule."
r["proof"] = add(r["proof"], "Stage 3 could not reproduce the 'not a candidate' wording: one exact-phrase search found nothing and the shared search budget then ran out. A sister page of the same family (https://www.forhers.com/treatment/hair-loss/oral-minoxidil) was returned at stage 3 with a similar 'not eligible through the platform' list, which makes the page family credible. What is confirmed word for word is weaker: the help-centre leaflet says acetylsalicylic acid, cholestyramine, cisplatin, digoxin, heparin, lithium, trimethoprim, NSAIDs, steroids and blood pressure medicines 'may interact' (runs/verify-help/07.txt).")
r["stage3"] = "Not re-confirmed. Confidence lowered from medium to low."

r = R["R9"]
r["then"] = "Spironolactone must not be used (this matters only if Hers still offers spironolactone for hair: uncertain, see p8)."
r["stage3"] = "Sentence confirmed word for word (runs/verify-help/07.txt). Whether the quiz asks about these, and whether the product is still offered, is unknown."

r = R["R10"]
r["effectType"] = "product-removed"
r["affects"] = ["p4"]
r["then"] = "The Hair Vitamins + Minoxidil tablet (which may contain zinc sulfate) should not be taken. What replaces it is not documented; plain oral minoxidil would be the natural substitute (inferred)."
r["stage3"] = "Sentence confirmed word for word (runs/verify-help/03.txt). The same leaflet covers the chew and gummy and says the product 'may contain' zinc sulfate, so it may apply to them too. Effect type changed from product-switched to product-removed: only the exclusion is documented."

r = R["R11"]
r["confidence"] = "low"
r["proof"] = (
    "Sentence reported at stage 2 from a search index: 'We do not offer oral minoxidil treatment for other hair disorders "
    "(eg, telogen effluvium or alopecia areata)'. Stage 3 correction: the search engine found that sentence only on a copy "
    "of the oral minoxidil page on another Hers host (internal.forhers.com, not opened), not on the public page "
    "https://www.forhers.com/hair-loss/oral-minoxidil, so it may be draft or old wording. The Fortune line about sudden, "
    "patchy or severe loss is that reviewer's advice about the over-the-counter 2% solution, not a Hers rule. Not tested."
)
r["then"] = "Oral minoxidil is reportedly not offered (sentence not confirmed on the public page). Whether the quiz asks anything that would detect these conditions, or shows a stop screen, is not known."
r["stage3"] = "Weakened. Confidence lowered from medium to low; wrong use of the Fortune review corrected."

R["R12"]["stage3"] = "The question was re-read in Innerbody (Dec 2023). Its effect is still a guess."

r = R["R13"]
r["proof"] = add(r["proof"], "Stage 3: a search summary of Hers's treatment terms page for oral minoxidil lists 'people already using minoxidil products' as not eligible through the platform. Search summary, not word for word.")
r["stage3"] = "Supported by a second search-index read of a different Hers page; not confirmed word for word."

r = R["R14"]
r["proof"] = add(r["proof"], "Stage 3: re-read word for word. 'Based on this information, a healthcare provider will assess your case and determine the most suitable treatment option for you' (runs/verify-help/09.txt); providers 'evaluate your specific needs based on your health information, and if appropriate, prescribe treatment' (runs/verify-help/11.txt). Dose re-read in Innerbody (1.25 mg and 2.5 mg, dosing set by a Hers doctor) and finvsfin (starts at 1.25 mg, may increase to 2.5 mg): third parties.")
r["stage3"] = "Confirmed (provider decides: Hers's own statement). The dose detail is from reviews."

R["R15"]["stage3"] = "Confirmed word for word (runs/verify-help/09.txt). The states are not named."

r = R["R16"]
r["proof"] = add(r["proof"], "Stage 3: help-centre sentence re-read word for word (runs/verify-help/11.txt); Healthline (19 Nov 2026) says direct purchases can 'check out as a guest'; Innerbody's line that the quiz 'now covers only hair loss prescriptions' re-read (Dec 2023).")
r["stage3"] = "Confirmed for the 'no consultation' part. That the quiz recommends prescription products only is one 2023 report."

r = R["R17"]
r["evidence"] = "inferred"
r["proof"] = add(r["proof"], "Stage 3: both sources are third parties (re-read). The help centre's only identity article is about testosterone treatment. Label lowered from docs to inferred.")
r["stage3"] = "Third-party reports only."

R["R18"]["stage3"] = "Still inferred. Extra sign: hims.com's footer links to 'visit forhers.com' and hims.com does not serve Hers hair pages (runs/verify-hims-hers-pages)."

if "R19" not in R:
    d["rules"].append({
        "id": "R19",
        "flow": "women",
        "when": "the patient's delivery address is in Puerto Rico, or in a state where a given treatment is not offered",
        "then": "Hims & Hers is available in all 50 states but not in Puerto Rico, and 'specific treatments may be limited to certain states'. Which hair treatments are limited, and in which states, is not stated.",
        "effectType": "product-removed",
        "affects": [],
        "evidence": "docs",
        "proof": "Help centre 'Where is Hims & Hers available?' (updated 28 Oct 2026), opened directly at stage 3: https://support.hims.com/hc/en-us/articles/9586237484571-Where-is-Hims-Hers-available (runs/verify-help2/01.txt). A code hint points the same way: the page state served by the sister site has switches named maCompoundDeprecation and waCompoundDeprecation (Massachusetts, Washington; both false), see codeHints. Not tested.",
        "confidence": "medium",
        "stage3": "New rule added at stage 3 from a document opened directly."
    })

# --------------------------------------------------------------------------- experiments
have = {x["id"] for x in d["experiments"]}
for x in [
    {"id": "verify-baseline", "flow": "women",
     "changed": "Nothing changed: stage 3 fresh replay of the women's baseline (10 second wait)",
     "result": "Same end state as recorded at stages 1 and 2: Cloudflare security checkpoint, HTTP 403, 'Performing security verification'. No quiz screen. Not defeated.",
     "run": "runs/verify-baseline"},
    {"id": "verify-help", "flow": "women",
     "changed": "Not a quiz replay: stage 3 read-only re-read of six help-centre articles the rules rest on",
     "result": "All six opened. All 18 sentences quoted in the rules are present word for word (oral minoxidil, Minoxidil + Supplements, Compounded Topical Combination, Spironolactone, How does this work?, Do I need a prescription?).",
     "run": "runs/verify-help"},
    {"id": "verify-help2", "flow": "women",
     "changed": "Not a quiz replay: stage 3 read-only visit to one more help-centre article and four help-centre searches",
     "result": "'Where is Hims & Hers available?' (updated 28 Oct 2026): all 50 states, some treatments limited by state, not Puerto Rico. Searches: the only identity article is about testosterone; no article on age; the spironolactone leaflet is still listed; nothing describes the hair quiz.",
     "run": "runs/verify-help2"},
    {"id": "verify-hims-hers-pages", "flow": "women",
     "changed": "Not a quiz replay: stage 3 check of whether the sister site serves Hers hair pages (three addresses, once each)",
     "result": "No. /hair-loss/spironolactone, /treatment/hair-loss/spironolactone and /hair-loss/oral-minoxidil on www.hims.com each return 'this particular page ... doesn't exist' (404). The footer links to forhers.com.",
     "run": "runs/verify-hims-hers-pages"},
]:
    if x["id"] not in have:
        d["experiments"].append(x)

# --------------------------------------------------------------------------- code hints
d["codeHints"] = {
    "what": "Names of old Hers hair experiments found in the page state (window.PROPS) that www.hims.com serves to an anonymous browser on /c/hl. Both brands share one platform. Each entry has a name, a publish date and a traffic split, and no content. The newest is dated June 2024, so this is a legacy list.",
    "evidence": "code",
    "proof": "runs/grab-hims-c-hl/page.html (saved at stage 1; read at stage 3). The same names are noted by the Hims US investigator.",
    "caution": "A name is a hint, not a rule. The reading of each name below is inferred and nothing here was seen running. No rule in this file rests on these.",
    "items": [
        {"name": "hersHairOralMinoxidil", "published": "2022-09-27", "split": "treatment 100%", "reading": "Oral minoxidil was added to the Hers hair flow in autumn 2022 and rolled out to everyone (inferred)."},
        {"name": "hersHairRxOrNot", "published": "2022-01-31", "split": "control 100%", "reading": "A 'prescription or not' step was tried in 2022 and not kept (inferred)."},
        {"name": "hersHairRxOTCRecco", "published": "2022-04-20", "split": "control 100%, no traffic", "reading": "Recommending over-the-counter products beside prescription ones was tried and is off, which fits a 2023 review saying the quiz now recommends prescription products only (inferred)."},
        {"name": "hersHairOTCAddOn", "published": "2022-12-06", "split": "control 100%, no traffic", "reading": "An over-the-counter add-on step was tried and is off (inferred)."},
        {"name": "hersHairRxResultsV1 / hersHairRxResultsV2", "published": "2022-03-07 / 2022-05-03", "split": "treatment 100%", "reading": "The results (recommendation) screen was redesigned twice in 2022 (inferred)."},
        {"name": "hersHairQuizTOF / hersHairQuizTOFV2", "published": "2022-03-07 / 2022-06-16", "split": "treatment 100%", "reading": "The opening quiz was introduced or reworked in 2022 (inferred)."},
        {"name": "hersHairStepsPreReg", "published": "2023-12-18", "split": "50/50, no traffic", "reading": "Hers tested how many steps come before registration, so the position of the account wall has moved over time (inferred)."},
        {"name": "hersHairSignUpDec23 / hersHairSignUpSpringJan24", "published": "2024-01-16 / 2024-03-05", "split": "treatment 100% / no traffic", "reading": "The sign-up step was changed in early 2024 (inferred)."},
        {"name": "hersHairRemoveTreatmentPricing", "published": "2023-12-21", "split": "50/50, no traffic", "reading": "Hers tested hiding treatment prices in the flow (inferred)."},
        {"name": "hersHairPersonalization1Q24", "published": "2024-03-11", "split": "treatment 100%", "reading": "A personalisation change shipped in 2024 (inferred)."},
        {"name": "hersHairTeaseCompounds", "published": "2024-05-21", "split": "treatment1 100%", "reading": "The compounded Hair Blends are promoted early in the flow (inferred)."},
        {"name": "hersBlockPrepaidHair", "published": "2023-09-08", "split": "treatment 100%", "reading": "Prepaid payment cards are probably refused for hair orders (inferred)."},
        {"name": "maCompoundDeprecation / waCompoundDeprecation", "published": "not dated (state fields, both false)", "split": "n/a", "reading": "Compounded products have had special handling in Massachusetts and Washington (inferred)."},
        {"name": "consultation.treatmentPreferences: recommendedBrand, overrideRecommendedDosage, originalRecommendedTreatment", "published": "not dated (empty starting state)", "split": "n/a", "reading": "The shared platform marks one product as recommended and lets the customer override it, which fits the reviewers' 'keep or swap' description (inferred)."}
    ]
}

# --------------------------------------------------------------------------- recommendations
for rec in d["recommendations"]:
    pr = rec["profile"]
    if pr.startswith("Baseline woman"):
        rec["offered"] = ["p1", "p2", "p3", "p4", "p5"]
        rec["note"] = (
            "Not observed (site blocked). Expected from Hers's documents: one or two minoxidil-based prescription products "
            "(NCOA, Nov 2026: 'one or two products will be recommended'), most likely Oral Minoxidil or a Hair Blends "
            "product, swappable. Finasteride products are excluded because she is not past menopause. Spironolactone was "
            "removed from this list at stage 3: it may no longer be offered (see p8). Which product is shown first is not known."
        )
    elif pr.startswith("Woman past menopause"):
        rec["note"] = add(rec["note"], "Stage 3: the spray (p7) may have been replaced by the serum (p6).")
    elif pr.startswith("Woman who is pregnant"):
        rec["evidence"] = "inferred"
        rec["default"] = "unknown"
        rec["note"] = add(rec["note"], "Stage 3 label change (docs to inferred): the exclusions are documented, but 'nothing is offered' is our reading; the documents do not cover the topical serum (p5) in pregnancy.")
    elif pr.startswith("Woman with sudden shedding"):
        rec["evidence"] = "inferred"
        rec["default"] = "unknown"
        rec["note"] = (
            "Unknown. A sentence saying Hers does not offer oral minoxidil for telogen effluvium or alopecia areata was "
            "found only on a non-public copy of the product page (not confirmed). The 2026 review that says women with "
            "sudden, patchy or severe loss should see a healthcare provider is about the over-the-counter 2% solution and "
            "is the reviewer's advice. Whether the quiz stops her or still shows a product was not observed."
        )
    elif pr.startswith("Woman who does not want a prescription"):
        rec["default"] = "unknown"
        rec["note"] = "Bought directly from product pages with no quiz (help centre: non-prescription products 'do not necessitate a medical consultation'; Healthline: guest checkout). Hers does not state a default; the 5% foam once a day is the usual first choice for women (our reading)."

# --------------------------------------------------------------------------- summary text
d["engineSummary"] = (
    "Untested: the site was blocked at all three stages, so this is how the engine should work according to Hers's own "
    "public statements and reviewers, not how it was seen to work. Hers treats one diagnosis, female pattern hair loss, "
    "with one main drug, minoxidil, sold in several formats. (1) A short visual quiz collects goals, symptoms, hair "
    "density and routine; nothing public shows these changing the product. (2) Health questions, either inside the quiz "
    "(2023 report) or in an intake form after it (2025 and 2026 reports), feed three documented gates. Menopause: "
    "finasteride (the Postmeno Serum) is only for women past menopause. Pregnancy, planning a pregnancy or "
    "breastfeeding: oral minoxidil in any form and finasteride are ruled out. Health: pheochromocytoma rules out oral "
    "minoxidil and a heart history must go to the provider (confirmed word for word in the help centre); kidney, liver "
    "and blood pressure problems, age under 18 and already using minoxidil are further exclusions read only through a "
    "search index. (3) A preference question reported in 2023 (vitamins with your treatment?) probably picks between "
    "plain oral minoxidil at $29 a month and the vitamin blends at $35 to $39. (4) One or two prescription products are "
    "shown, reportedly after an account is made, and can be swapped; a licensed provider then approves, changes or "
    "declines and sets the dose, by message in most states and by video in some. Over-the-counter minoxidil, supplements "
    "and hair care sit outside the quiz. Spironolactone may no longer be part of the hair range."
)

def swap(lst, starts, new):
    for i, s in enumerate(lst):
        if s.startswith(starts):
            lst[i] = new
            return
    add_item(lst, new)

swap(d["strengths"], "Narrow scope",
     "Narrow scope: Hers is reported to say it does not offer oral minoxidil for telogen effluvium or alopecia areata (sentence found only on a non-public copy of the page; not confirmed).")
swap(d["weaknesses"], "Reviewers report complaints",
     "Reviewers are said to report complaints about subscription charges, refunds and reaching a clinician (stage 1 reading; not re-checked at stage 3).")
swap(d["weaknesses"], "Dutasteride",
     "No source shows dutasteride, oral finasteride for women, tretinoin add-ons or iron or vitamin D testing in the range. Spironolactone, the usual anti-androgen tablet for women before menopause, appears in no 2023 to 2026 description of the hair range, and one 2026 reviewer says Hers does not offer it.")
swap(d["weaknesses"], "Prices are hard to pin down",
     "Prices are hard to pin down: sources give $35 and $39 for the blends, $39 and $50 a month for the postmenopausal spray, and plan-length prices are only shown inside the flow.")

for lim in [
    "Stage 3 re-read the third-party reviews through a fetch tool that summarises pages, so short quotes from reviews are close to, but not guaranteed to be, word for word. Help-centre quotes were checked against the saved page text and are exact.",
    "Stage 3 could not re-read Hers's own pages: the site is blocked and the shared web-search budget ran out after three searches. Statements marked 'via search index' are therefore still second-hand.",
    "Whether spironolactone and the postmenopausal spray are still sold is not settled.",
    "Seen only in a 2023 review and left out of the catalogue: Complete Hair Kit ($55), Weekender Kit ($40), collagen powder ($27) and Latisse for eyelashes.",
]:
    add_item(d["limitations"], lim)

for s in [
    {"title": "Hers treatment terms page for oral minoxidil ('Provided by You Health for patients'; via search summary at stage 3, not opened)", "url": "https://www.forhers.com/treatment/hair-loss/oral-minoxidil"},
    {"title": "Help centre: Where is Hims & Hers available? (updated 28 Oct 2026; opened at stage 3)", "url": "https://support.hims.com/hc/en-us/articles/9586237484571-Where-is-Hims-Hers-available"},
    {"title": "Sister site page state with old Hers hair experiment names (saved copy: runs/grab-hims-c-hl/page.html)", "url": "https://www.hims.com/c/hl"},
]:
    if s["url"] not in {x["url"] for x in d["sources"]}:
        d["sources"].append(s)


# --------------------------------------------------------------------------- small consistency fixes
prod["p8"]["name"] = "Spironolactone (may no longer be offered for hair loss)"
R["R3"]["then"] = (
    "Oral minoxidil in any form (plain tablets and the minoxidil plus vitamin blends) and the finasteride products are "
    "ruled out. Spironolactone would be too (Hers blog via search index, not re-confirmed; the product may no longer be "
    "offered). Whether the quiz shows a stop screen or leaves the refusal to the provider is not known."
)
Q["women-q7"]["purpose"] = (
    "A preference question that would choose between plain minoxidil and the minoxidil plus vitamin blends. The blends "
    "cost more ($35 to $39 against $29 a month), so it is also an upsell."
)
a["blockers"] = [
    ("support.forhers.com is not reachable from this machine, so the Hers-branded help centre address was not read; "
     "the shared Hims & Hers help centre at support.hims.com was read instead (stages 2 and 3).")
    if b.startswith("support.forhers.com") else b
    for b in a["blockers"]
]
d["opportunities"] = [
    ("Offer a route for the women Hers's stated policy leaves out: sudden shedding, patchy loss, pregnancy and "
     "breastfeeding (advice, safe topicals, blood tests, referral).")
    if o.startswith("Offer a route for the women") else o
    for o in d["opportunities"]
]
for s_ in d["sources"]:
    if s_["url"] == "https://fortune.com/article/hers-hair-growth-review/":
        s_["title"] = "Fortune: Hers hair growth review (updated 1 Aug 2026). Reviews the over-the-counter Minoxidil 2% solution only ($45); its 'who it's not for' lines are the reviewer's advice, not Hers policy"


swap(d["weaknesses"], "Eligibility rules are scattered",
     "Eligibility rules are scattered: exclusion lists sit on separate treatment terms pages (/treatment/hair-loss/...), apart from the product pages (pages not opened; from search-index reads).")
d["opportunities"] = [
    ("Ask for a home blood pressure and pulse reading before oral minoxidil, and say so up front. If offering "
     "spironolactone (Hers appears not to today), include a potassium check plan.")
    if o.startswith("Ask for a home blood pressure") else o
    for o in d["opportunities"]
]
Q["women-q4"]["branchDetail"] = (
    "Not tested, and the question itself is unverified. A sentence saying Hers does not offer oral minoxidil for telogen "
    "effluvium or alopecia areata was found only on a non-public copy of the product page (see R11). The review that "
    "says women with sudden, patchy or severe loss should see a healthcare provider (Fortune, Aug 2026) is about the "
    "over-the-counter 2% solution and is the reviewer's advice, not Hers policy."
)

# --------------------------------------------------------------------------- verification
d["verification"] = {
    "checkedOn": "2026-11-23",
    "checked": [
        "Baseline replayed fresh (runs/verify-baseline): still the Cloudflare checkpoint, HTTP 403, after a 10 second wait. Matches the record. No quiz screen exists to compare.",
        "Live re-test of rules was impossible (site blocked), so the documents behind the rules were re-read instead. Six help-centre articles opened directly (runs/verify-help): all 18 quoted sentences are present word for word.",
        "R1 finasteride not before menopause: CONFIRMED as policy ('contraindicated in females of childbearing potential').",
        "R3 pregnancy or planning one rules out oral minoxidil and finasteride: CONFIRMED as policy; the spironolactone part NOT confirmed.",
        "R4 breastfeeding rules out minoxidil tablets: CONFIRMED as policy; the 'some topicals are possible' line not re-read.",
        "R6 pheochromocytoma or minoxidil allergy rules out oral minoxidil: CONFIRMED as policy.",
        "R7 heart, kidney, liver, blood pressure: heart part CONFIRMED word for word; the rest supported only by search-index reads; one wrong citation (Fortune) removed.",
        "R8 spironolactone 'not a candidate' medicines list: NOT reproduced (one exact-phrase search found nothing); confidence lowered.",
        "R9 high potassium, Addison's disease or allergy rules out spironolactone: CONFIRMED as policy.",
        "R10 zinc with the Hair Vitamins + Minoxidil tablet: CONFIRMED as policy.",
        "R11 no oral minoxidil for telogen effluvium or alopecia areata: WEAKENED. The sentence was found only on a non-public copy of the page (internal.forhers.com, not opened).",
        "R14 provider decides, R15 video visit in some states, R16 no consultation for non-prescription products: CONFIRMED word for word.",
        "Product facts checked against reviews re-read at stage 3 (live product pages are blocked): oral minoxidil 1.25 to 2.5 mg and $29 (confirmed); chew and Hair Vitamins + Minoxidil (actives confirmed; $35 against $39 unresolved); Hair Blends Serum 7% minoxidil with biotin, B5, ketoconazole (confirmed); Postmeno Serum ingredients (confirmed, strengths not); spray 0.3% / 6% (confirmed), price $39 in 2023 and $50 a month in Nov 2026; 5% foam $54 and $12.67 (confirmed, 2023); 2% solution $45 (confirmed in three reviews); biotin gummies 300 mcg (confirmed); Triple Threat price (corrected); Full Volume $32 / $30 (confirmed); mask and scrub $44 (2023 only).",
        "Reviewer descriptions of the quiz re-read: Innerbody Dec 2023 (health topics, account to see results, keep or swap), AOL / New York Post Jun 2026 (visual quiz, density photos, 'not the official medical evaluation', photos and ID), NCOA Nov 2026 (10 to 15 minutes, one or two products), Healthline Nov 2026 (ID and card), Hello! Magazine May 2025 (partner article: goals, symptoms, routines). Mostly as stages 1 and 2 reported; the differences are listed under corrected.",
        "Checked that the sister site does not serve Hers pages (runs/verify-hims-hers-pages: three addresses, all 404).",
        "Evidence labels audited: there was no 'observed' or 'code' label to downgrade. Labels based only on third-party reviews were lowered (see corrected)."
    ],
    "corrected": [
        "Evidence labels: 12 questions known only from third-party reviews changed from docs to inferred (q3 to q11, q14, q15, q17), with the source named; 'docs' is kept only where Hers or a Hims & Hers partner article says it (q1, q2, q12, q13, q16).",
        "Four options (pregnant, breastfeeding, pre-menopausal, post-menopausal) changed from docs to inferred: the policy is documented, the link to a quiz answer is not.",
        "Three questions (gradual or sudden, hair type, washing frequency) marked UNVERIFIED: no source could be found for them.",
        "Spironolactone (p8): label lowered to inferred and marked 'status uncertain'. No review lists it in the hair range and one 2026 review says Hers does not offer it; the unsourced '$30 a month' price was dropped; it was removed from the baseline woman's offered list; rules R8 and R9 now start 'if still offered'.",
        "Postmenopausal spray (p7): label lowered to inferred; the $39 price is from 2023 only (finvsfin gives no price for it); it may have been replaced by the Postmeno Serum.",
        "Postmeno Serum (p6): the 6% and 0.3% strengths are now marked as unconfirmed for the serum.",
        "Chew and Hair Vitamins + Minoxidil (p2, p4): minoxidil strength filled in as '1.25 mg or 2.5 mg according to one 2023 review'; price shown as $35 or $39.",
        "Minoxidil 2% solution (p10): one-time price set to $45 (three reviews); the $30 figure is unconfirmed.",
        "Triple Threat (p12): price corrected to $38 for a shampoo 2-pack and $47 for a conditioner 2-pack.",
        "Detox Scalp Scrub (p15): label lowered to inferred (2023 review only).",
        "R5 (under 18): effect changed from hard-stop to product-removed; no stop screen is documented.",
        "R7 and R11: the Fortune review was wrongly used as support. It reviews the over-the-counter 2% solution and gives the reviewer's own advice. Removed as proof.",
        "R8 and R11: confidence lowered to low. R10: effect changed to product-removed (only the exclusion is documented). R17: label lowered to inferred (third-party only).",
        "Recommendation profiles for pregnancy and for sudden or patchy loss changed from docs to inferred with default 'unknown'; the 'no prescription' profile's default changed from p9 to unknown.",
        "Added: rule R19 (state limits and Puerto Rico, from the help centre), a codeHints block (old Hers hair experiment names in the sister site's page state), four verify run records, and a new Hers source (treatment terms page for oral minoxidil, via search summary)."
    ],
    "stillUnverified": [
        "Everything about quiz behaviour: no question, option, branch, stop screen or recommendation was seen. Every rule is policy or reasoning, not tested behaviour.",
        "The exact wording and order of every question; all option lists; where the account step sits today.",
        "All statements read only through a search index of Hers's own pages: prices on product pages, the under-18, kidney, liver and blood pressure exclusions, the 'already using minoxidil' exclusion, the breastfeeding FAQ, finasteride 'only after menopause' on the perimenopause page, and the spironolactone medicines list.",
        "Whether spironolactone and the postmenopausal spray are still sold; the Postmeno Serum's strengths; strengths of the chew and gummy; any plan-length price for a prescription product.",
        "Whether the starting price of the blends is $35 or $39 today.",
        "The default product for any profile, and whether 'vitamins with your treatment' still exists as a question.",
        "Which states limit which hair treatments, and which states need a video visit.",
        "Complaint themes and the subscription terms quoted at stage 1 were not re-checked."
    ],
    "verdict": (
        "Trust this report as a map of Hers's published policy and product range, not as a description of its quiz. The "
        "site was blocked at all three stages, so no answer was ever changed and replayed and nothing is observed. The "
        "safety rules that rest on the help-centre leaflets (finasteride not before menopause; no oral minoxidil in "
        "pregnancy, when planning one or when breastfeeding; pheochromocytoma; heart history to the provider; provider "
        "decides; video visit in some states) were re-read word for word and are solid as policy. The product list is "
        "broadly right for the five core prescription products and the over-the-counter items, with prices good to within "
        "a few dollars and several strengths unknown. The quiz outline is second-hand, partly three years old, and three of "
        "its questions have no traceable source. Spironolactone and the spray may no longer be sold. After the stage 3 "
        "corrections the labels are honest: 'docs' means Hers, its help centre or a partner article says so (sometimes "
        "read only through a search index, which is flagged each time); 'inferred' covers reviewer reports and reasoning. A reader should not use this file to say what any single answer does in the Hers quiz."
    )
}

P.write_text(json.dumps(d, indent=2, ensure_ascii=False) + "\n", encoding="utf8")
print("stage 3 applied:", len(d["products"]), "products,", len(d["rules"]), "rules,", len(d["experiments"]), "experiments")
