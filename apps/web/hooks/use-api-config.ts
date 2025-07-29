"use client";

import { useApiConfigContext } from "./api-config-context";

export function useApiConfig() {
  return useApiConfigContext();
}