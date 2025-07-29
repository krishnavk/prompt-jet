# Prompt Jet 🚀

A full-stack LLM prompt execution platform (web only) that allows you to run prompts across multiple LLM providers concurrently and compare results.

## Features

- Execute prompts across multiple LLM providers simultaneously
- Support for OpenRouter API and local LM Studio
- Real-time streaming responses
- Execution metrics (response time, tokens, cost)
- Shareable prompt results
- Clean DDD architecture

**Note:** Desktop (Tauri) integration has been removed. This project is now web-only.

## Tech Stack

**Web (Frontend):**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + Shadcn/ui
- React hooks

## Project Structure

```
prompt-jet/
├── apps/
│   └── web/              # Next.js frontend
├── packages/
│   └── shared/           # Shared utilities and types
├── package.json          # Root workspace config
└── README.md
```

## Quick Start

1. Clone and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp apps/web/.env.example apps/web/.env.local
```

3. Start development server:
```bash
npm run dev
```

Web: http://localhost:3000

## Environment Variables

See `.env.example` file in apps/web directory.
