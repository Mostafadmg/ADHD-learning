#!/usr/bin/env python3
"""stage2b_patch.py: add the newer anonymous intake (https://www.hims.com/g/i/hl, flow id men-gi) and its one-change
experiments to company.json. Safe to run again (replaces by id). Run from the company folder: python3 scripts/stage2b_patch.py"""
import json
P = 'company.json'
d = json.load(open(P, encoding='utf8'))
B = 'runs/s2b-baseline-men-gi'
SAME = ('Same 14 screens in the same order (server step ids identical), same wording on every screen, same end: the state '
        'screen with the consent tick-box. No warning, no stop, no product, no price.')

def o(label, effect, ev='observed', et='none', aff=None):
    return {'label': label, 'effect': effect, 'effectType': et, 'affects': aff or [], 'evidence': ev}

def same(proof, extra=''):
    return SAME + (' ' + extra if extra else '') + ' Proof: ' + proof + ' vs ' + B + '.'

UNT = ('Not replayed (time budget). Every other option on this screen, and every option on every other quiz screen, changed '
       'nothing, and the server returns the same fixed next screen, so this one almost certainly changes nothing too.')
BASE = 'Baseline answer. Leads to the next fixed screen. Stored with the anonymous session. Proof: ' + B + ', runs/baseline-men-gi.'
MULTI = ' (seen in a run that changed several answers at once, so the proof is weaker than a one-change run)'

def q(i, slug, text, typ, opts, purpose, role, extra_shown=''):
    return {'id': 'gi-q%d' % i, 'order': i, 'stage': 'anonymous', 'text': text, 'type': typ, 'options': opts,
            'purpose': purpose, 'engineRole': role, 'branches': False,
            'branchDetail': 'None found. Every option tested gives the same next screen and the same end.' if opts else '',
            'shownWhen': 'Always (screen /g/i/hl/' + slug + ')' + extra_shown, 'evidence': 'observed', 'slug': slug}

Q = []
Q.append(q(1, 'goals', 'What are your hair goals?', 'single', [
    o('Fix my receding hairline', same('runs/exp-gi-02-goals-receding')),
    o('Regrow a full head of hair', BASE),
    o('Get ahead of hair loss', same('runs/exp-gi-01-goals-get-ahead')),
], 'Sets the sales message. The screen itself says: "The quiz is not a medical assessment and your responses will not be '
   'shared with a medical provider. Hims uses your responses to personalize your experience and for other uses as described in our Privacy Policy."',
   'personalisation'))
Q.append(q(2, 'changes', 'Where are you noticing changes to your hair?', 'single', [
    o('Along the hairline', BASE),
    o('At the top', same('runs/exp-gi-04-changes-top')),
    o('All over', same('runs/exp-gi-03-changes-all-over', 'Diffuse loss is not flagged for a doctor here.')),
], 'Pattern of loss. Clinically this separates male-pattern loss from diffuse shedding, but in this quiz it changes nothing on screen.', 'personalisation'))
Q.append(q(3, 'loss', 'How much hair have you lost?', 'single', [
    o('A lot It’s obvious to everyone', same('runs/exp-gi-05-loss-a-lot')),
    o('Some Those close to me notice', BASE),
    o('A little Only I notice', same('runs/exp-gi-14-all-different') .replace('Proof:', 'Proof' + MULTI + ':'), 'observed'),
], 'Severity, in plain words (no Norwood scale, no photo at this point).', 'personalisation'))
Q.append(q(4, 'start', 'When did you start noticing changes to your hair?', 'single', [
    o('Over a year ago', BASE),
    o('In the past year', UNT, 'inferred'),
    o('In the past few months', same('runs/exp-gi-06-start-past-few-months', 'Recent onset is not flagged for a doctor here.')),
    o('Not sure', same('runs/exp-gi-14-all-different, runs/s2-gi-explore-2').replace('Proof:', 'Proof' + MULTI + ':')),
], 'How long the loss has been going on. Recent, fast loss would usually prompt a check for other causes; this quiz does not react.', 'personalisation'))
Q.append(q(5, 'expectations', 'With treatment, what results are you hoping for? (Choose as many as you’d like.)', 'multi', [
    o('A stronger, defined hairline', same('runs/s2-gi-explore-2').replace('Proof:', 'Proof' + MULTI + ':')),
    o('Visibly thicker, fuller hair', BASE),
    o('More scalp coverage', UNT, 'inferred'),
    o('Keep the hair I have', 'Not tested: both tries (runs/exp-gi-07-expect-keep, retried 30 s later) hit the site\'s own "Something went wrong" screen on the first question. ' + UNT, 'inferred'),
    o('All of the above', same('runs/exp-gi-14-all-different').replace('Proof:', 'Proof' + MULTI + ':')),
], 'Sets expectations and gathers the stated goal for later personalisation.', 'expectation-setting'))
Q.append(q(6, 'type', 'What’s your hair type?', 'single', [
    o('Straight or wavy', BASE),
    o('Curly or coily', same('runs/exp-gi-14-all-different').replace('Proof:', 'Proof' + MULTI + ':')),
    o('Textured or processed', UNT, 'inferred'),
    o('I don’t have hair', same('runs/exp-gi-08-type-no-hair', 'Even a man who says he has no hair is still asked his hair length, style and styling time.')),
], 'Hair type, probably to suggest a spray, serum or tablet that suits the hair (Hims\' routine screen says the answers "help determine which treatment types best fit"). Not seen used.', 'personalisation'))
Q.append(q(7, 'length', 'How long is your hair?', 'single', [
    o('Buzzed, shaved, or bald', same('runs/exp-gi-09-length-buzzed')),
    o('Short', BASE),
    o('Medium', UNT, 'inferred'),
    o('Long', same('runs/exp-gi-14-all-different').replace('Proof:', 'Proof' + MULTI + ':')),
], 'Hair length; probably meant for the topical-versus-tablet pitch. Not seen used.', 'personalisation'))
Q.append(q(8, 'lifestyle', 'Next, let’s talk about lifestyle factors. Uncovering which root causes may be affecting you can help us better understand your hair needs.', 'info', [],
    'Section break before the family-history and stress questions.', 'marketing'))
