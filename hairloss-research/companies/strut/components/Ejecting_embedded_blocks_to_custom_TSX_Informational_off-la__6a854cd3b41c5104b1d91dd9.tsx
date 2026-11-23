import React, { useEffect } from 'react';

export const outputSchema = {
  acknowledged: {
    type: 'boolean',
    title: 'Acknowledged',
    description: 'true — the person has been shown the off-label information',
    required: true,
  },
};

const CARDS = [
  {
    n: '01',
    title: 'What LDN is',
    body: 'Low-Dose Naltrexone (LDN) is a compounded medication prescribed off-label for chronic inflammatory, autoimmune, and chronic-pain conditions.',
  },
  {
    n: '02',
    title: 'What “off-label” means',
    body: 'Off-label means the FDA has not evaluated naltrexone at these low doses for these uses.',
  },
  {
    n: '03',
    title: 'What happens next',
    body: 'A licensed physician will review your answers and decide whether LDN is appropriate for you.',
  },
];

export default function OffLabelExplainer({
  onAnswer,
  onChange,
}: {
  onAnswer?: (outputs: { acknowledged: boolean }) => void;
  onChange?: (outputs: { acknowledged: boolean }) => void;
}) {
  useEffect(() => {
    const outputs = { acknowledged: true };
    onAnswer?.(outputs);
    onChange?.(outputs);
  }, [onAnswer, onChange]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-element-gap, 1.25rem)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 1.25rem)',
        }}
      >
        {CARDS.map((card, index) => (
          <article
            key={card.n}
            className="pw-motion-enter"
            style={{
              ['--pw-motion-enter-delay' as string]: `${index * 100}ms`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--pw-space-base, 1.5rem)',
              padding: 'var(--pw-control-padding, 1rem)',
              background: 'var(--pw-color-surface, #ffffff)',
              border: '1px solid var(--pw-color-border, #EFEFEC)',
              borderLeft: '3px solid var(--pw-color-brand, #161336)',
              borderRadius: 'var(--pw-radius, 0.5rem)',
              boxSizing: 'border-box',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                flexShrink: 0,
                minWidth: '1.75rem',
                paddingTop: '0.15rem',
                fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
                fontWeight: 'var(--pw-font-weight-title, 500)',
                letterSpacing: '0.08em',
                lineHeight: 1,
                color: 'var(--pw-color-muted, #71717a)',
              }}
            >
              {card.n}
            </span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                minWidth: 0,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, Figtree, system-ui, sans-serif))',
                  fontSize: 'var(--pw-font-size-body, 1rem)',
                  fontWeight: 'var(--pw-font-weight-title, 500)',
                  lineHeight: 'var(--pw-font-line-height-title, 1.2)',
                  letterSpacing: 'var(--pw-label-letter-spacing, -0.01em)',
                  color: 'var(--pw-label-fg, #002021)',
                }}
              >
                {card.title}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-body, 1rem)',
                  fontWeight: 'var(--pw-font-weight-body, 400)',
                  lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                  color: 'var(--pw-label-sublabel-fg, #545454)',
                }}
              >
                {card.body}
              </p>
            </div>
          </article>
        ))}
      </div>

      <p
        className="pw-motion-enter"
        style={{
          ['--pw-motion-enter-delay' as string]: '300ms',
          margin: 0,
          paddingTop: 'var(--pw-space-base, 1.5rem)',
          fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
          fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
          fontWeight: 'var(--pw-font-weight-body, 400)',
          lineHeight: 'var(--pw-font-line-height-body, 1.55)',
          color: 'var(--pw-color-muted, #71717a)',
        }}
      >
        By continuing, you acknowledge you have read this.
      </p>
    </div>
  );
}