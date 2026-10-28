/* ia1: Careless mistakes, misses details. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "ia1",
  dim: "IA",
  codes: { dsm5: "A1a", diva: "A1", asrs: [7] },
  title: "Careless mistakes, misses details",
  criterion: "Often fails to notice details or makes careless errors in schoolwork, work or other activities. The work comes out inaccurate because details are overlooked or missed, not because the person does not understand what to do.",
  adultForm: "In adults this shows as inaccurate work: slips in emails, figures, forms and documents, steps left out of routine procedures, and conditions or small print missed when reading. DSM-5-TR's examples are overlooking or missing details and inaccurate work; it gives no separate adult wording for this item, so the clinician translates it into adult tasks. Many adults hold the error rate down by checking everything several times, working very slowly or asking others to check, so the visible mistakes may be few while the hidden cost in time, effort and anxiety is high.",
  why: "Brief lapses of attention mean some details are never taken in, and weak working memory and self-monitoring mean slips are not caught before the work is finished. A quick, impulsive response style (acting before reading to the end) adds to this. It is a problem of noticing and checking, not of knowledge or skill.",
  ask: {
    adult: "Over the last six months, how often have you made mistakes because you missed a detail or did not notice something, for example at work, with forms and money, or at home? Can you tell me about a recent one?",
    child: "Thinking back to primary school, roughly age 5 to 12, how often did you get things wrong in your work because you missed small details, even when you knew how to do it? What did teachers or your parents say about it?",
    parent: "Over the last six months, when your child does homework, reading or jobs at home, how often do they make silly mistakes or miss small details in things you know they can do, compared with other children their age? Can you give me a recent example?",
    teen: "Over the last six months, how often have you got things wrong because you missed a small detail, like a sign in maths, part of a question or a step in a task, even though you knew how to do it? Can you give me an example?",
    teacher: "Compared with others in the class, how often does this pupil make careless slips or miss details in work they understand, such as misreading signs, skipping questions or leaving words out? Can you give an example from recent work?"
  },
  rephrase: [
    "What kind of slip-ups do you make in things you actually know how to do?",
    "How often do small errors creep into what you do, like typos, wrong numbers or a missed step?",
    "When you look back over something you have done, do you often find mistakes you did not see the first time?",
    "How often do people at work or at home point out little mistakes in what you have done? What sort of mistakes?",
    "What happens when you have to read the small print or the fine detail of something?",
    "Tell me about the last time a small mistake caused you a problem. What happened?",
    "Everyone gets things wrong sometimes. Do you get small things wrong more than the people around you, even when you are trying hard?",
    "How much checking do you need to do to keep mistakes down, and how long does that take compared with other people?",
    "If I asked your manager, a colleague or your partner how careful you are with detail, what would they say?",
    "Do your mistakes happen because you rush, or do you miss things even when you go slowly?",
    "In simple words: do you often get small things wrong? What kind of things?",
    "With forms, emails or money, how often do you get one small thing wrong, like a date, a number or a name?",
    "How often do you press send or hand something in and then spot an obvious error straight away?",
    "What tricks do you use to avoid mistakes, and what happens on days you cannot use them?"
  ],
  examples: {
    adult: [
      { ctx: "work", label: "Work", items: [
        "Sends emails with the wrong file attached or to the wrong person",
        "Types figures into a spreadsheet in the wrong row or column",
        "Leaves out a step in a routine procedure done many times before",
        "Mixes up two similar order codes, part numbers or customer names",
        "Cuts, drills or fits to the wrong measurement on a practical job",
        "Has to redo jobs because one small requirement was overlooked",
        "Puts the wrong date, price or quantity on labels or documents",
        "Gives the wrong change or scans the wrong item at a till",
        "Ticks off a checklist but misses one line on it",
        "Has had formal feedback, an appraisal note or a warning about accuracy",
        "A supervisor routinely double-checks their work because of past slips",
        "Stays late re-checking work that colleagues finish within normal hours",
        "Prints documents to proofread because errors are missed on screen",
        "Overlooks a safety step, such as isolating the power before starting work",
        "Enters the wrong client, patient or stock details into a database",
        "Takes far longer than colleagues over detailed tasks such as audits or stocktakes",
        "Rushes detailed work to get it over with and leaves slips in it",
        "Signs off other people's work as checked without spotting the errors in it"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "Loses marks for slips in work they understood well",
        "Answers a different question from the one that was set",
        "Copies formulas, dates or figures wrongly from slides into notes",
        "Leaves references incomplete or formatted inconsistently",
        "Misses one part of a multi-part exam question",
        "Submits essays with spelling slips a quick reread would catch",
        "Misreads the word limit or required format of an assignment",
        "Drops marks in timed tests through slips in answers they knew"
      ] },
      { ctx: "home", label: "Home and household", items: [
        "Leaves out an ingredient or adds the wrong amount when cooking",
        "Fits a piece of flat-pack furniture upside down or back to front",
        "Buys the wrong size or model of a replacement part or bulb",
        "Misreads cooking times or oven temperatures on packaging",
        "Ruins clothes by missing the washing instructions on the label",
        "Leaves patches or edges unpainted when decorating",
        "Sets timers, heating or alarms to the wrong time by mistake",
        "Brings home the wrong items from the shop despite having a list",
        "Doses cleaning products or plant feed wrongly without reading the label",
        "Starts assembling or fitting things before reading the instructions through"
      ] },
      { ctx: "admin", label: "Paperwork and money", items: [
        "Puts a wrong date of birth, postcode or reference number on forms",
        "Has official forms sent back because a section or page was skipped",
        "Enters the wrong amount or account number when paying online",
        "Signs agreements without spotting important conditions in the small print",
        "Misses a wrong charge on a bank statement or bill",
        "Applications for benefits, visas or jobs are delayed by small errors",
        "Books tickets or appointments for the wrong day or time",
        "Has to correct a tax return or expenses claim after sending it",
        "Makes adding-up slips when budgeting or checking a payslip",
        "Reads forms with a ruler or finger to avoid skipping lines",
        "Writes in the wrong box on a form and has to start again"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "Misreads school letters and gets the date or details of events wrong",
        "Measures a child's medicine dose wrongly after misreading the label",
        "Fills in school consent or meal forms with mistakes",
        "Overlooks a detail in a school message, such as bringing a packed lunch",
        "Makes errors in the working when helping with maths homework",
        "Orders the wrong size of school uniform after misreading the size chart"
      ] },
      { ctx: "driving", label: "Driving and travel", items: [
        "Gets parking or bus-lane fines for signs they did not take in",
        "Puts the wrong fuel in the car",
        "Gets on the wrong train or bus after misreading the board",
        "Types the wrong postcode or destination into the satnav",
        "Goes to the wrong terminal or address because a booking was misread",
        "Books a trip without noticing the passport expires before it",
        "Misses speed limit changes and gets points on their licence"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Sends texts where autocorrect has changed the meaning",
        "Replies to the whole group or the wrong person by mistake",
        "Mistypes email addresses so messages never arrive",
        "Posts or shares something before noticing a typo or wrong photo",
        "Taps agree or buy without reading what is on the screen",
        "Orders the wrong item, size or quantity online",
        "Gets charged for subscriptions after missing the terms on sign-up",
        "Copies and pastes the wrong text into a form or message"
      ] },
      { ctx: "leisure", label: "Leisure and hobbies", items: [
        "Misses a step in a knitting, sewing or model-kit pattern and has to undo work",
        "Loses card or board games by overlooking an obvious move",
        "Plays wrong notes in pieces of music they know well",
        "Misreads clues in puzzles or quizzes",
        "Keeps the score wrongly or misses a rule in sports and games",
        "Gets steps wrong in a gym, dance or exercise routine they follow often"
      ] },
      { ctx: "health", label: "Health and appointments", items: [
        "Takes tablets at the wrong dose after misreading the box",
        "Leaves gaps or gives inconsistent answers on health questionnaires",
        "Overlooks preparation steps in an appointment letter, such as fasting",
        "Collects or orders the wrong item on a repeat prescription",
        "Mixes up two similar-looking medicines",
        "Fills a relative's weekly pill organiser with tablets in the wrong slots"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Partner checks bookings, forms or bills before they are sent",
        "Family say they never read things properly",
        "Arguments start over jobs done carelessly, like bills paid wrongly",
        "Writes the wrong date, time or name on invitations and cards",
        "Relies on a family member to proofread anything important"
      ] },
      { ctx: "social", label: "Friends and social life", items: [
        "Turns up on the wrong day or at the wrong venue after misreading the plan",
        "Gets numbers or dates wrong when organising a group booking",
        "Works out wrongly who owes what when splitting a bill with friends"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Feels their eyes slide over detail without taking it in",
        "Knows the right answer but writes or types something else",
        "Only sees the obvious error once the work has gone",
        "Checks the same thing three or four times and still does not trust it",
        "Feels drained by the effort of being careful all day",
        "Calls themselves stupid or sloppy despite understanding the material",
        "Feels the mind jumping to the finish before the detail has been read",
        "Dreads tasks that need precision because of past consequences"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Gets sums wrong by misreading the plus or minus sign",
        "Copies words or numbers wrongly from the board",
        "Skips questions or whole sections on a worksheet",
        "Leaves words out of sentences when writing, then reads them back as complete",
        "Starts writing before reading the question to the end",
        "Answers only the first half of two-part questions",
        "Leaves the back page of a worksheet or test blank",
        "Forgets capital letters and full stops even with reminders",
        "Lines up columns badly in maths so the answer goes wrong",
        "Rushes to be first to finish and makes many slips",
        "Misreads simple words they can read correctly when slowed down",
        "Answers a different question from the one printed on the sheet",
        "Takes much longer than classmates over work that must be neat and exact"
      ] },
      { ctx: "homework", label: "Homework", items: [
        "Hands in homework with slips a quick look would catch",
        "Does the wrong page or exercise from the homework book",
        "Writes answers in the wrong boxes",
        "Gets spelling tests right but the same words wrong in stories",
        "Parent finds mistakes in work the child clearly understands",
        "Says the work is checked but finds errors once they are pointed out",
        "Skips words or whole lines when reading aloud at home"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Lays the table or tidies with parts of the job missed",
        "Puts clothes on inside out or back to front past the usual age",
        "Washes or brushes teeth in a patchy, rushed way",
        "Gets simple jobs half right, like sorting socks into odd pairs",
        "Writes names in birthday cards with letters missed out",
        "Measures or pours carelessly when helping with baking"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Loses games by missing a rule or an obvious move",
        "Builds construction kits with pieces or steps left out",
        "Colours in a rush, leaving gaps and missed areas",
        "Muddles game rules so friends get annoyed",
        "Forces jigsaw pieces into the wrong place rather than looking closely",
        "Miscounts the spaces moved or the score in board games"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "Misses steps in a dance, gymnastics or martial arts routine",
        "Plays wrong notes in music practice on pieces they know",
        "Skips steps in craft or cooking club instructions",
        "Fills in quiz or treasure hunt sheets with slips",
        "Gets badge or award tasks wrong on small points"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "Report says slips spoil otherwise good work",
        "Teacher writes 'capable but rushes and does not check'",
        "Comments such as 'read the question carefully' come up every year",
        "Report mentions untidy presentation and lack of care",
        "Teacher says the child knows the method but loses marks",
        "Test results are lower than the teacher expected from class work",
        "Parents told 'could do much better with more care'"
      ] },
      { ctx: "teen", label: "Secondary school and college (12-17)", items: [
        "Loses exam marks for misreading what the question asks",
        "Coursework comes back covered in small corrections",
        "Science practicals go wrong from missed measurements",
        "Writes mock exam answers in the wrong section of the paper",
        "Copies homework tasks down wrongly from the board or app",
        "Loses marks in mock exams for missing units or decimal points",
        "Online homework is marked wrong because of typing slips in answers",
        "Gives the wrong change or takes orders down wrongly in a part-time job",
        "Misses road signs or speed limit changes in driving lessons"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "In a typical week, how many mistakes like this happen?",
      "Is it most days, most weeks, or only now and then?",
      "When was the last one? And the one before that?",
      "Of the things you send off or hand in, how many need correcting afterwards?",
      "Does it happen even with easy or familiar tasks?",
      "Is it more often than it used to be, the same, or less?"
    ] },
    { k: "severity", label: "How serious", items: [
      "What is the most serious mistake you have made by missing a detail?",
      "Have mistakes ever cost you money, a job, marks or a fine?",
      "Have you had complaints, warnings or formal feedback about accuracy?",
      "Has anyone ever been put at risk because of a slip, for example with medicine, food or machinery?",
      "Roughly how many hours a week do your mistakes, and putting them right, cost you?",
      "Have you lost trust at work or at home because of errors?"
    ] },
    { k: "pervasive", label: "Where it happens", items: [
      "Does this happen at work, at home and with paperwork, or mainly in one place?",
      "Is it the same with things you enjoy, such as hobbies or games?",
      "Do you make these slips with money and forms as well as at work?",
      "Is it the same on paper and on screen?",
      "Is it different when nobody is checking, or when you are under time pressure?",
      "Do you notice it in your own language as well as in other languages you use?"
    ] },
    { k: "duration", label: "How long", items: [
      "How long has this been a problem: months, years, or as long as you can remember?",
      "Were you like this at school, in your first job, and now?",
      "Was there ever a time you were accurate without much effort?",
      "Did it start or get worse at a particular point, such as after an illness, a loss or a new medicine?",
      "Has it been there for at least the last six months, most of the time?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Compared with people doing the same job, do you make more slips?",
      "Do others manage to be accurate with less checking than you need?",
      "If you ranked your team for accuracy, where would you come?",
      "Did teachers compare you with classmates about careless work?",
      "Do friends and family notice that you get details wrong more than most?"
    ] },
    { k: "impact", label: "What it costs", items: [
      "What has happened because of these mistakes at work or in study?",
      "Have they caused arguments or tension at home?",
      "Have they cost you money, for example fines, charges or lost deposits?",
      "Do you turn down jobs or roles because they need precision?",
      "How do these mistakes affect how you feel about yourself?",
      "Has anyone taken tasks away from you because of errors?",
      "Have they ever affected your safety or someone else's?"
    ] },
    { k: "compensation", label: "How you cope", items: [
      "What do you do to stop mistakes happening?",
      "How many times do you check something important before sending it?",
      "Does anyone else check your work, like a partner or colleague?",
      "How much longer does checking add compared with other people?",
      "What happens on days when you cannot use your usual systems?",
      "Have you chosen work or study that keeps you away from detail?"
    ] },
    { k: "onset", label: "When it started", items: [
      "What were you like with careless slips at primary school?",
      "Do you remember reports about rushing or not checking?",
      "Did your parents check your homework because of mistakes?",
      "Was it noticeable before you were 12?",
      "Did it become more obvious when work got harder, such as at secondary school or university?",
      "Do you have old school reports or exercise books we could look at?"
    ] }
  ],
  informant: {
    partner: [
      "Do they often get small things wrong, like dates, amounts or names on forms?",
      "Do you find yourself checking their bookings, forms or bills before they go off?",
      "Do they bring back the wrong things from the shop even with a list?",
      "How often do mistakes in their paperwork or payments cause problems?",
      "Do they skim instructions and then get stuck or do it wrong?",
      "When they get something wrong, is it because they do not know how, or because they did not notice?",
      "Does it happen even with things they care about?",
      "Have you seen them spend a very long time checking things to avoid errors?",
      "Have their slips ever caused a risk, for example with medicine, cooking or driving?",
      "Has this been the same for as long as you have known them?",
      "How do they react when a mistake is pointed out?"
    ],
    parent: [
      "At primary school, did they make careless mistakes in work they understood?",
      "Did they rush homework and miss out questions or pages?",
      "Did teachers write about careless errors or not checking?",
      "Did you have to check their homework more than for other children?",
      "Did they often misread questions or instructions?",
      "Was their spelling or arithmetic right one day and wrong the next?",
      "Did they do jobs at home in a rushed way, missing bits?",
      "Did their test marks fall short of what you knew they could do?",
      "Was this noticeable before age 12, and did it carry on after?",
      "Compared with other children their age, were they more careless?",
      "Did anything help, such as one-to-one support or slowing down?"
    ],
    school: [
      "Careless errors",
      "Does not check work",
      "Rushes to finish",
      "Capable but inaccurate",
      "Must read questions more carefully",
      "Untidy presentation",
      "Silly slips lose marks",
      "Could do better with more care"
    ],
    teacher: [
      "Knows the method but slips up on the detail",
      "Rushes to finish first and does not check",
      "Skips questions or misses the back of the sheet",
      "Checks more carefully when an adult reminds them",
      "Misreads instructions even though they can read the words",
      "Test marks are lower than their class work suggests",
      "Accurate one day and full of slips the next"
    ]
  },
  counts: [
    "Errors come from overlooking detail, not from a lack of knowledge or skill: once a mistake is pointed out, the person sees it and can fix it.",
    "It happens often: most weeks, across many kinds of task, clearly more than peers of similar age, education and job.",
    "It usually shows in more than one area of life, for example work and paperwork, or study and home (DSM-5-TR criterion C needs several symptoms across two or more settings).",
    "It is long-standing: present for years, and in adults for most of the last six months, not just during one recent spell.",
    "It has real consequences: work redone, marks lost, fines, complaints, warnings, or tasks taken away.",
    "Score present when errors are low only because of heavy compensation (repeated checking, others checking, working very slowly) that costs far more time or effort than others need.",
    "It persists in tasks the person cares about, though it is usually worse with dull or repetitive work.",
    "It occurs when the person is well, not only when tired, ill, intoxicated or under extreme stress.",
    "Collateral (partner, parent, appraisals, school reports) supports the pattern where available."
  ],
  notCount: [
    "The task is not understood, so errors reflect a learning or intellectual difficulty rather than missed detail (consider a specific learning disorder or intellectual disability).",
    "Errors are explained by poor eyesight, hearing problems or working in a second language.",
    "Mistakes appear only during a depressive, manic or hypomanic episode, or a period of severe stress, with good accuracy at other times.",
    "Errors happen only when anxious, for example only in exams, with ordinary tasks done accurately.",
    "Slowness and checking are driven by fear of harm or a need for things to feel right, and few real errors occur (consider OCD or perfectionism).",
    "Mistakes began with a new medicine or substance, or happen only when intoxicated or hungover.",
    "Mistakes occur only with one disliked or unusually complex task, or only in one setting.",
    "A few memorable slips with otherwise good accuracy: everyone makes occasional mistakes.",
    "Onset is recent, in mid or later life, with other cognitive changes and no childhood history (consider mild cognitive impairment, menopause, thyroid or sleep problems).",
    "Harsh self-criticism alone is not evidence: ask for specific examples, how often and what happened.",
    "Being slower than others in a highly technical role is not a symptom on its own.",
    "Do not double-count: forgetting appointments (ia9), losing things (ia7) and poor planning (ia5) are scored elsewhere."
  ],
  anchors: [
    { score: "yes", quote: "I proofread everything three times and I still send emails with the wrong name or the wrong attachment. My manager now checks all my reports before they go out. My school reports always said I was careless.", why: "Present. Frequent errors despite heavy checking, clear work consequences and a childhood pattern noted by school." },
    { score: "yes", quote: "I'm a joiner. I know the job inside out, but at least once a week I cut something to the wrong length because I misread my own note. It costs me in wasted timber and I've lost a customer over it.", why: "Present. Knowledge is intact, slips are frequent and costly in a practical job. Confirm it also happens outside work, for example with bills or forms." },
    { score: "yes", quote: "I don't make many mistakes now, but only because I do everything twice, my partner checks the bills, and I stay an hour late most days going over my figures.", why: "Present. A low visible error rate hides a symptom held down by costly compensation. Score the underlying difficulty, not the end product." },
    { score: "unsure", quote: "I've made loads of mistakes, but only since I started this new job. It's so busy and I'm hardly sleeping.", why: "Unsure for now. Recent onset with sleep loss and stress. Ask about accuracy before this job and at school, and about sleep, before deciding." },
    { score: "unsure", quote: "I'm terrible with forms. I just never get them right.", why: "Unsure until probed. Too vague. Ask for recent examples, and whether the problem is reading or understanding (literacy, language) or overlooking details, and whether it happens elsewhere." },
    { score: "unsure", quote: "My essays always come back with lots of red ink, but English isn't my first language.", why: "Unsure. Separate language errors from attention errors: ask about slips in their first language, with numbers and in daily tasks at home." },
    { score: "no", quote: "I hate getting things wrong, so I check a lot. To be honest I hardly ever find anything. I just need to be sure.", why: "Absent for this symptom. Checking without real errors points to anxiety, perfectionism or obsessive-compulsive traits, which should be explored instead." },
    { score: "no", quote: "Sometimes I send a text with a typo, like everyone does.", why: "Absent. Ordinary everyday slips with no unusual frequency and no consequences." },
    { score: "no", quote: "It's only spreadsheets at work that I struggle with. Everywhere else I'm fine with detail, and I always was at school.", why: "Absent unless probing finds more. One task type in one setting, with good accuracy elsewhere and in childhood, does not meet 'often' or pervasiveness." }
  ],
  mimics: [
    { ddx: "sld", clue: "Errors follow a consistent pattern in reading, spelling or maths (slow, effortful decoding, spelling by sound, weak number facts), and the person cannot easily see what is wrong even when shown.", ask: "When someone points out a mistake, can you see straight away what is wrong and fix it, or is it still hard to work out?" },
    { ddx: "idd", clue: "Mistakes reflect difficulty with the level of the task across the board, with slow learning of new skills, rather than slips on familiar work.", ask: "Are the tasks you get wrong ones you can do well on a good day, or ones you find hard to understand?" },
    { ddx: "sensory", clue: "Misreads small print, numbers or signs; squints, has headaches, or does worse in poor light or on small screens.", ask: "When did you last have your eyes tested? Is small print or a phone screen harder to read than it used to be?" },
    { ddx: "dep", clue: "Errors began with low mood, poor sleep and loss of interest; accuracy was good before that.", ask: "Before your mood dropped, were you making as many mistakes as you are now?" },
    { ddx: "gad", clue: "Worries fill the mind while working; slips happen mostly when anxious, often with over-checking.", ask: "When you make these mistakes, what is going through your mind at the time?" },
    { ddx: "ocd", clue: "Slowness and repeated checking are driven by fear of harm or of being wrong, yet few genuine errors are found.", ask: "When you check, what do you fear would happen if you did not? How often do you actually find a mistake?" },
    { ddx: "osa", clue: "Slips are worse when tired, with loud snoring, unrefreshing sleep, morning headaches or dozing in the day.", ask: "Has anyone said you snore heavily or stop breathing at night? Do you wake up feeling refreshed?" },
    { ddx: "sud_cannabis", clue: "Errors cluster on days after use, or began with regular daily cannabis use.", ask: "In times when you were not using cannabis, were you just as prone to mistakes?" },
    { ddx: "meds", clue: "Errors started after a new medicine, for example sedating antihistamines, some anticonvulsants, benzodiazepines, opioids or sedating antidepressants.", ask: "Did this start or get worse after you began or changed any medicine?" },
    { ddx: "mci", clue: "New errors in mid or later life, a change from previously reliable accuracy, getting gradually worse, sometimes with memory or word-finding problems.", ask: "Is this a change from how you used to be? Has it been getting steadily worse over the last year or two?" }
  ],
  special: {
    women: "Women and girls often hide detail errors behind perfectionism, long hours and checking, so the symptom may show as exhaustion, slowness and anxiety rather than visible mistakes. Ask how much time and effort it takes to be accurate and what happens when they cannot check.",
    older: "In older adults, new detail errors call for a review of vision, hearing, medicines, mood and cognition before ADHD is considered. Look for a lifelong pattern using school reports, early work history and accounts from siblings or old friends.",
    highIQ: "Able people may keep errors low through intelligence and strategy, but the cost is out of proportion, such as hours of re-checking, or results well below their ability in timed exams. Judge impairment against their own ability and effort, not against average performance.",
    sud: "Cannabis, alcohol, sedatives and the come-down from stimulants all cause inaccuracy. Establish whether slips were present in childhood and during sober periods, and reassess after a period of abstinence if the timing is unclear.",
    asd: "Many autistic people attend closely to detail, so frequent careless slips are less typical of autism alone, although errors can appear under overload or with tasks of no interest. If both conditions are suspected, compare accuracy on preferred and non-preferred tasks.",
    culture: "Bilingual patients may make language slips that look careless, so check accuracy in their first language and with numbers. In some cultures admitting mistakes is uncomfortable; use concrete examples and collateral rather than general questions.",
    young: "Compare slips with children of the same age, not with the oldest in the class: the youngest in a school year are less mature and may make more slips for that reason alone. Quiet, compliant pupils, often girls, may hide slips by working slowly or rewriting work at home, so look at work samples and ask how long homework takes."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A1a, paraphrased",
    "ICD-11 CDDR 6A05 (WHO 2024), inattention features, paraphrased",
    "Kooij JJS et al. European consensus on adult ADHD, Eur Psychiatry 2019",
    "DIVA 2.0 structure (Kooij and Francken 2010)",
    "ASRS v1.1 item 7 (WHO; Kessler et al. 2005)",
    "Examples, probes and anchors: clinical practice",
    "NICE NG87 1.2.2 (under-recognition in girls), 1.3.5 (criteria adjusted for age) and 1.3.6 (children's views)",
    "Parent, young person and teacher questions, teacher comments and young-person notes: clinical practice"
  ]
}]);
