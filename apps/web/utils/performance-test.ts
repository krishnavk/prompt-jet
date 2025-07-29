import { LLMService } from '@/services/llm-service';
import { BatchProcessor } from '@prompt-jet/shared';

export interface PerformanceTestResult {
  sequentialTime: number;
  parallelTime: number;
  speedup: number;
  sequentialResults: any[];
  parallelResults: any[];
}

export async function runPerformanceTest(
  providers: Array<{ provider: string; model: string }>,
  prompt: string,
  apiConfig: any
): Promise<PerformanceTestResult> {
  const testPrompt = "Write a short haiku about programming.";
  
  // Sequential execution
  console.log("Running sequential test...");
  const sequentialStart = Date.now();
  const sequentialResults = [];
  
  for (const provider of providers) {
    const startTime = Date.now();
    try {
      const llmService = new LLMService({
        ...apiConfig,
        provider: provider.provider,
        model: provider.model,
      });
      
      const response = await llmService.executePrompt(testPrompt);
      sequentialResults.push({
        provider: provider.provider,
        model: provider.model,
        response: response.content,
        executionTimeMs: Date.now() - startTime,
      });
    } catch (error) {
      sequentialResults.push({
        provider: provider.provider,
        model: provider.model,
        error: error instanceof Error ? error.message : String(error),
        executionTimeMs: Date.now() - startTime,
      });
    }
  }
  
  const sequentialTime = Date.now() - sequentialStart;
  
  // Parallel execution
  console.log("Running parallel test...");
  const parallelStart = Date.now();
  
  const batchProcessor = new BatchProcessor({
    maxConcurrency: Math.min(providers.length, 5),
    timeoutMs: 30000,
    retries: 2,
  });
  
  const parallelResults = await batchProcessor.executeBatch(
    providers.map((provider, index) => ({
      id: `test-${index}`,
      prompt: testPrompt,
      apiConfig: {
        ...apiConfig,
        provider: provider.provider,
        model: provider.model,
      },
      metadata: {
        provider: provider.provider,
        model: provider.model,
      },
    }))
  );
  
  const parallelTime = Date.now() - parallelStart;
  
  return {
    sequentialTime,
    parallelTime,
    speedup: sequentialTime / parallelTime,
    sequentialResults,
    parallelResults,
  };
}