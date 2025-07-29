"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PromptTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function PromptTextarea({ value, onChange, placeholder = "Enter your prompt here..." }: PromptTextareaProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-4 pr-10 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out ${
          isExpanded ? "h-96" : "h-32"
        }`}
        style={{
          height: isExpanded ? '384px' : '128px'
        }}
      />
      <button
        onClick={toggleExpanded}
        className="absolute bottom-3 right-3 p-1.5 bg-background/80 backdrop-blur-sm hover:bg-accent rounded-md transition-all duration-200 shadow-sm hover:shadow-md border border-border/50"
        title={isExpanded ? "Collapse prompt" : "Expand prompt"}
        type="button"
      >
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}