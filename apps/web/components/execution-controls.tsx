"use client";

import { Button } from "./ui/button";
import { ActionDropdown } from "./ui/action-dropdown";
import { Loader2, Play } from "lucide-react";
import { Provider } from "@/config/providers";

interface ExecutionControlsProps {
  selectedProviders: Provider[];
  setSelectedProviders: (providers: Provider[]) => void;
  onExecute: () => void;
  isExecuting: boolean;
  isDisabled: boolean;
  prompt: string;
  availableProviders: Provider[];
  isConfigured: {
    openai: boolean;
    lmstudio: boolean;
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
    <div className="flex gap-2">
      <ActionDropdown
        label="LLM Providers"
        options={(() => {
          // Group providers by category
          const categories = new Map<string, Array<{id: string, name: string, disabled: boolean}>>();
          
          availableProviders.forEach((provider) => {
            const isAvailable =
              (provider.provider === "openrouter" && isConfigured.openai) ||
              (provider.provider === "lmstudio" && isConfigured.lmstudio);
            
            const option = {
              id: `${provider.provider}-${provider.model}`,
              name: provider.name,
              disabled: !isAvailable,
            };

            if (!categories.has(provider.category)) {
              categories.set(provider.category, []);
            }
            categories.get(provider.category)?.push(option);
          });

          // Convert map to array of grouped options
          const groupedOptions = [];
          for (const [category, options] of categories.entries()) {
            groupedOptions.push({
              type: 'header' as const,
              label: category,
            });
            groupedOptions.push(...options);
          }
          
          return groupedOptions;
        })()}
        selectedIds={selectedProviders.map(
          (p) => `${p.provider}-${p.model}`
        )}
        onSelectionChange={(id, checked) => {
          const provider = availableProviders.find(
            (p) => `${p.provider}-${p.model}` === id
          );
          if (!provider) return;

          if (checked) {
            setSelectedProviders([...selectedProviders, provider]);
          } else {
            setSelectedProviders(
              selectedProviders.filter(
                (p) => !(p.provider === provider.provider && p.model === provider.model)
              )
            );
          }
        }}
        placeholder="Select Providers"
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
  );
}