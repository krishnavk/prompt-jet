import { ParallelExecutor, ParallelExecutionTask, ParallelExecutionResult } from './parallel-executor';
import { LLMClientFactory } from '../clients/client-factory';
import { LLMRequest } from '../types/llm.types';

export interface BatchRequest {
  id: string;
  prompt: string;
  apiConfig: any;
  metadata?: Record<string, any>;
}

export interface BatchResult {
  id: string;
  response?: {
    content: string;
    usage?: {
      total_tokens: number;
    };
  };
  error?: string;
  executionTimeMs: number;
  metadata?: Record<string, any>;
}

export interface BatchProcessorOptions {
  maxConcurrency?: number;
  timeoutMs?: number;
  retries?: number;
}

export interface BatchProgress {
  onProgress?: (completed: number, total: number) => void;
  onResult?: (result: BatchResult) => void;
  onStreamChunk?: (providerId: string, content: string) => void;
}

export class BatchProcessor {
  private executor: ParallelExecutor;

  constructor(options: BatchProcessorOptions = {}) {
    this.executor = new ParallelExecutor({
      maxConcurrency: options.maxConcurrency || 5,
      timeoutMs: options.timeoutMs || 30000,
      retryAttempts: options.retries || 2,
    });
  }

  async executeBatch(
    requests: BatchRequest[],
    progress?: BatchProgress
  ): Promise<BatchResult[]> {
    const tasks: ParallelExecutionTask[] = [];

    for (const request of requests) {
      let partialContent = '';
      try {
        // Get the provider from metadata or default to 'openrouter'
        const provider = request.metadata?.provider || 'openrouter';

        // Log the provider and API key for debugging
        console.log(`[BatchProcessor] Creating client for provider: ${provider}`, {
          hasApiKey: !!(request.apiConfig?.apiKey || (provider === 'openrouter' && process.env.OPENROUTER_API_KEY))
        });

        // Create client using the factory with proper configuration
        const clientConfig: any = {
          // Common config
          ...request.apiConfig,
          // Provider-specific overrides
          ...(provider === 'openrouter' && {
            apiKey: request.apiConfig?.apiKey || process.env.OPENROUTER_API_KEY,
            baseUrl: 'https://openrouter.ai/api/v1' // Explicitly set OpenRouter API URL
          })
        };

        const client = LLMClientFactory.createClient(provider, clientConfig);

        const llmRequest: LLMRequest = {
          model: request.apiConfig?.model || 'default',
          messages: [{ role: 'user', content: request.prompt }],
          max_tokens: request.apiConfig?.max_tokens || 1000,
          temperature: request.apiConfig?.temperature ?? 0.7,
        };

        // If streaming is supported, wire up the onStreamChunk callback
        if (progress?.onStreamChunk && typeof client.executePromptStream === 'function') {
          (async () => {
            try {
              for await (const chunk of client.executePromptStream(llmRequest)) {
                const delta = chunk.choices?.[0]?.delta?.content || '';
                if (delta) {
                  partialContent += delta;
                  progress.onStreamChunk(request.id, partialContent);
                }
              }
            } catch (e) {
              // Streaming errors should not break the main batch
              console.warn('Streaming error for provider', provider, e);
            }
          })();
        }

        tasks.push({
          requestId: request.id,
          clientId: provider,
          client,
          request: llmRequest,
        });
      } catch (error) {
        console.error(`Failed to create client for request ${request.id}:`, error);
        // Skip this request if client creation fails
        continue;
      }
    }

    const results = await this.executor.executeParallel(
      tasks,
      (result: ParallelExecutionResult) => {
        const batchResult: BatchResult = {
          id: result.requestId,
          response: result.response ? {
            content: result.response.choices[0]?.message?.content || '',
            usage: result.response.usage,
          } : undefined,
          error: result.error?.message,
          executionTimeMs: result.executionTimeMs,
          metadata: requests.find(r => r.id === result.requestId)?.metadata,
        };

        if (progress?.onResult) {
          progress.onResult(batchResult);
        }
      }
    );

    return results.map(result => ({
      id: result.requestId,
      response: result.response ? {
        content: result.response.choices[0]?.message?.content || '',
        usage: result.response.usage,
      } : undefined,
      error: result.error?.message,
      executionTimeMs: result.executionTimeMs,
      metadata: requests.find(r => r.id === result.requestId)?.metadata,
    }));
  }
}