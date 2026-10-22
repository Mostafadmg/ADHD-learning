/* Assessor training modules 5-8 (ARCHITECTURE.md 5.7).
   m5 Running the diagnostic interview (DIVA-style); m6 Childhood history, age of onset and collateral
   information; m7 Impairment: assessing and rating functional impact; m8 Differential diagnosis I:
   psychiatric conditions.
   UK practice (NICE NG87) is the default frame; international guidance is included.
   DSM-5-TR and ICD-11 are paraphrased for teaching, not reproduced. The interview follows DIVA's
   structure only; all question wording, examples and vignettes are original. NICE text is quoted
   sparingly with attribution. Facts come from the research briefs of 21 October 2026 (guidelines-uk,
   guidelines-intl, tools-adhd, tools-comorbid, ddx-evidence) and the primary papers they cite;
   anything else is labelled "clinical practice". Patients in vignettes are fictional. */
AA.add('learn', [

  /* ================================================================== */
  /* Module 5                                                             */
  /* ================================================================== */
  {
    id: "m5", n: 5, minutes: 50,
    title: "Running the diagnostic interview",
    summary: "How to run a DIVA-style semi-structured interview well: the setting, the explanation, who is in the room, adulthood then childhood, getting concrete examples, the four tests for every symptom, handling 'everyone does that', managing time, using the app live, scoring the 18 symptoms and what to do when you are not sure.",
    objectives: [
      "Prepare and open the interview: room, time, explanation to the patient, who is present, and how to use the app during the consultation.",
      "Cover all 18 symptoms for adulthood and then childhood, using open questions that produce concrete, datable examples without leading.",
      "Apply four tests to every symptom (frequency beyond peers, pervasiveness, trait-like course, consequences) and respond well to 'everyone does that'.",
      "Score the 18 symptoms consistently, avoid double counting, and read the per-list tally correctly against the DSM-5-TR threshold.",
      "Handle uncertain answers, use the supplement question as a cross-check, and close the interview so the next steps are clear."
    ],
    sections: [
      {
        h: "What the interview is for, and where it fits",
        html:
          "<p>The semi-structured interview is the core of an adult ADHD assessment. UKAAN makes it an essential standard: every one of the 18 DSM-5-TR symptoms is evaluated in adulthood and in childhood, with open questions and clear examples, and it is 'not conducted as a simple tick box exercise' (AQAS 2024). UKAAN names DIVA, CAADID and ACE+ as suitable schedules, or an experienced assessor's own style, provided every symptom, impairment and additional criterion is covered.</p>" +
          "<p>The interview in this app follows the structure of DIVA: each symptom is asked about for adulthood and then for childhood, with examples, a supplement question after each list, then onset, impairment and collateral rated 0 to 2. All of the wording is original. It is not DIVA. If you own DIVA-5 you can use it alongside the app.</p>" +
          "<h4>Where it sits in the appointment</h4>" +
          "<p>RCPsych cautions against a first appointment made up only of a semi-structured interview, because it can be leading, produce false positives and miss more fitting diagnoses (CR235 9.1). So take an open history first:</p>" +
          "<ol>" +
          "<li>The presenting problems in the patient's own words, and why they are seeking help now.</li>" +
          "<li>Psychiatric, developmental, medical, substance and forensic history, and a mental state examination.</li>" +
          "<li>Then the 18-symptom interview, followed by onset, impairment and collateral.</li>" +
          "</ol>" +
          "<p>Hearing the story first protects you. You learn the person's language, you notice episodes, trauma or substance use that might explain the picture, and the 18-item frame does not shape the account before you have heard it.</p>" +
          "<h4>The interview tests a claim; it does not record one</h4>" +
          "<p>An interview that simply asks 'do you do this?' will confirm almost anything. In one study of adults referred for ADHD whose effort on testing was non-credible, 71% would have been diagnosed on the interview alone (Marshall 2016). The interview has to weigh evidence.</p>" +
          "<table><thead><tr><th>The interview is</th><th>The interview is not</th></tr></thead><tbody>" +
          "<tr><td>A structured way to gather specific, personal examples for each symptom</td><td>A questionnaire read aloud</td></tr>" +
          "<tr><td>A test of frequency, settings, course and cost for each symptom</td><td>A count of items the patient recognises</td></tr>" +
          "<tr><td>A two-period history: the last 6 months and age 5 to 12</td><td>A snapshot of how the person seems today</td></tr>" +
          "<tr><td>One strand of evidence, alongside collateral, records and the differential</td><td>The whole diagnosis</td></tr>" +
          "</tbody></table>"
      },
      {
        h: "Setting up: room, time, explanation and who is present",
        html:
          "<h4>Room and mode</h4>" +
          "<p>Use a quiet room with few interruptions. UKAAN requires direct consultation, face to face or by video (AQAS 2024), and RCPsych says the quality of the assessment matters more than the mode (CR235 9.8). The DHSC review lists assessments that are not face to face among those with a higher risk of misdiagnosis (2026). In practice, prefer meeting in person when the picture is complex, when validity is in doubt or when video makes rapport hard (clinical practice).</p>" +
          "<h4>Time</h4>" +
          "<p>Allow at least 2 hours of direct contact in most cases, in one session with a break or over several sessions (AQAS 2024, essential). RCPsych suggests two to three one-hour sessions (2017), and DIVA takes about an hour and a half with practice. AADPA describes a detailed interview of 2 to 3 hours (2022). Book enough time before you start. Rushing the childhood half is the commonest way to spoil an interview.</p>" +
          "<h4>The explanation</h4>" +
          "<p>Orienting the patient is a UKAAN highly recommended standard. A clear explanation reduces anxiety, sets expectations and makes the answers more useful. For example:</p>" +
          "<blockquote>'I am going to ask about 18 kinds of difficulty with attention, restlessness and acting on impulse. For each one I will ask how things have been over the last six months, and then what you were like at primary school. I will ask for real examples, so it may feel detailed. There are no right answers. If something does not apply, please say so. That is just as useful to me. I will type notes as we go.'</blockquote>" +
          "<blockquote>'Some questions may sound similar. That is deliberate. I may not be able to give you an answer today, because I also want to look at school reports and talk to someone who knew you as a child.'</blockquote>" +
          "<h4>Who is present</h4>" +
          "<p>DIVA recommends a partner or family member in the room where possible, so collateral can be gathered at the same time. This saves time and often adds detail. It also has costs: a patient may not mention drinking, self-harm, debt or conflict at home in front of a relative, and some informants answer for the patient. A practical approach (clinical practice):</p>" +
          "<ul>" +
          "<li>Ask the patient beforehand whom they would like present, and get consent to involve them.</li>" +
          "<li>See the patient alone for part of the appointment, always including risk, substance use and safety at home.</li>" +
          "<li>When an informant is present, let the patient answer first, then ask the informant whether they agree or can add an example.</li>" +
          "<li>If the informant dominates or the patient goes quiet, thank them and arrange a separate call instead.</li>" +
          "</ul>" +
          "<h4>Other practical points</h4>" +
          "<ul>" +
          "<li><strong>Interpreters.</strong> Use a professional interpreter, not a family member. Allow extra time, and check that examples make sense in the person's culture (clinical practice). ICD-11 asks you to judge symptoms against cultural norms.</li>" +
          "<li><strong>Medication and substances.</strong> If the person already takes ADHD medication, ask about their functioning without it. Note caffeine, nicotine, cannabis or other drugs used on the day (clinical practice).</li>" +
          "<li><strong>Record set-up.</strong> In the Before you start step, record who is present, consent, interpreter use and which records you hold. The report draws on these fields.</li>" +
          "</ul>"
      },
      {
        h: "Adulthood first, then childhood",
        html:
          "<p>For each symptom, ask first about adulthood and then about childhood, before moving to the next symptom. This is DIVA's order, and the app's.</p>" +
          "<ul>" +
          "<li><strong>Adulthood</strong> means the last 6 months. DSM-5-TR criterion A needs symptoms that have persisted for at least 6 months.</li>" +
          "<li><strong>Childhood</strong> means primary school, roughly age 5 to 12. DSM-5-TR criterion B needs several symptoms before 12.</li>" +
          "</ul>" +
          "<h4>Why adulthood first</h4>" +
          "<ul>" +
          "<li>Recent behaviour is easier to describe and check, so you get concrete examples quickly.</li>" +
          "<li>You learn the patient's own words for the problem, which you can reuse for the childhood question.</li>" +
          "<li>The childhood question then becomes a comparison: 'Was that already there at primary school?' This is easier to answer than an abstract question about the past.</li>" +
          "</ul>" +
          "<h4>Anchor childhood once, then return to it</h4>" +
          "<p>Before the first childhood question, spend two minutes setting the scene: the name of the primary school, a teacher, where the family lived, who was at home, how they got to school. Then, for each symptom, take the patient back to that scene. Module 6 covers memory aids in detail.</p>" +
          "<blockquote>'Picture yourself in Year 4, in Mrs Patel's class. When the class was given a worksheet, what would you be doing ten minutes later?'</blockquote>" +
          "<h4>Use the teenage years as the bridge</h4>" +
          "<p>Adolescence is not scored separately, but ask about it. ADHD symptoms are trait-like and should not be episodic (AQAS 2024). A clear gap, such as 'I was fine from 13 to 25, then it all started', needs an explanation before you go further.</p>" +
          "<h4>When the last 6 months are not typical</h4>" +
          "<p>If the recent period was unusual (a depressive episode, a new baby, a bereavement, heavy drinking, a change of medication), ask about the person's usual self as well and record both. Symptoms that are present only during such a period do not count towards ADHD (DSM-5-TR criterion E; ICD-11 CDDR).</p>" +
          "<table><thead><tr><th>Symptom</th><th>Adulthood question (example)</th><th>Childhood question (example)</th></tr></thead><tbody>" +
          "<tr><td>Losing things (A1g)</td><td>'Over the last six months, what have you lost or mislaid, and how often?'</td><td>'At primary school, what happened to your coat, lunch box and reading book?'</td></tr>" +
          "<tr><td>Restlessness (A2c)</td><td>'How does it feel to sit through a long meeting or a film?'</td><td>'At school assemblies or on long car journeys, what were you like?'</td></tr>" +
          "<tr><td>Interrupting (A2i)</td><td>'Have people told you that you cut in or take over? What did they say?'</td><td>'Did teachers comment on calling out or butting into other children's games?'</td></tr>" +
          "</tbody></table>"
      },
      {
        h: "Getting concrete examples",
        html:
          "<p>UKAAN makes it essential to 'elicit and document clear examples' of each symptom identified as present (AQAS 2024). A general 'yes, that's me' is not evidence. You need a specific event, from the person's own life, that you could describe in the report.</p>" +
          "<h4>The funnel</h4>" +
          "<ol>" +
          "<li><strong>Open question.</strong> Read the main question and wait. Let the patient answer in their own words.</li>" +
          "<li><strong>Specific instance.</strong> 'Tell me about the last time that happened.'</li>" +
          "<li><strong>Frequency.</strong> 'In a typical week, how many times?'</li>" +
          "<li><strong>Settings.</strong> 'Does that happen at home as well as at work?'</li>" +
          "<li><strong>Consequences.</strong> 'What happened as a result?'</li>" +
          "<li><strong>Coping.</strong> 'How do you manage it, and what happens when that does not work?'</li>" +
          "</ol>" +
          "<p>Only after the open question should you use the example list, and then as prompts, one at a time. Tick only the examples the patient actually describes, and type their own words in the box. Not every example needs to be present. The aim is a clear picture of whether the symptom is there.</p>" +
          "<h4>What a good example looks like</h4>" +
          "<table><thead><tr><th>Weak evidence</th><th>Strong evidence</th></tr></thead><tbody>" +
          "<tr><td>'I'm always losing stuff.'</td><td>'I've replaced my driving licence twice this year. Last month I left my bank card in a cash machine. My partner put a tracker on my keys.'</td></tr>" +
          "<tr><td>'I can't concentrate.'</td><td>'I read the same page of a report four or five times. In meetings I lose the thread after ten minutes and have to ask a colleague what was agreed.'</td></tr>" +
          "<tr><td>'I've got time blindness.'</td><td>'I think a job will take 20 minutes and it takes two hours. I was late for my sister's wedding because I started tidying the garage.'</td></tr>" +
          "<tr><td>'Everyone says I talk too much.'</td><td>'My manager raised it in my appraisal. Friends joke that I need an off switch. My partner says I talk over them every evening.'</td></tr>" +
          "</tbody></table>" +
          "<p>Strong examples are specific, recent, personal and observable, and they carry a consequence. Often they come with a comment from someone else.</p>" +
          "<h4>When the patient brings ready-made language</h4>" +
          "<p>Many people arrive with terms such as 'executive dysfunction', 'time blindness' or 'dopamine seeking'. Do not argue with the words. Translate them back into behaviour:</p>" +
          "<blockquote>'When you say time blindness, what does that look like on an ordinary Tuesday?'</blockquote>" +
          "<p>RCPsych warns that people who have read about ADHD may easily endorse most items (CR235 9.6). Personal, varied and slightly untidy detail is more convincing than a fluent textbook description.</p>" +
          "<h4>When the answers sprawl</h4>" +
          "<p>Some patients answer at length and drift off the point. Kooij (2019) notes that inattentive adults may be long-winded and tangential, which can itself slow the assessment. Steer kindly:</p>" +
          "<blockquote>'That is helpful, and I can see how it links. So I can cover everything today, can I bring you back to forgetting appointments? When was the last one?'</blockquote>"
      },
      {
        h: "The four tests for every symptom",
        html:
          "<p>DSM-5-TR asks for symptoms that have lasted at least 6 months, to a degree that is inconsistent with developmental level, and that have a direct negative impact on social, academic or occupational activities. NICE NG87 1.3.3 adds that they must happen often, in two or more important settings. Turn these requirements into four tests and apply them to each symptom (clinical practice, building on Module 2).</p>" +
          "<table><thead><tr><th>Test</th><th>Question to ask</th><th>Passes</th><th>Fails</th></tr></thead><tbody>" +
          "<tr><td><strong>1. Frequency beyond peers</strong></td><td>'How often? Is that more than friends or colleagues of your age?'</td><td>Most days or weeks, clearly more than people of similar age, education and culture</td><td>A few times a year, or about the same as everyone else</td></tr>" +
          "<tr><td><strong>2. Pervasiveness</strong></td><td>'Where else does it happen: at home, with friends, on holiday?'</td><td>More than one setting, not tied to one person, task or stressor</td><td>Only with one manager, only in one subject, only when anxious</td></tr>" +
          "<tr><td><strong>3. Trait-like course</strong></td><td>'Has it always been like this? Has there been a time when it was not?'</td><td>Long-standing, part of the usual self; may fluctuate through the day</td><td>Started recently, or comes and goes in episodes</td></tr>" +
          "<tr><td><strong>4. Consequences</strong></td><td>'What has it cost you, or what does it take to stop it costing you?'</td><td>Real effects, or coping only at a high price</td><td>No consequences and no effort needed</td></tr>" +
          "</tbody></table>" +
          "<h4>How to apply the tests</h4>" +
          "<ul>" +
          "<li><strong>Peers.</strong> Compare with people of the same age and broadly similar ability and background. ICD-11 asks you to judge symptoms against cultural norms. A 60-year-old forgets more names than a 25-year-old; the question is whether this person forgets more than their own peers.</li>" +
          "<li><strong>Interest.</strong> ICD-11 notes that inattention may not show during intensely stimulating or rewarding activities. Long spells of focus on games or a hobby do not fail test 1. Ask about routine, low-interest tasks.</li>" +
          "<li><strong>Fluctuation.</strong> Symptoms can vary through the day and with demands (AQAS 2024; ICD-11). That is not the same as an episodic course over weeks or months.</li>" +
          "<li><strong>Consequences at symptom level.</strong> Each symptom you score as present should have some cost. The formal rating of impairment by life area comes later, in the Onset and impairment step (Module 7).</li>" +
          "<li><strong>Compensation.</strong> A symptom held in check by alarms, lists and a partner is still a symptom if the support is doing the work. Ask what happens when the support fails, and what the effort costs (CR235 9.2).</li>" +
          "</ul>" +
          "<p>A symptom scored present should pass all four tests. If it clearly fails one, score No. If you cannot tell, score Unsure.</p>"
      },
      {
        h: "'Everyone does that': normalising, leading and over-endorsement",
        html:
          "<p>ADHD symptoms are spread across the population like blood pressure (NHS England ADHD Taskforce 2025). Everyone loses keys sometimes. So 'everyone does that' is true of the behaviour and says nothing about the disorder. It can come from either side of the desk.</p>" +
          "<h4>When the patient says it</h4>" +
          "<p>Some patients minimise. They have heard it all their lives, or they have never compared themselves with anyone else. Do not agree and move on, and do not argue. Turn to frequency, comparison and cost:</p>" +
          "<blockquote>'You're right, everyone loses things now and then. What I need to know is how often it happens for you, and what it has cost.'</blockquote>" +
          "<blockquote>'If your best friend or your brother described their week, would they lose things as often as you?'</blockquote>" +
          "<blockquote>'What do the people around you say about it?'</blockquote>" +
          "<h4>When the clinician thinks it</h4>" +
          "<p>The same trap catches assessors. A symptom that sounds ordinary may still be frequent, pervasive and costly. Apply the four tests rather than your impression of how common the behaviour is.</p>" +
          "<h4>Leading questions</h4>" +
          "<p>Open questions are an essential UKAAN standard. Closed checklists of the 18 symptoms risk confirmation bias (AQAS 2024).</p>" +
          "<table><thead><tr><th>Leading</th><th>Better</th></tr></thead><tbody>" +
          "<tr><td>'You're easily distracted, aren't you?'</td><td>'What happens to your attention when someone starts talking near you while you work?'</td></tr>" +
          "<tr><td>'So you were a fidgety child?'</td><td>'What were you like when you had to sit on the carpet at school?'</td></tr>" +
          "<tr><td>'Do you have ADHD-type trouble with forms?'</td><td>'Tell me about the last long form you had to fill in.'</td></tr>" +
          "<tr><td>'And that's been lifelong, has it?'</td><td>'When do you first remember that happening?'</td></tr>" +
          "</tbody></table>" +
          "<h4>Over-endorsement and under-endorsement</h4>" +
          "<ul>" +
          "<li><strong>Over-endorsement.</strong> In adults referred for ADHD, published rates of non-credible responding are about 15 to 31% (Suhr 2008; Harrison and Edwards 2010; Marshall 2010; Ovsiew 2023; see Module 4). Young adults without ADHD tend to over-report symptoms on self-report (Sibley 2012). Warning signs: every symptom 'always', textbook phrases, no personal examples, no exceptions. Ask, 'When does it not happen?', and record concerns for the Symptom validity step.</li>" +
          "<li><strong>Under-endorsement.</strong> Many adults with ADHD have limited insight into how their symptoms affect others (Kooij 2019), and young adults with ADHD tend to under-report (Sibley 2012). Women and girls are more likely to be missed (NICE NG87 1.2.2), often because of masking. Ask what partners, parents and colleagues say.</li>" +
          "</ul>"
      },
      {
        h: "Managing time and using the app live",
        html:
          "<p>A good interview is paced. Spend little time on symptoms that are clearly absent or clearly present, and more on the borderline ones.</p>" +
          "<table><thead><tr><th>Part</th><th>Typical time</th><th>Notes</th></tr></thead><tbody>" +
          "<tr><td>Open history and mental state</td><td>20 to 40 minutes</td><td>Presenting problems, history, risk</td></tr>" +
          "<tr><td>Interview part 1: inattention</td><td>35 to 50 minutes</td><td>Nine symptoms, adulthood then childhood</td></tr>" +
          "<tr><td>Interview part 2: hyperactivity-impulsivity</td><td>25 to 40 minutes</td><td>Same method; take a break first if needed</td></tr>" +
          "<tr><td>Onset and impairment</td><td>15 to 20 minutes</td><td>Criteria B, C and D</td></tr>" +
          "<tr><td>Collateral</td><td>15 to 30 minutes</td><td>Often a separate phone call</td></tr>" +
          "</tbody></table>" +
          "<p>These times are the app's working estimates (clinical practice). Together they fit the UKAAN minimum of 2 hours.</p>" +
          "<h4>Pacing rules (clinical practice)</h4>" +
          "<ul>" +
          "<li><strong>Clearly absent:</strong> one open question, one probe, then move on. 'No, never been a problem' with a credible reason is enough.</li>" +
          "<li><strong>Clearly present:</strong> one good example, then check the four tests briefly. You do not need ten examples.</li>" +
          "<li><strong>Borderline:</strong> this is where the time goes. Use Other ways to ask, probe further, and ask for the informant's view.</li>" +
          "<li>Take a short break between the two parts. Fatigue lowers the quality of answers, for patient and clinician.</li>" +
          "<li>If time runs out, finish the symptom you are on and book a second session. Do not skim the childhood half.</li>" +
          "</ul>" +
          "<h4>Using the app in the room</h4>" +
          "<ul>" +
          "<li>Tell the patient you will be typing, and turn the screen so it is not a barrier.</li>" +
          "<li>Read the main question as written, then wait. Use <strong>Other ways to ask</strong> if it does not land, for example with low literacy or a non-native speaker.</li>" +
          "<li>Open <strong>Probe further</strong> for frequency, peers, settings, impact and compensation.</li>" +
          "<li>Tick only the examples the patient describes, and type their own words. Short quotes make the report convincing.</li>" +
          "<li>Use <strong>How to score this symptom</strong> and its calibration examples when you hesitate.</li>" +
          "<li>Switch to the <strong>Childhood</strong> tab and score the same way. Rate informant support 0, 1, 2 or n/a when an informant or a school report covers the symptom.</li>" +
          "<li>If the problem might come from something else, open <strong>Could it be something else?</strong> and flag the condition for the Differential diagnosis step.</li>" +
          "<li>The <strong>Question bank</strong> lets you search every question and example by symptom, life area or keyword, which helps when a patient raises something out of order.</li>" +
          "</ul>"
      },
      {
        h: "Scoring the 18 symptoms: worked examples",
        html:
          "<p>Score each symptom Yes, Unsure or No, separately for adulthood and childhood.</p>" +
          "<ul>" +
          "<li><strong>Yes:</strong> at least one clear, specific example, and the four tests are passed.</li>" +
          "<li><strong>Unsure:</strong> plausible but incomplete. The examples are vague, come from one setting, or might belong to another condition.</li>" +
          "<li><strong>No:</strong> no convincing example, or a clear failure of one test, or the behaviour is better explained by something else.</li>" +
          "</ul>" +
          "<h4>Worked example 1: losing things (A1g), adulthood</h4>" +
          "<p>Ben, 31, says, 'Everyone loses their keys.' Probing brings out two replacement driving licences in 18 months, a bank card left in a cash machine last month, a laptop left on a train, and a tracker his partner bought for his keys. His partner confirms it. <strong>Score Yes.</strong> It is frequent, happens in several settings, and has cost money and time.</p>" +
          "<h4>Worked example 2: careless mistakes (A1a), adulthood</h4>" +
          "<p>Aisha, 27, says she makes typos. She makes about one a week. Her colleagues do the same, the spell-checker catches them, and nobody has commented. Her reports are accurate. <strong>Score No.</strong> It fails test 1 (not more than peers) and test 4 (no consequences).</p>" +
          "<h4>Worked example 3: inner restlessness (A2c), adulthood</h4>" +
          "<p>Tom, 44, sits still throughout two hours. He describes constant inner restlessness. He cannot watch a film without his phone, plans the next activity by day two of a holiday, and runs every morning 'or I'm unbearable'. His partner describes him pacing during phone calls. <strong>Score Yes.</strong> In adults restlessness may be only a feeling, and sitting calmly in the assessment does not exclude ADHD (Kooij 2019). CADDRA adds that you should not rely on what you observe in the interview.</p>" +
          "<h4>Worked example 4: not finishing tasks (A1d), adulthood</h4>" +
          "<p>Grace, 38, says she has stopped finishing anything. On timing, this began 18 months ago with low mood, early waking and loss of interest in everything. Before that she completed a part-time degree and ran a choir. Her mother recalls a reliable, organised child. <strong>Score No for ADHD</strong> and flag depression. This is a change from her usual self that came with a mood episode. ICD-11 counts such problems towards ADHD only if they were present since childhood and persist after the episode resolves.</p>" +
          "<h4>Worked example 5: one incident, two symptoms</h4>" +
          "<p>Femi, 26, missed a dentist appointment and offers it for both 'forgetful in daily activities' (A1i) and 'difficulty organising' (A1e). One incident should not be the only evidence for two symptoms (clinical practice). Use it for the better fit: he forgot the appointment existed, so A1i. Then ask for separate examples of planning and organising before scoring A1e. Do not double count across conditions either: behaviour better explained by autism should not also be counted as ADHD (Young 2020, UKAP ADHD and autism consensus).</p>" +
          "<h4>Worked example 6: the tally</h4>" +
          "<p>Sam, 34, after both parts of the interview:</p>" +
          "<table><thead><tr><th></th><th>Yes</th><th>Unsure</th><th>No</th></tr></thead><tbody>" +
          "<tr><td>Adulthood, inattention</td><td>6 (A1a, b, d, e, h, i)</td><td>1 (A1c)</td><td>2</td></tr>" +
          "<tr><td>Adulthood, hyperactivity-impulsivity</td><td>3 (A2a, c, g)</td><td>1 (A2h)</td><td>5</td></tr>" +
          "<tr><td>Childhood, inattention</td><td>5</td><td>1</td><td>3</td></tr>" +
          "<tr><td>Childhood, hyperactivity-impulsivity</td><td>2</td><td>0</td><td>7</td></tr>" +
          "</tbody></table>" +
          "<ul>" +
          "<li>The threshold applies to each list separately: 5 or more from age 17. Inattention reaches it (6). Hyperactivity-impulsivity does not (3).</li>" +
          "<li>The unsure items do not change either conclusion: 6 is already enough, and 3 plus 1 is still below 5.</li>" +
          "<li>Childhood: 7 symptoms before 12 is clearly 'several'. DSM-5-TR gives no number; the app uses 3 or more as a working guide and asks you to confirm (an app convention).</li>" +
          "<li>If criteria B to E are also met, the presentation is predominantly inattentive. Presentation is based on the last 6 months. Where childhood and adult patterns differ, the current pattern decides (DIVA 2.0 score form).</li>" +
          "</ul>" +
          "<p>Now change one thing. Suppose Sam had 4 Yes and 2 Unsure in adult inattention. The decision now hinges on the unsure items. Do not round up. Criterion A is pending until collateral, records or a further session settles them.</p>"
      },
      {
        h: "Uncertain answers, the supplement question and closing",
        html:
          "<p>Unsure is a legitimate score. It means 'not yet decided', not 'half present'. It never counts towards the threshold. Use it, then come back to it.</p>" +
          "<table><thead><tr><th>Source of uncertainty</th><th>What to do</th></tr></thead><tbody>" +
          "<tr><td>Vague or patchy recall, especially for childhood</td><td>Re-anchor with school-year landmarks; ask the informant; read school reports (Module 6)</td></tr>" +
          "<tr><td>Possible state effect (mood, anxiety, sleep, substances)</td><td>Ask about periods when the other problem was absent; build a timeline; flag the condition (Module 8)</td></tr>" +
          "<tr><td>Only one setting described</td><td>Ask about other settings directly; ask what a partner or friend sees</td></tr>" +
          "<tr><td>Heavy compensation</td><td>Ask what happens when the support fails, and what the effort costs</td></tr>" +
          "<tr><td>Patient and informant disagree</td><td>Ask each for specific examples; look for a third source (Module 6)</td></tr>" +
          "<tr><td>Possible over-reporting</td><td>Ask for exceptions and specific episodes; record it for the validity step</td></tr>" +
          "</tbody></table>" +
          "<p>If a symptom is still uncertain after all of this, it does not count. If the diagnosis turns on it, say so in the report, record the outcome as pending or deferred, and plan how you will resolve it. Do not force a conclusion either way.</p>" +
          "<h4>The supplement question</h4>" +
          "<p>After the ninth symptom in each list, the app asks a supplement question for adulthood and for childhood: taken together, are these problems clearly more frequent or more severe than in most people of the same age and background? DIVA has a similar question. It is not a DSM-5-TR criterion and it does not add to the count. It is a global cross-check on test 1.</p>" +
          "<ul>" +
          "<li><strong>Yes, with several symptoms scored present:</strong> consistent. Move on.</li>" +
          "<li><strong>No, but several symptoms scored present:</strong> look again. Each Yes should already have passed the peer comparison. Either the scoring was generous or the patient is minimising now.</li>" +
          "<li><strong>Yes, but few symptoms scored present:</strong> the person feels different from peers, but the specific symptoms are not there. Consider under-reporting, another explanation, or difficulties that ADHD does not explain.</li>" +
          "</ul>" +
          "<h4>Closing the interview</h4>" +
          "<ul>" +
          "<li>Summarise what you heard in a few sentences and check it with the patient.</li>" +
          "<li>Ask, 'Is there anything important about this that I have not asked?'</li>" +
          "<li>Explain the next steps: collateral, school reports, the differential diagnosis and when they will hear the outcome.</li>" +
          "<li>Avoid giving a verdict before collateral and the differential are complete, unless the picture is already clear. Manage expectations honestly.</li>" +
          "</ul>"
      }
    ],
    keyPoints: [
      "The semi-structured interview is the core evidence for an adult ADHD diagnosis. It must test every symptom, not confirm a questionnaire (AQAS 2024).",
      "Take an open history and mental state first. Do not make the first contact a symptom checklist alone (RCPsych CR235 9.1).",
      "For each symptom, ask about adulthood (last 6 months) and then childhood (age 5 to 12), and record a concrete example in the patient's own words.",
      "Score Yes only when the symptom passes four tests: more frequent than peers, present across settings, trait-like since childhood, and with real consequences.",
      "Ask open questions first. Examples are prompts, not a checklist; leading questions and tick-box interviews risk confirmation bias.",
      "Answer 'everyone does that' with frequency, comparison and cost, not with agreement or argument.",
      "Unsure is a legitimate holding score. It never counts towards the threshold; resolve it with collateral, records or a further session.",
      "The threshold applies to each list separately (5 or more from age 17). The supplement question is a cross-check on peer comparison, not an extra criterion.",
      "Allow at least 2 hours of direct contact in most cases, and split the sessions rather than rushing the childhood half."
    ],
    pitfalls: [
      "Reading the example list aloud as a checklist instead of asking the open question and waiting.",
      "Scoring hyperactivity from how the patient behaves in the room. Calm in clinic does not exclude ADHD.",
      "Counting symptoms that appear only during a depressive or anxious episode, after poor sleep, or with substance use.",
      "Accepting generic or textbook descriptions ('time blindness', 'executive dysfunction') without a personal example.",
      "Using one incident as the only evidence for two symptoms, or counting autistic features as ADHD symptoms as well.",
      "Rounding Unsure up to Yes when the threshold depends on it.",
      "Skimming the childhood half when time runs short, instead of booking a second session.",
      "Interviewing only jointly, so the patient never has the chance to talk alone about risk, substances or safety at home."
    ],
    quiz: [
      { q: "In a DIVA-style interview, in what order are the periods covered for each symptom?",
        options: ["Childhood first, then adulthood", "Adulthood (last 6 months), then childhood (about age 5 to 12)", "Adulthood only, unless the patient raises childhood", "All nine adult symptoms first, then childhood only if the adult threshold is met"], a: 1,
        why: "Each symptom is asked about for adulthood and then for childhood before moving on. Recent behaviour gives concrete examples and the patient's own words, and the childhood question becomes a comparison. Childhood must be asked about whatever the adult count, because criterion B depends on it." },
      { q: "Why does RCPsych CR235 caution against a first appointment that consists only of a semi-structured interview?",
        options: ["It takes longer than two hours", "NICE NG87 does not allow semi-structured interviews", "DIVA-5 requires a separate licence for first appointments", "It can be leading, produce false positives and miss more fitting diagnoses"], a: 3,
        why: "CR235 9.1 warns that interviewing solely with a semi-structured schedule can lead the patient and miss other diagnoses. Take an open history and mental state first, then use the interview." },
      { q: "Ola, 35, says, 'Everyone loses their phone.' What is the best response?",
        options: ["Agree, then ask how often it happens for them, what it has cost and how it compares with friends or colleagues", "Agree and score the symptom absent", "Explain that ADHD is a spectrum and score the symptom present", "Skip the symptom to save time"], a: 0,
        why: "The behaviour is common; the disorder is about frequency, pervasiveness, course and cost. Acknowledge the point, then apply the four tests with concrete questions." },
      { q: "Which question is least likely to lead the patient?",
        options: ["'You find paperwork really hard, don't you?'", "'Do you have ADHD-type problems with forms?'", "'Tell me about the last long form you had to fill in. What happened?'", "'Would you say you are always disorganised?'"], a: 2,
        why: "An open request for a specific recent event lets the patient describe what actually happened. The other options suggest the answer or invite a global yes. UKAAN makes open questions an essential standard." },
      { q: "Lena, 38, has 4 inattentive symptoms scored Yes and 2 scored Unsure for adulthood. What is the status of criterion A for inattention?",
        options: ["Met, because each unsure item counts as half", "Pending: resolve the unsure items with collateral, records or another session before deciding", "Not met, so stop the assessment", "Met for combined presentation"], a: 1,
        why: "Unsure never counts towards the threshold, and you should not round up when the outcome depends on it. The adult threshold is 5 per list. Record criterion A as pending and plan how to settle the uncertain items." },
      { q: "Which of these is NOT one of the four tests applied to each symptom?",
        options: ["Clearly more frequent or severe than in peers of the same age and background", "Present in more than one setting", "Trait-like and long-standing since childhood", "Clearly visible during the interview"], a: 3,
        why: "The four tests are frequency beyond peers, pervasiveness, trait-like course and consequences. Behaviour in the room is a poor guide: CADDRA advises against relying on observation, and calm in clinic does not exclude ADHD (Kooij 2019)." },
      { q: "Tom, 44, sits still for two hours but describes constant inner restlessness, cannot watch a film without his phone and runs daily to feel settled. His partner confirms it. How should restlessness be scored for adulthood?",
        options: ["Yes: in adults restlessness may be only a feeling, and calm behaviour in clinic does not exclude it", "No, because no restlessness was observed", "Unsure until a QbTest has been done", "No, because inner restlessness always means anxiety"], a: 0,
        why: "DSM-5-TR and ICD-11 allow restlessness in adults to be limited to feelings of restlessness. Kooij (2019) notes that sitting calmly does not exclude ADHD. QbTest is research only in adults (NICE HTG729)." },
      { q: "Grace, 38, says her concentration and follow-through collapsed 18 months ago with low mood, early waking and loss of interest. Before that she was organised, and her mother recalls a reliable child. How should 'does not follow through' be scored?",
        options: ["Yes, because the problem is present now", "Unsure indefinitely", "No for ADHD, and flag depression: this is a change with a mood episode, not a trait", "Yes, and diagnose ADHD and depression together"], a: 2,
        why: "The problem began with a depressive episode and is a change from her usual self. ICD-11 counts such problems towards ADHD only if present since childhood and persisting after the episode resolves." },
      { q: "What is the supplement question asked after each list of nine symptoms?",
        options: ["A tenth symptom that counts towards criterion A", "A global check that, taken together, the problems are clearly more than in most people of the same age and background", "A symptom validity test", "A question about the exact age of onset"], a: 1,
        why: "The supplement question, a DIVA structural element, cross-checks the peer comparison across the whole list. It is not a DSM-5-TR criterion and does not add to the count. A 'no' alongside many 'yes' scores means the scoring should be reviewed." },
      { q: "Femi offers a single missed dentist appointment as evidence for both forgetfulness (A1i) and poor organisation (A1e). What should you do?",
        options: ["Score both symptoms from this incident", "Score neither symptom", "Score both but note that the evidence is weak", "Use it for the better-fitting symptom and ask for separate examples before scoring the other"], a: 3,
        why: "One incident should not be the only evidence for two symptoms (clinical practice). Pick the best fit and look for independent examples. UKAP also warns against double counting across ADHD and autism." },
      { q: "Joint interview: when you ask about alcohol, the patient glances at their partner and goes quiet. What is the best next step?",
        options: ["Offer time alone to talk about substance use, risk and safety, then bring the partner back with the patient's consent", "Carry on jointly and record 'no concerns'", "Ask the partner to answer instead", "End the interview"], a: 0,
        why: "Informants add valuable detail, but their presence can inhibit disclosure. Always give the patient time alone for risk, substances and safety at home (clinical practice), then continue with collateral by consent." },
      { q: "According to UKAAN AQAS (2024), how much direct contact does an adult ADHD assessment need in most cases?",
        options: ["About 30 minutes", "About 1 hour", "At least 2 hours, in one session with a break or over several sessions", "At least 6 hours"], a: 2,
        why: "AQAS makes a total of at least 2 hours an essential standard in most cases. RCPsych suggests two to three one-hour sessions, and AADPA describes 2 to 3 hours." }
    ],
    refs: [
      "NICE NG87. Attention deficit hyperactivity disorder: diagnosis and management (2018, updated 2019; last reviewed July 2026). Recommendations 1.2.2, 1.3.1, 1.3.2, 1.3.3.",
      "Adamou M et al. The adult ADHD assessment quality assurance standard (UKAAN AQAS). Front Psychiatry 2024;15:1380410.",
      "Royal College of Psychiatrists. CR235 ADHD in adults: good practice guidelines (2023), sections 9.1, 9.2, 9.6 and 9.8; RCPsych in Scotland, ADHD in adults: good practice guidelines (2017).",
      "Kooij JJS et al. Updated European Consensus Statement on diagnosis and treatment of adult ADHD. Eur Psychiatry 2019;56:14-34 (sections 4 and 4.1).",
      "Kooij JJS, Francken MH. DIVA 2.0, the DIVA Foundation semi-structured interview for adults, 2010 (structure and score-form rules only; no wording reproduced). DIVA Foundation, DIVA-5 information pages (divacenter.eu).",
      "American Psychiatric Association. DSM-5-TR (2022): ADHD criteria A to E, paraphrased.",
      "World Health Organization. ICD-11 Clinical descriptions and diagnostic requirements (CDDR), 2024: 6A05.",
      "CADDRA. Canadian ADHD Practice Guidelines, 4.1 edition (2020), chapter 1.",
      "May T et al. The Australian evidence-based clinical practice guideline for ADHD. Aust N Z J Psychiatry 2023;57:1101-1116.",
      "Sibley MH et al. When diagnosing ADHD in young adults emphasize informant reports, DSM items, and impairment. J Consult Clin Psychol 2012;80:1052-1061.",
      "Marshall PS et al. Psychol Assess 2016;28:1290-1302 (non-credible presentations in adult ADHD referrals). Suhr J et al. Arch Clin Neuropsychol 2008;23:521-530. Harrison AG, Edwards MJ. Appl Neuropsychol 2010;17:135-143. Marshall P et al. Clin Neuropsychol 2010;24:1204-1237. Ovsiew GP et al. Clin Neuropsychol 2023;37:1498-1515.",
      "Young S et al. Guidance for identification and treatment of individuals with ADHD and autism (UKAP consensus). BMC Med 2020;18:146.",
      "Young S et al. Females with ADHD: an expert consensus statement (UKAP). BMC Psychiatry 2020;20:404.",
      "NHS England. Report of the independent ADHD Taskforce, Parts 1 and 2 (2025).",
      "Department of Health and Social Care. Independent review into mental health conditions, ADHD and autism: final report (October 2026)."
    ]
  },

  /* ================================================================== */
  /* Module 6                                                             */
  /* ================================================================== */
  {
    id: "m6", n: 6, minutes: 50,
    title: "Childhood history, age of onset and collateral information",
    summary: "How to establish criterion B and the course of symptoms decades after the event: the limits of adult recall, memory aids, reading school reports, interviewing parents and partners, rating collateral support 0 to 2, deciding whom to believe when accounts differ, what to do when nobody is available, and how to handle apparent late-onset ADHD.",
    objectives: [
      "State what DSM-5-TR criterion B, ICD-11 and NICE NG87 require about childhood onset, and separate the onset of symptoms from the onset of impairment.",
      "Explain the main biases in adult recall of childhood and use memory aids and records to counter them.",
      "Read school reports critically and interview parents, siblings and partners for specific, independent examples.",
      "Rate collateral support 0, 1 or 2, weigh discrepancies between sources, and proceed reasonably when no informant is available.",
      "Summarise the evidence on late-onset ADHD and apply a structured approach when symptoms seem to start after age 12."
    ],
    sections: [
      {
        h: "What criterion B asks for, and why it matters",
        html:
          "<p>DSM-5-TR criterion B needs <strong>several</strong> inattentive or hyperactive-impulsive symptoms before age 12. It does not need a childhood diagnosis, the full symptom count, or impairment before 12. DSM-IV asked for impairing symptoms before 7. The APA moved the age because children identified after 7 did not differ in course, severity, outcome or treatment response (APA DSM-5 fact sheet, 2013).</p>" +
          "<p>ICD-11 asks for evidence of significant symptoms before 12. It notes that some people first come to clinical attention later, often when demands exceed their capacity to compensate. In adults, the history before 12 is best established from school or local records or from childhood informants. Without that corroboration, ICD-11 says an adult diagnosis should be made with caution.</p>" +
          "<p>NICE NG87 1.3.3 says that exclusion based on an uncertain time of onset is not recommended. These positions fit together: record what you have, weigh it, and explain your reasoning.</p>" +
          "<h4>Why onset does real work</h4>" +
          "<p>The WFADHD 2026 update (a preprint, not yet peer reviewed) found an adult prevalence of 2.6% when childhood onset was required and 6.7% when it was not. Many adults have ADHD-like symptoms for other reasons. Childhood onset is one of the main ways to tell them apart. UKAAN adds that onset must not rest on a 'snapshot' impression (AQAS 2024, essential): you need a picture of the course, not one remembered moment.</p>" +
          "<h4>Three different 'onsets'</h4>" +
          "<table><thead><tr><th>Onset of</th><th>Typical example</th><th>What it means</th></tr></thead><tbody>" +
          "<tr><td><strong>Symptoms</strong></td><td>Daydreaming and unfinished work noted from Year 1</td><td>This is what criterion B asks about</td></tr>" +
          "<tr><td><strong>Impairment</strong></td><td>Coped at a small, strict school; struggled at university without structure</td><td>Common and compatible with ADHD. Scaffolding by parents and schools can mask symptoms (CR235 9.2)</td></tr>" +
          "<tr><td><strong>Recognition</strong></td><td>First thought of ADHD when their child was diagnosed</td><td>Says nothing about when symptoms began</td></tr>" +
          "</tbody></table>" +
          "<p>Most adults who say 'it started at university' are describing the onset of impairment. Ask what they were like before the structure fell away.</p>"
      },
      {
        h: "Retrospective recall and its biases",
        html:
          "<p>Adults are asked to describe behaviour from 20, 30 or 50 years ago. The evidence shows that this is hard to do accurately.</p>" +
          "<ul>" +
          "<li>At population prevalence, an adult's self-report of childhood ADHD had a positive predictive value of only about 0.27 (Mannuzza 2002). In the general population, most adults who recall an ADHD-like childhood would not have had ADHD as children.</li>" +
          "<li>In young adults followed from a childhood ADHD diagnosis, retrospective self-reports correlated only modestly with ratings made in childhood (r about 0.25 to 0.28), and those with ADHD tended to under-report their childhood symptoms. Parents' retrospective reports correlated better (r about 0.46), though still imperfectly (Sibley 2012).</li>" +
          "<li>Recall is especially poor in people with high ability, a very structured or supportive upbringing, or a mainly inattentive presentation (Kooij 2019).</li>" +
          "<li>Retrospective self-rating scales are not specific either. WURS-25 scores are raised in borderline personality disorder and bipolar disorder (Kouros 2018), and at the standard cut-off about 1 in 5 people with depression were misclassified (Ward 1993).</li>" +
          "</ul>" +
          "<h4>Common biases and how to counter them (clinical practice)</h4>" +
          "<table><thead><tr><th>Bias</th><th>How it shows</th><th>Counter</th></tr></thead><tbody>" +
          "<tr><td>Gaps and forgetting</td><td>'I don't remember primary school at all'</td><td>Memory aids, school reports, a childhood informant</td></tr>" +
          "<tr><td>Normalisation</td><td>'We were all like that in our house'</td><td>Compare with classmates; ask what teachers said</td></tr>" +
          "<tr><td>Mood colouring</td><td>A depressed patient recalls a uniformly bleak childhood</td><td>Ask for specific scenes; reassess when mood improves</td></tr>" +
          "<tr><td>Reconstruction</td><td>'Now I know about ADHD, I can see it in everything'</td><td>Ask what was noticed at the time, by whom, and what was written down</td></tr>" +
          "<tr><td>Family legend</td><td>A story told so often it now feels like a memory</td><td>Ask how old they were, who else was there, how often it happened</td></tr>" +
          "<tr><td>Minimising</td><td>Shame, loyalty to parents, or fear of the label</td><td>Normalise difficulty; ask what others said; see school reports</td></tr>" +
          "<tr><td>Motivated reporting</td><td>An incentive for a particular outcome</td><td>Seek independent sources; see the validity step</td></tr>" +
          "</tbody></table>" +
          "<p>Treat the patient's childhood account as a hypothesis to test with sources from the time. It still matters: it tells you what to look for, and some adults recall their childhood well.</p>"
      },
      {
        h: "Building the childhood history: memory aids",
        html:
          "<p>UKAAN makes it essential to cover academic progress, exclusions, behaviour in class, peer relationships, antisocial behaviour, personal relationships and traumatic experiences in childhood and adolescence. Pregnancy, birth, early milestones and early temperament are highly recommended (AQAS 2024). Early contact with speech and language therapy, occupational therapy, a health visitor or a paediatrician suggests neurodevelopmental vulnerability (CR235 9.4).</p>" +
          "<h4>Anchor the period</h4>" +
          "<ul>" +
          "<li><strong>School-year timeline.</strong> England and Wales: Reception and Years 1 to 6, then Years 7 to 11. Scotland: P1 to P7, then S1 to S4. Northern Ireland: P1 to P7, then Years 8 to 12. Work through key years one at a time.</li>" +
          "<li><strong>Places and people.</strong> The school's name, a teacher, where they sat, who their friends were, where they lived, who was at home.</li>" +
          "<li><strong>Typical scenes.</strong> Getting ready in the morning, the walk to school, carpet time, homework, bedtime, car journeys.</li>" +
          "<li><strong>Comparisons.</strong> Brothers and sisters, cousins, classmates: who was told off more, who lost things, who needed more help?</li>" +
          "<li><strong>Consequences.</strong> Being kept in at break, sent out of class, detentions, letters home, being grounded.</li>" +
          "<li><strong>Labels.</strong> Nicknames from family, teachers or children: dreamer, chatterbox, whirlwind.</li>" +
          "</ul>" +
          "<blockquote>'Picture your Year 3 classroom. Where did you sit? What would your teacher have said about you at parents' evening?'</blockquote>" +
          "<blockquote>'When your family tells stories about you as a child, what do they say?'</blockquote>" +
          "<blockquote>'Compared with your brother, who needed more reminders to get ready for school?'</blockquote>" +
          "<h4>Physical prompts</h4>" +
          "<ul>" +
          "<li>School reports, letters home, behaviour charts, home-school diaries and old exercise books.</li>" +
          "<li>The Red Book (Personal Child Health Record), GP letters, hospital records of injuries, and reports from educational psychology, speech and language therapy, CAMHS or paediatrics.</li>" +
          "<li>Photos and home videos.</li>" +
          "</ul>" +
          "<h4>Prepare before the appointment</h4>" +
          "<p>Ask the patient to bring any school reports and records, and invite a parent or older relative to write down their own memories in advance. UKAAN lists a written informant summary and a patient-written life story or timeline as optional extras (AQAS 2024). A timeline also helps the differential diagnosis (Module 8), because it shows what came first.</p>"
      },
      {
        h: "School reports: how to read them",
        html:
          "<p>School reports are written at the time, by people with no stake in an adult diagnosis. UKAAN asks the report to say whether school reports were reviewed and whether they support the diagnosis (AQAS 2024). Always ask to see the originals rather than the patient's summary.</p>" +
          "<h4>What to look for</h4>" +
          "<ul>" +
          "<li><strong>Comments, not grades.</strong> Good marks do not rule ADHD out. Read the teachers' words.</li>" +
          "<li><strong>Themes across years and teachers.</strong> One comment in one year means little. The same theme from different teachers over several years means a lot.</li>" +
          "<li><strong>The gap between ability and output.</strong> 'Capable but…' comments, unfinished work, homework not handed in, effort grades lower than attainment.</li>" +
          "<li><strong>Behaviour.</strong> Calling out, leaving their seat, distracting others, detentions, behaviour points.</li>" +
          "<li><strong>Support.</strong> Extra adult help, a teaching assistant, special educational needs support, referrals.</li>" +
          "<li><strong>Typical language.</strong> In girls especially, reports may describe daydreaming, distraction and disorganisation rather than disruption (Young 2020, UKAP consensus on females).</li>" +
          "</ul>" +
          "<h4>Cautions</h4>" +
          "<ul>" +
          "<li>Comments such as 'chatty' or 'could try harder' appear in many reports of children without ADHD.</li>" +
          "<li>A lack of comments does not exclude ADHD. Quiet, inattentive pupils draw few remarks, and some reports are brief or formulaic.</li>" +
          "<li>Problems confined to one subject, such as reading or maths, suggest a specific learning difficulty. ICD-11 says that if inattention occurs only during tasks in the area of a learning difficulty, the learning disorder is the diagnosis.</li>" +
          "<li>Comments that appear suddenly in one year may reflect events at the time: a bereavement, family breakdown, bullying, illness.</li>" +
          "<li>Reports from age 12 onwards can show persistence. On their own they cannot establish onset before 12.</li>" +
          "</ul>" +
          "<h4>Worked example</h4>" +
          "<p>Jordan, 29, brings three primary school reports (fictional wording):</p>" +
          "<ul>" +
          "<li><strong>Year 2:</strong> 'A bright, cheerful boy. Jordan must learn to listen to instructions the first time. Written work is often left unfinished.'</li>" +
          "<li><strong>Year 4:</strong> 'Full of ideas, but easily drawn off task by others and needs frequent reminders. Homework is rarely returned.'</li>" +
          "<li><strong>Year 6:</strong> 'Very capable, but careless slips cost him marks. Jordan must try to wait his turn to speak.'</li>" +
          "</ul>" +
          "<p>Three teachers over four years describe not listening (A1c), unfinished work (A1d), distractibility (A1h), careless mistakes (A1a), poor organisation of homework (A1e) and difficulty waiting to speak (A2g or A2h), in a capable child. <strong>Rate the school source 2, clear support.</strong> Use the reports to support the matching childhood symptoms, rating informant support for each.</p>" +
          "<p>Compare Mia, 31, with one Year 5 report: 'A lively member of the class who can be chatty. Could try harder in maths.' <strong>Rate 0, or 1 at most.</strong> These are ordinary comments from a single year, with no pattern.</p>"
      },
      {
        h: "Interviewing parents and other childhood informants",
        html:
          "<p>UKAAN highly recommends at least one informant who knew the patient in childhood, usually a parent or older sibling (AQAS 2024). If no parent is available, consider a step-parent, grandparent, aunt or uncle, family friend, childhood friend or former teacher.</p>" +
          "<h4>How to run it</h4>" +
          "<ol>" +
          "<li>Get the patient's consent and agree what can be shared.</li>" +
          "<li>Speak to the informant separately where possible: by phone, video or in person. Allow 15 to 30 minutes.</li>" +
          "<li>Start open: 'What was she like as a child?' Let them talk before you narrow down.</li>" +
          "<li>Ask for stories and comparisons with siblings or classmates.</li>" +
          "<li>Then cover the symptom areas in plain language: attention, organisation, losing things, activity, waiting, interrupting.</li>" +
          "<li>Cover early development, school, friendships and the teenage years.</li>" +
          "<li>End with: 'Is there anything else about them as a child that you think I should know?'</li>" +
          "</ol>" +
          "<h4>Sample questions</h4>" +
          "<blockquote>'Before he started school, what was he like: sleep, energy, temper?'</blockquote>" +
          "<blockquote>'Compared with her sister, how much help did she need to get ready in the morning?'</blockquote>" +
          "<blockquote>'What did teachers say at parents' evenings? Was it the same every year?'</blockquote>" +
          "<blockquote>'Can you remember a time when his restlessness or forgetfulness got him into trouble? What happened?'</blockquote>" +
          "<blockquote>'Were there periods when things were much better or much worse? What was happening then?'</blockquote>" +
          "<h4>What to watch for</h4>" +
          "<ul>" +
          "<li>Parents may have ADHD themselves and see the behaviour as normal (Young 2020, UKAP consensus on females).</li>" +
          "<li>Memory fades over decades. Parents may also idealise the past, feel guilt, or defend their parenting.</li>" +
          "<li>A parent who worked away, was unwell or separated early may simply not know.</li>" +
          "<li>An older sibling can describe primary school years. A younger sibling usually cannot.</li>" +
          "<li>Informants can hold strong views about ADHD in either direction. Ask for examples, not opinions.</li>" +
          "<li>Listen for other explanations: trauma, neglect, a learning difficulty, anxiety, early social-communication difficulties.</li>" +
          "</ul>" +
          "<p>If an interview is not possible, an informant rating scale or written account completed at home is an option (AQAS 2024). CADDRA suggests a retrospective informant scale for someone who knew the patient as a child.</p>"
      },
      {
        h: "Interviewing partners and adult informants",
        html:
          "<p>ICD-11 notes that the report of a significant other, family member or co-worker can add important information in adults. UKAAN highly recommends someone who knows the patient's adult functioning (AQAS 2024). This is usually a partner, but a close friend, housemate or trusted colleague can do the job.</p>" +
          "<h4>What partners see that patients miss</h4>" +
          "<ul>" +
          "<li>How the household actually runs: who pays the bills, remembers appointments and organises the children.</li>" +
          "<li>Driving, spending, phone use, sleep and how evenings go.</li>" +
          "<li>The effect on others: interrupting, forgetting plans, conflict about the same issues.</li>" +
          "<li>Clues to other conditions: spells of different behaviour, drinking, low mood, loud snoring or pauses in breathing at night.</li>" +
          "</ul>" +
          "<h4>Sample questions</h4>" +
          "<blockquote>'Talk me through a typical weekday evening at home. What tends to go wrong?'</blockquote>" +
          "<blockquote>'Who keeps track of money and appointments in your home? Why is that?'</blockquote>" +
          "<blockquote>'What are you most often frustrated about? Can you give me a recent example?'</blockquote>" +
          "<blockquote>'Have there been spells, lasting days or weeks, when they were noticeably different from their usual self?'</blockquote>" +
          "<h4>Cautions</h4>" +
          "<ul>" +
          "<li>Partners know only the adult years, and a new partner may know only a few months.</li>" +
          "<li>Conflict colours reports in both directions. A partner in a difficult relationship may exaggerate or dismiss.</li>" +
          "<li>Some partners have absorbed the difficulties for so long that they no longer notice them.</li>" +
          "<li>If you suspect coercive control or abuse, do not contact the partner without discussing it with the patient alone and assessing safety first (clinical practice).</li>" +
          "</ul>" +
          "<p>CADDRA suggests that someone who knows the patient well completes the ASRS as an observer report. As with self-report, use it to guide questions, not to decide.</p>"
      },
      {
        h: "Rating collateral support 0 to 2",
        html:
          "<p>Following DIVA's structure, the app rates how far each source supports the history, on a three-point scale.</p>" +
          "<table><thead><tr><th>Rating</th><th>Meaning</th></tr></thead><tbody>" +
          "<tr><td><strong>0</strong> None or little support</td><td>The source does not describe the symptoms, or describes only ordinary, isolated behaviour. Also use 0 when the source contradicts the patient.</td></tr>" +
          "<tr><td><strong>1</strong> Some support</td><td>Describes some symptoms or some impairment, or supports the account in general terms with few examples, or covers only part of the relevant period.</td></tr>" +
          "<tr><td><strong>2</strong> Clear support</td><td>Gives specific, independent examples of several symptoms and their impact, consistent with the patient, across settings or years.</td></tr>" +
          "</tbody></table>" +
          "<p>Rate at two levels:</p>" +
          "<ul>" +
          "<li><strong>Per symptom</strong>, in the interview: informant support for adulthood and for childhood (0, 1, 2 or n/a).</li>" +
          "<li><strong>Per source</strong>, in the Collateral information step: parent or childhood informant, partner or adult informant, and school reports.</li>" +
          "</ul>" +
          "<h4>Calibration examples</h4>" +
          "<ul>" +
          "<li>A mother describes a child who 'never sat through a meal', broke things, lost a coat every term, and needed her beside him for homework. Teachers raised it every year. <strong>Parent: 2.</strong></li>" +
          "<li>A father says, 'She was a bit dreamy, but so are lots of kids. I don't remember much about school.' <strong>Parent: 1</strong> if he gives at least one relevant example, otherwise 0.</li>" +
          "<li>A partner says, 'He's a bit forgetful, like most people.' No examples. <strong>Partner: 0.</strong></li>" +
          "<li>A partner of 12 years describes late fees, three lost phones this year, a speeding ban and evenings derailed by unfinished jobs. <strong>Partner: 2.</strong></li>" +
          "</ul>" +
          "<p>The app summarises collateral as clear, some, none or unavailable, from the best-rated source, and feeds it into the confidence rating in the Scoring and diagnosis step. Treat the summary as a prompt. One clear source does not cancel a contradicting one. Record who you spoke to, how, which period they covered, and a short quote.</p>"
      },
      {
        h: "When accounts disagree: who to believe",
        html:
          "<p>Different sources see different parts of a life. Disagreement is common, and it is information.</p>" +
          "<h4>What the evidence suggests</h4>" +
          "<ul>" +
          "<li><strong>Adulthood.</strong> For current symptoms, some research shows that the adult patient is the best informant (Kooij 2008, cited in Kooij 2019). DIVA's instructions take a similar line. A partner or relative still adds valuable information on severity and daily impact.</li>" +
          "<li><strong>Childhood.</strong> A parent or older relative is usually the better source. In young adults with childhood ADHD, parent report was more diagnostically sensitive than self-report, and parents' retrospective reports matched childhood ratings better (Sibley 2012). Adult recall alone has a low positive predictive value (Mannuzza 2002).</li>" +
          "</ul>" +
          "<table><thead><tr><th>Source</th><th>Best placed to report</th><th>Main limits</th></tr></thead><tbody>" +
          "<tr><td>Patient</td><td>Inner experience, current symptoms, effort and cost of coping</td><td>Limited insight in some; weak childhood recall; incentives</td></tr>" +
          "<tr><td>Parent</td><td>Early development, childhood behaviour, school</td><td>Memory after decades; own ADHD; guilt or idealising; absence</td></tr>" +
          "<tr><td>Older sibling</td><td>Childhood from close quarters</td><td>Child's-eye view; rivalry</td></tr>" +
          "<tr><td>Partner or friend</td><td>Daily adult functioning, home, money, driving</td><td>Knows only adulthood; conflict</td></tr>" +
          "<tr><td>School reports</td><td>Contemporaneous behaviour in class</td><td>Formulaic; quiet pupils overlooked; gaps</td></tr>" +
          "</tbody></table>" +
          "<h4>Rules for weighing</h4>" +
          "<ul>" +
          "<li>Do not add up or average accounts. Compare like with like: the same symptom, in the same setting, over the same period.</li>" +
          "<li>Weigh each source's position: how often they saw the person, in which settings, and their own stake or stress.</li>" +
          "<li>When the patient reports more than informants, consider masking, an informant who sees only part of the person's life, normalisation, and over-reporting.</li>" +
          "<li>When informants report more than the patient, consider limited insight. Kooij (2019) notes that some adults report many symptoms but little impairment, or the reverse.</li>" +
          "<li>Look for a third source to break the tie: school reports, records, another relative, a work appraisal.</li>" +
          "<li>Record each discrepancy, the likely reasons and how you weighed it (AQAS 2024).</li>" +
          "</ul>" +
          "<h4>Worked example</h4>" +
          "<p>Priya, 33, describes daydreaming, lost belongings and unfinished work through primary school. Her mother says, 'She was no trouble at all.' Year 3 and Year 5 reports say she 'often seems far away' and 'rarely finishes written tasks'. Her mother worked nights and had four children. The quiet, inattentive picture is easy to miss at home, and ADHD is under-recognised in girls (NICE NG87 1.2.2). Rate the parent 0 and the school 2. Explain in the report why you gave more weight to the reports.</p>"
      },
      {
        h: "When no informant is available",
        html:
          "<p>Parents may have died, be estranged or live abroad. Some patients grew up in care. School records are often destroyed by the time the person is in their mid-twenties (clinical practice).</p>" +
          "<h4>Options to try</h4>" +
          "<ul>" +
          "<li>Ask the patient and family to search at home for reports and letters, early in the process.</li>" +
          "<li>Request old records: GP records, which usually follow the person and may hold childhood letters; hospital notes; educational psychology, speech and language therapy, CAMHS, social care or youth justice reports.</li>" +
          "<li>Find another person who knew them as a child: an older sibling, grandparent, aunt or uncle, family friend, childhood friend or former teacher.</li>" +
          "<li>For adult life, use a long-standing friend, housemate or colleague. Work appraisals and college feedback can help.</li>" +
          "<li>Offer a written account or an informant rating scale when an interview is not possible (AQAS 2024, optional).</li>" +
          "</ul>" +
          "<h4>Deciding without collateral</h4>" +
          "<p>RCPsych regards corroborative history as essential, but says an inability to obtain it for reasons outside the patient's control should not necessarily exclude a diagnosis and treatment (CR235 9.5). DIVA 2.0 allowed a decision on the patient's recall alone when collateral could not be obtained. ICD-11 advises caution.</p>" +
          "<table><thead><tr><th>Raises confidence</th><th>Lowers confidence</th></tr></thead><tbody>" +
          "<tr><td>Specific, datable, varied childhood memories</td><td>Vague, generic or textbook recall</td></tr>" +
          "<tr><td>Early developmental contacts or concerns in GP records</td><td>No trace in any record where one would be expected</td></tr>" +
          "<tr><td>A typical, pervasive adult picture with clear impairment</td><td>Symptoms that track mood, substances or stress</td></tr>" +
          "<tr><td>No better explanation after a full differential</td><td>Untreated conditions that could explain the picture</td></tr>" +
          "<tr><td>A consistent account across interview and questionnaires</td><td>Inconsistencies or clear incentives</td></tr>" +
          "</tbody></table>" +
          "<p>Document the gap and your reasoning. For example: 'No childhood informant was available (both parents deceased) and no school reports survive. The patient gave specific, consistent accounts of several symptoms before age 12. GP records include a 1998 letter about a referral for concentration difficulties. On balance I consider criterion B met, with the caution that ICD-11 advises when corroboration is limited.' If the picture is still unclear, defer and review rather than force a decision.</p>"
      },
      {
        h: "Late-onset ADHD: the evidence and what to do",
        html:
          "<p>Some adults describe symptoms that seem to start after 12. The research is debated, and the criteria have not changed.</p>" +
          "<table><thead><tr><th>Study or source</th><th>Finding</th></tr></thead><tbody>" +
          "<tr><td>Dunedin cohort (Moffitt 2015)</td><td>1,037 people followed from birth to 38. About 90% of those who met adult ADHD criteria had not had childhood ADHD, and that group lacked the childhood neuropsychological deficits and polygenic risk of childhood ADHD. The adult group showed substance dependence and impairment. Onset age and informant corroboration were study outcomes, not requirements, for the adult diagnosis.</td></tr>" +
          "<tr><td>MTA comparison group (Sibley 2018)</td><td>239 people without childhood ADHD, assessed eight times from about 10 to 25 with parent, teacher and self reports. About 95% of those who first screened positive for late-onset ADHD were excluded on full review. The commonest reason was symptoms occurring only with heavy substance use. There was no adult onset without a complex psychiatric history.</td></tr>" +
          "<tr><td>Population cohort (Cooper 2018)</td><td>Most apparent late-onset cases had high ADHD scores at some point in childhood, so a single measure at 12 had misclassified them.</td></tr>" +
          "<tr><td>European Consensus (Kooij 2019)</td><td>Most later-onset cases appear to meet the 'several symptoms by 12' rule. Assess impairment, psychiatric history and substance use carefully.</td></tr>" +
          "<tr><td>BAP (2014)</td><td>The literature does not support a later-onset disorder without childhood symptoms; many patients were simply not diagnosed as children.</td></tr>" +
          "<tr><td>ICD-11 CDDR</td><td>Acute or abrupt onset of hyperactivity in adolescence or adulthood should raise the possibility of another cause, such as emerging psychosis or bipolar disorder.</td></tr>" +
          "</tbody></table>" +
          "<h4>A structured approach</h4>" +
          "<ol>" +
          "<li><strong>Clarify what is late.</strong> Symptoms, impairment or recognition? Most 'late' cases are late impairment.</li>" +
          "<li><strong>Look for hidden childhood symptoms.</strong> Ability, a strict or small school, or a parent who organised everything can hide them (Kooij 2019; CR235 9.2). Check reports and informants.</li>" +
          "<li><strong>Search hard for alternatives.</strong> Heavy substance use, depression, bipolar disorder, anxiety, trauma, sleep disorders, head injury, thyroid disease, medicines and early psychosis (Module 8).</li>" +
          "<li><strong>Test impairment carefully.</strong> Ordinary, non-impairing ups and downs in concentration were a common reason for exclusion in Sibley 2018.</li>" +
          "<li><strong>Choose the right outcome.</strong> ADHD if several symptoms before 12 are established after all; another diagnosis if it explains the picture; DSM-5-TR other specified ADHD, with the reason recorded, if impairing symptoms remain without a better explanation; or defer and review over time.</li>" +
          "<li><strong>Write down your reasoning,</strong> including what would change your mind.</li>" +
          "</ol>"
      }
    ],
    keyPoints: [
      "Criterion B needs several symptoms before 12. It does not need a childhood diagnosis, the full count, or impairment before 12.",
      "Separate the onset of symptoms from the onset of impairment. Impairment often appears when structure falls away; symptoms were usually there earlier.",
      "Adult recall of childhood is weak on its own (Mannuzza 2002; Sibley 2012). Corroborate it with school reports, records and a childhood informant.",
      "Read school reports for consistent themes across years and teachers, not for grades. Reports from age 12 onwards show persistence, not onset.",
      "For current adult symptoms the patient is often the best informant (Kooij 2008); for childhood, a parent or older relative usually is.",
      "Rate collateral 0, 1 or 2 per symptom and per source. Never average accounts; compare like with like and look for a third source.",
      "Missing collateral should not by itself exclude a diagnosis when it is outside the patient's control (CR235 9.5; NICE NG87 1.3.3), but ICD-11 advises caution. Document the gap.",
      "Most apparent late-onset ADHD turns out to be hidden childhood symptoms or another explanation, especially heavy substance use (Sibley 2018). Search hard before diagnosing."
    ],
    pitfalls: [
      "Treating 'it started at university' as the onset of symptoms rather than of impairment.",
      "Accepting 'I was fine at school' without asking about structure, support and effort.",
      "Reading grades instead of teachers' comments, or over-reading a single 'chatty' remark.",
      "Interviewing an informant with leading questions or reading them the 18 symptoms, instead of asking for stories and comparisons.",
      "Averaging conflicting accounts, or settling the conflict by default in favour of whoever sounds most certain.",
      "Excluding ADHD only because no informant is available, or diagnosing without recording the gap and its effect on confidence.",
      "Applying the old DSM-IV age-7 rule, which DIVA 2.0 still reflects.",
      "Diagnosing apparent late-onset ADHD without a careful search for substance use, mood disorder and other causes."
    ],
    quiz: [
      { q: "What does DSM-5-TR criterion B require?",
        options: ["Six or more symptoms in one list before age 12", "Several inattentive or hyperactive-impulsive symptoms before age 12; impairment and a childhood diagnosis are not required", "Impairing symptoms before age 7", "A documented childhood diagnosis of ADHD"], a: 1,
        why: "DSM-5 moved from impairing symptoms before 7 to several symptoms before 12. Neither the full count, impairment before 12, nor a childhood diagnosis is required." },
      { q: "Mannuzza (2002) found that, at population prevalence, an adult's self-report of childhood ADHD had a positive predictive value of about 0.27. What follows for practice?",
        options: ["Adults should not be asked about their childhood", "A WURS-25 score can replace collateral", "Childhood recall is accurate enough to stand alone", "Seek contemporaneous evidence, such as school reports or a childhood informant, to corroborate recall"], a: 3,
        why: "In the general population, most adults who recall an ADHD-like childhood would not have had ADHD as children. Recall is still useful as a guide, but needs corroboration. The WURS-25 is itself retrospective self-report and is raised in other conditions." },
      { q: "For current adult symptoms, which source does the European Consensus (citing Kooij 2008) suggest may be the best informant?",
        options: ["The patient", "A parent", "School reports", "The GP record"], a: 0,
        why: "Kooij 2019 notes that some research shows the adult patient is the best informant for current symptoms. A partner or relative still adds information on severity and daily impact. For childhood, parents are usually better placed." },
      { q: "In Sibley (2012), young adults diagnosed with ADHD in childhood were assessed in young adulthood. Which finding is correct?",
        options: ["Self-report was more sensitive than parent report", "Combining self and parent report was essential", "Parent report was more diagnostically sensitive, and young adults with ADHD tended to under-report", "Teacher report was the most accurate source"], a: 2,
        why: "Parent report was more sensitive, those with ADHD under-reported current and childhood symptoms, and controls tended to over-report. There was no significant gain from adding self-report to parent report." },
      { q: "Mia, 31, brings one Year 5 report: 'A lively member of the class who can be chatty. Could try harder in maths.' How should the school source be rated?",
        options: ["0, or at most 1: ordinary comments from a single year show no pattern", "2, because 'chatty' confirms talking excessively", "2, because any teacher comment counts", "It cannot be rated without the grades"], a: 0,
        why: "Comments like 'chatty' and 'could try harder' appear in many reports of children without ADHD. Clear support needs specific, consistent themes across years or teachers." },
      { q: "Alex, 24, has school reports only from Years 8 to 11. They repeatedly describe disorganisation and missed homework. What can they establish?",
        options: ["Onset before 12, because they are school reports", "Nothing, because secondary reports are never useful", "A diagnosis of ADHD on their own", "Persistence through adolescence, but not onset before 12 on their own"], a: 3,
        why: "Reports from age 12 onwards support persistence and the trait-like course. Evidence before 12 must come from primary reports, informants, records or the patient's own specific memories." },
      { q: "School reports describe poor concentration and unfinished work only in reading and spelling lessons. Other lessons are fine. What does this most suggest?",
        options: ["ADHD, combined presentation", "A specific learning difficulty, with inattention confined to the area of difficulty", "Oppositional behaviour", "Normal variation, needing no further thought"], a: 1,
        why: "ICD-11 says that if inattention occurs only during tasks in the area of a learning difficulty, the learning disorder is the diagnosis. ADHD symptoms should be pervasive. Ask about literacy history and consider an educational assessment." },
      { q: "Rhys, 45, grew up in care, has no contact with his family and no school reports survive. What is the best approach?",
        options: ["Exclude ADHD because criterion B cannot be corroborated", "Diagnose on self-report without comment", "Seek other records and people, use specific recall carefully, and document the gap and how it affects confidence", "Use a WURS-25 score as a substitute for collateral"], a: 2,
        why: "CR235 9.5 says lack of corroboration outside the patient's control should not necessarily exclude a diagnosis, and NICE NG87 1.3.3 advises against exclusion on uncertain onset. ICD-11 advises caution. Look for social care, GP and other records, and record your reasoning." },
      { q: "In the MTA comparison group (Sibley 2018), what was the most common reason for excluding apparent late-onset ADHD among those with impairing symptoms?",
        options: ["Symptoms or impairment occurring only in the context of heavy substance use", "A diagnosis of autism", "Head injury", "Hypothyroidism"], a: 0,
        why: "About 95% of initial screen positives were excluded on full review, most often because symptoms occurred only with heavy substance use. Others reflected another disorder or non-impairing fluctuations. No adult onset was found without a complex psychiatric history." },
      { q: "In the Dunedin cohort, about 90% of adults meeting ADHD criteria at 38 had not had childhood ADHD (Moffitt 2015). How should an assessor use this finding?",
        options: ["Drop the childhood-onset requirement", "Treat it as contested evidence that does not change the criteria, and look especially hard for alternative explanations in apparent adult onset", "Diagnose adult-onset ADHD as a separate disorder", "Ignore it, because cohort studies are irrelevant"], a: 1,
        why: "The finding is debated: later work found most apparent late-onset cases had childhood symptoms or another explanation (Cooper 2018; Sibley 2018). The adult-onset group in Dunedin showed substance dependence. Criteria still require several symptoms before 12." },
      { q: "Priya's mother says Priya was 'no trouble at all'. Year 3 and Year 5 reports say Priya 'often seems far away' and 'rarely finishes written tasks'. Her mother worked nights with four children. What is the best way to weigh this?",
        options: ["Average the sources and rate childhood as uncertain", "Accept the mother's account, because parents are the best childhood source", "Give weight to the reports, rate parent 0 and school 2, and explain why in the report", "Disregard the reports, because they are old"], a: 2,
        why: "Parents are usually the better childhood source, but weigh each source's position. A quiet, inattentive picture is easy to miss at home, and ADHD is under-recognised in girls (NICE NG87 1.2.2). Do not average; explain the weighting." },
      { q: "Chen, 22, says attention problems started in his first year at university. What should you do first?",
        options: ["Diagnose late-onset ADHD", "Record onset as after 12 and stop", "Refer for neuropsychological testing", "Ask what he was like before the structure of school fell away, and look for earlier symptoms masked by support or ability"], a: 3,
        why: "University often marks the onset of impairment, not symptoms. Scaffolding and ability can mask childhood symptoms (CR235 9.2; Kooij 2019). Then check for other causes such as substances, mood and sleep." }
    ],
    refs: [
      "American Psychiatric Association. DSM-5-TR (2022): ADHD criterion B, paraphrased; APA DSM-5 ADHD fact sheet (2013).",
      "World Health Organization. ICD-11 CDDR (2024): 6A05 essential features, additional features and boundaries.",
      "NICE NG87. Attention deficit hyperactivity disorder: diagnosis and management. Recommendations 1.2.2, 1.3.1, 1.3.3.",
      "Adamou M et al. UKAAN AQAS. Front Psychiatry 2024;15:1380410 (developmental history, informants, report content).",
      "Royal College of Psychiatrists. CR235 ADHD in adults: good practice guidelines (2023), sections 9.2, 9.4 and 9.5.",
      "Kooij JJS et al. Updated European Consensus Statement. Eur Psychiatry 2019;56:14-34 (sections 4 and 5.3).",
      "Kooij JJS, Boonstra AM, Swinkels SH et al. J Atten Disord 2008;11:445-458 (reliability and validity of patient and informant rating instruments in adult ADHD).",
      "Kooij JJS, Francken MH. DIVA 2.0 instructions, DIVA Foundation 2010 (structure and collateral rating only; no wording reproduced).",
      "Mannuzza S et al. Accuracy of adult recall of childhood attention deficit hyperactivity disorder. Am J Psychiatry 2002;159:1882-1888.",
      "Ward MF, Wender PH, Reimherr FW. The Wender Utah Rating Scale. Am J Psychiatry 1993;150:885-890. Kouros I et al. WURS-25 in Swedish psychiatric outpatients. Ups J Med Sci 2018;123:230-236.",
      "Sibley MH et al. When diagnosing ADHD in young adults emphasize informant reports, DSM items, and impairment. J Consult Clin Psychol 2012;80:1052-1061.",
      "Moffitt TE et al. Is adult ADHD a childhood-onset neurodevelopmental disorder? Evidence from a four-decade longitudinal cohort study. Am J Psychiatry 2015;172:967-977.",
      "Sibley MH et al. Late-onset ADHD reconsidered with comprehensive repeated assessments between ages 10 and 25. Am J Psychiatry 2018;175:140-149.",
      "Cooper M et al. Investigating late-onset ADHD: a population cohort investigation. J Child Psychol Psychiatry 2018;59:1105-1113.",
      "Bolea-Alamañac B et al. BAP evidence-based guidelines for the pharmacological management of ADHD. J Psychopharmacol 2014;28:179-203.",
      "Faraone SV et al. WFADHD International Consensus Statement: 2026 update. PsyArXiv preprint, October 2026 (not peer reviewed).",
      "Young S et al. Females with ADHD: an expert consensus statement (UKAP). BMC Psychiatry 2020;20:404.",
      "CADDRA. Canadian ADHD Practice Guidelines, 4.1 edition (2020), chapter 1 and Figure 1.5."
    ]
  },

  /* ================================================================== */
  /* Module 7                                                             */
  /* ================================================================== */
  {
    id: "m7", n: 7, minutes: 45,
    title: "Impairment: assessing and rating functional impact",
    summary: "Impairment is what turns traits into a disorder. This module covers what DSM-5-TR, ICD-11 and NICE require, the life areas to cover (including money, driving and safety), how to rate none, mild, moderate or severe with anchors, how to link impairment to symptoms, the hidden costs of compensation, assessing high achievers, using the WFIRS-S, and how to document impairment so that others can rely on it.",
    objectives: [
      "State the impairment requirements of DSM-5-TR criteria C and D, ICD-11, NICE NG87 1.3.3 and UKAAN AQAS, and the difference between settings and domains.",
      "Assess impairment systematically across seven life areas, including finances, driving and safety.",
      "Rate impairment none, mild, moderate or severe using concrete anchors, and link each rating to specific symptoms.",
      "Identify compensation and its hidden costs, and assess high-achieving adults fairly.",
      "Use the WFIRS-S alongside the interview, and document impairment in a way that supports the conclusion."
    ],
    sections: [
      {
        h: "What the criteria require",
        html:
          "<p>Almost everyone has some ADHD-type traits. What makes a disorder is the cost. The NHS England ADHD Taskforce compares ADHD symptoms to blood pressure: a continuum in the population, where the line is drawn by consequences (2025).</p>" +
          "<table><thead><tr><th>Source</th><th>What it asks for</th></tr></thead><tbody>" +
          "<tr><td>DSM-5-TR criterion C</td><td>Several symptoms present in two or more settings, such as home, work or study, with friends or relatives, or in other activities</td></tr>" +
          "<tr><td>DSM-5-TR criterion D</td><td>Clear evidence that the symptoms interfere with, or reduce the quality of, social, academic or occupational functioning</td></tr>" +
          "<tr><td>ICD-11 6A05</td><td>Symptoms severe enough to have a direct negative impact on academic, occupational or social functioning, across multiple settings</td></tr>" +
          "<tr><td>NICE NG87 1.3.3</td><td>At least moderate psychological, social, educational or occupational impairment, based on interview or direct observation in multiple settings; symptoms happening often in 2 or more important settings</td></tr>" +
          "<tr><td>UKAAN AQAS 2024</td><td>At least moderate impairment in at least two domains or settings, including psychological functioning; the report lists the domains (essential)</td></tr>" +
          "</tbody></table>" +
          "<p>The UK bar is therefore higher than the DSM-5-TR wording. Clear but minor interference can satisfy criterion D, but mild impairment alone falls below the NICE threshold. RCPsych calls the impairment threshold a diagnostic requirement (CR235).</p>" +
          "<h4>Settings and domains</h4>" +
          "<p>NICE uses two different words. <strong>Settings</strong> are physical places: home, work, a friend's house. <strong>Domains</strong> are areas of function: relationships, educational and occupational attainment, risk awareness (NG87, Terms used in this guideline). Criterion C is about symptoms showing up in more than one setting. Criterion D is about the damage they do in areas of life. Keep both in your notes.</p>" +
          "<h4>Why impairment deserves care</h4>" +
          "<p>Impairment often tells you more than the symptom count. In young adults diagnosed with ADHD as children, 75% still had elevated symptoms and 60% had clinically significant impairment, yet only about 10 to 20% still met the full DSM-IV-TR symptom criteria (Sibley 2012). Impairment is also what NICE uses to decide on medication: it should be offered if significant impairment persists in at least one domain after environmental modifications have been implemented and reviewed (NG87 1.5.15).</p>" +
          "<p>Formally, DSM-5-TR asks about current impairment. The app also lets you rate childhood impairment in each area. That is not required for criterion B, but it shows the course and supports the history.</p>"
      },
      {
        h: "The life areas to cover",
        html:
          "<p>DIVA rates impairment in five areas: work or study, the partner and family, friendships, leisure, and self-image. The app adds two that are often decisive in adults: daily life, money and admin, and driving, health and safety. Together they match the UKAAN subheadings (education, employment, leisure, family and close relationships, friendships, daily tasks, self-image), the RCPsych list (family, education, life skills, self-concept, social and risk behaviours) and the AADPA checklist, which adds financial, legal and risk domains.</p>" +
          "<table><thead><tr><th>Area</th><th>Questions that open it up</th><th>Typical impairment</th></tr></thead><tbody>" +
          "<tr><td><strong>Work and education</strong></td><td>'Tell me about your jobs since school. How did each one end?'</td><td>Warnings, dismissals, many short jobs, courses dropped, working far longer than colleagues</td></tr>" +
          "<tr><td><strong>Partner and family</strong></td><td>'What do you and your partner most often argue about?'</td><td>Recurring conflict about the same issues, an unequal load at home, separation</td></tr>" +
          "<tr><td><strong>Friends and social contacts</strong></td><td>'What happens to your friendships over time?'</td><td>Friendships lapse after forgotten plans or impulsive remarks; isolation</td></tr>" +
          "<tr><td><strong>Free time and hobbies</strong></td><td>'How do you spend a free evening? Can you relax?'</td><td>Hobbies started and dropped, inability to rest, risky or costly outlets</td></tr>" +
          "<tr><td><strong>Self-confidence and self-image</strong></td><td>'How do you see yourself compared with others?'</td><td>Shame, a sense of failure, avoiding opportunities</td></tr>" +
          "<tr><td><strong>Daily life, money and admin</strong></td><td>'Who pays the bills in your home? What happens to post?'</td><td>Late fees, debt, unopened letters, missed appointments, chaotic home</td></tr>" +
          "<tr><td><strong>Driving, health and safety</strong></td><td>'Have you had accidents, injuries or driving penalties?'</td><td>Crashes, speeding, injuries, risky sex, substance misuse, self-harm</td></tr>" +
          "</tbody></table>" +
          "<p>UKAAN makes questions about employment and education essential, and requires social and home functioning to be explored in all cases (AQAS 2024). For each area, ask about the last six months and about the long-term pattern. A single bad year is not impairment from a lifelong condition.</p>" +
          "<blockquote>'If these difficulties disappeared tomorrow, what would be different in your life?'</blockquote>" +
          "<blockquote>'What have they cost you: jobs, money, relationships, opportunities?'</blockquote>"
      },
      {
        h: "Money, driving and safety: the areas most often missed",
        html:
          "<p>Patients rarely volunteer these areas, and they often carry the most serious consequences. The European Consensus lists accidents, job changes, financial problems, gambling, relationship problems and intimate partner violence, early addiction, self-harm and suicide attempts and criminality among the burdens of adult ADHD (Kooij 2019). CADDRA's red flags include financial difficulty and driving problems such as tickets, accidents and licence loss.</p>" +
          "<h4>Money and admin</h4>" +
          "<ul>" +
          "<li>Late payment charges, overdraft fees, missed bills, unopened post, tax returns and benefit forms not done.</li>" +
          "<li>Impulse spending, subscriptions forgotten, buy-now-pay-later debt, gambling.</li>" +
          "<li>Who manages the money, and why.</li>" +
          "</ul>" +
          "<blockquote>'In the last year, how much have you paid in late fees or charges, roughly?'</blockquote>" +
          "<blockquote>'What happens to letters that look like bills?'</blockquote>" +
          "<h4>Driving</h4>" +
          "<p>ICD-11 gives reckless driving as an example of impulsivity. Ask about crashes, near misses, speeding fines, penalty points, bans, getting lost, and using the phone at the wheel. The Jerome Driving Questionnaire, listed by CADDRA, compares self and collateral reports of driving history and style. A partner's account is often more candid.</p>" +
          "<blockquote>'How many speeding fines or penalty points have you had? Any accidents, even minor ones?'</blockquote>" +
          "<p>Driving also matters after diagnosis. GOV.UK says people must tell the DVLA if their ADHD or ADHD medication affects their ability to drive safely, and need not tell it if driving is not affected. NICE includes driving in the structured post-diagnostic discussion (NG87 1.4.3).</p>" +
          "<h4>Health and safety</h4>" +
          "<ul>" +
          "<li>Injuries and accident and emergency visits; risky sports; unplanned pregnancy and sexual health.</li>" +
          "<li>Substance use to calm down or to sleep; smoking.</li>" +
          "<li>Self-harm and suicide attempts: assess risk in the Safety and risk step.</li>" +
          "<li>Contact with the police or courts.</li>" +
          "<li>Harm from others: exploitation, victimisation and abusive relationships (Young 2020, UKAP ADHD and autism consensus, frames risk as harm to self, to others and from others).</li>" +
          "<li>Parenting: routines, supervision and safety of children. RCPsych asks that parenting roles are explored routinely (CR235 11.6).</li>" +
          "</ul>" +
          "<p>Safety findings can matter more than the diagnosis. Act on them in the Safety and risk step, whatever the ADHD outcome.</p>"
      },
      {
        h: "Rating severity: none, mild, moderate, severe",
        html:
          "<p>Rate each area 0 to 3 for adulthood. The anchors below are the app's working definitions (clinical practice, aligned with the NICE threshold and the DSM-5-TR severity specifiers).</p>" +
          "<table><thead><tr><th>Rating</th><th>General definition</th><th>Work example</th><th>Money example</th></tr></thead><tbody>" +
          "<tr><td><strong>0 None</strong></td><td>No more difficulty than most people of the same age; ordinary slips without real consequences</td><td>Steady work at the expected level</td><td>Bills paid; the odd reminder needed</td></tr>" +
          "<tr><td><strong>1 Mild</strong></td><td>Noticeable but minor; problems soon put right, or extra effort that can be sustained without real cost</td><td>Occasional lateness or a missed deadline that is quickly recovered</td><td>A few late fees a year</td></tr>" +
          "<tr><td><strong>2 Moderate</strong></td><td>Clear, repeated problems with real consequences, or coping only at a high and sustained cost</td><td>A formal warning, poor appraisals, or keeping up only by working evenings and weekends</td><td>Repeated charges, debt, or a partner who has had to take over the finances</td></tr>" +
          "<tr><td><strong>3 Severe</strong></td><td>Marked impairment: major loss or harm, or unable to function in the area without substantial support</td><td>Dismissals, long spells out of work</td><td>Court action, eviction, utilities cut off</td></tr>" +
          "</tbody></table>" +
          "<h4>How the ratings relate to the criteria</h4>" +
          "<ul>" +
          "<li><strong>Moderate</strong> is the NICE NG87 1.3.3 level. UKAAN asks for it in at least two domains or settings (AQAS 2024).</li>" +
          "<li><strong>Mild</strong> can satisfy the DSM-5-TR wording but not the NICE threshold.</li>" +
          "<li>DSM-5-TR severity is a separate judgement. Mild means few, if any, symptoms beyond those required and no more than minor impairment. Severe means many symptoms beyond those required, several particularly severe symptoms, or marked impairment. Moderate lies between.</li>" +
          "</ul>" +
          "<h4>Worked example</h4>" +
          "<p>Dev, 36: work 2 (final written warning for missed deadlines), partner and family 2 (constant conflict about chores and money), friends 1, free time 0, self-image 2, daily life and money 3 (county court judgment for unpaid debts), driving and safety 2 (two crashes and nine penalty points in three years).</p>" +
          "<ul>" +
          "<li>Five areas are at least moderate, so the NICE and UKAAN standards are met.</li>" +
          "<li>One area is severe (marked impairment), which supports a DSM-5-TR severe specifier. The app suggests a specifier from the symptom count and the highest rating; you confirm it.</li>" +
          "<li>The app's live check marks criterion C as met once two areas are affected, and criterion D once any area reaches moderate. Check the UKAAN two-domain standard yourself before you conclude.</li>" +
          "</ul>" +
          "<p>Rate against the person's age, developmental level and ability (AADPA 2022), and against what they could manage without the symptoms. Strengths and protective factors are part of the picture too: record them (AADPA 2022).</p>"
      },
      {
        h: "Linking impairment to symptoms",
        html:
          "<p>Impairment counts only if it flows from the ADHD symptoms. A lost job is not evidence of ADHD unless you can see how inattention, disorganisation or impulsivity caused it. For each rated area, name the symptoms that drive it and how.</p>" +
          "<table><thead><tr><th>Impairment</th><th>ADHD route (counts)</th><th>Other route (does not count for ADHD)</th></tr></thead><tbody>" +
          "<tr><td>Dismissed from a job</td><td>Repeated lateness, missed deadlines and errors over years</td><td>Redundancy; conflict with one manager; absence during a depressive episode</td></tr>" +
          "<tr><td>Debt</td><td>Bills forgotten, impulse spending, forms not done</td><td>Low income, a benefits delay, gambling disorder alone, coercive financial control</td></tr>" +
          "<tr><td>Relationship breakdown</td><td>Forgetting, not listening, interrupting, unequal load at home</td><td>Abuse, infidelity or incompatibility unrelated to symptoms</td></tr>" +
          "<tr><td>Social isolation</td><td>Forgotten plans, late replies, impulsive remarks</td><td>Social anxiety, autism, low mood, moving area</td></tr>" +
          "</tbody></table>" +
          "<h4>Questions that test the link</h4>" +
          "<blockquote>'Walk me through how that job ended. What went wrong first?'</blockquote>" +
          "<blockquote>'If your concentration and organisation had been like other people's, would this still have happened?'</blockquote>" +
          "<blockquote>'Has this happened more than once, in different places?'</blockquote>" +
          "<h4>When other conditions are present</h4>" +
          "<p>Comorbidity is common. When depression, anxiety or substance use add to the impairment, rate the part that the ADHD symptoms explain, and note the rest. Impairment confined to a depressive episode, a period of heavy drinking or a crisis does not support ADHD. Impairment that was there before, between and after episodes does. Module 8 shows how to use a timeline for this.</p>" +
          "<p>Remember the reverse case as well. Kooij (2019) notes that some adults report many symptoms but little impairment, or few symptoms with marked impairment. Insight varies, so seek collateral.</p>"
      },
      {
        h: "Compensation and its hidden costs",
        html:
          "<p>Many adults with ADHD have built a life that works, but only through effort, routines and other people. Scaffolding provided by parents and schools can mask symptoms in childhood (CR235 9.2), and AADPA notes that compensation can mask symptoms in adults (2022). If you rate only outcomes, you will miss these people. Rate the cost of coping as well.</p>" +
          "<table><thead><tr><th>Strategy</th><th>Apparent outcome</th><th>Hidden cost</th></tr></thead><tbody>" +
          "<tr><td>Working 60 hours to produce 40 hours of output</td><td>Good appraisals</td><td>Exhaustion, no leisure, relationship strain, burnout</td></tr>" +
          "<tr><td>Partner as the 'external brain'</td><td>Bills paid, appointments kept</td><td>Resentment, unequal load, collapse when the partner is away</td></tr>" +
          "<tr><td>Dozens of alarms, lists and apps</td><td>Few missed appointments</td><td>Constant vigilance, anxiety, time spent managing the system</td></tr>" +
          "<tr><td>Choosing roles below ability, or turning down promotion</td><td>Stable employment</td><td>Lost income and opportunity, low self-esteem</td></tr>" +
          "<tr><td>Avoiding paperwork, driving or social plans</td><td>No visible failures</td><td>A shrinking life</td></tr>" +
          "<tr><td>Masking at work, especially in women</td><td>Seen as capable</td><td>Exhaustion and a crash at home in the evening (clinical practice; UKAP asks assessors to examine masking and compensatory strategies, Young 2020)</td></tr>" +
          "</tbody></table>" +
          "<h4>The 'remove the support' test</h4>" +
          "<p>Ask what happens when the support falls away: the partner is away for a fortnight, the PA leaves, the job changes, a baby arrives, they leave home, or a routine is disrupted.</p>" +
          "<blockquote>'When your partner was away for two weeks, what happened to the bills, the post and the children's school runs?'</blockquote>" +
          "<blockquote>'How much of your evening goes on keeping your systems running?'</blockquote>" +
          "<blockquote>'What would happen if you stopped working late for a month?'</blockquote>" +
          "<p>Coping only at a high and sustained cost is a moderate rating under the app's anchors. Record the strategy and its cost explicitly, because a reader of the report will otherwise see only success.</p>"
      },
      {
        h: "High achievers",
        html:
          "<p>WFADHD (2021) states that ADHD impairs highly intelligent people and can be diagnosed in them. UKAAN says a diagnosis should not be ruled out simply because of high achievement in some areas, and warns that the label 'high-functioning' may obscure considerable burden (AQAS 2024). The European Consensus calls high intelligence a moderator that leads to under-diagnosis through compensation (Kooij 2019). ICD-11 notes that some people first come to attention when demands exceed their ability to compensate.</p>" +
          "<h4>How to assess fairly</h4>" +
          "<ul>" +
          "<li><strong>Compare with the right reference.</strong> Compare with peers of similar ability and with the person's own potential, not with the general population.</li>" +
          "<li><strong>Look beyond the job.</strong> Achievement at work often coexists with chaos at home, debt, failed relationships or no rest.</li>" +
          "<li><strong>Look for inconsistency.</strong> Brilliant in a crisis, unable to file an expense claim. Top marks in coursework done overnight, failed exams through poor planning.</li>" +
          "<li><strong>Measure the cost.</strong> Hours, help, health and what has been given up.</li>" +
          "<li><strong>Track the change.</strong> Impairment often appears with promotion, management duties, parenthood or the loss of a support.</li>" +
          "</ul>" +
          "<h4>Worked example</h4>" +
          "<p>Helen, 41, a hospital consultant, has a strong publication record. She completes notes after midnight most nights, has been reported twice for late discharge letters, relies on a secretary to run her diary, and her marriage has broken down over the load at home. Her son's school complained that she repeatedly missed parents' evenings. Rate work 2 (formal concerns and a high sustained cost), partner and family 3 (separation linked to symptoms), daily life 2. Her achievement does not cancel this.</p>" +
          "<h4>And the opposite caution</h4>" +
          "<p>Feeling that one has underachieved against high ambitions is not impairment on its own. A student with top grades who wants extra exam time needs the same evidence of real, symptom-linked impairment as anyone else. When an incentive is present, record it and check consistency in the Symptom validity step (clinical practice).</p>"
      },
      {
        h: "Using the WFIRS-S",
        html:
          "<p>Module 4 covers how the WFIRS-S is scored. Here the question is how to use it in the impairment interview.</p>" +
          "<ul>" +
          "<li>It has 69 items in seven domains (family, work, school, life skills, self-concept, social, risk), rated for the <strong>last month</strong> from 0 to 3, or not applicable.</li>" +
          "<li>A domain counts as impaired if 2 or more items are rated 2, or 1 or more item is rated 3, or the domain mean is 1.5 or more (CADDRA scoring guidance).</li>" +
          "<li>It deliberately leaves out ADHD symptom items, so it measures functioning separately from symptoms.</li>" +
          "</ul>" +
          "<h4>What it is good for</h4>" +
          "<ul>" +
          "<li><strong>Finding areas to explore.</strong> Use impaired domains as a map for the interview.</li>" +
          "<li><strong>A baseline.</strong> UKAAN lists the WFIRS as optional, for measuring change (AQAS 2024). A change of about 13 points in the total is considered meaningful (CADDRA 2011).</li>" +
          "<li><strong>Prompting areas patients do not mention,</strong> such as risk and life skills.</li>" +
          "</ul>" +
          "<h4>Its limits</h4>" +
          "<ul>" +
          "<li>It is not specific to ADHD. Internalising symptoms such as depression and anxiety raise the scores (Canu 2020).</li>" +
          "<li>The one-month window may catch a bad patch, not a lifelong pattern.</li>" +
          "<li>Self-reported function can be over- or under-reported.</li>" +
          "<li>UKAAN says the impairment judgement should rest mainly on the interview (AQAS 2024).</li>" +
          "</ul>" +
          "<h4>Reading it against the interview</h4>" +
          "<p>Kai, 30, scores impaired on family (two items rated 2), life skills (one item rated 3) and self-concept (items 3, 2, 2, 1, 2). Work is not impaired on the scale: one item rated 2 and a mean of 0.82. In the interview he describes working until 9pm daily to keep up. The scale missed the cost of compensation, so rate work 2 from the interview. The high self-concept score also prompts a look at mood with the PHQ-9.</p>" +
          "<table><thead><tr><th>Pattern</th><th>Consider</th></tr></thead><tbody>" +
          "<tr><td>High WFIRS-S, little impairment found at interview</td><td>Depression or anxiety, a bad month, over-reporting</td></tr>" +
          "<tr><td>Low WFIRS-S, clear impairment at interview or from informants</td><td>Limited insight, compensation, minimising</td></tr>" +
          "</tbody></table>" +
          "<p>WHODAS 2.0, the WHO disability schedule, is an alternative that RCPsych lists as free and the DHSC review mentions. Neither scale makes the diagnosis.</p>"
      },
      {
        h: "Documenting impairment convincingly",
        html:
          "<p>UKAAN makes it essential to list the domains with at least moderate impairment, and to show how symptoms cause that impairment, with detailed illustrative examples (AQAS 2024). A reader who was not in the room should be able to see why you rated each area as you did.</p>" +
          "<h4>For each area, record</h4>" +
          "<ol>" +
          "<li>The rating, 0 to 3.</li>" +
          "<li>Two or three specific examples, with numbers and dates where possible.</li>" +
          "<li>The symptoms that drive it.</li>" +
          "<li>The cost of any compensation.</li>" +
          "<li>Who corroborates it: an informant, records, appraisals, letters.</li>" +
          "</ol>" +
          "<table><thead><tr><th>Weak</th><th>Strong</th></tr></thead><tbody>" +
          "<tr><td>'Significant problems at work.'</td><td>'Work, moderate: final written warning in March 2026 for missed deadlines (letter seen); works until 9pm most evenings to keep up; colleagues complete his reports. Linked to poor organisation and sustained attention.'</td></tr>" +
          "<tr><td>'Struggles with finances.'</td><td>'Daily life and money, severe: county court judgment in 2025 for unpaid bills; about £400 in late fees in the last year; partner now manages all accounts. Linked to forgetfulness and impulsive spending.'</td></tr>" +
          "<tr><td>'Poor driving.'</td><td>'Driving and safety, moderate: two minor crashes and nine penalty points in three years, confirmed by his partner; distracted by his phone and by his thoughts.'</td></tr>" +
          "</tbody></table>" +
          "<h4>A model summary sentence</h4>" +
          "<blockquote>'Symptoms cause at least moderate impairment in four areas (work, partner and family, daily life and money, driving and safety), with severe impairment in finances. The impairment is long-standing, present across home and work, and corroborated by his partner and an employer's letter. It is not confined to his depressive episode in 2023.'</blockquote>" +
          "<h4>When the threshold is not met</h4>" +
          "<p>Say so plainly, and say what you found. Symptoms with only mild impairment may be subthreshold ADHD. NICE says that people whose symptoms and impairment fall short of a diagnosis may still benefit from information about support (NG87 1.4.4). Record the needs you identified, because support does not have to wait for a diagnosis.</p>"
      }
    ],
    keyPoints: [
      "Impairment is what turns traits into a disorder. NICE NG87 1.3.3 requires at least moderate impairment; DSM-5-TR requires clear interference.",
      "UKAAN asks for at least moderate impairment in at least two domains or settings, and for the report to list them (AQAS 2024).",
      "Settings are places; domains are areas of function. Criterion C is about symptoms across settings; criterion D is about the damage they do.",
      "Cover seven areas, including money, driving and safety, which patients rarely volunteer but which often carry the most serious consequences.",
      "Rate 0 to 3 with concrete anchors. Moderate means clear, repeated consequences, or coping only at a high and sustained cost.",
      "Count only impairment that flows from ADHD symptoms. Impairment confined to an episode of another disorder does not support ADHD.",
      "Compensation hides impairment. Ask what happens when the support is removed, and rate the cost of coping, not only the outcome.",
      "High achievement does not exclude ADHD. Compare with peers of similar ability and look beyond the job.",
      "The WFIRS-S maps areas to explore and gives a baseline, but it is not specific to ADHD; the interview decides."
    ],
    pitfalls: [
      "Rating impairment from outcomes alone and missing people who cope only at great cost.",
      "Accepting adjectives ('significant problems') without specific, dated examples.",
      "Forgetting to ask about money, driving, injuries, risk and parenting.",
      "Counting impairment caused by a depressive episode, heavy substance use, redundancy or poverty as evidence of ADHD.",
      "Ruling out ADHD because of a degree, a profession or good appraisals.",
      "Diagnosing on distress about underachievement without real, symptom-linked impairment.",
      "Treating a raised WFIRS-S as proof of ADHD-related impairment, or a normal one as proof of none.",
      "Relying on the app's live criterion D check without confirming the UKAAN standard of two moderately impaired domains."
    ],
    quiz: [
      { q: "What level of impairment does NICE NG87 1.3.3 require for an ADHD diagnosis?",
        options: ["Any impairment at all", "At least moderate psychological, social, educational or occupational impairment", "Severe impairment in all areas", "Impairment only at work"], a: 1,
        why: "NICE sets the UK bar at at least moderate impairment, based on interview or direct observation in multiple settings, with symptoms happening often in 2 or more important settings." },
      { q: "In NICE NG87's terms, what is the difference between a setting and a domain?",
        options: ["They mean the same thing", "A domain is a symptom cluster; a setting is a diagnosis", "Settings are rated 0 to 3; domains are not rated", "A setting is a physical place such as home or work; a domain is an area of function such as relationships or risk awareness"], a: 3,
        why: "The NG87 glossary defines settings as physical locations and domains as areas of function. Criterion C concerns symptoms across settings; impairment is judged across domains." },
      { q: "Ali, 33, has paid late fees most months for two years, has letters from a debt collector, and his partner has taken over their finances to stop it happening. How should daily life and money be rated?",
        options: ["0 None: lots of people have debts", "1 Mild: problems soon put right", "2 Moderate: repeated problems with real consequences, and reliance on others to keep things running", "3 Severe: marked impairment"], a: 2,
        why: "Repeated charges, debt and a partner taking over fit the moderate anchor. Severe would mean court action, eviction, utilities cut off, or inability to manage without substantial help." },
      { q: "Which describes the DSM-5-TR 'severe' specifier?",
        options: ["Many symptoms beyond those required, several particularly severe symptoms, or marked impairment", "Any impairment in more than two settings", "Symptoms in both childhood and adulthood", "A combined presentation"], a: 0,
        why: "Severe means many symptoms in excess of those required, several particularly severe symptoms, or marked impairment. Mild means few, if any, extra symptoms and no more than minor impairment; moderate lies between." },
      { q: "Helen, 41, is a consultant with an excellent publication record. She writes notes after midnight most nights, has had formal complaints about late letters, and her marriage ended over the load at home. A colleague says ADHD is impossible given her success. What is the best response?",
        options: ["Agree: high achievement excludes ADHD", "Assess impairment against peers of similar ability and the cost of coping, and look beyond work", "Diagnose ADHD because high ability hides it", "Ask for an IQ test before going further"], a: 1,
        why: "UKAAN says ADHD should not be ruled out on high achievement, and 'high-functioning' can obscure burden. WFADHD 2021 states ADHD can be diagnosed in highly intelligent people. Assess fairly; do not assume either way." },
      { q: "Sara, 29, lost her job and fell into debt during an 8-month depressive episode last year. Before and since, she has worked steadily and managed money well. How should this affect the ADHD impairment rating?",
        options: ["Rate work and money as severe", "Rate them as moderate, because the job loss happened", "Do not count it as ADHD-related impairment, because it was confined to a depressive episode", "Average the episode with the good years"], a: 2,
        why: "Impairment counts only when it flows from ADHD symptoms. Problems confined to a mood episode point to that episode, not to a lifelong trait." },
      { q: "On the WFIRS-S family domain (8 items), Ola scores 1, 2, 2, 0, 1, 0, 1, 0. Is the domain impaired by the scale's rule?",
        options: ["Yes: two items are rated 2", "No: the mean is below 1.5", "No: no item is rated 3", "It cannot be scored without the total of all domains"], a: 0,
        why: "A domain is impaired if 2 or more items are rated 2, or 1 or more is rated 3, or the mean is 1.5 or more. Any one rule is enough. Here two items are rated 2, although the mean is only 0.875." },
      { q: "A patient scores high on most WFIRS-S domains, but the interview and his partner describe little real impairment. He has scored 19 on the PHQ-9. What is the most likely explanation?",
        options: ["The interview is always wrong when a scale disagrees", "WFIRS-S scores are specific to ADHD", "The patient must be feigning", "Low mood raises WFIRS-S scores, because the scale is not specific to ADHD"], a: 3,
        why: "Internalising symptoms such as depression and anxiety raise WFIRS-S scores (Canu 2020). The one-month window may also catch a bad patch. The interview carries the main weight (AQAS 2024)." },
      { q: "What does GOV.UK say about ADHD and telling the DVLA?",
        options: ["Everyone diagnosed with ADHD must tell the DVLA", "People must tell the DVLA if their ADHD or ADHD medication affects their ability to drive safely", "Only people with bus or lorry licences need to tell the DVLA", "The clinician must always notify the DVLA directly"], a: 1,
        why: "GOV.UK says you must tell the DVLA if ADHD or its medication affects safe driving; if driving is not affected, you do not need to. NICE NG87 1.4.3 includes driving in the post-diagnostic discussion." },
      { q: "Which statement best reflects the UKAAN AQAS standard for impairment?",
        options: ["At least moderate impairment in at least two domains or settings, with the domains listed in the report", "Any impairment in one domain is enough", "Impairment must be shown on the WFIRS-S", "Impairment must have started before age 12"], a: 0,
        why: "AQAS makes at least moderate impairment in two or more domains or settings, including psychological functioning, essential, and requires the report to list them. Scales support but do not replace the interview." },
      { q: "Jamie appears to cope well: bills paid, appointments kept. When their partner was away for a fortnight, bills went unpaid, the children were late for school every day and Jamie missed a hospital appointment. What does this show?",
        options: ["Nothing: a fortnight is too short", "That the partner is the patient", "That impairment is absent, because things usually work", "That compensation by the partner is hiding impairment, so rate the cost of coping and what happens without the support"], a: 3,
        why: "The 'remove the support' test reveals impairment hidden by scaffolding. Coping only at a high, sustained cost, here an unequal load on the partner, fits a moderate rating under the app's anchors." },
      { q: "Which sentence best documents impairment in a report?",
        options: ["'Significant impairment at work and at home.'", "'Patient reports struggling with everything.'", "'Work, moderate: final written warning in March 2026 for missed deadlines; works until 9pm to keep up; linked to poor organisation; letter seen.'", "'WFIRS-S total is high, so impairment is present.'"], a: 2,
        why: "AQAS asks for detailed illustrative examples that show how symptoms cause at least moderate impairment. Give the rating, specific dated examples, the symptoms involved, the cost of coping and the corroboration." }
    ],
    refs: [
      "American Psychiatric Association. DSM-5-TR (2022): ADHD criteria C and D and severity specifiers, paraphrased.",
      "World Health Organization. ICD-11 CDDR (2024): 6A05.",
      "NICE NG87. Attention deficit hyperactivity disorder: diagnosis and management. Recommendations 1.3.3, 1.4.3, 1.4.4 and 1.5.15, and Terms used in this guideline (settings, domains).",
      "Adamou M et al. UKAAN AQAS. Front Psychiatry 2024;15:1380410 (Theme 1 impairment standards; Theme 3).",
      "Royal College of Psychiatrists. CR235 ADHD in adults: good practice guidelines (2023), section 9 (impairment), 9.2 and 11.6.",
      "Kooij JJS, Francken MH. DIVA 2.0, DIVA Foundation 2010 (five impairment areas; structure only).",
      "Kooij JJS et al. Updated European Consensus Statement. Eur Psychiatry 2019;56:14-34 (sections 3, 4 and 4.1.7).",
      "Faraone SV et al. The World Federation of ADHD International Consensus Statement. Neurosci Biobehav Rev 2021;128:789-818.",
      "CADDRA. Canadian ADHD Practice Guidelines, 4.1 edition (2020), chapter 1 (red flags) and Figure 1.5; CADDRA Toolkit (2011, 2018) and scoring guidance for the WFIRS-S; Jerome Driving Questionnaire.",
      "May T et al. The Australian evidence-based clinical practice guideline for ADHD. Aust N Z J Psychiatry 2023;57:1101-1116; AADPA Diagnosis Checklist factsheet (2024).",
      "Sibley MH et al. When diagnosing ADHD in young adults emphasize informant reports, DSM items, and impairment. J Consult Clin Psychol 2012;80:1052-1061.",
      "Weiss MD. Weiss Functional Impairment Rating Scale, self-report (WFIRS-S), CADDRA version. Canu WH et al. J Atten Disord 2020;24:1648.",
      "World Health Organization. WHO Disability Assessment Schedule 2.0 (WHODAS 2.0), 2010.",
      "GOV.UK. ADHD and driving (DVLA guidance).",
      "Young S et al. Females with ADHD: UKAP consensus. BMC Psychiatry 2020;20:404. Young S et al. ADHD and autism: UKAP consensus. BMC Med 2020;18:146.",
      "NHS England. Report of the independent ADHD Taskforce, Part 1 (2025)."
    ]
  },

  /* ================================================================== */
  /* Module 8                                                             */
  /* ================================================================== */
  {
    id: "m8", n: 8, minutes: 55,
    title: "Differential diagnosis I: psychiatric conditions",
    summary: "How to decide whether another psychiatric condition co-occurs with ADHD or better explains the picture. Covers the logic of criterion E, the timeline (life chart) method, depression and persistent depressive disorder, the bipolar spectrum and how to tell hypomania from ADHD, anxiety disorders, PTSD and complex trauma, emotionally unstable personality disorder versus ADHD emotional dysregulation, psychosis and OCD, with worked comparisons.",
    objectives: [
      "Apply the logic of 'co-occurring' versus 'better explained by' and reach one of four verdicts for each condition.",
      "Build and interpret a life-course timeline that separates trait-like ADHD from episodic or acquired conditions.",
      "Distinguish ADHD from depression, persistent depressive disorder, hypomania and cyclothymia using onset, course, sleep and the quality of mood change.",
      "Distinguish ADHD from anxiety disorders, PTSD and complex PTSD, and from emotionally unstable personality disorder, using discriminating questions.",
      "Recognise when psychotic or obsessive-compulsive features change the diagnosis or the order of treatment, and document the differential clearly."
    ],
    sections: [
      {
        h: "Co-occurring or better explained? The logic",
        html:
          "<p>Comorbidity is the rule in adult ADHD. In the WHO World Mental Health surveys, 51.7% of adults with ADHD had at least one other mental disorder in the past year (Fayyad 2017). Lifetime comorbidity is 60 to 80% (Kooij 2019). A comorbid diagnosis does not rule out ADHD (WFADHD 2021), and NICE asks for symptoms 'not explained by other psychiatric diagnoses (although there may be other coexisting psychiatric conditions)' (NG87 1.2.10).</p>" +
          "<h4>What the classifications say</h4>" +
          "<ul>" +
          "<li><strong>DSM-5-TR criterion E:</strong> symptoms do not occur only during schizophrenia or another psychotic disorder, and are not better explained by another mental disorder, such as a mood, anxiety, dissociative or personality disorder, or substance intoxication or withdrawal. Autism is no longer an exclusion.</li>" +
          "<li><strong>ICD-11:</strong> not better accounted for by another mental disorder, and not due to a substance, a medicine or a disease of the nervous system.</li>" +
          "<li><strong>UKAAN:</strong> 'ADHD should not be diagnosed when another condition better explains the presenting symptoms and impairments', and the report must state that the symptoms are not better explained by another disorder, which is a distinct criterion (AQAS 2024).</li>" +
          "<li><strong>RCPsych:</strong> separate trait-based conditions (ADHD, EUPD, autism) from state-based conditions with more discrete onsets (depression, bipolar disorder, anxiety) (CR235 9.7).</li>" +
          "</ul>" +
          "<h4>The questions to ask of every candidate condition</h4>" +
          "<ol>" +
          "<li><strong>Is it present,</strong> now or in the past, on clinical criteria rather than a screen?</li>" +
          "<li><strong>Onset:</strong> were several ADHD symptoms present before 12, and before the other condition began?</li>" +
          "<li><strong>Course:</strong> are ADHD symptoms trait-like, or do they rise and fall with the other condition?</li>" +
          "<li><strong>Persistence without it:</strong> are ADHD symptoms present when the other condition is absent: in euthymia, low-anxiety periods, abstinence, before the trauma?</li>" +
          "<li><strong>Pervasiveness:</strong> across settings and emotional states, or only in situations tied to the other condition?</li>" +
          "<li><strong>Qualitative features</strong> that belong only to the other condition: grandiosity, flashbacks, fear of abandonment, hallucinations.</li>" +
          "<li><strong>Collateral:</strong> does someone who knew the person in childhood confirm the timeline?</li>" +
          "</ol>" +
          "<p>These questions put criterion E into practice (the app's method, built from Kooij 2019, CADDRA, ICD-11 and CR235). They lead to one of four verdicts for each condition, which you record in the Differential diagnosis step:</p>" +
          "<table><thead><tr><th>Verdict</th><th>When</th></tr></thead><tbody>" +
          "<tr><td><strong>Absent</strong></td><td>The condition is not present now or in the relevant past</td></tr>" +
          "<tr><td><strong>Co-occurring</strong></td><td>Present, but ADHD criteria are met independently: symptoms predate it and persist without it</td></tr>" +
          "<tr><td><strong>Better explains</strong></td><td>Present, and the ADHD-like symptoms are confined to it, with no independent childhood history. Do not diagnose ADHD now</td></tr>" +
          "<tr><td><strong>Uncertain</strong></td><td>Cannot yet be separated. Treat or stabilise the other condition, then reassess, or refer</td></tr>" +
          "</tbody></table>" +
          "<p>Screening scales trigger this process. They never settle it. The Differential protocol walks you through it step by step.</p>"
      },
      {
        h: "The timeline (life chart) method",
        html:
          "<p>The life chart was developed to map the course of mood disorders over time (Post 1988). In an ADHD assessment it turns the criterion E questions into a picture. It is the single most useful tool in the differential.</p>" +
          "<h4>How to draw it</h4>" +
          "<p>Draw a horizontal line for age, from preschool to now, marked with life stages: primary school, secondary school, further study, jobs, relationships, children. Then add rows (lanes) beneath it:</p>" +
          "<ul>" +
          "<li>ADHD symptoms, with examples and the source for each stage.</li>" +
          "<li>Impairment in each area.</li>" +
          "<li>Mood episodes: depressive, hypomanic or manic, with dates and duration.</li>" +
          "<li>Anxiety, obsessions and compulsions, trauma exposure and trauma symptoms.</li>" +
          "<li>Substance use: onset, peak and abstinent periods.</li>" +
          "<li>Sleep, physical health and medicines.</li>" +
          "<li>Life events, stresses and supports.</li>" +
          "</ul>" +
          "<blockquote>'Let's draw your life as a line. Where were things at their best? Where were they at their worst? What was going on at each point?'</blockquote>" +
          "<h4>How to read it</h4>" +
          "<ul>" +
          "<li>Were the ADHD lanes active when the other lanes were empty?</li>" +
          "<li>Did ADHD-like symptoms start, or worsen only, with an episode or exposure?</li>" +
          "<li>Did they return to the person's usual level when the episode ended?</li>" +
          "</ul>" +
          "<p>Temporal order usually favours ADHD. In the WHO surveys, ADHD began first in 86% of comorbid mood disorders and 99% of comorbid substance use disorders (Fayyad 2017). So ADHD-like symptoms that begin only after another disorder deserve extra scrutiny.</p>" +
          "<h4>Worked example: Nadia, 35</h4>" +
          "<table><thead><tr><th>Age</th><th>ADHD lane</th><th>Mood lane</th><th>Other lanes</th></tr></thead><tbody>" +
          "<tr><td>5 to 11</td><td>Daydreaming, lost belongings; reports say 'often far away'</td><td>None</td><td>Slow to settle at night</td></tr>" +
          "<tr><td>12 to 16</td><td>Homework missed, disorganised</td><td>None</td><td>Parents separated at 14</td></tr>" +
          "<tr><td>17 to 21</td><td>Left university in Year 2</td><td>Depressive episode at 20 (4 months)</td><td>Weekend binge drinking</td></tr>" +
          "<tr><td>22 to 30</td><td>Five jobs; late, missed deadlines</td><td>Episode at 27 (6 months); well between</td><td>Drinking reduced</td></tr>" +
          "<tr><td>31 to 35</td><td>Disorganised and forgetful when mood is good (partner confirms)</td><td>Euthymic now; PHQ-9 is 6</td><td>Sleep fine</td></tr>" +
          "</tbody></table>" +
          "<p>The ADHD lane is active from primary school onwards and stays active between episodes. Depression is episodic and began later. Verdict: recurrent depression <strong>co-occurring</strong>. Assess the ADHD symptoms now, while she is well.</p>"
      },
      {
        h: "Depression and persistent depressive disorder",
        html:
          "<p>Poor concentration, indecision, restlessness, irritability, poor sleep, low motivation and low self-esteem occur in both. In the US National Comorbidity Survey Replication, 18.6% of adults with ADHD had major depression and 12.8% dysthymia in the past year (Kessler 2006). The DHSC review warns that untreated ADHD may be mistaken for anxiety or depression alone (2026).</p>" +
          "<table><thead><tr><th>Feature</th><th>Favours ADHD</th><th>Favours depression</th></tr></thead><tbody>" +
          "<tr><td>Onset</td><td>Concentration problems since childhood, before any low mood</td><td>A recent change: 'since when?' has a clear answer (CADDRA)</td></tr>" +
          "<tr><td>Course</td><td>Continuous, trait-like</td><td>Episodic, with return to the usual self</td></tr>" +
          "<tr><td>Motivation</td><td>Low for boring tasks; still enjoys interesting things</td><td>Loss of interest and pleasure in almost everything</td></tr>" +
          "<tr><td>Mood</td><td>Demoralised by repeated failure; brightens when things go well</td><td>Pervasive sadness or hopelessness</td></tr>" +
          "<tr><td>Sleep</td><td>Hard to get off because the mind will not switch off</td><td>Early waking; appetite and weight change</td></tr>" +
          "<tr><td>Energy</td><td>Restless</td><td>Tired, slowed down</td></tr>" +
          "</tbody></table>" +
          "<p>CADDRA notes that the amotivation of ADHD can mimic anhedonia. ICD-11 says restlessness and poor concentration during a depressive episode count towards ADHD only if they were present since childhood and persist after the episode resolves.</p>" +
          "<h4>Discriminating questions</h4>" +
          "<blockquote>'Think of a time when your mood was good. Were you still disorganised, forgetful or restless then?'</blockquote>" +
          "<blockquote>'When you are low, do you lose interest in everything, even things you love, or only in dull tasks?'</blockquote>" +
          "<blockquote>'When the low periods lifted in the past, did the concentration problems go away completely, or stay as they always were?'</blockquote>" +
          "<h4>Persistent depressive disorder</h4>" +
          "<p>Here the course does not help, because both are chronic. Look at what came first and what drives what. In persistent depressive disorder, depressed mood is present most of the day, on more days than not, for at least two years, and stays low even when circumstances are good. In ADHD, mood is reactive and lifts with success. Long-standing low self-esteem that follows a life story of failure and criticism points to demoralisation secondary to ADHD (Kooij 2019; clinical practice).</p>" +
          "<h4>Screening and order of treatment</h4>" +
          "<ul>" +
          "<li>PHQ-9 items on sleep, energy, concentration, restlessness and feeling a failure can all be driven by ADHD. Look at the core items on mood and anhedonia, and ask whether each item is new. Act on item 9 in the Safety and risk step.</li>" +
          "<li>Major mood disorders should be treated before assessing for ADHD (CR235). Severe depression is usually treated first (Kooij 2019).</li>" +
          "<li>In dysthymia, CR235 suggests treating ADHD first; CADDRA says ADHD may be treated first in mild depression.</li>" +
          "</ul>"
      },
      {
        h: "The bipolar spectrum: telling hypomania from ADHD",
        html:
          "<p>Distractibility, talkativeness, restlessness, impulsive spending, risk-taking, irritability and poor sleep occur in both. RCPsych notes that ADHD can mimic mania, with restlessness, excitement and loud, pressured speech, and advises exploring the time course with a third party (CR235 9.7.1). About 8% of adults with ADHD have bipolar disorder, and about 17% of adults with bipolar disorder have ADHD (WFADHD 2026 update, preprint, summarising 71 studies).</p>" +
          "<p>The key is <strong>episodicity</strong>. ICD-11 says that late onset, episodicity and intensity of mood elevation point to bipolar disorder. DSM-5-TR requires a hypomanic episode to last at least 4 consecutive days, and a manic episode at least a week, as a clear change from the person's usual self.</p>" +
          "<table><thead><tr><th>Feature</th><th>ADHD</th><th>Hypomania or mania</th></tr></thead><tbody>" +
          "<tr><td>Course</td><td>Chronic, since childhood</td><td>Discrete episodes with a start and an end</td></tr>" +
          "<tr><td>Sleep</td><td>Trouble getting to sleep, then tired the next day</td><td>Decreased need for sleep without feeling tired</td></tr>" +
          "<tr><td>Mood</td><td>Reactive shifts lasting hours, within a normal range</td><td>Elated, expansive or irritable for days, out of character</td></tr>" +
          "<tr><td>Self-esteem</td><td>Usually low or ordinary</td><td>Grandiosity</td></tr>" +
          "<tr><td>Speech and thought</td><td>Always chatty; a busy, wandering mind</td><td>Pressured speech, racing thoughts beyond the usual</td></tr>" +
          "<tr><td>Behaviour</td><td>Habitual impulsive purchases and encounters</td><td>A clear change: large spending sprees, hypersexuality, reckless plans</td></tr>" +
          "<tr><td>Collateral</td><td>'They have always been like this'</td><td>'They were not themselves'</td></tr>" +
          "</tbody></table>" +
          "<p>Sources: CADDRA 4.1; Kooij 2019; ICD-11 CDDR.</p>" +
          "<h4>Discriminating questions</h4>" +
          "<blockquote>'Have you ever had several days when you needed only three or four hours' sleep but felt full of energy, not tired?'</blockquote>" +
          "<blockquote>'Did other people say you were not your normal self? How long did it last, and how did it end?'</blockquote>" +
          "<blockquote>'Between those spells, were you still distractible, late and disorganised, as you were at school?'</blockquote>" +
          "<blockquote>'Has an antidepressant ever made you feel wired, euphoric or unable to sleep?'</blockquote>" +
          "<p>Also ask about family history of bipolar disorder and about psychotic symptoms during any episode.</p>" +
          "<h4>Cyclothymia</h4>" +
          "<p>Cyclothymia involves at least two years of numerous periods of hypomanic and depressive symptoms that do not meet full episode criteria (DSM-5-TR concept). Kooij (2019) notes that ADHD mood lability is often confused with it. In ADHD, emotional reactions are short-lived and return to baseline within a few hours. Mood shifts that last days, and often arrive without a trigger, point to cyclothymia (clinical practice).</p>" +
          "<h4>The MDQ trap</h4>" +
          "<p>About half of adults with ADHD screen positive on the Mood Disorder Questionnaire (50.2% versus 5% of controls; Lundervold 2020), because many items describe ADHD traits. A positive MDQ needs interview evidence of discrete episodes. NICE CG185 advises against using questionnaires in primary care to identify bipolar disorder in adults.</p>" +
          "<h4>When both are present</h4>" +
          "<p>In comorbid cases, ADHD symptoms remain apparent between mood episodes (Asherson 2014). Stabilise bipolar disorder first. In a pharmaco-epidemiological study cited by Kooij (2019), methylphenidate alone in bipolar disorder raised the risk of a switch to mania (hazard ratio 6.7), while methylphenidate combined with a mood stabiliser was linked to a lower risk (hazard ratio 0.6) (Viktorin 2016). Refer to psychiatry if bipolar disorder is suspected.</p>"
      },
      {
        h: "Anxiety disorders",
        html:
          "<p>Anxiety is common in ADHD: 47.1% of adults with ADHD had an anxiety disorder in the past year in the NCS-R, most often social anxiety (29.3%) (Kessler 2006). CADDRA estimates that up to about half of adults with ADHD have comorbid anxiety.</p>" +
          "<table><thead><tr><th>Feature</th><th>Favours ADHD</th><th>Favours anxiety</th></tr></thead><tbody>" +
          "<tr><td>Inattention</td><td>Present whatever the emotional state</td><td>Present only when anxious</td></tr>" +
          "<tr><td>Social style</td><td>Disinhibited: interrupts, says things without thinking</td><td>Inhibited: holds back, avoids</td></tr>" +
          "<tr><td>Night-time</td><td>Cannot switch off from many unrelated thoughts</td><td>Ruminates on the same worries</td></tr>" +
          "<tr><td>Body</td><td>Restless, but no physical anxiety symptoms</td><td>Palpitations, nausea, breathlessness, tremor</td></tr>" +
          "<tr><td>Worry</td><td>Realistic, tied to real failures ('I'll forget again')</td><td>Excessive, about many things that might go wrong</td></tr>" +
          "</tbody></table>" +
          "<p>Source: CADDRA 4.1 differentiation table, paraphrased. ICD-11 adds that inattention must not be solely due to anxious preoccupation or occur only in anxiety-provoking situations.</p>" +
          "<h4>Specific patterns</h4>" +
          "<ul>" +
          "<li><strong>Generalised anxiety:</strong> worry spreads across many areas and is hard to control. Ask what fills the mind when concentration fails: one worry going round, or many unrelated thoughts?</li>" +
          "<li><strong>Social anxiety:</strong> fear of scrutiny and humiliation, with anticipatory dread. In ADHD, social difficulties come from missed cues, forgotten plans and impulsive remarks. Social anxiety may suppress visible impulsivity and delay recognition of ADHD (Katzman 2017).</li>" +
          "<li><strong>Panic disorder:</strong> discrete surges of intense fear that peak within minutes. Attention problems confined to attacks and anticipatory worry point to panic disorder.</li>" +
          "<li><strong>Anxiety caused by ADHD:</strong> worry about forgetting, and compensatory checking, can be misread as primary anxiety (CADDRA).</li>" +
          "</ul>" +
          "<blockquote>'On a calm, worry-free day, are you still distractible, late or losing things?'</blockquote>" +
          "<blockquote>'In groups, what makes it hard: fear of being judged, or drifting off and losing the thread?'</blockquote>" +
          "<p>On the GAD-7, the items about trouble relaxing, restlessness and irritability overlap with ADHD. Severe anxiety is usually treated first (Kooij 2019). Otherwise treat the most impairing condition first; stimulants may increase anxiety at the start, so titrate slowly (CADDRA).</p>"
      },
      {
        h: "PTSD and complex trauma",
        html:
          "<p>Hyperarousal, poor concentration, irritability, sleep problems, restlessness, risk-taking and dissociative 'zoning out' all overlap with ADHD (CADDRA). ICD-11 notes that trauma and grief can produce ADHD-like symptoms. The association runs both ways: in a meta-analysis, PTSD was about three times more likely in people with ADHD, and ADHD was more common in people with PTSD (relative risk about 1.7) (Spencer 2016). RCPsych asks for a trauma-informed approach and notes that trauma, PTSD and EUPD can mask ADHD (CR235 11.5).</p>" +
          "<h4>Complex PTSD</h4>" +
          "<p>ICD-11 complex PTSD adds disturbances in self-organisation to PTSD: severe problems regulating emotion, a persistently negative self-concept and difficulty sustaining relationships, usually after prolonged or repeated trauma from which escape was difficult. These closely resemble ADHD emotional dysregulation, demoralisation and relationship strain.</p>" +
          "<table><thead><tr><th>Favours ADHD</th><th>Favours PTSD or complex PTSD</th></tr></thead><tbody>" +
          "<tr><td>Symptoms documented before the trauma (school reports, family)</td><td>Onset or clear worsening after the trauma</td></tr>" +
          "<tr><td>Inattention in safe, calm settings</td><td>Attention captured by threat or intrusive memories</td></tr>" +
          "<tr><td>Mind wanders to more interesting things</td><td>Re-experiencing in the here and now: flashbacks, nightmares</td></tr>" +
          "<tr><td>No avoidance of reminders</td><td>Deliberate avoidance; hypervigilance; exaggerated startle</td></tr>" +
          "<tr><td>Brief reactive irritability</td><td>Dissociation under stress; pervasive shame and worthlessness</td></tr>" +
          "</tbody></table>" +
          "<h4>Asking safely</h4>" +
          "<p>Ask permission, explain why you are asking, and do not probe for details you do not need (clinical practice).</p>" +
          "<blockquote>'Some people have been through frightening or harmful experiences, including in childhood. Has anything like that happened to you? You don't need to give me details.'</blockquote>" +
          "<blockquote>'When you lose focus, is your mind pulled back to what happened, or towards something more interesting?'</blockquote>" +
          "<blockquote>'Were the concentration problems there before those events? What do your early school reports say?'</blockquote>" +
          "<h4>Screens and their traps</h4>" +
          "<ul>" +
          "<li><strong>PCL-5:</strong> a score of 31 to 33 suggests probable PTSD. Items on irritability, risk-taking, concentration, sleep and memory gaps can be raised by ADHD. A high hyperarousal score with few intrusion or avoidance items should prompt the question: were these present before the trauma?</li>" +
          "<li><strong>ITQ:</strong> use the diagnostic algorithm, not cut-offs. Disturbances in self-organisation count only if PTSD criteria are also met, which protects against relabelling ADHD emotional dysregulation as complex PTSD.</li>" +
          "</ul>" +
          "<h4>Decision</h4>" +
          "<p>A trauma history does not automatically rule out ADHD (CADDRA). If ADHD symptoms predate the trauma, record <strong>co-occurring</strong>. If none predate it and the symptoms are driven by intrusions, avoidance and threat, PTSD <strong>better explains</strong> them. When trauma began in early childhood and no one can describe the person before it, record <strong>uncertain</strong>, offer trauma-focused treatment and reassess.</p>"
      },
      {
        h: "Emotionally unstable personality disorder and ADHD emotional dysregulation",
        html:
          "<p>This is the hardest psychiatric differential, because both conditions are long-standing, so course does not separate them (Kooij 2019). Both involve impulsivity, mood lability, anger, relationship difficulties and boredom. Emotional dysregulation is an associated feature of ADHD, not a criterion (DSM-5, cited in Kooij 2019), and RCPsych reports affective instability in up to 90% of adults with ADHD (CR235 9.3). Lifetime borderline personality disorder was found in 33.7% of people with ADHD against 5.2% of the general population (NESARC, cited by CADDRA), and 30 to 60% of people with BPD may have ADHD (Ditrich 2021). Women with ADHD are at particular risk of misdiagnosis (NICE NG87 1.2.2; CR235 9.2).</p>" +
          "<table><thead><tr><th>Feature</th><th>ADHD</th><th>EUPD / BPD</th></tr></thead><tbody>" +
          "<tr><td>Emotional reactions</td><td>Quick to flare, short-lived, back to baseline within hours</td><td>Intense, often triggered by perceived rejection, can last longer</td></tr>" +
          "<tr><td>Impulsivity</td><td>Thoughtless rather than driven; present even when content</td><td>Often driven by emotional pain; stress-dependent</td></tr>" +
          "<tr><td>Relationships</td><td>Strain from forgetting, not listening, interrupting</td><td>Intense, unstable, swinging between idealising and devaluing; frantic efforts to avoid abandonment</td></tr>" +
          "<tr><td>Sense of self</td><td>Stable, though often low</td><td>Identity disturbance, rapid shifts in self-image</td></tr>" +
          "<tr><td>Inner experience</td><td>Restless, bored</td><td>Chronic emptiness</td></tr>" +
          "<tr><td>Self-harm</td><td>Possible, usually less central</td><td>Recurrent suicidal behaviour, threats or self-harm</td></tr>" +
          "<tr><td>Under stress</td><td>Overwhelmed, disorganised</td><td>Transient paranoia or severe dissociation</td></tr>" +
          "<tr><td>Childhood</td><td>Inattention and restlessness at primary school</td><td>Difficulties usually emerge from adolescence (clinical practice); childhood adversity is common in both (Ditrich 2021)</td></tr>" +
          "</tbody></table>" +
          "<p>Sources: Kooij 2019; CADDRA 4.1; Ditrich 2021; Asherson 2014.</p>" +
          "<p>Kooij (2019) notes that in ADHD, relationship conflict, suicidal preoccupation, self-harm, identity disturbance and fears of abandonment are usually less intense than in BPD. Emotion regulation difficulties are greatest when both conditions are present (Ditrich 2021).</p>" +
          "<h4>Discriminating questions</h4>" +
          "<blockquote>'When a relationship is going badly, what happens inside you? Do you feel terrified of being left?'</blockquote>" +
          "<blockquote>'Do you have a steady sense of who you are and what you want, or does it change a lot?'</blockquote>" +
          "<blockquote>'Are your impulsive acts mostly a response to emotional pain, or do they happen even when you are content, like blurting things out or buying on a whim?'</blockquote>" +
          "<blockquote>'When you get angry, how long does it last, and how quickly do you calm down?'</blockquote>" +
          "<p>The MSI-BPD (positive at 7 or more of 10) shares items on impulsivity, anger, mood and relationships with ADHD, so use it as a prompt only. Both diagnoses can be made, and they are treated as separate problems: improving ADHD does not resolve BPD (CADDRA). Dialectical behaviour therapy has the strongest support for BPD (CADDRA). Ask about safety in every case.</p>"
      },
      {
        h: "Psychosis and OCD",
        html:
          "<h4>Psychosis</h4>" +
          "<p>Psychotic symptoms are not features of ADHD and represent a comorbid diagnosis (CR235 9.7.9). Under DSM-5-TR criterion E, ADHD is not diagnosed if symptoms occur only during a psychotic disorder. The prodrome is the trap: poor concentration, falling performance, social withdrawal, sleep change and disorganisation can look like ADHD.</p>" +
          "<ul>" +
          "<li><strong>Favours psychosis or a prodrome:</strong> a new decline from a previously good level, abrupt onset in adolescence or adulthood (ICD-11), unusual perceptions or beliefs, suspiciousness, muddled thinking, flattened affect, a family history of psychosis, heavy cannabis or stimulant use.</li>" +
          "<li><strong>Favours ADHD:</strong> a lifelong, stable pattern. The 'racing thoughts' of ADHD are many ordinary, unrelated thoughts with no abnormal content (Kooij 2019).</li>" +
          "</ul>" +
          "<blockquote>'Have you noticed your thinking becoming muddled in a new way, or felt that people were watching you or against you?'</blockquote>" +
          "<p>Childhood ADHD is associated with a higher risk of later psychotic disorder (pooled relative effect 4.74; Nourredine 2021), so the two can co-occur. New psychosis on prescription stimulants occurred in about 1 in 660 young people in a large US study, more often with amphetamine (Moran 2019). On the PQ-16, 6 or more items endorsed warrants a clinical interview; items about being distracted by faint sounds can be endorsed for non-psychotic reasons. Refer suspected psychosis or an at-risk mental state urgently to early intervention services (clinical practice). Active psychosis is treated first (Kooij 2019).</p>" +
          "<h4>Obsessive-compulsive disorder</h4>" +
          "<p>Attention captured by obsessions can look like distractibility, and slowness, unfinished tasks and checking occur in both. ADHD-like symptoms caused by OCD may be misdiagnosed as ADHD, and reported co-occurrence rates are inconsistent (Abramovitch 2015).</p>" +
          "<table><thead><tr><th>Favours ADHD</th><th>Favours OCD</th></tr></thead><tbody>" +
          "<tr><td>Checks because they know they forget</td><td>Checks to prevent a feared outcome, by rules, until it 'feels right'</td></tr>" +
          "<tr><td>Distracted by outside stimuli and novelty</td><td>Distracted by intrusive, unwanted thoughts</td></tr>" +
          "<tr><td>Slow because they drift to other tasks</td><td>Slow because they repeat or perfect</td></tr>" +
          "<tr><td>Risk-taking, novelty-seeking</td><td>Cautious, harm-avoidant</td></tr>" +
          "</tbody></table>" +
          "<blockquote>'When you check the door, what is in your mind: that you probably forgot, or that something terrible will happen if you don't?'</blockquote>" +
          "<p>Treat both when both are present. Stimulants do not usually worsen OCD (CADDRA). Ask about tics, because OCD and tics often travel together.</p>"
      },
      {
        h: "Worked comparisons and writing it up",
        html:
          "<h4>1. Better explained: Owen, 40</h4>" +
          "<p>Referred with poor concentration for three years. He worries about money, health and his children most of the day and has palpitations and tension. Concentration is fine on calm weekends. Primary school reports describe 'a careful, conscientious boy', and his mother recalls a quiet, settled child. GAD-7 is 17. <strong>Verdict: generalised anxiety disorder better explains the symptoms.</strong> ADHD is not diagnosed. Treat the anxiety, and give information about support (NG87 1.4.4).</p>" +
          "<h4>2. Co-occurring: Ella, 27</h4>" +
          "<p>Lifelong distractibility, lost belongings and unfinished work, confirmed by school reports and her father. At 22 and 25 she had spells of about ten days of sleeping three hours a night without tiredness, spending £6,000, and grand business plans; her partner says she 'was not herself'. At 23 she had a four-month depressive episode. Between spells she is her usual disorganised self. MDQ positive. <strong>Verdict: hypomanic episodes suggest bipolar II disorder, co-occurring with ADHD.</strong> Refer to psychiatry and stabilise mood before any ADHD medication.</p>" +
          "<h4>3. Uncertain: Jess, 23</h4>" +
          "<p>Care-experienced after neglect and abuse from infancy. Nightmares, hypervigilance, dissociation under stress and poor concentration. No informant knew her before the trauma, and school records begin at 9 with reports of 'switching off'. ITQ meets the complex PTSD algorithm. <strong>Verdict: uncertain.</strong> Offer trauma-focused treatment and reassess ADHD afterwards.</p>" +
          "<h4>4. Both: Kim, 30</h4>" +
          "<p>Primary school reports describe a restless, chatty child who rarely finished work. From 15, intense, unstable relationships, fear of abandonment, chronic emptiness and repeated self-harm after rejection. Inattention and restlessness are present even in calm periods, and her sister confirms both patterns. <strong>Verdict: ADHD and EUPD co-occurring.</strong> Plan treatment for each, with a safety plan.</p>" +
          "<h4>Writing the differential</h4>" +
          "<ul>" +
          "<li>Review every core condition in every adult assessment. In the app these are depression, bipolar disorder, generalised anxiety, PTSD, EUPD, autism, alcohol and cannabis use, insomnia and sleep apnoea. Module 9 covers the non-psychiatric differentials and substances.</li>" +
          "<li>For each, record the verdict and the evidence: onset, course, persistence without it, qualitative features and collateral.</li>" +
          "<li>State absent conditions explicitly, as UKAAN recommends.</li>" +
          "<li>Include the criterion E sentence, for example: 'The symptoms began in childhood, persist between depressive episodes and are not better explained by another disorder.'</li>" +
          "<li>Where a verdict is uncertain, say what will resolve it and when you will review.</li>" +
          "</ul>"
      }
    ],
    keyPoints: [
      "Comorbidity is the rule: about half of adults with ADHD have another current disorder. It does not rule out ADHD.",
      "For each condition reach one of four verdicts: absent, co-occurring, better explains, or uncertain. The report must state that symptoms are not better explained by another disorder (AQAS 2024).",
      "Separate trait from state. ADHD is trait-like from childhood; depression, bipolar disorder and anxiety usually have discrete onsets and episodes (CR235 9.7).",
      "Draw a timeline. Ask whether ADHD symptoms were present before, between and after episodes of the other condition.",
      "Concentration problems during a depressive episode count towards ADHD only if present since childhood and persisting after recovery (ICD-11).",
      "Hypomania differs from ADHD by episodes of at least several days, decreased need for sleep without tiredness, elation or grandiosity, and a change others notice. About half of adults with ADHD screen MDQ positive.",
      "Anxiety-driven inattention occurs only when anxious; ADHD inattention occurs whatever the emotional state.",
      "Trauma and ADHD often co-occur. Look for symptoms before the trauma and for re-experiencing, avoidance and threat; use the ITQ algorithm, not cut-offs.",
      "ADHD emotional reactions are brief and return to baseline within hours; abandonment fear, identity disturbance, emptiness and recurrent self-harm point to EUPD. Both can be diagnosed.",
      "Psychotic symptoms are never part of ADHD. Refer urgently, and treat psychosis, bipolar disorder and severe depression or anxiety first."
    ],
    pitfalls: [
      "Diagnosing ADHD from symptoms counted during a depressive, hypomanic or anxious episode.",
      "Treating a positive MDQ, PCL-5 or MSI-BPD as a diagnosis, when ADHD alone raises scores on all three.",
      "Missing hypomania because you did not ask about decreased need for sleep, spells of being 'not themselves' or antidepressant-induced highs.",
      "Labelling ADHD emotional dysregulation as EUPD, especially in women, without checking for abandonment fear, identity disturbance and emptiness.",
      "Assuming a trauma history rules ADHD out, or ignoring trauma that better explains the picture.",
      "Taking 'racing thoughts' at face value without asking about their content and whether they come in episodes.",
      "Starting ADHD medication before stabilising bipolar disorder, psychosis or severe depression.",
      "Writing 'no comorbidity' without stating which conditions were considered and why each was judged absent."
    ],
    quiz: [
      { q: "In the WHO World Mental Health surveys, about what proportion of adults with ADHD had at least one other mental disorder in the past year?",
        options: ["About 5%", "About half (51.7%)", "About 90%", "Almost none, because comorbidity excludes ADHD"], a: 1,
        why: "Fayyad 2017 found 51.7%. Lifetime figures in clinics are 60 to 85% (Kooij 2019; CADDRA). Comorbidity does not rule out ADHD (WFADHD 2021)." },
      { q: "In the WHO surveys, ADHD began before 86% of comorbid mood disorders and 99% of substance use disorders. What is the main practical implication?",
        options: ["Mood disorders cause ADHD", "Substance use should never be asked about", "Temporal order is irrelevant to the differential", "ADHD-like symptoms that begin only after another disorder deserve extra scrutiny"], a: 3,
        why: "Because ADHD usually comes first, a picture in which 'ADHD symptoms' start with or after another disorder should make you look harder for that disorder as the explanation." },
      { q: "According to ICD-11, when can concentration problems during a depressive episode count towards ADHD?",
        options: ["Only if present since childhood and persisting after the episode resolves", "Whenever the PHQ-9 is 10 or more", "Never, if the patient has ever been depressed", "Only if the patient is on an antidepressant"], a: 0,
        why: "ICD-11 draws this boundary explicitly. Depression does not rule out ADHD, but symptoms confined to the episode do not count." },
      { q: "Which sleep pattern most strongly suggests hypomania rather than ADHD?",
        options: ["Trouble falling asleep because the mind will not switch off", "Feeling tired after a late night", "Several days of needing only three or four hours' sleep without feeling tired", "Waking several times to check the phone"], a: 2,
        why: "Decreased need for sleep without tiredness is a hallmark of hypomania. In ADHD, sleep-onset difficulty is usually followed by daytime tiredness (CADDRA)." },
      { q: "Tara, 26, has lifelong ADHD symptoms and screens positive on the MDQ. She has never had a spell of being different from her usual self. What is the best interpretation?",
        options: ["Diagnose bipolar disorder from the MDQ", "A positive MDQ is common in ADHD; without discrete episodes on interview it does not indicate bipolar disorder", "Start a mood stabiliser", "Repeat the MDQ until it is negative"], a: 1,
        why: "About half of adults with ADHD screen MDQ positive (Lundervold 2020), because items describe ADHD traits. Bipolar disorder needs interview evidence of discrete episodes. NICE CG185 advises against questionnaires to identify bipolar disorder in primary care." },
      { q: "Ella has ADHD and newly identified bipolar II disorder. What is the right order of treatment?",
        options: ["Stabilise mood first, then consider ADHD treatment", "Start methylphenidate alone straight away", "Treat ADHD first, because it began earlier", "Treat neither until both are fully remitted"], a: 0,
        why: "Bipolar disorder should be stabilised first (Kooij 2019; CADDRA). In a pharmaco-epidemiological study cited by Kooij, methylphenidate alone in bipolar disorder raised the risk of a switch to mania (hazard ratio 6.7)." },
      { q: "Owen, 40, has poor concentration only when worried, palpitations and tension, and fine concentration on calm weekends. School reports describe a conscientious child. What is the most likely verdict?",
        options: ["ADHD, combined presentation", "Co-occurring ADHD and GAD", "Generalised anxiety disorder better explains the symptoms", "Uncertain; start a stimulant trial"], a: 2,
        why: "Inattention confined to anxious states, physical anxiety symptoms and no childhood history point to anxiety as the explanation (CADDRA; ICD-11). A stimulant response would not settle the question." },
      { q: "Sam, 24, developed poor concentration, nightmares and hypervigilance after an assault at 19. Primary school reports are glowing and his mother recalls a settled child. What is the most likely verdict?",
        options: ["ADHD, because PTSD and ADHD often co-occur", "Uncertain, because PCL-5 items overlap with ADHD", "Co-occurring ADHD and PTSD", "PTSD better explains the symptoms"], a: 3,
        why: "Onset after the trauma, re-experiencing and threat-related symptoms, and no childhood ADHD history point to PTSD as the explanation. Co-occurrence would require ADHD symptoms before the trauma." },
      { q: "Why does the ITQ diagnostic algorithm help when assessing an adult with ADHD and a trauma history?",
        options: ["It gives a cut-off for ADHD", "Disturbances in self-organisation count only if PTSD criteria are also met, which guards against relabelling ADHD emotional dysregulation as complex PTSD", "It replaces the clinical interview for trauma", "It measures childhood ADHD symptoms"], a: 1,
        why: "The ITQ is scored by algorithm, not cut-offs. Because the self-organisation cluster counts only alongside PTSD, emotional dysregulation alone cannot produce a complex PTSD result." },
      { q: "Which feature most favours emotionally unstable personality disorder over ADHD?",
        options: ["Frequently interrupting others", "Losing keys and phones", "Brief irritability after a frustrating day", "Intense fear of abandonment with identity disturbance and chronic emptiness"], a: 3,
        why: "Abandonment fear, identity disturbance, chronic emptiness and recurrent self-harm are specific to BPD (CADDRA; Ditrich 2021). The other options are typical of ADHD." },
      { q: "According to the European Consensus, how do emotional reactions in ADHD typically behave?",
        options: ["They are short-lived and return to baseline within a few hours", "They last for weeks without a trigger", "They come with grandiosity", "They occur only during depressive episodes"], a: 0,
        why: "Kooij (2019) describes ADHD emotional dysregulation as reactive and brief, with a return to baseline within hours. Sustained mood change over days or weeks suggests a mood disorder." },
      { q: "Ravi, 32, has well-documented lifelong ADHD. Over six months he has become withdrawn and suspicious, and says neighbours are monitoring him through the walls. What should you do?",
        options: ["Attribute it to ADHD and increase support", "Note it and continue the ADHD assessment as usual", "Recognise that psychotic symptoms are not part of ADHD; assess risk and refer urgently to early intervention or psychiatry", "Start a stimulant to improve focus"], a: 2,
        why: "CR235 9.7.9 says psychotic symptoms are not features of ADHD and represent a comorbid diagnosis. Active psychosis is treated first (Kooij 2019), and stimulants carry a small risk of new psychosis (Moran 2019)." }
    ],
    refs: [
      "American Psychiatric Association. DSM-5-TR (2022): ADHD criterion E; hypomanic, manic, persistent depressive and cyclothymic disorder concepts, paraphrased.",
      "World Health Organization. ICD-11 CDDR (2024): 6A05 boundaries with mood, anxiety and other disorders; 6B41 complex PTSD.",
      "NICE NG87. Recommendations 1.2.2, 1.2.10 and 1.4.4. NICE CG185 bipolar disorder, recommendation 1.2.3.",
      "Adamou M et al. UKAAN AQAS. Front Psychiatry 2024;15:1380410.",
      "Royal College of Psychiatrists. CR235 ADHD in adults: good practice guidelines (2023), sections 9.2, 9.3, 9.7, 10 and 11.5.",
      "Kooij JJS et al. Updated European Consensus Statement. Eur Psychiatry 2019;56:14-34 (sections 4.1, 6.3, 7.2 and 7.5.1).",
      "CADDRA. Canadian ADHD Practice Guidelines, 4.1 edition (2020), chapter 2 (differential diagnosis tables).",
      "Faraone SV et al. WFADHD International Consensus Statement. Neurosci Biobehav Rev 2021;128:789-818; WFADHD 2026 update, PsyArXiv preprint (not peer reviewed).",
      "Fayyad J et al. Adult ADHD in the WHO World Mental Health Surveys (2017): comorbidity and temporal priority.",
      "Kessler RC et al. The prevalence and correlates of adult ADHD in the United States (NCS-R). Am J Psychiatry 2006;163:716-723.",
      "Post RM et al. Graphic representation of the life course of illness in patients with affective disorder. Am J Psychiatry 1988;145:844-848.",
      "Asherson P et al. Differential diagnosis, comorbidity, and treatment of ADHD in relation to bipolar disorder or borderline personality disorder in adults. Curr Med Res Opin 2014;30:1657-1672.",
      "Viktorin A et al. The risk of treatment-emergent mania with methylphenidate in bipolar disorder. Am J Psychiatry 2016 (cited in Kooij 2019, section 7.5.1).",
      "Lundervold AJ et al. Front Psychol 2020;11:571101 (MDQ positive in adults with ADHD). Hirschfeld RMA et al. Am J Psychiatry 2000;157:1873-1875 (MDQ).",
      "Katzman MA et al. Adult ADHD and comorbid disorders: clinical implications of a dimensional approach. BMC Psychiatry 2017;17:302.",
      "Spencer AE et al. Examining the association between PTSD and ADHD: a systematic review and meta-analysis. J Clin Psychiatry 2016;77:72-83.",
      "Cloitre M et al. The International Trauma Questionnaire. Acta Psychiatr Scand 2018;138:536-546. Weathers FW et al. PCL-5 (National Center for PTSD, 2013); Bovin MJ et al. Psychol Assess 2016;28:1379-1391.",
      "Ditrich I, Philipsen A, Matthies S. Borderline personality disorder and ADHD revisited. Borderline Personal Disord Emot Dysregul 2021;8:22. Zanarini MC et al. J Pers Disord 2003;17:568-573 (MSI-BPD).",
      "Nourredine M et al. Association of ADHD in childhood and adolescence with the risk of subsequent psychotic disorder. JAMA Psychiatry 2021;78:519-529. Moran LV et al. Psychosis with methylphenidate or amphetamine in patients with ADHD. N Engl J Med 2019;380:1128-1138.",
      "Ising HK et al. The validity of the 16-item version of the Prodromal Questionnaire (PQ-16). Schizophr Bull 2012;38:1288-1296.",
      "Abramovitch A et al. Comorbidity between ADHD and OCD across the lifespan: a systematic and critical review. Harv Rev Psychiatry 2015;23:245-262.",
      "Department of Health and Social Care. Independent review into mental health conditions, ADHD and autism: final report (October 2026)."
    ]
  }
]);
