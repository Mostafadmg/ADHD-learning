import React, { useCallback, useEffect, useRef, useState } from 'react';

/*
 * Strut Lab Upload
 * ----------------
 * Custom react-block replacement for the built-in "Upload Recent Labs" file-upload
 * step. Clones the file-upload UX (drag & drop, file list, progress, remove) but:
 *   1. Each selected file is staged to Strut:  PUT  {ENV.api}/media/UploadFiles
 *      (multipart FormData, field "file")  ->  { FileName, NameGUID }.
 *   2. On Continue we EMIT the staged files as `uploadRecentLabFiles`
 *      ([{FileName, NameGUID, FileType}]) and advance. The files are submitted to
 *      Strut at the END of the flow by the Finalize step via FinishOrderV2 — this
 *      step no longer POSTs the old per-step lab-upload endpoint.
 *
 * The footer nav is hidden (config.hideNavigationButton) and we render our own
 * Continue button. Every <button> is type="button" so it never submits the
 * runner's wrapping <form>.
 */

type StrutSdk = {
  ENV?: { api?: string };
  getToken?: () => string | null;
  getOrderId?: () => number | string | null;
  getCurrentVisiting?: () => Promise<any>;
};

type Props = {
  brandColor?: string;
  textColor?: string;
  mutedColor?: string;
  borderColor?: string;
  surfaceColor?: string;
  errorColor?: string;
  borderRadius?: number;
  ctaText?: string;
  maxFiles?: number;
  maxFileSizeMB?: number;
  multiple?: boolean;
  allowedFormats?: string; // comma-separated extensions, empty = any
  requireAtLeastOne?: boolean;
  onChange?: (out: Record<string, unknown>) => void;
};

type UploadFile = {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  fileName?: string; // server FileName from UploadFiles
  nameGUID?: string; // server NameGUID from UploadFiles
  fileType?: string; // extension, e.g. "pdf"
  error?: string;
};

