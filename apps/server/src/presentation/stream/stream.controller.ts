import {
  Controller,
  Post,
  Sse,
  MessageEvent,
  Body,
  Res,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { PromptStreamService } from '../../application/stream/prompt-stream.service';
import { PromptStreamRequest } from '@prompt-jet/shared/src/domain/llm/prompt-stream-request';

@Controller('stream')
export class StreamController {
  constructor(private readonly promptStreamService: PromptStreamService) {}

  @Post()
  @HttpCode(200)
  async streamPrompt(@Body() body: PromptStreamRequest, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let buffer = '';

    await this.promptStreamService.streamToProvider(body, (chunk: string) => {
      buffer += chunk;
      res.write(`data: ${JSON.stringify({ content: buffer })}\n\n`);
    });

    res.write('data: [DONE]\n\n');
    res.end();
  }
}
