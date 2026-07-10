use serde::{Deserialize, Serialize};
use tauri::State;
use tracing::{event, Level};
use uuid::Uuid;

use crate::state::{AppState, DerivativeTradeView, TradeProposalView};

#[derive(Debug, Serialize, Deserialize)]
pub struct ProposeTradeInput {
    pub acceptor: String,
    pub notional: f64,
    pub fixed_rate: f64,
    pub effective_date: String,
    pub maturity_date: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProposeTradeResult {
    pub proposal_id: String,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AcceptTradeInput {
    pub proposal_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AcceptTradeResult {
    pub trade_id: String,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommandError {
    pub code: String,
    pub message: String,
}

#[tauri::command]
pub async fn propose_trade(
    input: ProposeTradeInput,
    state: State<'_, AppState>,
) -> Result<ProposeTradeResult, CommandError> {
    let wallet = state.wallet.lock().map_err(|e| CommandError {
        code: "STATE_LOCK".to_string(),
        message: e.to_string(),
    })?;

    if !wallet.connected {
        return Err(CommandError {
            code: "WALLET_NOT_CONNECTED".to_string(),
            message: "Wallet must be connected to propose a trade".to_string(),
        });
    }

    let proposal_id = Uuid::new_v4().to_string();
    event!(
        Level::INFO,
        "ledger.command.submitted",
        templateId = "TradeProposal",
        choiceName = "create",
        proposalId = &proposal_id,
    );

    Ok(ProposeTradeResult {
        proposal_id,
        status: "pending_acceptor".to_string(),
    })
}

#[tauri::command]
pub async fn accept_trade(
    input: AcceptTradeInput,
) -> Result<AcceptTradeResult, CommandError> {
    let trade_id = Uuid::new_v4().to_string();
    event!(
        Level::INFO,
        "ledger.command.submitted",
        templateId = "TradeProposal",
        choiceName = "Accept",
        proposalId = &input.proposal_id,
    );

    Ok(AcceptTradeResult {
        trade_id,
        status: "active".to_string(),
    })
}

#[tauri::command]
pub async fn get_trades() -> Result<Vec<DerivativeTradeView>, CommandError> {
    Ok(vec![])
}

#[tauri::command]
pub async fn get_proposals() -> Result<Vec<TradeProposalView>, CommandError> {
    Ok(vec![])
}
