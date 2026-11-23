import React, { useState, useEffect, useMemo, useCallback } from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'Progesterone is required with estrogen',
  },
  body: {
    type: 'string',
    title: 'Body',
    defaultValue:
      'Because you still have a uterus, we cannot prescribe estradiol alone. Oral micronized progesterone protects the uterine lining and must match your estradiol supply length.',
  },
  acceptLabel: {
    type: 'string',
    title: 'Accept button',
    defaultValue: 'Accept and add progesterone to my plan',
  },
  declineLabel: {
    type: 'string',
    title: 'Decline button',
    defaultValue: 'I do not want progesterone',
  },
};

export const outputSchema = {
  decision: {
    type: 'string',
    title: 'Decision',
    description: 'Bare string "accept" or "decline"',
    required: true,
  },
  supplyDays: {
    type: 'number',
    title: 'Supply days',
    description: 'Matched supply length: 30, 90, or 150',
  },
  priceId: {
    type: 'string',
    title: 'Price ID',
    description: 'Progesterone priceId: 2154 | 2209 | 2214',
  },
};

const PRODUCT_NAME = 'Progesterone E4M Oral Capsule 100mg';

const SUPPLY_BY_DAYS: Record<
  number,
  { days: number; price: number; priceId: string; label: string }
> = {
  30: { days: 30, price: 69, priceId: '2154', label: '30-day' },
  90: { days: 90, price: 149, priceId: '2209', label: '90-day' },
  150: { days: 150, price: 199, priceId: '2214', label: '150-day' },
};

const ESTRADIOL_PRICE_TO_DAYS: Record<string, number> = {
  '9101': 30,
  '9111': 30,
  '9121': 30,
  '9102': 90,
  '9112': 90,
  '9122': 90,
  '9103': 150,
  '9113': 150,
  '9123': 150,
};

const SUPPLY_ID_TO_DAYS: Record<string, number> = {
  supply_30: 30,
  supply_90: 90,
  supply_150: 150,
  '30': 30,
  '90': 90,
  '150': 150,
};

function resolveSupplyDays(): number {
  const cart = window.pathwai?.cart;
  if (cart) {
    const items = cart.getItems?.() ?? [];
    for (const item of items) {
      const id = String((item as { priceId?: string }).priceId ?? item.id ?? '');
      if (ESTRADIOL_PRICE_TO_DAYS[id] != null) {
        return ESTRADIOL_PRICE_TO_DAYS[id];
      }
      const variants = item.variants ?? [];
      for (const v of variants) {
        const val = String(v.value ?? '').toLowerCase();
        if (val.includes('150')) return 150;
        if (val.includes('90')) return 90;
        if (val.includes('30')) return 30;
      }
    }
  }

  const answers = (window.pathwai?.flow?.getAnswers?.() ?? {}) as Record<
    string,
    unknown
  >;

  const dig = (obj: unknown, depth = 0): number | null => {
    if (obj == null || depth > 6) return null;
    if (typeof obj === 'number' && (obj === 30 || obj === 90 || obj === 150)) {
      return obj;
    }
    if (typeof obj === 'string') {
      const s = obj.trim().toLowerCase();
      if (SUPPLY_ID_TO_DAYS[s] != null) return SUPPLY_ID_TO_DAYS[s];
      if (ESTRADIOL_PRICE_TO_DAYS[s] != null) return ESTRADIOL_PRICE_TO_DAYS[s];
      const m = s.match(/\b(30|90|150)\b/);
      if (m) return Number(m[1]);
      return null;
    }
    if (Array.isArray(obj)) {
      for (const x of obj) {
        const d = dig(x, depth + 1);
        if (d != null) return d;
      }
      return null;
    }
    if (typeof obj === 'object') {
      const rec = obj as Record<string, unknown>;
      for (const key of [
        'supplyDays',
        'supplyId',
        'supply',
        'supply_days',
        'priceId',
      ]) {
        if (key in rec) {
          const d = dig(rec[key], depth + 1);
          if (d != null) return d;
        }
      }
      for (const v of Object.values(rec)) {
        const d = dig(v, depth + 1);
        if (d != null) return d;
      }
    }
    return null;
  };

  const fromAnswers = dig(answers);
  if (fromAnswers != null) return fromAnswers;

  return 30;
}

declare global {
  interface Window {
    pathwai?: {
      cart?: {
        addItem: (item: {
          id: string;
          name: string;
          price: number;
          quantity?: number;
          image?: string;
          variants?: { name: string; value: string }[];
        }) => void;
        getItems: () => {
          id: string;
          name: string;
          price: number;
          quantity: number;
          variants?: { name: string; value: string }[];
          priceId?: string;
        }[];
        getCart: () => unknown;
      };
      flow?: {
        next: (answer?: unknown) => void;
        back: () => void;
        getAnswers: () => Record<string, unknown>;
        getProgress: () => {
          stepNumber: number;
          totalSteps: number;
          percent: number;
          isFirstStep: boolean;
          isLastStep: boolean;
        };
      };
    };
  }
}

