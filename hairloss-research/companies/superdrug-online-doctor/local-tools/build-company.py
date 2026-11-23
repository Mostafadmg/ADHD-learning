#!/usr/bin/env python3
"""Builds company.json for Superdrug Online Doctor from the facts gathered in stage 1 (MAP).
Stage 2 can edit this script (or company.json directly) to add rules and experiments."""
import json, os
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://onlinedoctor.superdrug.com"

def opt(label, effect, effectType="unknown", affects=None, evidence="unknown"):
    return {"label": label, "effect": effect, "effectType": effectType, "affects": affects or [], "evidence": evidence}

UNTESTED_MEN = ("Not tested yet. Nothing changes on screen in the questionnaire definition. The men's service has its product "
                "filter switched off in the served settings, so the product list should stay the same; what the doctor does "
                "with this answer after payment is unknown.")
UNTESTED_WOMEN = ("Not tested yet. Nothing changes on screen in the questionnaire definition. The women's services have the product "
                  "filter switched on, so this answer may remove products from 'Your request'; stage 2 must test it.")
BASE_M = "Baseline answer. Questionnaire accepted; full product list shown on 'Your request' (runs/baseline-men)."
BASE_W = "Baseline answer. Questionnaire accepted; the product-rules call returned no filters and all five options were shown (runs/baseline-women-regaine)."

products = [
 {"id": "p1", "name": "Finasteride 1mg tablets (generic)", "category": "rx-oral",
  "actives": [{"name": "finasteride", "strength": "1mg"}], "form": "tablet, one a day", "audience": "men",
  "legalStatus": "POM, licensed generic (site: 'prescription-only'; made by Milpharm Ltd)",
  "price": "£27.00 for 28 tablets (1 month), one-off order",
  "priceDetail": "56 tablets £54.00; 84 tablets £79.00; 168 tablets £137.00. With code HL40 (40% off the hair-loss service): £16.20 / £32.40 / £47.40 / £82.20. No subscription: each supply is a separate order (reorder from the account). Standard delivery and pharmacy collection free; express £3.99.",
  "url": SITE + "/finasteride.html",
  "recommendedWhen": "Shown to every man who completes the men's questionnaire: the baseline man saw all four pack sizes. The patient picks a 'preferred treatment'; a doctor approves, swaps or refuses after payment. Not offered in the women's flows.",
  "evidence": "observed"},
 {"id": "p2", "name": "Propecia 1mg tablets (brand)", "category": "rx-oral",
  "actives": [{"name": "finasteride", "strength": "1mg"}], "form": "tablet, one a day", "audience": "men",
  "legalStatus": "POM, licensed brand (Organon Pharma)",
  "price": "£60.00 for 28 tablets (1 month), one-off order",
  "priceDetail": "56 tablets £110.00; 84 tablets £140.00; 168 tablets £265.00. With code HL40: £36.00 / £66.00 / £84.00 / £159.00.",
  "url": SITE + "/propecia.html",
  "recommendedWhen": "Shown to every man who completes the men's questionnaire, next to generic finasteride (baseline man saw all four pack sizes). Patient's choice; doctor decides after payment.",
  "evidence": "observed"},
 {"id": "p3", "name": "Regaine for Men Extra Strength foam 50mg/g (3 x 73ml)", "category": "otc-medicine",
  "actives": [{"name": "minoxidil", "strength": "5% (50mg/g)"}], "form": "scalp foam, twice a day", "audience": "men",
  "legalStatus": "Non-prescription medicine (site: 'available without a prescription'; the site does not say whether it is P or GSL)",
  "price": "£65.99 for 3 x 73ml",
  "priceDetail": "Hair-loss page shows £39.59 with HL40; the product page shows a different code, HL30 (£46.19).",
  "url": SITE + "/regaine-for-men.html",
  "recommendedWhen": "unknown. It is on the men's price table and its page says 'one of our doctors will check whether Regaine is suitable', but it was NOT in the men's 'Your request' list in the baseline run (only finasteride, Propecia and the phone consultation were). How a man orders it is not clear.",
  "evidence": "docs"},
 {"id": "p4", "name": "Regaine for Men Extra Strength solution 5% w/w (3 x 60ml)", "category": "otc-medicine",
  "actives": [{"name": "minoxidil", "strength": "5% w/w"}], "form": "scalp solution, 1ml twice a day", "audience": "men",
  "legalStatus": "Non-prescription medicine (site: 'non-prescription treatment'; P or GSL not stated)",
  "price": "£70.00 for 3 x 60ml",
  "priceDetail": "Hair-loss page shows £42.00 with HL40; the product page shows HL30 (£49.00).",
  "url": SITE + "/regaine-for-men.html",
  "recommendedWhen": "unknown. Listed on the men's price table but not shown in the men's 'Your request' list in the baseline run.",
  "evidence": "docs"},
 {"id": "p5", "name": "Alpecin Caffeine Shampoo 250ml", "category": "cosmetic",
  "actives": [{"name": "caffeine", "strength": "not stated"}], "form": "shampoo, daily, leave on 2 minutes", "audience": "both",
  "legalStatus": "Cosmetic shampoo (site: 'non-prescription hair loss treatment'). The product API flags it prescription=true, which looks like a set-up quirk: it is still reviewed by a doctor.",
  "price": "£7.50 for 250ml",
  "priceDetail": "Hair-loss page shows £4.50 with HL40; the Alpecin page shows HL30 (£5.25) and a headline 'from £5.50' that matches no table row.",
  "url": SITE + "/alpecin.html",
  "recommendedWhen": "Shown to the baseline woman on 'Your request' in both women's entry points. Listed on the men's price table but NOT shown in the men's product step in the baseline run.",
  "evidence": "observed"},
 {"id": "p6", "name": "Alpecin Double Effect Shampoo 200ml", "category": "cosmetic",
  "actives": [{"name": "caffeine", "strength": "not stated"}, {"name": "salicylic acid", "strength": "not stated"}], "form": "anti-dandruff shampoo, daily", "audience": "both",
  "legalStatus": "Cosmetic shampoo (non-prescription)",
  "price": "£9.99 for 200ml",
  "priceDetail": "Hair-loss page shows £5.99 with HL40; the Alpecin page shows HL30 (£6.99).",
  "url": SITE + "/alpecin.html",
  "recommendedWhen": "Shown to the baseline woman on 'Your request' in both women's entry points. Not shown in the men's product step in the baseline run.",
  "evidence": "observed"},
 {"id": "p7", "name": "Regaine for Women 2% w/w solution 60ml", "category": "otc-medicine",
  "actives": [{"name": "minoxidil", "strength": "2% w/w"}], "form": "scalp solution, 1ml twice a day", "audience": "women",
  "legalStatus": "Non-prescription medicine (P or GSL not stated on site). Product page: for women aged 18 to 65 with hereditary hair loss.",
  "price": "£25.00 for 60ml",
  "priceDetail": "One pack size only. No discount code shown on the women's pages.",
  "url": SITE + "/regaine-for-women.html",
  "recommendedWhen": "Shown first on 'Your request' when a woman enters through 'Request Regaine for Women' (service 147757) and second through 'Request Nourkrin' (147778). The women's services filter products by answers (served settings), so some answers probably remove it: not yet tested.",
  "evidence": "observed"},
 {"id": "p8", "name": "Nourkrin Woman Hair Growth Tablets (60)", "category": "supplement",
  "actives": [{"name": "Marilex (fish extract)", "strength": "not stated"}], "form": "tablet, one twice a day", "audience": "women",
  "legalStatus": "Food supplement (site: 'nutritional supplement'). Not suitable for women allergic to fish.",
  "price": "£51.00 for 60 tablets (1 month)",
  "priceDetail": "One pack size only. Hair-loss-in-women page: £0.85 per tablet.",
  "url": SITE + "/nourkrin-woman.html",
  "recommendedWhen": "Shown first on 'Your request' through 'Request Nourkrin' (service 147778) and second through 'Request Regaine for Women' (147757). May be removed by some answers (for example fish allergy): not yet tested.",
  "evidence": "observed"},
 {"id": "p9", "name": "Telephone Consultation with a Doctor (no medicine included)", "category": "service",
  "actives": [], "form": "10-minute phone call", "audience": "both",
  "legalStatus": "Clinical service from a CQC-registered provider (Health Bridge Ltd)",
  "price": "£25.00",
  "priceDetail": "Title says 'Available 2-3pm Friday'; its information text says appointments are 2pm to 3pm on Tuesday, Wednesday and Thursday (the site contradicts itself). Does not include treatment costs.",
  "url": SITE + "/hair-loss-consultation.html",
  "recommendedWhen": "Always the last option on 'Your request' in all three flows (men, women via Regaine, women via Nourkrin) for the baseline patients.",
  "evidence": "observed"},
]

