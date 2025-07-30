# Prompt Jet 🚀

A full-stack LLM prompt execution platform (web only) that allows you to run prompts across multiple LLM providers concurrently and compare results.

## Features

- Execute prompts across multiple LLM providers simultaneously
- Support for OpenRouter API and local LM Studio
- Real-time streaming responses
- Execution metrics (response time, tokens, cost)
- Clean DDD architecture

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

---

## Prompt Metrics: Effectiveness & Efficiency

Provides real-time feedback on prompt quality and execution performance using two sets of metrics:

### Effectiveness Metrics
These help you write better prompts for LLMs:
- **Quality Score:** A number (0–100) based on prompt clarity, length, specificity, structure, and complexity.
- **Rating:** One of Excellent, Good, Fair, or Poor, based on the score.
- **How it's calculated:**
  - Optimal prompt length (10–200 words)
  - Presence of questions, context, and specific keywords
  - Use of lists, formatting, and structure
  - Balance of complexity (not too simple, not too verbose)
  - Each trait adds/subtracts from the score

### Efficiency Metrics
These help you optimize for speed and cost:
- **Average Response Time:** Time in ms for LLMs to respond (lower is better)
- **Tokens per Second:** How fast tokens are generated (higher is better)
- **Cost:** Average cost per prompt (if available)
- **How it's calculated:**
  - Uses the `executionTimeMs`, `tokensUsed`, and `cost` fields from execution results
  - Aggregates over recent runs for averages
