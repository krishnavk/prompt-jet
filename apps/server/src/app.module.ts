import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PromptController } from './infrastructure/controllers/prompt.controller';
import { ExecutePromptUseCase } from './application/use-cases/execute-prompt.use-case';
import { OpenRouterClient } from './infrastructure/clients/openrouter.client';
import { LmStudioClient } from './infrastructure/clients/lmstudio.client';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [PromptController],
  providers: [
    ExecutePromptUseCase,
    {
      provide: 'OPENROUTER_CLIENT',
      useClass: OpenRouterClient,
    },
    {
      provide: 'LMSTUDIO_CLIENT', 
      useClass: LmStudioClient,
    },
  ],
})
export class AppModule {}
