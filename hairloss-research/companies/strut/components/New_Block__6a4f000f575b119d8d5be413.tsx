import React, { useState, useEffect } from 'react';

/* ============================================================
   BloodPressureInput
   ------------------------------------------------------------
   Collects a systolic (top) and diastolic (bottom) reading.
   Emits the two numbers, a combined "120/80" string, and an
   AHA category (normal / elevated / stage-1 / stage-2 / crisis)
   so downstream steps can route on the result.

   Scoped CSS prefix: bp-
   Design system: Figtree headings, Plus Jakarta Sans body.
============================================================ */

/* Hex + opacity helper */
const hexToRgba = (hex, alpha) => {
  if (!hex || typeof hex !== 'string') return `rgba(0,0,0,${alpha})`;
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/* Keep only digits, clamp length to 3 */
const cleanNumber = (str) => String(str ?? '').replace(/[^0-9]/g, '').slice(0, 3);

/* AHA blood-pressure category from the two readings */
const categorize = (sys, dia) => {
  if (!sys || !dia) return '';
  if (sys > 180 || dia > 120) return 'crisis';
  if (sys >= 140 || dia >= 90) return 'stage-2';
  if (sys >= 130 || dia >= 80) return 'stage-1';
  if (sys >= 120 && dia < 80) return 'elevated';
  if (sys < 120 && dia < 80) return 'normal';
  return 'stage-1';
};

export default function BloodPressureInput({
  /* ===== BRAND + THEME ===== */
  brandColor = '#161336',
  textColor = '#0F1714',
  textMutedColor = '#6B7670',
  borderColor = '#E5E1D8',
  borderSoftColor = '#EFECE3',
  surfaceColor = '#FFFFFF',
  borderRadius = 12,

  /* ===== COPY ===== */
  questionLabel = 'What is your blood pressure? (Top and bottom number)',
  exampleText = 'For example: 120/80',
  systolicLabel = 'Systolic',
  systolicHint = 'Top number',
  systolicPlaceholder = '120',
  diastolicLabel = 'Diastolic',
  diastolicHint = 'Bottom number',
  diastolicPlaceholder = '80',
  unitLabel = 'mmHg',
  ctaLabel = 'Continue',

  /* ===== VALIDATION ===== */
  required = true,
  minSystolic = 70,
  maxSystolic = 250,
  minDiastolic = 40,
  maxDiastolic = 150,

  onChange = null,
}) {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [error, setError] = useState('');

  /* Emit outputs whenever either value changes */
  useEffect(() => {
    const sys = systolic ? Number(systolic) : null;
    const dia = diastolic ? Number(diastolic) : null;
    onChange?.({
      systolic: sys,
      diastolic: dia,
      bloodPressure: sys && dia ? `${sys}/${dia}` : '',
      bpCategory: categorize(sys, dia),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systolic, diastolic]);

  const validate = () => {
    const sys = Number(systolic);
    const dia = Number(diastolic);
    if (required && (!systolic || !diastolic)) {
      return 'Please enter both numbers.';
    }
    if (systolic && (sys < minSystolic || sys > maxSystolic)) {
      return `Top number should be between ${minSystolic} and ${maxSystolic}.`;
    }
    if (diastolic && (dia < minDiastolic || dia > maxDiastolic)) {
      return `Bottom number should be between ${minDiastolic} and ${maxDiastolic}.`;
    }
    if (systolic && diastolic && sys <= dia) {
      return 'The top number should be higher than the bottom number.';
    }
    return '';
  };

  const handleContinue = (evt) => {
    /* Capture the enclosing step form up-front. Submitting it commits this
       step's emitted answer into the flow (this is what path routing reads)
       and advances. Falls back to a plain next() if no form is found. */
    const stepForm = evt?.currentTarget?.closest?.('form') ?? null;
    const advance = () => {
      if (stepForm && typeof stepForm.requestSubmit === 'function') {
        stepForm.requestSubmit();
      } else {
        window.pathwai?.flow?.next();
      }
    };

    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    advance();
  };

  const renderField = (label, hint, value, setValue, autoFocus, placeholder) => (
    <div className="bp-field">
      <div className="bp-field-label">{label}</div>
      {hint && <div className="bp-field-hint">{hint}</div>}
      <div className="bp-input-wrap">
        <input
          className="bp-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          autoFocus={autoFocus}
          value={value}
          placeholder={placeholder || '—'}
          onChange={(e) => { setValue(cleanNumber(e.target.value)); if (error) setError(''); }}
          aria-label={label}
        />
        {unitLabel && <span className="bp-unit">{unitLabel}</span>}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .bp-root, .bp-root * { box-sizing: border-box; }
        .bp-root {
          --bp-brand: ${brandColor};
          --bp-text: ${textColor};
          --bp-text-muted: ${textMutedColor};
          --bp-border: ${borderColor};
          --bp-border-soft: ${borderSoftColor};
          --bp-surface: ${surfaceColor};
          --bp-radius: ${borderRadius}px;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          color: var(--bp-text);
          background: transparent;
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
          padding: 8px 16px 20px 16px;
          display: flex;
          flex-direction: column;
        }

        .bp-question {
          font-family: 'Figtree', sans-serif;
          font-size: 20px;
          font-weight: 600;
          line-height: 1.35;
          letter-spacing: -0.01em;
          color: var(--bp-text);
          margin: 0 0 6px 0;
        }
        .bp-example {
          font-size: 13.5px;
          font-weight: 400;
          color: var(--bp-text-muted);
          margin: 0 0 20px 0;
        }

        /* ===== INPUT CARD ===== */
        .bp-card {
          background: var(--bp-surface);
          border: 1px solid var(--bp-border);
          border-radius: var(--bp-radius);
          padding: 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 2px 8px ${hexToRgba('#000000', 0.05)};
        }

        .bp-field {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 14px 0;
        }
        .bp-field-label {
          font-family: 'Figtree', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--bp-text);
        }
        .bp-field-hint {
          font-size: 12.5px;
          font-weight: 400;
          color: var(--bp-text-muted);
          margin-top: 2px;
        }

        .bp-input-wrap {
          display: inline-flex;
          align-items: baseline;
          justify-content: center;
          gap: 6px;
          margin-top: 10px;
        }
        .bp-input {
          width: 90px;
          border: none;
          border-bottom: 2px solid var(--bp-border);
          background: transparent;
          text-align: center;
          font-family: 'Figtree', sans-serif;
          font-size: 30px;
          font-weight: 700;
          color: var(--bp-text);
          padding: 2px 0 6px 0;
          outline: none;
          transition: border-color 0.16s ease;
          font-variant-numeric: tabular-nums;
        }
        .bp-input::placeholder { color: var(--bp-border); font-weight: 500; }
        .bp-input:focus { border-bottom-color: var(--bp-brand); }
        .bp-unit {
          font-size: 13px;
          font-weight: 500;
          color: var(--bp-text-muted);
        }

        .bp-divider {
          height: 1px;
          background: var(--bp-border-soft);
          margin: 0 -20px;
        }

        /* ===== ERROR ===== */
        .bp-error {
          color: #DC2626;
          font-size: 13px;
          text-align: center;
          margin: 12px 0 0 0;
        }

        /* ===== CTA ===== */
        .bp-cta-wrap { margin-top: 20px; }
        .bp-cta {
          width: 100%;
          height: 46px;
          background: var(--bp-brand);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0 16px;
          font-family: 'Figtree', sans-serif;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.18s ease, transform 0.18s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .bp-cta:hover { opacity: 0.92; }
        .bp-cta:active { transform: scale(0.98); }
        .bp-cta:focus-visible { outline: 2px solid var(--bp-brand); outline-offset: 2px; }
        .bp-cta-icon { width: 16px; height: 16px; flex-shrink: 0; }

        @media (max-width: 360px) {
          .bp-question { font-size: 18px; }
          .bp-input { font-size: 26px; width: 78px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bp-input, .bp-cta { transition: none; }
          .bp-cta:active { transform: none; }
        }
      `}</style>

      <div className="bp-root">
        {questionLabel && <h2 className="bp-question">{questionLabel}</h2>}
        {exampleText && <p className="bp-example">{exampleText}</p>}

        <div className="bp-card">
          {renderField(systolicLabel, systolicHint, systolic, setSystolic, true, systolicPlaceholder)}
          <div className="bp-divider" aria-hidden="true" />
          {renderField(diastolicLabel, diastolicHint, diastolic, setDiastolic, false, diastolicPlaceholder)}
        </div>

        {error && <p className="bp-error">{error}</p>}

        <div className="bp-cta-wrap">
          <button type="button" className="bp-cta" onClick={handleContinue}>
            <span>{ctaLabel}</span>
            <svg className="bp-cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   PROP SCHEMA — editable in the builder
============================================================ */
export const propSchema = {
  questionLabel: { type: 'string',  title: 'Question',        defaultValue: 'What is your blood pressure? (Top and bottom number)' },
  exampleText:   { type: 'string',  title: 'Example line',    defaultValue: 'For example: 120/80' },
  systolicLabel: { type: 'string',  title: 'Systolic label',  defaultValue: 'Systolic' },
  systolicHint:  { type: 'string',  title: 'Systolic hint',   defaultValue: 'Top number' },
  systolicPlaceholder: { type: 'string', title: 'Systolic placeholder', defaultValue: '120' },
  diastolicLabel:{ type: 'string',  title: 'Diastolic label', defaultValue: 'Diastolic' },
  diastolicHint: { type: 'string',  title: 'Diastolic hint',  defaultValue: 'Bottom number' },
  diastolicPlaceholder: { type: 'string', title: 'Diastolic placeholder', defaultValue: '80' },
  unitLabel:     { type: 'string',  title: 'Unit',            defaultValue: 'mmHg' },
  ctaLabel:      { type: 'string',  title: 'Button label',    defaultValue: 'Continue' },
  required:      { type: 'boolean', title: 'Required',        defaultValue: true },
  brandColor:    { type: 'color',   title: 'Brand color',     defaultValue: '#161336' },
};

/* ============================================================
   OUTPUT SCHEMA — referenceable in routing + {{...}} templates
============================================================ */
export const outputSchema = {
  systolic:      { type: 'number',  title: 'Systolic (top)',    description: 'Top number, e.g. 120' },
  diastolic:     { type: 'number',  title: 'Diastolic (bottom)',description: 'Bottom number, e.g. 80' },
  bloodPressure: { type: 'string',  title: 'Blood pressure',    description: 'Combined reading, e.g. "120/80"' },
  bpCategory:    { type: 'string',  title: 'BP category',       description: 'normal | elevated | stage-1 | stage-2 | crisis' },
};