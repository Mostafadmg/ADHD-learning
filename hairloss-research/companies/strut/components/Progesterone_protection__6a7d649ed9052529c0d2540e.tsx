import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

export const propSchema = {
  headline: {
    type: 'string',
    title: 'Headline',
    defaultValue: 'Because you have a uterus, progesterone is required',
  },
  clinicalCopy: {
    type: 'string',
    title: 'Clinical copy',
    defaultValue:
      'Estrogen alone can thicken the uterine lining over time. Bioidentical oral progesterone is added to protect it. Your supply matches the estradiol plan already in your cart.',
  },
};

export const outputSchema = {
  choice: {
    type: 'string',
    title: 'Choice',
    description: 'Patient decision: "accept" or "decline"',
    required: true,
  },
  progesteronePriceId: {
    type: 'string',
    title: 'Progesterone price ID',
    description: 'Matched SKU priceId: "2154" | "2209" | "2214"',
  },
  supplyDays: {
    type: 'number',
    title: 'Supply days',
    description: 'Matched supply length: 30, 90, or 150',
  },
  matchedEstradiolSupplyDays: {
    type: 'number',
    title: 'Matched estradiol supply days',
    description: 'Estradiol supply days detected from cart (30, 90, or 150)',
  },
  productKey: {
    type: 'string',
    title: 'Product key',
    description: 'Stable product key: progesterone-e4m-oral-capsule',
  },
};

const PRODUCT_KEY = 'progesterone-e4m-oral-capsule';
const PRODUCT_NAME = 'Progesterone E4M Oral Capsule 100mg';
const STRENGTH = '100mg';

const PROGESTERONE_BY_SUPPLY: Record<
  30 | 90 | 150,
  { priceId: string; price: number; label: string }
> = {
  30: { priceId: '2154', price: 69, label: '30-day supply' },
  90: { priceId: '2209', price: 149, label: '90-day supply' },
  150: { priceId: '2214', price: 199, label: '150-day supply' },
};

type SupplyDays = 30 | 90 | 150;

type Outputs = {
  choice: 'accept' | 'decline';
  progesteronePriceId: string;
  supplyDays: number;
  matchedEstradiolSupplyDays: number;
  productKey: string;
};

function parseSupplyDays(value: unknown): SupplyDays | null {
  if (value == null) return null;
  const raw = String(value);
  const match = raw.match(/\b(150|90|30)\b/);
  if (!match) return null;
  const n = Number(match[1]);
  if (n === 30 || n === 90 || n === 150) return n;
  return null;
}

function detectEstradiolSupplyDays(): SupplyDays {
  const items = window.pathwai?.cart?.getItems?.() ?? [];

  for (const item of items) {
    const id = String(item.id ?? '');
    if (/^E2CAP-.*-(30|90|150)$/i.test(id)) {
      const fromId = parseSupplyDays(id);
      if (fromId) return fromId;
    }

    const variants = item.variants ?? [];
    for (const v of variants) {
      const name = String(v.name ?? '').toLowerCase();
      if (name === 'supplydays' || name === 'supply' || name.includes('supply')) {
        const fromVariant = parseSupplyDays(v.value);
        if (fromVariant) return fromVariant;
      }
    }

    // Fallback: id fragment anywhere for E2CAP items
    if (id.toUpperCase().startsWith('E2CAP-')) {
      const fromId = parseSupplyDays(id);
      if (fromId) return fromId;
    }
  }

  return 30;
}

function isProgesteroneLine(item: {
  id?: string;
  name?: string;
  variants?: { name: string; value: string }[];
}): boolean {
  const id = String(item.id ?? '');
  if (id === '2154' || id === '2209' || id === '2214') return true;
  if (String(item.name ?? '').toLowerCase().includes('progesterone')) return true;
  return (item.variants ?? []).some(
    (v) =>
      String(v.name).toLowerCase() === 'productkey' &&
      String(v.value).toLowerCase() === PRODUCT_KEY
  );
}

function formatPrice(price: number): string {
  return `$${price.toFixed(price % 1 === 0 ? 0 : 2)}`;
}

