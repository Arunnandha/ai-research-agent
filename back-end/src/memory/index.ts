export {
  clusterItemsByEmbeddingSimilarity,
  type ClusterableItem,
  type SimilarityCluster,
} from "./clustering.js";

export {
  buildSignalsFromItems,
  compareSignalsWithHistory,
  getRecentMemoryRecords,
  upsertDailyMemoryRecord,
  type MemoryRecord,
  type MemorySignal,
  type SignalComparisonResult,
} from "./store.js";