def q(id, order, text, type, options, purpose, role, branches=False, branchDetail="", shownWhen="always", evidence="observed", stage="anonymous", **extra):
    d = {"id": id, "order": order, "stage": stage, "text": text, "type": type, "options": options, "purpose": purpose,
         "engineRole": role, "branches": branches, "branchDetail": branchDetail, "shownWhen": shownWhen, "evidence": evidence}
    d.update(extra); return d

REG_TEXT = ("Create your patient account. Fields: First Name; Last Name; Email (a verification code is sent); Password; Date of birth "
            "(day, month, year: the year list runs from 2011 back to 1900); Gender (Female / Male); Mobile number (optional); "
            "Superdrug.com marketing communications (optional tick); 'I agree to the Terms and Conditions and the Privacy Policy.'")

men_q = [
 q("men-info-1", 1, "These medical questions help our doctors treat you safely. Check that you fully understand them, and message us if you're unsure. (Banner above: 'Please note: This service is only available in the UK.')", "info", [],
   "Sets the frame: answers go to a doctor. Whole questionnaire is one scrolling page.", "expectation-setting", linkId=None),
 q("men-q1", 2, "Have you been diagnosed with Androgenic Alopecia (Male Pattern Baldness)?", "single", [
     opt("Yes, by my GP", UNTESTED_MEN), opt("Yes, by a specialist", UNTESTED_MEN),
     opt("No, self-diagnosis", BASE_M, "none", [], "observed")],
   "Checks whether a clinician has confirmed male pattern hair loss.", "diagnosis", linkId="439401001", required=True),
 q("men-q2", 3, "Please choose your hair pattern.", "single", [
     opt("A", "Picture: full head of hair, no visible loss. Shows the extra item 'Please upload 2 photos clearly showing your hair pattern.' (definition). Effect on products not tested.", "extra-questions", [], "code"),
     opt("B", "Picture: receding temples only. No extra item in the definition. " + UNTESTED_MEN),
     opt("C", "Picture: receding hairline plus a bald spot on the crown. " + BASE_M, "none", [], "observed"),
     opt("D", "Picture: deeper recession and a larger crown patch, with a band of hair between. No extra item in the definition. " + UNTESTED_MEN),
     opt("E", "Picture: top of the head bald, hair only at the sides. Shows the photo-upload item AND a required tick box warning that the medicine is unlikely to help much (definition). Effect on products not tested.", "extra-questions", [], "code"),
     opt("No pattern fits well", "Picture: a 'no' symbol. Shows the photo-upload item (definition). Effect on products not tested.", "extra-questions", [], "code")],
   "Grades the hair loss with five pictures (a simplified Norwood scale). The pictures are in pattern-images/.", "diagnosis", True,
   "A, E and 'No pattern fits well' add a photo-upload item; E also adds a required warning tick.", linkId="298000004", required=True),
 q("men-q2a", 4, "Please upload 2 photos clearly showing your hair pattern.", "photo", [],
   "Lets the doctor see the scalp when the picture choice is unusual (no loss, very advanced, or no match).", "diagnosis",
   shownWhen="men-q2 = A, E or 'No pattern fits well'", evidence="code", linkId="713128006", required=False,
   note="Definition: jpeg/png/gif, maxSize 3 (unit not stated, presumably MB), at most 2 files; the item carries no 'required' flag. Never uploaded in this research."),
 q("men-q2b", 5, "From the hair distribution image that you've selected, your hair loss may be quite extensive. In this case it is unlikely that this medication will lead to a significant improvement in your hair distribution. It is also possible that the side effects or possible risks of treatment may outweigh any benefits. Please tick to confirm if you would like to continue with the assessment.", "consent", [
     opt("(tick box)", "Required tick before 'Next' can be pressed (definition: required). It warns but does not stop the patient.", "soft-warning", ["p1", "p2"], "code")],
   "Sets expectations for advanced hair loss and records that the patient chose to go on.", "expectation-setting",
   shownWhen="men-q2 = E", evidence="code", linkId="2980000045", required=True),
 q("men-q3", 6, "Are you currently using finasteride (or the brand Propecia)?", "single", [
     opt("Yes", "Shows the free-text item 'Are you finding it effective? Have you had any side effects?' (definition). Effect on products not tested.", "extra-questions", [], "code"),
     opt("No", "Shows 'Have you taken finasteride or Propecia for hair loss before?' (seen in runs/baseline-men). Full product list shown.", "extra-questions", [], "observed")],
   "Separates new starters from men already on treatment.", "personalisation", True,
   "Yes adds a free-text follow-up; No adds a yes/no question about past use.", linkId="2304202", required=False),
 q("men-q3a", 7, "Are you finding it effective? Have you had any side effects?", "text", [],
   "Free text for the doctor about current treatment and tolerability.", "safety-screen",
   shownWhen="men-q3 = Yes", evidence="code", linkId="2304202.1", required=False),
 q("men-q3b", 8, "Have you taken finasteride or Propecia for hair loss before?", "single", [
     opt("Yes", "Shows the free-text item 'Was it effective? Did you have any side effects?' (definition). Effect on products not tested.", "extra-questions", [], "code"),
     opt("No", BASE_M, "none", [], "observed")],
   "Finds past users so the doctor can ask about results and side effects.", "safety-screen", True,
   "Yes adds a free-text follow-up.", shownWhen="men-q3 = No", linkId="23042020", required=False),
 q("men-q3c", 9, "Was it effective? Did you have any side effects?", "text", [],
   "Free text for the doctor about past treatment.", "safety-screen",
   shownWhen="men-q3b = Yes", evidence="code", linkId="23042020.1", required=False),
 q("men-q4", 10, "When did you first notice any hair loss?", "single", [
     opt("In the last month", UNTESTED_MEN), opt("More than a month ago", BASE_M, "none", [], "observed")],
   "Very recent loss points away from male pattern hair loss.", "diagnosis", linkId="276131009", required=True),
 q("men-q5", 11, "How did your hair loss start?", "single", [
     opt("Suddenly", "Shows two free-text items: 'Do you think your hair loss could be due to any other causes?' and 'Can you give more details about how your hair loss started?' (definition). Effect on products not tested.", "extra-questions", [], "code"),
     opt("Gradually (over months)", BASE_M, "none", [], "observed")],
   "Sudden onset suggests another cause (illness, stress, medicines).", "diagnosis", True,
   "Suddenly adds two free-text questions.", linkId="602", required=True),
 q("men-q5a", 12, "Do you think your hair loss could be due to any other causes?", "text", [],
   "Free text for the doctor.", "diagnosis", shownWhen="men-q5 = Suddenly", evidence="code", linkId="162463006.1", required=False),
 q("men-q5b", 13, "Can you give more details about how your hair loss started?", "text", [],
   "Free text for the doctor.", "diagnosis", shownWhen="men-q5 = Suddenly", evidence="code", linkId="162463006.2", required=False),
 q("men-q6", 14, "Have you noticed any other changes to the areas where you are losing hair? (Help text: Such as redness, itching, flaking or soreness)", "single", [
     opt("Yes", "Shows a warning text ('…We'd suggest you see your GP first to consider any other causes before taking this medication.') and a free-text box (definition). It does not stop the form in the definition. Effect on products not tested.", "soft-warning", ["p1", "p2"], "code"),
     opt("No", BASE_M, "none", [], "observed")],
   "Scalp symptoms suggest a skin disease rather than pattern hair loss.", "diagnosis", True,
   "Yes adds a 'see your GP first' message and a free-text box.", linkId="716", required=False),
 q("men-q6a", 15, "These symptoms suggest there could be other causes contributing to your hair loss, other than male pattern hair loss, which may improve with other treatments. We'd suggest you see your GP first to consider any other causes before taking this medication.", "info", [],
   "Soft warning: steers the patient to a GP.", "safety-screen", shownWhen="men-q6 = Yes", evidence="code", linkId="248283007"),
 q("men-q6b", 16, "Please describe the all changes that you've noticed", "text", [],
   "Free text for the doctor (wording copied exactly, including the typo).", "diagnosis", shownWhen="men-q6 = Yes", evidence="code", linkId="716.1", required=False),
 q("men-q7", 17, "Can you always get and maintain an erection when you want one?", "single", [
     opt("Yes", BASE_M, "none", [], "observed"),
     opt("No", "Shows a warning text: finasteride and Propecia cause sexual problems in around 2% of men, so erectile dysfunction may get worse (definition). It does not stop the form. Effect on products not tested.", "soft-warning", ["p1", "p2"], "code")],
   "Baseline sexual function before a medicine that can cause erectile dysfunction.", "safety-screen", True,
   "No adds a warning text.", linkId="021106", required=True),
 q("men-q7a", 18, "One of the side effects of finasteride and Propecia, which occurs in around 2% of men, is problems with sexual function, including erectile dysfunction, meaning your symptoms of ED may worsen.", "info", [],
   "Soft warning about sexual side effects.", "expectation-setting", shownWhen="men-q7 = No", evidence="code", linkId="021107"),
 q("men-q8", 19, "Do you have, or have you had, any of the following conditions?", "multi", [
     opt("Prostate cancer", UNTESTED_MEN), opt("Breast cancer", UNTESTED_MEN),
     opt("Liver condition", "Shows a required free-text item 'Please provide more details.' (definition). Effect on products not tested.", "extra-questions", [], "code"),
     opt("Any type of skin conditions", "Shows a required free-text item 'Please provide more details.' (definition). Effect on products not tested.", "extra-questions", [], "code"),
     opt("None of the above", "Exclusive option. " + BASE_M, "none", [], "observed")],
   "Screens for conditions that matter with finasteride (it lowers PSA, has been linked to male breast cancer reports, and is cleared by the liver) and for skin disease.", "safety-screen", True,
   "Liver condition or skin condition adds a required details box.", linkId="723", required=True),
 q("men-q8a", 20, "Please provide more details.", "text", [],
   "Free text about the liver or skin condition.", "safety-screen", shownWhen="men-q8 includes 'Liver condition' or 'Any type of skin conditions'", evidence="code", linkId="729", required=True),
 q("men-q9", 21, "Do you have any other medical conditions not mentioned above?", "single", [
     opt("Yes", "Shows a free-text item 'Please provide more details' (definition). Effect on products not tested.", "extra-questions", [], "code"),
     opt("No", BASE_M, "none", [], "observed")],
   "Catch-all medical history. Note: there is no specific question about depression, although the consent text and product text warn about it.", "safety-screen", True,
   "Yes adds a details box.", linkId="724", required=False),
 q("men-q9a", 22, "Please provide more details", "text", [], "Free text for the doctor.", "safety-screen", shownWhen="men-q9 = Yes", evidence="code", linkId="724.1", required=False),
 q("men-q10", 23, "Are you currently taking any medication, or have you recently finished a course of medication?", "single", [
     opt("Yes", "Shows two required free-text items: 'Please list the names and doses of all these medications?' and 'What do you use these medications for?' (definition). Effect on products not tested.", "extra-questions", [], "code"),
     opt("No", BASE_M, "none", [], "observed")],
   "Medicines history for the doctor.", "safety-screen", True, "Yes adds two required text boxes.", linkId="47", required=True),
 q("men-q10a", 24, "Please list the names and doses of all these medications?", "text", [], "Free text for the doctor.", "safety-screen", shownWhen="men-q10 = Yes", evidence="code", linkId="48", required=True),
 q("men-q10b", 25, "What do you use these medications for?", "text", [], "Free text for the doctor.", "safety-screen", shownWhen="men-q10 = Yes", evidence="code", linkId="48.1", required=True),
 q("men-q11", 26, "Are you allergic to any medicines or other substances? (Help text: For instance peanuts or soya.)", "single", [
     opt("Yes", "Shows the required tick list 'What allergies do you have?' (definition). Effect on products not tested.", "extra-questions", [], "code"),
     opt("No", BASE_M, "none", [], "observed")],
   "Allergy screen.", "safety-screen", True, "Yes adds an allergy tick list.", linkId="49", required=True),
 q("men-q11a", 27, "What allergies do you have?", "multi", [
     opt("Finasteride", UNTESTED_MEN + " (Clinically this should rule out both tablets.)"),
     opt("Peanuts or Soya", "Shows a required tick box explaining that some manufacturers' tablets are not suitable for people with peanut or soya allergy (definition).", "extra-questions", [], "code"),
     opt("Lactose", "Shows the yes/no item 'Can you take medication that contains lactose?' (definition).", "extra-questions", [], "code"),
     opt("Other medications", "Shows a required free-text item asking what the patient is allergic to (definition).", "extra-questions", [], "code"),
     opt("Other substances", "Shows a required free-text item asking what the patient is allergic to (definition).", "extra-questions", [], "code")],
   "Picks out allergies that matter for finasteride tablets and their excipients.", "safety-screen", True,
   "Peanut/soya, lactose and 'other' each add a follow-up.", shownWhen="men-q11 = Yes", evidence="code", linkId="49.1", required=True),
 q("men-q11b", 28, "Our pharmacists source medication from a wide range of approved manufacturers to ensure we have a good supply available. Some manufacturers produce medication that isn’t suitable for people who suffer with peanut or soya allergies. Before starting your medication, it’s important to check the enclosed manufacturer’s leaflet to make sure the medication you’ve received is suitable for people with peanut or soya allergies. We also recommend checking with your local pharmacist. Please tick if you’d still like to proceed with your order.", "consent", [
     opt("(tick box)", "Required tick before 'Next' (definition). A warning, not a stop.", "soft-warning", ["p1", "p2"], "code")],
   "Shifts the excipient check to the patient.", "consent", shownWhen="men-q11a includes 'Peanuts or Soya'", evidence="code", linkId="2004", required=True),
 q("men-q11c", 29, "Can you take medication that contains lactose?", "single", [opt("Yes", UNTESTED_MEN), opt("No", UNTESTED_MEN)],
   "Finasteride tablets usually contain lactose.", "safety-screen", shownWhen="men-q11a includes 'Lactose'", evidence="code", linkId="49.2", required=False),
 q("men-q11d", 30, "Please tell us what medications or substances you’re allergic to.", "text", [], "Free text for the doctor.", "safety-screen",
   shownWhen="men-q11a includes 'Other medications' or 'Other substances'", evidence="code", linkId="49.3", required=True),
 q("men-c1", 31, "Almost done. Important information to read and confirm you agree and understand: Trying for a baby – Finasteride may affect male fertility while you are taking it. These changes are usually reversible after stopping treatment, but recovery may take several months. If you are planning to try for a baby, it is best not to use this or to stop it several months before trying to conceive. Depression – Some people have experienced severe depression when taking finasteride. Before taking finasteride, read and keep the finasteride patient cards and patient information leaflet within your pack and inform your doctor if you have any personal history of depression or suicidal thought. You should stop taking this medication immediately if you notice that your mood is affected and speak to your doctor. Finasteride and your prostate – Finasteride can lower the level of a prostate protein called PSA (prostate-specific antigen) in your blood. Because of this, it’s recommended that you see your GP for a prostate check (rectal examination) and a PSA blood test before starting treatment, and then at regular intervals while taking it. How often this is needed will depend on your age and personal risk factors. These checks help to detect any prostate problems, including prostate cancer, as early as possible. Sexual problems – If you experience decreased sex drive, difficulty having an erection or ejaculation problems on finasteride, you should contact your doctor for medical advice. This medication is prescribed for your own personal use – If you are requesting any follow-up medication, you confirm you are tolerating your treatment and any side effects experienced. Your answers are used to make medical decisions – Answer the questions honestly and as accurately as you can. Our doctors rely on this information to prescribe treatment safely. Missing or incorrect information can increase the risk of side effects or lead to serious risk to your health. In case of questions, please contact us. By continuing, you confirm that you have understood the information provided, especially around treatment options, side effects, and effectiveness.", "consent", [
     opt("(tick box)", "Required. 'Next' stays greyed out until all required items are answered (seen in runs/consult-02 and runs/baseline-men).", "none", [], "observed")],
   "Informed consent. Fertility, depression and prostate (PSA) are handled here as warnings, not as questions.", "consent", linkId="22042020", required=True),
 q("men-c2", 32, "Please tick to acknowledge that it is best practice to inform your GP of any private treatment you receive. All treatment and messaging is completely confidential. However, you can easily update your GP by downloading a GP letter from the ‘Order History’ section of your account and sending it to them. If you prefer, we can send this letter directly to your GP, just send us their details", "consent", [
     opt("(tick box)", "Required tick.", "none", [], "observed")], "GP-sharing acknowledgement.", "consent", linkId="20102724", required=True),
 q("men-c3", 33, "Please tick here to signify that you have read, understand and agree to abide by our terms and conditions and privacy and cookie policy.", "consent", [
     opt("(tick box)", "Required tick. Then the 'Next' button sends the answers and opens 'Your request'.", "next-question", [], "observed")], "Terms and privacy agreement.", "consent", linkId="56", required=True),
 q("men-prod", 34, "Your request (choose one, then press 'Order')", "single", [
     opt("Finasteride 1mg - (1 month - Generic Treatment) (28 tablets) £27.00", "Shown to the baseline man. Not chosen.", "none", ["p1"], "observed"),
     opt("Finasteride 1mg - (2 months - Generic Treatment) (56 tablets) £54.00", "Shown to the baseline man. Not chosen.", "none", ["p1"], "observed"),
     opt("Finasteride 1mg - (3 months - Generic Treatment) (84 tablets) £79.00", "Chosen in runs/baseline-men-wall; 'Order' opens the Delivery step.", "next-question", ["p1"], "observed"),
     opt("Finasteride 1mg - (6 months - Generic Treatment) (168 tablets) £137.00", "Shown to the baseline man. Not chosen. The product data gives it fewer delivery modes (no pharmacy-collect modes 24 and 232).", "none", ["p1"], "observed"),
     opt("Propecia 1mg - (1 month) (28 tablets) £60.00", "Shown to the baseline man. Not chosen.", "none", ["p2"], "observed"),
     opt("Propecia 1mg - (2 months) (56 tablets) £110.00", "Shown to the baseline man. Not chosen.", "none", ["p2"], "observed"),
     opt("Propecia 1mg - (3 months) (84 tablets) £140.00", "Shown to the baseline man. Not chosen.", "none", ["p2"], "observed"),
     opt("Propecia 1mg - (6 months) (168 tablets) £265.00", "Shown to the baseline man. Not chosen.", "none", ["p2"], "observed"),
     opt("Telephone Consultation with a Doctor (does not include prescription medication): Available 2-3pm Friday (Only Phone consultation) £25.00", "Shown to the baseline man. Not chosen.", "none", ["p9"], "observed")],
   "The patient picks a 'preferred treatment' and pack size. Nothing is preselected and there is no recommendation label. The entry page says the doctor may offer an alternative if the preferred one is not suitable.", "product-selector",
   True, "The choice sets the price and the delivery modes on the next step.", shownWhen="after pressing Next on the questionnaire"),
 q("men-del", 35, "Choose your delivery", "single", [
     opt("Free Standard Delivery (FREE) – with an optional tick 'Deliver without a signature'", "Chosen in runs/baseline-men-wall; 'Next' then opens the account wall.", "next-question", [], "observed"),
     opt("Superdrug Pharmacy Collect (FREE) – 'Find a location near' search box", "Not chosen (the store search needs a location).", "unknown", [], "unknown"),
     opt("Express Delivery (£3.99) – with an optional tick 'Deliver without a signature'", "Not chosen.", "unknown", [], "unknown")],
   "Delivery or in-store collection. No address is asked yet.", "data-capture", shownWhen="after pressing Order on 'Your request'"),
 q("men-wall", 36, REG_TEXT, "contact", [],
   "ACCOUNT WALL. Age (date of birth) and sex (Gender) are first asked here, after the medical questions. Nothing was typed.", "identity",
   shownWhen="after pressing Next on Delivery (URL /auth/register/?redirect=…/assessment/147929#/checkout/checkout-address)", stage="after-account"),
 q("men-after", 37, "After sign-in (not tested): delivery address ('checkout-address'), 'Your Order' summary, payment, 'Payment Successful'. The Help page says an ID check with photo ID may be required and that the doctor may put the order on hold and message questions.", "info", [],
   "Checkout and doctor review happen only after an account exists and payment is taken.", "identity",
   shownWhen="after creating an account", evidence="docs", stage="checkout"),
]

