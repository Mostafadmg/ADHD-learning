import React from 'react';

/* ============================================================
   Strut Login & Navigation Block
   ------------------------------------------------------------
   A hardcoded component featuring a primary navigation button
   and a secondary "Log in" link.

   - The primary button advances with { action: 'continue' }.
     IMPORTANT: must pass an explicit answer so a previously
     persisted { action: 'login' } (from tapping Log in, then
     being bounced back after eligibility) is overwritten.
     A bare next() reuses the old answer and re-enters the
     login loop.
   - The "Log in" link advances with { action: 'login' } for routing.
   - The button wears the EXACT global design-system navigation
     recipe (DSButton slot="navigation" variant="primary" + the
     DSNavigation row), so it is indistinguishable from the
     standard navigation block on every other step.
   ============================================================ */

export default function StrutLoginLink() {
  const handleLogin = () => {
    window.pathwai?.flow?.next({ action: 'login' });
  };

  const handleContinue = () => {
    // Explicit answer overwrites any prior { action: 'login' } on this step.
    window.pathwai?.flow?.next({ action: 'continue' });
  };

  return (
    <div
      className="pw-motion-enter"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--pw-element-gap, 12px)',
        width: '100%',
        marginTop: 'var(--pw-element-gap, 12px)',
        marginBottom: '32px',
        fontFamily: "var(--pw-font-family-body, 'Inter', system-ui, sans-serif)",
      }}
    >
      {/* Login Link Section */}
      <div style={{
        textAlign: 'center',
        fontSize: '14px',
        color: '#6B7670',
        lineHeight: 1.5,
      }}>
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={handleLogin}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            margin: 0,
            cursor: 'pointer',
            font: 'inherit',
            color: '#161336',
            fontWeight: 500,
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            textDecorationThickness: '1px',
          }}
        >
          Log in
        </button>
      </div>

      {/* Primary Navigation Button — global navigation row + button recipe */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'var(--pw-navigation-alignment, flex-start)',
          gap: 'var(--pw-element-gap, 12px)',
          width: '100%',
        }}
      >
        <button
          type="button"
          onClick={handleContinue}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            width: 'var(--pw-navigation-button-width, 100%)',
            maxWidth: '100%',
            background: 'var(--pw-button-bg, #161336)',
            color: 'var(--pw-button-fg, #ffffff)',
            border: 'none',
            padding:
              'calc(var(--pw-navigation-button-padding, var(--pw-control-padding, var(--pw-space-base, 1rem))) * 0.7) calc(var(--pw-navigation-button-padding, var(--pw-control-padding, var(--pw-space-base, 1rem))) * 1.2)',
            borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
            fontFamily: 'var(--pw-navigation-button-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
            fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 'var(--pw-navigation-button-font-weight, var(--pw-font-weight-body, 400))',
            boxShadow: 'var(--pw-shadow, 0 1px 2px rgba(0,0,0,0.05))',
            cursor: 'pointer',
            transform: 'none',
            filter: 'none',
            transition:
              'transform var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease), filter var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.filter = 'brightness(0.96)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.filter = 'none';
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
