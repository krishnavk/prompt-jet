export const getBoostTemplate = (technique: string, promptText: string): string => {
  switch (technique) {
    case "chain":
      return `You are skilled in chain-of-thought prompting. Rewrite the prompt to:

1. Start with "Let's think step by step."
2. Use numbered, logical steps.
3. Be concise; end with a final answer.

Format:
- Numbered list
- Clearly marked final answer

<original_prompt>
${promptText}
</original_prompt>`;

    case "role":
      return `You are a prompt engineer. Modify the prompt to assign a relevant expert role.

1. Define an expert persona.
2. Add domain context.
3. Make it task-specific and clear.

Format:
- Role statement
- Revised prompt

<original_prompt>
${promptText}
</original_prompt>`;

    case "constraints":
      return `Add clear constraints to the prompt.

1. Define limits (e.g., format, length, exclusions).
2. Be specific and brief.

Format:
- Bullet list of constraints
- Revised prompt

<original_prompt>
${promptText}
</original_prompt>`;

    case "examples":
      return `Improve the prompt by adding 2–3 concise examples.

1. Include both input and output.
2. Match desired format and tone.

Format:
- Examples first
- Then the prompt

<original_prompt>
${promptText}
</original_prompt>`;

    case "meta":
      return `Make the prompt guide AI to self-evaluate and improve.

1. Add review and refinement steps.
2. Include quality checks.
3. Be brief and focused.

Format:
- Meta-prompt with eval and improvement steps

<original_prompt>
${promptText}
</original_prompt>`;

    case "contextual":
      return `Add minimal but relevant context.

1. Include background, audience, and use case.
2. Be concise and actionable.

Format:
- Context first
- Then the prompt

<original_prompt>
${promptText}
</original_prompt>`;

    case "tot":
      return `Rewrite the prompt to explore multiple reasoning paths.

1. Create 3–4 solution branches.
2. Add compare + synthesize step.

Format:
- Numbered paths
- Final decision step

<original_prompt>
${promptText}
</original_prompt>`;

    case "generated":
      return `Require AI to generate and verify facts before answering.

1. Gather key info.
2. Assess confidence.
3. Use it in final answer.

Format:
- Knowledge section
- Answer section

<original_prompt>
${promptText}
</original_prompt>`;

    case "chaining":
      return `Break the task into dependent steps.

1. Each step builds on the last.
2. Include checks.
3. Keep steps short.

Format:
- Numbered steps
- Note dependencies

<original_prompt>
${promptText}
</original_prompt>`;

    case "reflexion":
      return `Add a self-check loop.

1. Generate.
2. Reflect and critique.
3. Revise.
4. Keep all brief.

Format:
- Answer
- Self-review
- Final version

<original_prompt>
${promptText}
</original_prompt>`;

    case "constitutional":
      return `Add ethical rules to the prompt.

1. Include safety, fairness, and transparency.
2. Be short and direct.

Format:
- Bullet list of principles
- Then the prompt

<original_prompt>
${promptText}
</original_prompt>`;

    case "ensemble":
      return `Use multiple expert viewpoints.

1. Give 3–5 short answers from different roles.
2. Combine into one final output.

Format:
- Each expert’s answer
- Final consensus

<original_prompt>
${promptText}
</original_prompt>`;

    case "stepback":
      return `Step back before solving.

1. Start with abstract questions.
2. Then go specific.
3. Link both clearly.

Format:
- Abstract view
- Detailed solution

<original_prompt>
${promptText}
</original_prompt>`;

    case "react":
      return `Alternate Thought → Action → Observation cycles.

1. Think before each action.
2. Reflect after.
3. Repeat until done.

Format:
- T/A/O sections
- Repeat as needed

<original_prompt>
${promptText}
</original_prompt>`;

    case "critique":
      return `Require AI to critique its own answer.

1. Generate.
2. Critique.
3. Revise.

Format:
- Initial answer
- Critique
- Final version

<original_prompt>
${promptText}
</original_prompt>`;

    case "enhance":
    default:
      return `Make this prompt clearer and more useful.

1. Clarify goal.
2. Add steps, format, and limits.
3. Cut fluff.

Format:
- Enhanced prompt only

<original_prompt>
${promptText}
</original_prompt>`;
  }
};
