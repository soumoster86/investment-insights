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
    var yearlyInvested = [];
    var labels = [];
    var y, m;
    for (y = 1; y <= years; y++) {
      for (m = 1; m <= 12; m++) {
        corpus = (corpus + currP) * (1 + r);
        totalInvested += currP;
      }
      yearlyData.push(corpus);
      yearlyInvested.push(totalInvested);
      labels.push("Year " + y);
      currP *= 1 + stepupPct / 100;
    }
    var gain = corpus - totalInvested;
    // Money-weighted annual return (XIRR). Every deposit compounds at the
    // same monthly rate, so the XIRR equals the effective annual rate —
    // independent of step-up. (The old corpus/invested "CAGR" understated
    // returns because later deposits haven't been invested for `years`.)
    var xirr = (Math.pow(1 + r, 12) - 1) * 100;
    var absoluteReturnPct = totalInvested > 0 ? (gain / totalInvested) * 100 : 0;
    return {
      totalInvested: totalInvested,
      corpus: corpus,
      gain: gain,
      xirr: xirr,
      absoluteReturnPct: absoluteReturnPct,
      yearlyData: yearlyData,
      yearlyInvested: yearlyInvested,
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

  /**
   * Loan EMI (reducing balance).
   * principal, annualRatePct, tenureYears (or pass months via tenureMonths).
   */
  function emi(principal, annualRatePct, tenureYears, tenureMonths) {
    principal = Number(principal);
    annualRatePct = Number(annualRatePct);
    var years = parseInt(tenureYears, 10) || 0;
    var monthsExtra = parseInt(tenureMonths, 10) || 0;
    var n = years * 12 + monthsExtra;
    if (!(principal > 0) || isNaN(annualRatePct) || annualRatePct < 0 || !(n > 0)) {
      return { error: "Please enter a valid loan amount, rate, and tenure." };
    }
    var r = annualRatePct / 100 / 12;
    var monthly;
    if (r === 0) monthly = principal / n;
    else monthly = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    var totalPayment = monthly * n;
    var totalInterest = totalPayment - principal;
    // Year-wise outstanding (end of each full year)
    var schedule = [];
    var bal = principal;
    var m;
    for (m = 1; m <= n; m++) {
      var interest = bal * r;
      var principalPart = monthly - interest;
      bal = Math.max(0, bal - principalPart);
      if (m % 12 === 0 || m === n) {
        schedule.push({
          period: m === n && m % 12 !== 0 ? "Month " + m : "Year " + Math.ceil(m / 12),
          paid: monthly * m,
          balance: bal
        });
      }
    }
    return {
      monthlyEmi: monthly,
      totalPayment: totalPayment,
      totalInterest: totalInterest,
      principal: principal,
      months: n,
      schedule: schedule
    };
  }

  /** One-time lumpsum future value at annual rate, compounded yearly. */
  function lumpsum(principal, annualRatePct, years) {
    principal = Number(principal);
    annualRatePct = Number(annualRatePct);
    years = Number(years);
    if (!(principal > 0) || isNaN(annualRatePct) || annualRatePct < 0 || !(years > 0)) {
      return { error: "Please enter a valid investment amount, return, and years." };
    }
    var r = annualRatePct / 100;
    var fv = principal * Math.pow(1 + r, years);
    var gain = fv - principal;
    var yearly = [];
    var y;
    for (y = 1; y <= Math.ceil(years); y++) {
      var t = Math.min(y, years);
      yearly.push({ year: y, value: principal * Math.pow(1 + r, t) });
    }
    return {
      futureValue: fv,
      gain: gain,
      principal: principal,
      years: years,
      cagr: annualRatePct,
      yearly: yearly
    };
  }

  /** CAGR from present and future values over years. */
  function cagr(presentValue, futureValue, years) {
    presentValue = Number(presentValue);
    futureValue = Number(futureValue);
    years = Number(years);
    if (!(presentValue > 0) || !(futureValue > 0) || !(years > 0)) {
      return { error: "Please enter valid start and end values and years." };
    }
    var rate = (Math.pow(futureValue / presentValue, 1 / years) - 1) * 100;
    return { cagr: rate, presentValue: presentValue, futureValue: futureValue, years: years };
  }

  /**
   * Inflation impact.
   * futureCost of today's amount; realValue of a future nominal amount.
   */
  function inflation(amount, inflationPct, years) {
    amount = Number(amount);
    inflationPct = Number(inflationPct);
    years = Number(years);
    if (!(amount > 0) || isNaN(inflationPct) || inflationPct < 0 || !(years > 0)) {
      return { error: "Please enter a valid amount, inflation rate, and years." };
    }
    var factor = Math.pow(1 + inflationPct / 100, years);
    return {
      amount: amount,
      years: years,
      inflationPct: inflationPct,
      futureCost: amount * factor,
      realValue: amount / factor,
      purchasingPowerLossPct: (1 - 1 / factor) * 100
    };
  }

  /**
   * PPF-style annual deposit (simplified educational model).
   * Deposit assumed at start of each year; interest compounded yearly.
   * Default horizon often 15 years in India; rate is user-input.
   */
  function ppf(annualDeposit, annualRatePct, years) {
    annualDeposit = Number(annualDeposit);
    annualRatePct = Number(annualRatePct);
    years = parseInt(years, 10);
    if (!(annualDeposit > 0) || isNaN(annualRatePct) || annualRatePct < 0 || !(years > 0)) {
      return { error: "Please enter a valid yearly deposit, rate, and years." };
    }
    var r = annualRatePct / 100;
    var balance = 0;
    var invested = 0;
    var yearly = [];
    var y;
    for (y = 1; y <= years; y++) {
      balance = (balance + annualDeposit) * (1 + r);
      invested += annualDeposit;
      yearly.push({ year: y, invested: invested, balance: balance });
    }
    return {
      maturity: balance,
      invested: invested,
      interest: balance - invested,
      years: years,
      yearly: yearly
    };
  }

  /**
   * Bank RD: monthly deposit for `months`, interest compounded quarterly (common in India).
   * Simplified: monthly rate from annual, compound monthly (educational approximation).
   */
  function rd(monthlyDeposit, annualRatePct, months) {
    monthlyDeposit = Number(monthlyDeposit);
    annualRatePct = Number(annualRatePct);
    months = parseInt(months, 10);
    if (!(monthlyDeposit > 0) || isNaN(annualRatePct) || annualRatePct < 0 || !(months > 0)) {
      return { error: "Please enter a valid monthly deposit, rate, and months." };
    }
    var r = annualRatePct / 100 / 12;
    var balance = 0;
    var invested = 0;
    var m;
    for (m = 1; m <= months; m++) {
      balance = (balance + monthlyDeposit) * (1 + r);
      invested += monthlyDeposit;
    }
    return {
      maturity: balance,
      invested: invested,
      interest: balance - invested,
      months: months,
      monthlyDeposit: monthlyDeposit
    };
  }

  /**
   * Target corpus reverse SIP: monthly needed to reach goal.
   * FV of annuity-due: P * (((1+r)^n - 1) / r) * (1+r) = goal
   */
  function sipForGoal(goalAmount, annualRatePct, years) {
    goalAmount = Number(goalAmount);
    annualRatePct = Number(annualRatePct);
    years = parseInt(years, 10);
    if (!(goalAmount > 0) || isNaN(annualRatePct) || annualRatePct < 0 || !(years > 0)) {
      return { error: "Please enter a valid goal amount, return, and years." };
    }
    var r = annualRatePct / 100 / 12;
    var n = years * 12;
    var monthly;
    if (r === 0) monthly = goalAmount / n;
    else monthly = goalAmount / ((((Math.pow(1 + r, n) - 1) / r) * (1 + r)));
    return {
      monthlySip: monthly,
      goalAmount: goalAmount,
      years: years,
      totalInvested: monthly * n
    };
  }

  /**
   * Simple stock trade P&amp;L (educational). Fees are a single total for both legs.
   * buyPrice, sellPrice, qty &gt; 0; fees &gt;= 0 optional.
   */
  function stockPnL(buyPrice, qty, sellPrice, fees) {
    buyPrice = Number(buyPrice);
    qty = Number(qty);
    sellPrice = Number(sellPrice);
    fees = Number(fees) || 0;
    if (!(buyPrice > 0) || !(qty > 0) || !(sellPrice > 0) || fees < 0 || isNaN(fees)) {
      return { error: "Invalid trade inputs" };
    }
    var invested = buyPrice * qty;
    var proceeds = sellPrice * qty;
    var gross = proceeds - invested;
    var net = gross - fees;
    var retPct = invested > 0 ? (net / invested) * 100 : 0;
    return {
      invested: invested,
      proceeds: proceeds,
      grossPnL: gross,
      fees: fees,
      netPnL: net,
      returnPct: retPct
    };
  }

  /**
   * Home purchase sketch: day-one cash + EMI on the loan portion.
   * price, downPct (0-100), stampPct, regPct, otherCosts, ratePct, years, monthlyIncome optional.
   */
  function homeBuy(price, downPct, stampPct, regPct, otherCosts, ratePct, years, monthlyIncome) {
    price = Number(price);
    downPct = Number(downPct);
    stampPct = Number(stampPct) || 0;
    regPct = Number(regPct) || 0;
    otherCosts = Number(otherCosts) || 0;
    ratePct = Number(ratePct);
    years = parseInt(years, 10);
    monthlyIncome = Number(monthlyIncome) || 0;
    if (
      !(price > 0) ||
      isNaN(downPct) ||
      downPct < 0 ||
      downPct >= 100 ||
      isNaN(ratePct) ||
      ratePct < 0 ||
      !(years > 0)
    ) {
      return { error: "Please enter a valid property price, down payment %, rate, and years." };
    }
    var downPayment = (price * downPct) / 100;
    var loan = price - downPayment;
    var stampDuty = (price * stampPct) / 100;
    var registration = (price * regPct) / 100;
    var closingCosts = stampDuty + registration + otherCosts;
    var dayOneCash = downPayment + closingCosts;
    var loanCalc = emi(loan, ratePct, years, 0);
    if (loanCalc.error) return loanCalc;
    var emiShare =
      monthlyIncome > 0 ? (loanCalc.monthlyEmi / monthlyIncome) * 100 : null;
    return {
      price: price,
      downPayment: downPayment,
      loan: loan,
      stampDuty: stampDuty,
      registration: registration,
      otherCosts: otherCosts,
      closingCosts: closingCosts,
      dayOneCash: dayOneCash,
      monthlyEmi: loanCalc.monthlyEmi,
      totalInterest: loanCalc.totalInterest,
      totalPayment: loanCalc.totalPayment,
      months: loanCalc.months,
      emiSharePct: emiShare,
      schedule: loanCalc.schedule
    };
  }

  /**
   * Option P&amp;L at expiry (per lot * lots). Educational; ignores margin and greeks.
   * optionType: "call"|"put", side: "buy"|"sell"
   */
  function optionExpiryPnL(optionType, side, strike, premium, spot, lotSize, lots) {
    optionType = String(optionType || "call").toLowerCase();
    side = String(side || "buy").toLowerCase();
    strike = Number(strike);
    premium = Number(premium);
    spot = Number(spot);
    lotSize = Number(lotSize);
    lots = Number(lots) || 1;
    if (
      (optionType !== "call" && optionType !== "put") ||
      (side !== "buy" && side !== "sell") ||
      !(strike > 0) ||
      !(premium >= 0) ||
      !(spot > 0) ||
      !(lotSize > 0) ||
      !(lots > 0)
    ) {
      return { error: "Please enter valid option type, strike, premium, spot, and lot size." };
    }
    var intrinsic =
      optionType === "call" ? Math.max(spot - strike, 0) : Math.max(strike - spot, 0);
    var perUnitBuyer = intrinsic - premium;
    var perUnit = side === "buy" ? perUnitBuyer : -perUnitBuyer;
    var units = lotSize * lots;
    var pnl = perUnit * units;
    var premiumPaid = premium * units;
    var breakeven =
      optionType === "call"
        ? side === "buy"
          ? strike + premium
          : strike + premium
        : side === "buy"
          ? strike - premium
          : strike - premium;
    var maxLossBuyer = premiumPaid;
    return {
      optionType: optionType,
      side: side,
      strike: strike,
      premium: premium,
      spot: spot,
      lotSize: lotSize,
      lots: lots,
      units: units,
      intrinsic: intrinsic,
      pnl: pnl,
      premiumCash: premiumPaid,
      breakeven: breakeven,
      maxLossIfBuyer: maxLossBuyer,
      isProfit: pnl > 0
    };
  }

  /**
   * Futures-style P&amp;L (educational). pointValue = ₹ per point (often 1 for stock futures).
   * side: "long"|"short"
   */
  function futuresPnL(side, entry, exitPrice, lotSize, lots, pointValue) {
    side = String(side || "long").toLowerCase();
    entry = Number(entry);
    exitPrice = Number(exitPrice);
    lotSize = Number(lotSize);
    lots = Number(lots) || 1;
    pointValue = Number(pointValue);
    if (isNaN(pointValue) || pointValue <= 0) pointValue = 1;
    if (
      (side !== "long" && side !== "short") ||
      !(entry > 0) ||
      !(exitPrice > 0) ||
      !(lotSize > 0) ||
      !(lots > 0)
    ) {
      return { error: "Please enter valid side, entry, exit, and lot size." };
    }
    var points = exitPrice - entry;
    if (side === "short") points = -points;
    var units = lotSize * lots;
    var pnl = points * units * pointValue;
    return {
      side: side,
      entry: entry,
      exit: exitPrice,
      lotSize: lotSize,
      lots: lots,
      pointValue: pointValue,
      points: points,
      units: units,
      pnl: pnl,
      isProfit: pnl > 0
    };
  }

  /**
   * Post Office–style schemes (educational). Rates and rules are user inputs;
   * not official India Post quotes. Tax treatment ignored.
   * scheme: "rd" | "td" | "mis" | "nsc" | "kvp"
   */
  function postOffice(scheme, amount, annualRatePct, years, months) {
    scheme = String(scheme || "rd").toLowerCase();
    amount = Number(amount);
    annualRatePct = Number(annualRatePct);
    years = parseInt(years, 10) || 0;
    months = parseInt(months, 10) || 0;
    if (!(amount > 0) || isNaN(annualRatePct) || annualRatePct < 0) {
      return { error: "Please enter a valid amount and interest rate." };
    }
    var totalMonths = years * 12 + months;
    if (!(totalMonths > 0) && scheme !== "mis") {
      return { error: "Please enter a valid tenure." };
    }

    if (scheme === "rd") {
      if (!(totalMonths > 0)) return { error: "Please enter RD tenure in years or months." };
      var rdRes = rd(amount, annualRatePct, totalMonths);
      if (rdRes.error) return rdRes;
      return {
        scheme: "rd",
        label: "Recurring Deposit",
        maturity: rdRes.maturity,
        invested: rdRes.invested,
        interest: rdRes.interest,
        months: totalMonths,
        monthlyPayout: 0
      };
    }

    if (scheme === "td" || scheme === "nsc" || scheme === "kvp") {
      // Lump sum compounded yearly (educational; real products may use half-yearly)
      if (!(years > 0) && totalMonths > 0) years = Math.max(1, Math.round(totalMonths / 12));
      if (!(years > 0)) return { error: "Please enter tenure in years for this scheme." };
      var r = annualRatePct / 100;
      var maturity = amount * Math.pow(1 + r, years);
      var label =
        scheme === "td" ? "Time Deposit" : scheme === "nsc" ? "NSC-style" : "KVP-style";
      return {
        scheme: scheme,
        label: label,
        maturity: maturity,
        invested: amount,
        interest: maturity - amount,
        years: years,
        monthlyPayout: 0
      };
    }

    if (scheme === "mis") {
      // Monthly income: interest only each month; principal returned at end
      if (!(years > 0) && totalMonths > 0) years = Math.max(1, Math.round(totalMonths / 12));
      if (!(years > 0)) return { error: "Please enter MIS tenure in years." };
      var monthlyRate = annualRatePct / 100 / 12;
      var monthlyInterest = amount * monthlyRate;
      var totalInterest = monthlyInterest * years * 12;
      return {
        scheme: "mis",
        label: "Monthly Income Scheme",
        maturity: amount,
        invested: amount,
        interest: totalInterest,
        years: years,
        monthlyPayout: monthlyInterest,
        totalPayout: totalInterest + amount
      };
    }

    return { error: "Unknown scheme type." };
  }

  /**
   * Commodity round-trip P&amp;L (educational). Same core math as stockPnL.
   * Optional fxRate (INR per 1 unit of price currency) converts results to INR
   * when prices are entered in USD (or another foreign unit).
   */
  function commodityPnL(buyPrice, qty, sellPrice, fees, fxRate) {
    var base = stockPnL(buyPrice, qty, sellPrice, fees);
    if (base.error) return base;
    fxRate = Number(fxRate);
    if (!(fxRate > 0) || isNaN(fxRate)) {
      return {
        currency: "native",
        fxRate: 1,
        invested: base.invested,
        proceeds: base.proceeds,
        grossPnL: base.grossPnL,
        fees: base.fees,
        netPnL: base.netPnL,
        returnPct: base.returnPct
      };
    }
    return {
      currency: "fx",
      fxRate: fxRate,
      invested: base.invested,
      proceeds: base.proceeds,
      grossPnL: base.grossPnL,
      fees: base.fees,
      netPnL: base.netPnL,
      returnPct: base.returnPct,
      investedInr: base.invested * fxRate,
      proceedsInr: base.proceeds * fxRate,
      grossPnLInr: base.grossPnL * fxRate,
      feesInr: base.fees * fxRate,
      netPnLInr: base.netPnL * fxRate
    };
  }

  /**
   * Gold jewellery bill vs pure metal value (educational India sketch).
   * ratePer10g: gold rate for 10 grams; weightG: jewellery weight in grams;
   * makingPct: making charges as % of metal value; gstPct: simplified GST %
   * applied on (metal + making). Other costs optional flat amount.
   */
  function jewelleryGold(ratePer10g, weightG, makingPct, gstPct, otherCosts) {
    ratePer10g = Number(ratePer10g);
    weightG = Number(weightG);
    makingPct = Number(makingPct);
    gstPct = Number(gstPct) || 0;
    otherCosts = Number(otherCosts) || 0;
    if (
      !(ratePer10g > 0) ||
      !(weightG > 0) ||
      isNaN(makingPct) ||
      makingPct < 0 ||
      isNaN(gstPct) ||
      gstPct < 0 ||
      otherCosts < 0
    ) {
      return {
        error: "Enter a valid gold rate, weight, making charges %, and costs."
      };
    }
    var metalValue = ratePer10g * (weightG / 10);
    var making = (metalValue * makingPct) / 100;
    var taxable = metalValue + making;
    var gst = (taxable * gstPct) / 100;
    var totalBill = metalValue + making + gst + otherCosts;
    var metalSharePct = totalBill > 0 ? (metalValue / totalBill) * 100 : 0;
    var nonMetal = totalBill - metalValue;
    return {
      metalValue: metalValue,
      making: making,
      gst: gst,
      otherCosts: otherCosts,
      totalBill: totalBill,
      nonMetal: nonMetal,
      metalSharePct: metalSharePct
    };
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
    convertWithRate: convertWithRate,
    emi: emi,
    lumpsum: lumpsum,
    cagr: cagr,
    inflation: inflation,
    ppf: ppf,
    rd: rd,
    sipForGoal: sipForGoal,
    stockPnL: stockPnL,
    commodityPnL: commodityPnL,
    jewelleryGold: jewelleryGold,
    homeBuy: homeBuy,
    optionExpiryPnL: optionExpiryPnL,
    futuresPnL: futuresPnL,
    postOffice: postOffice
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = IICalc;
  } else {
    global.IICalc = IICalc;
  }
})(typeof window !== "undefined" ? window : globalThis);
