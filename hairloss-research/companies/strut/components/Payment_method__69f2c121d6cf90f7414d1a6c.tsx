import React, { useCallback, useEffect, useRef, useState } from 'react';

type AuthnetEnvironment = 'SANDBOX' | 'PRODUCTION';

type Props = {
  authnetApiLoginId: string;
  authnetClientKey: string;
  onChange?: (out: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    strut_env?: string;
    Accept?: {
      dispatchData: (
        payload: {
          authData: { apiLoginID: string; clientKey: string };
          cardData: {
            cardNumber: string;
            month: string;
            year: string;
            cardCode: string;
            fullName: string;
          };
        },
        callback: (response: {
          messages?: { resultCode?: string; message?: Array<{ code?: string; text?: string }> };
          opaqueData?: { dataDescriptor: string; dataValue: string };
        }) => void
      ) => void;
    };
  }
}

const AUTHNET_SCRIPT: Record<AuthnetEnvironment, string> = {
  SANDBOX:    'https://jstest.authorize.net/v1/Accept.js',
  PRODUCTION: 'https://js.authorize.net/v1/Accept.js',
};

function resolveEnv(): AuthnetEnvironment {
  return window.strut_env === 'staging' ? 'SANDBOX' : 'PRODUCTION';
}

export default function StrutPayment({
  authnetApiLoginId,
  authnetClientKey,
  onChange,
}: Props) {
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const scriptReady = useRef(false);
  const env = resolveEnv();

  // Inject Accept.js once
  useEffect(() => {
    if (scriptReady.current) return;
    const marker = `script[data-acceptjs="${env}"]`;
    if (document.querySelector(marker)) { scriptReady.current = true; return; }
    const el = document.createElement('script');
    el.src = AUTHNET_SCRIPT[env];
    el.charset = 'utf-8';
    el.setAttribute('data-acceptjs', env);
    el.onload = () => { scriptReady.current = true; };
    document.head.appendChild(el);
  }, [env]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!window.Accept) {
        setError('Payment library not ready — please wait a moment and try again.');
        return;
      }

      setLoading(true);

      const [expMonth, expYearRaw] = expiry.replace(/\s/g, '').split('/');
      const expYear = expYearRaw?.length === 2 ? '20' + expYearRaw : (expYearRaw ?? '');

      window.Accept.dispatchData(
        {
          authData: { apiLoginID: authnetApiLoginId, clientKey: authnetClientKey },
          cardData: {
            cardNumber: cardNumber.replace(/\s/g, ''),
            month:      expMonth ?? '',
            year:       expYear,
            cardCode:   cvv,
            fullName:   cardholderName,
          },
        },
        (response) => {
          setLoading(false);

          if (!response.opaqueData?.dataDescriptor || !response.opaqueData?.dataValue) {
            const msg = response.messages?.message?.[0]?.text ?? 'Card tokenization failed. Please check your details.';
            setError(msg);
            return;
          }

          const { dataDescriptor, dataValue } = response.opaqueData;
          setSuccess(true);
          onChange?.({ dataDescriptor, dataValue });
        }
      );
    },
    [authnetApiLoginId, authnetClientKey, cardholderName, cardNumber, expiry, cvv, onChange]
  );

  /* ─── styles ────────────────────────────────────────────────────────── */

  const fieldStyle: React.CSSProperties = {
    display: 'block', width: '100%', boxSizing: 'border-box',
    padding: '10px 12px', marginTop: 4, marginBottom: 12,
    border: '1px solid #d1d5db', borderRadius: 6, fontSize: 15,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 500, color: '#374151',
  };

  /* ─── success state ─────────────────────────────────────────────────── */

  if (success) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: 32, fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
        <p style={{ fontSize: 20, fontWeight: 600, color: '#166534' }}>Order placed!</p>
        <p style={{ color: '#555' }}>Your order has been submitted successfully.</p>
      </div>
    );
  }

  /* ─── render ────────────────────────────────────────────────────────── */

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <form onSubmit={handleSubmit} noValidate>
        <label style={labelStyle}>Cardholder name</label>
        <input
          style={fieldStyle}
          type="text"
          autoComplete="cc-name"
          placeholder="Full name on card"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          required
        />

        <label style={labelStyle}>Card number</label>
        <input
          style={fieldStyle}
          type="text"
          autoComplete="cc-number"
          inputMode="numeric"
          maxLength={19}
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) =>
            setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())
          }
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Expiry (MM/YY)</label>
            <input
              style={fieldStyle}
              type="text"
              autoComplete="cc-exp"
              maxLength={5}
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => {
                const v = e.target.value.replace(/[^\d/]/g, '');
                setExpiry(v.length === 2 && !v.includes('/') ? v + '/' : v);
              }}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>CVV</label>
            <input
              style={fieldStyle}
              type="text"
              autoComplete="cc-csc"
              inputMode="numeric"
              maxLength={4}
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
        </div>

        {error ? <p style={{ color: '#b91c1c', fontSize: 14, marginBottom: 12 }}>{error}</p> : null}

        <button
          type="submit"
          disabled={loading || !cardholderName || !cardNumber || !expiry || !cvv}
          style={{
            width: '100%', padding: '12px 16px',
            background: loading ? '#9ca3af' : '#111827',
            color: '#fff', border: 'none', borderRadius: 6,
            fontSize: 15, fontWeight: 600,
            cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? 'Processing…' : 'Pay & place order'}
        </button>

        <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 12, marginBottom: 0 }}>
          Card secured by Authorize.net. Card details are never sent to our servers.
        </p>
      </form>
    </div>
  );
}

export const propSchema = {
  authnetApiLoginId: {
    type: 'string' as const,
    title: 'Authorize.net API Login ID',
    defaultValue: '3xC2RLn77Pw',
  },
  authnetClientKey: {
    type: 'string' as const,
    title: 'Authorize.net Client Key (public)',
    defaultValue: '8Jt9kKmR687h62gruNt4B56737z242g66rfAFrUauAPthQsC5S339ZdLq2AaGE5K',
  },

};

export const outputSchema = {
  dataDescriptor: { type: 'string' as const, title: 'Authorize.net opaque data descriptor' },
  dataValue:      { type: 'string' as const, title: 'Authorize.net opaque data value' },
};
