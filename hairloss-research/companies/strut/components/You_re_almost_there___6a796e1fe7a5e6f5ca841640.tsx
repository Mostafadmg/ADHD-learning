import React from 'react';

export const propSchema = {};

export default function AlmostThereInterstitial() {
  const completed = [
    'Medical history',
    'Safety screening',
    'Ready for physician review',
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 32rem)',
        margin: '0 auto',
        fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
      }}
    >
      <div
        className="pw-motion-enter"
        style={{
          ['--pw-motion-enter-delay' as string]: '0ms',
          width: '100%',
          background: 'var(--pw-color-surface, #ffffff)',
          borderRadius: 'var(--pw-radius, 12px)',
          boxShadow: 'var(--pw-shadow, 0 1px 3px rgba(15, 23, 42, 0.08))',
          border: '1px solid var(--pw-color-border, #e2e8f0)',
          padding: 'var(--pw-section-gap, 1.5rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 'var(--pw-element-gap, 0.75rem)',
          boxSizing: 'border-box',
        }}
      >
        <div
          className="pw-motion-enter"
          style={{
            ['--pw-motion-enter-delay' as string]: '80ms',
            width: 64,
            height: 64,
            borderRadius: '999px',
            background: 'var(--pw-color-success-surface, #dcfce7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginBottom: 'var(--pw-element-gap, 0.75rem)',
          }}
          aria-hidden
        >
          <svg
            className="pw-motion-pop"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="var(--pw-color-success, #16a34a)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1
          className="pw-motion-enter"
          style={{
            ['--pw-motion-enter-delay' as string]: '140ms',
            margin: 0,
            fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, system-ui, sans-serif))',
            fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.5rem))',
            fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 600))' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.2))',
            letterSpacing: 'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
            color: 'var(--pw-label-fg, var(--pw-color-on-surface, #0f172a))',
          }}
        >
          You're almost there!
        </h1>

        <p
          className="pw-motion-enter"
          style={{
            ['--pw-motion-enter-delay' as string]: '200ms',
            margin: 0,
            maxWidth: '28rem',
            fontFamily: 'var(--pw-content-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
            fontSize: 'var(--pw-content-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))',
            color: 'var(--pw-content-fg, var(--pw-color-on-surface, #0f172a))',
          }}
        >
          Your medical questionnaire is complete. The next step is a quick identity
          verification and checkout, then a licensed physician will review your
          information.
        </p>

        <ul
          className="pw-motion-enter"
          style={{
            ['--pw-motion-enter-delay' as string]: '280ms',
            listStyle: 'none',
            margin: 0,
            marginTop: 'var(--pw-section-gap, 1.5rem)',
            padding: 'var(--pw-control-padding, 1rem)',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 0.75rem)',
            background: 'var(--pw-color-background, #f8fafc)',
            borderRadius: 'var(--pw-radius, 12px)',
            border: '1px solid var(--pw-color-border, #e2e8f0)',
            textAlign: 'left',
          }}
          aria-label="Completed sections"
        >
          {completed.map((label, index) => (
            <li
              key={label}
              className="pw-motion-enter"
              style={{
                ['--pw-motion-enter-delay' as string]: `${320 + index * 80}ms`,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--pw-answer-gap, 0.75rem)',
                minHeight: 44,
              }}
            >
              <span
                className="pw-motion-pop"
                style={{
                  width: 'var(--pw-answer-indicator-size, 18px)',
                  height: 'var(--pw-answer-indicator-size, 18px)',
                  borderRadius: '999px',
                  background: 'var(--pw-color-success, #16a34a)',
                  color: 'var(--pw-color-on-success, #ffffff)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
                aria-hidden
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                style={{
                  fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-body, 1rem)',
                  fontWeight: 'var(--pw-font-weight-body, 400)' as React.CSSProperties['fontWeight'],
                  lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                  color: 'var(--pw-color-on-surface, #0f172a)',
                }}
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}