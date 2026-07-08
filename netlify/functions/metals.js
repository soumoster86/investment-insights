/**
 * Secure metals price proxy.
 * Reads GOLDAPI_KEY from Netlify env — never exposed to the browser.
 *
 * GET /.netlify/functions/metals
 * → { goldPerGram, silverPerGram, updatedAt, source, demo? }
 *
 * Local: `netlify dev` or set GOLDAPI_KEY and invoke the function.
 * Without a key, returns educational demo rates (HTTP 200, demo: true).
 */

const GRAMS_PER_TROY_OZ = 31.1034768;

const DEMO = {
  goldPerGram: 9134,
  silverPerGram: 100.54,
  source: "demo",
  demo: true,
  note: "Demo rates. Set GOLDAPI_KEY in Netlify env for live prices."
};

function json(status, body, extraHeaders) {
  return {
    statusCode: status,
    headers: Object.assign(
      {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": body.demo
          ? "public, max-age=60"
          : "public, max-age=300",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS"
      },
      extraHeaders || {}
    ),
    body: JSON.stringify(body)
  };
}

async function fetchMetal(metal, apiKey) {
  const path = metal === "gold" ? "XAU/INR" : "XAG/INR";
  const res = await fetch("https://www.goldapi.io/api/" + path, {
    headers: {
      "x-access-token": apiKey,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) {
    const text = await res.text().catch(function () {
      return "";
    });
    throw new Error(metal + " API " + res.status + " " + text.slice(0, 120));
  }
  const data = await res.json();
  if (typeof data.price !== "number") {
    throw new Error(metal + " missing price field");
  }
  return data.price / GRAMS_PER_TROY_OZ;
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return json(204, {});
  }
  if (event.httpMethod && event.httpMethod !== "GET") {
    return json(405, { error: "method_not_allowed" });
  }

  const apiKey = process.env.GOLDAPI_KEY || process.env.GOLD_API_KEY;
  if (!apiKey) {
    return json(
      200,
      Object.assign({}, DEMO, { updatedAt: new Date().toISOString() })
    );
  }

  try {
    const [goldPerGram, silverPerGram] = await Promise.all([
      fetchMetal("gold", apiKey),
      fetchMetal("silver", apiKey)
    ]);
    return json(200, {
      goldPerGram: Math.round(goldPerGram * 100) / 100,
      silverPerGram: Math.round(silverPerGram * 100) / 100,
      updatedAt: new Date().toISOString(),
      source: "goldapi",
      demo: false
    });
  } catch (err) {
    return json(
      200,
      Object.assign({}, DEMO, {
        updatedAt: new Date().toISOString(),
        note: "Live API unavailable; showing demo rates.",
        error: String(err && err.message ? err.message : err)
      })
    );
  }
};
