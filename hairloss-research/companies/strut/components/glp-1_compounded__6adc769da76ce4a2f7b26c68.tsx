import React, { useEffect, useState } from "react";

export const propSchema = {
  showOralOption: {
    type: "boolean",
    title: "Show oral lozenge option",
    defaultValue: false,
  },
};

export const outputSchema = {
  outcome: {
    type: "string",
    title: "Outcome",
    description: "continue, or disqualify when there is no compounded reason.",
    required: true,
  },
  reasons: {
    type: "string",
    title: "Selected reasons",
    description: "Comma-separated option ids.",
  },
  allergy_explanation: {
    type: "string",
    title: "Allergy explanation",
  },
  other_reason_explanation: {
    type: "string",
    title: "Other reason explanation",
  },
};

const OPTIONS = [
  {
    id: "allergy",
    label: "I have an allergy to an ingredient in commercial GLP-1 products.",
  },
  {
    id: "alternate_dosing",
    label:
      "I require alternate dosing that is unavailable in commercial GLP-1 products (i.e. microdosing or different titration) based on my prior needs or to decrease side effects.",
  },
  {
    id: "side_effects_b6",
    label:
      "I experience a noticeable change in my health or response to treatment from decreased side effects (nausea, vomiting) with the addition of pyridoxine (vitamin B6) or other ingredients at the time of use.",
  },
  {
    id: "metabolism_b6",
    label:
      "I experience a noticeable change in my health or response to treatment from vitamin B6 supplementation, or other ingredients, to include changes in energy metabolism, fatigue, weakness, and neuropathy.",
  },
  {
    id: "other_reasons",
    label:
      "I require a GLP-1 that is not a brand name, commercial product for other reasons.",
  },
  {
    id: "oral_lozenge",
    label:
      "I can't use an injection formulation and want to see if the oral lozenges are appropriate for me.",
    oralOnly: true,
  },
  {
    id: "no_reason",
    label: "I do not have a reason for needing a compounded formula.",
  },
];

export default function Glp1Compounded({
  showOralOption = false,
  onChange,
}: {
  showOralOption?: boolean;
  onChange?: (outputs: {
    outcome: string;
    reasons: string;
    allergy_explanation: string;
    other_reason_explanation: string;
  }) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [allergyText, setAllergyText] = useState("");
  const [otherText, setOtherText] = useState("");

  const options = OPTIONS.filter((option) => showOralOption || !option.oralOnly);
  const disqualified = selected.includes("no_reason");
  const needsAllergy = selected.includes("allergy");
  const needsOther = selected.includes("other_reasons");
  const allergyOk = !needsAllergy || allergyText.trim().length > 0;
  const otherOk = !needsOther || otherText.trim().length > 0;
  const outcome = disqualified
    ? "disqualify"
    : selected.length > 0 && allergyOk && otherOk
      ? "continue"
      : "";

  useEffect(() => {
    onChange?.({
      outcome,
      reasons: selected.join(","),
      allergy_explanation: needsAllergy ? allergyText.trim() : "",
      other_reason_explanation: needsOther ? otherText.trim() : "",
    });
  }, [outcome, selected, allergyText, otherText, needsAllergy, needsOther, onChange]);

  function toggle(id: string) {
    setSelected((current) => {
      if (id === "no_reason") {
        return current.includes("no_reason") ? [] : ["no_reason"];
      }
      const next = current.filter((item) => item !== "no_reason");
      return next.includes(id) ? next.filter((item) => item !== id) : [...next, id];
    });
  }

  const fieldStyle = {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "var(--pw-control-padding, 0.75rem)",
    fontFamily: "var(--pw-font-family-body, Inter, system-ui, sans-serif)",
    fontSize: "var(--pw-font-size-body, 1rem)",
    lineHeight: "var(--pw-font-line-height-body, 1.55)",
    color: "var(--pw-color-on-surface, #1C1C21)",
    background: "var(--pw-color-surface, #ffffff)",
    border: "1.5px solid var(--pw-answer-border, #E0E0E0)",
    borderRadius: "var(--pw-radius, 0.5rem)",
  };

  const labelStyle = {
    fontFamily: "var(--pw-font-family-body, Inter, system-ui, sans-serif)",
    fontSize: "var(--pw-font-size-body, 1rem)",
    lineHeight: "var(--pw-font-line-height-body, 1.55)",
    color: "var(--pw-color-on-surface, #1C1C21)",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--pw-section-gap, 1.5rem)",
        width: "100%",
        background: "transparent",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "var(--pw-label-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))",
          fontSize: "var(--pw-label-font-size, var(--pw-font-size-title, 1.25rem))",
          fontWeight: "var(--pw-label-font-weight, 600)",
          lineHeight: "var(--pw-font-line-height-title, 1.3)",
          color: "var(--pw-label-fg, var(--pw-color-on-surface, #1C1C21))",
        }}
      >
        Why do you need a compounded formula? Select all that apply.
      </p>

      <div
        role="group"
        aria-label="Why do you need a compounded formula? Select all that apply."
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--pw-element-gap, 0.75rem)",
        }}
      >
        {options.map((option) => {
          const checked = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={checked}
              onClick={() => toggle(option.id)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--pw-answer-gap, 0.75rem)",
                width: "100%",
                minHeight: 44,
                textAlign: "left",
                padding: "var(--pw-control-padding, 1rem)",
                fontFamily: "var(--pw-answer-font-family, var(--pw-font-family-body, Inter, system-ui, sans-serif))",
                fontSize: "var(--pw-answer-font-size, var(--pw-font-size-body, 1rem))",
                fontWeight: "var(--pw-answer-font-weight, 500)",
                lineHeight: "var(--pw-font-line-height-body, 1.55)",
                color: "var(--pw-answer-fg, var(--pw-color-on-surface, #1C1C21))",
                background: checked
                  ? "var(--pw-answer-surface-selected, var(--pw-state-hover, #F1F0E8))"
                  : "var(--pw-answer-surface, var(--pw-color-surface, #ffffff))",
                border: checked
                  ? "2px solid var(--pw-color-brand, #161336)"
                  : "1.5px solid var(--pw-answer-border, #E0E0E0)",
                borderRadius: "var(--pw-radius, 0.5rem)",
                cursor: "pointer",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 18,
                  height: 18,
                  flexShrink: 0,
                  marginTop: "0.2em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  border: "2px solid var(--pw-color-brand, #161336)",
                  background: checked ? "var(--pw-color-brand, #161336)" : "transparent",
                  color: "var(--pw-color-brand-contrast, #ffffff)",
                  fontSize: 12,
                  lineHeight: 1,
                }}
              >
                {checked ? "✓" : ""}
              </span>
              <span style={{ overflowWrap: "anywhere" }}>{option.label}</span>
            </button>
          );
        })}
      </div>

      {needsAllergy ? (
        <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
          <span style={labelStyle}>
            Please explain what you are allergic to and what happens when exposed to that ingredient.
          </span>
          <textarea
            required
            rows={4}
            value={allergyText}
            onChange={(event) => setAllergyText(event.target.value)}
            style={fieldStyle}
          />
        </label>
      ) : null}

      {needsOther ? (
        <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
          <span style={labelStyle}>
            Please explain (Note: cost is NOT an acceptable reason)
          </span>
          <textarea
            required
            rows={4}
            value={otherText}
            onChange={(event) => setOtherText(event.target.value)}
            style={fieldStyle}
          />
        </label>
      ) : null}
    </div>
  );
}
