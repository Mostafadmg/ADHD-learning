import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * One screen that replaces eight condition questions.
 * Every group is required. Selections restore when the patient comes back.
 * This card owns Continue so Next cannot skip unanswered groups.
 */

declare global {
  interface Window {
    pathwai?: {
      flow?: {
        getAnswers?: () => Record<string, unknown>;
        next?: (val?: unknown) => void;
      };
    };
  }
}

const BLOCK_ALIAS = 'block-strut-conditions';
const STORAGE_KEY = 'strut.enclo.conditions';
const NONE = 'none';

const GROUPS = [
  {
    id: 'diagnosticSuitability',
    title: 'Diagnostic Suitability & Testosterone History',
    prompt: 'Do you have any of the following testosterone or hormone-related conditions?',
    options: [
      { id: 'low-t-confirmed', label: 'Low testosterone confirmed by at least two morning blood draws' },
      { id: 'primary-testicular-failure', label: 'Diagnosed primary testicular failure or high LH/FSH levels' },
      { id: 'testicular-history', label: 'History of undescended testicle, mumps orchitis, or testicular injury' },
      { id: 'recent-trt', label: 'Current or recent use (within 6 months) of TRT, steroids, or SARMs' },
      { id: 'pelvic-surgery', label: 'Past surgery or radiation to the pelvic or groin area' },
      { id: NONE, label: 'None of the above' },
    ],
  },
  {
    id: 'cardiovascularRisks',
    title: 'Cardiovascular Risks & Conditions',
    prompt: 'Do you have any of the following cardiovascular risks or conditions?',
    options: [
      { id: 'uncontrolled-bp', label: 'Uncontrolled high blood pressure (systolic 140mmHg or diastolic 90mmHg)' },
      { id: 'cholesterol-heart-attack', label: 'Elevated cholesterol or history of heart attack' },
      { id: 'heart-failure', label: 'Congestive heart failure or frequent swelling in ankles/feet' },
      { id: 'arrhythmia', label: 'Abnormal heartbeat, arrhythmias, or heart valve problems' },
      { id: 'sleep-apnea', label: 'Diagnosed untreated sleep apnea (OSA)' },
      { id: NONE, label: 'None of the above' },
    ],
  },
  {
    id: 'clottingNeurological',
    title: 'Blood Clotting & Neurological Conditions',
    prompt: 'Do you have any of the following circulation or neurological conditions?',
    options: [
      { id: 'dvt-pe', label: 'History of blood clot in legs (DVT) or lungs (PE)' },
      { id: 'clotting-disorder', label: 'Diagnosed clotting disorder (e.g., Factor V Leiden, thrombophilia)' },
      { id: 'stroke', label: 'History of stroke or "mini-stroke" (TIA)' },
      { id: 'syncope', label: 'History of unexplained fainting or blacking out (syncope)' },
      { id: 'paralysis', label: 'History of paralysis, severe limb weakness, or chronic bed rest' },
      { id: NONE, label: 'None of the above' },
    ],
  },
  {
    id: 'prostateCancer',
    title: 'Prostate & Cancer Screening',
    prompt: 'Do you have any of the following prostate or cancer conditions?',
    options: [
      { id: 'prostate-cancer', label: 'Personal history of prostate cancer' },
      { id: 'elevated-psa', label: 'Elevated PSA level (> 4.0 ng/mL or abnormal for age)' },
      { id: 'breast-cancer', label: 'History of male breast cancer' },
      { id: 'active-cancer', label: 'Ongoing treatment for any active cancer' },
      { id: 'urinary-blockage', label: 'Severe urinary blockage or active prostate infection' },
      { id: NONE, label: 'None of the above' },
    ],
  },
  {
    id: 'pituitaryVision',
    title: 'Pituitary & Vision Screening',
    prompt: 'Do you have any of the following pituitary or vision conditions?',
    options: [
      { id: 'pituitary-tumor', label: 'Diagnosed pituitary tumor, adenoma, or prolactinoma' },
      { id: 'high-prolactin', label: 'High prolactin levels on a previous blood test' },
      { id: 'brain-radiation', label: 'History of brain radiation or pituitary surgery' },
      { id: 'vision-loss', label: 'Unexplained vision loss, blind spots, or tunnel vision' },
      { id: 'visual-flashes', label: 'History of visual flashes, floaters, or recurring sudden blurriness' },
      { id: NONE, label: 'None of the above' },
    ],
  },
  {
    id: 'liverMetabolic',
    title: 'Liver & Metabolic Conditions',
    prompt: 'Do you have any of the following liver or organ conditions?',
    options: [
      { id: 'cirrhosis', label: 'Cirrhosis or severe liver disease' },
      { id: 'hepatitis', label: 'Active hepatitis (viral, autoimmune, or toxic)' },
      { id: 'fatty-liver', label: 'Fatty liver disease (NAFLD or NASH)' },
      { id: 'high-enzymes', label: 'Known high liver enzymes (elevated AST or ALT)' },
      { id: 'kidney', label: 'History of severe kidney disease or kidney failure' },
      { id: NONE, label: 'None of the above' },
    ],
  },
  {
    id: 'thyroid',
    title: 'Thyroid Conditions',
    prompt: 'Do you have any of the following thyroid conditions?',
    options: [
      { id: 'hypo-stable', label: 'Underactive thyroid (Hypothyroidism / Hashimoto’s) — stable on medication' },
      { id: 'hypo-unstable', label: 'Underactive thyroid — untreated, newly diagnosed, or recent dose change' },
      { id: 'hyperthyroid', label: 'Overactive thyroid (Hyperthyroidism / Graves’ disease)' },
      { id: 'thyroid-cancer', label: 'History of thyroid cancer (treated and stable)' },
      { id: 'goiter', label: 'Enlarged thyroid (goiter) or pending nodule biopsy' },
      { id: NONE, label: 'None of the above' },
    ],
  },
  {
    id: 'fertility',
    title: 'Fertility Goals',
    prompt: 'Do you have any of the following personal factors?',
    options: [
      { id: 'trying-to-conceive', label: 'Currently trying to conceive or seeking to preserve fertility' },
      { id: 'vasectomy', label: 'Completed vasectomy or no desire for future children' },
      { id: 'high-hematocrit', label: 'Known high hematocrit / thick blood (Hematocrit > 50–52%)' },
      { id: 'gynecomastia', label: 'Breast tissue tenderness, swelling, or gynecomastia' },
      { id: NONE, label: 'None of the above' },
    ],
  },
];

