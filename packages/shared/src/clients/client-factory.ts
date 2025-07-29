import { ILLMClient } from '../interfaces/llm-client.interface';
import { LLMProviderConfig } from '../types/llm.types';
import { OpenRouterClient } from './openrouter-client';

export class LLMClientFactory {
  static createClient(provider: string, config: LLMProviderConfig): ILLMClient {
    console.log(`[LLMClientFactory] Creating client for provider:`, {
      originalProvider: provider,
      configKeys: config ? Object.keys(config) : 'no config'
    });
    
    // Normalize the provider name by trimming and converting to lowercase
    const normalizedProvider = provider?.toString().trim().toLowerCase();
    
    // Validate provider is not empty
    if (!normalizedProvider) {
      const error = new Error('Provider name is required');
      console.error('[LLMClientFactory] Error:', error.message, { provider, normalizedProvider });
      throw error;
    }

    // Map of supported providers to their client constructors
    const providerMap: Record<string, (config: LLMProviderConfig) => ILLMClient> = {
      'openrouter': (cfg) => new OpenRouterClient(cfg)
      // Add other providers here as needed
    };

    // Find the provider in the map
    const clientFactory = providerMap[normalizedProvider];
    
    if (!clientFactory) {
      const supportedProviders = Object.keys(providerMap).join(', ');
      const error = new Error(
        `Unsupported provider: "${provider}". ` +
        `Supported providers are: ${supportedProviders}`
      );
      console.error('[LLMClientFactory] Error:', error.message, {
        originalProvider: provider,
        normalizedProvider,
        supportedProviders
      });
      throw error;
    }

    try {
      return clientFactory(config);
    } catch (error) {
      throw new Error(`Failed to initialize client for provider "${provider}": ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  static getSupportedProviders(): string[] {
    const supportsLocal = {
      'openrouter': true
    };  
    return Object.keys(supportsLocal);
  }
}