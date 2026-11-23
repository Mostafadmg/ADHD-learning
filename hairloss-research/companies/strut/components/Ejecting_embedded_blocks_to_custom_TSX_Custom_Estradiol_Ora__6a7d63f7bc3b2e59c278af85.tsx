import React, { useState, useEffect, useCallback, useRef } from 'react';

const PRODUCT_KEY = 'estradiol-oral-capsule';
const PRODUCT_NAME = 'Estradiol Oral Capsule (Compounded)';
const PRODUCT_IMAGE =
  'https://assets.pathwai.care/organizations/69aa4bdd25bc7851eb9bac29/assets/image-1784145662212-2e98c18fe707a756.png';
const BASE_CHECKOUT_URL = 'https://checkout.struthealth.com/female-bhrt';

type StrengthMg = '0.5' | '1' | '2';
type SupplyDays = 30 | 90 | 150;

const STRENGTHS: { value: StrengthMg; label: string; strengthKey: string }[] = [
  { value: '0.5', label: '0.5 mg', strengthKey: '0.5mg' },
  { value: '1', label: '1 mg', strengthKey: '1mg' },
  { value: '2', label: '2 mg', strengthKey: '2mg' },
];

const SUPPLIES: { days: SupplyDays; label: string; price: number; perDayHint: string }[] = [
  { days: 30, label: '30 days', price: 69, perDayHint: 'About $2.30/day' },
  { days: 90, label: '90 days', price: 149, perDayHint: 'About $1.66/day' },
  { days: 150, label: '150 days', price: 199, perDayHint: 'About $1.33/day · best value' },
];

function buildPriceId(strength: StrengthMg, days: SupplyDays): string {
  return `E2CAP-${strength}-${days}`;
}

function getPrice(days: SupplyDays): number {
  return SUPPLIES.find((s) => s.days === days)?.price ?? 69;
}

function strengthKeyOf(strength: StrengthMg): string {
  return STRENGTHS.find((s) => s.value === strength)?.strengthKey ?? `${strength}mg`;
}

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'Choose your Estradiol Capsule supply',
  },
  subtitle: {
    type: 'string',
    title: 'Subtitle',
    defaultValue:
      'Compounded oral bioidentical estradiol. Select strength and supply length. Your doctor may adjust your plan based on your answers.',
  },
};

export const outputSchema = {
  productKey: {
    type: 'string',
    title: 'Product key',
    description: 'Stable product id: estradiol-oral-capsule',
    required: true,
  },
  strength: {
    type: 'string',
    title: 'Strength',
    description: 'Selected strength: 0.5mg | 1mg | 2mg',
    required: true,
  },
  supplyDays: {
    type: 'number',
    title: 'Supply days',
    description: 'Selected supply length: 30 | 90 | 150',
    required: true,
  },
  priceId: {
    type: 'string',
    title: 'Price ID',
    description: 'Cart price id, e.g. E2CAP-1-90 (placeholder SKU pending confirmation)',
    required: true,
  },
  price: {
    type: 'number',
    title: 'Price',
    description: 'Unit price in USD for the selected supply',
  },
  productName: {
    type: 'string',
    title: 'Product name',
    description: 'Display name written to cart',
  },
  baseCheckoutUrl: {
    type: 'string',
    title: 'Base checkout URL',
    description: 'Checkout base for later steps',
  },
};

type Outputs = {
  productKey: string;
  strength: string;
  supplyDays: number;
  priceId: string;
  price: number;
  productName: string;
  baseCheckoutUrl: string;
};

