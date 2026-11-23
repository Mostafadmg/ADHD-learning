import { useState, useEffect, useRef, useMemo } from "react";

export default function PersonalizedLoader({
  accentColor = "#225664",
  checkColor = "#2e7d32",
  bodyFont = "'Inter', -apple-system, sans-serif",
  headingFont = "'DM Sans', -apple-system, sans-serif",
  ringSize = 130,
  ringStroke = 8,
  ringTrackColor = "#e8e8e8",
  percentColor = "#1a1a1a",
  activeTextColor = "#1a1a1a",
  stepDoneColor = "#888",
  stepPendingColor = "#ccc",
  percentLabel = "Complete",
  step1Text = "Analyzing your responses",
  step2Text = "Matching biomarkers to your profile",
  step3Text = "Building your personalized panel",
  step4Text = "Preparing your recommendation",
  doneTitle = "Your plan is ready",
  doneSubtitle = "Personalized based on your responses",
}) {
  const steps = useMemo(
    () => [
      { text: step1Text, duration: 2800 },
      { text: step2Text, duration: 2400 },
      { text: step3Text, duration: 3000 },
      { text: step4Text, duration: 2200 },
    ],
    [step1Text, step2Text, step3Text, step4Text]
  );

  const totalDuration = useMemo(
    () => steps.reduce((s, st) => s + st.duration, 0),
    [steps]
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    let elapsed = 0;
    const timers = steps.map((step, i) => {
      elapsed += step.duration;
      return setTimeout(() => {
        if (i < steps.length - 1) {
          setCurrentStep(i + 1);
        } else {
          setDone(true);
        }
      }, elapsed);
    });

    startRef.current = performance.now();
    const tick = (now) => {
      const t = Math.min((now - startRef.current) / totalDuration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      timers.forEach(clearTimeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [steps, totalDuration]);

  const radius = (ringSize - ringStroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const percent = Math.round(progress * 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,0,0');

        .pl-wrap {
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: ${bodyFont};
          padding: 40px 20px;
          box-sizing: border-box;
          width: 100%;
        }
        .pl-wrap *, .pl-wrap *::before, .pl-wrap *::after { box-sizing: border-box; }

        /* Progress ring */
        .pl-ring-wrap {
          position: relative;
          margin-bottom: 32px;
          opacity: 0;
          animation: plFadeIn 0.5s ease 0.2s forwards;
        }
        .pl-ring-svg {
          transform: rotate(-90deg);
          display: block;
        }
        .pl-ring-bg {
          fill: none;
          stroke: ${ringTrackColor};
        }
        .pl-ring-fill {
          fill: none;
          stroke-linecap: round;
        }
        .pl-ring-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .pl-percent {
          font-family: ${headingFont};
          font-size: 28px;
          font-weight: 700;
          color: ${percentColor};
          letter-spacing: -1px;
          line-height: 1;
        }
        .pl-percent-label {
          font-size: 10px;
          color: #bbb;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 3px;
        }

        /* Current step */
        .pl-current {
          font-family: ${headingFont};
          font-size: 16px;
          font-weight: 600;
          color: ${activeTextColor};
          text-align: center;
          margin-bottom: 28px;
          min-height: 24px;
          padding: 0 12px;
          opacity: 0;
          animation: plFadeIn 0.5s ease 0.4s forwards;
        }
        .pl-current-text {
          display: inline-block;
          animation: plTextIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes plTextIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pl-dots::after {
          content: '';
          animation: plDots 1.5s steps(4, end) infinite;
        }
        @keyframes plDots {
          0% { content: ''; }
          25% { content: '.'; }
          50% { content: '..'; }
          75% { content: '...'; }
        }

        /* Completed steps */
        .pl-steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          max-width: 320px;
          opacity: 0;
          animation: plFadeIn 0.5s ease 0.6s forwards;
        }
        .pl-step {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: ${stepPendingColor};
          line-height: 1.4;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .pl-step-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .pl-step-done {
          color: ${stepDoneColor};
        }

        .pl-step-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .pl-step-icon-pending {
          background: #f0f0f0;
        }
        .pl-step-icon-check {
          background: ${checkColor};
          animation: plCheckPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes plCheckPop {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }

        .pl-check-svg {
          display: block;
        }

        .pl-spinner {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #e8e8e8;
          border-top-color: ${accentColor};
          animation: plSpin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes plSpin {
          to { transform: rotate(360deg); }
        }

        /* Done state */
        .pl-done-wrap {
          text-align: center;
          padding: 0 16px;
          opacity: 0;
          animation: plFadeIn 0.5s ease forwards;
        }
        .pl-done-icon {
          font-family: 'Material Symbols Rounded';
          font-size: 32px;
          color: ${checkColor};
          font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24;
          margin-bottom: 8px;
          animation: plCheckPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .pl-done-text {
          font-family: ${headingFont};
          font-size: 17px;
          font-weight: 600;
          color: #1a1a1a;
        }
        .pl-done-sub {
          font-size: 13px;
          color: #999;
          margin-top: 4px;
        }

        @keyframes plFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ---------- RESPONSIVE TIERS ---------- */

        /* XL: ≥1200px — spacious desktop */
        @media (min-width: 1200px) {
          .pl-wrap { padding: 56px 24px; }
          .pl-ring-wrap { margin-bottom: 40px; transform: scale(1.2); }
          .pl-percent { font-size: 34px; }
          .pl-percent-label { font-size: 11.5px; }
          .pl-current { font-size: 19px; margin-bottom: 36px; min-height: 30px; }
          .pl-steps { max-width: 420px; gap: 14px; }
          .pl-step { font-size: 15px; gap: 12px; }
          .pl-step-icon, .pl-spinner { width: 22px; height: 22px; }
          .pl-done-icon { font-size: 40px; margin-bottom: 12px; }
          .pl-done-text { font-size: 22px; }
          .pl-done-sub { font-size: 15.5px; margin-top: 6px; }
        }

        /* LG: 900–1199px */
        @media (min-width: 900px) and (max-width: 1199px) {
          .pl-wrap { padding: 48px 24px; }
          .pl-ring-wrap { margin-bottom: 36px; transform: scale(1.15); }
          .pl-percent { font-size: 32px; }
          .pl-percent-label { font-size: 11px; }
          .pl-current { font-size: 18px; margin-bottom: 32px; min-height: 28px; }
          .pl-steps { max-width: 380px; gap: 12px; }
          .pl-step { font-size: 14.5px; gap: 12px; }
          .pl-step-icon, .pl-spinner { width: 22px; height: 22px; }
          .pl-done-icon { font-size: 38px; margin-bottom: 10px; }
          .pl-done-text { font-size: 20px; }
          .pl-done-sub { font-size: 15px; margin-top: 6px; }
        }

        /* MD: 600–899px (tablet) */
        @media (min-width: 600px) and (max-width: 899px) {
          .pl-wrap { padding: 44px 22px; }
          .pl-ring-wrap { margin-bottom: 34px; transform: scale(1.08); }
          .pl-percent { font-size: 30px; }
          .pl-percent-label { font-size: 10.5px; }
          .pl-current { font-size: 17px; margin-bottom: 30px; }
          .pl-steps { max-width: 360px; gap: 11px; }
          .pl-step { font-size: 14px; gap: 12px; }
          .pl-step-icon, .pl-spinner { width: 21px; height: 21px; }
          .pl-done-icon { font-size: 36px; }
          .pl-done-text { font-size: 19px; }
          .pl-done-sub { font-size: 14px; }
        }

        /* SM (default design target): 381–599px — no rule needed, base styles apply */

        /* XS: ≤380px (small phones) */
        @media (max-width: 380px) {
          .pl-wrap { padding: 32px 16px; min-height: 60vh; }
          .pl-ring-wrap { margin-bottom: 24px; transform: scale(0.88); }
          .pl-percent { font-size: 24px; }
          .pl-percent-label { font-size: 9px; letter-spacing: 0.8px; }
          .pl-current { font-size: 14.5px; margin-bottom: 22px; min-height: 20px; }
          .pl-steps { gap: 8px; max-width: 280px; }
          .pl-step { font-size: 12.5px; gap: 8px; }
          .pl-step-icon, .pl-spinner { width: 18px; height: 18px; }
          .pl-done-icon { font-size: 28px; }
          .pl-done-text { font-size: 16px; }
          .pl-done-sub { font-size: 12.5px; }
        }

        /* XXS: ≤340px (tiny phones / Galaxy Fold cover) */
        @media (max-width: 340px) {
          .pl-wrap { padding: 24px 12px; min-height: 55vh; }
          .pl-ring-wrap { margin-bottom: 20px; transform: scale(0.78); }
          .pl-percent { font-size: 22px; }
          .pl-percent-label { font-size: 8.5px; letter-spacing: 0.6px; }
          .pl-current { font-size: 13.5px; margin-bottom: 18px; min-height: 18px; }
          .pl-steps { gap: 7px; max-width: 240px; }
          .pl-step { font-size: 11.5px; gap: 7px; }
          .pl-step-icon, .pl-spinner { width: 16px; height: 16px; }
          .pl-done-icon { font-size: 26px; }
          .pl-done-text { font-size: 15px; }
          .pl-done-sub { font-size: 12px; }
        }

        /* Short viewport (landscape phones) */
        @media (max-height: 560px) {
          .pl-wrap { min-height: auto; padding: 24px 16px; }
          .pl-ring-wrap { margin-bottom: 16px; transform: scale(0.75); }
          .pl-current { margin-bottom: 16px; }
          .pl-steps { gap: 6px; }
        }
      `}</style>

      <div className="pl-wrap">
        {!done ? (
          <>
            <div className="pl-ring-wrap">
              <svg
                className="pl-ring-svg"
                width={ringSize}
                height={ringSize}
                viewBox={`0 0 ${ringSize} ${ringSize}`}
              >
                <circle
                  className="pl-ring-bg"
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={radius}
                  strokeWidth={ringStroke}
                />
                <circle
                  className="pl-ring-fill"
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={radius}
                  strokeWidth={ringStroke}
                  stroke={accentColor}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="pl-ring-center">
                <span className="pl-percent">{percent}</span>
                <span className="pl-percent-label">{percentLabel}</span>
              </div>
            </div>

            <div className="pl-current">
              <span className="pl-current-text" key={currentStep}>
                {steps[currentStep].text}
              </span>
              <span className="pl-dots" />
            </div>

            <div className="pl-steps">
              {steps.map((step, i) => {
                const isDone = i < currentStep;
                const isCurrent = i === currentStep;
                const isVisible = i <= currentStep;

                return (
                  <div
                    key={i}
                    className={`pl-step ${isVisible ? "pl-step-visible" : ""} ${isDone ? "pl-step-done" : ""}`}
                  >
                    {isDone ? (
                      <div className="pl-step-icon pl-step-icon-check">
                        <svg className="pl-check-svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6.5L5 9L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    ) : isCurrent ? (
                      <div className="pl-spinner" />
                    ) : (
                      <div className="pl-step-icon pl-step-icon-pending" />
                    )}
                    <span>{step.text}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="pl-done-wrap">
            <div className="pl-done-icon">check_circle</div>
            <div className="pl-done-text">{doneTitle}</div>
            <div className="pl-done-sub">{doneSubtitle}</div>
          </div>
        )}
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
  checkColor: {
    type: 'color',
    title: 'Check Color',
    defaultValue: '#2e7d32',
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
  ringSize: {
    type: 'number',
    title: 'Ring Size (px)',
    defaultValue: 130,
    min: 60,
    max: 200,
    step: 10,
  },
  ringStroke: {
    type: 'number',
    title: 'Ring Stroke Width',
    defaultValue: 8,
    min: 2,
    max: 14,
    step: 1,
  },
  ringTrackColor: {
    type: 'color',
    title: 'Ring Track Color',
    defaultValue: '#e8e8e8',
  },
  percentColor: {
    type: 'color',
    title: 'Percent Text Color',
    defaultValue: '#1a1a1a',
  },
  activeTextColor: {
    type: 'color',
    title: 'Active Step Text Color',
    defaultValue: '#1a1a1a',
  },
  stepDoneColor: {
    type: 'color',
    title: 'Completed Step Text Color',
    defaultValue: '#888888',
  },
  stepPendingColor: {
    type: 'color',
    title: 'Pending Step Text Color',
    defaultValue: '#cccccc',
  },
  percentLabel: {
    type: 'string',
    title: 'Percent Label',
    defaultValue: 'Complete',
  },
  step1Text: {
    type: 'string',
    title: 'Step 1 Text',
    defaultValue: 'Analyzing your responses',
  },
  step2Text: {
    type: 'string',
    title: 'Step 2 Text',
    defaultValue: 'Matching biomarkers to your profile',
  },
  step3Text: {
    type: 'string',
    title: 'Step 3 Text',
    defaultValue: 'Building your personalized panel',
  },
  step4Text: {
    type: 'string',
    title: 'Step 4 Text',
    defaultValue: 'Preparing your recommendation',
  },
  doneTitle: {
    type: 'string',
    title: 'Done Title',
    defaultValue: 'Your plan is ready',
  },
  doneSubtitle: {
    type: 'string',
    title: 'Done Subtitle',
    defaultValue: 'Personalized based on your responses',
  },
};