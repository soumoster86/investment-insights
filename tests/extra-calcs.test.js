const IICalc = require("../js/calc-core.js");

describe("IICalc.emi", () => {
  test("EMI total exceeds principal when rate > 0", () => {
    const r = IICalc.emi(1000000, 10, 10, 0);
    expect(r.error).toBeUndefined();
    expect(r.monthlyEmi).toBeGreaterThan(0);
    expect(r.totalPayment).toBeGreaterThan(1000000);
    expect(r.totalInterest).toBeCloseTo(r.totalPayment - 1000000, 5);
    expect(r.months).toBe(120);
  });

  test("zero rate EMI is principal / months", () => {
    const r = IICalc.emi(120000, 0, 1, 0);
    expect(r.monthlyEmi).toBeCloseTo(10000, 5);
  });
});

describe("IICalc.lumpsum / cagr", () => {
  test("lumpsum doubles roughly at 7.2% for 10y (rule of 72)", () => {
    const r = IICalc.lumpsum(100000, 7.2, 10);
    expect(r.futureValue).toBeGreaterThan(190000);
    expect(r.futureValue).toBeLessThan(210000);
  });

  test("cagr recovers rate from lumpsum", () => {
    const fv = IICalc.lumpsum(50000, 12, 8).futureValue;
    const c = IICalc.cagr(50000, fv, 8);
    expect(c.cagr).toBeCloseTo(12, 5);
  });
});

describe("IICalc.inflation", () => {
  test("future cost rises with inflation", () => {
    const r = IICalc.inflation(100000, 6, 10);
    expect(r.futureCost).toBeGreaterThan(100000);
    expect(r.realValue).toBeLessThan(100000);
    expect(r.purchasingPowerLossPct).toBeGreaterThan(0);
  });
});

describe("IICalc.ppf", () => {
  test("maturity exceeds deposits", () => {
    const r = IICalc.ppf(150000, 7.1, 15);
    expect(r.invested).toBe(150000 * 15);
    expect(r.maturity).toBeGreaterThan(r.invested);
    expect(r.interest).toBeCloseTo(r.maturity - r.invested, 5);
    expect(r.yearly).toHaveLength(15);
  });
});

describe("IICalc.rd", () => {
  test("RD maturity exceeds deposits", () => {
    const r = IICalc.rd(5000, 6.5, 36);
    expect(r.invested).toBe(5000 * 36);
    expect(r.maturity).toBeGreaterThan(r.invested);
  });
});

describe("IICalc.sipForGoal", () => {
  test("required SIP produces ballpark goal via sip()", () => {
    const need = IICalc.sipForGoal(5_000_000, 12, 15);
    expect(need.error).toBeUndefined();
    const fwd = IICalc.sip(need.monthlySip, 12, 15, 0);
    expect(fwd.corpus / 5_000_000).toBeGreaterThan(0.98);
    expect(fwd.corpus / 5_000_000).toBeLessThan(1.02);
  });
});
