#!/usr/bin/env python3
"""Stage 2: build one-change answer files from baseline-men.json.
Each file is the baseline with exactly one answer changed. Labels are taken from quiz-definition.json
(the flow definition the site served), so the wording is the site's own.
Usage: python3 -I scripts/make_experiments.py   (run from companies/hims-uk)
Writes experiments/<exp-id>.json and experiments/index.json."""
import json, copy, os
base = json.load(open('baseline-men.json'))
qd = json.load(open('quiz-definition.json'))['anonymousFlow']['steps']
qs = [s for s in qd if s.get('options')]
# index of the click in baseline-men.json steps for each question, in question order
STEP_IDX = [0, 1, 2, 3, 4, 6, 7, 10, 11, 14, 15]
assert len(qs) == 11
index = []
n = 0
for qi, (q, si) in enumerate(zip(qs, STEP_IDX), start=1):
    base_label = base['steps'][si]['text']
    labels = [o['label'] for o in q['options']]
    assert base_label in labels, (base_label, labels)
    for o in q['options']:
        if o['label'] == base_label:
            continue
        n += 1
        eid = 'exp-%02d' % n
        e = copy.deepcopy(base)
        e['steps'][si]['text'] = o['label']
        e['_about'] = {
            'experiment': eid, 'flow': 'men', 'question': 'men-q%d' % qi, 'questionText': q['questionText'],
            'datapointKey': q['datapointKey'], 'baselineAnswer': base_label, 'changedTo': o['label'],
            'storedValue': o['value'], 'note': 'One-change replay: identical to baseline-men.json except this one answer.'
                + (' Multi-select: this option chosen on its own instead of the baseline option.' if q['stepType'] == 'MULTI_SELECT' else '')}
        json.dump(e, open('experiments/%s.json' % eid, 'w'), indent=1, ensure_ascii=False)
        index.append(e['_about'])
json.dump(index, open('experiments/index.json', 'w'), indent=1, ensure_ascii=False)
print(n, 'experiments written')
for a in index:
    print(a['experiment'], a['question'], '|', a['baselineAnswer'], '->', a['changedTo'], '(%s)' % a['storedValue'])
