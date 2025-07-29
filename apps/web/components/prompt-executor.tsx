"use client";

import { useState } from "react";
import { useApiConfig } from "@/hooks/use-api-config";
import { AVAILABLE_PROVIDERS } from "@/config/providers";
import { Provider } from "@/config/providers";
import { BoostTechnique } from "@/config/boost-techniques";
import { PromptControls } from "./prompt-controls";
import { ConfigurationNotice } from "./configuration-notice";
import { ResultsDisplay } from "./results-display";
import { PromptHeader } from "./prompt-header";
import { PromptTextarea } from "./prompt-textarea";
import { useBoostPrompt } from "@/hooks/use-boost-prompt";
import { executePromptParallel } from "@/services/execute-prompt";
import { copyToClipboard } from "@/utils/clipboard";

export interface ExecutionResult {
  id: string;
  provider: string;
  model: string;
  response: string;
  tokensUsed: number;
  executionTimeMs: number;
  cost?: number;
}

export function PromptExecutor() {
  const [prompt, setPrompt] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>([]);
  const [results, setResults] = useState<ExecutionResult[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [boostTechnique, setBoostTechnique] =
    useState<BoostTechnique>("enhance");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const { openRouterApiKey, isConfigured, passphrase, setPassphrase } = useApiConfig();

  const { boostPrompt, isBoosting } = useBoostPrompt({
    setPrompt,
    setSelectedProviders,
  });

  const handleExecutePrompt = async () => {
    await executePromptParallel({
      prompt,
      selectedProviders,
      openRouterApiKey,

      setIsExecuting,
      setResults,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <PromptHeader />
      <PromptTextarea
        value={prompt}
        onChange={setPrompt}
        placeholder="Enter your prompt here..."
      />

      <PromptControls
        boostTechnique={boostTechnique}
        setBoostTechnique={setBoostTechnique}
        onBoost={() => boostPrompt(boostTechnique, prompt)}
        isBoosting={isBoosting}
        isBoostDisabled={!isConfigured.openrouter || isExecuting}
        selectedProviders={selectedProviders}
        setSelectedProviders={setSelectedProviders}
        onExecute={handleExecutePrompt}
        isExecuting={isExecuting}
        isExecuteDisabled={
          !prompt.trim() || selectedProviders.length === 0 || isExecuting
        }
        prompt={prompt}
        availableProviders={AVAILABLE_PROVIDERS}
        isConfigured={isConfigured}
      />
      <ConfigurationNotice isConfigured={isConfigured} />

      <ResultsDisplay results={results} onCopyToClipboard={copyToClipboard} />
    </div>
  );
}
