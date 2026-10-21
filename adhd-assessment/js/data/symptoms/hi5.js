/* hi5: Always on the go, driven by a motor. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "hi5",
  dim: "HI",
  codes: { dsm5: "A2e", diva: "H/I 5", asrs: [6] },
  title: "Always on the go, 'driven by a motor'",
  criterion: "Is often on the go and seems to run on an engine that will not switch off. The person cannot stay still, or is uncomfortable staying still, for long stretches such as a meal out or a meeting, and other people may experience them as restless or hard to keep up with.",
  adultForm: "The DSM-5-TR wording for this item already uses adult settings: being unable, or uncomfortable, to stay still for a long time, for example in restaurants or meetings, with others finding the person restless or difficult to keep up with. Adults describe constant busyness, packed diaries, several jobs or projects at once, a fast pace, difficulty stopping to rest and taking on too much until they are exhausted. Many have channelled the drive into physically active jobs, sport or long hours, which can hide it and even earn praise.",
  why: "Thought to reflect poor regulation of arousal and activity level, a strong need for stimulation and weak inhibition of the urge to move on to the next thing. Stopping feels uncomfortable or even aversive, so the person keeps going even when tired, and only stops when they crash.",
  ask: {
    adult: "Over the last six months, how much have you felt that you are always on the go, as if your engine never switches off? What happens when you have to stay still for a long time, like a long meal or a meeting? Can you give me an example?",
    child: "When you were at primary school, between about 5 and 12, how would you describe your energy compared with other children? What did your parents or teachers say about it? Can you remember an example?"
  },
  rephrase: [
    "What do the people close to you say about how much you are on the go?",
    "Take me through a normal day. How much of it are you busy doing something?",
    "How do you feel when you have to stay in one place for an hour or more, for example at a long dinner?",
    "How easy do friends or family find it to keep up with you? What do they say?",
    "In simple words: do you have a lot of energy, and is it hard to stop? Tell me about it.",
    "If you had a whole day with nothing planned, what would you actually do?",
    "What happens when there is a gap in your day with nothing to do?",
    "Lots of people are busy. Is your busyness something you choose, or something you feel you cannot stop?",
    "How much do you tend to take on compared with other people? What makes you say yes to more?",
    "Some people say it feels like an engine inside them that keeps running. How well, or how badly, does that describe you?",
    "How did you choose your jobs and hobbies? Did keeping on the move play a part?",
    "Who in your life finds your pace tiring, and what do they say?",
    "Tell me about your last holiday or day off. How much did you actually rest?",
    "How does your pace compare with the people you live or work with?"
  ],
  examples: {
    adult: [
      { ctx: "work", label: "Work", items: [
        "Works through breaks and lunch because stopping feels wrong",
        "Takes on extra shifts, projects or roles on top of a full workload",
        "Runs two or more jobs or side businesses at once",
        "Chose a job that keeps them moving, like nursing, building, delivery or hospitality",
        "Colleagues say they work at a pace nobody else can match",
        "Struggles in desk jobs that mean sitting for hours",
        "Finds long training days or all-day meetings almost unbearable",
        "Starts early, finishes late, then still does more work at home",
        "Has been told to slow down or take leave by a manager",
        "Leaves jobs that feel too slow or static",
        "Volunteers for every new initiative or committee going at work"
      ] },
      { ctx: "home", label: "Home and household", items: [
        "Cleans, tidies or does DIY late into the night",
        "Rarely sits down in the evening; always up doing something",
        "Gets up at dawn on days off to get started on jobs",
        "Starts the next household job before sitting down to eat",
        "The household runs at their speed and others feel rushed",
        "Cannot let the family have a slow, lazy morning",
        "Does chores at high speed, often several at once",
        "Sees an empty Sunday as a chance for a big project rather than rest",
        "Visitors say they feel tired just watching them"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Partner says being with them is exhausting",
        "Partner wishes they would just sit and watch a film together",
        "Family members keep saying 'slow down' or 'sit down for once'",
        "Plans every weekend full of activities, leaving their partner drained",
        "Relatives find visits tiring because they never stop",
        "Rows about never being at home or never resting",
        "Partner feels they must keep up or be left behind",
        "Partner jokes that they need an off switch"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "Takes the children to several activities a day with no downtime",
        "Children ask to stay home and rest while they want to go out",
        "Finds slow days at home with toddlers very hard",
        "Co-parent says they rush the children from one thing to the next",
        "Finds sitting through a long school play or prize-giving a real struggle",
        "Does everything for the family at once, then suddenly crashes"
      ] },
      { ctx: "social", label: "Friends and social life", items: [
        "Friends say they cannot keep up with them",
        "Books back-to-back social plans most weekends",
        "Wants to move on to the next place after a short time at each",
        "First to arrive and last to leave, then still wants to go on somewhere else",
        "Known in the group as the one with endless energy",
        "Friends need a rest after a day out with them",
        "At slow gatherings like barbecues, ends up finding jobs to do",
        "Always organising the next outing before the current one has ended"
      ] },
      { ctx: "leisure", label: "Leisure and hobbies", items: [
        "Has many hobbies going at once and does each of them intensely",
        "Packs holidays with activities and cannot lie on a beach",
        "On days off rushes from one outing to the next rather than resting",
        "Drawn to extreme or high-energy sports",
        "Walks so fast that companions have to half run to keep up",
        "Comes home from a holiday more tired than before it",
        "Companions on walks or hikes want far more breaks than they do",
        "Long films, plays or concerts feel like an endurance test",
        "Signs up for marathons, triathlons or challenges one after another"
      ] },
      { ctx: "driving", label: "Driving and travel", items: [
        "Drives long distances without stopping because breaks feel like wasted time",
        "Gets off a long flight or train ride desperate to move",
        "Long car journeys as a passenger feel unbearable",
        "Plans travel days packed with sights, leaving companions worn out",
        "On holiday moves on to a new place most days rather than staying put",
        "Squeezes several errands into every trip out, always in a hurry"
      ] },
      { ctx: "conversation", label: "Conversations and meetings", items: [
        "Uncomfortable in any meeting that lasts longer than an hour",
        "Asks for meetings to be held while walking",
        "Feels trapped at long dinners where people sit and talk for hours",
        "Moves through agendas so fast that others feel left behind",
        "Wants to wrap up a coffee with a friend long before they do"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "Combines study with work, sport and volunteering all at once",
        "Finds three-hour lectures or long exams very hard to sit through",
        "Course mates struggle to keep up with their pace on group projects",
        "Signs up for every society, course or extra project on offer"
      ] },
      { ctx: "health", label: "Health and appointments", items: [
        "Ignores illness or injury and just keeps going",
        "Finds recovery after an operation or illness, when rest is needed, very hard",
        "Has picked up injuries from doing too much, too fast",
        "Doctors or physios have said to rest, but they cannot",
        "Pushes through tiredness until they crash and need days to recover",
        "Has burned out more than once after years of overcommitting"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Cannot watch a series without doing online jobs on the phone at the same time",
        "Books classes, trips and plans online late at night to fill the coming week",
        "Uses fitness trackers and goes far beyond the daily targets",
        "Runs several online projects, groups or side hustles at the same time"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Feels as if an engine inside never switches off",
        "Feels uncomfortable whenever there is nothing to do",
        "Feels a constant push to get on to the next thing",
        "Only feels settled when busy and active",
        "Knows they overdo it but cannot slow down",
        "Feels exhausted yet still cannot stop",
        "Rest feels like wasted time",
        "Notices they move and work faster than everyone around them",
        "Feels irritable and trapped when plans fall through and the day is suddenly empty",
        "Schedules every hour of the day so there is never empty time"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Was busy all day at school and rarely still",
        "Teachers said they had boundless energy",
        "Volunteered for every job that meant moving about",
        "Wore out teaching assistants and supply teachers",
        "Came in from playtime still going at full speed",
        "Staff on school trips found them hard to keep up with",
        "Still had energy to spare at the end of the school day when classmates were flagging",
        "Teachers gave them jobs to do just to use up their energy"
      ] },
      { ctx: "homework", label: "Homework", items: [
        "Wanted to rush homework so they could get going again",
        "Homework was squeezed in between clubs and play because they were always busy",
        "Homework only happened after sport had burned off some energy",
        "Parents had to keep calling them back to finish"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "On the go from waking until bedtime",
        "Woke early and was immediately active",
        "Exhausted parents, grandparents and babysitters",
        "Parents struggled to find enough to keep them busy at weekends",
        "Needed far less rest than brothers or sisters",
        "Was still bouncing at bedtime when others were tired",
        "Parents compared them to a battery that never ran down",
        "Long car journeys were a struggle; wanted to be out and moving",
        "Wanted to be out of the house doing something every day of the holidays"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Played at full speed, always on to the next adventure",
        "Friends got tired long before they did",
        "Preferred active games to sitting games",
        "Could play outside for hours and still want more",
        "Wanted to keep going after friends had gone home",
        "Other parents said a play date with them left everyone worn out",
        "Was always the one suggesting a new game to keep things moving"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "Signed up for many clubs and sports at once",
        "Wanted to try every activity on offer at holiday clubs or camps",
        "Wanted to leave restaurants as soon as they had eaten",
        "Trips and days out wore out the adults with them",
        "Was the most energetic child at swimming or football",
        "On holiday was up first, last to bed and always active",
        "Coaches said they never seemed to tire"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "Teachers wrote 'full of energy' or 'never still'",
        "Relatives described them as 'a whirlwind'",
        "Report said they needed to learn to slow down",
        "Parents were told their child was 'hard work' or 'exhausting'",
        "Childminders or after-school club staff found them hard to keep up with",
        "Parents asked the GP or school nurse about their energy levels",
        "Family joked that they had two speeds: flat out and asleep"
      ] },
      { ctx: "teen", label: "Secondary school (12-16)", items: [
        "Had several part-time jobs or sports teams at once",
        "Stayed busy every evening and weekend",
        "Struggled with long exams and study periods",
        "Found long family visits unbearable",
        "Was out and about constantly rather than resting at home",
        "Friends struggled to keep up with their plans and pace"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "How many days a week do you feel on the go from morning to night?",
      "When did you last have a day where you rested properly?",
      "How often do you leave events early or rush meals because you need to move on?",
      "Is this most of the time, or only during busy periods?",
      "In a typical week, how many hours do you spend sitting still by choice?",
      "Does it happen on quiet weeks too, when nothing is pressing?"
    ] },
    { k: "severity", label: "How strong", items: [
      "What happens if you are made to stay still, like a long meal or meeting? What do you feel and do?",
      "Have you overcommitted to the point of exhaustion or illness?",
      "Do other people complain that they cannot keep up?",
      "Can you slow down when you really need to, for example when you are ill?",
      "Has it ever led to injuries or accidents?",
      "How long can you stay still before it becomes uncomfortable?"
    ] },
    { k: "pervasive", label: "In which settings", items: [
      "Is it the same at work, at home and on holiday?",
      "Do you keep going even when you are alone and nobody needs anything?",
      "Are there any situations where you can stay still comfortably? What is different about them?",
      "Is it the same on days without coffee, energy drinks or anything else?",
      "Is it there in good times and bad times, not only when you are stressed?"
    ] },
    { k: "duration", label: "How long", items: [
      "How long have you been like this?",
      "Has this been the same through your adult life, or did it start at some point?",
      "Has there ever been a time when you were not on the go? What was different then?",
      "Has it lasted at least the last six months without stopping?",
      "Does it come and go in spells of days or weeks, or is it always there?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Compared with friends of your age, are you more on the go?",
      "Do friends or colleagues comment on your pace?",
      "Who in your life can keep up with you?",
      "Do you take on more than others in the same job or role?",
      "Is your energy unusual even compared with your family?"
    ] },
    { k: "impact", label: "What it costs", items: [
      "Has your pace caused problems with your partner or family?",
      "Have you burned out or become ill from doing too much?",
      "Has it affected your work, for example in office roles or long meetings?",
      "Have you missed out on rest, sleep or recovery because of it?",
      "Do people avoid spending time with you because it is tiring?",
      "Have you lost money or time by taking on too many things at once?"
    ] },
    { k: "compensation", label: "How you cope or hide it", items: [
      "How do you get through situations where you must stay put for hours?",
      "Have you chosen an active job to cope with it?",
      "Do you fill your diary on purpose so that there is no empty time?",
      "Do you use anything to switch off, like alcohol or cannabis?",
      "What would happen if you stopped all of this for a week?",
      "How tiring is it to keep up this pace?"
    ] },
    { k: "onset", label: "When it started", items: [
      "Were you a high-energy child? What did your family say?",
      "Did teachers comment on your energy at primary school?",
      "Was it there before age 12?",
      "Did it start, or get much worse, at a particular time, such as a stressful period or a change in mood?",
      "Was it there before you started using any drugs, lots of caffeine or a new medicine?"
    ] }
  ],
  informant: {
    partner: [
      "Do they seem to be always on the go?",
      "Can they sit through a long meal or a film without needing to get moving?",
      "Do you find it hard to keep up with them?",
      "Do they actually rest on days off or on holiday?",
      "Do they take on too much?",
      "Have they ever burned out or become ill from overdoing things?",
      "Is their energy fairly constant, or does it come in bursts of days or weeks with less sleep?",
      "Does their pace cause arguments between you?",
      "Is it the same when they are sober and not using caffeine or other stimulants?",
      "Do friends or family comment on their energy?",
      "How do they behave when they are ill or injured?"
    ],
    parent: [
      "Were they more active than other children their age?",
      "Were they on the go from waking to sleeping?",
      "Did they wear out you or other carers?",
      "Could they sit through meals, car trips, services or visits?",
      "Did they need less rest than their brothers or sisters?",
      "Did teachers comment on their energy?",
      "Were they still active at bedtime when they should have been tired?",
      "Did other parents or relatives comment on it?",
      "When did you first notice this? Was it before age 12?",
      "Did anything help, such as sport or being outdoors?",
      "Were there periods when they were much quieter? What was happening then?"
    ],
    school: [
      "'Full of energy' or 'never still' in reports",
      "Notes about difficulty settling after breaks or PE",
      "Comments that they rush or need to slow down",
      "Extra adult support in class to help manage their activity",
      "Notes that they were tiring or 'a handful' on trips",
      "Consistent remarks across several years and teachers"
    ]
  },
  counts: [
    "A constant drive and level of activity on most days, not only around deadlines or busy seasons.",
    "Clear discomfort or real difficulty staying still for long periods, such as meals out, meetings or long journeys.",
    "Other people notice it: they find the person hard to keep up with or tiring to be around.",
    "Usually present across settings: work or study, home, social life and holidays, not only in one demanding role.",
    "A persistent, trait-like pattern rather than spells of days or weeks; most people also describe high energy in childhood (score childhood separately).",
    "Score Present when the person copes by choosing active jobs, heavy exercise or a packed diary: rate the underlying drive, not whether it is now hidden.",
    "There is a cost: exhaustion, burnout, injuries, strain in relationships, or being unable to rest when ill.",
    "Present when mood is stable, the person is sober, and not using cocaine, amphetamine or large amounts of caffeine."
  ],
  notCount: [
    "Periods of high energy that come in episodes with elevated or irritable mood, less need for sleep, big ideas or racing thoughts (consider bipolar disorder or cyclothymia).",
    "Chosen busyness that the person enjoys and can stop easily, with no discomfort when still.",
    "Busyness driven by worry, or used to avoid painful thoughts and memories (consider anxiety, trauma or depression).",
    "High activity only because of a demanding job, a busy season, money worries or caring for small children, with no inner drive and a calmer pace when demands ease.",
    "Energy linked to stimulants, cocaine, high caffeine intake, or steroid or thyroid medication.",
    "Constant movement or exercise to control weight or shape (consider an eating disorder).",
    "Overactivity with weight loss, heat intolerance, tremor and palpitations (check thyroid function).",
    "An urge to move the legs at rest or in the evening that walking relieves (consider restless legs).",
    "An inner urge to move that started with an antipsychotic, antidepressant or other new medicine (consider akathisia).",
    "Overwork driven by perfectionism or rigid rules about using time well, rather than a restless drive.",
    "A new pattern that began in adulthood with no similar trait earlier in life: look for another cause (mood, substances, thyroid, new demands) before scoring.",
    "Scoring error: fidgeting belongs to hi1, getting up from a seat to hi2, an inner restless feeling or needing exercise to settle to hi3, and noise or not unwinding quietly in free time to hi4. Score hi5 for the overall drive, pace and discomfort with long still periods."
  ],
  anchors: [
    { score: "yes", quote: "My partner says I'm exhausting. I'm up at six, gym, work, then I'm fixing something or out on the bike. On holiday I can't do the pool, I need a plan for every day. My mum says I never stopped as a kid.", why: "Score Present: a constant drive across settings, discomfort with rest, others cannot keep up, and the same pattern in childhood." },
    { score: "yes", quote: "I'm a paramedic and I love it, because sitting still is torture. When I had an office job for a year I was miserable and wandering about all day. My friends say they can't keep up with me.", why: "Score Present: the active job is a way of coping; the office year shows the discomfort with stillness, and peers comment on it." },
    { score: "yes", quote: "Long meals out are a nightmare, I'm desperate to go by dessert. I've burned out twice from taking on too much and I still can't say no to anything. Teachers used to call me a whirlwind.", why: "Score Present: discomfort with long still periods, repeated overcommitment with a clear cost, and a childhood history." },
    { score: "unsure", quote: "I'm very busy, but that's because I've got three kids and a full-time job.", why: "Unsure: the busyness may be situational. Ask what they are like when there are no demands, for example a weekend when the children are away, and before they had children." },
    { score: "unsure", quote: "I keep busy so I don't think about stuff. If I stop, I start crying.", why: "Unsure, probably No: activity seems to be used to avoid painful feelings (consider depression or trauma). Ask about childhood and the years before the difficulties began." },
    { score: "unsure", quote: "I drink about six coffees a day and I'm buzzing all the time.", why: "Unsure: caffeine may be driving it, or may be self-medication. Ask what they are like on days with little caffeine and what they were like before they drank coffee." },
    { score: "no", quote: "I'm quite laid back really. I like a long Sunday lunch and a nap afterwards.", why: "Score No: comfortable with stillness and rest." },
    { score: "no", quote: "Every few months I get spells of a week or two where I'm on the go day and night, barely sleep and feel on top of the world. In between I'm normal.", why: "Do not score for ADHD: an episodic pattern with little sleep and high mood points to bipolar disorder. Assess mood fully." },
    { score: "no", quote: "Since I started my thyroid tablets I can't keep still, I'm losing weight and sweating all the time.", why: "Do not score: a recent change with physical signs suggests too much thyroid hormone. Arrange thyroid tests and review." }
  ],
  mimics: [
    { ddx: "bip", clue: "Spells of increased energy and activity with less need for sleep, elevated or irritable mood and big ideas, with a different baseline in between.", ask: "Have you had spells lasting several days when you needed much less sleep but still felt full of energy?" },
    { ddx: "cyclo", clue: "Frequent, shorter swings between high-energy and low periods over years, rather than a steady drive.", ask: "Does your energy swing up and down over days or weeks, or is it about the same all the time?" },
    { ddx: "thyroid", clue: "Overactivity with weight loss, heat intolerance, tremor or palpitations, or recent thyroid medication changes.", ask: "Have you noticed weight loss, sweating, a racing heart or shaky hands? When was your thyroid last checked?" },
    { ddx: "gad", clue: "Keeps busy to manage worry and feels unable to stop because things might go wrong.", ask: "If you stop, what goes through your mind? Is keeping busy a way of keeping worries away?" },
    { ddx: "ptsd", clue: "Busyness used to avoid memories and feelings, with hypervigilance, nightmares or being easily startled.", ask: "Does keeping busy help you avoid upsetting memories or feelings? Was it like this before the event?" },
    { ddx: "sud_stim", clue: "Energy linked to cocaine, amphetamines, high caffeine or energy drinks.", ask: "How does your energy change on days without caffeine or any other substances?" },
    { ddx: "meds", clue: "An inner urge to move (akathisia) after starting an antipsychotic or antidepressant, or activation from steroids, decongestants or inhalers.", ask: "Did this start or get worse after you began a new medicine or changed a dose?" },
    { ddx: "eating", clue: "Constant movement or exercise driven by the wish to burn calories or control weight.", ask: "Is any of your activity about controlling your weight or shape? How do you feel if you miss it?" },
    { ddx: "rls", clue: "An unpleasant urge to move the legs, mainly in the evening or at rest, eased by walking.", ask: "Is the urge mainly in your legs, worse in the evening, and relieved when you get up and walk?" },
    { ddx: "normal", clue: "A chosen, enjoyable active lifestyle that the person can pause easily, with no discomfort and no cost.", ask: "If you had a free weekend with nothing to do, would you be comfortable resting?" }
  ],
  special: {
    women: "Women may show the drive as constant busyness with home, children and work, often praised as coping well, which hides it. Look for exhaustion, an inability to rest, and similar high energy in childhood, when girls were often labelled 'lively' or 'sporty' rather than hyperactive.",
    older: "Physical activity often falls with age, leaving an inner drive or constant busyness with projects. New overactivity in later life should prompt a check for mania, thyroid disease, medication effects or frontal lobe change.",
    highIQ: "Very able adults may channel the drive into achievement, several degrees or roles, and be admired for it. Ask about the cost: rest, relationships, burnout and how they feel when they are forced to stop.",
    sud: "Stimulants and high caffeine raise activity, while alcohol or cannabis may be used to slow down at night. Ask about the pattern before any substance use began and on days without use.",
    asd: "Autistic people may be very active around special interests or move for sensory reasons, but are often comfortable in predictable, still routines. In ADHD the drive is general and novelty-seeking. Both can co-occur and both should be assessed.",
    culture: "Busy, long-hours lifestyles are valued in some cultures and jobs, and norms about physical activity differ. Compare with peers in the same setting, and focus on discomfort when still and on the cost to the person."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A2e, paraphrased",
    "ICD-11 CDDR 6A05 (WHO 2024), hyperactivity-impulsivity features, paraphrased",
    "ASRS v1.1 item 6 (WHO 2003)",
    "Kooij JJS et al. Updated European consensus statement on adult ADHD. Eur Psychiatry 2019;56:14-34",
    "DIVA 2.0 structure (Kooij and Francken 2010); question and example wording original",
    "CADDRA Canadian ADHD Practice Guidelines 4.1 (2020), differential diagnosis, paraphrased",
    "Clinical practice"
  ]
}]);
