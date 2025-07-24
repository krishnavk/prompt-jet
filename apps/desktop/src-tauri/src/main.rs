// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::api::process::{Command as SidecarCommand, CommandEvent};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Configure server port - use environment variable or default
            let port = std::env::var("PROMPT_JET_SERVER_PORT").unwrap_or_else(|_| "3000".to_string());
            
            println!("Attempting to spawn prompt-jet-server sidecar on port: {}", port);
            
            // Start the server process using Tauri's sidecar system
            let (mut rx, _child) = SidecarCommand::new_sidecar("prompt-jet-server")
                .expect("failed to create sidecar command")
                .args(&["--port", &port])
                .spawn()
                .expect("Failed to spawn server sidecar");

            // Handle server output
            tauri::async_runtime::spawn(async move {
                while let Some(event) = rx.recv().await {
                    match event {
                        CommandEvent::Stdout(line) => {
                            println!("Server stdout: {}", line);
                        }
                        CommandEvent::Stderr(line) => {
                            eprintln!("Server stderr: {}", line);
                        }
                        _ => {}
                    }
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}