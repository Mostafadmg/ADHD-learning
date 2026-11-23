import React, { useState, useEffect, useRef } from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'How did you hear about us?',
  },
  subtitle: {
    type: 'string',
    title: 'Subtitle',
    defaultValue: 'Select one option. Choose Other to type your own.',
  },
  option1: {
    type: 'string',
    title: 'Option 1',
    defaultValue: 'Search engine',
  },
  option2: {
    type: 'string',
    title: 'Option 2',
    defaultValue: 'Friend or family',
  },
  option3: {
    type: 'string',
    title: 'Option 3',
    defaultValue: 'Social media',
  },
  option4: {
    type: 'string',
    title: 'Option 4',
    defaultValue: 'Advertisement',
  },
  otherLabel: {
    type: 'string',
    title: 'Other label',
    defaultValue: 'Other',
  },
  otherPlaceholder: {
    type: 'string',
    title: 'Other placeholder',
    defaultValue: 'Please specify…',
  },
};

export const outputSchema = {
  choice: {
    type: 'string',
    title: 'Choice',
    description: 'Selected option value, or the custom text when Other is chosen',
    required: true,
  },
  isOther: {
    type: 'boolean',
    title: 'Is other',
    description: 'True when the Other option is selected',
  },
};

const OTHER_VALUE = '__other__';

