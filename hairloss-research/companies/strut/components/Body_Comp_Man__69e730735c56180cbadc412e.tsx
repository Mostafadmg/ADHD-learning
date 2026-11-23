import { useState, useEffect } from "react";

const IMG_URL = "https://assets.pathwai.care/organizations/69a42c4ba8473f2e87e8cab2/assets/media-1776444369835-b209456472b29760.png";

/*
  Zone tap targets positioned to match fat zones in the image.
  All values as % of container.
  top/left = top-left corner of the tap target rectangle.
*/
const zones = [
  { id: "face",   label: "Face / Neck", top: 3,   left: 38, w: 24, h: 7,   labelY: 6,   side: "left",  pulseDelay: 0    },
  { id: "arms",   label: "Arms",        top: 16,  left: 10, w: 80, h: 12,  labelY: 22,  side: "right", pulseDelay: 0.15, split: true, gapL: 28, gapR: 72 },
  { id: "chest",  label: "Chest",       top: 17,  left: 32, w: 36, h: 7,   labelY: 19,  side: "left",  pulseDelay: 0.3  },
  { id: "belly",  label: "Belly",       top: 25,  left: 30, w: 40, h: 12,  labelY: 30,  side: "right", pulseDelay: 0.45 },
  { id: "hips",   label: "Hips",        top: 35,  left: 24, w: 52, h: 7,   labelY: 38,  side: "left",  pulseDelay: 0.6  },
  { id: "glutes", label: "Glutes",      top: 41,  left: 30, w: 40, h: 6,   labelY: 43.5,side: "right", pulseDelay: 0.75 },
  { id: "thighs", label: "Thighs",      top: 48,  left: 24, w: 52, h: 16,  labelY: 56,  side: "left",  pulseDelay: 0.9, split: true, gapL: 48, gapR: 52  },
  { id: "calves", label: "Calves",      top: 68,  left: 26, w: 48, h: 14,  labelY: 75,  side: "right", pulseDelay: 1.05, split: true, gapL: 46, gapR: 54 },
];

