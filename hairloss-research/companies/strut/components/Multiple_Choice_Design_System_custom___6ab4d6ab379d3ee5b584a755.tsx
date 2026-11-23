import React, { useState, useEffect, useRef } from 'react';

export const propSchema = {
  optionALabel: {
    type: 'string',
    title: 'Option A label',
    defaultValue: 'Option A',
  },
  optionAText: {
    type: 'string',
    title: 'Option A text',
    defaultValue: 'A short note explaining what this choice means for you.',
  },
  optionBLabel: {
    type: 'string',
    title: 'Option B label',
    defaultValue: 'Option B',
  },
  optionBText: {
    type: 'string',
    title: 'Option B text',
    defaultValue: 'A short note explaining what this choice means for you.',
  },
  followUpText: {
    type: 'string',
    title: 'Text after options',
    defaultValue: 'You can change this later if you need to.',
  },
};

export const outputSchema = {
  value: {
    type: 'string',
    title: 'Selected value',
    description: 'The chosen option: "a" or "b".',
    required: true,
  },
};

export default function MultiChoiceBlock({
  optionALabel = 'Option A',
  optionAText = 'A short note explaining what this choice means for you.',
  optionBLabel = 'Option B',
  optionBText = 'A short note explaining what this choice means for you.',
  followUpText = 'You can change this later if you need to.',
  onChange,
}: {
  optionALabel?: string;
  optionAText?: string;
  optionBLabel?: string;
  optionBText?: string;
  followUpText?: string;
  onChange?: (outputs: { value: string }) => void;
}) {
  const [selected, setSelected] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const options = [
    { value: 'a', label: optionALabel, text: optionAText },
    { value: 'b', label: optionBLabel, text: optionBText },
  ];

  useEffect(() => {
    if (selected) onChange?.({ value: selected });
  }, [selected, onChange]);

  useEffect(() => {
    if (!justSelected) return;
    const el = optionRefs.current[justSelected];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelected]);

  const handleSelect = (value: string) => {
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
      }}
    >
      <div
        role="radiogroup"
        aria-label="Choose an option"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 1.25rem)',
        }}
      >
        {options.map((opt, index) => {
          const isSelected = selected === opt.value;
          const isFocused = focused === opt.value;
          const isHovered = hovered === opt.value && !isSelected;

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
              onFocus={() => setFocused(opt.value)}
              onBlur={() => setFocused(null)}
              onMouseEnter={() => setHovered(opt.value)}
              onMouseLeave={() => setHovered(null)}
              style={{
                ['--pw-motion-enter-delay' as string]: `${index * 100}ms`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--pw-answer-gap, 0.75rem)',
                width: '100%',
                minHeight: 44,
                textAlign: 'left',
                padding: 'var(--pw-control-padding, 1rem)',
                fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                color: isSelected
                  ? 'var(--pw-answer-fg-selected, var(--pw-answer-fg, #1C1C21))'
                  : 'var(--pw-answer-fg, #1C1C21)',
                background: isSelected
                  ? 'var(--pw-answer-surface-selected, #F1F0E8)'
                  : isHovered
                    ? 'var(--pw-state-hover, #F1F0E8)'
                    : 'var(--pw-answer-surface, #ffffff)',
                border: isSelected
                  ? '2px solid var(--pw-color-brand, #161336)'
                  : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                borderRadius: 'var(--pw-radius, 0.5rem)',
                boxShadow: isFocused
                  ? '0 0 0 3px var(--pw-state-focus-ring, #8399BF)'
                  : 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
                cursor: 'pointer',
                outline: 'none',
                transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), box-shadow var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 'var(--pw-answer-indicator-size, 18px)',
                  height: 'var(--pw-answer-indicator-size, 18px)',
                  flexShrink: 0,
                  marginTop: '0.2em',
                  display: 'var(--pw-answer-indicator-display, flex)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                  border: isSelected
                    ? '2px solid var(--pw-answer-indicator-fill, var(--pw-color-brand, #161336))'
                    : '2px solid var(--pw-color-brand, #161336)',
                  background: isSelected
                    ? 'var(--pw-answer-indicator-fill, var(--pw-color-brand, #161336))'
                    : 'transparent',
                  boxSizing: 'border-box',
                }}
              >
                {isSelected && (
                  <span
                    className="pw-motion-pop"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: 'var(--pw-answer-indicator-check, #ffffff)',
                      display: 'var(--pw-answer-indicator-dot-display, flex)',
                    }}
                  />
                )}
              </span>

              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                    fontWeight: 'var(--pw-answer-font-weight, 500)',
                    lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                    letterSpacing: 'var(--pw-font-letter-spacing-body, 0)',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {opt.label}
                </span>
                {opt.text ? (
                  <span
                    style={{
                      fontFamily: 'var(--pw-answer-subtext-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                      fontSize: 'var(--pw-answer-subtext-font-size, var(--pw-font-size-caption, 0.875rem))',
                      fontWeight: 'var(--pw-answer-subtext-font-weight, var(--pw-font-weight-body, 400))',
                      lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                      color: 'var(--pw-answer-subtext-fg, var(--pw-label-sublabel-fg, #545454))',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {opt.text}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      {followUpText ? (
        <p
          className="pw-motion-enter"
          style={{
            ['--pw-motion-enter-delay' as string]: '200ms',
            margin: 0,
            fontFamily: 'var(--pw-content-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))',
            lineHeight: 'var(--pw-content-line-height, 1.55)',
            color: 'var(--pw-label-sublabel-fg, #545454)',
            overflowWrap: 'anywhere',
          }}
        >
          {followUpText}
        </p>
      ) : null}
    </div>
  );
}