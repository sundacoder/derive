const DEFAULT_ALLOWED: string[] = [
  "de1bf9dc70e28f881b581f24fd7fd703::1220d8416df6cd7f3e0527a6ced9c91010488860dfc4a34f8a093eebc060eb47b295",
  "253cb66316f7ed1202d91ae25d7d54a3::12209bbbd56c433cff2d42ec95cfb57f81b0e6fbc0a7e9b5bb9125b4cca3df38e34a",
  "2b440f2f2242329b61b59d9ebfc9b9de::1220b8c43489f1c53f030a8a5c3b5ce864abdf1b8f548f43194c149fbfa76c6e08a0",
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
