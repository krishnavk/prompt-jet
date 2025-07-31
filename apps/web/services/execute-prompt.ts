import {
  PromptExecutor,
  Provider as SharedProvider,
  ExecutePromptOptions as SharedExecutePromptOptions,
  ExecutionResult as SharedExecutionResult
} from '@prompt-jet/shared/src/services/prompt-executor';

/**
 * Configuration for a provider
 */
export interface ProviderConfig {
  provider: string;
  model: string;
}

/**
 * Parameters for executing a prompt
 */
interface ExecutePromptParams {
  /** Streaming callback: called with (providerId, growingContent) as each chunk is streamed */
  onStreamChunk?: (providerId: string, content: string) => void;
  /** The prompt text to execute */
  prompt: string;
  /** List of providers to execute the prompt with */
  selectedProviders: ProviderConfig[];
  /** OpenRouter API key */
  openRouterApiKey: string;
  /** Callback to set the executing state */
  setIsExecuting: (isExecuting: boolean) => void;
  /** Callback to update the results */
  setResults: (results: ExecutionResult[] | ((prev: ExecutionResult[]) => ExecutionResult[])) => void;
  /** Temperature for sampling */
  temperature?: number;
  /** Top-p sampling parameter */
  topP?: number;
  /** Top-k sampling parameter */
  topK?: number;
  /** Maximum number of tokens to generate */
  maxTokens?: number;
  /** Frequency penalty */
  frequencyPenalty?: number;
  /** Presence penalty */
  presencePenalty?: number;
  /** Stop sequences */
  stopSequences?: string[];
  /** Progress callback */
  onProgress?: (completed: number, total: number) => void;
}

/**
 * Result of a prompt execution
 */
export type ExecutionResult = SharedExecutionResult;

/**
 * Execute a prompt with multiple providers in parallel
 */
export const executePromptParallel = async ({
  prompt,
  selectedProviders,
  openRouterApiKey,
  setIsExecuting,
  setResults,
  temperature = 0.7,
  topP = 1.0,
  topK = 50,
  maxTokens = 1000,
  frequencyPenalty = 0.0,
  presencePenalty = 0.0,
  onProgress,
  onStreamChunk,
}: ExecutePromptParams): Promise<ExecutionResult[]> => {
  if (!prompt.trim() || selectedProviders.length === 0) return [];

  setIsExecuting(true);
  setResults([]);

  // Load parallel config from localStorage
  let parallelConfig = {
    enabled: true,
    maxConcurrency: 5,
    timeoutMs: 30000,
    retries: 2,
  };
  
  try {
    const savedParallelConfig = localStorage.getItem('parallelConfig');
    if (savedParallelConfig) {
      const parsedConfig = JSON.parse(savedParallelConfig);
      parallelConfig = { ...parallelConfig, ...parsedConfig };
      // Map retryAttempts to retries for backward compatibility
      if (parsedConfig.retryAttempts !== undefined) {
        parallelConfig.retries = parsedConfig.retryAttempts;
      }
    }
  } catch (e) {
    console.warn('Failed to load parallel config from localStorage', e);
  }

  try {
    const promptExecutor = new PromptExecutor({
      temperature,
      topP,
      topK,
      maxTokens,
      frequencyPenalty,
      presencePenalty,
      openRouterApiKey,
      // Only pass parallel execution settings if enabled
      ...(parallelConfig.enabled ? {
        maxConcurrency: parallelConfig.maxConcurrency,
        timeoutMs: parallelConfig.timeoutMs,
        retries: parallelConfig.retries,
      } : {})
    });

    // Map the provider config to the expected Provider type
    const providers: SharedProvider[] = selectedProviders.map(provider => ({
      provider: provider.provider,
      model: provider.model,
    }));

    // Track all results
    const allResults: ExecutionResult[] = [];

    console.log(`Executing prompt with ${providers.length} providers`);

    // Execute prompts in parallel
    const results = await promptExecutor.execute(
      prompt,
      providers,
      (completed: number, total: number) => {
        if (onProgress) onProgress(completed, total);
      },
      (result: SharedExecutionResult) => {
        // Update results as they come in
        const executionResult: ExecutionResult = {
          id: result.id,
          provider: result.provider,
          model: result.model,
          response: result.response,
          tokensUsed: result.tokensUsed,
          executionTimeMs: result.executionTimeMs,
          cost: result.cost,
        };
        allResults.push(executionResult);
        setResults([...allResults]);
      },
      onStreamChunk
    );

    // Return all results (already in the correct format from PromptExecutor)
    return results;
  } catch (error) {
    console.error('Error executing prompts in parallel:', error);
    throw error;
  } finally {
    setIsExecuting(false);
  }
};

// Re-export types for backward compatibility
export type Provider = SharedProvider;
export type ExecutePromptOptions = SharedExecutePromptOptions;

/**
 * Fallback sequential execution (kept for backward compatibility)
 */
export const executePromptSequential = async ({
  prompt,
  selectedProviders,
  openRouterApiKey,
  setIsExecuting,
  setResults,
}: Omit<ExecutePromptParams, 'temperature' | 'topP' | 'topK' | 'maxTokens' | 'frequencyPenalty' | 'presencePenalty' | 'stopSequences' | 'onProgress'>): Promise<ExecutionResult[]> => {
  if (!prompt.trim() || selectedProviders.length === 0) return [];

  setIsExecuting(true);
  setResults([]);

  try {
    const promptExecutor = new PromptExecutor({
      openRouterApiKey
    });

    // Map the provider config to the expected Provider type
    const providers: SharedProvider[] = selectedProviders.map(provider => ({
      provider: provider.provider,
      model: provider.model,
    }));

    // Execute prompts sequentially
    const results = await promptExecutor.execute(prompt, providers);

    setResults(results);
    return results;
  } catch (error) {
    console.error('Error executing prompts sequentially:', error);
    throw error;
  } finally {
    setIsExecuting(false);
  }
};