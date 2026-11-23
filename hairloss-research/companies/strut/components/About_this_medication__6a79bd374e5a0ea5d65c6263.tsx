import React from 'react';

export const propSchema = {
  eyebrow: {
    type: 'string',
    title: 'Eyebrow',
    defaultValue: 'Section 1 · About this medication',
  },
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'Metformin and healthy aging',
  },
};

export default function MetforminWelcome({
  eyebrow = 'Section 1 · About this medication',
  title = 'Metformin and healthy aging',
}: {
  eyebrow?: string;
  title?: string;
}) {
  const paragraphs = [
    'Metformin is FDA-approved to treat type 2 diabetes. Some adults ask about using it off-label for healthy aging and metabolic health. The FDA has not evaluated or approved metformin for those uses.',
    'A U.S. licensed physician will review your answers and decide whether off-label metformin is appropriate for you. It is not right for everyone.',
    'Kidney health is an important part of that decision. The questions ahead help your clinician understand whether this medication may be safe to consider.',
  ];

  const infoRows = [
    {
      label: 'Off-label request',
      detail:
        'You are asking about a use the FDA has not approved. That does not make it automatically unsafe — but it does require careful clinical judgment.',
    },
    {
      label: 'Physician review required',
      detail:
        'A licensed U.S. physician reviews your full intake before any decision. Completing this form is not a prescription or a guarantee of treatment.',
    },
    {
      label: 'Kidney function matters',
      detail:
        'Metformin is cleared by the kidneys. We will ask about kidney health, lab history, and related conditions so your clinician can assess risk.',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        fontFamily: 'var(--pw-font-family-body, "IBM Plex Sans", system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #0F1720)',
      }}
    >
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
        }}
      >
        <p
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '0ms',
              margin: 0,
              fontFamily: 'var(--pw-font-family-body, "IBM Plex Sans", system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              fontWeight: 600,
              lineHeight: 1.4,
              letterSpacing: '0.02em',
              textTransform: 'uppercase' as const,
              color: 'var(--pw-label-sublabel-fg, #5B6B7C)',
            } as React.CSSProperties
          }
        >
          {eyebrow}
        </p>

        <h1
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '80ms',
              margin: 0,
              fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, "Atkinson Hyperlegible", system-ui, sans-serif))',
              fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.375rem))',
              fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 700))' as unknown as number,
              lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.25))',
              letterSpacing: 'var(--pw-label-letter-spacing, 0em)',
              color: 'var(--pw-label-fg, #0F1720)',
            } as React.CSSProperties
          }
        >
          {title}
        </h1>
      </header>

      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '160ms',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 0.75rem)',
          } as React.CSSProperties
        }
      >
        {paragraphs.map((text, index) => (
          <p
            key={index}
            style={{
              margin: 0,
              fontFamily: 'var(--pw-content-font-family, var(--pw-font-family-body, "IBM Plex Sans", system-ui, sans-serif))',
              fontSize: 'var(--pw-content-font-size, var(--pw-font-size-body, 1.0625rem))',
              fontWeight: 'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
              lineHeight: 'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))',
              color: 'var(--pw-content-fg, #0F1720)',
            }}
          >
            {text}
          </p>
        ))}
      </div>

      <div
        role="list"
        aria-label="What to expect"
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--pw-color-surface, #E6ECF1)',
          border: '1px solid var(--pw-color-border, #C5D0DB)',
          borderRadius: 'var(--pw-radius, 0.25rem)',
          boxShadow: 'var(--pw-shadow, 0 1px 2px rgba(15,23,32,0.06))',
          overflow: 'hidden',
        }}
      >
        {infoRows.map((row, index) => {
          const isLast = index === infoRows.length - 1;
          return (
            <div
              key={row.label}
              role="listitem"
              className="pw-motion-enter"
              style={
                {
                  '--pw-motion-enter-delay': `${240 + index * 90}ms`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  padding: 'var(--pw-control-padding, 1rem)',
                  borderBottom: isLast
                    ? 'none'
                    : '1px solid var(--pw-color-border, #C5D0DB)',
                } as React.CSSProperties
              }
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--pw-element-gap, 0.75rem)',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    width: '0.5rem',
                    height: '0.5rem',
                    borderRadius: '999px',
                    background: 'var(--pw-color-brand, #1B3A5F)',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--pw-font-family-body, "IBM Plex Sans", system-ui, sans-serif)',
                    fontSize: 'var(--pw-font-size-body, 1.0625rem)',
                    fontWeight: 600,
                    lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                    color: 'var(--pw-color-on-surface, #0F1720)',
                  }}
                >
                  {row.label}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  paddingLeft: 'calc(0.5rem + var(--pw-element-gap, 0.75rem))',
                  fontFamily: 'var(--pw-font-family-body, "IBM Plex Sans", system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                  fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
                  lineHeight: 1.5,
                  color: 'var(--pw-color-muted, #5B6B7C)',
                }}
              >
                {row.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}