type Group = (typeof GROUPS)[number];
type Selections = Record<string, string[]>;

type Props = {
  onChange?: (out: Record<string, unknown>) => void;
};

function emptySelections(): Selections {
  const next: Selections = {};
  GROUPS.forEach((group) => { next[group.id] = []; });
  return next;
}

function idsFrom(value: unknown, groupId: string): string[] {
  const group = GROUPS.find((item) => item.id === groupId);
  if (!group) return [];
  const allowed = new Set(group.options.map((option) => option.id));
  const raw = Array.isArray(value)
    ? value.map((item) => String(item))
    : typeof value === 'string'
      ? value.split(/[,;]/).map((item) => item.trim()).filter(Boolean)
      : [];
  return raw.filter((id) => allowed.has(id));
}

function idsFromLabels(value: unknown, groupId: string): string[] {
  const group = GROUPS.find((item) => item.id === groupId);
  if (!group || typeof value !== 'string' || !value.trim()) return [];
  const parts = value.split(';').map((part) => part.trim()).filter(Boolean);
  const found: string[] = [];
  parts.forEach((label) => {
    const match = group.options.find(
      (option) => option.label === label || option.label.toLowerCase() === label.toLowerCase()
    );
    if (match && !found.includes(match.id)) found.push(match.id);
  });
  return found;
}

function applyRecord(target: Selections, record: Record<string, unknown>) {
  const selections = record.selections && typeof record.selections === 'object'
    ? record.selections as Record<string, unknown>
    : record;
  GROUPS.forEach((group) => {
    const fromIds = idsFrom(selections[group.id] ?? record[group.id], group.id);
    const fromLabels = idsFromLabels(record[`${group.id}Labels`], group.id);
    const next = fromIds.length ? fromIds : fromLabels;
    if (next.length) target[group.id] = next;
  });
}

function looksLikeConditions(record: Record<string, unknown>): boolean {
  return GROUPS.some((group) => group.id in record || `${group.id}Labels` in record || 'selections' in record);
}

function walkAnswers(value: unknown, depth: number, hit: (record: Record<string, unknown>) => void) {
  if (depth > 6 || value == null) return;
  if (Array.isArray(value)) {
    value.forEach((item) => walkAnswers(item, depth + 1, hit));
    return;
  }
  if (typeof value !== 'object') return;
  const record = value as Record<string, unknown>;
  if (looksLikeConditions(record)) hit(record);
  if (record[BLOCK_ALIAS] && typeof record[BLOCK_ALIAS] === 'object') {
    hit(record[BLOCK_ALIAS] as Record<string, unknown>);
  }
  Object.values(record).forEach((nested) => walkAnswers(nested, depth + 1, hit));
}

