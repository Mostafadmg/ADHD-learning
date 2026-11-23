import React, { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    pathwai?: {
      flow?: {
        getAnswers?: () => Record<string, unknown>;
      };
    };
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isDeclinedSignal(value: unknown): boolean {
  if (value == null || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;

  if (obj.status === 'declined') return true;

  if (obj.paymentFailed === true || obj.paymentFailed === 'true') return true;

  if (isNonEmptyString(obj.paymentError)) return true;

  for (const nested of Object.values(obj)) {
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      const child = nested as Record<string, unknown>;
      if (child.status === 'declined') return true;
      if (child.paymentFailed === true || child.paymentFailed === 'true') return true;
      if (isNonEmptyString(child.paymentError)) return true;
    }
  }

  return false;
}

function detectPaymentDeclined(answers: Record<string, unknown> | null | undefined): boolean {
  if (!answers || typeof answers !== 'object') return false;

  const finalize = answers['node-strut-finalize-1'];
  if (isDeclinedSignal(finalize)) return true;

  for (const value of Object.values(answers)) {
    if (isDeclinedSignal(value)) return true;
  }

  return false;
}

export const propSchema = {};

export default function PaymentDeclineBanner() {
  const [declined, setDeclined] = useState(false);

  const refresh = useCallback(() => {
    try {
      const answers = window.pathwai?.flow?.getAnswers?.() ?? {};
      setDeclined(detectPaymentDeclined(answers));
    } catch {
      setDeclined(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const interval = window.setInterval(refresh, 1000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  if (!declined) return null;

  return (
    <div
      role="alert"
      className="pw-motion-enter"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: 'var(--pw-control-padding, 1rem)',
        borderRadius: 'var(--pw-radius, 0.5rem)',
        background: 'var(--pw-color-error-surface, #fef2f2)',
        border: '1px solid var(--pw-color-error, #ef4444)',
        borderLeft: '4px solid var(--pw-color-error, #ef4444)',
        boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        marginBottom: 'var(--pw-element-gap, 1.25rem)',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: 999,
          background: 'var(--pw-color-error, #ef4444)',
          color: 'var(--pw-color-on-error, #ffffff)',
          marginTop: 1,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 600,
            lineHeight: 1.35,
            color: 'var(--pw-color-on-error, #991b1b)',
            marginBottom: 2,
          }}
        >
          Your card was declined
        </div>
        <div
          style={{
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 'var(--pw-font-weight-body, 400)',
            lineHeight: 1.45,
            color: 'var(--pw-color-on-error, #991b1b)',
            opacity: 0.9,
          }}
        >
          Please re-enter your card details below to continue.
        </div>
      </div>
    </div>
  );
}