#!/usr/bin/env python3
"""make-experiments.py — writes every stage-2 one-change answer file into actions/exp-*.json.
Each file = a baseline with ONE answer changed (follow-up boxes opened by the change are answered neutrally)."""
import json, copy, os
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
def load(n): return json.load(open(os.path.join(ROOT, n)))
def click(name, value=None):
    return {"do": "click", "selector": f"input[name='{name}']" + (f"[value='{value}']" if value is not None else "")}
def fill(i, v): return {"do": "fill", "selector": f"textarea[id='{i}']", "value": v}
def make(exp, base, changed, ops):
    d = load(base); steps = d['steps']
    for kind, key, new in ops:
        idx = [i for i, s in enumerate(steps) if s.get('selector', '').startswith(f"input[name='{key}']")]
        assert len(idx) == 1, (exp, key, idx)
        i = idx[0]
        if kind == 'replace': steps[i:i+1] = new
        else: steps[i+1:i+1] = new
    d['_changed'] = changed; d['_about'] = f'ONE-CHANGE EXPERIMENT {exp} from {base}: {changed}'
    json.dump(d, open(os.path.join(ROOT, 'actions', exp + '.json'), 'w'), indent=2)
W = 'baseline-women-regaine.json'; WN = 'baseline-women-nourkrin.json'; M = 'baseline-men.json'
X = []
def w(exp, changed, ops, base=W): X.append((exp, base, changed, ops))
# ---- women (Regaine entry, service 147757) ----
w('exp-w01', "women-q4 pregnant or breastfeeding: No -> I'm pregnant", [('replace', 'SingleChoice-option718', [click('SingleChoice-option718', '7182')])])
w('exp-w02', "women-q4 pregnant or breastfeeding: No -> I'm breastfeeding", [('replace', 'SingleChoice-option718', [click('SingleChoice-option718', '7184')])])
w('exp-w03', "women-q2 high blood pressure: No -> Yes", [('replace', '38341003', [click('38341003', 'true')])])
w('exp-w04', "women-q3 heart condition: No -> Yes (details box filled neutrally: 'Occasional palpitations, checked by GP, no treatment needed')", [('replace', '719', [click('719', 'true'), fill('719.1', 'Occasional palpitations, checked by GP, no treatment needed')])])
w('exp-w05', "women-q1: none of the above -> a shaved scalp", [('replace', 'MultiChoice-option717', [click('MultiChoice-option717', '728')])])
w('exp-w06', "women-q1: none of the above -> sudden or patchy hair loss", [('replace', 'MultiChoice-option717', [click('MultiChoice-option717', '724')])])
w('exp-w07', "women-q1: none of the above -> skin problems on the scalp", [('replace', 'MultiChoice-option717', [click('MultiChoice-option717', '725')])])
w('exp-w08', "women-q1: none of the above -> hair loss associated with childbirth", [('replace', 'MultiChoice-option717', [click('MultiChoice-option717', '726')])])
w('exp-w09', "women-q5 other health conditions: No -> Yes (details: 'Hay fever')", [('replace', '1153', [click('1153', 'true'), fill('1154', 'Hay fever')])])
w('exp-w10', "women-q6 taking medication: No -> Yes (details: 'Cetirizine 10mg once a day' / 'Hay fever')", [('replace', '47', [click('47', 'true'), fill('48', 'Cetirizine 10mg once a day'), fill('48.1', 'Hay fever')])])
for n, (code, lab) in enumerate([('101', 'Minoxidil'), ('117', 'Fish'), ('118', 'Caffeine'), ('119', 'Ethanol'), ('120', 'Propylene glycol'), ('112', 'Peanuts or Soya'), ('47703008', 'Lactose'), ('111', 'Penicillin')], start=11):
    w(f'exp-w{n:02d}', f"women-q7 allergies: No -> Yes, women-q7a = {lab} only", [('replace', '49', [click('49', 'true'), click('MultiChoice-option49.1', code)])])
