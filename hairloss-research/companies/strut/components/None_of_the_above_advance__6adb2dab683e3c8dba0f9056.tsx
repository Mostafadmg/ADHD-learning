import React from "react";

export default function NoneOfTheAboveAdvance() {
  React.useEffect(function () {
    var root = document.querySelector("[data-pw-ov]");
    if (!root) return undefined;
    function onClick(event) {
      var target = event.target;
      var button = target && target.closest ? target.closest("button") : null;
      if (!button || !root.contains(button)) return;
      var name = (button.getAttribute("aria-label") || button.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
      if (name !== "none of the above") return;
      window.setTimeout(function () {
        if (!document.body.contains(button)) return;
        if (button.getAttribute("aria-pressed") !== "true") return;
        var buttons = root.querySelectorAll("button");
        for (var i = 0; i < buttons.length; i++) {
          var label = (buttons[i].textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
          if (label === "continue" || label === "next") {
            buttons[i].click();
            return;
          }
        }
      }, 450);
    }
    root.addEventListener("click", onClick);
    return function () {
      root.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        height: 0,
        overflow: "hidden",
        background: "transparent",
      }}
    />
  );
}