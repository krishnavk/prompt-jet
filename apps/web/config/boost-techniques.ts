export const BOOST_TECHNIQUES = {
  "enhance": {
    "name": "Enhance & Refine",
    "description": "Make prompts more specific and actionable"
  },
  "chain": {
    "name": "Chain of Thought",
    "description": "Add step-by-step reasoning instructions"
  },
  "role": {
    "name": "Role-Based",
    "description": "Add expert persona and context"
  },
  "constraints": {
    "name": "Add Constraints",
    "description": "Add specific limitations and requirements"
  },
  "examples": {
    "name": "Few-Shot Examples",
    "description": "Add relevant examples and patterns"
  },
  "meta": {
    "name": "Meta Prompting",
    "description": "Use prompts about prompts to improve quality"
  },
  "contextual": {
    "name": "Contextual Prompting",
    "description": "Add rich context and background information"
  },
  "tot": {
    "name": "Tree of Thoughts",
    "description": "Explore multiple reasoning paths simultaneously"
  },
  "generated": {
    "name": "Generated Knowledge",
    "description": "Generate relevant knowledge before answering"
  },
  "chaining": {
    "name": "Prompt Chaining",
    "description": "Break complex tasks into sequential prompts"
  },
  "reflexion": {
    "name": "Reflexion",
    "description": "Add self-reflection and iterative improvement"
  },
  "constitutional": {
    "name": "Constitutional AI",
    "description": "Add ethical guidelines and safety principles"
  },
  "ensemble": {
    "name": "Ensemble Methods",
    "description": "Combine multiple expert perspectives"
  },
  "stepback": {
    "name": "Step-Back Prompting",
    "description": "First ask broader questions, then focus"
  },
  "react": {
    "name": "ReAct",
    "description": "Combine reasoning with action execution"
  },
  "critique": {
    "name": "Self-Critique",
    "description": "Generate, critique, and refine responses"
  }
} as const;

export type BoostTechnique = keyof typeof BOOST_TECHNIQUES;