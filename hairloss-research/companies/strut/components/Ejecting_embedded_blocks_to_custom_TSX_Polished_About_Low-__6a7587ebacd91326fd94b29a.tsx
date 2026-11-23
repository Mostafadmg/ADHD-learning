import React, { useEffect } from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'About Low-Dose Naltrexone',
  },
  lead: {
    type: 'string',
    title: 'Lead paragraph',
    defaultValue:
      'Low-dose naltrexone (LDN) is a compounded medication that licensed clinicians may prescribe off-label for certain chronic inflammatory, autoimmune, and chronic-pain conditions. This short overview explains what that means before you continue.',
  },
};

export const outputSchema = {
  acknowledged: {
    type: 'boolean',
    title: 'Acknowledged',
    description: 'true when the patient has viewed this intro and may continue',
    required: true,
  },
};

export default function AboutLowDoseNaltrexone({
  title = 'About Low-Dose Naltrexone',
  lead = 'Low-dose naltrexone (LDN) is a compounded medication that licensed clinicians may prescribe off-label for certain chronic inflammatory, autoimmune, and chronic-pain conditions. This short overview explains what that means before you continue.',
  onChange,
}: {
  title?: string;
  lead?: string;
  onChange?: (outputs: { acknowledged: boolean }) => void;
}) {
  useEffect(() => {
    onChange?.({ acknowledged: true });
  }, [onChange]);

  const cards = [
    {
      key: 'off-label',
      eyebrow: 'Off-label',
      heading: 'What “off-label” means',
      body: 'The FDA has not evaluated naltrexone at these low doses for inflammatory, autoimmune, or chronic-pain uses. Off-label prescribing is a common, lawful practice when a licensed clinician judges a medication appropriate for your situation.',
    },
    {
      key: 'compounded',
      eyebrow: 'Compounded',
      heading: 'Made for low-dose use',
      body: 'LDN is prepared by a compounding pharmacy at doses far below standard naltrexone. Strength and form are tailored so the prescription matches what your clinician intends.',
    },
    {
      key: 'physician',
      eyebrow: 'Physician review',
      heading: 'A clinician decides',
      body: 'Your answers are reviewed by a licensed physician who determines whether LDN is appropriate for you. Completing this flow is not a guarantee of a prescription.',
    },
  ];

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
      <header
        className="pw-motion-enter"
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 0.75rem)',
            '--pw-motion-enter-delay': '0ms',
          } as React.CSSProperties
        }
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--pw-color-brand, #0F766E)',
          }}
        >
          Before you begin
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, DM Sans, system-ui, sans-serif))',
            fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.375rem))',
            fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 600))' as unknown as number,
            lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.25))',
            letterSpacing: 'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
            color: 'var(--pw-label-fg, var(--pw-color-on-surface, #1E293B))',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-content-font-family, var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif))',
            fontSize: 'var(--pw-content-font-size, var(--pw-font-size-body, 1.0625rem))',
            fontWeight: 'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
            lineHeight: 'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))',
            color: 'var(--pw-content-fg, var(--pw-color-on-surface, #1E293B))',
          }}
        >
          {lead}
        </p>
      </header>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
        }}
      >
        {cards.map((card, index) => (
          <article
            key={card.key}
            className="pw-motion-enter"
            style={
              {
                '--pw-motion-enter-delay': `${(index + 1) * 100}ms`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                padding: 'var(--pw-control-padding, 1rem)',
                background: 'var(--pw-color-surface, #FFFFFF)',
                border: '1.5px solid var(--pw-color-border, #CBD5E1)',
                borderRadius: 'var(--pw-radius, 0.5rem)',
                boxShadow: 'var(--pw-shadow, 0 1px 2px rgba(30,41,59,0.06), 0 4px 12px rgba(30,41,59,0.06))',
                borderLeft: '4px solid var(--pw-color-brand, #0F766E)',
                boxSizing: 'border-box',
              } as React.CSSProperties
            }
          >
            <span
              style={{
                fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--pw-color-brand, #0F766E)',
              }}
            >
              {card.eyebrow}
            </span>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--pw-font-family-title, DM Sans, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-body, 1.0625rem)',
                fontWeight: 'var(--pw-font-weight-title, 600)' as unknown as number,
                lineHeight: 'var(--pw-font-line-height-title, 1.25)',
                color: 'var(--pw-color-on-surface, #1E293B)',
              }}
            >
              {card.heading}
            </h2>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-body, 1.0625rem)',
                fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
                lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                color: 'var(--pw-color-muted, #475569)',
              }}
            >
              {card.body}
            </p>
          </article>
        ))}
      </div>

      <aside
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '400ms',
            display: 'flex',
            gap: 'var(--pw-element-gap, 0.75rem)',
            alignItems: 'flex-start',
            padding: 'var(--pw-control-padding, 1rem)',
            background: 'var(--pw-answer-surface-selected, #CCE8E4)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            border: '1px solid var(--pw-color-border, #CBD5E1)',
            boxSizing: 'border-box',
          } as React.CSSProperties
        }
        aria-label="Acknowledgment"
      >
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--pw-color-brand, #0F766E)',
            color: 'var(--pw-color-brand-contrast, #FFFFFF)',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginTop: '0.1rem',
          }}
        >
          ✓
        </span>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
            lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            color: 'var(--pw-color-on-surface, #1E293B)',
          }}
        >
          By continuing, you acknowledge that you have read this overview of low-dose naltrexone,
          including that it is compounded and prescribed off-label, and that a licensed physician
          will review your answers before deciding if LDN is appropriate.
        </p>
      </aside>
    </div>
  );
}