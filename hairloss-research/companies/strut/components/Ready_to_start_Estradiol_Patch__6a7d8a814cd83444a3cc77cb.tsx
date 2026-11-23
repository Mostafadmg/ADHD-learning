import React from 'react';

export const propSchema = {
  badge: {
    type: 'string',
    title: 'Badge',
    defaultValue: 'Medical questionnaire',
  },
  eyebrow: {
    type: 'string',
    title: 'Eyebrow',
    defaultValue: 'Estradiol Patch',
  },
  headline: {
    type: 'string',
    title: 'Headline',
    defaultValue: 'Ready to start Estradiol Patch',
  },
  subcopy: {
    type: 'string',
    title: 'Subcopy',
    defaultValue:
      'Bioidentical estradiol delivered as a transdermal patch for steady absorption through the skin. Changed on a regular schedule — a physician-guided option if you prefer not to take a daily pill or apply a cream.',
  },
  footnote: {
    type: 'string',
    title: 'Footnote',
    defaultValue:
      'A licensed clinician reviews every submission before anything is prescribed.',
  },
};

const HIGHLIGHTS = [
  {
    key: 'transdermal',
    title: 'Transdermal delivery',
    description: 'Steady absorption through the skin',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="6" y="3" width="12" height="18" rx="2.5" />
        <path d="M9 8h6M9 12h6M9 16h3.5" />
      </svg>
    ),
  },
  {
    key: 'schedule',
    title: 'Simple schedule',
    description: 'Change on a regular schedule, no daily pill',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4M9.5 15.5l1.75 1.75L15 13" />
      </svg>
    ),
  },
  {
    key: 'physician',
    title: 'Physician-guided BHRT',
    description: 'A clinician reviews your answers before any prescription',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v18M8 7h8M9 21h6a2 2 0 0 0 2-2v-3.5a2.5 2.5 0 0 0-2.5-2.5h-7A2.5 2.5 0 0 0 5 15.5V19a2 2 0 0 0 2 2z" />
        <circle cx="12" cy="12" r="2.25" />
      </svg>
    ),
  },
] as const;

export default function EstradiolPatchWelcome({
  badge = 'Medical questionnaire',
  eyebrow = 'Estradiol Patch',
  headline = 'Ready to start Estradiol Patch',
  subcopy = 'Bioidentical estradiol delivered as a transdermal patch for steady absorption through the skin. Changed on a regular schedule — a physician-guided option if you prefer not to take a daily pill or apply a cream.',
  footnote = 'A licensed clinician reviews every submission before anything is prescribed.',
}: {
  badge?: string;
  eyebrow?: string;
  headline?: string;
  subcopy?: string;
  footnote?: string;
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
            alignItems: 'flex-start',
            gap: '0.75rem',
          } as React.CSSProperties
        }
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.35rem 0.75rem',
            borderRadius: '999px',
            background: 'var(--pw-answer-surface-selected, #F1F0E8)',
            color: 'var(--pw-label-sublabel-fg, #545454)',
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
            fontWeight: 500,
            letterSpacing: '0.02em',
            lineHeight: 1.3,
          }}
        >
          {badge}
        </span>

        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--pw-color-brand, #161336)',
            lineHeight: 1.4,
          }}
        >
          {eyebrow}
        </p>

        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-title, 1.75rem)',
            fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
            lineHeight: 'var(--pw-font-line-height-title, 1.2)' as unknown as number,
            letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
            color: 'var(--pw-label-fg, #002021)',
          }}
        >
          {headline}
        </h1>

        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-content-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-content-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
            lineHeight: 'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))' as unknown as number,
            color: 'var(--pw-label-sublabel-fg, #545454)',
            maxWidth: '36rem',
          }}
        >
          {subcopy}
        </p>
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
        {HIGHLIGHTS.map((item, index) => (
          <li
            key={item.key}
            className="pw-motion-enter"
            style={
              {
                '--pw-motion-enter-delay': `${(index + 1) * 100}ms`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--pw-answer-gap, 0.875rem)',
                padding: 'var(--pw-control-padding, 1rem)',
                background: 'var(--pw-color-surface, #ffffff)',
                border: '1.5px solid var(--pw-color-border, #EFEFEC)',
                borderRadius: 'var(--pw-radius, 0.5rem)',
                boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
                boxSizing: 'border-box',
              } as React.CSSProperties
            }
          >
            <span
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.75rem',
                height: '2.75rem',
                borderRadius: 'var(--pw-radius, 0.5rem)',
                background: 'var(--pw-answer-media-bg, var(--pw-answer-surface-selected, #F1F0E8))',
                color: 'var(--pw-answer-media-fg, var(--pw-color-brand, #161336))',
              }}
              aria-hidden="true"
            >
              {item.icon}
            </span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                minWidth: 0,
                paddingTop: '0.15rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                  fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                  fontWeight: 600,
                  color: 'var(--pw-answer-fg, #1C1C21)',
                  lineHeight: 1.35,
                }}
              >
                {item.title}
              </span>
              <span
                style={{
                  fontFamily: 'var(--pw-answer-subtext-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                  fontSize: 'var(--pw-answer-subtext-font-size, 0.9375rem)',
                  fontWeight: 'var(--pw-answer-subtext-font-weight, 400)' as unknown as number,
                  color: 'var(--pw-answer-subtext-fg, var(--pw-label-sublabel-fg, #545454))',
                  lineHeight: 1.45,
                }}
              >
                {item.description}
              </span>
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
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
            fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
            lineHeight: 1.5,
            color: 'var(--pw-color-muted, #71717a)',
          } as React.CSSProperties
        }
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0, marginTop: '0.1rem' }}
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        <span>{footnote}</span>
      </p>
    </div>
  );
}