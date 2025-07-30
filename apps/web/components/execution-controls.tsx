"use client";

import { Button } from "./ui/button";
import { ActionDropdown } from "./ui/action-dropdown";
import { Loader2, Play } from "lucide-react";
import { Provider } from "@/config/providers";
import { useState } from "react";

interface ExecutionControlsProps {
  selectedProviders: Provider[];
  setSelectedProviders: (providers: Provider[]) => void;
  onExecute: () => void;
  isExecuting: boolean;
  isDisabled: boolean;
  prompt: string;
  availableProviders: Provider[];
  isConfigured: {
    openrouter: boolean;
  };
}

export function ExecutionControls({
  selectedProviders,
  setSelectedProviders,
  onExecute,
  isExecuting,
  isDisabled,
  prompt,
  availableProviders,
  isConfigured,
}: ExecutionControlsProps) {


  return (
    <>
      <div className="flex gap-2">
        <ActionDropdown
          label="LLM Providers"
          options={(() => {
            // Group providers by category
            const categories = new Map<string, Array<{id: string, name: string, disabled: boolean}>>();
            
            for (const provider of availableProviders) {
              if (!categories.has(provider.category)) {
                categories.set(provider.category, []);
              }
              categories.get(provider.category)?.push({
                id: `${provider.provider}:${provider.model}`,
                name: provider.name,
                disabled: !isConfigured.openrouter && provider.provider === 'openrouter'
              });
            }

            // Convert to options array with headers
            const options: Array<{id: string, name: string, type: 'header' | 'item', label?: string, disabled?: boolean}> = [];
            
            for (const [category, providers] of categories.entries()) {
              options.push({
                id: `header-${category.toLowerCase().replace(/\s+/g, '-')}`,
                name: category,
                type: 'header' as const,
                label: category
              });
              
              for (const provider of providers) {
                options.push({
                  id: provider.id,
                  name: provider.name,
                  type: 'item' as const,
                  disabled: provider.disabled
                });
              }
            }
            
            return options;
          })()}
          selectedIds={selectedProviders.map(p => `${p.provider}:${p.model}`)}
          onSelectionChange={(id, checked) => {
            const [provider, model] = id.split(':');
            const providerInfo = availableProviders.find(p => p.provider === provider && p.model === model);
            if (!providerInfo) return;
            
            if (checked) {
              setSelectedProviders([...selectedProviders, providerInfo]);
            } else {
              setSelectedProviders(selectedProviders.filter(p => !(p.provider === provider && p.model === model)));
            }
          }}
          placeholder="Select providers"
          triggerClassName="w-auto min-w-64 justify-between"
          contentClassName="w-auto min-w-64"
          disabled={isDisabled}
        />
        <Button
          onClick={onExecute}
          disabled={isDisabled}
          className="w-36"
        >
          {isExecuting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run
            </>
          )}
        </Button>
      </div>
    </>
  );
}