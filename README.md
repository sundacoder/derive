# DERIVE

**Confidential Bilateral Derivatives Margin & Novation Network**

DERIVE is a web application for confidential bilateral derivatives trade affirmation, oracle-fed margin calls, three-party novation, and regulatory disclosure — built on the **Canton Network** using **Daml smart contracts**, with a **Next.js** frontend deployed on **Vercel**.

## Architecture

```
┌──────────────────────────────────────────────┐
│  Browser / Vercel (Next.js API Routes)        │
│  ┌────────────────────────────────────────┐  │
│  │  React 19 + shadcn/ui + Zustand        │  │
│  │  TanStack Query                        │  │
│  ├────────────────────────────────────────┤  │
│  │  lib/ipc.ts → fetch() to API routes    │  │
│  ├────────────────────────────────────────┤  │
│  │  Next.js Route Handlers (app/api/)     │  │
│  │  lib/canton/client.ts → Ledger API v2 │  │
│  └────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│  Canton DevNet — Seaport 5n Sandbox           │
│  ┌────────────────────────────────────────┐  │
│  │  Vetted DAR (derive-templates)        │  │
│  │  JSON Ledger API v2                   │  │
│  │  Authentik OIDC (JWT auth)            │  │
│  └────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│  Canton Network Synchronizer                  │
└──────────────────────────────────────────────┘
```

## Features

| Flow | Description |
|---|---|
| **F1 — Connect Wallet** | Paste Party ID from Seaport dashboard to connect |
| **F2 — Trade Affirmation** | Propose-accept pattern for bilateral swap derivatives, enforced on-ledger |
| **F3 — Margin Call** | Valuation-triggered margin demands with Post and Dispute choices |
| **F4 — Novation** | Three-party trade novation using Multiple Party Agreement pattern (all three must countersign) |
| **F5 — Regulatory Disclosure** | Aggregated reporting via explicit disclosure contracts — regulator never sees trade economics |

## Stack

| Layer | Technology |
|---|---|
| Hosting | **Vercel** (Next.js API Routes + static assets) |
| Frontend | **Next.js 16** + **React 19** + **shadcn/ui** + **Zustand** + **TanStack Query** |
| Smart contracts | **Daml** (Canton SDK 3.4.11, `dpm` CLI 1.0.21) |
| Daml packages | **derive-templates** (Trade, Margin, Novation, Disclosure contracts) |
| Network | **Canton Network** — Devnet (Seaport 5n Sandbox) |
| Wallet/auth | Seaport Party ID + Authentik OIDC JWT (planned) |
| IPC validation | **Zod** |

## Project Structure

```
derive/
├── middleware.ts                  Party allowlist guard (X-Party-Id validation, 403 on reject)
├── app/
│   ├── (app)/                     Route group (authenticated pages)
│   │   ├── trade/                 Trade affirmation UI
│   │   ├── margin/                Margin call UI
│   │   ├── novation/              Novation UI
│   │   └── disclosure/            Regulatory disclosure UI
│   ├── api/                       Next.js Route Handlers
│   │   ├── trade/                 Trade propose/accept/list/accept-novation
│   │   ├── margin/                Margin demand/post/dispute/list
│   │   ├── novation/              Novation request/countersign/complete/list
│   │   ├── disclosure/            Disclosure publish/list
│   │   └── valuation/             Valuation snapshot
│   └── page.tsx                   Landing / wallet connect page
├── components/                    React components
│   ├── trade/                     Trade-specific components
│   ├── margin/                    Margin-specific components
│   ├── novation/                  Novation-specific components
│   ├── disclosure/                Disclosure-specific components
│   └── ui/                        shadcn/ui primitives
├── lib/
│   ├── canton/
│   │   ├── auth.ts                 OAuth2 client-credentials token management (auto-refresh)
│   │   ├── authorization.ts        Server-side party authorization (X-Party-Id validation)
│   │   ├── client.ts               Canton Ledger API v2 client (submitCreate, submitExercise, queryContracts, lookupContract, getLedgerEnd)
│   │   └── config.ts               Env-var-backed template ID constants
│   ├── config/
│   │   ├── allowlist.ts           Party allowlist (hardcoded defaults + env override)
│   │   └── flows.ts               Nav/dashboard config single source of truth
│   ├── types/                     Shared TypeScript types & Zod schemas
│   ├── stores/                    Zustand stores (wallet, app)
│   ├── daml/generated/            dpm codegen-js output
│   ├── ipc.ts                     fetch()-based IPC (formerly Tauri invoke())
│   └── providers.tsx              TanStack Query provider
├── daml/
│   ├── instruments/               Package: derive-instruments (removed from build deps)
│   │   └── src/Instruments/       InterestRateSwap template
│   ├── templates/                 Package: derive-templates
│   │   ├── src/
│   │   │   ├── Templates/         Trade, Margin, Novation, Disclosure contracts
│   │   │   └── Tests/             Daml Script tests (incl. negative-authorization)
│   │   └── daml.yaml
│   └── dpm.json                   Multi-package build config
├── tests/
│   ├── canton-client-auth.test.ts Auth header & 401 propagation tests
│   ├── error-propagation.test.ts  Error shape handling tests
│   └── e2e/                       Playwright E2E tests (scaffolded, requires @playwright/test)
├── scripts/
│   └── audit-privacy-mapping.mjs  Signatory/observer/disclosure audit
├── ADRs/                          Architecture Decision Records
└── .env.example                   Environment variable template
```

