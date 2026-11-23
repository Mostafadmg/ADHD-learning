import React, { useState, useEffect, useRef, useCallback } from 'react';

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
  subtitle: {
    type: 'string',
    title: 'Subtitle',
    defaultValue: 'FDA-approved retail patch · shipped by a US licensed pharmacy',
  },
  description: {
    type: 'string',
    title: 'Description',
    defaultValue:
      'Transdermal patch delivering steady bioidentical estradiol through the skin. Changed on a regular schedule.',
  },
};

export const outputSchema = {
  priceId: {
    type: 'string',
    title: 'Price ID',
    description: 'Selected Stripe/price id: "2203" | "2211" | "2216"',
    required: true,
  },
  supplyLabel: {
    type: 'string',
    title: 'Supply label',
    description: 'Human-readable supply tier, e.g. "90-day supply"',
    required: true,
  },
  price: {
    type: 'number',
    title: 'Price',
    description: 'Selected unit price in USD',
    required: true,
  },
  productName: {
    type: 'string',
    title: 'Product name',
    description: 'Always "Estradiol Patch"',
    required: true,
  },
};

type CartItemVariant = { name: string; value: string };
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variants?: CartItemVariant[];
};
type Cart = { items: CartItem[]; subtotal: number; total: number };

type SupplyOption = {
  priceId: string;
  label: string;
  price: number;
  badge?: string;
};

const SUPPLY_OPTIONS: SupplyOption[] = [
  { priceId: '2203', label: '30-day supply', price: 99 },
  { priceId: '2211', label: '90-day supply', price: 249, badge: 'Most popular' },
  { priceId: '2216', label: '150-day supply', price: 349, badge: 'Best value' },
];

const DEFAULT_PRICE_ID = '2211';

