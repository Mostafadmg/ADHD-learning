import React, { useState, useEffect, useRef } from 'react';

export const propSchema = {
  productName: {
    type: 'string',
    title: 'Product name',
    defaultValue: 'Estradiol Patch',
  },
  productDescription: {
    type: 'string',
    title: 'Description',
    defaultValue:
      'Transdermal estradiol system delivering a steady dose through the skin. Changed on a regular schedule.',
  },
  imageUrl: {
    type: 'image',
    title: 'Product image',
    defaultValue:
      'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/image-1784145684303-cc15d83f2164a6ca.png',
  },
  startingPriceLabel: {
    type: 'string',
    title: 'Starting price label',
    defaultValue: 'from $99',
  },
  ctaLabel: {
    type: 'string',
    title: 'CTA label',
    defaultValue: 'Add to cart & continue',
  },
};

export const outputSchema = {
  priceId: {
    type: 'string',
    title: 'Price ID',
    description: 'Selected Strut priceId: "2204" | "2212" | "2217"',
    required: true,
  },
  supplyDays: {
    type: 'number',
    title: 'Supply days',
    description: 'Selected supply length in days: 30 | 90 | 150',
  },
  supplyLabel: {
    type: 'string',
    title: 'Supply label',
    description: 'Human-readable supply label, e.g. "30-day supply"',
  },
};

type SupplyOption = {
  priceId: string;
  days: number;
  label: string;
  hint: string;
  price: number;
};

const SUPPLY_OPTIONS: SupplyOption[] = [
  {
    priceId: '2204',
    days: 30,
    label: '30-day supply',
    hint: 'Flexible start — easy to adjust',
    price: 99,
  },
  {
    priceId: '2212',
    days: 90,
    label: '90-day supply',
    hint: 'Most popular · fewer refills',
    price: 249,
  },
  {
    priceId: '2217',
    days: 150,
    label: '150-day supply',
    hint: 'Longest stretch between orders',
    price: 399,
  },
];

const BRAND_NAVY = '#161336';
const BRAND_CORAL = '#F07A5A';

