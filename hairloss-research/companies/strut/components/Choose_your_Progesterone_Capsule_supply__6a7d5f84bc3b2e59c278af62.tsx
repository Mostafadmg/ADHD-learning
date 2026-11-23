import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export const propSchema = {
  eyebrow: {
    type: 'string',
    title: 'Eyebrow',
    defaultValue: 'Progesterone capsule',
  },
  supportingLine: {
    type: 'string',
    title: 'Supporting line',
    defaultValue:
      'Oral bioidentical progesterone. Your clinician reviews every order before it ships.',
  },
  productName: {
    type: 'string',
    title: 'Product name',
    defaultValue: 'Progesterone Capsule',
  },
  productForm: {
    type: 'string',
    title: 'Product form',
    defaultValue: 'Oral capsule',
  },
  imageUrl: {
    type: 'image',
    title: 'Product image',
    defaultValue:
      'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/image-1784145662212-2e98c18fe707a756.png',
  },
  helperText: {
    type: 'string',
    title: 'Helper text',
    defaultValue: 'Shipped after provider review.',
  },
};

export const outputSchema = {
  product_id: {
    type: 'string',
    title: 'Product ID',
    description: 'Always "progesterone-capsule"',
    required: true,
  },
  strength: {
    type: 'string',
    title: 'Strength',
    description: 'Selected strength: "100" or "200"',
    required: true,
  },
  supply_days: {
    type: 'number',
    title: 'Supply days',
    description: 'Selected supply length in days: 30, 90, or 150',
    required: true,
  },
  price_id: {
    type: 'string',
    title: 'Price ID',
    description: 'Selected price ID: "2154", "2209", or "2214"',
    required: true,
  },
  item_ids: {
    type: 'string',
    title: 'Item IDs',
    description: 'Comma-separated price IDs currently in cart for this product',
    required: false,
  },
  in_cart: {
    type: 'boolean',
    title: 'In cart',
    description: 'True when progesterone-capsule is in the cart',
    required: true,
  },
};

type StrengthOption = {
  value: string;
  label: string;
  hint: string;
};

type SupplyOption = {
  days: number;
  label: string;
  price: number;
  priceId: string;
  badge?: string;
};

type CartItemVariant = {
  name: string;
  value: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variants?: CartItemVariant[];
};

type Cart = {
  items: CartItem[];
  subtotal: number;
  total: number;
};

const PRODUCT_ID = 'progesterone-capsule';

const STRENGTHS: StrengthOption[] = [
  { value: '100', label: '100 mg', hint: 'Common starting dose' },
  { value: '200', label: '200 mg', hint: 'Higher-strength option' },
];

const SUPPLIES: SupplyOption[] = [
  { days: 30, label: '30-day supply', price: 69, priceId: '2154' },
  {
    days: 90,
    label: '90-day supply',
    price: 149,
    priceId: '2209',
    badge: 'Most popular',
  },
  { days: 150, label: '150-day supply', price: 199, priceId: '2214' },
];

function formatMoney(amount: number): string {
  return '$' + amount.toFixed(amount % 1 === 0 ? 0 : 2);
}

function getVariant(item: CartItem, name: string): string | undefined {
  return item.variants?.find((v) => v.name === name)?.value;
}

function isProgesteroneItem(item: CartItem): boolean {
  return item.id === PRODUCT_ID;
}

function buildVariants(strength: string, supplyDays: number, priceId: string): CartItemVariant[] {
  return [
    { name: 'Strength', value: strength + ' mg' },
    { name: 'Supply', value: supplyDays + '-day' },
    { name: 'Price ID', value: priceId },
  ];
}

