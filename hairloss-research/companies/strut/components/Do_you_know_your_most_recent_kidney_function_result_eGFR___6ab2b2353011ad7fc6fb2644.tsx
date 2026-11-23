import React, { useState, useEffect, useRef } from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'Do you know your most recent kidney function result (eGFR)?',
  },
  sublabel: {
    type: 'string',
    title: 'Helper text',
    defaultValue:
      'Your eGFR is a lab number from a blood test. If you do not have it handy, choose no.',
  },
};

export const outputSchema = {
  knows_egfr: {
    type: 'string',
    title: 'Knows eGFR',
    description: '"yes_enter" when they will enter a value, "no" when they do not know',
    required: true,
  },
  egfr_value: {
    type: 'number',
    title: 'eGFR value',
    description:
      'Most recent eGFR in mL/min/1.73m² (0–200). Empty when knows_egfr is no or incomplete.',
  },
};

type Choice = 'yes_enter' | 'no' | '';

const OPTIONS: { id: 'yes_enter' | 'no'; label: string }[] = [
  { id: 'yes_enter', label: 'Yes' },
  { id: 'no', label: 'No' },
];

function parseEgfr(raw: string): {
  ok: boolean;
  value: number | null;
  error: string | null;
} {
  const trimmed = raw.trim();
  if (trimmed === '') return { ok: false, value: null, error: null };
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0 || n > 200) {
    return {
      ok: false,
      value: null,
      error: 'Enter a number between 0 and 200',
    };
  }
  return { ok: true, value: n, error: null };
}

