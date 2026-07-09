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
            { label: "Loan amount", value: inr(r.principal) },
            { label: "Total interest", value: inr(r.totalInterest) },
            { label: "Total you pay back", value: inr(r.totalPayment) },
            { label: "Loan length", value: r.months + " months" }
          ],
          "Uses a standard reducing-balance EMI formula. Bank fees, prepayments, and rate changes are not included."
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
            { label: "Amount invested", value: inr(r.principal) },
            { label: "Estimated gain", value: inr(r.gain) },
            { label: "Return you assumed", value: pct(r.cagr) }
          ],
          "Assumes the same return every year. Real markets go up and down; this is not a forecast."
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
            { label: "Average yearly growth (CAGR)", value: pct(r.cagr), hero: true },
            { label: "Starting value", value: inr(r.presentValue) },
            { label: "Ending value", value: inr(r.futureValue) },
            { label: "Years", value: String(r.years) }
          ],
          "This is the smooth yearly rate that would take you from start to end over that many years."
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
            { label: "What it may cost later", value: inr(r.futureCost), hero: true },
            { label: "Amount today", value: inr(r.amount) },
            { label: "What that money is worth later", value: inr(r.realValue) },
            { label: "Buying power lost", value: pct(r.purchasingPowerLossPct) }
          ],
          "Simple model with a steady inflation rate. Your own spending and official price indexes can differ."
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
          "Simple model: one deposit each year, interest added yearly. Real PPF rules, rate changes, and tax treatment can differ. Check with a bank or post office for current terms."
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
            { label: "Length", value: r.months + " months" }
          ],
          "Rough model with monthly compounding. Many banks use quarterly interest, so their figure can be a little different."
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
            { label: "Monthly SIP needed", value: inr(r.monthlySip), hero: true },
            { label: "Goal amount", value: inr(r.goalAmount) },
            { label: "Total you would invest", value: inr(r.totalInvested) },
            { label: "Years", value: String(r.years) }
          ],
          "Works backwards from your goal, assuming a steady monthly SIP and the return you entered. Not a guarantee."
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
