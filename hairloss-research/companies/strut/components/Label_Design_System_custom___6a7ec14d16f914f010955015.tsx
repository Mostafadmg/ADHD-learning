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
        gap: sublabel ? '0.375rem' : 0,
        marginBottom: 'var(--pw-element-gap, 1.25rem)',
      }}
    >
      {label ? (
        <div
          style={{
            color: 'var(--pw-header-fg, #1C1C21)',
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-title, 1.75rem)',
            fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
            lineHeight: 'var(--pw-font-line-height-title, 1.2)' as unknown as number,
            letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
          }}
        >
          {label}
        </div>
      ) : null}
      {sublabel ? (
        <div
          style={{
            color: 'var(--pw-label-sublabel-fg, #545454)',
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
            lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
          }}
        >
          {sublabel}
        </div>
      ) : null}
    </div>
  );
}