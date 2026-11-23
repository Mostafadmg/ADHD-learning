#!/usr/bin/env python3
"""s2_patch_text.py — one-off edit of tools/s2_text.py (run once, 23 Nov 2026, after the last stage 2 replays).

The annotation tables in s2_text.py were first written for a plan of 48 replays. 46 were run in the end, so every
sentence that named a replay that was not run, or that waited for the group tests, is rewritten here to match what
was actually replayed. Kept in the folder so the next investigator can see what was changed and why.
It refuses to run twice (it looks for its own marker).
"""
import os, sys, re
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), 's2_text.py')
s = open(p, encoding='utf8').read()
if '# patched by s2_patch_text.py' in s: sys.exit('already patched')
lines = s.split('\n')

def repline(prefix, new, count=1):
    hits = [i for i, l in enumerate(lines) if l.startswith(prefix)]
    if len(hits) != count: sys.exit(f'line prefix {prefix!r}: {len(hits)} hits')
    for i in hits: lines[i] = new

def rep(old, new):
    global lines
    t = '\n'.join(lines)
    if t.count(old) != 1: sys.exit(f'substring {old[:70]!r}: {t.count(old)} hits')
    lines = t.replace(old, new).split('\n')

# ---- VISTEXT: the allergy free-text run was not replayed as a one-change test
repline(" 's2-m-al-other':", " # (s2-m-al-other was planned but not run: the allergy free-text box is covered by the stage 1 scout runs/scout-men-3)")

# ---- question-level text
repline(" 'js': {", """ 'js': {'shownWhen': "not always: seen in {js}. The server adds or drops it at random (identical baseline answers gave visits with and without it), so it is an experiment on the site's side, not a branch.", 'branchDetail': "JS_BRANCH"},""")
repline(" 'pds-gender': {", """ 'pds-gender': {'branchDetail': "GENDER_BRANCH"},""")
repline(" 'ht': {", """ 'ht': {'branchDetail': "No change for any of the four hair types (Straight in the baselines; Wavy, Curly and Coily in group tests: runs/s2-m-sweep-1, runs/s2-m-sweep-2, runs/s2-w-sweep-1, runs/s2-w-sweep-2, runs/s2-w-sweep-3; Coily also in runs/scout-men-1)."},""")
repline(" 'hs': {", """ 'hs': {'shownWhen': "not always: seen in {hs}. The server adds or drops it at random between visits with identical answers.", 'branchDetail': "HS_BRANCH"},""")
repline(" 'ls': {", """ 'ls': {'shownWhen': "men's route only: seen in {ls}. Optional (Next works with nothing ticked).", 'branchDetail': "No change with any statement ticked (little sleep + major life event in the group test runs/s2-m-sweep-1; stress + weight loss in the stage 1 scout runs/scout-men-1). Recent weight loss, stress or a major life event (classic triggers of temporary shedding) do not add a question or advice."},""")
repline(" 'htaf': {", """ 'htaf': {'branchDetail': "'I have no hair loss or thinning' skips the timing question (runs/scout-women-2). No other option that was tried changes anything a visitor can see: patches of complete hair loss, eyebrows / sideburns / hairline, and thinning all over were each replayed as the only change (runs/s2-w-htaf-patches, runs/s2-w-htaf-eyebrows, runs/s2-w-htaf-allover); front of parting, temples and crown in group tests (runs/s2-w-sweep-1, runs/s2-w-sweep-2, runs/s2-w-sweep-3). No stop, no advice, no photo request, same £34.99 bag. 'My hairline is going further back / receding' and 'I don't know what kind of hair loss I have' were not chosen in any replay."},""")
repline(" 'htc': {", """ 'htc': {'branchDetail': "No change for any timing. 'Recently, in the past few weeks' was replayed as the only change on the men's route (runs/s2-m-htc-recent) and inside a group test on the women's route (runs/s2-w-sweep-3); 'Around three to six months ago' and 'Unsure' in group tests (runs/s2-m-sweep-1, runs/s2-m-sweep-2, runs/s2-w-sweep-1, runs/s2-w-sweep-2). Sudden recent loss gets no advice and no extra question."},""")
repline(" 'st': {", """ 'st': {'branchDetail': "No change for any of the six skin tones (Fair in the baselines; the other five in group tests: Pale runs/s2-m-sweep-1, Darker shade of pale runs/s2-m-sweep-2, Light brown runs/s2-m-sweep-3, Brown runs/s2-w-sweep-1, Dark brown or black runs/s2-w-sweep-2). Served at random as six buttons or a drag slider."},""")
repline(" 'sc': {", """ 'sc': {'branchDetail': "No change seen (Normal in the baselines; Oily in the group test runs/s2-m-sweep-3 and Dry in runs/s2-w-sweep-3; both also in stage 1 scouts)."},""")
repline(" 'mdm': {", """ 'mdm': {'branchDetail': "'Other' opens a required free-text box on the same screen (one-change replay runs/s2-m-mdm-other, with 'Vitamin D' typed). No option stops the flow or changes the bag: antidepressants / anti-anxiety medicine was replayed as the only change (runs/s2-m-mdm-antidep); BPH medicine and scalp steroids only in stage 1 multi-change scouts (runs/scout-men-2, runs/scout-men-3)."},""")
repline(" 'al': {", """ 'al': {'branchDetail': "'Other' opens a required free-text box (client-side rule in the step JSON; seen live in the stage 1 scout runs/scout-men-3). No stop and no change to the bag with a minoxidil allergy or a finasteride allergy as the only change (runs/s2-m-al-minoxidil, runs/s2-m-al-finasteride), or with every active ticked at once (runs/scout-men-3)."},""")
repline(" 'di': {", """ 'di': {'branchDetail': "No change for either answer: 'I want the discounted trial' does not alter the bag, the price or the promo text (group tests runs/s2-m-sweep-3 and runs/s2-w-sweep-3; stage 1 scout runs/scout-men-2)."},""")
repline(" 'yna': {", """ 'yna': {'shownWhen': "men's route, but not on every visit: seen in {yna}. The server drops it at random; the title also varies ('You're not alone' / 'Lots of people feel this way')."},
 'mi': {'shownWhen': "men's route only (sex assigned at birth = Male): seen in {mi}"},
 'dt': {'shownWhen': "women's route only (sex assigned at birth = Female): seen in {dt}"},
 'utt': {'shownWhen': "after the eligibility screen when the date of birth gives an age under 18 (men: 17 years 11 months as the only change, runs/s2-m-age-17; women: age 16 in the stage 1 scout runs/scout-women-1)"},""")

