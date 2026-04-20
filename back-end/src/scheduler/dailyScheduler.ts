import "dotenv/config";

import cron from "node-cron";

import { runIntelligencePipeline } from "../agents/index.js";
import { log, saveDailyReport } from "../utils/index.js";

const CRON_EXPRESSION = "30 8 * * *";

const runScheduledPipeline = async (): Promise<void> => {
  try {
    log("info", "Starting scheduled intelligence pipeline run.");
    const report = await runIntelligencePipeline({ maxItems: 20 });
    const reportPath = await saveDailyReport(report, new Date());
    log("info", `Scheduled run completed. Report saved to ${reportPath}.`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown failure";
    log("error", `Scheduled pipeline run failed: ${message}`);
  }
};

export const startDailyScheduler = (): void => {
  cron.schedule(CRON_EXPRESSION, () => {
    void runScheduledPipeline();
  });

  log("info", "Daily scheduler active. Pipeline will run at 8:30 AM every day.");
};

startDailyScheduler();