export default function OptionWithOther({
  title = 'How did you hear about us?',
  subtitle = 'Select one option. Choose Other to type your own.',
  option1 = 'Search engine',
  option2 = 'Friend or family',
  option3 = 'Social media',
  option4 = 'Advertisement',
  otherLabel = 'Other',
  otherPlaceholder = 'Please specify…',
  onChange,
}: {
  title?: string;
  subtitle?: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  otherLabel?: string;
  otherPlaceholder?: string;
  onChange?: (outputs: { choice: string; isOther: boolean }) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [otherText, setOtherText] = useState('');
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const [touchedOther, setTouchedOther] = useState(false);
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const otherInputRef = useRef<HTMLInputElement | null>(null);

  const options = [
    { value: 'option1', label: option1 },
    { value: 'option2', label: option2 },
    { value: 'option3', label: option3 },
    { value: 'option4', label: option4 },
    { value: OTHER_VALUE, label: otherLabel },
  ].filter((opt) => opt.label.trim().length > 0);

  const isOther = selected === OTHER_VALUE;
  const otherEmpty = isOther && otherText.trim().length === 0;
  const showOtherError = isOther && touchedOther && otherEmpty;

  useEffect(() => {
    if (!selected) {
      onChange?.({ choice: '', isOther: false });
      return;
    }
    if (selected === OTHER_VALUE) {
      onChange?.({ choice: otherText.trim(), isOther: true });
      return;
    }
    const match = options.find((o) => o.value === selected);
    onChange?.({ choice: match?.label ?? selected, isOther: false });
  }, [selected, otherText, onChange]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!justSelected) return;
    const el = optionRefs.current[justSelected];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelected]);

  useEffect(() => {
    if (isOther) {
      const t = window.setTimeout(() => otherInputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
  }, [isOther]);

  const handleSelect = (value: string) => {
    setSelected(value);
    setJustSelected(value);
    if (value !== OTHER_VALUE) {
      setTouchedOther(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 36rem)',
        fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #0f172a)',
      }}
    >
      <header
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.5rem)',
          ['--pw-motion-enter-delay' as string]: '0ms',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, system-ui, sans-serif))',
            fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.5rem))',
            fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 600))' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.2))' as React.CSSProperties['lineHeight'],
            letterSpacing: 'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
            color: 'var(--pw-label-fg, var(--pw-color-on-surface, #0f172a))',
          }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--pw-label-sublabel-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
              fontSize: 'var(--pw-label-sublabel-font-size, var(--pw-font-size-body, 1rem))',
              fontWeight: 'var(--pw-label-sublabel-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
              lineHeight: 'var(--pw-font-line-height-body, 1.55)' as React.CSSProperties['lineHeight'],
              color: 'var(--pw-label-sublabel-fg, var(--pw-color-muted, #64748b))',
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </header>

      <div
        role="radiogroup"
        aria-label={title}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
        }}
      >
        {options.map((opt, index) => {
          const isSelected = selected === opt.value;
          const isOtherOpt = opt.value === OTHER_VALUE;

          return (
            <button
              key={opt.value}
              ref={(el) => {
                optionRefs.current[opt.value] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className="pw-motion-enter"
              onClick={() => handleSelect(opt.value)}
              style={{
                ['--pw-motion-enter-delay' as string]: `${(index + 1) * 80}ms`,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--pw-answer-gap, 0.75rem)',
                width: '100%',
                minHeight: 48,
                padding: 'var(--pw-control-padding, 1rem)',
                textAlign: 'left',
                cursor: 'pointer',
                borderRadius: 'var(--pw-radius, 8px)',
                border: isSelected
                  ? '2px solid var(--pw-color-brand, #2563eb)'
                  : '1.5px solid var(--pw-answer-border, #e2e8f0)',
                background: isSelected
                  ? 'var(--pw-answer-surface-selected, #eff6ff)'
                  : 'var(--pw-answer-surface, #ffffff)',
                boxShadow: isSelected ? 'var(--pw-shadow, none)' : 'none',
                color: isSelected
                  ? 'var(--pw-answer-fg-selected, var(--pw-color-on-surface, #0f172a))'
                  : 'var(--pw-answer-fg, var(--pw-color-on-surface, #0f172a))',
                fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
                fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                fontWeight: 'var(--pw-answer-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
                lineHeight: 'var(--pw-font-line-height-body, 1.55)' as React.CSSProperties['lineHeight'],
                transition: `border-color var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease), background var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease), box-shadow var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease)`,
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, #2563eb)`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = isSelected ? 'var(--pw-shadow, none)' : 'none';
              }}
            >
              <span
                aria-hidden
                style={{
                  display: 'var(--pw-answer-indicator-display, flex)' as React.CSSProperties['display'],
                  flexShrink: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'var(--pw-answer-indicator-size, 18px)',
                  height: 'var(--pw-answer-indicator-size, 18px)',
                  borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                  border: isSelected
                    ? '2px solid var(--pw-answer-indicator-fill, var(--pw-color-brand, #2563eb))'
                    : '2px solid var(--pw-answer-border, #cbd5e1)',
                  background: isSelected
                    ? 'var(--pw-answer-indicator-fill, var(--pw-color-brand, #2563eb))'
                    : 'transparent',
                  transition: `background var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease), border-color var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease)`,
                }}
              >
                {isSelected ? (
                  <span
                    className="pw-motion-pop"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: 'var(--pw-answer-indicator-check, #ffffff)',
                      display: 'var(--pw-answer-indicator-dot-display, flex)' as React.CSSProperties['display'],
                    }}
                  />
                ) : null}
              </span>

              <span style={{ flex: 1, minWidth: 0 }}>{opt.label}</span>

              {isOtherOpt ? (
                <span
                  aria-hidden
                  style={{
                    fontSize: 'var(--pw-font-size-caption, 0.8rem)',
                    color: 'var(--pw-color-muted, #64748b)',
                    flexShrink: 0,
                  }}
                >
                  Write in
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {isOther ? (
        <div
          className="pw-motion-enter"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 0.5rem)',
            ['--pw-motion-enter-delay' as string]: '0ms',
          }}
        >
          <label
            htmlFor="option-other-input"
            style={{
              fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 600 as React.CSSProperties['fontWeight'],
              color: 'var(--pw-label-fg, var(--pw-color-on-surface, #0f172a))',
            }}
          >
            Please explain:
          </label>
          <input
            ref={otherInputRef}
            id="option-other-input"
            type="text"
            value={otherText}
            placeholder={otherPlaceholder}
            aria-invalid={showOtherError}
            aria-describedby={showOtherError ? 'option-other-error' : undefined}
            onChange={(e) => setOtherText(e.target.value)}
            onBlur={() => setTouchedOther(true)}
            style={{
              width: '100%',
              minHeight: 48,
              boxSizing: 'border-box',
              padding: 'var(--pw-control-padding, 1rem)',
              borderRadius: 'var(--pw-radius, 8px)',
              border: showOtherError
                ? '1.5px solid var(--pw-color-error, #dc2626)'
                : '1.5px solid var(--pw-input-border, #cbd5e1)',
              background: 'var(--pw-input-bg, #ffffff)',
              color: 'var(--pw-input-fg, var(--pw-color-on-surface, #0f172a))',
              fontFamily: 'var(--pw-input-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
              fontSize: 'var(--pw-input-font-size, var(--pw-font-size-body, 1rem))',
              fontWeight: 'var(--pw-input-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
              lineHeight: 'var(--pw-font-line-height-body, 1.55)' as React.CSSProperties['lineHeight'],
              outline: 'none',
              transition: `border-color var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease), box-shadow var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease)`,
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, #2563eb)`;
              e.currentTarget.style.borderColor = showOtherError
                ? 'var(--pw-color-error, #dc2626)'
                : 'var(--pw-color-brand, #2563eb)';
            }}
            onBlurCapture={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = showOtherError
                ? 'var(--pw-color-error, #dc2626)'
                : 'var(--pw-input-border, #cbd5e1)';
            }}
          />
          {showOtherError ? (
            <p
              id="option-other-error"
              role="alert"
              style={{
                margin: 0,
                fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                color: 'var(--pw-color-error, #dc2626)',
                lineHeight: 1.4,
              }}
            >
              Enter a short explanation so we know what to record.
            </p>
          ) : (
            <p
              style={{
                margin: 0,
                fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                color: 'var(--pw-color-muted, #64748b)',
                lineHeight: 1.4,
              }}
            >
              Your answer will be saved exactly as you type it.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}