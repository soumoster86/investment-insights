/**
 * Proxy for free Indian Stock Market API (NSE/BSE).
 * Upstream: https://github.com/0xramm/Indian-Stock-Market-API
 * Default base: http://65.0.104.9  (override with INDIAN_STOCK_API_BASE)
 *
 * GET /.netlify/functions/india-stocks
 * GET /.netlify/functions/india-stocks?symbols=RELIANCE,TCS,INFY
 *
 * Avoids browser mixed-content (HTTPS→HTTP) and CORS issues.
 */

const DEFAULT_BASE = "http://65.0.104.9";
const DEFAULT_SYMBOLS = [
  "RELIANCE",
  "TCS",
  "HDFCBANK",
  "INFY",
  "ICICIBANK",
  "SBIN",
  "BHARTIARTL",
  "ITC"
];

/** Educational fallback when upstream is unreachable */
const DEMO_STOCKS = [
  {
    symbol: "RELIANCE",
    exchange: "NSE",
    ticker: "RELIANCE.NS",
    company_name: "Reliance Industries Limited",
    last_price: 2456.75,
    change: 12.3,
    percent_change: 0.5
  },
  {
    symbol: "TCS",
    exchange: "NSE",
    ticker: "TCS.NS",
    company_name: "Tata Consultancy Services Limited",
    last_price: 3456.75,
    change: -12.5,
    percent_change: -0.36
  },
  {
    symbol: "HDFCBANK",
    exchange: "NSE",
    ticker: "HDFCBANK.NS",
    company_name: "HDFC Bank Limited",
    last_price: 1645.75,
    change: -5.25,
    percent_change: -0.32
  },
  {
    symbol: "INFY",
    exchange: "NSE",
    ticker: "INFY.NS",
    company_name: "Infosys Limited",
    last_price: 1567.8,
    change: 8.9,
    percent_change: 0.57
  },
  {
    symbol: "ICICIBANK",
    exchange: "NSE",
    ticker: "ICICIBANK.NS",
    company_name: "ICICI Bank Limited",
    last_price: 1120.4,
    change: 4.15,
    percent_change: 0.37
  },
  {
    symbol: "SBIN",
    exchange: "NSE",
    ticker: "SBIN.NS",
    company_name: "State Bank of India",
    last_price: 812.55,
    change: -2.1,
    percent_change: -0.26
  },
  {
    symbol: "BHARTIARTL",
    exchange: "NSE",
    ticker: "BHARTIARTL.NS",
    company_name: "Bharti Airtel Limited",
    last_price: 1588.2,
    change: 11.6,
    percent_change: 0.74
  },
  {
    symbol: "ITC",
    exchange: "NSE",
    ticker: "ITC.NS",
    company_name: "ITC Limited",
    last_price: 445.5,
    change: 2.3,
    percent_change: 0.52
  }
];

function json(status, body) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": body.demo
        ? "public, max-age=60"
        : "public, max-age=45, s-maxage=45",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS"
    },
    body: JSON.stringify(body)
  };
}

function parseSymbols(raw) {
  if (!raw || typeof raw !== "string") return DEFAULT_SYMBOLS.slice();
  var list = raw
    .split(",")
    .map(function (s) {
      return s.trim().toUpperCase();
    })
    .filter(Boolean)
    .slice(0, 16);
  return list.length ? list : DEFAULT_SYMBOLS.slice();
}

function normalizeStock(row) {
  if (!row || typeof row !== "object") return null;
  var price = Number(row.last_price);
  var change = Number(row.change);
  var pct = Number(row.percent_change);
  if (!isFinite(price)) return null;
  return {
    symbol: String(row.symbol || "").toUpperCase(),
    exchange: row.exchange || "NSE",
    ticker: row.ticker || "",
    company_name: row.company_name || row.symbol || "",
    last_price: price,
    change: isFinite(change) ? change : 0,
    percent_change: isFinite(pct) ? pct : 0
  };
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return json(204, {});
  }
  if (event.httpMethod && event.httpMethod !== "GET") {
    return json(405, { error: "method_not_allowed" });
  }

  var qs = (event.queryStringParameters || {});
  var symbols = parseSymbols(qs.symbols);
  var base = (
    process.env.INDIAN_STOCK_API_BASE ||
    process.env.INDIAN_STOCK_API_URL ||
    DEFAULT_BASE
  ).replace(/\/$/, "");

  var url =
    base +
    "/stock/list?symbols=" +
    encodeURIComponent(symbols.join(",")) +
    "&res=num";

  try {
    var controller = new AbortController();
    var timer = setTimeout(function () {
      controller.abort();
    }, 12000);

    var res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    clearTimeout(timer);

    if (!res.ok) {
      throw new Error("upstream " + res.status);
    }

    var data = await res.json();
    if (!data || data.status === "error") {
      throw new Error((data && data.message) || "upstream error");
    }

    var rawList = data.stocks || data.data || [];
    var stocks = [];
    for (var i = 0; i < rawList.length; i++) {
      var n = normalizeStock(rawList[i]);
      if (n) stocks.push(n);
    }

    if (!stocks.length) {
      throw new Error("empty stock list");
    }

    return json(200, {
      status: "success",
      source: "indian-stock-market-api",
      demo: false,
      count: stocks.length,
      stocks: stocks,
      symbols: symbols,
      updatedAt: new Date().toISOString(),
      upstreamTimestamp: data.timestamp || null,
      note: "Data via free NSE/BSE API (may be delayed). Educational use only."
    });
  } catch (err) {
    // Filter demo to requested symbols when possible
    var demo = DEMO_STOCKS.filter(function (s) {
      return symbols.indexOf(s.symbol) !== -1;
    });
    if (!demo.length) demo = DEMO_STOCKS.slice();

    return json(200, {
      status: "success",
      source: "demo",
      demo: true,
      count: demo.length,
      stocks: demo,
      symbols: symbols,
      updatedAt: new Date().toISOString(),
      note:
        "Demo quotes — live API unreachable. Educational only. Upstream: " +
        base +
        " (" +
        (err && err.message ? err.message : "error") +
        ")",
      error: err && err.message ? String(err.message).slice(0, 160) : "fetch_failed"
    });
  }
};
