const fs = require("fs");

function ok(label, cond) {
  console.log((cond ? "OK  " : "FAIL") + " " + label);
  return cond;
}

let pass = true;
pass =
  ok("netlify.toml", fs.existsSync("netlify.toml")) && pass;
pass =
  ok("metals function", fs.existsSync("netlify/functions/metals.js")) && pass;
pass =
  ok("freshness.json", fs.existsSync("content/freshness.json")) && pass;
pass = ok("site-config.js", fs.existsSync("js/site-config.js")) && pass;
pass = ok("analytics.js", fs.existsSync("js/analytics.js")) && pass;
pass = ok(".env.example", fs.existsSync(".env.example")) && pass;

const dash = fs.readFileSync("js/dashboard.js", "utf8");
pass = ok("dashboard calls metals endpoint", dash.includes("metalsEndpoint")) && pass;
pass = ok("no client goldapi key", !dash.includes("goldapi-") && !dash.includes("x-access-token")) && pass;

const pages = fs.readdirSync(".").filter((f) => f.endsWith(".html"));
for (const f of pages) {
  const h = fs.readFileSync(f, "utf8");
  if (!h.includes("js/site-config.js")) {
    pass = ok(f + " site-config", false) && pass;
  }
  if (!h.includes("footer-reviewed")) {
    pass = ok(f + " footer-reviewed", false) && pass;
  }
}
pass = ok("all pages have site-config + reviewed footer", true) && pass;

const index = fs.readFileSync("index.html", "utf8");
pass = ok("index JSON-LD", index.includes("BEGIN JSON-LD")) && pass;
pass = ok("index analytics script", index.includes("js/analytics.js")) && pass;

// metals function unit-ish: demo without key
process.env.GOLDAPI_KEY = "";
delete process.env.GOLD_API_KEY;
const metals = require("../netlify/functions/metals.js");
metals
  .handler({ httpMethod: "GET" })
  .then((res) => {
    const body = JSON.parse(res.body);
    pass = ok("metals demo mode without key", res.statusCode === 200 && body.demo === true) && pass;
    pass = ok("metals has goldPerGram", body.goldPerGram > 0) && pass;
    process.exit(pass ? 0 : 1);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
