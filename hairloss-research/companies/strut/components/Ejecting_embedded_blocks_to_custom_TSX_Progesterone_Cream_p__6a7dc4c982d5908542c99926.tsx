import React, { useState, useEffect, useMemo, useRef } from 'react';

export const propSchema = {
  productName: {
    type: 'string',
    title: 'Product name',
    defaultValue: 'Progesterone Cream (compounded)',
  },
  productSublabel: {
    type: 'string',
    title: 'Product sublabel',
    defaultValue: '80mg/gm cream',
  },
  productImage: {
    type: 'image',
    title: 'Product image',
    defaultValue:
      'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/media-1786622927925-dbabf8e571c821ba.png',
  },
  productId: {
    type: 'string',
    title: 'Product ID',
    defaultValue: 'progesterone-cream',
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
};

export const outputSchema = {
  productId: {
    type: 'string',
    title: 'Product ID',
    description: 'Selected product id (e.g. "progesterone-cream")',
    required: true,
  },
  supplyDays: {
    type: 'number',
    title: 'Supply days',
    description: 'Selected supply length in days (30)',
    required: true,
  },
  price: {
    type: 'number',
    title: 'Price',
    description: 'Selected plan price in USD',
    required: true,
  },
  addedToCart: {
    type: 'boolean',
    title: 'Added to cart',
    description: 'True after the user taps Add to cart',
  },
};

const FALLBACK_IMAGE =
  'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/media-1786622927925-dbabf8e571c821ba.png';

type VariantLike = {
  image?: string;
  imageUrl?: string;
  src?: string;
};

function resolveProductImage(
  productImage?: string,
  variants?: VariantLike[],
): string {
  const fromProp = (productImage || '').trim();
  if (fromProp) return fromProp;

  const first = variants?.[0];
  if (first) {
    const fromVariant = (first.image || first.imageUrl || first.src || '').trim();
    if (fromVariant) return fromVariant;
  }

  return FALLBACK_IMAGE;
}

export default function ProgesteroneCreamPicker({
  productName = 'Progesterone Cream (compounded)',
  productSublabel = '80mg/gm cream',
  productImage = FALLBACK_IMAGE,
  productId = 'progesterone-cream',
  price30 = 99,
  trustLine = 'Doctor consult · US licensed pharmacy',
  ctaLabel = 'Add to cart →',
  variants,
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
  variants?: VariantLike[];
  onChange?: (outputs: {
    productId: string;
    supplyDays: number;
    price: number;
    addedToCart: boolean;
  }) => void;
  onAnswer?: (outputs: {
    productId: string;
    supplyDays: number;
    price: number;
    addedToCart: boolean;
  }) => void;
}) {
  const [selected, setSelected] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [adding, setAdding] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
  const rowRef = useRef<HTMLButtonElement | null>(null);

  const imageSrc = useMemo(
    () => resolveProductImage(productImage, variants),
    [productImage, variants],
  );

  const price = price30;
  const supplyDays = 30;

  const emit = (nextAdded: boolean) => {
    const payload = {
      productId,
      supplyDays,
      price,
      addedToCart: nextAdded,
    };
    onChange?.(payload);
    onAnswer?.(payload);
  };

  useEffect(() => {
    emit(addedToCart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, price, supplyDays, addedToCart]);

  useEffect(() => {
    if (!justSelected) return;
    const el = rowRef.current;
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelected]);

  const handleSelect = () => {
    setSelected(true);
    setJustSelected((v) => !v);
  };

  const handleAddToCart = () => {
    if (adding) return;
    setAdding(true);

    try {
      window.pathwai?.cart?.addItem({
        id: productId,
        name: productName,
        price,
        quantity: 1,
        image: imageSrc,
        variants: [
          { name: 'Supply', value: '30 day' },
          { name: 'Strength', value: productSublabel },
        ],
      });
      setAddedToCart(true);
      emit(true);
    } finally {
      window.setTimeout(() => setAdding(false), 280);
    }
  };

  const formatUsd = (n: number) =>
    '$' + (Number.isFinite(n) ? n.toFixed(n % 1 === 0 ? 0 : 2) : '0');

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 617px)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-element-gap, 1.25rem)',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
        boxSizing: 'border-box',
      }}
    >
      {/* Product selection row */}
      <button
        ref={rowRef}
        type="button"
        className="pw-motion-enter"
        aria-pressed={selected}
        onClick={handleSelect}
        style={
          {
            '--pw-motion-enter-delay': '0ms',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--pw-answer-gap, 0.875rem)',
            width: '100%',
            padding: 'var(--pw-control-padding, 1rem)',
            boxSizing: 'border-box',
            textAlign: 'left',
            cursor: 'pointer',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            border: selected
              ? '2px solid var(--pw-color-brand, #161336)'
              : '1.5px solid var(--pw-answer-border, #E0E0E0)',
            background: selected
              ? 'var(--pw-answer-surface-selected, #F1F0E8)'
              : 'var(--pw-answer-surface, #ffffff)',
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            transition: `border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
            WebkitTapHighlightColor: 'transparent',
            minHeight: 44,
          } as React.CSSProperties
        }
      >
        {/* Radio indicator */}
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            width: 'var(--pw-answer-indicator-size, 20px)',
            height: 'var(--pw-answer-indicator-size, 20px)',
            borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
            border: selected
              ? '2px solid var(--pw-answer-indicator-fill, #161336)'
              : '2px solid var(--pw-answer-border, #E0E0E0)',
            background: selected
              ? 'var(--pw-answer-indicator-fill, #161336)'
              : 'var(--pw-color-surface, #ffffff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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

        {/* Fixed 60×60 thumbnail — never blows layout */}
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            width: 60,
            height: 60,
            borderRadius: 12,
            overflow: 'hidden',
            background: 'var(--pw-color-background, #ffffff)',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}
        >
          <img
            src={imageSrc}
            alt=""
            width={60}
            height={60}
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </span>

        {/* Name + sublabel */}
        <span
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
              fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
              fontWeight: 600,
              lineHeight: 1.35,
              color: selected
                ? 'var(--pw-answer-fg-selected, var(--pw-answer-fg, #1C1C21))'
                : 'var(--pw-answer-fg, #1C1C21)',
              wordBreak: 'break-word',
            }}
          >
            {productName}
          </span>
          {productSublabel ? (
            <span
              style={{
                fontFamily: 'var(--pw-answer-subtext-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                fontSize: 'var(--pw-answer-subtext-font-size, var(--pw-font-size-caption, 0.875rem))',
                fontWeight: 'var(--pw-answer-subtext-font-weight, var(--pw-font-weight-body, 400))',
                lineHeight: 1.4,
                color: 'var(--pw-answer-subtext-fg, var(--pw-label-sublabel-fg, #545454))',
                wordBreak: 'break-word',
              }}
            >
              {productSublabel}
            </span>
          ) : null}
        </span>
      </button>

      {/* Supply + total */}
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '100ms',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            padding: '0 2px',
          } as React.CSSProperties
        }
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 'var(--pw-font-weight-body, 400)',
              color: 'var(--pw-color-on-surface, #1C1C21)',
            }}
          >
            30 day supply
          </span>
          <span
            style={{
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 600,
              color: 'var(--pw-color-on-surface, #1C1C21)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatUsd(price)}
          </span>
        </div>

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
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase' as const,
              color: 'var(--pw-color-on-surface, #1C1C21)',
            }}
          >
            Total today
          </span>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--pw-color-on-surface, #1C1C21)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatUsd(price)}
          </span>
        </div>
      </div>

      {/* Trust line */}
      {trustLine ? (
        <p
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '160ms',
              margin: 0,
              textAlign: 'center',
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              fontWeight: 'var(--pw-font-weight-body, 400)',
              lineHeight: 1.45,
              color: 'var(--pw-color-muted, #71717a)',
            } as React.CSSProperties
          }
        >
          {trustLine}
        </p>
      ) : null}

      {/* CTA */}
      <button
        type="button"
        className="pw-motion-enter"
        onClick={handleAddToCart}
        disabled={adding}
        style={
          {
            '--pw-motion-enter-delay': '220ms',
            width: '100%',
            minHeight: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
            boxSizing: 'border-box',
            border: 'none',
            cursor: adding ? 'wait' : 'pointer',
            borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
            background: 'var(--pw-button-bg, #161336)',
            color: 'var(--pw-button-fg, #ffffff)',
            fontFamily: 'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 600,
            lineHeight: 1.3,
            opacity: adding
              ? 'var(--pw-state-disabled-opacity, 0.45)'
              : 1,
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            transition: `opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), transform var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
            WebkitTapHighlightColor: 'transparent',
          } as React.CSSProperties
        }
      >
        {adding ? (
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
            <span>Adding…</span>
          </>
        ) : addedToCart ? (
          <span>Added to cart ✓</span>
        ) : (
          <span>{ctaLabel}</span>
        )}
      </button>
    </div>
  );
}