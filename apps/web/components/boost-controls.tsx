"use client";

import { Button } from "./ui/button";
import { ActionDropdown } from "./ui/action-dropdown";
import { Loader2, Zap } from "lucide-react";
import { BOOST_TECHNIQUES, BoostTechnique } from "@/config/boost-techniques";

interface BoostControlsProps {
  boostTechnique: BoostTechnique;
  setBoostTechnique: (technique: BoostTechnique) => void;
  onBoost: () => void;
  isBoosting: boolean;
  isDisabled: boolean;
  prompt: string;
}

export function BoostControls({
  boostTechnique,
  setBoostTechnique,
  onBoost,
  isBoosting,
  isDisabled,
  prompt,
}: BoostControlsProps) {
  return (
    <>
      <div className="flex gap-2">
        <div className="flex-1 flex gap-2">
          <ActionDropdown
            label="Boost Techniques"
            options={[
              {
                id: "header-techniques",
                type: "header" as const,
                label: "Prompting Techniques",
                name: "Prompting Techniques",
              },
              ...Object.entries(BOOST_TECHNIQUES).map(([key, technique]) => ({
                id: key,
                name: technique.name,
                description: technique.description,
              })),
            ]}
            selectedIds={[boostTechnique]}
            onSelectionChange={(id, checked) => {
              if (checked) {
                setBoostTechnique(id as BoostTechnique);
              }
            }}
            placeholder="Select technique"
            disabled={isBoosting || isDisabled}
          />
          <Button
            onClick={onBoost}
            disabled={!prompt.trim() || isDisabled || isBoosting}
            variant="default"
            className="w-36"
          >
            {isBoosting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Boosting...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Boost
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
