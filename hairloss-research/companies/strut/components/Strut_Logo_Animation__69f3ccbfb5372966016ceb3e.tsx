import { useEffect, useState } from "react";

// Five letter paths from strut-logo-black.svg — S, t, r, u, t
const LETTERS = [
  "M265.159 321.402C265.159 315.7 263.047 311.177 258.823 307.834C254.8 304.492 247.256 300.362 236.193 295.446L215.676 286.008C196.164 276.963 186.409 263.002 186.409 244.125C186.409 229.967 191.94 218.661 203.003 210.205C214.067 201.75 229.153 197.522 248.262 197.522C265.963 197.522 283.665 200.177 301.366 205.486L284.469 248.254H283.866L260.331 207.256C258.521 204.306 256.208 202.831 253.391 202.831H249.167C242.127 202.831 236.294 204.601 231.667 208.141C227.041 211.68 224.728 216.793 224.728 223.478C224.728 229.574 226.84 234.49 231.064 238.226C235.489 241.962 242.63 245.993 252.486 250.319L271.797 258.577C282.659 263.1 290.906 268.409 296.538 274.505C302.371 280.6 305.288 288.859 305.288 299.281C305.288 314.815 299.153 326.908 286.883 335.56C274.613 344.015 258.219 348.243 237.702 348.243C218.391 348.243 199.886 345.195 182.184 339.099L198.779 293.382H199.383L223.521 339.099C224.728 341.655 226.84 342.934 229.857 342.934H236.797C245.446 342.934 252.285 340.967 257.314 337.034C262.544 333.102 265.159 327.891 265.159 321.402Z",
  "M434.913 199.882V205.781H397.801V304.295C397.801 310.98 399.209 316.191 402.025 319.927C404.841 323.467 408.763 325.236 413.792 325.236C421.436 325.236 427.269 321.599 431.292 314.323L431.896 314.618C430.085 324.057 425.559 332.02 418.318 338.509C411.278 344.998 401.12 348.243 387.844 348.243C361.694 348.243 348.619 334.773 348.619 307.834V205.781H332.025V199.882H345.602C349.826 199.882 352.944 198.8 354.956 196.637L397.197 150.33H397.801V199.882H434.913Z",
  "M578.392 207.256L561.797 253.563H561.194L537.357 225.838C535.547 223.675 533.737 223.183 531.926 224.363C528.104 227.116 523.78 232.818 518.952 241.47V321.107C518.952 324.057 520.461 326.515 523.478 328.481L553.047 345.293V345.883H451.969V345.293L466.754 331.725C468.564 330.152 469.469 327.793 469.469 324.647V222.593C469.469 219.644 468.564 217.186 466.754 215.219L451.969 200.472V199.882H518.952V237.636C521.768 226.034 526.495 216.498 533.133 209.025C539.771 201.357 548.018 197.522 557.875 197.522C566.524 197.522 573.363 200.767 578.392 207.256Z",
  "M746.071 199.882V323.467C746.071 326.81 746.976 329.267 748.786 330.841L763.873 345.293V345.883H696.588V314.323C692.766 324.745 686.832 333.004 678.786 339.099C670.74 345.195 661.286 348.243 650.424 348.243C635.539 348.243 624.174 343.032 616.329 332.61C608.484 322.189 604.562 306.949 604.562 286.893C604.562 275.685 604.763 254.153 605.165 222.298C605.165 219.349 604.26 216.989 602.45 215.219L587.665 200.472V199.882H654.346L654.045 238.816C654.045 264.771 654.045 278.536 654.045 280.109C654.045 294.463 655.553 305.376 658.571 312.848C661.588 320.321 667.019 324.057 674.864 324.057C683.111 324.057 690.352 319.632 696.588 310.784V222.593C696.588 219.644 695.683 217.186 693.872 215.219L679.088 200.472V199.882H746.071Z",
  "M882.087 199.882V205.781H844.975V304.295C844.975 310.98 846.383 316.191 849.199 319.927C852.015 323.467 855.938 325.236 860.967 325.236C868.61 325.236 874.444 321.599 878.467 314.323L879.07 314.618C877.26 324.057 872.734 332.02 865.492 338.509C858.452 344.998 848.294 348.243 835.018 348.243C808.869 348.243 795.794 334.773 795.794 307.834V205.781H792.777C797.001 199.882 800.119 198.8 802.13 196.637L844.372 150.33H844.975V199.882H882.087Z",
];

