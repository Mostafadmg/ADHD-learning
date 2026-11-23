import React from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'A quick safety check',
  },
  body: {
    type: 'string',
    title: 'Body',
    defaultValue:
      'Naltrexone blocks opioid receptors. Before we consider low-dose naltrexone (LDN), we need to confirm you are not currently using opioids and not in withdrawal.',
  },
  footerNote: {
    type: 'string',
    title: 'Footer note',
    defaultValue:
      'Please answer the next questions honestly — this protects you from sudden withdrawal.',
  },
};

const chips = [
  {
    key: 'rx',
    label: 'Prescription opioids',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
        <path d="M3 11h18" stroke="currentColor" strokeWidth="1.75" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.75" />
        <path d="M12 14v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M10 15h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'special',
    label: 'Tramadol, methadone, buprenorphine',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9.5 3.5 4 12l5.5 8.5h5L20 12 14.5 3.5h-5Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path d="M12 9v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="12" cy="15.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: 'otc',
    label: 'Opioid cough, cold, or anti-diarrheal products',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 3h6v4a2 2 0 0 0 2 2h1a3 3 0 0 1 3 3v1a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-1a3 3 0 0 1 3-3h1a2 2 0 0 0 2-2V3Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path d="M9 3c0 1.5.5 2.5 3 2.5S15 4.5 15 3" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    ),
  },
];

export default function OpioidSafetyInterstitial({
  title = 'A quick safety check',
  body = 'Naltrexone blocks opioid receptors. Before we consider low-dose naltrexone (LDN), we need to confirm you are not currently using opioids and not in withdrawal.',
  footerNote = 'Please answer the next questions honestly — this protects you from sudden withdrawal.',
}: {
  title?: string;
  body?: string;
  footerNote?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
        fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1E293B)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <header
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
          ['--pw-motion-enter-delay' as string]: '0ms',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            alignSelf: 'flex-start',
            padding: '0.35rem 0.7rem',
            borderRadius: '999px',
            background: 'var(--pw-color-info-surface, #E7F5F3)',
            color: 'var(--pw-color-brand, #0F766E)',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 600,
            letterSpacing: '0.01em',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3 4.5 6v6.5c0 4.5 3.2 7.8 7.5 8.5 4.3-.7 7.5-4 7.5-8.5V6L12 3Z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <path d="M12 11v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <circle cx="12" cy="8.5" r="1" fill="currentColor" />
          </svg>
          Safety
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-title, DM Sans, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-title, 1.375rem)',
            fontWeight: 'var(--pw-font-weight-title, 600)' as unknown as number,
            lineHeight: 'var(--pw-font-line-height-title, 1.25)' as unknown as number,
            letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
            color: 'var(--pw-label-fg, #1E293B)',
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-content-font-family, Source Sans 3, system-ui, sans-serif)',
            fontSize: 'var(--pw-content-font-size, 1.0625rem)',
            fontWeight: 'var(--pw-content-font-weight, 400)' as unknown as number,
            lineHeight: 'var(--pw-content-line-height, 1.55)' as unknown as number,
            color: 'var(--pw-content-fg, #1E293B)',
          }}
        >
          {body}
        </p>
      </header>

      <section
        aria-label="Medications and products to watch for"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
        }}
      >
        <p
          className="pw-motion-enter"
          style={{
            margin: 0,
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 600,
            color: 'var(--pw-color-muted, #475569)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase' as const,
            ['--pw-motion-enter-delay' as string]: '80ms',
          }}
        >
          Includes things like
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
          {chips.map((chip, index) => (
            <li
              key={chip.key}
              className="pw-motion-enter"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--pw-answer-gap, 0.75rem)',
                padding: 'var(--pw-control-padding, 1rem)',
                background: 'var(--pw-color-surface, #FFFFFF)',
                border: '1px solid var(--pw-color-border, #CBD5E1)',
                borderRadius: 'var(--pw-radius, 0.5rem)',
                boxShadow: 'var(--pw-shadow, 0 1px 2px rgba(30,41,59,0.06), 0 4px 12px rgba(30,41,59,0.06))',
                ['--pw-motion-enter-delay' as string]: `${160 + index * 100}ms`,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2.5rem',
                  height: '2.5rem',
                  flexShrink: 0,
                  borderRadius: 'var(--pw-radius, 0.5rem)',
                  background: 'var(--pw-answer-media-bg, #E7F5F3)',
                  color: 'var(--pw-answer-media-fg, #0F766E)',
                }}
              >
                {chip.icon}
              </span>
              <span
                style={{
                  fontFamily: 'var(--pw-answer-font-family, Source Sans 3, system-ui, sans-serif)',
                  fontSize: 'var(--pw-answer-font-size, 1.0625rem)',
                  fontWeight: 500,
                  lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
                  color: 'var(--pw-answer-fg, #1E293B)',
                }}
              >
                {chip.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <footer
        className="pw-motion-enter"
        style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start',
          padding: 'var(--pw-control-padding, 1rem)',
          borderRadius: 'var(--pw-radius, 0.5rem)',
          background: 'var(--pw-color-background, #F7F5F1)',
          border: '1px solid var(--pw-color-border, #CBD5E1)',
          ['--pw-motion-enter-delay' as string]: '480ms',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '0.1rem',
            color: 'var(--pw-color-brand, #0F766E)',
          }}
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
            <path d="M12 11v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <circle cx="12" cy="8" r="1" fill="currentColor" />
          </svg>
        </span>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            lineHeight: 1.5,
            color: 'var(--pw-label-sublabel-fg, #475569)',
            fontFamily: 'var(--pw-label-sublabel-font-family, Source Sans 3, system-ui, sans-serif)',
          }}
        >
          {footerNote}
        </p>
      </footer>
    </div>
  );
}