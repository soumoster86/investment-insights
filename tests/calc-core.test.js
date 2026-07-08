const IICalc = require("../js/calc-core.js");

describe("IICalc.sip", () => {
  test("computes corpus greater than invested for positive returns", () => {
    const r = IICalc.sip(5000, 12, 10, 0);
    expect(r.error).toBeUndefined();
    expect(r.totalInvested).toBe(5000 * 12 * 10);
    expect(r.corpus).toBeGreaterThan(r.totalInvested);
    expect(r.gain).toBeCloseTo(r.corpus - r.totalInvested, 5);
    expect(r.yearlyData).toHaveLength(10);
  });

  test("step-up increases invested amount", () => {
    const flat = IICalc.sip(5000, 12, 5, 0);
    const step = IICalc.sip(5000, 12, 5, 10);
    expect(step.totalInvested).toBeGreaterThan(flat.totalInvested);
    expect(step.corpus).toBeGreaterThan(flat.corpus);
  });

  test("rejects invalid inputs", () => {
    expect(IICalc.sip(0, 12, 10, 0).error).toBeTruthy();
  });
});

describe("IICalc.swp / maxSwp", () => {
  test("SWP reduces corpus over time when withdrawal is high", () => {
    const r = IICalc.swp(1_000_000, 8, 50_000, 5);
    expect(r.error).toBeUndefined();
    expect(r.exhaustedAt).not.toBeNull();
    expect(r.endBalance).toBe(0);
  });

  test("max SWP exhausts corpus near end of period", () => {
    const r = IICalc.maxSwp(1_000_000, 10, 20);
    expect(r.error).toBeUndefined();
    expect(r.maxMonthly).toBeGreaterThan(0);
    // residual near zero at end
    expect(r.endBalance).toBeLessThan(100);
  });

  test("zero rate max SWP is corpus / months", () => {
    const r = IICalc.maxSwp(120_000, 0, 10);
    expect(r.maxMonthly).toBeCloseTo(1000, 5);
  });
});

describe("IICalc.fd", () => {
  test("maturity exceeds principal", () => {
    const r = IICalc.fd(100000, 7, 4, 5, 0, 0);
    expect(r.error).toBeUndefined();
    expect(r.maturity).toBeGreaterThan(100000);
    expect(r.totalInterest).toBeCloseTo(r.maturity - 100000, 5);
    expect(r.apy).toBeGreaterThan(7); // quarterly compounding > nominal for APY? actually APY > nominal when n>1
    expect(r.rows.length).toBeGreaterThanOrEqual(5);
  });

  test("rejects zero tenure", () => {
    expect(IICalc.fd(100000, 7, 4, 0, 0, 0).error).toBeTruthy();
  });
});

describe("IICalc.nps", () => {
  test("60/40 split and pension", () => {
    const r = IICalc.nps(10000, 10, 30, 6);
    expect(r.error).toBeUndefined();
    expect(r.lumpSum).toBeCloseTo(r.corpus * 0.6, 5);
    expect(r.annuityCorpus).toBeCloseTo(r.corpus * 0.4, 5);
    expect(r.monthlyPension).toBeCloseTo((r.annuityCorpus * 0.06) / 12, 5);
    expect(r.invested).toBe(10000 * 30 * 12);
  });
});

describe("IICalc.goalSip", () => {
  test("inflation-adjusted corpus is below nominal", () => {
    const r = IICalc.goalSip(10000, 12, 15, 6);
    expect(r.error).toBeUndefined();
    expect(r.futureValueReal).toBeLessThan(r.futureValue);
    expect(r.totalInvested).toBe(10000 * 15 * 12);
  });
});

describe("IICalc.bondYield", () => {
  test("current yield and approximate YTM", () => {
    const r = IICalc.bondYield(1000, 8, 10, 950);
    expect(r.error).toBeUndefined();
    expect(r.annualCoupon).toBe(80);
    expect(r.currentYield).toBeCloseTo((80 / 950) * 100, 5);
    expect(r.ytm).toBeGreaterThan(r.currentYield); // discount bond → YTM > current yield
  });
});

describe("IICalc currency helpers", () => {
  test("validateAmount rejects empty", () => {
    const r = IICalc.validateAmount("");
    expect(r.ok).toBe(false);
    expect(r.message).toBe("Please enter a valid amount.");
  });

  test("validateAmount accepts positive", () => {
    expect(IICalc.validateAmount("100").ok).toBe(true);
    expect(IICalc.validateAmount("100").amount).toBe(100);
  });

  test("convertWithRate multiplies", () => {
    expect(IICalc.convertWithRate(10, 83.2)).toBeCloseTo(832, 5);
  });
});
