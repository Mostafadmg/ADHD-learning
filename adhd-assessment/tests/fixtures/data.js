/* Small schema-complete fixture data for developing views before the real content exists.
   Loaded by tests/dev.html instead of js/data/*.js. Not clinical content. */
(function () {
  var opts4 = [{ v: 0, l: 'Not at all' }, { v: 1, l: 'Several days' }, { v: 2, l: 'More than half' }, { v: 3, l: 'Nearly every day' }];
  AA.add('tools', [
    { id: 'phq9', abbr: 'FX-SUM', name: 'Fixture sum scale', group: 'mood', stage: ['pre', 'comorbid'], who: 'Self-report', time: '2 min', ages: 'Adults', items_n: 3,
      purpose: 'Fixture.', when: 'Fixture.', how: 'Fixture.', interactive: true, instructions: 'Over the last 2 weeks, how often...', options: opts4,
      items: [{ n: 1, t: 'Item one' }, { n: 2, t: 'Item two' }, { n: 3, t: 'Item three (risk item)' }],
      scoring: { method: 'sum', bands: [{ min: 0, max: 2, label: 'Low', sev: 0 }, { min: 3, max: 5, label: 'Medium', sev: 2 }, { min: 6, max: 9, label: 'High', sev: 3 }], cutoff: { value: 3, text: 'Positive' }, flags: [{ item: 3, min: 1, level: 'urgent', text: 'Risk item endorsed.' }] },
      interpretation: ['Fixture interpretation.'], psychometrics: 'n/a', pitfalls: ['Fixture pitfall.'], adhdNotes: 'Fixture.', licence: 'Fixture', source: 'Fixture', url: 'https://example.org', file: null },
    { id: 'asrs18', abbr: 'FX-ASRS', name: 'Fixture ASRS-style', group: 'adhd-screen', stage: ['pre'], who: 'Self-report', time: '5 min', ages: 'Adults', items_n: 6,
      purpose: 'Fixture.', when: 'Fixture.', how: 'Fixture.', interactive: true, instructions: 'Rate the last 6 months.',
      options: [{ v: 0, l: 'Never' }, { v: 1, l: 'Rarely' }, { v: 2, l: 'Sometimes' }, { v: 3, l: 'Often' }, { v: 4, l: 'Very often' }],
      items: [1, 2, 3, 4, 5, 6].map(function (n) { return { n: n, t: 'ASRS-style item ' + n, part: 'A', threshold: n <= 3 ? 2 : 3, section: n === 1 ? 'Part A' : undefined }; }),
      scoring: { method: 'asrs18', partA: 4 }, interpretation: [], psychometrics: '', pitfalls: [], adhdNotes: '', licence: 'Fixture', source: 'Fixture', url: 'https://example.org', file: null },
    { id: 'wfirs', abbr: 'FX-WF', name: 'Fixture impairment scale', group: 'adhd-impairment', stage: ['pre'], who: 'Self-report', time: '10 min', ages: 'Adults', items_n: 4,
      purpose: 'Fixture.', when: 'Fixture.', how: '', interactive: true, instructions: 'Past month.',
      options: [{ v: 0, l: 'Never' }, { v: 1, l: 'Sometimes' }, { v: 2, l: 'Often' }, { v: 3, l: 'Very often' }, { v: 'na', l: 'n/a' }],
      items: [{ n: 1, t: 'Family a', section: 'Family' }, { n: 2, t: 'Family b' }, { n: 3, t: 'Work a', section: 'Work' }, { n: 4, t: 'Work b' }],
      scoring: { method: 'wfirs', domains: [{ id: 'family', label: 'Family', items: [1, 2] }, { id: 'work', label: 'Work', items: [3, 4] }], rule: { twos: 2, threes: 1 } },
      interpretation: [], psychometrics: '', pitfalls: [], adhdNotes: '', licence: 'Fixture', source: '', url: '', file: null },
    { id: 'diva5', abbr: 'FX-INFO', name: 'Fixture licensed interview', group: 'adhd-interview', stage: ['interview'], who: 'Clinician', time: '90 min', ages: 'Adults',
      purpose: 'Fixture.', when: 'Fixture.', interactive: false, items: [], scoring: null, interpretation: ['Fixture.'], psychometrics: 'Fixture.', pitfalls: [], adhdNotes: '', licence: 'Purchase required', source: 'Fixture', url: 'https://example.org', file: null }
  ]);
  var ex = function (p, n) { var a = []; for (var i = 1; i <= n; i++) a.push(p + ' example ' + i); return a; };
  var syms = [];
  ['ia', 'hi'].forEach(function (d) {
    for (var i = 1; i <= 9; i++) {
      var id = d + i;
      syms.push({ id: id, dim: d.toUpperCase(), codes: { dsm5: (d === 'ia' ? 'A1' : 'A2') + 'abcdefghi'[i - 1], diva: (d === 'ia' ? 'A' : 'H/I ') + i, asrs: [i] },
        title: (d === 'ia' ? 'Inattention' : 'Hyperactivity') + ' symptom ' + i, criterion: 'Fixture criterion paraphrase for ' + id + '.', adultForm: 'Fixture adult form.', why: 'Fixture why.',
        ask: { adult: 'Fixture adult question for ' + id + '?', child: 'And when you were at primary school?' },
        rephrase: ex('Rephrase', 8),
        examples: { adult: [{ ctx: 'work', label: 'Work', items: ex('Work', 6) }, { ctx: 'home', label: 'Home and household', items: ex('Home', 5) }, { ctx: 'relationships', label: 'Partner and family', items: ex('Partner', 4) }],
          child: [{ ctx: 'school', label: 'Classroom and schoolwork', items: ex('School', 5) }, { ctx: 'home', label: 'Home and family', items: ex('Child home', 4) }] },
        probes: ['frequency', 'severity', 'pervasive', 'duration', 'peers', 'impact', 'compensation'].map(function (k) { return { k: k, label: k, items: ex('Probe ' + k, 3) }; }),
        informant: { partner: ex('Partner question', 6), parent: ex('Parent question', 6), school: ex('Report phrase', 3) },
        counts: ex('Count rule', 5), notCount: ex('Do not count rule', 6),
        anchors: [{ score: 'yes', quote: '"Every single day."', why: 'Frequent and impairing.' }, { score: 'unsure', quote: '"Sometimes."', why: 'Unclear frequency.' }, { score: 'no', quote: '"Not really."', why: 'Not more than peers.' }],
        mimics: [{ ddx: 'dep', clue: 'Only during low mood.', ask: 'Was it there when your mood was fine?' }, { ddx: 'osa', clue: 'Daytime sleepiness.', ask: 'Do you snore?' }],
        special: { women: 'Fixture.', older: 'Fixture.', highIQ: 'Fixture.', sud: 'Fixture.', asd: 'Fixture.', culture: 'Fixture.' }, refs: ['Fixture'] });
    }
  });
  AA.add('symptoms', syms);
  var dom = function (id, label) { return { id: id, label: label, why: 'Fixture.', adult: { ask: ex('Ask', 4), items: ex(label, 8), anchors: { 0: 'None', 1: 'Mild', 2: 'Moderate', 3: 'Severe' } }, child: { ask: ex('Ask child', 4), items: ex(label + ' child', 6), anchors: { 0: 'None', 1: 'Mild', 2: 'Moderate', 3: 'Severe' } } }; };
  AA.add('impairment', {
    severity: [{ v: 0, l: 'None', d: 'No problems.' }, { v: 1, l: 'Mild', d: 'Minor.' }, { v: 2, l: 'Moderate', d: 'Clear.' }, { v: 3, l: 'Severe', d: 'Marked.' }],
    domains: [dom('work', 'Work and education'), dom('relationships', 'Partner and family'), dom('social', 'Social contacts'), dom('leisure', 'Free time and hobbies'), dom('selfimage', 'Self-confidence and self-image'), dom('daily', 'Daily life and money'), dom('safety', 'Driving, health and safety')],
    onset: { intro: 'Fixture.', ask: ex('Onset question', 8), memoryAids: ex('Memory aid', 4), lateOnset: ex('Late onset caution', 3), pitfalls: ex('Pitfall', 3) },
    duration: { ask: ex('Duration question', 4) },
    supplement: { ia: { adult: 'Do you have more of these attention problems than others your age?', child: 'Did you, as a child?' }, hi: { adult: 'Restless more than others?', child: 'As a child?' } },
    collateral: { intro: 'Fixture.', rating: [{ v: 0, l: 'None or little support', d: '' }, { v: 1, l: 'Some support', d: '' }, { v: 2, l: 'Clear support', d: '' }],
      parent: { intro: 'Fixture.', questions: [{ k: 'p1', q: 'Parent q1' }, { k: 'p2', q: 'Parent q2' }] }, partner: { intro: 'Fixture.', questions: [{ k: 'r1', q: 'Partner q1' }] },
      school: { intro: 'Fixture.', lookFor: ex('Report phrase', 10), caution: ['Fixture caution.'] }, discrepancy: ex('Discrepancy rule', 3), noInformant: ex('No informant option', 3) }
  });
  AA.add('history', [
    { id: 'dev', title: 'Development and early life', why: 'Fixture.', prompts: ex('Prompt', 5), items: [{ id: 'dev_preterm', t: 'Born preterm', flag: 'adhd' }, { id: 'dev_delay', t: 'Speech delay', flag: 'ddx', ddx: 'dep' }] },
    { id: 'sleep', title: 'Sleep', why: 'Fixture.', prompts: ex('Prompt', 5), items: [{ id: 'sl_snore', t: 'Loud snoring', flag: 'ddx', ddx: 'osa' }] }
  ]);
  AA.add('risk', { intro: 'Fixture risk intro.', items: [{ id: 'r_si', text: 'Current thoughts of ending life', short: 'Suicidal thoughts', level: 'urgent', action: 'Assess today.' }, { id: 'r_sg', text: 'Safeguarding concern', short: 'Safeguarding', level: 'high', action: 'Follow policy.' }, { id: 'r_drive', text: 'Driving accidents', short: 'Driving', level: 'note', action: 'Discuss DVLA.' }], actions: ['Fixture action'], ask: ex('Risk question', 3) });
  var ddx = function (id, name, group, core) {
    return { id: id, name: name, group: group, core: core, icd11: 'X', summary: 'Fixture summary.', prevalence: 'Fixture.', coexist: 'yes', coexistNote: '',
      overlap: ex('Overlap', 4), favoursADHD: ex('Favours ADHD', 4), favoursAlt: ex('Favours alternative', 5), ask: ex('Question', 10),
      features: [1, 2, 3, 4, 5, 6].map(function (i) { return { id: id + '_f' + i, t: name + ' feature ' + i, w: (i % 3) + 1 }; }),
      screen: id === 'dep' ? ['phq9'] : [], investigations: ['Fixture'], redFlags: ['Fixture'], decide: { better: 'Fixture.', both: 'Fixture.', next: 'Fixture.' }, pearls: ['Fixture'], refs: ['Fixture'] };
  };
  AA.add('ddx', [ddx('dep', 'Depression', 'mood', true), ddx('bip', 'Bipolar disorder', 'mood', true), ddx('osa', 'Obstructive sleep apnoea', 'sleep', false)]);
  AA.add('validity', { intro: 'Fixture validity intro.', indicators: [{ id: 'v_all18', t: 'Endorses almost every symptom at the maximum', w: 2, why: 'Fixture.' }, { id: 'v_vague', t: 'Cannot give concrete examples', w: 2, why: 'Fixture.' }],
    incentives: [{ id: 'v_exam', t: 'Seeking exam accommodations', why: 'Fixture.' }], consistency: ['Fixture check'], tests: [{ name: 'Fixture SVT', what: 'Fixture.', note: '' }], wording: ['Fixture wording.'], refs: ['Fixture'] });
  AA.add('plan', [{ id: 'pl_psychoed', group: 'After diagnosis', t: 'Fixture psychoeducation', src: 'Fixture' }, { id: 'pl_bp', group: 'Before any medication', t: 'Fixture baseline', src: 'Fixture' }, { id: 'pl_risk', group: 'Safety', t: 'Fixture safety', src: 'Fixture' }]);
  AA.add('pathway', [{ id: 'referral', n: 1, title: 'Referral', what: ['Fixture'], who: 'GP', tools: [], tips: ['Fixture'], sources: ['Fixture'] }, { id: 'pre', n: 2, title: 'Pre-assessment questionnaires', what: ['Fixture'], who: 'Patient', tools: ['asrs18', 'wfirs'], tips: [], sources: [] }]);
  AA.add('guidelines', [{ id: 'ng87', name: 'Fixture guideline', org: 'NICE', year: '2018', scope: 'Fixture', keyPoints: ['Fixture'], assessment: ['Fixture'], url: 'https://example.org' }]);
  AA.add('criteria', { dsm5: { intro: 'Fixture DSM intro.', A: { t: 'Criterion A', d: 'Fixture.' }, B: { t: 'B', d: 'Fixture.' }, C: { t: 'C', d: 'Fixture.' }, D: { t: 'D', d: 'Fixture.' }, E: { t: 'E', d: 'Fixture.' }, presentations: ['Fixture'], specifiers: ['Fixture'] }, icd11: { intro: 'Fixture.' }, diva2: { intro: 'Fixture.' }, changes: ['Fixture'] });
  AA.add('glossary', [{ term: 'Collateral history', def: 'Fixture.' }, { term: 'Criterion E', def: 'Fixture.' }]);
  AA.add('learn', [{ id: 'm1', n: 1, title: 'Fixture module', minutes: 10, summary: 'Fixture.', objectives: ['Fixture'], sections: [{ h: 'Section one', html: '<p>Fixture <strong>content</strong>.</p>' }], keyPoints: ['Fixture'], pitfalls: ['Fixture'],
    quiz: [{ q: 'Q1?', options: ['a', 'b', 'c', 'd'], a: 1, why: 'Because.' }, { q: 'Q2?', options: ['a', 'b', 'c', 'd'], a: 2, why: 'Because.' }, { q: 'Q3?', options: ['a', 'b', 'c'], a: 0, why: 'Because.' }], refs: ['Fixture'] }]);
  AA.add('cases', [{ id: 'c1', title: 'Fixture case', patient: '29-year-old', tags: ['fixture'], difficulty: 1, referral: 'Fixture referral.',
    stages: [{ title: 'History', html: '<p>Fixture.</p>', q: { q: 'What next?', options: ['a', 'b', 'c'], a: 2, why: 'Because.' } }, { title: 'Interview', html: '<p>Fixture.</p>' }],
    profile: { adultIA: 6, adultHI: 2, childIA: 6, childHI: 3, impairment: 'Fixture' }, answer: { conclusion: 'Fixture.', codes: 'F90.0', ddx: ['Fixture'], teaching: ['Fixture'] } }]);
  var dsym = {};
  for (var i = 1; i <= 9; i++) { dsym['ia' + i] = { adult: i <= 7 ? 'yes' : 'no', child: i <= 6 ? 'yes' : 'no', exA: { 'work.0': true } }; dsym['hi' + i] = { adult: i <= 3 ? 'yes' : 'no', child: i <= 2 ? 'yes' : 'no' }; }
  AA.add('demo', { patient: { ref: 'DEMO-01', age: 29, sex: 'Female', occupation: 'Fixture', consent: true, reason: 'Fixture referral.' }, step: 'summary',
    tools: { phq9: { answers: { 1: 1, 2: 1, 3: 0 } } }, symptoms: dsym, onset: { always: 'yes', before12: 'yes', duration6m: 'yes' },
    impairment: { adult: { work: { sev: 2 }, relationships: { sev: 2 } }, child: { work: { sev: 2 } } }, collateral: { parent: 2, partner: 1, school: 1 },
    ddx: { dep: { verdict: 'comorbid' }, bip: { verdict: 'absent' } }, validity: { concern: 'none' }, risk: { reviewed: true } });
})();