export default function EstradiolPatchSupplySelector({
  productName = 'Estradiol Patch',
  productDescription = 'Transdermal estradiol system delivering a steady dose through the skin. Changed on a regular schedule.',
  imageUrl = 'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/image-1784145684303-cc15d83f2164a6ca.png',
  startingPriceLabel = 'from $99',
  ctaLabel = 'Add to cart & continue',
  onChange,
}: {
  productName?: string;
  productDescription?: string;
  imageUrl?: string;
  startingPriceLabel?: string;
  ctaLabel?: string;
  onChange?: (outputs: {
    priceId: string;
    supplyDays: number;
    supplyLabel: string;
  }) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imgError, setImgError] = useState(false);
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selected = SUPPLY_OPTIONS.find((o) => o.priceId === selectedId) ?? null;

  useEffect(() => {
    if (!selected) return;
    onChange?.({
      priceId: selected.priceId,
      supplyDays: selected.days,
      supplyLabel: selected.label,
    });
  }, [selected, onChange]);

  useEffect(() => {
    if (!justSelected) return;
    const el = optionRefs.current[justSelected];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelected]);

  const handleSelect = (priceId: string) => {
    if (submitting) return;
    setSelectedId(priceId);
    setJustSelected(priceId);
  };

  const handleContinue = () => {
    if (!selected || submitting) return;
    setSubmitting(true);

    try {
      const cart = window.pathwai?.cart;
      if (cart) {
        cart.clearCart();
        cart.addItem({
          id: selected.priceId,
          name: `${productName} · ${selected.label}`,
          price: selected.price,
          quantity: 1,
          image: imageUrl || undefined,
          variants: [{ name: 'Supply', value: selected.label }],
        });
      }
    } catch {
      // Cart may be unavailable in editor preview
    }

    onChange?.({
      priceId: selected.priceId,
      supplyDays: selected.days,
      supplyLabel: selected.label,
    });

    window.pathwai?.flow?.next(selected.priceId);
  };

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
        color: `var(--pw-color-on-surface, ${BRAND_NAVY})`,
        boxSizing: 'border-box',
      }}
    >
      {/* Product hero */}
      <header
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 'var(--pw-element-gap, 0.75rem)',
          ['--pw-motion-enter-delay' as string]: '0ms',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 220,
            aspectRatio: '1',
            borderRadius: 'var(--pw-radius, 12px)',
            overflow: 'hidden',
            background: 'var(--pw-color-surface, #ffffff)',
            border: '1px solid var(--pw-color-border, #e8e6ef)',
            boxShadow: 'var(--pw-shadow, 0 4px 20px rgba(22, 19, 54, 0.08))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!imgError && imageUrl ? (
            <img
              src={imageUrl}
              alt={productName}
              onError={() => setImgError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                padding: 'var(--pw-control-padding, 1rem)',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <span
              aria-hidden
              style={{
                fontSize: '2.5rem',
                lineHeight: 1,
                opacity: 0.35,
                color: `var(--pw-color-muted, ${BRAND_NAVY})`,
              }}
            >
              ◈
            </span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            width: '100%',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--pw-label-sublabel-fg, #6b6880)',
            }}
          >
            BHRT patches
          </p>
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--pw-font-family-title, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-title, 1.5rem)',
              fontWeight: 'var(--pw-font-weight-title, 700)' as React.CSSProperties['fontWeight'],
              lineHeight: 'var(--pw-font-line-height-title, 1.2)' as React.CSSProperties['lineHeight'],
              letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
              color: `var(--pw-label-fg, ${BRAND_NAVY})`,
            }}
          >
            {productName}
          </h1>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--pw-content-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
              fontSize: 'var(--pw-content-font-size, var(--pw-font-size-body, 1rem))',
              fontWeight: 'var(--pw-content-font-weight, 400)' as React.CSSProperties['fontWeight'],
              lineHeight: 'var(--pw-content-line-height, 1.55)' as React.CSSProperties['lineHeight'],
              color: 'var(--pw-content-fg, var(--pw-color-muted, #5c5870))',
              maxWidth: '28rem',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {productDescription}
          </p>
          <p
            style={{
              margin: '0.25rem 0 0',
              fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 600,
              color: `var(--pw-color-brand, ${BRAND_NAVY})`,
            }}
          >
            {startingPriceLabel}
          </p>
        </div>
      </header>

      {/* Supply length */}
      <section
        aria-label="Choose supply length"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
        }}
      >
        <h2
          className="pw-motion-enter"
          style={{
            margin: 0,
            fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, system-ui, sans-serif))',
            fontSize: 'var(--pw-label-font-size, 1.125rem)',
            fontWeight: 'var(--pw-label-font-weight, 600)' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--pw-label-line-height, 1.3)' as React.CSSProperties['lineHeight'],
            color: `var(--pw-label-fg, ${BRAND_NAVY})`,
            ['--pw-motion-enter-delay' as string]: '80ms',
          }}
        >
          How much supply do you need?
        </h2>

        <div
          role="radiogroup"
          aria-label="Supply length"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 0.75rem)',
          }}
        >
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
                disabled={submitting}
                className="pw-motion-enter"
                onClick={() => handleSelect(option.priceId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--pw-answer-gap, 0.875rem)',
                  width: '100%',
                  minHeight: 56,
                  padding: 'var(--pw-control-padding, 1rem)',
                  textAlign: 'left',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  borderRadius: 'var(--pw-radius, 12px)',
                  border: isSelected
                    ? `2px solid var(--pw-color-brand, ${BRAND_NAVY})`
                    : '1.5px solid var(--pw-answer-border, #e2e0ec)',
                  background: isSelected
                    ? 'var(--pw-answer-surface-selected, #f3f1fa)'
                    : 'var(--pw-answer-surface, #ffffff)',
                  boxShadow: isSelected
                    ? 'var(--pw-shadow, 0 2px 12px rgba(22, 19, 54, 0.1))'
                    : 'none',
                  color: isSelected
                    ? `var(--pw-answer-fg-selected, ${BRAND_NAVY})`
                    : 'var(--pw-answer-fg, var(--pw-color-on-surface, #1a1730))',
                  opacity: submitting
                    ? ('var(--pw-state-disabled-opacity, 0.45)' as unknown as number)
                    : 1,
                  transition: `border-color var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease), background var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease), box-shadow var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease)`,
                  boxSizing: 'border-box',
                  WebkitTapHighlightColor: 'transparent',
                  ['--pw-motion-enter-delay' as string]: `${120 + index * 90}ms`,
                } as React.CSSProperties}
              >
                {/* Radio indicator */}
                <span
                  aria-hidden
                  style={{
                    display: 'var(--pw-answer-indicator-display, flex)' as React.CSSProperties['display'],
                    flexShrink: 0,
                    width: 'var(--pw-answer-indicator-size, 20px)',
                    height: 'var(--pw-answer-indicator-size, 20px)',
                    borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                    border: isSelected
                      ? `2px solid var(--pw-answer-indicator-fill, var(--pw-color-brand, ${BRAND_NAVY}))`
                      : '2px solid var(--pw-answer-border, #c8c4d6)',
                    background: isSelected
                      ? `var(--pw-answer-indicator-fill, var(--pw-color-brand, ${BRAND_NAVY}))`
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
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
                      fontSize: 'var(--pw-answer-font-size, 1rem)',
                      fontWeight: 600,
                      lineHeight: 1.35,
                    }}
                  >
                    {option.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--pw-answer-subtext-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
                      fontSize: 'var(--pw-answer-subtext-font-size, 0.875rem)',
                      fontWeight: 'var(--pw-answer-subtext-font-weight, 400)' as React.CSSProperties['fontWeight'],
                      color: 'var(--pw-answer-subtext-fg, var(--pw-label-sublabel-fg, #6b6880))',
                      lineHeight: 1.4,
                    }}
                  >
                    {option.hint}
                  </span>
                </span>

                {isSelected && (
                  <span
                    className="pw-motion-pop"
                    aria-hidden
                    style={{
                      flexShrink: 0,
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: `var(--pw-color-brand, ${BRAND_NAVY})`,
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* CTA + subnote */}
      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 0.75rem)',
          ['--pw-motion-enter-delay' as string]: '400ms',
        }}
      >
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selected || submitting}
          aria-disabled={!selected || submitting}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            width: '100%',
            minHeight: 52,
            padding: 'var(--pw-navigation-button-padding, var(--pw-control-padding, 1rem))',
            border: 'none',
            borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 12px))',
            background:
              !selected || submitting
                ? 'var(--pw-color-border, #d4d0e0)'
                : `var(--pw-button-bg, ${BRAND_CORAL})`,
            color:
              !selected || submitting
                ? 'var(--pw-color-muted, #7a7690)'
                : `var(--pw-button-fg, #ffffff)`,
            fontFamily: 'var(--pw-navigation-button-font-family, var(--pw-font-family-body, system-ui, sans-serif))',
            fontSize: 'var(--pw-navigation-button-font-size, 1.0625rem)',
            fontWeight: 'var(--pw-navigation-button-font-weight, 600)' as React.CSSProperties['fontWeight'],
            cursor: !selected || submitting ? 'not-allowed' : 'pointer',
            opacity: !selected
              ? ('var(--pw-state-disabled-opacity, 0.55)' as unknown as number)
              : 1,
            transition: `background var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease), opacity var(--pw-motion-duration, 150ms) var(--pw-motion-ease, ease)`,
            WebkitTapHighlightColor: 'transparent',
            boxSizing: 'border-box',
          }}
        >
          {submitting && (
            <span
              className="pw-motion-spin"
              aria-hidden
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                border: '2px solid currentColor',
                borderRightColor: 'transparent',
                flexShrink: 0,
              }}
            />
          )}
          {submitting ? 'Adding…' : ctaLabel}
        </button>

        <p
          style={{
            margin: 0,
            textAlign: 'center',
            fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
            lineHeight: 1.5,
            color: 'var(--pw-label-sublabel-fg, #6b6880)',
          }}
        >
          Your physician may adjust strength or add progesterone for uterine
          protection based on your answers.
        </p>
      </div>
    </div>
  );
}