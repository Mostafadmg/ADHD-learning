# Stage 2: builds one answer file per experiment in runs/s2/<id>.json from a profile.
# Usage: python3 -I tools/make-exps.py            (writes every file; prints the ids)
# Each experiment = baseline profile + ONE changed answer (plus neutral answers to any question the change opens).
import json, os, copy
base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = os.path.join(base, 'runs', 's2'); os.makedirs(out, exist_ok=True)
# The plain start URL is split-tested by the site (it redirects at random). This is the variant stage 1 was given;
# pinning it makes every replay comparable. All three variants seen are described in notes.md.
START = "https://www.form.happyhead.com/get-started-now/?l=false&email_capture=sms_capture&ph=true&_stsgnoredir=1"

MAN = dict(goal=["I want to regrow a receding hairline"], duration="1-3 years", family="Yes", sex="Male",
           pattern=["Thinning at the hairline", "Thinning all over"], pattern_text=None,
           method="I’m not sure / I don’t have a preference", choose="CHOOSE DUAL TREATMENT",
           prior=["None of the above"], prior_text=None, reaction=None, reaction_text=None,
           symptoms=["None of the above"], symptoms_text=None,
           preg=None, bc=None, bc_text=None, whynot=None, whynot_text=None,
           household="No", disclosure=None, meds="No", meds_text=None, allergies="No", allergies_text=None,
           doctor="Within the last year", bp="Normal (Around 120 / 80)", weight="100-200 pounds",
           conditions=["None"], conditions_text=None, dob=("1994", "Jun", "15"),
           custom="No, let the doctor customize it for me", custom_text=None, anything=None, stop="end", start=START)
WOMAN = dict(MAN, goal=["I want fuller, healthier-looking hair"], sex="Female under 50",
             pattern=["Thinning along my part", "Thinning all over"], preg="Yes", bc=["Oral contraceptives"],
             dob=("1988", "Jun", "15"))

def click(t, **k): return dict({"do": "click", "text": t}, **k)
def text(v): return {"do": "fill", "selector": "textarea:visible, input[type=text]:visible", "value": v}
NEXT = click("NEXT")

def steps(p):
    s = [{"do": "wait", "ms": 2500}, click("GET MY CUSTOM PLAN")]
    s += [click(g) for g in p["goal"]] + [NEXT]
    s += [click(p["duration"]), click(p["family"]), click(p["sex"])]
    s += [click(x) for x in p["pattern"]] + [NEXT]
    if p["pattern_text"]: s += [text(p["pattern_text"]), NEXT]
    s += [click(p["method"]), click("Take Me to My Plan"), {"do": "wait", "ms": 14000}, {"do": "scroll"}]
    if p["stop"] == "reco": return s
    s += [click(p["choose"]), {"do": "wait", "ms": 3500}]
    excl = lambda l: l in (["None of the above"], ["None"])
    s += [click(x) for x in p["prior"]] + ([] if excl(p["prior"]) else [NEXT])
    if p["prior_text"]: s += [text(p["prior_text"]), NEXT]
    if p["reaction"]:
        s += [click(p["reaction"])]
        if p["reaction_text"]: s += [text(p["reaction_text"]), NEXT]
    s += [click(x) for x in p["symptoms"]] + ([] if excl(p["symptoms"]) else [NEXT])
    if p["symptoms_text"]: s += [text(p["symptoms_text"]), NEXT]
    if p["preg"]:
        s += [click(p["preg"])]
        if p["bc"]: s += [click(x) for x in p["bc"]] + ([text(p["bc_text"])] if p["bc_text"] else []) + [NEXT]
        if p["whynot"]: s += [click(p["whynot"])] + ([text(p["whynot_text"]), NEXT] if p["whynot_text"] else [])
    s += [click(p["household"])]
    if p["disclosure"]: s += [click(p["disclosure"], exact=False)]
    if p["stop"] == "household": return s
    s += [click(p["meds"])] + ([text(p["meds_text"]), NEXT] if p["meds_text"] else [])
    s += [click(p["allergies"])] + ([text(p["allergies_text"]), NEXT] if p["allergies_text"] else [])
    if p["doctor"]: s += [click(p["doctor"]), click(p["bp"]), click(p["weight"])]
    s += [click(x) for x in p["conditions"]] + ([] if excl(p["conditions"]) else [NEXT])
    if p["conditions_text"]: s += [text(p["conditions_text"]), NEXT]
    y, m, d = p["dob"]
    s += [click(None, selector='input[placeholder="Year"]'), click(y), click(None, selector='input[placeholder="Month"]'), click(m),
          click(None, selector='input[placeholder="Day"]'), click(d)]
    for x in s:
        if x.get("text") is None and "selector" in x: x.pop("text", None)
    if p["stop"] == "dob-noclick": return s + [{"do": "wait", "ms": 1500}]
    s += [NEXT]
    if p["stop"] == "dob": return s + [{"do": "wait", "ms": 2500}]
    s += [click(p["custom"])]
    if p["custom_text"]: s += [text(p["custom_text"]), NEXT]
    if p["anything"]: s += [text(p["anything"]), NEXT]
    return s + [{"do": "wait", "ms": 3000}]