women_q = [
 q("women-info-1", 1, "These medical questions help our doctors treat you safely. Check that you fully understand them, and message us if you're unsure. (Banner above: 'Please note: This service is only available in the UK.')", "info", [],
   "Sets the frame. Whole questionnaire is one scrolling page, the same for both women's entry points.", "expectation-setting"),
 q("women-q1", 2, "Do you have or have you had:", "multi", [
     opt("a shaved scalp", UNTESTED_WOMEN), opt("sudden or patchy hair loss", UNTESTED_WOMEN),
     opt("skin problems on the scalp - such as sunburn or psoriasis", UNTESTED_WOMEN),
     opt("hair loss associated with childbirth", UNTESTED_WOMEN),
     opt("none of the above", "Exclusive option. " + BASE_W, "none", [], "observed")],
   "These four situations match the 'do not use' list for minoxidil scalp solution (shaved or damaged scalp, sudden/patchy loss, loss after childbirth).", "safety-screen", linkId="717", required=True),
 q("women-q2", 3, "Do you have, or are you using treatment for, high blood pressure?", "single", [
     opt("Yes", UNTESTED_WOMEN), opt("No", BASE_W, "none", [], "observed")],
   "Minoxidil can lower blood pressure; its leaflet tells people with treated or untreated high blood pressure not to use it.", "safety-screen", linkId="38341003", required=False),
 q("women-q3", 4, "Do you have any conditions affecting your heart? (Help text: Including an irregular heart beat.)", "single", [
     opt("Yes", "Shows a required free-text item 'Please provide more details:' (definition). Effect on products not tested.", "extra-questions", [], "code"),
     opt("No", BASE_W, "none", [], "observed")],
   "Heart disease is a caution for minoxidil.", "safety-screen", True, "Yes adds a required details box.", linkId="719", required=False),
 q("women-q3a", 5, "Please provide more details:", "text", [], "Free text for the doctor.", "safety-screen", shownWhen="women-q3 = Yes", evidence="code", linkId="719.1", required=True),
 q("women-q4", 6, "Are you pregnant or breastfeeding?", "single", [
     opt("No", BASE_W, "none", [], "observed"), opt("I'm pregnant", UNTESTED_WOMEN), opt("I'm breastfeeding", UNTESTED_WOMEN)],
   "Minoxidil is not for use in pregnancy or breastfeeding. Note: there is no question about trying for a baby, contraception, periods or menopause.", "safety-screen", linkId="718", required=True),
 q("women-q5", 7, "Do you have any other health conditions?", "single", [
     opt("Yes", "Shows a free-text item 'Please provide more details' (definition). Effect on products not tested.", "extra-questions", [], "code"),
     opt("No", BASE_W, "none", [], "observed")],
   "Catch-all medical history.", "safety-screen", True, "Yes adds a details box.", linkId="1153", required=True),
 q("women-q5a", 8, "Please provide more details", "text", [], "Free text for the doctor.", "safety-screen", shownWhen="women-q5 = Yes", evidence="code", linkId="1154", required=False),
 q("women-q6", 9, "Are you currently taking any medication, or have you recently finished a course of medication?", "single", [
     opt("Yes", "Shows two required free-text items: 'Please list the names and doses of all these medications?' and 'What do you use these medications for?' (definition). Effect on products not tested.", "extra-questions", [], "code"),
     opt("No", BASE_W, "none", [], "observed")],
   "Medicines history.", "safety-screen", True, "Yes adds two required text boxes.", linkId="47", required=True),
 q("women-q6a", 10, "Please list the names and doses of all these medications?", "text", [], "Free text for the doctor.", "safety-screen", shownWhen="women-q6 = Yes", evidence="code", linkId="48", required=True),
 q("women-q6b", 11, "What do you use these medications for?", "text", [], "Free text for the doctor.", "safety-screen", shownWhen="women-q6 = Yes", evidence="code", linkId="48.1", required=True),
 q("women-q7", 12, "Are you allergic to any medicines or other substances?", "single", [
     opt("Yes", "Shows the required tick list 'Please tick all of the allergies that apply to you.' (definition). Effect on products not tested.", "extra-questions", [], "code"),
     opt("No", BASE_W, "none", [], "observed")],
   "Allergy screen.", "safety-screen", True, "Yes adds a ten-item allergy tick list.", linkId="49", required=True),
 q("women-q7a", 13, "Please tick all of the allergies that apply to you.", "multi", [
     opt("Minoxidil", UNTESTED_WOMEN + " (Likely target: Regaine for Women.)"),
     opt("Penicillin", UNTESTED_WOMEN),
     opt("Fish", UNTESTED_WOMEN + " (Likely target: Nourkrin, which contains fish extract.)"),
     opt("Caffeine", UNTESTED_WOMEN + " (Likely target: the two Alpecin shampoos.)"),
     opt("Peanuts or Soya", UNTESTED_WOMEN),
     opt("Ethanol", UNTESTED_WOMEN + " (Likely target: Regaine solution, which contains alcohol.)"),
     opt("Propylene glycol", UNTESTED_WOMEN + " (Likely target: Regaine solution.)"),
     opt("Lactose", UNTESTED_WOMEN),
     opt("Other medication", "Shows a required free-text item 'Please provide more details.' (definition).", "extra-questions", [], "code"),
     opt("Other substance", "Shows a required free-text item 'Please provide more details.' (definition).", "extra-questions", [], "code")],
   "Each option lines up with an ingredient of one of the four products, which fits a product-by-product filter.", "product-selector", True,
   "'Other' options add a details box. Product effects are the first thing stage 2 should test.", shownWhen="women-q7 = Yes", evidence="code", linkId="49.1", required=True),
 q("women-q7b", 14, "Please provide more details.", "text", [], "Free text for the doctor.", "safety-screen",
   shownWhen="women-q7a includes 'Other medication' or 'Other substance'", evidence="code", linkId="49.3", required=True),
 q("women-c1", 15, "Please tick to acknowledge that it is best practice to inform your GP of any private treatment you receive. All treatment and messaging is completely confidential. However, you can easily update your GP by downloading a GP letter from the ‘Order History’ section of your account and sending it to them. If you prefer, we can send this letter directly to your GP, just send us their details", "consent", [
     opt("(tick box)", "Required tick.", "none", [], "observed")], "GP-sharing acknowledgement.", "consent", linkId="20102724", required=True),
 q("women-c2", 16, "I fully understand the questions asked & have answered honestly & truthfully. I fully understand the side-effects of the treatment options, their effectiveness and alternative options & am happy to continue with my request. I confirm & agree that any treatment prescribed for me is for my personal use only.", "consent", [
     opt("(tick box)", "Required tick (one box for the three statements).", "none", [], "observed")], "Honesty, understanding and personal-use confirmation.", "consent", linkId="55", required=True),
 q("women-c3", 17, "Please tick here to signify that you have read, understand and agree to abide by our terms and conditions and privacy and cookie policy.", "consent", [
     opt("(tick box)", "Required tick. 'Next' then sends the answers, calls the product-rules service and opens 'Your request'.", "next-question", [], "observed")], "Terms and privacy agreement.", "consent", linkId="56", required=True),
 q("women-prod", 18, "Your request (choose one, then press 'Order')", "single", [
     opt("Regaine for Women 2% w/w (60ml) £25.00", "Shown to the baseline woman (first in the list via service 147757, second via 147778). Not chosen.", "none", ["p7"], "observed"),
     opt("Nourkrin Woman Hair Growth Tablets (60 tablets) £51.00", "Shown to the baseline woman (second via 147757, first via 147778). Not chosen.", "none", ["p8"], "observed"),
     opt("Alpecin Caffeine Shampoo (250ml) £7.50", "Shown to the baseline woman. Not chosen.", "none", ["p5"], "observed"),
     opt("Alpecin Shampoo Double Effect (200ml) £9.99", "Shown to the baseline woman. Not chosen.", "none", ["p6"], "observed"),
     opt("Telephone Consultation with a Doctor (does not include prescription medication): Available 2-3pm Friday (Only Phone consultation) £25.00", "Shown to the baseline woman. Not chosen.", "none", ["p9"], "observed")],
   "The patient picks one product. Nothing is preselected. The list is what is left after the product-rules filter (nothing was removed for the baseline woman).", "product-selector",
   True, "The entry point only changes the order of the first two rows.", shownWhen="after pressing Next on the questionnaire"),
 q("women-del", 19, "Choose your delivery", "single", [
     opt("Free Standard Delivery (FREE)", "Not walked in the women's flows; the step list served for services 147757 and 147778 is the same as the men's.", "unknown", [], "code"),
     opt("Superdrug Pharmacy Collect (FREE)", "Not walked in the women's flows.", "unknown", [], "code"),
     opt("Express Delivery (£3.99)", "Not walked in the women's flows.", "unknown", [], "code")],
   "Delivery or collection.", "data-capture", shownWhen="after pressing Order on 'Your request'", evidence="code"),
 q("women-wall", 20, REG_TEXT, "contact", [],
   "ACCOUNT WALL (seen in the men's flow; the women's services serve the same step list: section, product, delivery, checkout_summary, login, payment). Age and sex are first asked here.", "identity",
   shownWhen="after pressing Next on Delivery", evidence="code", stage="after-account"),
]

