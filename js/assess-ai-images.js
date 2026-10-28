/* Reviewed AI illustrations for the 11 requested Assessment Guide visuals.
   Other figures, live charts and the original vector renderers are unchanged. */
(function(){
'use strict';
var teaching=window.AGTEACH;
if(!teaching)return;
var assets=[
  {
    "step": 2,
    "key": "prep",
    "file": "ag-prep-ai",
    "title": "Before the appointment",
    "alt": "Four illustrated sources—self-report, informants, school reports and health records—feed into a full specialist assessment. Screening alone cannot diagnose ADHD."
  },
  {
    "step": 5,
    "key": "grid",
    "file": "ag-grid-ai",
    "title": "The 18 symptoms: count the evidence",
    "alt": "Illustrative Sam example: 8 of 9 inattentive and 4 of 9 hyperactive-impulsive symptoms supported. Age thresholds, duration and all other diagnostic criteria still apply."
  },
  {
    "step": 9,
    "key": "wheel",
    "file": "ag-wheel-ai",
    "title": "Background history: the whole person",
    "alt": "Nine illustrated areas of history: birth, development, education and work, mental health, physical health, medicines, family, substances, and social or forensic circumstances."
  },
  {
    "step": 10,
    "key": "mse",
    "file": "ag-mse-ai",
    "title": "Mental state: assess what is present",
    "alt": "A calm clinical conversation surrounded by eight mental-state assessment domains. Calm behaviour does not rule out ADHD; assess risk and document actual findings."
  },
  {
    "step": 12,
    "key": "informants",
    "file": "ag-informants-ai",
    "title": "Collateral: compare, do not vote",
    "alt": "Self, parent or partner, and teacher or colleague offer different perspectives. Compare specific examples in the same setting and period, explore disagreements and document the evidence."
  },
  {
    "step": 13,
    "key": "tree",
    "file": "ag-tree-ai",
    "title": "Differentials: follow the clues",
    "alt": "Seven illustrated prompts explore onset, context, sleep, staring spells, anxiety or trauma, substances or medicines, and autism or learning differences. They guide assessment, not automatic exclusion of ADHD."
  },
  {
    "step": 14,
    "key": "ladder",
    "file": "ag-ladder-ai",
    "title": "Coexisting conditions: what comes first?",
    "alt": "Three illustrated care priorities: immediate safety, stabilising and planning safely, and coordinated support in parallel. Priorities are individualised, not a universal treatment order."
  },
  {
    "step": 15,
    "key": "gates",
    "file": "ag-gates-ai",
    "title": "Formulation: evidence for every criterion",
    "alt": "Illustrated evidence for DSM criteria A to E: symptoms, childhood onset, multiple settings, impairment and alternative explanations. All criteria need support, not just the symptom count."
  },
  {
    "step": 16,
    "key": "fork",
    "file": "ag-fork-ai",
    "title": "The decision: three honest outcomes",
    "alt": "A clinician reviews all evidence and explains one of three outcomes: ADHD with a plan, uncertainty with missing information and a review date, or not ADHD with alternative support. Every outcome requires next steps."
  },
  {
    "step": 17,
    "key": "report",
    "file": "ag-report-ai",
    "title": "The report: make the reasoning visible",
    "alt": "Four illustrated report sections connect the person's story and information sources to clinical evidence, reasoning, and an agreed action plan including risk and follow-up."
  },
  {
    "step": 19,
    "key": "scope",
    "file": "ag-scope-ai",
    "title": "Competence and safety netting",
    "alt": "Learning, supervised practice and demonstrated competence are distinct. A course does not qualify someone for independent specialist diagnosis. Document risk, contact advice and follow-up."
  }
];
assets.forEach(function(a){teaching.images[a.step]=[a.file,a.alt,1086,1448,teaching.captions[a.key],a.title];});
})();