Q.append(q(9, 'hair-loss-heredity', 'Does hair loss run in your family?', 'single', [
    o('Yes', BASE),
    o('No', same('runs/exp-gi-10-heredity-no')),
    o('Not sure', same('runs/exp-gi-14-all-different').replace('Proof:', 'Proof' + MULTI + ':')),
], 'Family history supports a diagnosis of male-pattern loss; here it changes nothing on screen and the next info screen names family history whatever the answer.', 'personalisation'))
Q.append(q(10, 'stress', 'How often do you tend to experience stress?', 'single', [
    o('All the time', same('runs/exp-gi-11-stress-all-the-time', 'No mental-health follow-up and no mention of stress-related shedding (telogen effluvium).')),
    o('Sometimes', BASE),
    o('Rarely', same('runs/exp-gi-14-all-different').replace('Proof:', 'Proof' + MULTI + ':')),
    o('Not sure', same('runs/s2-gi-explore-2').replace('Proof:', 'Proof' + MULTI + ':')),
], 'Stress as a "root cause"; used for the education screen that follows. Not a mental-health screen.', 'personalisation'))
Q.append(q(11, 'factors', 'Factors like aging, family history, and stress can cause hair shedding and thinning. The good news? Prescription treatments can help you fight these root causes, so you can grow visibly thicker, fuller hair in just 3 to 6 months.', 'info', [],
    'Sales education: the same text for every answer tested (it does not reflect "No" family history or "Rarely" stressed).', 'expectation-setting'))
Q.append(q(12, 'routine', 'Now let’s get to know your hair routine. Your answers help determine which treatment types best fit into your day-to-day.', 'info', [],
    'Section break. Claims the next answers steer the treatment type; that use happens after the wall and was not seen.', 'marketing'))
