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
}

export function useBoostPrompt({
  setPrompt,
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
        await processBoost(0);
      }, { timeout: 1000 });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(() => processBoost(0), 0);
    }

    async function processBoost(retryCount = 0) {
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

        // Execute the prompt
        const response = await llmClient.executePrompt({
          model: openRouterProvider.model,
          messages: [{ role: 'user', content: enhancedPrompt }],
          temperature: 0.7,
          max_tokens: 2000,
        });

        if (response.choices?.[0]?.message?.content) {
          const result = response.choices[0].message.content;
          // Parse Boost Score from result
          const scoreMatch = result.match(/Boost Score:\s*(\d+)/i);
          const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
          if (score === 100) {
            // Cache the result
            promptCache.set(cacheKey, result);
            // Set cache expiration
            setTimeout(() => promptCache.delete(cacheKey), CACHE_TTL);
            // Extract only the Enhanced Prompt section
            const enhancedMatch = result.match(/Enhanced Prompt:\s*([\s\S]*?)\n?Boost Score:/i);
            const enhancedOnly = enhancedMatch ? enhancedMatch[1].trim() : result;
            setPrompt(enhancedOnly);
          } else {
            retryCount++;
            if (retryCount < 3) {
              console.warn(`Boost score was not 100 (got ${score}). Retrying... [Attempt ${retryCount}]`);
              await processBoost(retryCount);
            } else {
              console.error('Failed to generate a boost prompt with score 100 after 3 attempts. No boost applied.');
            }
          }
        }
      } catch (error) {
        console.error("Boost failed:", error);
      } finally {
        setIsBoosting(false);
      }
    }
  }, [llmClient, openRouterProvider, isConfigured.openrouter, setPrompt, getCacheKey]);

  return {
    boostPrompt,
    isBoosting,
  };
}