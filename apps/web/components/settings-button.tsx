"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsDialog } from "./settings-dialog";

interface SettingsButtonProps {
  className?: string;
}

export function SettingsButton({ className }: SettingsButtonProps) {
  return (
    <SettingsDialog>
      <Button variant="outline" size="sm" className={className} title="Settings">
        <Settings className="h-4 w-4" />
      </Button>
    </SettingsDialog>
  );
}