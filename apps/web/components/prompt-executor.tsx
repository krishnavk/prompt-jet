"use client";

import { useState, useEffect } from "react";
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
  meta: {
    name: "Meta Prompting",
    description: "Use prompts about prompts to improve quality",
  },
  contextual: {
    name: "Contextual Prompting",
    description: "Add rich context and background information",
  },
  tot: {
    name: "Tree of Thoughts",
    description: "Explore multiple reasoning paths simultaneously",
  },
  generated: {
    name: "Generated Knowledge",
    description: "Generate relevant knowledge before answering",
  },
  chaining: {
    name: "Prompt Chaining",
    description: "Break complex tasks into sequential prompts",
  },
  reflexion: {
    name: "Reflexion",
    description: "Add self-reflection and iterative improvement",
  },
  constitutional: {
    name: "Constitutional AI",
    description: "Add ethical guidelines and safety principles",
  },
  ensemble: {
    name: "Ensemble Methods",
    description: "Combine multiple expert perspectives",
  },
  stepback: {
    name: "Step-Back Prompting",
    description: "First ask broader questions, then focus",
  },
  react: {
    name: "ReAct",
    description: "Combine reasoning with action execution",
  },
  critique: {
    name: "Self-Critique",
    description: "Generate, critique, and refine responses",
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
  const [mounted, setMounted] = useState(false);
  const { openaiApiKey, lmStudioUrl, isConfigured } = useApiConfig();

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!promptText.trim() || !isConfigured.openai) return;

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

        case "meta":
          return `You are a meta-prompting expert who creates prompts that improve other prompts. Transform the following into a meta-prompt that guides the AI to generate better responses.

**Instructions:**
- Add self-referential instructions about prompt quality
- Include evaluation criteria for responses
- Add iterative improvement suggestions
- Include reflection on the prompt's effectiveness
- Add instructions for the AI to critique and refine its own approach

<original_prompt>
${promptText}
</original_prompt>

Transform this into a meta-prompt that improves prompt quality:`;

        case "contextual":
          return `You are a contextual prompting expert who enhances prompts with rich background information and situational awareness.

**Instructions:**
- Add comprehensive background context
- Include relevant domain knowledge and facts
- Specify the situation, audience, and use case
- Add historical context or precedents
- Include environmental or situational factors
- Make the context actionable and relevant

<original_prompt>
${promptText}
</original_prompt>

Enhance with rich contextual information:`;

        case "tot":
          return `You are a Tree of Thoughts prompting expert who creates prompts that explore multiple reasoning paths simultaneously.

**Instructions:**
- Structure the prompt to explore 3-4 different approaches
- Include evaluation criteria for each path
- Add comparison and synthesis instructions
- Include backtracking and refinement steps
- Add voting or selection mechanisms for best solutions
- Ensure systematic exploration of the solution space

<original_prompt>
${promptText}
</original_prompt>

Transform this into a Tree of Thoughts prompt:`;

        case "generated":
          return `You are an expert in generated knowledge prompting who enhances prompts by first generating relevant background knowledge.

**Instructions:**
- Add a knowledge generation phase before the main task
- Include instructions to retrieve and synthesize relevant facts
- Add verification steps for generated knowledge
- Include integration of generated knowledge into the final response
- Add confidence assessment for the generated information
- Ensure the knowledge directly supports the main task

<original_prompt>
${promptText}
</original_prompt>

Enhance with generated knowledge approach:`;

        case "chaining":
          return `You are a prompt chaining expert who breaks complex tasks into sequential, dependent prompts.

**Instructions:**
- Decompose the task into 3-5 sequential steps
- Make each step's output the input for the next
- Add specific instructions for each chain link
- Include validation and checkpoint instructions
- Add error handling and refinement steps
- Ensure clear handoffs between chain elements

<original_prompt>
${promptText}
</original_prompt>

Transform this into a prompt chaining sequence:`;

        case "reflexion":
          return `You are a Reflexion prompting expert who creates prompts with built-in self-reflection and iterative improvement mechanisms.

**Instructions:**
- Add self-evaluation and reflection steps
- Include iterative refinement instructions
- Add memory of previous attempts and lessons learned
- Include meta-cognitive analysis of the reasoning process
- Add improvement suggestions based on outcomes
- Ensure continuous learning and adaptation

<original_prompt>
${promptText}
</original_prompt>

Transform this into a Reflexion prompt:`;

        case "constitutional":
          return `You are a Constitutional AI expert who enhances prompts with ethical guidelines and safety principles.

**Instructions:**
- Add clear ethical principles and guidelines
- Include safety considerations and harm prevention
- Add constitutional rules for behavior
- Include transparency and accountability measures
- Add bias detection and mitigation instructions
- Ensure alignment with human values and safety

<original_prompt>
${promptText}
</original_prompt>

Enhance with constitutional AI principles:`;

        case "ensemble":
          return `You are an ensemble prompting expert who creates prompts that combine multiple expert perspectives and approaches.

**Instructions:**
- Generate responses from 3-5 different expert perspectives
- Include diverse viewpoints and methodologies
- Add synthesis and consensus-building instructions
- Include voting or weighting mechanisms
- Add conflict resolution for contradictory advice
- Ensure comprehensive coverage of the problem space

<original_prompt>
${promptText}
</original_prompt>

Transform this into an ensemble prompt:`;

        case "stepback":
          return `You are a step-back prompting expert who creates prompts that first ask broader questions before focusing on specifics.

**Instructions:**
- First identify and ask broader, more fundamental questions
- Extract high-level concepts and principles
- Use abstract reasoning before concrete application
- Add abstraction and generalization steps
- Include connection to first-principles thinking
- Ensure the step-back informs the specific solution

<original_prompt>
${promptText}
</original_prompt>

Transform this into a step-back prompting approach:`;

        case "react":
          return `You are a ReAct prompting expert who creates prompts that combine reasoning with action execution.

**Instructions:**
- Structure as alternating Thought/Action/Observation cycles
- Include explicit reasoning before each action
- Add action execution with clear expected outcomes
- Include observation and reflection on action results
- Add iterative planning and execution loops
- Ensure tight integration of thinking and doing

<original_prompt>
${promptText}
</original_prompt>

Transform this into a ReAct prompt:`;

        case "critique":
          return `You are a self-critique prompting expert who creates prompts that generate, critique, and refine responses.

**Instructions:**
- First generate an initial response
- Then provide detailed critique and analysis
- Include specific improvement suggestions
- Add refinement and revision steps
- Include quality assessment criteria
- Ensure iterative improvement through critique

<original_prompt>
${promptText}
</original_prompt>

Transform this into a self-critique prompt:`;

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

  if (!mounted) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold py-6">
              Enhance and execute prompts across multiple LLM providers and
              compare results
            </p>
          </div>
          <div className="w-full h-32 p-4 border rounded-lg bg-muted animate-pulse" />
          <div className="flex gap-2">
            <div className="w-48 h-10 bg-muted rounded animate-pulse" />
            <div className="w-36 h-10 bg-muted rounded animate-pulse" />
            <div className="w-56 h-10 bg-muted rounded animate-pulse" />
            <div className="w-36 h-10 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-auto min-w-56 justify-between"
                  >
                    {
                      BOOST_TECHNIQUES[
                        boostTechnique as keyof typeof BOOST_TECHNIQUES
                      ].name
                    }
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-auto min-w-56">
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
                <Button
                  variant="outline"
                  className="w-auto min-w-56 justify-between"
                >
                  {selectedProviders.length === 0
                    ? "Select Providers"
                    : `${selectedProviders.length} provider${
                        selectedProviders.length > 1 ? "s" : ""
                      } selected`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-auto min-w-56">
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
