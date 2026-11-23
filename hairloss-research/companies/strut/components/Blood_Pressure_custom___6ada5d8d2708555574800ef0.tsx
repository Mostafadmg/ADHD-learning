import { useState, useEffect, useMemo, useRef } from 'react';

const SYS_MIN = 70;
const SYS_MAX = 250;
const DIA_MIN = 40;
const DIA_MAX = 150;
const COLLECT_PULSE = false;
const SHOW_SUMMARY = true;
const SYS_CAPTION = {
    "title": "Systolic",
    "hint": "Top number"
  };
const DIA_CAPTION = {
    "title": "Diastolic",
    "hint": "Bottom number"
  };
const PULSE_CAPTION = {
    "title": "Pulse",
    "hint": "Optional · bpm"
  };

export const outputSchema = {
  systolic: { type: 'number', title: 'Systolic (mmHg)' },
  diastolic: { type: 'number', title: 'Diastolic (mmHg)' },
};

function describeBpCategory(systolic: number, diastolic: number): string {
  if (systolic > 180 || diastolic > 120)
    return 'Very high — contact a clinician or emergency services if you have symptoms.';
  if (systolic >= 140 || diastolic >= 90) return 'High (Stage 2 range)';
  if (systolic >= 130 || diastolic >= 80) return 'High (Stage 1 range)';
  if (systolic >= 120 && diastolic < 80) return 'Elevated';
  return 'Typical range for many adults';
}

const cellStyle = {
  boxSizing: 'border-box' as const,
  width: '6.25rem',
  height: '6.25rem',
  flexShrink: 0,
  background: 'transparent',
  textAlign: 'center' as const,
  fontSize: '2.25rem',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--pw-input-fg, #0f172a)',
  fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
  outline: 'none',
  border: 'none',
  borderRadius: 'var(--pw-radius, 0.5rem)',
};
const captionTitle = {
  marginTop: 12,
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--pw-color-on-surface, #0f172a)',
  textAlign: 'center' as const,
};
const captionHint = {
  marginTop: 2,
  fontSize: '0.75rem',
  color: 'var(--pw-color-muted, #64748b)',
  textAlign: 'center' as const,
};

