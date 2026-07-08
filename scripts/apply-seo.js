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
      "Learn how stock investing works in India, risks and benefits, plus educational stock picks you can search and filter by sector."
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
      "Mutual fund basics plus SIP and SWP calculators. Search and filter educational fund recommendations by type and risk."
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
      "Bond investing basics for India plus a simple current yield and approximate YTM calculator."
  },
  "investmentgoal.html": {
    title: "Investment Goal Planner | Investment Insights",
    description:
      "Plan a goal-based SIP, project corpus with inflation adjustment, and save a snapshot to your dashboard."
  },
  "contact.html": {
    title: "Contact | Investment Insights",
    description:
      "Contact Investment Insights with questions or feedback about the educational content and calculators."
  },
  "learn.html": {
    title: "Learn Investing | Investment Insights",
    description:
      "Browse educational guides on stocks, mutual funds, FDs, NPS, bonds, ETFs, IPOs, US stocks, and crypto for Indian investors."
  },
  "calculators.html": {
    title: "Investment Calculators | Investment Insights",
    description:
      "Free SIP, SWP, FD, NPS, goal planner, and bond yield calculators with transparent assumptions for educational use."
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