function readFromStorage(): Selections | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const next = emptySelections();
    applyRecord(next, parsed as Record<string, unknown>);
    return GROUPS.some((group) => next[group.id].length > 0) ? next : null;
  } catch {
    return null;
  }
}

function writeStorage(current: Selections) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payloadFor(current)));
  } catch { /* ignore */ }
}

function readSaved(): Selections {
  const next = emptySelections();
  try {
    const answers = window.pathwai?.flow?.getAnswers?.() || {};
    const direct = answers[BLOCK_ALIAS];
    if (direct && typeof direct === 'object' && !Array.isArray(direct)) {
      applyRecord(next, direct as Record<string, unknown>);
    }
    walkAnswers(answers, 0, (record) => applyRecord(next, record));
  } catch { /* ignore */ }

  if (GROUPS.every((group) => next[group.id].length === 0)) {
    const stored = readFromStorage();
    if (stored) return stored;
  }
  return next;
}

/** Flat id/label strings; callers wrap under BLOCK_ALIAS for PathwAI persistence. */
function payloadFor(current: Selections): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  GROUPS.forEach((group) => {
    const ids = current[group.id] || [];
    const labels = ids
      .map((id) => group.options.find((option) => option.id === id)?.label || '')
      .filter(Boolean);
    payload[group.id] = ids.join(', ');
    payload[`${group.id}Labels`] = labels.join('; ');
  });
  return payload;
}

function missingGroups(current: Selections): string[] {
  return GROUPS.filter((group) => !(current[group.id] || []).length).map((group) => group.id);
}

const STYLES = `
.strut-cond {
  width: 100%;
  padding: 0 12px 12px;
  box-sizing: border-box;
  font-family: var(--pw-font-family-body, "Basis Grotesque Pro", ui-sans-serif, system-ui, -apple-system, sans-serif);
  color: #1c1c21;
}
.strut-cond *, .strut-cond *::before, .strut-cond *::after { box-sizing: border-box; }
.strut-cond__grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.strut-cond__group {
  width: 100%;
  margin: 0;
  padding: 10px 12px 6px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  background: #fff;
}
.strut-cond__title {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1.3;
  color: #6b6578;
}
.strut-cond__prompt {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: #161336;
}
.strut-cond__options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
}
.strut-cond__row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  width: 100%;
  margin: 0;
  padding: 3px 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: #222222;
  font: inherit;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.25;
  text-align: left;
}
.strut-cond__row:hover { background: #fafafa; }
.strut-cond__row.is-checked { background: rgba(22, 19, 54, 0.05); }
.strut-cond__box {
  width: 16px;
  height: 16px;
  margin-top: 1px;
  border: 1.5px solid #c8c8c8;
  border-radius: 3px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}
.strut-cond__row.is-checked .strut-cond__box {
  border-color: #161336;
  background: #161336;
}
.strut-cond__tick {
  width: 8px;
  height: 5px;
  border-left: 1.5px solid #fff;
  border-bottom: 1.5px solid #fff;
  transform: rotate(-45deg) translateY(-1px);
}
.strut-cond__row:focus-visible {
  outline: 2px solid #161336;
  outline-offset: 2px;
}
.strut-cond__error {
  margin: 16px 0 0;
  padding: 12px 14px;
  border-radius: 8px;
  background: #fef2f2;
  color: #7f1d1d;
  font-size: 12px;
  line-height: 1.45;
}
.strut-cond__actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
.strut-cond__btn {
  width: 100%;
  max-width: 320px;
  height: auto;
  padding: 0.625rem 1.5rem;
  border: none;
  border-radius: var(--pw-radius, 0.5rem);
  font: inherit;
  font-size: var(--pw-font-size-body, 1rem);
  font-weight: 600;
  font-family: var(--pw-font-family-body, system-ui, sans-serif);
  color: var(--pw-button-fg, #ffffff);
  background: var(--pw-button-bg, var(--pw-color-brand, #2563eb));
  cursor: pointer;
}
.strut-cond__continue:disabled { opacity: 0.5; cursor: not-allowed; }
@media (max-width: 420px) {
  .strut-cond__options { grid-template-columns: 1fr; }
  .strut-cond__btn { max-width: none; }
}
`;

