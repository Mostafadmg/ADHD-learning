#!/usr/bin/env python3
# Stage 2 helper: build one-change answer files from the oral minoxidil baseline.
# Usage (from the strut folder): python3 -I scripts/make_exp.py   -> writes experiments/<exp-id>.json for every experiment below.
# Each experiment = the baseline answers with ONE answer changed (plus neutral answers to any new screen it opens).
import json, os, copy
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
START = 'https://start.struthealth.com/f/6aa3d578f415d1603a6e0c85'
C = lambda t, **k: dict({'do': 'click', 'text': t}, **k)
W = lambda ms=3000: {'do': 'wait', 'ms': ms}
# the baseline as named blocks, in screen order
BASE = [
 ('welcome',   [C('Continue')]),
 ('age',       [C('31-45')]),
 ('dose',      [C('Add to cart'), W()]),
 ('duration',  [C('Over 1 year')]),
 ('symptoms',  [C('Receding hairline'), C('Thinning on the top of the head'), C('Continue')]),
 ('scalp',     [C('None of the above'), C('Continue')]),
 ('tried',     [C('None of the above'), C('Continue')]),
 ('sexual',    [C('No')]),
 ('allergy',   [C('None of the above'), C('Continue')]),
 ('conditions',[C('None of the above'), C('Continue')]),
 ('surgery',   [C('No')]),
 ('meds',      [C('No')]),
 ('mood',      [C('No')]),
 ('interest',  [C('No')]),
 ('selfharm',  [C('No')]),
 ('warning',   [C('Continue')]),
 ('else',      [C('No')]),
 ('end',       [W()]),
]
def build(changes, cut_after=None, extra=None):
    steps = []
    for name, st in BASE:
        steps += copy.deepcopy(changes.get(name, st))
        if cut_after == name: break
    return steps + (extra or [])
