import React, { useState, useEffect, useRef } from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'Choose your Estradiol Patch supply',
  },
  sublabel: {
    type: 'string',
    title: 'Sublabel',
    defaultValue:
      'A transdermal patch that delivers a steady dose of bioidentical estradiol through the skin. Your physician may adjust strength or add progesterone based on your health profile.',
  },
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
    description: 'Cart price id: "2204" (30-day), "2212" (90-day), or "2217" (150-day)',
    required: true,
  },
  productId: {
    type: 'string',
    title: 'Product ID',
    description: 'Stable product key: "estradiol-patch"',
  },
  productName: {
    type: 'string',
    title: 'Product name',
  },
};

type SupplyOption = {
  days: number;
  priceId: string;
  label: string;
  detail: string;
  priceLabel: string;
  badge?: string;
};

const SUPPLY_OPTIONS: SupplyOption[] = [
  {
    days: 30,
    priceId: '2204',
    label: '30-day supply',
    detail: '1 month · ships once',
    priceLabel: 'Monthly',
  },
  {
    days: 90,
    priceId: '2212',
    label: '90-day supply',
    detail: '3 months · best balance',
    priceLabel: 'Every 3 months',
    badge: 'Popular',
  },
  {
    days: 150,
    priceId: '2217',
    label: '150-day supply',
    detail: '5 months · fewer refills',
    priceLabel: 'Every 5 months',
    badge: 'Best value',
  },
];

const PRODUCT_ID = 'estradiol-patch';

declare global {
  interface Window {
    pathwai?: {
      cart?: {
        addItem?: (item: {
          id: string;
          name: string;
          price: number;
          quantity?: number;
          image?: string;
          variants?: { name: string; value: string }[];
        }) => void;
        removeItem?: (id: string, variants?: { name: string; value: string }[]) => void;
        updateQuantity?: (
          id: string,
          quantity: number,
          variants?: { name: string; value: string }[]
        ) => void;
        clearCart?: () => void;
        setItems?: (items: unknown[]) => void;
        updateCart?: (cart: unknown) => void;
        getItems?: () => unknown[];
        getCart?: () => unknown;
        getSubtotal?: () => number;
        getTotal?: () => number;
      };
      flow?: {
        next?: (answer?: unknown) => void;
        back?: () => void;
        setCart?: (cart: unknown) => void;
        setAnswer?: (value: unknown) => void;
        getStepId?: () => string | null;
        getProgress?: () => {
          stepNumber: number;
          totalSteps: number;
          stepsRemaining: number;
          percent: number;
          isFirstStep: boolean;
          isLastStep: boolean;
        };
        getAnswers?: () => Record<string, unknown>;
      };
    };
  }
}

function writeCart(priceId: string, productName: string, image: string, days: number) {
  const cart = window.pathwai?.cart;
  const flow = window.pathwai?.flow;

  const lineItem = {
    id: priceId,
    priceId,
    name: productName,
    price: 0,
    quantity: 1,
    image,
    variants: [{ name: 'Supply', value: `${days}-day` }],
  };

  try {
    cart?.clearCart?.();
  } catch {
    /* ignore */
  }

  try {
    if (typeof cart?.setItems === 'function') {
      cart.setItems([{ priceId, id: priceId, quantity: 1, name: productName, image }]);
      return;
    }
  } catch {
    /* fall through */
  }

  try {
    if (typeof cart?.updateCart === 'function') {
      cart.updateCart({ items: [{ priceId, id: priceId, quantity: 1, name: productName, image }] });
      return;
    }
  } catch {
    /* fall through */
  }

  try {
    if (typeof flow?.setCart === 'function') {
      flow.setCart({ items: [{ priceId, id: priceId, quantity: 1, name: productName, image }] });
      return;
    }
  } catch {
    /* fall through */
  }

  try {
    cart?.addItem?.({
      id: priceId,
      name: productName,
      price: 0,
      quantity: 1,
      image,
      variants: lineItem.variants,
    });
  } catch {
    /* ignore */
  }
}

