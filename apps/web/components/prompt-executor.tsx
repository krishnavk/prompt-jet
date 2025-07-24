"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Loader2,
  Play,
  Clock,
  Zap,
  DollarSign,
  Copy,
  Minimize2,
  Maximize2,
  ChevronDown,
} from "lucide-react";
import { useApiConfig } from "@/lib/api-config";

interface Provider {
  provider: string;
  model: string;
  name: string;
}

interface ExecutionResult {
  id: string;
  provider: string;
  model: string;
  response: string;
  tokensUsed: number;
  executionTimeMs: number;
  cost?: number;
}

const AVAILABLE_PROVIDERS: Provider[] = [
  { provider: "openrouter", model: "openai/gpt-4.1", name: "GPT-4.1" },
  { provider: "openrouter", model: "openai/gpt-4o", name: "GPT-4o" },
  { provider: "openrouter", model: "openai/gpt-4-turbo", name: "GPT-4 Turbo" },
  {
    provider: "openrouter",
    model: "google/gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
  },
  {
    provider: "openrouter",
    model: "google/gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
  },
  {
    provider: "openrouter",
    model: "anthropic/claude-3-opus",
    name: "Claude 3 Opus",
  },
  {
    provider: "openrouter",
    model: "anthropic/claude-3-sonnet",
    name: "Claude 3 Sonnet",
  },
  {
    provider: "openrouter",
    model: "meta-llama/llama-3-70b-instruct",
    name: "Llama 3 70B Instruct",
  },
  {
    provider: "openrouter",
    model: "meta-llama/llama-3-8b-instruct",
    name: "Llama 3 8B Instruct",
  },
  {
    provider: "openrouter",
    model: "mistralai/mistral-large",
    name: "Mistral Large",
  },
  {
    provider: "openrouter",
    model: "mistralai/mistral-medium",
    name: "Mistral Medium",
  },
  {
    provider: "lmstudio",
    model: "llama-2-7b-chat",
    name: "Llama 2 7B (Local)",
  },
];

const BOOST_TECHNIQUES = {
  enhance: {
    name: "Enhance & Refine",
    description: "Make prompts more specific and actionable",
  },
  chain: {
    name: "Chain of Thought",
    description: "Add step-by-step reasoning instructions",
  },
  role: {
    name: "Role-Based",
    description: "Add expert persona and context",
  },
  constraints: {
    name: "Add Constraints",
    description: "Add specific limitations and requirements",
  },
  examples: {
    name: "Few-Shot Examples",
    description: "Add relevant examples and patterns",
  },
};

