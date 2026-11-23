import React, { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    strut: {
      ENV: { api: string; account?: string; checkout?: string };
      getToken: () => string | null;
      getCurrentVisiting: () => Promise<unknown>;
      createAddress: (address: Record<string, unknown>) => Promise<unknown>;
      getAddresses: () => Promise<Array<{ Id?: number }>>;
      saveShipping: (addressId: number) => Promise<unknown>;
      finishOrderV2: (profiles: { customerProfileId: string; paymentProfileId: string }, opts?: Record<string, unknown>) => Promise<unknown>;
      getOrderId?: () => number | string | null;
    };
    strut_env?: string;
    pathwai?: {
      flow?: { getAnswers: () => Record<string, any>; next: (answer?: unknown) => void };
      user?: { getUser: () => { profile?: Record<string, any> }; getTraits: () => Record<string, any> };
    };
  }
}

// Flow-agnostic sources: identity comes from the visitor profile (Strut Auth
// mergeProfiles email/firstName/lastName) and payment IDs from the payment step's
// answer, scanned by shape so this works in any Strut flow regardless of node ids.
// NOTE: the traits branch below is a forward-compat hook only — nothing currently
// writes authorizeNet{Customer,PaymentMethod}Id (both payment renderers only emit
// the answer), so the answer scan is the live path and must stay correct.
function findPaymentIds(answers: Record<string, unknown>, traits: Record<string, any>) {
  if (traits.authorizeNetCustomerId && traits.authorizeNetPaymentMethodId) {
    return { customerProfileId: traits.authorizeNetCustomerId, paymentProfileId: traits.authorizeNetPaymentMethodId };
  }
  // Scan BOTH answer shapes (see collectAnswerObjects): a standalone payment step
  // stores { customerId, paymentMethodId } flat at answers[nodeId], but a v2 step
  // with an EMBEDDED payment block nests it at answers[nodeId][blockAlias] — which
  // a one-level scan silently missed, stranding the customer after payment with a
  // saved card and no order.
  for (const v of collectAnswerObjects(answers)) {
    if (v.customerId && v.paymentMethodId) {
      return { customerProfileId: v.customerId, paymentProfileId: v.paymentMethodId };
    }
  }
  return {};
}

function findIdentity(answers: Record<string, unknown>, profile: Record<string, any>) {
  let firstName = profile.firstName, lastName = profile.lastName, email = profile.email;
  if (!firstName || !email) {
    for (const v of Object.values(answers)) {
      if (v && typeof v === 'object' && ((v as any).firstName || (v as any).email)) {
        firstName = firstName || (v as any).firstName;
        lastName = lastName || (v as any).lastName;
        email = email || (v as any).email;
      }
    }
  }
  return { firstName, lastName, email };
}

// React-block step answers are nested one level under a block id
// (answers[nodeId][blockId] = { ...outputs }), while built-in steps store the
// output object directly at answers[nodeId]. Collect both shapes so the scans
// below find outputs regardless of step type.
function collectAnswerObjects(answers: Record<string, unknown> | null | undefined) {
  const out: Record<string, any>[] = [];
  for (const v of Object.values(answers || {})) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out.push(v as Record<string, any>);
      for (const inner of Object.values(v as Record<string, unknown>)) {
        if (inner && typeof inner === 'object' && !Array.isArray(inner)) out.push(inner as Record<string, any>);
      }
    }
  }
  return out;
}

// Selected Strut lab panel (Options B/C) — emitted by the Lab Option Selector step.
// Returns null for Option A (upload) / no selection.
function findLabPanel(answers: Record<string, unknown>) {
  for (const o of collectAnswerObjects(answers)) {
    const id = o.labPanelId;
    if (id != null && String(id) !== '' && !Number.isNaN(Number(id))) {
      return {
        labPanelId: Number(id),
        labPanelQuantity: (o.labPanelQuantity != null && String(o.labPanelQuantity) !== '' && !Number.isNaN(Number(o.labPanelQuantity))) ? Number(o.labPanelQuantity) : 1,
        labPanelPrice: (o.labPanelPrice != null && String(o.labPanelPrice) !== '' && !Number.isNaN(Number(o.labPanelPrice))) ? Number(o.labPanelPrice) : undefined,
      };
    }
  }
  return null;
}

