// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::api::process::{Command as SidecarCommand, CommandEvent};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Get the directory where the binary is located
            let app_dir = app.path_resolver().resource_dir().unwrap();
            let binary_path = app_dir.join("../MacOS/prompt-jet-server");
            
            println!("Attempting to spawn server from: {:?}", binary_path);
            
            // Check if file exists
            if !binary_path.exists() {
                println!("Binary does not exist at: {:?}", binary_path);
                
                // List directory contents for debugging
                let parent_dir = binary_path.parent().unwrap();
                if let Ok(entries) = std::fs::read_dir(parent_dir) {
                    for entry in entries {
                        if let Ok(entry) = entry {
                            println!("Found file: {:?}", entry.file_name());
                        }
                    }
                }
                
                panic!("Server binary not found");
            }
            
            // Configure server port - use environment variable or default
            let port = std::env::var("PROMPT_JET_SERVER_PORT").unwrap_or_else(|_| "3001".to_string());
            
            // Start the server process
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