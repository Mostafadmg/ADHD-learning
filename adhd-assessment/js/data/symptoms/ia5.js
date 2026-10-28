/* ia5: Difficulty organising tasks and activities. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "ia5",
  dim: "IA",
  codes: { dsm5: "A1e", diva: "A5", asrs: [2] },
  title: "Difficulty organising tasks and activities",
  criterion: "Often has trouble organising tasks and activities: finds it hard to manage tasks that must be done in a sequence, to keep materials and belongings in order, and to keep work neat and structured. Time is managed poorly and deadlines are missed.",
  adultForm: "In adults this shows as chaotic planning of the day and week, underestimating how long things take, running late, double-booking, cluttered homes, desks, cars and computer files, and paperwork and money with no working system. DSM-5-TR names messy, disorganised work, poor time management and missed deadlines. Many adults depend on a partner, assistant or rigid routine to supply the structure they cannot build themselves, and some become inflexible because any change to the plan makes it collapse.",
  why: "Organising draws on planning, sequencing, prioritising and a dependable sense of time, all executive functions. Weak working memory makes it hard to hold the steps of a plan in mind, and an altered sense of time means a future deadline does not feel real until it is close. Without an internal plan, the person reacts to whatever is in front of them.",
  ask: {
    adult: "Over the last six months, how often have you found it hard to organise things, such as planning your day, doing tasks in a sensible order, keeping track of time, or keeping your space and paperwork in order? Can you describe a recent example?",
    child: "Thinking about primary school, roughly age 5 to 12, how well could you organise yourself compared with other children, for example getting ready in time, keeping your bag, desk or bedroom in order, or planning homework? What examples come to mind?",
    parent: "Over the last six months, how well does your child manage their things and their time compared with other children their age, for example their school bag, bedroom, getting ready in the morning or homework? Can you give me a recent example?",
    teen: "Over the last six months, how do you manage organising yourself, like your bag, your timetable, homework deadlines and getting ready in the morning? Do you need more help with this than your friends? Can you give me an example?",
    teacher: "Compared with others in the class, how well does this pupil organise their equipment, their work on the page and the steps of a task? How much adult help do they need to get started and stay organised?"
  },
  rephrase: [
    "How do you plan your day or your week?",
    "Plain words: how organised is your life? Give me an example from this week.",
    "When you have several things to do, how do you decide what to do first?",
    "How long do you think it takes you to get ready and leave the house? How long does it really take?",
    "Talk me through how you keep track of dates and deadlines. Does it work?",
    "What does your desk, car or kitchen table look like right now?",
    "Most people are messy sometimes. What would a visitor notice about your home that is different from your friends' homes?",
    "Does someone else organise things for you, like a partner, parent or assistant? What happens without them?",
    "Simple English: how do you plan your day? Tell me about yesterday. Were you on time?",
    "Tell me about a time when a plan fell apart. What happened?",
    "What diaries, lists or planners have you tried? What happened to them?",
    "If you look calm and organised at work, what does it take behind the scenes?",
    "When you have a big job with many parts, how do you break it down?",
    "Informal: how on top of things do you feel from day to day? What slips first?"
  ],
  examples: {
    adult: [
      { ctx: "work", label: "Work", items: [
        "Underestimates how long tasks will take and overruns most days",
        "Works on low-priority jobs while urgent ones slip",
        "Desk or workspace buried under piles of papers and objects",
        "Cannot break a large project into steps and put them in order",
        "Misses deadlines through poor planning rather than lack of effort",
        "Starts the day without a plan and reacts to whatever comes up",
        "Agrees to more tasks than can possibly fit into the week",
        "Saves files in random folders that colleagues cannot follow",
        "Van, toolbox or workstation so jumbled that time is lost on every job",
        "Does steps in the wrong order, so work has to be redone",
        "Relies on a manager or colleague to set priorities each day",
        "Works very long hours to make up for disorganised time",
        "Keeps a strict routine because any change throws everything out"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "Notes for different subjects mixed up together in one bag or file",
        "No plan for the term, so several assignments pile up in the same week",
        "Cannot plan the structure of an essay before starting to write",
        "Draws up a revision timetable that is far too unrealistic to follow",
        "Spends more time making colour-coded plans than actually studying",
        "Struggles to manage the stages of a research project or dissertation",
        "Group projects suffer because their part was never planned",
        "Has no overview of when deadlines and exams fall across the term"
      ] },
      { ctx: "home", label: "Home and household", items: [
        "Every surface in the home is cluttered",
        "Chores done in a random order with no routine",
        "Clothes kept in heaps on the floor or a chair rather than put away",
        "Has to clear a space before every meal or task",
        "Cupboards so crammed that things fall out when opened",
        "No set place for things, so items end up wherever they were last used",
        "Food shopping unplanned, so there is never a full meal in the house",
        "Feels ashamed to invite people round because of the state of the home",
        "Tidies in a big burst, then the home slides back to chaos within days",
        "When cooking several dishes, they are ready at very different times",
        "Laundry system breaks down, with clean and dirty clothes mixed together",
        "Relies on a cleaner or family to restore order every so often"
      ] },
      { ctx: "admin", label: "Paperwork and money", items: [
        "Post kept in unsorted piles, bags or boxes",
        "Has no way of knowing which bills are due when",
        "Important documents stored in random places with no filing system",
        "Bank accounts, subscriptions and direct debits in a muddle",
        "Pays late fees and charges because money is not organised",
        "Tax or benefit paperwork gathered in a last-minute scramble",
        "Has no overview of income and spending from month to month",
        "Pays some bills twice while others go unpaid",
        "A partner or relative runs the finances because they were too chaotic"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Partner does nearly all the household planning and scheduling",
        "Rows about lateness and plans that fall through",
        "Double-books family events and has to cancel one",
        "Holidays arranged at the last minute, so costs rise",
        "Family days out start hours later than planned",
        "Partner describes life together as living in chaos",
        "Family gatherings arranged badly, with key details missed",
        "Relies on family members to keep track of shared plans"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "School mornings are chaotic even after getting up early",
        "Cannot organise the children's kit for each day of the week",
        "Children late for school or activities most weeks",
        "Family meal planning breaks down, with takeaways most nights",
        "Children's activities clash because the family calendar is not managed",
        "An older child has taken over organising the household",
        "Packed lunches, bags and homework all done in a last-minute rush",
        "Birthday parties and events planned in a panic at the last minute"
      ] },
      { ctx: "social", label: "Friends and social life", items: [
        "Arrives late to meet friends, often by twenty minutes or more",
        "Arranges to see two groups of friends at the same time",
        "Friends take over planning trips because otherwise plans fall apart",
        "Over-commits to social plans and cancels at the last minute",
        "Has given up organising get-togethers because they always go wrong",
        "Packing for a weekend away happens in chaos at the last minute"
      ] },
      { ctx: "driving", label: "Driving and travel", items: [
        "Sets off without checking the route or how long the journey takes",
        "Regularly leaves home too late to arrive on time",
        "Car interior full of rubbish, clothes and papers",
        "Runs out of fuel or charge because refuelling was not planned",
        "Allows no time for traffic, parking or connections",
        "Misses trains or flights through poor timing"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Inbox holds thousands of unread and unsorted emails",
        "Computer desktop covered in files with no folder structure",
        "Uses several calendar apps, none of them up to date",
        "Downloads planning apps that never become a habit",
        "Online accounts, logins and subscriptions kept with no system",
        "Notes to self scattered across apps, scraps of paper and messages",
        "Sets phone reminders for every step because there is no plan otherwise"
      ] },
      { ctx: "health", label: "Health and appointments", items: [
        "Does not plan ahead for repeat prescriptions, so medication runs out",
        "Health appointments clash with work or other commitments",
        "Late for medical appointments because travel time was misjudged",
        "Cannot set up a steady routine of meals, sleep and exercise",
        "A referral or benefits process with many steps feels impossible to manage"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Loses track of how much time has passed",
        "A deadline does not feel real until it is very close",
        "Mind feels like a cluttered desk; cannot sort what matters first",
        "Feels overwhelmed when a task has many parts",
        "Freezes when choosing where to start",
        "Feels constantly behind and on the back foot",
        "Cannot picture the steps between now and the finished task",
        "Spends a lot of energy just holding the day together"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Desk or tray stuffed with crumpled papers",
        "Last to be ready when the class moves to the next activity",
        "Book bag holds letters from weeks ago",
        "Does the steps of a task in a muddled order and has to start again",
        "Cannot set out the materials for a task without help",
        "Written work has no clear beginning, middle and end",
        "Pencil case and equipment always in chaos",
        "Needs the teacher to break tasks into small steps",
        "Maths working scattered all over the page"
      ] },
      { ctx: "homework", label: "Homework", items: [
        "Does not know which homework is due on which day",
        "Does not realise a project needs weeks of work until it is due",
        "Homework diary empty or impossible to read",
        "Needs a parent to plan homework time every evening",
        "Cannot judge how long a piece of homework will take",
        "Cannot decide which piece of homework to do first",
        "Cannot plan the stages of a project, such as find out first, then write",
        "Spends the evening getting set up and little time working"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Bedroom floor covered in clothes and toys, far more than siblings",
        "Rarely ready to leave the house on time in the mornings",
        "Gets dressed in a muddled order, like shoes on before trousers",
        "Drawers stuffed with a jumble of unrelated things",
        "Unsure what day it is or what comes next, long after peers know",
        "Gets stuck when asked to pack their own bag for a sleepover",
        "At 8 or 9, still has no feel for how long ten minutes is",
        "Charts and routines set up by parents never stick",
        "A bedroom tidied by a parent is back in chaos within a day"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Games with complicated rules fall apart because they cannot organise them",
        "Needs an adult to set up play and struggles to occupy themselves",
        "Toys in heaps, with pieces from different sets mixed together",
        "Cannot plan how to build a model or den",
        "Trading cards, bricks or collections kept in a jumble with no order",
        "Friends take charge of organising the games"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "Sports bag packed in a muddle, mixed up with school things",
        "Often late to clubs and practices",
        "Cannot organise themselves on trips without close adult help",
        "Needs a leader to take them through each stage of an activity",
        "Not changed and ready when the match or lesson starts",
        "Overwhelmed by jobs with several stages, like packing for camp"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "'Needs to develop organisational skills'",
        "'Work is messy and poorly presented'",
        "'Often unprepared for lessons'",
        "'Struggles to manage time in tests'",
        "'Needs support to organise ideas in writing'",
        "'Bag and tray are always in a mess'",
        "Parent: 'Took forever to get ready, every single day'"
      ] },
      { ctx: "teen", label: "Secondary school and college (12-17)", items: [
        "Cannot manage a secondary school timetable without help",
        "Coursework deadlines pile up because they were never planned",
        "Locker and bag a mess of old sheets and food",
        "No revision plan; tries to cover everything the night before",
        "Late for lessons when moving between classrooms",
        "Parents still organise their week at 15 or 16",
        "Misses deadlines set on the school homework app",
        "Turns up for shifts at a part-time job at the wrong time",
        "Keeps no track of money from a job or allowance",
        "Revision notes for different subjects end up mixed together"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "How many days a week do you feel your day is disorganised?",
      "How often are you late, and by how much?",
      "In the last month, how many deadlines or bookings went wrong because of planning?",
      "How often do you double-book or forget to allow time for something?",
      "How long does your home or workspace stay organised after you tidy it?",
      "Is it most days, or only during busy spells?"
    ] },
    { k: "severity", label: "How severe", items: [
      "What is the worst thing that has happened because of poor organisation or timing?",
      "Have you had late fees, debt letters, warnings for lateness or missed deadlines?",
      "Could someone find an important document in your home within ten minutes?",
      "How much of your planning does someone else do for you?",
      "Does the state of your home stop you inviting people round?",
      "Have you lost a job, course place or relationship partly because of this?"
    ] },
    { k: "pervasive", label: "In more than one setting", items: [
      "Is it the same at work, at home and with your money?",
      "What about your car, your phone and your computer files?",
      "Are there any areas of your life that are well organised? What is different there?",
      "Does it happen when someone else sets the structure, or mainly when you are in charge?",
      "Was it the same in previous jobs, courses or homes?"
    ] },
    { k: "duration", label: "How long", items: [
      "How long have you struggled to organise yourself?",
      "Was there a time in your life when you were well organised?",
      "Has it been like this for at least the last six months?",
      "Did it start or get worse after a particular change, such as a new job, a baby or an illness?",
      "Were you like this as a teenager and young adult?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Compared with people of your age and situation, how organised are you?",
      "Do friends or colleagues comment on your lateness or your mess?",
      "Do others in the same job manage their workload more easily?",
      "Is your home very different from the homes of friends with similar lives?",
      "Have you been called the disorganised one in your family or group?"
    ] },
    { k: "impact", label: "Effect on life", items: [
      "What has poor organisation cost you, in money, work or relationships?",
      "How does it affect the people you live with?",
      "Has it affected your job, promotion or studies?",
      "How do you feel when you look at your desk, inbox or home?",
      "Does lateness cause you trouble at work or with friends?",
      "What would be different if you could plan and keep order easily?"
    ] },
    { k: "compensation", label: "Coping strategies and their cost", items: [
      "What systems do you use to stay organised? Do they last?",
      "Do you set clocks fast, use many alarms or keep several lists?",
      "Does a partner, parent or colleague organise things for you?",
      "Do you keep to a rigid routine? What happens if it changes?",
      "How much time each week goes on trying to stay organised?",
      "What happens when your system or helper is not there?"
    ] },
    { k: "onset", label: "When it started", items: [
      "What were your school bag, desk and bedroom like at primary school?",
      "Did teachers or parents say you were disorganised before you were 12?",
      "Could you get yourself ready for school without being prompted at each step?",
      "Was it there before any problems with mood, alcohol or drugs?",
      "Can you give me an example from before age 12?"
    ] }
  ],
  informant: {
    partner: [
      "How organised is your partner compared with other people you know?",
      "Who does most of the planning and scheduling at home?",
      "Are they often late? By how much, and how often?",
      "Do they double-book or over-commit?",
      "What are their desk, car and side of the room like?",
      "How do they manage bills, post and paperwork?",
      "Do they make plans or systems and then drop them?",
      "Do they underestimate how long things take?",
      "Has their disorganisation caused money, work or family problems?",
      "Is it the same when they are well and not stressed?",
      "Have they always been like this since you have known them?"
    ],
    parent: [
      "As a child, could they get ready for school without step-by-step help?",
      "What were their bedroom, school bag and desk like compared with other children?",
      "Did they know what homework was due and when?",
      "Could they plan a school project, or did you need to plan it for them?",
      "Were they often late or last to be ready?",
      "Did they have any sense of time, for example how long ten minutes is?",
      "Did they need you to set up play or structure their free time?",
      "Were they different from brothers, sisters or friends in this?",
      "Did teachers comment on messy work or being disorganised?",
      "At what age did you first notice this?",
      "Did charts, lists or routines help, and for how long?"
    ],
    school: [
      "Disorganised",
      "Work messy and poorly presented",
      "Often unprepared for lessons",
      "Needs to manage time better",
      "Needs support to plan and structure work",
      "Bag, tray or desk always in a mess",
      "Needs adult help to get ready and to move between tasks"
    ],
    teacher: [
      "Tray and bag are always in a muddle",
      "Often arrives without the right equipment",
      "Needs tasks broken into small steps",
      "Work on the page is scattered and hard to follow",
      "Last to be ready when the class changes activity",
      "Needs an adult to plan longer pieces of work"
    ]
  },
  counts: [
    "Problems with planning, putting tasks in order or managing time happen most weeks and are clearly beyond peers of the same age, job and life stage.",
    "It shows in at least two areas, for example work and home, or money and family life.",
    "It has consequences: missed deadlines, late fees, warnings about lateness, lost opportunities or strain at home.",
    "It is long-standing: present for at least six months and recognisable across adult life.",
    "It is present when the person is well, not only during low mood, high stress or substance use.",
    "Score Present when order is kept only through heavy compensation (a partner running the diary, rigid routines, endless lists) at a high cost, and collapses when that support is removed.",
    "Messy, poorly structured work (reports, essays, work areas) counts if it reflects disorganisation rather than lack of skill.",
    "Chronic lateness counts when it comes from misjudging time and poor planning.",
    "For childhood, teachers or parents noted messy bags, desks or rooms, and needing help to get ready or plan, beyond siblings and classmates."
  ],
  notCount: [
    "Mess or untidiness that is typical for the person's age and setting, with no real impact.",
    "Disorganisation only during a depressive episode, when energy and motivation were low.",
    "Clutter driven by difficulty throwing things away and distress at parting with them (hoarding), rather than by not getting round to sorting.",
    "Genuine overload: a new baby, several jobs or heavy caring duties, where anyone would struggle.",
    "Lateness caused by anxiety about leaving the house or by cultural norms about time.",
    "Planning difficulty only in a second language or caused by literacy problems.",
    "New in midlife or later with no lifelong history: consider cognitive decline, depression, menopause, sleep apnoea or medication.",
    "Over-committing and chaotic plans only during spells of high mood and little sleep (consider bipolar disorder).",
    "Well organised but slow because of perfectionism or ordering rituals.",
    "Chaos only during periods of heavy drinking or drug use.",
    "Do not score losing things (A1g), forgetting appointments (A1i), putting off demanding tasks (A1f) or drifting off half-done tasks (A1d) here. This symptom is about planning, sequencing, keeping order and managing time.",
    "Distress when routines change, with good planning otherwise, points more towards autism than to this symptom."
  ],
  anchors: [
    { score: "yes", quote: "My partner runs our calendar now, because when I did it we had three things booked for the same Saturday. At work I'm always behind because I never know how long anything will take. Every school report said I was disorganised.", why: "Present. Frequent, across home and work, impairing, with heavy reliance on a partner and a childhood history." },
    { score: "yes", quote: "I've got carrier bags of post going back two years. We've had enforcement letters because I had no idea what was due when. And my desk at work is just buried.", why: "Present. No working system for paperwork or money, serious consequences, and the same at work." },
    { score: "yes", quote: "I set every clock twenty minutes fast, I have four planners and three apps, and I'm still late for most things. Keeping on top of it takes me hours every week.", why: "Present. Heavy compensation that still fails and costs a lot of time. Check onset and other settings." },
    { score: "unsure", quote: "I'm messy, but I know where everything is and it's never caused a problem.", why: "Unsure, leaning towards Absent. Mess alone is not enough. Ask a partner about impact and check time management and deadlines before deciding." },
    { score: "unsure", quote: "Work is chaos right now. We're short-staffed and I'm covering three roles.", why: "Unsure. This may be situational overload. Ask how organised they were before the current pressures and in other areas of life." },
    { score: "unsure", quote: "When I'm well I'm brilliantly organised, but when I'm low the whole house goes to pieces.", why: "Unsure, leaning towards Absent. The pattern sounds episodic and tied to mood. Map it against mood episodes and childhood history." },
    { score: "no", quote: "I'm a list person. I like everything planned and I'm almost never late.", why: "Absent. Good planning and time management with no impact." },
    { score: "no", quote: "I've struggled with timing and planning since my stroke last year. Before that I ran my own business.", why: "Absent for this symptom. New and acquired, with a clear medical cause. Record under the acquired brain injury differential." },
    { score: "no", quote: "Things only got chaotic when I started drinking heavily three years ago. I was always the organised one before that.", why: "Absent for this symptom. Onset follows heavy alcohol use and there is no earlier pattern. Record under the alcohol differential." }
  ],
  mimics: [
    { ddx: "dep", clue: "Clutter and chaos began with low mood, loss of interest and low energy.", ask: "Before your mood dropped, how organised were you?" },
    { ddx: "bip", clue: "Over-commits and makes big plans during spells of high energy and little sleep.", ask: "Have there been times when you took on far more than usual and hardly needed to sleep?" },
    { ddx: "burnout", clue: "Planning collapsed under recent overload after years of coping well.", ask: "If your demands went back to normal, would you be organised again?" },
    { ddx: "asd", clue: "Plans well and prefers sameness; the difficulty is when plans change, not making them.", ask: "Is it harder for you to make a plan, or to cope when a plan changes?" },
    { ddx: "ocd", clue: "Clutter from feeling unable to throw things away, or time lost to ordering and checking.", ask: "Is the clutter there because you do not get round to sorting it, or because you feel you must keep things?" },
    { ddx: "mci", clue: "New difficulty with planning and sequencing in later life, sometimes with word-finding or memory change.", ask: "Was planning hard for you at 30, or is this new in the last few years?" },
    { ddx: "menopause", clue: "Disorganisation appeared or worsened around perimenopause, with poor sleep and mood changes.", ask: "Were you organised before your periods started to change?" },
    { ddx: "sud_alcohol", clue: "Chaos is tied to periods of heavy drinking and eases when sober.", ask: "During sober periods, could you keep on top of things?" },
    { ddx: "osa", clue: "Snoring, daytime sleepiness and morning headaches, with disorganisation worse when tired.", ask: "Do you snore, stop breathing at night, or nod off during the day?" },
    { ddx: "idd", clue: "Planning difficulty matches broader difficulty with learning and understanding across life.", ask: "Apart from organising, how easy is it for you to learn new things and understand instructions?" }
  ],
  special: {
    women: "Many women carry much of the household planning load and keep up an organised front through hours of lists and late nights, so the problem shows as exhaustion rather than visible chaos. Ask what it costs to keep things running and what happens when they are unwell or overloaded, for example after having children.",
    older: "Lifelong disorganisation is often hidden by retirement or by a partner who organises everything, and may surface after bereavement. New trouble with planning and sequencing after midlife points to cognitive impairment, depression, sleep apnoea or medication, so check with someone who knew them earlier.",
    highIQ: "High ability lets people hold plans in their head and recover from chaos quickly, so they look organised until demands outgrow that capacity, often at university, promotion or parenthood. Ask how much effort it takes and how many near misses there are.",
    sud: "Heavy drinking, cannabis and stimulant use all create chaotic lives. Date the disorganisation against the substance history and ask what life was like during periods without use.",
    asd: "Autistic people may be highly organised within their interests and rely on routines, but struggle when plans change. ADHD disorganisation is more global and comes with a poor sense of time. Both often co-occur, and a rigid routine can also be an ADHD coping strategy.",
    culture: "Attitudes to punctuality and planning differ between cultures and families, and arriving after the stated time may be normal in some settings. Compare with people from the same background and ask about impact in the places the person actually lives and works.",
    young: "Organising skills develop slowly, and a messy bag or bedroom at 7 or 8 is common, so compare with children of the same age and allow for the youngest in the year. Demands jump at the move to secondary school, so problems may first stand out at 11 or 12; look back for earlier signs. Some children, often girls, stay organised only through heavy parent support or rigid routines, so ask how much help they get."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A1e, paraphrased",
    "ICD-11 CDDR 6A05 (WHO 2024), inattention features (planning, managing and organising), paraphrased",
    "Kooij JJS et al. Updated European Consensus Statement on adult ADHD. Eur Psychiatry 2019;56:14-34",
    "DIVA 2.0 structure (Kooij and Francken 2010); wording original",
    "ASRS v1.1 Part A item 2 (WHO, Kessler et al. 2005)",
    "Clinical practice",
    "NICE NG87 1.2.2 (under-recognition in girls), 1.3.5 (criteria adjusted for age) and 1.3.6 (children's views)",
    "Parent, young person and teacher questions, teacher comments and young-person notes: clinical practice"
  ]
}]);
