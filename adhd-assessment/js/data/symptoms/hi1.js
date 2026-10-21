/* hi1: Fidgets, taps or squirms in seat. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "hi1",
  dim: "HI",
  codes: { dsm5: "A2a", diva: "H/I 1", asrs: [5] },
  title: "Fidgets, taps or squirms in seat",
  criterion: "Often moves the hands or feet restlessly, taps or fiddles with things, or shifts and wriggles about in the seat, more than is usual for the person's age and setting.",
  adultForm: "In adults the movement is usually smaller and better hidden than in childhood: a bouncing knee under the table, clicking pens, turning a ring, picking at skin or nails, swivelling the chair, constantly changing position. Many adults have learned to suppress visible movement, and the effort of doing so leaves them tense, tired or unable to follow what is being said. DSM-5-TR notes that hyperactivity becomes less obvious with age, so ask about the effort and cost of keeping still, not only about visible movement.",
  why: "Weaker inhibition of motor activity together with a need for extra stimulation to stay alert in dull, seated situations. Small movements appear to help many people with ADHD keep arousal and working memory up, which is why fidgeting rises when a task is slow, sedentary or demanding to hold in mind.",
  ask: {
    adult: "Over the last six months, when you have had to sit for a while, such as at a desk, in a meeting, at a meal or watching something, how often have your hands or feet been on the move, or have you kept shifting about in your seat? Can you give me a recent example?",
    child: "Thinking back to primary school, roughly age 5 to 12, how often were your hands or feet moving, or were you fiddling with things or wriggling about, when you were meant to be sitting nicely? What did teachers or your parents say about it?"
  },
  rephrase: [
    "When you sit down, do your hands or feet keep moving?",
    "Do you jiggle your leg, tap your fingers or play with things a lot when you sit?",
    "Is it hard for your body to keep still in a chair?",
    "When you sit, do your hands or feet move a lot? Can you show me what they do?",
    "What do your hands usually do while you are listening to someone?",
    "If I filmed you in a long meeting or at the cinema, what would I see your body doing?",
    "Lots of people fidget a little. Compared with friends or colleagues, do you move more, and do people mention it?",
    "Do you have tricks to stop yourself fidgeting, like sitting on your hands or holding something? What happens without them?",
    "How much effort does it take to keep still somewhere like the dentist or a job interview?",
    "Does anyone ask you to stop tapping, clicking or bouncing your leg?",
    "Do you find yourself twisting, picking or pulling at things, like a pen, your sleeves or your skin, while sitting?",
    "Would you call yourself a fidgeter?",
    "Do you change position in your chair a lot, tuck your legs under you, or rock?",
    "When you have been sitting for a while, does your body feel uncomfortable until you move a bit?"
  ],
  examples: {
    adult: [
      { ctx: "work", label: "Work", items: [
        "Bounces a knee under the desk for most of the working day",
        "Clicks a pen on and off until a colleague mentions it",
        "Spins or tilts the office chair while working at the screen",
        "Drums fingers on the desk or keyboard while thinking",
        "Twists paper clips or elastic bands into shapes during the day",
        "Shifts position in the chair every few minutes",
        "Keeps a stress ball or fidget toy on the desk to get through the day",
        "A colleague has asked them to stop shaking the shared desk",
        "Sits on a wobble cushion or exercise ball to allow some movement",
        "Uses a standing desk mainly to be able to shift weight constantly",
        "On a till or production line, drums fingers whenever there is a pause",
        "Fiddles with a lanyard, ID badge or zip throughout the shift",
        "Taps feet so much in a home office that people downstairs complain"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "Taps a pen against teeth or the desk in lectures",
        "Twirls hair round a finger or chews hoodie strings while reading",
        "Doodles constantly in margins to keep the hands busy",
        "Swaps sitting positions many times during a two-hour exam",
        "Chews pen lids until they split",
        "Fellow students have asked them to stop rattling the shared bench",
        "Has asked for a fidget object as an exam adjustment",
        "Sits cross-legged, then kneeling, then sideways on the chair while revising"
      ] },
      { ctx: "conversation", label: "Conversations and meetings", items: [
        "Jiggles a foot under the table throughout team meetings",
        "Turns a ring, bracelet or watch strap round and round while listening",
        "Peels labels off bottles or tears napkins into strips while chatting",
        "Turns a phone over and over in the hand without looking at it",
        "Clicks a pen until the person chairing the meeting gives them a look",
        "On video calls, swivels in the chair or rocks in and out of view",
        "Always holds a cup or object so the hands have something to do",
        "Taps a foot to an inner rhythm while someone else is speaking",
        "Fiddles with sleeves, buttons or cuffs in interviews"
      ] },
      { ctx: "home", label: "Home and household", items: [
        "Leg bounces on the sofa throughout a television programme",
        "Shifts around on the sofa so much that others ask them to settle",
        "Picks at the sofa fabric or pulls threads out of cushions",
        "Taps cutlery on the plate or table during meals",
        "Sits on one leg, then the other, then tucked up, during a meal",
        "Has broken chairs by tipping back on them",
        "Pulls at loose threads in clothes until holes appear",
        "Drums on the worktop while waiting for the kettle to boil"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Partner says the sofa or bed shakes from their jiggling foot",
        "Fiddles with a partner's hair, hands or clothes while sitting together",
        "Partner nudges them under the table to stop the tapping",
        "Family members call them 'twitchy' or 'jiggly'",
        "Partner says sitting beside them at the cinema is distracting",
        "Has arguments at home about clicking, tapping or drumming noises"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "Bounces a leg through the school play or parents' evening",
        "Fidgets through children's assemblies and gets looks from other parents",
        "Plays with the child's pens or toys while helping with homework",
        "Drums on the table during homework help, distracting the child",
        "Clicks the buggy brake on and off while waiting",
        "Shifts and squirms in the stand at children's sports matches"
      ] },
      { ctx: "social", label: "Friends and social life", items: [
        "Spins a beer mat or glass on the table at the pub",
        "Shreds receipts, napkins or coasters into tiny pieces at restaurants",
        "Friends tease them for never sitting quietly in a chair",
        "Rocks back on chair legs at friends' houses",
        "Rattles the restaurant table with a bouncing knee",
        "Taps a lighter, keys or phone on the table while chatting"
      ] },
      { ctx: "driving", label: "Driving and travel", items: [
        "Drums on the steering wheel at traffic lights",
        "Keeps adjusting the seat, mirrors or radio while driving",
        "Fiddles with air vents, seatbelt or window buttons as a passenger",
        "Squirms and changes position all through long train or plane journeys",
        "Picks at the armrest or seat fabric on public transport",
        "Taps feet through a bus ride, annoying the person next to them",
        "Pulls the seatbelt in and out on long journeys"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Spins the phone in the hand or flips the case open and shut",
        "Swipes the phone screen back and forth without reading anything",
        "Clicks the mouse or taps keys for no reason while a page loads",
        "Rocks or swivels in a gaming chair throughout online sessions",
        "Picks up and puts down the phone repeatedly during a video call"
      ] },
      { ctx: "leisure", label: "Leisure and hobbies", items: [
        "Shifts, crosses and uncrosses legs all through a film at the cinema",
        "Picks at nails or skin while reading a book",
        "Taps feet through a concert, play or service where others are still",
        "Knits, crochets or doodles mainly to stop the hands fidgeting",
        "Fiddles with cards or game pieces between turns",
        "Rocks or shuffles through a long board game"
      ] },
      { ctx: "health", label: "Health and appointments", items: [
        "Taps feet and plays with leaflets in the GP waiting room",
        "Struggles to keep still for a scan, blood test or dental treatment",
        "Has been told by a hairdresser or tattoo artist to stop moving",
        "Picks the skin around nails while sitting until it bleeds",
        "Bites nails or chews the inside of the cheek when sitting still",
        "Fidgets so much in the dentist's chair that treatment takes longer"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Feels an urge in the hands or legs that eases only with fiddling",
        "Puts so much effort into keeping still that they lose track of what is said",
        "Sits on hands or crosses legs tightly to hide fidgeting",
        "Feels tense and drained after a long spell of forced stillness",
        "Notices the fidgeting only when someone points it out",
        "Finds that moving the hands helps them listen and think",
        "Feels self-conscious and embarrassed about visible fidgeting",
        "Has swapped obvious fidgeting for hidden toe-curling inside shoes",
        "Picks seats at the back so the fidgeting is less noticed"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Rocks back on chair legs in lessons, sometimes tipping over",
        "Wriggles and rolls about on the carpet at story time",
        "Taps a pencil or ruler on the desk until told to stop",
        "Chews pencils, rubbers, sleeves or collars",
        "Kneels up on the chair or tucks feet under while working",
        "Fiddles with things in the pencil case instead of writing",
        "Swings legs and kicks the table leg or the chair in front",
        "Plays with the velcro on shoes or the zip of a jumper",
        "Picks at the corners of exercise books until pages are ragged",
        "Twists round in the seat to look behind",
        "Pokes or prods the child sitting next to them in assembly",
        "Was given a wobble cushion or fidget toy by the teacher",
        "Pulls bits off rubbers or sharpens pencils down to stubs"
      ] },
      { ctx: "homework", label: "Homework", items: [
        "Slides down the chair, then up, then sideways during homework",
        "Drums on the table and kicks the chair legs at homework time",
        "Clicks pens or fiddles with everything in reach instead of writing",
        "Does homework lying on the floor, rolling about",
        "Bites the ends of pencils until they splinter",
        "Spins round in a swivel chair while trying to read",
        "Twists hair or clothing during reading practice"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Squirms and shifts throughout family meals",
        "Taps cutlery and plays with food at the table",
        "Bounces or rocks on the sofa while watching television",
        "Kicks the seat in front on car journeys",
        "Fiddles with toys, buttons or the remote during family films",
        "Picks at scabs or the skin around nails",
        "Wriggles constantly while having hair brushed or cut",
        "Kicks the table during meals without noticing"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Fiddles with other children's things during quiet games",
        "Wriggles and shuffles when friends sit down to watch something",
        "Knocks over pieces in board games through fidgeting",
        "Taps and bangs on everything while playing indoors",
        "Plays with the hair or clothes of the child next to them"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "Fidgets through the cinema, theatre or pantomime",
        "Squirms through religious services, weddings or ceremonies",
        "Plays with the music stand or instrument during rests",
        "Fiddles with kit and laces while waiting at sports club",
        "Wriggles and fiddles in the circle at Cubs, Brownies or Scouts",
        "Wriggles through long meals in restaurants"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "Report said 'needs to keep hands to themselves'",
        "Teacher wrote 'constantly fiddling' or 'cannot keep still'",
        "Parents' evening comments about wriggling and swinging on chairs",
        "Report said 'would achieve more if less fidgety'",
        "Teacher moved them to the front to keep an eye on the fidgeting",
        "Relatives called them 'wriggle-bottom' or 'ants in their pants'",
        "Was often told off for rocking on the chair",
        "Nursery noted wriggling at circle time and snack time"
      ] },
      { ctx: "teen", label: "Secondary school (12-16)", items: [
        "Clicked pens or tapped constantly in secondary school lessons",
        "Jiggled legs in exams and was asked to stop by invigilators",
        "Chewed sleeves, pen lids or hoodie strings",
        "Swapped obvious fidgeting for doodling or picking at nails",
        "Still swung on chairs in class as a teenager"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "In a typical day, how often would you notice yourself fidgeting, or would someone else notice?",
      "Does it happen in most sitting situations, or only some?",
      "Is there any situation where you sit completely still for half an hour without effort?",
      "Out of your last ten meetings, meals or films, how many did you fidget through?",
      "Is it most days, some days, or only now and then?",
      "How long can you sit before you start moving?"
    ] },
    { k: "severity", label: "How strong", items: [
      "Is the movement small and hidden, or do people notice it straight away?",
      "Has anyone asked you to stop, or moved away from you because of it?",
      "Can you stop when asked, and for how long?",
      "Has it ever caused damage, such as broken chairs, chewed pens or skin injuries?",
      "From 0 to 10, how hard is it to stay completely still for ten minutes?",
      "What happens when you try to hold it in?"
    ] },
    { k: "pervasive", label: "Where it happens", items: [
      "Does it happen at work, at home and with friends?",
      "Do you fidget even when you are interested and enjoying something?",
      "Do you fidget when you are relaxed, or only when you are tense?",
      "Does it happen when you are alone as well as with others?",
      "Is it the same on holiday or at weekends?"
    ] },
    { k: "duration", label: "How long it has been there", items: [
      "As far back as you can remember, have you been a fidgeter?",
      "Has it been there for at least the last six months, without long breaks?",
      "Have there been times in adult life when it went away completely? What was happening then?",
      "Did it start or get worse with a new medicine, more caffeine, or a drug?",
      "Has it changed form over the years, for example from swinging on chairs to leg jiggling?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Compared with colleagues in the same meeting, do you move more?",
      "Do other people comment on it, or are you the only one who notices?",
      "Did you stand out among classmates for fidgeting?",
      "Are you the one in the family known for not keeping still?",
      "Is it more than your brothers, sisters or friends, or about the same?"
    ] },
    { k: "impact", label: "Effect on life", items: [
      "Has fidgeting caused any trouble at work, in exams or in relationships?",
      "Does keeping still use up concentration you need for other things?",
      "Has it embarrassed you, for example in interviews or at formal events?",
      "Has it caused injury, such as picked skin or bitten nails that bleed?",
      "Has it changed how others see you, for example as bored, nervous or rude?",
      "Do you avoid anything because of it?"
    ] },
    { k: "compensation", label: "Coping and hiding it", items: [
      "What do you do to keep it under control or out of sight?",
      "Do you carry something to fiddle with, like a fidget toy, ring or pen?",
      "Do you choose seats, desks or jobs that let you move?",
      "What does keeping still cost you, for example tiredness, headache or missing what is said?",
      "Do you knit, doodle or chew gum to keep your hands or mouth busy?",
      "If your coping tricks were taken away, what would happen?"
    ] },
    { k: "onset", label: "When it started", items: [
      "Were you a wriggly child? What did your parents say?",
      "Do your school reports mention fidgeting, rocking on chairs or fiddling?",
      "Was it noticed before age 12?",
      "Are there family stories about you being unable to keep still for photos, meals or services?",
      "Did it begin after a particular event, illness or medicine?"
    ] }
  ],
  informant: {
    partner: [
      "When you sit together, what do their hands and feet usually do?",
      "Do they jiggle a leg, tap or fiddle with things more than most people you know?",
      "Have you ever asked them to stop tapping, clicking or bouncing?",
      "Can they get through a film or a meal without wriggling or shifting?",
      "Do they pick at skin, bite nails or chew things?",
      "Have friends or family ever commented on how much they fidget?",
      "Do they seem aware of it, or surprised when you point it out?",
      "Does the fidgeting happen even when they are relaxed and happy?",
      "Is it there on holidays and weekends, not just at stressful times?",
      "Has it changed since any new medicine, or with caffeine, alcohol or other drugs?",
      "Does it cause any problems, for example at the cinema, in bed or at restaurants?",
      "How long have you known them, and has it always been like this?"
    ],
    parent: [
      "At primary school age, could they sit still at the table or on the carpet?",
      "Did they rock on chairs, kick table legs or wriggle a lot?",
      "Did teachers mention fidgeting, fiddling or not keeping their hands to themselves?",
      "Compared with brothers, sisters or cousins, were they more fidgety?",
      "How were they at places like church, the cinema, the hairdresser or on long car journeys?",
      "Did they chew clothes or pencils, or bite their nails?",
      "Did anything help, like giving them something to hold?",
      "Was the fidgeting there most days, or only when tired, unwell or upset?",
      "Did it start before they went to school, or later?",
      "Were they told off or punished at school for not staying still?",
      "Did they have tics, jerks or repeated noises as a child?",
      "Do you have old school reports or videos that show this?"
    ],
    school: [
      "Cannot keep still",
      "Fiddles with equipment",
      "Rocks on chair",
      "Needs to keep hands to themselves",
      "Wriggles on the carpet",
      "Restless in their seat",
      "Always has something in their hands",
      "Would concentrate better if less fidgety"
    ]
  },
  counts: [
    "Hand, foot or body movement while seated happens often: most days and in most sitting situations, not just occasionally.",
    "It is clearly more than peers of the same age, sex and culture in the same setting, and others have noticed or commented.",
    "It shows in at least two settings, for example work and home, or meetings and meals.",
    "It happens when the person is calm and interested, not only when anxious, in pain or after hours of boredom.",
    "It is longstanding and trait-like: present for at least the last six months and usually traceable to childhood, not tied to episodes.",
    "Score Present when stillness is possible only with obvious effort and that effort causes strain, missed information or exhaustion.",
    "Score Present when the person needs aids to manage it (fidget objects, gum, knitting, a wobble cushion) and the fidgeting returns without them.",
    "Small, hidden movements count if frequent and persistent, such as toe-curling inside shoes or picking at skin under the table.",
    "It causes some problem: complaints from others, embarrassment, damage, skin injury, or distraction of self or others.",
    "For childhood: rocking on chairs, wriggling at the table or on the carpet and constant fiddling, more than classmates, noted by teachers or parents."
  ],
  notCount: [
    "Occasional fidgeting in very long, dull situations that most people find hard, such as a three-hour talk with no break.",
    "Movement only during worry, panic or social fear, with anxious thoughts driving it and absent when calm (consider anxiety disorders).",
    "Restlessness that started with a medicine such as an antipsychotic, an SSRI, metoclopramide, or a stimulant dose change (possible akathisia or side effect).",
    "Movement caused by caffeine, nicotine withdrawal, stimulant drugs or alcohol withdrawal; check timing against use.",
    "Sudden, brief, repeated stereotyped movements preceded by an urge and followed by relief (tics), unless ordinary fidgeting is also present.",
    "An unpleasant urge to move the legs mainly in the evening or at night, relieved by walking (restless legs).",
    "Patterned, repetitive movements such as rocking or hand-flapping used to self-soothe or manage sensory load in autism, unless typical ADHD fidgeting is also present.",
    "Hair pulling or skin picking driven only by a tension and relief cycle, without broader fidgeting (body-focused repetitive behaviour).",
    "Shifting because of pain, stiffness, a medical condition or uncomfortable seating.",
    "Fidgeting in only one setting, or that started only in the last few months.",
    "Tremor or jitteriness with weight loss, heat intolerance or palpitations (check thyroid function).",
    "Behaviour that is culturally usual in the setting, such as worry beads or prayer beads, unless clearly more than peers and causing problems."
  ],
  anchors: [
    { score: "yes", quote: "My leg goes under the desk all day. My manager moved me off the shared bench because I was shaking everyone's screens. On the sofa my partner holds my knee. I was always swinging on chairs at school.", why: "Present. Frequent, across work and home, noticed by others with consequences, and traceable to childhood." },
    { score: "yes", quote: "I'm not visibly fidgety any more, I taught myself to sit on my hands. But I curl my toes in my shoes in every meeting, and if I really make myself keep still I lose the thread of what's being said.", why: "Present. Hidden form with effortful suppression that has a clear cost. Confirm childhood fidgeting through reports or a parent." },
    { score: "yes", quote: "There's always something in my hand, a pen, a hair tie, my ring. In lectures and in front of the telly I pick at my nails. My mum used to say I couldn't sit still for a photo.", why: "Present if it is broad fiddling across settings and longstanding. Note any separate skin-picking pattern as a possible co-occurring body-focused repetitive behaviour." },
    { score: "unsure", quote: "I suppose I fidget a bit when meetings drag on. Doesn't everyone?", why: "Unsure. Ask how often, in which other settings, and whether colleagues fidget as much. Score No if it is similar to peers and causes no problems." },
    { score: "unsure", quote: "Since I started the new antidepressant my legs just won't stop. I can't sit through a film.", why: "Unsure, leaning towards a medicine effect. Ask what it was like before the medicine and in childhood; new onset with a medicine suggests akathisia, which needs medical review." },
    { score: "unsure", quote: "I only fidget when I'm nervous, like job interviews or at the dentist. The rest of the time I'm fine.", why: "Unsure, leaning No. Situational and anxiety-linked. Explore relaxed settings; if absent there, score No and consider anxiety." },
    { score: "no", quote: "I can sit and read for hours. My mum always said I was a calm child.", why: "Absent. No current or childhood evidence of fidgeting." },
    { score: "no", quote: "In the evening my legs feel horrible, like something crawling, and I have to get up and walk. During the day I'm fine.", why: "Absent for this symptom. Evening leg discomfort relieved by walking fits restless legs; assess that separately." },
    { score: "no", quote: "I blink hard and clear my throat. It builds up and I have to do it, then it settles.", why: "Absent for this symptom. A premonitory urge and relief point to tics. Score fidgeting only if ordinary fidgeting is also present." }
  ],
  mimics: [
    { ddx: "gad", clue: "Fidgeting rises with worry and settles when calm; worried thoughts come first.", ask: "When you are relaxed and happy, say on holiday, do your hands and feet still keep moving?" },
    { ddx: "meds", clue: "Started or worsened after an antipsychotic, SSRI, anti-sickness medicine or a stimulant dose change (akathisia).", ask: "Did the restless movement begin or change when you started or changed any medicine?" },
    { ddx: "tics", clue: "Sudden, brief, stereotyped movements preceded by an urge and followed by relief.", ask: "Do you feel a build-up or urge before the movement, and does doing it bring relief?" },
    { ddx: "rls", clue: "Unpleasant leg sensations at rest, worse in the evening, eased by walking.", ask: "Is it worse in the evening or in bed, with a crawling or aching feeling in your legs?" },
    { ddx: "sud_stim", clue: "Movement tied to caffeine, energy drinks, cocaine, amphetamine or nicotine withdrawal.", ask: "How much caffeine, nicotine or other stimulants do you use, and does the fidgeting follow using or stopping them?" },
    { ddx: "asd", clue: "Patterned repetitive movements such as rocking or flapping used to self-soothe or cope with sensory overload.", ask: "Are the movements the same each time, and do they help you cope with noise, light or overwhelming situations?" },
    { ddx: "ocd", clue: "Skin picking or hair pulling driven by tension and relief, with little other fidgeting.", ask: "Apart from picking or pulling, do you fidget in other ways, like tapping or jiggling?" },
    { ddx: "thyroid", clue: "New jitteriness or tremor with weight loss, heat intolerance, sweating or palpitations.", ask: "Have you noticed weight loss, feeling hot, a racing heart or shaky hands recently?" },
    { ddx: "social", clue: "Fidgeting mainly when being watched, judged or performing.", ask: "Do you fidget when you are alone at home, or mainly when other people are looking at you?" },
    { ddx: "normal", clue: "Occasional fidgeting in long, dull situations, similar to peers, with no complaints.", ask: "Do others in the same meeting fidget as much as you, and has anyone ever mentioned it?" }
  ],
  special: {
    women: "Girls and women are often taught to keep still, so fidgeting may be small and hidden: twisting hair, picking skin, toe-curling, knitting or doodling. Ask about the effort and cost of keeping still, and about school reports such as 'fiddly' or 'chatty'.",
    older: "Visible fidgeting tends to lessen with age and may be replaced by hidden habits. New restlessness in later life needs a medical review first (medicines, thyroid, restless legs, Parkinson's disease, cognitive decline with agitation), and a lifelong history is essential.",
    highIQ: "Able adults often build socially acceptable outlets such as note-taking, doodling, standing desks or active roles, so fidgeting looks mild. Judge by what happens when the outlets are unavailable and how much effort stillness takes.",
    sud: "Caffeine, nicotine and its withdrawal, stimulants, and alcohol or benzodiazepine withdrawal all cause fidgety restlessness. Establish whether fidgeting was present before substance use began and during periods without use.",
    asd: "Autistic people may have repetitive movements (stimming) such as rocking, flapping or finger-flicking that are patterned and help regulate sensory or emotional load. ADHD fidgeting is more varied, rises with boredom and is not ritualised; both can co-exist, so record each separately.",
    culture: "Expectations about sitting still vary across cultures, schools and religious settings, and some people use worry beads or prayer beads routinely. Compare with peers from the same background and ask whether their own community saw them as unusually fidgety."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A2a, paraphrased",
    "ICD-11 6A05 (WHO 2022), hyperactivity-impulsivity features, paraphrased",
    "ASRS v1.1 item 5 (Kessler et al. 2005)",
    "Kooij JJS et al. Updated European consensus statement on diagnosis and treatment of adult ADHD. Eur Psychiatry 2019",
    "DIVA 2.0 structure (Kooij and Francken 2010); wording original",
    "Sarver DE et al. Hyperactivity in ADHD: impairing deficit or compensatory behavior? J Abnorm Child Psychol 2015",
    "Clinical practice: akathisia, tics, restless legs and body-focused repetitive behaviours as differentials"
  ]
}]);
