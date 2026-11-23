import React from 'react';

export const propSchema = {
  eyebrow: {
    type: 'string',
    title: 'Eyebrow',
    defaultValue: 'Medical questionnaire',
  },
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'Metformin for healthy aging',
  },
  lead: {
    type: 'string',
    title: 'Lead paragraph',
    defaultValue:
      'Metformin is FDA-approved for type 2 diabetes. Some adults also ask about it off-label for healthy aging and metabolic health—uses the FDA has not evaluated or approved. This brief questionnaire helps a clinician understand whether that conversation is appropriate for you.',
  },
};

const CARDS = [
  {
    key: 'physician',
    title: 'Physician review',
    body: 'A U.S. licensed physician reviews your answers and decides whether off-label metformin is appropriate for you. Nothing is prescribed automatically.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M16.5 7.5v3M15 9h3"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: 'kidney',
    title: 'Kidney health matters',
    body: 'Kidney function is a key safety factor for metformin. We’ll ask about lab history and related conditions so your clinician can screen carefully.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: 'safety',
    title: 'Not right for everyone',
    body: 'Honest safety screening comes next. Some medical histories mean metformin isn’t a fit—we’ll flag those clearly and never pressure a decision.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 9v4M12 17h.01"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M10.29 4.86 2.82 17a2 2 0 0 0 1.71 3h14.94a2 2 0 0 0 1.71-3L13.71 4.86a2 2 0 0 0-3.42 0Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function MetforminWelcome({
  eyebrow = 'Medical questionnaire',
  title = 'Metformin for healthy aging',
  lead = 'Metformin is FDA-approved for type 2 diabetes. Some adults also ask about it off-label for healthy aging and metabolic health—uses the FDA has not evaluated or approved. This brief questionnaire helps a clinician understand whether that conversation is appropriate for you.',
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-element-gap, 1.25rem)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
      }}
    >
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '0ms',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 1.25rem)',
          } as React.CSSProperties
        }
      >
        <span
          style={{
            alignSelf: 'flex-start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '999px',
            background: 'var(--pw-color-brand, #161336)',
            color: 'var(--pw-color-brand-contrast, #ffffff)',
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.8rem)',
            fontWeight: 500,
            letterSpacing: '0.02em',
            lineHeight: 1.3,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 6,
              height: 6,
              borderRadius: '999px',
              background: 'var(--pw-color-brand-contrast, #ffffff)',
              opacity: 0.85,
              flexShrink: 0,
            }}
          />
          {eyebrow}
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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

          <p
            style={{
              margin: 0,
              fontFamily: 'var(--pw-content-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
              fontSize: 'var(--pw-content-font-size, var(--pw-font-size-body, 1rem))',
              fontWeight: 'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
              lineHeight: 'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))',
              color: 'var(--pw-content-fg, var(--pw-color-on-surface, #1C1C21))',
              maxWidth: '38em',
            }}
          >
            {lead}
          </p>
        </div>
      </div>

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {CARDS.map((card, index) => (
          <li
            key={card.key}
            className="pw-motion-enter"
            style={
              {
                '--pw-motion-enter-delay': `${(index + 1) * 100}ms`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--pw-answer-gap, 0.875rem)',
                padding: 'var(--pw-control-padding, 1rem)',
                borderRadius: 'var(--pw-radius, 0.5rem)',
                border: '1px solid var(--pw-color-border, #EFEFEC)',
                background: 'var(--pw-color-surface, #ffffff)',
                boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
                boxSizing: 'border-box',
              } as React.CSSProperties
            }
          >
            <span
              aria-hidden="true"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                flexShrink: 0,
                borderRadius: 'var(--pw-radius, 0.5rem)',
                background: 'var(--pw-answer-media-bg, var(--pw-state-hover, #F1F0E8))',
                color: 'var(--pw-answer-media-fg, var(--pw-color-brand, #161336))',
              }}
            >
              {card.icon}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: 0 }}>
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-body, 1rem)',
                  fontWeight: 600,
                  lineHeight: 1.35,
                  color: 'var(--pw-label-fg, #002021)',
                }}
              >
                {card.title}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                  fontWeight: 'var(--pw-font-weight-body, 400)' as React.CSSProperties['fontWeight'],
                  lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                  color: 'var(--pw-label-sublabel-fg, #545454)',
                }}
              >
                {card.body}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '400ms',
            margin: 0,
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.8rem)',
            lineHeight: 1.5,
            color: 'var(--pw-color-muted, #71717a)',
          } as React.CSSProperties
        }
      >
        Your responses are confidential and used only for clinical review.
      </p>
    </div>
  );
}