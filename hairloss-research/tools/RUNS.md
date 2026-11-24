# Workflow runs (internal log, for resuming after a restart)

Scripts: /root/.claude/projects/-home-user/e5316970-fba8-5d89-80c3-33335b549958/workflows/scripts/
- original: hairloss-consultation-research-wf_ab50a3f8-1a8.js   · tighter budgets: hairloss-consultation-research-v2.js

| group | companies / tasks | script | run id |
|---|---|---|---|
| UK compounders 1 | hims-uk, hair-and-me, voy | original | wf_ab50a3f8-1a8 (resumed 21:55) |
| UK compounders 2 | sons, numan, treated | original | wf_daf79566-2e8 |
| UK pharmacies | superdrug-online-doctor, boots-online-doctor, oxford-online-pharmacy, lloyds-online-doctor | v2 | wf_3a006fc7-c92 |
| US big brands | hims-us, hers-us | v2 | wf_8afba5c5-1dd |
| US specialists 1 | keeps, ro | v2 | wf_1c1d5eff-58f |
| US compounders 1 | happy-head, strut | v2 | wf_b2cff3d5-c6c |
| Foundations A | clinical-men, clinical-women, uk-regulation (+fact-check) | v2 | wf_3cfa3e46-c8a |
| Foundations B | sweep:uk, sweep:us-international, customer-voice, market-economics | v2 | wf_2ee1b15b-668 |

Still to launch (wave 2): musely, xyon, oana, nutrafol, pilot.
| US compounders 2 | musely, xyon, oana | v2 | (launched 22:05; see newest folder in subagents/workflows) |

Still to launch: nutrafol, pilot. Then phase 2: cross-company synthesis and the new-company design.

## 23 Nov 22:55 UTC — relaunched on Opus (script hairloss-consultation-research-v3.js; args carry "start" per company and "model")
The Fable usage limit was reached at about 22:45; every earlier run stopped. Stage reached per company is in each journal.

| group | companies (start stage) | run id |
|---|---|---|
| UK A1 | hair-and-me (verify), treated (map) | wf_825dcb84-083 |
| UK A2 | sons (experiment), numan (experiment) | wf_baba9f0b-642 |
| UK A3 | superdrug (experiment), boots (experiment) | wf_198918fa-3a2 |
| UK A4 | oxford (experiment), lloyds (map) | wf_74d0f9f6-144 |
| Research A5 | uk-regulation (finish + check), customer-voice (finish + check), clinical-men (check), market-economics (check) | wf_8c98fa00-cab |
| US B1 | hims-us (experiment), keeps (experiment) | wf_c584a855-4c2 |
| US B2 | happy-head (experiment), strut (experiment) | wf_ca3b4af9-bbc |

Finished already: hims-uk, voy, hers-us (all three stages); ro (verify still to do); clinical-women (checked); both market sweeps.
Still to launch: ro (verify), xyon / musely / oana (map), nutrafol, pilot. Then phase 2 (synthesis + the new-company design).
| UK big extras | dr-fox (map), philip-kingsley (map) | wf_70eaed0f-f6d |

Priority change (23 Nov, user asked about "other big ones"): the UK sweep flagged Dr Fox and Philip Kingsley as the biggest UK players outside the original ten, so they jumped the queue. The five queued US/AU companies (xyon, musely, oana, nutrafol, pilot) only run if the weekly budget allows after the synthesis and company plan.
Voy: blocked by a bot check we do not bypass; offered the user a manual walk on their own phone (screenshots) to fill the gap.

## 24 Nov 08:00 UTC
Finished and verified: hims-uk, voy, hair-and-me, numan, treated, dr-fox, philip-kingsley, boots, superdrug, lloyds, oxford (partial: blocked), hims-us, hers-us (partial: blocked), keeps, happy-head, strut. Background: all five foundations fact-checked.
Running: sons verify retry (wf_2a22cb07-3c7; the first reviewer hung 8 h on an unanswered approval), ro verify (wf_2cca9ac4-1a1), phase 2 synthesis + company design (wf_36d51cf0-a2b, script hairloss-phase2-synthesis-design-wf_36d51cf0-a2b.js).
Not started (budget): musely, oana, nutrafol, pilot. xyon has an unverified stage-1 map only.
