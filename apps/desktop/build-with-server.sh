#!/bin/bash

# Build script for Prompt Jet Desktop with integrated server
set -e

echo "Building Prompt Jet Desktop with integrated server..."

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( cd "$SCRIPT_DIR/../.." && pwd )"

# Build the server binary
echo "Building server binary..."
cd "$ROOT_DIR/apps/server"
npm install
npm run build:binary

# Build the Tauri app
echo "Building Tauri application..."
cd "$ROOT_DIR/apps/desktop"
npm install
npm run build

echo "Build completed successfully!"
echo "The desktop application with integrated server is ready."