/**
 * Inter-Process Communication Layer
 * 
 * Browser/Vercel mode: makes fetch() calls to Next.js API routes.
 * This module provides a typed interface between the UI and the backend.
 */

let _partyId: string | null = null;
let _participantUrl: string | null = null;

class IpcError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = "IpcError";
    this.code = code;
  }
}

function getPayloadValue(payload: Record<string, unknown>, key: string): unknown {
  return payload[key];
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (_partyId) headers["X-Party-Id"] = _partyId;

  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
  });

  if (!res.ok) {
    const text = await res.text();
    let parsed: { error?: string } = {};
    try { parsed = JSON.parse(text); } catch {}
    throw new IpcError("API_ERROR", parsed.error ?? `HTTP ${res.status}: ${text}`);
  }

  return res.json();
}

export const ipc = {
  wallet: {
    connect: async (input: { wallet_provider: string; participant_url: string; party_id: string }) => {
      _partyId = input.party_id;
      _participantUrl = input.participant_url;
      return { connected: true, party_hint: _partyId };
    },
    disconnect: async () => {
      _partyId = null;
      _participantUrl = null;
    },
    status: async () => ({
      connected: _partyId !== null,
      party_hint: _partyId,
      participant_url: _participantUrl,
      wallet_provider: _participantUrl,
    }),
  },
  trade: {
    propose: (input: {
      acceptor: string;
      notional: number;
      fixed_rate: number;
      effective_date: string;
      maturity_date: string;
    }) =>
      apiFetch<{ success: boolean; proposal_id: string; status: string }>("/api/trade/propose", {
        method: "POST",
        body: JSON.stringify({
          proposer: _partyId,
          acceptor: input.acceptor,
          instrumentLabel: "IRS",
          notional: input.notional,
          fixedRate: input.fixed_rate,
          effectiveDate: input.effective_date,
          maturityDate: input.maturity_date,
        }),
      }),
    accept: (input: { proposal_id: string }) =>
      apiFetch<{ success: boolean; trade_id: string; status: string }>(`/api/trade/${input.proposal_id}/accept`, {
        method: "POST",
        body: JSON.stringify({ acceptor: _partyId }),
      }),
    list: () =>
      apiFetch<{ success: boolean; trades: { contractId: string; payload: Record<string, unknown> }[] }>(`/api/trade/list?party=${_partyId}`)
        .then((r) =>
          (r.trades ?? []).map((t) => ({
            trade_id: t.contractId ?? "",
            dealer_a: String(getPayloadValue(t.payload, "dealerA") ?? ""),
            dealer_b: String(getPayloadValue(t.payload, "dealerB") ?? ""),
            notional: Number(getPayloadValue(t.payload, "notional") ?? 0),
            status: "active" as const,
          }))
        ),
    proposals: () =>
      apiFetch<{ success: boolean; proposals: { contractId: string; payload: Record<string, unknown> }[] }>(`/api/trade/list?party=${_partyId}`)
        .then((r) =>
          (r.proposals ?? []).map((p) => ({
            proposal_id: p.contractId ?? "",
            proposer: String(getPayloadValue(p.payload, "proposer") ?? ""),
            acceptor: String(getPayloadValue(p.payload, "acceptor") ?? ""),
            notional: Number(getPayloadValue(p.payload, "notional") ?? 0),
            fixed_rate: Number(getPayloadValue(p.payload, "fixedRate") ?? 0),
            status: "pending" as const,
          }))
        ),
  },
  margin: {
    demand: (input: {
      called_dealer: string;
      trade_cid: string;
      amount_required: number;
      currency: string;
      due_date: string;
    }) =>
      apiFetch<{ success: boolean; demand_id: string; status: string }>("/api/margin/demand", {
        method: "POST",
        body: JSON.stringify({
          callingDealer: _partyId,
          calledDealer: input.called_dealer,
          tradeCid: input.trade_cid,
          amountRequired: input.amount_required,
          currency: input.currency,
          dueDate: input.due_date,
        }),
      }),
    post: (input: { demand_id: string }) =>
      apiFetch<{ success: boolean; demand_id: string; posted: boolean }>(`/api/margin/${input.demand_id}/post`, {
        method: "POST",
        body: JSON.stringify({ actAs: [_partyId] }),
      }),
    dispute: (input: { demand_id: string }) =>
      apiFetch<{ success: boolean; demand_id: string; disputed: boolean }>(`/api/margin/${input.demand_id}/dispute`, {
        method: "POST",
        body: JSON.stringify({ actAs: [_partyId] }),
      }),
    list: () =>
      apiFetch<{ success: boolean; marginCalls: { contractId: string; payload: Record<string, unknown> }[] }>(`/api/margin/list?party=${_partyId}`)
        .then((r) =>
          (r.marginCalls ?? []).map((m) => ({
            demand_id: m.contractId ?? "",
            calling_dealer: String(getPayloadValue(m.payload, "callingDealer") ?? ""),
            called_dealer: String(getPayloadValue(m.payload, "calledDealer") ?? ""),
            amount_required: Number(getPayloadValue(m.payload, "amountRequired") ?? 0),
            posted: Boolean(getPayloadValue(m.payload, "posted") ?? false),
            disputed: Boolean(getPayloadValue(m.payload, "disputed") ?? false),
          }))
        ),
  },
  novation: {
    initiate: (input: {
      remaining_dealer: string;
      incoming_dealer: string;
      original_trade_cid: string;
      notional: number;
    }) =>
      apiFetch<{ success: boolean; request_id: string; status: string }>("/api/novation/request", {
        method: "POST",
        body: JSON.stringify({
          actAs: [_partyId, input.remaining_dealer, input.incoming_dealer],
          outgoingDealer: _partyId,
          remainingDealer: input.remaining_dealer,
          incomingDealer: input.incoming_dealer,
          originalTradeCid: input.original_trade_cid,
          notional: input.notional,
        }),
      }),
    countersign: (input: { request_id: string; as_party: string }) =>
      apiFetch<{ success: boolean; request_id: string }>(`/api/novation/${input.request_id}/countersign`, {
        method: "POST",
        body: JSON.stringify({
          actAs: [_partyId!],
          role: input.as_party === "incoming" ? "incoming" : "remaining",
        }),
      }),
    complete: (input: { request_id: string; parties: string[] }) =>
      apiFetch<{ success: boolean; status: string }>(`/api/novation/${input.request_id}/complete`, {
        method: "POST",
        body: JSON.stringify({ actAs: input.parties }),
      }),
    list: () =>
      apiFetch<{ success: boolean; novationRequests: { contractId: string; payload: Record<string, unknown> }[] }>(`/api/novation/list?party=${_partyId}`)
        .then((r) =>
          (r.novationRequests ?? []).map((n) => ({
            request_id: n.contractId ?? "",
            outgoing_dealer: String(getPayloadValue(n.payload, "outgoingDealer") ?? ""),
            remaining_dealer: String(getPayloadValue(n.payload, "remainingDealer") ?? ""),
            incoming_dealer: String(getPayloadValue(n.payload, "incomingDealer") ?? ""),
            notional: Number(getPayloadValue(n.payload, "notional") ?? 0),
            remaining_consented: Boolean(getPayloadValue(n.payload, "remainingDealerConsented") ?? false),
            incoming_consented: Boolean(getPayloadValue(n.payload, "incomingDealerConsented") ?? false),
            status: "pending_signatures" as string,
          }))
        ),
  },
  disclosure: {
    publish: (input: {
      notional_bucket: string;
      asset_class: string;
      maturity_bucket: string;
      counterparty_leis: string[];
      trade_count: number;
      total_gross_notional: number;
      schema_version: string;
    }) =>
      apiFetch<{ success: boolean; report_id: string }>("/api/disclosure", {
        method: "POST",
        body: JSON.stringify({
          regulator: _partyId,
          notionalBucket: input.notional_bucket,
          assetClass: input.asset_class,
          maturityBucket: input.maturity_bucket,
          counterpartyLeis: input.counterparty_leis,
          tradeCount: input.trade_count,
          totalGrossNotional: input.total_gross_notional,
          schemaVersion: input.schema_version,
        }),
      }),
    list: () =>
      apiFetch<{ success: boolean; disclosures: { contractId: string; payload: Record<string, unknown> }[] }>(`/api/disclosure/list?party=${_partyId}`)
        .then((r) =>
          (r.disclosures ?? []).map((d) => ({
            report_id: d.contractId ?? "",
            notional_bucket: String(getPayloadValue(d.payload, "notionalBucket") ?? ""),
            asset_class: String(getPayloadValue(d.payload, "assetClass") ?? ""),
            trade_count: Number(getPayloadValue(d.payload, "tradeCount") ?? 0),
            total_gross_notional: Number(getPayloadValue(d.payload, "totalGrossNotional") ?? 0),
            generated_at: String(getPayloadValue(d.payload, "generatedAt") ?? ""),
          }))
        ),
  },
};
