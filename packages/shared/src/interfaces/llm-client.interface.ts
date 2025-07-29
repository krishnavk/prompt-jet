import { 
  LLMRequest, 
  LLMResponse, 
  LLMStreamChunk, 
  LLMProviderConfig, 
  LLMExecutionResult,
  LLMModelInfo 
} from '../types/llm.types';

export interface ILLMClient {
  executePrompt(request: LLMRequest): Promise<LLMResponse>;
  executePromptStream(request: LLMRequest): AsyncGenerator<LLMStreamChunk>;
  getAvailableModels(): Promise<LLMModelInfo[]>;
  validateConfig(): Promise<boolean>;
  getProviderName(): string;
}

export interface ILLMClientFactory {
  createClient(provider: string, config: LLMProviderConfig): ILLMClient;
}

export interface IRetryPolicy {
  maxRetries: number;
  retryDelay: number;
  shouldRetry: (error: Error) => boolean;
}

export interface IErrorHandler {
  handle(error: Error): Error;
  isRetryable(error: Error): boolean;
}