export default function BodyVisualizer({
  accentColor = "#225664",
  glowColor = "#d4a853",
  labelActiveColor = "#1a1a1a",
  labelInactiveColor = "#c0c0c0",
  dotActiveColor = "#d4a853",
  dotInactiveColor = "#ddd",
  headingFont = "'DM Sans', -apple-system, sans-serif",
  bodyFont = "'Inter', -apple-system, sans-serif",
  bodyImage = IMG_URL,
}) {
  const [selected, setSelected] = useState(new Set());
  const [pulsed, setPulsed] = useState(false);

  // Trigger entrance pulse once
  useEffect(() => {
    const t = setTimeout(() => setPulsed(true), 2200);
    return () => clearTimeout(t);
  }, []);

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const count = selected.size;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

        .bv-wrap {
          max-width: 440px;
          margin: 0 auto;
          padding: 0 16px 32px;
          font-family: ${bodyFont};
          box-sizing: border-box;
          width: 100%;
          background: transparent;
        }
        .bv-wrap *, .bv-wrap *::before, .bv-wrap *::after { box-sizing: border-box; }

        .bv-body {
          position: relative;
          width: 100%;
          max-width: 300px;
          margin: 0 auto 16px;
        }
        .bv-img {
          width: 100%;
          height: auto;
          display: block;
          pointer-events: none;
          opacity: 0.4;
          transition: opacity 0.5s ease;
        }

        /* Tap target */
        .bv-tap {
          position: absolute;
          cursor: pointer;
          z-index: 2;
          border-radius: 8px;
        }

        /* Glow overlay */
        .bv-zone-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.35s ease;
          background: radial-gradient(ellipse, ${glowColor}35 0%, ${glowColor}18 35%, transparent 70%);
        }
        .bv-zone-glow-on {
          opacity: 1;
        }

        /* Entrance pulse */
        @keyframes bvPulse {
          0% { opacity: 0; }
          40% { opacity: 0.6; }
          100% { opacity: 0; }
        }
        .bv-zone-pulse {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          opacity: 0;
          background: radial-gradient(ellipse, ${glowColor}30 0%, ${glowColor}10 40%, transparent 70%);
          animation: bvPulse 0.8s ease-out forwards;
        }

        /* Label row */
        .bv-label-row {
          position: absolute;
          display: flex;
          align-items: center;
          z-index: 3;
          pointer-events: none;
          height: 0;
        }
        .bv-label-row-left {
          left: 0;
          flex-direction: row;
        }
        .bv-label-row-right {
          right: 0;
          flex-direction: row-reverse;
        }

        .bv-label-text {
          font-family: ${headingFont};
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
          transition: color 0.3s ease;
          pointer-events: auto;
          cursor: pointer;
          padding: 4px 0;
        }

        .bv-label-line {
          flex-shrink: 1;
          flex-grow: 1;
          height: 1px;
          min-width: 8px;
          margin: 0 6px;
          transition: background 0.3s ease, opacity 0.3s ease;
        }
        .bv-label-line-dash {
          background: repeating-linear-gradient(to right, ${dotInactiveColor} 0px, ${dotInactiveColor} 3px, transparent 3px, transparent 7px);
        }
        .bv-label-line-solid {
          background: ${dotActiveColor};
        }

        .bv-label-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }

        /* Footer */
        .bv-footer {
          text-align: center;
          min-height: 22px;
        }
        .bv-hint {
          font-size: 12.5px;
          color: #bbb;
          margin: 0;
          transition: opacity 0.3s ease;
        }
        .bv-hint-gone { opacity: 0; pointer-events: none; position: absolute; }
        .bv-counter {
          font-family: ${headingFont};
          font-size: 13px;
          font-weight: 500;
          color: ${accentColor};
          margin: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .bv-counter-show { opacity: 1; }

        /* Responsive */
        @media (min-width: 900px) {
          .bv-wrap { max-width: 580px; }
          .bv-body { max-width: 340px; }
          .bv-label-text { font-size: 10.5px; }
          .bv-label-dot { width: 6px; height: 6px; }
          .bv-counter { font-size: 14px; }
          .bv-hint { font-size: 14px; }
        }
        @media (min-width: 600px) and (max-width: 899px) {
          .bv-wrap { max-width: 520px; }
          .bv-body { max-width: 320px; }
          .bv-label-text { font-size: 10px; }
        }
        @media (max-width: 380px) {
          .bv-wrap { padding: 0 12px 28px; }
          .bv-body { max-width: 260px; }
          .bv-label-text { font-size: 8.5px; letter-spacing: 0.3px; }
          .bv-label-dot { width: 4px; height: 4px; }
          .bv-label-line { min-width: 5px; margin: 0 4px; }
          .bv-hint { font-size: 11.5px; }
          .bv-counter { font-size: 12px; }
        }
        @media (max-width: 340px) {
          .bv-body { max-width: 230px; }
          .bv-label-text { font-size: 8px; }
        }
      `}</style>

      <div className="bv-wrap">
        <div className="bv-body">
          <img className="bv-img" src={bodyImage} alt="" />

          {zones.map((z) => {
            const isOn = selected.has(z.id);
            const dotBg = isOn ? dotActiveColor : dotInactiveColor;
            const dotShadow = isOn ? `0 0 6px ${dotActiveColor}` : "none";
            const txtColor = isOn ? labelActiveColor : labelInactiveColor;

            // Glow position: centered on zone
            const glowCx = z.left + z.w / 2;
            const glowCy = z.top + z.h / 2;
            const glowW = z.w * 1.4;
            const glowH = z.h * 1.6;

            // Label connector: from edge of body to label
            const labelRowStyle = {
              top: `${z.labelY}%`,
            };
            if (z.side === "left") {
              labelRowStyle.left = 0;
              labelRowStyle.right = `${100 - z.left + 2}%`;
            } else {
              labelRowStyle.left = `${z.left + z.w + 2}%`;
              labelRowStyle.right = 0;
            }

            // For split zones, render two tap targets with a gap
            const tapTargets = [];
            if (z.split) {
              // Left half
              tapTargets.push(
                <div
                  key={z.id + "-l"}
                  className="bv-tap"
                  style={{
                    top: `${z.top}%`, left: `${z.left}%`,
                    width: `${z.gapL - z.left}%`, height: `${z.h}%`,
                  }}
                  onClick={() => toggle(z.id)}
                />
              );
              // Right half
              tapTargets.push(
                <div
                  key={z.id + "-r"}
                  className="bv-tap"
                  style={{
                    top: `${z.top}%`, left: `${z.gapR}%`,
                    width: `${z.left + z.w - z.gapR}%`, height: `${z.h}%`,
                  }}
                  onClick={() => toggle(z.id)}
                />
              );
            } else {
              tapTargets.push(
                <div
                  key={z.id}
                  className="bv-tap"
                  style={{
                    top: `${z.top}%`, left: `${z.left}%`,
                    width: `${z.w}%`, height: `${z.h}%`,
                  }}
                  onClick={() => toggle(z.id)}
                />
              );
            }

            return (
              <div key={z.id}>
                {/* Entrance pulse (plays once) */}
                {!pulsed && (
                  <div
                    className="bv-zone-pulse"
                    style={{
                      top: `${glowCy - glowH / 2}%`,
                      left: `${glowCx - glowW / 2}%`,
                      width: `${glowW}%`,
                      height: `${glowH}%`,
                      animationDelay: `${z.pulseDelay}s`,
                    }}
                  />
                )}

                {/* Active glow */}
                <div
                  className={`bv-zone-glow ${isOn ? "bv-zone-glow-on" : ""}`}
                  style={{
                    top: `${glowCy - glowH / 2}%`,
                    left: `${glowCx - glowW / 2}%`,
                    width: `${glowW}%`,
                    height: `${glowH}%`,
                  }}
                />

                {/* Tap targets */}
                {tapTargets}

                {/* Label */}
                <div
                  className={`bv-label-row bv-label-row-${z.side}`}
                  style={labelRowStyle}
                >
                  {z.side === "left" ? (
                    <>
                      <span
                        className="bv-label-text"
                        style={{ color: txtColor }}
                        onClick={() => toggle(z.id)}
                      >
                        {z.label}
                      </span>
                      <div className={`bv-label-line ${isOn ? "bv-label-line-solid" : "bv-label-line-dash"}`} />
                      <div className="bv-label-dot" style={{ background: dotBg, boxShadow: dotShadow }} />
                    </>
                  ) : (
                    <>
                      <span
                        className="bv-label-text"
                        style={{ color: txtColor }}
                        onClick={() => toggle(z.id)}
                      >
                        {z.label}
                      </span>
                      <div className={`bv-label-line ${isOn ? "bv-label-line-solid" : "bv-label-line-dash"}`} />
                      <div className="bv-label-dot" style={{ background: dotBg, boxShadow: dotShadow }} />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bv-footer">
          {count === 0 ? (
            <p className="bv-hint">Tap the areas that bother you</p>
          ) : (
            <p className={`bv-counter bv-counter-show`}>
              {count} {count === 1 ? "area" : "areas"} selected
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export const propSchema = {
  accentColor: {
    type: 'color',
    title: 'Accent Color',
    defaultValue: '#225664',
  },
  glowColor: {
    type: 'color',
    title: 'Zone Glow Color',
    defaultValue: '#d4a853',
  },
  labelActiveColor: {
    type: 'color',
    title: 'Label Active Color',
    defaultValue: '#1a1a1a',
  },
  labelInactiveColor: {
    type: 'color',
    title: 'Label Inactive Color',
    defaultValue: '#c0c0c0',
  },
  dotActiveColor: {
    type: 'color',
    title: 'Dot Active Color',
    defaultValue: '#d4a853',
  },
  dotInactiveColor: {
    type: 'color',
    title: 'Dot Inactive Color',
    defaultValue: '#dddddd',
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
  bodyImage: {
    type: 'string',
    title: 'Body Image URL',
    defaultValue: IMG_URL,
  },
};