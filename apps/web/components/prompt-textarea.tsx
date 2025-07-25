"use client";

interface PromptTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function PromptTextarea({ value, onChange, placeholder = "Enter your prompt here..." }: PromptTextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-32 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2"
    />
  );
}