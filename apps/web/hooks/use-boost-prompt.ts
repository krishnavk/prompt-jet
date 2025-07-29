"use client";

import { useState, useMemo, useCallback } from "react";
import { useApiConfig } from "@/hooks/use-api-config";
import { AVAILABLE_PROVIDERS } from "@/config/providers";
import { BoostTechnique } from "@/config/boost-techniques";
import { getBoostTemplate } from "@/config/boost-templates";
import { LLMClientFactory } from "@prompt-jet/shared";

// Cache for storing boosted prompts
const promptCache = new Map<string, string>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface UseBoostPromptProps {
  setPrompt: (prompt: string) => void;
  setSelectedProviders: (providers: any[]) => void;
}

export function useBoostPrompt({
  setPrompt,
  setSelectedProviders,
}: UseBoostPromptProps) {
  const [isBoosting, setIsBoosting] = useState(false);
  const { openRouterApiKey, isConfigured } = useApiConfig();

  // Memoize the provider lookup
  const openRouterProvider = useMemo(() =>
    AVAILABLE_PROVIDERS.find(
      (p) => p.provider === "openrouter" && p.model === "google/gemini-2.5-flash"
    ),
    [] // Empty dependency array means this only runs once
  );

  // Memoize the LLM client
  const llmClient = useMemo(() => {
    if (!openRouterProvider || !openRouterApiKey) return null;
    return LLMClientFactory.createClient(openRouterProvider.provider, {
      apiKey: openRouterApiKey,
    });
  }, [openRouterProvider, openRouterApiKey]);

  // Generate cache key based on prompt and technique
  const getCacheKey = useCallback((prompt: string, technique: BoostTechnique) => {
    return `${technique}:${prompt}`;
  }, []);

  const boostPrompt = useCallback(async (
    boostTechnique: BoostTechnique,
    prompt: string,
    inputText?: string
  ) => {
    const promptText = inputText || prompt;
    if (!promptText.trim() || !isConfigured.openrouter || !llmClient || !openRouterProvider) {
      return;
    }

    // Check cache first
    const cacheKey = getCacheKey(promptText, boostTechnique);
    const cachedResult = promptCache.get(cacheKey);

    if (cachedResult) {
      setPrompt(cachedResult);
      return;
    }

    // Set loading state
    setIsBoosting(true);

    // Update prompt if inputText is provided
    if (inputText) {
      setPrompt(inputText);
    }

    // Use requestIdleCallback to prevent blocking the main thread
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(async () => {
        await processBoost();
      }, { timeout: 1000 });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(processBoost, 0);
    }

    async function processBoost() {
      try {
        if (!llmClient) {
          console.error('LLM client is not initialized');
          return;
        }

        // Get the enhanced prompt template
        const enhancedPrompt = getBoostTemplate(boostTechnique, promptText);

        if (!openRouterProvider) {
          throw new Error("OpenRouter provider with model 'google/gemini-2.5-flash' not found");
        }

        // Update UI in the next tick to keep it responsive
        await new Promise(resolve => setTimeout(resolve, 0));
        setSelectedProviders([openRouterProvider]);

        // Execute the prompt
        const response = await llmClient.executePrompt({
          model: openRouterProvider.model,
          messages: [{ role: 'user', content: enhancedPrompt }],
          temperature: 0.7,
          max_tokens: 2000,
        });

        if (response.choices?.[0]?.message?.content) {
          const result = response.choices[0].message.content;
          // Cache the result
          promptCache.set(cacheKey, result);
          // Set cache expiration
          setTimeout(() => promptCache.delete(cacheKey), CACHE_TTL);
          // Update the prompt
          setPrompt(result);
        }
      } catch (error) {
        console.error("Boost failed:", error);
      } finally {
        setIsBoosting(false);
      }
    }
  }, [llmClient, openRouterProvider, isConfigured.openrouter, setPrompt, setSelectedProviders, getCacheKey]);

  return {
    boostPrompt,
    isBoosting,
  };
}