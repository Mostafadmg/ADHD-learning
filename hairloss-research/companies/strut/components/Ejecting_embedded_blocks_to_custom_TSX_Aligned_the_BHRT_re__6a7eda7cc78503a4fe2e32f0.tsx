import React, { useState, useEffect, useCallback } from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'Ready to start your Strut BHRT journey',
  },
  continueLabel: {
    type: 'string',
    title: 'Continue label',
    defaultValue: 'Continue',
  },
};

export default function StrutBhrtWelcome({
  title = 'Ready to start your Strut BHRT journey',
  continueLabel = 'Continue',
}: {
  title?: string;
  continueLabel?: string;
}) {
  const [progress, setProgress] = useState(() => {
    try {
      return window.pathwai?.flow?.getProgress?.() ?? null;
    } catch {
      return null;
    }
  });

  const refreshProgress = useCallback(() => {
    try {
      const next = window.pathwai?.flow?.getProgress?.() ?? null;
      setProgress(next);
    } catch {
      /* preview / no flow */
    }
  }, []);

  useEffect(() => {
    refreshProgress();

    const onFocus = () => refreshProgress();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refreshProgress();
    };
    const onCart = () => refreshProgress();
    const onFlow = () => refreshProgress();
    const onPop = () => refreshProgress();

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pathwai:cart:updated', onCart as EventListener);
    window.addEventListener('pathwai:flow:updated', onFlow as EventListener);
    window.addEventListener('popstate', onPop);

    const id = window.setInterval(refreshProgress, 500);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pathwai:cart:updated', onCart as EventListener);
      window.removeEventListener('pathwai:flow:updated', onFlow as EventListener);
      window.removeEventListener('popstate', onPop);
      window.clearInterval(id);
    };
  }, [refreshProgress]);

  const percent = Math.round(progress?.percent ?? 0);
  const isFirstStep = progress?.isFirstStep ?? true;

  const handleBack = () => {
    window.pathwai?.flow?.back?.();
  };

  const handleContinue = () => {
    window.pathwai?.flow?.next?.();
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 617,
        margin: '0 auto',
        padding: '0 20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
      }}
    >
      {/* Progress header */}
      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginBottom: 'var(--pw-element-gap, 1.25rem)',
          ['--pw-motion-enter-delay' as string]: '0ms',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            minHeight: 44,
          }}
        >
          <div
            style={{
              flex: '1 1 0',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            {!isFirstStep && (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                style={{
                  width: 44,
                  height: 44,
                  minWidth: 44,
                  minHeight: 44,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  borderRadius: 'var(--pw-radius, 0.5rem)',
                  color: 'var(--pw-color-on-surface, #1C1C21)',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M15 18l-6-6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>

          <div
            style={{
              flex: '0 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/logo-1777588358394-7a97a2dd424217ff.svg"
              alt="Strut"
              height={28}
              style={{
                height: 28,
                width: 'auto',
                display: 'block',
              }}
            />
          </div>

          <div
            style={{
              flex: '1 1 0',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                fontWeight: 500,
                color: 'var(--pw-color-muted, #71717a)',
                lineHeight: 1,
                tabularNums: 'tabular-nums' as unknown as undefined,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {percent}%
            </span>
          </div>
        </div>

        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progress"
          style={{
            width: '100%',
            height: 5,
            borderRadius: 999,
            background: 'var(--pw-progress-track, #EFEFEC)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.max(0, percent))}%`,
              height: '100%',
              borderRadius: 999,
              background: 'var(--pw-progress-fill, #161336)',
              transition: `width var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
            }}
          />
        </div>
      </div>

      {/* Badge */}
      <div
        className="pw-motion-enter"
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          padding: '6px 12px',
          borderRadius: 999,
          background: '#c4697c',
          color: '#ffffff',
          fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
          fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
          fontWeight: 600,
          letterSpacing: '0.01em',
          lineHeight: 1.2,
          marginBottom: 'var(--pw-element-gap, 1.25rem)',
          ['--pw-motion-enter-delay' as string]: '80ms',
        }}
      >
        Medical questionnaire
      </div>

      {/* Title */}
      <h1
        className="pw-motion-enter"
        style={{
          margin: 0,
          marginBottom: 'var(--pw-element-gap, 1.25rem)',
          fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
          fontSize: 'var(--pw-font-size-title, 1.75rem)',
          fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
          lineHeight: 'var(--pw-font-line-height-title, 1.2)' as unknown as number,
          letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
          color: 'var(--pw-label-fg, #002021)',
          textAlign: 'left',
          ['--pw-motion-enter-delay' as string]: '120ms',
        }}
      >
        {title}
      </h1>

      {/* Secure card */}
      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          gap: 'var(--pw-answer-gap, 0.75rem)',
          alignItems: 'flex-start',
          padding: 'var(--pw-control-padding, 1rem)',
          borderRadius: 'var(--pw-radius, 0.5rem)',
          border: '1.5px solid var(--pw-color-border, #EFEFEC)',
          background: 'var(--pw-color-surface, #ffffff)',
          boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
          marginBottom: 'var(--pw-section-gap, 1.5rem)',
          textAlign: 'left',
          ['--pw-motion-enter-delay' as string]: '180ms',
        }}
      >
        <div
          aria-hidden
          style={{
            flexShrink: 0,
            width: 40,
            height: 40,
            borderRadius: 'var(--pw-radius, 0.5rem)',
            background: 'var(--pw-answer-media-bg, #F1F0E8)',
            color: 'var(--pw-answer-media-fg, #161336)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3l7 3v5c0 4.5-2.8 7.8-7 9-4.2-1.2-7-4.5-7-9V6l7-3z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 12.2l1.8 1.8 3.4-3.6"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 600,
              color: 'var(--pw-color-on-surface, #1C1C21)',
              marginBottom: 4,
              lineHeight: 1.35,
            }}
          >
            This is a secure form
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
              color: 'var(--pw-label-sublabel-fg, #545454)',
              lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
            }}
          >
            Your answers are encrypted and reviewed only by licensed clinicians on your care team.
          </p>
        </div>
      </div>

      {/* Continue */}
      <button
        type="button"
        className="pw-motion-enter"
        onClick={handleContinue}
        style={{
          width: '100%',
          minHeight: 48,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
          border: 'none',
          borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
          background: 'var(--pw-button-bg, #161336)',
          color: 'var(--pw-button-fg, #ffffff)',
          fontFamily: 'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
          fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
          fontWeight: 600,
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          transition: `opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), transform var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
          ['--pw-motion-enter-delay' as string]: '240ms',
        }}
      >
        {continueLabel}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}