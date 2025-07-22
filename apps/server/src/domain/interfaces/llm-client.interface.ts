export interface LlmResponse {
  content: string;
  tokensUsed: number;
  executionTimeMs: number;
  cost?: number;
}

export interface LlmClient {
  executePrompt(prompt: string, model: string): Promise<LlmResponse>;
  getAvailableModels(): Promise<string[]>;
}
