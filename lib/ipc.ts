import type { CommandError } from "./types";

async function invoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  try {
    const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
    return await tauriInvoke<T>(command, args);
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && "message" in e) {
      throw e as CommandError;
    }
    throw { code: "IPC_ERROR", message: String(e) } as CommandError;
  }
}

export const ipc = {
  wallet: {
    connect: (input: { wallet_provider: string; participant_url: string }) =>
      invoke<{ connected: boolean; party_hint: string }>("connect_wallet", { input }),
    disconnect: () => invoke<void>("disconnect_wallet"),
    status: () =>
      invoke<{
        connected: boolean;
        party_hint: string | null;
        participant_url: string | null;
        wallet_provider: string | null;
      }>("get_wallet_status"),
  },
  trade: {
    propose: (input: {
      acceptor: string;
      notional: number;
      fixed_rate: number;
      effective_date: string;
      maturity_date: string;
    }) => invoke<{ proposal_id: string; status: string }>("propose_trade", { input }),
    accept: (input: { proposal_id: string }) =>
      invoke<{ trade_id: string; status: string }>("accept_trade", { input }),
    list: () =>
      invoke<
        {
          trade_id: string;
          dealer_a: string;
          dealer_b: string;
          notional: number;
          status: string;
        }[]
      >("get_trades"),
    proposals: () =>
      invoke<
        { proposal_id: string; proposer: string; acceptor: string; notional: number; fixed_rate: number; status: string }[]
      >("get_proposals"),
  },
  margin: {
    demand: (input: {
      called_dealer: string;
      trade_cid: string;
      amount_required: number;
      currency: string;
      due_date: string;
    }) => invoke<{ demand_id: string; status: string }>("demand_margin", { input }),
    post: (input: { demand_id: string }) =>
      invoke<{ demand_id: string; posted: boolean }>("post_margin", { input }),
    dispute: (input: { demand_id: string }) =>
      invoke<{ demand_id: string; disputed: boolean }>("dispute_margin", { input }),
    list: () =>
      invoke<
        {
          demand_id: string;
          calling_dealer: string;
          called_dealer: string;
          amount_required: number;
          posted: boolean;
          disputed: boolean;
        }[]
      >("get_margin_calls"),
  },
  novation: {
    initiate: (input: {
      remaining_dealer: string;
      incoming_dealer: string;
      original_trade_cid: string;
      notional: number;
    }) => invoke<{ request_id: string; status: string }>("initiate_novation", { input }),
    countersign: (input: { request_id: string; as_party: string }) =>
      invoke<{ request_id: string; signatures_remaining: number; status: string }>(
        "countersign_novation",
        { input },
      ),
    complete: (input: { request_id: string }) =>
      invoke<{ status: string; new_trade_cids: string[] }>("complete_novation", { input }),
    list: () =>
      invoke<
        {
          request_id: string;
          outgoing_dealer: string;
          remaining_dealer: string;
          incoming_dealer: string;
          notional: number;
          remaining_consented: boolean;
          incoming_consented: boolean;
          status: string;
        }[]
      >("get_novation_requests"),
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
    }) => invoke<{ report_id: string; status: string }>("publish_disclosure", { input }),
    list: () =>
      invoke<
        {
          report_id: string;
          notional_bucket: string;
          asset_class: string;
          trade_count: number;
          total_gross_notional: number;
          generated_at: string;
        }[]
      >("get_disclosures"),
  },
};
