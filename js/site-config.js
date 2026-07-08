/**
 * Site-wide runtime config (safe to ship publicly).
 * Secrets never go here — use Netlify env vars + serverless functions.
 *
 * Analytics: set provider to "plausible" and domain to enable privacy-friendly
 * page views (no cookies). Leave "none" to keep analytics off.
 */
(function (global) {
  "use strict";

  global.IIConfig = {
    siteUrl: "https://investment-insight.netlify.app",
    metalsEndpoint: "/.netlify/functions/metals",
    analytics: {
      // "none" | "plausible"
      provider: "none",
      // Required when provider === "plausible"
      domain: "investment-insight.netlify.app",
      // Optional self-hosted / proxy script URL
      scriptUrl: "https://plausible.io/js/script.js"
    },
    /** Shown in footer; synced from content/freshness.json via npm run bump-freshness */
    contentReviewed: "2026-07-08"
  };
})(typeof window !== "undefined" ? window : globalThis);