// Uploaded recent-lab files (Option A) — emitted by the Strut Lab Upload step.
// Each item is { FileName, NameGUID, FileType } from Media/UploadFiles.
function findUploadedLabFiles(answers: Record<string, unknown>) {
  for (const o of collectAnswerObjects(answers)) {
    if (Array.isArray(o.uploadRecentLabFiles) && o.uploadRecentLabFiles.length) {
      return o.uploadRecentLabFiles
        .filter((f: any) => f && (f.NameGUID || f.FileName))
        .map((f: any) => ({ FileName: f.FileName || '', NameGUID: f.NameGUID || '', FileType: f.FileType || '' }));
    }
  }
  return [];
}

// 2-letter code -> full state name (Strut GetListState matches on Name).
const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado',
  CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky',
  LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia',
  WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

function fullStateName(state: string): string {
  if (!state) return '';
  const up = state.trim().toUpperCase();
  if (STATE_NAMES[up]) return STATE_NAMES[up];
  return state.trim(); // already a full name
}

const PAYMENT_DECLINE_MESSAGE = 'Your card was declined. Please re-enter your card details.';

/** True for SDK status lines like `PUT Visiting/GetCurrentVisiting → 500`. */
function isHttpStatusLine(text: string): boolean {
  return /^[A-Z]+\s+\S+\s*→\s*\d+\s*$/.test(text.trim()) || /→\s*\d+\s*$/.test(text.trim());
}

/**
 * Pull a human-readable error string out of thrown values / API bodies.
 * Strut often returns HTTP 500 with `{ Message: "..." }` (or `error.Message`);
 * the SDK attaches that payload on `err.body` while `err.message` is only the
 * status line — prefer the application message when present.
 */
function extractErrorText(err: unknown): string {
  if (err == null) return '';
  if (typeof err === 'string') return err;
  if (err instanceof Error) {
    const withExtras = err as Error & { body?: unknown };
    const bodyText = withExtras.body != null ? extractErrorText(withExtras.body) : '';
    const msg = err.message || '';
    if (bodyText && (!msg || isHttpStatusLine(msg))) return bodyText;
    return bodyText || msg;
  }
  if (typeof err === 'object') {
    const o = err as Record<string, unknown>;
    const parts: string[] = [];
    for (const key of ['message', 'Message', 'error', 'Error', 'errorMessage', 'ErrorMessage', 'description', 'Description', 'detail', 'Detail', 'reason', 'Reason', 'title', 'Title', 'statusMessage', 'StatusMessage', 'responseCode', 'ResponseCode', 'responseReasonText', 'ResponseReasonText', 'code', 'Code']) {
      if (o[key] != null && typeof o[key] !== 'object' && String(o[key]).trim()) parts.push(String(o[key]));
    }
    // Nested common API envelopes
    for (const nestKey of ['data', 'Data', 'result', 'Result', 'error', 'Error', 'errors', 'Errors', 'response', 'Response']) {
      const nested = o[nestKey];
      if (nested && typeof nested === 'object') {
        const nestedText = extractErrorText(nested);
        if (nestedText) parts.push(nestedText);
      } else if (typeof nested === 'string' && nested.trim()) {
        parts.push(nested);
      }
    }
    if (Array.isArray(o.errors) || Array.isArray(o.Errors)) {
      const list = (o.errors || o.Errors) as unknown[];
      for (const item of list) parts.push(extractErrorText(item));
    }
    if (parts.length) return [...new Set(parts)].join(' ');
    try { return JSON.stringify(o); } catch { return ''; }
  }
  return String(err);
}

/**
 * True when the failure is a recoverable card/payment rejection the patient can fix
 * by re-entering card details — not a hard fatal checkout bug.
 */
