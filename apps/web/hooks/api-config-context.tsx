"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocalStorage } from "./use-local-storage";
import { decryptApiKey, encryptApiKey } from "@/utils/crypto";

interface ApiConfigContextType {
  encryptedApiKey: string;
  setEncryptedApiKey: (key: string) => void;
  openRouterApiKey: string;
  setOpenRouterApiKey: (key: string) => void;
  passphrase: string;
  setPassphrase: (pass: string) => void;
  isConfigured: { openrouter: boolean };
  clearAll: () => void;
}

const ApiConfigContext = createContext<ApiConfigContextType | undefined>(undefined);

export function ApiConfigProvider({ children }: { children: ReactNode }) {
  const [encryptedApiKey, setEncryptedApiKey] = useLocalStorage<string>("openrouter-api-key", "");
  const [passphrase, setPassphrase] = useState<string>("");
  const [openRouterApiKey, setOpenRouterApiKey] = useState<string>("");

  useEffect(() => {
    if (encryptedApiKey && passphrase) {
      setOpenRouterApiKey(decryptApiKey(encryptedApiKey, passphrase));
    } else {
      setOpenRouterApiKey("");
    }
  }, [encryptedApiKey, passphrase]);

  const clearAll = () => {
    setEncryptedApiKey("");
    setOpenRouterApiKey("");
    setPassphrase("");
  };

  return (
    <ApiConfigContext.Provider
      value={{
        encryptedApiKey,
        setEncryptedApiKey,
        openRouterApiKey,
        setOpenRouterApiKey,
        passphrase,
        setPassphrase,
        isConfigured: { openrouter: !!openRouterApiKey },
        clearAll,
      }}
    >
      {children}
    </ApiConfigContext.Provider>
  );
}

export function useApiConfigContext() {
  const ctx = useContext(ApiConfigContext);
  if (!ctx) throw new Error("useApiConfigContext must be used within ApiConfigProvider");
  return ctx;
}
