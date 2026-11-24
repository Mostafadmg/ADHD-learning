#!/usr/bin/env python3
"""stage2b_text.py: summary texts after the /g/i/hl experiments. Run after stage2b_patch.py. Safe to run again."""
import json
P = 'company.json'
d = json.load(open(P, encoding='utf8'))
B = 'runs/s2b-baseline-men-gi'
a = d['access']
a['accountWall'] = ('Reached at the state screen of the newer intake (https://www.hims.com/g/i/hl/select-state), after 14 anonymous '
    'screens: Continue stays disabled until the visitor ticks "I agree to the Terms and Conditions and Telehealth Consent". '
    'This research did not tick it, so the next screen was not seen. Signs that the account comes next: every screen has '
    '"Already have an account? Sign In", which goes to the old app (/c/hl?skipToSignIn=true&goFlow=true&flowId=hl), and the '
    'flow settings say legacyPath "/c/hl" and hold the date-of-birth rule (18 to 120) that the anonymous part never asks. '
    'The old app at /c/hl itself is blocked here (Cloudflare refuses its scripts).')
note = ('Stage 2 found that the newer intake at https://www.hims.com/g/i/hl loads normally (it is drawn by flow-server.hims.com, '
        'not by the blocked /c/hl scripts). It was walked and experimented on: see flow men-gi.')
if note not in a['blockers']:
    a['blockers'].append(note)
e2 = ('The flow server sometimes answered with Hims\' own "Something went wrong! ... Please try again" screen on the first '
      'question (4 of 20 replays in this stage). Each failed run was retried once after 30 seconds; one option (expectations "Keep the hair I have") failed twice and was left.')
if e2 not in a['blockers']:
    a['blockers'].append(e2)
a['coverageNote'] = ('Stage 1 mapped the catalogue and walked a landing-page pre-quiz. Stage 2 (experiment) found the newer anonymous '
    'intake at /g/i/hl, replayed its baseline, and ran 12 one-change replays plus 2 multi-change sweeps over the 11 hair '
    'questions (34 of 40 options seen live) and 5 state replays (Texas, California, Massachusetts, Washington, AA, AP). '
    'Result: no hair answer changes anything; military mail states are refused; everything stops at the Terms and Telehealth '
    'Consent tick-box, which was not ticked. The pre-quiz was also tested (every option, no effect). NOT seen: the account step, '
    'date of birth, the medical form, photos, the recommendation, strengths, plan prices and any medical stop screen; the old '
    '/c/hl app stays blocked; Hers (women) stays blocked. The served flow data holds one screen at a time, not a full quiz '
    'definition, so no branch conditions could be read from code.')

# recommendations
d['recommendations'] = [r for r in d['recommendations'] if not r['profile'].startswith('Newer intake')]
d['recommendations'][0:0] = [
 {'profile': 'Newer intake (/g/i/hl): baseline man (regrow, hairline, some loss, over a year, family history yes, sometimes stressed, short straight hair, no styling, Texas)',
  'offered': [], 'default': '',
  'note': 'No product is shown before the wall. The last anonymous screen is the state screen with the Terms and Telehealth Consent tick-box. The only product talk is generic: "Prescription treatments can help you ... grow visibly thicker, fuller hair in just 3 to 6 months."',
  'evidence': 'observed'},
 {'profile': 'Newer intake: any one-change variant of the hair answers (receding or get ahead, top or all over, a lot or a little, recent onset, no family history, stressed all the time, no hair, buzzed, protective styles, 10+ minutes, and others)',
  'offered': [], 'default': '', 'note': 'Identical to the baseline man: same screens, same end, no product (rule R21).', 'evidence': 'observed'},
 {'profile': 'Newer intake: man whose state is AA or AP (US armed forces mail)',
  'offered': [], 'default': '', 'note': 'Stopped: "Currently, we don\'t offer this product in your state" (rule R23). Puerto Rico and other territories are not in the list at all (R24).', 'evidence': 'observed'},
]
for r in d['recommendations']:
    if r['profile'].startswith('Baseline man in the real consultation'):
        r['note'] = r['note'] + ' Stage 2: the anonymous part of the newer intake (/g/i/hl) names no product for this man; the offer is made after the Terms and Telehealth Consent tick-box, which was not passed.'

# products
RX = {'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p9'}
add = (' Stage 2: the anonymous intake (/g/i/hl) names no product for any answer tested, so the choice is made after the account '
       'wall; refused for AA/AP addresses (R23) and under 18 (R27).')
for p in d['products']:
    if p['id'] in RX and 'Stage 2: the anonymous intake' not in p['recommendedWhen']:
        p['recommendedWhen'] += add

