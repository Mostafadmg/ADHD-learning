import React, { useState, useEffect, useCallback } from 'react';

export const propSchema = {
  logoUrl: {
    type: 'image',
    title: 'Logo',
    defaultValue:
      'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/logo-1777588358394-7a97a2dd424217ff.svg',
  },
  logoHeight: {
    type: 'number',
    title: 'Logo height',
    defaultValue: 28,
    min: 12,
    max: 80,
    step: 1,
  },
  showArrow: {
    type: 'boolean',
    title: 'Show back arrow',
    defaultValue: true,
  },
  showPercent: {
    type: 'boolean',
    title: 'Show percent',
    defaultValue: true,
  },
  showRemaining: {
    type: 'boolean',
    title: 'Show remaining steps',
    defaultValue: false,
  },
  remainingText: {
    type: 'string',
    title: 'Remaining label',
    defaultValue: 'steps left',
  },
  fillColor: {
    type: 'color',
    title: 'Bar fill',
    defaultValue: 'var(--pw-progress-fill, #161336)',
  },
  trackColor: {
    type: 'color',
    title: 'Bar track',
    defaultValue: 'var(--pw-progress-track, #EFEFEC)',
  },
  arrowColor: {
    type: 'color',
    title: 'Arrow color',
    defaultValue: 'var(--pw-header-fg, #1C1C21)',
  },
  percentColor: {
    type: 'color',
    title: 'Percent color',
    defaultValue: 'var(--pw-color-muted, #71717a)',
  },
  barHeight: {
    type: 'number',
    title: 'Bar height',
    defaultValue: 4,
    min: 2,
    max: 16,
    step: 1,
  },
  barRadius: {
    type: 'number',
    title: 'Bar radius',
    defaultValue: 999,
    min: 0,
    max: 999,
    step: 1,
  },
  gap: {
    type: 'number',
    title: 'Gap below header row',
    defaultValue: 12,
    min: 0,
    max: 48,
    step: 1,
  },
  maxWidth: {
    type: 'number',
    title: 'Max width (0 = match step column)',
    defaultValue: 0,
    min: 0,
    max: 1200,
    step: 1,
  },
  sidePadding: {
    type: 'number',
    title: 'Extra side padding (step shell already gutters)',
    defaultValue: 0,
    min: 0,
    max: 48,
    step: 1,
  },
  sideRailWidth: {
    type: 'number',
    title: 'Back / percent column width',
    defaultValue: 56,
    min: 44,
    max: 72,
    step: 1,
  },
  fallbackPercent: {
    type: 'number',
    title: 'Fallback percent',
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
  },
};

type ProgressSnapshot = {
  stepNumber: number;
  totalSteps: number;
  stepsRemaining: number;
  percent: number;
  isFirstStep: boolean;
  isLastStep: boolean;
};

const ATTR_COOKIE = 'strut_attr';
const ATTR_SENT_KEY = 'Strut.OrderAttributionSent';
const ATTR_ORDER_KEY = 'Strut.AttributionOrderId';
const ATTR_QUERY_KEYS = ['gclid', 'msclkid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const ATTR_FORM_FIELDS: { [key: string]: string } = {
  gclid: 'Gclid',
  msclkid: 'Msclkid',
  gbraid: 'Gbraid',
  wbraid: 'Wbraid',
  utm_source: 'UtmSource',
  utm_medium: 'UtmMedium',
  utm_campaign: 'UtmCampaign',
  utm_term: 'UtmTerm',
  utm_content: 'UtmContent',
};
const STATUS_RETRY_MS = 1500;
const STATUS_MAX_ATTEMPTS = 5;

type ClickAttribution = { [key: string]: string | undefined };

function attrCookieDomain(): string {
  const host = window.location.hostname;
  if (host === 'struthealth.com' || host.slice(-'.struthealth.com'.length) === '.struthealth.com') {
    return '.struthealth.com';
  }
  if (host === 'strut-test.com' || host.slice(-'.strut-test.com'.length) === '.strut-test.com') {
    return '.strut-test.com';
  }
  return '';
}

