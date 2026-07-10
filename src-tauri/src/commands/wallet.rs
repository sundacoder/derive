use serde::{Deserialize, Serialize};
use tauri::State;
use tracing::{event, Level};

use crate::state::{AppState, WalletConnection};

#[derive(Debug, Serialize, Deserialize)]
pub struct ConnectWalletInput {
    pub wallet_provider: String,
    pub participant_url: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ConnectWalletResult {
    pub connected: bool,
    pub party_hint: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WalletError {
    pub code: String,
    pub message: String,
}

#[tauri::command]
pub async fn connect_wallet(
    input: ConnectWalletInput,
    state: State<'_, AppState>,
) -> Result<ConnectWalletResult, WalletError> {
    event!(Level::INFO, "wallet.cip103.connected");

    let party_hint = format!("party-{}", uuid::Uuid::new_v4().to_string().get(..8).unwrap_or("dev"));

    let mut wallet = state.wallet.lock().map_err(|e| WalletError {
        code: "STATE_LOCK_ERROR".to_string(),
        message: format!("Failed to lock state: {}", e),
    })?;

    *wallet = WalletConnection {
        connected: true,
        party_hint: Some(party_hint.clone()),
        participant_url: Some(input.participant_url.clone()),
        wallet_provider: Some(input.wallet_provider),
    };

    let mut base_url = state.participant_base_url.lock().map_err(|e| WalletError {
        code: "STATE_LOCK_ERROR".to_string(),
        message: format!("Failed to lock state: {}", e),
    })?;
    *base_url = input.participant_url;

    Ok(ConnectWalletResult {
        connected: true,
        party_hint,
    })
}

#[tauri::command]
pub async fn disconnect_wallet(state: State<'_, AppState>) -> Result<(), WalletError> {
    let mut wallet = state.wallet.lock().map_err(|e| WalletError {
        code: "STATE_LOCK_ERROR".to_string(),
        message: format!("Failed to lock state: {}", e),
    })?;

    *wallet = WalletConnection {
        connected: false,
        party_hint: None,
        participant_url: None,
        wallet_provider: None,
    };

    event!(Level::INFO, "wallet.disconnected");
    Ok(())
}

#[tauri::command]
pub async fn get_wallet_status(state: State<'_, AppState>) -> Result<WalletConnection, WalletError> {
    let wallet = state.wallet.lock().map_err(|e| WalletError {
        code: "STATE_LOCK_ERROR".to_string(),
        message: format!("Failed to lock state: {}", e),
    })?;

    Ok(wallet.clone())
}
