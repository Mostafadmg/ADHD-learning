import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

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
  productName: {
    type: 'string',
    title: 'Product name',
    defaultValue: 'Progesterone E4M Oral Capsule 100mg',
  },
};

export const outputSchema = {
  decision: {
    type: 'string',
    title: 'Decision',
    description: 'Patient choice: "accept" or "decline"',
    required: true,
  },
  priceId: {
    type: 'string',
    title: 'Price ID',
    description: 'Matched progesterone priceId (e.g. "2154", "2209", "2214"); empty when declined',
  },
  supplyDays: {
    type: 'number',
    title: 'Supply days',
    description: 'Matched supply length in days (30, 90, or 150); 0 when declined',
  },
};

type ProgOffer = {
  priceId: string;
  supplyDays: number;
  price: number;
};

const FALLBACK_OFFER: ProgOffer = { priceId: '2154', supplyDays: 30, price: 69 };

const ESTRADIOL_PRICE_MAP: Record<string, ProgOffer> = {
  '9101': { priceId: '2154', supplyDays: 30, price: 69 },
  '9111': { priceId: '2154', supplyDays: 30, price: 69 },
  '9121': { priceId: '2154', supplyDays: 30, price: 69 },
  '9102': { priceId: '2209', supplyDays: 90, price: 149 },
  '9112': { priceId: '2209', supplyDays: 90, price: 149 },
  '9122': { priceId: '2209', supplyDays: 90, price: 149 },
  '9103': { priceId: '2214', supplyDays: 150, price: 199 },
  '9113': { priceId: '2214', supplyDays: 150, price: 199 },
  '9123': { priceId: '2214', supplyDays: 150, price: 199 },
};

const SUPPLY_DAYS_MAP: Record<number, ProgOffer> = {
  30: { priceId: '2154', supplyDays: 30, price: 69 },
  90: { priceId: '2209', supplyDays: 90, price: 149 },
  150: { priceId: '2214', supplyDays: 150, price: 199 },
};

const PROG_PRICE_IDS = new Set(['2154', '2209', '2214']);

type Decision = 'accept' | 'decline' | null;

type CartItemLike = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variants?: { name: string; value: string }[];
};

function parseSupplyDays(raw: string | undefined): number | null {
  if (!raw) return null;
  const match = raw.match(/(\d+)\s*-?\s*day/i) || raw.match(/^(\d+)$/);
  if (!match) return null;
  const n = Number(match[1]);
  return n === 30 || n === 90 || n === 150 ? n : null;
}

function resolveOfferFromCart(items: CartItemLike[]): ProgOffer {
  for (const item of items) {
    const idKey = String(item.id);
    if (ESTRADIOL_PRICE_MAP[idKey]) {
      return ESTRADIOL_PRICE_MAP[idKey];
    }
    for (const v of item.variants || []) {
      const vKey = String(v.value);
      if (ESTRADIOL_PRICE_MAP[vKey]) {
        return ESTRADIOL_PRICE_MAP[vKey];
      }
      if (/price\s*id/i.test(v.name) && ESTRADIOL_PRICE_MAP[vKey]) {
        return ESTRADIOL_PRICE_MAP[vKey];
      }
      const days = parseSupplyDays(v.value) ?? (/supply/i.test(v.name) ? parseSupplyDays(v.value) : null);
      if (days && SUPPLY_DAYS_MAP[days]) {
        return SUPPLY_DAYS_MAP[days];
      }
    }
    const nameDays = parseSupplyDays(item.name);
    if (nameDays && SUPPLY_DAYS_MAP[nameDays]) {
      return SUPPLY_DAYS_MAP[nameDays];
    }
  }
  return FALLBACK_OFFER;
}

function formatMoney(amount: number): string {
  return '$' + amount.toFixed(amount % 1 === 0 ? 0 : 2);
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l7 3v5.5c0 4.5-2.9 7.9-7 9.5-4.1-1.6-7-5-7-9.5V6l7-3z"
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
  );
}

function CapsuleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.5" y="8" width="15" height="8" rx="4" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 8v8" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export default function ProgesteroneApproval({
  title = 'Progesterone is required with estrogen',
  body = 'Because you still have a uterus, we cannot prescribe estradiol alone. Oral micronized progesterone protects the uterine lining and must match your estradiol supply length.',
  productName = 'Progesterone E4M Oral Capsule 100mg',
  onChange,
}: {
  title?: string;
  body?: string;
  productName?: string;
  onChange?: (outputs: {
    decision: string;
    priceId: string;
    supplyDays: number;
  }) => void;
}) {
  const [decision, setDecision] = useState<Decision>(null);
  const [offer, setOffer] = useState<ProgOffer>(FALLBACK_OFFER);
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const refreshOffer = useCallback(() => {
    const items = (window.pathwai?.cart?.getItems?.() ?? []) as CartItemLike[];
    setOffer(resolveOfferFromCart(items));
  }, []);

  useEffect(() => {
    refreshOffer();
    const handler = () => refreshOffer();
    window.addEventListener('pathwai:cart:updated', handler as EventListener);
    return () => window.removeEventListener('pathwai:cart:updated', handler as EventListener);
  }, [refreshOffer]);

  useEffect(() => {
    if (!justSelected) return;
    const el = optionRefs.current[justSelected];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelected]);

  const removeExistingProgesterone = useCallback(() => {
    const cart = window.pathwai?.cart;
    if (!cart) return;
    const items = (cart.getItems?.() ?? []) as CartItemLike[];
    for (const item of items) {
      const id = String(item.id);
      const isProg =
        PROG_PRICE_IDS.has(id) ||
        /progesterone/i.test(item.name) ||
        (item.variants || []).some((v) => PROG_PRICE_IDS.has(String(v.value)));
      if (isProg) {
        cart.removeItem(item.id, item.variants);
      }
    }
  }, []);

  const addMatchedProgesterone = useCallback(
    (matched: ProgOffer) => {
      const cart = window.pathwai?.cart;
      if (!cart) return;
      removeExistingProgesterone();
      cart.addItem({
        id: matched.priceId,
        name: productName,
        price: matched.price,
        quantity: 1,
        variants: [
          { name: 'Supply', value: matched.supplyDays + '-day' },
          { name: 'Strength', value: '100mg' },
          { name: 'priceId', value: matched.priceId },
        ],
      });
    },
    [productName, removeExistingProgesterone]
  );

  useEffect(() => {
    if (!decision) return;
    if (decision === 'accept') {
      onChange?.({
        decision: 'accept',
        priceId: offer.priceId,
        supplyDays: offer.supplyDays,
      });
    } else {
      onChange?.({
        decision: 'decline',
        priceId: '',
        supplyDays: 0,
      });
    }
  }, [decision, offer.priceId, offer.supplyDays, onChange]);

  const handleSelect = (value: 'accept' | 'decline') => {
    setJustSelected(value);
    setDecision(value);
    if (value === 'accept') {
      addMatchedProgesterone(offer);
    } else {
      removeExistingProgesterone();
    }
  };

  const supplyLabel = useMemo(() => offer.supplyDays + '-day supply', [offer.supplyDays]);

  const options: {
    id: 'accept' | 'decline';
    label: string;
    hint: string;
  }[] = [
    {
      id: 'accept',
      label: 'Accept and add progesterone to my plan',
      hint: 'Required for uterine lining protection with your estradiol',
    },
    {
      id: 'decline',
      label: 'I do not want progesterone',
      hint: 'Estradiol alone cannot be prescribed if you have a uterus',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 36rem)',
        margin: '0 auto',
        fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #0f172a)',
        boxSizing: 'border-box',
      }}
    >
      <header
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
          ['--pw-motion-enter-delay' as string]: '0ms',
        } as React.CSSProperties}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            alignSelf: 'flex-start',
            padding: '0.35rem 0.7rem',
            borderRadius: '999px',
            background: 'var(--pw-color-info-surface, #e0f2fe)',
            color: 'var(--pw-color-info, #0369a1)',
            fontSize: 'var(--pw-font-size-caption, 0.8rem)',
            fontWeight: 600,
            letterSpacing: '0.01em',
          }}
        >
          <ShieldIcon />
          <span>Uterine protection</span>
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, system-ui, sans-serif))',
            fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.5rem))',
            fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 700))' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.2))' as React.CSSProperties['lineHeight'],
            letterSpacing: 'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
            color: 'var(--pw-label-fg, var(--pw-color-on-surface, #0f172a))',
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-content-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
            fontSize: 'var(--pw-content-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))' as React.CSSProperties['lineHeight'],
            color: 'var(--pw-content-fg, var(--pw-color-on-surface, #0f172a))',
          }}
        >
          {body}
        </p>
      </header>

      <section
        className="pw-motion-enter"
        aria-label="Matched progesterone supply"
        style={{
          ['--pw-motion-enter-delay' as string]: '80ms',
          background: 'var(--pw-color-surface, #ffffff)',
          border: '1.5px solid var(--pw-color-border, #e2e8f0)',
          borderRadius: 'var(--pw-radius, 8px)',
          boxShadow: 'var(--pw-shadow, 0 1px 3px rgba(15, 23, 42, 0.06))',
          padding: 'var(--pw-control-padding, 1rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
        } as React.CSSProperties}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--pw-answer-gap, 0.75rem)',
          }}
        >
          <div
            style={{
              flexShrink: 0,
              width: 52,
              height: 52,
              borderRadius: 'var(--pw-radius, 8px)',
              background: 'var(--pw-answer-media-bg, #f1f5f9)',
              color: 'var(--pw-answer-media-fg, var(--pw-color-brand, #2563eb))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CapsuleIcon />
          </div>

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div
              style={{
                fontSize: 'var(--pw-font-size-caption, 0.8rem)',
                fontWeight: 600,
                color: 'var(--pw-label-sublabel-fg, var(--pw-color-muted, #64748b))',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.04em',
              }}
            >
              Matched to your estradiol
            </div>
            <div
              style={{
                fontFamily: 'var(--pw-font-family-title, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-body, 1rem)',
                fontWeight: 650,
                lineHeight: 1.35,
                color: 'var(--pw-color-on-surface, #0f172a)',
              }}
            >
              {productName}
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.15rem',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: 28,
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  background: 'var(--pw-color-brand, #2563eb)',
                  color: 'var(--pw-color-brand-contrast, #ffffff)',
                  fontSize: 'var(--pw-font-size-caption, 0.8rem)',
                  fontWeight: 600,
                }}
              >
                {supplyLabel}
              </span>
              <span
                style={{
                  fontSize: 'var(--pw-font-size-body, 1rem)',
                  fontWeight: 700,
                  color: 'var(--pw-color-on-surface, #0f172a)',
                  letterSpacing: '-0.01em',
                }}
              >
                {formatMoney(offer.price)}
              </span>
            </div>
          </div>
        </div>

        <p
          style={{
            margin: 0,
            paddingTop: '0.35rem',
            borderTop: '1px solid var(--pw-color-border, #e2e8f0)',
            fontSize: 'var(--pw-font-size-caption, 0.8rem)',
            lineHeight: 1.45,
            color: 'var(--pw-label-sublabel-fg, var(--pw-color-muted, #64748b))',
          }}
        >
          Oral micronized progesterone 100mg — supply length locked to your estradiol so protection lasts the full course.
        </p>
      </section>

      <div
        role="radiogroup"
        aria-label="Progesterone plan decision"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
        }}
      >
        {options.map((opt, index) => {
          const selected = decision === opt.id;
          const isAccept = opt.id === 'accept';
          return (
            <button
              key={opt.id}
              ref={(el) => {
                optionRefs.current[opt.id] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              className="pw-motion-enter"
              onClick={() => handleSelect(opt.id)}
              style={{
                ['--pw-motion-enter-delay' as string]: 160 + index * 100 + 'ms',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--pw-answer-gap, 0.75rem)',
                width: '100%',
                minHeight: 56,
                textAlign: 'left',
                cursor: 'pointer',
                padding: 'var(--pw-control-padding, 1rem)',
                borderRadius: 'var(--pw-radius, 8px)',
                border: selected
                  ? '2px solid var(--pw-color-brand, #2563eb)'
                  : '1.5px solid var(--pw-answer-border, #e2e8f0)',
                background: selected
                  ? 'var(--pw-answer-surface-selected, #eff6ff)'
                  : 'var(--pw-answer-surface, #ffffff)',
                color: selected
                  ? 'var(--pw-answer-fg-selected, var(--pw-color-on-surface, #0f172a))'
                  : 'var(--pw-answer-fg, var(--pw-color-on-surface, #0f172a))',
                boxShadow: selected ? 'var(--pw-shadow, 0 1px 3px rgba(15, 23, 42, 0.06))' : 'none',
                transition:
                  'background var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease), border-color var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease), box-shadow var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease)',
                fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
                WebkitTapHighlightColor: 'transparent',
              } as React.CSSProperties}
            >
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: 'var(--pw-answer-indicator-size, 18px)',
                  height: 'var(--pw-answer-indicator-size, 18px)',
                  marginTop: '0.15rem',
                  borderRadius: isAccept
                    ? 'var(--pw-answer-indicator-radius, 999px)'
                    : 'var(--pw-answer-indicator-radius, 999px)',
                  border: selected
                    ? '2px solid var(--pw-answer-indicator-fill, var(--pw-color-brand, #2563eb))'
                    : '2px solid var(--pw-answer-border, #e2e8f0)',
                  background: selected
                    ? 'var(--pw-answer-indicator-fill, var(--pw-color-brand, #2563eb))'
                    : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition:
                    'background var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease), border-color var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease)',
                }}
              >
                {selected && (
                  <span
                    className="pw-motion-pop"
                    style={{
                      color: 'var(--pw-answer-indicator-check, #ffffff)',
                      fontSize: 11,
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    ✓
                  </span>
                )}
              </span>

              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span
                  style={{
                    fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                    fontWeight: 'var(--pw-answer-font-weight, 600)' as React.CSSProperties['fontWeight'],
                    lineHeight: 1.35,
                  }}
                >
                  {opt.label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--pw-answer-subtext-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
                    fontSize: 'var(--pw-answer-subtext-font-size, var(--pw-font-size-caption, 0.875rem))',
                    fontWeight: 'var(--pw-answer-subtext-font-weight, 400)' as React.CSSProperties['fontWeight'],
                    lineHeight: 1.4,
                    color: 'var(--pw-answer-subtext-fg, var(--pw-label-sublabel-fg, var(--pw-color-muted, #64748b)))',
                  }}
                >
                  {opt.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {decision === 'accept' && (
        <p
          className="pw-motion-enter"
          role="status"
          style={{
            ['--pw-motion-enter-delay' as string]: '0ms',
            margin: 0,
            padding: '0.75rem 1rem',
            borderRadius: 'var(--pw-radius, 8px)',
            background: 'var(--pw-color-success-surface, #dcfce7)',
            color: 'var(--pw-color-success, #15803d)',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            lineHeight: 1.45,
            fontWeight: 500,
          } as React.CSSProperties}
        >
          Progesterone {supplyLabel.toLowerCase()} ({formatMoney(offer.price)}) has been added to your plan.
        </p>
      )}

      {decision === 'decline' && (
        <p
          className="pw-motion-enter"
          role="status"
          style={{
            ['--pw-motion-enter-delay' as string]: '0ms',
            margin: 0,
            padding: '0.75rem 1rem',
            borderRadius: 'var(--pw-radius, 8px)',
            background: 'var(--pw-color-warning-surface, #fef3c7)',
            color: 'var(--pw-color-warning, #b45309)',
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            lineHeight: 1.45,
            fontWeight: 500,
          } as React.CSSProperties}
        >
          Without progesterone, estradiol cannot be prescribed when you have a uterus. Continue only if you wish to discuss alternatives.
        </p>
      )}
    </div>
  );
}