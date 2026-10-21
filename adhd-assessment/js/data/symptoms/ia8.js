/* ia8: Easily distracted. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "ia8",
  dim: "IA",
  codes: { dsm5: "A1h", diva: "A8", asrs: [11] },
  title: "Easily distracted",
  criterion: "Is often pulled off task by things going on around them, such as sounds, movement, other people talking or alerts. In older teenagers and adults this includes being pulled away by thoughts that have nothing to do with the task. Attention is captured and getting back to the task is hard, much more than for others of the same age.",
  adultForm: "Adults describe being unable to tune out background noise, nearby conversations, movement or phone alerts, and struggling to get going again once interrupted. DSM-5-TR notes that for older adolescents and adults the distractor can be unrelated thoughts, so a stream of off-topic ideas that keeps taking them away from the task also counts. Many cope with headphones, quiet rooms, focus apps or working late at night, and open-plan offices, busy homes and screens make it worse.",
  why: "Weak inhibitory control and poor filtering of irrelevant input let new stimuli capture attention, and working memory does not hold the task goal firmly enough to steer back to it. Strong pull towards novelty and reward adds to this, so a fresh sound, sight or idea easily wins over the current task.",
  ask: {
    adult: "Over the last six months, how often have things going on around you, like noises, people, your phone, or thoughts that pop into your head, pulled you away from what you were doing? Can you give me a recent example?",
    child: "When you were at primary school, how easily were you pulled off your work by things around you, like sounds in the corridor, children talking, or something happening outside? What happened to your work then?"
  },
  rephrase: [
    "What tends to pull your attention away when you are trying to do something?",
    "If someone walks past or a phone buzzes, how easy is it to carry on with what you were doing?",
    "Plain words: what small things around you stop you doing your work?",
    "Which sounds, people or things grab your attention even when you want to ignore them?",
    "When you get interrupted, how long does it take to get going again, if you do at all?",
    "What happens when a new thought pops into your head while you are in the middle of something?",
    "What do you need around you to get something done, and what happens when you cannot have it?",
    "Everyone gets sidetracked sometimes. What makes you think yours is more than usual?",
    "For someone using English as a second language: There is noise, or people are near you. What happens to your work? Tell me about one time.",
    "Tell me about the last time you sat down to do one thing and ended up doing something else because something caught your attention.",
    "How do you set up your workspace or your day to cut out interruptions? How much effort does that take?",
    "When you're out somewhere busy, like a café or shopping centre, what happens to your focus?",
    "Informal: when there's a noise, a flicker or a ping nearby, what happens to whatever you were doing?"
  ],
  examples: {
    adult: [
      { ctx: "work", label: "Work", items: [
        "Looks up every time someone walks past the desk",
        "Cannot work in an open-plan office without noise-cancelling headphones",
        "Stops mid-task to listen in to colleagues chatting nearby",
        "Loses track of a calculation when a phone rings",
        "Stocking shelves, keeps stopping to watch what is happening at the tills",
        "Takes much longer than colleagues to finish tasks in a busy room",
        "Books empty meeting rooms or stays late just to get quiet time",
        "An email alert pulls them out of a report they were halfway through",
        "Background radio or machinery on site keeps breaking their focus",
        "After an interruption, has to start a task again from the beginning",
        "Working from home, gets drawn away by the washing, the post or the doorbell",
        "Asks to sit facing a wall to cut down what they can see"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "In lectures, notices every cough, rustle and person coming in late",
        "Leaves the library because other people moving about keeps breaking focus",
        "Cannot revise with anyone else in the room",
        "In exams, is pulled away by the clock, footsteps or someone sniffing",
        "Stops taking notes to watch what is going on outside",
        "Online lectures lose out to chat windows, tabs and messages",
        "Has needed a separate exam room because of distractions",
        "Studies late at night because daytime noise makes it impossible"
      ] },
      { ctx: "home", label: "Home and household", items: [
        "Starts tidying one room, spots something in another and drifts there",
        "Cannot follow a TV programme when others in the room are chatting",
        "Hears every sound from neighbours, traffic or the street and stops to listen",
        "Background TV or radio makes it impossible to read a letter properly",
        "Goes to the window at every car or person passing",
        "Burns food on the hob after something else catches their eye",
        "Cannot follow a recipe while children play nearby",
        "Ticking clocks or a humming fridge keep breaking their concentration",
        "Waits until the house is empty to do anything that needs concentration"
      ] },
      { ctx: "conversation", label: "Conversations and meetings", items: [
        "In a café, watches the TV screen or people behind the person they are talking to",
        "Loses what a friend is saying when a nearby table laughs",
        "In meetings, attention goes to someone's phone, a noise outside or the projector",
        "At parties, keeps tuning in to other people's conversations instead of their own",
        "On phone calls, gets caught up in what is happening in the room",
        "Breaks off their own sentence to comment on something they have just noticed",
        "In video calls, watches other windows or their own image instead of the speaker",
        "Asks people to repeat themselves because something else caught their eye",
        "Chooses quiet restaurants or corners to be able to keep up"
      ] },
      { ctx: "driving", label: "Driving and travel", items: [
        "Glances at billboards, shop windows or roadside incidents while driving",
        "Misses a junction or turning because something caught their eye",
        "Turns the radio off and asks passengers to stop talking to concentrate",
        "Has had near misses after looking at something by the road",
        "A message lighting up the screen takes attention off the road",
        "Misses their stop on the bus or train because they were watching something",
        "In stations or airports, gets sidetracked by shops and screens and nearly misses connections",
        "In town, notices shop signs and people but misses the lights changing"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Picks up the phone to check one thing and gets drawn into apps",
        "Every notification pulls them away, so all alerts are now switched off",
        "Has dozens of browser tabs open, each opened while doing something else",
        "Starts a work email, sees a news headline and clicks it",
        "Gets drawn in by adverts, pop-ups and suggested videos",
        "Uses app blockers, focus modes or a timed lock box for the phone",
        "Searching online for one thing ends up on unrelated pages",
        "Group chat messages derail tasks many times an hour"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Partner feels ignored when a noise or screen grabs their attention mid-talk",
        "Family say they turn round at every sound when out together",
        "Partner switches off the TV before raising anything important",
        "Arguments start when their attention drifts to the phone during meals",
        "Struggles at family gatherings where several conversations run at once",
        "Loses the thread of a serious talk when a child or pet comes into the room"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "While helping with homework, attention is caught by other children or the TV",
        "Briefly loses sight of a child at the park after something else grabs their attention",
        "Stops a bedtime story at every noise from elsewhere in the house",
        "Cannot finish filling in a school form in a noisy house",
        "Children's chatter and the TV together make them lose their train of thought",
        "At school events, watches everything going on and misses their own child's moment"
      ] },
      { ctx: "leisure", label: "Leisure and hobbies", items: [
        "At the cinema, notices people moving, phones lighting up and rustling",
        "Reading in the garden, looks up at every bird and passer-by",
        "In sport, loses focus when the crowd or other players make noise",
        "Cannot play cards or a board game with a TV on nearby",
        "Music practice breaks off whenever someone comes into the room",
        "Fiddly hobbies, like model-making, are only possible late at night alone",
        "On group walks, keeps stopping to look at things and falls behind"
      ] },
      { ctx: "admin", label: "Paperwork and money", items: [
        "Loses their place in a form when someone speaks to them",
        "Abandons online banking halfway through after a pop-up appears",
        "Makes mistakes with figures when there is background noise",
        "Reading a contract or official letter, glances at each new message and misses key points",
        "Calls to the bank or council go wrong because of things happening in the room",
        "Goes and sits in the car to make important phone calls in peace"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Unrelated thoughts barge in and take over, such as a song, plan or idea",
        "Suddenly thinks of something to look up and leaves the task to do it",
        "While reading, starts thinking about something seen earlier in the day",
        "Feels every sound in the room is as loud as the one they need to hear",
        "Describes the mind as a TV with many channels on at once",
        "A word or a passing sight sets off a chain of thoughts far from the task",
        "Feels drained after a day in a busy place from the effort of staying on track",
        "Gets irritable when interrupted because getting back takes so long",
        "A fresh idea feels more urgent than the task in front of them",
        "Loses the thread of their own thinking when anything changes around them"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Watches anything moving in the playground through the window",
        "Turns round at every sound from the corridor",
        "Watches what other children are doing instead of their own work",
        "Stops writing when someone sharpens a pencil or drops something",
        "Gets drawn into chatter at the next table",
        "Gets caught up looking at wall displays or things on the teacher's desk",
        "Stops working at the smallest noise, like a fly buzzing or a radiator ticking",
        "Loses their place in class reading after any interruption",
        "A visitor at the classroom door means the rest of the lesson is lost",
        "Stops listening to the teacher whenever the class next door is noisy",
        "In assembly, watches other classes rather than the person speaking",
        "Work done in a quiet room is much better than work done in class"
      ] },
      { ctx: "homework", label: "Homework", items: [
        "Cannot do homework at the kitchen table with the family around",
        "Gets up to see who is at the door and does not come back to homework",
        "Homework takes all evening because every noise in the house pulls them away",
        "Needs a parent to keep pointing them back to the page after each distraction",
        "Reading practice stops at every sound outside",
        "Does homework best in a bare room with nothing on the walls",
        "Siblings' games pull them away from their spellings"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Sent to get dressed and found playing with a toy they spotted on the way",
        "Meals take ages because they watch everything happening in the room",
        "Stops brushing teeth to look at something out of the window",
        "Cannot follow a story on TV if others are talking",
        "Jumps up whenever the doorbell or phone rings",
        "Tidying stops as soon as they come across a game or toy",
        "Parents had to switch off the TV to get anything done",
        "Wanders off in shops after spotting something interesting"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "In team games, watches other things instead of the ball",
        "Leaves one game to join another going on nearby",
        "Loses track of a board game when something else happens in the room",
        "Builds part of a model then drifts to something that caught their eye",
        "Starts a game of chase, then runs off to look at a dog by the fence",
        "Wanders off mid-game to look at something, leaving friends cross"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "At swimming or football, watches other groups instead of the coach",
        "On school trips, falls behind because they stop to look at things",
        "In music or dance lessons, is pulled away by others in the room",
        "Misses their turn because they were watching something else",
        "At the cinema or theatre, looks round at the audience",
        "At scouts, guides or similar groups, misses instructions while watching another group",
        "Playing in a match, turns to watch the crowd or a nearby game"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "Report says they lose focus whenever there is something else to look at",
        "Teacher wrote that they are distracted by others around them",
        "Teacher moved them to sit near the front or away from friends",
        "Parents remember comments that they notice everything except the work",
        "Report says they work well one-to-one but struggle in a busy class",
        "Teacher used a desk screen or quiet corner for them",
        "Parents' evening comments about being off task when others talk",
        "Report says they would achieve more if they could block out what goes on nearby"
      ] },
      { ctx: "teen", label: "Secondary school (12-16)", items: [
        "Phone and social media pulled them away from schoolwork",
        "Could only revise in total silence or late at night",
        "Classmates' chatter in large classes kept breaking their focus",
        "Sat at the back watching everything instead of the board"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "In an hour of work, how many times does something pull you off task?",
      "Is it most days, or only some days?",
      "When you sit down to do something that needs concentration, how long before something takes you away?",
      "Can you think of a day in the last week when it did not happen?",
      "How often do you start one thing and end up doing another because of something you saw or heard?",
      "How often do unrelated thoughts take you away from what you are doing?"
    ] },
    { k: "severity", label: "How bad", items: [
      "Once you are pulled away, how easy is it to get back to the task?",
      "Have you missed something important, like a turning, a deadline or a safety step, because of distraction?",
      "How much longer do tasks take you than they should?",
      "What is the worst thing that has happened because your attention was pulled away?",
      "Does it just slow you down, or does it stop tasks getting done at all?",
      "Has it caused accidents, near misses or burns?"
    ] },
    { k: "pervasive", label: "In different places", items: [
      "Does it happen at work, at home and when you're out?",
      "Is it the same when you're alone somewhere quiet?",
      "Does it happen with things you enjoy, as well as things you find dull?",
      "Is it worse in some places? Which ones?",
      "Does it happen when you're driving, or only at a desk?"
    ] },
    { k: "duration", label: "How long it has been going on", items: [
      "How long have you been like this?",
      "Was there ever a time when it was not a problem?",
      "Did it start or get worse with a particular event, job or life change?",
      "Was it the same when you were a teenager?",
      "Did phones and social media start it, or was it there before?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Can your colleagues work in the same busy room without the same trouble?",
      "Do other people seem to notice the same noises and movements as you?",
      "Compared with friends your age, are you more easily pulled away?",
      "Do people comment on how easily you get sidetracked?",
      "Would people at work say you need quieter conditions than most?"
    ] },
    { k: "impact", label: "Effect on life", items: [
      "What has this cost you at work or in study?",
      "Has it affected your safety, such as when driving or cooking?",
      "Has it caused problems with your partner, children or friends?",
      "Has it affected exam results or job reviews?",
      "Do you feel tired or frustrated by the effort of staying on track?",
      "Have you had to change jobs, rooms or shifts because of it?"
    ] },
    { k: "compensation", label: "Ways of coping", items: [
      "What do you do to cut out interruptions?",
      "Do you use headphones, white noise, app blockers or a quiet room?",
      "Do you work at odd hours to avoid people?",
      "What happens when you can't use those strategies?",
      "How much effort does it take to keep your attention where you want it?",
      "Have you asked for adjustments at work or college, such as a quiet space?"
    ] },
    { k: "onset", label: "When it started", items: [
      "Do you remember being easily sidetracked at primary school?",
      "Did teachers move your seat or comment about you watching other children?",
      "Was homework hard because of things going on at home?",
      "Do you have school reports that mention it?",
      "Did it start before you were 12?"
    ] }
  ],
  informant: {
    partner: [
      "How easily does your partner get pulled away from what they are doing by noise or people?",
      "Do they react to every sound, phone alert or movement around them?",
      "Do they lose track of what you are saying when something happens nearby?",
      "What happens if you talk to them while the TV is on?",
      "How do they cope in busy places like restaurants or shopping centres?",
      "Do they drift onto their phone in the middle of tasks?",
      "Have they had near misses driving because something caught their eye?",
      "Do they need silence or headphones to get things done?",
      "Have you seen them start one thing and get pulled into another?",
      "Is this more than other adults you know?",
      "Is it like this everywhere, or only when they are stressed or tired?"
    ],
    parent: [
      "Was your child easily pulled away from tasks by noise or movement?",
      "Did teachers mention them watching other children or looking out of the window?",
      "Could they do homework with other people in the room?",
      "Did they leave one game for another going on nearby?",
      "At mealtimes, did they keep turning to look at things?",
      "Did they get sidetracked when sent to do a simple job?",
      "Were they better one-to-one than in a group?",
      "Did you have to turn the TV off to get them to listen or work?",
      "How did they manage at clubs, swimming or sport?",
      "Compared with brothers, sisters or other children, were they more easily sidetracked?",
      "When did you first notice this?"
    ],
    school: [
      "Easily distracted",
      "Distracted by others in class",
      "Works better one-to-one or in a small group",
      "Often off task",
      "Needs to sit near the front or away from distractions",
      "Would achieve more if better able to focus",
      "Watches what others are doing rather than their own work"
    ]
  },
  counts: [
    "Ordinary sights, sounds, alerts or unrelated thoughts often pull the person off task: most days, and in more than one setting, for example at work and at home.",
    "Once pulled away, the person struggles to get back, so work is slowed, left half done or full of errors.",
    "It is more than peers of the same age in the same conditions, for example colleagues in the same office.",
    "It happens with routine and demanding tasks alike, not only with dull tasks or extreme noise.",
    "For adults, a stream of unrelated thoughts that takes them away from the task counts if it is frequent and longstanding.",
    "It needs real effort or compensation (headphones, quiet rooms, night working, app blockers). Score what happens without that support, and record the cost.",
    "It has consequences, such as lower output, mistakes, safety risks, conflict or poor exam results.",
    "It is longstanding and not tied to a particular episode of low mood, anxiety, trauma or substance use.",
    "For the childhood rating, teachers commented on being sidetracked by others, noise or things outside, or arranged special seating."
  ],
  notCount: [
    "Distraction only in genuinely chaotic or very loud settings where most people would struggle.",
    "Attention pulled away only by worry (anxiety), rumination (depression) or intrusive memories (PTSD), rather than by ordinary sights, sounds or unrelated thoughts.",
    "Scanning for danger and startle linked to trauma or an unsafe environment.",
    "Distraction only during spells of raised mood with less need for sleep (bipolar).",
    "Sensory overload with distress from particular sounds, lights or textures, without the pattern of jumping to new things (consider autism).",
    "Difficulty following speech in background noise because of hearing loss.",
    "Only when sleep-deprived, intoxicated, withdrawing or after starting a new medicine.",
    "Responding to voices or other unusual experiences (psychosis).",
    "Started recently, with a clear before and after and no earlier pattern: look for a new cause.",
    "Only one tempting stimulus, such as the phone, with no pull from other things around them (consider problematic phone use).",
    "Losing interest in dull tasks with no pull from outside stimuli or unrelated thoughts: rate this under sustained attention (A1b) instead.",
    "Struggling to follow a second language in a noisy setting, when focus is fine in the first language."
  ],
  anchors: [
    { score: "yes", quote: "I can't work in our open-plan office. Every phone, every conversation, I'm listening in. I've got headphones on all day and I still look up when anyone walks past. It takes me twice as long as everyone else.", why: "Yes. Frequent capture by ordinary stimuli, more than colleagues, and costly even with compensation." },
    { score: "yes", quote: "I'll go to pay a bill, see a message, then remember I wanted to look up a recipe, and an hour later the bill's still not paid. My school reports all said I was watching everyone else instead of working.", why: "Yes. Pulled away by stimuli and unrelated thoughts, across settings, with a childhood history." },
    { score: "yes", quote: "I only get anything done between 11 at night and 3 in the morning when the house is silent. If my partner is up and moving around, forget it.", why: "Yes, if this is longstanding and impairing (sleep loss, missed deadlines). Night working is compensation; also check for a delayed sleep phase." },
    { score: "unsure", quote: "Everyone gets distracted by their phone, don't they? I check it a lot.", why: "Unsure. Ask whether other things also pull them away and whether tasks go unfinished; phone checking alone does not make the symptom." },
    { score: "unsure", quote: "Since the break-in I can't settle. I'm listening to every noise in the house.", why: "Unsure, leaning No. Hypervigilance after trauma is a different mechanism; explore the earlier history and PTSD symptoms." },
    { score: "unsure", quote: "In lectures I'm fine, but in the library everyone moving about drives me mad.", why: "Unsure. One setting alone is not enough to decide. Explore work, home and social settings, and whether it is more than other students in the same library." },
    { score: "no", quote: "I'm quite good at shutting out noise. I worked in a call centre for years with no problems.", why: "No. Good filtering in a demanding, noisy setting." },
    { score: "no", quote: "When I'm low I can't concentrate on anything; my mind keeps going back to the same worries. When I'm well I'm fine.", why: "No for this symptom. Attention is captured by rumination during episodes; assess for depression." },
    { score: "no", quote: "When I'm high my thoughts race and I notice everything, then it settles down for months.", why: "No. Episodic distractibility tied to mood episodes; assess for bipolar disorder." }
  ],
  mimics: [
    { ddx: "gad", clue: "Attention is pulled to worries rather than to things around them; physical tension and dread.", ask: "When your mind leaves the task, does it go to worries, or to whatever is happening around you?" },
    { ddx: "ptsd", clue: "Scanning for danger, jumpiness and distraction linked to trauma reminders.", ask: "Do you find yourself checking who is around you or listening out for danger?" },
    { ddx: "asd", clue: "Distress from particular sounds, lights or textures; preference for sameness; social communication differences.", ask: "Is it that noise grabs your attention, or that certain noises are painful or overwhelming?" },
    { ddx: "sensory", clue: "Struggles to follow speech in noise, turns the TV up, often asks for repeats.", ask: "Have you had a hearing test? Do you hear words clearly in quiet places?" },
    { ddx: "bip", clue: "Distractibility comes in episodes with racing thoughts, little sleep and high energy.", ask: "Have there been spells of days when your mind raced and you needed much less sleep than usual?" },
    { ddx: "dep", clue: "Rumination, low mood and slowed thinking, with a recent onset.", ask: "Was your attention like this before your mood dropped?" },
    { ddx: "psychosis", clue: "Attention pulled by voices or unusual experiences; perplexity.", ask: "Do you ever hear or see things others don't, that take your attention?" },
    { ddx: "osa", clue: "Daytime sleepiness, snoring, morning headaches; focus worst when tired.", ask: "Do you snore or wake unrefreshed? Do you nod off during the day?" },
    { ddx: "sud_cannabis", clue: "Focus worse with daily use or during withdrawal.", ask: "How is your focus after a few weeks without cannabis?" },
    { ddx: "gaming", clue: "The pull is specifically towards games or the phone, with craving and loss of control, rather than to anything new.", ask: "Is it anything around you that takes your attention, or mainly the pull to games or your phone?" }
  ],
  special: {
    women: "Girls are often quiet, so being pulled away by what is going on around them, or by their own thoughts, can look like daydreaming and go unnoticed by teachers. Women may describe a busy mind and unrelated thoughts more than visible looking around.",
    older: "New distractibility in later life may reflect hearing loss, mood change or cognitive decline. Look for a lifelong pattern and check hearing.",
    highIQ: "Able people may keep up despite constant distraction by working longer hours or at night. Ask about the effort and hours involved, not only the results.",
    sud: "Stimulants, cannabis, alcohol and withdrawal all affect focus. Ask about distraction during sober periods and before substance use started; some people use substances to quieten distraction.",
    asd: "Autistic people may be overwhelmed by sensory input, which can look like distractibility. In ADHD attention jumps to anything new; in autism particular sensory inputs cause distress. Both can co-occur and each needs assessing.",
    culture: "Busy, shared and crowded homes increase distraction for everyone, so compare with others in the same household. Following speech in a second language in noise is harder, so check language before scoring."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A1h, paraphrased",
    "WHO ICD-11 CDDR (2024), 6A05 inattention features (distractibility including unrelated thoughts), paraphrased",
    "Kooij JJS et al. Updated European Consensus Statement on diagnosis and treatment of adult ADHD. Eur Psychiatry 2019;56:14-34",
    "DIVA 2.0 structure (Kooij and Francken 2010); all wording original",
    "ASRS v1.1 item 11 (Kessler et al. 2005)",
    "CADDRA Canadian ADHD Practice Guidelines 4.1 (2020), differential diagnosis tables",
    "Clinical practice (examples, probes and anchors)"
  ]
}]);
