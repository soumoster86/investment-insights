/**
 * localStorage helpers for calculator history + investment goal snapshot.
 * Browser: window.IIStorage
 */
(function (global) {
  "use strict";

  var LAST_KEY = "lastCalculator";
  var GOAL_KEY = "investmentGoal";

  function rememberCalculator(name, link) {
    try {
      global.localStorage.setItem(
        LAST_KEY,
        JSON.stringify({
          name: name,
          date: new Date().toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric"
          }),
          link: link
        })
      );
    } catch (e) { /* private mode / quota */ }
  }

  function getLastCalculator() {
    try {
      var raw = global.localStorage.getItem(LAST_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  /**
   * Snapshot shown on the home dashboard.
   * { monthlySip, years, expectedCorpus, expectedCorpusReal?, rate?, routes? }
   */
  function saveGoalSnapshot(snapshot) {
    try {
      global.localStorage.setItem(
        GOAL_KEY,
        JSON.stringify(
          Object.assign({ savedAt: new Date().toISOString() }, snapshot)
        )
      );
    } catch (e) { /* ignore */ }
  }

  function getGoalSnapshot() {
    try {
      var raw = global.localStorage.getItem(GOAL_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  var IIStorage = {
    rememberCalculator: rememberCalculator,
    getLastCalculator: getLastCalculator,
    saveGoalSnapshot: saveGoalSnapshot,
    getGoalSnapshot: getGoalSnapshot,
    LAST_KEY: LAST_KEY,
    GOAL_KEY: GOAL_KEY
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = IIStorage;
  } else {
    global.IIStorage = IIStorage;
  }
})(typeof window !== "undefined" ? window : globalThis);
