/**
 * Mutual funds page: browser shortlist for educational fund names.
 */
(function () {
  "use strict";

  var KEY = "iiMfShortlist";

  function $(id) {
    return document.getElementById(id);
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return [];
      var list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function save(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) { /* ignore */ }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isOn(name) {
    return load().some(function (x) {
      return x.name === name;
    });
  }

  function toggle(item) {
    var list = load();
    var i = list.findIndex(function (x) {
      return x.name === item.name;
    });
    if (i >= 0) list.splice(i, 1);
    else {
      list.push({
        name: item.name,
        type: item.type || "",
        risk: item.risk || "",
        url: item.url || "",
        addedAt: new Date().toISOString()
      });
    }
    save(list);
    render();
    syncButtons();
  }

  function render() {
    var host = $("mf-shortlist");
    var empty = $("mf-shortlist-empty");
    var count = $("mf-shortlist-count");
    if (!host) return;
    var list = load();
    if (count) count.textContent = String(list.length);
    if (!list.length) {
      host.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    host.innerHTML = list
      .map(function (f) {
        var link = f.url
          ? '<a href="' +
            f.url.replace(/"/g, "") +
            '" target="_blank" rel="noopener noreferrer" class="btn btn-sm">Details</a>'
          : "";
        return (
          '<article class="watch-card">' +
          "<div><strong>" +
          escapeHtml(f.name) +
          "</strong>" +
          (f.type
            ? ' <span class="mf-type-chip">' + escapeHtml(f.type) + "</span>"
            : "") +
          (f.risk
            ? ' <span class="mf-risk-chip">' + escapeHtml(f.risk) + "</span>"
            : "") +
          "</div>" +
          '<div class="watch-card-actions">' +
          link +
          '<button type="button" class="btn secondary btn-sm mf-shortlist-remove" data-name="' +
          escapeHtml(f.name) +
          '">Remove</button>' +
          "</div></article>"
        );
      })
      .join("");
  }

  function syncButtons() {
    document.querySelectorAll(".mf-watch-btn").forEach(function (btn) {
      var name = btn.getAttribute("data-name");
      var on = isOn(name);
      btn.textContent = on ? "★ Shortlisted" : "☆ Shortlist";
      btn.classList.toggle("is-watching", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    render();
    document.addEventListener("click", function (e) {
      var add = e.target.closest(".mf-watch-btn");
      if (add) {
        e.preventDefault();
        toggle({
          name: add.getAttribute("data-name"),
          type: add.getAttribute("data-type"),
          risk: add.getAttribute("data-risk"),
          url: add.getAttribute("data-url")
        });
        return;
      }
      var rm = e.target.closest(".mf-shortlist-remove");
      if (rm) {
        e.preventDefault();
        toggle({ name: rm.getAttribute("data-name") });
      }
    });
    var clearBtn = $("mf-shortlist-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        save([]);
        render();
        syncButtons();
      });
    }
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (document.querySelector(".mf-watch-btn") || tries > 40) {
        clearInterval(t);
        syncButtons();
      }
    }, 100);
  });
})();
