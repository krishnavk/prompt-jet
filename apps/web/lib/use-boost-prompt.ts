"use client";

import { useState } from "react";
import { useApiConfig } from "@/lib/api-config";
import { AVAILABLE_PROVIDERS } from "@/lib/providers";
import { BoostTechnique } from "@/lib/boost-techniques";
import { getBoostTemplate } from "@/lib/boost-templates";

interface UseBoostPromptProps {
  setPrompt: (prompt: string) => void;
  setSelectedProviders: (providers: any[]) => void;
}

export function useBoostPrompt({
  setPrompt,
  setSelectedProviders,
}: UseBoostPromptProps) {
  const [isBoosting, setIsBoosting] = useState(false);
  const { openaiApiKey, lmStudioUrl, isConfigured } = useApiConfig();

  const boostPrompt = async (
    boostTechnique: BoostTechnique,
    prompt: string,
    inputText?: string
  ) => {
    const promptText = inputText || prompt;
    if (!promptText.trim() || !isConfigured.openai) return;

    setIsBoosting(true);

    // Set the prompt text if inputText is provided
    if (inputText) {
      setPrompt(inputText);
    }

    // Use OpenRouter GPT-4 as the default provider for boosting
    const openRouterProvider = AVAILABLE_PROVIDERS.find(
      (p) => p.provider === "openrouter" && p.model === "openai/gpt-4.1"
    );

    if (!openRouterProvider) {
      console.error("GPT-4 provider not found");
      setIsBoosting(false);
      return;
    }

    // Get the appropriate template based on selected technique
    const enhancedPrompt = getBoostTemplate(boostTechnique, promptText);
    setSelectedProviders([openRouterProvider]);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/prompt/execute`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: enhancedPrompt,
            providers: [
              {
                provider: openRouterProvider.provider,
                model: openRouterProvider.model,
              },
            ],
            config: {
              openaiApiKey,
              lmStudioUrl,
            },
          }),
        }
      );

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        // Update the textarea with the enhanced prompt response
        setPrompt(data.results[0].response);
      }
    } catch (error) {
      console.error("Boost failed:", error);
    } finally {
      setIsBoosting(false);
    }
  };

  return {
    boostPrompt,
    isBoosting,
  };
}