export default function EncloConditionsCard({ onChange }: Props) {
  const [selected, setSelected] = useState<Selections>(readSaved);
  const [error, setError] = useState<string | null>(null);
  const [showMissing, setShowMissing] = useState(false);
  const onChangeRef = useRef(onChange);
  const advancedRef = useRef(false);
  onChangeRef.current = onChange;

  const publish = useCallback((current: Selections) => {
    const payload = payloadFor(current);
    writeStorage(current);
    // Nest under BLOCK_ALIAS — PathwAI persists this shape (flat onChange was dropped from submissions).
    onChangeRef.current?.({ [BLOCK_ALIAS]: payload });
  }, []);

  useEffect(() => {
    const saved = readSaved();
    setSelected(saved);
    publish(saved);
  }, [publish]);

  const toggle = (groupId: string, optionId: string) => {
    setError(null);
    setSelected((current) => {
      const picked = new Set(current[groupId] || []);
      let next: Selections;
      if (optionId === NONE) {
        next = { ...current, [groupId]: picked.has(NONE) ? [] : [NONE] };
      } else {
        picked.delete(NONE);
        if (picked.has(optionId)) picked.delete(optionId);
        else picked.add(optionId);
        next = { ...current, [groupId]: Array.from(picked) };
      }
      if (showMissing && missingGroups(next).length === 0) setShowMissing(false);
      publish(next);
      return next;
    });
  };

  const submit = () => {
    const missing = missingGroups(selected);
    if (missing.length) {
      setShowMissing(true);
      setError('Please answer every question before continuing.');
      const first = document.getElementById(`strut-cond-${missing[0]}`);
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (advancedRef.current) return;
    advancedRef.current = true;
    const payload = payloadFor(selected);
    const wrapped = { [BLOCK_ALIAS]: payload };
    writeStorage(selected);
    // Must nest + pass to next() — bare next() after flat onChange stopped writing node-18 to submissions.
    onChange?.(wrapped);
    try {
      window.pathwai?.flow?.next?.(wrapped);
    } catch { /* ignore */ }
  };

  return (
    <div className="strut-cond">
      <style>{STYLES}</style>
      <div className="strut-cond__grid">
        {GROUPS.map((group: Group) => (
          <section className="strut-cond__group" key={group.id}>
            <p className="strut-cond__title">{group.title}</p>
            <h2 className="strut-cond__prompt" id={`strut-cond-${group.id}`}>{group.prompt}</h2>
            <div className="strut-cond__options" role="group" aria-labelledby={`strut-cond-${group.id}`}>
              {group.options.map((option) => {
                const checked = (selected[group.id] || []).includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`strut-cond__row${checked ? ' is-checked' : ''}`}
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => toggle(group.id, option.id)}
                  >
                    <span className="strut-cond__box">{checked ? <span className="strut-cond__tick" /> : null}</span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {error ? <div className="strut-cond__error" role="alert">{error}</div> : null}

      <div className="strut-cond__actions">
        <button type="button" className="strut-cond__btn strut-cond__continue" onClick={submit}>Continue</button>
      </div>
    </div>
  );
}

export const propSchema = {};

export const outputSchema = {
  diagnosticSuitability: { type: 'string', title: 'Diagnostic suitability (ids)' },
  diagnosticSuitabilityLabels: { type: 'string', title: 'Do you have any of the following testosterone or hormone-related conditions?' },
  cardiovascularRisks: { type: 'string', title: 'Cardiovascular risks (ids)' },
  cardiovascularRisksLabels: { type: 'string', title: 'Do you have any of the following cardiovascular risks or conditions?' },
  clottingNeurological: { type: 'string', title: 'Circulation and neurological conditions (ids)' },
  clottingNeurologicalLabels: { type: 'string', title: 'Do you have any of the following circulation or neurological conditions?' },
  prostateCancer: { type: 'string', title: 'Prostate and cancer conditions (ids)' },
  prostateCancerLabels: { type: 'string', title: 'Do you have any of the following prostate or cancer conditions?' },
  pituitaryVision: { type: 'string', title: 'Pituitary and vision conditions (ids)' },
  pituitaryVisionLabels: { type: 'string', title: 'Do you have any of the following pituitary or vision conditions?' },
  liverMetabolic: { type: 'string', title: 'Liver and organ conditions (ids)' },
  liverMetabolicLabels: { type: 'string', title: 'Do you have any of the following liver or organ conditions?' },
  thyroid: { type: 'string', title: 'Thyroid conditions (ids)' },
  thyroidLabels: { type: 'string', title: 'Do you have any of the following thyroid conditions?' },
  fertility: { type: 'string', title: 'Fertility and personal factors (ids)' },
  fertilityLabels: { type: 'string', title: 'Do you have any of the following personal factors?' },
};
