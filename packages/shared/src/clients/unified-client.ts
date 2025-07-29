import { ILLMClient } from '../interfaces/llm-client.interface';
import { LLMRequest, LLMResponse, LLMStreamChunk, LLMProviderConfig, LLMExecutionResult } from '../types/llm.types';
import { LLMClientFactory } from './client-factory';

export interface UnifiedClientConfig {
  providers: Record<string, LLMProviderConfig>;
  defaultProvider?: string;
}

export class UnifiedLLMClient {
  private clients: Map<string, ILLMClient> = new Map();
  private config: UnifiedClientConfig;

  constructor(config: UnifiedClientConfig) {
    this.config = config;
    this.initializeClients();
  }

  private initializeClients(): void {
    for (const [providerName, providerConfig] of Object.entries(this.config.providers)) {
      try {
        const client = LLMClientFactory.createClient(providerName, providerConfig);
        this.clients.set(providerName, client);
      } catch (error) {
        console.warn(`Failed to initialize ${providerName} client:`, error);
      }
    }
  }

  async executePrompt(
    provider: string,
    request: LLMRequest
  ): Promise<LLMExecutionResult> {
    const client = this.clients.get(provider);
    if (!client) {
      throw new Error(`Provider ${provider} not configured`);
    }

    const startTime = Date.now();
    const response = await client.executePrompt(request);
    const executionTimeMs = Date.now() - startTime;

    return {
      content: response.choices[0]?.message?.content || '',
      tokensUsed: response.usage?.total_tokens || 0,
      executionTimeMs,
      model: response.model,
      provider,
      cost: this.calculateCost(provider, response.model, response.usage?.total_tokens || 0),
    };
  }

  async *executePromptStream(
    provider: string,
    request: LLMRequest
  ): AsyncGenerator<LLMStreamChunk> {
    const client = this.clients.get(provider);
    if (!client) {
      throw new Error(`Provider ${provider} not configured`);
    }

    yield* client.executePromptStream(request);
  }

  async getAvailableModels(provider?: string): Promise<Record<string, any[]>> {
    if (provider) {
      const client = this.clients.get(provider);
      if (!client) return {};
      
      const models = await client.getAvailableModels();
      return { [provider]: models };
    }

    const allModels: Record<string, any[]> = {};
    
    for (const [providerName, client] of this.clients) {
      try {
        const models = await client.getAvailableModels();
        allModels[providerName] = models;
      } catch (error) {
        console.warn(`Failed to get models for ${providerName}:`, error);
        allModels[providerName] = [];
      }
    }

    return allModels;
  }

  async validateConfigs(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const [providerName, client] of this.clients) {
      try {
        results[providerName] = await client.validateConfig();
      } catch (error) {
        results[providerName] = false;
      }
    }

    return results;
  }

  getConfiguredProviders(): string[] {
    return Array.from(this.clients.keys());
  }

  private calculateCost(provider: string, model: string, tokens: number): number {
    // Simplified cost calculation - can be extended with actual pricing
    if (provider === 'openrouter') {
      // Rough estimate: $0.001 per 1K tokens
      return (tokens / 1000) * 0.001;
    }
    return 0; // Local providers are free
  }
}