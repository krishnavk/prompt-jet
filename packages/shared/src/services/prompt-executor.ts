import { BatchProcessor, BatchRequest, BatchResult } from './batch-processor';
import { LLMClientFactory } from '../clients/client-factory';
import { ILLMClient } from '../interfaces/llm-client.interface';
import { LLMMessage, LLMRequest, LLMResponse } from '../types/llm.types';

export interface Provider {
  provider: string;
  model: string;
}

export interface ExecutePromptOptions {
  maxConcurrency?: number;
  timeoutMs?: number;
  retries?: number;
  openRouterApiKey?: string;
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
      maxConcurrency: 5,
      timeoutMs: 30000,
      retries: 2,
      ...options,
    };

    this.batchProcessor = new BatchProcessor({
      maxConcurrency: this.options.maxConcurrency,
      timeoutMs: this.options.timeoutMs,
      retries: this.options.retries,
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
          temperature: 0.7,
          max_tokens: 1000,
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
