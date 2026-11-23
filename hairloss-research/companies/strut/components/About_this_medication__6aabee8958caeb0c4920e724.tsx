import React from 'react';

const NEXT_STEPS = [
  'Answer a few health questions',
  'A licensed U.S. physician reviews your responses',
  'Kidney function is part of that review',
] as const;

export const propSchema = {
  title: {
    type: 'string',
    title: 'Headline',
    defaultValue: 'About this medication',
  },
};

export default function AboutThisMedication({
  title = 'About this medication',
}: {
  title?: string;
}) {
  return (
    <article
      className="pw-motion-enter"
      style={{
        ['--pw-motion-enter-delay' as string]: '0ms',
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%',
        background: 'var(--pw-color-cream, #F1F0E8)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
        borderRadius: 'var(--pw-radius, 0.5rem)',
        boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
        border: '1px solid var(--pw-color-border, #EFEFEC)',
        borderLeft: '3px solid var(--pw-color-brand, #161336)',
        padding: 'var(--pw-space-inset, 1.5rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-block-gap, 2.25rem)',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
      } as React.CSSProperties}
    >
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 1.25rem)',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-title, 1.75rem)',
            fontWeight: 'var(--pw-font-weight-title, 500)' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-font-line-height-title, 1.2)',
            letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
            color: 'var(--pw-label-fg, #002021)',
          }}
        >
          {title}
        </h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-space-gutter, 1rem)',
            fontFamily: 'var(--pw-content-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-content-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))',
            letterSpacing: 'var(--pw-font-letter-spacing-body, 0)',
            color: 'var(--pw-content-fg, var(--pw-color-body-gray, #545454))',
          }}
        >
          <p style={{ margin: 0 }}>
            Metformin is FDA-approved for the treatment of type 2 diabetes. Some
            adults ask about it off-label for healthy aging and general metabolic
            health, which the FDA has not evaluated or approved.
          </p>
          <p style={{ margin: 0 }}>
            A U.S. licensed physician will review your answers and decide whether
            off-label metformin is appropriate for you. Metformin is not right for
            everyone, and kidney health is an important part of that decision.
          </p>
        </div>
      </header>

      <section
        aria-labelledby="what-happens-next"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 1.25rem)',
          paddingTop: 'var(--pw-element-gap, 1.25rem)',
          borderTop: '1px solid var(--pw-color-border, #EFEFEC)',
        }}
      >
        <h2
          id="what-happens-next"
          style={{
            margin: 0,
            fontFamily: 'var(--pw-label-sublabel-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-font-size-caption, 0.8rem)',
            fontWeight: 600 as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--pw-label-sublabel-fg, #545454)',
          }}
        >
          What happens next
        </h2>
        <ol
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-space-gutter, 1rem)',
          }}
        >
          {NEXT_STEPS.map((step, index) => (
            <li
              key={step}
              className="pw-motion-enter"
              style={{
                ['--pw-motion-enter-delay' as string]: `${(index + 1) * 100}ms`,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 'var(--pw-answer-gap, 0.75rem)',
                minWidth: 0,
              } as React.CSSProperties}
            >
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: '1.75rem',
                  fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-caption, 0.8rem)',
                  fontWeight: 600 as React.CSSProperties['fontWeight'],
                  lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                  color: 'var(--pw-color-brand, #161336)',
                  paddingTop: '0.1em',
                }}
              >
                {index + 1}
              </span>
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-body, 1rem)',
                  fontWeight: 'var(--pw-font-weight-body, 400)' as React.CSSProperties['fontWeight'],
                  lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                  color: 'var(--pw-color-on-surface, #1C1C21)',
                }}
              >
                {step}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
