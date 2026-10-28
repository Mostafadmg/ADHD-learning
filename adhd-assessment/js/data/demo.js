/* Demo records: complete, fictional worked cases built from the real data ids. Not real patients.
   demo       34-year-old woman, ADHD predominantly inattentive presentation with co-occurring generalised anxiety.
              Assessed 25 Aug 2026; lisdexamfetamine (Elvanse) started 21 Sep 2026, optimised at 50 mg; shared care requested.
   demoYoung  8-year-old boy in Year 4 (fresh write-up of the main course case "Leo, 8"), ADHD combined presentation.
              Assessed 15 Sep 2026; Concerta XL started 5 Oct 2026, mid-titration at 36 mg.
   Dates are fixed ISO dates written on 25 Oct 2026, so trial weeks and due dates move on as real time passes.
   Treatment ids come from js/data/tx-products.js and tx-pathway.js; review and prior-medicine keys are fixed demo ids.
   Keep both treatment records complete (ARCHITECTURE 5.15): every heart and safety-screen item answered, every plan
   item that applies ticked, reviews tagged with their drug and product, and a newDose on each Increase review. */
AA.add('demo', {
 "patient": {
  "ref": "DEMO-01",
  "age": 34,
  "sex": "Female",
  "gender": "Woman",
  "occupation": "Project coordinator",
  "referrer": "GP",
  "reason": "Lifelong difficulty with organisation, finishing tasks and forgetfulness. At risk of losing her job after missed deadlines. Her daughter was diagnosed with ADHD last year.",
  "date": "2026-08-25",
  "informants": {
   "partner": true,
   "parent": true,
   "sibling": false,
   "other": ""
  },
  "sources": {
   "schoolReports": true,
   "previousRecords": false
  },
  "consent": true,
  "interpreter": false
 },
 "step": "summary",
 "tools": {
  "asrs18": {
   "answers": {
    "1": 3,
    "2": 4,
    "3": 3,
    "4": 4,
    "5": 2,
    "6": 3,
    "7": 3,
    "8": 4,
    "9": 3,
    "10": 3,
    "11": 4,
    "12": 1,
    "13": 3,
    "14": 3,
    "15": 1,
    "16": 2,
    "17": 1,
    "18": 1
   },
   "notes": "Completed at home before the appointment. Partner helped her understand \"Part A\"."
  },
  "wurs25": {
   "answers": {
    "1": 3,
    "2": 3,
    "3": 2,
    "4": 2,
    "5": 2,
    "6": 2,
    "7": 2,
    "8": 2,
    "9": 2,
    "10": 2,
    "11": 2,
    "12": 2,
    "13": 2,
    "14": 2,
    "15": 2,
    "16": 2,
    "17": 2,
    "18": 2,
    "19": 2,
    "20": 2,
    "21": 2,
    "22": 2,
    "23": 2,
    "24": 2,
    "25": 2
   },
   "notes": "Childhood recall. Mother says this matches what she remembers."
  },
  "wfirs": {
   "answers": {
    "1": 1,
    "2": 2,
    "3": 1,
    "4": 0,
    "5": 2,
    "6": 1,
    "7": 1,
    "8": 0,
    "9": 2,
    "10": 3,
    "11": 2,
    "12": 2,
    "13": 1,
    "14": 3,
    "15": 2,
    "16": 2,
    "17": 1,
    "18": 2,
    "19": 2,
    "20": "na",
    "21": "na",
    "22": "na",
    "23": "na",
    "24": "na",
    "25": "na",
    "26": "na",
    "27": "na",
    "28": "na",
    "29": "na",
    "30": 2,
    "31": 1,
    "32": 3,
    "33": 2,
    "34": 2,
    "35": 1,
    "36": 2,
    "37": 0,
    "38": 1,
    "39": 2,
    "40": 1,
    "41": 2,
    "42": 2,
    "43": 2,
    "44": 3,
    "45": 1,
    "46": 2,
    "47": 1,
    "48": 0,
    "49": 1,
    "50": 1,
    "51": 0,
    "52": 1,
    "53": 2,
    "54": 0,
    "55": 1,
    "56": 1,
    "57": 0,
    "58": 0,
    "59": 1,
    "60": 0,
    "61": 0,
    "62": 2,
    "63": 0,
    "64": 0,
    "65": 1,
    "66": 0,
    "67": 0,
    "68": 0,
    "69": 0
   }
  },
  "phq9": {
   "answers": {
    "1": 1,
    "2": 1,
    "3": 1,
    "4": 1,
    "5": 1,
    "6": 1,
    "7": 1,
    "8": 1,
    "9": 0
   },
   "notes": "Low mood linked to work stress; no anhedonia; no thoughts of self-harm."
  },
  "gad7": {
   "answers": {
    "1": 2,
    "2": 2,
    "3": 2,
    "4": 2,
    "5": 1,
    "6": 1,
    "7": 1
   },
   "notes": "Worry mostly about missed deadlines and money; started in her twenties."
  },
  "mdq": {
   "answers": {
    "1": 1,
    "2": 1,
    "3": 1,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0,
    "8": 0,
    "9": 0,
    "10": 0,
    "11": 0,
    "12": 0,
    "13": 0,
    "14": 0,
    "15": 0,
    "16": 0,
    "17": 0
   },
   "notes": "Endorsed items describe lifelong talkativeness and distractibility, not episodes."
  },
  "audit": {
   "answers": {
    "1": 1,
    "2": 1,
    "3": 1,
    "4": 1,
    "5": 1,
    "6": 0,
    "7": 0,
    "8": 0,
    "9": 0,
    "10": 0
   }
  },
  "dast10": {
   "answers": {
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0,
    "8": 0,
    "9": 0,
    "10": 0
   }
  },
  "aq10": {
   "answers": {
    "1": 1,
    "2": 3,
    "3": 2,
    "4": 2,
    "5": 2,
    "6": 2,
    "7": 4,
    "8": 4,
    "9": 2,
    "10": 4
   }
  },
  "cssrs": {
   "answers": {
    "1": 0,
    "2": 0,
    "3": "na",
    "4": "na",
    "5": "na",
    "6": 0,
    "7": "na"
   }
  }
 },
 "risk": {
  "reviewed": true,
  "notes": "No suicidal thoughts, no self-harm, no safeguarding concerns. Drives daily; one minor collision in 2019 while distracted. DVLA: no notification needed for ADHD alone; discussed."
 },
 "history": {
  "presenting": {
   "checks": {
    "presenting_lifelong": true,
    "presenting_demands": true,
    "presenting_compensate": true,
    "presenting_selfid": true
   },
   "notes": "Always disorganised and forgetful, since primary school. A new project role with more deadlines exposed it: she now works most evenings to catch up and is on a performance plan after missed deadlines. Read about ADHD after her daughter's diagnosis last year. No earlier assessment or treatment."
  },
  "school": {
   "checks": {
    "school_reports": true,
    "school_sanctions": true
   }
  },
  "work": {
   "checks": {
    "work_manyjobs": true,
    "work_dismissed": true,
    "work_walkout": true,
    "work_performance": true,
    "work_safety": true
   }
  },
  "family": {
   "checks": {
    "family_adhd": true,
    "family_informantadhd": true
   },
   "notes": "Daughter (9) diagnosed with ADHD, combined presentation, last year. Father described as \"always on the go\"."
  },
  "mental": {
   "checks": {
    "mental_worry": true,
    "mental_noresponse": true
   }
  },
  "sleep": {
   "checks": {
    "sleep_mindbusy": true,
    "sleep_owl": true,
    "sleep_screens": true
   }
  },
  "substance": {
   "checks": {},
   "none": true,
   "notes": ""
  },
  "forensic": {
   "checks": {},
   "none": true,
   "notes": ""
  },
  "physical": {
   "checks": {},
   "none": true,
   "notes": "No cardiac history; no family history of sudden death; BP 118/76, pulse 72 today."
  },
  "meds": {
   "checks": {},
   "none": true,
   "notes": ""
  }
 },
 "symptoms": {
  "ia1": {
   "adult": "yes",
   "child": "yes",
   "exA": {
    "work.0": true,
    "work.1": true,
    "study.0": true,
    "study.1": true
   },
   "exC": {
    "school.0": true,
    "school.1": true
   },
   "infA": 2,
   "infC": 1,
   "otherA": "Sent a contract with the wrong client name to two suppliers last month.",
   "otherC": "Teachers wrote \"careless\" on most maths tests."
  },
  "ia2": {
   "adult": "yes",
   "child": "yes",
   "exA": {
    "work.0": true,
    "work.1": true,
    "study.0": true,
    "study.1": true
   },
   "exC": {
    "school.0": true,
    "school.1": true
   },
   "infA": 2,
   "infC": 2
  },
  "ia3": {
   "adult": "unsure",
   "child": "unsure",
   "exA": {
    "conversation.0": true
   },
   "exC": {},
   "infA": 1
  },
  "ia4": {
   "adult": "yes",
   "child": "yes",
   "exA": {
    "work.0": true,
    "work.1": true,
    "study.0": true,
    "study.1": true
   },
   "exC": {
    "school.0": true,
    "school.1": true
   },
   "infA": 2,
   "infC": 1,
   "otherA": "Has six half-finished online courses; her manager now checks every task list.",
   "otherC": "Homework diary full of red notes for unfinished work."
  },
  "ia5": {
   "adult": "yes",
   "child": "yes",
   "exA": {
    "work.0": true,
    "work.1": true,
    "study.0": true,
    "study.1": true
   },
   "exC": {
    "school.0": true,
    "school.1": true
   },
   "infA": 2,
   "infC": 2,
   "otherA": "Missed two project deadlines this quarter; double-booked meetings weekly.",
   "otherC": "Bedroom and school bag always chaotic; needed her mother to pack her bag until age 14."
  },
  "ia6": {
   "adult": "unsure",
   "child": "no",
   "exA": {
    "work.0": true
   },
   "exC": {},
   "infA": 1,
   "notes": "Avoids long reports, but partly because of fear of mistakes: check overlap with anxiety."
  },
  "ia7": {
   "adult": "yes",
   "child": "yes",
   "exA": {
    "home.0": true,
    "home.1": true,
    "work.0": true,
    "work.1": true
   },
   "exC": {
    "school.0": true,
    "school.1": true
   },
   "infA": 2,
   "infC": 1
  },
  "ia8": {
   "adult": "yes",
   "child": "yes",
   "exA": {
    "work.0": true,
    "work.1": true,
    "study.0": true,
    "study.1": true
   },
   "exC": {
    "school.0": true,
    "school.1": true
   },
   "infA": 2,
   "infC": 2,
   "flags": {
    "gad": true
   }
  },
  "ia9": {
   "adult": "yes",
   "child": "yes",
   "exA": {
    "health.0": true,
    "health.1": true,
    "admin.0": true,
    "admin.1": true
   },
   "exC": {
    "school.0": true,
    "school.1": true
   },
   "infA": 2,
   "infC": 2,
   "otherA": "Partner has set up shared calendar alerts for bills after two late payments.",
   "otherC": "Forgot PE kit most weeks."
  },
  "hi1": {
   "adult": "yes",
   "child": "yes",
   "exA": {
    "work.0": true,
    "work.1": true,
    "study.0": true,
    "study.1": true
   },
   "exC": {
    "school.0": true,
    "school.1": true
   },
   "infA": 2,
   "infC": 1
  },
  "hi2": {
   "adult": "no",
   "child": "no",
   "exA": {},
   "exC": {}
  },
  "hi3": {
   "adult": "yes",
   "child": "no",
   "exA": {
    "inner.0": true,
    "inner.1": true,
    "work.0": true,
    "work.1": true
   },
   "exC": {},
   "infA": 2
  },
  "hi4": {
   "adult": "no",
   "child": "no",
   "exA": {},
   "exC": {}
  },
  "hi5": {
   "adult": "unsure",
   "child": "no",
   "exA": {
    "work.0": true
   },
   "exC": {},
   "infA": 1
  },
  "hi6": {
   "adult": "no",
   "child": "yes",
   "exA": {},
   "exC": {
    "school.0": true,
    "school.1": true
   },
   "infC": 2
  },
  "hi7": {
   "adult": "yes",
   "child": "no",
   "exA": {
    "conversation.0": true,
    "conversation.1": true,
    "work.0": true,
    "work.1": true
   },
   "exC": {},
   "infA": 2
  },
  "hi8": {
   "adult": "no",
   "child": "no",
   "exA": {},
   "exC": {}
  },
  "hi9": {
   "adult": "no",
   "child": "no",
   "exA": {},
   "exC": {}
  }
 },
 "supplement": {
  "iaAdult": "yes",
  "iaChild": "yes",
  "hiAdult": "no",
  "hiChild": "no"
 },
 "onset": {
  "always": "yes",
  "ageOnset": "",
  "before12": "yes",
  "duration6m": "yes",
  "notes": "Problems clear in primary school reports from Year 3 (age 7). No period of normal functioning."
 },
 "impairment": {
  "adult": {
   "work": {
    "sev": 2,
    "ex": {
     "0": true,
     "1": true,
     "2": true
    },
    "notes": "Formal performance plan at work after missed deadlines; works evenings to catch up."
   },
   "relationships": {
    "sev": 2,
    "ex": {
     "0": true,
     "1": true,
     "2": true
    }
   },
   "social": {
    "sev": 1,
    "ex": {
     "0": true,
     "1": true
    }
   },
   "leisure": {
    "sev": 1,
    "ex": {
     "0": true,
     "1": true
    }
   },
   "selfimage": {
    "sev": 2,
    "ex": {
     "0": true,
     "1": true,
     "2": true
    }
   },
   "daily": {
    "sev": 2,
    "ex": {
     "0": true,
     "1": true,
     "2": true
    }
   },
   "safety": {
    "sev": 1,
    "ex": {
     "0": true,
     "1": true
    }
   }
  },
  "child": {
   "work": {
    "sev": 2,
    "ex": {
     "0": true,
     "1": true
    }
   },
   "relationships": {
    "sev": 1,
    "ex": {
     "0": true
    }
   },
   "social": {
    "sev": 1,
    "ex": {
     "0": true
    }
   },
   "leisure": {
    "sev": 0,
    "ex": {}
   },
   "selfimage": {
    "sev": 2,
    "ex": {
     "0": true,
     "1": true
    }
   },
   "daily": {
    "sev": 1,
    "ex": {
     "0": true
    }
   },
   "safety": {
    "sev": 0,
    "ex": {}
   }
  }
 },
 "collateral": {
  "parent": 2,
  "partner": 2,
  "school": 1,
  "who": {
   "parent": "Mother, by telephone",
   "partner": "Partner of 8 years, present in the room"
  },
  "answers": {
   "p1": true,
   "p2": true,
   "p3": true,
   "p4": true,
   "p5": true,
   "p6": true,
   "p7": true,
   "p8": true,
   "r1": true,
   "r2": true,
   "r3": true,
   "r4": true,
   "r5": true,
   "r6": true,
   "school_0": true,
   "school_1": true,
   "school_2": true,
   "school_3": true
  },
  "notes": "Mother describes a \"dreamy, disorganised\" child who lost things constantly and needed far more reminders than her brother. School reports from Years 3-6 available."
 },
 "ddx": {
  "dep": {
   "verdict": "absent",
   "notes": "PHQ-9 8, no episode of low mood lasting two weeks, enjoyment preserved."
  },
  "bip": {
   "verdict": "absent",
   "notes": "No episodes of reduced need for sleep or elevated mood; partner confirms. MDQ negative."
  },
  "gad": {
   "verdict": "comorbid",
   "notes": "GAD-7 11. Worry began in her twenties, focused on consequences of missed work; attention problems are documented from age 7 and occur when calm. Diagnose both; treat ADHD and review anxiety at follow-up.",
   "f": {
    "gad_worry": true,
    "gad_state": true
   }
  },
  "ptsd": {
   "verdict": "absent",
   "notes": ""
  },
  "bpd": {
   "verdict": "absent",
   "notes": ""
  },
  "asd": {
   "verdict": "absent",
   "notes": ""
  },
  "sud_alcohol": {
   "verdict": "absent",
   "notes": ""
  },
  "sud_cannabis": {
   "verdict": "absent",
   "notes": ""
  },
  "insomnia": {
   "verdict": "absent",
   "notes": ""
  },
  "osa": {
   "verdict": "absent",
   "notes": "No snoring or witnessed apnoeas; STOP-Bang low."
  },
  "thyroid": {
   "verdict": "absent",
   "notes": "TSH normal (GP bloods, last month)."
  },
  "menopause": {
   "verdict": "absent",
   "notes": ""
  }
 },
 "ddxProtocol": {
  "p1_c1": true,
  "p1_c2": true,
  "p1_c3": true,
  "p1_c4": true,
  "p1_c5": true,
  "p1_c6": true,
  "p1_c7": true,
  "p2_c1": true,
  "p2_c2": true,
  "p2_c3": true,
  "p2_c4": true,
  "p2_c5": true,
  "p2_c6": true,
  "p3_c1": true,
  "p3_c2": true,
  "p3_c3": true,
  "p3_c4": true,
  "p3_c5": true,
  "p3_c6": true,
  "p4_c1": true,
  "p4_c2": true,
  "p4_c3": true,
  "p4_c4": true,
  "p4_c5": true,
  "p4_c6": true,
  "p4_c7": true,
  "p5_c1": true,
  "p5_c2": true,
  "p5_c3": true,
  "p5_c4": true,
  "p5_c5": true,
  "p5_c6": true,
  "p5_c7": true,
  "p6_c1": true,
  "p6_c2": true,
  "p6_c3": true,
  "p6_c4": true,
  "p6_c5": true,
  "p6_c6": true,
  "p6_c7": true,
  "p7_c1": true,
  "p7_c2": true,
  "p7_c3": true,
  "p7_c4": true,
  "p7_c5": true,
  "p7_c6": true,
  "p8_c1": true,
  "p8_c2": true,
  "p8_c3": true,
  "p8_c4": true,
  "p8_c5": true,
  "p8_c6": true,
  "p9_c1": true,
  "p9_c2": true,
  "p9_c3": true,
  "p9_c4": true,
  "p9_c5": true,
  "p9_c6": true,
  "p9_c7": true,
  "p10_c1": true,
  "p10_c2": true,
  "p10_c3": true,
  "p10_c4": true,
  "p10_c5": true,
  "p10_c6": true,
  "p10_c7": true,
  "p11_c1": true,
  "p11_c2": true,
  "p11_c3": true,
  "p11_c4": true,
  "p11_c5": true,
  "p11_c6": true,
  "p11_c7": true,
  "p12_c1": true,
  "p12_c2": true,
  "p12_c3": true,
  "p12_c4": true,
  "p12_c5": true,
  "p12_c6": true,
  "p12_c7": true,
  "p13_c1": true,
  "p13_c2": true,
  "p13_c3": true,
  "p13_c4": true,
  "p13_c5": true,
  "p13_c6": true,
  "p14_c1": true,
  "p14_c2": true,
  "p14_c3": true,
  "p14_c4": true,
  "p14_c5": true,
  "p14_c6": true,
  "p14_c7": true
 },
 "validity": {
  "concern": "none",
  "checks": {},
  "notes": "Consistent account across self-report, partner, mother and school reports. Specific, detailed examples. No external incentive identified."
 },
 "formulation": {
  "decision": "met",
  "presentation": "ia",
  "severity": "moderate",
  "remission": false,
  "comorbid": "Generalised anxiety disorder (co-occurring)",
  "notes": "Lifelong inattentive symptoms from age 7, persistent and pervasive, causing moderate to severe occupational impairment. Anxiety co-occurs and does not explain the attention problems, which predate it and occur when calm.",
  "plan": {
   "pl_psychoed": true,
   "pl_written": true,
   "pl_family": true,
   "pl_environment": true,
   "pl_adjustments": true,
   "pl_accesstowork": true,
   "pl_letter": true,
   "pl_options": true,
   "pl_shared": true,
   "pl_dvla": true,
   "pl_gp": true,
   "pl_recheck": true,
   "pl_cardiohx": true,
   "pl_obs": true,
   "pl_ecg": true,
   "pl_misuse": true,
   "pl_medreview": true,
   "pl_prescriber": true
  },
  "planNotes": "Psychoeducation and written information given. Discuss medication at follow-up after baseline checks. Letter to GP and occupational health."
 },
 "treatment": {
  "plan": {
   "decision": "medication",
   "team": {
    "specialist": true,
    "competent": true,
    "supervised": true
   },
   "steps": {
    "tp_info": true,
    "tp_shared": true,
    "tp_envmod_adult": true,
    "tp_nondrug": true,
    "tp_psych": true,
    "tp_diet_adult": true,
    "tp_driving": true,
    "tp_pregnancy": true,
    "tp_recheck": true
   },
   "prefer": "Wants to try medicine alongside the work adjustments. Prefers one dose in the morning that lasts into the evening, so nothing to take at work. Worried about appetite and sleep.",
   "notes": "Follow-up on 15 Sep 2026. Before starting, the diagnosis and the need for treatment were re-checked: criteria still met, anxiety and work circumstances reviewed. Shared decision: lisdexamfetamine and methylphenidate are both first choices for adults; she chose lisdexamfetamine for a long, smooth day. Pharmacist independent prescriber in the specialist adult ADHD team; plan agreed with the supervising consultant psychiatrist at the weekly team meeting. Anxiety reviewed at each visit."
  },
  "baseline": {
   "date": "2026-08-25",
   "sbp": 118,
   "dbp": 76,
   "pulse": 72,
   "heightCm": 165,
   "weightKg": 66.5,
   "cuff": "Standard adult",
   "abpm": "not_needed",
   "hrNote": "Seated after 5 minutes' rest, left arm. Regular pulse.",
   "cardiac": {
    "cx_chd": "no",
    "cx_suddendeath": "no",
    "cx_breathless": "no",
    "cx_faint": "no",
    "cx_palp": "no",
    "cx_chestpain": "no",
    "cx_hf": "no",
    "cx_murmur": "no",
    "cx_htn": "no",
    "cx_med": "no",
    "cx_known": "no"
   },
   "ecg": "not_needed",
   "cardiology": "not_needed",
   "ci": {
    "ci_glaucoma": "no",
    "ci_phaeo": "no",
    "ci_hyperthyroid": "no",
    "ci_maoi": "no",
    "ci_cvd": "no",
    "ci_cerebro": "no",
    "ci_htn": "no",
    "ci_depression": "no",
    "ci_psychosis": "no",
    "ci_personality": "no",
    "ci_anorexia": "no",
    "ci_tics": "no",
    "ci_tourette": "no",
    "ci_epilepsy": "no",
    "ci_substance": "no",
    "ci_porphyria": "no",
    "ci_hepatic": "no",
    "ci_renal": "no",
    "ci_cyp2d6": "no",
    "ci_cyp3a4_inh": "no",
    "ci_cyp3a4_ind": "no",
    "ci_qt": "no",
    "ci_hypotension": "no",
    "ci_decongestant": "no",
    "ci_pregnancy": "no",
    "ci_breastfeeding": "no",
    "ci_acidsuppress": "no",
    "ci_glaucoma_narrow": "no"
   },
   "meds": "None regular. Paracetamol now and then. Two cups of coffee a day; no energy drinks. No drugs that are not prescribed.",
   "misuse": "low",
   "misuseNotes": "Low scores on the AUDIT and DAST-10 screens and no history of drug misuse. Her 9-year-old daughter lives at home: capsules to be kept in a locked box.",
   "pregnancy": "no",
   "contraception": true,
   "driving": "yes",
   "notes": "No heart history features, so no ECG or cardiology opinion needed. Pregnancy and contraception checked again on 15 Sep 2026 before the first prescription: not pregnant, not planning a pregnancy. She will contact the team before stopping contraception. Drives daily: drug-driving rules and the DVLA duty explained."
  },
  "prior": {},
  "choice": {
   "drug": "lisdex",
   "product": "elvanse",
   "why": "Shared decision between the two first-choice medicines for adults. She wanted one capsule each morning that lasts into the evening for work and family time, with no dose at work.",
   "startDose": 30,
   "times": "each morning",
   "startDate": "2026-09-21",
   "supplyDays": 28,
   "counsel": {
    "cs_cd": true,
    "cs_take_lisdex": true,
    "cs_missed_lisdex": true,
    "cs_expect_stim": true,
    "cs_report": true,
    "cs_alcohol_amf": true,
    "cs_otc": true,
    "cs_diversion": true,
    "cs_driving": true,
    "cs_driving_amf": true,
    "cs_travel_cd": true,
    "cs_pregnancy": true,
    "cs_routine": true
   },
   "rx": {
    "rx_basic": true,
    "rx_brand": true,
    "rx_dose": true,
    "rx_form": true,
    "rx_strength": true,
    "rx_qty_words": true,
    "rx_signed": true,
    "rx_28days": true,
    "rx_30days": true,
    "rx_norepeat": true,
    "rx_instal": true,
    "rx_private": true
   },
   "notes": "NHS prescription, no instalments. She collects from her usual community pharmacy. Next prescription is written at each review."
  },
  "reviews": {
   "dmrv01": {
    "date": "2026-09-28",
    "drug": "lisdex",
    "product": "elvanse",
    "dose": 30,
    "sbp": 120,
    "dbp": 78,
    "pulse": 78,
    "weightKg": 66.0,
    "scale": "ASRS v1.1 (self-report)",
    "scaleScore": "Total 40 (baseline 48)",
    "effect": "some",
    "dayCover": "About 8 am to 4 pm; afternoons still hard",
    "se": {
     "se_appetite": "mild",
     "se_sleep": "none",
     "se_headache": "none",
     "se_gi": "none",
     "se_cv": "none",
     "se_anxiety": "none",
     "se_mood": "none",
     "se_psychosis": "none",
     "se_tics": "none",
     "se_seizure": "none",
     "se_rebound": "none",
     "se_suicidal": "none",
     "se_chest": "none"
    },
    "decision": "increase",
    "newDose": 50,
    "notes": "Some benefit in the mornings at work. Eats less at lunch but has a good breakfast and evening meal. Increase to 50 mg each morning (the SmPC allows 10 or 20 mg steps about weekly)."
   },
   "dmrv02": {
    "date": "2026-10-05",
    "drug": "lisdex",
    "product": "elvanse",
    "dose": 50,
    "sbp": 124,
    "dbp": 80,
    "pulse": 82,
    "weightKg": 65.6,
    "scale": "ASRS v1.1 (self-report)",
    "scaleScore": "Total 31 (baseline 48)",
    "effect": "good",
    "dayCover": "About 7.30 am to 7 pm",
    "se": {
     "se_appetite": "mild",
     "se_sleep": "none",
     "se_headache": "none",
     "se_gi": "none",
     "se_cv": "none",
     "se_anxiety": "none",
     "se_mood": "none",
     "se_psychosis": "none",
     "se_tics": "none",
     "se_seizure": "none",
     "se_rebound": "none",
     "se_suicidal": "none",
     "se_chest": "none"
    },
    "decision": "stay",
    "notes": "Clear benefit: finishing tasks and keeping her diary. Appetite still a little lower at lunch. Stay on 50 mg and review in 2 weeks before deciding whether 70 mg is needed."
   },
   "dmrv03": {
    "date": "2026-10-19",
    "drug": "lisdex",
    "product": "elvanse",
    "dose": 50,
    "sbp": 122,
    "dbp": 78,
    "pulse": 80,
    "weightKg": 65.4,
    "scale": "ASRS v1.1 (self-report)",
    "scaleScore": "Total 24 (baseline 48)",
    "effect": "good",
    "dayCover": "About 7.30 am to 7 pm",
    "se": {
     "se_appetite": "mild",
     "se_sleep": "none",
     "se_headache": "none",
     "se_gi": "none",
     "se_cv": "none",
     "se_anxiety": "none",
     "se_mood": "none",
     "se_psychosis": "none",
     "se_tics": "none",
     "se_seizure": "none",
     "se_rebound": "none",
     "se_suicidal": "none",
     "se_chest": "none"
    },
    "decision": "optimised",
    "notes": "Meeting deadlines; her manager has noticed. Anxiety a little better (GAD-7 to be repeated at the 12-week review). She does not want a higher dose. Dose optimised at 50 mg each morning. Weight down 1.1 kg from baseline: eats a larger breakfast."
   }
  },
  "monitor": {
   "shared": "requested",
   "gp": "Her registered GP practice (demo record: no real practice named)",
   "nextReview": "2026-12-14",
   "notes": "Shared care request sent to the GP on 19 Oct 2026, the day the dose was optimised. The team keeps prescribing until the GP agrees. Transfer planned after the 12-week review if results stay satisfactory (local protocol)."
  }
 }
});

