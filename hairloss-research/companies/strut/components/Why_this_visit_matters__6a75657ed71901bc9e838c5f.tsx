import React from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'A few questions about your goals',
  },
  body: {
    type: 'string',
    title: 'Body',
    defaultValue:
      'Understanding what you hope metformin will help with lets the physician personalize your review — whether that’s longevity, metabolic health, weight, energy, or prevention.',
  },
  reassurance: {
    type: 'string',
    title: 'Reassurance',
    defaultValue:
      'Your answers are reviewed by a licensed physician — not an automated approval.',
  },
};

export default function GoalsInterstitial({
  title = 'A few questions about your goals',
  body = 'Understanding what you hope metformin will help with lets the physician personalize your review — whether that’s longevity, metabolic health, weight, energy, or prevention.',
  reassurance = 'Your answers are reviewed by a licensed physician — not an automated approval.',
}: {
  title?: string;
  body?: string;
  reassurance?: string;
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
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 'var(--pw-font-weight-body, 400)' as React.CSSProperties['fontWeight'],
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--pw-color-muted, #64748b)',
          }}
        >
          Next up
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, system-ui, sans-serif))',
            fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.5rem))',
            fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 600))' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.2))' as React.CSSProperties['lineHeight'],
            letterSpacing: 'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
            color: 'var(--pw-label-fg, var(--pw-color-on-surface, #0f172a))',
          }}
        >
          {title}
        </h1>
      </div>

      <p
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '100ms',
            margin: 0,
            fontFamily: 'var(--pw-content-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
            fontSize: 'var(--pw-content-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))' as React.CSSProperties['lineHeight'],
            color: 'var(--pw-content-fg, var(--pw-color-on-surface, #0f172a))',
          } as React.CSSProperties
        }
      >
        {body}
      </p>

      <div
        className="pw-motion-enter"
        role="note"
        style={
          {
            '--pw-motion-enter-delay': '200ms',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--pw-answer-gap, 0.75rem)',
            padding: 'var(--pw-control-padding, 1rem)',
            borderRadius: 'var(--pw-radius, 8px)',
            background: 'var(--pw-color-info-surface, #eff6ff)',
            border: '1px solid var(--pw-color-border, #e2e8f0)',
            boxShadow: 'var(--pw-shadow, none)',
          } as React.CSSProperties
        }
      >
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            width: '1.75rem',
            height: '1.75rem',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--pw-color-info, #3b82f6)',
            color: 'var(--pw-color-on-info, #ffffff)',
            fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          ✓
        </span>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 'var(--pw-font-weight-body, 400)' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-font-line-height-body, 1.55)' as React.CSSProperties['lineHeight'],
            color: 'var(--pw-color-on-surface, #0f172a)',
          }}
        >
          {reassurance}
        </p>
      </div>
    </div>
  );
}