import React, { useState, useEffect, useRef } from 'react';

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
      'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/image-1784145684303-cc15d83f2164a6ca.png',
  },
  productDescription: {
    type: 'string',
    title: 'Description',
    defaultValue:
      'Transdermal bioidentical estradiol through the skin, changed on a regular schedule.',
  },
  ctaLabel: {
    type: 'string',
    title: 'CTA label',
    defaultValue: 'Add to cart & continue',
  },
};

export const outputSchema = {
  supplyDays: {
    type: 'number',
    title: 'Supply days',
    description: 'Selected supply length in days: 30, 90, or 150',
    required: true,
  },
  priceId: {
    type: 'string',
    title: 'Price ID',
    description: 'Selected Stripe/price id: "2204" | "2212" | "2217"',
    required: true,
  },
  productId: {
    type: 'string',
    title: 'Product ID',
    description: 'Stable product id: "estradiol-patch"',
    required: true,
  },
  productName: {
    type: 'string',
    title: 'Product name',
    description: 'Display name of the product',
    required: true,
  },
};

type SupplyOption = {
  supplyDays: number;
  priceId: string;
  label: string;
  helper: string;
  badge?: string;
};

const SUPPLY_OPTIONS: SupplyOption[] = [
  {
    supplyDays: 30,
    priceId: '2204',
    label: '30-day supply',
    helper: 'One month of patches',
  },
  {
    supplyDays: 90,
    priceId: '2212',
    label: '90-day supply',
    helper: 'Three months · most common choice',
    badge: 'Popular',
  },
  {
    supplyDays: 150,
    priceId: '2217',
    label: '150-day supply',
    helper: 'Five months · fewer refills',
    badge: 'Best value',
  },
];

const PRODUCT_ID = 'estradiol-patch';

