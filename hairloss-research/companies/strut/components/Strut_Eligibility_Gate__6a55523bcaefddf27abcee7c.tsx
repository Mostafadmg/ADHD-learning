import React, { useEffect, useRef, useState } from 'react';

/* ============================================================
   Strut Eligibility Gate
   ------------------------------------------------------------
   First step of the flow. For a RETURNING, logged-in customer
   (a Strut access token is present in localStorage), it checks
   whether they already have an active subscription for this
   product via:

     window.strut.getCurrentVisiting().VisitingOrderRestriction

   Strut (per Tram) returns VisitingOrderRestriction = { OrderId }
   on GetCurrentVisiting when the customer is restricted. If that
   OrderId is present -> emit { restricted: true } so the flow routes
   to the restriction ending. Otherwise it advances into the normal
   flow.

   UX: no-token / new visitors advance INSTANTLY (renders nothing —
   no flash). Only a returning, logged-in customer sees the branded
   loader while we check their account (with a small minimum display
   time so it reads as intentional, not a flicker).

   FAIL-OPEN by design: no token, no visiting, missing SDK, or any
   API error -> treated as NOT restricted, so we never block a
   legitimate customer over a transient issue.

   getCurrentVisiting() throws without a VisitingId (minted at
   product-selection). A returning customer usually still has one in
   localStorage; if not, we mint one with the flow's product slug +
   a default price purely to run the restriction check.
============================================================ */

const PRODUCT_SLUG = 'enclomiphine';   // Strut Mojo (Enclomiphene)
const DEFAULT_PRICE_ID = 902;          // 6.25mg / 30-day, no add-on — only used to mint a visiting when none is stored
const MIN_LOADER_MS = 750;             // minimum time the loader stays up once a check starts (avoids flicker)

/* Wait up to timeoutMs for window.strut (installed by the flow's onStarted script). */
function waitForStrut(timeoutMs) {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.strut) { resolve(window.strut); return; }
    const start = Date.now();
    const t = setInterval(() => {
      if (typeof window !== 'undefined' && window.strut) { clearInterval(t); resolve(window.strut); }
      else if (Date.now() - start > timeoutMs) { clearInterval(t); resolve(null); }
    }, 50);
  });
}