# ---- rules
rep("""    add('men', "htam / htaf = any pattern, including patches of complete hair loss, eyebrow / sideburn / hairline loss, extensive loss all over, or 'I don't know'; htc = 'Recently, in the past few weeks'", "Nothing visible: no stop, no advice to see a GP, no photo request, no extra question, and " + BAG + ". (The company blog tells people with patchy or sudden loss to 'speak with a medical professional'.)",
        'none', [], 'observed', NC('s2-m-htam-patches', 's2-m-htam-crown', 's2-m-htam-allover-ext', 's2-m-htc-recent', 's2-w-htaf-patches', 's2-w-htaf-eyebrows', 's2-w-htaf-allover', 's2-w-htaf-receding', 's2-w-htaf-dontknow') + ' (each one change)', 'high')""",
    """    add('men', "htam / htaf = patches of complete hair loss, crown, extensive loss all over (men); patches, eyebrow / sideburn / hairline loss, thinning all over (women); htc = 'Recently, in the past few weeks'", "Nothing visible: no stop, no advice to see a GP, no photo request, no extra question, and " + BAG + ". (The company's own blog tells people with patchy or sudden loss to 'speak with a medical professional' and to 'seek help from your GP or a dermatologist' for bald patches or rapid loss.)",
        'none', [], 'observed', NC('s2-m-htam-patches', 's2-m-htam-crown', 's2-m-htam-allover-ext', 's2-m-htc-recent', 's2-w-htaf-patches', 's2-w-htaf-eyebrows', 's2-w-htaf-allover') + ' (each one change); other pictures in group tests ' + P('s2-m-sweep-1', 's2-m-sweep-2', 's2-m-sweep-3', 's2-w-sweep-1', 's2-w-sweep-2', 's2-w-sweep-3') + "; women's 'receding hairline' and 'I don't know' not tested", 'high')""")
