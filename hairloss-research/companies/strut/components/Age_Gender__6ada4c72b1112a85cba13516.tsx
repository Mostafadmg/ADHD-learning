import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Age and gender step for PathwAI flows.
 * Gender, then age, each as a single-choice list. Both are required.
 * Continue stores age and gender on the step output so routing can read them.
 * Gender ids: 1 male, 2 female. Age ids: under-18, 18-30, 31-45, 46-60, 61-plus.
 */

declare global {
  interface Window {
    pathwai?: {
      flow?: {
        getAnswers?: () => Record<string, unknown>;
        next?: (val?: unknown) => void;
        back?: () => void;
        previous?: () => void;
      };
    };
  }
}

const BLOCK_ALIAS = 'block-strut-age-gender';

const AGE_OPTIONS = [
  { id: 'under-18', label: 'Under 18' },
  { id: '18-30', label: '18-30' },
  { id: '31-45', label: '31-45' },
  { id: '46-60', label: '46-60' },
  { id: '61-plus', label: '61+' },
];

const GENDERS = [
  { id: '1', label: 'Male' },
  { id: '2', label: 'Female' },
];

type Props = {
  onChange?: (out: Record<string, unknown>) => void;
};

function textOf(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function fromRecord(raw: unknown): { age: string; gender: string } | null {
  if (!raw || typeof raw !== 'object') return null;
  const saved = raw as Record<string, unknown>;
  const age = textOf(saved.age);
  const gender = textOf(saved.gender);
  const knownAge = AGE_OPTIONS.some((item) => item.id === age) ? age : '';
  const knownGender = GENDERS.some((item) => item.id === gender) ? gender : '';
  if (!knownAge && !knownGender) return null;
  return { age: knownAge, gender: knownGender };
}

function readSaved(): { age: string; gender: string } {
  const empty = { age: '', gender: '' };
  try {
    const answers = window.pathwai?.flow?.getAnswers?.() || {};
    const direct = fromRecord(answers[BLOCK_ALIAS]);
    if (direct) return direct;
    for (const value of Object.values(answers)) {
      const found = fromRecord(value);
      if (found) return found;
      if (!value || typeof value !== 'object') continue;
      for (const inner of Object.values(value as Record<string, unknown>)) {
        const nested = fromRecord(inner);
        if (nested) return nested;
      }
    }
    return empty;
  } catch {
    return empty;
  }
}

const STYLES = `
.strut-age {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 12px 16px 28px;
  box-sizing: border-box;
  font-family: var(--pw-font-family-body, "Basis Grotesque Pro", ui-sans-serif, system-ui, -apple-system, sans-serif);
  color: #222222;
}
.strut-age *, .strut-age *::before, .strut-age *::after { box-sizing: border-box; }
.strut-age__wrap { width: 100%; max-width: 520px; }
.strut-age__heading {
  margin: 0 0 8px;
  font-weight: 500;
  font-size: 32px;
  line-height: 1.15;
  color: #222222;
}
.strut-age__field { margin-top: 22px; }
.strut-age__label {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: #161336;
}
.strut-age__options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  border: 0;
}
.strut-age__option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  margin: 0;
  padding: 12px 16px;
  border: 1.5px solid #cccccc;
  border-radius: 10px;
  background: #fff;
  color: #161336;
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.35;
  text-align: left;
  cursor: pointer;
}
.strut-age__option:hover { border-color: #161336; }
.strut-age__option.is-selected {
  border-color: #161336;
  background: rgba(22, 19, 54, 0.06);
}
.strut-age__radio {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 1.5px solid #b5b5b5;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}
.strut-age__option.is-selected .strut-age__radio {
  border-color: #161336;
  background: #161336;
}
.strut-age__radio-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #fff;
}
.strut-age__error {
  margin: 16px 0 0;
  padding: 12px 14px;
  border-radius: 8px;
  background: #fef2f2;
  color: #7f1d1d;
  font-size: 12px;
  line-height: 1.45;
}
.strut-age__actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 28px;
}
.strut-age__btn {
  width: 50%;
  height: 44px;
  border-radius: 45px;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.strut-age__back,
.strut-age__continue {
  height: auto;
  padding: 0.625rem 1.5rem;
  font-size: var(--pw-font-size-body, 1rem);
  font-weight: 600;
  font-family: var(--pw-font-family-body, system-ui, sans-serif);
  color: var(--pw-button-fg, #ffffff);
  background: var(--pw-button-bg, var(--pw-color-brand, #2563eb));
  border: none;
  border-radius: var(--pw-radius, 0.5rem);
  cursor: pointer;
}
.strut-age__continue:disabled { opacity: 0.5; cursor: not-allowed; }
@media (max-width: 600px) {
  .strut-age__heading { font-size: 22px; }
  .strut-age__actions { gap: 12px; }
  .strut-age__btn { width: 100%; }
}
`;

export default function AgeGenderCard({ onChange }: Props) {
  const saved = readSaved();
  const [age, setAge] = useState(saved.age);
  const [gender, setGender] = useState(saved.gender);
  const [error, setError] = useState<string | null>(null);
  const advancedRef = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const next = readSaved();
    if (next.age) setAge(next.age);
    if (next.gender) setGender(next.gender);
  }, []);

  const advance = useCallback((payload: Record<string, unknown>) => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    onChangeRef.current?.(payload);
    try { window.pathwai?.flow?.next?.(payload); } catch { /* ignore */ }
  }, []);

  const goBack = () => {
    const flow = window.pathwai?.flow;
    if (flow?.back) flow.back();
    else flow?.previous?.();
  };

  const choose = (kind: 'gender' | 'age', id: string) => {
    setError(null);
    if (kind === 'gender') setGender(id);
    else setAge(id);
  };

  const submit = () => {
    setError(null);
    if (!gender) {
      setError('Select a gender.');
      return;
    }
    if (!age) {
      setError('Age is required.');
      return;
    }
    const ageOption = AGE_OPTIONS.find((item) => item.id === age);
    const genderOption = GENDERS.find((item) => item.id === gender);
    advance({
      age,
      ageLabel: ageOption?.label || age,
      gender,
      genderLabel: genderOption?.label || gender,
    });
  };

  return (
    <div className="strut-age">
      <style>{STYLES}</style>
      <div className="strut-age__wrap">
        <h1 className="strut-age__heading">Tell us about you</h1>

        <div className="strut-age__field">
          <div className="strut-age__label" id="strut-gender-label">Gender</div>
          <div className="strut-age__options" role="radiogroup" aria-labelledby="strut-gender-label">
            {GENDERS.map((item) => {
              const selected = gender === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`strut-age__option${selected ? ' is-selected' : ''}`}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => choose('gender', item.id)}
                >
                  <span className="strut-age__radio">{selected ? <span className="strut-age__radio-dot" /> : null}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="strut-age__field">
          <div className="strut-age__label" id="strut-age-label">Age</div>
          <div className="strut-age__options" role="radiogroup" aria-labelledby="strut-age-label">
            {AGE_OPTIONS.map((item) => {
              const selected = age === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`strut-age__option${selected ? ' is-selected' : ''}`}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => choose('age', item.id)}
                >
                  <span className="strut-age__radio">{selected ? <span className="strut-age__radio-dot" /> : null}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error ? <div className="strut-age__error" role="alert">{error}</div> : null}

        <div className="strut-age__actions">
          <button type="button" className="strut-age__btn strut-age__back" onClick={goBack}>Back</button>
          <button
            type="button"
            className="strut-age__btn strut-age__continue"
            onClick={submit}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export const propSchema = {};

export const outputSchema = {
  age: { type: 'string', title: 'Age range (under-18, 18-30, 31-45, 46-60, 61-plus)' },
  ageLabel: { type: 'string', title: 'Age range label' },
  gender: { type: 'string', title: 'Gender (1 male, 2 female)' },
  genderLabel: { type: 'string', title: 'Gender label' },
};
