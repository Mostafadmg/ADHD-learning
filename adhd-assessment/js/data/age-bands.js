/* ageBands: settings for each age group (build contract section 1). AA.diagnosis.band(a) picks the band from
   patient.age (never stored): under6 (<6), child (6-11), teen (12-16), y17 (17), adult (18+ or age missing).
   Views read a band with AA.diagnosis.bandInfo(a).

   Fields per band
     label, short, noun        names shown in the workspace
     ageMin, ageMax            the band's ages (inclusive)
     periods                   record keys in use: 'adult' = now (last 6 months) at every age; 'child' = before age 12.
                               For 6-11 the before-12 period IS the current period, so only 'adult' is used.
     periodLabels              labels for those keys
     informants                collateral keys shown (collateral.parent / .school / .partner; 'self' = collateral.self,
                               the young person's own view, NICE NG87 1.3.6)
     screen, screenCore        tool ids for the Screening step (information-only tools allowed: the result is entered)
     comorbid, comorbidCore    tool ids for the Co-occurring conditions step
                               Young bands have empty core lists: services choose their own scales, and the step counts
                               as done when any listed tool has a result. Views drop tools outside the exact age
                               (tool ageMin/ageMax), so a band list may hold tools that fit only part of the band.
     ddxCore                   differentials that must be reviewed (criterion E and step progress). Ids not yet loaded
                               (js/data/ddx-young.js: odd, conduct, attach, dld, fasd, relage, env, osa_child, sepanx) are
                               skipped by the engine.
     impairmentLabels          labels for the impairment domain ids (work, relationships, social, leisure, selfimage,
                               daily, safety)
     consent, consentText      consent model: 'parent_assent' | 'gillick_or_parent' | 'capacity_16' | 'adult'.
                               Consent depends on age (under 16, or 16-17), not on the band: 16 sits in the teen band.
     reportTitle, planGroups   report heading (every band has one); order of plan groups, an array of group-name
                               strings (history.js plan items use these group names)
     note                      one-line banner in the setup step
     src                       sources (shown in a closed Sources disclosure)

   Consent law (research brief 25 Oct 2026, section 3): Gillick competence under 16 in England, Wales and Northern
   Ireland; Age of Legal Capacity (Scotland) Act 1991 s2(4) in Scotland; from 16, Family Law Reform Act 1969 s8 and the
   Mental Capacity Act 2005 (presumed capacity) in England and Wales, the Age of Legal Capacity (Scotland) Act 1991 s1 and
   the Adults with Incapacity (Scotland) Act 2000 in Scotland, and the Age of Majority Act (Northern Ireland) 1969 in
   Northern Ireland (GMC 0-18 years paragraph 28 and footnote 8). Fraser guidelines apply to contraception and sexual
   health only and are never cited for ADHD. */