d['engineSummary'] = (
 'Hims US runs its hair consultation on a server-driven flow engine (flow-server.hims.com): the browser sends each answer and '
 'the server returns the next screen, one at a time. The anonymous part (hims.com/g/i/hl) is 11 questions about goals, where '
 'and how much hair is lost, when it started, hoped-for results, hair type and length, family history, stress and styling, '
 'with three education screens. It has no logic that a visitor can see: in 12 one-change replays and 2 sweeps, no answer added, '
 'removed or reworded a screen, raised a warning or named a product. Hims says so itself on screen one: the quiz "is not a '
 'medical assessment" and is not shared with a provider; the answers are kept with an anonymous session for personalisation. '
 'The first real gate is the state screen: armed-forces mail addresses (AA, AP) are refused, territories are not listed, and '
 'nobody can go on without agreeing to the Terms and the Telehealth Consent. After that (not seen, and the old /c/hl app that '
 'carries it is blocked here) Hims\' public pages describe an account, date of birth (the served settings enforce 18 or over), '
 'a medical form built as a tree of follow-up questions, photos in most cases, and a pre-selected recommended product and dose '
 'that the customer may change, with plan length setting the price. The medical exclusions are published only as "who should '
 'not use" lists, and a licensed provider, not the software, makes the prescribing decision within about 48 hours.')

def addl(key, items):
    for x in items:
        if x not in d[key]:
            d[key].append(x)
addl('strengths', [
 'A short, friendly anonymous quiz (14 screens, about 2 minutes) with plain words, pictures and "Choose as many as you\'d like"; it builds commitment before asking for anything.',
 'Honest label on screen one: the quiz "is not a medical assessment" and is not shared with a provider.',
 'State check is live and immediate: an unsupported address gets a clear message before any account is made.',
])
addl('weaknesses', [
 'The 11-question anonymous intake has no clinical logic: diffuse loss, onset "in the past few months", "no" family history, constant stress, braids or locs, and "I don\'t have hair" all get the same screens and the same "prescription treatments can help" message.',
 'The education screen says "family history" and "stress" cause the loss even to a man who answered "No" family history or "Rarely" stressed: the copy is fixed, not personal.',
 'Answers are stored server-side with a session id before any consent or account, while the visitor is told they are not a medical assessment.',
 'No age, sex, pregnancy or medical question comes before the Terms and Telehealth Consent; a person who would be refused (under 18, a woman, a man with a contraindication) only finds out after signing up.',
])
addl('opportunities', [
 'Put the deal-breakers first: ask age, sex, current finasteride use and the main contraindications before asking for consent or an account, so nobody signs up to be refused.',
 'Make the anonymous answers matter: route sudden, diffuse or patchy loss, recent onset and traction styles (braids, locs) to a different path or an in-person check, which Hims does not do.',
 'Show a provisional recommendation and price before the account, with the reason ("because you said hairline, over a year, family history"); Hims shows neither.',
 'Serve armed-forces (APO/FPO) and territory customers, whom Hims turns away.',
])
d['limitations'] = [l for l in d['limitations'] if not l.startswith('The men\'s consultation was not seen at all') and not l.startswith('No one-change experiment exists')]
addl('limitations', [
 'The newer intake (/g/i/hl) was tested only up to the state screen: the Terms and Telehealth Consent tick-box was not ticked, so the account step, the medical form, any medical stop screen, the recommendation, strengths and plan prices were not seen.',
 'Not replayed (6 of 40 hair options): start "In the past year", expectations "More scalp coverage" and "Keep the hair I have" (two site errors), hair type "Textured or processed", length "Medium", style "I usually wear a hat". Marked inferred. Of the states, only Texas, California, Massachusetts, Washington, AA and AP were tried.',
 'Some options were seen only in multi-change sweeps (runs/exp-gi-14-all-different, runs/s2-gi-explore-2); a sweep cannot rule out two effects cancelling, though no screen differed at all.',
 'The flow server sends one screen at a time, so there is no full quiz definition to read. Its step numbers skip 1, 3, 7 and 8, which may be screens shown to other visitors (tests, other entry points); none appeared in any replay.',
 'Desktop browser, locale en-US, timezone America/New_York, one day (23 Nov 2026). Hims runs many experiments, so another visitor may see a different version.',
])
for s in d['sources']:
    pass
if not any(s.get('url') == 'https://www.hims.com/g/i/hl' for s in d['sources']):
    d['sources'].append({'title': 'Hims hair-loss intake, newer flow (anonymous part walked 23 Nov 2026)', 'url': 'https://www.hims.com/g/i/hl'})
json.dump(d, open(P, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('ok')
