// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React from 'react';

/**
 * Mojo: Order next steps (22 Oct 2026)
 *
 * The order-complete screen, right after payment (Chris, 21 Oct). Shows what happens next:
 * 1. verify your ID (the Persona block sits right under this list), 2. labs, 3. provider review.
 * Put it on the screen twice:
 *   mode "steps": the numbered list
 *   mode "later": the "I'll do it later" link under the Persona button. It moves on without
 *                 verifying; reminders by email and text follow up (Strut side).
 * Step 2 changes for patients who uploaded recent labs instead of buying a panel (read from the
 * lab screens' saved choice). Step copy is from the live Mojo page's "How it works".
 */

function readLabChoice(): any {
  try {
    const w = window as any;
    if (w.__STRUT_ENCLO_LAB__) return w.__STRUT_ENCLO_LAB__;
    const raw = window.localStorage.getItem('strut.enclo.labSelection');
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

export default function MojoOrderNextSteps({
  mode = 'steps',
  step1Title = 'Verify your ID',
  step1Text = 'Your provider needs this before prescribing.',
  step2Title = 'We ship you an at-home lab test',
  step2Text = 'A fast collection kit requiring only a few drops of blood from your fingertip. Results in days.',
  step2UploadTitle = 'Your provider reviews your uploaded labs',
  step2UploadText = 'No new lab test needed.',
  step3Title = 'Get a Custom Treatment Plan',
  step3Text = 'A U.S. licensed physician reviews your labs and creates a personalized treatment plan.',
  footnote = 'The entire process can take as few as 4-5 days, but typically 7-10 days for the full process.',
  laterText = "I'll do it later",
  brandColor = '#161336',
  textColor = '#1C1C21',
  mutedColor = '#71717a',
  borderColor = '#EFEFEC',
  onChange,
}: {
  mode?: 'steps' | 'later';
  step1Title?: string;
  step1Text?: string;
  step2Title?: string;
  step2Text?: string;
  step2UploadTitle?: string;
  step2UploadText?: string;
  step3Title?: string;
  step3Text?: string;
  footnote?: string;
  laterText?: string;
  brandColor?: string;
  textColor?: string;
  mutedColor?: string;
  borderColor?: string;
  onChange?: (v: Record<string, unknown>) => void;
}) {
  if (mode === 'later') {
    const later = () => {
      try { onChange?.({ idLater: true }); } catch (_) { /* ignore */ }
      (window as any).pathwai?.flow?.next?.();
    };
    return (
      <div style={{ textAlign: 'center', marginTop: 4 }}>
        <button
          type="button"
          onClick={later}
          style={{
            background: 'none', border: 'none', padding: '8px 4px', cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, color: mutedColor,
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}
        >
          {laterText}
        </button>
      </div>
    );
  }

  const lab = readLabChoice();
  const boughtPanel = !!(lab && (lab.labPanelId || lab.freePanel || lab.upgraded));
  const steps = [
    { title: step1Title, text: step1Text, current: true },
    boughtPanel || !lab
      ? { title: step2Title, text: step2Text, current: false }
      : { title: step2UploadTitle, text: step2UploadText, current: false },
    { title: step3Title, text: step3Text, current: false },
  ];

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: textColor }}>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
        {steps.map((s, i) => (
          <li
            key={i}
            style={{
              display: 'grid', gridTemplateColumns: '28px 1fr', columnGap: 12, alignItems: 'start',
              padding: '12px 14px', borderRadius: 14,
              border: '1px solid ' + (s.current ? brandColor : borderColor),
              background: s.current ? '#F7F7FB' : '#FFFFFF',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 28, height: 28, borderRadius: 999, display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 13, fontWeight: 700,
                background: s.current ? brandColor : '#F1F1EE', color: s.current ? '#FFFFFF' : mutedColor,
              }}
            >
              {i + 1}
            </span>
            <span>
              <span style={{ display: 'block', fontFamily: 'Figtree, Inter, system-ui, sans-serif', fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>
                {s.title}
              </span>
              <span style={{ display: 'block', marginTop: 2, fontSize: 13, lineHeight: 1.45, color: mutedColor }}>
                {s.text}
              </span>
            </span>
          </li>
        ))}
      </ol>
      {footnote ? (
        <p style={{ margin: '10px 2px 0', fontSize: 12, lineHeight: 1.45, color: mutedColor }}>{footnote}</p>
      ) : null}
    </div>
  );
}

export const propSchema = {
  mode: { type: 'enum', title: 'Show', options: ['steps', 'later'], defaultValue: 'steps' },
  step1Title: { type: 'string', title: 'Step 1 title', defaultValue: 'Verify your ID' },
  step1Text: { type: 'string', title: 'Step 1 text', defaultValue: 'Your provider needs this before prescribing.' },
  step2Title: { type: 'string', title: 'Step 2 title (bought a lab panel)', defaultValue: 'We ship you an at-home lab test' },
  step2Text: { type: 'string', title: 'Step 2 text (bought a lab panel)', defaultValue: 'A fast collection kit requiring only a few drops of blood from your fingertip. Results in days.' },
  step2UploadTitle: { type: 'string', title: 'Step 2 title (uploaded labs)', defaultValue: 'Your provider reviews your uploaded labs' },
  step2UploadText: { type: 'string', title: 'Step 2 text (uploaded labs)', defaultValue: 'No new lab test needed.' },
  step3Title: { type: 'string', title: 'Step 3 title', defaultValue: 'Get a Custom Treatment Plan' },
  step3Text: { type: 'string', title: 'Step 3 text', defaultValue: 'A U.S. licensed physician reviews your labs and creates a personalized treatment plan.' },
  footnote: { type: 'string', title: 'Timeline note', defaultValue: 'The entire process can take as few as 4-5 days, but typically 7-10 days for the full process.' },
  laterText: { type: 'string', title: '"Later" link text', defaultValue: "I'll do it later" },
  brandColor: { type: 'color', title: 'Brand color', defaultValue: '#161336' },
  textColor: { type: 'color', title: 'Text color', defaultValue: '#1C1C21' },
  mutedColor: { type: 'color', title: 'Muted text color', defaultValue: '#71717a' },
  borderColor: { type: 'color', title: 'Border color', defaultValue: '#EFEFEC' },
};

export const outputSchema = {
  idLater: { type: 'boolean', title: 'Chose "I\'ll do it later" for the ID check' },
};
