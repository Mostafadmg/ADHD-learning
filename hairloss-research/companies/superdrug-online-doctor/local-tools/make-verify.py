#!/usr/bin/env python3
"""Stage 3 (VERIFY): writes actions/verify-*.json from the baseline answer files.
Each file changes one thing (or, for the combination checks, a named set of things) from the baseline.
Run from the company folder: python3 local-tools/make-verify.py
"""
import json, copy, os

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def load(f): return json.load(open(os.path.join(HERE, f)))
MEN = load('baseline-men.json'); WREG = load('baseline-women-regaine.json'); WNOUR = load('baseline-women-nourkrin.json')

def C(sel): return {"do": "click", "selector": sel}
def F(sel, v): return {"do": "fill", "selector": sel, "value": v}

def variant(base, about, replace=None, after=None):
    """replace: {old_selector: [new steps]}; after: {anchor_selector: [steps inserted after it]}"""
    d = copy.deepcopy(base); steps = []
    for st in d['steps']:
        sel = st.get('selector')
        if replace and sel in replace: steps.extend(replace[sel])
        else: steps.append(st)
        if after and sel in after: steps.extend(after[sel])
    d['steps'] = steps; d['_about'] = 'STAGE 3 VERIFY: ' + about; d['_changed'] = about
    return d

M_PAT = "input[name='SingleChoice-option298000004'][value='3']"
M_Q1 = "input[name='SingleChoice-option439401001'][value='441308009']"
M_COND_NONE = "input[name='MultiChoice-option723'][value='728']"
M_ALL_NO = "input[name='49'][value='false']"
W_Q1_NONE = "input[name='MultiChoice-option717'][value='7729']"
W_BP_NO = "input[name='38341003'][value='false']"
W_HEART_NO = "input[name='719'][value='false']"
W_PREG_NO = "input[name='SingleChoice-option718'][value='7181']"
W_ALL_NO = "input[name='49'][value='false']"

def w_allergy(codes, extra=None):
    s = [C("input[name='49'][value='true']")] + [C(f"input[name='MultiChoice-option49.1'][value='{c}']") for c in codes]
    return {W_ALL_NO: s + (extra or [])}

out = {
  # baselines (fresh)
  'verify-base-wreg': copy.deepcopy(WREG) | {'_about': 'STAGE 3 VERIFY: baseline woman, Regaine entry', '_changed': 'none (baseline)'},
  'verify-base-wnour': copy.deepcopy(WNOUR) | {'_about': 'STAGE 3 VERIFY: baseline woman, Nourkrin entry', '_changed': 'none (baseline)'},
  'verify-base-men': copy.deepcopy(MEN) | {'_about': 'STAGE 3 VERIFY: baseline man (exp.js)', '_changed': 'none (baseline)'},
  # re-tests of the biggest rules
  'verify-m-patA': variant(MEN, 'men-q2 pattern C -> A (R1 photo stop)', {M_PAT: [C("input[name='SingleChoice-option298000004'][value='1']")]}),
  'verify-m-patE': variant(MEN, 'men-q2 pattern C -> E, warning ticked (R1/R2)', {M_PAT: [C("input[name='SingleChoice-option298000004'][value='5']"), C("input[name='Disclaimer-option2980000045']")]}),
  'verify-m-prostate': variant(MEN, 'men-q8 none -> prostate cancer (R9)', {M_COND_NONE: [C("input[name='MultiChoice-option723'][value='254900004']")]}),
  'verify-m-finallergy': variant(MEN, 'men-q11 allergy No -> Yes, finasteride (R10)', {M_ALL_NO: [C("input[name='49'][value='true']"), C("input[name='MultiChoice-option49.1'][value='386963006']")]}),
  'verify-w-bp': variant(WREG, 'women-q2 high blood pressure No -> Yes (R12)', {W_BP_NO: [C("input[name='38341003'][value='true']")]}),
  'verify-w-patchy': variant(WREG, 'women-q1 none -> sudden or patchy (R11)', {W_Q1_NONE: [C("input[name='MultiChoice-option717'][value='724']")]}),
  'verify-w-minox': variant(WREG, 'women-q7 allergy -> minoxidil (R14)', w_allergy(['101'])),
  'verify-w-fish': variant(WREG, 'women-q7 allergy -> fish (R15)', w_allergy(['117'])),
  'verify-w-caffeine': variant(WREG, 'women-q7 allergy -> caffeine (R16)', w_allergy(['118'])),
  'verify-w-pregnant': variant(WREG, 'women-q4 No -> I am pregnant (R17)', {W_PREG_NO: [C("input[name='SingleChoice-option718'][value='7182']")]}),
  # gaps never tested in stage 2
  'verify-w-combo3': variant(WREG, 'COMBINATION: women-q7 allergy -> minoxidil + fish + caffeine (does anything except the phone call survive? is there a stop?)', w_allergy(['101', '117', '118'])),
  'verify-w-combo-heart-fish': variant(WREG, 'COMBINATION: women-q2 high blood pressure Yes + allergy fish', {W_BP_NO: [C("input[name='38341003'][value='true']")], W_ALL_NO: w_allergy(['117'])[W_ALL_NO]}),
  'verify-m-patB': variant(MEN, 'men-q2 pattern C -> B (never replayed)', {M_PAT: [C("input[name='SingleChoice-option298000004'][value='2']")]}),
  'verify-m-specialist': variant(MEN, 'men-q1 self-diagnosis -> Yes, by a specialist (never replayed)', {M_Q1: [C("input[name='SingleChoice-option439401001'][value='48318009.1']")]}),
  'verify-m-skin': variant(MEN, 'men-q8 none -> any type of skin condition (details: Mild eczema on the arms) (never replayed)', {M_COND_NONE: [C("input[name='MultiChoice-option723'][value='95320005']"), F("textarea[id='729']", 'Mild eczema on the arms')]}),
  'verify-m-peanut': variant(MEN, 'men-q11 allergy -> peanuts or soya, warning ticked (never replayed)', {M_ALL_NO: [C("input[name='49'][value='true']"), C("input[name='MultiChoice-option49.1'][value='112']"), C("input[name='Disclaimer-option2004']")]}),
  'verify-m-othersub': variant(MEN, "men-q11 allergy -> other substances (details: Latex) (never replayed)", {M_ALL_NO: [C("input[name='49'][value='true']"), C("input[name='MultiChoice-option49.1'][value='116']"), F("textarea[id='49.3']", 'Latex')]}),
  'verify-w-shaved': variant(WREG, 'women-q1 none -> a shaved scalp (R11 second option)', {W_Q1_NONE: [C("input[name='MultiChoice-option717'][value='728']")]}),
}
for k, v in out.items():
    json.dump(v, open(os.path.join(HERE, 'actions', k + '.json'), 'w'), indent=1)
print('\n'.join(sorted(out)))
