/**
 * Crude oil price proxy (API Ninjas Commodity Price API).
 * Reads API_NINJAS_KEY from Netlify env — never exposed to the browser.
 *
 * GET /.netlify/functions/crude
 * → {
 *     wti: { price, change, changePct, unit, currency, name },
 *     brent: { ... },
 *     updatedAt, source, demo?
 *   }
 *
 * Docs: https://api-ninjas.com/api/commodityprice
 * Endpoint: GET https://api.api-ninjas.com/v1/commodityprice?name=crude_oil
 * Header: X-Api-Key: YOUR_KEY
 *
 * Local: netlify dev with API_NINJAS_KEY set, or returns demo prices.
 */

const DEMO = {
  wti: {
    price: 67.82,
    change: 0.37,
    changePct: 0.55,
    unit: "barrel",
    currency: "USD",
    name: "Crude Oil (WTI)",
    exchange: "NYMEX"
  },
  brent: {
    price: 71.4,
    change: 0.22,
    changePct: 0.31,
    unit: "barrel",
    currency: "USD",
    name: "Brent Crude Oil",
    exchange: "ICE"
  },
  source: "demo",
  demo: true,
  note: "Demo prices. Set API_NINJAS_KEY in Netlify env for live data from API Ninjas."
};

function json(status, body) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": body.demo ? "public, max-age=60" : "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS"
    },
    body: JSON.stringify(body)
  };
}

function mapCommodity(data, label) {
  var price = Number(data.price);
  var change =
    data.change_24h != null
      ? Number(data.change_24h)
      : data.previous_close != null
        ? price - Number(data.previous_close)
        : null;
  var changePct =
    data.change_24h_percent != null
      ? Number(data.change_24h_percent)
      : data.previous_close != null && Number(data.previous_close) !== 0
        ? ((price - Number(data.previous_close)) / Number(data.previous_close)) * 100
        : null;

  return {
    price: Math.round(price * 100) / 100,
    change: change != null && !isNaN(change) ? Math.round(change * 100) / 100 : null,
    changePct:
      changePct != null && !isNaN(changePct)
        ? Math.round(changePct * 100) / 100
        : null,
    unit: data.unit || "barrel",
    currency: data.currency_unit || "USD",
    name: data.name || label,
    exchange: data.exchange || "",
    updated: data.updated || null
  };
}

async function fetchCommodity(name, apiKey) {
  var url =
    "https://api.api-ninjas.com/v1/commodityprice?name=" +
    encodeURIComponent(name);
  var res = await fetch(url, {
    headers: {
      "X-Api-Key": apiKey,
      Accept: "application/json"
    }
  });
  if (!res.ok) {
    var text = await res.text().catch(function () {
      return "";
    });
    throw new Error(name + " API " + res.status + " " + text.slice(0, 160));
  }
  var data = await res.json();
  // Some responses may wrap in an array
  if (Array.isArray(data)) data = data[0] || {};
  if (typeof data.price !== "number") {
    throw new Error(name + " missing price field");
  }
  return data;
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return json(204, {});
  }
  if (event.httpMethod && event.httpMethod !== "GET") {
    return json(405, { error: "method_not_allowed" });
  }

  var apiKey =
    process.env.API_NINJAS_KEY ||
    process.env.API_NINJAS_API_KEY ||
    process.env.NINJAS_API_KEY;

  if (!apiKey) {
    return json(
      200,
      Object.assign({}, DEMO, { updatedAt: new Date().toISOString() })
    );
  }

  try {
    var results = await Promise.all([
      fetchCommodity("crude_oil", apiKey),
      fetchCommodity("brent_crude_oil", apiKey)
    ]);
    return json(200, {
      wti: mapCommodity(results[0], "Crude Oil (WTI)"),
      brent: mapCommodity(results[1], "Brent Crude Oil"),
      updatedAt: new Date().toISOString(),
      source: "api-ninjas",
      demo: false
    });
  } catch (err) {
    return json(
      200,
      Object.assign({}, DEMO, {
        updatedAt: new Date().toISOString(),
        note: "Live API unavailable; showing demo prices.",
        error: String(err && err.message ? err.message : err)
      })
    );
  }
};
