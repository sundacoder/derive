# Changelog

All notable changes to DERIVE are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] — 2026-07-17

### Fixed

- **`.gitignore` env pattern** — new `.env*` catch-all was re-ignoring `.env.example` (overriding the earlier `!.env.example` exception); exception re-added after the pattern
- **`package.json` version** — bumped from stale `0.2.0` to match release versioning
- **README verification table** — malformed 3-column separator on a 2-column table

### Added

- `.kilo/` added to `.gitignore` — local agent plan files may contain credentials and must never be committed

## [0.3.0] — 2026-07-16

### Added

- **OAuth2 client-credentials auth module** (`lib/canton/auth.ts`) — automatic token exchange and refresh via `https://auth.sandbox.fivenorth.io/application/o/token/` with 8-hour expiry; singleton pattern prevents concurrent refresh requests; env vars `CANTON_CLIENT_ID`, `CANTON_CLIENT_SECRET`, `CANTON_AUDIENCE`, `CANTON_SCOPE`
- **Server-side party authorization** (`lib/canton/authorization.ts`) — validates `X-Party-Id` header against all requested `actAs`/`proposer`/`acceptor` body fields in every API route handler; defense-in-depth beyond the `middleware.ts` allowlist
- **Margin Post/Dispute contract validation** — API routes now query the ACS to confirm the caller is the `calledDealer` before forwarding the exercise command
- **`lookupContract` and `getLedgerEnd`** — new client helpers for single-contract lookup and ledger-end synchronization
- **Auth module unit tests** — token caching, token refresh, and correct request shape verification

### Fixed

- **Ledger API v2 request shape mismatch** — `lib/canton/client.ts` now sends `parties` (not `actAs`), singular `command` with `create`/`exercise` sub-objects (not flat `commandType`), and `/v2/contracts/search` (not `/v2/query`). All 4 HIGH-severity wiring defects resolved.
- **RegulatoryDisclosure.Fulfill hardcoded date** — `generatedAt` is now a choice argument instead of `date 2026 Jul 10`
- **Privacy audit script path** — `scripts/audit-privacy-mapping.mjs` now points to `daml/templates/src/Templates` (was `daml/src/Templates`)
- **`ipc.novation.countersign` dead code** — removed unreachable `else` branch that always evaluated to `_partyId`
- **`IpcError` extends `Error`** — proper stack traces preserved; `ipc.ts` throws `IpcError` instead of plain objects
- **`trade/[cid]/route.ts`** — GET handler now performs a real `lookupContract` call instead of returning a stub
- **`any` types in `ipc.ts`** — replaced 21 `as any` casts with typed `getPayloadValue` helper using `Record<string, unknown>`
- **`AppNav.tsx` lint error** — exported `ActiveView` type from `app-store.ts` and imported it instead of using `as any`
- **Unused `Button` imports** — removed from `disclosure/page.tsx` and `trade/page.tsx`
- **Wallet connect naming** — separate `party_id` from `participant_url` in `ipc.wallet.connect()` input

### Changed

- `lib/canton/config.ts` — removed `CANTON_ACCESS_TOKEN` env var; token management delegated to `lib/canton/auth.ts` via OAuth2 client credentials
- `lib/canton/client.ts` — complete rewrite to match Canton JSON Ledger API v2 protocol; `submitCreate`, `submitExercise`, `queryContracts` all use correct request/response shapes
- `app/api/*/route.ts` — all 12 API route handlers updated to use new client signatures and `validatePartyAuthorization`
- `lib/ipc.ts` — all `.map()` calls use `payload` field instead of `createArguments` field from contract data
- `app/(app)/page.tsx` — `handleConnect` passes `party_id` separately from `participant_url`
- `components/ConnectWalletDialog.tsx` — accepts optional `participantUrl` input for the ledger endpoint
- `tests/canton-client-auth.test.ts` — rewritten to test new client API shapes and auth module
- `tests/error-propagation.test.ts` — updated to pass `party_id` in `wallet.connect` calls
- `.env.example` — replaced `CANTON_ACCESS_TOKEN` with `CANTON_CLIENT_ID`, `CANTON_CLIENT_SECRET`, `CANTON_AUDIENCE`, `CANTON_SCOPE`

### Removed

- `CANTON_ACCESS_TOKEN` singleton env var — replaced by OAuth2 client-credentials flow with automatic refresh

### Known Issues

- DAR not yet deployed to Seaport DevNet — Deploy `daml/templates/.daml/dist/derive-templates-0.1.0.dar` via the Seaport admin interface
- `CANTON_PACKAGE_ID` in `.env.example` is a placeholder — must be updated to match the deployed package hash
- `CANTON_CLIENT_SECRET` must be set in Vercel environment variables (not committed to repo)
- Wallet connect remains a stub — no real CIP-103 `@canton-network/dapp-sdk` integration
- `dpm test` requires Java JVM — cannot run Daml Script tests locally
- E2E Playwright tests scaffolded but cannot run — `@playwright/test` not installed
- Tauri Rust layer is dormant — requires `libgtk-3-dev` and `libwebkit2gtk-4.1-dev` system libraries

## [0.2.1] — 2026-07-14

### Added

- **Party allowlist** (`lib/config/allowlist.ts`) — single source of truth for 3 authorized parties; env var `ALLOWED_PARTY_IDS` overrides hardcoded defaults
- **Server-side middleware guard** (`middleware.ts`) — validates `X-Party-Id` header against allowlist on every `/api/*` request; returns 403 for unauthorized parties
- **Client-side allowlist validation** in `ConnectWalletDialog.tsx` — rejects unauthorized Party IDs at connect-time with inline error feedback; shows truncated list of authorized parties
- **Dashboard shell** (`app/(app)/page.tsx`) — 5 stat cards + 4 action cards with empty-state CTAs
- **Persistent sidebar nav** (`components/layout/AppNav.tsx`) — driven by `lib/config/flows.ts` single source of truth
- **Auth header support** in `lib/canton/client.ts` — `buildHeaders()` injects `Authorization: Bearer` on all 3 functions when `CANTON_ACCESS_TOKEN` is set
- **Unit tests** — 14 tests covering auth header propagation (`tests/canton-client-auth.test.ts`) and error propagation (`tests/error-propagation.test.ts`)

### Fixed

- **Novation complete bug** — `ipc.novation.complete()` previously sent `actAs: [_partyId]` (1 party), but Daml choice `CompleteNovation` requires all 3 signatories. Fixed to accept `parties: string[]` and send all 3. Updated page component to pass parties from request data.
- **Dashboard page** — removed orphaned `app/page.tsx`; content merged into `app/(app)/page.tsx`
- **Error propagation** in `ProposeTradeDialog.tsx` — catch block now handles `Error` instances, `{code, message}` plain objects, and unknown shapes

### Changed

- `ConnectWalletDialog.tsx` — shows inline "Authorized party" / "Not on allowlist" feedback + truncated party list
- `.env.example` — added `ALLOWED_PARTY_IDS` and `WALLET_GATEWAY_URL` documentation

### Known Issues

- No `CANTON_ACCESS_TOKEN` set — every ledger command returns 401. Must be obtained via Authentik device-code flow against `auth.sandbox.fivenorth.io`
- Wallet connect is a stub — `ipc.wallet.connect()` stores Party ID in memory only; no real CIP-103 `@canton-network/dapp-sdk` integration
- `dpm test` requires Java JVM — cannot run Daml Script tests locally (pre-existing)
- E2E Playwright tests scaffolded but cannot run — `@playwright/test` not installed (pre-existing)

## [0.2.0] — 2026-07-13

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
