import React, { useState, useEffect, useMemo, useRef } from 'react';

export const propSchema = {
  productName: {
    type: 'string',
    title: 'Product name',
    defaultValue: 'Progesterone E4M Oral Capsule (compounded)',
  },
  productForm: {
    type: 'string',
    title: 'Form / subtitle',
    defaultValue: 'Oral capsule',
  },
  productImage: {
    type: 'image',
    title: 'Product image',
    defaultValue:
      'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/image-1784145662212-2e98c18fe707a756.png',
  },
};

export const outputSchema = {
  productName: {
    type: 'string',
    title: 'Product name',
    description: 'Full product title added to cart',
    required: true,
  },
  strength: {
    type: 'string',
    title: 'Strength',
    description: 'Selected strength value, e.g. "100mg"',
    required: true,
  },
  supplyDays: {
    type: 'number',
    title: 'Supply days',
    description: '30, 90, or 150',
    required: true,
  },
  priceId: {
    type: 'string',
    title: 'Price ID',
    description: 'Cart/item price id: "2154" | "2209" | "2214"',
    required: true,
  },
  unitPrice: {
    type: 'number',
    title: 'Unit price',
    description: 'Price for the selected supply',
  },
  total: {
    type: 'number',
    title: 'Line total',
    description: 'Computed line total for selected supply',
  },
};

const STRENGTHS = [
  { value: '100mg', label: '100mg' },
  { value: '200mg', label: '200mg' },
] as const;

const SUPPLIES = [
  {
    days: 30,
    label: '30 day supply',
    price: 69,
    priceId: '2154',
    saveLine: null as string | null,
  },
  {
    days: 90,
    label: '90 day supply',
    price: 149,
    priceId: '2209',
    saveLine: 'Save $58 (28% off)',
  },
  {
    days: 150,
    label: '150 day supply',
    price: 199,
    priceId: '2214',
    saveLine: 'Save $146 (42% off)',
  },
] as const;

