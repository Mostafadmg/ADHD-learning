import React, { useState, useEffect, useRef } from 'react';

const AGE_OPTIONS = [
  { value: 'under-18', label: 'Under 18' },
  { value: '18-30', label: '18-30' },
  { value: '31-45', label: '31-45' },
  { value: '46-60', label: '46-60' },
  { value: '61-plus', label: '61+' },
] as const;

type AgeValue = (typeof AGE_OPTIONS)[number]['value'];

export const propSchema = {
  title: {
    type: 'string',
    title: 'Question',
    defaultValue: 'What is your age?',
  },
};

export const outputSchema = {
  ageRange: {
    type: 'string',
    title: 'Age range',
    description: 'Selected age band: "under-18", "18-30", "31-45", "46-60", or "61-plus"',
    required: true,
  },
  ageLabel: {
    type: 'string',
    title: 'Age label',
    description: 'Display label of the selected range, e.g. "18-30"',
  },
};

export default function AgeBlock({
  title = 'What is your age?',
  onChange,
}: {
  title?: string;
  onChange?: (outputs: { ageRange: string; ageLabel: string }) => void;
}) {
  const [selected, setSelected] = useState<AgeValue | null>(null);
  const [hovered, setHovered] = useState<AgeValue | null>(null);
  const [pressed, setPressed] = useState<AgeValue | null>(null);
  const [justSelected, setJustSelected] = useState<AgeValue | null>(null);
  const [focused, setFocused] = useState<AgeValue | null>(null);
  const optionRefs = useRef<Partial<Record<AgeValue, HTMLButtonElement | null>>>({});

  useEffect(() => {
    if (!selected) return;
    const option = AGE_OPTIONS.find((o) => o.value === selected);
    if (!option) return;
    onChange?.({ ageRange: option.value, ageLabel: option.label });
  }, [selected, onChange]);

  useEffect(() => {
    if (!justSelected) return;
    const el = optionRefs.current[justSelected];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelected]);

  const handleSelect = (value: AgeValue) => {
    setSelected(value);
    setJustSelected(value);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 617px)',
        fontFamily: 'var(--pw-font-family-body, "Figtree", sans-serif)',
      }}
    >
      <h2
        id="age-block-label"
        className="pw-motion-enter"
        style={{
          margin: 0,
          color: 'var(--pw-label-fg, #002021)',
          fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, "Figtree", sans-serif))',
          fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.75rem))',
          fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 500))' as React.CSSProperties['fontWeight'],
          lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.2))',
          letterSpacing: 'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
        }}
      >
        {title}
      </h2>

      <div
        role="radiogroup"
        aria-labelledby="age-block-label"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'calc(var(--pw-space-base, 1.5rem) / 3)',
        }}
      >
        {AGE_OPTIONS.map((option, index) => {
          const isSelected = selected === option.value;
          const isHovered = hovered === option.value;
          const isPressed = pressed === option.value;
          const isFocused = focused === option.value;

          let background = 'var(--pw-answer-surface, #ffffff)';
          if (isSelected) background = 'var(--pw-answer-surface-selected, #F1F0E8)';
          else if (isPressed) background = 'var(--pw-state-active, #EFEFEC)';
          else if (isHovered) background = 'var(--pw-state-hover, #F1F0E8)';

          return (
            <button
              key={option.value}
              ref={(el) => {
                optionRefs.current[option.value] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className="pw-motion-enter"
              style={{
                ['--pw-motion-enter-delay' as string]: `${index * 80}ms`,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--pw-answer-gap, 0.75rem)',
                width: '100%',
                minHeight: 48,
                margin: 0,
                padding: 'var(--pw-control-padding, 1rem)',
                boxSizing: 'border-box',
                textAlign: 'left',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                background,
                color: isSelected
                  ? 'var(--pw-answer-fg-selected, var(--pw-answer-fg, #1C1C21))'
                  : 'var(--pw-answer-fg, #1C1C21)',
                border: isSelected
                  ? '2px solid var(--pw-color-brand, #161336)'
                  : '2px solid var(--pw-answer-border, #E0E0E0)',
                borderRadius: 'var(--pw-answer-radius, var(--pw-radius, 0.75rem))',
                boxShadow: isSelected ? 'none' : 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
                fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, "Figtree", sans-serif))',
                fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                fontWeight: isSelected
                  ? 600
                  : ('var(--pw-answer-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight']),
                lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                outline: isFocused
                  ? '2px solid var(--pw-state-focus-ring, #8399BF)'
                  : '2px solid transparent',
                outlineOffset: 2,
                transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
              }}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={() => setHovered(option.value)}
              onMouseLeave={() => {
                setHovered(null);
                setPressed(null);
              }}
              onPointerDown={() => setPressed(option.value)}
              onPointerUp={() => setPressed(null)}
              onPointerCancel={() => setPressed(null)}
              onFocus={() => setFocused(option.value)}
              onBlur={() => setFocused((current) => (current === option.value ? null : current))}
            >
              <span
                aria-hidden
                style={{
                  display: 'var(--pw-answer-indicator-display, flex)',
                  flexShrink: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'var(--pw-answer-indicator-size, 18px)',
                  height: 'var(--pw-answer-indicator-size, 18px)',
                  borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                  border: isSelected
                    ? '2px solid var(--pw-answer-indicator-fill, var(--pw-color-brand, #161336))'
                    : '2px solid var(--pw-answer-border, #E0E0E0)',
                  background: isSelected
                    ? 'var(--pw-answer-indicator-fill, var(--pw-color-brand, #161336))'
                    : 'transparent',
                  boxSizing: 'border-box',
                  transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
                }}
              >
                {isSelected && (
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
                )}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}