/* ia3: Seems not to listen when spoken to. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "ia3",
  dim: "IA",
  codes: { dsm5: "A1c", diva: "A3", asrs: [9] },
  title: "Seems not to listen when spoken to",
  criterion: "Often seems not to be listening when spoken to directly. The mind appears to be somewhere else, even when nothing obvious is distracting them.",
  adultForm: "In adults this shows as drifting off mid-conversation, nodding along without taking in what is said, and asking people to repeat themselves. Partners, children and colleagues often complain that the person is not really there. DSM-5-TR notes the mind seems elsewhere even without any obvious distraction. Many adults compensate by repeating back, taking notes, watching faces closely or asking for things in writing, which is tiring and can hide the problem.",
  why: "Attention slips from the speaker to the person's own thoughts and is hard to hold on spoken words, so what is said is never properly taken in even though hearing is normal. Weak working memory means the start of a sentence can be lost by its end. Research links this to poor switching-off of the brain's resting (default mode) network during tasks.",
  ask: {
    adult: "Over the last six months, how often has someone spoken to you directly and then realised, or told you, that you were not really taking it in, as if your mind was somewhere else? Can you give me an example?",
    child: "Thinking back to primary school, roughly age 5 to 12, did parents or teachers often have to repeat themselves because you did not seem to hear them, even when they were talking right to you? What happened?"
  },
  rephrase: [
    "Do people say you look miles away when they talk to you?",
    "Do you find you have missed what someone just said, even though you were looking at them?",
    "Do people often have to say things twice before it goes in?",
    "Do your family or friends complain that you do not listen?",
    "When someone talks to you face to face, where does your mind go?",
    "Do you nod along and then realise you have no idea what was said?",
    "In plain words: do people think you are not listening, even when you are trying?",
    "Everyone switches off sometimes. Does it happen to you more than most, even in conversations that matter?",
    "When you are on the phone, how much of the call do you actually take in?",
    "Have you found ways to hide that you lost track, like guessing or giving vague answers?",
    "Tell me about the last time someone said, 'You're not listening.'",
    "If someone tells you something important out loud, how much of it sticks?",
    "Does it happen even when the room is quiet and nothing else is going on?",
    "Do people ever wave a hand in front of your face or say your name to get you back?"
  ],
  examples: {
    adult: [
      { ctx: "conversation", label: "Conversations and meetings", items: [
        "Realises mid-sentence that they have not heard what someone was saying",
        "Says yes or nods without knowing what was asked",
        "Asks people to repeat themselves several times a day",
        "Gives an answer that does not fit the question just asked",
        "Looks straight at the speaker but takes in nothing",
        "Catches only fragments of what is said and guesses the rest",
        "Feels caught out when suddenly asked for their view",
        "Watches lips and faces closely to force themselves to follow",
        "Repeats back what was said to check it has gone in",
        "Replies late, as if the words have only just reached them"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Partner says 'you never listen to me' and it leads to rows",
        "Partner tests them by asking what was just said",
        "Misses important news a partner shared, then asks about it later",
        "Family feel ignored or think they do not care",
        "Partner puts things in writing because spoken requests do not go in",
        "Agrees to plans in conversation without registering what was agreed",
        "Is told they seem far away during meals together",
        "Partner feels lonely because they seem absent while talking"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "Children call them several times before getting a response",
        "Realises at the end of a child's story that none of it went in",
        "Gives a child permission for something without realising what was asked",
        "Misses what a teacher says at pick-up or parents' evening",
        "Children say 'you're not listening' or give up telling them things",
        "Has to ask a child to repeat news they were excited to share"
      ] },
      { ctx: "work", label: "Work", items: [
        "Misses verbal instructions from a manager and has to ask again",
        "Leaves one-to-one meetings unsure what was agreed",
        "Colleagues say they seem away with the fairies when spoken to",
        "Customers have to repeat their order or request",
        "Takes notes in every conversation in case words do not stick",
        "Asks for instructions by email because spoken ones slip away",
        "Gets feedback that they seem disengaged or uninterested",
        "Has been told off for not acting on something said directly to them",
        "Rings clients back to check what they asked for in person",
        "Misses the key point of a spoken handover at shift change"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "A tutor asks them a direct question and it has not registered",
        "Misses spoken details about assessments given at the end of class",
        "Nods through one-to-one feedback but leaves without having taken it in",
        "Group project members repeat decisions because they did not register them",
        "Records tutorials to replay later because the first time does not go in"
      ] },
      { ctx: "social", label: "Friends and social life", items: [
        "Friends say they look glazed over when being told something",
        "Loses track of what a friend is telling them and fakes interest",
        "Asks a question a friend has just answered",
        "Misses people's names straight after being introduced",
        "Friends tease them about being in their own world",
        "Friends stop sharing things because they feel unheard",
        "Comes away from a catch-up unable to say what a friend's news was",
        "Has to ask teammates to repeat what was just said to them"
      ] },
      { ctx: "health", label: "Health and appointments", items: [
        "Leaves appointments unsure what the doctor or nurse said",
        "Needs written information because spoken advice does not go in",
        "Brings someone along to listen at medical appointments",
        "Takes in little of a pharmacist's explanation about a new medicine",
        "Answers a clinician's question with something unrelated",
        "Asks a receptionist to repeat the same information several times",
        "Misses spoken instructions from a fitness instructor or physio"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Says 'sorry, what?' over and over on phone calls",
        "Is caught out on video calls when their name is said",
        "Prefers messages to calls because spoken words slip past",
        "Plays voice notes several times before taking them in",
        "Makes listening noises on calls while the mind is elsewhere"
      ] },
      { ctx: "home", label: "Home and household", items: [
        "Is told something while in the kitchen and later has no idea it was said",
        "Housemates leave notes because telling them does not work",
        "Misses requests made face to face, such as to move the car",
        "Neighbours or visitors have to repeat what they came to say",
        "Family ask 'did you hear me?' many times a day",
        "Gets visitors' requests wrong, such as the drink they asked for"
      ] },
      { ctx: "driving", label: "Driving and travel", items: [
        "Misses directions given by a stranger when asking the way",
        "Asks a passenger to repeat directions several times",
        "Misses what a mechanic explained about their car",
        "Misses what ticket or gate staff tell them directly",
        "Misses a tour guide's answer to their own question"
      ] },
      { ctx: "admin", label: "Paperwork and money", items: [
        "Comes off calls with the bank or council unsure what was decided",
        "Misses key points when an adviser explains a contract or benefit out loud",
        "Asks staff to write down what they just explained at a counter",
        "Agrees to terms on a sales call without taking in what was said"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Mind slides off to their own thoughts while someone is speaking",
        "Feels they tune out without choosing to",
        "Hears the sound of the words but the meaning slips past",
        "Feels embarrassed and pretends to have followed",
        "Works hard to look attentive and finds conversations draining",
        "Notices they were elsewhere only when the other person stops talking",
        "Feels anxious in conversations about being caught out",
        "Daydreams vividly even in face-to-face conversations",
        "Feels guilty that loved ones feel unheard"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Does not respond when the teacher says their name",
        "Looks at the teacher but cannot say what was just explained",
        "Needs the task explained again individually after the class is told",
        "Starts the wrong activity because the instruction did not go in",
        "Seems to be in a world of their own in class",
        "Asks what they have to do straight after the explanation",
        "Responds only when the teacher stands right next to them",
        "Gazes out of the window while being spoken to",
        "Copies what other children do because the instruction did not go in"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Parents call their name several times before they respond",
        "Looks up blankly when a parent finishes asking them something",
        "Does not answer when spoken to across the dinner table",
        "Says 'what?' to almost everything said to them",
        "Parents touch their arm or crouch in front of them to be heard",
        "Agrees to do something but clearly did not hear what",
        "Had a hearing test because adults thought they could not hear",
        "Does not hear their name called for meals, even in a quiet house"
      ] },
      { ctx: "homework", label: "Homework", items: [
        "A parent explains a method and none of it goes in",
        "Needs each step explained again as they go",
        "Looks blank when asked what the teacher said about the homework",
        "Parent has to sit face to face to get through to them"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Does not hear friends calling them in the playground",
        "Misses the rules when friends explain a new game",
        "Friends say they are daydreaming and do not answer",
        "Answers questions with something unrelated",
        "Friends get cross that they have to say things twice",
        "Misses being told it is their turn in a game"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "Misses the coach's instructions before a drill",
        "Swims the wrong stroke after the instructor has explained",
        "Instructors have to call their name again and again",
        "Misses what a group leader told them about where to meet",
        "Stands still in a game, lost in thought, when spoken to",
        "Club leaders say they drift off when spoken to"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "Report says they daydream in class",
        "Teacher describes them as often in a world of their own",
        "Report says instructions need repeating",
        "Report says listening skills need to improve",
        "Teacher says they seem not to hear when spoken to",
        "Teacher asked parents to have their hearing checked",
        "Parents told they are 'quiet but switched off'",
        "Report says they need to hear their name before starting work"
      ] },
      { ctx: "teen", label: "Secondary school (12-16)", items: [
        "Teachers accuse them of ignoring them",
        "Parents say talking to them is like talking to a wall",
        "Misses information given to them directly at the end of lessons",
        "Loses track in one-to-one chats with friends",
        "Gets into trouble for not doing what they were directly told",
        "Teachers comment that they seem miles away when spoken to"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "How many times a day does someone have to repeat something to you?",
      "How often do people say you are not listening?",
      "In a typical conversation, how often do you notice you have drifted off?",
      "Does it happen most days, or only now and then?",
      "When was the last time? What happened?"
    ] },
    { k: "severity", label: "How serious", items: [
      "Have you missed something important that was said directly to you?",
      "Has it caused serious arguments or hurt someone close to you?",
      "Have you been in trouble at work for not acting on spoken instructions?",
      "How much of a one-to-one conversation do you usually take in?",
      "Has it ever caused a safety problem, for example missing a warning?"
    ] },
    { k: "pervasive", label: "Where it happens", items: [
      "Does this happen at home, at work and with friends?",
      "Is it the same when the topic interests you?",
      "Does it happen in a quiet room with nothing else going on?",
      "Is it different face to face, on the phone and on video calls?",
      "Does it happen with people you are close to as well as with strangers?",
      "Is it the same in your first language as in any other language you speak?"
    ] },
    { k: "duration", label: "How long", items: [
      "How long have people said this about you?",
      "Were you told this as a child?",
      "Has it been there for most of the last six months?",
      "Did it start or get worse after a particular event, illness or new medicine?",
      "Does it come and go, or is it always there?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Do other people seem to take in conversations more easily than you?",
      "Were you the one teachers had to call more than other children?",
      "Do friends recall what was said better than you do?",
      "Has anyone compared you with others in the family for this?",
      "Do colleagues seem to catch spoken instructions first time when you do not?"
    ] },
    { k: "impact", label: "What it costs", items: [
      "How does this affect your relationship with your partner or family?",
      "Has it affected your work, for example missed instructions or poor feedback?",
      "Do people think you do not care, or that you are rude?",
      "Do you avoid conversations or phone calls because of it?",
      "How does it make you feel about yourself?",
      "Have you missed health advice or important information because of it?"
    ] },
    { k: "compensation", label: "How you cope", items: [
      "What do you do to make sure you catch what people say?",
      "Do you ask people to put things in writing?",
      "Do you repeat things back or take notes?",
      "Do you pretend to have understood, then find out later you had not?",
      "How tiring is it to keep your attention on someone talking?",
      "What happens on days when you cannot use these strategies?"
    ] },
    { k: "onset", label: "When it started", items: [
      "At primary school, did teachers often have to say your name several times?",
      "Did your parents say you were in a world of your own?",
      "Did anyone test your hearing because you did not seem to hear? What did it show?",
      "Were there school reports about daydreaming or listening?",
      "Was this noticeable before you were 12?"
    ] }
  ],
  informant: {
    partner: [
      "When you talk to them directly, do they often seem to be somewhere else?",
      "How often do you have to repeat yourself?",
      "Do they agree to things and later have no idea you asked?",
      "Do you find yourself checking with 'what did I just say?'",
      "Does this happen even when there is no TV, phone or other distraction?",
      "Is it the same when you talk about things that matter to you both?",
      "Do they seem to hear you, but the meaning does not get through?",
      "Has this caused arguments or made you feel ignored?",
      "Do you put important things in writing because talking does not work?",
      "Is their hearing fine, as far as you know?",
      "Have they been like this for as long as you have known them?"
    ],
    parent: [
      "As a child, did you have to call their name several times before they answered?",
      "Did they seem to be in a world of their own?",
      "Did you have to get in front of them or touch them to get their attention?",
      "Did teachers say they did not listen or needed things repeated?",
      "Did anyone suggest a hearing test, and what did it show?",
      "Did they often say 'what?' when spoken to?",
      "Did they miss instructions at clubs or sport?",
      "Was it more marked than in their brothers, sisters or friends?",
      "Was it there before they were 12?",
      "Did it happen even when the TV was off and nothing else was going on?",
      "Did they ever have brief staring spells where they switched off for a few seconds and then carried on?"
    ],
    school: [
      "Daydreams in class",
      "Needs instructions repeated",
      "Seems not to hear when spoken to",
      "In a world of their own",
      "Listening skills need work",
      "Does not respond to their name",
      "Often looks blank when asked"
    ]
  },
  counts: [
    "It happens when spoken to directly, face to face or one to one, not only in large groups or noisy places.",
    "The mind is elsewhere even without obvious distraction: no screen, no noise, nothing else going on.",
    "It happens often: most days, with several different people, more than in peers.",
    "Other people notice it (partner, family, colleagues, teachers), not only the patient.",
    "It is seen in more than one setting, such as home and work, or family and friends.",
    "It is long-standing, with childhood accounts of daydreaming or needing to be called repeatedly.",
    "It causes problems: missed information, arguments, people feeling ignored, mistakes at work.",
    "Hearing has been checked, or there is no reason to suspect hearing loss.",
    "Score present if they rely heavily on compensation (notes, written requests, repeating back) to keep up."
  ],
  notCount: [
    "Hearing loss explains it; check hearing if there is any doubt.",
    "Brief, abrupt staring spells with no awareness and sudden return suggest absence seizures, not this symptom.",
    "Only when absorbed in a screen, a book or a game: that is absorption, which is common and not this symptom.",
    "Only in noisy places, groups or with background distraction (consider ia8 or a hearing problem).",
    "Only when worried, low or preoccupied by a current stress.",
    "Only with one person or one topic, or reflects relationship conflict where the person chooses not to engage.",
    "Due to language: speaking in a second language, or difficulty understanding spoken language.",
    "Switching off or feeling detached when stressed or reminded of trauma (consider dissociation in PTSD) rather than everyday drifting.",
    "Due to sleepiness, intoxication or a medicine.",
    "Hearing but deliberately ignoring (oppositional refusal) does not count.",
    "Autistic differences in eye contact or social back-and-forth with intact listening do not count.",
    "Do not count attention fading through long lectures or meetings (ia2) or forgetting things later (ia9) here."
  ],
  anchors: [
    { score: "yes", quote: "My partner says I'm not there half the time. She tells me something across the table, I nod, and an hour later I've no idea. It's the same at work, and my mum says teachers were always calling my name.", why: "Present. Face to face, frequent, noticed by others, across settings and from childhood." },
    { score: "yes", quote: "I have to ask people to say things again all day. My hearing's been tested twice and it's fine. I just drift off into my own head, even when it's someone I love talking.", why: "Present. Hearing excluded, mind elsewhere, frequent, and it affects close relationships." },
    { score: "yes", quote: "I take notes in every conversation at work, even quick ones, and I ask everyone to email me. If I don't, I miss half of what was said.", why: "Present. Heavy compensation hides the symptom. Ask what happens without notes and what others notice." },
    { score: "unsure", quote: "People say I don't listen, but I think they just talk too much.", why: "Unsure. Ask for specific examples, whether it happens with interesting topics and people they value, and get collateral." },
    { score: "unsure", quote: "I zone out when people talk, but mostly when I'm stressed or someone's raising their voice.", why: "Unsure. Could be dissociation or anxiety. Ask about calm periods, childhood and any trauma history." },
    { score: "unsure", quote: "My kids say I never listen, but I'm usually on my phone when they talk to me.", why: "Unsure. Screen absorption is a confounder. Ask about times without a phone, at work and with other adults." },
    { score: "no", quote: "I don't always catch what people say in the pub because it's loud, but one to one I'm fine.", why: "Absent. Only in noise; consider a hearing check. This is not the symptom." },
    { score: "no", quote: "I switch off when my brother goes on about football, but who doesn't?", why: "Absent. Topic-specific lack of interest is normal variation." },
    { score: "no", quote: "Sometimes I just stare for a few seconds and then come round, and I don't know what happened in between.", why: "Do not score as an ADHD symptom. Brief, abrupt blank spells suggest absence seizures; arrange neurological assessment." }
  ],
  mimics: [
    { ddx: "sensory", clue: "Mishears words, turns the volume up, struggles more with background noise, and relies on lip-reading.", ask: "Have you had your hearing tested? Do you hear well on the phone and in noisy places?" },
    { ddx: "epilepsy", clue: "Brief, abrupt blank spells lasting seconds, with sudden return and no memory of them, sometimes with eyelid flickering, possibly many times a day.", ask: "Has anyone noticed you suddenly stop and stare, then carry on as if nothing happened?" },
    { ddx: "asd", clue: "The difficulty is with back-and-forth conversation, eye contact or reading social cues rather than drifting; the person may be listening while not looking.", ask: "When you are not looking at someone, are you still taking in what they say? What makes conversations hard for you?" },
    { ddx: "dep", clue: "Preoccupied with negative thoughts and withdrawn, with a clear change from how they used to engage.", ask: "When people talk to you and you miss it, where is your mind? Is it on sad or heavy thoughts?" },
    { ddx: "ptsd", clue: "Zoning out, feeling unreal or losing time when stressed or reminded of past events.", ask: "Do you ever feel detached from yourself or your surroundings, or lose time, especially when something reminds you of the past?" },
    { ddx: "social", clue: "So busy monitoring how they come across, or planning what to say, that they lose what is said.", ask: "During conversations, are you focused on how you look or what to say next?" },
    { ddx: "psychosis", clue: "Preoccupied with internal experiences, responding to things others cannot hear or see, or with unusual beliefs.", ask: "When your mind is elsewhere, are you hearing or seeing things other people do not, or busy with thoughts that feel put there?" },
    { ddx: "sud_cannabis", clue: "Spaced out, slowed and detached around periods of regular use.", ask: "Did people say you seemed elsewhere before you started using, or in times when you stopped?" },
    { ddx: "mci", clue: "New difficulty following conversations in later life, worsening over time, often with memory or word-finding problems.", ask: "Is this new for you in the last few years? Has it been getting steadily worse?" },
    { ddx: "normal", clue: "Switches off only with dull talkers, unwelcome topics or while absorbed in a screen, and listens well otherwise.", ask: "Does it happen when the topic interests you and nothing else is going on?" }
  ],
  special: {
    women: "Girls and women with ADHD often present as quiet daydreamers rather than disruptive, so being away with the fairies may have been put down to personality. They may mask by nodding, smiling and over-preparing, which is exhausting and can be mistaken for anxiety.",
    older: "Check hearing first in older adults, as age-related hearing loss is common and looks like not listening. New difficulty following conversations in later life should prompt screening for cognitive decline and depression.",
    highIQ: "Able people often fill gaps from context and guess well, so the symptom may stay hidden until a partner or manager complains. Ask what happens when guessing is not possible, such as detailed spoken instructions.",
    sud: "Cannabis, alcohol, benzodiazepines and opioids can make people seem spaced out and detached. Check whether others noticed the person not being there in childhood and during sober periods.",
    asd: "Autistic people may not look at the speaker yet be listening, or may process speech more slowly and miss social cues. In ADHD the mind drifts to unrelated thoughts, so ask what was going on in their head when they missed what was said.",
    culture: "Norms about eye contact and responding differ between cultures; looking away may be a sign of respect, not inattention. Assess in the patient's preferred language, with a professional interpreter if needed, because listening in a second language increases missed information."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A1c, paraphrased",
    "ICD-11 CDDR 6A05 (WHO 2024), inattention features, paraphrased",
    "Kooij JJS et al. European consensus on adult ADHD, Eur Psychiatry 2019",
    "DIVA 2.0 structure (Kooij and Francken 2010)",
    "ASRS v1.1 item 9 (WHO; Kessler et al. 2005)",
    "Examples, probes and anchors: clinical practice"
  ]
}]);
