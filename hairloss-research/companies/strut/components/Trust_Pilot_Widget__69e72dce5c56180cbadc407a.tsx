const TP_GREEN = "#00b67a";

export default function TrustpilotBadge({
  rating = "3.4",
  reviewCount = "759",
  reviewsUrl = "https://ca.trustpilot.com/review/strutyours.com",
  textColor = "#555",
  linkColor = "#1a1a1a",
  bodyFont = "'Plus Jakarta Sans', -apple-system, sans-serif",
}) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
        .tpb-wrap {
          padding: 16px 20px;
          text-align: center;
          font-family: ${bodyFont};
          box-sizing: border-box;
        }
        .tpb-text {
          font-size: 11px;
          color: ${textColor};
          margin: 0 0 4px;
          line-height: 1.5;
        }
        .tpb-text strong {
          color: ${linkColor};
          font-weight: 600;
        }
        .tpb-text a {
          color: ${linkColor};
          font-weight: 600;
          text-decoration: underline;
        }
        .tpb-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          font-size: 11px;
          font-weight: 600;
          color: ${linkColor};
        }
      `}</style>

      <div className="tpb-wrap">
        <p className="tpb-text">
          Reviews <a href={reviewsUrl} target="_blank" rel="noopener noreferrer">{reviewCount}</a> • TrustScore <strong>{rating}</strong> out of 5
        </p>
        <div className="tpb-logo">
          <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
            <rect width="18" height="18" rx="2" fill={TP_GREEN} />
            <path d="M9 2.5L10.4 6.3H14.5L11.2 8.7L12.5 12.5L9 10.1L5.5 12.5L6.8 8.7L3.5 6.3H7.6L9 2.5Z" fill="#fff" />
          </svg>
          Trustpilot
        </div>
      </div>
    </>
  );
}

export const propSchema = {
  rating: {
    type: 'string',
    title: 'Rating',
    defaultValue: '3.4',
  },
  reviewCount: {
    type: 'string',
    title: 'Review Count',
    defaultValue: '759',
  },
  reviewsUrl: {
    type: 'string',
    title: 'Trustpilot Page URL',
    defaultValue: 'https://ca.trustpilot.com/review/strutyours.com',
  },
  textColor: {
    type: 'color',
    title: 'Text Color',
    defaultValue: '#555555',
  },
  linkColor: {
    type: 'color',
    title: 'Link / Bold Color',
    defaultValue: '#1a1a1a',
  },
  bodyFont: {
    type: 'string',
    title: 'Font',
    defaultValue: "'Plus Jakarta Sans', -apple-system, sans-serif",
  },
};