E = {}
def exp(id, flow, changed, basep, **chg):
    p = copy.deepcopy(basep); p.update(chg); E[id] = dict(flow=flow, changed=changed, profile=p)

exp("base-men", "main", "none (baseline man, pinned start URL)", MAN)
exp("base-women", "main", "none (baseline woman, pinned start URL)", WOMAN)
# --- answers that could change the offer: end at the recommendation screen ---
exp("m-method-oral", "main", "m-method: Not sure → Oral", MAN, method="Oral (ingested by mouth)", stop="reco")
exp("m-method-topical", "main", "m-method: Not sure → Topical", MAN, method="Topical (applied directly to the scalp)", stop="reco")
exp("w-50plus", "main", "m-sexage: Female under 50 → Female 50 or older", WOMAN, sex="Female 50 or older", stop="reco")
exp("w-method-oral", "main", "m-method (woman): Not sure → Oral", WOMAN, method="Oral (ingested by mouth)", stop="reco")
exp("w-method-topical", "main", "m-method (woman): Not sure → Topical", WOMAN, method="Topical (applied directly to the scalp)", stop="reco")
exp("m-goal-exploring", "main", "m-goals: regrow hairline → I'm just exploring my options", MAN, goal=["I'm just exploring my options"], stop="reco")
exp("m-goal-prevent", "main", "m-goals: regrow hairline → I want to prevent future hair loss", MAN, goal=["I want to prevent future hair loss"], stop="reco")
exp("m-duration-lt6m", "main", "m-duration: 1-3 years → Less than 6 months", MAN, duration="Less than 6 months", stop="reco")
exp("m-family-no", "main", "m-family: Yes → No", MAN, family="No", stop="reco")
exp("m-pattern-prevent", "main", "m-pattern-male: hairline + all over → None, I'm trying to prevent hair loss", MAN, pattern=["None, I'm trying to prevent hair loss"], stop="reco")
exp("m-pattern-patches", "main", "m-pattern-male: + Bald patches", MAN, pattern=["Thinning at the hairline", "Thinning all over", "Bald patches"], stop="reco")
exp("m-pattern-other", "main", "m-pattern-male: + Another pattern of hair loss (free text answered neutrally)", MAN, pattern=["Thinning at the hairline", "Thinning all over", "Another pattern of hair loss"], pattern_text="Thinning at the temples", stop="reco")
exp("w-pattern-patches", "main", "m-pattern-female: + Bald patches", WOMAN, pattern=["Thinning along my part", "Thinning all over", "Bald patches"], stop="reco")
# --- product choice and medical answers: run to the email page ---
exp("m-choose-topical", "main", "m-reco: Dual Treatment → Topical only", MAN, choose="CHOOSE TOPICAL", doctor=None)
exp("m-oral-choose-capsule", "main", "m-method: Oral, then m-reco: SuperCapsule only", MAN, method="Oral (ingested by mouth)", choose="CHOOSE SUPERCAPSULE")
exp("m-household-yes-accept", "main", "m-household-preg: No → Yes, then 'Yes, I accept these risks'", MAN, household="Yes", disclosure="I accept these risks")
exp("m-household-yes-decline", "main", "m-household-preg: No → Yes, then 'No, I do not accept these risks'", MAN, household="Yes", disclosure="I do not accept these risks")
exp("w-household-yes", "main", "m-household-preg (woman under 50): No → Yes (stopped on the screen that follows)", WOMAN, household="Yes", stop="household")
exp("m-dob-under18", "main", "m-dob: 1994 → 2010 (age 16)", MAN, dob=("2010", "Jun", "15"), stop="dob-noclick")
exp("m-dob-70", "main", "m-dob: 1994 → 1956 (age 70)", MAN, dob=("1956", "Jun", "15"))
exp("w-dob-mismatch", "main", "m-dob (woman under 50): 1988 → 1970 (age 56, does not match band)", WOMAN, dob=("1970", "Jun", "15"), stop="dob")
exp("m-cond-heart", "main", "m-conditions: None → Heart condition (free text answered)", MAN, conditions=["Heart condition"], conditions_text="High blood pressure, treated")
exp("m-bp-low", "main", "m-bp: Normal → Low (Below 100 / 65)", MAN, bp="Low (Below 100 / 65)")
exp("m-prior-oralfin-reaction", "main", "m-prior: None → Oral Finasteride, then m-reactions: Yes (free text)", MAN, prior=["Oral Finasteride (Propecia/Proscar™)"], reaction="Yes", reaction_text="Lower sex drive while taking it")
exp("m-symptoms-itch", "main", "m-symptoms: None → Severe itching, burning, or rash on my scalp (free text answered)", MAN, symptoms=["Severe itching, burning, or rash on my scalp"], symptoms_text="Itchy, red scalp for a month")
exp("m-meds-yes", "main", "m-meds: No → Yes (free text)", MAN, meds="Yes", meds_text="Lisinopril 10 mg daily")
exp("m-allergy-minoxidil", "main", "m-allergies: No → Yes, text 'Minoxidil'", MAN, allergies="Yes", allergies_text="Minoxidil")
exp("w-preg-no-postmeno", "main", "m-preg-ability: Yes → No, then 'I am post menopausal'", WOMAN, preg="No", bc=None, whynot="I am post menopausal")
exp("w-bc-none", "main", "m-birth-control: Oral contraceptives → None of the above", WOMAN, bc=["None of the above"])
exp("m-custom-yes", "main", "m-custom: No → Yes (asks for finasteride instead of dutasteride)", MAN, custom="Yes, I have a customization request", custom_text="Finasteride instead of dutasteride please", anything="None")
exp("w-50plus-full", "main", "m-sexage: Female under 50 → Female 50 or older (birth year moved to 1970 to match; other answers as baseline)", WOMAN, sex="Female 50 or older", dob=("1970", "Jun", "15"))

for id, e in E.items():
    spec = {"start": e["profile"]["start"], "locale": "en-US", "timezone": "America/New_York", "exp": {"id": id, "flow": e["flow"], "changed": e["changed"]}, "steps": steps(e["profile"])}
    json.dump(spec, open(os.path.join(out, id + ".json"), "w"), indent=1, ensure_ascii=False)
json.dump({k: {"flow": v["flow"], "changed": v["changed"]} for k, v in E.items()}, open(os.path.join(out, "_experiments.json"), "w"), indent=1, ensure_ascii=False)
print(len(E), "experiments:", " ".join(E))
