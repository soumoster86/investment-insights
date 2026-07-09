/**
 * Stocks page extras: local watchlist + trade P&amp;L calculator.
 */
(function () {
  "use strict";

  var WATCH_KEY = "iiStockWatchlist";

  // Shared helpers (js/util.js must load first)
  var escapeHtml = window.IIUtil.escapeHtml;

  function inr(n, d) {
    return window.IIUtil.formatINR(n, d == null ? 2 : d);
  }

  function $(id) {
    return document.getElementById(id);
  }

  function loadWatch() {
    try {
      var raw = localStorage.getItem(WATCH_KEY);
      if (!raw) return [];
      var list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function saveWatch(list) {
    try {
      localStorage.setItem(WATCH_KEY, JSON.stringify(list));
    } catch (e) { /* private mode */ }
  }

  function isWatched(name) {
    return loadWatch().some(function (x) {
      return x.name === name;
    });
  }

  function toggleWatch(item) {
    var list = loadWatch();
    var i = list.findIndex(function (x) {
      return x.name === item.name;
    });
    if (i >= 0) list.splice(i, 1);
    else {
      list.push({
        name: item.name,
        sector: item.sector || "",
        url: item.url || "",
        addedAt: new Date().toISOString()
      });
    }
    saveWatch(list);
    renderWatch();
    syncWatchButtons();
  }

  function renderWatch() {
    var host = $("stock-watchlist");
    var empty = $("stock-watchlist-empty");
    var count = $("stock-watch-count");
    if (!host) return;
    var list = loadWatch();
    if (count) count.textContent = String(list.length);
    if (!list.length) {
      host.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    host.innerHTML = list
      .map(function (s) {
        var link = s.url
          ? '<a href="' +
            s.url.replace(/"/g, "") +
            '" target="_blank" rel="noopener noreferrer" class="btn btn-sm">Quote</a>'
          : "";
        return (
          '<article class="watch-card">' +
          "<div><strong>" +
          escapeHtml(s.name) +
          "</strong>" +
          (s.sector
            ? ' <span class="sector-chip">' + escapeHtml(s.sector) + "</span>"
            : "") +
          "</div>" +
          '<div class="watch-card-actions">' +
          link +
          '<button type="button" class="btn secondary btn-sm watch-remove" data-name="' +
          escapeHtml(s.name) +
          '">Remove</button>' +
          "</div></article>"
        );
      })
      .join("");
  }

  function syncWatchButtons() {
    document.querySelectorAll(".stock-watch-btn").forEach(function (btn) {
      var name = btn.getAttribute("data-name");
      var on = isWatched(name);
      btn.textContent = on ? "★ Watching" : "☆ Watch";
      btn.classList.toggle("is-watching", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function bindWatchlist() {
    document.addEventListener("click", function (e) {
      var watchBtn = e.target.closest(".stock-watch-btn");
      if (watchBtn) {
        e.preventDefault();
        toggleWatch({
          name: watchBtn.getAttribute("data-name"),
          sector: watchBtn.getAttribute("data-sector"),
          url: watchBtn.getAttribute("data-url")
        });
        return;
      }
      var rm = e.target.closest(".watch-remove");
      if (rm) {
        e.preventDefault();
        toggleWatch({ name: rm.getAttribute("data-name") });
      }
    });

    var clearBtn = $("stock-watch-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        saveWatch([]);
        renderWatch();
        syncWatchButtons();
      });
    }

    // Re-sync after recommendation cards render (IIReco is defer)
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (document.querySelector(".stock-watch-btn") || tries > 40) {
        clearInterval(t);
        syncWatchButtons();
      }
    }, 100);
  }

  function bindPnL() {
    var form = $("stock-pnl-form");
    if (!form || !window.IICalc || !window.IICalc.stockPnL) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var r = window.IICalc.stockPnL(
        form.buy.value,
        form.qty.value,
        form.sell.value,
        form.fees.value
      );
      var out = $("stock-pnl-result");
      if (!out) return;
      if (r.error) {
        out.hidden = false;
        out.innerHTML = '<p class="calc-error">' + r.error + "</p>";
        return;
      }
      var cls = r.netPnL >= 0 ? "pnl-pos" : "pnl-neg";
      out.hidden = false;
      out.innerHTML =
        '<div class="calc-result-grid">' +
        '<div class="calc-result-item is-hero"><span class="calc-result-label">Net P&amp;L</span>' +
        '<strong class="calc-result-value ' +
        cls +
        '">' +
        inr(r.netPnL) +
        " (" +
        r.returnPct.toFixed(2) +
        "%)</strong></div>" +
        '<div class="calc-result-item"><span class="calc-result-label">Invested</span><strong class="calc-result-value">' +
        inr(r.invested) +
        "</strong></div>" +
        '<div class="calc-result-item"><span class="calc-result-label">Proceeds</span><strong class="calc-result-value">' +
        inr(r.proceeds) +
        "</strong></div>" +
        '<div class="calc-result-item"><span class="calc-result-label">Gross P&amp;L</span><strong class="calc-result-value">' +
        inr(r.grossPnL) +
        "</strong></div>" +
        '<div class="calc-result-item"><span class="calc-result-label">Fees (est.)</span><strong class="calc-result-value">' +
        inr(r.fees) +
        "</strong></div>" +
        "</div>" +
        '<p class="calc-result-note">Educational only — ignores STT, GST, stamp duty, taxes, and slippage. Not tax advice.</p>';
      if (window.IIStorage) {
        window.IIStorage.rememberCalculator("Stock P&L", "stocks.html#stock-pnl");
      }
    });
    var reset = form.querySelector("[data-reset]");
    if (reset) {
      reset.addEventListener("click", function () {
        form.reset();
        var out = $("stock-pnl-result");
        if (out) {
          out.innerHTML = "";
          out.hidden = true;
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderWatch();
    bindWatchlist();
    bindPnL();
  });
})();
