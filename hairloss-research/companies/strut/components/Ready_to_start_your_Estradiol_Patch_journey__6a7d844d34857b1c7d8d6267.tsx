import React from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'Estradiol Patch',
  },
  subtitle: {
    type: 'string',
    title: 'Subtitle',
    defaultValue: 'Transdermal estrogen therapy',
  },
  body: {
    type: 'string',
    title: 'Body',
    defaultValue:
      'A steady dose of bioidentical estradiol through the skin. Changed on a regular schedule. Starting at $99.',
  },
  ctaLabel: {
    type: 'string',
    title: 'Button label',
    defaultValue: 'Continue',
  },
};

export default function EstradiolPatchWelcome({
  title = 'Estradiol Patch',
  subtitle = 'Transdermal estrogen therapy',
  body = 'A steady dose of bioidentical estradiol through the skin. Changed on a regular schedule. Starting at $99.',
  ctaLabel = 'Continue',
}: {
  title?: string;
  subtitle?: string;
  body?: string;
  ctaLabel?: string;
}) {
  const expectations = [
    'A few questions about your health and symptoms',
    'A licensed clinician reviews your answers',
    'A prescription if treatment is appropriate',
  ];

  const trustItems = [
    'HIPAA-conscious',
    'Licensed U.S. clinicians',
    'Cancel anytime',
  ];

  const handleContinue = () => {
    window.pathwai?.flow?.next();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.75rem)',
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 617px)',
        margin: '0 auto',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
        boxSizing: 'border-box',
      }}
    >
      {/* Hero intro */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 1.25rem)',
        }}
      >
        <span
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '0ms',
              alignSelf: 'flex-start',
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              background: 'var(--pw-color-background, #ffffff)',
              border: '1px solid var(--pw-color-border, #EFEFEC)',
              color: 'var(--pw-color-brand, #161336)',
              fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
              fontWeight: 500,
              letterSpacing: '0.02em',
              lineHeight: 1.3,
            } as React.CSSProperties
          }
        >
          Medical questionnaire
        </span>

        <div
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '80ms',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            } as React.CSSProperties
          }
        >
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-title, 1.75rem)',
              fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
              lineHeight: 'var(--pw-font-line-height-title, 1.2)',
              letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
              color: 'var(--pw-label-fg, #002021)',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 500,
              lineHeight: 'var(--pw-font-line-height-body, 1.55)',
              color: 'var(--pw-label-sublabel-fg, #545454)',
            }}
          >
            {subtitle}
          </p>
        </div>

        <p
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '160ms',
              margin: 0,
              fontFamily: 'var(--pw-content-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
              fontSize: 'var(--pw-content-font-size, var(--pw-font-size-body, 1rem))',
              fontWeight: 'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
              lineHeight: 'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))',
              color: 'var(--pw-content-fg, var(--pw-color-on-surface, #1C1C21))',
              maxWidth: '36em',
            } as React.CSSProperties
          }
        >
          {body}
        </p>
      </div>

      {/* What to expect */}
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '240ms',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            padding: 'var(--pw-control-padding, 1rem)',
            background: 'var(--pw-color-surface, #ffffff)',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
          } as React.CSSProperties
        }
      >
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 600,
            lineHeight: 1.35,
            color: 'var(--pw-label-fg, #002021)',
          }}
        >
          What to expect
        </h2>
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}
        >
          {expectations.map((item, index) => (
            <li
              key={item}
              className="pw-motion-enter"
              style={
                {
                  '--pw-motion-enter-delay': `${300 + index * 70}ms`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-body, 1rem)',
                  fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
                  lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                  color: 'var(--pw-color-on-surface, #1C1C21)',
                } as React.CSSProperties
              }
            >
              <span
                aria-hidden
                style={{
                  flexShrink: 0,
                  width: '1.35rem',
                  height: '1.35rem',
                  marginTop: '0.15rem',
                  borderRadius: '999px',
                  background: 'var(--pw-color-brand, #161336)',
                  color: 'var(--pw-color-brand-contrast, #ffffff)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA + trust */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 1.25rem)',
        }}
      >
        <button
          type="button"
          className="pw-motion-enter"
          onClick={handleContinue}
          style={
            {
              '--pw-motion-enter-delay': '520ms',
              width: '100%',
              minHeight: '48px',
              padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
              border: 'none',
              borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
              background: 'var(--pw-button-bg, #161336)',
              color: 'var(--pw-button-fg, #ffffff)',
              fontFamily:
                'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
              fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
              fontWeight:
                'var(--pw-navigation-button-font-weight, 500)' as unknown as number,
              lineHeight: 1.3,
              cursor: 'pointer',
              transition: `opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), transform var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
              boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            } as React.CSSProperties
          }
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid var(--pw-state-focus-ring, #8399BF)';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          {ctaLabel}
        </button>

        <ul
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '600ms',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem 0.5rem',
              fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
              fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
              lineHeight: 1.4,
              color: 'var(--pw-color-muted, #71717a)',
              textAlign: 'center',
            } as React.CSSProperties
          }
        >
          {trustItems.map((item, index) => (
            <li
              key={item}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {index > 0 && (
                <span
                  aria-hidden
                  style={{
                    width: '3px',
                    height: '3px',
                    borderRadius: '999px',
                    background: 'var(--pw-color-muted, #71717a)',
                    opacity: 0.7,
                    flexShrink: 0,
                  }}
                />
              )}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}