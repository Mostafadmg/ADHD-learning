import React, { useState, useMemo, useEffect } from 'react';

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'BMI Calculator',
  },
  colorUnderweight: {
    type: 'color',
    title: 'Underweight Color',
    defaultValue: '#3b82f6', // blue
  },
  colorNormal: {
    type: 'color',
    title: 'Normal Color',
    defaultValue: '#22c55e', // green
  },
  colorOverweight: {
    type: 'color',
    title: 'Overweight Color',
    defaultValue: '#eab308', // yellow
  },
  colorObese: {
    type: 'color',
    title: 'Obese Color',
    defaultValue: '#ef4444', // red
  },
};

export const outputSchema = {
  bmi: {
    type: 'number',
    title: 'Calculated BMI',
    description: 'The numerical Body Mass Index',
    required: true,
  },
  category: {
    type: 'string',
    title: 'BMI Category',
    description: 'Underweight, Normal, Overweight, or Obese',
    required: true,
  },
};

// Helper to draw SVG arcs
const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0);
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
};

const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');
};

export default function BmiClock({
  title = 'BMI Calculator',
  colorUnderweight = '#3b82f6',
  colorNormal = '#22c55e',
  colorOverweight = '#eab308',
  colorObese = '#ef4444',
  onChange,
}: {
  title?: string;
  colorUnderweight?: string;
  colorNormal?: string;
  colorOverweight?: string;
  colorObese?: string;
  onChange?: (outputs: { bmi: number; category: string }) => void;
}) {
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(70);

  // Calculate BMI and Category
  const { bmi, category } = useMemo(() => {
    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
      return { bmi: 0, category: 'Enter values' };
    }
    const heightM = heightCm / 100;
    const calculatedBmi = Number((weightKg / (heightM * heightM)).toFixed(1));

    let cat = '';
    if (calculatedBmi < 18.5) cat = 'Underweight';
    else if (calculatedBmi < 25) cat = 'Normal';
    else if (calculatedBmi < 30) cat = 'Overweight';
    else cat = 'Obese';

    return { bmi: calculatedBmi, category: cat };
  }, [heightCm, weightKg]);

  // Emit outputs for routing/templates
  useEffect(() => {
    if (bmi > 0) {
      onChange?.({ bmi, category });
    }
  }, [bmi, category, onChange]);

  // Clock Math: Map BMI range [10, 40] to Angle [-120deg, 120deg]
  const minBmi = 10;
  const maxBmi = 40;
  const minAngle = -120;
  const maxAngle = 120;
  const angleRange = maxAngle - minAngle;
  const bmiRange = maxBmi - minBmi;

  const getAngle = (val: number) => {
    const clamped = Math.max(minBmi, Math.min(val, maxBmi));
    return ((clamped - minBmi) / bmiRange) * angleRange + minAngle;
  };

  const needleAngle = bmi > 0 ? getAngle(bmi) : minAngle;

  const arcUnderweight = describeArc(100, 100, 80, getAngle(10), getAngle(18.5));
  const arcNormal = describeArc(100, 100, 80, getAngle(18.5), getAngle(25));
  const arcOverweight = describeArc(100, 100, 80, getAngle(25), getAngle(30));
  const arcObese = describeArc(100, 100, 80, getAngle(30), getAngle(40));

  return (
    <div
      className="pw-motion-enter"
      style={{
        backgroundColor: 'var(--pw-color-surface, #FFFFFF)',
        borderRadius: 'var(--pw-radius, 8px)',
        padding: 'var(--pw-control-padding, 24px)',
        boxShadow: 'var(--pw-shadow, 0 1px 2px rgba(0,0,0,0.05))',
        maxWidth: '400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 24px)',
        fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
      }}
    >
      {title && (
        <h2
          style={{
            margin: 0,
            textAlign: 'center',
            fontFamily: 'var(--pw-font-family-title, inherit)',
            fontSize: 'var(--pw-font-size-title, 1.5rem)',
            fontWeight: 'var(--pw-font-weight-title, 600)',
            color: 'var(--pw-label-fg, #002021)',
          }}
        >
          {title}
        </h2>
      )}

      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
        <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
          {/* Dial Arcs */}
          <path d={arcUnderweight} fill="none" stroke={colorUnderweight} strokeWidth="16" strokeLinecap="round" />
          <path d={arcNormal} fill="none" stroke={colorNormal} strokeWidth="16" strokeLinecap="butt" />
          <path d={arcOverweight} fill="none" stroke={colorOverweight} strokeWidth="16" strokeLinecap="butt" />
          <path d={arcObese} fill="none" stroke={colorObese} strokeWidth="16" strokeLinecap="round" />

          {/* Dial Ticks (optional visual flair) */}
          {[10, 18.5, 25, 30, 40].map((tickBmi) => {
            const angle = getAngle(tickBmi);
            const inner = polarToCartesian(100, 100, 68, angle);
            const outer = polarToCartesian(100, 100, 72, angle);
            return (
              <line
                key={tickBmi}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="var(--pw-color-surface, #ffffff)"
                strokeWidth="2"
              />
            );
          })}

          {/* Needle Group */}
          <g
            style={{
              transform: `rotate(${needleAngle}deg)`,
              transformOrigin: '100px 100px',
              transition: 'transform var(--pw-motion-duration, 500ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))',
            }}
          >
            {/* Needle Polygon */}
            <polygon
              points="96,100 104,100 100,28"
              fill="var(--pw-color-brand, #161336)"
            />
            {/* Center Pivot Point */}
            <circle cx="100" cy="100" r="8" fill="var(--pw-color-brand, #161336)" />
            <circle cx="100" cy="100" r="3" fill="var(--pw-color-surface, #ffffff)" />
          </g>
        </svg>

        {/* Center Text Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '0',
            right: '0',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--pw-color-on-surface, #002021)',
              lineHeight: '1',
            }}
          >
            {bmi > 0 ? bmi : '--'}
          </span>
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginTop: '4px',
              color: 
                category === 'Underweight' ? colorUnderweight :
                category === 'Normal' ? colorNormal :
                category === 'Overweight' ? colorOverweight :
                category === 'Obese' ? colorObese :
                'var(--pw-color-muted, #545454)'
            }}
          >
            {category}
          </span>
        </div>
      </div>

      {/* Inputs */}
      <div style={{ display: 'flex', gap: 'var(--pw-element-gap, 12px)' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.875rem', color: 'var(--pw-label-sublabel-fg, #545454)', fontWeight: 500 }}>
            Height (cm)
          </label>
          <input
            type="number"
            value={heightCm || ''}
            onChange={(e) => setHeightCm(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--pw-radius, 8px)',
              border: '1px solid var(--pw-input-border, #EFEFEC)',
              background: 'var(--pw-input-bg, #FFFFFF)',
              color: 'var(--pw-input-fg, #002021)',
              fontFamily: 'inherit',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
            min="50"
            max="300"
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.875rem', color: 'var(--pw-label-sublabel-fg, #545454)', fontWeight: 500 }}>
            Weight (kg)
          </label>
          <input
            type="number"
            value={weightKg || ''}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--pw-radius, 8px)',
              border: '1px solid var(--pw-input-border, #EFEFEC)',
              background: 'var(--pw-input-bg, #FFFFFF)',
              color: 'var(--pw-input-fg, #002021)',
              fontFamily: 'inherit',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
            min="10"
            max="500"
          />
        </div>
      </div>
    </div>
  );
}