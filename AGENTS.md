# DERIVE — Confidential Bilateral Derivatives Margin & Novation Network

## Stack
- **Desktop shell**: Tauri v2 (Rust backend + WebView2)
- **Frontend**: Next.js (static export) + React 19 + shadcn/ui + Zustand + TanStack Query
- **Smart contracts**: Daml (Canton SDK 3.4+, `dpm` CLI)
- **Network**: Canton Network — Devnet
- **Wallet**: CIP-103 dApp API (`@canton-network/dapp-sdk`)

## Key Commands

```bash
# Frontend dev
npm run dev

# Frontend build + type check
npm run build
npx tsc --strict --noEmit

# Rust IPC layer
cd src-tauri && cargo check && cargo clippy -- -D warnings

# Daml (requires dpm CLI)
cd daml && dpm build && dpm test

# Scripts
node scripts/lint-capabilities.mjs
node scripts/audit-privacy-mapping.mjs
```

## Critical Rules (from spec §Non-Negotiables)
1. Never allow a consuming choice on a multi-signatory contract to be exercised by fewer than the full authorized set of controllers
2. Never grant the Regulator party observer status on any trade-level template
3. Never store private key material outside Stronghold vault or Wallet Gateway
4. Never vet a DAR without 100% `dpm test` pass (including negative-authorization suite)
5. Never reintroduce `@daml/ledger` or `@daml/react` (target removed JSON Ledger API v1)
6. Never weaken Tauri CSP or capability model without security review
