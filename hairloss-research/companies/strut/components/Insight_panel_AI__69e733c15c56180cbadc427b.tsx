import { useState, useEffect } from "react";

export default function InsightPanel({
  image = "https://assets.pathwai.care/organizations/69a42c4ba8473f2e87e8cab2/assets/media-1776468149822-2e26abc2bf7ef04b.jpg",
  heading = "Pairing the right GLP\u20111 treatment with ongoing support can make all the difference",
  headingColor = "#1a1a1a",
  headingSize = 22,
  accentColor = "#8fbfb0",
  headingFont = "'DM Sans', -apple-system, sans-serif",
  bodyFont = "'Plus Jakarta Sans', -apple-system, sans-serif",
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        .ip-wrap {
          max-width: 380px;
          margin: 0 auto;
          padding: 20px 16px 0;
          box-sizing: border-box;
          width: 100%;
        }
        .ip-wrap *, .ip-wrap *::before, .ip-wrap *::after { box-sizing: border-box; }

        .ip-card {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 16px;
          overflow: hidden;
        }
        .ip-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          opacity: 0;
          transition: opacity 1.4s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .ip-card-img.ip-show {
          opacity: 1;
        }

        .ip-heading {
          font-family: ${headingFont};
          font-size: ${headingSize}px;
          font-weight: 600;
          color: ${headingColor};
          line-height: 1.3;
          margin: 20px 0 0;
          letter-spacing: -0.3px;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) 0.8s, transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) 0.8s;
        }
        .ip-heading.ip-show {
          opacity: 1;
          transform: translateY(0);
        }

        @media (min-width: 900px) {
          .ip-wrap { max-width: 420px; }
          .ip-heading { margin-top: 24px; }
        }
        @media (min-width: 600px) and (max-width: 899px) {
          .ip-wrap { max-width: 400px; }
        }
        @media (max-width: 380px) {
          .ip-wrap { padding: 16px 12px 0; }
          .ip-heading { margin-top: 16px; }
        }
      `}</style>

      <div className="ip-wrap">
        <div className="ip-card">
          <img className={`ip-card-img ${show ? "ip-show" : ""}`} src={image} alt="" />
        </div>

        <h2 className={`ip-heading ${show ? "ip-show" : ""}`}>
          {heading}
        </h2>
      </div>
    </>
  );
}

export const propSchema = {
  image: {
    type: 'string',
    title: 'Image URL',
    defaultValue: 'https://assets.pathwai.care/organizations/69a42c4ba8473f2e87e8cab2/assets/media-1776468149822-2e26abc2bf7ef04b.jpg',
  },
  heading: {
    type: 'string',
    title: 'Heading Text',
    defaultValue: 'Pairing the right GLP\u20111 treatment with ongoing support can make all the difference',
  },
  headingColor: {
    type: 'color',
    title: 'Heading Color',
    defaultValue: '#1a1a1a',
  },
  headingSize: {
    type: 'number',
    title: 'Heading Font Size (px)',
    defaultValue: 22,
    min: 14,
    max: 36,
    step: 1,
  },
  accentColor: {
    type: 'color',
    title: 'Icon Accent Color',
    defaultValue: '#8fbfb0',
  },
  headingFont: {
    type: 'string',
    title: 'Heading Font',
    defaultValue: "'DM Sans', -apple-system, sans-serif",
  },
  bodyFont: {
    type: 'string',
    title: 'Body Font',
    defaultValue: "'Plus Jakarta Sans', -apple-system, sans-serif",
  },
};