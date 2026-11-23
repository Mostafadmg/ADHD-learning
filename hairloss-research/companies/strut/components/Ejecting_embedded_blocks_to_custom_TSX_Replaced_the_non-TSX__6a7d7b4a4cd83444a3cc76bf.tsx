import React, { useState, useEffect, useRef } from 'react';

const PRODUCT_NAME = 'Estradiol Oral Capsule (Compounded)';
const STRENGTHS = ['1mg', '2mg'] as const;
const SUPPLIES = [
  { days: 30, price: 69, priceId: '2203', saveLabel: null as string | null },
  { days: 90, price: 149, priceId: '2211', saveLabel: 'Save $58 (28% off)' },
  { days: 150, price: 199, priceId: '2216', saveLabel: 'Save $146 (42% off)' },
] as const;
const ESTRADIOL_PRICE_IDS = ['2203', '2211', '2216'] as const;

export const propSchema = {
  imgEstradiolCapsule: {
    type: 'image',
    title: 'Product image',
    defaultValue: '',
  },
  baseCheckoutUrl: {
    type: 'string',
    title: 'Base checkout URL',
    defaultValue: 'https://checkout.struthealth.com/female-bhrt',
  },
  ctaLabel: {
    type: 'string',
    title: 'CTA label',
    defaultValue: 'Add to cart →',
  },
};

export const outputSchema = {
  strength: {
    type: 'string',
    title: 'Strength',
    description: 'Selected strength: "1mg" or "2mg"',
    required: true,
  },
  supplyDays: {
    type: 'number',
    title: 'Supply days',
    description: 'Selected supply length in days: 30, 90, or 150',
    required: true,
  },
  priceId: {
    type: 'string',
    title: 'Price ID',
    description: 'Cart/price id for selected supply: "2203", "2211", or "2216"',
    required: true,
  },
  price: {
    type: 'number',
    title: 'Price',
    description: 'Selected supply price in USD',
    required: true,
  },
  productName: {
    type: 'string',
    title: 'Product name',
    description: 'Full product name',
  },
  addedToCart: {
    type: 'boolean',
    title: 'Added to cart',
    description: 'True after the item was added to the cart',
  },
};

type Strength = (typeof STRENGTHS)[number];
type SupplyOption = (typeof SUPPLIES)[number];
type Status = 'idle' | 'adding' | 'added';