function readAttrCookie(): ClickAttribution | null {
  try {
    const prefix = ATTR_COOKIE + '=';
    const parts = document.cookie ? document.cookie.split(';') : [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].replace(/^\s+/, '');
      if (part.indexOf(prefix) === 0) {
        const parsed = JSON.parse(decodeURIComponent(part.substring(prefix.length)));
        return parsed && typeof parsed === 'object' ? parsed : null;
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** First page that still has a click id or UTM wins. Later cards do not overwrite the cookie. */
function captureClickAttribution(): void {
  try {
    if (readAttrCookie()) return;
    const params = new URLSearchParams(window.location.search);
    const data: ClickAttribution = {};
    let any = false;
    ATTR_QUERY_KEYS.forEach((key) => {
      const value = params.get(key);
      const field = ATTR_FORM_FIELDS[key];
      if (value && field) {
        data[field] = value.trim().substring(0, 255);
        any = true;
      }
    });
    if (!any) return;
    data.LandingPageUrl = window.location.href.substring(0, 1500);
    if (document.referrer) data.Referrer = document.referrer.substring(0, 1500);
    const domain = attrCookieDomain();
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    const domainPart = domain ? '; domain=' + domain : '';
    document.cookie = ATTR_COOKIE + '=' + encodeURIComponent(JSON.stringify(data))
      + '; path=/' + domainPart + '; SameSite=Lax' + secure;
    console.log('[strut] click attribution captured', data);
  } catch {
    /* ignore */
  }
}

function readSentOrderIds(): string[] {
  try {
    const raw = window.localStorage.getItem(ATTR_SENT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function markAttributionSent(orderId: string) {
  try {
    const list = readSentOrderIds();
    if (list.indexOf(orderId) === -1) list.push(orderId);
    window.localStorage.setItem(ATTR_SENT_KEY, JSON.stringify(list.slice(-20)));
  } catch {
    /* ignore */
  }
}

function strutApiBase(): string {
  const api = (window as any).strut?.ENV?.api;
  return typeof api === 'string' ? api.replace(/\/$/, '') : '';
}

function rememberLiveOrderId(): string {
  const live = (window as any).strut?.getOrderId?.();
  if (live == null || live === '') return '';
  const orderKey = String(live);
  try { window.sessionStorage.setItem(ATTR_ORDER_KEY, orderKey); } catch { /* ignore */ }
  return orderKey;
}

/**
 * FinishOrder deletes the visiting order from localStorage before the thank-you card.
 * Use the id we saw while it was still there, and only after this page has finished checkout.
 */
function orderIdToSave(): string {
  const live = rememberLiveOrderId();
  if (live) return live;
  if ((window as any).__STRUT_CHECKOUT_COMPLETE__ !== true) return '';
  try { return window.sessionStorage.getItem(ATTR_ORDER_KEY) || ''; } catch { return ''; }
}

async function waitUntilOrderPlaced(orderId: string, token: string): Promise<boolean> {
  const base = strutApiBase();
  if (!base) return false;
  for (let attempt = 1; attempt <= STATUS_MAX_ATTEMPTS; attempt++) {
    const res = await fetch(`${base}/checkout/GetStatusOrder?orderId=${encodeURIComponent(orderId)}`, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    }).catch(() => null);
    const status = res && res.ok ? await res.json().catch(() => null) : null;
    if (!status || status.isFaled || status.isCompletedButNullResult) return false;
    if (!status.isProcessing) {
      return Array.isArray(status.resultGoogle) && status.resultGoogle.length > 0;
    }
    if (attempt < STATUS_MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, STATUS_RETRY_MS));
    }
  }
  return false;
}

let attributionSaveInFlight = false;

/** Runs on every card. Posts only after FinishOrder has really completed, and only once per order. */
async function saveClickAttributionIfPlaced(): Promise<void> {
  if (attributionSaveInFlight) return;
  const attr = readAttrCookie();
  if (!attr) return;
  const strut = (window as any).strut;
  const orderKey = orderIdToSave();
  if (!orderKey) return;
  if (readSentOrderIds().indexOf(orderKey) !== -1) return;
  const token = strut?.getToken?.();
  const base = strutApiBase();
  if (!token || !base) return;

  attributionSaveInFlight = true;
  try {
    const placed = await waitUntilOrderPlaced(orderKey, token);
    if (!placed) return;
    if (readSentOrderIds().indexOf(orderKey) !== -1) return;
    const res = await fetch(`${base}/checkout/OrderAttribution`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        OrderId: Number(orderKey),
        Gclid: attr.Gclid || null,
        Msclkid: attr.Msclkid || null,
        Gbraid: attr.Gbraid || null,
        Wbraid: attr.Wbraid || null,
        UtmSource: attr.UtmSource || null,
        UtmMedium: attr.UtmMedium || null,
        UtmCampaign: attr.UtmCampaign || null,
        UtmTerm: attr.UtmTerm || null,
        UtmContent: attr.UtmContent || null,
        LandingPageUrl: attr.LandingPageUrl || null,
        Referrer: attr.Referrer || null,
      }),
    });
    if (!res.ok) {
      console.log('[strut] click attribution save failed', res.status);
      return;
    }
    markAttributionSent(orderKey);
    console.log('[strut] click attribution saved', orderKey);
  } catch (err) {
    console.log('[strut] click attribution save error', err);
  } finally {
    attributionSaveInFlight = false;
  }
}

