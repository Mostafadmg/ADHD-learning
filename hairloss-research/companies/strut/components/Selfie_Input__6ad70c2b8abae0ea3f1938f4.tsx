import React, { useCallback, useEffect, useRef, useState } from 'react';

/* ============================================================
   Identity photos (PathwAI custom component)
   ------------------------------------------------------------
   One panel, two photos: a government ID and a selfie.
   Each photo can be taken with the camera or uploaded.
   The preview updates when a new image is chosen, and Remove
   clears it. Continue/Next is not gated by photo readiness.
   Layout follows the component width:
     under 680px  stacked (phone)
     680–979px    two columns (tablet)
     980px+       wider panel (desktop)
============================================================ */

type SlotId = 'document' | 'selfie';

type Photo = {
  dataUrl: string;
  fileName: string;
};

type Outputs = {
  ready: boolean;
  hasDocument: boolean;
  hasSelfie: boolean;
  documentDataUrl: string;
  documentFileName: string;
  selfieDataUrl: string;
  selfieFileName: string;
};

type Props = {
  eyebrow?: string;
  heading?: string;
  failureMessage?: string;
  helperText?: string;
  documentLabel?: string;
  documentHint?: string;
  selfieLabel?: string;
  selfieHint?: string;
  onChange?: (value: Outputs) => void;
};

const MAX_EDGE = 1280;

