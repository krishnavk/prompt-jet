import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PromptStreamRequest } from '../../domain/stream/prompt-stream-request';

@Injectable()
export class PromptStreamService {
  async streamToProvider(
    req: PromptStreamRequest,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    // For now, only OpenRouter is supported. Later, provider switch logic can be added here.
    const provider = new OpenRouterLLMProvider();
    await provider.stream(req, onChunk);
  }
}
