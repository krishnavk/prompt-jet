import { LLMRequest, LLMResponse, LLMProviderConfig, LLMExecutionResult } from '../types/llm.types';
import { OpenRouterClient } from '../clients/openrouter-client';
import { ILLMClient } from '../interfaces/llm-client.interface';

export class LLMService {
  private client: ILLMClient;

  constructor(config: any) {
    if (config.provider === 'openrouter') {
      this.client = new OpenRouterClient({
        apiKey: config.apiKey,
      });
    } else {
      throw new Error(`Unsupported provider: ${config.provider}`);
    }
  }

  async executePrompt(prompt: string): Promise<LLMResponse> {
    const request: LLMRequest = {
      model: 'default',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    };

    return this.client.executePrompt(request);
  }

  getClient(): ILLMClient {
    return this.client;
  }

  async executeOpenRouter(config: LLMProviderConfig, model: string, prompt: string): Promise<LLMExecutionResult> {
    const request: LLMRequest = {
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    };

    return this.executeRequest('openrouter', request, config);
  }

  async executeOpenAI(config: LLMProviderConfig, model: string, prompt: string): Promise<LLMExecutionResult> {
    const request: LLMRequest = {
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    };

    return this.executeRequest('openai', request, config);
  }

  async executeAnthropic(config: LLMProviderConfig, model: string, prompt: string): Promise<LLMExecutionResult> {
    const request: LLMRequest = {
      model: model || 'claude-3-sonnet-20240229',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    };

    return this.executeRequest('anthropic', request, config);
  }

  private async executeRequest(
    provider: string,
    request: LLMRequest,
    config: LLMProviderConfig
  ): Promise<LLMExecutionResult> {
    const startTime = Date.now();
    
    try {
      let client: ILLMClient;
      
      switch (provider) {
        case 'openrouter':
          client = new OpenRouterClient({
            apiKey: config.apiKey,
          });
          break;
        case 'openai':
          // For now, use OpenRouter client with OpenAI model
          client = new OpenRouterClient({
            apiKey: config.apiKey,
          });
          break;
        case 'anthropic':
          // For now, use OpenRouter client with Anthropic model
          client = new OpenRouterClient({
            apiKey: config.apiKey,
          });
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      const response = await client.executePrompt(request);
      const executionTimeMs = Date.now() - startTime;
      
      const content = response.choices[0]?.message?.content || '';
      const tokensUsed = response.usage?.total_tokens || 0;
      
      return {
        content,
        tokensUsed,
        executionTimeMs,
        model: response.model,
        provider,
      };
    } catch (error) {
      const executionTimeMs = Date.now() - startTime;
      throw new Error(`LLM execution failed for ${provider}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}