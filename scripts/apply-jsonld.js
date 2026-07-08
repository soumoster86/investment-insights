/**
 * Inject JSON-LD structured data blocks into key pages.
 * Usage: node scripts/apply-jsonld.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://investment-insight.netlify.app";
const START = "<!-- BEGIN JSON-LD -->";
const END = "<!-- END JSON-LD -->";

function block(data) {
  const json = JSON.stringify(data, null, 2)
    .replace(/</g, "\\u003c");
  return (
    `${START}\n` +
    `  <script type="application/ld+json">\n${json}\n  </script>\n` +
    `${END}`
  );
}

const PAGES = {
  "index.html": block({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Investment Insights",
        url: SITE + "/",
        description:
          "Educational guides and calculators for investing in India — stocks, mutual funds, FDs, NPS, bonds, and more.",
        inLanguage: "en-IN"
      },
      {
        "@type": "Organization",
        name: "Investment Insights",
        url: SITE + "/",
        logo: SITE + "/logo.png",
        description:
          "Independent educational website. Not a SEBI-registered advisor. Content is for learning only."
      }
    ]
  }),
  "mutualfunds.html": block({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Estimate SIP returns with a step-up calculator",
    description:
      "Educational SIP calculator showing invested amount, projected corpus, and gains based on assumed returns.",
    totalTime: "PT2M",
    tool: { "@type": "HowToTool", name: "SIP Calculator on Investment Insights" },
    step: [
      {
        "@type": "HowToStep",
        name: "Enter monthly investment",
        text: "Provide the amount you plan to invest each month."
      },
      {
        "@type": "HowToStep",
        name: "Set expected return and duration",
        text: "Choose an assumed annual return rate and investment period in years."
      },
      {
        "@type": "HowToStep",
        name: "Optional step-up",
        text: "Add an annual increase percentage if you plan to raise SIPs over time."
      },
      {
        "@type": "HowToStep",
        name: "Review projection",
        text: "Read the estimated corpus and yearly breakdown. Results are illustrative, not advice."
      }
    ]
  }),
  "fixeddeposit.html": block({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Calculate fixed deposit maturity",
    description:
      "Educational FD calculator for principal, rate, compounding, and tenure.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter principal and rate",
        text: "Fill in deposit amount and annual interest rate."
      },
      {
        "@type": "HowToStep",
        name: "Choose compounding and tenure",
        text: "Select compounding frequency and years, months, or days."
      },
      {
        "@type": "HowToStep",
        name: "View maturity",
        text: "See maturity amount, interest earned, and year-wise breakdown."
      }
    ]
  }),
  "investmentgoal.html": block({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Plan an investment goal with SIP projections",
    description:
      "Goal planner estimating future corpus with inflation adjustment for educational use.",
    step: [
      {
        "@type": "HowToStep",
        name: "Choose routes and amounts",
        text: "Select investment routes and monthly contribution amounts."
      },
      {
        "@type": "HowToStep",
        name: "Set return, inflation, duration",
        text: "Enter expected return, inflation assumption, and time horizon."
      },
      {
        "@type": "HowToStep",
        name: "Review and save",
        text: "Inspect nominal and inflation-adjusted corpus; snapshot can appear on the home dashboard."
      }
    ]
  }),
  "contact.html": block({
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Investment Insights",
    url: SITE + "/contact.html",
    isPartOf: { "@type": "WebSite", name: "Investment Insights", url: SITE + "/" }
  })
};

let n = 0;
for (const [file, snippet] of Object.entries(PAGES)) {
  const fp = path.join(ROOT, file);
  if (!fs.existsSync(fp)) continue;
  let html = fs.readFileSync(fp, "utf8");
  if (html.includes(START)) {
    html = html.replace(new RegExp(START + "[\\s\\S]*?" + END), snippet);
  } else if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `  ${snippet}\n</head>`);
  } else {
    continue;
  }
  fs.writeFileSync(fp, html, "utf8");
  n++;
  console.log("JSON-LD →", file);
}
console.log(`Updated ${n} pages.`);
