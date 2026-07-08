/**
 * Privacy-friendly analytics loader.
 * - Does nothing when IIConfig.analytics.provider === "none"
 * - Respects Do Not Track / Global Privacy Control
 * - Plausible: cookieless pageviews only (no personal data stored by us)
 */
(function () {
  "use strict";

  function dntEnabled() {
    try {
      if (navigator.globalPrivacyControl === true) return true;
      var dnt =
        navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
      return dnt === "1" || dnt === "yes";
    } catch (e) {
      return false;
    }
  }

  function loadPlausible(cfg) {
    if (!cfg.domain) return;
    var s = document.createElement("script");
    s.defer = true;
    s.setAttribute("data-domain", cfg.domain);
    s.src = cfg.scriptUrl || "https://plausible.io/js/script.js";
    document.head.appendChild(s);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var config = window.IIConfig && window.IIConfig.analytics;
    if (!config || !config.provider || config.provider === "none") return;
    if (dntEnabled()) return;

    if (config.provider === "plausible") {
      loadPlausible(config);
    }
  });
})();
