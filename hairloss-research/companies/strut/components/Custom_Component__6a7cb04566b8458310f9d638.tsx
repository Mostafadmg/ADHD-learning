import React, { useState, useEffect } from 'react';

export const propSchema = {
  thankYouTitle: {
    type: 'string',
    title: 'Title',
    defaultValue: 'Order completed',
  },
  thankYouMessage: {
    type: 'string',
    title: 'Message',
    defaultValue: 'Thank you — we received your order.',
  },
  detailsHeading: {
    type: 'string',
    title: 'Order section heading',
    defaultValue: 'Your order',
  },
  reviewMessage: {
    type: 'string',
    title: 'Doctor review message',
    defaultValue:
      'A doctor from our team will review your order and we will email you once your prescription has been written.',
  },
  expectationMessage: {
    type: 'string',
    title: 'Expectation message',
    defaultValue: 'You should hear from us within 48 hours.',
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

function formatVariants(variants?: CartItemVariant[]): string | null {
  if (!variants || variants.length === 0) return null;
  return variants.map((v) => `${v.name}: ${v.value}`).join(' · ');
}

export default function OrderCompletedThankYou({
  thankYouTitle = 'Order completed',
  thankYouMessage = 'Thank you — we received your order.',
  detailsHeading = 'Your order',
  reviewMessage = 'A doctor from our team will review your order and we will email you once your prescription has been written.',
  expectationMessage = 'You should hear from us within 48 hours.',
}: {
  thankYouTitle?: string;
  thankYouMessage?: string;
  detailsHeading?: string;
  reviewMessage?: string;
  expectationMessage?: string;
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

  const handleGoHome = () => {
    window.pathwai?.flow?.next();
  };

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const total = cart?.total ?? 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 617px)',
        margin: '0 auto',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
        boxSizing: 'border-box',
      }}
    >
      {/* Checkmark + heading group */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 'var(--pw-element-gap, 1.25rem)',
        }}
      >
        <div
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '0ms',
              width: 64,
              height: 64,
              borderRadius: '999px',
              background: 'var(--pw-state-hover, #F1F0E8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            } as React.CSSProperties
          }
          aria-hidden="true"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="var(--pw-color-brand, #161336)"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            width: '100%',
          }}
        >
          <h1
            className="pw-motion-enter"
            style={
              {
                '--pw-motion-enter-delay': '80ms',
                margin: 0,
                fontFamily:
                  'var(--pw-label-font-family, var(--pw-font-family-title, Figtree, system-ui, sans-serif))',
                fontSize:
                  'var(--pw-label-font-size, var(--pw-font-size-title, 1.75rem))',
                fontWeight:
                  'var(--pw-label-font-weight, var(--pw-font-weight-title, 500))',
                lineHeight: 'var(--pw-label-line-height, 1.2)',
                letterSpacing: 'var(--pw-label-letter-spacing, -0.01em)',
                color: 'var(--pw-label-fg, #002021)',
              } as React.CSSProperties
            }
          >
            {thankYouTitle}
          </h1>

          <p
            className="pw-motion-enter"
            style={
              {
                '--pw-motion-enter-delay': '140ms',
                margin: 0,
                fontFamily:
                  'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-body, 1rem)',
                fontWeight: 'var(--pw-font-weight-body, 400)',
                lineHeight: 'var(--pw-font-line-height-body, 1.55)',
                color: 'var(--pw-label-sublabel-fg, #545454)',
              } as React.CSSProperties
            }
          >
            {thankYouMessage}
          </p>
        </div>
      </div>

      {/* Order details */}
      <section
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '200ms',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 1.25rem)',
            padding: 'var(--pw-control-padding, 1rem)',
            background: 'var(--pw-color-surface, #ffffff)',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
          } as React.CSSProperties
        }
        aria-labelledby="order-details-heading"
      >
        <h2
          id="order-details-heading"
          style={{
            margin: 0,
            fontFamily:
              'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 600,
            lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            color: 'var(--pw-label-fg, #002021)',
          }}
        >
          {detailsHeading}
        </h2>

        {items.length === 0 ? (
          <p
            style={{
              margin: 0,
              fontFamily:
                'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 'var(--pw-font-weight-body, 400)',
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
              gap: '0.75rem',
            }}
          >
            {items.map((item, index) => {
              const variantLabel = formatVariants(item.variants);
              const lineTotal = item.price * item.quantity;
              const key = `${item.id}-${variantLabel ?? 'default'}-${index}`;

              return (
                <li
                  key={key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 'var(--pw-answer-gap, 0.75rem)',
                    paddingBottom: index < items.length - 1 ? '0.75rem' : 0,
                    borderBottom:
                      index < items.length - 1
                        ? '1px solid var(--pw-color-border, #EFEFEC)'
                        : 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        fontFamily:
                          'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                        fontSize: 'var(--pw-font-size-body, 1rem)',
                        fontWeight: 500,
                        color: 'var(--pw-color-on-surface, #1C1C21)',
                        lineHeight: 1.4,
                        wordBreak: 'break-word',
                      }}
                    >
                      {item.name}
                    </span>
                    {variantLabel && (
                      <span
                        style={{
                          fontFamily:
                            'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                          fontSize:
                            'var(--pw-font-size-caption, 0.875rem)',
                          fontWeight: 'var(--pw-font-weight-body, 400)',
                          color: 'var(--pw-color-muted, #71717a)',
                          lineHeight: 1.4,
                          wordBreak: 'break-word',
                        }}
                      >
                        {variantLabel}
                      </span>
                    )}
                    <span
                      style={{
                        fontFamily:
                          'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                        fontSize:
                          'var(--pw-font-size-caption, 0.875rem)',
                        fontWeight: 'var(--pw-font-weight-body, 400)',
                        color: 'var(--pw-label-sublabel-fg, #545454)',
                        lineHeight: 1.4,
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
                      fontFamily:
                        'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                      fontSize: 'var(--pw-font-size-body, 1rem)',
                      fontWeight: 500,
                      color: 'var(--pw-color-on-surface, #1C1C21)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {formatMoney(lineTotal)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            paddingTop: '0.25rem',
            borderTop: '1px solid var(--pw-color-border, #EFEFEC)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span
              style={{
                fontFamily:
                  'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-body, 1rem)',
                fontWeight: 'var(--pw-font-weight-body, 400)',
                color: 'var(--pw-label-sublabel-fg, #545454)',
              }}
            >
              Subtotal
            </span>
            <span
              style={{
                fontFamily:
                  'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-body, 1rem)',
                fontWeight: 'var(--pw-font-weight-body, 400)',
                color: 'var(--pw-color-on-surface, #1C1C21)',
              }}
            >
              {formatMoney(subtotal)}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span
              style={{
                fontFamily:
                  'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-body, 1rem)',
                fontWeight: 600,
                color: 'var(--pw-label-fg, #002021)',
              }}
            >
              Total
            </span>
            <span
              style={{
                fontFamily:
                  'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-body, 1rem)',
                fontWeight: 600,
                color: 'var(--pw-label-fg, #002021)',
              }}
            >
              {formatMoney(total)}
            </span>
          </div>
        </div>
      </section>

      {/* Doctor review card */}
      <aside
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '280ms',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: 'var(--pw-control-padding, 1rem)',
            background: 'var(--pw-state-hover, #F1F0E8)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
          } as React.CSSProperties
        }
      >
        <p
          style={{
            margin: 0,
            fontFamily:
              'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 'var(--pw-font-weight-body, 400)',
            lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            color: 'var(--pw-color-on-surface, #1C1C21)',
          }}
        >
          {reviewMessage}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily:
              'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 500,
            lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            color: 'var(--pw-label-fg, #002021)',
          }}
        >
          {expectationMessage}
        </p>
      </aside>

      {/* Primary CTA */}
      <button
        type="button"
        className="pw-motion-enter"
        onClick={handleGoHome}
        style={
          {
            '--pw-motion-enter-delay': '360ms',
            width: '100%',
            minHeight: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
            background: 'var(--pw-button-bg, #161336)',
            color: 'var(--pw-button-fg, #ffffff)',
            border: 'none',
            borderRadius:
              'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
            fontFamily:
              'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize:
              'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight:
              'var(--pw-navigation-button-font-weight, 500)',
            cursor: 'pointer',
            transition: `opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), transform var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
            WebkitTapHighlightColor: 'transparent',
          } as React.CSSProperties
        }
      >
        Go to Home
      </button>
    </div>
  );
}