(function (AA) {
  'use strict';

  /* Differentials every child assessment must review (6-11), then the extra ones for teenagers.
     osa_child (ddx-young.js) is the child-framed sleep-disordered breathing entry; the adult osa entry (NICE NG202,
     over 16s) stays in the full list. */
  var DDX_CHILD = ['odd', 'conduct', 'attach', 'dld', 'fasd', 'relage', 'env',
    'asd', 'sld', 'idd', 'dcd', 'tics', 'dep', 'gad', 'social', 'ptsd', 'osa_child', 'insomnia', 'sensory', 'epilepsy',
    'normal', 'gifted'];
  var DDX_TEEN = DDX_CHILD.concat(['bip', 'sud_cannabis', 'sud_alcohol', 'eating', 'dsps', 'gaming']);

  /* Plan group order for young people (plan items in history.js carry group and ages). */
  var PLAN_YOUNG = ['Safety', 'After diagnosis', 'Support for parents and carers', 'School and education',
    'Before any medication', 'Other needs', 'If ADHD not diagnosed'];

  var PERIODS_YOUNG = { adult: 'Now (last 6 months)', child: 'Before age 12' };

  var CONSENT_UNDER16 = 'Under 16: a young person who understands what the assessment involves can consent for themselves ' +
    '(Gillick competence). If they cannot, a person with parental responsibility consents and the young person gives their ' +
    'assent. One person with parental responsibility is usually enough. In Scotland the Age of Legal Capacity (Scotland) ' +
    'Act 1991 s2(4) applies instead; it names a medical practitioner, so a pharmacist-led assessment there needs local ' +
    'policy or legal advice. Do not use the Fraser guidelines: they cover contraception and sexual health only.';
  var CONSENT_16 = 'From 16: the young person is presumed to have capacity and consents for themselves (Mental Capacity Act ' +
    '2005; Family Law Reform Act 1969 s8 in England and Wales). Involve a parent or carer as the young person agrees. If ' +
    'they lack capacity for this decision, follow the Mental Capacity Act and local policy, involving those with parental ' +
    'responsibility. The Mental Capacity Act 2005 and the Family Law Reform Act 1969 apply in England and Wales only. In ' +
    'Scotland a 16-year-old has full legal capacity (Age of Legal Capacity (Scotland) Act 1991 s1), and a 16- or ' +
    '17-year-old who lacks capacity is treated under the Adults with Incapacity (Scotland) Act 2000. In Northern Ireland, ' +
    'consent at 16 and 17 rests on the Age of Majority Act (Northern Ireland) 1969; if capacity is lacking, a parent can ' +
    'consent in the young person\'s best interests, and local policy applies.';
  /* Sources for the rule from 16 in each UK nation (teen and y17 bands). */
  var SRC_CONSENT_16 = [
    'Mental Capacity Act 2005; Family Law Reform Act 1969 s8 (both England and Wales only)',
    'Age of Legal Capacity (Scotland) Act 1991 s1 (full legal capacity at 16); Adults with Incapacity (Scotland) Act 2000',
    'Age of Majority Act (Northern Ireland) 1969',
    'GMC 0-18 years: guidance for all doctors, paragraph 28 and footnote 8 (16 and 17-year-olds who lack capacity, by UK nation)'
  ];
  var SRC_CONSENT = [
    'Gillick v West Norfolk and Wisbech AHA [1986] (consent under 16)',
    'GMC 0-18 years: guidance for all doctors, paragraphs 24-32 (capacity, parental responsibility, refusal)',
    'Age of Legal Capacity (Scotland) Act 1991 s2(4)',
    'NSPCC Learning: Gillick competence and Fraser guidelines (Fraser applies to contraception and sexual health only)'
  ];

  AA.add('ageBands', {

    /* ------------------------------------------------------------------ under 6: stop and refer */
    under6: {
      label: 'Under 6', short: 'Under 6', noun: 'child', ageMin: 0, ageMax: 5,
      stop: true,
      note: 'Refer to a service with expertise in ADHD in young children. Under 5, NICE advises ADHD-focused group ' +
        'parent training first, specialist advice, and no medication without a second specialist opinion. At 5, every ' +
        'ADHD medicine is off-label. This workspace covers ages 6 and over.',
      reportTitle: 'Child under 6: referral note (no ADHD assessment in this workspace)',
      planGroups: PLAN_YOUNG.slice(),
      src: ['NICE NG87 1.5.7-1.5.9 (under 5); 1.7.7 off-label at 5']
    },

    /* ------------------------------------------------------------------ child 6-11 */
    child: {
      label: 'Child (6 to 11)', short: 'Child', noun: 'child', ageMin: 6, ageMax: 11,
      periods: ['adult'],
      periodLabels: PERIODS_YOUNG,
      informants: ['parent', 'school', 'self'],
      screen: ['conners4', 'snap4', 'vanderbilt', 'sdq', 'adhdrs5', 'wfirsp'],
      screenCore: [],
      comorbid: ['aq10child', 'scq', 'rcads', 'mfq', 'phqa', 'wsr2'],
      comorbidCore: [],
      ddxCore: DDX_CHILD.slice(),
      impairmentLabels: {
        work: 'School and learning', relationships: 'Family and home', social: 'Friends and peers',
        leisure: 'Play and activities', selfimage: 'Self-esteem', daily: 'Self-care and independence',
        safety: 'Accidents and risk-taking'
      },
      consent: 'parent_assent',
      consentText: 'A person with parental responsibility consents, and the child gives their assent after an explanation ' +
        'they understand. ' + CONSENT_UNDER16,
      reportTitle: 'ADHD assessment (child, 6–11): draft report',
      planGroups: PLAN_YOUNG.slice(),
      note: 'Main sources are the parent or carer and the school. Hear the child\'s own view too, in a way that suits their age.',
      src: [
        'DSM-5-TR criteria A-E (paraphrased): 6 symptoms in a domain under 17; several symptoms before 12',
        'NICE NG87 1.3.5 (consider ADHD at all ages, with criteria adjusted for age-appropriate behaviour) and 1.3.6 (the child\'s own view)'
      ].concat(SRC_CONSENT)
    },

    /* ------------------------------------------------------------------ teen 12-16 */
    teen: {
      label: 'Young person (12 to 16)', short: 'Young person', noun: 'young person', ageMin: 12, ageMax: 16,
      periods: ['adult', 'child'],
      periodLabels: PERIODS_YOUNG,
      informants: ['parent', 'school', 'self'],
      screen: ['conners4', 'snap4', 'vanderbilt', 'sdq', 'adhdrs5', 'wfirsp', 'wfirs'],
      screenCore: [],
      comorbid: ['phqa', 'mfq', 'rcads', 'crafft', 'aq10adol', 'aq10', 'scq', 'wsr2'],
      comorbidCore: [],
      ddxCore: DDX_TEEN.slice(),
      impairmentLabels: {
        work: 'School and learning', relationships: 'Family and home', social: 'Friends and peers',
        leisure: 'Activities and free time', selfimage: 'Self-esteem', daily: 'Self-care and independence',
        safety: 'Accidents and risk-taking'
      },
      consent: 'gillick_or_parent',
      consentText: CONSENT_UNDER16 + ' At 16 the rule for 16 and 17 applies: ' + CONSENT_16,
      reportTitle: 'ADHD assessment (young person, 12–16): draft report',
      planGroups: PLAN_YOUNG.slice(),
      note: 'Talk with the young person and a parent or carer, and get the school\'s view. See the young person on their own for part of the time.',
      src: [
        'DSM-5-TR criteria A-E (paraphrased): 6 symptoms in a domain under 17; several symptoms before 12',
        'NICE NG87 1.3.5 and 1.3.6 (the young person\'s own view)',
        'Clinical practice: seeing a young person on their own for part of the assessment'
      ].concat(SRC_CONSENT_16, SRC_CONSENT)
    },

    /* ------------------------------------------------------------------ 17 */
    y17: {
      label: 'Young person (17)', short: 'Age 17', noun: 'young person', ageMin: 17, ageMax: 17,
      periods: ['adult', 'child'],
      periodLabels: PERIODS_YOUNG,
      informants: ['parent', 'school', 'self'],
      screen: ['conners4', 'snap4', 'sdq', 'adhdrs5', 'wfirsp', 'wfirs'],
      screenCore: [],
      comorbid: ['phqa', 'mfq', 'rcads', 'crafft', 'aq10', 'scq', 'wsr2'],
      comorbidCore: [],
      ddxCore: DDX_TEEN.slice(),
      impairmentLabels: {
        work: 'School, college or work', relationships: 'Family and home', social: 'Friends and peers',
        leisure: 'Activities and free time', selfimage: 'Self-esteem', daily: 'Self-care and independence',
        safety: 'Driving, accidents and risk-taking'
      },
      consent: 'capacity_16',
      consentText: CONSENT_16,
      reportTitle: 'ADHD assessment (young person, 17): draft report',
      planGroups: PLAN_YOUNG.slice(),
      note: 'The young person usually consents for themselves. Involve a parent or carer as they agree, get the school\'s or college\'s view, and plan the move to adult services.',
      src: [
        'DSM-5-TR criteria A-E (paraphrased): 5 symptoms in a domain from 17; several symptoms before 12',
        'GMC 0-18 years paragraph 25 (capacity presumed at 16)',
        'NICE NG87 1.1.4-1.1.5 (reassess at school-leaving age; plan transition, usually complete by 18) and NICE NG43 (transition to adult services)'
      ].concat(SRC_CONSENT_16)
    },

    /* ------------------------------------------------------------------ adult 18+ (also when age is missing) */
    adult: {
      label: 'Adult (18 and over)', short: 'Adult', noun: 'patient', ageMin: 18, ageMax: 120,
      periods: ['adult', 'child'],
      periodLabels: { adult: 'Adulthood (last 6 months)', child: 'Childhood (age 5 to 12)' },
      informants: ['parent', 'partner', 'school'],
      /* Same lists as AA.diagnosis.STEP_TOOLS (adults always use the engine's lists). */
      screen: ['asrs18', 'wurs25', 'wfirs', 'asrs5'],
      screenCore: ['asrs18', 'wurs25', 'wfirs'],
      comorbid: ['phq9', 'gad7', 'mdq', 'audit', 'dast10', 'aq10', 'pcl5', 'msibpd', 'stopbang'],
      comorbidCore: ['phq9', 'gad7', 'mdq', 'audit', 'dast10', 'aq10'],
      ddxCore: ['dep', 'bip', 'gad', 'ptsd', 'asd', 'bpd', 'sud_cannabis', 'sud_alcohol', 'osa', 'insomnia'],
      impairmentLabels: {
        work: 'Work and education', relationships: 'Partner and family', social: 'Friends and social contacts',
        leisure: 'Free time and hobbies', selfimage: 'Self-confidence and self-image', daily: 'Daily life, money and admin',
        safety: 'Driving, health and safety'
      },
      consent: 'adult',
      consentText: 'The adult consents for themselves. Capacity is presumed unless there is reason to doubt it (Mental Capacity Act 2005).',
      reportTitle: 'Adult ADHD assessment: draft report',
      planGroups: ['Safety', 'After diagnosis', 'Before any medication', 'Other needs', 'If ADHD not diagnosed'],
      note: 'Adult pathway: ask about the last 6 months and about childhood before 12, with informants and records where you can.',
      src: [
        'DSM-5-TR criteria A-E (paraphrased): 5 symptoms in a domain from 17; several symptoms before 12',
        'NICE NG87 1.3.1-1.3.3',
        'Mental Capacity Act 2005'
      ]
    }
  });
})(typeof window !== 'undefined' ? window.AA : globalThis.AA);
