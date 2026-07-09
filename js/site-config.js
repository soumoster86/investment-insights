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
    /** Crude oil via Netlify proxy → API Ninjas (API_NINJAS_KEY server-side) */
    crudeEndpoint: "/.netlify/functions/crude",
    /** Proxied free NSE/BSE API — https://github.com/0xramm/Indian-Stock-Market-API */
    stocksEndpoint: "/.netlify/functions/india-stocks",
    stocksSymbols: [
      "RELIANCE",
      "TCS",
      "HDFCBANK",
      "INFY",
      "ICICIBANK",
      "SBIN",
      "BHARTIARTL",
      "ITC"
    ],
    analytics: {
      // "none" | "plausible"
      provider: "none",
      // Required when provider === "plausible"
      domain: "investment-insight.netlify.app",
      // Optional self-hosted / proxy script URL
      scriptUrl: "https://plausible.io/js/script.js"
    },
    /** Shown in footer + sample-data badges; synced via npm run bump-freshness */
    contentReviewed: "2026-07-09",
    nextReviewDue: "2026-10-07"
  };
})(typeof window !== "undefined" ? window : globalThis);
