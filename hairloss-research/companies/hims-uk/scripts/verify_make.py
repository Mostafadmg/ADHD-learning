#!/usr/bin/env python3
"""Stage 3 (verify): write the reviewer's own replay files into experiments/verify-*.json.
Built from baseline-men.json, independently of scripts/make_experiments.py.
Usage: python3 -I scripts/verify_make.py     (from companies/hims-uk)"""
import json, copy, os
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.dirname(here)
base = json.load(open(os.path.join(root, 'baseline-men.json'), encoding='utf-8'))
B = base['steps']
# index of each answer click in the baseline step list
IDX = {'q1': 0, 'q2': 1, 'q3': 2, 'q4': 3, 'q5': 4, 'q6': 6, 'q7': 7, 'q8': 10, 'q9': 11, 'q10': 14, 'q11': 15}
def one(changes):
    s = copy.deepcopy(B)
    for q, t in changes.items(): s[IDX[q]]['text'] = t
    return s
def click(t, settle=2500, **kw):
    d = {'do': 'click', 'text': t, 'settle': settle}; d.update(kw); return d
out = {}
def add(name, steps, changed, why, start=None):
    out[name] = {'start': start or base['start'], 'steps': steps, '_about': {'experiment': name, 'stage': 'verify', 'changed': changed, 'why': why}}

add('verify-01-no-hair', one({'q6': 'I don’t have hair'}), "men-q6: 'Straight or wavy' → 'I don’t have hair'", 'Re-test of rule R22 (warning-sign answers cause no stop).')
add('verify-02-past-few-months', one({'q4': 'In the past few months'}), "men-q4: 'Over a year ago' → 'In the past few months'", 'Re-test of R22 and R20 (summary line).')
add('verify-03-all-over', one({'q2': 'All over'}), "men-q2: 'Along the hairline' → 'All over'", 'Re-test of R22 and R20.')
add('verify-04-none-of-above', one({'q1': 'None of the above'}), "men-q1: 'Experiencing hair loss, ready to start treatment' → 'None of the above'", 'Re-test of R22 and R21.')
add('verify-05-a-lot', one({'q3': 'A lot'}), "men-q3: 'Some' → 'A lot'", 'Random re-test of R1/R21.')
add('verify-06-protective-styles', one({'q10': 'Protective styles'}), "men-q10: 'No styling' → 'Protective styles'", 'Random re-test of R1/R20.')
# R23: 'All of the above' after an ordinary tick
s = copy.deepcopy(B); s.insert(5, click('All of the above', 1200))
add('verify-07-all-above-clears', s, "men-q5: tick 'Visibly thicker, fuller hair', then 'All of the above'", 'Re-test of R23.')
add('verify-08-skip-quiz', [{'do': 'wait', 'ms': 4000}], 'entry: sign-up address opened directly, no quiz', 'Re-test of R25.', start='https://app.forhims.co.uk/start/signup?t=hair')
s = copy.deepcopy(B) + [{'do': 'goto', 'url': 'https://www.forhims.co.uk/c/hl'}, {'do': 'wait', 'ms': 6000}]
add('verify-09-return', s, 'after finishing the baseline quiz, /c/hl is opened again in the same browser', 'Re-test of R26.')
# NEW: contradictory answers (no consistency check?)
add('verify-10-contradictory', one({'q1': 'No hair loss yet, want to get ahead of it', 'q3': 'A lot', 'q6': 'I don’t have hair', 'q7': 'Long', 'q8': 'Not sure', 'q9': 'Not sure'}),
    "men-q1 'No hair loss yet…' + men-q3 'A lot' + men-q6 'I don’t have hair' + men-q7 'Long' + men-q8 'Not sure' + men-q9 'Not sure' (answers that contradict each other)",
    'New: is there any consistency check or reaction to contradictory answers?')
# NEW: go back and change an answer
s = copy.deepcopy(B); s[2:2] = [click('←', 2500), click('At the top', 2500)]
add('verify-11-back-change', s, "men-q2 answered 'Along the hairline', then the back arrow on the next screen, then men-q2 changed to 'At the top'",
    'New (listed as untested by stage 2): does going back and changing an answer work, and does the summary show the new answer?')
# NEW: 'Delete my answers' part-way
s = copy.deepcopy(B[:4]) + [click('Your answers', 2000), click('Delete my answers', 4000), {'do': 'wait', 'ms': 4000}, {'do': 'goto', 'url': 'https://www.forhims.co.uk/c/hl'}, {'do': 'wait', 'ms': 6000}]
add('verify-12-delete-answers', s, "four answers given, then 'Your answers' → 'Delete my answers', then /c/hl opened again",
    'New (listed as untested by stage 2): what the delete button does. It removes the anonymous answers only; nothing is typed.')
# NEW: multi-select edge cases
s = copy.deepcopy(B[:4]) + [click('Visibly thicker, fuller hair', 1200), click('Visibly thicker, fuller hair', 1200), click('All of the above', 1200), click('More scalp coverage', 1200), click('Keep the hair I have', 1200)] + copy.deepcopy(B[5:])
add('verify-13-multi-edge', s, "men-q5: tick then untick one box; tick 'All of the above', then 'More scalp coverage', then 'Keep the hair I have'",
    'New: does unticking disable Continue again, and does an ordinary tick clear ‘All of the above’?')
# NEW: all four ordinary goals ticked (not 'All of the above')
s = copy.deepcopy(B[:4]) + [click('A stronger, defined hairline', 1200), click('Visibly thicker, fuller hair', 1200), click('More scalp coverage', 1200), click('Keep the hair I have', 1200)] + copy.deepcopy(B[5:])
add('verify-14-multi-all-four', s, "men-q5: all four ordinary goals ticked by hand (not 'All of the above')", 'New: is a hand-made full list treated like ‘All of the above’?')
# NEW: finished quiz, then delete answers from the wall? (the wall has no 'Your answers' menu, so: return, then check)
os.makedirs(os.path.join(root, 'experiments'), exist_ok=True)
for k, v in out.items():
    json.dump(v, open(os.path.join(root, 'experiments', k + '.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('wrote', len(out), 'files:', ', '.join(out))
