import React, { useState, useEffect, useRef } from 'react';

export const propSchema = {
  productName: {
    type: 'string',
    title: 'Product name',
    defaultValue: 'Progesterone E4M Oral Capsule (compounded)',
  },
  productImage: {
    type: 'image',
    title: 'Product image',
    defaultValue: '',
  },
};

export const outputSchema = {
  planId: {
    type: 'string',
    title: 'Plan ID',
    description: 'Selected plan id: "30" | "90" | "150"',
    required: true,
  },
  planLabel: {
    type: 'string',
    title: 'Plan label',
    description: 'Human-readable plan label, e.g. "90 day"',
  },
  price: {
    type: 'number',
    title: 'Price',
    description: 'Selected plan price in USD',
  },
  days: {
    type: 'number',
    title: 'Days',
    description: 'Supply length in days',
  },
  strengthId: {
    type: 'string',
    title: 'Strength ID',
    description: 'Selected strength id: "100mg" | "200mg"',
    required: true,
  },
  strengthLabel: {
    type: 'string',
    title: 'Strength label',
    description: 'Human-readable strength, e.g. "100 mg"',
  },
};

type Plan = {
  id: string;
  days: number;
  label: string;
  price: number;
  saveAmount?: number;
  savePercent?: number;
};

type Strength = {
  id: string;
  label: string;
};

const PLANS: Plan[] = [
  { id: '30', days: 30, label: '30 day', price: 69 },
  { id: '90', days: 90, label: '90 day', price: 149, saveAmount: 58, savePercent: 28 },
  { id: '150', days: 150, label: '150 day', price: 199, saveAmount: 146, savePercent: 42 },
];

const STRENGTHS: Strength[] = [
  { id: '100mg', label: '100 mg' },
  { id: '200mg', label: '200 mg' },
];

declare global {
  interface Window {
    pathwai?: {
      cart?: {
        addItem: (item: {
          id: string;
          name: string;
          price: number;
          quantity?: number;
          image?: string;
          variants?: { name: string; value: string }[];
        }) => void;
        getCart?: () => unknown;
      };
      flow?: {
        next?: (answer?: unknown) => void;
        goNext?: () => void;
        back?: () => void;
      };
      navigation?: {
        next?: () => void;
      };
    };
  }
}

function advanceToNextStep(answer?: unknown) {
  const flow = window.pathwai?.flow;
  if (typeof flow?.next === 'function') {
    try {
      flow.next(answer);
      return;
    } catch {
      try {
        flow.next();
        return;
      } catch {
        /* continue */
      }
    }
  }
  if (typeof flow?.goNext === 'function') {
    try {
      flow.goNext();
      return;
    } catch {
      /* continue */
    }
  }
  if (typeof window.pathwai?.navigation?.next === 'function') {
    try {
      window.pathwai.navigation.next();
      return;
    } catch {
      /* continue */
    }
  }
  const selectors = [
    '[data-pathwai-next]',
    '[data-pw-next]',
    'button[type="submit"]',
    'button[aria-label="Next"]',
    'button[aria-label="Continue"]',
    '.pw-navigation button[type="submit"]',
    'footer button[type="submit"]',
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel) as HTMLButtonElement | null;
    if (el && !el.disabled) {
      el.click();
      return;
    }
  }
}

function CapsulePlaceholder() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      style={{ display: 'block' }}
    >
      <rect
        x="10"
        y="8"
        width="20"
        height="24"
        rx="10"
        stroke="var(--pw-color-muted, #71717a)"
        strokeWidth="1.75"
      />
      <line
        x1="10"
        y1="20"
        x2="30"
        y2="20"
        stroke="var(--pw-color-muted, #71717a)"
        strokeWidth="1.75"
      />
      <path
        d="M12 14c2-2.5 14-2.5 16 0"
        stroke="var(--pw-color-muted, #71717a)"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

