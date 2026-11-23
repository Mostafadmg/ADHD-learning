import React, { useState, useEffect, useRef } from 'react';

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const formatDate = (date, format) => {
  const mm = MONTHS_SHORT[date.getMonth()];
  const mmmm = MONTHS_LONG[date.getMonth()];
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  switch (format) {
    case 'DD MMM YYYY':      return `${dd} ${mm} ${yyyy}`;
    case 'MMMM DD, YYYY':    return `${mmmm} ${dd}, ${yyyy}`;
    case 'DD MMMM YYYY':     return `${dd} ${mmmm} ${yyyy}`;
    case 'MMM DD':           return `${mm} ${dd}`;
    case 'MMM DD, YYYY':
    default:                 return `${mm} ${dd}, ${yyyy}`;
  }
};

// Accept any input and extract a number. "190" → 190, "190.5 lbs" → 190.5, "" → fallback
const toNum = (val, fallback = 0) => {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

export default function WeightProjectionDark({
  // ---- Core data (now accept strings or numbers) ----
  startWeight = "190",
  goalWeight = "150",
  unit = "lbs",

  // ---- Goal date ----
  weeklyLossRate = 1.5,
  dateFormat = "MMM DD, YYYY",
  goalDateOverride = "",

  // ---- Curve ----
  curveColor = "#000000",
  curveWidth = 3,
  curveGlow = "off",

  // ---- Fill under curve ----
  fillColor = "#000000",
  fillOpacity = 0.08,

  // ---- Endpoint dots ----
  dotFill = "#ffffff",
  dotStroke = "#000000",
  dotStrokeWidth = 2,
  dotRadius = 6,

  // ---- Weight pills ----
  showStartPill = "on",
  showGoalPill = "on",
  weightPillBg = "#000000",
  weightPillTextColor = "#ffffff",
  weightPillFontSize = 13,

  // ---- Delta ----
  showDelta = "on",
  deltaColor = "#22c55e",
  deltaFontSize = 12,

  // ---- Connector ----
  connectorColor = "#cccccc",
  connectorWidth = 1,

  // ---- Date pill ----
  showDatePill = "on",
  datePillBg = "#ffffff",
  datePillTextColor = "#1a1a1a",
  datePillFontSize = 13,
  datePillBorderColor = "#e5e5e5",

  // ---- X-axis labels ----
  startLabel = "Today",
  endLabel = "Goal",
  axisLabelColor = "#6b6b6b",
  axisLabelFontSize = 14,

  // ---- Description ----
  description = "Now let's analyze your metabolism and discover if GLP-1 medications are the right solution for you.",
  descriptionColor = "#1a1a1a",
  descriptionFontSize = 17,
  descriptionFontWeight = "400",
  descriptionAlignment = "center",

  // ---- Container ----
  backgroundColor = "#ffffff",
  borderRadius = 0,
}) {
  const pathRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [goalPoint, setGoalPoint] = useState({ x: 390, y: 198 });

  // Safely coerce numeric props that may arrive as strings
  const startW = toNum(startWeight, 190);
  const goalW = toNum(goalWeight, 150);
  const rate = toNum(weeklyLossRate, 1.5);

  // Display strings (what appears in the pills) — use the raw prop if it's a string, else the parsed number
  const startWeightDisplay = typeof startWeight === 'string' && startWeight.trim() !== '' && isNaN(Number(startWeight))
    ? startWeight
    : String(startW);
  const goalWeightDisplay = typeof goalWeight === 'string' && goalWeight.trim() !== '' && isNaN(Number(goalWeight))
    ? goalWeight
    : String(goalW);

  const on = (v) => v === true || v === "on";
  const curveGlowOn = on(curveGlow);
  const showStartPillOn = on(showStartPill);
  const showGoalPillOn = on(showGoalPill);
  const showDeltaOn = on(showDelta);
  const showDatePillOn = on(showDatePill);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      const pt = pathRef.current.getPointAtLength(len);
      setGoalPoint({ x: pt.x, y: pt.y });
    }
  }, []);

  // Auto-compute delta using safely parsed numbers
  const diff = startW - goalW;
  let deltaText = "";
  if (diff > 0) deltaText = `↓${diff} ${unit}`;
  else if (diff < 0) deltaText = `↑${Math.abs(diff)} ${unit}`;
  else deltaText = `0 ${unit}`;

  const safeRate = rate > 0 ? rate : 1.5;
  const weeksToGoal = Math.abs(diff) / safeRate;
  const goalDateObj = new Date(Date.now() + weeksToGoal * 7 * 24 * 60 * 60 * 1000);
  const computedGoalDate = formatDate(goalDateObj, dateFormat);
  const displayDate = goalDateOverride && goalDateOverride.trim()
    ? goalDateOverride
    : computedGoalDate;

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const curvePath = "M 40 30 C 220 30, 180 195, 390 198";
  const fillPath = `${curvePath} L 390 215 L 40 215 Z`;

  const pillToDotGap = 4;

  // --- Start pill --- (uses display string for width calc)
  const startPoint = { x: 40, y: 30 };
  const startPillLabel = `${startWeightDisplay} ${unit}`;
  const startPillW = Math.max(60, startPillLabel.length * 6.5 + 18);
  const startPillH = 22;
  const startPillCenterX = Math.max(startPoint.x + 10, startPillW / 2 + 6);
  const startPillY = (startPoint.y - dotRadius) - pillToDotGap - startPillH;
  const startPillX = startPillCenterX - startPillW / 2;

  // --- Goal pill ---
  const goalPillLabel = `${goalWeightDisplay} ${unit}`;
  const goalPillW = Math.max(60, goalPillLabel.length * 6.5 + 18);
  const goalPillH = 22;
  const goalPillCenterX = Math.min(goalPoint.x, 430 - goalPillW / 2 - 8);
  const goalPillY = (goalPoint.y - dotRadius) - pillToDotGap - goalPillH;
  const goalPillX = goalPillCenterX - goalPillW / 2;

  const deltaX = goalPoint.x;
  const deltaY = goalPillY - 8;
  const deltaGapR = 9;

  const datePillPadding = 14;
  const datePillW = Math.max(80, displayDate.length * 6.5 + datePillPadding * 2);
  const datePillH = 22;
  const datePillCenterX = Math.min(goalPoint.x, 430 - datePillW / 2 - 8);
  const datePillX = datePillCenterX - datePillW / 2;
  const datePillY = 4;

  const connectorX = goalPoint.x;
  const connectorTopY = datePillY + datePillH;
  const connectorBottomY = goalPoint.y - dotRadius - 1;

  const connectorDotSpacing = 6;
  const connectorDotRadius = 1.3;
  const connectorDots = [];

  {
    const topStart = connectorTopY + 2;
    const topEnd = showDeltaOn && showGoalPillOn ? deltaY - deltaGapR : connectorBottomY;
    for (let y = topStart; y < topEnd; y += connectorDotSpacing) {
      connectorDots.push(y);
    }
  }

  if (showDeltaOn && showGoalPillOn) {
    const bottomStart = deltaY + deltaGapR;
    for (let y = bottomStart; y < connectorBottomY; y += connectorDotSpacing) {
      connectorDots.push(y);
    }
  }

  connectorDots.sort((a, b) => b - a);

  const connectorStartDelay = 2.9;
  const connectorDotStagger = 0.06;
  const datePillDelay =
    connectorStartDelay + connectorDots.length * connectorDotStagger + 0.25;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        .wpd-root {
          width: 100%;
          max-width: 680px;
          margin: 0 auto;
          padding: 40px 28px 36px;
          box-sizing: border-box;
          background: ${backgroundColor};
          border-radius: ${borderRadius}px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          --wpd-desc-size: ${descriptionFontSize}px;
        }

        .wpd-chart-wrap {
          width: 100%;
          margin: 0;
          position: relative;
        }

        .wpd-svg {
          width: 100%;
          height: auto;
          display: block;
          overflow: visible;
        }

        .wpd-curve {
          fill: none;
          stroke: ${curveColor};
          stroke-width: ${curveWidth};
          stroke-linecap: round;
          stroke-dasharray: 900;
          stroke-dashoffset: 900;
          transition: stroke-dashoffset 2.8s cubic-bezier(0.45, 0, 0.2, 1) 0.4s;
          ${curveGlowOn ? `filter: drop-shadow(0 0 6px ${hexToRgba(curveColor, 0.55)});` : ''}
        }

        .wpd-fill {
          opacity: 0;
          transition: opacity 1.8s cubic-bezier(0.25, 0.1, 0.25, 1) 1.4s;
        }

        .wpd-axis-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: ${axisLabelFontSize}px;
          font-weight: 400;
          fill: ${axisLabelColor};
          opacity: 0;
          transition: opacity 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) 2s;
        }

        .wpd-dot {
          fill: ${dotFill};
          stroke: ${dotStroke};
          stroke-width: ${dotStrokeWidth};
        }

        .wpd-start-group,
        .wpd-goal-group {
          opacity: 0;
        }
        .wpd-start-group {
          transition: opacity 1s cubic-bezier(0.25, 0.1, 0.25, 1) 1s;
        }
        .wpd-goal-group {
          transition: opacity 1s cubic-bezier(0.25, 0.1, 0.25, 1) 2.4s;
        }

        .wpd-connector-dot {
          fill: ${connectorColor};
          opacity: 0;
          animation-name: wpd-connector-dot-fade;
          animation-duration: 0.5s;
          animation-timing-function: ease-in-out;
          animation-fill-mode: forwards;
          animation-play-state: paused;
        }
        .wpd-visible .wpd-connector-dot {
          animation-play-state: running;
        }
        @keyframes wpd-connector-dot-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .wpd-date-group {
          opacity: 0;
          transform: translateY(-4px);
          transform-box: fill-box;
          transition: opacity 0.8s cubic-bezier(0.25, 0.1, 0.25, 1),
                      transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .wpd-visible .wpd-date-group { opacity: 1; transform: translateY(0); }

        .wpd-weight-pill-rect {
          fill: ${weightPillBg};
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.12));
        }
        .wpd-weight-pill-text {
          fill: ${weightPillTextColor};
          font-family: 'DM Sans', sans-serif;
          font-size: ${weightPillFontSize}px;
          font-weight: 600;
        }

        .wpd-delta-text {
          fill: ${deltaColor};
          font-family: 'DM Sans', sans-serif;
          font-size: ${deltaFontSize}px;
          font-weight: 600;
        }

        .wpd-date-pill-rect {
          fill: ${datePillBg};
          stroke: ${datePillBorderColor};
          stroke-width: 1;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.08));
        }
        .wpd-date-pill-text {
          fill: ${datePillTextColor};
          font-family: 'DM Sans', sans-serif;
          font-size: ${datePillFontSize}px;
          font-weight: 600;
        }

        .wpd-visible .wpd-curve { stroke-dashoffset: 0; }
        .wpd-visible .wpd-fill { opacity: 1; }
        .wpd-visible .wpd-axis-label { opacity: 1; }
        .wpd-visible .wpd-start-group { opacity: 1; }
        .wpd-visible .wpd-goal-group { opacity: 1; }

        .wpd-description {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: var(--wpd-desc-size);
          font-weight: ${descriptionFontWeight};
          line-height: 1.5;
          color: ${descriptionColor};
          text-align: ${descriptionAlignment};
          margin: 28px 8px 0;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 1.3s cubic-bezier(0.25, 0.1, 0.25, 1) ${datePillDelay + 0.7}s,
                      transform 1.3s cubic-bezier(0.25, 0.1, 0.25, 1) ${datePillDelay + 0.7}s;
        }
        .wpd-visible .wpd-description { opacity: 1; transform: translateY(0); }

        @media (min-width: 900px) {
          .wpd-root {
            padding: 52px 40px 44px;
            --wpd-desc-size: calc(${descriptionFontSize}px * 1.1);
          }
          .wpd-description { margin-top: 36px; }
        }

        @media (min-width: 600px) and (max-width: 899px) {
          .wpd-root {
            padding: 44px 32px 40px;
            --wpd-desc-size: calc(${descriptionFontSize}px * 1.05);
          }
          .wpd-description { margin-top: 32px; }
        }

        @media (max-width: 380px) {
          .wpd-root {
            padding: 28px 18px 24px;
            --wpd-desc-size: calc(${descriptionFontSize}px * 0.9);
          }
          .wpd-description { margin-top: 22px; }
        }

        @media (max-width: 340px) {
          .wpd-root {
            padding: 22px 14px 20px;
            --wpd-desc-size: calc(${descriptionFontSize}px * 0.82);
          }
          .wpd-description { margin-top: 18px; }
        }
      `}</style>

      <div className={`wpd-root ${visible ? 'wpd-visible' : ''}`}>
        <div className="wpd-chart-wrap">
          <svg
            className="wpd-svg"
            viewBox="0 0 430 240"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="wpdFillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={hexToRgba(fillColor, fillOpacity)} />
                <stop offset="100%" stopColor={hexToRgba(fillColor, 0)} />
              </linearGradient>
            </defs>

            <path className="wpd-fill" d={fillPath} fill="url(#wpdFillGrad)" />
            <path ref={pathRef} className="wpd-curve" d={curvePath} />

            <text className="wpd-axis-label" x={40} y={233} textAnchor="start">
              {startLabel}
            </text>
            <text className="wpd-axis-label" x={390} y={233} textAnchor="end">
              {endLabel}
            </text>

            <g className="wpd-start-group">
              {showStartPillOn && (
                <>
                  <rect
                    className="wpd-weight-pill-rect"
                    x={startPillX}
                    y={startPillY}
                    width={startPillW}
                    height={startPillH}
                    rx={startPillH / 2}
                    ry={startPillH / 2}
                  />
                  <text
                    className="wpd-weight-pill-text"
                    x={startPillX + startPillW / 2}
                    y={startPillY + startPillH / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {startPillLabel}
                  </text>
                </>
              )}
              <circle
                className="wpd-dot"
                cx={startPoint.x}
                cy={startPoint.y}
                r={dotRadius}
              />
            </g>

            {showDatePillOn && connectorDots.map((y, i) => (
              <circle
                key={`wpd-connector-${i}`}
                className="wpd-connector-dot"
                cx={connectorX}
                cy={y}
                r={connectorDotRadius}
                style={{ animationDelay: `${connectorStartDelay + i * connectorDotStagger}s` }}
              />
            ))}

            <g className="wpd-goal-group">
              {showDeltaOn && showGoalPillOn && (
                <text
                  className="wpd-delta-text"
                  x={deltaX}
                  y={deltaY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {deltaText}
                </text>
              )}

              {showGoalPillOn && (
                <>
                  <rect
                    className="wpd-weight-pill-rect"
                    x={goalPillX}
                    y={goalPillY}
                    width={goalPillW}
                    height={goalPillH}
                    rx={goalPillH / 2}
                    ry={goalPillH / 2}
                  />
                  <text
                    className="wpd-weight-pill-text"
                    x={goalPillX + goalPillW / 2}
                    y={goalPillY + goalPillH / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {goalPillLabel}
                  </text>
                </>
              )}

              <circle
                className="wpd-dot"
                cx={goalPoint.x}
                cy={goalPoint.y}
                r={dotRadius}
              />
            </g>

            {showDatePillOn && (
              <g className="wpd-date-group" style={{ transitionDelay: `${datePillDelay}s` }}>
                <rect
                  className="wpd-date-pill-rect"
                  x={datePillX}
                  y={datePillY}
                  width={datePillW}
                  height={datePillH}
                  rx={datePillH / 2}
                  ry={datePillH / 2}
                />
                <text
                  className="wpd-date-pill-text"
                  x={datePillX + datePillW / 2}
                  y={datePillY + datePillH / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {displayDate}
                </text>
              </g>
            )}
          </svg>
        </div>

        <p className="wpd-description">{description}</p>
      </div>
    </>
  );
}

export const propSchema = {
  // ---- Core data — now accepts any text (parsed safely for math) ----
  startWeight: { type: 'string', title: 'Starting Weight', defaultValue: '190' },
  goalWeight: { type: 'string', title: 'Goal Weight', defaultValue: '150' },
  unit: {
    type: 'enum',
    title: 'Weight Unit',
    defaultValue: 'lbs',
    options: ['lbs', 'kg'],
  },
  goalDateOverride: {
    type: 'string',
    title: 'Goal Date Override (leave empty to auto-compute)',
    defaultValue: '',
  },
  weeklyLossRate: {
    type: 'number',
    title: 'Weekly Loss Rate (weight units / week)',
    defaultValue: 1.5,
    min: 0.1,
    max: 5,
    step: 0.1,
  },
  dateFormat: {
    type: 'enum',
    title: 'Date Format',
    defaultValue: 'MMM DD, YYYY',
    options: ['MMM DD, YYYY', 'DD MMM YYYY', 'MMMM DD, YYYY', 'DD MMMM YYYY', 'MMM DD'],
  },

  curveColor: { type: 'color', title: 'Curve Color', defaultValue: '#000000' },
  curveWidth: { type: 'number', title: 'Curve Width', defaultValue: 3, min: 1, max: 6, step: 0.5 },
  curveGlow: {
    type: 'enum',
    title: 'Curve Glow',
    defaultValue: 'off',
    options: ['on', 'off'],
  },

  fillColor: { type: 'color', title: 'Fill Color', defaultValue: '#000000' },
  fillOpacity: { type: 'number', title: 'Fill Opacity', defaultValue: 0.08, min: 0, max: 1, step: 0.02 },

  dotFill: { type: 'color', title: 'Dot Fill', defaultValue: '#ffffff' },
  dotStroke: { type: 'color', title: 'Dot Stroke', defaultValue: '#000000' },
  dotStrokeWidth: { type: 'number', title: 'Dot Stroke Width', defaultValue: 2, min: 0, max: 5, step: 0.5 },
  dotRadius: { type: 'number', title: 'Dot Radius', defaultValue: 6, min: 3, max: 14, step: 0.5 },

  showStartPill: {
    type: 'enum',
    title: 'Show Start Pill',
    defaultValue: 'on',
    options: ['on', 'off'],
  },
  showGoalPill: {
    type: 'enum',
    title: 'Show Goal Pill',
    defaultValue: 'on',
    options: ['on', 'off'],
  },
  weightPillBg: { type: 'color', title: 'Weight Pill Background', defaultValue: '#000000' },
  weightPillTextColor: { type: 'color', title: 'Weight Pill Text Color', defaultValue: '#ffffff' },
  weightPillFontSize: { type: 'number', title: 'Weight Pill Font Size', defaultValue: 13, min: 8, max: 20, step: 1 },

  showDelta: {
    type: 'enum',
    title: 'Show Delta',
    defaultValue: 'on',
    options: ['on', 'off'],
  },
  deltaColor: { type: 'color', title: 'Delta Color', defaultValue: '#22c55e' },
  deltaFontSize: { type: 'number', title: 'Delta Font Size', defaultValue: 12, min: 8, max: 20, step: 1 },

  connectorColor: { type: 'color', title: 'Connector Line Color', defaultValue: '#cccccc' },
  connectorWidth: { type: 'number', title: 'Connector Line Width', defaultValue: 1, min: 0.5, max: 3, step: 0.5 },

  showDatePill: {
    type: 'enum',
    title: 'Show Date Pill',
    defaultValue: 'on',
    options: ['on', 'off'],
  },
  datePillBg: { type: 'color', title: 'Date Pill Background', defaultValue: '#ffffff' },
  datePillTextColor: { type: 'color', title: 'Date Pill Text Color', defaultValue: '#1a1a1a' },
  datePillFontSize: { type: 'number', title: 'Date Pill Font Size', defaultValue: 13, min: 8, max: 20, step: 1 },
  datePillBorderColor: { type: 'color', title: 'Date Pill Border Color', defaultValue: '#e5e5e5' },

  startLabel: { type: 'string', title: 'Start Axis Label', defaultValue: 'Today' },
  endLabel: { type: 'string', title: 'End Axis Label', defaultValue: 'Goal' },
  axisLabelColor: { type: 'color', title: 'Axis Label Color', defaultValue: '#6b6b6b' },
  axisLabelFontSize: { type: 'number', title: 'Axis Label Font Size', defaultValue: 14, min: 9, max: 22, step: 1 },

  description: {
    type: 'string',
    title: 'Description',
    defaultValue: "Now let's analyze your metabolism and discover if GLP-1 medications are the right solution for you.",
  },
  descriptionColor: { type: 'color', title: 'Description Color', defaultValue: '#1a1a1a' },
  descriptionFontSize: { type: 'number', title: 'Description Font Size', defaultValue: 17, min: 10, max: 26, step: 1 },
  descriptionFontWeight: {
    type: 'enum',
    title: 'Description Font Weight',
    defaultValue: '400',
    options: ['400', '500', '600', '700'],
  },
  descriptionAlignment: {
    type: 'enum',
    title: 'Description Alignment',
    defaultValue: 'center',
    options: ['left', 'center', 'right'],
  },

  backgroundColor: { type: 'color', title: 'Background Color', defaultValue: '#ffffff' },
  borderRadius: { type: 'number', title: 'Container Border Radius', defaultValue: 0, min: 0, max: 40, step: 1 },
};