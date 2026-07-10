# ADR-003: Use of dpm CLI (not Deprecated daml Assistant)

## Status
Accepted

## Context
Digital Asset deprecated the Daml Assistant (`daml` CLI) as of Canton/Daml SDK 3.4.
The `dpm` (Digital Asset Package Manager) CLI is the current tool for building,
testing, and managing Daml projects.

## Decision
All Daml project commands use `dpm`:
- `dpm build` — builds the DAR
- `dpm test` — runs Daml Script scenario tests
- `dpm studio` — opens the Daml Studio IDE
- `dpm sandbox` — runs a local sandbox ledger

The legacy `daml` CLI must not be used for any new tooling or scripts.

## Consequences
- Requires dpm >= 3.4 to be installed
- Existing tutorials referencing `daml` CLI will not work directly
- `dpm` does not support 3.3 projects — we target 3.4+
