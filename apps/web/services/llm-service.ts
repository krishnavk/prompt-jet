import { LLMClientFactory, LLMProviderConfig, ILLMClient, LLMMessage } from '@prompt-jet/shared';

export class LLMService {
  private client!: ILLMClient;
  private config: {
    provider: string;
    apiKey?: string;
    baseUrl?: string;
    model?: string;
  };

  constructor(config: {
    provider: string;
    apiKey?: string;
    baseUrl?: string;
    model?: string;
  }) {
    this.config = config;
    this.initializeClient();
  }

  private initializeClient() {
    const llmConfig: LLMProviderConfig = {
      apiKey: this.config.apiKey,
      baseUrl: this.config.baseUrl,
    };

    this.client = LLMClientFactory.createClient(this.config.provider, llmConfig);
  }

  private getDefaultModel(): string {
    switch (this.config.provider) {
      case 'openrouter':
        return 'anthropic/claude-3.5-sonnet';
      case 'lmstudio':
        return 'local-model';
      default:
        return 'unknown';
    }
  }

  async executePrompt(prompt: string, options?: {
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
  }) {
    if (!this.client) {
      throw new Error('LLM client not initialized');
    }

    try {
      const messages: LLMMessage[] = [];
      
      if (options?.systemPrompt) {
        messages.push({
          role: 'system',
          content: options.systemPrompt,
        });
      }
      
      messages.push({
        role: 'user',
        content: prompt,
      });

      const response = await this.client.executePrompt({
        model: this.config.model || this.getDefaultModel(),
        messages,
        temperature: options?.temperature,
        max_tokens: options?.maxTokens,
      });

      return {
        content: response.choices[0]?.message?.content || '',
        usage: response.usage || {},
        model: response.model,
      };
    } catch (error) {
      console.error('Error executing prompt:', error);
      throw new Error(`Failed to execute prompt: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async executePromptStream(prompt: string, options?: {
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
    onChunk?: (chunk: string) => void;
  }) {
    if (!this.client) {
      throw new Error('LLM client not initialized');
    }

    try {
      const messages: LLMMessage[] = [];
      
      if (options?.systemPrompt) {
        messages.push({
          role: 'system',
          content: options.systemPrompt,
        });
      }
      
      messages.push({
        role: 'user',
        content: prompt,
      });

      const stream = this.client.executePromptStream({
        model: this.config.model || this.getDefaultModel(),
        messages,
        temperature: options?.temperature,
        max_tokens: options?.maxTokens,
      });

      let fullContent = '';
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullContent += content;
          if (options?.onChunk) {
            options.onChunk(content);
          }
        }
      }

      return {
        content: fullContent,
        model: this.config.model || this.getDefaultModel(),
      };
    } catch (error) {
      console.error('Error executing prompt stream:', error);
      throw new Error(`Failed to execute prompt stream: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  updateConfig(newConfig: {
    provider: string;
    apiKey?: string;
    baseUrl?: string;
    model?: string;
  }) {
    Object.assign(this.config, newConfig);
    this.initializeClient();
  }
}