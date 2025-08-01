import { BaseLLMClient } from './base-client';
import { LLMRequest, LLMResponse, LLMStreamChunk, LLMProviderConfig, LLMModelInfo } from '../types/llm.types';
import { LLMConfigurationError } from '../errors/llm-errors';

export class OpenRouterClient extends BaseLLMClient {
  private readonly baseUrl = 'https://openrouter.ai/api/v1';

  constructor(config: LLMProviderConfig) {
    super(config);
    
    if (config.apiKey) {
      this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${config.apiKey}`;
    }
    
    // OpenRouter specific headers
    this.httpClient.defaults.headers.common['HTTP-Referer'] = 'https://prompt-jet.com';
    this.httpClient.defaults.headers.common['X-Title'] = 'Prompt Jet';
  }

  async executePrompt(request: LLMRequest): Promise<LLMResponse> {
    if (!this.config.apiKey) {
      throw new LLMConfigurationError('OpenRouter API key is required', 'openrouter');
    }

    // Debug log the request payload
    const requestPayload = {
      model: request.model,
      messages: this.transformMessages(request.messages),
      temperature: request.temperature,
      max_tokens: request.max_tokens,
      top_p: request.top_p,
      frequency_penalty: request.frequency_penalty,
      presence_penalty: request.presence_penalty,
      stream: false,
      tools: request.tools,
      tool_choice: request.tool_choice,
      response_format: request.response_format,
    };

    console.log('[OpenRouterClient] Sending request to OpenRouter:', {
      url: `${this.baseUrl}/chat/completions`,
      headers: {
        'Authorization': 'Bearer [REDACTED]',
        'HTTP-Referer': this.httpClient.defaults.headers.common['HTTP-Referer'],
        'X-Title': this.httpClient.defaults.headers.common['X-Title'],
        'Content-Type': 'application/json'
      },
      data: requestPayload
    });

    try {
      const response = await this.httpClient.post(`${this.baseUrl}/chat/completions`, requestPayload);
      console.log('[OpenRouterClient] Raw API response data:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error('[OpenRouterClient] Error executing prompt:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: {
            ...error.config?.headers,
            'Authorization': 'Bearer [REDACTED]'
          },
          data: error.config?.data
        }
      });
      throw error;
    }
  }

  /**
   * Streaming is currently disabled. Use executePrompt for non-streaming completions.
   *
   * Performance impact: Disabling streaming means users will only see the response after the entire completion is received,
   * increasing perceived latency for long completions. Simpler implementation and error handling, but less interactive UX.
   *
   * Implementation guarantees:
   * - All OpenRouter API calls are made with `stream: false`.
   * - The client waits for the entire response before returning any content to consumers.
   * - Downstream code (BatchProcessor, PromptExecutor, UI) concatenates all message contents from all choices in the response.
   * - The UI will always display the full completion as returned by the OpenRouter API.
   *
   * If partial completions are still observed in the UI:
   * - The root cause is almost certainly upstream (the OpenRouter API or the selected model/provider), not in this codebase.
   * - To debug, check the backend logs for the full raw API response (see logging in executePrompt).
   * - If the API response is already partial, consider changing models, prompt length, or contacting the provider.
   *
   * To re-enable streaming, restore the code below and ensure consumers use this method.
   */
  async *executePromptStream(request: LLMRequest): AsyncGenerator<LLMStreamChunk> {
    throw new Error('Streaming responses are currently disabled. Use executePrompt instead for full completion responses.');
  }

  async getAvailableModels(): Promise<LLMModelInfo[]> {
    if (!this.config.apiKey) {
      throw new LLMConfigurationError('OpenRouter API key is required', 'openrouter');
    }

    const response = await this.httpClient.get(`${this.baseUrl}/models`);
    
    return response.data.data.map((model: any) => ({
      id: model.id,
      name: model.name || model.id,
      provider: 'openrouter',
      context_length: model.context_length,
      pricing: model.pricing,
    }));
  }

  async validateConfig(): Promise<boolean> {
    return !!this.config.apiKey;
  }

  getProviderName(): string {
    return 'openrouter';
  }

  protected transformMessages(messages: any[]): any[] {
    return messages.map(msg => {
      // Ensure the message has the required fields
      if (!msg.role || !msg.content) {
        console.warn('Invalid message format:', msg);
      }
      
      // Create a clean message object with only the fields that OpenRouter expects
      const transformed: any = {
        role: msg.role,
        content: msg.content
      };
      
      // Only include the name field if it exists and is a string
      if (msg.name && typeof msg.name === 'string') {
        transformed.name = msg.name;
      }
      
      // Include tool_calls if they exist and are in the expected format
      if (Array.isArray(msg.tool_calls) && msg.tool_calls.length > 0) {
        transformed.tool_calls = msg.tool_calls;
      }
      
      return transformed;
    });
  }
}