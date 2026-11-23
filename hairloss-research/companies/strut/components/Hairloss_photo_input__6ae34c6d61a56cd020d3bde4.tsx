import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Hair-loss treatment photos (front / back hairline) — not ID or Selfie.
 * Uses hlp-slot / hlp-frame so this step does not conflict with your existing Persona-failure
 * ID/Selfie card (psi-slot). SDK uploads both sets before FinishOrderV2.
 *
 * Requires pathwai-finasteride-oral-tablets-sdk.js (fetchTreatmentPhotos + queuePhotoUpload).
 */

declare global {
  interface Window {
    pathwai?: {
      flow?: {
        getAnswers?: () => Record<string, unknown>;
        next?: (val?: unknown) => void;
      };
    };
    strut?: {
      fetchTreatmentPhotos?: () => Promise<PhotoSlotMeta[]>;
      queuePhotoUpload?: (slot: PhotoSlotMeta, file: File | Blob) => Promise<unknown>;
      getCurrentVisiting?: () => Promise<unknown>;
      getOrderId?: () => number | null;
      getVisitingId?: () => string | null;
    };
  }
}

const BLOCK_ALIAS = 'block-strut-hair-loss-photos';

type PhotoSlotMeta = {
  Id: number;
  Name: string;
  ShortName: string;
  hint?: string;
  slotKey?: 'front' | 'back';
};

const HAIRLINE_FALLBACK: PhotoSlotMeta[] = [
  {
    Id: 0,
    slotKey: 'front',
    Name: 'Front of your hairline',
    ShortName: 'Front of your hairline',
  },
  {
    Id: 0,
    slotKey: 'back',
    Name: 'Back of your hairline',
    ShortName: 'Back of your hairline',
  },
];

function captureKey(slot: PhotoSlotMeta): string {
  if (slot.Id > 0) return String(slot.Id);
  return slot.slotKey || slot.ShortName;
}

function remapCaptures(
  prev: Record<string, SlotCapture>,
  nextSlots: PhotoSlotMeta[],
): Record<string, SlotCapture> {
  const out = { ...prev };
  nextSlots.forEach((slot) => {
    const to = captureKey(slot);
    if (out[to]?.dataUrl) return;
    const legacy = slot.slotKey && out[slot.slotKey];
    const byId = slot.Id > 0 && out[String(slot.Id)];
    const hit = legacy || byId;
    if (hit) out[to] = hit;
  });
  return out;
}

type SlotCapture = {
  dataUrl: string;
  fileName: string;
};

type Props = {
  onChange?: (out: Record<string, unknown>) => void;
};

/** Display order when API returns category rows (ShortName comes from DB). */
const HAIRLINE_HINTS: Record<string, string> = {
  front: 'Tilt your head slightly down so your front hairline is visible.',
  back: 'Use a mirror or helper to show the back of your hairline.',
};

function hintForSlot(slot: PhotoSlotMeta): string {
  if (slot.hint) return slot.hint;
  const blob = `${slot.ShortName} ${slot.Name}`.toLowerCase();
  if (/front/.test(blob)) return HAIRLINE_HINTS.front;
  if (/back/.test(blob)) return HAIRLINE_HINTS.back;
  return 'Good lighting, no filters.';
}

