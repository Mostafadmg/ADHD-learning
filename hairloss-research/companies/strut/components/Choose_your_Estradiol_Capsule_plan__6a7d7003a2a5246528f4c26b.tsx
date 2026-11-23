import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'Choose your estradiol',
  },
  subtitle: {
    type: 'string',
    title: 'Subtitle',
    defaultValue: 'Pick a strength and supply. Your clinician will review before anything ships.',
  },
};

export const outputSchema = {
  strengthId: {
    type: 'string',
    title: 'Strength ID',
    description: 'Selected strength: strength_0_5 | strength_1 | strength_2',
    required: true,
  },
  supplyId: {
    type: 'string',
    title: 'Supply ID',
    description: 'Selected supply: supply_30 | supply_90 | supply_150',
    required: true,
  },
  priceId: {
    type: 'string',
    title: 'Price ID',
    description: 'CarePortals placeholder price id (9101–9123)',
    required: true,
  },
  name: {
    type: 'string',
    title: 'Product name',
    description: 'Display name of the selected product',
    required: true,
  },
  supplyDays: {
    type: 'number',
    title: 'Supply days',
    description: 'Supply length in days: 30 | 90 | 150',
    required: true,
  },
};

const PRODUCT_NAME = 'Compounded Estradiol Oral Capsule';
const PRODUCT_SLUG = 'estradiol-oral-capsule';
const PRODUCT_IMAGE =
  'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/image-1784145662212-2e98c18fe707a756.png';
const CART_ITEM_ID = 'estradiol-oral-capsule';

type StrengthId = 'strength_0_5' | 'strength_1' | 'strength_2';
type SupplyId = 'supply_30' | 'supply_90' | 'supply_150';

const STRENGTHS: { id: StrengthId; label: string; mg: string }[] = [
  { id: 'strength_0_5', label: '0.5 mg', mg: '0.5 mg' },
  { id: 'strength_1', label: '1 mg', mg: '1 mg' },
  { id: 'strength_2', label: '2 mg', mg: '2 mg' },
];

const SUPPLIES: {
  id: SupplyId;
  days: number;
  label: string;
  price: number;
  perDay: string;
  badge?: string;
}[] = [
  { id: 'supply_30', days: 30, label: '30-day supply', price: 69, perDay: '$2.30/day' },
  {
    id: 'supply_90',
    days: 90,
    label: '90-day supply',
    price: 149,
    perDay: '$1.66/day',
    badge: 'Most popular',
  },
  {
    id: 'supply_150',
    days: 150,
    label: '150-day supply',
    price: 199,
    perDay: '$1.33/day',
    badge: 'Best value',
  },
];

const PRICE_MAP: Record<StrengthId, Record<SupplyId, string>> = {
  strength_0_5: {
    supply_30: '9101',
    supply_90: '9102',
    supply_150: '9103',
  },
  strength_1: {
    supply_30: '9111',
    supply_90: '9112',
    supply_150: '9113',
  },
  strength_2: {
    supply_30: '9121',
    supply_90: '9122',
    supply_150: '9123',
  },
};

type Outputs = {
  strengthId: StrengthId;
  supplyId: SupplyId;
  priceId: string;
  name: string;
  supplyDays: number;
};

function formatMoney(n: number) {
  return '$' + n.toFixed(n % 1 === 0 ? 0 : 2);
}