w('exp-w19', "women-q7 allergies: No -> Yes, women-q7a = Other medication only (details: 'Ibuprofen')", [('replace', '49', [click('49', 'true'), click('MultiChoice-option49.1', '115'), fill('49.3', 'Ibuprofen')])])
w('exp-w20', "women-q7 allergies: No -> Yes, women-q7a = Other substance only (details: 'Latex')", [('replace', '49', [click('49', 'true'), click('MultiChoice-option49.1', '116'), fill('49.3', 'Latex')])])
# ---- women (Nourkrin entry, service 147778): do the same rules apply? ----
w('exp-w21', "Nourkrin entry, women-q4: No -> I'm pregnant", [('replace', 'SingleChoice-option718', [click('SingleChoice-option718', '7182')])], WN)
w('exp-w22', "Nourkrin entry, women-q7 allergies: No -> Yes, women-q7a = Fish only", [('replace', '49', [click('49', 'true'), click('MultiChoice-option49.1', '117')])], WN)
# ---- men (service 147929) ----
def m(exp, changed, ops): X.append((exp, M, changed, ops))
m('exp-m01', "men-q2 hair pattern: C -> E (warning tick ticked; NO photos uploaded)", [('replace', 'SingleChoice-option298000004', [click('SingleChoice-option298000004', '5'), click('Disclaimer-option2980000045')])])
m('exp-m02', "men-q2 hair pattern: C -> A (no visible loss; NO photos uploaded)", [('replace', 'SingleChoice-option298000004', [click('SingleChoice-option298000004', '1')])])
m('exp-m03', "men-q8 conditions: None of the above -> Prostate cancer", [('replace', 'MultiChoice-option723', [click('MultiChoice-option723', '254900004')])])
m('exp-m04', "men-q8 conditions: None of the above -> Breast cancer", [('replace', 'MultiChoice-option723', [click('MultiChoice-option723', '254837009')])])
m('exp-m05', "men-q8 conditions: None of the above -> Liver condition (details: 'Fatty liver found on a scan, liver blood tests normal')", [('replace', 'MultiChoice-option723', [click('MultiChoice-option723', '235856003'), fill('729', 'Fatty liver found on a scan, liver blood tests normal')])])
m('exp-m06', "men-q11 allergies: No -> Yes, men-q11a = Finasteride only", [('replace', '49', [click('49', 'true'), click('MultiChoice-option49.1', '386963006')])])
m('exp-m07', "men-q7 always get and keep an erection: Yes -> No", [('replace', '021106', [click('021106', 'false')])])
m('exp-m08', "men-q6 other scalp changes: No -> Yes (details: 'Itchy, flaky scalp')", [('replace', '716', [click('716', 'true'), fill('716.1', 'Itchy, flaky scalp')])])
m('exp-m09', "men-q5 how it started: Gradually -> Suddenly (follow-up boxes: 'Not sure' / 'Noticed more hair in the shower over two weeks')", [('replace', 'SingleChoice-option602', [click('SingleChoice-option602', '162463006'), fill('162463006.1', 'Not sure'), fill('162463006.2', 'Noticed more hair in the shower over two weeks')])])
m('exp-m10', "men-q4 first noticed: More than a month ago -> In the last month", [('replace', 'SingleChoice-option276131009', [click('SingleChoice-option276131009', '1')])])
m('exp-m11', "men-q3 currently using finasteride: No -> Yes (follow-up: 'Yes, it has slowed the loss. No side effects.'); men-q3b is no longer shown", [('replace', '2304202', [click('2304202', 'true'), fill('2304202.1', 'Yes, it has slowed the loss. No side effects.')]), ('replace', '23042020', [])])
m('exp-m12', "men-q1 diagnosed: No, self-diagnosis -> Yes, by my GP", [('replace', 'SingleChoice-option439401001', [click('SingleChoice-option439401001', '48318009')])])
m('exp-m13', "men-q10 taking medication: No -> Yes (details: 'Cetirizine 10mg once a day' / 'Hay fever')", [('replace', '47', [click('47', 'true'), fill('48', 'Cetirizine 10mg once a day'), fill('48.1', 'Hay fever')])])
m('exp-m14', "men-q3b taken finasteride before: No -> Yes (follow-up: 'It worked but I had low mood and reduced sex drive, so I stopped')", [('replace', '23042020', [click('23042020', 'true'), fill('23042020.1', 'It worked but I had low mood and reduced sex drive, so I stopped')])])
for x in X: make(*x)
json.dump([{'id': e, 'base': b, 'changed': c} for e, b, c, _ in X], open(os.path.join(ROOT, 'actions', 'experiments-index.json'), 'w'), indent=1)
print(len(X), 'experiment files written')
