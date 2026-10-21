/* hi6: Talks too much. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "hi6",
  dim: "HI",
  codes: { dsm5: "A2f", diva: "H/I 6", asrs: [15] },
  title: "Talks too much",
  criterion: "Often talks a great deal, far more than the situation calls for and more than most people of a similar age, and finds it hard to hold back or stop once started.",
  adultForm: "DSM-5-TR gives no separate adult illustration for this item. In adults it shows as doing most of the talking, long monologues and stories with far more detail than needed, meetings and calls that overrun, struggling to stop once started, and the same pattern in voice notes, messages and emails. Many adults learn to monitor themselves or hold back, so they may seem quiet in new groups yet talk non-stop with people they know; the effort of holding back is part of the picture.",
  why: "Linked to weak verbal inhibition and poor self-monitoring: thoughts flow into speech without a filter, and the person does not easily notice cues that others want a turn or want to leave. Talking can also provide stimulation and help them think out loud, which makes it harder to stop.",
  ask: {
    adult: "Over the last six months, have you, or other people, felt that you talk too much, or more than others in the conversation? What usually happens, and can you give me a recent example?",
    child: "When you were at primary school, around age 5 to 12, did you talk a lot more than other children? Were you told off for chatting, or did your reports or your parents mention it?"
  },
  rephrase: [
    "Do people tell you that you talk a lot?",
    "In a chat with friends, who usually does most of the talking?",
    "Once you start talking, how easy is it for you to stop?",
    "Do people seem to switch off, look at their watch or look tired while you are talking?",
    "Plain words: do you talk more than other people?",
    "Simple English: do you speak a lot? Do people ask you to speak less?",
    "Has anyone at work said you talk too much in meetings or on the phone?",
    "Do you send long voice notes, or lots of messages in a row?",
    "Everyone likes a chat. Do you get comments about your talking that your friends do not get?",
    "Do you sometimes stay quiet on purpose because you know you will go on too long? How hard is that?",
    "How long do your phone calls usually last compared with other people's?",
    "When you tell a story, do you go into more detail than people want?",
    "Tell me about the last time someone said, or hinted, that you were talking too much.",
    "Would people who know you well call you a big talker?"
  ],
  examples: {
    adult: [
      { ctx: "conversation", label: "Conversations and meetings", items: [
        "Does most of the talking in one-to-one conversations",
        "Gives long answers when a short one would do",
        "Keeps going after the listener has looked away or checked the time",
        "Notices too late that nobody else has spoken for a while",
        "Tells long stories packed with side details",
        "Finds it hard to wrap up and finish a point",
        "Others have to walk away or end the call to stop the conversation",
        "Talks at people rather than with them",
        "Repeats the same point several times in different words",
        "Others have to say they need to go several times before it ends",
        "Holds the floor so long that people drift away from the group"
      ] },
      { ctx: "work", label: "Work", items: [
        "Meetings overrun because they speak at great length",
        "Manager has asked them to keep updates brief",
        "Colleagues avoid starting a chat because it will take ages",
        "Spends so much of the day chatting that they work late to catch up",
        "Customer calls take much longer than colleagues' calls",
        "Appraisals mention dominating discussions or not leaving space for others",
        "Chats to colleagues while they are trying to concentrate",
        "Presentations run far over the time allowed",
        "Known on the shop floor, site or ward for never stopping chatting",
        "Clients or customers comment on how chatty they are",
        "Chose sales, hospitality or care partly because talking a lot is welcome there",
        "Writes 'keep it short' on notes before meetings to rein themselves in"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "Tutors have asked them to give others a chance in seminars",
        "Chats through lectures or classes with whoever sits nearby",
        "Study groups get little done because they keep talking",
        "Has been asked to leave a study space for chatting",
        "Takes over the chat or keeps unmuting during online classes"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Partner says they cannot get a word in",
        "Partner zones out during long accounts of their day",
        "Talks to their partner while the partner is reading, working or dropping off to sleep",
        "Family tease them about never pausing for breath",
        "Rows about not listening because they are always the one talking",
        "Phone calls with relatives last hours",
        "Partner gives an agreed signal when they have gone on too long",
        "Partner feels drained after evenings of constant talk",
        "Rings family members several times a day just to chat"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "Children complain about long lectures or explanations",
        "Chats so long at the school gate that pick-up takes ages",
        "Explains things to the children at far greater length than needed",
        "Children say 'you're talking too much again'",
        "Teenagers avoid car journeys with them to escape long talks"
      ] },
      { ctx: "social", label: "Friends and social life", items: [
        "Friends joke that they could talk for their country",
        "Dominates group conversations at dinners and parties",
        "Leaves social events worried they talked too much",
        "Shares far more personal detail than intended with people they have just met",
        "Has lost friends who found them tiring to be around because of the talking",
        "Talks to strangers in queues, shops and buses for a long time",
        "Friends let calls go to voicemail because conversations go on so long",
        "Is described as 'a talker', 'chatty' or 'motormouth'",
        "Asks a friend to signal when they have been talking too long",
        "Takes over the conversation even at other people's celebrations"
      ] },
      { ctx: "driving", label: "Driving and travel", items: [
        "Talks non-stop on car journeys while passengers pretend to sleep",
        "Chats to taxi drivers or fellow passengers for the whole journey",
        "Spends almost every drive on long hands-free calls",
        "Travel companions ask for some quiet time",
        "Talks out loud to themselves while driving alone"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Sends long voice notes that friends admit they never finish",
        "Sends many messages in a row before anyone has replied",
        "Writes emails and texts several times longer than needed",
        "Posts or comments online far more than most people",
        "Talks on video calls for so long that others leave early",
        "Group chat members have muted them",
        "Spends hours on the phone most evenings",
        "Leaves voicemails so long that they get cut off"
      ] },
      { ctx: "health", label: "Health and appointments", items: [
        "GP appointments overrun because they talk at length",
        "Clinicians have to bring them back to the point again and again",
        "Chats through dental work, scans or haircuts",
        "Uses up appointment time before getting to the main problem",
        "Others in groups or therapy sessions complain about the time they take"
      ] },
      { ctx: "admin", label: "Paperwork and money", items: [
        "Chats to call-centre staff about life long after the query is sorted",
        "Talks at length to shop staff, holding up the queue",
        "A quick call to sort out a bill turns into a long chat",
        "Tradespeople and delivery drivers struggle to get away after a visit"
      ] },
      { ctx: "leisure", label: "Leisure and hobbies", items: [
        "Talks through films, TV or sport that others are trying to watch",
        "Chats constantly at the gym, in classes or on walks",
        "Team-mates or club members say they never stop chatting",
        "Chats through calm pastimes like fishing or golf, irritating companions",
        "Gets told off at a book club or evening class for talking too much"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Knows they talk too much but cannot seem to stop",
        "Feels a strong pull to keep talking once started",
        "Replays conversations later and cringes at how much they said",
        "Thinks out loud; speaking helps them find their thoughts",
        "Finds a pause in conversation uncomfortable and fills it",
        "Feels worn out from monitoring how much they speak",
        "Stays quiet in new groups out of fear of talking too much",
        "Feels bored or flat when there is nobody to talk to",
        "Finds that as one story ends, another is already starting"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Chatted to the children nearby in lessons nearly every day",
        "Was moved seats to stop them chatting",
        "Had reward points or stickers taken away for chatting",
        "Talked during silent reading or tests",
        "Gave long answers when a short reply was asked for",
        "Carried on talking after the teacher asked the class to stop",
        "Name went on the board for talking",
        "Classmates complained that the chatter stopped them working",
        "Chatted through the register and the start of every lesson"
      ] },
      { ctx: "homework", label: "Homework", items: [
        "Talked all through homework time instead of writing",
        "Turned homework help into long chats about other things",
        "Needed reminders to stop chatting and get on",
        "Narrated everything out loud while working",
        "Kept stopping homework to tell a parent long stories"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Talked from waking up until falling asleep",
        "Parents felt worn out by the constant talking",
        "Talked through TV programmes and films",
        "Kept chatting at bedtime after lights out",
        "Brothers and sisters said they never got a word in",
        "Talked all the way through car journeys",
        "Talked to visiting relatives for ages and would not let them go",
        "Followed parents from room to room, talking all the while"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Did more talking than playing when with friends",
        "Other children told them to be quiet",
        "Explained games at great length before anyone could start",
        "Kept up a running commentary while playing alone",
        "Friends' parents remarked on how much they talked",
        "Talked so much at sleepovers that friends could not get to sleep"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "Leaders at Guides, Cubs or Scouts kept pausing activities to quieten their chatter",
        "Chatted to neighbours all through school shows and concerts",
        "Coaches asked them to stop talking and listen",
        "Chatted to strangers on buses or in shops",
        "Chatted through music or swimming lessons",
        "Talked the whole way round museums and days out"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "Report described them as 'very chatty'",
        "Teacher wrote that they needed to listen more and talk less",
        "Parents' evening comments about chatting in class",
        "Nicknamed 'motormouth' or something similar",
        "Report said their chatter distracted other pupils",
        "Comments about chatting appeared in report after report",
        "Behaviour logs listed talking in class again and again"
      ] },
      { ctx: "teen", label: "Secondary school (12-16, optional)", items: [
        "Got detentions for talking in lessons",
        "Spent hours on the phone or messaging every night",
        "Teachers separated them from friends to stop the chatter",
        "Was seen as 'the chatty one' in their friendship group",
        "Was told off in exams or mocks for talking",
        "Ran up phone bills or used up data on hours of calls"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "How often does someone tell you, or show you, that you are talking too much?",
      "In a typical conversation, how much of the talking is yours?",
      "Is this most days and in most conversations?",
      "When did you last notice that you had talked for too long?",
      "How many times a week does a call or chat run much longer than planned because of you?",
      "Does it happen when you are calm and relaxed, not only when excited?"
    ] },
    { k: "severity", label: "How strong", items: [
      "Have people walked away, ended calls or avoided you because of how much you talk?",
      "Can you stop when someone gives a hint? What about when they ask you directly?",
      "Has it got you into trouble at work, college or with friends?",
      "How much effort does it take to keep what you say short?",
      "Does it happen even in serious settings, like a work review or a medical appointment?",
      "How long can you go in a group without speaking before it becomes hard?"
    ] },
    { k: "pervasive", label: "In which settings", items: [
      "Is it the same at home, at work and with friends?",
      "Do you talk a lot with strangers, or only with people you know?",
      "Is it the same on the phone and in messages?",
      "Does it happen when you are calm, not just when excited, nervous or drinking?",
      "Is it about any topic, or mainly about one subject you love?"
    ] },
    { k: "duration", label: "How long", items: [
      "How long have people said you talk a lot?",
      "Has it always been like this, or did it start at some point?",
      "Have there been spells when you talked much more than usual, with less sleep and racing thoughts?",
      "Has it been there for at least the last six months?",
      "Does it change with your mood, stress or medication?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Compared with friends of your age, do you talk more?",
      "Who talks the most in your family? Where do you come?",
      "Do people from your own background or culture see you as unusually talkative?",
      "Do others get told they talk too much as often as you do?",
      "If your job involves a lot of talking, do colleagues talk as much as you?"
    ] },
    { k: "impact", label: "What it costs", items: [
      "Has your talking caused problems at work, such as overrunning meetings or customer time?",
      "Has it caused arguments or distance with a partner, friends or family?",
      "Have you lost friends or been left out because of it?",
      "Do you worry after conversations about how much you said?",
      "Has it affected job interviews, appointments or exams?",
      "Has it cost you time you needed for other things, such as work or sleep?"
    ] },
    { k: "compensation", label: "What you do to hold back", items: [
      "What do you do to stop yourself talking too much?",
      "Do you use limits, like timers, notes or a signal from a friend?",
      "Do you stay quiet in some places on purpose? How does that feel?",
      "Have you chosen jobs where talking a lot is useful?",
      "How tiring is it to keep checking yourself?",
      "What happens when you relax and stop checking?"
    ] },
    { k: "onset", label: "When it started", items: [
      "Were you a talkative child? What did your family say?",
      "Did teachers or primary school reports mention talking?",
      "Was it there before age 12?",
      "Did it begin, or get much worse, with a change in mood, a head injury, or a new medicine or drug?",
      "Do relatives remember you being told off for chatting when you were young?"
    ] }
  ],
  informant: {
    partner: [
      "Do they talk more than most people you know?",
      "Is it hard to get a word in when you are talking together?",
      "Do they keep talking when you are tired, busy or trying to rest?",
      "Do they notice when you have stopped listening?",
      "Can they stop when you ask them to?",
      "Do friends or family comment on how much they talk?",
      "Has their talking caused problems at work or socially?",
      "Is it the same when they are sober and calm?",
      "Have there been spells of much faster, non-stop talk with less need for sleep?",
      "Is the talk mostly about one favourite topic, or about anything at all?",
      "Do they seem to try hard to hold back, and does it work?"
    ],
    parent: [
      "Did they talk more than other children of their age?",
      "Did they talk from morning until night?",
      "Were they told off at school for talking?",
      "Did they talk through TV, meals and car journeys?",
      "Did brothers, sisters or friends complain about it?",
      "Could they stop when asked?",
      "Did they talk to strangers a lot?",
      "Did their early speech and language develop as expected?",
      "Was it there before age 12?",
      "Was the talk usually about one special topic, or about anything?",
      "Were there times when they were very quiet? What was happening then?"
    ],
    school: [
      "'Very chatty' or 'talks too much' in reports",
      "Advice to listen more and talk less",
      "Moved seats or separated from friends for talking",
      "Sanctions or detentions for chatting in class",
      "Remarks that their chatter distracts other pupils",
      "Similar comments over several years from different teachers",
      "Good spoken skills noted, but with a need to know when to stop"
    ]
  },
  counts: [
    "Talks more than the situation needs in most conversations, on most days.",
    "Clearly talks more than peers of the same age, culture and role.",
    "Others have commented, complained or shown it, for example by switching off, ending calls or avoiding them.",
    "Shows across settings: home, work or study, social life, and on the phone or in messages.",
    "Finds it hard to stop even after noticing cues or being asked.",
    "Longstanding: similar talking described in childhood, often in school reports.",
    "Score Present when it is kept in check only by heavy effort (staying silent in new groups, notes to keep it short), with the talk returning when relaxed.",
    "Causes problems: meetings, customers, relationships, friendships or appointments.",
    "Present when mood is stable and the person is not under the influence of alcohol or drugs."
  ],
  notCount: [
    "Pressured speech during a mood episode: fast, hard to interrupt, with high or irritable mood and less need for sleep (consider bipolar disorder).",
    "Long, one-sided talk limited to a special interest, with difficulty reading social cues (consider autism, or both conditions).",
    "A talkative personality that the person can rein in easily, without causing problems.",
    "Talking more only when anxious (nervous chatter) or when seeking reassurance.",
    "Talking more only when drinking or after using stimulants or cocaine.",
    "A talkative job (sales, teaching) unless they talk more than colleagues and outside work too.",
    "Family or cultural norms of lively conversation, if they are no more talkative than their group.",
    "Disorganised, hard-to-follow speech with odd ideas (consider psychosis).",
    "New talkativeness after a head injury, or starting in later life (consider frontal change or dementia).",
    "Recent talkativeness in someone isolated and lonely who was not talkative before.",
    "Long-windedness from word-finding difficulty or speaking a second language; ask about talk in their first language.",
    "Talkativeness seen in only one setting."
  ],
  anchors: [
    { score: "yes", quote: "My nickname at work is 'the radio'. Meetings with me overrun, my manager's told me to keep updates to two minutes, and my partner says she can't get a word in. Every school report said I chatted too much.", why: "Score Present: several settings, clear consequences, others comment, and a childhood history in school reports." },
    { score: "yes", quote: "I send voice notes that are ten minutes long and friends say they don't listen to them. On the phone I can go for two hours. I try to stop, but I don't notice the time going.", why: "Score Present: pervasive across different ways of talking, hard to stop, and peers comment. Confirm the childhood history." },
    { score: "yes", quote: "In new groups I stay really quiet, because I know once I start I won't stop. With people I know, I talk the whole time and feel embarrassed afterwards.", why: "Score Present: the pattern is held back only by heavy effort with strangers and shows freely with familiar people; score the underlying pattern." },
    { score: "unsure", quote: "I'm chatty, I suppose, but I'm a teacher. It comes with the job.", why: "Unsure: ask about life outside work, and whether they talk more than other teachers." },
    { score: "unsure", quote: "When I'm nervous I talk too much, like at interviews or first dates.", why: "Unsure, probably No: this sounds anxiety-driven. Ask what happens in relaxed settings with people they know well." },
    { score: "unsure", quote: "People say I go on about trains. I can talk about them for hours, but otherwise I'm fairly quiet.", why: "Unsure, probably No: talk centred on one special interest suggests autism rather than general talkativeness. Ask about other topics and how they read when others want to speak." },
    { score: "no", quote: "I'm more of a listener. I like hearing what other people have to say.", why: "Score No: no evidence of the symptom." },
    { score: "no", quote: "Last month I was talking non-stop, my thoughts were racing and I barely slept for a week. Normally I'm quite quiet.", why: "Do not score for ADHD: episodic pressured speech with little sleep suggests hypomania or mania. Assess mood fully." },
    { score: "no", quote: "I only get chatty after a few pints.", why: "Score No: talkativeness is limited to drinking." }
  ],
  mimics: [
    { ddx: "bip", clue: "Spells of pressured, rapid, hard-to-interrupt speech with high or irritable mood and less need for sleep, unlike their usual self.", ask: "Have there been spells of days when you talked much faster and more than usual, slept less and felt high or irritable?" },
    { ddx: "cyclo", clue: "Talkativeness rises and falls with frequent mood swings over years, rather than staying steady.", ask: "Does how much you talk change a lot with your mood from week to week?" },
    { ddx: "asd", clue: "Long, one-sided talk on particular interests, with difficulty telling when others want to speak or change the subject.", ask: "Is the talk usually about topics you are passionate about? Is it hard to tell when someone wants to speak or move on?" },
    { ddx: "social", clue: "Nervous chatter to fill silences in social situations that feel threatening, but quiet when relaxed.", ask: "Do you talk more when you feel nervous or judged, and less when you are relaxed with people you know?" },
    { ddx: "gad", clue: "Talks at length about worries and seeks repeated reassurance.", ask: "When you talk a lot, is it mostly about worries, or asking others to reassure you?" },
    { ddx: "sud_stim", clue: "Talkativeness linked to cocaine, amphetamines or a lot of caffeine.", ask: "Does your talking change on days when you use stimulants, cocaine or lots of caffeine?" },
    { ddx: "sud_alcohol", clue: "Chatty mainly when drinking, and fairly quiet when sober.", ask: "How much do you talk on days when you have had no alcohol at all?" },
    { ddx: "psychosis", clue: "Speech that is hard to follow, jumps between unconnected ideas, or carries unusual beliefs.", ask: "Do people say they find it hard to follow what you say? Have you had any unusual experiences or beliefs lately?" },
    { ddx: "tbi", clue: "New talkativeness or loss of social filter after a head injury, stroke or brain illness.", ask: "Were you this talkative before the injury or illness, or did people notice a change afterwards?" },
    { ddx: "normal", clue: "A sociable, chatty person who can stop easily when needed and causes no problems.", ask: "When you need to keep things short, can you do it without strain? Has your talking ever caused you trouble?" }
  ],
  special: {
    women: "Girls are more often called 'chatty' than hyperactive, and talking may be the main visible sign of hyperactivity in girls and women. Many learn to hold back in public, so ask what happens with close friends and how much effort it takes.",
    older: "Talkativeness may persist after motor hyperactivity has faded. New talkativeness or disinhibited speech starting in later life suggests another cause, such as frontal lobe change, mania or medication.",
    highIQ: "Highly verbal people may be praised for being articulate, which hides the problem. Look at whether others get a turn, whether meetings overrun, and whether the person can stop when they need to.",
    sud: "Alcohol, cocaine and amphetamines increase talking. Check how talkative the person is when sober and what they were like as a child, before any substance use.",
    asd: "In autism long talk is often one-sided, on a narrow interest, with difficulty reading cues; in ADHD it ranges over many topics and the person often notices afterwards and feels embarrassed. Both can co-occur, and both should be assessed.",
    culture: "Norms for talking, turn-taking and silence differ between cultures and families. Compare with peers from the same background, and consider language: speaking a second language can lengthen speech for reasons that have nothing to do with ADHD."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A2f, paraphrased",
    "ICD-11 CDDR 6A05 (WHO 2024), hyperactivity-impulsivity features (difficulty doing activities quietly; talking too much), paraphrased",
    "ASRS v1.1 item 15 (WHO 2003)",
    "Kooij JJS et al. Updated European consensus statement on adult ADHD. Eur Psychiatry 2019;56:14-34",
    "DIVA 2.0 structure (Kooij and Francken 2010); question and example wording original",
    "CADDRA Canadian ADHD Practice Guidelines 4.1 (2020), differential diagnosis, paraphrased",
    "Clinical practice"
  ]
}]);