export default function ProgesteroneProductCard({
  productName = 'Progesterone E4M Oral Capsule (compounded)',
  productForm = 'Oral capsule',
  productImage = 'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/image-1784145662212-2e98c18fe707a756.png',
  onChange,
}: {
  productName?: string;
  productForm?: string;
  productImage?: string;
  onChange?: (outputs: {
    productName: string;
    strength: string;
    supplyDays: number;
    priceId: string;
    unitPrice: number;
    total: number;
  }) => void;
}) {
  const [strength, setStrength] = useState<string>('100mg');
  const [supplyDays, setSupplyDays] = useState<number>(30);
  const [justStrength, setJustStrength] = useState<string | null>(null);
  const [justSupply, setJustSupply] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const strengthRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const supplyRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const selectedSupply = useMemo(
    () => SUPPLIES.find((s) => s.days === supplyDays) ?? SUPPLIES[0],
    [supplyDays]
  );

  const unitPrice = selectedSupply.price;
  const total = unitPrice;
  const priceId = selectedSupply.priceId;

  useEffect(() => {
    onChange?.({
      productName,
      strength,
      supplyDays,
      priceId,
      unitPrice,
      total,
    });
  }, [productName, strength, supplyDays, priceId, unitPrice, total, onChange]);

  useEffect(() => {
    if (!justStrength) return;
    const el = strengthRefs.current[justStrength];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justStrength]);

  useEffect(() => {
    if (justSupply == null) return;
    const el = supplyRefs.current[justSupply];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSupply]);

  const handleAdd = () => {
    const cart = window.pathwai?.cart;
    if (cart) {
      const existing = cart.getItems().filter((item) => item.name === productName);
      existing.forEach((item) => {
        cart.removeItem(item.id, item.variants);
      });
      cart.addItem({
        id: priceId,
        name: productName,
        price: unitPrice,
        quantity: 1,
        image: productImage || undefined,
        variants: [
          { name: 'Strength', value: strength },
          { name: 'Supply', value: `${supplyDays}-day` },
        ],
      });
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
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
      {/* Product identity chip */}
      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--pw-answer-gap, 0.875rem)',
          padding: 'var(--pw-control-padding, 1rem)',
          background: 'var(--pw-answer-surface-selected, #F1F0E8)',
          borderRadius: 'var(--pw-radius, 0.5rem)',
          border: '1px solid var(--pw-color-border, #EFEFEC)',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            flexShrink: 0,
            borderRadius: 'var(--pw-radius, 0.5rem)',
            background: 'var(--pw-answer-media-bg, #E8EEF6)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {productImage ? (
            <img
              src={productImage}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect
                x="7"
                y="3"
                width="10"
                height="18"
                rx="2"
                stroke="var(--pw-color-brand, #161336)"
                strokeWidth="1.5"
              />
              <path d="M7 8h10" stroke="var(--pw-color-brand, #161336)" strokeWidth="1.5" />
            </svg>
          )}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 600,
              lineHeight: 1.35,
              color: 'var(--pw-label-fg, #002021)',
            }}
          >
            {productName}
          </div>
          <div
            style={{
              marginTop: 2,
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              color: 'var(--pw-label-sublabel-fg, #545454)',
              fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
            }}
          >
            {productForm}
          </div>
        </div>
      </div>

      {/* Strength */}
      <div
        className="pw-motion-enter"
        style={{ ['--pw-motion-enter-delay' as string]: '80ms' }}
      >
        <div
          style={{
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 600,
            color: 'var(--pw-label-fg, #002021)',
            marginBottom: '0.625rem',
          }}
        >
          Strength
        </div>
        <div
          role="radiogroup"
          aria-label="Strength"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}
        >
          {STRENGTHS.map((opt) => {
            const selected = strength === opt.value;
            return (
              <button
                key={opt.value}
                ref={(el) => {
                  strengthRefs.current[opt.value] = el;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                className={
                  selected && justStrength === opt.value
                    ? 'pw-motion-just-selected'
                    : undefined
                }
                onClick={() => {
                  setStrength(opt.value);
                  setJustStrength(opt.value);
                }}
                style={{
                  minHeight: 44,
                  minWidth: 88,
                  padding: '0.625rem 1.125rem',
                  borderRadius: 'var(--pw-radius, 0.5rem)',
                  border: selected
                    ? '2px solid var(--pw-color-brand, #161336)'
                    : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                  background: selected ? '#F3F4F6' : 'var(--pw-answer-surface, #ffffff)',
                  color: 'var(--pw-answer-fg, #1C1C21)',
                  fontFamily:
                    'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                  fontSize:
                    'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                  fontWeight: selected ? 600 : 500,
                  cursor: 'pointer',
                  transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, ease), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, ease)`,
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Supply */}
      <div
        className="pw-motion-enter"
        style={{ ['--pw-motion-enter-delay' as string]: '140ms' }}
      >
        <div
          style={{
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 600,
            color: 'var(--pw-label-fg, #002021)',
            marginBottom: '0.625rem',
          }}
        >
          Supply
        </div>
        <div
          role="radiogroup"
          aria-label="Supply"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}
        >
          {SUPPLIES.map((opt) => {
            const selected = supplyDays === opt.days;
            return (
              <button
                key={opt.days}
                ref={(el) => {
                  supplyRefs.current[opt.days] = el;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                className={
                  selected && justSupply === opt.days
                    ? 'pw-motion-just-selected'
                    : undefined
                }
                onClick={() => {
                  setSupplyDays(opt.days);
                  setJustSupply(opt.days);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  minHeight: 56,
                  padding: 'var(--pw-control-padding, 1rem)',
                  borderRadius: 'var(--pw-radius, 0.5rem)',
                  border: selected
                    ? '2px solid var(--pw-color-brand, #161336)'
                    : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                  background: selected
                    ? 'var(--pw-answer-surface-selected, #F1F0E8)'
                    : 'var(--pw-answer-surface, #ffffff)',
                  color: 'var(--pw-answer-fg, #1C1C21)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  boxShadow: selected
                    ? 'none'
                    : 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
                  transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, ease), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, ease)`,
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    minWidth: 0,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 'var(--pw-answer-indicator-size, 18px)',
                      height: 'var(--pw-answer-indicator-size, 18px)',
                      borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                      border: selected
                        ? '5px solid var(--pw-answer-indicator-fill, #161336)'
                        : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                      background: 'var(--pw-color-surface, #ffffff)',
                      flexShrink: 0,
                      boxSizing: 'border-box',
                    }}
                  />
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: selected ? 600 : 500,
                        fontSize: 'var(--pw-font-size-body, 1rem)',
                        lineHeight: 1.3,
                      }}
                    >
                      {opt.label}
                    </span>
                    {opt.saveLine ? (
                      <span
                        style={{
                          fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
                          fontWeight: 500,
                          color: 'var(--pw-label-sublabel-fg, #545454)',
                          lineHeight: 1.3,
                        }}
                      >
                        {opt.saveLine}
                      </span>
                    ) : null}
                  </span>
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 'var(--pw-font-size-body, 1rem)',
                    flexShrink: 0,
                    color: 'var(--pw-label-fg, #002021)',
                  }}
                >
                  ${opt.price}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust */}
      <div
        className="pw-motion-enter"
        style={{
          ['--pw-motion-enter-delay' as string]: '200ms',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem 1.25rem',
        }}
      >
        {['Doctor consult', 'US licensed pharmacy'].map((label) => (
          <span
            key={label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              color: 'var(--pw-label-sublabel-fg, #545454)',
              lineHeight: 1.4,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="8" cy="8" r="7" fill="var(--pw-color-success-surface, #ecfdf5)" />
              <path
                d="M5 8.2L7 10.2L11 5.8"
                stroke="var(--pw-color-success, #16a34a)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {label}
          </span>
        ))}
      </div>

      {/* TOTAL TODAY */}
      <div
        className="pw-motion-enter"
        style={{
          ['--pw-motion-enter-delay' as string]: '240ms',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '1rem',
          paddingTop: '0.25rem',
          borderTop: '1px solid var(--pw-color-border, #EFEFEC)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
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
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--pw-label-fg, #002021)',
            lineHeight: 1.2,
          }}
        >
          ${total}
        </span>
      </div>

      {/* CTA */}
      <button
        type="button"
        className="pw-motion-enter"
        style={{
          ['--pw-motion-enter-delay' as string]: '280ms',
          width: '100%',
          minHeight: 52,
          padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
          borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
          border: 'none',
          background: '#0F172A',
          color: '#ffffff',
          fontFamily:
            'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
          fontSize:
            'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: `opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, ease)`,
        }}
        onClick={handleAdd}
      >
        {added ? (
          <>
            <span className="pw-motion-pop" aria-hidden>
              ✓
            </span>
            Added to cart
          </>
        ) : (
          'Add to cart →'
        )}
      </button>
    </div>
  );
}