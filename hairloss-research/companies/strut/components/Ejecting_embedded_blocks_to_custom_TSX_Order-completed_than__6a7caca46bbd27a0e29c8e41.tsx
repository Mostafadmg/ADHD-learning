import React, { useState, useEffect } from 'react';

export const propSchema = {
  thankYouTitle: {
    type: 'string',
    title: 'Title',
    defaultValue: 'Order completed',
  },
  thankYouMessage: {
    type: 'string',
    title: 'Thank you message',
    defaultValue: 'Thank you — we received your order.',
  },
  reviewMessage: {
    type: 'string',
    title: 'Review message',
    defaultValue:
      'A doctor from our team will review your order and we will email you once your prescription has been written.',
  },
  expectationMessage: {
    type: 'string',
    title: 'Expectation message',
    defaultValue: 'You should hear from us within 48 hours.',
  },
  detailsHeading: {
    type: 'string',
    title: 'Order details heading',
    defaultValue: 'Your order',
  },
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

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function variantLabel(variants?: CartItemVariant[]): string | null {
  if (!variants || variants.length === 0) return null;
  return variants.map((v) => v.value).join(' · ');
}

export default function OrderCompleted({
  thankYouTitle = 'Order completed',
  thankYouMessage = 'Thank you — we received your order.',
  reviewMessage = 'A doctor from our team will review your order and we will email you once your prescription has been written.',
  expectationMessage = 'You should hear from us within 48 hours.',
  detailsHeading = 'Your order',
}: {
  thankYouTitle?: string;
  thankYouMessage?: string;
  reviewMessage?: string;
  expectationMessage?: string;
  detailsHeading?: string;
}) {
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    const cartApi = window.pathwai?.cart;
    if (!cartApi) {
      setCart({ items: [], subtotal: 0, total: 0 });
      return;
    }

    setCart(cartApi.getCart());

    const handleCartUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ cart: Cart }>).detail;
      if (detail?.cart) setCart(detail.cart);
    };

    window.addEventListener('pathwai:cart:updated', handleCartUpdate);
    return () => {
      window.removeEventListener('pathwai:cart:updated', handleCartUpdate);
    };
  }, []);

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const total = cart?.total ?? subtotal;

  const handleGoHome = () => {
    window.pathwai?.flow?.next();
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
      {/* Decorative checkmark only — no status label */}
      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          '--pw-motion-enter-delay': '0ms',
        } as React.CSSProperties}
        aria-hidden="true"
      >
        <div
          className="pw-motion-pop"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: '999px',
            background: 'var(--pw-state-hover, #F1F0E8)',
            color: 'var(--pw-color-brand, #161336)',
            flexShrink: 0,
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1.75"
            />
            <path
              d="M7.5 12.5L10.5 15.5L16.5 9"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Title + thank-you message */}
      <header
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          '--pw-motion-enter-delay': '100ms',
        } as React.CSSProperties}
      >
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
          {thankYouTitle}
        </h1>
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
          {thankYouMessage}
        </p>
      </header>

      {/* Order details */}
      <section
        className="pw-motion-enter"
        aria-labelledby="order-details-heading"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 1.25rem)',
          '--pw-motion-enter-delay': '200ms',
        } as React.CSSProperties}
      >
        <h2
          id="order-details-heading"
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: '1.125rem',
            fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
            lineHeight: 1.3,
            letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
            color: 'var(--pw-label-fg, #002021)',
          }}
        >
          {detailsHeading}
        </h2>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            background: 'var(--pw-color-surface, #ffffff)',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            overflow: 'hidden',
          }}
        >
          {cart === null ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                padding: 'var(--pw-control-padding, 1rem)',
              }}
            >
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="pw-motion-skeleton"
                  style={{
                    height: 56,
                    borderRadius: 'var(--pw-radius, 0.5rem)',
                    background: 'var(--pw-color-border, #EFEFEC)',
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p
              style={{
                margin: 0,
                padding: 'var(--pw-control-padding, 1rem)',
                fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-body, 1rem)',
                color: 'var(--pw-color-muted, #71717a)',
                lineHeight: 'var(--pw-font-line-height-body, 1.55)',
              }}
            >
              No items in this order.
            </p>
          ) : (
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {items.map((item, index) => {
                const variants = variantLabel(item.variants);
                const lineTotal = item.price * item.quantity;
                return (
                  <li
                    key={`${item.id}-${variants ?? ''}-${index}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 'var(--pw-element-gap, 1.25rem)',
                      padding: 'var(--pw-control-padding, 1rem)',
                      borderTop:
                        index === 0
                          ? 'none'
                          : '1px solid var(--pw-color-border, #EFEFEC)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                          fontSize: 'var(--pw-font-size-body, 1rem)',
                          fontWeight: 500,
                          lineHeight: 1.4,
                          color: 'var(--pw-color-on-surface, #1C1C21)',
                          wordBreak: 'break-word',
                        }}
                      >
                        {item.name}
                      </span>
                      {variants && (
                        <span
                          style={{
                            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                            fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
                            lineHeight: 1.4,
                            color: 'var(--pw-color-muted, #71717a)',
                            wordBreak: 'break-word',
                          }}
                        >
                          {variants}
                        </span>
                      )}
                      <span
                        style={{
                          fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                          fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                          fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
                          lineHeight: 1.4,
                          color: 'var(--pw-label-sublabel-fg, #545454)',
                        }}
                      >
                        Qty {item.quantity}
                        {item.quantity > 1
                          ? ` · ${formatMoney(item.price)} each`
                          : ''}
                      </span>
                    </div>
                    <span
                      style={{
                        flexShrink: 0,
                        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                        fontSize: 'var(--pw-font-size-body, 1rem)',
                        fontWeight: 500,
                        lineHeight: 1.4,
                        color: 'var(--pw-color-on-surface, #1C1C21)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {formatMoney(lineTotal)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {cart !== null && items.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                padding: 'var(--pw-control-padding, 1rem)',
                borderTop: '1px solid var(--pw-color-border, #EFEFEC)',
                background: 'var(--pw-state-hover, #F1F0E8)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                    fontSize: 'var(--pw-font-size-body, 1rem)',
                    fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
                    color: 'var(--pw-label-sublabel-fg, #545454)',
                  }}
                >
                  Subtotal
                </span>
                <span
                  style={{
                    fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                    fontSize: 'var(--pw-font-size-body, 1rem)',
                    fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
                    color: 'var(--pw-color-on-surface, #1C1C21)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {formatMoney(subtotal)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                    fontSize: 'var(--pw-font-size-body, 1rem)',
                    fontWeight: 600,
                    color: 'var(--pw-color-on-surface, #1C1C21)',
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: 'var(--pw-color-on-surface, #1C1C21)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {formatMoney(total)}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Doctor review + expectation */}
      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          padding: 'var(--pw-control-padding, 1rem)',
          borderRadius: 'var(--pw-radius, 0.5rem)',
          background: 'var(--pw-color-surface, #ffffff)',
          border: '1px solid var(--pw-color-border, #EFEFEC)',
          '--pw-motion-enter-delay': '300ms',
        } as React.CSSProperties}
      >
        <p
          style={{
            margin: 0,
            fontFamily:
              'var(--pw-content-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize:
              'var(--pw-content-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight:
              'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
            lineHeight:
              'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))',
            color: 'var(--pw-content-fg, var(--pw-color-on-surface, #1C1C21))',
          }}
        >
          {reviewMessage}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 500,
            lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            color: 'var(--pw-color-on-surface, #1C1C21)',
          }}
        >
          {expectationMessage}
        </p>
      </div>

      {/* Go to Home */}
      <div
        className="pw-motion-enter"
        style={{
          width: '100%',
          '--pw-motion-enter-delay': '400ms',
        } as React.CSSProperties}
      >
        <button
          type="button"
          onClick={handleGoHome}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minHeight: 48,
            boxSizing: 'border-box',
            margin: 0,
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
            fontWeight:
              'var(--pw-navigation-button-font-weight, 500)' as unknown as number,
            lineHeight: 1.4,
            cursor: 'pointer',
            transition:
              'background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), transform var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.92';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.98)';
            e.currentTarget.style.opacity = '0.88';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.opacity = '0.92';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid var(--pw-state-focus-ring, #8399BF)';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
            e.currentTarget.style.outlineOffset = '0';
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}