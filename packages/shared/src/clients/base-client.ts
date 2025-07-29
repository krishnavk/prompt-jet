import axios, { AxiosInstance } from 'axios';
import { ILLMClient } from '../interfaces/llm-client.interface';
import { LLMRequest, LLMResponse, LLMStreamChunk, LLMProviderConfig } from '../types/llm.types';
import { LLMClientError, LLMTimeoutError, LLMRateLimitError, LLMAuthenticationError } from '../errors/llm-errors';

export abstract class BaseLLMClient implements ILLMClient {
  protected httpClient: AxiosInstance;
  protected config: LLMProviderConfig;

  constructor(config: LLMProviderConfig) {
    this.config = config;

    this.httpClient = axios.create({
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.customHeaders,
      },
    });

    this.setupInterceptors();
  }

  protected setupInterceptors(): void {
    // Request interceptor
    this.httpClient.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    // Response interceptor with retry logic
    this.httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        
        if (!config || !this.isRetryableError(error)) {
          return Promise.reject(this.handleError(error));
        }

        config.retryCount = config.retryCount || 0;

        if (config.retryCount >= (this.config.maxRetries || 3)) {
          return Promise.reject(this.handleError(error));
        }

        config.retryCount += 1;

        await this.delay((this.config.retryDelay || 1000) * config.retryCount);

        return this.httpClient(config);
      }
    );
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected isRetryableError(error: any): boolean {
    if (!error.response) return true; // Network errors
    
    const status = error.response.status;
    return status === 429 || status >= 500 || status === 408;
  }

  protected handleError(error: any): Error {
    if (error.code === 'ECONNABORTED') {
      return new LLMTimeoutError(`Request timeout: ${error.message}`, this.getProviderName());
    }

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.message || error.message;

      switch (status) {
        case 401:
        case 403:
          return new LLMAuthenticationError(message, this.getProviderName());
        case 429:
          return new LLMRateLimitError(message, this.getProviderName());
        case 408:
          return new LLMTimeoutError(message, this.getProviderName());
        default:
          return new LLMClientError(message, `HTTP_${status}`, status, this.getProviderName(), this.isRetryableError(error));
      }
    }

    return new LLMClientError(error.message, 'UNKNOWN', undefined, this.getProviderName(), true);
  }

  abstract executePrompt(request: LLMRequest): Promise<LLMResponse>;
  abstract executePromptStream(request: LLMRequest): AsyncGenerator<LLMStreamChunk>;
  abstract getAvailableModels(): Promise<any[]>;
  abstract validateConfig(): Promise<boolean>;
  abstract getProviderName(): string;

  protected transformMessages(messages: any[]): any[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      ...(msg.name && { name: msg.name }),
      ...(msg.tool_calls && { tool_calls: msg.tool_calls }),
    }));
  }
}