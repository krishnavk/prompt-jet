# @prompt-jet/shared

A generic, extensible API client for interacting with various LLM providers including OpenRouter, LM Studio, and more.

## Features

- 🔄 **Unified Interface**: Single API for multiple LLM providers
- 🚀 **Streaming Support**: Real-time streaming responses
- 🛡️ **Error Handling**: Comprehensive error handling with retry logic
- 🔧 **Extensible**: Easy to add new providers
- 📦 **TypeScript**: Full TypeScript support
- 🌐 **Web & Node**: Works in both browser and Node.js environments

## Installation

```bash
npm install @prompt-jet/shared
```

## Quick Start

### Basic Usage

```typescript
import { UnifiedLLMClient } from '@prompt-jet/shared';

const client = new UnifiedLLMClient({
  providers: {
    openrouter: {
      apiKey: 'your-openrouter-api-key',
    },
    lmstudio: {
      baseUrl: 'http://localhost:1234',
    },
  },
});

// Execute a prompt
const result = await client.executePrompt('openrouter', {
  model: 'anthropic/claude-3-sonnet',
  messages: [{ role: 'user', content: 'Hello, world!' }],
});

console.log(result.content);
```

### Streaming Responses

```typescript
const stream = client.executePromptStream('lmstudio', {
  model: 'llama-2-7b-chat',
  messages: [{ role: 'user', content: 'Tell me a story' }],
  max_tokens: 200,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    process.stdout.write(content);
  }
}
```

## API Reference

### UnifiedLLMClient

The main client that manages multiple providers.

#### Constructor

```typescript
new UnifiedLLMClient(config: UnifiedClientConfig)
```

#### Methods

- `executePrompt(provider: string, request: LLMRequest): Promise<LLMExecutionResult>`
- `executePromptStream(provider: string, request: LLMRequest): AsyncGenerator<LLMStreamChunk>`
- `getAvailableModels(provider?: string): Promise<Record<string, LLMModelInfo[]>>`
- `validateConfigs(): Promise<Record<string, boolean>>`
- `getConfiguredProviders(): string[]`

### Individual Clients

You can also use individual clients directly:

```typescript
import { LLMClientFactory } from '@prompt-jet/shared';

const openRouterClient = LLMClientFactory.createClient('openrouter', {
  apiKey: 'your-api-key',
});

const lmStudioClient = LLMClientFactory.createClient('lmstudio', {
  baseUrl: 'http://localhost:1234',
});
```

## Configuration

### OpenRouter Configuration

```typescript
{
  apiKey: string;           // Required
  baseUrl?: string;        // Optional: defaults to https://openrouter.ai/api/v1
  timeout?: number;        // Optional: defaults to 30000ms
  maxRetries?: number;     // Optional: defaults to 3
  retryDelay?: number;     // Optional: defaults to 1000ms
  customHeaders?: Record<string, string>;
}
```

### LM Studio Configuration

```typescript
{
  baseUrl?: string;        // Optional: defaults to http://localhost:1234
  timeout?: number;        // Optional: defaults to 30000ms
  maxRetries?: number;     // Optional: defaults to 3
  retryDelay?: number;     // Optional: defaults to 1000ms
  customHeaders?: Record<string, string>;
}
```

## Error Handling

The library provides comprehensive error handling:

```typescript
import { LLMClientError, LLMRateLimitError, LLMAuthenticationError } from '@prompt-jet/shared';

try {
  await client.executePrompt('openrouter', request);
} catch (error) {
  if (error instanceof LLMRateLimitError) {
    console.log('Rate limited, retry later');
  } else if (error instanceof LLMAuthenticationError) {
    console.log('Invalid API key');
  } else {
    console.log('Other error:', error.message);
  }
}
```

## Adding New Providers

To add a new provider, extend the `BaseLLMClient`:

```typescript
import { BaseLLMClient, LLMRequest, LLMResponse } from '@prompt-jet/shared';

class MyProviderClient extends BaseLLMClient {
  async executePrompt(request: LLMRequest): Promise<LLMResponse> {
    // Implement provider-specific logic
  }

  async *executePromptStream(request: LLMRequest): AsyncGenerator<LLMStreamChunk> {
    // Implement streaming logic
  }

  async getAvailableModels(): Promise<LLMModelInfo[]> {
    // Return available models
  }

  async validateConfig(): Promise<boolean> {
    // Validate configuration
  }

  getProviderName(): string {
    return 'myprovider';
  }
}
```

Then register it in the factory:

```typescript
// In client-factory.ts
case 'myprovider':
  return new MyProviderClient(config);
```

## License

MIT