import React from "react";
import { BOOST_TECHNIQUES } from "@/config/boost-techniques";

// Map of extra details for techniques, keyed by boost key or name
const TECHNIQUE_DETAILS: Record<string, Partial<{
  pros: string[];
  cons: string[];
  bestUse: string;
  example: string;
}>> = {
  "enhance": {
    pros: ["Clarifies intent", "Reduces ambiguity"],
    cons: ["May over-constrain output"],
    bestUse: "When prompts are vague or under-specified.",
    example: "Rewrite: 'Write a story.' → 'Write a 200-word story for children about a dragon who learns to fly.'"
  },
  "chain": {
    pros: ["Improves reasoning", "Step-by-step transparency"],
    cons: ["Longer prompts and outputs"],
    bestUse: "Complex reasoning or multi-step tasks.",
    example: "Q: Add all odd numbers in [15, 32, 5, 13, 82, 7, 1]. A: Let's think step by step..."
  },
  "role": {
    pros: ["Expertise emulation", "Custom context"],
    cons: ["May bias outputs"],
    bestUse: "When a specific persona or expertise is needed.",
    example: "You are a math teacher. Explain Pythagoras' theorem to a 10-year-old."
  },
  "constraints": {
    pros: ["Controls output format", "Reduces hallucination"],
    cons: ["May restrict creativity"],
    bestUse: "When strict requirements or formats are needed.",
    example: "Respond in JSON: {\"answer\": ...}" 
  },
  "examples": {
    pros: ["In-context learning", "Customizes behavior"],
    cons: ["Needs good examples", "Context window limits"],
    bestUse: "When zero-shot fails or task is nuanced.",
    example: "Translate: 'Bonjour' → 'Hello'. 'Merci' → 'Thank you'. 'Au revoir' → ?"
  },
  "meta": {
    pros: ["Generalizes tasks", "Token efficient"],
    cons: ["Requires abstract thinking"],
    bestUse: "For abstract, structural, or theoretical prompts.",
    example: "Given a problem of type X, the solution follows pattern Y."
  },
  "contextual": {
    pros: ["Improves relevance", "Reduces ambiguity"],
    cons: ["May make prompts long"],
    bestUse: "When external info or background is needed.",
    example: "Given the following article: ... Summarize the main points."
  },
  "tot": {
    pros: ["Explores alternatives", "Improves robustness"],
    cons: ["Complex to implement", "Expensive"],
    bestUse: "Challenging reasoning or planning tasks.",
    example: "Consider multiple ways to solve... Choose the best path."
  },
  "generated": {
    pros: ["Injects external knowledge", "Improves factuality"],
    cons: ["Quality depends on generated info"],
    bestUse: "For knowledge-intensive or fact-checking tasks.",
    example: "Input: ... Knowledge: ... Answer: ..."
  },
  "chaining": {
    pros: ["Decomposes complex tasks", "Modular"],
    cons: ["Requires orchestration"],
    bestUse: "Very complex or multi-stage workflows.",
    example: "Step 1: Extract entities. Step 2: Summarize each entity."
  },
  "reflexion": {
    pros: ["Self-improvement", "Reduces errors"],
    cons: ["Needs multiple runs"],
    bestUse: "When iterative refinement is valuable.",
    example: "Generate answer, critique, then improve."
  },
  "constitutional": {
    pros: ["Adds safety", "Ethical alignment"],
    cons: ["Can reduce flexibility"],
    bestUse: "Sensitive or regulated domains.",
    example: "Follow these principles: ..."
  },
  "ensemble": {
    pros: ["Diverse perspectives", "Reduces bias"],
    cons: ["Resource intensive"],
    bestUse: "When accuracy is critical.",
    example: "Aggregate answers from multiple models."
  },
  "stepback": {
    pros: ["Improves context", "Encourages big-picture thinking"],
    cons: ["May add complexity"],
    bestUse: "When task benefits from broad-to-narrow reasoning.",
    example: "First, what is the general topic? Now, what is the specific question?"
  },
  "react": {
    pros: ["Combines reasoning and action", "Enables tool use"],
    cons: ["Needs external integration"],
    bestUse: "Tasks requiring both reasoning and API/tool calls.",
    example: "Search for ... Then answer the question."
  },
  "critique": {
    pros: ["Improves quality", "Encourages self-correction"],
    cons: ["Needs multiple outputs"],
    bestUse: "When quality control is needed.",
    example: "Generate, critique, and refine the response."
  },
};

// Dynamically render all techniques from BOOST_TECHNIQUES
const boostKeys = Object.keys(BOOST_TECHNIQUES) as Array<keyof typeof BOOST_TECHNIQUES>;

const techniquesTable = boostKeys.map((key) => {
  const base = BOOST_TECHNIQUES[key];
  const details = TECHNIQUE_DETAILS[key] || {};
  return {
    key,
    name: base.name,
    description: base.description,
    pros: details.pros || ["—"],
    cons: details.cons || ["—"],
    bestUse: details.bestUse || "—",
    example: details.example || "—",
    isBoost: true // All in BOOST_TECHNIQUES are boosting options
  };
});

export default function TechniquesPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Prompting Techniques</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="dark:bg-gray-800">
            <tr>
              <th className="border px-4 py-2 text-gray-900 dark:text-gray-100">Technique</th>
              <th className="border px-4 py-2 text-gray-900 dark:text-gray-100">Description</th>
              <th className="border px-4 py-2 text-gray-900 dark:text-gray-100">Pros</th>
              <th className="border px-4 py-2 text-gray-900 dark:text-gray-100">Cons</th>
              <th className="border px-4 py-2 text-gray-900 dark:text-gray-100">Best Use</th>
              <th className="border px-4 py-2 text-gray-900 dark:text-gray-100">Example</th>
            </tr>
          </thead>
          <tbody>
            {techniquesTable.map((t) => (
              <tr key={t.name}>
                <td className="border px-4 py-2 font-semibold align-top whitespace-nowrap">{t.name}</td>
                <td className="border px-4 py-2 align-top">{t.description}</td>
                <td className="border px-4 py-2 align-top">
                  <ul className="list-disc pl-4">
                    {t.pros.map((pro, i) => (
                      <li key={i}>{pro}</li>
                    ))}
                  </ul>
                </td>
                <td className="border px-4 py-2 align-top">
                  <ul className="list-disc pl-4">
                    {t.cons.map((con, i) => (
                      <li key={i}>{con}</li>
                    ))}
                  </ul>
                </td>
                <td className="border px-4 py-2 align-top">{t.bestUse}</td>
                <td className="border px-4 py-2 align-top font-mono whitespace-pre-line">{t.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
