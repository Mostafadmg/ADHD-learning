/* ia6: Avoids tasks that need sustained mental effort. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "ia6",
  dim: "IA",
  codes: { dsm5: "A1f", diva: "A6", asrs: [4] },
  title: "Avoids tasks that need sustained mental effort",
  criterion: "Often shies away from, dislikes or resists starting tasks that call for prolonged mental effort. In children this is typically schoolwork and homework; in older teenagers and adults it includes writing reports, completing forms and going through long documents.",
  adultForm: "In adults this shows as chronic putting-off of demanding, low-interest tasks: paperwork, tax returns, long emails, reports, revision and reading. Easy or pleasant jobs get done first and demanding work waits until a deadline forces it. Many adults shape their lives around the avoidance, choosing hands-on jobs, handing paperwork to a partner or turning down roles with desk work. The avoidance is about the strain of keeping the mind on the task, not about not caring.",
  why: "Keeping mental effort going on a low-reward task is unusually costly when attention regulation and reward processing work differently. The task feels aversive in advance, so the brain picks something with quicker reward. Urgency, novelty or strong interest switch attention on, which is why many people with ADHD can only start under deadline pressure.",
  ask: {
    adult: "Over the last six months, how often have you put off, avoided or dreaded tasks that need a lot of thinking or concentration for a long stretch, such as forms, reports, reading or paperwork? What happens when you have one of those to do?",
    child: "At primary school age, roughly 5 to 12, how did you feel about tasks that needed you to concentrate for a long time, like homework, reading or writing? Did you try to get out of them or put them off? Can you remember an example?",
    parent: "Over the last six months, what happens when your child has to do something that needs a lot of thinking for a while, like homework, reading or writing? Do they put it off, argue or find ways out of it more than other children their age?",
    teen: "Over the last six months, how often do you put off or avoid things that need you to concentrate hard for a long time, like revision, essays, reading or forms? What do you do instead, and what happens in the end?",
    teacher: "Compared with others in the class, how does this pupil respond to tasks that need sustained thinking, such as extended writing, reading or problems with several steps? Do they delay starting, ask to leave the room or do only the easy parts?"
  },
  rephrase: [
    "Which jobs do you put off the longest?",
    "Plain words: what happens when you have a job that needs a lot of thinking?",
    "When you have a long form or a report to do, what do you do instead?",
    "When you have easy jobs and hard jobs to do, which get done first? What happens to the rest?",
    "Tell me about the last important piece of paperwork you had to do. When did you actually start it?",
    "How do you feel when you look at a long document you need to read?",
    "Most people put things off sometimes. How much does it cost you compared with your friends?",
    "Is there anything you have been putting off for months, like letters, forms or a big task? Tell me about it.",
    "How much has reading, writing or desk work shaped the jobs, courses or roles you have chosen?",
    "Simple English: some jobs need you to think hard for a long time. What do you do when you have one?",
    "Who does the forms and paperwork in your home? How did that come about?",
    "When you have to concentrate for a long time, what does it feel like inside?",
    "How is it different when a task interests you, compared with one that is dull but necessary?",
    "Informal: when does the brain-heavy stuff actually get done?"
  ],
  examples: {
    adult: [
      { ctx: "work", label: "Work", items: [
        "Leaves writing reports until the night before they are due",
        "Clears quick, easy tasks first and leaves the demanding ones",
        "Puts off appraisals, portfolios or reflective writing for months",
        "Avoids reading long policies, manuals or technical documents",
        "Chooses hands-on work to get away from desk-based tasks",
        "Turned down promotion because it meant more paperwork",
        "Delays writing up notes, invoices or job sheets after practical work",
        "Passes complex analysis to colleagues and takes on simpler jobs",
        "Leaves long emails unanswered because a reply needs careful thought",
        "Bids or grant applications put off until it is too late to submit",
        "Avoids learning new software or systems that need long concentration",
        "Mandatory e-learning ignored until compliance warnings arrive",
        "Can only start demanding work late at night when pressure peaks"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "Puts off essays until the last day, then writes through the night",
        "Skips required reading and relies on summaries or videos",
        "Dropped courses that had heavy written assessment",
        "Chose a course or career to avoid long reading or writing",
        "Revision for university or professional exams starts only days before",
        "Asks for repeated extensions on a dissertation or thesis",
        "Prefers practical assessments and avoids written exams where possible",
        "Finds reasons to be elsewhere when study sessions are planned",
        "Steers away from maths or statistics modules that need long problem-solving"
      ] },
      { ctx: "home", label: "Home and household", items: [
        "Skips reading instructions and guesses how appliances work",
        "Puts off getting and comparing quotes for home repairs",
        "Avoids working out household budgets or anything that needs sums",
        "Buys the first option rather than face comparing products",
        "Puts off planning a renovation or garden project because of the thinking involved",
        "Chooses physical chores over any job that needs thinking",
        "Avoids setting up new devices, heating controls or home systems"
      ] },
      { ctx: "admin", label: "Paperwork and money", items: [
        "Leaves official letters unopened because dealing with them feels too much",
        "Tax returns filed late, with penalties, most years",
        "Puts off renewing passport, licence or insurance until the last moment",
        "Avoids filling in benefit, housing or insurance claim forms",
        "Leaves mortgage, pension and bank paperwork to a partner",
        "Pays more because comparing tariffs and deals feels too effortful",
        "Bank statements go unchecked for months",
        "Never starts refund claims, so loses money they are owed",
        "Signs contracts without reading the terms",
        "Puts off working out a repayment plan as debts build up",
        "Needs a crisis, like a final demand, before tackling paperwork",
        "Pays an accountant or relies on a relative for forms they could understand"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Leaves decisions that need weighing up, like a mortgage or a move, to a partner",
        "Partner handles all forms, letters and official calls",
        "Rows about postponed jobs that need planning or thought",
        "Asks family for the short version instead of reading long messages",
        "Promises to look into a big purchase, like a car, then keeps putting it off",
        "Ducks out of helping relatives with forms or applications",
        "Feels guilty that a partner carries all the thinking jobs"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "Avoids helping with homework that needs explaining",
        "Puts off school applications, consent forms or support paperwork",
        "Skims or skips long school newsletters and emails",
        "Puts off reading reports or support plans about a child's needs",
        "Prefers active play to reading or board games that need concentration",
        "Delays researching childcare, schools or support options"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Closes any web page or message that turns out to be a wall of text",
        "Prefers voice notes and short videos to written information",
        "Puts off setting up online accounts that need several steps",
        "Updating a CV or online profile is put off indefinitely",
        "Picks up the phone to scroll instead of starting a demanding task",
        "Work, tax or benefit portals left unvisited for weeks",
        "Uses templates or AI tools to avoid writing anything from scratch"
      ] },
      { ctx: "leisure", label: "Leisure and hobbies", items: [
        "Rarely reads books; prefers audiobooks, films or podcasts",
        "Gives up on games or hobbies that need learning complex rules",
        "Chooses fast-moving hobbies over ones that need patience and thought",
        "Avoids crosswords, puzzles or strategy games that friends enjoy",
        "Puts off planning holidays because of the research involved",
        "Puts off learning a language or skill that needs regular study"
      ] },
      { ctx: "health", label: "Health and appointments", items: [
        "Never reads medication leaflets or health information",
        "Puts off health questionnaires and screening forms",
        "Delays tests that need forms, preparation or detailed instructions",
        "Avoids record-keeping needed for a long-term condition",
        "Questionnaires for this assessment returned late or only partly done",
        "Avoids diet or exercise plans that need tracking and planning"
      ] },
      { ctx: "conversation", label: "Conversations and meetings", items: [
        "Volunteers for practical roles to avoid taking minutes",
        "Puts off complicated phone calls with banks or councils that need details",
        "Reads meeting papers at the last minute or not at all",
        "Avoids chairing or roles that need long, focused preparation",
        "Asks for the headline only when someone explains something complex"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Feels dread or heaviness before starting a demanding task",
        "Describes a wall between them and getting started",
        "Thinking hard for a long time feels physically tiring or painful",
        "Puts off dull thinking tasks yet spends hours on interesting ones",
        "Only gets going when the deadline makes it urgent",
        "Feels lazy, even though they genuinely want to do the task",
        "Mind goes blank when faced with a long form",
        "Waits for the right mood before starting demanding work",
        "Guilt builds the longer a task is avoided, making it harder to start"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Asks for the toilet or a drink whenever writing is set",
        "Says it is boring or too hard when a long task is given",
        "Does the drawing part of a task and skips the writing",
        "Flicks through pictures during silent reading instead of reading",
        "Loves practical and active lessons, dreads written work",
        "Puts head on the desk when given a long worksheet",
        "Always picks the shortest book in the class library",
        "Avoids maths problems that have many steps",
        "Volunteers as class helper to get out of written tasks"
      ] },
      { ctx: "homework", label: "Homework", items: [
        "Homework becomes a battle at home most evenings",
        "Finds reasons to delay starting homework, like snacks or toys",
        "A short piece of homework takes hours because starting is so hard",
        "Hides homework or says none was set",
        "Resists reading at home, so the reading record stays empty",
        "Tries to bargain down how much homework has to be done",
        "Leaves projects until a parent insists on the night before",
        "Cries or argues when asked to practise spellings or times tables",
        "Will only start homework if an adult sits right beside them"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Gets out of writing thank-you letters or cards",
        "Rarely reads for pleasure, unlike brothers or sisters",
        "Chooses TV or active play over anything that needs thinking",
        "Says 'later' again and again to anything that needs thinking",
        "Avoids helping with recipes or jobs that mean reading the steps"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Avoids jigsaws and building kits that need following instructions",
        "Steers away from games like chess or draughts that need planning",
        "Prefers active games to quiet games that need concentration",
        "Avoids games with a lot of reading, like card games with text",
        "Gives up quickly on puzzles or brain teasers",
        "Picks easy, fast games over ones that need working things out"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "Avoids clubs that involve reading or writing, like book clubs",
        "Avoids music theory and practice, prefers to play by ear",
        "Drops activities once they move from fun to effortful learning",
        "Skips badges or awards that need written work",
        "Enjoys sport but will not learn tactics or rules"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "'Reluctant to put pen to paper'",
        "'Avoids tasks that require concentration'",
        "'Needs encouragement to begin written work'",
        "'Does not read at home'",
        "'Prefers practical activities to written work'",
        "'Uses avoidance strategies to get out of tasks'",
        "'Puts minimum effort into longer tasks'",
        "Parent: 'Homework was a fight every single night'"
      ] },
      { ctx: "teen", label: "Secondary school and college (12-17)", items: [
        "Revision avoided until the last days before exams",
        "Chose subjects with less written coursework",
        "Avoids set texts and relies on film versions or summaries",
        "Coursework drafts not started until the deadline",
        "Skips lessons that involve long written tasks",
        "Spends hours gaming but cannot face twenty minutes of revision",
        "Leaves online homework until the system closes at the deadline",
        "Looks up answers online rather than working through long problems",
        "Asks parents to fill in college or job application forms",
        "Avoids reading the driving theory book despite wanting to drive"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "How many tasks are you putting off right now?",
      "In a typical week, how often do you avoid or delay something that needs hard thinking?",
      "How often do you start demanding tasks only when a deadline forces you?",
      "Is it most days, or only with the occasional big task?",
      "How often does someone else end up doing these tasks for you?"
    ] },
    { k: "severity", label: "How severe", items: [
      "What is the most important thing you have avoided, and what happened?",
      "Have you had fines, penalties, lost money or missed opportunities because of avoidance?",
      "Have you turned down jobs, courses or promotion because of the paperwork or reading involved?",
      "How long have your oldest unopened letters or unstarted tasks been waiting?",
      "Does avoidance cause you serious stress or panic as deadlines approach?",
      "Have you ever lost a job, course place or benefit because something was not done?"
    ] },
    { k: "pervasive", label: "In more than one setting", items: [
      "Does this happen at work, at home and with personal paperwork?",
      "Is it the same with tasks for other people as with your own?",
      "Are there demanding tasks you do not avoid? What makes them different?",
      "Is it only reading and writing, or also planning, sorting and other thinking jobs?",
      "Was it the same in previous jobs, courses or homes?"
    ] },
    { k: "duration", label: "How long", items: [
      "How long have you put off tasks like this?",
      "Was there a time when you got on with demanding tasks easily?",
      "Has it been like this for at least the last six months?",
      "Did it start or get worse after a particular change, illness or loss?",
      "Were you like this as a teenager and young adult?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Compared with friends or colleagues, do you put things off more?",
      "Do people around you get paperwork done that you would leave?",
      "Has anyone commented that you leave things later than others?",
      "Do others in the same job manage the written side more easily?",
      "In your family, are you the one known for avoiding the thinking jobs?"
    ] },
    { k: "impact", label: "Effect on life", items: [
      "What has avoidance cost you, in money, work, study or relationships?",
      "How does it affect your partner or the people you live with?",
      "Has it limited your career or education?",
      "How do you feel about yourself when you think of the tasks you are avoiding?",
      "Has it led to debt, penalties, legal trouble or losing a benefit?",
      "What would be different if you could start demanding tasks when you meant to?"
    ] },
    { k: "compensation", label: "Coping strategies and their cost", items: [
      "What do you do to get yourself started on demanding tasks?",
      "Do you rely on deadlines, a partner, colleagues or paid help?",
      "Do you only start when you are panicking? What does that cost you?",
      "Have you chosen jobs or roles to avoid desk work or paperwork?",
      "Do you use caffeine, music, rewards or working beside someone to get going?",
      "What happens when those supports are not there?"
    ] },
    { k: "onset", label: "When it started", items: [
      "What was homework like at primary school? Was it a battle?",
      "Did you try to get out of reading or writing as a child?",
      "Did teachers say you were reluctant or needed encouragement to start?",
      "Was it there before any problems with mood, drugs or alcohol?",
      "Can you give me an example from before age 12?"
    ] }
  ],
  informant: {
    partner: [
      "Does your partner put off tasks that need a lot of thinking, such as forms or paperwork?",
      "Who deals with the post, bills, forms and official letters in your home?",
      "Do they leave letters unopened or tasks unstarted for long periods?",
      "Do they only start demanding tasks when a deadline is very close?",
      "Do they do easy jobs first and leave the hard ones?",
      "Do they avoid reading anything long?",
      "Can they focus for hours on things they enjoy but not on dull tasks?",
      "Has their avoidance caused money, work or legal problems?",
      "Do they avoid these tasks even when they are well and not stressed?",
      "Is it the same at work, as far as you know?",
      "Have they always been like this since you have known them?"
    ],
    parent: [
      "As a child, was homework a struggle or a battle?",
      "Did they try to get out of reading, writing or schoolwork?",
      "Did they find ways to delay starting homework?",
      "Did they read for pleasure, compared with brothers, sisters or friends?",
      "Did they prefer practical or active tasks to anything that needed concentration?",
      "Did they avoid games or hobbies that needed patience or planning?",
      "Did teachers say they were reluctant to start work?",
      "Could they concentrate well on things that interested them?",
      "Did they avoid tasks they could do, or only tasks they found too hard?",
      "At what age did you first notice this?",
      "Did they need an adult beside them to get started?"
    ],
    school: [
      "Reluctant writer",
      "Avoids tasks that need concentration",
      "Needs encouragement to begin work",
      "Prefers practical activities",
      "Does not read at home",
      "Homework rarely attempted without support",
      "Uses avoidance strategies"
    ],
    teacher: [
      "Very reluctant to start written tasks",
      "Finds reasons to leave the room when writing is set",
      "Does the drawing but not the writing",
      "Says it is boring or too hard before trying",
      "Engages well in practical lessons",
      "Homework is rarely attempted without support at home"
    ]
  },
  counts: [
    "Demanding mental tasks are avoided, delayed or dreaded most weeks, clearly more than peers of the same age and situation.",
    "The avoidance is driven by the strain of keeping mental effort going, not by fear, lack of skill or not caring about the outcome.",
    "It covers several kinds of demanding task (paperwork, reading, writing, planning), in at least two areas of life.",
    "It has lasted at least six months and is a long-standing pattern.",
    "It causes problems: penalties, missed deadlines, lost money or opportunities, career limits, or others taking over.",
    "It is present when the person is well, rested and not in a low mood.",
    "Score Present when demanding tasks get done only through deadline panic, a partner taking over or paid help, at a clear cost.",
    "Life choices made to avoid sustained mental effort (practical jobs, turning down promotion) support scoring it, alongside other evidence.",
    "For childhood, homework battles, avoiding reading and writing, or needing an adult to get started were noticed before about age 12."
  ],
  notCount: [
    "Avoids only tasks they cannot do because of a reading, writing or maths difficulty or poor eyesight, but tackles other demanding tasks.",
    "Avoidance driven by anxiety, perfectionism or fear of judgement, where effort itself is not the problem.",
    "Avoids everything, including things once enjoyed, during a depressive episode, with normal effort when well.",
    "Fatigue after mental effort from a physical illness (long COVID, ME-CFS, anaemia, thyroid disease) rather than aversion to the effort.",
    "Daytime sleepiness from poor or disrupted sleep that makes all concentration hard.",
    "Deliberate refusal out of opposition or hostility (will not, rather than cannot face the effort). The DSM-5-TR note on oppositional behaviour applies to every symptom.",
    "Tasks in a second language or after interrupted schooling, where the barrier is language or education.",
    "Reasonable dislike of paperwork that still gets done on time without significant cost.",
    "Low motivation only when using cannabis or alcohol, or only during withdrawal.",
    "Only in one disliked job or subject, with steady effort in other demanding tasks.",
    "New in later life with no earlier history: consider depression, cognitive decline or sensory loss.",
    "Starting and then dropping a task belongs to A1d (follow-through), and disorganised planning belongs to A1e. Score here when the task is avoided or delayed before it starts."
  ],
  anchors: [
    { score: "yes", quote: "There's been a letter from the tax office in my drawer for six months. I know it matters, I just can't make myself open it. My partner does all our paperwork now, and I turned down team leader because of the reports.", why: "Present. Strong avoidance of effortful paperwork, impact on money and career, and reliance on a partner. Check it is the effort, not fear of what the letter says, and confirm it is long-standing." },
    { score: "yes", quote: "I can spend six hours in my workshop, but give me a ten-page document and I'll do anything else. I've always been like that. At school I did the practical bits and dodged the writing.", why: "Present. Avoidance is specific to sustained mental effort, with good focus on interesting tasks and a childhood history." },
    { score: "yes", quote: "I start every essay the night before. I sit down a week early with the best intentions and end up cleaning the whole flat instead.", why: "Present, if it is long-standing and costly. Typical delay of demanding work until urgency arrives. Check it extends beyond study." },
    { score: "unsure", quote: "I hate paperwork, but I do get it done.", why: "Unsure, leaning towards Absent. Ask how late, at what cost, and whether others help. If it is done on time without much cost, score Absent." },
    { score: "unsure", quote: "I put things off because I'm scared they'll be wrong and people will judge me.", why: "Unsure. This sounds driven by anxiety. Ask whether they also avoid demanding tasks nobody will see. Score Present only if effort is the main barrier." },
    { score: "unsure", quote: "Reading is hard for me. The words seem to jump about on the page.", why: "Unsure. Consider dyslexia or a visual problem. Ask whether they avoid demanding tasks that involve no reading, such as planning or complex practical jobs." },
    { score: "no", quote: "I don't enjoy my tax return, but I book a Saturday each year and get it done.", why: "Absent. Normal dislike, with tasks completed on time and no impact." },
    { score: "no", quote: "Since my depression started last year I can't face anything, even things I used to love.", why: "Absent for this symptom. Global loss of drive tied to a mood episode. Record under the depression differential." },
    { score: "no", quote: "I avoid forms because my English isn't good enough yet. In my own language I deal with everything.", why: "Absent. The barrier is language. Ask about demanding tasks in their first language." }
  ],
  mimics: [
    { ddx: "dep", clue: "Avoids all tasks, including enjoyable ones, alongside low mood and loss of pleasure.", ask: "Do you also avoid things you used to enjoy, or only dull, demanding tasks?" },
    { ddx: "gad", clue: "Avoids tasks because of worry about the outcome or making mistakes.", ask: "If nobody would ever check the result, would it still be hard to start?" },
    { ddx: "social", clue: "Avoids tasks that involve being judged or contacting people, such as phone calls or presentations.", ask: "Is it the thinking effort you avoid, or the contact with other people?" },
    { ddx: "sld", clue: "Avoids only reading, writing or maths tasks.", ask: "Do you avoid demanding tasks that involve no reading or writing, like planning a trip or a complex practical job?" },
    { ddx: "idd", clue: "Tasks are beyond their level of understanding, across many areas of life.", ask: "When you do start these tasks, can you complete them correctly?" },
    { ddx: "postviral", clue: "Mental effort brings marked fatigue or a crash afterwards.", ask: "What happens to your energy the day after a long stretch of mental work?" },
    { ddx: "osa", clue: "Daytime sleepiness and snoring make concentration exhausting.", ask: "How sleepy are you during the day, and does the avoidance ease when you have slept well?" },
    { ddx: "sensory", clue: "Avoids reading because of eye strain, headaches or poor vision.", ask: "When did you last have an eye test? Do you get headaches or blurred vision when reading?" },
    { ddx: "ocd", clue: "Cannot start because the task must be done perfectly or in a set way.", ask: "Is it hard to start because of the effort, or because it has to be exactly right?" },
    { ddx: "feigning", clue: "Avoidance described mainly where there is a clear gain (exemptions, extra time) and contradicted by records or informants.", ask: "Walk me through the last task you put off: what it was, when it was due, and how it ended." }
  ],
  special: {
    women: "Girls and women often hide avoidance by catching up in secret late at night or in last-minute bursts, and may be labelled lazy or anxious. Ask about hidden late nights, panic near deadlines and parents or partners quietly taking over tasks.",
    older: "Older adults may have arranged life so a partner handles all paperwork, and avoidance becomes visible only after bereavement or separation. New reluctance to tackle mental tasks in later life suggests depression, cognitive decline or sensory loss rather than lifelong ADHD.",
    highIQ: "Able people can leave tasks to the last minute and still do well, so avoidance looks like a quirk until demands rise. Ask what results would have been with steady work, and how much stress the last-minute pattern causes.",
    sud: "Cannabis and alcohol increase avoidance and reduce drive, and some people use stimulants or caffeine to force themselves through avoided work. Ask what the pattern was before regular use and whether substances are used to get through dull tasks.",
    asd: "Autistic people may avoid tasks that are unclear, socially demanding or outside their interests, or show a wider avoidance of demands. In ADHD the avoided task is defined by effort and low interest, and becomes possible with urgency or novelty.",
    culture: "Expectations around reading and form-filling depend on education and language, and avoiding written tasks in a second language or after interrupted schooling is not ADHD. Ask about demanding tasks in the person's first language and in practical areas.",
    young: "Check reading, writing and maths skills first: a child who avoids work they cannot do may have a specific learning difficulty, which can also exist alongside ADHD. Anxious or perfectionist children, often girls, avoid tasks for fear of getting them wrong, so ask why the task is avoided. Teenagers often hide avoidance with late-night catch-up, so ask parents what homework really costs the family."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A1f, paraphrased",
    "ICD-11 CDDR 6A05 (WHO 2024), inattention features (low-stimulation and low-reward tasks), paraphrased",
    "Kooij JJS et al. Updated European Consensus Statement on adult ADHD. Eur Psychiatry 2019;56:14-34",
    "DIVA 2.0 structure (Kooij and Francken 2010); wording original",
    "ASRS v1.1 Part A item 4 (WHO, Kessler et al. 2005)",
    "Clinical practice",
    "NICE NG87 1.2.2 (under-recognition in girls), 1.3.5 (criteria adjusted for age) and 1.3.6 (children's views)",
    "Parent, young person and teacher questions, teacher comments and young-person notes: clinical practice"
  ]
}]);
