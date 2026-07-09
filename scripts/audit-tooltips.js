const fs = require("fs");
const files = fs.readdirSync(".").filter((f) => f.endsWith(".html"));
const report = [];

for (const f of files) {
  const s = fs.readFileSync(f, "utf8");
  const formRe =
    /<form\b[^>]*>[\s\S]*?<\/form>/gi;
  let m;
  let fi = 0;
  while ((m = formRe.exec(s))) {
    const form = m[0];
    if (
      !/tool-form|calculator-box|goal-form|data-result|Calculate|onsubmit/i.test(
        form
      ) &&
      !/id="[^"]*-(form|Form)"/.test(form)
    ) {
      continue;
    }
    // skip contact
    if (/contact-form|id="contact-form"/.test(form)) continue;

    fi++;
    const idMatch = form.match(/id="([^"]+)"/);
    const formId = idMatch ? idMatch[1] : "form-" + fi;
    const labels = [...form.matchAll(/<label\b([^>]*)>([\s\S]*?)<\/label>/gi)];
    const missing = [];
    let withTip = 0;
    let fieldCount = 0;
    // Orphan controls outside <label> break tool-form alignment CSS
    const withoutLabels = form.replace(/<label\b[\s\S]*?<\/label>/gi, " ");
    const orphans = [
      ...withoutLabels.matchAll(
        /<(input|select|textarea)\b(?![^>]*type=["'](?:hidden|submit|button|reset|checkbox|radio))/gi
      ),
    ].map((x) => x[0].slice(0, 90));

    for (const lm of labels) {
      const attrs = lm[1] || "";
      const body = lm[2];
      // Optional chip toggles — tooltips not required
      if (/route-chip|goal-check-label/.test(attrs)) continue;
      const hasControl =
        /<(input|select|textarea)\b/i.test(body) ||
        /class="[^"]*fd-tenure-row/.test(body);
      if (!hasControl) continue;
      // skip buttons-only
      if (
        !/type="(number|text|email|password|checkbox|radio|range)"|type='(number|text)|<select|<textarea|fd-tenure-row/i.test(
          body
        ) &&
        !/<input(?![^>]*type=)/i.test(body)
      ) {
        if (
          !/<input\b/i.test(body) &&
          !/<select\b/i.test(body) &&
          !/<textarea\b/i.test(body)
        )
          continue;
      }
      fieldCount++;
      const hasTip = /class="[^"]*tooltip/.test(body);
      const text = body
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 70);
      if (hasTip) withTip++;
      else missing.push(text || "(unnamed field)");
    }
    if (fieldCount > 0 || orphans.length) {
      report.push({
        file: f,
        formId,
        fieldCount,
        withTip,
        withoutTip: missing.length,
        missing,
        orphans,
      });
    }
  }
}

report.sort((a, b) => b.withoutTip - a.withoutTip);
console.log(JSON.stringify(report, null, 2));
const totalMissing = report.reduce((s, r) => s + r.withoutTip, 0);
console.log("\nTOTAL forms:", report.length, "fields missing tooltips:", totalMissing);