export default function EstradiolPatchPicker({
  productName = 'Estradiol Patch',
  productImage = 'https://cdn.prod.website-files.com/6095ae7ee40374852364f71d/6a50d63b6f746eb1e78d77f5_Group%2025%20(1).png',
  subtitle = 'FDA-approved retail patch · shipped by a US licensed pharmacy',
  description = 'Transdermal patch delivering steady bioidentical estradiol through the skin. Changed on a regular schedule.',
  onChange,
}: {
  productName?: string;
  productImage?: string;
  subtitle?: string;
  description?: string;
  onChange?: (outputs: {
    priceId: string;
    supplyLabel: string;
    price: number;
    productName: string;
  }) => void;
}) {
  const [selectedId, setSelectedId] = useState(DEFAULT_PRICE_ID);
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const [addedFlash, setAddedFlash] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selected =
    SUPPLY_OPTIONS.find((o) => o.priceId === selectedId) ?? SUPPLY_OPTIONS[1];

  useEffect(() => {
    onChange?.({
      priceId: selected.priceId,
      supplyLabel: selected.label,
      price: selected.price,
      productName: 'Estradiol Patch',
    });
  }, [selected.priceId, selected.label, selected.price, onChange]);

  useEffect(() => {
    const cartApi = window.pathwai?.cart;
    if (!cartApi) return;

    setCart(cartApi.getCart());

    const handleCartUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ cart: Cart }>).detail;
      setCart(detail.cart);
    };

    window.addEventListener('pathwai:cart:updated', handleCartUpdate);
    return () => window.removeEventListener('pathwai:cart:updated', handleCartUpdate);
  }, []);

  useEffect(() => {
    if (!justSelected) return;
    const el = optionRefs.current[justSelected];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelected]);

  useEffect(() => {
    return () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  const handleSelect = useCallback((priceId: string) => {
    setSelectedId(priceId);
    setJustSelected(priceId);
    setAddedFlash(false);
  }, []);

  const handleAddToCart = useCallback(() => {
    const option =
      SUPPLY_OPTIONS.find((o) => o.priceId === selectedId) ?? SUPPLY_OPTIONS[1];

    window.pathwai?.cart?.addItem({
      id: option.priceId,
      name: `Estradiol Patch · ${option.label}`,
      price: option.price,
      quantity: 1,
      image: productImage,
      variants: [
        { name: 'Supply', value: option.label },
        { name: 'Product', value: 'Estradiol Patch' },
      ],
    });

    setAddedFlash(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setAddedFlash(false), 1800);
  }, [selectedId, productImage]);

  const cartCount =
    cart?.items.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0;

  const formatMoney = (n: number) => `$${n.toFixed(n % 1 === 0 ? 0 : 2)}`;

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
      {/* Top bar: cart affordance */}
      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          '--pw-motion-enter-delay': '0ms',
        } as React.CSSProperties}
      >
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label={cartCount > 0 ? `Open cart, ${cartCount} items` : 'Open cart'}
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: 'var(--pw-radius, 8px)',
            border: '1.5px solid var(--pw-color-border, #e2e8f0)',
            background: 'var(--pw-color-surface, #ffffff)',
            color: 'var(--pw-color-on-surface, #0f172a)',
            cursor: 'pointer',
            padding: 0,
            boxShadow: 'var(--pw-shadow, 0 1px 2px rgba(15,23,42,0.06))',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M6 6h15l-1.5 9h-12z" />
            <path d="M6 6L5 3H2" />
            <circle cx="9" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
          {cartCount > 0 && (
            <span
              className="pw-motion-pop"
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                minWidth: 18,
                height: 18,
                padding: '0 5px',
                borderRadius: 999,
                background: 'var(--pw-color-brand, #2563eb)',
                color: 'var(--pw-color-brand-contrast, #ffffff)',
                fontSize: 11,
                fontWeight: 700,
                lineHeight: '18px',
                textAlign: 'center',
              }}
            >
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Product hero */}
      <section
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
          background: 'var(--pw-color-surface, #ffffff)',
          border: '1.5px solid var(--pw-color-border, #e2e8f0)',
          borderRadius: 'var(--pw-radius, 8px)',
          padding: 'var(--pw-control-padding, 1rem)',
          boxShadow: 'var(--pw-shadow, 0 1px 3px rgba(15,23,42,0.06))',
          '--pw-motion-enter-delay': '60ms',
        } as React.CSSProperties}
      >
        <div
          style={{
            display: 'flex',
            gap: 'var(--pw-element-gap, 0.75rem)',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              flexShrink: 0,
              width: 88,
              height: 88,
              borderRadius: 'var(--pw-radius, 8px)',
              background: 'var(--pw-answer-media-bg, #f1f5f9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {productImage ? (
              <img
                src={productImage}
                alt=""
                width={88}
                height={88}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            ) : null}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--pw-font-family-title, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-title, 1.5rem)',
                fontWeight: 'var(--pw-font-weight-title, 700)' as React.CSSProperties['fontWeight'],
                lineHeight: 'var(--pw-font-line-height-title, 1.2)' as React.CSSProperties['lineHeight'],
                letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
                color: 'var(--pw-label-fg, var(--pw-color-on-surface, #0f172a))',
              }}
            >
              {productName}
            </h2>
            <p
              style={{
                margin: '0.35rem 0 0',
                fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                fontWeight: 500,
                lineHeight: 1.4,
                color: 'var(--pw-label-sublabel-fg, var(--pw-color-muted, #64748b))',
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 'var(--pw-font-weight-body, 400)' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-font-line-height-body, 1.55)' as React.CSSProperties['lineHeight'],
            color: 'var(--pw-content-fg, var(--pw-color-on-surface, #0f172a))',
          }}
        >
          {description}
        </p>
      </section>

      {/* Supply tiers */}
      <fieldset
        style={{
          border: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
        }}
      >
        <legend
          className="pw-motion-enter"
          style={{
            padding: 0,
            marginBottom: '0.25rem',
            fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, system-ui, sans-serif))',
            fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.125rem))',
            fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 600))' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-label-line-height, 1.3)' as React.CSSProperties['lineHeight'],
            color: 'var(--pw-label-fg, var(--pw-color-on-surface, #0f172a))',
            '--pw-motion-enter-delay': '120ms',
          } as React.CSSProperties}
        >
          Choose your supply
        </legend>

        {SUPPLY_OPTIONS.map((option, index) => {
          const isSelected = selectedId === option.priceId;
          return (
            <button
              key={option.priceId}
              ref={(el) => {
                optionRefs.current[option.priceId] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className="pw-motion-enter"
              onClick={() => handleSelect(option.priceId)}
              style={{
                '--pw-motion-enter-delay': `${180 + index * 80}ms`,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--pw-answer-gap, 0.75rem)',
                width: '100%',
                minHeight: 56,
                textAlign: 'left',
                cursor: 'pointer',
                padding: 'var(--pw-control-padding, 1rem)',
                borderRadius: 'var(--pw-radius, 8px)',
                border: isSelected
                  ? '2px solid var(--pw-color-brand, #2563eb)'
                  : '1.5px solid var(--pw-answer-border, #e2e8f0)',
                background: isSelected
                  ? 'var(--pw-answer-surface-selected, #eff6ff)'
                  : 'var(--pw-answer-surface, #ffffff)',
                color: isSelected
                  ? 'var(--pw-answer-fg-selected, var(--pw-color-on-surface, #0f172a))'
                  : 'var(--pw-answer-fg, var(--pw-color-on-surface, #0f172a))',
                boxShadow: isSelected
                  ? 'var(--pw-shadow, 0 1px 3px rgba(15,23,42,0.08))'
                  : 'none',
                transition: `border-color var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease), background var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease)`,
                boxSizing: 'border-box',
              } as React.CSSProperties}
            >
              {/* Radio indicator */}
              <span
                aria-hidden
                style={{
                  display: 'var(--pw-answer-indicator-display, flex)' as React.CSSProperties['display'],
                  flexShrink: 0,
                  width: 'var(--pw-answer-indicator-size, 18px)',
                  height: 'var(--pw-answer-indicator-size, 18px)',
                  borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                  border: isSelected
                    ? '2px solid var(--pw-answer-indicator-fill, var(--pw-color-brand, #2563eb))'
                    : '2px solid var(--pw-answer-border, #cbd5e1)',
                  background: isSelected
                    ? 'var(--pw-answer-indicator-fill, var(--pw-color-brand, #2563eb))'
                    : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                }}
              >
                {isSelected && (
                  <span
                    className="pw-motion-pop"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: 'var(--pw-answer-indicator-check, #ffffff)',
                      display: 'var(--pw-answer-indicator-dot-display, flex)' as React.CSSProperties['display'],
                    }}
                  />
                )}
              </span>

              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '0.35rem 0.5rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
                    fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                    fontWeight: 600,
                    lineHeight: 1.35,
                  }}
                >
                  {option.label}
                </span>
                {option.badge && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 999,
                      fontSize: 'var(--pw-font-size-caption, 0.75rem)',
                      fontWeight: 600,
                      letterSpacing: '0.01em',
                      background: isSelected
                        ? 'var(--pw-color-brand, #2563eb)'
                        : 'var(--pw-color-info-surface, #e0f2fe)',
                      color: isSelected
                        ? 'var(--pw-color-brand-contrast, #ffffff)'
                        : 'var(--pw-color-on-info, #0369a1)',
                    }}
                  >
                    {option.badge}
                  </span>
                )}
              </span>

              <span
                style={{
                  flexShrink: 0,
                  fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
                  fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: isSelected
                    ? 'var(--pw-color-brand, #2563eb)'
                    : 'var(--pw-color-on-surface, #0f172a)',
                }}
              >
                {formatMoney(option.price)}
              </span>
            </button>
          );
        })}
      </fieldset>

      {/* Primary CTA */}
      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          '--pw-motion-enter-delay': '420ms',
        } as React.CSSProperties}
      >
        <button
          type="button"
          onClick={handleAddToCart}
          aria-live="polite"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            minHeight: 52,
            padding: 'var(--pw-navigation-button-padding, var(--pw-control-padding, 1rem))',
            border: 'none',
            borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 8px))',
            background: addedFlash
              ? 'var(--pw-color-success, #16a34a)'
              : 'var(--pw-button-bg, var(--pw-color-brand, #2563eb))',
            color: addedFlash
              ? 'var(--pw-color-on-success, #ffffff)'
              : 'var(--pw-button-fg, var(--pw-color-brand-contrast, #ffffff))',
            fontFamily: 'var(--pw-navigation-button-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
            fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 'var(--pw-navigation-button-font-weight, 600)' as React.CSSProperties['fontWeight'],
            cursor: 'pointer',
            transition: `background var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease)`,
            boxSizing: 'border-box',
          }}
        >
          {addedFlash ? (
            <>
              <span className="pw-motion-pop" aria-hidden style={{ display: 'inline-flex' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              Added to cart
            </>
          ) : (
            <>Add {selected.label} · {formatMoney(selected.price)}</>
          )}
        </button>
      </div>

      {/* Disclaimer */}
      <p
        className="pw-motion-enter"
        style={{
          margin: 0,
          fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
          lineHeight: 1.5,
          color: 'var(--pw-color-muted, #64748b)',
          '--pw-motion-enter-delay': '480ms',
        } as React.CSSProperties}
      >
        Your doctor may adjust dosing based on your answers. Prescription required.
        If you still have a uterus, estrogen is paired with progesterone for uterine protection.
      </p>

      {/* Cart drawer */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Your cart"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              border: 'none',
              padding: 0,
              margin: 0,
              background: 'var(--pw-color-overlay, rgba(15,23,42,0.5))',
              cursor: 'pointer',
            }}
          />
          <aside
            className="pw-motion-enter"
            style={{
              position: 'relative',
              width: 'min(100%, 22rem)',
              height: '100%',
              background: 'var(--pw-color-surface, #ffffff)',
              color: 'var(--pw-color-on-surface, #0f172a)',
              boxShadow: 'var(--pw-shadow, -4px 0 24px rgba(15,23,42,0.12))',
              display: 'flex',
              flexDirection: 'column',
              padding: 'var(--pw-control-padding, 1rem)',
              boxSizing: 'border-box',
              '--pw-motion-enter-delay': '0ms',
            } as React.CSSProperties}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--pw-element-gap, 0.75rem)',
                gap: '0.75rem',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontFamily: 'var(--pw-font-family-title, system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-title, 1.25rem)',
                  fontWeight: 'var(--pw-font-weight-title, 700)' as React.CSSProperties['fontWeight'],
                  lineHeight: 1.2,
                }}
              >
                Your cart
              </h3>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close"
                style={{
                  width: 44,
                  height: 44,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--pw-color-muted, #64748b)',
                  cursor: 'pointer',
                  borderRadius: 'var(--pw-radius, 8px)',
                  fontSize: '1.25rem',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--pw-element-gap, 0.75rem)',
              }}
            >
              {!cart || cart.items.length === 0 ? (
                <p
                  style={{
                    margin: '1.5rem 0 0',
                    textAlign: 'center',
                    color: 'var(--pw-color-muted, #64748b)',
                    fontSize: 'var(--pw-font-size-body, 1rem)',
                  }}
                >
                  Your cart is empty
                </p>
              ) : (
                cart.items.map((item) => {
                  const variantKey = item.variants
                    ?.map((v) => `${v.name}:${v.value}`)
                    .join('|');
                  return (
                    <div
                      key={`${item.id}-${variantKey ?? ''}`}
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        borderRadius: 'var(--pw-radius, 8px)',
                        border: '1px solid var(--pw-color-border, #e2e8f0)',
                        background: 'var(--pw-color-background, #f8fafc)',
                      }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          width={48}
                          height={48}
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: 'contain',
                            borderRadius: 'calc(var(--pw-radius, 8px) * 0.5)',
                            background: 'var(--pw-answer-media-bg, #f1f5f9)',
                            flexShrink: 0,
                          }}
                        />
                      ) : null}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 'var(--pw-font-size-body, 0.9375rem)',
                            fontWeight: 600,
                            lineHeight: 1.3,
                            marginBottom: 2,
                          }}
                        >
                          {item.name}
                        </div>
                        {item.variants && item.variants.length > 0 && (
                          <div
                            style={{
                              fontSize: 'var(--pw-font-size-caption, 0.75rem)',
                              color: 'var(--pw-color-muted, #64748b)',
                              marginBottom: 6,
                            }}
                          >
                            {item.variants.map((v) => v.value).join(' · ')}
                          </div>
                        )}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.5rem',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: 'var(--pw-font-size-body, 0.9375rem)',
                            }}
                          >
                            {formatMoney(item.price)}
                          </span>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${item.name}`}
                              onClick={() => {
                                window.pathwai?.cart?.updateQuantity(
                                  item.id,
                                  item.quantity - 1,
                                  item.variants
                                );
                              }}
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 'var(--pw-radius, 8px)',
                                border: '1px solid var(--pw-color-border, #e2e8f0)',
                                background: 'var(--pw-color-surface, #ffffff)',
                                cursor: 'pointer',
                                fontSize: 16,
                                lineHeight: 1,
                                color: 'var(--pw-color-on-surface, #0f172a)',
                              }}
                            >
                              −
                            </button>
                            <span
                              style={{
                                minWidth: 24,
                                textAlign: 'center',
                                fontWeight: 600,
                                fontSize: 'var(--pw-font-size-body, 0.9375rem)',
                              }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${item.name}`}
                              onClick={() => {
                                window.pathwai?.cart?.updateQuantity(
                                  item.id,
                                  item.quantity + 1,
                                  item.variants
                                );
                              }}
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 'var(--pw-radius, 8px)',
                                border: '1px solid var(--pw-color-border, #e2e8f0)',
                                background: 'var(--pw-color-surface, #ffffff)',
                                cursor: 'pointer',
                                fontSize: 16,
                                lineHeight: 1,
                                color: 'var(--pw-color-on-surface, #0f172a)',
                              }}
                            >
                              +
                            </button>
                            <button
                              type="button"
                              aria-label={`Remove ${item.name}`}
                              onClick={() => {
                                window.pathwai?.cart?.removeItem(item.id, item.variants);
                              }}
                              style={{
                                marginLeft: 4,
                                height: 36,
                                padding: '0 0.5rem',
                                border: 'none',
                                background: 'transparent',
                                color: 'var(--pw-color-error, #dc2626)',
                                cursor: 'pointer',
                                fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
                                fontWeight: 600,
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cart && cart.items.length > 0 && (
              <div
                style={{
                  borderTop: '1px solid var(--pw-color-border, #e2e8f0)',
                  paddingTop: 'var(--pw-element-gap, 0.75rem)',
                  marginTop: 'var(--pw-element-gap, 0.75rem)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '0.75rem',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--pw-color-muted, #64748b)',
                      fontSize: 'var(--pw-font-size-body, 1rem)',
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 'var(--pw-font-size-title, 1.25rem)',
                    }}
                  >
                    {formatMoney(cart.total)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    width: '100%',
                    minHeight: 48,
                    border: 'none',
                    borderRadius: 'var(--pw-radius, 8px)',
                    background: 'var(--pw-button-bg, var(--pw-color-brand, #2563eb))',
                    color: 'var(--pw-button-fg, var(--pw-color-brand-contrast, #ffffff))',
                    fontWeight: 600,
                    fontSize: 'var(--pw-font-size-body, 1rem)',
                    cursor: 'pointer',
                  }}
                >
                  Continue browsing
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}