/* hi2: Leaves seat when staying seated is expected. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "hi2",
  dim: "HI",
  codes: { dsm5: "A2b", diva: "H/I 2", asrs: [12] },
  title: "Leaves seat when staying seated is expected",
  criterion: "Often gets up and leaves their place in situations where people are expected to stay seated, such as a classroom, an office or other workplace, meetings or meals.",
  adultForm: "In adults it shows as getting up from the desk again and again, finding reasons to walk about (a drink, the printer, the toilet), leaving meetings part-way, pacing during calls, or stopping often on long drives. Many adults shape their lives to avoid the problem: they choose jobs that keep them on their feet, sit by the door, or stop going to cinemas, lectures, ceremonies and long flights. DSM-5-TR's examples include leaving one's place in the office or workplace, so ask about avoidance and seating choices as well as actual walking out.",
  why: "Weak inhibition of the impulse to move, combined with low tolerance of under-stimulation: staying seated in a slow setting feels aversive, and getting up briefly restores alertness. It is the 'getting up' expression of the same motor-regulation difficulty that shows as fidgeting.",
  ask: {
    adult: "Over the last six months, in places where people are expected to stay seated, like your desk, meetings, meals, the cinema or a long journey, how often have you got up, walked about or left before the end? Tell me about a recent time.",
    child: "When you were at primary school, how often did you get out of your seat in class, at mealtimes or in assembly when you were meant to stay sitting down? What happened when you did?"
  },
  rephrase: [
    "Do you get up a lot when you are supposed to stay sitting?",
    "At work or at the table, how long do you stay in your chair before you get up?",
    "When you must sit, do you stand up and walk? How many times?",
    "What makes you get up in the middle of a meeting or a meal?",
    "Where do you find it hardest to stay in your seat?",
    "Everyone stretches their legs now and then. Do you get up more than the people around you, and do they notice?",
    "Do you find reasons to leave your seat, like making a drink, mainly so that you can move?",
    "Are there places you avoid, such as the cinema, long flights or ceremonies, because you would have to stay seated?",
    "Do you plan where you sit, for example near the door or on the aisle, so you can get up easily?",
    "If you had to stay in one seat for two hours with no break, how would that go?",
    "Do you walk about when you are on the phone?",
    "Have you chosen work that keeps you on your feet? What made you choose it?",
    "At home, do you usually eat a whole meal sitting down?"
  ],
  examples: {
    adult: [
      { ctx: "work", label: "Work", items: [
        "Gets up from the desk many times an hour with no real task",
        "Walks to the kitchen or printer just to be out of the chair",
        "Visits colleagues' desks rather than emailing, to get out of the seat",
        "Volunteers for errands, deliveries or site visits to escape desk time",
        "Chose a manual or outdoor job partly to avoid sitting all day",
        "Has been told by a manager to stay at the workstation",
        "Takes far more short breaks than colleagues on the same shift",
        "Leaves the till or machine during quiet spells and has to be called back",
        "Works standing at a counter rather than at the desk provided",
        "Steps out of training days or inductions several times",
        "Lost a desk-based job partly because of being away from the desk",
        "Is often missing from the desk when the phone rings"
      ] },
      { ctx: "conversation", label: "Conversations and meetings", items: [
        "Stands at the back or by the wall in meetings instead of sitting",
        "Gets up to refill water or coffee several times in one meeting",
        "Leaves the room during long presentations and misses parts",
        "Asks for frequent breaks in long meetings, hearings or interviews",
        "Turns the camera off on video calls to walk away from the desk",
        "Stands up to speak in meetings when everyone else stays seated",
        "Walks around the table during discussions",
        "Leaves conferences or seminars at the first break and does not return",
        "Offers to write on the whiteboard so they can be on their feet"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "Leaves lectures to walk the corridor and returns later",
        "Sits near the exit in lectures so they can slip out",
        "Gets up from the library desk every few minutes",
        "Asks to leave exams early or for supervised breaks",
        "Stopped going to lectures because sitting through them was too hard",
        "Chooses courses with practical work over long lecture-based ones",
        "Revises standing up or walking round the room"
      ] },
      { ctx: "home", label: "Home and household", items: [
        "Gets up several times during every meal at home",
        "Eats standing at the kitchen counter or walking about",
        "Leaves the sofa again and again during a film",
        "Gets up mid-conversation to do a small job, then comes back",
        "Rarely sits through a whole evening of television with the family",
        "Jumps up from the table before others have finished eating",
        "Wanders from room to room while on the phone",
        "Stands to do household paperwork that others would sit for"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Partner complains they never sit with them for a whole evening",
        "Leaves the table at family gatherings to walk outside",
        "Gets up and walks about while their partner is talking to them",
        "Family meals are interrupted by them getting up repeatedly",
        "Leaves relatives' houses early because sitting for hours is too hard",
        "Partner has stopped going to the theatre with them because they keep leaving"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "Gets up and down during children's assemblies, concerts or nativity plays",
        "Walks about at the back while waiting at parents' evening",
        "Walks the touchline rather than sitting with other parents at matches",
        "Leaves the table at children's parties to walk around",
        "Steps out of a child's long school ceremony at least once",
        "Gets up several times while helping with homework"
      ] },
      { ctx: "social", label: "Friends and social life", items: [
        "Leaves the restaurant table between courses to walk about",
        "Stands at the bar rather than sitting at the table with friends",
        "Goes outside repeatedly during evenings in, just to get up",
        "Leaves dinner parties early or wanders between rooms",
        "Gets up and down during a friend's wedding service or speeches",
        "Prefers standing events like gigs over seated dinners",
        "Suggests walks instead of long sit-down meals"
      ] },
      { ctx: "driving", label: "Driving and travel", items: [
        "Stops every half hour or so on long drives to get out",
        "Walks the aisle of trains or planes many times on one journey",
        "Avoids long-haul flights or coach trips because of being stuck in a seat",
        "Books aisle seats to be able to get up without disturbing anyone",
        "Stands on buses or trains even when seats are free",
        "Unbuckles and stands while the seatbelt sign is still on",
        "Paces the platform or departure gate instead of sitting to wait",
        "Gets out of the car at fuel stops even when no break is needed"
      ] },
      { ctx: "leisure", label: "Leisure and hobbies", items: [
        "Rarely sees a whole film at the cinema without leaving at least once",
        "Leaves concerts, plays or sports matches early",
        "Avoids services, talks or classes where sitting is required",
        "Gets up between every hand or turn in card and board games",
        "Chooses end-of-row seats at the theatre",
        "Walks around the room during long matches on television",
        "Stands at the back of talks rather than taking a seat"
      ] },
      { ctx: "health", label: "Health and appointments", items: [
        "Paces in the waiting room rather than sitting down",
        "Leaves the waiting room and misses being called in",
        "Struggles to stay seated through long hospital appointments",
        "Has stood up or walked about during interviews like this one",
        "Finds long treatment sessions, such as infusions, very hard to sit through",
        "Avoids group courses or therapy because of sitting for an hour"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Walks about the room for every phone call",
        "Stands or paces while gaming or watching videos",
        "Gets up from the computer repeatedly during online courses or webinars",
        "Uses a walking pad or treadmill desk to avoid being seated",
        "Leaves the screen mid-way through online meetings and comes back"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Feels a strong pull to get up after sitting for a while",
        "Checks where the exits are so they know they can leave",
        "Counts down the minutes to the next break in long sessions",
        "Feels relief the moment they stand up and walk",
        "Plans excuses in advance to get out of long sit-down events",
        "Feels judged for always being the one who gets up"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Gets up to sharpen pencils many times a lesson",
        "Wanders round the classroom during independent work",
        "Goes to the teacher's desk or the bin again and again",
        "Asks to go to the toilet several times a day to get out of class",
        "Stands beside the desk to work instead of sitting",
        "Leaves the carpet during story time to look at things",
        "Gets up and visits other tables during lessons",
        "Was given jobs like taking the register to the office to let them move",
        "Leaves the line or the bench in the assembly hall",
        "Gets up during tests or quiet reading",
        "Has to be steered back to the seat by the teaching assistant",
        "Slides off the chair and ends up somewhere else in the room"
      ] },
      { ctx: "homework", label: "Homework", items: [
        "Gets up from homework every few minutes for a drink or snack",
        "Leaves the table halfway through a worksheet and has to be called back",
        "Does homework standing at the kitchen counter or walking around",
        "Gets up to look out of the window or check on the pet",
        "Homework takes hours because of constant trips away from the table",
        "A parent has to sit beside them to keep them in the chair"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Gets up from the dinner table repeatedly during a meal",
        "Eats while wandering around rather than seated",
        "Cannot stay in their seat through a family film",
        "Undoes the seatbelt or climbs out of the car seat on journeys",
        "Leaves the table at relatives' houses to explore other rooms",
        "Gets up during prayers or grace at mealtimes",
        "Gets down from the table before others have finished, despite being told",
        "Will not stay in the chair for a haircut"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Gets up and walks around between turns in table games",
        "Gets up and down during film nights at sleepovers",
        "Leaves the circle during party games that need sitting",
        "Friends complain they never stay sitting for a game of cards",
        "Leaves the craft table at parties after a minute or two"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "Gets up during church, mosque, temple or synagogue services",
        "Leaves the seat at the cinema or pantomime again and again",
        "Stands up in restaurants and wanders to other tables",
        "Cannot stay on the bench at sports club while waiting a turn",
        "Leaves the circle at Brownies, Cubs or Scouts",
        "Gets out of the seat on coach trips",
        "Walks about during music lessons or rehearsals"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "Report said 'needs to stay in their seat'",
        "Teacher wrote 'often out of seat without permission'",
        "Report said 'wanders around the classroom'",
        "Nursery noted they would not stay at the snack table",
        "Parents said they 'never finished a meal sitting down'",
        "Teacher put their desk by the door or gave movement breaks",
        "Lunchtime staff complained they left the dining table early"
      ] },
      { ctx: "teen", label: "Secondary school (12-16)", items: [
        "Was often sent out of lessons for being out of seat",
        "Asked for toilet passes often to walk the corridors",
        "Skipped long assemblies or lessons because sitting was so hard",
        "Walked out of exams as soon as it was allowed",
        "Picked subjects with practical work, like PE or design, to be able to move"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "In a typical working day, how many times do you get up when you did not need to?",
      "In a one-hour meeting or lecture, how many times would you leave your seat?",
      "How often do you sit through a whole meal without getting up?",
      "Is this most days, or only on certain days?",
      "When did you last stay seated for an hour without getting up?"
    ] },
    { k: "severity", label: "How strong", items: [
      "Do you just stand up, or actually leave the room?",
      "Has it made you miss information, parts of meetings or being called in?",
      "Has anyone told you off, asked you to stay put or complained?",
      "Do you avoid whole situations, like flights, cinemas or courses, because of it?",
      "From 0 to 10, how strong is the pull to get up?"
    ] },
    { k: "pervasive", label: "Where it happens", items: [
      "Does it happen at work, at home and when out with friends?",
      "Does it happen even when you are enjoying what you are watching or doing?",
      "Do you get up during your own meals at home as well as at formal events?",
      "Is it different on holiday?",
      "Does it happen when you are alone, or mainly when others are around?"
    ] },
    { k: "duration", label: "How long it has been there", items: [
      "Have you always been like this, or has it started recently?",
      "Has it been steady for at least the last six months?",
      "Were there times in adult life when you could stay seated easily? What was different?",
      "Did it start with a change of medicine, more caffeine or other substance use?",
      "Did it change after an injury or a health problem?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "In a meeting, are you the one who gets up most?",
      "Do your friends sit through films or meals more easily than you?",
      "At school, were you out of your seat more than other children?",
      "Do people joke about you never sitting down?",
      "Does your job need more moving than your colleagues' jobs, or do you make it that way?"
    ] },
    { k: "impact", label: "Effect on life", items: [
      "Has getting up or leaving affected your work reviews, studies or exams?",
      "Have you missed parts of lectures, meetings or appointments because you stepped out?",
      "Have you turned down jobs, courses, trips or events because they meant sitting?",
      "Does it cause friction with a partner, family or friends?",
      "Has it changed how others see you, for example as rude, bored or not interested?"
    ] },
    { k: "compensation", label: "Coping and hiding it", items: [
      "What do you do to cope with long periods of sitting?",
      "Do you choose aisle seats, seats by the door, or stand at the back?",
      "Have you set up your work or study to let you move, like a standing desk or walking meetings?",
      "Do you plan breaks or find reasons to get up?",
      "What happens when you cannot get up, for example on a plane?"
    ] },
    { k: "onset", label: "When it started", items: [
      "As a child, did teachers often tell you to sit back down?",
      "Could you stay seated through meals, services or films as a child?",
      "Do your school reports mention being out of your seat?",
      "Did this start before age 12?",
      "Did anything change it in your teens, like a new school or a sport?"
    ] }
  ],
  informant: {
    partner: [
      "When you eat together, do they stay seated for the whole meal?",
      "Can they sit through a film, show or concert without getting up?",
      "Do they walk about when on the phone or during conversations?",
      "Have they left events early because they could not stay seated?",
      "Do they avoid long journeys, flights or long sit-down events?",
      "Do they stop often on car journeys to get out?",
      "Have you stopped going to some places together because of this?",
      "Do they always choose seats near the door or on the aisle?",
      "Does it happen when they are relaxed and enjoying themselves?",
      "Has it been like this for as long as you have known them?",
      "Did it get worse with any medicine, caffeine, alcohol or other drug?"
    ],
    parent: [
      "At primary school, did they stay in their seat in class?",
      "Did teachers say they were often out of their seat or wandering?",
      "At home, did they sit through a whole meal?",
      "How were they at services, the cinema or in restaurants?",
      "Did they get out of their seat in the car or on the bus?",
      "Was it more than brothers, sisters or classmates?",
      "Did it happen most days, or only when tired, hungry or unwell?",
      "Did they get into trouble at school for not staying in their seat?",
      "Did teachers try things like movement breaks or errands?",
      "Did you notice this before they started school?",
      "Do you have school reports from that time?"
    ],
    school: [
      "Often out of seat",
      "Wanders around the classroom",
      "Needs reminders to stay seated",
      "Finds it hard to stay on the carpet",
      "Leaves the table at lunch",
      "Given movement breaks or jobs",
      "Must learn to stay in their place"
    ]
  },
  counts: [
    "Gets up or leaves often: most days, several times in situations where sitting is expected, not only now and then.",
    "More than peers in the same role and setting, and others have noticed (colleagues, teachers, family).",
    "Happens across settings, for example work, meals and leisure, not only in one place.",
    "Driven by an urge to move or the discomfort of staying seated, not by a task need or a physical reason.",
    "Longstanding and trait-like: present for at least six months and usually traceable to childhood.",
    "Clear avoidance of seated situations (flights, cinemas, lectures, ceremonies) because of this difficulty counts, even if they now rarely walk out because they no longer go.",
    "Compensations such as aisle seats, standing desks, walking meetings or invented errands count when used to manage the urge and they carry a cost or limit choices.",
    "Causes problems: missed information, complaints, disciplinary action, lost opportunities or friction at home.",
    "For childhood: frequent getting out of seat in class or at meals, beyond classmates, noted by teachers or parents."
  ],
  notCount: [
    "Getting up because the job genuinely requires moving (nurse, waiter, warehouse worker), unless they also leave when sitting is expected.",
    "Leaving because of pain, back problems, bladder or bowel conditions, diabetes, pregnancy or other medical needs.",
    "Leaving rooms because of panic, social fear or feeling trapped, where fear rather than an urge to move drives it.",
    "Leaving to smoke, vape or use substances, driven by craving or withdrawal.",
    "New restlessness after starting an antipsychotic, SSRI or other medicine (possible akathisia).",
    "Getting up only during a manic or hypomanic episode, with raised mood and reduced need for sleep.",
    "Leaving noisy, crowded or bright places because of sensory overload in autism, unless they also get up in calm, comfortable settings.",
    "Leaving to carry out checking, washing or other rituals.",
    "Getting up during unusually long sessions without breaks that most people would find hard.",
    "Onset only in recent months, or present in only one setting.",
    "In childhood, leaving the seat purely as deliberate defiance or to avoid work, without an urge to move (oppositional behaviour), though both can co-exist.",
    "Movement that is culturally usual, such as standing during worship or informal family meals eaten on the move."
  ],
  anchors: [
    { score: "yes", quote: "I'm up and down from my desk all day: kitchen, printer, toilet, anywhere. My manager put it in my appraisal. At home I can't get through a meal without getting up, and my partner calls me a jack-in-the-box. Teachers said the same.", why: "Present. Frequent, across work and home, noticed by others with consequences, with childhood history." },
    { score: "yes", quote: "I don't really get up in meetings now because I sit by the door and volunteer to do the flipchart. I stopped going to the cinema years ago. On long flights I walk the aisle the whole way.", why: "Present. Avoidance and compensation hide the symptom, and it shows whenever escape is not possible. Check childhood history." },
    { score: "yes", quote: "In lectures I'd last twenty minutes, then walk round the building and come back. In the end I stopped going and failed two modules. At school I was always being told to sit down.", why: "Present if it also appears outside lectures. Clear impact and childhood roots." },
    { score: "unsure", quote: "I'm a nurse, I'm on my feet all shift, so I don't really sit anyway.", why: "Unsure. The job requires movement. Ask about meals, films, training days and time off; score on situations where sitting is expected." },
    { score: "unsure", quote: "I walk out of meetings when they get too crowded and loud. I have to get out.", why: "Unsure. May be sensory overload or anxiety. Ask whether they also get up in quiet, comfortable settings." },
    { score: "unsure", quote: "I get up a lot at work, but that's because I go out for a cigarette every hour.", why: "Unsure. Nicotine craving can drive this. Ask whether they got up as often before they smoked and on days without smoking." },
    { score: "no", quote: "Since my car accident my back is bad and I have to stand every twenty minutes.", why: "Absent. Clear medical reason and recent onset." },
    { score: "no", quote: "I can sit through a whole film, no problem. I'll get up if a meeting drags, same as anyone.", why: "Absent. Similar to peers with no problems." },
    { score: "no", quote: "I can't sit in cinemas or churches because I panic that I'll be trapped and can't get out.", why: "Absent for this symptom. Avoidance is driven by fear of being trapped; assess panic and agoraphobia instead." }
  ],
  mimics: [
    { ddx: "panic", clue: "Leaving is driven by fear of being trapped or of a panic attack, with racing heart and dread.", ask: "When you leave, is it because of an urge to move, or because you feel frightened and need to escape?" },
    { ddx: "social", clue: "Leaves seated social situations to escape being watched or judged, not to move.", ask: "Would you stay seated if no one was looking at you or likely to talk to you?" },
    { ddx: "asd", clue: "Leaves noisy, bright or crowded rooms to cope with sensory overload, but stays seated easily somewhere quiet.", ask: "Do you also get up a lot when you are somewhere quiet and comfortable on your own?" },
    { ddx: "meds", clue: "Started or worsened after an antipsychotic, SSRI or anti-sickness medicine, with an inner urge to move the legs (akathisia).", ask: "Did the need to get up start or change when a medicine was started or its dose changed?" },
    { ddx: "sud_stim", clue: "Gets up mainly to smoke, vape or use stimulants, driven by craving or withdrawal.", ask: "Did you get up this often before you started smoking or using, and on days when you do not?" },
    { ddx: "bip", clue: "Leaving the seat only in spells of raised or irritable mood, little sleep and racing thoughts.", ask: "Are there spells of days or weeks when this is much worse, along with needing little sleep?" },
    { ddx: "ocd", clue: "Gets up to check locks, wash hands or complete rituals to reduce worry.", ask: "When you get up, is it to check or do something that eases a worry, or just to move?" },
    { ddx: "aspd", clue: "In childhood, leaving the seat as deliberate defiance alongside rule-breaking, aggression or truancy.", ask: "As a child, did you leave your seat because you could not stay still, or to defy the teacher or get out of work?" },
    { ddx: "rls", clue: "Has to get up because of unpleasant leg sensations at rest, worse later in the day.", ask: "Is the urge mainly in your legs, with an uncomfortable feeling, and worse in the evening?" },
    { ddx: "normal", clue: "Gets up as often as peers in long sessions without breaks, or works in a job that requires moving.", ask: "If you had a seated job, would you stay at your desk as long as your colleagues do?" }
  ],
  special: {
    women: "Girls and women often stay seated through effort and leave in socially accepted ways, such as helping, making tea or tidying, so the symptom can look like helpfulness. Ask what drives the getting up and about avoidance of long seated events.",
    older: "Older adults may have good reasons to get up (bladder, joint pain, circulation), so check medical causes first. Look for a lifelong pattern from childhood, and treat new restlessness or wandering as a possible sign of medicine effects, pain or cognitive decline.",
    highIQ: "Capable adults often choose roles that allow movement (management, teaching, sales, clinical work) or arrange walking meetings, which hides the symptom. Ask what happens in unavoidable seated settings such as exams, flights, training days and long ceremonies.",
    sud: "Frequent exits to smoke, vape or use substances can look like this symptom. Check whether getting up predates substance use and persists on substance-free days, and whether stimulants or withdrawal are causing restlessness.",
    asd: "Autistic people may leave because of sensory overload, social demands or unexpected change, rather than a motor urge. ADHD-type leaving happens even in calm, predictable and enjoyable settings; the two often co-exist.",
    culture: "Expectations about sitting differ between cultures, families, schools and workplaces, for example standing during worship, informal family meals or active classrooms. Compare with others from the same background and setting."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A2b, paraphrased",
    "ICD-11 6A05 (WHO 2022), hyperactivity-impulsivity features, paraphrased",
    "ASRS v1.1 item 12 (Kessler et al. 2005)",
    "Kooij JJS et al. Updated European consensus statement on diagnosis and treatment of adult ADHD. Eur Psychiatry 2019",
    "DIVA 2.0 structure (Kooij and Francken 2010); wording original",
    "Clinical practice: akathisia, pain, panic and sensory overload as differentials"
  ]
}]);
