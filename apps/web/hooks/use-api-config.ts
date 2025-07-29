"use client";

import { useLocalStorage } from "./use-local-storage";

export function useApiConfig() {
  const [openRouterApiKey] = useLocalStorage<string>("openrouter-api-key", "");

  return {
    openRouterApiKey,
    isConfigured: {
      openrouter: !!openRouterApiKey,
    },
  };
}