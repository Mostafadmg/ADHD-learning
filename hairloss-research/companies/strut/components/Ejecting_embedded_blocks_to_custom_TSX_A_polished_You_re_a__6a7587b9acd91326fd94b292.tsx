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
      'Your medical questionnaire is complete. The next step is a quick identity verification and checkout, then a licensed physician will review your information.',
  },
};

export const outputSchema = {
  ready: {
    type: 'boolean',
    title: 'Ready',
    description: 'True when the completion step has been viewed (always true).',
    required: false,
  },
};

const NEXT_STEPS = [
  {
    id: 'identity',
    step: '1',
    title: 'Identity verification',
    description:
      'A quick, secure check to confirm it’s you—usually takes just a minute.',
    icon: 'shield',
  },
  {
    id: 'physician',
    step: '2',
    title: 'Physician review',
    description:
      'A licensed physician will carefully review your questionnaire before any decision.',
    icon: 'clipboard',
  },
] as const;

function StepIcon({ name }: { name: 'shield' | 'clipboard' }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (name === 'shield') {
    return (
      <svg {...common}>
        <path d="M12 3l7 3v5c0 4.5-2.8 7.6-7 9-4.2-1.4-7-4.5-7-9V6l7-3z" />
        <path d="M9.5 12.5l1.8 1.8 3.7-3.8" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <path d="M9 5a2 2 0 012-2h2a2 2 0 012 2v1H9V5z" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}

export default function AlmostThereStep({
  title = "You're almost there!",
  body = 'Your medical questionnaire is complete. The next step is a quick identity verification and checkout, then a licensed physician will review your information.',
  onChange,
}: {
  title?: string;
  body?: string;
  onChange?: (outputs: { ready: boolean }) => void;
  onAnswer?: (outputs: { ready: boolean }) => void;
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
        maxWidth: '100%',
        boxSizing: 'border-box',
        fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1E293B)',
      }}
    >
      {/* Hero / status */}
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '0ms',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 'var(--pw-element-gap, 0.75rem)',
          } as React.CSSProperties
        }
      >
        <div
          aria-hidden
          style={{
            width: 64,
            height: 64,
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--pw-answer-surface-selected, #CCE8E4)',
            color: 'var(--pw-color-brand, #0F766E)',
            boxShadow: 'var(--pw-shadow, 0 1px 2px rgba(30,41,59,0.06), 0 4px 12px rgba(30,41,59,0.06))',
          }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 36 * 16 }}>
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
              fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-body, 1.0625rem)',
              fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
              lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
              color: 'var(--pw-label-sublabel-fg, #475569)',
            }}
          >
            {body}
          </p>
        </div>
      </div>

      {/* Questionnaire complete pill */}
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '80ms',
            display: 'flex',
            justifyContent: 'center',
          } as React.CSSProperties
        }
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '999px',
            background: 'var(--pw-answer-surface-selected, #CCE8E4)',
            color: 'var(--pw-color-brand, #0F766E)',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 600,
            fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
          }}
        >
          <span
            className="pw-motion-pop"
            aria-hidden
            style={{
              display: 'inline-flex',
              width: 18,
              height: 18,
              borderRadius: '999px',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--pw-color-brand, #0F766E)',
              color: 'var(--pw-color-brand-contrast, #FFFFFF)',
              fontSize: 11,
              lineHeight: 1,
            }}
          >
            ✓
          </span>
          Medical questionnaire complete
        </div>
      </div>

      {/* What's next */}
      <div
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
              '--pw-motion-enter-delay': '120ms',
              margin: 0,
              fontFamily: 'var(--pw-font-family-title, DM Sans, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase' as const,
              color: 'var(--pw-color-muted, #475569)',
            } as React.CSSProperties
          }
        >
          What&apos;s next
        </p>

        <ol
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 0.75rem)',
          }}
        >
          {NEXT_STEPS.map((item, index) => (
            <li
              key={item.id}
              className="pw-motion-enter"
              style={
                {
                  '--pw-motion-enter-delay': `${200 + index * 100}ms`,
                  display: 'flex',
                  gap: 'var(--pw-answer-gap, 0.75rem)',
                  alignItems: 'flex-start',
                  padding: 'var(--pw-control-padding, 1rem)',
                  background: 'var(--pw-color-surface, #FFFFFF)',
                  border: '1.5px solid var(--pw-color-border, #CBD5E1)',
                  borderRadius: 'var(--pw-radius, 0.5rem)',
                  boxShadow: 'var(--pw-shadow, 0 1px 2px rgba(30,41,59,0.06), 0 4px 12px rgba(30,41,59,0.06))',
                  boxSizing: 'border-box',
                } as React.CSSProperties
              }
            >
              <div
                aria-hidden
                style={{
                  flexShrink: 0,
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--pw-radius, 0.5rem)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--pw-answer-media-bg, #E7F5F3)',
                  color: 'var(--pw-answer-media-fg, #0F766E)',
                }}
              >
                <StepIcon name={item.icon} />
              </div>

              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                      fontWeight: 600,
                      color: 'var(--pw-color-brand, #0F766E)',
                      fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
                    }}
                  >
                    Step {item.step}
                  </span>
                  <span
                    style={{
                      margin: 0,
                      fontFamily: 'var(--pw-answer-font-family, Source Sans 3, system-ui, sans-serif)',
                      fontSize: 'var(--pw-answer-font-size, 1.0625rem)',
                      fontWeight: 600,
                      color: 'var(--pw-answer-fg, #1E293B)',
                      lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
                    }}
                  >
                    {item.title}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--pw-answer-subtext-font-family, Source Sans 3, system-ui, sans-serif)',
                    fontSize: 'var(--pw-answer-subtext-font-size, 0.875rem)',
                    fontWeight: 'var(--pw-answer-subtext-font-weight, 400)' as unknown as number,
                    color: 'var(--pw-answer-subtext-fg, #475569)',
                    lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
                  }}
                >
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* CTA cue — visual only; platform navigation advances */}
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '420ms',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: '0.5rem',
            paddingTop: '0.25rem',
          } as React.CSSProperties
        }
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            padding: 'var(--pw-navigation-button-padding, var(--pw-control-padding, 1rem))',
            borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
            background: 'var(--pw-button-bg, #0F766E)',
            color: 'var(--pw-button-fg, #FFFFFF)',
            fontFamily: 'var(--pw-navigation-button-font-family, Source Sans 3, system-ui, sans-serif)',
            fontSize: 'var(--pw-navigation-button-font-size, 1.0625rem)',
            fontWeight: 'var(--pw-navigation-button-font-weight, 600)' as unknown as number,
            textAlign: 'center',
            boxSizing: 'border-box',
            boxShadow: 'var(--pw-shadow, 0 1px 2px rgba(30,41,59,0.06), 0 4px 12px rgba(30,41,59,0.06))',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          aria-hidden
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3l7 3v5c0 4.5-2.8 7.6-7 9-4.2-1.4-7-4.5-7-9V6l7-3z" />
            <path d="M9.5 12.5l1.8 1.8 3.7-3.8" />
          </svg>
          Verify My Identity
        </div>
        <p
          style={{
            margin: 0,
            textAlign: 'center',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
            color: 'var(--pw-color-muted, #475569)',
            lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
          }}
        >
          Use Continue below to begin secure identity verification and checkout.
        </p>
      </div>
    </div>
  );
}