"use client";

import { BoostControls } from "./boost-controls";
import { ExecutionControls } from "./execution-controls";
import { Provider } from "@/config/providers";
import { BOOST_TECHNIQUES, BoostTechnique } from "@/config/boost-techniques";

// Get basePath from environment or set manually for GitHub Pages
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (typeof window !== 'undefined' && window.location.pathname.startsWith('/prompt-jet') ? '' : '/prompt-jet');

interface PromptControlsProps {
  // Boost controls props
  boostTechnique: BoostTechnique;
  setBoostTechnique: (technique: BoostTechnique) => void;
  onBoost: () => void;
  isBoosting: boolean;
  isBoostDisabled: boolean;

  // Execution controls props
  selectedProviders: Provider[];
  setSelectedProviders: (providers: Provider[]) => void;
  onExecute: () => void;
  isExecuting: boolean;
  isExecuteDisabled: boolean;

  // Common props
  prompt: string;
  availableProviders: Provider[];
  isConfigured: {
    openrouter: boolean;
  };
}

export function PromptControls({
  boostTechnique,
  setBoostTechnique,
  onBoost,
  isBoosting,
  isBoostDisabled,
  selectedProviders,
  setSelectedProviders,
  onExecute,
  isExecuting,
  isExecuteDisabled,
  prompt,
  availableProviders,
  isConfigured,
}: PromptControlsProps) {
  return (
    <>
      <p className="text-xs text-muted-foreground flex items-center gap-1">
  Selected technique: {BOOST_TECHNIQUES[boostTechnique].name} - {BOOST_TECHNIQUES[boostTechnique].description}
  <a href={`${basePath}/techniques`} title="Learn about prompting techniques" className="ml-1 text-blue-500 hover:text-blue-700">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeWidth="2" d="M12 16v-4m0-4h.01"/></svg>
  </a>
</p>
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <BoostControls
          boostTechnique={boostTechnique}
          setBoostTechnique={setBoostTechnique}
          onBoost={onBoost}
          isBoosting={isBoosting}
          isDisabled={isBoostDisabled || isExecuting}  // Disable during execution too
          prompt={prompt}
        />
        <ExecutionControls
          selectedProviders={selectedProviders}
          setSelectedProviders={setSelectedProviders}
          onExecute={onExecute}
          isExecuting={isExecuting}
          isDisabled={isExecuteDisabled || isBoosting}  // Disable during boost
          prompt={prompt}
          availableProviders={availableProviders}
          isConfigured={isConfigured}
        />
      </div>
    </>
  );
}
