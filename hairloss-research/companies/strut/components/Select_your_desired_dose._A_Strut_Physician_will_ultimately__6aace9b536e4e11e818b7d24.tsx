import React, { useState, useEffect, useRef } from 'react';

type Dose = '500mg' | '1000mg';
type Supply = '30' | '90';

type Outputs = {
  dose: Dose;
  supply: Supply;
  label: string;
  price: number;
};

const PRICE_MAP: Record<Dose, Record<Supply, number>> = {
  '500mg': { '30': 39, '90': 99 },
  '1000mg': { '30': 49, '90': 129 },
};

const DOSE_OPTIONS: { value: Dose; label: string }[] = [
  { value: '500mg', label: '500 mg' },
  { value: '1000mg', label: '1000 mg' },
];

const SUPPLY_OPTIONS: { value: Supply; label: string }[] = [
  { value: '30', label: '30 day' },
  { value: '90', label: '90 day' },
];

function buildLabel(productName: string, dose: Dose, supply: Supply) {
  const doseText = dose === '500mg' ? '500 mg' : '1000 mg';
  const supplyText = supply === '30' ? '30 day' : '90 day';
  return `${productName} ${doseText} · ${supplyText}`;
}

export const propSchema = {
  title: {
    type: 'string',
    title: 'Product name',
    defaultValue: 'Metformin',
  },
  subtitle: {
    type: 'string',
    title: 'Subtitle',
    defaultValue: 'Prescription metformin · compounded by a US licensed pharmacy',
  },
  ctaLabel: {
    type: 'string',
    title: 'Button label',
    defaultValue: 'Add to cart',
  },
  finePrint: {
    type: 'string',
    title: 'Fine print',
    defaultValue: 'A Strut physician will review and may adjust your dose.',
  },
};

export const outputSchema = {
  dose: {
    type: 'string',
    title: 'Dose',
    description: 'Selected dose: "500mg" or "1000mg"',
    required: true,
  },
  supply: {
    type: 'string',
    title: 'Supply',
    description: 'Selected supply: "30" or "90"',
    required: true,
  },
  label: {
    type: 'string',
    title: 'Selection label',
    description: 'Human-readable pick, e.g. "Metformin 500 mg · 30 day"',
  },
  price: {
    type: 'number',
    title: 'Price',
    description: 'Display price in USD for the selected dose and supply',
  },
};