export default function StrutEligibilityGate({ onChange = null }) {
  const advancedRef = useRef(false);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (advancedRef.current) return;
    advancedRef.current = true;

    let cancelled = false;
    const finish = (restricted, restrictedOrderId) => {
      if (cancelled) return;
      const out = {
        restricted: !!restricted,
        restrictedOrderId: restrictedOrderId ? String(restrictedOrderId) : '',
      };
      try { onChangeRef.current && onChangeRef.current(out); } catch (_) {}
      try { window.pathwai && window.pathwai.flow && window.pathwai.flow.next && window.pathwai.flow.next(out); } catch (_) {}
    };

    (async () => {
      try {
        const s = await waitForStrut(2000);
        if (!s) { finish(false, ''); return; }

        const token = s.getToken ? s.getToken() : null;
        if (!token) { finish(false, ''); return; }   // not a returning logged-in customer -> continue instantly

        setChecking(true);
        const t0 = Date.now();

        let restricted = false, restrictedOid = '';
        try {
          // getCurrentVisiting needs a VisitingId; mint one if none is stored.
          let vid = s.getVisitingId ? s.getVisitingId() : null;
          if (!vid && s.validateVisiting) {
            try { await s.validateVisiting(PRODUCT_SLUG, DEFAULT_PRICE_ID); } catch (_) {}
            vid = s.getVisitingId ? s.getVisitingId() : null;
          }
          if (vid && s.getCurrentVisiting) {
            const order = await s.getCurrentVisiting();
            const restriction = order && order.VisitingOrderRestriction;
            const oid = restriction && restriction.OrderId != null ? restriction.OrderId : null;
            if (oid != null && String(oid) !== '' && !Number.isNaN(Number(oid))) {
              restricted = true; restrictedOid = String(oid);
            }
          }
        } catch (_) { /* fail open */ }

        const remaining = MIN_LOADER_MS - (Date.now() - t0);
        if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));
        finish(restricted, restrictedOid);
      } catch (_) {
        finish(false, '');   // fail open
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  return (
    <div className="seg-root" role="status" aria-live="polite" aria-busy="true">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@500;600;700&family=Inter:wght@400;500&display=swap');
        .seg-root {
          min-height: 68vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 22px; padding: 40px 24px; text-align: center;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: #1C1C21; background: transparent;
          animation: seg-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes seg-in {
          from { opacity: 0; transform: translateY(10px); filter: blur(5px); }
          to   { opacity: 1; transform: none;             filter: blur(0); }
        }

        .seg-orb { position: relative; width: 96px; height: 96px; }
        .seg-disc {
          position: absolute; inset: 11px; border-radius: 50%;
          background: radial-gradient(120% 120% at 32% 26%, #FFFFFF 0%, #F5F3ED 58%, #ECE9DF 100%);
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.85), 0 10px 26px rgba(22,19,54,0.10);
        }
        .seg-ring {
          position: absolute; inset: 0; border-radius: 50%;
          background: conic-gradient(from 0deg,
            rgba(22,19,54,0) 0%, rgba(22,19,54,0.05) 32%,
            rgba(22,19,54,0.5) 76%, #161336 100%);
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px));
                  mask: radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px));
          animation: seg-spin 1s linear infinite;
        }
        @keyframes seg-spin { to { transform: rotate(360deg); } }
        .seg-pulse {
          position: absolute; top: 50%; left: 50%; width: 11px; height: 11px; margin: -5.5px 0 0 -5.5px;
          border-radius: 50%; background: #161336;
          animation: seg-pulse 1.6s ease-in-out infinite;
        }
        @keyframes seg-pulse {
          0%, 100% { transform: scale(0.68); opacity: 0.5; }
          50%      { transform: scale(1);    opacity: 1; }
        }

        .seg-text { display: flex; flex-direction: column; gap: 5px; }
        .seg-title {
          font-family: 'Figtree', sans-serif; font-weight: 600; font-size: 19px;
          letter-spacing: -0.01em; line-height: 1.25; margin: 0; color: #1C1C21;
        }
        .seg-sub { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.4; color: #6B7670; margin: 0; }

        .seg-bar {
          width: 168px; max-width: 62%; height: 3px; border-radius: 999px;
          background: rgba(22,19,54,0.08); overflow: hidden;
        }
        .seg-bar-fill {
          display: block; width: 42%; height: 100%; border-radius: 999px; background: #161336;
          animation: seg-slide 1.35s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        @keyframes seg-slide {
          0%   { transform: translateX(-130%); }
          100% { transform: translateX(360%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .seg-root { animation: none; }
          .seg-pulse { animation: seg-fade 1.6s ease-in-out infinite; }
          .seg-bar-fill { animation: none; width: 100%; opacity: 0.5; }
        }
        @keyframes seg-fade { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>

      <div className="seg-orb">
        <div className="seg-disc" />
        <div className="seg-ring" />
        <div className="seg-pulse" />
      </div>
      <div className="seg-text">
        <h1 className="seg-title">Just a moment</h1>
        <p className="seg-sub">Checking your account&hellip;</p>
      </div>
      <div className="seg-bar"><span className="seg-bar-fill" /></div>
    </div>
  );
}

export const propSchema = {};

export const outputSchema = {
  restricted: { type: 'boolean', title: 'Has active subscription', description: 'True when the customer already has an active subscription for this product' },
  restrictedOrderId: { type: 'string', title: 'Restriction order id', description: 'Strut OrderId of the existing active subscription (empty when not restricted)' },
};
