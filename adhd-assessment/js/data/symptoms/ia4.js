/* ia4: Does not follow through or finish tasks. Original interview content for ADHD Assessment (structure follows DIVA; wording is original). */
AA.add('symptoms', [{
  id: "ia4",
  dim: "IA",
  codes: { dsm5: "A1d", diva: "A4", asrs: [1] },
  title: "Does not follow through or finish tasks",
  criterion: "Often does not carry instructions through to the end and leaves schoolwork, chores or workplace duties unfinished. The person starts the task but soon loses focus or gets sidetracked. It is not explained by defiance or by not understanding what was asked.",
  adultForm: "In adults this shows as a trail of half-finished jobs: projects that stall after a strong start, admin begun and abandoned, DIY and household jobs left part-done, and work that needs chasing before the final details are wrapped up. DSM-5-TR describes starting tasks but quickly losing focus and being easily sidetracked. Many adults finish only with an outside deadline, close supervision or a crisis, and some shape their working life around short tasks or someone checking in.",
  why: "Finishing depends on keeping the goal active in working memory and keeping effort going once the reward of starting has faded. In ADHD, weak goal maintenance and a strong pull towards immediate reward mean attention slides to whatever is newer, so tasks drift rather than being refused. The last, least rewarding steps (checking, tidying up, sending off) are the most likely to be dropped.",
  ask: {
    adult: "Over the last six months, how often have you started something, at work or at home, and not finished it because your focus drifted or you got sidetracked onto something else? Can you give me a recent example?",
    child: "When you were at primary school, roughly age 5 to 12, how often did you start schoolwork, homework or jobs at home and leave them unfinished because you drifted onto something else? What do you remember, or what did adults say about it?"
  },
  rephrase: [
    "How often do you start things and not finish them? Tell me about the last time.",
    "How many jobs or projects do you have on the go right now that are half done?",
    "When someone gives you a job with a few steps, how far do you usually get before you drift off it?",
    "Tell me about the last project you started at home or at work. What happened to it?",
    "Plain words: how often do you leave jobs half done? What was the last one?",
    "Simple English: you begin a job. Then you stop before the end. How often does this happen? Tell me one time.",
    "How often do people chase you for the last bits of a job? Who, and about what?",
    "Most people leave the odd job unfinished. Is it more for you than for your friends or colleagues? How do you know?",
    "If nobody checks on you and there is no deadline, what happens to a task once you have started it?",
    "What do you do to make sure you finish things? What would happen if you stopped doing that?",
    "If I looked around your home, computer or workplace, would I find unfinished jobs or projects? What would they be?",
    "When you reach the dull final part of a task, like checking, tidying up or sending it off, what happens?",
    "Has leaving something unfinished ever cost you marks, money or a job? What happened?",
    "Are you more of a starter or a finisher? What makes you say that?"
  ],
  examples: {
    adult: [
      { ctx: "work", label: "Work", items: [
        "Leaves reports at 90 percent, missing the final checks and sign-off",
        "Has several work projects open at once, none of them completed",
        "Drifts from the assigned task onto a more interesting side job",
        "Manager has to chase for the last parts of a piece of work",
        "Starts the shift task list but completes only the first few items",
        "Follows the first steps of a work procedure, then skips the rest",
        "Leaves a job site with snagging or tidy-up still undone",
        "Begins stocktaking or a rota, and someone else has to finish it",
        "Leaves end-of-shift notes or handovers incomplete",
        "Has been told in appraisals that they do not see things through",
        "Takes on new initiatives with enthusiasm, then quietly lets them lapse",
        "Customers complain that the last fixings or finishing touches were never done",
        "Takes only short contracts or quick jobs that can be finished in one go",
        "Asks a colleague to check in daily so tasks actually get finished",
        "Leaves customer or client queries half dealt with, never closing them off"
      ] },
      { ctx: "study", label: "Study and training", items: [
        "Signs up for online courses eagerly but completes very few",
        "Hands in assignments with the conclusion or references missing",
        "Left a degree, apprenticeship or training course part way through",
        "Begins revising one topic, then drifts onto another before finishing it",
        "Dissertation or portfolio unfinished for months past the target date",
        "Completes the interesting modules of a course and stalls on the rest",
        "Reads the opening chapters of set books but rarely reaches the end",
        "Needs a tutor or study partner checking in to get assignments over the line"
      ] },
      { ctx: "home", label: "Home and household", items: [
        "Rooms half painted or half decorated for months",
        "Starts cleaning one room, moves to another, and finishes neither",
        "Gets the washing dry but rarely as far as folding and putting it away",
        "DIY tools still out weeks after a job was started",
        "Garden jobs begun in spring are still half done in autumn",
        "Begins batch cooking, stops halfway and leaves ingredients out",
        "Takes things apart to fix them and never puts them back together",
        "Flat-pack furniture stays half assembled",
        "Stops following the instructions for a new appliance partway and guesses the rest",
        "Empties a cupboard to sort it, then leaves the contents on the floor",
        "Boxes still unpacked a year or more after moving house",
        "Washes up but stops before the pans and worktops are done",
        "Household jobs get finished only when visitors are about to arrive",
        "Pays tradespeople to finish DIY jobs they started themselves"
      ] },
      { ctx: "admin", label: "Paperwork and money", items: [
        "Fills in part of a form, then leaves it unfinished for weeks",
        "Starts an online tax return but does not get to the end",
        "Abandons job, benefit or grant applications midway",
        "Sets up a budget spreadsheet, fills in one month, then stops",
        "Starts switching energy or insurance provider but never completes it",
        "Expense claims and timesheets sit part filled until someone chases",
        "Begins setting up a pension or savings plan but skips the final steps",
        "Starts a complaint or refund claim and lets it lapse before it is resolved",
        "Partner often has to finish forms that were started and left"
      ] },
      { ctx: "relationships", label: "Partner and family", items: [
        "Partner complains about promised jobs that are only half done",
        "Agrees to a request, starts it, then drifts onto something else",
        "Begins wrapping presents or writing cards and leaves the rest",
        "Rows at home about the number of unfinished projects",
        "Promised to clear the shed, loft or garden, but it stays half done",
        "Family have stopped asking for help because jobs rarely get finished",
        "Writes a heartfelt message or letter but never sends the final version",
        "Relatives take over jobs halfway through to get them done"
      ] },
      { ctx: "parenting", label: "Parenting", items: [
        "Starts the bedtime routine, gets sidetracked, and the children are still up late",
        "Begins a craft or school project with a child, then leaves the child to finish",
        "Children's school forms started but returned incomplete",
        "Starts sorting outgrown clothes; the bags sit unsorted for months",
        "Begins teaching a child a skill, like riding a bike, then lets it drop",
        "Starts making packed lunches, wanders off, and someone else finishes them",
        "Promised the children a den, treehouse or project that was never completed"
      ] },
      { ctx: "social", label: "Friends and social life", items: [
        "Offers to organise a night out or trip, then leaves friends to finish arranging it",
        "Takes on a club, committee or volunteer role keenly, then lets it slide",
        "Starts making a present, photo album or video for a friend and never completes it",
        "Offers to help a friend move or decorate and drifts off partway through"
      ] },
      { ctx: "leisure", label: "Leisure and hobbies", items: [
        "Has piles of half-knitted, half-built or half-painted hobby projects",
        "Takes up a new hobby with a burst of energy, then drops it within weeks",
        "Many books started, with the bookmark a third of the way in",
        "Leaves video games unfinished and moves on to the next new one",
        "Starts writing songs, stories or a blog but never completes a piece",
        "Jigsaws or puzzles left half done on the table",
        "Training plan for a run or event dropped after a few weeks",
        "Sewing, woodwork or restoration projects stacked up at various stages"
      ] },
      { ctx: "digital", label: "Phone, screens and online", items: [
        "Dozens of browser tabs open for tasks begun and abandoned",
        "Emails and texts sit unsent in the drafts folder",
        "Online forms and shopping baskets abandoned part way through",
        "Starts setting up a new phone, app or account and leaves it half done",
        "Begins sorting photos or computer files and gives up halfway",
        "Opens the laptop to finish one job and ends up on something else entirely",
        "CV or online profile on job sites left half completed"
      ] },
      { ctx: "conversation", label: "Conversations and meetings", items: [
        "Actions from one meeting are still half done at the next",
        "Given spoken instructions with several steps, completes only the first",
        "Says they will do it now, starts, and is pulled onto something else",
                "Colleagues have learned to give them one step at a time",
        "Offers to look into something for someone, gets sidetracked, and never reports back"
      ] },
      { ctx: "health", label: "Health and appointments", items: [
        "Stops physiotherapy or rehab exercises after the first few days",
        "Starts a self-help workbook or therapy course and drops out early",
        "Begins referral or health forms and leaves them unfinished",
        "Starts a food, sleep or symptom diary for a clinician and drops it within days",
        "Gets halfway through booking a test or appointment online and leaves it"
      ] },
      { ctx: "inner", label: "Inner experience", items: [
        "Feels a rush of motivation at the start that vanishes halfway",
        "Loses interest as soon as the task is no longer new",
        "Cannot make themselves do the last boring part of a job",
        "Feels guilt and shame about the trail of unfinished things",
        "Finishes only when a deadline brings panic or pressure",
        "Calls themselves a starter, not a finisher",
        "Leaves a job unfinished as soon as a new idea or task comes to mind",
        "Works better with someone else in the room just to get to the end"
      ] }
    ],
    child: [
      { ctx: "school", label: "Classroom and schoolwork", items: [
        "Starts a worksheet but hands in only the first part",
        "Copies the first lines from the board, then the page stays half empty",
        "Carries out only the first step of a teacher's multi-step instruction",
        "Written stories regularly have no ending",
        "Leaves a task to chat or do something else and never comes back to it",
        "Exercise books full of unfinished pieces of work",
        "Drifts onto doodling in the margin instead of completing the task",
        "Needs an adult alongside to finish independent work",
        "Art and craft pieces left part made at the end of lessons",
        "Often kept in at break or golden time to finish off work"
      ] },
      { ctx: "homework", label: "Homework", items: [
        "Homework started at the kitchen table but left half done",
        "Reading record shows books started and not finished",
        "Projects begun at half term still incomplete at the deadline",
        "Hands in homework with whole sections left blank",
        "A parent has to sit alongside to get to the end of homework",
        "Answers the questions they like and leaves the rest",
        "Homework diary shows repeated notes about work not completed",
        "Gets sidetracked by toys or the TV partway through homework"
      ] },
      { ctx: "home", label: "Home and family", items: [
        "Sent to get dressed, comes back only half dressed",
        "Asked to tidy their room, ends up playing with the first toy found",
        "Gets halfway through brushing teeth and wanders off",
        "Starts jobs like feeding the pet, then others have to finish",
        "Needs each step of the morning routine given separately",
        "Sent upstairs for something, gets caught up doing something else",
        "Leaves the table halfway through laying it",
        "Bath or shower routine left part done unless someone watches",
        "Parents find half-done jobs all over the house"
      ] },
      { ctx: "play", label: "Play and friends", items: [
        "Starts building kits or models and leaves them unfinished",
        "Moves from game to game without finishing any",
        "Board games abandoned before the end",
        "Begins building dens or forts but never completes them",
        "Drawings and colouring pages left half done",
        "Leaves a game with friends midway to start something else",
        "Collections and sticker albums started with excitement, then dropped"
      ] },
      { ctx: "activities", label: "Clubs, sport and outings", items: [
        "Joins clubs eagerly, then drops them within weeks",
        "Learns the opening of a music piece but never the whole thing",
        "Starts a drill or practice task at sport and drifts off before the end",
        "Tasks for Scouts, Guides or similar groups started but not signed off",
        "Sponsored or charity challenges started but not completed",
        "On trips, worksheets or activity trails left half done"
      ] },
      { ctx: "reports", label: "What teachers and parents said", items: [
        "'Needs to complete work in class'",
        "'Starts well but does not finish'",
        "'Work is often left incomplete'",
        "'Needs frequent reminders to stay on task to the end'",
        "'Could achieve far more if work were finished'",
        "'Easily sidetracked from the task in hand'",
        "'Needs one-to-one support to complete independent tasks'",
        "Parent: 'Never finished anything they started'"
      ] },
      { ctx: "teen", label: "Secondary school (12-16)", items: [
        "Coursework handed in incomplete or very late",
        "Revision notes half written for most subjects",
        "Dropped exam courses or after-school courses partway through",
        "Part-time job tasks left half done, with warnings from the employer",
        "Started an award scheme like Duke of Edinburgh but never completed it",
        "Project folders with missing sections at hand-in"
      ] }
    ]
  },
  probes: [
    { k: "frequency", label: "How often", items: [
      "In a typical week, how many tasks do you start and not finish?",
      "Is this most days, some days, or only now and then?",
      "Right now, how many unfinished jobs or projects can you think of?",
      "When did you last finish a task without anyone chasing you?",
      "How often do people remind you to complete something you began?",
      "Does it happen with small everyday jobs as well as big projects?"
    ] },
    { k: "severity", label: "How severe", items: [
      "What is the biggest thing you have left unfinished, and what did it cost you?",
      "Have unfinished tasks led to warnings, lost marks, fines or losing work?",
      "Do you need someone to supervise you to complete tasks?",
      "How much of your work do others end up finishing for you?",
      "When you do finish, is it on time, at the last minute or late?",
      "Are there tasks you have stopped even attempting because you never finish them?"
    ] },
    { k: "pervasive", label: "In more than one setting", items: [
      "Does this happen at work and at home, or mainly in one place?",
      "What about hobbies and things you enjoy: do you finish those?",
      "Is it the same for jobs you do for other people as for your own?",
      "Does it happen when a supervisor is around as well as when you are on your own?",
      "Are there any areas of life where you reliably finish what you start?",
      "Was it the same in previous jobs, courses or homes?"
    ] },
    { k: "duration", label: "How long", items: [
      "How long have you been like this?",
      "Was there ever a time in your life when you finished things easily?",
      "Has it been there for most of the last six months?",
      "Did it start or get worse after a particular event, illness or change?",
      "Was it the same in your teens and twenties?"
    ] },
    { k: "peers", label: "Compared with others", items: [
      "Compared with friends or colleagues of your age, do you leave more things unfinished?",
      "Has anyone ever compared you with others on this?",
      "Do people around you finish things that you would leave?",
      "Is your pile of unfinished things bigger than most people's?",
      "In your job, how do you compare with others doing the same role?"
    ] },
    { k: "impact", label: "Effect on life", items: [
      "What has happened because of jobs left unfinished?",
      "How does it affect your partner, family or the people you live with?",
      "Has it affected your career, studies or income?",
      "How do you feel about yourself when you look at your unfinished things?",
      "Has it led to rows, debt, penalties or legal problems?",
      "What would be different in your life if you finished things?"
    ] },
    { k: "compensation", label: "Coping strategies and their cost", items: [
      "What do you do to make yourself finish things?",
      "Do you rely on deadlines, a boss, a partner or friends to get you to the end?",
      "Have you chosen work with short tasks or lots of supervision because of this?",
      "How much extra time or energy does finishing cost you compared with others?",
      "What happens when those supports are not there?",
      "Do you use tricks like timers, rewards or working beside someone?"
    ] },
    { k: "onset", label: "When it started", items: [
      "Do you remember leaving schoolwork unfinished at primary school?",
      "Did teachers comment on unfinished work or needing to stay on task?",
      "Were you known in the family as someone who started things and dropped them?",
      "Was it there before any problems with mood, drugs or alcohol?",
      "Can you give me an example from before you were 12?"
    ] }
  ],
  informant: {
    partner: [
      "Does your partner leave jobs around the house half done?",
      "Since you have known them, how many projects have they started and not finished?",
      "Do you have to remind or chase them to finish things?",
      "When they agree to do something, how often does it actually get completed?",
      "Do they drift off one job onto another before the first is done?",
      "Do you end up finishing tasks they started?",
      "Is it the same with things they enjoy?",
      "Does it happen even when they are well, rested and not stressed?",
      "Has it caused problems with money, work or the home?",
      "Do they need a deadline or a crisis to finish anything?",
      "How long have you noticed this?"
    ],
    parent: [
      "As a child, did they finish their schoolwork and homework?",
      "If you asked them to do a job with a few steps, how far did they get?",
      "Did they drift off tasks to play with something else?",
      "Did you have to stand over them to get things done?",
      "Did teachers mention unfinished work at parents' evenings or in reports?",
      "Did they start hobbies or clubs and drop them quickly?",
      "Were their models, drawings or games often left half done?",
      "Compared with brothers, sisters or friends, were they different in this?",
      "At what age did you first notice this?",
      "Did getting dressed or ready need step-by-step prompting for longer than other children?",
      "Did they finish things they really enjoyed?"
    ],
    school: [
      "Work often incomplete",
      "Starts well but does not finish",
      "Needs to stay on task until the end",
      "Needs adult support to complete independent work",
      "Easily sidetracked",
      "Homework not completed or not handed in",
      "Capable, but does not complete work"
    ]
  },
  counts: [
    "Tasks are left unfinished most weeks, across several kinds of task, clearly more than peers of the same age and situation.",
    "The reason is drifting, losing focus or getting sidetracked, not refusal, lack of skill or not understanding the task.",
    "It happens in at least two areas of life, for example work and home, or study and hobbies.",
    "It has lasted at least six months and is a long-standing pattern, not a recent change.",
    "It causes problems: complaints, lost marks or money, warnings at work, strain at home, or others taking over.",
    "It is present when the person is well, rested and not under unusual stress.",
    "Score Present when finishing depends on heavy outside structure (supervision, deadline panic, a partner finishing) that peers do not need, and that support costs a lot.",
    "Include it when the final details (checking, tidying up, sending off) are routinely left undone, even if the main part gets done.",
    "For childhood, teachers or parents noticed unfinished work or multi-step instructions not carried through before about age 12."
  ],
  notCount: [
    "Refusal or defiance: the person chose not to do it (won't rather than can't). That is oppositional behaviour, not this symptom.",
    "The task or instructions were not understood (language barrier, learning disorder, intellectual disability).",
    "Tasks left unfinished only during a depressive episode, with normal follow-through when well.",
    "Stopping because of worry, perfectionism or fear of judgement, rather than drifting off onto something else.",
    "Genuine overload: far more tasks than anyone could finish, where peers in the same position also fall behind.",
    "Starting many projects only during spells of high mood, high energy and little sleep (consider bipolar disorder).",
    "Physical exhaustion, pain or illness that stops the task (long COVID, chronic pain, anaemia).",
    "Only when using cannabis, alcohol or other drugs, or during withdrawal.",
    "Only in one setting, such as one disliked job, while finishing reliably everywhere else.",
    "Began recently, for example after a head injury, a new medication or in midlife, with no childhood history.",
    "Normal variation: a few unfinished hobbies or one long-running DIY job, without impact.",
    "Not starting at all belongs to A1f (avoids mental effort), forgetting the task exists belongs to A1i (forgetful), and not taking in the instructions belongs to A1c (does not seem to listen). Score here only when the task was understood and started, then dropped."
  ],
  anchors: [
    { score: "yes", quote: "Every room in the house has a different half-done job. At work my manager books a check-in every Friday because otherwise nothing gets to the end. My school reports said exactly the same thing.", why: "Present. Frequent, at home and at work, long-standing since childhood, impairing, and finishing relies on outside structure." },
    { score: "yes", quote: "I get the main part of a job done, but the last bits, the checking, the paperwork, sending it off, just don't happen. I've lost two clients because invoices sat unfinished for months.", why: "Present. The final steps are routinely dropped, with a real financial cost. Confirm it also happens outside work." },
    { score: "yes", quote: "I put the washing on, start the dishes, get the hoover out, and two hours later none of it is done because I keep jumping to the next thing.", why: "Present, if this is typical most days and long-standing. Classic drifting from task to task with nothing completed. Check onset and other settings." },
    { score: "unsure", quote: "I don't finish things at work, but honestly the job is dull and I can't stand my boss. At home I'm fine.", why: "Unsure. One setting and a possible motivation or job-fit problem. Ask about previous jobs, study and childhood before deciding." },
    { score: "unsure", quote: "Since my baby was born I haven't finished a single thing. Before that I was fine.", why: "Unsure, leaning towards Absent. Recent onset with an obvious cause (sleep loss, caring load). If there is no earlier pattern, do not score it." },
    { score: "unsure", quote: "I stop halfway because I'm worried it isn't good enough, so I keep going back to redo the start.", why: "Unsure. This sounds like perfectionism or anxiety. Ask whether they also drift onto other things when they are not worried. Score only if drifting is the main reason." },
    { score: "no", quote: "I leave things when I've had enough, like anyone, but I always go back and get them done.", why: "Absent. Normal variation; tasks are completed and there is no impact." },
    { score: "no", quote: "When I'm depressed I can't finish anything, but in between I'm the one at work who gets everything over the line.", why: "Absent for this symptom. Episodic and tied to mood. Record it under the depression differential." },
    { score: "no", quote: "I didn't finish the forms because I couldn't understand what they wanted. My reading in English isn't good.", why: "Absent. The barrier is language or literacy, not follow-through. Arrange support and consider a literacy check." }
  ],
  mimics: [
    { ddx: "dep", clue: "Unfinished tasks arrived with low mood, loss of interest and low energy, and were not there before.", ask: "When your mood is good, do you finish what you start?" },
    { ddx: "bip", clue: "Bursts of starting many projects with high energy and little need for sleep, then dropping them.", ask: "Have there been spells of several days when you started lots of new things and needed much less sleep than usual?" },
    { ddx: "burnout", clue: "Demands are too high for anyone; follow-through was fine before the current workload or caring role.", ask: "When your workload was normal, did you finish things?" },
    { ddx: "gad", clue: "Stops tasks because of worry about doing them wrong or about the outcome.", ask: "When you stop, is it because your mind gets pulled to something else, or because you are worried about how it will turn out?" },
    { ddx: "ocd", clue: "Tasks stay unfinished because of checking, redoing or needing them to feel just right.", ask: "Do you get stuck repeating or checking parts of a task until it feels right?" },
    { ddx: "sld", clue: "Unfinished work only in reading, writing or maths tasks.", ask: "Do you finish practical jobs that involve no reading or writing?" },
    { ddx: "idd", clue: "Stops because the steps are too complex to understand, across many areas of life.", ask: "When you leave a task, do you know what the next step would be?" },
    { ddx: "postviral", clue: "Stops because of physical or mental exhaustion that gets worse after effort.", ask: "Do you stop because you get distracted, or because you run out of energy and need to rest?" },
    { ddx: "sud_cannabis", clue: "Unfinished tasks cluster on days of heavy cannabis use and improve during breaks from it.", ask: "When you have gone a few weeks without cannabis, did you finish things better?" },
    { ddx: "tbi", clue: "New after a head injury or stroke, with no childhood history.", ask: "Before the injury, were you able to finish things?" }
  ],
  special: {
    women: "Girls and women often hide unfinished work by staying up late or redoing it in private, so teachers saw a quiet, compliant pupil. Ask about the hidden cost: late nights, a parent or partner finishing tasks, and shame about half-done projects.",
    older: "In older adults, ask whether difficulty finishing is lifelong or new. New trouble with multi-step tasks in later life suggests cognitive decline, depression, medication effects or vascular change, and needs separate assessment.",
    highIQ: "Able people often finish only because they can do the work fast at the last minute, so impairment shows as underachievement, deadline crises and reliance on all-nighters. Judge impairment against their ability and effort, not against average output.",
    sud: "Cannabis, alcohol and the comedown from stimulants all reduce follow-through. Establish whether the pattern was there before regular use and whether it persisted during long periods without use.",
    asd: "Autistic people may leave tasks when a routine is disrupted, instructions are vague, or a focused interest takes over. In ADHD the drift is usually towards whatever is newer or more stimulating; in autism it is more often towards a focused interest or caused by unclear expectations. Both can be present.",
    culture: "Expectations about finishing tasks vary with culture, gender role and family structure, and in some families others routinely complete tasks for young people. Check that instructions were understood in the person's first language and compare with peers from the same background."
  },
  refs: [
    "DSM-5-TR (APA 2022), criterion A1d, paraphrased",
    "ICD-11 CDDR 6A05 (WHO 2024), inattention features, paraphrased",
    "Kooij JJS et al. Updated European Consensus Statement on adult ADHD. Eur Psychiatry 2019;56:14-34",
    "DIVA 2.0 structure (Kooij and Francken 2010); wording original",
    "ASRS v1.1 Part A item 1 (WHO, Kessler et al. 2005)",
    "Clinical practice"
  ]
}]);
