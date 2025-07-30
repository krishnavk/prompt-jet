"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export interface PromptConfig {
  temperature: number;
  topP: number;
  topK: number;
  maxTokens: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences: string;
}

interface PromptConfigProps {
  config: PromptConfig;
  onConfigChange: (config: PromptConfig) => void;
}

export function PromptConfig({ config, onConfigChange }: PromptConfigProps) {
  const [localConfig, setLocalConfig] = useState<PromptConfig>(config);

  const handleChange = (key: keyof PromptConfig, value: any) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Prompt Configuration</h3>
        <p className="text-sm text-gray-600">
          Configure advanced settings for prompt generation
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="temperature" className="text-sm font-medium">
            Temperature: {localConfig.temperature}
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            Controls randomness in sampling (0.0 = deterministic, 1.0 = creative)
          </p>
          <Input
            id="temperature"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={localConfig.temperature}
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="topP" className="text-sm font-medium">
            Top-P (Nucleus): {localConfig.topP}
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            Controls diversity via nucleus sampling (0.0 = greedy, 1.0 = all tokens)
          </p>
          <Input
            id="topP"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={localConfig.topP}
            onChange={(e) => handleChange('topP', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="topK" className="text-sm font-medium">
            Top-K: {localConfig.topK}
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            Limits the number of highest probability tokens considered
          </p>
          <Input
            id="topK"
            type="range"
            min="1"
            max="100"
            step="1"
            value={localConfig.topK}
            onChange={(e) => handleChange('topK', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="maxTokens" className="text-sm font-medium">
            Max Tokens: {localConfig.maxTokens}
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            Maximum number of tokens to generate
          </p>
          <Input
            id="maxTokens"
            type="range"
            min="1"
            max="4096"
            step="1"
            value={localConfig.maxTokens}
            onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="frequencyPenalty" className="text-sm font-medium">
            Frequency Penalty: {localConfig.frequencyPenalty}
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            Reduces repetition of tokens (0.0 = no penalty, 2.0 = strong penalty)
          </p>
          <Input
            id="frequencyPenalty"
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={localConfig.frequencyPenalty}
            onChange={(e) => handleChange('frequencyPenalty', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="presencePenalty" className="text-sm font-medium">
            Presence Penalty: {localConfig.presencePenalty}
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            Reduces repetition of topics (0.0 = no penalty, 2.0 = strong penalty)
          </p>
          <Input
            id="presencePenalty"
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={localConfig.presencePenalty}
            onChange={(e) => handleChange('presencePenalty', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="stopSequences" className="text-sm font-medium">
            Stop Sequences
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            Sequences where generation should stop (comma-separated)
          </p>
          <Input
            id="stopSequences"
            type="text"
            value={localConfig.stopSequences}
            onChange={(e) => handleChange('stopSequences', e.target.value)}
            placeholder="Enter stop sequences separated by commas"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
