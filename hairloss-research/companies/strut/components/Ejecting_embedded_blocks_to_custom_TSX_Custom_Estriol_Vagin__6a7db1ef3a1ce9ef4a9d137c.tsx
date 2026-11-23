import React, { useState, useEffect, useCallback, useRef } from 'react';

export const propSchema = {
  productName: {
    type: 'string',
    title: 'Product name',
    defaultValue: 'Estriol Vaginal Cream (compounded)',
  },
  productSublabel: {
    type: 'string',
    title: 'Product sublabel',
    defaultValue: '0.1% vaginal cream',
  },
  productImage: {
    type: 'image',
    title: 'Product image',
    defaultValue:
      'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/media-1786622047975-2cd71fd375891623.png',
  },
  productId: {
    type: 'string',
    title: 'Product ID',
    defaultValue: 'estriol-vaginal-cream',
  },
  price30: {
    type: 'number',
    title: '30-day price',
    defaultValue: 99,
    min: 0,
    step: 1,
  },
  trustLine: {
    type: 'string',
    title: 'Trust line',
    defaultValue: 'Doctor consult · US licensed pharmacy',
  },
  ctaLabel: {
    type: 'string',
    title: 'CTA label',
    defaultValue: 'Add to cart →',
  },
  drawerHeight: {
    type: 'number',
    title: 'Cart drawer height',
    defaultValue: 480,
    min: 280,
    max: 720,
    step: 8,
  },
};

export const outputSchema = {
  productId: {
    type: 'string',
    title: 'Product ID',
    description: 'Stable product id, e.g. "estriol-vaginal-cream"',
    required: true,
  },
  quantity: {
    type: 'number',
    title: 'Quantity',
    description: 'Quantity of this product in the cart (0 if not added)',
    required: true,
  },
  added: {
    type: 'boolean',
    title: 'Added to cart',
    description: 'true when quantity > 0',
  },
  price: {
    type: 'number',
    title: 'Unit price',
    description: '30-day unit price used when adding to cart',
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

declare global {
  interface Window {
    pathwai?: {
      cart?: {
        addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
        removeItem: (id: string, variants?: CartItemVariant[]) => void;
        updateQuantity: (id: string, quantity: number, variants?: CartItemVariant[]) => void;
        clearCart: () => void;
        getItems: () => CartItem[];
        getSubtotal: () => number;
        getTotal: () => number;
        getCart: () => Cart;
      };
      flow?: {
        next: (answer?: unknown) => void;
        back: () => void;
        getProgress: () => {
          stepNumber: number;
          totalSteps: number;
          stepsRemaining: number;
          percent: number;
          isFirstStep: boolean;
          isLastStep: boolean;
        };
      };
    };
  }
}

function ProductImageFrame({
  src,
  alt,
  size,
}: {
  src: string;
  alt: string;
  size: number;
}) {
  const pad = size >= 90 ? 12 : 10;
  return (
    <div
      aria-hidden={!src}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        boxSizing: 'border-box',
        padding: pad,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--pw-color-surface, #F7F7F5)',
        border: '1px solid var(--pw-color-border, #EFEFEC)',
        borderRadius: 'var(--pw-radius, 0.5rem)',
        overflow: 'hidden',
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            objectPosition: 'center',
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'var(--pw-color-border, #EFEFEC)',
            borderRadius: 'calc(var(--pw-radius, 0.5rem) * 0.5)',
          }}
        />
      )}
    </div>
  );
}

