import { Injectable, Inject } from '@nestjs/common';
import { LlmClient } from '../../domain/interfaces/llm-client.interface';
import { Prompt, ExecutionResult } from '../../domain/entities/prompt.entity';

@Injectable()
export class ExecutePromptUseCase {
  constructor(
    @Inject('OPENROUTER_CLIENT') private readonly openRouterClient: LlmClient,
    @Inject('LMSTUDIO_CLIENT') private readonly lmStudioClient: LlmClient
  ) {}

  async execute(
    promptContent: string,
    selectedProviders: { provider: string; model: string }[]
  ): Promise<{ promptId: string; results: ExecutionResult[] }> {
    const promptId = this.generateId();
    const prompt = new Prompt(promptId, promptContent, new Date());

    const executionPromises = selectedProviders.map(async ({ provider, model }) => {
      const client = this.getClient(provider);
      const startTime = Date.now();
      
      try {
        const response = await client.executePrompt(promptContent, model);
        
        return new ExecutionResult(
          this.generateId(),
          promptId,
          provider,
          model,
          response.content,
          response.tokensUsed,
          response.executionTimeMs,
          response.cost
        );
      } catch (error) {
        return new ExecutionResult(
          this.generateId(),
          promptId,
          provider,
          model,
          `Error: ${error.message}`,
          0,
          Date.now() - startTime
        );
      }
    });

    const results = await Promise.all(executionPromises);
    
    return { promptId, results };
  }

  private getClient(provider: string): LlmClient {
    switch (provider) {
      case 'openrouter':
        return this.openRouterClient;
      case 'lmstudio':
        return this.lmStudioClient;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
