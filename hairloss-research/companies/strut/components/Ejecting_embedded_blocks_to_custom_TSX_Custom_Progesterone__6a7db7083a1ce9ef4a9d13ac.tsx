import React, { useState, useEffect, useRef } from 'react';

export const propSchema = {
  productName: {
    type: 'string',
    title: 'Product name',
    defaultValue: 'Progesterone E4M Oral Capsule (compounded)',
  },
  productImage: {
    type: 'image',
    title: 'Product image',
    defaultValue:
      'https://cdn.prod.website-files.com/6095ae7ee40374852364f71d/6a50d71de6a83463d83c55f5_Group%20222.png',
  },
  subtitle: {
    type: 'string',
    title: 'Subtitle',
    defaultValue: '',
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
    description: 'Selected strength: "100mg" or "200mg"',
    required: true,
  },
  supply: {
    type: 'string',
    title: 'Supply',
    description: 'Selected supply: "30" | "90" | "150"',
    required: true,
  },
  price: {
    type: 'number',
    title: 'Price',
    description: 'Total today in USD for the selected supply',
    required: true,
  },
  productId: {
    type: 'string',
    title: 'Product ID',
    description: 'Stable product identifier for cart/routing',
    required: true,
  },
};

type Strength = '100mg' | '200mg';
type SupplyDays = '30' | '90' | '150';

type Outputs = {
  strength: Strength;
  supply: SupplyDays;
  price: number;
  productId: string;
};

const PRODUCT_ID = 'progesterone-e4m-oral-capsule';

const STRENGTHS: Strength[] = ['100mg', '200mg'];

const SUPPLY_OPTIONS: {
  days: SupplyDays;
  label: string;
  price: number;
  savings?: string;
}[] = [
  { days: '30', label: '30 day supply', price: 69 },
  { days: '90', label: '90 day supply', price: 149, savings: 'Save $58 (28% off)' },
  { days: '150', label: '150 day supply', price: 199, savings: 'Save $146 (42% off)' },
];

const TRUST_ITEMS = ['Doctor consult', 'US licensed pharmacy'] as const;

