/* ia2: Hard to sustain attention. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "ia2",
  dim: "IA",
  codes: { dsm5: "A1b", diva: "A2", asrs: [8] },
  title: "Hard to sustain attention",
  criterion: "Often has trouble keeping attention on tasks or on play and leisure for as long as they need. Focus fades partway through, for example in lessons or lectures, long conversations or lengthy reading.",
  adultForm: "In adults this shows as attention that drains away during meetings, lectures, long calls, reading, form-filling and routine work; DSM-5-TR names lectures, conversations and lengthy reading as typical. People often need frequent breaks, reread constantly, or rely on deadlines, music or another person in the room to keep going. Attention is often fine, or even locked on (hyperfocus), for things that are new, urgent or very interesting, which can make the problem look selective. The key is the extra effort needed to stay with ordinary tasks that others can manage.",
  why: "The difficulty lies in keeping alertness and effort steady over time, especially when a task gives little novelty or immediate reward. Differences in arousal regulation and reward processing mean interest, urgency and novelty drive attention more than importance does, so focus collapses once a task becomes routine.",
  ask: {
    adult: "Over the last six months, how often have you found it hard to keep your attention on something for as long as you needed to, for example reading, a meeting, a long call or a routine task? What happens to your focus partway through?",
    child: "Thinking back to primary school, roughly age 5 to 12, how long could you keep your mind on lessons, schoolwork, stories or games compared with other children? What happened when you had to stay with one thing for a while?"
  },
  rephrase: [
    "How long can you stay focused on something before your mind drifts off it?",
    "Do you start things paying attention and then feel your focus fade away?",
    "When you read a long article or a chapter, how far do you get before you lose track?",
    "Can you get through a whole meeting, lecture or film and keep up with it?",
    "Do you get bored quickly with things other people can keep going with?",
    "In simple words: is it hard for you to keep concentrating?",
    "Lots of people lose focus on dull things. Do you lose focus even on things you want or need to do?",
    "Is your concentration better with some things than others? Which ones, and what makes the difference?",
    "What do you have to do to stay with a task, for example music, breaks, deadlines or someone sitting with you?",
    "If something is not interesting, how many minutes can you keep at it?",
    "What would people who know you well say about how long you can stay with one thing?",
    "Tell me about the last time you had to concentrate for a long stretch. How did it go?",
    "Do you need pressure or a deadline before your focus switches on?",
    "When you watch a series or a film, do you follow all of it, or realise you have missed whole parts?"
  ],
  examples: {
    adult: [
      { ctx: "work", label: "Work", items: [
        "Focus fades within minutes on routine data entry or filing",
        "Loses concentration partway through long reports and has to start again",
        "Needs to get up or switch task every 10 to 15 minutes to keep going",
        "Can only concentrate properly when a deadline is very close",
        "Struggles to stay alert through long shifts of repetitive packing or checking",
        "Concentration on quality checks or monitoring screens drops off quickly",
        "Works in short bursts and loses whole afternoons to unfocused time",
        "Locks on to a new project for hours, then attention collapses once it is routine",
        "Plays music or podcasts constantly to tolerate dull tasks",
        "Uses timers to break long tasks into tiny chunks",
        "Needs several coffees to get through an afternoon of desk work",
        "Cannot proofread long documents beyond the first few pages"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "Gets to the bottom of a page with no idea what it said",
        "Revision sessions last minutes rather than hours",
        "Rewatches recorded lectures because attention went the first time",
        "Struggles to get through set reading before seminars",
        "Concentrates well early in an exam, then attention drops away",
        "Gives up on long textbooks and relies on summaries or videos",
        "Can only revise under last-minute pressure, when focus finally switches on",
        "Online training modules take far longer than they should"
      ] },
      { ctx: "conversation", label: "Conversations and meetings", items: [
        "Drifts off partway through long meetings and misses decisions",
        "Loses the thread of presentations after the first few slides",
        "Struggles to follow long phone calls with banks or call centres",
        "Attention fades on long video calls, especially with the camera off",
        "Zones out during sermons, speeches or ceremonies",
        "Can follow the start of a long story but loses it by the end",
        "Takes notes in meetings just to stop attention wandering",
        "Asks about points already covered while their focus had gone",
        "Training days and workshops feel unbearably long"
      ] },
      { ctx: "home", label: "Home and household", items: [
        "Can only tidy or clean in short bursts before attention runs out",
        "Loses focus during long cooking or baking projects",
        "Concentration runs out on fiddly DIY jobs that take over an hour",
        "Finds ironing, washing up or folding unbearably boring within minutes",
        "Needs the TV or radio on to keep going with housework",
        "Reads instruction manuals only in fragments"
      ] },
      { ctx: "admin", label: "Paperwork and money", items: [
        "Cannot keep attention on long forms through to the last page",
        "Gives up reading terms and conditions or official letters partway",
        "Loses focus halfway through checking a bank statement",
        "Does online banking or budgeting in short, scattered bursts",
        "Spends an hour on a 15-minute form because attention keeps drifting",
        "Needs someone sitting with them to get through tax or benefit forms"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Scrolls short videos easily but cannot stay with a long documentary",
        "Skims articles and rarely reads past the first few lines",
        "Watches films and series on faster playback to stay with them",
        "Abandons webinars and online courses partway through",
        "Prefers games with constant novelty; slower games feel boring",
        "Turns on subtitles to keep attention on the story",
        "Long voice notes and podcasts drift past without being followed",
        "Reads the first part of long emails and replies only to that"
      ] },
      { ctx: "leisure", label: "Leisure and hobbies", items: [
        "Struggles to sit through a whole film at the cinema",
        "Takes up hobbies with intense interest that fades within weeks",
        "Loses concentration in board games that go on for a long time",
        "Finds slow sports such as golf, cricket or chess hard to stay with",
        "Can play a favourite video game for hours but not read for ten minutes",
        "Gets bored partway through plays, concerts or museum visits",
        "Abandons crosswords, puzzles or jigsaws after a short time",
        "Starts novels eagerly but rarely gets past the first chapters"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Partner says they glaze over in long talks about plans or money",
        "Finds it hard to stay engaged in long, serious talks about the relationship",
        "Partner feels they are only half there during evenings in together",
        "Family notice their interest fades halfway through shared activities",
        "Attention wanders during long family meals or gatherings"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "Finds it hard to stay with bedtime stories to the end",
        "Attention drifts while playing long make-believe games with a child",
        "Loses focus watching a child's match or school performance",
        "Can help with homework for only a few minutes before focus goes",
        "Has to work very hard to stay watchful at the park or pool"
      ] },
      { ctx: "driving", label: "Driving and travel", items: [
        "Concentration fades on motorways or long straight roads",
        "Misses junctions on familiar routes because attention drifted",
        "Needs loud music, calls or snacks to stay alert on long drives",
        "Avoids long drives because focus will not last",
        "Loses track of stops on long bus or train journeys",
        "Has had near misses after attention faded on a long drive"
      ] },
      { ctx: "health", label: "Health and appointments", items: [
        "Struggles to keep attention through long therapy or group sessions",
        "Finds mindfulness or relaxation recordings impossible to stay with",
        "Gives up reading leaflets about health conditions or medicines",
        "Loses focus partway through exercise classes or physio routines",
        "Loses the thread in long appointments, even important ones"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Feels attention draining away like a battery running down",
        "Feels physically uncomfortable, almost painful, when bored",
        "Can lock on to interesting things for hours and lose track of time",
        "Has to force concentration with an effort others do not seem to need",
        "Feels switched off after the first few minutes of a dull task",
        "Feels foggy or blank when trying to stay with a long task",
        "Needs novelty, urgency or a challenge before the brain engages",
        "Feels ashamed that simple things others manage feel impossible to stay with",
        "Feels time crawl during anything routine"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Attention drifts away during carpet time while others stay with it",
        "Starts a worksheet well, then attention runs out halfway",
        "Needs an adult beside them to keep going with written work",
        "Can only work in short bursts with frequent prompts",
        "Loses focus in assemblies and long lessons",
        "Leaves reading books after a few pages",
        "Teacher has to bring their attention back many times a lesson",
        "Works well on new or hands-on tasks but fades on routine practice",
        "Joins in well at the start of a class discussion, then drifts off"
      ] },
      { ctx: "homework", label: "Homework", items: [
        "Homework that should take 20 minutes stretches over a whole evening",
        "Focus holds only while a parent sits with them",
        "Attention lasts only a few minutes on reading practice",
        "Writing tasks peter out after a sentence or two",
        "Works in short bursts between breaks, snacks and chats",
        "Focus picks up only when the task is turned into a game",
        "Spelling or times-table practice lasts only a couple of minutes"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Cannot sit through a whole film unless it is a favourite",
        "Tunes out of family board games after a turn or two",
        "Gets bored with new toys very quickly and wants something else",
        "Loses interest in bedtime stories halfway through",
        "Can play video games for hours but cannot stay with a jigsaw",
        "Starts tidying their room but attention fades within minutes",
        "Gets bored on long car journeys much sooner than siblings"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Loses interest in games with friends long before others do",
        "Switches from one game to another every few minutes",
        "Loses interest in building or craft projects partway",
        "Struggles with slow games that need steady concentration, like chess",
        "Friends complain they lose interest in pretend play before it ends",
        "Leaves colouring or drawing half done to start something new",
        "Wants to stop a card game before the first round is over"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "Attention drifts in swimming or music lessons after the first part",
        "Gets bored quickly on school trips or museum visits",
        "Switches off in team sports when the ball is far away",
        "Drops instruments or clubs once they become routine",
        "Switches off during religious services, ceremonies or long performances",
        "Loses focus during long rehearsals for school plays or concerts"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "Report says their concentration span is short",
        "Teacher says they need constant reminders to stay on task",
        "Works well one to one but loses focus when alone",
        "Starts with enthusiasm but soon loses interest",
        "Finds it hard to concentrate for long periods",
        "Teacher notes they focus well only on topics they love",
        "Reports often say 'off task' or 'needs to focus'",
        "Teacher writes that their focus comes and goes through every lesson"
      ] },
      { ctx: "teen", label: "Secondary school (12-16)", items: [
        "Revision sessions collapse after a few minutes",
        "Cannot get through set texts for English literature",
        "Focus holds in practical lessons but fades in lecture-style lessons",
        "Games for hours but manages minutes of homework",
        "Mock exam answers trail off as attention fades"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "On a typical day, how often do you notice your attention has slipped away from what you are doing?",
      "How long can you keep your focus on something dull before it goes: minutes, half an hour, longer?",
      "Is this every day, most days, or now and then?",
      "In a one-hour meeting or lecture, how much would you really take in?",
      "How often do you have to reread or rewatch because your attention went?",
      "When did it last happen? What were you doing?"
    ] },
    { k: "severity", label: "How serious", items: [
      "What is the longest you can read for before your attention goes?",
      "Have you missed important information because your focus faded?",
      "How much extra time does this cost you each week?",
      "Have you failed a course, a test or an appraisal because you could not keep focused?",
      "Has losing focus ever been dangerous, for example while driving or watching children?"
    ] },
    { k: "pervasive", label: "Where it happens", items: [
      "Does this happen at work, at home and in your free time?",
      "Is it the same with things you enjoy, like films, books or hobbies?",
      "Which tasks can you stay with for a long time? What makes them different?",
      "Does it happen in quiet places as well as busy ones?",
      "Is it the same when you are rested and feeling well?",
      "Is it the same on screen and on paper, and in person and online?"
    ] },
    { k: "duration", label: "How long", items: [
      "How long have you had trouble keeping your focus?",
      "Was there ever a time in your life when concentrating was easy?",
      "Did this start at a particular point, or have you always been like this?",
      "Has it been there for most of the last six months?",
      "Does it come and go in spells, or is it there all the time?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Compared with others in your class or team, could you keep going for as long as they could?",
      "Do other people seem to sit through meetings or lectures more easily than you?",
      "Do friends finish books or films in a way you cannot?",
      "Did teachers say your concentration was shorter than other children's?",
      "Do colleagues get through dull tasks with less effort than you?"
    ] },
    { k: "impact", label: "What it costs", items: [
      "What has happened because of losing focus at work or in study?",
      "Has it affected your grades, qualifications or choice of career?",
      "Do people at home feel you are not engaged with them?",
      "Do you avoid courses, books or jobs because of it?",
      "How does it make you feel about yourself?",
      "Has it cost you money, for example unfinished courses or missed opportunities?"
    ] },
    { k: "compensation", label: "How you cope", items: [
      "What do you do to keep your focus going, such as music, timers or breaks?",
      "Do you need someone else in the room to stay on a task?",
      "Do you rely on caffeine, energy drinks, nicotine or anything else to concentrate?",
      "Do you leave things to the last minute so the pressure helps you focus?",
      "How much effort does concentrating take compared with what you see in others?",
      "What happens when you cannot use those tricks?"
    ] },
    { k: "onset", label: "When it started", items: [
      "At primary school, could you stay with your work as long as other children?",
      "Did teachers mention concentration on your reports?",
      "Could you sit through a story or a film as a child?",
      "Did you need an adult with you to finish schoolwork?",
      "Was this noticeable before age 12?",
      "Did it become more of a problem when work got harder, such as at secondary school or university?"
    ] }
  ],
  informant: {
    partner: [
      "How long can they keep their attention on something they find dull?",
      "Do they lose interest partway through films, books or long conversations?",
      "Do they drift off during meetings, talks or services you go to together?",
      "Can they stay with a long discussion about plans or money?",
      "Do they rely on music, the TV or their phone to get through boring jobs?",
      "Do they start tasks with energy and then seem to run out of attention?",
      "Is there a big gap between what grips them and what they cannot stay with?",
      "Have you noticed them lose focus while driving or watching children?",
      "Does this seem worse than in other adults you know?",
      "Has it been like this as long as you have known them?",
      "Does it happen when they are rested and well, not just when tired?"
    ],
    parent: [
      "As a child, how long could they stay with schoolwork compared with other children?",
      "Could they sit through a story, a film or a board game?",
      "Did they need you to sit with them to get homework done?",
      "Did teachers say their concentration was short?",
      "Did they switch quickly from toy to toy or game to game?",
      "Could they focus for hours on things they loved, like games or building?",
      "Did they lose interest in clubs or hobbies quickly?",
      "Did you notice this before they were 12?",
      "Was it more marked than in their brothers, sisters or friends?",
      "Did it happen at home as well as at school?",
      "Did anything help them keep going, such as rewards or short breaks?"
    ],
    school: [
      "Short concentration span",
      "Needs constant reminders to stay on task",
      "Loses focus when working independently",
      "Starts well but soon loses interest",
      "Concentrates only on preferred topics",
      "Needs adult support to complete work",
      "Often off task"
    ]
  },
  counts: [
    "Attention fades often (most days) on tasks or activities that peers of similar age and ability can stay with.",
    "It affects things the person wants or needs to do, not only dull or very difficult tasks.",
    "It is seen in more than one setting, for example at work and at home, or in study and leisure.",
    "It is long-standing and trait-like: present for most of the last six months and before, not in episodes.",
    "It has consequences: missed information, unfinished reading or courses, rework, conflict or risk.",
    "Score present even if the person can hyperfocus on very interesting activities; DSM-5-TR and ICD-11 both note attention may hold up during highly stimulating tasks.",
    "Score present when they can only keep going through heavy compensation (constant breaks, timers, someone sitting with them, last-minute pressure) that costs extra time or effort.",
    "It occurs when rested, well and sober, not only when tired or ill.",
    "Collateral or reports describe short concentration from childhood."
  ],
  notCount: [
    "Only on very dull, very long or very hard tasks that most people would also struggle with.",
    "Only during a depressive episode (low mood, loss of interest, slowed thinking), with normal concentration when well.",
    "Concentration is pulled away by worry or rumination (anxiety, low mood) rather than fading with time.",
    "The person becomes sleepy and nods off rather than drifts (consider poor sleep, shift work, sleep apnoea or narcolepsy).",
    "Only when using or withdrawing from cannabis, alcohol, opioids or sedatives, or since starting a new medicine.",
    "Only since a head injury, a viral illness such as COVID, or another health event, with good concentration before.",
    "Hard to follow because of language load, hearing loss or difficulty understanding the material.",
    "In children, the expectation is not fair for their age: young children naturally have short attention spans.",
    "Only in one setting, such as one boring job, with no difficulty anywhere else.",
    "Brief, abrupt blank spells with sudden return are not gradual fading (consider absence seizures).",
    "New and worsening in later life with other cognitive changes (consider mild cognitive impairment).",
    "Do not count distraction by noise or movement (ia8), not taking in what is said face to face (ia3), or avoiding effortful tasks (ia6) here."
  ],
  anchors: [
    { score: "yes", quote: "I can't read more than a page without realising I've taken nothing in. In meetings I'm fine for ten minutes, then I've gone. It's been like that since school; my reports said I couldn't concentrate for long.", why: "Present. Attention fades early in reading and meetings, from childhood, and more than in peers." },
    { score: "yes", quote: "I love films, but I've never watched one at home without pausing it five or six times. At work I set a timer for 15 minutes and take a break, or nothing gets done.", why: "Present. It affects enjoyed activities too, and work needs constant compensation. Confirm the impact and the childhood history." },
    { score: "yes", quote: "I can game for six hours straight, but anything boring, like paperwork or a training video, I last five minutes. My partner says it's selective, but I really do try.", why: "Present if childhood history and impairment fit. Hyperfocus on high-interest activities does not rule it out; the key is failing on ordinary tasks that others manage." },
    { score: "unsure", quote: "Since the baby was born I can't concentrate on anything.", why: "Unsure. Recent onset with sleep loss and possible postnatal depression. Ask about concentration before the baby and at school, and screen mood." },
    { score: "unsure", quote: "I can't concentrate when I'm worrying about money, which is most of the time at the moment.", why: "Unsure. Worry-driven loss of focus suggests anxiety or stress. Ask about calmer periods and childhood." },
    { score: "unsure", quote: "I get bored in meetings, but they're really long and pointless.", why: "Unsure. Could be normal. Ask about shorter meetings, reading, films and hobbies, and compare with colleagues." },
    { score: "no", quote: "I can study for three hours if I need to. I only get distracted when the neighbours are noisy.", why: "Absent for this symptom. Sustained attention is fine; distraction by noise is scored under ia8." },
    { score: "no", quote: "My concentration has been awful since I hit my head in the accident last year. Before that I was top of the class.", why: "Absent as an ADHD symptom. New onset after a head injury with good earlier function points to an acquired cause." },
    { score: "no", quote: "It's only when I'm really tired after a run of night shifts.", why: "Absent. Linked only to sleepiness and shift work." }
  ],
  mimics: [
    { ddx: "dep", clue: "Concentration dropped with low mood, loss of interest and slowed thinking; the person could read and focus before.", ask: "When your mood is good, can you stay with a book or a film to the end?" },
    { ddx: "gad", clue: "Worries pull attention away; focus is fine when not anxious.", ask: "When your focus slips, where does your mind go? Is it to worries?" },
    { ddx: "osa", clue: "Attention fades with sleepiness: dozing in meetings, loud snoring, morning headaches, unrefreshing sleep.", ask: "When your attention goes in a meeting, do you feel sleepy or actually nod off?" },
    { ddx: "narcolepsy", clue: "Irresistible daytime sleep, sudden muscle weakness with laughter or surprise, vivid dreams when falling asleep.", ask: "Do you ever fall asleep suddenly in the day, even in the middle of doing something?" },
    { ddx: "sud_cannabis", clue: "Daily cannabis use, with focus that improves after some weeks off.", ask: "Have you had a few weeks without cannabis since it became regular? Was your focus any different?" },
    { ddx: "postviral", clue: "Brain fog after COVID or another infection, with fatigue that is worse after exertion.", ask: "Did this start after an infection? Do you crash a day or two after doing too much?" },
    { ddx: "tbi", clue: "Concentration changed after a head injury, stroke or other brain injury.", ask: "Have you had a head injury that knocked you out or needed hospital care? Was your concentration different before?" },
    { ddx: "thyroid", clue: "Slowed thinking with tiredness, feeling cold, weight gain, dry skin or constipation.", ask: "Have you felt unusually tired or cold, or put on weight, lately? Have you had blood tests recently?" },
    { ddx: "gifted", clue: "Attention fades only when work is too easy or repetitive, and holds well when properly challenged.", ask: "When the work is at the right level of challenge, can you stay with it for as long as you need?" },
    { ddx: "dsps", clue: "A late body clock: focus is poor in the morning and good late in the evening, with late sleep and hard waking.", ask: "If you could choose, when would you sleep and wake? Is your focus better late at night?" }
  ],
  special: {
    women: "Women often describe concentration problems as being scatty or overwhelmed, and may compensate with long hours, lists and perfectionism. Premenstrual, postnatal and perimenopausal changes can worsen focus, so ask whether the difficulty was present before these and whether it fluctuates with the cycle.",
    older: "In older adults, poor concentration has many causes, including sleep problems, depression, medicines and early cognitive decline. Look for a lifelong, stable pattern rather than recent decline.",
    highIQ: "Able people may keep up through intelligence, cramming and last-minute pressure, so problems may not show until demands outgrow those strategies, for example at university or in a senior role. Ask how they study and how much effort staying focused takes.",
    sud: "Cannabis, alcohol, benzodiazepines and opioids blunt sustained attention, and so does withdrawal from stimulants or nicotine. Some people use caffeine, nicotine or stimulants to focus; ask about this and weigh timing against the childhood history.",
    asd: "Autistic people often sustain attention very well on their interests but struggle with non-preferred tasks, and sensory overload can break concentration. If attention still fades in quiet, predictable settings on reasonably interesting tasks, that favours ADHD.",
    culture: "Expectations about sitting through long religious services, lectures or family events differ between cultures, so compare with peers from the same background. People learning or working in a second language may lose the thread through language load rather than attention."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A1b, paraphrased",
    "ICD-11 CDDR 6A05 (WHO 2024), inattention features, paraphrased",
    "Kooij JJS et al. European consensus on adult ADHD, Eur Psychiatry 2019",
    "DIVA 2.0 structure (Kooij and Francken 2010)",
    "ASRS v1.1 item 8 (WHO; Kessler et al. 2005)",
    "Examples, probes and anchors: clinical practice"
  ]
}]);
