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
    var wrap = document.querySelector(".dm-toggle");
    if (dark) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    // Label always names the control; checked = dark mode is ON
    if (label) label.textContent = "Dark mode";
    if (toggle) toggle.checked = !!dark;
    if (wrap) {
      wrap.setAttribute(
        "aria-label",
        dark ? "Switch to light mode" : "Switch to dark mode"
      );
      wrap.setAttribute("title", dark ? "Switch to light mode" : "Switch to dark mode");
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
      // Move focus into drawer for keyboard users
      if (closeBtn) {
        try { closeBtn.focus(); } catch (e) {}
      }
    }
    function closeNav() {
      nav.classList.remove("open");
      document.body.classList.remove("nav-open");
      if (openBtn) openBtn.setAttribute("aria-expanded", "false");
      nav.querySelectorAll(".dropdown.open").forEach(function (dd) {
        dd.classList.remove("open");
      });
    }

    if (openBtn) {
      openBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (nav.classList.contains("open")) closeNav();
        else openNav();
      });
    }
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
          e.stopPropagation();
          // Close sibling dropdowns so only one is open
          nav.querySelectorAll(".dropdown.open").forEach(function (other) {
            if (other !== dd) other.classList.remove("open");
          });
          dd.classList.toggle("open");
        }
      });
    });

    // Tap scrim / outside drawer to close
    document.addEventListener("click", function (e) {
      if (!document.body.classList.contains("nav-open")) return;
      if (nav.contains(e.target)) return;
      if (openBtn && openBtn.contains(e.target)) return;
      closeNav();
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
      "basics.html": 1,
      "risk-allocation.html": 1,
      "ppf-tax-saving.html": 1,
      "insurance-emergency.html": 1,
      "tax-overview.html": 1,
      "gold.html": 1,
      "index-vs-active.html": 1,
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

  /* ---------- Mobile in-page jump chips ----------
     Side floating-toc is hidden ≤1180px. Clone its links into a sticky
     horizontal chip bar inside <main> so long guides stay navigable. */
  function headerOffset() {
    var raw = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
    var n = parseInt(raw, 10);
    return (isNaN(n) ? 56 : n) + 10;
  }

  function initMobilePageJump() {
    if (document.querySelector(".page-jump")) return;
    var toc = document.getElementById("floating-toc");
    var main = document.getElementById("main-content");
    if (!toc || !main) return;

    var links = toc.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    var bar = document.createElement("nav");
    bar.className = "page-jump";
    bar.setAttribute("aria-label", "On this page");

    var label = document.createElement("div");
    label.className = "page-jump-label";
    label.textContent = "On this page";
    bar.appendChild(label);

    var scroller = document.createElement("div");
    scroller.className = "page-jump-scroller";
    bar.appendChild(scroller);

    var chips = [];
    for (var i = 0; i < links.length; i++) {
      var src = links[i];
      var href = src.getAttribute("href") || "";
      if (href.length < 2) continue;
      var chip = document.createElement("a");
      chip.className = "page-jump-chip";
      chip.href = href;
      chip.textContent = (src.textContent || "").replace(/\s+/g, " ").trim();
      scroller.appendChild(chip);
      chips.push(chip);
    }
    if (!chips.length) return;

    // Optional quick-access strip (stocks family) as secondary chips
    var quick = document.querySelector(
      ".stock-float-menu, .etf-float-menu, .ipo-float-menu, .intraday-float-menu"
    );
    if (quick) {
      var qLinks = quick.querySelectorAll('a[href]');
      if (qLinks.length) {
        var qLabel = document.createElement("div");
        qLabel.className = "page-jump-label page-jump-label-secondary";
        qLabel.textContent = "Related";
        bar.appendChild(qLabel);
        var qScroll = document.createElement("div");
        qScroll.className = "page-jump-scroller";
        bar.appendChild(qScroll);
        for (var q = 0; q < qLinks.length; q++) {
          var qa = qLinks[q];
          var qChip = document.createElement("a");
          qChip.className = "page-jump-chip page-jump-chip-related";
          qChip.href = qa.getAttribute("href");
          qChip.textContent = (qa.textContent || "").replace(/\s+/g, " ").trim();
          qScroll.appendChild(qChip);
        }
      }
    }

    var hero = null;
    var kids = main.children;
    for (var hi = 0; hi < kids.length; hi++) {
      var cn = kids[hi].className || "";
      if (
        cn.indexOf("article-hero") !== -1 ||
        cn.indexOf("hub-hero") !== -1 ||
        cn.indexOf("home-hero") !== -1 ||
        cn.indexOf("dashboard-hero") !== -1
      ) {
        hero = kids[hi];
        break;
      }
    }
    if (hero) {
      hero.insertAdjacentElement("afterend", bar);
    } else {
      main.insertBefore(bar, main.firstChild);
    }

    function scrollToId(id) {
      var el = document.getElementById(id);
      if (!el) return;
      var y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset();
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }

    bar.addEventListener("click", function (e) {
      var t = e.target.closest("a.page-jump-chip");
      if (!t) return;
      var href = t.getAttribute("href") || "";
      if (href.charAt(0) !== "#") return; // external/related pages navigate normally
      e.preventDefault();
      scrollToId(href.slice(1));
      if (history && history.replaceState) {
        try { history.replaceState(null, "", href); } catch (err) {}
      }
    });

    var sectionIds = [];
    for (var s = 0; s < chips.length; s++) {
      var h = chips[s].getAttribute("href") || "";
      if (h.charAt(0) === "#") sectionIds.push(h.slice(1));
    }

    var lastCurrent = "";
    function setActiveChip() {
      if (!sectionIds.length) return;
      var pos = window.pageYOffset + headerOffset() + 24;
      var current = sectionIds[0];
      for (var i = 0; i < sectionIds.length; i++) {
        var sec = document.getElementById(sectionIds[i]);
        if (sec && sec.offsetTop <= pos) current = sectionIds[i];
      }
      for (var c = 0; c < chips.length; c++) {
        var ch = chips[c];
        var on = ch.getAttribute("href") === "#" + current;
        ch.classList.toggle("active", on);
      }
      if (current === lastCurrent) return;
      lastCurrent = current;
      // Keep newly active chip visible in the horizontal scroller
      var active = scroller.querySelector(".page-jump-chip.active");
      if (active && active.scrollIntoView) {
        try {
          active.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
        } catch (err2) {}
      }
    }

    var scrollTick = null;
    window.addEventListener("scroll", function () {
      if (scrollTick) return;
      scrollTick = requestAnimationFrame(function () {
        scrollTick = null;
        setActiveChip();
      });
    }, { passive: true });
    setActiveChip();
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

  /* ---------- Content review stamps (sample-data badges + footer) ---------- */
  function initContentReviewed() {
    var d =
      (window.IIConfig && window.IIConfig.contentReviewed) ||
      "";
    if (!d) {
      var footerTime = document.querySelector(".footer-reviewed time");
      if (footerTime) d = footerTime.getAttribute("datetime") || footerTime.textContent || "";
      d = (d || "").trim();
    }
    if (!d) return;
    document.querySelectorAll("[data-content-reviewed]").forEach(function (el) {
      el.setAttribute("datetime", d);
      el.textContent = d;
    });
    // Keep footer time in sync if config is newer
    document.querySelectorAll(".footer-reviewed time").forEach(function (el) {
      el.setAttribute("datetime", d);
      el.textContent = d;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initDarkMode();
    initNav();
    initActiveLink();
    initBackToTop();
    initMobilePageJump();
    initContentReviewed();
    syncHeaderHeight();
    window.addEventListener("resize", syncHeaderHeight);
    // Re-measure once fonts/emoji settle, which can change wrap height.
    window.addEventListener("load", syncHeaderHeight);
  });
})();
