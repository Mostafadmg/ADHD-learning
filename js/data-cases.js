/* Branching cases. Cases marked "From your workbook" are adapted from the user's ADHD Management Strategies workbook / Case Studies 1–2. */
function C(t,fb,g,n){return {t:t,fb:fb,grade:g,next:n};}
window.CASES = {
ethan:{title:'Ethan, 12 — Equasym XL wearing off by mid-afternoon', img:'images/case-child.jpg', alt:'Illustration of a tired boy doing homework at a kitchen table', source:'From your workbook (Case Study 1)',
 summary:'Equasym XL 30 mg each morning. Focus is good at school but he cannot complete homework in the evening because the effect wears off mid-afternoon.', start:'a', nodes:{
 a:{text:'Equasym XL is 30% IR / 70% MR with a duration of roughly 8 hours (SPC; SPS). Taken at 07:30, it would be expected to fade by about 15:30. Ethan\'s HR, BP, appetite and sleep are acceptable.', ask:'What is the most appropriate option to discuss with the specialist?', choices:[
  C('Add a small dose of IR methylphenidate in the early afternoon (e.g. 5–10 mg), reviewing sleep','NICE 1.7.22 supports MR in the morning plus IR later in the day. The Equasym XL SPC notes a small late IR dose may help but warns to weigh against sleep disturbance.','good','b'),
  C('Switch to a 12-hour OROS product (e.g. Concerta XL) at an equivalent dose','Also reasonable — a longer-acting brand can cover homework time with a single dose. It is a valid alternative; discuss with the specialist and counsel on the new brand (MHRA DSU 2022).','ok'),
  C('Give the Equasym XL dose at lunchtime instead','Equasym XL should be given in the morning before breakfast; taking it late risks insomnia and leaves the morning uncovered.','bad'),
  C('Increase Equasym XL to 60 mg once daily','A higher dose does not lengthen duration much and raises adverse effects; 60 mg/day is the licensed maximum — not the logical first step.','bad')]},
 b:{text:'An afternoon IR dose of 5 mg at 15:00 is added. Two weeks later homework is better, but bedtime is 30 minutes later.', ask:'What do you advise?', choices:[
  C('Bring the IR dose earlier (e.g. 14:00–14:30), use a sleep diary and review after 1–2 weeks','NICE 1.8.17: monitor sleep (e.g. sleep diary) and adjust medication accordingly. Small timing changes often solve it.','good','end'),
  C('Start melatonin straight away from the pharmacy','Melatonin may be considered by the specialist (e.g. shared care in Cardiff & Vale CV54) but adjust timing first; it is not an OTC product in the UK for children.','ok'),
  C('Stop the IR dose and accept no homework support','Throws away a helpful change; try timing adjustment first.','bad')]},
 end:{end:true, text:'Ethan\'s regimen is optimised with a morning MR plus small early-afternoon IR dose; sleep is monitored.', summary:'Key learning: know each brand\'s duration (Equasym ≈ 8 h, Concerta-type ≈ 12 h) and use NICE 1.7.22 for top-ups.'}}},

mia:{title:'Mia, 10 — rebound irritability on IR methylphenidate', img:'images/case-mia.jpg', alt:'Illustration of a 10-year-old girl, arms folded and irritable after school, with her mother kneeling calmly beside her', source:'From your workbook (Case Study 2)',
 summary:'Medikinet (IR) 10 mg twice daily. Significant irritability and emotional outbursts when the afternoon dose wears off.', start:'a', nodes:{
 a:{text:'IR methylphenidate lasts about 4 hours; abrupt offset can cause "rebound" irritability. Mia\'s symptoms are otherwise controlled.', ask:'Best next step?', choices:[
  C('Discuss converting to a once-daily MR brand at an equivalent total daily dose (e.g. Medikinet XL 20 mg or Equasym XL 20 mg), which smooths the offset','MR products give a gentler decline and avoid a school dose (NICE 1.7.20). Medikinet XL 20 mg is intended to replace 10 mg breakfast + 10 mg lunchtime IR (SPC).','good','b'),
  C('Add a third IR dose at 16:00 to "cover" the rebound','A small late dose is sometimes used, but it may simply move the rebound later and disturb sleep. Consider MR conversion first.','ok'),
  C('Stop methylphenidate because of emotional side effects','Premature; rebound is a timing/formulation problem. NICE advises adjusting medication when behaviour changes — adjust timing/formulation first.','bad')]},
 b:{text:'Mia\'s parents choose Medikinet XL 20 mg each morning.', ask:'Which counselling point is essential?', choices:[
  C('Take with or after breakfast; capsule can be opened and sprinkled on a spoon of apple sauce or yoghurt and swallowed without chewing','Medikinet XL SPC: with or after breakfast. (The workbook\'s statement that Medikinet XL granules "cannot be opened or sprinkled" is incorrect — the SPC permits sprinkling.)','good','end'),
  C('Take on an empty stomach for best absorption','Incorrect for Medikinet XL — food affects its release profile; take with or after breakfast.','bad'),
  C('Crush the capsule contents into drinks','Contents must not be crushed or chewed.','bad')]},
 end:{end:true, text:'Mia is converted to an MR product with clear administration advice; rebound reduces.', summary:'Key learning: IR offset → consider MR; know food and administration rules for each brand.'}}},

liam15:{title:'Liam, 15 — slow onset on Concerta XL in early classes', img:'images/case-teen.jpg', alt:'Illustration of a teenager yawning at a classroom door', source:'From your workbook (Case Study 3)',
 summary:'Concerta XL 36 mg. Takes 1–2 hours to feel the effect, affecting early-morning lessons.', start:'a', nodes:{
 a:{text:'Concerta XL has a 22% IR overcoat; onset is about 1–2 h (SPS). Liam takes it at 08:15 as he leaves for school.', ask:'First step?', choices:[
  C('Check timing: take it on waking (e.g. 06:45–07:00) so it is working by first period','Simple, cost-free and often effective; onset 1–2 h is expected for OROS tablets.','good','b'),
  C('Switch immediately to Medikinet XL (50% IR) for a bigger early effect','A 50:50 product gives a stronger early effect but a shorter duration (~8 h) — a valid option if timing fails, but not first step.','ok'),
  C('Increase to 72 mg','72 mg is the adult maximum; the problem is onset, not dose. Not appropriate for a 15-year-old (licensed child max 54 mg).','bad')]},
 b:{text:'Taking it earlier helped partly; first period is still slow.', ask:'Next option to discuss with the specialist?', choices:[
  C('Add a small morning IR dose with the Concerta, or switch to a product with a higher IR proportion, then review','Combining MR and IR is supported by NICE 1.7.22; higher-IR MR products (e.g. 30:70, 50:50) give a faster early peak.','good','end'),
  C('Stop medication on school days','Not indicated.','bad')]},
 end:{end:true, text:'Liam\'s morning cover improves with earlier dosing ± IR top-up.', summary:'Key learning: match the release profile (IR:MR ratio) to the time of day symptoms matter most.'}}},

sophia:{title:'Sophia, 30 — appetite suppression and late-night insomnia (Meflynate XL)', img:'images/case-adult.jpg', alt:'Illustration of a woman snacking late at night in her kitchen', source:'From your workbook (Case Study 4)',
 summary:'Meflynate XL 30 mg (50:50 MR methylphenidate). Poor appetite during the day, overeating at night, and difficulty falling asleep.', start:'a', nodes:{
 a:{text:'Meflynate XL lasts about 8 h (SPS). She takes it at 10:00 because she wakes late on non-work days.', ask:'Most useful first intervention?', choices:[
  C('Review dose timing (take on waking, consistent time each day), plan a good breakfast before/with the dose and a planned evening meal; sleep diary','NICE NG87 1.8.5–1.8.8 (food with or after the dose, extra meals when the effect has worn off) and 1.8.17 (sleep diary). Late dosing extends effect into the evening.','good','b'),
  C('Add zopiclone at night','Hypnotics are not first line; fix timing and sleep hygiene first.','bad'),
  C('Switch to lisdexamfetamine','Lisdexamfetamine lasts longer (~13 h) and may worsen insomnia.','bad')]},
 b:{text:'After timing changes Sophia sleeps better. She has lost 3 kg in 3 months.', ask:'What monitoring applies?', choices:[
  C('Weight every 6 months in adults (more often if concerns), consider BMI monitoring and dietary advice; change medication if weight change persists','NICE NG87 1.8.5–1.8.8.','good','end'),
  C('No monitoring needed in adults','Incorrect — adults need weight every 6 months.','bad')]},
 end:{end:true, text:'Sophia\'s timing and meal plan improved sleep and appetite; weight is monitored.', summary:'Key learning: insomnia and appetite effects are often timing problems — fix the schedule before adding drugs.'}}},

emma:{title:'Emma, 19 — Elvanse benefits but insomnia, weight loss and anxiety', img:'images/case-student.jpg', alt:'Illustration of a student in a lecture hall wearing headphones', source:'From your workbook (Case Study 2 file, case 1)',
 summary:'ADHD combined type. Elvanse 30 mg increased to 50 mg; better focus and grades, but awake until 3 am, 4 kg weight loss in 2 months, increased social anxiety.', start:'a', nodes:{
 a:{text:'BP 124/78, HR 92. She takes the capsule at 11:00 on lecture days. She values the benefit.', ask:'Most appropriate adjustment?', choices:[
  C('Move dosing to early morning, reduce to the last well-tolerated dose (e.g. 40 mg) and review; dietary strategies; monitor anxiety','SPC: avoid afternoon doses (insomnia); use the lowest effective dose. NG87 1.8.5–1.8.8 weight strategies; anxiety monitored. Keep the benefit while reducing harm.','good','b'),
  C('Stop Elvanse and start atomoxetine immediately','Premature — she is responding. Atomoxetine is for intolerance/non-response to both stimulants (1.7.15).','bad'),
  C('Switch to dexamfetamine IR','NICE 1.7.14 option if she cannot tolerate the long effect profile — reasonable later, but adjust timing/dose first. IR also has higher diversion risk in a student setting.','ok')]},
 b:{text:'On 40 mg at 07:30 she sleeps by midnight and weight stabilises, but social anxiety persists.', ask:'Next?', choices:[
  C('Specialist review: assess anxiety as a comorbidity (CBT, consider whether the stimulant is contributing); NICE says offer the same ADHD medication choices in anxiety but titrate more slowly','NG87 1.7.18 and 1.7.28.','good','end'),
  C('Add propranolol from the pharmacy','Not appropriate without specialist assessment.','bad')]},
 end:{end:true, text:'Emma keeps the benefit with better timing and a lower dose; anxiety is assessed in its own right.', summary:'Key learning: optimise timing and dose before switching; comorbid anxiety does not exclude stimulants.'}}},

liam12:{title:'Liam, 12 — Amfexa wears off and he cannot take the school dose', img:'images/case-liam12.jpg', alt:'Illustration of a reluctant 12-year-old boy with a staff member in a school office at lunchtime', source:'From your workbook (Case Study 2 file, case 2)',
 summary:'Hyperactive-impulsive type. Switched to Amfexa (dexamfetamine IR) 5 mg twice daily after poor tolerance of methylphenidate. Effect lasts ~4 h, afternoon rebound irritability, difficulty swallowing the school dose.', start:'a', nodes:{
 a:{text:'He tolerated methylphenidate poorly but responds to dexamfetamine.', ask:'Next best step?', choices:[
  C('Discuss a trial of lisdexamfetamine (once-daily, capsule can be opened and dispersed in water/yoghurt), titrated from 20–30 mg','NICE 1.7.8–1.7.9 sequence and the Elvanse SPC administration options solve both duration and swallowing problems; he already responds to amfetamine.','good','b'),
  C('Increase Amfexa to 10 mg three times daily','Increases exposure without solving swallowing or school-dose issues.','bad'),
  C('Crush tablets into food at school','Amfexa tablets may be divided along score lines to aid swallowing, but this does not solve the duration or school-dose stigma/CD storage issues.','ok')]},
 b:{text:'Liam starts Elvanse 30 mg each morning. His mother asks how to give it as he still struggles with capsules, and whether Amfexa can just be stopped.', ask:'Your advice?', choices:[
  C('Open the capsule and mix the contents with yoghurt, water or orange juice and take it all straight away; the specialist plan should say how to stop dexamfetamine (SPC advises gradual withdrawal), and avoid giving Elvanse in the afternoon','Elvanse SPC §4.2 administration; Amfexa SPC advises tapering on stopping. Insomnia risk with afternoon doses.','good','end'),
  C('Crush the capsule contents and save half for after school','The whole dispersed dose should be taken at once; a split later dose is not how Elvanse is used and worsens sleep.','bad'),
  C('Give both Amfexa and Elvanse together long term','Not a recommended combination; the switch should be planned by the specialist.','bad')]},
 end:{end:true, text:'Liam moves to once-daily lisdexamfetamine with good afternoon cover.', summary:'Key learning: amfetamine responders with short duration or swallowing issues may suit lisdexamfetamine.'}}},

david:{title:'David, 21 — ADHD + autism, intolerant of three stimulants', img:'images/m9-counselling.jpg', alt:'Illustration of a pharmacist counselling a young man', source:'From your workbook (Case Study 2 file, case 3)',
 summary:'Methylphenidate (Concerta XL, Medikinet XL): appetite loss, weight loss, anxiety. Elvanse: insomnia, sensory sensitivity. Amfexa: emotional lability. Hesitant to try another stimulant.', start:'a', nodes:{
 a:{text:'Options given in your workbook: A) retry methylphenidate lower dose; B) add melatonin; C) switch to atomoxetine; D) stop all medication.', ask:'Most appropriate next step?', choices:[
  C('C — switch to atomoxetine (non-stimulant), titrated more slowly with monitoring','NICE NG87 1.7.15: offer atomoxetine to adults who cannot tolerate lisdexamfetamine or methylphenidate. Slower titration with ASD (1.7.28). Counsel: effect builds over weeks; suicidal ideation, liver and sexual dysfunction warnings.','good','b'),
  C('A — retry methylphenidate at a lower dose','He had problems on two methylphenidate brands; repeated stimulant trials against his wishes are not the best next step.','bad'),
  C('B — add melatonin for insomnia','Addresses only one adverse effect of one drug.','bad'),
  C('D — stop medication and rely on behavioural interventions','He wants treatment and still has significant impairment; non-drug support should be combined, not substituted (1.5.17).','bad')]},
 b:{text:'Atomoxetine 40 mg daily for 7 days then 80 mg. At week 3 he reports nausea and says it "isn\'t working".', ask:'Your counselling?', choices:[
  C('Take with food or split into two doses; explain full effect may take several weeks; review at 6+ weeks at an adequate dose','SPC: twice-daily dosing can help tolerability; onset is gradual. If no response to one stimulant and one non-stimulant → obtain a second opinion or refer to a tertiary service (NG87 1.7.16); other medicines only with tertiary advice (1.7.17).','good','end'),
  C('Stop now — it should work within days','Atomoxetine is slower than stimulants.','bad')]},
 end:{end:true, text:'David continues atomoxetine with tolerability measures and planned review.', summary:'Key learning: NICE sequence for adults ends with atomoxetine; guanfacine in adults only with tertiary advice.'}}},

anxiety:{title:'Zara, 16 — ADHD with comorbid anxiety', img:'images/case-anxiety.jpg', alt:'Illustration of an anxious teenager on a sofa with a parent', source:'Required scenario',
 summary:'Newly diagnosed combined-type ADHD with generalised anxiety. Her mother worries stimulants will "make the anxiety worse".', start:'a', nodes:{
 a:{text:'Specialist plans medication after environmental modifications. Zara is also starting CBT for anxiety.', ask:'What is NICE\'s position?', choices:[
  C('Offer the same ADHD medication choices as anyone else, but titrate more slowly and monitor more often','NG87 1.7.18 and 1.7.28. Treating ADHD can reduce secondary anxiety; monitor closely.','good','b'),
  C('Stimulants are contraindicated in anxiety — start atomoxetine','Not NICE guidance; anxiety is not a contraindication.','bad'),
  C('Treat anxiety with an SSRI first, then never use stimulants','Not supported.','bad')]},
 b:{text:'On methylphenidate MR her focus improves; anxiety is unchanged. Her GP later starts fluoxetine.', ask:'As the pharmacist, what do you flag?', choices:[
  C('Methylphenidate with serotonergic drugs: counsel on serotonin syndrome symptoms (rare); and if she were ever switched to atomoxetine, fluoxetine would markedly raise atomoxetine levels via CYP2D6','Concerta SPC §4.4/4.5 serotonin syndrome warning; atomoxetine SPC §4.5 CYP2D6.','good','end'),
  C('Absolute contraindication — refuse to supply','Not contraindicated; counsel and monitor.','bad')]},
 end:{end:true, text:'Zara is treated with standard choices, cautious titration and appropriate interaction counselling.', summary:'Key learning: anxiety ≠ contraindication; slower titration; know serotonergic and CYP2D6 issues.'}}},

bp:{title:'Mr K, 44 — raised BP on lisdexamfetamine (shared care review)', img:'images/case-bp.jpg', alt:'Illustration of a pharmacist measuring a man\'s blood pressure', source:'Required scenario',
 summary:'Stable on Elvanse 50 mg for 8 months under shared care. You are a pharmacist independent prescriber running the 6-monthly review.', start:'a', nodes:{
 a:{text:'Clinic BP 152/96, HR 98. Baseline was 128/80, HR 76. No chest pain, palpitations or syncope.', ask:'First action?', choices:[
  C('Repeat properly (rested, correct cuff); arrange home/ambulatory BP; review caffeine, alcohol, other sympathomimetics (e.g. decongestants)','NG87 1.8.11 requires sustained readings on 2 occasions; confirm before acting. Check OTC pseudoephedrine etc.','good','b'),
  C('Stop Elvanse immediately','Not required for a single reading without symptoms.','bad'),
  C('Ignore — stimulants always raise BP slightly','A rise of this size is clinically significant and needs confirmation.','bad')]},
 b:{text:'Home readings average 148/94 and resting HR 96 on repeat. A clinically significant increase is confirmed.', ask:'What does NICE advise?', choices:[
  C('Reduce the dose and refer to an adult physician; inform the specialist team per the shared care protocol','NG87 1.8.11. Document, communicate, and recheck after the dose change (1.8.9).','good','end'),
  C('Add amlodipine and continue the same dose without telling the specialist','Shared care requires communication; NICE says reduce dose and refer.','bad')]},
 end:{end:true, text:'Dose reduced, physician referral made, specialist informed; BP rechecked after the change.', summary:'Key learning: confirm, then reduce and refer (NG87 1.8.11); BP/HR before and after each dose change.'}}},

shortage:{title:'Mrs P — Concerta XL out of stock for her son', img:'images/case-shortage.jpg', alt:'Illustration of a worried parent at a pharmacy counter', source:'Required scenario',
 summary:'Prescription for Concerta XL 36 mg #30 for Leo, 11. Your wholesaler cannot supply. Leo has 2 days left.', start:'a', nodes:{
 a:{text:'SPS lists Affenid XL, Atenza XL, Delmosart, Matoride XL, Xaggitin XL and Xenidate XL tablets as bioequivalent to Concerta XL.', ask:'What can you do?', choices:[
  C('Contact the prescriber to issue a new prescription for an available bioequivalent tablet brand (or generic as per local shortage policy), and counsel the family','Schedule 2 CD prescriptions specify the product; a pharmacist cannot substitute a different brand; a new prescription is needed. SPS supports switching between bioequivalent tablets; revert when supply returns.','good','b'),
  C('Supply Equasym XL 30 mg instead — close enough','Equasym XL is not bioequivalent (30:70, ~8 h); SPS: do not switch to/from Equasym XL. Also not legally permitted without a new prescription.','bad'),
  C('Make an emergency supply of 5 tablets','Emergency supply is not permitted for Schedule 2 CDs.','bad')]},
 b:{text:'The GP issues Xaggitin XL 36 mg. Mrs P is worried "the new one won\'t work".', ask:'Counselling?', choices:[
  C('Explain it is in the same bioequivalent group at the same dose; same once-daily morning timing; report any change in symptom control or side effects; plan to revert when Concerta returns if desired','SPS and MHRA DSU 2022 counselling points.','good','end'),
  C('Tell her brands are identical so no monitoring is needed','MHRA advises patients to report changes after a switch.','bad')]},
 end:{end:true, text:'Leo receives a bioequivalent brand without a treatment gap.', summary:'Key learning: know bioequivalence groups (tablets ≈ Concerta; capsules group; Equasym XL stands alone) and CD legal limits.'}}},

misuse:{title:'Tom, 20 — possible diversion concern', img:'images/case-misuse.jpg', alt:'Illustration of a student being asked for a pill by a friend', source:'Required scenario',
 summary:'University student on dexamfetamine IR 10 mg TDS. Requesting his prescription 8 days early "because I lost a strip"; second early request this term.', start:'a', nodes:{
 a:{text:'He mentions friends "use these for exams".', ask:'Best response?', choices:[
  C('Non-judgemental conversation about the lost supply and pressures to share; explain risks and legality of supplying others; inform the prescriber/specialist of the pattern and document','NG87 1.7.23 and 1.8.19: monitor for misuse/diversion as circumstances change; pharmacists play a key role. Escalate concerns via the CD accountable officer if needed.','good','b'),
  C('Supply early without comment','Ignores a red flag.','bad'),
  C('Refuse and report him to the police immediately','Disproportionate first step; follow governance processes and involve the prescriber.','bad')]},
 b:{text:'The specialist reviews and agrees a change.', ask:'Which change best reduces diversion risk?', choices:[
  C('Switch to a once-daily long-acting product less easily misused (e.g. lisdexamfetamine), with shorter supply intervals and pharmacy collection','NG87 1.7.24: do not offer IR stimulants or MR stimulants that can be easily injected or insufflated if there is a risk of misuse or diversion.','good','end'),
  C('Increase IR quantity to cover "losses"','Increases diversion risk.','bad')]},
 end:{end:true, text:'Tom moves to a lower-risk formulation with closer supply monitoring.', summary:'Key learning: early requests, "lost" medication and peer pressure are diversion red flags; prefer prodrug/MR formulations.'}}},

adultnew:{title:'Rhian, 34 — "I think I have ADHD" (primary care, Wales)', img:'images/m1-adult-work.jpg', alt:'Illustration of an overwhelmed adult at a desk', source:'Required scenario (adult)',
 summary:'Rhian asks you, a pharmacist IP in a GP practice in Cardiff, to "start Elvanse" after an online self-test. Lifelong disorganisation, school reports of daydreaming, job losses.', start:'a', nodes:{
 a:{text:'ASRS screener score is high. Mood is low.', ask:'Your action?', choices:[
  C('Explain that diagnosis needs a specialist assessment; screen for mood, anxiety, substance use and sleep; refer to the local adult ADHD service where childhood-onset, persistent symptoms cause at least moderate impairment','NG87 section 1.2 (referral) and 1.3.1; medication only started by a specialist (section 1.7). A screener is not a diagnosis.','good','b'),
  C('Prescribe lisdexamfetamine 30 mg as a "therapeutic trial"','Not permitted under NICE; a stimulant response is not diagnostic.','bad'),
  C('Tell her adult ADHD is over-diagnosed and decline referral','Unbalanced; referral criteria apply.','bad')]},
 b:{text:'She asks about waiting times and private "right to choose" providers.', ask:'Balanced advice?', choices:[
  C('Explain waits vary and demand has risen; private diagnoses may require local review before NHS shared care; offer interim support (sleep, mood, workplace adjustments) and safety-netting','Balanced and accurate; local shared-care acceptance policies differ (in Wales, Right to Choose as in England does not apply).','good','end'),
  C('Guarantee the NHS will continue any private prescription','Not guaranteed — depends on local shared care agreements.','bad')]},
 end:{end:true, text:'Rhian is appropriately referred with interim support.', summary:'Key learning: primary care recognises and refers; diagnosis and initiation are specialist roles.'}}}
};
