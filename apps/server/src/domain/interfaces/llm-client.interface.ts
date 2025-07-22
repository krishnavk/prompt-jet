export interface LlmResponse {
  content: string;
  tokensUsed: number;
  executionTimeMs: number;
  cost?: number;
}

export interface LlmClient {
  executePrompt(prompt: string, model: string, config?: any): Promise<LlmResponse>;
  getAvailableModels(config?: any): Promise<string[]>;
}
