use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WalletConnection {
    pub connected: bool,
    pub party_hint: Option<String>,
    pub participant_url: Option<String>,
    pub wallet_provider: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TradeProposalView {
    pub proposal_id: String,
    pub proposer: String,
    pub acceptor: String,
    pub notional: f64,
    pub fixed_rate: f64,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DerivativeTradeView {
    pub trade_id: String,
    pub dealer_a: String,
    pub dealer_b: String,
    pub notional: f64,
    pub fixed_rate: f64,
    pub effective_date: String,
    pub maturity_date: String,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarginCallView {
    pub demand_id: String,
    pub calling_dealer: String,
    pub called_dealer: String,
    pub amount_required: f64,
    pub currency: String,
    pub due_date: String,
    pub posted: bool,
    pub disputed: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NovationRequestView {
    pub request_id: String,
    pub outgoing_dealer: String,
    pub remaining_dealer: String,
    pub incoming_dealer: String,
    pub notional: f64,
    pub remaining_consented: bool,
    pub incoming_consented: bool,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DisclosureView {
    pub report_id: String,
    pub notional_bucket: String,
    pub asset_class: String,
    pub maturity_bucket: String,
    pub trade_count: u32,
    pub total_gross_notional: f64,
    pub generated_at: String,
}

pub struct AppState {
    pub wallet: Mutex<WalletConnection>,
    pub participant_base_url: Mutex<String>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            wallet: Mutex::new(WalletConnection {
                connected: false,
                party_hint: None,
                participant_url: None,
                wallet_provider: None,
            }),
            participant_base_url: Mutex::new("http://localhost:5011".to_string()),
        }
    }
}