function isRecoverablePaymentFailure(err: unknown): boolean {
  const text = extractErrorText(err).toLowerCase();
  if (!text) return false;

  // Explicit decline / issuer / processor signals
  const patterns: RegExp[] = [
    /\bdeclin(?:e|ed|es|ing)\b/,
    /\bdo[_\s-]?not[_\s-]?honor\b/,
    /\binsufficient[_\s-]?funds?\b/,
    /\binvalid[_\s-]?(card|account|number|cc|payment|cvv|cvc|expir)/,
    /\bexpired?\s*(card|credit)?\b/,
    /\bcard\s*(was\s*)?(declined|expired|invalid|rejected|not\s*accepted|refused)\b/,
    /\bpayment\s*(was\s*)?(declined|failed|rejected|unsuccessful|not\s*approved)\b/,
    /\btransaction\s*(was\s*)?(declined|rejected|not\s*approved|failed)\b/,
    /\bprocessor\s*(error|decline|rejection)?\b/,
    /\bauthorization\s*(failed|declined|not\s*approved)\b/,
    /\bauth(?:orize)?\.?net\b.*\b(declin|fail|error|reject)/,
    /\b(cvv|cvc|cid|security\s*code).*(fail|invalid|mismatch|incorrect|declin)/,
    /\b(pick\s*up\s*card|lost\s*card|stolen\s*card|restricted\s*card)\b/,
    /\bcall\s*issuer\b/,
    /\bexceeds?\s*(credit\s*)?limit\b/,
    /\bincorrect\s*(card\s*)?(number|expir|cvv|cvc)\b/,
    /\bplease\s*(re-?enter|check|verify).*(card|payment)\b/,
    /\bcannot\s*charge\b/,
    /\bunable\s*to\s*(process|charge|complete)\s*(the\s*)?(payment|card|transaction)\b/,
    /\bpayment\s*method\s*(was\s*)?(declined|invalid|failed|rejected)\b/,
    /\bcredit\s*card\b.*\b(declin|fail|reject|invalid|expir)/,
    /\bresponse[_\s-]?code\b[:\s]*2\b/, // Auth.net response code 2 = declined
    /\bresult[_\s-]?code\b[:\s]*(2|3)\b/,
    /\berror[_\s-]?code\b[:\s]*(2|5|6|7|8|10|11|27|37|41|44|45|65|78|127|141|145|165|200|201|202|203|204|205|206|207|208|209|210|211|212|213|214|215|216|217|218|219|220|221|222|223|224|250|251|252|253|254)\b/,
    /\b(avs|cvv2?)\s*(mismatch|failure|failed|error)\b/,
    /\bgateway\s*(declin|reject|fail)/,
    /\bissuer\s*(declin|reject|fail)/,
    /\bnot\s*sufficient\s*funds\b/,
    /\bnsf\b/,
    /\bfraud\b/,
    /\bsuspected\s*fraud\b/,
    /\bhold[_\s-]?card\b/,
    /\bretry\s*later\b.*\b(card|payment)/,
  ];

  if (patterns.some((re) => re.test(text))) return true;

  // HTTP-ish payment gateway messages sometimes surface bare codes
  if (/\b(card_declined|do_not_honor|insufficient_funds|expired_card|incorrect_number|invalid_number|invalid_cvc|processing_error|lost_card|stolen_card|generic_decline|fraudulent|pickup_card|restricted_card|security_violation|service_not_allowed|transaction_not_allowed)\b/.test(text)) {
    return true;
  }

  return false;
}

type FinalizeOutputs = {
  placed: boolean;
  orderId: string;
  redirectUrl: string;
  status: string;
  paymentFailed: string;
  paymentError: string;
};

type Props = { onChange?: (out: FinalizeOutputs) => void };

