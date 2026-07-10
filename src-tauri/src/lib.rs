mod commands;
mod state;

use state::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().level(log::LevelFilter::Info).build())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_stronghold::Builder::default().build())
        .manage(AppState::new())
        .invoke_handler(tauri::generate_handler![
            commands::wallet::connect_wallet,
            commands::wallet::disconnect_wallet,
            commands::wallet::get_wallet_status,
            commands::trade::propose_trade,
            commands::trade::accept_trade,
            commands::trade::get_trades,
            commands::trade::get_proposals,
            commands::margin::demand_margin,
            commands::margin::post_margin,
            commands::margin::dispute_margin,
            commands::margin::get_margin_calls,
            commands::novation::initiate_novation,
            commands::novation::countersign_novation,
            commands::novation::complete_novation,
            commands::novation::get_novation_requests,
            commands::disclosure::publish_disclosure,
            commands::disclosure::get_disclosures,
            commands::disclosure::get_disclosure_by_id,
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
