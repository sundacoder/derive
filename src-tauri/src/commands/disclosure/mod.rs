use serde::{Deserialize, Serialize};
use tracing::{event, Level};
use uuid::Uuid;

use crate::state::DisclosureView;

#[derive(Debug, Serialize, Deserialize)]
pub struct PublishDisclosureInput {
    pub notional_bucket: String,
    pub asset_class: String,
    pub maturity_bucket: String,
    pub counterparty_leis: Vec<String>,
    pub trade_count: u32,
    pub total_gross_notional: f64,
    pub schema_version: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PublishDisclosureResult {
    pub report_id: String,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommandError {
    pub code: String,
    pub message: String,
}

#[tauri::command]
pub async fn publish_disclosure(
    input: PublishDisclosureInput,
) -> Result<PublishDisclosureResult, CommandError> {
    let report_id = Uuid::new_v4().to_string();

    if input.schema_version != "1.0.0" {
        return Err(CommandError {
            code: "FIELD_SET_MISMATCH".to_string(),
            message: format!(
                "Unsupported schema version: {}. Expected 1.0.0",
                input.schema_version
            ),
        });
    }

    event!(
        Level::INFO,
        "disclosure.published",
        reportId = &report_id,
        fieldSetVersion = &input.schema_version,
    );

    Ok(PublishDisclosureResult {
        report_id,
        status: "published".to_string(),
    })
}

#[tauri::command]
pub async fn get_disclosures() -> Result<Vec<DisclosureView>, CommandError> {
    Ok(vec![])
}

#[tauri::command]
pub async fn get_disclosure_by_id(report_id: String) -> Result<Option<DisclosureView>, CommandError> {
    Ok(None)
}
