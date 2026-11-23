import { useState, useEffect } from "react";

export default function BMICalculator({
  accentColor = "#225664",
  trackColor = "#e8e8e8",
  defaultBmiColor = "#1a1a1a",
  inputBackground = "#ffffff",
  inputBorderColor = "#e0e0e0",
  inputFocusBorderColor = "#225664",
  labelColor = "#1a1a1a",
  placeholderColor = "#ccc",
  inputBorderWidth = 1.5,
  inputBorderRadius = 10,
  bodyFont = "'Inter', -apple-system, sans-serif",
  headingFont = "'DM Sans', -apple-system, sans-serif",
  useMetric = false,
  onChange,
}: {
  accentColor?: string;
  trackColor?: string;
  defaultBmiColor?: string;
  inputBackground?: string;
  inputBorderColor?: string;
  inputFocusBorderColor?: string;
  labelColor?: string;
  placeholderColor?: string;
  inputBorderWidth?: number;
  inputBorderRadius?: number;
  bodyFont?: string;
  headingFont?: string;
  useMetric?: boolean;
  onChange?: (outputs: { bmi: number; weightKg: number; weightLbs: number }) => void;
}) {
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [animatedBmi, setAnimatedBmi] = useState(0);

  // Clean reset when switching unit systems so stale values don't linger
  useEffect(() => {
    setFeet("");
    setInches("");
    setHeight("");
    setWeight("");
  }, [useMetric]);

  let bmi = 0;
  let weightKg = 0;
  let weightLbs = 0;

  if (useMetric) {
    const heightCm = parseFloat(height) || 0;
    const weightKgInput = parseFloat(weight) || 0;
    weightKg = weightKgInput;
    weightLbs = weightKgInput * 2.20462;
    bmi = heightCm > 0 && weightKgInput > 0 ? (weightKgInput / (heightCm * heightCm)) * 10000 : 0;
  } else {
    const totalInches = (parseInt(feet) || 0) * 12 + (parseInt(inches) || 0);
    const weightLbsInput = parseInt(weight) || 0;
    weightLbs = weightLbsInput;
    weightKg = weightLbsInput / 2.20462;
    bmi = totalInches > 0 && weightLbsInput > 0 ? (weightLbsInput / (totalInches * totalInches)) * 703 : 0;
  }

  const bmiRounded = Math.round(bmi * 10) / 10;

  // Emit outputs whenever bmi, weightKg, or weightLbs changes
  useEffect(() => {
    onChange?.({
      bmi: bmiRounded,
      weightKg: Math.round(weightKg * 100) / 100,
      weightLbs: Math.round(weightLbs * 100) / 100,
    });
  }, [bmiRounded, weightKg, weightLbs, onChange]);

  useEffect(() => {
    const duration = 2200;
    const start = performance.now();
    const from = animatedBmi;
    const to = bmiRounded;
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      setAnimatedBmi(Math.round((from + (to - from) * eased) * 10) / 10);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [bmiRounded]);

  const minBmi = 15;
  const maxBmi = 45;
  const clampedBmi = Math.max(minBmi, Math.min(maxBmi, animatedBmi));
  const angle = ((clampedBmi - minBmi) / (maxBmi - minBmi)) * 180;

  const cx = 170,
    cy = 150,
    r = 120;
  const trackStart = { x: cx - r, y: cy };
  const trackEnd = { x: cx + r, y: cy };

  const rad = (angle * Math.PI) / 180;
  const fillX = cx - r * Math.cos(rad);
  const fillY = cy - r * Math.sin(rad);
  const largeArc = angle > 180 ? 1 : 0;

  const getBmiColor = (val) => {
    if (val < 25) return "#2ecc71";
    if (val < 27.5) return "#a8d844";
    if (val < 30) return "#f0c230";
    if (val < 35) return "#e67e22";
    return "#e74c3c";
  };

  const getBmiLabel = (val) => {
    if (val <= 0) return "";
    if (val < 18.5) return "Underweight";
    if (val < 25) return "Healthy";
    if (val < 30) return "Overweight";
    if (val < 35) return "Obese";
    return "Severely Obese";
  };

  const bmiColor = animatedBmi > 0 ? getBmiColor(animatedBmi) : defaultBmiColor;
  const bmiLabel = getBmiLabel(animatedBmi);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .bmi-wrap {
          max-width: 480px;
          margin: 0 auto;
          padding: 0 16px 32px;
          font-family: ${bodyFont};
          box-sizing: border-box;
          width: 100%;
        }
        .bmi-wrap *, .bmi-wrap *::before, .bmi-wrap *::after { box-sizing: border-box; }

        .bmi-gauge {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 40px;
        }
        .bmi-svg {
          display: block;
          width: 100%;
          max-width: 400px;
          height: auto;
        }
        .bmi-reading {
          margin-top: -72px;
          text-align: center;
        }
        .bmi-reading-label {
          font-size: 14px;
          font-weight: 500;
          color: #999;
          margin: 0 0 4px;
        }
        .bmi-reading-value {
          font-family: ${headingFont};
          font-size: 52px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -1.5px;
          transition: color 0.4s ease;
        }
        .bmi-reading-status {
          font-family: ${headingFont};
          font-size: 14px;
          font-weight: 500;
          margin-top: 6px;
          transition: color 0.4s ease;
        }

        .bmi-row {
          display: flex;
          gap: 14px;
          margin-bottom: 14px;
        }
        .bmi-row:last-child {
          margin-bottom: 0;
        }
        .bmi-field {
          flex: 1;
          position: relative;
        }
        .bmi-label {
          position: absolute;
          top: 12px;
          left: 16px;
          font-size: 11.5px;
          font-weight: 500;
          color: ${labelColor};
          pointer-events: none;
          letter-spacing: 0.2px;
        }
        .bmi-input {
          width: 100%;
          padding: 34px 16px 12px;
          border: ${inputBorderWidth}px solid ${inputBorderColor};
          border-radius: ${inputBorderRadius}px;
          font-size: 18px;
          font-family: ${bodyFont};
          font-weight: 500;
          color: #1a1a1a;
          background: ${inputBackground};
          outline: none;
          appearance: none;
          -moz-appearance: textfield;
          transition: border-color 0.2s ease;
        }
        .bmi-input::-webkit-outer-spin-button,
        .bmi-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .bmi-input::placeholder {
          color: ${placeholderColor};
          font-weight: 400;
        }
        .bmi-input:focus {
          border-color: ${inputFocusBorderColor};
        }

        @media (min-width: 900px) {
          .bmi-wrap { max-width: 580px; }
          .bmi-svg { max-width: 440px; }
          .bmi-reading { margin-top: -80px; }
          .bmi-reading-value { font-size: 58px; }
          .bmi-reading-label { font-size: 15px; margin-bottom: 6px; }
          .bmi-reading-status { font-size: 16px; }
          .bmi-input { font-size: 19px; padding: 36px 18px 14px; }
          .bmi-label { font-size: 12px; top: 12px; left: 18px; }
          .bmi-row { gap: 16px; margin-bottom: 16px; }
          .bmi-gauge { margin-bottom: 48px; }
        }

        @media (min-width: 600px) and (max-width: 899px) {
          .bmi-wrap { max-width: 520px; }
          .bmi-svg { max-width: 420px; }
          .bmi-reading { margin-top: -76px; }
          .bmi-reading-value { font-size: 54px; }
          .bmi-reading-label { font-size: 14.5px; }
          .bmi-reading-status { font-size: 15px; }
          .bmi-input { font-size: 18px; }
          .bmi-gauge { margin-bottom: 44px; }
        }

        @media (max-width: 380px) {
          .bmi-wrap { padding: 0 12px 28px; }
          .bmi-svg { max-width: 320px; }
          .bmi-reading { margin-top: -58px; }
          .bmi-reading-value { font-size: 42px; }
          .bmi-reading-label { font-size: 12px; }
          .bmi-reading-status { font-size: 12.5px; }
          .bmi-input { font-size: 16px; padding: 30px 14px 10px; }
          .bmi-label { font-size: 10.5px; top: 10px; left: 14px; }
          .bmi-row { gap: 10px; margin-bottom: 10px; }
          .bmi-gauge { margin-bottom: 32px; }
        }

        @media (max-width: 340px) {
          .bmi-svg { max-width: 280px; }
          .bmi-reading { margin-top: -50px; }
          .bmi-reading-value { font-size: 36px; }
          .bmi-reading-label { font-size: 11px; }
          .bmi-input { font-size: 15px; padding: 26px 12px 9px; }
          .bmi-label { font-size: 10px; top: 8px; left: 12px; }
          .bmi-row { gap: 8px; }
        }
      `}</style>

      <div className="bmi-wrap">
        <div className="bmi-gauge">
          <svg className="bmi-svg" viewBox="0 0 340 160">
            <defs>
              <linearGradient id="bmiArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={bmiColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={bmiColor} stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 0 1 ${trackEnd.x} ${trackEnd.y}`}
              fill="none"
              stroke={trackColor}
              strokeWidth="12"
              strokeLinecap="round"
            />
            {animatedBmi > 0 && (
              <path
                d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${largeArc} 1 ${fillX} ${fillY}`}
                fill="none"
                stroke="url(#bmiArcGrad)"
                strokeWidth="12"
                strokeLinecap="round"
              />
            )}
          </svg>

          <div className="bmi-reading">
            <p className="bmi-reading-label">Your BMI</p>
            <div className="bmi-reading-value" style={{ color: bmiColor }}>
              {animatedBmi.toFixed(1)}
            </div>
            <div
              className="bmi-reading-status"
              style={{
                color: bmiColor,
                visibility: bmiLabel ? "visible" : "hidden",
              }}
            >
              {bmiLabel || "\u00A0"}
            </div>
          </div>
        </div>

        {useMetric ? (
          <div className="bmi-row">
            <div className="bmi-field">
              <span className="bmi-label">Height (cm)</span>
              <input
                className="bmi-input"
                type="number"
                inputMode="decimal"
                value={height}
                placeholder="175"
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="bmi-field">
              <span className="bmi-label">Weight (kg)</span>
              <input
                className="bmi-input"
                type="number"
                inputMode="decimal"
                value={weight}
                placeholder="70"
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="bmi-row">
              <div className="bmi-field">
                <span className="bmi-label">Height (Feet)</span>
                <input
                  className="bmi-input"
                  type="number"
                  inputMode="numeric"
                  value={feet}
                  placeholder="5"
                  onChange={(e) => setFeet(e.target.value)}
                />
              </div>
              <div className="bmi-field">
                <span className="bmi-label">Height (Inches)</span>
                <input
                  className="bmi-input"
                  type="number"
                  inputMode="numeric"
                  value={inches}
                  placeholder="8"
                  onChange={(e) => setInches(e.target.value)}
                />
              </div>
            </div>

            <div className="bmi-row">
              <div className="bmi-field">
                <span className="bmi-label">Weight (lbs)</span>
                <input
                  className="bmi-input"
                  type="number"
                  inputMode="numeric"
                  value={weight}
                  placeholder="170"
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export const propSchema = {
  useMetric: {
    type: 'boolean',
    title: 'Use Metric Units',
    defaultValue: false,
  },
  accentColor: {
    type: 'color',
    title: 'Accent Color',
    defaultValue: '#225664',
  },
  trackColor: {
    type: 'color',
    title: 'Arc Track Color',
    defaultValue: '#e8e8e8',
  },
  defaultBmiColor: {
    type: 'color',
    title: 'Default BMI Text Color',
    defaultValue: '#1a1a1a',
  },
  inputBackground: {
    type: 'color',
    title: 'Input Background',
    defaultValue: '#ffffff',
  },
  inputBorderColor: {
    type: 'color',
    title: 'Input Border Color',
    defaultValue: '#e0e0e0',
  },
  inputFocusBorderColor: {
    type: 'color',
    title: 'Input Focus Border',
    defaultValue: '#225664',
  },
  labelColor: {
    type: 'color',
    title: 'Input Label Color',
    defaultValue: '#1a1a1a',
  },
  placeholderColor: {
    type: 'color',
    title: 'Placeholder Color',
    defaultValue: '#cccccc',
  },
  inputBorderWidth: {
    type: 'number',
    title: 'Input Border Width (px)',
    defaultValue: 1.5,
    min: 0,
    max: 4,
    step: 0.5,
  },
  inputBorderRadius: {
    type: 'number',
    title: 'Input Border Radius (px)',
    defaultValue: 10,
    min: 0,
    max: 24,
    step: 2,
  },
  bodyFont: {
    type: 'string',
    title: 'Body Font',
    defaultValue: "'Inter', -apple-system, sans-serif",
  },
  headingFont: {
    type: 'string',
    title: 'Heading Font',
    defaultValue: "'DM Sans', -apple-system, sans-serif",
  },
};

export const outputSchema = {
  bmi: {
    type: 'number',
    title: 'BMI',
    description: 'Calculated Body Mass Index',
  },
  weightKg: {
    type: 'number',
    title: 'Weight (kg)',
    description: 'Weight in kilograms',
  },
  weightLbs: {
    type: 'number',
    title: 'Weight (lbs)',
    description: 'Weight in pounds',
  },
};