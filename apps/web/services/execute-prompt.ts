import { ExecutionResult } from "@/components/prompt-executor";

interface Provider {
  provider: string;
  model: string;
}

interface ExecutePromptParams {
  prompt: string;
  selectedProviders: Provider[];
  openaiApiKey: string;
  lmStudioUrl: string;
  setIsExecuting: (isExecuting: boolean) => void;
  setResults: (results: ExecutionResult[]) => void;
}

export const executePrompt = async ({
  prompt,
  selectedProviders,
  openaiApiKey,
  lmStudioUrl,
  setIsExecuting,
  setResults,
}: ExecutePromptParams) => {
  if (!prompt.trim() || selectedProviders.length === 0) return;

  setIsExecuting(true);
  setResults([]);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/prompt/execute`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          providers: selectedProviders.map((p) => ({
            provider: p.provider,
            model: p.model,
          })),
          config: {
            openaiApiKey,
            lmStudioUrl,
          },
        }),
      }
    );

    const data = await response.json();
    
    // Helper function to safely convert any value to string
    const safeStringify = (value: any): string => {
      if (value === null || value === undefined) {
        return '';
      }
      if (typeof value === 'string') {
        return value;
      }
      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }
      if (Array.isArray(value)) {
        return value.map(safeStringify).join('\n');
      }
      if (typeof value === 'object') {
        // Handle React elements and other objects
        try {
          // Check for React element
          if (value.$$typeof || value.type || value.props) {
            return String(value);
          }
          return JSON.stringify(value, null, 2);
        } catch (e) {
          return '[Object object]';
        }
      }
      return String(value);
    };

    // Ensure results are properly formatted as ExecutionResult[]
    const formattedResults = (data.results || []).map((result: any) => ({
      id: String(result.id || crypto.randomUUID()),
      provider: String(result.provider || 'unknown'),
      model: String(result.model || 'unknown'),
      response: safeStringify(result.response),
      tokensUsed: Number(result.tokensUsed || 0),
      executionTimeMs: Number(result.executionTimeMs || 0),
      cost: result.cost ? Number(result.cost) : undefined,
    }));
    
    setResults(formattedResults);
  } catch (error) {
    console.error("Execution failed:", error);
  } finally {
    setIsExecuting(false);
  }
};