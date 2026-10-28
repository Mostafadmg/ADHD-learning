/* hi7: Blurts out answers, finishes others' sentences. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "hi7",
  dim: "HI",
  codes: { dsm5: "A2g", diva: "H/I 7", asrs: [16] },
  title: "Blurts out answers, finishes others' sentences",
  criterion: "Often answers or responds before a question has been fully asked: blurts out the answer, completes other people's sentences, or cannot wait for their turn to speak in a conversation.",
  adultForm: "In adults this is less about calling out in class and more about conversation: finishing people's sentences, replying before the question ends, talking over the last words of someone's turn and saying things before thinking them through. DSM-5-TR's own examples for this item (completing people's sentences, not waiting for a turn in conversation) already fit adult life, and ICD-11 describes blurting out answers at school or comments at work. Waiting a turn in queues, traffic or games is scored separately under hi8. Many adults have learned to hold back in formal settings, so ask about relaxed settings, close relationships and what holding back costs them.",
  why: "Weak response inhibition: the reply is formed and released before the brake engages, especially when the person is interested, excited or emotionally involved. Limited working memory adds pressure, because a thought that is not voiced at once may be lost, and delay aversion makes waiting for the speaker to finish feel uncomfortable.",
  ask: {
    adult: "Over the last six months, how often have you found yourself answering before someone has finished their question, or finishing other people's sentences for them? Can you give me a recent example?",
    child: "When you were at primary school, between about 5 and 12, did you call out answers before the teacher had finished asking, or jump in before other people had finished speaking? What do you remember, and what did teachers or your parents say about it?",
    parent: "Over the last six months, how often does your child answer before you have finished asking, or jump in before others have finished speaking, compared with other children their age? Can you give me a recent example?",
    teen: "Over the last six months, how often do you answer before someone has finished asking, finish other people's sentences, or say things before thinking them through? Can you give me an example?",
    teacher: "Compared with others in the class, how often does this pupil call out answers before you have finished the question or before being asked? Does it carry on despite rewards or reminders about hands up?"
  },
  rephrase: [
    "How often do you answer before people have finished asking you something? Tell me about the last time.",
    "Tell me about a time you finished someone else's sentence for them. How often does that happen?",
    "What happens when you have something to say and the other person has not stopped talking yet?",
    "When do words come out of your mouth before you have thought about them? Give me an example.",
    "Tell me about something you said quickly and then wished you had waited.",
    "When someone asks you a question, at what point do you start to answer?",
    "Tell me what happens in a conversation when you think you already know what the other person is going to say.",
    "What do the people closest to you say about how you take turns when you talk?",
    "Most people jump in now and then. Does it happen more often for you than for your friends or colleagues, and has it ever caused trouble?",
    "Do you have to work hard to stop yourself jumping in? What do you do to hold back, and what does that cost you?",
    "If you hold your answer back until the other person finishes, what happens to it? Do you lose the thought?",
    "Has anyone ever said to you 'let me finish' or 'wait until I've asked'? Who, and how often?",
    "How would you describe the way you join in when other people are talking? Can you give me an example?",
    "At work or at the doctor's, do you sometimes answer the question you expect rather than the one actually asked?"
  ],
  examples: {
    adult: [
      { ctx: "conversation", label: "Conversations and meetings", items: [
        "Answers a question before the other person has finished asking it",
        "Finishes other people's sentences, often with the wrong ending",
        "Starts replying while the speaker is still mid-sentence",
        "Guesses where a point is going and responds to the guess",
        "Speaks the moment there is a pause, even a pause for breath",
        "Answers the question they expected rather than the one actually asked",
        "Says 'sorry, go on' several times in one conversation",
        "Talks over the last few words of whatever someone says",
        "Supplies the word whenever a speaker hesitates to find it",
        "Jumps in with the punchline before the person telling the joke gets there",
        "Calls out an answer to a question that was meant for someone else",
        "Gives a verdict on a proposal before it has been fully explained",
        "Lets a comment slip out in a meeting that should have stayed private",
        "Replies to half a question, then has to ask what was meant"
      ] },
      { ctx: "work", label: "Work", items: [
        "Answers customers before they have finished describing the problem",
        "Offers the wrong fix because the full query was not heard",
        "Says something tactless to a client and regrets it instantly",
        "Has had appraisal feedback about letting colleagues finish speaking",
        "Answers job interview questions before the interviewer has finished asking",
        "Agrees to take on extra work before hearing what it involves",
        "Says 'yes, got it' before the instructions have ended, then gets them wrong",
        "Quotes a price before the customer has said exactly what they want",
        "Lets confidential information slip because it came out before thinking",
        "Gets complaints from callers for talking over them on the phone",
        "Blurts out a deadline or figure in a meeting, then has to stick to it",
        "Names the solution before the manager has finished setting out the problem"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "Calls out answers in lectures or seminars without being asked",
        "Answers the tutor before they have finished phrasing the question",
        "Is asked in training sessions to give others a chance to answer",
        "Responds to a fellow student's point before they have finished making it",
        "Answers an oral exam or viva question before the examiner reaches the end",
        "Offers answers so fast in group work that others stop contributing",
        "Feels the answer bursting to come out while classmates are still thinking"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Partner complains of rarely being allowed to finish a sentence",
        "Says 'I know, I know' before a partner has finished explaining",
        "Says things in arguments before thinking, then has to take them back",
        "Jumps in with the ending of a partner's stories in front of friends",
        "Blurts out a surprise party or present before the day",
        "Family say they jump in before the question is even out",
        "Agrees or refuses before a partner has finished describing the plan",
        "Arguments escalate because a quick reply lands before the point is made"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "Answers a child's question before the child has finished asking it",
        "Finishes a slow-speaking child's sentences for them",
        "Calls out the homework answer before the child has had a chance to try",
        "Responds to a child's complaint before hearing the whole story",
        "Says something at parents' evening that comes out wrong and embarrasses the child",
        "Answers the teacher's questions at parents' evening that were meant for the child",
        "Children say 'you never let me finish' or 'I wasn't asking you'"
      ] },
      { ctx: "social", label: "Friends and social life", items: [
        "Friends tease them for finishing everyone's sentences",
        "Blurts out how a film or book ends to friends who have not finished it",
        "Says something embarrassing at a gathering before thinking it through",
        "Announces a friend's news before the friend has had the chance",
        "Answers a question put to the whole group before anyone else can",
        "Makes an offhand remark that offends, then lies awake regretting it",
        "Is known among friends as the one who says whatever comes into their head",
        "Says yes or no to an invitation before hearing the details",
        "Gives a stranger directions before they have finished asking the way"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Replies to a message or email before reading it to the end",
        "Posts a comment the moment a thought arrives, then deletes it later",
        "Unmutes on video calls and answers before the question has finished",
        "Sends a sharp reply to a work email and immediately wishes it unsent",
        "Replies to the first of several messages before the rest have arrived",
        "Comments on social media posts before reading the whole post or article",
        "Answers in the call chat while the presenter is still asking the question",
        "Fires off a reply in a group chat before others have had their say"
      ] },
      { ctx: "health", label: "Health and appointments", items: [
        "Answers the doctor's questions before the doctor has finished asking",
        "Says 'no' to a symptom question before hearing which symptom is meant",
        "Gives the pharmacist or nurse an answer and then has to correct it",
        "Starts answering this interview's questions before they are fully read out"
      ] },
      { ctx: "admin", label: "Paperwork and money", items: [
        "Agrees to a deal or price on the phone before hearing the full offer",
        "Says 'yes' to terms read out by a call handler before they finish reading them",
        "Answers a caller's security or survey questions before they are complete",
        "Talks over a police officer or official before they have finished asking"
      ] },
      { ctx: "leisure", label: "Leisure and hobbies", items: [
        "Shouts out answers at a pub quiz before the question has been read",
        "Calls out answers to television quiz shows before the presenter finishes",
        "Gives away answers in a game that were meant for another player",
        "Spoils riddles or puzzles for others by saying the answer at once",
        "Shouts a reply to the coach or referee before they have finished speaking"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Feels the words are out before having decided to say them",
        "Fears a thought will vanish if it is not said straight away",
        "Feels physical pressure to speak while waiting for someone to finish",
        "Plans the reply while the other person is still talking",
        "Replays conversations afterwards, wincing at what slipped out",
        "Feels relief only once the thought has been said aloud",
        "Finds holding in a known answer almost painful",
        "Bites the tongue or lip to stop the words coming out",
        "Holds a pen or sips water to stop speaking too soon",
        "Writes thoughts down in meetings so they can wait to say them",
        "Counts silently before answering, which is tiring to keep up",
        "Stays silent in meetings altogether for fear of blurting",
        "Concentrates so hard on not jumping in that they lose the thread"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Calls out answers without putting a hand up",
        "Answers before the teacher has finished the question",
        "Calls out wrong answers in the rush to be first",
        "Puts a hand up and says the answer aloud at the same time",
        "Says the answer when the class was meant to work it out quietly",
        "Comments aloud on what the teacher is saying",
        "Says silly or rude things in class without meaning to cause trouble",
        "Answers questions the teacher directed at another pupil",
        "Was moved to sit near the teacher because of calling out",
        "Lost golden time, stickers or playtime for calling out",
        "Finishes the teacher's sentence out loud during the lesson",
        "Shouts out what happens next during story time"
      ] },
      { ctx: "homework", label: "Homework", items: [
        "Shouts the answer before the parent has finished reading the question",
        "Says the first answer that comes to mind before the question ends, then changes it",
        "Gets cross when told to listen to the whole question first",
        "Calls out spellings or sums before they have been fully read out"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Finishes brothers' and sisters' sentences, causing arguments",
        "Answers questions put to a brother or sister",
        "Blurts out family matters to visitors or neighbours",
        "Says embarrassing things to relatives in front of guests",
        "Tells someone what their present is before the day",
        "Picks an option before hearing all the choices on offer",
        "Parents were forever saying 'let me finish'",
        "Replies before a parent has finished speaking and gets told off for it"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Shouts out the answer in guessing games before the clue is finished",
        "Tells friends the ending of a film they have not yet seen",
        "Says hurtful things to friends without thinking first",
        "Gives away hiding places during hide and seek",
        "Friends get annoyed when they answer on their behalf",
        "Gives away secrets friends had shared with them"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "Shouts out answers when the club leader asks the group",
        "Answers the coach before the instructions finish, then does the drill wrong",
        "Makes loud remarks during assemblies, services or performances",
        "Comments loudly about strangers in shops or on the bus",
        "Answers the guide's questions on trips before the guide has finished asking"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "Report: 'must remember to put a hand up and wait to be asked'",
        "Report: 'calls out, which stops others having a chance to answer'",
        "Report: 'needs to listen to the whole question before answering'",
        "Report: 'full of ideas but shares them before thinking'",
        "Report: 'can say unkind things without meaning to'",
        "Parent: 'always had to get the first word in'",
        "Parent: 'never could keep a secret or a surprise'"
      ] },
      { ctx: "teen", label: "Secondary school and college (12-17)", items: [
        "Sent out of lessons for shouting out",
        "Detentions for remarks made in class without thinking",
        "Blurted out comments that got laughs and then trouble",
        "Posted comments online that upset friends or got them into trouble",
        "Answered questions in oral exams before hearing them out",
        "Replies in group chats before reading the whole message",
        "Answers customers or managers at work before they finish speaking",
        "Finishes friends' sentences, which annoys them",
        "Jumps in during class discussions before others can speak"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "How many times in a typical day does this happen?",
      "Does it happen most days, or only now and then?",
      "In the last week, can you think of particular times you answered or finished a sentence too early?",
      "Does it happen in most conversations, or only in certain kinds of conversation?",
      "Do people need to say 'let me finish' to you more than once a week?"
    ] },
    { k: "severity", label: "How strong", items: [
      "When it happens, is it a word or two, or do you take over the rest of their sentence?",
      "How hard is it to stop the words once you feel them coming?",
      "Have you said something you could not take back? What happened?",
      "Do you end up answering the wrong question because you did not wait to hear all of it?",
      "Can you stop yourself when it really matters, such as in an interview? What does that take?"
    ] },
    { k: "pervasive", label: "In which settings", items: [
      "Does this happen at work, at home and with friends, or mainly in one place?",
      "Is it the same with people you know well and with strangers?",
      "Does it happen on the phone, on video calls and in messages as well as face to face?",
      "Are there places where you never do it? What is different there?",
      "Does it happen when you are calm, or only when excited, angry or rushed?"
    ] },
    { k: "duration", label: "How long", items: [
      "How long have people commented on this?",
      "Was it there before any current stress, low mood or substance use began?",
      "Has it been present through your adult life, or did it start recently?",
      "Has it been there on most days for at least the last six months?",
      "Were there times in your life when it went away? What was happening then?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Compared with friends and colleagues of your age, do you do this more, less or about the same?",
      "Do others in your family or team get pulled up for this, or is it mainly you?",
      "Have you noticed others waiting for you to finish when you have not waited for them?",
      "Are you the one people describe as always jumping in?",
      "If we asked your partner or a close friend, how would they compare you with other people?"
    ] },
    { k: "impact", label: "What it costs", items: [
      "Has this caused arguments, hurt feelings or lost friendships?",
      "Has it affected interviews, appraisals, exams or customer feedback?",
      "Have you got things wrong because you did not hear the full question?",
      "Do people avoid talking with you, or stop sharing ideas when you are there?",
      "Has it caused trouble with a manager, teacher or official?",
      "How do you feel after a conversation where this has happened?"
    ] },
    { k: "compensation", label: "What you do to hold back", items: [
      "Do you use any tricks to stop yourself answering too soon?",
      "Do you stay quiet in some settings because you worry about blurting?",
      "Do you write notes during meetings so you can wait to speak?",
      "How tiring is it to hold back during a long conversation?",
      "Does holding back make you lose track of what the other person is saying?",
      "Has anyone helped by giving you a signal when you jump in?"
    ] },
    { k: "onset", label: "When it started", items: [
      "Do you remember calling out in class at primary school?",
      "Did school reports mention putting your hand up or waiting to be asked?",
      "What did your parents say about how you joined in conversations at home as a child?",
      "Did you get into trouble for answers or remarks that came out too quickly?",
      "Was it there before age 12, or did it only start later?"
    ] }
  ],
  informant: {
    partner: [
      "Do they finish your sentences, or answer before you have finished asking?",
      "How often do you have to say 'let me finish' to them?",
      "Do they reply to what they think you are going to say rather than what you actually say?",
      "Do they say things in company that come out before they have thought?",
      "Have their quick replies started or worsened arguments between you?",
      "Have you seen them catch themselves and apologise for jumping in?",
      "Do they answer questions that were meant for you or for someone else?",
      "Is it the same with friends, family and strangers, or mainly with you?",
      "Does it happen when they are calm, not only when excited, tired or drinking?",
      "How long have you noticed this? Was it there when you first met?",
      "Compared with other people you know, how much do they do this?"
    ],
    parent: [
      "At primary school, did they call out answers without waiting to be asked?",
      "Did teachers mention putting a hand up or waiting their turn to speak?",
      "Did they answer your questions before you had finished asking them?",
      "Did they blurt out secrets, surprises or embarrassing things in front of others?",
      "Did they finish their brothers' or sisters' sentences, or answer for them?",
      "Did they get into trouble for things they said without thinking?",
      "Did they do this more than other children of the same age?",
      "Was it the same at home, at school, at clubs and with relatives?",
      "Did it carry on even when you reminded or rewarded them?",
      "At what age did you first notice it?",
      "Did it cause problems with friends or with adults outside the family?"
    ],
    school: [
      "Must remember to put a hand up and wait to be asked",
      "Calls out answers, which stops other children having a chance",
      "Often answers before the question is finished, sometimes wrongly",
      "Needs to think before speaking",
      "Enthusiastic contributions, but often called out",
      "Can make remarks that upset others without meaning to",
      "Has been moved seats to reduce calling out"
    ],
    teacher: [
      "Calls out answers despite reminders about hands up",
      "Answers before the question is finished, often wrongly",
      "Says things without thinking that upset others",
      "Comments aloud on what I am saying",
      "Answers questions meant for other pupils",
      "In trouble for calling out more than others"
    ]
  },
  counts: [
    "Answering before questions are finished, finishing other people's sentences or not waiting for a turn to speak happens often: most days, or in many conversations.",
    "It happens clearly more than for most people of the same age, culture and background.",
    "It shows in at least two settings, for example work and home, or friends and family.",
    "It is longstanding: present for at least six months and usually for years, not only since a recent change.",
    "It has a cost: misunderstandings, wrong answers, complaints, hurt feelings, appraisal feedback or people avoiding them.",
    "It happens when the person is calm and sober, not only when angry, anxious, excited, intoxicated or high.",
    "Unfiltered remarks count when they come out before thought, not when chosen on purpose to make a point.",
    "Successful holding back still counts if it needs constant effort or carries a cost such as staying silent, losing the thread or exhaustion.",
    "Collateral reports from a partner, family, colleagues or school reports of being told to wait or let others finish support scoring present."
  ],
  notCount: [
    "Occasional jumping in when excited, rushed or very interested: this is normal variation.",
    "Fast, pressured speech that came with a distinct period of high or irritable mood, less need for sleep and big plans (consider hypomania or bipolar disorder).",
    "Blurting only while intoxicated with alcohol, cocaine or other stimulants, or during withdrawal.",
    "A family or cultural style of overlapping talk that the person can switch off without effort and that causes no problems.",
    "Finishing sentences only to help someone who stammers, has aphasia or is struggling in a second language, at their request.",
    "Answering early because the end of the question was not heard (check hearing, especially in noise or on the phone).",
    "Missing turn-taking cues without any urge to speak early (consider autism; both can co-exist).",
    "Jumping in only with one person they are in conflict with, or only in one setting.",
    "Remarks that are planned, hostile or used to dominate rather than unfiltered (consider personality factors).",
    "Answering quickly only to end an anxious conversation or escape silence, and only with strangers or authority figures (consider social anxiety).",
    "A new loss of social filter that began in middle or later life (consider brain injury, frontotemporal dementia or medication effects).",
    "Scoring error: butting into other people's conversations or activities belongs to hi9, talking at length belongs to hi6, and waiting in queues or for a go in games belongs to hi8."
  ],
  anchors: [
    { score: "yes", quote: "My partner says I've hardly let her finish a sentence in ten years. At work I answer before the client has finished explaining, and twice I've given the wrong fix because of it. My manager put it in my review.", why: "Score Present: frequent, at home and at work, longstanding, with clear costs and collateral support." },
    { score: "yes", quote: "I've learned to stay silent in meetings because if I open my mouth I'll be in before the question's over. I sit there gripping my pen and writing everything down, and then I miss half of what's said.", why: "Score Present: the behaviour is held back only through constant effort with a real cost (silence, missed content). Compensated symptoms count." },
    { score: "yes", quote: "At the GP, at parents' evening, down the pub, it's the same: I'm answering before they've asked. My kids say 'Dad, let me finish'. At school I was always in trouble for shouting out.", why: "Score Present: pervasive, frequent, noticed by others, with a clear childhood history." },
    { score: "unsure", quote: "I do finish people's sentences sometimes, but mainly when they're really slow to get to the point.", why: "Unsure: may be normal impatience. Ask how often, how it compares with others, whether people complain, and whether it happens with people who speak at a normal pace." },
    { score: "unsure", quote: "Since I started the new job I keep blurting things out in meetings. I'm really stressed and I'm not sleeping.", why: "Unsure, leaning towards absent: recent onset tied to stress and poor sleep. Ask about earlier adult life and childhood; score Present only if it clearly predates the stress." },
    { score: "unsure", quote: "When I've had a few drinks I'm terrible for talking over people.", why: "Unsure, leaning towards absent: described only when intoxicated. Ask about sober situations at work and at home before scoring." },
    { score: "no", quote: "My family all talk over each other at dinner, it's just how we are. At work I wait my turn without thinking about it, and nobody's ever complained.", why: "Score Absent: a family conversational style that switches off easily, with no impairment." },
    { score: "no", quote: "I answer quickly in interviews because I prepare really thoroughly and know my material inside out.", why: "Score Absent: speed comes from preparation, not from responding before the question is finished." },
    { score: "no", quote: "Last spring I was talking non-stop and kept talking over everyone. I barely slept for two weeks and spent thousands. The rest of the time I'm quite reserved.", why: "Score Absent for ADHD: an episodic change with little sleep and raised mood suggests hypomania. Explore bipolar disorder." }
  ],
  mimics: [
    { ddx: "bip", clue: "Rapid, pressured speech and talking over people only during distinct periods of high or irritable mood with less need for sleep.", ask: "Has there been a stretch of days when you talked much faster than usual, slept far less and felt unusually high or irritable?" },
    { ddx: "asd", clue: "Turn-taking goes wrong because it is hard to tell when someone has finished, or because of long talks on special interests, rather than an urge that cannot be held back.", ask: "When you come in early, is it because you cannot hold the words back, or because it is hard to tell when the other person has finished?" },
    { ddx: "social", clue: "Rushes answers to end an anxious exchange or fill a silence; worst with strangers or people in authority and absent with close people.", ask: "Is it worst when you feel nervous or judged, and does it settle with people you know well?" },
    { ddx: "sud_stim", clue: "Talking over people mainly while using cocaine, amphetamines or large amounts of caffeine or energy drinks.", ask: "Does this happen when you have taken nothing at all, for example on an ordinary sober morning at work?" },
    { ddx: "sud_alcohol", clue: "Blurting and tactless remarks happen only after drinking.", ask: "What are you like in conversations on days when you have had no alcohol?" },
    { ddx: "tbi", clue: "A new loss of filter or disinhibited remarks after a head injury, stroke or other brain injury.", ask: "Was this there before any head injury or neurological illness, or did people notice a change afterwards?" },
    { ddx: "mci", clue: "Tactless or disinhibited speech starting late in life, with personality change or memory decline (consider frontotemporal dementia).", ask: "When did people first notice this? Were you like this in your twenties and thirties?" },
    { ddx: "sensory", clue: "Answers early or wrongly because the end of the question was not heard; worse in background noise or on the phone.", ask: "Do you often mishear people or ask them to repeat themselves? When was your hearing last checked?" },
    { ddx: "bpd", clue: "Hurtful remarks come in moments of intense anger or fear of rejection in close relationships, not as everyday blurting in calm conversations.", ask: "Does it happen in calm, friendly conversations too, or mainly when you feel hurt, let down or abandoned?" },
    { ddx: "normal", clue: "Enthusiastic or cultural overlapping talk that causes no problems and stops easily when needed.", ask: "If you decide to let people finish, can you do it without strain? Has it ever caused you any trouble?" }
  ],
  special: {
    women: "Women and girls often learn early that blurting is judged harshly and suppress it, so they may describe staying quiet, rehearsing replies or apologising, followed by exhaustion and shame. Ask what holding back costs and how they are in relaxed settings with close friends and family. A talkative girl may have been labelled chatty or bossy rather than impulsive.",
    older: "Older adults often report that they have learned to hold back, so confirm the lifelong pattern with family where possible. A new loss of social filter in later life needs medical assessment before ADHD is considered: think of frontotemporal dementia, stroke, other neurological illness and medication effects.",
    highIQ: "Able people often know the answer early, so a fast reply may be accurate and even valued. Look for cost instead: answering the wrong question, colleagues who stop contributing, feedback about letting others speak, or exhaustion from holding back. Speed alone is not the symptom.",
    sud: "Alcohol, cocaine and other stimulants loosen the filter and speed up speech. Establish whether blurting happens when sober and whether it predates substance use, ideally with a parent's account of childhood.",
    asd: "Autistic people may also talk over others, but usually because it is hard to judge when a turn ends or because of a strong focus on a topic, not because of an urge that cannot be held back. Ask what drives it: an urge to release a thought before it is lost points to ADHD, while uncertainty about conversational rules points to autism. Both can be present.",
    culture: "Norms for overlapping talk differ: in some cultures and families talking over each other shows interest and is not rude. Judge against the person's own cultural and family norms and ask whether it causes problems within their own community. People using a second language may finish sentences to show they have understood or to help the speaker.",
    young: "Calling out is common in the youngest primary classes, so compare with children of the same age and allow for the youngest in the year. Girls may learn to hold back in class and show this mainly at home or with friends, so ask about both settings. Enthusiasm with no wider effect does not count on its own; look for a pattern that causes trouble."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A2g, paraphrased",
    "ICD-11 CDDR 6A05 (WHO 2024), hyperactivity-impulsivity features, paraphrased",
    "Kooij JJS et al. Updated European consensus statement on adult ADHD. Eur Psychiatry 2019;56:14-34",
    "DIVA 2.0 structure (Kooij and Francken 2010); question and example wording original",
    "ASRS v1.1 item 16 (WHO 2003)",
    "Clinical practice",
    "NICE NG87 1.2.2 (under-recognition in girls), 1.3.5 (criteria adjusted for age) and 1.3.6 (children's views)",
    "Parent, young person and teacher questions, teacher comments and young-person notes: clinical practice"
  ]
}]);
