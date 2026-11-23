import React from 'react';

export default function NavigationButtonsBlock() {
  const onGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = 'https://struthealth.com/';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        marginTop: 'var(--pw-block-gap, 2.25rem)',
      }}
    >
      <button
        type="button"
        onClick={onGoHome}
        style={{
          width: '100%',
          minHeight: 44,
          padding: 'var(--pw-navigation-button-padding, 0.75rem) var(--pw-control-padding, 1rem)',
          fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
          fontWeight: 'var(--pw-navigation-button-font-weight, 600)' as unknown as number,
          fontFamily: 'var(--pw-navigation-button-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
          color: 'var(--pw-button-fg, #ffffff)',
          background: 'var(--pw-button-bg, #161336)',
          border: 'none',
          borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
          cursor: 'pointer',
          transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
          outline: 'none',
          boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, #8399BF)`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))';
        }}
      >
        Go to Home
      </button>
    </div>
  );
}