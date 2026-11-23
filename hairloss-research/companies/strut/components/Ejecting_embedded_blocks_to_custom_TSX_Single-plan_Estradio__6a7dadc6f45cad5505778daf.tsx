import React, { useEffect } from 'react';

export const propSchema = {
  productName: {
    type: 'string',
    title: 'Product name',
    defaultValue: 'Biest 80/20 Cream (compounded)',
  },
  productSublabel: {
    type: 'string',
    title: 'Product sublabel',
    defaultValue: '1mg/gm cream',
  },
  productImage: {
    type: 'image',
    title: 'Product image',
    defaultValue: '',
  },
  productId: {
    type: 'string',
    title: 'Product ID',
    defaultValue: 'biest-80-20-cream',
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
  plan: {
    type: 'string',
    title: 'Plan',
    description: 'Selected plan id: "30"',
    required: true,
  },
  price: {
    type: 'number',
    title: 'Price',
    description: 'Selected plan price in USD',
    required: true,
  },
  productId: {
    type: 'string',
    title: 'Product ID',
    required: true,
  },
  productName: {
    type: 'string',
    title: 'Product name',
    required: true,
  },
  supplyDays: {
    type: 'number',
    title: 'Supply days',
    description: 'Always 30 for this picker',
    required: true,
  },
};

function formatPrice(n: number) {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

function SelectedRadio() {
  return (
    <span
      aria-hidden
      style={{
        flexShrink: 0,
        width: 20,
        height: 20,
        borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
        background: 'var(--pw-answer-indicator-fill, var(--pw-color-brand, #161336))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '999px',
          background: 'var(--pw-answer-indicator-check, #ffffff)',
        }}
      />
    </span>
  );
}

export default function BiestCreamPlanPicker({
  productName = 'Biest 80/20 Cream (compounded)',
  productSublabel = '1mg/gm cream',
  productImage = '',
  productId = 'biest-80-20-cream',
  price30 = 99,
  trustLine = 'Doctor consult · US licensed pharmacy',
  ctaLabel = 'Add to cart →',
  onChange,
}: {
  productName?: string;
  productSublabel?: string;
  productImage?: string;
  productId?: string;
  price30?: number;
  trustLine?: string;
  ctaLabel?: string;
  onChange?: (outputs: {
    plan: string;
    price: number;
    productId: string;
    productName: string;
    supplyDays: number;
  }) => void;
}) {
  useEffect(() => {
    onChange?.({
      plan: '30',
      price: price30,
      productId,
      productName,
      supplyDays: 30,
    });
  }, [price30, productId, productName, onChange]);

  const trustItems = (trustLine || '')
    .split(/\s*[·•|]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  const checks =
    trustItems.length > 0
      ? trustItems
      : ['Doctor consult', 'US licensed pharmacy'];

  const handleCta = () => {
    window.pathwai?.cart?.addItem({
      id: productId,
      name: productName,
      price: price30,
      quantity: 1,
      image: productImage || undefined,
      variants: [{ name: 'Supply', value: '30-day' }],
    });
    window.pathwai?.flow?.next({
      plan: '30',
      price: price30,
      productId,
      productName,
      supplyDays: 30,
    });
  };

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
      {/* SELECTED PRODUCT */}
      <div
        className="pw-motion-enter"
        role="group"
        aria-label="Selected product"
        style={
          {
            '--pw-motion-enter-delay': '0ms',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            width: '100%',
            boxSizing: 'border-box',
            padding: '1rem 1.125rem',
            minHeight: 96,
            background: 'var(--pw-color-surface, #ffffff)',
            border: '1px solid #E5E7EB',
            borderRadius: '18px',
            cursor: 'default',
          } as React.CSSProperties
        }
      >
        <div
          aria-hidden={!productImage}
          style={{
            flexShrink: 0,
            width: 84,
            height: 84,
            borderRadius: '14px',
            background: 'var(--pw-state-hover, #F1F0E8)',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: productImage ? 9 : 0,
            boxSizing: 'border-box',
          }}
        >
          {productImage ? (
            <img
              src={productImage}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          ) : (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              style={{ color: 'var(--pw-color-muted, #71717a)' }}
            >
              <path
                d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="9" cy="10" r="1.25" fill="currentColor" />
              <path
                d="m7.5 16 3.2-3.4a1 1 0 0 1 1.5 0L15 15.5l1.2-1.2a1 1 0 0 1 1.5.1L19 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              fontSize: '1.1875rem',
              fontWeight: 600,
              color: 'var(--pw-color-on-surface, #1C1C21)',
              lineHeight: 1.3,
            }}
          >
            {productName}
          </span>
          {productSublabel ? (
            <span
              style={{
                fontSize: '0.975rem',
                fontWeight: 'var(--pw-font-weight-body, 400)',
                color: 'var(--pw-color-muted, #71717a)',
                lineHeight: 1.35,
              }}
            >
              {productSublabel}
            </span>
          ) : null}
        </div>
      </div>

      {/* SUPPLY */}
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '80ms',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem',
          } as React.CSSProperties
        }
      >
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--pw-color-muted, #71717a)',
            lineHeight: 1.3,
          }}
        >
          Supply
        </div>

        <div
          role="radio"
          aria-checked={true}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            boxSizing: 'border-box',
            padding: '0.875rem 1rem',
            minHeight: 52,
            background: 'var(--pw-state-hover, #F1F0E8)',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
            borderRadius: '14px',
            cursor: 'default',
          }}
        >
          <SelectedRadio />

          <span
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 500,
              color: 'var(--pw-answer-fg, #1C1C21)',
              lineHeight: 1.35,
            }}
          >
            30 day supply
          </span>

          <span
            style={{
              flexShrink: 0,
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 600,
              color: 'var(--pw-color-on-surface, #1C1C21)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatPrice(price30)}
          </span>
        </div>
      </div>

      {/* Trust */}
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '140ms',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.75rem 1.25rem',
          } as React.CSSProperties
        }
      >
        {checks.map((label) => (
          <span
            key={label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.875rem',
              color: 'var(--pw-color-muted, #71717a)',
              lineHeight: 1.3,
            }}
          >
            <span
              aria-hidden
              style={{
                color: 'var(--pw-color-muted, #71717a)',
                fontWeight: 600,
                opacity: 0.75,
              }}
            >
              ✓
            </span>
            {label}
          </span>
        ))}
      </div>

      {/* TOTAL TODAY */}
      <div
        className="pw-motion-enter"
        style={
          {
            '--pw-motion-enter-delay': '200ms',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingTop: '0.25rem',
          } as React.CSSProperties
        }
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--pw-color-muted, #71717a)',
          }}
        >
          Total today
        </span>
        <span
          style={{
            fontSize: '1.375rem',
            fontWeight: 700,
            color: 'var(--pw-color-on-surface, #1C1C21)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
          }}
        >
          {formatPrice(price30)}
        </span>
      </div>

      {/* CTA */}
      <button
        type="button"
        className="pw-motion-enter"
        onClick={handleCta}
        style={
          {
            '--pw-motion-enter-delay': '260ms',
            width: '100%',
            minHeight: 52,
            padding: '0.875rem 1.25rem',
            border: 'none',
            borderRadius: 999,
            background: 'var(--pw-button-bg, #161336)',
            color: 'var(--pw-button-fg, #ffffff)',
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            transition: `opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), transform var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
          } as React.CSSProperties
        }
      >
        {ctaLabel}
      </button>
    </div>
  );
}