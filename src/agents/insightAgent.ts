import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

import type { MemoryRecord, SimilarityCluster } from "../memory/index.js";
import type { ClassificationOutput } from "./classificationAgent.js";
import type { SummarizerOutput } from "./summarizerAgent.js";

export interface InsightOutput {
  trends: string[];
  gaps: string[];
  observations: string[];
}

export type InsightInputItem = SummarizerOutput & ClassificationOutput;

export interface InsightMemoryContext {
  historicalSummary: string[];
  emergingSignals: string[];
  previousRecords: MemoryRecord[];
  similarityClusters: SimilarityCluster[];
}

const insightSchema = z.object({
  trends: z
    .array(z.string())
    .describe("Recurring patterns and trending categories inferred from multiple items."),
  gaps: z
    .array(z.string())
    .describe("Potential market gaps, underserved users, or unmet needs identified from the set."),
  observations: z
    .array(z.string())
    .describe("Reasoned observations that connect evidence to implications."),
});

export class InsightAgent {
  private readonly llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.2,
  });

  async analyze(items: InsightInputItem[], memoryContext?: InsightMemoryContext): Promise<InsightOutput> {
    const structuredLlm = this.llm.withStructuredOutput(insightSchema);
    const serializedItems = JSON.stringify(items, null, 2);
    const memoryText = memoryContext
      ? JSON.stringify(
          {
            historicalSummary: memoryContext.historicalSummary,
            emergingSignals: memoryContext.emergingSignals,
            previousRecords: memoryContext.previousRecords,
            similarityClusters: memoryContext.similarityClusters,
          },
          null,
          2,
        )
      : "No historical memory context provided.";

    const prompt = [
      "You are an AI strategy analyst.",
      "Analyze a list of summarized and classified startup/product items.",
      "Use reasoning to infer patterns, not just restate the inputs.",
      "Use historical context to compare today's data with previous days and identify emerging trends over time.",
      "",
      "Reasoning framework:",
      "1) Group repeated themes by category, business model, and user/problem similarity.",
      "2) Infer trend strength based on repetition, urgency of problem, and value proposition overlap.",
      "3) Compare with historical memory and highlight signals that are increasing.",
      "4) Use embedding-based similarity clusters to surface hidden themes not obvious from labels alone.",
      "5) Identify market gaps by looking for underserved user segments, weak solutions, or missing combinations.",
      "6) Produce concise, evidence-based conclusions.",
      "",
      "Output rules:",
      "- trends: concrete trend statements (not generic).",
      "- trends should include emerging trends over time when supported by memory.",
      "- trends can include hidden trends inferred from similarity clusters.",
      "- gaps: actionable whitespace opportunities.",
      "- observations: strategic implications and notable signals.",
      "- Be specific, avoid vague claims.",
      "",
      "Historical memory context:",
      memoryText,
      "",
      "Input items:",
      serializedItems,
    ].join("\n");

    return structuredLlm.invoke(prompt);
  }
}
