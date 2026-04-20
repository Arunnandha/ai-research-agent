import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

export interface ClassificationOutput {
  category: string;
  business_model: "SaaS" | "API" | "open source";
  complexity: "low" | "medium" | "high";
}

const classificationSchema = z.object({
  category: z
    .string()
    .describe("Main product category (for example: dev tool, marketing, automation)."),
  business_model: z
    .enum(["SaaS", "API", "open source"])
    .describe("Primary business model."),
  complexity: z
    .enum(["low", "medium", "high"])
    .describe("Estimated implementation or adoption complexity."),
});

export class ClassificationAgent {
  private readonly llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.1,
  });

  async classify(rawData: unknown): Promise<ClassificationOutput> {
    const structuredLlm = this.llm.withStructuredOutput(classificationSchema);
    const rawText = typeof rawData === "string" ? rawData : JSON.stringify(rawData, null, 2);

    const prompt = [
      "You are an AI market intelligence analyst.",
      "Classify the input item into a product category, business model, and complexity.",
      "Keep labels practical for startup/product research.",
      "",
      "Rules:",
      "- category: short label like dev tool, marketing, automation, analytics, productivity",
      "- business_model: choose one of SaaS, API, open source",
      "- complexity: choose one of low, medium, high",
      "",
      "Raw data:",
      rawText,
    ].join("\n");

    return structuredLlm.invoke(prompt);
  }
}
