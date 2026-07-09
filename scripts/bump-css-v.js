const fs = require("fs");
const files = fs.readdirSync(".").filter((f) => f.endsWith(".html"));
for (const f of files) {
  let s = fs.readFileSync(f, "utf8");
  const n = s.replace(/style\.css\?v=[^"]+/g, "style.css?v=20260710g");
  if (n !== s) {
    fs.writeFileSync(f, n);
    console.log("bumped", f);
  }
}
