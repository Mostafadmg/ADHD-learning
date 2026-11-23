import { useEffect, useState } from "react";

export default function HowItWorks() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Hardcoded values
  const showHeading = false;
  const heading = "Welcome to your medical intake questionnaire";
  const showIntro = true;
  const intro = "This secure form collects important health information to help our licensed medical providers evaluate your eligibility and make informed decisions about your care.";
  const showSectionLabel = true;
  const sectionLabel = "HOW IT WORKS";
  const steps = [
    "Answer the questionnaire honestly and as completely as possible.",
    "A licensed medical provider will review your responses within 1 business day.",
    "If any additional information is needed, our team will reach out via email or SMS."
  ];
  const showFooter = false;
  const footerText = "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap');

        @keyframes hiw-rise {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hiw-wrap {
          width: 100%;
          max-width: 480px;
          margin: 24px auto 12px; /* Centered horizontally */
          padding: 0px;
          box-sizing: border-box;
          font-family: 'Figtree', -apple-system, sans-serif;
        }
        .hiw-wrap *, .hiw-wrap *::before, .hiw-wrap *::after { box-sizing: border-box; }

        .hiw-card {
          background: #E8E4D8;
          border: 1px solid #D9D5C6;
          border-radius: 14px;
          box-shadow: 0 3px 16px rgba(0, 32, 33, 0.07);
          padding: 22px 24px 18px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1),
                      transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .hiw-card.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hiw-heading {
          font-family: 'Figtree', -apple-system, sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #002021;
          margin: 0 0 8px;
          line-height: 1.3;
          letter-spacing: -0.2px;
          overflow-wrap: break-word;
        }

        .hiw-intro {
          font-size: 13.5px;
          font-weight: 400;
          color: #545454;
          line-height: 1.55;
          margin: 0 0 16px;
          overflow-wrap: break-word;
        }

        .hiw-section-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Figtree', -apple-system, sans-serif;
          font-size: 10.5px;
          font-weight: 600;
          color: #71717a;
          letter-spacing: 1.4px;
          margin: 0 0 2px;
          text-transform: uppercase;
        }

        .hiw-steps {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .hiw-step {
          display: grid;
          grid-template-columns: 22px 1fr;
          gap: 14px;
          padding: 11px 0;
          border-top: 1px solid rgba(0, 32, 33, 0.10);
          align-items: start;
          opacity: 0;
        }
        .hiw-step:first-child { border-top: none; padding-top: 4px; }
        .is-visible .hiw-step {
          animation: hiw-rise 0.55s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
        }
        .is-visible .hiw-step-1 { animation-delay: 0.15s; }
        .is-visible .hiw-step-2 { animation-delay: 0.28s; }
        .is-visible .hiw-step-3 { animation-delay: 0.41s; }

        .hiw-number {
          font-family: 'Figtree', -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #71717a;
          line-height: 1.5;
          font-variant-numeric: tabular-nums;
        }

        .hiw-step-body {
          font-size: 13.5px;
          font-weight: 400;
          color: #1C1C21;
          line-height: 1.55;
          margin: 0;
          min-width: 0;
          overflow-wrap: break-word;
        }

        .hiw-footer {
          margin: 18px 0 0;
          padding-top: 16px;
          border-top: 1px solid rgba(0, 32, 33, 0.10);
          font-size: 13px;
          color: #71717a;
          line-height: 1.55;
        }

        @media (min-width: 1200px) {
          .hiw-card { padding: 26px 28px 22px; }
          .hiw-heading { font-size: 18px; }
          .hiw-intro { font-size: 14px; margin-bottom: 18px; }
          .hiw-step { grid-template-columns: 24px 1fr; padding: 12px 0; gap: 16px; }
          .hiw-number { font-size: 14.5px; }
          .hiw-step-body { font-size: 14px; }
        }

        @media (max-width: 599px) {
          .hiw-card { padding: 20px 20px 16px; }
          .hiw-heading { font-size: 16.5px; }
          .hiw-intro { font-size: 13px; margin-bottom: 14px; }
          .hiw-step { gap: 12px; padding: 10px 0; }
          .hiw-number { font-size: 13.5px; }
          .hiw-step-body { font-size: 13px; }
        }

        @media (max-width: 480px) {
          .hiw-card { padding: 18px 18px 14px; }
          .hiw-heading { font-size: 16px; }
          .hiw-intro { font-size: 12.5px; margin-bottom: 13px; }
          .hiw-step { grid-template-columns: 20px 1fr; gap: 11px; padding: 9px 0; }
          .hiw-step-body { font-size: 12.5px; }
        }

        @media (max-width: 380px) {
          .hiw-card { padding: 16px 14px 12px; border-radius: 10px; }
          .hiw-heading { font-size: 15px; }
          .hiw-intro { font-size: 12px; }
          .hiw-step { grid-template-columns: 18px 1fr; gap: 10px; padding: 8px 0; }
          .hiw-step-body { font-size: 12px; }
        }
      `}</style>

      <div className="hiw-wrap">
        <div className={`hiw-card ${visible ? "is-visible" : ""}`}>
          {showHeading && heading && (
            <h2 className="hiw-heading">{heading}</h2>
          )}

          {showIntro && intro && (
            <p className="hiw-intro">{intro}</p>
          )}

          {showSectionLabel && sectionLabel && (
            <div className="hiw-section-label">{sectionLabel}</div>
          )}

          <ol className="hiw-steps">
            {steps.map((body, i) => (
              <li key={i} className={`hiw-step hiw-step-${i + 1}`}>
                <span className="hiw-number">{i + 1}</span>
                <p className="hiw-step-body">{body}</p>
              </li>
            ))}
          </ol>

          {showFooter && footerText && (
            <p className="hiw-footer">{footerText}</p>
          )}
        </div>
      </div>
    </>
  );
}