export default function EstradiolPatchSupply({
  title = 'Choose your Estradiol Patch supply',
  sublabel = 'A transdermal patch that delivers a steady dose of bioidentical estradiol through the skin. Your physician may adjust strength or add progesterone based on your health profile.',
  productName = 'Estradiol Patch',
  productImage = 'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/image-1784145684303-cc15d83f2164a6ca.png',
  ctaLabel = 'Add to cart & continue',
  onChange,
  onAnswer,
}: {
  title?: string;
  sublabel?: string;
  productName?: string;
  productImage?: string;
  ctaLabel?: string;
  onChange?: (outputs: {
    supplyDays: number;
    priceId: string;
    productId: string;
    productName: string;
  }) => void;
  onAnswer?: (outputs: {
    supplyDays: number;
    priceId: string;
    productId: string;
    productName: string;
  }) => void;
}) {
  const [selectedDays, setSelectedDays] = useState<number | null>(90);
  const [justSelected, setJustSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const optionRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const selected = SUPPLY_OPTIONS.find((o) => o.days === selectedDays) ?? null;

  useEffect(() => {
    if (!selected) return;
    const outputs = {
      supplyDays: selected.days,
      priceId: selected.priceId,
      productId: PRODUCT_ID,
      productName,
    };
    onChange?.(outputs);
    onAnswer?.(outputs);
  }, [selected, productName, onChange, onAnswer]);

  useEffect(() => {
    if (justSelected == null) return;
    const el = optionRefs.current[justSelected];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelected]);

  const handleSelect = (days: number) => {
    setSelectedDays(days);
    setJustSelected(days);
  };

  const handleContinue = () => {
    if (!selected || submitting) return;
    setSubmitting(true);

    const outputs = {
      supplyDays: selected.days,
      priceId: selected.priceId,
      productId: PRODUCT_ID,
      productName,
    };

    onChange?.(outputs);
    onAnswer?.(outputs);

    try {
      window.pathwai?.flow?.setAnswer?.(outputs);
    } catch {
      /* ignore */
    }

    writeCart(selected.priceId, productName, productImage, selected.days);

    // Self-navigate: priceId is the step answer for node-id routing (e.g. nodeId == "2212")
    window.pathwai?.flow?.next?.(selected.priceId);

    setTimeout(() => setSubmitting(false), 800);
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
      {/* Heading */}
      <header
        className="pw-motion-enter"
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            '--pw-motion-enter-delay': '0ms',
          } as React.CSSProperties
        }
      >
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, Figtree, system-ui, sans-serif))',
            fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.75rem))',
            fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 500))' as unknown as number,
            lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.2))',
            letterSpacing: 'var(--pw-label-letter-spacing, var(--pw-font-letter-spacing-title, -0.01em))',
            color: 'var(--pw-label-fg, #002021)',
          }}
        >
          {title}
        </h1>
        {sublabel ? (
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--pw-label-sublabel-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
              fontSize: 'var(--pw-label-sublabel-font-size, var(--pw-font-size-body, 1rem))',
              fontWeight: 'var(--pw-label-sublabel-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
              lineHeight: 'var(--pw-content-line-height, var(--pw-font-line-height-body, 1.55))',
              color: 'var(--pw-label-sublabel-fg, #545454)',
            }}
          >
            {sublabel}
          </p>
        ) : null}
      </header>

      {/* Product strip */}
      <div
        className="pw-motion-enter"
        style={
          {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--pw-element-gap, 1.25rem)',
            padding: 'var(--pw-control-padding, 1rem)',
            background: 'var(--pw-color-surface, #ffffff)',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            '--pw-motion-enter-delay': '80ms',
          } as React.CSSProperties
        }
      >
        <div
          style={{
            flexShrink: 0,
            width: 72,
            height: 72,
            borderRadius: 'var(--pw-radius, 0.5rem)',
            overflow: 'hidden',
            background: 'var(--pw-answer-media-bg, var(--pw-state-hover, #F1F0E8))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={productImage}
            alt={productName}
            width={72}
            height={72}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: 0 }}>
          <span
            style={{
              fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 600,
              color: 'var(--pw-color-on-surface, #1C1C21)',
              lineHeight: 1.3,
            }}
          >
            {productName}
          </span>
          <span
            style={{
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              color: 'var(--pw-color-muted, #71717a)',
              lineHeight: 1.4,
            }}
          >
            Bioidentical estradiol · transdermal
          </span>
        </div>
      </div>

      {/* Supply options */}
      <div
        role="radiogroup"
        aria-label="Estradiol Patch supply length"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-answer-gap, 0.75rem)',
        }}
      >
        {SUPPLY_OPTIONS.map((option, index) => {
          const isSelected = selectedDays === option.days;
          return (
            <button
              key={option.priceId}
              ref={(el) => {
                optionRefs.current[option.days] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className="pw-motion-enter"
              disabled={submitting}
              onClick={() => handleSelect(option.days)}
              style={
                {
                  '--pw-motion-enter-delay': `${120 + index * 90}ms`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--pw-answer-gap, 0.75rem)',
                  width: '100%',
                  minHeight: 56,
                  padding: 'var(--pw-control-padding, 1rem)',
                  textAlign: 'left',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 'var(--pw-state-disabled-opacity, 0.45)' : 1,
                  background: isSelected
                    ? 'var(--pw-answer-surface-selected, #F1F0E8)'
                    : 'var(--pw-answer-surface, #ffffff)',
                  color: isSelected
                    ? 'var(--pw-answer-fg-selected, var(--pw-answer-fg, #1C1C21))'
                    : 'var(--pw-answer-fg, #1C1C21)',
                  border: isSelected
                    ? '2px solid var(--pw-color-brand, #161336)'
                    : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                  borderRadius: 'var(--pw-radius, 0.5rem)',
                  boxShadow: isSelected ? 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))' : 'none',
                  transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), box-shadow var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
                  fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                  fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                  fontWeight: 'var(--pw-answer-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
                  boxSizing: 'border-box',
                  outline: 'none',
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
                  display: 'var(--pw-answer-indicator-display, flex)',
                  flexShrink: 0,
                  width: 'var(--pw-answer-indicator-size, 18px)',
                  height: 'var(--pw-answer-indicator-size, 18px)',
                  borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                  border: isSelected
                    ? '2px solid var(--pw-answer-indicator-fill, #161336)'
                    : '2px solid var(--pw-answer-border, #E0E0E0)',
                  background: isSelected
                    ? 'var(--pw-answer-indicator-fill, #161336)'
                    : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
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
                      display: 'var(--pw-answer-indicator-dot-display, flex)',
                    }}
                  />
                ) : null}
              </span>

              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontWeight: 600, lineHeight: 1.3 }}>{option.label}</span>
                  {option.badge ? (
                    <span
                      style={{
                        fontSize: 'var(--pw-font-size-caption, 0.75rem)',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase' as const,
                        padding: '0.15rem 0.45rem',
                        borderRadius: 999,
                        background: isSelected
                          ? 'var(--pw-color-brand, #161336)'
                          : 'var(--pw-state-hover, #F1F0E8)',
                        color: isSelected
                          ? 'var(--pw-color-brand-contrast, #ffffff)'
                          : 'var(--pw-color-muted, #71717a)',
                        lineHeight: 1.2,
                      }}
                    >
                      {option.badge}
                    </span>
                  ) : null}
                </span>
                <span
                  style={{
                    fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                    color: 'var(--pw-answer-subtext-fg, var(--pw-label-sublabel-fg, #545454))',
                    lineHeight: 1.4,
                  }}
                >
                  {option.detail}
                </span>
              </span>

              <span
                style={{
                  flexShrink: 0,
                  fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                  color: 'var(--pw-color-muted, #71717a)',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {option.priceLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <div
        className="pw-motion-enter"
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginTop: '0.25rem',
            '--pw-motion-enter-delay': '400ms',
          } as React.CSSProperties
        }
      >
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selected || submitting}
          aria-busy={submitting}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            width: 'var(--pw-navigation-button-width, 100%)',
            minHeight: 48,
            padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
            background:
              !selected || submitting
                ? 'var(--pw-color-muted, #71717a)'
                : 'var(--pw-button-bg, #161336)',
            color: 'var(--pw-button-fg, #ffffff)',
            border: 'none',
            borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
            fontFamily:
              'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 'var(--pw-navigation-button-font-weight, 600)' as unknown as number,
            cursor: !selected || submitting ? 'not-allowed' : 'pointer',
            opacity: !selected ? 'var(--pw-state-disabled-opacity, 0.45)' : 1,
            transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
            boxSizing: 'border-box',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, #8399BF)`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {submitting ? (
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
                  flexShrink: 0,
                }}
              />
              Adding…
            </>
          ) : (
            ctaLabel
          )}
        </button>
        {selected ? (
          <p
            style={{
              margin: 0,
              textAlign: 'center',
              fontSize: 'var(--pw-font-size-caption, 0.8rem)',
              color: 'var(--pw-color-muted, #71717a)',
              lineHeight: 1.4,
            }}
          >
            {selected.label} will be added to your cart
          </p>
        ) : (
          <p
            style={{
              margin: 0,
              textAlign: 'center',
              fontSize: 'var(--pw-font-size-caption, 0.8rem)',
              color: 'var(--pw-color-muted, #71717a)',
              lineHeight: 1.4,
            }}
          >
            Select a supply length to continue
          </p>
        )}
      </div>
    </div>
  );
}