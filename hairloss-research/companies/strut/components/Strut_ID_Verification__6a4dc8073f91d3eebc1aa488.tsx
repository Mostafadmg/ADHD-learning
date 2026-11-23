import React, { useCallback, useEffect, useRef, useState } from 'react';

/*
 * Strut ID Verification
 * ---------------------
 * Custom react-block replacement for the built-in "id-verification" step. Runs
 * the Persona embedded flow directly (so we get the inquiry `fields`, which the
 * built-in renderer discards), maps them to Strut's PersonaModel, and posts to
 *   POST {ENV.api}/checkout/SaveVerifybyPersonaInfo  (JSON, Bearer)
 * on completion — then advances the flow. Mirrors strut-checkout's embedded
 * photo-upload verify(): ReferenceId = order.CustomerId, hyphenated field keys,
 * current-government-id.value JSON-stringified.
 *
 * Routing does not use Persona's raw status. We store our own flag and advance
 * on that: route "selfie" opens the photo card, route "summary" opens checkout.
 * Persona "completed" and "approved" are a pass. Anything else is "selfie".
 *
 * This step runs AFTER auth, so the Strut token + customer id are available.
 * Footer nav is hidden; we self-advance. All <button>s are type="button".
 */

const PERSONA_SDK_URL = 'https://cdn.withpersona.com/dist/persona-v5.0.0.js';
const PERSONA_SDK_ID = 'persona-sdk';

function strut() {
  return ((typeof window !== 'undefined' && window.strut) || {});
}
function apiBase() {
  const b = (strut().ENV && strut().ENV.api) || 'https://checkout-api.strut-test.com/api';
  return b.replace(/\/$/, '');
}

function loadPersonaSDK() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no window'));
    if (window.Persona) return resolve();
    const existing = document.getElementById(PERSONA_SDK_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Persona')));
      return;
    }
    const s = document.createElement('script');
    s.id = PERSONA_SDK_ID;
    s.src = PERSONA_SDK_URL;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Persona'));
    document.head.appendChild(s);
  });
}

/* Persona onComplete returns fields keyed like "address-city" -> { type, value }.
   Be defensive about hyphen/underscore key variants and missing fields. */
function fieldOf(fields, key) {
  const f = fields || {};
  const v = f[key] || f[key.replace(/-/g, '_')] || {};
  return { type: v.type != null ? String(v.type) : '', value: v.value };
}
function strValue(v) {
  if (v == null) return '';
  if (typeof v === 'object') { try { return JSON.stringify(v); } catch (e) { return ''; } }
  return String(v);
}

/* Resolve a prefill value: prefer an explicit, resolved prop (a non-empty string
   that is NOT an unresolved {{...}} template); otherwise use the live profile
   fallback. Lets operators override per-field in the builder while still
   auto-filling from user.profile for repeat customers. */
function pick(propVal, fallback) {
  if (propVal != null && typeof propVal === 'string') {
    const t = propVal.trim();
    if (t && !/\{\{[^}]*\}\}/.test(t)) return t;
  } else if (typeof propVal === 'number') {
    return String(propVal);
  }
  return fallback != null && String(fallback).trim() ? String(fallback).trim() : undefined;
}
function normalizePhone(v) {
  if (!v) return undefined;
  const s = String(v);
  return s.startsWith('+') ? s : ('+1' + s.replace(/[^0-9]/g, ''));
}