export default function MetforminDoseCard({
  title = 'Metformin',
  subtitle = 'Prescription metformin · compounded by a US licensed pharmacy',
  ctaLabel = 'Add to cart',
  finePrint = 'A Strut physician will review and may adjust your dose.',
  onChange,
}: {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  finePrint?: string;
  onChange?: (outputs: Outputs) => void;
}) {
  const [dose, setDose] = useState<Dose>('500mg');
  const [supply, setSupply] = useState<Supply>('30');
  const [justDose, setJustDose] = useState<Dose | null>(null);
  const [justSupply, setJustSupply] = useState<Supply | null>(null);
  const [hoveredChip, setHoveredChip] = useState<string | null>(null);
  const [ctaHover, setCtaHover] = useState(false);
  const [ctaPressed, setCtaPressed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'adding' | 'added'>('idle');
  const [focused, setFocused] = useState<string | null>(null);

  const doseRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const supplyRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const ctaRef = useRef<HTMLButtonElement | null>(null);

  const price = PRICE_MAP[dose][supply];
  const label = buildLabel(title, dose, supply);
  const busy = status !== 'idle';

  useEffect(() => {
    onChange?.({ dose, supply, label, price });
  }, [dose, supply, label, price, onChange]);

  useEffect(() => {
    if (!justDose) return;
    const el = doseRefs.current[justDose];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justDose]);

  useEffect(() => {
    if (!justSupply) return;
    const el = supplyRefs.current[justSupply];
    if (!el) return;
    el.classList.remove('pw-motion-just-selected');
    void el.offsetWidth;
    el.classList.add('pw-motion-just-selected');
  }, [justSupply]);

  const syncCart = () => {
    const cart = window.pathwai?.cart;
    if (!cart) return;
    const items = cart.getItems?.() ?? [];
    items.forEach((item) => {
      if (item.id === 'metformin') {
        cart.removeItem(item.id, item.variants);
      }
    });
    cart.addItem({
      id: 'metformin',
      name: label,
      price,
      quantity: 1,
      variants: [
        { name: 'Dose', value: dose === '500mg' ? '500 mg' : '1000 mg' },
        { name: 'Supply', value: supply === '30' ? '30 day' : '90 day' },
      ],
    });
  };

  const handleAddToCart = () => {
    if (busy) return;
    setStatus('adding');

    const el = ctaRef.current;
    if (el) {
      el.classList.remove('pw-motion-pop');
      void el.offsetWidth;
      el.classList.add('pw-motion-pop');
    }

    const answer = { dose, supply, label };
    onChange?.({ dose, supply, label, price });
    syncCart();

    window.setTimeout(() => {
      const flow = window.pathwai?.flow;
      if (flow?.next) {
        flow.next(answer);
        return;
      }
      setStatus('added');
      window.setTimeout(() => setStatus('idle'), 1600);
    }, 140);
  };

  const chipStyle = (selected: boolean, chipKey: string): React.CSSProperties => {
    const hovered = !selected && hoveredChip === chipKey;
    const isFocused = focused === chipKey;
    return {
      flex: 1,
      minWidth: 0,
      minHeight: 44,
      padding: '0.7rem 0.75rem',
      borderRadius: 'var(--pw-radius, 0.5rem)',
      border: selected
        ? '1.5px solid var(--pw-color-brand, #161336)'
        : '1.5px solid var(--pw-color-mist, #EFEFEC)',
      background: selected
        ? 'var(--pw-color-brand, #161336)'
        : hovered
          ? 'var(--pw-state-hover, #F1F0E8)'
          : 'var(--pw-color-cream, #F1F0E8)',
      color: selected
        ? 'var(--pw-color-brand-contrast, #ffffff)'
        : 'var(--pw-color-on-surface, #1C1C21)',
      fontFamily: 'var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
      fontSize: 'var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))',
      fontWeight: selected ? 600 : 500,
      letterSpacing: 'var(--pw-font-letter-spacing-body, 0)',
      lineHeight: 1.2,
      cursor: 'pointer',
      outline: isFocused ? '2px solid var(--pw-state-focus-ring, #8399BF)' : 'none',
      outlineOffset: 2,
      WebkitTapHighlightColor: 'transparent',
      transition: `background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1)), border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
    };
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 'var(--pw-step-max-width, 617px)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
      }}
    >
      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 'var(--pw-element-gap, 1.25rem)',
          ['--pw-motion-enter-delay' as string]: '0ms',
        } as React.CSSProperties}
      >
        <div
          aria-hidden="true"
          style={{
            width: 132,
            height: 132,
            borderRadius: 999,
            background: 'var(--pw-color-cream, #F1F0E8)',
            boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="88" height="52" viewBox="0 0 88 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="3"
              y="8"
              width="82"
              height="36"
              rx="18"
              fill="var(--pw-color-surface, #ffffff)"
              stroke="var(--pw-color-mist, #EFEFEC)"
              strokeWidth="1.5"
            />
            <rect x="44" y="14" width="1.5" height="24" rx="0.75" fill="var(--pw-color-mist, #EFEFEC)" />
            <ellipse cx="24" cy="20" rx="10" ry="5" fill="var(--pw-color-cream, #F1F0E8)" opacity="0.7" />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxWidth: '100%' }}>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--pw-label-font-family, var(--pw-font-family-title, Figtree, system-ui, sans-serif))',
              fontSize: 'var(--pw-label-font-size, var(--pw-font-size-title, 1.75rem))',
              fontWeight: 'var(--pw-label-font-weight, var(--pw-font-weight-title, 500))' as React.CSSProperties['fontWeight'],
              lineHeight: 'var(--pw-label-line-height, var(--pw-font-line-height-title, 1.2))',
              letterSpacing: 'var(--pw-label-letter-spacing, -0.02em)',
              color: 'var(--pw-label-fg, #002021)',
            }}
          >
            {title}
          </h2>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--pw-label-sublabel-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
              fontSize: 'var(--pw-label-sublabel-font-size, var(--pw-font-size-caption, 0.875rem))',
              fontWeight: 'var(--pw-label-sublabel-font-weight, 400)' as React.CSSProperties['fontWeight'],
              lineHeight: 1.45,
              color: 'var(--pw-label-sublabel-fg, #545454)',
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          ['--pw-motion-enter-delay' as string]: '80ms',
        } as React.CSSProperties}
      >
        <div
          id="metformin-dose-label"
          style={{
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--pw-color-muted, #71717a)',
          }}
        >
          Dose
        </div>
        <div
          role="radiogroup"
          aria-labelledby="metformin-dose-label"
          style={{ display: 'flex', gap: 'var(--pw-answer-gap, 0.75rem)' }}
        >
          {DOSE_OPTIONS.map((opt) => {
            const selected = dose === opt.value;
            const chipKey = `dose-${opt.value}`;
            return (
              <button
                key={opt.value}
                ref={(el) => {
                  doseRefs.current[opt.value] = el;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={busy}
                style={chipStyle(selected, chipKey)}
                onClick={() => {
                  setDose(opt.value);
                  setJustDose(opt.value);
                }}
                onMouseEnter={() => setHoveredChip(chipKey)}
                onMouseLeave={() => setHoveredChip(null)}
                onFocus={() => setFocused(chipKey)}
                onBlur={() => setFocused((f) => (f === chipKey ? null : f))}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          ['--pw-motion-enter-delay' as string]: '160ms',
        } as React.CSSProperties}
      >
        <div
          id="metformin-supply-label"
          style={{
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--pw-color-muted, #71717a)',
          }}
        >
          Supply
        </div>
        <div
          role="radiogroup"
          aria-labelledby="metformin-supply-label"
          style={{ display: 'flex', gap: 'var(--pw-answer-gap, 0.75rem)' }}
        >
          {SUPPLY_OPTIONS.map((opt) => {
            const selected = supply === opt.value;
            const chipKey = `supply-${opt.value}`;
            return (
              <button
                key={opt.value}
                ref={(el) => {
                  supplyRefs.current[opt.value] = el;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={busy}
                style={chipStyle(selected, chipKey)}
                onClick={() => {
                  setSupply(opt.value);
                  setJustSupply(opt.value);
                }}
                onMouseEnter={() => setHoveredChip(chipKey)}
                onMouseLeave={() => setHoveredChip(null)}
                onFocus={() => setFocused(chipKey)}
                onBlur={() => setFocused((f) => (f === chipKey ? null : f))}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 'var(--pw-element-gap, 1.25rem)',
          paddingTop: 'var(--pw-element-gap, 1.25rem)',
          borderTop: '1px solid var(--pw-color-border, #EFEFEC)',
          ['--pw-motion-enter-delay' as string]: '240ms',
        } as React.CSSProperties}
      >
        <span
          style={{
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
            fontWeight: 500,
            color: 'var(--pw-color-muted, #71717a)',
            letterSpacing: '0.02em',
          }}
        >
          Total today
        </span>
        <span
          aria-live="polite"
          style={{
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-title, 1.75rem)',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: 'var(--pw-label-fg, #002021)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          ${price}
        </span>
      </div>

      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem 1.25rem',
          ['--pw-motion-enter-delay' as string]: '300ms',
        } as React.CSSProperties}
      >
        <TrustItem
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="5" r="2.25" stroke="currentColor" strokeWidth="1.4" />
              <path
                d="M3.5 13.25c.4-2.2 2-3.5 4.5-3.5s4.1 1.3 4.5 3.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          }
          text="Doctor consult"
        />
        <TrustItem
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 2.25 13.25 5v3.1c0 3.15-2.15 5.2-5.25 6.15C5 13.3 2.75 11.25 2.75 8.1V5L8 2.25Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path d="M5.75 8.1 7.2 9.5l3.15-3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          text="FDA-registered pharmacy"
        />
      </div>

      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          ['--pw-motion-enter-delay' as string]: '380ms',
        } as React.CSSProperties}
      >
        <button
          ref={ctaRef}
          type="button"
          onClick={handleAddToCart}
          disabled={busy}
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => {
            setCtaHover(false);
            setCtaPressed(false);
          }}
          onMouseDown={() => setCtaPressed(true)}
          onMouseUp={() => setCtaPressed(false)}
          onFocus={() => setFocused('cta')}
          onBlur={() => setFocused((f) => (f === 'cta' ? null : f))}
          style={{
            width: '100%',
            minHeight: 52,
            padding: 'var(--pw-navigation-button-padding, var(--pw-control-padding, 1rem))',
            border: 'none',
            borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
            background: 'var(--pw-button-bg, #161336)',
            color: 'var(--pw-button-fg, #ffffff)',
            fontFamily: 'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
            fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
            fontWeight: 600,
            letterSpacing: '0.01em',
            cursor: busy ? 'default' : 'pointer',
            opacity: busy
              ? 'var(--pw-state-disabled-opacity, 0.45)'
              : ctaPressed
                ? 0.86
                : ctaHover
                  ? 0.92
                  : 1,
            outline: focused === 'cta' ? '2px solid var(--pw-state-focus-ring, #8399BF)' : 'none',
            outlineOffset: 2,
            WebkitTapHighlightColor: 'transparent',
            transition: `opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
          }}
        >
          {status === 'added' ? 'Added' : ctaLabel}
        </button>
        <p
          style={{
            margin: 0,
            textAlign: 'center',
            fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
            lineHeight: 1.45,
            color: 'var(--pw-color-muted, #71717a)',
          }}
        >
          {finePrint}
        </p>
      </div>
    </div>
  );
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        minHeight: 32,
        color: 'var(--pw-color-muted, #71717a)',
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          background: 'var(--pw-color-mist, #EFEFEC)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: 'var(--pw-color-navy, #161336)',
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
          fontSize: 'var(--pw-font-size-caption, 0.8125rem)',
          fontWeight: 500,
          lineHeight: 1.3,
        }}
      >
        {text}
      </span>
    </div>
  );
}
