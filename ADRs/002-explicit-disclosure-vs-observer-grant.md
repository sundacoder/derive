# ADR-002: Explicit Contract Disclosure for Regulatory Visibility

## Status
Accepted

## Context
The DERIVE system must provide regulatory visibility without granting the regulator
party direct observer status on trade-level templates (DerivativeTrade, MarginCallDemand,
NovationRequest). Direct observer status would violate the core privacy thesis.

## Decision
All regulatory visibility flows through `RegulatoryDisclosure`, a purpose-built template
that contains only the agreed field set (notional bucket, asset class, maturity bucket,
counterparty LEIs, trade count, total gross notional).

The regulator party:
- Is signatory AND observer on `RegulatoryDisclosure` only
- Has zero observer status on any trade-level template
- Cannot query `DerivativeTrade` via the Ledger API

## Alternatives Considered
- **Regulator as observer on DerivativeTrade**: Rejected as it would expose bilateral
  economics to the regulator
- **Off-ledger reporting**: Less transparent and harder to audit than on-ledger disclosure

## Consequences
- Regulatory disclosures are on-ledger and auditable
- The field set is fixed at the template level, preventing accidental over-disclosure
- A `RegulatoryDisclosureRequest` pattern allows the regulator to request specific reports
