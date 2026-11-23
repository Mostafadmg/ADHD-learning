import React from 'react';

export const propSchema = {
  eyebrow: {
    type: 'string',
    title: 'Eyebrow',
    defaultValue: 'Safety screening',
  },
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'Why we ask about opioids',
  },
  body: {
    type: 'string',
    title: 'Body',
    defaultValue:
      'Naltrexone blocks the effects of opioids. If opioids are still in your system, starting LDN can cause sudden, severe withdrawal. The next few questions protect you.',
  },
};

const CARDS = [
  {
    key: 'current',
    title: 'Current opioid medications',
    description:
      'Including tramadol, methadone, buprenorphine, and opioid cough/cold products',
  },
  {
    key: 'recent',
    title: 'Use in the past 14 days',
    description: 'Patients generally need 7–10 opioid-free days',
  },
  {
    key: 'withdrawal',
    title: 'Withdrawal symptoms',
    description: 'LDN must not be started during withdrawal',
  },
] as const;

export default function OpioidSafetyInterstitial({
  eyebrow = 'Safety screening',
  title = 'Why we ask about opioids',
  body = 'Naltrexone blocks the effects of opioids. If opioids are still in your system, starting LDN can cause sudden, severe withdrawal. The next few questions protect you.',
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 36rem)',
        margin: '0 auto',
        boxSizing: 'border-box',
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
              fontFamily: 'var(--pw-label-sublabel-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase' as const,
              color: 'var(--pw-label-sublabel-fg, var(--pw-color-muted, #64748b))',
              lineHeight: 1.4,
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
              fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, system-ui, sans-serif))',
              fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.5rem))',
              fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 600))' as React.CSSProperties['fontWeight'],
              lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.2))',
              letterSpacing: 'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
              color: 'var(--pw-label-fg, var(--pw-color-on-surface, #0f172a))',
            } as React.CSSProperties
          }
        >
          {title}
        </h1>

        <p
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '160ms',
              margin: 0,
              fontFamily: 'var(--pw-content-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
              fontSize: 'var(--pw-content-font-size, var(--pw-font-size-body, 1rem))',
              fontWeight: 'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
              lineHeight: 'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))',
              color: 'var(--pw-content-fg, var(--pw-color-on-surface, #0f172a))',
              maxWidth: '40rem',
            } as React.CSSProperties
          }
        >
          {body}
        </p>
      </header>

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
        {CARDS.map((card, index) => (
          <li
            key={card.key}
            className="pw-motion-enter"
            style={
              {
                '--pw-motion-enter-delay': `${240 + index * 100}ms`,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 'var(--pw-answer-gap, 0.875rem)',
                padding: 'var(--pw-control-padding, 1rem)',
                background: 'var(--pw-color-surface, #ffffff)',
                border: '1.5px solid var(--pw-color-border, #e2e8f0)',
                borderRadius: 'var(--pw-radius, 8px)',
                boxShadow: 'var(--pw-shadow, none)',
                boxSizing: 'border-box',
              } as React.CSSProperties
            }
          >
            <span
              aria-hidden
              style={{
                flexShrink: 0,
                width: '0.375rem',
                alignSelf: 'stretch',
                minHeight: '2.5rem',
                borderRadius: '999px',
                background: 'var(--pw-color-brand, #2563eb)',
                opacity: 0.85,
              }}
            />
            <div
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
                  fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
                  fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                  fontWeight: 600,
                  lineHeight: 'var(--pw-font-line-height-body, 1.4)',
                  color: 'var(--pw-answer-fg, var(--pw-color-on-surface, #0f172a))',
                }}
              >
                {card.title}
              </span>
              <span
                style={{
                  fontFamily: 'var(--pw-answer-subtext-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
                  fontSize: 'var(--pw-answer-subtext-font-size, var(--pw-font-size-body, 1rem))',
                  fontWeight: 'var(--pw-answer-subtext-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
                  lineHeight: 'var(--pw-font-line-height-body, 1.5)',
                  color: 'var(--pw-answer-subtext-fg, var(--pw-label-sublabel-fg, var(--pw-color-muted, #64748b)))',
                }}
              >
                {card.description}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}