export default function EstradiolOralCapsuleConfigurator({
  imgEstradiolCapsule = '',
  baseCheckoutUrl = 'https://checkout.struthealth.com/female-bhrt',
  ctaLabel = 'Add to cart →',
  onChange,
}: {
  imgEstradiolCapsule?: string;
  baseCheckoutUrl?: string;
  ctaLabel?: string;
  onChange?: (outputs: {
    strength: string;
    supplyDays: number;
    priceId: string;
    price: number;
    productName: string;
    addedToCart: boolean;
  }) => void;
}) {
  const [strength, setStrength] = useState<Strength>('1mg');
  const [supplyDays, setSupplyDays] = useState<number>(30);
  const [status, setStatus] = useState<Status>('idle');
  const [justSelectedStrength, setJustSelectedStrength] = useState<string | null>(null);
  const [justSelectedSupply, setJustSelectedSupply] = useState<number | null>(null);
  const strengthRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const supplyRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const supply: SupplyOption =
    SUPPLIES.find((s) => s.days === supplyDays) ?? SUPPLIES[0];

  useEffect(() => {
    onChange?.({
      strength,
      supplyDays: supply.days,
      priceId: supply.priceId,
      price: supply.price,
      productName: PRODUCT_NAME,
      addedToCart: status === 'added',
    });
  }, [strength, supply.days, supply.priceId, supply.price, status, onChange]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!justSelectedStrength) return;
    const el = strengthRefs.current[justSelectedStrength];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelectedStrength]);

  useEffect(() => {
    if (justSelectedSupply == null) return;
    const el = supplyRefs.current[justSelectedSupply];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelectedSupply]);

  const handleAdd = () => {
    if (status !== 'idle') return;
    setStatus('adding');

    const cart = window.pathwai?.cart;
    if (cart) {
      for (const id of ESTRADIOL_PRICE_IDS) {
        cart.removeItem(id);
      }
      cart.addItem({
        id: supply.priceId,
        name: `${PRODUCT_NAME} · ${strength} · ${supply.days}-day supply`,
        price: supply.price,
        quantity: 1,
        image: imgEstradiolCapsule || undefined,
        variants: [
          { name: 'Strength', value: strength },
          { name: 'Supply', value: `${supply.days}-day` },
          ...(baseCheckoutUrl
            ? [{ name: 'Checkout', value: baseCheckoutUrl }]
            : []),
        ],
      });
    }

    setStatus('added');
    advanceTimer.current = setTimeout(() => {
      window.pathwai?.flow?.next(supply.priceId);
    }, 350);
  };

  const disabled = status !== 'idle';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 617px)',
        margin: '0 auto',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-element-gap, 1.25rem)',
      }}
    >
      <div
        className="pw-motion-enter"
        style={{
          ['--pw-motion-enter-delay' as string]: '0ms',
          background: 'var(--pw-color-surface, #ffffff)',
          border: '1px solid var(--pw-color-border, #EFEFEC)',
          borderRadius: 'var(--pw-radius, 0.5rem)',
          boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Product header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            gap: 0,
            borderBottom: '1px solid var(--pw-color-border, #EFEFEC)',
          }}
        >
          <div
            style={{
              flex: '0 0 38%',
              maxWidth: 160,
              minHeight: 140,
              background: 'var(--pw-answer-surface-selected, #F1F0E8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--pw-control-padding, 1rem)',
            }}
          >
            {imgEstradiolCapsule ? (
              <img
                src={imgEstradiolCapsule}
                alt={PRODUCT_NAME}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 120,
                  objectFit: 'contain',
                }}
              />
            ) : (
              <div
                aria-hidden
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '999px',
                  background: 'var(--pw-color-brand, #161336)',
                  opacity: 0.12,
                }}
              />
            )}
          </div>

          <div
            style={{
              flex: 1,
              padding: 'var(--pw-control-padding, 1rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '0.35rem',
              minWidth: 0,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
                fontSize: 'clamp(1.15rem, 4vw, var(--pw-font-size-title, 1.75rem))',
                fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
                lineHeight: 'var(--pw-font-line-height-title, 1.2)' as unknown as number,
                color: 'var(--pw-label-fg, #002021)',
                letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
              }}
            >
              {PRODUCT_NAME}
            </h2>
          </div>
        </div>

        <div
          style={{
            padding: 'var(--pw-control-padding, 1rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 1.25rem)',
          }}
        >
          {/* Strength */}
          <div className="pw-motion-enter" style={{ ['--pw-motion-enter-delay' as string]: '60ms' }}>
            <p
              style={{
                margin: '0 0 0.65rem 0',
                fontSize: 'var(--pw-font-size-body, 1rem)',
                fontWeight: 600,
                color: 'var(--pw-label-fg, #002021)',
              }}
            >
              Strength
            </p>
            <div
              role="radiogroup"
              aria-label="Strength"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.65rem',
              }}
            >
              {STRENGTHS.map((opt, index) => {
                const selected = strength === opt;
                return (
                  <button
                    key={opt}
                    ref={(el) => {
                      strengthRefs.current[opt] = el;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={disabled}
                    className="pw-motion-enter"
                    onClick={() => {
                      if (disabled) return;
                      setStrength(opt);
                      setJustSelectedStrength(opt);
                    }}
                    style={{
                      ['--pw-motion-enter-delay' as string]: `${80 + index * 60}ms`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--pw-answer-gap, 0.75rem)',
                      width: '100%',
                      minHeight: 48,
                      padding: '0.75rem var(--pw-control-padding, 1rem)',
                      textAlign: 'center',
                      cursor: disabled ? 'default' : 'pointer',
                      borderRadius: 'var(--pw-radius, 0.5rem)',
                      border: selected
                        ? '2px solid var(--pw-color-brand, #161336)'
                        : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                      background: selected
                        ? 'var(--pw-answer-surface-selected, #F1F0E8)'
                        : 'var(--pw-answer-surface, #ffffff)',
                      color: selected
                        ? 'var(--pw-answer-fg-selected, #1C1C21)'
                        : 'var(--pw-answer-fg, #1C1C21)',
                      opacity: disabled
                        ? (Number('var(--pw-state-disabled-opacity, 0.45)') || 0.45)
                        : 1,
                      transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
                      fontFamily:
                        'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                      fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                      fontWeight: 600,
                      boxSizing: 'border-box',
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        display: 'var(--pw-answer-indicator-display, flex)' as unknown as string,
                        width: 'var(--pw-answer-indicator-size, 18px)',
                        height: 'var(--pw-answer-indicator-size, 18px)',
                        borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                        border: selected
                          ? 'none'
                          : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                        background: selected
                          ? 'var(--pw-answer-indicator-fill, #161336)'
                          : 'transparent',
                        flexShrink: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
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
                            display: 'var(--pw-answer-indicator-dot-display, flex)' as unknown as string,
                          }}
                        />
                      )}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Supply */}
          <div className="pw-motion-enter" style={{ ['--pw-motion-enter-delay' as string]: '140ms' }}>
            <p
              style={{
                margin: '0 0 0.65rem 0',
                fontSize: 'var(--pw-font-size-body, 1rem)',
                fontWeight: 600,
                color: 'var(--pw-label-fg, #002021)',
              }}
            >
              Supply
            </p>
            <div
              role="radiogroup"
              aria-label="Supply length"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              {SUPPLIES.map((opt, index) => {
                const selected = supply.days === opt.days;
                return (
                  <button
                    key={opt.priceId}
                    ref={(el) => {
                      supplyRefs.current[opt.days] = el;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={disabled}
                    className="pw-motion-enter"
                    onClick={() => {
                      if (disabled) return;
                      setSupplyDays(opt.days);
                      setJustSelectedSupply(opt.days);
                    }}
                    style={{
                      ['--pw-motion-enter-delay' as string]: `${160 + index * 70}ms`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--pw-answer-gap, 0.75rem)',
                      width: '100%',
                      textAlign: 'left',
                      cursor: disabled ? 'default' : 'pointer',
                      minHeight: 56,
                      padding: 'var(--pw-control-padding, 1rem)',
                      borderRadius: 'var(--pw-radius, 0.5rem)',
                      border: selected
                        ? '2px solid var(--pw-color-brand, #161336)'
                        : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                      background: selected
                        ? 'var(--pw-answer-surface-selected, #F1F0E8)'
                        : 'var(--pw-answer-surface, #ffffff)',
                      color: selected
                        ? 'var(--pw-answer-fg-selected, #1C1C21)'
                        : 'var(--pw-answer-fg, #1C1C21)',
                      opacity: disabled
                        ? (Number('var(--pw-state-disabled-opacity, 0.45)') || 0.45)
                        : 1,
                      transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
                      fontFamily:
                        'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                      fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                      fontWeight: 'var(--pw-answer-font-weight, 400)' as unknown as number,
                      boxSizing: 'border-box',
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        display: 'var(--pw-answer-indicator-display, flex)' as unknown as string,
                        width: 'var(--pw-answer-indicator-size, 18px)',
                        height: 'var(--pw-answer-indicator-size, 18px)',
                        borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                        border: selected
                          ? 'none'
                          : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                        background: selected
                          ? 'var(--pw-answer-indicator-fill, #161336)'
                          : 'transparent',
                        flexShrink: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
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
                            display: 'var(--pw-answer-indicator-dot-display, flex)' as unknown as string,
                          }}
                        />
                      )}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontWeight: 600 }}>
                        {opt.days}-day supply
                      </span>
                      {opt.saveLabel ? (
                        <span
                          style={{
                            display: 'block',
                            marginTop: 2,
                            fontSize: 'var(--pw-font-size-caption, 0.85rem)',
                            fontWeight: 600,
                            color: 'var(--pw-color-brand, #161336)',
                          }}
                        >
                          {opt.saveLabel}
                        </span>
                      ) : null}
                    </span>
                    <span
                      style={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        color: 'var(--pw-color-on-surface, #1C1C21)',
                      }}
                    >
                      ${opt.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trust row */}
          <div
            className="pw-motion-enter"
            style={{
              ['--pw-motion-enter-delay' as string]: '320ms',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem 1.25rem',
            }}
          >
            {['Doctor consult included', 'US-licensed pharmacy'].map((line) => (
              <div
                key={line}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: 'var(--pw-font-size-caption, 0.85rem)',
                  color: 'var(--pw-label-sublabel-fg, #545454)',
                  lineHeight: 1.35,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    background: 'var(--pw-answer-surface-selected, #F1F0E8)',
                    color: 'var(--pw-color-brand, #161336)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
                {line}
              </div>
            ))}
          </div>

          {/* Total today */}
          <div
            className="pw-motion-enter"
            style={{
              ['--pw-motion-enter-delay' as string]: '360ms',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '0.75rem',
              flexWrap: 'wrap',
              paddingTop: '0.25rem',
              borderTop: '1px solid var(--pw-color-border, #EFEFEC)',
            }}
          >
            <span
              style={{
                fontSize: 'var(--pw-font-size-body, 1rem)',
                color: 'var(--pw-label-sublabel-fg, #545454)',
                fontWeight: 500,
              }}
            >
              Total today
            </span>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: 'var(--pw-label-fg, #002021)',
                  letterSpacing: '-0.02em',
                }}
              >
                ${supply.price}
              </span>
              <span
                style={{
                  display: 'block',
                  marginTop: 2,
                  fontSize: 'var(--pw-font-size-caption, 0.85rem)',
                  color: 'var(--pw-color-muted, #71717a)',
                }}
              >
                {strength} · {supply.days}-day supply
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={disabled}
            className="pw-motion-enter"
            style={{
              ['--pw-motion-enter-delay' as string]: '400ms',
              width: '100%',
              minHeight: 52,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
              border: 'none',
              borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
              background: 'var(--pw-button-bg, #161336)',
              color: 'var(--pw-button-fg, #ffffff)',
              fontFamily:
                'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
              fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
              fontWeight: 600,
              cursor: status === 'idle' ? 'pointer' : 'default',
              opacity: status === 'adding' ? 0.85 : 1,
              boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
              transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, #8399BF)`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))';
            }}
          >
            {status === 'adding' && (
              <span
                className="pw-motion-spin"
                aria-hidden
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  border: '2px solid currentColor',
                  borderRightColor: 'transparent',
                  display: 'inline-block',
                }}
              />
            )}
            {status === 'added' && (
              <span className="pw-motion-pop" aria-hidden>
                ✓
              </span>
            )}
            {status === 'idle' && ctaLabel}
            {status === 'adding' && 'Adding…'}
            {status === 'added' && 'Added to cart'}
          </button>

          <p
            style={{
              margin: 0,
              textAlign: 'center',
              fontSize: 'var(--pw-font-size-caption, 0.8rem)',
              color: 'var(--pw-color-muted, #71717a)',
            }}
          >
            Secure checkout · HSA/FSA eligible where available
          </p>
        </div>
      </div>
    </div>
  );
}