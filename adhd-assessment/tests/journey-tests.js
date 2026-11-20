/* Journey engine tests (AA.journey). Called by tests/run.js as require('./journey-tests.js')(ctx)
   with ctx = { AA, ok, eq } after the core, engines and the real data are loaded (data validation phase),
   so the engine is checked against the real step list, the real data and both demo patients. */
'use strict';
const fs = require('fs');
const path = require('path');
module.exports = function (ctx) {
  const AA = ctx.AA, ok = ctx.ok;
  const eq = ctx.eq || ((a, b, m) => ok(a === b, m + ' (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')'));
  const J = AA.journey, D = AA.diagnosis;
  ok(!!J, 'journey: AA.journey is loaded');
  if (!J) return;
  const clone = (x) => JSON.parse(JSON.stringify(x));

  /* The engine's step order must match the step list the frame shows. */
  const frame = fs.readFileSync(path.join(__dirname, '..', 'js', 'views', 'assess-frame.js'), 'utf8');
  const frameSteps = [...frame.matchAll(/\{ id: '([a-z0-9]+)', title: '[^']*', short: '[^']*', lead: '[^']*', phase: '([a-z]+)' \}/g)].map((m) => [m[1], m[2]]);
  eq(frameSteps.length, J.ORDER.length, 'journey: same number of steps as the frame');
  ok(frameSteps.every((s, i) => J.ORDER[i] && J.ORDER[i].id === s[0] && J.ORDER[i].phase === s[1]), 'journey: step ids and phases match assess-frame.js, in order');

  /* ---------- a blank record ---------- */
  const blank = { patient: { ref: '', age: null, consent: false, informants: {}, sources: {}, young: {} }, step: 'setup', tools: {}, risk: {}, history: {}, symptoms: {}, supplement: {}, onset: {}, impairment: { adult: {}, child: {} }, collateral: {}, ddx: {}, validity: {}, formulation: {}, treatment: {} };
  let s = J.summary(blank);
  eq(s.steps.length, 19, 'journey blank: 19 steps');
  eq(s.done, 0, 'journey blank: nothing done');
  eq(s.next, 'setup', 'journey blank: next is setup');
  eq(s.steps[0].state, 'todo', 'journey blank: setup is to do');
  ok(J.step(blank, 'setup').gaps.join('|') === 'Patient reference|Age|Consent recorded', 'journey blank: setup gaps name each missing item');
  ok(s.ready === false && s.openNeeded > 0, 'journey blank: not ready to sign off');
  eq(J.step(blank, 'baseline').state, 'na', 'journey blank: pre-treatment checks are not applicable before a decision');
  ok(typeof J.step(blank, 'txplan').blocked === 'string', 'journey blank: treatment plan waits for the diagnosis');
  ok(s.attention.length === 0, 'journey blank: no attention items');
  ok(s.gapCount > 0 && s.steps.every((x) => x.state === 'done' || x.state === 'na' || x.gaps.length > 0), 'journey blank: every open step explains what is missing');

  /* ---------- both demo patients ---------- */
  [['demo', AA.data.demo], ['demoYoung', AA.data.demoYoung]].forEach(([name, rec]) => {
    if (!rec) return;
    const a = clone(rec);
    const sm = J.summary(a);
    ok(sm.steps.every((st) => {
      const pr = D.stepProgress(a, st.id);
      const na = pr.of === 0;
      const want = na ? 'na' : pr.done >= pr.of ? 'done' : pr.done > 0 ? 'part' : 'todo';
      return st.state === want && st.done === pr.done && st.of === pr.of;
    }), name + ': every step status agrees with stepProgress');
    ok(sm.steps.every((st) => (st.state === 'done' || st.state === 'na') === (st.gaps.length === 0)), name + ': a step has gaps exactly when it is open');
    eq(sm.pct, Math.round(sm.done / sm.of * 100), name + ': percent = done of applicable');
    eq(sm.of + sm.na, 19, name + ': applicable + not applicable = 19');
    ok(J.index(sm.current) >= 0, name + ': current step is a known step');
    ok(sm.next === null || sm.steps[J.index(sm.next)].state !== 'done', name + ': next is never a finished step');
    ok(sm.phases.length === 5 && sm.phases.every((ph) => ph.of === ph.steps.filter((x) => x.state !== 'na').length), name + ': phase totals count applicable steps');

    /* remove an answer: the step reopens and the gap names it */
    const b = clone(rec);
    b.patient.consent = false;
    const sb2 = J.step(b, 'setup');
    ok(sb2.state !== 'done' && sb2.gaps.indexOf('Consent recorded') > -1, name + ': removing consent reopens setup with a named gap');
    const c = clone(rec);
    c.risk = Object.assign({}, c.risk, { reviewed: false });
    ok(J.step(c, 'risk').gaps.length === 1 && J.summary(c).neededSteps.indexOf('risk') > -1, name + ': an unreviewed safety step is a needed gap');
    const e = clone(rec);
    e.step = 'setup';
    delete e.formulation;
    e.formulation = {};
    const se = J.summary(e);
    ok(se.steps[J.index('summary')].state !== 'done' && se.steps[J.index('summary')].gaps.indexOf('Diagnostic decision recorded') > -1, name + ': without a decision the diagnosis step is open');
    ok(typeof J.step(e, 'txplan').blocked === 'string', name + ': without a decision the treatment plan is blocked');
    ok(se.next !== null && J.index(se.next) >= 0, name + ': there is always somewhere to go next while work is open');
  });

  /* ---------- safety attention ---------- */
  const risky = clone(AA.data.demo || blank);
  const urgent = ((AA.data.risk && AA.data.risk.items) || []).filter((it) => it.level === 'urgent')[0];
  if (urgent) {
    risky.risk = Object.assign({}, risky.risk, { [urgent.id]: true });
    const sr = J.summary(risky);
    ok(sr.attention.some((x) => x.level === 'stop' && x.step === 'risk'), 'journey safety: an urgent risk answer is a stop item on the risk step');
    ok(sr.stop === true && sr.ready === false, 'journey safety: an urgent flag stops sign-off');
    ok(J.step(risky, 'risk').attention.length >= 1, 'journey safety: the risk step carries its own attention item');
  } else ctx.ok(false, 'journey safety: no urgent risk item in the data to test with');

  /* an urgent finding clears to a warning once the safety step is reviewed and the action is written down */
  if (urgent) {
    const hd = clone(AA.data.demo || blank);
    hd.risk = Object.assign({}, hd.risk, { [urgent.id]: true, reviewed: true, action: 'Crisis team contacted, plan agreed' });
    const sh = J.summary(hd);
    ok(sh.attention.some((x) => x.step === 'risk' && x.level === 'warn') && !sh.attention.some((x) => x.step === 'risk' && x.level === 'stop'), 'journey safety: reviewed with an action recorded is a warning, not a stop');
    const hn = clone(hd); hn.risk.action = '';
    ok(J.summary(hn).stop === true, 'journey safety: reviewed without a recorded action is still a stop');
  }
  /* a deferred diagnosis is not ready */
  if (AA.data.demo) {
    const df = clone(AA.data.demo); df.formulation = Object.assign({}, df.formulation, { decision: 'deferred' });
    const sd = J.summary(df);
    ok(sd.deferred === true && sd.ready === false && sd.next !== null, 'journey: a deferred diagnosis is not ready and points back to the diagnosis step');
  }
  /* children and young people need an informant */
  if (AA.data.demoYoung) {
    const yc = clone(AA.data.demoYoung);
    eq(J.step(yc, 'collateral').need, true, 'journey: collateral is needed for a child');
  }
  eq(J.step(clone(AA.data.demo || blank), 'collateral').need, false, 'journey: collateral is good practice for an adult');

  const later = clone(blank);
  later.symptoms = { ia1: { adult: 'yes' } };
  ok(J.attention(later).some((x) => x.step === 'risk' && x.level === 'warn'), 'journey safety: work started with no safety review gives a warning');

  /* ---------- age bands ---------- */
  const u6 = clone(blank);
  u6.patient.age = 4; u6.patient.ref = 'Q'; u6.patient.consent = true;
  const s6 = J.summary(u6);
  ok(s6.steps.filter((x) => x.state !== 'na').map((x) => x.id).join() === 'setup,risk,report', 'journey under 6: only setup, safety and the referral note are open');
  ok(s6.attention.some((x) => x.level === 'refer') && s6.stop === false && s6.refer === true, 'journey under 6: refer is its own level, not a safety stop');
  const u6done = clone(u6); u6done.risk = { reviewed: true }; u6done.formulation = { reportReviewed: true };
  ok(J.summary(u6done).ready === true && J.summary(u6done).pct === 100, 'journey under 6: setup, safety and referral note done is ready to sign off');
  eq(s6.of, 3, 'journey under 6: three applicable steps');

  /* ---------- robustness ---------- */
  let threw = false;
  try { J.summary(null); J.summary({}); J.step(undefined, 'ia'); J.attention({ patient: null }); } catch (err) { threw = true; }
  ok(!threw, 'journey: copes with null and empty records');
};
