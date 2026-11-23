export default function TrustBadge({
  text = "Trusted by thousands of members",
  textColor = "#888",
  borderColor = "#ffffff",
  bodyFont = "'Inter', -apple-system, sans-serif",
  avatars = [
    "https://assets.superpower.com/website/checkout/autopilot-member-1.png",
    "https://assets.superpower.com/website/checkout/autopilot-member-2.png",
    "https://assets.superpower.com/website/checkout/autopilot-member-3.png",
  ],
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 4,
      fontFamily: bodyFont,
      margin: "0 16px 12px 0",
    }}>
      <div style={{ display: "flex" }}>
        {avatars.map((src, i) => (
          <div key={i} style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: `2px solid ${borderColor}`,
            overflow: "hidden",
            marginLeft: i > 0 ? -5 : 0,
            flexShrink: 0,
          }}>
            <img
              src={src}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        ))}
      </div>
      <span style={{ fontSize: 9, color: textColor, lineHeight: 1.4 }}>{text}</span>
    </div>
  );
}

export const propSchema = {
  text: {
    type: 'string',
    title: 'Trust Text',
    defaultValue: 'Trusted by thousands of members',
  },
  textColor: {
    type: 'color',
    title: 'Text Color',
    defaultValue: '##888888',
  },
  borderColor: {
    type: 'color',
    title: 'Avatar Border Color',
    defaultValue: '#ffffff',
  },
  bodyFont: {
    type: 'string',
    title: 'Body Font',
    defaultValue: "'Inter', -apple-system, sans-serif",
  },
};