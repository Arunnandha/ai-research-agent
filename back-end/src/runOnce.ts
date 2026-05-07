import "dotenv/config";

import { runIntelligencePipeline } from "./agents/index.js";
import { log, saveDailyReport } from "./utils/index.js";

const run = async (): Promise<void> => {
  const report = await runIntelligencePipeline({ maxItems: 12 });
  const reportPath = await saveDailyReport(report, new Date());
  log("info", `Pipeline completed with ${report.items.length} enriched items. Report saved to ${reportPath}.`);
};

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown failure";
  log("error", `Agent execution failed: ${message}`);
  process.exit(1);
});
