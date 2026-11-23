import { useEffect, useState } from "react";

export default function WarningCard({
  // ===== CONTENT =====
  showLead = true,
  leadText = "Important: Paroxetine is an SSRI antidepressant being used off-label for premature ejaculation.",

  showBody = true,
  bodyText = "SSRIs carry an FDA black-box warning for increased risk of suicidal thoughts and behavior in young adults (under 25). Report any new or worsening mood changes, anxiety, agitation, or thoughts of self-harm to your physician immediately.",

  showClosing = true,
  closingText = "Please read the above carefully before continuing.",

  // ===== CARD STYLING =====
  cardBg = "#ffffff",
  cardBorderColor = "#EFEFEC",
  cardBorderWidth = 1,
  cardBorderRadius = 14,
  cardShadow = "0 3px 16px rgba(0, 32, 33, 0.05)",
  cardMaxWidth = 480,

  // ===== POSITIONING =====
  alignment = "left",
  marginTop = 24,
  marginBottom = 32,
  outerPaddingX = 0,

  // ===== COLORS =====
  leadColor = "#1C1C21",
  bodyColor = "#1C1C21",
  closingColor = "#545454",

  // ===== TYPOGRAPHY =====
  leadFontWeight = 700,
  bodyFontWeight = 400,
  closingFontWeight = 500,
  bodyFont = "'Figtree', -apple-system, sans-serif",

  // ===== ANIMATION =====
  animationDuration = 0.55,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap');

        @keyframes wc-rise {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .wc-wrap {
          width: 100%;
          max-width: ${cardMaxWidth}px;
          margin-top: ${marginTop}px;
          margin-bottom: ${marginBottom}px;
          margin-left: ${alignment === 'right' ? 'auto' : alignment === 'center' ? 'auto' : '0'};
          margin-right: ${alignment === 'left' ? 'auto' : alignment === 'center' ? 'auto' : '0'};
          padding: ${outerPaddingX}px;
          box-sizing: border-box;
          font-family: ${bodyFont};
        }
        .wc-wrap *, .wc-wrap *::before, .wc-wrap *::after { box-sizing: border-box; }

        .wc-card {
          background: ${cardBg};
          border: ${cardBorderWidth}px solid ${cardBorderColor};
          border-radius: ${cardBorderRadius}px;
          box-shadow: ${cardShadow};
          padding: 22px 24px 20px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity ${animationDuration * 0.9}s cubic-bezier(0.25, 0.1, 0.25, 1),
                      transform ${animationDuration * 0.9}s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .wc-card.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .wc-lead {
          font-size: 14px;
          font-weight: ${leadFontWeight};
          color: ${leadColor};
          line-height: 1.5;
          margin: 0 0 12px;
          overflow-wrap: break-word;
          opacity: 0;
        }

        .wc-body {
          font-size: 13.5px;
          font-weight: ${bodyFontWeight};
          color: ${bodyColor};
          line-height: 1.6;
          margin: 0 0 14px;
          overflow-wrap: break-word;
          opacity: 0;
        }

        .wc-closing {
          font-size: 13px;
          font-weight: ${closingFontWeight};
          color: ${closingColor};
          line-height: 1.5;
          margin: 0;
          padding-top: 12px;
          border-top: 1px solid rgba(0, 32, 33, 0.08);
          overflow-wrap: break-word;
          opacity: 0;
        }

        .is-visible .wc-lead {
          animation: wc-rise ${animationDuration}s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
          animation-delay: ${animationDuration * 0.18}s;
        }
        .is-visible .wc-body {
          animation: wc-rise ${animationDuration}s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
          animation-delay: ${animationDuration * 0.36}s;
        }
        .is-visible .wc-closing {
          animation: wc-rise ${animationDuration}s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
          animation-delay: ${animationDuration * 0.54}s;
        }

        /* ===== RESPONSIVE TIERS ===== */

        /* Large desktop ≥1200px */
        @media (min-width: 1200px) {
          .wc-card { padding: 26px 28px 24px; }
          .wc-lead { font-size: 14.5px; margin-bottom: 14px; }
          .wc-body { font-size: 14px; margin-bottom: 16px; }
          .wc-closing { font-size: 13.5px; padding-top: 14px; }
        }

        /* Desktop 900-1199px */
        @media (min-width: 900px) and (max-width: 1199px) {
          .wc-card { padding: 24px 26px 22px; }
          .wc-lead { font-size: 14px; }
          .wc-body { font-size: 13.5px; }
        }

        /* Tablet 600-899px */
        @media (min-width: 600px) and (max-width: 899px) {
          .wc-card { padding: 22px 24px 20px; }
        }

        /* Large mobile / small tablet 481-599px */
        @media (min-width: 481px) and (max-width: 599px) {
          .wc-wrap { padding: ${Math.max(0, outerPaddingX - 2)}px; }
          .wc-card { padding: 20px 20px 18px; }
          .wc-lead { font-size: 13.5px; margin-bottom: 11px; }
          .wc-body { font-size: 13px; margin-bottom: 13px; line-height: 1.55; }
          .wc-closing { font-size: 12.5px; padding-top: 11px; }
        }

        /* Mobile 381-480px */
        @media (min-width: 381px) and (max-width: 480px) {
          .wc-wrap { padding: ${Math.max(0, outerPaddingX - 4)}px; }
          .wc-card { padding: 18px 18px 16px; }
          .wc-lead { font-size: 13px; margin-bottom: 10px; line-height: 1.5; }
          .wc-body { font-size: 12.5px; margin-bottom: 12px; line-height: 1.55; }
          .wc-closing { font-size: 12px; padding-top: 10px; }
        }

        /* Small mobile 341-380px */
        @media (min-width: 341px) and (max-width: 380px) {
          .wc-wrap { padding: ${Math.max(0, outerPaddingX - 6)}px; }
          .wc-card { padding: 16px 14px 14px; border-radius: ${Math.max(10, cardBorderRadius - 4)}px; }
          .wc-lead { font-size: 12.5px; margin-bottom: 9px; line-height: 1.5; }
          .wc-body { font-size: 12px; margin-bottom: 11px; line-height: 1.55; }
          .wc-closing { font-size: 11.5px; padding-top: 9px; }
        }

        /* Ultra-small ≤340px */
        @media (max-width: 340px) {
          .wc-wrap { padding: ${Math.max(0, outerPaddingX - 8)}px; }
          .wc-card { padding: 14px 12px 12px; border-radius: ${Math.max(8, cardBorderRadius - 6)}px; }
          .wc-lead { font-size: 12px; margin-bottom: 8px; line-height: 1.5; }
          .wc-body { font-size: 11.5px; margin-bottom: 10px; line-height: 1.55; }
          .wc-closing { font-size: 11px; padding-top: 8px; }
        }

        /* Short landscape phones */
        @media (max-height: 500px) and (orientation: landscape) and (max-width: 900px) {
          .wc-card { padding-top: 14px; padding-bottom: 12px; }
          .wc-lead { margin-bottom: 9px; }
          .wc-body { margin-bottom: 11px; }
        }
      `}</style>

      <div className="wc-wrap">
        <div className={`wc-card ${visible ? "is-visible" : ""}`}>
          {showLead && leadText && (
            <p className="wc-lead">{leadText}</p>
          )}

          {showBody && bodyText && (
            <p className="wc-body">{bodyText}</p>
          )}

          {showClosing && closingText && (
            <p className="wc-closing">{closingText}</p>
          )}
        </div>
      </div>
    </>
  );
}

export const propSchema = {
  // ===== CONTENT =====
  showLead: {
    type: 'boolean',
    title: 'Show Lead Text',
    defaultValue: true,
  },
  leadText: {
    type: 'string',
    title: 'Lead Text (bold)',
    defaultValue: 'Important: Paroxetine is an SSRI antidepressant being used off-label for premature ejaculation.',
  },
  showBody: {
    type: 'boolean',
    title: 'Show Body Text',
    defaultValue: true,
  },
  bodyText: {
    type: 'string',
    title: 'Body Text',
    defaultValue: 'SSRIs carry an FDA black-box warning for increased risk of suicidal thoughts and behavior in young adults (under 25). Report any new or worsening mood changes, anxiety, agitation, or thoughts of self-harm to your physician immediately.',
  },
  showClosing: {
    type: 'boolean',
    title: 'Show Closing Line',
    defaultValue: true,
  },
  closingText: {
    type: 'string',
    title: 'Closing Line',
    defaultValue: 'Please read the above carefully before continuing.',
    description: 'Sits below a hairline divider with slightly muted color.',
  },

  // ===== CARD =====
  cardBg: {
    type: 'color',
    title: 'Card Background',
    defaultValue: '#ffffff',
  },
  cardBorderColor: {
    type: 'color',
    title: 'Card Border Color',
    defaultValue: '#EFEFEC',
  },
  cardBorderWidth: {
    type: 'number',
    title: 'Card Border Width (px)',
    defaultValue: 1,
    min: 0,
    max: 4,
    step: 0.5,
  },
  cardBorderRadius: {
    type: 'number',
    title: 'Card Border Radius (px)',
    defaultValue: 14,
    min: 0,
    max: 32,
    step: 2,
  },
  cardShadow: {
    type: 'string',
    title: 'Card Shadow (CSS box-shadow)',
    defaultValue: '0 3px 16px rgba(0, 32, 33, 0.05)',
  },
  cardMaxWidth: {
    type: 'number',
    title: 'Card Max Width (px)',
    defaultValue: 480,
    min: 320,
    max: 800,
    step: 10,
  },

  // ===== POSITIONING =====
  alignment: {
    type: 'enum',
    title: 'Card Alignment',
    defaultValue: 'left',
    options: ['left', 'center', 'right'],
  },
  marginTop: {
    type: 'number',
    title: 'Margin Above Card (px)',
    defaultValue: 24,
    min: 0,
    max: 120,
    step: 4,
  },
  marginBottom: {
    type: 'number',
    title: 'Margin Below Card (px)',
    defaultValue: 32,
    min: 0,
    max: 120,
    step: 4,
  },
  outerPaddingX: {
    type: 'number',
    title: 'Outer Side Padding (px)',
    defaultValue: 0,
    min: 0,
    max: 32,
    step: 2,
  },

  // ===== COLORS =====
  leadColor: {
    type: 'color',
    title: 'Lead Text Color',
    defaultValue: '#1C1C21',
  },
  bodyColor: {
    type: 'color',
    title: 'Body Text Color',
    defaultValue: '#1C1C21',
  },
  closingColor: {
    type: 'color',
    title: 'Closing Line Color',
    defaultValue: '#545454',
  },

  // ===== TYPOGRAPHY =====
  leadFontWeight: {
    type: 'number',
    title: 'Lead Font Weight',
    defaultValue: 700,
    min: 400,
    max: 900,
    step: 100,
  },
  bodyFontWeight: {
    type: 'number',
    title: 'Body Font Weight',
    defaultValue: 400,
    min: 400,
    max: 900,
    step: 100,
  },
  closingFontWeight: {
    type: 'number',
    title: 'Closing Font Weight',
    defaultValue: 500,
    min: 400,
    max: 900,
    step: 100,
  },
  bodyFont: {
    type: 'string',
    title: 'Font Family',
    defaultValue: "'Figtree', -apple-system, sans-serif",
  },

  // ===== ANIMATION =====
  animationDuration: {
    type: 'number',
    title: 'Entrance Animation Duration (seconds)',
    defaultValue: 0.55,
    min: 0,
    max: 2,
    step: 0.05,
    description: 'Set to 0 to disable the fade-in animation entirely.',
  },
};