const STYLES = `
.psi {
  --psi-brand: rgb(22, 19, 54);
  --psi-brand-ink: #ffffff;
  --psi-ink: var(--pw-label-fg, var(--pw-color-on-surface, #0f172a));
  --psi-muted: #5c6570;
  --psi-line: #e6e2da;
  --psi-surface: #ffffff;
  --psi-soft: #f6f4f0;
  --psi-brand-soft: rgba(22, 19, 54, 0.08);
  --psi-ok: #17693f;
  --psi-ok-soft: #e7f6ee;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  color: var(--pw-label-fg, var(--pw-color-on-surface, #0f172a));
  font-family: var(--pw-label-font-family, var(--pw-font-family-title));
  line-height: 1.45;
  container-type: inline-size;
  container-name: psi;
  -webkit-font-smoothing: antialiased;
}
.psi, .psi *, .psi *::before, .psi *::after { box-sizing: border-box; }
.psi-panel {
  background: var(--psi-surface);
  border: 1px solid var(--psi-line);
  border-radius: 20px;
  padding: 20px 16px 16px;
  box-shadow: 0 16px 40px rgba(22, 19, 54, 0.06);
}
.psi-eyebrow {
  margin: 0 0 8px;
  color: var(--pw-label-fg, var(--pw-color-on-surface, #0f172a));
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.psi-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.psi-heading {
  margin: 0;
  color: var(--pw-label-fg, var(--pw-color-on-surface, #0f172a));
  font-family: var(--pw-label-font-family, var(--pw-font-family-title));
  font-size: 1.65rem;
  font-weight: 650;
  letter-spacing: -0.03em;
  line-height: 1.15;
}
.psi-pill {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--psi-brand-soft);
  color: rgb(22, 19, 54);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.01em;
}
.psi-pill[data-ready="true"] {
  background: var(--psi-ok-soft);
  color: var(--psi-ok);
}
.psi-lead, .psi-helper {
  margin: 0;
  color: var(--pw-label-fg, var(--pw-color-on-surface, #0f172a));
  font-family: var(--pw-label-font-family, var(--pw-font-family-title));
  font-size: 0.95rem;
}
.psi-lead { margin-bottom: 8px; }
.psi-progress-wrap { margin-top: 16px; }
.psi-progress-label {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 0 0 8px;
  color: var(--pw-label-fg, var(--pw-color-on-surface, #0f172a));
  font-family: var(--pw-label-font-family, var(--pw-font-family-title));
  font-size: 13px;
  font-weight: 650;
}
.psi-progress-label span { color: var(--psi-muted); font-weight: 500; }
.psi-bar {
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: #efece7;
}
.psi-bar > span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--psi-brand);
  transition: width 0.25s ease;
}
.psi-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 18px;
}
.psi-slot {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  padding: 14px;
  border: 1px solid var(--psi-line);
  border-radius: 18px;
  background: linear-gradient(180deg, #fff 0%, var(--psi-soft) 100%);
}
.psi-slot.is-ready {
  border-color: color-mix(in srgb, var(--psi-ok) 35%, var(--psi-line));
  background: #fff;
}
.psi-slot-head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
}
.psi-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: var(--psi-brand-soft);
  color: rgb(22, 19, 54);
}
.psi-icon svg { width: 22px; height: 22px; }
.psi-slot-title {
  margin: 0;
  color: var(--pw-label-fg, var(--pw-color-on-surface, #0f172a));
  font-family: var(--pw-label-font-family, var(--pw-font-family-title));
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.psi-slot-hint {
  margin: 2px 0 0;
  color: var(--pw-label-fg, var(--pw-color-on-surface, #0f172a));
  font-family: var(--pw-label-font-family, var(--pw-font-family-title));
  font-size: 0.84rem;
}
.psi-added {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--psi-ok-soft);
  color: var(--psi-ok);
  font-size: 12px;
  font-weight: 700;
}
.psi-frame {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border: 1px dashed color-mix(in srgb, var(--psi-ink) 18%, transparent);
  border-radius: 14px;
  background: #f3f1ec center / cover no-repeat;
}
.psi-slot.is-ready .psi-frame {
  border-style: solid;
  border-color: transparent;
}
.psi-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
  color: var(--psi-muted);
  text-align: center;
}
.psi-empty strong {
  color: var(--pw-label-fg, var(--pw-color-on-surface, #0f172a));
  font-family: var(--pw-label-font-family, var(--pw-font-family-title));
  font-size: 0.95rem;
  font-weight: 700;
}
.psi-empty span { font-size: 0.8rem; }
.psi-frame-meta {
  position: absolute;
  right: 10px;
  bottom: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(22, 19, 54, 0.72);
  color: #fff;
  backdrop-filter: blur(8px);
}
.psi-filename {
  overflow: hidden;
  font-size: 12px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.psi-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.psi-primary, .psi-secondary, .psi-remove, .psi-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  border-radius: 12px;
  font-family: var(--pw-label-font-family, var(--pw-font-family-title));
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.2;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}
.psi-primary {
  border: 0;
  background: rgb(22, 19, 54);
  color: #fff;
}
.psi-primary:hover:not(:disabled) { filter: brightness(1.04); transform: translateY(-1px); }
.psi-secondary {
  position: relative;
  border: 1.5px solid rgb(22, 19, 54);
  background: #fff;
  color: rgb(22, 19, 54);
}
.psi-secondary:hover { border-color: color-mix(in srgb, var(--psi-brand) 55%, var(--psi-line)); }
.psi-ghost {
  width: auto;
  min-height: 44px;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: #fff;
}
.psi-remove {
  min-height: 40px;
  padding: 8px 12px;
  border: 0;
  background: transparent;
  color: rgb(22, 19, 54);
  font-size: 0.92rem;
}
.psi-remove:hover { background: var(--psi-brand-soft); }
.psi-primary:disabled, .psi-ghost:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  filter: none;
}
.psi-primary:focus-visible, .psi-secondary:focus-visible, .psi-remove:focus-visible, .psi-ghost:focus-visible {
  outline: 2px solid var(--psi-ink);
  outline-offset: 2px;
}
.psi-file {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
.psi-error {
  margin: -6px 0 0;
  color: #b42318;
  font-size: 0.84rem;
}
.psi-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(22, 19, 54, 0.62);
}
.psi-modal-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: min(94vh, 860px);
  overflow: auto;
  border-radius: 22px 22px 0 0;
  background: #12141a;
  color: #fff;
}
.psi-modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 16px 8px;
}
.psi-modal-head h3 {
  margin: 0 0 4px;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
}
.psi-modal-head p { margin: 0; color: rgba(255, 255, 255, 0.72); font-size: 0.88rem; }
.psi-video-wrap { position: relative; margin: 8px 16px 0; }
.psi-video {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 16px;
  background: #000;
  object-fit: cover;
}
.psi-video[data-mirror="true"] { transform: scaleX(-1); }
.psi-camera-status {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
}
.psi-modal-error { margin: 10px 16px 0; color: #ffb4a8; font-size: 0.9rem; }
.psi-modal-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px 18px;
}
.psi-modal-footer .psi-primary { order: -1; }

@container psi (min-width: 680px) {
  .psi-panel { padding: 28px 24px 22px; border-radius: 24px; }
  .psi-heading { font-size: 2rem; }
  .psi-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
  .psi-actions { flex-direction: row; }
  .psi-primary, .psi-secondary { width: auto; flex: 1; }
  .psi-remove { width: auto; align-self: flex-start; padding-left: 4px; }
}
@container psi (min-width: 980px) {
  .psi-panel { padding: 36px 32px 28px; }
  .psi-head {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(220px, 280px);
    gap: 32px;
    align-items: end;
  }
  .psi-progress-wrap { margin-top: 0; }
  .psi-heading { font-size: 2.35rem; }
  .psi-grid { gap: 20px; margin-top: 28px; }
  .psi-slot { padding: 18px; }
  .psi-frame { aspect-ratio: 16 / 11; }
}
@media (min-width: 720px) {
  .psi-modal { align-items: center; padding: 24px; }
  .psi-modal-card {
    width: min(680px, 100%);
    border-radius: 22px;
  }
  .psi-modal-footer { flex-direction: row; justify-content: flex-end; }
  .psi-modal-footer .psi-primary { order: 0; width: auto; min-width: 180px; }
  .psi-ghost { width: auto; }
}
@media (prefers-reduced-motion: reduce) {
  .psi-bar > span, .psi-primary, .psi-secondary, .psi-remove { transition: none; }
  .psi-primary:hover:not(:disabled) { transform: none; }
}
`;

