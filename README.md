# DERIVE

**Confidential Bilateral Derivatives Margin & Novation Network**

DERIVE is a desktop application for confidential bilateral derivatives trade affirmation, oracle-fed margin calls, three-party novation, and regulatory disclosure — built on the **Canton Network** using **Daml smart contracts**, with a **Tauri v2** desktop shell and **Next.js** frontend.

## Architecture

```
┌─────────────────────────────────────────────┐
│  Tauri Desktop App (one instance per party) │
│  ┌───────────────────────────────────────┐  │
│  │  Next.js (static export) + React 19   │  │
│  │  Zustand + TanStack Query             │  │
│  ├───────────────────────────────────────┤  │
│  │  Rust IPC Layer                       │  │
│  │  #[tauri::command] · serde_json ↔ Zod│  │
│  ├───────────────────────────────────────┤  │
│  │  Stronghold Vault (dev-mode signing)  │  │
│  └───────────────────────────────────────┘  │
├───────────────────────────────────────────┤
│  Generated Ledger Client                   │
│  (openapi-typescript + openapi-fetch)      │
├───────────────────────────────────────────┤
│  Participant Node — JSON Ledger API v2    │
│  ┌─────────────────────────────────────┐   │
│  │  Vetted DAR (daml-finance + DERIVE) │   │
│  │  PQS — Postgres-backed read model   │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
          │
          ▼
  ┌─────────────────┐
  │ Canton Network  │
  │ Synchronizer    │
  └─────────────────┘
```

## Features

| Flow | Description |
|---|---|
| **F1 — Connect Wallet** | CIP-103 dApp API wallet connection via Stronghold (dev) or Wallet Gateway (production) |
| **F2 — Trade Affirmation** | Propose-accept pattern for bilateral swap derivatives, enforced on-ledger |
| **F3 — Margin Call** | Valuation-triggered margin demands with Post and Dispute choices |
| **F4 — Novation** | Three-party trade novation using Multiple Party Agreement pattern (all three must countersign) |
| **F5 — Regulatory Disclosure** | Aggregated reporting via explicit disclosure contracts — regulator never sees trade economics |
| **F6 — App/DAR Update** | Ed25519-signed Tauri updates and dpm-based DAR lifecycle |

## Stack

| Layer | Technology |
|---|---|
| Desktop shell | **Tauri v2** (Rust + WebView2) |
| Frontend | **Next.js 16** (static export) + **React 19** + **shadcn/ui** + **Zustand** + **TanStack Query** |
| Smart contracts | **Daml** (Canton SDK 3.4+, `dpm` CLI) |
| Financial library | **digital-asset/daml-finance** (Holdings, Instruments, Settlement, Lifecycle) |
| Network | **Canton Network** — Devnet |
| Wallet/auth | **CIP-103** via `@canton-network/dapp-sdk` + Wallet Gateway |
| Off-ledger reads | **Participant Query Store (PQS)** — Postgres |
| IPC validation | **Zod** (TypeScript) + **serde** (Rust) |

## Project Structure

```
derive/
├── app/                          Next.js route groups
│   └── (app)/
│       ├── trade/                Trade affirmation UI
│       ├── margin/               Margin call UI
│       ├── novation/             Novation UI
│       └── disclosure/           Regulatory disclosure UI
├── components/                   React components
│   ├── trade/                    Trade-specific components
│   ├── margin/                   Margin-specific components
│   ├── novation/                 Novation-specific components
│   ├── disclosure/               Disclosure-specific components
│   └── ui/                       shadcn/ui primitives
├── lib/
│   ├── types/                    Shared TypeScript types & Zod schemas
│   ├── stores/                   Zustand stores (wallet, app)
│   ├── daml/generated/           Generated Ledger API client
│   ├── ipc.ts                    Tauri invoke() wrapper
│   └── providers.tsx             TanStack Query provider
├── src-tauri/
│   ├── src/
│   │   ├── commands/             Rust Tauri commands per feature
│   │   ├── state/                Application state
│   │   └── stronghold/           Dev-mode key storage
│   ├── capabilities/             Tauri capability permissions
│   └── tauri.conf.json           Tauri configuration (CSP, window, bundle)
├── daml/
│   ├── src/
│   │   ├── Templates/            Daml contract templates
│   │   ├── Instruments/          Daml Finance instrument extensions
│   │   └── Tests/                Daml Script tests (incl. negative-authorization)
│   ├── daml.yaml                 Daml project config
│   └── multi-package.yaml        Multi-package build config
├── scripts/
│   ├── lint-capabilities.mjs     Tauri capability Poka-Yoke check
│   └── audit-privacy-mapping.mjs Signatory/observer/disclosure audit
├── tests/e2e/                    E2E test specs
├── ADRs/                         Architecture Decision Records
└── openapi/                      JSON Ledger API v2 OpenAPI spec
```

## Getting Started

### Prerequisites

- **Node.js** >= 22
- **Rust** >= 1.77 (stable)
- **dpm CLI** (Digital Asset Package Manager) — Canton SDK 3.4+
- **System dependencies** (Linux):
  ```bash
  sudo apt install pkg-config libgtk-3-dev libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev libssl-dev
  ```

### Install & Run (Frontend)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the UI.

### Type Check

```bash
npx tsc --strict --noEmit
```

### Daml Build & Test

```bash
cd daml
dpm build
dpm test
```

### Rust IPC Layer

```bash
cd src-tauri
cargo check
cargo clippy -- -D warnings
```

## Non-Negotiables

1. **Never** allow a consuming choice on a multi-signatory contract to be exercised by fewer than the full authorized set of controllers
2. **Never** grant the Regulator/Trade Repository party observer status on any trade-level template
3. **Never** store private key material outside the Stronghold vault or Wallet Gateway boundary
4. **Never** vet a DAR without 100% `dpm test` pass (including negative-authorization suite)
5. **Never** reintroduce `@daml/ledger` or `@daml/react` (target removed JSON Ledger API v1)
6. **Never** weaken the Tauri CSP or capability model without security review

## Verification

| Check | Command |
|---|---|
| TypeScript strict check | `npx tsc --strict --noEmit` |
| Rust lint | `cargo clippy -- -D warnings` |
| Daml build | `dpm build` |
| Daml tests | `dpm test` |
| Capabilities lint | `node scripts/lint-capabilities.mjs` |
| Privacy mapping audit | `node scripts/audit-privacy-mapping.mjs` |
| Supply chain audit | `cargo audit && npm audit --audit-level=high` |

## License

MIT