export default function BhrtPlanSelect({
  productName = 'Progesterone E4M Oral Capsule (compounded)',
  productImage = '',
  onChange,
  onAnswer,
  goToNext,
  onNext,
  navigateNext,
  requestNext,
}: {
  productName?: string;
  productImage?: string;
  onChange?: (outputs: {
    planId: string;
    planLabel: string;
    price: number;
    days: number;
    strengthId: string;
    strengthLabel: string;
  }) => void;
  onAnswer?: (outputs: {
    planId: string;
    planLabel: string;
    price: number;
    days: number;
    strengthId: string;
    strengthLabel: string;
  }) => void;
  goToNext?: () => void;
  onNext?: () => void;
  navigateNext?: () => void;
  requestNext?: () => void;
}) {
  const [selectedId, setSelectedId] = useState('90');
  const [selectedStrengthId, setSelectedStrengthId] = useState('100mg');
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selected = PLANS.find((p) => p.id === selectedId) ?? PLANS[1];
  const selectedStrength =
    STRENGTHS.find((s) => s.id === selectedStrengthId) ?? STRENGTHS[0];

  useEffect(() => {
    const styleId = 'pw-hide-shell-nav-bhrt-plan';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      [data-pw-navigation],
      .pw-step-navigation,
      .pw-navigation,
      footer[class*="nav"],
      [class*="StepFooter"],
      [class*="step-footer"] {
        display: none !important;
        height: 0 !important;
        overflow: hidden !important;
        pointer-events: none !important;
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, []);

  useEffect(() => {
    const outputs = {
      planId: selected.id,
      planLabel: selected.label,
      price: selected.price,
      days: selected.days,
      strengthId: selectedStrength.id,
      strengthLabel: selectedStrength.label,
    };
    onChange?.(outputs);
  }, [selected, selectedStrength, onChange]);

  useEffect(() => {
    if (!justSelected) return;
    const el = optionRefs.current[justSelected];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelected]);

  const handleAddToCart = () => {
    if (adding) return;
    setAdding(true);

    const outputs = {
      planId: selected.id,
      planLabel: selected.label,
      price: selected.price,
      days: selected.days,
      strengthId: selectedStrength.id,
      strengthLabel: selectedStrength.label,
    };

    onChange?.(outputs);
    onAnswer?.(outputs);

    try {
      window.pathwai?.cart?.addItem({
        id: `bhrt-${selected.id}-${selectedStrength.id}`,
        name: productName,
        price: selected.price,
        quantity: 1,
        image: productImage || undefined,
        variants: [
          { name: 'Strength', value: selectedStrength.label },
          { name: 'Supply', value: selected.label },
          { name: 'Days', value: String(selected.days) },
        ],
      });
    } catch {
      /* cart optional outside runner */
    }

    const tryPropAdvance = () => {
      if (typeof goToNext === 'function') {
        goToNext();
        return true;
      }
      if (typeof onNext === 'function') {
        onNext();
        return true;
      }
      if (typeof navigateNext === 'function') {
        navigateNext();
        return true;
      }
      if (typeof requestNext === 'function') {
        requestNext();
        return true;
      }
      return false;
    };

    if (!tryPropAdvance()) {
      advanceToNextStep(selected.id);
    }

    window.setTimeout(() => {
      if (!tryPropAdvance()) {
        advanceToNextStep(selected.id);
      }
    }, 50);

    window.setTimeout(() => setAdding(false), 800);
  };

  const sectionHeadingStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
    fontSize: 'var(--pw-font-size-body, 1rem)',
    fontWeight: 600,
    lineHeight: 'var(--pw-font-line-height-body, 1.55)',
    color: 'var(--pw-label-fg, #002021)',
  };

  const sectionHelperStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 'var(--pw-font-size-caption, 0.875rem)',
    fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
    color: 'var(--pw-label-sublabel-fg, #545454)',
    lineHeight: 'var(--pw-font-line-height-body, 1.55)',
  };

  const renderOptionCard = (
    key: string,
    label: React.ReactNode,
    sublabel: React.ReactNode | null,
    isSelected: boolean,
    index: number,
    onSelect: () => void
  ) => (
    <button
      key={key}
      ref={(el) => {
        optionRefs.current[key] = el;
      }}
      type="button"
      role="radio"
      aria-checked={isSelected}
      className="pw-motion-enter"
      onClick={() => {
        onSelect();
        setJustSelected(key);
      }}
      style={
        {
          '--pw-motion-enter-delay': `${index * 80}ms`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--pw-answer-gap, 0.75rem)',
          width: '100%',
          minHeight: 56,
          padding: 'var(--pw-control-padding, 1rem)',
          textAlign: 'left',
          cursor: 'pointer',
          borderRadius: 'var(--pw-radius, 0.5rem)',
          border: isSelected
            ? '2px solid var(--pw-color-brand, #161336)'
            : '1.5px solid var(--pw-answer-border, #E0E0E0)',
          background: isSelected
            ? 'var(--pw-answer-surface-selected, #F1F0E8)'
            : 'var(--pw-answer-surface, #ffffff)',
          color: isSelected
            ? 'var(--pw-answer-fg-selected, var(--pw-answer-fg, #1C1C21))'
            : 'var(--pw-answer-fg, #1C1C21)',
          boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
          fontFamily:
            'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
          fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
          fontWeight: 'var(--pw-answer-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
          transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
          boxSizing: 'border-box',
        } as React.CSSProperties
      }
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
            border: isSelected
              ? '2px solid var(--pw-answer-indicator-fill, #161336)'
              : '2px solid var(--pw-answer-border, #E0E0E0)',
            background: isSelected
              ? 'var(--pw-answer-indicator-fill, #161336)'
              : 'transparent',
            flexShrink: 0,
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

        <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          {label}
          {sublabel}
        </span>
      </span>
    </button>
  );

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 617px)',
        margin: '0 auto',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-element-gap, 1.25rem)',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--pw-element-gap, 1.25rem)',
        }}
      >
        {/* Portrait packshot frame (~5:7) — contain preserves full product + original bg */}
        <div
          aria-hidden={!productImage}
          style={{
            width: 112,
            height: 156,
            minWidth: 112,
            borderRadius: 'var(--pw-radius, 0.5rem)',
            overflow: 'hidden',
            background: 'var(--pw-answer-surface-selected, #F1F0E8)',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
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
                objectPosition: 'center',
                display: 'block',
              }}
            />
          ) : (
            <CapsulePlaceholder />
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            minWidth: 0,
            flex: '1 1 160px',
          }}
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
            {productName}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
              color: 'var(--pw-label-sublabel-fg, #545454)',
              lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            }}
          >
            Choose your strength and supply length. Longer plans cost less per day.
          </p>
        </div>
      </div>

      {/* Strength */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '40ms',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            } as React.CSSProperties
          }
        >
          <h2 style={sectionHeadingStyle}>Strength</h2>
          <p style={sectionHelperStyle}>
            Your physician may adjust the final dose after review.
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="Strength"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 1.25rem)',
          }}
        >
          {STRENGTHS.map((strength, index) => {
            const isSelected = strength.id === selectedStrengthId;
            return renderOptionCard(
              `strength-${strength.id}`,
              <span style={{ fontWeight: 600 }}>{strength.label}</span>,
              null,
              isSelected,
              index,
              () => setSelectedStrengthId(strength.id)
            );
          })}
        </div>
      </div>

      {/* Supply */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div
          className="pw-motion-enter"
          style={
            {
              '--pw-motion-enter-delay': '160ms',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            } as React.CSSProperties
          }
        >
          <h2 style={sectionHeadingStyle}>Supply length</h2>
          <p style={sectionHelperStyle}>Longer plans cost less per day.</p>
        </div>

        <div
          role="radiogroup"
          aria-label="Supply length"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pw-element-gap, 1.25rem)',
          }}
        >
          {PLANS.map((plan, index) => {
            const isSelected = plan.id === selectedId;
            return renderOptionCard(
              `plan-${plan.id}`,
              <span style={{ fontWeight: 600 }}>
                {plan.label}
                <span style={{ fontWeight: 500 }}>
                  {' · '}${plan.price}
                </span>
              </span>,
              plan.saveAmount != null && plan.savePercent != null ? (
                <span
                  style={{
                    fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                    color: 'var(--pw-label-sublabel-fg, #545454)',
                    fontFamily:
                      'var(--pw-answer-subtext-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                  }}
                >
                  Save ${plan.saveAmount} ({plan.savePercent}% off)
                </span>
              ) : null,
              isSelected,
              index + 2,
              () => setSelectedId(plan.id)
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="pw-motion-enter"
        disabled={adding}
        onClick={handleAddToCart}
        style={
          {
            '--pw-motion-enter-delay': '400ms',
            width: '100%',
            minHeight: 52,
            marginTop: '0.25rem',
            padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.25rem',
            border: 'none',
            borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
            background: 'var(--pw-button-bg, #161336)',
            color: 'var(--pw-button-fg, #ffffff)',
            fontFamily:
              'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 600,
            cursor: adding ? 'wait' : 'pointer',
            opacity: adding ? ('var(--pw-state-disabled-opacity, 0.45)' as unknown as number) : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            transition: `opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
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
              }}
            />
            Adding…
          </>
        ) : (
          'Add to cart'
        )}
      </button>
    </div>
  );
}