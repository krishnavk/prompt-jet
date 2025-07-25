export interface Provider {
  provider: string;
  model: string;
  name: string;
  category: string;
}

export const AVAILABLE_PROVIDERS: Provider[] =
  [
    // Latest Premium Models (2025)
    { provider: "openrouter", model: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", category: "Latest Premium Models (2025)" },
    { provider: "openrouter", model: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", category: "Latest Premium Models (2025)" },
    { provider: "openrouter", model: "google/gemini-2.0-flash", name: "Gemini 2.0 Flash", category: "Latest Premium Models (2025)" },
    { provider: "openrouter", model: "deepseek/deepseek-v3", name: "DeepSeek V3", category: "Latest Premium Models (2025)" },
    { provider: "openrouter", model: "openai/gpt-4o", name: "GPT-4o", category: "Latest Premium Models (2025)" },
    { provider: "openrouter", model: "anthropic/claude-3-opus", name: "Claude 3 Opus", category: "Latest Premium Models (2025)" },
    { provider: "openrouter", model: "x-ai/grok-3", name: "Grok 3", category: "Latest Premium Models (2025)" },
    { provider: "openrouter", model: "anthropic/claude-3.5-haiku", name: "Claude 3.5 Haiku", category: "Latest Premium Models (2025)" },
    { provider: "openrouter", model: "mistralai/mistral-large-2", name: "Mistral Large 2", category: "Latest Premium Models (2025)" },
    { provider: "openrouter", model: "01-ai/yi-large", name: "Yi Large", category: "Latest Premium Models (2025)" },

    // Coding Specialists
    { provider: "openrouter", model: "deepseek/deepseek-coder-v2", name: "DeepSeek Coder V2", category: "Coding Specialists" },
    { provider: "openrouter", model: "mistralai/codestral", name: "Codestral", category: "Coding Specialists" },
    { provider: "openrouter", model: "qwen/qwen-3-coder", name: "Qwen 3 Coder", category: "Coding Specialists" },
    { provider: "openrouter", model: "codellama/codellama-34b-instruct", name: "CodeLlama 34B Instruct", category: "Coding Specialists" },
    { provider: "openrouter", model: "codellama/codellama-13b-instruct", name: "CodeLlama 13B Instruct", category: "Coding Specialists" },
    { provider: "openrouter", model: "codellama/codellama-7b-instruct", name: "CodeLlama 7B Instruct", category: "Coding Specialists" },
    { provider: "openrouter", model: "phind/phind-codellama-34b", name: "Phind CodeLlama 34B", category: "Coding Specialists" },
    { provider: "openrouter", model: "wizardlm/wizardcoder-34b", name: "WizardCoder 34B", category: "Coding Specialists" },
    { provider: "openrouter", model: "mistralai/codestral-mamba", name: "Codestral Mamba", category: "Coding Specialists" },

    // Vision & Multimodal
    { provider: "openrouter", model: "openai/gpt-4-vision-preview", name: "GPT-4 Vision Preview", category: "Vision & Multimodal" },
    { provider: "openrouter", model: "google/gemini-pro-vision", name: "Gemini Pro Vision", category: "Vision & Multimodal" },
    { provider: "openrouter", model: "anthropic/claude-3-5-sonnet:beta", name: "Claude 3.5 Sonnet Beta (Vision)", category: "Vision & Multimodal" },
    { provider: "openrouter", model: "meta-llama/llama-3.2-90b-vision-instruct", name: "Llama 3.2 90B Vision Instruct", category: "Vision & Multimodal" },
    { provider: "openrouter", model: "meta-llama/llama-3.2-11b-vision-instruct", name: "Llama 3.2 11B Vision Instruct", category: "Vision & Multimodal" },
    { provider: "openrouter", model: "x-ai/grok-vision-beta", name: "Grok Vision Beta", category: "Vision & Multimodal" },
    { provider: "openrouter", model: "mistralai/pixtral-12b", name: "Pixtral 12B", category: "Vision & Multimodal" },
    { provider: "openrouter", model: "fireworks/firellava-13b", name: "Firellava 13B", category: "Vision & Multimodal" },

    // Free Tier Access
    { provider: "openrouter", model: "google/gemini-1.5-flash", name: "Gemini 1.5 Flash", category: "Free Tier Access" },
    { provider: "openrouter", model: "google/gemini-1.5-flash-8b", name: "Gemini 1.5 Flash 8B", category: "Free Tier Access" },
    { provider: "openrouter", model: "meta-llama/llama-3.1-8b-instruct", name: "Llama 3.1 8B Instruct", category: "Free Tier Access" },
    { provider: "openrouter", model: "meta-llama/llama-3-8b-instruct", name: "Llama 3 8B Instruct", category: "Free Tier Access" },
    { provider: "openrouter", model: "google/gemma-2-9b", name: "Gemma 2 9B", category: "Free Tier Access" },
    { provider: "openrouter", model: "google/gemma-2-2b", name: "Gemma 2 2B", category: "Free Tier Access" },
    { provider: "openrouter", model: "meta-llama/llama-3.2-3b-instruct", name: "Llama 3.2 3B Instruct", category: "Free Tier Access" },
    { provider: "openrouter", model: "meta-llama/llama-3.2-1b-instruct", name: "Llama 3.2 1B Instruct", category: "Free Tier Access" },
    { provider: "openrouter", model: "openchat/openchat-7b", name: "OpenChat 7B", category: "Free Tier Access" },
    { provider: "openrouter", model: "nous-research/nous-capybara-7b", name: "Nous Capybara 7B", category: "Free Tier Access" },

    // Enterprise Solutions
    { provider: "openrouter", model: "meta-llama/llama-3.1-405b-instruct", name: "Llama 3.1 405B Instruct", category: "Enterprise Solutions" },
    { provider: "openrouter", model: "cohere/command-r-plus", name: "Command R Plus", category: "Enterprise Solutions" },
    { provider: "openrouter", model: "cohere/command-r", name: "Command R", category: "Enterprise Solutions" },
    { provider: "openrouter", model: "databricks/dbrx-instruct", name: "DBRX Instruct", category: "Enterprise Solutions" },
    { provider: "openrouter", model: "snowflake/snowflake-arctic-instruct", name: "Snowflake Arctic Instruct", category: "Enterprise Solutions" },
    { provider: "openrouter", model: "microsoft/wizardlm-2-8x22b", name: "WizardLM 2 8x22B", category: "Enterprise Solutions" },

    // Reasoning Specialists
    { provider: "openrouter", model: "deepseek/deepseek-r1", name: "DeepSeek R1", category: "Reasoning Specialists" },
    { provider: "openrouter", model: "openai/o1-preview", name: "O1 Preview", category: "Reasoning Specialists" },
    { provider: "openrouter", model: "openai/o1-mini", name: "O1 Mini", category: "Reasoning Specialists" },
    { provider: "openrouter", model: "tngtech/deepseek-r1t-chimera", name: "DeepSeek R1T Chimera", category: "Reasoning Specialists" },

    // Standard Workhorses
    { provider: "openrouter", model: "openai/gpt-4-turbo", name: "GPT-4 Turbo", category: "Standard Workhorses" },
    { provider: "openrouter", model: "openai/gpt-4", name: "GPT-4", category: "Standard Workhorses" },
    { provider: "openrouter", model: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo", category: "Standard Workhorses" },
    { provider: "openrouter", model: "google/gemini-1.5-pro", name: "Gemini 1.5 Pro", category: "Standard Workhorses" },
    { provider: "openrouter", model: "anthropic/claude-3-sonnet", name: "Claude 3 Sonnet", category: "Standard Workhorses" },
    { provider: "openrouter", model: "anthropic/claude-3-haiku", name: "Claude 3 Haiku", category: "Standard Workhorses" },
    { provider: "openrouter", model: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B Instruct", category: "Standard Workhorses" },
    { provider: "openrouter", model: "meta-llama/llama-3-70b-instruct", name: "Llama 3 70B Instruct", category: "Standard Workhorses" },

    // Budget-Friendly Options
    { provider: "openrouter", model: "openai/gpt-4o-mini", name: "GPT-4o Mini", category: "Budget-Friendly Options" },
    { provider: "openrouter", model: "mistralai/mistral-small", name: "Mistral Small", category: "Budget-Friendly Options" },
    { provider: "openrouter", model: "cohere/command-light", name: "Command Light", category: "Budget-Friendly Options" },
    { provider: "openrouter", model: "google/gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", category: "Budget-Friendly Options" },
    { provider: "openrouter", model: "x-ai/grok-3-mini", name: "Grok 3 Mini", category: "Budget-Friendly Options" },

    // Chinese Language Models
    { provider: "openrouter", model: "qwen/qwen-2.5-72b-instruct", name: "Qwen 2.5 72B Instruct", category: "Chinese Language Models" },
    { provider: "openrouter", model: "qwen/qwen-2.5-32b-instruct", name: "Qwen 2.5 32B Instruct", category: "Chinese Language Models" },
    { provider: "openrouter", model: "qwen/qwen-2.5-14b-instruct", name: "Qwen 2.5 14B Instruct", category: "Chinese Language Models" },
    { provider: "openrouter", model: "qwen/qwen-2.5-7b-instruct", name: "Qwen 2.5 7B Instruct", category: "Chinese Language Models" },
    { provider: "openrouter", model: "01-ai/yi-1.5-34b-chat", name: "Yi 1.5 34B Chat", category: "Chinese Language Models" },
    { provider: "openrouter", model: "01-ai/yi-1.5-9b-chat", name: "Yi 1.5 9B Chat", category: "Chinese Language Models" },
    { provider: "openrouter", model: "thudm/glm-4-32b", name: "GLM 4 32B", category: "Chinese Language Models" },
    { provider: "openrouter", model: "thudm/glm-z1-32b", name: "GLM Z1 32B", category: "Chinese Language Models" },
    { provider: "openrouter", model: "baichuan/baichuan2-13b-chat", name: "Baichuan2 13B Chat", category: "Chinese Language Models" },

    // Experimental & Research
    { provider: "openrouter", model: "x-ai/grok-3-beta", name: "Grok 3 Beta", category: "Experimental & Research" },
    { provider: "openrouter", model: "x-ai/grok-3-mini-beta", name: "Grok 3 Mini Beta", category: "Experimental & Research" },
    { provider: "openrouter", model: "recursal/rwkv-5-world-3b", name: "RWKV 5 World 3B", category: "Experimental & Research" },
    { provider: "openrouter", model: "recursal/eagle-7b", name: "Eagle 7B", category: "Experimental & Research" },
    { provider: "openrouter", model: "allenai/olmo-7b-instruct", name: "OLMo 7B Instruct", category: "Experimental & Research" },
    { provider: "openrouter", model: "huggingface/zephyr-7b-beta", name: "Zephyr 7B Beta", category: "Experimental & Research" },

    // Community Fine-Tuned
    { provider: "openrouter", model: "nous-research/nous-hermes-2-mixtral-8x7b-dpo", name: "Nous Hermes 2 Mixtral 8x7B DPO", category: "Community Fine-Tuned" },
    { provider: "openrouter", model: "teknium/openhermes-2.5-mistral-7b", name: "OpenHermes 2.5 Mistral 7B", category: "Community Fine-Tuned" },
    { provider: "openrouter", model: "nousresearch/nous-hermes-llama2-13b", name: "Nous Hermes Llama2 13B", category: "Community Fine-Tuned" },
    { provider: "openrouter", model: "gryphe/mythomist-7b", name: "Mythomist 7B", category: "Community Fine-Tuned" },
    { provider: "openrouter", model: "openchat/openchat-8b", name: "OpenChat 8B", category: "Community Fine-Tuned" },
    { provider: "openrouter", model: "intel/neural-chat-7b", name: "Neural Chat 7B", category: "Community Fine-Tuned" },

    // Function Calling & Tools
    { provider: "openrouter", model: "fireworks/firefunction-v2", name: "Firefunction V2", category: "Function Calling & Tools" },
    { provider: "openrouter", model: "fireworks/firefunction-v1", name: "Firefunction V1", category: "Function Calling & Tools" },
    { provider: "openrouter", model: "bytedance/ui-tars-7b", name: "UI-TARS 7B", category: "Function Calling & Tools" },

    // Web-Connected Models
    { provider: "openrouter", model: "perplexity/llama-3-sonar-large-32k-chat", name: "Llama 3 Sonar Large 32K Chat", category: "Web-Connected Models" },
    { provider: "openrouter", model: "perplexity/llama-3-sonar-small-32k-chat", name: "Llama 3 Sonar Small 32K Chat", category: "Web-Connected Models" },

    // Legacy Models
    { provider: "openrouter", model: "anthropic/claude-2.1", name: "Claude 2.1", category: "Legacy Models" },
    { provider: "openrouter", model: "anthropic/claude-2", name: "Claude 2", category: "Legacy Models" },
    { provider: "openrouter", model: "anthropic/claude-instant-1.2", name: "Claude Instant 1.2", category: "Legacy Models" },
    { provider: "openrouter", model: "openai/gpt-3.5-turbo-instruct", name: "GPT-3.5 Turbo Instruct", category: "Legacy Models" },
    { provider: "openrouter", model: "openai/text-davinci-003", name: "Text Davinci 003", category: "Legacy Models" },

    // Specialized Use Cases
    { provider: "openrouter", model: "openrouter/auto", name: "Auto (Router)", category: "Specialized Use Cases" },
    { provider: "openrouter", model: "microsoft/wizardlm-2-7b", name: "WizardLM 2 7B", category: "Specialized Use Cases" },
    { provider: "openrouter", model: "jondurbin/airoboros-l2-70b", name: "Airoboros L2 70B", category: "Specialized Use Cases" }
  ]
  ;