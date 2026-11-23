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
    title: 'Review message',
    defaultValue:
      'A doctor from our team will review your order and we will email you once your prescription has been written.',
  },
  expectationMessage: {
    type: 'string',
    title: 'Expectation message',
    defaultValue: 'You should hear from us within 48 hours.',
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

export default function OrderCompleted({
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
      setCart(detail.cart);
    };
    window.addEventListener('pathwai:cart:updated', handleCartUpdate);
    return () => window.removeEventListener('pathwai:cart:updated', handleCartUpdate);
  }, []);

  const handleHome = () => {
    window.pathwai?.flow?.next();
  };

  const formatMoney = (n: number) =>
    '$' + (Number.isFinite(n) ? n : 0).toFixed(2);

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const total = cart?.total ?? 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--pw-section-gap, 1.5rem)',
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 617px)',
        margin: '0 auto',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      {/* 1. Decorative checkmark icon only */}
      <div
        className="pw-motion-enter"
        style={
          {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            '--pw-motion-enter-delay': '0ms',
          } as React.CSSProperties
        }
      >
        <div
          aria-hidden="true"
          className="pw-motion-pop"
          style={{
            width: 56,
            height: 56,
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
            <path
              d="M6.5 12.5l3.5 3.5 7.5-8"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* 2–3. Title + message */}
      <div
        className="pw-motion-enter"
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            width: '100%',
            textAlign: 'center',
            '--pw-motion-enter-delay': '80ms',
          } as React.CSSProperties
        }
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
            textAlign: 'center',
          }}
        >
          {thankYouTitle}
        </h1>
        <p
          style={{
            margin: 0,
            fontFamily:
              'var(--pw-content-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-content-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight:
              'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
            lineHeight:
              'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))',
            color: 'var(--pw-label-sublabel-fg, #545454)',
            textAlign: 'center',
          }}
        >
          {thankYouMessage}
        </p>
      </div>

      {/* 4. Your order — cart line items */}
      <section
        className="pw-motion-enter"
        aria-label={detailsHeading}
        style={
          {
            '--pw-motion-enter-delay': '160ms',
            width: '100%',
            boxSizing: 'border-box',
            background: 'var(--pw-color-surface, #ffffff)',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            padding: 'var(--pw-control-padding, 1rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: '0.875rem',
            textAlign: 'center',
          } as React.CSSProperties
        }
      >
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 600,
            color: 'var(--pw-label-fg, #002021)',
            textAlign: 'center',
          }}
        >
          {detailsHeading}
        </h2>

        {items.length === 0 ? (
          <p
            style={{
              margin: 0,
              fontSize: 'var(--pw-font-size-body, 1rem)',
              color: 'var(--pw-color-muted, #71717a)',
              textAlign: 'center',
            }}
          >
            No items in your cart.
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
              width: '100%',
              textAlign: 'left',
            }}
          >
            {items.map((item, index) => {
              const variantKey =
                item.variants?.map((v) => `${v.name}:${v.value}`).join('|') ?? '';
              const lineKey = `${item.id}-${variantKey}-${index}`;
              const lineTotal = item.price * item.quantity;
              return (
                <li
                  key={lineKey}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 'var(--pw-element-gap, 1.25rem)',
                    paddingBottom: index < items.length - 1 ? '0.75rem' : 0,
                    borderBottom:
                      index < items.length - 1
                        ? '1px solid var(--pw-color-border, #EFEFEC)'
                        : 'none',
                    width: '100%',
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
                    <div
                      style={{
                        fontSize: 'var(--pw-font-size-body, 1rem)',
                        fontWeight: 500,
                        color: 'var(--pw-answer-fg, #1C1C21)',
                        wordBreak: 'break-word',
                      }}
                    >
                      {item.name}
                    </div>
                    {item.variants && item.variants.length > 0 && (
                      <div
                        style={{
                          marginTop: 2,
                          fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                          color:
                            'var(--pw-answer-subtext-fg, var(--pw-label-sublabel-fg, #545454))',
                        }}
                      >
                        {item.variants.map((v) => `${v.name}: ${v.value}`).join(' · ')}
                      </div>
                    )}
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                        color: 'var(--pw-color-muted, #71717a)',
                      }}
                    >
                      Qty {item.quantity}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--pw-font-size-body, 1rem)',
                      fontWeight: 500,
                      color: 'var(--pw-color-on-surface, #1C1C21)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatMoney(lineTotal)}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div
          style={{
            height: 1,
            background: 'var(--pw-color-border, #EFEFEC)',
            width: '100%',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 'var(--pw-element-gap, 1.25rem)',
              width: '100%',
            }}
          >
            <span
              style={{
                fontSize: 'var(--pw-font-size-body, 1rem)',
                color: 'var(--pw-color-muted, #71717a)',
              }}
            >
              Subtotal
            </span>
            <span
              style={{
                fontSize: 'var(--pw-font-size-body, 1rem)',
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
              alignItems: 'baseline',
              gap: 'var(--pw-element-gap, 1.25rem)',
              width: '100%',
            }}
          >
            <span
              style={{
                fontSize: 'var(--pw-font-size-body, 1rem)',
                fontWeight: 600,
                color: 'var(--pw-label-fg, #002021)',
              }}
            >
              Total
            </span>
            <span
              style={{
                fontSize: 'var(--pw-font-size-body, 1rem)',
                fontWeight: 600,
                color: 'var(--pw-color-on-surface, #1C1C21)',
              }}
            >
              {formatMoney(total)}
            </span>
          </div>
        </div>
      </section>

      {/* 5. Doctor review card — generic, not a named profile */}
      <section
        className="pw-motion-enter"
        aria-label="What happens next"
        style={
          {
            '--pw-motion-enter-delay': '240ms',
            width: '100%',
            boxSizing: 'border-box',
            background: 'var(--pw-color-surface, #ffffff)',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            padding: 'var(--pw-control-padding, 1rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            textAlign: 'center',
          } as React.CSSProperties
        }
      >
        <p
          style={{
            margin: 0,
            fontSize: 'var(--pw-font-size-body, 1rem)',
            lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            color: 'var(--pw-color-on-surface, #1C1C21)',
            textAlign: 'center',
          }}
        >
          {reviewMessage}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--pw-font-size-body, 1rem)',
            lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            color: 'var(--pw-label-sublabel-fg, #545454)',
            textAlign: 'center',
          }}
        >
          {expectationMessage}
        </p>
      </section>

      {/* 6. Go to Home */}
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '320ms',
            paddingTop: '0.25rem',
            width: '100%',
          } as React.CSSProperties
        }
      >
        <button
          type="button"
          onClick={handleHome}
          style={{
            width: '100%',
            minHeight: 48,
            display: 'inline-flex',
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
              'var(--pw-navigation-button-font-weight, 600)' as unknown as number,
            cursor: 'pointer',
            transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline =
              '2px solid var(--pw-state-focus-ring, #8399BF)';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}