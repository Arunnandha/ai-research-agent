import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export interface MemorySignal {
  key: string;
  count: number;
}

export interface MemoryRecord {
  date: string;
  itemCount: number;
  trends: string[];
  gaps: string[];
  signals: MemorySignal[];
}

interface MemoryStoreData {
  records: MemoryRecord[];
}

interface MemoryComparableItem {
  category: string;
  business_model: string;
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const MEMORY_FILE_PATH = path.join(DATA_DIR, "memory.json");

const loadMemoryStore = async (): Promise<MemoryStoreData> => {
  try {
    const fileContent = await readFile(MEMORY_FILE_PATH, "utf8");
    const parsed = JSON.parse(fileContent) as MemoryStoreData;
    return { records: parsed.records ?? [] };
  } catch {
    return { records: [] };
  }
};

const saveMemoryStore = async (store: MemoryStoreData): Promise<void> => {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(MEMORY_FILE_PATH, JSON.stringify(store, null, 2), "utf8");
};

export const buildSignalsFromItems = (items: MemoryComparableItem[]): MemorySignal[] => {
  const counts = new Map<string, number>();

  for (const item of items) {
    const key = `${item.category} | ${item.business_model}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
};

export const getRecentMemoryRecords = async (days = 14): Promise<MemoryRecord[]> => {
  const store = await loadMemoryStore();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return store.records
    .filter((record) => {
      const date = new Date(record.date);
      return Number.isFinite(date.getTime()) && date >= cutoff;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const upsertDailyMemoryRecord = async (record: MemoryRecord): Promise<void> => {
  const store = await loadMemoryStore();
  const filtered = store.records.filter((entry) => entry.date !== record.date);
  await saveMemoryStore({
    records: [...filtered, record].sort((a, b) => a.date.localeCompare(b.date)),
  });
};

export interface SignalComparisonResult {
  emergingSignals: string[];
  historicalSummary: string[];
}

export const compareSignalsWithHistory = (
  todaySignals: MemorySignal[],
  history: MemoryRecord[],
): SignalComparisonResult => {
  if (history.length === 0) {
    return {
      emergingSignals: [],
      historicalSummary: ["No historical memory available yet."],
    };
  }

  const totals = new Map<string, number>();

  for (const record of history) {
    for (const signal of record.signals) {
      totals.set(signal.key, (totals.get(signal.key) ?? 0) + signal.count);
    }
  }

  const baselineDays = history.length;
  const emergingSignals: string[] = [];
  const historicalSummary: string[] = [];

  for (const signal of todaySignals) {
    const historicalAverage = (totals.get(signal.key) ?? 0) / baselineDays;
    const uplift = signal.count - historicalAverage;

    if (signal.count >= 2 && uplift >= 1) {
      emergingSignals.push(
        `${signal.key} appears to be emerging (today: ${signal.count}, avg: ${historicalAverage.toFixed(1)}).`,
      );
    }

    if (historicalAverage > 0) {
      historicalSummary.push(
        `${signal.key} -> today ${signal.count} vs historical avg ${historicalAverage.toFixed(1)}.`,
      );
    }
  }

  return { emergingSignals, historicalSummary };
};
