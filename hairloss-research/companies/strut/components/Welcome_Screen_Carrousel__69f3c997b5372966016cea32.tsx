import { useState, useEffect } from "react";

export default function HeroCard({
  image = "https://assets.pathwai.care/organizations/69a42c4ba8473f2e87e8cab2/assets/media-1776468143960-d082e961fc284e46.jpg",
  image2 = "https://assets.pathwai.care/organizations/69a42c4ba8473f2e87e8cab2/assets/media-1776468149822-2e26abc2bf7ef04b.jpg",
  imageDuration = 5,
  headline = "Start your GLP\u20111 Consultation now",
  subtitle = "Reviewed by UK licensed clinicians.",
  body = "Complete a brief medical intake that will be securely reviewed by a licensed provider, no phone or video visit required.",
  badge = "No contracts | 100% Money back | Ships in 3 days",
  headlineColor = "#ffffff",
  subtitleColor = "rgba(255,255,255,0.75)",
  bodyColor = "rgba(255,255,255,0.7)",
  badgeColor = "#A78BFA",
  gradientStart = "rgba(0,0,0,0)",
  gradientEnd = "rgba(0,0,0,0.7)",
  cardBorderRadius = 16,
  headingFont = "'Figtree', -apple-system, sans-serif",
  bodyFont = "'Plus Jakarta Sans', -apple-system, sans-serif",
}) {
  const images = [image, image2].filter(Boolean);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }, imageDuration * 1000);
    return () => clearInterval(interval);
  }, [images.length, imageDuration]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        .hc-wrap {
          max-width: 356px;
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
          width: 100%;
        }
        .hc-wrap *, .hc-wrap *::before, .hc-wrap *::after { box-sizing: border-box; }

        .hc-card {
          position: relative;
          width: 100%;
          border-radius: ${cardBorderRadius}px;
          overflow: hidden;
          aspect-ratio: 356 / 520;
        }
        .hc-img-stack {
          position: absolute;
          inset: 0;
        }
        .hc-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          opacity: 0;
          transition: opacity 1s ease;
        }
        .hc-img-active {
          opacity: 1;
        }

        .hc-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px 18px;
          background: linear-gradient(to bottom, ${gradientStart} 35%, ${gradientEnd} 100%);
        }

        .hc-headline {
          font-family: ${headingFont};
          font-size: 26px;
          font-weight: 700;
          color: ${headlineColor};
          margin: 0 0 4px;
          line-height: 1.12;
          letter-spacing: -0.3px;
          white-space: pre-line;
          overflow-wrap: normal;
          word-break: keep-all;
        }
        .hc-subtitle {
          font-family: ${bodyFont};
          font-size: 12.5px;
          font-weight: 500;
          color: ${subtitleColor};
          margin: 0 0 10px;
          line-height: 1.4;
        }
        .hc-body {
          font-family: ${bodyFont};
          font-size: 12.5px;
          font-weight: 400;
          color: ${bodyColor};
          margin: 0 0 12px;
          line-height: 1.5;
        }
        .hc-badge {
          font-family: ${bodyFont};
          font-size: 11px;
          font-weight: 600;
          color: ${badgeColor};
          margin: 0;
          letter-spacing: 0.2px;
        }

        /* Responsive */
        @media (min-width: 900px) {
          .hc-wrap { max-width: 400px; }
          .hc-overlay { padding: 24px 22px; }
          .hc-headline { font-size: 30px; margin-bottom: 5px; }
          .hc-subtitle { font-size: 13.5px; }
          .hc-body { font-size: 13.5px; }
          .hc-badge { font-size: 12px; }
        }

        @media (min-width: 600px) and (max-width: 899px) {
          .hc-wrap { max-width: 380px; }
          .hc-overlay { padding: 22px 20px; }
          .hc-headline { font-size: 28px; }
          .hc-subtitle { font-size: 13px; }
          .hc-body { font-size: 13px; }
        }

        @media (max-width: 380px) {
          .hc-wrap { padding: 0 12px; }
          .hc-overlay { padding: 16px 14px; }
          .hc-headline { font-size: 22px; }
          .hc-subtitle { font-size: 11.5px; margin-bottom: 8px; }
          .hc-body { font-size: 11.5px; margin-bottom: 10px; }
          .hc-badge { font-size: 10px; }
        }

        @media (max-width: 340px) {
          .hc-overlay { padding: 14px 12px; }
          .hc-headline { font-size: 20px; }
          .hc-subtitle { font-size: 11px; }
          .hc-body { font-size: 11px; }
          .hc-badge { font-size: 9.5px; }
        }
      `}</style>

      <div className="hc-wrap">
        <div className="hc-card">
          <div className="hc-img-stack">
            {images.map((src, i) => (
              <img
                key={i}
                className={`hc-img ${i === activeIdx ? "hc-img-active" : ""}`}
                src={src}
                alt=""
              />
            ))}
          </div>
          <div className="hc-overlay">
            <h2 className="hc-headline">{headline}</h2>
            {subtitle && <p className="hc-subtitle">{subtitle}</p>}
            {body && <p className="hc-body">{body}</p>}
            {badge && <p className="hc-badge">{badge}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export const propSchema = {
  image: {
    type: 'string',
    title: 'Image 1 URL',
    defaultValue: 'https://assets.pathwai.care/organizations/69a42c4ba8473f2e87e8cab2/assets/media-1776468143960-d082e961fc284e46.jpg',
  },
  image2: {
    type: 'string',
    title: 'Image 2 URL (leave empty for single image)',
    defaultValue: 'https://assets.pathwai.care/organizations/69a42c4ba8473f2e87e8cab2/assets/media-1776468149822-2e26abc2bf7ef04b.jpg',
  },
  imageDuration: {
    type: 'number',
    title: 'Image Cycle Duration (seconds)',
    defaultValue: 5,
    min: 2,
    max: 15,
    step: 1,
  },
  headline: {
    type: 'string',
    title: 'Headline',
    defaultValue: 'Start your GLP\u20111 Consultation now',
  },
  subtitle: {
    type: 'string',
    title: 'Subtitle',
    defaultValue: 'Reviewed by UK licensed clinicians.',
  },
  body: {
    type: 'string',
    title: 'Body Text',
    defaultValue: 'Complete a brief medical intake that will be securely reviewed by a licensed provider, no phone or video visit required.',
  },
  badge: {
    type: 'string',
    title: 'Badge Text',
    defaultValue: 'No contracts | 100% Money back | Ships in 3 days',
  },
  headlineColor: {
    type: 'color',
    title: 'Headline Color',
    defaultValue: '#ffffff',
  },
  subtitleColor: {
    type: 'string',
    title: 'Subtitle Color (rgba)',
    defaultValue: 'rgba(255,255,255,0.75)',
  },
  bodyColor: {
    type: 'string',
    title: 'Body Color (rgba)',
    defaultValue: 'rgba(255,255,255,0.7)',
  },
  badgeColor: {
    type: 'color',
    title: 'Badge Color',
    defaultValue: '#A78BFA',
  },
  gradientStart: {
    type: 'string',
    title: 'Gradient Top (rgba)',
    defaultValue: 'rgba(0,0,0,0)',
  },
  gradientEnd: {
    type: 'string',
    title: 'Gradient Bottom (rgba)',
    defaultValue: 'rgba(0,0,0,0.7)',
  },
  cardBorderRadius: {
    type: 'number',
    title: 'Card Border Radius (px)',
    defaultValue: 16,
    min: 0,
    max: 32,
    step: 2,
  },
  headingFont: {
    type: 'string',
    title: 'Heading Font',
    defaultValue: "'Figtree', -apple-system, sans-serif",
  },
  bodyFont: {
    type: 'string',
    title: 'Body Font',
    defaultValue: "'Plus Jakarta Sans', -apple-system, sans-serif",
  },
};