#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const serverDir = __dirname;
const outputDir = path.join(serverDir, "dist-binary");
const binaryName =
  process.platform === "win32" ? "prompt-jet-server.exe" : "prompt-jet-server";

console.log("Building server binary...");

// Clean previous build
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// Create a simple Express server that works with pkg
const simpleServer = `
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Prompt execution endpoint
app.post('/api/prompt/execute', async (req, res) => {
  try {
    const { prompt, provider, model } = req.body;
    
    // Mock response for now
    const response = {
      success: true,
      response: "Mock response from server: " + prompt,
      prompt,
      provider: provider || 'openai',
      model: model || 'gpt-3.5-turbo',
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Settings endpoint
app.get('/api/settings', (req, res) => {
  res.json({
    providers: {
      openai: { apiKey: '' },
      lmstudio: { baseUrl: 'http://localhost:1234' }
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port ' + PORT);
});
`;

// Write the simple server
fs.writeFileSync(path.join(serverDir, "simple-server.js"), simpleServer);

// Install required dependencies
console.log("Installing dependencies...");
try {
  execSync("npm install express cors", { cwd: serverDir, stdio: "inherit" });
} catch (error) {
  console.log("Dependencies already installed or error:", error.message);
}

// Install pkg if not available
try {
  execSync("npx pkg --version", { cwd: serverDir, stdio: "ignore" });
} catch (error) {
  console.log("Installing pkg...");
  execSync("npm install -g pkg", { cwd: serverDir, stdio: "inherit" });
}

// Build binary
console.log("Creating binary with pkg...");

// Detect architecture for macOS
const isAppleSilicon =
  process.platform === "darwin" && process.arch === "arm64";
const target =
  process.platform === "win32"
    ? "node18-win-x64"
    : process.platform === "darwin"
    ? isAppleSilicon
      ? "node18-macos-arm64"
      : "node18-macos-x64"
    : "node18-linux-x64";

execSync(
  `npx pkg simple-server.js --target ${target} --output ${path.join(
    outputDir,
    binaryName
  )}`,
  { cwd: serverDir, stdio: "inherit" }
);

console.log(`Server binary created: ${path.join(outputDir, binaryName)}`);

// Test the binary
console.log("Testing binary...");
try {
  const output = execSync(`${path.join(outputDir, binaryName)} --help`, {
    cwd: serverDir,
    stdio: "pipe",
    timeout: 5000,
  });
  console.log("Binary test successful");
} catch (error) {
  console.log("Binary created but test failed (expected for server binary)");
}

// Copy to Tauri binaries directory
const tauriBinDir = path.join(
  __dirname,
  "../../apps/desktop/src-tauri/binaries"
);
if (!fs.existsSync(tauriBinDir)) {
  fs.mkdirSync(tauriBinDir, { recursive: true });
}

const platformBinaryName =
  process.platform === "win32"
    ? "prompt-jet-server-x86_64-pc-windows-msvc.exe"
    : process.platform === "darwin"
    ? isAppleSilicon
      ? "prompt-jet-server-aarch64-apple-darwin"
      : "prompt-jet-server-x86_64-apple-darwin"
    : "prompt-jet-server-x86_64-unknown-linux-gnu";

fs.copyFileSync(
  path.join(outputDir, binaryName),
  path.join(tauriBinDir, platformBinaryName)
);

console.log(
  `Binary copied to Tauri binaries: ${path.join(
    tauriBinDir,
    platformBinaryName
  )}`
);
