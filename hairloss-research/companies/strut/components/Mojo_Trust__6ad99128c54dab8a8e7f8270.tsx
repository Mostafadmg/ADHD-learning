// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React from 'react';

/**
 * Mojo: Trust (22 Oct 2026)
 *
 * Social proof and reassurance for the Mojo questionnaires. One block, four layouts:
 *   card:   five stars + two lines in a rounded card (sign-up screen)
 *   line:   the same on one line (under Add to cart on the product screen)
 *   note:   one small grey line ("Takes 5 minutes · free to start")
 *   points: three reassurance points with the star card under them ("Built around your safety")
 * Chris, 22 Oct: "Trusted by 10,000+ men" and "Doctor-prescribed" word for word (the number is
 * true for Strut). Point copy is a prop so it can follow Jill's edits without a code change.
 */

function Stars({ color, size }: { color: string; size: number }) {
  return (
    <span aria-label="5 out of 5 stars" role="img" style={{ display: 'inline-flex', gap: 2, flexShrink: 0 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path fill={color} d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
        </svg>
      ))}
    </span>
  );
}

function PointIcon({ kind, color }: { kind: number; color: string }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (kind === 0) {
    return (
      <svg {...common} aria-hidden="true"><circle cx="12" cy="7" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /><path d="M12 14v4" /><path d="M10 16h4" /></svg>
    );
  }
  if (kind === 1) {
    return (
      <svg {...common} aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1" /><path d="M9 10h6" /><path d="M9 14h6" /><path d="M9 18h3" /></svg>
    );
  }
  return (
    <svg {...common} aria-hidden="true"><path d="M3 3v18h18" /><path d="M7 15l4-4 3 3 5-6" /></svg>
  );
}

export default function MojoTrust({
  layout = 'card',
  line1 = 'Trusted by 10,000+ men',
  line2 = 'Doctor-prescribed',
  note = 'Takes 5 minutes · free to start',
  point1Title = 'A licensed physician confirms your treatment',
  point1Text = 'Medication ships only after your provider reviews your labs.',
  point2Title = 'We check your health first',
  point2Text = 'Your answers and labs help your provider decide if Mojo is right for you.',
  point3Title = 'Follow up and Optimization',
  point3Text = 'Ongoing check-ins, dose adjustments as needed, and lab monitoring to ensure optimal results.',
  starColor = '#161336',
  textColor = '#1C1C21',
  mutedColor = '#71717a',
  borderColor = '#EFEFEC',
  tintColor = '#F4F4F8',
}: {
  layout?: 'card' | 'line' | 'note' | 'points';
  line1?: string;
  line2?: string;
  note?: string;
  point1Title?: string;
  point1Text?: string;
  point2Title?: string;
  point2Text?: string;
  point3Title?: string;
  point3Text?: string;
  starColor?: string;
  textColor?: string;
  mutedColor?: string;
  borderColor?: string;
  tintColor?: string;
}) {
  const font = 'Inter, system-ui, sans-serif';

  if (layout === 'note') {
    return <p style={{ margin: '6px 0 0', textAlign: 'center', fontFamily: font, fontSize: 13, color: mutedColor }}>{note}</p>;
  }

  if (layout === 'line') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', fontFamily: font, fontSize: 13, color: textColor, margin: '8px 0 0' }}>
        <Stars color={starColor} size={14} />
        <span style={{ fontWeight: 600 }}>{line1}</span>
        {line2 ? <span style={{ color: mutedColor }}>· {line2}</span> : null}
      </div>
    );
  }

  const starCard = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
      <Stars color={starColor} size={20} />
      <span style={{ display: 'grid', gap: 2 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: textColor }}>{line1}</span>
        {line2 ? <span style={{ fontSize: 15, fontWeight: 600, color: textColor }}>{line2}</span> : null}
      </span>
    </div>
  );

  if (layout === 'card') {
    return (
      <div style={{ fontFamily: font, border: '1px solid ' + borderColor, borderRadius: 18, background: '#FFFFFF' }}>
        {starCard}
      </div>
    );
  }

  /* points */
  const points = [
    { title: point1Title, text: point1Text },
    { title: point2Title, text: point2Text },
    { title: point3Title, text: point3Text },
  ].filter((p) => p.title);
  return (
    <div style={{ fontFamily: font, border: '1px solid ' + borderColor, borderRadius: 18, overflow: 'hidden', background: '#FFFFFF' }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: '18px 20px', display: 'grid', gap: 16 }}>
        {points.map((p, i) => (
          <li key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', columnGap: 12, alignItems: 'start' }}>
            <span style={{ paddingTop: 1 }}><PointIcon kind={i} color={starColor} /></span>
            <span>
              <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: textColor, lineHeight: 1.3 }}>{p.title}</span>
              <span style={{ display: 'block', marginTop: 3, fontSize: 13, color: mutedColor, lineHeight: 1.45 }}>{p.text}</span>
            </span>
          </li>
        ))}
      </ul>
      <div style={{ background: tintColor, borderTop: '1px solid ' + borderColor, padding: '14px 20px', textAlign: 'center' }}>
        <Stars color={starColor} size={18} />
        <div style={{ marginTop: 6, fontSize: 16, fontWeight: 600, color: textColor }}>{line1}</div>
        {line2 ? <div style={{ marginTop: 2, fontSize: 13, color: mutedColor }}>{line2}</div> : null}
      </div>
    </div>
  );
}

export const propSchema = {
  layout: { type: 'enum', title: 'Layout', options: ['card', 'line', 'note', 'points'], defaultValue: 'card' },
  line1: { type: 'string', title: 'Trust line 1', defaultValue: 'Trusted by 10,000+ men' },
  line2: { type: 'string', title: 'Trust line 2', defaultValue: 'Doctor-prescribed' },
  note: { type: 'string', title: 'Note (layout "note")', defaultValue: 'Takes 5 minutes · free to start' },
  point1Title: { type: 'string', title: 'Point 1 title', defaultValue: 'A licensed physician confirms your treatment' },
  point1Text: { type: 'string', title: 'Point 1 text', defaultValue: 'Medication ships only after your provider reviews your labs.' },
  point2Title: { type: 'string', title: 'Point 2 title', defaultValue: 'We check your health first' },
  point2Text: { type: 'string', title: 'Point 2 text', defaultValue: 'Your answers and labs help your provider decide if Mojo is right for you.' },
  point3Title: { type: 'string', title: 'Point 3 title', defaultValue: 'Follow up and Optimization' },
  point3Text: { type: 'string', title: 'Point 3 text', defaultValue: 'Ongoing check-ins, dose adjustments as needed, and lab monitoring to ensure optimal results.' },
  starColor: { type: 'color', title: 'Star and icon color', defaultValue: '#161336' },
  textColor: { type: 'color', title: 'Text color', defaultValue: '#1C1C21' },
  mutedColor: { type: 'color', title: 'Muted text color', defaultValue: '#71717a' },
  borderColor: { type: 'color', title: 'Border color', defaultValue: '#EFEFEC' },
  tintColor: { type: 'color', title: 'Star panel background', defaultValue: '#F4F4F8' },
};

export const outputSchema = {};
