import React from 'react';

export const propSchema = {
  eyebrow: {
    type: 'string',
    title: 'Eyebrow',
    defaultValue: 'LDN Questionnaire',
  },
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'About this medication',
  },
};

export default function LdnWelcome({
  eyebrow = 'LDN Questionnaire',
  title = 'About this medication',
}: {
  eyebrow?: string;
  title?: string;
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
            fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--pw-color-brand, #0F766E)',
            lineHeight: 1.4,
          }}
        >
          {eyebrow}
        </p>
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
      </header>

      <section
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '100ms',
            background: 'var(--pw-color-surface, #FFFFFF)',
            border: '1px solid var(--pw-color-border, #CBD5E1)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            boxShadow: 'var(--pw-shadow, 0 1px 2px rgba(30,41,59,0.06), 0 4px 12px rgba(30,41,59,0.06))',
            padding: 'var(--pw-control-padding, 1rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 0.75rem)',
          } as React.CSSProperties
        }
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--pw-element-gap, 0.75rem)',
          }}
        >
          <span
            aria-hidden
            style={{
              flexShrink: 0,
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: 'var(--pw-radius, 0.5rem)',
              background: 'var(--pw-state-hover, #E7F5F3)',
              color: 'var(--pw-color-brand, #0F766E)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M9 3h6v3H9V3z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
              <path
                d="M8 6h8a2 2 0 012 2v11a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
              <path
                d="M10 12h4M12 10v4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                margin: '0 0 0.35rem 0',
                fontFamily: 'var(--pw-font-family-title, DM Sans, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-body, 1.0625rem)',
                fontWeight: 600,
                lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
                color: 'var(--pw-color-on-surface, #1E293B)',
              }}
            >
              What is LDN?
            </h2>
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
              Low-Dose Naltrexone (LDN) is a compounded medication that clinicians may
              prescribe off-label for certain chronic inflammatory, autoimmune, and
              chronic-pain conditions. This short questionnaire helps your care team
              understand your health history so they can determine whether LDN may be
              appropriate for you.
            </p>
          </div>
        </div>
      </section>

      <aside
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '200ms',
            background: 'var(--pw-color-background, #F7F5F1)',
            border: '1px solid var(--pw-color-border, #CBD5E1)',
            borderLeft: '3px solid var(--pw-color-brand, #0F766E)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            padding: 'var(--pw-control-padding, 1rem)',
          } as React.CSSProperties
        }
      >
        <p
          style={{
            margin: '0 0 0.35rem 0',
            fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 600,
            letterSpacing: '0.02em',
            color: 'var(--pw-color-brand, #0F766E)',
            textTransform: 'uppercase',
          }}
        >
          About off-label use
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-content-font-family, Source Sans 3, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
            lineHeight: 'var(--pw-content-line-height, 1.55)' as unknown as number,
            color: 'var(--pw-color-muted, #475569)',
          }}
        >
          “Off-label” means the FDA has not evaluated naltrexone at these low doses for
          these uses. Your clinician will discuss whether this option fits your
          individual needs and goals.
        </p>
      </aside>

      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '300ms',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--pw-element-gap, 0.75rem)',
            padding: '0 0.15rem',
          } as React.CSSProperties
        }
      >
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            width: '1.5rem',
            height: '1.5rem',
            marginTop: '0.1rem',
            borderRadius: '999px',
            background: 'var(--pw-state-hover, #E7F5F3)',
            color: 'var(--pw-color-brand, #0F766E)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 12l1.8 1.8L15 10"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1.0625rem)',
            fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
            lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
            color: 'var(--pw-label-sublabel-fg, #475569)',
          }}
        >
          A licensed physician will carefully review your answers and decide whether
          LDN is appropriate for you. You are not obligated to start treatment.
        </p>
      </div>
    </div>
  );
}