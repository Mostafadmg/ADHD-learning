import React, { useCallback, useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    strut: {
      loginWithPassword: (email: string, password: string) => Promise<{ isVerifyAccount?: boolean; accessUser?: unknown }>;
      signup: (email: string, phone: string) => Promise<{ Id?: number; Email?: string }>;
      getCurrentVisiting: () => Promise<unknown>;
      hasPasswordAndBirthday: (email: string) => Promise<{ HasPassword: boolean; HasBirthDate: boolean }>;
      getAccessUser: () => { Id?: number; Email?: string; UserName?: string; IsVerifyAccount?: boolean } | null;
    };
    google?: { accounts?: { id?: { initialize: (opts: unknown) => void; renderButton: (el: HTMLElement | null, opts: unknown) => void } } };
  }
}

type Props = {
  onChange?: (out: Record<string, unknown>) => void;
};

export default function StrutAuth({ onChange }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const googleScriptLoaded = useRef(false);

  const emitSuccess = useCallback(
    async (userEmail: string) => {
      await window.strut.getCurrentVisiting();
      const gate = await window.strut.hasPasswordAndBirthday(userEmail);
      const user = window.strut.getAccessUser();
      onChange?.({
        authenticated: true,
        userId:        user?.Id ?? 0,
        email:         user?.Email ?? user?.UserName ?? userEmail,
        needsDob:      !gate.HasBirthDate,
        needsPassword: !gate.HasPassword,
      });
    },
    [onChange]
  );

  const handleLogin = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await window.strut.loginWithPassword(email, password);
      if (res.isVerifyAccount && res.accessUser) {
        await emitSuccess(email);
      } else {
        setError('Account not verified or invalid credentials.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }, [email, password, emitSuccess]);

  const handleSignUp = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const user = await window.strut.signup(email, phone);
      await emitSuccess(user.Email ?? email);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }, [email, phone, emitSuccess]);

  // Check on mount — if already authenticated, emit success immediately without showing the drawer
  useEffect(() => {
    const user = window.strut?.getAccessUser();
    if (user?.IsVerifyAccount) {
      emitSuccess(user.Email ?? user.UserName ?? '');
    } else {
      setVisible(true);
    }
  }, [emitSuccess]);

  const handleGoogleSuccess = useCallback(
    async (response: { credential?: string }) => {
      if (!response.credential) return;
      try {
        const parts = response.credential.split('.');
        if (parts.length !== 3) return;
        const payload = JSON.parse(atob(parts[1]));
        await emitSuccess(payload.email);
      } catch {
        setError('Failed to process Google sign-in');
      }
    },
    [emitSuccess]
  );

  useEffect(() => {
    if (googleScriptLoaded.current) return;
    googleScriptLoaded.current = true;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google?.accounts?.id?.initialize({
        client_id: '715856156943-niaq1c46ni6gmqispbtafl4iu3mjsamq.apps.googleusercontent.com',
        callback: handleGoogleSuccess,
      });
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, [handleGoogleSuccess]);

  const isValid = mode === 'login' ? !!(email && password) : !!(email && phone);

  /* ─── styles ───────────────────────────────────────────────────────── */

  const backdrop: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999,
  };

  const drawer: React.CSSProperties = {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.12)',
    zIndex: 1000, maxHeight: '90vh', overflowY: 'auto',
  };

  const container: React.CSSProperties = {
    maxWidth: 420, margin: '0 auto', padding: '40px 28px 48px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const heading: React.CSSProperties = {
    fontSize: 32, fontWeight: 700, color: '#111827',
    margin: '0 0 8px 0', letterSpacing: '-0.6px', lineHeight: 1.2,
  };

  const subheading: React.CSSProperties = {
    fontSize: 15, fontWeight: 400, color: '#6b7280',
    margin: '0 0 28px 0', lineHeight: 1.5,
  };

  const label: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 600, color: '#374151',
    marginBottom: 8, marginTop: 20, textTransform: 'uppercase', letterSpacing: '0.5px',
  };

  const getInputStyle = (fieldName: string): React.CSSProperties => ({
    width: '100%', boxSizing: 'border-box', padding: '12px 14px', fontSize: 15,
    border: '1.5px solid',
    borderColor:     focusedField === fieldName ? '#3b82f6' : '#e5e7eb',
    borderRadius: 10, fontFamily: 'inherit', transition: 'all 0.2s ease', outline: 'none',
    backgroundColor: focusedField === fieldName ? '#f0f9ff' : '#ffffff',
    boxShadow:       focusedField === fieldName ? '0 0 0 4px rgba(59, 130, 246, 0.08)' : 'none',
  });

  const button: React.CSSProperties = {
    marginTop: 28, padding: '14px 16px', width: '100%',
    fontSize: 16, fontWeight: 700,
    backgroundColor: isValid ? '#3b82f6' : '#d1d5db',
    color: '#ffffff', border: 'none', borderRadius: 10,
    cursor: loading || !isValid ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease', opacity: loading || !isValid ? 0.7 : 1,
  };

  const googleButton: React.CSSProperties = {
    width: '100%', padding: '12px 16px', fontSize: 15, fontWeight: 600,
    backgroundColor: '#ffffff', color: '#374151', border: '1.5px solid #e5e7eb',
    borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s ease',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginBottom: 24,
  };

  const divider: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 12,
    margin: '24px 0', fontSize: 13, color: '#9ca3af',
  };

  const dividerLine: React.CSSProperties = { flex: 1, height: '1px', backgroundColor: '#e5e7eb' };

  const toggleLink: React.CSSProperties = {
    marginTop: 20, textAlign: 'center', fontSize: 14, color: '#6b7280', lineHeight: 1.6,
  };

  const link: React.CSSProperties = {
    color: '#3b82f6', textDecoration: 'none', fontWeight: 600, cursor: 'pointer',
    borderBottom: '1.5px solid #3b82f6', transition: 'all 0.2s ease', paddingBottom: 2,
  };

  const errorBox: React.CSSProperties = {
    backgroundColor: '#fef2f2', border: '1.5px solid #fecaca', color: '#7f1d1d',
    padding: 14, borderRadius: 10, fontSize: 14, marginBottom: 24,
    fontWeight: 500, lineHeight: 1.5,
  };

  /* ─── render ───────────────────────────────────────────────────────── */

  if (!visible) return null;

  return (
    <>
      <div style={backdrop} />
      <div style={drawer}>
        <div style={container}>
          <h2 style={heading}>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
          <p style={subheading}>
            {mode === 'login' ? 'Sign in to access your account' : 'Join us to get started'}
          </p>

          {error ? <div style={errorBox}>{error}</div> : null}

          <button
            type="button"
            style={googleButton}
            onClick={() => {
              window.google?.accounts?.id?.renderButton(
                document.getElementById('google-signin-button'),
                { theme: 'outline', size: 'large', width: '100%' }
              );
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <div style={divider}>
            <div style={dividerLine} />
            <span>or</span>
            <div style={dividerLine} />
          </div>

          <label style={label}>Email</label>
          <input
            style={getInputStyle('email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            autoComplete="email"
            placeholder="you@example.com"
            type="email"
          />

          {mode === 'signup' ? (
            <>
              <label style={label}>Phone</label>
              <input
                style={getInputStyle('phone')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                autoComplete="tel"
                placeholder="(555) 867-5309"
                type="tel"
              />
            </>
          ) : (
            <>
              <label style={label}>Password</label>
              <input
                style={getInputStyle('password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </>
          )}

          <button
            type="button"
            style={button}
            disabled={loading || !isValid}
            onClick={mode === 'login' ? handleLogin : handleSignUp}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>

          <div style={toggleLink}>
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <a style={link} onClick={() => { setError(null); setMode('signup'); }}>Create one</a>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <a style={link} onClick={() => { setError(null); setMode('login'); }}>Sign in</a>
              </>
            )}
          </div>
        </div>
      </div>
      <div id="google-signin-button" style={{ display: 'none' }} />
    </>
  );
}

export const propSchema = {};

export const outputSchema = {
  authenticated:  { type: 'boolean' as const, title: 'Authenticated' },
  userId:         { type: 'number' as const,  title: 'User id' },
  email:          { type: 'string' as const,  title: 'Email' },
  needsDob:       { type: 'boolean' as const, title: 'DOB step required' },
  needsPassword:  { type: 'boolean' as const, title: 'Password step required' },
};