rep("""    add('men', "mdm = antidepressants / anti-anxiety medicine, or BPH medicine; al = minoxidil allergy (each alone)", "Nothing visible: no stop, no warning, and " + BAG + ". A man allergic to minoxidil who chose The Capsules is still offered the same 'Personalised treatment'.",
        'flag-for-clinician', MINOX + ['drp-fin02'], 'observed', NC('s2-m-mdm-antidep', 's2-m-mdm-bph', 's2-m-al-minoxidil') + ' (each one change) ; ' + P('scout-men-3') + ' (every allergy ticked, scout)', 'high')""",
    """    add('men', "mdm = antidepressants / anti-anxiety medicine; al = minoxidil allergy; al = finasteride allergy (each alone)", "Nothing visible: no stop, no warning, and " + BAG + ". A man allergic to minoxidil who chose The Capsules (every capsule contains minoxidil) is still walked to the same 'Personalised treatment'.",
        'flag-for-clinician', MINOX + ['drp-fin02'], 'observed', NC('s2-m-mdm-antidep', 's2-m-al-minoxidil', 's2-m-al-finasteride') + ' (each one change) ; ' + P('scout-men-2', 'scout-men-3') + ' (BPH medicine, scalp steroids and every allergy ticked together: stage 1 scouts)', 'high')""")
rep("""        'extra-questions', [], 'observed', P('s2-m-mdm-other') + ' (one change) ; ' + P('scout-men-3', 'scout-women-2') + ' ; client-side rule in the step JSON (code)', 'high')""",
    """        'extra-questions', [], 'observed', P('s2-m-mdm-other') + ' (one change: medicines) ; ' + P('scout-men-3', 'scout-women-2') + ' (allergies and the women\\'s medicines list, stage 1 scouts) ; client-side rule in the step JSON (code)', 'high')""")
rep("""        'soft-warning', CAPS, 'observed', P('s2-m-pt-yes') + ' (one change) ; ' + P('scout-men-2', 'scout-women-2') + ' (scouts); warning text is a client-side rule in the step JSON (code)', 'high')""",
    """        'soft-warning', CAPS, 'observed', P('s2-m-pt-yes') + ' (one change) against the men\\'s baseline pool ; ' + P('scout-men-2', 'scout-women-2') + ' (scouts, men and women); the warning text is a client-side rule in the step JSON (code), the badge is added by the server', 'high')""")

# ---- recommendations
rep("""BPH, BPH medicine, antidepressants, minoxidil allergy, active scalp infection or scalp eczema / psoriasis",""",
    """BPH, antidepressants, minoxidil allergy, finasteride allergy, active scalp infection or scalp eczema / psoriasis",""")
rep("""No warning, no stop and no change for any of these (17 one-change replays, for example""", """No warning, no stop and no change for any of these (14 one-change replays, for example""")
rep(""" {'profile': "Man or woman with a hair-loss picture that is not pattern hair loss: patches of complete loss, eyebrow / sideburn / hairline loss, sudden recent loss, 'I don't know', or no hair loss at all",""",
    """ {'profile': "Man or woman with a hair-loss picture that is not pattern hair loss: patches of complete loss, eyebrow / sideburn / hairline loss, sudden recent loss, or no hair loss at all",""")
rep("""(runs/s2-m-htam-patches, runs/s2-w-htaf-patches, runs/s2-w-htaf-eyebrows, runs/s2-m-htc-recent, runs/s2-w-htaf-dontknow, runs/scout-men-none)""",
    """(runs/s2-m-htam-patches, runs/s2-w-htaf-patches, runs/s2-w-htaf-eyebrows, runs/s2-m-htc-recent, runs/scout-men-none)""")

lines.append('# patched by s2_patch_text.py (final run set: 46 stage 2 replays)')
open(p, 'w', encoding='utf8').write('\n'.join(lines))
print('patched', p)