export default function ProgesteroneCapsuleSelector({
  eyebrow = 'Progesterone capsule',
  supportingLine = 'Oral bioidentical progesterone. Your clinician reviews every order before it ships.',
  productName = 'Progesterone Capsule',
  productForm = 'Oral capsule',
  imageUrl = 'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/image-1784145662212-2e98c18fe707a756.png',
  helperText = 'Shipped after provider review.',
  onChange,
}: {
  eyebrow?: string;
  supportingLine?: string;
  productName?: string;
  productForm?: string;
  imageUrl?: string;
  helperText?: string;
  onChange?: (outputs: {
    product_id: string;
    strength: string;
    supply_days: number;
    price_id: string;
    item_ids: string;
    in_cart: boolean;
  }) => void;
}) {
  const [strength, setStrength] = useState<string>('100');
  const [supplyDays, setSupplyDays] = useState<number>(90);
  const [cart, setCart] = useState<Cart | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [justSelectedStrength, setJustSelectedStrength] = useState<string | null>(null);
  const [justSelectedSupply, setJustSelectedSupply] = useState<number | null>(null);
  const [addedPulse, setAddedPulse] = useState(false);
  const [imgError, setImgError] = useState(false);

  const strengthRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const supplyRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const drawerCloseRef = useRef<HTMLButtonElement | null>(null);

  const selectedSupply = useMemo(
    () => SUPPLIES.find((s) => s.days === supplyDays) ?? SUPPLIES[1],
    [supplyDays]
  );

  const priceId = selectedSupply.priceId;

  const syncCart = useCallback(() => {
    const api = window.pathwai?.cart;
    if (!api) {
      setCart({ items: [], subtotal: 0, total: 0 });
      return;
    }
    setCart(api.getCart());
  }, []);

  useEffect(() => {
    syncCart();
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ cart: Cart }>).detail;
      if (detail?.cart) {
        setCart(detail.cart);
      } else {
        syncCart();
      }
    };
    window.addEventListener('pathwai:cart:updated', handler as EventListener);
    return () => {
      window.removeEventListener('pathwai:cart:updated', handler as EventListener);
    };
  }, [syncCart]);

  const progesteroneItems = useMemo(
    () => (cart?.items ?? []).filter(isProgesteroneItem),
    [cart]
  );

  const inCart = progesteroneItems.length > 0;

  const itemIds = useMemo(() => {
    const ids = progesteroneItems
      .map((item) => getVariant(item, 'Price ID'))
      .filter((id): id is string => Boolean(id));
    return Array.from(new Set(ids)).join(',');
  }, [progesteroneItems]);

  const existingMatch = useMemo(() => {
    return progesteroneItems.find((item) => {
      const vStrength = getVariant(item, 'Strength');
      const vSupply = getVariant(item, 'Supply');
      const vPrice = getVariant(item, 'Price ID');
      return (
        vStrength === strength + ' mg' &&
        vSupply === supplyDays + '-day' &&
        vPrice === priceId
      );
    });
  }, [progesteroneItems, strength, supplyDays, priceId]);

  const ctaLabel = inCart ? 'Update cart' : 'Add to cart';

  useEffect(() => {
    onChange?.({
      product_id: PRODUCT_ID,
      strength,
      supply_days: supplyDays,
      price_id: priceId,
      item_ids: itemIds,
      in_cart: inCart,
    });
  }, [strength, supplyDays, priceId, itemIds, inCart, onChange]);

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

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    drawerCloseRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const handleAddToCart = () => {
    const api = window.pathwai?.cart;
    const variants = buildVariants(strength, supplyDays, priceId);

    if (api) {
      // Remove existing progesterone lines so Update replaces rather than stacks
      const current = api.getItems().filter(isProgesteroneItem);
      current.forEach((item) => {
        api.removeItem(item.id, item.variants);
      });
      api.addItem({
        id: PRODUCT_ID,
        name: productName,
        price: selectedSupply.price,
        quantity: 1,
        image: imageUrl || undefined,
        variants,
      });
    }

    setAddedPulse(true);
    window.setTimeout(() => setAddedPulse(false), 400);
    setDrawerOpen(true);
    syncCart();
  };

  const handleRemove = (item: CartItem) => {
    window.pathwai?.cart?.removeItem(item.id, item.variants);
    syncCart();
  };

  const focusRing: React.CSSProperties = {
    outline: '2px solid var(--pw-state-focus-ring, #8399BF)',
    outlineOffset: 2,
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
      {/* Header */}
      <header
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '0ms',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          } as React.CSSProperties
        }
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--pw-label-sublabel-fg, #545454)',
          }}
        >
          {eyebrow}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
            lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            color: 'var(--pw-label-sublabel-fg, #545454)',
          }}
        >
          {supportingLine}
        </p>
      </header>

      {/* Hero product card */}
      <section
        className="pw-motion-enter"
        aria-label={productName}
        style={
          {
            '--pw-motion-enter-delay': '80ms',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 'var(--pw-element-gap, 1.25rem)',
            padding: 'var(--pw-control-padding, 1rem)',
            background: 'var(--pw-color-surface, #ffffff)',
            border: '1.5px solid var(--pw-color-border, #EFEFEC)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            boxSizing: 'border-box',
          } as React.CSSProperties
        }
      >
        <div
          style={{
            flexShrink: 0,
            width: 88,
            height: 88,
            borderRadius: 'var(--pw-radius, 0.5rem)',
            background: 'var(--pw-answer-media-bg, #F1F0E8)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!imgError && imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              onError={() => setImgError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          ) : (
            <span
              aria-hidden
              style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                color: 'var(--pw-color-muted, #71717a)',
                fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              }}
            >
              Rx
            </span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: 0 }}>
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
            {productName}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--pw-font-size-body, 1rem)',
              color: 'var(--pw-label-sublabel-fg, #545454)',
            }}
          >
            {productForm}
          </p>
        </div>
      </section>

      {/* Strength */}
      <section
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '160ms',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          } as React.CSSProperties
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h3
            id="prog-strength-label"
            style={{
              margin: 0,
              fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              fontSize: '1.0625rem',
              fontWeight: 600,
              color: 'var(--pw-label-fg, #002021)',
            }}
          >
            Strength
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              color: 'var(--pw-label-sublabel-fg, #545454)',
            }}
          >
            Choose the capsule strength your clinician recommended, or start with 100 mg.
          </p>
        </div>
        <div
          role="radiogroup"
          aria-labelledby="prog-strength-label"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
          }}
        >
          {STRENGTHS.map((opt, index) => {
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
                className="pw-motion-enter"
                onClick={() => {
                  setStrength(opt.value);
                  setJustSelectedStrength(opt.value);
                }}
                style={
                  {
                    '--pw-motion-enter-delay': 200 + index * 80 + 'ms',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.25rem',
                    minHeight: 72,
                    padding: 'var(--pw-control-padding, 1rem)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: 'var(--pw-radius, 0.5rem)',
                    border: selected
                      ? '2px solid var(--pw-color-brand, #161336)'
                      : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                    background: selected
                      ? 'var(--pw-answer-surface-selected, #F1F0E8)'
                      : 'var(--pw-answer-surface, #ffffff)',
                    color: selected
                      ? 'var(--pw-answer-fg-selected, var(--pw-answer-fg, #1C1C21))'
                      : 'var(--pw-answer-fg, #1C1C21)',
                    boxShadow: selected
                      ? 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))'
                      : 'none',
                    transition:
                      'background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))',
                    fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                    boxSizing: 'border-box',
                  } as React.CSSProperties
                }
                onFocus={(e) => {
                  Object.assign(e.currentTarget.style, focusRing);
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'var(--pw-answer-font-size, 1rem)',
                      fontWeight: 600,
                      lineHeight: 1.3,
                    }}
                  >
                    {opt.label}
                  </span>
                  <span
                    aria-hidden
                    style={{
                      display: 'var(--pw-answer-indicator-display, flex)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 'var(--pw-answer-indicator-size, 18px)',
                      height: 'var(--pw-answer-indicator-size, 18px)',
                      minWidth: 'var(--pw-answer-indicator-size, 18px)',
                      borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                      border: selected
                        ? '2px solid var(--pw-answer-indicator-fill, #161336)'
                        : '2px solid var(--pw-answer-border, #E0E0E0)',
                      background: selected
                        ? 'var(--pw-answer-indicator-fill, #161336)'
                        : 'transparent',
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
                </span>
                <span
                  style={{
                    fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
                    color: 'var(--pw-answer-subtext-fg, var(--pw-label-sublabel-fg, #545454))',
                    lineHeight: 1.4,
                  }}
                >
                  {opt.hint}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Supply */}
      <section
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '280ms',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          } as React.CSSProperties
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h3
            id="prog-supply-label"
            style={{
              margin: 0,
              fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              fontSize: '1.0625rem',
              fontWeight: 600,
              color: 'var(--pw-label-fg, #002021)',
            }}
          >
            Supply
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              color: 'var(--pw-label-sublabel-fg, #545454)',
            }}
          >
            Longer supplies lower the cost per day.
          </p>
        </div>
        <div
          role="radiogroup"
          aria-labelledby="prog-supply-label"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {SUPPLIES.map((opt, index) => {
            const selected = supplyDays === opt.days;
            return (
              <button
                key={opt.priceId}
                ref={(el) => {
                  supplyRefs.current[opt.days] = el;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                className="pw-motion-enter"
                onClick={() => {
                  setSupplyDays(opt.days);
                  setJustSelectedSupply(opt.days);
                }}
                style={
                  {
                    '--pw-motion-enter-delay': 320 + index * 80 + 'ms',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--pw-answer-gap, 0.75rem)',
                    minHeight: 56,
                    padding: 'var(--pw-control-padding, 1rem)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: 'var(--pw-radius, 0.5rem)',
                    border: selected
                      ? '2px solid var(--pw-color-brand, #161336)'
                      : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                    background: selected
                      ? 'var(--pw-answer-surface-selected, #F1F0E8)'
                      : 'var(--pw-answer-surface, #ffffff)',
                    color: selected
                      ? 'var(--pw-answer-fg-selected, var(--pw-answer-fg, #1C1C21))'
                      : 'var(--pw-answer-fg, #1C1C21)',
                    boxShadow: selected
                      ? 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))'
                      : 'none',
                    transition:
                      'background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))',
                    fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                    boxSizing: 'border-box',
                  } as React.CSSProperties
                }
                onFocus={(e) => {
                  Object.assign(e.currentTarget.style, focusRing);
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      display: 'var(--pw-answer-indicator-display, flex)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 'var(--pw-answer-indicator-size, 18px)',
                      height: 'var(--pw-answer-indicator-size, 18px)',
                      minWidth: 'var(--pw-answer-indicator-size, 18px)',
                      borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                      border: selected
                        ? '2px solid var(--pw-answer-indicator-fill, #161336)'
                        : '2px solid var(--pw-answer-border, #E0E0E0)',
                      background: selected
                        ? 'var(--pw-answer-indicator-fill, #161336)'
                        : 'transparent',
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
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 'var(--pw-answer-font-size, 1rem)',
                          fontWeight: 600,
                          lineHeight: 1.3,
                        }}
                      >
                        {opt.label}
                      </span>
                      {opt.badge && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.15rem 0.5rem',
                            borderRadius: 999,
                            background: 'var(--pw-color-brand, #161336)',
                            color: 'var(--pw-color-brand-contrast, #ffffff)',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {opt.badge}
                        </span>
                      )}
                    </span>
                  </span>
                </span>
                <span
                  style={{
                    fontSize: 'var(--pw-answer-font-size, 1rem)',
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                  }}
                >
                  {formatMoney(opt.price)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '560ms',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            paddingTop: '0.25rem',
          } as React.CSSProperties
        }
      >
        <button
          type="button"
          onClick={handleAddToCart}
          className={addedPulse ? 'pw-motion-just-selected' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            minHeight: 52,
            padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
            border: 'none',
            borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
            background: 'var(--pw-button-bg, #161336)',
            color: 'var(--pw-button-fg, #ffffff)',
            fontFamily:
              'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight:
              (typeof window !== 'undefined'
                ? undefined
                : undefined) || 600,
            cursor: 'pointer',
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            transition:
              'opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), transform var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))',
          }}
          onFocus={(e) => {
            Object.assign(e.currentTarget.style, focusRing);
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          {addedPulse && (
            <span className="pw-motion-pop" aria-hidden style={{ fontSize: '1.1rem', lineHeight: 1 }}>
              ✓
            </span>
          )}
          {ctaLabel}
          <span style={{ opacity: 0.85, fontWeight: 500 }}>
            · {formatMoney(selectedSupply.price)}
          </span>
        </button>

        {inCart && (
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            style={{
              alignSelf: 'center',
              background: 'transparent',
              border: 'none',
              padding: '0.5rem 0.75rem',
              minHeight: 44,
              cursor: 'pointer',
              color: 'var(--pw-label-sublabel-fg, #545454)',
              fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              fontWeight: 500,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            View cart
            {progesteroneItems.length > 0
              ? ' (' +
                progesteroneItems.reduce((n, i) => n + i.quantity, 0) +
                ')'
              : ''}
          </button>
        )}

        {existingMatch && (
          <p
            style={{
              margin: 0,
              textAlign: 'center',
              fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
              color: 'var(--pw-color-muted, #71717a)',
            }}
          >
            This strength and supply are already in your cart.
          </p>
        )}

        {helperText ? (
          <p
            style={{
              margin: 0,
              textAlign: 'center',
              fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
              color: 'var(--pw-color-muted, #71717a)',
              lineHeight: 1.45,
            }}
          >
            {helperText}
          </p>
        ) : null}
      </div>

      {/* Cart drawer */}
      {drawerOpen && (
        <div
          role="presentation"
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'var(--pw-color-overlay, rgba(15,23,42,0.5))',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            onClick={(e) => e.stopPropagation()}
            className="pw-motion-enter"
            style={
              {
                '--pw-motion-enter-delay': '0ms',
                width: 'min(100%, 400px)',
                height: '100%',
                background: 'var(--pw-color-surface, #ffffff)',
                color: 'var(--pw-color-on-surface, #1C1C21)',
                boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                boxSizing: 'border-box',
              } as React.CSSProperties
            }
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: 'var(--pw-control-padding, 1rem)',
                borderBottom: '1px solid var(--pw-color-border, #EFEFEC)',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
                  color: 'var(--pw-label-fg, #002021)',
                }}
              >
                Your cart
              </h2>
              <button
                ref={drawerCloseRef}
                type="button"
                aria-label="Close cart"
                onClick={() => setDrawerOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  border: '1.5px solid var(--pw-color-border, #EFEFEC)',
                  borderRadius: 'var(--pw-radius, 0.5rem)',
                  background: 'var(--pw-color-surface, #ffffff)',
                  cursor: 'pointer',
                  color: 'var(--pw-color-on-surface, #1C1C21)',
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
                padding: 'var(--pw-control-padding, 1rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {(cart?.items?.length ?? 0) === 0 ? (
                <p
                  style={{
                    margin: '1.5rem 0 0',
                    textAlign: 'center',
                    color: 'var(--pw-color-muted, #71717a)',
                    fontSize: 'var(--pw-font-size-body, 1rem)',
                  }}
                >
                  Your cart is empty. Add progesterone above to continue.
                </p>
              ) : (
                (cart?.items ?? []).map((item, index) => {
                  const strengthLabel = getVariant(item, 'Strength');
                  const supplyLabel = getVariant(item, 'Supply');
                  const lineKey =
                    item.id +
                    '-' +
                    (item.variants ?? []).map((v) => v.name + ':' + v.value).join('|') +
                    '-' +
                    index;
                  return (
                    <div
                      key={lineKey}
                      className="pw-motion-enter"
                      style={
                        {
                          '--pw-motion-enter-delay': index * 60 + 'ms',
                          display: 'flex',
                          gap: '0.75rem',
                          padding: '0.875rem',
                          borderRadius: 'var(--pw-radius, 0.5rem)',
                          border: '1.5px solid var(--pw-color-border, #EFEFEC)',
                          background: 'var(--pw-color-surface, #ffffff)',
                          boxSizing: 'border-box',
                        } as React.CSSProperties
                      }
                    >
                      {item.image ? (
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            flexShrink: 0,
                            borderRadius: 'var(--pw-radius, 0.5rem)',
                            overflow: 'hidden',
                            background: 'var(--pw-answer-media-bg, #F1F0E8)',
                          }}
                        >
                          <img
                            src={item.image}
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
                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.35rem',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '0.5rem',
                            alignItems: 'flex-start',
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 600,
                              fontSize: 'var(--pw-font-size-body, 1rem)',
                              color: 'var(--pw-label-fg, #002021)',
                              lineHeight: 1.3,
                            }}
                          >
                            {item.name}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 600,
                              fontVariantNumeric: 'tabular-nums',
                              fontSize: 'var(--pw-font-size-body, 1rem)',
                              flexShrink: 0,
                            }}
                          >
                            {formatMoney(item.price * item.quantity)}
                          </p>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
                            color: 'var(--pw-label-sublabel-fg, #545454)',
                            lineHeight: 1.4,
                          }}
                        >
                          {[strengthLabel, supplyLabel].filter(Boolean).join(' · ')}
                          {item.quantity > 1 ? ' · Qty ' + item.quantity : ''}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          style={{
                            alignSelf: 'flex-start',
                            marginTop: '0.15rem',
                            minHeight: 44,
                            padding: '0.35rem 0',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--pw-color-error, #ef4444)',
                            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                            fontWeight: 500,
                            textDecoration: 'underline',
                            textUnderlineOffset: 2,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div
              style={{
                padding: 'var(--pw-control-padding, 1rem)',
                borderTop: '1px solid var(--pw-color-border, #EFEFEC)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '1rem',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--pw-font-size-body, 1rem)',
                    color: 'var(--pw-label-sublabel-fg, #545454)',
                  }}
                >
                  Subtotal
                </span>
                <span
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--pw-label-fg, #002021)',
                  }}
                >
                  {formatMoney(cart?.subtotal ?? 0)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                style={{
                  width: '100%',
                  minHeight: 52,
                  padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
                  border: 'none',
                  borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
                  background: 'var(--pw-button-bg, #161336)',
                  color: 'var(--pw-button-fg, #ffffff)',
                  fontFamily:
                    'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                  fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Keep shopping
              </button>
              <p
                style={{
                  margin: 0,
                  textAlign: 'center',
                  fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
                  color: 'var(--pw-color-muted, #71717a)',
                  lineHeight: 1.45,
                }}
              >
                Use Continue below to move on. {helperText}
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}