import React from 'react';

export const propSchema = {
  eyebrow: {
    type: 'string',
    title: 'Eyebrow',
    defaultValue: 'LDN intake',
  },
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'About this medication',
  },
  body: {
    type: 'string',
    title: 'Body',
    defaultValue:
      'Low-Dose Naltrexone (LDN) is a compounded medication prescribed off-label for chronic inflammatory, autoimmune, and chronic-pain conditions. Off-label means the FDA has not evaluated naltrexone at these low doses for these uses. A licensed physician will review your answers and decide whether LDN is appropriate for you.',
  },
};

const TRUST_ITEMS = [
  {
    key: 'off-label',
    label: 'Off-label transparency',
    detail: 'We state the regulatory status up front.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3.5L4.5 7v5.2c0 4.4 3.1 7.6 7.5 8.8 4.4-1.2 7.5-4.4 7.5-8.8V7L12 3.5z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9.2 12.2l1.8 1.8 3.8-3.9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: 'physician',
    label: 'Reviewed by a licensed physician',
    detail: 'A clinician decides if LDN fits your case.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M5.5 19.5c.6-3.4 3.2-5.2 6.5-5.2s5.9 1.8 6.5 5.2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M19 8.5v4M17 10.5h4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: 'time',
    label: 'About 5–7 minutes',
    detail: 'Short questions so we understand your history.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="13" r="7.25" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M12 10v3.2l2.2 1.4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 4.5h6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
] as const;

export default function LdnWelcome({
  eyebrow = 'LDN intake',
  title = 'About this medication',
  body = 'Low-Dose Naltrexone (LDN) is a compounded medication prescribed off-label for chronic inflammatory, autoimmune, and chronic-pain conditions. Off-label means the FDA has not evaluated naltrexone at these low doses for these uses. A licensed physician will review your answers and decide whether LDN is appropriate for you.',
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
}) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 36rem)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
        fontFamily: 'var(--pw-font-family-body, "Source Sans 3", system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #2A3330)',
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
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-body, "Source Sans 3", system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.9375rem)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--pw-color-brand, #3D6F7C)',
            lineHeight: 1.4,
          }}
        >
          {eyebrow}
        </p>

        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--pw-label-font-family, Lora, Georgia, serif)',
            fontSize: 'var(--pw-label-font-size, 1.75rem)',
            fontWeight: 'var(--pw-label-font-weight, 600)' as unknown as number,
            lineHeight: 'var(--pw-label-line-height, 1.25)' as unknown as number,
            letterSpacing: 'var(--pw-label-letter-spacing, -0.01em)',
            color: 'var(--pw-label-fg, #2A3330)',
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: 0,
            marginTop: '0.25rem',
            fontFamily: 'var(--pw-content-font-family, "Source Sans 3", system-ui, sans-serif)',
            fontSize: 'var(--pw-content-font-size, 1.125rem)',
            fontWeight: 'var(--pw-content-font-weight, 400)' as unknown as number,
            lineHeight: 'var(--pw-content-line-height, 1.6)' as unknown as number,
            color: 'var(--pw-content-fg, #2A3330)',
            maxWidth: '40rem',
          }}
        >
          {body}
        </p>
      </header>

      <ul
        aria-label="What to expect"
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(9.5rem, 1fr))',
          gap: 'var(--pw-element-gap, 0.75rem)',
        }}
      >
        {TRUST_ITEMS.map((item, index) => (
          <li
            key={item.key}
            className="pw-motion-enter"
            style={
              {
                '--pw-motion-enter-delay': `${(index + 1) * 100}ms`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.625rem',
                padding: 'var(--pw-control-padding, 1rem)',
                background: 'var(--pw-color-surface, #F1EDE4)',
                border: '1px solid var(--pw-color-border, #D9D2C3)',
                borderRadius: 'var(--pw-radius, 0.25rem)',
                boxShadow: 'var(--pw-shadow, 0 1px 3px rgba(0,0,0,0.08))',
                minHeight: '7.5rem',
                boxSizing: 'border-box',
              } as React.CSSProperties
            }
          >
            <span
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: 'var(--pw-radius, 0.25rem)',
                background: 'var(--pw-color-info-surface, #D4E2E6)',
                color: 'var(--pw-color-brand, #3D6F7C)',
                flexShrink: 0,
              }}
            >
              {item.icon}
            </span>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                flex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--pw-answer-font-family, "Source Sans 3", system-ui, sans-serif)',
                  fontSize: 'var(--pw-answer-font-size, 1.125rem)',
                  fontWeight: 600,
                  lineHeight: 1.35,
                  color: 'var(--pw-color-on-surface, #2A3330)',
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--pw-answer-subtext-font-family, "Source Sans 3", system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-caption, 0.9375rem)',
                  fontWeight: 'var(--pw-answer-subtext-font-weight, 400)' as unknown as number,
                  lineHeight: 1.45,
                  color: 'var(--pw-answer-subtext-fg, #5C6762)',
                }}
              >
                {item.detail}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}