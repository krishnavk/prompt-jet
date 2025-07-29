"use client";

import { useEffect, useState } from "react";

interface ConfigurationNoticeProps {
  isConfigured: {
    openrouter: boolean;
  };
}

export function ConfigurationNotice({ isConfigured }: ConfigurationNoticeProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR and initial hydration, don't render anything to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  if (isConfigured.openrouter) {
    return null;
  }

  return (
    <p className="text-sm text-muted-foreground">
      Some providers require configuration.{" "}
      <button
        type="button"
        className="text-primary underline"
        onClick={() => {
          // Find the settings button and click it
          if (typeof window !== "undefined") {
            const settingsButton = document.querySelector(
              'header button[title="Settings"]'
            );
            if (settingsButton instanceof HTMLElement) {
              settingsButton.click();
            }
          }
        }}
      >
        Configure settings
      </button>
    </p>
  );
}