export default function StrutIdVerification({
  templateId = 'itmpl_QPBfFdfmLGm2itLsWEkeWGgJ',
  environment = 'sandbox',
  subject = 'person_v1',
  brandColor = '#161336',
  textColor = '#0F1714',
  mutedColor = '#6B7670',
  ctaText = 'Start Identity Verification',
  // ===== Persona prefill (passed to the inquiry so repeat, already-verified
  // customers aren't asked to verify again). Each defaults to a user.profile
  // token; if it doesn't resolve, the component falls back to the live profile.
  prefillNameFirst = '{{user.profile.firstName}}',
  prefillNameLast = '{{user.profile.lastName}}',
  prefillNameMiddle = '',
  prefillBirthdate = '{{user.profile.dob}}',
  prefillEmailAddress = '{{user.profile.email}}',
  prefillPhoneNumber = '{{user.profile.phone}}',
  prefillAddressStreet1 = '{{user.profile.address.street}}',
  prefillAddressStreet2 = '{{user.profile.address.street2}}',
  prefillAddressCity = '{{user.profile.address.city}}',
  prefillAddressSubdivision = '{{user.profile.address.state}}',
  prefillAddressPostalCode = '{{user.profile.address.zip}}',
  prefillAddressCountryCode = '{{user.profile.address.country}}',
  onChange,
}) {
  const [status, setStatus] = useState('idle'); // idle|starting|verifying|saving|completed|failed|error
  const [error, setError] = useState(null);
  const [sdkReady, setSdkReady] = useState(false);
  const customerIdRef = useRef(null);
  const profileRef = useRef({});
  const advancedRef = useRef(false);

  useEffect(() => {
    loadPersonaSDK()
      .then(() => setSdkReady(true))
      .catch(() => setError('Could not load the verification service. Please refresh and try again.'));
  }, []);

  const resolveCustomerId = useCallback(async () => {
    const s = strut();
    const fromOrder = (order) => {
      const cid = order && order.CustomerId;
      if (cid != null && !Number.isNaN(Number(cid)) && Number(cid) > 0) {
        customerIdRef.current = Number(cid);
        return customerIdRef.current;
      }
      return null;
    };
    try {
      if (s.getOrder) {
        const cached = fromOrder(s.getOrder());
        if (cached) return cached;
      }
    } catch (e) { /* ignore */ }
    try {
      if (s.getCurrentVisiting) {
        const order = await s.getCurrentVisiting();
        const cid = fromOrder(order);
        if (cid) return cid;
      }
    } catch (e) { /* ignore */ }
    return customerIdRef.current;
  }, []);

  // Resolve the Strut customer id (ReferenceId) + profile prefill. This step is
  // post-auth, so getCurrentVisiting loads the order (with CustomerId).
  useEffect(() => {
    (async () => {
      try {
        const profile = (window.pathwai && window.pathwai.user && window.pathwai.user.getUser && window.pathwai.user.getUser().profile) || {};
        profileRef.current = profile || {};
      } catch (e) { /* ignore */ }
      await resolveCustomerId();
    })();
  }, [resolveCustomerId]);

  const advance = useCallback(() => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    // onChange writes the step output first. next() with no argument lets Logic
    // read that stored route. Passing the answer object made the compare miss.
    setTimeout(() => {
      const flow = (typeof window !== 'undefined' && window.pathwai && window.pathwai.flow) || null;
      if (flow && flow.next) flow.next();
    }, 0);
  }, []);

  const buildPayload = useCallback((inquiryId, personaStatus, fields) => {
    const g = (k) => fieldOf(fields, k);
    // Sandbox / returning inquiries often omit name fields even when verified.
    // Fall back to PathwAI profile so admin "(Persona: First Last)" is not blank.
    const profile = profileRef.current || {};
    const nameFirst = strValue(g('name-first').value) || String(profile.firstName || '').trim();
    const nameLast = strValue(g('name-last').value) || String(profile.lastName || '').trim();
    const nameMiddle = strValue(g('name-middle').value) || String(profile.middleName || '').trim();
    return {
      InquiryId: inquiryId || '',
      ReferenceId: Number(customerIdRef.current) || 0,
      Status: personaStatus || '',
      Subject: subject || '',
      AddressCityType: g('address-city').type,
      AddressCityValue: strValue(g('address-city').value),
      AddressCountryCodeType: g('address-country-code').type,
      AddressCountryCodeValue: strValue(g('address-country-code').value),
      AddressPostalCodeType: g('address-postal-code').type,
      AddressPostalCodeValue: strValue(g('address-postal-code').value),
      AddressStreet1Type: g('address-street-1').type,
      AddressStreet1Value: strValue(g('address-street-1').value),
      AddressStreet2Type: g('address-street-2').type,
      AddressStreet2Value: strValue(g('address-street-2').value),
      AddressSubdivisionType: g('address-subdivision').type,
      AddressSubdivisionValue: strValue(g('address-subdivision').value),
      BirthdateType: g('birthdate').type,
      BirthdateValue: strValue(g('birthdate').value),
      CurrentGovernmentIdType: g('current-government-id').type,
      CurrentGovernmentIdValue: strValue(g('current-government-id').value),
      CurrentSelfieType: g('current-selfie').type,
      CurrentSelfieValue: strValue(g('current-selfie').value),
      EmailAddressType: g('email-address').type,
      EmailAddressValue: strValue(g('email-address').value),
      IdentificationClassType: g('identification-class').type,
      IdentificationClassValue: strValue(g('identification-class').value),
      IdentificationNumberType: g('identification-number').type,
      IdentificationNumberValue: strValue(g('identification-number').value),
      NameFirstType: g('name-first').type || (nameFirst ? 'string' : ''),
      NameFirstValue: nameFirst,
      NameLastType: g('name-last').type || (nameLast ? 'string' : ''),
      NameLastValue: nameLast,
      NameMiddleType: g('name-middle').type || (nameMiddle ? 'string' : ''),
      NameMiddleValue: nameMiddle,
      PhoneNumberType: g('phone-number').type,
      PhoneNumberValue: strValue(g('phone-number').value),
      SelectedCountryCodeType: g('selected-country-code').type,
      SelectedCountryCodeValue: strValue(g('selected-country-code').value),
      SelectedIdClassType: g('selected-id-class').type,
      SelectedIdClassValue: strValue(g('selected-id-class').value),
      SocialSecurityNumberType: g('social-security-number').type,
      SocialSecurityNumberValue: strValue(g('social-security-number').value),
    };
  }, [subject]);

  const saveToStrut = useCallback(async (payload) => {
    const s = strut();
    const token = s.getToken ? s.getToken() : null;
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
    if (token) headers.Authorization = 'Bearer ' + token;
    const res = await fetch(apiBase() + '/checkout/SaveVerifybyPersonaInfo', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      let msg = '';
      try { msg = t ? (JSON.parse(t).Message || '') : ''; } catch (e) { msg = ''; }
      throw new Error(msg || ('We could not save your verification (' + res.status + '). Please try again.'));
    }
  }, []);

  const handleComplete = useCallback(async (payloadFromPersona) => {
    const inquiryId = payloadFromPersona && payloadFromPersona.inquiryId;
    const personaStatus = (payloadFromPersona && payloadFromPersona.status) || '';
    const fields = (payloadFromPersona && payloadFromPersona.fields) || {};
    setError(null);
    setStatus('saving');
    try {
      // CustomerId must be set before save — otherwise admin can't find Persona names.
      if (!customerIdRef.current) await resolveCustomerId();
      const rawStatus = String(personaStatus || '').trim();
      const passed = /^(completed|approved)$/i.test(rawStatus);
      const routeStatus = passed ? 'completed' : 'failed';
      const route = passed ? 'summary' : 'selfie';
      const payload = buildPayload(inquiryId, routeStatus, fields);
      await saveToStrut(payload);
      const g = (k) => fieldOf(fields, k);
      const profile = profileRef.current || {};
      const answer = {
        inquiryId: inquiryId || '',
        status: routeStatus,
        verified: passed,
        route,
        nameFirst: strValue(g('name-first').value) || String(profile.firstName || '').trim(),
        nameLast: strValue(g('name-last').value) || String(profile.lastName || '').trim(),
      };
      try {
        localStorage.setItem('strut.persona.status', routeStatus);
        localStorage.setItem('strut.persona.route', route);
      } catch (e) { /* ignore */ }
      try {
        console.log('[strut-id] stored route', { personaStatus: rawStatus, status: routeStatus, route });
      } catch (e) { /* ignore */ }
      onChange && onChange(answer);
      setStatus(routeStatus);
      advance();
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    }
  }, [advance, buildPayload, onChange, resolveCustomerId, saveToStrut]);

  const startVerification = useCallback(() => {
    if (!sdkReady || !window.Persona) {
      setError('Verification service is not ready. Please wait a moment and try again.');
      return;
    }
    if (!templateId) {
      setError('This step is not configured correctly. Please contact support.');
      return;
    }
    setStatus('starting');
    setError(null);

    // Prefill Persona: exposed props first, live profile as fallback. Only
    // include keys that actually have a value.
    const p = profileRef.current || {};
    const addr = (p.address || {});
    const prefillRaw = {
      nameFirst: pick(prefillNameFirst, p.firstName),
      nameLast: pick(prefillNameLast, p.lastName),
      nameMiddle: pick(prefillNameMiddle, p.middleName),
      birthdate: pick(prefillBirthdate, p.dob || p.dateOfBirth || p.birthdate),
      emailAddress: pick(prefillEmailAddress, p.email),
      phoneNumber: normalizePhone(pick(prefillPhoneNumber, p.phone)),
      addressStreet1: pick(prefillAddressStreet1, addr.street),
      addressStreet2: pick(prefillAddressStreet2, addr.street2),
      addressCity: pick(prefillAddressCity, addr.city),
      addressSubdivision: pick(prefillAddressSubdivision, addr.state),
      addressPostalCode: pick(prefillAddressPostalCode, addr.zip),
      addressCountryCode: pick(prefillAddressCountryCode, addr.country) || 'US',
    };
    const prefill = {};
    Object.keys(prefillRaw).forEach((k) => { if (prefillRaw[k]) prefill[k] = prefillRaw[k]; });

    try {
      const client = new window.Persona.Client({
        templateId,
        environment: environment || 'sandbox',
        // referenceId ties the inquiry to the Strut customer so Persona can
        // recognize a returning, already-verified individual (skip re-verifying).
        referenceId: customerIdRef.current != null ? String(customerIdRef.current) : undefined,
        fields: prefill,
        onReady: () => client.open(),
        onComplete: (payload) => handleComplete(payload),
        onCancel: () => setStatus('idle'),
        onError: () => {
          setStatus('error');
          setError('An error occurred during verification. Please try again.');
        },
      });
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Failed to start verification.');
    }
  }, [
    environment, handleComplete, sdkReady, templateId,
    prefillNameFirst, prefillNameLast, prefillNameMiddle, prefillBirthdate,
    prefillEmailAddress, prefillPhoneNumber, prefillAddressStreet1, prefillAddressStreet2,
    prefillAddressCity, prefillAddressSubdivision, prefillAddressPostalCode, prefillAddressCountryCode,
  ]);

  const wrap = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
    padding: '16px 0', fontFamily: 'inherit', textAlign: 'center',
  };
  const btn = (disabled) => ({
    width: '100%', maxWidth: 320, padding: '15px 20px', fontSize: 16, fontWeight: 700,
    color: '#FFFFFF', background: brandColor, border: 'none', borderRadius: 12,
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
  });

  const busy = status === 'starting' || status === 'verifying' || status === 'saving';

  if (status === 'completed') {
    return (
      <div style={wrap}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ECFDF3', color: '#1F8A4C', padding: '10px 20px', borderRadius: 999, border: '1px solid #C6EFD6' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="8" fill="#22c55e" />
            <path d="M4.5 8.25L7 10.75L11.5 5.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Identity Verified</span>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <button
        type="button"
        onClick={startVerification}
        disabled={busy || !sdkReady}
        style={btn(busy || !sdkReady)}
      >
        {status === 'saving' ? 'Saving…' : status === 'starting' ? 'Opening…' : !sdkReady ? 'Loading…' : ctaText}
      </button>

      {error && <p style={{ color: '#DC2626', fontSize: 14, margin: 0 }}>{error}</p>}

      {status === 'error' && (
        <button
          type="button"
          onClick={startVerification}
          style={{ background: 'transparent', border: 'none', color: mutedColor, fontSize: 13, textDecoration: 'underline', cursor: 'pointer' }}
        >
          Try Again
        </button>
      )}

      <p style={{ fontSize: 12, color: mutedColor, margin: 0 }}>
        Powered by{' '}
        <a href="https://withpersona.com" target="_blank" rel="noopener noreferrer" style={{ color: mutedColor, textDecoration: 'underline' }}>
          Persona
        </a>
      </p>
    </div>
  );
}