export default function KnowsRecentEgfr({
  title = 'Do you know your most recent kidney function result (eGFR)?',
  sublabel = 'Your eGFR is a lab number from a blood test. If you do not have it handy, choose no.',
  onChange,
}: {
  title?: string;
  sublabel?: string;
  onChange?: (outputs: { knows_egfr: string; egfr_value: number | '' }) => void;
}) {
  const [choice, setChoice] = useState<Choice>('');
  const [egfrRaw, setEgfrRaw] = useState('');
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const parsed = parseEgfr(egfrRaw);
  const showInput = choice === 'yes_enter';
  const stepComplete =
    choice === 'no' || (choice === 'yes_enter' && parsed.ok);

  useEffect(() => {
    if (!justSelected) return;
    const el = optionRefs.current[justSelected];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelected]);

  useEffect(() => {
    if (!stepComplete) {
      onChange?.({ knows_egfr: '', egfr_value: '' });
      return;
    }
    onChange?.({
      knows_egfr: choice,
      egfr_value: choice === 'yes_enter' && parsed.value !== null ? parsed.value : '',
    });
  }, [stepComplete, choice, parsed.value, onChange]);

  const handleSelect = (id: 'yes_enter' | 'no') => {
    setChoice(id);
    setJustSelected(id);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <header
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
          ['--pw-motion-enter-delay' as string]: '0ms',
        }}
      >
        <h2
          id="egfr-knows-title"
          style={{
            margin: 0,
            color: 'var(--pw-label-fg, #002021)',
            fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, Figtree, system-ui, sans-serif))',
            fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.75rem))',
            fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 500))' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.2))',
            letterSpacing: 'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
          }}
        >
          {title}
        </h2>
        {sublabel ? (
          <p
            id="egfr-knows-sublabel"
            style={{
              margin: 0,
              color: 'var(--pw-label-sublabel-fg, #545454)',
              fontFamily:
                'var(--pw-label-sublabel-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
              fontSize: 'var(--pw-label-sublabel-font-size, var(--pw-font-size-body, 1rem))',
              fontWeight: 'var(--pw-label-sublabel-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
              lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            }}
          >
            {sublabel}
          </p>
        ) : null}
      </header>

      <div
        role="radiogroup"
        aria-labelledby="egfr-knows-title"
        aria-describedby={sublabel ? 'egfr-knows-sublabel' : undefined}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 1.25rem)',
        }}
      >
        {OPTIONS.map((opt, index) => {
          const selected = choice === opt.id;
          const isHovered = hovered === opt.id;
          const isFocused = focused === opt.id;
          const isPressed = pressed === opt.id;
          let background = 'var(--pw-answer-surface, #ffffff)';
          if (selected) background = 'var(--pw-answer-surface-selected, #F1F0E8)';
          else if (isPressed) background = 'var(--pw-state-active, #EFEFEC)';
          else if (isHovered) background = 'var(--pw-state-hover, #F1F0E8)';

          return (
            <button
              key={opt.id}
              ref={(el) => {
                optionRefs.current[opt.id] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              className="pw-motion-enter"
              style={{
                ['--pw-motion-enter-delay' as string]: `${(index + 1) * 100}ms`,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--pw-answer-gap, 0.75rem)',
                width: '100%',
                minHeight: 44,
                margin: 0,
                padding: 'var(--pw-control-padding, 1rem)',
                boxSizing: 'border-box',
                textAlign: 'left',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                background,
                color: selected
                  ? 'var(--pw-answer-fg-selected, var(--pw-answer-fg, #1C1C21))'
                  : 'var(--pw-answer-fg, #1C1C21)',
                border: '2px solid',
                borderColor: selected
                  ? 'var(--pw-color-brand, #161336)'
                  : 'var(--pw-answer-border, #E0E0E0)',
                borderRadius: 'var(--pw-radius, 0.5rem)',
                boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
                fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                fontWeight: 'var(--pw-answer-font-weight, 500)' as React.CSSProperties['fontWeight'],
                lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                outline: isFocused
                  ? '2px solid var(--pw-state-focus-ring, #8399BF)'
                  : 'none',
                outlineOffset: 2,
                transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
              }}
              onClick={() => handleSelect(opt.id)}
              onMouseEnter={() => setHovered(opt.id)}
              onMouseLeave={() => {
                setHovered(null);
                setPressed(null);
              }}
              onMouseDown={() => setPressed(opt.id)}
              onMouseUp={() => setPressed(null)}
              onFocus={() => setFocused(opt.id)}
              onBlur={() => setFocused(null)}
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'var(--pw-answer-indicator-display, flex)',
                  flexShrink: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'var(--pw-answer-indicator-size, 18px)',
                  height: 'var(--pw-answer-indicator-size, 18px)',
                  borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                  border: selected
                    ? '2px solid var(--pw-answer-indicator-fill, var(--pw-color-brand, #161336))'
                    : '2px solid var(--pw-answer-border, #E0E0E0)',
                  background: selected
                    ? 'var(--pw-answer-indicator-fill, var(--pw-color-brand, #161336))'
                    : 'transparent',
                  boxSizing: 'border-box',
                }}
              >
                {selected ? (
                  <span
                    className="pw-motion-pop"
                    style={{
                      display: 'var(--pw-answer-indicator-dot-display, flex)',
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: 'var(--pw-answer-indicator-check, #ffffff)',
                    }}
                  />
                ) : null}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {showInput ? (
        <div
          className="pw-motion-enter"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            ['--pw-motion-enter-delay' as string]: '0ms',
          }}
        >
          <label
            htmlFor="egfr-value-input"
            style={{
              margin: 0,
              color: 'var(--pw-label-fg, #002021)',
              fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, Figtree, system-ui, sans-serif))',
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 600 as React.CSSProperties['fontWeight'],
              lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            }}
          >
            Your most recent eGFR
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'stretch',
              minHeight: 44,
              background: 'var(--pw-input-bg, #ffffff)',
              border: '2px solid',
              borderColor: parsed.error
                ? 'var(--pw-color-error, #ef4444)'
                : inputFocused
                  ? 'var(--pw-color-brand, #161336)'
                  : 'var(--pw-input-border, #E0E0E0)',
              borderRadius: 'var(--pw-radius, 0.5rem)',
              boxShadow: inputFocused
                ? '0 0 0 2px var(--pw-state-focus-ring, #8399BF)'
                : 'none',
              overflow: 'hidden',
              transition: `border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
            }}
          >
            <input
              id="egfr-value-input"
              type="number"
              inputMode="decimal"
              min={0}
              max={200}
              step="any"
              placeholder="72"
              value={egfrRaw}
              aria-invalid={Boolean(parsed.error)}
              aria-describedby={parsed.error ? 'egfr-value-error' : 'egfr-value-unit'}
              onChange={(e) => setEgfrRaw(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              style={{
                flex: 1,
                minWidth: 0,
                minHeight: 44,
                margin: 0,
                padding: 'var(--pw-control-padding, 1rem)',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--pw-input-fg, #1C1C21)',
                fontFamily: 'var(--pw-input-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                fontSize: 'var(--pw-input-font-size, var(--pw-font-size-body, 1rem))',
                fontWeight: 'var(--pw-input-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
                lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                boxSizing: 'border-box',
              }}
            />
            <span
              id="egfr-value-unit"
              aria-hidden="true"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                padding: '0 var(--pw-control-padding, 1rem)',
                borderLeft: '1px solid var(--pw-input-border, #E0E0E0)',
                color: 'var(--pw-color-muted, #71717a)',
                fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-caption, 0.8rem)',
                fontWeight: 500 as React.CSSProperties['fontWeight'],
                whiteSpace: 'nowrap',
                background: 'var(--pw-color-surface, #ffffff)',
              }}
            >
              mL/min/1.73m²
            </span>
          </div>
          {parsed.error ? (
            <p
              id="egfr-value-error"
              role="alert"
              style={{
                margin: 0,
                color: 'var(--pw-color-error, #ef4444)',
                fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-caption, 0.8rem)',
                fontWeight: 'var(--pw-font-weight-body, 400)' as React.CSSProperties['fontWeight'],
                lineHeight: 1.4,
              }}
            >
              {parsed.error}
            </p>
          ) : (
            <p
              style={{
                margin: 0,
                color: 'var(--pw-label-sublabel-fg, #545454)',
                fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-caption, 0.8rem)',
                fontWeight: 'var(--pw-font-weight-body, 400)' as React.CSSProperties['fontWeight'],
                lineHeight: 1.4,
              }}
            >
              Enter a value from 0 to 200. Decimals are okay.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
