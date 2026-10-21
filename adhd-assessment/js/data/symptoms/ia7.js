/* ia7: Loses things needed for tasks. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "ia7",
  dim: "IA",
  codes: { dsm5: "A1g", diva: "A7", asrs: [10] },
  title: "Loses things needed for tasks",
  criterion: "Frequently mislays or loses the everyday items needed to get things done, such as keys, wallet, phone, glasses, paperwork, tools, books or school equipment. The losses happen much more often than for others of the same age and cause real problems.",
  adultForm: "In adults the items are usually keys, phone, wallet or bank cards, glasses, ID, work documents, chargers and tools. DSM-5-TR gives one example list for all ages, running from school materials, pencils and books to tools, wallets, keys, paperwork, glasses and mobile phones; unlike A1h and A1i there is no separate adult note. Look for time lost searching, lateness caused by searching, money spent on replacements, items left behind in shops, taxis or trains, and heavy reliance on fixed places, tracker tags, spares or other people to keep things safe. Adults often say 'I put it down somewhere' rather than 'I lost it'.",
  why: "Items are put down while attention is elsewhere, so where they went is never stored (weak attentional encoding and working memory). There is no automatic 'check before I leave' habit because self-monitoring is weak, so things are left behind or put down in random places.",
  ask: {
    adult: "Over the last six months, how often have you lost or misplaced things you need, like keys, your phone, wallet, glasses or important papers? Can you tell me about the last time it happened?",
    child: "When you were at primary school, roughly age 5 to 12, how often did you lose or leave behind things you needed, such as your coat, PE kit, lunch box, reading book or pencil case? What did your parents or teachers say about it?"
  },
  rephrase: [
    "How often do you find yourself hunting for something you had in your hand a minute ago?",
    "Which things go missing most often: keys, phone, wallet, something else? Tell me about the last few times.",
    "Plain words: what things do you lose? How often?",
    "How much time in a normal week do you spend looking for things?",
    "What things have you had to replace because they were lost? How many times?",
    "What do you lose so often that you now buy spares or keep copies?",
    "Talk me through what usually happens in the few minutes before you leave the house.",
    "Lots of people lose things now and then. Compared with friends or colleagues your age, do you lose things more often, or more important things?",
    "Do you have tricks to stop yourself losing things, like a key hook, tracker tags or always using the same pocket? What happens when the trick fails?",
    "Who ends up helping you search, and what do they say about it?",
    "Tell me about times you have left something important behind, like a bag, laptop or bank card, in a shop, taxi, train or café.",
    "For someone using English as a second language: Your keys, phone, money, papers. How often do you not know where they are? Tell me about one time.",
    "If I asked your partner or a close friend how often you lose things, what would they say?",
    "Informal: how often are you the one asking 'has anyone seen my...?'"
  ],
  examples: {
    adult: [
      { ctx: "home", label: "Home and household", items: [
        "Searches for keys most mornings before leaving the house",
        "Loses the scissors, tape measure or screwdriver halfway through a household job",
        "Searches the house for glasses that turn out to be on their head",
        "Finds missing items in odd places, such as the fridge or bathroom cabinet",
        "Loses the TV remote several times a week",
        "Has lost the spare house key that was meant for emergencies",
        "Puts post down on a surface and cannot find it later",
        "Loses one of a pair: a glove, earring or sock",
        "Takes off a ring or watch and cannot recall where it was left",
        "Loses chargers so often that the home is full of spares",
        "Keeps keys on a lanyard or clipped to clothing so they cannot go missing",
        "Writes a to-do list and then cannot find the list"
      ] },
      { ctx: "work", label: "Work", items: [
        "Loses their work ID or security pass and has to sign in at reception",
        "Cannot find documents needed for a meeting that is about to start",
        "Misplaces tools or equipment on site and holds up the job",
        "Leaves the work laptop or charger behind in a meeting room",
        "Loses notes taken in a meeting before acting on them",
        "Loses the diary or planner that holds all their plans",
        "Borrows pens, staplers or tools from colleagues because their own have vanished",
        "Loses the keys to the work van, cash box or storeroom",
        "Has been warned or charged for lost equipment such as radios or uniform",
        "Puts a delivery note or receipt down on site and never sees it again",
        "Turns the desk or locker upside down daily for things they know they brought"
      ] },
      { ctx: "admin", label: "Paperwork and money", items: [
        "Has reordered a bank card several times in one year",
        "Loses letters with deadlines, such as tax, benefit or council letters",
        "Cannot find passport or driving licence when ID is needed",
        "Loses receipts, so cannot return goods or claim expenses",
        "Has lost cash or a whole wallet more than once",
        "Loses parking permits, bus passes or season tickets",
        "Loses paper forms halfway through filling them in",
        "Loses scraps of paper with PINs or login details written on them",
        "Has paid for replacement documents such as a birth certificate or licence"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "Loses USB sticks or notebooks that hold their coursework",
        "Arrives at a lecture or course without the notebook they packed",
        "Loses library books and pays fines or replacement charges",
        "Misplaces handouts given in class before reading them",
        "Cannot find calculator, pens or lab kit just before an exam",
        "Loses student card or the paper with course login details",
        "Leaves revision notes in the library or on the bus"
      ] },
      { ctx: "driving", label: "Driving and travel", items: [
        "Walks round a car park unable to find where the car was left",
        "Leaves bags, coats or umbrellas on buses, trains and in taxis",
        "Is late for work because the car keys cannot be found",
        "Has called out a locksmith or paid for replacement car keys",
        "Loses tickets or boarding passes between check-in and the gate",
        "Pays the lost-ticket charge at car parks because the ticket has vanished",
        "Loses hotel key cards or hire car keys during trips",
        "Has lost a passport or travel documents while abroad",
        "Searches the car for sunglasses, the phone holder or the toll card"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Rings their own phone from another phone to find it several times a week",
        "Relies on a tracker tag or locator app to find keys and bag",
        "Has had to replace a lost phone more than once in recent years",
        "Loses earbuds or headphones regularly and keeps buying new ones",
        "Saves files or photos and cannot find where they went",
        "Cannot find the email or text with a booking or ticket when it is needed",
        "Puts the phone down while out and walks away without it"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "Loses children's school letters or reading records after they come home",
        "Cannot find the child's inhaler, medicine or health record book when needed",
        "Loses children's shoes, coats or PE kit after bringing them home",
        "Leaves the changing bag, buggy cover or toys at the park or café",
        "Misplaces the child's passport or birth certificate before a trip",
        "Loses the baby's dummy, bottle or comforter when out",
        "Children have learnt to keep track of the parent's keys and phone",
        "Partner or children hold onto documents and keys for safe keeping"
      ] },
      { ctx: "social", label: "Friends and social life", items: [
        "Loses jackets, scarves or bags on nights out",
        "Leaves things at friends' houses and has to go back for them",
        "Loses tickets for concerts, matches or events before the day",
        "Has lost borrowed books or tools and had to replace them",
        "Friends no longer lend them things because borrowed items get lost",
        "Loses a present they bought before they get the chance to give it",
        "Leaves a bank card behind the bar after paying"
      ] },
      { ctx: "leisure", label: "Leisure and hobbies", items: [
        "Loses parts or pieces of hobby kits, games or equipment",
        "Loses the gym membership card or locker key",
        "Leaves sports kit or water bottle at the gym or pitch",
        "Loses fishing gear, bike lights or tools between uses",
        "Loses materials halfway through a craft or DIY project",
        "Puts the dog lead down on a walk and cannot find it"
      ] },
      { ctx: "health", label: "Health and appointments", items: [
        "Loses glasses or the contact lens case several times a month",
        "Cannot find prescriptions, appointment letters or test results",
        "Loses medicine packs or pill organisers around the house",
        "Loses hearing aids, dentures or other daily aids",
        "Goes out without an inhaler or adrenaline pen because it cannot be found",
        "Loses insulin pens, glucose meters or test strips",
        "Loses the blood test form before getting to the clinic"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Feels a jolt of panic when patting pockets and something is missing",
        "Has no memory of where they put something down seconds ago",
        "Feels ashamed at always having to ask others to help search",
        "Retraces steps in their head for ages to work out where something is",
        "Puts something somewhere 'safe' and later has no idea where that was",
        "Dreads trips because of the fear of losing passport, tickets or money",
        "Panics when someone tidies up, because then nothing can be found",
        "Gets frustrated or angry when a search eats into time they do not have"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Loses pencils, rubbers and rulers within days of getting new ones",
        "Pencil case is often missing or empty",
        "Cannot find their reading book when it is reading time",
        "Loses worksheets between being given them and the end of the lesson",
        "Leaves jumper or cardigan in the classroom or playground",
        "Borrows pens and rulers from classmates because their own have gone",
        "Loses the water bottle several times a term",
        "Lunch box or packed lunch bag goes missing",
        "Arrives at a lesson without the book they had with them that morning"
      ] },
      { ctx: "homework", label: "Homework", items: [
        "Homework sheets go missing between school and home",
        "Finishes homework and then cannot find it on the day it is due",
        "Loses the homework diary or planner",
        "Loses spelling lists or times-tables sheets",
        "Has to redo homework because the finished copy was lost",
        "Loses the textbook needed for homework somewhere in the house"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Cannot find shoes in the morning, making the family late",
        "Loses coats, hats and gloves all through the winter",
        "Toys and games soon have missing pieces",
        "Loses pocket money or birthday money",
        "Loses the house key once trusted with one",
        "Loses their glasses, retainer or hearing aid, if they have one",
        "School uniform items vanish and need replacing",
        "Leaves belongings at grandparents' or friends' houses",
        "Puts things down anywhere and cannot say where later"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Comes home from the park without the ball or toy they took out",
        "Loses collector cards, game pieces or console controllers",
        "Leaves the bike or scooter outside and cannot remember where",
        "Loses toys borrowed from friends, causing upset",
        "Loses party bags or presents on the way home",
        "Loses parts of building sets so models are never finished"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "PE kit or sports kit goes missing regularly",
        "Gets to swimming and the goggles or towel they packed have gone",
        "Leaves shin pads, boots or kit at the sports ground",
        "Loses parts of a musical instrument, music books or the bow",
        "Loses packed lunch, money or coat on school trips",
        "Loses uniform or badges for scouts, guides or similar groups",
        "Comes back from a residential trip with half their belongings missing"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "Report says they need to take more care of their belongings",
        "Teacher kept a box of spare pens just for them",
        "Lost property staff knew them by name",
        "Parents labelled everything and it still went missing",
        "Parents remember buying replacement uniform many times a year",
        "Teacher sent notes home about missing equipment",
        "Family joked they would lose their head if it was not screwed on",
        "Brothers and sisters complained that borrowed things never came back"
      ] },
      { ctx: "teen", label: "Secondary school (12-16, optional)", items: [
        "Loses phone, bus pass or locker key at secondary school",
        "Loses exercise books and coursework folders",
        "Loses keys and has to wait outside the house",
        "Loses calculator or exam equipment just before exams",
        "Loses money and cards when out with friends"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "In a typical week, how many times do you have to search for something you need?",
      "How often does finding keys, phone or wallet hold you up when you are leaving?",
      "When did you last lose something important? And the time before that?",
      "How many bank cards, phones or keys have you replaced in the last year?",
      "Is it most days, most weeks, or only now and then?",
      "Does it come in bursts, or is it steady all the time?"
    ] },
    { k: "severity", label: "How bad", items: [
      "What is the most important thing you have lost?",
      "How long does a typical search take?",
      "Have you ever missed a train, flight, exam or appointment because you could not find something?",
      "Roughly how much has losing things cost you in the last year?",
      "Have you lost anything that put you or others at risk, such as medicine or work keys?",
      "Have you lost something that belonged to someone else or to your employer?"
    ] },
    { k: "pervasive", label: "In different places", items: [
      "Does this happen at home, at work and when you are out?",
      "Do you lose things at work as much as at home?",
      "Is it the same on holiday or when staying with others?",
      "Does it happen even where everything has a fixed spot?",
      "Is it only certain items, or all sorts of things?"
    ] },
    { k: "duration", label: "How long it has been going on", items: [
      "How long have you been like this?",
      "Was there ever a time in your life when you did not lose things?",
      "Were you known for losing things as a teenager?",
      "Has it got worse recently, or has it always been about the same?",
      "If it got worse recently, what else changed at that time?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Compared with friends or colleagues your age, do you lose things more often?",
      "Does anyone in your family or friendship group lose things as much as you?",
      "Do other people comment that you lose things more than most?",
      "Do your partner, flatmates or children lose things as often as you?",
      "If everyone at your work counted lost items in a year, where would you come?"
    ] },
    { k: "impact", label: "Effect on life", items: [
      "What happens at work when you lose something?",
      "Has losing things caused arguments at home?",
      "Has it made you late, and what happened as a result?",
      "Has it affected your money, for example fees, fines or replacements?",
      "How do you feel about yourself when it happens again?",
      "Has anyone stopped trusting you with keys, documents or equipment?"
    ] },
    { k: "compensation", label: "Ways of coping", items: [
      "What systems have you set up so you do not lose things?",
      "Do you use tracker tags, a key hook or a fixed bowl? How well do they work?",
      "Does anyone else look after important things for you?",
      "How much effort does it take every day not to lose things?",
      "What happens when your system is disrupted, for example on holiday or after moving house?",
      "Do you buy spares or keep copies because you expect to lose things?"
    ] },
    { k: "onset", label: "When it started", items: [
      "What is the earliest age you remember losing things a lot?",
      "Did teachers or parents complain about lost belongings at primary school?",
      "Did your parents label everything or check your bag every day?",
      "Was it better or worse when life had more structure, such as at school or in the forces?",
      "Do you have old school reports that mention lost equipment?"
    ] }
  ],
  informant: {
    partner: [
      "How often does your partner ask for help finding keys, phone or wallet?",
      "How long do they usually spend searching before leaving the house?",
      "Have they lost something important in the last six months? What was it?",
      "Do you keep spare keys, documents or cards for them?",
      "Have they left bags, phones or cards in shops, taxis or on trains?",
      "Do you check they have everything before you go out together?",
      "Have their losses made you both late or caused you to miss things?",
      "Has losing things cost the household money?",
      "Do they lose things that you lend them?",
      "As far as you know, is it the same at home, at work and on holiday?",
      "Do they lose things more than other adults you know?",
      "Have they been like this for as long as you have known them?"
    ],
    parent: [
      "How often did they come home without their coat, jumper or PE kit?",
      "Did you replace uniform, lunch boxes or water bottles more than for other children?",
      "Did homework go missing between school and home?",
      "How long did it take to find their shoes and bag in the mornings?",
      "Did you label their things or set up systems to stop losses? Did it work?",
      "Did teachers mention lost equipment or ask you to send in more?",
      "Did they often lose toys, game pieces or pocket money?",
      "Did they leave belongings at friends' or relatives' houses?",
      "Compared with brothers, sisters or cousins, did they lose more?",
      "At what age did you first notice this?",
      "Did it carry on into secondary school?",
      "Did you stop buying them nice things because they would be lost?"
    ],
    school: [
      "Needs to look after belongings better",
      "Equipment frequently goes missing",
      "Frequently loses homework or reading book",
      "Has many items in lost property",
      "Needs constant help to keep track of kit",
      "Equipment needs replacing regularly",
      "Must take more responsibility for their things",
      "Pencil case often missing"
    ]
  },
  counts: [
    "Losing or misplacing everyday items happens often: at least most weeks, usually several times a week, not just a few times a year.",
    "It involves items needed to function, such as keys, phone, wallet, cards, glasses, documents, tools or kit, not only trivial things.",
    "It is clearly more than peers of the same age and circumstances, judged by the patient and ideally by an informant.",
    "It is seen in more than one setting, for example at home and at work or study, or when out and about.",
    "It has consequences: time lost searching, lateness, replacement costs, fees, conflict or warnings at work.",
    "It is longstanding, and for the childhood rating it was present at primary school age (lost kit, coats, homework, toys).",
    "It persists despite effort, or is held in check only by heavy compensation (tracker tags, spares, fixed places, others checking). Score the behaviour as it would be without that support, and record the cost.",
    "It is present when mood, sleep and stress are reasonable, not only during a crisis.",
    "For the childhood rating, parents or teachers commented on lost belongings, or replacing things was a family theme."
  ],
  notCount: [
    "Occasional losses that most people have, such as mislaying keys a few times a year.",
    "Started recently, with a clear before and after (for example after a head injury, a new medicine, the menopause or heavier drinking).",
    "Happens only during a depressive episode, burnout or a period of high stress, and not at other times.",
    "Memory decline in later life with no history of the same pattern earlier: consider mild cognitive impairment or dementia.",
    "Losses explained by a chaotic or crowded household where others move or take things.",
    "Poor eyesight means the person cannot see the item, rather than not knowing where it is.",
    "Only when intoxicated, hungover or after using cannabis.",
    "Items stolen, confiscated or lost for reasons outside the person's control, such as insecure housing or frequent moves.",
    "Only one kind of item (for example only umbrellas) with no wider pattern.",
    "Items buried in clutter from hoarding (a strong urge to save, distress at throwing things away) do not count on their own. Assess hoarding separately and check whether losses came before the clutter, as the two often occur together.",
    "Memory gaps linked to dissociation or trauma reminders, where the person finds things moved with no memory of moving them.",
    "Do not score adulthood from childhood losses alone; rate adulthood and childhood separately."
  ],
  anchors: [
    { score: "yes", quote: "Every single morning it's keys or phone. I've got a tracker tag now, but I've still lost two bank cards and my work pass this year. My partner keeps my passport because I'd lose it.", why: "Yes. Frequent loss of essential items, real costs and reliance on others, despite compensation." },
    { score: "yes", quote: "I've left my laptop on the train twice and my bag in a taxi. At work they've stopped giving me the van keys. Mum used to sew my gloves onto my coat.", why: "Yes. Repeated serious losses with impact at work, and a clear childhood history." },
    { score: "yes", quote: "I don't lose things now because I'm rigid about it: same hook, same pocket, I pat myself down three times before I leave. If anyone moves anything I lose an hour. It's exhausting.", why: "Yes, if the history shows frequent losses before the system existed and losses come back when the system breaks. The rigid system is compensation; record its cost. Without that earlier history, rate Unsure." },
    { score: "unsure", quote: "I suppose I lose my keys sometimes, maybe once a month? Doesn't everybody?", why: "Unsure, leaning No. Ask for the last three times, compare with peers and check with an informant before deciding." },
    { score: "unsure", quote: "Since the baby was born I can't find anything. Before that I was quite organised.", why: "Unsure. Recent onset with sleep loss points away from a lifelong pattern. Ask about childhood and school, and rate No if there was no earlier pattern." },
    { score: "unsure", quote: "At home I lose everything, but at work I'm fine because everything has its place.", why: "Unsure. Ask what makes work different: heavy structure or support may hide it. Explore other settings and how much effort work takes." },
    { score: "no", quote: "I'm pretty careful. I lost my wallet once on holiday years ago, but that's about it.", why: "No. A rare, isolated event." },
    { score: "no", quote: "Over the last year I've started losing things and forgetting names. I'm 67 and I was always the organised one.", why: "No for ADHD at this point. New decline in later life suggests a cognitive disorder; arrange a cognitive assessment." },
    { score: "no", quote: "When I was using heavily I lost everything, phones, wallets. I've not used for two years and it's not a problem now.", why: "No. The losses were tied to intoxication and resolved with abstinence." }
  ],
  mimics: [
    { ddx: "dep", clue: "Losses began with low mood, poor concentration and slowed thinking; the person was not like this before.", ask: "Were you losing things like this before your mood dropped, for example at school or in good years?" },
    { ddx: "mci", clue: "New losses after midlife, with forgetting names, repeating questions or getting lost in familiar places.", ask: "Is this a change from how you used to be, and are other people worried about your memory?" },
    { ddx: "sud_cannabis", clue: "Losses cluster on days of cannabis use and ease during breaks.", ask: "When you've had a break from cannabis, did you still lose things as often?" },
    { ddx: "sud_alcohol", clue: "Items lost on nights out or after drinking, often with gaps in memory.", ask: "Do you lose things mainly when drinking or the morning after, or on sober days too?" },
    { ddx: "sensory", clue: "Cannot see items clearly, struggles in low light, no recent eye test.", ask: "When did you last have your eyes tested? Is it that you cannot see it, or that you do not know where you put it?" },
    { ddx: "cptsd", clue: "Finds things moved with no memory of doing it, loses chunks of time, especially under stress.", ask: "Do you ever find things you don't remember moving, or lose track of time without knowing why?" },
    { ddx: "ocd", clue: "Repeated checking that items are present, driven by doubt and fear rather than actual losses.", ask: "Do you actually lose things, or do you check because you can't trust that you haven't?" },
    { ddx: "burnout", clue: "Losses during a spell of overload and poor sleep; they ease with rest.", ask: "Did it get better on holiday or when your workload was lighter?" },
    { ddx: "meds", clue: "Started or worsened after sedatives, anticholinergic drugs, antiepileptics or strong painkillers.", ask: "Did anything change in your medicines around the time this got worse?" },
    { ddx: "normal", clue: "Losses are occasional, in line with a busy life, and have few consequences.", ask: "Think of friends with a similar life. How do your losses compare with theirs, in number and in what they cost you?" }
  ],
  special: {
    women: "Women and girls may hide this behind meticulous systems, lists and spare items, so ask about the effort and the system rather than only the losses. Parenting and household roles can make losses more visible in adulthood than in childhood, when parents covered for them.",
    older: "In older adults, look for a lifelong pattern going back to school. Losing things for the first time in later life, especially with other memory changes, needs a cognitive assessment before ADHD is considered.",
    highIQ: "Able people may lose fewer things at work thanks to excellent systems, but pay in time, anxiety and help from others. Judge impairment against their ability and effort, and ask what happens when routines break, such as travel or a house move.",
    sud: "Intoxication, hangovers and blackouts cause losses. Rate the pattern during sober periods and in childhood, before substance use began.",
    asd: "Autistic people may be very distressed when others move their things because of a need for sameness, even though they know where things belong. In ADHD the item is truly lost and the person does not know where it was put. The two can co-occur.",
    culture: "Ownership norms vary, and in shared households items may be moved or used by others. People with few possessions or insecure housing may lose things for reasons outside their control, so ask about the person's own part in the loss."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A1g, paraphrased",
    "WHO ICD-11 CDDR (2024), 6A05 inattention features, paraphrased",
    "Kooij JJS et al. Updated European Consensus Statement on diagnosis and treatment of adult ADHD. Eur Psychiatry 2019;56:14-34",
    "DIVA 2.0 structure (Kooij and Francken 2010); all wording original",
    "ASRS v1.1 item 10 (Kessler et al. 2005)",
    "CADDRA Canadian ADHD Practice Guidelines 4.1 (2020), differential diagnosis tables",
    "Clinical practice (examples, probes and anchors)"
  ]
}]);
