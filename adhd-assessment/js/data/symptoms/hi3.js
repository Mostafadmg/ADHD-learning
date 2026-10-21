/* hi3: Runs about or climbs; in adults, feels restless. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "hi3",
  dim: "HI",
  codes: { dsm5: "A2c", diva: "H/I 3", asrs: [13] },
  title: "Runs about or climbs; in adults, feels restless",
  criterion: "Often runs about or climbs on things in situations where this is not appropriate. In teenagers and adults it may show only as a feeling of restlessness.",
  adultForm: "Adults rarely climb furniture. Instead they describe inner restlessness: a physical sense of being wound up, jittery or buzzing, an urge to move or burn off energy, and a body that will not settle. Some still show the outward form, such as running instead of walking, taking stairs several at a time, climbing walls or rocks where other adults would not, or needing hard daily exercise to discharge the feeling. DSM-5-TR allows the adult form to be limited to the subjective feeling of restlessness, so ask directly about the inner experience.",
  why: "The same weak regulation of motor activity and arousal that drives fidgeting. With age, outward over-activity is increasingly held in and becomes an uncomfortable inner restlessness; low tolerance of under-stimulation and difficulty switching off motor readiness keep the feeling going.",
  ask: {
    adult: "Over the last six months, how often have you felt restless or physically wound up inside, as if your body needs to move, even when you are sitting or lying still? What does that feel like for you, and when did you last notice it?",
    child: "When you were at primary school, how often did you run about or climb on things when you were not supposed to, for example indoors, in shops or on furniture? Did you feel restless inside? What did the adults around you say?"
  },
  rephrase: [
    "Does your body often feel restless, even when you are keeping still?",
    "Do you feel jittery or wound up inside a lot of the time?",
    "Some people describe a buzzing or fizzing feeling under the skin. Does that fit you?",
    "Is it hard for your body to settle down?",
    "Inside your body, do you feel you must move? Often, or not often?",
    "How would you describe what your body feels like when you have to keep still for a long time?",
    "Most people get restless sometimes. How is yours different, and how often is it there?",
    "Even when you look calm, is there restlessness going on inside that others cannot see?",
    "Do you need hard exercise or physical work to feel settled? What happens if you miss it?",
    "As an adult, do you still run when others would walk, or climb things other adults would not?",
    "Do you get 'itchy feet' or 'ants in your pants' a lot?",
    "When you sit or lie still, what happens in your body?",
    "Is the restless feeling there even when you are not worried about anything?"
  ],
  examples: {
    adult: [
      { ctx: "inner", label: "Inner experience", items: [
        "Describes a constant buzzing or humming feeling in the body",
        "Feels physically wound up even when nothing is happening",
        "Has a sense of energy that needs to go somewhere",
        "Feels like crawling out of their skin when made to stay still",
        "Feels jittery inside while looking calm to others",
        "Describes feeling 'antsy' most days without knowing why",
        "The restless feeling is there even on good, worry-free days",
        "Muscles feel tense and ready to spring into action",
        "Feels physically uncomfortable unless moving in some way",
        "Feels the urge to move in the arms and legs",
        "Feels caged or cooped up indoors or in small rooms",
        "Says the restlessness has always been there, like background noise",
        "Feels calmer only after hard physical effort"
      ] },
      { ctx: "work", label: "Work", items: [
        "Paces the corridor or car park in breaks to burn off restlessness",
        "Feels physically agitated by the end of a long desk day",
        "Chose physical work, such as building or delivery, to manage restlessness",
        "Runs up the stairs at work rather than taking the lift",
        "Feels physically wound up on slow, quiet shifts",
        "Jogs between departments or across the shop floor",
        "Takes a fast walk at lunch to be able to sit through the afternoon",
        "Feels twitchy and unsettled during long desk-based training",
        "Colleagues notice they seem keyed up and unable to settle"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "Feels too restless to start revising until after a run or the gym",
        "Body feels charged and tense through long exams",
        "Walks or jogs laps of the campus between lectures to settle",
        "Restlessness builds in the library until they must move",
        "Feels jumpy and unsettled in lectures even when interested",
        "Studies better after hard exercise that 'takes the edge off'"
      ] },
      { ctx: "home", label: "Home and household", items: [
        "Paces from room to room in the evening, unable to settle",
        "Takes the stairs two or three at a time",
        "Vaults over furniture, walls or gates rather than going round",
        "Runs rather than walks around the house",
        "Feels restless on lazy days at home and has to get out",
        "Climbs on worktops and furniture in ways others at home find risky",
        "Feels cooped up and agitated when stuck indoors, such as during illness",
        "Body feels too restless to settle on getting into bed",
        "Turns over and over in bed with a restless body rather than racing worries"
      ] },
      { ctx: "leisure", label: "Leisure and hobbies", items: [
        "Needs intense exercise most days to feel settled",
        "Feels agitated and irritable on days when exercise is missed",
        "Drawn to climbing, parkour, running or extreme sports",
        "Climbs trees, walls or rocks on walks, unlike other adults",
        "Feels restless on beach holidays with nothing physical to do",
        "Runs ahead on walks or hikes and has to wait for others",
        "Climbs on tables, fences or stages at parties or festivals",
        "Uses running or cycling to 'get the fizz out'"
      ] },
      { ctx: "driving", label: "Driving and travel", items: [
        "Feels physically wound up and agitated in traffic jams",
        "Feels unbearably restless in the body on long flights or coach trips",
        "Runs through stations and airports even when not late",
        "Climbs on barriers or railings while waiting for transport",
        "Walks briskly up moving escalators and travelators",
        "Feels restless in the body as a passenger on long journeys",
        "Gets restless on holidays built around long sightseeing coach tours"
      ] },
      { ctx: "social", label: "Friends and social life", items: [
        "Friends describe them as 'twitchy' or 'wired' when sitting down",
        "Starts play-fighting or chasing at gatherings as an adult",
        "Feels physically restless at slow social events like dinner parties",
        "Suggests active plans, such as a walk or a game, to manage restlessness",
        "Feels physically on edge in quiet pubs or cafes",
        "Climbs on things for fun when out with friends, embarrassing them"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Partner says they can feel the restlessness when cuddling on the sofa",
        "Partner describes them as never settled in their body",
        "Gets up at night to walk around because the body feels restless",
        "Partner notices them pacing the kitchen in the evening",
        "Family say they seem on edge even when happy",
        "Partner plans active weekends because of their restlessness"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "Runs around and climbs with the children more than other parents do",
        "Feels restless sitting on the bench at soft play or the park",
        "Gets on the climbing frame or trampoline themselves",
        "Feels physically agitated during the slow parts of bedtime routines",
        "Finds quiet afternoons at home with a baby or toddler very hard"
      ] },
      { ctx: "health", label: "Health and appointments", items: [
        "Feels agitated and jittery in waiting rooms",
        "Finds lying still for scans very hard because of inner restlessness",
        "Has been asked by a GP whether they are anxious, but denies worry",
        "Restlessness is worse on days with little physical activity",
        "Restless body makes relaxation or breathing exercises feel impossible"
      ] },
      { ctx: "conversation", label: "Conversations and meetings", items: [
        "Feels physical restlessness rising after twenty minutes of a meeting",
        "Feels wired and unsettled in long one-to-one conversations",
        "Prefers walking meetings to manage the restless feeling",
        "Has to burn off energy before an important meeting",
        "Feels jumpy in conversations that move slowly"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Feels restless even while scrolling, changing position or room",
        "Uses fast-paced games to ease the feeling of restlessness",
        "Body feels wired and twitchy after hours of screen time",
        "Feels jittery and unsettled when stuck on a long video call"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Runs in corridors and the classroom despite reminders",
        "Climbs on tables, chairs or cupboards in the classroom",
        "Runs off from the class line on the way to the hall",
        "Climbs the school fence or out-of-bounds trees at break",
        "Runs around the classroom during wet play",
        "Climbs on PE apparatus before the teacher says so",
        "Runs on to the stage or round the hall in assembly or rehearsals",
        "Climbs the climbing frame in unsafe ways",
        "Hides under or clambers over furniture during lessons",
        "Bursts out of the door running at the end of the day"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Climbs on kitchen worktops, shelves and wardrobes",
        "Jumps on beds and sofas, often breaking them",
        "Runs around the house rather than walking",
        "Climbed out of the cot or bed very early",
        "Climbed out of windows or on to the roof",
        "Slides down the banister or leaps down the stairs",
        "Has many injuries from climbing, such as falls and broken bones",
        "Parents fitted locks or moved furniture to stop the climbing",
        "Runs round in circles in the living room in the evening",
        "Climbs on the outside of the stair banister"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Runs about in other people's houses during visits",
        "Climbs trees higher than friends dare, without seeing the danger",
        "Turns calm play into chasing games",
        "Climbs on walls, garages and sheds with friends",
        "Runs off from the group at the park",
        "Friends' parents complain about climbing on their furniture",
        "Always the one at the top of the climbing frame or wall"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "Runs off in supermarkets, shopping centres or car parks",
        "Climbs on displays, fixtures or barriers in shops",
        "Runs up and down the aisles in places of worship, restaurants or cinemas",
        "Bolts away from parents near roads",
        "Climbs on museum exhibits or statues",
        "Runs around the swimming pool edge despite lifeguard whistles",
        "Climbs on the furniture in waiting rooms",
        "Runs about at weddings, funerals or formal events"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "Teacher kept reminding them to walk, not run, in school",
        "Report said 'climbs on equipment without permission'",
        "Relatives called them 'a little monkey' because of the climbing",
        "Nursery staff noted frequent running off or climbing",
        "Name appeared often in the school accident book after falls",
        "Parents said they 'never walked anywhere, always ran'",
        "Teacher commented on 'restless energy' in class"
      ] },
      { ctx: "teen", label: "Secondary school (12-16)", items: [
        "Felt restless and twitchy in long lessons at secondary school",
        "Needed sport or running every day to feel settled",
        "Climbed on roofs, bridges or scaffolding for fun",
        "Felt agitated and cooped up at home in the evenings",
        "Took up parkour, climbing or BMX to burn off energy",
        "Said they felt 'jumpy' or 'buzzy' inside much of the time"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "How many days in a typical week do you feel restless in your body?",
      "Is the restless feeling there most of the day, or does it come and go?",
      "When was the last day you did not feel restless at all?",
      "Does it build up through the day, or is it there from waking?",
      "How often do you need to do something physical to calm it?"
    ] },
    { k: "severity", label: "How strong", items: [
      "From 0 to 10, how strong is the restlessness on a usual day?",
      "Does it stop you settling to work, study or sleep?",
      "Can others see it, or is it only on the inside?",
      "Has running about or climbing ever led to injuries or trouble?",
      "How distressing is the feeling for you?"
    ] },
    { k: "pervasive", label: "Where it happens", items: [
      "Do you feel it at work, at home and with friends?",
      "Is it there when you are happy and relaxed, not just when stressed?",
      "Is it there on holiday?",
      "Does it happen when you are alone as well as with others?",
      "Does it come only in certain places, like crowded rooms or traffic?"
    ] },
    { k: "duration", label: "How long it has been there", items: [
      "How long have you felt like this? Can you remember a time without it?",
      "Has it been steady for the last six months, or does it come in spells?",
      "Are there weeks when it is much worse, along with changes in mood or sleep?",
      "Did it start or get worse with a new medicine, caffeine, drug use, or stopping a substance?",
      "As a child, did you run about or climb more than others?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Compared with friends your age, do you feel more restless in your body?",
      "Do others call you twitchy, wired or unable to settle?",
      "As a child, were you the climber or runner of the group?",
      "Do your brothers, sisters or friends need as much exercise as you to feel calm?",
      "Would your family say you are more restless than they are?"
    ] },
    { k: "impact", label: "Effect on life", items: [
      "Has restlessness affected your work, study or sleep?",
      "Has it caused accidents or injuries?",
      "Does it make you irritable, short-tempered or tense?",
      "Has it shaped your choice of job, hobbies or where you live?",
      "Does it affect your relationships, for example a partner who finds it hard to relax with you?"
    ] },
    { k: "compensation", label: "Coping and hiding it", items: [
      "What do you do to manage the restless feeling?",
      "How much exercise do you need, and what happens if you miss it?",
      "Do you use caffeine, nicotine, cannabis or alcohol to settle it?",
      "Do you pace, walk, or find physical jobs to do?",
      "Have you built your life around being active to keep the feeling down?"
    ] },
    { k: "onset", label: "When it started", items: [
      "As a young child, were you known for running off or climbing?",
      "Did your parents have to watch you more closely than your siblings because of climbing or bolting?",
      "Do you remember feeling restless inside as a child or teenager?",
      "Was this there before age 12?",
      "Did anything set it off, such as a frightening event, an illness, a medicine or drug use?"
    ] }
  ],
  informant: {
    partner: [
      "Do they seem restless in their body, even when sitting?",
      "Do they describe feeling wound up, jittery or unable to settle?",
      "Do they pace or move from room to room in the evenings?",
      "Do they need a lot of exercise to calm down, and what happens if they miss it?",
      "Do they run when others would walk, or climb things other adults would not?",
      "Is the restlessness there when they are happy and relaxed?",
      "Have you seen spells when it is much worse, with less sleep or very high mood?",
      "Does it change with caffeine, alcohol, cannabis or other substances?",
      "Did they start any new medicine around the time it got worse?",
      "Does the restlessness affect your time together?",
      "Has it been like this as long as you have known them?"
    ],
    parent: [
      "Did they run about or climb more than other children their age?",
      "Did they climb furniture, worktops, trees or walls in unsafe ways?",
      "Did they run off in shops, car parks or near roads?",
      "Did they have more accidents and injuries than their brothers or sisters?",
      "Did you have to change the house to keep them safe from climbing?",
      "Did teachers report running in school or climbing on things?",
      "Were they like this before starting school?",
      "Was it most days, or only when excited or tired?",
      "Was it more than brothers, sisters or cousins?",
      "As they got older, did it turn into restlessness or lots of sport?",
      "Did anything frightening or upsetting happen around the time it started?"
    ],
    school: [
      "Runs in corridors",
      "Climbs on equipment without permission",
      "Restless energy",
      "Often in the accident book",
      "Needs close supervision on trips",
      "Slow to settle after break",
      "Needs physical outlets"
    ]
  },
  counts: [
    "Adult: a feeling of physical restlessness is present most days and in most settings, not only at times of stress.",
    "It is clearly more than peers, and the person or others describe it as characteristic of them (twitchy, wired, never settled).",
    "It is present when calm and not worried, not only when anxious.",
    "It is longstanding and trait-like, not episodic: there are no distinct spells linked to mood episodes.",
    "It has lasted at least six months and usually has childhood roots in running about or climbing.",
    "Needing daily hard exercise or physical work to feel settled, with restlessness returning when it stops, supports scoring Present.",
    "Outward adult forms count too: running instead of walking, or climbing things where other adults would not.",
    "It has an impact: trouble settling to work, irritability, accidents, avoidance, or strain on others.",
    "For childhood: running about or climbing in inappropriate places (indoors, in shops, on furniture), often and beyond what is usual for age, noticed by parents or teachers."
  ],
  notCount: [
    "Ordinary lively play in playgrounds, parks or sport, where running and climbing are expected.",
    "Restlessness that is part of worry, with anxious thoughts driving it, which fades when worry is absent.",
    "Agitation only during depressive episodes, or only with raised mood, reduced need for sleep and racing thoughts.",
    "Restlessness that began with or follows a medicine such as an antipsychotic, an SSRI or a stimulant (possible akathisia or side effect).",
    "Restlessness from caffeine, energy drinks or stimulant drugs, or from withdrawal from alcohol, cannabis, benzodiazepines or nicotine.",
    "Hyperarousal after trauma: on edge, jumpy, watching for danger, with nightmares or flashbacks.",
    "An unpleasant urge to move the legs mainly in the evening or at night, or restlessness caused by poor sleep.",
    "New restlessness with weight loss, heat intolerance and palpitations (overactive thyroid), or starting in perimenopause.",
    "Restlessness only in one setting, such as a job they dislike, or only since a recent life change.",
    "In childhood, running off or climbing that occurred only as deliberate defiance alongside conduct problems, without underlying restlessness.",
    "Thrill-seeking chosen for enjoyment, such as climbing as a sport, without a feeling of restlessness or any problems.",
    "Restlessness during temporary confinement, such as illness or lockdown, that most people also found hard."
  ],
  anchors: [
    { score: "yes", quote: "It's like a current running through me all the time. I look calm, but inside I'm fizzing, even lying by a pool on holiday. If I don't run in the morning I'm unbearable by lunchtime. As a kid I was always up a tree.", why: "Present. Persistent inner restlessness across settings, present when relaxed, needs exercise to manage, with childhood climbing." },
    { score: "yes", quote: "Mum had to lock the cupboards because I climbed everything. I don't climb now, but I pace the house every evening and my body won't settle when I go to bed.", why: "Present for adulthood and childhood. Clear childhood climbing and a continuing inner restlessness. Check that the evening pattern is not mainly leg discomfort." },
    { score: "yes", quote: "I always feel jumpy in my body. Not worried, just wound up. My partner says sitting next to me is like sitting next to a coiled spring. It's been like that as long as I can remember.", why: "Present if more than peers and with some impact. Restlessness without worry, noticed by others and lifelong." },
    { score: "unsure", quote: "I feel restless when I'm stressed about money.", why: "Unsure. Linked to stress. Ask about calm periods and childhood; score No if it is only present under stress." },
    { score: "unsure", quote: "I get restless sometimes, I suppose, like when I'm bored.", why: "Unsure. Explore how often, in which settings and compared with peers before scoring." },
    { score: "unsure", quote: "For the last year I've felt agitated and can't sit, ever since my medicine was changed.", why: "Unsure, leaning No. Recent onset after a medicine change suggests akathisia or a side effect. Ask about life before the change and in childhood." },
    { score: "no", quote: "When I'm high I can't keep still and I go days without sleep. In between I'm calm.", why: "Absent. Episodic restlessness with raised mood and little sleep points to bipolar disorder." },
    { score: "no", quote: "I go climbing at weekends because I love it. Otherwise I'm pretty chilled.", why: "Absent. A chosen hobby without a restless feeling or problems." },
    { score: "no", quote: "Since the assault I'm on edge all the time and jump at every noise.", why: "Absent for ADHD unless restlessness predates the trauma. Hyperarousal after trauma suggests PTSD." }
  ],
  mimics: [
    { ddx: "gad", clue: "Restlessness comes with worry about many things, muscle tension and a sense of dread.", ask: "When you feel restless, what are you thinking about? Is there a worry behind it?" },
    { ddx: "bip", clue: "Restlessness comes in distinct spells with high or irritable mood, less need for sleep and racing thoughts.", ask: "Does the restlessness come in spells of days or weeks when you sleep much less but do not feel tired?" },
    { ddx: "dep", clue: "Agitation with low mood, loss of interest, guilt or early waking, only during depressive episodes.", ask: "Is the restlessness there when your mood is good, or only when you are down?" },
    { ddx: "meds", clue: "Began after an antipsychotic, SSRI, anti-sickness medicine or a stimulant change, with an inner urge to move the legs.", ask: "Did this begin within weeks of starting or changing a medicine?" },
    { ddx: "sud_stim", clue: "Restlessness tied to caffeine, energy drinks, cocaine, amphetamine, or nicotine withdrawal.", ask: "How much caffeine and other stimulants do you have, and does the restlessness come and go with them?" },
    { ddx: "sud_alcohol", clue: "Restlessness, shakes and sweating in the morning or when cutting down drinking.", ask: "Is the restless feeling worse the morning after drinking, or when you try to cut down?" },
    { ddx: "ptsd", clue: "Jumpy, on guard and watching for danger since a traumatic event, with nightmares or flashbacks.", ask: "Did this start after something frightening happened, and do you feel on guard for danger?" },
    { ddx: "thyroid", clue: "New restlessness with weight loss, heat intolerance, sweating, tremor or palpitations.", ask: "Have you lost weight, felt hot or shaky, or had a racing heart lately?" },
    { ddx: "rls", clue: "Unpleasant leg sensations at rest in the evening, relieved by moving.", ask: "Is the restlessness mainly in your legs, in the evening, and does walking ease it?" },
    { ddx: "menopause", clue: "New restlessness with poor sleep, anxiety and brain fog starting in perimenopause.", ask: "Did this start or get worse with changes in your periods, hot flushes or night sweats?" }
  ],
  special: {
    women: "Restlessness in women and girls is often internal and may be described as tension or never switching off, which can lead to a diagnosis of anxiety alone. Ask whether the restlessness exists without worry and whether childhood showed high activity, sport or climbing.",
    older: "In older adults restlessness is usually internal. New restlessness in later life should prompt a review of medicines, thyroid, sleep, restless legs, depression and cognitive decline before ADHD is considered.",
    highIQ: "Able adults often channel restlessness into demanding sport, physically active careers or constant projects, so it stays hidden. Ask what happens when these outlets are unavailable, such as during injury, illness or long travel.",
    sud: "Many adults use cannabis, alcohol or nicotine to calm restlessness, and stimulants, caffeine and withdrawal all cause it. Establish the timeline: restlessness that predates substance use and continues during abstinence supports ADHD.",
    asd: "Autistic people may feel agitated with sensory overload, uncertainty or social demands, and may seek movement to regulate. ADHD-type restlessness is present even in calm, predictable settings as a general urge to move; the two often co-occur.",
    culture: "Some languages have no direct word for restlessness, and people may describe it physically (heat, nerves, heart, legs) or as anxiety; use concrete descriptions and an interpreter where needed. Expectations about children's running and climbing differ across cultures, so compare with peers from the same background."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A2c, paraphrased",
    "ICD-11 6A05 (WHO 2022), hyperactivity-impulsivity features, paraphrased",
    "ASRS v1.1 item 13 (Kessler et al. 2005)",
    "Kooij JJS et al. Updated European consensus statement on diagnosis and treatment of adult ADHD. Eur Psychiatry 2019",
    "DIVA 2.0 structure (Kooij and Francken 2010); wording original",
    "Clinical practice: akathisia, thyroid disease, PTSD hyperarousal and bipolar disorder as differentials"
  ]
}]);