## Getting Started

### Prerequisites

- **Node.js** >= 22
- **dpm CLI** (Digital Asset Package Manager) — Canton SDK 3.4.11
- **Java** >= 11 (required for `dpm test` / Daml Sandbox)

### Env Variables

Copy `.env.example` to `.env.local` and fill in:

```
CANTON_LEDGER_API_URL=https://ledger-api.validator.devnet.sandbox.fivenorth.io
CANTON_PACKAGE_ID=<package-id from dpm codegen-js>
CANTON_VALIDATOR_NAME=5n sandbox
CANTON_CLIENT_ID=validator-devnet-m2m
CANTON_CLIENT_SECRET=<obtain via Authentik OIDC client credentials flow>
CANTON_AUDIENCE=validator-devnet-m2m
CANTON_SCOPE=daml_ledger_api
```

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the UI.

### Type Check

```bash
npx tsc --strict --noEmit
```

### Daml Build

```bash
cd daml
dpm build
```

Output DAR at `daml/templates/.daml/dist/derive-templates-0.1.0.dar`.

A copy of the deployable DAR is committed at `daml/dist/derive-templates-0.1.0.dar` — this is the artifact to upload to Seaport DevNet.

### Daml Test (requires Java)

```bash
cd daml
dpm test
```

### Codegen

```bash
cd daml
dpm codegen-js
```

Output in `lib/daml/generated/`.

## Non-Negotiables

1. **Never** allow a consuming choice on a multi-signatory contract to be exercised by fewer than the full authorized set of controllers
2. **Never** grant the Regulator party observer status on any trade-level template
3. **Never** store private key material outside the Stronghold vault or Wallet Gateway boundary
4. **Never** vet a DAR without 100% `dpm test` pass (including negative-authorization suite)
5. **Never** reintroduce `@daml/ledger` or `@daml/react` (target removed JSON Ledger API v1)

## Verification

| Check | Command |
|---|---|
| TypeScript strict check | `npx tsc --strict --noEmit` |
| Unit tests | `npx vitest run` |
| Daml build | `dpm build --all` |
| Daml tests | `cd daml/templates && dpm test` |
| Privacy mapping audit | `node scripts/audit-privacy-mapping.mjs` |

## Security

- **Party allowlist**: Only 3 hardcoded Party IDs are authorized to connect. The `middleware.ts` guard rejects unauthorized `X-Party-Id` headers with 403 on all `/api/*` routes. The `ConnectWalletDialog` also validates client-side before allowing connection.
- **Server-side party authorization**: Every API route handler validates that the authenticated `X-Party-Id` matches the `actAs`/`proposer`/`acceptor` fields in the request body. Margin Post/Dispute routes additionally query the ACS to confirm the caller is the `calledDealer`.
- **Canton Ledger API auth**: All ledger commands authenticate via OAuth2 client-credentials flow (`lib/canton/auth.ts`). Tokens are obtained from `auth.sandbox.fivenorth.io` and automatically refreshed before 8-hour expiry.
- **Template authorization**: Daml contracts enforce multi-party consent at the ledger level. Every consuming choice on a multi-signatory contract requires the full set of controllers to authorize.

## License

MIT
