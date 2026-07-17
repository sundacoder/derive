/**
 * Canton Ledger API Configuration
 * 
 * Environment variables and template ID constants.
 */

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

// Package-name reference (#pkg-name), resolved by the ledger to the highest
// vetted package version. Required by ACS filters (which reject raw package
// IDs) and accepted by commands; survives DAR upgrades without env changes.
const PKG = "#derive-templates";

// Template IDs for all DERIVE contracts
export const TEMPLATE_IDS = {
  TradeProposal: `${PKG}:Templates.Trade:TradeProposal`,
  DerivativeTrade: `${PKG}:Templates.Trade:DerivativeTrade`,
  ValuationSnapshot: `${PKG}:Templates.Margin:ValuationSnapshot`,
  MarginCallDemand: `${PKG}:Templates.Margin:MarginCallDemand`,
  NovationRequest: `${PKG}:Templates.Novation:NovationRequest`,
  NovationExecution: `${PKG}:Templates.Novation:NovationExecution`,
  RegulatoryDisclosure: `${PKG}:Templates.Disclosure:RegulatoryDisclosure`,
  RegulatoryDisclosureRequest: `${PKG}:Templates.Disclosure:RegulatoryDisclosureRequest`,
} as const;
