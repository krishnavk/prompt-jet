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
    setStatus("API key saved and encrypted.");
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your API keys and endpoints for LLM providers
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
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
            {status && <p className="text-xs text-blue-500 mt-1">{status}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2">
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
