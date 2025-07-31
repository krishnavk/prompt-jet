import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StreamController } from './presentation/stream/stream.controller';
import { PromptStreamService } from './application/stream/prompt-stream.service';

@Module({
  imports: [],
  controllers: [AppController, StreamController],
  providers: [AppService, PromptStreamService],
})
export class AppModule {}
