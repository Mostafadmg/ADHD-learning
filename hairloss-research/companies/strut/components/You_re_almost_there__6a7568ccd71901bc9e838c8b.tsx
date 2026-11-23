import React from 'react';

export const propSchema = {
  eyebrow: {
    type: 'string',
    title: 'Eyebrow',
    defaultValue: 'Almost done',
  },
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: "You're almost there!",
  },
  body: {
    type: 'string',
    title: 'Body',
    defaultValue:
      "You've finished the medical questionnaire. Next is a quick identity verification, then a licensed physician will review your information.",
  },
};

const STEPS = [
  { key: 'questionnaire', label: 'Questionnaire', status: 'complete' as const },
  { key: 'review', label: 'Review prep', status: 'complete' as const },
  { key: 'verify', label: 'Verify identity', status: 'current' as const },
];

export default function AlmostThere({
  eyebrow = 'Almost done',
  title = "You're almost there!",
  body = "You've finished the medical questionnaire. Next is a quick identity verification, then a licensed physician will review your information.",
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
        fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #0f172a)',
      }}
    >
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '0ms',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 0.75rem)',
          } as React.CSSProperties
        }
      >
        {eyebrow ? (
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--pw-label-sublabel-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--pw-color-brand, #2563eb)',
            }}
          >
            {eyebrow}
          </p>
        ) : null}

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
            color: 'var(--pw-content-fg, var(--pw-color-on-surface, #0f172a))',
            maxWidth: '36em',
          }}
        >
          {body}
        </p>
      </div>

      <div
        className="pw-motion-enter"
        role="list"
        aria-label="Progress"
        style={
          {
            '--pw-motion-enter-delay': '100ms',
            display: 'flex',
            alignItems: 'flex-start',
            width: '100%',
            padding: 'var(--pw-control-padding, 1rem)',
            borderRadius: 'var(--pw-radius, 8px)',
            background: 'var(--pw-color-surface, #ffffff)',
            border: '1px solid var(--pw-color-border, #e2e8f0)',
            boxShadow: 'var(--pw-shadow, 0 1px 3px rgba(15, 23, 42, 0.06))',
            boxSizing: 'border-box',
          } as React.CSSProperties
        }
      >
        {STEPS.map((step, index) => {
          const isComplete = step.status === 'complete';
          const isCurrent = step.status === 'current';
          const isLast = index === STEPS.length - 1;

          return (
            <React.Fragment key={step.key}>
              <div
                role="listitem"
                className="pw-motion-enter"
                aria-current={isCurrent ? 'step' : undefined}
                style={
                  {
                    '--pw-motion-enter-delay': `${150 + index * 100}ms`,
                    flex: '1 1 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    minWidth: 0,
                    textAlign: 'center',
                  } as React.CSSProperties
                }
              >
                <div
                  aria-hidden
                  style={{
                    width: 'var(--pw-answer-indicator-size, 28px)',
                    height: 'var(--pw-answer-indicator-size, 28px)',
                    minWidth: 28,
                    minHeight: 28,
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isComplete
                      ? 'var(--pw-color-success, #16a34a)'
                      : isCurrent
                        ? 'var(--pw-color-brand, #2563eb)'
                        : 'var(--pw-color-surface, #ffffff)',
                    color: isComplete
                      ? 'var(--pw-color-on-success, #ffffff)'
                      : isCurrent
                        ? 'var(--pw-color-brand-contrast, #ffffff)'
                        : 'var(--pw-color-muted, #64748b)',
                    border: isCurrent || isComplete
                      ? '2px solid transparent'
                      : '2px solid var(--pw-color-border, #e2e8f0)',
                    boxShadow: isCurrent
                      ? '0 0 0 4px color-mix(in srgb, var(--pw-color-brand, #2563eb) 18%, transparent)'
                      : 'none',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    transition: `background var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease), box-shadow var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease)`,
                  }}
                >
                  {isComplete ? (
                    <span className="pw-motion-pop" style={{ display: 'flex', lineHeight: 1 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path
                          d="M3 7.2L5.8 10L11 3.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <span
                  style={{
                    fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
                    fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
                    fontWeight: isCurrent ? 600 : 'var(--pw-answer-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
                    lineHeight: 1.3,
                    color: isCurrent
                      ? 'var(--pw-color-on-surface, #0f172a)'
                      : isComplete
                        ? 'var(--pw-color-on-surface, #0f172a)'
                        : 'var(--pw-color-muted, #64748b)',
                    maxWidth: '100%',
                    wordBreak: 'break-word',
                  }}
                >
                  {step.label}
                </span>

                {isCurrent ? (
                  <span
                    style={{
                      fontSize: 'var(--pw-font-size-caption, 0.7rem)',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: 'var(--pw-color-brand, #2563eb)',
                      lineHeight: 1,
                    }}
                  >
                    Up next
                  </span>
                ) : isComplete ? (
                  <span
                    style={{
                      fontSize: 'var(--pw-font-size-caption, 0.7rem)',
                      fontWeight: 500,
                      color: 'var(--pw-color-success, #16a34a)',
                      lineHeight: 1,
                    }}
                  >
                    Done
                  </span>
                ) : (
                  <span style={{ fontSize: 'var(--pw-font-size-caption, 0.7rem)', visibility: 'hidden', lineHeight: 1 }}>
                    ·
                  </span>
                )}
              </div>

              {!isLast ? (
                <div
                  aria-hidden
                  style={{
                    flex: '0 0 auto',
                    width: 'clamp(12px, 6vw, 40px)',
                    height: 2,
                    marginTop: 13,
                    borderRadius: 999,
                    background: isComplete
                      ? 'var(--pw-color-success, #16a34a)'
                      : 'var(--pw-color-border, #e2e8f0)',
                    opacity: isComplete ? 0.85 : 1,
                    alignSelf: 'flex-start',
                  }}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}