export function PromptExecutor() {
  const [prompt, setPrompt] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>([]);
  const [results, setResults] = useState<ExecutionResult[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostTechnique, setBoostTechnique] = useState<string>("enhance");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const { openaiApiKey, lmStudioUrl, isConfigured } = useApiConfig();

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Content copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy content");
    }
  };

  const executePrompt = async () => {
    if (!prompt.trim() || selectedProviders.length === 0) return;

    setIsExecuting(true);
    setResults([]);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/prompt/execute`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            providers: selectedProviders.map((p) => ({
              provider: p.provider,
              model: p.model,
            })),
            config: {
              openaiApiKey,
              lmStudioUrl,
            },
          }),
        }
      );

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Execution failed:", error);
    } finally {
      setIsExecuting(false);
    }
  };

  const boostPrompt = async (inputText?: string) => {
    const promptText = inputText || prompt;
    if (!promptText.trim() || !openaiApiKey) return;

    setIsBoosting(true);

    // Set the prompt text if inputText is provided
    if (inputText) {
      setPrompt(inputText);
    }

    // Use OpenRouter GPT-4 as the default provider for boosting
    const openRouterProvider = AVAILABLE_PROVIDERS.find(
      (p) => p.provider === "openrouter" && p.model === "openai/gpt-4.1"
    );

    if (!openRouterProvider) {
      console.error("GPT-4 provider not found");
      setIsBoosting(false);
      return;
    }

    const getBoostTemplate = (technique: string, promptText: string) => {
      switch (technique) {
        case "chain":
          return `You are an expert at creating chain-of-thought prompts. Transform the following prompt to include step-by-step reasoning instructions.

**Instructions:**
- Add explicit reasoning steps
- Include "Let's think step by step" or similar phrasing
- Break complex tasks into clear sequential steps
- Ensure each step builds logically on the previous

<original_prompt>
${promptText}
</original_prompt>

Transform this into a chain-of-thought prompt:`;

        case "role":
          return `You are a professional prompt engineer specializing in role-based prompting. Enhance the following prompt by adding expert persona and domain context.

**Instructions:**
- Add a clear expert role/persona
- Include relevant domain expertise
- Specify the perspective or background knowledge
- Make the role specific and actionable

<original_prompt>
${promptText}
</original_prompt>

Enhance with expert role and context:`;

        case "constraints":
          return `You are a prompt engineer specializing in constraint-based prompting. Add specific limitations and requirements to make the following prompt more focused.

**Instructions:**
- Add clear constraints and boundaries
- Include specific format requirements
- Add word/length limits if appropriate
- Specify what to exclude or avoid

<original_prompt>
${promptText}
</original_prompt>

Add focused constraints and requirements:`;

        case "examples":
          return `You are a prompt engineer specializing in few-shot learning. Enhance the following prompt with relevant examples and patterns.

**Instructions:**
- Add 2-3 relevant examples
- Include input-output patterns
- Show the desired format and style
- Make examples illustrative and diverse

<original_prompt>
${promptText}
</original_prompt>

Enhance with few-shot examples:`;

        case "enhance":
        default:
          return `You are a professional prompt engineer specializing in crafting precise, effective prompts.
Your task is to enhance prompts by making them more specific, actionable, and effective.

**Formatting Requirements:**
- Use Markdown formatting in your response.
- Present requirements, constraints, and steps as bulleted or numbered lists.
- Separate context, instructions, and examples into clear paragraphs.
- Use headings if appropriate.
- Ensure the prompt is easy to read and visually organized.

**Instructions:**
- Improve the user prompt wrapped in \`<original_prompt>\` tags.
- Make instructions explicit and unambiguous.
- Add relevant context and constraints.
- Remove redundant information.
- Maintain the core intent.
- Ensure the prompt is self-contained.
- Use professional language.
- Add references to documentation or examples if applicable.

**For invalid or unclear prompts:**
- Respond with clear, professional guidance.
- Keep responses concise and actionable.
- Maintain a helpful, constructive tone.
- Focus on what the user should provide.
- Use a standard template for consistency.

**IMPORTANT:**
Your response must ONLY contain the enhanced prompt text, formatted as described.
Do not include any explanations, metadata, or wrapper tags.

<original_prompt>
${promptText}
</original_prompt>`;
      }
    };

    // Get the appropriate template based on selected technique
    const enhancedPrompt = getBoostTemplate(boostTechnique, promptText);
    setSelectedProviders([openRouterProvider]);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/prompt/execute`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: enhancedPrompt,
            providers: [
              {
                provider: openRouterProvider.provider,
                model: openRouterProvider.model,
              },
            ],
            config: {
              openaiApiKey,
              lmStudioUrl,
            },
          }),
        }
      );

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        // Update the textarea with the enhanced prompt response
        setPrompt(data.results[0].response);
      }
    } catch (error) {
      console.error("Boost failed:", error);
    } finally {
      setIsBoosting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-bold py-6">
            Enhance and execute prompts across multiple LLM providers and
            compare results
          </p>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full h-32 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2"
        />

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-48 justify-between">
                    {
                      BOOST_TECHNIQUES[
                        boostTechnique as keyof typeof BOOST_TECHNIQUES
                      ].name
                    }
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel>Boost Techniques</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.entries(BOOST_TECHNIQUES).map(([key, technique]) => (
                    <DropdownMenuCheckboxItem
                      key={key}
                      checked={boostTechnique === key}
                      onCheckedChange={() => setBoostTechnique(key)}
                    >
                      {technique.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={() => boostPrompt()}
                disabled={!prompt.trim() || !isConfigured.openai || isExecuting}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-56 justify-between">
                  {selectedProviders.length === 0
                    ? "Select Providers"
                    : `${selectedProviders.length} provider${
                        selectedProviders.length > 1 ? "s" : ""
                      } selected`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-auto">
                <div className="max-h-80 overflow-y-auto overflow-x-hidden">
                  <DropdownMenuLabel className="sticky top-0 bg-popover z-10">
                    LLM Providers
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="sticky bg-popover z-10" />
                  {AVAILABLE_PROVIDERS.map((provider) => {
                    const isAvailable =
                      (provider.provider === "openrouter" &&
                        isConfigured.openai) ||
                      (provider.provider === "lmstudio" &&
                        isConfigured.lmstudio);

                    return (
                      <DropdownMenuCheckboxItem
                        key={`${provider.provider}-${provider.model}`}
                        checked={selectedProviders.some(
                          (p) =>
                            p.provider === provider.provider &&
                            p.model === provider.model
                        )}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedProviders([
                              ...selectedProviders,
                              provider,
                            ]);
                          } else {
                            setSelectedProviders(
                              selectedProviders.filter(
                                (p) =>
                                  !(
                                    p.provider === provider.provider &&
                                    p.model === provider.model
                                  )
                              )
                            );
                          }
                        }}
                        disabled={!isAvailable}
                        className={!isAvailable ? "opacity-50" : ""}
                      >
                        {provider.name}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={executePrompt}
              disabled={
                !prompt.trim() || selectedProviders.length === 0 || isExecuting
              }
              className="w-36"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Selected technique:{" "}
            {
              BOOST_TECHNIQUES[boostTechnique as keyof typeof BOOST_TECHNIQUES]
                .name
            }{" "}
            -
            {
              BOOST_TECHNIQUES[boostTechnique as keyof typeof BOOST_TECHNIQUES]
                .description
            }
          </p>
          {(!isConfigured.openai || !isConfigured.lmstudio) && (
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
          )}
        </div>
      </div>

      {results.length > 0 && (
        <>
          {results.some((result) => expandedCards.has(result.id)) && (
            <div
              className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
              onClick={() => setExpandedCards(new Set())}
            />
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result) => {
              const isExpanded = expandedCards.has(result.id);
              return (
                <div
                  key={result.id}
                  className={isExpanded ? "md:col-span-2 lg:col-span-3" : ""}
                >
                  <Card
                    className={`transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "fixed inset-4 z-50 flex flex-col bg-background"
                        : "cursor-pointer hover:shadow-lg"
                    }`}
                    onClick={() =>
                      !isExpanded && toggleCardExpansion(result.id)
                    }
                  >
                    <CardContent
                      className={`p-4 ${
                        isExpanded ? "flex-1 flex flex-col" : ""
                      }`}
                    >
                      <div className="space-y-3 flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{result.model}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {result.provider}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(result.response);
                              }}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="Copy content"
                            >
                              <Copy className="h-4 w-4 text-gray-600" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCardExpansion(result.id);
                              }}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title={isExpanded ? "Minimize" : "Expand"}
                            >
                              {isExpanded ? (
                                <Minimize2 className="h-4 w-4 text-gray-600" />
                              ) : (
                                <Maximize2 className="h-4 w-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div
                          className={`text-sm bg-muted p-3 rounded overflow-y-auto transition-all duration-300 ${
                            isExpanded
                              ? "flex-1 min-h-0 max-h-[calc(100vh-12rem)]"
                              : "max-h-40"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <pre className="whitespace-pre-wrap font-sans">
                            {result.response}
                          </pre>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {result.executionTimeMs}ms
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {result.tokensUsed} tokens
                          </div>
                          {result.cost && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />$
                              {result.cost.toFixed(4)}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
