/* ============================================================
   Investment Insights — shared behaviour
   Loaded with `defer` on every page. Every lookup is null-checked
   so a page that lacks a given element never throws (which was
   previously breaking all later inline scripts).
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Dark mode ---------- */
  function setMode(dark) {
    var label = document.getElementById("dm-label");
    var toggle = document.getElementById("darkmode-toggle");
    if (dark) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    // Label always names the control; checked = dark mode is ON
    if (label) label.textContent = "Dark mode";
    if (toggle) toggle.checked = !!dark;
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
  }

  function initDarkMode() {
    var toggle = document.getElementById("darkmode-toggle");
    if (toggle) {
      toggle.addEventListener("change", function () { setMode(this.checked); });
    }
    var pref = null;
    try { pref = localStorage.getItem("theme"); } catch (e) {}
    var prefersDark = pref === "dark" ||
      (!pref && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setMode(prefersDark);
  }

  /* ---------- Mobile navigation drawer ---------- */
  function initNav() {
    var nav = document.getElementById("main-nav");
    var openBtn = document.getElementById("nav-toggle");
    var closeBtn = document.getElementById("nav-close");
    if (!nav) return;

    function openNav() {
      nav.classList.add("open");
      document.body.classList.add("nav-open");
      if (openBtn) openBtn.setAttribute("aria-expanded", "true");
    }
    function closeNav() {
      nav.classList.remove("open");
      document.body.classList.remove("nav-open");
      if (openBtn) openBtn.setAttribute("aria-expanded", "false");
    }

    if (openBtn) openBtn.addEventListener("click", openNav);
    if (closeBtn) closeBtn.addEventListener("click", closeNav);

    // Tapping a normal link closes the drawer.
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (!link.classList.contains("dropdown-toggle")) closeNav();
      });
    });

    // Dropdown toggles expand inline on touch/mobile instead of navigating.
    // Support multiple dropdowns (Learn, Calculators).
    nav.querySelectorAll(".dropdown").forEach(function (dd) {
      var ddToggle = dd.querySelector(".dropdown-toggle");
      if (!ddToggle) return;
      ddToggle.addEventListener("click", function (e) {
        if (window.matchMedia("(max-width: 820px)").matches) {
          e.preventDefault();
          // Close sibling dropdowns so only one is open
          nav.querySelectorAll(".dropdown.open").forEach(function (other) {
            if (other !== dd) other.classList.remove("open");
          });
          dd.classList.toggle("open");
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- Active link highlighting ---------- */
  function initActiveLink() {
    var path = window.location.pathname;
    var file = path.split("/").pop() || "index.html";
    if (!file || file === "/") file = "index.html";

    document.querySelectorAll(".main-nav a").forEach(function (link) {
      link.classList.remove("active");
      var href = (link.getAttribute("href") || "").split("#")[0];
      if (href && (path.endsWith(href) || file === href)) {
        link.classList.add("active");
      }
    });

    // Highlight Learn / Calculators parents when on child pages
    var learnFiles = {
      "learn.html": 1,
      "stocks.html": 1,
      "etf.html": 1,
      "ipo.html": 1,
      "intraday.html": 1,
      "usstocks.html": 1,
      "mutualfunds.html": 1,
      "fixeddeposit.html": 1,
      "nps.html": 1,
      "bonds.html": 1,
      "cryptocurrencies.html": 1
    };
    var calcFiles = {
      "calculators.html": 1,
      "investmentgoal.html": 1,
      "tools.html": 1
    };
    var learnToggle = document.querySelector('.dropdown-toggle[href="learn.html"]');
    var calcToggle = document.querySelector('.dropdown-toggle[href="calculators.html"]');
    if (learnToggle && learnFiles[file]) learnToggle.classList.add("active");
    if (calcToggle && calcFiles[file]) calcToggle.classList.add("active");
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    var btn = document.getElementById("back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      btn.style.display = window.scrollY > 400 ? "flex" : "none";
    });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Keep --header-h in sync with the real header ----------
     The header wraps to two rows at most widths, so a hardcoded height
     is wrong and the floating side boxes ride up under it. Measure the
     actual rendered header and publish it as the CSS variable that the
     boxes (and scroll-padding) are positioned from. */
  function syncHeaderHeight() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var h = Math.round(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--header-h", h + "px");
  }

  document.addEventListener("DOMContentLoaded", function () {
    initDarkMode();
    initNav();
    initActiveLink();
    initBackToTop();
    syncHeaderHeight();
    window.addEventListener("resize", syncHeaderHeight);
    // Re-measure once fonts/emoji settle, which can change wrap height.
    window.addEventListener("load", syncHeaderHeight);
  });
})();