export const propSchema = {
  templateId: { type: 'string', title: 'Persona Template ID', defaultValue: 'itmpl_QPBfFdfmLGm2itLsWEkeWGgJ' },
  environment: { type: 'enum', title: 'Persona Environment', options: ['sandbox', 'production'], defaultValue: 'sandbox' },
  subject: { type: 'string', title: 'PersonaModel Subject', defaultValue: 'person_v1' },
  brandColor: { type: 'color', title: 'Brand Color', defaultValue: '#161336' },
  textColor: { type: 'color', title: 'Text Color', defaultValue: '#0F1714' },
  mutedColor: { type: 'color', title: 'Text Color (Muted)', defaultValue: '#6B7670' },
  ctaText: { type: 'string', title: 'Start Button Text', defaultValue: 'Start Identity Verification' },
  prefillNameFirst: { type: 'string', title: 'Prefill — First Name', defaultValue: '{{user.profile.firstName}}' },
  prefillNameLast: { type: 'string', title: 'Prefill — Last Name', defaultValue: '{{user.profile.lastName}}' },
  prefillNameMiddle: { type: 'string', title: 'Prefill — Middle Name', defaultValue: '' },
  prefillBirthdate: { type: 'string', title: 'Prefill — Birthdate (YYYY-MM-DD)', defaultValue: '{{user.profile.dob}}' },
  prefillEmailAddress: { type: 'string', title: 'Prefill — Email', defaultValue: '{{user.profile.email}}' },
  prefillPhoneNumber: { type: 'string', title: 'Prefill — Phone', defaultValue: '{{user.profile.phone}}' },
  prefillAddressStreet1: { type: 'string', title: 'Prefill — Address Street 1', defaultValue: '{{user.profile.address.street}}' },
  prefillAddressStreet2: { type: 'string', title: 'Prefill — Address Street 2', defaultValue: '{{user.profile.address.street2}}' },
  prefillAddressCity: { type: 'string', title: 'Prefill — City', defaultValue: '{{user.profile.address.city}}' },
  prefillAddressSubdivision: { type: 'string', title: 'Prefill — State/Subdivision', defaultValue: '{{user.profile.address.state}}' },
  prefillAddressPostalCode: { type: 'string', title: 'Prefill — Postal Code', defaultValue: '{{user.profile.address.zip}}' },
  prefillAddressCountryCode: { type: 'string', title: 'Prefill — Country Code', defaultValue: '{{user.profile.address.country}}' },
};

export const outputSchema = {
  inquiryId: { type: 'string', title: 'Persona Inquiry ID' },
  status: { type: 'string', title: 'Persona Status' },
  verified: { type: 'boolean', title: 'Identity Verified' },
  route: { type: 'string', title: 'Persona Route' },
  nameFirst: { type: 'string', title: 'Persona First Name' },
  nameLast: { type: 'string', title: 'Persona Last Name' },
};
