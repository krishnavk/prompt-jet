"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsDialog } from "./settings-dialog";

export function SettingsTrigger() {
  return (
    <SettingsDialog>
      <Button variant="outline" size="sm">
        <Settings className="h-4 w-4" />
      </Button>
    </SettingsDialog>
  );
}