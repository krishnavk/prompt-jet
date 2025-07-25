export interface Provider {
  provider: string;
  model: string;
  name: string;
}

export const AVAILABLE_PROVIDERS: Provider[] = [
  { provider: "openrouter", model: "openai/gpt-4.1", name: "GPT-4.1" },
  { provider: "openrouter", model: "openai/gpt-4o", name: "GPT-4o" },
  { provider: "openrouter", model: "openai/gpt-4-turbo", name: "GPT-4 Turbo" },
  {
    provider: "openrouter",
    model: "google/gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
  },
  {
    provider: "openrouter",
    model: "google/gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
  },
  {
    provider: "openrouter",
    model: "anthropic/claude-3-opus",
    name: "Claude 3 Opus",
  },
  {
    provider: "openrouter",
    model: "anthropic/claude-3-sonnet",
    name: "Claude 3 Sonnet",
  },
  {
    provider: "openrouter",
    model: "meta-llama/llama-3-70b-instruct",
    name: "Llama 3 70B Instruct",
  },
  {
    provider: "openrouter",
    model: "meta-llama/llama-3-8b-instruct",
    name: "Llama 3 8B Instruct",
  },
  {
    provider: "openrouter",
    model: "mistralai/mistral-large",
    name: "Mistral Large",
  },
  {
    provider: "openrouter",
    model: "mistralai/mistral-medium",
    name: "Mistral Medium",
  },
  {
    provider: "lmstudio",
    model: "llama-2-7b-chat",
    name: "Llama 2 7B (Local)",
  },
];