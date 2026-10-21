/* impairment: onset (criterion B), settings and impairment (criteria C and D), duration, the supplement
   question and collateral history. Powers the onset and collateral steps of the interview.
   Original content for ADHD Assessment: the structure follows DIVA (five impairment areas plus daily life and
   safety, adult then childhood, collateral rated 0/1/2), but all wording is original.
   Sources: NICE NG87 (1.2.2, 1.3.1, 1.3.3, 1.4.3); UKAAN AQAS (Adamou et al. 2024); RCPsych CR235 (2023);
   Kooij et al. 2019 European Consensus (citing Kooij 2008, Sibley 2018, Cooper 2018); Moffitt et al. 2015;
   CADDRA 4.1; AADPA 2022; DSM-5-TR; WHO ICD-11 CDDR (2024); GOV.UK ADHD and driving.
   Example lists are append-only: stored ticks use the item index. */
AA.add('impairment', {
  severity: [
    { v: 0, l: "None", d: "No effect on functioning in this area, or no more difficulty than most people of the same age. Ordinary slips with no real consequences." },
    { v: 1, l: "Mild", d: "Noticeable but minor. Occasional problems that are soon put right, or extra effort the person can keep up without real cost. DSM-5-TR mild severity means no more than minor impairment. Clear but minor interference can still meet DSM-5-TR criterion D, but mild impairment alone is below the NICE NG87 1.3.3 threshold." },
    { v: 2, l: "Moderate", d: "Clear, repeated problems with real consequences, such as warnings, conflict, lost money or falling behind, or coping only at a high and sustained cost (very long hours, constant help from others). This is the NICE NG87 1.3.3 level of at least moderate impairment; AQAS 2024 asks for it in at least two areas or settings." },
    { v: 3, l: "Severe", d: "Marked impairment: major loss or harm in this area, such as dismissal, exclusion, relationship breakdown, serious debt, injury or police contact, or unable to function there without substantial support. Matches the marked impairment of DSM-5-TR severe." }
  ],

  domains: [
    {
      id: "work",
      label: "Work and education",
      why: "Work and study are where impairment is easiest to document and where many adults first seek help. Look for a pattern over years: achievement below ability, unstable jobs, and the hidden cost of keeping up. AQAS 2024 makes questions about employment and education essential in every assessment, and warns that high achievement in some areas does not rule ADHD out. Rate the cost of coping, not only the outcome.",
      adult: {
        ask: [
          "Tell me about your jobs since leaving school. How many have you had, and how did each one end?",
          "Has a manager or tutor raised concerns about your timekeeping, mistakes, deadlines or organisation? What happened?",
          "Have you had a warning, a performance review or been let go? What was it about?",
          "Do you feel you work below your ability or qualifications? Why do you think that is?",
          "How long do tasks take you compared with colleagues? Do you stay late or take work home to keep up?",
          "Have you started courses or training that you did not finish? What got in the way?",
          "Which parts of your job do you put off, such as reports, admin or expenses? What happens as a result?",
          "Have you left jobs on impulse, after an argument, or because you got bored? How often?",
          "What would your colleagues say it is like to work with you?",
          "What helps you cope at work, and what happens when that support is not there?"
        ],
        items: [
          "Left college, university or an apprenticeship without finishing",
          "Qualifications well below what tutors expected from their ability",
          "Needed resits or extra years to complete a course",
          "Works in a role well below their skills or qualifications",
          "Many jobs in a short time; few lasting more than a year",
          "Moves on once a job stops feeling new or interesting",
          "Resigned on the spot after a frustrating day",
          "Dismissed, or not kept on after a probation period",
          "Formal warnings for lateness or missed shifts",
          "Placed on a performance improvement plan",
          "Repeatedly misses deadlines despite working late",
          "Passed over for promotion because of reliability concerns",
          "Appraisals mention disorganisation, errors or poor follow-through",
          "Leaves the admin side of the job until it becomes urgent",
          "Expenses, timesheets or reports handed in late or not at all",
          "Clients or customers have complained about missed calls or emails",
          "Arguments with managers or colleagues about reliability",
          "Told off for talking over people or speaking out of turn in meetings",
          "Works evenings and weekends to catch up on routine tasks",
          "Relies on a colleague or assistant to keep them on track",
          "Chose self-employment or active work to escape desk-based roles",
          "Business ideas started with great energy, then abandoned",
          "Cannot cope with open-plan offices or constant interruptions",
          "Time off with stress or burnout from the effort of keeping up",
          "Long spells out of work, or claiming benefits, because of these difficulties",
          "Copes only because the job is highly structured or closely supervised",
          "Keeps up only through high ability and last-minute bursts of effort",
          "Took far longer than peers to settle on a career",
          "Missed job interviews, exams or assessment deadlines",
          "Lost a job after a safety or quality error",
          "Takes on too many projects, then cannot deliver them all",
          "Coursework handed in late or only after repeated extensions",
          "Cannot get through the reading needed for a course",
          "Needed extra time or other adjustments to pass exams",
          "Turned down promotion to avoid the extra paperwork and planning",
          "Works far more hours than colleagues for the same output"
        ],
        anchors: {
          0: "Steady work or study at the expected level. No warnings, no unusual effort to keep up, and job changes have ordinary reasons.",
          1: "Minor problems, such as occasional lateness or missed deadlines that are put right, or extra effort the person can sustain. Career, income and study are not affected.",
          2: "Repeated problems with real consequences: warnings, poor appraisals, a course failed or dropped, frequent job changes, or keeping up only by working far longer than colleagues.",
          3: "Marked impairment: dismissals, long periods out of work, education abandoned well below ability, or unable to hold a job without substantial support."
        }
      },
      child: {
        ask: [
          "How did you get on at primary school? What did teachers say about your work and behaviour?",
          "How was secondary school? Did things get harder with more teachers and more homework?",
          "Were you kept in at break, put on report, sent out of class, suspended or excluded? What for?",
          "Did you have extra help, a teaching assistant or a special educational needs plan?",
          "How did homework go at home? How long did it take, and who had to help?",
          "Did your results match how bright people said you were?",
          "Did you change schools, repeat a year or leave school or college early?",
          "Do any old school reports survive? What do they say?"
        ],
        items: [
          "Teachers often said they could do better if they tried",
          "Reports mention daydreaming, chatting or not finishing work",
          "Often kept in at break or lunch to finish work",
          "Often sent out of class or to the head teacher",
          "Put on a behaviour report card or contract",
          "Suspended (fixed-term exclusion) or permanently excluded from school",
          "Moved schools because of behaviour or learning problems",
          "Moved down to lower sets despite being able",
          "Had a teaching assistant, SEN support, a statement or an EHCP",
          "Exam results well below what teachers predicted",
          "Homework took hours and often ended in tears or rows",
          "Homework regularly not done, lost or handed in late",
          "Grades dropped sharply after moving to secondary school",
          "Left school, sixth form or college without the expected qualifications",
          "Needed a parent sitting alongside to get any schoolwork done",
          "Coursework rescued at the last minute by parents or teachers",
          "Frequent detentions for forgetting kit, books or homework",
          "Skipped lessons they found boring",
          "Did well only in subjects they loved and fell behind in the rest",
          "Coasted on ability until demands rose, then struggled",
          "Attended a pupil referral unit or alternative provision",
          "School asked for an educational psychology assessment",
          "Disrupted lessons by calling out, clowning or wandering about",
          "Could not revise for exams despite wanting to do well",
          "Results held up only by a very structured school or private tutoring",
          "Teachers described them as lazy, careless or not trying",
          "Reports graded effort and behaviour low across most subjects",
          "Repeated a school year, or restarted a course after falling behind"
        ],
        anchors: {
          0: "Progress in line with ability, with no more than ordinary teacher comments about effort or behaviour.",
          1: "Some comments about concentration, chatting or untidy work, but progress and relationships with teachers were broadly fine.",
          2: "Repeated problems with consequences: regular detentions or being kept in, results clearly below ability, extra help needed, or homework that needed constant adult input.",
          3: "Marked impairment: exclusions, school moves, special placement or a pupil referral unit, leaving school early, or results far below ability despite support."
        }
      }
    },

    {
      id: "relationships",
      label: "Partner and family",
      why: "Partners and families carry much of the day-to-day cost: forgotten commitments, an unequal share of chores and admin, impulsive words and decisions, and recurring arguments. Ask about partner relationships, parenting and the wider family. A partner's account is especially useful here: many adults with ADHD have limited insight into their own impairment (Kooij 2019), while partners see the day-to-day impact. Kooij 2019 also lists relationship problems and intimate partner violence among the burdens of adult ADHD, so ask about safety at home.",
      adult: {
        ask: [
          "How are things at home with your partner or the people you live with? What do you argue about most?",
          "What does your partner say they find hardest about living with you?",
          "Who does most of the planning, bills and housework? How did it end up that way?",
          "Have past relationships ended because of things like forgetfulness, outbursts or unreliability?",
          "Do you tend to start or end relationships quickly, without much thought?",
          "Do you ever feel more like a child than an equal partner, being reminded and checked on?",
          "If you have children, how do routines, school runs and appointments go? What goes wrong?",
          "How do you get on with your parents and brothers or sisters now? Has contact been affected by arguments?",
          "Has your temper or impatience caused problems at home?"
        ],
        items: [
          "Daily arguments about forgotten chores, plans or promises",
          "Partner feels they must remind, check and chase all the time",
          "Partner handles all the bills, forms and planning",
          "Partner says they feel like a parent rather than an equal",
          "Separation or divorce in which these difficulties played a part",
          "Several relationships that ended after a short time",
          "Moved in together or got engaged within weeks of meeting",
          "Ended relationships suddenly in the heat of the moment",
          "Loses interest in a partner once the early excitement fades",
          "Partner complains they do not listen or drift off mid-conversation",
          "Forgets birthdays, anniversaries or important family events",
          "Says hurtful things on impulse during disagreements, then regrets them",
          "Quick temper leads to shouting or slammed doors at home",
          "Spending decisions made without discussion cause rows",
          "Partner has threatened to leave over the same recurring problems",
          "Couples counselling sought because of recurring conflict",
          "Sex life affected by distraction, boredom or low interest",
          "Impulsive affairs or risky sexual encounters have damaged trust",
          "Afraid to start a relationship because of past failures",
          "Late collecting children, or forgets school events",
          "Children's forms, appointments and kit often missed",
          "Struggles to keep consistent routines and boundaries for children",
          "Loses temper with children and feels guilty afterwards",
          "Partner carries most of the parenting because they cannot rely on them",
          "Household falls into chaos when the partner is away",
          "Contact with parents or siblings reduced after repeated rows",
          "Family still treats them as the unreliable one",
          "Still depends on parents for money, housing or organisation as an adult",
          "Partner often left waiting because of lateness",
          "Takes over conversations at home so others feel unheard",
          "Conflict at home has escalated to police or social care involvement",
          "Domestic abuse or controlling behaviour in a relationship, as victim or perpetrator"
        ],
        anchors: {
          0: "Relationships and family life work as for most people. Disagreements are ordinary and do not centre on the person's difficulties.",
          1: "Some friction, such as teasing or irritation about lateness or forgetting, but no lasting strain, and roles at home are fair.",
          2: "Recurring conflict about the same issues, a clearly unequal share of household and family tasks, or a partner who feels they must manage the person. Relationships are under real strain.",
          3: "Marked impairment: relationship breakdowns linked to the difficulties, estrangement from family, serious problems caring for children, or conflict that has involved police or social care. If there is domestic abuse or risk to children, follow safeguarding procedures."
        }
      },
      child: {
        ask: [
          "How did you get on with your parents when you were growing up? What were the rows about?",
          "How often were you told off or punished compared with your brothers and sisters?",
          "Did your parents have to help you with everyday things for longer than other children, like getting ready or homework?",
          "How did you get on with your brothers and sisters?",
          "Did family meals, outings or holidays often go wrong because of your behaviour?",
          "Did your parents ever ask for advice or help because of how you behaved?",
          "Did your behaviour cause stress or arguments between the adults at home?"
        ],
        items: [
          "Told off or punished most days at home",
          "Punished far more often than brothers or sisters",
          "Constant rows with brothers or sisters, sometimes physical",
          "Needed help getting dressed and ready well beyond the usual age",
          "Needed daily reminders for basic routines into the teenage years",
          "Family meals often ended with them sent away from the table",
          "Family outings cut short because of their behaviour",
          "Relatives or babysitters reluctant to look after them",
          "Parents went on parenting courses or sought advice about them",
          "Parents described them as exhausting or a handful",
          "Grounded or had privileges taken away very often",
          "Their behaviour caused arguments between the adults at home",
          "Lost or broke belongings so often that parents stopped replacing them",
          "Physically punished more than siblings (also consider safeguarding and trauma)",
          "Hid letters from school or bad reports from parents",
          "Teenage years marked by frequent, heated clashes over rules",
          "Ran away or stayed away from home after arguments",
          "Left home early after conflict with family",
          "Parents had to sit with them to get any task finished",
          "Seen as the difficult or naughty one in the family",
          "Siblings resented the attention or disruption they caused",
          "A parent cut working hours or changed job to manage them",
          "Broke things at home through rough or careless play",
          "Family support services involved because of their behaviour",
          "Parents often called in to school, adding to stress at home"
        ],
        anchors: {
          0: "Ordinary family life with the usual childhood disagreements.",
          1: "Parents describe them as lively or dreamy and needing extra reminders, but family life was not much disrupted.",
          2: "Frequent conflict or punishment, more supervision than siblings needed, and family routines regularly disrupted.",
          3: "Marked impairment: home life dominated by their behaviour, outside help sought, family breakdown, care involvement or leaving home early after conflict. Consider trauma and safeguarding too."
        }
      }
    },

    {
      id: "social",
      label: "Friends and social contacts",
      why: "In ADHD the difficulty is usually keeping friends rather than making them: forgetting to stay in touch, lateness, interrupting, talking too much or reacting quickly. Difficulty making friends at all, and reading social cues, points more towards autism (RCPsych CR235), although the two often co-occur. Ask what friends would say about the person, and look for friendships lost over time and the loneliness that follows.",
      adult: {
        ask: [
          "Tell me about your friendships. Do you have close friends you have kept for years?",
          "How do you keep in touch with friends? What happens when you forget to reply or to turn up?",
          "Have you lost friends? What usually happens?",
          "In a group, do people say you interrupt, talk a lot or go off on tangents?",
          "Do you find social plans hard to keep, or cancel at the last minute?",
          "Have you said or done things on impulse that upset people?",
          "Do you avoid social situations because of past embarrassment or rejection?",
          "Which is harder for you: making new friends or keeping them? Why?"
        ],
        items: [
          "Friendships fade because they forget to reply or call back",
          "Messages left for weeks, then feels too awkward to reply",
          "Forgets friends' birthdays, big events or news they shared",
          "Often late for social plans; friends have stopped waiting",
          "Double-books or forgets arrangements with friends",
          "Cancels at the last minute when overwhelmed or distracted",
          "Friends say they interrupt or finish their sentences",
          "Dominates conversations or talks over people in groups",
          "Blurts out tactless remarks, then feels embarrassed",
          "Loses the thread in noisy groups and withdraws",
          "Many acquaintances but few lasting close friendships",
          "Friendship groups change often as old ties lapse",
          "Falls out with friends after impulsive arguments",
          "Friends find them exhausting or too much over time",
          "Avoids parties or gatherings after past social mistakes",
          "Lends or borrows money on impulse, straining friendships",
          "Shares secrets or private information without meaning to",
          "Seen as unreliable, so is left out of plans",
          "Gets bored in conversations and turns to their phone",
          "Struggles to listen to friends' problems without switching off",
          "Feels lonely despite wanting more contact",
          "Joins social groups eagerly, then drops out",
          "Rarely stands up for themselves after years of criticism",
          "Reacts sharply when teased or criticised by friends",
          "Online arguments started on impulse have damaged friendships",
          "Neighbours or flatmates complain about noise, mess or forgotten responsibilities",
          "Cannot keep up with group chats and misses plans entirely",
          "Keeps people at a distance to avoid letting them down"
        ],
        anchors: {
          0: "Friendships are stable and satisfying. Any lateness or forgetfulness is tolerated without loss.",
          1: "Friends tease or complain about lateness or forgetting, but friendships last and the person feels connected.",
          2: "Friendships repeatedly lapse or end, the person is left out of plans, or avoids social contact after repeated difficulties, and feels the loss.",
          3: "Marked impairment: few or no lasting friendships, isolation, or repeated serious fallouts clearly linked to the difficulties."
        }
      },
      child: {
        ask: [
          "Did you have friends at primary school? Did they stay your friends?",
          "Were you invited to parties and to play at other children's houses?",
          "Did other children complain that you did not wait your turn, took over games or were too rough?",
          "Were you teased, picked on or left out? Why do you think that was?",
          "Did you get into fights or fallouts more than other children?",
          "Were you ever the one picking on others?",
          "How did things go with friends at secondary school?"
        ],
        items: [
          "Few or no friends who lasted beyond a term or two",
          "Rarely invited to parties or to play at others' homes",
          "Other children avoided them as too bossy or rough",
          "Could not wait their turn in games and was left out",
          "Changed the rules or quit games when losing",
          "Frequent fallouts or fights in the playground",
          "Teased or picked on for being different or always in trouble",
          "Bullied others or was seen as a bully",
          "Played mainly with much younger children",
          "Friends' parents did not want them round again",
          "Often in trouble at break time",
          "Got into trouble by following friends into dares",
          "Made friends easily but lost them quickly",
          "Interrupted and talked over other children",
          "Played the class clown to be accepted",
          "Teenage friendships with older or risk-taking peers",
          "Not picked for teams or groups by other children",
          "Sat alone or wandered about at break times",
          "Lost friends after impulsive comments or actions",
          "Grabbed toys or belongings from other children",
          "Fell out with friends over broken promises or forgotten plans",
          "Upset by frequent rejection; said nobody liked them",
          "Easily led into trouble by other children",
          "Lonely at secondary school despite wanting friends",
          "Left out of sleepovers or clubs after previous incidents"
        ],
        anchors: {
          0: "Had friends, was included, and fallouts were ordinary.",
          1: "Some fallouts or bossiness noted, but still had friends and was included.",
          2: "Friendships rarely lasted, with frequent conflict, teasing or exclusion and few invitations.",
          3: "Marked impairment: no lasting friends, persistent rejection or bullying (as target or bully), or kept out of group activities because of behaviour."
        }
      }
    },

    {
      id: "leisure",
      label: "Free time and hobbies",
      why: "Free time shows whether the person can relax and keep up interests without outside demands. Look for restlessness when not busy, a constant need for stimulation, abandoned hobbies, and excessive or risky activities used to settle. Kooij 2019 notes that some adults use intense sport, alcohol or drugs to calm restlessness. Being able to focus for hours on a favourite activity (hyperfocus) does not rule ADHD out.",
      adult: {
        ask: [
          "What do you do in your free time? Can you relax and enjoy it?",
          "How do you feel when you have nothing planned or nothing to do?",
          "Do you start hobbies with enthusiasm and then drop them? Tell me about some.",
          "Can you sit through a whole film, a book or a long meal? What happens?",
          "Do you need to keep busy or exercise a lot to feel settled?",
          "How much time do you spend on your phone, gaming or online? Does it cause problems?",
          "Have you spent a lot on hobbies or equipment that you then stopped using?",
          "Do you get so absorbed in something that you lose track of time and forget other things?",
          "Do you do risky things for excitement in your free time?"
        ],
        items: [
          "Cannot unwind; feels uneasy when nothing is planned",
          "Fills every free moment with tasks, then ends up exhausted",
          "Leaves films partway through; pile of unread books",
          "Many hobbies started with enthusiasm, then dropped within weeks",
          "Cupboards of expensive kit for abandoned hobbies",
          "Needs hard exercise every day to feel calm enough to function",
          "Injuries from overdoing sport or pushing too hard",
          "Hours lost to gaming, scrolling or videos at the expense of sleep or duties",
          "Stays up very late absorbed in an interest, then struggles next day",
          "Holidays feel stressful; cannot settle and keeps changing plans",
          "Partner or friends avoid quiet outings with them, like the cinema or theatre",
          "Joins clubs or classes and stops going after a few sessions",
          "Pays for memberships or subscriptions that go unused",
          "Cannot enjoy a hobby unless it gives instant reward",
          "Seeks thrills: extreme sports, fast motorbikes or dangerous challenges",
          "Drinks or uses cannabis to wind down in the evening",
          "Restless at events that involve sitting still for long",
          "Board games or team activities end in frustration or arguments",
          "Chores spill into free time, so there is never real rest",
          "Feels guilty during leisure because of unfinished tasks",
          "Drops hobbies that need planning or regular practice",
          "Has given up on an instrument or a language many times",
          "Absorption in a hobby crowds out meals, sleep or family time",
          "Spends on impulse on gadgets, in-game purchases or collections",
          "Becomes bored and irritable on long walks, journeys or holidays",
          "Unable to rest even when unwell or on leave",
          "Days off wasted because plans were never made or fell through",
          "Online gaming has caused conflict at home",
          "Avoids reading for pleasure because concentration drifts"
        ],
        anchors: {
          0: "Enjoys free time, can relax, and keeps up interests.",
          1: "Some restlessness or dropped hobbies, but can relax and enjoys leisure overall.",
          2: "Rarely able to relax, hobbies regularly abandoned, or free time dominated by over-busyness, screens or risky outlets that cause problems.",
          3: "Marked impairment: leisure is a major source of harm or distress, such as injuries, debt from hobbies or gaming, or never resting, leading to exhaustion."
        }
      },
      child: {
        ask: [
          "What did you do for fun as a child? Did you stick at things?",
          "Did you join clubs, sports or lessons? How long did you keep going?",
          "Could you play quietly, or watch a film to the end?",
          "Were you ever asked to leave a club, team or group?",
          "Were you always on the go, even at weekends and in the holidays?",
          "Were there activities you could focus on for hours? What were they?"
        ],
        items: [
          "Joined many clubs and dropped each one after a few weeks",
          "Asked to leave a club, uniformed group or sports team because of behaviour",
          "Could not sit through a children's film at the cinema",
          "Gave up music lessons despite having talent",
          "Played only very active or noisy games",
          "Toys broken or abandoned soon after being given",
          "Could not play board games without quitting or upsetting others",
          "Bored within minutes unless the activity was exciting",
          "Always on the go during holidays and weekends",
          "Hours on computer games and very upset when asked to stop",
          "Started models, crafts or projects and never finished them",
          "Coaches complained they did not listen to instructions",
          "Family trips were hard because they could not cope with waiting",
          "Did not read for pleasure despite being able to read",
          "Needed adults to plan constant activity to keep them out of trouble",
          "Tantrums when games did not go their way",
          "Lost sports kit or instruments so often that activities stopped",
          "Missed activities because of detentions or being grounded",
          "Left out of school trips because of behaviour",
          "Weekends at home often ended in boredom and conflict",
          "By the early teens only screens held interest; other activities dropped",
          "So absorbed in a favourite activity that meals or bedtime were missed",
          "Hobbies never grew into lasting skills or achievements",
          "Parents paid for lessons that were soon abandoned",
          "Struggled with quiet activities such as colouring, puzzles or reading"
        ],
        anchors: {
          0: "Enjoyed play and hobbies and kept some going.",
          1: "Lively, preferred active play and dropped some activities, without real consequences.",
          2: "Rarely stuck with any activity, was regularly asked to leave or left out of clubs, or free time often ended in conflict.",
          3: "Marked impairment: excluded from most organised activities, or free time was a constant source of conflict, danger or distress."
        }
      }
    },

    {
      id: "selfimage",
      label: "Self-confidence and self-image",
      why: "Years of criticism, under-achievement and being told to try harder leave many adults with ADHD feeling stupid, lazy or a failure. Shame and fear of failure drive avoidance and keep people from opportunities. Ask how the person sees themselves and how this has developed. Separate long-standing demoralisation from a depressive episode, which is a change from the person's usual self (CADDRA 4.1).",
      adult: {
        ask: [
          "How do you see yourself compared with other people your age?",
          "What words have other people used about you over the years? Do you believe them?",
          "Do you hold back from starting new things in case you fail?",
          "How do you react when someone criticises you?",
          "Do you feel you have not reached your potential? How does that affect you?",
          "Do you hide your difficulties from others? What does that cost you?",
          "How much do these problems upset you from day to day?",
          "Do you set very high standards to make up for mistakes? What happens then?"
        ],
        items: [
          "Describes themselves as stupid, lazy or useless",
          "Feels they have wasted their potential",
          "Turns down opportunities because they expect to fail",
          "Avoids applying for jobs or courses after past failures",
          "Feels like a fraud who will be found out",
          "Strong, lasting reaction to small criticisms",
          "Goes over a mistake for days after it happens",
          "Compares themselves unfavourably with siblings or friends",
          "Hides their difficulties out of shame",
          "Puts on a front of coping while feeling chaotic inside",
          "Worn out by the constant effort to look organised",
          "Over-prepares or over-checks to avoid any visible mistake",
          "High standards mean tasks are put off or never finished",
          "Apologises constantly for being late or forgetting",
          "Believes others see them as unreliable",
          "Low confidence despite clear abilities and achievements",
          "Distressed and frustrated by their own forgetfulness or restlessness",
          "Has felt different from other people since childhood",
          "Gives up quickly when a task feels hard",
          "Defers to others after years of being corrected",
          "Has had treatment for low mood linked to repeated setbacks",
          "Embarrassed by the state of their home, money or paperwork",
          "Avoids asking for help to hide how far behind they are",
          "Ashamed of broken promises to family or friends",
          "Feels their life is out of control",
          "Doubts their own judgement after many impulsive decisions",
          "Cannot accept praise; puts successes down to luck"
        ],
        anchors: {
          0: "A realistic, stable sense of self. Setbacks are not taken as proof of personal failure.",
          1: "Some self-doubt or frustration about the difficulties, without avoidance or lasting distress.",
          2: "Clear low self-esteem, shame or fear of failure that leads to avoiding opportunities, hiding difficulties or ongoing distress.",
          3: "Marked impairment: a pervasive sense of being a failure that shapes life choices, with major avoidance or persistent distress. Assess mood and risk."
        }
      },
      child: {
        ask: [
          "How did you feel about yourself as a child?",
          "What did teachers and family say about you? What did you come to believe about yourself?",
          "Did you think of yourself as stupid or naughty? Why?",
          "Did you give up on things quickly because you thought you would fail?",
          "How did you react when you were told off or corrected?",
          "Were you given a nickname or label that stuck?"
        ],
        items: [
          "Called themselves stupid or naughty",
          "Felt they were always the one in trouble",
          "Labelled by others as the naughty or lazy one",
          "Gave up on schoolwork, saying they could not do it",
          "Refused to try new activities for fear of failing",
          "Very upset or angry when told off or corrected",
          "Compared unfavourably with a more organised brother or sister",
          "Felt different from classmates from an early age",
          "Embarrassed when poor marks or comments were read out in class",
          "Pretended not to care to hide being hurt",
          "Played the fool to cover feeling stupid",
          "Lost confidence after moving up to secondary school",
          "Said nobody liked them or that they were bad",
          "Tore up work they felt was not good enough",
          "Avoided reading aloud or answering in class",
          "Low mood or anxiety as a teenager linked to repeated failure",
          "Hurtful nickname about daydreaming, clumsiness or being in trouble",
          "Still remembers particular teachers' criticism vividly",
          "Felt they never lived up to parents' expectations",
          "Dropped subjects or hobbies after small setbacks",
          "Showed off or took dares to feel accepted",
          "Felt they had to try twice as hard as everyone else",
          "Hid school reports out of shame",
          "Rarely praised and came to expect criticism",
          "Said they wished they were someone else"
        ],
        anchors: {
          0: "Generally confident and positive about themselves.",
          1: "Some self-doubt after criticism, but recovered and kept trying.",
          2: "Regularly saw themselves as stupid, naughty or a failure, avoided trying, or reacted strongly to correction.",
          3: "Marked impairment: a persistently negative self-image with withdrawal, hopelessness or self-harm. Consider mood disorder and safeguarding."
        }
      }
    },

    {
      id: "daily",
      label: "Daily life, money and admin",
      why: "Everyday living depends on planning, remembering and routine, so it is often affected even when work is protected. Ask about bills, post, debt, appointments, housework, meals, sleep routine and looking after health. This area matches the life skills domain of the WFIRS and the daily tasks heading in AQAS 2024. Kooij 2019 lists financial problems and gambling among the burdens of adult ADHD.",
      adult: {
        ask: [
          "How do you manage bills, post and paperwork? Is anything overdue right now?",
          "Have you had debts, fines, late charges or letters from debt collectors? How did they come about?",
          "Do you buy things on impulse that you cannot afford?",
          "How do you keep track of appointments? How many do you miss?",
          "What is your home like day to day? Who keeps it running?",
          "How do you manage meals, shopping and laundry?",
          "What is your bedtime routine like? Do you get enough sleep?",
          "Do you remember to take regular medicines, book check-ups and order prescriptions?",
          "Have you lost important documents such as a passport or driving licence?",
          "Do you gamble, or have you spent more than you meant to on betting or online shopping?"
        ],
        items: [
          "Unopened post piles up for weeks",
          "Bills paid late, with penalty charges",
          "Debt from impulsive spending or forgotten payments",
          "Bailiffs, county court judgments or debt collection letters",
          "Gas, electricity or phone cut off or threatened for unpaid bills",
          "Parking or traffic fines grow because they are not paid in time",
          "Subscriptions keep running because they forget to cancel",
          "Overdrawn most months despite an adequate income",
          "Tax returns or benefit forms missed, leading to fines or lost money",
          "Forgets renewals such as car tax, insurance, MOT or passport",
          "Gambling or online betting has caused losses or secrecy",
          "Online shopping on impulse; parcels unopened, returns missed",
          "Misses GP, dental or hospital appointments regularly",
          "Removed from a dentist's list after missed appointments",
          "Home cluttered or chaotic; embarrassed to invite people in",
          "Starts tidying several rooms and finishes none",
          "Laundry, washing up or recycling build up for days",
          "Food goes out of date; frequent takeaways because meals are not planned",
          "Irregular meals; forgets to eat when absorbed in something",
          "Bedtime drifts later and later; chronically short of sleep",
          "Late most mornings because routines fall apart",
          "Loses keys, wallet or phone several times a week",
          "Locked out of home or car more than once",
          "Lost important documents such as a passport, licence or certificates",
          "Forgets to take regular medicines or reorder prescriptions",
          "Needs a parent or partner to manage money or paperwork",
          "Rent arrears, or problems with landlords over the state of the home",
          "Moved home often because of debt, eviction or conflict",
          "Big impulsive purchases, such as a car or holiday, without planning",
          "Runs out of basics because shopping is forgotten",
          "Household repairs left until something breaks"
        ],
        anchors: {
          0: "Manages money, paperwork, appointments and the home without unusual difficulty or help.",
          1: "Some late payments, clutter or missed appointments, quickly put right, with no lasting cost.",
          2: "Repeated late charges, debt, missed appointments or a disorganised home that causes conflict, cost or embarrassment, or relies on others to keep things running.",
          3: "Marked impairment: serious debt, court action, eviction, utilities cut off, or unable to manage daily living without substantial help."
        }
      },
      child: {
        ask: [
          "Did you need more help than other children with getting ready, dressing or packing your bag?",
          "How often did you lose things like coats, lunch boxes or PE kit?",
          "What was your bedroom like? Could you keep track of your things?",
          "How did you manage pocket money as a child or teenager?",
          "Were mornings and bedtimes a struggle in your house?",
          "As a teenager, could you manage things like a part-time job, travel or your own appointments?"
        ],
        items: [
          "Needed step-by-step help to get ready long after other children",
          "Late for school most days because mornings were chaotic",
          "Lost coats, jumpers and lunch boxes again and again",
          "PE kit, reading book or homework regularly left at home",
          "Bedroom so messy that things were lost or broken",
          "Spent pocket money as soon as they had it",
          "Borrowed or took money to buy things on impulse",
          "Bedtime battles most nights; could not settle",
          "Forgot to hand letters from school to parents",
          "Needed reminding to wash, brush teeth or change clothes",
          "Belongings broken through carelessness",
          "Lost keys or bus pass more than once as a teenager",
          "Lost a Saturday or part-time job through lateness or forgetting",
          "Phone or tablet lost or broken repeatedly",
          "Could not follow a morning routine without supervision",
          "Often forgot packed lunch or dinner money",
          "Mealtimes disrupted because they would not sit or eat",
          "Needed parents to organise everything into the late teens",
          "Often missed the school bus or train",
          "Forgot to come home at the agreed time",
          "Left taps running, doors open or appliances on",
          "Could not do a simple chore without repeated reminders",
          "School bag chaotic, with crumpled letters and lost work",
          "Teenage bank account overdrawn or phone bills unpaid",
          "Turned up without the right things for trips and activities"
        ],
        anchors: {
          0: "Managed routines and belongings as expected for age.",
          1: "Somewhat forgetful or messy, needing a few more reminders than peers.",
          2: "Needed much more supervision than peers for routines and belongings, with frequent losses and daily battles over getting ready.",
          3: "Marked impairment: could not manage age-appropriate self-care or routines without constant adult help, with frequent serious consequences."
        }
      }
    },

    {
      id: "safety",
      label: "Driving, health and safety",
      why: "ADHD is linked with more accidents, injuries, risky driving, harmful substance use and contact with the police (ICD-11 CDDR; Kooij 2019). This area captures harm the other areas miss and feeds directly into the risk step and driving advice. Ask factually and without judgement. In the UK, people must tell the DVLA if their ADHD or its medication affects their ability to drive safely (NICE NG87 1.4.3; GOV.UK). Kooij 2019 also lists self-harm and suicide attempts among the burdens of adult ADHD, so ask directly.",
      adult: {
        ask: [
          "Do you drive? Have you had accidents, near misses, speeding tickets or points on your licence?",
          "Have you ever lost your licence or been banned from driving?",
          "Do you get distracted while driving, for example by your phone or your thoughts?",
          "How many injuries or A&E visits have you had as an adult? What happened?",
          "Do you take risks for excitement, or act without thinking about danger?",
          "How much do you drink, smoke or use drugs? Do you use them to calm down or to focus?",
          "Have you ever been in trouble with the police? What happened?",
          "Have you done things on impulse that put you at risk, such as unsafe sex or getting into fights?",
          "Have you ever harmed yourself, had sudden urges to, or thought about ending your life? (If yes, complete the risk step today.)"
        ],
        items: [
          "Speeding tickets or penalty points on licence",
          "Driving ban or licence taken away",
          "Car accidents or near misses from not paying attention",
          "Bumps and scrapes when parking or reversing",
          "Uses phone while driving despite knowing the risk",
          "Road rage or aggressive driving",
          "Drives too fast for excitement or because running late",
          "Misses turnings, then makes risky manoeuvres to correct",
          "Cycling, e-scooter or motorbike accidents",
          "Frequent cuts, burns or falls from rushing",
          "Several A&E attendances for injuries",
          "Fractures or other serious injuries from risk-taking",
          "Pans left burning or small kitchen fires",
          "Leaves doors unlocked or the cooker on, putting others at risk",
          "Uses alcohol, cannabis or other drugs to calm down or sleep",
          "Binge drinking with blackouts or dangerous situations",
          "Started smoking or vaping early and finds it hard to stop",
          "Relies on large amounts of caffeine or energy drinks to get through the day",
          "Unprotected sex or unplanned pregnancy after impulsive decisions",
          "Gets into fights or heated confrontations with strangers",
          "Arrested, cautioned or charged with an offence",
          "Criminal conviction linked to impulsive acts",
          "Police called after arguments or public disorder",
          "Impulsive self-harm in moments of intense frustration",
          "Dangerous stunts or dares, even as an adult",
          "Takes up extreme sports without proper preparation",
          "Binge eating when bored, stressed or late at night",
          "Long-term condition poorly controlled because of missed treatment or checks",
          "Distracted crossing roads or near traffic",
          "Accidents at work from rushing or skipping safety steps",
          "Exploited, scammed or harmed by others after acting on impulse",
          "Suicide attempt made suddenly, during a crisis or after a setback"
        ],
        anchors: {
          0: "No more accidents, injuries, risky behaviour or police contact than most people.",
          1: "A few minor incidents, such as a speeding fine or small bumps, without injury or legal consequences.",
          2: "Repeated accidents or injuries, penalty points, risky substance use or impulsive risk-taking with real consequences.",
          3: "Marked impairment: serious injury, driving ban, harmful substance use, arrest or conviction, or impulsive self-harm or suicide attempts. Complete the risk step, and give DVLA advice if they drive."
        }
      },
      child: {
        ask: [
          "Did you have more accidents or injuries than other children? Any broken bones, stitches or hospital visits?",
          "Did you run into the road, climb dangerously or wander off?",
          "Did your parents feel they could never take their eyes off you?",
          "As a teenager, did you take risks such as drinking early, smoking, drugs or dares?",
          "Were there accidents on bikes or scooters, or later when learning to drive?",
          "Did you get into trouble with the police as a young person?",
          "Were you ever caught stealing, damaging property or playing with fire?"
        ],
        items: [
          "Many trips to A&E for cuts, bumps or broken bones",
          "Ran into the road without looking",
          "Climbed on roofs, high walls or trees beyond safe limits",
          "Wandered off in shops or crowded places",
          "Needed closer supervision than siblings to stay safe",
          "Burns or scalds from rushing or grabbing things",
          "Swallowed objects or got into medicines or chemicals",
          "Bike or scooter accidents from not paying attention",
          "Took dares that ended in injury",
          "Started smoking, drinking or using cannabis in the early teens",
          "Got drunk or high to dangerous levels as a teenager",
          "Shoplifting or stealing on impulse",
          "Damaged property or played with fire",
          "Cautioned, arrested or involved with youth justice services",
          "Fights that led to injury or police involvement",
          "Early sexual risk-taking or teenage pregnancy",
          "Went off with strangers or older peers without telling anyone",
          "Accidents when learning to drive or soon after passing",
          "Injuries from rough play with siblings or friends",
          "Broke the same safety rules despite repeated warnings",
          "Ran away or stayed out all night",
          "Social services or police involved because of risky behaviour",
          "Self-harm on impulse during teenage crises",
          "Fell from furniture, stairs or play equipment more than other children",
          "Copied dangerous stunts from television or online videos"
        ],
        anchors: {
          0: "No more accidents or risk-taking than other children.",
          1: "A few more bumps and scrapes than peers, without serious injury.",
          2: "Frequent injuries, near misses or risky behaviour that needed close supervision, or early substance use.",
          3: "Marked impairment: serious or repeated injuries, police or youth justice involvement, or dangerous substance use. Consider safeguarding."
        }
      }
    }
  ],

  onset: {
    intro: "DSM-5-TR criterion B needs several inattentive or hyperactive-impulsive symptoms before age 12. It does not need a childhood diagnosis, the full symptom count, or impairment before 12. ICD-11 asks for evidence of significant symptoms before 12, and notes that some people first come to attention later, often when demands outstrip their ability to compensate. Establish the course as well as the start: ADHD symptoms are trait-like and persistent rather than episodic, although they can fluctuate through the day (AQAS 2024). NICE NG87 1.3.3 advises against excluding someone only because the time of onset is uncertain, while ICD-11 advises caution when childhood symptoms cannot be corroborated. Use the memory aids and collateral to build a picture across the school years.",
    ask: [
      "Have these difficulties always been part of you, or can you remember a time before them?",
      "What is the earliest age you remember having trouble with attention, restlessness or acting without thinking?",
      "Were they there before you started secondary school, at around 11 or 12?",
      "What were you like at primary school? Can you picture a particular classroom or teacher?",
      "What did your family say you were like as a toddler and before you started school?",
      "Was there ever a time when the problems eased off, or went away completely? What was different then?",
      "Did anything change around the time they started or got worse, such as a move, a loss, an illness, a head injury, or starting alcohol or drugs?",
      "When did other people first notice or comment on these problems? Who was it?",
      "Did problems become more obvious at a particular stage, such as secondary school, university, your first job or becoming a parent? What changed in the demands on you?",
      "Who or what helped you cope as a child, such as a strict school, small classes or a parent who organised everything?",
      "Were you ever seen by a school nurse, educational psychologist, paediatrician or child mental health service?",
      "Did anyone suggest ADHD, dyslexia or another explanation when you were young?",
      "Have you had the same kind of difficulties through your teens and adult life?",
      "Are the difficulties there most of the time, or do they come and go in spells lasting weeks or months?",
      "If you have had depression, anxiety, or problems with alcohol or drugs, were the attention problems there before that started, and did they stay when it got better?",
      "Do any of your parents, brothers or sisters, or your children have similar difficulties?",
      "What did your first school reports say?",
      "If I asked the person who brought you up what you were like at about eight, what would they say?"
    ],
    memoryAids: [
      "School reports from primary and secondary school: read the teacher comments, not only the grades.",
      "A school-year timeline, one year at a time. England and Wales: Reception, Year 2, Year 4, Year 6, then Year 7, Year 9, Year 11. Scotland: P1 to P7, then S1 to S4. Northern Ireland: P1 to P7, then Year 8 to Year 12.",
      "Life landmarks: house moves, teachers' names, a favourite class, a sibling's birth, a memorable holiday.",
      "Childhood photos and home videos: was the person usually on the move, mid-mischief, or apart from the group?",
      "Comparison with brothers and sisters: who was told off more, who lost things, who needed more help?",
      "Typical punishments and how often: kept in at break, detentions, lines, sent out of class, grounded, privileges removed.",
      "Nicknames from family, teachers or other children, such as dreamer, chatterbox or whirlwind.",
      "Family stories that are still retold, such as getting lost, breaking things or a dramatic accident.",
      "The Personal Child Health Record (Red Book), GP letters and hospital records of injuries or developmental checks, if kept.",
      "Letters home from school, behaviour charts, home-school diaries or reward sticker charts.",
      "Old exercise books, projects or certificates: messy handwriting, unfinished work, effort comments.",
      "A parent, older sibling or relative writing down their own memories before the appointment.",
      "Everyday scenes from primary school: getting ready in the morning, the walk to school, homework time, bedtime.",
      "Clubs and activities joined and dropped, and the reasons why.",
      "Reports from earlier assessments: educational psychology, speech and language therapy, CAMHS or paediatrics."
    ],
    lateOnset: [
      "If onset was clearly after 12 with no childhood evidence, look hard for another explanation before diagnosing ADHD. ICD-11 notes that acute or abrupt onset in adolescence or adulthood should raise the possibility of another cause, such as emerging psychosis or bipolar disorder. If symptoms before 12 are clearly absent, DSM-5-TR criterion B is not met: record other specified ADHD only if impairing symptoms remain and nothing explains them better. If onset is merely uncertain, record the uncertainty and review over time rather than forcing a conclusion.",
      "Substances: cannabis, stimulants, alcohol and withdrawal can all cause inattention and restlessness. Check which came first and whether symptoms persist when the person is not intoxicated or withdrawing, ideally over sustained abstinence (ICD-11 CDDR).",
      "Depression and anxiety: concentration problems that began with, and rise and fall with, a mood or anxiety episode point to that disorder rather than ADHD. Count them towards ADHD only if present since childhood and persisting after the episode resolves (ICD-11 CDDR).",
      "Trauma: symptoms that began after abuse, assault or another traumatic event may reflect PTSD or complex PTSD, with hyperarousal, dissociation and poor concentration (RCPsych CR235; ICD-11 CDDR notes that trauma and grief can produce ADHD-like symptoms).",
      "Head injury and neurological illness: a clear change after a brain injury, encephalitis, stroke or the start of epilepsy suggests an acquired cause; ICD-11 excludes symptoms due to a disease of the nervous system.",
      "Sleep: shift work, insomnia, sleep apnoea, sleep deprivation from caring for a baby, or a delayed sleep pattern can all produce adult-onset inattention (ICD-11 CDDR; AADPA 2022).",
      "Medical causes and medicines: thyroid disease and anaemia (AADPA 2022), menopause and post-viral illness (clinical practice), and medicines such as carbamazepine, valproate, levetiracetam, bronchodilators, decongestants, thyroid replacement or high caffeine intake (ICD-11 CDDR; AADPA 2022).",
      "The late-onset debate: in the Dunedin cohort, about 90% of adults who met ADHD criteria at 38 had not had ADHD in childhood (Moffitt 2015). The finding is contested and has not changed the criteria.",
      "In the MTA comparison group (children without ADHD followed to about 25 with repeated multi-informant assessments), about 95% of those who first screened positive for late-onset ADHD were excluded on full review. Symptoms most often occurred only during heavy substance use, or reflected another disorder or non-impairing ups and downs in concentration. No adult onset was found without a complex psychiatric history (Sibley 2018, cited in Kooij 2019).",
      "In a population cohort, most apparent late-onset cases had high ADHD scores at some point in childhood, so a single measure at 12 had misclassified them (Cooper 2018, cited in Kooij 2019). Look for subthreshold childhood symptoms hidden by ability, structure or support, and fully assess impairment, psychiatric history and substance use in any apparent later onset (Kooij 2019)."
    ],
    pitfalls: [
      "Confusing the onset of impairment with the onset of symptoms. Impairment often starts when support falls away (secondary school, university, first job, parenthood), while the symptoms were there earlier.",
      "Accepting 'I was fine at school' at face value. Ask about effort, support and structure: high ability or a strict, small or very supportive school can hide symptoms (Kooij 2019).",
      "Relying on the person's recall alone. Adults may under- or over-report their childhood, and recall of onset often disagrees between sources (Kooij 2019).",
      "Asking leading questions such as 'You were always like this, weren't you?'. Ask open questions and for specific, datable memories, especially if the person has read a lot about ADHD.",
      "Treating the lack of a childhood diagnosis as evidence against ADHD. ADHD is under-recognised, particularly in girls and women (NICE NG87 1.2.2) and in people with mainly inattentive symptoms.",
      "Requiring the full symptom count before 12. DSM-5-TR asks only for several symptoms before 12.",
      "Using the old age-7 rule. DIVA 2.0 was written for DSM-IV and asks about onset before 7; DSM-5-TR and ICD-11 use 12.",
      "Missing an episodic course. Symptoms that come and go with mood episodes, substance use or stress suggest another disorder; ADHD is trait-like, although symptoms can fluctuate through the day (AQAS 2024).",
      "Excluding the diagnosis only because onset is uncertain. NICE NG87 1.3.3 advises against this. Record the evidence, its gaps and how you weighed them.",
      "Overlooking early developmental contacts (speech and language therapy, occupational therapy, health visitor or paediatrics) and family history, which support an early neurodevelopmental picture (RCPsych CR235)."
    ]
  },

  duration: {
    ask: [
      "Have these difficulties been there most of the time for at least the last six months?",
      "Is this how you usually are, or is it different from how you were a year or two ago?",
      "In the last six months, were there weeks when the problems were not there at all? What was happening then?",
      "Do the problems change with stress, sleep, mood, alcohol or drugs, or are they there regardless?",
      "If you take or have taken ADHD medicine, what are you like when you are not taking it?"
    ]
  },

  supplement: {
    ia: {
      adult: "Thinking about all the attention and organisation problems we have just talked about: are they clearly more frequent or more severe for you than for most people of your age and background?",
      child: "And as a child, between about 5 and 12: were these attention problems clearly more frequent or more severe for you than for other children of the same age?"
    },
    hi: {
      adult: "Thinking about the restlessness and impulsive behaviour we have just talked about: is this clearly more frequent or more intense for you than for most people of your age and background?",
      child: "And as a child, between about 5 and 12: were you clearly more restless or impulsive, or more often so, than other children of the same age?"
    }
  },

  collateral: {
    intro: "Observer reports are part of the basis for diagnosis in NICE NG87 1.3.1. Aim for at least one person who knew the patient as a child (usually a parent or older sibling), one who knows them well now (partner or close friend), and school reports (AQAS 2024). Speak to informants separately where possible, ask for specific examples rather than general impressions, and rate how far each source supports the diagnosis. Missing collateral should not by itself block a diagnosis, but record why it is missing and weigh the rest of the evidence carefully (RCPsych CR235; ICD-11 CDDR).",
    rating: [
      { v: 0, l: "None or little support", d: "The source does not describe the symptoms, or describes only isolated, ordinary behaviour. Also use 0 when the source contradicts the patient's account." },
      { v: 1, l: "Some support", d: "Describes some symptoms or some impairment, or supports the account in general terms with few specific examples, or covers only part of the relevant period." },
      { v: 2, l: "Clear support", d: "Gives specific, independent examples of several symptoms and their impact, consistent with the patient's account, across settings or years." }
    ],
    parent: {
      intro: "For a parent, step-parent, older sibling or other adult who knew the patient between about 5 and 12. Ask about childhood first, then the teenage years. Encourage specific memories and comparisons with brothers, sisters or classmates. Remember that a parent may have ADHD themselves and may see the behaviour as normal.",
      questions: [
        { k: "p1", q: "What were they like as a toddler and before starting school: sleep, activity level, temper?" },
        { k: "p2", q: "Did they walk and talk at the usual ages? Was any extra help needed?" },
        { k: "p3", q: "Compared with brothers, sisters or other children, how active were they? Could they sit still for meals, stories or car journeys?" },
        { k: "p4", q: "Did they seem to listen when you spoke to them, or did you have to repeat things many times?" },
        { k: "p5", q: "Could they follow a few instructions in a row, such as fetching their shoes, coat and bag?" },
        { k: "p6", q: "How did homework go? How long did it take and how much help did they need?" },
        { k: "p7", q: "Did they often lose things such as coats, PE kit, reading books or toys? Were their bedroom and school bag chaotic?" },
        { k: "p8", q: "Were they forgetful in daily routines, needing more reminders than other children?" },
        { k: "p9", q: "Did they make careless mistakes in schoolwork even when they knew how to do it?" },
        { k: "p10", q: "Did they flit from one activity to another without finishing?" },
        { k: "p11", q: "Did they daydream or seem to be in a world of their own?" },
        { k: "p12", q: "Were they always on the go, climbing on things or running when they should have walked?" },
        { k: "p13", q: "Did they talk a lot, interrupt or blurt things out?" },
        { k: "p14", q: "Could they wait their turn in games, queues or conversations?" },
        { k: "p15", q: "Did they act without thinking, for example running into the road or grabbing things?" },
        { k: "p16", q: "What did teachers say at parents' evenings and in school reports?" },
        { k: "p17", q: "Were they ever kept in, put on report or excluded from school?" },
        { k: "p18", q: "How did they get on with other children? Were they invited to parties and to play?" },
        { k: "p19", q: "Did they have more accidents or injuries than other children?" },
        { k: "p20", q: "How did they react when told no, or when things went wrong? How quickly did they calm down?" },
        { k: "p21", q: "At what age did you first notice any of these things? Were they there before age 12?" },
        { k: "p22", q: "Did anything happen in their childhood that might explain changes in behaviour, such as a loss, a move, an illness or upsetting events?" },
        { k: "p23", q: "Were they ever seen by a doctor, school nurse, educational psychologist or child mental health service about behaviour, learning or attention?" },
        { k: "p24", q: "Did things change when they moved to secondary school or as a teenager? How?" },
        { k: "p25", q: "Did they seem unusually anxious, low or withdrawn, or have very intense interests or fixed routines?" },
        { k: "p26", q: "Does anyone else in the family have similar difficulties?" },
        { k: "p27", q: "Looking at them as an adult now, how do these difficulties affect their life?" },
        { k: "p28", q: "Have these difficulties been there throughout, or were there periods when they were much better or much worse?" },
        { k: "p29", q: "Is there anything else you think I should know?" },
        { k: "p30", q: "As a teenager, did they take more risks than their friends, such as drinking or drugs, fights, or trouble with the police?" }
      ]
    },
    partner: {
      intro: "For a partner, close friend, housemate or colleague who knows the patient's adult life well, ideally for at least a year. Ask about the last six months, and how typical this is of the person over the time they have known them. Partners often notice the effect on others more than the patient does.",
      questions: [
        { k: "r1", q: "How long have you known them, and how much time do you spend together?" },
        { k: "r2", q: "In everyday life, what do you notice about their attention and concentration?" },
        { k: "r3", q: "Do they seem not to listen when you speak to them, or drift off mid-conversation?" },
        { k: "r4", q: "How organised are they with plans, bills, paperwork and the home?" },
        { k: "r5", q: "Do they lose or misplace things such as keys, phone or wallet? How often?" },
        { k: "r6", q: "Do they forget appointments, arrangements or things they promised to do?" },
        { k: "r7", q: "Do they start jobs and leave them unfinished?" },
        { k: "r8", q: "Do they put off tasks that need sustained effort, such as forms or tax returns?" },
        { k: "r9", q: "Are they easily sidetracked by noises, their phone or their own thoughts?" },
        { k: "r10", q: "Do they fidget, pace or find it hard to sit through a film, a meal or a meeting?" },
        { k: "r11", q: "Do they seem restless or unable to relax, even on holiday?" },
        { k: "r12", q: "Do they talk a lot, interrupt or finish other people's sentences?" },
        { k: "r13", q: "Do they find waiting hard, for example in queues or traffic?" },
        { k: "r14", q: "Do they make impulsive decisions, such as sudden purchases, quitting jobs or risky actions?" },
        { k: "r15", q: "How do they handle frustration? Do they lose their temper quickly and calm down quickly?" },
        { k: "r16", q: "How do these things affect your relationship and the running of the household?" },
        { k: "r17", q: "How do they affect their work, money, friendships or driving?" },
        { k: "r18", q: "Have they been like this the whole time you have known them, or did it start or get worse at some point? What has their family told you about them as a child?" },
        { k: "r19", q: "Do the problems come and go with mood, stress, sleep, alcohol or drugs, or are they always there?" },
        { k: "r20", q: "Have you noticed spells of very high energy with little need for sleep, or of low mood lasting weeks?" },
        { k: "r21", q: "What do they, you or others do to help them keep on track?" },
        { k: "r22", q: "How do they compare with other people of the same age that you know?" },
        { k: "r23", q: "Is there anything that worries you, such as their safety, drinking or mood?" },
        { k: "r24", q: "Do they make careless mistakes, for example in messages, forms or at work, even on things they know how to do?" },
        { k: "r25", q: "How do they sleep? Do they snore loudly, stop breathing or gasp in their sleep, or seem very sleepy in the day?" }
      ]
    },
    school: {
      intro: "School reports are independent, written at the time and often still available decades later. Read the teacher comments, not just the grades, and look for the same themes across different years and teachers. The phrases below are typical of UK reports on pupils with attention problems. Several such comments across years give good support; a single comment gives little.",
      lookFor: [
        "Could achieve so much more if they concentrated",
        "Easily distracted, and distracts others",
        "Needs to listen more carefully to instructions",
        "Often daydreams; seems to be in a world of their own",
        "Work is often left unfinished",
        "Must try harder to stay in their seat",
        "Chatters too much in lessons",
        "Calls out instead of putting their hand up",
        "Careless mistakes spoil otherwise good work",
        "Presentation is messy and disorganised",
        "Frequently forgets homework, books or kit",
        "Needs constant reminders to stay on task",
        "Very able, but does not apply themselves",
        "Rushes work just to get it finished",
        "Finds it hard to wait their turn",
        "Lively and full of energy; always on the go",
        "Can be impulsive and acts before thinking",
        "Effort is inconsistent, with good days and bad days",
        "Struggles to work independently without adult support",
        "Homework is often late or missing",
        "Has collected a number of behaviour points or detentions this term",
        "Needs to take more responsibility for organising themselves",
        "Works well one-to-one but loses focus in the whole class",
        "Must learn to listen to others without interrupting"
      ],
      caution: [
        "Comments such as chatty or could try harder appear in many reports of children without ADHD. Look for consistent themes across several years and teachers.",
        "A lack of comments does not exclude ADHD. Quiet, inattentive pupils, often girls, draw few remarks, and some reports are brief or formulaic.",
        "Good grades do not rule out ADHD. Able pupils, or those in highly structured schools, may achieve while comments still describe attention problems.",
        "Behaviour comments can reflect other problems: learning difficulties, anxiety, trauma, stress at home, autism, or hearing or vision problems. Check what was happening at the time.",
        "Problems confined to one subject, such as reading or maths, suggest a specific learning difficulty rather than ADHD (ICD-11 CDDR).",
        "Comments that appear suddenly in one year may reflect events at the time, such as a bereavement, family break-up or bullying.",
        "Reports from age 12 onwards can show persistence but cannot on their own establish onset before 12; seek primary school reports where possible.",
        "Ask to see the original reports rather than relying on the patient's summary of them."
      ]
    },
    discrepancy: [
      "For current symptoms in adulthood, some research shows the patient is the best informant (Kooij 2008, cited in Kooij 2019). Partners and family still add valuable information on severity and daily impact.",
      "For childhood, a parent or older relative is usually the better source, especially for visible behaviour such as hyperactivity and impulsivity (clinical practice). Collateral matters most when the person's own childhood recall is poor, for example with high ability, a very structured upbringing or mainly inattentive symptoms (Kooij 2019).",
      "Do not add up or average accounts. Ask each source for specific examples, then compare like with like: the same symptom, in the same setting, over the same period.",
      "When the patient reports more than informants, consider effective masking, informants who see only part of the person's life, and informants who have normalised the behaviour or have ADHD themselves (Young et al. 2020, UKAP consensus on females with ADHD). Also consider over-reporting and check the validity step.",
      "When informants report more than the patient, remember that many adults have limited insight into how their symptoms affect others and report fewer problems than those around them see (Kooij 2019). Give weight to concrete examples.",
      "Weigh each informant's knowledge and position: how often they saw the person and in which settings, their own stress or mental health, any conflict with the patient, and whether they hope for a particular outcome.",
      "When two accounts conflict, look for a third source: school reports, health or social care records, another relative or a work appraisal.",
      "Disagreement about one or two symptoms matters less than disagreement about the overall pattern. Base the decision on the weight of evidence across all sources, not on any single account.",
      "Record each discrepancy, the likely reasons and how you weighed it. AQAS 2024 asks reports to discuss how missing or contradictory information affects the conclusion.",
      "If the patient and informants disagree sharply about childhood and no records exist, do not settle the conflict by default in either direction. Weigh who was best placed to observe, seek further evidence, and record onset as unresolved. NICE NG87 1.3.3 advises against excluding on uncertain onset alone; ICD-11 advises caution without corroboration."
    ],
    noInformant: [
      "Ask the patient and family to search for school reports at home. Schools and local authorities often keep pupil files only until the person is in their mid-20s, so ask early if the patient is young.",
      "Seek other old records: GP records (which usually follow the person and may hold childhood letters), hospital notes on injuries or developmental concerns, the Red Book if kept, and educational psychology, speech and language therapy, CAMHS or youth justice reports.",
      "Look for another person who knew them as a child: an older sibling, aunt or uncle, grandparent, family friend, childhood friend or former teacher.",
      "For adult life, a long-standing friend, housemate or trusted colleague can describe current functioning when there is no partner. Work appraisals and college feedback can help too.",
      "Offer a written account or an informant rating scale completed at home when an interview is not possible (AQAS 2024 lists both as optional).",
      "Use the patient's own recall with care: ask for specific, datable memories anchored to the school-year timeline. Self-report alone carries more risk of under- or over-reporting.",
      "Do not exclude ADHD only because no informant is available when this is outside the patient's control (RCPsych CR235; NICE NG87 1.3.3 on uncertain onset). Document the gap; ICD-11 advises making an adult diagnosis with caution without corroboration.",
      "If the picture is still unclear, defer the decision: arrange a further appointment once records arrive, or review over time, rather than forcing a conclusion."
    ]
  }
});
