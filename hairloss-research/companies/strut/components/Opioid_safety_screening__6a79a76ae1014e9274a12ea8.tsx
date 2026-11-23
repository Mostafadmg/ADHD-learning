import React from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'Why we ask about opioids',
  },
  body: {
    type: 'string',
    title: 'Body',
    defaultValue:
      'Naltrexone blocks the effects of opioids and can cause sudden, severe withdrawal if opioids are in your system. The next few questions protect your safety — please answer carefully and honestly.',
  },
};

const TOPICS = [
  'Current opioid medications',
  'Any opioid use in the past 14 days',
  'Withdrawal symptoms',
] as const;

export default function OpioidSafetyInterstitial({
  title = 'Why we ask about opioids',
  body = 'Naltrexone blocks the effects of opioids and can cause sudden, severe withdrawal if opioids are in your system. The next few questions protect your safety — please answer carefully and honestly.',
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 36rem)',
        margin: '0 auto',
        fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '0ms',
            background: 'var(--pw-color-surface, #ffffff)',
            borderRadius: 'var(--pw-radius, 12px)',
            border: '1px solid var(--pw-color-border, #e2e8f0)',
            boxShadow: 'var(--pw-shadow, 0 1px 3px rgba(15, 23, 42, 0.06))',
            padding: 'var(--pw-section-gap, 1.5rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-section-gap, 1.5rem)',
            boxSizing: 'border-box',
          } as React.CSSProperties
        }
      >
        <header
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '60ms',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--pw-element-gap, 0.75rem)',
            } as React.CSSProperties
          }
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              alignSelf: 'flex-start',
              padding: '0.35rem 0.7rem',
              borderRadius: '999px',
              background: 'var(--pw-color-info-surface, #eff6ff)',
              color: 'var(--pw-color-info, #2563eb)',
              fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
              fontWeight: 600,
              letterSpacing: '0.01em',
              lineHeight: 1.3,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: 'var(--pw-color-info, #2563eb)',
                flexShrink: 0,
              }}
            />
            Safety note
          </div>

          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, system-ui, sans-serif))',
              fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.5rem))',
              fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 700))' as unknown as number,
              lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.2))' as unknown as number,
              letterSpacing:
                'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
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
              fontWeight: 'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
              lineHeight: 'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))' as unknown as number,
              color: 'var(--pw-content-fg, var(--pw-color-on-surface, #0f172a))',
            }}
          >
            {body}
          </p>
        </header>

        <div
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '120ms',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--pw-element-gap, 0.75rem)',
            } as React.CSSProperties
          }
        >
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--pw-label-sublabel-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
              fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase' as const,
              color: 'var(--pw-label-sublabel-fg, var(--pw-color-muted, #64748b))',
            }}
          >
            We&apos;ll ask about
          </p>

          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--pw-element-gap, 0.75rem)',
            }}
          >
            {TOPICS.map((topic, index) => (
              <li
                key={topic}
                className="pw-motion-enter"
                style={
                  {
                    '--pw-motion-enter-delay': `${180 + index * 80}ms`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--pw-answer-gap, 0.75rem)',
                    minHeight: 44,
                    padding:
                      'var(--pw-control-padding, 0.875rem) var(--pw-control-padding, 1rem)',
                    background: 'var(--pw-color-background, #f8fafc)',
                    borderRadius: 'var(--pw-radius, 8px)',
                    border: '1px solid var(--pw-color-border, #e2e8f0)',
                    borderLeft: '3px solid var(--pw-color-brand, #2563eb)',
                    boxSizing: 'border-box',
                  } as React.CSSProperties
                }
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 'var(--pw-radius, 8px)',
                    background: 'var(--pw-answer-media-bg, #eff6ff)',
                    color: 'var(--pw-answer-media-fg, var(--pw-color-brand, #2563eb))',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
                    fontWeight: 700,
                    fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
                    lineHeight: 1,
                  }}
                >
                  {index + 1}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
                    fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                    fontWeight: 'var(--pw-answer-font-weight, var(--pw-font-weight-body, 500))' as unknown as number,
                    lineHeight: 'var(--pw-font-line-height-body, 1.45)' as unknown as number,
                    color: 'var(--pw-answer-fg, var(--pw-color-on-surface, #0f172a))',
                  }}
                >
                  {topic}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}