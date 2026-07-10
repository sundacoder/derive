use serde::{Deserialize, Serialize};
use tracing::{event, Level};
use uuid::Uuid;

use crate::state::NovationRequestView;

#[derive(Debug, Serialize, Deserialize)]
pub struct InitiateNovationInput {
    pub remaining_dealer: String,
    pub incoming_dealer: String,
    pub original_trade_cid: String,
    pub notional: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InitiateNovationResult {
    pub request_id: String,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CountersignNovationInput {
    pub request_id: String,
    pub as_party: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CountersignNovationResult {
    pub request_id: String,
    pub signatures_remaining: u32,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CompleteNovationInput {
    pub request_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CompleteNovationResult {
    pub status: String,
    pub new_trade_cids: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommandError {
    pub code: String,
    pub message: String,
}

#[tauri::command]
pub async fn initiate_novation(
    input: InitiateNovationInput,
) -> Result<InitiateNovationResult, CommandError> {
    let request_id = Uuid::new_v4().to_string();
    event!(
        Level::INFO,
        "novation.initiated",
        requestId = &request_id,
        originalTradeCid = &input.original_trade_cid,
    );

    Ok(InitiateNovationResult {
        request_id,
        status: "pending_signatures".to_string(),
    })
}

#[tauri::command]
pub async fn countersign_novation(
    input: CountersignNovationInput,
) -> Result<CountersignNovationResult, CommandError> {
    event!(
        Level::INFO,
        "novation.countersign.recorded",
        requestId = &input.request_id,
        signerRole = &input.as_party,
    );

    Ok(CountersignNovationResult {
        request_id: input.request_id,
        signatures_remaining: 1,
        status: "partially_signed".to_string(),
    })
}

#[tauri::command]
pub async fn complete_novation(
    input: CompleteNovationInput,
) -> Result<CompleteNovationResult, CommandError> {
    event!(
        Level::INFO,
        "novation.completed",
        requestId = &input.request_id,
    );

    Ok(CompleteNovationResult {
        status: "completed".to_string(),
        new_trade_cids: vec![
            Uuid::new_v4().to_string(),
            Uuid::new_v4().to_string(),
        ],
    })
}

#[tauri::command]
pub async fn get_novation_requests() -> Result<Vec<NovationRequestView>, CommandError> {
    Ok(vec![])
}
