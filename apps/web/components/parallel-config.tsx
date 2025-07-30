'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export interface ParallelConfig {
  enabled: boolean;
  maxConcurrency: number;
  timeoutMs: number;
  retryAttempts: number;
  retryDelayMs: number;
}

interface ParallelConfigProps {
  config: ParallelConfig;
  onConfigChange: (config: ParallelConfig) => void;
}

export function ParallelConfig({ config, onConfigChange }: ParallelConfigProps) {
  const [localConfig, setLocalConfig] = useState<ParallelConfig>(config);

  const handleChange = (key: keyof ParallelConfig, value: any) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Parallel Execution Settings</h3>
        <p className="text-sm text-gray-600">
          Configure how multiple providers are executed in parallel for improved performance
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="parallel-enabled" className="text-sm font-medium">
            Enable Parallel Execution
          </Label>
          <p className="text-xs text-gray-500">
            Execute multiple providers simultaneously to reduce total execution time
          </p>
        </div>
        <Checkbox
          id="parallel-enabled"
          checked={localConfig.enabled}
          onCheckedChange={(checked) => handleChange('enabled', checked)}
        />
      </div>

      {localConfig.enabled && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="max-concurrency" className="text-sm font-medium">
              Maximum Concurrency: {localConfig.maxConcurrency}
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              Maximum number of simultaneous API calls (1-20)
            </p>
            <Input
              id="max-concurrency"
              type="range"
              min="1"
              max="20"
              value={localConfig.maxConcurrency}
              onChange={(e) => handleChange('maxConcurrency', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="timeout-ms" className="text-sm font-medium">
              Request Timeout (ms): {localConfig.timeoutMs}
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              Maximum time to wait for a single request (5-120 seconds)
            </p>
            <Input
              id="timeout-ms"
              type="range"
              min="5000"
              max="120000"
              step="1000"
              value={localConfig.timeoutMs}
              onChange={(e) => handleChange('timeoutMs', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="retry-attempts" className="text-sm font-medium">
              Retry Attempts: {localConfig.retryAttempts}
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              Number of retry attempts for failed requests
            </p>
            <Input
              id="retry-attempts"
              type="range"
              min="0"
              max="5"
              value={localConfig.retryAttempts}
              onChange={(e) => handleChange('retryAttempts', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="retry-delay" className="text-sm font-medium">
              Retry Delay (ms): {localConfig.retryDelayMs}
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              Delay between retry attempts (100ms-10s)
            </p>
            <Input
              id="retry-delay"
              type="range"
              min="100"
              max="10000"
              step="100"
              value={localConfig.retryDelayMs}
              onChange={(e) => handleChange('retryDelayMs', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}