import React, { useEffect } from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: "You're almost there!",
  },
  body: {
    type: 'string',
    title: 'Body',
    defaultValue:
      'Your medical questionnaire is complete. The next step is a quick identity verification, then a licensed physician will review your information.',
  },
  ctaLabel: {
    type: 'string',
    title: 'CTA label',
    defaultValue: 'Verify My Identity',
  },
};

export const outputSchema = {
  ready: {
    type: 'boolean',
    title: 'Ready',
    description: 'True when the questionnaire is complete and the patient can continue to identity verification',
    required: true,
  },
};

const STEPS = [
  {
    key: 'identity',
    label: 'Identity verification',
    detail: 'A quick photo ID check so we know it’s you — usually under two minutes.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="9" cy="12" r="2.25" stroke="currentColor" strokeWidth="1.75" />
        <path d="M13.5 10.5h4M13.5 13.5h3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'physician',
    label: 'Physician review',
    detail: 'A licensed physician reviews your answers before any treatment is approved.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3v18M8 7h8M9 17h6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    ),
  },
] as const;

export default function MetforminDoneScreen({
  title = "You're almost there!",
  body = 'Your medical questionnaire is complete. The next step is a quick identity verification, then a licensed physician will review your information.',
  ctaLabel = 'Verify My Identity',
  onChange,
}: {
  title?: string;
  body?: string;
  ctaLabel?: string;
  onChange?: (outputs: { ready: boolean }) => void;
}) {
  useEffect(() => {
    onChange?.({ ready: true });
  }, [onChange]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 32rem)',
        margin: '0 auto',
        fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #0f172a)',
        boxSizing: 'border-box',
      }}
    >
      <header
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
          '--pw-motion-enter-delay': '0ms',
        } as React.CSSProperties}
      >
        <div
          aria-hidden="true"
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--pw-color-success-surface, #dcfce7)',
            color: 'var(--pw-color-success, #16a34a)',
            flexShrink: 0,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, system-ui, sans-serif))',
            fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.5rem))',
            fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 700))' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.2))',
            letterSpacing: 'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
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
            lineHeight: 'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))',
            color: 'var(--pw-content-fg, var(--pw-color-muted, #64748b))',
          }}
        >
          {body}
        </p>
      </header>

      <section
        aria-label="What happens next"
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
            fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--pw-label-sublabel-fg, var(--pw-color-muted, #64748b))',
            '--pw-motion-enter-delay': '80ms',
          } as React.CSSProperties}
        >
          Next up
        </p>

        <ol
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(11.5rem, 1fr))',
            gap: 'var(--pw-element-gap, 0.75rem)',
          }}
        >
          {STEPS.map((step, index) => (
            <li
              key={step.key}
              className="pw-motion-enter"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--pw-answer-gap, 0.75rem)',
                padding: 'var(--pw-control-padding, 1rem)',
                background: 'var(--pw-color-surface, #ffffff)',
                border: '1.5px solid var(--pw-color-border, #e2e8f0)',
                borderRadius: 'var(--pw-radius, 8px)',
                boxShadow: 'var(--pw-shadow, 0 1px 3px rgba(15, 23, 42, 0.06))',
                minWidth: 0,
                '--pw-motion-enter-delay': `${120 + index * 100}ms`,
              } as React.CSSProperties}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--pw-answer-gap, 0.75rem)',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: 'var(--pw-radius, 8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: 'var(--pw-answer-media-bg, #f1f5f9)',
                    color: 'var(--pw-answer-media-fg, var(--pw-color-brand, #2563eb))',
                  }}
                >
                  {step.icon}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    marginLeft: 'auto',
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--pw-font-size-caption, 0.75rem)',
                    fontWeight: 700,
                    fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
                    color: 'var(--pw-color-brand, #2563eb)',
                    background: 'var(--pw-color-info-surface, #eff6ff)',
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: 0 }}>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
                    fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                    fontWeight: 600,
                    lineHeight: 'var(--pw-font-line-height-body, 1.4)',
                    color: 'var(--pw-answer-fg, var(--pw-color-on-surface, #0f172a))',
                  }}
                >
                  {step.label}
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--pw-answer-subtext-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
                    fontSize: 'var(--pw-answer-subtext-font-size, var(--pw-font-size-caption, 0.875rem))',
                    fontWeight: 'var(--pw-answer-subtext-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
                    lineHeight: 'var(--pw-font-line-height-body, 1.5)',
                    color: 'var(--pw-answer-subtext-fg, var(--pw-label-sublabel-fg, #64748b))',
                  }}
                >
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginTop: 'var(--pw-element-gap, 0.5rem)',
          '--pw-motion-enter-delay': '320ms',
        } as React.CSSProperties}
      >
        <button
          type="submit"
          className="pw-motion-enter"
          style={{
            appearance: 'none',
            width: '100%',
            minHeight: '48px',
            padding: 'var(--pw-navigation-button-padding, var(--pw-control-padding, 1rem))',
            border: 'none',
            borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 8px))',
            background: 'var(--pw-button-bg, var(--pw-color-brand, #2563eb))',
            color: 'var(--pw-button-fg, var(--pw-color-brand-contrast, #ffffff))',
            fontFamily: 'var(--pw-navigation-button-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
            fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 'var(--pw-navigation-button-font-weight, 600)' as React.CSSProperties['fontWeight'],
            lineHeight: 1.3,
            cursor: 'pointer',
            textAlign: 'center',
            transition: `transform var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease), opacity var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease)`,
            boxShadow: 'var(--pw-shadow, 0 1px 3px rgba(15, 23, 42, 0.08))',
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid var(--pw-state-focus-ring, var(--pw-color-brand, #2563eb))';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          {ctaLabel}
        </button>
        <p
          style={{
            margin: 0,
            textAlign: 'center',
            fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.8rem)',
            lineHeight: 1.45,
            color: 'var(--pw-label-sublabel-fg, var(--pw-color-muted, #64748b))',
          }}
        >
          Secure · Takes about 2 minutes
        </p>
      </div>
    </div>
  );
}