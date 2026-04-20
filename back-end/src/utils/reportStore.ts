import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { IntelligenceReport } from "../agents/intelligencePipeline.js";

const REPORTS_DIR = path.join(process.cwd(), "reports");

const formatDate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

export const saveDailyReport = async (
  report: IntelligenceReport,
  runDate: Date = new Date(),
): Promise<string> => {
  await mkdir(REPORTS_DIR, { recursive: true });
  const date = formatDate(runDate);
  const reportPath = path.join(REPORTS_DIR, `${date}.json`);
  await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
  return reportPath;
};