flows = [
 {"id": "men", "name": "Men's hair-loss consultation (service 147929 'HAIR LOSS SD 2', questionnaire 201037 version 7)", "audience": "men",
  "entryUrl": SITE + "/hair-loss-consultation.html",
  "assessmentUrl": SITE + "/assessment/147929",
  "stagesSummary": "One page with 11 always-shown medical questions (up to 18 conditional follow-up items) and 3 required ticks → 'Your request' (pick finasteride or Propecia pack, or a phone consultation) → Delivery choice → ACCOUNT WALL (create patient account: name, email, password, date of birth, gender) → address → order summary → payment → doctor review (not tested).",
  "questions": men_q},
 {"id": "women", "name": "Women's hair-loss consultation (services 147757 'SD Regaine Women' and 147778 'SD Nourkrin Woman'; both use questionnaire 201132 version 8)", "audience": "women",
  "entryUrl": SITE + "/hair-loss-in-women.html",
  "assessmentUrl": SITE + "/assessment/147757",
  "alsoEntersAt": SITE + "/assessment/147778",
  "stagesSummary": "One page with 7 always-shown medical questions (up to 6 conditional follow-up items) and 3 required ticks → product-rules filter call → 'Your request' (Regaine for Women, Nourkrin, two Alpecin shampoos, phone consultation) → Delivery → ACCOUNT WALL → address → order summary → payment → doctor review (after 'Your request' not walked in the women's flows).",
  "questions": women_q},
]

