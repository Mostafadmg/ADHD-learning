import React from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Headline',
    defaultValue: 'Your first order is made to order.',
  },
  body: {
    type: 'string',
    title: 'Supporting text',
    defaultValue:
      'NAD+ is compounded custom in a pharmacy. Initial new orders typically arrive in 7–14 days because of that process and high demand.',
  },
  badgeLabel: {
    type: 'string',
    title: 'Timing badge',
    defaultValue: '7–14 days',
  },
};

const STEPS = [
  {
    title: 'Clinician review',
    description: 'A licensed clinician reviews your answers first.',
  },
  {
    title: 'Compounded for you',
    description: 'Your NAD+ is prepared to order at a compounding pharmacy.',
  },
  {
    title: 'Ships to your door',
    description: 'Once compounded, it ships directly to you.',
  },
] as const;

export default function CompoundingPharmacyNotice({
  title = 'Your first order is made to order.',
  body = 'NAD+ is compounded custom in a pharmacy. Initial new orders typically arrive in 7–14 days because of that process and high demand.',
  badgeLabel = '7–14 days',
}: {
  title?: string;
  body?: string;
  badgeLabel?: string;
}) {
  return (
    <section
      aria-labelledby="nad-order-heading"
      style={{
        width: '100%',
        boxSizing: 'border-box',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
      }}
    >
      <header
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '0ms',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 0.75rem)',
          } as React.CSSProperties
        }
      >
        <h2
          id="nad-order-heading"
          style={{
            margin: 0,
            fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, Lora, Georgia, serif))',
            fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.75rem))',
            fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 600))' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.25))',
            letterSpacing: 'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
            color: 'var(--pw-label-fg, var(--pw-color-on-surface, #2A3330))',
            overflowWrap: 'break-word',
          }}
        >
          {title}
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-label-sublabel-font-family, var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif))',
            fontSize: 'var(--pw-label-sublabel-font-size, var(--pw-font-size-body, 1.125rem))',
            fontWeight: 'var(--pw-label-sublabel-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-font-line-height-body, 1.6)',
            letterSpacing: 'var(--pw-font-letter-spacing-body, 0em)',
            color: 'var(--pw-label-sublabel-fg, var(--pw-color-muted, #5C6762))',
            overflowWrap: 'break-word',
          }}
        >
          {body}
        </p>
      </header>

      <ol
        aria-label="How your first order is prepared"
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {STEPS.map((step, index) => {
          const isLast = index === STEPS.length - 1;
          return (
            <li
              key={step.title}
              className="pw-motion-enter"
              style={
                {
                  '--pw-motion-enter-delay': `${(index + 1) * 60}ms`,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'stretch',
                  gap: 'var(--pw-element-gap, 0.75rem)',
                } as React.CSSProperties
              }
            >
              <div
                aria-hidden="true"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '2.25rem',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                    background: 'var(--pw-color-brand, #3D6F7C)',
                    color: 'var(--pw-color-brand-contrast, #FFFFFF)',
                    fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
                    fontSize: 'var(--pw-font-size-caption, 0.9375rem)',
                    fontWeight: 'var(--pw-font-weight-title, 600)' as React.CSSProperties['fontWeight'],
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>
                {!isLast && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: 'var(--pw-element-gap, 0.75rem)',
                      marginTop: 4,
                      background: 'var(--pw-color-border, #D9D2C3)',
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  paddingBottom: isLast ? 0 : 'var(--pw-section-gap, 1.5rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  paddingTop: '0.3rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 'var(--pw-element-gap, 0.75rem)',
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif))',
                      fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1.125rem))',
                      fontWeight: 'var(--pw-font-weight-title, 600)' as React.CSSProperties['fontWeight'],
                      lineHeight: 'var(--pw-font-line-height-body, 1.6)',
                      letterSpacing: 'var(--pw-font-letter-spacing-body, 0em)',
                      color: 'var(--pw-answer-fg, var(--pw-color-on-surface, #2A3330))',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {step.title}
                  </h3>
                  {isLast && badgeLabel ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                        fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
                        fontSize: 'var(--pw-font-size-caption, 0.9375rem)',
                        fontWeight: 'var(--pw-font-weight-title, 600)' as React.CSSProperties['fontWeight'],
                        lineHeight: 1.2,
                        letterSpacing: 'var(--pw-font-letter-spacing-body, 0em)',
                        color: 'var(--pw-color-brand, #3D6F7C)',
                        background: 'var(--pw-color-info-surface, #D4E2E6)',
                        borderRadius: 'var(--pw-radius, 0.25rem)',
                        padding: '0.25rem 0.5rem',
                      }}
                    >
                      {badgeLabel}
                    </span>
                  ) : null}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--pw-answer-subtext-font-family, var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif))',
                    fontSize: 'var(--pw-answer-subtext-font-size, var(--pw-font-size-caption, 0.9375rem))',
                    fontWeight: 'var(--pw-answer-subtext-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
                    lineHeight: 'var(--pw-font-line-height-body, 1.6)',
                    color: 'var(--pw-answer-subtext-fg, var(--pw-color-muted, #5C6762))',
                    overflowWrap: 'break-word',
                  }}
                >
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}