function cameraErrorMessage(error: unknown): string {
  const name = error && typeof error === 'object' && 'name' in error ? String((error as { name?: string }).name) : '';
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return 'Camera access was not allowed. You can still upload a photo.';
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'No camera was found on this device. You can still upload a photo.';
  }
  if (error instanceof Error && error.message) return error.message;
  return 'The camera could not be opened. You can still upload a photo.';
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not read that image.'));
    image.src = src;
  });
}

async function shrinkDataUrl(dataUrl: string): Promise<string> {
  const image = await loadImage(dataUrl);
  const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return dataUrl;
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error('Could not read that file.'));
    reader.readAsDataURL(file);
  });
}

function IdIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="12" r="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M13.5 10.5h5M13.5 13.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SelfieIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6.5 18.5c.8-2.4 2.8-3.7 5.5-3.7s4.7 1.3 5.5 3.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function MyComponent({
  eyebrow = 'Identity verification',
  heading = 'Verification failed',
  failureMessage = 'Sorry we could not verify you through Persona. Your doctor will review the information you provided and verify you at that time. Please upload the requested photos and press Next.',
  helperText = 'Since you are receiving treatment, your doctor needs a couple images to complete your prescription.',
  documentLabel = 'Photo ID',
  documentHint = 'Take a picture of your government ID, or upload one you already have.',
  selfieLabel = 'Selfie',
  selfieHint = 'Open the camera for a live photo, or upload a selfie. You can replace or remove it.',
  onChange,
}: Props) {
  const [documentPhoto, setDocumentPhoto] = useState<Photo | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<Photo | null>(null);
  const [slotError, setSlotError] = useState<Partial<Record<SlotId, string>>>({});
  const [cameraSlot, setCameraSlot] = useState<SlotId | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  useEffect(() => {
    if (!cameraSlot) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCameraSlot(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cameraSlot]);

  useEffect(() => {
    if (!cameraSlot) return undefined;
    let cancelled = false;
    setCameraReady(false);
    setCameraError(null);

    const open = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('This browser cannot open the camera. You can still upload a photo.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: cameraSlot === 'selfie' ? 'user' : { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play();
        }
        if (!cancelled) setCameraReady(true);
      } catch (error) {
        if (!cancelled) setCameraError(cameraErrorMessage(error));
      }
    };

    open();
    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [cameraSlot, stopCamera]);

  useEffect(() => {
    const outputs: Outputs = {
      ready: !!(documentPhoto && selfiePhoto),
      hasDocument: !!documentPhoto,
      hasSelfie: !!selfiePhoto,
      documentDataUrl: documentPhoto?.dataUrl || '',
      documentFileName: documentPhoto?.fileName || '',
      selfieDataUrl: selfiePhoto?.dataUrl || '',
      selfieFileName: selfiePhoto?.fileName || '',
    };
    onChangeRef.current?.(outputs);
  }, [documentPhoto, selfiePhoto]);

  const setPhoto = (slot: SlotId, photo: Photo | null) => {
    if (slot === 'document') setDocumentPhoto(photo);
    else setSelfiePhoto(photo);
    setSlotError((prev) => ({ ...prev, [slot]: undefined }));
  };

  const onUpload = async (slot: SlotId, event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setSlotError((prev) => ({ ...prev, [slot]: 'Please choose a PNG or JPG image.' }));
      return;
    }
    try {
      const raw = await readFile(file);
      const dataUrl = await shrinkDataUrl(raw);
      const baseName = file.name.replace(/\.[^.]+$/, '') || (slot === 'selfie' ? 'selfie' : 'id');
      setPhoto(slot, { dataUrl, fileName: `${baseName}.jpg` });
    } catch (error) {
      setSlotError((prev) => ({
        ...prev,
        [slot]: error instanceof Error ? error.message : 'Could not use that image.',
      }));
    }
  };

  const capture = () => {
    const slot = cameraSlot;
    const video = videoRef.current;
    if (!slot || !video || !video.videoWidth) {
      setCameraError('The camera is still starting. Try again in a moment.');
      return;
    }
    const scale = Math.min(1, MAX_EDGE / Math.max(video.videoWidth, video.videoHeight));
    const width = Math.max(1, Math.round(video.videoWidth * scale));
    const height = Math.max(1, Math.round(video.videoHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return;
    if (slot === 'selfie') {
      context.translate(width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(video, 0, 0, width, height);
    setPhoto(slot, { dataUrl: canvas.toDataURL('image/jpeg', 0.85), fileName: slot === 'selfie' ? 'selfie.jpg' : 'id.jpg' });
    setCameraSlot(null);
  };

  const renderSlot = (
    slot: SlotId,
    label: string,
    hint: string,
    photo: Photo | null,
    icon: React.ReactNode,
  ) => (
    <article className={photo ? 'psi-slot is-ready' : 'psi-slot'}>
      <div className="psi-slot-head">
        <span className="psi-icon">{icon}</span>
        <div>
          <h3 className="psi-slot-title">{label}</h3>
          <p className="psi-slot-hint">{hint}</p>
        </div>
        {photo ? <span className="psi-added">Added</span> : null}
      </div>

      <div
        className="psi-frame"
        role="img"
        aria-label={photo ? `${label} preview` : `${label} preview empty`}
        style={photo ? { backgroundImage: `url("${photo.dataUrl}")` } : undefined}
      >
        {photo ? (
          <div className="psi-frame-meta">
            <span className="psi-filename">{photo.fileName}</span>
            <span>Preview</span>
          </div>
        ) : (
          <div className="psi-empty">
            <strong>No photo yet</strong>
            <span>Take a picture or upload a file</span>
          </div>
        )}
      </div>

      <div className="psi-actions">
        <button type="button" className="psi-primary" onClick={() => setCameraSlot(slot)}>
          {photo ? 'Retake' : 'Take picture'}
        </button>
        <label className="psi-secondary">
          {photo ? 'Replace' : 'Upload'}
          <input
            className="psi-file"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={(event) => onUpload(slot, event)}
          />
        </label>
      </div>
      {photo ? (
        <button type="button" className="psi-remove" onClick={() => setPhoto(slot, null)}>
          Remove photo
        </button>
      ) : null}
      {slotError[slot] ? <p className="psi-error">{slotError[slot]}</p> : null}
    </article>
  );

  const done = Number(!!documentPhoto) + Number(!!selfiePhoto);
  const ready = done === 2;
  const lead = failureMessage;
  const cameraTitle = cameraSlot === 'selfie' ? 'Take a selfie' : 'Photograph your ID';
  const cameraHint = cameraSlot === 'selfie'
    ? 'Center your face. The preview updates as soon as you capture.'
    : 'Fill the frame with your ID and keep the text readable.';

  return (
    <section className="psi">
      <style>{STYLES}</style>
      <div className="psi-panel">
        <header className="psi-head">
          <div>
            <p className="psi-eyebrow">{eyebrow}</p>
            <div className="psi-title-row">
              <h2 className="psi-heading">{heading}</h2>
              <span className="psi-pill" data-ready={ready ? 'true' : 'false'}>
                {ready ? 'Ready for review' : 'Needs photos'}
              </span>
            </div>
            <p className="psi-lead">{lead}</p>
            <p className="psi-helper">{helperText}</p>
          </div>
          <div className="psi-progress-wrap">
            <p className="psi-progress-label">
              {done} of 2 photos added
              <span>{ready ? 'You can continue' : 'Add both photos'}</span>
            </p>
            <div className="psi-bar" aria-hidden="true">
              <span style={{ width: `${(done / 2) * 100}%` }} />
            </div>
          </div>
        </header>

        <div className="psi-grid">
          {renderSlot('document', documentLabel, documentHint, documentPhoto, <IdIcon />)}
          {renderSlot('selfie', selfieLabel, selfieHint, selfiePhoto, <SelfieIcon />)}
        </div>
      </div>

      {cameraSlot ? (
        <div className="psi-modal" role="dialog" aria-modal="true" aria-labelledby="psi-camera-title">
          <div className="psi-modal-card">
            <div className="psi-modal-head">
              <div>
                <h3 id="psi-camera-title">{cameraTitle}</h3>
                <p>{cameraHint}</p>
              </div>
              <button type="button" className="psi-ghost" onClick={() => setCameraSlot(null)}>
                Close
              </button>
            </div>
            <div className="psi-video-wrap">
              <video
                ref={videoRef}
                className="psi-video"
                data-mirror={cameraSlot === 'selfie' ? 'true' : 'false'}
                autoPlay
                muted
                playsInline
              />
              {!cameraReady && !cameraError ? <p className="psi-camera-status">Opening camera…</p> : null}
            </div>
            {cameraError ? <p className="psi-modal-error">{cameraError}</p> : null}
            <div className="psi-modal-footer">
              <button type="button" className="psi-ghost" onClick={() => setCameraSlot(null)}>
                Cancel
              </button>
              <button type="button" className="psi-primary" onClick={capture} disabled={!cameraReady}>
                Capture photo
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export const propSchema = {
  eyebrow: {
    type: 'string',
    title: 'Eyebrow',
    defaultValue: 'Identity verification',
  },
  heading: {
    type: 'string',
    title: 'Heading',
    defaultValue: 'Verification failed',
  },
  failureMessage: {
    type: 'string',
    title: 'Failure message',
    defaultValue:
      'Sorry we could not verify you through Persona. Your doctor will review the information you provided and verify you at that time. Please upload the requested photos and press Next.',
  },
  helperText: {
    type: 'string',
    title: 'Helper text',
    defaultValue:
      'Since you are receiving treatment, your doctor needs a couple images to complete your prescription.',
  },
  documentLabel: {
    type: 'string',
    title: 'Document label',
    defaultValue: 'Photo ID',
  },
  documentHint: {
    type: 'string',
    title: 'Document hint',
    defaultValue: 'Take a picture of your government ID, or upload one you already have.',
  },
  selfieLabel: {
    type: 'string',
    title: 'Selfie label',
    defaultValue: 'Selfie',
  },
  selfieHint: {
    type: 'string',
    title: 'Selfie hint',
    defaultValue: 'Open the camera for a live photo, or upload a selfie. You can replace or remove it.',
  },
};

export const outputSchema = {
  ready: {
    type: 'boolean',
    title: 'Both photos added',
    description: 'True when the ID and the selfie both have a preview.',
  },
  hasDocument: { type: 'boolean', title: 'ID added' },
  hasSelfie: { type: 'boolean', title: 'Selfie added' },
  documentDataUrl: { type: 'string', title: 'ID image data URL' },
  documentFileName: { type: 'string', title: 'ID file name' },
  selfieDataUrl: { type: 'string', title: 'Selfie image data URL' },
  selfieFileName: { type: 'string', title: 'Selfie file name' },
};
