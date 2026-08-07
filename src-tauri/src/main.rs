// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::Engine;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo {
    pub os_name: String,
    pub os_version: String,
    pub cpu_count: usize,
    pub total_memory_mb: u64,
    pub used_memory_mb: u64,
    pub platform: String,
}

#[tauri::command]
fn save_image_to_disk(path: String, base64_data: String) -> Result<bool, String> {
    const PREFIX: &str = ";base64,";
    let clean_data = if let Some(pos) = base64_data.find(PREFIX) {
        &base64_data[(pos + PREFIX.len())..]
    } else {
        &base64_data
    };

    let bytes = base64::engine::general_purpose::STANDARD
        .decode(clean_data)
        .map_err(|e| format!("Base64 decoding failed: {}", e))?;

    if let Some(parent) = Path::new(&path).parent() {
        if !parent.exists() {
            fs::create_dir_all(parent).map_err(|e| format!("Failed to create parent directory: {}", e))?;
        }
    }

    fs::write(&path, bytes).map_err(|e| format!("Failed to write file to disk: {}", e))?;

    Ok(true)
}

#[tauri::command]
fn get_system_specs() -> SystemInfo {
    let cpu_count = std::thread::available_parallelism()
        .map(|p| p.get())
        .unwrap_or(4);

    SystemInfo {
        os_name: std::env::consts::OS.to_string(),
        os_version: std::env::consts::ARCH.to_string(),
        cpu_count,
        total_memory_mb: 16384,
        used_memory_mb: 4096,
        platform: format!("{}-{}", std::env::consts::OS, std::env::consts::ARCH),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            save_image_to_disk,
            get_system_specs
        ])
        .run(tauri::generate_context!())
        .expect("error while running BOULT AI Ad Generator application");
}

