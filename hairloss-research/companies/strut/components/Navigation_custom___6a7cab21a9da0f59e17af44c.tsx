import React from 'react';

export default function NavigationButtonsBlock() {
  const flow = typeof window !== 'undefined' ? window.pathwai?.flow : undefined;
  const isFirstStep = flow?.getProgress?.()?.isFirstStep ?? flow?.isFirstStep?.() ?? true;

  const onBack = () => flow?.back();
  const onGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = 'https://struthealth.com/';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginTop: 'var(--pw-block-gap, 2.25rem)',
      }}
    >
      {!isFirstStep ? (
        <button
          type="button"
          onClick={onBack}
          style={{
            minHeight: 44,
            padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
            fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
            fontFamily: 'var(--pw-navigation-button-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
            fontWeight: 'var(--pw-navigation-button-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
            color: 'var(--pw-color-on-surface, #1C1C21)',
            background: 'transparent',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
            borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
            cursor: 'pointer',
            transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--pw-state-hover, #F1F0E8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid var(--pw-state-focus-ring, #8399BF)';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          Back
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onGoHome}
        style={{
          minHeight: 44,
          padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.5rem',
          fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
          fontWeight: 600,
          fontFamily: 'var(--pw-navigation-button-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
          color: 'var(--pw-button-fg, #ffffff)',
          background: 'var(--pw-button-bg, var(--pw-color-brand, #161336))',
          border: 'none',
          borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
          cursor: 'pointer',
          transition: `opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), transform var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.92';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = '2px solid var(--pw-state-focus-ring, #8399BF)';
          e.currentTarget.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
        }}
      >
        Go to Home
      </button>
    </div>
  );
}