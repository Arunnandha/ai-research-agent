import "dotenv/config";

import { runIntelligencePipeline } from "./agents/index.js";
import { log } from "./utils/index.js";

const run = async (): Promise<void> => {
  const report = await runIntelligencePipeline({ maxItems: 12 });
  log("info", `Pipeline completed with ${report.items.length} enriched items.`);
  log("debug", JSON.stringify(report, null, 2));
};

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown failure";
  log("error", `Agent execution failed: ${message}`);
  process.exit(1);
});
