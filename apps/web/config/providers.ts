export interface Provider {
  provider: string;
  model: string;
  name: string;
  category: string;
}

export const AVAILABLE_PROVIDERS: Provider[] =
  [
    {
      provider: "openrouter",
      model: "z-ai/glm-4.5",
      name: "Z.AI GLM 4.5",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "z-ai/glm-4.5-air",
      name: "Z.AI GLM 4.5 Air",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "qwen/qwen3-235b-a22b-thinking-2507",
      name: "Qwen Qwen3-235B A22B Thinking",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "qwen/qwen3-coder",
      name: "Qwen Qwen3 Coder",
      category: "Specialized Code Models"
    },
    {
      provider: "openrouter",
      model: "qwen/qwen3-coder:free",
      name: "Qwen Qwen3 Coder (free)",
      category: "Specialized Code Models"
    },
    {
      provider: "openrouter",
      model: "deepseek/deepseek-r1",
      name: "DeepSeek R1",
      category: "Flagship Open-Source Models"
    },
    {
      provider: "openrouter",
      model: "deepseek/deepseek-r1-0528",
      name: "DeepSeek R1 0528",
      category: "Flagship Open-Source Models"
    },
    {
      provider: "openrouter",
      model: "deepseek/deepseek-r1-0528-qwen",
      name: "DeepSeek R1 0528 Qwen",
      category: "Flagship Open-Source Models"
    },
    {
      provider: "openrouter",
      model: "mistralai/magistral-medium-2506",
      name: "Mistral Magistral Medium",
      category: "Advanced Reasoning Models"
    },
    {
      provider: "openrouter",
      model: "mistralai/devstral-medium",
      name: "Mistral Devstral Medium",
      category: "Specialized Code Models"
    },
    {
      provider: "openrouter",
      model: "mistralai/devstral-small",
      name: "Mistral Devstral Small",
      category: "Specialized Code Models"
    },
    {
      provider: "openrouter",
      model: "mistralai/mistral-medium-3",
      name: "Mistral Mistral Medium 3",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "mistralai/codestral-2501",
      name: "Mistral Codestral",
      category: "Specialized Code Models"
    },
    {
      provider: "openrouter",
      model: "x-ai/grok-4",
      name: "xAI Grok 4",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "x-ai/grok-3",
      name: "xAI Grok 3",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "x-ai/grok-3-mini",
      name: "xAI Grok 3 Mini",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "x-ai/grok-3-mini-beta",
      name: "xAI Grok 3 Mini Beta",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "anthropic/claude-3.5-sonnet",
      name: "Claude 3.5 Sonnet",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "anthropic/claude-3.7-sonnet",
      name: "Anthropic Claude 3.7 Sonnet",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "anthropic/claude-opus-4",
      name: "Anthropic Claude Opus 4",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "openai/o3",
      name: "OpenAI o3",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "openai/o3-pro",
      name: "OpenAI o3 Pro",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "openai/gpt-4.1",
      name: "OpenAI GPT-4.1",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "openai/gpt-4.1-mini",
      name: "OpenAI GPT-4.1 Mini",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "openai/gpt-4.1-nano",
      name: "OpenAI GPT-4.1 Nano",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "google/gemini-2.5-pro",
      name: "Google Gemini 2.5 Pro",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "google/gemini-2.5-flash",
      name: "Google Gemini 2.5 Flash",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "google/gemini-2.5-flash-lite",
      name: "Google Gemini 2.5 Flash Lite",
      category: "Latest Premium Models (2025)"
    },
    {
      provider: "openrouter",
      model: "meta-llama/llama-4-maverick",
      name: "Meta Llama 4 Maverick",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "meta-llama/llama-4-scout",
      name: "Meta Llama 4 Scout",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "miniMax/miniMax-m1",
      name: "MiniMax MiniMax M1",
      category: "Advanced Long Context Models"
    },
    {
      provider: "openrouter",
      model: "agentica/deepcoder-14b",
      name: "Agentica DeepCoder 14B",
      category: "Specialized Code Models"
    },
    {
      provider: "openrouter",
      model: "amazon/nova-lite",
      name: "Amazon Nova Lite",
      category: "Specialized Multimodal Models"
    },
    {
      provider: "openrouter",
      model: "amazon/nova-pro",
      name: "Amazon Nova Pro",
      category: "Specialized Multimodal Models"
    },
    {
      provider: "openrouter",
      model: "amazon/nova-micro",
      name: "Amazon Nova Micro",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "cognitivecomputations/dolphin-r1",
      name: "Dolphin R1",
      category: "Advanced Reasoning Models"
    },
    {
      provider: "openrouter",
      model: "cognitivecomputations/dolphin-r1-thinker",
      name: "Dolphin R1 Thinker",
      category: "Advanced Reasoning Models"
    },
    {
      provider: "openrouter",
      model: "cognitivecomputations/dolphin-1.1",
      name: "Dolphin 1.1",
      category: "Advanced Reasoning Models"
    },
    {
      provider: "openrouter",
      model: "cognitivecomputations/dolphin-1.1-thinker",
      name: "Dolphin 1.1 Thinker",
      category: "Advanced Reasoning Models"
    },
    {
      provider: "openrouter",
      model: "sarvamai/sarvamai-m",
      name: "Sarvamai Sarvamai M",
      category: "Multilingual Specialized Models"
    },
    {
      provider: "openrouter",
      model: "sarvamai/sarvamai-m-thinker",
      name: "Sarvamai Sarvamai M Thinker",
      category: "Multilingual Specialized Models"
    },
    {
      provider: "openrouter",
      model: "tencent/hunyuan-a13b",
      name: "Tencent Hunyuan A13B",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "tencent/hunyuan-a13b-instruct",
      name: "Tencent Hunyuan A13B Instruct",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "thudm/glm-4.1",
      name: "THUDM GLM 4.1",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "thudm/glm-4.5",
      name: "THUDM GLM 4.5",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "thudm/glm-4.5-air",
      name: "THUDM GLM 4.5 Air",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "thudm/glm-z1",
      name: "THUDM GLM Z1",
      category: "Advanced Reasoning Models"
    },
    {
      provider: "openrouter",
      model: "thudm/glm-z1-thinking",
      name: "THUDM GLM Z1 Thinking",
      category: "Advanced Reasoning Models"
    },
    {
      provider: "openrouter",
      model: "thudm/glm-z1-nerf",
      name: "THUDM GLM Z1 NeRF",
      category: "Specialized Models"
    },
    {
      provider: "openrouter",
      model: "bai/ernie-4.5",
      name: "Bai Ernie 4.5",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "gpt-j/gpt-j-6b",
      name: "GPT-J 6B",
      category: "Open Source Models"
    },
    {
      provider: "openrouter",
      model: "gpt-neo/gpt-neo-1.3b",
      name: "GPT-Neo 1.3B",
      category: "Open Source Models"
    },
    {
      provider: "openrouter",
      model: "openai/codex",
      name: "OpenAI Codex",
      category: "Specialized Code Models"
    },
    {
      provider: "openrouter",
      model: "openai/codex-002",
      name: "OpenAI Codex 002",
      category: "Specialized Code Models"
    },
    {
      provider: "openrouter",
      model: "openai/davinci",
      name: "OpenAI Davinci",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "openai/davinci-codex",
      name: "OpenAI Davinci Codex",
      category: "Specialized Code Models"
    },
    {
      provider: "openrouter",
      model: "openai/multiple-choice",
      name: "OpenAI Multiple Choice",
      category: "Specialized Models"
    },
    {
      provider: "openrouter",
      model: "openai/text-davinci-003",
      name: "OpenAI Text Davinci 003",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "google/bert-large-cased",
      name: "Google BERT Large Cased",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "google/t5-large",
      name: "Google T5 Large",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "google/t5-3b",
      name: "Google T5 3B",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "facebook/bart-large",
      name: "Facebook BART Large",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "facebook/opt-2.7b",
      name: "Facebook OPT 2.7B",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "facebook/opt-6.7b",
      name: "Facebook OPT 6.7B",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "facebook/opt-13b",
      name: "Facebook OPT 13B",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "facebook/opt-30b",
      name: "Facebook OPT 30B",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "facebook/opt-66b",
      name: "Facebook OPT 66B",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "facebook/llama-2-13b-chat",
      name: "Facebook LLaMA 2 13B Chat",
      category: "Popular Foundation Models"
    },
    {
      provider: "openrouter",
      model: "facebook/llama-2-70b-chat",
      name: "Facebook LLaMA 2 70B Chat",
      category: "Popular Foundation Models"
    }
  ]
  ;