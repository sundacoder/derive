type CommandError = { code: string; message: string };

let _partyId: string | null = null;
let _participantUrl: string | null = null;

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (_partyId) headers["X-Party-Id"] = _partyId;

  const res = await fetch(url, { ...options, headers: { ...headers, ...(options?.headers as Record<string, string>) } });

  if (!res.ok) {
    const text = await res.text();
    let parsed: { error?: string } = {};
    try { parsed = JSON.parse(text); } catch {}
    throw { code: "API_ERROR", message: parsed.error ?? `HTTP ${res.status}: ${text}` } as CommandError;
  }

  return res.json();
}

export const ipc = {
  wallet: {
    connect: async (input: { wallet_provider: string; participant_url: string }) => {
      _partyId = input.participant_url;
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
      apiFetch<{ success: boolean; trades: { contractId: string; createArguments: Record<string, unknown> }[] }>(`/api/trade/list?party=${_partyId}`)
        .then((r) =>
          (r.trades ?? []).map((t) => ({
            trade_id: t.contractId ?? "",
            dealer_a: String((t.createArguments as any)?.dealerA ?? ""),
            dealer_b: String((t.createArguments as any)?.dealerB ?? ""),
            notional: Number((t.createArguments as any)?.notional ?? 0),
            status: "active",
          }))
        ),
    proposals: () =>
      apiFetch<{ success: boolean; proposals: { contractId: string; createArguments: Record<string, unknown> }[] }>(`/api/trade/list?party=${_partyId}`)
        .then((r) =>
          ((r as any).proposals ?? []).map((p: any) => ({
            proposal_id: p.contractId ?? "",
            proposer: String(p.createArguments?.proposer ?? ""),
            acceptor: String(p.createArguments?.acceptor ?? ""),
            notional: Number(p.createArguments?.notional ?? 0),
            fixed_rate: Number(p.createArguments?.fixedRate ?? 0),
            status: "pending",
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
      apiFetch<{ success: boolean; marginCalls: { contractId: string; createArguments: Record<string, unknown> }[] }>(`/api/margin/list?party=${_partyId}`)
        .then((r) =>
          (r.marginCalls ?? []).map((m) => ({
            demand_id: m.contractId ?? "",
            calling_dealer: String((m.createArguments as any)?.callingDealer ?? ""),
            called_dealer: String((m.createArguments as any)?.calledDealer ?? ""),
            amount_required: Number((m.createArguments as any)?.amountRequired ?? 0),
            posted: Boolean((m.createArguments as any)?.posted ?? false),
            disputed: Boolean((m.createArguments as any)?.disputed ?? false),
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
    countersign: (input: { request_id: string; as_party: string }) => {
      const role = input.as_party === "incoming" ? "incoming" : "remaining";
      const partyId = role === input.as_party ? _partyId! : input.as_party;
      return apiFetch<{ success: boolean; request_id: string }>(`/api/novation/${input.request_id}/countersign`, {
        method: "POST",
        body: JSON.stringify({ actAs: [partyId], role }),
      });
    },
    complete: (input: { request_id: string }) =>
      apiFetch<{ success: boolean; status: string }>(`/api/novation/${input.request_id}/complete`, {
        method: "POST",
        body: JSON.stringify({ actAs: [_partyId] }),
      }),
    list: () =>
      apiFetch<{ success: boolean; novationRequests: { contractId: string; createArguments: Record<string, unknown> }[] }>(`/api/novation/list?party=${_partyId}`)
        .then((r) =>
          (r.novationRequests ?? []).map((n) => ({
            request_id: n.contractId ?? "",
            outgoing_dealer: String((n.createArguments as any)?.outgoingDealer ?? ""),
            remaining_dealer: String((n.createArguments as any)?.remainingDealer ?? ""),
            incoming_dealer: String((n.createArguments as any)?.incomingDealer ?? ""),
            notional: Number((n.createArguments as any)?.notional ?? 0),
            remaining_consented: Boolean((n.createArguments as any)?.remainingDealerConsented ?? false),
            incoming_consented: Boolean((n.createArguments as any)?.incomingDealerConsented ?? false),
            status: "pending_signatures",
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
      apiFetch<{ success: boolean; disclosures: { contractId: string; createArguments: Record<string, unknown> }[] }>(`/api/disclosure/list?party=${_partyId}`)
        .then((r) =>
          (r.disclosures ?? []).map((d) => ({
            report_id: d.contractId ?? "",
            notional_bucket: String((d.createArguments as any)?.notionalBucket ?? ""),
            asset_class: String((d.createArguments as any)?.assetClass ?? ""),
            trade_count: Number((d.createArguments as any)?.tradeCount ?? 0),
            total_gross_notional: Number((d.createArguments as any)?.totalGrossNotional ?? 0),
            generated_at: String((d.createArguments as any)?.generatedAt ?? ""),
          }))
        ),
  },
};
