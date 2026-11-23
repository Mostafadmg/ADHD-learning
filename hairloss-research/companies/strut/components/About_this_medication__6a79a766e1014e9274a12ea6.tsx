import React from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'About Low-Dose Naltrexone (LDN)',
  },
  body: {
    type: 'string',
    title: 'Body',
    defaultValue:
      'Low-Dose Naltrexone (LDN) is a compounded medication prescribed off-label for chronic inflammatory, autoimmune, and chronic-pain conditions. Off-label means the FDA has not evaluated naltrexone at these low doses for these uses. A licensed physician will review your answers and decide whether LDN is appropriate for you.',
  },
};

const TRUST_CHIPS = [
  'Off-label transparency',
  'Physician review',
  'Compounded medication',
] as const;

export default function LdnWelcome({
  title = 'About Low-Dose Naltrexone (LDN)',
  body = 'Low-Dose Naltrexone (LDN) is a compounded medication prescribed off-label for chronic inflammatory, autoimmune, and chronic-pain conditions. Off-label means the FDA has not evaluated naltrexone at these low doses for these uses. A licensed physician will review your answers and decide whether LDN is appropriate for you.',
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 36rem)',
        margin: '0 auto',
        fontFamily: 'var(--pw-font-family-body, \'Source Sans 3\', \'Source Sans Pro\', system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #2A3330)',
      }}
    >
      <article
        className="pw-motion-enter"
        style={{
          ['--pw-motion-enter-delay' as string]: '0ms',
          background: 'var(--pw-color-surface, #F1EDE4)',
          border: '1px solid var(--pw-color-border, #D9D2C3)',
          borderRadius: 'var(--pw-radius, 0.25rem)',
          boxShadow: 'var(--pw-shadow, 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04))',
          padding: 'var(--pw-section-gap, 1.5rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-section-gap, 1.5rem)',
        }}
      >
        <header
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 0.75rem)',
          }}
        >
          <p
            className="pw-motion-enter"
            style={{
              ['--pw-motion-enter-delay' as string]: '40ms',
              margin: 0,
              fontFamily: 'var(--pw-font-family-body, \'Source Sans 3\', \'Source Sans Pro\', system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-caption, 0.9375rem)',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase' as const,
              color: 'var(--pw-color-brand, #3D6F7C)',
              lineHeight: 1.4,
            }}
          >
            Before you begin
          </p>

          <h1
            className="pw-motion-enter"
            style={{
              ['--pw-motion-enter-delay' as string]: '100ms',
              margin: 0,
              fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, Lora, Georgia, \'Times New Roman\', serif))',
              fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.75rem))',
              fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 600))' as unknown as number,
              lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.25))' as unknown as number,
              letterSpacing: 'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
              color: 'var(--pw-label-fg, var(--pw-color-on-surface, #2A3330))',
            }}
          >
            {title}
          </h1>
        </header>

        <p
          className="pw-motion-enter"
          style={{
            ['--pw-motion-enter-delay' as string]: '200ms',
            margin: 0,
            fontFamily: 'var(--pw-content-font-family, var(--pw-font-family-body, \'Source Sans 3\', \'Source Sans Pro\', system-ui, sans-serif))',
            fontSize: 'var(--pw-content-font-size, var(--pw-font-size-body, 1.125rem))',
            fontWeight: 'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
            lineHeight: 'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.6))' as unknown as number,
            color: 'var(--pw-content-fg, var(--pw-color-on-surface, #2A3330))',
          }}
        >
          {body}
        </p>

        <ul
          aria-label="What to expect"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--pw-element-gap, 0.75rem)',
          }}
        >
          {TRUST_CHIPS.map((label, index) => (
            <li
              key={label}
              className="pw-motion-enter"
              style={{
                ['--pw-motion-enter-delay' as string]: `${300 + index * 80}ms`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                minHeight: 44,
                padding: '0.5rem 0.875rem',
                background: 'var(--pw-color-info-surface, #D4E2E6)',
                color: 'var(--pw-color-on-surface, #2A3330)',
                border: '1px solid var(--pw-color-border, #D9D2C3)',
                borderRadius: 'var(--pw-radius, 0.25rem)',
                fontFamily: 'var(--pw-font-family-body, \'Source Sans 3\', \'Source Sans Pro\', system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-caption, 0.9375rem)',
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: 'var(--pw-color-brand, #3D6F7C)',
                }}
              />
              {label}
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}