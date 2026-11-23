// VERBATIM (only re-indented by prettier) from code served to anonymous visitors by shop.sons.co.uk on 2026-11-23.
// Module 38496 = lists and pairings; module 30216 = function S({consultationResults, customerTags, marketCode, chosenProduct, specialType, rawRecommendations}).
module.exports = {
38496: function (e, i, t) {
        "use strict";
        t.d(i, {
          Af: function () {
            return p;
          },
          DS: function () {
            return h;
          },
          Hy: function () {
            return u;
          },
          Lm: function () {
            return l;
          },
          Ni: function () {
            return s;
          },
          Oc: function () {
            return _;
          },
          Q3: function () {
            return r;
          },
          Wx: function () {
            return a;
          },
          jh: function () {
            return d;
          },
          ji: function () {
            return v;
          },
          n7: function () {
            return f;
          },
          nb: function () {
            return c;
          },
          q2: function () {
            return g;
          },
          yI: function () {
            return n;
          },
          zL: function () {
            return o;
          },
        });
        let a = {
            EXISTING_CUSTOMER: 5140,
            GENDER: 5141,
            TCS_ACCEPTED: 5142,
            HAIR_LOSS_START: 5143,
            HAIR_LOSS_OTHER_AREAS: 5144,
            NEW_MEDICATION: 5145,
            PHYSICAL_SYMPTOMS: 5146,
            HAIR_LOSS_STAGE: 5147,
            MEDICINES_TAKEN: 5148,
            EXISTING_CONDITIONS: 5155,
            MOOD_ASSESSMENT: 3216,
            MOOD_DETAILS: 3217,
            MOOD_INTEREST_PLEASURE: 3275,
            MOOD_DEPRESSED_HOPELESS: 3276,
            DEFAULT_SURVEY_ID: 6,
          },
          l = {
            TEMPLES_ONLY: { id: "temples_only", value: 0, text: "Temples only (receding at the front)" },
            TEMPLES_CROWN: { id: "temples_crown", value: 1, text: "Temples/Crown" },
            RANDOM_PATCHES: { id: "random_patches", value: 2, text: "Random patches" },
            COMPLETELY_BALD: { id: "completely_bald", value: 3, text: "Completely bald" },
          },
          n = { GRADUAL: { id: "gradual", value: 0, text: "Gradually" }, SUDDEN: { id: "sudden", value: 1, text: "Suddenly" } },
          s = {
            TOPICAL: { id: "topical", value: 0, text: "Topical sprays - apply to scalp" },
            ORAL: { id: "oral", value: 1, text: "Oral capsule - take once a day" },
            NO_PREFERENCE: { id: "no_preference", value: 2, text: "I don't mind - I want what's most effective for me" },
          },
          o = {
            NONE: "none",
            FINASTERIDE: { id: "finasteride", value: 0, text: "Finasteride or Propecia" },
            MINOXIDIL: { id: "minoxidil", value: 1, text: "Minoxidil or Regaine" },
            COMBINATION: { id: "combination", value: 2, text: "Topical Finasteride Minoxidil Combination" },
          },
          r = {
            NONE: "none",
            HIGH_BP: { id: "high_bp", value: 0, text: "High Blood Pressure" },
            CARDIO: { id: "cardio", value: 1, text: "Cardiovascular Disease (incl. Heart Attack, Rhythm, Valve Disorder or Stroke)" },
            KIDNEY_LIVER: { id: "kidney_liver", value: 2, text: "Severe Kidney or Liver Disease" },
            PROSTATE_CANCER: { id: "prostate_cancer", value: 3, text: "Prostate Disease, Male Breast Cancer or Testicular Cancer" },
            ARTHRITIS_LUPUS: { id: "arthritis_lupus", value: 4, text: "Rheumatoid Arthritis, Systemic Lupus or on Methotrexate" },
            SCALP_DISORDER: { id: "scalp_disorder", value: 5, text: "Scalp Disorders (including Scalp Psoriasis, Eczema, Dermatitis or Infection)" },
            PHAEO: { id: "phaeo", value: 6, text: "Phaeochromocytoma" },
            LACTOSE: { id: "lactose", value: 7, text: "Diagnosed Lactose Allergy" },
            SEXUAL_DYSFUNCTION: { id: "sexual_dysfunction", value: 8, text: "Sexual Dysfunction" },
          },
          d = [
            { label: "Not at all", value: 0 },
            { label: "Several days", value: 1 },
            { label: "More than half the days", value: 2 },
            { label: "Nearly every day", value: 3 },
          ],
          c = { TOTAL_STEPS: 12 },
          u = {
            FINASTERIDE: "Works by blocking the production of DHT, a hormone which causes male pattern hair loss",
            MINOXIDIL: "Boosts regrowth by boosting blood flow to hair follicles",
            HGC: "Combines 9 natural ingredients to combat thinning, boost growth, and help your hair health",
            HAIR_GROWTH_COMPLEX: "Supplement containing natural ingredients supporting hair growth, strength & vitality",
            SHAMPOO: "Cleans, strengthens and naturally blocks DHT",
            BIOTIN: "Supports the maintenance of healthy, stronger hair",
            STRENGTHENING_CONDITIONER: "Conditioner fortified with caffeine - great for dry hair",
            FINASTERIDE_AND_MINOXIDIL:
              "Once applied, the first active ingredient reduces the levels of the DHT hormone that has attached itself to your hair follicles. By lowering the levels of DHT in your hair, your hair follicles are able to regrow. The second active ingredient is thought to increase blood flow to the affected areas of your scalp, encouraging growth",
            TOPICAL_FINASTERIDE: "Prescription spray medication that blocks DHT - the hormone that cause hair loss",
            COMBINATION_CAPSULE: "A once-a-day tablet that combines the only two clinically-proven hair loss treatments",
            THICKENING_HAIR_CLAY: "Formulated to add volume while giving it stability, structure and strength",
            BEARD_BOOSTER: "A growth serum formulated to fill patchy areas and promote a fuller, thicker-looking beard.",
            DUTASTERIDE_COMBINATION_SPRAY: "Multi-action treatment for hair loss that helps reduce DHT at the scalp, while stimulating hair follicles",
            DEFAULT_MINOXIDIL: "Increases blood flow and oxygen to hair follicles",
          },
          p = {
            CORE_PLAN: {
              dose: "1mg Finasteride, 5% Minoxidil Cutaneous Solution",
              defaultDesc: "1mg Finasteride capsule once daily & 1ml of Minoxidil spray twice daily",
            },
            CORE_PLAN_CAPSULE: {
              dose: "1mg Finasteride, 2.5mg Minoxidil Capsule",
              defaultDesc: "1mg Finasteride capsule once daily & 2.5mg Minoxidil capsule once daily",
            },
            ULTIMATE_PLAN: {
              dose: "1mg Finasteride,5% Minoxidil Cutaneous Solution,Nine ingrediants including AnaGain™",
              defaultDesc: "1mg Finasteride capsule once daily & 1ml of Minoxidil spray twice daily",
            },
            ULTIMATE_PLAN_CAPSULE: {
              dose: "1mg Finasteride,2.5mg Minoxidil Capsule",
              defaultDesc: "1mg Finasteride capsule once daily & 1ml of Minoxidil spray twice daily",
            },
            FINASTERIDE: { dose: "1mg Finasteride", defaultDesc: "1 tablet taken daily to block DHT" },
            TOPICAL_FINASTERIDE: { dose: "0.15% Finasteride Spray", defaultDesc: "1ml applied twice daily to scalp" },
            TOPICAL_FINASTERIDE_MINOXIDIL_SPRAY: { dose: "0.15% Finasteride, 5% Minoxidil, 0.015% Tretinoin", defaultDesc: "1ml applied twice daily to scalp" },
            MINOXIDIL_SPRAY: { dose: "5% Minoxidil Cutaneous Solution", defaultDesc: "1ml applied twice daily to stimulate blood flow" },
            ORAL_MINOXIDIL: { dose: "2.5mg Minoxidil Capsule", defaultDesc: "1 tablet taken daily to promote hair regrowth" },
            HGC: { dose: "Nine ingrediants including AnaGain™", defaultDesc: "1 tablet taken daily to promote hair regrowth" },
            BIOTIN: { dose: "900mcg", defaultDesc: "Strengthens hair structure & keratin" },
            SHAMPOO: { dose: "200ml", defaultDesc: "Cleans, strengthens and naturally blocks DHT" },
            COMBINATION_CAPSULE: { dose: "1 Capsule", defaultDesc: "1 capsule taken daily" },
            DEFAULT: { dose: "Standard", defaultDesc: "Clinically proven active ingredient" },
          },
          h = (e) => {
            let i = (e || "").toLowerCase();
            return i.includes("core plan") && i.includes("capsule")
              ? p.CORE_PLAN_CAPSULE
              : i.includes("core plan")
                ? p.CORE_PLAN
                : i.includes("ultimate plan") && i.includes("capsule")
                  ? p.ULTIMATE_PLAN_CAPSULE
                  : i.includes("ultimate plan")
                    ? p.ULTIMATE_PLAN
                    : i.includes("hair growth complex")
                      ? p.HGC
                      : i.includes("finasteride") && i.includes("minoxidil")
                        ? p.TOPICAL_FINASTERIDE_MINOXIDIL_SPRAY
                        : i.includes("topical finasteride")
                          ? p.TOPICAL_FINASTERIDE
                          : i.includes("finasteride")
                            ? p.FINASTERIDE
                            : i.includes("minoxidil spray")
                              ? p.MINOXIDIL_SPRAY
                              : i.includes("minoxidil")
                                ? p.ORAL_MINOXIDIL
                                : i.includes("biotin")
                                  ? p.BIOTIN
                                  : i.includes("shampoo")
                                    ? p.SHAMPOO
                                    : p.DEFAULT;
          },
          m = {
            TOPICAL_FINASTERIDE: "https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Combination_Spray_Product_1000x1000.png?v=1731600629",
            FINASTERIDE:
              "https://cdn.shopify.com/s/files/1/0986/5078/4119/files/DE-Product-Images-Aug-24-07_0465d346-b825-4c93-b59e-321419e1f8b2.png?v=1774374956",
            MINOXIDIL_SPRAY: "https://cdn.shopify.com/s/files/1/0986/5078/4119/files/DE-Product-Images-Aug-24-06.png?v=1774374941",
            ORAL_MINOXIDIL: "https://cdn.shopify.com/s/files/1/0986/5078/4119/files/Sons_DE_Hair_Loss_Tablet_logged_out.png?v=1774374929",
            HGC: "https://cdn.shopify.com/s/files/1/0986/5078/4119/files/hgc-ad.png?v=1774374925",
            SHAMPOO:
              "https://cdn.shopify.com/s/files/1/0986/5078/4119/files/DE_Shampoo_Product_1000x1000_50833442-170f-4765-a916-5476994eadd0.png?v=1774374942",
            BIOTIN: "https://cdn.shopify.com/s/files/1/0986/5078/4119/files/DE_Biotin_Product_1000x1000_2a19523f-90d2-4b55-8393-310b337557e8.png?v=1774374935",
          },
          f = function (e) {
            let i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
            if (i) return i;
            let t = (e || "").toLowerCase();
            return t.includes("finasteride") && t.includes("spray")
              ? m.TOPICAL_FINASTERIDE
              : t.includes("finasteride")
                ? m.FINASTERIDE
                : t.includes("minoxidil") && t.includes("spray")
                  ? m.MINOXIDIL_SPRAY
                  : t.includes("minoxidil")
                    ? m.ORAL_MINOXIDIL
                    : t.includes("complex") || t.includes("growth") || t.includes("hgc")
                      ? m.HGC
                      : t.includes("shampoo")
                        ? m.SHAMPOO
                        : t.includes("biotin")
                          ? m.BIOTIN
                          : null;
          },
          _ = (e) =>
            e && Array.isArray(e)
              ? e.filter((e) => "string" == typeof e && e.startsWith("tab_")).map((e) => e.replace("tab_", "").replace(/^\w/, (e) => e.toUpperCase()))
              : [],
          g = {
            uk: {
              topical: [
                "topical-finasteride-minoxidil-spray",
                "the-duo-plan",
                "oral-duo-plan",
                "hair-loss-spray-hair-loss-capsule",
                "ultimate-hair-loss-plan",
                "ultimate-hair-loss-plan-capsule",
                "minoxidil",
                "oral-minoxidil",
                "topical-hair-loss-spray",
                "finasteride",
                "the-non-prescription-plan",
                "hair-growth-complex",
              ],
              oral: [
                "topical-finasteride-minoxidil-spray",
                "oral-duo-plan",
                "the-duo-plan",
                "hair-loss-spray-hair-loss-capsule",
                "ultimate-hair-loss-plan-capsule",
                "ultimate-hair-loss-plan",
                "oral-minoxidil",
                "minoxidil",
                "finasteride",
                "topical-hair-loss-spray",
                "the-non-prescription-plan",
                "hair-growth-complex",
              ],
            },
            ie: [
              "the-duo-plan",
              "finasteride",
              "topical-hair-loss-spray",
              "minoxidil",
              "ultimate-hair-loss-plan",
              "non-prescription-advanced",
              "ultimate-hair-loss-plan-capsule",
              "oral-duo-plan",
              "oral-minoxidil",
            ],
            de: [
              "das-duo-programm",
              "der-duo-plan-tablette",
              "finasterid",
              "oral-minoxidil",
              "der-ultimative-plan",
              "der-ultimative-plan-tablette",
              "das-rezeptfreie-programm-hgc",
            ],
          },
          v = {
            uk: {
              topical: {
                "ultimate-hair-loss-plan": "ultimate-hair-loss-plan-capsule",
                "the-duo-plan": "oral-duo-plan",
                "topical-hair-loss-spray": "finasteride",
                minoxidil: "oral-minoxidil",
              },
              oral: {
                "ultimate-hair-loss-plan-capsule": "ultimate-hair-loss-plan",
                "oral-duo-plan": "the-duo-plan",
                finasteride: "topical-hair-loss-spray",
                "oral-minoxidil": "minoxidil",
              },
            },
            ie: { "ultimate-hair-loss-plan-capsule": "ultimate-hair-loss-plan", "oral-duo-plan": "the-duo-plan", "oral-minoxidil": "minoxidil" },
            de: { "das-duo-programm": "der-duo-plan-tablette", "der-ultimative-plan": "der-ultimative-plan-tablette" },
          };
      },
30216: function (e, t, i) {
        "use strict";
        i.d(t, {
          S: function () {
            return o;
          },
        });
        var l = i(38496);
        function o(e) {
          let {
              rawRecommendations: t = [],
              consultationResults: i = {},
              customerTags: o = [],
              marketCode: s = "uk",
              chosenProduct: n = null,
              specialType: a = "",
            } = e,
            r = Array.isArray(o) ? o : "string" == typeof o ? o.split(",").map((e) => e.trim()) : [],
            d = i || {};
          ((null == d ? void 0 : d.consult_results) && (d = d.consult_results), (null == d ? void 0 : d.survey) && (d = d.survey));
          let c = (e) => {
              if (void 0 !== d[e]) return d[e];
              let t = String(e).toLowerCase();
              for (let [e, i] of Object.entries(d)) if (e.toLowerCase() === t) return i;
            },
            p = c("5155"),
            u = Array.isArray(p) ? p.map((e) => ("string" != typeof e || isNaN(e) ? e : parseInt(e, 10))) : [];
          void 0 !== c("3216") && parseInt(c("3216"), 10);
          let m = void 0 !== c("3275") ? parseInt(c("3275"), 10) : void 0,
            f = void 0 !== c("3276") ? parseInt(c("3276"), 10) : void 0,
            h = void 0 !== c("5149") ? parseInt(c("5149"), 10) : void 0,
            g = void 0 !== c("5151") ? parseInt(c("5151"), 10) : void 0,
            x = void 0 !== c("5153") ? parseInt(c("5153"), 10) : void 0,
            v = void 0 !== c("5143") ? parseInt(c("5143"), 10) : void 0,
            y = c("What treatment type do you prefer?"),
            b = void 0 !== y ? parseInt(y, 10) : void 0,
            w = c("date_of_birth") || c("dob"),
            j = !0,
            N = !0,
            _ = !0,
            C = !0,
            S = !0;
          (r.includes("finasteride_disallowed") && ((j = !1), (N = !1), (S = !1)),
            r.includes("minoxidil_disallowed") && ((_ = !1), (C = !1), (S = !1)),
            w && Math.floor((new Date() - new Date(w)) / 315576e5) > 65 && ((j = !1), (N = !1), (_ = !1), (C = !1), (S = !1)),
            1 === v && ((j = !1), (N = !1), (_ = !1), (S = !1)),
            (m >= 2 || f >= 2) && ((j = !1), (N = !1), (S = !1)),
            1 === h && ((j = !1), (N = !1), (S = !1)),
            1 === g && ((_ = !1), (C = !1), (S = !1)),
            1 === x && (S = !1),
            (u.includes(0) || u.includes(1)) && ((_ = !1), (C = !1), (S = !1)),
            (u.includes(2) || u.includes(3) || u.includes(4)) && ((j = !1), (N = !1), (S = !1)),
            u.includes(5) && ((C = !1), (S = !1)),
            u.includes(6) && (_ = !1),
            u.includes(7) && ((j = !1), (_ = !1)),
            u.includes(8) && ((j = !1), (N = !1), (S = !1)));
          let k = [],
            I = {},
            A = s.toLowerCase();
          if ("uk" === A) {
            let e = 0 === b;
            ((k = e ? [...l.q2.uk.topical] : [...l.q2.uk.oral]), (I = e ? { ...l.ji.uk.topical } : { ...l.ji.uk.oral }));
          } else
            "ie" === A
              ? ((k = [...l.q2.ie]), r.includes("minoxidil_disallowed") || r.includes("finasteride_disallowed") || (I = { ...l.ji.ie }))
              : "de" === A && ((k = [...l.q2.de]), (I = { ...l.ji.de }));
          if (Array.isArray(t) && t.length > 0) {
            let e = {};
            (t.forEach((t) => {
              t.slug && t.paired_slug && (e[t.slug] = t.paired_slug);
            }),
              (I = { ...e, ...I }),
              (k = Array.from(
                new Set([
                  ...[...t]
                    .sort((e, t) => {
                      var i, l, o, s;
                      let n = null !== (i = e.order) && void 0 !== i ? i : 999,
                        a = null !== (l = t.order) && void 0 !== l ? l : 999;
                      return n !== a
                        ? n - a
                        : (null !== (o = e.paired_order) && void 0 !== o ? o : 0) - (null !== (s = t.paired_order) && void 0 !== s ? s : 0);
                    })
                    .map((e) => e.slug)
                    .filter(Boolean),
                  ...k,
                ]),
              )));
          }
          if (
            (r.includes("dutasteride_eligible")
              ? (k = k.filter((e) => "dutasteride-combination-spray" !== e)).unshift("dutasteride-combination-spray")
              : (k = k.filter((e) => "dutasteride-combination-spray" !== e)),
            r.includes("combo_pill_eligible") && ("combo" === a || "ksl-combo" === a || "hq-combo" === a || "bhc-combo" === a)
              ? (k = k.filter((e) => "combination-capsule" !== e)).unshift("combination-capsule")
              : (k = k.filter((e) => "combination-capsule" !== e)),
            n)
          ) {
            let e = n;
            ("the-duo-plan" === e && (e = "oral-duo-plan"),
              "oral-capsule" === e && (e = "oral-minoxidil"),
              "oral-tablet" === e && (e = "finasteride"),
              (k = k.filter((t) => t !== e)).unshift(e));
          }
          let F = (e) => {
              switch (e) {
                case "topical-finasteride-minoxidil-spray":
                case "dutasteride-combination-spray":
                  return S;
                case "the-duo-plan":
                case "ultimate-hair-loss-plan":
                  return j && C;
                case "oral-duo-plan":
                case "ultimate-hair-loss-plan-capsule":
                case "combination-capsule":
                case "der-duo-plan-tablette":
                case "der-ultimative-plan-tablette":
                  return j && _;
                case "hair-loss-spray-hair-loss-capsule":
                  return N && _;
                case "minoxidil":
                case "the-non-prescription-plan":
                case "non-prescription-advanced":
                case "das-rezeptfreie-programm-hgc":
                  return C;
                case "oral-minoxidil":
                  return _;
                case "topical-hair-loss-spray":
                  return N;
                case "finasteride":
                case "finasterid":
                  return j;
                case "das-duo-programm":
                case "der-ultimative-plan":
                  return N && C;
                default:
                  return !0;
              }
            },
            L = {};
          t.forEach((e) => {
            (e.product && e.product.handle && (L[e.product.handle] = e), e.slug && (L[e.slug] = e));
          });
          let T = k.filter((e) => F(e)),
            D = T.map((e) => {
              let t = L[e] || { id: e, slug: e, product: { handle: e, name: e } },
                i = I[e],
                l = t.paired_product || null,
                o = i || t.paired_slug || null;
              if ((o && !F(o) && ((o = null), (l = null)), o && L[o])) {
                let e = L[o];
                if ((l = e.product || e) && !l.discounts) {
                  let t = e.discounts || [];
                  l = { ...l, discounts: t };
                }
                l && e.plan_description && !l.plan_description && (l = { ...l, plan_description: e.plan_description });
              }
              let s = t.discounts || (t.product && t.product.discounts) || [];
              return (
                "combination-capsule" === e &&
                  "hq-combo" === a &&
                  Array.isArray(s) &&
                  s.forEach((e, t) => {
                    ("3 months" === e.title || "6 months" === e.title) && ((s[t].discountCode = "HQHT45"), (s[t].discountPercentage = 0.55));
                  }),
                "combination-capsule" === e &&
                  "ksl-combo" === a &&
                  Array.isArray(s) &&
                  s.forEach((e, t) => {
                    ("3 months" === e.title || "6 months" === e.title) && ((s[t].discountCode = "KSLCLINIC"), (s[t].discountPercentage = 0.55));
                  }),
                "combination-capsule" === e &&
                  "bhc-combo" === a &&
                  Array.isArray(s) &&
                  s.forEach((e, t) => {
                    ("3 months" === e.title || "6 months" === e.title) && ((s[t].discountCode = "BHC50"), (s[t].discountPercentage = 0.5));
                  }),
                { ...t, slug: e, paired_slug: o, paired_product: l, discounts: s }
              );
            }).filter(Boolean),
            z = {
              de: ["finasterid", "oral-minoxidil", "das-rezeptfreie-programm-hgc"],
              ie: {
                zeroPairings: [],
                onePairing: { hideAsStandalone: ["minoxidil"] },
                multiPairing: ["finasteride", "hair-loss-spray-hair-loss-capsule", "non-prescription-advanced"],
              },
            },
            R = Object.keys(I).length > 0,
            E = D.filter((e) => {
              let t = e.slug;
              if ("de" === A && R && !z.de.includes(t)) return !1;
              if ("ie" === A) {
                let e = z.ie;
                if (R) {
                  let i = Object.keys(I).length;
                  if (1 === i && e.onePairing.hideAsStandalone.includes(t)) return !1;
                  if (i > 1 && !e.multiPairing.includes(t)) {
                    let e = Object.keys(I).includes(t),
                      i = Object.values(I).includes(t);
                    if (!e && !i) return !1;
                  }
                } else if (["ultimate-hair-loss-plan-capsule", "oral-duo-plan", "oral-minoxidil", "topical-hair-loss-spray"].includes(t)) return !1;
              }
              return !0;
            }),
            W = [],
            P = [],
            M = new Set(),
            B = "uk" === A ? k.filter((e) => !T.includes(e)) : [];
          return (
            E.forEach((e) => {
              let t = e.slug;
              !M.has(t) &&
                (W.length < 1
                  ? (W.push(e), M.add(t), e.paired_slug && M.add(e.paired_slug))
                  : !M.has(t) && (P.push(e), M.add(t), e.paired_slug && M.add(e.paired_slug)));
            }),
            {
              primary: W,
              secondary: P,
              all: E,
              blocked: B,
              pairedProductsMap: I,
              customerTags: r,
              eligibilityFlags: {
                allowedOralFinasteride: j,
                allowedTopicalFinasteride: N,
                allowedOralMinoxidil: _,
                allowedTopicalMinoxidil: C,
                allowedTopicalCombo: S,
              },
            }
          );
        }
      }
};
