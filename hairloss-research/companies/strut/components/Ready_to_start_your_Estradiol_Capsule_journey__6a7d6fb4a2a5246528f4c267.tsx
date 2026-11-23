import React, { useState } from 'react';

export const propSchema = {
  headline: {
    type: 'string',
    title: 'Headline',
    defaultValue: 'Ready to start your Estradiol Capsule journey',
  },
  sublabel: {
    type: 'string',
    title: 'Sublabel',
    defaultValue: 'Compounded oral bioidentical estradiol · clinician-reviewed intake',
  },
  ctaLabel: {
    type: 'string',
    title: 'CTA label',
    defaultValue: 'Get started',
  },
};

export default function EstradiolCapsuleWelcome({
  headline = 'Ready to start your Estradiol Capsule journey',
  sublabel = 'Compounded oral bioidentical estradiol · clinician-reviewed intake',
  ctaLabel = 'Get started',
}: {
  headline?: string;
  sublabel?: string;
  ctaLabel?: string;
}) {
  const [pressed, setPressed] = useState(false);

  const benefits = [
    'Personalized dosing',
    'US-licensed physicians',
    'Free discreet shipping',
  ];

  const trustItems = [
    { label: 'HIPAA Compliant', icon: 'shield' as const },
    { label: 'SSL Secure', icon: 'lock' as const },
    { label: 'LegitScript Certified', icon: 'check' as const },
  ];

  const handleStart = () => {
    setPressed(true);
    window.pathwai?.flow?.next('continue');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.75rem)',
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 617px)',
        margin: '0 auto',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
        boxSizing: 'border-box',
      }}
    >
      {/* Eyebrow */}
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '0ms',
            display: 'flex',
            justifyContent: 'flex-start',
          } as React.CSSProperties
        }
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '999px',
            background: 'var(--pw-color-brand, #161336)',
            color: 'var(--pw-color-brand-contrast, #ffffff)',
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
            fontWeight: 600,
            letterSpacing: '0.02em',
            lineHeight: 1.3,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: '999px',
              background: 'var(--pw-color-brand-contrast, #ffffff)',
              opacity: 0.9,
              flexShrink: 0,
            }}
          />
          Medical questionnaire
        </span>
      </div>

      {/* Heading block */}
      <header
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '80ms',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 1.25rem)',
          } as React.CSSProperties
        }
      >
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-title, 1.75rem)',
            fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
            lineHeight: 'var(--pw-font-line-height-title, 1.2)' as unknown as number,
            letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
            color: 'var(--pw-label-fg, #002021)',
          }}
        >
          {headline}
        </h1>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-label-sublabel-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-label-sublabel-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 'var(--pw-label-sublabel-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
            lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
            color: 'var(--pw-label-sublabel-fg, #545454)',
          }}
        >
          {sublabel}
        </p>
      </header>

      {/* Soft product card */}
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '160ms',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--pw-element-gap, 1.25rem)',
            padding: 'var(--pw-control-padding, 1rem)',
            background: 'var(--pw-answer-surface-selected, #F1F0E8)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
          } as React.CSSProperties
        }
      >
        {/* Capsule motif */}
        <div
          aria-hidden
          style={{
            width: 56,
            height: 56,
            flexShrink: 0,
            borderRadius: 'var(--pw-radius, 0.5rem)',
            background: 'var(--pw-color-surface, #ffffff)',
            border: '1px solid var(--pw-answer-border, #E0E0E0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 36,
              height: 16,
              borderRadius: 999,
              overflow: 'hidden',
              display: 'flex',
              border: '1.5px solid var(--pw-color-brand, #161336)',
            }}
          >
            <div
              style={{
                width: '50%',
                background: 'var(--pw-color-brand, #161336)',
              }}
            />
            <div
              style={{
                width: '50%',
                background: 'var(--pw-color-surface, #ffffff)',
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: 0 }}>
          <span
            style={{
              fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 600,
              color: 'var(--pw-color-on-surface, #1C1C21)',
              lineHeight: 1.35,
            }}
          >
            Compounded Estradiol Oral Capsule
          </span>
          <span
            style={{
              fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
              color: 'var(--pw-color-muted, #71717a)',
              lineHeight: 1.4,
            }}
          >
            Bioidentical · taken by mouth · dosed for you
          </span>
        </div>
      </div>

      {/* Benefits */}
      <ul
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '240ms',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          } as React.CSSProperties
        }
      >
        {benefits.map((text) => (
          <li
            key={text}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              minHeight: 28,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 22,
                height: 22,
                borderRadius: '999px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--pw-color-brand, #161336)',
                color: 'var(--pw-color-brand-contrast, #ffffff)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path
                  d="M2.5 6.2L4.8 8.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span
              style={{
                fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-body, 1rem)',
                fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
                color: 'var(--pw-color-on-surface, #1C1C21)',
                lineHeight: 1.4,
              }}
            >
              {text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '320ms',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            paddingTop: '0.25rem',
          } as React.CSSProperties
        }
      >
        <button
          type="button"
          onClick={handleStart}
          disabled={pressed}
          aria-label={ctaLabel}
          style={{
            width: '100%',
            minHeight: 48,
            padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
            border: 'none',
            borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
            background: 'var(--pw-button-bg, #161336)',
            color: 'var(--pw-button-fg, #ffffff)',
            fontFamily: 'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 600,
            cursor: pressed ? 'default' : 'pointer',
            opacity: pressed
              ? ('var(--pw-state-disabled-opacity, 0.45)' as unknown as number)
              : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            WebkitTapHighlightColor: 'transparent',
          }}
          onMouseDown={(e) => {
            if (!pressed) e.currentTarget.style.background = 'var(--pw-color-brand, #161336)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid var(--pw-state-focus-ring, #8399BF)';
            e.currentTarget.style.outlineOffset = '3px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          {pressed ? (
            <>
              <span
                className="pw-motion-spin"
                aria-hidden
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  border: '2px solid currentColor',
                  borderRightColor: 'transparent',
                  display: 'inline-block',
                }}
              />
              Starting…
            </>
          ) : (
            ctaLabel
          )}
        </button>
      </div>

      {/* Trust row */}
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '400ms',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem 1rem',
            paddingTop: '0.15rem',
          } as React.CSSProperties
        }
        role="list"
        aria-label="Trust and security"
      >
        {trustItems.map((item) => (
          <div
            key={item.label}
            role="listitem"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--pw-color-muted, #71717a)',
              fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
              lineHeight: 1.3,
              fontWeight: 500,
            }}
          >
            <TrustIcon type={item.icon} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '480ms',
            margin: 0,
            paddingTop: '0.15rem',
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
            lineHeight: 1.5,
            color: 'var(--pw-color-muted, #71717a)',
            textAlign: 'center',
          } as React.CSSProperties
        }
      >
        Compounded medications are prepared for you by a licensed US pharmacy and are not
        FDA-approved.
      </p>
    </div>
  );
}

function TrustIcon({ type }: { type: 'shield' | 'lock' | 'check' }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: '0 0 14 14',
    fill: 'none',
    'aria-hidden': true as const,
    style: { flexShrink: 0 },
  };

  if (type === 'shield') {
    return (
      <svg {...common}>
        <path
          d="M7 1.5L2.5 3.5V6.5C2.5 9.4 4.5 11.9 7 12.5C9.5 11.9 11.5 9.4 11.5 6.5V3.5L7 1.5Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === 'lock') {
    return (
      <svg {...common}>
        <rect
          x="3"
          y="6.25"
          width="8"
          height="5.75"
          rx="1.25"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M4.75 6.25V4.5a2.25 2.25 0 0 1 4.5 0v1.75"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M4.4 7.1L6.15 8.8L9.6 5.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}