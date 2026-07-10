# ADR-001: Multiple Party Agreement Pattern for NovationRequest

## Status
Accepted

## Context
The DERIVE novation flow requires a 3-party consent (outgoing dealer, remaining dealer,
incoming dealer) before the original DerivativeTrade can be archived and new trades created.
In Daml's authorization model, a consuming choice on a contract requires authority from
all signatories of that contract. However, a choice on one contract cannot directly archive
another contract without the archiving party having authority over the target contract's
signatories.

## Decision
We use the Multiple Party Agreement (MPA) pattern:

1. `NovationRequest` has all three parties as signatories
2. Each party exercises a non-consuming `Countersign` choice that creates a new
   NovationRequest with accumulated consent
3. A consuming `CompleteNovation` choice, controlled by all three parties, performs
   the final novation (archives original trade, creates new trades)
4. The last signer submits `CompleteNovation` as a multi-party command through the
   JSON Ledger API v2, carrying authorization from all three parties

## Alternatives Considered
- **Sequential propose-accept**: Each step creates a new contract with accumulated
  signatories. Discarded because it requires N contract hops for N parties.
- **Off-ledger coordination + single-party archive**: Discarded because it would
  require a trusted third party to hold archive authority.

## Consequences
- All three parties' authorization is cryptographically verified at the ledger level
- The last signer must collect pre-approvals from the other two parties via the
  Wallet Gateway before submitting the final multi-party command
- The UI clearly shows "pending" state per remaining signer, not a binary complete flag
