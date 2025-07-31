# Prompt Jet Server (NestJS)

This is a backend relay server for Prompt Jet, built with NestJS. It is responsible for securely connecting to LLM APIs (e.g., OpenRouter) and streaming responses to the frontend in a browser-compatible way (e.g., using Server-Sent Events).

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server (dev mode):
   ```bash
   npm run start:dev
   ```
3. The server will run on http://localhost:3001 by default.

## Features
- Streaming relay endpoint for LLM APIs (coming soon)
- CORS enabled by default

## Next Steps
- Implement `/stream` endpoint for LLM streaming
- Integrate with frontend for real-time prompt streaming
