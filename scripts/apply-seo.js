/**
 * Inject per-page meta description, Open Graph, Twitter, and canonical tags.
 * Usage: node scripts/apply-seo.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://investment-insight.netlify.app";

const PAGES = {
  "index.html": {
    title: "Investment Insights — Learn Investing in India",
    description:
      "Free educational guides and calculators for stocks, mutual funds, SIPs, FDs, NPS, bonds, crypto, ETFs, and goal-based investing in India."
  },
  "stocks.html": {
    title: "Stocks Guide & Recommendations | Investment Insights",
    description:
      "India stocks guide: market caps, orders & metrics, how to start, trade P&L calculator, browser watchlist, and sample names. Educational only."
  },
  "etf.html": {
    title: "ETFs Explained | Investment Insights",
    description:
      "Understand exchange-traded funds (ETFs), how they differ from mutual funds, and key benefits for Indian investors."
  },
  "ipo.html": {
    title: "IPO Guide | Investment Insights",
    description:
      "How IPOs work in India, listing process basics, and illustrative listing-gains charts for educational use."
  },
  "intraday.html": {
    title: "Intraday Trading Overview | Investment Insights",
    description:
      "Educational overview of intraday trading concepts, risks, and terminology for Indian markets."
  },
  "usstocks.html": {
    title: "US Stocks for Indian Investors | Investment Insights",
    description:
      "Introduction to US equity markets for Indian investors, with sample names and live market widgets."
  },
  "mutualfunds.html": {
    title: "Mutual Funds, SIP & SWP Calculators | Investment Insights",
    description:
      "India mutual funds guide: categories, SIP vs lumpsum, key terms, SIP & SWP calculators, browser shortlist, and sample schemes. Educational only."
  },
  "fixeddeposit.html": {
    title: "Fixed Deposit Guide & FD Calculator | Investment Insights",
    description:
      "How bank FDs work, compounding choices, and an FD maturity calculator with year-wise breakdown."
  },
  "nps.html": {
    title: "NPS (National Pension System) Calculator | Investment Insights",
    description:
      "Learn about NPS for retirement planning in India and estimate corpus, lump sum, and pension with the NPS calculator."
  },
  "cryptocurrencies.html": {
    title: "Cryptocurrency Overview | Investment Insights",
    description:
      "Educational intro to crypto assets, risks, and sample coins you can search by category."
  },
  "bonds.html": {
    title: "Bonds Guide & Yield Calculator | Investment Insights",
    description:
      "India bonds guide: G-Secs, corporates, ratings, yield & YTM calculator, bond ladder planner, and educational product notes. Not advice."
  },
  "investmentgoal.html": {
    title: "Investment Goal Planner | Investment Insights",
    description:
      "Plan to a target SIP or project corpus from monthly investing. Templates, inflation adjust, scenarios, and a home dashboard snapshot. Educational only."
  },
  "contact.html": {
    title: "Contact | Investment Insights",
    description:
      "Contact Investment Insights with questions or feedback about the educational content and calculators."
  },
  "learn.html": {
    title: "Learn Investing | Investment Insights",
    description:
      "Educational path for Indian investors: basics, risk, PPF, emergency fund, tax overview, gold, index vs active, plus product guides."
  },
  "calculators.html": {
    title: "Investment Calculators | Investment Insights",
    description:
      "Free SIP, SWP, FD, NPS, goal planner, and bond yield calculators with transparent assumptions for educational use."
  },
  "tools.html": {
    title: "EMI, PPF, RD & More Calculators | Investment Insights",
    description:
      "Free EMI, lumpsum, CAGR, inflation, target SIP, PPF, and recurring deposit calculators for educational planning in India."
  },
  "basics.html": {
    title: "How to Start Investing in India | Investment Insights",
    description:
      "Beginner guide: emergency fund, KYC, Demat basics, and setting up your first SIP in India. Educational only."
  },
  "risk-allocation.html": {
    title: "Risk & Asset Allocation Basics | Investment Insights",
    description:
      "Learn investment risk types, diversification, sample allocations by time horizon, and rebalancing — educational framework only."
  },
  "ppf-tax-saving.html": {
    title: "PPF & Tax-Saving Basics | Investment Insights",
    description:
      "Educational overview of PPF and Section 80C-style options in India. Not tax advice — verify with official sources."
  },
  "insurance-emergency.html": {
    title: "Emergency Fund & Insurance Basics | Investment Insights",
    description:
      "Build an emergency fund and understand term life and health insurance basics for Indian households. Educational only — not advice."
  },
  "tax-overview.html": {
    title: "Tax Overview for Investors (India) | Investment Insights",
    description:
      "High-level educational map of how Indian investors often encounter tax: regimes, capital gains concepts, and reporting hygiene. Not tax advice."
  },
  "gold.html": {
    title: "Gold Investing in India | Investment Insights",
    description:
      "Educational guide to gold as an asset: physical jewellery vs coins, gold ETFs, sovereign gold bonds, and portfolio role for Indian investors."
  },
  "index-vs-active.html": {
    title: "Index Funds vs Active Funds | Investment Insights",
    description:
      "Learn the difference between index (passive) and active mutual funds/ETFs: costs, tracking, and how investors compare them. Educational only."
  }
};

const SEO_START = "<!-- BEGIN SEO -->";
const SEO_END = "<!-- END SEO -->";

function seoBlock(file, meta) {
  const canonical =
    file === "index.html" ? SITE + "/" : SITE + "/" + file;
  const title = meta.title;
  const desc = meta.description;
  return [
    SEO_START,
    `  <meta name="description" content="${desc}" />`,
    `  <link rel="canonical" href="${canonical}" />`,
    `  <meta property="og:type" content="website" />`,
    `  <meta property="og:site_name" content="Investment Insights" />`,
    `  <meta property="og:title" content="${title}" />`,
    `  <meta property="og:description" content="${desc}" />`,
    `  <meta property="og:url" content="${canonical}" />`,
    `  <meta property="og:image" content="${SITE}/logo.png" />`,
    `  <meta name="twitter:card" content="summary" />`,
    `  <meta name="twitter:title" content="${title}" />`,
    `  <meta name="twitter:description" content="${desc}" />`,
    SEO_END
  ].join("\n");
}

let n = 0;
for (const [file, meta] of Object.entries(PAGES)) {
  const fp = path.join(ROOT, file);
  if (!fs.existsSync(fp)) {
    console.warn("skip missing", file);
    continue;
  }
  let html = fs.readFileSync(fp, "utf8");

  // Update <title>
  if (/<title>[^<]*<\/title>/i.test(html)) {
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${meta.title}</title>`);
  }

  const block = seoBlock(file, meta);
  if (html.includes(SEO_START)) {
    html = html.replace(
      new RegExp(SEO_START + "[\\s\\S]*?" + SEO_END),
      block
    );
  } else {
    // Insert after <title>…</title> or after charset/viewport
    if (/<\/title>/i.test(html)) {
      html = html.replace(/<\/title>/i, `</title>\n${block}`);
    } else {
      html = html.replace(
        /<meta\s+name=["']viewport["'][^>]*>/i,
        (m) => m + "\n" + block
      );
    }
  }

  // Ensure lang attribute
  html = html.replace(/<html\b([^>]*)>/i, (m, attrs) => {
    if (/\blang=/.test(attrs)) return m;
    return `<html lang="en"${attrs}>`;
  });

  fs.writeFileSync(fp, html, "utf8");
  n++;
  console.log("SEO →", file);
}
console.log(`Done. Updated ${n} pages.`);
