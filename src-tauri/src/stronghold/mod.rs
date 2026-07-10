use tauri::AppHandle;
use tauri_plugin_stronghold::{Stronghold, StrongholdExt};

pub fn get_stronghold(app: &AppHandle) -> Result<Stronghold, String> {
    app.stronghold()
        .ok_or_else(|| "Stronghold not initialized".to_string())
}

pub fn store_secret(stronghold: &Stronghold, key: &str, value: &str) -> Result<(), String> {
    let vault_path = "derive-vault";
    let record_path = key;
    let store = stronghold.store();
    store
        .set(vault_path, record_path, value.as_bytes().to_vec())
        .map_err(|e| format!("Failed to store secret: {}", e))
}

pub fn get_secret(stronghold: &Stronghold, key: &str) -> Result<String, String> {
    let vault_path = "derive-vault";
    let record_path = key;
    let store = stronghold.store();
    let data = store
        .get(vault_path, record_path)
        .map_err(|e| format!("Failed to retrieve secret: {}", e))?
        .ok_or_else(|| format!("Secret '{}' not found", key))?;
    String::from_utf8(data).map_err(|e| format!("Invalid UTF-8: {}", e))
}
