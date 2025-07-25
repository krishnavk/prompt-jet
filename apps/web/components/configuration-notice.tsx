"use client";

interface ConfigurationNoticeProps {
  isConfigured: {
    openai: boolean;
    lmstudio: boolean;
  };
}

export function ConfigurationNotice({ isConfigured }: ConfigurationNoticeProps) {
  if (isConfigured.openai && isConfigured.lmstudio) {
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
          const settingsButton = document.querySelector(
            'header button[title="Settings"]'
          );
          if (settingsButton instanceof HTMLElement) {
            settingsButton.click();
          }
        }}
      >
        Configure settings
      </button>
    </p>
  );
}