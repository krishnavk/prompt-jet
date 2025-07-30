import { BatchProcessor, BatchRequest, BatchResult } from './batch-processor';

export interface Provider {
  provider: string;
  model: string;
}

export interface ExecutePromptOptions {
  // Prompt-specific settings
  temperature?: number;
  topP?: number;
  topK?: number;
  maxTokens?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  openRouterApiKey?: string;
  maxConcurrency?: number;
  timeoutMs?: number;
  retries?: number;
}

export interface ExecutionResult {
  id: string;
  provider: string;
  model: string;
  response: string;
  tokensUsed: number;
  executionTimeMs: number;
  cost?: number;
}

export class PromptExecutor {
  private batchProcessor: BatchProcessor;
  private options: ExecutePromptOptions;

  constructor(options: ExecutePromptOptions = {}) {
    this.options = {
      temperature: 0.7,
      topP: 1.0,
      topK: 50,
      maxTokens: 1000,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      ...options,
    };

    // Extract parallel execution settings from options or use defaults
    const maxConcurrency = options.maxConcurrency ?? 5;
    const timeoutMs = options.timeoutMs ?? 30000;
    const retries = options.retries ?? 2;

    // Use parallel execution settings
    this.batchProcessor = new BatchProcessor({
      maxConcurrency,
      timeoutMs,
      retries,
    });
  }

  async execute(
    prompt: string,
    providers: Provider[],
    onProgress?: (completed: number, total: number) => void,
    onResult?: (result: ExecutionResult) => void
  ): Promise<ExecutionResult[]> {
    console.log('[PromptExecutor] Starting execution with providers:', JSON.stringify(providers, null, 2));

    if (!prompt.trim()) {
      console.warn('[PromptExecutor] Empty prompt provided');
      return [];
    }

    if (providers.length === 0) {
      console.warn('[PromptExecutor] No providers specified');
      return [];
    }

    const requests = this.prepareRequests(prompt, providers);
    const results: ExecutionResult[] = [];

    try {
      const batchResults = await this.batchProcessor.executeBatch(requests, {
        onProgress,
        onResult: (result) => {
          const executionResult = this.mapBatchResultToExecutionResult(result);
          onResult?.(executionResult);
          results.push(executionResult);
        },
      });

      return batchResults.map((result) => this.mapBatchResultToExecutionResult(result));
    } catch (error) {
      console.error('Error executing prompts:', error);
      throw error;
    }
  }

  private prepareRequests(prompt: string, providers: Provider[]): BatchRequest[] {
    console.log('[PromptExecutor] Preparing requests for providers:', JSON.stringify(providers, null, 2));

    return providers.map((provider, index) => {
      console.log(`[PromptExecutor] Processing provider ${index + 1}/${providers.length}:`, JSON.stringify(provider));

      if (!provider || !provider.provider) {
        console.error('[PromptExecutor] Invalid provider configuration:', provider);
        throw new Error(`Invalid provider configuration at index ${index}: ${JSON.stringify(provider)}`);
      }

      const requestId = `${provider.provider}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

      // Create the base batch request with required fields
      const batchRequest: BatchRequest = {
        id: requestId,
        prompt: prompt,
        apiConfig: {
          model: provider.model,
          temperature: this.options.temperature,
          top_p: this.options.topP,
          top_k: this.options.topK,
          max_tokens: this.options.maxTokens,
          frequency_penalty: this.options.frequencyPenalty,
          presence_penalty: this.options.presencePenalty,
          stop: this.options.stopSequences,
          // Include the OpenRouter API key in the config
          apiKey: this.options.openRouterApiKey,
          // Set the base URL for OpenRouter
          baseUrl: 'https://openrouter.ai/api/v1'
        },
        metadata: {
          provider: provider.provider,
          model: provider.model,
        },
      };

      return batchRequest;
    });
  }

  private mapBatchResultToExecutionResult(result: BatchResult): ExecutionResult {
    return {
      id: result.id,
      provider: result.metadata?.provider || 'unknown',
      model: result.metadata?.model || 'unknown',
      response: result.response?.content || '',
      tokensUsed: result.response?.usage?.total_tokens || 0,
      executionTimeMs: result.executionTimeMs,
    };
  }
}

export default PromptExecutor;
