/** Minimal localStorage polyfill for Node. */
function installLocalStorage() {
  const store = {};
  global.localStorage = {
    getItem(k) {
      return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null;
    },
    setItem(k, v) {
      store[k] = String(v);
    },
    removeItem(k) {
      delete store[k];
    },
    clear() {
      Object.keys(store).forEach((k) => delete store[k]);
    }
  };
}

installLocalStorage();
// Re-require after polyfill so the module sees localStorage on globalThis
delete require.cache[require.resolve("../js/storage.js")];
const IIStorage = require("../js/storage.js");

describe("IIStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("rememberCalculator and getLastCalculator", () => {
    IIStorage.rememberCalculator("SIP Calculator", "mutualfunds.html");
    const last = IIStorage.getLastCalculator();
    expect(last).not.toBeNull();
    expect(last.name).toBe("SIP Calculator");
    expect(last.link).toBe("mutualfunds.html");
    expect(last.date).toBeTruthy();
  });

  test("saveGoalSnapshot and getGoalSnapshot", () => {
    IIStorage.saveGoalSnapshot({
      monthlySip: 10000,
      years: 15,
      expectedCorpus: 5000000
    });
    const snap = IIStorage.getGoalSnapshot();
    expect(snap.monthlySip).toBe(10000);
    expect(snap.years).toBe(15);
    expect(snap.expectedCorpus).toBe(5000000);
    expect(snap.savedAt).toBeTruthy();
  });
});
