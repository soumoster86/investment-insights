/**
 * Crypto page: watchlist + risk-capital / P&amp;L helpers.
 */
(function () {
  "use strict";

  var KEY = "iiCryptoWatchlist";

  function $(id) {
    return document.getElementById(id);
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return [];
      var list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function save(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) { /* ignore */ }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function inr(n) {
    if (n == null || isNaN(n)) return "—";
    return "₹" + Math.round(n).toLocaleString("en-IN");
  }

  function isOn(name) {
    return load().some(function (x) {
      return x.name === name;
    });
  }

  function toggle(item) {
    var list = load();
    var i = list.findIndex(function (x) {
      return x.name === item.name;
    });
    if (i >= 0) list.splice(i, 1);
    else {
      list.push({
        name: item.name,
        category: item.category || "",
        url: item.url || "",
        addedAt: new Date().toISOString()
      });
    }
    save(list);
    render();
    syncButtons();
  }

  function render() {
    var host = $("crypto-watchlist");
    var empty = $("crypto-watchlist-empty");
    var count = $("crypto-watch-count");
    if (!host) return;
    var list = load();
    if (count) count.textContent = String(list.length);
    if (!list.length) {
      host.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    host.innerHTML = list
      .map(function (c) {
        var link = c.url
          ? '<a href="' +
            c.url.replace(/"/g, "") +
            '" target="_blank" rel="noopener noreferrer" class="btn btn-sm">Details</a>'
          : "";
        return (
          '<article class="watch-card">' +
          "<div><strong>" +
          escapeHtml(c.name) +
          "</strong>" +
          (c.category
            ? ' <span class="crypto-type-chip">' +
              escapeHtml(c.category) +
              "</span>"
            : "") +
          "</div>" +
          '<div class="watch-card-actions">' +
          link +
          '<button type="button" class="btn secondary btn-sm crypto-watch-remove" data-name="' +
          escapeHtml(c.name) +
          '">Remove</button>' +
          "</div></article>"
        );
      })
      .join("");
  }

  function syncButtons() {
    document.querySelectorAll(".crypto-watch-btn").forEach(function (btn) {
      var name = btn.getAttribute("data-name");
      var on = isOn(name);
      btn.textContent = on ? "★ Watching" : "☆ Watch";
      btn.classList.toggle("is-watching", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function bindWatch() {
    document.addEventListener("click", function (e) {
      var add = e.target.closest(".crypto-watch-btn");
      if (add) {
        e.preventDefault();
        toggle({
          name: add.getAttribute("data-name"),
          category: add.getAttribute("data-category"),
          url: add.getAttribute("data-url")
        });
        return;
      }
      var rm = e.target.closest(".crypto-watch-remove");
      if (rm) {
        e.preventDefault();
        toggle({ name: rm.getAttribute("data-name") });
      }
    });
    var clearBtn = $("crypto-watch-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        save([]);
        render();
        syncButtons();
      });
    }
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (document.querySelector(".crypto-watch-btn") || tries > 40) {
        clearInterval(t);
        syncButtons();
      }
    }, 100);
  }

  function bindRiskForm() {
    var form = $("crypto-risk-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var net = parseFloat(form.networth.value);
      var cap = parseFloat(form.riskcap.value);
      var out = $("crypto-risk-result");
      if (!out) return;
      if (!(net > 0) || !(cap >= 0) || cap > net) {
        out.hidden = false;
        out.innerHTML =
          '<p class="calc-error">Enter a positive total investable amount and a crypto sleeve ≤ that total.</p>';
        return;
      }
      var pct = (cap / net) * 100;
      var tone =
        pct <= 5
          ? "Small satellite sleeve under many educational risk frameworks."
          : pct <= 15
            ? "Meaningful satellite — stress-test a large drawdown."
            : "Large share of wealth in a high-volatility asset class — consider whether sleep-well risk is acceptable.";
      out.hidden = false;
      out.innerHTML =
        '<div class="calc-result-grid">' +
        '<div class="calc-result-item is-hero"><span class="calc-result-label">Crypto as % of investable</span><strong class="calc-result-value">' +
        pct.toFixed(1) +
        "%</strong></div>" +
        '<div class="calc-result-item"><span class="calc-result-label">If sleeve goes to zero</span><strong class="calc-result-value pnl-neg">' +
        inr(cap) +
        " loss</strong></div>" +
        '<div class="calc-result-item"><span class="calc-result-label">Remaining investable</span><strong class="calc-result-value">' +
        inr(net - cap) +
        "</strong></div>" +
        "</div>" +
        '<p class="calc-result-note">' +
        tone +
        " Not advice — only a sizing sketch.</p>";
    });
    var reset = form.querySelector("[data-reset]");
    if (reset) {
      reset.addEventListener("click", function () {
        form.reset();
        var out = $("crypto-risk-result");
        if (out) {
          out.innerHTML = "";
          out.hidden = true;
        }
      });
    }
  }

  function bindPnL() {
    var form = $("crypto-pnl-form");
    if (!form || !window.IICalc || !window.IICalc.stockPnL) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var r = window.IICalc.stockPnL(
        form.buy.value,
        form.qty.value,
        form.sell.value,
        form.fees.value
      );
      var out = $("crypto-pnl-result");
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
        '<div class="calc-result-item is-hero"><span class="calc-result-label">Net P&amp;L</span><strong class="calc-result-value ' +
        cls +
        '">' +
        inr(r.netPnL) +
        " (" +
        r.returnPct.toFixed(2) +
        "%)</strong></div>" +
        '<div class="calc-result-item"><span class="calc-result-label">Cost basis</span><strong class="calc-result-value">' +
        inr(r.invested) +
        "</strong></div>" +
        '<div class="calc-result-item"><span class="calc-result-label">Proceeds</span><strong class="calc-result-value">' +
        inr(r.proceeds) +
        "</strong></div>" +
        '<div class="calc-result-item"><span class="calc-result-label">Fees (est.)</span><strong class="calc-result-value">' +
        inr(r.fees) +
        "</strong></div>" +
        "</div>" +
        '<p class="calc-result-note">Educational trade sketch. Crypto tax/TDS rules in India are special — see Tax overview. Not tax advice.</p>';
      if (window.IIStorage) {
        window.IIStorage.rememberCalculator(
          "Crypto P&L",
          "cryptocurrencies.html#crypto-pnl"
        );
      }
    });
    var reset = form.querySelector("[data-reset]");
    if (reset) {
      reset.addEventListener("click", function () {
        form.reset();
        var out = $("crypto-pnl-result");
        if (out) {
          out.innerHTML = "";
          out.hidden = true;
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    render();
    bindWatch();
    bindRiskForm();
    bindPnL();
  });
})();
