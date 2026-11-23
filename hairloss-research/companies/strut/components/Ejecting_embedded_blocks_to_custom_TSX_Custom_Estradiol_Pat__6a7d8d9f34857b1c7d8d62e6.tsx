import React, { useState, useEffect, useMemo } from 'react';

export const propSchema = {
  productName: {
    type: 'string',
    title: 'Product name',
    defaultValue: 'Estradiol Patch',
  },
  productImage: {
    type: 'image',
    title: 'Product image',
    defaultValue:
      'https://cdn.prod.website-files.com/6095ae7ee40374852364f71d/6a50d63b6f746eb1e78d77f5_Group%2025%20(1).png',
  },
  productId: {
    type: 'string',
    title: 'Product ID',
    defaultValue: 'estradiol-patch',
  },
  price30: {
    type: 'number',
    title: '30-day price',
    defaultValue: 99,
  },
  price90: {
    type: 'number',
    title: '90-day price',
    defaultValue: 219,
  },
  price150: {
    type: 'number',
    title: '150-day price',
    defaultValue: 299,
  },
};

export const outputSchema = {
  supplyDays: {
    type: 'number',
    title: 'Supply days',
    description: 'Selected supply length: 30, 90, or 150',
    required: true,
  },
  total: {
    type: 'number',
    title: 'Total today',
    description: 'Price for the selected supply tier',
  },
  productId: {
    type: 'string',
    title: 'Product ID',
  },
};

type SupplyOption = {
  days: 30 | 90 | 150;
  label: string;
  saveLine?: string;
  price: number;
};

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
      };
      flow?: {
        next: (answer?: unknown) => void;
      };
    };
  }
}

