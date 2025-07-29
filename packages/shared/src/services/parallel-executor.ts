import { LLMRequest, LLMResponse } from '../types/llm.types';
import { ILLMClient } from '../interfaces/llm-client.interface';
import { LLMClientError } from '../errors/llm-errors';

export interface ParallelExecutionConfig {
  maxConcurrency: number;
  timeoutMs: number;
  retryAttempts: number;
  retryDelayMs: number;
}

export interface ParallelExecutionResult {
  requestId: string;
  clientId: string;
  response?: LLMResponse;
  error?: Error;
  executionTimeMs: number;
  tokensUsed: number;
}

export interface ParallelExecutionTask {
  requestId: string;
  clientId: string;
  client: ILLMClient;
  request: LLMRequest;
}

export class ParallelExecutor {
  private config: ParallelExecutionConfig;

  constructor(config: Partial<ParallelExecutionConfig> = {}) {
    this.config = {
      maxConcurrency: config.maxConcurrency || 5,
      timeoutMs: config.timeoutMs || 30000,
      retryAttempts: config.retryAttempts || 3,
      retryDelayMs: config.retryDelayMs || 1000,
    };
  }

  async executeParallel(
    tasks: ParallelExecutionTask[],
    onProgress?: (result: ParallelExecutionResult) => void
  ): Promise<ParallelExecutionResult[]> {
    const results: ParallelExecutionResult[] = [];
    const executing: Promise<void>[] = [];
    const semaphore = new Semaphore(this.config.maxConcurrency);

    for (const task of tasks) {
      await semaphore.acquire();
      
      const executionPromise = this.executeTaskWithRetry(task)
        .then(result => {
          results.push(result);
          if (onProgress) {
            onProgress(result);
          }
        })
        .finally(() => {
          semaphore.release();
        });

      executing.push(executionPromise);

      // If we've reached max concurrency, wait for at least one to complete
      if (executing.length >= this.config.maxConcurrency) {
        await Promise.race(executing);
      }
    }

    // Wait for all remaining tasks to complete
    await Promise.all(executing);
    
    return results;
  }

  private async executeTaskWithRetry(task: ParallelExecutionTask): Promise<ParallelExecutionResult> {
    const startTime = Date.now();
    
    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await this.executeWithTimeout(task);
        const executionTimeMs = Date.now() - startTime;
        
        return {
          requestId: task.requestId,
          clientId: task.clientId,
          response,
          executionTimeMs,
          tokensUsed: response.usage?.total_tokens || 0,
        };
      } catch (error) {
        if (attempt === this.config.retryAttempts) {
          const executionTimeMs = Date.now() - startTime;
          return {
            requestId: task.requestId,
            clientId: task.clientId,
            error: error as Error,
            executionTimeMs,
            tokensUsed: 0,
          };
        }

        // Exponential backoff
        await this.delay(this.config.retryDelayMs * Math.pow(2, attempt));
      }
    }

    throw new Error('Max retries exceeded');
  }

  private async executeWithTimeout(task: ParallelExecutionTask): Promise<LLMResponse> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new LLMClientError('Request timeout', 'TIMEOUT', 408, task.client.getProviderName()));
      }, this.config.timeoutMs);
    });

    const executionPromise = task.client.executePrompt(task.request);
    
    return Promise.race([executionPromise, timeoutPromise]);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class Semaphore {
  private permits: number;
  private queue: (() => void)[] = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return;
    }

    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    this.permits++;
    const resolve = this.queue.shift();
    if (resolve) {
      this.permits--;
      resolve();
    }
  }
}