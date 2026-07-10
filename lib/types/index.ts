import { z } from "zod";

export const PartySchema = z.string();
export type Party = z.infer<typeof PartySchema>;

export const CurrencySchema = z.string().length(3);
export type Currency = z.infer<typeof CurrencySchema>;

export const TradeStatusSchema = z.enum(["pending", "active", "novating", "completed", "disputed"]);
export type TradeStatus = z.infer<typeof TradeStatusSchema>;

export const NovationStatusSchema = z.enum(["pending_signatures", "partially_signed", "completed", "rejected"]);
export type NovationStatus = z.infer<typeof NovationStatusSchema>;

export const MarginStatusSchema = z.enum(["demanded", "posted", "disputed", "expired"]);
export type MarginStatus = z.infer<typeof MarginStatusSchema>;

export const WalletConnectionSchema = z.object({
  connected: z.boolean(),
  party_hint: z.string().nullable(),
  participant_url: z.string().nullable(),
  wallet_provider: z.string().nullable(),
});
export type WalletConnection = z.infer<typeof WalletConnectionSchema>;

export const ConnectWalletInputSchema = z.object({
  wallet_provider: z.string(),
  participant_url: z.string(),
});
export type ConnectWalletInput = z.infer<typeof ConnectWalletInputSchema>;

export const ProposeTradeInputSchema = z.object({
  acceptor: z.string(),
  notional: z.number().positive(),
  fixed_rate: z.number().min(0).max(1),
  effective_date: z.string(),
  maturity_date: z.string(),
});
export type ProposeTradeInput = z.infer<typeof ProposeTradeInputSchema>;

export const DerivativeTradeViewSchema = z.object({
  trade_id: z.string(),
  dealer_a: z.string(),
  dealer_b: z.string(),
  notional: z.number(),
  fixed_rate: z.number(),
  effective_date: z.string(),
  maturity_date: z.string(),
  status: TradeStatusSchema,
});
export type DerivativeTradeView = z.infer<typeof DerivativeTradeViewSchema>;

export const TradeProposalViewSchema = z.object({
  proposal_id: z.string(),
  proposer: z.string(),
  acceptor: z.string(),
  notional: z.number(),
  fixed_rate: z.number(),
  status: z.string(),
});
export type TradeProposalView = z.infer<typeof TradeProposalViewSchema>;

export const DemandMarginInputSchema = z.object({
  called_dealer: z.string(),
  trade_cid: z.string(),
  amount_required: z.number().positive(),
  currency: CurrencySchema,
  due_date: z.string(),
});
export type DemandMarginInput = z.infer<typeof DemandMarginInputSchema>;

export const MarginCallViewSchema = z.object({
  demand_id: z.string(),
  calling_dealer: z.string(),
  called_dealer: z.string(),
  amount_required: z.number(),
  currency: z.string(),
  due_date: z.string(),
  posted: z.boolean(),
  disputed: z.boolean(),
});
export type MarginCallView = z.infer<typeof MarginCallViewSchema>;

export const InitiateNovationInputSchema = z.object({
  remaining_dealer: z.string(),
  incoming_dealer: z.string(),
  original_trade_cid: z.string(),
  notional: z.number().positive(),
});
export type InitiateNovationInput = z.infer<typeof InitiateNovationInputSchema>;

export const NovationRequestViewSchema = z.object({
  request_id: z.string(),
  outgoing_dealer: z.string(),
  remaining_dealer: z.string(),
  incoming_dealer: z.string(),
  notional: z.number(),
  remaining_consented: z.boolean(),
  incoming_consented: z.boolean(),
  status: NovationStatusSchema,
});
export type NovationRequestView = z.infer<typeof NovationRequestViewSchema>;

export const PublishDisclosureInputSchema = z.object({
  notional_bucket: z.string(),
  asset_class: z.string(),
  maturity_bucket: z.string(),
  counterparty_leis: z.array(z.string()),
  trade_count: z.number().int().nonnegative(),
  total_gross_notional: z.number().nonnegative(),
  schema_version: z.string(),
});
export type PublishDisclosureInput = z.infer<typeof PublishDisclosureInputSchema>;

export const DisclosureViewSchema = z.object({
  report_id: z.string(),
  notional_bucket: z.string(),
  asset_class: z.string(),
  maturity_bucket: z.string(),
  trade_count: z.number(),
  total_gross_notional: z.number(),
  generated_at: z.string(),
});
export type DisclosureView = z.infer<typeof DisclosureViewSchema>;

export const CommandErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
});
export type CommandError = z.infer<typeof CommandErrorSchema>;
