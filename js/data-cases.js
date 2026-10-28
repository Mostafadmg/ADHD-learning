/* Module 10: twelve branching cases, rendered by the case engine in js/app.js ("branching cases") and shown one at a
   time by js/m10-cases.js. Each node has text, an ask and choices; each choice has text t, feedback fb (HTML, ending
   in a source chip), grade good|ok|bad and, for good choices, the next node. Best choices move the case on.
   All cases are fictional. Clinical content checked Oct 2026 against NICE NG87 (live text), UK SmPCs on emc (Equasym XL,
   Medikinet XL, Concerta XL, Meflynate XL, Elvanse, Amfexa, atomoxetine, Adaflex), SPS "Prescribing and switching
   between modified-release methylphenidate" (updated 28 Aug 2025), MHRA Drug Safety Update (Sept 2022), the Human
   Medicines Regulations 2012 and Misuse of Drugs Regulations 2001. Statements without a published source are labelled
   "Clinical practice". */
(function(){
function C(t, g, fb, src, next){ return {t:t, grade:g, fb:fb + (src ? ' <span class="cs-src">'+src+'</span>' : ''), next:next}; }
var NG = 'NICE NG87';

window.CASES = {

/* ---------- Lesson 2: children ---------- */
ethan:{title:'Ethan, 12: Equasym XL wears off before homework', img:'images/case-child.jpg', alt:'Illustration of a tired boy doing homework at a kitchen table', source:'Focus: wear-off and top-up doses',
 summary:'Equasym XL 30 mg at 07:30. School reports are good, but by about 15:30 he is restless and cannot settle to homework (17:00 to 19:00).', start:'a', nodes:{
 a:{text:'Equasym XL capsules are 30% immediate release and 70% modified release and work for about 8 hours (SPS), so a 07:30 dose fades at about 15:30. His pulse, blood pressure, appetite and sleep are fine, and he swallows tablets easily. You are the pharmacist independent prescriber in his CAMHS ADHD team.', ask:'What do you suggest?', choices:[
  C('Switch to a once-daily 22:78 tablet that lasts about 12 hours (Concerta XL or a brand in its bioequivalent group), then review the dose', 'good',
    'One morning dose now covers school and homework, with no extra dose to remember or store; NICE lists these benefits of once-daily products (1.7.20). The Equasym XL SmPC also says Equasym XL should not continue if an extra late IR dose is needed, unless the same extra dose was needed on IR alone. This is not a like-for-like swap: no product is bioequivalent to Equasym XL (SPS), so set the dose, prescribe by brand and review. A late IR top-up is a reasonable alternative; a lunchtime dose or a bigger dose does not close the gap.',
    NG+' 1.7.20 · Equasym XL SmPC 4.2 · SPS (2025)', 'b'),
  C('Keep Equasym XL and add a small dose of IR methylphenidate after school', 'ok',
    'Reasonable: NICE suggests MR methylphenidate in the morning plus IR later in the day to extend the effect (1.7.22), and it suits children who cannot swallow tablets (Equasym XL can be opened; Concerta XL must be swallowed whole). But it adds a second product and dose, can push back sleep, and the Equasym XL SmPC says this combination should not continue unless the same extra dose was needed on IR alone. Ethan swallows tablets, so one 12-hour product is the neater fix.',
    NG+' 1.7.22 · Equasym XL SmPC 4.2 · Concerta XL SmPC 4.2'),
  C('Give the Equasym XL dose at lunchtime instead', 'bad',
    'This moves the gap instead of closing it: mornings at school would be uncovered. The SmPC says Equasym XL is taken in the morning before breakfast, and not too late, because late doses disturb sleep.',
    'Equasym XL SmPC 4.2'),
  C('Increase Equasym XL to 60 mg each morning', 'bad',
    'The problem is how long it lasts, not how strong it is. A higher dose of the same 8-hour product mainly raises the peak, with more appetite loss and a faster pulse, without reliably adding hours (clinical practice). 60 mg a day is also the licensed maximum.',
    'Equasym XL SmPC 4.2 · Clinical practice')]},
 b:{text:'You switch Ethan to Concerta XL 36 mg each morning. It replaces 30 mg a day of IR methylphenidate (10 mg three times a day), the same daily amount as Equasym XL 30 mg. Two weeks later homework is much better, but he falls asleep 30 to 45 minutes later than before and eats little at lunch.', ask:'What do you advise?', choices:[
  C('Check he takes it on waking, keep a sleep diary for 2 weeks, firm up the bedtime routine, and plan a good breakfast and a later snack; then review', 'good',
    'NICE asks you to monitor sleep, for example with a diary, and adjust medication accordingly (1.8.17), and to manage appetite with food with or after the dose and extra snacks when the effect has worn off (1.8.6). A small delay in sleep often settles in the first weeks (clinical practice), and the diary tells you whether it has. Melatonin or a dose change can follow if it does not.',
    NG+' 1.8.6, 1.8.17'),
  C('Ask the specialist to start melatonin now', 'ok',
    'Melatonin is prescription-only in the UK. One product (Adaflex) is licensed for insomnia in 6 to 17-year-olds with ADHD, but only where sleep hygiene measures have not been enough, and it is started by a clinician experienced in ADHD or paediatric sleep. Check timing, routine and a sleep diary first.',
    'Adaflex SmPC 4.1–4.2 · '+NG+' 1.8.17'),
  C('Switch back to Equasym XL', 'bad',
    'This throws away the change that fixed the main problem before trying the simple measures. Judge the sleep change with a diary first.',
    NG+' 1.8.17')]},
 end:{end:true, text:'Ethan now has one morning tablet that covers school and homework, and his sleep and appetite are being tracked.', summary:'Key learning: when cover ends too early, change the shape of the day (a longer product) or add a later IR top-up of methylphenidate (NG87 1.7.22), not a bigger dose. Read the SmPC for the product in use, and track sleep with a diary (1.8.17).'}}},

mia:{title:'Mia, 10: angry outbursts as each dose wears off', img:'images/case-mia.jpg', alt:'Illustration of a 10-year-old girl, arms folded and irritable after school, with her mother kneeling calmly beside her', source:'Focus: rebound and IR to MR conversion',
 summary:'Immediate-release (IR) methylphenidate 10 mg at breakfast and 10 mg at lunchtime. School is going well, but most days she has angry, tearful outbursts after school.', start:'a', nodes:{
 a:{text:'Her parents keep a diary for a week. The outbursts start at about 16:00, roughly 4 hours after the lunchtime dose, as its effect fades. They do not happen in the hour or two after a dose. Her appetite, sleep, pulse and blood pressure are fine.', ask:'What is the best next step?', choices:[
  C('Convert to a once-daily MR capsule at the same total daily dose: Medikinet XL 20 mg or Equasym XL 20 mg each morning', 'good',
    'Both SmPCs say 20 mg is intended to replace 10 mg IR at breakfast plus 10 mg at lunchtime. The timing points to rebound as the level falls, and an MR product gives a smoother fall (clinical practice). NICE also favours once-daily products: no dose at school, better adherence and no controlled drug stored at school (1.7.20). A third IR dose is a reasonable alternative; a bigger dose or stopping is not.',
    'Medikinet XL and Equasym XL SmPCs 4.2 · '+NG+' 1.7.20'),
  C('Add a third IR dose at about 15:30 to cover the after-school dip', 'ok',
    'Reasonable: IR three times a day is a common regimen. But it adds another dose to remember, can move the dip later into the evening, and may delay sleep. A smoother once-daily product treats the cause with fewer doses.',
    NG+' 1.7.20 · Clinical practice'),
  C('Increase each IR dose to 15 mg', 'bad',
    'A higher dose gives a higher peak and a steeper fall, which can make rebound worse. If the irritability came at the peak, 1 to 2 hours after a dose, that would point to reducing the dose, not raising it (clinical practice).',
    'Clinical practice'),
  C('Stop methylphenidate because it causes emotional side effects', 'bad',
    'Rebound is a timing and formulation problem in a child who is otherwise doing well. NICE asks you to adjust the medicine when behaviour changes (1.8.18), not to abandon a treatment that works.',
    NG+' 1.8.18')]},
 b:{text:'Mia’s parents choose Medikinet XL 20 mg each morning. She cannot swallow capsules.', ask:'Which counselling is right?', choices:[
  C('Take it with or after breakfast. The capsule can be opened and the pellets sprinkled on a tablespoon of apple sauce or yoghurt, swallowed straight away without chewing, then a drink', 'good',
    'This is the Medikinet XL SmPC advice. Food matters: on an empty stomach it is absorbed much faster, so the effect may not last and peaks are higher. The pellets must not be crushed or chewed, because that destroys the slow-release part. Check that breakfast is actually eaten.',
    'Medikinet XL SmPC 4.2, 5.2'),
  C('Take it on an empty stomach for the best absorption', 'bad',
    'Wrong way round for this product. Without food Medikinet XL is absorbed much faster, giving a higher peak and a shorter effect; the SmPC warns of a risk of dose dumping. Take it with or after breakfast.',
    'Medikinet XL SmPC 4.2, 5.2'),
  C('Crush the pellets and stir them into a drink', 'bad',
    'The pellets must not be crushed or chewed: crushing releases the whole dose at once, losing the long action and raising the peak. Sprinkle them whole on soft food instead.',
    'Medikinet XL SmPC 4.2')]},
 end:{end:true, text:'Mia takes one capsule with breakfast, and the after-school outbursts settle.', summary:'Key learning: use timing to find the cause (as the dose wears off: rebound; at the peak: dose too high). IR twice daily converts to the same total dose of a once-daily MR product; know each brand’s food and administration rules.'}}},

liam12:{title:'Liam, 12: dexamfetamine wears off and he dreads the school dose', img:'images/case-liam12.jpg', alt:'Illustration of a reluctant 12-year-old boy with a staff member in a school office at lunchtime', source:'Focus: amfetamines, duration and swallowing',
 summary:'A 6-week trial of methylphenidate at an adequate dose did not help enough, so his previous team started dexamfetamine IR (Amfexa) 5 mg at breakfast and lunchtime. It works, but each dose lasts about 4 hours, he is irritable as it wears off, and he hates taking the lunchtime tablet in the school office.', start:'a', nodes:{
 a:{text:'Teachers see clearly better focus in the mornings, so he responds to the amfetamine. The school keeps his lunchtime tablet locked away and records each dose. His mother asks for a once-a-day option, and says he struggles to swallow tablets and capsules.', ask:'What do you suggest to the specialist?', choices:[
  C('A trial of lisdexamfetamine (Elvanse) once each morning, starting at 20 or 30 mg and titrated weekly', 'good',
    'He responds to amfetamine, and lisdexamfetamine is turned into dexamfetamine in the blood, so one morning capsule works for up to about 13 hours in children. That removes the school dose and smooths the wear-off. The capsule can be opened and mixed with yoghurt, water or orange juice, which solves swallowing. It is also NICE’s next step after methylphenidate (1.7.8).',
    NG+' 1.7.8, 1.7.20 · Elvanse SmPC 4.2, 5.1'),
  C('Break the tablets to make them easier to swallow', 'ok',
    'Partly helpful: Amfexa tablets can be broken into four to help swallowing (the score lines are not for dividing doses). But it leaves the short effect, the rebound and the school dose untouched.',
    'Amfexa SmPC 4.2'),
  C('Increase Amfexa to 10 mg three times a day', 'bad',
    'More tablets and a higher total, but each dose still lasts only a few hours, so the dips, the rebound and the school dose remain. A third dose late in the day also risks sleep; the SmPC says doses should not be taken too late after lunchtime.',
    'Amfexa SmPC 4.2'),
  C('Switch to atomoxetine', 'bad',
    'He responds to and tolerates amfetamine. NICE keeps atomoxetine or guanfacine for children who cannot tolerate methylphenidate or lisdexamfetamine, or whose symptoms have not responded to both (1.7.10).',
    NG+' 1.7.10')]},
 b:{text:'Liam starts Elvanse 30 mg each morning. His mother asks how to give it, and whether to keep a dexamfetamine tablet for lunchtime “just in case”.', ask:'What do you advise?', choices:[
  C('Open the capsule, mix all the contents with yoghurt, water or orange juice, and take it all straight away each morning; no afternoon doses; stop the Amfexa as the specialist plan says', 'good',
    'This is the Elvanse SmPC method: take the whole mixture at once, never part of a capsule, and avoid afternoon doses because of insomnia. Lisdexamfetamine delivers the same active drug as Amfexa, so the plan normally replaces the dexamfetamine rather than adding to it; the Amfexa SmPC’s gradual reduction applies when dexamfetamine is stopped altogether (clinical practice). Agree what to do with leftover tablets, which are a controlled drug.',
    'Elvanse SmPC 4.2 · Amfexa SmPC 4.2 · Clinical practice'),
  C('Mix the capsule contents and save half for after school', 'bad',
    'The SmPC says the mixture is taken straight away, not stored, and a capsule should not be divided. A split dose would also give an afternoon dose, which disturbs sleep.',
    'Elvanse SmPC 4.2'),
  C('Keep the lunchtime Amfexa as well, every day', 'bad',
    'Routinely adding dexamfetamine doubles up the same drug and brings back the school dose. NICE’s MR-plus-IR top-up (1.7.22) is written for methylphenidate; any amfetamine top-up would be an off-label specialist decision, reviewed against sleep and blood pressure.',
    NG+' 1.7.22 · Clinical practice')]},
 end:{end:true, text:'Liam takes one capsule at breakfast, with no school dose and calmer afternoons.', summary:'Key learning: if someone responds to an amfetamine but a short-acting tablet does not fit their day, lisdexamfetamine gives the same drug once daily, and its capsule can be opened and mixed for people who cannot swallow.'}}},

/* ---------- Lesson 3: teenagers and young adults ---------- */
noah:{title:'Noah, 15: Concerta XL is slow to start before first lesson', img:'images/case-teen.jpg', alt:'Illustration of a teenager yawning at a classroom door', source:'Focus: slow onset and IR:MR ratios',
 summary:'Concerta XL 36 mg. Afternoons and homework are well covered, but the first lesson at 08:50 is a struggle.', start:'a', nodes:{
 a:{text:'Concerta XL releases 22% of the dose straight away and the rest through the day. Blood levels reach a first peak at about 1 to 2 hours (SmPC 5.2), and the effect lasts about 12 hours. Noah takes his tablet at 08:15 as he leaves for school.', ask:'What is the simplest first step?', choices:[
  C('Take it as soon as he wakes, at about 07:00, so it is working by first lesson', 'good',
    'With a first peak at 1 to 2 hours, an 08:15 dose has barely started by 08:50. Moving it to 07:00 costs nothing, keeps the same product and dose, and only moves the end of the effect earlier in the evening (clinical practice). Try the simplest change first, then review.',
    'Concerta XL SmPC 5.2 · Clinical practice'),
  C('Switch to a 50:50 capsule (Medikinet XL or the Ritalin XL group) for a bigger early effect', 'ok',
    'A 50:50 capsule does give a stronger start, but it lasts about 8 hours, so homework may lose cover, and Medikinet XL must be taken with or after food. Worth discussing if earlier dosing fails, not as the first step.',
    'Medikinet XL SmPC 4.2 · SPS (2025)'),
  C('Increase to Concerta XL 72 mg', 'bad',
    'The problem is when it starts, not how strong it is. 72 mg a day is the adult maximum; for children and young people the Concerta XL SmPC maximum is 54 mg a day. A higher dose raises levels all day, and the side effects with them.',
    'Concerta XL SmPC 4.2')]},
 b:{text:'Taking it at 07:00 helps, but the first lesson is still hard on some days. Afternoons and homework remain well covered.', ask:'What could you discuss with the specialist next?', choices:[
  C('Ways to strengthen only the start: a small IR methylphenidate dose on waking with the Concerta XL, or a product with a bigger immediate part plus later cover; then review with teacher ratings', 'good',
    'Both target the real gap, the first 1 to 2 hours, while protecting the afternoon. NICE expects prescribers to know each product’s profile and tailor it to the person (1.7.3), and to record symptoms and side effects on rating scales at each change (1.7.26). An IR dose in the morning to speed the start is a specialist, clinical-practice use: NICE’s own wording (1.7.22) describes IR later in the day to extend the effect.',
    NG+' 1.7.3, 1.7.22, 1.7.26 · Clinical practice'),
  C('Increase to Concerta XL 54 mg', 'ok',
    'This does raise the immediate part (22% of 54 mg is about 12 mg, against about 8 mg from 36 mg), so mornings may improve, and 54 mg is within the licence. But it raises levels all day, including the afternoon, which is already well covered. Reasonable if the whole day is under-treated; less targeted here.',
    'Concerta XL SmPC 4.2'),
  C('Stop the medicine on school days', 'bad',
    'School is where he needs it most. The gap is the first lesson, not the whole day.',
    'Clinical practice')]},
 end:{end:true, text:'Noah takes Concerta XL on waking; first lessons are better, and changes are reviewed with ratings.', summary:'Key learning: match the release profile to when symptoms matter. A slow start is usually timing first, then the immediate-release share, not a bigger dose.'}}},

anxiety:{title:'Zara, 16: ADHD and an anxiety disorder', img:'images/case-anxiety.jpg', alt:'Illustration of an anxious teenager on a sofa with a parent', source:'Focus: coexisting anxiety and interactions',
 summary:'Newly diagnosed ADHD (combined presentation) with generalised anxiety. Her mother worries a stimulant will “make the anxiety worse”.', start:'a', nodes:{
 a:{text:'Changes at school are in place and have been reviewed, but she is still significantly impaired. She has started CBT for anxiety. The specialist is planning medication and asks you to explain NICE’s position to the family.', ask:'What does NICE say?', choices:[
  C('Offer the same ADHD medicine choices as anyone else, but titrate more slowly and monitor more often', 'good',
    'NICE gives people with ADHD and an anxiety disorder the same medication choices (1.7.18), with slower titration and closer monitoring (1.7.28). Methylphenidate SmPCs (for example Concerta XL) list anxiety as a warning, not a contraindication: assess it before starting and watch for it getting worse. Some people find their anxiety eases once ADHD symptoms are treated (clinical practice).',
    NG+' 1.7.18, 1.7.28 · Concerta XL SmPC 4.4'),
  C('Stimulants are contraindicated in anxiety, so start atomoxetine', 'bad',
    'Not true. Anxiety is not among the methylphenidate contraindications (it is a section 4.4 warning), and NICE does not skip the stimulants because of anxiety. Atomoxetine comes later for children and young people (1.7.10).',
    NG+' 1.7.10, 1.7.18 · Concerta XL SmPC 4.3–4.4'),
  C('Treat the anxiety with an SSRI first and avoid stimulants for good', 'bad',
    'NICE does not ask you to treat anxiety first or to rule out stimulants. Both conditions are treated, in a plan agreed with Zara and her family, with slower titration (1.7.28).',
    NG+' 1.7.18, 1.7.28')]},
 b:{text:'On methylphenidate MR her focus improves; her anxiety is unchanged. Months later her CAMHS psychiatrist adds fluoxetine for the anxiety, alongside CBT. You are checking the new prescription.', ask:'What do you flag?', choices:[
  C('Counsel on the rare risk of serotonin syndrome and its signs; note that methylphenidate may raise SSRI levels; and record that fluoxetine would greatly raise atomoxetine levels if she were ever switched', 'good',
    'The Concerta XL SmPC reports serotonin syndrome when methylphenidate is given with serotonergic drugs: whatever her brand, recognise it promptly (agitation, fever, sweating, tremor, twitching) and stop methylphenidate as soon as possible if it is suspected. Methylphenidate may also slow the breakdown of SSRIs, so their dose may need adjusting. Fluoxetine is a strong CYP2D6 inhibitor: with atomoxetine, exposure rises 6 to 8-fold, so titrate more slowly and expect a lower final dose.',
    'Concerta XL SmPC 4.4–4.5 · Atomoxetine SmPC 4.5'),
  C('This combination is contraindicated: refuse to supply', 'bad',
    'It is not contraindicated. It needs counselling and monitoring, which is where a pharmacist adds most. The contraindicated combination is a stimulant or atomoxetine with an MAOI, or within 14 days of stopping one.',
    'SmPCs 4.3, 4.5'),
  C('No action: SSRIs and stimulants do not interact', 'bad',
    'The Concerta XL SmPC describes both a serotonin syndrome warning and a possible rise in SSRI levels with methylphenidate. Saying nothing misses a safety-netting conversation.',
    'Concerta XL SmPC 4.4–4.5')]},
 end:{end:true, text:'Zara gets the usual choices with slower titration, and the family knows the warning signs.', summary:'Key learning: anxiety does not rule out stimulants (NG87 1.7.18); titrate more slowly (1.7.28). Know the serotonergic warning for methylphenidate and the CYP2D6 interaction for atomoxetine.'}}},

emma:{title:'Emma, 19: Elvanse helps, but no sleep and weight loss', img:'images/case-student.jpg', alt:'Illustration of a student in a lecture hall wearing headphones', source:'Focus: side effects and dose timing',
 summary:'ADHD (combined presentation), at university. Elvanse was increased from 30 mg to 50 mg: better focus and grades, but she is awake until 3 am, has lost 4 kg in 2 months and feels more socially anxious.', start:'a', nodes:{
 a:{text:'BP 124/78, pulse 92. On lecture days she takes the capsule at about 11:00, when she gets up. She values the benefit and wants to stay on it.', ask:'What is the best adjustment?', choices:[
  C('Take it early each morning (for example 07:30), reduce to 40 mg and review; add food strategies and keep an eye on the anxiety', 'good',
    'An 11:00 dose of a medicine that works for up to about 14 hours in adults is still working at 1 am. The Elvanse SmPC says take it in the morning and avoid afternoon doses because of insomnia. NICE titrates to the dose that balances benefit and side effects (1.7.27); 40 mg sits between the 30 mg she tolerated and 50 mg. For weight: food with or after the dose, and extra meals when it wears off (1.8.6).',
    'Elvanse SmPC 4.2, 5.1 · '+NG+' 1.7.27, 1.8.6'),
  C('Switch to dexamfetamine IR', 'ok',
    'NICE allows dexamfetamine when someone responds to lisdexamfetamine but cannot tolerate its long effect (1.7.14; off-label in adults). But fix the timing first: the long effect is only a problem because she takes it at 11:00. IR dexamfetamine also carries the most misuse and diversion risk, which matters in student housing (1.7.23–1.7.24).',
    NG+' 1.7.14, 1.7.23–1.7.24'),
  C('Stop Elvanse and start atomoxetine', 'bad',
    'She is responding; her problems are timing and dose, which can be fixed. In adults, atomoxetine comes after lisdexamfetamine and methylphenidate have not worked or are not tolerated (1.7.15).',
    NG+' 1.7.15')]},
 b:{text:'On 40 mg at 07:30 she is asleep by midnight and her weight has stabilised. The social anxiety is still there.', ask:'What next?', choices:[
  C('Ask the specialist team to assess the anxiety: is it the medicine, a separate anxiety disorder, or both? Offer psychological support; any medicine change goes slowly with closer monitoring', 'good',
    'Anxiety is a common side effect of lisdexamfetamine in adults (Elvanse SmPC 4.8), but it can also be a separate condition. NICE gives people with anxiety the same ADHD choices (1.7.18) with slower titration and more monitoring (1.7.28). Assess it rather than guess.',
    'Elvanse SmPC 4.8 · '+NG+' 1.7.18, 1.7.28'),
  C('Suggest she buys propranolol from the pharmacy', 'bad',
    'Propranolol is prescription-only, and treating an unexplained anxiety problem without assessment skips the key question: is it the medicine, or a condition of its own?',
    'Clinical practice'),
  C('Stop Elvanse until the anxiety settles', 'bad',
    'This loses a clear benefit, and the anxiety may not be caused by the medicine at all. Assess first.',
    'Clinical practice')]},
 end:{end:true, text:'Emma keeps the benefit with an earlier, lower dose, and her anxiety is being assessed.', summary:'Key learning: optimise timing and dose before switching. A late dose of a long-acting stimulant is a common cause of insomnia, and anxiety does not rule out stimulants.'}}},

/* ---------- Lesson 4: adults ---------- */
sophia:{title:'Sophia, 30: no appetite by day, snacking and awake at night', img:'images/case-adult.jpg', alt:'Illustration of a woman snacking late at night in her kitchen', source:'Focus: appetite, sleep and weight',
 summary:'Meflynate XL 30 mg, a 50:50 methylphenidate capsule. No appetite all day, big snacks late at night, and she cannot fall asleep before 1 am.', start:'a', nodes:{
 a:{text:'Meflynate XL lasts about 8 hours (SPS). On workdays she takes it at 07:00; on days off she takes it whenever she gets up, often 12:00 to 13:00. She skips breakfast.', ask:'What is the most useful first step?', choices:[
  C('Take it at the same early time every day, with or after breakfast, plan a proper evening meal for when it wears off, and keep a sleep diary', 'good',
    'A 13:00 dose of an 8-hour product works until about 21:00, close to bedtime. The Meflynate XL SmPC says it should not be taken too late in the morning, to avoid sleep problems. NICE’s weight strategies are food with or after the dose and extra meals when the effect has worn off (1.8.6), with a sleep diary to guide changes (1.8.17).',
    'Meflynate XL SmPC 4.2 · '+NG+' 1.8.6, 1.8.17'),
  C('Add zopiclone at night', 'bad',
    'A hypnotic treats the symptom and adds dependence and next-day risks, while the cause is dose timing. Fix the timing and routine first.',
    NG+' 1.8.17 · Clinical practice'),
  C('Switch to lisdexamfetamine', 'bad',
    'Lisdexamfetamine works for up to about 14 hours in adults, so with irregular late doses it is more likely to worsen sleep. Switching also loses a medicine that works.',
    'Elvanse SmPC 5.1')]},
 b:{text:'With a fixed 07:30 dose and breakfast, she now falls asleep by 23:30. But she has lost 3 kg in 3 months.', ask:'What monitoring and action apply?', choices:[
  C('Keep monitoring weight (NICE: every 6 months in adults; more often while it is falling), consider BMI, continue the food plan with dietary advice, and consider a medicine change if the loss persists', 'good',
    'NICE: weigh adults every 6 months (1.8.5); if treatment changes weight, consider BMI monitoring and changing the medicine if the change persists (1.8.8). Strategies include food with or after the dose, extra meals or snacks when it wears off, dietary advice and high-calorie food of good nutritional value (1.8.6). Checking more often while weight is falling is clinical judgement.',
    NG+' 1.8.5, 1.8.6, 1.8.8'),
  C('Adults do not need weight monitoring', 'bad',
    'They do: NICE asks for weight every 6 months in adults taking ADHD medication (1.8.5), and BMI monitoring when treatment changes weight (1.8.8).',
    NG+' 1.8.5, 1.8.8')]},
 end:{end:true, text:'A regular morning dose and planned meals have fixed Sophia’s sleep; her weight is being watched.', summary:'Key learning: many sleep and appetite problems are timing problems. Fix the schedule and meals before adding drugs; weigh adults every 6 months and act on persistent change (NG87 1.8.5–1.8.8).'}}},

david:{title:'David, 21: autism, and three stimulants not tolerated', img:'images/m9-counselling.jpg', alt:'Illustration of a pharmacist counselling a young man', source:'Focus: switching to a non-stimulant',
 summary:'ADHD and autism. Methylphenidate (Concerta XL, then Medikinet XL): appetite and weight loss, anxiety. Lisdexamfetamine: insomnia and sensory overload. Dexamfetamine: big mood swings. He is reluctant to try another stimulant but is still struggling at work.', start:'a', nodes:{
 a:{text:'Each trial was at an adequate dose, titrated slowly because of his autism. He asks what is left.', ask:'What is the most appropriate next step?', choices:[
  C('Offer atomoxetine, titrated slowly with closer monitoring, after explaining how it differs', 'good',
    'NICE offers atomoxetine to adults who cannot tolerate lisdexamfetamine or methylphenidate (1.7.15), and autism means slower titration and more monitoring (1.7.28). It is not a controlled drug and works differently. Counsel that the effect builds over weeks, not days (clinical practice), and on the SmPC warnings: suicidal thoughts, liver injury (stop and do not restart if jaundice appears), raised pulse and blood pressure, and sexual side effects.',
    NG+' 1.7.15, 1.7.28 · Atomoxetine SmPC 4.4, 4.8'),
  C('Retry methylphenidate at a lower dose', 'bad',
    'He has had adequate, slowly titrated trials of two methylphenidate products and does not want another stimulant now. Shared decisions respect that (1.5.4–1.5.6); a cautious retry can be revisited later if he wishes.',
    NG+' 1.5.4–1.5.6, 1.7.15'),
  C('Add melatonin', 'bad',
    'This treats one side effect of one past medicine. It does not give him a treatment for ADHD.',
    'Clinical practice'),
  C('Stop all medicine and rely on psychological support alone', 'bad',
    'He wants treatment and is still impaired. NICE offers non-drug treatment when medicine is declined, not tolerated or not working (1.5.16), and alongside medicine when impairment remains (1.5.17), but a medicine option is still open.',
    NG+' 1.5.16–1.5.17')]},
 b:{text:'He takes atomoxetine 40 mg daily for 7 days, then 80 mg. At week 3 he feels sick after the morning dose and says it “isn’t working”.', ask:'What do you advise?', choices:[
  C('Take it with food or split it into two doses (morning and late afternoon), explain the effect builds over several weeks, and review at an adequate dose before judging it', 'good',
    'The SmPC says atomoxetine can be taken with or without food, and that people with nausea or a poor response on one daily dose may do better on two evenly divided doses, in the morning and late afternoon or early evening. Taking it with food to ease nausea, and judging it over weeks rather than days, are clinical practice. If a stimulant and a non-stimulant both fail, NICE says get a second opinion or refer to a tertiary service (1.7.16); guanfacine in adults only with tertiary advice (1.7.17).',
    'Atomoxetine SmPC 4.2 · '+NG+' 1.7.16–1.7.17'),
  C('Stop it: it should have worked within days', 'bad',
    'That is how stimulants behave. Atomoxetine’s effect builds gradually (clinical practice), so stopping at week 3 wastes the trial.',
    'Clinical practice')]},
 end:{end:true, text:'David stays on atomoxetine with split doses and a planned review.', summary:'Key learning: the adult NICE sequence ends with atomoxetine (1.7.15); after a stimulant and a non-stimulant have failed, get a second opinion (1.7.16). Autism means slower titration, not fewer options.'}}},

bp:{title:'Karim, 44: blood pressure up at the shared care review', img:'images/case-bp.jpg', alt:'Illustration of a pharmacist measuring a man’s blood pressure', source:'Focus: blood pressure under shared care',
 summary:'Stable on lisdexamfetamine (Elvanse) 50 mg for 8 months under shared care. You are the pharmacist independent prescriber running his 6-monthly review in the GP practice.', start:'a', nodes:{
 a:{text:'Clinic BP 152/96, pulse 98. Before treatment: 128/80, pulse 76. No chest pain, palpitations, breathlessness or fainting.', ask:'What do you do first?', choices:[
  C('Repeat it properly (seated, rested, right cuff size), arrange home or ambulatory readings, and ask about caffeine, energy drinks, alcohol, decongestants and dose timing', 'good',
    'NICE acts on readings confirmed on 2 occasions (1.8.11), and the adult hypertension guideline confirms a raised clinic reading with ambulatory or home monitoring. Look for things that raise BP, such as pseudoephedrine cold remedies, caffeine and stress. Act on confirmed results, but do not ignore this one.',
    NG+' 1.8.9, 1.8.11 · NICE NG136'),
  C('Stop Elvanse today', 'bad',
    'One reading without symptoms is not a reason to stop. Confirm it first. Chest pain, fainting on exertion or fast palpitations would change that: they need same-day medical assessment (clinical practice).',
    NG+' 1.8.11 · Clinical practice'),
  C('Accept it: stimulants always raise BP a little', 'bad',
    'The average rise is small (about 2 to 4 mmHg in the Elvanse SmPC), but some people have much larger rises. A rise of 24/16 mmHg from baseline is clinically significant and must be confirmed.',
    'Elvanse SmPC 4.4')]},
 b:{text:'Home readings over a week average 148/94, and his resting pulse is 96. A clinically significant, sustained rise is confirmed.', ask:'What does NICE advise?', choices:[
  C('Reduce the dose and refer him to an adult physician; tell the specialist team as the shared care protocol says; recheck BP and pulse after the change', 'good',
    'A clinically significant rise on 2 occasions means reduce the dose and refer to an adult physician (1.8.11). Shared care means the specialist hears about it, and BP and pulse are checked before and after every dose change (1.8.9). Note too that the Elvanse SmPC contraindicates moderate to severe hypertension.',
    NG+' 1.8.9, 1.8.11 · Elvanse SmPC 4.3'),
  C('Start amlodipine and carry on at the same dose without telling the specialist', 'bad',
    'NICE says reduce the dose and refer; adding a drug to treat the side effect skips that step. Shared care depends on telling the specialist about any significant change (1.7.29).',
    NG+' 1.7.29, 1.8.11')]},
 end:{end:true, text:'The dose is reduced, the physician referral is made, the specialist is informed, and BP is rechecked after the change.', summary:'Key learning: measure well, confirm on 2 occasions, then reduce the dose and refer (NG87 1.8.11). Check BP and pulse before and after every dose change (1.8.9).'}}},

/* ---------- Lesson 5: safety, supply and your role ---------- */
shortage:{title:'Leo, 11: Concerta XL is out of stock', img:'images/case-shortage.jpg', alt:'Illustration of a worried parent at a pharmacy counter', source:'Focus: shortages, bioequivalence and CD law',
 summary:'You are the community pharmacist. Leo’s mother brings a prescription for Concerta XL 36 mg, 30 tablets. Your wholesaler cannot supply it, and Leo has 2 days’ tablets left.', start:'a', nodes:{
 a:{text:'SPS lists these 22:78 tablets as bioequivalent to one another: Concerta XL, Affenid XL, Atenza XL, Delmosart, Matoride XL, Xaggitin XL and Xenidate XL. You check other suppliers: Xaggitin XL 36 mg is available today.', ask:'What do you do?', choices:[
  C('Contact the prescriber for a new prescription for Xaggitin XL 36 mg (same dose, same quantity), and counsel the family', 'good',
    'Methylphenidate is a Schedule 2 controlled drug, and you must supply what is prescribed: a different brand needs a new prescription. SPS says products in this tablet group can be swapped at the same dose and quantity, with counselling, and the person should go back to the usual brand as soon as supply allows. Naming the brand keeps supply consistent (MHRA, 2022). Supplying another product, or an emergency supply, is not allowed.',
    'SPS (updated 28 Aug 2025) · MHRA Drug Safety Update (Sept 2022) · Human Medicines Regulations 2012'),
  C('Hand back the prescription and suggest the family tries other pharmacies', 'ok',
    'Sometimes unavoidable, but it pushes the problem onto a parent with 2 days left. Checking other suppliers and the SPS Medicines Supply Tool, then contacting the prescriber yourself, is safer care.',
    'SPS Medicines Supply Tool · Clinical practice'),
  C('Supply Equasym XL 30 mg instead: close enough', 'bad',
    'Equasym XL is a 30:70 capsule that lasts about 8 hours. SPS says no other product is bioequivalent to it and it should not be switched. And you cannot supply a different product against this prescription anyway.',
    'SPS (2025)'),
  C('Make an emergency supply of a few tablets', 'bad',
    'Emergency supply is not allowed for Schedule 2 controlled drugs such as methylphenidate. The answer is a new prescription.',
    'Human Medicines Regulations 2012 (emergency supply)')]},
 b:{text:'The GP issues Xaggitin XL 36 mg. Leo’s mother is worried that “the new one won’t work”.', ask:'How do you counsel her?', choices:[
  C('It is in the same bioequivalent group at the same dose and is taken the same way (once each morning, swallowed whole); tell us about any change in effect, wear-off time or side effects; the plan is to go back to Concerta XL when it is available', 'good',
    'These are the SPS counselling points: reassure that the products are in the same clinically equivalent group, explain any change in timing or food, ask people to report changes in symptoms or side effects, and go back to the usual brand as soon as possible.',
    'SPS (2025) · MHRA Drug Safety Update (Sept 2022)'),
  C('Tell her the brands are identical, so there is nothing to watch for', 'bad',
    'Bioequivalent does not mean identical for every person: the tablet looks different and a few people notice a change. SPS and the MHRA advise asking people to report any change after a switch.',
    'SPS (2025) · MHRA (2022)')]},
 end:{end:true, text:'Leo gets a bioequivalent brand with no gap in treatment.', summary:'Key learning: know the groups (22:78 tablets; 50:50 capsules, with extra care for Medikinet XL; Equasym XL stands alone). A Schedule 2 brand change needs a new prescription, and there is no emergency supply.'}}},

misuse:{title:'Tom, 20: a second early request', img:'images/case-misuse.jpg', alt:'Illustration of a student being asked for a pill by a friend', source:'Focus: misuse and diversion',
 summary:'University student on dexamfetamine IR 10 mg three times a day under shared care. He asks for his prescription 8 days early because he “lost a strip”. It is his second early request this term.', start:'a', nodes:{
 a:{text:'While you talk, he mentions that friends “use these for exams”. He seems uneasy.', ask:'What is the best response?', choices:[
  C('Have a calm, private conversation: what happened to the tablets, is anyone asking him for them, and how is he taking them himself? Explain the risks and that passing them on is a crime; tell the prescriber about the pattern and record it', 'good',
    'Repeated early requests and “lost” supplies are warning signs (clinical practice), and NICE asks clinicians to keep watching for misuse and diversion as circumstances change, such as starting university (1.8.19), and to be cautious where stimulants may be diverted for study (1.7.23). A non-judgemental talk gets the truth; the prescriber needs the pattern to review the plan. Supplying a controlled drug to others is an offence (Misuse of Drugs Act 1971). Wider concerns go through your organisation’s controlled drugs accountable officer (CDAO) process.',
    NG+' 1.7.23, 1.8.19 · Misuse of Drugs Act 1971'),
  C('Supply early without comment', 'bad',
    'This ignores two red flags, an early request and talk of friends using the drug, and may feed a diversion route.',
    NG+' 1.8.19'),
  C('Refuse, and call the police straight away', 'bad',
    'Disproportionate as a first step, and it ends the conversation that keeps him safe. Talk, involve the prescriber and use governance routes; police involvement follows clear evidence and agreed processes.',
    'Clinical practice')]},
 b:{text:'The specialist reviews Tom and agrees a change.', ask:'Which plan best lowers the risk?', choices:[
  C('A once-daily product that is harder to misuse, such as lisdexamfetamine, with shorter prescription intervals (for example weekly), one named pharmacy and a written agreement', 'good',
    'Where there is a risk of misuse or diversion, NICE says do not offer IR stimulants, or MR stimulants that can easily be injected or snorted (1.7.24). Lisdexamfetamine is a prodrug with lower misuse potential, but its SmPC still warns about misuse and diversion, so smaller, more frequent supplies limit what can be passed on.',
    NG+' 1.7.24 · Elvanse SmPC 4.4'),
  C('Switch to atomoxetine', 'ok',
    'Reasonable if the risk stays high: atomoxetine is not a controlled drug. But he responds to an amfetamine, and in adults NICE uses atomoxetine when the stimulants have not worked or are not tolerated (1.7.15). Try a lower-risk stimulant plan first.',
    NG+' 1.7.15, 1.7.23'),
  C('Increase the IR quantity to cover future losses', 'bad',
    'More IR tablets means more to divert. NICE says not to offer IR stimulants when there is a risk of diversion (1.7.24).',
    NG+' 1.7.24')]},
 end:{end:true, text:'Tom moves to a lower-risk product with closer supply monitoring.', summary:'Key learning: early requests, “lost” supplies and peer pressure are warning signs. Talk, record, tell the prescriber, and move to lower-risk products and smaller supplies (NG87 1.7.23–1.7.24, 1.8.19).'}}},

adultnew:{title:'Rhian, 34: “Can you start me on Elvanse?”', img:'images/m1-adult-work.jpg', alt:'Illustration of an overwhelmed adult at a desk', source:'Focus: recognition, referral and your role',
 summary:'You are a pharmacist independent prescriber in a GP practice in Cardiff. After an online self-test, Rhian asks you to start Elvanse. She describes lifelong disorganisation, school reports about daydreaming, and losing two jobs.', start:'a', nodes:{
 a:{text:'Her ASRS screener score is high. She also says her mood has been low for months and she is sleeping badly.', ask:'What do you do?', choices:[
  C('Explain that a screener is not a diagnosis; check mood (including thoughts of self-harm), anxiety, alcohol and drugs, and sleep; refer to the adult ADHD service if her symptoms began in childhood, have persisted, are not better explained by another condition and cause at least moderate impairment', 'good',
    'These are NICE’s adult referral criteria (1.2.10). Only a trained specialist diagnoses ADHD (1.3.1), and rating scales alone never make the diagnosis (1.3.2). Low mood matters twice: it needs its own care and a safety check, and it could explain or add to her symptoms. Medication is started only by a specialist (1.7.2).',
    NG+' 1.2.10, 1.3.1–1.3.2, 1.7.2'),
  C('Prescribe lisdexamfetamine 30 mg as a “trial” to see if it helps', 'bad',
    'ADHD medication is started only by a specialist (1.7.2), after a full assessment and baseline (1.7.4). A good response to a stimulant does not prove ADHD (clinical practice), and the Elvanse adult licence requires childhood symptoms to be confirmed.',
    NG+' 1.7.2, 1.7.4 · Elvanse SmPC 4.1'),
  C('Tell her adult ADHD is over-diagnosed and decline to refer', 'bad',
    'If she meets the referral criteria she should be referred (1.2.10). NICE warns that ADHD is under-recognised in women and girls, who are more likely to be misdiagnosed (1.2.2). Dismissing her also misses the low mood.',
    NG+' 1.2.2, 1.2.10')]},
 b:{text:'She asks how long the wait is, and whether she can use “Right to Choose” to see a private provider on the NHS.', ask:'What is balanced advice?', choices:[
  C('Waits are long and vary; Right to Choose is an NHS England scheme and does not apply to patients registered with a GP in Wales; a private diagnosis does not guarantee NHS shared care; and offer support while she waits (mood, sleep, work adjustments) with a safety net', 'good',
    'Right to Choose is part of NHS England’s choice rights; patients registered with a GP in Wales have no equivalent statutory right (Senedd research brief, petition P-06-1290). Shared care depends on an agreement with an NHS specialist service (1.7.29), and many areas review private diagnoses first (clinical practice). Meanwhile, treat the low mood, give sleep advice, and point to workplace adjustments such as Access to Work.',
    'Senedd petition P-06-1290 research brief · '+NG+' 1.7.29 · Clinical practice'),
  C('Promise that the NHS will take over any private prescription', 'bad',
    'Not guaranteed. NHS prescribing under shared care depends on a local agreement with a specialist service (1.7.29), and many areas review private diagnoses first.',
    NG+' 1.7.29 · Clinical practice')]},
 end:{end:true, text:'Rhian is referred, her mood is being treated, and she knows what to expect.', summary:'Key learning: primary care recognises, screens for what else is going on, and refers (NG87 1.2.10); diagnosis and starting medication are specialist roles (1.3.1, 1.7.2).'}}}
};

/* A best choice without its own "next" moves to the following node in the order written (a, then b, then end).
   Choices are written best-first for easy editing, then rotated by a fixed amount per case and step so the best
   answer is not always option A (the same order every visit). */
var SPIN = {ethan:[1,2], mia:[2,1], liam12:[3,0], noah:[0,2], anxiety:[0,1], emma:[2,2], sophia:[2,0], david:[3,1], bp:[1,0], shortage:[3,1], misuse:[1,0], adultnew:[2,0]};
Object.keys(window.CASES).forEach(function(k){
  var nodes = window.CASES[k].nodes, ids = Object.keys(nodes);
  ids.forEach(function(id, i){
    var ch = nodes[id].choices; if(!ch) return;
    ch.forEach(function(c){ if(c.grade==='good' && !c.next) c.next = ids[i+1]; });
    var r = ((SPIN[k] || [])[i] || 0) % ch.length;
    if(r) nodes[id].choices = ch.slice(ch.length - r).concat(ch.slice(0, ch.length - r));
  });
});
})();
