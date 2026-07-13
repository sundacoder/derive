# Changelog

All notable changes to DERIVE are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] — 2026-07-13

### Added

#### Next.js API Routes (Tauri Replacement)
- **16 Route Handlers** under `app/api/` — trade propose/accept/list/accept-novation, margin demand/post/dispute/list, novation request/countersign/complete/list, disclosure publish/list, valuation snapshot
- **Shared Canton ledger client** (`lib/canton/client.ts`) — `submitCreate`, `submitExercise`, `queryContracts` against JSON Ledger API v2
- **Env-var-backed config** (`lib/canton/config.ts`) — template ID constants driven by `CANTON_PACKAGE_ID`
- **`.env.example`** — template for required environment variables

#### Canton DevNet Integration
- DAR (`derive-templates-0.1.0.dar`) built and deployed to Seaport 5n sandbox
- `dpm codegen-js` output committed under `lib/daml/generated/`
- Ledger API URL configured: `https://ledger-api.validator.devnet.sandbox.fivenorth.io`

### Changed

- **Architecture pivot**: Tauri desktop → Next.js API Routes + Vercel deployment (hackathon track)
- `lib/ipc.ts` rewritten — `@tauri-apps/api` `invoke()` replaced with `fetch()` to API routes; interface preserved so all frontend components work unchanged
- `next.config.ts` — static export (`output: "export"`) removed; dynamic Node.js hosting enabled for API routes
- `ConnectWalletDialog.tsx` — Stronghold button replaced with Party ID text-field paste flow
- Daml contract templates deployed on Seaport: `DerivativeTrade` and `TradeProposal` active on ledger

### Removed

- **Tauri Rust backend** (`src-tauri/`) — no longer on critical path; all IPC via HTTP
- **Tauri dependencies** (`@tauri-apps/api`, `@tauri-apps/plugin-store`, `@tauri-apps/plugin-stronghold`) remain in `package.json` but unused
- **Rust build prerequisites** — `libgtk-3-dev`, `libwebkit2gtk-4.1-dev`, etc. no longer required

### Known Issues

- Ledger API requires OIDC JWT auth (Authentik) — `client.ts` does not yet send `Authorization` header
- `dpm test` requires Java JVM — cannot run Daml Script tests locally
- No Vercel project configured yet for deployment target

## [0.1.1] — 2026-07-11

### Fixed

#### Daml Build
- **Choice `with`/`controller` order** — SDK 3.4.11 parser requires `with` block to appear before `controller` in choice definitions; previously `controller` came first, causing `parse error on input 'with'`
- **`archive this` removed** — consuming choices auto-archive; `archive this` is invalid because `this` is template data, not `ContractId`. Removed from `Reject`, `Cancel`, `CompleteNovation`, and `Fulfill` choices across all templates
- **Boolean operators** — replaced `or`/`and` (list functions) with `||`/`&&` (boolean operators) in assertion expressions
- **`create` return types** — `create` returns `ContractId T`, not `T`; fixed `SetValuationAgent` and `ConfirmNovation` choice return types
- **`date` Month type** — `date 2026 07 15` → `date 2026 Jul 15`; second argument expects `Month` enum type (`Jan`, `Jul`, etc.)
- **`submitMulti`/`trySubmitMulti` arity** — SDK 3.4.11 requires 3 arguments (`[Party] -> [Party] -> Commands a`); added missing `[]` readers argument
- **Ambiguous `Reject`** — resolved import conflict between `Templates.Novation.Reject` and `Templates.Trade.Reject` by using `hiding` import
- **`0.5` numeric ambiguity** — added explicit `: Decimal` type annotation

### Changed
- **Multi-package restructuring** — `derive-instruments` split from `derive-templates`; templates depend on instruments via DAR dependency
- **Daml SDK** — upgraded from 3.4.0 to 3.4.11
- **`daml-finance` removed** — dependency removed from both packages (incompatible SDK version 2.10.0); templates refactored to use primitive types (`Text` instead of `InstrumentKey`/`AccountKey`)
- **Contract keys removed** — `key`/`maintainer` not supported by default Daml-LF in SDK 3.4.11
- **`dpm` CLI** — installed and configured (GitHub release binary, version 1.0.21)

### Removed
- `derive-instruments` as a build dependency of `derive-templates` (unused; DAR is self-contained)

