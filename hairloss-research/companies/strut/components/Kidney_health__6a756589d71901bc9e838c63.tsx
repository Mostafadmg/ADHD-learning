import React from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'Kidney health comes first',
  },
  body: {
    type: 'string',
    title: 'Body',
    defaultValue:
      'Metformin is cleared by the kidneys. When kidney function is reduced, the medicine can build up and raise the risk of a rare but serious condition called lactic acidosis. That is why the next questions ask about kidney disease and eGFR — so care stays safe and appropriate for you.',
  },
  whyTitle: {
    type: 'string',
    title: 'Why we ask — title',
    defaultValue: 'Why we ask',
  },
  whyBody: {
    type: 'string',
    title: 'Why we ask — body',
    defaultValue:
      'A quick check for kidney disease and eGFR helps confirm metformin is a good fit before treatment is considered.',
  },
  nextTitle: {
    type: 'string',
    title: 'What happens next — title',
    defaultValue: 'What happens next',
  },
  nextBody: {
    type: 'string',
    title: 'What happens next — body',
    defaultValue:
      'If anything needs a closer look, a physician reviews your answers and guides the next step. You are not alone in this process.',
  },
};

export default function KidneyHealthComesFirst({
  title = 'Kidney health comes first',
  body = 'Metformin is cleared by the kidneys. When kidney function is reduced, the medicine can build up and raise the risk of a rare but serious condition called lactic acidosis. That is why the next questions ask about kidney disease and eGFR — so care stays safe and appropriate for you.',
  whyTitle = 'Why we ask',
  whyBody = 'A quick check for kidney disease and eGFR helps confirm metformin is a good fit before treatment is considered.',
  nextTitle = 'What happens next',
  nextBody = 'If anything needs a closer look, a physician reviews your answers and guides the next step. You are not alone in this process.',
}: {
  title?: string;
  body?: string;
  whyTitle?: string;
  whyBody?: string;
  nextTitle?: string;
  nextBody?: string;
}) {
  const cards = [
    {
      key: 'why',
      step: '1',
      heading: whyTitle,
      text: whyBody,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M12 11v5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <circle cx="12" cy="8" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      key: 'next',
      step: '2',
      heading: nextTitle,
      text: nextBody,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
        fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #0f172a)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <header
        className="pw-motion-enter"
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 0.75rem)',
            '--pw-motion-enter-delay': '0ms',
          } as React.CSSProperties
        }
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            alignSelf: 'flex-start',
            padding: '0.35rem 0.75rem',
            borderRadius: '999px',
            background: 'var(--pw-color-info-surface, #eff6ff)',
            color: 'var(--pw-color-info, #2563eb)',
            fontSize: 'var(--pw-font-size-caption, 0.8rem)',
            fontWeight: 600,
            letterSpacing: '0.02em',
            lineHeight: 1.3,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: 'currentColor',
              flexShrink: 0,
            }}
          />
          Before we continue
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-title, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-title, 1.5rem)',
            fontWeight: 'var(--pw-font-weight-title, 700)' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-font-line-height-title, 1.2)' as React.CSSProperties['lineHeight'],
            letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
            color: 'var(--pw-label-fg, var(--pw-color-on-surface, #0f172a))',
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-content-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
            fontSize: 'var(--pw-content-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))' as React.CSSProperties['lineHeight'],
            color: 'var(--pw-content-fg, var(--pw-color-on-surface, #0f172a))',
          }}
        >
          {body}
        </p>
      </header>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
        }}
      >
        {cards.map((card, index) => (
          <section
            key={card.key}
            className="pw-motion-enter"
            style={
              {
                '--pw-motion-enter-delay': `${(index + 1) * 100}ms`,
                display: 'flex',
                gap: 'var(--pw-answer-gap, 0.875rem)',
                alignItems: 'flex-start',
                padding: 'var(--pw-control-padding, 1rem)',
                background: 'var(--pw-color-surface, #ffffff)',
                border: '1.5px solid var(--pw-color-border, #e2e8f0)',
                borderRadius: 'var(--pw-radius, 8px)',
                boxShadow: 'var(--pw-shadow, 0 1px 2px rgba(15, 23, 42, 0.06))',
                boxSizing: 'border-box',
              } as React.CSSProperties
            }
          >
            <div
              aria-hidden="true"
              style={{
                flexShrink: 0,
                width: 44,
                height: 44,
                borderRadius: 'var(--pw-radius, 8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--pw-answer-media-bg, var(--pw-color-info-surface, #eff6ff))',
                color: 'var(--pw-answer-media-fg, var(--pw-color-brand, #2563eb))',
              }}
            >
              {card.icon}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                minWidth: 0,
                flex: 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--pw-font-size-caption, 0.8rem)',
                    fontWeight: 600,
                    color: 'var(--pw-color-muted, #64748b)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  {card.step}
                </span>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: 'var(--pw-font-family-title, system-ui, sans-serif)',
                    fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                    fontWeight: 600,
                    lineHeight: 1.35,
                    color: 'var(--pw-color-on-surface, #0f172a)',
                  }}
                >
                  {card.heading}
                </h2>
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-body, 1rem)',
                  fontWeight: 'var(--pw-font-weight-body, 400)' as React.CSSProperties['fontWeight'],
                  lineHeight: 'var(--pw-font-line-height-body, 1.55)' as React.CSSProperties['lineHeight'],
                  color: 'var(--pw-label-sublabel-fg, var(--pw-color-muted, #64748b))',
                }}
              >
                {card.text}
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}