export default function BhrtProductSupply({
  productName = 'Estradiol Patch',
  productImage = 'https://cdn.prod.website-files.com/6095ae7ee40374852364f71d/6a50d63b6f746eb1e78d77f5_Group%2025%20(1).png',
  productId = 'estradiol-patch',
  price30 = 99,
  price90 = 219,
  price150 = 299,
  onChange,
}: {
  productName?: string;
  productImage?: string;
  productId?: string;
  price30?: number;
  price90?: number;
  price150?: number;
  onChange?: (outputs: {
    supplyDays: number;
    total: number;
    productId: string;
  }) => void;
}) {
  const [supplyDays, setSupplyDays] = useState<30 | 90 | 150>(90);
  const [adding, setAdding] = useState(false);
  const [justSelected, setJustSelected] = useState<number | null>(null);

  const options: SupplyOption[] = useMemo(
    () => [
      {
        days: 30,
        label: '30 day supply',
        price: price30,
      },
      {
        days: 90,
        label: '90 day supply',
        saveLine: 'Save $78 (26% off)',
        price: price90,
      },
      {
        days: 150,
        label: '150 day supply',
        saveLine: 'Save $196 (40% off)',
        price: price150,
      },
    ],
    [price30, price90, price150]
  );

  const selected = options.find((o) => o.days === supplyDays) ?? options[1];
  const totalToday = selected.price;

  useEffect(() => {
    onChange?.({
      supplyDays,
      total: totalToday,
      productId,
    });
  }, [supplyDays, totalToday, productId, onChange]);

  const handleSelectSupply = (days: 30 | 90 | 150) => {
    setSupplyDays(days);
    setJustSelected(days);
  };

  const handleAddToCart = () => {
    if (adding) return;
    setAdding(true);
    const variant = {
      name: 'Supply',
      value: `${supplyDays}-day`,
    };
    window.pathwai?.cart?.addItem({
      id: productId,
      name: productName,
      price: totalToday,
      quantity: 1,
      image: productImage || undefined,
      variants: [variant],
    });
    onChange?.({
      supplyDays,
      total: totalToday,
      productId,
    });
    window.setTimeout(() => {
      window.pathwai?.flow?.next(String(supplyDays));
      setAdding(false);
    }, 180);
  };

  const formatMoney = (n: number) =>
    '$' + (Number.isFinite(n) ? n.toFixed(n % 1 === 0 ? 0 : 2) : '0');

  const trustItems = ['Doctor consult', 'US licensed pharmacy'] as const;

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
        boxSizing: 'border-box',
      }}
    >
      {/* Product summary: thumbnail + name only */}
      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--pw-element-gap, 1.25rem)',
          '--pw-motion-enter-delay': '0ms',
        } as React.CSSProperties}
      >
        <div
          style={{
            width: 96,
            height: 96,
            minWidth: 96,
            minHeight: 96,
            flexShrink: 0,
            borderRadius: 'var(--pw-radius, 0.5rem)',
            background:
              'var(--pw-answer-media-bg, var(--pw-state-hover, #F1F0E8))',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
            boxSizing: 'border-box',
          }}
        >
          {productImage ? (
            <img
              src={productImage}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                display: 'block',
              }}
            />
          ) : (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--pw-color-muted, #71717a)"
              strokeWidth="1.5"
              aria-hidden
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          )}
        </div>
        <p
          style={{
            margin: 0,
            fontFamily:
              'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 600,
            lineHeight: 1.35,
            color: 'var(--pw-label-fg, #002021)',
            minWidth: 0,
          }}
        >
          {productName}
        </p>
      </div>

      {/* Supply radios */}
      <fieldset
        style={{
          margin: 0,
          padding: 0,
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}
      >
        <legend
          className="pw-motion-enter"
          style={{
            padding: 0,
            marginBottom: '0.35rem',
            fontFamily:
              'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--pw-color-muted, #71717a)',
            lineHeight: 1.3,
            '--pw-motion-enter-delay': '60ms',
          } as React.CSSProperties}
        >
          Supply
        </legend>

        {options.map((opt, index) => {
          const isSelected = supplyDays === opt.days;
          return (
            <button
              key={opt.days}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={
                'pw-motion-enter' +
                (justSelected === opt.days ? ' pw-motion-just-selected' : '')
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--pw-answer-gap, 0.75rem)',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                minHeight: 56,
                padding: 'var(--pw-control-padding, 1rem)',
                borderRadius: 'var(--pw-radius, 0.5rem)',
                border: isSelected
                  ? '2px solid var(--pw-color-brand, #161336)'
                  : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                background: isSelected
                  ? 'var(--pw-answer-surface-selected, #F1F0E8)'
                  : 'var(--pw-answer-surface, #ffffff)',
                boxShadow: isSelected
                  ? 'none'
                  : 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
                color: isSelected
                  ? 'var(--pw-answer-fg-selected, #1C1C21)'
                  : 'var(--pw-answer-fg, #1C1C21)',
                transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
                boxSizing: 'border-box',
                '--pw-motion-enter-delay': `${100 + index * 80}ms`,
              } as React.CSSProperties}
              onClick={() => handleSelectSupply(opt.days)}
            >
              <span
                aria-hidden
                style={{
                  width: 'var(--pw-answer-indicator-size, 18px)',
                  height: 'var(--pw-answer-indicator-size, 18px)',
                  borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                  border: isSelected
                    ? '5px solid var(--pw-answer-indicator-fill, #161336)'
                    : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                  background: isSelected
                    ? 'var(--pw-answer-indicator-check, #ffffff)'
                    : 'transparent',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                  display:
                    'var(--pw-answer-indicator-display, flex)' as unknown as undefined,
                }}
              />
              <span
                style={{
                  flex: '1 1 auto',
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <span
                  style={{
                    fontFamily:
                      'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                    fontSize:
                      'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                    fontWeight: 600,
                    lineHeight: 1.3,
                  }}
                >
                  {opt.label}
                </span>
                {opt.saveLine ? (
                  <span
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--pw-answer-subtext-fg, #545454)',
                      fontWeight: 400,
                      lineHeight: 1.35,
                    }}
                  >
                    {opt.saveLine}
                  </span>
                ) : null}
              </span>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 'var(--pw-font-size-body, 1rem)',
                  fontVariantNumeric: 'tabular-nums',
                  flexShrink: 0,
                }}
              >
                {formatMoney(opt.price)}
              </span>
            </button>
          );
        })}
      </fieldset>

      {/* Total + trust + CTA */}
      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          marginTop: '0.25rem',
          '--pw-motion-enter-delay': '340ms',
        } as React.CSSProperties}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--pw-color-muted, #71717a)',
            }}
          >
            Total today
          </span>
          <span
            style={{
              fontFamily:
                'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              fontSize: '1.5rem',
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--pw-label-fg, #002021)',
              letterSpacing: '-0.02em',
            }}
          >
            {formatMoney(totalToday)}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem 1.25rem',
          }}
        >
          {trustItems.map((item) => (
            <span
              key={item}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.875rem',
                lineHeight: 1.4,
                color: 'var(--pw-label-sublabel-fg, #545454)',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
                style={{ flexShrink: 0 }}
              >
                <circle
                  cx="8"
                  cy="8"
                  r="8"
                  fill="var(--pw-color-brand, #161336)"
                />
                <path
                  d="M4.5 8.2L6.8 10.5L11.5 5.5"
                  stroke="var(--pw-color-brand-contrast, #ffffff)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding}
          style={{
            width: '100%',
            minHeight: 52,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
            border: 'none',
            borderRadius:
              'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
            background: 'var(--pw-button-bg, #161336)',
            color: 'var(--pw-button-fg, #ffffff)',
            fontFamily:
              'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize:
              'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 600,
            cursor: adding ? 'wait' : 'pointer',
            opacity: adding
              ? ('var(--pw-state-disabled-opacity, 0.45)' as unknown as number)
              : 1,
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            transition: `opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
          }}
        >
          {adding ? (
            <>
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
              Adding…
            </>
          ) : (
            <>Add to cart →</>
          )}
        </button>
      </div>
    </div>
  );
}