export const getBoostTemplate = (technique: string, promptText: string): string => {
  switch (technique) {
    case "chain":
      return `You are an expert in chain-of-thought prompting. Transform the following prompt so that it:

**Instructions:**
1. Break the task into clear, numbered reasoning steps.
2. Start with "Let's think step by step."
3. Ensure each step is explicit and logically follows the previous.
4. Use concise, direct language.
5. End with a final answer after all steps.
6. Respond as efficiently as possible. Avoid unnecessary elaboration.

**Output Format:**
- Use a numbered list for steps.
- Highlight the final answer.

<original_prompt>
${promptText}
</original_prompt>

Return only the improved prompt, no explanations.`;

    case "role":
      return `You are a prompt engineer. Enhance the following prompt by making the AI take on a specific expert role and domain context.

**Instructions:**
1. Assign a clear, relevant expert persona (e.g., "You are a senior data scientist...").
2. Specify domain knowledge and perspective.
3. Make the role actionable and relevant to the task.
4. Ensure instructions are direct and unambiguous.
5. Respond concisely and avoid unnecessary details.

**Output Format:**
- Start with the expert role statement.
- Follow with the enhanced prompt.

<original_prompt>
${promptText}
</original_prompt>`;

    case "constraints":
      return `You are a prompt engineer. Make the following prompt more focused by adding clear constraints and requirements.

**Instructions:**
1. Add explicit boundaries (e.g., "Do not use...", "Only include...").
2. Specify required format (e.g., table, bullet list).
3. Add length or word limits if relevant.
4. State what to exclude or avoid.
5. Respond as briefly as possible while meeting requirements.

**Output Format:**
- List all constraints before the main prompt.
- Use bullet points for constraints.

<original_prompt>
${promptText}
</original_prompt>`;

    case "examples":
      return `You are a prompt engineer. Improve the following prompt by adding clear, relevant examples.

**Instructions:**
1. Add 2-3 diverse, illustrative examples.
2. Show both input and expected output for each.
3. Use the desired format and style.
4. Place examples before the main prompt.
5. Keep examples and prompt concise for fast reading.

**Output Format:**
- List examples first, then the main prompt.
- Use markdown code blocks if appropriate.

<original_prompt>
${promptText}
</original_prompt>`;

    case "meta":
      return `You are a meta-prompting expert. Turn the following into a meta-prompt that guides the AI to self-improve its responses.

**Instructions:**
1. Add instructions for the AI to evaluate its own response for quality and relevance.
2. Include criteria for improvement and self-reflection.
3. Encourage iterative refinement.
4. Require the AI to critique and revise its own answer.
5. Keep all steps efficient and avoid lengthy explanations.

**Output Format:**
- Meta-prompt with explicit self-evaluation and improvement steps.

<original_prompt>
${promptText}
</original_prompt>`;

    case "contextual":
      return `You are a contextual prompting expert. Improve the following prompt by adding detailed background and situational context.

**Instructions:**
1. Add relevant facts, domain knowledge, and background information.
2. Specify the audience, use case, and situation.
3. Include any historical or environmental factors.
4. Make the context actionable and directly related to the task.
5. Summarize context efficiently; avoid unnecessary detail.

**Output Format:**
- Context paragraph first, then the main prompt.

<original_prompt>
${promptText}
</original_prompt>`;

    case "tot":
      return `You are a Tree of Thoughts prompting expert. Transform the prompt to encourage exploring multiple reasoning paths.

**Instructions:**
1. Structure the prompt to require 3-4 different solution approaches.
2. For each path, specify evaluation criteria.
3. Add instructions for comparing, synthesizing, and selecting the best solution.
4. Include steps for backtracking and refinement.
5. Be concise and avoid lengthy justifications.

**Output Format:**
- Numbered sections for each reasoning path.
- Final synthesis and selection at the end.

<original_prompt>
${promptText}
</original_prompt>`;

    case "generated":
      return `You are an expert in generated knowledge prompting. Improve the prompt by requiring generation and verification of background knowledge before answering.

**Instructions:**
1. Add a step to gather and synthesize relevant facts before answering.
2. Include instructions to verify and integrate the knowledge.
3. Require a confidence assessment for the generated facts.
4. Keep knowledge and answer sections concise.

**Output Format:**
- Section for generated knowledge.
- Section for main answer using that knowledge.

<original_prompt>
${promptText}
</original_prompt>`;

    case "chaining":
      return `You are a prompt chaining expert. Break down the task into a sequence of dependent steps.

**Instructions:**
1. Decompose the task into 3-5 sequential steps.
2. Make each step's output the input for the next.
3. Add validation and error handling at each step.
4. Ensure clear handoffs and checkpoints.
5. Keep each step as brief as possible.

**Output Format:**
- Numbered list, one for each chain step.
- Note dependencies between steps.

<original_prompt>
${promptText}
</original_prompt>`;

    case "reflexion":
      return `You are a Reflexion prompting expert. Add self-reflection and iterative improvement mechanisms to the prompt.

**Instructions:**
1. Require the AI to self-evaluate its answer and reasoning.
2. Add instructions for iterative refinement.
3. Include memory of previous attempts or lessons learned.
4. Add meta-cognitive analysis and improvement suggestions.
5. Keep all sections concise and focused.

**Output Format:**
- Self-evaluation section after the answer.
- List of improvements or lessons learned.

<original_prompt>
${promptText}
</original_prompt>`;

    case "constitutional":
      return `You are a Constitutional AI expert. Enhance the prompt with explicit ethical and safety guidelines.

**Instructions:**
1. Add clear ethical principles and safety rules.
2. Specify harm prevention and bias mitigation steps.
3. Include transparency and accountability requirements.
4. Ensure all instructions align with human values.
5. Present only essential guidelines for efficiency.

**Output Format:**
- Ethical guidelines section before the main prompt.
- Use bullet points for each principle.

<original_prompt>
${promptText}
</original_prompt>`;

    case "ensemble":
      return `You are an ensemble prompting expert. Transform the prompt to combine multiple expert perspectives and approaches.

**Instructions:**
1. Generate 3-5 responses from different expert viewpoints.
2. Synthesize and build consensus among responses.
3. Add voting or weighting for best solutions.
4. Resolve any contradictions.
5. Keep each expert's answer short and to the point.

**Output Format:**
- Separate sections for each expert's answer.
- Final consensus or synthesis section.

<original_prompt>
${promptText}
</original_prompt>`;

    case "stepback":
      return `You are a step-back prompting expert. Improve the prompt by first addressing broader, fundamental questions before specifics.

**Instructions:**
1. Start with high-level, abstract questions and concepts.
2. Use first-principles reasoning before concrete application.
3. Show how the step-back informs the specific solution.
4. Keep all sections brief and avoid unnecessary detail.

**Output Format:**
- Section for broad questions/concepts.
- Section for specific solution.

<original_prompt>
${promptText}
</original_prompt>`;

    case "react":
      return `You are a ReAct prompting expert. Transform the prompt to alternate between reasoning and action.

**Instructions:**
1. Structure as cycles: Thought → Action → Observation.
2. Require explicit reasoning before each action.
3. Add reflection after each action.
4. Iterate until the task is complete.
5. Keep each cycle concise and focused.

**Output Format:**
- Clearly labeled sections: Thought, Action, Observation.
- Repeat as needed.

<original_prompt>
${promptText}
</original_prompt>`;

    case "critique":
      return `You are a self-critique prompting expert. Transform the prompt to require generation, critique, and refinement of the answer.

**Instructions:**
1. Generate an initial answer.
2. Provide a detailed critique of the answer.
3. Suggest and apply improvements.
4. Repeat critique and refinement if needed.
5. Keep all responses as brief as possible.

**Output Format:**
- Initial answer section.
- Critique section.
- Improved answer section.

<original_prompt>
${promptText}
</original_prompt>`;

    case "enhance":
    default:
      return `You are a professional prompt engineer. Make this prompt more specific, actionable, and effective.

**Instructions:**
1. Clarify the main goal and required output.
2. Add explicit steps, requirements, and constraints.
3. Use bullet points or numbered lists for structure.
4. Remove ambiguity and redundancy.
5. Ensure the prompt is self-contained and professional.
6. Use Markdown formatting for clarity.
7. Respond as efficiently as possible; avoid unnecessary elaboration.

**Output Format:**
- Enhanced prompt only. No explanations or wrapper tags.

<original_prompt>
${promptText}
</original_prompt>`;
  }
};