import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ExecutePromptUseCase } from '../../application/use-cases/execute-prompt.use-case';
import { ExecutePromptDto } from '../dto/execute-prompt.dto';

@Controller('prompt')
export class PromptController {
  constructor(private readonly executePromptUseCase: ExecutePromptUseCase) {}

  @Post('execute')
  async executePrompt(@Body() dto: ExecutePromptDto) {
    return this.executePromptUseCase.execute(dto.prompt, dto.providers, dto.config);
  }

  @Get('models')
  async getAvailableModels() {
    return {
      openrouter: ['gpt-4', 'gpt-3.5-turbo', 'claude-3-sonnet'],
      lmstudio: ['llama-2-7b-chat', 'mistral-7b-instruct'],
    };
  }
}