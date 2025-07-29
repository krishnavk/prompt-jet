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
  /** Maximum number of concurrent requests */
  maxConcurrency?: number;
  /** Request timeout in milliseconds */
  timeoutMs?: number;
  /** Number of retry attempts */
  retries?: number;
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
  maxConcurrency = 5,
  timeoutMs = 30000,
  retries = 2,
  onProgress,
}: ExecutePromptParams): Promise<ExecutionResult[]> => {
  if (!prompt.trim() || selectedProviders.length === 0) return [];

  setIsExecuting(true);
  setResults([]);

  try {
    const promptExecutor = new PromptExecutor({
      maxConcurrency,
      timeoutMs,
      retries,
      openRouterApiKey
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
      }
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
}: Omit<ExecutePromptParams, 'maxConcurrency' | 'timeoutMs' | 'retries' | 'onProgress'>): Promise<ExecutionResult[]> => {
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