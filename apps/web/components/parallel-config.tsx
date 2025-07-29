'use client';

import { useState } from 'react';

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
          <label htmlFor="parallel-enabled" className="text-sm font-medium">
            Enable Parallel Execution
          </label>
          <p className="text-xs text-gray-500">
            Execute multiple providers simultaneously to reduce total execution time
          </p>
        </div>
        <input
          id="parallel-enabled"
          type="checkbox"
          checked={localConfig.enabled}
          onChange={(e) => handleChange('enabled', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
      </div>

      {localConfig.enabled && (
        <>
          <div>
            <label htmlFor="max-concurrency" className="block text-sm font-medium">
              Maximum Concurrency
            </label>
            <input
              id="max-concurrency"
              type="number"
              min="1"
              max="20"
              value={localConfig.maxConcurrency}
              onChange={(e) => handleChange('maxConcurrency', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Maximum number of simultaneous API calls (1-20)
            </p>
          </div>

          <div>
            <label htmlFor="timeout-ms" className="block text-sm font-medium">
              Request Timeout (ms)
            </label>
            <input
              id="timeout-ms"
              type="number"
              min="5000"
              max="120000"
              step="1000"
              value={localConfig.timeoutMs}
              onChange={(e) => handleChange('timeoutMs', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Maximum time to wait for a single request (5-120 seconds)
            </p>
          </div>

          <div>
            <label htmlFor="retry-attempts" className="block text-sm font-medium">
              Retry Attempts
            </label>
            <input
              id="retry-attempts"
              type="number"
              min="0"
              max="5"
              value={localConfig.retryAttempts}
              onChange={(e) => handleChange('retryAttempts', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Number of retry attempts for failed requests
            </p>
          </div>

          <div>
            <label htmlFor="retry-delay" className="block text-sm font-medium">
              Retry Delay (ms)
            </label>
            <input
              id="retry-delay"
              type="number"
              min="100"
              max="10000"
              step="100"
              value={localConfig.retryDelayMs}
              onChange={(e) => handleChange('retryDelayMs', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Delay between retry attempts (100ms-10s)
            </p>
          </div>
        </>
      )}
    </div>
  );
}