# Prompt Jet 🚀

A full-stack LLM prompt execution platform that allows you to run prompts across multiple LLM providers concurrently and compare results.

## Features

- Execute prompts across multiple LLM providers simultaneously
- Support for OpenRouter API and local LM Studio
- Real-time streaming responses
- Execution metrics (response time, tokens, cost)
- Shareable prompt results
- Clean DDD architecture

## Tech Stack

**Console (Frontend):**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + Shadcn/ui
- React hooks

**Server (Backend):**
- NestJS with DDD architecture
- PostgreSQL + Prisma
- OpenAI/OpenRouter integration
- WebSocket streaming

## Project Structure

```
prompt-jet/
├── apps/
│   ├── console/          # Next.js frontend
│   └── server/           # NestJS backend
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
cp apps/console/.env.example apps/console/.env.local
cp apps/server/.env.example apps/server/.env
```

3. Start development servers:
```bash
npm run dev
```

Console: http://localhost:3000
Server: http://localhost:3001

## Environment Variables

See `.env.example` files in apps/console and apps/server directories.
