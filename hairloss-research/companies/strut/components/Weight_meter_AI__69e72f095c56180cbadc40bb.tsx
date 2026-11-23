import { useState, useRef, useEffect, useCallback } from "react";

const MIN = 80;
const MAX = 500;
const TICK_GAP = 10;

export default function WeightScale({
  defaultValue = 134,
  unit = "lbs",
  accentColor = "#4a3ef5",
  headingFont = "'DM Sans', -apple-system, sans-serif",
  bodyFont = "'Inter', -apple-system, sans-serif",
  tickColor = "#d0d0d0",
  tickBigColor = "#aaa",
  labelColor = "#bbb",
  valueColor = "#1a1a1a",
  unitColor = "#999",
  indicatorWidth = 3,
  showUnitToggle = false,
  onChange,
}) {
  const [value, setValue] = useState(defaultValue);
  const [currentUnit, setCurrentUnit] = useState(unit);
  const scrollRef = useRef(null);
  const [pad, setPad] = useState(200);
  const totalTicks = MAX - MIN;
  const trackWidth = totalTicks * TICK_GAP;
  const mounted = useRef(false);

  // Compute both unit values so downstream steps always have access to both
  const weightLbs = currentUnit === 'lbs' ? value : Math.round(value * 2.20462 * 100) / 100;
  const weightKg = currentUnit === 'kg' ? value : Math.round((value / 2.20462) * 100) / 100;

  // Emit outputs whenever value or unit changes
  useEffect(() => {
    onChange?.({
      weight: value,
      unit: currentUnit,
      weightLbs,
      weightKg,
    });
  }, [value, currentUnit, weightLbs, weightKg, onChange]);

  // Measure container and set padding + initial scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const half = Math.floor(w / 2);
    setPad(half);
    requestAnimationFrame(() => {
      el.scrollLeft = (defaultValue - MIN) * TICK_GAP;
      requestAnimationFrame(() => { mounted.current = true; });
    });
  }, []);

  // Recalc padding on resize
  useEffect(() => {
    function onResize() {
      const el = scrollRef.current;
      if (!el) return;
      const w = el.clientWidth;
      setPad(Math.floor(w / 2));
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onScroll = useCallback(() => {
    if (!mounted.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const newVal = Math.round(el.scrollLeft / TICK_GAP) + MIN;
    setValue(Math.max(MIN, Math.min(MAX, newVal)));
  }, []);

  // Mouse drag to scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let isDragging = false;
    let startX = 0;
    let startScroll = 0;

    function onDown(e) {
      isDragging = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.style.cursor = 'grabbing';
      e.preventDefault();
    }
    function onMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      el.scrollLeft = startScroll - dx;
    }
    function onUp() {
      isDragging = false;
      el.style.cursor = 'grab';
    }

    el.style.cursor = 'grab';
    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const handleToggleUnit = () => {
    setCurrentUnit(currentUnit === 'lbs' ? 'kg' : 'lbs');
  };

  // Build ticks
  const ticks = [];
  for (let i = 0; i <= totalTicks; i++) {
    const lbs = MIN + i;
    const isBig = lbs % 10 === 0;
    const isMid = lbs % 5 === 0 && !isBig;
    ticks.push({ lbs, isBig, isMid });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .ws-wrap {
          max-width: 440px;
          margin: 0 auto;
          padding: 0 0 20px;
          font-family: ${bodyFont};
          box-sizing: border-box;
          width: 100%;
          text-align: center;
          position: relative;
          -webkit-user-select: none;
          user-select: none;
          background: transparent;
        }
        .ws-wrap *, .ws-wrap *::before, .ws-wrap *::after { box-sizing: border-box; }

        .ws-display {
          padding: 20px 0 16px;
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
        }
        .ws-value {
          font-family: ${headingFont};
          font-size: 64px;
          font-weight: 800;
          color: ${valueColor};
          letter-spacing: -2px;
          line-height: 1;
        }
        .ws-unit {
          font-family: ${headingFont};
          font-size: 22px;
          font-weight: 500;
          color: ${unitColor};
          vertical-align: baseline;
        }

        .ws-unit-toggle {
          margin-left: 8px;
          padding: 4px 8px;
          background: ${accentColor};
          color: white;
          border: none;
          border-radius: 4px;
          font-family: ${bodyFont};
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .ws-unit-toggle:hover {
          opacity: 0.85;
        }
        .ws-unit-toggle:active {
          opacity: 0.7;
        }

        .ws-ruler-area {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .ws-indicator {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: ${indicatorWidth}px;
          height: 52px;
          background: ${accentColor};
          border-radius: 2px;
          z-index: 2;
          pointer-events: none;
        }

        .ws-scroll {
          overflow-x: scroll;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          touch-action: pan-x;
        }
        .ws-scroll::-webkit-scrollbar { display: none; }

        .ws-track {
          position: relative;
          height: 80px;
        }

        .ws-tick {
          position: absolute;
          bottom: 28px;
          width: 1.5px;
          background: ${tickColor};
          border-radius: 1px;
        }
        .ws-tick-sm { height: 16px; }
        .ws-tick-md { height: 24px; background: ${tickBigColor}; opacity: 0.7; }
        .ws-tick-lg { height: 32px; width: 2px; background: ${tickBigColor}; }

        .ws-label {
          position: absolute;
          bottom: 4px;
          font-family: ${bodyFont};
          font-size: 11px;
          font-weight: 500;
          color: ${labelColor};
          transform: translateX(-50%);
          white-space: nowrap;
        }

        @media (min-width: 900px) {
          .ws-wrap { max-width: 580px; }
          .ws-value { font-size: 72px; }
          .ws-unit { font-size: 24px; }
          .ws-display { padding: 24px 0 20px; }
          .ws-indicator { height: 58px; width: 3.5px; }
          .ws-track { height: 90px; }
          .ws-tick-sm { height: 18px; }
          .ws-tick-md { height: 28px; }
          .ws-tick-lg { height: 36px; }
          .ws-label { font-size: 12px; bottom: 6px; }
        }

        @media (min-width: 600px) and (max-width: 899px) {
          .ws-wrap { max-width: 520px; }
          .ws-value { font-size: 68px; }
          .ws-unit { font-size: 23px; }
          .ws-display { padding: 22px 0 18px; }
          .ws-indicator { height: 55px; }
          .ws-track { height: 85px; }
          .ws-tick-sm { height: 17px; }
          .ws-tick-md { height: 26px; }
          .ws-tick-lg { height: 34px; }
          .ws-label { font-size: 11.5px; }
        }

        @media (max-width: 480px) {
          .ws-value { font-size: 60px; }
          .ws-unit { font-size: 21px; }
        }

        @media (max-width: 380px) {
          .ws-value { font-size: 52px; letter-spacing: -1.5px; }
          .ws-unit { font-size: 19px; }
          .ws-display { padding: 16px 0 12px; }
          .ws-indicator { height: 44px; width: 2.5px; }
          .ws-track { height: 72px; }
          .ws-tick { bottom: 24px; }
          .ws-tick-sm { height: 14px; }
          .ws-tick-md { height: 20px; }
          .ws-tick-lg { height: 26px; }
          .ws-label { font-size: 10px; bottom: 3px; }
        }

        @media (max-width: 340px) {
          .ws-value { font-size: 44px; letter-spacing: -1px; }
          .ws-unit { font-size: 17px; }
          .ws-display { padding: 14px 0 10px; }
          .ws-indicator { height: 38px; width: 2px; }
          .ws-track { height: 64px; }
          .ws-tick { bottom: 20px; }
          .ws-tick-sm { height: 12px; }
          .ws-tick-md { height: 17px; }
          .ws-tick-lg { height: 22px; }
          .ws-label { font-size: 9px; bottom: 2px; }
        }
      `}</style>

      <div className="ws-wrap">
        <div className="ws-display">
          <span className="ws-value">{value}</span>
          <span className="ws-unit">{currentUnit}</span>
          {showUnitToggle && (
            <button type="button" className="ws-unit-toggle" onClick={handleToggleUnit}>
              Switch to {currentUnit === 'lbs' ? 'kg' : 'lbs'}
            </button>
          )}
        </div>

        <div className="ws-ruler-area">
          <div className="ws-indicator" />

          <div className="ws-scroll" ref={scrollRef} onScroll={onScroll}>
            <div
              className="ws-track"
              style={{ width: trackWidth + pad * 2 }}
            >
              {ticks.map((t, i) => {
                const left = pad + i * TICK_GAP;
                const cls = t.isBig
                  ? "ws-tick ws-tick-lg"
                  : t.isMid
                  ? "ws-tick ws-tick-md"
                  : "ws-tick ws-tick-sm";
                return (
                  <div key={i}>
                    <div className={cls} style={{ left }} />
                    {t.isBig && (
                      <span className="ws-label" style={{ left: left + 1 }}>{t.lbs}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const propSchema = {
  defaultValue: {
    type: 'number',
    title: 'Default Weight',
    defaultValue: 134,
    min: 80,
    max: 500,
    step: 1,
  },
  unit: {
    type: 'enum',
    title: 'Unit',
    defaultValue: 'lbs',
    options: ['lbs', 'kg'],
  },
  showUnitToggle: {
    type: 'boolean',
    title: 'Show Unit Toggle Button',
    defaultValue: false,
  },
  accentColor: {
    type: 'color',
    title: 'Indicator Color',
    defaultValue: '#4a3ef5',
  },
  headingFont: {
    type: 'string',
    title: 'Heading Font',
    defaultValue: "'DM Sans', -apple-system, sans-serif",
  },
  bodyFont: {
    type: 'string',
    title: 'Body Font',
    defaultValue: "'Inter', -apple-system, sans-serif",
  },
  tickColor: {
    type: 'color',
    title: 'Tick Color',
    defaultValue: '#d0d0d0',
  },
  tickBigColor: {
    type: 'color',
    title: 'Big Tick Color',
    defaultValue: '#aaaaaa',
  },
  labelColor: {
    type: 'color',
    title: 'Label Color',
    defaultValue: '#bbbbbb',
  },
  valueColor: {
    type: 'color',
    title: 'Value Color',
    defaultValue: '#1a1a1a',
  },
  unitColor: {
    type: 'color',
    title: 'Unit Color',
    defaultValue: '#999999',
  },
  indicatorWidth: {
    type: 'number',
    title: 'Indicator Width (px)',
    defaultValue: 3,
    min: 1,
    max: 8,
    step: 0.5,
  },
};

export const outputSchema = {
  weight: {
    type: 'number',
    title: 'Weight',
    description: 'Selected weight value in the currently selected unit',
  },
  unit: {
    type: 'string',
    title: 'Unit',
    description: 'The unit currently selected (lbs or kg)',
  },
  weightLbs: {
    type: 'number',
    title: 'Weight (lbs)',
    description: 'Selected weight converted to pounds',
  },
  weightKg: {
    type: 'number',
    title: 'Weight (kg)',
    description: 'Selected weight converted to kilograms',
  },
};