/* hi8: Difficulty waiting their turn. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "hi8",
  dim: "HI",
  codes: { dsm5: "A2h", diva: "H/I 8", asrs: [17] },
  title: "Difficulty waiting their turn",
  criterion: "Often finds it hard to wait for their turn, for example when standing in a queue.",
  adultForm: "In adults this shows as marked impatience whenever waiting is required: queues in shops and at the bar, traffic jams and red lights, waiting rooms, phone hold lines, slow websites, and waiting for replies, decisions or results. DSM-5-TR's example is waiting in a queue; adult interview guides such as DIVA widen this to general impatience, including rushing into or walking out of jobs and relationships because things move too slowly. Many adults arrange their lives to avoid waiting or pay to skip it, so ask what they do to avoid waits and what that costs. Not waiting for a turn to speak in conversation is part of DSM-5-TR A2g, so score it under hi7, not here.",
  why: "Delay aversion: waiting feels unusually unpleasant, so the person escapes it, fills it or cuts it short. Weak inhibitory control and a strong pull towards immediate rather than later rewards add to this, and time seems to drag when nothing is holding attention.",
  ask: {
    adult: "Over the last six months, how often have you found it hard to wait your turn, for example in queues, in traffic or in waiting rooms? What happens when you have to wait? Can you give me a recent example?",
    child: "When you were at primary school, between about 5 and 12, how were you at waiting your turn, for example in the dinner queue, in games or for a go on the computer? What do you remember, and what did others say about it?",
    parent: "Over the last six months, how hard is it for your child to wait their turn, for example in games, in queues or for a go on a tablet or console, compared with other children their age? What happens when they have to wait?",
    teen: "Over the last six months, how hard do you find waiting, for example in queues, for your turn in games or sport, for replies to messages or for things you want? What happens when you have to wait?",
    teacher: "Compared with others in the class, how hard does this pupil find waiting their turn, such as lining up, taking turns in games or waiting for your help? What happens when they have to wait?"
  },
  rephrase: [
    "How are you at waiting in queues?",
    "What happens inside you when you have to wait for something?",
    "What is it like for you when you have to wait, for example in a shop, at the doctor's or in traffic?",
    "When did you last leave a queue because you could not stand the wait? What happened?",
    "How does waiting compare for you and for the people around you? Give me an example.",
    "Tell me about the last time you had to wait for something. How did it go?",
    "Some people will do almost anything to avoid waiting. Is that you? What do you do?",
    "Everyone gets fed up in long queues. What makes it different for you, and what has it cost you?",
    "Do you plan your day to avoid queues or waiting? How much effort does that take?",
    "How are you when someone is slow, like a slow driver or a slow person at the till?",
    "What do you do while you are waiting for a reply to a message?",
    "How would people who know you well describe you when you have to wait for something?",
    "How are you when it is someone else's turn first, for example in a game or at a counter?",
    "When you want something, what happens if you are told you have to wait for it?"
  ],
  examples: {
    adult: [
      { ctx: "driving", label: "Driving and travel", items: [
        "Switches lanes again and again in slow traffic to get ahead",
        "Overtakes on risky stretches rather than stay behind a slow vehicle",
        "Takes long detours just to avoid sitting in a traffic jam",
        "Speeds up through amber lights rather than wait for the next green",
        "Sounds the horn the instant the lights change if the car ahead has not moved",
        "Drives close behind slower cars to push them out of the way",
        "Pulls out of junctions into gaps that are really too small",
        "Has had penalty points or near misses from impatient driving",
        "Walks long distances rather than wait for a late bus",
        "Crosses the road against the red pedestrian light",
        "Pushes towards the door when boarding a train, bus or plane",
        "Swaps between airport security queues hunting for the quickest",
        "Gets out of the car in a jam to see what the hold-up is",
        "Rings or messages repeatedly when a taxi or lift is a few minutes late",
        "Edges out at junctions or roundabouts before it is their turn to go",
        "Pushes in at the front of a traffic queue rather than wait in it"
      ] },
      { ctx: "home", label: "Home and household", items: [
        "Abandons a full basket rather than stand in a long checkout queue",
        "Hops between checkout queues several times trying to find the fastest",
        "Uses only self-checkouts to avoid waiting behind other shoppers",
        "Shops late at night or very early just to avoid queues",
        "Opens the microwave or oven again and again before the food is ready",
        "Steps in front of others at a shop counter without noticing",
        "Gets visibly irritated when the person ahead is slow to pay",
        "Takes a numbered ticket at a counter, then leaves before being called",
        "Hovers outside the bathroom and hurries whoever is using it",
        "Phones the delivery firm repeatedly when a parcel is a few hours late",
        "Cancels a booked tradesperson to get someone who can come today"
      ] },
      { ctx: "admin", label: "Paperwork and money", items: [
        "Hangs up on hold lines before getting through, then has to start again",
        "Leaves problems with the bank or council unresolved because the phone wait is too long",
        "Walks out of the bank, post office or council office when there is a queue",
        "Rings again and again rather than wait for a promised call back",
        "Pays extra for next-day delivery rather than wait a few days",
        "Chases a refund or application within days of sending it",
        "Pays for fast-track services to cut out weeks of waiting"
      ] },
      { ctx: "work", label: "Work", items: [
        "Goes ahead without sign-off because waiting for approval feels unbearable",
        "Leaves jobs early because promotion or progress seems too slow",
        "Chases colleagues for replies within minutes of asking",
        "Leaves a meeting that starts late rather than wait for it to begin",
        "Gives up on the canteen queue and goes without lunch",
        "Starts the next step on site before glue, plaster or concrete has set",
        "Jumps ahead of colleagues for the printer, kettle or microwave",
        "Pushes to be seen first when colleagues are waiting to speak to the manager",
        "Rings an employer the day after an interview to ask for a decision",
        "Climbs many floors by the stairs rather than wait a minute for the lift"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Moves in or commits very quickly because waiting feels unbearable",
        "Gets cross while waiting for a partner to get ready to go out",
        "Starts the meal or the film without waiting for a partner to be ready",
        "Ends relationships when things do not move fast enough",
        "Hands over presents early because they cannot wait for the day",
        "Pushes for big decisions, like a house or a holiday, to be made today",
        "Sets off without a partner rather than keep waiting for them"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "Hurries children along all day because waiting for them is so hard",
        "Struggles to queue for teachers at parents' evening or for school events",
        "Finds the wait during a child's lesson or club almost intolerable",
        "Leaves the surgery with a child before being seen because of the delay",
        "Snaps at children when kept waiting for them at the school gate"
      ] },
      { ctx: "social", label: "Friends and social life", items: [
        "Walks out of a restaurant when food is slow to arrive",
        "Arrives late on purpose so there is no waiting for others",
        "Leaves if friends are more than a few minutes late",
        "Goes somewhere else rather than wait for a table",
        "Pushes forward at the bar to be served ahead of others",
        "Drops out of group plans when decisions take too long"
      ] },
      { ctx: "leisure", label: "Leisure and hobbies", items: [
        "Avoids theme parks, concerts or events with long queues",
        "Pays for fast-track tickets to skip the queue at attractions",
        "Reads the last page or looks up spoilers rather than wait to find out",
        "Gets irritable in turn-based board games while others take their go",
        "Hurries other players to take their turn in card or board games",
        "Takes a turn on the pool table, court or machine before it is theirs",
        "Gives up on baking, fishing or crafts where waiting is part of it",
        "Leaves a film or match early to beat the crowds"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Refreshes the screen again and again while waiting for an update",
        "Closes apps or websites that take more than a few seconds to load",
        "Tracks a parcel many times a day",
        "Sends follow-up messages when a reply has not come within minutes",
        "Skips ahead in videos and voice notes rather than wait",
        "Abandons online ticket queues and misses out",
        "Clicks a button repeatedly on a slow page and ends up with double orders"
      ] },
      { ctx: "health", label: "Health and appointments", items: [
        "Leaves a GP surgery or A&E waiting room before being seen",
        "Takes the first appointment anywhere rather than wait for the right one",
        "Gets angry at reception staff about delays",
        "Stops treatments that take weeks to work before they have had a chance",
        "Avoids appointments where a long wait is likely",
        "Rings repeatedly for test results before they are due",
        "Takes a second dose of a painkiller too soon because the first has not worked yet",
        "Keeps going up to reception to ask how much longer the wait will be",
        "Books the first slot of the day so there is no delay to sit through"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Feels tension building within minutes of having to wait",
        "Feels time drag painfully when there is nothing to do but wait",
        "Keeps calculating how much longer the wait will be",
        "Can only bear a wait by filling it with the phone",
        "Feels waiting as a physical discomfort",
        "Feels outrage at slow people in front of them",
        "Always carries something to do so that waiting can be endured",
        "Feels ashamed afterwards about losing patience in a queue"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Pushes to the front when lining up after playtime",
        "Pushes in at the dinner queue",
        "Cannot wait their turn for the computer, tablet or class equipment",
        "Becomes upset when made to wait for the teacher's help",
        "Takes a turn in class activities before others have had theirs",
        "Grabs worksheets or equipment before they are handed out",
        "Is out of the door before the class has been dismissed",
        "Jumps in to read aloud when it is another child's turn",
        "Shouts 'my turn' over and over in group games",
        "Jostles others in the toilet or water fountain queue"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Cannot wait for a go on the slide or swings",
        "Takes their turn in board games out of order",
        "Gets frustrated while other players take their go",
        "Quits games if they have to wait too long for a turn",
        "Grabs the ball rather than wait for it to be passed",
        "Pushes ahead in playground games like hopscotch or skipping",
        "Other children complain they never wait their turn",
        "Cannot wait for a friend to finish with a toy"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Starts eating before others sit down",
        "Opens presents before the birthday or holiday",
        "Asks 'are we nearly there yet' over and over on journeys",
        "Cannot wait for a turn on the games console with brothers or sisters",
        "Runs ahead into the road without waiting for an adult",
        "Fights with brothers or sisters over who goes first",
        "Has tantrums when told 'later' or 'wait'",
        "Pesters non-stop for something promised for later",
        "Cannot wait for cakes to cool or food to be served"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "Cannot wait their turn during practice drills at sport",
        "Gives up on the queue for rides at the fair",
        "Gets very upset when made to wait at the doctor's or dentist",
        "Jumps into the pool before the instructor says so",
        "Cannot queue for the coach on school trips without pushing",
        "Cannot wait for their turn to perform at clubs or shows",
        "Pushes in at the ice cream van or tuck shop"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "Report: 'finds it hard to wait for a turn'",
        "Report: 'needs reminders to line up sensibly'",
        "Report: 'pushes in when the class lines up'",
        "Report: 'struggles with turn-taking games'",
        "Report: 'can be impatient with others'",
        "Parent: 'could never wait for anything'",
        "Parent: 'we avoided queues and restaurants because of it'"
      ] },
      { ctx: "teen", label: "Secondary school and college (12-17)", items: [
        "Walked out of canteen or bus queues",
        "Took risky short cuts across roads or railway lines rather than wait",
        "Took turns out of order in PE, science practicals or games",
        "Sent repeated messages when friends did not reply quickly",
        "Argued with staff or other customers about queues",
        "Leaves a queue rather than wait, even for something they want",
        "Quits games or videos that take more than a moment to load",
        "Buys things straight away rather than wait or save up",
        "Gives up or calls out rather than wait for the teacher's help"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "How often do you find yourself in a wait that you struggle with: daily, weekly or less?",
      "In the last week, which waits did you find hard? What happened?",
      "Do you struggle with most waits, or only long ones?",
      "How often do you leave a queue or give up because of the wait?",
      "How often do people comment on your impatience?"
    ] },
    { k: "severity", label: "How strong", items: [
      "How long can you wait in a queue before it becomes hard?",
      "What do you do when it becomes too much: leave, push in, snap at people?",
      "Has impatience ever led you into danger, like risky overtaking or crossing against the lights?",
      "Have you lost your temper with staff or strangers because of a wait?",
      "How much effort and money do you spend avoiding waits?"
    ] },
    { k: "pervasive", label: "In which settings", items: [
      "Is it the same in shops, traffic, waiting rooms, on the phone and online?",
      "Is it the same at work, at home and when out with friends?",
      "Are there any waits you handle well? What makes those different?",
      "Does it happen when you have plenty of time, not only when you are running late?",
      "Does it apply to waiting for things to happen, like replies, results or progress, as well as queues?"
    ] },
    { k: "duration", label: "How long", items: [
      "How long have you been like this?",
      "Was it there before any current stress, low mood, pain or substance use?",
      "Has it been there most of the time for at least the last six months?",
      "Were you this impatient as a teenager and young adult?",
      "Has it changed recently? If so, what else changed at the same time?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Compared with other people in the same queue, how do you think you cope?",
      "Do others in your household or team find waiting as hard as you do?",
      "Have people described you as more impatient than most?",
      "Do you leave queues that other people seem happy to wait in?",
      "What would a partner or friend say about you compared with others?"
    ] },
    { k: "impact", label: "What it costs", items: [
      "Has impatience cost you money, fines, penalty points or accidents?",
      "Has it led to rows with staff, strangers, family or a partner?",
      "Have you missed out on appointments, tickets or opportunities because you would not wait?",
      "Have you left jobs, courses or relationships because things moved too slowly?",
      "Have you stopped treatments or plans early because results came too slowly?",
      "How do you feel about yourself afterwards?"
    ] },
    { k: "compensation", label: "How you avoid waiting", items: [
      "Do you plan your life to avoid queues or waiting?",
      "Do you pay extra to avoid waiting, such as express delivery or fast-track services?",
      "What do you take with you to get through a wait?",
      "Do you arrive late on purpose so you do not have to wait?",
      "What does all this avoiding and planning cost you in time, money or stress?"
    ] },
    { k: "onset", label: "When it started", items: [
      "As a child, how were you in the dinner queue or when lining up at school?",
      "Could you wait your turn in games with other children?",
      "Did parents or teachers say you could not wait for anything?",
      "Did you open presents early or pester for things promised for later?",
      "Was this already there before age 12?"
    ] }
  ],
  informant: {
    partner: [
      "How are they in queues, traffic and waiting rooms?",
      "Have you seen them leave a queue or walk out because of a wait?",
      "Do they push in or move ahead of others without noticing?",
      "How do they drive when traffic is slow?",
      "Do they get irritable waiting for you to get ready or for a reply?",
      "Do they go out of their way or pay extra to avoid waiting?",
      "Have they lost their temper with staff or strangers over delays?",
      "Do they rush big decisions because they cannot wait?",
      "Is it the same when they have plenty of time, not only when late?",
      "How long have you noticed this? Was it there when you met?",
      "Compared with other people you know, how impatient are they?"
    ],
    parent: [
      "As a child, could they wait their turn in games and at school?",
      "Did they push in when lining up or queuing?",
      "Could they wait for meals, presents or treats promised for later?",
      "How were they on long journeys or in waiting rooms?",
      "Did they run ahead or cross roads without waiting for you?",
      "Did teachers mention turn-taking or lining up?",
      "Were they more impatient than their brothers, sisters or friends?",
      "Was it the same at home, at school, at clubs and on outings?",
      "Did it carry on despite reminders, rewards or consequences?",
      "At what age did you first notice it?",
      "Did it cause trouble with other children or adults?"
    ],
    school: [
      "Finds it hard to wait for a turn",
      "Needs reminders to line up sensibly",
      "Pushes in when queuing",
      "Struggles with turn-taking games and activities",
      "Can be impatient with others",
      "Wants to be first in everything",
      "Becomes upset when asked to wait for help"
    ],
    teacher: [
      "Pushes to the front of the line",
      "Cannot wait for a turn in games or group work",
      "Gets upset when asked to wait for help",
      "Grabs equipment before it is handed out",
      "Wants to be first in everything",
      "Out of the door before the class is dismissed"
    ]
  },
  counts: [
    "Struggles to wait their turn often: in most queues, traffic, waiting rooms or other waits, most weeks.",
    "The difficulty is clearly greater than for most people of the same age and background in the same situations.",
    "It shows in several settings, for example shops, driving, health appointments, work and online.",
    "It happens even when there is no real time pressure, not only when late or rushed.",
    "It is longstanding: present for at least six months and usually for years.",
    "It has consequences: leaving queues, missed services, fines or points, extra costs, rows or risky behaviour.",
    "Heavy avoidance of waiting (online shopping, arriving late on purpose, paying for fast-track) counts when it is driven by intolerance of waiting and carries a cost.",
    "Impatience while waiting for outcomes (replies, decisions, progress at work or in relationships) supports the score when it leads to rash action.",
    "Collateral reports of lifelong impatience from family, a partner or school reports support scoring present."
  ],
  notCount: [
    "Ordinary irritation in long or badly run queues that most people would share: normal variation.",
    "Impatience only when genuinely late or under real time pressure, or only with one person or in one place.",
    "Being unable to wait because of pain, a full bladder, low blood sugar or another physical need.",
    "Leaving queues or waiting rooms because of panic, fear of being trapped or fear of being judged (consider panic disorder or social anxiety).",
    "Irritability and impatience only during an episode of depression, hypomania or mania.",
    "Impatience only during nicotine, alcohol or drug withdrawal, or while intoxicated with stimulants.",
    "Distress in queues from noise, crowds, sensory overload or uncertainty about how long it will take (consider autism).",
    "Impatience that began recently with stress, burnout or perimenopause and was not there before.",
    "Restlessness while waiting that is really a need to move or inner restlessness (score under hi1 or hi3), not intolerance of the wait itself.",
    "Deliberate, entitled or intimidating queue-jumping with disregard for others (consider antisocial traits).",
    "Local or cultural norms where queuing is informal and moving forward is expected.",
    "Scoring error: not waiting for a turn to speak in conversation belongs to hi7 (DSM-5-TR A2g), and impulsive spending or decisions with no wait involved should not be scored here."
  ],
  anchors: [
    { score: "yes", quote: "I can't do queues. If there are more than two people at the till I put my basket down and go. I've had points for speeding and overtaking when I wasn't even late. I walk out of the GP surgery if they're running behind, then I have to rebook.", why: "Score Present: frequent, across several settings, with costs and risk, not explained by time pressure." },
    { score: "yes", quote: "My partner says I'm the most impatient person they know. I order everything online, pay for next-day delivery and shop at six in the morning, all to avoid waiting. It costs us a fortune, but otherwise I lose it in queues.", why: "Score Present: extensive, costly avoidance driven by intolerance of waiting, with collateral support. Avoidance that is driven by the wait and carries a cost counts towards the symptom." },
    { score: "yes", quote: "I've always been like this. Mum says I pushed in every dinner queue at primary school. Now I can't stand in a queue for more than a minute, I edge out at junctions before it's my go, I've left two jobs because promotion was taking too long, and if someone doesn't text back I send five more.", why: "Score Present: queues, traffic and waiting for outcomes are all affected, across settings, with clear consequences and a childhood history." },
    { score: "unsure", quote: "I hate queues, but who doesn't?", why: "Unsure: ask for specific recent examples, what they actually do, how they compare with others and whether it has cost them anything." },
    { score: "unsure", quote: "I've got really short-tempered in queues this year, since my back got bad.", why: "Unsure, leaning towards absent: recent and linked to pain. Ask how they managed waiting before the pain started." },
    { score: "unsure", quote: "I avoid queues because of the crowds. I feel panicky and have to get out.", why: "Unsure, leaning towards absent: avoidance driven by anxiety, not by intolerance of delay. Explore panic and agoraphobia; both can co-exist with ADHD." },
    { score: "no", quote: "I get annoyed when I'm late and stuck in traffic, but otherwise I'm patient enough.", why: "Score Absent: impatience only under real time pressure." },
    { score: "no", quote: "I don't mind waiting at all. I read or watch people, and the time goes quickly.", why: "Score Absent: no difficulty with waiting." },
    { score: "no", quote: "I was snappy in queues when I was giving up cigarettes, but after a few weeks it settled down.", why: "Score Absent: impatience limited to a period of nicotine withdrawal." }
  ],
  mimics: [
    { ddx: "panic", clue: "Leaves queues or waiting rooms because of panic symptoms or fear of being trapped, not because of the delay.", ask: "When you leave a queue, is it because you cannot stand the wait, or because you feel trapped, panicky or unwell?" },
    { ddx: "social", clue: "Avoids waiting rooms and queues because of fear of being watched or judged.", ask: "Is the hard part the waiting itself, or being around people who might notice you?" },
    { ddx: "asd", clue: "Waiting is distressing because of noise, crowds, unpredictability or changes to plans.", ask: "Is waiting easier if it is quiet and you know exactly how long it will take?" },
    { ddx: "dep", clue: "Irritability and low frustration tolerance only during depressive episodes.", ask: "When your mood has been good, how have you coped with waiting?" },
    { ddx: "bip", clue: "Marked impatience and irritability as part of a distinct episode with less sleep and raised energy.", ask: "Has there been a period of days when you were far more impatient than usual, slept little and had lots of energy?" },
    { ddx: "sud_stim", clue: "Impatience and agitation tied to stimulant use, or to nicotine or drug withdrawal.", ask: "Is it the same when you have not used anything and are not craving?" },
    { ddx: "burnout", clue: "A recently shortened fuse with chronic stress, overwork or exhaustion.", ask: "Were you patient enough with waiting before this stressful period began?" },
    { ddx: "menopause", clue: "New or much worse irritability and impatience starting around perimenopause.", ask: "Was waiting hard for you in your twenties and thirties, or is this newer?" },
    { ddx: "aspd", clue: "Deliberate, entitled pushing in and intimidation, with wider disregard for other people's rights.", ask: "When you push ahead, do you notice it at the time, and do you feel bad about it afterwards?" },
    { ddx: "normal", clue: "Irritation in long or poorly run queues that most people share, with no wider pattern.", ask: "Can you give examples of short, ordinary waits that you find hard?" }
  ],
  special: {
    women: "Women may hide impatience in public and show it at home, or manage it through careful planning and avoidance, which can look like being well organised. Ask about the effort behind avoiding waits and about irritability with family. Premenstrual worsening is common and does not rule out ADHD if the difficulty is present across the month.",
    older: "Older adults may have arranged their lives to avoid waiting, or may cope better now that time pressure has eased, so confirm the lifelong pattern with family. New impatience or irritability in later life points to pain, mood, medication or cognitive change rather than ADHD.",
    highIQ: "Able and well-resourced people may solve waiting with money and planning (fast-track services, deliveries, flexible hours), which hides the difficulty. Ask what happens when they cannot buy their way out, and what avoiding waits costs them.",
    sud: "Nicotine, cannabis, alcohol and stimulant withdrawal all cause irritability and impatience, and stimulant intoxication speeds people up. Ask about periods of abstinence and about childhood, and check whether the impatience predates substance use.",
    asd: "Autistic people may find waiting hard because of sensory overload, uncertainty or changes to routine, and often cope better when the wait is quiet and predictable. In ADHD the delay itself is the problem, and waiting stays hard even when it is quiet and its length is known. Both can be present.",
    culture: "Queuing norms vary widely between countries and settings: orderly lines are expected in some places and informal pushing forward in others. Judge against the person's own norms and ask whether their impatience stands out within their own community.",
    young: "Waiting is hard for young children and gets easier with age, so compare with children of the same age and allow for the youngest in the year. Some children, often girls, hold it together at school and show impatience at home, so ask both the parent and the teacher. Frustration only when tired or hungry, or anger linked to low mood, does not count on its own."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A2h, paraphrased",
    "ICD-11 CDDR 6A05 (WHO 2024), hyperactivity-impulsivity features, paraphrased",
    "Kooij JJS et al. Updated European consensus statement on adult ADHD. Eur Psychiatry 2019;56:14-34",
    "Sonuga-Barke EJS. The dual pathway model of AD/HD. Neurosci Biobehav Rev 2003;27:593-604",
    "DIVA 2.0 structure (Kooij and Francken 2010); question and example wording original",
    "ASRS v1.1 item 17 (WHO 2003)",
    "Clinical practice",
    "NICE NG87 1.2.2 (under-recognition in girls), 1.3.5 (criteria adjusted for age) and 1.3.6 (children's views)",
    "Parent, young person and teacher questions, teacher comments and young-person notes: clinical practice"
  ]
}]);
