/* hi4: Cannot do leisure activities quietly. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "hi4",
  dim: "HI",
  codes: { dsm5: "A2d", diva: "H/I 4", asrs: [14] },
  title: "Cannot do leisure activities quietly",
  criterion: "Often finds it hard to play, take part in hobbies or spend free time in a calm, quiet way. Free time tends to become loud, noisy or rowdy, even when the activity itself is meant to be quiet.",
  adultForm: "In adults this is less about noisy play and more about volume and the inability to settle into calm downtime. People describe a loud voice they struggle to turn down, humming, singing, whistling or sound effects, clattering objects, and quiet pastimes (reading, a film, a bath, fishing, meditation) that they cannot stay with unless something louder or busier is added. Many say they cannot unwind or relax when they finally have time to themselves (ASRS item 14). DSM-5-TR gives no separate adult illustration for this item, so look for a persistent, trait-like pattern that other people comment on.",
  why: "Weak inhibition of motor and vocal output, combined with a strong need for stimulation: calm, low-arousal activity feels uncomfortable, so the person adds noise or activity to stay engaged. Poor self-monitoring means they often do not notice their own volume until someone tells them.",
  ask: {
    adult: "Over the last six months, when you have had free time, how easy has it been to do something calmly and quietly, like reading, watching a film or just relaxing at home? Can you give me a recent example of what usually happens?",
    child: "Thinking back to primary school, roughly age 5 to 12, what were you like when you were meant to play or do something quietly, like drawing, reading or watching TV? What do you remember, and what did your family or teachers say?",
    parent: "Over the last six months, can your child play or spend free time quietly, for example with Lego, drawing, reading or a film, as well as other children their age, or does it usually become loud and noisy? Can you give me a recent example?",
    teen: "Over the last six months, what are you like when you are meant to do something quietly in your free time, like reading, watching a film or being in a library or quiet room? Do people often ask you to keep the noise down?",
    teacher: "Compared with others in the class, how well does this pupil manage quiet times, such as silent reading, quiet choosing time or wet play? Do they make noises or turn quiet activities into loud ones?"
  },
  rephrase: [
    "When you sit down to relax, how calm and quiet do you manage to stay? Talk me through what usually happens.",
    "What do people say about how loud you are, even when you are just relaxing? Can you give me an example?",
    "What happens when you try a quiet hobby, such as reading, a jigsaw or fishing?",
    "What happens when you watch a film at home with someone else? What would they say you do?",
    "When you finally get some time to yourself, how easy is it to unwind?",
    "What sounds do you make without noticing, such as humming, whistling or singing? Who points them out?",
    "In simple words: when you rest or have fun, are you quiet or noisy? Tell me about the last time.",
    "How do you get on in quiet places, like a library, a waiting room or a quiet train carriage?",
    "Most people get noisy sometimes. How often are you asked to keep it down, compared with your friends or family?",
    "How do you choose what to do in your free time? What puts you off the quieter pastimes?",
    "What tricks do you use to keep yourself quiet in quiet places, and how much effort does that take?",
    "Tell me about a typical evening off. What do you actually do, minute by minute?",
    "If I asked the people you live with what you are like on a quiet evening in, what would they tell me?",
    "What have family, housemates or neighbours said about the noise you make at home?"
  ],
  examples: {
    adult: [
      { ctx: "leisure", label: "Leisure and hobbies", items: [
        "Cannot read a book for long without putting music or the TV on",
        "Chats or makes comments through films, plays or talks where others expect silence",
        "Sings along loudly to every song, even in shared spaces",
        "Turns a calm card game or board game into a loud, rowdy event",
        "Picks noisy, fast activities over quiet ones almost every time",
        "Gets shushed in the cinema or theatre for laughing or reacting loudly",
        "Turns a quiet picnic or country walk into a loud, boisterous outing",
        "Scares off the fish or birds with noise when fishing or birdwatching with others",
        "Walked out of yoga, meditation or mindfulness classes because the silence was unbearable",
        "Has been asked to quieten down in a library, museum or gallery",
        "Clatters tools and materials noisily while doing a craft or hobby",
        "Cheers or shouts at matches so loudly that people nearby move away",
        "Avoids book clubs, recitals and other quiet pastimes after being embarrassed there"
      ] },
      { ctx: "home", label: "Home and household", items: [
        "Housemates or family complain about the noise they make at home",
        "Slams doors, cupboards and drawers without meaning to",
        "Hums, whistles or sings while doing almost every job around the house",
        "Cannot have a quiet evening in; the TV, music and chatter all run at once",
        "Neighbours have complained about noise late in the evening",
        "Plays music loudly while others in the house want peace",
        "Bangs pans and crockery while cooking or tidying, startling others",
        "Moves heavily around the house; others always hear them coming",
        "Has the TV volume much higher than others in the house want",
        "Cannot sit quietly in the garden; ends up with music or a loud phone call",
        "Wakes the household when coming in late because of the noise"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Partner asks them to lower their voice several times a day",
        "Partner cannot read or watch TV in the same room because of the noise",
        "Partner feels shouted at during ordinary chats, though no anger is meant",
        "Family call them 'the loud one' at gatherings",
        "Partner wears earplugs or headphones to get some peace at home",
        "Hums or sings in bed while their partner is trying to fall asleep",
        "Relatives say a calm family meal is impossible when they are there",
        "Partner goes to another room to get some quiet when they come in"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "Winds the children up at bedtime instead of settling them quietly",
        "Struggles to read a bedtime story in a soft, calm voice",
        "Co-parent tells them off for making playtime too loud and wild",
        "Wakes a napping baby because they cannot keep the house quiet",
        "Finds it hard to stay quiet at school plays, concerts or assemblies",
        "Children ask them to stop singing or being loud in front of friends",
        "Turns quiet activities with the children, like colouring, into noisy games"
      ] },
      { ctx: "social", label: "Friends and social life", items: [
        "Friends often say 'shh' or 'keep it down' when out together",
        "Laughs much louder than others in restaurants or on public transport",
        "Is the loudest voice at a gathering, even without any alcohol",
        "Quickly becomes brash or over the top when out, then feels embarrassed later",
        "People turn round to look because of their volume in a cafe or pub",
        "Struggles to stay quiet during a wedding service, funeral or speech",
        "Friends stop inviting them to calm occasions such as dinners or recitals",
        "Staff in restaurants, pubs or hotels ask them to keep the noise down",
        "Shouts across a room rather than walking over to speak",
        "Gets rowdy at friends' houses late at night, so hosts worry about the neighbours"
      ] },
      { ctx: "conversation", label: "Conversations and meetings", items: [
        "Speaks louder than everyone else without realising",
        "Finds it physically hard to whisper or keep their voice low when needed",
        "Others regularly ask them to bring their voice down",
        "Voice rises when excited, and they only notice when someone reacts",
        "Has been told they sound aggressive when they are simply loud",
        "Strangers in a cafe or on a train can hear their whole conversation",
        "Is the one heard rustling, humming or muttering in a quiet meeting"
      ] },
      { ctx: "work", label: "Work", items: [
        "Colleagues complain about humming, whistling or singing at the desk",
        "Has been moved to a different desk or room because of noise",
        "The staff room gets noticeably louder when they arrive on a break",
        "Feedback mentions being 'disruptive' or 'loud' in an open-plan office",
        "Keeps being shushed in quiet workplaces such as libraries, labs or shared offices",
        "Takes phone calls so loudly that the whole office can follow them",
        "Chooses noisy workplaces like kitchens, sites or warehouses where volume goes unnoticed"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "Gets told off in silent study areas for the noise they make",
        "Hums or mutters while revising and disturbs others nearby",
        "Plays music aloud in shared halls or study rooms, annoying others",
        "Is the noisy one in group study sessions",
        "Has been warned in an exam hall about humming or making noises"
      ] },
      { ctx: "driving", label: "Driving and travel", items: [
        "Sings or shouts along to loud music on almost every drive",
        "Passengers ask them to turn the music down or stop singing",
        "Gets told off for noise in the quiet carriage of a train",
        "Is loud on buses or planes and gets looks from other passengers",
        "Fills long journeys with noise because sitting quietly feels impossible"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Plays videos or music on speaker in public without headphones",
        "Has the TV, a phone video and music going all at the same time",
        "Shouts or cheers while gaming, disturbing others in the house",
        "Takes calls on speakerphone in shared spaces",
        "Gets muted on video calls because of the background noise they make",
        "Online gaming partners complain they are too loud on the headset",
        "Always has music in their earphones so quiet pastimes feel bearable"
      ] },
      { ctx: "health", label: "Health and appointments", items: [
        "Finds a quiet waiting room hard and ends up chatting loudly or humming",
        "Cannot stay quiet through a massage or relaxation session",
        "Gives up on relaxation, breathing or sleep apps a clinician suggested",
        "Disturbs other patients on a ward with their volume or phone calls"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Feels uneasy in silence and fills it with noise straight away",
        "Finds it very hard to unwind, even at the end of a long day",
        "Cannot enjoy a lazy day; relaxing quietly feels like a chore",
        "Holidays meant for relaxing feel frustrating rather than restful",
        "Only feels relaxed when doing something loud or lively",
        "Does not notice their own volume until someone points it out",
        "Feels ashamed after being told yet again that they were too loud",
        "Has never been able to enjoy calm pastimes the way others seem to",
        "Feels a strong pull to break a peaceful moment with a joke or a noise",
        "Constantly checks own volume in public, which makes social events exhausting"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Hummed, sang or made sound effects during silent reading",
        "Was the noisiest child during quiet time or golden time",
        "Made noises or sang to themselves through assemblies",
        "Was noisy in the library or the reading corner",
        "Made animal noises or funny voices in class for a laugh",
        "Was moved to sit alone because of the noise they made",
        "Lost playtime or golden time for being too loud",
        "Banged desks, chairs or pencil cases during quiet work"
      ] },
      { ctx: "homework", label: "Homework", items: [
        "Could only do homework with the radio or TV turned up",
        "Sang or made noises while doing homework, annoying brothers or sisters",
        "Turned reading practice with a parent into a silly, noisy game",
        "Needed reminders to be quieter during homework time",
        "Read out loud, loudly, when asked to read silently"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Shouted, sang along or made noises all through TV programmes and films",
        "Family often said 'keep it down' or 'use your indoor voice'",
        "Was noisy at mealtimes, banging cutlery or singing",
        "Woke the household early in the morning with noise",
        "Played with toys loudly, full of crashes and explosions",
        "Neighbours complained about the noise they made",
        "Sang or made noises at bedtime long after the lights went out",
        "Car journeys were noisy because of their singing and shouting"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Turned quiet games like colouring or building bricks into loud, rough play",
        "Other children's parents found them too loud at play dates",
        "Played noisily even when playing alone",
        "Board games often ended in shouting and overexcitement",
        "Was the loudest child in the playground or at parties",
        "Quickly got silly and showed off when visitors came or when out in public",
        "Quiet play with friends rarely lasted more than a few minutes",
        "Made engine noises or shouted while playing with cars or figures"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "Was told off at clubs, Brownies, Cubs or Scouts for noise",
        "Could not stay quiet at the cinema, theatre or a concert",
        "Found religious services or other quiet ceremonies very hard",
        "Was loud in restaurants, shops or waiting rooms",
        "Was so noisy at swimming or music lessons that the teacher had to stop the group",
        "Was not invited back to a quiet activity such as a library club",
        "Sang and shouted loudly on the coach during school trips"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "Report said they needed to work on using a quiet voice",
        "Teacher wrote that they were very noisy during calm activities",
        "Parents' evening comments such as 'can be loud and silly'",
        "Described as 'boisterous' by teachers and relatives",
        "Parents were told they disturbed others during quiet time",
        "Nicknamed 'the noisy one' at home",
        "Grandparents said the house was never quiet when they came to stay"
      ] },
      { ctx: "teen", label: "Secondary school and college (12-17)", items: [
        "Got detentions for noise in study periods or the library",
        "Played music loudly from a phone or speaker on buses or at school",
        "Friends' parents said they were too loud in the house",
        "Was moved during tests for making noises",
        "Family or neighbours complained about loud music or gaming late at night",
        "Shouts or talks loudly while gaming online with friends",
        "Cannot watch a film without commenting aloud the whole way through",
        "Is asked to keep the noise down at a part-time job",
        "Turns quiet nights in with friends into loud, rowdy ones"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "On a typical free evening, how often do you manage to do something calm and quiet?",
      "How many times a week does someone ask you to keep the noise down?",
      "Is this most days, or only now and then?",
      "The last time you tried to read or watch a film, how long did you stay quiet and settled?",
      "In the last month, how many quiet activities did you start and then give up on?",
      "Does it happen on good days too, when you are rested and not stressed?"
    ] },
    { k: "severity", label: "How strong", items: [
      "How loud does it get? Have people been upset, embarrassed or annoyed?",
      "Have you ever been asked to leave somewhere, or been reported, because of noise?",
      "Can you get quiet when you really have to, such as at a funeral or while a baby sleeps?",
      "How much effort does it take to keep yourself quiet in a quiet place?",
      "Are there any calm pastimes you can enjoy at all?",
      "When you do relax, how long does it last before you need noise or action?"
    ] },
    { k: "pervasive", label: "In which settings", items: [
      "Does it happen at home, with friends, at work and when out in public?",
      "Are you as loud with strangers as you are with family?",
      "Is there anywhere you are naturally quiet? What is different there?",
      "Does it happen when you are on your own too, for example humming or singing to yourself?",
      "Does it happen on days when you have had no alcohol or anything else?",
      "Is it the same on holiday as it is during a normal week?"
    ] },
    { k: "duration", label: "How long", items: [
      "How long have people been telling you that you are loud?",
      "Has this been the same all through your adult life, or did it start at a certain time?",
      "Has it been there for at least the last six months without a break?",
      "Were there times in your life when you could relax quietly? When were they?",
      "Has it changed with age, having children, jobs or medication?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Compared with friends or family of your age, are you louder or less able to relax quietly?",
      "Who is the noisiest person in your circle? Where do you come?",
      "Do your brothers, sisters or friends get told to be quiet as often as you?",
      "If everyone in your family is loud, are you still louder than them?",
      "Do people from your own background see you as unusually loud?"
    ] },
    { k: "impact", label: "What it costs", items: [
      "Has the noise you make caused rows at home, complaints from neighbours or trouble at work?",
      "Have you missed out on friendships, invitations or chances because people see you as too loud?",
      "Do you feel you never really rest? How does that affect your energy and mood?",
      "Has it caused embarrassment to you or your family in public?",
      "Do you avoid places like libraries, theatres or quiet restaurants because of it?",
      "Does not being able to unwind affect how you feel the next day?"
    ] },
    { k: "compensation", label: "How you cope or hide it", items: [
      "What do you do to stop yourself being too loud?",
      "Do you use headphones, background noise or busy hobbies to get through quiet time?",
      "Have you chosen noisy jobs or hobbies so that it does not stand out?",
      "How tiring is it to keep watching your own volume?",
      "Does someone close to you warn you when you are getting loud?",
      "If you dropped all the tricks for a week, what would happen?"
    ] },
    { k: "onset", label: "When it started", items: [
      "Were you a noisy child? What did your family say about it?",
      "Can you remember being told to be quiet at primary school?",
      "Did your school reports mention noise or being boisterous?",
      "Was it there before age 12, before any alcohol or drugs?",
      "Did anything make you louder later in life, such as a head injury, a mood change or a new medicine?"
    ] }
  ],
  informant: {
    partner: [
      "Are they louder than most people in everyday situations?",
      "How often do you ask them to lower their voice or keep the noise down?",
      "Can they sit quietly with you, for example reading or watching a film?",
      "Do they hum, sing, whistle or make noises without noticing?",
      "Do they seem able to relax on a day off or on holiday?",
      "Have neighbours, friends or colleagues mentioned how loud they are?",
      "Does their noise make it hard for you to rest, read or sleep?",
      "Can they keep quiet when it really matters, such as at a funeral?",
      "Are they just as loud when sober and well, or mainly when drinking?",
      "Have there been spells of days or weeks when they were much louder than usual and slept less?",
      "Do they try to control it, and does that seem to tire them?",
      "Has it caused arguments or embarrassment between you?"
    ],
    parent: [
      "As a young child, could they play quietly on their own for a while?",
      "Were they noisier than their brothers, sisters or cousins?",
      "Could they sit through a TV programme or a story without a lot of noise?",
      "How often did you need to ask them to be quieter?",
      "Did they make sound effects, sing or shout during play?",
      "Were they loud in shops, restaurants, places of worship or on visits?",
      "Did teachers mention noise in class or at quiet times?",
      "Did other parents comment on how loud they were at play dates or parties?",
      "Could they settle at bedtime, or was it usually noisy?",
      "Was this there from early on, before age 12?",
      "Were there times when they were unusually quiet, for example when worried or unwell?"
    ],
    school: [
      "Remarks such as 'very noisy' or 'boisterous' in class",
      "Requests to use a quiet voice or to work quietly",
      "Comments about disturbing others during silent reading or quiet time",
      "Sanctions for noise: lost playtime, moved seat, sent out",
      "Descriptions of overexcitement in assemblies, trips or performances",
      "Notes that quiet tasks such as reading are hard to settle into",
      "Similar comments across several years and from different teachers"
    ],
    teacher: [
      "Struggles with quiet reading time",
      "Hums, sings or makes sound effects while working",
      "Turns quiet play into loud, boisterous play",
      "Often asked to use a quieter voice",
      "Gets overexcited at wet play and golden time",
      "Moved to work alone because of the noise"
    ]
  },
  counts: [
    "Free time is often noisy or unsettled: most weeks and in many leisure situations, not only on special occasions.",
    "The noise or lack of calm is clearly greater than in people of the same age and cultural background.",
    "It shows in more than one setting: home, social life, public places and work or study.",
    "Other people notice and comment (partner, friends, neighbours, colleagues), not only the patient.",
    "Includes adults who cannot unwind or relax in their own time and who replace quiet pastimes with loud or busy ones, as long as concrete examples are given.",
    "It is present when the person is sober, well slept and not in a mood episode.",
    "Score Present if the person stays quiet only with heavy effort or strict strategies (always wearing headphones, avoiding quiet places): rate the costly pattern, not the hidden result.",
    "There is a cost: complaints, conflict, embarrassment, avoiding quiet places, or never feeling rested.",
    "For childhood, count clear accounts of noisy play, loud TV watching and repeated requests to be quiet, ideally backed by a parent or school reports."
  ],
  notCount: [
    "Simple liveliness or an outgoing personality that the person can turn down easily when needed.",
    "Noise only at parties, sports matches or other settings where noise is normal.",
    "Speaking loudly because of hearing loss: ask about hearing and whether others say the TV is too loud.",
    "Loudness and noisy activity only during periods of high mood, less need for sleep and racing thoughts (consider hypomania or mania).",
    "Inability to relax that comes from worry, tension or fear (consider anxiety); in anxiety the person is usually tense and quiet rather than noisy.",
    "Inability to unwind that began with a recent stressful event, burnout or caring role, with no similar history before.",
    "Humming, grunting or other sounds that are urge-driven, repetitive and briefly suppressible (consider vocal tics).",
    "Family or cultural norms of loud speech where the person is no louder than others in that group.",
    "Loudness only when drinking, using drugs or lots of caffeine, or only since a new medicine; ask about sober behaviour and check the timing.",
    "A pattern seen in only one setting, for example only at home with siblings.",
    "A new change in volume or disinhibition starting in mid or later life; this needs a medical or neurological review, not an ADHD score.",
    "Scoring error: talking at length belongs to hi6, a constant busy drive to hi5 and an inner restless feeling to hi3. Score hi4 for noise and for not being able to spend free time quietly and calmly."
  ],
  anchors: [
    { score: "yes", quote: "My partner gave up watching telly with me. I sing, I make comments, I get up and clatter about in the kitchen. Even when I read I need music blasting. My mum says I was exactly the same as a kid.", why: "Score Present: leisure is regularly noisy across different activities, other people notice it, and the pattern goes back to childhood." },
    { score: "yes", quote: "I've been asked to leave the quiet coach twice this year, and at work they put me in the end room because of my humming and my voice. I honestly don't notice I'm doing it.", why: "Score Present: several settings, real consequences, and poor self-monitoring of volume, which is typical of ADHD." },
    { score: "yes", quote: "I can't do a quiet night in. A bath, a book, a film, I last ten minutes and then the music's on and I'm on the phone. Pool holidays drive me mad. It's been like that forever.", why: "Score Present: consistent inability to do calm leisure or unwind, lifelong and more than peers. Check there are no episodes of high mood." },
    { score: "unsure", quote: "I'm loud, but my whole family is loud. At Sunday lunch we all shout over each other.", why: "Unsure: compare within the family and outside it. Ask whether they are louder than their relatives, and what they are like at work or with friends from other backgrounds." },
    { score: "unsure", quote: "I can't relax at the moment. Since the redundancy I just can't switch off, so I keep the radio on all day.", why: "Unsure, probably No: recent onset linked to stress and worry. Ask what free time was like before this, and in childhood." },
    { score: "unsure", quote: "I'm only really loud after a couple of drinks, but I do like having music on all the time.", why: "Unsure: background music alone is not enough, and drink-related loudness does not count. Ask about sober leisure and whether others complain." },
    { score: "no", quote: "I love reading and can lose a whole Sunday in a novel. I'm noisy at the football, but who isn't?", why: "Score No: quiet leisure is easy for them, and noise is limited to a setting where it is normal." },
    { score: "no", quote: "People think I'm the quiet one. I like calm hobbies, gardening and jigsaws mostly.", why: "Score No: no evidence of the symptom." },
    { score: "no", quote: "These last three weeks I've been loud and full of beans, sleeping three hours a night and feeling amazing. Normally I'm pretty calm.", why: "Do not score for ADHD: an episode with elevated mood and less need for sleep points to hypomania. Assess mood and rescore when the person is well." }
  ],
  mimics: [
    { ddx: "bip", clue: "Loudness and noisy activity come in distinct episodes with elevated or irritable mood and little need for sleep.", ask: "Have there been spells of days or weeks when you were much louder and busier than your usual self and needed far less sleep?" },
    { ddx: "sensory", clue: "Speaks loudly because they cannot hear themselves well; may have tinnitus, ear problems or noise exposure at work.", ask: "Do you find it hard to hear people in noisy places, or do others say you have the TV turned up too high?" },
    { ddx: "tics", clue: "Hums, grunts, sniffs or makes sounds driven by an urge that builds up, can be held back briefly and brings relief when released.", ask: "Before you make the noise, do you feel a build-up or urge, and does it ease once the noise is out?" },
    { ddx: "gad", clue: "Cannot relax because of worry and muscle tension, but is usually tense and quiet rather than noisy.", ask: "When you cannot unwind, what is going through your mind? Is it worry about something in particular?" },
    { ddx: "asd", clue: "Difficulty judging volume, unusual voice tone or rhythm, or making sounds for sensory comfort, alongside social communication differences.", ask: "Do certain sounds feel soothing or unbearable to you? Do people comment on the tone or rhythm of your voice as well as the volume?" },
    { ddx: "sud_alcohol", clue: "Loudness and rowdiness happen mainly while drinking, with calm free time when sober.", ask: "What are your evenings like on days when you have had nothing to drink at all?" },
    { ddx: "sud_stim", clue: "Noisy, overactive free time linked to cocaine, amphetamine, or large amounts of caffeine or energy drinks.", ask: "How much caffeine, energy drinks or other drugs do you use, and does the noise change with them?" },
    { ddx: "burnout", clue: "Recent inability to unwind tied to work stress, money worries or caring duties, with no earlier history.", ask: "Before this stressful period started, could you relax quietly in your free time?" },
    { ddx: "normal", clue: "A lively, outgoing person who is no louder than their social group and can turn it down easily on cue.", ask: "When you need to be quiet, for example at a funeral or in a library, can you manage it without much effort?" },
    { ddx: "tbi", clue: "New loudness or loss of social filter after a head injury, stroke or other brain illness.", ask: "Has anyone said your volume or behaviour changed after an injury or illness, or in recent years?" }
  ],
  special: {
    women: "Girls and women are often taught to be quiet, so they may hold back noise in public and report mainly an inability to relax, or loudness only at home. Ask how much effort it takes and what happens when they let go, and look for childhood labels such as 'boisterous' or 'too much'.",
    older: "Overt noisiness often fades with age, leaving mainly an inability to unwind. New loudness or disinhibition starting in later life is not ADHD: think of hearing loss, frontal lobe change, dementia or medication.",
    highIQ: "Able adults may pick loud, high-stimulation hobbies and careers that hide the problem well. Ask about quiet situations they cannot avoid, and how much effort it costs them to stay calm in those.",
    sud: "Alcohol and stimulants make people louder, while alcohol or cannabis may be used to switch off in the evening. Establish what the person is like when sober and what they were like as a child, before any substance use.",
    asd: "Autistic people may have difficulty judging volume or may make sounds for sensory regulation. In ADHD the noise tends to be playful, social and stimulation-seeking; in autism it is more often repetitive, sensory or linked to missing social cues about volume. Both can co-occur.",
    culture: "Norms about acceptable volume vary widely between cultures, families and communities. Compare with peers from the same background, and give more weight to comments from people who share that background.",
    young: "Young children are often noisy at play, so compare with children of the same age and ask about quiet times when other children manage to settle. Girls may hold back in public and be loud only at home or with close friends, so ask both the parent and the teacher. Family and cultural norms about noise differ, so judge against the child's own community."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A2d, paraphrased",
    "ICD-11 CDDR 6A05 (WHO 2024), hyperactivity-impulsivity features, paraphrased",
    "ASRS v1.1 item 14 (WHO 2003)",
    "Kooij JJS et al. Updated European consensus statement on adult ADHD. Eur Psychiatry 2019;56:14-34",
    "DIVA 2.0 structure (Kooij and Francken 2010); question and example wording original",
    "CADDRA Canadian ADHD Practice Guidelines 4.1 (2020), differential diagnosis, paraphrased",
    "Clinical practice",
    "NICE NG87 1.2.2 (under-recognition in girls), 1.3.5 (criteria adjusted for age) and 1.3.6 (children's views)",
    "Parent, young person and teacher questions, teacher comments and young-person notes: clinical practice"
  ]
}]);
