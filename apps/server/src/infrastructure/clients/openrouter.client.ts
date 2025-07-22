import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LlmClient, LlmResponse } from '../../domain/interfaces/llm-client.interface';
import axios from 'axios';

@Injectable()
export class OpenRouterClient implements LlmClient {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://openrouter.ai/api/v1';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
  }

  async executePrompt(prompt: string, model: string, config?: { openaiApiKey?: string }): Promise<LlmResponse> {
    const startTime = Date.now();
    const apiKey = config?.openaiApiKey || this.apiKey;
    
    if (!apiKey) {
      throw new Error('OpenRouter API key is required');
    }
    
    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const executionTimeMs = Date.now() - startTime;
    const usage = response.data.usage;

    return {
      content: response.data.choices[0].message.content,
      tokensUsed: usage?.total_tokens || 0,
      executionTimeMs,
      cost: this.calculateCost(model, usage?.total_tokens || 0),
    };
  }

  async getAvailableModels(): Promise<string[]> {
    const response = await axios.get(`${this.baseUrl}/models`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
    });
    
    return response.data.data.map((model: any) => model.id);
  }

  private calculateCost(model: string, tokens: number): number {
    // Simplified cost calculation - you'd want a proper pricing table
    const costPerToken = 0.000001; // $0.000001 per token as example
    return tokens * costPerToken;
  }
}