export default function StrutSplash({
  color = "#1a1a1a",
  backgroundColor = "#ffffff",
  maxWidth = 280,
  strokeWidth = 1.5,
  drawDuration = 1.8,
  fillDuration = 0.7,
  staggerDelay = 0.22,
  fadeInDuration = 0.6,
  fullScreen = true,
  zIndex = 100,
  onComplete,
}) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const drawTotal = (LETTERS.length - 1) * staggerDelay + drawDuration + fillDuration;
    const completeAt = (fadeInDuration + drawTotal) * 1000;

    const t = setTimeout(() => {
      setDone(true);
      onComplete?.();
    }, completeAt);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        @keyframes ss-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes ss-draw {
          from { stroke-dashoffset: 1; }
          to   { stroke-dashoffset: 0; }
        }

        @keyframes ss-fill {
          from { fill-opacity: 0; }
          to   { fill-opacity: 1; }
        }

        .ss-wrap {
          background: ${backgroundColor};
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          ${fullScreen
            ? `position: fixed; inset: 0; z-index: ${zIndex};`
            : `width: 100%; min-height: 360px;`
          }
        }

        .ss-inner {
          width: 100%;
          max-width: ${maxWidth + 40}px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          animation: ss-fade-in ${fadeInDuration}s ease-out forwards;
        }

        .ss-logo {
          width: 100%;
          max-width: ${maxWidth}px;
          height: auto;
          display: block;
          overflow: visible;
        }

        .ss-letter {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          fill-opacity: 0;
        }

        @media (max-width: 380px) {
          .ss-inner { padding: 0 16px; }
        }
      `}</style>

      <div className="ss-wrap" role="presentation" aria-hidden={done}>
        <div className="ss-inner">
          <svg
            className="ss-logo"
            viewBox="170 140 720 215"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {LETTERS.map((d, i) => {
              const start = fadeInDuration + i * staggerDelay;
              return (
                <path
                  key={i}
                  className="ss-letter"
                  d={d}
                  fill={color}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  pathLength="1"
                  style={{
                    animation: `ss-draw ${drawDuration}s cubic-bezier(0.65, 0, 0.35, 1) forwards, ss-fill ${fillDuration}s ease-out forwards`,
                    animationDelay: `${start}s, ${start + drawDuration * 0.7}s`,
                  }}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </>
  );
}

export const propSchema = {
  color: {
    type: 'color',
    title: 'Logo Color',
    defaultValue: '#1a1a1a',
  },
  backgroundColor: {
    type: 'color',
    title: 'Background Color',
    defaultValue: '#ffffff',
  },
  maxWidth: {
    type: 'number',
    title: 'Logo Width (px)',
    defaultValue: 280,
    min: 140,
    max: 520,
    step: 10,
  },
  strokeWidth: {
    type: 'number',
    title: 'Stroke Width (px)',
    defaultValue: 1.5,
    min: 0.5,
    max: 4,
    step: 0.5,
    description: 'Thickness of the line as letters draw in.',
  },
  drawDuration: {
    type: 'number',
    title: 'Stroke Draw Duration (seconds)',
    defaultValue: 1.8,
    min: 0.5,
    max: 4,
    step: 0.1,
    description: 'How long each letter takes to draw its outline.',
  },
  fillDuration: {
    type: 'number',
    title: 'Fill Fade-in Duration (seconds)',
    defaultValue: 0.7,
    min: 0.2,
    max: 2,
    step: 0.1,
    description: 'How long the fill takes to appear after the stroke is drawn.',
  },
  staggerDelay: {
    type: 'number',
    title: 'Stagger Between Letters (seconds)',
    defaultValue: 0.22,
    min: 0,
    max: 0.6,
    step: 0.02,
    description: '0 = all letters draw together. Larger = sequential left-to-right.',
  },
  fadeInDuration: {
    type: 'number',
    title: 'Initial Fade-in (seconds)',
    defaultValue: 0.6,
    min: 0,
    max: 1.5,
    step: 0.1,
  },
  fullScreen: {
    type: 'boolean',
    title: 'Full Screen Overlay',
    defaultValue: true,
    description: 'When ON, splash covers the entire viewport. When OFF, it renders inline within its container.',
  },
  zIndex: {
    type: 'number',
    title: 'Z-Index (full screen mode only)',
    defaultValue: 100,
    min: 1,
    max: 9999,
    step: 1,
  },
};