export default function ProgesteroneAddonApproval({
  headline = 'Because you have a uterus, progesterone is required',
  clinicalCopy = 'Estrogen alone can thicken the uterine lining over time. Bioidentical oral progesterone is added to protect it. Your supply matches the estradiol plan already in your cart.',
  onChange,
  onAnswer,
}: {
  headline?: string;
  clinicalCopy?: string;
  onChange?: (outputs: Outputs) => void;
  onAnswer?: (outputs: Outputs) => void;
}) {
  const [supplyDays, setSupplyDays] = useState<SupplyDays>(30);
  const [selected, setSelected] = useState<'accept' | 'decline' | null>(null);
  const [justSelected, setJustSelected] = useState<'accept' | 'decline' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    setSupplyDays(detectEstradiolSupplyDays());

    const handleCartUpdate = () => {
      if (!selected) setSupplyDays(detectEstradiolSupplyDays());
    };
    window.addEventListener('pathwai:cart:updated', handleCartUpdate as EventListener);
    return () => {
      window.removeEventListener('pathwai:cart:updated', handleCartUpdate as EventListener);
    };
  }, [selected]);

  const sku = useMemo(() => PROGESTERONE_BY_SUPPLY[supplyDays], [supplyDays]);

  useEffect(() => {
    if (!justSelected) return;
    const el = cardRefs.current[justSelected];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSelected]);

  const buildPayload = useCallback(
    (choice: 'accept' | 'decline'): Outputs => ({
      choice,
      progesteronePriceId: sku.priceId,
      supplyDays,
      matchedEstradiolSupplyDays: supplyDays,
      productKey: PRODUCT_KEY,
    }),
    [sku.priceId, supplyDays]
  );

  const replaceProgesteroneInCart = useCallback(() => {
    const cart = window.pathwai?.cart;
    if (!cart) return;

    const existing = cart.getItems?.() ?? [];
    for (const item of existing) {
      if (isProgesteroneLine(item)) {
        cart.removeItem?.(item.id, item.variants);
      }
    }

    cart.addItem?.({
      id: sku.priceId,
      name: PRODUCT_NAME,
      price: sku.price,
      quantity: 1,
      variants: [
        { name: 'productKey', value: PRODUCT_KEY },
        { name: 'supplyDays', value: String(supplyDays) },
        { name: 'strength', value: STRENGTH },
        { name: 'priceId', value: sku.priceId },
      ],
    });
  }, [sku.priceId, sku.price, supplyDays]);

  const handleSelect = (choice: 'accept' | 'decline') => {
    if (submitting) return;
    setSubmitting(true);
    setSelected(choice);
    setJustSelected(choice);

    if (choice === 'accept') {
      replaceProgesteroneInCart();
    }

    const payload = buildPayload(choice);
    onChange?.(payload);
    onAnswer?.(payload);

    window.setTimeout(() => {
      window.pathwai?.flow?.next(payload);
    }, 220);
  };

  const options: {
    id: 'accept' | 'decline';
    title: string;
    subtitle: string;
    emphasis: 'primary' | 'secondary';
  }[] = [
    {
      id: 'accept',
      title: 'Yes, add progesterone to my plan',
      subtitle: `Adds ${PRODUCT_NAME} · ${sku.label} for ${formatPrice(sku.price)}`,
      emphasis: 'primary',
    },
    {
      id: 'decline',
      title: 'No, I do not want progesterone',
      subtitle: 'Continue without adding this medication',
      emphasis: 'secondary',
    },
  ];

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
      <header
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          ['--pw-motion-enter-delay' as string]: '0ms',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--pw-label-sublabel-fg, #545454)',
          }}
        >
          Required with estrogen
        </p>
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
          {headline}
        </h1>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--pw-content-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-content-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 'var(--pw-content-font-weight, var(--pw-font-weight-body, 400))' as unknown as number,
            lineHeight: 'var(--pw-content-line-height, 1.55)',
            color: 'var(--pw-content-fg, var(--pw-color-on-surface, #1C1C21))',
          }}
        >
          {clinicalCopy}
        </p>
      </header>

      <section
        className="pw-motion-enter"
        aria-label="Matched progesterone supply"
        style={{
          ['--pw-motion-enter-delay' as string]: '80ms',
          background: 'var(--pw-color-surface, #ffffff)',
          border: '1.5px solid var(--pw-color-border, #EFEFEC)',
          borderRadius: 'var(--pw-radius, 0.5rem)',
          boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
          padding: 'var(--pw-control-padding, 1rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: 0, flex: 1 }}>
            <span
              style={{
                fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
                fontWeight: 600,
                color: 'var(--pw-label-sublabel-fg, #545454)',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              Matched to your estradiol
            </span>
            <span
              style={{
                fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
                fontSize: 'var(--pw-font-size-body, 1rem)',
                fontWeight: 600,
                color: 'var(--pw-color-on-surface, #1C1C21)',
                lineHeight: 1.35,
              }}
            >
              {PRODUCT_NAME}
            </span>
            <span
              style={{
                fontSize: 'var(--pw-font-size-body, 1rem)',
                color: 'var(--pw-color-muted, #71717a)',
                lineHeight: 1.45,
              }}
            >
              {STRENGTH} · {sku.label}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.25rem',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
                fontSize: '1.375rem',
                fontWeight: 600,
                color: 'var(--pw-color-brand, #161336)',
                lineHeight: 1.2,
              }}
            >
              {formatPrice(sku.price)}
            </span>
            <span
              style={{
                fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
                color: 'var(--pw-color-muted, #71717a)',
              }}
            >
              one-time for this supply
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid var(--pw-color-border, #EFEFEC)',
          }}
        >
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: 'var(--pw-color-brand, #161336)',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
              color: 'var(--pw-label-sublabel-fg, #545454)',
              lineHeight: 1.4,
            }}
          >
            Supply length mirrors your compounded estradiol oral capsule ({supplyDays} days)
          </span>
        </div>
      </section>

      <div
        role="group"
        aria-label="Progesterone approval"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pw-element-gap, 1.25rem)',
          marginTop: '0.25rem',
        }}
      >
        {options.map((opt, index) => {
          const isSelected = selected === opt.id;
          const isAccept = opt.id === 'accept';

          return (
            <button
              key={opt.id}
              ref={(el) => {
                cardRefs.current[opt.id] = el;
              }}
              type="button"
              className="pw-motion-enter"
              disabled={submitting}
              aria-pressed={isSelected}
              onClick={() => handleSelect(opt.id)}
              style={{
                ['--pw-motion-enter-delay' as string]: `${160 + index * 100}ms`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--pw-answer-gap, 0.875rem)',
                width: '100%',
                textAlign: 'left',
                cursor: submitting ? 'default' : 'pointer',
                minHeight: 72,
                padding: 'var(--pw-control-padding, 1rem)',
                borderRadius: 'var(--pw-radius, 0.5rem)',
                border: isSelected
                  ? '2px solid var(--pw-color-brand, #161336)'
                  : isAccept
                    ? '1.5px solid var(--pw-color-brand, #161336)'
                    : '1.5px solid var(--pw-answer-border, #E0E0E0)',
                background: isSelected
                  ? 'var(--pw-answer-surface-selected, #F1F0E8)'
                  : 'var(--pw-answer-surface, #ffffff)',
                boxShadow: isAccept && !isSelected
                  ? 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))'
                  : 'none',
                color: isSelected
                  ? 'var(--pw-answer-fg-selected, var(--pw-color-on-surface, #1C1C21))'
                  : 'var(--pw-answer-fg, #1C1C21)',
                opacity: submitting && !isSelected
                  ? ('var(--pw-state-disabled-opacity, 0.45)' as unknown as number)
                  : 1,
                transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
                outline: 'none',
                boxSizing: 'border-box',
                WebkitTapHighlightColor: 'transparent',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 3px var(--pw-state-focus-ring, #8399BF)`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow =
                  isAccept && !isSelected
                    ? 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))'
                    : 'none';
              }}
            >
              <span
                aria-hidden
                style={{
                  display: 'var(--pw-answer-indicator-display, flex)' as React.CSSProperties['display'],
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'var(--pw-answer-indicator-size, 22px)',
                  height: 'var(--pw-answer-indicator-size, 22px)',
                  minWidth: 'var(--pw-answer-indicator-size, 22px)',
                  marginTop: 2,
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
                {isSelected && (
                  <span
                    className="pw-motion-pop"
                    style={{
                      display: 'var(--pw-answer-indicator-dot-display, flex)' as React.CSSProperties['display'],
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: 'var(--pw-answer-indicator-check, #ffffff)',
                    }}
                  />
                )}
              </span>

              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                    fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
                    fontWeight: isAccept ? 600 : ('var(--pw-answer-font-weight, var(--pw-font-weight-body, 400))' as unknown as number),
                    lineHeight: 1.35,
                    color: 'inherit',
                  }}
                >
                  {opt.title}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--pw-answer-subtext-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
                    fontSize: 'var(--pw-answer-subtext-font-size, 0.875rem)',
                    fontWeight: 'var(--pw-answer-subtext-font-weight, 400)' as unknown as number,
                    lineHeight: 1.45,
                    color: 'var(--pw-answer-subtext-fg, var(--pw-label-sublabel-fg, #545454))',
                  }}
                >
                  {opt.subtitle}
                </span>
              </span>

              {isSelected && submitting && (
                <span
                  className="pw-motion-spin"
                  aria-hidden
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    border: '2px solid var(--pw-color-brand, #161336)',
                    borderRightColor: 'transparent',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}