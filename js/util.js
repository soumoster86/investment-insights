/**
 * Shared DOM-free helpers (HTML escaping + number formatting).
 * Load before recommendations.js and the js/*-page.js / tools scripts.
 * Browser: window.IIUtil. Node/Jest: module.exports.
 */
(function (global) {
  "use strict";

  /** Escape text for safe interpolation into HTML strings. */
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /**
   * Format a number as INR with en-IN grouping. Returns "—" for null/NaN.
   * digits: max fraction digits (default 0).
   * minDigits: min fraction digits (default 0) — pass the same value as
   * digits for fixed decimals (e.g. metal rates: formatINR(n, 2, 2)).
   */
  function formatINR(n, digits, minDigits) {
    if (n == null || isNaN(n)) return "—";
    return (
      "₹" +
      Number(n).toLocaleString("en-IN", {
        maximumFractionDigits: digits == null ? 0 : digits,
        minimumFractionDigits: minDigits == null ? 0 : minDigits
      })
    );
  }

  /** Format a number as a percentage string (default 2 decimals). */
  function formatPct(n, digits) {
    if (n == null || isNaN(n)) return "—";
    return Number(n).toFixed(digits == null ? 2 : digits) + "%";
  }

  var IIUtil = {
    escapeHtml: escapeHtml,
    formatINR: formatINR,
    formatPct: formatPct,
    initScrollAnimations: function() {
      if (!('IntersectionObserver' in window)) {
        // Fallback: just show them immediately
        document.querySelectorAll('.fade-in-section').forEach(function(el) {
          el.classList.add('is-visible');
        });
        return;
      }
      var observer = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -50px 0px" });
      
      document.querySelectorAll('.fade-in-section').forEach(function(el) {
        observer.observe(el);
      });
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = IIUtil;
  } else {
    global.IIUtil = IIUtil;
    
    // Auto-init client side
    if (typeof document !== "undefined") {
      document.addEventListener("DOMContentLoaded", function() {
        IIUtil.initScrollAnimations();
      });
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
