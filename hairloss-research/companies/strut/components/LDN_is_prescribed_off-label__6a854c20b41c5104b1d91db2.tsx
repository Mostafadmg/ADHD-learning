import React from 'react';

export const propSchema = {
  eyebrow: {
    type: 'string',
    title: 'Eyebrow',
    defaultValue: 'Please read before you continue',
  },
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'LDN is prescribed off-label',
  },
  card1Heading: {
    type: 'string',
    title: 'Card 1 heading',
    defaultValue: 'What LDN is',
  },
  card1Body: {
    type: 'string',
    title: 'Card 1 body',
    defaultValue:
      'Low-Dose Naltrexone (LDN) is a compounded medication used for chronic inflammatory, autoimmune, and chronic-pain conditions.',
  },
  card2Heading: {
    type: 'string',
    title: 'Card 2 heading',
    defaultValue: 'What “off-label” means',
  },
  card2Body: {
    type: 'string',
    title: 'Card 2 body',
    defaultValue:
      'Off-label means the FDA has not evaluated naltrexone at these low doses for these uses.',
  },
  card3Heading: {
    type: 'string',
    title: 'Card 3 heading',
    defaultValue: 'What happens next',
  },
  card3Body: {
    type: 'string',
    title: 'Card 3 body',
    defaultValue:
      'A licensed physician will review your answers and decide whether LDN is appropriate for you.',
  },
  footer: {
    type: 'string',
    title: 'Footer',
    defaultValue: 'By continuing, you acknowledge you have read this.',
  },
};

export default function LdnOffLabelDisclosure({
  eyebrow = 'Please read before you continue',
  title = 'LDN is prescribed off-label',
  card1Heading = 'What LDN is',
  card1Body = 'Low-Dose Naltrexone (LDN) is a compounded medication used for chronic inflammatory, autoimmune, and chronic-pain conditions.',
  card2Heading = 'What “off-label” means',
  card2Body = 'Off-label means the FDA has not evaluated naltrexone at these low doses for these uses.',
  card3Heading = 'What happens next',
  card3Body = 'A licensed physician will review your answers and decide whether LDN is appropriate for you.',
  footer = 'By continuing, you acknowledge you have read this.',
}: {
  eyebrow?: string;
  title?: string;
  card1Heading?: string;
  card1Body?: string;
  card2Heading?: string;
  card2Body?: string;
  card3Heading?: string;
  card3Body?: string;
  footer?: string;
}) {
  const cards = [
    { heading: card1Heading, body: card1Body },
    { heading: card2Heading, body: card2Body },
    { heading: card3Heading, body: card3Body },
  ];

  return (
    <section
      aria-labelledby="ldn-offlabel-title"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
        gap: 'var(--pw-block-gap, 2.25rem)',
      }}
    >
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 'var(--pw-space-base, 1.5rem)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxWidth: '36rem',
          }}
        >
          <p
            className="pw-motion-enter"
            style={{
              ['--pw-motion-enter-delay' as string]: '0ms',
              margin: 0,
              fontFamily: 'var(--pw-label-sublabel-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
              fontSize: '0.875rem',
              fontWeight: 500,
              lineHeight: 1.4,
              letterSpacing: '0.04em',
              color: 'var(--pw-color-muted, #71717a)',
            }}
          >
            {eyebrow}
          </p>
          <h1
            id="ldn-offlabel-title"
            className="pw-motion-enter"
            style={{
              ['--pw-motion-enter-delay' as string]: '60ms',
              margin: 0,
              fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, Figtree, system-ui, sans-serif))',
              fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.75rem))',
              fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 500))' as unknown as number,
              lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.2))',
              letterSpacing: 'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
              color: 'var(--pw-label-fg, #002021)',
            }}
          >
            {title}
          </h1>
        </div>
        <div
          className="pw-motion-enter"
          aria-hidden="true"
          style={{
            ['--pw-motion-enter-delay' as string]: '100ms',
            width: '2rem',
            height: '2px',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            background: 'var(--pw-color-brand, #161336)',
          }}
        />
      </header>

      <ol
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 1.25rem)',
        }}
      >
        {cards.map((card, index) => {
          const n = String(index + 1).padStart(2, '0');
          return (
            <li
              key={n}
              className="pw-motion-enter"
              style={{
                ['--pw-motion-enter-delay' as string]: `${160 + index * 100}ms`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--pw-space-base, 1.5rem)',
                padding: 'var(--pw-space-base, 1.5rem)',
                background: 'var(--pw-answer-surface-selected, #F1F0E8)',
                border: '1px solid var(--pw-color-border, #EFEFEC)',
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
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  lineHeight: 1.3,
                  letterSpacing: '0.04em',
                  fontVariantNumeric: 'tabular-nums',
                  color: 'var(--pw-color-brand, #161336)',
                }}
              >
                {n}
              </span>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.375rem',
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
                    fontSize: 'var(--pw-font-size-body, 1rem)',
                    fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
                    lineHeight: 1.35,
                    color: 'var(--pw-color-on-surface, #1C1C21)',
                  }}
                >
                  {card.heading}
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                    fontSize: 'var(--pw-font-size-body, 1rem)',
                    fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
                    lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                    letterSpacing: 'var(--pw-font-letter-spacing-body, 0)',
                    color: 'var(--pw-label-sublabel-fg, #545454)',
                  }}
                >
                  {card.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <p
        className="pw-motion-enter"
        style={{
          ['--pw-motion-enter-delay' as string]: '480ms',
          margin: 0,
          fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
          fontSize: '0.875rem',
          fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
          lineHeight: 1.5,
          color: 'var(--pw-color-muted, #71717a)',
        }}
      >
        {footer}
      </p>
    </section>
  );
}