export default function ProgesteroneRequiredStep({
  title = 'Progesterone is required with estrogen',
  body = 'Because you still have a uterus, we cannot prescribe estradiol alone. Oral micronized progesterone protects the uterine lining and must match your estradiol supply length.',
  acceptLabel = 'Accept and add progesterone to my plan',
  declineLabel = 'I do not want progesterone',
  onChange,
  onAnswer,
}: {
  title?: string;
  body?: string;
  acceptLabel?: string;
  declineLabel?: string;
  onChange?: (outputs: {
    decision: string;
    supplyDays: number;
    priceId: string;
  }) => void;
  onAnswer?: (value: string) => void;
}) {
  const plan = useMemo(() => {
    const days = resolveSupplyDays();
    return SUPPLY_BY_DAYS[days] ?? SUPPLY_BY_DAYS[30];
  }, []);

  const [decision, setDecision] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!decision) return;
    onChange?.({
      decision,
      supplyDays: plan.days,
      priceId: plan.priceId,
    });
  }, [decision, plan.days, plan.priceId, onChange]);

  const emitAnswer = useCallback(
    (value: 'accept' | 'decline') => {
      onAnswer?.(value);
      onChange?.({
        decision: value,
        supplyDays: plan.days,
        priceId: plan.priceId,
      });
    },
    [onAnswer, onChange, plan.days, plan.priceId]
  );

  const handleAccept = () => {
    if (busy) return;
    setBusy(true);
    setDecision('accept');

    window.pathwai?.cart?.addItem({
      id: plan.priceId,
      name: PRODUCT_NAME,
      price: plan.price,
      quantity: 1,
      variants: [
        { name: 'Supply', value: `${plan.days}-day` },
        { name: 'priceId', value: plan.priceId },
      ],
    });

    emitAnswer('accept');
    window.pathwai?.flow?.next('accept');
  };

  const handleDecline = () => {
    if (busy) return;
    setBusy(true);
    setDecision('decline');
    emitAnswer('decline');
    window.pathwai?.flow?.next('decline');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-element-gap, 1.25rem)',
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 617px)',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '0ms',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          } as React.CSSProperties
        }
      >
        <p
          style={{
            margin: 0,
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--pw-label-sublabel-fg, #545454)',
          }}
        >
          Required with your plan
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-title, 1.75rem)',
            fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
            lineHeight: 'var(--pw-font-line-height-title, 1.2)',
            letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
            color: 'var(--pw-label-fg, #002021)',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
            lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            color: 'var(--pw-content-fg, var(--pw-color-on-surface, #1C1C21))',
          }}
        >
          {body}
        </p>
      </div>

      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '100ms',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            padding: 'var(--pw-control-padding, 1rem)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            border: '1.5px solid var(--pw-color-border, #EFEFEC)',
            background: 'var(--pw-color-surface, #ffffff)',
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
          } as React.CSSProperties
        }
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--pw-answer-font-size, 1rem)',
                fontWeight: 600,
                color: 'var(--pw-answer-fg, #1C1C21)',
                lineHeight: 1.35,
              }}
            >
              {PRODUCT_NAME}
            </p>
            <p
              style={{
                margin: '0.35rem 0 0',
                fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                color: 'var(--pw-answer-subtext-fg, var(--pw-label-sublabel-fg, #545454))',
              }}
            >
              {plan.label} supply · matches your estradiol
            </p>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--pw-color-brand, #161336)',
              whiteSpace: 'nowrap',
            }}
          >
            ${plan.price}
          </p>
        </div>
      </div>

      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '200ms',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginTop: '0.25rem',
          } as React.CSSProperties
        }
      >
        <button
          type="button"
          disabled={busy}
          onClick={handleAccept}
          className={decision === 'accept' ? 'pw-motion-just-selected' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            minHeight: 48,
            padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
            border: 'none',
            borderRadius:
              'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
            background: 'var(--pw-button-bg, #161336)',
            color: 'var(--pw-button-fg, #ffffff)',
            fontFamily:
              'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-navigation-button-font-size, 1rem)',
            fontWeight: 600,
            cursor: busy ? 'wait' : 'pointer',
            opacity: busy && decision !== 'accept' ? 0.7 : 1,
            transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
          }}
        >
          {busy && decision === 'accept' ? (
            <span
              className="pw-motion-spin"
              style={{
                width: 16,
                height: 16,
                borderRadius: 999,
                border: '2px solid currentColor',
                borderRightColor: 'transparent',
                display: 'inline-block',
              }}
              aria-hidden
            />
          ) : null}
          {acceptLabel}
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={handleDecline}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minHeight: 48,
            padding: 'var(--pw-control-padding, 1rem)',
            border: '1.5px solid var(--pw-answer-border, #E0E0E0)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            background: 'var(--pw-answer-surface, #ffffff)',
            color: 'var(--pw-answer-fg, #1C1C21)',
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 500,
            cursor: busy ? 'wait' : 'pointer',
            opacity: busy
              ? 'var(--pw-state-disabled-opacity, 0.45)'
              : 1,
            transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
          }}
        >
          {declineLabel}
        </button>
      </div>
    </div>
  );
}