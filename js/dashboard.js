/**
 * Home dashboard: last calculator, goal snapshot, top picks from recommendations data.
 * Load after recommendations.js (optional) and storage.js. Only runs if dashboard cards exist.
 */
(function () {
  "use strict";

  // Shared helpers (js/util.js must load first)
  var formatINR = window.IIUtil.formatINR;
  var escapeHtml = window.IIUtil.escapeHtml;

  function fillLastCalculator() {
    var info = document.getElementById("last-used-info");
    var link = document.getElementById("last-used-link");
    if (!info || !link) return;

    var store = window.IIStorage;
    var obj = store ? store.getLastCalculator() : null;
    if (!obj && !store) {
      try {
        obj = JSON.parse(localStorage.getItem("lastCalculator"));
      } catch (e) {
        obj = null;
      }
    }

    if (obj && obj.name) {
      info.innerHTML =
        "You last used the <strong>" +
        escapeHtml(obj.name) +
        "</strong> on <em>" +
        escapeHtml(obj.date || "") +
        "</em>.";
      link.setAttribute("href", obj.link || "#");
      link.style.display = "";
      link.textContent = "Reopen Calculator";
    } else {
      info.textContent = "No calculator used recently.";
      link.style.display = "none";
    }
  }

  function fillGoalCard() {
    var card = document.getElementById("goal-summary-card");
    if (!card) return;

    var sipEl = document.getElementById("goal-summary-sip");
    var yearsEl = document.getElementById("goal-summary-years");
    var corpusEl = document.getElementById("goal-summary-corpus");
    var emptyEl = document.getElementById("goal-summary-empty");
    var filledEl = document.getElementById("goal-summary-filled");
    var btn = document.getElementById("goal-summary-btn");

    var snap = window.IIStorage ? window.IIStorage.getGoalSnapshot() : null;
    if (!snap) {
      try {
        snap = JSON.parse(localStorage.getItem("investmentGoal"));
      } catch (e) {
        snap = null;
      }
    }

    if (snap && snap.monthlySip > 0) {
      if (emptyEl) emptyEl.style.display = "none";
      if (filledEl) filledEl.style.display = "";
      var nameEl = document.getElementById("goal-summary-name");
      var nameRow = document.getElementById("goal-summary-name-row");
      if (nameEl && nameRow) {
        if (snap.goalName) {
          nameEl.textContent = String(snap.goalName);
          nameRow.style.display = "";
        } else {
          nameRow.style.display = "none";
        }
      }
      if (sipEl) sipEl.textContent = formatINR(snap.monthlySip);
      if (yearsEl) yearsEl.textContent = snap.years + " years";
      if (corpusEl) corpusEl.textContent = formatINR(snap.expectedCorpus);
      if (btn) {
        btn.textContent = "View or edit";
        btn.setAttribute("href", "investmentgoal.html");
      }
    } else {
      if (emptyEl) emptyEl.style.display = "";
      if (filledEl) filledEl.style.display = "none";
      if (btn) {
        btn.textContent = "Plan a Goal";
        btn.setAttribute("href", "investmentgoal.html");
      }
    }
  }

  function fillTopPicks() {
    var list = document.getElementById("top-picks-list");
    if (!list) return;

    var picks = [];
    var data = window.IIReco;
    if (data && typeof data.topPicks === "function") {
      picks = data.topPicks(3);
    } else {
      picks = [
        { name: "Parag Parikh Flexi Cap", detail: "5★ Mutual Fund", href: "mutualfunds.html" },
        { name: "HDFC Bank", detail: "Banking leader", href: "stocks.html" },
        { name: "Bitcoin (BTC)", detail: "Crypto", href: "cryptocurrencies.html" }
      ];
    }

    list.innerHTML = picks
      .map(function (p) {
        return (
          "<li><strong>" +
          escapeHtml(p.name) +
          "</strong> – " +
          escapeHtml(p.detail) +
          "</li>"
        );
      })
      .join("");
  }

  function convertCurrency() {
    var amountEl = document.getElementById("amount");
    var fromEl = document.getElementById("from-currency");
    var toEl = document.getElementById("to-currency");
    var resultDiv = document.getElementById("currency-result");
    if (!amountEl || !fromEl || !toEl || !resultDiv) return;

    var check = window.IICalc
      ? window.IICalc.validateAmount(amountEl.value)
      : (function () {
          var a = parseFloat(amountEl.value);
          return isNaN(a) || a <= 0
            ? { ok: false, message: "Please enter a valid amount." }
            : { ok: true, amount: a };
        })();

    if (!check.ok) {
      resultDiv.textContent = check.message;
      return;
    }
    var amount = check.amount;
    var from = fromEl.value;
    var to = toEl.value;

    if (from === to) {
      resultDiv.textContent = "Result: " + amount.toLocaleString() + " " + to;
      return;
    }

    resultDiv.textContent = "Fetching live rates...";
    var currencyApiBase = "https://open.er-api.com/v6/latest/";

    fetch(currencyApiBase + from)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.result !== "success" || !data.rates[to]) {
          resultDiv.textContent = "Failed to fetch rates.";
          return;
        }
        var rate = data.rates[to];
        var converted = window.IICalc
          ? window.IICalc.convertWithRate(amount, rate)
          : amount * rate;
        resultDiv.innerHTML =
          "<b>" +
          amount.toLocaleString() +
          " " +
          from +
          "</b> = <b>" +
          converted.toLocaleString(undefined, { maximumFractionDigits: 2 }) +
          " " +
          to +
          "</b><br><span style=\"font-size:0.96em;color:#444;\">Rate: 1 " +
          from +
          " = " +
          rate.toLocaleString(undefined, { maximumFractionDigits: 4 }) +
          " " +
          to +
          "</span>";
      })
      .catch(function () {
        resultDiv.textContent = "Error fetching conversion rate.";
      });
  }

  function applyMetalDemo(reason) {
    var gold1gEl = document.getElementById("gold1g");
    var gold10gEl = document.getElementById("gold10g");
    var silver1gEl = document.getElementById("silver1g");
    var silver10gEl = document.getElementById("silver10g");
    var updateEl = document.getElementById("metal-rate-update");
    if (!gold1gEl) return;
    gold1gEl.textContent = "₹9,134";
    gold10gEl.textContent = "₹91,337";
    silver1gEl.textContent = "₹100.54";
    silver10gEl.textContent = "₹1,005.40";
    if (updateEl) {
      updateEl.textContent =
        reason ||
        "Demo rates (educational). Live prices need GOLDAPI_KEY on the server.";
    }
  }

  function formatMetalInr(n, digits) {
    // Fixed decimals (min = max) so rates align in the card
    return formatINR(n, digits == null ? 0 : digits, digits == null ? 0 : digits);
  }

  /**
   * Live metals via Netlify Function (/.netlify/functions/metals).
   * Key stays server-side. Falls back to demo rates offline / without key.
   */
  function fetchMetalRates() {
    var gold1gEl = document.getElementById("gold1g");
    var gold10gEl = document.getElementById("gold10g");
    var silver1gEl = document.getElementById("silver1g");
    var silver10gEl = document.getElementById("silver10g");
    var updateEl = document.getElementById("metal-rate-update");
    if (!gold1gEl) return;

    gold1gEl.textContent =
      silver1gEl.textContent =
      gold10gEl.textContent =
      silver10gEl.textContent =
        "Loading…";

    var endpoint =
      (window.IIConfig && window.IIConfig.metalsEndpoint) ||
      "/.netlify/functions/metals";

    fetch(endpoint, { headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        var g = Number(data.goldPerGram);
        var s = Number(data.silverPerGram);
        if (!(g > 0) || !(s > 0)) throw new Error("invalid payload");

        gold1gEl.textContent = formatMetalInr(g, 0);
        gold10gEl.textContent = formatMetalInr(g * 10, 0);
        silver1gEl.textContent = formatMetalInr(s, 2);
        silver10gEl.textContent = formatMetalInr(s * 10, 2);

        if (updateEl) {
          var when = data.updatedAt
            ? new Date(data.updatedAt).toLocaleString()
            : new Date().toLocaleString();
          if (data.demo) {
            updateEl.textContent =
              (data.note || "Demo rates (educational).") + " · " + when;
          } else {
            updateEl.textContent = "Live (server proxy) · Updated: " + when;
          }
        }
      })
      .catch(function () {
        applyMetalDemo(
          "Could not reach metals proxy — showing educational demo rates."
        );
      });
  }

  function formatUsd(n, digits) {
    if (!(typeof n === "number") || isNaN(n)) return "—";
    var d = digits == null ? 2 : digits;
    try {
      return (
        "$" +
        n.toLocaleString("en-US", {
          minimumFractionDigits: d,
          maximumFractionDigits: d
        })
      );
    } catch (e) {
      return "$" + n.toFixed(d);
    }
  }

  function formatChange(change, changePct) {
    if (change == null && changePct == null) return { text: "—", cls: "is-flat" };
    var parts = [];
    if (typeof change === "number" && !isNaN(change)) {
      parts.push((change > 0 ? "+" : "") + change.toFixed(2));
    }
    if (typeof changePct === "number" && !isNaN(changePct)) {
      parts.push((changePct > 0 ? "+" : "") + changePct.toFixed(2) + "%");
    }
    var cls = "is-flat";
    var ref = typeof changePct === "number" ? changePct : change;
    if (typeof ref === "number") {
      if (ref > 0) cls = "is-up";
      else if (ref < 0) cls = "is-down";
    }
    return { text: parts.join(" · ") || "—", cls: cls };
  }

  function applyCrudeDemo(reason) {
    var wtiEl = document.getElementById("crude-wti-price");
    var brentEl = document.getElementById("crude-brent-price");
    var wtiCh = document.getElementById("crude-wti-change");
    var brentCh = document.getElementById("crude-brent-change");
    var updateEl = document.getElementById("crude-rate-update");
    if (!wtiEl) return;
    wtiEl.textContent = "$67.82";
    brentEl.textContent = "$71.40";
    if (wtiCh) {
      wtiCh.textContent = "+0.37 · +0.55%";
      wtiCh.className = "kpi-change is-up";
    }
    if (brentCh) {
      brentCh.textContent = "+0.22 · +0.31%";
      brentCh.className = "kpi-change is-up";
    }
    if (updateEl) {
      updateEl.textContent =
        reason ||
        "Demo prices (educational). Set API_NINJAS_KEY on Netlify for live data.";
    }
  }

  /**
   * Live crude via Netlify Function (/.netlify/functions/crude).
   * Proxies API Ninjas commodityprice (WTI + Brent). Key stays server-side.
   */
  function fetchCrudePrices() {
    var wtiEl = document.getElementById("crude-wti-price");
    var brentEl = document.getElementById("crude-brent-price");
    var wtiCh = document.getElementById("crude-wti-change");
    var brentCh = document.getElementById("crude-brent-change");
    var updateEl = document.getElementById("crude-rate-update");
    if (!wtiEl) return;

    wtiEl.textContent = "Loading…";
    if (brentEl) brentEl.textContent = "Loading…";
    if (wtiCh) {
      wtiCh.textContent = "…";
      wtiCh.className = "kpi-change is-flat";
    }
    if (brentCh) {
      brentCh.textContent = "…";
      brentCh.className = "kpi-change is-flat";
    }

    var endpoint =
      (window.IIConfig && window.IIConfig.crudeEndpoint) ||
      "/.netlify/functions/crude";

    fetch(endpoint, { headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        var wti = data.wti || {};
        var brent = data.brent || {};
        if (!(Number(wti.price) > 0)) throw new Error("invalid payload");

        wtiEl.textContent = formatUsd(Number(wti.price), 2);
        if (brentEl) brentEl.textContent = formatUsd(Number(brent.price), 2);

        var wCh = formatChange(wti.change, wti.changePct);
        var bCh = formatChange(brent.change, brent.changePct);
        if (wtiCh) {
          wtiCh.textContent = wCh.text;
          wtiCh.className = "kpi-change " + wCh.cls;
        }
        if (brentCh) {
          brentCh.textContent = bCh.text;
          brentCh.className = "kpi-change " + bCh.cls;
        }

        if (updateEl) {
          var when = data.updatedAt
            ? new Date(data.updatedAt).toLocaleString()
            : new Date().toLocaleString();
          if (data.demo) {
            updateEl.textContent =
              (data.note || "Demo prices (educational).") + " · " + when;
          } else {
            updateEl.textContent =
              "WTI & Brent · USD/barrel · Live (API Ninjas proxy) · " + when;
          }
        }
      })
      .catch(function () {
        applyCrudeDemo(
          "Could not reach crude proxy — showing educational demo prices."
        );
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillLastCalculator();
    fillGoalCard();
    fillTopPicks();
    if (document.getElementById("gold1g")) fetchMetalRates();
    if (document.getElementById("crude-wti-price")) fetchCrudePrices();
  });

  // Expose for onclick handlers still used on the dashboard
  window.convertCurrency = convertCurrency;
  window.fetchMetalRates = fetchMetalRates;
  window.fetchCrudePrices = fetchCrudePrices;
})();