function dataUrlAnswerKey(shortName: string): string {
  const compact = String(shortName || '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join('');
  return (compact || 'photo') + 'DataUrl';
}

function readSavedCaptures(): Record<string, SlotCapture> {
  const out: Record<string, SlotCapture> = {};
  try {
    const answers = window.pathwai?.flow?.getAnswers?.() || {};
    const blob = answers[BLOCK_ALIAS];
    if (!blob || typeof blob !== 'object') return out;
    const raw = blob as Record<string, unknown>;
    if (raw.captures && typeof raw.captures === 'object') {
      Object.assign(out, raw.captures as Record<string, SlotCapture>);
    }
  } catch {
    /* ignore */
  }
  return out;
}

function sortHairlineSlots(slots: PhotoSlotMeta[]): PhotoSlotMeta[] {
  const rank = (s: PhotoSlotMeta) => {
    const t = `${s.ShortName} ${s.Name}`.toLowerCase();
    if (/front/.test(t)) return 0;
    if (/back/.test(t)) return 1;
    return 2;
  };
  return [...slots].sort((a, b) => rank(a) - rank(b));
}

async function fileFromDataUrl(dataUrl: string, fileName: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const type = blob.type || 'image/jpeg';
  return new File([blob], fileName, { type });
}

/* Vector symbols matching the exact line-art reference */
function HairSilhouette({ type }: { type: 'front' | 'back' }) {
  if (type === 'front') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hlp-silhouette"
      >
        <path
          d="M21 70C28 65 29 45 29 38C29 23 41 12 56 12C70 12 84 24 84 39C84 41 83 42 82 43"
          stroke="#424c5e"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <path
          d="M82 39C78 35 71 31 66 32C62 33 60 37 57 41C54 44 52 44 51 45"
          stroke="#424c5e"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M82 39C81 49 79 56 77 60C76 62 74 65 74 69C74 72 71 73 71 75C68 79 63 82 59 84C55 85 50 83 48 77C46 72 44 64 43 62"
          stroke="#424c5e"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M51 42C44 42 40 47 41 53C42 57 46 59 50 56"
          stroke="#424c5e"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <path
          d="M48 77C47 81 44 86 43 89"
          stroke="#424c5e"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <g transform="translate(74, 76)">
          <path
            d="M2 5C2 3.89 2.89 3 4 3H6L7.2 1.4C7.5 1.1 8 1 8.5 1H11.5C12 1 12.5 1.1 12.8 1.4L14 3H16C17.11 3 18 3.89 18 5V13C18 14.11 17.11 15 16 15H4C2.89 15 2 14.11 2 13V5Z"
            fill="#121833"
          />
          <circle cx="10" cy="9" r="3" fill="#ffffff" />
          <circle cx="10" cy="9" r="1.8" fill="#121833" />
          <path
            d="M17 12H21M19 10V14"
            stroke="#121833"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hlp-silhouette"
    >
      <path
        d="M23 44C23 23 35 8 50 8C65 8 77 23 77 44C77 56 73 63 68 70C65 74 65 77 66 87"
        stroke="#424c5e"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path
        d="M34 87C35 77 35 74 32 70C27 63 23 56 23 44"
        stroke="#424c5e"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path
        d="M25 43C29 55 35 68 40 68C45 68 55 68 60 68C65 68 71 55 75 43"
        stroke="#424c5e"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 44C18 44 16 48 16 53C16 58 19 62 25 62"
        stroke="#424c5e"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path
        d="M77 44C82 44 84 48 84 53C84 58 81 62 75 62"
        stroke="#424c5e"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <g transform="translate(74, 76)">
        <path
          d="M2 5C2 3.89 2.89 3 4 3H6L7.2 1.4C7.5 1.1 8 1 8.5 1H11.5C12 1 12.5 1.1 12.8 1.4L14 3H16C17.11 3 18 3.89 18 5V13C18 14.11 17.11 15 16 15H4C2.89 15 2 14.11 2 13V5Z"
          fill="#121833"
        />
        <circle cx="10" cy="9" r="3" fill="#ffffff" />
        <circle cx="10" cy="9" r="1.8" fill="#121833" />
        <path
          d="M17 12H21M19 10V14"
          stroke="#121833"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

const STYLES = `
.strut-hlp {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 12px 16px 28px;
  box-sizing: border-box;
  font-family: var(--pw-font-family-body, "Basis Grotesque Pro", ui-sans-serif, system-ui, -apple-system, sans-serif);
  color: #222222;
}
.strut-hlp *, .strut-hlp *::before, .strut-hlp *::after { box-sizing: border-box; }
.strut-hlp__wrap { width: 100%; max-width: 520px; }
.strut-hlp__heading {
  margin: 0 0 8px;
  font-weight: 500;
  font-size: 32px;
  line-height: 1.15;
  color: #222222;
}
.strut-hlp__lede {
  margin: 0 0 20px;
  font-size: 15px;
  line-height: 1.5;
  color: #444;
}
.hlp-slot {
  margin-top: 22px;
  padding: 22px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}
.hlp-slot-title {
  margin: 0 0 4px;
  font-size: 16.5px;
  font-weight: 700;
  line-height: 1.3;
  color: #0d1326;
}
.strut-hlp__hint {
  margin: 0 0 18px;
  font-size: 13.5px;
  line-height: 1.45;
  color: #64748b;
}

/* Centered row inside the card */
.strut-hlp__row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

/* Image / Symbol Frame */
.hlp-frame {
  position: relative;
  flex-shrink: 0;
  width: 110px;
  height: 110px;
  border-radius: 14px;
  background-color: #f1f4f8;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.hlp-frame.has-image {
  border: 1.5px solid #0d1326;
  background-color: #000;
}
.hlp-silhouette {
  width: 84%;
  height: 84%;
}

/* Stacked buttons on separate lines, matching width and centered */
.strut-hlp__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}
.strut-hlp__btn-action {
  width: 154px;
  height: 38px;
  padding: 0 16px;
  border: none;
  border-radius: 20px;
  font-size: 13.5px;
  font-weight: 600;
  font-family: inherit;
  color: #ffffff;
  background: #0d1326;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.15s ease, transform 0.1s ease;
  box-sizing: border-box;
}
.strut-hlp__btn-action svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  stroke-width: 2.2;
}
.strut-hlp__btn-action:hover {
  background: #1e293b;
}
.strut-hlp__btn-action:active {
  transform: scale(0.98);
}

.strut-hlp__error {
  margin: 16px 0 0;
  padding: 12px 14px;
  border-radius: 8px;
  background: #fef2f2;
  color: #7f1d1d;
  font-size: 12px;
  line-height: 1.45;
}
.strut-hlp__continue {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}
.strut-hlp__continue .strut-hlp__btn { width: 100%; max-width: 280px; }
.strut-hlp__btn {
  min-height: 44px;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: var(--pw-radius, 0.5rem);
  font: inherit;
  font-size: var(--pw-font-size-body, 1rem);
  font-weight: 600;
  font-family: var(--pw-font-family-body, system-ui, sans-serif);
  color: var(--pw-button-fg, #ffffff);
  background: var(--pw-button-bg, var(--pw-color-brand, #2563eb));
  cursor: pointer;
}
.strut-hlp__btn:disabled { opacity: 0.5; cursor: not-allowed; }
.strut-hlp__cam {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.strut-hlp__cam-panel {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
}
.strut-hlp__cam-video {
  width: 100%;
  display: block;
  background: #111;
  aspect-ratio: 3 / 4;
  object-fit: cover;
}
.strut-hlp__cam-bar {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  justify-content: flex-end;
}
@media (max-width: 600px) {
  .strut-hlp__heading { font-size: 22px; }
}
`;

export default function HairLossPhotoCard({ onChange }: Props) {
  const [slots, setSlots] = useState<PhotoSlotMeta[]>(() => sortHairlineSlots(HAIRLINE_FALLBACK));
  const [captures, setCaptures] = useState<Record<string, SlotCapture>>(() => readSavedCaptures());
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [camSlot, setCamSlot] = useState<PhotoSlotMeta | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputsRef = useRef<Record<string, HTMLInputElement | null>>({});
  const advancedRef = useRef(false);

  const flushPendingUploads = useCallback(async (nextSlots: PhotoSlotMeta[], caps: Record<string, SlotCapture>) => {
    for (const slot of nextSlots) {
      if (!slot.Id) continue;
      const cap = caps[captureKey(slot)];
      if (!cap?.dataUrl) continue;
      try {
        const file = await fileFromDataUrl(cap.dataUrl, cap.fileName);
        await window.strut?.queuePhotoUpload?.(slot, file);
      } catch { /* retry at checkout */ }
    }
  }, []);

  const loadSlots = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const strut = window.strut;
      if (strut?.getCurrentVisiting && (!strut.getOrderId?.() || !strut.getVisitingId?.())) {
        try { await strut.getCurrentVisiting(); } catch { /* show inputs anyway */ }
      }
      const rows = strut?.fetchTreatmentPhotos
        ? await strut.fetchTreatmentPhotos()
        : HAIRLINE_FALLBACK;
      const next = sortHairlineSlots(rows.length ? rows : HAIRLINE_FALLBACK);
      setSlots(next);
      setCaptures((prev) => {
        const merged = remapCaptures(prev, next);
        void flushPendingUploads(next, merged);
        return merged;
      });
    } catch {
      setSlots(sortHairlineSlots(HAIRLINE_FALLBACK));
    } finally {
      setLoadingSlots(false);
    }
  }, [flushPendingUploads]);

  useEffect(() => {
    void loadSlots();
  }, [loadSlots]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCamSlot(null);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const openCamera = useCallback(async (slot: PhotoSlotMeta) => {
    setError(null);
    stopCamera();
    setCamSlot(slot);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      setError('Camera access was blocked. Use Upload instead.');
      stopCamera();
    }
  }, [stopCamera]);

  const applyCapture = useCallback(async (slot: PhotoSlotMeta, dataUrl: string, fileName: string) => {
    const key = captureKey(slot);
    setCaptures((prev) => ({ ...prev, [key]: { dataUrl, fileName } }));
    if (!slot.Id) return;
    try {
      const file = await fileFromDataUrl(dataUrl, fileName);
      await window.strut?.queuePhotoUpload?.(slot, file);
    } catch {
      /* SDK may upload later from data URLs */
    }
  }, []);

  const onFilePicked = useCallback(async (slot: PhotoSlotMeta, file: File | null) => {
    if (!file || !file.size) return;
    setError(null);
    const safeName = /\.(jpe?g|png|heic|webp)$/i.test(file.name || '')
      ? file.name
      : `${slot.ShortName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      if (!/^data:image\//i.test(dataUrl)) {
        setError('Please choose a JPEG or PNG image.');
        return;
      }
      void applyCapture(slot, dataUrl, safeName);
    };
    reader.readAsDataURL(file);
  }, [applyCapture]);

  const captureFromCamera = useCallback(async () => {
    if (!camSlot || !videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const fileName = `${camSlot.ShortName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    await applyCapture(camSlot, dataUrl, fileName);
    stopCamera();
  }, [applyCapture, camSlot, stopCamera]);

  const displayTitle = (slot: PhotoSlotMeta) => {
    const blob = `${slot.ShortName} ${slot.Name}`.toLowerCase();
    if (/front/.test(blob)) return 'Front of your hairline';
    if (/back/.test(blob)) return 'Back of your hairline';
    return slot.ShortName || slot.Name;
  };

  const getSlotType = (slot: PhotoSlotMeta): 'front' | 'back' => {
    const blob = `${slot.ShortName} ${slot.Name}`.toLowerCase();
    return /back/.test(blob) ? 'back' : 'front';
  };

  const allComplete = useMemo(
    () => slots.length > 0 && slots.every((s) => captures[captureKey(s)]?.dataUrl),
    [slots, captures],
  );

  const advance = useCallback((payload: Record<string, unknown>) => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    onChange?.(payload);
    try { window.pathwai?.flow?.next?.(payload); } catch { /* ignore */ }
  }, [onChange]);

  const submit = () => {
    setError(null);
    const missing = slots.filter((s) => !captures[captureKey(s)]?.dataUrl);
    if (missing.length) {
      setError(`Add a photo for: ${missing.map((m) => displayTitle(m)).join(', ')}.`);
      return;
    }
    void flushPendingUploads(slots, captures);
    const payload: Record<string, unknown> = { captures };
    slots.forEach((slot) => {
      const cap = captures[captureKey(slot)];
      if (!cap?.dataUrl) return;
      payload[dataUrlAnswerKey(slot.ShortName)] = cap.dataUrl;
    });
    advance(payload);
  };

  return (
    <div className="strut-hlp">
      <style>{STYLES}</style>
      <div className="strut-hlp__wrap">
        <h1 className="strut-hlp__heading">Hair photos for your doctor</h1>
        <p className="strut-hlp__lede">
          Since you are receiving hair treatment, your doctor needs clear images of your hairline.
        </p>
        {loadingSlots ? (
          <p className="strut-hlp__hint" style={{ marginTop: 0 }}>Syncing photo labels…</p>
        ) : null}

        {slots.map((slot) => {
          const key = captureKey(slot);
          const cap = captures[key];
          const slotType = getSlotType(slot);
          const frameStyle = cap?.dataUrl
            ? { backgroundImage: `url(${cap.dataUrl})` }
            : undefined;
          return (
            <div
              key={key}
              className="hlp-slot"
              data-strut-photo-id={slot.Id > 0 ? String(slot.Id) : ''}
              data-strut-photo-short-name={slot.ShortName}
              data-strut-photo-name={slot.Name}
            >
              <h2 className="hlp-slot-title">{displayTitle(slot)}</h2>
              <p className="strut-hlp__hint">{hintForSlot(slot)}</p>
              <div className="strut-hlp__row">
                <div
                  className={`hlp-frame${cap?.dataUrl ? ' has-image' : ''}`}
                  style={frameStyle}
                  role="img"
                  aria-label={cap?.dataUrl ? `${displayTitle(slot)} preview` : `No ${displayTitle(slot)} yet`}
                >
                  {!cap?.dataUrl && <HairSilhouette type={slotType} />}
                </div>
                <div className="strut-hlp__actions">
                  <button
                    type="button"
                    className="strut-hlp__btn-action"
                    onClick={() => fileInputsRef.current[key]?.click()}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload
                  </button>
                  <button
                    type="button"
                    className="strut-hlp__btn-action"
                    onClick={() => openCamera(slot)}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                    Take picture
                  </button>
                  <input
                    ref={(el) => { fileInputsRef.current[key] = el; }}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    capture="environment"
                    style={{ display: 'none' }}
                    data-strut-photo-slot={slot.ShortName}
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      void onFilePicked(slot, f);
                      e.target.value = '';
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {error ? <div className="strut-hlp__error" role="alert">{error}</div> : null}

        <p className="strut-hlp__hint" style={{ marginTop: 20 }}>
          All information you share with your provider is stored on our HIPAA-compliant platform.
        </p>

        <div className="strut-hlp__continue">
          <button
            type="button"
            className="strut-hlp__btn"
            disabled={!allComplete}
            onClick={submit}
          >
            Continue
          </button>
        </div>
      </div>

      {camSlot ? (
        <div className="strut-hlp__cam" role="dialog" aria-modal="true" aria-label="Camera">
          <div className="strut-hlp__cam-panel">
            <video ref={videoRef} className="strut-hlp__cam-video" playsInline muted />
            <div className="strut-hlp__cam-bar">
              <button type="button" className="strut-hlp__btn" onClick={stopCamera}>Cancel</button>
              <button type="button" className="strut-hlp__btn" onClick={() => void captureFromCamera()}>
                Capture photo
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const propSchema = {};

export const outputSchema = {
  captures: { type: 'object', title: 'Hairline captures keyed by photo Id' },
};