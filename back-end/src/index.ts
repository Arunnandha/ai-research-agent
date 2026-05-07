import "dotenv/config";

import express from "express";

import { runIntelligencePipeline } from "./agents/index.js";
import { log, saveDailyReport } from "./utils/index.js";

const REQUIRED_ENV_VARS = [
  "OPENAI_API_KEY",
  "PRODUCT_HUNT_ACCESS_TOKEN",
  "PRODUCT_HUNT_API_URL",
  "RSS_FEED_URLS",
] as const;

const validateEnv = (): void => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

const PORT = process.env.PORT ?? 3001;
const app = express();

app.use(express.json());
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (_req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.post("/api/run", async (_req, res) => {
  try {
    log("info", "Pipeline triggered via API.");
    const report = await runIntelligencePipeline({ maxItems: 12 });
    const reportPath = await saveDailyReport(report, new Date());
    log("info", `Pipeline completed. Report saved to ${reportPath}.`);
    res.json({ success: true, reportPath, itemCount: report.items.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown failure";
    log("error", `Pipeline failed: ${message}`);
    res.status(500).json({ success: false, error: message });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

validateEnv();

app.listen(PORT, () => {
  log("info", `Backend server running on http://localhost:${PORT}`);
});
