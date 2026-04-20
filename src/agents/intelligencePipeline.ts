import { type StartupIdea } from "./ideaGeneratorAgent.js";
import { type InsightOutput } from "./insightAgent.js";
import { buildResearchGraph, type EnrichedItem } from "../graph/index.js";
import { buildSignalsFromItems, upsertDailyMemoryRecord } from "../memory/index.js";

export interface EnrichedResearchItem extends EnrichedItem {}

export interface IntelligenceReport {
  items: EnrichedResearchItem[];
  insight: InsightOutput;
  ideas: StartupIdea[];
}

export interface IntelligencePipelineOptions {
  maxItems?: number;
}

export const runIntelligencePipeline = async (
  options: IntelligencePipelineOptions = {},
): Promise<IntelligenceReport> => {
  const graph = buildResearchGraph();
  const state = await graph.invoke({
    maxItems: options.maxItems ?? 20,
  });

  await upsertDailyMemoryRecord({
    date: new Date().toISOString().slice(0, 10),
    itemCount: state.enrichedItems.length,
    trends: state.insight.trends,
    gaps: state.insight.gaps,
    signals: buildSignalsFromItems(state.enrichedItems),
  });

  return {
    items: state.enrichedItems,
    insight: state.insight,
    ideas: state.ideas,
  };
};