function strut(): StrutSdk {
  return ((typeof window !== 'undefined' && (window as any).strut) || {}) as StrutSdk;
}
function apiBase(): string {
  const b = strut().ENV?.api || 'https://checkout-api.strut-test.com/api';
  return b.replace(/\/$/, '');
}
function extOf(name: string): string {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i + 1).toLowerCase() : '';
}
function formatBytes(bytes: number): string {
  if (!bytes) return '';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function StrutLabUpload({
  brandColor = '#161336',
  textColor = '#0F1714',
  mutedColor = '#6B7670',
  borderColor = '#D9D4C9',
  surfaceColor = '#FFFFFF',
  errorColor = '#DC2626',
  borderRadius = 12,
  ctaText = 'Continue',
  maxFiles = 5,
  maxFileSizeMB = 10,
  multiple = true,
  allowedFormats = 'pdf,jpg,jpeg,png,heic,webp',
  requireAtLeastOne = false,
  onChange,
}: Props) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const orderRef = useRef<{ orderId: string | number | null; customerId: number | null }>({
    orderId: null,
    customerId: null,
  });

  const allowed = (allowedFormats || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const doneFiles = files.filter((f) => f.status === 'done' && f.nameGUID);
  const isUploading = files.some((f) => f.status === 'uploading');
  const canAddMore = multiple ? files.length < maxFiles : files.length === 0;

  // Resolve the draft Strut order id up-front. The visiting/order was created at
  // the product-selection step (validateVisiting), so getCurrentVisiting can load
  // the draft order (and its OrderId) here. Best-effort — we retry on Continue.
  const resolveOrder = useCallback(async (): Promise<{ orderId: string | number | null; customerId: number | null }> => {
    const s = strut();
    let orderId: string | number | null = null;
    try {
      orderId = s.getOrderId ? s.getOrderId() : null;
    } catch (e) {
      orderId = null;
    }
    let customerId: number | null = orderRef.current.customerId;
    if (!orderId && s.getCurrentVisiting) {
      try {
        const order = await s.getCurrentVisiting();
        orderId = order?.OrderId ?? (s.getOrderId ? s.getOrderId() : null);
        const cid = order?.CustomerId;
        if (cid != null && !Number.isNaN(Number(cid))) customerId = Number(cid);
      } catch (e) {
        // leave orderId null; surfaced on Continue only when files are present
      }
    }
    orderRef.current = { orderId, customerId };
    return orderRef.current;
  }, []);

  useEffect(() => {
    resolveOrder();
  }, [resolveOrder]);

  const uploadOne = useCallback(async (file: File, entryId: string) => {
    const s = strut();
    const token = s.getToken ? s.getToken() : null;
    const form = new FormData();
    form.append('file', file);
    setFiles((prev) => prev.map((f) => (f.id === entryId ? { ...f, progress: 40 } : f)));
    const res = await fetch(`${apiBase()}/media/UploadFiles`, {
      method: 'PUT',
      body: form,
      // NOTE: do NOT set Content-Type — the browser adds the multipart boundary.
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(t || `Upload failed (${res.status})`);
    }
    const data = await res.json().catch(() => ({}));
    return { FileName: data?.FileName || file.name, NameGUID: data?.NameGUID || '' };
  }, []);

  const processFiles = useCallback(
    async (selected: File[]) => {
      setValidationError(null);
      setSubmitError(null);
      const remaining = multiple ? maxFiles - files.length : 1;
      const batch = selected.slice(0, Math.max(0, remaining));

      for (const file of batch) {
        if (file.size > maxFileSizeMB * 1024 * 1024) {
          setValidationError(`Each file must be ${maxFileSizeMB} MB or smaller.`);
          return;
        }
        if (allowed.length && !allowed.includes(extOf(file.name))) {
          setValidationError(`Allowed file types: ${allowed.join(', ')}.`);
          return;
        }
      }

      const entries: UploadFile[] = batch.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading',
        fileType: extOf(file.name),
      }));

      setFiles((prev) => (multiple ? [...prev, ...entries] : entries));

      for (let i = 0; i < batch.length; i++) {
        const file = batch[i];
        const entry = entries[i];
        try {
          const up = await uploadOne(file, entry.id);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? { ...f, progress: 100, status: 'done', fileName: up.FileName, nameGUID: up.NameGUID }
                : f
            )
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Upload failed';
          setFiles((prev) =>
            prev.map((f) => (f.id === entry.id ? { ...f, status: 'error', error: message } : f))
          );
        }
      }
    },
    [allowed, files.length, maxFileSizeMB, maxFiles, multiple, uploadOne]
  );

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list || !list.length) return;
    processFiles(Array.from(list));
    if (inputRef.current) inputRef.current.value = '';
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) processFiles(Array.from(e.dataTransfer.files));
  };

  const removeFile = (id: string) => {
    const target = files.find((f) => f.id === id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
    // Best-effort unstage on the server; ignore failures.
    if (target?.nameGUID) {
      const s = strut();
      const token = s.getToken ? s.getToken() : null;
      fetch(`${apiBase()}/media/DeleteFile?filename=${encodeURIComponent(target.nameGUID)}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }).catch(() => {});
    }
  };

  const handleContinue = useCallback(async () => {
    setSubmitError(null);
    const done = files.filter((f) => f.status === 'done' && f.nameGUID);

    if (requireAtLeastOne && done.length === 0) {
      setValidationError('Please upload at least one lab file to continue.');
      return;
    }

    const advance = (answer: Record<string, unknown>) => {
      onChange?.(answer);
      const flow = (typeof window !== 'undefined' && (window as any).pathwai?.flow) || null;
      if (flow?.next) flow.next(answer);
    };

    // Nothing to submit — just move on (labs are optional on this branch).
    if (done.length === 0) {
      advance({ uploadRecentLabFiles: [], submitted: false });
      return;
    }

    // Files are already staged via Media/UploadFiles (each yielding a NameGUID).
    // We no longer POST Checkout/UploadRecentLabs here — the file list is emitted
    // and submitted to Strut at the END of the flow through FinishOrderV2.
    const uploadRecentLabFiles = done.map((f) => ({
      FileName: f.fileName || f.name,
      NameGUID: f.nameGUID,
      FileType: f.fileType || extOf(f.name),
    }));

    advance({ uploadRecentLabFiles, submitted: true });
  }, [files, onChange, requireAtLeastOne]);

  const formatHint = allowed.length ? allowed.join(', ') : null;
  const continueDisabled = isUploading || submitting;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'inherit' }}>
      {canAddMore && !isUploading && (
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
          }}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '32px 16px',
            border: `2px dashed ${isDragging ? brandColor : borderColor}`,
            borderRadius,
            background: isDragging ? `${brandColor}0D` : surfaceColor,
            cursor: 'pointer',
            transition: 'border-color .15s, background .15s',
            textAlign: 'center',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={mutedColor} strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div style={{ fontSize: 14, fontWeight: 600, color: textColor }}>
            Drag &amp; drop {multiple ? 'files' : 'a file'} here, or{' '}
            <span style={{ color: brandColor, textDecoration: 'underline' }}>browse</span>
          </div>
          {formatHint && <div style={{ fontSize: 12, color: mutedColor }}>Formats: {formatHint}</div>}
          <div style={{ fontSize: 12, color: mutedColor }}>
            Max {maxFileSizeMB} MB per file{multiple ? ` · Up to ${maxFiles} files` : ''}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={allowed.length ? allowed.map((e) => `.${e}`).join(',') : undefined}
            multiple={multiple}
            onChange={onInput}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {files.map((file) => (
            <div
              key={file.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                border: `1px solid ${borderColor}`,
                borderRadius: Math.max(6, borderRadius - 4),
                background: surfaceColor,
              }}
            >
              <StatusIcon status={file.status} brandColor={brandColor} errorColor={errorColor} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: textColor,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {file.name}
                </div>
                {file.size > 0 && file.status !== 'error' && (
                  <div style={{ fontSize: 12, color: mutedColor }}>{formatBytes(file.size)}</div>
                )}
                {file.status === 'uploading' && (
                  <div style={{ marginTop: 6, height: 6, width: '100%', borderRadius: 999, background: `${borderColor}` }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${file.progress}%`,
                        borderRadius: 999,
                        background: brandColor,
                        transition: 'width .3s',
                      }}
                    />
                  </div>
                )}
                {file.status === 'error' && (
                  <div style={{ fontSize: 12, color: errorColor }}>{file.error}</div>
                )}
              </div>
              {file.status !== 'uploading' && (
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  aria-label={`Remove ${file.name}`}
                  style={{
                    flexShrink: 0,
                    display: 'inline-flex',
                    padding: 4,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: mutedColor,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {validationError && <div style={{ fontSize: 13, color: errorColor }}>{validationError}</div>}
      {submitError && <div style={{ fontSize: 13, color: errorColor }}>{submitError}</div>}

      <button
        type="button"
        onClick={handleContinue}
        disabled={continueDisabled}
        style={{
          marginTop: 4,
          width: '100%',
          padding: '15px 20px',
          fontSize: 16,
          fontWeight: 700,
          color: '#FFFFFF',
          background: brandColor,
          border: 'none',
          borderRadius,
          cursor: continueDisabled ? 'not-allowed' : 'pointer',
          opacity: continueDisabled ? 0.6 : 1,
          transition: 'opacity .15s',
        }}
      >
        {submitting ? 'Saving…' : isUploading ? 'Uploading…' : ctaText}
      </button>
    </div>
  );
}

function StatusIcon({
  status,
  brandColor,
  errorColor,
}: {
  status: UploadFile['status'];
  brandColor: string;
  errorColor: string;
}) {
  if (status === 'error') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={errorColor} strokeWidth={2} style={{ flexShrink: 0 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    );
  }
  if (status === 'done') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F8A4C" strokeWidth={2} style={{ flexShrink: 0 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" stroke={`${brandColor}33`} strokeWidth="4" fill="none" />
      <path d="M4 12a8 8 0 018-8" stroke={brandColor} strokeWidth="4" fill="none" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

export const propSchema = {
  brandColor: { type: 'color', title: 'Brand Color', defaultValue: '#161336' },
  textColor: { type: 'color', title: 'Text Color', defaultValue: '#0F1714' },
  mutedColor: { type: 'color', title: 'Text Color (Muted)', defaultValue: '#6B7670' },
  borderColor: { type: 'color', title: 'Border Color', defaultValue: '#D9D4C9' },
  surfaceColor: { type: 'color', title: 'Card Background', defaultValue: '#FFFFFF' },
  errorColor: { type: 'color', title: 'Error Color', defaultValue: '#DC2626' },
  borderRadius: { type: 'number', title: 'Border Radius', defaultValue: 12, min: 0, max: 32, step: 1 },
  ctaText: { type: 'string', title: 'Continue Button Text', defaultValue: 'Continue' },
  maxFiles: { type: 'number', title: 'Max Files', defaultValue: 5, min: 1, max: 20, step: 1 },
  maxFileSizeMB: { type: 'number', title: 'Max File Size (MB)', defaultValue: 10, min: 1, max: 100, step: 1 },
  multiple: { type: 'boolean', title: 'Allow Multiple Files', defaultValue: true },
  allowedFormats: {
    type: 'string',
    title: 'Allowed Formats (comma-separated, empty = any)',
    defaultValue: 'pdf,jpg,jpeg,png,heic,webp',
  },
  requireAtLeastOne: { type: 'boolean', title: 'Require At Least One File', defaultValue: false },
};

export const outputSchema = {
  uploadRecentLabFiles: { type: 'array' as const, title: 'Uploaded lab files', description: 'Staged files [{FileName, NameGUID, FileType}] — sent to Strut via FinishOrderV2 at the end of the flow' },
  submitted: { type: 'boolean' as const, title: 'Labs submitted' },
};