export default function EstriolVaginalCreamOffer({
  productName = 'Estriol Vaginal Cream (compounded)',
  productSublabel = '0.1% vaginal cream',
  productImage = 'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/media-1786622047975-2cd71fd375891623.png',
  productId = 'estriol-vaginal-cream',
  price30 = 99,
  trustLine = 'Doctor consult · US licensed pharmacy',
  ctaLabel = 'Add to cart →',
  drawerHeight = 480,
  onChange,
  onAnswer,
}: {
  productName?: string;
  productSublabel?: string;
  productImage?: string;
  productId?: string;
  price30?: number;
  trustLine?: string;
  ctaLabel?: string;
  drawerHeight?: number;
  onChange?: (outputs: {
    productId: string;
    quantity: number;
    added: boolean;
    price: number;
  }) => void;
  onAnswer?: (outputs: {
    productId: string;
    quantity: number;
    added: boolean;
    price: number;
  }) => void;
}) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [ctaPop, setCtaPop] = useState(false);
  const ctaRef = useRef<HTMLButtonElement | null>(null);

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
      if (detail?.cart) setCart(detail.cart);
      else syncCart();
    };
    window.addEventListener('pathwai:cart:updated', handler as EventListener);
    return () =>
      window.removeEventListener('pathwai:cart:updated', handler as EventListener);
  }, [syncCart]);

  const lineItem =
    cart?.items.find((item) => item.id === productId) ?? null;
  const quantity = lineItem?.quantity ?? 0;
  const cartCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const emit = useCallback(
    (qty: number) => {
      const payload = {
        productId,
        quantity: qty,
        added: qty > 0,
        price: price30,
      };
      onChange?.(payload);
      onAnswer?.(payload);
    },
    [onChange, onAnswer, productId, price30]
  );

  useEffect(() => {
    emit(quantity);
  }, [quantity, emit]);

  useEffect(() => {
    if (!justAdded) return;
    const t = window.setTimeout(() => setJustAdded(false), 600);
    return () => window.clearTimeout(t);
  }, [justAdded]);

  useEffect(() => {
    if (!ctaPop || !ctaRef.current) return;
    const el = ctaRef.current;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [ctaPop]);

  const handleAdd = () => {
    window.pathwai?.cart?.addItem({
      id: productId,
      name: productName,
      price: price30,
      image: productImage,
      quantity: 1,
    });
    setJustAdded(true);
    setCtaPop((v) => !v);
    if (!window.pathwai?.cart) {
      setCart((prev) => {
        const items = prev?.items ?? [];
        const existing = items.find((i) => i.id === productId);
        const nextItems = existing
          ? items.map((i) =>
              i.id === productId ? { ...i, quantity: i.quantity + 1 } : i
            )
          : [
              ...items,
              {
                id: productId,
                name: productName,
                price: price30,
                image: productImage,
                quantity: 1,
              },
            ];
        const subtotal = nextItems.reduce(
          (s, i) => s + i.price * i.quantity,
          0
        );
        return { items: nextItems, subtotal, total: subtotal };
      });
    }
  };

  const handleQuantity = (nextQty: number) => {
    if (nextQty <= 0) {
      window.pathwai?.cart?.removeItem(productId);
      if (!window.pathwai?.cart) {
        setCart((prev) => {
          const items = (prev?.items ?? []).filter((i) => i.id !== productId);
          const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
          return { items, subtotal, total: subtotal };
        });
      }
      return;
    }
    window.pathwai?.cart?.updateQuantity(productId, nextQty);
    if (!window.pathwai?.cart) {
      setCart((prev) => {
        const items = (prev?.items ?? []).map((i) =>
          i.id === productId ? { ...i, quantity: nextQty } : i
        );
        const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
        return { items, subtotal, total: subtotal };
      });
    }
  };

  const handleDrawerQuantity = (id: string, nextQty: number) => {
    if (nextQty <= 0) {
      window.pathwai?.cart?.removeItem(id);
      if (!window.pathwai?.cart) {
        setCart((prev) => {
          const items = (prev?.items ?? []).filter((i) => i.id !== id);
          const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
          return { items, subtotal, total: subtotal };
        });
      }
      return;
    }
    window.pathwai?.cart?.updateQuantity(id, nextQty);
    if (!window.pathwai?.cart) {
      setCart((prev) => {
        const items = (prev?.items ?? []).map((i) =>
          i.id === id ? { ...i, quantity: nextQty } : i
        );
        const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
        return { items, subtotal, total: subtotal };
      });
    }
  };

  const formatPrice = (n: number) =>
    n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;

  const total = cart?.total ?? 0;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 617px)',
        margin: '0 auto',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* Cart trigger */}
      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 'var(--pw-element-gap, 1.25rem)',
          // @ts-expect-error CSS var
          '--pw-motion-enter-delay': '0ms',
        }}
      >
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            minHeight: 44,
            padding: '0.5rem 0.85rem',
            borderRadius: '999px',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
            background: 'var(--pw-color-surface, #ffffff)',
            color: 'var(--pw-color-on-surface, #1C1C21)',
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            style={{ flexShrink: 0 }}
          >
            <path
              d="M6 6h15l-1.5 9h-12L6 6z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L5 3H2"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            <circle cx="9" cy="20" r="1.25" fill="currentColor" />
            <circle cx="18" cy="20" r="1.25" fill="currentColor" />
          </svg>
          <span style={{ color: 'var(--pw-color-muted, #71717a)' }}>Cart</span>
          <span
            style={{
              minWidth: 22,
              height: 22,
              padding: '0 6px',
              borderRadius: 999,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--pw-color-brand, #161336)',
              color: 'var(--pw-color-brand-contrast, #ffffff)',
              fontSize: '0.75rem',
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {cartCount}
          </span>
        </button>
      </div>

      {/* Product card */}
      <section
        className="pw-motion-enter"
        style={{
          // @ts-expect-error CSS var
          '--pw-motion-enter-delay': '80ms',
          background: 'var(--pw-color-surface, #ffffff)',
          border: '1px solid var(--pw-color-border, #EFEFEC)',
          borderRadius: 'var(--pw-radius, 0.5rem)',
          boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
          padding: 'var(--pw-control-padding, 1rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 1.25rem)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 'var(--pw-element-gap, 1.25rem)',
            alignItems: 'flex-start',
          }}
        >
          <ProductImageFrame src={productImage} alt={productName} size={104} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                margin: 0,
                fontFamily:
                  'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-title, 1.75rem)',
                fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
                lineHeight: 'var(--pw-font-line-height-title, 1.2)',
                letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
                color: 'var(--pw-label-fg, #002021)',
                wordBreak: 'break-word',
              }}
            >
              {productName}
            </h1>
            {productSublabel ? (
              <p
                style={{
                  margin: '0.35rem 0 0',
                  fontFamily:
                    'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-body, 1rem)',
                  fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
                  color: 'var(--pw-label-sublabel-fg, #545454)',
                  lineHeight: 1.45,
                }}
              >
                {productSublabel}
              </p>
            ) : null}

            <div
              style={{
                marginTop: '0.85rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                gap: '0.4rem 0.65rem',
              }}
            >
              <span
                style={{
                  fontFamily:
                    'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: 'var(--pw-color-on-surface, #1C1C21)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {formatPrice(price30)}
              </span>
              <span
                style={{
                  fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                  color: 'var(--pw-color-muted, #71717a)',
                }}
              >
                30-day supply
              </span>
            </div>
          </div>
        </div>

        {trustLine ? (
          <p
            style={{
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              color: 'var(--pw-color-muted, #71717a)',
              lineHeight: 1.4,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: 'var(--pw-color-brand, #161336)',
                flexShrink: 0,
                opacity: 0.7,
              }}
            />
            {trustLine}
          </p>
        ) : null}

        {quantity === 0 ? (
          <button
            ref={ctaRef}
            type="button"
            onClick={handleAdd}
            className="pw-motion-enter"
            style={{
              // @ts-expect-error CSS var
              '--pw-motion-enter-delay': '160ms',
              width: '100%',
              minHeight: 52,
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
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: `transform var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
            }}
          >
            {ctaLabel}
          </button>
        ) : (
          <div
            className={justAdded ? 'pw-motion-just-selected' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              flexWrap: 'wrap',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--pw-radius, 0.5rem)',
              background: 'var(--pw-answer-surface-selected, #F1F0E8)',
              border: '1.5px solid var(--pw-color-brand, #161336)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                className="pw-motion-pop"
                aria-hidden
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  background: 'var(--pw-answer-indicator-fill, #161336)',
                  color: 'var(--pw-answer-indicator-check, #ffffff)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                ✓
              </span>
              <span
                style={{
                  fontWeight: 500,
                  color: 'var(--pw-answer-fg-selected, #1C1C21)',
                  fontSize: 'var(--pw-font-size-body, 1rem)',
                }}
              >
                In your cart
              </span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => handleQuantity(quantity - 1)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--pw-radius, 0.5rem)',
                  border: '1px solid var(--pw-answer-border, #E0E0E0)',
                  background: 'var(--pw-color-surface, #ffffff)',
                  color: 'var(--pw-color-on-surface, #1C1C21)',
                  fontSize: '1.25rem',
                  lineHeight: 1,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                −
              </button>
              <span
                aria-live="polite"
                style={{
                  minWidth: 36,
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: 'var(--pw-font-size-body, 1rem)',
                  color: 'var(--pw-color-on-surface, #1C1C21)',
                }}
              >
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => handleQuantity(quantity + 1)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--pw-radius, 0.5rem)',
                  border: '1px solid var(--pw-answer-border, #E0E0E0)',
                  background: 'var(--pw-color-surface, #ffffff)',
                  color: 'var(--pw-color-on-surface, #1C1C21)',
                  fontSize: '1.25rem',
                  lineHeight: 1,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Cart drawer */}
      {drawerOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Your cart"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
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
          <div
            className="pw-motion-enter"
            style={{
              // @ts-expect-error CSS var
              '--pw-motion-enter-delay': '0ms',
              position: 'relative',
              width: '100%',
              maxWidth: 480,
              maxHeight: drawerHeight,
              height: 'min(100%, ' + drawerHeight + 'px)',
              background: 'var(--pw-color-surface, #ffffff)',
              borderRadius: 'var(--pw-radius, 0.5rem) var(--pw-radius, 0.5rem) 0 0',
              boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--pw-control-padding, 1rem)',
                borderBottom: '1px solid var(--pw-color-border, #EFEFEC)',
                gap: '0.75rem',
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontFamily:
                      'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: 'var(--pw-label-fg, #002021)',
                  }}
                >
                  Your cart
                </h2>
                <p
                  style={{
                    margin: '0.2rem 0 0',
                    fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                    color: 'var(--pw-color-muted, #71717a)',
                  }}
                >
                  {cartCount === 0
                    ? 'No items yet'
                    : cartCount === 1
                      ? '1 item'
                      : `${cartCount} items`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--pw-radius, 0.5rem)',
                  border: '1px solid var(--pw-color-border, #EFEFEC)',
                  background: 'var(--pw-color-surface, #ffffff)',
                  color: 'var(--pw-color-on-surface, #1C1C21)',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  lineHeight: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
                gap: '0.85rem',
              }}
            >
              {(cart?.items?.length ?? 0) === 0 ? (
                <p
                  style={{
                    margin: '1.5rem 0',
                    textAlign: 'center',
                    color: 'var(--pw-color-muted, #71717a)',
                    fontSize: 'var(--pw-font-size-body, 1rem)',
                  }}
                >
                  Your cart is empty. Add this cream to continue.
                </p>
              ) : (
                cart!.items.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="pw-motion-enter"
                    style={{
                      // @ts-expect-error CSS var
                      '--pw-motion-enter-delay': `${index * 80}ms`,
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'center',
                      padding: '0.65rem',
                      borderRadius: 'var(--pw-radius, 0.5rem)',
                      border: '1px solid var(--pw-color-border, #EFEFEC)',
                      background: 'var(--pw-answer-surface, #ffffff)',
                    }}
                  >
                    <ProductImageFrame
                      src={item.image || productImage}
                      alt={item.name}
                      size={60}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 500,
                          fontSize: 'var(--pw-font-size-body, 1rem)',
                          color: 'var(--pw-answer-fg, #1C1C21)',
                          lineHeight: 1.3,
                          wordBreak: 'break-word',
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          marginTop: 2,
                          fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                          color: 'var(--pw-color-muted, #71717a)',
                        }}
                      >
                        {formatPrice(item.price)} each
                      </div>
                      <div
                        style={{
                          marginTop: '0.5rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name}`}
                          onClick={() =>
                            handleDrawerQuantity(item.id, item.quantity - 1)
                          }
                          style={{
                            width: 36,
                            height: 36,
                            minWidth: 36,
                            borderRadius: 'var(--pw-radius, 0.5rem)',
                            border: '1px solid var(--pw-answer-border, #E0E0E0)',
                            background: 'var(--pw-color-surface, #ffffff)',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            lineHeight: 1,
                            color: 'var(--pw-color-on-surface, #1C1C21)',
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            minWidth: 28,
                            textAlign: 'center',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.name}`}
                          onClick={() =>
                            handleDrawerQuantity(item.id, item.quantity + 1)
                          }
                          style={{
                            width: 36,
                            height: 36,
                            minWidth: 36,
                            borderRadius: 'var(--pw-radius, 0.5rem)',
                            border: '1px solid var(--pw-answer-border, #E0E0E0)',
                            background: 'var(--pw-color-surface, #ffffff)',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            lineHeight: 1,
                            color: 'var(--pw-color-on-surface, #1C1C21)',
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 'var(--pw-font-size-body, 1rem)',
                        color: 'var(--pw-color-on-surface, #1C1C21)',
                        whiteSpace: 'nowrap',
                        alignSelf: 'flex-start',
                        paddingTop: 2,
                      }}
                    >
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))
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
                }}
              >
                <span
                  style={{
                    color: 'var(--pw-color-muted, #71717a)',
                    fontSize: 'var(--pw-font-size-body, 1rem)',
                  }}
                >
                  Subtotal
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    color: 'var(--pw-color-on-surface, #1C1C21)',
                  }}
                >
                  {formatPrice(total)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                style={{
                  width: '100%',
                  minHeight: 48,
                  border: 'none',
                  borderRadius:
                    'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
                  background: 'var(--pw-button-bg, #161336)',
                  color: 'var(--pw-button-fg, #ffffff)',
                  fontFamily:
                    'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                  fontSize: 'var(--pw-font-size-body, 1rem)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}