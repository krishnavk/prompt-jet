"use client";

import { useState, useEffect } from "react";
import { encryptApiKey, decryptApiKey } from "@/utils/crypto";
import { Settings, Save, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useLocalStorage } from "@/hooks/use-local-storage";

interface SettingsDialogProps {
  children?: React.ReactNode;
}

import { useApiConfig } from "@/hooks/use-api-config";
import { ParallelConfig, ParallelConfig as ParallelConfigType } from "@/components/parallel-config";
import { PromptConfig, PromptConfig as PromptConfigType } from "@/components/prompt-config";

export function SettingsDialog({ children }: SettingsDialogProps) {
  // Use the shared hook for passphrase and decrypted key
  const {
    openRouterApiKey,
    setOpenRouterApiKey,
    passphrase,
    setPassphrase,
  } = useApiConfig();
  // Use encryptedApiKey and setEncryptedApiKey from context
  const { encryptedApiKey, setEncryptedApiKey, clearAll } = useApiConfig();
  // For showing/hiding decrypted value
  const [showApiKey, setShowApiKey] = useState(false);
  // For feedback
  const [status, setStatus] = useState<string>("");
  const [open, setOpen] = useState(false);
  // For tabs
  const [activeTab, setActiveTab] = useState<'api' | 'parallel' | 'prompt'>('api');
  // For parallel config
  const [parallelConfig, setParallelConfig] = useState<ParallelConfigType>({
    enabled: true,
    maxConcurrency: 5,
    timeoutMs: 30000,
    retryAttempts: 2,
    retryDelayMs: 1000,
  });
  // For prompt config
  const [promptConfig, setPromptConfig] = useState<PromptConfigType>({
    temperature: 0.7,
    topP: 1.0,
    topK: 50,
    maxTokens: 1000,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    stopSequences: '',
  });


  const handleSave = () => {
    if (!passphrase) {
      setStatus("Enter a passphrase to encrypt your API key.");
      return;
    }
    if (!openRouterApiKey) {
      setStatus("Enter your API key.");
      return;
    }
    setEncryptedApiKey(encryptApiKey(openRouterApiKey, passphrase));
    // Save parallel config to localStorage
    localStorage.setItem('parallelConfig', JSON.stringify(parallelConfig));
    // Save prompt config to localStorage
    localStorage.setItem('promptConfig', JSON.stringify(promptConfig));
    setStatus("Settings saved and encrypted.");
    setOpen(false);
  };

  const handleClear = () => {
    clearAll();
    setStatus("API key cleared.");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" data-settings-trigger>
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your API keys and endpoints for LLM providers
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 flex-1 overflow-y-auto">
          <div className="grid gap-2">
            {/* Tab Navigation */}
            <div className="flex border-b mb-4">
              <button
                className={`py-2 px-4 font-medium text-sm ${activeTab === 'api' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('api')}
              >
                API Settings
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${activeTab === 'parallel' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('parallel')}
              >
                Parallel Config
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${activeTab === 'prompt' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('prompt')}
              >
                Prompt Config
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'api' && (
              <div className="space-y-4">
                <Label htmlFor="passphrase" className="flex items-center gap-2">
                  Encryption Passphrase
                </Label>
                <Input
                  id="passphrase"
                  type="password"
                  placeholder="Enter a passphrase"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  autoComplete="off"
                />
                <Label htmlFor="openrouter-key" className="flex items-center gap-2 mt-2">
                  OpenRouter API Key
                  {openRouterApiKey ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                </Label>
                <Input
                  id="openrouter-key"
                  type={showApiKey ? "text" : "password"}
                  placeholder="sk-or-..."
                  value={openRouterApiKey}
                  onChange={(e) => setOpenRouterApiKey(e.target.value)}
                  autoComplete="off"
                />
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    checked={showApiKey}
                    onChange={() => setShowApiKey((s) => !s)}
                    id="show-api-key"
                  />
                  <label htmlFor="show-api-key" className="text-xs">Show API Key</label>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Your API key is encrypted with a passphrase and stored in your browser's local storage.<br />
                  <span className="text-red-500 font-semibold">Warning:</span> This is not fully secure. Anyone with access to your browser and passphrase can access your key.
                </p>
              </div>
            )}

            {activeTab === 'parallel' && (
              <ParallelConfig
                config={parallelConfig}
                onConfigChange={setParallelConfig}
              />
            )}

            {activeTab === 'prompt' && (
              <PromptConfig
                config={promptConfig}
                onConfigChange={setPromptConfig}
              />
            )}

            {status && <p className="text-xs text-blue-500 mt-1">{status}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
