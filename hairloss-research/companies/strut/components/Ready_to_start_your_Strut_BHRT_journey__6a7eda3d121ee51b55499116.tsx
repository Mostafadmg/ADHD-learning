import React, { useState, useEffect, useCallback } from 'react';

export const propSchema = {
  cardBg: {
    type: 'color',
    title: 'Secure card background',
    defaultValue: '#FFFFFF',
  },
};

type ProgressInfo = {
  stepNumber: number;
  totalSteps: number;
  stepsRemaining: number;
  percent: number;
  isFirstStep: boolean;
  isLastStep: boolean;
};

function readProgress(): ProgressInfo {
  const p = window.pathwai?.flow?.getProgress?.();
  return {
    stepNumber: p?.stepNumber ?? 1,
    totalSteps: p?.totalSteps ?? 1,
    stepsRemaining: p?.stepsRemaining ?? 0,
    percent: typeof p?.percent === 'number' ? p.percent : 0,
    isFirstStep: p?.isFirstStep ?? true,
    isLastStep: p?.isLastStep ?? false,
  };
}

function LockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="5"
        y="10"
        width="14"
        height="11"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="15.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 6L9 12l6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BhrtIntroScreen({
  cardBg = '#FFFFFF',
}: {
  cardBg?: string;
}) {
  const [progress, setProgress] = useState<ProgressInfo>(() => readProgress());

  const refreshProgress = useCallback(() => {
    setProgress(readProgress());
  }, []);

  useEffect(() => {
    refreshProgress();

    const onFocus = () => refreshProgress();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refreshProgress();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    const events = [
      'pathwai:flow:step',
      'pathwai:flow:change',
      'pathwai:flow:updated',
      'pathwai:navigation',
    ];
    events.forEach((evt) => window.addEventListener(evt, onFocus));

    const interval = window.setInterval(refreshProgress, 500);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      events.forEach((evt) => window.removeEventListener(evt, onFocus));
      window.clearInterval(interval);
    };
  }, [refreshProgress]);

  const handleBack = () => {
    window.pathwai?.flow?.back?.();
  };

  const handleContinue = () => {
    window.pathwai?.flow?.next?.();
  };

  const percentLabel = `${Math.round(Math.min(100, Math.max(0, progress.percent)))}%`;
  const showBack = !progress.isFirstStep;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '617px',
        margin: '0 auto',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
      }}
    >
      {/* Progress header */}
      <header
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '0ms',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
          } as React.CSSProperties
        }
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            minHeight: 'var(--pw-header-height, 2.5rem)',
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
            {showBack ? (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                style={{
                  width: '44px',
                  height: '44px',
                  margin: 0,
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--pw-header-fg, #1C1C21)',
                  cursor: 'pointer',
                  borderRadius: 'var(--pw-radius, 0.5rem)',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <ChevronLeftIcon />
              </button>
            ) : (
              <span style={{ width: '44px', height: '44px' }} aria-hidden="true" />
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
              alt="Strut Health"
              height={28}
              style={{
                height: '28px',
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
                minWidth: '44px',
                textAlign: 'right',
              }}
            >
              {percentLabel}
            </span>
          </div>
        </div>

        <div
          role="progressbar"
          aria-valuenow={Math.round(progress.percent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Questionnaire progress"
          style={{
            width: '100%',
            height: '4px',
            borderRadius: '999px',
            background: 'var(--pw-progress-track, #EFEFEC)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.max(0, progress.percent))}%`,
              height: '100%',
              borderRadius: '999px',
              background: 'var(--pw-progress-fill, #161336)',
              transition: `width var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
            }}
          />
        </div>
      </header>

      {/* Body */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '20px',
          marginTop: '28px',
          width: '100%',
        }}
      >
        <span
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '80ms',
              alignSelf: 'flex-start',
              display: 'inline-block',
              background: '#c4697c',
              color: '#ffffff',
              fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: 1.3,
              padding: '4px 8px',
              borderRadius: '4px',
              letterSpacing: '0.01em',
            } as React.CSSProperties
          }
        >
          Medical questionnaire
        </span>

        <h1
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '160ms',
              margin: 0,
              width: '100%',
              textAlign: 'left',
              fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-title, 1.75rem)',
              fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
              lineHeight: 'var(--pw-font-line-height-title, 1.2)',
              letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
              color: 'var(--pw-label-fg, #002021)',
            } as React.CSSProperties
          }
        >
          Ready to start your Strut BHRT journey
        </h1>

        <div
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '240ms',
              width: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 'var(--pw-element-gap, 1.25rem)',
              padding: 'var(--pw-control-padding, 1rem)',
              background: cardBg || 'var(--pw-color-surface, #ffffff)',
              border: '1px solid var(--pw-color-border, #EFEFEC)',
              borderRadius: 'var(--pw-radius, 0.5rem)',
              boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            } as React.CSSProperties
          }
        >
          <div
            style={{
              flex: '0 0 auto',
              width: '40px',
              height: '40px',
              borderRadius: 'var(--pw-radius, 0.5rem)',
              background: 'var(--pw-answer-media-bg, #F1F0E8)',
              color: 'var(--pw-answer-media-fg, #161336)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-hidden="true"
          >
            <LockIcon />
          </div>

          <div
            style={{
              flex: '1 1 auto',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-body, 1rem)',
                fontWeight: 600,
                lineHeight: 'var(--pw-font-line-height-body, 1.45)',
                color: 'var(--pw-color-on-surface, #1C1C21)',
              }}
            >
              This is a secure form
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-body, 1rem)',
                fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
                lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                color: 'var(--pw-label-sublabel-fg, #545454)',
              }}
            >
              Your answers are encrypted and reviewed only by licensed clinicians.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="pw-motion-enter"
          onClick={handleContinue}
          style={
            {
              '--pw-motion-enter-delay': '320ms',
              width: '100%',
              boxSizing: 'border-box',
              marginTop: '8px',
              minHeight: '48px',
              padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
              border: 'none',
              borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
              background: 'var(--pw-button-bg, #161336)',
              color: 'var(--pw-button-fg, #ffffff)',
              fontFamily:
                'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
              fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
              fontWeight:
                'var(--pw-navigation-button-font-weight, 600)' as unknown as number,
              lineHeight: 1.3,
              cursor: 'pointer',
              textAlign: 'center',
              WebkitTapHighlightColor: 'transparent',
              transition: `opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), transform var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
            } as React.CSSProperties
          }
        >
          Continue
        </button>
      </div>
    </div>
  );
}