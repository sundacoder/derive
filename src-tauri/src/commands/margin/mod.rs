use serde::{Deserialize, Serialize};
use tracing::{event, Level};
use uuid::Uuid;

use crate::state::MarginCallView;

#[derive(Debug, Serialize, Deserialize)]
pub struct DemandMarginInput {
    pub called_dealer: String,
    pub trade_cid: String,
    pub amount_required: f64,
    pub currency: String,
    pub due_date: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DemandMarginResult {
    pub demand_id: String,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PostMarginInput {
    pub demand_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PostMarginResult {
    pub demand_id: String,
    pub posted: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DisputeMarginInput {
    pub demand_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DisputeMarginResult {
    pub demand_id: String,
    pub disputed: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommandError {
    pub code: String,
    pub message: String,
}

#[tauri::command]
pub async fn demand_margin(input: DemandMarginInput) -> Result<DemandMarginResult, CommandError> {
    let demand_id = Uuid::new_v4().to_string();
    event!(
        Level::INFO,
        "margin.call.demanded",
        demandId = &demand_id,
        amount = input.amount_required,
    );

    Ok(DemandMarginResult {
        demand_id,
        status: "pending_response".to_string(),
    })
}

#[tauri::command]
pub async fn post_margin(input: PostMarginInput) -> Result<PostMarginResult, CommandError> {
    event!(
        Level::INFO,
        "margin.call.posted",
        demandId = &input.demand_id,
    );

    Ok(PostMarginResult {
        demand_id: input.demand_id,
        posted: true,
    })
}

#[tauri::command]
pub async fn dispute_margin(input: DisputeMarginInput) -> Result<DisputeMarginResult, CommandError> {
    event!(
        Level::INFO,
        "margin.call.disputed",
        demandId = &input.demand_id,
    );

    Ok(DisputeMarginResult {
        demand_id: input.demand_id,
        disputed: true,
    })
}

#[tauri::command]
pub async fn get_margin_calls() -> Result<Vec<MarginCallView>, CommandError> {
    Ok(vec![])
}