export default function EstradiolOralCapsuleSelector({
  title = 'Choose your estradiol',
  subtitle = 'Pick a strength and supply. Your clinician will review before anything ships.',
  onChange,
}: {
  title?: string;
  subtitle?: string;
  onChange?: (outputs: Outputs) => void;
}) {
  const [strengthId, setStrengthId] = useState<StrengthId | null>(null);
  const [supplyId, setSupplyId] = useState<SupplyId | null>(null);
  const [justSelectedStrength, setJustSelectedStrength] = useState<string | null>(null);
  const [justSelectedSupply, setJustSelectedSupply] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const strengthRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const supplyRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastCartKey = useRef<string | null>(null);

  const selectedStrength = useMemo(
    () => STRENGTHS.find((s) => s.id === strengthId) ?? null,
    [strengthId]
  );
  const selectedSupply = useMemo(
    () => SUPPLIES.find((s) => s.id === supplyId) ?? null,
    [supplyId]
  );

  const priceId =
    strengthId && supplyId ? PRICE_MAP[strengthId][supplyId] : null;

  const outputs: Outputs | null =
    strengthId && supplyId && priceId && selectedSupply
      ? {
          strengthId,
          supplyId,
          priceId,
          name: PRODUCT_NAME,
          supplyDays: selectedSupply.days,
        }
      : null;

  useEffect(() => {
    if (!outputs) return;
    onChange?.(outputs);
  }, [outputs, onChange]);

  // Selection bounce helpers
  useEffect(() => {
    if (!justSelectedStrength) return;
    const el = strengthRefs.current[justSelectedStrength];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelectedStrength]);

  useEffect(() => {
    if (!justSelectedSupply) return;
    const el = supplyRefs.current[justSelectedSupply];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelectedSupply]);

  const syncCart = useCallback(() => {
    if (!strengthId || !supplyId || !selectedStrength || !selectedSupply || !priceId) {
      setAdded(false);
      return;
    }

    const cartKey = `${strengthId}:${supplyId}:${priceId}`;
    const cartApi = typeof window !== 'undefined' ? window.pathwai?.cart : undefined;

    if (cartApi) {
      // Replace any existing estradiol line so strength/supply changes don't stack
      try {
        const items = cartApi.getItems?.() ?? [];
        const existing = items.filter((item) => item.id === CART_ITEM_ID);
        existing.forEach((item) => {
          cartApi.removeItem?.(item.id, item.variants);
        });
      } catch {
        // ignore cart read errors in preview
      }

      cartApi.addItem?.({
        id: CART_ITEM_ID,
        name: PRODUCT_NAME,
        price: selectedSupply.price,
        quantity: 1,
        image: PRODUCT_IMAGE,
        variants: [
          { name: 'Strength', value: selectedStrength.mg },
          { name: 'Supply', value: `${selectedSupply.days}-day` },
          { name: 'priceId', value: priceId },
          { name: 'slug', value: PRODUCT_SLUG },
        ],
      });
    }

    lastCartKey.current = cartKey;
    setAdded(true);
  }, [strengthId, supplyId, selectedStrength, selectedSupply, priceId]);

  useEffect(() => {
    if (!strengthId || !supplyId) {
      setAdded(false);
      return;
    }
    syncCart();
  }, [strengthId, supplyId, syncCart]);

  const handleStrength = (id: StrengthId) => {
    setStrengthId(id);
    setJustSelectedStrength(id);
  };

  const handleSupply = (id: SupplyId) => {
    setSupplyId(id);
    setJustSelectedSupply(id);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 32rem)',
        margin: '0 auto',
        fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #0f172a)',
        boxSizing: 'border-box',
      }}
    >
      {/* Product hero */}
      <header
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
          ['--pw-motion-enter-delay' as string]: '0ms',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 'var(--pw-element-gap, 0.75rem)',
            alignItems: 'stretch',
          }}
        >
          <div
            style={{
              flexShrink: 0,
              width: 88,
              height: 88,
              borderRadius: 'var(--pw-radius, 8px)',
              overflow: 'hidden',
              background: 'var(--pw-answer-media-bg, #f1f5f9)',
              border: '1px solid var(--pw-color-border, #e2e8f0)',
            }}
          >
            <img
              src={PRODUCT_IMAGE}
              alt={PRODUCT_NAME}
              width={88}
              height={88}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '0.25rem',
              minWidth: 0,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--pw-font-family-title, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-title, 1.5rem)',
                fontWeight: 'var(--pw-font-weight-title, 600)' as unknown as number,
                lineHeight: 'var(--pw-font-line-height-title, 1.2)' as unknown as number,
                letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
                color: 'var(--pw-label-fg, var(--pw-color-on-surface, #0f172a))',
              }}
            >
              {PRODUCT_NAME}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                color: 'var(--pw-label-sublabel-fg, var(--pw-color-muted, #64748b))',
                lineHeight: 1.4,
              }}
            >
              Compounded oral bioidentical estradiol · clinician-reviewed
            </p>
          </div>
        </div>

        <div style={{ marginTop: '0.25rem' }}>
          <h2
            style={{
              margin: '0 0 0.35rem 0',
              fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, system-ui, sans-serif))',
              fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.5rem))',
              fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 600))' as unknown as number,
              lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.2))' as unknown as number,
              letterSpacing: 'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
              color: 'var(--pw-label-fg, var(--pw-color-on-surface, #0f172a))',
            }}
          >
            {title}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--pw-label-sublabel-font-size, var(--pw-font-size-body, 1rem))',
              fontFamily: 'var(--pw-label-sublabel-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
              fontWeight: 'var(--pw-label-sublabel-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
              color: 'var(--pw-label-sublabel-fg, var(--pw-color-muted, #64748b))',
              lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
            }}
          >
            {subtitle}
          </p>
        </div>
      </header>

      {/* Strength */}
      <section
        aria-labelledby="estradiol-strength-label"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
        }}
      >
        <div
          className="pw-motion-enter"
          style={{ ['--pw-motion-enter-delay' as string]: '80ms' }}
        >
          <p
            id="estradiol-strength-label"
            style={{
              margin: 0,
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 600,
              color: 'var(--pw-color-on-surface, #0f172a)',
            }}
          >
            Strength
          </p>
          <p
            style={{
              margin: '0.2rem 0 0 0',
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              color: 'var(--pw-color-muted, #64748b)',
            }}
          >
            Daily oral dose
          </p>
        </div>

        <div
          role="radiogroup"
          aria-labelledby="estradiol-strength-label"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 'var(--pw-element-gap, 0.75rem)',
          }}
        >
          {STRENGTHS.map((s, index) => {
            const selected = strengthId === s.id;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  strengthRefs.current[s.id] = el;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                className="pw-motion-enter"
                onClick={() => handleStrength(s.id)}
                style={{
                  ['--pw-motion-enter-delay' as string]: `${120 + index * 70}ms`,
                  minHeight: 52,
                  padding: 'var(--pw-control-padding, 0.875rem)',
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
                  fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
                  fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                  fontWeight: selected ? 600 : ('var(--pw-answer-font-weight, 500)' as unknown as number),
                  cursor: 'pointer',
                  boxShadow: selected ? 'none' : 'var(--pw-shadow, none)',
                  transition: `border-color var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease), background var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, var(--pw-color-brand, #2563eb))`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = selected
                    ? 'none'
                    : 'var(--pw-shadow, none)';
                }}
              >
                <span>{s.label}</span>
                {selected && (
                  <span
                    className="pw-motion-pop"
                    aria-hidden
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--pw-color-brand, #2563eb)',
                      lineHeight: 1,
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Supply */}
      <section
        aria-labelledby="estradiol-supply-label"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
        }}
      >
        <div
          className="pw-motion-enter"
          style={{ ['--pw-motion-enter-delay' as string]: '280ms' }}
        >
          <p
            id="estradiol-supply-label"
            style={{
              margin: 0,
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 600,
              color: 'var(--pw-color-on-surface, #0f172a)',
            }}
          >
            Supply length
          </p>
          <p
            style={{
              margin: '0.2rem 0 0 0',
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              color: 'var(--pw-color-muted, #64748b)',
            }}
          >
            Longer supplies lower the daily cost
          </p>
        </div>

        <div
          role="radiogroup"
          aria-labelledby="estradiol-supply-label"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 0.75rem)',
          }}
        >
          {SUPPLIES.map((s, index) => {
            const selected = supplyId === s.id;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  supplyRefs.current[s.id] = el;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                className="pw-motion-enter"
                onClick={() => handleSupply(s.id)}
                style={{
                  ['--pw-motion-enter-delay' as string]: `${320 + index * 80}ms`,
                  minHeight: 44,
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
                  fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
                  fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                  fontWeight: 'var(--pw-answer-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
                  cursor: 'pointer',
                  boxShadow: selected ? 'none' : 'var(--pw-shadow, none)',
                  transition: `border-color var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease), background var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--pw-answer-gap, 0.75rem)',
                  textAlign: 'left',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, var(--pw-color-brand, #2563eb))`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = selected
                    ? 'none'
                    : 'var(--pw-shadow, none)';
                }}
              >
                {/* Radio indicator */}
                <span
                  aria-hidden
                  style={{
                    display: 'var(--pw-answer-indicator-display, flex)',
                    flexShrink: 0,
                    width: 'var(--pw-answer-indicator-size, 18px)',
                    height: 'var(--pw-answer-indicator-size, 18px)',
                    borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                    border: selected
                      ? '2px solid var(--pw-answer-indicator-fill, var(--pw-color-brand, #2563eb))'
                      : '2px solid var(--pw-answer-border, #e2e8f0)',
                    background: selected
                      ? 'var(--pw-answer-indicator-fill, var(--pw-color-brand, #2563eb))'
                      : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  {selected && (
                    <span
                      className="pw-motion-pop"
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background: 'var(--pw-answer-indicator-check, #ffffff)',
                        display: 'var(--pw-answer-indicator-dot-display, flex)',
                      }}
                    />
                  )}
                </span>

                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontWeight: 600,
                    }}
                  >
                    {s.label}
                    {s.badge && (
                      <span
                        style={{
                          fontSize: 'var(--pw-font-size-caption, 0.75rem)',
                          fontWeight: 600,
                          padding: '0.15rem 0.45rem',
                          borderRadius: 999,
                          background: selected
                            ? 'var(--pw-color-brand, #2563eb)'
                            : 'var(--pw-color-info-surface, #e0f2fe)',
                          color: selected
                            ? 'var(--pw-color-brand-contrast, #ffffff)'
                            : 'var(--pw-color-on-info, #0c4a6e)',
                          lineHeight: 1.2,
                        }}
                      >
                        {s.badge}
                      </span>
                    )}
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--pw-answer-subtext-font-size, var(--pw-font-size-caption, 0.875rem))',
                      fontFamily: 'var(--pw-answer-subtext-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
                      color: 'var(--pw-answer-subtext-fg, var(--pw-label-sublabel-fg, #64748b))',
                    }}
                  >
                    {s.perDay}
                  </span>
                </span>

                <span
                  style={{
                    flexShrink: 0,
                    fontWeight: 700,
                    fontSize: '1.05em',
                    color: selected
                      ? 'var(--pw-color-brand, #2563eb)'
                      : 'var(--pw-color-on-surface, #0f172a)',
                  }}
                >
                  {formatMoney(s.price)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Added confirmation / summary */}
      {added && outputs && selectedStrength && selectedSupply && (
        <div
          className="pw-motion-enter"
          role="status"
          aria-live="polite"
          style={{
            ['--pw-motion-enter-delay' as string]: '0ms',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: 'var(--pw-control-padding, 1rem)',
            borderRadius: 'var(--pw-radius, 8px)',
            background: 'var(--pw-color-success-surface, #dcfce7)',
            border: '1px solid var(--pw-color-success, #16a34a)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--pw-color-success, #16a34a)',
              fontWeight: 600,
              fontSize: 'var(--pw-font-size-body, 1rem)',
            }}
          >
            <span
              className="pw-motion-pop"
              aria-hidden
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                borderRadius: 999,
                background: 'var(--pw-color-success, #16a34a)',
                color: 'var(--pw-color-on-success, #ffffff)',
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            Added to your plan
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--pw-font-size-body, 1rem)',
              color: 'var(--pw-color-on-surface, #0f172a)',
              lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
            }}
          >
            <strong>{PRODUCT_NAME}</strong>
            {' · '}
            {selectedStrength.mg}
            {' · '}
            {selectedSupply.days}-day supply
            {' · '}
            {formatMoney(selectedSupply.price)}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              color: 'var(--pw-color-muted, #64748b)',
            }}
          >
            Continue with Next when you are ready. Checkout happens at the end — nothing is charged now.
          </p>
        </div>
      )}

      {!strengthId || !supplyId ? (
        <p
          className="pw-motion-enter"
          style={{
            ['--pw-motion-enter-delay' as string]: '480ms',
            margin: 0,
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            color: 'var(--pw-color-muted, #64748b)',
            textAlign: 'center',
          }}
        >
          {!strengthId && !supplyId
            ? 'Select a strength and supply to add this to your plan.'
            : !strengthId
              ? 'Select a strength to continue.'
              : 'Select a supply length to continue.'}
        </p>
      ) : null}
    </div>
  );
}