company = {
 "slug": "superdrug-online-doctor", "company": "Superdrug Online Doctor", "market": "UK", "website": SITE + "/",
 "parent": "Operated by Health Bridge Ltd (the Zava platform; company no. 07392646) under the Superdrug brand; medicines dispensed by Superdrug Stores plc pharmacies",
 "audiences": ["men", "women"],
 "model": "High-street pharmacy brand running a doctor-led online clinic on the Zava platform: one-page questionnaire, patient picks a preferred product, pays, then a GMC doctor approves, swaps or refuses; one-off orders with reorder, no subscription.",
 "checkedOn": "2026-11-23",
 "access": {
  "howTested": ["live-walk", "site-code", "public-docs"],
  "accountWall": "After the questionnaire, the product choice ('Your request') and the delivery choice. Pressing Next on Delivery redirects to /auth/register/ ('Create your patient account': first name, last name, email, password, date of birth, gender, optional mobile). Seen in runs/baseline-men-wall. Just before the wall the patient has already seen the full product list with prices and the delivery options.",
  "blockers": ["curl gets HTTP 403; the Playwright browser loads every page normally (no checkpoint seen)",
               "The cookie banner blocks clicks on the questionnaire until 'Deny Cookies' (#onetrust-reject-all-handler) is pressed; walk.js does not dismiss it on its own"],
  "coverageNote": "Stage 1 (map) only. All three entry points were walked with the baseline patients to the product screen; the men's flow was walked on through Delivery to the sign-in wall. Both full questionnaire definitions (FHIR JSON the page itself fetched) are saved, so every question, option and on-screen branch is known. No one-change experiments were run: what each answer does to the product list (women) or to the doctor's decision (all) is still unknown. Age and sex are only asked at account creation, so age and sex rules cannot be tested without an account. The repeat-order questionnaire (id 201038, men) is only for signed-in reorders and was not fetched."
 },
 "entryPoints": [
  {"label": "Request Treatment (men's hair-loss service page, consultation page, and the Finasteride, Propecia, Regaine for Men, Alpecin, topical-finasteride and minoxidil pages)", "from": [SITE + "/hair-loss-treatment.html", SITE + "/hair-loss-consultation.html", SITE + "/finasteride.html", SITE + "/propecia.html", SITE + "/regaine-for-men.html", SITE + "/alpecin.html", SITE + "/topical-finasteride.html", SITE + "/minoxidil.html"], "leadsTo": SITE + "/assessment/147929", "flow": "men", "evidence": "observed (links in runs/scout-products, runs/consult-00)"},
  {"label": "Request Regaine for Women", "from": [SITE + "/hair-loss-in-women.html", SITE + "/regaine-for-women.html", SITE + "/nourkrin-woman.html"], "leadsTo": SITE + "/assessment/147757", "flow": "women", "evidence": "observed (runs/baseline-women-regaine)"},
  {"label": "Request Nourkrin", "from": [SITE + "/hair-loss-in-women.html", SITE + "/regaine-for-women.html", SITE + "/nourkrin-woman.html"], "leadsTo": SITE + "/assessment/147778", "flow": "women (same questionnaire, Nourkrin listed first)", "evidence": "observed (runs/baseline-women-nourkrin)"},
  {"label": "Reorder (pink 'reorder' button in the patient account → 'very short health assessment')", "from": [SITE + "/help.html"], "leadsTo": "signed-in only; men's repeat questionnaire id 201038 (not fetched)", "flow": "not tested", "evidence": "docs + code (assessment-api.json fhir_questionnaire_repeat_id)"}
 ],
 "products": products,
 "flows": flows,
 "rules": [
  {"id": "R1", "flow": "men", "when": "men-q2 (hair pattern) = A, E or 'No pattern fits well'",
   "then": "An extra item appears asking for 2 photos of the hair pattern (not flagged as required in the definition).",
   "effectType": "extra-questions", "affects": [], "evidence": "code", "proof": "quiz-definition.json linkId 713128006 enableWhen", "confidence": "high"},
  {"id": "R2", "flow": "men", "when": "men-q2 (hair pattern) = E",
   "then": "A required tick box warns that the medicine is unlikely to help extensive hair loss; the patient can still continue.",
   "effectType": "soft-warning", "affects": ["p1", "p2"], "evidence": "code", "proof": "quiz-definition.json linkId 2980000045", "confidence": "high"},
  {"id": "R3", "flow": "men", "when": "men-q6 (other scalp changes) = Yes, or men-q7 (erections) = No",
   "then": "A warning text is shown (see your GP first / erectile dysfunction may worsen). The definition has no stop: the form can still be sent.",
   "effectType": "soft-warning", "affects": ["p1", "p2"], "evidence": "code", "proof": "quiz-definition.json linkIds 248283007 and 021107", "confidence": "medium"},
  {"id": "R4", "flow": "men", "when": "any set of answers on the men's questionnaire",
   "then": "The product list is not filtered by answers: the service is served with fhir_product_filter_enabled = 0 and the page only calls the filter when that flag is on. The baseline run made no product-rules call. Suitability is left to the doctor after payment.",
   "effectType": "none", "affects": ["p1", "p2", "p9"], "evidence": "code", "proof": "assessment-api.json (service 147929) + applyClinicalProductFilters in runs/baseline-men-delivery/js/…assessment_legacy….js; runs/baseline-men-wall/api.jsonl shows no product-rules call", "confidence": "medium"},
  {"id": "R5", "flow": "women", "when": "any set of answers on the women's questionnaire",
   "then": "After Next the page posts the answers to /consultation-triage/product-rules; every product id listed under data[].suggestions is removed from 'Your request'. For the baseline woman the reply was empty, so nothing was removed. Which answers remove which products is not yet known.",
   "effectType": "product-removed", "affects": ["p5", "p6", "p7", "p8"], "evidence": "code", "proof": "runs/baseline-women-regaine/api.jsonl (product-rules call, data: []) + filterProducts in the assessment script; services 147757/147778 have fhir_product_filter_enabled = 1", "confidence": "medium"}
 ],
 "experiments": [],
 "recommendations": [
  {"profile": "Baseline man: self-diagnosed, pattern C, never used finasteride, gradual loss for more than a month, no scalp changes, no erection problems, no conditions, medicines or allergies",
   "offered": ["p1", "p2", "p9"], "default": None,
   "note": "All four pack sizes of generic finasteride and of Propecia, plus the phone consultation. Nothing preselected, no 'recommended' label. Regaine for Men and Alpecin were not offered. (runs/baseline-men, runs/baseline-men-wall)", "evidence": "observed"},
  {"profile": "Baseline woman: none of the listed hair/scalp situations, no high blood pressure or heart condition, not pregnant or breastfeeding, no conditions, medicines or allergies",
   "offered": ["p7", "p8", "p5", "p6", "p9"], "default": None,
   "note": "Same five options from both entry points; the entry product is listed first. (runs/baseline-women-regaine, runs/baseline-women-nourkrin)", "evidence": "observed"}
 ],
 "engineSummary": "Superdrug Online Doctor does not run a recommendation quiz. Each service is a single-page medical questionnaire (served as FHIR JSON) with simple show/hide follow-ups and a few warning texts, followed by a product list from which the patient picks a 'preferred treatment'. In the men's service the list is fixed (generic finasteride or Propecia in four pack sizes, or a £25 phone consultation) and the served settings switch the answer-based product filter off, so the screening is done by a doctor after account creation and payment. In the women's services the filter is switched on: the answers go to a product-rules service that can remove products before the list is shown (rules not yet tested). Age and sex are not asked in the questionnaire at all; they are collected when the account is created.",
 "strengths": ["Trusted high-street brand; CQC-registered doctor service and GPhC-registered Superdrug pharmacies",
               "Very short and fast: one page, no account needed until after product and delivery choice, prices visible up front",
               "Low generic price (£27 a month, about £16 with code HL40; £137 for six months) and free delivery or same-day store collection",
               "Clear informed-consent text on fertility, depression, PSA/prostate and sexual side effects"],
 "weaknesses": ["Men are offered tablets only: no topical finasteride, no oral minoxidil, no combination, and Regaine/Alpecin are advertised for men but missing from the men's product step",
                "No recommendation or guidance on which product or pack to pick; no personalisation",
                "No direct questions on depression or mental health, family history, age or trying for a baby (handled by a consent tick or left to the doctor)",
                "Women get only OTC minoxidil 2%, a supplement and caffeine shampoo; no prescription options and no questions on periods, menopause, PCOS, thyroid or iron",
                "Site copy is inconsistent (HL40 vs HL30 codes, phone-consultation days, Alpecin 'from £5.50')",
                "No subscription or adherence support: every supply is a new order"],
 "opportunities": ["A guided result ('this is what suits you and why') instead of a bare product list",
                   "Topical and combination options for men who do not want oral finasteride",
                   "A real women's pathway with proper differential questions and prescription options",
                   "Ask about mood and fertility plans as questions, not just consent text",
                   "Subscription with check-ins and progress photos"],
 "sources": [
  {"title": "Hair Loss Treatments for Men (service page, prices, HL40)", "url": SITE + "/hair-loss-treatment.html"},
  {"title": "Hair loss service (consultation entry page)", "url": SITE + "/hair-loss-consultation.html"},
  {"title": "Men's assessment (questionnaire page)", "url": SITE + "/assessment/147929"},
  {"title": "Men's questionnaire definition (FHIR JSON fetched by the page; saved as quiz-definition.json)", "url": SITE + "/questionnaire-api/Prod/Questionnaire/201037"},
  {"title": "Women's questionnaire definition (saved as quiz-definition-women.json)", "url": SITE + "/questionnaire-api/Prod/Questionnaire/201132"},
  {"title": "Finasteride product page", "url": SITE + "/finasteride.html"},
  {"title": "Propecia product page", "url": SITE + "/propecia.html"},
  {"title": "Regaine for Men product page", "url": SITE + "/regaine-for-men.html"},
  {"title": "Alpecin product page", "url": SITE + "/alpecin.html"},
  {"title": "Hair Loss In Women (service page)", "url": SITE + "/hair-loss-in-women.html"},
  {"title": "Regaine for Women product page", "url": SITE + "/regaine-for-women.html"},
  {"title": "Nourkrin Woman product page", "url": SITE + "/nourkrin-woman.html"},
  {"title": "Topical Finasteride (article: 'Superdrug Online Doctor does not offer topical finasteride')", "url": SITE + "/topical-finasteride.html"},
  {"title": "Minoxidil For Hair Loss (article)", "url": SITE + "/minoxidil.html"},
  {"title": "Side Effects of Finasteride", "url": SITE + "/side-effects-finasteride.html"},
  {"title": "Side Effects of Propecia", "url": SITE + "/propecia-side-effects.html"},
  {"title": "Help & Frequently Asked Questions (order review, cancellations, reorder, ID check)", "url": SITE + "/help.html"},
  {"title": "Terms and Conditions (18+ for this service, cancellations)", "url": SITE + "/terms.html"},
  {"title": "Discounts and promotions (HL40 terms)", "url": SITE + "/discounts-and-promotions.html"},
  {"title": "Regulation (Health Bridge Ltd, CQC, GMC, GPhC 9010736)", "url": SITE + "/regulation.html"},
  {"title": "How it works", "url": SITE + "/how-it-works.html"},
  {"title": "Sitemap", "url": SITE + "/sitemap.xml"}
 ],
 "limitations": [
  "No one-change experiments yet: option effects marked 'unknown' are untested.",
  "The doctor's decision rules after payment cannot be seen from outside; only the on-screen engine is mapped.",
  "Age and sex are asked only at account creation, so under-18, over-65 and wrong-sex handling could not be tested.",
  "The men's repeat-order questionnaire (201038) and everything after sign-in (address, ID check, payment) were not seen.",
  "The site does not state whether Regaine products are P or GSL; legal class is recorded only as 'non-prescription'.",
  "Our browser was seen as outside the UK (clientIPCountryCode 'US' in the served settings) yet was not blocked; UK visitors may see the same pages but this was not confirmed."
 ]
}
json.dump(company, open(os.path.join(B, "company.json"), "w"), indent=1, ensure_ascii=False)
print("written", len(products), "products;", sum(len(f["questions"]) for f in flows), "questions")
