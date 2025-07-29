export const getBoostTemplate = (technique: string, promptText: string): string => {
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