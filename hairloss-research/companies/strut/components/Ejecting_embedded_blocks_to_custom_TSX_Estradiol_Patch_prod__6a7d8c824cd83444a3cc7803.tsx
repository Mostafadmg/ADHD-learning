import React, { useState, useEffect, useCallback, useRef } from 'react';

export const propSchema = {
  subtitle: {
    type: 'string',
    title: 'Subtitle',
    defaultValue: 'FDA-approved retail patch · shipped by a US licensed pharmacy',
  },
  productLabel: {
    type: 'string',
    title: 'Product label',
    defaultValue: 'Medication',
  },
  supplyLabel: {
    type: 'string',
    title: 'Supply label',
    defaultValue: 'Supply',
  },
  ctaLabel: {
    type: 'string',
    title: 'CTA label',
    defaultValue: 'Add to cart',
  },
  baseCheckoutUrl: {
    type: 'string',
    title: 'Base checkout URL',
    defaultValue: 'https://checkout.struthealth.com/female-bhrt',
  },
  imgEstradiolPatch: {
    type: 'image',
    title: 'Product image',
    defaultValue:
      'https://cdn.prod.website-files.com/6095ae7ee40374852364f71d/6a50d63b6f746eb1e78d77f5_Group%2025%20(1).png',
  },
  disclaimerText: {
    type: 'string',
    title: 'Disclaimer',
    defaultValue:
      'Your doctor may adjust dosing based on your answers. Prescription required.',
  },
};

export const outputSchema = {
  productId: {
    type: 'string',
    title: 'Product ID',
    description: 'Stable product key: estradiol-patch',
    required: true,
  },
  productName: {
    type: 'string',
    title: 'Product name',
    description: 'Display name of the selected product',
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
    description: 'Cart/price id for routing: "2203" | "2211" | "2216"',
    required: true,
  },
  price: {
    type: 'number',
    title: 'Price',
    description: 'Selected supply price in USD',
  },
  addedToCart: {
    type: 'boolean',
    title: 'Added to cart',
    description: 'True after the shopper successfully adds this item',
  },
};

type SupplyTier = {
  days: number;
  label: string;
  price: number;
  priceId: string;
  saveLabel?: string;
};

const SUPPLY_TIERS: SupplyTier[] = [
  { days: 30, label: '30-day', price: 99, priceId: '2203' },
  { days: 90, label: '90-day', price: 249, priceId: '2211', saveLabel: 'Save 16%' },
  { days: 150, label: '150-day', price: 349, priceId: '2216', saveLabel: 'Best value' },
];

const PRODUCT_NAME = 'Estradiol Patch';
const PRODUCT_ID = 'estradiol-patch';
const PRODUCT_DESCRIPTION =
  'Transdermal bioidentical estradiol patch with steady absorption, changed on a regular schedule.';

