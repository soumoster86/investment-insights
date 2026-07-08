/**
 * Pure investment math (no DOM). Browser: window.IICalc. Node/Jest: module.exports.
 */
(function (global) {
  "use strict";

  function round(n, digits) {
    var f = Math.pow(10, digits == null ? 2 : digits);
    return Math.round(n * f) / f;
  }

  /** SIP with optional annual step-up (%). Monthly compounding of annual rate. */
  function sip(monthly, annualRatePct, years, stepupPct) {
    monthly = Number(monthly);
    annualRatePct = Number(annualRatePct);
    years = parseInt(years, 10);
    stepupPct = Number(stepupPct) || 0;
    if (!(monthly > 0) || !(years > 0) || isNaN(annualRatePct)) {
      return { error: "Invalid SIP inputs" };
    }
    var r = annualRatePct / 100 / 12;
    var totalInvested = 0;
    var corpus = 0;
    var currP = monthly;
    var yearlyData = [];
    var labels = [];
    var y, m;
    for (y = 1; y <= years; y++) {
      for (m = 1; m <= 12; m++) {
        corpus = (corpus + currP) * (1 + r);
        totalInvested += currP;
      }
      yearlyData.push(corpus);
      labels.push("Year " + y);
      currP *= 1 + stepupPct / 100;
    }
    var gain = corpus - totalInvested;
    var cagr = totalInvested > 0 ? (Math.pow(corpus / totalInvested, 1 / years) - 1) * 100 : 0;
    return {
      totalInvested: totalInvested,
      corpus: corpus,
      gain: gain,
      cagr: cagr,
      yearlyData: yearlyData,
      labels: labels
    };
  }

  /** Regular SWP: grow then withdraw each month. */
  function swp(corpus, annualRatePct, monthlyWithdraw, years) {
    corpus = Number(corpus);
    annualRatePct = Number(annualRatePct);
    monthlyWithdraw = Number(monthlyWithdraw);
    years = parseInt(years, 10);
    if (!(corpus > 0) || !(monthlyWithdraw > 0) || !(years > 0) || isNaN(annualRatePct) || annualRatePct < 0) {
      return { error: "Invalid SWP inputs" };
    }
    var rate = annualRatePct / 100 / 12;
    var balance = corpus;
    var exhaustedAt = null;
    var months = years * 12;
    var data = [];
    var i;
    for (i = 1; i <= months; i++) {
      balance = balance * (1 + rate) - monthlyWithdraw;
      if (balance <= 0 && exhaustedAt == null) exhaustedAt = i;
      data.push(balance > 0 ? balance : 0);
      if (balance <= 0) break;
    }
    var yearlyData = [];
    var labels = [];
    var y;
    for (y = 1; y <= Math.floor(data.length / 12); y++) {
      yearlyData.push(data[y * 12 - 1]);
      labels.push("Year " + y);
    }
    return {
      endBalance: Math.max(0, data[data.length - 1] || 0),
      exhaustedAt: exhaustedAt,
      yearlyData: yearlyData,
      labels: labels,
      monthsSimulated: data.length
    };
  }

  /** Max monthly withdrawal that exhausts corpus over `years`. */
  function maxSwp(corpus, annualRatePct, years) {
    corpus = Number(corpus);
    annualRatePct = Number(annualRatePct);
    years = parseInt(years, 10);
    if (!(corpus > 0) || !(years > 0) || isNaN(annualRatePct) || annualRatePct < 0) {
      return { error: "Invalid max-SWP inputs" };
    }
    var rate = annualRatePct / 100 / 12;
    var months = years * 12;
    var maxSWP;
    if (rate === 0) maxSWP = corpus / months;
    else maxSWP = (corpus * rate) / (1 - Math.pow(1 + rate, -months));

    var balance = corpus;
    var data = [];
    var i;
    for (i = 1; i <= months; i++) {
      balance = balance * (1 + rate) - maxSWP;
      data.push(balance > 0 ? balance : 0);
    }
    var yearlyData = [];
    var labels = [];
    var y;
    for (y = 1; y <= Math.floor(data.length / 12); y++) {
      yearlyData.push(data[y * 12 - 1]);
      labels.push("Year " + y);
    }
    return {
      maxMonthly: maxSWP,
      endBalance: Math.max(0, data[data.length - 1] || 0),
      yearlyData: yearlyData,
      labels: labels,
      months: months
    };
  }

  /**
   * FD compound interest.
   * compoundsPerYear: 1|2|4|12 etc.
   * Tenure via years + months + days.
   */
  function fd(principal, annualRatePct, compoundsPerYear, years, months, days) {
    principal = Number(principal);
    annualRatePct = Number(annualRatePct);
    compoundsPerYear = parseInt(compoundsPerYear, 10);
    years = parseInt(years, 10) || 0;
    months = parseInt(months, 10) || 0;
    days = parseInt(days, 10) || 0;
    var totalYears = years + months / 12 + days / 365;
    if (!(principal > 0) || !(annualRatePct > 0) || !(compoundsPerYear > 0) || !(totalYears > 0)) {
      return { error: "Invalid FD inputs" };
    }
    var r = annualRatePct / 100;
    var n = compoundsPerYear;
    var maturity = principal * Math.pow(1 + r / n, n * totalYears);
    var totalInterest = maturity - principal;
    var apy = (Math.pow(1 + r / n, n) - 1) * 100;

    var fullYears = Math.floor(totalYears);
    var remainder = totalYears - fullYears;
    var rows = [];
    var balance = principal;
    var y;
    for (y = 1; y <= fullYears; y++) {
      var end = principal * Math.pow(1 + r / n, n * y);
      rows.push({
        label: String(y),
        start: balance,
        interest: end - balance,
        end: end
      });
      balance = end;
    }
    if (remainder > 0) {
      var endAll = principal * Math.pow(1 + r / n, n * totalYears);
      var monthsPartial = Math.floor(remainder * 12);
      var daysPartial = Math.round((remainder * 12 - monthsPartial) * 30.44);
      var partialLabel = "";
      if (monthsPartial > 0) partialLabel += monthsPartial + "m ";
      if (daysPartial > 0) partialLabel += daysPartial + "d";
      partialLabel = partialLabel.trim() || (remainder * 12).toFixed(1) + "m";
      rows.push({
        label: fullYears + 1 + " (" + partialLabel + ")",
        start: balance,
        interest: endAll - balance,
        end: endAll
      });
    }

    return {
      maturity: maturity,
      totalInterest: totalInterest,
      apy: apy,
      totalYears: totalYears,
      rows: rows
    };
  }

  /** NPS corpus (annuity-due SIP formula) + 60/40 split pension estimate. */
  function nps(monthly, annualRatePct, years, annuityRatePct) {
    monthly = Number(monthly);
    annualRatePct = Number(annualRatePct);
    years = Number(years);
    annuityRatePct = Number(annuityRatePct);
    if (!(monthly > 0) || !(annualRatePct > 0) || !(years > 0) || !(annuityRatePct > 0)) {
      return { error: "Invalid NPS inputs" };
    }
    var rate = annualRatePct / 100 / 12;
    var months = years * 12;
    var corpus = monthly * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate);
    var invested = monthly * months;
    var gain = corpus - invested;
    var lumpSum = corpus * 0.6;
    var annuityCorpus = corpus * 0.4;
    var monthlyPension = (annuityCorpus * (annuityRatePct / 100)) / 12;
    return {
      corpus: corpus,
      invested: invested,
      gain: gain,
      lumpSum: lumpSum,
      annuityCorpus: annuityCorpus,
      monthlyPension: monthlyPension
    };
  }

  /** Goal-based monthly SIP future value + inflation-adjusted corpus. */
  function goalSip(monthly, annualRatePct, years, inflationPct) {
    monthly = Number(monthly);
    annualRatePct = Number(annualRatePct);
    years = parseInt(years, 10);
    inflationPct = Number(inflationPct);
    if (!(monthly > 0) || !(years > 0) || isNaN(annualRatePct) || annualRatePct < 0 || isNaN(inflationPct) || inflationPct < 0) {
      return { error: "Invalid goal inputs" };
    }
    var r = annualRatePct / 100 / 12;
    var months = years * 12;
    var fv;
    if (r === 0) fv = monthly * months;
    else fv = monthly * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
    var inflationFactor = Math.pow(1 + inflationPct / 100, years);
    var fvReal = fv / inflationFactor;
    return {
      monthly: monthly,
      years: years,
      rate: annualRatePct,
      inflation: inflationPct,
      futureValue: fv,
      futureValueReal: fvReal,
      totalInvested: monthly * months
    };
  }

  /** Bond current yield + approximate YTM. */
  function bondYield(face, couponPct, years, price) {
    face = Number(face);
    couponPct = Number(couponPct);
    years = parseInt(years, 10);
    price = Number(price);
    if (!(face > 0) || isNaN(couponPct) || !(years > 0) || !(price > 0)) {
      return { error: "Invalid bond inputs" };
    }
    var annualCoupon = (face * couponPct) / 100;
    var currentYield = (annualCoupon / price) * 100;
    var ytm = ((annualCoupon + (face - price) / years) / ((face + price) / 2)) * 100;
    return {
      annualCoupon: annualCoupon,
      currentYield: currentYield,
      ytm: ytm
    };
  }

  /** Currency conversion helpers (pure). */
  function validateAmount(amount) {
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) {
      return { ok: false, message: "Please enter a valid amount." };
    }
    return { ok: true, amount: amount };
  }

  function convertWithRate(amount, rate) {
    return Number(amount) * Number(rate);
  }

  var IICalc = {
    round: round,
    sip: sip,
    swp: swp,
    maxSwp: maxSwp,
    fd: fd,
    nps: nps,
    goalSip: goalSip,
    bondYield: bondYield,
    validateAmount: validateAmount,
    convertWithRate: convertWithRate
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = IICalc;
  } else {
    global.IICalc = IICalc;
  }
})(typeof window !== "undefined" ? window : globalThis);