export default function ProgesteronePricingSelector({
  productName = 'Progesterone E4M Oral Capsule (compounded)',
  productImage = 'https://cdn.prod.website-files.com/6095ae7ee40374852364f71d/6a50d71de6a83463d83c55f5_Group%20222.png',
  subtitle = '',
  ctaLabel = 'Add to cart →',
  onChange,
  onAnswer,
}: {
  productName?: string;
  productImage?: string;
  subtitle?: string;
  ctaLabel?: string;
  onChange?: (outputs: Outputs) => void;
  onAnswer?: (outputs: Outputs) => void;
}) {
  const [strength, setStrength] = useState<Strength>('100mg');
  const [supply, setSupply] = useState<SupplyDays>('30');
  const [justSelectedStrength, setJustSelectedStrength] = useState<string | null>(null);
  const [justSelectedSupply, setJustSelectedSupply] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const strengthRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const supplyRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selectedSupply = SUPPLY_OPTIONS.find((o) => o.days === supply) ?? SUPPLY_OPTIONS[0];
  const price = selectedSupply.price;

  const emit = (next: Outputs) => {
    onChange?.(next);
    onAnswer?.(next);
  };

  useEffect(() => {
    emit({
      strength,
      supply,
      price,
      productId: PRODUCT_ID,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strength, supply, price]);

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

  const handleStrength = (value: Strength) => {
    setStrength(value);
    setJustSelectedStrength(value);
  };

  const handleSupply = (days: SupplyDays) => {
    setSupply(days);
    setJustSelectedSupply(days);
  };

  const handleAddToCart = () => {
    if (adding) return;
    setAdding(true);

    const outputs: Outputs = {
      strength,
      supply,
      price,
      productId: PRODUCT_ID,
    };
    emit(outputs);

    window.pathwai?.cart?.addItem({
      id: PRODUCT_ID,
      name: `${productName} · ${strength} · ${selectedSupply.label}`,
      price,
      quantity: 1,
      image: productImage || undefined,
      variants: [
        { name: 'Strength', value: strength },
        { name: 'Supply', value: selectedSupply.label },
      ],
    });

    window.pathwai?.flow?.next(outputs);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-element-gap, 1.25rem)',
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 617px)',
        margin: '0 auto',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
        boxSizing: 'border-box',
      }}
    >
      {/* Product header */}
      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--pw-element-gap, 1.25rem)',
          '--pw-motion-enter-delay': '0ms',
        } as React.CSSProperties}
      >
        {productImage ? (
          <div
            style={{
              flexShrink: 0,
              width: 72,
              height: 72,
              borderRadius: 'var(--pw-radius, 0.5rem)',
              background: 'var(--pw-color-surface, #ffffff)',
              border: '1px solid var(--pw-color-border, #EFEFEC)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={productImage}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
        ) : null}
        <div style={{ minWidth: 0, flex: 1 }}>
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
            {productName}
          </h1>
          {subtitle ? (
            <p
              style={{
                margin: '6px 0 0',
                fontSize: 'var(--pw-font-size-body, 1rem)',
                fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
                color: 'var(--pw-label-sublabel-fg, #545454)',
                lineHeight: 'var(--pw-font-line-height-body, 1.55)',
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {/* Strength */}
      <div
        className="pw-motion-enter"
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            '--pw-motion-enter-delay': '80ms',
          } as React.CSSProperties
        }
      >
        <div
          style={{
            fontSize: 'var(--pw-font-size-caption, 0.8rem)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--pw-label-sublabel-fg, #545454)',
          }}
        >
          Strength
        </div>
        <div
          role="radiogroup"
          aria-label="Strength"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
          }}
        >
          {STRENGTHS.map((value) => {
            const selected = strength === value;
            return (
              <button
                key={value}
                ref={(el) => {
                  strengthRefs.current[value] = el;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => handleStrength(value)}
                style={{
                  minHeight: 48,
                  padding: '0.75rem 1rem',
                  borderRadius: '999px',
                  border: selected
                    ? '1.5px solid var(--pw-color-brand, #161336)'
                    : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                  background: selected
                    ? 'var(--pw-color-surface, #ffffff)'
                    : 'var(--pw-state-hover, #F1F0E8)',
                  color: 'var(--pw-answer-fg, #1C1C21)',
                  fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                  fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                  fontWeight: selected ? 600 : 500,
                  cursor: 'pointer',
                  transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
                  boxShadow: selected ? 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))' : 'none',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, #8399BF)`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = selected
                    ? 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))'
                    : 'none';
                }}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      {/* Supply */}
      <div
        className="pw-motion-enter"
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            '--pw-motion-enter-delay': '160ms',
          } as React.CSSProperties
        }
      >
        <div
          style={{
            fontSize: 'var(--pw-font-size-caption, 0.8rem)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--pw-label-sublabel-fg, #545454)',
          }}
        >
          Supply
        </div>
        <div
          role="radiogroup"
          aria-label="Supply"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {SUPPLY_OPTIONS.map((option, index) => {
            const selected = supply === option.days;
            return (
              <button
                key={option.days}
                ref={(el) => {
                  supplyRefs.current[option.days] = el;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                className="pw-motion-enter"
                onClick={() => handleSupply(option.days)}
                style={
                  {
                    '--pw-motion-enter-delay': `${180 + index * 80}ms`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--pw-answer-gap, 0.875rem)',
                    width: '100%',
                    minHeight: 64,
                    padding: 'var(--pw-control-padding, 1rem)',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: 'var(--pw-radius, 0.5rem)',
                    border: selected
                      ? '1.5px solid var(--pw-color-brand, #161336)'
                      : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                    background: selected
                      ? 'var(--pw-answer-surface-selected, #F1F0E8)'
                      : 'var(--pw-answer-surface, #ffffff)',
                    color: selected
                      ? 'var(--pw-answer-fg-selected, var(--pw-color-on-surface, #1C1C21))'
                      : 'var(--pw-answer-fg, #1C1C21)',
                    transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
                    outline: 'none',
                  } as React.CSSProperties
                }
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, #8399BF)`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Radio indicator */}
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 'var(--pw-answer-indicator-size, 18px)',
                    height: 'var(--pw-answer-indicator-size, 18px)',
                    borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                    border: selected
                      ? '2px solid var(--pw-answer-indicator-fill, #161336)'
                      : '2px solid var(--pw-answer-border, #E0E0E0)',
                    background: selected
                      ? 'var(--pw-answer-indicator-fill, #161336)'
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  {selected ? (
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
                  ) : null}
                </span>

                {/* Label + savings */}
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                      fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                      fontWeight: selected ? 600 : 500,
                      lineHeight: 1.35,
                    }}
                  >
                    {option.label}
                  </span>
                  {option.savings ? (
                    <span
                      style={{
                        display: 'block',
                        marginTop: 2,
                        fontFamily: 'var(--pw-answer-subtext-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                        fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                        fontWeight: 'var(--pw-answer-subtext-font-weight, 400)' as unknown as number,
                        color: 'var(--pw-answer-subtext-fg, var(--pw-label-sublabel-fg, var(--pw-color-muted, #545454)))',
                        lineHeight: 1.35,
                      }}
                    >
                      {option.savings}
                    </span>
                  ) : null}
                </span>

                {/* Price */}
                <span
                  style={{
                    flexShrink: 0,
                    fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                    fontSize: 'var(--pw-font-size-body, 1rem)',
                    fontWeight: 600,
                    color: 'var(--pw-color-on-surface, #1C1C21)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  ${option.price}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust row */}
      <div
        className="pw-motion-enter"
        style={
          {
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.75rem 1.25rem',
            '--pw-motion-enter-delay': '420ms',
          } as React.CSSProperties
        }
      >
        {TRUST_ITEMS.map((item) => (
          <div
            key={item}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              color: 'var(--pw-label-sublabel-fg, #545454)',
              lineHeight: 1.3,
            }}
          >
            <span
              aria-hidden
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 16,
                height: 16,
                borderRadius: 999,
                background: 'var(--pw-state-hover, #F1F0E8)',
                color: 'var(--pw-color-brand, #161336)',
                flexShrink: 0,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M2 5.2L4.1 7.2L8 2.8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {item}
          </div>
        ))}
      </div>

      {/* Total today */}
      <div
        className="pw-motion-enter"
        style={
          {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            borderTop: '1px solid var(--pw-color-border, #EFEFEC)',
            paddingTop: '1rem',
            '--pw-motion-enter-delay': '480ms',
          } as React.CSSProperties
        }
      >
        <span
          style={{
            fontSize: 'var(--pw-font-size-caption, 0.8rem)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--pw-label-sublabel-fg, #545454)',
          }}
        >
          Total today
        </span>
        <span
          style={{
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: '1.375rem',
            fontWeight: 600,
            color: 'var(--pw-color-on-surface, #1C1C21)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          ${price}
        </span>
      </div>

      {/* CTA */}
      <button
        type="button"
        className="pw-motion-enter"
        onClick={handleAddToCart}
        disabled={adding}
        style={
          {
            '--pw-motion-enter-delay': '540ms',
            width: '100%',
            minHeight: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
            border: 'none',
            borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
            background: 'var(--pw-button-bg, #161336)',
            color: 'var(--pw-button-fg, #ffffff)',
            fontFamily: 'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 600,
            cursor: adding ? 'wait' : 'pointer',
            opacity: adding ? 'var(--pw-state-disabled-opacity, 0.45)' : 1,
            transition: `opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
            outline: 'none',
          } as React.CSSProperties
        }
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, #8399BF)`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {adding ? (
          <>
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
            Adding…
          </>
        ) : (
          ctaLabel
        )}
      </button>
    </div>
  );
}