"use client";

import { Button } from "./ui/button";
import { ActionDropdown } from "./ui/action-dropdown";
import { Loader2, Play, Settings } from "lucide-react";
import { Provider } from "@/config/providers";
import { useState } from "react";
import { ParallelConfig } from "./parallel-config";

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
  const [showConfig, setShowConfig] = useState(false);
  const [parallelConfig, setParallelConfig] = useState({
    enabled: true,
    maxConcurrency: 5,
    timeoutMs: 30000,
    retryAttempts: 2,
    retryDelayMs: 1000,
  });

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
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfig(true)}
          title="Parallel Execution Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      {showConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Parallel Execution Settings</h2>
              <button
                onClick={() => setShowConfig(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <ParallelConfig
              config={parallelConfig}
              onConfigChange={setParallelConfig}
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setShowConfig(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}