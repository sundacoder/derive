// Local parties on the 5N sandbox validator, allocated for DERIVE. The
// ledger user behind CANTON_CLIENT_ID holds CanActAs rights on each; parties
// hosted on other participants cannot be used (actAs would be rejected).
const DEFAULT_ALLOWED: string[] = [
  "derive-dealerA::1220a14ca128063b8dc9d1ebb0bd22633be9f2168500f4dbc1ecaeb1855b14e5acf8",
  "derive-dealerB::1220a14ca128063b8dc9d1ebb0bd22633be9f2168500f4dbc1ecaeb1855b14e5acf8",
  "derive-dealerC::1220a14ca128063b8dc9d1ebb0bd22633be9f2168500f4dbc1ecaeb1855b14e5acf8",
  "derive-regulator::1220a14ca128063b8dc9d1ebb0bd22633be9f2168500f4dbc1ecaeb1855b14e5acf8",
];

function getAllowlist(): string[] {
  if (typeof process === "undefined" || !process.env) return DEFAULT_ALLOWED;
  const raw = process.env.ALLOWED_PARTY_IDS;
  if (!raw) return DEFAULT_ALLOWED;
  return raw.split(";").map((s) => s.trim()).filter(Boolean);
}

const ALLOWED = getAllowlist();

export function isPartyAllowed(partyId: string): boolean {
  return ALLOWED.includes(partyId);
}

export function getAllowedParties(): readonly string[] {
  return ALLOWED;
}
