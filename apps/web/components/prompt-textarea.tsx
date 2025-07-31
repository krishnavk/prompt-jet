"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface PromptTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function PromptTextarea({ value, onChange, placeholder = "Enter your prompt here..." }: PromptTextareaProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
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
      <div className="absolute bottom-3 right-3 flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleCopy}
                className="p-1.5 bg-background/80 backdrop-blur-sm hover:bg-accent rounded-md transition-all duration-200 shadow-sm hover:shadow-md border border-border/50"
                aria-label="Copy prompt"
                type="button"
              >
                <Copy className={`h-4 w-4 text-muted-foreground ${copied ? 'text-green-500' : ''}`} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {copied ? "Copied!" : "Copy prompt"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <button
          onClick={toggleExpanded}
          className="p-1.5 bg-background/80 backdrop-blur-sm hover:bg-accent rounded-md transition-all duration-200 shadow-sm hover:shadow-md border border-border/50"
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
    </div>
  );
}