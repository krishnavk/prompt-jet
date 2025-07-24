"use client";

import { useLocalStorage } from "./use-local-storage";

export function useApiConfig() {
  const [openaiApiKey] = useLocalStorage<string>("openai-api-key", "");
  const [lmStudioUrl] = useLocalStorage<string>("lmstudio-url", "http://localhost:1234");

  // Detect if running in Tauri desktop app
  const isTauri = typeof window !== 'undefined' &&
    (!!(window as any).__TAURI__ || !!(window as any).webkit?.messageHandlers?.external);
  
  // Use different API URL for desktop app
  const apiUrl = isTauri
    ? "http://localhost:3001"
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001");
    
  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('Running in Tauri:', isTauri);
    console.log('API URL:', apiUrl);
  }

  return {
    openaiApiKey,
    lmStudioUrl,
    apiUrl,
    isConfigured: {
      openai: !!openaiApiKey,
      lmstudio: !!lmStudioUrl,
    },
  };
}