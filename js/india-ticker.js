/**
 * India stock ticker tape for stocks.html
 * Fetches /.netlify/functions/india-stocks (proxies free NSE/BSE API).
 */
(function () {
  "use strict";

  var REFRESH_MS = 60000;

  function endpoint() {
    var cfg = window.IIConfig || {};
    return cfg.stocksEndpoint || "/.netlify/functions/india-stocks";
  }

  function symbolsParam() {
    var cfg = window.IIConfig || {};
    if (cfg.stocksSymbols && cfg.stocksSymbols.length) {
      return cfg.stocksSymbols.join(",");
    }
    return "RELIANCE,TCS,HDFCBANK,INFY,ICICIBANK,SBIN,BHARTIARTL,ITC";
  }

  function formatInr(n) {
    if (n == null || !isFinite(n)) return "—";
    return (
      "₹" +
      Number(n).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );
  }

  function formatPct(n) {
    if (n == null || !isFinite(n)) return "—";
    var sign = n > 0 ? "+" : "";
    return sign + Number(n).toFixed(2) + "%";
  }

  function formatChange(n) {
    if (n == null || !isFinite(n)) return "";
    var sign = n > 0 ? "+" : "";
    return sign + Number(n).toFixed(2);
  }

  function renderTape(root, payload) {
    var track = root.querySelector(".india-ticker-track");
    var note = root.querySelector(".ticker-note");
    if (!track) return;

    var stocks = (payload && payload.stocks) || [];
    if (!stocks.length) {
      track.innerHTML =
        '<span class="india-ticker-item india-ticker-muted">No quotes available right now.</span>';
      if (note) {
        note.textContent =
          (payload && payload.note) ||
          "Could not load quotes. Educational page only.";
      }
      return;
    }

    function chipHtml(s) {
      var dir =
        s.percent_change > 0
          ? "up"
          : s.percent_change < 0
            ? "down"
            : "flat";
      return (
        '<span class="india-ticker-item india-ticker-' +
        dir +
        '">' +
        '<span class="india-ticker-sym">' +
        escapeHtml(s.symbol) +
        "</span>" +
        '<span class="india-ticker-px">' +
        formatInr(s.last_price) +
        "</span>" +
        '<span class="india-ticker-chg">' +
        formatChange(s.change) +
        " (" +
        formatPct(s.percent_change) +
        ")</span>" +
        "</span>"
      );
    }

    var chips = stocks.map(chipHtml).join("");
    // Duplicate for seamless marquee
    track.innerHTML =
      '<div class="india-ticker-seq">' +
      chips +
      "</div>" +
      '<div class="india-ticker-seq" aria-hidden="true">' +
      chips +
      "</div>";

    if (note) {
      var src = payload.demo
        ? "Demo quotes (live API offline)"
        : "NSE quotes via free India Stock Market API";
      var ts = payload.updatedAt
        ? " · updated " + new Date(payload.updatedAt).toLocaleTimeString("en-IN")
        : "";
      note.textContent =
        src + ts + ". Educational only — not for trading decisions.";
    }

    root.classList.toggle("is-demo", !!payload.demo);
    root.classList.remove("is-loading");
  }

  var escapeHtml =
    (window.IIUtil && window.IIUtil.escapeHtml) ||
    function (s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    };

  function showLoading(root) {
    root.classList.add("is-loading");
    var track = root.querySelector(".india-ticker-track");
    if (track) {
      track.innerHTML =
        '<span class="india-ticker-item india-ticker-muted">Loading market quotes…</span>';
    }
  }

  function fetchQuotes(root) {
    var url =
      endpoint() +
      "?symbols=" +
      encodeURIComponent(symbolsParam()) +
      "&_=" +
      Date.now();
    return fetch(url, { credentials: "omit" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        renderTape(root, data);
      })
      .catch(function (err) {
        renderTape(root, {
          demo: true,
          stocks: [],
          note:
            "Could not load quotes (" +
            (err && err.message ? err.message : "error") +
            "). Educational page only."
        });
      });
  }

  function init() {
    var root = document.getElementById("live-ticker");
    if (!root || !root.classList.contains("india-ticker")) return;

    showLoading(root);
    fetchQuotes(root);

    var refreshBtn = root.querySelector("[data-ticker-refresh]");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", function () {
        showLoading(root);
        fetchQuotes(root);
      });
    }

    // Soft auto-refresh while tab visible
    setInterval(function () {
      if (document.hidden) return;
      fetchQuotes(root);
    }, REFRESH_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
