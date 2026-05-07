import { type StartupIdea } from "./ideaGeneratorAgent";
import { type InsightOutput } from "./insightAgent";
import { buildResearchGraph, type EnrichedItem } from "../graph";
import { buildSignalsFromItems, upsertDailyMemoryRecord } from "../memory";

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

  // Best-effort memory write — silently skipped on read-only filesystems (Vercel)
  upsertDailyMemoryRecord({
    date: new Date().toISOString().slice(0, 10),
    itemCount: state.enrichedItems.length,
    trends: state.insight.trends,
    gaps: state.insight.gaps,
    signals: buildSignalsFromItems(state.enrichedItems),
  }).catch(() => undefined);

  return {
    items: state.enrichedItems,
    insight: state.insight,
    ideas: state.ideas,
  };
};
