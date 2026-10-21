/* hi9: Interrupts or intrudes on others. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "hi9",
  dim: "HI",
  codes: { dsm5: "A2i", diva: "H/I 9", asrs: [18] },
  title: "Interrupts or intrudes on others",
  criterion: "Often breaks in on other people or imposes on them: butts into their conversations, games or activities, or starts using their belongings without asking or being given permission. In adolescents and adults this can include stepping into or taking over what others are doing.",
  adultForm: "In adults this shows as breaking into conversations they are not part of, interrupting people who are busy, offering opinions or help nobody asked for, taking over tasks or projects, and using other people's belongings without asking. DSM-5-TR notes that adolescents and adults may intrude into or take over what others are doing. People often get feedback about being pushy, bossy or nosy, and may not notice the intrusion until afterwards.",
  why: "Poor inhibition of the impulse to act or speak the moment something catches their interest, combined with reduced monitoring of social cues while engaged. Low tolerance of watching others do things slowly or differently adds an urge to step in, and the person often realises only later that a boundary was crossed.",
  ask: {
    adult: "Over the last six months, how often have you interrupted other people or butted in on what they were doing, for example breaking into conversations, taking over tasks or using people's things without asking? Can you give me a recent example?",
    child: "When you were at primary school, between about 5 and 12, did you butt into other children's games or interrupt adults when they were talking or busy? Did you take or use other people's things without asking? What did people say about it?"
  },
  rephrase: [
    "How often do you interrupt people? Tell me about the last time.",
    "What happens when you see people talking or busy and you want to say something?",
    "Tell me about a time you joined a conversation or a game without being asked.",
    "When someone else is doing a task, what makes you step in and take it over? Give me an example.",
    "Tell me about a time you used something that belonged to someone else without asking first.",
    "What words have other people used about the way you join in or step in?",
    "Tell me about a recent time you stepped into something that was someone else's business. What happened?",
    "How do people react when you join a conversation or a task they had started?",
    "Everyone interrupts sometimes. Does it happen more often for you, and has it caused you trouble with people?",
    "Do you have to stop yourself stepping in when you see someone doing something slowly or differently? What does that take?",
    "When do you notice that you have crossed a line: at the time, afterwards, or only when someone tells you?",
    "Do people say things like 'excuse me, we were talking' or 'I've got this' to you?",
    "When someone is busy and you want to tell them something, what do you usually do?"
  ],
  examples: {
    adult: [
      { ctx: "conversation", label: "Conversations and meetings", items: [
        "Cuts into conversations between other people without being invited",
        "Breaks in mid-flow to switch the topic to their own interest",
        "Interrupts speakers in meetings so often that the chair steps in",
        "Adds their view to strangers' conversations on buses or in shops",
        "Breaks into someone's story to tell a related one of their own",
        "Talks over the presenter on video calls",
        "Interrupts to correct small details in someone else's account",
        "Starts talking to someone who is clearly busy with another person",
        "Fires questions at a presenter before they have opened the floor",
        "Is told 'excuse me, we were talking' by others",
        "Takes the discussion over so that others give up trying to speak",
        "Interrupts someone on a phone call to ask them something"
      ] },
      { ctx: "work", label: "Work", items: [
        "Goes to a colleague's desk to chat while they are clearly busy",
        "Takes over a colleague's task because they are doing it too slowly",
        "Answers a colleague's phone or opens their post without being asked",
        "Rearranges someone else's workspace, files or tools",
        "Borrows equipment or tools from co-workers without asking first",
        "Takes charge of a project or presentation someone else is leading",
        "Gives unrequested advice to colleagues about how to do their job",
        "Steps into decisions that belong to another team or manager",
        "Takes the tools or controls from a co-worker to show them how",
        "Has had feedback from a manager or HR about overstepping boundaries",
        "Eats or drinks things from the shared fridge that belong to others",
        "Walks into offices or meetings without knocking",
        "Takes over customer conversations that a colleague is handling",
        "Tells customers what to choose before they have asked for advice"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "Interrupts lecturers mid-explanation with questions or comments",
        "Takes over group projects and rewrites other people's sections",
        "Uses classmates' notes, chargers or laptops without asking",
        "Starts chatting to people who are trying to study in the library",
        "Interrupts other students' presentations with questions or additions"
      ] },
      { ctx: "home", label: "Home and household", items: [
        "Rearranges housemates' things or cupboards without asking",
        "Uses flatmates' food, toiletries or chargers without asking",
        "Walks into other people's rooms without knocking",
        "Takes over the cooking when someone else has started it",
        "Picks up and reads letters or papers left out by others",
        "Wanders over to help with a neighbour's DIY without being asked",
        "Moves other people's washing or belongings to make room for their own",
        "Reorganises a relative's kitchen while visiting them"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Reads a partner's messages over their shoulder",
        "Interrupts a partner's phone calls with comments or questions",
        "Starts talking to a partner who is clearly reading, working or watching something",
        "Uses a partner's car, phone or clothes without asking",
        "Makes arrangements on a partner's behalf without checking first",
        "Relatives say they take over family events and gatherings",
        "Joins in arguments between family members that do not involve them",
        "Partner complains of having no time or space without interruption"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "Takes over children's homework or school projects",
        "Joins children's games and changes the rules or takes charge",
        "Butts into their child's conversations with friends",
        "Breaks into a child's play or concentration to start something new",
        "Steps in to tell other parents how to handle their children",
        "Walks into a teenager's room without knocking, even after being asked to knock",
        "Steps in while the other parent is dealing with a child's behaviour"
      ] },
      { ctx: "social", label: "Friends and social life", items: [
        "Joins groups at parties uninvited and takes over the chat",
        "Picks up and examines things in other people's homes without asking",
        "Offers opinions on friends' relationships or choices without being asked",
        "Takes over the organising of friends' plans",
        "Friends have pulled away because they felt crowded or overruled",
        "Steps into strangers' disputes or business in public",
        "Turns up at friends' homes without arranging it first",
        "Helps themselves to food or drink at other people's homes",
        "Answers the phone or door in other people's homes"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Picks up other people's phones to look through them",
        "Jumps into other people's online debates uninvited",
        "Takes over a shared screen or keyboard during a call",
        "Changes settings in a shared account without asking others",
        "Edits shared documents that others are still writing without asking",
        "Sends a stream of messages that break into colleagues' focused work",
        "Uses someone's logged-in laptop or tablet without asking"
      ] },
      { ctx: "driving", label: "Driving and travel", items: [
        "Tells the driver how to drive, which route to take or when to pull out",
        "Changes the music, heating or sat-nav in someone else's car without asking",
        "Gets out to direct other drivers when there is a hold-up",
        "Takes over the map, tickets or plans when travelling with others"
      ] },
      { ctx: "leisure", label: "Leisure and hobbies", items: [
        "Joins other people's games or sports without being asked",
        "Takes the remote and changes the channel while others are watching",
        "Coaches teammates or other players who have not asked for help",
        "Takes over the barbecue or cooking at gatherings",
        "Takes other players' shots or positions in team sports",
        "Moves other players' pieces in board games to show them a better move",
        "Uses other members' equipment at clubs without asking"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Feels an urge to step in when watching someone do something slowly",
        "Only realises afterwards that they have overstepped",
        "Knows the rule about knocking or asking first but acts before remembering it",
        "Feels shame on realising they have taken over again",
        "Worries that others see them as pushy or nosy",
        "Gets so caught up in an idea that they miss that the other person is busy",
        "Asks a trusted colleague to signal when they are overstepping",
        "Avoids group projects to stop themselves taking over",
        "Works alone where possible to avoid clashes over boundaries",
        "Leaves the room so as not to take a task off someone"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Interrupts the teacher while they are talking to the class",
        "Takes classmates' pencils, rubbers or rulers without asking",
        "Butts into other groups' work and tells them what to do",
        "Talks to classmates while they are trying to work",
        "Touches or moves other children's work or displays",
        "Goes into the teacher's desk or drawers",
        "Interrupts when the teacher is busy with another child",
        "Takes over when it is another child's job to demonstrate",
        "Barges into other classrooms or the staff room",
        "Pokes or taps classmates to get their attention while they work"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Joins other children's games without asking",
        "Changes the rules of games other children have set up",
        "Takes toys from other children",
        "Not invited to parties or playdates because of being bossy or intrusive",
        "Barges into games already under way and disrupts them",
        "Wants to be in charge of every game",
        "Knocks down or rearranges other children's models or dens",
        "Follows other children around and will not leave them alone",
        "Steps into other children's arguments and takes sides"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Interrupts parents when they are on the phone",
        "Bursts into brothers' and sisters' rooms",
        "Uses brothers' and sisters' things without asking",
        "Interrupts adult conversations at meals or with visitors",
        "Goes through parents' bags, drawers or cupboards",
        "Will not leave a parent alone while they cook or work",
        "Takes over a brother's or sister's game on the console",
        "Reads brothers' or sisters' diaries or messages",
        "Helps themselves to food meant for others"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "Interrupts the coach or club leader while they explain",
        "Grabs other children's equipment at clubs",
        "Joins other teams' games during breaks",
        "Wanders into areas or rooms that are off-limits on trips",
        "Takes over group tasks at Scouts, Guides or similar clubs",
        "Approaches strangers and joins in what they are doing",
        "Butts into other children's performances or turns on stage"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "Report: 'needs to respect other people's space'",
        "Report: 'interrupts frequently, even after reminders'",
        "Report: 'finds it hard to let others lead'",
        "Report: 'can be bossy in group work'",
        "Report: 'takes other children's belongings without asking'",
        "Parent: 'was into everything and everyone's business'",
        "Parent: 'other parents complained that they took over'"
      ] },
      { ctx: "teen", label: "Secondary school (12-16, optional)", items: [
        "Got into fights after stepping into other people's arguments",
        "Took over group projects at secondary school",
        "Used friends' phones, bags or clothes without asking",
        "Teachers described them as being in everyone's business",
        "Lost friends who felt crowded or bossed around"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "How often in a typical day do you interrupt people or step into what they are doing?",
      "Does it happen most days, or only now and then?",
      "In the last week, can you think of particular times you butted in or took over?",
      "How often do people say things like 'I've got this' or 'excuse me' to you?",
      "How often do you use other people's things without asking?"
    ] },
    { k: "severity", label: "How strong", items: [
      "When you interrupt, is it a quick word, or do you take over the conversation or task?",
      "Have you taken over something that someone else had been given to do?",
      "How hard is it to stop yourself stepping in once you feel the urge?",
      "Have you caused real offence or conflict by intruding?",
      "Can you hold back when it matters, for example with a senior manager? What does that take?"
    ] },
    { k: "pervasive", label: "In which settings", items: [
      "Does this happen at work, at home and with friends, or mainly in one place?",
      "Is it the same with strangers as with people you know?",
      "Does it happen online, in shared documents or group chats as well as face to face?",
      "Are there situations where you never do it? What is different there?",
      "Does it happen when you are calm, or only when excited, stressed or under the influence?"
    ] },
    { k: "duration", label: "How long", items: [
      "How long have people commented on this?",
      "Was it there before any recent stress, change in mood or substance use?",
      "Has it been present most of the time for at least the last six months?",
      "Were you like this as a teenager and a young adult?",
      "Has anything changed recently, such as a new job, a head injury or new medication?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Compared with friends and colleagues, do you interrupt or step in more, less or about the same?",
      "Do others in your team or family get feedback about this, or mainly you?",
      "Have people described you as pushy, bossy or nosy more than others?",
      "Do you notice others waiting to be invited when you just join in?",
      "What would a partner or close friend say about you compared with others?"
    ] },
    { k: "impact", label: "What it costs", items: [
      "Has this caused arguments, hurt feelings or lost friendships?",
      "Has it led to complaints, warnings or poor appraisals at work?",
      "Have people stopped inviting you to things or including you?",
      "Has it caused problems with neighbours, housemates or family?",
      "Have you damaged or lost things you used without asking?",
      "How do you feel when you realise you have intruded?"
    ] },
    { k: "compensation", label: "What you do to hold back", items: [
      "What do you do to stop yourself interrupting or taking over?",
      "Do you avoid group work or social events to prevent it?",
      "Has anyone agreed a signal to let you know when you are overstepping?",
      "How much effort does it take to hold back in a meeting or a group?",
      "What does holding back cost you, such as missed chances or exhaustion?"
    ] },
    { k: "onset", label: "When it started", items: [
      "As a child, did you butt into other children's games or adults' conversations?",
      "Did teachers mention interrupting or respecting other people's space?",
      "Did you take or use other children's things without asking?",
      "Did other parents or children complain that you took over?",
      "Was this already there before age 12?"
    ] }
  ],
  informant: {
    partner: [
      "Do they interrupt you or others when you are talking or busy?",
      "Do they join other people's conversations without being invited?",
      "Do they take over tasks you are doing, such as cooking or DIY?",
      "Do they use your things without asking?",
      "Do they give opinions or advice about other people's business without being asked?",
      "Have friends or family complained that they take over?",
      "Do they seem to notice only afterwards that they have overstepped?",
      "Does it happen when they are calm and sober, not only when excited or drinking?",
      "Is it the same at home, at work and with friends?",
      "How long have you noticed this? Was it there when you met?",
      "Compared with other people you know, how much do they do this?"
    ],
    parent: [
      "As a child, did they butt into other children's games?",
      "Did they interrupt you when you were on the phone or talking to other adults?",
      "Did they take or use other people's things without asking?",
      "Did they go through drawers, bags or rooms that were not theirs?",
      "Did they take over games and tell other children what to do?",
      "Did teachers mention interrupting or not respecting other people's space?",
      "Did other parents or children complain about them?",
      "Did they do this more than other children of the same age?",
      "Was it the same at home, at school and at clubs?",
      "Did it carry on despite reminders, rewards or consequences?",
      "At what age did you first notice it?"
    ],
    school: [
      "Interrupts frequently",
      "Needs to respect other people's space and belongings",
      "Finds it hard to let others lead",
      "Can be bossy in group work",
      "Takes other children's things without asking",
      "Joins other children's games uninvited",
      "Interrupts when the teacher is busy with others"
    ]
  },
  counts: [
    "Interrupts people or butts in on what they are doing often: most days, in more than one kind of situation.",
    "It is clearly more than for most people of the same age, culture and background.",
    "It shows in at least two settings, for example work and home, or friends and family.",
    "It involves breaking into other people's conversations, activities, tasks or belongings, not only finishing their sentences (that is hi7).",
    "It is longstanding: present for at least six months and usually for years.",
    "It has a cost: complaints, warnings, conflict, lost friendships or people avoiding them.",
    "It is unplanned rather than deliberate: the person often notices only afterwards or when told, and may then feel embarrassed (regret is common but not required).",
    "It happens when calm and sober, not only when excited, intoxicated or high.",
    "Holding back still counts if it needs constant effort or avoidance, such as steering clear of group work.",
    "Collateral reports from a partner, family, colleagues or school of interrupting or taking over support scoring present."
  ],
  notCount: [
    "Occasional interrupting when excited or when something urgent needs saying: normal variation.",
    "Interrupting or taking over only during a distinct period of high or irritable mood with less need for sleep (consider hypomania or bipolar disorder).",
    "Intruding only when intoxicated with alcohol or stimulants.",
    "Not knowing when it is OK to join in or misreading social cues, without an urge to act (consider autism; both can co-exist).",
    "Taking over because things must be done in a precise way, from perfectionism or distrust of others' work (consider OCD or obsessive-compulsive personality traits).",
    "Deliberate, entitled use of other people's things or domination of others with disregard for their rights (consider antisocial traits).",
    "Checking a partner's phone or movements driven by jealousy or fear of being abandoned (consider relationship difficulties or emotionally unstable personality).",
    "A role that requires stepping in, such as a supervisor, teacher or carer doing their job.",
    "Family or cultural norms where joining others' conversations or sharing belongings freely is expected.",
    "Interrupting because of hearing loss, where the person does not realise someone else is speaking.",
    "A new pattern of disinhibited, intrusive behaviour that started in middle or later life (consider brain injury, frontotemporal dementia or medication effects).",
    "Scoring error: answering before a question is finished or completing sentences belongs to hi7, and talking at length belongs to hi6."
  ],
  anchors: [
    { score: "yes", quote: "At work I'm forever going over to people's desks when they've got their headphones on. My manager has had a word twice about me taking over other people's projects. At home my partner says they can't cook a meal without me jumping in.", why: "Score Present: frequent, at work and at home, with formal feedback and collateral support." },
    { score: "yes", quote: "I don't realise I'm doing it. I'll be in a group and suddenly I've joined someone else's conversation and taken it over. Some friends have stopped inviting me. I feel awful afterwards.", why: "Score Present: unplanned, frequent, with social cost and regret afterwards." },
    { score: "yes", quote: "I avoid group projects now because I always end up rewriting everyone's parts. And I'm always using people's chargers and pens without asking. My housemates have started labelling their things.", why: "Score Present: across settings, with avoidance as compensation and clear reactions from others." },
    { score: "unsure", quote: "I suppose I interrupt a bit when I'm passionate about something.", why: "Unsure: ask how often, in which settings, whether people have given feedback, and whether it has cost them anything." },
    { score: "unsure", quote: "My manager says I overstep, but that's because the team is so slow and I'm the one responsible for the deadline.", why: "Unsure: may be role-related or about control. Ask whether it happens outside work and in situations where they carry no responsibility." },
    { score: "unsure", quote: "I only check my partner's phone because I'm worried they're seeing someone else.", why: "Unsure, leaning towards absent: intrusion driven by jealousy or insecurity rather than impulsivity. Ask about intrusiveness with friends, colleagues and strangers." },
    { score: "no", quote: "In my family we share everything and talk over each other, and nobody minds. At work I'm quite different and wait to be asked.", why: "Score Absent: a family norm that switches off easily, with no impairment." },
    { score: "no", quote: "As a team leader it's my job to step in when things go wrong, and I do.", why: "Score Absent: stepping in is part of the role and is not intrusion." },
    { score: "no", quote: "There were a few weeks in my thirties when I was into everyone's business, barely sleeping and starting rows, but it stopped and I've been myself since.", why: "Score Absent for ADHD: an episodic change with reduced sleep suggests hypomania. Explore bipolar disorder." }
  ],
  mimics: [
    { ddx: "asd", clue: "Joins in or interrupts because unwritten social rules are unclear or cues that someone is busy are missed; the behaviour comes from uncertainty about the rules rather than from acting before thinking.", ask: "When you join in or interrupt, is it an urge you cannot hold back, or are you unsure when it is OK to join in?" },
    { ddx: "bip", clue: "Intrusiveness, disinhibition and taking over only during distinct episodes with raised mood and less sleep.", ask: "Have there been periods of days or weeks when you were much more forward with people than usual and needed little sleep?" },
    { ddx: "bpd", clue: "Intrusion into a partner's life driven by fear of abandonment or jealousy, mostly in close relationships.", ask: "Does it happen with colleagues and strangers too, or mainly with people you feel close to and fear losing?" },
    { ddx: "aspd", clue: "Deliberate use of others' belongings or control over others without remorse, alongside wider rule-breaking.", ask: "When you take or use someone's things, do you realise at the time, and do you feel bad about it afterwards?" },
    { ddx: "ocd", clue: "Takes over tasks because they must be done in a precise way to ease anxiety, not because of an urge to act.", ask: "When you take over, is it because waiting is unbearable, or because it has to be done exactly right?" },
    { ddx: "sud_alcohol", clue: "Intrusive, disinhibited behaviour only after drinking.", ask: "How are you with people on days when you have not had a drink?" },
    { ddx: "cptsd", clue: "Overfamiliarity and crossing boundaries that grew out of early neglect or unstable care, often with indiscriminate closeness to strangers and a strong need not to be left out, rather than acting before thinking.", ask: "Is the joining in more about needing to be close to people and included? What was home like when you were small, and did you have the same carers throughout?" },
    { ddx: "tbi", clue: "New disinhibition or social intrusiveness after a head injury or neurological illness.", ask: "Were you like this before the injury, or did people notice a change afterwards?" },
    { ddx: "mci", clue: "Late-onset loss of social boundaries or personality change (consider frontotemporal dementia).", ask: "When did people first notice this? Were you like this in your twenties and thirties?" },
    { ddx: "normal", clue: "Friendly, sociable joining in that others welcome and that switches off easily.", ask: "Has anyone ever complained about it, and can you hold back without effort when you need to?" }
  ],
  special: {
    women: "Women may show this as taking over tasks, helping without being asked or overstepping in friendships, which others may call bossy or controlling rather than impulsive. Many hold back in public and feel shame afterwards. Ask about close relationships, group work and what holding back costs them.",
    older: "Older adults may have learned to wait to be invited, so ask family about the lifelong pattern. A new loss of social boundaries in later life is a warning sign for frontotemporal dementia, stroke or other neurological illness rather than ADHD.",
    highIQ: "Able people may take over because they genuinely see the solution first, and in leadership roles this may be rewarded for a while. Look for complaints about overstepping, strained teams and the effort it takes to let others lead.",
    sud: "Alcohol and stimulants such as cocaine or amphetamines reduce social inhibition and can produce pushy, intrusive behaviour. Confirm that interrupting and intruding happen when sober and predate substance use, ideally with a parent's account of childhood.",
    asd: "Autistic people may interrupt or join in at the wrong moment because unwritten social rules are unclear, and may use others' things without realising it matters. In ADHD the person usually knows the rule but acts before thinking. Both can be present, so ask what drives the behaviour.",
    culture: "Norms about personal space, sharing belongings and joining others' conversations vary between cultures, families and generations. Judge against the person's own community and ask whether people within it see the behaviour as unusual or a problem."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A2i, paraphrased",
    "ICD-11 CDDR 6A05 (WHO 2024), hyperactivity-impulsivity features, paraphrased",
    "Kooij JJS et al. Updated European consensus statement on adult ADHD. Eur Psychiatry 2019;56:14-34",
    "DIVA 2.0 structure (Kooij and Francken 2010); question and example wording original",
    "ASRS v1.1 item 18 (WHO 2003)",
    "Clinical practice"
  ]
}]);
