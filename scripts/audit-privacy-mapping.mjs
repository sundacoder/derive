#!/usr/bin/env node

import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatesDir = resolve(__dirname, "../daml/templates/src/Templates");

const specSection34 = {
  tradeLevelTemplates: ["DerivativeTrade", "MarginCallDemand", "NovationRequest"],
  disclosureOnlyTemplate: "RegulatoryDisclosure",
  regulatorObserves: ["RegulatoryDisclosure"],
  regulatorNeverObserves: ["DerivativeTrade", "MarginCallDemand", "NovationRequest"],
};

function checkTemplatePrivacy(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const templateName = filePath.split("/").pop().replace(".daml", "");

  const signatoryMatch = content.match(/signatory\s+(.+)/);
  const observerMatch = content.match(/observer\s+(.+)/);

  const signatories = signatoryMatch
    ? signatoryMatch[1].split(",").map((s) => s.trim())
    : [];
  const observers = observerMatch
    ? observerMatch[1].split(",").map((s) => s.trim())
    : [];

  const tradeLevelTemplates = specSection34.tradeLevelTemplates;
  const disclosureOnly = specSection34.disclosureOnlyTemplate;

  const results = [];

  if (
    tradeLevelTemplates.includes(templateName) &&
    observers.some((o) => o.includes("regulator") || o.includes("Regulator"))
  ) {
    results.push(
      `FAIL: ${templateName} has regulator as observer. This violates the spec (§3.4).`,
    );
  }

  if (templateName === disclosureOnly) {
    const hasTradeDetail = content.match(/fixed_rate|notional|fixedRate/i);
    if (hasTradeDetail) {
      results.push(
        `FAIL: ${templateName} may contain trade-level detail (fixed_rate, notional). Review against §3.4 field set.`,
      );
    }
  }

  results.push(
    `INFO: ${templateName} — signatories: [${signatories.join(", ")}], observers: [${observers.join(", ")}]`,
  );

  return results;
}

try {
  const files = readdirSync(templatesDir).filter((f) => f.endsWith(".daml"));
  let allPassed = true;

  for (const file of files) {
    const results = checkTemplatePrivacy(resolve(templatesDir, file));
    for (const r of results) {
      console.log(r);
      if (r.startsWith("FAIL")) allPassed = false;
    }
  }

  if (allPassed) {
    console.log("\nPASS: Privacy mapping audit passed");
  } else {
    console.log("\nFAIL: Privacy mapping audit failed — review violations above");
    process.exit(1);
  }
} catch (err) {
  console.error("FAIL: Audit error:", err.message);
  process.exit(1);
}
