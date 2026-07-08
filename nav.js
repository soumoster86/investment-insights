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
      if (label) label.textContent = "Light Mode";
      if (toggle) toggle.checked = true;
    } else {
      document.body.classList.remove("dark-mode");
      if (label) label.textContent = "Dark Mode";
      if (toggle) toggle.checked = false;
    }
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

    // The dropdown toggle expands inline on touch instead of navigating.
    var ddToggle = nav.querySelector(".dropdown-toggle");
    var dd = nav.querySelector(".dropdown");
    if (ddToggle && dd) {
      ddToggle.addEventListener("click", function (e) {
        if (window.matchMedia("(max-width: 820px)").matches) {
          e.preventDefault();
          dd.classList.toggle("open");
        }
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- Active link highlighting ---------- */
  function initActiveLink() {
    var path = window.location.pathname;
    document.querySelectorAll(".main-nav a").forEach(function (link) {
      link.classList.remove("active");
      var href = link.getAttribute("href") || "";
      if (href && !href.startsWith("#") && path.endsWith(href)) {
        link.classList.add("active");
      }
    });
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
