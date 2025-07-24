# Prompt Jet Desktop

A desktop application for executing and managing LLM prompts, built with Tauri and integrated with a NestJS server.

## Features

- **Integrated Server**: The NestJS server runs as a sidecar process within the desktop app
- **Cross-platform**: Works on Windows, macOS, and Linux
- **Local Processing**: All prompt execution happens locally on your machine
- **Multiple LLM Providers**: Support for OpenAI, LM Studio, and other providers

## Architecture

The desktop app consists of:
- **Frontend**: Next.js web app running in a Tauri window
- **Backend**: NestJS server running as a Tauri sidecar binary
- **Communication**: Frontend communicates with backend via HTTP on localhost

## Development Setup

### Prerequisites

1. **Rust**: Install from [rustup.rs](https://rustup.rs/)
2. **Node.js**: Version 18 or higher
3. **Tauri CLI**: Install with `npm install -g @tauri-apps/cli`

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install server dependencies:
   ```bash
   cd ../server && npm install
   ```

### Development

#### Option 1: Development with separate processes
```bash
# Terminal 1: Start the server
cd apps/server && npm run start:dev

# Terminal 2: Start the desktop app
cd apps/desktop && npm run dev
```

#### Option 2: Development with integrated server
```bash
# Build server binary and start desktop app
npm run build:with-server
```

### Building for Production

#### Build with integrated server
```bash
npm run build:with-server
```

This will:
1. Build the NestJS server into a binary using `pkg`
2. Copy the binary to Tauri's binaries directory
3. Build the Tauri application with the server included

#### Manual build steps
```bash
# Build server binary
cd apps/server && npm run build:binary

# Build desktop app
cd apps/desktop && npm run build
```

## Configuration

### Server Configuration
The server runs on port 3001 by default. You can change this by:
- Setting the `PROMPT_JET_SERVER_PORT` environment variable
- Using the `--port` command line argument

### Frontend Configuration
The frontend automatically connects to the local server at `http://localhost:3001`.

## Troubleshooting

### Common Issues

1. **Binary not found**: Ensure the server binary is built and placed in `src-tauri/binaries/`
2. **Port conflicts**: Change the server port using environment variables
3. **CORS issues**: The server is configured to allow all origins for desktop use

### Debug Mode
To see server logs in development:
```bash
cd apps/desktop && npm run dev
```

## File Structure
```
apps/desktop/
├── src-tauri/
│   ├── src/
│   │   └── main.rs          # Tauri app entry point with sidecar setup
│   ├── binaries/            # Server binaries (auto-populated)
│   ├── Cargo.toml           # Rust dependencies
│   └── tauri.conf.json      # Tauri configuration
├── build-with-server.sh     # Build script
└── package.json            # Desktop app dependencies
```

## Platform Support

### Windows
- Binary: `prompt-jet-server-x86_64-pc-windows-msvc.exe`
- Build target: `node18-win-x64`

### macOS
- Binary: `prompt-jet-server-x86_64-apple-darwin`
- Build target: `node18-macos-x64`

### Linux
- Binary: `prompt-jet-server-x86_64-unknown-linux-gnu`
- Build target: `node18-linux-x64`