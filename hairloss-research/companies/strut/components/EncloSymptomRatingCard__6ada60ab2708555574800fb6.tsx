import React, { useEffect, useRef, useState } from 'react';

/**
 * One screen for all four rating questions.
 * Each answer set sits on a single line. The chosen word turns navy.
 * The flow's own navigation moves the patient on.
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

const BLOCK_ALIAS = 'block-strut-symptom-rating';

const RATING = [
  { value: '1', label: 'Terrible' },
  { value: '2', label: 'Poor' },
  { value: '3', label: 'Average' },
  { value: '4', label: 'Good' },
  { value: '5', label: 'Excellent' },
];

const ERECTION_RATING = [
  { value: '1', label: 'Extremely weak' },
  { value: '2', label: 'Weak' },
  { value: '3', label: 'Neither weak nor strong' },
  { value: '4', label: 'Strong' },
  { value: '5', label: 'Extremely strong' },
];

const QUESTIONS = [
  { id: 'energy', prompt: 'How would you rate your energy level?', options: RATING },
  { id: 'muscle', prompt: 'How would you rate your muscle strength and endurance?', options: RATING },
  { id: 'libido', prompt: 'How would you rate your libido (sex drive)?', options: RATING },
  { id: 'erections', prompt: 'How strong are your erections?', options: ERECTION_RATING },
];

type Answers = Record<string, string>;

type Props = {
  onChange?: (out: Record<string, unknown>) => void;
};

function textOf(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function emptyAnswers(): Answers {
  return { energy: '', muscle: '', libido: '', erections: '' };
}

function readSaved(): Answers {
  const next = emptyAnswers();
  try {
    const answers = window.pathwai?.flow?.getAnswers?.() || {};
    const raw = answers[BLOCK_ALIAS];
    if (!raw || typeof raw !== 'object') return next;
    const saved = raw as Record<string, unknown>;
    QUESTIONS.forEach((question) => {
      const value = textOf(saved[question.id]);
      if (question.options.some((option) => option.value === value)) next[question.id] = value;
    });
  } catch { /* ignore */ }
  return next;
}

const STYLES = `
.strut-rate {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 12px 16px 28px;
  box-sizing: border-box;
  font-family: var(--pw-font-family-body, "Basis Grotesque Pro", ui-sans-serif, system-ui, -apple-system, sans-serif);
  color: #222222;
}
.strut-rate *, .strut-rate *::before, .strut-rate *::after { box-sizing: border-box; }
.strut-rate__wrap { width: 100%; max-width: 560px; }
.strut-rate__question { margin-top: 14px; }
.strut-rate__question:first-child { margin-top: 0; }
.strut-rate__prompt {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  color: #161336;
}
.strut-rate__options {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 4px;
}
.strut-rate__option {
  min-height: 32px;
  margin: 0;
  padding: 6px 2px;
  border: 1px solid #e4e0d8;
  border-radius: 8px;
  background: #fff;
  color: #161336;
  font: inherit;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.2;
  text-align: center;
  cursor: pointer;
}
.strut-rate__option:hover { border-color: #161336; }
.strut-rate__option.is-selected {
  border-color: #161336;
  background: #161336;
  color: #fff;
  font-weight: 600;
}
.strut-rate__option:focus-visible {
  outline: 2px solid #161336;
  outline-offset: 2px;
}
@media (max-width: 600px) {
  .strut-rate__prompt { font-size: 12px; }
  .strut-rate__option { font-size: 10px; min-height: 30px; }
}
`;

export default function SymptomRatingCard({ onChange }: Props) {
  const [answers, setAnswers] = useState<Answers>(readSaved);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const publish = (current: Answers) => {
    const payload: Record<string, unknown> = {};
    QUESTIONS.forEach((item) => {
      const selected = item.options.find((option) => option.value === current[item.id]);
      payload[item.id] = current[item.id];
      payload[`${item.id}Label`] = selected?.label || current[item.id];
    });
    onChangeRef.current?.(payload);
  };

  useEffect(() => {
    const saved = readSaved();
    setAnswers(saved);
    publish(saved);
  }, []);

  const choose = (id: string, value: string) => {
    setAnswers((current) => {
      const next = { ...current, [id]: value };
      publish(next);
      return next;
    });
  };

  return (
    <div className="strut-rate">
      <style>{STYLES}</style>
      <div className="strut-rate__wrap">
        {QUESTIONS.map((question) => (
          <section className="strut-rate__question" key={question.id} id={`strut-rate-${question.id}`}>
            <h2 className="strut-rate__prompt" id={`strut-rate-${question.id}-label`}>{question.prompt}</h2>
            <div className="strut-rate__options" role="radiogroup" aria-labelledby={`strut-rate-${question.id}-label`}>
              {question.options.map((option) => {
                const selected = answers[question.id] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`strut-rate__option${selected ? ' is-selected' : ''}`}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => choose(question.id, option.value)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export const propSchema = {};

export const outputSchema = {
  energy: { type: 'string', title: 'Energy (1 terrible to 5 excellent)' },
  energyLabel: { type: 'string', title: 'Energy label' },
  muscle: { type: 'string', title: 'Muscle strength and endurance (1 terrible to 5 excellent)' },
  muscleLabel: { type: 'string', title: 'Muscle label' },
  libido: { type: 'string', title: 'Libido (1 terrible to 5 excellent)' },
  libidoLabel: { type: 'string', title: 'Libido label' },
  erections: { type: 'string', title: 'Erections (1 extremely weak to 5 extremely strong)' },
  erectionsLabel: { type: 'string', title: 'Erections label' },
};