## [0.1.0] — 2026-07-10

### Added

#### Daml Smart Contracts
- **TradeProposal / DerivativeTrade** — propose-accept pattern for bilateral swap affirmation with full multi-signatory authorization
- **ValuationSnapshot / MarginCallDemand** — oracle-fed margin call lifecycle with Post, Dispute, and Cancel choices
- **NovationRequest** — three-party novation using the Multiple Party Agreement (MPA) pattern; requires all three dealers to countersign before completion
- **NovationExecution** — on-ledger execution record for completed novations
- **RegulatoryDisclosure / RegulatoryDisclosureRequest** — explicit disclosure contracts publishing only agreed field sets (notional bucket, asset class, counterparty LEIs); regulator has zero visibility into trade economics
- **InterestRateSwap** — Daml Finance instrument extension (fixed-for-floating)

#### Daml Test Suite
- 16 test scenarios covering all acceptance criteria (E001–E010)
- Full negative-authorization matrix: every consuming choice on multi-signatory templates tested with insufficient authorization
- Incoming dealer visibility gating (no trade economics pre-consent)
- Contention and reject-path coverage

#### Rust IPC Layer (Tauri v2)
- **Wallet commands**: `connect_wallet`, `disconnect_wallet`, `get_wallet_status` — CIP-103 dApp API integration with Stronghold dev-mode
- **Trade commands**: `propose_trade`, `accept_trade`, `get_trades`, `get_proposals`
- **Margin commands**: `demand_margin`, `post_margin`, `dispute_margin`, `get_margin_calls`
- **Novation commands**: `initiate_novation`, `countersign_novation`, `complete_novation`, `get_novation_requests`
- **Disclosure commands**: `publish_disclosure`, `get_disclosures`, `get_disclosure_by_id`
- Structured error types (`CommandError`, `WalletError`) with typed error codes for all failure modes (CONTENTION, AUTHORIZATION_DENIED, LEDGER_UNAVAILABLE, WALLET_REJECTED, FIELD_SET_MISMATCH)
- Tracing instrumentation on all commands with structured log events

#### TypeScript Frontend (Next.js + React 19)
- **Dashboard** — wallet connection UI with connection status indicators, summary cards for trades/margin/proposals
- **Trade page** — active trades list, pending proposals view, propose-trade dialog
- **Margin page** — margin call history, demand/post/dispute workflows
- **Novation page** — novation request list with per-party countersign buttons, consent tracking, and completion trigger
- **Disclosure page** — published report list, publish-disclosure dialog with field-set validation
- Zustand stores for wallet state and application state
- TanStack Query integration for all IPC-backed data fetching
- Zod schema validation on all IPC boundaries
- Static Next.js export for Tauri WebView deployment

#### Security Infrastructure
- Strict CSP policy in `tauri.conf.json` (`default-src 'self'`, no `unsafe-eval`)
- Tauri capability permissions scoped to minimum required: `core:default`, `store:default`, `stronghold:default`, `log:default`
- Stronghold vault for dev-mode key material (keys never reach JS heap)
- Privacy-mapping audit script (`scripts/audit-privacy-mapping.mjs`) that checks every template's signatory/observer declarations against spec §3.4
- Capability lint script (`scripts/lint-capabilities.mjs`) that rejects wildcard permissions

#### Architecture Decisions
- **ADR-001**: Multiple Party Agreement pattern for NovationRequest (3-party consent, multi-controller completion)
- **ADR-002**: Explicit contract disclosure for regulatory visibility (no direct observer grants on trade templates)
- **ADR-003**: Use of `dpm` CLI over deprecated `daml` Assistant (Canton SDK 3.4+)

### Technical Debt (Known)
- Rust IPC commands are stubbed against in-memory state — need integration with real JSON Ledger API v2 endpoints
- PQS read model is defined but not yet wired to the frontend
- Tauri Rust side requires `libgtk-3-dev` and `libwebkit2gtk-4.1-dev` system dependencies to compile (no sudo available)
- E2E tests are scaffolded with Playwright but not yet run against a Devnet participant
- No CI/CD pipeline configured yet
- `dpm test` requires Java (not installed on development machine)
- `daml-script` dependency included in templates package (should be split into separate test package for production)