export default function EstradiolPatchPicker({
  subtitle = 'FDA-approved retail patch · shipped by a US licensed pharmacy',
  productLabel = 'Medication',
  supplyLabel = 'Supply',
  ctaLabel = 'Add to cart',
  baseCheckoutUrl = 'https://checkout.struthealth.com/female-bhrt',
  imgEstradiolPatch = 'https://cdn.prod.website-files.com/6095ae7ee40374852364f71d/6a50d63b6f746eb1e78d77f5_Group%2025%20(1).png',
  disclaimerText = 'Your doctor may adjust dosing based on your answers. Prescription required.',
  onChange,
}: {
  subtitle?: string;
  productLabel?: string;
  supplyLabel?: string;
  ctaLabel?: string;
  baseCheckoutUrl?: string;
  imgEstradiolPatch?: string;
  disclaimerText?: string;
  onChange?: (outputs: {
    productId: string;
    productName: string;
    supplyDays: number;
    priceId: string;
    price: number;
    addedToCart: boolean;
  }) => void;
}) {
  const [selectedPriceId, setSelectedPriceId] = useState<string>(SUPPLY_TIERS[1].priceId);
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selectedTier =
    SUPPLY_TIERS.find((t) => t.priceId === selectedPriceId) ?? SUPPLY_TIERS[1];

  const emit = useCallback(
    (tier: SupplyTier, added: boolean) => {
      onChange?.({
        productId: PRODUCT_ID,
        productName: PRODUCT_NAME,
        supplyDays: tier.days,
        priceId: tier.priceId,
        price: tier.price,
        addedToCart: added,
      });
    },
    [onChange],
  );

  useEffect(() => {
    emit(selectedTier, addedToCart);
  }, [selectedTier, addedToCart, emit]);

  useEffect(() => {
    if (!justSelected) return;
    const el = optionRefs.current[justSelected];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelected]);

  const handleSelectSupply = (tier: SupplyTier) => {
    setSelectedPriceId(tier.priceId);
    setJustSelected(tier.priceId);
    setAddedToCart(false);
    setError(null);
  };

  const handleAddToCart = () => {
    const cart = window.pathwai?.cart;
    if (!cart) {
      setError('Cart is unavailable. Please try again in a moment.');
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      cart.addItem({
        id: selectedTier.priceId,
        name: `${PRODUCT_NAME} · ${selectedTier.label}`,
        price: selectedTier.price,
        quantity: 1,
        image: imgEstradiolPatch || undefined,
        variants: [
          { name: 'Supply', value: selectedTier.label },
          { name: 'Product', value: PRODUCT_NAME },
        ],
      });
      setAddedToCart(true);
      emit(selectedTier, true);
    } catch {
      setError('Could not add to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

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
      {/* Product card */}
      <div
        className="pw-motion-enter"
        style={{
          ['--pw-motion-enter-delay' as string]: '0ms',
          background: 'var(--pw-color-surface, #ffffff)',
          border: '1px solid #E5E1D8',
          borderRadius: 'var(--pw-radius, 0.5rem)',
          boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          {/* Image + identity */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
              gap: 'var(--pw-element-gap, 1.25rem)',
              padding: 'var(--pw-control-padding, 1rem)',
              background: 'var(--pw-answer-surface-selected, #F1F0E8)',
              borderBottom: '1px solid #E5E1D8',
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: 96,
                height: 96,
                borderRadius: 'var(--pw-radius, 0.5rem)',
                background: 'var(--pw-color-surface, #ffffff)',
                border: '1px solid #E5E1D8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {imgEstradiolPatch ? (
                <img
                  src={imgEstradiolPatch}
                  alt={PRODUCT_NAME}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              ) : null}
            </div>

            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-caption, 0.8rem)',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--pw-label-sublabel-fg, #545454)',
                }}
              >
                {productLabel}
              </span>
              <h2
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
                {PRODUCT_NAME}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--pw-font-size-body, 1rem)',
                  lineHeight: 1.45,
                  color: 'var(--pw-label-sublabel-fg, #545454)',
                }}
              >
                {subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          <div
            style={{
              padding: 'var(--pw-control-padding, 1rem)',
              borderBottom: '1px solid var(--pw-color-border, #EFEFEC)',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 'var(--pw-font-size-body, 1rem)',
                lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                color: 'var(--pw-content-fg, #1C1C21)',
              }}
            >
              {PRODUCT_DESCRIPTION}
            </p>
          </div>

          {/* Supply selector */}
          <div
            style={{
              padding: 'var(--pw-control-padding, 1rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '0.75rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-caption, 0.8rem)',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--pw-label-sublabel-fg, #545454)',
                }}
              >
                {supplyLabel}
              </span>
              <span
                style={{
                  fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: 'var(--pw-color-brand, #161336)',
                }}
              >
                ${selectedTier.price}
              </span>
            </div>

            <div
              role="radiogroup"
              aria-label="Supply length"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '0.5rem',
              }}
            >
              {SUPPLY_TIERS.map((tier, index) => {
                const isSelected = tier.priceId === selectedPriceId;
                return (
                  <button
                    key={tier.priceId}
                    ref={(el) => {
                      optionRefs.current[tier.priceId] = el;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className="pw-motion-enter"
                    onClick={() => handleSelectSupply(tier)}
                    style={{
                      ['--pw-motion-enter-delay' as string]: `${(index + 1) * 80}ms`,
                      minHeight: 72,
                      padding: '0.65rem 0.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.2rem',
                      cursor: 'pointer',
                      borderRadius: 'var(--pw-radius, 0.5rem)',
                      border: isSelected
                        ? '2px solid var(--pw-color-brand, #161336)'
                        : '1.5px solid #E5E1D8',
                      background: isSelected
                        ? 'var(--pw-answer-surface-selected, #F1F0E8)'
                        : 'var(--pw-answer-surface, #ffffff)',
                      color: isSelected
                        ? 'var(--pw-answer-fg-selected, #1C1C21)'
                        : 'var(--pw-answer-fg, #1C1C21)',
                      boxShadow: isSelected
                        ? 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))'
                        : 'none',
                      transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, #8399BF)`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = isSelected
                        ? 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))'
                        : 'none';
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                        fontSize: 'var(--pw-font-size-body, 1rem)',
                        fontWeight: 600,
                        lineHeight: 1.2,
                      }}
                    >
                      {tier.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--pw-label-sublabel-fg, #545454)',
                        fontWeight: 500,
                      }}
                    >
                      ${tier.price}
                    </span>
                    {tier.saveLabel ? (
                      <span
                        className={isSelected ? 'pw-motion-pop' : undefined}
                        style={{
                          marginTop: 2,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          letterSpacing: '0.02em',
                          textTransform: 'uppercase',
                          color: isSelected
                            ? 'var(--pw-color-brand, #161336)'
                            : 'var(--pw-color-muted, #71717a)',
                        }}
                      >
                        {tier.saveLabel}
                      </span>
                    ) : (
                      <span style={{ height: '0.85rem' }} aria-hidden />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div
            className="pw-motion-enter"
            style={{
              ['--pw-motion-enter-delay' as string]: '320ms',
              padding: '0 var(--pw-control-padding, 1rem) var(--pw-control-padding, 1rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              aria-busy={isAdding}
              style={{
                width: '100%',
                minHeight: 48,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
                border: 'none',
                borderRadius: 'var(--pw-navigation-button-radius, 0.5rem)',
                background: addedToCart
                  ? 'var(--pw-color-brand, #161336)'
                  : 'var(--pw-button-bg, #161336)',
                color: 'var(--pw-button-fg, #ffffff)',
                fontFamily:
                  'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                fontSize: 'var(--pw-navigation-button-font-size, 1rem)',
                fontWeight: 600,
                cursor: isAdding ? 'wait' : 'pointer',
                opacity: isAdding ? 0.85 : 1,
                transition: `opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, #8399BF)`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isAdding ? (
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
              ) : addedToCart ? (
                <>
                  <span className="pw-motion-pop" aria-hidden>
                    ✓
                  </span>
                  Added to cart
                </>
              ) : (
                <>
                  {ctaLabel}
                  <span aria-hidden style={{ opacity: 0.85 }}>
                    · ${selectedTier.price}
                  </span>
                </>
              )}
            </button>

            {error ? (
              <p
                role="alert"
                style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  lineHeight: 1.4,
                  color: 'var(--pw-color-error, #ef4444)',
                }}
              >
                {error}
              </p>
            ) : null}

            {disclaimerText ? (
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--pw-font-size-caption, 0.8rem)',
                  lineHeight: 1.45,
                  color: 'var(--pw-color-muted, #71717a)',
                  textAlign: 'center',
                }}
              >
                {disclaimerText}
              </p>
            ) : null}

            {/* baseCheckoutUrl kept for builder parity / future checkout handoff */}
            <span
              data-checkout-base={baseCheckoutUrl}
              style={{ display: 'none' }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}