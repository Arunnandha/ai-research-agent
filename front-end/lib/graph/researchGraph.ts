import { Annotation, END, START, StateGraph } from "@langchain/langgraph";

import {
  ClassificationAgent,
  IdeaGeneratorAgent,
  InsightAgent,
  SummarizerAgent,
  type ClassificationOutput,
  type InsightOutput,
  type StartupIdea,
  type SummarizerOutput,
} from "../agents";
import {
  buildSignalsFromItems,
  clusterItemsByEmbeddingSimilarity,
  compareSignalsWithHistory,
  getRecentMemoryRecords,
} from "../memory";
import { aggregateIngestionData, type NormalizedSourceItem } from "../sources";

export interface SummarizedItem extends NormalizedSourceItem, SummarizerOutput {}
export interface EnrichedItem extends SummarizedItem, ClassificationOutput {}

export interface WorkflowState {
  maxItems: number;
  rawItems: NormalizedSourceItem[];
  summarizedItems: SummarizedItem[];
  enrichedItems: EnrichedItem[];
  insight: InsightOutput;
  ideas: StartupIdea[];
}

const WorkflowStateAnnotation = Annotation.Root({
  maxItems: Annotation<number>({
    reducer: (_left, right) => right,
    default: () => 20,
  }),
  rawItems: Annotation<NormalizedSourceItem[]>({
    reducer: (_left, right) => right,
    default: () => [],
  }),
  summarizedItems: Annotation<SummarizedItem[]>({
    reducer: (_left, right) => right,
    default: () => [],
  }),
  enrichedItems: Annotation<EnrichedItem[]>({
    reducer: (_left, right) => right,
    default: () => [],
  }),
  insight: Annotation<InsightOutput>({
    reducer: (_left, right) => right,
    default: () => ({
      trends: [],
      gaps: [],
      observations: [],
    }),
  }),
  ideas: Annotation<StartupIdea[]>({
    reducer: (_left, right) => right,
    default: () => [],
  }),
});

const ingestNode = async (state: WorkflowState): Promise<Partial<WorkflowState>> => {
  const data = await aggregateIngestionData();
  return {
    rawItems: data.slice(0, state.maxItems),
  };
};

const summarizeNode = async (state: WorkflowState): Promise<Partial<WorkflowState>> => {
  const summarizer = new SummarizerAgent();
  const summarizedItems = await Promise.all(
    state.rawItems.map(async (item): Promise<SummarizedItem> => {
      const summary = await summarizer.summarize(item);
      return { ...item, ...summary };
    }),
  );
  return { summarizedItems };
};

const classifyNode = async (state: WorkflowState): Promise<Partial<WorkflowState>> => {
  const classifier = new ClassificationAgent();
  const enrichedItems = await Promise.all(
    state.summarizedItems.map(async (item): Promise<EnrichedItem> => {
      const classification = await classifier.classify(item);
      return { ...item, ...classification };
    }),
  );
  return { enrichedItems };
};

const insightNode = async (state: WorkflowState): Promise<Partial<WorkflowState>> => {
  const insightAgent = new InsightAgent();
  const previousRecords = await getRecentMemoryRecords(21);
  const todaySignals = buildSignalsFromItems(state.enrichedItems);
  const comparison = compareSignalsWithHistory(todaySignals, previousRecords);
  const similarityClusters = await clusterItemsByEmbeddingSimilarity(
    state.enrichedItems.map((item) => ({
      title: item.title,
      description: item.description,
      category: item.category,
      problem: item.problem,
    })),
  );
  const insight = await insightAgent.analyze(state.enrichedItems, {
    previousRecords,
    historicalSummary: comparison.historicalSummary,
    emergingSignals: comparison.emergingSignals,
    similarityClusters,
  });
  return { insight };
};

const ideaNode = async (state: WorkflowState): Promise<Partial<WorkflowState>> => {
  const ideaAgent = new IdeaGeneratorAgent();
  const { ideas } = await ideaAgent.generate({
    trends: state.insight.trends,
    gaps: state.insight.gaps,
  });
  return { ideas };
};

export const buildResearchGraph = () =>
  new StateGraph(WorkflowStateAnnotation)
    .addNode("ingestion", ingestNode)
    .addNode("summarizer", summarizeNode)
    .addNode("classifier", classifyNode)
    .addNode("insightAnalyzer", insightNode)
    .addNode("ideaGenerator", ideaNode)
    .addEdge(START, "ingestion")
    .addEdge("ingestion", "summarizer")
    .addEdge("summarizer", "classifier")
    .addEdge("classifier", "insightAnalyzer")
    .addEdge("insightAnalyzer", "ideaGenerator")
    .addEdge("ideaGenerator", END)
    .compile();
