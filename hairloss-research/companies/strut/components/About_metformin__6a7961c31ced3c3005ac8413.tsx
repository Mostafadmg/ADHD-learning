import React, { useEffect } from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'About metformin',
  },
  lead: {
    type: 'string',
    title: 'Lead',
    defaultValue:
      'Metformin is FDA-approved for type 2 diabetes. Some adults ask about it off-label for healthy aging and metabolic health, which the FDA has not evaluated or approved. A U.S. licensed physician will review answers and decide whether off-label metformin is appropriate. Kidney health is an important part of that decision.',
  },
};

export const outputSchema = {
  acknowledged: {
    type: 'boolean',
    title: 'Acknowledged',
    description: 'true when the person has viewed this intro and can continue',
    required: true,
  },
};

type Callout = {
  id: string;
  label: string;
  body: string;
  icon: 'info' | 'kidney' | 'physician';
};

const CALLOUTS: Callout[] = [
  {
    id: 'off-label',
    label: 'Off-label',
    body: 'Not FDA-approved for aging or longevity. Off-label means use outside the labeled indication, under a physician’s care.',
    icon: 'info',
  },
  {
    id: 'kidney',
    label: 'Kidney health matters',
    body: 'Metformin is cleared by the kidneys. We’ll ask about kidney health so your clinician can judge safety.',
    icon: 'kidney',
  },
  {
    id: 'physician',
    label: 'Physician decides',
    body: 'A U.S. licensed physician reviews your answers and decides whether off-label metformin is appropriate for you.',
    icon: 'physician',
  },
];

function CalloutIcon({ type }: { type: Callout['icon'] }) {
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

  if (type === 'kidney') {
    return (
      <svg {...common}>
        <path d="M12 21c-2.5-1.2-6-4.2-6-8.2C6 8.5 8.2 6 11 6c.7 0 1.4.2 2 .5" />
        <path d="M12 21c2.5-1.2 6-4.2 6-8.2C18 8.5 15.8 6 13 6c-.7 0-1.4.2-2 .5" />
        <path d="M12 10v5" />
        <path d="M10.5 12.5h3" />
      </svg>
    );
  }

  if (type === 'physician') {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.25" />
        <path d="M6.5 19.5v-.75C6.5 15.9 9 14 12 14s5.5 1.9 5.5 4.75v.75" />
        <path d="M19 8v4" />
        <path d="M17 10h4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.5V16" />
      <circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function MetforminOffLabelIntro({
  title = 'About metformin',
  lead = 'Metformin is FDA-approved for type 2 diabetes. Some adults ask about it off-label for healthy aging and metabolic health, which the FDA has not evaluated or approved. A U.S. licensed physician will review answers and decide whether off-label metformin is appropriate. Kidney health is an important part of that decision.',
  onChange,
}: {
  title?: string;
  lead?: string;
  onChange?: (outputs: { acknowledged: boolean }) => void;
}) {
  useEffect(() => {
    onChange?.({ acknowledged: true });
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
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--pw-color-brand, #0F766E)',
          }}
        >
          Before you continue
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--pw-label-font-family, DM Sans, system-ui, sans-serif)',
            fontSize: 'var(--pw-label-font-size, 1.375rem)',
            fontWeight: 'var(--pw-label-font-weight, 600)' as unknown as number,
            lineHeight: 'var(--pw-label-line-height, 1.25)',
            letterSpacing: 'var(--pw-label-letter-spacing, -0.01em)',
            color: 'var(--pw-label-fg, #1E293B)',
          }}
        >
          {title}
        </h1>
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
          {lead}
        </p>
      </header>

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
        }}
      >
        {CALLOUTS.map((item, index) => (
          <li
            key={item.id}
            className="pw-motion-enter"
            style={
              {
                '--pw-motion-enter-delay': `${(index + 1) * 100}ms`,
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
            <span
              aria-hidden
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: 'var(--pw-radius, 0.5rem)',
                background: 'var(--pw-state-hover, #E7F5F3)',
                color: 'var(--pw-color-brand, #0F766E)',
              }}
            >
              <CalloutIcon type={item.icon} />
            </span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                minWidth: 0,
                paddingTop: 2,
              }}
            >
              <strong
                style={{
                  fontFamily: 'var(--pw-font-family-title, DM Sans, system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-body, 1.0625rem)',
                  fontWeight: 600,
                  lineHeight: 1.35,
                  color: 'var(--pw-color-on-surface, #1E293B)',
                }}
              >
                {item.label}
              </strong>
              <span
                style={{
                  fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                  fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
                  lineHeight: 1.5,
                  color: 'var(--pw-color-muted, #475569)',
                }}
              >
                {item.body}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '400ms',
            margin: 0,
            padding: '0.875rem var(--pw-control-padding, 1rem)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            background: 'var(--pw-state-hover, #E7F5F3)',
            border: '1px solid var(--pw-color-border, #CBD5E1)',
            fontFamily: 'var(--pw-font-family-body, Source Sans 3, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 500,
            lineHeight: 1.5,
            color: 'var(--pw-color-muted, #475569)',
            boxSizing: 'border-box',
          } as React.CSSProperties
        }
      >
        By continuing, you acknowledge this context about off-label metformin and that a physician
        will make the final decision.
      </p>
    </div>
  );
}