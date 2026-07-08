const IICalc = require("../js/calc-core.js");

test("shows validation message for invalid amount", () => {
  const result = IICalc.validateAmount("");
  expect(result.ok).toBe(false);
  expect(result.message).toBe("Please enter a valid amount.");
});

test("rejects zero and negative amounts", () => {
  expect(IICalc.validateAmount("0").ok).toBe(false);
  expect(IICalc.validateAmount("-5").ok).toBe(false);
});