export default function BloodPressureBlock({
  onChange,
}: {
  onChange?: (outputs: { systolic?: number; diastolic?: number; pulse?: number }) => void;
}) {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [touched, setTouched] = useState(false);
  const committed = useRef(false);

  const validation = useMemo(() => {
    const sys = parseInt(systolic, 10);
    const dia = parseInt(diastolic, 10);
    const hasSys = systolic.trim() !== '';
    const hasDia = diastolic.trim() !== '';
    if (!hasSys && !hasDia) return { complete: false as const };
    if (!hasSys || !hasDia)
      return { complete: false as const, localError: 'Enter both systolic and diastolic values' };
    if (!Number.isFinite(sys) || !Number.isFinite(dia))
      return { complete: false as const, localError: 'Use whole numbers only' };
    if (sys < SYS_MIN || sys > SYS_MAX)
      return { complete: false as const, localError: `Systolic should be between ${SYS_MIN} and ${SYS_MAX}` };
    if (dia < DIA_MIN || dia > DIA_MAX)
      return { complete: false as const, localError: `Diastolic should be between ${DIA_MIN} and ${DIA_MAX}` };
    let pulseNum: number | null = null;
    if (COLLECT_PULSE && pulse.trim() !== '') {
      pulseNum = parseInt(pulse, 10);
      if (!Number.isFinite(pulseNum) || pulseNum < 30 || pulseNum > 220)
        return { complete: false as const, localError: 'Pulse should be between 30 and 220 bpm' };
    }
    return { complete: true as const, sys, dia, pulseNum };
  }, [systolic, diastolic, pulse]);

  useEffect(() => {
    if (!validation.complete) {
      if (!committed.current) return;
      committed.current = false;
      onChange?.({});
      return;
    }
    committed.current = true;
    const out: { systolic?: number; diastolic?: number; pulse?: number } = {
      systolic: validation.sys,
      diastolic: validation.dia,
    };
    if (COLLECT_PULSE && pulse.trim() !== '' && validation.pulseNum !== null) out.pulse = validation.pulseNum;
    onChange?.(out);
  }, [systolic, diastolic, pulse, validation, onChange]);

  const displayError = touched && !validation.complete ? validation.localError : undefined;
  const showSummary = SHOW_SUMMARY && validation.complete;

  const separator = (label?: string) => (
    <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 8, padding: label ? '8px 0' : '4px 0' }} aria-hidden>
      <div style={{ height: 1, flex: 1, borderRadius: 999, background: 'var(--pw-color-border, #e2e8f0)' }} />
      {label && (
        <span style={{ flexShrink: 0, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--pw-color-muted, #64748b)' }}>
          {label}
        </span>
      )}
      <div style={{ height: 1, flex: 1, borderRadius: 999, background: 'var(--pw-color-border, #e2e8f0)' }} />
    </div>
  );

  const field = (
    id: string,
    v: string,
    set: (s: string) => void,
    caption: { title: string; hint: string | undefined },
    min: number,
    max: number,
    placeholder: string
  ) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <input
        id={id}
        className="ds-bp-cell"
        type="number"
        inputMode="numeric"
        autoComplete="off"
        aria-label={caption.hint ? `${caption.title}, ${caption.hint}` : caption.title}
        placeholder={placeholder}
        min={min}
        max={max}
        value={v}
        onChange={(e) => set(e.target.value)}
        onBlur={() => setTouched(true)}
        style={cellStyle}
      />
      <div style={{ maxWidth: '7.5rem' }}>
        <p style={captionTitle}>{caption.title}</p>
        {caption.hint && <p style={captionHint}>{caption.hint}</p>}
      </div>
    </div>
  );

  const hasEntry = systolic.trim() !== '' || diastolic.trim() !== '' || pulse.trim() !== '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--pw-element-gap, 0.5rem)' }}>
      <style>{`
        .ds-bp-cell::placeholder { color: var(--pw-color-muted, #64748b); font-weight: 400; opacity: 0.65; }
      `}</style>
      {!hasEntry && (
        <p style={{ margin: 0, textAlign: 'center', fontSize: '0.75rem', color: 'var(--pw-color-muted, #64748b)' }}>
        </p>
      )}
      <div
        style={{
          margin: '0 auto',
          width: 'fit-content',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 'calc(var(--pw-radius, 0.5rem) * 1.5)',
          border: '1px solid var(--pw-color-border, #e2e8f0)',
          background: 'var(--pw-color-surface, #ffffff)',
          padding: 'calc(var(--pw-control-padding, 1rem) * 1.2) calc(var(--pw-control-padding, 1rem) * 1.6)',
          boxShadow: 'var(--pw-shadow, 0 1px 2px rgba(0,0,0,0.05))',
        }}
      >
        {field('bp-systolic', systolic, setSystolic, SYS_CAPTION, SYS_MIN, SYS_MAX, '120')}
        {separator('mmHg')}
        {field('bp-diastolic', diastolic, setDiastolic, DIA_CAPTION, DIA_MIN, DIA_MAX, '80')}
        {COLLECT_PULSE && (
          <>
            {separator()}
            {field('bp-pulse', pulse, setPulse, PULSE_CAPTION, 30, 220, '72')}
          </>
        )}
      </div>

      {showSummary && validation.complete && (
        <div
          style={{
            borderRadius: 'var(--pw-radius, 0.5rem)',
            border: '1px solid var(--pw-color-border, #e2e8f0)',
            background: 'var(--pw-color-background, #f8fafc)',
            padding: 'var(--pw-control-padding, 1rem)',
          }}
        >
          <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--pw-color-on-surface, #0f172a)' }}>
            Reading: {validation.sys}/{validation.dia} mmHg
            {COLLECT_PULSE && pulse.trim() !== '' && validation.pulseNum !== null && (
              <span style={{ color: 'var(--pw-color-muted, #64748b)', fontWeight: 400 }}> · Pulse {validation.pulseNum} bpm</span>
            )}
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--pw-color-muted, #64748b)', lineHeight: 1.5 }}>
            {describeBpCategory(validation.sys, validation.dia)} — not a medical diagnosis.
          </p>
        </div>
      )}

      {displayError && (
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--pw-color-error, #dc2626)' }}>{displayError}</p>
      )}
    </div>
  );
}