TXT = lambda v: [{'do': 'fill', 'selector': 'textarea', 'value': v}, C('Continue')]
EXPS = {
 'baseline-us': ({}, None, 'Baseline man, locale en-US: no change.'),
 'exp-01-age-under18': ({'age': [C('Under 18'), W(2500)]}, 'age', 'age: 31-45 -> Under 18 (stop expected; walk ends at the stop screen)'),
 'exp-02-age-18-30': ({'age': [C('18-30')]}, None, 'age: 31-45 -> 18-30'),
 'exp-03-age-61plus': ({'age': [C('61+')]}, None, 'age: 31-45 -> 61+'),
 'exp-04-dose-1-25': ({'dose': [C('1.25 mg'), C('Add to cart'), W()]}, None, 'dose: 2.5 mg (pre-selected) -> 1.25 mg'),
 'exp-05-selfharm-yes': ({'selfharm': [C('Yes'), W(2500), C('Go back and update my answer'), W(2000)]}, 'selfharm', 'self-harm: No -> Yes (Safety Alert expected; then "Go back and update my answer")'),
 'exp-06-surgery-yes': ({'surgery': [C('Yes')] + TXT('Appendix removed in 2015, no problems since.')}, None, 'surgeries: No -> Yes (extra free-text screen answered neutrally)'),
 'exp-07-meds-yes': ({'meds': [C('Yes')] + TXT('Vitamin D 1000 IU once a day.')}, None, 'medicines: No -> Yes (extra free-text screen answered neutrally)'),
 'exp-08-else-yes': ({'else': [C('Yes')] + TXT('No other health problems.')}, None, 'anything else: No -> Yes (extra free-text screen answered neutrally)'),
 'exp-09-cond-heart-failure': ({'conditions': [C('Heart failure or heart disease'), C('Continue')]}, None, 'medical conditions: None -> Heart failure or heart disease'),
 'exp-10-cond-low-bp': ({'conditions': [C('Low blood pressure'), C('Continue')]}, None, 'medical conditions: None -> Low blood pressure'),
 'exp-11-cond-pheo': ({'conditions': [C('Pheochromocytoma'), C('Continue')]}, None, 'medical conditions: None -> Pheochromocytoma'),
 'exp-12-allergy-minoxidil': ({'allergy': [C('Minoxidil', exact=True), C('Continue')]}, None, 'allergies: None -> Minoxidil'),
 'exp-13-scalp-sudden': ({'scalp': [C('Sudden hair loss'), C('Continue')]}, None, 'scalp symptoms: None -> Sudden hair loss'),
 'exp-14-symptom-patchy': ({'symptoms': [C('Patchy bald spots'), C('Continue')]}, None, 'hair-loss symptoms: Receding hairline + Thinning on top -> Patchy bald spots only'),
 'exp-15-sexual-yes': ({'sexual': [C('Yes')]}, None, 'sexual dysfunction: No -> Yes'),
 'exp-16-mood-yes': ({'mood': [C('Yes')]}, None, 'mood concerns: No -> Yes'),
 'exp-17-interest-yes': ({'interest': [C('Yes')]}, None, 'lost interest (last 2 weeks): No -> Yes'),
 'exp-18-duration-1month': ({'duration': [C('1 month or less')]}, None, 'duration: Over 1 year -> 1 month or less'),
 'exp-19-tried-oral-minoxidil': ({'tried': [C('Minoxidil oral tablets'), C('Continue')]}, None, 'treatments tried: None -> Minoxidil oral tablets'),
 'exp-20-cond-heart-attack': ({'conditions': [C('Heart attack or coronary artery disease'), C('Continue')]}, None, 'medical conditions: None -> Heart attack or coronary artery disease'),
 'exp-21-cond-kidney': ({'conditions': [C('Kidney disease'), C('Continue')]}, None, 'medical conditions: None -> Kidney disease'),
 'exp-22-scalp-itch-lesions': ({'scalp': [C('Itching, pain, burning, or lesions'), C('Continue')]}, None, 'scalp symptoms: None -> Itching, pain, burning, or lesions'),
 'exp-23-symptom-diffuse-shedding': ({'symptoms': [C('Diffuse thinning (all over)'), C('Continue')]}, None, 'hair-loss symptoms: -> Diffuse thinning (all over) only'),
 'exp-24-cond-other': ({'conditions': [C('Other', exact=True), W(1500), C('Continue')]}, None, 'medical conditions: None -> Other (free-text box left empty)'),
 'exp-25-age-under18-end': ({'age': [C('Under 18'), W(2000), C('End questionnaire'), W(5000)]}, 'age', 'age: Under 18, then "End questionnaire" on the stop screen'),
 'exp-26-worst-case': ({'age': [C('61+')], 'duration': [C('1 month or less')],
                        'symptoms': [C('Patchy bald spots'), C('Continue')], 'scalp': [C('Sudden hair loss'), C('Bleeding'), C('Continue')],
                        'sexual': [C('Yes')], 'allergy': [C('Minoxidil', exact=True), C('Continue')],
                        'conditions': [C('Heart failure or heart disease'), C('Heart attack or coronary artery disease'), C('Stroke'), C('Low blood pressure'), C('Pheochromocytoma'), C('Kidney disease'), C('Continue')],
                        'mood': [C('Yes')], 'interest': [C('Yes')]}, None,
                       'NOT a one-change run: every high-risk answer at once (61+, 1 month, patchy, sudden loss + bleeding scalp, minoxidil allergy, six heart/BP/kidney conditions, mood Yes x2)'),
}
if __name__ == '__main__':
    os.makedirs(os.path.join(HERE, 'experiments'), exist_ok=True)
    for k, (ch, cut, note) in EXPS.items():
        spec = {'start': START, 'locale': 'en-US', 'timezone': 'America/Chicago', 'note': note, 'steps': build(ch, cut)}
        json.dump(spec, open(os.path.join(HERE, 'experiments', k + '.json'), 'w'), indent=1)
    print('wrote', len(EXPS), 'answer files to experiments/')