/**
 * Output alias this step's block should carry (`outputAlias: 'finalize'` on the
 * block entry in the flow).
 *
 * This component self-navigates with `window.pathwai.flow.next(out)`, which
 * stores whatever it is handed raw at `responses[nodeId]` — one level shallower
 * than the alias-keyed shape the runner builds from `onChange`. The builder's
 * routing-condition picker only ever offers the alias-keyed form
 * (`nodeId.alias.field`), so a raw payload leaves the picker unable to display
 * the condition even though it evaluates correctly.
 *
 * Emitting BOTH shapes keeps every reference working: `nodeId.status` (used by
 * the older flows on this component) and `nodeId.finalize.status` (what the
 * picker offers once the block sets `outputAlias: 'finalize'`).
 */
const OUTPUT_ALIAS = 'finalize';

/** Self-navigation payload: raw fields plus the alias-keyed copy. See OUTPUT_ALIAS. */
function routableOutputs(out: FinalizeOutputs): Record<string, unknown> {
  return { ...out, [OUTPUT_ALIAS]: out };
}

export default function StrutFinalize({ onChange }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [declined, setDeclined] = useState(false);
  const ran = useRef(false);

  const emit = useCallback((out: FinalizeOutputs) => {
    onChange?.(out);
  }, [onChange]);

  const resolveStateId = useCallback(async (stateRaw: string): Promise<number | null> => {
    const name = fullStateName(stateRaw).toLowerCase();
    if (!name) return null;
    try {
      const token = window.strut.getToken?.();
      const res = await fetch(`${window.strut.ENV.api}/state/GetListState`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const states = (await res.json()) as Array<{ Name?: string; Id?: number }>;
      const match = states.find((s) => (s.Name || '').toLowerCase() === name);
      return match?.Id ?? null;
    } catch {
      return null;
    }
  }, []);

  const handlePaymentDeclined = useCallback((message?: string) => {
    const paymentError = message && message.trim() ? message.trim() : PAYMENT_DECLINE_MESSAGE;
    // Prefer a consistent patient-facing line for routing UIs / templates.
    const out: FinalizeOutputs = {
      placed: false,
      orderId: '',
      redirectUrl: '',
      status: 'declined',
      paymentFailed: 'true',
      paymentError: PAYMENT_DECLINE_MESSAGE,
    };
    // Keep a slightly richer message on-screen if the gateway gave one that's still safe.
    const display =
      /declin|fund|expir|invalid|card|cvv|honor|charge|payment/i.test(paymentError)
        ? PAYMENT_DECLINE_MESSAGE
        : PAYMENT_DECLINE_MESSAGE;
    setDeclined(true);
    setError(display);
    emit(out);
  }, [emit]);

  const continueAfterDecline = useCallback(() => {
    const out: FinalizeOutputs = {
      placed: false,
      orderId: '',
      redirectUrl: '',
      status: 'declined',
      paymentFailed: 'true',
      paymentError: PAYMENT_DECLINE_MESSAGE,
    };
    emit(out);
    // Self-navigate so the step answer is routeable as either
    // nodeId.status == "declined" or nodeId.finalize.status == "declined".
    window.pathwai?.flow?.next?.(routableOutputs(out));
  }, [emit]);

  const run = useCallback(async () => {
    setError(null);
    setDeclined(false);
    try {
      const answers = window.pathwai?.flow?.getAnswers?.() || {};
      const profile = window.pathwai?.user?.getUser?.()?.profile || {};
      const traits = window.pathwai?.user?.getTraits?.() || {};
      const identity = findIdentity(answers, profile);

      // Payment profile IDs from profile traits (fallback: scan answers)
      const { customerProfileId, paymentProfileId } = findPaymentIds(answers, traits);
      if (!customerProfileId || !paymentProfileId) {
        // Missing saved payment method — treat as recoverable so they can re-enter card.
        handlePaymentDeclined(PAYMENT_DECLINE_MESSAGE);
        return;
      }

      // 1. Make sure the Strut order/cart is loaded for the authenticated user.
      const order = await window.strut.getCurrentVisiting();

      // 2. Push the shipping address to the order.
      const addr = (profile.address || {}) as Record<string, string>;
      if (addr.street) {
        const stateId = await resolveStateId(addr.state || '');
        const address: Record<string, unknown> = {
          Address1: addr.street,
          Address2: addr.street2 || '',
          City: addr.city,
          ZipPostalCode: addr.zip,
          StateName: fullStateName(addr.state || ''),
          CountryName: 'United States',
          FirstName: identity.firstName,
          LastName: identity.lastName,
          Email: identity.email,
          PhoneNumber: profile.phone,
        };
        if (stateId != null) address.StateProvinceId = stateId;
        await window.strut.createAddress(address);
        const addrs = await window.strut.getAddresses();
        const addressId = addrs?.[addrs.length - 1]?.Id ?? addrs?.[0]?.Id;
        if (addressId) await window.strut.saveShipping(addressId);
      }

      // 3. Link the PathwAI questionnaire answers to the Strut order BEFORE finalizing.
      //    Strut pulls the answers from PathwAI by submissionId; we hand it the ids.
      //    BLOCKING: on any failure we throw, so the order is NOT placed.
      {
        const strutAny = window.strut as any;
        const visitingId = strutAny.getVisitingId?.() ?? (order as any)?.VisitingId;
        const orderIdForAnswers = (order as any)?.OrderId ?? strutAny.getOrderId?.();
        let submissionId = '';
        try { submissionId = (window.pathwai as any)?.flow?.getSubmissionId?.() || ''; } catch (e0) { /* ignore */ }
        if (!submissionId) {
          try {
            const dl = (window as any).dataLayer || [];
            for (let i = dl.length - 1; i >= 0; i--) {
              if (dl[i] && dl[i].submission_id) { submissionId = String(dl[i].submission_id); break; }
            }
          } catch (e1) { /* ignore */ }
        }
        if (!visitingId || !orderIdForAnswers || !submissionId) {
          throw new Error('We could not sync your questionnaire (missing session details). Please go back and try again.');
        }
        const token = window.strut.getToken?.();
        const url =
          window.strut.ENV.api +
          '/Checkout/SaveQuestionAnswerByPathwAI?visitingId=' + encodeURIComponent(String(visitingId)) +
          '&orderId=' + encodeURIComponent(String(orderIdForAnswers)) +
          '&submissionId=' + encodeURIComponent(submissionId);
        const headers: Record<string, string> = { Accept: 'application/json' };
        if (token) headers.Authorization = 'Bearer ' + token;
        const sqaRes = await fetch(url, { method: 'GET', headers });
        const sqaText = await sqaRes.text();
        let sqaData: any = null; try { sqaData = sqaText ? JSON.parse(sqaText) : null; } catch (e2) { sqaData = sqaText; }
        if (!sqaRes.ok) {
          throw new Error((sqaData && sqaData.Message) || ('Could not save your questionnaire (' + sqaRes.status + '). Please try again.'));
        }
      }

      // 4. Place the order + charge the saved card. Lab details (selected panel
      //    from the Lab Option Selector step, and/or uploaded lab files from the
      //    Strut Lab Upload step) are sent WITH the order via FinishOrderV2 —
      //    replacing the old per-step SaveLabPanel / UploadRecentLabs calls.
      const labPanel = findLabPanel(answers);
      const uploadRecentLabFiles = findUploadedLabFiles(answers);
      let finishResult: unknown;
      try {
        finishResult = await window.strut.finishOrderV2(
          { customerProfileId, paymentProfileId },
          {
            ...(labPanel || {}),
            ...(uploadRecentLabFiles.length ? { uploadRecentLabFiles } : {}),
          }
        );
      } catch (chargeErr) {
        if (isRecoverablePaymentFailure(chargeErr)) {
          handlePaymentDeclined(extractErrorText(chargeErr));
          return;
        }
        // Some SDKs throw generic Errors whose message still indicates decline.
        const msg = extractErrorText(chargeErr);
        if (isRecoverablePaymentFailure(msg)) {
          handlePaymentDeclined(msg);
          return;
        }
        throw chargeErr;
      }

      // finishOrderV2 may resolve with a body that still indicates decline
      // instead of throwing — inspect the payload before treating as success.
      if (finishResult != null && typeof finishResult === 'object') {
        const body = finishResult as Record<string, any>;
        const successFlag = body.Success ?? body.success ?? body.IsSuccess ?? body.isSuccess;
        const responseCode = body.ResponseCode ?? body.responseCode ?? body.ResultCode ?? body.resultCode;
        const bodyText = extractErrorText(finishResult);
        const looksFailed =
          successFlag === false ||
          responseCode === 2 ||
          responseCode === '2' ||
          responseCode === 3 ||
          responseCode === '3' ||
          (typeof body.Status === 'string' && /fail|declin|error|reject/i.test(body.Status)) ||
          (typeof body.status === 'string' && /fail|declin|error|reject/i.test(body.status)) ||
          isRecoverablePaymentFailure(bodyText);

        if (looksFailed && (isRecoverablePaymentFailure(finishResult) || isRecoverablePaymentFailure(bodyText) || successFlag === false || responseCode === 2 || responseCode === '2')) {
          handlePaymentDeclined(bodyText || PAYMENT_DECLINE_MESSAGE);
          return;
        }
        // Hard failure indicated without clear decline wording — still prefer
        // declined path when the charge clearly did not succeed and message
        // mentions payment/card, so patients are not stranded.
        if (successFlag === false) {
          if (/card|payment|charge|transaction|cvv|gateway|processor|authoriz/i.test(bodyText) || !bodyText) {
            handlePaymentDeclined(bodyText || PAYMENT_DECLINE_MESSAGE);
            return;
          }
          throw new Error(bodyText || 'We could not complete your order. Please try again.');
        }
      }

      // 5. Build the order-confirmation redirect (env-aware) consumed by the ending.
      const orderId = (order as any)?.OrderId ?? window.strut.getOrderId?.();
      // Account/order-confirmation domain comes from the SDK ENV (set in onStarted).
      const base = (window.strut && window.strut.ENV && window.strut.ENV.account) || 'https://my.struthealth.com';
      const redirectUrl = orderId
        ? `${base}/account-information/orders/${orderId}`
        : `${base}/account-information/orders`;

      const out: FinalizeOutputs = {
        placed: true,
        orderId: orderId != null ? String(orderId) : '',
        redirectUrl,
        status: 'success',
        paymentFailed: 'false',
        paymentError: '',
      };
      emit(out);
      window.pathwai?.flow?.next?.(routableOutputs(out));
    } catch (e) {
      if (isRecoverablePaymentFailure(e)) {
        handlePaymentDeclined(extractErrorText(e));
        return;
      }
      setDeclined(false);
      // Prefer Strut application Message from err.body over bare "PUT … → 500".
      setError(extractErrorText(e) || 'We could not complete your order. Please try again.');
    }
  }, [resolveStateId, emit, handlePaymentDeclined]);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    run();
  }, [run]);

  const wrap: React.CSSProperties = {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--pw-step-padding, 40px 16px)',
    fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
    textAlign: 'center',
  };

  if (declined) {
    return (
      <div style={wrap}>
        <div
          className="pw-motion-enter"
          style={{
            maxWidth: 420,
            width: '100%',
            '--pw-motion-enter-delay': '0ms',
          } as React.CSSProperties}
        >
          <div
            aria-hidden
            style={{
              width: 56,
              height: 56,
              margin: '0 auto 20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--pw-color-error-surface, #fef2f2)',
              color: 'var(--pw-color-error, #ef4444)',
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            !
          </div>
          <h2
            style={{
              fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-title, 1.75rem)',
              fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
              color: 'var(--pw-label-fg, #002021)',
              margin: '0 0 8px',
              lineHeight: 'var(--pw-font-line-height-title, 1.2)' as unknown as number,
            }}
          >
            Card declined
          </h2>
          <p
            style={{
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
              color: 'var(--pw-label-sublabel-fg, #545454)',
              margin: '0 0 24px',
              lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
            }}
          >
            {error || PAYMENT_DECLINE_MESSAGE}
          </p>
          <button
            type="button"
            onClick={continueAfterDecline}
            className="pw-motion-enter"
            style={{
              '--pw-motion-enter-delay': '100ms',
              width: '100%',
              padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.5rem',
              fontFamily: 'var(--pw-navigation-button-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))',
              fontSize: 'var(--pw-navigation-button-font-size, var(--pw-font-size-body, 1rem))',
              fontWeight: 'var(--pw-navigation-button-font-weight, 600)' as unknown as number,
              background: 'var(--pw-button-bg, #161336)',
              color: 'var(--pw-button-fg, #ffffff)',
              border: 'none',
              borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
              cursor: 'pointer',
              transition: `opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, cubic-bezier(0.22, 1, 0.36, 1))`,
            } as React.CSSProperties}
          >
            Re-enter card details
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={wrap}>
        <div
          className="pw-motion-enter"
          style={{
            maxWidth: 420,
            width: '100%',
            '--pw-motion-enter-delay': '0ms',
          } as React.CSSProperties}
        >
          <h2
            style={{
              fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-title, 1.75rem)',
              fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
              color: 'var(--pw-label-fg, #002021)',
              margin: '0 0 8px',
              lineHeight: 'var(--pw-font-line-height-title, 1.2)' as unknown as number,
            }}
          >
            Payment could not be completed
          </h2>
          <p
            style={{
              fontSize: 'var(--pw-font-size-body, 1rem)',
              color: 'var(--pw-label-sublabel-fg, #545454)',
              margin: '0 0 24px',
              lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
            }}
          >
            {error}
          </p>
          <button
            type="button"
            onClick={() => {
              ran.current = false;
              run();
            }}
            style={{
              padding: 'var(--pw-navigation-button-padding, 0.75rem) 1.75rem',
              fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 600,
              background: 'var(--pw-button-bg, #161336)',
              color: 'var(--pw-button-fg, #ffffff)',
              border: 'none',
              borderRadius: 'var(--pw-navigation-button-radius, var(--pw-radius, 0.5rem))',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div className="pw-motion-enter" style={{ '--pw-motion-enter-delay': '0ms' } as React.CSSProperties}>
        <div
          className="pw-motion-spin"
          aria-hidden
          style={{
            width: 44,
            height: 44,
            margin: '0 auto 20px',
            borderRadius: '50%',
            border: '3px solid var(--pw-color-border, #EFEFEC)',
            borderTopColor: 'var(--pw-color-brand, #161336)',
            borderRightColor: 'transparent',
          }}
        />
        <h2
          style={{
            fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-title, 1.75rem)',
            fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
            color: 'var(--pw-label-fg, #002021)',
            margin: '0 0 6px',
            lineHeight: 'var(--pw-font-line-height-title, 1.2)' as unknown as number,
          }}
        >
          Placing your order…
        </h2>
        <p
          style={{
            fontSize: 'var(--pw-font-size-body, 1rem)',
            color: 'var(--pw-label-sublabel-fg, #545454)',
            margin: 0,
            lineHeight: 'var(--pw-font-line-height-body, 1.55)' as unknown as number,
          }}
        >
          Please don&apos;t close this window.
        </p>
      </div>
    </div>
  );
}

export const propSchema = {};

export const outputSchema = {
  placed: { type: 'boolean' as const, title: 'Order placed', description: 'true when the order was successfully placed and charged' },
  orderId: { type: 'string' as const, title: 'Strut order id', description: 'Strut order id on success; empty on failure' },
  redirectUrl: { type: 'string' as const, title: 'Order confirmation URL', description: 'Account order-confirmation URL on success; empty when payment fails' },
  status: {
    type: 'string' as const,
    title: 'Status',
    description: 'Checkout outcome: "success" when placed, "declined" when the card/payment was rejected (route back to payment).',
  },
  paymentFailed: {
    type: 'string' as const,
    title: 'Payment failed',
    description: 'String "true" when payment was declined/failed; "false" on success. Use for routing conditions.',
  },
  paymentError: {
    type: 'string' as const,
    title: 'Payment error message',
    description: 'Patient-facing payment error; set on decline (e.g. "Your card was declined. Please re-enter your card details.").',
  },
};