Q.append(q(13, 'hair-style', 'How do you style your hair?', 'single', [
    o('No styling I let my hair do its thing', BASE),
    o('Products Gel, mousse, etc.', same('runs/exp-gi-14-all-different').replace('Proof:', 'Proof' + MULTI + ':')),
    o('I usually wear a hat', UNT, 'inferred'),
    o('Protective styles Braids, locs, etc.', same('runs/exp-gi-12-style-protective', 'Braids and locs (a cause of traction alopecia) raise no question or warning.')),
], 'Styling routine; probably to favour a spray or tablet over a serum. Not seen used.', 'personalisation'))
Q.append(q(14, 'hair-style-duration', 'How much time do you spend on your hair every day? (We offer treatments that are quick, simple, and work with your routine.)', 'single', [
    o('Less than 5 minutes', BASE),
    o('5-10 minutes', same('runs/exp-gi-14-all-different').replace('Proof:', 'Proof' + MULTI + ':')),
    o('10+ minutes', same('runs/exp-gi-13-duration-10plus')),
], 'Convenience: supports the "quick, simple" pitch and probably the tablet-versus-topical suggestion. Not seen used.', 'personalisation'))
st = q(15, 'select-state', 'Which state do you currently live in? (drop-down "State", then a tick-box: By clicking "Continue", I agree to the Terms and Conditions and Telehealth Consent and acknowledge the Privacy Policy.)', 'single', [
    o('Texas', 'Baseline answer. The page checks the state with the server ("VALIDATE"); reply isValid true; no message. Continue stays disabled until the consent box is ticked, which this research never does. Proof: ' + B + '.'),
    o('California', 'Valid; same screen, no message. Proof: runs/exp-gi-14-all-different.'),
    o('Massachusetts', 'Valid; same screen, no message. No sign here of the compounded-product restriction the page code hints at (rule R20). Proof: runs/exp-gi-16-state-massachusetts.'),
    o('Washington', 'Valid; same screen, no message. No sign here of the compounded-product restriction (R20). Proof: runs/exp-gi-17-state-washington.'),
    o('AA', 'HARD STOP. Server reply isValid false; red message "Currently, we don\'t offer this product in your state"; Continue stays disabled. (AA = US armed forces mail, the Americas.) Proof: runs/exp-gi-15-state-aa, shots/07-gi-state-aa-not-offered.jpg.', 'observed', 'hard-stop'),
    o('AP', 'HARD STOP. Same as AA: isValid false, "Currently, we don\'t offer this product in your state". (AP = armed forces mail, Pacific.) Proof: runs/exp-gi-18-state-ap.', 'observed', 'hard-stop'),
    o('AE', 'Not tested. Inferred: same stop as AA and AP (armed forces mail, Europe).', 'inferred', 'hard-stop'),
    o('Any of the other 48 states listed, and District of Columbia', 'Not each tested. Four tested states were valid. Puerto Rico and the other territories are not in the list at all, so they cannot be chosen (fits the help centre: not available in Puerto Rico).', 'inferred'),
], 'Licensing and shipping gate: a US provider must be licensed in the patient\'s state, and some states need a video visit. Also the point where the visitor must accept the Terms and the Telehealth Consent.',
   'eligibility-gate')
st['branches'] = True
st['branchDetail'] = ('Military mail states AA and AP are refused on the spot (observed). Every other state tested passes. What comes after '
                      'Continue was not seen: the tick-box was not ticked. The "Sign In" link on every screen points to the old app '
                      '(/c/hl?skipToSignIn=true&goFlow=true&flowId=hl), and the server metadata says legacyPath "/c/hl", so the '
                      'account, date of birth (18 to 120) and medical form most likely follow in /c/hl, which is blocked here.')
st['shownWhen'] = 'Always, after the 14 hair screens (screen /g/i/hl/select-state)'
Q.append(st)
for x in Q:
    x.pop('slug', None)

flow = {'id': 'men-gi', 'name': 'Men\'s hair intake, newer app (hims.com/g/i/hl)', 'audience': 'men', 'entryUrl': 'https://www.hims.com/g/i/hl',
        'stagesSummary': ('14 anonymous screens (11 hair and lifestyle questions, 3 information screens) → state screen with a '
                          'Terms and Telehealth Consent tick-box (not ticked: research stops here) → [not seen] account, date of '
                          'birth, medical form, photos, treatment choice and payment, probably in the old /c/hl app. Drawn by '
                          'Hims\' server-driven flow engine (flow-server.hims.com): the browser sends each answer and the server '
                          'names the next screen. No product, price or plan appears before the wall.'),
        'questions': Q}
d['flows'] = [f for f in d['flows'] if f['id'] != 'men-gi']
d['flows'].insert(1, flow)

# old skeleton flow: drop the anonymous topics now seen for real in men-gi
men = next(f for f in d['flows'] if f['id'] == 'men')
drop = {'men-t1', 'men-t2', 'men-t4', 'men-t5', 'men-t6', 'men-t7', 'men-t17'}
men['questions'] = [x for x in men['questions'] if x['id'] not in drop]
for x in men['questions']:
    if x['id'] == 'men-t3':
        x['shownWhen'] = ('Not asked in the 14 anonymous screens of /g/i/hl (observed), so if it is asked at all it is after the '
                          'account wall. Docs only.')
        x['stage'] = 'after-account'
men['name'] = 'Men\'s hair-loss consultation after the wall (hims.com/c/hl, not seen)'
men['stagesSummary'] = ('NOT WALKED: the old app at /c/hl stays on a spinner (Cloudflare refuses its scripts). Its anonymous '
    'opening is now seen in flow men-gi (hims.com/g/i/hl), so the hair-question topics were removed from here. What remains are '
    'topics for the steps after the state and consent screen, from public documents and field names only: account '
    '→ date of birth → medical intake form with follow-ups → photos (in most cases) → a recommended product the '
    'customer may change (strength, quantity, plan) → optional add-ons → payment → provider review. Order not seen.')

