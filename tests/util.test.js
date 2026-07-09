const IIUtil = require("../js/util.js");

describe("IIUtil.escapeHtml", () => {
  test("escapes &, <, >, and quotes", () => {
    expect(IIUtil.escapeHtml('<a href="x">Tom & Jerry</a>')).toBe(
      "&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&lt;/a&gt;"
    );
  });

  test("coerces non-strings", () => {
    expect(IIUtil.escapeHtml(42)).toBe("42");
    expect(IIUtil.escapeHtml(null)).toBe("null");
  });
});

describe("IIUtil.formatINR", () => {
  test("uses en-IN grouping with no decimals by default", () => {
    expect(IIUtil.formatINR(1234567)).toBe("₹12,34,567");
  });

  test("rounds to max digits", () => {
    expect(IIUtil.formatINR(100.546, 2)).toBe("₹100.55");
    expect(IIUtil.formatINR(100.5)).toBe("₹101");
  });

  test("fixed decimals when minDigits = digits", () => {
    expect(IIUtil.formatINR(5, 2, 2)).toBe("₹5.00");
  });

  test("returns em dash for null / NaN", () => {
    expect(IIUtil.formatINR(null)).toBe("—");
    expect(IIUtil.formatINR("abc")).toBe("—");
  });
});

describe("IIUtil.formatPct", () => {
  test("two decimals by default", () => {
    expect(IIUtil.formatPct(12.6825)).toBe("12.68%");
    expect(IIUtil.formatPct(7, 1)).toBe("7.0%");
  });

  test("returns em dash for null / NaN", () => {
    expect(IIUtil.formatPct(null)).toBe("—");
    expect(IIUtil.formatPct(NaN)).toBe("—");
  });
});
