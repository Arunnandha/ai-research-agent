import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { REPORTS_DIR } from "./utils/paths";

export interface AgentReport {
  items: Array<{
    title: string;
    description: string;
    source: string;
    summary: string;
    problem: string;
    target_user: string;
    category: string;
    business_model: string;
    complexity: string;
  }>;
  insight: {
    trends: string[];
    gaps: string[];
    observations: string[];
  };
  ideas: Array<{
    name: string;
    description: string;
    target_user: string;
    mvp_features: string[];
    differentiation: string;
  }>;
}

const isJsonReport = (fileName: string): boolean => /^\d{4}-\d{2}-\d{2}\.json$/.test(fileName);

export const getReportList = async (): Promise<string[]> => {
  try {
    const files = await readdir(REPORTS_DIR);
    return files.filter(isJsonReport).sort().reverse();
  } catch {
    return [];
  }
};

export const getLatestReport = async (): Promise<{ date: string; data: AgentReport } | null> => {
  const reports = await getReportList();
  const latest = reports[0];

  if (!latest) {
    return null;
  }

  const fullPath = path.join(REPORTS_DIR, latest);
  const raw = await readFile(fullPath, "utf8");

  return {
    date: latest.replace(".json", ""),
    data: JSON.parse(raw) as AgentReport,
  };
};
