import { UnifiedLLMClient, LLMClientFactory } from '../src';

// Example 1: Using the Unified Client
async function unifiedClientExample() {
  const client = new UnifiedLLMClient({
    providers: {
      openrouter: {
        apiKey: process.env.OPENROUTER_API_KEY || 'your-api-key',
        maxRetries: 3,
        timeout: 30000,
      },
      lmstudio: {
        baseUrl: 'http://localhost:1234',
        timeout: 60000,
      },
    },
  });

  // Get available models
  const models = await client.getAvailableModels();
  console.log('Available models:', models);

  // Execute a prompt
  const result = await client.executePrompt('openrouter', {
    model: 'anthropic/claude-3-sonnet',
    messages: [
      { role: 'user', content: 'Hello, how are you?' },
    ],
    max_tokens: 100,
  });

  console.log('Response:', result.content);
  console.log('Tokens used:', result.tokensUsed);
  console.log('Cost:', result.cost);
}

// Example 2: Using individual clients
async function individualClientExample() {
  const openRouterClient = LLMClientFactory.createClient('openrouter', {
    apiKey: process.env.OPENROUTER_API_KEY || 'your-api-key',
  });

  const response = await openRouterClient.executePrompt({
    model: 'openai/gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is TypeScript?' },
    ],
  });

  console.log('Response:', response.choices[0].message.content);
}

// Example 3: Streaming responses
async function streamingExample() {
  const client = new UnifiedLLMClient({
    providers: {
      lmstudio: {
        baseUrl: 'http://localhost:1234',
      },
    },
  });

  const stream = client.executePromptStream('lmstudio', {
    model: 'llama-2-7b-chat',
    messages: [
      { role: 'user', content: 'Write a short story about AI.' },
    ],
    max_tokens: 200,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      process.stdout.write(content);
    }
  }
}

// Example 4: Error handling
async function errorHandlingExample() {
  const client = new UnifiedLLMClient({
    providers: {
      openrouter: {
        apiKey: 'invalid-key',
      },
    },
  });

  try {
    await client.executePrompt('openrouter', {
      model: 'anthropic/claude-3-sonnet',
      messages: [{ role: 'user', content: 'Hello' }],
    });
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Provider:', error.provider);
    console.error('Retryable:', error.retryable);
  }
}

// Run examples
if (require.main === module) {
  unifiedClientExample().catch(console.error);
}