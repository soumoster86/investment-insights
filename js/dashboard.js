/**
 * Home dashboard: last calculator, goal snapshot, top picks from recommendations data.
 * Load after recommendations.js (optional) and storage.js. Only runs if dashboard cards exist.
 */
(function () {
  "use strict";

  function formatINR(n) {
    if (n == null || isNaN(n)) return "—";
    return "₹" + Math.round(Number(n)).toLocaleString("en-IN");
  }

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
      if (sipEl) sipEl.textContent = formatINR(snap.monthlySip);
      if (yearsEl) yearsEl.textContent = snap.years + " years";
      if (corpusEl) corpusEl.textContent = formatINR(snap.expectedCorpus);
      if (btn) {
        btn.textContent = "View or Edit";
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

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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

  // Metals: demo rates only (no client-side API keys)
  function fetchMetalRates() {
    var gold1gEl = document.getElementById("gold1g");
    var gold10gEl = document.getElementById("gold10g");
    var silver1gEl = document.getElementById("silver1g");
    var silver10gEl = document.getElementById("silver10g");
    var updateEl = document.getElementById("metal-rate-update");
    if (!gold1gEl) return;

    // Placeholder educational rates — replace via serverless proxy later
    gold1gEl.textContent = "₹9,134";
    gold10gEl.textContent = "₹91,337";
    silver1gEl.textContent = "₹100.54";
    silver10gEl.textContent = "₹1,005.40";
    if (updateEl) {
      updateEl.textContent = "Demo rates (educational). Live metals API requires a secure proxy.";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillLastCalculator();
    fillGoalCard();
    fillTopPicks();
    if (document.getElementById("gold1g")) fetchMetalRates();
  });

  // Expose for onclick handlers still used on the dashboard
  window.convertCurrency = convertCurrency;
  window.fetchMetalRates = fetchMetalRates;
})();
