#!/bin/bash

# Test script to verify the desktop app with integrated server works
set -e

echo "Testing Prompt Jet Desktop with integrated server..."

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( cd "$SCRIPT_DIR/../.." && pwd )"

echo "1. Checking server binary..."
if [ -f "$ROOT_DIR/apps/desktop/src-tauri/binaries/prompt-jet-server-x86_64-apple-darwin" ]; then
    echo "✓ Server binary found"
    ls -la "$ROOT_DIR/apps/desktop/src-tauri/binaries/prompt-jet-server-x86_64-apple-darwin"
else
    echo "✗ Server binary not found"
    exit 1
fi

echo "2. Checking Tauri configuration..."
if [ -f "$ROOT_DIR/apps/desktop/src-tauri/tauri.conf.json" ]; then
    echo "✓ Tauri configuration found"
else
    echo "✗ Tauri configuration not found"
    exit 1
fi

echo "3. Checking Rust dependencies..."
cd "$ROOT_DIR/apps/desktop/src-tauri"
cargo check

echo "4. All checks passed! The desktop app is ready to run."
echo ""
echo "To run in development mode:"
echo "  cd apps/desktop && npm run dev"
echo ""
echo "To build for production:"
echo "  cd apps/desktop && npm run build"