# ---------------------------------------------------------------- experiments
E = [
 ('s2b-baseline-men-gi', 'Nothing (baseline replay of /g/i/hl, 22:55 UTC)', 'Works. 14 screens, then the state screen; Texas valid; Continue disabled until the consent box is ticked (not ticked). No product, price, plan or stop.'),
 ('exp-gi-01-goals-get-ahead', 'gi-q1: Regrow a full head of hair → Get ahead of hair loss', 'No change against baseline. ' + SAME),
 ('exp-gi-02-goals-receding', 'gi-q1: Regrow → Fix my receding hairline', 'No change. ' + SAME),
 ('exp-gi-03-changes-all-over', 'gi-q2: Along the hairline → All over', 'No change. ' + SAME + ' (run by the earlier stage 2 investigator)'),
 ('exp-gi-04-changes-top', 'gi-q2: Along the hairline → At the top', 'No change. ' + SAME),
 ('exp-gi-05-loss-a-lot', 'gi-q3: Some → A lot', 'No change. ' + SAME),
 ('exp-gi-06-start-past-few-months', 'gi-q4: Over a year ago → In the past few months', 'No change. ' + SAME + ' (earlier stage 2 run)'),
 ('exp-gi-07-expect-keep', 'gi-q5: Visibly thicker → Keep the hair I have', 'FAILED twice: the site showed "Something went wrong! ... Please try again" on the first screen (server-side error, probably load). Not tested.'),
 ('exp-gi-08-type-no-hair', 'gi-q6: Straight or wavy → I don’t have hair', 'No change. ' + SAME + ' The man is still asked about hair length and styling. (An earlier try failed on a click; this is the re-run.)'),
 ('exp-gi-09-length-buzzed', 'gi-q7: Short → Buzzed, shaved, or bald', 'No change. ' + SAME),
 ('exp-gi-10-heredity-no', 'gi-q9: Yes → No', 'No change. ' + SAME + ' The following info screen still names "family history" as a cause.'),
 ('exp-gi-11-stress-all-the-time', 'gi-q10: Sometimes → All the time', 'No change. ' + SAME),
 ('exp-gi-12-style-protective', 'gi-q13: No styling → Protective styles (braids, locs)', 'No change. ' + SAME + ' (first try hit a site error; this is the retry)'),
 ('exp-gi-13-duration-10plus', 'gi-q14: Less than 5 minutes → 10+ minutes', 'No change. ' + SAME + ' (first try hit a site error; this is the retry)'),
 ('exp-gi-14-all-different', 'NOT one change: every quiz answer different from baseline at once (receding, top, a little, not sure, all of the above, curly, long, not sure, rarely, products, 5-10 min, California)', 'No change in screens, wording or end. California valid. A sweep for hidden branches; it found none.'),
 ('s2-gi-explore-2', 'NOT one change: loss A lot, start Not sure, expectations Hairline, length Buzzed, heredity No, stress Not sure (earlier stage 2 exploration)', 'Same 14 screens. No state was chosen; the earlier tool version clicked the consent tick-box but could not continue without a state, so nothing beyond the state screen was reached.'),
 ('exp-gi-15-state-aa', 'gi-q15: Texas → AA (armed forces, Americas)', 'HARD STOP: server isValid false; "Currently, we don\'t offer this product in your state"; Continue stays disabled.'),
 ('exp-gi-16-state-massachusetts', 'gi-q15: Texas → Massachusetts', 'No change: valid, no message.'),
 ('exp-gi-17-state-washington', 'gi-q15: Texas → Washington', 'No change: valid, no message.'),
 ('exp-gi-18-state-ap', 'gi-q15: Texas → AP (armed forces, Pacific)', 'HARD STOP, same as AA.'),
]
ids = {e[0] for e in E}
d['experiments'] = [x for x in d['experiments'] if x['id'] not in ids] + [
    {'id': i, 'flow': 'men-gi', 'changed': c, 'result': r, 'run': 'runs/' + i} for i, c, r in E]