function readProgress(fallbackPercent: number): ProgressSnapshot {
  const raw = typeof window === 'undefined' ? undefined : window.pathwai?.flow?.getProgress?.();
  if (!raw || typeof raw !== 'object') {
    return {
      stepNumber: 1,
      totalSteps: 1,
      stepsRemaining: 0,
      percent: Math.min(100, Math.max(0, fallbackPercent)),
      isFirstStep: true,
      isLastStep: true,
    };
  }

  const percent =
    typeof raw.percent === 'number' && !Number.isNaN(raw.percent)
      ? Math.min(100, Math.max(0, raw.percent))
      : Math.min(100, Math.max(0, fallbackPercent));

  return {
    stepNumber: typeof raw.stepNumber === 'number' ? raw.stepNumber : 1,
    totalSteps: typeof raw.totalSteps === 'number' ? raw.totalSteps : 1,
    stepsRemaining:
      typeof raw.stepsRemaining === 'number' ? raw.stepsRemaining : 0,
    percent,
    isFirstStep: Boolean(raw.isFirstStep),
    isLastStep: Boolean(raw.isLastStep),
  };
}

export default function FlowProgressHeader({
  logoUrl = 'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/logo-1777588358394-7a97a2dd424217ff.svg',
  logoHeight = 28,
  showArrow = true,
  showPercent = true,
  showRemaining = false,
  remainingText = 'steps left',
  fillColor = 'var(--pw-progress-fill, #161336)',
  trackColor = 'var(--pw-progress-track, #EFEFEC)',
  arrowColor = 'var(--pw-header-fg, #1C1C21)',
  percentColor = 'var(--pw-color-muted, #71717a)',
  barHeight = 4,
  barRadius = 999,
  gap = 12,
  maxWidth = 0,
  sidePadding = 0,
  sideRailWidth = 56,
  fallbackPercent = 0,
}: {
  logoUrl?: string;
  logoHeight?: number;
  showArrow?: boolean;
  showPercent?: boolean;
  showRemaining?: boolean;
  remainingText?: string;
  fillColor?: string;
  trackColor?: string;
  arrowColor?: string;
  percentColor?: string;
  barHeight?: number;
  barRadius?: number;
  gap?: number;
  maxWidth?: number;
  sidePadding?: number;
  sideRailWidth?: number;
  fallbackPercent?: number;
}) {
  const [progress, setProgress] = useState<ProgressSnapshot>(() =>
    readProgress(fallbackPercent)
  );

  const refresh = useCallback(() => {
    setProgress(readProgress(fallbackPercent));
  }, [fallbackPercent]);

  useEffect(() => {
    refresh();

    const onFocus = () => refresh();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pathwai:cart:updated', refresh as EventListener);
    window.addEventListener('pathwai:flow:updated', refresh as EventListener);
    window.addEventListener('popstate', refresh);

    const intervalId = window.setInterval(refresh, 500);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pathwai:cart:updated', refresh as EventListener);
      window.removeEventListener('pathwai:flow:updated', refresh as EventListener);
      window.removeEventListener('popstate', refresh);
      window.clearInterval(intervalId);
    };
  }, [refresh]);

  useEffect(() => {
    captureClickAttribution();
    let cancelled = false;
    const persist = () => {
      if (!cancelled) void saveClickAttributionIfPlaced();
    };
    persist();
    window.addEventListener('pathwai:flow:updated', persist);
    return () => {
      cancelled = true;
      window.removeEventListener('pathwai:flow:updated', persist);
    };
  }, []);

  const handleBack = () => {
    window.pathwai?.flow?.back?.();
  };

  const showBackButton = showArrow && !progress.isFirstStep;
  const percentLabel = `${Math.round(progress.percent)}%`;
  const remainingLabel = `${progress.stepsRemaining} ${remainingText}`.trim();
  const rail = Math.max(44, sideRailWidth);
  const constrainHeaderWidth = Boolean(maxWidth && maxWidth > 0);
  /** Step blocks stack is flex; shrink-wrapped headers leave a short progress track. */
  const shellLayout: React.CSSProperties = {
    width: '100%',
    maxWidth: constrainHeaderWidth ? maxWidth : '100%',
    minWidth: 0,
    alignSelf: 'stretch',
    boxSizing: 'border-box',
    marginLeft: constrainHeaderWidth ? 'auto' : 0,
    marginRight: constrainHeaderWidth ? 'auto' : 0,
  };

  return (
    <div
      className="pw-flow-progress-header-root"
      style={{
        ...shellLayout,
        display: 'block',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        background: 'var(--pw-header-bg, #ffffff)',
      }}
    >
      <header
        className="pw-motion-enter"
        style={{
          ...shellLayout,
          paddingLeft: sidePadding,
          paddingRight: sidePadding,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `${rail}px 1fr ${rail}px`,
            alignItems: 'center',
            minHeight: 'var(--pw-header-height, 2.5rem)',
            width: '100%',
          }}
        >
          {/* Left — back (fixed rail keeps logo centered over step text) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: rail,
              minHeight: 44,
            }}
          >
            {showBackButton ? (
              <button
                type="button"
                aria-label="Go back"
                onClick={handleBack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  margin: 0,
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: arrowColor,
                  borderRadius: 'var(--pw-radius, 0.5rem)',
                  flexShrink: 0,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = `2px solid var(--pw-state-focus-ring, #8399BF)`;
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12.5 4.5L7 10l5.5 5.5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ) : null}
          </div>

          {/* Center — logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Strut"
                style={{
                  height: logoHeight,
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            ) : null}
          </div>

          {/* Right — percent */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: rail,
              minHeight: 44,
            }}
          >
            {showPercent ? (
              <span
                aria-live="polite"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  minHeight: 44,
                  fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                  fontWeight: 600,
                  color: percentColor,
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                }}
              >
                {percentLabel}
              </span>
            ) : null}
          </div>
        </div>

        {/* Progress track */}
        <div
          role="progressbar"
          aria-valuenow={Math.round(progress.percent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Flow progress"
          style={{
            width: '100%',
            maxWidth: '100%',
            alignSelf: 'stretch',
            flexShrink: 0,
            height: barHeight,
            borderRadius: barRadius,
            background: trackColor,
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: `${progress.percent}%`,
              height: '100%',
              borderRadius: barRadius,
              background: fillColor,
              transition: `width var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
            }}
          />
        </div>

        {showRemaining ? (
          <p
            aria-live="polite"
            style={{
              margin: 0,
              textAlign: 'center',
              fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
              lineHeight: 1.4,
              color: 'var(--pw-color-muted, #71717a)',
            }}
          >
            {remainingLabel}
          </p>
        ) : null}
      </header>
    </div>
  );
}