export default function EstradiolOralCapsuleSelector({
  title = 'Choose your Estradiol Capsule supply',
  subtitle = 'Compounded oral bioidentical estradiol. Select strength and supply length. Your doctor may adjust your plan based on your answers.',
  onChange,
  onAnswer,
}: {
  title?: string;
  subtitle?: string;
  onChange?: (outputs: Outputs) => void;
  onAnswer?: (outputs: Outputs) => void;
}) {
  const [strength, setStrength] = useState<StrengthMg | null>(null);
  const [supplyDays, setSupplyDays] = useState<SupplyDays | null>(null);
  const [justSelectedStrength, setJustSelectedStrength] = useState<string | null>(null);
  const [justSelectedSupply, setJustSelectedSupply] = useState<number | null>(null);
  const [addedPulse, setAddedPulse] = useState(false);

  const strengthRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const supplyRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const lastCartKey = useRef<string | null>(null);

  const emit = useCallback(
    (outputs: Outputs) => {
      onChange?.(outputs);
      onAnswer?.(outputs);
    },
    [onChange, onAnswer]
  );

  const removePriorEstradiolLines = useCallback(() => {
    const cart = window.pathwai?.cart;
    if (!cart) return;
    const items = cart.getItems?.() ?? [];
    items.forEach((item) => {
      const isE2 =
        item.id?.startsWith('E2CAP-') ||
        item.variants?.some(
          (v) => v.name === 'productKey' && v.value === PRODUCT_KEY
        );
      if (isE2) {
        cart.removeItem(item.id, item.variants);
      }
    });
  }, []);

  const syncCart = useCallback(
    (nextStrength: StrengthMg, nextDays: SupplyDays) => {
      const cart = window.pathwai?.cart;
      if (!cart) return;

      const priceId = buildPriceId(nextStrength, nextDays);
      const price = getPrice(nextDays);
      const sKey = strengthKeyOf(nextStrength);
      const cartKey = `${priceId}`;

      if (lastCartKey.current === cartKey) return;

      removePriorEstradiolLines();

      cart.addItem({
        id: priceId,
        name: PRODUCT_NAME,
        price,
        quantity: 1,
        image: PRODUCT_IMAGE,
        variants: [
          { name: 'Strength', value: sKey },
          { name: 'Supply', value: `${nextDays} days` },
          { name: 'productKey', value: PRODUCT_KEY },
          { name: 'supplyDays', value: String(nextDays) },
          { name: 'strength', value: sKey },
          { name: 'priceId', value: priceId },
        ],
      });

      lastCartKey.current = cartKey;
      setAddedPulse(true);
      window.setTimeout(() => setAddedPulse(false), 900);
    },
    [removePriorEstradiolLines]
  );

  useEffect(() => {
    if (!strength || !supplyDays) return;

    const priceId = buildPriceId(strength, supplyDays);
    const price = getPrice(supplyDays);
    const sKey = strengthKeyOf(strength);

    const outputs: Outputs = {
      productKey: PRODUCT_KEY,
      strength: sKey,
      supplyDays,
      priceId,
      price,
      productName: PRODUCT_NAME,
      baseCheckoutUrl: BASE_CHECKOUT_URL,
    };

    emit(outputs);
    syncCart(strength, supplyDays);
  }, [strength, supplyDays, emit, syncCart]);

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

  const handleStrength = (value: StrengthMg) => {
    setStrength(value);
    setJustSelectedStrength(value);
  };

  const handleSupply = (days: SupplyDays) => {
    setSupplyDays(days);
    setJustSelectedSupply(days);
  };

  const selectedPrice =
    strength && supplyDays ? getPrice(supplyDays) : null;
  const selectedPriceId =
    strength && supplyDays ? buildPriceId(strength, supplyDays) : null;
  const isComplete = Boolean(strength && supplyDays);

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
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          ['--pw-motion-enter-delay' as string]: '0ms',
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
          {title}
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
            lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            color: 'var(--pw-label-sublabel-fg, #545454)',
          }}
        >
          {subtitle}
        </p>
      </header>

      {/* Product hero */}
      <section
        className="pw-motion-enter"
        aria-label="Product"
        style={{
          display: 'flex',
          gap: 'var(--pw-element-gap, 1.25rem)',
          alignItems: 'stretch',
          padding: 'var(--pw-control-padding, 1rem)',
          background: 'var(--pw-color-surface, #ffffff)',
          border: '1px solid var(--pw-color-border, #EFEFEC)',
          borderRadius: 'var(--pw-radius, 0.5rem)',
          boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
          ['--pw-motion-enter-delay' as string]: '80ms',
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 88,
            height: 88,
            borderRadius: 'var(--pw-radius, 0.5rem)',
            overflow: 'hidden',
            background: 'var(--pw-answer-media-bg, #F1F0E8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={PRODUCT_IMAGE}
            alt=""
            width={88}
            height={88}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            minWidth: 0,
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--pw-color-muted, #71717a)',
            }}
          >
            Compounded · Oral
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              fontSize: '1.125rem',
              fontWeight: 600,
              lineHeight: 1.3,
              color: 'var(--pw-color-on-surface, #1C1C21)',
            }}
          >
            Compounded Estradiol Oral Capsule
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--pw-font-size-caption, 0.875rem)',
              lineHeight: 1.45,
              color: 'var(--pw-label-sublabel-fg, #545454)',
            }}
          >
            Bioidentical estradiol for menopause and perimenopause support.
            Clinician-reviewed; your doctor may adjust strength after review.
          </p>
        </div>
      </section>

      {/* Strength */}
      <section
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          ['--pw-motion-enter-delay' as string]: '140ms',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--pw-label-fg, #002021)',
            }}
          >
            Strength
          </h3>
          <span
            style={{
              fontSize: 'var(--pw-font-size-caption, 0.8rem)',
              color: 'var(--pw-color-muted, #71717a)',
            }}
          >
            Doctor may adjust later
          </span>
        </div>

        <div
          role="radiogroup"
          aria-label="Estradiol strength"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '0.65rem',
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
                onClick={() => handleStrength(opt.value)}
                style={{
                  ['--pw-motion-enter-delay' as string]: `${160 + index * 60}ms`,
                  minHeight: 52,
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--pw-radius, 0.5rem)',
                  border: selected
                    ? '2px solid var(--pw-color-brand, #161336)'
                    : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                  background: selected
                    ? 'var(--pw-answer-surface-selected, #F1F0E8)'
                    : 'var(--pw-answer-surface, #ffffff)',
                  color: selected
                    ? 'var(--pw-answer-fg-selected, #1C1C21)'
                    : 'var(--pw-answer-fg, #1C1C21)',
                  fontFamily: 'var(--pw-answer-font-family, Inter, system-ui, sans-serif)',
                  fontSize: 'var(--pw-answer-font-size, 1rem)',
                  fontWeight: selected ? 600 : 500,
                  cursor: 'pointer',
                  transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
                  outline: 'none',
                  boxShadow: selected
                    ? 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))'
                    : 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, #8399BF)`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = selected
                    ? 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))'
                    : 'none';
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Supply length */}
      <section
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          ['--pw-motion-enter-delay' as string]: '220ms',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--pw-label-fg, #002021)',
          }}
        >
          Supply length
        </h3>

        <div
          role="radiogroup"
          aria-label="Supply length"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}
        >
          {SUPPLIES.map((opt, index) => {
            const selected = supplyDays === opt.days;
            const disabled = !strength;
            return (
              <button
                key={opt.days}
                ref={(el) => {
                  supplyRefs.current[opt.days] = el;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-disabled={disabled}
                disabled={disabled}
                className="pw-motion-enter"
                onClick={() => {
                  if (disabled) return;
                  handleSupply(opt.days);
                }}
                style={{
                  ['--pw-motion-enter-delay' as string]: `${240 + index * 70}ms`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--pw-answer-gap, 0.75rem)',
                  width: '100%',
                  minHeight: 64,
                  padding: 'var(--pw-control-padding, 1rem)',
                  textAlign: 'left',
                  borderRadius: 'var(--pw-radius, 0.5rem)',
                  border: selected
                    ? '2px solid var(--pw-color-brand, #161336)'
                    : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                  background: selected
                    ? 'var(--pw-answer-surface-selected, #F1F0E8)'
                    : 'var(--pw-answer-surface, #ffffff)',
                  color: 'var(--pw-answer-fg, #1C1C21)',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled
                    ? ('var(--pw-state-disabled-opacity, 0.45)' as unknown as number)
                    : 1,
                  transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
                  outline: 'none',
                  boxShadow: selected
                    ? 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))'
                    : 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  if (disabled) return;
                  e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, #8399BF)`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = selected
                    ? 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))'
                    : 'none';
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    minWidth: 0,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 'var(--pw-answer-indicator-size, 18px)',
                      height: 'var(--pw-answer-indicator-size, 18px)',
                      borderRadius: 'var(--pw-answer-indicator-radius, 999px)',
                      border: selected
                        ? '2px solid var(--pw-answer-indicator-fill, #161336)'
                        : '2px solid var(--pw-answer-border, #E0E0E0)',
                      background: selected
                        ? 'var(--pw-answer-indicator-fill, #161336)'
                        : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
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
                        }}
                      />
                    )}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span
                      style={{
                        fontFamily: 'var(--pw-answer-font-family, Inter, system-ui, sans-serif)',
                        fontSize: 'var(--pw-answer-font-size, 1rem)',
                        fontWeight: selected ? 600 : 500,
                        color: selected
                          ? 'var(--pw-answer-fg-selected, #1C1C21)'
                          : 'var(--pw-answer-fg, #1C1C21)',
                      }}
                    >
                      {opt.label}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--pw-font-size-caption, 0.8rem)',
                        color: 'var(--pw-answer-subtext-fg, #545454)',
                      }}
                    >
                      {opt.perDayHint}
                    </span>
                  </span>
                </span>

                <span
                  style={{
                    fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: 'var(--pw-color-on-surface, #1C1C21)',
                    flexShrink: 0,
                  }}
                >
                  ${opt.price}
                </span>
              </button>
            );
          })}
        </div>

        {!strength && (
          <p
            style={{
              margin: 0,
              fontSize: 'var(--pw-font-size-caption, 0.8rem)',
              color: 'var(--pw-color-muted, #71717a)',
            }}
          >
            Choose a strength to unlock supply options.
          </p>
        )}
      </section>

      {/* Selection summary / cart confirmation */}
      <div
        className="pw-motion-enter"
        aria-live="polite"
        style={{
          ['--pw-motion-enter-delay' as string]: '420ms',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          padding: 'var(--pw-control-padding, 1rem)',
          borderRadius: 'var(--pw-radius, 0.5rem)',
          background: isComplete
            ? 'var(--pw-color-success-surface, #f0fdf4)'
            : 'var(--pw-color-background, #ffffff)',
          border: isComplete
            ? '1px solid var(--pw-color-border, #EFEFEC)'
            : '1px dashed var(--pw-color-border, #EFEFEC)',
          minHeight: 56,
          justifyContent: 'center',
          transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
        }}
      >
        {isComplete && strength && supplyDays ? (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 600,
                  color: 'var(--pw-color-on-surface, #1C1C21)',
                  fontSize: 'var(--pw-font-size-body, 1rem)',
                }}
              >
                {addedPulse && (
                  <span className="pw-motion-pop" aria-hidden style={{ color: 'var(--pw-color-success, #16a34a)' }}>
                    ✓
                  </span>
                )}
                {strengthKeyOf(strength)} · {supplyDays}-day supply
              </span>
              <span
                style={{
                  fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                }}
              >
                ${selectedPrice}
              </span>
            </div>
            <span
              style={{
                fontSize: 'var(--pw-font-size-caption, 0.75rem)',
                color: 'var(--pw-color-muted, #71717a)',
              }}
            >
              Added to your plan
              {selectedPriceId ? ` · ${selectedPriceId}` : ''}
              {' '}(SKU pending confirmation). Continue with Next when ready.
            </span>
          </>
        ) : (
          <span
            style={{
              fontSize: 'var(--pw-font-size-body, 1rem)',
              color: 'var(--pw-color-muted, #71717a)',
            }}
          >
            Select strength and supply to add this capsule to your plan.
          </span>
        )}
      </div>
    </div>
  );
}