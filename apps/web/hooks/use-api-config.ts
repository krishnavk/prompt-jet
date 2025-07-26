"use client";

import { useLocalStorage } from "./use-local-storage";

export function useApiConfig() {
  const [openaiApiKey] = useLocalStorage<string>("openai-api-key", "");
  const [lmStudioUrl] = useLocalStorage<string>("lmstudio-url", "http://localhost:1234");

  return {
    openaiApiKey,
    lmStudioUrl,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    isConfigured: {
      openai: !!openaiApiKey,
      lmstudio: !!lmStudioUrl,
    },
  };
}