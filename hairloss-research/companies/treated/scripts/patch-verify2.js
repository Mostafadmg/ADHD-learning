const fs=require('fs');const F=__dirname+'/../company.json';const c=JSON.parse(fs.readFileSync(F,'utf8'));
if(!c.products.find(p=>p.id==='te-reg'))c.products.push({id:'te-reg',name:'Regaine (telogen effluvium category)',category:'otc-medicine',actives:[{name:'minoxidil',strength:'2% or 5% (the page describes Regaine for Men 5% solution and foam, Regaine for Women 5% foam and 2% solution)'}],form:'topical solution or foam',audience:'both',legalStatus:'Licensed non-prescription medicine (P or GSL class not checked)',price:'Not available (no price shown)',priceDetail:'Category page https://uk.treated.com/telogen-effluvium and product page show "Not available" on 2026-11-24; no consultation start link. Found through the site map in stage 3.',url:'https://uk.treated.com/telogen-effluvium/regaine',recommendedWhen:'Never offered: shown as "Not available" and not part of the hair-loss consultation. It is the only page on the site that describes women\'s hair-loss products.',evidence:'docs'});
c.sources.push({title:'Treated UK telogen effluvium category (Regaine, not available)',url:'https://uk.treated.com/telogen-effluvium'},{title:'Treated UK page site map',url:'https://uk.treated.com/page-sitemap.xml'});
c.weaknesses[5]='Blanket review flags (never used treatment, not seen a doctor) mean most first-time buyers go to clinician review; the screen does not tell them so (the review message is only in the server response).';
c.weaknesses[6]='Smoking (even ex-smokers) or any alcohol removes dutasteride from the automatic offer; we could not see a clinical reason for this (our judgement, not the company\'s statement).';
c.weaknesses[0]='No women\'s hair-loss service (hard stop on sex). The only women\'s products (Regaine for Women) sit in a telogen effluvium category marked "Not available".';
c.limitations[2]='Surgery, disability, family-history and recreational-drug entries in the medical profile were not replayed (served limits say they send the case to review; medication and allergy were confirmed live in stage 3). Drinking over 14 units, occasional smoking and similar sub-options were not replayed one by one.';
c.limitations[3]=c.limitations[3].replace('men-q2 under 3 months; ','').replace('men-q7 over six months; ','');
c.limitations[4]='Why BMI over 35 sends the whole case to review is unclear: it happens even from the Dutasteride link with Dutasteride pre-selected (runs/verify-dut-bmi40), although the dutasteride products carry no BMI limit (offerBmi false). So it is not "the default product fails its limits"; the rule is server-side and not visible in the served data.';
c.limitations.push('The automatic-offer versus clinician-review decision is read from the options response the page fetched (mode, displayMessage). It is not shown to the patient on screen in any captured run, so its practical effect after checkout (for example how fast an automatic offer is dispatched) is unknown.');
c.verification={
checked:[
'Baseline man replayed fresh (runs/verify-baseline): mode Offline, five products, Finasteride 1mg x28 £34.95 pre-selected. Matches the record.',
'Auto-offer base replayed fresh (runs/verify-auto): mode Auto, same five products and default. Matches.',
'Women baseline (runs/verify-women): hard stop pop-up on Female. Confirmed (R1).',
'R2 mental illness hard stop (runs/verify-mental): confirmed, inline warning and Continue disabled.',
'R17 smoker removes dutasteride and Avodart (runs/verify-smoke): confirmed, and the on-screen Edit list now shows only Finasteride, Regaine and Propecia.',
'R18 and R21 (runs/verify-dut-drink): light drinking from the Dutasteride link removes both dutasteride products and the default falls back to Finasteride. Confirmed.',
'R10 low blood pressure (runs/verify-bp-low): no effect, all five products on screen including Regaine. Confirmed.',
'R14 BMI 40 (runs/verify-bmi40): Offline. Confirmed; also Offline from the Dutasteride link (runs/verify-dut-bmi40).',
'R7 under 3 months (runs/verify-under3m) and R11 blood pressure last checked over six months ago (runs/verify-bpcheck-old): both Offline. Upgraded from code to observed.',
'R16 medication (runs/verify-medication) and allergy (runs/verify-allergy): both Offline. Upgraded from code to observed for these two entries.',
'Product facts re-read on the live pages on 2026-11-24: Finasteride 1mg £34.95/£55.95/£73.95/£130.95; Propecia 1mg £66.95/£114.95/£149.95/£287.95; Dutasteride 0.5mg 30/60/90 capsules £34.95/£63.95/£89.95; Avodart 0.5mg £47.95/£81.95/£113.95 (90 pack flagged Most Popular in the options data); Regaine 5% 3x60ml £99.95 and 3x73ml £104.95 (options data); Finasteride + Minoxidil Drops "Not available" and "currently unlicensed" as a combined formulation; dutasteride page says off-label for hair loss. All match the record.',
'Evidence labels: every run folder cited as proof exists; no observed claim without a run was found apart from the on-screen message claims corrected below.'],
corrected:[
'The automatic-offer and clinician-review messages ("our clinician has recommended", "We still need to review your consultation") were described as shown on the options screen. They are only in the server response: the visible screen text is identical in both modes (runs/verify-baseline vs runs/verify-auto, and no captured run shows either message). Fixed in 28 option effects, R3, R4, the options question, experiments e00/e01, the recommendations and the engine summary.',
'"Choose for me" was labelled flag-for-clinician as observed; only the note box was seen, so it is now extra-questions and what follows is marked unknown.',
'R7, R11 and R16 (medication, allergy) upgraded from code to observed with new runs; R16 confidence stays medium for the four entries still untested.',
'R14 and the BMI limitation rewritten: stage 2 guessed the default product failing its limits might explain it; runs/verify-dut-bmi40 rules that out.',
'Added a missing product page: Regaine in a telogen effluvium category (includes Regaine for Women), marked Not available and outside the consultation.',
'Weaknesses reworded where they stated opinion as fact (dutasteride smoking/alcohol rule) or claimed patients pay before review without evidence.'],
stillUnverified:[
'Age limits (18–49 for finasteride, Propecia and Regaine): date of birth is behind the account wall (code only, R26).',
'Surgery, disability, family history and recreational drugs in the medical profile (code only).',
'Pattern options breakage, back and sides, one side, medicine-induced, "Other"; blood pressure "I don\'t know"; most single conditions and symptoms other than heart and itchy scalp (code only, same server tag as confirmed options).',
'What the clinician does in review cases and after "Choose for me"; anything after the checkout account wall.',
'Why BMI over 35 overrides the whole automatic offer.'],
verdict:'Trustworthy as labelled for what an anonymous man sees. Both baselines and the eight highest-impact rules (female stop, mental-illness stop, smoking and alcohol removing dutasteride, product-link fallback, BMI, low blood pressure, review flags) were re-tested live and held. The one real error was presentational: earlier stages said the review or recommendation message appears on screen, but it only exists in the server response, so a patient cannot tell an automatic offer from a review case. Prices and strengths match the live pages. Remaining gaps are code-based rules marked as code, the age limit and everything behind the account wall.'};
fs.writeFileSync(F,JSON.stringify(c,null,2));console.log('ok');
