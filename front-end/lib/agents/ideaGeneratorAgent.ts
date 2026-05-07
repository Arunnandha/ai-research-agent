import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

export interface StartupIdea {
  name: string;
  description: string;
  target_user: string;
  mvp_features: string[];
  differentiation: string;
}

export interface IdeaGeneratorOutput {
  ideas: StartupIdea[];
}

export interface IdeaGeneratorInput {
  trends: string[];
  gaps: string[];
}

const ideaSchema = z.object({
  ideas: z
    .array(
      z.object({
        name: z.string().describe("Specific startup idea name."),
        description: z
          .string()
          .describe("Practical startup concept with clear value proposition."),
        target_user: z.string().describe("Primary user segment most likely to buy/use it."),
        mvp_features: z
          .array(z.string())
          .describe("High-impact, buildable MVP features for first launch."),
        differentiation: z
          .string()
          .describe("What makes this idea different from likely alternatives."),
      }),
    )
    .min(3)
    .max(7)
    .describe("A short list of practical startup ideas."),
});

export class IdeaGeneratorAgent {
  private readonly llm = new ChatOpenAI({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.4,
  });

  async generate(input: IdeaGeneratorInput): Promise<IdeaGeneratorOutput> {
    const structuredLlm = this.llm.withStructuredOutput(ideaSchema);
    const serializedInput = JSON.stringify(input, null, 2);

    const prompt = [
      "You are a startup strategist focused on practical, executable ideas.",
      "Generate startup ideas from market trends and gaps.",
      "Avoid generic suggestions and vague AI wrappers.",
      "",
      "Goal:",
      "- Produce concrete opportunities that a small team can validate quickly.",
      "- Prioritize clear pain points, clear buyer, and fast MVP path.",
      "",
      "Constraints:",
      "- Ideas must map directly to listed trends and gaps.",
      "- Include realistic MVP features (not enterprise-scale roadmaps).",
      "- Use specific positioning and differentiation.",
      "",
      "Input:",
      serializedInput,
    ].join("\n");

    return structuredLlm.invoke(prompt);
  }
}