/* Child demo (6-11 band). The current period is stored under the 'adult' keys (symptoms.<id>.adult,
   impairment.adult); for a child of 6-11 that period is also "before age 12", so the 'child' keys stay empty. */
AA.add('demoYoung', {
 "patient": {
  "ref": "DEMO-Y1",
  "age": 8,
  "sex": "Male",
  "gender": "Boy",
  "occupation": "",
  "referrer": "GP, after concerns from his mother and the school SENCo",
  "reason": "Leo's mother and his school are worried about his attention, restlessness and acting without thinking, at home and at school. He is behind in reading and writing, and other children leave him out at break. The GP arranged a period of watchful waiting and an ADHD-focused parent group; the problems continued with at least moderate impairment, so he was referred.",
  "date": "2026-09-15",
  "informants": {
   "partner": false,
   "parent": true,
   "sibling": false,
   "teacher": true,
   "other": "SENCo"
  },
  "sources": {
   "schoolReports": true,
   "previousRecords": true
  },
  "consent": true,
  "interpreter": false,
  "young": {
   "school": "Local primary school (demo record)",
   "year": "Year 4",
   "sen": "sen_support",
   "pr": "Mother and father (both have parental responsibility)",
   "consentBasis": "parent_assent",
   "assent": true,
   "seenAlone": false,
   "lac": false,
   "socialWorker": "",
   "schoolConsent": true
  }
 },
 "step": "summary",
 "tools": {
  "snap4": {
   "result": {
    "score": "Parent averages: inattention 2.2, hyperactivity-impulsivity 2.4, oppositional 0.8",
    "cutoff": "yes",
    "rater": "parent",
    "date": "2026-09-01",
    "notes": "Inattention and hyperactivity-impulsivity averages are above the tentative parent benchmarks in the tool card (rough guides, not diagnostic thresholds). Oppositional items are low. Every item rated 2 or 3 was explored in the interview."
   }
  },
  "vanderbilt": {
   "result": {
    "score": "Teacher form: inattentive 6 of 9 items rated often or very often; hyperactive-impulsive 7 of 9; performance rule met",
    "cutoff": "yes",
    "rater": "teacher",
    "date": "2026-07-10",
    "notes": "Completed by his Year 3 class teacher before the summer holiday. Oppositional or conduct and anxiety or depression screens not met. Reading and writing rated below average."
   }
  },
  "scq": {
   "result": {
    "score": "6",
    "cutoff": "no",
    "rater": "parent",
    "date": "2026-09-01",
    "notes": "Below the cut-off of 15 given in the tool card. Fits the warm, back-and-forth play seen in clinic."
   }
  }
 },
 "risk": {
  "reviewed": true,
  "notes": "No self-harm, abuse, exploitation, going missing, bullying or online harm reported by Leo, his mother or the school. Road safety: runs ahead in car parks and once ran out of the school gate. Supervision plan agreed with his parents and the school."
 },
 "history": {
  "presenting": {
   "checks": {
    "presenting_lifelong": true,
    "presenting_y_both": true,
    "presenting_y_support": true
   },
   "notes": "Concerns from his mother and the SENCo since Year 2. Copes in class only with an adult beside him for written work."
  },
  "dev": {
   "checks": {
    "dev_temperament": true,
    "dev_y_nursery": true
   },
   "notes": "Born at term after an uncomplicated pregnancy. No alcohol or drugs in pregnancy (mother asked directly). Sat, walked and talked on time. Nursery staff noticed how active he was at 3."
  },
  "school": {
   "checks": {
    "school_reports": true,
    "school_support": true,
    "school_peers": true,
    "school_y_current": true,
    "school_y_homework": true,
    "school_y_edpsych": true
   },
   "notes": "SEN support since Year 3, with a teaching assistant for written work. Behind in reading and writing, but catches up when an adult works with him. Educational psychology assessment requested by the school."
  },
  "relationships": {
   "checks": {
    "relationships_y_parents": true,
    "relationships_y_siblings": true
   },
   "notes": "Arguments over homework and mealtimes most days. His older sister (11) often refuses to play games with him."
  },
  "mental": {
   "checks": {},
   "none": true,
   "notes": "No low mood, worries, tics or obsessions. Temper flares are brief and he is sorry afterwards."
  },
  "substance": {
   "checks": {},
   "none": true,
   "notes": ""
  },
  "physical": {
   "checks": {},
   "none": true,
   "notes": "No heart problems, fainting, breathlessness or chest pain with exercise. No fits or blank spells. Hearing normal at school-entry screening; vision checked last year. No bladder or bowel problems."
  },
  "meds": {
   "checks": {},
   "none": true,
   "notes": "No regular medicines and no melatonin. No allergies."
  },
  "family": {
   "checks": {
    "family_traits": true,
    "family_y_parentadhd": true
   },
   "notes": "His father had similar problems at school and has never been assessed. No sudden deaths under 40 or inherited heart conditions in the family. Lives with both parents and his sister."
  },
  "forensic": {
   "checks": {},
   "none": true,
   "notes": ""
  },
  "social": {
   "checks": {
    "social_y_selfcare": true,
    "social_y_belongings": true,
    "social_y_road": true
   },
   "notes": "Needs each step of the morning routine given separately. Runs ahead in car parks."
  },
  "sleep": {
   "checks": {},
   "none": true,
   "notes": "Settles by 8.30 pm after a wind-down routine and wakes rested. Snores only with colds; no pauses in breathing; not sleepy in the day."
  },
  "strengths": {
   "checks": {
    "strengths_skills": true,
    "strengths_support": true,
    "strengths_y_trusted": true,
    "strengths_y_interests": true,
    "strengths_y_worries": true
   },
   "notes": "Loves dinosaurs and swimming (weekly club). Gets on well with his teaching assistant. His parents worry about medicine and about labels at school."
  },
  "mse": {
   "notes": "Moved around the room, picking up one toy after another, and often interrupted. Friendly and chatty, with good eye contact and back-and-forth play. Bright mood. Needed many prompts to finish a drawing task."
  }
 },
 "symptoms": {
  "ia1": {
   "adult": "yes",
   "by": { "parent": "yes", "teacher": "yes" },
   "exA": { "school.0": true, "school.2": true, "homework.4": true },
   "infA": 2,
   "otherA": "Gets sums wrong that he can do when an adult goes through them with him."
  },
  "ia2": {
   "adult": "yes",
   "by": { "parent": "yes", "teacher": "yes" },
   "exA": { "school.0": true, "school.2": true, "homework.0": true, "home.1": true },
   "infA": 2,
   "otherA": "Drifts off within a few minutes of carpet time unless the teacher says his name."
  },
  "ia3": {
   "adult": "yes",
   "by": { "parent": "yes", "teacher": "yes" },
   "exA": { "home.0": true, "school.1": true, "school.2": true },
   "infA": 2,
   "otherA": "His mother often says his name three or four times, even with no screen on."
  },
  "ia4": {
   "adult": "yes",
   "by": { "parent": "yes", "teacher": "yes" },
   "exA": { "home.1": true, "school.0": true, "school.3": true, "homework.4": true },
   "infA": 2,
   "otherA": "Written tasks are rarely finished unless the teaching assistant sits with him."
  },
  "ia5": {
   "adult": "no",
   "by": { "parent": "no", "teacher": "no" },
   "exA": {},
   "notes": "Bedroom and school tray no messier than other children his age (mother and teacher)."
  },
  "ia6": {
   "adult": "yes",
   "by": { "parent": "yes", "teacher": "yes" },
   "exA": { "homework.0": true, "school.1": true, "school.4": true },
   "infA": 2,
   "otherA": "Puts off any writing at home and at school; says it is boring and finds something else to do."
  },
  "ia7": {
   "adult": "yes",
   "by": { "parent": "yes", "teacher": "no" },
   "exA": { "home.0": true, "home.1": true },
   "infA": 1,
   "otherA": "Has lost several coats and water bottles this term. His teacher sees no more than other children: the classroom is more structured."
  },
  "ia8": {
   "adult": "yes",
   "by": { "parent": "yes", "teacher": "yes" },
   "exA": { "school.1": true, "homework.2": true, "home.1": true },
   "infA": 2,
   "otherA": "Looks up at every noise from the corridor or the next room."
  },
  "ia9": {
   "adult": "no",
   "by": { "parent": "no", "teacher": "no" },
   "exA": {},
   "notes": "Forgets PE kit now and then; his mother and teacher say no more than his friends."
  },
  "hi1": {
   "adult": "yes",
   "by": { "parent": "yes", "teacher": "yes" },
   "exA": { "home.0": true, "school.0": true, "school.2": true },
   "infA": 2,
   "otherA": "Rocks on his chair and taps his pencil through most lessons."
  },
  "hi2": {
   "adult": "yes",
   "by": { "parent": "yes", "teacher": "yes" },
   "exA": { "home.0": true, "school.1": true },
   "infA": 2,
   "otherA": "Gets up several times during meals, and wanders round the classroom several times a lesson."
  },
  "hi3": {
   "adult": "yes",
   "by": { "parent": "yes", "teacher": "yes" },
   "exA": { "play.0": true, "home.3": true, "school.2": true },
   "infA": 2,
   "otherA": "Climbs on furniture at relatives' houses and climbs PE equipment when told not to."
  },
  "hi4": {
   "adult": "yes",
   "by": { "parent": "yes", "teacher": "no" },
   "exA": { "home.0": true, "home.4": true },
   "infA": 1,
   "otherA": "Makes sound effects through any quiet game at home. Quiet in class when reading a book he likes."
  },
  "hi5": {
   "adult": "yes",
   "by": { "parent": "yes", "teacher": "yes" },
   "exA": { "home.0": true, "home.2": true, "school.0": true },
   "infA": 2,
   "otherA": "On the go from the moment he wakes until bedtime."
  },
  "hi6": {
   "adult": "no",
   "by": { "parent": "no", "teacher": "no" },
   "exA": {},
   "notes": "Talks a lot only when excited about dinosaurs; not a problem in class."
  },
  "hi7": {
   "adult": "yes",
   "by": { "parent": "yes", "teacher": "yes" },
   "exA": { "school.0": true, "school.1": true, "homework.0": true },
   "infA": 2,
   "otherA": "Calls out answers in most lessons, even with a reward chart."
  },
  "hi8": {
   "adult": "yes",
   "by": { "parent": "yes", "teacher": "yes" },
   "exA": { "school.1": true, "play.1": true, "home.4": true },
   "infA": 2,
   "otherA": "Pushes to the front of the lunch queue and grabs the dice out of turn at home."
  },
  "hi9": {
   "adult": "yes",
   "by": { "parent": "yes", "teacher": "yes" },
   "exA": { "home.3": true, "play.0": true, "school.0": true },
   "infA": 2,
   "otherA": "Interrupts adults' conversations and joins other children's games without asking."
  }
 },
 "supplement": {
  "iaAdult": "yes",
  "hiAdult": "yes"
 },
 "onset": {
  "always": "yes",
  "ageOnset": "3",
  "before12": "yes",
  "duration6m": "yes",
  "notes": "Nursery staff raised his activity level at 3. A gradual, long-standing pattern, with no sudden change after any event."
 },
 "impairment": {
  "adult": {
   "work": {
    "sev": 2,
    "ex": { "1": true, "2": true, "8": true, "10": true },
    "notes": "Behind in reading and writing; kept in at break to finish work most weeks; needs a teaching assistant for written tasks."
   },
   "relationships": {
    "sev": 2,
    "ex": { "0": true, "2": true, "9": true }
   },
   "social": {
    "sev": 2,
    "ex": { "1": true, "2": true, "3": true },
    "notes": "Other children leave him out at break because he grabs and pushes in."
   },
   "leisure": {
    "sev": 1,
    "ex": { "6": true, "11": true }
   },
   "selfimage": {
    "sev": 1,
    "ex": { "0": true, "1": true }
   },
   "daily": {
    "sev": 1,
    "ex": { "0": true, "2": true }
   },
   "safety": {
    "sev": 2,
    "ex": { "1": true, "3": true, "4": true },
    "notes": "Runs ahead in car parks; once ran out of the school gate."
   }
  },
  "child": {}
 },
 "collateral": {
  "parent": 2,
  "school": 2,
  "who": {
   "parent": "Mother, in clinic (father by phone)",
   "school": "SENCo by phone; Year 3 class teacher by questionnaire"
  },
  "answers": {
   "pn1": true, "pn2": true, "pn3": true, "pn4": true, "pn5": true, "pn6": true, "pn7": true, "pn8": true,
   "pn9": true, "pn10": true, "pn11": true, "pn13": true, "pn14": true, "pn15": true, "pn16": true,
   "t2": true, "t3": true, "t4": true, "t6": true, "t7": true, "t8": true, "t9": true, "t10": true, "t11": true, "t12": true, "t14": true,
   "ys1": true, "ys2": true, "ys3": true, "ys4": true, "ys5": true, "ys6": true, "ys7": true, "ys8": true, "ys9": true, "ys10": true,
   "school_1": true, "school_2": true, "school_4": true, "school_5": true, "school_7": true, "school_11": true,
   "school_14": true, "school_15": true, "school_16": true, "school_18": true, "school_23": true
  },
  "self": "Leo said reading is fine but writing is 'too long'. He likes PE, swimming and dinosaurs. He says he gets told off 'loads' and that some children will not let him join their games at break. He would like to get in less trouble and have more friends.",
  "notes": "Mother and teacher agree on 16 of 18 symptoms. They differ on losing things and quiet play, which fits the more structured classroom; neither is needed for the threshold. School reports from Reception onwards describe a lively, distractible boy who needs adult support to finish work."
 },
 "ddx": {
  "odd": { "verdict": "absent", "notes": "Does what is asked when he has taken it in. Refusal is not aimed at adults; outbursts are short and he is sorry afterwards. SNAP-IV oppositional items low." },
  "conduct": { "verdict": "absent", "notes": "No aggression to people or animals, stealing, fire-setting or deliberate damage." },
  "attach": { "verdict": "absent", "notes": "Settled early care with both parents. No neglect, separations or care history." },
  "dld": { "verdict": "absent", "notes": "Understands and uses language in line with his age; talked on time. Follows instructions when he is attending." },
  "fasd": { "verdict": "absent", "notes": "No alcohol in pregnancy (mother asked directly). Growth normal; no physical features of concern." },
  "relage": { "verdict": "absent", "notes": "Born in November, so one of the older children in his year. His difficulties are well beyond those of his classmates." },
  "env": { "verdict": "absent", "notes": "Stable home with consistent routines; no recent move, loss or family conflict. Problems are seen at home, school and swimming club, and with different adults." },
  "asd": { "verdict": "absent", "notes": "Warm, back-and-forth play and good eye contact in clinic. Interests are wide; no rigid routines. SCQ below the cut-off." },
  "sld": { "verdict": "absent", "notes": "Behind in reading and writing, but progress improves with 1:1 support, which fits attention problems. Educational psychology assessment requested to check for a specific learning difficulty alongside ADHD: revisit this verdict when it reports." },
  "idd": { "verdict": "absent", "notes": "Learns in line with his age when supported. No global delay." },
  "dcd": { "verdict": "absent", "notes": "Motor milestones on time. Good at swimming and PE. Handwriting rushed rather than poorly formed." },
  "tics": { "verdict": "absent", "notes": "No motor or vocal tics now or in the past (parents and teacher)." },
  "dep": { "verdict": "absent", "notes": "Bright mood. Upset when told off, but no lasting low mood or loss of enjoyment." },
  "gad": { "verdict": "absent", "notes": "No persistent worries; happy to go to school." },
  "social": { "verdict": "absent", "notes": "Keen to join in with other children; no fear of embarrassment." },
  "ptsd": { "verdict": "absent", "notes": "No traumatic events; no safeguarding concerns." },
  "insomnia": { "verdict": "absent", "notes": "Settles by 8.30 pm and wakes rested." },
  "osa_child": { "verdict": "absent", "notes": "Snores only with colds; no pauses in breathing, mouth breathing, bedwetting or daytime sleepiness. Tonsils not enlarged. Restlessness was noticed from age 3, before any snoring." },
  "sepanx": { "verdict": "absent", "notes": "Separates easily at the school gate and sleeps in his own bed. Restless at home with his mother present and at weekends too." },
  "sensory": { "verdict": "absent", "notes": "Hearing normal at school-entry screening; vision checked last year." },
  "epilepsy": { "verdict": "absent", "notes": "No staring spells, blank episodes or fits. Lapses in attention build up gradually and he can be drawn back." },
  "normal": { "verdict": "absent", "notes": "Far more than other 8-year-olds in his class and at home, in several settings, with moderate impairment." },
  "gifted": { "verdict": "absent", "notes": "Not ahead of his classmates; the problems are not boredom with easy work." }
 },
 "validity": {
  "concern": "none",
  "checks": {},
  "notes": "Consistent accounts from his mother, his teacher, the SENCo and old school reports, with specific examples. No external incentive (no EHCP application, exclusion hearing or court case)."
 },
 "formulation": {
  "decision": "met",
  "presentation": "combined",
  "severity": "moderate",
  "remission": false,
  "comorbid": "",
  "notes": "Combined presentation: 7 inattentive and 8 hyperactive-impulsive symptoms now, noticed from age 3, at home, at school and at swimming club. Moderate impairment in learning, family life, friendships and road safety. Not better explained by a learning, language, sleep, hearing or family cause. Learning support continues alongside.",
  "plan": {
   "pl_psychoed": true,
   "pl_written": true,
   "pl_young_family": true,
   "pl_young_environment": true,
   "pl_adjustments": true,
   "pl_shared": true,
   "pl_gp": true,
   "pl_recheck": true,
   "pl_cardiohx": true,
   "pl_ecg": true,
   "pl_misuse": true,
   "pl_medreview": true,
   "pl_prescriber": true,
   "pl_neuropsych": true,
   "pl_young_options": true,
   "pl_young_sharing": true,
   "pl_young_info": true,
   "pl_young_school": true,
   "pl_young_letter": true,
   "pl_young_sen": true,
   "pl_young_diet": true,
   "pl_young_medcriteria": true,
   "pl_young_baseline": true
  },
  "planNotes": "Feedback given to his parents, and to Leo in words he understands. With consent, a letter to the SENCo. Next: post-diagnosis parent session, changes at home and school, then a review in 2 weeks with the pre-treatment checks and a decision about medicine."
 },
 "treatment": {
  "plan": {
   "decision": "medication",
   "team": {
    "specialist": true,
    "competent": true,
    "supervised": true
   },
   "steps": {
    "tp_info": true,
    "tp_shared": true,
    "tp_consent": true,
    "tp_parent": true,
    "tp_school": true,
    "tp_parentmh": true,
    "tp_envmod_young": true,
    "tp_medcriteria": true,
    "tp_diet": true,
    "tp_recheck": true
   },
   "prefer": "His parents want to try medicine because school and home are still hard after the changes. Their worries: appetite, growth and sleep. Leo wants to 'get in less trouble' and to have friends to play with at break.",
   "notes": "Reviewed on 29 Sep 2026: the school changes (seat near the teacher, short tasks with movement breaks, a visual timetable) and home routines are in place, but impairment at school and home persists. The diagnosis and the need for treatment were re-checked: criteria still met, no new coexisting condition, home and school circumstances reviewed. Parent-training programme not offered: no oppositional or conduct symptoms. If impairment remains once the medicine is optimised, the team will review what other support he needs. Pharmacist independent prescriber in the paediatric neurodevelopmental team; titration plan agreed with the supervising consultant paediatrician."
  },
  "baseline": {
   "date": "2026-09-29",
   "sbp": 100,
   "dbp": 62,
   "pulse": 88,
   "heightCm": 129,
   "weightKg": 27.0,
   "cuff": "Child cuff",
   "bpCentile": "lt90",
   "bpChart": "AAP 2017 tables for age, sex and height (Flynn et al., Pediatrics 2017)",
   "hrNote": "Seated after 5 minutes of quiet play. Regular pulse.",
   "cardiac": {
    "cx_chd": "no",
    "cx_suddendeath": "no",
    "cx_breathless": "no",
    "cx_faint": "no",
    "cx_palp": "no",
    "cx_chestpain": "no",
    "cx_hf": "no",
    "cx_murmur": "no",
    "cx_htn": "no",
    "cx_med": "no",
    "cx_known": "no"
   },
   "ecg": "not_needed",
   "cardiology": "not_needed",
   "ci": {
    "ci_glaucoma": "no",
    "ci_phaeo": "no",
    "ci_hyperthyroid": "no",
    "ci_maoi": "no",
    "ci_cvd": "no",
    "ci_cerebro": "no",
    "ci_htn": "no",
    "ci_depression": "no",
    "ci_psychosis": "no",
    "ci_personality": "no",
    "ci_anorexia": "no",
    "ci_tics": "no",
    "ci_tourette": "no",
    "ci_epilepsy": "no",
    "ci_substance": "no",
    "ci_porphyria": "no",
    "ci_hepatic": "no",
    "ci_renal": "no",
    "ci_cyp2d6": "no",
    "ci_cyp3a4_inh": "no",
    "ci_cyp3a4_ind": "no",
    "ci_qt": "no",
    "ci_hypotension": "no",
    "ci_decongestant": "no",
    "ci_acidsuppress": "no",
    "ci_glaucoma_narrow": "no"
   },
   "meds": "None. No melatonin, over-the-counter or herbal products. No caffeine drinks.",
   "misuse": "low",
   "misuseNotes": "His parents will keep the tablets locked away and give each dose. No dose at school. Nobody at home misuses drugs.",
   "notes": "Height and weight plotted on the growth chart: both in the normal range and on similar centiles. Blood pressure checked against the AAP 2017 tables for age, sex and height (the chart this service uses): below the 90th centile. No heart history features, so no ECG needed."
  },
  "prior": {},
  "choice": {
   "drug": "mph",
   "product": "concerta",
   "why": "Methylphenidate is the first choice for children. A once-daily long-acting tablet means no dose at school. Leo swallows tablets whole (checked in clinic). His parents chose it after talking through the benefits and side effects with Leo.",
   "startDose": 18,
   "times": "each morning",
   "startDate": "2026-10-05",
   "supplyDays": 28,
   "counsel": {
    "cs_cd": true,
    "cs_take_mph": true,
    "cs_missed_stim": true,
    "cs_expect_stim": true,
    "cs_report": true,
    "cs_alcohol_mph": true,
    "cs_otc": true,
    "cs_surgery": true,
    "cs_diversion": true,
    "cs_travel_cd": true,
    "cs_school": true,
    "cs_routine": true
   },
   "rx": {
    "rx_basic": true,
    "rx_brand": true,
    "rx_dose": true,
    "rx_form": true,
    "rx_strength": true,
    "rx_qty_words": true,
    "rx_signed": true,
    "rx_28days": true,
    "rx_30days": true,
    "rx_norepeat": true,
    "rx_instal": true,
    "rx_private": true
   },
   "notes": "NHS prescription, no instalments. His mother collects it. A new prescription is written at each dose change."
  },
  "reviews": {
   "dyrv01": {
    "date": "2026-10-12",
    "drug": "mph",
    "product": "concerta",
    "dose": 18,
    "sbp": 100,
    "dbp": 64,
    "bpCentile": "lt90",
    "pulse": 92,
    "weightKg": 26.9,
    "scale": "SNAP-IV (parent)",
    "scaleScore": "Inattention 1.8, hyperactivity-impulsivity 1.9 (baseline 2.2 and 2.4)",
    "effect": "some",
    "dayCover": "About 8 am to 2 pm; afternoons at school still hard",
    "se": {
     "se_appetite": "mild",
     "se_sleep": "none",
     "se_headache": "none",
     "se_gi": "none",
     "se_cv": "none",
     "se_anxiety": "none",
     "se_mood": "none",
     "se_psychosis": "none",
     "se_tics": "none",
     "se_seizure": "none",
     "se_rebound": "none",
     "se_growth": "none",
     "se_suicidal": "none",
     "se_chest": "none"
    },
    "decision": "increase",
    "newDose": 36,
    "notes": "Takes the tablet with breakfast at 7.30 am. Eats a little less at lunch. Increase to 36 mg each morning (18 mg steps about weekly; children's maximum 54 mg)."
   },
   "dyrv02": {
    "date": "2026-10-19",
    "drug": "mph",
    "product": "concerta",
    "dose": 36,
    "sbp": 102,
    "dbp": 64,
    "bpCentile": "lt90",
    "pulse": 94,
    "weightKg": 26.8,
    "scale": "SNAP-IV (parent and teacher)",
    "scaleScore": "Parent: inattention 1.1, hyperactivity-impulsivity 1.0. Teacher: finishes written work with fewer prompts",
    "effect": "good",
    "dayCover": "About 8 am to 5 pm; homework done before tea",
    "se": {
     "se_appetite": "mild",
     "se_sleep": "none",
     "se_headache": "none",
     "se_gi": "none",
     "se_cv": "none",
     "se_anxiety": "none",
     "se_mood": "none",
     "se_psychosis": "none",
     "se_tics": "none",
     "se_seizure": "none",
     "se_rebound": "none",
     "se_growth": "none",
     "se_suicidal": "none",
     "se_chest": "none"
    },
    "decision": "stay",
    "notes": "Good response at 36 mg. Smaller lunch, but eats well at breakfast and supper. Stay on 36 mg for 2 weeks, then decide with parent and teacher ratings whether this is the best dose."
   }
  },
  "monitor": {
   "shared": "not_yet",
   "gp": "",
   "nextReview": "2026-11-02",
   "notes": "Titration continues. Ask the GP for shared care once the dose is stable (local protocol). The school knows there is no dose at school."
  }
 }
});
