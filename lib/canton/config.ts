function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env var: ${name}. Set it in .env.local or Vercel project settings.`
    );
  }
  return value;
}

export const CANTON_LEDGER_API_URL = requireEnv("CANTON_LEDGER_API_URL");
export const CANTON_PACKAGE_ID = requireEnv("CANTON_PACKAGE_ID");

export const CANTON_ACCESS_TOKEN = process.env.CANTON_ACCESS_TOKEN ?? null;

export const TEMPLATE_IDS = {
  TradeProposal: `${CANTON_PACKAGE_ID}:Templates.Trade:TradeProposal`,
  DerivativeTrade: `${CANTON_PACKAGE_ID}:Templates.Trade:DerivativeTrade`,
  ValuationSnapshot: `${CANTON_PACKAGE_ID}:Templates.Margin:ValuationSnapshot`,
  MarginCallDemand: `${CANTON_PACKAGE_ID}:Templates.Margin:MarginCallDemand`,
  NovationRequest: `${CANTON_PACKAGE_ID}:Templates.Novation:NovationRequest`,
  NovationExecution: `${CANTON_PACKAGE_ID}:Templates.Novation:NovationExecution`,
  RegulatoryDisclosure: `${CANTON_PACKAGE_ID}:Templates.Disclosure:RegulatoryDisclosure`,
  RegulatoryDisclosureRequest: `${CANTON_PACKAGE_ID}:Templates.Disclosure:RegulatoryDisclosureRequest`,
} as const;
