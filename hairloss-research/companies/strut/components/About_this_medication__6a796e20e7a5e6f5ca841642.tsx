import React from 'react';

export const propSchema = {
  eyebrow: {
    type: 'string',
    title: 'Eyebrow',
    defaultValue: 'Low-Dose Naltrexone (LDN)',
  },
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'About this medication',
  },
};

const TRUST_CHIPS = [
  'Physician reviewed',
  'Off-label disclosed',
  'About 5–8 minutes',
] as const;

export default function LdnAboutMedicationIntro({
  eyebrow = 'Low-Dose Naltrexone (LDN)',
  title = 'About this medication',
}: {
  eyebrow?: string;
  title?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
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
          style={
            {
              '--pw-motion-enter-delay': '0ms',
              margin: 0,
              fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              fontWeight: 600,
              lineHeight: 1.4,
              letterSpacing: '0.04em',
              textTransform: 'uppercase' as const,
              color: 'var(--pw-color-brand, #0F766E)',
            } as React.CSSProperties
          }
        >
          {eyebrow}
        </p>

        <h1
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '80ms',
              margin: 0,
              fontFamily: 'var(--pw-label-font-family, DM Sans, system-ui, sans-serif)',
              fontSize: 'var(--pw-label-font-size, 1.375rem)',
              fontWeight: 'var(--pw-label-font-weight, 600)' as unknown as number,
              lineHeight: 'var(--pw-label-line-height, 1.25)',
              letterSpacing: 'var(--pw-label-letter-spacing, -0.01em)',
              color: 'var(--pw-label-fg, #1E293B)',
            } as React.CSSProperties
          }
        >
          {title}
        </h1>
      </header>

      <section
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '160ms',
            background: 'var(--pw-color-surface, #FFFFFF)',
            border: '1px solid var(--pw-color-border, #CBD5E1)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            boxShadow: 'var(--pw-shadow, 0 1px 2px rgba(30,41,59,0.06), 0 4px 12px rgba(30,41,59,0.06))',
            padding: 'var(--pw-control-padding, 1rem)',
          } as React.CSSProperties
        }
        aria-label="About low-dose naltrexone"
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-content-font-family, Source Sans 3, system-ui, sans-serif)',
            fontSize: 'var(--pw-content-font-size, 1.0625rem)',
            fontWeight: 'var(--pw-content-font-weight, 400)' as unknown as number,
            lineHeight: 'var(--pw-content-line-height, 1.55)',
            color: 'var(--pw-content-fg, #1E293B)',
          }}
        >
          Low-Dose Naltrexone (LDN) is a compounded medication prescribed off-label for
          chronic inflammatory, autoimmune, and chronic-pain conditions. Off-label means
          the FDA has not evaluated naltrexone at these low doses for these uses.
        </p>
      </section>

      <aside
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '240ms',
            display: 'flex',
            gap: 'var(--pw-element-gap, 0.75rem)',
            alignItems: 'flex-start',
            padding: 'var(--pw-control-padding, 1rem)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            background: 'var(--pw-color-background, #F7F5F1)',
            border: '1px solid var(--pw-color-border, #CBD5E1)',
          } as React.CSSProperties
        }
        aria-label="Clinical review notice"
      >
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 2,
            background: 'var(--pw-state-hover, #E7F5F3)',
            color: 'var(--pw-color-brand, #0F766E)',
            fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          ✓
        </span>
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
          A licensed physician will review your answers and decide whether LDN is
          appropriate for you.
        </p>
      </aside>

      <ul
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '320ms',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--pw-element-gap, 0.75rem)',
          } as React.CSSProperties
        }
        aria-label="What to expect"
      >
        {TRUST_CHIPS.map((label) => (
          <li
            key={label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              minHeight: 36,
              padding: '0.4rem 0.75rem',
              borderRadius: '999px',
              background: 'var(--pw-color-surface, #FFFFFF)',
              border: '1px solid var(--pw-color-border, #CBD5E1)',
              color: 'var(--pw-color-muted, #475569)',
              fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              fontWeight: 500,
              lineHeight: 1.3,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: '999px',
                background: 'var(--pw-color-brand, #0F766E)',
                flexShrink: 0,
              }}
            />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}