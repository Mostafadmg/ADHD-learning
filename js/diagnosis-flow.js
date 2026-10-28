(function () {
  "use strict";

  function installDiagnosisFlow() {
    var panel = document.querySelector('.gst-p[data-i="5"]');
    if (!panel) return;

    var rule = panel.querySelector(".gst-rule");
    var body = panel.querySelector(".gst-body");
    if (!body || body.querySelector(".dx-flow")) return;

    if (rule) {
      rule.textContent = "Follow the evidence pathway before making and recording a diagnosis.";
    }

    body.innerHTML =
      '<figure class="dx-flow">' +
      '<img src="images/before-adhd-diagnosis-flowchart.png" ' +
      'alt="Flowchart for the steps before an ADHD diagnosis: confirm diagnostic criteria; developmental course; pervasiveness and impairment; collateral history and rating scales; differential diagnoses, comorbidities and specialist assessment; then discuss and record the diagnosis and next steps." ' +
      'width="1680" height="945" loading="lazy" decoding="async">' +
      '<figcaption><strong>Use the pathway as a clinical safeguard.</strong> ' +
      'A structured checklist supports, but does not replace, specialist clinical judgement.</figcaption>' +
      '</figure>';
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installDiagnosisFlow, { once: true });
  } else {
    installDiagnosisFlow();
  }
})();
