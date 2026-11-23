import React from 'react';

export const propSchema = {
  label: { type: 'string', title: 'Title', defaultValue: "What's your phone number?" },
  sublabel: { type: 'string', title: 'Subtitle', defaultValue: '' },
};

export default function LabelBlock({
  label = "What's your phone number?",
  sublabel = '',
}: {
  label?: string;
  sublabel?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: sublabel ? '0.375rem' : 0,
        width: '100%',
        textAlign: 'left',
      }}
    >
      {label ? (
        <h2
          className="pw-motion-enter"
          style={{
            margin: 0,
            color: 'var(--pw-label-fg, #002021)',
            fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, Figtree, system-ui, sans-serif))',
            fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.75rem))',
            fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 500))' as unknown as number,
            lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.2))',
            letterSpacing: 'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
          }}
        >
          {label}
        </h2>
      ) : null}
      {sublabel ? (
        <p
          className="pw-motion-enter"
          style={{
            margin: 0,
            color: 'var(--pw-label-sublabel-fg, #545454)',
            fontFamily: 'var(--pw-label-sublabel-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-label-sublabel-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 'var(--pw-label-sublabel-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
            lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            '--pw-motion-enter-delay': '80ms',
          } as React.CSSProperties}
        >
          {sublabel}
        </p>
      ) : null}
    </div>
  );
}