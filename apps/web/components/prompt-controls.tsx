"use client";

import { BoostControls } from "./boost-controls";
import { ExecutionControls } from "./execution-controls";
import { Provider } from "@/config/providers";
import { BOOST_TECHNIQUES, BoostTechnique } from "@/config/boost-techniques";

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
      <p className="text-xs text-muted-foreground">
        Selected technique: {BOOST_TECHNIQUES[boostTechnique].name} -{" "}
        {BOOST_TECHNIQUES[boostTechnique].description}
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
