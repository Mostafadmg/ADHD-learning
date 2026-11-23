import React from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'About This Medication',
  },
  bodyText: {
    type: 'string',
    title: 'Body Text',
    defaultValue: 'Metformin is FDA-approved for the treatment of type 2 diabetes. Some adults ask about it off-label for healthy aging and general metabolic health, which the FDA has not evaluated or approved. A U.S. licensed physician will review your answers and decide whether off-label metformin is appropriate for you. Metformin is not right for everyone, and kidney health is an important part of that decision.',
  },
  buttonText: {
    type: 'string',
    title: 'Button Text',
    defaultValue: 'Continue',
  },
};

export default function MetforminInfoCard({
  title = 'About This Medication',
  bodyText = 'Metformin is FDA-approved for the treatment of type 2 diabetes. Some adults ask about it off-label for healthy aging and general metabolic health, which the FDA has not evaluated or approved. A U.S. licensed physician will review your answers and decide whether off-label metformin is appropriate for you. Metformin is not right for everyone, and kidney health is an important part of that decision.',
  buttonText = 'Continue',
}: {
  title?: string;
  bodyText?: string;
  buttonText?: string;
}) {
  const handleContinue = () => {
    // Pattern B: Self-navigating step. Pass a scalar value that becomes the step's recorded answer.
    window.pathwai?.flow?.next('continue');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 640px)',
        margin: '0 auto',
      }}
    >
      <div
        className="pw-motion-enter"
        style={{
          '--pw-motion-enter-delay': '0ms',
          background: 'var(--pw-color-surface, #ffffff)',
          border: '1px solid var(--pw-color-border, #cbd5e1)',
          borderRadius: 'var(--pw-radius, 12px)',
          padding: 'var(--pw-section-gap, 1.5rem)',
          boxShadow: 'var(--pw-shadow, 0 4px 12px rgba(30,41,59,0.06))',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 1rem)',
          width: '100%',
        } as React.CSSProperties}
      >
        <div
          className="pw-motion-enter"
          style={{
            '--pw-motion-enter-delay': '100ms',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          } as React.CSSProperties}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '999px',
              background: 'var(--pw-state-hover, #E7F5F3)',
              color: 'var(--pw-color-brand, #0F766E)',
              flexShrink: 0,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--pw-label-font-family, inherit)',
              fontSize: 'var(--pw-label-font-size, 1.25rem)',
              fontWeight: 'var(--pw-label-font-weight, 600)',
              lineHeight: 'var(--pw-label-line-height, 1.25)',
              letterSpacing: 'var(--pw-label-letter-spacing, -0.01em)',
              color: 'var(--pw-label-fg, #1E293B)',
            }}
          >
            {title}
          </h2>
        </div>

        <p
          className="pw-motion-enter"
          style={{
            '--pw-motion-enter-delay': '200ms',
            margin: 0,
            fontFamily: 'var(--pw-content-font-family, inherit)',
            fontSize: 'var(--pw-content-font-size, 1.0625rem)',
            fontWeight: 'var(--pw-content-font-weight, 400)',
            lineHeight: 'var(--pw-content-line-height, 1.55)',
            color: 'var(--pw-content-fg, #1E293B)',
            whiteSpace: 'pre-wrap',
          } as React.CSSProperties}
        >
          {bodyText}
        </p>

        <div
          className="pw-motion-enter"
          style={{
            '--pw-motion-enter-delay': '300ms',
            display: 'flex',
            justifyContent: 'var(--pw-navigation-alignment, flex-start)',
            marginTop: 'var(--pw-element-gap, 0.75rem)',
          } as React.CSSProperties}
        >
          <button
            type="button"
            onClick={handleContinue}
            style={{
              background: 'var(--pw-button-bg, #0F766E)',
              color: 'var(--pw-button-fg, #FFFFFF)',
              border: 'none',
              borderRadius: 'var(--pw-navigation-button-radius, 8px)',
              padding: 'var(--pw-navigation-button-padding, 1rem 1.5rem)',
              fontFamily: 'var(--pw-navigation-button-font-family, inherit)',
              fontSize: 'var(--pw-navigation-button-font-size, 1.0625rem)',
              fontWeight: 'var(--pw-navigation-button-font-weight, 600)',
              width: 'var(--pw-navigation-button-width, auto)',
              minWidth: '120px',
              cursor: 'pointer',
              transition: 'all var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(1px)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}