# ---------------------------------------------------------------- rules
ALLRUNS = ('runs/exp-gi-01 to exp-gi-06, exp-gi-08 to exp-gi-14 and runs/s2-gi-explore-2 vs ' + B)
R = [
 {'id': 'R21', 'flow': 'men-gi', 'when': 'any one answer to the 11 anonymous hair and lifestyle questions (gi-q1 to gi-q14) is changed',
  'then': 'Nothing changes: same screens, same order, same wording, same end at the state screen. No question is added or skipped, no warning, no stop, no product. 12 one-change runs plus 2 multi-change sweeps covered 34 of the 40 options; the other 6 were not replayed.',
  'effectType': 'none', 'affects': [], 'evidence': 'observed', 'proof': ALLRUNS, 'confidence': 'high'},
 {'id': 'R22', 'flow': 'men-gi', 'when': 'the visitor answers any anonymous quiz question',
  'then': 'The answer is sent to Hims\' flow server and kept with an anonymous session id, before any account. The first screen says the quiz "is not a medical assessment" and the answers "will not be shared with a medical provider"; Hims uses them "to personalize your experience and for other uses".',
  'effectType': 'marketing-only', 'affects': [], 'evidence': 'observed', 'proof': B + '/net (each POST carries the answer), ' + B + '/00-goals.txt', 'confidence': 'high'},
 {'id': 'R23', 'flow': 'men-gi', 'when': 'gi-q15 state = AA or AP (US armed forces mail addresses)',
  'then': 'Hard stop on the state screen: "Currently, we don\'t offer this product in your state"; the server answers isValid false and Continue stays disabled.',
  'effectType': 'hard-stop', 'affects': ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p9'], 'evidence': 'observed', 'proof': 'runs/exp-gi-15-state-aa, runs/exp-gi-18-state-ap vs ' + B, 'confidence': 'high'},
 {'id': 'R24', 'flow': 'men-gi', 'when': 'the visitor lives in Puerto Rico or another US territory',
  'then': 'They cannot go on: the state list has the 50 states, District of Columbia and AA/AE/AP only. Matches the help centre (not available in Puerto Rico).',
  'effectType': 'hard-stop', 'affects': ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p9'], 'evidence': 'observed', 'proof': B + '/14-select-state.txt (list of options)', 'confidence': 'medium'},
 {'id': 'R25', 'flow': 'men-gi', 'when': 'gi-q15 state = Massachusetts or Washington (states with special compounded-product flags in the page code)',
  'then': 'Nothing changes at this screen: valid, no message. Any restriction on compounded products (R20) would come later, after the wall.',
  'effectType': 'none', 'affects': [], 'evidence': 'observed', 'proof': 'runs/exp-gi-16-state-massachusetts, runs/exp-gi-17-state-washington', 'confidence': 'high'},
 {'id': 'R26', 'flow': 'men-gi', 'when': 'the visitor reaches the state screen',
  'then': 'Continue stays disabled until the tick-box agreeing to the Terms and Conditions and Telehealth Consent is ticked. This is the first gate of the consultation and the edge of what can be tested without agreeing to anything.',
  'effectType': 'hard-stop', 'affects': [], 'evidence': 'observed', 'proof': B + ' (result.json: continueDisabledWithoutTick true)', 'confidence': 'high'},
 {'id': 'R27', 'flow': 'men-gi', 'when': 'date of birth gives an age under 18 (or over 120)',
  'then': 'Refused: the flow settings served to the browser say minAge 18, "Must be at least 18 years of age." The date-of-birth screen itself is after the wall and was not seen. Backs up R1.',
  'effectType': 'hard-stop', 'affects': ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p9'], 'evidence': 'code', 'proof': B + '/net/01-GET-initialize.json (context.metadata.validation.dateOfBirth)', 'confidence': 'high'},
 {'id': 'R28', 'flow': 'men-gi', 'when': 'the visitor finishes the anonymous intake (any answers)',
  'then': 'No product, strength, plan or price is shown before the wall. The product choice happens later, in the old /c/hl app (the server metadata says legacyPath "/c/hl"; the Sign In link goes to /c/hl?skipToSignIn=true&goFlow=true&flowId=hl), which is blocked here.',
  'effectType': 'none', 'affects': [], 'evidence': 'observed', 'proof': ALLRUNS + '; ' + B + '/net/01-GET-initialize.json', 'confidence': 'high'},
]
rids = {r['id'] for r in R}
d['rules'] = [r for r in d['rules'] if r['id'] not in rids] + R
for r in d['rules']:
    if r['id'] == 'R20':
        r['then'] += ' Stage 2 update: choosing Massachusetts or Washington on the anonymous state screen changes nothing (R25), so any such rule acts after the wall.'
    if r['id'] == 'R1':
        r['then'] += ' Code: the flow settings served by Hims\' flow server set minAge 18 (R27).'

json.dump(d, open(P, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('ok', len(d['flows']), 'flows', len(d['rules']), 'rules', len(d['experiments']), 'experiments')
