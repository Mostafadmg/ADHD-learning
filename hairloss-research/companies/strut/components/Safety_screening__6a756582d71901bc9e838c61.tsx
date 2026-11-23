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
      'Metformin is generally well tolerated, but certain situations — prior acidosis, heavy alcohol use, or being very sick right now — need extra care.',
  },
  reassurance: {
    type: 'string',
    title: 'Reassurance',
    defaultValue:
      'Honest answers help us keep you safe. There are no wrong responses here.',
  },
};

export default function SafetyCheckInterstitial({
  title = 'A quick safety check',
  body = 'Metformin is generally well tolerated, but certain situations — prior acidosis, heavy alcohol use, or being very sick right now — need extra care.',
  reassurance = 'Honest answers help us keep you safe. There are no wrong responses here.',
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
        fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
      }}
    >
      <div
        className="pw-motion-enter"
        style={{
          ['--pw-motion-enter-delay' as string]: '0ms',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--pw-element-gap, 0.75rem)',
          padding: 'var(--pw-control-padding, 1.25rem)',
          background: 'var(--pw-color-surface, #ffffff)',
          border: '1px solid var(--pw-color-border, #e2e8f0)',
          borderRadius: 'var(--pw-radius, 12px)',
          boxShadow: 'var(--pw-shadow, 0 1px 3px rgba(15, 23, 42, 0.08))',
        }}
      >
        <div
          aria-hidden
          style={{
            flexShrink: 0,
            width: 44,
            height: 44,
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--pw-color-info-surface, #e0f2fe)',
            color: 'var(--pw-color-info, #0284c7)',
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M12 3l7.5 3v5.5c0 4.5-3 7.9-7.5 9.5-4.5-1.6-7.5-5-7.5-9.5V6L12 3z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <path
              d="M12 11v4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            <circle cx="12" cy="8.25" r="1" fill="currentColor" />
          </svg>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 0.75rem)',
            minWidth: 0,
          }}
        >
          <h2
            className="pw-motion-enter"
            style={{
              ['--pw-motion-enter-delay' as string]: '80ms',
              margin: 0,
              fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, system-ui, sans-serif))',
              fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.5rem))',
              fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 600))' as unknown as number,
              lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.2))' as unknown as number,
              letterSpacing: 'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
              color: 'var(--pw-label-fg, var(--pw-color-on-surface, #0f172a))',
            }}
          >
            {title}
          </h2>

          <p
            className="pw-motion-enter"
            style={{
              ['--pw-motion-enter-delay' as string]: '160ms',
              margin: 0,
              fontFamily: 'var(--pw-content-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
              fontSize: 'var(--pw-content-font-size, var(--pw-font-size-body, 1rem))',
              fontWeight: 'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
              lineHeight: 'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))' as unknown as number,
              color: 'var(--pw-content-fg, var(--pw-color-on-surface, #0f172a))',
            }}
          >
            {body}
          </p>
        </div>
      </div>

      <div
        className="pw-motion-enter"
        style={{
          ['--pw-motion-enter-delay' as string]: '240ms',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--pw-answer-gap, 0.75rem)',
          padding: 'var(--pw-control-padding, 1rem)',
          background: 'var(--pw-color-success-surface, #ecfdf5)',
          borderRadius: 'var(--pw-radius, 12px)',
          border: '1px solid var(--pw-color-border, #e2e8f0)',
        }}
      >
        <span
          aria-hidden
          className="pw-motion-pop"
          style={{
            flexShrink: 0,
            marginTop: 2,
            width: 20,
            height: 20,
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--pw-color-success, #16a34a)',
            color: 'var(--pw-color-on-success, #ffffff)',
            fontSize: 12,
            fontWeight: 700,
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
            fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
            lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
            color: 'var(--pw-label-sublabel-fg, var(--pw-color-muted, #64748b))',
          }}
        >
          {reassurance}
        </p>
      </div>
    </div>
  );
}