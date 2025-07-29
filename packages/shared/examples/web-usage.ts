// Example for web applications using the client
import { UnifiedLLMClient } from '../src';

// Configuration management for web apps
interface WebConfig {
  openrouter?: {
    apiKey: string;
  };
  lmstudio?: {
    baseUrl: string;
  };
}

class WebLLMService {
  private client: UnifiedLLMClient | null = null;

  initialize(config: WebConfig) {
    const providers: any = {};

    if (config.openrouter?.apiKey) {
      providers.openrouter = {
        apiKey: config.openrouter.apiKey,
      };
    }

    if (config.lmstudio?.baseUrl) {
      providers.lmstudio = {
        baseUrl: config.lmstudio.baseUrl,
      };
    }

    this.client = new UnifiedLLMClient({ providers });
  }

  async executePrompt(provider: string, model: string, prompt: string) {
    if (!this.client) {
      throw new Error('LLM service not initialized');
    }

    return this.client.executePrompt(provider, {
      model,
      messages: [{ role: 'user', content: prompt }],
    });
  }

  async getModels() {
    if (!this.client) {
      throw new Error('LLM service not initialized');
    }

    return this.client.getAvailableModels();
  }
}

// Example usage in a web app
export function createLLMService() {
  return new WebLLMService();
}

// Example configuration for different environments
export const getDefaultConfig = () => {
  if (typeof window !== 'undefined') {
    // Browser environment
    return {
      openrouter: {
        apiKey: localStorage.getItem('openrouter-api-key') || undefined,
      },
      lmstudio: {
        baseUrl: 'http://localhost:1234',
      },
    };
  } else {
    // Node.js environment
    return {
      openrouter: {
        apiKey: process.env.OPENROUTER_API_KEY,
      },
      lmstudio: {
        baseUrl: process.env.LM_STUDIO_URL || 'http://localhost:1234',
      },
    };
  }
};