export default function EstradiolPatchSupplySelector({
  productName = 'Estradiol Patch',
  productImage = 'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/image-1784145684303-cc15d83f2164a6ca.png',
  productDescription = 'Transdermal bioidentical estradiol through the skin, changed on a regular schedule.',
  ctaLabel = 'Add to cart & continue',
  onChange,
}: {
  productName?: string;
  productImage?: string;
  productDescription?: string;
  ctaLabel?: string;
  onChange?: (outputs: {
    supplyDays: number;
    priceId: string;
    productId: string;
    productName: string;
  }) => void;
}) {
  const [selectedPriceId, setSelectedPriceId] = useState<string>('2212');
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selected = SUPPLY_OPTIONS.find((o) => o.priceId === selectedPriceId) ?? SUPPLY_OPTIONS[1];

  useEffect(() => {
    onChange?.({
      supplyDays: selected.supplyDays,
      priceId: selected.priceId,
      productId: PRODUCT_ID,
      productName,
    });
  }, [selected.supplyDays, selected.priceId, productName, onChange]);

  useEffect(() => {
    if (!justSelected) return;
    const el = optionRefs.current[justSelected];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelected]);

  const handleSelect = (priceId: string) => {
    if (isSubmitting) return;
    setSelectedPriceId(priceId);
    setJustSelected(priceId);
    setError(null);
  };

  const writeCart = (option: SupplyOption) => {
    const flow = (window as any).pathwai?.flow;
    const cart = (window as any).pathwai?.cart;

    const item = {
      id: option.priceId,
      name: `${productName} · ${option.label}`,
      price: 0,
      quantity: 1,
      image: productImage || undefined,
      variants: [
        { name: 'Supply', value: option.label },
        { name: 'productId', value: PRODUCT_ID },
      ],
    };

    try {
      if (cart?.clearCart) cart.clearCart();
      if (cart?.addItem) {
        cart.addItem(item);
      } else if (typeof cart?.setItems === 'function') {
        cart.setItems([item]);
      }

      if (typeof flow?.setCart === 'function') {
        flow.setCart({
          item_ids: [option.priceId],
          items: [item],
        });
      }
    } catch {
      // Cart may be unavailable in editor preview — still allow continue.
    }
  };

  const handleContinue = () => {
    if (!selected || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      writeCart(selected);
      onChange?.({
        supplyDays: selected.supplyDays,
        priceId: selected.priceId,
        productId: PRODUCT_ID,
        productName,
      });
      (window as any).pathwai?.flow?.next(selected.priceId);
    } catch {
      setError('Something went wrong adding this to your cart. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 617px)',
        margin: '0 auto',
        boxSizing: 'border-box',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
      }}
    >
      {/* Product strip */}
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '0ms',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 'var(--pw-element-gap, 1.25rem)',
            padding: 'var(--pw-control-padding, 1rem)',
            background: 'var(--pw-color-surface, #ffffff)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
          } as React.CSSProperties
        }
      >
        <div
          style={{
            flexShrink: 0,
            width: 88,
            height: 88,
            borderRadius: 'var(--pw-radius, 0.5rem)',
            overflow: 'hidden',
            background: 'var(--pw-answer-media-bg, #F1F0E8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {productImage ? (
            <img
              src={productImage}
              alt={productName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          ) : null}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--pw-font-size-caption, 0.8rem)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase' as const,
              color: 'var(--pw-color-muted, #71717a)',
              fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            }}
          >
            Your medication
          </p>
          <h1
            style={{
              margin: '0.35rem 0 0.4rem',
              fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-title, 1.75rem)',
              fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
              lineHeight: 'var(--pw-font-line-height-title, 1.2)' as unknown as number,
              letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
              color: 'var(--pw-label-fg, #002021)',
            }}
          >
            {productName}
          </h1>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
              lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
              color: 'var(--pw-label-sublabel-fg, #545454)',
            }}
          >
            {productDescription}
          </p>
        </div>
      </div>

      {/* Supply length */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 1.25rem)',
        }}
      >
        <div
          className="pw-motion-enter"
          style={{ '--pw-motion-enter-delay': '80ms' } as React.CSSProperties}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, Figtree, system-ui, sans-serif))',
              fontSize: '1.125rem',
              fontWeight: 600,
              lineHeight: 1.3,
              color: 'var(--pw-label-fg, #002021)',
            }}
          >
            How much supply do you need?
          </h2>
          <p
            style={{
              margin: '0.35rem 0 0',
              fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-body, 1rem)',
              color: 'var(--pw-label-sublabel-fg, #545454)',
              lineHeight: 1.5,
            }}
          >
            Choose one option. You can adjust this later with your care team if needed.
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="Estradiol Patch supply length"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {SUPPLY_OPTIONS.map((option, index) => {
            const isSelected = option.priceId === selectedPriceId;
            return (
              <button
                key={option.priceId}
                ref={(el) => {
                  optionRefs.current[option.priceId] = el;
                }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isSubmitting}
                className="pw-motion-enter"
                onClick={() => handleSelect(option.priceId)}
                style={
                  {
                    '--pw-motion-enter-delay': `${120 + index * 90}ms`,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 'var(--pw-answer-gap, 0.875rem)',
                    width: '100%',
                    minHeight: 64,
                    padding: 'var(--pw-control-padding, 1rem)',
                    textAlign: 'left',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting
                      ? ('var(--pw-state-disabled-opacity, 0.45)' as unknown as number)
                      : 1,
                    boxSizing: 'border-box',
                    borderRadius: 'var(--pw-radius, 0.5rem)',
                    border: isSelected
                      ? '2px solid var(--pw-color-brand, #161336)'
                      : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                    background: isSelected
                      ? 'var(--pw-answer-surface-selected, #F1F0E8)'
                      : 'var(--pw-answer-surface, #ffffff)',
                    color: isSelected
                      ? 'var(--pw-answer-fg-selected, var(--pw-answer-fg, #1C1C21))'
                      : 'var(--pw-answer-fg, #1C1C21)',
                    boxShadow: isSelected
                      ? 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))'
                      : 'none',
                    transition: `border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
                    outline: 'none',
                    WebkitTapHighlightColor: 'transparent',
                  } as React.CSSProperties
                }
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, #8399BF)`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = isSelected
                    ? 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))'
                    : 'none';
                }}
              >
                {/* Radio indicator */}
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 'var(--pw-answer-indicator-size, 20px)',
                    height: 'var(--pw-answer-indicator-size, 20px)',
                    borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                    border: isSelected
                      ? '2px solid var(--pw-answer-indicator-fill, #161336)'
                      : '2px solid var(--pw-answer-border, #E0E0E0)',
                    background: isSelected
                      ? 'var(--pw-answer-indicator-fill, #161336)'
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
                  }}
                >
                  {isSelected ? (
                    <span
                      className="pw-motion-pop"
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background: 'var(--pw-answer-indicator-check, #ffffff)',
                        display: 'block',
                      }}
                    />
                  ) : null}
                </span>

                <span style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                        fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                        fontWeight: 600,
                        lineHeight: 1.35,
                      }}
                    >
                      {option.label}
                    </span>
                    {option.badge ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 999,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          letterSpacing: '0.02em',
                          background:
                            option.badge === 'Best value'
                              ? 'var(--pw-color-brand, #161336)'
                              : 'var(--pw-state-hover, #F1F0E8)',
                          color:
                            option.badge === 'Best value'
                              ? 'var(--pw-color-brand-contrast, #ffffff)'
                              : 'var(--pw-color-brand, #161336)',
                          border:
                            option.badge === 'Best value'
                              ? 'none'
                              : '1px solid var(--pw-color-border, #EFEFEC)',
                        }}
                      >
                        {option.badge}
                      </span>
                    ) : null}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      marginTop: 2,
                      fontFamily: 'var(--pw-answer-subtext-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                      fontSize: 'var(--pw-answer-subtext-font-size, 0.875rem)',
                      fontWeight: 'var(--pw-answer-subtext-font-weight, 400)' as unknown as number,
                      color: 'var(--pw-answer-subtext-fg, var(--pw-label-sublabel-fg, #545454))',
                      lineHeight: 1.4,
                    }}
                  >
                    {option.helper}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '400ms',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            paddingTop: '0.25rem',
          } as React.CSSProperties
        }
      >
        {error ? (
          <p
            role="alert"
            style={{
              margin: 0,
              fontSize: 'var(--pw-font-size-body, 1rem)',
              color: 'var(--pw-color-error, #ef4444)',
              fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            }}
          >
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleContinue}
          disabled={isSubmitting || !selected}
          style={{
            width: '100%',
            minHeight: 52,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.625rem',
            padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
            border: 'none',
            borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
            background: 'var(--pw-button-bg, #161336)',
            color: 'var(--pw-button-fg, #ffffff)',
            fontFamily: 'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 600,
            cursor: isSubmitting ? 'wait' : 'pointer',
            opacity: isSubmitting || !selected
              ? ('var(--pw-state-disabled-opacity, 0.45)' as unknown as number)
              : 1,
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            transition: `opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), transform var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
            WebkitTapHighlightColor: 'transparent',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, #8399BF)`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))';
          }}
        >
          {isSubmitting ? (
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

        <p
          style={{
            margin: 0,
            textAlign: 'center',
            fontSize: 'var(--pw-font-size-caption, 0.8rem)',
            color: 'var(--pw-color-muted, #71717a)',
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            lineHeight: 1.45,
          }}
        >
          {selected.label} of {productName} will be added to your cart.
        </p>
      </div>
    </div>
  );
}