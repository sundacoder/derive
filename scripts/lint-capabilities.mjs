#!/usr/bin/env node

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const capabilitiesPath = resolve(__dirname, "../src-tauri/capabilities/default.json");

try {
  const raw = readFileSync(capabilitiesPath, "utf-8");
  const caps = JSON.parse(raw);

  const permissions = caps.permissions || [];

  const forbiddenWildcards = permissions.filter(
    (p) => typeof p === "string" && p.includes("all"),
  );

  if (forbiddenWildcards.length > 0) {
    console.error(
      "FAIL: Forbidden wildcard permissions found:",
      forbiddenWildcards,
    );
    process.exit(1);
  }

  const allowedPrefixes = ["core:", "store:", "stronghold:", "log:"];
  const unknownPermissions = permissions.filter((p) => {
    if (typeof p !== "string") return false;
    return !allowedPrefixes.some((prefix) => p.startsWith(prefix));
  });

  if (unknownPermissions.length > 0) {
    console.warn(
      "WARN: Unknown permission prefixes:",
      unknownPermissions,
    );
  }

  console.log("PASS: Capabilities lint check passed");
  console.log(`  Permissions (${permissions.length}):`, permissions);
} catch (err) {
  console.error("FAIL: Could not read capabilities file:", err.message);
  process.exit(1);
}
