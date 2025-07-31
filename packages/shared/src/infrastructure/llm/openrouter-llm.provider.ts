import axios from 'axios';
import { PromptStreamRequest } from '../../domain/llm/prompt-stream-request';

export class OpenRouterLLMProvider {
  async stream(req: PromptStreamRequest, onChunk: (chunk: string) => void): Promise<void> {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: req.model,
        messages: [{ role: 'user', content: req.prompt }],
        temperature: req.temperature ?? 0.7,
        max_tokens: req.maxTokens ?? 1000,
        top_p: req.topP ?? 1.0,
        top_k: req.topK ?? 50,
        frequency_penalty: req.frequencyPenalty ?? 0.0,
        presence_penalty: req.presencePenalty ?? 0.0,
        stop: req.stopSequences,
        stream: true,
      },
      {
        headers: {
          'Authorization': `Bearer ${req.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://prompt-jet.com',
          'X-Title': 'Prompt Jet',
        },
        responseType: 'stream',
      }
    );

    const stream = response.data;
    for await (const chunk of stream) {
      const lines = chunk.toString().split('\n').filter((line: string) => line.trim() !== '');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content || '';
            if (delta) onChunk(delta);
          } catch {
            // skip
          }
        }
      }
    }
  }
}
