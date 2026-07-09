/**
 * UI wiring for tools.html (EMI, lumpsum, inflation, PPF, RD, target SIP).
 */
(function () {
  "use strict";

  // Shared helpers (js/util.js must load first)
  var inr = window.IIUtil.formatINR;
  var pct = window.IIUtil.formatPct;

  function show(el, html) {
    if (!el) return;
    el.innerHTML = html;
    el.hidden = false;
  }

  function remember(name) {
    if (window.IIStorage) {
      window.IIStorage.rememberCalculator(name, "tools.html");
    }
  }

  function bind(formId, handler) {
    var form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      handler(form);
    });
    var resetBtn = form.querySelector("[data-reset]");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        form.reset();
        var out = document.getElementById(form.getAttribute("data-result"));
        if (out) {
          out.innerHTML = "";
          out.hidden = true;
        }
      });
    }
  }

  function panel(rows, note) {
    var html =
      '<div class="calc-result-grid">' +
      rows
        .map(function (r) {
          return (
            '<div class="calc-result-item' +
            (r.hero ? " is-hero" : "") +
            '"><span class="calc-result-label">' +
            r.label +
            '</span><strong class="calc-result-value">' +
            r.value +
            "</strong></div>"
          );
        })
        .join("") +
      "</div>";
    if (note) {
      html += '<p class="calc-result-note">' + note + "</p>";
    }
    return html;
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.IICalc) return;

    bind("emi-form", function (form) {
      var r = window.IICalc.emi(
        form.principal.value,
        form.rate.value,
        form.years.value,
        form.months.value || 0
      );
      var out = document.getElementById("emi-result");
      if (r.error) {
        show(out, "<p class=\"calc-error\">" + r.error + "</p>");
        return;
      }
      show(
        out,
        panel(
          [
            { label: "Monthly EMI", value: inr(r.monthlyEmi), hero: true },
            { label: "Principal", value: inr(r.principal) },
            { label: "Total interest", value: inr(r.totalInterest) },
            { label: "Total payment", value: inr(r.totalPayment) },
            { label: "Tenure", value: r.months + " months" }
          ],
          "Reducing-balance EMI model. Fees, prepayment, and rate resets are not included."
        )
      );
      remember("EMI Calculator");
    });

    bind("lumpsum-form", function (form) {
      var r = window.IICalc.lumpsum(form.principal.value, form.rate.value, form.years.value);
      var out = document.getElementById("lumpsum-result");
      if (r.error) {
        show(out, "<p class=\"calc-error\">" + r.error + "</p>");
        return;
      }
      show(
        out,
        panel(
          [
            { label: "Future value", value: inr(r.futureValue), hero: true },
            { label: "Invested", value: inr(r.principal) },
            { label: "Estimated gain", value: inr(r.gain) },
            { label: "Assumed CAGR", value: pct(r.cagr) }
          ],
          "Yearly compounding for illustration. Markets do not grow in a straight line."
        )
      );
      remember("Lumpsum Calculator");
    });

    bind("cagr-form", function (form) {
      var r = window.IICalc.cagr(form.present.value, form.future.value, form.years.value);
      var out = document.getElementById("cagr-result");
      if (r.error) {
        show(out, "<p class=\"calc-error\">" + r.error + "</p>");
        return;
      }
      show(
        out,
        panel(
          [
            { label: "CAGR", value: pct(r.cagr), hero: true },
            { label: "Start value", value: inr(r.presentValue) },
            { label: "End value", value: inr(r.futureValue) },
            { label: "Years", value: String(r.years) }
          ],
          "Compound annual growth rate between two values over the period."
        )
      );
      remember("CAGR Calculator");
    });

    bind("inflation-form", function (form) {
      var r = window.IICalc.inflation(form.amount.value, form.rate.value, form.years.value);
      var out = document.getElementById("inflation-result");
      if (r.error) {
        show(out, "<p class=\"calc-error\">" + r.error + "</p>");
        return;
      }
      show(
        out,
        panel(
          [
            { label: "Future cost (same lifestyle)", value: inr(r.futureCost), hero: true },
            { label: "Today's amount", value: inr(r.amount) },
            { label: "Real value of that amount later", value: inr(r.realValue) },
            { label: "Purchasing power lost", value: pct(r.purchasingPowerLossPct) }
          ],
          "Simple inflation model. Actual CPI baskets and personal spending differ."
        )
      );
      remember("Inflation Calculator");
    });

    bind("ppf-form", function (form) {
      var r = window.IICalc.ppf(form.deposit.value, form.rate.value, form.years.value);
      var out = document.getElementById("ppf-result");
      if (r.error) {
        show(out, "<p class=\"calc-error\">" + r.error + "</p>");
        return;
      }
      show(
        out,
        panel(
          [
            { label: "Maturity value", value: inr(r.maturity), hero: true },
            { label: "Total deposited", value: inr(r.invested) },
            { label: "Interest earned", value: inr(r.interest) },
            { label: "Years", value: String(r.years) }
          ],
          "Simplified educational PPF model (annual deposit, yearly compound). Official PPF rules, rate resets, and tax treatment may differ — verify with a bank/post office."
        )
      );
      remember("PPF Calculator");
    });

    bind("rd-form", function (form) {
      var r = window.IICalc.rd(form.deposit.value, form.rate.value, form.months.value);
      var out = document.getElementById("rd-result");
      if (r.error) {
        show(out, "<p class=\"calc-error\">" + r.error + "</p>");
        return;
      }
      show(
        out,
        panel(
          [
            { label: "Maturity value", value: inr(r.maturity), hero: true },
            { label: "Total deposited", value: inr(r.invested) },
            { label: "Interest earned", value: inr(r.interest) },
            { label: "Tenure", value: r.months + " months" }
          ],
          "Educational RD approximation with monthly compounding. Bank RD formulas (often quarterly) can differ slightly."
        )
      );
      remember("RD Calculator");
    });

    bind("target-sip-form", function (form) {
      var r = window.IICalc.sipForGoal(form.goal.value, form.rate.value, form.years.value);
      var out = document.getElementById("target-sip-result");
      if (r.error) {
        show(out, "<p class=\"calc-error\">" + r.error + "</p>");
        return;
      }
      show(
        out,
        panel(
          [
            { label: "Required monthly SIP", value: inr(r.monthlySip), hero: true },
            { label: "Target corpus", value: inr(r.goalAmount) },
            { label: "Total invested (if held)", value: inr(r.totalInvested) },
            { label: "Years", value: String(r.years) }
          ],
          "Reverse SIP estimate assuming constant monthly contributions and the stated return."
        )
      );
      remember("Target SIP Calculator");
    });

    // Jump to hash section
    if (location.hash) {
      var el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
})();
