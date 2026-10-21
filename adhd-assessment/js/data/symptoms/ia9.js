/* ia9: Forgetful in daily activities. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "ia9",
  dim: "IA",
  codes: { dsm5: "A1i", diva: "A9", asrs: [3] },
  title: "Forgetful in daily activities",
  criterion: "Often forgets everyday tasks and plans, such as chores and errands; for older teenagers and adults this includes calling people back, paying bills and turning up to appointments. The forgetting is frequent, involves routine things, and is more than for others of the same age.",
  adultForm: "In adults this shows as missed appointments, unpaid bills and late fees, calls and messages never returned, forgotten birthdays and promises, and forgetting to collect children, take medicines or bring what is needed. DSM-5-TR gives returning calls, paying bills and keeping appointments as adult examples. Many adults rely on phone alarms, lists, notes on their hand or a partner's reminders, and still miss things when the system slips.",
  why: "This is mainly a failure of prospective memory: remembering to do something at the right moment. Weak attention when the plan is made and weak working memory mean the intention is not stored or not recalled when it is needed, and a poor sense of time makes future tasks feel far away until they have been missed.",
  ask: {
    adult: "Over the last six months, how often have you forgotten everyday things you meant to do, like appointments, paying bills, calling someone back or jobs around the house? What was the most recent thing?",
    child: "When you were at primary school, how often did you forget things you were meant to do or bring, like taking letters home, bringing your PE kit on the right day, or doing your jobs at home? What happened?"
  },
  rephrase: [
    "What kinds of things slip your mind day to day?",
    "Plain words: do you forget to do things you planned to do?",
    "How many appointments, bills or calls have you missed in the last few months?",
    "Who reminds you about things, and what sort of things do they have to remind you about?",
    "What letters, charges or fines have you had because an appointment or a payment slipped your mind?",
    "How often do you walk into a room and not remember why you went in? Tell me about the last time.",
    "Everyone forgets things sometimes. Do you forget more often than people around you, or more important things?",
    "What would happen to your week if your phone reminders stopped working?",
    "For someone using English as a second language: Paying money, going to the doctor, calling people back. What do you forget to do? How often?",
    "Tell me about the last time you forgot something that really mattered.",
    "If I asked your friends whether you remember birthdays, call back or turn up to plans, what would they say?",
    "How do you keep track of things you need to do, and how well does it work?",
    "Informal: how often do you have an 'oh no, that was today' moment? When was the last one?"
  ],
  examples: {
    adult: [
      { ctx: "health", label: "Health and appointments", items: [
        "Misses GP, dentist or hospital appointments",
        "Gets letters or charges for not turning up to appointments",
        "Forgets to take regular medicines, or cannot tell if they took them",
        "Forgets to use inhalers, creams or eye drops as prescribed",
        "Forgets to book check-ups, screening tests or eye tests",
        "Forgets to go for blood tests after being asked",
        "Forgets to cancel appointments they know they cannot make",
        "Forgets to collect prescriptions from the pharmacy",
        "Forgets follow-up tasks such as booking physio or starting prescribed exercises",
        "Forgets to ring back to book a follow-up"
      ] },
      { ctx: "admin", label: "Paperwork and money", items: [
        "Forgets to pay bills and gets late fees or reminder letters",
        "Has had the phone, internet or another service cut off after missed payments",
        "Forgets to renew insurance, vehicle tax or licences on time",
        "Forgets to cancel free trials and subscriptions before they charge",
        "Forgets to send forms back before the deadline",
        "Forgets to tell the bank, council or benefits office about changes",
        "Has had a parking fine doubled because the first notice was forgotten",
        "Forgets to transfer money they promised to pay someone",
        "Forgets to submit tax returns or expense claims on time",
        "Sets up direct debits for everything so payments cannot be forgotten"
      ] },
      { ctx: "home", label: "Home and household", items: [
        "Forgets washing in the machine until it smells",
        "Forgets to put the bins out on collection day",
        "Leaves the hob, oven or iron on after finishing",
        "Walks into a room and cannot remember why",
        "Forgets to lock the door or shut windows when going out",
        "Forgets the one thing they went to the shop to buy",
        "Forgets to feed pets or water plants",
        "Forgets the bath is running until it nearly overflows",
        "Forgets household jobs they agreed to do, even after a reminder that morning",
        "Writes a shopping list, then leaves it at home",
        "Locks themselves out because the keys were left inside"
      ] },
      { ctx: "work", label: "Work", items: [
        "Forgets meetings or turns up late because the diary was not checked",
        "Forgets to reply to emails or call clients back",
        "Forgets tasks agreed in a meeting by the end of the day",
        "Forgets daily work routines, like locking up or switching off equipment",
        "Forgets to pass on messages to colleagues",
        "Forgets to bring the tools, uniform or ID needed for the shift",
        "Forgets to submit timesheets, so pay is late",
        "Forgets deadlines unless a manager chases them",
        "Forgets to complete mandatory training or renew certificates",
        "Forgets to clock in or out"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Forgets birthdays and anniversaries, even of close family",
        "Forgets promises such as picking something up on the way home",
        "Forgets plans the couple made together for the weekend",
        "Partner keeps a shared calendar and reminds them every day",
        "Forgets to call parents or relatives back for weeks",
        "Forgets to pass on messages between family members",
        "Partner feels uncared for when requests are forgotten again",
        "Forgets to send cards or presents in time"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "Forgets to collect a child from school, nursery or a club",
        "Forgets non-uniform days, PE days or money for school trips",
        "Forgets to sign and return permission slips",
        "Forgets parents' evenings or school performances",
        "Forgets to pack the child's lunch, homework or kit",
        "Forgets the child's vaccinations or dental check-ups",
        "Leaves holiday childcare until the last minute because it was forgotten",
        "Children have learnt to remind the parent about their own events",
        "Forgets a treat or outing they promised a child"
      ] },
      { ctx: "social", label: "Friends and social life", items: [
        "Forgets plans with friends and does not turn up",
        "Double-books evenings because an earlier arrangement was forgotten",
        "Forgets to ring friends back, until the friends stop calling",
        "Forgets to give back borrowed items or money",
        "Friends call them unreliable or flaky because plans slip their mind",
        "Forgets to reply to invitations for weddings or parties",
        "Forgets to ask how a friend's big day went",
        "Remembers a friend's request only after the moment has passed"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Has dozens of phone alarms and reminders running each day",
        "Forgets to charge the phone, so it dies when needed",
        "Snoozes reminders and then forgets the task anyway",
        "Forgets to take the phone off silent and misses calls all day",
        "Reads a message, means to reply later and never does",
        "Sets up a calendar app and then forgets to look at it",
        "Forgets to collect parcels from lockers or depots until they are sent back",
        "Forgets to top up travel cards, phone credit or meter keys"
      ] },
      { ctx: "driving", label: "Driving and travel", items: [
        "Means to stop for fuel on the way home and drives straight past",
        "Turns back after setting off, to collect things they forgot to take",
        "Forgets to pay for parking or tolls and gets fines",
        "Forgets car servicing, tyre checks or the annual test date",
        "Drives the usual route to work when they meant to go somewhere else",
        "Forgets to book tickets until prices have gone up",
        "Forgets to pack essentials such as chargers, medicines or passport for trips"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "Forgets assignment deadlines despite having written them down",
        "Forgets to register for exams or modules",
        "Forgets tutor meetings or supervision sessions",
        "Forgets to bring the right books or materials to sessions",
        "Forgets to read the set material before a seminar",
        "Forgets to apply for funding or bursaries on time"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Suddenly remembers, too late, something that had to be done",
        "Carries a constant background feeling of having forgotten something",
        "Plans vanish from mind seconds after deciding to do them",
        "Feels ashamed when others have to remind them yet again",
        "Has to act on a job the moment it comes to mind, or it is gone",
        "Writes reminders on their hand because nothing else sticks",
        "Loses track of what they were doing partway through a task",
        "Feels that if something is out of sight, it no longer exists",
        "Checks lists and diaries many times a day just to feel safe"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Forgets to hand in homework that is done and in the bag",
        "Forgets instructions given a few minutes earlier",
        "Forgets PE kit on PE day",
        "Forgets to take letters home to parents",
        "Forgets what they were meant to do when sent on an errand by the teacher",
        "Forgets to bring back signed forms and reply slips",
        "Forgets daily routines like hanging up their coat or handing in their reading record",
        "Forgets to go to lunchtime clubs or music lessons",
        "Forgets dinner money or packed lunch",
        "Forgets which day the spelling test is"
      ] },
      { ctx: "homework", label: "Homework", items: [
        "Forgets that homework was set at all",
        "Forgets to bring home the books needed for homework",
        "Forgets to write homework in the planner",
        "Forgets to practise spellings or reading even with a chart on the wall",
        "Forgets the due date and rushes homework the night before, or not at all",
        "Forgets to show parents the homework diary for signing",
        "Starts homework and forgets partway what the task was"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Needs reminding every morning to brush teeth and get dressed",
        "Forgets daily jobs such as feeding the pet or setting the table",
        "Goes upstairs to fetch something and comes back without it",
        "Forgets to flush the toilet or wash hands",
        "Forgets to tell parents important news from school",
        "Forgets to come home at the agreed time",
        "Leaves taps running or lights on after leaving a room",
        "Forgets messages they were asked to pass on",
        "Forgets to bring home things they took to school or to a friend's house"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Forgets arrangements to meet friends",
        "Forgets to bring the ball or game they promised to bring",
        "Forgets promises made to friends",
        "Forgets to return things borrowed from friends",
        "Forgets friends' birthdays or party invitations",
        "Forgets what they were sent to fetch during a game"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "Forgets swimming kit, boots or instrument on the day of the activity",
        "Forgets what time clubs start and turns up late",
        "Forgets to practise their instrument between lessons",
        "Forgets the coach's instructions between drills",
        "Forgets which day an activity is on",
        "Forgets to tell parents when they need collecting"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "Report says they need frequent reminders to bring things and hand work in",
        "Teacher wrote that they forget equipment or homework",
        "Parents put checklists on the door and still had to remind them",
        "Parents say they repeated the same reminders every day",
        "Report says they must remember to bring the right things",
        "Teacher described them as scatty or forgetful",
        "Parents recall many notes home about missed deadlines",
        "Grandparents or older siblings did the remembering for them"
      ] },
      { ctx: "teen", label: "Secondary school (12-16)", items: [
        "Forgets coursework deadlines and exam dates",
        "Forgets to revise for tests until the night before",
        "Forgets to charge their phone or top up the bus pass",
        "Forgets curfews or arrangements with parents",
        "Forgets detentions, which then get doubled"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "How many appointments or commitments have you missed in the last six months?",
      "How often does someone need to remind you about something?",
      "In a typical day, how many things do you forget to do?",
      "How often do you walk into a room and not know why?",
      "How often do you forget to reply to messages or calls?",
      "Is it daily, weekly, or only now and then?"
    ] },
    { k: "severity", label: "How bad", items: [
      "What is the most serious thing you have forgotten?",
      "Have you had fines, late fees, debts or services cut off because you forgot?",
      "Have you ever forgotten to collect a child or someone who depended on you?",
      "Have you forgotten medicines in a way that affected your health?",
      "Have you been disciplined at work for missed tasks or meetings?",
      "Has forgetting put you or anyone else at risk, for example leaving the hob on?"
    ] },
    { k: "pervasive", label: "In different places", items: [
      "Does this happen at work, at home and with friends?",
      "Do you forget things you care about, as well as things you don't like doing?",
      "Is it the same on holiday or at weekends?",
      "Do you forget only certain kinds of things, or all sorts?",
      "Does it happen with things that really matter to you, like your children's events?"
    ] },
    { k: "duration", label: "How long it has been going on", items: [
      "How long have you been forgetful like this?",
      "Was there ever a time when you remembered things easily?",
      "Did it start after a particular event, illness, injury, pregnancy or new medicine?",
      "Has it changed over time, better or worse?",
      "Was it the same when you were a teenager?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Do you forget more than friends or colleagues your age?",
      "Do other people seem to remember things without needing alarms?",
      "Do people comment on how forgetful you are?",
      "Would your friends call you reliable at remembering plans?",
      "In your family, who remembers birthdays and appointments? Why them?"
    ] },
    { k: "impact", label: "Effect on life", items: [
      "What has forgetting cost you, in money, jobs or relationships?",
      "Has it affected your health care, such as missed appointments or medicines?",
      "How do people around you react when you forget?",
      "Have you lost friendships or been seen as unreliable?",
      "Has it affected your children or others who depend on you?",
      "How does it make you feel about yourself?"
    ] },
    { k: "compensation", label: "Ways of coping", items: [
      "What do you do to help yourself remember?",
      "How many alarms or reminders do you use in a day?",
      "Does someone else keep track of things for you?",
      "Do you write on your hand, use sticky notes or keep lists?",
      "What happens when you lose the list or your phone dies?",
      "How much time and effort do these systems take?"
    ] },
    { k: "onset", label: "When it started", items: [
      "Were you forgetful at primary school, for example with kit, homework or messages?",
      "Did parents or teachers have to remind you more than other children?",
      "Did you have checklists or someone checking your bag?",
      "Do your school reports mention forgetting?",
      "When do you first remember it being a problem?"
    ] }
  ],
  informant: {
    partner: [
      "How often does your partner forget appointments, bills or plans?",
      "Do you remind them about things? How often?",
      "Have they forgotten something important, like collecting a child or paying a bill?",
      "Do they forget to reply to calls or messages?",
      "Do they forget birthdays, anniversaries or promises?",
      "Do they walk into rooms and forget why?",
      "Do they use lots of alarms or lists? Do they still forget?",
      "Have they had fines or late fees because something was forgotten?",
      "How does their forgetting affect you and the family?",
      "Have they been like this for as long as you have known them?",
      "Is it more than other adults you know?"
    ],
    parent: [
      "Did your child need more reminders than other children?",
      "Did they forget PE kit, homework or reading books on the right day?",
      "Did letters from school actually reach you?",
      "Did they forget daily routines like brushing teeth or getting dressed?",
      "Did they forget jobs you asked them to do?",
      "Did they forget to come home on time or forget arrangements?",
      "Did you use charts or lists? Did they help?",
      "Did teachers comment on forgetfulness?",
      "Compared with brothers, sisters or other children, were they more forgetful?",
      "When did you first notice this?",
      "Did it carry on into secondary school?"
    ],
    school: [
      "Needs frequent reminders",
      "Often forgets homework or equipment",
      "Must remember to bring the correct kit",
      "Forgets instructions",
      "Needs to take more responsibility for remembering",
      "Homework often not handed in",
      "Relies on adults to remember for them"
    ]
  },
  counts: [
    "Forgetting of routine daily tasks, plans or commitments happens often: at least most weeks, usually several times a week.",
    "It involves things adults are expected to remember: appointments, bills, calls, messages, collecting people, chores and medicines.",
    "It is more than peers of the same age, judged by the patient and ideally by an informant.",
    "It is seen in more than one setting, for example at home and at work or study, or in social life.",
    "It has consequences: missed appointments, fees and fines, conflict, warnings at work, or health and safety risks.",
    "It includes things the person cares about, not only tasks they dislike.",
    "It is longstanding, and for the childhood rating there was forgetting of kit, homework, messages or routines at primary school age.",
    "It persists despite effort, or is kept in check only by heavy compensation (many alarms, lists, a partner's reminders). Score what happens without that support, and record its cost.",
    "It is present when mood, sleep and stress are reasonable."
  ],
  notCount: [
    "Occasional forgetting that most people have, especially at very busy times.",
    "Memory problems that began recently with a clear start (head injury, new medicine, menopause, illness, heavier drinking).",
    "New forgetfulness in mid or later life with other changes such as repeating questions or getting lost: assess for cognitive impairment or dementia.",
    "Forgetting only during depressive episodes, burnout or a period of high stress.",
    "Selective 'forgetting' only of tasks the person does not want to do: consider avoidance (A1f) or opposition rather than memory.",
    "Memory gaps from alcohol blackouts, sedatives or other substances.",
    "Lapses caused by daytime sleepiness from sleep apnoea, insomnia or shift work.",
    "Memory gaps linked to dissociation or trauma.",
    "Low literacy, limited English or not understanding letters and forms, rather than forgetting.",
    "Missing appointments because letters never arrived, or because there is no phone, internet or calendar access.",
    "Brief gaps in awareness from seizures, such as absence or focal seizures.",
    "Forgetting described only in settings with a clear gain, and not matching daily functioning reported by others."
  ],
  anchors: [
    { score: "yes", quote: "I've missed the dentist twice this year, I pay late fees most months, and my parking fine doubled because I forgot to pay the first letter. My partner set up a shared calendar but I forget to look at it, so now they text me every morning.", why: "Yes. Frequent forgetting of routine obligations (appointments, bills) with consequences, despite support from others." },
    { score: "yes", quote: "I've got about fifteen alarms a day. If my phone dies, I'm finished. Even with all that I forgot my son's parents' evening last month.", why: "Yes. Heavy compensation that still fails, and the effort itself is a cost." },
    { score: "yes", quote: "Mum says she had to remind me every morning to brush my teeth until I was 11, and I never had my PE kit. Now it's work: I promise to send things and they just go out of my head.", why: "Yes. Longstanding, with childhood and adult examples and impact at work." },
    { score: "unsure", quote: "I'm a bit scatty, I suppose, but I don't miss anything important.", why: "Unsure. Ask about compensation and whether others do the reminding; check with an informant." },
    { score: "unsure", quote: "Since the menopause my memory has gone to pieces. I was never like this before.", why: "Unsure, leaning No. Recent onset with a likely cause; ask carefully about childhood and earlier adult life before deciding, as both can be present." },
    { score: "unsure", quote: "I forget the paperwork stuff, but anything to do with the kids I always remember.", why: "Unsure. Forgetting only disliked tasks may be avoidance (A1f). Explore whether other areas are affected." },
    { score: "no", quote: "I use a diary like everyone does, and I can't remember the last time I missed something.", why: "No. Ordinary diary use that works." },
    { score: "no", quote: "Since my head injury two years ago I can't remember anything. Before that I ran a business without any problems.", why: "No for ADHD. Clear acquired onset; assess for acquired brain injury." },
    { score: "no", quote: "My memory's been bad since I started drinking more. When I stopped for a month it was much better.", why: "No. Linked to alcohol and improves with abstinence." }
  ],
  mimics: [
    { ddx: "dep", clue: "Forgetting started with low mood, poor sleep and slowed thinking.", ask: "Were you this forgetful before your mood dropped?" },
    { ddx: "mci", clue: "New forgetting in later life: repeating questions, forgetting recent conversations, getting lost.", ask: "Is this a change from how you used to be? Are others worried about your memory?" },
    { ddx: "menopause", clue: "Brain fog with hot flushes, broken sleep and changing periods, starting in midlife.", ask: "Did the forgetting start or get worse around changes in your periods or hot flushes?" },
    { ddx: "thyroid", clue: "Tiredness, weight change, feeling cold and slowed thinking, with a recent onset.", ask: "Alongside the forgetting, have you noticed tiredness, feeling cold, weight gain or dry skin, and when did these start?" },
    { ddx: "osa", clue: "Snoring, waking unrefreshed, daytime sleepiness, morning headaches.", ask: "Do you snore or stop breathing in your sleep? Do you nod off during the day?" },
    { ddx: "sud_alcohol", clue: "Memory gaps after drinking; forgetting worse after heavy use.", ask: "Is your memory better when you have not been drinking?" },
    { ddx: "meds", clue: "Started after sedatives, antihistamines, anticholinergic drugs, antiepileptics or opioids.", ask: "Did anything change in your medicines before this started?" },
    { ddx: "tbi", clue: "Clear onset after a head injury, stroke or brain infection.", ask: "Have you had a head injury or serious illness? Were you like this before it?" },
    { ddx: "postviral", clue: "Forgetfulness and fatigue after an infection such as COVID-19, with crashes after effort.", ask: "Did this start after an illness? Does it get worse after physical or mental effort?" },
    { ddx: "epilepsy", clue: "Brief blank spells, staring episodes or losing track of time.", ask: "Have you or others noticed moments when you blank out?" }
  ],
  special: {
    women: "Women often carry the household's mental load and may cope through rigid planning, so ask how much effort it takes. Forgetting may first worsen in perimenopause; look for a lifelong pattern before putting it down to hormones alone, and remember both can be present.",
    older: "Forgetfulness is common with ageing and in cognitive decline. Look for a lifelong history from school onwards, use informants, and do a cognitive screen if the pattern is new.",
    highIQ: "Able people may hold a lot in their heads and compensate for years, until demands grow with promotion or parenthood. Ask what happens without their systems and how much effort the reminders take.",
    sud: "Alcohol, cannabis, benzodiazepines and opioids all impair memory. Rate the pattern during sober periods and before use began.",
    asd: "Autistic people may remember well within strict routines but struggle when routines change. In ADHD forgetting happens even within familiar routines. Executive difficulties are common in both and the two can co-occur.",
    culture: "Some cultures place less weight on exact appointment times, and in some families remembering is shared. Ask about consequences in the person's own context, and check literacy and access to letters, phones and calendars."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A1i, paraphrased",
    "WHO ICD-11 CDDR (2024), 6A05 inattention features (forgetful, difficulty remembering upcoming tasks), paraphrased",
    "Kooij JJS et al. Updated European Consensus Statement on diagnosis and treatment of adult ADHD. Eur Psychiatry 2019;56:14-34",
    "DIVA 2.0 structure (Kooij and Francken 2010); all wording original",
    "ASRS v1.1 item 3 (Kessler et al. 2005)",
    "CADDRA Canadian ADHD Practice Guidelines 4.1 (2020), differential diagnosis tables",
    "Clinical practice (examples, probes and anchors)"
  ]
}]);
