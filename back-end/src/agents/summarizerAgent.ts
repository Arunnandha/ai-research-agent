import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

export interface SummarizerOutput {
  summary: string;
  problem: string;
  target_user: string;
}

const summarizerSchema = z.object({
  summary: z
    .string()
    .describe("Key value proposition of the product/news in 1-2 concise sentences."),
  problem: z.string().describe("What specific problem this solves."),
  target_user: z.string().describe("Who this is primarily for."),
});

export class SummarizerAgent {
  private readonly llm = new ChatOpenAI({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.2,
  });

  async summarize(rawData: unknown): Promise<SummarizerOutput> {
    const structuredLlm = this.llm.withStructuredOutput(summarizerSchema);
    const rawText = typeof rawData === "string" ? rawData : JSON.stringify(rawData, null, 2);

    const prompt = [
      "You are an AI research analyst.",
      "Extract structured insight from raw product/news content.",
      "Return fields that are factual and concise.",
      "",
      "Extraction requirements:",
      "- problem: what problem it solves",
      "- target_user: who it is for",
      "- summary: key value proposition in plain language",
      "",
      "Raw data:",
      rawText,
    ].join("\n");

    return structuredLlm.invoke(prompt);
  }
}
