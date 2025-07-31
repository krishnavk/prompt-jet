export interface PromptStreamRequest {
  prompt: string;
  provider: string;
  model: string;
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
}
