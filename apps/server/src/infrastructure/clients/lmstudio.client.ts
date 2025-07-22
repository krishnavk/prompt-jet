import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LlmClient, LlmResponse } from '../../domain/interfaces/llm-client.interface';
import axios from 'axios';

@Injectable()
export class LmStudioClient implements LlmClient {
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('LM_STUDIO_URL') || 'http://localhost:1234';
  }

  async executePrompt(prompt: string, model: string, config?: { lmStudioUrl?: string }): Promise<LlmResponse> {
    const startTime = Date.now();
    const baseUrl = config?.lmStudioUrl || this.baseUrl;
    
    try {
      const response = await axios.post(
        `${baseUrl}/v1/chat/completions`,
        {
          model,
          messages: [{ role: 'user', content: prompt }],
          stream: false,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        }
      );

      const executionTimeMs = Date.now() - startTime;
      
      return {
        content: response.data.choices[0].message.content,
        tokensUsed: response.data.usage?.total_tokens || 0,
        executionTimeMs,
        cost: 0, // Local models are free
      };
    } catch (error) {
      throw new Error(`LM Studio connection failed: ${error.message}`);
    }
  }

  async getAvailableModels(config?: { lmStudioUrl?: string }): Promise<string[]> {
    const baseUrl = config?.lmStudioUrl || this.baseUrl;
    
    try {
      const response = await axios.get(`${baseUrl}/v1/models`);
      return response.data.data.map((model: any) => model.id);
    } catch (error) {
      return ['llama-2-7b-chat']; // Fallback model
    }
  }
}