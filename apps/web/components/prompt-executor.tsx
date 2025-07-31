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
  // Map of provider id to partial/growing response
  const [partialResults, setPartialResults] = useState<Record<string, string>>({});
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
    // Reset partial results for new execution
    setPartialResults({});
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
      onStreamChunk: (providerId, content) => {
        console.log('[STREAM] provider:', providerId, 'content:', content);
        setPartialResults(prev => ({ ...prev, [providerId]: content }));
      },
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

      {/* Merge full results with partial/growing streamed results */}
      <ResultsDisplay
        results={results.length > 0
          ? results.map(r => ({
              ...r,
              response: r.response || partialResults[r.id] || ''
            }))
          : Object.entries(partialResults).map(([id, response]) => ({
              id,
              provider: id,
              model: '',
              response,
              tokensUsed: 0,
              executionTimeMs: 0,
            }))
        }
        onCopyToClipboard={copyToClipboard}
      />
    </div>
  );
}
