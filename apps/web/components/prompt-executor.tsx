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
import { PromptIndicators } from "./prompt-indicators";
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
  const { openRouterApiKey, isConfigured } = useApiConfig();

  const { boostPrompt, isBoosting } = useBoostPrompt({
    setPrompt,
  });

  const handleExecutePrompt = async () => {
    // Load prompt config from localStorage
    let promptConfig = {
      temperature: 0.7,
      topP: 1.0,
      topK: 50,
      maxTokens: 1000,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      stopSequences: [],
    };
    
    try {
      const savedPromptConfig = localStorage.getItem('promptConfig');
      if (savedPromptConfig) {
        const parsedConfig = JSON.parse(savedPromptConfig);
        // Convert stopSequences string to array if needed
        if (typeof parsedConfig.stopSequences === 'string') {
          parsedConfig.stopSequences = parsedConfig.stopSequences.split(',').map((s: string) => s.trim()).filter((s: string) => s);
        }
        promptConfig = { ...promptConfig, ...parsedConfig };
      }
    } catch (e) {
      console.warn('Failed to load prompt config from localStorage', e);
    }
    
    await executePromptParallel({
      prompt,
      selectedProviders,
      openRouterApiKey,
      setIsExecuting,
      setResults,
      ...promptConfig,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <PromptHeader />
      <div className="space-y-3">
        <PromptTextarea
          value={prompt}
          onChange={setPrompt}
          placeholder="Enter your prompt here..."
        />
        <PromptIndicators prompt={prompt} results={results} />
      </div>

      <PromptControls
        boostTechnique={boostTechnique}
        setBoostTechnique={setBoostTechnique}
        onBoost={() => boostPrompt(boostTechnique, prompt)}
        isBoosting={isBoosting}
        isBoostDisabled={!isConfigured.openrouter ||!prompt.trim() || isExecuting}
        selectedProviders={selectedProviders}
        setSelectedProviders={setSelectedProviders}
        onExecute={handleExecutePrompt}
        isExecuting={isExecuting}
        isExecuteDisabled={
          !prompt.trim() || !isConfigured.openrouter
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
